"""Literal native page-fault repair versus independent PTE/WP bit controls."""
import json
import tempfile
import unittest
from pathlib import Path

from tools.bitborn import ROOT,read_bits,digest
from tools.build import bios_sector
from tests.qemu import Guest
from tests.paging_checks import check_source,check_snapshot,check_guest


class PagingTests(unittest.TestCase):
    def test_literal_controls_complete_tables_and_capture_provenance(self):
        record=json.loads((ROOT/'assets/paging-recording.json').read_text())
        self.assertEqual([Path(c['source']).stem for c in record['captures']],['program','writable','wp-off'])
        for path,sha in record['sourceSha256'].items():self.assertEqual(digest((ROOT/path).read_bytes()),sha,path)
        original=read_bits(ROOT/'examples/paging/program.bits')[0]
        for row in record['captures']:
            name=Path(row['source']).stem;data,annotations=read_bits(ROOT/row['source'])
            changed=[i for i,(a,b) in enumerate(zip(original,data)) if a!=b]
            self.assertEqual(changed,[] if name=='program' else [123 if name=='writable' else 148])
            if changed:self.assertEqual(original[changed[0]]^data[changed[0]],2 if name=='writable' else 1)
            for asset in row['assets'].values():self.assertEqual(digest((ROOT/asset['file']).read_bytes()),asset['sha256'])
            self.assertEqual((row['payloadSize'],row['payloadSha256']),(424,digest(data)))
            self.assertEqual((row['imageSize'],row['imageSha256']),(512,digest(bios_sector(data))))
            assets=row['assets']
            check_source(data,annotations,(ROOT/assets['disassembly.txt']['file']).read_bytes())
            check_snapshot(row['snapshot'],name,data,(ROOT/assets['directory.bin']['file']).read_bytes(),
                           (ROOT/assets['table.bin']['file']).read_bytes())

    def run_guest(self,name):
        data,_=read_bits(ROOT/f'examples/paging/{name}.bits');packed=bios_sector(data)
        with tempfile.TemporaryDirectory(prefix='bitborn-paging-test-') as directory:
            image=Path(directory)/'paging.img';image.write_bytes(packed)
            with Guest(image) as guest:check_guest(guest,data,name)
            self.assertEqual(image.read_bytes(),packed)
        self.assertEqual(read_bits(ROOT/f'examples/paging/{name}.bits')[0],data)

    def test_native_fault_frame_permission_repair_and_same_store_retry(self):
        self.run_guest('program')

    def test_native_permission_and_supervisor_wp_controls(self):
        for name in ('writable','wp-off'):
            with self.subTest(source=name):self.run_guest(name)
