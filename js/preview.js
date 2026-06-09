import { render } from "lit";
import config from "../config.json" with { type: "json" };
import { Router } from "./engine.js";

globalThis.BASE = "";

async function renderPage() {
  // window.location.pathname から現在のパスを取得 (例: "/posts/tech/rust" -> "posts/tech/rust")
  // 先頭と末尾のロケールやスラッシュを掃除
  const pathName = window.location.pathname.replace(/^\/|\/$|index.html$/g, "");
  const currentPath = pathName === "" ? "index" : pathName;

  const router = new Router({
    config,
    readFile: async (path) => (await fetch(`/${path}`)).text(),
    render: (result) => render(result, document.body),
  });
  await router.renderPath(currentPath);
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
