# Native QEMU verification harness

`tests/qemu.py` runs real QEMU/SeaBIOS with TCG, 16 MiB of guest RAM, no display,
no NIC and a read-only floppy image. Curated native tests, recording tools and
downloaded-image verification use the same `Guest` context manager. None execute
the guest's target instructions directly on the host.

## Resource ownership and deadlines

The harness checks the executable before allocating resources. An `ExitStack`
owns the temporary directory, stderr file, child and QMP socket from the moment
each is acquired. Launch, connect, greeting and capability failures unwind these
resources. Closing the context again is harmless.

- Socket availability and the QMP greeting share a 15-second deadline.
- Each QMP command has one 15-second deadline covering send and response. Events
  and partial lines do not reset it. One response line may contain at most
  65,536 bytes before its newline; EOF and non-object replies fail explicitly.
- Output predicates retain their requested deadline, defaulting to 15 seconds.
- Teardown requests termination and waits at most 5 seconds. A child that remains
  alive is killed, followed by another wait of at most 5 seconds. No unbounded
  final `wait()` remains. If the OS cannot reap a killed child in that interval,
  cleanup reports the timeout and still closes the other resources.

Stderr goes to a temporary file instead of an unread pipe, so diagnostic output
cannot fill a pipe and deadlock startup. Exit errors include at most 4,096 bytes
of diagnostic text; malformed UTF-8 is replaced rather than masking the failure.
Serial and stderr files are not disk-size capped. This is a verification harness
for bounded curated experiments, not a service for arbitrary guest workloads.

## Regression evidence

```sh
python3 -m unittest tests.test_qemu_harness
make test
```

Focused checks cover missing executables, failed launches/connections, malformed
greetings, capability errors, EOF, fragmented/event replies, protocol size/type
bounds and deadline exhaustion. Resource assertions verify closed sockets/files,
removed temporary directories and idempotent cleanup.

Two real host-Python test children verify subprocess behavior: a large stderr
write exits without pipe blockage, and a child that ignores SIGTERM is killed
and reaped after the graceful wait. They are test doubles, not guest machine-code
execution. The complete native suite separately boots the curated `.bits` images
in QEMU and checks the actual guest state.

Socket-file existence is not connection readiness. Startup retries temporary
connection refusal or a disappearing socket under the same absolute deadline,
updating the remaining socket timeout for each attempt. Failure still closes
all resources; a regression covers refusal/disappearance before a successful
greeting and the bounded failure cleanup path.
