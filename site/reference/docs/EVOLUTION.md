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
- Pushed journal milestone: `94e6026`; exact-commit Linux CI and Pages deployment
  passed. Completed next: exact Back/Forward, halt restoration and future forks;
  Node round trips and Chrome/Firefox/WebKit controls pass.
- Pushed Time Machine: `cebcd95`; exact-commit Linux CI passed.
- Completed parser parity: 658 seeded cases agree on bytes and error lines,
  covering Unicode line boundaries, non-ASCII comments and initial/embedded BOMs.
- Pushed parser parity: `ada41c5`; exact-commit Linux CI passed.
- Completed flags properties: independent bit-by-bit arithmetic oracle, seeded
  16-bit cases and exhaustive 8-bit TEST masks, with preserved IF/DF and INC/DEC CF.
- Pushed flags checks: `6e73fa0`. Completed conduct/security policies, enabled
  private GitHub reporting and documented the contributor setup/source map.
- Pushed contributor policies: `f0cef18`; its CI caught a stale generated source
  map. Corrected in `e940885`, whose CI and Pages deployment passed. Added
  introductions in eight languages with shared examples and an English-source
  freshness manifest. All 40 Python tests (one macOS skip) and site checks pass;
  detailed technical guides remain English.
- Pushed introductions: `8d73fa5`; exact-commit CI and Pages passed. Completed
  direct timeline selection, independent net-RAM/state oracles and keyboard
  controls in Chrome/Firefox/WebKit, with a genuine Home/End restoration capture.
- Pushed timeline: `634f036`; exact-commit CI and Pages passed. Completed eight
  source-generated introduction routes with metadata and three-browser desktop,
  320px, keyboard and Arabic RTL/LTR-code checks. Documentation copies are checked
  byte-for-byte, including translations and their freshness manifest.
- Pushed localized pages: `1628dda`; exact-commit CI/Pages passed. Anonymous live
  English/Arabic pages, history module and progress match local bytes exactly.
- Completed model benchmark: fixed reviewed boot, checked outputs, five warmups
  and 25 trials, source/environment hashes and a dated local sample; CI retains
  JSON without a timing threshold. Next: failed-write safety and opcode inspection.
- Pushed benchmark: `771eed8`. Completed atomic packed-file replacement; injected
  sync/rename failures preserve old/absent outputs, staging cleanup and link/mode
  behavior are checked. Next: mode-aware opcode inspection and exact program export.
- Atomic milestone `5fc5482` passed exact-commit CI and Pages. Completed explicit
  16/32/64 instruction inspection, exact imm64, per-bit roles, literal fixtures,
  independent disassembly goldens and three-browser context/bit changes. A wide
  hex readout overflow was caught and fixed before publication.
- Next: exact program export/import, binary/hex synchronization and ELF anatomy.
- Inspection milestone `09f5f2c` passed exact-commit CI/Pages. Completed `.bits`/raw
  export/import with exact downloaded bytes and preserved history in three browsers.
  A deliberately delayed read reproduced stale-import overwrite; newer source
  choices/drafts now cancel old reads and errors. Original self-modified bytes and
  empty/513-byte rejection plus the 512-byte boundary are checked.
- Next: binary/hex synchronization, ELF anatomy and a verified public release.
- Risks: browser behavior is modeled, not native x86. Hardware, paging and general
  interrupt support require separate native targets and evidence.

## Prioritized ideas

Impact and feasibility are H/M/L. Priority 0 protects correctness; priority 1
adds useful capability; priority 2 improves education and contribution; priority 3
is deeper research. Dependencies name earlier idea numbers or existing components.

