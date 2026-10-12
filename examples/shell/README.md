# A binary shell that loads a separate disk app

**Environment:** real-mode x86 BIOS. The existing loader at `0000:7C00` reads this 813-byte shell into `0000:7E00`; `run` reads a separately authored 150-byte app into `0000:9000`. Both execute actual CPU instructions in QEMU. The browser teaching model does not support the shell's complete BIOS, parser and string-instruction subset.

[Canonical literal source](program.bits) · [Every byte explained](bytes.md) · [Separate app](../shell-app/README.md)

Type exact lowercase commands followed by Enter:

| Command | Actual behavior |
| --- | --- |
| `help` | List all nine commands. |
| `about` | State the real-mode BIOS and separate-app scope. |
| `clear` | Reset VGA text mode; serial history remains. |
| `reboot` | Invoke BIOS bootstrap, not a power cycle. |
| `dump` | Read and display sixteen actual RAM bytes at physical `0600` through `060F`. |
| `regs` | Capture eight GPRs, four segments and FLAGS in actual RAM, then print the sampled words. |
| `write` | Store the fixed byte `2A` at physical `0600`. |
| `read` | Read and display the actual byte at physical `0600`. |
| `run` | BIOS-read disk sectors 4–5, check carry, call the app and return to the prompt. |

The input accepts up to fifteen printable ASCII characters, handles Backspace, ignores unsupported control bytes and rejects unknown commands or added operands. `write` and `read` deliberately expose one fixed RAM experiment, rather than unrestricted memory access. The sixteen-byte window starts at zero and the separate app writes its computed result to `0601`.

## Register sampling

Sampling begins at shell offset **309**, physical **7F35**, immediately after exact matching of `regs`, before output calls. `MOV` stores preserve flags. The shell captures SP before PUSHF, then stores the actual pushed FLAGS word. Values represent the command handler at that sampling point, including parser work; they are not BIOS-entry values or continuously live registers. Output columns are:

`AX BX CX DX SP BP SI DI CS DS ES SS FL`

The thirteen little-endian words occupy `0500` through `0519`. For example, CX is four after entering `regs`, DI is `8205` after its NUL terminator, and SP is `7C00` outside BIOS calls. A CPU inspection while the prompt waits inside BIOS INT 16 instead sees BIOS working registers and a temporarily deeper interrupt stack. The QEMU tests compare the printed words with the actual sampled RAM and check that the disk app returns with the handler stack balanced.

## Literal disk layout

| CHS sector | File offset | Bytes | Loaded physical address |
| --- | --- | --- | --- |
| 1 | `0000` | Shared loader padded to 510 bytes plus `55 AA` | `7C00` |
| 2–3 | `0200` | Shell plus zero padding to 1024 bytes | `7E00` |
| 4–5 | `0600` | Separate app plus zero padding to 1024 bytes | `9000` |

The 2560-byte image contains no filesystem or generated instructions. `targets.json` records reviewed source sizes/hashes and the appended payload layout. The minimal host-side packaging is `bios_sector(loader) + shell + zero_padding_to_1024 + app + zero_padding_to_1024`. Only the shared loader receives a BIOS boot signature; the app is a near-call program, not a second boot sector.

The loader establishes segment-zero registers and the stack. The shell preserves the BIOS drive number at `0520` before COM1 initialization changes DX. The disk command requests cylinder zero, head zero, sectors four and five with INT 13/AH=02; carry jumps to `Disk read failed` and returns to the prompt without calling the failed buffer. There is no arbitrary disk selection or host execution. General filesystems, app discovery and protected mode remain outside this example.

Run `python3 -m unittest tests.test_shell` for native QEMU proof of all commands, real memory writes/reads and dumps, sampled registers, printable input limits, Backspace, exact matching, VGA clearing, reboot, app bytes loaded from disk, repeated app returns and the actual BIOS carry-error path. The error fixture changes the reviewed sector operand to invalid CHS sector zero; the executable program stays within the isolated guest. Source and explanations were developed with AI assistance and independently checked in QEMU.
