# Contributing to bitborn

Start with [the tutorial](docs/tutorials/from-bits-to-boot.md), [architecture](docs/architecture/README.md)
and [current roadmap](ROADMAP.md). Changes should improve a real tested program,
an encoding explanation, the byte tools or the educational interface.
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

| Work on | Start here | Focused check |
| --- | --- | --- |
| Literal source, manifest and packaging | `boot/`, `examples/`, `targets.json`, `tools/bitborn.py`, `tools/build.py` | `python3 -m unittest tests.test_tools tests.test_packaging` |
| Actual guest behavior | `tests/qemu.py`, `tests/test_boot.py`, example-specific tests | `make test` |
| Shared browser CPU and history | `site/simulator.mjs`, `site/history.mjs` | `node tests/test_cpu.mjs` and `node tests/test_history.mjs` |
| Parser syntax and diagnostics | `tools/bitborn.py`, `site/binary.mjs` | `python3 -m unittest tests.test_parser_properties` |
| Builder and CPU Lab | `site/boot-builder/`, `site/cpu-lab/` | `node tests/browser_builder.mjs` or `node tests/browser_cpu_lab.mjs` |
| Challenges | `challenges/`, `site/challenge-engine.mjs`, `site/challenges/` | `node tests/test_challenges.mjs` and `python3 -m unittest tests.test_challenges` |
| Docs, routes and progress | `README.md`, `ROADMAP.md`, `docs/`, `tools/site_build.py` | `make site-test` |

Run full relevant checks before sharing a change. Browser scripts serve their own
test site; they do not need the development server. Focused checks complement the
full CI suite. Edit canonical documents, then regenerate `site/reference/` with
`make site-test`; do not edit the generated copies directly.

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
