// Read-only: produces a proposed seed report and never calls a mutation API.
const { createClient } = require('@sanity/client');
const choices = {
  '36b04595-00fa-47e1-9d32-f0668f043a75': { presentation: 'lead', displayOrder: 10 },
  '789f45b0-e37f-466b-9126-18144c592439': { presentation: 'featured', displayOrder: 20 },
  '6d0ed864-ade6-4d29-9c52-ca99d9ae8248': { presentation: 'featured', displayOrder: 30 },
  '63d14a57-6c08-4183-98ae-7d773dce6518': { presentation: 'standard', displayOrder: 40 },
};
const client = createClient({ projectId: '1buankqm', dataset: 'production', apiVersion: '2021-10-21', useCdn: false });
client.fetch('*[_type == "works"] | order(_id asc) {_id,title,presentation,displayOrder,galleryFit,"hasVideo":defined(galleryVideo.asset)}').then((works) => {
  console.log(JSON.stringify({ mode: 'read-only dry run', generatedAt: new Date().toISOString(), projects: works.map((work) => ({
    ...work,
    proposed: {
      presentation: work.presentation ?? choices[work._id]?.presentation ?? 'standard',
      displayOrder: work.displayOrder ?? choices[work._id]?.displayOrder ?? null,
      galleryFit: work.galleryFit ?? 'cover',
    },
  })) }, null, 2));
}).catch((error) => { console.error(error.message); process.exitCode = 1; });
