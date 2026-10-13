# Edit instruction bits with the keyboard

The instruction editors on the homepage and
[playground](https://othmaneblial.github.io/bitborn/playground/) share one keyboard
behavior. Tab enters the matrix at its active bit once, rather than visiting
every bit button. Tab again leaves the entire matrix; Shift+Tab returns to the
active bit. Labels identify the byte, bit, current value and available field role.

| Key | Action |
| --- | --- |
| Left / Right | Previous / next bit in displayed order, across byte boundaries |
| Up / Down | Same bit position in the previous / next byte |
| Home / End | First / last displayed bit of the current byte |
| Ctrl or Cmd + Home / End | First / last bit of the entire instruction |
| Enter / Space | Toggle the focused bit using its normal button action |
| Tab / Shift+Tab | Leave / re-enter the matrix without editing |

Bits display from 7 down to 0; bytes display in source order. Arrow navigation
stops at instruction boundaries. Up/Down at the first/last byte stays on the
current bit. Navigation preserves bytes and runtime registers; bit editing is
inspection until you explicitly choose simulation.

Pointer focus also updates the one Tab stop. Toggling a bit rebuilds the editor
while preserving focus at that coordinate, including when the new encoding is
unsupported. If a shorter fixture removes the active byte, the Tab stop moves
to byte 0, bit 7 without stealing focus from the fixture selector. Changing
inspection context keeps the current bit when it still exists.

The visible help text is connected to the labeled button group through
`aria-describedby`. Buttons retain native Enter/Space behavior and `aria-pressed`
values. This uses the same navigation conventions as the existing boot builder.

## Verification scope

Real browser checks use all ten bytes of a 64-bit MOV fixture, row/global
boundaries, both modifier keys, invalid-encoding edits, Tab exit/return and
fixture shortening. They assert exactly one active Tab stop and unchanged
runtime state on both editor pages in Chromium, Firefox and WebKit.

```sh
node tests/browser_site.mjs
npm run test:cross-browser
```

These checks verify browser focus and accessible attributes. A live screen-reader
session, alternate assistive input devices and complete site accessibility review
remain separate checks; no certification is claimed.
