import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// NOTE: No adapter needed for Cloudflare Pages static hosting.
// site is optional; set if you know the canonical origin.
export default defineConfig({
  integrations: [mdx()],
  experimental: {
    // Enable content collections in Astro v4 (already stable but kept explicit)
  },
});
