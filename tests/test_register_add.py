"""Sample literal register ADD encodings in a disposable native QEMU guest."""
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

from tools.bitborn import ROOT, read_bits
from tools.build import bios_sector
from tests.qemu import Guest


class RegisterAddTests(unittest.TestCase):
    def test_native_result_and_six_defined_flags_match_model(self):
        cases=[([0x01,0xD8],{'AX':0xFFFF,'BX':1},'AX',0,0x55),
               ([0x03,0xCA],{'CX':0x7FFF,'DX':1},'CX',0x8000,0x894),
               ([0x01,0xEB],{'BX':0x8000,'BP':0x8000},'BX',0,0x845),
               ([0x03,0xF7],{'SI':15,'DI':1},'SI',16,0x10),
               ([0x01,0xED],{'BP':0x4000},'BP',0x8000,0x884),
               ([0x03,0xE4],{'SP':0x3FFE},'SP',0x7FFC,0x14)]
        data,annotations=read_bits(ROOT/'tests/fixtures/register-add.bits')
        adds=[row for row in annotations if row['mnemonic'].startswith('ADD ')]
        self.assertEqual([list(data[row['offset']:row['offset']+row['size']]) for row in adds],
                         [row[0] for row in cases])
        halt=next(row['offset'] for row in annotations if row['mnemonic']=='HLT')
        with tempfile.TemporaryDirectory(prefix='bitborn-register-add-') as directory:
            packed=bios_sector(data);image=Path(directory)/'probe.img';image.write_bytes(packed)
            with Guest(image) as guest:
                guest.wait_for(lambda _: f'EIP={0x7C00+halt+1:08x}' in guest.hmp('info registers')
                               and 'HLT=1' in guest.hmp('info registers'))
                guest.command('stop');log=guest.memory(0x2200,24)
                for index,(_,_,_,result,flags) in enumerate(cases):
                    offset=index*4
                    self.assertEqual(int.from_bytes(log[offset:offset+2],'little'),result)
                    self.assertEqual(int.from_bytes(log[offset+2:offset+4],'little')&0xED5,flags)
                self.assertEqual(guest.memory(0x7C00,len(data)),data)
            self.assertEqual(image.read_bytes(),packed)
        script="""
import {createState,step,flagsWord} from './site/simulator.mjs';
let input='';for await(const chunk of process.stdin)input+=chunk;
const rows=JSON.parse(input).map(([bytes,registers,destination])=>{
  const state=createState(bytes);Object.assign(state,registers);step(bytes,state);
  return [state[destination],flagsWord(state)&0xED5];
});console.log(JSON.stringify(rows));
"""
        response=subprocess.run(['node','--input-type=module','-e',script],cwd=ROOT,
                                input=json.dumps(cases),text=True,capture_output=True,check=True,timeout=15)
        self.assertEqual(json.loads(response.stdout),[[row[3],row[4]] for row in cases])
