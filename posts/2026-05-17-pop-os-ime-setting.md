---
title: "Pop!_OS 24.04の日本語入力設定(2026/05)"
date: 2026-05-17
description: "Pop!_OS 24.04でのCOSMICデスクトップの日本語入力設定を説明します。"
categories: Development
tags: [COSMIC, Linux, "Pop!_OS", "日本語入力"]
image: "/images/2026-05-17-pop-os-ime-setting/pop-ime-config.png"
published: true
---

2026/05版の手順を説明します。以降の手順はPop!_OS 24.04のARM64版をMac上のUTM仮想マシンに新規インストールして確認したものです。大雑把な手順は次のとおり。

1. [パッケージを最新に更新](#パッケージを最新に更新)
2. [`fcitx5-mozc`パッケージをインストール](#fcitx5-mozcパッケージをインストール)
3. [Fcitx 5の自動起動を設定](#fcitx-5の自動起動を設定)
4. [環境変数を設定](#環境変数を設定)
5. [再起動](#再起動)

各手順の詳細と動作確認方法が続きます。

![](/images/2026-05-17-pop-os-ime-setting/pop-ime-config.png)


## 手順詳細

### パッケージを最新に更新

```sh
$ sudo apt update && sudo apt upgrade
```

COSMICストアで更新することもできるはず。

### `fcitx5-mozc`パッケージをインストール

日本語入力にMozcを使う場合、`fcitx5-mozc`パッケージをインストールします。その他必要なパッケージは依存関係により自動的にインストールされます。

```sh
$ sudo apt install fcitx5-mozc
```

### Fcitx 5の自動起動を設定

COSMIC設定の「スタートアップアプリケーション」に設定するのが簡単です。

1. COSMIC設定を開く
2. 「アプリケーション」の「スタートアップアプリケーション」を開く<br>![](/images/2026-05-17-pop-os-ime-setting/autostart1.png)
3. 「アプリを追加」ボタンをクリック
4. 「Fcitx 5」を検索して「追加」をクリック<br>![](/images/2026-05-17-pop-os-ime-setting/autostart2.png)

以下の画面になったら設定完了。

![](/images/2026-05-17-pop-os-ime-setting/autostart3.png)

自動起動の設定は再起動後に有効になります。

### 環境変数を設定

2026/05/17現在、Pop!_OSではデフォルトで以下の環境変数が設定されています。これを解除(設定なしに)します。

```sh
$ echo $GTK_IM_MODULE, $QT_IM_MODULE, $XMODIFIERS
ibus, ibus, @im=ibus
```

ホーム画面の `.profile` ファイルの末尾に次の内容を書き足します。

```sh
unset GTK_IM_MODULE
unset QT_IM_MODULE
unset XMODIFIERS
```

ブラウザやCOSMICアプリ以外のGTKやQtのアプリは、これらの環境変数の有無でIMEの動作が変わります。具体的には設定なしの場合はWaylandの仕組みで、設定ありの場合は(`fcitx`と書いていなくても)GTKやQt固有の仕組みでIMEの動作をするようになります。

[2026/05/09以降はWaylandネイティブのIME動作への改善が入った](/posts/2026-05-09-cosmic-ja-status#その他多くのgtk/qtアプリ)関係で、これらの環境変数設定なしのほうがより適切な動作になります。

### 再起動

[「Fcitx 5の自動起動を設定」](#fcitx-5の自動起動を設定)で適切なタイミングでFcitx 5のサーバーを起動するため、また[「環境変数を設定」](#環境変数を設定)を反映させるため、ここでPop!_OSを再起動します。

## 動作確認

### 自動起動・基本動作の確認

再起動・ログイン後、パネルにキーボードのアイコン（入力ソースアプレット）が表示されていれば、Fcitx 5が正常に起動しています。右クリックすると次の表示になります。

表示されていなければ[「Fcitx 5の自動起動を設定」](#fcitx-5の自動起動を設定)を再確認してください。

![](/images/2026-05-17-pop-os-ime-setting/check1.png)

アプリを開き、「半角／全角」「漢字」「Ctrl+スペース」などのキーでIMEを有効にします。MacのUTMなど仮想マシンで有効なキーボードショートカットがない場合は、ひとまず上記パネルのキーボードアイコンをクリックすると日本語入力(Mozc)に切り替わります。

この状態で意図通り日本語入力ができるはずです！

![](/images/2026-05-17-pop-os-ime-setting/check2.png)

### IMEオン・オフキーのカスタマイズ

IMEを有効にするキーやキーボードショートカットを設定する場合は上記パネルのキーボードアイコン右クリックから「設定」メニューを選択して「Fcitxの設定」を開きます。

![](/images/2026-05-17-pop-os-ime-setting/fcitx5-configtool.png)

「グローバルオプション」タブの「入力メソッドの切り替え」「入力メソッドを有効にする」「入力メソッドをオフにする」などの設定を使いやすいように変更してください。

たとえば、Macの仮想マシンでは「無変換」キー(印字は「ABC」キー)で「入力メソッドをオフにする」、「変換」キー(印字は「あいう」キー)で「入力メソッドを有効にする」とするとホストのMacと同じようにIMEをオン・オフできます。

### 環境変数の確認

COSMICアプリ以外、たとえばFirefoxで日本語入力をテストします。つぎのように正しい位置に候補ウィンドウが表示されていればうまく動作しています。

![](/images/2026-05-17-pop-os-ime-setting/firefox-ok.png)

つぎのように候補ウィンドウの位置がおかしい場合は[「環境変数を設定」](#環境変数を設定)の手順を再確認してください。

![](/images/2026-05-17-pop-os-ime-setting/firefox-ng.png)

つぎのコマンドでこれらの環境変数が設定されていないことも確認します。
```sh
$ echo $GTK_IM_MODULE, $QT_IM_MODULE, $XMODIFIERS
, ,
```

## 参照

- [fcitx5の公式から見る2026年の設定事情](https://blazechariot.netlify.app/blog/fcitx5-settings-2026/)
  - `GTK_IM_MODULE`, `QT_IM_MODULE` 等の動作について詳しく解説してくれています。今回手順の作成では考慮していませんが、参考になりそうです。
- [Pop!_OS：日本語入力をiBusからFcitx5へ変更｜Histone](https://note.com/histone/n/n29b89d229db2)
  - 少し古い記事ですが、Fcitx 5の自動起動をスタートアップアプリケーションで設定すればシンプルだというインスピレーションはこちらの方から得ています。
