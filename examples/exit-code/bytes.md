# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `10111000` | `B8` | instruction: MOV EAX,60, byte 1/5 | B8+EAX, imm32 60; selects Linux x86-64 exit syscall. |
| 1 | `00111100` | `3C` | instruction: MOV EAX,60, byte 2/5 | B8+EAX, imm32 60; selects Linux x86-64 exit syscall. |
| 2 | `00000000` | `00` | instruction: MOV EAX,60, byte 3/5 | B8+EAX, imm32 60; selects Linux x86-64 exit syscall. |
| 3 | `00000000` | `00` | instruction: MOV EAX,60, byte 4/5 | B8+EAX, imm32 60; selects Linux x86-64 exit syscall. |
| 4 | `00000000` | `00` | instruction: MOV EAX,60, byte 5/5 | B8+EAX, imm32 60; selects Linux x86-64 exit syscall. |
| 5 | `10111111` | `BF` | instruction: MOV EDI,42, byte 1/5 | BF = B8+EDI, imm32 42; exit status goes in RDI via zero extension. |
| 6 | `00101010` | `2A` | instruction: MOV EDI,42, byte 2/5 | BF = B8+EDI, imm32 42; exit status goes in RDI via zero extension. |
| 7 | `00000000` | `00` | instruction: MOV EDI,42, byte 3/5 | BF = B8+EDI, imm32 42; exit status goes in RDI via zero extension. |
| 8 | `00000000` | `00` | instruction: MOV EDI,42, byte 4/5 | BF = B8+EDI, imm32 42; exit status goes in RDI via zero extension. |
| 9 | `00000000` | `00` | instruction: MOV EDI,42, byte 5/5 | BF = B8+EDI, imm32 42; exit status goes in RDI via zero extension. |
| 10 | `00001111` | `0F` | instruction: SYSCALL, byte 1/2 | 0F 05 enters the Linux kernel; exit does not return. |
| 11 | `00000101` | `05` | instruction: SYSCALL, byte 2/2 | 0F 05 enters the Linux kernel; exit does not return. |
