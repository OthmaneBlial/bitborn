# Print the lessons

Use your browser's Print command on the [field manual](https://othmaneblial.github.io/bitborn/docs.html),
[learning path](https://othmaneblial.github.io/bitborn/learn/) or any of the
[eight introductions](https://othmaneblial.github.io/bitborn/intro/en/).
The print layout uses A4 pages with 16 mm margins, white paper, dark text and
readable code. Browser paper-size, scaling and header/footer settings remain
under your control.

Navigation, copy controls and language switches are omitted on paper. Headings
stay with following content; code wraps instead of clipping inside a scrollbox.
Literal tokens are unchanged. Arabic paragraphs remain right-to-left while
code and attribution URLs remain left-to-right. The final attribution includes
the canonical page and its actual GitHub source path.

The stylesheet is loaded with `media="print"`; screen layout and interaction
remain the normal teaching experience. Print-friendly pages are the manual,
learning path and introductions, rather than the interactive CPU/builder tools.

## Verify the output

```sh
make site-test
node tests/browser_print.mjs
npm run test:cross-browser
```

Chromium checks all ten pages and writes four actual A4 PDF QA captures under
ignored `build/print-evidence/`: the manual, learning path, English and Arabic.
Firefox/WebKit use the same print-media assertions; they do not produce those
Chromium PDFs. Checks cover white root/body backgrounds, light color scheme,
hidden navigation, visible source attribution, unchanged literal text, width
bounds and code direction/overflow.

For visual inspection with Poppler:

```sh
pdfinfo build/print-evidence/manual.pdf
pdftoppm -r 100 -png build/print-evidence/manual.pdf build/print-evidence/manual
pdftotext -layout build/print-evidence/manual.pdf -
```

PDF captures are generated from the actual pages, not retyped lessons. Inspect
rendered pages as well as text extraction: a white body alone did not catch the
dark page margins caused by an inherited dark color scheme during development.
Physical printers and native-speaker review remain separate checks.
