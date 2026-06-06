import parseFrontmatter from "front-matter";
import { render } from "lit";
import indexAdapter from "../layout/indexAdapter.js";
import mdPost from "../layout/mdPost.js";
import { resolveChain } from "./engine.js";

async function renderPage() {
  // 1. 相対パス一覧テキストをfetchして配列にする
  const res = await fetch("/paths.txt");
  const text = await res.text();
  const allPaths = text.split("\n").filter((p) => p.trim() !== "");

  // window.location.pathname から現在のパスを取得 (例: "/posts/tech/rust" -> "posts/tech/rust")
  // 先頭と末尾のロケールやスラッシュを掃除
  const pathName = window.location.pathname.replace(/^\/|\/$/g, "");
  const currentPath = pathName === "" ? "index" : pathName;

  if (currentPath !== "index") {
    // パス名に ".md" を付け直してfetch
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

// 独自のナビゲーション関数
function navigate(url) {
  window.history.pushState(null, "", url);
  renderPage();
}

// アプリケーションの初期化
function init() {
  // 初回ロード時の描画
  renderPage();

  // ブラウザの「戻る」「進む」ボタンに対応
  window.addEventListener("popstate", () => {
    renderPage();
  });

  // ページ内の全リンク（<a>タグ）のクリックをキャッチしてSPA遷移にする
  document.body.addEventListener("click", (e) => {
    const anchor = e.target.closest("a");

    // <a>タグかつ、同一ドメイン内の遷移であれば共通処理
    if (
      anchor &&
      anchor.href &&
      new URL(anchor.href).origin === window.location.origin
    ) {
      e.preventDefault(); // 通常のページ遷移（リロード）をキャンセル
      navigate(anchor.pathname); // History APIでURLを更新して再描画
    }
  });
}

init();
