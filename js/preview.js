import parseFrontmatter from "front-matter";
import { render } from "lit";
import indexAdapter from "../_layout/indexAdapter.js";
import mdPost from "../_layout/mdPost.js";
import { resolveChain } from "./engine.js";

async function startPreview() {
  // 1. 相対パス一覧テキストをfetchして配列にする
  const res = await fetch("/paths.txt");
  const text = await res.text();
  const allPaths = text.split("\n").filter((p) => p.trim() !== "");

  // URLのクエリパラメータ（例: ?page=posts/tech/rust.md）を取得
  const urlParams = new URLSearchParams(window.location.search);
  const currentPath = urlParams.get("page") || "index";

  if (currentPath !== "index") {
    const md = await fetch(`/${currentPath}.md`);
    const postFunc = mdPost(await md.text());
    const finalHtml = await resolveChain(postFunc({}));
    render(finalHtml, document.body);
  } else {
    // 一覧ページを表示するときだけ、全ファイルの「Frontmatter（メタデータ）だけ」を非同期で回収する
    const postsMeta = await Promise.all(
      allPaths.map(async (filePath) => {
        const md = await fetch(`/${filePath}`);
        const { data: meta } = parseFrontmatter(await md.text());
        return {
          ...meta,
          path: filePath,
          slug: filePath.replace(".md", ""),
        };
      }),
    );
    const indexFunc = indexAdapter(postsMeta);
    const finalHtml = await resolveChain(indexFunc({}));
    render(finalHtml, document.body);
  }
}

startPreview();
