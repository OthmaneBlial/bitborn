"""Independent native paging structure, permission, frame and retry checks."""
import re
import struct

from tools.bitborn import digest

CODE_RANGES=((0,39),(40,166),(176,243))


def check_source(data,annotations,golden):
    assert len(data)==424 and data[123] in (1,3) and data[148] in (0,1)
    assert data[153:166]==bytes.fromhex('c70500b000002a000000f4ebfd')
    assert data[225:243]==bytes.fromhex('800d2c500000020f013d00b0000083c404cf')
    assert struct.unpack_from('<HI',data,280)==(23,0x7D00)
    assert struct.unpack_from('<HI',data,286)==(119,0x7D30)
    assert data[304:416]==bytes(112)
    assert data[416:424]==bytes.fromhex('b07c0800008e0000')
    decoded=[]
    for line in golden.decode().splitlines():
        if not line.strip():continue
        fields=line.split()
        if fields[0].startswith('-'):decoded[-1][1]+=bytes.fromhex(fields[0][1:])
        else:decoded.append([int(fields[0],16),bytes.fromhex(fields[1])])
    instructions=[row for row in annotations if row['kind']=='instruction']
    assert [(offset,len(raw)) for offset,raw in decoded]==[(row['offset'],row['size']) for row in instructions]
    assert all(data[offset:offset+len(raw)]==raw for offset,raw in decoded)


def check_snapshot(snapshot,name,data,directory,table):
    fault=name=='program';wp=name!='wp-off'
    assert snapshot['haltIP']==0x7CA4 and snapshot['cr3']==0x4000
    assert not snapshot['cr4']&0x20,'the inspected structures use legacy non-PAE paging'
    assert snapshot['cr0']&0x80010001==(0x80010001 if wp else 0x80000001)
    assert snapshot['flags']&0x600==0
    assert snapshot['segments']=={'CS':8,'DS':0x10,'ES':0x10,'SS':0x10}
    assert snapshot['registers']['SP']==0x9000 and snapshot['registers']['CX']==0
    assert snapshot['registers']['DI']==0x6000
    log=struct.unpack('<6I',bytes.fromhex(snapshot['logHex']))
    assert log[0]==int(fault) and snapshot['targetHex']=='2a000000'
    if fault:
        assert log[1:5]==(3,0x7C99,0xB000,8)
        assert snapshot['cr2']==0xB000 and log[5]&0x600==0
        assert bytes.fromhex(snapshot['remainingFrameHex'])==struct.pack('<4I',log[1],log[2],log[4],log[5])
        assert snapshot['registers']['AX']==log[5]
    else:
        assert log==(0,0,0,0,0,0)
        assert snapshot['registers']['AX']==snapshot['cr0']
    assert len(directory)==4096 and len(table)==4096
    entries=struct.unpack('<1024I',directory);pages=struct.unpack('<1024I',table)
    assert entries[0]&~0x60==0x5003 and entries[0]&0x20
    assert entries[1:]==(0,)*1023
    for index,value in enumerate(pages):
        permissions=1 if index==11 and name=='wp-off' else 3
        assert value&~0x60==index*4096+permissions,(index,value)
    assert pages[11]&0x60==0x60,'the completed store sets accessed and dirty'
    assert snapshot['directorySha256']==digest(directory) and snapshot['tableSha256']==digest(table)
    ram=bytearray.fromhex(snapshot['payloadRamHex'])
    assert snapshot['payloadRamSha256']==digest(ram) and ram[277]&1
    for offset in (269,277):ram[offset]&=0xFE
    assert ram==data,'only CPU-managed descriptor accessed bits may change in the payload'
    assert snapshot['instructionRamSha256']==digest(b''.join(data[start:end] for start,end in CODE_RANGES))


def check_guest(guest,data,name):
    guest.wait_for(lambda _: 'EIP=00007ca4' in guest.hmp('info registers') and 'HLT=1' in guest.hmp('info registers'))
    guest.command('stop');registers=guest.hmp('info registers')
    assert re.search(r'CS\s*=0008 00000000 ffffffff .*CS32',registers)
    for segment in ('DS','ES','SS'):assert re.search(rf'{segment}\s*=0010 00000000 ffffffff',registers)
    assert re.search(r'IDT=\s+00007d30 00000077',registers)
    values={key:int(re.search(rf'E{key}=([0-9a-f]+)',registers)[1],16) for key in ('AX','CX','DI','SP')}
    segments={key:int(re.search(rf'{key}\s*=([0-9a-f]+)',registers)[1],16) for key in ('CS','DS','ES','SS')}
    ram=guest.memory(0x7C00,len(data));directory=guest.memory(0x4000,4096);table=guest.memory(0x5000,4096)
    snapshot={'registers':values,'segments':segments,'haltIP':int(re.search(r'EIP=([0-9a-f]+)',registers)[1],16),
              'flags':int(re.search(r'EFL=([0-9a-f]+)',registers)[1],16),
              **{key:int(re.search(rf'{key.upper()}=([0-9a-f]+)',registers)[1],16) for key in ('cr0','cr2','cr3','cr4')},
              'logHex':guest.memory(0x6000,24).hex(),'targetHex':guest.memory(0xB000,4).hex(),
              'remainingFrameHex':guest.memory(0x8FF0,16).hex(),
              'directorySha256':digest(directory),'tableSha256':digest(table),
              'payloadRamHex':ram.hex(),'payloadRamSha256':digest(ram),
              'instructionRamSha256':digest(b''.join(ram[start:end] for start,end in CODE_RANGES))}
    check_snapshot(snapshot,name,data,directory,table)
    return snapshot,registers,directory,table
