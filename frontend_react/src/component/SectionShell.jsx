import React from 'react';
import PaperPanel from './PaperPanel';

const SectionShell = ({
  id,
  eyebrow,
  headingVisual,
  title,
  intro,
  className = '',
  pageIndex,
  children,
}) => (
  <section
    id={id}
    className={`folio-section ${className}`.trim()}
    aria-labelledby={`${id}-title`}
  >
    <PaperPanel pageIndex={pageIndex}>
      <header className={`section-heading${eyebrow || headingVisual ? '' : ' section-heading--without-eyebrow'}`}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : headingVisual}
        <div>
          <h2 id={`${id}-title`}>{title}</h2>
          {intro ? <p className="section-intro">{intro}</p> : null}
        </div>
      </header>
      {children}
    </PaperPanel>
  </section>
);

export default SectionShell;
