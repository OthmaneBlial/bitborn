import {decode, hex} from '../simulator.mjs';

export function liveLayout(bytes, annotations) {
  const result = [];
  let spanStart = null, spanEnd = 0;
  function scan() {
    if (spanStart === null) return;
    let offset = spanStart;
    while (offset < spanEnd) {
      try {
        const instruction = decode(bytes, offset);
        let fields = instruction.fields;
        if (['mov16','add','sub','cmp'].includes(instruction.operation)) fields = ['opcode','immediate low byte','immediate high byte'];
        else if (['mov8','testImmediate','outImmediate'].includes(instruction.operation)) fields = ['opcode','immediate byte'];
        else if (instruction.operation === 'interrupt') fields = ['opcode','interrupt vector'];
        else if (instruction.operation === 'farJump') fields = ['opcode','offset low byte','offset high byte','segment low byte','segment high byte'];
        else if (instruction.displacement !== undefined) fields = instruction.size === 2 ? ['opcode','signed displacement'] : ['opcode','displacement low byte','displacement high byte'];
        else if (instruction.operation === 'test') fields = ['opcode','ModR/M'];
        result.push({offset, ...instruction,fields});
        offset += instruction.size;
      } catch (error) {
        result.push({offset, size:spanEnd - offset, error:error.message});
        break;
      }
    }
    spanStart = null;
  }
  for (const annotation of annotations) {
    if (annotation.kind === 'instruction') {
      if (spanStart === null) spanStart = annotation.offset;
      spanEnd = annotation.offset + annotation.size;
    } else scan();
  }
  scan();
  return result;
}

export function byteDetails(bytes, annotations, layout, offset) {
  const original = annotations.find(item => offset >= item.offset && offset < item.offset + item.size);
  const live = layout.find(item => offset >= item.offset && offset < item.offset + item.size);
  const character = bytes[offset] >= 32 && bytes[offset] <= 126 ? `ASCII “${String.fromCharCode(bytes[offset])}”` : ({0:'NUL / string terminator',10:'LF / line feed',13:'CR / carriage return'}[bytes[offset]] || 'non-printing byte');
  if (live?.error) return {original,live,role:offset === live.offset ? 'unsupported opcode' : 'boundary unresolved',mnemonic:'Outside this simulator',explanation:offset === live.offset ? live.error : `Live decoding stopped at 0x${hex(live.offset,3)}. Later instruction boundaries are unresolved; the original annotation is shown separately.`};
  if (live) {
    const role = live.fields[offset - live.offset] || 'operand';
    let explanation = live.explanation;
    if (['mov16','add','sub','cmp'].includes(live.operation)) explanation += ` The bytes ${hex(bytes[live.offset + 1])} ${hex(bytes[live.offset + 2])} represent 0x${hex(live.value,4)} (${live.value} decimal).`;
    else if (live.operation === 'mov8') explanation += ` The immediate is 0x${hex(live.value)} (${live.value} decimal).`;
    if (live.displacement !== undefined) {
      const next = live.offset + live.size, target = next + live.displacement;
      const origin = annotations.find(item => target >= item.offset && target < item.offset + item.size);
      explanation += ` Next address 0x${hex(0x7C00 + next,4)} ${live.displacement < 0 ? '−' : '+'} ${Math.abs(live.displacement)} = 0x${hex((0x7C00 + target) & 0xFFFF,4)}.`;
      explanation += target < 0 || target >= bytes.length ? ' This target is outside the loaded sector.' : ` Target byte ${target} was originally ${origin?.kind || 'unclassified'}${origin?.kind === 'instruction' && origin.offset !== target ? ', inside an instruction rather than at its boundary' : ''}.`;
    }
    return {original,live,role,mnemonic:live.mnemonic,explanation};
  }
  if (original?.kind === 'signature') return {original,role:'BIOS signature',mnemonic:`${hex(bytes[510])} ${hex(bytes[511])} / BIOS marker`,explanation:'Offsets 510–511 hold the firmware marker. On disk the required bytes are 55 AA; as a little-endian word they are 0xAA55. This is a format marker, not proof that the code boots.'};
  if (original?.kind === 'data') return {original,role:'original data',mnemonic:character,explanation:`Current value: ${bytes[offset]} decimal. The baseline output loop reads the message data with LODSB. A changed printable byte can change a character; a zero byte terminates that string early. An edited branch may interpret this byte as code instead.`};
  return {original,role:'original padding',mnemonic:`0x${hex(bytes[offset])} / ${character}`,explanation:'This byte was originally padding rather than part of the program’s intended instruction path, but an edited jump can reach it. A nonzero padding byte alone does not change the BIOS signature.'};
}
