import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PaperPanel } from '../../component';
import './Footer.scss';

const detailViewport = { once: true, amount: 0.18, margin: '160px 0px 120px 0px' };
const detailTransition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

const Footer = () => {
  const reduceMotion = useReducedMotion();
  const revealFrom = (x, y) => (reduceMotion ? false : { opacity: 0, x, y });

  return (
    <footer id="contact" className="contact-shell" aria-labelledby="contact-title">
      <PaperPanel
        className="contact-section"
        pageIndex={4}
      >
        <motion.div
          className="contact-section__main"
          initial={revealFrom(-12, 10)}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={detailViewport}
          transition={detailTransition}
        >
        <p className="eyebrow">Contact / leave a note</p>
        <h2 id="contact-title">Have something thoughtful to build?</h2>
        <p>
          I’m always interested in frontend, product, and software work where craft and
          usefulness matter in equal measure.
        </p>
        <a className="contact-section__email" href="mailto:j222huan@uwaterloo.ca">
          j222huan@uwaterloo.ca <span aria-hidden="true">↗</span>
        </a>
        </motion.div>

        <motion.div
          className="contact-section__details"
          initial={revealFrom(12, 10)}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={detailViewport}
          transition={{ ...detailTransition, delay: 0.08 }}
        >
        <address>
          <span>Direct</span>
          <a href="tel:+16476393586">+1 647 639 3586</a>
          <span>Location</span>
          <p>Toronto, Canada</p>
        </address>
        <nav aria-label="Social links">
          <a href="https://www.linkedin.com/in/jeffrey-huang-yz" target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
          <a href="https://github.com/jeffrey-huang-yz" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          <a href="https://www.instagram.com/jeffrxyh/" target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
        </nav>
        </motion.div>

        <motion.div
          className="contact-section__foot"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={detailViewport}
          transition={{ duration: 0.42, delay: 0.14 }}
        >
          <p>© {new Date().getFullYear()} Jeffrey Huang</p>
          <a href="#home">Back to the beginning <span aria-hidden="true">↑</span></a>
        </motion.div>
      </PaperPanel>
    </footer>
  );
};

export default Footer;
