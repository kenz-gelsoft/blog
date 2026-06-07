---
title: "COSMICデスクトップの日本語入力対応状況(2026/05)"
date: 2026-05-09
description: "COSMICデスクトップの日本語入力対応状況(2026/05)"
categories: Development
tags: [COSMIC, Linux, "Pop!_OS", "日本語入力"]
image: "/images/2025-05-09-cosmic-ja-status/cosmic1.png"
published: true
---

## TL;DR

2026/06頃にはCOSMICデスクトップ環境の日本語入力は実用レベルになる見通しです。テストしてバグに遭遇したらぜひ報告しましょう。

## 背景

Linuxのデスクトップ環境として[GNOME](https://www.gnome.org/ja/)、[KDE(Plasma)](https://kde.org/ja/)などが有名ですが、その他にも多くのデスクトップ環境が存在します。その中で比較的新しく登場してきたのが[COSMIC](https://system76.com/cosmic)というデスクトップ環境です。多くのデスクトップ環境が[GTK](https://www.gtk.org/)や[Qt](https://www.qt.io/ja-jp/development/qt-framework)といった広く使われている[GUIツールキット](https://ja.wikipedia.org/wiki/%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%83%BB%E3%83%84%E3%83%BC%E3%83%AB%E3%82%AD%E3%83%83%E3%83%88)をベースとしているのに対し、COSMICは[Rust言語](https://rust-lang.org/ja/)で書かれた[iced](https://iced.rs/)というツールキットをベースにほぼゼロから構築されているという点が新鮮です。

ただ、新しく書かれた＝機能も限定されているため、[COSMICデスクトップ用アプリは日本語入力に対応しないまま](https://github.com/pop-os/cosmic-epoch/issues/2174)、最初の正式バージョンである[COSMIC Epoch 1](https://system76.com/blog/post/pop-os-letter-from-our-founder)がリリースされました。次なるメジャーバージョンアップである[COSMIC Epoch 2](https://system76.com/blog/post/cosmic-epoch-2-and-3-roadmap)では日本語入力の対応がスコープに含まれ、実際に対応が進んできているため、この記事では2026/05上旬現在の対応状況について共有したいと思います。

![](/images/2025-05-09-cosmic-ja-status/cosmic1.png)

---

## インプットメソッドフレームワークの対応状況

主要な[インプットメソッドフレームワーク](https://wiki.archlinux.jp/index.php/%E3%82%A4%E3%83%B3%E3%83%97%E3%83%83%E3%83%88%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89#%E3%82%A4%E3%83%B3%E3%83%97%E3%83%83%E3%83%88%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0%E3%83%AF%E3%83%BC%E3%82%AF)として、[IBus](https://wiki.archlinux.jp/index.php/IBus)と[Fcitx5](https://wiki.archlinux.jp/index.php/Fcitx5)があります。~~COSMIC開発者によればIBusも利用可能とのことですが~~(_のようなコメントを見た覚えがあるのですが見つけられず…_)、自分自身IBusを適切に設定できたことがなく、設定できている日本語ユーザーの記事を見たことがありません。そのため、把握している限りではFcitx5一択です。

Fcitx5と組み合わせるIMEとして、個人的には[Mozc](https://wiki.archlinux.jp/index.php/Mozc)でのみ動作を確認していますが、[Anthy](https://ja.wikipedia.org/wiki/Anthy)などその他のIMEでも動作するはずです。

![](/images/2025-05-09-cosmic-ja-status/cosmic2.png)

## アプリごとの対応状況

### COSMICアプリ

2026/05/09現在、**COSMIC端末**を除いたほとんどのCOSMICアプリで日本語入力がほぼ実用レベルに達しています。[COSMIC端末固有のIME対応を行うPull Request](https://github.com/pop-os/cosmic-term/pull/753)はCOSMIC開発チームのレビュー完了を待っている状態です。

|アプリ名|最新版|状況|詳細|
|-|-|-|-|
|COSMIC端末<br>`cosmic-term`|1.0.12|<strong style="color: red">未対応</strong>|ターミナル固有画面が未対応|
|COSMIC<br>テキストエディター<br>`cosmic-edit`|1.0.12|対応済|
|COSMICファイル<br>`cosmic-files`|1.0.12|対応済||
|COSMIC設定<br>`cosmic-settings`|1.0.12|対応済||
|COSMICストア<br>`cosmic-store`|1.0.12|対応済|検索欄で対応。<br>ただし検索対象データは英語のみ。|
|COSMIC<br>Media Player<br>`cosmic-player`|1.0.12|対応済|フォルダ・ファイル選択で対応|
|Launcher<br>`cosmic-launcher`|1.0.12|対応済|
|Applications<br>`cosmic-app-library`|1.0.12|対応済|

### その他多くのGTK/Qtアプリ

COSMICデスクトップ環境の[Waylandコンポジタ](https://ja.wikipedia.org/wiki/Wayland#Wayland%E3%82%B3%E3%83%B3%E3%83%9D%E3%82%B8%E3%82%BF)である`cosmic-comp`は最近まで[Waylandネイティブのインプットメソッド動作ではIMEの候補ウィンドウの表示位置がおかしい問題](https://github.com/pop-os/cosmic-comp/issues/1530)があり、[`GTK_IM_MODULES`環境変数や`QT_IM_MODULES`環境変数](https://wiki.archlinux.jp/index.php/Fcitx5#IM_%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB)の設定が必要でした。

2026/05/09ごろにPop!_OSや[Fedora COSMIC Nightly Release](https://copr.fedorainfracloud.org/coprs/ryanabx/cosmic-epoch/)に配信された`cosmic-comp`では[Waylandネイティブのインプットメソッド動作への改善](https://github.com/pop-os/cosmic-comp/pull/2320)が含まれており、2025/05/09現在では`GTK_IM_MODULES`、`QT_IM_MODULES`環境変数を設定なしに変更したほうが適切な動作をする状態となっています。このあたりも含めた最新の日本語入力設定の方法については別記事にて説明する予定です。

---

## まとめ

まもなく、COSMICアプリも含めた最低限の日本語入力対応は完了する見込みです。COSMIC Epoch 2の宣言はまだ先になると見込まれますが、COSMIC、Pop!_OSに興味のある日本語Linuxユーザーのみなさんは、ぜひテストして問題を見つけたら[GitHub Issueに報告](https://github.com/pop-os/cosmic-epoch/issues/new/choose)してほしいです。
