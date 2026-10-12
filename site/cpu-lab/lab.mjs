import {hex, decode, createState, logicalIP, flagsWord, physicalAddress} from '../simulator.mjs';
import {parseBits} from '../binary.mjs';
import {presets} from './presets.mjs';
import {createHistory,recordStep,seek} from '../history.mjs';

const $ = id => document.getElementById(id);
const registers = ['AX','BX','CX','DX','SI','DI','BP','SP','CS','DS','ES','SS','IP','FLAGS'];
const flags = [['CF','cf','Carry / unsigned overflow'],['PF','pf','Even parity in the low byte'],['AF','af','Carry or borrow across bit 3'],['ZF','zf','Zero result'],['SF','sf','Sign / highest result bit'],['IF','interrupts','Interrupt-enable flag; no interrupt delivery is modeled'],['DF','df','Direction of string pointer movement'],['OF','of','Signed overflow']];
let bytes, state, previous = null, before = null, memoryChanges = [], memoryStart = 0x7C00;
let running = false, timer = null, failed = false, stoppedAtBreakpoint = null, skipBreakpoint = null;
let history, transition = 'execute';
const breakpoints = new Set();
const registerValue = (cpu, name) => name === 'IP' ? logicalIP(cpu) : name === 'FLAGS' ? flagsWord(cpu) : cpu[name];
const location = (cpu, offset = cpu.ip) => `${hex(cpu.CS,4)}:${hex((cpu.loadAddress + offset - (cpu.CS << 4)) & 0xFFFF,4)}`;
const programMemory = () => state.memory.subarray(state.loadAddress, state.loadAddress + bytes.length);

function instructionAt(offset) {
  if (offset < 0 || offset >= bytes.length) return null;
  try { return {...decode(programMemory(), offset), offset}; }
  catch (error) { return {offset, size:1, mnemonic:'Unsupported encoding', explanation:error.message, unsupported:true}; }
}

function setStatus(message, error = false) {
  $('status').textContent = message;
  $('status').classList.toggle('error', error);
}

function renderRegisters() {
  $('registers').replaceChildren(...registers.map(name => {
    const value = registerValue(state, name), prior = before ? registerValue(before, name) : value;
    const changed = value ^ prior;
    const positions = Array.from({length:16}, (_, index) => 15 - index).filter(bit => changed & (1 << bit));
    const cell = document.createElement('div');
    cell.className = `register${changed ? ' changed' : ''}`; cell.dataset.register = name;
    cell.setAttribute('aria-label', `${name}: hexadecimal ${hex(value,4)}${changed ? `; changed bits ${positions.join(', ')}; previously ${hex(prior,4)}` : ''}`);
    cell.innerHTML = `<div class="register-top"><span class="register-name">${name}</span><strong class="register-value">${hex(value,4)}</strong></div><div class="register-bits" aria-hidden="true">${Array.from({length:16},(_,index) => {const bit=15-index; return `<span data-bit="${bit}" class="${changed & (1 << bit) ? 'changed-bit' : ''}">${(value >> bit) & 1}</span>`;}).join('')}</div><span class="register-change">${changed ? `Δ bits ${positions.join(',')}` : '· unchanged'}</span>`;
    return cell;
  }));
  $('flags').replaceChildren(...flags.map(([name,key,description]) => {
    const changed = before && state[key] !== before[key], value = state[key] == null ? '?' : Number(state[key]);
    const flag = document.createElement('div'); flag.className = `flag${changed ? ' changed' : ''}`; flag.dataset.flag = name;
    flag.title = description;
    flag.setAttribute('aria-label', `${name}: ${value === '?' ? 'undefined' : value}${changed ? `; changed from ${before[key] == null ? 'undefined' : Number(before[key])}` : ''}. ${description}`);
    flag.innerHTML = `${name}<strong>${value}</strong>`;
    return flag;
  }));
}

