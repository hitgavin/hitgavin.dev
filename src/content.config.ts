import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

import { SERIES_IDS } from "./consts";

const seriesEnum = z.enum(SERIES_IDS as [string, ...string[]]);

/** Long-form articles. The body of the site. */
const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    /** Used for meta tags, list pages and social cards. Write it deliberately. */
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    series: seriesEnum,
    tags: z.array(z.string()).default([]),
    /** Opt-in publishing: a post ships only when this is explicitly false. */
    draft: z.boolean().default(true),
  }),
});

/** Short observations. No title — the body is the whole thing. */
const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/** Link blog: someone else's work, plus why it is worth your time. */
const links = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/links" }),
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    /** Where it came from. Stating the source is the house style. */
    source: z.string().optional(),
    pubDate: z.coerce.date(),
  }),
});

/** Video index. Hosting stays on the platform; this is the catalogue. */
const videos = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/videos" }),
  schema: z.object({
    title: z.string(),
    platform: z.enum(["youtube", "bilibili"]),
    videoId: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
  }),
});

export const collections = { posts, notes, links, videos };
