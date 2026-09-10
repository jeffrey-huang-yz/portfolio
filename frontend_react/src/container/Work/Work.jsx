import React, { useMemo, useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { getImageSrcSet, getImageUrl } from '../../imageUrls';
import { filterWorks, mediaFit } from '../../data/projects';
import SectionShell from '../../component/SectionShell';
import './Work.scss';
import { motionDuration } from '../../motion';

const sizesFor = (rank) => rank === 'lead'
  ? '(max-width: 720px) calc(100vw - 72px), (max-width: 1472px) 82vw, 1200px'
  : rank === 'featured' ? '(max-width: 620px) calc(100vw - 72px), (max-width: 1472px) 39vw, 576px'
    : '(max-width: 620px) calc(100vw - 72px), (max-width: 980px) 39vw, (max-width: 1472px) 25vw, 368px';
const localSrcSet = (slug, extension, widths) => widths.map((width) => `/project-images/${slug}-${width}.${extension} ${width}w`).join(', ');

const ProjectImage = ({ project, rank }) => {
  const [failed, setFailed] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const slug = project.imageSlug || (failed ? project.fallbackImageSlug : null);
  const source = project.galleryImage?.asset ? project.galleryImage : project.imgUrl;
  const sizes = sizesFor(rank);
  const widths = rank === 'lead' ? [480, 800, 1200] : [480, 800];
  const fit = mediaFit(project);
  const ratio = rank === 'lead' ? 16 / 9 : 4 / 3;
  const srcSet = (format) => slug ? localSrcSet(slug, format === 'jpeg' ? 'jpg' : format, widths) : getImageSrcSet(source, format, widths, fit === 'cover' ? ratio : undefined);
  if (unavailable || (!slug && !source)) return <div className="project-image-unavailable">{project.title}<span>Preview unavailable</span></div>;
  return <picture key={slug || source?.asset?._ref}>
    <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
    <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
    <img src={slug ? `/project-images/${slug}-800.jpg` : getImageUrl(source, 800, 'jpg', fit === 'cover' ? ratio : undefined)} srcSet={srcSet('jpg')} sizes={sizes} width="800" height={Math.round(800 / ratio)} loading="lazy" decoding="async"
      style={{ objectFit: fit }} alt={project.galleryImage?.alt || `${project.title} project preview`} onError={() => { if (!failed && project.fallbackImageSlug) setFailed(true); else setUnavailable(true); }} />
  </picture>;
};
export const ProjectMedia = ({ project, rank }) => {
  const [videoFailed, setVideoFailed] = useState(false);
  const video = project.galleryVideo;
  const videoRef = React.useRef(null);
  React.useEffect(() => {
    const element = videoRef.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) element.pause(); });
    const pauseWhenHidden = () => { if (document.hidden) element.pause(); };
    observer.observe(element);
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', pauseWhenHidden); element.pause(); };
  }, [video?.asset?.url, videoFailed]);
  if (!video?.asset?.url || videoFailed) return <ProjectImage project={project} rank={rank} />;
  const poster = project.imageSlug ? `/project-images/${project.imageSlug}-800.jpg` : getImageUrl(project.galleryImage?.asset ? project.galleryImage : project.imgUrl, 800);
  return <video ref={videoRef} controls playsInline crossOrigin="anonymous" preload="none" poster={poster || undefined} aria-label={video.description || `${project.title} video demonstration`} style={{ objectFit: mediaFit(project) }} onError={() => setVideoFailed(true)}>
    <source src={video.asset.url} type={video.asset.mimeType || undefined} onError={() => setVideoFailed(true)} />
    {video.captions?.asset?.url && <track kind="captions" src={video.captions.asset.url} srcLang="en" label="English" default />}
    Your browser cannot play this video. <a href={video.asset.url}>Download the project video</a>.
  </video>;
};
const Work = ({ works }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const reduced = useReducedMotion();
  const filters = useMemo(() => ['all', ...new Set(works.flatMap((work) => work.tags || []))], [works]);
  const selected = filters.includes(activeFilter) ? activeFilter : 'all';
  const visible = filterWorks(works, selected);
  return <SectionShell id="work" title={<span className="work-heading-word">projects</span>} className="work-section" pageIndex={2}>
    <div className="work-toolbar"><div className="work-filter" role="group" aria-label="Filter projects">
      {filters.map((filter) => <button key={filter} type="button" aria-pressed={selected === filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
    </div><p className="work-count" aria-live="polite">{visible.length} {visible.length === 1 ? 'project' : 'projects'}</p></div>
    {['lead', 'featured', 'standard'].map((rank) => {
      const projects = visible.filter((work) => work.presentation === rank);
      return projects.length ? <div className={`work-grid work-grid--${rank}`} key={rank}>
        {projects.map((work, index) => <m.article className={`project-card project-card--${rank}`} key={work._id}
          initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: motionDuration.filter }}>
          <div className="project-card__media"><ProjectMedia key={`${work._id}-${work.galleryVideo?.asset?.url || work.galleryImage?.asset?._ref || work.imgUrl?.asset?._ref}`} project={work} rank={rank === 'featured' && projects.length % 2 && index === projects.length - 1 ? 'lead' : rank} /></div>
          <div className="project-card__body">
            <ul className="project-card__tags" aria-label={`${work.title} categories`}>{work.tags?.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            <h3>{work.title}</h3><p>{work.description}</p>
            {work.galleryVideo?.transcript && <details className="project-transcript"><summary>Video transcript / description</summary><p>{work.galleryVideo.transcript}</p></details>}
            <div className="project-card__links">
              {work.projectLink && <a href={work.projectLink} target="_blank" rel="noreferrer">Live project <span aria-hidden="true">↗</span></a>}
              {work.codeLink && <a href={work.codeLink} target="_blank" rel="noreferrer">Source <span aria-hidden="true">↗</span></a>}
            </div>
          </div>
        </m.article>)}
      </div> : null;
    })}
    {!visible.length && <p className="work-empty">No projects in this category. <button type="button" onClick={() => setActiveFilter('all')}>Show all projects</button></p>}
  </SectionShell>;
};
export default Work;
