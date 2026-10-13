"""Real QEMU/SeaBIOS execution, bounded by output predicates instead of boot sleeps."""
import json
import os
import shutil
import socket
import subprocess
import tempfile
import time
from contextlib import ExitStack
from pathlib import Path


class Guest:
    def __init__(self, image, paused=False):
        self.image = Path(image).resolve()
        self.paused = paused

    def __enter__(self):
        executable = os.environ.get("QEMU", "qemu-system-i386")
        if not shutil.which(executable):
            raise RuntimeError(f"{executable} is required; install QEMU")
        self.resources = ExitStack()
        try:
            self.directory = Path(self.resources.enter_context(tempfile.TemporaryDirectory(prefix="bitborn-")))
            self.serial = self.directory / "serial.log"
            qmp = self.directory / "qmp.sock"
            # shortcut: logs are uncapped for curated fixtures; add quotas before serving arbitrary workloads.
            self.errors = self.resources.enter_context((self.directory / 'stderr.log').open('w+b'))
            self.process = subprocess.Popen([executable, "-machine", "pc,accel=tcg", "-m", "16M", "-display", "none",
                "-drive", f"file={self.image},format=raw,if=floppy,readonly=on", "-boot", "a", "-serial", f"file:{self.serial}",
                "-qmp", f"unix:{qmp},server=on,wait=off", "-no-reboot", "-nic", "none"] + (["-S"] if self.paused else []),
                stdout=subprocess.DEVNULL, stderr=self.errors)
            self.resources.callback(self.stop)
            deadline = time.monotonic() + 15
            while not qmp.exists():
                self.alive(deadline)
                time.sleep(0.02)
            self.socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
            self.resources.callback(self.socket.close)
            while True:
                try:
                    self.socket.settimeout(max(0.001, deadline - time.monotonic()))
                    self.socket.connect(str(qmp))
                    break
                except (ConnectionRefusedError, FileNotFoundError):
                    self.alive(deadline)
                    time.sleep(0.02)
            self.buffer = b''
            if 'QMP' not in self.response(deadline):
                raise RuntimeError('Invalid QMP greeting')
            self.command("qmp_capabilities")
            return self
        except BaseException:
            self.__exit__(None, None, None)
            raise

    def response(self, deadline):
        while True:
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                raise TimeoutError('QMP response deadline exceeded')
            line, separator, rest = self.buffer.partition(b'\n')
            if len(line) > 65536:
                raise RuntimeError('QMP response exceeds 64 KiB')
            if separator:
                self.buffer = rest
                result = json.loads(line)
                if not isinstance(result, dict):
                    raise RuntimeError('QMP response must be an object')
                return result
            self.socket.settimeout(remaining)
            chunk = self.socket.recv(4096)
            if not chunk:
                raise RuntimeError('QMP connection closed')
            self.buffer += chunk

    def command(self, execute, arguments=None):
        payload = {"execute": execute}
        if arguments is not None:
            payload["arguments"] = arguments
        deadline = time.monotonic() + 15
        self.socket.settimeout(15)
        self.socket.sendall(json.dumps(payload).encode() + b"\n")
        while True:
            response = self.response(deadline)
            if "error" in response:
                raise RuntimeError(response["error"])
            if "return" in response:
                return response["return"]

    def alive(self, deadline):
        if self.process.poll() is not None:
            self.errors.seek(0)
            detail = self.errors.read(4096).decode(errors='replace')
            raise RuntimeError(f"QEMU exited ({self.process.returncode}): {detail}")
        if time.monotonic() > deadline:
            raise AssertionError(f"QEMU output deadline exceeded; serial={self.output()!r}")

    def output(self):
        return self.serial.read_bytes() if self.serial.exists() else b""

    def wait_for(self, predicate, timeout=15):
        deadline = time.monotonic() + timeout
        while True:
            output = self.output()
            if predicate(output):
                return output
            self.alive(deadline)
            time.sleep(0.02)

    def hmp(self, command):
        return self.command("human-monitor-command", {"command-line": command})

    def key(self, name):
        self.command("send-key", {"keys": [{"type": "qcode", "data": name}], "hold-time": 1})

    def screenshot(self, path):
        self.command("screendump", {"filename": str(Path(path).resolve())})

    def memory(self, address, size):
        path = self.directory / "memory.bin"
        self.command("pmemsave", {"val": address, "size": size, "filename": str(path)})
        return path.read_bytes()

    def stop(self):
        if self.process.poll() is None:
            self.process.terminate()
            try:
                self.process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.process.kill()
                self.process.wait(timeout=5)

    def __exit__(self, *args):
        if getattr(self, 'resources', None):
            self.resources.close()
