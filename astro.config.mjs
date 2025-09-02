// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Use CF Pages env SITE when provided (recommended), otherwise default
  site: process.env.SITE || 'https://blog.marlowgate.com',
  integrations: [mdx(), sitemap()],
});
