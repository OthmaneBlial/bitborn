import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {presets} from '../site/cpu-lab/presets.mjs';
import {parseBits} from '../site/binary.mjs';

export async function checkProgramDownloads(page) {
  const expected=parseBits(presets.find(preset=>preset.id==='stack').source);
  await page.locator('#preset').selectOption('stack');
  await page.locator('#step').click();await page.locator('#step').click();
  const snapshot=async()=>JSON.stringify(await page.locator('#registers,#flags,#step-count,#history-position').allTextContents());
  const before=await snapshot();
  await page.locator('#binary-editor').fill('unloaded draft');
  async function download(button,filename) {
    const pending=page.waitForEvent('download');await page.locator(button).click();
    const file=await pending;
    assert.equal(file.suggestedFilename(),filename);
    assert.equal(await file.failure(),null);
    return await readFile(await file.path());
  }
  const source=await download('#export-source','bitborn-program.bits');
  assert.deepEqual(parseBits(source.toString('utf8')),expected,'source export preserves loaded bytes rather than the pending draft');
  const raw=await download('#export-raw','bitborn-program.bin');
  assert.deepEqual(new Uint8Array(raw),expected);assert.equal(await snapshot(),before,'exports preserve model state and history');
  for(const [name,mimeType,buffer] of [['roundtrip.bits','text/plain',source],['roundtrip.BIN','application/octet-stream',raw]]) {
    await page.locator('#import-program').setInputFiles({name,mimeType,buffer});
    await page.waitForFunction(()=>document.getElementById('step-count').textContent==='0000');
    assert.deepEqual(parseBits(await page.locator('#binary-editor').inputValue()),expected);
    for(let index=0;index<8;index++)await page.locator('#step').click();
    assert.equal(await page.locator('#run-state').textContent(),'HALTED');
    assert.equal(await page.locator('[data-register="BX"] .register-value').textContent(),'1234');
  }
  for(const buffer of [Buffer.alloc(0),Buffer.alloc(513,255)]) {
    const stable=await snapshot();
    await page.locator('#import-program').setInputFiles({name:'invalid.bin',mimeType:'application/octet-stream',buffer});
    await page.waitForFunction(()=>document.getElementById('import-program').value==='');
    assert.match(await page.locator('#editor-status').textContent(),/1–512/);
    assert.equal(await snapshot(),stable,'invalid binary size preserves the current program and recorded state');
  }
  await page.locator('#import-program').setInputFiles({name:'boundary.bin',mimeType:'application/octet-stream',buffer:Buffer.from([0xF4,...Array(511).fill(0)])});
  await page.waitForFunction(()=>document.getElementById('byte-count').textContent==='512 BYTES');
  assert.equal(parseBits(await page.locator('#binary-editor').inputValue()).length,512);
  await page.locator('#binary-editor').fill('10110000 11110100 10100010 00000101 01111100 10010000');
  await page.locator('#load-program').click();
  for(let index=0;index<3;index++)await page.locator('#step').click();
  assert.equal(await page.locator('#run-state').textContent(),'HALTED','live instruction fetch observes the self-modified HLT');
  const original=await download('#export-raw','bitborn-program.bin');
  assert.deepEqual([...original],[0xB0,0xF4,0xA2,5,0x7C,0x90],'export retains originally loaded NOP, before self-modification');
  await page.evaluate(()=>{
    window.bitbornOriginalRead=File.prototype.arrayBuffer;
    File.prototype.arrayBuffer=function(){
      if(this.name!=='delayed.bits')return window.bitbornOriginalRead.call(this);
      return new Promise((resolve,reject)=>{window.bitbornReleaseRead=async failure=>failure?reject(new Error('obsolete file read failed')):resolve(await window.bitbornOriginalRead.call(this));});
    };
  });
  await page.locator('#import-program').setInputFiles({name:'delayed.bits',mimeType:'text/plain',buffer:Buffer.from('11110100')});
  await page.waitForFunction(()=>typeof window.bitbornReleaseRead==='function');
  await page.locator('#preset').selectOption('flags');
  await page.evaluate(async()=>{await window.bitbornReleaseRead();await new Promise(resolve=>setTimeout(resolve,0));File.prototype.arrayBuffer=window.bitbornOriginalRead;});
  assert.deepEqual(parseBits(await page.locator('#binary-editor').inputValue()),parseBits(presets.find(preset=>preset.id==='flags').source),'a delayed file read cannot replace a newer source choice');
  for(const failure of [false,true]) {
    await page.evaluate(()=>{
      File.prototype.arrayBuffer=function(){return new Promise((resolve,reject)=>{window.bitbornReleaseRead=async failure=>failure?reject(new Error('obsolete file read failed')):resolve(await window.bitbornOriginalRead.call(this));});};
    });
    await page.locator('#import-program').setInputFiles({name:'delayed.bits',mimeType:'text/plain',buffer:Buffer.from('11110100')});
    await page.locator('#binary-editor').fill('new pending draft');
    await page.evaluate(async failure=>{await window.bitbornReleaseRead(failure);await new Promise(resolve=>setTimeout(resolve,0));File.prototype.arrayBuffer=window.bitbornOriginalRead;},failure);
    assert.equal(await page.locator('#binary-editor').inputValue(),'new pending draft','late reads/errors preserve a newer editor draft');
    assert.doesNotMatch(await page.locator('#editor-status').textContent(),/obsolete file read/);
  }
}
