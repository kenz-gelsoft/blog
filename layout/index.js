import { html } from "@lit-labs/ssr";
import { layout } from "../js/engine.js";

export default layout(
  {
    layout: "base", // 最終的に最外殻の base layout に包む
  },
  (site) => {
    const formatter = new Intl.DateTimeFormat("ja-JP");
    const posts = site.pages
      .sort((a, b) => b.date - a.date)
      .filter((p) => p.published !== false);

    return html`
      <section class="archive">
        <h1>${site.title}</h1>

        <ul class="post-list">
          ${posts.map(
            (post) => html`
              <li>
                <div class="post-item">
                  <h2 class="post-desc">
                    <time>${formatter.format(post.date)}</time>
                    <a href="${site.base}/${post.slug || ""}">${post.title}</a>
                ${post.image &&
                html`<a
                  class="post-image"
                  href="${site.base}/${post.slug || ""}"
                  ><img src="${site.base}/${post.image}"
                /></a>`}
                  </h2>
                </div>
                <p>${post.excerpt || ""}</p>
              </li>
            `,
          )}
        </ul>
      </section>
    `;
  },
);
