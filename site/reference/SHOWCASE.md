# Make one bit count

These demonstrations are reproducible from the repository. Browser recordings
show real interactions with the bounded JavaScript teaching model. QEMU captures
show guest machine-code execution. Those are separate kinds of evidence.

## 1. Boot a sector authored directly as bits

![Actual QEMU boot capture](assets/boot.gif)

**Environment:** legacy BIOS, x86 real mode, QEMU TCG. The canonical
[512-byte source](boot/boot.bits) contains instructions, message bytes, padding
and the `55 AA` disk signature. It prints to VGA and COM1, then reaches HLT.

```sh
make test
make run
```

`make test` checks reviewed bytes and executes the BIOS targets in QEMU.
`make run` opens the boot image and mirrors the greeting to the serial terminal.
Close the QEMU window when finished. Linux ELF execution checks require Linux
x86-64 and are explicitly skipped on other hosts.

Capture provenance: [boot-recording.json](assets/boot-recording.json).
Regenerate the QEMU recording with:

```sh
make build
python3 tools/record_boot.py
```

## 2. Change H to h by flipping one bit

![Real browser capture of the Boot Sector Builder](assets/boot-builder-demo.gif)

**Environment:** [Boot Sector Builder](https://othmaneblial.github.io/bitborn/boot-builder/),
bounded browser simulation, followed by separate QEMU execution of the export.

1. Go to byte **176**, hexadecimal offset `0x0B0`.
2. Flip **bit 5**, the third bit from the left. Its MSB-based control index is
   **2**: `01001000` (`H`, `0x48`) becomes `01101000` (`h`, `0x68`).
3. Run to halt. Find `hello from raw machine code!` in the simulated screen and
   serial output. The instruction bytes remain unchanged.
4. Download the `.img` and literal `.bits` source. The image must still contain
   exactly 512 bytes with `55 AA` at offsets 510–511.

The real-browser regression check saves these exact downloads as
`build/builder-edited.img` and `build/builder-edited.bits`:

```sh
make site-test
npm ci
npx playwright install chromium
node tests/browser_builder.mjs
./tools/bitpack build/builder-edited.bits build/builder-repacked.img
./tools/bitdiff build/builder-edited.img build/builder-repacked.img
./tools/bitverify build/builder-edited.img --size 512 --bios
qemu-system-i386 -machine pc,accel=tcg -drive file=build/builder-edited.img,format=raw,if=floppy -boot a -serial stdio
```

The byte diff should report `identical`. Framing checks establish size and
signature; only the separate QEMU run checks this export's guest behavior.
The browser simulation alone does not establish native boot correctness.

For an installed local Chrome, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its
executable path instead of installing Playwright's Chromium.

## 3. Watch the stack and flags change

![Real browser capture of the bounded CPU lab](assets/cpu-lab-demo.gif)

**Environment:** [CPU lab](https://othmaneblial.github.io/bitborn/cpu-lab/),
bounded 16-bit teaching model. The literal preset sources live in
[presets.mjs](site/cpu-lab/presets.mjs); their mnemonics explain those bytes.

- Select **Stack, CALL & RET**. Step the first MOV and PUSH. AX holds `1234`,
  SP moves from `7C00` to `7BFE`, and the memory inspector shows `34 12` at
  physical addresses `7BFE` and `7BFF`. Continue to observe POP, CALL and RET.
- Select **Arithmetic & flags**. Step the first MOV and ADD. `FFFF + 1` wraps
  AX to zero and sets CF and ZF. The following INC preserves carry.
- Select **Follow a branch**. Set a breakpoint before the loop body, run, then
  step the branch and follow the instruction-pointer transfer.

Reproduce the model and UI checks:

```sh
node tests/test_cpu.mjs
node tests/test_cpu_lab.mjs
node tests/browser_cpu_lab.mjs
```

The lab exposes its supported subset and a 4,096-step execution limit. It does
not implement a complete CPU or BIOS. Independently checked CPU fixtures also
have a [real QEMU contract test](tests/test_cpu_contract.py).

## 4. Repair a boot sector in exactly three bits

![Real browser capture of a binary challenge](assets/challenges-demo.gif)

**Environment:** [20 binary challenges](https://othmaneblial.github.io/bitborn/challenges/),
five each at beginner, intermediate, advanced and expert level. Goals, locked
bytes, edit budgets, negative starting programs and reviewed solutions are
deterministic. Completion progress stays in this browser's local storage.

Open [Repair the boot in three bits](https://othmaneblial.github.io/bitborn/challenges/?id=repair-boot).
Restore the far-jump opcode and forward string direction without exceeding the
three-bit budget, then choose **Run & validate**. Inspect the canonical
[starting source](challenges/repair-boot/start.bits) and
[reviewed solution](challenges/repair-boot/solution.bits).

<details>
<summary>Show the three-bit repair</summary>

| Byte offset | Starting binary | Repaired binary | Mechanism |
| --- | --- | --- | --- |
| 1 / `0x001` | `11101011` | `11101010` | Restore `EA`, the far-jump opcode |
| 17 / `0x011` | `11111111` | `11111100` | Restore `FC`, CLD, by changing two bits |

The reviewed solution is byte-identical to `boot/boot.bits`. The browser checks
the edit budget and modeled output; the curated solutions also have actual
QEMU execution tests. Arbitrary user edits are not executed on the host.

</details>

```sh
node tests/test_challenges.mjs
node tests/browser_challenges.mjs
python3 -m unittest tests.test_challenges -v
```

## Capture and verification records

- [QEMU capture provenance](assets/boot-recording.json): source image hash,
  emulator version, frame counts and reproduction command.
- [Browser capture provenance](assets/browser-demo-recording.json): actual
  browser actions, input bytes and recording conditions.
- [Validation method](docs/validation.md), [architecture](docs/architecture/README.md)
  and [current roadmap](ROADMAP.md) separate packaging, simulated behavior,
  QEMU/native execution and publication evidence.

Regenerate the browser recordings with FFmpeg and FFprobe installed:

```sh
make site-test
npm ci
npx playwright install chromium
npm run record:browser
```

GIFs demonstrate observed interactions; they are not performance benchmarks.
No hardware, UEFI, complete operating-system or popularity claim follows from
these recordings. Target encodings were authored directly as literal binary
digits with AI-assisted editing; host tools and the website use ordinary code.
