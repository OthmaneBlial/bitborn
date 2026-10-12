// Literal binary input only: comments describe bytes, never generate instructions.
const isByte = value => Number.isInteger(value) && value >= 0 && value <= 255;
// Match the host parser's Unicode whitespace and splitlines rules, not JS \s.
const sourceSpaces = /[\t-\r\x1C-\x20\x85\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/u;
const sourceLines = /\r\n|[\n\r\v\f\x1C-\x1E\x85\u2028\u2029]/u;
const checkBytes = bytes => {
  if (!(Array.isArray(bytes) || bytes instanceof Uint8Array) || bytes.length > 4096 || !Array.from(bytes).every(isByte)) throw new Error('Expected at most 4,096 byte values.');
};

export class SourceDiagnosticError extends Error {
  constructor(message, code, line = null, tokenIndex = null) {
    super(message);
    this.name = 'SourceDiagnosticError';
    this.code = code;
    this.line = line;
    this.tokenIndex = tokenIndex;
  }
}

function parseBytes(source, maxBytes, hexadecimal) {
  const name=hexadecimal?'Hexadecimal':'Binary';
  if (typeof source !== 'string' || source.length > 65536) throw new SourceDiagnosticError(`${name} source must be text under 64 KiB.`, typeof source !== 'string' ? 'SOURCE_TYPE' : 'SOURCE_TOO_LONG');
  if (!Number.isInteger(maxBytes) || maxBytes < 1 || maxBytes > 4096) throw new SourceDiagnosticError('Invalid byte limit.', 'INVALID_LIMIT');
  const bytes = [];
  for (const [index, line] of source.replace(/^\uFEFF/, '').split(sourceLines).entries()) {
    for (const [tokenIndex, token] of line.split('#', 1)[0].split(sourceSpaces).filter(Boolean).entries()) {
      if (!(hexadecimal?/^[0-9a-f]{2}$/i:/^[01]{8}$/).test(token)) throw new SourceDiagnosticError(`Line ${index + 1}: expected ${hexadecimal?'a two-digit hexadecimal token':'an eight-bit binary token'}, received ${token.slice(0, 32)}.`, 'INVALID_TOKEN', index + 1, tokenIndex + 1);
      bytes.push(Number.parseInt(token, hexadecimal?16:2));
      if (bytes.length > maxBytes) throw new SourceDiagnosticError(`The ${maxBytes}-byte limit was exceeded.`, 'BYTE_LIMIT', index + 1, tokenIndex + 1);
    }
  }
  if (!bytes.length) throw new SourceDiagnosticError(`The ${name.toLowerCase()} source contains no bytes.`, 'EMPTY_SOURCE');
  return Uint8Array.from(bytes);
}

export function parseBits(source, maxBytes = 512) {return parseBytes(source,maxBytes,false);}
export function parseHex(source, maxBytes = 512) {return parseBytes(source,maxBytes,true);}

export function formatHex(bytes) {
  checkBytes(bytes);
  const lines=[];
  for(let offset=0;offset<bytes.length;offset+=16)lines.push(Array.from(bytes.slice(offset,offset+16),value=>value.toString(16).toUpperCase().padStart(2,'0')).join(' '));
  return lines.join('\n')+'\n';
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
