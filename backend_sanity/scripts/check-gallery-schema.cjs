const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createSchema } = require('sanity');

async function main() {
  const source = await fs.readFile(path.join(__dirname, '../schemas/works.js'), 'utf8');
  const { default: works } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  const schema = createSchema({ name: 'gallery-regression', types: [works] });
  const fields = schema.get('works').fields;
  async function validate(fieldName, value) {
    const type = fields.find((field) => field.name === fieldName).type;
    const context = { path: [fieldName], type, document: { _id: 'test', _type: 'works' }, i18n: { t: (key) => key } };
    return (await Promise.all(type.validation.map((rule) => rule.validate(value, context)))).flat();
  }
  for (const choice of ['lead', 'featured', 'standard']) assert.equal((await validate('presentation', choice)).length, 0, `${choice} must be valid`);
  assert.ok((await validate('presentation', 'invalid')).length, 'Unknown presentation must fail');
  for (const choice of ['cover', 'contain']) assert.equal((await validate('galleryFit', choice)).length, 0);
  assert.equal((await validate('displayOrder', 0)).length, 0);
  assert.ok((await validate('displayOrder', -1)).length);
  assert.ok((await validate('displayOrder', 1.5)).length);
  assert.equal(works.fields.find((field) => field.name === 'galleryFit').initialValue, 'cover');
  assert.equal(works.fields.find((field) => field.name === 'galleryVideo').type, 'file');
  console.log('Gallery schema passed: all presentation choices, fit choices/default, ordering constraints, video field.');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
