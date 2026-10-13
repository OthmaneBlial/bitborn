# bitborn — 生のビットからソフトウェアを作る

[サイトで試す](https://othmaneblial.github.io/bitborn/) · [詳しい README](../../../README.md) · [言語](../README.md)

x86 プログラムの実際のバイトを、0 と 1 で直接書きます。Bitborn の命令は
`.bits` ファイルに手書きされており、アセンブラやコンパイラがオペコード、
オペランド、分岐の変位を生成することはありません。コメント内の命令名はバイトの
説明です。Python ツールはバイトをまとめ、ファイルヘッダーやセクターの構造を
加えます。学習用サイトは JavaScript で動きます。

## 最初の命令を読む

```text
10111000 00101010 00000000
```

オペランドサイズが 16 ビットの場合、この 3 バイトは `MOV AX,42` を表します。
`B8` がレジスターを選び、`2A 00` が下位バイトから順に 42 を格納します。
実行モードが重要です。オペランドサイズが 32 ビットなら、`B8` の後には即値の
バイトが 2 個ではなく 4 個必要です。ブラウザーの CPU Lab が実行するのは、
文書に記載された 16 ビット命令の一部だけです。

## 試してみる

[CPU Lab](https://othmaneblial.github.io/bitborn/cpu-lab/) では、命令を 1 ステップずつ
実行し、レジスター、フラグ、スタック、メモリーを確認できます。Back と Forward
で記録済みの状態を復元できます。[ブートセクターの編集ツール](https://othmaneblial.github.io/bitborn/boot-builder/)
では、512 バイトの完全なイメージを編集して書き出せます。チャレンジでは実際の
バイトを変更しながら学びます。進捗はブラウザー内に保存されます。

実際のブートプログラムを作成・検証するには Python 3.10+、Make、QEMU が必要です。
macOS では `brew install qemu nasm ffmpeg`、Ubuntu では
`sudo apt-get install python3 make qemu-system-x86 nasm ffmpeg` を実行します。

全検証では、NASM に付属する NDISASM で既存の命令バイトを読み、FFmpeg で収録した GIF のピクセルを検証します。どちらも対象プログラムの命令を生成しません。

```sh
git clone https://github.com/OthmaneBlial/bitborn.git
cd bitborn
make test
make run
```

`make test` は確認済みのバイトと、画面を開かずに動かす QEMU 内での振る舞いを
検証します。`make run` は BIOS ブートイメージを起動します。BIOS の例は Apple
Silicon 上でも QEMU で動作します。ネイティブ ELF の例には Linux x86-64 が必要です。
ブラウザーの開発用テストには Node.js と Playwright も必要です。貢献ガイドをご覧ください。

## 対象範囲と進捗

BIOS ブートプログラム、キーボード・VGA・ディスクの実験、対話型シェル、独立した
プロテクトモードの割り込み実験、Linux ELF の例を収録しています。ブラウザーは
1 MiB のメモリーと 4,096 ステップに制限された学習用モデルであり、完全な CPU や
BIOS ではありません。読み込んだプログラムを解釈し、ホストのネイティブコードとして
実行することはありません。実機、UEFI、本番用 OS の対応は確認されていません。
ネイティブ実験には使い捨てのエミュレーター環境を使用してください。

[ロードマップと検証記録](../../../ROADMAP.md) · [サイトの進捗](https://othmaneblial.github.io/bitborn/roadmap/) · [変更履歴](../../../CHANGELOG.md)

[入門チュートリアル](../../tutorials/from-bits-to-boot.md)と[アーキテクチャガイド](../../architecture/README.md)
から始められます。[貢献ルール](../../../CONTRIBUTING.md)と[行動規範](../../../CODE_OF_CONDUCT.md)
を守ってください。脆弱性は[非公開で報告](../../../SECURITY.md)してください。
コードと文書は [MIT ライセンス](../../../LICENSE)です。英語の紹介文を翻訳の基準とし、
詳しい技術ガイドは現在も英語で提供しています。
