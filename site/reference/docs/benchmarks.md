# Reproduce browser-model timing on Node.js

```sh
make site
npm run benchmark
```

This development benchmark runs the reviewed 512-byte boot image in the shared
JavaScript teaching model. The output is JSON with Node/OS/CPU details, source
hashes, workload hash, warmups, trials and observed median/p95/min/max wall time.
It checks the final halt, 2,825-instruction count and screen/serial output for
every run. CI runs the same command as a functional smoke check, without timing
thresholds.

The three cases perform the same forward execution: interpretation alone,
interpretation with history recording, and recording followed by a complete
rewind/replay. The last case also restores 5,650 recorded states; its time includes
that extra work. Initial state creation and loading the 1 MiB RAM buffer happen
outside the timer. Per-frame history allocations and any garbage collection
during the measured operation remain inside it.

These are host JavaScript measurements. They exclude DOM rendering and browser
controls, and do not measure native x86 instructions, QEMU, hardware CPU cycles,
or the speed of the operating-system experiments. Different engines, machines,
background load and garbage collection can change results. No before/after speed
claim follows from a single run. Repeat on the same environment and compare the
source/workload hashes before drawing a conclusion.

`modelBaseCommit` identifies the checked-out base revision. The separate source
hashes identify the exact measured files, including the benchmark itself; this
also makes a run from a modified working tree explicit and reproducible.

## Recorded local sample

[2026-10-12 raw evidence](benchmarks/2026-10-12-model-node25.json), Node v25.9.0,
macOS arm64, Apple M2; five warmups and 25 measured trials per case. This is a
dated measurement of the recorded source hashes, not a promise for your machine.

| Work per trial | Observed median | Observed p95 |
| --- | --- | --- |
| Execute 2,825 modeled instructions | 2.493 ms | 2.697 ms |
| Execute and record 2,825 instructions | 6.735 ms | 7.551 ms |
| Record 2,825 instructions, restore 5,650 states | 9.169 ms | 9.778 ms |
