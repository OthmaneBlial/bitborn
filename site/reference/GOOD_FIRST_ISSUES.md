# Small contributions with a clear finish

These are suggested tasks, not existing issue numbers or claims of community
activity. Inspect the current code and open a focused issue before tackling a
change another contributor may already be making. Follow
[CONTRIBUTING.md](CONTRIBUTING.md) for the project's source and review rules.

| Suggested task | Start here | A useful finished contribution |
| --- | --- | --- |
| Explain one branch calculation | [Instruction encoding guide](docs/instruction-encoding/README.md), one `examples/*/bytes.md` table | Show the instruction end, signed displacement and actual destination; compare the explanation with the literal source and add an independent offset assertion when correcting bytes. |
| Improve one challenge hint | [Challenge sources](challenges/), [challenge tests](tests/test_challenges.mjs) | Make one hint explain a mechanism rather than reveal the answer. Keep the goal, locked offsets, edit budget, and positive/negative checks intact. |
| Report one keyboard or mobile problem | [Builder browser test](tests/browser_builder.mjs), [CPU lab browser test](tests/browser_cpu_lab.mjs) | Give a minimal reproducible path and viewport/browser information; fix the specific focus, label, contrast or overflow issue and check the affected flow. |
| Add one packer rejection case | [Byte tools](tools/bitborn.py), [tool tests](tests/test_tools.py) | Exercise a malformed token or comment boundary without duplicating a current test. Confirm failure preserves an existing destination rather than leaving a partial file. |
| Clarify one environment requirement | [First-program tutorial](docs/tutorials/from-bits-to-boot.md), an example README | Distinguish BIOS real mode, Linux x86-64, browser simulation and native execution. Verify every command and relative link you change. |
| Add a small literal-bit challenge | [Challenge definitions](challenges/), [packaging](tools/build_challenges.py) | Teach one mechanism with a broken start, reviewed solution, focused editable bytes, deterministic goal, hints, explanation and bounded checks. Include real QEMU proof for the curated solution. |

Prefer one concrete improvement over an unrelated cleanup. No new dependency,
feature framework or instruction generator is needed for these tasks.

## When a contribution changes target bytes

1. Author every executable opcode and operand as **literal eight-bit binary
   tokens** in the canonical `.bits` source. Assembly names belong in explanatory
   comments. Never use an assembler, compiler or macro system to generate target
   instruction encodings.
2. Inspect affected callers, instruction lengths, absolute addresses, relative
   destinations, data boundaries and error paths. Comments and a new checksum
   cannot repair an incorrect operand.
3. Add an independent byte/offset assertion and cite an instruction-manual
   section or independent disassembly when appropriate. A test that derives its
   expected encoding from the same new logic is not independent evidence.
4. Prove changed behavior in the intended environment: QEMU for BIOS targets,
   native Linux x86-64 for ELF targets. Browser feedback covers only the modeled
   subset. Curated challenge solutions need their QEMU checks as well as a
   failing starting program and deterministic browser/model checks.
5. Update the corresponding byte explanation and reviewed manifest only after
   understanding the byte diff and execution result. Existing targets use
   [targets.json](targets.json); challenge sources use
   [challenges/targets.json](challenges/targets.json). Keep executable bytes
   distinct from generated ELF headers, padding and signature data.

## Run the checks that fit the change

```sh
make test
make site-test
```

`make test` verifies source identity and runs Python tests, including actual
QEMU guest checks. Native ELF checks require Linux x86-64; an explicit skip on
another host is not proof of native behavior. QEMU must be installed rather
than silently skipped.

For UI changes, use the development-only browser tooling:

```sh
npm ci
npx playwright install chromium
npm run test:browser
node tests/browser_routes.mjs
```

The browser checks serve the portable site below `/bitborn/`. If you already
have Chrome, `PLAYWRIGHT_CHROMIUM_EXECUTABLE` can point to that executable.
Report the commands actually run, their results, and any untested environment.

## Send enough context to review

Use the [bug report](.github/ISSUE_TEMPLATE/bug_report.yml),
[feature proposal](.github/ISSUE_TEMPLATE/feature_proposal.yml),
[binary example](.github/ISSUE_TEMPLATE/binary_example.yml), or
[educational challenge](.github/ISSUE_TEMPLATE/educational_challenge.yml) form.
Include source paths, repository revision, relevant bytes, expected behavior,
and reproducible evidence. Keep logs and captures limited to the experiment;
never include credentials or unrelated personal data.

A contributor's local test, a published release and a live site deployment are
different results. State the evidence you have, and leave pending gates visible.
