# Twenty binary challenges

Each `start.bits` and `solution.bits` is a canonical, directly authored sequence of eight-digit binary tokens. Comments describe the bytes; they do not generate them. `catalog.json` supplies learning goals, edit rules, hints and explanations. `targets.json` records reviewed byte sizes and SHA-256 hashes for both sources. `tools/build_challenges.py` only packages those existing bytes for the website.

The four five-stage paths move from registers and byte order through arithmetic and control flow, then stacks and flags, and finally memory and boot architecture. The interactive validator checks register, flag, memory and output goals, accepts alternative solutions within each edit budget, and stops after a bounded number of steps. It is a teaching model, not a full x86 emulator.

Nineteen real-mode fragments load at `0000:7E00` through `boot/loader.bits`. The loader establishes `CS=DS=ES=SS=0` and `SP=7C00`; fragment instructions explicitly initialize the general-purpose values they use. CLI keeps their final HLT stopped. `repair-boot` is a copy of the actual 512-byte boot source with exactly three deliberately damaged opcode bits. Its reviewed solution is byte-identical to `boot/boot.bits`.

Run `python3 tools/build_challenges.py`, `node tests/test_challenges.mjs` and `python3 -m unittest tests.test_challenges`. The Python test boots only the reviewed solutions in isolated QEMU guests and checks actual registers, flags, memory and VGA/serial output. No downloaded or user-edited program executes on the host. `node tests/browser_challenges.mjs` checks all twenty completions, hints, shared URLs, local progress, hostile input and responsive keyboard use in a real browser.

Progress lives only in the current browser's local storage. There are no accounts, analytics or network submissions. Deleting site data clears the local completion record. Source and explanations were developed with AI assistance and checked with independent QEMU execution.
