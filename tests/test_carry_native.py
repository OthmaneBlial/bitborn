import json
import re
import subprocess
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest


class CarryNativeTests(unittest.TestCase):
    def test_same_literal_multiword_program_matches_native_and_model(self):
        data,_=read_bits(ROOT/'docs/instruction-encoding/fixtures/carry-borrow.bits')
        self.assertEqual(len(data),81)
        script="""
import {readFileSync} from 'node:fs';
import {createState,step,flagsWord,logicalIP} from './site/simulator.mjs';
const bytes=Uint8Array.from(JSON.parse(readFileSync(0,'utf8'))),state=createState(bytes);
while(!state.halted)step(bytes,state);
console.log(JSON.stringify({words:Object.fromEntries(['AX','BX','CX','DX','SI','DI','BP','SP','CS','SS','DS'].map(name=>[name,state[name]])),ip:logicalIP(state),flags:flagsWord(state),ram:[...state.memory.slice(0x2000,0x2004)]}));
"""
        result=subprocess.run(['node','--input-type=module','-e',script],input=json.dumps(list(data)),text=True,capture_output=True,cwd=ROOT,timeout=10,check=True)
        modeled=json.loads(result.stdout)
        self.assertEqual(modeled['words'],{'AX':0xAB00,'BX':0,'CX':0,'DX':1,'SI':0xFFFF,'DI':0xFFFF,'BP':0xFFFF,'SP':0x7C00,'CS':0,'SS':0,'DS':0})
        self.assertEqual(modeled['ip'],0x7C4F)
        with tempfile.TemporaryDirectory() as directory:
            image=Path(directory)/'carry-borrow.img';image.write_bytes(bios_sector(data))
            with Guest(image) as guest:
                guest.wait_for(lambda _: 'EIP=00007c4f' in guest.hmp('info registers') and 'HLT=1' in guest.hmp('info registers'))
                guest.command('stop');registers=guest.hmp('info registers')
                for name,value in modeled['words'].items():
                    expression=rf'{name}\s*=([0-9a-f]+)' if name in ('CS','SS','DS') else rf'E{name}=([0-9a-f]+)'
                    self.assertEqual(int(re.search(expression,registers).group(1),16)&65535,value,name)
                flags=int(re.search(r'EFL=([0-9a-f]+)',registers).group(1),16)
                self.assertEqual(flags&0xED5,modeled['flags']&0xED5)
                self.assertEqual(list(guest.memory(0x2000,4)),modeled['ram'])
                self.assertEqual(guest.memory(0x7C00,81),data)

    def test_native_flag_samples_match_independent_integer_oracle(self):
        data,annotations=read_bits(ROOT/'tests/fixtures/carry-flags.bits')
        halt=next(item['offset'] for item in annotations if item['mnemonic']=='HLT')
        cases=[(0x7FFF,0,1,16,False),(0xFFFF,0xFFFF,0,16,False),
               (0x8000,0x7FFF,1,16,True),(0,0xFFFF,1,16,True),
               (0xAB7F,0,1,8,False),(0xABFF,0xFF,0,8,False),
               (0xAB80,0x7F,1,8,True),(0xAB00,0xFF,0,8,True)]
        operations=[item for item in annotations if item['mnemonic'].startswith(('ADC ','SBB '))]
        self.assertEqual(len(operations),len(cases))
        with tempfile.TemporaryDirectory() as directory:
            image=Path(directory)/'carry-flags.img';image.write_bytes(bios_sector(data))
            with Guest(image) as guest:
                guest.wait_for(lambda _: f'EIP={0x7C00+halt+1:08x}' in guest.hmp('info registers') and 'HLT=1' in guest.hmp('info registers'))
                guest.command('stop');samples=guest.memory(0x2000,32)
                for index,(ax,right,incoming,width,subtract) in enumerate(cases):
                    mask=(1<<width)-1;left=ax&mask
                    operation=operations[index];encoded=data[operation['offset']:operation['offset']+operation['size']]
                    self.assertEqual(encoded[0],(0x1C if subtract else 0x14)+(width==16))
                    self.assertEqual(int.from_bytes(encoded[1:],'little'),right)
                    full=left-right-incoming if subtract else left+right+incoming
                    value=full&mask;result=(ax&0xFF00)|value if width==8 else value
                    signed=lambda value: value-(1<<width) if value&(1<<(width-1)) else value
                    signed_full=signed(left)-signed(right)-incoming if subtract else signed(left)+signed(right)+incoming
                    half=(left&15)-(right&15)-incoming if subtract else (left&15)+(right&15)+incoming
                    flags=int(full<0 if subtract else full>mask)|((bin(value&255).count('1')%2==0)<<2)|((half<0 if subtract else half>15)<<4)|((value==0)<<6)|((value>>(width-1))<<7)|((not -(1<<(width-1))<=signed_full<(1<<(width-1)))<<11)
                    actual=int.from_bytes(samples[index*4:index*4+2],'little')
                    actual_flags=int.from_bytes(samples[index*4+2:index*4+4],'little')
                    self.assertEqual(actual,result,f'case {index} result')
                    self.assertEqual(actual_flags&0xED5,flags,f'case {index} all arithmetic, IF and DF flags')
                self.assertEqual(guest.memory(0x7C00,len(data)),data)
