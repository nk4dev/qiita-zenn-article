---
title: "VX3のご紹介 | 私がWeb3で実現したいこと"
emoji: "🌐"
type: "idea" # tech: 技術記事 / idea: アイデア
topics: ["Web3", "ether","etherium"]
published: false
---

Blogで書いたもののZenn・Qiita版です。

こんにちは、あまみやです。

今回は私が学生時代から研究開発している開発者向けWeb3SDKであるVX3を紹介しようと思います。

注意

このSDKは現在開発中です。

今後破壊的な変更が入る可能性が高いです。

対象読者





エンジニア



Web3に興味がある方

VX3の概要

VX3は大きなプロジェクトの中にSolidityコンパイラやウォレットの作成・接続、NFTのミントやデプロイ、ブロックチェーンと接続するためのフックがあり、それらの機能に専用のSDKを介してアクセスします。

これまではこれらの機能をHardhatなどバラバラなライブラリやツールを導入する必要がありましたが、それらをVX3のみですべて完結させることを目指しています。

なぜ作ったのか

もともとWeb3に入るきっかけは、高校生の時に聴いていた"Off Topic"というPodcast(現在は終了)でした。

ここでNFTやWeb3についての話題が出てきて興味を持ったことが、一つ目のきっかけでした。

もう一つはYouTubeやXで好きな絵師が突然イラストを消されたり、アカウントがBANになってしまうのを何度も目の当たりにしたことで、クリエイターを守るためのプラットフォームを作りたいと決意したのもあります。

可能になること





ウォレットの作成、作成済み / 外部ウォレットとの接続



NFTのミント・販売



暗号資産 / ステーブルコインでの支払い



独自Solidityコンパイラ (VXC) によるスマートコントラクトの高速コンパイル



リアルタイム開発ダッシュボード (Gas代監視・RPCレイテンシ計測)



React / Vue 3 向けフロントエンドUIコンポーネント (ウォレット接続・決済モーダル)



AIエージェント向け公式スキル (Claude Code, Cursor等に対応)

対応ウォレットプロバイダー・ブロックチェーン(予定)

ウォレット





MetaMask



Coinbase



Rainbow

ブロックチェーン





Polygon



Infura

未対応プロバイダーでもAPI経由で接続できるようにする予定です。

クイックスタート

vx3 は Bun や npm を使って手軽に導入・試すことができます。

# インストール
bun add -g vx3

# プロジェクトの作成
bunx vx3 create my-web3-app

# リアルタイム開発ダッシュボードの起動
vx3 dash


内蔵コンパイラ (VXC) により、Hardhat等の外部ツール不要でコントラクトのコンパイルも完結します。

# スマートコントラクトのコンパイル
vx3 compile


課題





各国の暗号資産法規制への対応



Reactなどフロントエンドコンポーネントの安定性向上

今後の予定

上記の課題に加えて





node構築機能の追加



不足機能追加・不具合の改善



ドキュメントやエージェント向けskillの改良

リンク

repos:

VX3

github.com/nk4dev/vx3

SDK

github.com/nk4dev/vx

Docs

https://github.com/nk4dev/vx-docs

公式ドキュメント: https://vx.nknighta.me/

Skill

https://vx.nknighta.me/skills/

またZennのスクラップに開発の様子とかメモってます。

VX-WEB3 開発メモ

https://zenn.dev/nknight_amamiya/scraps/08b4d28f747553

Web3/Web5勉強・研究

https://zenn.dev/nknight_amamiya/scraps/5e5548b42d1961

おわりに

VX3はクリエイターを守り、Web3開発をすべてのエンジニアにとって身近にすることを目指して開発を進めています。

まだ開発初期段階のため、バグ報告や機能提案、コントリビュートなどのフィードバックをお待ちしています。GitHubでのStarもよろしくお願いします

余談

AIとNotionを使って下書きをしたんすが、

AntigravityがNotionのCLIツールを全然認識してくれないし、文章が胡散臭いしですごく微妙でした
