# v0.1 foundation: acceptance evidence

Verified on **2026-10-12**. These records separate target execution, browser
simulation, live publication and hardware limitations.

| Requirement | Authoritative evidence |
| --- | --- |
| Exact public source repository and main branch | [OthmaneBlial/bitborn](https://github.com/OthmaneBlial/bitborn), GitHub API visibility PUBLIC/default main |
| Canonical handwritten instruction bytes, no target assembler/compiler | boot/boot.bits, boot/loader.bits, examples/*/program.bits; literal byte parser; transparent AI-assisted authorship note |
| Functional 512-byte BIOS image | Known byte/branch/signature tests plus QEMU VGA/serial greeting and guest HLT state |
| Reproduction from a clean source copy | Source archive extracted independently; make test and make site-test passed, boot.img matched byte-for-byte |
| Four documented host tools | Syntax/comment/error, inspection, reviewed size/hash/signature and bit-diff checks in tests/test_tools.py |
| Ten real examples with source/binary/explanations | examples/ guides and complete byte tables; unchanged payloads, framed images and ELF files available in release archive/site downloads |
| Real BIOS keyboard/VGA/disk/monitor behavior | QEMU key injection, actual VGA/disk memory, exact command tests, Backspace/bounds, reboot, alternate memory operand and forced BIOS disk error |
| Native Linux behavior | Ubuntu x86-64 CI executes all six ELF examples, including the smaller exit and alternate comparison input |
| Professional README/docs and visible roadmap | Root README.md, ROADMAP.md, architecture/tutorial/encoding guides, live website link and real QEMU captures |
| Description, topics, homepage and social preview | GitHub API confirms specified description, fifteen topics, live homepage and custom open-graph image |
| Interactive website and accessible mobile controls | Static decoder/stack/flags/bounds tests and real Chrome bit-editing, all512 bytes, keyboard navigation, boot stepping, clipboard, 1440/390/320px and reduced motion checks |
| Live deployment/assets | HTTPS200 for landing/docs/scripts/styles/data/images/downloads; representative live files equal local bytes; browser test repeated against live URL |
| CI and deployment automation | [Verify raw bits](https://github.com/OthmaneBlial/bitborn/actions/workflows/test.yml) and [Deploy website](https://github.com/OthmaneBlial/bitborn/actions/workflows/pages.yml) |
| Actual public release | [v0.1.0](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.1.0), non-draft/non-prerelease, eight uploaded artifacts, anonymous downloads, checksums and immutable annotated tag |
| All milestones pushed directly to main | Ordinary fast-forward main pushes; no PR/feature branches or rewritten tags |

The release commit is `d2c0434c186c33c8a70f3bf8c708c4983522f4cd`;
[CI on that exact commit](https://github.com/OthmaneBlial/bitborn/actions/runs/38212701098)
passed all 18 Python tests, actual Linux/QEMU execution, real browser checks and
source/build reproducibility. Local macOS ARM64 runs the BIOS targets with TCG;
the native Linux test is explicitly skipped there and required in Linux CI.

No physical hardware, native UEFI, protected mode, complete emulator, production
OS, indexing result or performance benchmark is claimed. The browser model is
bounded and educational. A SHA-256 digest proves identity, not human authorship.
No language registry package was published; images/source are the intended
artifacts for this project. The central Pages mirror changes only `bitborn/`.

## v0.1.1 maintenance verified

[v0.1.1](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.1.1) is public at
immutable commit `48ccfd4b1727555543f51310c4e1a9f077b18720`.
[Exact-commit CI](https://github.com/OthmaneBlial/bitborn/actions/runs/38213753618)
and the [tag CI](https://github.com/OthmaneBlial/bitborn/actions/runs/38213913985)
passed all 20 Python tests, browser checks, docs and reproduction. Additional CLI
regressions prove arbitrary comment text never affects packed bytes, failed
packing preserves an existing output, and malformed annotations still fail
target verification independently of byte syntax. Version-specific artifact
staging prevents older archives from entering new checksum lists.

All eight patch assets were downloaded from GitHub and match the prepared files;
SHA-256 checks passed. All five bootable images match public v0.1.0 byte-for-byte.
Original v0.1.0 tags/assets were preserved. This patch changes host tooling only.

## v0.2.0 evolution verified

Immutable release commit `4706efeeab9133f53b2b9e80089f144d9983ff89` passed
[37-test Linux CI](https://github.com/OthmaneBlial/bitborn/actions/runs/38223386652)
and [tag CI](https://github.com/OthmaneBlial/bitborn/actions/runs/38223865244).
Evidence now covers 55 reviewed literal targets, all six native Linux ELFs,
all twenty challenge solutions in QEMU, original and expanded monitor behavior,
protected-mode success/failure paths, three browser engines, exact browser
downloads and source-to-packaged-artifact reproduction.

The builder's one-bit-edited image is checked against the canonical bytes before
QEMU execution. In-place source aliases, artifact collisions, corrupt wrappers,
source limits and logical-IP wrap each have regression checks. Native recordings
and browser recordings are separate and carry hashes and capture provenance.

[v0.2.0](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.2.0) has thirteen
public attachments; authenticated and anonymous re-downloads match prepared
bytes. Every listed SHA-256 passes. All 135 live runtime pages/assets/downloads
match local output, and Chrome interaction checks were repeated live. The central
Pages mirror was checked to change only `bitborn/`.

These checks do not establish physical-hardware support, a complete BIOS/CPU
emulator, paging, general exceptions or hardware IRQ delivery. Progress and
research boundaries remain in [ROADMAP.md](../ROADMAP.md).

## v0.5.0 native-state release: 2026-10-13

Immutable source [`f5b444a`](https://github.com/OthmaneBlial/bitborn/commit/f5b444a0ebb6c4dd52592c41443141a34f77e066)
passes [main CI](https://github.com/OthmaneBlial/bitborn/actions/runs/38397864668)
and [tag CI](https://github.com/OthmaneBlial/bitborn/actions/runs/38398890607).
Ubuntu checks the native Linux ELFs as well as curated BIOS experiments. This
checkpoint adds the guarded allocator, legacy timer IRQ, scoped paging repair,
four-vector exception dispatch and native Bit Hunt game described in the
[release notes](release-v0.5.0.md); their controls and capture records retain
precise execution boundaries.

The prepared source archive was extracted outside the checkout. Fresh dependency
installation, 114 Python tests (one expected macOS native-Linux skip), complete
site/model checks and Chromium/Firefox 157/WebKit 27.2 interactions pass. Every
one of 112 rebuilt artifact hashes matches release provenance, and all 1,021
archived source files remain byte-identical after the checks.

All 89 [public attachments](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.5.0)
were downloaded without authentication and match staging byte-for-byte. The 88
checksum entries cover every attachment except the checksum list itself. Images,
source, 71 evidence files and provenance are all included. The immutable tag
points to the exact source commit; older tags and local v0.4.0 staging remain
unchanged. These proofs establish integrity and scoped execution, not physical
hardware, complete CPU/BIOS emulation, arbitrary recovery or user-mode isolation.
