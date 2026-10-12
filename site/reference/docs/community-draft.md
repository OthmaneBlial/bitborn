# Optional community introduction draft

This is a draft for review. It has not been posted to a community.

**Suggested title:** I wrote x86 programs as literal bits, then built a reversible CPU lab to explain them

Bitborn starts with actual `.bits` files: each byte is eight handwritten binary
digits. No assembler or target compiler chooses the instructions. Python packs
those bytes into reviewed BIOS images and Linux ELF files; QEMU and Linux CI
check the native examples. The original 512-byte boot sector still has its exact
reviewed bytes.

The new v0.3 browser tools help explain the bytes. The Binary Time Machine restores
recorded registers, flags, RAM and output, including self-modifying code. The
instruction playground lets you compare explicit 16/32/64-bit contexts: a REX
prefix becomes INC/DEC in a legacy context, and 64-bit immediates stay exact.
Inspection is a documented subset; browser execution remains a bounded 16-bit
teaching model. It does not execute imported code natively.

There are introductions in eight languages, literal binary/hex drafts and exact
program downloads. The native payloads are unchanged in this release. I would
welcome feedback on encoding explanations, accessibility and translation phrasing.

- [Try the Time Machine](https://othmaneblial.github.io/bitborn/cpu-lab/)
- [Compare instruction contexts](https://othmaneblial.github.io/bitborn/playground/)
- [Read the literal source](https://github.com/OthmaneBlial/bitborn)
- [Verified v0.3 release](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.3.0)

Before posting, choose a community whose rules permit project introductions and
adapt the text to its format. Do not claim complete CPU emulation, hardware support,
native speed improvements or native-speaker translation review. “Handwritten”
describes direct instruction-byte authorship; source and documentation editing are
AI-assisted. No stars, endorsements or user counts are implied by this draft.