function renderListing() {
  const rows = [];
  for (let offset = 0; offset < bytes.length;) {
    const instruction = instructionAt(offset), row = document.createElement('div');
    row.className = `instruction-row${offset === state.ip && !state.halted ? ' current' : ''}${previous?.offset === offset ? ' executed' : ''}`;
    row.dataset.offset = offset;
    if (offset === state.ip && !state.halted) row.setAttribute('aria-current','step');
    const button = document.createElement('button'); button.type = 'button'; button.className = 'breakpoint'; button.dataset.breakpoint = offset;
    button.setAttribute('aria-pressed', String(breakpoints.has(offset)));
    button.setAttribute('aria-label', `${breakpoints.has(offset) ? 'Remove' : 'Set'} breakpoint at ${location(state,offset)}: ${instruction.mnemonic}`);
    button.textContent = breakpoints.has(offset) ? '●' : '○';
    button.addEventListener('click', () => {
      const target=instruction.offset;
      if (breakpoints.has(target)) breakpoints.delete(target); else breakpoints.add(target);
      renderListing();
      setStatus(`Breakpoint ${breakpoints.has(target) ? 'set' : 'removed'} at ${location(state,target)}.`);
      $('program-listing').querySelector(`[data-breakpoint="${target}"]`)?.focus({preventScroll:true});
    });
    const address = document.createElement('span'); address.className = 'instruction-location'; address.textContent = location(state,offset);
    const data = document.createElement('div'); data.className = 'instruction-data';
    const mnemonic = document.createElement('strong'); mnemonic.textContent = instruction.mnemonic;
    const encoding = document.createElement('small'); encoding.textContent = [...programMemory().slice(offset,offset+instruction.size)].map(value => hex(value)).join(' ');
    data.append(mnemonic, encoding); row.append(button, address, data); rows.push(row);
    offset += instruction.size;
    if (instruction.unsupported) break;
  }
  const scroll = $('program-listing').scrollTop;
  $('program-listing').replaceChildren(...rows); $('program-listing').scrollTop = scroll;
  const current = $('program-listing').querySelector('.current');
  if (current && (current.offsetTop < scroll || current.offsetTop + current.offsetHeight > scroll + $('program-listing').clientHeight)) $('program-listing').scrollTop = current.offsetTop;
}

function renderTrace() {
  const current = state.halted ? null : instructionAt(state.ip);
  const nextOffset = current ? physicalAddress(state.CS,(logicalIP(state) + current.size) & 65535) - state.loadAddress : -1;
  const next = current && !current.unsupported ? instructionAt(nextOffset) : null;
  $('previous-instruction').textContent = previous?.mnemonic ?? '—';
  $('previous-label').textContent = transition === 'rewind' ? 'RESTORED / UNDONE' : transition === 'replay' ? 'RECORDED / REPLAYED' : 'PREVIOUS / EXECUTED';
  $('previous-address').textContent = previous ? `${previous.location} · ${previous.size} byte${previous.size === 1 ? '' : 's'}` : 'No instruction executed';
  $('current-instruction').textContent = state.halted ? 'HLT reached' : current?.mnemonic ?? 'Outside loaded program';
  $('current-address').textContent = current ? `${location(state)} · physical ${hex(physicalAddress(state.CS,logicalIP(state)),5)}` : 'Reset to restart';
  $('next-instruction').textContent = next?.mnemonic ?? '—';
  $('next-address').textContent = next ? `${location(state,next.offset)} · sequential preview` : 'No sequential instruction';
  $('pointer-label').textContent = location(state);
  if (!before) {
    $('pointer-change').textContent = 'IP starts at 7C00. The green instruction is the next one to execute.';
    $('changes').textContent = 'Step to see exactly which register bits, flags and memory bytes change.';
    return;
  }
  const expected = before.ip + previous.size;
  const flow = transition === 'rewind' ? 'rewind' : transition === 'replay' ? 'recorded replay' : state.ip === expected && before.CS === state.CS ? 'sequential' : 'control transfer';
  $('pointer-change').textContent = `${location(before)} → ${location(state)} · ${flow}${state.halted ? ' · halted' : ''}`;
  const registerChanges = registers.filter(name => registerValue(state,name) !== registerValue(before,name)).map(name => `${name} ${hex(registerValue(before,name),4)} → ${hex(registerValue(state,name),4)}`);
  const flagChanges = flags.filter(([,key]) => state[key] !== before[key]).map(([name,key]) => `${name} ${before[key] == null ? '?' : Number(before[key])} → ${state[key] == null ? '?' : Number(state[key])}`);
  const memory = memoryChanges.map(change => `[${hex(change.offset,5)}] ${hex(change.before)} → ${hex(change.after)}`);
  $('changes').textContent = [...registerChanges,...flagChanges,...memory].join(' · ') || 'No register, flag or memory value changed.';
}

