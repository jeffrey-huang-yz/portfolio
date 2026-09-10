import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { motionValue } from 'framer-motion';
import CapabilityStack, { stackFrame } from './CapabilityStack';

const mockScroll = motionValue(0);
const mockLenis = { resize: jest.fn(), scrollTo: jest.fn() };
jest.mock('framer-motion', () => ({ ...jest.requireActual('framer-motion'), useScroll: () => ({ scrollY: mockScroll }) }));
jest.mock('lenis/react', () => ({ useLenis: () => mockLenis }), { virtual: true });
const steps = [0, 400, 800].map((start) => ({ start, hold: 150, travel: 250 }));
const items = ['Frontend Development', 'UI/UX Design', 'Backend Development'].map((title) => ({ title, description: 'A readable description.' }));

test('all rows begin expanded and the first indicator is active', () => {
  expect(stackFrame(0, steps)).toEqual({ openness: [1, 1, 1], closed: 0, active: 0 });
  expect(stackFrame(150, steps).openness).toEqual([1, 1, 1]);
});
test('rows close sequentially and reverse when scrolling upward', () => {
  expect(stackFrame(275, steps).openness).toEqual([0.5, 1, 1]);
  expect(stackFrame(400, steps)).toEqual({ openness: [0, 1, 1], closed: 1, active: 1 });
  expect(stackFrame(800, steps)).toEqual({ openness: [0, 0, 1], closed: 2, active: 2 });
  expect(stackFrame(1200, steps)).toEqual({ openness: [0, 0, 0], closed: 3, active: -1 });
  expect(stackFrame(675, steps).openness).toEqual([0, 0.5, 1]);
});

beforeEach(() => {
  mockScroll.set(0);
  mockLenis.scrollTo.mockClear();
  window.matchMedia = jest.fn(() => ({ matches: false, addListener: jest.fn(), addEventListener: jest.fn(), removeEventListener: jest.fn() }));
  global.ResizeObserver = jest.fn(() => ({ observe: jest.fn(), disconnect: jest.fn() }));
  jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function () {
    if (this.classList.contains('stack-intro')) return 100;
    if (this.classList.contains('stack-card__title')) return 64;
    if (this.classList.contains('stack-card__content')) return 200;
    return 0;
  });
});
afterEach(() => jest.restoreAllMocks());
const visual = () => <svg aria-hidden="true" />;

test('collapse keeps the scroll track stable, updates detail visibility, and can reopen', () => {
  const { container } = render(<CapabilityStack items={items} reduced={false} renderVisual={visual} />);
  const height = container.querySelector('.stack-scene').style.height;
  expect(screen.getByRole('button', { name: '1. Frontend Development' }).getAttribute('aria-current')).toBe('step');
  act(() => mockScroll.set(10000));
  expect(container.querySelectorAll('.stack-card__detail[aria-hidden="true"]')).toHaveLength(3);
  expect(container.querySelector('.stack-scene').style.height).toBe(height);
  expect(container.querySelector('[aria-current="step"]')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: '2. UI/UX Design' }));
  expect(mockLenis.scrollTo).toHaveBeenCalledWith(expect.any(Number));
  act(() => mockScroll.set(0));
  expect(container.querySelectorAll('.stack-card__detail[aria-hidden="false"]')).toHaveLength(3);
});

test('switching to reduced motion restores full content and removes the scroll track', () => {
  const { container, rerender } = render(<CapabilityStack items={items} reduced={false} renderVisual={visual} />);
  act(() => mockScroll.set(10000));
  rerender(<CapabilityStack items={items} reduced renderVisual={visual} />);
  expect(container.querySelector('.stack-scene').style.height).toBe('');
  expect(container.querySelectorAll('.stack-card__detail[aria-hidden="true"]')).toHaveLength(0);
  expect(container.querySelectorAll('.stack-card__static-title')).toHaveLength(3);
});
