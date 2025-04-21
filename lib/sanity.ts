import { createClient } from '@sanity/client'

export const client = createClient({
    projectId: '2313ve3c',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2023-01-01',
});

export default client;

