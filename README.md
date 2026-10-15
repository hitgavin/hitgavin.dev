# gavinzhang.dev

Personal site. Astro, static output, deployed on Cloudflare Pages.

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # -> dist/
```

## Four content streams

Each lives in its own collection with its own schema, defined in
`src/content.config.ts`. They are separate on purpose: a once-a-fortnight essay
and a daily link share do not belong in the same chronological feed.

| Stream   | Directory              | What it is                                  |
| -------- | ---------------------- | ------------------------------------------- |
| `posts`  | `src/content/posts/`   | Long-form. Filed under exactly one series.  |
| `notes`  | `src/content/notes/`   | Short observations. No title; body is all.  |
| `links`  | `src/content/links/`   | Someone else's work, plus why it matters.   |
| `videos` | `src/content/videos/`  | Index of platform-hosted video.             |

Two feeds, deliberately: `/rss.xml` is everything, `/posts/rss.xml` is
long-form only, so people who subscribed for essays are not woken up by link
shares.

## Publishing is opt-in

`posts` default to `draft: true` in the schema. A post ships only when its
frontmatter says `draft: false`. Omitting the field keeps it private, so
nothing is published by accident.

Drafts render in `pnpm dev` and are excluded from `pnpm build`.

## Series

Three, defined in `src/consts.ts`. One post belongs to exactly one.

**Slugs are permanent** — they are in the URL. Display names are cheap to
change; edit `SERIES[id].name` and nothing breaks.

## Notes on the stack

- **Astro 7** ships Sätteri as the default Markdown processor, which has no
  math support. `astro.config.mjs` opts back into the remark/rehype pipeline
  via `unified()` from `@astrojs/markdown-remark`, because KaTeX is required
  for the control posts.
- `astro check` is dropped: it does not support TypeScript 7 and is being
  deprecated. `pnpm build` is the gate.

## Deploy

Cloudflare Pages, connected to this repo.

| Setting                | Value          |
| ---------------------- | -------------- |
| Framework preset       | Astro          |
| Build command          | `pnpm build`   |
| Build output directory | `dist`         |
| `NODE_VERSION`         | `22`           |

Update `site` in `astro.config.mjs` and `SITE.url` in `src/consts.ts` together
if the domain ever changes — the sitemap and both feeds read from them.
