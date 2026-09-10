import { act, renderHook } from '@testing-library/react';
import useHeroIntro, { heroFrame, useHeroReducedMotion } from './useHeroIntro';

const metrics = {
  runway: 600, left: 80, top: 180, width: 1200, height: 700,
  viewportWidth: 1360, viewportHeight: 900, openingY: -100, openingScale: 1.1,
};

test('opening paper covers the viewport, including negative overscroll', () => {
  const frame = heroFrame(-50, metrics);
  expect(frame).toMatchObject({ pin: 0, paperX: -80, paperY: -180, paperWidth: 1360, paperHeight: 900, decor: 0, hint: 1 });
});

test('landing matches the original panel exactly after the release blend', () => {
  const landed = heroFrame(672, metrics);
  expect(landed).toMatchObject({ pin: 600, paperX: -0, paperY: -0, paperWidth: 1200, paperHeight: 700, contentY: -0, contentScale: 1, decor: 1, hint: 0 });
  expect(heroFrame(900, metrics)).toEqual(landed);
});

test('scrolling back reverses continuously without stretching content', () => {
  const midpoint = heroFrame(300, metrics);
  expect(midpoint.paperWidth).toBe(1280);
  expect(midpoint.paperHeight).toBe(800);
  expect(midpoint.contentScale).toBeCloseTo(1.05);
  expect(heroFrame(0, metrics).contentScale).toBe(1.1);
});

test('a tall phone card still contracts vertically instead of growing on scroll', () => {
  const phone = { ...metrics, height: 950, viewportHeight: 844 };
  expect(heroFrame(0, phone).paperHeight).toBeGreaterThan(phone.height);
  expect(heroFrame(600, phone).paperHeight).toBe(phone.height);
});

test('reduced motion leaves the hero static without measuring or pinning a stage', () => {
  const { result, unmount } = renderHook(() => useHeroIntro(true));
  expect(result.current.pin.get()).toBe(0);
  expect(result.current.contentScale.get()).toBe(1);
  expect(result.current.decor.get()).toBe(1);
  expect(document.documentElement.classList.contains('hero-opening')).toBe(false);
  unmount();
});

test('motion preference changes update live and release the media listener', () => {
  const original = window.matchMedia;
  let notify;
  const query = { matches: false, addEventListener: jest.fn((_, callback) => { notify = callback; }), removeEventListener: jest.fn() };
  window.matchMedia = jest.fn(() => query);
  const { result, unmount } = renderHook(useHeroReducedMotion);
  expect(result.current).toBe(false);
  act(() => { query.matches = true; notify(); });
  expect(result.current).toBe(true);
  unmount();
  expect(query.removeEventListener).toHaveBeenCalledWith('change', notify);
  window.matchMedia = original;
});

test('a removed runway has a finite settled frame', () => {
  const frame = heroFrame(0, { ...metrics, runway: 0 });
  expect(frame.progress).toBe(1);
  expect(frame.contentScale).toBe(1);
  expect(frame.paperHeight).toBe(metrics.height);
});
