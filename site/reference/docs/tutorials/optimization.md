# Measure a smaller program

Try [Clear two registers](https://othmaneblial.github.io/bitborn/challenges/?id=clear-smaller)
or [Reuse a value](https://othmaneblial.github.io/bitborn/challenges/?id=transfer-smaller).
These puzzles allow a shorter literal program after seven locked setup bytes.
The complete payload, including setup and the final HLT, counts toward the goal.
Comments and whitespace do not count; unreachable trailing bytes do.

The setup masks interrupts and gives AX and BX known, different values. Keep it
unchanged. A program that merely halts with the initial values cannot win. The
model checks halt, the requested register values, balanced SP and the byte
budget, rather than comparing your source with a preferred solution.

| Challenge | Starting payload | Reviewed solution | Distinct reviewed alternative |
| --- | --- | --- | --- |
| Clear AX and BX | 14 bytes | 12 bytes: XOR AX,AX; XOR BX,BX | 12 bytes: XOR AX,AX; MOV BX,AX |
| Copy AX=42 into BX | 11 bytes | 10 bytes: MOV BX,AX | 10 bytes: PUSH AX; POP BX |

Each row saves bytes against its starting program. The two reviewed solutions
within a row have the same size; the tool does not claim either is fastest or
globally minimal. All four are directly authored binary sources:
[clear primary](../../challenges/clear-smaller/solution.bits),
[clear alternative](../../challenges/clear-smaller/alternative.bits),
[transfer primary](../../challenges/transfer-smaller/solution.bits) and
[transfer alternative](../../challenges/transfer-smaller/alternative.bits).

## Same goals, different side effects

For clearing, the original MOV immediate instructions leave arithmetic flags
alone. XOR changes those flags, and AF is undefined. This puzzle's goals do not
include arithmetic flags, so the smaller versions meet the stated goal without
claiming equivalence for a caller that needs the original flags.

For transfer, MOV BX,AX touches no stack RAM. PUSH AX writes 2A 00 at 0000:7BFE;
POP BX restores SP to 7C00 but leaves those bytes there. Balanced SP is a goal;
unchanged stack RAM is not. If a caller depends on that memory, the stack pair
is a different choice. The native test checks the actual remaining bytes.

## Payload size and disk size

The raw payloads shrink by two and one bytes respectively. Their QEMU floppy
fixtures stay **1536 bytes**: a 512-byte loader sector and a padded two-sector
read. The payload saving does not shrink that fixed disk image. The loader
establishes CS=DS=ES=SS=0 and SP=7C00 before entering the fragment at 0000:7E00.

## Reproduce the evidence

```sh
make build
node tests/test_challenges.mjs
python3 -m unittest tests.test_challenges -v
node tests/browser_challenges.mjs
npm run test:cross-browser
```

The Python suite boots 26 curated cases: 22 primary solutions, two alternatives
and the two optimization starts. For these six new programs it checks actual
registers, halt, IF=0, balanced SP and unchanged instruction RAM. Independent
NDISASM checks cover every instruction's bytes and boundaries. Reviewed source
sizes and SHA-256 hashes are in [the manifest](../../challenges/targets.json).
The starts reach their value goals but exceed their byte budgets.

Browser checks submit both alternatives, measure their lengths, reject altered
setup and size-only halts, preserve local completion behavior and check desktop
and 320px layouts. User edits execute only in the bounded teaching model,
with at most 512 input bytes and 96 steps for these puzzles. QEMU boots only the
curated reviewed sources. The challenge GIF consists of actual browser captures;
it is separate from native execution and does not measure instruction timing.
