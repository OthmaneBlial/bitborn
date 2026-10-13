# Debug one bit by following the writes

The [direction-flag challenge](https://othmaneblial.github.io/bitborn/challenges/?id=direction-flag)
halts normally but writes the wrong arrangement of letters. This lesson uses its
existing [broken source](../../challenges/direction-flag/start.bits) and
[reviewed repair](../../challenges/direction-flag/solution.bits): fourteen literal
bytes each, with one changed bit at byte offset 7. Neither source is assembled
from the mnemonic comments.

## Observe the failure before editing

Open the challenge and press **Validate** on the original source. The target is
memory `0600..0601 = 41 42` (ASCII `AB`), `DI=05FF`, and `DF=0` at halt. The seed
fails even though both versions execute nine modeled instructions and reach HLT.

For a step-by-step view, open [CPU Lab](https://othmaneblial.github.io/bitborn/cpu-lab/),
paste the broken source into the binary editor, press **Load**, and inspect memory
at `00600`. Step through the two `STOSB` instructions. `STOSB` writes AL through
ES:DI **before** moving DI; the direction flag decides which way it moves.

| Checkpoint | Broken: CLD at byte 7 | Repaired: STD at byte 7 |
| --- | --- | --- |
| After step 3 | DI=0601, AL=42 | DI=0601, AL=42 |
| After step 4 | DF=0 | DF=1 |
| Step 5: first STOSB | Write B at 0601; DI becomes 0602 | Write B at 0601; DI becomes 0600 |
| Step 7: second STOSB | Write A at 0602; DI becomes 0603 | Write A at 0600; DI becomes 05FF |
| Step 8: final CLD | DF=0 | DF=0 |

In the initialized model, the seed leaves `00 42 41` at `0600..0602`; the repair
leaves `41 42 00`. Final DF alone cannot diagnose the bug: both sources restore
it to zero. Follow the write addresses and intermediate DI instead.

## Make the smallest repair

Byte 7 is `11111100` (`FC`, CLD). Flip its **rightmost bit**, numeric bit 0, to
make `11111101` (`FD`, STD). In the challenge's bit editor this is the rightmost
button of editable byte 7. Keep the later CLD: it restores the forward direction.
The caption **Starting source: CLD** describes the original annotated source;
the edited byte above it reads FD. The caption does not decode the edited bytes.
Validate again; the nine-step repair meets every goal.

This changes pointer movement rather than letter values or store order. The
first store still writes B, the second still writes A, and both instruction
streams keep all thirteen other bytes identical.

![Actual browser validation of the boot repair followed by the direction-flag seed and one-bit repair](../../assets/challenges-demo.gif)

The final four frames show the direction lesson. This GIF records actual browser
controls and modeled goal results. Its [capture record](../../assets/browser-demo-recording.json)
includes both canonical source hashes and every captured PNG/GIF hash; it is
separate from the native execution check below.

## Check the native result too

```sh
make build
python3 -m unittest tests.test_direction_repair -v
```

The focused test packages each existing literal source behind the reviewed BIOS
loader and boots **both** controls in QEMU. The loader provides zero segments and
SP=7C00. The fragments load at 7E00; the model comparison uses that same address.
Both halt at 7E0E with AX=0041, DF=0 and SP=7C00. The native seed writes B at 0601
and A at 0602 and fails the AB goal; the native repair writes B at 0601 and A at 0600
and meets it. Native DI is respectively 0603 or 05FF. Guest code RAM and the image
file remain unchanged, and neither emits serial output.

CPU Lab's ordinary custom-source load address is 7C00, so its halt IP is 7C0E;
the absolute destination offsets and traversal lesson are the same. The test
compares the exact loader-address execution, not an invented address match.
Model journaling checks both write addresses, intermediate DI/DF and nine steps.
Native checks inspect final state and stored bytes, not an instruction trace or
physical hardware. See [execution scope and proof levels](../execution-scope.md).
