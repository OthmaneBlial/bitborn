# bitborn — 从原始比特构建软件

[体验网站](https://othmaneblial.github.io/bitborn/) · [完整 README](../../../README.md) · [语言](../README.md)

直接用 0 和 1 写出 x86 程序的实际字节。Bitborn 的目标指令手写在 `.bits`
文件中：操作码、操作数和跳转位移都不是由汇编器或编译器生成的。注释中的指令名称
只用于解释字节。Python 工具负责打包字节，添加文件头或磁盘扇区封装；JavaScript
驱动教学网站。

## 读懂第一条指令

```text
10111000 00101010 00000000
```

在 16 位操作数大小的上下文中，这三个字节表示 `MOV AX,42`。`B8` 选择寄存器，
`2A 00` 以低字节在前的顺序存储 42。执行模式很重要：在 32 位操作数大小的上下文中，
`B8` 后面需要四个立即数字节，而不是两个。浏览器 CPU 实验室只执行文档中列出的
16 位指令子集。

## 动手试试

打开 [CPU 实验室](https://othmaneblial.github.io/bitborn/cpu-lab/)，逐步执行程序，
查看寄存器、标志位、栈和内存，或用 Back 和 Forward 恢复已记录的状态。
[启动扇区构建器](https://othmaneblial.github.io/bitborn/boot-builder/) 可编辑并导出
完整的 512 字节镜像。挑战题通过修改实际字节来帮助学习；进度保存在你的浏览器中。

构建并测试真实启动程序需要 Python 3.10+、Make 和 QEMU。在 macOS 上运行
`brew install qemu nasm ffmpeg`；在 Ubuntu 上运行 `sudo apt-get install python3 make qemu-system-x86 nasm ffmpeg`。

完整检查还使用 NASM 提供的 NDISASM 读取现有指令字节，并用 FFmpeg 验证录制的 GIF 像素。这两个工具都不生成目标指令。

```sh
git clone https://github.com/OthmaneBlial/bitborn.git
cd bitborn
make test
make run
```

`make test` 检查已审核的字节，并在无图形界面的 QEMU 中验证虚拟机行为。
`make run` 打开 BIOS 启动镜像。BIOS 示例可在 Apple Silicon 上通过 QEMU 运行；
原生 ELF 示例需要 Linux x86-64。浏览器开发检查还需要 Node.js 和 Playwright，
详见贡献指南。

## 范围与进度

仓库包含 BIOS 启动程序、键盘/VGA/磁盘实验、交互式 shell、独立的保护模式中断实验
和 Linux ELF 示例。浏览器只是有界教学模型：内存为 1 MiB，最多执行 4,096 步，
并非完整 CPU 或 BIOS。导入的程序通过解释执行，不会作为宿主机原生代码运行。
尚未证明支持真实硬件、UEFI 或生产级操作系统。原生实验请使用可丢弃的虚拟机环境。

[当前路线图与验证证据](../../../ROADMAP.md) · [网站进度](https://othmaneblial.github.io/bitborn/roadmap/) · [变更日志](../../../CHANGELOG.md)

从[入门教程](../../tutorials/from-bits-to-boot.md)和[架构指南](../../architecture/README.md)
开始。贡献须遵守[源代码规则](../../../CONTRIBUTING.md)和[行为准则](../../../CODE_OF_CONDUCT.md)。
漏洞请[私下报告](../../../SECURITY.md)。代码与文档采用 [MIT 许可证](../../../LICENSE)。
本页以英文简介为翻译基准；详细技术指南目前仍为英文。
