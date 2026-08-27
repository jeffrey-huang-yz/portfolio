import {
  clampRouteProgress,
  getRouteProgress,
  getRouteScrollMetrics,
  ROUTE_START_VIEWPORT_RATIO,
} from './PaperJourney.utils';

describe('viewport-bounded route progress', () => {
  const geometry = {
    paperTop: 120,
    paperHeight: 8640,
    viewportHeight: 1000,
  };

  test('clamps progress to the complete 0–1 range', () => {
    expect(clampRouteProgress(-0.25)).toBe(0);
    expect(clampRouteProgress(0.45)).toBe(0.45);
    expect(clampRouteProgress(1.25)).toBe(1);
  });

  test('starts when the paper top reaches 64% of the viewport', () => {
    const metrics = getRouteScrollMetrics(geometry);

    expect(ROUTE_START_VIEWPORT_RATIO).toBe(0.64);
    expect(metrics.start).toBe(geometry.paperTop - geometry.viewportHeight * 0.64);
    expect(getRouteProgress(metrics.start, metrics)).toBe(0);
  });

  test('finishes exactly when the paper bottom reaches the viewport bottom', () => {
    const metrics = getRouteScrollMetrics(geometry);
    const contactTerminus = geometry.paperTop + geometry.paperHeight - geometry.viewportHeight;

    expect(metrics.finish).toBe(contactTerminus);
    expect(getRouteProgress(contactTerminus, metrics)).toBe(1);
    expect(getRouteProgress(contactTerminus + 500, metrics)).toBe(1);
  });

  test('retracts when scrolling upward', () => {
    const metrics = getRouteScrollMetrics(geometry);
    const lowerPosition = metrics.start + metrics.distance * 0.72;
    const upperPosition = metrics.start + metrics.distance * 0.31;

    expect(getRouteProgress(lowerPosition, metrics)).toBeCloseTo(0.72);
    expect(getRouteProgress(upperPosition, metrics)).toBeCloseTo(0.31);
    expect(getRouteProgress(upperPosition, metrics)).toBeLessThan(
      getRouteProgress(lowerPosition, metrics),
    );
  });
});
