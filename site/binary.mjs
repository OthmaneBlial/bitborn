// Literal binary input only: comments describe bytes, never generate instructions.
const isByte = value => Number.isInteger(value) && value >= 0 && value <= 255;
const checkBytes = bytes => {
  if (!(Array.isArray(bytes) || bytes instanceof Uint8Array) || bytes.length > 4096 || !Array.from(bytes).every(isByte)) throw new Error('Expected at most 4,096 byte values.');
};

export function parseBits(source, maxBytes = 512) {
  if (typeof source !== 'string' || source.length > 65536) throw new Error('Binary source must be text under 64 KiB.');
  if (!Number.isInteger(maxBytes) || maxBytes < 1 || maxBytes > 4096) throw new Error('Invalid byte limit.');
  const bytes = [];
  for (const [index, line] of source.split(/\r?\n/).entries()) {
    for (const token of line.split('#', 1)[0].trim().split(/\s+/).filter(Boolean)) {
      if (!/^[01]{8}$/.test(token)) throw new Error(`Line ${index + 1}: expected an eight-bit binary token, received ${token.slice(0, 32)}.`);
      bytes.push(Number.parseInt(token, 2));
      if (bytes.length > maxBytes) throw new Error(`The ${maxBytes}-byte limit was exceeded.`);
    }
  }
  if (!bytes.length) throw new Error('The binary source contains no bytes.');
  return Uint8Array.from(bytes);
}

export function formatBits(bytes) {
  checkBytes(bytes);
  const lines = ['# Literal bytes exported by bitborn. Comments are not executable.'];
  for (let offset = 0; offset < bytes.length; offset += 16) lines.push(Array.from(bytes.slice(offset, offset + 16), value => value.toString(2).padStart(8, '0')).join(' '));
  return lines.join('\n') + '\n';
}

export function validateImage(bytes) {
  const errors = [], warnings = [];
  const isSequence = Array.isArray(bytes) || bytes instanceof Uint8Array;
  const size = isSequence ? bytes.length : 0;
  if (!isSequence || !Array.from(bytes).every(isByte)) errors.push('The image must contain valid byte values.');
  if (size !== 512) errors.push(`A BIOS boot sector must be exactly 512 bytes; received ${size}.`);
  const signature = isSequence && size === 512 && bytes[510] === 0x55 && bytes[511] === 0xAA;
  if (!signature) errors.push('Bytes 510 and 511 must be 55 AA.');
  warnings.push('A valid size and signature do not prove that a program boots or that its instructions are supported by the teaching model.');
  return {valid: errors.length === 0, errors, warnings, size, signature};
}

export function bitChanges(before, after) {
  checkBytes(before); checkBytes(after);
  const changes = [];
  for (let offset = 0; offset < Math.max(before.length, after.length); offset += 1) {
    if (before[offset] === after[offset]) continue;
    const xor = before[offset] === undefined || after[offset] === undefined ? 255 : before[offset] ^ after[offset];
    const bits = Array.from({length: 8}, (_, index) => index).filter(index => xor & (1 << (7 - index)));
    changes.push({offset, before: before[offset], after: after[offset], xor, bits, bitCount: bits.length});
  }
  return changes;
}
