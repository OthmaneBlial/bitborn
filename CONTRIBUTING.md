# Contributing to bitborn

Start with [the tutorial](docs/tutorials/from-bits-to-boot.md), [architecture](docs/architecture/README.md)
and [current roadmap](ROADMAP.md). Changes should improve a real tested program,
an encoding explanation, the byte tools or the educational interface.
Read [execution scope and proof levels](docs/execution-scope.md) before extending
the inspector, model or native targets; the three have different boundaries.
Use [GOOD_FIRST_ISSUES.md](GOOD_FIRST_ISSUES.md) for concrete small tasks and
[SHOWCASE.md](SHOWCASE.md) to reproduce the current demonstrations. GitHub issue
forms collect bug reports, feature ideas, binary examples and challenge proposals.
Follow the [code of conduct](CODE_OF_CONDUCT.md). Report vulnerabilities through
the [private security reporting path](SECURITY.md), rather than a public issue.

## Development setup and source map

Python 3.10+, Make and QEMU are needed for the native checks. Node.js 22+ is the
CI baseline for browser tooling. On macOS, install QEMU with `brew install qemu`;
on Ubuntu, use `sudo apt-get install python3 make qemu-system-x86`.

```sh
make test                 # build, reviewed artifacts, unit tests and headless QEMU
make site-test            # rebuild website references; model, route and link checks
npm ci                    # development-only Playwright dependency
npx playwright install chromium firefox webkit
npm run test:browser
npm run test:cross-browser
python3 -m http.server 8000 --directory site
```

Open `http://localhost:8000/` to develop the website. On Linux, Playwright may
require its documented system dependencies (`npx playwright install --with-deps`).
macOS cannot natively run the Linux ELF examples; CI runs their native checks.
Use the [clean-checkout reproduction recipe](docs/reproduction.md) to check the
exact source revision, generated copies and every artifact hash across builds.

| Work on | Start here | Focused check |
| --- | --- | --- |
| Literal source, manifest and packaging | `boot/`, `examples/`, `targets.json`, `tools/bitborn.py`, `tools/build.py` | `python3 -m unittest tests.test_tools tests.test_packaging` |
| [Declared address references](docs/address-references.md) | `tools/address_references.py`, `boot/references.json` | `python3 -m unittest tests.test_address_references` |
| [Inspection annotations](docs/inspection-annotations.md) | `tools/bitborn.py`, `tests/test_inspection_annotations.py` | `python3 -m unittest tests.test_inspection_annotations` |
| Actual guest behavior | `tests/qemu.py`, `tests/test_boot.py`, example-specific tests | `make test` |
| [Direction-flag repair lesson](docs/tutorials/repair-direction.md) | `challenges/direction-flag/`, `tests/test_direction_repair.py` | `python3 -m unittest tests.test_direction_repair` |
| Shared browser CPU and history | `site/simulator.mjs`, `site/history.mjs` | `node tests/test_cpu.mjs` and `node tests/test_history.mjs` |
| Register-copy execution | `site/simulator.mjs`, `tests/fixtures/register-mov.bits` | `node tests/test_register_mov.mjs` and `python3 -m unittest tests.test_register_mov` |
| Mode/bit/address inspection | `site/encoding.mjs`, `docs/instruction-encoding/fixtures/` | `node tests/test_encoding.mjs` and `node tests/test_memory_encoding.mjs` |
| [Linux syscall inspection](docs/instruction-encoding/linux-syscalls.md) | `site/encoding.mjs`, `tools/site_build.py`, canonical exit payloads | `node tests/test_linux_encoding.mjs` and `npm run test:cross-browser` |
| Shared memory addressing/execution | `site/address16.mjs`, `site/simulator.mjs` | `node tests/test_memory_mov.mjs` and `python3 -m unittest tests.test_memory_parity` |
| Loaded-program links | `site/program-link.mjs`, `site/cpu-lab/lab.mjs` | `node tests/test_program_link.mjs` and `node tests/browser_cpu_lab.mjs` |
| Mode-aware program differences | `site/bit-diff.mjs`, `site/bit-diff/` | `node tests/test_bit_diff.mjs` and `node tests/browser_bit_diff.mjs` |
| ELF anatomy | `site/elf.mjs`, `site/elf/` | `node tests/test_elf.mjs` and `node tests/browser_elf.mjs` |
| Parser syntax and [diagnostics](docs/source-diagnostics.md) | `tools/bitborn.py`, `site/binary.mjs` | `python3 -m unittest tests.test_parser_properties tests.test_tools` and `node tests/test_hex.mjs` |
| [Native harness failure paths](docs/qemu-harness.md) | `tests/qemu.py`, `tests/test_qemu_harness.py` | `python3 -m unittest tests.test_qemu_harness` and `make test` |
| [Signed/unsigned short branches](docs/signed-comparisons.md) | `site/simulator.mjs`, `docs/instruction-encoding/fixtures/signed-branches.bits` | `node tests/test_branches.mjs` and `python3 -m unittest tests.test_signed_branches` |
| [Carry/borrow arithmetic](docs/carry-borrow.md) | `site/simulator.mjs`, `docs/instruction-encoding/fixtures/carry-borrow.bits` | `node tests/test_carry.mjs` and `python3 -m unittest tests.test_carry_native` |
| [Canonical CPU presets](docs/cpu-lab/README.md) | `docs/cpu-lab/`, `tools/site_build.py`, `site/cpu-lab/presets.mjs` | `python3 -m unittest tests.test_preset_sources` and `node tests/test_cpu_lab.mjs` |
| [Native self-modification](examples/self-modifying/README.md) | `examples/self-modifying/`, `tools/record_self_modifying.py` | `node tests/test_self_modifying.mjs` and `python3 -m unittest tests.test_self_modifying_native` |
| Pre-BIOS stack setup | Reviewed standalone sources in `targets.json`, `tests/test_boot_stack.mjs` | `node tests/test_boot_stack.mjs`; native/model proof for edited sources |
| [CPU indicator readability](docs/indicator-readability.md) | `site/cpu-lab/lab.css`, `tests/contrast.mjs`, `tests/indicator_browser_checks.mjs` | `node tests/test_contrast.mjs` and `node tests/browser_cpu_lab.mjs` |
| [Execution keyboard controls](docs/cpu-lab/keyboard.md) | `site/cpu-lab/`, `tests/execution_keyboard_browser_checks.mjs` | `node tests/browser_cpu_lab.mjs` and `npm run test:cross-browser` |
| [Native VGA bitmap](examples/vga-bitmap/README.md) | `examples/vga-bitmap/`, `tests/vga_bitmap_checks.py`, `tools/record_vga_bitmap.py` | `python3 -m unittest tests.test_vga_bitmap` and `node tests/test_vga_bitmap_scope.mjs` |
| [Short Jcc fields](docs/instruction-encoding/short-branches.md) | `site/simulator.mjs`, `site/encoding.mjs`, `docs/instruction-encoding/fixtures/short-branch*.bits` | `node tests/test_branch_encoding.mjs` and `node tests/test_encoding.mjs` |
| [Instruction-bit keyboard navigation](docs/instruction-encoding/keyboard.md) | `site/app.js`, `tests/bit_keyboard_browser_checks.mjs` | `node tests/browser_site.mjs` and `npm run test:cross-browser` |
| [Source error ranges/focus](docs/source-diagnostics.md) | `site/binary.mjs`, `site/cpu-lab/lab.mjs`, `tests/source_error_browser_checks.mjs` | `node tests/test_source_locations.mjs` and `node tests/browser_cpu_lab.mjs` |
| Builder and CPU Lab | `site/boot-builder/`, `site/cpu-lab/` | `node tests/browser_builder.mjs` or `node tests/browser_cpu_lab.mjs` |
| Challenges | `challenges/`, `site/challenges/challenges.mjs` | `node tests/test_challenges.mjs` and `python3 -m unittest tests.test_challenges` |
| Docs, routes and progress | `README.md`, `ROADMAP.md`, `docs/`, `tools/site_build.py` | `make site-test` |
| [Print-friendly lessons](docs/printing.md) | `site/print.css`, `tools/introduction_pages.py`, `tests/print_browser_checks.mjs` | `node tests/browser_print.mjs` and `npm run test:cross-browser` |

