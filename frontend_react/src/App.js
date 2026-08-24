import React, { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { About, Footer, Header, Skills, Work } from './container';
import { JourneyRail, Navbar, PaperJourney } from './component';
import { navItems } from './data/portfolio';
import { usePortfolioData } from './hooks/usePortfolioData';
import './App.scss';

const App = () => {
  const portfolio = usePortfolioData();
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sections = navItems
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.2, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Navbar activeSection={activeSection} />
        <JourneyRail activeSection={activeSection} />
        <main id="main-content">
          <PaperJourney>
            <Header />
            <About abouts={portfolio.abouts} />
            <Work works={portfolio.works} />
            <Skills skills={portfolio.skills} experiences={portfolio.experiences} />
            <Footer />
          </PaperJourney>
        </main>
      </div>
    </MotionConfig>
  );
};

export default App;
