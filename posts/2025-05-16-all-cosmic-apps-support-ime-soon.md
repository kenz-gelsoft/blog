---
title: "COSMICアプリのIME対応が完了"
date: 2026-05-16
description: "COSMICデスクトップの主要アプリがすべてIME対応になりました"
categories: Development
tags: [COSMIC, Linux, "Pop!_OS", "日本語入力"]
image: "/images/2025-05-16-all-cosmic-apps-support-ime-soon/cosmic-term1.png"
published: true
---

[COSMICデスクトップの日本語入力対応状況(2026/05)](/posts/2025-05-09-cosmic-ja-status#cosmicアプリ)で唯一未対応としていた[COSMIC端末固有のIME対応](https://github.com/pop-os/cosmic-term/pull/753)がマージされました。COSMIC Epoch 1.0.14で今月中にはリリースされる見込みです。

つぎの画面のように`cosmic-term`のターミナル画面上で日本語入力ができるようになりました。

![](/images/2025-05-16-all-cosmic-apps-support-ime-soon/cosmic-term1.png)

なお、検索欄は[Epoch 1.0.9](https://github.com/pop-os/cosmic-epoch/releases/tag/epoch-1.0.9)からすでに[日本語入力ができるように](https://github.com/pop-os/libcosmic/pull/1182)なっていました。

> iced has been updated to a new upstream version, which brings performance improvements and additional features such as improved animation and **input method support**
>
> ---
> <cite>[Release COSMIC Epoch 1.0.9 · pop-os/cosmic-epoch](https://github.com/pop-os/cosmic-epoch/releases/tag/epoch-1.0.9)</cite>

画面下端で候補ウィンドウが正常に上向きに表示されるようになったのは[Epoch 1.0.13](https://github.com/pop-os/cosmic-epoch/releases/tag/epoch-1.0.13)での[`cosmic-comp`の対応](https://github.com/pop-os/cosmic-comp/pull/2320)と、それを前提とした[`cosmic-term`の`libcosmic`更新](https://github.com/pop-os/cosmic-term/pull/810)からです。

![](/images/2025-05-16-all-cosmic-apps-support-ime-soon/cosmic-term2.png)

> - cosmic-comp
>   - Fix IME popup positioning: [pop-os/cosmic-comp#2320](https://github.com/pop-os/cosmic-comp/pull/2320)
> ---
> <cite>[Release COSMIC Epoch 1.0.13 · pop-os/cosmic-epoch](https://github.com/pop-os/cosmic-epoch/releases/tag/epoch-1.0.13)</cite>

もちろん、1.0.14からはターミナル画面でもその対応が動きます。

![](/images/2025-05-16-all-cosmic-apps-support-ime-soon/cosmic-term3.png)

ターミナル画面でIME入力のテキストを確定した後、一時的に確定テキストが選択表示で残る動作がありますが、これは現状では意図したものです。System76が変更を受け入れやすくするため、IME利用に必要不可欠な対応のみをしています。

![](/images/2025-05-16-all-cosmic-apps-support-ime-soon/cosmic-term4.png)

米国PCメーカーであるSystem76にとっては、ハードウェアをあまり買ってくれるわけでもない極東のユーザーのために、社員がコミュニティからのパッチをコードレビューしてくれ、フィードバック・QAテストを実施してくれたおかげです。感謝しかない。
