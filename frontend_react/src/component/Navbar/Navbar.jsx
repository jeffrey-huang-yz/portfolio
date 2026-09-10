import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { navItems } from '../../data/portfolio';
import { navigateTo } from '../SmoothScroll';
import ThemeToggle from '../ThemeToggle';
import './Navbar.scss';
import { motionDuration } from '../../motion';

const NavLinks = ({ activeSection, onNavigate, mobile = false }) => (
  <ul className={mobile ? 'mobile-nav__links' : 'site-nav__links'}>
    {navItems.map(({ id, label }) => <li key={id}><a href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined} onClick={onNavigate}>{label}</a></li>)}
    <li><a className="resume-link" href="/JeffreyResume.pdf" target="_blank" rel="noreferrer" onClick={onNavigate}>Résumé <span aria-hidden="true">↗</span></a></li>
  </ul>
);

// Portal out of the filtered header, which otherwise contains fixed descendants.
const MenuLayer = ({ activeSection, close, closeRef, reduced }) => {
  const panel = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    const keyboard = (event) => {
      if (event.key === 'Escape') close();
      if (event.key !== 'Tab') return;
      const elements = panel.current?.querySelectorAll('a[href], button');
      const first = elements?.[0];
      const last = elements?.[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keyboard);
    return () => document.removeEventListener('keydown', keyboard);
  }, [close, closeRef]);
  return <m.div className="mobile-nav" id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Site navigation" ref={panel} data-lenis-prevent
    initial="closed" animate="open" exit="closed">
    <m.div className="mobile-nav__content" variants={{ closed: { opacity: 0, y: reduced ? 0 : 10 }, open: { opacity: 1, y: 0 } }} transition={{ duration: reduced ? 0 : motionDuration.menu }}>
      <div className="mobile-nav__topline"><button ref={closeRef} type="button" className="mobile-nav__close" onClick={() => close()} aria-label="Close navigation menu">×</button></div>
      <nav aria-label="Mobile navigation"><NavLinks activeSection={activeSection} mobile onNavigate={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const hash = event.currentTarget.getAttribute('href');
        if (hash.startsWith('#')) { event.preventDefault(); close(hash); } else close();
      }} /></nav>
    </m.div>
  </m.div>;
};

const Navbar = ({ activeSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const destination = useRef(null);
  const lenis = useLenis();
  const reduced = useReducedMotion();
  const close = useCallback((hash) => { destination.current = typeof hash === 'string' ? hash : null; setMenuOpen(false); }, []);
  useEffect(() => {
    if (!locked) return undefined;
    const root = document.getElementById('root');
    const previousInert = root.inert;
    const previousOverflow = document.body.style.overflow;
    root.inert = true;
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    return () => { root.inert = previousInert; document.body.style.overflow = previousOverflow; lenis?.start(); };
  }, [locked, lenis]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)');
    const resize = () => { if (desktop.matches) close(); };
    desktop.addEventListener('change', resize);
    return () => desktop.removeEventListener('change', resize);
  }, [close]);
  const finishClose = () => {
    setLocked(false);
    window.requestAnimationFrame(() => {
      if (destination.current) navigateTo(destination.current, lenis);
      else if (window.matchMedia('(max-width: 900px)').matches) menuButtonRef.current?.focus();
      else document.querySelector('.site-nav__links a[aria-current]')?.focus();
      destination.current = null;
    });
  };
  return <>
    <header className="site-header"><nav className="site-nav" aria-label="Primary navigation">
      <NavLinks activeSection={activeSection} />
      <div className="site-nav__actions"><ThemeToggle /><button ref={menuButtonRef} type="button" className="menu-button" aria-label="Open navigation menu" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => { setLocked(true); setMenuOpen(true); }}><span aria-hidden="true" /><span aria-hidden="true" /></button></div>
    </nav></header>
    {createPortal(<AnimatePresence onExitComplete={finishClose}>{menuOpen && <MenuLayer key="menu" activeSection={activeSection} close={close} closeRef={closeButtonRef} reduced={reduced} />}</AnimatePresence>, document.body)}
  </>;
};
export default Navbar;
