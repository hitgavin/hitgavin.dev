// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  // Keep in sync with SITE.url in src/consts.ts.
  site: "https://hitgavin.dev",
  integrations: [mdx(), sitemap()],
  markdown: {
    // Astro 7 ships Sätteri as the default Markdown processor, and it has no
    // math support. The remark/rehype pipeline is still available opt-in, and
    // KaTeX is non-negotiable for the control posts.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: { theme: "github-dark-dimmed", wrap: true },
  },
});
