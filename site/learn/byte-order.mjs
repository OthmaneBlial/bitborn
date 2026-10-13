import {inspectEncoding} from '../encoding.mjs';
import {binary, hex} from '../simulator.mjs';
import {byteOrderSource} from './byte-order-source.mjs';

export function readByteOrder(bytes) {
  const word = inspectEncoding(bytes.slice(1, 4), 16);
  const branch = inspectEncoding(bytes.slice(4, 6), 16);
  return {byte: bytes[2], word: Number(word.value), displacement: branch.displacement,
    target: (0x7C00 + 6 + branch.displacement) & 65535};
}

if (typeof document !== 'undefined') {
  const bytes = [...byteOrderSource.bytes];
  const output = id => document.getElementById(id);
  const render = () => {
    const {byte, word, displacement, target} = readByteOrder(bytes);
    output('lesson-byte').textContent = `${binary(byte)} = 0x${hex(byte)} = ${byte}`;
    output('lesson-word').textContent = `B8 ${hex(bytes[2])} ${hex(bytes[3])} → MOV AX, ${word} (0x${hex(word, 4)})`;
    output('lesson-branch').textContent = `EB ${hex(bytes[5])} → JMP ${displacement >= 0 ? '+' : ''}${displacement}; next IP 0x7C06 ${displacement < 0 ? '−' : '+'} ${Math.abs(displacement)} = 0x${hex(target, 4)}`;
    output('lesson-boundary').textContent = target >= 0x7C00 && target < 0x7C06
      ? `The target is offset ${target - 0x7C00} inside the original six-byte program.`
      : 'The target is outside the original six-byte program. Computing its address does not prove it contains an instruction.';
    output('lesson-literal').textContent = bytes.map(binary).join(' ');
  };
  output('lesson-bit').addEventListener('click', () => { bytes[2] ^= 1; render(); });
  output('lesson-swap').addEventListener('click', () => { [bytes[2], bytes[3]] = [bytes[3], bytes[2]]; render(); });
  output('lesson-sign').addEventListener('click', () => { bytes[5] ^= 128; render(); });
  output('lesson-reset').addEventListener('click', () => { bytes.splice(0, bytes.length, ...byteOrderSource.bytes); render(); });
  render();
}
