# Canonical CPU Lab programs

See [execution scope and proof levels](../execution-scope.md) for supported
encoding families, simplified BIOS/I/O behavior and the matching validation path.

Every selectable CPU Lab preset reads one manually authored `.bits` file. The site
build copies literal text into its browser data module and publishes the same
file under `site/reference/`. It does not assemble mnemonics, resolve labels or
generate instructions from the explanations.

| Preset | Canonical source | Focus |
| --- | --- | --- |
| 01 / Load an immediate | [immediates.bits](immediates.bits) | Register opcode bits and little-endian words |
| 02 / Arithmetic & flags | [flags.bits](flags.bits) | Carry, wrapping, INC and non-destructive CMP |
| 03 / Stack, CALL & RET | [stack.bits](stack.bits) | Saved words and near return addresses |
| 04 / Follow a branch | [branch.bits](branch.bits) | LOOP, comparison and conditional paths |
| 05 / Segment + offset | [memory.bits](memory.bits) | DS/ES, words, string pointer direction |
| 06 / BP, DS and SS | [memory-mov-program.bits](../instruction-encoding/fixtures/memory-mov-program.bits) | Default address segments, byte halves and load/store journals |

The first five files preserve every original preset byte and add per-instruction
comments. Native release targets and their manifest are unchanged. These first
five are bounded teaching programs with initialized model state; they are not
advertised as self-contained boot sectors. Preset 06 has separate native/model
execution evidence.

The [CPU Lab](https://othmaneblial.github.io/bitborn/cpu-lab/) displays a **Loaded
preset source** download when loaded bytes match one of these programs. Comments
and whitespace do not affect that match. A custom program hides the link; an
invalid draft keeps the existing loaded program and its link. Self-modifying RAM
does not change the original loaded source. Downloads are canonical text, not
your draft or a recorded RAM snapshot.

Edit the canonical file to change a preset. `tools/site_build.py` checks grammar,
regular files inside the project, 512-byte programs and the browser's 65,536
UTF-16-code-unit text bound before generating website content. Module strings
and reference copies preserve the actual UTF-8 text, including comments and line
endings. Each module source is validated from the same captured text rather than
reopening the file for validation. The existing `memoryProgramSource` export remains available.

```sh
make site-test
python3 -m unittest tests.test_preset_sources
node tests/test_cpu_lab.mjs
node tests/browser_cpu_lab.mjs
```

Tests compare exact canonical/editor/reference text, assert original byte
sequences and resulting model state, and reject malformed/oversized sources,
missing files, FIFOs and paths resolving outside the project. Browser tests check
all six source links and valid/invalid/custom loading in Chromium, Firefox and
WebKit. Recording provenance hashes include every preset's canonical source.

Further exercises: [signed comparisons](../signed-comparisons.md) and
[carry/borrow arithmetic](../carry-borrow.md).
