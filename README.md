# hitgavin.dev

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

## The subscriber list is not in this repository

This is worth being explicit about, because it is the thing people assume
wrongly about static sites.

The list lives inside **Buttondown**. This repo contains a plain HTML `<form>`
that posts to their endpoint, and nothing else — no subscriber data in the
source, none in `dist/`, none in any build artifact.

That makes the guarantee structural rather than a setting you could forget:

- **A deploy cannot clear the list**, because a deploy only replaces `dist/`,
  and the list was never in it.
- Rebuilding from scratch, force-pushing, deleting and recreating the
  Cloudflare Pages project, or moving hosts entirely all leave it untouched.
- The only way to lose subscribers is to delete the Buttondown account.

The form needs no JavaScript, which is why the site still ships zero bytes of
it.

### What actually needs guarding

Not deploys — **the provider relationship**. Two habits cover it:

1. **Export the list to CSV every few months** and keep it with your backups.
   Buttondown allows export at any time; a service that does not is a service
   to avoid.
2. **Keep sending from your own domain.** Subscribers are attached to your
   address, not to Buttondown, so switching providers later is invisible to
   them.

### Configuration

`NEWSLETTER.username` in `src/consts.ts` must match the Buttondown account
exactly, or the form will 404 on submit. Set `enabled: false` to remove the
form from every page at once.

Buttondown can also mail each new post automatically from `/posts/rss.xml`,
which keeps publishing to one `git push`. Point it at the long-form feed, not
`/rss.xml`, or subscribers get link shares too.

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

A Cloudflare **Worker** serving static assets, configured in `wrangler.jsonc`.

```bash
pnpm exec wrangler login   # first time only
pnpm deploy                # astro build && wrangler deploy
pnpm preview               # builds, then serves on the real runtime locally
```

### Why a Worker and not Pages

Pages would do the same job today. But Cloudflare's newer capabilities —
Durable Objects, Workers AI bindings, the Agents SDK — land on Workers, and
Pages is no longer where the investment goes. Starting here costs nothing and
avoids migrating a site that by then has traffic and inbound links.

### Adding server routes later

The site is fully static, so the Worker has no `main` entrypoint — it only
serves `dist/`. To add a dynamic route (an agent endpoint, a form handler):

1. `pnpm add @astrojs/cloudflare` and register the adapter in
   `astro.config.mjs`. It needs `astro >= 7.4`, so bump Astro at the same time.
2. In `wrangler.jsonc`, point `"main"` at the generated worker entry and add
   `"binding": "ASSETS"` inside `assets`.
3. Mark **only** the dynamic routes with `export const prerender = false`.

Every other page keeps prerendering and keeps shipping zero JavaScript. That
property is worth defending on purpose rather than losing by accident.

### Domain

`hitgavin.dev`, registered through Cloudflare Registrar. It appears in three
places that must stay in agreement, because the sitemap and both feeds are
generated from them:

| File                | Field         |
| ------------------- | ------------- |
| `astro.config.mjs`  | `site`        |
| `src/consts.ts`     | `SITE.url`    |
| `wrangler.jsonc`    | `name`        |
