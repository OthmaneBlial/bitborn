import {binary, hex, decode, createState, step, validateBootData} from './simulator.mjs';

const $ = id => document.getElementById(id);
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const text = $(button.dataset.copy).textContent;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = 'Copy'; }, 1800);
    } catch {
      button.textContent = 'Select text';
      const selection = window.getSelection(), range = document.createRange();
      range.selectNodeContents($(button.dataset.copy)); selection.removeAllRanges(); selection.addRange(range);
    }
  });
});

if ($('terminal-output')) {
  const transcript = $('terminal-output').textContent;
  let position = 0, timer = null, paused = reducedMotion.matches;
  const updateMotion = () => {
    clearInterval(timer);
    $('terminal-motion').textContent = paused ? 'Replay' : 'Pause';
    $('terminal-motion').setAttribute('aria-pressed', String(paused));
    if (paused) { $('terminal-output').textContent = transcript; return; }
    $('terminal-output').textContent = transcript.slice(0, position);
    timer = setInterval(() => {
      position = Math.min(transcript.length, position + 3);
      $('terminal-output').textContent = transcript.slice(0, position);
      if (position >= transcript.length) {
        clearInterval(timer); paused = true;
        $('terminal-motion').textContent = 'Replay';
        $('terminal-motion').setAttribute('aria-pressed', 'true');
      }
    }, 34);
  };
  $('terminal-motion').addEventListener('click', () => { paused = !paused; if (!paused) position = 0; updateMotion(); });
  reducedMotion.addEventListener('change', event => { if (event.matches) { paused = true; updateMotion(); } });
  updateMotion();
}

function showRegisters(container, state, boot = false) {
  container.replaceChildren();
  const values = boot ? [['IP',hex(0x7C00 + state.ip,4)],['AX',hex(state.AX,4)],['SI',hex(state.SI,4)],['SP',hex(state.SP,4)],['ZF',Number(state.zf)]] : [['AX',hex(state.AX,4)],['BX',hex(state.BX,4)],['CX',hex(state.CX,4)],['DX',hex(state.DX,4)],['ZF',Number(state.zf)],['CF',Number(state.cf)]];
  values.forEach(([label, value]) => {
    const node = element('div', undefined, 'register');
    node.append(element('span', label), element('strong', value)); container.append(node);
  });
}

if ($('bit-editor')) {
  const templates = {mov:[0xB8,0x2A,0x00],add:[0x05,0x07,0x00],cmp:[0x3D,0x2A,0x00],inc:[0x40],xor:[0x31,0xC0],nop:[0x90]};
  let bytes = [...templates.mov], cpu = createState();
  function renderEditor(focusBit) {
    let instruction, problem;
    try { instruction = decode(bytes); } catch (error) { problem = error.message; }
    $('bit-editor').replaceChildren();
    bytes.forEach((value, byteIndex) => {
      const byteNode = element('div', undefined, 'byte-editor'), positions = element('div', undefined, 'bit-position-labels'), bits = element('div', undefined, 'bits');
      for (let bit = 7; bit >= 0; bit -= 1) {
        positions.append(element('span', bit));
        const set = Boolean(value & (1 << bit));
        const button = element('button', set ? '1' : '0', `bit${set ? ' on' : ''}`);
        button.type = 'button'; button.dataset.bit = `${byteIndex}-${bit}`;
        button.setAttribute('aria-pressed', String(set));
        button.setAttribute('aria-label', `Byte ${byteIndex}, bit ${bit}, value ${Number(set)}. Toggle bit.`);
        button.addEventListener('click', () => { bytes[byteIndex] ^= 1 << bit; renderEditor(button.dataset.bit); });
        bits.append(button);
      }
      const caption = element('div', undefined, 'byte-caption');
      caption.append(element('span', `BYTE ${byteIndex} / ${instruction?.fields[byteIndex]?.toUpperCase() || 'UNKNOWN'}`), element('code', `0x${hex(value)} · ${value}`));
      byteNode.append(positions,bits,caption); $('bit-editor').append(byteNode);
    });
    $('decoded-instruction').textContent = instruction?.mnemonic || 'Outside this simulator';
    $('encoding-explanation').textContent = instruction ? instruction.explanation + (instruction.size < bytes.length ? ` This instruction consumes ${instruction.size} of the ${bytes.length} displayed bytes; the remaining bytes are not simulated.` : '') : problem;
    $('decoded-instruction').classList.toggle('error', Boolean(problem));
    $('byte-values').textContent = bytes.map(value => hex(value)).join(' ');
    $('execute-instruction').disabled = Boolean(problem);
    if (focusBit) document.querySelector(`[data-bit="${focusBit}"]`)?.focus({preventScroll:true});
  }
  $('instruction-select').addEventListener('change', event => { bytes = [...templates[event.target.value]]; renderEditor(); });
  $('reset-bits').addEventListener('click', () => { bytes = [...templates[$('instruction-select').value]]; renderEditor(); });
  $('reset-state').addEventListener('click', () => { cpu = createState(); showRegisters($('play-registers'),cpu); $('play-status').textContent = 'CPU state reset. AX = 0, ZF = 0, CF = 0.'; $('play-status').classList.remove('error'); });
  $('execute-instruction').addEventListener('click', () => {
    cpu.ip = 0;
    try {
      const instruction = step(bytes,cpu);
      showRegisters($('play-registers'),cpu);
      $('play-status').textContent = `Simulated ${instruction.mnemonic}. Register values are hexadecimal. This is not native execution.`;
      $('play-status').classList.remove('error');
    } catch (error) { $('play-status').textContent = error.message; $('play-status').classList.add('error'); }
  });
  renderEditor(); showRegisters($('play-registers'),cpu);
}