function renderMemory() {
  const changedAddresses = new Set(memoryChanges.map(change => change.offset));
  const stackRows = [];
  for (let word = 0; word < 8; word++) {
    const offset = (state.SP + word * 2) & 0xFFFF, lo = physicalAddress(state.SS,offset), hi = physicalAddress(state.SS,(offset + 1) & 0xFFFF);
    const cell = document.createElement('div'); cell.className = `stack-word${changedAddresses.has(lo) || changedAddresses.has(hi) ? ' changed' : ''}`;
    cell.dataset.stackAddress = hex(lo,5);
    const value = offset === 0xFFFF ? null : state.memory[lo] | (state.memory[hi] << 8);
    cell.setAttribute('aria-label', `${word === 0 ? 'Top of stack. ' : ''}${hex(state.SS,4)}:${hex(offset,4)}: ${value === null ? 'word crosses the modeled segment limit' : `word ${hex(value,4)}; bytes ${hex(state.memory[lo])}, ${hex(state.memory[hi])}`}${changedAddresses.has(lo) || changedAddresses.has(hi) ? '; changed since the previously displayed state' : ''}`);
    cell.innerHTML = `<span>${word === 0 ? '→ ' : '  '}${hex(offset,4)}</span><strong><span class="stack-byte${changedAddresses.has(lo) ? ' changed-bit' : ''}">${hex(state.memory[lo])}</span> <span class="stack-byte${changedAddresses.has(hi) ? ' changed-bit' : ''}">${value === null ? '—' : hex(state.memory[hi])}</span><em>${value === null ? 'limit' : hex(value,4)}</em></strong>`;
    stackRows.push(cell);
  }
  $('stack').replaceChildren(...stackRows);
  $('stack-pointer').textContent = `${hex(state.SS,4)}:${hex(state.SP,4)}`;
  $('stack-motion').textContent = !before ? 'Initial stack pointer' : state.SP === before.SP ? 'SP unchanged' : `SP ${hex(before.SP,4)} → ${hex(state.SP,4)} · ${state.SP === ((before.SP - 2) & 0xFFFF) ? 'down 2 bytes' : state.SP === ((before.SP + 2) & 0xFFFF) ? 'up 2 bytes' : 'changed'}`;
  const end = Math.min(memoryStart + 64, state.memory.length), memoryCells = [];
  const instruction = !state.halted && instructionAt(state.ip);
  for (let address = memoryStart; address < end; address++) {
    const cell = document.createElement('span'); cell.className = `memory-byte${address >= state.loadAddress && address < state.loadAddress + bytes.length ? ' program-byte' : ''}${instruction && address >= state.loadAddress + state.ip && address < state.loadAddress + state.ip + instruction.size ? ' current-byte' : ''}${changedAddresses.has(address) ? ' changed-bit' : ''}`;
    cell.dataset.address = hex(address,5); cell.textContent = hex(state.memory[address]);
    cell.title = `Physical ${hex(address,5)}: ${hex(state.memory[address])}${changedAddresses.has(address) ? ' · changed since the previously displayed state' : ''}`;
    cell.setAttribute('aria-label',cell.title);
    memoryCells.push(cell);
  }
  $('memory').replaceChildren(...memoryCells); $('memory-range').textContent = `${hex(memoryStart,5)}–${hex(end-1,5)} / ${end-memoryStart} bytes`;
}

function renderTimeline() {
  const total=history.frames.length, position=history.position;
  $('timeline').max=String(total); $('timeline').value=String(position);
  $('timeline').disabled=running || total===0;
  const description=position ? `after ${history.frames[position-1].instruction.mnemonic}` : 'before the first instruction';
  $('timeline').setAttribute('aria-valuetext',`Recorded state ${position} of ${total}, ${description}`);
  $('timeline-value').textContent=`${position} / ${total} · ${description}`;
  const start=Math.max(0,Math.min(position-4,total-8)), end=Math.min(total,start+8);
  const rows=[];
  for(let index=start;index<=end;index++) {
    const row=document.createElement('li');
    row.className=index===position ? 'selected' : index>position ? 'future' : '';
    if(index===position)row.setAttribute('aria-current','step');
    row.textContent=`${index} · ${index ? history.frames[index-1].instruction.mnemonic : 'Initial state'}`;
    rows.push(row);
  }
  $('timeline-steps').replaceChildren(...rows);
}

