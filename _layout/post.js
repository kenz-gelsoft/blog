import { html } from "lit";
import { layout } from "../js/engine.js";

// 第一引数にオブジェクトリテラルを配置して、11tyのFrontmatterを再現
export default layout(
  {
    layout: "base",
    author: "匿名ゲスト",
    sidebar: true, // 将来的な拡張の例
  },
  (page) => {
    return html`
      <article class="${page.sidebar ? "has-sidebar" : ""}">
        <header>
          <h1>${page.title}</h1>
          <p>著者: ${page.author}</p>
        </header>
        <div class="body">${page.content}</div>
      </article>
    `;
  },
);
