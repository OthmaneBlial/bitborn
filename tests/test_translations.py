import hashlib
import json
import re
import unittest
from tools.bitborn import ROOT


class TranslationTests(unittest.TestCase):
    def test_source_freshness_and_shared_examples(self):
        directory = ROOT / "docs/i18n"
        manifest = json.loads((directory / "manifest.json").read_text())
        source = (directory / manifest["source"]).read_bytes()
        revision = hashlib.sha256(source).hexdigest()
        languages = manifest["languages"]
        self.assertEqual({item["tag"] for item in languages}, {"en", "zh-CN", "es", "fr", "ja", "pt", "de", "ar"})
        self.assertEqual(len(languages), 8)
        blocks = re.findall(r"```(\w+)\n(.*?)```", source.decode("utf-8"), re.S)
        self.assertEqual(blocks, [("text", "10111000 00101010 00000000\n"), ("sh", "git clone https://github.com/OthmaneBlial/bitborn.git\ncd bitborn\nmake test\nmake run\n")])
        for item in languages:
            with self.subTest(language=item["tag"]):
                self.assertEqual(item["sourceSha256"], revision, "Review the translation against the current English source")
                text = (directory / item["path"]).read_text()
                self.assertEqual(re.findall(r"```(\w+)\n(.*?)```", text, re.S), blocks)
                for target in ("../../../ROADMAP.md", "../../../CHANGELOG.md", "../../../CONTRIBUTING.md", "../../../CODE_OF_CONDUCT.md", "../../../SECURITY.md", "../../../LICENSE"):
                    self.assertIn(f"]({target})", text)
                self.assertEqual(item["direction"], "rtl" if item["tag"] == "ar" else "ltr")

if __name__ == "__main__":
    unittest.main()
