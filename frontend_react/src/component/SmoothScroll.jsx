import React, { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { frame, cancelFrame } from 'framer-motion';
import 'lenis/dist/lenis.css';

const options = { autoRaf: false, smoothWheel: true, syncTouch: false, lerp: 0.12, respectReducedMotion: true };
export const focusDestination = (target) => {
  if (!target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1');
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }
  target.focus({ preventScroll: true });
};
export const navigateTo = (hash, lenis, { history = true, immediate = false } = {}) => {
  let target;
  try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
  if (!target) return;
  if (history && window.location.hash !== hash) window.history.pushState(null, '', hash);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(target, { immediate: immediate || reduce, onComplete: () => focusDestination(target) });
  }
  else { target.scrollIntoView({ behavior: immediate || reduce ? 'instant' : 'smooth' }); focusDestination(target); }
};
const ScrollDriver = () => {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return undefined;
    const tick = ({ timestamp }) => lenis.raf(timestamp);
    frame.update(tick, true);
    return () => cancelFrame(tick);
  }, [lenis]);
  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest?.('a[href]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.search !== window.location.search || !url.hash) return;
      let target;
      try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
      if (!target) return;
      event.preventDefault();
      navigateTo(url.hash, lenis, { immediate: link.classList.contains('skip-link') });
    };
    const restore = () => navigateTo(window.location.hash || '#home', lenis, { history: false, immediate: true });
    const initial = window.requestAnimationFrame(() => { if (window.location.hash) restore(); });
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', restore);
    window.addEventListener('hashchange', restore);
    return () => {
      window.cancelAnimationFrame(initial);
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', restore);
      window.removeEventListener('hashchange', restore);
    };
  }, [lenis]);
  return null;
};
export default function SmoothScroll({ children }) {
  if (process.env.REACT_APP_SMOOTH_SCROLL === 'false') return <><ScrollDriver />{children}</>;
  return <ReactLenis root options={options}><ScrollDriver />{children}</ReactLenis>;
}
