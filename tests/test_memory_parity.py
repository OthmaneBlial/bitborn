import json
import re
import subprocess
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest


class MemoryParityTests(unittest.TestCase):
    def test_identical_literal_program_in_model_and_native_guest(self):
        data,_=read_bits(ROOT/'docs/instruction-encoding/fixtures/memory-mov-program.bits')
        self.assertEqual(len(data),71)
        script="""
import {readFileSync} from 'node:fs';
import {createState,step,flagsWord,logicalIP} from './site/simulator.mjs';
const bytes=Uint8Array.from(JSON.parse(readFileSync(0,'utf8'))),state=createState(bytes);state.SP=0x7C00;
let changed=0;while(!state.halted)changed+=step(bytes,state).memoryChanges.length;
console.log(JSON.stringify({words:Object.fromEntries(['AX','BX','CX','DX','SI','DI','BP','SP','CS','DS','ES','SS'].map(name=>[name,state[name]])),
flags:flagsWord(state),af:state.af,ip:logicalIP(state),changed,ram:Array.from(state.memory.slice(0x10020,0x10022)),other:Array.from(state.memory.slice(0x20020,0x20022)),stored:Array.from(state.memory.slice(0x10030,0x10033))}));
"""
        result=subprocess.run(['node','--input-type=module','-e',script],input=json.dumps(list(data)),text=True,capture_output=True,cwd=ROOT,check=True,timeout=10)
        modeled=json.loads(result.stdout)
        self.assertEqual(modeled['words'],{'AX':0x2233,'BX':0x20,'CX':0x1111,'DX':0x1122,'SI':0x1111,'DI':0x22,'BP':0x22,'SP':0x7C00,'CS':0,'DS':0x1000,'ES':0x2000,'SS':0x2000})
        self.assertIsNone(modeled['af'],'XOR makes AF undefined; MOV preserves that status')
        self.assertEqual(modeled['changed'],7)
        with tempfile.TemporaryDirectory() as directory:
            image=Path(directory)/'shared-memory.img';image.write_bytes(bios_sector(data))
            with Guest(image) as guest:
                guest.wait_for(lambda _: f"EIP={modeled['ip']:08x}" in guest.hmp('info registers') and 'HLT=1' in guest.hmp('info registers'))
                guest.command('stop');registers=guest.hmp('info registers')
                for name,value in modeled['words'].items():
                    if name in ('CS','DS','ES','SS'):
                        actual=int(re.search(rf'{name}\s*=([0-9a-f]+)',registers).group(1),16)
                    else:actual=int(re.search(rf'E{name}=([0-9a-f]+)',registers).group(1),16)&65535
                    self.assertEqual(actual,value,name)
                native_flags=int(re.search(r'EFL=([0-9a-f]+)',registers).group(1),16)
                self.assertEqual(native_flags&0xEC5,modeled['flags']&0xEC5,'compare defined flags; undefined AF has no architectural value to compare')
                for address,key in [(0x10020,'ram'),(0x20020,'other'),(0x10030,'stored')]:
                    self.assertEqual(list(guest.memory(address,len(modeled[key]))),modeled[key])
                self.assertEqual(guest.memory(0x7C00,71),data)
