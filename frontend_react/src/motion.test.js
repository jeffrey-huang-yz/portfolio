import { easeScrollProgress, smoothPinnedDistance } from './motion';

test('scroll easing is bounded, reversible and comes to rest at both ends', () => {
  expect(easeScrollProgress(-1)).toBe(0);
  expect(easeScrollProgress(2)).toBe(1);
  expect(easeScrollProgress(0.5)).toBe(0.5);
  expect(easeScrollProgress(0.001) / 0.001).toBeLessThan(0.001);
  expect((1 - easeScrollProgress(0.999)) / 0.001).toBeLessThan(0.001);
  let previous = 0;
  for (let i = 0; i <= 1000; i += 1) {
    const value = easeScrollProgress(i / 1000);
    expect(value).toBeGreaterThanOrEqual(previous);
    expect(value).toBeLessThanOrEqual(1);
    expect(value + easeScrollProgress(1 - i / 1000)).toBeCloseTo(1);
    previous = value;
  }
});

test('release preserves the final layout offset with continuous velocity and no overshoot', () => {
  const pin = (x) => smoothPinnedDistance(x, 600);
  expect(pin(-10)).toBe(0);
  expect(pin(528)).toBe(528);
  expect(pin(600)).toBe(582);
  expect(pin(672)).toBe(600);
  expect(pin(900)).toBe(600);
  expect((pin(528.01) - pin(528)) / 0.01).toBeCloseTo(1, 3);
  expect((pin(672) - pin(671.99)) / 0.01).toBeLessThan(0.001);
  for (let x = 0; x <= 800; x += 1) {
    expect(pin(x)).toBeLessThanOrEqual(Math.min(x, 600));
    expect(pin(x)).toBeGreaterThanOrEqual(pin(x - 1));
  }
  expect(smoothPinnedDistance(100, 0)).toBe(0);
});
