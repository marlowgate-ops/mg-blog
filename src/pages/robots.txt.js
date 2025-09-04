export async function GET() {
  return new Response(
`User-agent: *
Allow: /
Sitemap: https://blog.marlowgate.com/rss.xml
Sitemap: https://blog.marlowgate.com/sitemap-index.xml
`, {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    }
  );
}
