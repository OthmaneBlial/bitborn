# Evolution backlog and execution record

This is the working backlog for the autonomous evolution session. It records
possible improvements, not promises or implemented capabilities. Canonical
executable instructions remain literal `.bits`; host tooling never assembles them.

## Current execution record

- Baseline: clean `main` at `8c0ae14`, matching `origin/main`.
- Verified: `make test site-test`; 37 Python tests with one expected Linux-native
  skip on macOS, 55 reviewed targets, existing browser-model and documentation checks.
- Completed: journal actual model memory changes, removing per-step whole-RAM
  copies/scans. `node tests/test_memory_changes.mjs` checks an independent oracle
  across the full 2,825-step boot and all presets; Chrome CPU Lab interactions pass.
- Next: reversible execution, then parser/flags fuzzing and architecture-aware
  instruction inspection; introductory documentation in eight languages.
- Risks: browser behavior is modeled, not native x86. Hardware, paging and general
  interrupt support require separate native targets and evidence.

## Prioritized ideas

Impact and feasibility are H/M/L. Priority 0 protects correctness; priority 1
adds useful capability; priority 2 improves education and contribution; priority 3
is deeper research. Dependencies name earlier idea numbers or existing components.

| ID | Priority | Improvement and completion evidence | Impact | Feasibility | Dependencies | Risk | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | 0 | Record changed RAM bytes; compare with an independent full-memory oracle | H | H | Existing model | Low | Complete |
| 02 | 1 | Binary Time Machine: undo/redo every recorded register, flag, RAM and output transition | H | H | 01 | Medium | Open |
| 03 | 0 | Seeded binary parser properties and Python/JS token-syntax parity | H | H | Existing parsers | Low | Open |
| 04 | 0 | Arithmetic flags fuzzing against independent signed/unsigned oracles | H | H | Existing model | Medium | Open |
| 05 | 1 | Opcode microscope with explicit 16/32/64-bit context and mode-specific fixtures | H | M | Intel references | Medium | Open |
| 06 | 1 | Synchronize binary and hexadecimal input without generating instructions | H | H | Existing parser | Low | Open |
| 07 | 1 | Explain opcode, register, ModR/M and immediate fields bit by bit | H | H | 05 | Medium | Open |
| 08 | 1 | Export and re-import exact CPU Lab programs with cross-browser download proof | H | H | Existing builder export | Low | Open |
| 09 | 1 | Share bounded CPU Lab programs through validated URLs | H | M | 03,08 | Medium | Open |
| 10 | 1 | Rewind branches and CALL/RET; verify stack and logical IP restoration | H | H | 02 | Medium | Open |
| 11 | 1 | Rewind self-modifying code; restore the fetched instruction bytes | H | H | 02 | Medium | Open |
| 12 | 1 | Visual execution timeline with keyboard selection and recorded-step replay | H | M | 02 | Medium | Open |
| 13 | 0 | Replace failed file writes atomically so existing packed outputs survive I/O errors | H | M | Existing CLI | Medium | Open |
| 14 | 0 | Validate manifest types, output aliases and packaging options before writing | H | H | Existing manifest | Medium | Open |
| 15 | 0 | Structured source diagnostics with stable error codes and source-line locations | H | M | 03 | Medium | Open |
| 16 | 1 | Address-reference inspector that checks literal pointers without resolving labels into code | H | M | Annotations | Medium | Open |
| 17 | 1 | Register-to-register MOV encodings with independent ModR/M fixtures | H | M | 05 | Medium | Open |
| 18 | 1 | Curated indirect memory operands with explicit segment-selection explanations | H | M | 17 | High | Open |
| 19 | 1 | Signed conditional branches and overflow examples with native QEMU proof | H | M | 04 | Medium | Open |
| 20 | 1 | Carry-aware arithmetic examples and native/model differential checks | H | M | 04 | Medium | Open |
| 21 | 1 | ELF anatomy viewer: headers, entry point, segment permissions and payload bytes | H | H | Existing ELF packaging | Medium | Open |
| 22 | 1 | Explain Linux syscall encodings in 64-bit inspection mode without host execution | H | H | 05 | Medium | Open |
| 23 | 1 | Literal native self-modification experiment with controlled halt and RAM proof | H | M | Existing BIOS loader | Medium | Open |
| 24 | 1 | Program gallery presets derived from canonical .bits instead of duplicated source | H | M | Site packaging | Medium | Open |
| 25 | 2 | Progressive interactive byte-order lesson: one byte, one word, one branch | H | H | Existing playground | Low | Open |
| 26 | 2 | Guided stack/calling-convention lesson with return-address inspection | H | H | 02,10 | Low | Open |
| 27 | 2 | Flags lesson separating signed overflow, carry, parity and undefined AF | H | H | 04 | Medium | Open |
| 28 | 2 | Meaningful bit-diff explanations tied to instruction boundaries and execution mode | H | M | 05,07 | Medium | Open |
| 29 | 2 | New optimization challenges with alternate valid solutions and actual size measurements | H | M | Challenge evaluator | Medium | Open |
| 30 | 2 | Curated broken-program debugging walkthrough with recorded repair and native proof | H | H | 02 | Low | Open |
| 31 | 2 | Stable English introduction as the maintained translation source | H | H | Existing README | Low | Open |
| 32 | 2 | Simplified Chinese README/introduction and working command/link checks | H | H | 31 | Medium | Open |
| 33 | 2 | Spanish README/introduction and working command/link checks | H | H | 31 | Medium | Open |
| 34 | 2 | French README/introduction and working command/link checks | H | H | 31 | Medium | Open |
| 35 | 2 | Japanese README/introduction and working command/link checks | H | H | 31 | Medium | Open |
| 36 | 2 | Portuguese README/introduction and working command/link checks | H | H | 31 | Medium | Open |
| 37 | 2 | German README/introduction and working command/link checks | H | H | 31 | Medium | Open |
| 38 | 2 | Arabic README/introduction; preserve left-to-right code and verify RTL layout | H | M | 31 | Medium | Open |
| 39 | 0 | Translation freshness manifest with explicit source revisions and consistency checks | H | H | 31–38 | Medium | Open |
| 40 | 2 | Localized introductory site routes with lang/dir/canonical/hreflang metadata | H | M | 31–39 | Medium | Open |
| 41 | 2 | Print-friendly lessons with readable code and source attribution | M | H | 25–27 | Low | Open |
| 42 | 0 | Keyboard accessibility regression for timeline, imports, controls and error focus | H | H | 12 | Low | Open |
| 43 | 0 | Contrast and narrow-screen checks for changed-bit and flag indicators | H | H | Existing CSS | Low | Open |
| 44 | 2 | Explicit shortcuts guide and screen-reader-friendly execution announcements | M | H | 12,42 | Low | Open |
| 45 | 2 | CODE_OF_CONDUCT with real, usable reporting paths | H | H | Maintainer/profile evidence | Low | Open |
| 46 | 0 | SECURITY policy with scoped supported versions and verified private reporting | H | H | GitHub repository settings | Medium | Open |
| 47 | 2 | Contributor source map and focused per-component development commands | H | H | Existing CONTRIBUTING | Low | Open |
| 48 | 0 | Verify every generated documentation/source copy, including translation and trace fixtures | H | H | Site build | Low | Open |
| 49 | 2 | Genuine Time Machine capture with source/frame provenance | H | H | 02,12 | Low | Open |
| 50 | 0 | Reproducible host-model benchmark; distinguish rendering, interpretation and native execution | H | M | 01,02 | Medium | Open |
| 51 | 0 | Release-provenance manifest tying reviewed source, packaged output and commit | H | H | Existing releases | Medium | Open |
| 52 | 0 | Clean-checkout reproduction and platform-specific validation documentation | H | H | CI | Low | Open |
| 53 | 3 | Real VGA bitmap experiment with manually authored pixel/instruction bytes | H | M | BIOS target | High | Open |
| 54 | 3 | Tiny text-mode game with deterministic input and genuine QEMU recording | H | M | Shell keyboard helpers | High | Open |
| 55 | 3 | Bounded native allocator with memory-map, ownership and overflow evidence | H | M | Protected-mode target | High | Open |
| 56 | 3 | Protected-mode exception handlers with controlled fault injection | H | M | IDT target | High | Open |
| 57 | 3 | Timer IRQ experiment with explicit PIC setup and deterministic QEMU assertions | H | M | 56 | High | Open |
| 58 | 3 | Paging experiment with inspected page tables and deliberate page-fault evidence | H | L | 55,56 | High | Open |
| 59 | 0 | QEMU runner resource/error-path checks and bounded process cleanup | H | H | Existing Guest harness | Medium | Open |
| 60 | 2 | Accurate release/community draft showing actual new capabilities; no automatic posting | M | H | Verified release | Low | Open |

Large tasks are divided into useful verified milestones. Native experiments only
become capabilities after literal source review and real QEMU checks; hardware
claims require hardware evidence. A backlog idea does not change the source rules.
