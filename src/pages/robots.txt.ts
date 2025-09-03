---
// src/pages/robots.txt.ts  (PRERENDERED)
import type { APIRoute } from "astro";
export const prerender = true;

const SITE = "https://blog.marlowgate.com";

export const GET: APIRoute = async () => {
  const body = [
    "User-agent: *",
    "Disallow: /drafts/",
    "Allow: /",
    `Sitemap: ${SITE}/sitemap.xml`
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};
