"""Real QEMU/SeaBIOS execution, bounded by output predicates instead of boot sleeps."""
import json
import os
import shutil
import socket
import subprocess
import tempfile
import time
from pathlib import Path


class Guest:
    def __init__(self, image, paused=False):
        self.image = Path(image).resolve()
        self.paused = paused

    def __enter__(self):
        self.temp = tempfile.TemporaryDirectory(prefix="bitborn-")
        self.directory = Path(self.temp.name)
        self.serial = self.directory / "serial.log"
        qmp = self.directory / "qmp.sock"
        executable = os.environ.get("QEMU", "qemu-system-i386")
        if not shutil.which(executable):
            raise RuntimeError(f"{executable} is required; install QEMU")
        self.process = subprocess.Popen([executable, "-machine", "pc,accel=tcg", "-m", "16M", "-display", "none",
            "-drive", f"file={self.image},format=raw,if=floppy,readonly=on", "-boot", "a", "-serial", f"file:{self.serial}",
            "-qmp", f"unix:{qmp},server=on,wait=off", "-no-reboot", "-nic", "none"] + (["-S"] if self.paused else []),
            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
        try:
            deadline = time.monotonic() + 15
            while not qmp.exists():
                self.alive(deadline)
                time.sleep(0.02)
            self.socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
            self.socket.settimeout(15)
            self.socket.connect(str(qmp))
            self.stream = self.socket.makefile("rwb")
            json.loads(self.stream.readline())
            self.command("qmp_capabilities")
            return self
        except BaseException:
            self.__exit__(None, None, None)
            raise

    def command(self, execute, arguments=None):
        payload = {"execute": execute}
        if arguments is not None:
            payload["arguments"] = arguments
        self.stream.write(json.dumps(payload).encode() + b"\n")
        self.stream.flush()
        while True:
            raw = self.stream.readline()
            if not raw:
                raise RuntimeError("QMP connection closed")
            response = json.loads(raw)
            if "error" in response:
                raise RuntimeError(response["error"])
            if "return" in response:
                return response["return"]

    def alive(self, deadline):
        if self.process.poll() is not None:
            raise RuntimeError(f"QEMU exited ({self.process.returncode}): {self.process.stderr.read().decode()}")
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

    def __exit__(self, *args):
        if getattr(self, "process", None):
            self.process.terminate()
            try:
                self.process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.process.kill()
                self.process.wait()
            self.process.stderr.close()
        if getattr(self, "stream", None):
            self.stream.close()
            self.socket.close()
        self.temp.cleanup()
