---
// src/pages/robots.txt.ts
// Generates robots.txt at build time. Adjust allow/disallow as needed.
import type { APIRoute } from "astro";

const SITE = "https://blog.marlowgate.com";

export const GET: APIRoute = async () => {
  const body = [
    "User-agent: *",
    "Disallow: /drafts/",
    "Allow: /",
    `Sitemap: ${SITE}/sitemap.xml`
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};