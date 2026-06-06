export function layout(meta, layoutFunc) {
  return (data) => {
    const merged = Object.assign(Object.create(meta), data);
    console.log(meta.title, meta.layout, "+", data.title, data.layout, "=>", merged.title, merged.layout);    
    merged.content = layoutFunc(merged);
    merged.layout = meta.layout;
    return merged;
  };
}

// レイアウトチェーンを再帰的に解決するピュアな関数
export async function resolveChain(currentResult) {
  // 次の親（layout）が指定されていなければ、これが最終成果物のHTML（TemplateResult）
  if (!currentResult.layout) {
    return currentResult.content;
  }

  // 親レイアウトファイルを動的インポート
  const layoutPath = `./_includes/${currentResult.layout}.js`;
  const layoutModule = await import(layoutPath);
  const nextLayoutFunc = layoutModule.default; // defineLayoutでラップされた関数

  // 同型関数なので、前の実行結果（データ一式）をそのまま次の関数に放り込むだけ！
  const nextResult = nextLayoutFunc(currentResult);
  console.log(currentResult.layout, currentResult.title, "=>", nextResult.layout, nextResult.title);

  // 再帰的に次の階層へ
  return resolveChain(nextResult);
}
