// Verified against public Sanity asset references on 2026-09-05. Titles may change.
export const canonicalIds = {
  'git-hired': '36b04595-00fa-47e1-9d32-f0668f043a75',
  remembrance: '789f45b0-e37f-466b-9126-18144c592439',
  diskovery: '6d0ed864-ade6-4d29-9c52-ca99d9ae8248',
  portfolio: '63d14a57-6c08-4183-98ae-7d773dce6518',
  'exam-exporter': '8ef67241-8e6b-4df2-af78-45764351be2f',
  'guess-who': 'e3579e7c-45a2-49f9-b83a-72ed750ce5ba',
  'automatic-diffuser': 'e955c1f3-5aa5-484e-ada9-9197c7cf1286',
};
export const category = (tag) => {
  const value = String(tag).trim().toLowerCase();
  if (['website', 'web app'].includes(value)) return 'web app';
  if (['react js', 'react app', 'react'].includes(value)) return 'react app';
  return value;
};
export const imageRef = (image) => image?.asset?._ref;
export const mediaFit = (work) => (work.galleryFit ?? work.galleryImage?.fit) === 'contain' ? 'contain' : 'cover';
export const normalizeWorks = (works) => {
  const sorted = works.filter((work) => work && typeof work._id === 'string' && typeof work.title === 'string')
    .map((work) => ({
      ...work,
      _id: canonicalIds[work._id] || work._id,
      presentation: ['lead', 'featured', 'standard'].includes(work.presentation) ? work.presentation : 'standard',
      displayOrder: Number.isInteger(work.displayOrder) && work.displayOrder >= 0 ? work.displayOrder : null,
      tags: [...new Set((Array.isArray(work.tags) ? work.tags : []).map(category).filter((tag) => tag && tag !== 'all'))],
    })).sort((a, b) => (a.displayOrder ?? Infinity) - (b.displayOrder ?? Infinity) || a._id.localeCompare(b._id));
  let hasLead = false;
  return sorted.map((work) => {
    if (work.presentation !== 'lead') return work;
    if (hasLead) return { ...work, presentation: 'featured' };
    hasLead = true;
    return work;
  });
};
export const mergeRemoteWorks = (works, localWorks) => normalizeWorks(works.map((work) => {
  const local = localWorks.find((item) => (canonicalIds[item._id] || item._id) === work._id);
  const sameImage = local && imageRef(local.imgUrl) === imageRef(work.imgUrl);
  return { ...work,
    // Seed the approved launch selection until these existing records are curated in Studio.
    // Explicit CMS choices, including standard and zero, always win. Unknown legacy records stay standard.
    presentation: work.presentation ?? local?.presentation,
    displayOrder: work.displayOrder ?? local?.displayOrder,
    imageSlug: !imageRef(work.galleryImage) && sameImage && !work.imgUrl?.crop && !work.imgUrl?.hotspot ? local.imageSlug : undefined,
    fallbackImageSlug: local?.imageSlug };
}));
export const filterWorks = (works, filter) => filter === 'all' ? works : works.filter((work) => work.tags.includes(filter));
export const PROJECT_CACHE_KEY = 'portfolio-projects-v3';
export const readProjectCache = (storage) => {
  try {
    const cache = JSON.parse(storage.getItem(PROJECT_CACHE_KEY));
    if (cache?.version !== 3 || !Array.isArray(cache.works) || !cache.works.length || cache.works.some((item) => !item || typeof item._id !== 'string' || typeof item.title !== 'string')) return null;
    return normalizeWorks(cache.works);
  } catch { return null; }
};
export const writeProjectCache = (storage, works) => {
  try { storage.setItem(PROJECT_CACHE_KEY, JSON.stringify({ version: 3, works })); } catch { /* Storage is optional. */ }
};
