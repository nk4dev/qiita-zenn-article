---
title: ZennとQiitaの記事同時公開ツールを作った
emoji: 🧑‍🚀
type: tech
topics:
  - github
  - zenn
published: false
organization_url_name: null
slide: false
ignorePublish: false
---
> [!warning]
> まだ調整中です

# 概要
たまにZennやQiitaにアウトプットをかねて投稿していいます。
それで両方のサイトにCLIツールがあるのですが、レポジトリを連携して記事を投稿する場合にリポジトリを分けるのが面倒だったので、単一のリポジトリで管理できるようにしました。

[oki07](https://github.com/oki07)さんの記事を参考に作成しました
prettierとかの設定はまだしてないです,,,(^ ^ ;

リポジトリ: https://github.com/nk4dev/qiita-zenn-article

# 構成
最初にZennの形式で記事を書いて、それをTypescriptでパースしてQiitaの形式に変換します。

## ディレクトリ構成
```
qiita-zenn-article
├── articles <= Zenn用
├── public <= qiita用
├── src
│   ├── ztoq.ts
│   └── lib
│       ├── index.ts
│       ├── convert-frontmatter.ts
│       ├── replace-image-paths.ts
│       ├── replace-message-to-note.ts
│       └── zenn-markdown-to-qiita.ts 
├── package.json
└── ...
```

# 参考
参考リポジトリ: https://github.com/oki07/zenn-qiita-contents/

Zennの記事 : https://zenn.dev/ot07/articles/zenn-qiita-article-centralized
