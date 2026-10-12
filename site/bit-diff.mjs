import {inspectEncoding} from './encoding.mjs';

function classify(bytes,mode) {
  const map=Array(bytes.length).fill(null),instructions=[];let offset=0,error=null;
  while(offset<bytes.length) {
    try {
      const decoded=inspectEncoding(bytes.subarray(offset,offset+64),mode);
      for(let index=0;index<decoded.size;index++)map[offset+index]={start:offset,end:offset+decoded.size,width:decoded.width,mnemonic:decoded.mnemonic,field:decoded.fields[index],bits:decoded.bitFields[index]};
      instructions.push({start:offset,end:offset+decoded.size,mnemonic:decoded.mnemonic});offset+=decoded.size;
    }catch(problem){error={offset,message:problem.message};break;}
  }
  return {map,instructions,error};
}

export function comparePrograms(before,after,mode=16) {
  if(![16,32,64].includes(mode))throw new Error('Choose an explicit 16-, 32- or 64-bit context.');
  for(const bytes of [before,after])if(!(bytes instanceof Uint8Array)||bytes.length<1||bytes.length>512)throw new Error('Each comparison requires 1–512 literal bytes.');
  const left=classify(before,mode),right=classify(after,mode),rows=[];
  const totals={modified:0,added:0,removed:0,flippedBits:0,reinterpreted:0};
  const signature=role=>role?JSON.stringify([role.start,role.end,role.width,role.field,role.bits]):null;
  for(let offset=0;offset<Math.max(before.length,after.length);offset++) {
    const a=offset<before.length?before[offset]:null,b=offset<after.length?after[offset]:null;
    const oldRole=left.map[offset],newRole=right.map[offset];
    const reinterpreted=a===b&&signature(oldRole)!==signature(newRole);
    if(a===b&&!reinterpreted)continue;
    const kind=reinterpreted?'reinterpreted':a===null?'added':b===null?'removed':'modified',bits=[],roleChanges=[];
    for(let bit=7;bit>=0;bit--) {
      const old=a===null?null:(a>>bit)&1,next=b===null?null:(b>>bit)&1;
      if(old!==next)bits.push({bit,before:old,after:next,beforeRole:left.map[offset]?.bits[bit]||'Unclassified byte',afterRole:right.map[offset]?.bits[bit]||'Unclassified byte'});
      if(oldRole?.bits[bit]!==newRole?.bits[bit])roleChanges.push({bit,before:old,after:next,beforeRole:oldRole?.bits[bit]||'Unclassified byte',afterRole:newRole?.bits[bit]||'Unclassified byte'});
    }
    totals[kind]++;if(kind==='modified')totals.flippedBits+=bits.length;
    rows.push({offset,before:a,after:b,kind,bits,roleChanges,beforeInstruction:oldRole,afterInstruction:newRole});
  }
  return {mode,beforeLength:before.length,afterLength:after.length,totals,rows,before:left,after:right};
}
