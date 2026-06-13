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
            margin: 0;
            padding: 0;
          }

          .container {
            display: flex;
            flex-direction: column;
            margin: 0 auto;
            max-width: 1000px;
          }

          main {
            flex: 1;
            padding: 1rem;
            padding-top: 0;
            box-shadow: 0 0 4px lightgray;
          }
          aside {
            flex: 0;
            min-width: calc(1000px - 768px);
            padding: 1.5rem 1rem 3rem 1rem;
            position: relative;
          }

          @media (min-width: 768px) {
            main {
              padding-bottom: 3rem;
            }
            .container {
              flex-direction: row;
            }
            .side-bar {
              position: fixed;
              width: calc(1000px - 768px);
            }
          }

          .site-title {
            font-weight: bold;
            font-family: sans;
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
            flex-direction: column;
            margin: 0;
            padding: 0;
          }
          .post-list {
            gap: 2rem;
            list-style-type: none;
          }
          .post-list img {
            aspect-ratio: 2/1 auto;
            max-height: 100%;
          }
          .post-list li p {
            margin: 0;
            padding: 0.5rem 0;
          }
          .post-image {
            display: flex;
          }
          .post-item {
            position: relative;
            margin: 0 -1rem;
          }
          .post-desc h2 {
            margin: 0;
            padding: 0;
          }
          .post-desc {
            margin: 0;
            padding: 0.5rem 1rem;
            background-color: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(10px);
          }
          .post-item time {
            vertical-align: baseline;
            float: right;
            font-family: serif;
            font-size: 1rem;
            margin-top: 0.75rem;
            right: 0;
          }
          .post-item:has(img) .post-desc {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
          }

          img {
            max-width: 100%;
            max-height: 66vh;
          }
          pre:has(code) {
            background-color: black;
            color: white;
            margin: 0 -1rem;
            padding: 0.75em 1rem;
            overflow: scroll;
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
        <div class="container">
          <main>${page.content}</main>
          <aside>
            <div class="side-bar">
              <a href="${page.base}/" class="site-title"
                >そのたぐいのこと - on Other GUIs</a
              >
              <hr />
              <address>
                <a href="${page.authorLink}">&copy; ${page.author}</a>
              </address>
            </div>
          </aside>
        </div>
      </body>
    </html>
  `,
);
