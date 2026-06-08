---
title: "Fedora COSMIC Spin 44の日本語入力設定(2026/05)"
date: 2026-05-17
description: "Fedora 44でのCOSMICデスクトップの日本語入力設定を説明します。"
categories: Development
tags: [COSMIC, Linux, "日本語入力"]
image: "/images/2026-05-17-fedora-cosmic-ime-setting/fedora-cosmic-ime.png"
published: true
---

2026/05版の手順を説明します。以降の手順はFedora COSMIC Spin 44のARM64版をMac上のUTM仮想マシンに新規インストールして確認したものです。[Pop!_OS 24.04の日本語入力設定(2026/05)](/posts/2026-05-17-pop-os-ime-setting) と大筋は同じです。

大雑把な手順は次のとおり。

1. [パッケージを最新に更新](#パッケージを最新に更新)
2. [`fcitx5-mozc`パッケージをインストール](#fcitx5-mozcパッケージをインストール)
3. [環境変数を設定](#環境変数を設定)
4. [Fcitx 5の自動起動を設定](#fcitx-5の自動起動を設定)
5. [再起動](#再起動)
6. [自動起動の確認](#自動起動の確認)
7. [Mozcの設定](#mozcの設定)

各手順の詳細と動作確認方法が続きます。

![](/images/2026-05-17-fedora-cosmic-ime-setting/fedora-cosmic-ime.png)


## 手順詳細

### パッケージを最新に更新

```sh
$ sudo dnf update
```

COSMICストアで更新することもできるはず。

### `fcitx5-mozc`パッケージをインストール

日本語入力にMozcを使う場合、`fcitx5-mozc`パッケージをインストールします。その他必要なパッケージは依存関係により自動的にインストールされます。

```sh
$ sudo dnf install fcitx5-mozc
```

### 環境変数を設定

2026/05/17現在、Fedora COSMIC SpinでCOSMICのログイン画面(`cosmic-greeter`)でログインするとUIの言語が英語になってしまいます。続く設定もわかりにくいですし、ここで調整します。

もっといい方法がありそうですが、`.bash_profile`ファイルの末尾に以下の設定を追加します。

```sh
export LANG=ja_JP.UTF-8
```

再ログインするとUIの言語が日本語になります。

### Fcitx 5の自動起動を設定

COSMIC設定の「スタートアップアプリケーション」に設定するのが簡単です。

1. COSMIC設定を開く
2. 「アプリケーション」の「スタートアップアプリケーション」を開く<br>![](/images/2026-05-17-fedora-cosmic-ime-setting/autostart1.png)
3. 「アプリを追加」ボタンをクリック
4. 「Fcitx 5」を検索して「追加」をクリック<br>![](/images/2026-05-17-fedora-cosmic-ime-setting/autostart2.png)

以下の画面になったら設定完了。

![](/images/2026-05-17-fedora-cosmic-ime-setting/autostart3.png)

自動起動の設定は再起動後に有効になります。

### 再起動

[「Fcitx 5の自動起動を設定」](#fcitx-5の自動起動を設定)で適切なタイミングでFcitx 5のサーバーを起動するため、ここでFedoraを再起動します。

### 自動起動の確認

再起動・ログイン後、パネルにキーボードのアイコン（入力ソースアプレット）が表示されていれば、Fcitx 5が正常に起動しています。右クリックすると次の表示になります。

表示されていなければ[「Fcitx 5の自動起動を設定」](#fcitx-5の自動起動を設定)を再確認してください。

![](/images/2026-05-17-fedora-cosmic-ime-setting/check1.png)

### Mozcの設定

1. 上記メニューの「入力メソッドの設定」から「Fcitxの設定」を開きます。
2. 「有効な入力メソッド」で「Mozc」を選択してダブルクリックします。（「＜」ボタンやEnterキーでも可。）<br>![](/images/2026-05-17-fedora-cosmic-ime-setting/add-mozc1.png)
3. 「現在の入力メソッド」に「Mozc」が追加されたことを確認して「OK」で設定を閉じます。<br>![](/images/2026-05-17-fedora-cosmic-ime-setting/add-mozc2.png)
4. 再び、パネルのキーボードアイコンを右クリックして、つぎのようにMozcのアイコンが追加されていればOKです。<br>![](/images/2026-05-17-fedora-cosmic-ime-setting/add-mozc3.png)

## 動作確認

アプリを開き、「半角／全角」「漢字」「Ctrl+スペース」などのキーでIMEを有効にします。MacのUTMなど仮想マシンで有効なキーボードショートカットがない場合は、ひとまず上記パネルのキーボードアイコンをクリックすると日本語入力(Mozc)に切り替わります。

この状態で意図通り日本語入力ができるはずです！

![](/images/2026-05-17-fedora-cosmic-ime-setting/check2.png)

### IMEオン・オフキーのカスタマイズ

IMEを有効にするキーやキーボードショートカットを設定する場合は上記パネルのキーボードアイコン右クリックから「設定」メニューを選択して「Fcitxの設定」を開きます。

![](/images/2026-05-17-fedora-cosmic-ime-setting/fcitx5-configtool.png)

「グローバルオプション」タブの「入力メソッドの切り替え」「入力メソッドを有効にする」「入力メソッドをオフにする」などの設定を使いやすいように変更してください。

たとえば、Macの仮想マシンでは「無変換」キー(印字は「ABC」キー)で「入力メソッドをオフにする」、「変換」キー(印字は「あいう」キー)で「入力メソッドを有効にする」とするとホストのMacと同じようにIMEをオン・オフできます。

## 参照

[Pop!_OS 24.04の日本語入力設定(2026/05)](/posts/2026-05-17-pop-os-ime-setting) の記事と同様です。

> - [fcitx5の公式から見る2026年の設定事情](https://blazechariot.netlify.app/blog/fcitx5-settings-2026/)
>   - `GTK_IM_MODULE`, `QT_IM_MODULE` 等の動作について詳しく解説してくれています。今回手順の作成では考慮していませんが、参考になりそうです。
> - [Pop!_OS：日本語入力をiBusからFcitx5へ変更｜Histone](https://note.com/histone/n/n29b89d229db2)
>   - 少し古い記事ですが、Fcitx 5の自動起動をスタートアップアプリケーションで設定すればシンプルだというインスピレーションはこちらの方から得ています。
