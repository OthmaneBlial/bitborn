# Three timer interrupts. One wrong port stops the second.

This **568-byte literal protected-mode payload** programs a legacy PIC and PIT,
accepts three IRQ0 entries, records the CPU's actual interrupt frames, sends EOI,
returns with IRETD, then halts with interrupts disabled. It is loaded at physical
`7E00` by the separately authored [BIOS loader](../../boot/loader.bits).
The three-sector disk image has **1536 bytes**; the payload is not a standalone
boot sector. [program.bits](program.bits) contains every instruction, descriptor
and gate byte; [bytes.md](bytes.md) explains every payload byte.

Two separate literal controls change one bit each:

| Source | Changed byte / mask | Native result |
| --- | --- | --- |
| [program](program.bits) | Baseline | Three IRQ frames, final halt, master mask FF and ISR 00 |
| [control](control.bits) | 77 / 01: limit 3 becomes 2 | Two IRQ frames; the third log slot remains zero |
| [no-eoi](no-eoi.bits) | 240 / 01: OUT 20 becomes OUT 21 | One frame; the CPU waits with IF=1, ISR bit 0 set and another IRQ0 pending |

The wrong-port control writes mask `20` instead of sending EOI to the master
command port. IRQ0 stays in service and blocks the next request. This is observed
through QMP, including the controller's **pending request**, not inferred from a
delay or an invented animation. Tests terminate that waiting guest explicitly.

## Follow the device and the real frame

The source maps master IRQs to vectors `20`–`27` and slave IRQs to `28`–`2F`,
selects explicit EOI, masks every slave line, and unmasks only master IRQ0.
PIT control `36` selects counter zero, low/high reload order and binary mode 3.
The literal reload is `2E9C`; there is no measured frequency or latency claim.
The only present IDT gate is vector `20`: selector `0008`, entry `00007EC0`.
There is no `INT 20` instruction in this payload.

Each gate entry reads the actual three-doubleword frame at SS:ESP:
saved EIP, CS and EFLAGS. It then records a PUSHFD image before arithmetic
changes flags. Saved IF is one; the interrupt gate's handler runs with IF zero.
The defined arithmetic flags and DF survive entry. PUSHFD's image omits RF/VM;
the capture retains the original raw saved word rather than pretending all
system bits are identical. Return addresses can be the post-HLT jump or loop
entry, depending on when an enabled pending interrupt is delivered.

IRETD consumes the untouched original frame. Final ESP is `9000`; its last
frame remains below the stack pointer and matches the last native-written log
entry. Guards A5 and 5A surround all 48 log bytes. Unused entries stay zero.
Only CPU-managed GDT accessed bits may change in loaded payload RAM; every
instruction byte, source and read-only disk image remains unchanged.

## Avoid the final-interrupt sleep race

The main loop is `CLI; CMP count,limit; JAE done; STI; HLT; JMP loop`.
CLI protects the comparison. STI's interrupt shadow covers the following HLT.
After waking and returning, the loop disables delivery before checking again.
Checking while IF is one and then sleeping could miss completion if the final
handler masks the timer between those instructions.

The last handler masks all master lines and sends EOI before IRETD. The PIT can
still produce a masked pending request; successful completion does not promise
IRR=0 or claim that the timer itself was stopped.

## Memory map and proof

All addresses are physical hexadecimal, using flat ring-zero descriptors.

| Range | Role |
| --- | --- |
| 4000–4003 | Initialized IRQ count |
| 40FF | Lower log guard A5 |
| 4100–412F | Three 16-byte entries: saved EIP, CS, EFLAGS, PUSHFD image |
| 4130 | Upper guard 5A |
| 7E00–8037 | Literal loaded payload, including GDT and 33 IDT gates |
| 7F18 / 7F1E | GDTR / IDTR pointers |
| 8FF0–8FFF | Temporary PUSHFD image and remaining IRQ frame |
| 9000 | Balanced stack top after IRETD |

[Actual capture provenance](../../assets/timer-irq-recording.json) contains all
three final/wait snapshots, raw register and PIC output, native log/frame/guard
bytes, payload RAM, mixed-mode NDISASM goldens, source/image hashes and the QEMU
version. These are final snapshots and native-written frame logs, **not a native
instruction trace, scheduler or timing benchmark**. Fresh tests validate the
same invariants without requiring every asynchronous saved flag word to repeat.

```sh
make build
python3 -m unittest tests.test_timer_irq -v
node tests/test_timer_irq_scope.mjs
python3 tools/record_timer_irq.py
```

Capture regeneration needs the read-only NDISASM tool from the `nasm` package.
Normal native tests use committed independent goldens. Only the main source is
a reviewed downloadable target; the two controls are test fixtures. Existing
tagged release assets retain their original contents.

## Scope

This is a QEMU legacy-device experiment at ring zero, with paging disabled and
one IRQ gate. It has no general exception handler, NMI handler, APIC driver,
preemptive scheduler, task switch or physical-hardware evidence. The source
does not preserve all general registers across its handler; EAX is scratch and
EDI is the handler-owned log cursor.

The CPU lab accepts at most 512 bytes and cannot import this full native stage.
A separate model prefix check executes seven real-mode setup instructions, then
rejects LGDT before device setup or mode switching. Browser simulation supplies
no PIC/PIT, protected-mode interrupt delivery or native frame playback.

Primary references: [Intel PIC interface and EOI](https://cdrdv2-public.intel.com/332995/332995-skl-io-platform-datasheet-vol1_rev004.pdf)
(chapter 21.7), [Intel 8254 control words](https://www.scs.stanford.edu/23wi-cs212/pintos/specs/8254.pdf),
[Intel interrupt, STI and PUSHFD semantics](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html),
and [QEMU monitor inspection](https://www.qemu.org/docs/master/system/monitor.html).
