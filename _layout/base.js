import { html } from "lit";
import { layout } from "../js/engine.js";

export default layout(
  {
    // ルートレイアウトでは layout: を指定しない
    layout: null,
  },
  (page) => html`
    <!DOCTYPE html>
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <title>${page.title}</title>
      </head>
      <body>
        ${page.content}
      </body>
    </html>
  `,
);
