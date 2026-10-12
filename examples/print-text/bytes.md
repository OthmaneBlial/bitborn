# Every byte explained

Generated from canonical `.bits` annotations by `python3 tools/byte_tables.py`.

Instruction names below are disassembly for explanation, never code-generation input.

| Offset | Binary | Hex | Range / byte within it | Encoding explanation |
| --- | --- | --- | --- | --- |
| 0 | `10111000` | `B8` | instruction: MOV EAX,1, byte 1/5 | B8 loads Linux x86-64 write syscall number. |
| 1 | `00000001` | `01` | instruction: MOV EAX,1, byte 2/5 | B8 loads Linux x86-64 write syscall number. |
| 2 | `00000000` | `00` | instruction: MOV EAX,1, byte 3/5 | B8 loads Linux x86-64 write syscall number. |
| 3 | `00000000` | `00` | instruction: MOV EAX,1, byte 4/5 | B8 loads Linux x86-64 write syscall number. |
| 4 | `00000000` | `00` | instruction: MOV EAX,1, byte 5/5 | B8 loads Linux x86-64 write syscall number. |
| 5 | `10111111` | `BF` | instruction: MOV EDI,1, byte 1/5 | BF selects stdout file descriptor. |
| 6 | `00000001` | `01` | instruction: MOV EDI,1, byte 2/5 | BF selects stdout file descriptor. |
| 7 | `00000000` | `00` | instruction: MOV EDI,1, byte 3/5 | BF selects stdout file descriptor. |
| 8 | `00000000` | `00` | instruction: MOV EDI,1, byte 4/5 | BF selects stdout file descriptor. |
| 9 | `00000000` | `00` | instruction: MOV EDI,1, byte 5/5 | BF selects stdout file descriptor. |
| 10 | `01001000` | `48` | instruction: LEA RSI,[RIP+16], byte 1/7 | 48 is REX.W; 8D /r with ModR/M 35 is RIP-relative RSI; next offset 17 + 16 = data at 33. |
| 11 | `10001101` | `8D` | instruction: LEA RSI,[RIP+16], byte 2/7 | 48 is REX.W; 8D /r with ModR/M 35 is RIP-relative RSI; next offset 17 + 16 = data at 33. |
| 12 | `00110101` | `35` | instruction: LEA RSI,[RIP+16], byte 3/7 | 48 is REX.W; 8D /r with ModR/M 35 is RIP-relative RSI; next offset 17 + 16 = data at 33. |
| 13 | `00010000` | `10` | instruction: LEA RSI,[RIP+16], byte 4/7 | 48 is REX.W; 8D /r with ModR/M 35 is RIP-relative RSI; next offset 17 + 16 = data at 33. |
| 14 | `00000000` | `00` | instruction: LEA RSI,[RIP+16], byte 5/7 | 48 is REX.W; 8D /r with ModR/M 35 is RIP-relative RSI; next offset 17 + 16 = data at 33. |
| 15 | `00000000` | `00` | instruction: LEA RSI,[RIP+16], byte 6/7 | 48 is REX.W; 8D /r with ModR/M 35 is RIP-relative RSI; next offset 17 + 16 = data at 33. |
| 16 | `00000000` | `00` | instruction: LEA RSI,[RIP+16], byte 7/7 | 48 is REX.W; 8D /r with ModR/M 35 is RIP-relative RSI; next offset 17 + 16 = data at 33. |
| 17 | `10111010` | `BA` | instruction: MOV EDX,21, byte 1/5 | BA loads exact ASCII message length. |
| 18 | `00010101` | `15` | instruction: MOV EDX,21, byte 2/5 | BA loads exact ASCII message length. |
| 19 | `00000000` | `00` | instruction: MOV EDX,21, byte 3/5 | BA loads exact ASCII message length. |
| 20 | `00000000` | `00` | instruction: MOV EDX,21, byte 4/5 | BA loads exact ASCII message length. |
| 21 | `00000000` | `00` | instruction: MOV EDX,21, byte 5/5 | BA loads exact ASCII message length. |
| 22 | `00001111` | `0F` | instruction: SYSCALL, byte 1/2 | 0F 05 writes the message through the Linux kernel. |
| 23 | `00000101` | `05` | instruction: SYSCALL, byte 2/2 | 0F 05 writes the message through the Linux kernel. |
| 24 | `10111000` | `B8` | instruction: MOV EAX,60, byte 1/5 | B8 loads Linux exit syscall number. |
| 25 | `00111100` | `3C` | instruction: MOV EAX,60, byte 2/5 | B8 loads Linux exit syscall number. |
| 26 | `00000000` | `00` | instruction: MOV EAX,60, byte 3/5 | B8 loads Linux exit syscall number. |
| 27 | `00000000` | `00` | instruction: MOV EAX,60, byte 4/5 | B8 loads Linux exit syscall number. |
| 28 | `00000000` | `00` | instruction: MOV EAX,60, byte 5/5 | B8 loads Linux exit syscall number. |
| 29 | `00110001` | `31` | instruction: XOR EDI,EDI, byte 1/2 | 31 /r, ModR/M FF; clear exit status to zero. |
| 30 | `11111111` | `FF` | instruction: XOR EDI,EDI, byte 2/2 | 31 /r, ModR/M FF; clear exit status to zero. |
| 31 | `00001111` | `0F` | instruction: SYSCALL, byte 1/2 | 0F 05 terminates the process. |
| 32 | `00000101` | `05` | instruction: SYSCALL, byte 2/2 | 0F 05 terminates the process. |
| 33 | `01001000` | `48` | data: Hello from raw bits! LF, byte 1/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 34 | `01100101` | `65` | data: Hello from raw bits! LF, byte 2/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 35 | `01101100` | `6C` | data: Hello from raw bits! LF, byte 3/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 36 | `01101100` | `6C` | data: Hello from raw bits! LF, byte 4/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 37 | `01101111` | `6F` | data: Hello from raw bits! LF, byte 5/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 38 | `00100000` | `20` | data: Hello from raw bits! LF, byte 6/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 39 | `01100110` | `66` | data: Hello from raw bits! LF, byte 7/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 40 | `01110010` | `72` | data: Hello from raw bits! LF, byte 8/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 41 | `01101111` | `6F` | data: Hello from raw bits! LF, byte 9/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 42 | `01101101` | `6D` | data: Hello from raw bits! LF, byte 10/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 43 | `00100000` | `20` | data: Hello from raw bits! LF, byte 11/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 44 | `01110010` | `72` | data: Hello from raw bits! LF, byte 12/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 45 | `01100001` | `61` | data: Hello from raw bits! LF, byte 13/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 46 | `01110111` | `77` | data: Hello from raw bits! LF, byte 14/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 47 | `00100000` | `20` | data: Hello from raw bits! LF, byte 15/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 48 | `01100010` | `62` | data: Hello from raw bits! LF, byte 16/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 49 | `01101001` | `69` | data: Hello from raw bits! LF, byte 17/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 50 | `01110100` | `74` | data: Hello from raw bits! LF, byte 18/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 51 | `01110011` | `73` | data: Hello from raw bits! LF, byte 19/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 52 | `00100001` | `21` | data: Hello from raw bits! LF, byte 20/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
| 53 | `00001010` | `0A` | data: Hello from raw bits! LF, byte 21/21 | Twenty-one literal ASCII bytes; the length excludes any terminator. |
