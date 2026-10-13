# Execution keys and readable status

The [CPU Lab](https://othmaneblial.github.io/bitborn/cpu-lab/) exposes the same
actions through buttons and optional page shortcuts. The **Enable execution
shortcuts** checkbox sits above the status message and is enabled initially to
preserve the existing controls. Turn it off with a click or Tab, then Space.
The choice stays in the current page; the app does not save a preference.

| Key | Action away from controls and editable text |
| --- | --- |
| S | Execute one modeled instruction |
| Space | Run or pause |
| R | Reset loaded bytes to their deterministic initial state; clear history |
| B | Restore the previous recorded state |
| F | Restore the next recorded state |

Turning shortcuts off changes key handling without changing the loaded program,
registers, memory, output or history. Use **Pause** to stop an active Run. Every
button remains available through Tab and Enter, including Back and Forward.
Timeline arrow/Home/End navigation is a native focused-control interaction and
remains available with execution shortcuts off.

Shortcuts ignore form controls, buttons, links, disclosure summaries and
contenteditable text. Repeated keydown events, text composition, events already
consumed by another control, and Ctrl/Alt/Meta combinations also do not invoke
execution commands. Editing a binary draft never invokes Step or Reset.

## Status without a message for every timer tick

The existing status region uses `role="status"` and explicit `aria-atomic="true"`.
A non-halting manual step reports its step number, executed instruction, next CS:IP and
explanation. Back/Forward report that they restore recorded state without new
execution. Run reports that it started; its timer ticks update the visible CPU
without replacing the live status for each instruction. Pause, breakpoint, halt
and errors still report the corresponding outcome. No additional live region
duplicates the register grid or every changed bit.

The switch follows the turn-off option described in
[W3C's character-key-shortcut guidance](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html).
This is a scoped interaction change, not a whole-site conformance claim. Browser
checks inspect actual key handling, atomic status text and preserved displayed
state; live speech-input and screen-reader sessions remain separate validation.

```sh
node tests/browser_cpu_lab.mjs
npm run test:cross-browser
```

The shared browser check covers all five disabled shortcuts, native button
activation, enabled Step/Reset/Back/Forward/Run/Pause, editor/contenteditable
typing, repeat/composition/modifier/consumed events, manual-step location text,
quiet automatic ticks and final halt status.
