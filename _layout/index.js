import { html } from "lit";
import { layout } from "../js/engine.js";

export default layout(
  {
    layout: "base", // 最終的に最外殻の base layout に包む
  },
  (data) => {
    const posts = data.content; // ここに配列が入っている
    return html`
      <section class="archive">
        <h1>${data.title}</h1>

        <ul class="post-list">
          ${posts.map(
            (post) => html`
              <li>
                <time>${post.date}</time>
                <a href="/?page=${post.slug || ""}">${post.title}</a>
                <p>${post.description || ""}</p>
              </li>
            `,
          )}
        </ul>
      </section>
    `;
  },
);
