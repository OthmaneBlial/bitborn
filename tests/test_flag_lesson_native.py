"""Only reviewed challenge solutions run in a disposable QEMU guest."""
import json
import re
import subprocess
import tempfile
import unittest
from pathlib import Path

from tools.bitborn import ROOT, digest, read_bits
from tools.build import bios_sector
from tests.qemu import Guest


class FlagLessonNativeTests(unittest.TestCase):
    def test_defined_add_flags_match_native_model_and_expected_masks(self):
        reviewed = {item['source']: item for item in json.loads((ROOT/'challenges/targets.json').read_text())}
        loader, _ = read_bits(ROOT/'boot/loader.bits')
        script = """
import {readFileSync} from 'node:fs';
import {createState,step,flagsWord} from './site/simulator.mjs';
const bytes=Uint8Array.from(JSON.parse(readFileSync(0,'utf8'))),state=createState(bytes,0x7E00);
while(!state.halted)step(bytes,state);
console.log(JSON.stringify({ax:state.AX,flags:flagsWord(state)}));
"""
        for slug, expected_ax, expected_flags in [('signed-overflow',0x8000,0x894),('carry-branch',0,0x55)]:
            with self.subTest(challenge=slug), tempfile.TemporaryDirectory(prefix='bitborn-flag-lesson-') as directory:
                source = f'challenges/{slug}/solution.bits'
                data, _ = read_bits(ROOT/source)
                self.assertEqual(len(data),reviewed[source]['size'])
                self.assertEqual(digest(data),reviewed[source]['sha256'])
                result = subprocess.run(['node','--input-type=module','-e',script],input=json.dumps(list(data)),
                                        text=True,capture_output=True,cwd=ROOT,timeout=10,check=True)
                modeled = json.loads(result.stdout)
                self.assertEqual(modeled['ax'],expected_ax)
                self.assertEqual(modeled['flags']&0x8D5,expected_flags)
                image = Path(directory)/f'{slug}.img'
                original = bios_sector(loader)+data+bytes(1024-len(data))
                image.write_bytes(original)
                with Guest(image) as guest:
                    guest.wait_for(lambda _: f'EIP={0x7E00+len(data):08x}' in guest.hmp('info registers')
                                   and 'HLT=1' in guest.hmp('info registers'))
                    guest.command('stop')
                    registers = guest.hmp('info registers')
                    self.assertEqual(int(re.search(r'EAX=([0-9a-f]+)',registers)[1],16)&65535,expected_ax)
                    flags = int(re.search(r'EFL=([0-9a-f]+)',registers)[1],16)
                    self.assertEqual(flags&0x8D5,expected_flags)
                    self.assertEqual(flags&0x8D5,modeled['flags']&0x8D5)
                    self.assertEqual(guest.memory(0x7E00,len(data)),data)
                self.assertEqual(image.read_bytes(),original)
                self.assertEqual(read_bits(ROOT/source)[0],data)
