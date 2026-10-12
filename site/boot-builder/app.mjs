import {binary, hex, createState, step, validateBootData} from '../simulator.mjs';
import {formatBits, validateImage} from '../binary.mjs';
import {liveLayout, byteDetails} from './model.mjs';

const $ = id => document.getElementById(id);
const node = (tag, text, className) => {
  const result = document.createElement(tag);
  if (text !== undefined) result.textContent = text;
  if (className) result.className = className;
  return result;
};
let baseline, bytes, layout, selected = 0, cpu, running = false, simulationProblem = '', timer;
const cells = [], bitButtons = [];
const columnCount = () => window.matchMedia('(max-width: 1050px)').matches ? 8 : 16;

function selectByte(offset, focus = false) {
  if (!bytes) return;
  selected = Math.max(0, Math.min(bytes.length - 1, offset));
  cells.forEach((cell, index) => {
    cell.classList.toggle('selected',index === selected);
    cell.setAttribute('aria-selected',String(index === selected));
    cell.tabIndex = index === selected ? 0 : -1;
  });
  if (focus) {
    cells[selected].focus({preventScroll:true});
    cells[selected].scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
  }
  renderInspector();
}

function makeGrid() {
  $('builder-grid').replaceChildren();
  const columns = columnCount();
  for (let row = 0; row < 512 / columns; row += 1) {
    const line = node('div',undefined,'byte-row');line.setAttribute('role','row');
    const label = node('span',hex(row * columns,3),'row-offset');label.setAttribute('aria-hidden','true');line.append(label);
    for (let col = 0; col < columns; col += 1) {
      const offset = row * columns + col;
      const button = cells[offset] || node('button',undefined,'builder-byte');
      if (!cells[offset]) {
        button.type = 'button';button.dataset.offset = offset;button.setAttribute('role','gridcell');
        button.append(node('span',undefined,'cell-hex'),node('span',undefined,'cell-bits'));
        button.addEventListener('click',() => selectByte(offset));
        button.addEventListener('keydown',event => {
          const columns = columnCount(), start = Math.floor(offset / columns) * columns;
          const next = {ArrowLeft:offset - 1,ArrowRight:offset + 1,ArrowUp:offset - columns,ArrowDown:offset + columns,Home:event.ctrlKey || event.metaKey ? 0 : start,End:event.ctrlKey || event.metaKey ? 511 : start + columns - 1}[event.key];
          if (next !== undefined) {event.preventDefault();selectByte(next,true);}
        });
        cells[offset] = button;
      }
      line.append(button);
    }
    $('builder-grid').append(line);
  }
  $('builder-grid').setAttribute('aria-rowcount',String(512 / columns));
  $('builder-grid').setAttribute('aria-colcount',String(columns));
}

function renderBytes() {
  let changedBytes = 0, changedBits = 0;
  cells.forEach((cell, offset) => {
    const original = baseline.annotations.find(item => offset >= item.offset && offset < item.offset + item.size);
    const xor = bytes[offset] ^ baseline.bytes[offset], bits = binary(bytes[offset]);
    if (xor) changedBytes += 1;
    cell.className = `builder-byte original-${original.kind}${xor ? ' changed' : ''}`;
    cell.querySelector('.cell-hex').textContent = hex(bytes[offset]);
    const bitNodes = [...bits].map((bit, index) => {
      const changed = Boolean(xor & (1 << (7 - index)));
      if (changed) changedBits += 1;
      return node('span',bit,changed ? 'changed-bit' : '');
    });
    cell.querySelector('.cell-bits').replaceChildren(...bitNodes);
    cell.setAttribute('aria-label',`Byte ${offset}, offset 0x${hex(offset,3)}, hex ${hex(bytes[offset])}, binary ${bits}, originally ${original.kind}${xor ? ', changed' : ''}`);
  });
  $('change-count').textContent = `${changedBytes} ${changedBytes === 1 ? 'byte' : 'bytes'} · ${changedBits} ${changedBits === 1 ? 'bit' : 'bits'} changed`;
  const validation = validateImage(bytes);
  const validSize = bytes.length === 512;
  const validSignature = bytes[510] === 0x55 && bytes[511] === 0xAA;
  $('size-status').textContent = validSize ? '512 / 512 bytes — valid' : `${bytes.length} bytes — expected 512`;
  $('signature-status').textContent = `${hex(bytes[510])} ${hex(bytes[511])} — ${validSignature ? 'valid marker' : 'invalid marker'}`;
  $('signature-status').classList.toggle('error',!validSignature);
  $('export-image').disabled = !validSize || !validSignature || validation.valid === false;
  $('export-status').textContent = validSignature ? 'Exports preserve your exact bytes. Native behavior is unverified after edits.' : 'The BIOS marker is invalid. Restore 55 AA to enable .img export; .bits is still available.';
  selectByte(selected);
  renderCPU();
}

