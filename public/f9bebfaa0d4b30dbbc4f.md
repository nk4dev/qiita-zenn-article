---
title: 超個人的、PowershellとTerminal(Linux)のコマンドの違い
tags:
  - Windows
  - Linux
  - Terminal
  - PowerShell
  - 備忘録
private: false
updated_at: '2023-04-02T18:15:31+09:00'
id: f9bebfaa0d4b30dbbc4f
organization_url_name: null
slide: false
---
題名からしてわかりにくいのですが、要はWindowsとLinuxのコマンドがどういう風に違うのかまとめです。

毎度毎度の備忘録です。

ちなみにslコマンドはLinuxだとうまく使えない感じ...かな?　間違ってたらすみません（；∀；）

使用してるバージョンはPowershell core v7.3.0です

| Powershell | Terminal | 用法|
| --- | --- | --- |
| ls | ls -l | カレントディレクトリの内容確認 |
| cat | cat | 指定したファイルの確認 |
cd.. or cd .. | cd .. | 上位ディレクトリに戻る Linuxではスペース必須|
sl (/go/to/home) | (error) | |
Copy-Item  | copy | ファイルのコピー。Powershellではディレクトリは-Recurse オプションをつける
| ipconfig | ifconfig
Remove-Item | rm | ファイルまたはディレクトリ削除
## Powershellのみ

| command | |
| --- | --- 
clear | 表示をすべてリセット

