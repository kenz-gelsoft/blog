---
title: "COSMICアプリのIME対応の思い出"
date: 2026-05-16
description: "COSMICアプリのIME対応を振り返ります"
categories: Development
tags: [COSMIC, Linux, "Pop!_OS", "日本語入力"]
published: true
---

## タイムライン

振り返ってみると長かった。本格的に手出しし始めたのは前の趣味プロジェクトが一区切りした2025/01から。このタイムラインを見るとEpoch 1にIMEサポートが間に合わなかった理由がわかる。

というか、米国ベースのハードウェアメーカーであるSystem76に強いモチベーションはない(金にならない)のによくぞ付き合ってくれたという気持ち。

|日付|できごと|
|-|-|
|2021/11/09|[System76がCOSMICデスクトップの開発表明](https://www.omgubuntu.co.uk/2021/11/system76-is-building-its-own-desktop-environment)|
|2024/08/09|[COSMIC Alpha](https://web.archive.org/web/20240809205009/https://system76.com/cosmic)がリリース<br>非常にロマンを感じ、ウォッチしはじめる|
|2024/08/22|[COSMICはベースのicedツールキットのIMEサポートを待つ方針](https://github.com/pop-os/libcosmic/issues/578#issuecomment-2304394693)<br>icedのIMEサポート状況を調べ始める|
|2025/01/10|icedのIMEサポートの試作・設計を開始|
|2025/02/02|icedに[IMEサポートの設計提案](https://discourse.iced.rs/t/api-design-proposal-cjk-input-method-support/862)|
|2025/02/04|icedに[最初のIMEサポートPull Request](https://github.com/iced-rs/iced/pull/2777)がマージ<br>[COSMICはiced 0.14のリリース後にIMEサポートを取り込む方針](https://github.com/pop-os/libcosmic/issues/578#issuecomment-2633637528)|
|2025/02/12|icedのIMEサポートをCOSMICにバックポートしてテスト開始|
|2025/09/26|[COSMIC Epoch 1 Beta](https://fosstodon.org/@system76/115268446336958658)がリリース|
|2025/12/08|[iced 0.14](https://github.com/iced-rs/iced/releases/tag/0.14.0) IMEサポートがリリース<br>> Input method support. [#2777](https://github.com/iced-rs/iced/pull/2777)|
|2025/12/11|[COSMIC Epoch 1](https://system76.com/blog/post/pop-os-letter-from-our-founder)<br>IMEサポートなしでPop!_OS 24.04LTSと同時に正式リリース|
|2026/02/04|[COSMIC Epoch 2でIMEサポート(正確にはicedのIMEサポート取り込み)する方針](https://system76.com/blog/post/cosmic-epoch-2-and-3-roadmap)|
|2026/03/26|COSMICアプリの共通ライブラリ`libcosmic`が[iced 0.14に更新完了](https://github.com/pop-os/libcosmic/issues/1089)<br>＝icedのIMEサポートを取り込んだ|
|2026/04/02|[COSMICアプリ共通ライブラリのIMEサポートPull Request](https://github.com/pop-os/libcosmic/pull/1182)がマージ|
|2026/04/08|[COSMIC Epoch 1.0.9](https://github.com/pop-os/cosmic-epoch/releases/tag/epoch-1.0.9)<br>COSMICアプリ共通のIMEサポートがリリース開始<br>・COSMICファイル(`cosmic-files`)<br>・COSMIC設定(`cosmic-settings`)<br>・COSMICストア(`cosmic-store`)|
|2026/04/15|[COSMIC Epoch 1.0.10](https://github.com/pop-os/cosmic-epoch/releases/tag/epoch-1.0.10)<br>COSMICアプリ共通のIMEサポートが追加リリース<br>・Launcher(`cosmic-launcher`)<br>・Applications(`cosmic-app-library`)|
|2026/05/06|[COSMIC Epoch 1.0.12](https://github.com/pop-os/cosmic-epoch/releases/tag/epoch-1.0.12)<br>COSMICテキストエディタ(`cosmic-edit`)固有のIMEサポートがリリース<br>共通ファイルダイアログ(`xdg-desktop-portal-cosmic`)のIME対応がリリース<br>COSMIC Media Player(`cosmic-player`)、ブラウザ等で動作|
|2026/05/13|[COSMIC Epoch 1.0.13](https://github.com/pop-os/cosmic-epoch/releases/tag/epoch-1.0.13)<br>COSMICコンポジタのWaylandネイティブのIME動作改善がリリース|
|2026/05/16|COSMIC端末(`cosmic-term`)固有のIMEサポートがマージ|
|2026/05/??|COSMIC Epoch 1.0.14<br>最低限のIMEサポートが揃った状態になる見込み|

## コミュニティの助けが必要と感じた

この酔狂なプロジェクトに全betするSystem76に多少の金がないわけではないが、主に英語圏にPCを売って、CJKを商圏としていないSystem76にはIMEサポートの積極的なモチベーションがないと感じた。

「icedがサポートしてないから」という回答を見て、これは長丁場になるぞ、と感じた。

日本が世界第二位の経済大国だった時代は今は昔、中国は人口が多いといえど米国との関係が良好とは言えないこのご時世、米国でハードを売ってるメーカーが法律で強制されてもいないのに日本語入力(IME)サポートを会社の金で積極的に作るだろうか。いや、ない。（反語）

## 孤高のスタープログラマーが手掛ける職人仕事iced

プログラミング言語Rustはただでさえ議論を巻き起こす。Anthropicが札束を燃やしてbunの世界をRustで再創造した。GPLライセンスのソフトウェアをLLMで書き換えてロンダリングが横行する。タイムラインの燃料に事欠かない。

そんなRustでGUIツールキット界隈(超ニッチじゃん!)というと、既に火薬の匂いが立ち込めている。

Rust GUI界には元Googleでxi-editor作者のRaph Levien氏が理論派の重鎮として存在し、究極のパフォーマンスと完全なEoDの理想のツールキットを、チームで、エコシステムから育てている派閥がある。

iced作者はそのエコシステムからは独自の立場にあり、そのセンスとAIで強化されたコーディング速度で圧倒的なスピード感でこの高機能なツールキットを育ててきた。コミュニティの貢献を受け入れないわけではないが、チームで協議してルールを整備して物事を進めるというより、貢献者のインプットを納得すれば採り入れるといったスタイルのプロジェクトだ。

このスピード感こそがSystem76がベースのツールキットとして採択した理由であろう、しかし、これは同時にIMEサポートの追加の障壁でもあった。

実際、IMEサポートを追加するPull Requestは以前から複数人から何度か提案されてきたが、採択に至らずにきた:
- 2021/01/07〜 [Set IME's window position on TextInput by hatoo · Pull Request #686](https://github.com/iced-rs/iced/pull/686)
- 2022/10/17〜 [basic IME supporting by KentaTheBugMaker · Pull Request #1474](https://github.com/iced-rs/iced/pull/1474)
- 2023/05/21〜 [basic IME support rebase by KentaTheBugMaker · Pull Request #1858](https://github.com/iced-rs/iced/pull/1858)

iced 0.14で取り込まれた変更よりも高いIME対応レベルを実現しているPull Requestもあった。それでも、このスタイルへのプロジェクトへの取り込みでは、作者の設計への納得が重要だった。

設計提案では以下を意識し、IMEとの高いレベルの統合を実現することより、ライブラリおよびライブラリを使う開発者への影響が最小となる設計を提案した。ありがたい事に納得を得た。
- icedの半数以上のユーザーはIMEを利用しないし、IME対応による影響を望まない
- icedライブラリを使う開発者のほとんどはIMEを意識したくないし、テスト方法もわからない
- iced作者にとってメンテナンスの負担にならないことが必要

そして提案したコードのほとんどは跡形もなくイカしたコードに書き換えられ、マージされた。自分の書いた行はわずかだが、それでいい。

## iced 0.14数カ月のうちに出るやろ…まさかの難産

以下のリリース間隔を見て、2025/02に入ったIMEサポートは2,3ヶ月のうちに出るだろう、と思うじゃん？
- 2023/01/14 0.7
- 2023/02/18 0.8 - 1ヶ月
- 2023/04/13 0.9 - 2ヶ月
- 2023/07/29 0.10 - 3ヶ月
- 欠番? 0.11
- 2024/02/15 0.12 - 7ヶ月
- 2024/09/18 0.13 - 7ヶ月

結果リリースされたのは前のリリースから15ヶ月、IMEサポート投入から10ヶ月後。こんなの予測できないよ…。
- 2025/12/08 0.14 - 15ヶ月

0.14は[ロードマップ](https://whimsical.com/roadmap-iced-7vhq6R35Lp3TmYH4WeYwLM)からも見て取れるように大きい機能追加がいくつもあり、納得できる機能・品質到達に時間を要したよう。

## COSMICチームのナイスな人たち

コミュニティプロジェクトを回すという点でプロな人たちと感じた。小さく的確な貢献であれば割とすぐレビューしてくれていた。

QAテストエンジニアの帯域は足りてなさそうで、すぐテストしてもらえたのがレアだったのだろうと感じる。実際、ローリングリリースでは小さい変更があちこちに影響する可能性はあり、ちょっとした変更を行う都度、あちこちテストするのは大変だ。でもおかげで早く変更がリリースされ、やっとIMEサポートのフィードバックが得られるようになってきた。いくつかは修正もできた。

コミュニティの貢献でも企業として品質保証する動き、非営利企業であるMozillaなどでは仕事で趣味でやっている人を目にしてきたが、自分自身の作業もある中、コミュニティ対応をきちんとやってくれる営利企業はすごい。

ネックになるのはJSTとの時差だ。日本とデンバー(MDT)の時差は15時間あり、JSTで寝る前に趣味で作業したら、起きたらフィードバックが得られている。でもフィードバックを趣味で応答できる時間にはあちらは寝ていて、フィードバックに追加の質問をしようと思うともう一日待つ必要がある。早起きする？夜型の人間には厳しい。

そんなこんなで一区切り。自分が困ったらまた手出ししていく。ありがとうございました。
