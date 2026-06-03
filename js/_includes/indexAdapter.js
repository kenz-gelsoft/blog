/**
 * 記事一覧データからインデックス用の同型関数を生成するアダプター
 */
export default function indexAdapter(postsMeta) {
  // インデックスページ自体の設定（タイトルなど）
  const defaults = {
    title: "記事一覧",
    layout: "indexLayout",
  };
  return (data) => {
    const merged = Object.assign(Object.create(defaults), data);
    // 配列そのものをコンテンツとする
    merged.content = postsMeta;
    return merged;
  };
}
