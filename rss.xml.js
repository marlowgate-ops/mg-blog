---
import { getCollection } from 'astro:content';
const site = 'https://marlowgate.com';
export async function GET() {
  const posts = (await getCollection('blog')).sort((a,b)=>+new Date(b.data.pubDate)-+new Date(a.data.pubDate));
  const items = posts.map(p => `
    <item>
      <title><![CDATA[${p.data.title}]]></title>
      <link>${site}/blog/${p.slug}/</link>
      <guid>${site}/blog/${p.slug}/</guid>
      <description><![CDATA[${p.data.description}]]></description>
      <pubDate>${new Date(p.data.pubDate).toUTCString()}</pubDate>
    </item>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0"><channel>
    <title>Marlow Gate Blog</title>
    <link>${site}/blog/</link>
    <description>Macro, calendars, automation.</description>
    ${items}
  </channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
