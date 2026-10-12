import {parseHex} from './binary.mjs';
const prefix='#program=v1.';

export function programFragment(bytes) {
  if(!(bytes instanceof Uint8Array)||bytes.length<1||bytes.length>512)throw new Error('Program links require 1–512 loaded bytes.');
  return prefix+Array.from(bytes,byte=>byte.toString(16).toUpperCase().padStart(2,'0')).join('');
}

export function parseProgramFragment(hash) {
  if(typeof hash!=='string')throw new Error('Program fragment must be text.');
  if(!hash.startsWith('#program='))return null;
  const encoded=hash.slice(prefix.length);
  if(!hash.startsWith(prefix)||encoded.length<2||encoded.length>1024||encoded.length%2||!/^[0-9A-Fa-f]+$/.test(encoded))throw new Error('Invalid program link: expected v1 and 1–512 literal hexadecimal bytes.');
  return parseHex(encoded.match(/../g).join(' '),512);
}
