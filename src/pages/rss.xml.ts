---
// src/pages/rss.xml.ts
// Minimal RSS 2.0 feed without @astrojs/rss dependency.
import type { APIRoute } from "astro";

const SITE = "https://blog.marlowgate.com";
const TITLE = "Marlow Gate Blog";
const DESCRIPTION = "Trading data & automation — notes, releases, and guides.";

type Entry = {
  url: string;
  title: string;
  pubDate?: string;
  description?: string;
};

export const GET: APIRoute = async () => {
  // Try to read markdown/MDX posts from common locations
  const posts = await Promise.all([
    Astro.glob("../../content/blog/*.{md,mdx}"),
    Astro.glob("../blog/*.{md,mdx}"),
  ]);

  const items: Entry[] = posts.flat()
    .filter((p: any) => p?.frontmatter?.draft !== true)
    .map((p: any) => ({
      url: SITE + (p.url || p.frontmatter?.url || "/"),
      title: p.frontmatter?.title || "Untitled",
      pubDate: p.frontmatter?.pubDate || p.frontmatter?.date,
      description: p.frontmatter?.description || ""
    }));

  const itemsXml = items.map((it) => `
    <item>
      <title>${escapeXml(it.title)}</title>
      <link>${it.url}</link>
      ${it.pubDate ? `<pubDate>${new Date(it.pubDate).toUTCString()}</pubDate>` : ""}
      ${it.description ? `<description>${escapeXml(it.description)}</description>` : ""}
      <guid>${it.url}</guid>
    </item>
  `).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(TITLE)}</title>
  <link>${SITE}/</link>
  <description>${escapeXml(DESCRIPTION)}</description>
  ${itemsXml}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" }
  });
};

function escapeXml(s?: string) {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}