import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().default(''),
    description: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    ogImage: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  })
});

export const collections = { blog };
