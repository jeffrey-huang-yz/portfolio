import React from 'react';

const PaperPanel = ({
  children,
  className = '',
  pageIndex = 0,
  totalPages = 5,
}) => (
  <div
    className={`paper-panel paper-panel--${pageIndex + 1} ${className}`.trim()}
  >
    <span className="paper-panel__scrap" aria-hidden="true">
      <span>{String(pageIndex + 1).padStart(2, '0')}</span>
    </span>
    <span className="paper-panel__tape paper-panel__tape--start" aria-hidden="true" />
    <span className="paper-panel__tape paper-panel__tape--end" aria-hidden="true" />
    <div className="paper-panel__content">{children}</div>
    <span className="paper-panel__folio" aria-hidden="true">
      scrap {String(pageIndex + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
    </span>
  </div>
);

export default PaperPanel;
