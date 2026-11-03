---
title: "【ALCOM+Steam】LinuxでVRChatをはじめよう"
emoji: "👓"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["VRChat","Ubuntu"]
published: true
---
※blogで書いたもののZenn版です

## まえがき

Googleサーチコンソールやアナリティクスを見ていたら、Ubuntuで改変する記事が思いの外需要があったので、今回はインストールから書いてみました。

いろいろ思い出しながら書いているので、間違っているかも；；；

※記事作成にAIを使用しています

なにか修正点があれば別途修正します

## 環境

- OS: Ubuntu 26.04.1 LTS
- PC: ASUS ROG Flow X13(Ryzen 9 5900HS / GTX 1650 with Max-Q)

## 必要なもの

- Steam\
  Ubuntu用。CPUのアーキテクチャに応じてインストールしてください。
- ALCOM\
  公式のVCCはWindows以外では(多分)基本動かないので、サードパーティのALCOMを使います。
- Vulkan\
  OSを入れた時点で入っていると思いますが、改変でliltoonを使う際に必要になります。
- Unity Hub\
  Unityの導入と、ALCOMでエラーが出たとき用です。

## 手順

### プレイ

いつもどおりSteamからVRChatを入れてください

注意:LinuxだとPCVRうまく動かせない模様.…\
スペック不足の場合もありますがかなり不安定です

### 改変周り

1. [ALCOM公式サイト](https://vrc-get.anatawa12.com/ja/alcom/)からALCOMのAppImageをダウンロードする
2. AppImageを任意のディレクトリに移動する\
   このとき、フルパスをメモしておく\
   実行権限がないと起動できないので、`chmod +x <AppImageのファイル名>` で付けておく
3. Unity HubからUnityをダウンロードする\
   VRChat推奨のバージョンを入れてください。少し前のバージョンを使うため、Unity Hubに出てこない場合はサイトなどからダウンロードします。警告が出ますが無視でOKです。
4. ALCOMのデスクトップエントリを作る(Iconは任意)\
   `~/.local/share/applications/alcom.desktop` として、次の内容で保存する

```
[Desktop Entry]
Name=Alcom
Exec=<Installed DIR>/alcom.AppImage --no-sandbox
Icon=<Installed DIR>/alcom.png
Type=Application
Categories=Development
```

1. SuperKey+Aでアプリ一覧から起動(反映されない場合は一旦ログアウトor再起動)

ALCOMの操作はVCCとあんまり変わらないですし、他にもっと説明上手な人がいると思うので割愛します;;;

## 注意点

### Unityが起動せず、libxml2が見つからない

ALCOMからUnityが起動できないときは、シェルから直接Unityを起動するとエラーの内容が分かります。

```
error while loading shared libraries: libxml2.so.2: cannot open shared object file: No such file or directory
```

`apt install libxml2` ではインストールできませんでした。既存のlibxml2に、`libxml2.so.2` という名前のシンボリックリンクを張ると解決します。

```bash
find /usr/lib /lib -name "libxml2.so*" 2>/dev/null

# シンボリックリンクを追加
sudo ln -sf /usr/lib/x86_64-linux-gnu/libxml2.so /usr/lib/x86_64-linux-gnu/libxml2.so.2
sudo ldconfig
```

ファイル名のバージョンは環境によって違うので、`find` の結果を見て確認してください。

リンクを張ったあとは、シェルから次のように直接起動もできます(`2022.3.22f1` の部分は、入れたUnityのバージョンに合わせてください)。

```bash
<HOME_DIR>/Unity/Hub/Editor/2022.3.22f1/Editor/Unity -projectPath <Unityプロジェクトのパス>
```

### liltoonでアバタービルドがエラーになる

liltoonでの改変時にアバタービルドでエラーが出た場合は、Vulkanモードで起動するとビルドが通りました。

- シェルから起動する場合

```bash
<HOME_DIR>/Unity/Hub/Editor/2022.3.22f1/Editor/Unity -force-vulkan -projectPath <Unityプロジェクトのパス>
```

- ALCOMから起動する場合: 起動オプションに `-force-vulkan` を指定する

## 参考リンク

- [過去記事: VRChatのUnity環境をUbuntuで(ALCOMの注意点など)](https://nknighta.me/blog/vrc-unity-on-ubuntu/?utm_source=nknighta_site&utm_medium=blog&utm_campaign=article_link&utm_content=20261005-vrc-alcom)
- ALCOM : [https://booth.pm/ja/items/6448396](https://booth.pm/ja/items/6448396)
