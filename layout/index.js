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
        <h1>
          ${site.sitetitle} <span class="subtitle">${site.subtitle}</span>
        </h1>

        <ul class="post-list">
          ${posts.map(
            (post) => html`
              <li>
                <div class="post-item">
                  <div class="post-desc">
                    <h2>
                      <a href="${site.base}/${post.slug || ""}"
                        >${post.title}</a
                      >
                      <time>${formatter.format(post.date)}</time>
                    </h2>
                  </div>
                  ${post.image &&
                  html`<a
                    class="post-image"
                    href="${site.base}/${post.slug || ""}"
                    ><img src="${site.base}${post.image}"
                  /></a>`}
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
