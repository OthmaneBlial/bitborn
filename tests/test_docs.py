import re
import unittest
from pathlib import Path
from tools.bitborn import ROOT, read_bits


class DocsTests(unittest.TestCase):
    def test_native_setup_commands_cover_ci_dependencies(self):
        workflow = (ROOT / ".github/workflows/test.yml").read_text()
        install = re.search(r"apt-get install ([^\n]+)", workflow).group(1).split()
        packages = set(install) - {"-y"}
        self.assertTrue({"qemu-system-x86", "nasm", "ffmpeg"} <= packages)
        paths = [ROOT / name for name in (
            "README.md", "CONTRIBUTING.md", "docs/tutorials/from-bits-to-boot.md",
        )] + list((ROOT / "docs/i18n").glob("*/README.md"))
        for path in paths:
            with self.subTest(document=str(path.relative_to(ROOT))):
                text = path.read_text()
                ubuntu = re.findall(r"`sudo apt-get install ([^`]+)`", text)
                macos = re.findall(r"`brew install ([^`]+)`", text)
                self.assertTrue(any(packages <= set(command.split()) for command in ubuntu),
                                "Ubuntu quickstart must install the native CI tools")
                brew_packages = (packages - {"qemu-system-x86"}) | {"qemu"}
                self.assertTrue(any(brew_packages <= set(command.split()) for command in macos),
                                "macOS quickstart must install the native CI tools")

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
