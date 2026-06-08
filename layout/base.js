import { html } from "@lit-labs/ssr";
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${page.title}</title>
        <style type="text/css">
          img {
            max-width: 100%;
            max-height: 66vh;
          }
          pre:has(code) {
            background-color: black;
            color: white;
            padding: 0.75em;
          }

          table {
            border-collapse: collapse;
            width: 100%;
            margin: 1.5rem 0;
            font-size: 0.9rem;
          }
          th {
            background-color: lightgray;
            text-align: left;
          }
          th,
          td {
            padding: 0.75rem;
            border: 1px solid black;
          }

          blockquote {
            margin: 1.5rem 0;
            padding-left: 1rem;
            border-left: 4px solid lightgray;
            color: gray;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        ${page.content}
        <hr />
        <address>
          <a href="${page.authorLink}">&copy; ${page.author}</a>
        </address>
      </body>
    </html>
  `,
);
