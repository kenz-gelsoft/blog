import { render } from "@lit-labs/ssr"; // LitのTemplateResultを文字列に変換する公式コア
import { unsafeHTML } from "lit/directives/unsafe-html.js"; // ★インポートを追加
import parseFrontmatter from "gray-matter";
import fs from "fs";
import { marked } from "marked";
import path from "path";

// --- 設定 ---
const DIST_DIR = "./dist";
const PATHS_FILE = "./paths.txt";
const BASE_URL = "https://your-site.com"; // Google用sitemapのベースURL

// ディレクトリのリセット
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

/**
 * 1. 同型関数のコアロジック (preview.js と100%同じ構造)
 */
function createPostAdapter(rawMarkdown, filePath) {
  console.log(parseFrontmatter);
  const { data: attributes, content: body } = parseFrontmatter(rawMarkdown);
  const bodyHtml = marked.parse(body);

  return (incomingData) => {
    // Object.createによるデータカスケードの再現
    const currentData = Object.assign(Object.create(attributes), incomingData);
    currentData.content = unsafeHTML(bodyHtml);
    currentData.path = filePath;
    currentData.slug = filePath.replace(".md", "");
    return currentData;
  };
}

/**
 * 2. 多段レイアウトチェーンを解決して最終的なHTML文字列を吐き出す関数
 */
async function resolveChainToHtml(initialContext) {
  let context = initialContext;

  // 最上流から最下流（layoutがなくなるまで）チェーンを遡る
  while (context.layout) {
    const layoutName = context.layout;
    // _includes/ 内のレイアウト関数を動的インポート
    const { default: defineLayoutFunc } = await import(
      `./_includes/${layoutName}.js`
    );

    // 次の層のコンテキスト（新しいプロトタイプ膜）を生成
    context = defineLayoutFunc(context);
  }

  // @lit-labs/ssr の render() はイテレータを返すため、joinして1枚の完全なHTML文字列にする
  return Array.from(render(context.content)).join("");
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
    const { attributes } = parseFrontmatter(rawMarkdown);
    return {
      ...attributes,
      path: filePath,
      slug: filePath.replace(".md", ""),
    };
  });

  // サイト共通のグローバルコンテキストを定義
  const globalContext = {
    allPosts: allPosts, // ブログパーツやインデックスが欲しがる全データ
    siteAuthor: "Your Name", // サイト共通の固定設定
  };

  // 3. 各MarkdownファイルをビルドしてHTMLを書き出す
  for (const filePath of allPaths) {
    const rawMarkdown = fs.readFileSync(filePath, "utf-8");

    // 記事個別のアダプター関数を生成
    const postAdapter = createPostAdapter(rawMarkdown, filePath);

    // グローバルデータを親として、記事のコンテキストを結合（Object.create）
    const initialContext = postAdapter(globalContext);

    // パイプラインを実行してHTML文字列を取得
    const htmlResult = await resolveChainToHtml(initialContext);

    // 出力先ファイルの決定（例: posts/tech/rust.md -> dist/posts/tech/rust.html）
    const htmlRelativePath = filePath.replace(".md", ".html");
    const outputFilePath = path.join(DIST_DIR, htmlRelativePath);

    // 再帰的にディレクトリを作って書き込み
    fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
    fs.writeFileSync(outputFilePath, htmlResult, "utf-8");

    console.log(`  📄 出力: ${htmlRelativePath}`);
  }

  // 4. ついでにGooglebot用の sitemap.txt も同じデータからついでに自動出力！
  console.log("🤖 Googlebot用 sitemap.txt を生成中...");
  const sitemapText = allPosts
    .map(
      (post) =>
        `${BASE_URL}/${post.slug === "index" ? "" : post.slug + ".html"}`,
    )
    .join("\n");
  fs.writeFileSync(path.join(DIST_DIR, "sitemap.txt"), sitemapText, "utf-8");

  console.log("✨ すべての静的ビルドが正常に完了しました！ [./dist]");
}

main().catch((err) => {
  console.error("❌ ビルド中にエラーが発生しました:", err);
  process.exit(1);
});
