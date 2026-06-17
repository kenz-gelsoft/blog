import { html } from "@lit-labs/ssr";
import { layout } from "../js/engine.js";
import { postDate } from "./index.js";

export function tagList(allTags) {
  const tags = allTags
    .values()
    .toArray()
    .sort((a, b) => b < a);
  return html`<ul class="tag-list">
    ${tags.map((tag) => html`<li>#${tag}</li>`)}
  </ul>`;
}

export default layout(
  {
    layout: "base", // 最終的に最外殻の base layout に包む
  },
  (site) => {
    const posts = site.pages
      .sort((a, b) => b.date - a.date)
      .filter((p) => p.published !== false);

    return html`
      <section>
        <h1>タグ一覧</h1>

        ${tagList(site.tags)}

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
