import { html } from "@lit-labs/ssr";
import { layout } from "../js/engine.js";
import { postDate } from "./index.js";

export function tagList(site) {
  const tags = site.allTags
    .values()
    .toArray()
    .sort((a, b) => b < a);
  return html`<ul class="tag-list">
    ${tags.map(
      (tag) =>
        html`<a href="${site.base}/tags/${tag}" class="${site.selectedTag === tag && "selected"}"/><li>#${tag}</li></a>`,
    )}
  </ul>`;
}

export default layout(
  {
    layout: "base", // 最終的に最外殻の base layout に包む
  },
  (site) => {
    const posts = site.pages
      .sort((a, b) => b.date - a.date)
      .filter((p) => p.published !== false)
      .filter(
        (p) => site.selectedTag == null || p.tags.includes(site.selectedTag),
      );

    return html`
      <section>
        <h1>タグ${site.selectedTag ? ": " + site.selectedTag : "一覧"}</h1>

        ${tagList(site)}

        <ul>
          ${posts.map(
            (post) => html`
              <li>
                ${postDate(post)}
                <a href="${site.base}/${post.slug || ""}">${post.title}</a>
              </li>
            `,
          )}
        </ul>
      </section>
    `;
  },
);
