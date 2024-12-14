import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: 'cnzg51pd', // Replace with your project ID
  dataset: 'production', // Replace with your dataset
  apiVersion: '2023-12-14', // Use today's date or the latest version
  useCdn: true, // Use `false` if you need fresh data
});

export default sanityClient;
