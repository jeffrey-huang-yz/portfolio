import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'framer-motion';
import InterestRebus from './InterestRebus';

const mount = () => render(<LazyMotion features={domAnimation}><InterestRebus reduced /></LazyMotion>);

test('the rebus exposes one complete sentence without duplicate image announcements', () => {
  const { container } = mount();
  const sentence = screen.getByText('away from the keyboard, you’ll find me playing basketball, lifting weights, exploring fashion, listening to music, or collecting pokémon trading cards.');
  expect(sentence.closest('[aria-hidden="true"]')).toBeNull();
  expect(screen.queryAllByRole('img')).toHaveLength(0);
  expect(container.querySelectorAll('.interest-rebus__sentence[aria-hidden="true"] img')).toHaveLength(5);
  expect(container.querySelector('.interest-rebus__sentence').style.opacity).not.toBe('0');
});

test('failed images become readable words without changing their reserved slot', () => {
  const { container } = mount();
  const slot = container.querySelector('.interest-rebus__cutout--basketball');
  const dimensions = slot.getAttribute('style');
  fireEvent.error(slot.querySelector('img'));
  expect(slot.textContent).toBe('basketball');
  expect(slot.querySelector('img')).toBeNull();
  expect(slot.getAttribute('style')).toBe(dimensions);
  expect(container.querySelectorAll('.interest-rebus__sentence img')).toHaveLength(4);
});
