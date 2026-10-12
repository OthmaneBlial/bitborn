# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `01101010` | `6A` | instruction: PUSH 60, byte 1/2 | 6A sign-extends the immediate to a 64-bit stack word. |
| 1 | `00111100` | `3C` | instruction: PUSH 60, byte 2/2 | 6A sign-extends the immediate to a 64-bit stack word. |
| 2 | `01011000` | `58` | instruction: POP RAX, byte 1/1 | 58 moves that stack word into the syscall-number register. |
| 3 | `01101010` | `6A` | instruction: PUSH 42, byte 1/2 | Push the desired exit status as a 64-bit word. |
| 4 | `00101010` | `2A` | instruction: PUSH 42, byte 2/2 | Push the desired exit status as a 64-bit word. |
| 5 | `01011111` | `5F` | instruction: POP RDI, byte 1/1 | 5F restores the stack pointer and sets the first syscall argument. |
| 6 | `00001111` | `0F` | instruction: SYSCALL, byte 1/2 | 0F 05 enters the Linux kernel; syscall 60 exits with status 42. |
| 7 | `00000101` | `05` | instruction: SYSCALL, byte 2/2 | 0F 05 enters the Linux kernel; syscall 60 exits with status 42. |
