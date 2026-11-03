---
title: '【Web3】wagmiを使ってMetamaskをNextjsアプリにつないでみた。 '
tags:
  - Next.js
  - Web3
  - METAMASK
  - wagmi
private: false
updated_at: '2024-01-25T13:47:05+09:00'
id: 4f7b3f2dbd9be1d17f1a
organization_url_name: null
slide: false
ignorePublish: false
---
# 追記
今年の初めにv2が公開され、実装方法が大幅に変わりました
のちのち書きます

https://wagmi.sh/react/guides/migrate-from-v1-to-v2
# 追記2
V2にアップデートしたコードについて投稿しました。

https://qiita.com/amamiya_dev/items/d0335da3c0ff025c3ffe

# 概要

いきなりですが、四年生専門学校の学生である私は最近来年から課題の準備をはじめていて、今回はWeb3向けのWebアプリを開発していこうかと思っています。

なのでまずはこの記事でMetamaskのウォレットを接続するためのロジックを作っていきます。

# ウォレットとか
細かい説明は省きますが、ウォレットについては以下にて

https://web3guide-jp.com/what-is-crypto-wallet-how-to-choose-the-appropriate-wallet-for-you/

# wagmiとは

https://do-you-imi.net/wagmi/6355/

wagmiとは We gonna make itという意味の文章で必ず成功させるという意味があるらしいです。
開発者さんの強い意志を感じますね💦

https://wagmi.sh/

そして今回使用するのがこちらになります。
簡単なコーディングで実装できてとても便利です。

## フレームワーク
今回は
- Nextjs 13.4 
- wagmi 1.4.5

のバージョンを使用します。

# いざ実装
まずはwagmiの設定とプロバイダーを設定していきます。

```tsx

import {WagmiConfig, createConfig, mainnet} from 'wagmi'
import {createPublicClient, http} from 'viem'

const config = createConfig({
    autoConnect: true,
    publicClient: createPublicClient({
        chain: mainnet,
        transport: http()
    }),
})

// 中略

export default function App({Component, pageProps}: AppProps) {
    return (
        <ChakraProvider>
            <WagmiConfig config={config}>
                <Component {...pageProps} />
            </WagmiConfig>
        </ChakraProvider>
    );
}

```

あとはNextAuthとかのような感じ(?)で実装すればOKです。


```tsx
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import Link from "next/link";
import { Button } from "@chakra-ui/react";

export const Wallet = () => {
    const {  isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()
    if (isConnected)
        return (
            <div>
                <Link href={"/account"}>Account</Link>
                <button onClick={() => disconnect()}>Disconnect</button>
            </div>
        )
    return <Button onClick={() => connect()}>Connect</Button>
}
```

app.tsxのautoconnectをtrueにするとしばらくはウォレットが接続された状態が維持されるのっぽいです。

今回は実装していませんがアカウントのアドレスも実装できます。

# おわりに
今回はウォレットの接続のみですが、そのうちトランザクション処理などもっといろいろな機能を実装していきたいです。

