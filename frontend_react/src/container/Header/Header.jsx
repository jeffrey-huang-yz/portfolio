import React, { useEffect, useState } from 'react';
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

const Header = () => {
  const [asciiPortrait, setAsciiPortrait] = useState('');

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
        <div className="hero-composition">
          <div className="hero-masthead">
            <h1 id="hero-title">
              <span className="hero-masthead__first-name">
                Jeffrey
              </span>
              <em className="hero-masthead__last-name">
                Huang
              </em>
            </h1>

            <div className="hero-ascii-reveal">
              <figure className="hero-ascii" aria-label="ASCII portrait of Jeffrey Huang">
                <div className="hero-ascii__viewport">
                  <pre aria-hidden="true">{asciiPortrait}</pre>
                </div>
                <figcaption>self portrait / 119 × 73 characters</figcaption>
              </figure>
            </div>
          </div>

          <div
            className="hero-points"
            aria-label="Profile summary"
          >
            {heroPointColumns.map(({ label, points }) => (
              <ul key={label} aria-label={label}>
                {points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            ))}
          </div>
        </div>
      </PaperPanel>
    </section>
  );
};

export default Header;
