---
title: "ブログエディターをつくったのでテストで記事を投稿してみる"
emoji: "📝"
type: "tech"
topics: []
published: true
---

どうもあまみやです。

MicroCMS公式のエディターが使いづらくかったので、AIとMicroCMS js sdkを使って自分用のエディターを作ってみました。   
エディターの投稿テストも兼ねてメモを残しておきます。

## 概要

フロントエンド: React   
バックエンド: Honojs   
アカウント認証: Clerk+パスキー 4  
ホスティング:Cloudflare(Cloudflare Workers)   
DNS: Cloudflare(DNSのみでドメインの管理は別サービス)   
DB:NeonDB コーディングエージェントはAntigravityです(Claude高い...)

## 開発中の工夫点

・エージェントにAPIキーを渡さないようパスワードマネージャーからキーを読み込む方式に変更   
・Geminiを併用しモックを事前に制作することで イメージしたUIに近づける

## 動作テストです★

### コードブロック

```typescript const test: string = "Test";   
console.log(test);   
```

## 改善点

・コードブロックなどがプレビューでうまく変換されない   
・読み込みが遅い   
・画像アップロードAPIへうまくリクエストを送れない 変更点があれば追記しますねー
