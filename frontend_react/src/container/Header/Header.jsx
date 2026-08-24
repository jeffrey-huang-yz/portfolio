import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import profilePng from '../../assets/profile.png';
import profile480Avif from '../../assets/profile-480.avif';
import profile480Webp from '../../assets/profile-480.webp';
import profile720Avif from '../../assets/profile-720.avif';
import profile720Webp from '../../assets/profile-720.webp';
import profile1080Avif from '../../assets/profile-1080.avif';
import profile1080Webp from '../../assets/profile-1080.webp';
import { PaperPanel } from '../../component';
import './Header.scss';

const profilePanels = [
  {
    label: 'Overview',
    title: 'Build with the user in the room.',
    body: 'I care about the point where engineering decisions, brand character, and everyday usability meet.',
  },
  {
    label: 'Studies',
    title: 'Computer Engineering',
    body: 'University of Waterloo · focused on software development and the systems underneath polished interfaces.',
  },
  {
    label: 'Off-screen',
    title: 'Toronto, beyond the browser',
    body: 'Basketball, working out, fashion, and music keep the visual and human side of my work switched on.',
  },
];

const Header = () => {
  const [activePanel, setActivePanel] = useState(0);
  const tabRefs = useRef([]);
  const panel = profilePanels[activePanel];

  const handleTabKeyDown = (event, index) => {
    const lastIndex = profilePanels.length - 1;
    let nextIndex = index;

    if (event.key === 'ArrowRight') nextIndex = index === lastIndex ? 0 : index + 1;
    else if (event.key === 'ArrowLeft') nextIndex = index === 0 ? lastIndex : index - 1;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = lastIndex;
    else return;

    event.preventDefault();
    setActivePanel(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section id="home" className="hero-section" aria-labelledby="hero-title">
      <PaperPanel
        className="hero-scrap"
        pageIndex={0}
      >
        <div className="hero-section__grid">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">Jeffrey Huang · Frontend-minded engineer</p>
          <h1 id="hero-title">
            Interfaces should feel <em>obvious</em>—and a little <span>alive.</span>
          </h1>
          <p className="hero-copy__intro">
            I’m a Computer Engineering student at the University of Waterloo, building
            thoughtful digital products with user experience and brand in mind.
          </p>
          <div className="hero-copy__actions">
            <a className="button button--primary" href="#work">Explore selected work</a>
            <a className="text-link" href="mailto:j222huan@uwaterloo.ca">
              Start a conversation <span aria-hidden="true">↗</span>
            </a>
          </div>
          <ul className="hero-facts" aria-label="Quick facts">
            <li><span>Based</span>Toronto, Canada</li>
            <li><span>Focus</span>Frontend + product</li>
            <li><span>Mode</span>Curious, hands-on</li>
          </ul>
        </motion.div>

        <motion.div
          className="hero-portrait"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.56, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-portrait__field" aria-hidden="true">
            <span>make / test / refine</span>
          </div>
          <picture>
            <source
              type="image/avif"
              srcSet={`${profile480Avif} 480w, ${profile720Avif} 720w, ${profile1080Avif} 1080w`}
              sizes="(max-width: 720px) 88vw, (max-width: 1100px) 46vw, 520px"
            />
            <source
              type="image/webp"
              srcSet={`${profile480Webp} 480w, ${profile720Webp} 720w, ${profile1080Webp} 1080w`}
              sizes="(max-width: 720px) 88vw, (max-width: 1100px) 46vw, 520px"
            />
            <img
              src={profilePng}
              width="1080"
              height="1440"
              fetchPriority="high"
              alt="Jeffrey Huang wearing a navy suit"
            />
          </picture>
          <p className="hero-portrait__note">I like the details people feel before they notice.</p>
        </motion.div>
        </div>

        <div className="profile-ledger">
        <div className="profile-ledger__tabs" role="tablist" aria-label="About Jeffrey">
          {profilePanels.map(({ label }, index) => (
            <button
              ref={(element) => { tabRefs.current[index] = element; }}
              id={`profile-tab-${index}`}
              key={label}
              type="button"
              role="tab"
              aria-selected={activePanel === index}
              aria-controls="profile-panel"
              tabIndex={activePanel === index ? 0 : -1}
              onClick={() => setActivePanel(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {label}
            </button>
          ))}
        </div>
        <motion.div
          id="profile-panel"
          key={panel.label}
          className="profile-ledger__panel"
          role="tabpanel"
          aria-labelledby={`profile-tab-${activePanel}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h2>{panel.title}</h2>
          <p>{panel.body}</p>
        </motion.div>
        </div>
      </PaperPanel>
    </section>
  );
};

export default Header;
