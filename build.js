import { renderThunked } from "@lit-labs/ssr"; // LitのTemplateResultを文字列に変換する公式コア
import { collectResult } from "@lit-labs/ssr/lib/render-result.js";
import fs from "fs";
import parseFrontmatter from "gray-matter";
import path from "path";
import { resolveChain } from "./js/engine";
import indexAdapter from "./layout/indexAdapter";
import mdPost from "./layout/mdPost";

// --- 設定 ---
globalThis.BASE = "/blog";
const DIST_DIR = `./dist${globalThis.BASE}`;
const PATHS_FILE = "./paths.txt";
const BASE_URL = `https://kenz-gelsoft.github.io${globalThis.BASE}`; // Google用sitemapのベースURL
const IMAGES_SRC_DIR = "./images"; // コピー元の画像ディレクトリ

// ディレクトリのリセット
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

async function generate(relativePath, layoutFunc) {
  const page = {
    base: globalThis.BASE,
  };
  const resolved = await resolveChain(layoutFunc(page));
  const htmlResult = await collectResult(renderThunked(resolved));
  const outputFilePath = path.join(DIST_DIR, relativePath);
  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
  fs.writeFileSync(outputFilePath, htmlResult, "utf-8");

  console.log(`  📄 出力: ${relativePath}`);
}

/**
 * メインビルドプロセス
 */
async function main() {
  console.log("🚀 SSGビルドを開始します...");

  // 1. paths.txt から全対象ファイルのパスを取得
  if (!fs.existsSync(PATHS_FILE)) {
    console.error(
      `❌ ${PATHS_FILE} が見つかりません。先にファイル一覧を生成してください。`,
    );
    process.exit(1);
  }
  const allPaths = fs
    .readFileSync(PATHS_FILE, "utf-8")
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p !== "");

  // 2. 全ファイルのメタデータ（Frontmatter）を事前に回収（インデックス・ブログパーツ用）
  console.log("📦 メタデータを収集してデータベースを構築中...");
  const allPosts = allPaths.map((filePath) => {
    const rawMarkdown = fs.readFileSync(filePath, "utf-8");
    const { data } = parseFrontmatter(rawMarkdown);
    return {
      ...data,
      path: filePath,
      slug: filePath.replace(".md", ""),
      base: globalThis.BASE,
    };
  });

  await generate("index.html", indexAdapter(allPosts));

  // 3. 各MarkdownファイルをビルドしてHTMLを書き出す
  for (const filePath of allPaths) {
    const rawMarkdown = fs.readFileSync(filePath, "utf-8");
    const relativePath = filePath.replace(".md", "/index.html");
    await generate(relativePath, mdPost(rawMarkdown));
  }

  // 4. Googlebot用の sitemap.txt を自動出力
  console.log("🤖 Googlebot用 sitemap.txt を生成中...");
  const sitemapText = allPosts
    .map(
      (post) => `${BASE_URL}/${post.slug === "index" ? "" : post.slug + "/"}`,
    )
    .join("\n");
  fs.writeFileSync(path.join(DIST_DIR, "sitemap.txt"), sitemapText, "utf-8");

  // 5. 【追加】images/ ディレクトリを dist/images/ に丸ごとコピー
  if (fs.existsSync(IMAGES_SRC_DIR)) {
    console.log("🖼️ 画像アセットをコピー中...");
    const imagesDestDir = path.join(DIST_DIR, "images");

    fs.cpSync(IMAGES_SRC_DIR, imagesDestDir, {
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
