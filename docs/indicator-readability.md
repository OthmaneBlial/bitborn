# Read CPU changes at narrow widths

The CPU Lab uses two register columns at widths up to 1,050px. Its previous
four-column tablet layout let 16-bit rows extend beyond their register cells at
768px, even though the overall page did not overflow. Bit rows and flag labels
now keep a 9px minimum. This is the project's readability floor, rather than a
WCAG minimum font-size requirement.

Changed register bits, flag values, stack bytes and memory bytes retain underlines
alongside color. Register/flag/stack/memory accessible labels describe values and
changes; undefined AF remains `?` visually and `undefined` in its label. A
timeline seek can mark a code byte as both changed and part of the current
instruction, so that combined state is checked too.

## Computed contrast and geometry checks

```sh
node tests/test_contrast.mjs
node tests/browser_cpu_lab.mjs
npm run test:cross-browser
```

The checks cover 1440, 768, 390 and 320px widths with initial values, changed
registers, carry/zero changes, preserved carry, pushed stack bytes, stored memory,
undefined AF and overlapping current/changed code after timeline restoration.
Each browser samples 11,072 visible text elements in these states. Chromium,
Firefox and WebKit measured a minimum computed contrast of **6.742:1** in the
2026-10-13 checkpoint; thresholds are compared without rounding.

The calculation uses browser-computed sRGB foreground and ancestor background
colors, with alpha compositing over an explicitly opaque backing. It follows the
[W3C contrast/luminance definition](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
and applies the 4.5:1 normal-text threshold to every sampled element. Small unit
checks cover black/white bounds, near-threshold gray examples, alpha blending and
1,000 seeded symmetric comparisons. Unsupported color spaces, gradients and
ancestor opacity fail this scoped checker instead of silently producing a ratio.

The browser checks also verify each indicator fits its local container, the page
does not overflow, bit/flag font sizes meet the project floor and changed values
have an underline cue. This complements the
[W3C guidance on information beyond color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).
An actual tablet machine-panel screenshot is generated at ignored
`build/cpu-indicators-768.png` for visual review.

These are reduced-motion, flat-background checks for the specified CPU fields.
They do not certify the whole website, test animated intermediate colors,
measure physical display/print rendering, or replace live assistive-technology
and low-vision testing. Computed colors also do not measure font anti-aliasing.
