import re
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits


class DocsTests(unittest.TestCase):
    def test_local_markdown_links(self):
        paths = [ROOT / name for name in ("README.md", "ROADMAP.md", "CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "SECURITY.md", "CHANGELOG.md")]
        paths += list((ROOT / "docs").rglob("*.md")) + list((ROOT / "examples").rglob("*.md"))
        for path in paths:
            text = re.sub(r"```.*?```", "", path.read_text(), flags=re.S)
            for url in re.findall(r"\]\(([^)]+)\)", text):
                if re.match(r"https?://|mailto:|#", url):
                    continue
                target = path.parent / url.split("#")[0]
                self.assertTrue(target.exists(), f"{path.relative_to(ROOT)} links to missing {url}")

    def test_byte_tables_cover_every_byte(self):
        for directory in (ROOT / "examples").iterdir():
            if not directory.is_dir():
                continue
            source = ROOT / "boot/boot.bits" if directory.name == "boot-sector" else directory / "program.bits"
            data, _ = read_bits(source)
            rows = [line for line in (directory / "bytes.md").read_text().splitlines() if re.match(r"\| \d+ \|", line)]
            self.assertEqual(len(rows), len(data), str(directory))
            for offset, line in enumerate(rows):
                self.assertIn(f"| {offset} | `{data[offset]:08b}` | `{data[offset]:02X}`", line)
