import json
import re
import subprocess
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest


class SignedBranchTests(unittest.TestCase):
    def test_same_literal_overflow_program_matches_native_and_model(self):
        data,annotations=read_bits(ROOT/'docs/instruction-encoding/fixtures/signed-branches.bits')
        self.assertEqual(len(data),95)
        self.assertEqual(next(item['offset'] for item in annotations if item['mnemonic']=='HLT'),92)
        script="""
import {readFileSync} from 'node:fs';
import {createState,step,flagsWord,logicalIP} from './site/simulator.mjs';
const bytes=Uint8Array.from(JSON.parse(readFileSync(0,'utf8'))),state=createState(bytes);
while(!state.halted)step(bytes,state);
console.log(JSON.stringify({words:Object.fromEntries(['AX','BX','CX','DX','SI','DI','BP','SP','CS','SS','DS'].map(name=>[name,state[name]])),ip:logicalIP(state),flags:flagsWord(state)}));
"""
        result=subprocess.run(['node','--input-type=module','-e',script],input=json.dumps(list(data)),text=True,capture_output=True,cwd=ROOT,timeout=10,check=True)
        modeled=json.loads(result.stdout)
        self.assertEqual(modeled['words'],{'AX':0x1234,'BX':0,'CX':0x1111,'DX':0x2222,'SI':0x3333,'DI':0x4444,'BP':0x5555,'SP':0x7C00,'CS':0,'SS':0,'DS':0})
        self.assertEqual(modeled['ip'],0x7C5D)
        with tempfile.TemporaryDirectory() as directory:
            image=Path(directory)/'signed-branches.img';image.write_bytes(bios_sector(data))
            with Guest(image) as guest:
                guest.wait_for(lambda _: 'EIP=00007c5d' in guest.hmp('info registers') and 'HLT=1' in guest.hmp('info registers'))
                guest.command('stop');registers=guest.hmp('info registers')
                for name,value in modeled['words'].items():
                    expression=rf'{name}\s*=([0-9a-f]+)' if name in ('CS','SS','DS') else rf'E{name}=([0-9a-f]+)'
                    actual=int(re.search(expression,registers).group(1),16)&65535
                    self.assertEqual(actual,value,name)
                flags=int(re.search(r'EFL=([0-9a-f]+)',registers).group(1),16)
                self.assertEqual(flags&0x8D5,modeled['flags']&0x8D5,'all CMP-defined arithmetic flags agree; untouched native DF is not assumed')
                self.assertEqual(flags&0x200,0)
                self.assertEqual(guest.memory(0x7C00,95),data)
