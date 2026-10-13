import {createState, step, hex} from '../simulator.mjs';
import {parseBits, formatBits, bitChanges} from '../binary.mjs';

export const STORAGE_KEY = 'bitborn.challenges.v1';

export function parseProgress(raw, catalog) {
  const empty = () => ({version:1, completed:[], attempts:{}});
  try {
    const value = JSON.parse(raw);
    if (value?.version !== 1 || !Array.isArray(value.completed) || !value.attempts || typeof value.attempts !== 'object' || Array.isArray(value.attempts)) return empty();
    const ids = new Set(catalog.map(challenge => challenge.id));
    const completed = [...new Set(value.completed.filter(id => typeof id === 'string' && ids.has(id)))];
    const attempts = {};
    for (const id of ids) {
      const count = value.attempts[id];
      if (Number.isSafeInteger(count) && count >= 0 && count <= 1000000) attempts[id] = count;
    }
    return {version:1, completed, attempts};
  } catch { return empty(); }
}

export function evaluateChallenge(challenge, source) {
  let state;
  try {
    if (typeof source !== 'string' && (!Array.isArray(source) && !(source instanceof Uint8Array) || source.length > 512 || Array.from(source).some(value => !Number.isInteger(value) || value < 0 || value > 255))) throw new Error('The program must contain at most 512 valid byte values.');
    const bytes = typeof source === 'string' ? parseBits(source, 512) : Uint8Array.from(source);
    if (bytes.length !== challenge.startBytes.length || bytes.length > 512) throw new Error(`Keep all ${challenge.startBytes.length} bytes; this puzzle changes bits, not program length.`);
    const changes = bitChanges(challenge.startBytes, bytes);
    if (changes.some(change => !challenge.editableOffsets.includes(change.offset))) throw new Error('A locked byte changed. Edit only the highlighted offsets.');
    const changedBits = changes.reduce((sum, change) => sum + change.bitCount, 0);
    if (changedBits > challenge.maxChangedBits) throw new Error(`The edit budget is ${challenge.maxChangedBits} bits; ${changedBits} changed.`);
    state = createState(bytes, challenge.loadAddress);
    // The curated fragments use the same segment-zero stack established by boot/loader.bits.
    if (challenge.loadAddress === 0x7E00) state.SP = 0x7C00;
    while (!state.halted && state.steps < challenge.maxSteps) step(bytes, state);
    const checks = [{label:`HLT reached within ${challenge.maxSteps} steps`,pass:state.halted}];
    for (const [register, value] of Object.entries(challenge.goals.registers || {})) checks.push({label:`${register} = 0x${hex(value,4)}`,pass:state[register] === value});
    for (const [flag, value] of Object.entries(challenge.goals.flags || {})) checks.push({label:`${flag.toUpperCase()} = ${Number(value)}`,pass:state[flag] === value});
    for (const name of ['output','serial']) if (Object.hasOwn(challenge.goals,name)) checks.push({label:`${name === 'output' ? 'Screen' : 'Serial'} output matches the goal`,pass:state[name] === challenge.goals[name]});
    for (const memory of challenge.goals.memory || []) checks.push({label:`Memory 0x${hex(memory.address,5)} = ${memory.bytes.map(value => hex(value)).join(' ')}`,pass:memory.bytes.every((value,index) => state.memory[memory.address+index] === value)});
    const success = checks.every(check => check.pass);
    return {success,state,checks,changedBits,message:success ? `Solved in ${state.steps} model steps with ${changedBits} changed ${changedBits === 1 ? 'bit' : 'bits'}.` : state.halted ? 'HLT reached, but a goal is still unmet. Inspect the result and try again.' : `The program did not reach HLT within ${challenge.maxSteps} model steps. Inspect the branch or loop.`};
  } catch (error) { return {success:false,state,checks:[],message:error.message}; }
}

