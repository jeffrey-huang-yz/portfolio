import React, { useEffect, useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import asciiPortraitUrl from '../../assets/profile-ascii.txt';
import { PaperPanel } from '../../component';
import './Header.scss';

const heroPointColumns = [
  {
    label: 'Professional focus',
    points: [
      'software developer and enthusiast',
      'frontend / fullstack / product / qa',
    ],
  },
  {
    label: 'Education and location',
    points: [
      'computer engineering student',
      'university of waterloo',
      'toronto, ontario',
    ],
  },
];

const heroSequence = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.1,
    },
  },
};

const heroRise = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
  },
};

const portraitRegister = {
  hidden: { opacity: 0, x: 18, y: 10 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

const Header = () => {
  const [asciiPortrait, setAsciiPortrait] = useState('');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();

    fetch(asciiPortraitUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load ASCII portrait');
        return response.text();
      })
      .then(setAsciiPortrait)
      .catch((error) => {
        if (error.name !== 'AbortError') setAsciiPortrait('');
      });

    return () => controller.abort();
  }, []);

  return (
    <section id="home" className="hero-section" aria-labelledby="hero-title">
      <PaperPanel className="hero-scrap" pageIndex={0}>
        <m.div
          className="hero-composition"
          variants={heroSequence}
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
        >
          <m.div className="hero-masthead" variants={heroSequence}>
            <m.h1 id="hero-title" variants={heroSequence}>
              <m.span className="hero-masthead__first-name" variants={heroRise}>
                Jeffrey
              </m.span>
              <m.em className="hero-masthead__last-name" variants={heroRise}>
                Huang
              </m.em>
            </m.h1>

            <m.div className="hero-ascii-reveal" variants={portraitRegister}>
              <figure className="hero-ascii" aria-label="ASCII portrait of Jeffrey Huang">
                <div className="hero-ascii__viewport">
                  <pre aria-hidden="true">{asciiPortrait}</pre>
                </div>
              </figure>
            </m.div>
          </m.div>

          <m.div
            className="hero-points"
            aria-label="Profile summary"
            variants={heroSequence}
          >
            {heroPointColumns.map(({ label, points }) => (
              <m.ul key={label} aria-label={label} variants={heroRise}>
                {points.map((point) => <li key={point}>{point}</li>)}
              </m.ul>
            ))}
          </m.div>
        </m.div>
      </PaperPanel>
    </section>
  );
};

export default Header;
