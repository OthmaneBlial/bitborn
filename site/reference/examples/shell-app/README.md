# A separately loaded, returning binary app

[Canonical literal source](program.bits) · [Every byte explained](bytes.md) · [Calling shell](../shell/README.md)

This 150-byte real-mode x86 app lives in disk sectors 4–5, separately from the shell in sectors 2–3. The shell's `run` command BIOS-loads its literal bytes at `0000:9000` and near-CALLs that address. The app uses its own output procedures, computes seven additions of six, stores the computed byte `2A` at physical `0601`, prints the actual result in hexadecimal, and RETs to shell logical IP `7FAD`.

Expected output is `DISK APP: 7 x 6 = 2A hex; RAM[0601]=2A`, followed by CR LF and the restored shell prompt. `2A` is decimal 42. These two hex digits come from the arithmetic result, not from the literal prefix. The suffix describes the fixed RAM experiment and is independently checked against actual memory.

The calling convention supplies `CS=DS=ES=SS=0`, a valid stack and initialized COM1. PUSHA, saved DS/ES and saved FLAGS preserve the caller state across the app; string operations explicitly run forward, and POPF restores the caller direction and interrupt state. The stack stays balanced over repeated calls. The app is not independently bootable and must not receive its own BIOS boot signature.

`python3 -m unittest tests.test_shell` verifies the separate BIOS disk read, exact loaded bytes, computed RAM result, serial output, repeated RETs and restored handler SP in a real QEMU guest. No assembler or compiler generates these instructions.
