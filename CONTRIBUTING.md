# Contributing to bitborn

Start with [the tutorial](docs/tutorials/from-bits-to-boot.md), [architecture](docs/architecture/README.md)
and [current roadmap](ROADMAP.md). Changes should improve a real tested program,
an encoding explanation, the byte tools or the educational interface.
Use [GOOD_FIRST_ISSUES.md](GOOD_FIRST_ISSUES.md) for concrete small tasks and
[SHOWCASE.md](SHOWCASE.md) to reproduce the current demonstrations. GitHub issue
forms collect bug reports, feature ideas, binary examples and challenge proposals.

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
