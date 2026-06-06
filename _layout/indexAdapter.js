/**
 * 記事一覧データからインデックス用の同型関数を生成するアダプター
 */
export default function indexAdapter(postsMeta) {
  // インデックスページ自体の設定（タイトルなど）
  const defaults = {
    title: "記事一覧",
    layout: "index",
  };
  return (data) => {
    const merged = Object.assign(Object.create(data), defaults);
    console.log(
      defaults.title,
      defaults.layout,
      "+",
      data.title,
      data.layout,
      "=>",
      merged.title,
      merged.layout,
    );
    // 配列そのものをコンテンツとする
    merged.content = postsMeta;
    merged.layout = defaults.layout;
    return merged;
  };
}
