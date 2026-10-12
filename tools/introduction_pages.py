"""Render the small, maintained introduction format; not a general Markdown engine."""
import hashlib
import html
import json
import re
from pathlib import Path


def inline(text, source, root):
    parts, offset = [], 0
    for match in re.finditer(r"`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)", text):
        parts.append(html.escape(text[offset:match.start()]))
        code, label, url = match.groups()
        if code is not None:
            parts.append(f'<code dir="ltr">{html.escape(code)}</code>')
        else:
            if not url.startswith("https://"):
                target = (source.parent / url).resolve()
                if not target.is_relative_to(root) or not target.is_file():
                    raise ValueError(f"Introduction link leaves the source tree or is missing: {url}")
                url = "../../reference/" + target.relative_to(root).as_posix()
            parts.append(f'<a href="{html.escape(url, quote=True)}">{html.escape(label)}</a>')
        offset = match.end()
    parts.append(html.escape(text[offset:]))
    return "".join(parts)


def article(text, source, root):
    blocks = []
    for block in text.strip().split("\n\n"):
        if all(line in ('<div dir="rtl" lang="ar">', '<div dir="ltr">', '</div>') for line in block.splitlines()):
            continue  # Direction comes from the page and explicit code attributes.
        if block.startswith("```"):
            match = re.fullmatch(r"```(text|sh)\n(.*?)\n```", block, re.S)
            if not match:
                raise ValueError("Introduction code blocks must use the documented text/sh format.")
            blocks.append(f'<pre dir="ltr"><code>{html.escape(match[2])}</code></pre>')
        elif block.startswith("#"):
            match = re.fullmatch(r"(#{1,2}) (.+)", block)
            if not match:
                raise ValueError("Introduction headings must be a single H1 or H2 line.")
            level = len(match[1])
            blocks.append(f'<h{level}>{inline(match[2], source, root)}</h{level}>')
        else:
            if "<" in block or "```" in block:
                raise ValueError("Unsupported introduction markup.")
            blocks.append(f'<p>{inline(" ".join(block.splitlines()), source, root)}</p>')
    return "\n".join(blocks)


def build_introductions(root):
    root = Path(root).resolve()
    directory = root / "docs/i18n"
    manifest = json.loads((directory / "manifest.json").read_text(encoding="utf-8"))
    revision = hashlib.sha256((directory / manifest["source"]).read_bytes()).hexdigest()
    languages = manifest["languages"]
    base = "https://othmaneblial.github.io/bitborn/intro/"
    for language in languages:
        if language["sourceSha256"] != revision:
            raise ValueError(f'Stale introduction: {language["tag"]}')
        source = directory / language["path"]
        text = source.read_text(encoding="utf-8")
        title = re.search(r"^# (.+)$", text, re.M)[1]
        first_paragraph = next(block for block in text.split("\n\n") if not block.startswith(('#', '[', '<', '```')))
        description = re.sub(r"`([^`]+)`", r"\1", " ".join(first_paragraph.splitlines()))[:240]
        canonical = base + language["tag"] + "/"
        alternates = "\n".join(f'<link rel="alternate" hreflang="{item["tag"]}" href="{base}{item["tag"]}/">' for item in languages)
        links = []
        for item in languages:
            current = ' aria-current="page"' if item["tag"] == language["tag"] else ''
            links.append(f'<a href="../{item["tag"]}/" lang="{item["tag"]}" dir="{item["direction"]}"{current}>{html.escape(item["name"])}</a>')
        links = "\n".join(links)
        page = f'''<!doctype html>
<html lang="{language['tag']}" dir="{language['direction']}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title><meta name="description" content="{html.escape(description, quote=True)}">
<link rel="canonical" href="{canonical}">{alternates}
<link rel="alternate" hreflang="x-default" href="{base}en/">
<meta property="og:type" content="article"><meta property="og:title" content="{html.escape(title, quote=True)}"><meta property="og:description" content="{html.escape(description, quote=True)}"><meta property="og:url" content="{canonical}"><meta property="og:image" content="https://othmaneblial.github.io/bitborn/assets/social-preview.png">
<meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#080a08">
<link rel="icon" type="image/svg+xml" href="../../favicon.svg"><link rel="stylesheet" href="../../styles.css"><link rel="stylesheet" href="../intro.css">
</head>
<body>
<a class="skip-link" href="#main">{html.escape(language['skip'])}</a>
<header class="intro-header"><a class="brand" href="../../" dir="ltr">bitborn ↗</a><nav aria-label="Languages">{links}</nav></header>
<main class="intro-article" id="main" tabindex="-1">{article(text, source, root)}</main>
<footer class="intro-footer"><a href="../../reference/docs/i18n/{language['path']}">{html.escape(language['name'])} · .md</a><a href="https://github.com/OthmaneBlial/bitborn">GitHub ↗</a></footer>
</body>
</html>
'''
        destination = root / "site/intro" / language["tag"] / "index.html"
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(page, encoding="utf-8")
    return len(languages)
