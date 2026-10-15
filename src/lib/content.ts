import { getCollection, type CollectionEntry } from "astro:content";

/** Drafts are visible while developing and never leave the machine. */
const SHOW_DRAFTS = import.meta.env.DEV;

const byNewest = (a: { data: { pubDate: Date } }, b: { data: { pubDate: Date } }) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

export async function publishedPosts(): Promise<CollectionEntry<"posts">[]> {
  const all = await getCollection("posts", ({ data }) => SHOW_DRAFTS || !data.draft);
  return all.sort(byNewest);
}

export async function publishedNotes(): Promise<CollectionEntry<"notes">[]> {
  const all = await getCollection("notes", ({ data }) => SHOW_DRAFTS || !data.draft);
  return all.sort(byNewest);
}

export async function publishedLinks(): Promise<CollectionEntry<"links">[]> {
  return (await getCollection("links")).sort(byNewest);
}

export async function publishedVideos(): Promise<CollectionEntry<"videos">[]> {
  return (await getCollection("videos")).sort(byNewest);
}

export type IndexRow = {
  kind: "link" | "video";
  date: Date;
  label: string;
  href: string;
  /** Link rows leave the site; the UI marks them. */
  external: boolean;
};

/**
 * Links and video merged into one dated index — everything that points at
 * something rather than saying something. Notes are deliberately absent: they
 * sit beside this list in full, and showing them twice reads as a bug.
 */
export async function pointerIndex(limit = 8): Promise<IndexRow[]> {
  const [links, videos] = await Promise.all([
    publishedLinks(),
    publishedVideos(),
  ]);

  return [
    ...links.map((l): IndexRow => ({
      kind: "link",
      date: l.data.pubDate,
      label: l.data.title,
      href: l.data.url,
      external: true,
    })),
    ...videos.map((v): IndexRow => ({
      kind: "video",
      date: v.data.pubDate,
      label: v.data.title,
      href: `/videos/${v.id}/`,
      external: false,
    })),
  ]
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .slice(0, limit);
}
