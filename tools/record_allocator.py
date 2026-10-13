#!/usr/bin/env python3
"""Capture final QMP state and native-written allocation logs, never invent a trace."""
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT))
from tools.bitborn import read_bits, digest
from tools.build import bios_sector
from tests.qemu import Guest
from tests.bounded_allocator_checks import check_source, check_guest


def main():
    records=[]
    for name in ('program','control'):
        source=f'examples/bounded-allocator/{name}.bits'
        data,annotations=read_bits(ROOT/source)
        disassembly=subprocess.run(['ndisasm','-b','16','-'],input=data,capture_output=True,check=True,timeout=10).stdout
        check_source(data,annotations,disassembly)
        image_bytes=bios_sector(data)
        with tempfile.TemporaryDirectory(prefix='bitborn-allocator-capture-') as directory:
            image=Path(directory)/'allocator.img';image.write_bytes(image_bytes)
            with Guest(image) as guest:
                snapshot,registers=check_guest(guest,data,name)
            assert image.read_bytes()==image_bytes
        register_file=f'assets/bounded-allocator-{name}-registers.txt'
        disassembly_file=f'assets/bounded-allocator-{name}-disassembly.txt'
        (ROOT/register_file).write_text(registers+'\n')
        (ROOT/disassembly_file).write_bytes(disassembly)
        records.append({'source':source,'payloadSize':len(data),'payloadSha256':digest(data),
                        'imageSize':len(image_bytes),'imageSha256':digest(image_bytes),
                        'registerFile':register_file,'registerFileSha256':digest((ROOT/register_file).read_bytes()),
                        'disassemblyFile':disassembly_file,'disassemblyFileSha256':digest(disassembly),
                        'snapshot':snapshot})
    sources=['tools/record_allocator.py','tools/build.py','tests/qemu.py','tests/bounded_allocator_checks.py',
             'examples/bounded-allocator/program.bits','examples/bounded-allocator/control.bits',
             'examples/bounded-allocator/references.json']
    qemu=os.environ.get('QEMU','qemu-system-i386')
    version=subprocess.run([qemu,'--version'],check=True,capture_output=True,text=True,timeout=10).stdout.splitlines()[0]
    metadata={'kind':'Final QMP halt snapshots and native-written allocation logs from two separate boots; not a native instruction trace',
              'qemu':version,'memoryMap':{'arenaStart':0x2000,'arenaEndExclusive':0x2010,'lowerGuard':0x1FFF,
                                       'upperGuard':0x2010,'logStart':0x2100,'logSize':30,'codeStart':0x7C00},
              'changedSourceByte':103,'changedBitMask':1,
              'sourceSha256':{source:digest((ROOT/source).read_bytes()) for source in sources},
              'captures':records,'reproduce':'python3 tools/record_allocator.py'}
    (ROOT/'assets/bounded-allocator-recording.json').write_text(json.dumps(metadata,indent=2)+'\n')
    print('Captured two verified native allocator snapshots, five native-written log entries per boot, raw register/disassembly files and source/artifact hashes.')


if __name__=='__main__':
    main()