| ID | Priority | Improvement and completion evidence | Impact | Feasibility | Dependencies | Risk | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | 0 | Record changed RAM bytes; compare with an independent full-memory oracle | H | H | Existing model | Low | Complete |
| 02 | 1 | Binary Time Machine: undo/redo every recorded register, flag, RAM and output transition | H | H | 01 | Medium | Complete |
| 03 | 0 | Seeded binary parser properties and Python/JS token-syntax parity | H | H | Existing parsers | Low | Complete |
| 04 | 0 | Arithmetic flags fuzzing against independent signed/unsigned oracles | H | H | Existing model | Medium | Complete |
| 05 | 1 | Opcode microscope with explicit 16/32/64-bit context and mode-specific fixtures | H | M | Intel references | Medium | Complete: scoped inspection; model execution stays 16-bit |
| 06 | 1 | Synchronize binary and hexadecimal input without generating instructions | H | H | Existing parser | Low | Open |
| 07 | 1 | Explain opcode, register, ModR/M and immediate fields bit by bit | H | H | 05 | Medium | Complete for documented MOV/XOR/prefix subset |
| 08 | 1 | Export and re-import exact CPU Lab programs with cross-browser download proof | H | H | Existing builder export | Low | Complete |
| 09 | 1 | Share bounded CPU Lab programs through validated URLs | H | M | 03,08 | Medium | Open |
| 10 | 1 | Rewind branches and CALL/RET; verify stack and logical IP restoration | H | H | 02 | Medium | Complete |
| 11 | 1 | Rewind self-modifying code; restore the fetched instruction bytes | H | H | 02 | Medium | Complete |
| 12 | 1 | Visual execution timeline with keyboard selection and recorded-step replay | H | M | 02 | Medium | Complete |
| 13 | 0 | Replace failed file writes atomically so existing packed outputs survive I/O errors | H | M | Existing CLI | Medium | Complete |
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
| 31 | 2 | Stable English introduction as the maintained translation source | H | H | Existing README | Low | Complete |
| 32 | 2 | Simplified Chinese README/introduction and working command/link checks | H | H | 31 | Medium | Complete |
| 33 | 2 | Spanish README/introduction and working command/link checks | H | H | 31 | Medium | Complete |
| 34 | 2 | French README/introduction and working command/link checks | H | H | 31 | Medium | Complete |
| 35 | 2 | Japanese README/introduction and working command/link checks | H | H | 31 | Medium | Complete |
| 36 | 2 | Portuguese README/introduction and working command/link checks | H | H | 31 | Medium | Complete |
| 37 | 2 | German README/introduction and working command/link checks | H | H | 31 | Medium | Complete |
| 38 | 2 | Arabic README/introduction; preserve left-to-right code and verify RTL layout | H | M | 31 | Medium | Complete |
| 39 | 0 | Translation freshness manifest with explicit source revisions and consistency checks | H | H | 31–38 | Medium | Complete |
| 40 | 2 | Localized introductory site routes with lang/dir/canonical/hreflang metadata | H | M | 31–39 | Medium | Complete |
| 41 | 2 | Print-friendly lessons with readable code and source attribution | M | H | 25–27 | Low | Open |
| 42 | 0 | Keyboard accessibility regression for timeline, imports, controls and error focus | H | H | 12 | Low | Open |
| 43 | 0 | Contrast and narrow-screen checks for changed-bit and flag indicators | H | H | Existing CSS | Low | Open |
| 44 | 2 | Explicit shortcuts guide and screen-reader-friendly execution announcements | M | H | 12,42 | Low | Open |
| 45 | 2 | CODE_OF_CONDUCT with real, usable reporting paths | H | H | Maintainer/profile evidence | Low | Complete |
| 46 | 0 | SECURITY policy with scoped supported versions and verified private reporting | H | H | GitHub repository settings | Medium | Complete |
| 47 | 2 | Contributor source map and focused per-component development commands | H | H | Existing CONTRIBUTING | Low | Complete |
| 48 | 0 | Verify every generated documentation/source copy, including translation and trace fixtures | H | H | Site build | Low | Complete |
| 49 | 2 | Genuine Time Machine capture with source/frame provenance | H | H | 02,12 | Low | Complete |
| 50 | 0 | Reproducible host-model benchmark; distinguish rendering, interpretation and native execution | H | M | 01,02 | Medium | Complete |
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
| 61 | 0 | Cancel delayed file imports/errors after a newer source choice or editor draft | H | H | CPU Lab import | Medium | Complete: race reproduced and checked in three browsers |

Large tasks are divided into useful verified milestones. Native experiments only
become capabilities after literal source review and real QEMU checks; hardware
claims require hardware evidence. A backlog idea does not change the source rules.
