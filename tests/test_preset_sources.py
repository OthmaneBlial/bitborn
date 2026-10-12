import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT


class PresetSourceTests(unittest.TestCase):
    paths=[f'docs/cpu-lab/{name}.bits' for name in ('immediates','flags','stack','branch','memory')]+['docs/instruction-encoding/fixtures/memory-mov-program.bits']

    def populate(self, root):
        for relative in self.paths:
            path=root/relative;path.parent.mkdir(parents=True,exist_ok=True)
            path.write_bytes((ROOT/relative).read_bytes())

    def sources(self, root):
        script='import json,sys;sys.path.insert(0,sys.argv[1]);from site_build import preset_sources;print(json.dumps(preset_sources(sys.argv[2])))'
        return subprocess.run([sys.executable,'-c',script,str(ROOT/'tools'),str(root)],capture_output=True,text=True,timeout=5)

    def test_exact_source_text_and_unicode_limit(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);self.populate(root)
            result=self.sources(root);self.assertEqual(result.returncode,0,result.stderr)
            sources=json.loads(result.stdout);self.assertEqual(len(sources),6)
            for entry in sources.values():
                self.assertEqual(entry['source'],(root/entry['sourcePath']).read_bytes().decode('utf-8'))
            source=root/self.paths[0]
            # Supplementary characters consume two JS code units, not one.
            text='00000000 #'+('🧪'*32762)
            source.write_text(text,encoding='utf-8')
            result=self.sources(root);self.assertEqual(result.returncode,0,result.stderr)
            self.assertEqual(json.loads(result.stdout)['immediates']['source'],text)

    def test_rejects_bad_grammar_bytes_and_text_bounds(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);self.populate(root);source=root/self.paths[0]
            for text,message in [('MOV AX,42','eight binary digits'),('00000000 '*513,'browser input limits'),
                                 ('00000000 #'+('🧪'*32764),'browser input limits'),
                                 ('#'+('x'*262145)+'\n00000000','browser input limits')]:
                source.write_text(text,encoding='utf-8');result=self.sources(root)
                self.assertNotEqual(result.returncode,0);self.assertIn(message,result.stderr)

    def test_published_text_and_validation_use_one_snapshot(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);self.populate(root);source=root/self.paths[0]
            original=source.read_text()
            script='''
import json,sys
from pathlib import Path
sys.path.insert(0,sys.argv[1])
import site_build
original=site_build._parse_bits
def change_file(text,path):
    if Path(path).name=='immediates.bits':Path(path).write_text('not the captured source')
    return original(text,path)
site_build._parse_bits=change_file
print(json.dumps(site_build.preset_sources(sys.argv[2])))
'''
            result=subprocess.run([sys.executable,'-c',script,str(ROOT/'tools'),str(root)],capture_output=True,text=True,timeout=5)
            self.assertEqual(result.returncode,0,result.stderr)
            self.assertEqual(json.loads(result.stdout)['immediates']['source'],original)
            self.assertEqual(source.read_text(),'not the captured source')

    def test_rejects_missing_fifo_and_external_alias_sources(self):
        with tempfile.TemporaryDirectory() as directory,tempfile.TemporaryDirectory() as outside:
            root=Path(directory);self.populate(root);source=root/self.paths[0];source.unlink()
            result=self.sources(root);self.assertNotEqual(result.returncode,0);self.assertIn('regular file inside',result.stderr)
            os.mkfifo(source)
            result=self.sources(root);self.assertNotEqual(result.returncode,0);self.assertIn('regular file inside',result.stderr)
            source.unlink();external=Path(outside)/'external.bits';external.write_text('00000000')
            source.symlink_to(external)
            result=self.sources(root);self.assertNotEqual(result.returncode,0);self.assertIn('regular file inside',result.stderr)
