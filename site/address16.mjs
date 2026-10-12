const bases=[['BX','SI'],['BX','DI'],['BP','SI'],['BP','DI'],['SI'],['DI'],['BP'],['BX']];

export function decodeAddress16(bytes,index=1) {
  if(!(Array.isArray(bytes)||bytes instanceof Uint8Array)||!Number.isInteger(index)||index<0||index>=bytes.length)throw new Error('Invalid memory ModR/M offset.');
  const modrm=bytes[index];
  if(!Number.isInteger(modrm)||modrm<0||modrm>=0xC0)throw new Error('Expected a valid memory ModR/M byte.');
  const mod=modrm>>6,rm=modrm&7,absolute=mod===0&&rm===6;
  const selected=absolute?[]:bases[rm].slice(),count=absolute||mod===2?2:mod===1?1:0;
  if(bytes.length<index+1+count)throw new Error('Truncated MOV: address displacement bytes are missing.');
  for(let part=1;part<=count;part++)if(!Number.isInteger(bytes[index+part])||bytes[index+part]<0||bytes[index+part]>255)throw new Error('Invalid address displacement byte.');
  let displacement=count?bytes[index+1]|(count===2?bytes[index+2]<<8:0):0;
  if(!absolute&&count&&displacement>=(count===1?128:32768))displacement-=count===1?256:65536;
  const expression=absolute?String(displacement):selected.join('+')+(count?(displacement<0?String(displacement):'+'+displacement):'');
  return {segment:selected.includes('BP')?'SS':'DS',bases:selected,displacement,absolute,addressBits:16,displacementBytes:count,expression};
}
