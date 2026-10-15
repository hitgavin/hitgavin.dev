import rss from "@astrojs/rss";

import { SITE } from "../../consts";
import { publishedPosts } from "../../lib/content";

/**
 * Long-form only. Someone who subscribed for the essays should not get a
 * link-share in their reader three times a day.
 */
export async function GET(context) {
  const posts = await publishedPosts();

  return rss({
    title: `${SITE.title} — long-form`,
    description: "Essays only. No notes, no link shares.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/posts/${post.id}/`,
    })),
  });
}
