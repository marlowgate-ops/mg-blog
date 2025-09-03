export const prerender = true;

const SITE = "https://blog.marlowgate.com";

function urlEntry(loc, lastmod) {
  return `<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
}

export async function GET() {
  const pages = await Promise.all([
    Astro.glob("../**/*.astro"),
    Astro.glob("../**/*.{md,mdx}"),
    Astro.glob("../../content/**/*.{md,mdx}")
  ]);

  const staticRoutes = ["/", "/about/", "/store/"].map((p) => `${SITE}${p}`);

  const dynamic = pages
    .flat()
    .map((f) => {
      const draft = f?.frontmatter?.draft === true;
      if (draft) return null;
      if (f?.url) return SITE + f.url;
      const fp = (f?.file || f?.filepath || "").toString().replace(/\\/g, "/");
      if (!fp.includes("/pages/")) return null;
      let route = "/" + fp.split("/pages/")[1];
      route = route.replace(/index\.(astro|md|mdx)$/i, "");
      route = route.replace(/\.(astro|md|mdx)$/i, "");
      if (!route.endsWith("/")) route += "/";
      if (route.startsWith("/drafts/")) return null;
      return SITE + route;
    })
    .filter(Boolean);

  const urls = Array.from(new Set([...staticRoutes, ...dynamic]))
    .sort()
    .map((u) => urlEntry(u))
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
}
