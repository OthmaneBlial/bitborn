# Optional community introduction draft

This is a draft for review. It has not been posted to a community.

**Suggested title:** A 492-byte maze, IRQ0 and page-fault repair, written as literal x86 bits

Bitborn starts with actual `.bits` files: each byte is eight handwritten binary
digits. No assembler or target compiler chooses the instructions. Python packs
those bytes into reviewed BIOS images and Linux ELF files; QEMU and Linux CI
check the native examples. The original 512-byte boot sector still has its exact
reviewed bytes.

v0.5 adds five native experiments: a guarded allocator, legacy timer interrupt,
one page-fault repair/retry, shared frames for four exception vectors and a tiny
WASD maze. One literal comparator bit disables star collection on the same route.
Twenty actual QEMU frames show the two boots; register, memory and pixel checks
back the examples. Fault recovery applies to authored sites, not arbitrary code.

The Binary Time Machine restores recorded registers, flags, RAM and output,
including self-modifying code. Two new puzzles measure payload-byte savings with
distinct valid encodings. Instruction inspection offers explicit 16/32/64-bit
contexts. Browser execution remains a bounded 16-bit teaching model; it does not
execute imports natively or emulate the native game's keyboard/VGA behavior.

There are introductions in eight languages, literal binary/hex drafts and exact
program downloads. Main/tag CI pass, the clean source archive passes three browser
engines, and all 89 public release downloads match their prepared bytes. I would
welcome feedback on the experiments, explanations, accessibility and translation phrasing.

- [Try the Time Machine](https://othmaneblial.github.io/bitborn/cpu-lab/)
- [Compare instruction contexts](https://othmaneblial.github.io/bitborn/playground/)
- [Read the literal source](https://github.com/OthmaneBlial/bitborn)
- [Native experiments and actual footage](https://othmaneblial.github.io/bitborn/examples/)
- [Verified v0.5 release](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.5.0)

Before posting, choose a community whose rules permit project introductions and
adapt the text to its format. Do not claim complete CPU emulation, hardware support,
native speed improvements or native-speaker translation review. “Handwritten”
describes direct instruction-byte authorship; source and documentation editing are
AI-assisted. No stars, endorsements or user counts are implied by this draft.
