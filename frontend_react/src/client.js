import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID || '1buankqm',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  maxRetries: 0,
});