function render() {
  renderRegisters(); renderListing(); renderTrace(); renderMemory();
  $('step-count').textContent = String(state.steps).padStart(4,'0');
  $('run-state').textContent = failed ? 'STOPPED' : state.halted ? 'HALTED' : running ? 'RUNNING' : before ? 'PAUSED' : 'READY';
  $('step').disabled = running || state.halted || failed; $('run').disabled = running || state.halted || failed; $('pause').disabled = !running;
  $('back').disabled = running || history.position===0; $('forward').disabled = running || history.position===history.frames.length;
  $('history-position').textContent = `${history.position} / ${history.frames.length} recorded`;
  renderTimeline();
  document.querySelector('.control-panel').classList.toggle('is-running',running);
  $('byte-count').textContent = `${bytes.length} BYTES`; $('screen-output').textContent = state.output || '∅'; $('serial-output').textContent = state.serial || '∅';
}

function pause(message) {
  clearTimeout(timer); timer = null; running = false;
  if (message) setStatus(message);
  render();
}

function performStep() {
  if (state.halted || failed) return false;
  const oldLocation = location(state), offset = state.ip;
  try {
    const frame = recordStep(history,bytes), instruction=frame.instruction;
    before=frame.before;
    transition = 'execute';
    previous = {...instruction,offset,location:oldLocation};
    memoryChanges = instruction.memoryChanges;
    stoppedAtBreakpoint = null;
    if (state.halted) pause(`HLT reached after ${state.steps} steps. Reset to restart.`);
    else {setStatus(`${instruction.mnemonic} executed. ${instruction.explanation}`); render();}
    return true;
  } catch (error) {
    before = null; memoryChanges = []; failed = true;
    pause(); setStatus(error.message,true); return false;
  }
}

function travel(direction) {
  travelTo(history.position+(direction==='rewind'?-1:1));
}

function travelTo(position) {
  if (running) return;
  if(position<0 || position>history.frames.length)return;
  const restored=seek(history,position);
  if (!restored) return;
  const {frame,direction}=restored;
  clearTimeout(timer);timer=null;failed=false;stoppedAtBreakpoint=null;skipBreakpoint=null;
  transition=direction;
  before=restored.before;
  previous={...frame.instruction,offset:frame.before.ip,location:location(frame.before)};
  memoryChanges=restored.memoryChanges;
  setStatus(`${direction==='rewind'?'Rewound':'Replayed'} ${frame.instruction.mnemonic}. Restored recorded state ${history.position}; no new instruction was executed.`);
  render();
}

function tick() {
  if (!running) return;
  if (breakpoints.has(state.ip) && skipBreakpoint !== state.ip) {
    stoppedAtBreakpoint = state.ip; pause(`Breakpoint at ${location(state)}. Paused before execution. Step or Run to continue.`); return;
  }
  skipBreakpoint = null;
  if (performStep() && running) timer = setTimeout(tick,1000 / Number($('speed').value));
}

function run() {
  if (running || state.halted || failed) return;
  skipBreakpoint = stoppedAtBreakpoint === state.ip ? state.ip : null;
  running = true; setStatus('Running supported binary instructions. Pause to inspect any state.'); render();
  timer = setTimeout(tick,1000 / Number($('speed').value));
}

function reset() {
  clearTimeout(timer); timer = null; running = false; failed = false; stoppedAtBreakpoint = null; skipBreakpoint = null;
  state = createState(bytes); state.SP = 0x7C00; previous = null; before = null; memoryChanges = [];
  history=createHistory(state);transition='execute';
  setStatus('Deterministic initial state loaded: CS:IP 0000:7C00, SS:SP 0000:7C00. Ready to step.'); render();
}

