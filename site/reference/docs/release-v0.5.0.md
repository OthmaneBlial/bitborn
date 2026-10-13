# bitborn v0.5.0 — Native state, one bit at a time

Published **2026-10-13** from immutable source
[`f5b444a`](https://github.com/OthmaneBlial/bitborn/commit/f5b444a0ebb6c4dd52592c41443141a34f77e066).
All 89 [public attachments](https://github.com/OthmaneBlial/bitborn/releases/tag/v0.5.0)
were downloaded anonymously and match the prepared bytes. Earlier releases remain unchanged.

[Main CI](https://github.com/OthmaneBlial/bitborn/actions/runs/38397864668) and
[tag CI](https://github.com/OthmaneBlial/bitborn/actions/runs/38398890607) pass.
The exact source archive independently passes 114 Python tests (one expected
macOS native-Linux skip), site/model checks and Chromium, Firefox 157 and WebKit
27.2 interactions. All 112 rebuilt artifact hashes match provenance, and all
1,021 archived source files remain unchanged after those checks.

Executable instructions remain literal handwritten `.bits` tokens. Host tools
package and inspect those bytes; comments and address references never generate
target instructions.

## Five new native experiments

- [Bounded allocator](../examples/bounded-allocator/README.md): a 220-byte routine
  checks a guarded sixteen-byte arena. One bit changes an accepted request into
  rejection. Actual guest logs and identical-byte model rewind/replay prove the
  bounded behavior; this is not a general memory manager.
- [Timer IRQ](../examples/timer-irq/README.md): a legacy PIT/PIC IRQ0 experiment
  checks native interrupt delivery, masks, acknowledgement and retained frames.
  Masked and missing-EOI controls establish distinct stops. It does not schedule
  concurrent user programs.
- [Paging](../examples/paging/README.md): a 424-byte program handles one native
  supervisor write fault, repairs PTE.RW, invalidates the translation and retries
  the unchanged store. Writable/WP-off controls avoid the fault. All directory
  and table entries are captured; user isolation and browser paging are unproven.
- [Shared exception frames](../examples/exception-dispatch/README.md): 736 bytes
  normalize DE/BP/UD/GP frames, preserve registers/DF and distinguish fault/trap
  return addresses. Three one-bit controls avoid division failure, retain a
  stopped context or fill the bounded log. Recovery applies to authored sites.
- [Bit Hunt](../examples/bit-hunt/README.md): a 492-byte BIOS maze accepts WASD,
  blocks walls, collects a star, resets with R and quits with Q. Its move counter
  saturates safely. Changing one comparator bit disables victory on the same
  route. Twenty actual QEMU frames supply a pixel-checked two-boot GIF.

## Learn, optimize and check

The browser offers 22 challenges, including two size-budget puzzles with distinct
valid encodings: register clearing saves two payload bytes (14 to 12), and value
transfer saves one (11 to 10). Locked setup and explicit flag/stack tradeoffs keep
the measurements meaningful; no speed improvement is claimed.

Word-register ADD has independent arithmetic/selector checks and native parity.
Keyboard tests cover timeline controls, actual focus navigation and source errors
in three browser engines. Eleven setup documents now check their native test
install commands against CI's package requirements. Release staging refuses to
overwrite a different recorded version/source revision.

Browser imports execute only the documented bounded model. Native-only games,
interrupts, paging and exception delivery are not advertised as browser emulation.
Native speaker and assistive technology review remain separate evidence.

## Distribution and reproduction

The packaging list contains **14 primary BIOS images**, a deterministic archive
of **112 manifest-reviewed artifacts**, an exact source archive, **71 evidence files**,
release provenance and checksums: 89 files total, with 88 checksum entries.
Evidence includes actual native registers/disassembly, PIC state, paging tables,
exception logs/stack/code RAM and game pixels, plus existing demonstrations.
The archive README explains which bytes are images, raw payloads or Linux ELFs.

```sh
sha256sum -c SHA256SUMS
qemu-system-i386 -drive file=bit-hunt.img,format=raw,if=floppy -boot a
```

On macOS use `shasum -a 256 -c SHA256SUMS`. Rebuild from source with the
[complete setup and clean-checkout recipe](reproduction.md), then:

```sh
make test site-test
npm ci
npx playwright install chromium firefox webkit
npm run test:browser
npm run test:cross-browser
```

Source archives have no Git history. Release preparation additionally needs a
clean checkout of the exact source commit. Provenance establishes source/output
integrity, not a publisher signature or human-only authorship; AI assistance is
disclosed. Physical hardware, UEFI, production use, arbitrary fault recovery and
modern interrupt/paging architectures remain outside the established evidence.

[Website](https://othmaneblial.github.io/bitborn/) · [Roadmap](../ROADMAP.md) ·
[Execution scope](execution-scope.md) · [Changelog](../CHANGELOG.md)
