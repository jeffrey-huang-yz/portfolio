import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID || '1buankqm',
  dataset: 'production',
});
const imageWidths = [480, 800, 1200];

export const urlFor = (source) => builder.image(source);

export const getImageUrl = (source, width = 800, format) => {
  if (!source) return '';

  let image = builder.image(source).width(width).quality(82);
  if (format) image = image.format(format);

  return image.url();
};

export const getImageSrcSet = (source, format, widths = imageWidths) => {
  if (!source) return '';

  return widths
    .map((width) => `${getImageUrl(source, width, format)} ${width}w`)
    .join(', ');
};
