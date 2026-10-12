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
