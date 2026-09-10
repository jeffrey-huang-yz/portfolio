import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ProjectMedia } from './Work';
let visibility;
beforeEach(() => {
  global.IntersectionObserver = jest.fn((callback) => { visibility = callback; return { observe: jest.fn(), disconnect: jest.fn() }; });
  jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());
const project = { _id: 'test', title: 'Video demo', imageSlug: 'portfolio', galleryVideo: {
  asset: { url: 'https://cdn.sanity.io/files/test/production/demo.mp4', mimeType: 'video/mp4' },
  description: 'An interface walkthrough', captions: { asset: { url: 'https://cdn.sanity.io/files/test/production/captions.vtt' } },
} };
test('uploaded video has user-controlled playback, poster, and cross-origin captions', () => {
  const { container } = render(<ProjectMedia project={project} rank="lead" />);
  const video = container.querySelector('video');
  expect(video.controls).toBe(true);
  expect(video.autoplay).toBe(false);
  expect(video.preload).toBe('none');
  expect(video.getAttribute('poster')).toBe('/project-images/portfolio-800.jpg');
  expect(video.style.objectFit).toBe('cover');
  expect(video.crossOrigin).toBe('anonymous');
  expect(video.querySelector('track').getAttribute('src')).toContain('captions.vtt');
  visibility([{ isIntersecting: false }]);
  expect(video.pause).toHaveBeenCalled();
});
test('a video load failure falls back to the image, respecting project-level fit', () => {
  const { container } = render(<ProjectMedia project={{ ...project, galleryFit: 'contain' }} rank="standard" />);
  fireEvent.error(container.querySelector('video'));
  expect(container.querySelector('video')).toBeNull();
  expect(container.querySelector('img').style.objectFit).toBe('contain');
});
