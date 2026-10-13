# One dispatcher, two frame shapes

This native experiment contains **736 literal bytes**. The existing
[two-sector loader](../../boot/loader.bits) enters it at 0000:7E00. A flat
ring-zero 32-bit code segment runs with paging and maskable interrupts disabled.
The target has twenty legacy IDT slots, eighteen present gates and a shared
handler; reserved vectors 9 and 15 have absent gates. Modern vectors above 19,
privilege-changing frames and nested-fault recovery are outside this prototype.

Every executable instruction, descriptor, policy byte and stub is directly
authored in [program.bits](program.bits). Comments describe existing bytes.
The reproducible local native checks are:

```sh
python3 -m unittest tests.test_exception_dispatch -v
```

The tests package only the four curated literal sources in temporary 1536-byte
QEMU images. Browser imports do not execute in QEMU or on the host.
Build the reviewed primary target and run its image with:

```sh
make build
qemu-system-i386 -drive file=build/exception-dispatch.img,format=raw,if=floppy -boot a
```

[Every byte explained](bytes.md). The [actual recording](../../assets/exception-dispatch-recording.json)
contains final QMP snapshots and twenty captured register/disassembly/log/stack/RAM
files from four separate boots. These are snapshots and guest-written records,
not an instruction trace. Regenerate and revalidate them with:

```sh
python3 tools/record_exception_dispatch.py
python3 -m unittest tests.test_exception_dispatch -v
node tests/test_exception_dispatch_scope.mjs
```

## What the CPU supplies

Three controlled exceptions have no hardware error slot: divide error from
DIV EBX, breakpoint from INT3 and invalid opcode from UD2. Their stubs push zero
before the vector number. Loading nonexistent selector 18 into DS raises a
general-protection fault with an actual CPU error code of 18; its stub pushes
only vector 13. Both paths therefore enter the common handler with:

| Offset from entry ESP | Field |
| --- | --- |
| 0 | Vector number |
| 4 | Actual CPU error code or synthetic zero |
| 8 | CPU-generated saved EIP |
| 12 | CPU-generated CS slot |
| 16 | CPU-generated saved EFLAGS |

Entry ESP is 8FEC for all four same-ring cases. PUSHAD preserves the caller's
general-purpose registers below that frame. POPAD and ADD ESP,8 discard only
the software vector and normalized error slots; IRETD restores the CPU frame,
returning ESP to 9000. No source code or saved flags are rewritten.

The policy advances the three known **two-byte faulting instructions** by two.
INT3 is a trap: its saved EIP already points to the following UD2 instruction,
so its policy adds zero. These fixed recovery lengths apply only to the authored
test sites. Skipping divide error or UD2 does not repair their causes or prove
recovery for arbitrary instructions. Other mapped legacy vectors capture and
halt; their native delivery has not been exercised.

## The observed sequence and one-bit controls

| Source | Literal change | Native result |
| --- | --- | --- |
| [program](program.bits) | Baseline | Four records: DE, BP, UD, GP; completion marker D1500004, ESP=9000 |
| [divisor one](divisor-one.bits) | Offset 135, bit 0 | Division succeeds; only BP, UD and GP are recorded; ESP=9000 |
| [stop divide](stop-divide.bits) | Policy offset 548, bit 7 | One DE record; default stop retains PUSHAD and the CPU frame at ESP=8FCC |
| [retry divide](retry-divide.bits) | Policy offset 548, bit 1 | Four DE records retry the same EIP; the fifth entry takes the capacity stop before another write |

Each record contains seven DWORDs: vector, normalized error, original saved EIP,
CS, saved flags, normalized entry ESP and chosen return EIP. Four records occupy
6000–606F. The count is at 6080 and stop status at 6084; initialized spare bytes
and two log guards are checked. Stack guards sit at 8FCB and 9000.

QEMU checks verify actual record order, selector error, fault/trap return EIPs,
retained PUSHAD and normalized frames, seeded registers, balanced or deliberately
retained stack, DF=1/IF=0, guards and unchanged instruction RAM. Only the CPU's
descriptor accessed bits may differ in GDT RAM. Saved RF is recorded as observed;
it is not forced to a constant across controls or classified from vector alone.
Independent mixed-mode NDISASM checks verify every instruction boundary and byte,
and structural checks verify all twenty gates and eighteen stub routes.

## Fixed layout

| Source offsets | Purpose |
| --- | --- |
| 0–38 | Real-mode transition; the bounded 16-bit model stops at LGDT at offset 16 |
| 40–161 | Protected initialization and four controlled sites |
| 192–293 | Shared capture and return |
| 304–314 | Diagnostic stop |
| 320–499 | Twenty nine-byte stub slots; reserved slots stay zero |
| 512–535 | Three literal GDT entries |
| 536–547 | GDTR and IDTR pointers |
| 548–567 | Literal per-vector recovery policies |
| 576–735 | Twenty literal IDT entries |

This is a QEMU BIOS `pc` proof of controlled same-ring dispatch, not hardware,
process isolation, general recovery, scheduling or browser protected-mode support.
For architecture background, see [Intel SDM Volume 3A, interrupt and exception handling](https://cdrdv2-public.intel.com/874249/253668-090-sdm-vol-3a.pdf).
