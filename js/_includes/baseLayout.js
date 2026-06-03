import { html } from "lit";
import { layout } from "../engine.js";

export default layout(
  {
    // ルートレイアウトでは layout: を指定しない
  },
  (data) => html`
    <!DOCTYPE html>
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <title>${data.title}</title>
      </head>
      <body>
        ${data.content}
      </body>
    </html>
  `,
);
