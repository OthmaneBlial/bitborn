import {binary,hex} from '../../simulator.mjs';
import {bitChanges} from '../../binary.mjs';
const $ = id => document.getElementById(id);
try {
  const response = await fetch(new URL('../../optimization.json', import.meta.url));
  if (!response.ok) throw new Error(`Source request failed (${response.status}).`);
  const data = await response.json(), before = data.before.bytes, after = data.after.bytes;
  const changes = bitChanges(before,after);
  $('before-size').textContent = before.length; $('after-size').textContent = after.length;
  $('before-elf').textContent = data.before.elfSize; $('after-elf').textContent = data.after.elfSize;
  $('load-status').textContent = 'Loaded literal bytes from the two reviewed canonical sources.';
  const show = offset => {
    const a = before[offset], b = after[offset], change = changes.find(item => item.offset === offset);
    for (const button of $('comparison').children) button.setAttribute('aria-pressed',String(Number(button.dataset.offset) === offset));
    $('bit-detail').textContent = `Offset ${offset}\nBefore: ${a === undefined ? 'absent' : binary(a)}\nAfter:  ${b === undefined ? 'absent' : binary(b)}\n${a === undefined || b === undefined ? 'This position was added or removed.' : `XOR:    ${binary(a ^ b)} · ${change?.bitCount || 0} changed bits`}`;
  };
  for (let offset = 0; offset < Math.max(before.length,after.length); offset++) {
    const button = document.createElement('button'); button.type='button'; button.dataset.offset=offset;
    const label = document.createElement('small'); label.textContent=`OFFSET ${hex(offset,2)}`;
    const values = document.createElement('strong'); values.className=before[offset] !== after[offset] ? 'different' : '';
    values.textContent = `${before[offset] === undefined ? '—' : hex(before[offset])} → ${after[offset] === undefined ? '—' : hex(after[offset])}`;
    button.append(label,values); button.addEventListener('click',()=>show(offset)); $('comparison').append(button);
  }
  show(0);
} catch (error) { $('load-status').textContent=error.message; }
