import { render } from "lit";
import config from "../config.json" with { type: "json" };
import index from "../layout/index.js";
import mdPost from "../layout/mdPost.js";
import { allPathsAndPosts, resolveChain } from "./engine.js";

globalThis.BASE = "";

const readFile = async (path) => (await fetch(`/${path}`)).text();

async function renderPage() {
  const { allPosts } = await allPathsAndPosts("paths.txt", readFile);

  // window.location.pathname から現在のパスを取得 (例: "/posts/tech/rust" -> "posts/tech/rust")
  // 先頭と末尾のロケールやスラッシュを掃除
  const pathName = window.location.pathname.replace(/^\/|\/$|index.html$/g, "");
  const currentPath = pathName === "" ? "index" : pathName;

  const page = {
    ...config,
    base: globalThis.BASE,
  };

  if (currentPath !== "index") {
    // パス名に ".md" を付け直してfetch
    const md = await fetch(`/${currentPath}.md`);
    const postFunc = mdPost(await md.text());
    const finalHtml = await resolveChain(postFunc(page));
    render(finalHtml, document.body);
  } else {
    // 一覧ページを表示するときだけ、全ファイルの「Frontmatter（メタデータ）だけ」を非同期で回収する
    const site = Object.assign(Object.create(page), {
      pages: allPosts,
    });

    const finalHtml = await resolveChain(index(site));
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
      new URL(anchor.href).origin === window.location.origin &&
      anchor.pathname !== window.location.pathname
    ) {
      e.preventDefault(); // 通常のページ遷移（リロード）をキャンセル
      window.scroll({ top: 0 });
      navigate(anchor.href); // History APIでURLを更新して再描画
    }
  });
}

init();
