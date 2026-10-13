"""Shared checks for the two literal, guarded native allocator demonstrations."""
import re

from tools.bitborn import digest


def check_source(data, annotations, disassembly):
    assert len(data)==220
    assert data[195:198]==bytes([0x3D,0,0])
    assert data[202:204]==bytes([0x01,0xD8])
    lines=[line.split() for line in disassembly.decode().splitlines()]
    assert bytes.fromhex(''.join(line[1] for line in lines))==data
    assert [(int(line[0],16),len(line[1])//2) for line in lines]==[(item['offset'],item['size']) for item in annotations]
    assert len(lines)==84


def check_guest(guest, data, name):
    assert name in ('program','control')
    expected=[(0xFFFF,0x2000,1),(0x2000,0x2003,0),
              (0x2003,0x2010 if name=='program' else 0x200F,0),
              (0xFFFF,0x2010,1) if name=='program' else (0x200F,0x2010,0),
              (0xFFFF,0x2010,1)]
    arena=bytearray(16);arena[0]=0x42;arena[3]=0x43
    if name=='control':arena[15]=0x44
    guest.wait_for(lambda _: 'EIP=00007cc1' in guest.hmp('info registers')
                   and 'HLT=1' in guest.hmp('info registers'))
    guest.command('stop');registers=guest.hmp('info registers')
    words={name:int(re.search(rf'E{name}=([0-9a-f]+)',registers)[1],16)&65535
           for name in ('AX','BX','DI','SP')}
    assert words=={'AX':1,'BX':0x2010,'DI':0xFFFF,'SP':0x7C00}
    segments={name:int(re.search(rf'{name}\s*=([0-9a-f]+)',registers)[1],16) for name in ('CS','DS','SS')}
    assert segments=={'CS':0,'DS':0,'SS':0}
    flags=int(re.search(r'EFL=([0-9a-f]+)',registers)[1],16)
    assert flags&0xED5==0
    log=guest.memory(0x2100,30)
    actual=[tuple(int.from_bytes(log[offset+word:offset+word+2],'little') for word in (0,2,4))
            for offset in range(0,30,6)]
    assert actual==expected
    guarded=guest.memory(0x1FFF,18)
    assert guarded==bytes([0xA5])+arena+bytes([0x5A])
    code=guest.memory(0x7C00,len(data));assert code==data
    sizes=[int.from_bytes(data[offset:offset+2],'little') for offset in (43,73,103,133,163)]
    rows=[{'requested':size,'pointer':row[0],'cursor':row[1],'failed':bool(row[2])}
          for size,row in zip(sizes,actual)]
    return {'registers':words,'segments':segments,'flags':flags,'definedFlagsMask':0xED5,
            'haltIP':0x7CC1,'nativeLogHex':log.hex(),'arenaAndGuardsHex':guarded.hex(),
            'sourceRamSha256':digest(code),'requests':rows},registers
