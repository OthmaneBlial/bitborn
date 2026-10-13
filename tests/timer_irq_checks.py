"""Native IRQ0 frame, guard, PIC and immutable-instruction checks."""
import re
import struct

from tools.bitborn import digest

CODE_RANGES=((0,39),(40,178),(192,242))


def check_source(data,annotations,golden):
    assert len(data)==568
    assert data[77] in (2,3) and data[240] in (0x20,0x21)
    assert data[162:178]==bytes.fromhex('fa391d004000007304fbf4ebf3f4ebfd')
    assert data[239:242] in (bytes.fromhex('e620cf'),bytes.fromhex('e621cf'))
    assert struct.unpack_from('<HI',data,280)==(23,0x7F00)
    assert struct.unpack_from('<HI',data,286)==(263,0x7F30)
    assert data[304:560]==bytes(256)
    assert data[560:568]==bytes.fromhex('c07e0800008e0000')
    decoded=[]
    for line in golden.decode().splitlines():
        if not line.strip():continue
        fields=line.split()
        if fields[0].startswith('-'):
            decoded[-1][1]+=bytes.fromhex(fields[0][1:])
        else:
            decoded.append([int(fields[0],16),bytes.fromhex(fields[1])])
    instructions=[row for row in annotations if row['kind']=='instruction']
    assert [(offset,len(raw)) for offset,raw in decoded]==[(row['offset'],row['size']) for row in instructions]
    assert all(data[offset:offset+len(raw)]==raw for offset,raw in decoded)
    assert not any(row['mnemonic'].startswith('INT ') for row in instructions)


def check_snapshot(snapshot,name,data):
    failed=name=='no-eoi';count=1 if failed else 2 if name=='control' else 3
    assert snapshot['count']==count
    assert snapshot['registers']=={'AX':0x20,'BX':data[77],'CX':0,'DI':0x4100+count*16,'SP':0x9000}
    assert snapshot['segments']=={'CS':8,'DS':0x10,'SS':0x10}
    assert snapshot['haltIP']==(0x7EAD if failed else 0x7EB0)
    assert snapshot['cr0']&1 and not snapshot['cr0']&0x80000000
    assert snapshot['flags']&0x200== (0x200 if failed else 0)
    assert snapshot['flags']&0x400==0
    log=bytes.fromhex(snapshot['logHex']);assert len(log)==48
    frames=[struct.unpack_from('<IIII',log,index*16) for index in range(count)]
    for ip,cs,saved,entry in frames:
        assert ip in (0x7EAD,0x7EA2) and cs==8
        assert saved&0x200 and not entry&0x200
        assert saved&0x400==0 and entry&0x400==0
        # PUSHFD's image omits RF/VM; compare the defined arithmetic, IF and DF bits.
        assert entry&0xED5==saved&(0xED5&~0x200)
    assert log[count*16:]==bytes(48-count*16)
    assert bytes.fromhex(snapshot['guardsHex'])==bytes([0xA5,0x5A])
    assert bytes.fromhex(snapshot['remainingFrameHex'])==log[(count-1)*16:(count-1)*16+12]
    assert bytes.fromhex(snapshot['entryPushHex'])==log[(count-1)*16+12:count*16]
    actual=bytearray.fromhex(snapshot['payloadRamHex'])
    assert snapshot['payloadRamSha256']==digest(actual)
    assert len(actual)==len(data) and actual[277]&1
    for offset in (269,277):actual[offset]&=0xFE
    assert actual==data,'only CPU-managed GDT accessed bits may change'
    assert snapshot['instructionRamSha256']==digest(b''.join(data[start:end] for start,end in CODE_RANGES))
    master=snapshot['pic']['0'];slave=snapshot['pic']['1']
    assert master['irq_base']==0x20 and slave['irq_base']==0x28
    assert slave['imr']==0xFF and slave['isr']==0
    assert master['imr']==(0x20 if failed else 0xFF)
    assert master['isr']==(1 if failed else 0)
    if failed:assert master['irr']&1,'a later timer request is pending behind the uncleared in-service bit'


def check_guest(guest,data,name):
    failed=name=='no-eoi';count=1 if failed else 2 if name=='control' else 3
    ip=0x7EAD if failed else 0x7EB0
    guest.wait_for(lambda _: f'EIP={ip:08x}' in guest.hmp('info registers')
                   and 'HLT=1' in guest.hmp('info registers')
                   and int.from_bytes(guest.memory(0x4000,4),'little')==count)
    if failed:
        guest.wait_for(lambda _: re.search(r'pic0: irr=01 .*isr=01',guest.hmp('info pic')) is not None)
    guest.command('stop');registers=guest.hmp('info registers');pic=guest.hmp('info pic')
    assert re.search(r'CS\s*=0008 .*CS32',registers)
    assert re.search(r'IDT=\s+00007f30 00000107',registers)
    values={key:int(re.search(rf'E{key}=([0-9a-f]+)',registers)[1],16)
            for key in ('AX','BX','CX','DI','SP')}
    segments={key:int(re.search(rf'{key}\s*=([0-9a-f]+)',registers)[1],16) for key in ('CS','DS','SS')}
    controllers={}
    for controller in ('0','1'):
        line=re.search(rf'^pic{controller}: ([^\r\n]+)',pic,re.M)[1]
        controllers[controller]={key:int(re.search(rf'{key}=([0-9a-f]+)',line)[1],16)
                                 for key in ('irr','imr','isr','irq_base')}
    ram=guest.memory(0x7E00,len(data))
    snapshot={'count':int.from_bytes(guest.memory(0x4000,4),'little'),
              'registers':values,'segments':segments,'haltIP':int(re.search(r'EIP=([0-9a-f]+)',registers)[1],16),
              'flags':int(re.search(r'EFL=([0-9a-f]+)',registers)[1],16),
              'cr0':int(re.search(r'CR0=([0-9a-f]+)',registers)[1],16),
              'logHex':guest.memory(0x4100,48).hex(),
              'guardsHex':(guest.memory(0x40FF,1)+guest.memory(0x4130,1)).hex(),
              'remainingFrameHex':guest.memory(0x8FF4,12).hex(),'entryPushHex':guest.memory(0x8FF0,4).hex(),
              'payloadRamHex':ram.hex(),'payloadRamSha256':digest(ram),
              'instructionRamSha256':digest(b''.join(ram[start:end] for start,end in CODE_RANGES)),
              'pic':controllers}
    check_snapshot(snapshot,name,data)
    return snapshot,registers,pic
