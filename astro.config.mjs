import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: process.env.SITE || 'https://example.com',
  integrations: [mdx()],
  trailingSlash: 'ignore',
});
