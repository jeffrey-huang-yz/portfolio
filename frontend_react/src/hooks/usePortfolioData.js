import { useEffect, useState } from 'react';
import { client } from '../client';
import { fallbackPortfolio, portfolioQuery } from '../data/portfolio';

const localWorkByTitle = new Map(
  fallbackPortfolio.works.map((work) => [work.title, work]),
);

const mergeRemoteWorks = (works) => works.map((work) => {
  const localWork = localWorkByTitle.get(work.title);
  return localWork ? { ...localWork, ...work, imageSlug: localWork.imageSlug } : work;
});

const withFallback = (remoteData) => ({
  abouts: remoteData?.abouts?.length ? remoteData.abouts : fallbackPortfolio.abouts,
  works: remoteData?.works?.length
    ? mergeRemoteWorks(remoteData.works)
    : fallbackPortfolio.works,
  skills: remoteData?.skills?.length ? remoteData.skills : fallbackPortfolio.skills,
  experiences: remoteData?.experiences?.length
    ? remoteData.experiences
    : fallbackPortfolio.experiences,
});

export const usePortfolioData = () => {
  const [portfolio, setPortfolio] = useState(fallbackPortfolio);

  useEffect(() => {
    let isCurrent = true;

    client
      .fetch(portfolioQuery)
      .then((data) => {
        if (isCurrent) setPortfolio(withFallback(data));
      })
      .catch(() => {
        // The bundled snapshot is intentionally the offline and first-paint state.
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  return portfolio;
};