Run full relevant checks before sharing a change. Browser scripts serve their own
test site; they do not need the development server. Focused checks complement the
full CI suite. Edit canonical documents, then regenerate `site/reference/` with
`make site-test`; do not edit the generated copies directly.

The [translation guide](docs/i18n/README.md) explains the shared English source and
freshness manifest. Update translations when that introduction changes, preserve
literal code blocks, and run `python3 -m unittest tests.test_translations tests.test_docs`.
Link current roadmap evidence rather than repeating release counts in each language.

## Source and contribution rules

- Write target instructions as literal eight-digit binary tokens. No assembler,
  target compiler, code-generating macros or copied executable blobs.
- Explain every opcode, ModR/M byte, immediate, displacement and data range inline.
  Assembly names are explanatory comments only.
- Keep host tooling separate. Packaging can add ELF headers or non-executable
  sector framing, but cannot manufacture target instructions.
- Recalculate affected branch/pointer operands, inspect callers, and add an
  independent byte assertion plus actual execution checks for behavior changes.
- Run `make test` and `make site-test`; update reviewed sizes/checksums only after
  understanding the resulting diff. Update README and ROADMAP for each completed
  milestone. Do not turn pending emulator/hardware/publication checks into ticks.
- Submit a focused issue or contribution with reproduction steps and support
  boundaries. The maintainer publishes verified milestones directly to main.

For a new example, create `examples/<slug>/program.bits`, a reproduction README,
an independent encoding assertion and an actual execution test. Add its reviewed
size/hash/environment to `targets.json`; host packaging may frame those bytes.
`make site-test` derives the complete byte table and website reference copies.
For a challenge, add literal start/solution sources and semantic goals to the
challenge catalog/manifest, prove the seed fails and solution succeeds, then add
the curated QEMU assertion. A second valid answer should pass when it satisfies
the edit rules and goals.

Never include credentials, personal captures or unrelated generated files. Boot
experiments belong in disposable emulators. MIT licensing applies to code and
documentation; upstream manuals are linked, not copied into this repository.
