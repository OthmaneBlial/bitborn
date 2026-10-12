import {inspectELF,ELF_LIMIT} from '../elf.mjs';
import {hex,binary} from '../simulator.mjs';
const $=id=>document.getElementById(id);
const node=(tag,text,className)=>{const element=document.createElement(tag);if(text!==undefined)element.textContent=text;if(className)element.className=className;return element;};
let bytes,model,selected=null,start=0,revision=0;
const address=value=>`0x${hex(value,8)}`;
function byteWindow() {
  const end=Math.min(start+256,bytes.length),cells=[];
  for(let offset=start;offset<end;offset++) {
    const cell=node('button',hex(bytes[offset]),`elf-byte${offset<64||model.fields.some(field=>field.name.startsWith('PH')&&offset>=field.offset&&offset<field.offset+field.size)?' header':''}${selected&&offset>=selected.offset&&offset<selected.offset+selected.size?' selected':''}${offset===model.entryOffset?' entry':''}`);
    cell.type='button';cell.dataset.fileOffset=offset;cell.tabIndex=offset===(selected?Math.max(start,Math.min(end-1,selected.offset)):start)?0:-1;cell.setAttribute('aria-label',`File offset ${offset}, hexadecimal ${hex(bytes[offset])}${offset===model.entryOffset?'; declared entry byte':''}`);
    cell.addEventListener('click',()=>{for(const other of $('elf-bytes').children)other.tabIndex=-1;cell.tabIndex=0;$('byte-detail').textContent=`File offset ${offset} (${address(offset)})\nHEX ${hex(bytes[offset])} · BITS ${binary(bytes[offset])} · DEC ${bytes[offset]}`;});
    cell.addEventListener('keydown',event=>{
      const columns=getComputedStyle($('elf-bytes')).gridTemplateColumns.split(' ').length;
      const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-columns,ArrowDown:columns}[event.key];
      const target=event.key==='Home'?start:event.key==='End'?end-1:delta!==undefined?Math.max(start,Math.min(end-1,offset+delta)):null;
      if(target===null)return;event.preventDefault();const next=$('elf-bytes').querySelector(`[data-file-offset="${target}"]`);next.click();next.focus();
    });
    cells.push(cell);
  }
  $('elf-bytes').replaceChildren(...cells);$('byte-range').textContent=`${start}–${end-1} / ${bytes.length}`;
  $('bytes-prev').disabled=start===0;$('bytes-next').disabled=end===bytes.length;
}
function selectField(field) {
  selected=field;start=Math.floor(field.offset/256)*256;
  $('field-detail').textContent=`${field.name}: file bytes ${field.offset}–${field.offset+field.size-1}. ${field.description}`;
  for(const button of $('elf-fields').children)button.setAttribute('aria-pressed',String(button.dataset.field===field.name));
  byteWindow();$('byte-detail').textContent=Array.from(bytes.slice(field.offset,field.offset+field.size),value=>hex(value)).join(' ')+' · little-endian field';
}
function load(data,label,source) {
  const parsed=inspectELF(data); // Validate before replacing the current inspected file.
  bytes=data;model=parsed;selected=null;start=0;
  $('elf-fields').replaceChildren(...model.fields.map(field=>{
    const button=node('button',undefined,'elf-field');button.type='button';button.dataset.field=field.name;button.setAttribute('aria-pressed','false');
    button.append(node('span',field.name),node('strong',address(field.value)));button.addEventListener('click',()=>selectField(field));return button;
  }));
  $('entry-mapping').textContent=`${address(model.entry)} → ${model.entryOffset===null?model.entryState:`file offset ${model.entryOffset} (${address(model.entryOffset)})`}`;
  $('elf-facts').textContent=`${bytes.length} file bytes · 64 ELF header bytes · ${model.phnum} program headers · ${model.shnum} section headers · ${model.type===2?'ET_EXEC':'ET_DYN'}`;
  $('elf-warnings').textContent=model.warnings.join(' ');$('show-entry').disabled=model.entryOffset===null;
  $('elf-source').hidden=!source;if(source)$('elf-source').href='../reference/'+source;
  $('elf-segments').replaceChildren(...model.segments.map(segment=>{
    const block=node('div',undefined,'segment'),permissions=`${segment.flags&4?'R':'-'}${segment.flags&2?'W':'-'}${segment.flags&1?'X':'-'}`;
    const description=segment.type===1?`File ${address(segment.offset)} + ${segment.fileSize} bytes → virtual ${address(segment.vaddr)} + ${segment.memorySize} bytes. Alignment ${address(segment.align)}.`:`Declared fields only: offset ${address(segment.offset)}, virtual ${address(segment.vaddr)}, file size ${segment.fileSize}, memory size ${segment.memorySize}. This entry is not mapped by the viewer.`;
    block.append(node('strong',`PH${segment.index} · ${segment.type===1?'PT_LOAD':'type '+segment.type} · ${permissions}`),node('p',description));return block;
  }));
  $('elf-status').classList.remove('error');$('elf-status').textContent=`${label}: structural inspection complete; no program was executed.`;
  selectField(model.fields.find(field=>field.name==='e_entry'));
}
function failure(error){$('elf-status').classList.add('error');$('elf-status').textContent=`${error.message} Previously inspected file is kept.`;}
$('bytes-prev').addEventListener('click',()=>{start=Math.max(0,start-256);byteWindow();});
$('bytes-next').addEventListener('click',()=>{start+=256;byteWindow();});
$('show-entry').addEventListener('click',()=>{if(model.entryOffset===null)return;selected={offset:model.entryOffset,size:1};for(const button of $('elf-fields').children)button.setAttribute('aria-pressed','false');start=Math.floor(model.entryOffset/256)*256;byteWindow();$('field-detail').textContent=`Declared entry resolves to file byte ${model.entryOffset}; ${model.entryState}.`;const entry=$('elf-bytes').querySelector(`[data-file-offset="${model.entryOffset}"]`);entry.click();entry.focus();});
$('elf-import').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;const request=++revision;
  try{if(file.size>ELF_LIMIT)throw new Error('Imported files must be at most 1 MiB.');const data=new Uint8Array(await file.arrayBuffer());if(request!==revision)return;load(data,file.name,null);$('elf-example').selectedIndex=-1;}
  catch(error){if(request===revision)failure(error);}finally{if(event.target.files[0]===file)event.target.value='';}
});
try {
  const initialRevision=revision;
  const response=await fetch(new URL('catalog.json',import.meta.url));if(!response.ok)throw new Error('Reviewed catalog could not be loaded.');
  const catalog=await response.json();
  if(!Array.isArray(catalog)||!catalog.length||catalog.length>128||catalog.some(item=>!/^[-a-z]+\.elf$/.test(item.file)||!/^examples\/[-a-z]+\/program\.bits$/.test(item.source)||!/^[a-f0-9]{64}$/.test(item.sha256)))throw new Error('Invalid reviewed catalog.');
  $('elf-example').replaceChildren(...catalog.map((item,index)=>{const option=node('option',item.file);option.value=index;return option;}));
  async function reviewed() {
    const request=++revision,item=catalog[Number($('elf-example').value)];
    try {
      const response=await fetch(new URL('../downloads/'+item.file,import.meta.url));if(!response.ok)throw new Error('Reviewed ELF download failed.');
      const data=new Uint8Array(await response.arrayBuffer());if(data.length>ELF_LIMIT)throw new Error('Reviewed ELF exceeds the inspection limit.');
      const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',data)),value=>hex(value).toLowerCase()).join('');
      if(request!==revision)return;if(digest!==item.sha256)throw new Error('Reviewed ELF checksum mismatch.');load(data,item.file,item.source);
    }catch(error){if(request===revision)failure(error);}
  }
  $('elf-example').addEventListener('change',reviewed);$('elf-example').disabled=false;
  if(revision===initialRevision){$('elf-example').value=String(Math.max(0,catalog.findIndex(item=>item.file==='exit-code-small.elf')));await reviewed();}
}catch(error){failure(error);}
