"""Three literal timer/PIC controls; each runs only in a disposable QEMU guest."""
import json
import tempfile
import unittest
from pathlib import Path

from tools.bitborn import ROOT,read_bits,digest
from tools.build import bios_sector
from tests.qemu import Guest
from tests.timer_irq_checks import check_source,check_snapshot,check_guest


class TimerIRQTests(unittest.TestCase):
    def test_literal_controls_and_capture_provenance(self):
        record=json.loads((ROOT/'assets/timer-irq-recording.json').read_text())
        self.assertEqual([Path(row['source']).stem for row in record['captures']],['program','control','no-eoi'])
        for path,sha in record['sourceSha256'].items():self.assertEqual(digest((ROOT/path).read_bytes()),sha,path)
        original=read_bits(ROOT/'examples/timer-irq/program.bits')[0]
        loader=read_bits(ROOT/'boot/loader.bits')[0]
        for row in record['captures']:
            name=Path(row['source']).stem;data,annotations=read_bits(ROOT/row['source'])
            changed=[offset for offset,(before,after) in enumerate(zip(original,data)) if before!=after]
            self.assertEqual(changed,[] if name=='program' else [77 if name=='control' else 240])
            if changed:self.assertEqual(original[changed[0]]^data[changed[0]],1)
            for asset in row['assets'].values():self.assertEqual(digest((ROOT/asset['file']).read_bytes()),asset['sha256'])
            self.assertEqual((row['payloadSize'],row['payloadSha256']),(568,digest(data)))
            image=bios_sector(loader)+data+bytes(1024-len(data))
            self.assertEqual((row['imageSize'],row['imageSha256']),(1536,digest(image)))
            check_source(data,annotations,(ROOT/row['assets']['disassembly']['file']).read_bytes())
            check_snapshot(row['snapshot'],name,data)

    def run_guest(self,name):
        data,_=read_bits(ROOT/f'examples/timer-irq/{name}.bits')
        loader=read_bits(ROOT/'boot/loader.bits')[0]
        packed=bios_sector(loader)+data+bytes(1024-len(data))
        with tempfile.TemporaryDirectory(prefix='bitborn-timer-test-') as directory:
            image=Path(directory)/'timer.img';image.write_bytes(packed)
            with Guest(image) as guest:check_guest(guest,data,name)
            self.assertEqual(image.read_bytes(),packed)
        self.assertEqual(read_bits(ROOT/f'examples/timer-irq/{name}.bits')[0],data)

    def test_native_counts_frames_iretd_and_masked_completion(self):
        for name in ('program','control'):
            with self.subTest(source=name):self.run_guest(name)

    def test_wrong_eoi_port_blocks_second_irq_with_pending_request(self):
        self.run_guest('no-eoi')
