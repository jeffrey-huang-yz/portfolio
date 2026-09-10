import { canonicalIds, normalizeWorks, mergeRemoteWorks, filterWorks, readProjectCache, writeProjectCache, PROJECT_CACHE_KEY, mediaFit } from './projects';

const work = (id, values = {}) => ({ _id: id, title: id, ...values });
const img = (ref) => ({ asset: { _ref: ref } });
test('invalid and missing presentation stay standard; explicit zero sorts first', () => {
  expect(normalizeWorks([work('z'), work('a', { presentation: 'wrong', displayOrder: -1 }), work('b', { displayOrder: 0 })]).map((item) => [item._id, item.presentation])).toEqual([['b', 'standard'], ['a', 'standard'], ['z', 'standard']]);
});
test('one stable lead, with additional leads becoming featured before filtering', () => {
  const list = normalizeWorks([work('b', { presentation: 'lead', tags: ['React JS', 'All'] }), work('a', { presentation: 'lead', tags: ['Website'] })]);
  expect(list.map((item) => item.presentation)).toEqual(['lead', 'featured']);
  expect(filterWorks(list, 'react app')[0].presentation).toBe('featured');
  expect(filterWorks(list, 'all')).toHaveLength(2);
  expect(filterWorks(list, 'mobile app')).toEqual([]);
});
test('legacy tags normalize, deduplicate, and remove the all sentinel', () => {
  expect(normalizeWorks([work('a', { tags: ['Website', 'web app', 'React JS', 'All', 'UI/UX'] })])[0].tags).toEqual(['web app', 'react app', 'ui/ux']);
});
const local = [work('git-hired', { imageSlug: 'git-hired', imgUrl: img('original'), presentation: 'lead', displayOrder: 10 })];
test('canonical identity keeps local image when the title changes', () => {
  const merged = mergeRemoteWorks([work(canonicalIds['git-hired'], { title: 'Renamed', imgUrl: img('original') })], local)[0];
  expect(merged.imageSlug).toBe('git-hired');
  expect(merged.title).toBe('Renamed');
});
test('new CMS image and gallery override both take precedence over local assets', () => {
  for (const values of [{ imgUrl: img('new') }, { imgUrl: img('original'), galleryImage: img('gallery') }]) {
    const merged = mergeRemoteWorks([work(canonicalIds['git-hired'], values)], local)[0];
    expect(merged.imageSlug).toBeUndefined();
    expect(merged.fallbackImageSlug).toBe('git-hired');
  }
});
test('explicit CMS standard and zero override the launch selection', () => {
  const merged = mergeRemoteWorks([work(canonicalIds['git-hired'], { presentation: 'standard', displayOrder: 0 })], local)[0];
  expect(merged.presentation).toBe('standard');
  expect(merged.displayOrder).toBe(0);
});
test('storage corruption, old versions and unavailable storage retain a safe fallback', () => {
  const storage = { getItem: jest.fn(), setItem: jest.fn() };
  for (const value of ['broken', '{"version":1,"works":[]}', '{"version":2,"works":[null]}']) {
    storage.getItem.mockReturnValue(value);
    expect(readProjectCache(storage)).toBeNull();
  }
  storage.getItem.mockImplementation(() => { throw new Error('private'); });
  storage.setItem.mockImplementation(() => { throw new Error('quota'); });
  expect(readProjectCache(storage)).toBeNull();
  expect(() => writeProjectCache(storage, local)).not.toThrow();
});
test('versioned cache roundtrips normalized public project data', () => {
  const storage = { setItem: jest.fn(), getItem: jest.fn() };
  writeProjectCache(storage, local);
  expect(storage.setItem.mock.calls[0][0]).toBe(PROJECT_CACHE_KEY);
  storage.getItem.mockReturnValue(storage.setItem.mock.calls[0][1]);
  expect(readProjectCache(storage)[0]._id).toBe(canonicalIds['git-hired']);
});
test('fill-frame default is independent of image overrides, preserving an explicit legacy choice', () => {
  expect(mediaFit({})).toBe('cover');
  expect(mediaFit({ imgUrl: img('original'), galleryFit: 'contain' })).toBe('contain');
  expect(mediaFit({ galleryImage: { fit: 'contain' }, galleryFit: 'cover' })).toBe('cover');
  expect(mediaFit({ galleryImage: { fit: 'contain' } })).toBe('contain');
});
test('CMS crop changes on the same asset are not hidden behind a bundled image', () => {
  const merged = mergeRemoteWorks([work(canonicalIds['git-hired'], { imgUrl: { ...img('original'), crop: { left: 0.2 } } })], local)[0];
  expect(merged.imageSlug).toBeUndefined();
});
