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
