---
import { getCollection } from 'astro:content';

export const prerender = true;

const SITE = 'https://blog.marlowgate.com';

function esc(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

export async function GET() {
  const posts = (await getCollection('blog'))
    .filter(p => !(p.data?.draft === true))
    .sort((a,b) => new Date(b.data.pubDate ?? 0).getTime() - new Date(a.data.pubDate ?? 0).getTime());

  const items = posts.map(p => {
    const url = `${SITE}/blog/${p.slug}/`;
    const title = esc(p.data.title ?? p.slug);
    const desc = esc(p.data.description ?? '');
    const date = new Date(p.data.pubDate ?? Date.now()).toUTCString();
    return `<item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description><![CDATA[${p.data.description ?? ''}]]></description>
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Marlow Gate — Blog</title>
    <link>${SITE}/</link>
    <description>Latest articles and updates from Marlow Gate</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
  });
}
