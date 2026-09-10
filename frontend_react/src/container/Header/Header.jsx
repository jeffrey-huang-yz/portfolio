import React, { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import asciiPortraitUrl from '../../assets/profile-ascii.txt';
import { PaperPanel } from '../../component';
import { motionEase, motionDuration } from '../../motion';
import './Header.scss';
import useHeroIntro, { useHeroReducedMotion } from './useHeroIntro';

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
      delayChildren: 0.16,
      staggerChildren: 0.12,
    },
  },
};

const heroRise = {
  hidden: { opacity: 0, y: 18, x: -6 },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { duration: motionDuration.hero, ease: motionEase },
  },
};

const portraitRegister = {
  hidden: { opacity: 0, x: 18, y: 16, rotate: -4, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.9, ease: motionEase },
  },
};

const Header = () => {
  const [asciiPortrait, setAsciiPortrait] = useState('');
  const reduceMotion = useHeroReducedMotion();
  const intro = useHeroIntro(reduceMotion);

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
    <section ref={intro.section} id="home" className={`hero-section${reduceMotion ? '' : ' hero-intro'}`} aria-labelledby="hero-title">
      <m.div ref={intro.stage} className="hero-stage" transformTemplate={(_, transform) => !transform || transform === 'none' ? 'translate3d(0, 0, 0)' : transform} style={{ y: intro.pin, '--hero-pin': intro.pin, '--hero-decor': intro.decor }}>
      {!reduceMotion && <m.div className="hero-intro__paper" aria-hidden="true" style={{ transform: intro.paperTransform }} />}
      <PaperPanel className="hero-scrap" pageIndex={0}>
        <m.div ref={intro.content} className="hero-intro__placement" style={{ y: intro.contentY, scale: intro.contentScale }}>
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
          <m.div className="hero-actions" variants={heroRise}>
            <a href="#work">explore the projects <span aria-hidden="true">↓</span></a>
            <a href="#contact">get in touch <span aria-hidden="true">↗</span></a>
          </m.div>
        </m.div>
        </m.div>
      </PaperPanel>
      {!reduceMotion && <m.p className="hero-intro__hint" aria-hidden="true" style={{ y: intro.hintY, opacity: intro.hint }}>scroll to enter <span>↓</span></m.p>}
      </m.div>
    </section>
  );
};

export default Header;
