import {step} from './simulator.mjs';

function snapshot(state) {
  const {memory: _memory, ...values} = state;
  return values;
}

export function createHistory(state) {
  return {state,frames:[],position:0};
}

export function recordStep(history,bytes) {
  const before=snapshot(history.state), instruction=step(bytes,history.state);
  if (!instruction) return null;
  const frame={before,after:snapshot(history.state),instruction,memoryChanges:instruction.memoryChanges};
  history.frames.splice(history.position);
  history.frames.push(frame);history.position++;
  return frame;
}

export function rewind(history) {
  if (!history.position) return null;
  const frame=history.frames[--history.position];
  for(const change of frame.memoryChanges)history.state.memory[change.offset]=change.before;
  Object.assign(history.state,frame.before);
  return frame;
}

export function replay(history) {
  if (history.position===history.frames.length) return null;
  const frame=history.frames[history.position++];
  for(const change of frame.memoryChanges)history.state.memory[change.offset]=change.after;
  Object.assign(history.state,frame.after);
  return frame;
}

export function seek(history, position) {
  if (!Number.isInteger(position) || position < 0 || position > history.frames.length) throw new Error('Recorded state must be an integer within the timeline.');
  if (position === history.position) return null;
  const before = snapshot(history.state), changes = new Map();
  const direction = position < history.position ? 'rewind' : 'replay';
  let frame;
  while (history.position !== position) {
    frame = direction === 'rewind' ? rewind(history) : replay(history);
    for (const change of frame.memoryChanges) {
      const first = direction === 'rewind' ? change.after : change.before;
      const last = direction === 'rewind' ? change.before : change.after;
      const previous = changes.get(change.offset);
      changes.set(change.offset, {offset:change.offset, before:previous ? previous.before : first, after:last});
    }
  }
  return {before, frame, direction, memoryChanges:[...changes.values()].filter(change => change.before !== change.after)};
}
