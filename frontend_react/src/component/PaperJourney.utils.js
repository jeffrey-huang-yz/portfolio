export const ROUTE_START_VIEWPORT_RATIO = 0.64;

export const clampRouteProgress = (value) => Math.min(1, Math.max(0, value));

export const getRouteScrollMetrics = ({
  paperTop,
  paperHeight,
  viewportHeight,
}) => {
  const start = paperTop - viewportHeight * ROUTE_START_VIEWPORT_RATIO;
  const finish = paperTop + paperHeight - viewportHeight;

  return {
    start,
    finish,
    distance: Math.max(1, finish - start),
  };
};

export const getRouteProgress = (scrollY, metrics) => {
  return clampRouteProgress((scrollY - metrics.start) / metrics.distance);
};
