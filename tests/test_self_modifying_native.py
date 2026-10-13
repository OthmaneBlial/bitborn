import json
import re
import subprocess
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest


class SelfModifyingNativeTests(unittest.TestCase):
    def test_one_writer_bit_changes_native_code_output_and_vga(self):
        programs={name:read_bits(ROOT/f'examples/self-modifying/{name}.bits')[0] for name in ('program','control')}
        self.assertEqual([index for index,(a,b) in enumerate(zip(programs['program'],programs['control'])) if a!=b],[52])
        self.assertEqual(programs['program'][52]^programs['control'][52],0x20)
        for name,data in programs.items():
            with self.subTest(name=name),tempfile.TemporaryDirectory() as directory:
                self.assertEqual(len(data),82);self.assertEqual(data[61],0x41)
                script="""
import {readFileSync} from 'node:fs';
import {createState,step,flagsWord,logicalIP} from './site/simulator.mjs';
const bytes=Uint8Array.from(JSON.parse(readFileSync(0,'utf8'))),state=createState(bytes);
while(!state.halted)step(bytes,state);
console.log(JSON.stringify({words:Object.fromEntries(['AX','BX','CX','DX','SI','DI','BP','SP','CS','SS','DS','ES'].map(name=>[name,state[name]])),ip:logicalIP(state),flags:flagsWord(state),af:state.af,serial:state.serial,vga:[...state.memory.slice(0xB8000,0xB8002)],code:[...state.memory.slice(0x7C00,0x7C52)]}));
"""
                result=subprocess.run(['node','--input-type=module','-e',script],input=json.dumps(list(data)),text=True,capture_output=True,cwd=ROOT,timeout=10,check=True)
                modeled=json.loads(result.stdout);character=0x61 if name=='program' else 0x41
                self.assertEqual(modeled['serial'],chr(character));self.assertEqual(modeled['vga'],[character,0x0F])
                self.assertIsNone(modeled['af'])
                image=Path(directory)/'self-modifying.img';packed=bios_sector(data);image.write_bytes(packed)
                with Guest(image) as guest:
                    guest.wait_for(lambda output: output==bytes([character]) and 'EIP=00007c50' in guest.hmp('info registers') and 'HLT=1' in guest.hmp('info registers'))
                    guest.command('stop');registers=guest.hmp('info registers')
                    for register,value in modeled['words'].items():
                        expression=rf'{register}\s*=([0-9a-f]+)' if register in ('CS','SS','DS','ES') else rf'E{register}=([0-9a-f]+)'
                        self.assertEqual(int(re.search(expression,registers).group(1),16)&65535,value,register)
                    flags=int(re.search(r'EFL=([0-9a-f]+)',registers).group(1),16)
                    self.assertEqual(flags&0xEC5,modeled['flags']&0xEC5,'undefined AF is not assumed to have a native value')
                    self.assertEqual(list(guest.memory(0xB8000,2)),modeled['vga'])
                    code=guest.memory(0x7C00,82);self.assertEqual(list(code),modeled['code'])
                    changes=[index for index,(before,after) in enumerate(zip(data,code)) if before!=after]
                    self.assertEqual(changes,[61] if name=='program' else [])
                    if changes:self.assertEqual(data[61]^code[61],0x20)
                self.assertEqual(image.read_bytes(),packed,'the read-only disk image is unchanged')
                self.assertEqual(read_bits(ROOT/f'examples/self-modifying/{name}.bits')[0],data)
