import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.string().or(z.date()).optional(),
    author: z.string().default('Marlow Gate'),
    draft: z.boolean().default(false)
  })
});

export const collections = { blog };
