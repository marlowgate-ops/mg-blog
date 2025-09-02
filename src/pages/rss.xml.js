// src/pages/rss.xml.js
import { getCollection } from 'astro:content';

export const prerender = true;

// Use Cloudflare Pages env var SITE when set; fallback to blog subdomain
const SITE = (typeof process !== 'undefined' && process.env.SITE) || 'https://blog.marlowgate.com';

function escapeXml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  posts.sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate));

  const items = posts.map(({ slug, data }) => {
    const url = `${SITE}/blog/${slug}/`;
    const title = escapeXml(data.title);
    const description = escapeXml(data.description || '');
    const pubDate = new Date(data.pubDate).toUTCString();
    return `<item>
  <title>${title}</title>
  <link>${url}</link>
  <guid>${url}</guid>
  <pubDate>${pubDate}</pubDate>
  <description>${description}</description>
</item>`;
  }).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Marlow Gate Blog</title>
    <link>${SITE}/</link>
    <description>Updates and notes from Marlow Gate</description>
${items}
  </channel>
</rss>`;

  return new Response(rss, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
