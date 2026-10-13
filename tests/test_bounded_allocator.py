"""A guarded native arena and one literal request bit; no arbitrary host execution."""
import json
import tempfile
import unittest
from pathlib import Path

from tools.bitborn import ROOT, read_bits, digest
from tools.build import bios_sector
from tools.address_references import read_reference_map, inspect_references
from tests.qemu import Guest
from tests.bounded_allocator_checks import check_source, check_guest


class BoundedAllocatorTests(unittest.TestCase):
    def test_capture_provenance_matches_current_sources_and_goldens(self):
        record=json.loads((ROOT/'assets/bounded-allocator-recording.json').read_text())
        self.assertEqual((record['changedSourceByte'],record['changedBitMask']),(103,1))
        for source,sha in record['sourceSha256'].items():
            self.assertEqual(digest((ROOT/source).read_bytes()),sha,source)
        self.assertEqual([row['source'] for row in record['captures']],
                         [f'examples/bounded-allocator/{name}.bits' for name in ('program','control')])
        for row in record['captures']:
            data,annotations=read_bits(ROOT/row['source'])
            self.assertEqual((row['payloadSize'],row['payloadSha256']),(len(data),digest(data)))
            self.assertEqual((row['imageSize'],row['imageSha256']),(512,digest(bios_sector(data))))
            self.assertEqual(row['snapshot']['sourceRamSha256'],digest(data))
            for field in ('registerFile','disassemblyFile'):
                self.assertEqual(digest((ROOT/row[field]).read_bytes()),row[field+'Sha256'])
            check_source(data,annotations,(ROOT/row['disassemblyFile']).read_bytes())

    def test_one_request_bit_changes_the_final_byte_ownership(self):
        programs = {name: read_bits(ROOT/f'examples/bounded-allocator/{name}.bits')[0]
                    for name in ('program','control')}
        self.assertEqual(len(programs['program']),220)
        self.assertEqual(len(programs['control']),220)
        changed = [index for index,(a,b) in enumerate(zip(programs['program'],programs['control'])) if a!=b]
        self.assertEqual(changed,[103])
        self.assertEqual(programs['program'][103]^programs['control'][103],1)
        mapping=read_reference_map(ROOT/'examples/bounded-allocator/references.json')
        for data in programs.values():
            self.assertTrue(inspect_references(data,mapping).startswith('Address references verified: 11 declared fields;'))
        for name,data in programs.items():
            with self.subTest(source=name), tempfile.TemporaryDirectory(prefix='bitborn-allocator-') as directory:
                _,annotations=read_bits(ROOT/f'examples/bounded-allocator/{name}.bits')
                check_source(data,annotations,(ROOT/f'assets/bounded-allocator-{name}-disassembly.txt').read_bytes())
                packed = bios_sector(data);image=Path(directory)/'allocator.img';image.write_bytes(packed)
                with Guest(image) as guest:
                    snapshot,_=check_guest(guest,data,name)
                captured=json.loads((ROOT/'assets/bounded-allocator-recording.json').read_text())['captures'][0 if name=='program' else 1]['snapshot']
                for field in ('registers','segments','haltIP','nativeLogHex','arenaAndGuardsHex','sourceRamSha256','requests'):
                    self.assertEqual(snapshot[field],captured[field],field)
                self.assertEqual(snapshot['flags']&snapshot['definedFlagsMask'],captured['flags']&captured['definedFlagsMask'])
                self.assertEqual(image.read_bytes(),packed)
                self.assertEqual(read_bits(ROOT/f'examples/bounded-allocator/{name}.bits')[0],data)
