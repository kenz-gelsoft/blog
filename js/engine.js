import parseFrontmatter from "gray-matter";

export function layout(data, layoutFunc) {
  return (page) => {
    const merged = Object.assign(Object.create(page), data);
    merged.content = layoutFunc(merged);
    merged.layout = data.layout;
    return merged;
  };
}

// レイアウトチェーンを再帰的に解決するピュアな関数
export async function resolveChain(page) {
  // 次の親（layout）が指定されていなければ、これが最終成果物のHTML（TemplateResult）
  if (!page.layout) {
    return page.content;
  }

  // 親レイアウトファイルを動的インポート
  const layoutPath = `../layout/${page.layout}.js`;
  const { default: layoutFunc } = await import(layoutPath);
  return resolveChain(layoutFunc(page));
}

export async function allPathsAndPosts(pathsFile, readFile) {
  const allPaths = (await readFile(pathsFile))
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p !== "");

  const allPosts = await Promise.all(
    allPaths.map(async (filePath) => {
      const rawMarkdown = await readFile(filePath);
      const { data } = parseFrontmatter(rawMarkdown);
      return {
        ...data,
        path: filePath,
        slug: filePath.replace(".md", ""),
      };
    }),
  );

  return { allPaths, allPosts };
}