function renderInspector() {
  const details = byteDetails(bytes,baseline.annotations,layout,selected), original = details.original;
  $('builder-offset').textContent = `0x${hex(selected,3)}`;
  $('builder-address').textContent = `byte ${selected} / physical 0x${hex(0x7C00 + selected,4)}`;
  $('builder-hex').textContent = `0x${hex(bytes[selected])}`;
  $('builder-decimal').textContent = `${bytes[selected]} decimal`;
  const xor = bytes[selected] ^ baseline.bytes[selected], changed = [];
  bitButtons.forEach((button,index) => {
    const bit = 7 - index, value = Number(Boolean(bytes[selected] & (1 << bit))), edited = Boolean(xor & (1 << bit));
    button.textContent = value;button.setAttribute('aria-pressed',String(Boolean(value)));button.classList.toggle('changed',edited);
    button.setAttribute('aria-label',`Byte ${selected}, bit ${bit}, weight ${1 << bit}, value ${value}. Toggle bit.`);
    if (edited) changed.push(bit);
  });
  $('bit-change-note').textContent = xor ? `Changed bit${changed.length === 1 ? '' : 's'} ${changed.join(', ')} · baseline ${binary(baseline.bytes[selected])} → ${binary(bytes[selected])}` : 'No bits changed in this byte.';
  $('live-field').textContent = `CURRENT BYTE / ${details.role.toUpperCase()}`;
  $('live-mnemonic').textContent = details.mnemonic;$('live-mnemonic').classList.toggle('error',Boolean(details.live?.error));
  $('live-explanation').textContent = details.explanation;
  $('live-boundary').textContent = details.live && !details.live.error ? `Live instruction: bytes ${details.live.offset}–${details.live.offset + details.live.size - 1} · ${details.live.size} byte${details.live.size === 1 ? '' : 's'}${details.live.offset !== original.offset && original.kind === 'instruction' ? ' · boundary differs from original source' : ''}` : `Original ${original.kind} span: bytes ${original.offset}–${original.offset + original.size - 1}`;
  $('live-operands').replaceChildren();
  cells.forEach(cell => cell.classList.remove('live-instruction'));
  if (details.live && !details.live.error) {
    for (let index = 0; index < details.live.size; index += 1) {
      const offset = details.live.offset + index, field = details.live.fields[index] || 'operand';
      const token = node('div',hex(bytes[offset]),`operand-byte${offset === selected ? ' active' : ''}`);token.append(node('span',field.toUpperCase()));$('live-operands').append(token);
      cells[offset]?.classList.add('live-instruction');
    }
  }
  $('source-kind').textContent = `BASELINE ${original.kind.toUpperCase()} / bytes ${original.offset}–${original.offset + original.size - 1}`;
  $('source-mnemonic').textContent = original.mnemonic;$('source-explanation').textContent = original.explanation;
  let impact = xor ? `This byte changed from 0x${hex(baseline.bytes[selected])} to 0x${hex(bytes[selected])}. ` : 'This byte matches the baseline. ';
  if (details.live?.error) impact += 'Simulation will stop if execution reaches an unsupported encoding; this is not a verdict on native x86 validity.';
  else if (original.kind === 'signature') impact += bytes[510] === 0x55 && bytes[511] === 0xAA ? 'The firmware marker is intact.' : 'The required 55 AA marker is broken; image export is blocked.';
  else if (original.kind === 'data') impact += 'Run the model to observe whether the output loop reads this changed character.';
  else if (details.role === 'opcode') impact += 'An opcode controls operation and length. Any changed length can shift later live boundaries.';
  else if (details.live?.displacement !== undefined) impact += 'A changed displacement redirects control flow from the end of its instruction.';
  else impact += 'Operands affect values and addresses. Reset CPU and step through the current bytes to inspect the consequence.';
  $('edit-impact').textContent = impact;
}

function resetCPU(message = 'CPU reset. The current edited bytes are loaded at 0x7C00.') {
  clearTimeout(timer);running = false;simulationProblem = '';cpu = createState(bytes);$('builder-trace').replaceChildren();
  $('simulation-status').textContent = message;renderCPU();
}

function renderCPU() {
  if (!cpu) return;
  $('builder-registers').replaceChildren(...[['IP',0x7C00 + cpu.ip],['AX',cpu.AX],['SI',cpu.SI],['SP',cpu.SP],['ZF',Number(cpu.zf)]].map(([name,value]) => {
    const register = node('div',undefined,'register');register.append(node('span',name),node('strong',name === 'ZF' ? value : hex(value & 65535,4)));return register;
  }));
  $('simulation-output').textContent = cpu.output || 'No screen bytes yet.';$('simulation-serial').textContent = cpu.serial || 'No serial bytes yet.';
  $('simulation-step').disabled = running || cpu.halted || Boolean(simulationProblem);
  $('simulation-run').disabled = running || cpu.halted || Boolean(simulationProblem);
  $('simulation-pause').hidden = !running;
  cells.forEach((cell,offset) => cell.classList.toggle('current-ip',!cpu.halted && cpu.ip === offset));
}

