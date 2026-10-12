import io
import json
import select
import subprocess
import sys
import time
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

from tests.qemu import Guest


class QemuHarnessTests(unittest.TestCase):
    def test_missing_executable_creates_no_resources(self):
        guest = Guest('missing.img')
        with patch('tests.qemu.shutil.which', return_value=None), patch('tests.qemu.tempfile.TemporaryDirectory') as temporary:
            with self.assertRaisesRegex(RuntimeError, 'required'):
                guest.__enter__()
            temporary.assert_not_called()
        guest.__exit__()

    def test_launch_failure_removes_directory_and_closes_errors(self):
        guest = Guest('missing.img')
        with patch('tests.qemu.shutil.which', return_value='/fake/qemu'), patch('tests.qemu.subprocess.Popen', side_effect=OSError('launch failed')):
            with self.assertRaisesRegex(OSError, 'launch failed'):
                guest.__enter__()
        self.assertFalse(guest.directory.exists())
        self.assertTrue(guest.errors.closed)
        guest.__exit__()

    def test_real_child_stderr_cannot_block_startup_and_is_bounded(self):
        guest = Guest('missing.img')
        processes = []
        launch = subprocess.Popen

        def fail(args, **kwargs):
            # A host Python test double emits diagnostics, never target code.
            process = launch([sys.executable, '-c', "import os; os.write(2,b'X'*200000+b'\\xff'); raise SystemExit(4)"], **kwargs)
            processes.append(process)
            return process

        with patch('tests.qemu.shutil.which', return_value=sys.executable), patch('tests.qemu.subprocess.Popen', side_effect=fail):
            with self.assertRaisesRegex(RuntimeError, r'QEMU exited \(4\)') as caught:
                guest.__enter__()
        self.assertLess(len(str(caught.exception)), 4200)
        self.assertEqual(processes[0].poll(), 4)
        self.assertTrue(guest.errors.closed)
        self.assertFalse(guest.directory.exists())

    def startup(self, chunks, connection_error=None):
        guest = Guest('missing.img')
        process = Mock()
        process.poll.return_value = None
        connection = Mock()
        connection.recv.side_effect = chunks
        if connection_error:
            connection.connect.side_effect = connection_error

        def launch(args, **kwargs):
            qmp = args[args.index('-qmp') + 1].split('unix:', 1)[1].split(',', 1)[0]
            Path(qmp).touch()
            return process

        with patch('tests.qemu.shutil.which', return_value='/fake/qemu'), patch('tests.qemu.subprocess.Popen', side_effect=launch), patch('tests.qemu.socket.socket', return_value=connection):
            with self.assertRaises((OSError, RuntimeError, ValueError)):
                guest.__enter__()
        connection.close.assert_called_once()
        process.terminate.assert_called_once()
        process.wait.assert_called_once_with(timeout=5)
        self.assertTrue(guest.errors.closed)
        self.assertFalse(guest.directory.exists())
        guest.__exit__()
        process.terminate.assert_called_once()

    def test_connect_greeting_and_capabilities_failures_clean_up(self):
        self.startup([], ConnectionRefusedError('refused'))
        self.startup([b'not json\n'])
        self.startup([b'{}\n'])
        self.startup([b'{"QMP":{}}\n', b'{"error":{"desc":"capability failure"}}\n'])
        self.startup([b'{"QMP":{}}\n', b''])

    def test_kill_fallback_has_bounded_wait(self):
        guest = Guest('missing.img')
        guest.process = Mock()
        guest.process.poll.return_value = None
        guest.process.wait.side_effect = [subprocess.TimeoutExpired('qemu', 5), 0]
        guest.stop()
        guest.process.terminate.assert_called_once()
        guest.process.kill.assert_called_once()
        self.assertEqual([call.kwargs for call in guest.process.wait.call_args_list], [{'timeout': 5}, {'timeout': 5}])

    def test_real_term_resistant_child_is_killed_and_reaped(self):
        guest = Guest('missing.img')
        process = subprocess.Popen([sys.executable, '-u', '-c', 'import signal,time; signal.signal(signal.SIGTERM,signal.SIG_IGN); print("ready"); time.sleep(60)'], stdout=subprocess.PIPE)
        try:
            self.assertTrue(select.select([process.stdout], [], [], 5)[0], 'test child did not become ready')
            self.assertEqual(process.stdout.readline(), b'ready\n')
            guest.process = process
            start = time.monotonic()
            guest.stop()
            self.assertIsNotNone(process.poll())
            self.assertLess(time.monotonic() - start, 8)
        finally:
            if process.poll() is None:
                process.kill()
                process.wait(timeout=5)
            process.stdout.close()

    def test_protocol_fragmentation_events_errors_and_bounds(self):
        guest = Guest('missing.img')
        guest.buffer = b''
        guest.socket = Mock()
        guest.socket.recv.side_effect = [b'{"event":"STOP"}\n{"ret', b'urn":{"result":42}}\r\n']
        self.assertEqual(guest.command('query-status'), {'result': 42})
        sent = json.loads(guest.socket.sendall.call_args.args[0])
        self.assertEqual(sent, {'execute': 'query-status'})
        for payload, message in [(b'[]\n', 'object'), (b'x' * 65537, '64 KiB'), (b'', 'connection closed')]:
            guest.buffer = b''
            guest.socket.recv.side_effect = [payload, b'']
            with self.assertRaisesRegex(RuntimeError, message):
                guest.response(time.monotonic() + 1)
        value = 'x' * 65528
        payload = json.dumps({'x': value}, separators=(',', ':')).encode()
        self.assertEqual(len(payload), 65536)
        guest.buffer = b''
        wire = payload + b'\n'
        guest.socket.recv.side_effect = [wire[index:index + 4096] for index in range(0, len(wire), 4096)]
        self.assertEqual(guest.response(time.monotonic() + 1), {'x': value})

    def test_event_flood_cannot_reset_command_deadline(self):
        guest = Guest('missing.img')
        guest.buffer = b'{"event":"STOP"}\n' * 100
        guest.socket = Mock()
        with patch('tests.qemu.time.monotonic', side_effect=[100, 101, 102, 116]):
            with self.assertRaisesRegex(TimeoutError, 'deadline'):
                guest.command('query-status')
        guest.socket.recv.assert_not_called()

    def test_partial_line_cannot_reset_response_deadline(self):
        guest = Guest('missing.img')
        guest.buffer = b''
        guest.socket = Mock()
        guest.socket.recv.side_effect = [b'{', b' ']
        with patch('tests.qemu.time.monotonic', side_effect=[100, 101, 116]):
            with self.assertRaisesRegex(TimeoutError, 'deadline'):
                guest.response(115)
        self.assertEqual(guest.socket.recv.call_count, 2)

    def test_process_exit_non_utf8_and_serial_deadline(self):
        guest = Guest('missing.img')
        guest.process = Mock()
        guest.process.poll.return_value = 2
        guest.process.returncode = 2
        guest.errors = io.BytesIO(b'bad \xff diagnostic')
        with self.assertRaisesRegex(RuntimeError, 'bad .* diagnostic'):
            guest.alive(time.monotonic() + 1)
        guest.process.poll.return_value = None
        guest.serial = Path('/nonexistent-bitborn-test-serial')
        with self.assertRaisesRegex(AssertionError, 'output deadline exceeded'):
            guest.alive(time.monotonic() - 1)
