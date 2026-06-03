import { html } from "lit";
import { layout } from "../engine.js";

// 第一引数にオブジェクトリテラルを配置して、11tyのFrontmatterを再現
export default layout(
  {
    layout: "baseLayout",
    author: "匿名ゲスト",
    sidebar: true, // 将来的な拡張の例
  },
  (data) => html`
    <article class="${data.sidebar ? "has-sidebar" : ""}">
      <header>
        <h1>${data.title}</h1>
        <p>著者: ${data.author}</p>
      </header>
      <div class="body">${data.content}</div>
    </article>
  `,
);
