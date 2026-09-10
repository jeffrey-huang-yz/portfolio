import { navigateTo } from './SmoothScroll';
jest.mock('lenis/react', () => ({ ReactLenis: ({ children }) => children, useLenis: () => undefined }), { virtual: true });
beforeEach(() => {
  document.body.innerHTML = '<section id="work">Projects</section>';
  window.matchMedia = jest.fn(() => ({ matches: false }));
  window.history.replaceState(null, '', '/');
});
test('hash navigation resizes Lenis, updates history and focuses only on arrival', () => {
  const lenis = { resize: jest.fn(), scrollTo: jest.fn() };
  navigateTo('#work', lenis);
  expect(lenis.resize).toHaveBeenCalled();
  expect(location.hash).toBe('#work');
  expect(document.activeElement.id).not.toBe('work');
  lenis.scrollTo.mock.calls[0][1].onComplete();
  expect(document.activeElement.id).toBe('work');
});
test('native fallback, reduced motion and skip navigation remain immediate', () => {
  const target = document.getElementById('work');
  target.scrollIntoView = jest.fn();
  window.matchMedia = () => ({ matches: true });
  navigateTo('#work', undefined);
  expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant' });
  expect(document.activeElement).toBe(target);
  const lenis = { resize: jest.fn(), scrollTo: jest.fn() };
  navigateTo('#work', lenis, { immediate: true, history: false });
  expect(lenis.scrollTo.mock.calls[0][1].immediate).toBe(true);
});
test('missing or malformed destinations do not change history', () => {
  navigateTo('#missing'); navigateTo('#%broken');
  expect(location.hash).toBe('');
});
