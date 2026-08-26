import React from 'react';
import { PaperPanel } from '../../component';
import './Footer.scss';

const Footer = () => (
  <footer id="contact" className="contact-shell" aria-labelledby="contact-title">
    <PaperPanel
      className="contact-section"
      pageIndex={4}
    >
      <div className="contact-section__main">
        <p className="eyebrow">Contact / leave a note</p>
        <h2 id="contact-title">Have something thoughtful to build?</h2>
        <p>
          I’m always interested in frontend, product, and software work where craft and
          usefulness matter in equal measure.
        </p>
        <a className="contact-section__email" href="mailto:j222huan@uwaterloo.ca">
          j222huan@uwaterloo.ca <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="contact-section__details">
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
      </div>

      <div className="contact-section__foot">
        <p>© {new Date().getFullYear()} Jeffrey Huang</p>
        <a href="#home">Back to the beginning <span aria-hidden="true">↑</span></a>
      </div>
    </PaperPanel>
  </footer>
);

export default Footer;
