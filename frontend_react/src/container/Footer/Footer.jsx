import React from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { PaperPanel } from '../../component';
import './Footer.scss';

const detailViewport = { once: true, amount: 0.25, margin: '0px 0px -16% 0px' };
const detailTransition = { duration: 0.62, ease: [0.22, 1, 0.36, 1] };

const Footer = () => {
  const reduceMotion = useReducedMotion();
  const revealFrom = (x, y) => (reduceMotion ? false : { opacity: 0, x, y });

  return (
    <footer id="contact" className="contact-shell" aria-labelledby="contact-title">
      <PaperPanel
        className="contact-section"
        pageIndex={4}
      >
        <m.div
          className="contact-section__main"
          initial={revealFrom(-12, 10)}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={detailViewport}
          transition={detailTransition}
        >
          <h2 id="contact-title">let&apos;s connect!</h2>
          <p>
            i&apos;m always down to meet new people and talk about work, hobbies, or anything else
          </p>
          <a className="contact-section__email" href="mailto:j222huan@uwaterloo.ca">
            j222huan@uwaterloo.ca <span aria-hidden="true">↗</span>
          </a>
        </m.div>

        <m.div
          className="contact-section__details"
          initial={revealFrom(12, 10)}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={detailViewport}
          transition={{ ...detailTransition, delay: 0.08 }}
        >
          <span className="contact-section__stamp" aria-hidden="true">
            <span>JH</span>
            <span>05 · CA</span>
          </span>
          <address>
            <span>From</span>
            <p>Jeffrey Huang</p>
            <span>Location</span>
            <p>Toronto, Canada</p>
          </address>
          <nav aria-label="Social links">
            <a href="https://www.linkedin.com/in/jeffrey-huang-yz" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
            <a href="https://github.com/jeffrey-huang-yz" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            <a href="https://www.instagram.com/jeffrxyh/" target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
          </nav>
        </m.div>

        <m.div
          className="contact-section__foot"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={detailViewport}
          transition={{ duration: 0.52, delay: 0.14 }}
        >
          <p>© {new Date().getFullYear()} jeffrey huang</p>
          <a href="#home">back to the beginning <span aria-hidden="true">↑</span></a>
        </m.div>
      </PaperPanel>
    </footer>
  );
};

export default Footer;
