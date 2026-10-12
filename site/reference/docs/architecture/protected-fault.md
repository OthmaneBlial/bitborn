# Catch one protected-mode fault with literal bits

A 200-byte handwritten research fixture enters 32-bit protected mode, loads an
IDT with one present vector-six gate, and executes literal `0F 0B` (UD2). The
CPU raises #UD, the handler records the original saved EIP, advances that saved
EIP by the known two-byte instruction length, and returns through IRETD.
The guest resumes at the instruction after UD2 and reaches a controlled halt.

Run the actual QEMU/TCG checks:

```sh
python3 -m unittest tests.test_protected_fault -v
```

The [canonical fixture](https://github.com/OthmaneBlial/bitborn/blob/main/tests/fixtures/protected-fault.bits)
contains all instruction and descriptor bytes. Host packaging adds only BIOS
padding/signature. This is curated native research, not imported-code execution
or a new release download. The existing protected-mode gallery example remains
the separate software INT 20 demonstration.

## Exact addresses and frame

| Item | Physical address / value |
| --- | --- |
| Protected entry | `7C28`, code selector `0008`, CS.D=1 |
| Flat data/stack selector | `0010`, ESP initially `9000` |
| UD2 | `7C3D`, bytes `0F 0B` |
| Following instruction | `7C3F`, MOV ECX,[9000] |
| Handler | `7C48` |
| GDT | `7C68`, 24 bytes; GDTR limit 23 |
| IDT | `7C90`, seven eight-byte entries; IDTR limit 55 |
| Vector-six gate | `7CC0`, bytes `48 7C 08 00 00 8E 00 00` |
| Saved EIP / CS / EFLAGS | `8FF4` / `8FF8` / `8FFC` |
| Original fault EIP recorded by the handler | `9000` contains `3D 7C 00 00` |
| Final state | EAX=ECX=`7C3D`, ESP=`9000`, HLT with next EIP=`7C46` |

The interrupt gate is present, DPL0, 32-bit, and points to selector `0008`.
UD2 raises a CPU fault; it does not use a software INT instruction. #UD supplies
no error code, so `[ESP]` at handler entry identifies the saved fault EIP.
At the same privilege level, the three doublewords contain EIP, CS and EFLAGS.
The handler changes only EIP in that frame. IF remains clear before and after
return, CR0.PE is set and paging stays disabled.

The [Intel system programming manual, section 6.15, Invalid Opcode](https://www.intel.com/content/dam/www/public/us/en/documents/manuals/64-ia-32-architectures-software-developer-vol-3a-part-1-manual.pdf)
defines #UD as a fault with no error code and a saved pointer to the invalid
instruction. Compare the [real-mode divide-fault probe](divide-fault.md), which
repairs an operand and retries rather than advancing the saved instruction pointer.

## What the CPU changes

QMP tests read the actual guest RAM, selectors, mode, registers and saved frame.
Loading a data segment sets its GDT descriptor accessed bit: the literal `92`
access byte becomes `93`. Tests check that bit and permit only CPU-managed
accessed-bit changes in the code/data descriptors; all instruction bytes,
pointers, gate bytes and other descriptor bits must match the source.

The fixture handles only this deliberate UD2 at one known address and length.
Advancing an arbitrary fault by two bytes would be incorrect. All other gates
are null; this is not a general dispatcher, instruction decoder, hardware IRQ
handler, paging implementation, or physical-hardware validation. External
maskable interrupts remain disabled. QEMU is bounded, disks are read-only and
networking is disabled.
