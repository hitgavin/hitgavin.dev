import rss from "@astrojs/rss";

import { SITE } from "../consts";
import {
  publishedPosts,
  publishedNotes,
  publishedLinks,
  publishedVideos,
} from "../lib/content";

/** Everything, newest first. The firehose. */
export async function GET(context) {
  const [posts, notes, links, videos] = await Promise.all([
    publishedPosts(),
    publishedNotes(),
    publishedLinks(),
    publishedVideos(),
  ]);

  const items = [
    ...posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/posts/${p.id}/`,
    })),
    ...notes.map((n) => ({
      title: `Note — ${n.data.pubDate.toISOString().slice(0, 10)}`,
      description: n.body?.slice(0, 280) ?? "",
      pubDate: n.data.pubDate,
      link: "/notes/",
    })),
    ...links.map((l) => ({
      title: `Link — ${l.data.title}`,
      description: l.body?.slice(0, 280) ?? "",
      pubDate: l.data.pubDate,
      link: l.data.url,
    })),
    ...videos.map((v) => ({
      title: `Video — ${v.data.title}`,
      description: v.data.description,
      pubDate: v.data.pubDate,
      link: `/videos/${v.id}/`,
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: SITE.title,
    description: SITE.tagline,
    site: context.site,
    items,
  });
}
