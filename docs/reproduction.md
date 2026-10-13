# Reproduce a clean checkout

Use a new directory to check that results come from committed source. Record the
commit before running any commands; `main` continues to evolve, while release
tags identify immutable published snapshots.

```sh
git clone https://github.com/OthmaneBlial/bitborn.git bitborn-repro
cd bitborn-repro
git rev-parse HEAD
git status --short
```

Python 3.10+, Make, `qemu-system-i386`, NDISASM (from NASM) and FFmpeg are
required for the complete native checks. NDISASM reads existing instructions;
FFmpeg decodes native capture pixels. Neither generates target instructions.
Node.js 22 is the CI baseline. The host packages literal `.bits` bytes; no target
assembler or compiler is needed. See [development setup](../CONTRIBUTING.md) for
QEMU installation and browser dependencies.

## Install and verify

```sh
python3 --version
node --version
npm --version
qemu-system-i386 --version
ndisasm -v
ffmpeg -version
npm ci
make test
make site-test
git diff --exit-code
git ls-files --others --exclude-standard
```

Stop at any failed command. `make test` packs and verifies every reviewed target,
runs the Python suite and boots curated literal programs in QEMU. `make site-test`
rebuilds documentation, source copies, generated progress and download catalogs,
then runs model, parser, encoding, route and link checks. The final two Git checks
should show no tracked changes or unexpected untracked files. Ignored `build/`
and `node_modules/` are expected outputs.

## Compare every artifact across two builds

This compares SHA-256 for every manifest-reviewed build artifact, including
payloads, boot images and ELF containers. It does not use a directory glob that
could accidentally omit a target.

```sh
repro_dir=$(mktemp -d)
python3 - <<'PY' > "$repro_dir/first.json"
import json
from tools.bitborn import ROOT, artifact_paths, digest
print(json.dumps({str(path): digest((ROOT / 'build' / path).read_bytes())
                  for path in artifact_paths()}, sort_keys=True))
PY
make build
python3 - <<'PY' > "$repro_dir/second.json"
import json
from tools.bitborn import ROOT, artifact_paths, digest
print(json.dumps({str(path): digest((ROOT / 'build' / path).read_bytes())
                  for path in artifact_paths()}, sort_keys=True))
PY
cmp "$repro_dir/first.json" "$repro_dir/second.json"
git diff --exit-code
```

Matching hashes prove reproducible bytes in that environment. The separate
reviewed hashes checked by `make test` establish that those bytes also match the
target manifests. Neither check alone establishes runtime correctness.

## Platform and evidence boundaries

On macOS, BIOS programs run in QEMU, including on an ARM64 host. The native Linux
x86-64 ELF test is skipped there; the Linux CI job runs it. Browser modules can
be checked on either platform. For actual interactions and downloads, also run:

```sh
npx playwright install chromium firefox webkit
npm run test:browser
npm run test:cross-browser
python3 tools/verify_browser_export.py
```

On Linux, use `npx playwright install --with-deps chromium firefox webkit` when
browser system libraries are missing. These checks execute imported bytes only
in the bounded browser model; QEMU export validation boots a curated edited
boot sector. Physical hardware, assistive technology and native-speaker review
require separate evidence.

Browser GIF recording additionally needs FFmpeg/ffprobe and is a separate
capture operation: see [showcase provenance](../SHOWCASE.md). A normal build
copies the committed captures; it does not invent new footage.

## Verified clean-checkout checkpoint

On **2026-10-13**, a fresh remote clone at
[`accecee`](https://github.com/OthmaneBlial/bitborn/commit/acceceef1096e9818ed791ad05f0f671c60550b1)
passed the install, Python/site checks and two-build comparison above:

| Evidence | Observed result |
| --- | --- |
| Host | macOS ARM64; Python 3.12.5, Node 25.9.0, npm 11.12.1, QEMU 11.1.1 |
| Dependency installation | Fresh `npm ci` passed |
| Python/native BIOS checks | 77 tests passed; one expected native-Linux skip |
| Site/model/generated-source checks | `make site-test` passed |
| Artifact comparison | All 88 reviewed artifact SHA-256 values identical across two builds |
| Source tree after checks | No tracked changes or unexpected untracked files |
| Hash of each recipe-generated JSON map | `b9870c783eb66829c589e212ebbea5f158afca985839427f1612ee224980dc56` |

This is a dated source/environment checkpoint, not a claim that every host
produces the same test results. The CI workflow uses Ubuntu 24.04, Python 3.12
and Node 22; macOS evidence does not substitute for its native Linux ELF checks.
The browser interactions for this commit were independently checked in Chromium,
Firefox and WebKit in the development checkout, rather than in this fresh clone.
