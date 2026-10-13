# Register ADD: the same two bytes, two directions

The model executes unprefixed **16-bit register-direct** ADD encodings `01 /r`
and `03 /r`. The ModR/M mode must be `11`; other modes stop before execution.

| Bytes | Destination | Source | Meaning |
| --- | --- | --- | --- |
| `01 D8` | AX, the r/m field | BX, the reg field | Add the original BX to AX |
| `03 D8` | BX, the reg field | AX, the r/m field | Add the original AX to BX |

Opcode bit 1 chooses the direction. ModR/M bits 5–3 select `reg`; bits 2–0
select `r/m`. Both operands are read before the destination is written, so
`ADD BP,BP` doubles its original value. SP is an ordinary word operand here;
changing it does not itself push, pop or call.

The result wraps modulo 65536. CF reports unsigned carry, OF signed overflow,
AF carry out of bit 3, ZF a zero result, SF bit 15, and PF even parity of the
low byte. IF and DF are preserved. ADD ignores incoming CF; ADC has different
semantics. These encodings do not imply support for byte, memory, prefixed or
32-/64-bit ADD. Wider-context inspection rejects them explicitly.

## Independent evidence

The existing bit-by-bit arithmetic oracle checks all **128** direction/selector
combinations with boundary and seeded operands: **29,824 cases**, including
source/destination aliases and SP. Two boundary additions for every word value
add **131,072 cases**. Checks cover every register, six arithmetic flags, IF/DF,
empty RAM journals and inspection/execution agreement.

[Six literal native probes](https://github.com/OthmaneBlial/bitborn/blob/main/tests/fixtures/register-add.bits) use both
directions, multiple word registers and BP/SP aliases. PUSHF records actual
QEMU flags immediately after each ADD; MOV stores results without changing flags.
The native test checks independent expected result/flag pairs against the model,
unchanged code RAM and the read-only disk image. These are sampled QEMU results,
not physical-hardware evidence or exhaustive native arithmetic coverage.

The existing [guarded allocator](../../examples/bounded-allocator/README.md)
now halts in the model after 135/137 instructions. Its logs, guards, AX/BX/DI/SP,
CS/DS/SS, defined flags and code bytes agree with the separate native captures. Every
model checkpoint rewinds and replays against a full 1 MiB RAM/state oracle.
Native captures themselves do not provide rewind.

```sh
node tests/test_flags_properties.mjs
node tests/test_allocator_scope.mjs
python3 -m unittest tests.test_register_add tests.test_bounded_allocator -v
node tests/browser_cpu_lab.mjs
```

The [Intel instruction reference](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
defines the encodings and flags. All target probe instructions remain literal
`.bits`; no assembler or compiler generates them.
