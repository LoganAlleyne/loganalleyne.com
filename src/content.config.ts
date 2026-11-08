import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    file: z.string(),
    summary: z.string(),
    order: z.number().int(),
    tags: z.array(z.string()).default([]),
    // Drafts render under `astro dev` only and never reach a production build.
    draft: z.boolean().default(true),
  }),
});

export const collections = { work };
