import parseFrontmatter from "gray-matter";
import index from "../layout/index.js";
import mdPost from "../layout/mdPost.js";
import tags from "../layout/tags.js";

export function layout(data, layoutFunc) {
  return (page) => {
    const merged = Object.assign(Object.create(page), data);
    merged.content = layoutFunc(merged);
    merged.layout = data.layout;
    return merged;
  };
}

// レイアウトチェーンを再帰的に解決するピュアな関数
async function resolveChain(page) {
  // 次の親（layout）が指定されていなければ、これが最終成果物のHTML（TemplateResult）
  if (!page.layout) {
    return page.content;
  }

  // 親レイアウトファイルを動的インポート
  const layoutPath = `../layout/${page.layout}.js`;
  const { default: layoutFunc } = await import(layoutPath);
  return resolveChain(layoutFunc(page));
}

export class Router {
  _config = {};
  _readFile = null;
  _render = null;

  constructor({ config, readFile, render }) {
    this._config = config;
    this._readFile = readFile;
    this._render = render;
  }

  // キャッシュ
  _allPaths = null;
  _allPosts = null;
  async allPaths() {
    if (this._allPaths == null) {
      this._allPaths = (await this._readFile("paths.txt"))
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p !== "");
    }
    return this._allPaths;
  }
  async allPosts() {
    if (this._allPosts == null) {
      const allPaths = await this.allPaths();
      this._allPosts = await Promise.all(
        allPaths.map(async (filePath) => {
          const rawMarkdown = await this._readFile(filePath);
          const { data, content } = parseFrontmatter(rawMarkdown);
          return {
            ...data,
            excerpt: Router._parseSummary(content),
            path: filePath,
            slug: filePath.replace(".md", ""),
            base: globalThis.BASE,
          };
        }),
      );
    }
    return this._allPosts;
  }

  _allTags = null;
  async allTags() {
    if (this._allTags == null) {
      this._allTags = new Set(
        (await this.allPosts())
          .filter((p) => p.published)
          .flatMap((p) => p.tags),
      );
    }
    return this._allTags;
  }

  /**
   * テキストから要約を抽出
   * @private
   */
  static _parseSummary(text) {
    const blocks = text.trim().split(/\n\s*\n/);
    const firstContentBlock =
      blocks.find((block) => !block.trim().startsWith("#")) || "";

    let summary = firstContentBlock
      .replace(/[#*`>]/g, "")
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\n+/g, " ")
      .trim();

    const limit = 100;
    return summary.length > limit
      ? summary.substring(0, limit) + "..."
      : summary;
  }

  async renderPath(path) {
    const page = {
      ...this._config,
      base: globalThis.BASE,
    };

    if (path.startsWith("tags/") && path.endsWith(".md")) {
      const selectedTag = decodeURIComponent(
        path.split("/").at(-1).slice(0, -".md".length),
      );
      const site = Object.assign(Object.create(page), {
        // 一覧ページを表示するときだけ、全ファイルの「Frontmatter（メタデータ）だけ」を非同期で回収する
        pages: await this.allPosts(),
        tags: await this.allTags(),
        selectedTag,
      });

      const finalHtml = await resolveChain(tags(site));
      this._render(finalHtml, path);
    } else if (path.startsWith("tags.md")) {
      const site = Object.assign(Object.create(page), {
        // 一覧ページを表示するときだけ、全ファイルの「Frontmatter（メタデータ）だけ」を非同期で回収する
        pages: await this.allPosts(),
        tags: await this.allTags(),
      });

      const finalHtml = await resolveChain(tags(site));
      this._render(finalHtml, path);
    } else if (path !== "index") {
      const postLayout = await mdPost(path, this._readFile);
      const finalHtml = await resolveChain(postLayout(page));
      this._render(finalHtml, path);
    } else {
      const site = Object.assign(Object.create(page), {
        // 一覧ページを表示するときだけ、全ファイルの「Frontmatter（メタデータ）だけ」を非同期で回収する
        pages: await this.allPosts(),
      });

      const finalHtml = await resolveChain(index(site));
      this._render(finalHtml, path);
    }
  }
}
