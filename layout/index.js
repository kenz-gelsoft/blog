import { html } from "@lit-labs/ssr";
import { layout } from "../js/engine.js";

export default layout(
  {
    layout: "base", // 最終的に最外殻の base layout に包む
  },
  (page) => {
    const formatter = new Intl.DateTimeFormat("ja-JP");
    const posts = page.content
      .sort((a, b) => b.date - a.date)
      .filter((p) => p.published !== false); // ここに配列が入っている
    return html`
      <section class="archive">
        <h1>${page.title}</h1>

        <ul class="post-list">
          ${posts.map(
            (post) => html`
              <li>
                <time>${formatter.format(post.date)}</time>
                <a href="/blog/${post.slug || ""}">${post.title}</a>
                <p>${post.description || ""}</p>
              </li>
            `,
          )}
        </ul>
      </section>
    `;
  },
);