function simulateOne() {
  const offset = cpu.ip;
  try {
    const instruction = step(bytes,cpu);
    if (instruction) {
      const item = node('li',`0x${hex(0x7C00 + offset,4)}  ${instruction.mnemonic}`);
      $('builder-trace').prepend(item);
      while ($('builder-trace').children.length > 8) $('builder-trace').lastElementChild.remove();
      $('simulation-status').textContent = cpu.halted ? `HLT reached after ${cpu.steps} supported steps. This result is simulated; verify the exported bytes in QEMU.` : `${cpu.steps} supported steps · next physical address 0x${hex((0x7C00 + cpu.ip) & 65535,4)}`;
    }
  } catch (error) {
    simulationProblem = error.message;$('simulation-status').textContent = `Stopped at byte ${offset}: ${error.message}`;
  }
}

function runBatch() {
  if (!running) return;
  for (let index = 0; index < 64 && !cpu.halted && !simulationProblem; index += 1) simulateOne();
  if (cpu.halted || simulationProblem) running = false;
  renderCPU();
  if (running) timer = setTimeout(runBatch,16);
}

function download(contents, type, filename) {
  const url = URL.createObjectURL(new Blob([contents],{type}));
  const link = node('a');link.href = url;link.download = filename;
  document.body.append(link);link.click();link.remove();
  setTimeout(() => URL.revokeObjectURL(url),1000);
  $('export-status').textContent = `Download requested: ${filename} from the current ${bytes.length} bytes. Native execution still needs separate verification.`;
}

for (let index = 0; index < 8; index += 1) {
  const wrapper = node('div',undefined,'bit-control'), button = node('button','0','builder-bit');
  button.type = 'button';button.dataset.bit = index;button.disabled = true;
  wrapper.append(node('span',7 - index,'bit-weight'),button);$('builder-bits').append(wrapper);bitButtons.push(button);
  button.addEventListener('click',() => {
    bytes[selected] ^= 1 << (7 - index);layout = liveLayout(bytes,baseline.annotations);
    resetCPU('Bits changed. The CPU was reset so the next run uses your current bytes.');renderBytes();button.focus({preventScroll:true});
  });
}
$('jump-form').addEventListener('submit',event => {event.preventDefault();selectByte(Number($('jump-offset').value),true);});
document.querySelectorAll('[data-select]').forEach(button => button.addEventListener('click',() => {
  selectByte(Number(button.dataset.select),true);$('builder-grid').scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
}));
$('reset-image').addEventListener('click',() => {bytes = Uint8Array.from(baseline.bytes);layout = liveLayout(bytes,baseline.annotations);resetCPU('All bits restored to the canonical image. CPU reset.');renderBytes();});
$('simulation-reset').addEventListener('click',() => resetCPU());
$('simulation-step').addEventListener('click',() => {simulateOne();renderCPU();});
$('simulation-run').addEventListener('click',() => {running = true;renderCPU();runBatch();});
$('simulation-pause').addEventListener('click',() => {running = false;clearTimeout(timer);$('simulation-status').textContent = `Paused after ${cpu.steps} supported steps.`;renderCPU();});
$('export-image').addEventListener('click',() => {
  if (bytes.length === 512 && bytes[510] === 0x55 && bytes[511] === 0xAA) download(bytes,'application/octet-stream','bitborn-edited.img');
});
$('export-bits').addEventListener('click',() => download(formatBits(bytes),'text/plain;charset=utf-8','bitborn-edited.bits'));
let previousColumns = columnCount();
window.addEventListener('resize',() => {if (bytes && previousColumns !== columnCount()) {previousColumns = columnCount();makeGrid();selectByte(selected);}});

try {
  const response = await fetch(new URL('../boot.json',import.meta.url));
  if (!response.ok) throw new Error(`Boot image request failed: HTTP ${response.status}`);
  baseline = validateBootData(await response.json());
  const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256',Uint8Array.from(baseline.bytes)))].map(value => value.toString(16).padStart(2,'0')).join('');
  if (digest !== baseline.sha256) throw new Error('The canonical image checksum does not match its metadata.');
  bytes = Uint8Array.from(baseline.bytes);layout = liveLayout(bytes,baseline.annotations);makeGrid();resetCPU('Ready. Step through your bytes or run the bounded model to halt.');renderBytes();
  bitButtons.forEach(button => {button.disabled = false;});
  ['reset-image','simulation-reset','export-bits'].forEach(id => {$(id).disabled = false;});
  $('jump-form').querySelector('button').disabled = false;
  $('builder-checksum').textContent = baseline.sha256;
  $('builder-load-status').textContent = '512 canonical bytes loaded · SHA-256 verified · edits stay in this browser';
} catch (error) {
  $('builder-load-status').textContent = `Builder unavailable: ${error.message}`;$('builder-load-status').classList.add('error');
}
