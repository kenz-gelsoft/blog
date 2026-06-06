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
  const layoutFunc = (await import(layoutPath)).default;
  return resolveChain(layoutFunc(page));
}
