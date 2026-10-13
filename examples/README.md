# The handwritten examples gallery

All payloads are literal `.bits`, never generated from Assembly. Each source line
explains an opcode, operand or data range. `make build` writes the corresponding
binary unchanged; Linux ELF headers and BIOS sector framing are host packaging.
Every row below has a reproduction guide in its directory. The boot-sector
example uses the canonical source in `boot/`, avoiding a second divergent copy.

| Example | Environment | Expected behavior | Source / walkthrough |
| --- | --- | --- | --- |
| Return an exit code | Linux x86-64 | Exit 42 | [exit-code](exit-code/README.md) |
| Smaller exit payload | Linux x86-64 | Same exit 42 in 8 payload bytes; more instructions | [exit-code-small](exit-code-small/README.md) |
| Arithmetic | Linux x86-64 | Multiply 6×7, exit 42 | [arithmetic](arithmetic/README.md) |
| Print text | Linux x86-64 | Hello from raw bits!, exit 0 | [print-text](print-text/README.md) |
| Loop and count | Linux x86-64 | Count five iterations, exit 5 | [loop-count](loop-count/README.md) |
| Compare values | Linux x86-64 | Equal branch retains exit 42 | [compare-values](compare-values/README.md) |
| Read keyboard input | x86 BIOS / QEMU | Wait for a key, echo to VGA/COM1 | [keyboard](keyboard/README.md) |
| Display VGA characters | x86 BIOS / QEMU | Green B at first text cell | [vga](vga/README.md) |
| Modify a future instruction | x86 BIOS / QEMU | One writer bit changes A to a; exact code RAM, serial and VGA proof | [self-modifying](self-modifying/README.md) |
| Recolor a literal bitmap | x86 BIOS / QEMU | One palette bit changes native RGB while all 64,000 pixel indices stay identical | [vga-bitmap](vga-bitmap/README.md) |
| Allocate a guarded arena | x86 BIOS / QEMU | One request bit changes final-byte ownership; zero, exhaustion and wraparound leave the cursor unchanged | [bounded-allocator](bounded-allocator/README.md) |
| Receive timer interrupts | BIOS → 32-bit ring zero / QEMU | Actual IRQ frames and IRETD; one count bit changes 3→2, one EOI port bit leaves the second IRQ pending | [timer-irq](timer-irq/README.md) |
| Repair a protected page | BIOS → 32-bit paging / QEMU | One native write fault, exact store retry; PTE/WP bit controls and complete table inspection | [paging](paging/README.md) |
| Boot from one sector | x86 BIOS / QEMU | Full bitborn greeting, halt | [boot-sector](boot-sector/README.md) |
| Interactive monitor | x86 BIOS / QEMU | Exact help/clear/about/reboot/peek commands | [monitor](monitor/README.md) |
| Read additional sectors | x86 BIOS / QEMU | Sector 2 loaded! | [disk-read](disk-read/README.md) |
| Binary shell | x86 BIOS / QEMU | Nine commands, actual RAM/register snapshot, checked disk launch | [shell](shell/README.md) |
| Returning disk application | x86 BIOS payload | Load at 9000, calculate 7×6, store 2A, return | [shell-app](shell-app/README.md) |
| Protected-mode experiment | BIOS → 32-bit ring zero | GDT, flat RAM, software interrupt/IRETD and green PM | [protected-mode](protected-mode/README.md) |

Native Linux examples run in CI on Ubuntu x86-64; macOS does not execute them.
BIOS examples run in QEMU TCG, including on Apple Silicon. All binary outputs
are available in website downloads. Releases contain the artifacts from their
tagged source revisions; newer examples do not alter published archives. The separate loader
is explained in [boot/loader.bits](../boot/loader.bits).