const examples = [
  ['exit-code','Return an exit code','Linux x86-64 · ELF','Handwritten syscall bytes return a known process status.'],
  ['arithmetic','Perform arithmetic','Linux x86-64 · ELF','Observe a small calculation through the process exit status.'],
  ['print-text','Print text','Linux x86-64 · ELF','Write a message with the Linux syscall interface.'],
  ['loop-count','Loop and count','Linux x86-64 · ELF','Follow a counter and a backwards relative branch.'],
  ['compare-values','Compare values','Linux x86-64 · ELF','Use flags and a conditional branch to select a result.'],
  ['keyboard','Read keyboard input','x86 BIOS · real mode','Read a key through BIOS and display the character.'],
  ['vga','Display VGA characters','x86 BIOS · real mode','Write character and attribute bytes into VGA text memory.'],
  ['boot-sector','Boot a 512-byte sector','x86 BIOS · real mode','Study the complete annotated bitborn boot image.'],
  ['monitor','A tiny interactive monitor','x86 BIOS · multiple sectors','Explore help, clear, about, reboot, and memory inspection.'],
  ['disk-read','Read another disk sector','x86 BIOS · two sectors','Ask BIOS to read a second sector and report the result.'],
];
if ($('examples-grid')) examples.forEach(([slug,title,environment,description],index) => {
  const link = element('a',undefined,'example'); link.href = `https://github.com/OthmaneBlial/bitborn/tree/main/examples/${slug}`;
  const copy = element('div'); copy.append(element('h3',title),element('p',description),element('p',environment,'example-environment'));
  const arrow = element('span','↗','example-arrow'); arrow.setAttribute('aria-hidden','true');
  link.append(element('span',String(index + 1).padStart(2,'0'),'example-number'),copy,arrow); $('examples-grid').append(link);
});

if ($('demo-motion')) {
  let playing = false;
  $('demo-motion').addEventListener('click', () => {
    playing = !playing; $('demo-image').src = playing ? 'assets/boot.gif' : 'assets/boot.png';
    $('demo-motion').textContent = playing ? 'Show still capture' : 'Play boot recording';
    $('demo-motion').setAttribute('aria-pressed',String(playing));
  });
  reducedMotion.addEventListener('change', event => { if (event.matches && playing) $('demo-motion').click(); });
}

if ($('byte-map')) initializeBoot().catch(error => { $('boot-load-status').textContent = `Unable to load the image: ${error.message}`; $('boot-load-status').classList.add('error'); $('selected-mnemonic').textContent = 'Image unavailable'; });

