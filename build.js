import { renderThunked } from "@lit-labs/ssr"; // LitのTemplateResultを文字列に変換する公式コア
import { collectResult } from "@lit-labs/ssr/lib/render-result.js";
import fs from "node:fs/promises";
import path from "path";
import config from "./config.json" with { type: "json" };
import { Router } from "./js/engine";

// --- 設定 ---
globalThis.BASE = "/blog";
const DIST_DIR = `./dist${globalThis.BASE}`;
const PATHS_FILE = "./paths.txt";
const BASE_URL = `https://kenz-gelsoft.github.io${globalThis.BASE}`; // Google用sitemapのベースURL
const IMAGES_SRC_DIR = "./images"; // コピー元の画像ディレクトリ

// ディレクトリのリセット
if (await fs.exists(DIST_DIR)) {
  await fs.rm(DIST_DIR, { recursive: true, force: true });
}
await fs.mkdir(DIST_DIR, { recursive: true });

const readFile = async (path) => fs.readFile(path, "utf-8");

/**
 * メインビルドプロセス
 */
async function main() {
  console.log("🚀 SSGビルドを開始します...");

  // 1. paths.txt から全対象ファイルのパスを取得
  if (!(await fs.exists(PATHS_FILE))) {
    console.error(
      `❌ ${PATHS_FILE} が見つかりません。先にファイル一覧を生成してください。`,
    );
    process.exit(1);
  }

  const router = new Router({
    config,
    readFile,
    render: async (resolved, filePath) => {
      const relativePath =
        filePath === "index"
          ? "index.html"
          : filePath.replace(".md", "/index.html");
      const htmlResult = await collectResult(renderThunked(resolved));
      const outputFilePath = path.join(DIST_DIR, relativePath);
      await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
      await fs.writeFile(outputFilePath, htmlResult, "utf-8");

      console.log(`  📄 出力: ${relativePath}`);
    },
  });

  // 2. 全ファイルのメタデータ（Frontmatter）を事前に回収（インデックス・ブログパーツ用）
  console.log("📦 メタデータを収集してデータベースを構築中...");
  const allPaths = await router.allPaths();
  const allPosts = await router.allPosts();

  // 3. 各MarkdownファイルをビルドしてHTMLを書き出す
  await router.renderPath("index");
  for (const filePath of allPaths) {
    await router.renderPath(filePath);
  }

  // 4. タグ一覧ページ
  // FIXME: .md なしで動くようにする
  await router.renderPath("tags.md");

  // 5. Googlebot用の sitemap.txt を自動出力
  console.log("🤖 Googlebot用 sitemap.txt を生成中...");
  const sitemapText = allPosts
    .map(
      (post) => `${BASE_URL}/${post.slug === "index" ? "" : post.slug + "/"}`,
    )
    .join("\n");
  await fs.writeFile(path.join(DIST_DIR, "sitemap.txt"), sitemapText, "utf-8");

  // 6. 【追加】images/ ディレクトリを dist/images/ に丸ごとコピー
  if (await fs.exists(IMAGES_SRC_DIR)) {
    console.log("🖼️ 画像アセットをコピー中...");
    const imagesDestDir = path.join(DIST_DIR, "images");

    await fs.cp(IMAGES_SRC_DIR, imagesDestDir, {
      recursive: true, // サブディレクトリも丸ごと再帰的にコピー
      force: true, // 同名ファイルがあっても上書き
    });
    console.log("  📁 画像のコピーが完了しました");
  } else {
    console.log("ℹ️ images/ ディレクトリが見つからないため、スキップしました");
  }

  console.log(`✨ すべての静的ビルドが正常に完了しました！ [${DIST_DIR}]`);
}

main().catch((err) => {
  console.error("❌ ビルド中にエラーが発生しました:", err);
  process.exit(1);
});