function loadSource(source) {
  try {
    const parsed = parseBits(source,512);
    bytes = parsed; breakpoints.clear(); memoryStart = 0x7C00; $('memory-address').value = '07C00';
    reset(); $('editor-status').classList.remove('error'); $('editor-status').textContent = `${bytes.length} literal bytes loaded. State reset; breakpoints cleared.`;
    return true;
  } catch (error) {
    $('editor-status').classList.add('error'); $('editor-status').textContent = `${error.message} Current program and state kept.`; return false;
  }
}

function inspectMemory(address) {
  memoryStart = address; $('memory-address').value = hex(address,5); $('memory-address').setCustomValidity(''); renderMemory();
}

for (const preset of presets) {const option=document.createElement('option'); option.value=preset.id; option.textContent=preset.title; $('preset').append(option);}
$('preset').addEventListener('change', () => {
  const preset = presets.find(item => item.id === $('preset').value);
  $('binary-editor').value = preset.source; $('lesson').textContent = preset.lesson; loadSource(preset.source);
});
$('step').addEventListener('click',performStep); $('run').addEventListener('click',run); $('pause').addEventListener('click',() => pause(`Paused at ${location(state)}. Last state change is shown below.`)); $('reset').addEventListener('click',reset);
$('back').addEventListener('click',()=>travel('rewind'));$('forward').addEventListener('click',()=>travel('replay'));
$('timeline').addEventListener('input',()=>travelTo(Number($('timeline').value)));
$('speed').addEventListener('input',() => {
  $('speed-label').textContent = `${$('speed').value} steps/s`;
  if (running) {clearTimeout(timer); timer=setTimeout(tick,1000 / Number($('speed').value));}
});
$('memory-form').addEventListener('submit',event => {
  event.preventDefault(); const input=$('memory-address'), raw=input.value.trim();
  if (!/^(?:0x)?[0-9a-f]{1,5}$/i.test(raw)) {input.setCustomValidity('Use a hexadecimal address from 00000 to FFFFF.'); input.reportValidity(); setStatus('Memory address must be hexadecimal 00000–FFFFF. The inspected range was kept.',true); return;}
  inspectMemory(Number.parseInt(raw,16));
});
$('memory-address').addEventListener('input',() => $('memory-address').setCustomValidity(''));
$('inspect-ds').addEventListener('click',() => inspectMemory(physicalAddress(state.DS,state.SI)));
$('inspect-es').addEventListener('click',() => inspectMemory(physicalAddress(state.ES,state.DI)));
$('inspect-stack').addEventListener('click',() => inspectMemory(physicalAddress(state.SS,state.SP)));
$('load-program').addEventListener('click',() => {
  if (loadSource($('binary-editor').value)) {$('lesson').textContent='Custom literal binary program. The listing explains supported encodings; unsupported bytes stop execution.'; $('preset').selectedIndex=-1;}
});
$('import-program').addEventListener('change',async event => {
  const file=event.target.files[0]; if (!file) return;
  try {
    if (file.size > 65536) throw new Error('Source files must be at most 64 KiB.');
    const buffer=await file.arrayBuffer();let source;
    // Preserve the BOM so the shared parser validates it exactly once.
    try {source=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(buffer);}
    catch {throw new Error('Source files must contain valid UTF-8 text.');}
    $('binary-editor').value=source;
    if (loadSource(source)) {$('lesson').textContent='Imported literal binary program. Only the bounded supported instruction subset runs here.'; $('preset').selectedIndex=-1;}
  } catch (error) {$('editor-status').classList.add('error'); $('editor-status').textContent=`${error.message} Current program and state kept.`;}
  event.target.value='';
});
document.addEventListener('keydown',event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.repeat || event.target.closest('input,textarea,select,button,a,summary')) return;
  if (event.key.toLowerCase() === 's') {event.preventDefault(); if (!running) performStep();}
  else if (event.code === 'Space') {event.preventDefault(); if (running) pause(`Paused at ${location(state)}.`); else run();}
  else if (event.key.toLowerCase() === 'r') {event.preventDefault(); reset();}
  else if (event.key.toLowerCase() === 'b') {event.preventDefault();travel('rewind');}
  else if (event.key.toLowerCase() === 'f') {event.preventDefault();travel('replay');}
});
$('preset').value=presets[0].id; $('binary-editor').value=presets[0].source; $('lesson').textContent=presets[0].lesson; loadSource(presets[0].source);
