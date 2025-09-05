---
import { getCollection } from 'astro:content';

export const prerender = true;

const SITE = 'https://blog.marlowgate.com';
const CHANGEFREQ = 'daily';
const PER = 12;

function url(loc: string, lastmod?: string) {
  return `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}<changefreq>${CHANGEFREQ}</changefreq></url>`;
}

export async function GET() {
  const posts = (await getCollection('blog'))
    .filter(p => !(p.data?.draft === true))
    .sort((a,b) => new Date(b.data.pubDate ?? 0).getTime() - new Date(a.data.pubDate ?? 0).getTime());

  // home & blog index
  const urls: string[] = [
    url(`${SITE}/`),
    url(`${SITE}/blog/`),
    url(`${SITE}/about`),
    url(`${SITE}/rss.xml`),
  ];

  // paginated blog
  const totalPages = Math.max(1, Math.ceil(posts.length / PER));
  for (let i = 2; i <= totalPages; i++) {
    urls.push(url(`${SITE}/blog/page/${i}/`));
  }

  // tags
  const tagSet = new Set<string>();
  for (const p of posts) {
    const tags = Array.isArray(p.data.tags) ? p.data.tags : [];
    for (const t of tags) tagSet.add(String(t));
  }
  for (const t of tagSet) {
    urls.push(url(`${SITE}/tags/${encodeURIComponent(t)}/`));
  }

  // posts
  for (const p of posts) {
    const loc = `${SITE}/blog/${p.slug}/`;
    const mod = p.data.updatedDate ? new Date(p.data.updatedDate).toISOString() : undefined;
    urls.push(url(loc, mod));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
}
