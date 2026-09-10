export const motionEase = [0.22, 1, 0.36, 1];
export const motionDuration = { hero: 0.78, detail: 0.52, menu: 0.2, filter: 0.2 };
export const detailViewport = { once: true, amount: 0.25, margin: '0px 0px -16% 0px' };

// Zero velocity and acceleration at both ends keep scroll reversals gentle.
export const easeScrollProgress = (value) => {
  const t = Math.max(0, Math.min(1, value));
  return Math.max(0, Math.min(1, t * t * t * (t * (t * 6 - 15) + 10)));
};

// Blend from pinned motion into normal document motion without an abrupt stop.
// The final offset stays exactly equal to the reserved scroll distance.
export const smoothPinnedDistance = (distance, limit) => {
  if (limit <= 0) return 0;
  const x = Math.max(0, distance);
  const blend = Math.min(80, limit * 0.12);
  if (x <= limit - blend) return x;
  if (x >= limit + blend) return limit;
  return limit - ((limit + blend - x) ** 2) / (4 * blend);
};
