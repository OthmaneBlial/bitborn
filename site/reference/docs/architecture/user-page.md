# One page bit protects a kernel word

This **712-byte literal research fixture** proves one native user/supervisor
page-permission boundary in QEMU/TCG. CPL-three code attempts to overwrite a
supervisor-only word at `B000`. A real #PF reports error `7` and CR2 `B000`.
The kernel captures the outer privilege frame, skips only this authored ten-byte
store and returns to user code, leaving both permission and protected word intact.

```sh
python3 -m unittest tests.test_user_page -v
```

The [canonical source](https://github.com/OthmaneBlial/bitborn/blob/main/tests/fixtures/user-page.bits)
contains every instruction, descriptor and TSS byte. The existing literal loader
reads two sectors and enters `0000:7E00`; packaging adds only padding/signature.
The complete test image is 1,536 bytes. This fixture is outside the public
artifact manifest and does not change the frozen v0.5.0 assets or browser model.

## Give the user specific pages

The directory at `4000` has one present entry, `5007`, pointing to a table at
`5000`. It permits user access only when the selected PTE also permits it. The
table identity-maps the low four MiB with 1,024 four-KiB entries. Paging is legacy
non-PAE; CR0.PG, CR0.WP and CR0.PE are set, and CR3 is `4000`.

| Linear page | Initial PTE flags | Purpose |
| --- | --- | --- |
| `7000` | `5`: present, user, read-only | Code and GDT; execution is permitted by this legacy mapping |
| `8000` | `3`: present, supervisor, writable | Kernel stack below `9000`, IDT and part of the TSS |
| `A000` | `7`: present, user, writable | User stack, ESP initially `A800` |
| `B000` | `3`: present, supervisor, writable | Protected word initialized to `DEADBEEF` |
| `20000` | `7`: present, user, writable | Completion marker initialized to zero |
| Other entries | `3`: present, supervisor, writable | Includes directory, table and kernel log pages |

User code actually PUSHes ESI to `A7FC`, POPs it into EDX, restores ESP `A800`
and writes its completion marker at `20000`. These accesses prove the permitted
user stack/data paths. Tests inspect every directory/PTE word, allowing only
processor-managed accessed/dirty bits beyond the exact authored mapping.

GDT accessed bits are already set in the literal descriptors. LTR marks the TSS
descriptor busy before paging starts, so later selector loads need not write the
read-only code/GDT page. Both native cases leave that page's dirty bit clear.
The full loaded source is unchanged except for that pre-paging TSS busy bit.

## Read the denied-write frame

| Item | Actual value |
| --- | --- |
| User entry | `7F00`, CS `001B`, DS/ES/SS `0023`, ESP `A800` |
| Faulting user store | `7F11`, source byte 273, ten-byte `MOV dword [B000],11223344` |
| Error / CR2 | `7` (present, write, user) / `B000` |
| TSS and kernel stack | TR `0028`, base `7FE0`, limit `0067`; SS0 `0010`, ESP0 `9000` |
| PF handler | `7F40`, kernel CS `0008`, through vector fourteen |
| Hardware frame | `8FE8–8FFF`: error, EIP, CS, EFLAGS, old ESP, old SS |
| Captured original words | `6000–6017`: `7`, `7F11`, `1B`, saved flags, `A800`, `23` |
| Additional samples | CR2 at `6018`; actual kernel CS/SS at `601C/601E` |
| Returned user checkpoint | `7F25`, CPL three, HLT zero, original ESP `A800` |

PUSHAD retains caller registers at `8FC8–8FE7`. The handler logs the original
six hardware words, restores registers, advances only saved EIP by ten, removes
the error slot and executes IRETD. The retained return frame matches the captured
frame except for EIP `7F11 → 7F1B`. The kernel does not grant user access or retry
the protected store. DF is restored; IF and IOPL stay zero.

The denied write leaves `DEADBEEF` intact and the target PTE's dirty bit clear.
Completion marker `20000` becomes `55667788` after the scoped fault return.
Known ECX/ESI/EDI/EDX values, retained register words, segments, stack, CR0/CR3/CR4,
loader RAM, loaded source/TSS and read-only disk all have independent checks.

## One permission bit permits the same store

Source byte 149 is the low-byte immediate used to initialize PTE `502C`.
Toggle bit two: `3 → 7`, adding user permission to the same present writable page.
The user instruction bytes are identical. The store now writes `11223344` at
`B000`, the PTE becomes dirty, and the PF marker/log remain zero. Both cases reach
the same user checkpoint with restored registers, flags and stack balance.

This control isolates the page permission from instruction encoding and CPL.
It does not claim that the permission-enabled variant still protects that word.

## Scope

This proves one denied user write plus allowed user code, stack and marker paths.
Code-page read-only permission and the remaining supervisor mappings are
structurally checked; attempts to read the protected word or overwrite code are
separate negative probes. Kernel code shares an executable page visible to the
user, and recovery knows one fixed store length. There is no arbitrary-process
sandbox, general fault recovery, scheduler, modern NX/PAE/long-mode paging,
physical-hardware or UEFI proof here. The user checkpoint spins until QMP stops it.

See the [privilege fault](user-privilege.md), [callable user/kernel gate](user-gate.md)
and [supervisor paging repair](../../examples/paging/README.md) for their separate
native proof boundaries. Normative reference:
[Intel SDM Volume 3A, revision 093](https://cdrdv2-public.intel.com/929359/253668-093-sdm-vol-3a.pdf),
sections 5.6 (access rights), 5.7 (page-fault exceptions) and 10.2.1 (TSS).
