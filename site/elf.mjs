// Read-only ELF64 inspection. No imported bytes are loaded or executed as code.
export const ELF_LIMIT=1<<20;
const addressLimit=1n<<64n;

export function inspectELF(bytes) {
  if(!(bytes instanceof Uint8Array)||bytes.length<64||bytes.length>ELF_LIMIT)throw new Error('ELF inspection requires 64 bytes–1 MiB of file data.');
  if(bytes[0]!==0x7F||bytes[1]!==69||bytes[2]!==76||bytes[3]!==70)throw new Error('Missing ELF magic: 7F 45 4C 46.');
  if(bytes[4]!==2||bytes[5]!==1)throw new Error('This inspector supports ELF64 little-endian files only.');
  if(bytes[6]!==1)throw new Error('Unsupported ELF identification version.');
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  const u16=offset=>view.getUint16(offset,true),u32=offset=>view.getUint32(offset,true),u64=offset=>view.getBigUint64(offset,true);
  const fields=[];
  const field=(name,offset,size,value,description)=>{const result={name,offset,size,value,description};fields.push(result);return value;};
  const type=field('e_type',16,2,u16(16),'2: fixed executable; 3: shared object/position-independent container.');
  if(![2,3].includes(type)||u16(18)!==62||u32(20)!==1)throw new Error('Supported scope: version-1 x86-64 ET_EXEC or ET_DYN files.');
  field('e_machine',18,2,62,'62 identifies the x86-64 architecture; it does not execute the file.');
  field('e_version',20,4,1,'Version of the ELF object format.');
  const entry=field('e_entry',24,8,u64(24),'Declared entry virtual address. ET_DYN runtime addresses need a load bias.');
  const phoff=field('e_phoff',32,8,u64(32),'File offset of the program header table.');
  const shoff=field('e_shoff',40,8,u64(40),'File offset of the section header table; zero means absent.');
  field('e_flags',48,4,u32(48),'Processor-specific flags; not interpreted here.');
  const ehsize=field('e_ehsize',52,2,u16(52),'ELF64 header size, 64 bytes.');
  const phsize=field('e_phentsize',54,2,u16(54),'Size of each supported program header, 56 bytes.');
  const phnum=field('e_phnum',56,2,u16(56),'Number of program headers; this viewer is bounded to 128.');
  const shsize=field('e_shentsize',58,2,u16(58),'Section header size; section contents are not decoded.');
  const shnum=field('e_shnum',60,2,u16(60),'Section header count; zero with zero offset means no section table.');
  const shstr=field('e_shstrndx',62,2,u16(62),'Section-name string-table index; not a program entry point.');
  if(ehsize!==64||phnum>128||(phnum&&phsize!==56))throw new Error('Unsupported header sizes or program-header count.');
  const range=(offset,size,label)=>{
    if(offset<0n||size<0n||offset>BigInt(bytes.length)||size>BigInt(bytes.length)-offset)throw new Error(`${label} extends beyond file data.`);
    return Number(offset);
  };
  if(phnum&&phoff<64n)throw new Error('Program header table overlaps the ELF header.');
  const programOffset=phnum?range(phoff,BigInt(phnum)*56n,'Program header table'):null;
  if(shstr===65535||shnum>=0xFF00||(!shnum&&shoff!==0n))throw new Error('Extended section numbering is outside this inspector.');
  if(shnum){if(shsize!==64||shstr>=shnum||shoff<64n)throw new Error('Unsupported section header size, offset or string-table index.');range(shoff,BigInt(shnum)*64n,'Section header table');}
  else if(shstr!==0)throw new Error('Section-name index has no section table.');
  const segments=[],warnings=[];
  let lastLoad=-1n;
  for(let index=0;index<phnum;index++) {
    const start=programOffset+index*56,prefix=`PH${index}.`;
    const get=(name,relative,size,description)=>field(prefix+name,start+relative,size,size===4?u32(start+relative):u64(start+relative),description);
    const segment={index,headerOffset:start,type:get('p_type',0,4,'1 is PT_LOAD: a file-to-memory mapping.'),flags:get('p_flags',4,4,'R=4, W=2, X=1. Other bits are preserved, not interpreted.'),
      offset:get('p_offset',8,8,'Beginning of segment bytes in the file.'),vaddr:get('p_vaddr',16,8,'Declared beginning of the virtual memory segment.'),
      paddr:get('p_paddr',24,8,'Physical-address member; application loaders do not use it as an entry address.'),
      fileSize:get('p_filesz',32,8,'Bytes supplied by the file.'),memorySize:get('p_memsz',40,8,'Memory extent; extra PT_LOAD bytes are zero-filled.'),
      align:get('p_align',48,8,'0/1: no alignment constraint; otherwise a power of two with congruent file/virtual offsets.')};
    if(segment.type===1) {
      range(segment.offset,segment.fileSize,`PT_LOAD ${index}`);
      if(segment.fileSize>segment.memorySize)throw new Error('PT_LOAD file size exceeds its memory size.');
      if(segment.vaddr+segment.memorySize>addressLimit)throw new Error('PT_LOAD virtual range overflows 64 bits.');
      if(segment.align>1n&&((segment.align&(segment.align-1n))!==0n||segment.offset%segment.align!==segment.vaddr%segment.align))throw new Error('PT_LOAD alignment is invalid or file/virtual offsets are not congruent.');
      if(segment.vaddr<lastLoad)throw new Error('PT_LOAD entries must be ordered by virtual address.');
      lastLoad=segment.vaddr;
      if((segment.flags&3)===3)warnings.push(`PT_LOAD ${index} requests write and execute permissions.`);
    }
    segments.push(segment);
  }
  const mappings=entry===0n?[]:segments.filter(segment=>segment.type===1&&entry>=segment.vaddr&&entry<segment.vaddr+segment.memorySize);
  let entryOffset=null,entryState=entry===0n?'no entry declared':'unmapped';
  if(mappings.length===1) {
    const segment=mappings[0],relative=entry-segment.vaddr;
    if(relative<segment.fileSize){entryOffset=Number(segment.offset+relative);entryState=segment.flags&1?'file-backed executable':'file-backed non-executable';}
    else entryState='zero-filled memory; no file byte';
  } else if(mappings.length>1)entryState='ambiguous overlapping mappings';
  if(entryState!=='file-backed executable')warnings.push(`Entry: ${entryState}.`);
  if(type===3)warnings.push('ET_DYN addresses are declared values; runtime load bias and relocations are not modeled.');
  if(segments.some(segment=>segment.type===2||segment.type===3))warnings.push('Dynamic linking/interpreter segments are listed, not resolved.');
  return {type,entry,phoff,shoff,phnum,shnum,fields,segments,entryOffset,entryState,warnings};
}
