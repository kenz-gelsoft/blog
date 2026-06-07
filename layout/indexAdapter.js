import { layout } from "../js/engine.js";

/**
 * 記事一覧データからインデックス用の同型関数を生成するアダプター
 */
export default function indexAdapter(posts) {
  return layout(
    // インデックスページ自体の設定（タイトルなど）
    {
      title: "そのたぐいのこと - on Other GUIs",
      layout: "index",
    },
    // 配列そのものをコンテンツとする
    () => posts,
  );
}
