#!/usr/bin/env python3
"""Capture native paging structures and fault frames without inventing a trace."""
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT))
from tools.bitborn import read_bits,digest
from tools.build import bios_sector
from tests.qemu import Guest
from tests.paging_checks import CODE_RANGES,check_source,check_guest


def main():
    captures=[]
    for name in ('program','writable','wp-off'):
        source=f'examples/paging/{name}.bits';data,annotations=read_bits(ROOT/source)
        golden=b''.join(subprocess.run(['ndisasm','-b','16' if start==0 else '32','-o',str(start),'-'],
                                     input=data[start:end],capture_output=True,check=True,timeout=10).stdout
                        for start,end in CODE_RANGES)
        check_source(data,annotations,golden);image_bytes=bios_sector(data)
        with tempfile.TemporaryDirectory(prefix='bitborn-paging-capture-') as directory:
            image=Path(directory)/'paging.img';image.write_bytes(image_bytes)
            with Guest(image) as guest:snapshot,registers,pd,pt=check_guest(guest,data,name)
            assert image.read_bytes()==image_bytes
        assets={}
        text='\n'.join(line.rstrip() for line in registers.strip().splitlines())+'\n'
        for label,value in [('registers.txt',text.encode()),('disassembly.txt',golden),('directory.bin',pd),('table.bin',pt)]:
            path=f'assets/paging-{name}-{label}';(ROOT/path).write_bytes(value)
            assets[label]={'file':path,'sha256':digest(value)}
        captures.append({'source':source,'payloadSize':len(data),'payloadSha256':digest(data),
                         'imageSize':512,'imageSha256':digest(image_bytes),'snapshot':snapshot,'assets':assets})
    sources=['tools/record_paging.py','tools/build.py','tests/qemu.py','tests/paging_checks.py']+[c['source'] for c in captures]
    version=subprocess.run([os.environ.get('QEMU','qemu-system-i386'),'--version'],check=True,capture_output=True,text=True,timeout=10).stdout.splitlines()[0]
    record={'kind':'Actual final QMP snapshots, native-written page-fault logs and both complete paging structures from three independent QEMU boots; not an instruction trace or memory-isolation claim',
            'qemu':version,'textFormat':'Native HMP register output with LF endings and trailing whitespace removed',
            'goldenFormat':'Independent instruction-only NDISASM blocks, 16-bit header then 32-bit kernel/handler; source-relative offsets',
            'memoryMap':{'loadAddress':0x7C00,'directory':0x4000,'table':0x5000,'faultLog':0x6000,'logSize':24,
                         'targetLinearAndPhysical':0xB000,'stackTop':0x9000,'identityMapEndExclusive':0x400000},
            'controls':{'writable':{'changedByte':123,'mask':2,'effect':'PTE RW allows the store with WP enabled'},
                        'wp-off':{'changedByte':148,'mask':1,'effect':'Supervisor store ignores a read-only PTE when CR0.WP is zero'}},
            'sourceSha256':{source:digest((ROOT/source).read_bytes()) for source in sources},
            'captures':captures,'reproduce':'python3 tools/record_paging.py'}
    (ROOT/'assets/paging-recording.json').write_text(json.dumps(record,indent=2)+'\n')
    print('Captured three native paging boots: one repaired #PF and exact retry, two one-bit no-fault controls, complete 1024-entry directory/table dumps, retained frame, code/image hashes and independent goldens.')


if __name__=='__main__':main()
