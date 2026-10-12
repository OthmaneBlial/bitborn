import json
import random
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path
from tools.bitborn import ROOT, SourceError, read_bits


def corpus():
    rng=random.Random(0xB17B0A)
    whitespace=[chr(code) for code in range(0x3001) if chr(code).isspace()]
    lines=['\n','\r','\r\n','\v','\f','\x1c','\x1d','\x1e','\x85','\u2028','\u2029']
    result=[('\ufeff10111000 00101010 00000000',[184,42,0]),
            ('10111000 # comment\x8500101010',[184,42]),
            ('10111000 # comment\r00101010',[184,42])]
    for case in range(500):
        values=[rng.randrange(256) for _ in range(rng.randrange(1,65))]
        pieces=['\ufeff' if case%3==0 else '']
        for value in values:
            pieces.append(format(value,'08b'))
            pieces.append(rng.choice(whitespace))
            if rng.randrange(5)==0:pieces.extend([' # 中文 / العربية / emoji 🧪 | ignored 11111111',rng.choice(lines)])
        result.append((''.join(pieces),values))
    for separator in whitespace:result.append((f'00000000{separator}11111111',[0,255]))
    for separator in lines:result.append((f'00000000 # ignored{separator}11111111',[0,255]))
    invalid=['0xB8','MOV','42','0000000','000000000','0000000X','００００００００','0000\u200b0000','\ufeff00000000','00000000\ufeff']
    for source,_ in result[:100]:
        result.append((source+'\n'+rng.choice(invalid),None))
    for separator in lines:result.append((f'00000000{separator}# comment{separator}bad',None))
    result.extend([('',None),('# only comments',None),(' \t\n',None),('\ufeff\ufeff00000000',None)])
    return result


class ParserPropertyTests(unittest.TestCase):
    def host_results(self,cases):
        results=[]
        with tempfile.TemporaryDirectory(prefix='bitborn-parser-') as directory:
            source=Path(directory)/'input.bits'
            for text,expected in cases:
                source.write_text(text,encoding='utf-8')
                try:
                    data,_=read_bits(source)
                    self.assertEqual(list(data),expected,repr(text[:80]))
                    results.append({'bytes':list(data)})
                except SourceError as error:
                    self.assertIsNone(expected,repr(text[:80]))
                    results.append({'error':True,'code':error.code,'line':error.line,'tokenIndex':error.token_index})
        return results

    def test_seeded_literal_round_trips_and_rejections(self):
        cases=corpus();self.assertGreater(len(cases),650)
        self.host_results(cases)

    @unittest.skipUnless(shutil.which('node'),'browser parser parity needs Node; required by make site-test/CI')
    def test_browser_and_host_have_identical_bytes_and_diagnostics(self):
        cases=corpus();host=self.host_results(cases)
        process=subprocess.run(['node',str(ROOT/'tests/parser_results.mjs')],input=json.dumps([source for source,_ in cases],ensure_ascii=False),text=True,capture_output=True,timeout=15,cwd=ROOT)
        self.assertEqual(process.returncode,0,process.stderr)
        self.assertEqual(json.loads(process.stdout),host)
