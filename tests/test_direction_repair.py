"""Compare both reviewed direction-flag controls in the model and QEMU."""
import json
import re
import subprocess
import tempfile
import unittest
from pathlib import Path

from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest


class DirectionRepairTests(unittest.TestCase):
    def test_seed_and_repair_with_identical_literal_bytes(self):
        loader, _ = read_bits(ROOT / "boot/loader.bits")
        sources = [read_bits(ROOT / f"challenges/direction-flag/{name}.bits")[0]
                   for name in ("start", "solution")]
        self.assertEqual([len(data) for data in sources], [14, 14])
        self.assertEqual([(i, a ^ b) for i, (a, b) in enumerate(zip(*sources)) if a != b], [(7, 1)])
        script = """
import {readFileSync} from 'node:fs';
import {createState,step,logicalIP} from './site/simulator.mjs';
const bytes=Uint8Array.from(JSON.parse(readFileSync(0,'utf8'))),state=createState(bytes,0x7E00);state.SP=0x7C00;
const stores=[];while(!state.halted&&state.steps<16){const instruction=step(bytes,state);if(instruction.operation==='stos')stores.push({di:state.DI,df:state.df,writes:instruction.memoryChanges});}
console.log(JSON.stringify({ax:state.AX,di:state.DI,df:state.df,sp:state.SP,ip:logicalIP(state),steps:state.steps,halted:state.halted,ram:Array.from(state.memory.slice(0x600,0x603)),stores}));
"""
        with tempfile.TemporaryDirectory(prefix="bitborn-direction-repair-") as temporary:
            for name, data, di, addresses in [("start", sources[0], 0x603, [0x601, 0x602]),
                                             ("solution", sources[1], 0x5FF, [0x601, 0x600])]:
                with self.subTest(source=name):
                    result = subprocess.run(["node", "--input-type=module", "-e", script],
                                            input=json.dumps(list(data)), text=True, capture_output=True,
                                            cwd=ROOT, check=True, timeout=10)
                    modeled = json.loads(result.stdout)
                    self.assertTrue(modeled["halted"])
                    self.assertEqual(modeled["steps"], 9)
                    self.assertEqual((modeled["ax"], modeled["di"], modeled["df"], modeled["sp"], modeled["ip"]),
                                     (0x41, di, False, 0x7C00, 0x7E0E))
                    self.assertEqual([store["di"] for store in modeled["stores"]],
                                     [0x602, 0x603] if name == "start" else [0x600, 0x5FF])
                    self.assertEqual([store["df"] for store in modeled["stores"]], [name == "solution"] * 2)
                    self.assertEqual([store["writes"][0]["offset"] for store in modeled["stores"]], addresses)
                    self.assertEqual(modeled["ram"], [0, 0x42, 0x41] if name == "start" else [0x41, 0x42, 0])
                    image = Path(temporary) / f"{name}.img"
                    image.write_bytes(bios_sector(loader) + data + bytes(1024 - len(data)))
                    original = image.read_bytes()
                    with Guest(image) as guest:
                        guest.wait_for(lambda _: "EIP=00007e0e" in guest.hmp("info registers")
                                       and "HLT=1" in guest.hmp("info registers"))
                        guest.command("stop")
                        registers = guest.hmp("info registers")
                        for register, value in [("AX", 0x41), ("DI", di), ("SP", 0x7C00)]:
                            self.assertEqual(int(re.search(rf"E{register}=([0-9a-f]+)", registers)[1], 16) & 0xFFFF, value)
                        self.assertEqual(int(re.search(r"EFL=([0-9a-f]+)", registers)[1], 16) & 0x400, 0)
                        for segment in ("CS", "DS", "ES", "SS"):
                            self.assertEqual(int(re.search(rf"{segment}\s*=([0-9a-f]+)", registers)[1], 16), 0)
                        for address, value in zip(addresses, (0x42, 0x41)):
                            self.assertEqual(guest.memory(address, 1), bytes([value]))
                        self.assertEqual(guest.memory(0x600, 2) == b"AB", name == "solution")
                        self.assertEqual(guest.memory(0x7E00, len(data)), data)
                        self.assertEqual(guest.output(), b"")
                    self.assertEqual(image.read_bytes(), original)
