import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getImageSrcSet, getImageUrl } from '../../client';
import { SectionShell } from '../../component';
import './Work.scss';

const filters = ['all', 'web app', 'react app'];
const projectsHeading = (
  <span className="work-heading-word" aria-label="projects">
    {'projects'.split('').map((letter, index) => (
      <span key={`${letter}-${index}`} aria-hidden="true">{letter}</span>
    ))}
  </span>
);

const responsiveSizes = '(max-width: 720px) 92vw, (max-width: 1080px) 46vw, 31vw';
const localSrcSet = (slug, extension) => [480, 800, 1200]
  .map((width) => `/project-images/${slug}-${width}.${extension} ${width}w`)
  .join(', ');

const ProjectImage = ({ project }) => {
  if (project.imageSlug) {
    return (
      <picture>
        <source type="image/avif" srcSet={localSrcSet(project.imageSlug, 'avif')} />
        <source type="image/webp" srcSet={localSrcSet(project.imageSlug, 'webp')} />
        <img
          src={`/project-images/${project.imageSlug}-800.jpg`}
          srcSet={localSrcSet(project.imageSlug, 'jpg')}
          sizes={responsiveSizes}
          width="800"
          height="560"
          loading="lazy"
          decoding="async"
          alt={`${project.title} project preview`}
        />
      </picture>
    );
  }

  return (
    <picture>
      <source type="image/avif" srcSet={getImageSrcSet(project.imgUrl, 'avif')} />
      <source type="image/webp" srcSet={getImageSrcSet(project.imgUrl, 'webp')} />
      <img
        src={getImageUrl(project.imgUrl, 800)}
        srcSet={getImageSrcSet(project.imgUrl)}
        sizes={responsiveSizes}
        width="800"
        height="560"
        loading="lazy"
        decoding="async"
        alt={`${project.title} project preview`}
      />
    </picture>
  );
};

const Work = ({ works }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const reduceMotion = useReducedMotion();
  const filteredWorks = useMemo(
    () => activeFilter === 'All'
      ? works
      : works.filter((work) => work.tags?.includes(activeFilter)),
    [activeFilter, works],
  );

  return (
    <SectionShell
      id="work"
      title={projectsHeading}
      className="work-section"
      pageIndex={2}
    >
      <div className="work-filter" aria-label="Filter projects">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {filteredWorks.length} {filteredWorks.length === 1 ? 'project' : 'projects'} shown
      </p>

      <motion.div
        key={activeFilter}
        className="work-grid"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
      >
        {filteredWorks.map((work) => (
          <div
            className="project-card-reveal"
            key={work._id || work.title}
          >
            <article className="project-card">
              <div className="project-card__media">
                <ProjectImage project={work} />
                <ul className="project-card__tags" aria-label={`${work.title} categories`}>
                  {work.tags?.filter((tag) => tag !== 'All').map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </div>
              <div className="project-card__body">
                <h3>{work.title}</h3>
                <p>{work.description}</p>
                <div className="project-card__links">
                  {work.projectLink ? (
                    <a href={work.projectLink} target="_blank" rel="noreferrer">
                      Live project <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                  {work.codeLink ? (
                    <a href={work.codeLink} target="_blank" rel="noreferrer">
                      Source <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          </div>
        ))}
      </motion.div>
    </SectionShell>
  );
};

export default Work;
