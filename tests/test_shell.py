"""Real BIOS execution of the curated literal shell and its separately loaded app."""
import struct
import tempfile
import unittest
from pathlib import Path

from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest
from tests.test_monitor import command, type_text


class ShellTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix="bitborn-shell-proof-")
        self.addCleanup(self.temporary.cleanup)
        self.loader, _ = read_bits(ROOT / "boot/loader.bits")
        self.shell, _ = read_bits(ROOT / "examples/shell/program.bits")
        self.app, _ = read_bits(ROOT / "examples/shell-app/program.bits")

    def image(self, shell=None, app=None):
        stage = self.shell if shell is None else shell
        payload = self.app if app is None else app
        path = Path(self.temporary.name) / "shell.img"
        path.write_bytes(bios_sector(self.loader) + stage + bytes(1024-len(stage)) + payload + bytes(1024-len(payload)))
        return path

    def ready(self, guest):
        self.assertEqual(guest.wait_for(lambda data: data.endswith(b"> ")), b"bitborn shell\r\n> ")

    def test_commands_actual_memory_and_separate_app_return(self):
        with Guest(self.image()) as guest:
            self.ready(guest)
            self.assertEqual(guest.memory(0x7E00,len(self.shell)),self.shell)
            self.assertEqual(guest.memory(0x0600,16),bytes(16))
            self.assertEqual(command(guest,"help"),b"\r\nhelp about clear reboot dump regs write read run\r\n> ")
            self.assertEqual(command(guest,"about"),b"\r\nRaw bits. BIOS. Separate disk app.\r\n> ")
            self.assertEqual(command(guest,"write 00"),b"\r\nUnknown command\r\n> ")
            self.assertEqual(guest.memory(0x0600,16),bytes(16),'write has no arbitrary operand parser')
            self.assertEqual(command(guest,"read"),b"\r\n0600: 00\r\n> ")
            self.assertEqual(command(guest,"write"),b"\r\nRAM[0600]=2A\r\n> ")
            self.assertEqual(guest.memory(0x0600,16),b"\x2a"+bytes(15))
            self.assertEqual(command(guest,"read"),b"\r\n0600: 2A\r\n> ")
            self.assertEqual(command(guest,"dump"),b"\r\n0600: 2A "+b"00 "*15+b"\r\n> ")
            for _ in range(3):
                self.assertEqual(command(guest,"run"),b"\r\nDISK APP: 7 x 6 = 2A hex; RAM[0601]=2A\r\n> ")
                self.assertEqual(guest.memory(0x9000,1024),self.app+bytes(1024-len(self.app)),'loaded bytes must come from disk sectors 4–5')
                self.assertEqual(guest.memory(0x0600,16),b"\x2a\x2a"+bytes(14))
                command(guest,"regs")
                self.assertEqual(guest.memory(0x0508,2),b"\x00\x7c",'app RET restores SP at the next handler sampling point')
            self.assertEqual(command(guest,"dump"),b"\r\n0600: 2A 2A "+b"00 "*14+b"\r\n> ")
            self.assertEqual(command(guest,"clear"),b"\r\n> ")
            self.assertEqual(guest.memory(0xB8000,8)[::2],b">   ")
            self.assertIn(b"bitborn shell\r\n> ",command(guest,"reboot"))
            self.assertEqual(guest.memory(0x0600,16),bytes(16),'bootstrap reinitializes the bounded experiment window')

    def test_regs_reports_real_sampled_words_and_sampling_point(self):
        with Guest(self.image()) as guest:
            self.ready(guest)
            for expected_bx,expected_dx in [(0x7E00,0x03FB),(0x9000,0x0000)]:
                output = command(guest,"regs")
                sampled = struct.unpack("<13H",guest.memory(0x0500,26))
                header = b"\r\nAX BX CX DX SP BP SI DI CS DS ES SS FL\r\n"
                values = (" ".join(f"{word:04X}" for word in sampled)+" \r\n> ").encode('ascii')
                self.assertEqual(output,header+values,'output must be formatted from real captured RAM, not constants')
                self.assertEqual(sampled[:8],(0x1C01,expected_bx,4,expected_dx,0x7C00,0,0x806D,0x8205))
                self.assertEqual(sampled[8:12],(0,0,0,0))
                self.assertTrue(sampled[12] & 0x0200,'sampled IF is set')
                self.assertFalse(sampled[12] & 0x04C1,'sampled DF, ZF, SF and CF are clear')
                command(guest,"run")

    def test_bounded_input_backspace_and_exact_matching(self):
        with Guest(self.image()) as guest:
            self.ready(guest)
            guest.key("backspace")
            self.assertEqual(command(guest,""),b"\r\nUnknown command\r\n> ")
            guest.key("tab")  # A control byte must not become part of the next line.
            self.assertEqual(command(guest,"help"),b"\r\nhelp about clear reboot dump regs write read run\r\n> ")
            self.assertEqual(command(guest,"helpful"),b"\r\nUnknown command\r\n> ")
            self.assertEqual(command(guest,"help "),b"\r\nUnknown command\r\n> ")
            type_text(guest,"helx")
            before = len(guest.output());guest.key("backspace")
            guest.wait_for(lambda data:len(data)==before+3)
            type_text(guest,"p")
            before = len(guest.output());guest.key("ret")
            self.assertEqual(guest.wait_for(lambda data:len(data)>before and data.endswith(b"> "))[before:],b"\r\nhelp about clear reboot dump regs write read run\r\n> ")
            type_text(guest,"abcdefghijklmno")
            guest.key("p");guest.key("ret")
            guest.wait_for(lambda data:data.endswith(b"Unknown command\r\n> "))
            self.assertEqual(guest.memory(0x8200,16),b"abcdefghijklmno\x00")
            self.assertEqual(command(guest,"read"),b"\r\n0600: 00\r\n> ",'input overflow does not damage subsequent dispatch')

    def test_actual_bios_disk_carry_error_never_calls_failed_buffer(self):
        broken = bytearray(self.shell)
        self.assertEqual(broken[413:416],b"\xb9\x04\x00")
        broken[414] = 0  # Deliberate reviewed fixture: CHS sector zero is invalid.
        with Guest(self.image(shell=broken)) as guest:
            self.ready(guest)
            before = guest.memory(0x9000,1024)
            self.assertEqual(command(guest,"run"),b"\r\nDisk read failed\r\n> ")
            self.assertEqual(guest.memory(0x9000,1024),before)
            self.assertEqual(guest.memory(0x0601,1),b"\x00",'the app computation did not execute')
            self.assertEqual(command(guest,"help"),b"\r\nhelp about clear reboot dump regs write read run\r\n> ")
            command(guest,"regs")
            self.assertEqual(guest.memory(0x0508,2),b"\x00\x7c",'error handling balances SP before the next command')

    def test_handwritten_control_flow_targets_and_layout(self):
        self.assertLessEqual(len(self.shell),1024)
        self.assertLessEqual(len(self.app),1024)
        for source,base in [("examples/shell/program.bits",0x7E00),("examples/shell-app/program.bits",0x9000)]:
            data,annotations=read_bits(ROOT/source)
            starts={a["offset"] for a in annotations if a["kind"]=="instruction"}
            for annotation in annotations:
                offset=annotation["offset"]
                self.assertTrue(annotation['explanation'])
                if annotation["kind"]=="instruction" and data[offset] in {0xE8,0xE9,0xEB,0x72,0x73,0x74,0x75,0x77,0xE2}:
                    size=3 if data[offset] in {0xE8,0xE9} else 2
                    target=offset+size+int.from_bytes(data[offset+1:offset+size],"little",signed=True)
                    if base==0x7E00 and offset==426:
                        self.assertEqual(base+target,0x9000)
                    else:self.assertIn(target,starts,f"{source}:{offset} branches to {target}")
            for annotation in annotations:
                if annotation["kind"]=="instruction" and data[annotation["offset"]]==0xBE:
                    address=int.from_bytes(data[annotation['offset']+1:annotation['offset']+3],'little')
                    self.assertTrue(address in (0x0500,0x0600) or any(base+a['offset']==address and a['kind']=='data' for a in annotations),f"string operand {address:04x}")


if __name__ == "__main__":
    unittest.main()
