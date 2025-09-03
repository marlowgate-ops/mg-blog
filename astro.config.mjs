import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://blog.marlowgate.com',   // ここが重要（絶対URL生成に必須）
  integrations: [mdx(), sitemap()],
})
