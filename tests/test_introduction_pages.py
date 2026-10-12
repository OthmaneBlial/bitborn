import unittest
from tools.bitborn import ROOT
from tools.introduction_pages import article, inline


class IntroductionPageTests(unittest.TestCase):
    def test_literal_code_and_links_are_safe(self):
        source = ROOT / "docs/i18n/en/README.md"
        self.assertEqual(inline('`<script>` & [Roadmap](../../../ROADMAP.md)', source, ROOT),
                         '<code dir="ltr">&lt;script&gt;</code> &amp; <a href="../../reference/ROADMAP.md">Roadmap</a>')
        text = '# Intro\n\n```text\n<script>\n```\n\n[Quoted](https://example.com/?q="value")'
        result = article(text, source, ROOT)
        self.assertIn('<pre dir="ltr"><code>&lt;script&gt;</code></pre>', result)
        self.assertIn('q=&quot;value&quot;', result)
        self.assertNotIn('<script>', result)

    def test_unsupported_markup_and_links_fail(self):
        source = ROOT / "docs/i18n/en/README.md"
        for url in ('../../../missing.md', '/etc/passwd', 'javascript:alert'):
            with self.subTest(url=url):
                with self.assertRaises(ValueError):
                    inline(f'[Link]({url})', source, ROOT)
        for text in ('<script>alert(1)</script>', '```js\nalert(1)\n```', '### Unsupported'):
            with self.subTest(text=text):
                with self.assertRaises(ValueError):
                    article(text, source, ROOT)
