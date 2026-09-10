import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { usePortfolioData } from './usePortfolioData';
import { client } from '../client';
import { PROJECT_CACHE_KEY } from '../data/projects';
jest.mock('../client', () => ({ client: { fetch: jest.fn() } }));
let observe;
let refresh;
let resolveFetch;
beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, '', '/');
  global.IntersectionObserver = jest.fn((callback) => { observe = callback; return { observe: jest.fn(), disconnect: jest.fn() }; });
  window.requestIdleCallback = (callback) => { refresh = callback; return 1; };
  window.cancelIdleCallback = jest.fn();
  client.fetch.mockImplementation(() => new Promise((resolve) => { resolveFetch = resolve; }));
});
const View = () => {
  const portfolio = usePortfolioData();
  return <section id="work"><span data-testid="project">{portfolio.works[0].title}</span><span data-testid="profile">{portfolio.abouts[0].title}</span></section>;
};
test('late CMS data caches the next visit without shifting an encountered gallery', async () => {
  render(<View />);
  observe([{ isIntersecting: true }]);
  await act(async () => refresh());
  await act(async () => resolveFetch({ works: [{ _id: 'new', title: 'New project' }], abouts: [{ title: 'Changed profile' }] }));
  expect(screen.getByTestId('project').textContent).toBe('GitHired');
  expect(screen.getByTestId('profile').textContent).not.toBe('Changed profile');
  expect(JSON.parse(localStorage.getItem(PROJECT_CACHE_KEY)).works[0].title).toBe('New project');
});
test('published changes apply before the gallery is encountered', async () => {
  render(<View />);
  await act(async () => refresh());
  await act(async () => resolveFetch({ works: [{ _id: 'new', title: 'New project' }] }));
  expect(screen.getByTestId('project').textContent).toBe('New project');
});
