import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { navItems } from '../../data/portfolio';
import ThemeToggle from '../ThemeToggle';
import './Navbar.scss';

const NavLinks = ({ activeSection, onNavigate, mobile = false }) => (
  <ul className={mobile ? 'mobile-nav__links' : 'site-nav__links'}>
    {navItems.map(({ id, label }) => (
      <li key={id}>
        <a
          href={`#${id}`}
          aria-current={activeSection === id ? 'location' : undefined}
          onClick={onNavigate}
        >
          {label}
        </a>
      </li>
    ))}
    <li>
      <a
        className="resume-link"
        href="/JeffreyResume.pdf"
        target="_blank"
        rel="noreferrer"
        onClick={onNavigate}
      >
        Résumé <span aria-hidden="true">↗</span>
      </a>
    </li>
  </ul>
);

const Navbar = ({ activeSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const mobileNavRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key === 'Tab') {
        const focusable = mobileNavRef.current?.querySelectorAll('a[href], button:not([disabled])');
        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <a className="site-nav__brand" href="#home" aria-label="Jeffrey Huang, home">
          <span>JH</span><i aria-hidden="true">.</i>
        </a>

        <NavLinks activeSection={activeSection} />

        <div className="site-nav__actions">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            className="menu-button"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(true)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <motion.div
          ref={mobileNavRef}
          id="mobile-navigation"
          className="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 28 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mobile-nav__topline">
            <span className="eyebrow">Jump to a page</span>
            <button
              ref={closeButtonRef}
              type="button"
              className="mobile-nav__close"
              onClick={closeMenu}
              aria-label="Close navigation menu"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            <NavLinks activeSection={activeSection} onNavigate={closeMenu} mobile />
          </nav>
        </motion.div>
      ) : null}
    </header>
  );
};

export default Navbar;
