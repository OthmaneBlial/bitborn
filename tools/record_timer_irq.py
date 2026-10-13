#!/usr/bin/env python3
"""Capture actual halt/wait snapshots and native-written IRQ frames in QEMU."""
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
from tests.timer_irq_checks import CODE_RANGES,check_source,check_guest


def main():
    loader=read_bits(ROOT/'boot/loader.bits')[0];captures=[]
    for name in ('program','control','no-eoi'):
        source=f'examples/timer-irq/{name}.bits';data,annotations=read_bits(ROOT/source)
        golden=b''.join(subprocess.run(['ndisasm','-b','16' if start==0 else '32','-o',str(start),'-'],
                                     input=data[start:end],capture_output=True,check=True,timeout=10).stdout
                        for start,end in CODE_RANGES)
        check_source(data,annotations,golden)
        image_bytes=bios_sector(loader)+data+bytes(1024-len(data))
        with tempfile.TemporaryDirectory(prefix='bitborn-timer-capture-') as directory:
            image=Path(directory)/'timer.img';image.write_bytes(image_bytes)
            with Guest(image) as guest:
                snapshot,registers,pic=check_guest(guest,data,name)
            assert image.read_bytes()==image_bytes
        assets={}
        for label,value in [('registers',registers),('pic',pic)]:
            path=f'assets/timer-irq-{name}-{label}.txt'
            (ROOT/path).write_text('\n'.join(line.rstrip() for line in value.strip().splitlines())+'\n')
            assets[label]={'file':path,'sha256':digest((ROOT/path).read_bytes())}
        path=f'assets/timer-irq-{name}-disassembly.txt';(ROOT/path).write_bytes(golden)
        assets['disassembly']={'file':path,'sha256':digest(golden)}
        captures.append({'source':source,'payloadSize':len(data),'payloadSha256':digest(data),
                         'imageSize':len(image_bytes),'imageSha256':digest(image_bytes),
                         'assets':assets,'snapshot':snapshot})
    sources=['tools/record_timer_irq.py','tools/build.py','tests/qemu.py','tests/timer_irq_checks.py',
             'boot/loader.bits']+[capture['source'] for capture in captures]
    qemu=os.environ.get('QEMU','qemu-system-i386')
    version=subprocess.run([qemu,'--version'],check=True,capture_output=True,text=True,timeout=10).stdout.splitlines()[0]
    record={'kind':'Actual final QMP snapshots and native-written IRQ frame logs from three independent QEMU boots; not an instruction trace or timing benchmark',
            'qemu':version,'textFormat':'Native HMP output with LF line endings and trailing whitespace removed',
            'goldenFormat':'Independent NDISASM instruction-only blocks: real-mode header then 32-bit kernel and handler; offsets relative to payload',
            'memoryMap':{'loadAddress':0x7E00,'count':0x4000,'logStart':0x4100,'logSize':48,
                         'lowerGuard':0x40FF,'upperGuard':0x4130,'stackTop':0x9000,
                         'gdtr':0x7F18,'idtr':0x7F1E,'idtBase':0x7F30,'irqVector':0x20},
            'controls':{'control':{'changedByte':77,'mask':1,'effect':'Three accepted entries become two'},
                        'no-eoi':{'changedByte':240,'mask':1,'effect':'Wrong EOI port leaves one entry and a later pending IRQ behind IRQ0 in service'}},
            'sourceSha256':{source:digest((ROOT/source).read_bytes()) for source in sources},
            'captures':captures,'reproduce':'python3 tools/record_timer_irq.py'}
    (ROOT/'assets/timer-irq-recording.json').write_text(json.dumps(record,indent=2)+'\n')
    print('Captured three verified native timer snapshots: counts 3/2, wrong-EOI wait at 1, actual frames/guards/PIC state, source/image hashes and mixed-mode disassembly goldens.')


if __name__=='__main__':main()
