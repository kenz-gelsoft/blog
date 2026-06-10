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
          html,
          body {
            font-family: serif;
          }
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            font-family: sans-serif;
          }

          .post-list,
          .post-item {
            display: flex;
            margin: 0;
            padding: 0;
          }
          .post-list {
            flex-direction: column;
            gap: 1rem;
            list-style-type: none;
          }
          .post-list img {
            /*max-width: 100vw;*/
            width: 100vw;
          }
          .post-image {
            display: flex;
          }
          .post-item {
            position: relative;
            /*border: 1px solid black;*/
            /*width: 66%;*/
          }
          .post-desc {
            padding: 0 1rem;
            background-color: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(10px);
          }
          .post-item:has(img) .post-desc {
            position: absolute;
            bottom: 0;
          }

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
