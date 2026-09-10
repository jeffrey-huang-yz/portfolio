import { useEffect, useState } from 'react';
import { fallbackPortfolio, portfolioQuery } from '../data/portfolio';
import { mergeRemoteWorks, normalizeWorks, readProjectCache, writeProjectCache } from '../data/projects';

const snapshot = { ...fallbackPortfolio, works: normalizeWorks(fallbackPortfolio.works) };
const initialPortfolio = () => {
  try { return { ...snapshot, works: readProjectCache(window.localStorage) || snapshot.works }; }
  catch { return snapshot; }
};
export const usePortfolioData = () => {
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  useEffect(() => {
    let isCurrent = true;
    let encountered = window.location.hash === '#work';
    const work = document.getElementById('work');
    const observer = new IntersectionObserver((entries) => { if (entries.some((entry) => entry.isIntersecting)) encountered = true; });
    if (work) observer.observe(work);
    const refreshPortfolio = () => {
      import('../client').then(({ client }) => client.fetch(portfolioQuery)).then((data) => {
        if (!isCurrent) return;
        const works = data?.works?.length ? mergeRemoteWorks(data.works, fallbackPortfolio.works) : null;
        if (works?.length) {
          try { writeProjectCache(window.localStorage, works); } catch { /* Private browsing fallback. */ }
        }
        setPortfolio((current) => encountered ? current : ({
          abouts: data?.abouts?.length ? data.abouts : current.abouts,
          skills: data?.skills?.length ? data.skills : current.skills,
          experiences: data?.experiences?.length ? data.experiences : current.experiences,
          // Also freeze preceding copy: changing its height would shift the encountered gallery.
          works: works?.length ? works : current.works,
        }));
      }).catch(() => { /* The bundled snapshot remains usable offline. */ });
    };
    const idle = 'requestIdleCallback' in window;
    const id = idle ? window.requestIdleCallback(refreshPortfolio, { timeout: 1600 }) : window.setTimeout(refreshPortfolio, 250);
    return () => { isCurrent = false; observer.disconnect(); if (idle) window.cancelIdleCallback(id); else window.clearTimeout(id); };
  }, []);
  return portfolio;
};
