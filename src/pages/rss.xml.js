import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const site = context.site?.toString() || (import.meta.env.SITE ?? 'https://example.com');
  return rss({
    title: 'Marlow Gate Blog',
    description: 'Updates from Marlow Gate',
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug}/`,
    })),
  });
}
