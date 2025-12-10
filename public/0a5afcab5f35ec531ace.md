---
title: yarn のレジストリ修正とか
tags:
  - Node.js
  - npm
  - 備忘録
  - YARN
private: false
updated_at: '2023-04-24T08:02:41+09:00'
id: 0a5afcab5f35ec531ace
organization_url_name: null
slide: false
---
# yarnとnpmはやれることは同じ

基本的にyarnpkg,npmはやれることは同じです。

# 今回起きた問題

```
info No lockfile found.
[1/4] Resolving packages...
error An unexpected error occurred: "http://localhost:4873/@mui%2fmaterial: connect ECONNREFUSED ::1:4873".
info If you think this is a bug, please open a bug report with the information provided in "C:\\Users\\nknig\\_varius\\V\\yarn-error.log".
info Visit https://yarnpkg.com/en/docs/cli/install for documentation about this command.

```

これは前にデバックのしやすさの為にローカルでライブラリを管理していたのですが、それでレジストリの修正をしたのが原因だったようです。

もとに戻します()

# やり方

```
npm config set registry "http://registry.npmjs.org/"
```
これだけです。
ちなみにgithub packagesを使っている人は npm.pkg.github.comになるっぽいです。適宜読み替えてくださいナ。

それじゃ👍

## 参考記事

https://qiita.com/ymaru/items/cf513ab05fe0ebac7d3b

## 個人PJ

https://github.com/nknighta/v