async function initializeBoot() {
  const response = await fetch('boot.json');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = validateBootData(await response.json()), bytes = data.bytes;
  const digest = await crypto.subtle.digest('SHA-256',Uint8Array.from(bytes));
  const checksum = [...new Uint8Array(digest)].map(value => hex(value).toLowerCase()).join('');
  if (checksum !== data.sha256.toLowerCase()) throw new Error('The image does not match its SHA-256 checksum.');
  let cpu = createState(bytes), selected = 0, trace = [];
  const annotationAt = offset => data.annotations.find(annotation => offset >= annotation.offset && offset < annotation.offset + annotation.size);
  function inspect(offset,focus = false) {
    selected = offset;
    const annotation = annotationAt(offset);
    const previous = document.querySelector('.byte-cell.selected');
    if (previous) { previous.classList.remove('selected'); previous.tabIndex = -1; }
    const cell = document.querySelector(`[data-offset="${offset}"]`); cell.classList.add('selected'); cell.tabIndex = 0;
    if (focus) cell.focus({preventScroll:true});
    $('selected-offset').textContent = `0x${hex(offset,3)} / ${offset}`;
    $('selected-binary').textContent = binary(bytes[offset]); $('selected-hex').textContent = `0x${hex(bytes[offset])}`;
    $('selected-kind').textContent = annotation.kind.toUpperCase();
    $('selected-mnemonic').textContent = annotation.mnemonic || annotation.kind;
    $('selected-explanation').textContent = annotation.explanation;
    $('selected-boundary').textContent = `Starts at byte ${annotation.offset}. ${annotation.size} byte${annotation.size === 1 ? '' : 's'}. Selected byte is +${offset - annotation.offset} within this region.`;
  }
  bytes.forEach((value,offset) => {
    const annotation = annotationAt(offset);
    const button = element('button',hex(value),`byte-cell ${annotation.kind}${offset === annotation.offset ? ' boundary' : ''}`);
    button.type = 'button'; button.dataset.offset = offset; button.tabIndex = offset === 0 ? 0 : -1;
    button.setAttribute('aria-label',`Byte ${offset}, hexadecimal ${hex(value)}, ${annotation.kind}${offset === annotation.offset ? ' starts here' : ''}`);
    button.addEventListener('click', () => inspect(offset));
    button.addEventListener('keydown',event => {
      const columns = getComputedStyle($('byte-map')).gridTemplateColumns.split(' ').length;
      const delta = {ArrowLeft:-1,ArrowRight:1,ArrowUp:-columns,ArrowDown:columns}[event.key];
      if (delta !== undefined) { event.preventDefault(); inspect(Math.max(0,Math.min(511,offset + delta)),true); }
      if (event.key === 'Home') { event.preventDefault(); inspect(0,true); }
      if (event.key === 'End') { event.preventDefault(); inspect(511,true); }
    });
    $('byte-map').append(button);
  });
  function renderExecution() {
    document.querySelector('.byte-cell.executing')?.classList.remove('executing');
    document.querySelector(`[data-offset="${cpu.ip}"]`)?.classList.add('executing');
    showRegisters($('boot-registers'),cpu,true);
    $('boot-output').textContent = cpu.output || 'Awaiting first character.';
    $('boot-trace').replaceChildren(...trace.slice(-8).map(line => element('li',line)));
    $('boot-step').disabled = cpu.halted; $('boot-run').disabled = cpu.halted;
  }
  function advance(count) {
    try {
      for (let index = 0; index < count && !cpu.halted; index += 1) {
        const offset = cpu.ip, instruction = step(bytes,cpu);
        trace.push(`0x${hex(0x7C00 + offset,4)}  ${instruction.mnemonic}`);
      }
      inspect(Math.min(511,cpu.ip));
      $('boot-step-status').textContent = `${cpu.steps} simulated steps. ${cpu.halted ? 'HLT reached. Reset to start again.' : 'Next instruction is highlighted.'} BIOS and UART behavior are simplified; COM1 is assumed ready.`;
      $('boot-step-status').classList.remove('error');
    } catch (error) {
      cpu.halted = true; $('boot-step-status').textContent = error.message; $('boot-step-status').classList.add('error');
    }
    renderExecution();
  }
  $('boot-step').addEventListener('click', () => advance(1)); $('boot-run').addEventListener('click', () => advance(32));
  $('boot-reset').addEventListener('click', () => {
    cpu = createState(bytes); trace = []; inspect(0); renderExecution();
    $('boot-step-status').textContent = 'Reset to 0x7C00. Step through the real bytes in the bounded model.'; $('boot-step-status').classList.remove('error');
  });
  $('boot-checksum').textContent = checksum; $('boot-load-status').textContent = '512 bytes loaded. SHA-256 verified in your browser.';
  ['boot-step','boot-run','boot-reset'].forEach(id => { $(id).disabled = false; });
  inspect(selected); renderExecution();
}
