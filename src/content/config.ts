import { z, defineCollection } from 'astro:content';

// Blog collection schema with safe defaults
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().default('Untitled'),
    description: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    hero: z.string().optional()
  })
});

export const collections = { blog };
