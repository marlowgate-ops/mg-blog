---
// src/pages/sitemap.xml.ts
// Lightweight sitemap generator without plugins.
// It includes top-level pages and Markdown/MDX posts under /src/content or /src/pages/blog.
// Update SITE to your blog origin.
import type { APIRoute } from "astro";

const SITE = "https://blog.marlowgate.com";

// Utility to build a URL entry
function url(loc: string, lastmod?: string) {
  return `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
}

export const GET: APIRoute = async () => {
  // Discover common content globs (adjust if your structure differs)
  const pageFiles = await Promise.all([
    Astro.glob("../**/*.astro"),
    Astro.glob("../**/*.md"),
    Astro.glob("../**/*.mdx"),
    Astro.glob("../../content/**/*.md"),
    Astro.glob("../../content/**/*.mdx"),
  ]);

  // Known top-level routes you likely have (adjust as needed)
  const staticRoutes = ["/", "/about/", "/store/"].map((p) => `${SITE}${p}`);

  // Derive routes from file paths (naive mapping; skip private/draft)
  const dynamic = pageFiles
    .flat()
    .map((f: any) => {
      const url = f?.url || f?.frontmatter?.url;
      const draft = f?.frontmatter?.draft === true;
      if (draft) return null;
      if (url) return `${SITE}${url}`;
      // Try to infer from file pathname if url missing
      const inferred = (f?.file || f?.filepath || "").toString();
      if (!inferred) return null;
      // heuristic: files under /pages/ map to their route; index.astro -> /
      const m = inferred.replace(/\\/g, "/").split("/pages/")[1];
      if (!m) return null;
      let route = "/" + m;
      route = route.replace(/index\.(astro|md|mdx)$/, "");
      route = route.replace(/\.(astro|md|mdx)$/, "");
      if (!route.endsWith("/")) route += "/";
      // Ignore drafts folder
      if (route.startsWith("/drafts/")) return null;
      return `${SITE}${route}`;
    })
    .filter(Boolean);

  const urls = Array.from(new Set([...staticRoutes, ...dynamic]))
    .sort()
    .map((u) => url(u as string))
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
};