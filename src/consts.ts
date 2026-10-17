export const SITE = {
  url: "https://hitgavin.dev",
  title: "Gavin Zhang",
  // One line. This is the single most-read sentence on the site — it decides
  // whether a stranger from Hacker News stays. Rewrite it until it is true
  // and specific.
  tagline: "Control engineer. Notes on how robotics actually gets built in China.",
  author: "Gavin Zhang",
  // Swap to hi@hitgavin.dev once Cloudflare Email Routing is forwarding it
  // here. One line, and old links keep working because the domain is yours.
  email: "hitgavin@gmail.com",
} as const;

/**
 * The subscriber list lives entirely inside Buttondown. Nothing about it is
 * stored in this repository or in `dist/`, so a deploy cannot touch it — the
 * site only ships a plain HTML form that posts to their endpoint.
 *
 * `username` must match the Buttondown account, or the form 404s on submit.
 */
export const NEWSLETTER = {
  enabled: true,
  username: "hitgavin",
  get action() {
    return `https://buttondown.com/api/emails/embed-subscribe/${this.username}`;
  },
} as const;

/**
 * One series per post, never two (a post may reference another series in its
 * body, but it is filed under exactly one). Slugs are permanent — they are in
 * the URL. Display names are cheap to change.
 */
export const SERIES = {
  "field-notes": {
    name: "Field Notes from Shenzhen",
    blurb:
      "What the Chinese robotics industry looks like from inside it: supply chains, spec sheets, and the engineering culture behind the shipping cadence.",
  },
  "agents-on-metal": {
    name: "Agents on Metal",
    blurb:
      "AI coding tools were built for a feedback loop measured in seconds. Here is what happens when the loop runs through a compiler, a flash cycle, and a machine in a lab.",
  },
  "equations-to-encoders": {
    name: "Equations to Encoders",
    blurb:
      "Control theory carried all the way to hardware — derivations, then the measurement that says whether the derivation was right.",
  },
} as const;

export type SeriesId = keyof typeof SERIES;

export const SERIES_IDS = Object.keys(SERIES) as SeriesId[];

export const NAV = [
  { href: "/posts", label: "Posts" },
  { href: "/notes", label: "Notes" },
  { href: "/links", label: "Links" },
  { href: "/videos", label: "Videos" },
  { href: "/about", label: "About" },
] as const;