async function startApp() {
  const byId = id => document.getElementById(id);
  const setText = (id, text) => { byId(id).textContent = text; };
  const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const response = await fetch(new URL('./catalog.json', import.meta.url));
  if (!response.ok) throw new Error(`Challenge source request failed (${response.status}).`);
  const catalog = await response.json();
  if (!Array.isArray(catalog) || !catalog.length || catalog.some(challenge => !/^[a-z0-9-]+$/.test(challenge.id))) throw new Error('The challenge catalog is invalid.');
  let progress;
  try { progress = parseProgress(localStorage.getItem(STORAGE_KEY), catalog); }
  catch { progress = parseProgress(null, catalog); }
  let challenge, hintsRevealed = 0;

  function updateProgress() {
    const count = progress.completed.length;
    byId('completion-count').replaceChildren(document.createTextNode(`${count} `), element('span', `/ ${catalog.length}`));
    byId('completion-meter').value = count;
    byId('completion-meter').max = catalog.length;
    const attempts = Object.values(progress.attempts).reduce((sum, value) => sum + value, 0);
    setText('attempt-count', `${attempts} validation ${attempts === 1 ? 'attempt' : 'attempts'}`);
    for (const link of byId('challenge-list').querySelectorAll('a')) link.querySelector('.completed-mark').textContent = progress.completed.includes(link.dataset.id) ? '✓' : '';
  }

  function renderBytes() {
    let bytes;
    try { bytes = parseBits(byId('binary-source').value,512); }
    catch { for (const button of byId('editable-bytes').querySelectorAll('button')) button.disabled = true; return; }
    byId('editable-bytes').replaceChildren();
    for (const offset of challenge.editableOffsets) {
      const byte = bytes[offset];
      const panel = element('div', undefined, `editable-byte${byte !== challenge.startBytes[offset] ? ' edited' : ''}`);
      const head = element('div', undefined, 'byte-head');
      head.append(element('span',`OFFSET ${hex(offset,3)}`),element('strong',`0x${hex(byte ?? 0)}`));
      const bits = element('div',undefined,'challenge-bits');
      for (let bit = 0; bit < 8; bit++) {
        const value = byte !== undefined && Boolean(byte & (1 << (7-bit)));
        const changed = byte !== undefined && Boolean((byte ^ challenge.startBytes[offset]) & (1 << (7-bit)));
        const button = element('button',value ? '1' : '0',`challenge-bit${changed ? ' changed' : ''}`);
        button.type = 'button'; button.dataset.offset = offset; button.dataset.bit = bit;
        button.setAttribute('aria-label',`Offset ${hex(offset,3)}, bit ${7-bit}, ${value ? '1' : '0'}`);
        button.setAttribute('aria-pressed',String(value)); button.disabled = byte === undefined;
        button.addEventListener('click',() => {
          const current = parseBits(byId('binary-source').value,512);
          current[offset] ^= 1 << (7-bit);
          byId('binary-source').value = formatBits(current);
          renderBytes();
          byId('editable-bytes').querySelector(`[data-offset="${offset}"][data-bit="${bit}"]`).focus();
        });
        bits.append(button);
      }
      const annotation = challenge.startAnnotations.find(item => item.offset <= offset && offset < item.offset + item.size);
      panel.append(head,bits,element('small',`Starting source: ${annotation?.mnemonic || 'Operand'}`));
      byId('editable-bytes').append(panel);
    }
  }

  function clearResult() {
    byId('result-panel').classList.remove('success','flash');
    setText('result','Edit the highlighted bytes, then run the teaching model.');
    byId('registers').replaceChildren(); byId('goal-checks').replaceChildren(); setText('output','');
  }

  function choose(id, navigate=false) {
    const selected = catalog.find(item => item.id === id);
    challenge = selected || catalog[0]; hintsRevealed = 0;
    setText('load-status',selected || !id ? 'Reviewed literal sources loaded. Solutions are checked by goals, not byte equality.' : 'Unknown challenge link. Showing the first puzzle.');
    const index = catalog.indexOf(challenge);
    setText('challenge-number',`CHALLENGE ${String(index+1).padStart(2,'0')} / ${catalog.length}`);
    setText('difficulty',challenge.difficulty); setText('challenge-title',challenge.title);
    setText('challenge-summary',challenge.summary); setText('challenge-goal',challenge.goal);
    setText('edit-budget',`${challenge.startBytes.length} bytes · ≤ ${challenge.maxChangedBits} bit changes`);
    byId('binary-source').value = challenge.startText; byId('hints').replaceChildren();
    byId('hint').disabled = false; setText('hint-count',`0/${challenge.hints.length}`);
    setText('visual-explanation',challenge.visual); setText('explanation',challenge.explanation);
    const shared = new URL(location.href); shared.search = ''; shared.hash = ''; shared.searchParams.set('id',challenge.id);
    byId('share').href = shared.href;
    byId('canonical-source').href = `https://github.com/OthmaneBlial/bitborn/tree/main/challenges/${challenge.id}`;
    byId('instructions').replaceChildren();
    for (const annotation of challenge.startAnnotations.filter(item => !['padding','signature'].includes(item.kind))) {
      const row = element('li'); const description = element('div',annotation.mnemonic);
      description.append(element('small',`${annotation.size} ${annotation.size === 1 ? 'byte' : 'bytes'} · ${annotation.explanation}`));
      row.append(element('span',hex(annotation.offset,3),'instruction-offset'),description); byId('instructions').append(row);
    }
    for (const link of byId('challenge-list').querySelectorAll('a')) link.setAttribute('aria-current',String(link.dataset.id === challenge.id));
    renderBytes(); clearResult();
    if (navigate) { history.pushState(null,'',shared.href); byId('workbench').focus(); }
  }

  let path;
  for (let index = 0; index < catalog.length; index++) {
    const item = catalog[index];
    if (item.path !== path) { path = item.path; byId('challenge-list').append(element('p',path,'path-label')); }
    const link = element('a',undefined,'challenge-link'); link.href = `?id=${encodeURIComponent(item.id)}`; link.dataset.id = item.id;
    link.append(element('span',String(index+1).padStart(2,'0'),'number'),element('span',item.title),element('span','','completed-mark'));
    link.addEventListener('click',event => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0) { event.preventDefault(); choose(item.id,true); } });
    byId('challenge-list').append(link);
  }
  byId('binary-source').addEventListener('input',renderBytes);
  byId('reset').addEventListener('click',() => { byId('binary-source').value = challenge.startText; renderBytes(); clearResult(); });
  byId('hint').addEventListener('click',() => {
    byId('hints').append(element('li',challenge.hints[hintsRevealed++]));
    setText('hint-count',`${hintsRevealed}/${challenge.hints.length}`);
    byId('hint').disabled = hintsRevealed === challenge.hints.length;
  });
  byId('validate').addEventListener('click',() => {
    const result = evaluateChallenge(challenge,byId('binary-source').value);
    progress.attempts[challenge.id] = Math.min((progress.attempts[challenge.id] || 0)+1,1000000);
    if (result.success && !progress.completed.includes(challenge.id)) progress.completed.push(challenge.id);
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(progress)); } catch { /* Private browsing may deny storage; the current session still works. */ }
    updateProgress(); setText('result',result.message);
    byId('result-panel').classList.toggle('success',result.success);
    byId('result-panel').classList.remove('flash');
    if (result.success) requestAnimationFrame(() => byId('result-panel').classList.add('flash'));
    byId('goal-checks').replaceChildren();
    for (const check of result.checks) byId('goal-checks').append(element('li',`${check.pass ? '✓' : '×'} ${check.label}`,check.pass ? 'pass' : 'fail'));
    byId('registers').replaceChildren();
    if (result.state) {
      const names = [...new Set(['AX','BX','CX','SP',...Object.keys(challenge.goals.registers || {})])];
      for (const name of names) {
        const row = element('span',name,'result-register'); row.append(element('strong',hex(result.state[name],4))); byId('registers').append(row);
      }
      setText('output',result.state.output);
    } else setText('output','');
  });
  window.addEventListener('popstate',() => choose(new URLSearchParams(location.search).get('id')));
  updateProgress(); choose(new URLSearchParams(location.search).get('id')); byId('challenge-app').hidden = false;
}

if (typeof document !== 'undefined') startApp().catch(error => { document.getElementById('load-status').textContent = `Challenges could not load: ${error.message}`; });
