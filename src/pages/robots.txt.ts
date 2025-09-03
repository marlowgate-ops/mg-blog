export const prerender = true;

const SITE = "https://blog.marlowgate.com";

export async function GET() {
  const body = [
    "User-agent: *",
    "Disallow: /drafts/",
    "Allow: /",
    `Sitemap: ${SITE}/sitemap.xml`
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
