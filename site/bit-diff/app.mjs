import {comparePrograms} from '../bit-diff.mjs';
import {parseBits,parseHex,formatBits,formatHex} from '../binary.mjs';
import {encodingExamples} from '../encoding-presets.mjs';
const $=id=>document.getElementById(id),hex=value=>value===null?'—':value.toString(16).toUpperCase().padStart(2,'0');
const node=(tag,text,className)=>{const element=document.createElement(tag);if(text!==undefined)element.textContent=text;if(className)element.className=className;return element;};
const pairs={direction:{before:'movRegister',after:'movRegisterReverse',mode:16},signed:{before:'movMemoryBP',after:'movMemoryPositive',mode:16},immediate:{before:'mov32',after:'mov32Next',mode:32}};
let format='binary',result=null,selected=null,sources=[null,null];
const read=text=>(format==='binary'?parseBits:parseHex)(text,512);
const print=bytes=>(format==='binary'?formatBits:formatHex)(bytes);
function sourceLinks() {
  for(const [index,id] of ['before-source','after-source'].entries()){$(id).hidden=!sources[index];if(sources[index])$(id).href='../reference/'+sources[index];}
}
function describe(side,length) {
  const decoded=side.instructions.length,first=decoded?side.instructions[0].mnemonic:'No instruction classified';
  return `${length} bytes · ${decoded} linearly inspected instructions. First: ${first}. ${side.error?`Stopped at offset ${side.error.offset}: ${side.error.message} Remaining bytes are unclassified.`:'Inspection reached the end; this does not establish that the bytes are code or safe to execute.'}`;
}
function choose(row) {
  selected=row.offset;
  for(const button of $('diff-rows').children)if(button.tagName==='BUTTON'){const active=Number(button.dataset.offset)===selected;button.tabIndex=active?0:-1;button.setAttribute('aria-pressed',String(active));}
  $('selected-offset').textContent=`BYTE ${row.offset} / 0x${row.offset.toString(16).toUpperCase().padStart(3,'0')} / ${row.kind.toUpperCase()}`;
  for(const [id,value] of [['bit-before',row.before],['bit-after',row.after]]) {
    const cells=[];
    for(let bit=7;bit>=0;bit--){const digit=value===null?'—':String((value>>bit)&1),cell=node('span',digit,`bit-value${row.bits.some(item=>item.bit===bit)?' changed':''}${value===null?' missing':''}`);cell.setAttribute('aria-label',`Bit ${bit}: ${value===null?'missing byte':digit}`);cells.push(cell);}
    $(id).setAttribute('aria-label',`${id==='bit-before'?'Before':'After'}: ${value===null?'missing byte':'binary '+value.toString(2).padStart(8,'0')}`);$(id).replaceChildren(...cells);
  }
  const roles=(row.kind==='reinterpreted'?row.roleChanges:row.bits).map(bit=>{
    const block=node('div',undefined,'bit-role');block.append(node('strong',`BIT ${bit.bit} · ${bit.before===null?'missing':bit.before} → ${bit.after===null?'missing':bit.after}`),node('p',`${bit.beforeRole} → ${bit.afterRole}`));return block;
  });
  if(row.kind==='reinterpreted')roles.unshift(node('p','This byte is unchanged. Its instruction boundary, operand width or field roles changed.','scope-note'));
  for(const [label,instruction] of [['Before',row.beforeInstruction],['After',row.afterInstruction]])roles.push(node('p',`${label}: ${instruction?`${instruction.mnemonic}, instruction bytes ${instruction.start}–${instruction.end-1}, field ${instruction.field}`:'byte unclassified or missing'}`,'scope-note'));
  $('bit-roles').replaceChildren(...roles);
}
function update() {
  try {
    const before=read($('diff-before').value),after=read($('diff-after').value),next=comparePrograms(before,after,Number($('diff-mode').value));
    result=next;
    for(const [key,id] of [['modified','modified-count'],['flippedBits','flipped-count'],['added','added-count'],['removed','removed-count'],['reinterpreted','reinterpreted-count']])$(id).textContent=String(result.totals[key]);
    $('before-classification').textContent=describe(result.before,result.beforeLength);$('after-classification').textContent=describe(result.after,result.afterLength);
    const chosen=result.rows.find(row=>row.offset===selected)||result.rows[0];
    const rows=result.rows.map((row,index)=>{
      const button=node('button',undefined,'offset-row');button.type='button';button.dataset.offset=row.offset;button.tabIndex=chosen===row?0:-1;button.setAttribute('aria-pressed',String(chosen===row));
      button.setAttribute('aria-label',`Offset ${row.offset}, ${row.kind}, before ${hex(row.before)}, after ${hex(row.after)}${row.kind==='modified'?`, ${row.bits.length} flipped bits`:''}`);
      button.append(node('span','0x'+row.offset.toString(16).toUpperCase().padStart(3,'0')),node('span',hex(row.before)),node('span',hex(row.after),'after-value'),node('span',row.kind==='modified'?String(row.bits.length):row.kind==='added'?'+':row.kind==='removed'?'−':'ROLE'));
      button.addEventListener('click',()=>choose(row));
      button.addEventListener('keydown',event=>{
        const target=event.key==='Home'?0:event.key==='End'?result.rows.length-1:event.key==='ArrowDown'?Math.min(index+1,result.rows.length-1):event.key==='ArrowUp'?Math.max(0,index-1):null;
        if(target===null)return;event.preventDefault();const next=$('diff-rows').children[target];next.click();next.focus();
      });return button;
    });
    $('diff-rows').replaceChildren(...rows);
    if(chosen)choose(chosen);else{selected=null;$('diff-rows').append(node('p','No byte differences.','scope-note'));$('selected-offset').textContent='IDENTICAL BYTES';for(const id of ['bit-before','bit-after']){$(id).replaceChildren();$(id).setAttribute('aria-label','No difference selected');}$('bit-roles').replaceChildren(node('p','Both inputs contain the same bytes.','scope-note'));}
    $('diff-status').classList.remove('error');$('diff-status').textContent=`${result.beforeLength} → ${result.afterLength} bytes, ${result.mode}-bit context. Exact positional comparison; no code was executed.`;
  }catch(error){$('diff-status').classList.add('error');$('diff-status').textContent=`${error.message}${result?` Last valid ${result.mode}-bit comparison is kept.`:''}`;}
}
function loadPair() {
  const pair=pairs[$('diff-example').value];sources=[encodingExamples[pair.before].source,encodingExamples[pair.after].source];
  $('diff-mode').value=String(pair.mode);$('diff-before').value=print(encodingExamples[pair.before].bytes);$('diff-after').value=print(encodingExamples[pair.after].bytes);selected=null;sourceLinks();update();
}
for(const [index,id] of ['diff-before','diff-after'].entries())$(id).addEventListener('input',()=>{sources[index]=null;sourceLinks();update();});
$('diff-example').addEventListener('change',loadPair);$('diff-mode').addEventListener('change',update);
$('diff-format').addEventListener('change',()=>{
  try{const before=read($('diff-before').value),after=read($('diff-after').value);format=$('diff-format').value;$('diff-before').value=print(before);$('diff-after').value=print(after);update();}
  catch(error){$('diff-format').value=format;$('diff-status').classList.add('error');$('diff-status').textContent=`${error.message} Notation and last valid comparison are kept.`;}
});
$('diff-swap').addEventListener('click',()=>{const before=$('diff-before').value;$('diff-before').value=$('diff-after').value;$('diff-after').value=before;sources.reverse();sourceLinks();update();});
loadPair();
