# One request bit changes who owns the last byte

This **220-byte handwritten real-mode payload** allocates from a sixteen-byte
arena. The code clears the arena, installs two guards, makes five requests,
writes caller markers only on success, and halts with a native-written result
log in RAM. Every opcode and operand is a literal byte in
[program.bits](program.bits); [bytes.md](bytes.md) explains all 220 bytes.
No assembler or compiler generates the instructions.

The [control](control.bits) changes only **byte 103, bit 0**, mask `01`: the
third request is 12 bytes instead of 13. That leaves one byte for the next call.
Two separate QEMU boots verify the result, not a fabricated execution animation.

## Inspect the actual native-written results

Addresses below are hexadecimal. Failure returns DI=FFFF and CF=1; it does not
advance the cursor. The caller captures CF with `MOV AX,0; ADC AX,0` and writes
the resulting zero-or-one word to the log. These rows are read through QMP
**after halt**, not native instruction-by-instruction register snapshots.

| Request | Program pointer / cursor / failure | Control pointer / cursor / failure |
| --- | --- | --- |
| 0 | FFFF / 2000 / 1 | FFFF / 2000 / 1 |
| 3 | 2000 / 2003 / 0 | 2000 / 2003 / 0 |
| 13 → 12 | 2003 / 2010 / 0 | 2003 / 200F / 0 |
| 1 | FFFF / 2010 / 1 | 200F / 2010 / 0 |
| 65535 | FFFF / 2010 / 1 | FFFF / 2010 / 1 |

The program owns ranges `[2000,2003)` and `[2003,2010)`. The control owns
`[2000,2003)`, `[2003,200F)` and `[200F,2010)`. Successful ranges are contiguous
and do not overlap. Zero, exhaustion and wraparound failures reserve no bytes.
Marker B is at 2000 and C at 2003 in both boots; only the control writes D at
200F. Every other arena byte remains zero, and both guards remain intact.

## Explicit memory map

| Physical range | Role |
| --- | --- |
| 1FFF | Lower guard A5 |
| 2000–200F | Sixteen-byte arena; exclusive end 2010 |
| 2010 | Upper guard 5A |
| 2100–211D | Five six-byte log entries: DI, BX and failure word, low byte first |
| 7BFE–7BFF | One-word SS:SP call frame; every call returns with SP=7C00 |
| 7C00–7CDB | Immutable 220-byte source; HLT ends at logical IP 7CC1 |

The allocator at source offset 195 accepts an unsigned size in AX. BX is its
caller-owned cursor, initialized to 2000 and retained between calls. DI receives
the old cursor on success. It rejects zero, checks carry from `ADD AX,BX` before
comparing the candidate with 2010, and commits BX only when the candidate fits.
An exact-end candidate succeeds; wrapping arithmetic cannot masquerade as a
small valid address. AX and arithmetic flags other than returned CF are scratch.
The caller branches on CF **before** dereferencing DI.

This is a cooperative, byte-aligned bump allocator with one fixed arena. The
caller must preserve the cursor invariant `2000 <= BX <= 2010`. There is no free,
reuse, coalescing, corrupted-metadata defense, paging, concurrency or protected
memory isolation. Its verified bounds do not establish a general OS memory manager.
Intel's [instruction reference manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
describes the instruction semantics; [references.json](references.json) checks
the far pointer, zeroing loop, five calls and failure/HLT branches numerically.
The reference map describes literal fields and never fixes up code.

## Reproduce the reviewed artifact and proof

```sh
make build
./tools/bitverify build/bounded-allocator.img --size 512 --bios
./tools/bitinspect build/bounded-allocator.bin --references examples/bounded-allocator/references.json
python3 -m unittest tests.test_bounded_allocator -v
python3 tools/record_allocator.py
```

QEMU is required for native checks; capture regeneration also uses the read-only
NDISASM tool supplied by the `nasm` package. The native test validates committed
independent disassembly goldens without needing a target assembler.

The [capture record](../../assets/bounded-allocator-recording.json) includes
source/payload/512-byte image hashes, actual register files, raw native log and
guarded-arena bytes, code-RAM hashes and the QEMU version. Its two snapshots were
validated against every expected log entry, all eighteen guard/arena bytes,
balanced stack/segments, defined final flags, immutable code RAM and disk images.
The final AX=1 is the captured failure status; the caller's ADC has already
consumed and cleared the returned CF before HLT.

The primary payload is reviewed and exported as `bounded-allocator.bin` and
`bounded-allocator.img`. The separate control is a literal test fixture, not a
second reviewed release artifact. Tagged public releases retain their original
contents; this newer example belongs to current development until a later release.

## Browser model boundary

The current model executes initialization and the first zero-size rejection,
then stops after 65 completed instructions at source offset **202**: register
`ADD AX,BX` (`01 D8`) is unsupported. It leaves the first log as FFFF/2000/1,
the guards intact, and the second call in progress. That partial model state is
not the native five-request result. Native guest snapshots never claim rewind.
