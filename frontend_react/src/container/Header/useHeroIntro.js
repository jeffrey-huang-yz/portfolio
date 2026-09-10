import { useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { useMotionValue, useScroll } from 'framer-motion';
import { easeScrollProgress, smoothPinnedDistance } from '../../motion';

const clamp = (value) => Math.max(0, Math.min(1, value));
const reducedQuery = '(prefers-reduced-motion: reduce)';
const subscribeReducedMotion = (notify) => {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
const reducedSnapshot = () => window.matchMedia(reducedQuery).matches;
export const useHeroReducedMotion = () => useSyncExternalStore(subscribeReducedMotion, reducedSnapshot, () => true);

// The paper and composition transform independently so the type never stretches.
export const heroFrame = (scroll, metrics) => {
  const progress = metrics.runway > 0 ? clamp(scroll / metrics.runway) : 1;
  const eased = easeScrollProgress(progress);
  const remaining = 1 - eased;
  return {
    pin: smoothPinnedDistance(scroll, metrics.runway),
    paperX: -metrics.left * remaining,
    paperY: -metrics.top * remaining,
    paperWidth: metrics.width + (metrics.viewportWidth - metrics.width) * remaining,
    paperHeight: metrics.height + (Math.max(metrics.viewportHeight, metrics.height + 64) - metrics.height) * remaining,
    contentY: metrics.openingY * remaining,
    contentScale: 1 + (metrics.openingScale - 1) * remaining,
    decor: easeScrollProgress(progress * 5 - 4),
    hint: 1 - easeScrollProgress(progress * 5),
    progress,
  };
};

export default function useHeroIntro(reduced) {
  const section = useRef(null);
  const stage = useRef(null);
  const content = useRef(null);
  const { scrollY } = useScroll();
  const pin = useMotionValue(0);
  const paperTransform = useMotionValue('none');
  const contentY = useMotionValue(0);
  const contentScale = useMotionValue(1);
  const decor = useMotionValue(1);
  const hint = useMotionValue(0);
  const hintY = useMotionValue(0);

  useLayoutEffect(() => {
    if (reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let metrics;
    let disposed = false;
    let opening = null;
    const sectionElement = section.current;
    const update = (scroll) => {
      if (!metrics) return;
      const frame = heroFrame(scroll, metrics);
      pin.set(frame.pin);
      paperTransform.set(`translate3d(${frame.paperX}px, ${frame.paperY}px, 0) scale(${frame.paperWidth}, ${frame.paperHeight})`);
      contentY.set(frame.contentY);
      contentScale.set(frame.contentScale);
      decor.set(frame.decor);
      hint.set(frame.hint);
      const nextOpening = frame.progress < 0.12;
      if (opening !== nextOpening) {
        document.documentElement.classList.toggle('hero-opening', nextOpening);
        opening = nextOpening;
      }
    };
    const measure = () => {
      if (disposed || !stage.current || !content.current) return;
      const panel = stage.current.querySelector('.hero-scrap');
      const rect = stage.current.getBoundingClientRect();
      const top = rect.top + window.scrollY - pin.get();
      const viewportHeight = window.innerHeight;
      const viewportWidth = document.documentElement.clientWidth;
      const openingScale = Math.min(1.12, (viewportWidth - 48) / content.current.offsetWidth, (viewportHeight - 112) / content.current.offsetHeight);
      const contentTop = panel.clientTop + parseFloat(getComputedStyle(panel).paddingTop);
      metrics = {
        top, left: rect.left, width: panel.offsetWidth, height: panel.offsetHeight,
        viewportHeight, viewportWidth,
        runway: parseFloat(getComputedStyle(section.current).paddingBottom),
        openingScale,
        openingY: (viewportHeight - content.current.offsetHeight * openingScale) / 2 - top - contentTop,
      };
      hintY.set(viewportHeight - top - 36);
      update(window.scrollY);
      section.current.dataset.introReady = 'true';
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage.current);
    observer.observe(content.current);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    const unsubscribe = scrollY.on('change', update);
    return () => {
      disposed = true;
      observer.disconnect();
      unsubscribe();
      window.removeEventListener('resize', measure);
      document.documentElement.classList.remove('hero-opening');
      delete sectionElement.dataset.introReady;
      pin.set(0); contentY.set(0); contentScale.set(1); decor.set(1); hint.set(0);
    };
  }, [reduced, scrollY, pin, paperTransform, contentY, contentScale, decor, hint, hintY]);

  return { section, stage, content, pin, paperTransform, contentY, contentScale, decor, hint, hintY };
}
