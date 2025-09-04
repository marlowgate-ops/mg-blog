export async function GET() {
  return new Response(
`User-agent: *
Allow: /
Sitemap: https://blog.marlowgate.com/rss.xml
`, {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    }
  );
}
