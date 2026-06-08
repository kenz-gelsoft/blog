import { html } from "@lit-labs/ssr";
import { layout } from "../js/engine.js";

// 第一引数にオブジェクトリテラルを配置して、11tyのFrontmatterを再現
export default layout(
  {
    layout: "base",
    // author: "KENZ",
    sidebar: true, // 将来的な拡張の例
  },
  (page) => html`
    <article class="${page.sidebar ? "has-sidebar" : ""}">
      <header>
        <h1>${page.title}</h1>
        ${page.author && html`<p>著者: ${page.author}</p>`}
      </header>
      <div class="body">${page.content}</div>
      <p><a href="${page.base}/index.html">一覧に戻る</a></p>
    </article>
  `,
);
