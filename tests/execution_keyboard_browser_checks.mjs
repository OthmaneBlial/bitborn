import assert from 'node:assert/strict';

export async function checkExecutionKeyboard(page) {
  const speed=await page.locator('#speed').inputValue();
  const tabModifier=process.platform==='darwin'&&page.context().browser().browserType().name()==='webkit'?'Alt+':'';
  const focused=()=>page.evaluate(()=>document.activeElement.id);
  const tabTo=async id=>{
    const {key,limit}=await page.evaluate(id=>({
      key:document.getElementById(id).compareDocumentPosition(document.activeElement)&Node.DOCUMENT_POSITION_FOLLOWING?'Shift+Tab':'Tab',
      limit:document.querySelectorAll('a,button,input,select,textarea,summary,[tabindex]').length+1,
    }),id);
    for(let attempt=0;attempt<limit;attempt++) {
      if(await focused()===id)return;
      await page.keyboard.press(tabModifier+key);
    }
    assert.fail(`${id} is unreachable with Tab`);
  };
  const snapshot=(includeChanges=true)=>page.evaluate(includeChanges=>JSON.stringify({steps:document.getElementById('step-count').textContent,
    history:document.getElementById('history-position').textContent,state:document.getElementById('run-state').textContent,
    registers:includeChanges?document.getElementById('registers').textContent:Array.from(document.querySelectorAll('#registers .register-value'),value=>value.textContent),memory:document.getElementById('memory').textContent,
    source:document.getElementById('binary-editor').value,bytes:document.getElementById('byte-count').textContent,
    screen:document.getElementById('screen-output').textContent,serial:document.getElementById('serial-output').textContent}),includeChanges);
  try {
    await page.locator('#preset').selectOption('immediates');
    assert.equal(await page.locator('#execution-shortcuts').isChecked(),true);
    assert.equal(await page.locator('#status').getAttribute('role'),'status');
    assert.equal(await page.locator('#status').getAttribute('aria-atomic'),'true');
    await page.locator('#step').click();const recorded=await snapshot();
    await page.locator('#execution-shortcuts').focus();await page.keyboard.press('Space');
    assert.equal(await page.locator('#execution-shortcuts').isChecked(),false);
    assert.equal(await snapshot(),recorded,'disabling shortcuts preserves loaded state and recorded history');
    await page.locator('#lab-title').click();
    for(const key of ['s','r','b','f','Space'])await page.keyboard.press(key);
    assert.equal(await snapshot(),recorded,'all disabled execution shortcuts preserve state');
    await page.locator('#back').focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('#step-count').textContent(),'0000','native control activation remains available');
    await page.locator('#forward').focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('#step-count').textContent(),'0001');
    await page.locator('#execution-shortcuts').check();await page.locator('#reset').click();await page.locator('#lab-title').click();
    for(const extra of [{repeat:true},{isComposing:true},{ctrlKey:true},{altKey:true},{metaKey:true},{cancel:true}]) {
      await page.evaluate(extra=>{const event=new KeyboardEvent('keydown',{key:'s',code:'KeyS',bubbles:true,cancelable:true,...extra});if(extra.cancel)event.preventDefault();document.body.dispatchEvent(event);},extra);
      assert.equal(await page.locator('#step-count').textContent(),'0000','repeat, composition, modifiers and consumed events are ignored');
    }
    await page.locator('#step').click();await page.locator('#binary-editor').focus();
    for(const key of ['s','r']) {await page.keyboard.press(key);assert.equal(await page.locator('#step-count').textContent(),'0001','typing in a source editor never executes or resets');}
    await page.evaluate(()=>{const editor=document.createElement('div');editor.id='keyboard-test-editable';editor.contentEditable='true';editor.textContent='Editable text';document.body.append(editor);editor.focus();});
    for(const key of ['s','r']) {await page.keyboard.press(key);assert.equal(await page.locator('#step-count').textContent(),'0001','contenteditable text does not trigger shortcuts');}
    await page.locator('#keyboard-test-editable').evaluate(element=>element.remove());
    await page.locator('#preset').selectOption('immediates');await page.locator('#lab-title').click();await page.keyboard.press('s');
    assert.equal(await page.locator('#step-count').textContent(),'0001');assert.match(await page.locator('#status').textContent(),/^Step 1: MOV AX, 42 executed\. Next 0000:7C03\./);
    await page.keyboard.press('b');assert.equal(await page.locator('#step-count').textContent(),'0000');
    await page.keyboard.press('f');assert.equal(await page.locator('#step-count').textContent(),'0001');
    await page.keyboard.press('r');assert.equal(await page.locator('#step-count').textContent(),'0000');
    await page.locator('#speed').evaluate(input=>{input.value='1';input.dispatchEvent(new Event('input',{bubbles:true}));});
    await page.locator('#lab-title').click();await page.keyboard.press('Space');
    const running=await page.locator('#status').textContent();assert.match(running,/^Running supported/);
    await page.waitForFunction(()=>document.getElementById('step-count').textContent==='0002');
    assert.equal(await page.locator('#status').textContent(),running,'running ticks do not flood the live status with per-instruction messages');
    await page.keyboard.press('Space');assert.match(await page.locator('#status').textContent(),/^Paused at/);
    await page.locator('#step').click();await page.locator('#step').click();assert.match(await page.locator('#status').textContent(),/HLT reached after 4 steps/);
    const last=await snapshot(false);
    await tabTo('timeline');await page.keyboard.press('Home');
    assert.equal(await page.locator('#step-count').textContent(),'0000');
    assert.equal(await focused(),'timeline','restoring a state keeps timeline focus');
    assert.match(await page.locator('#timeline').getAttribute('aria-valuetext'),/^Recorded state 0 of 4/);
    await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#step-count').textContent(),'0001');
    await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#step-count').textContent(),'0000');
    await page.keyboard.press('End');assert.equal(await snapshot(false),last,'keyboard replay restores the recorded final state');
    await tabTo('reset');await page.keyboard.press('Enter');
    assert.equal(await page.locator('#timeline').isDisabled(),true);
    await tabTo('step');await page.keyboard.press('Enter');
    assert.equal(await page.locator('#step-count').textContent(),'0001');
    await page.keyboard.press(tabModifier+'Tab');assert.equal(await focused(),'back');await page.keyboard.press('Enter');
    assert.equal(await page.locator('#step-count').textContent(),'0000');
    await tabTo('forward');await page.keyboard.press('Enter');
    assert.equal(await page.locator('#step-count').textContent(),'0001');
    const registers=await page.locator('#registers').textContent(),history=await page.locator('#history-position').textContent();
    await tabTo('binary-editor');await page.keyboard.press('ControlOrMeta+A');await page.keyboard.type('badtoken');
    await tabTo('load-program');await page.keyboard.press('Enter');
    assert.equal(await focused(),'binary-editor','keyboard submission returns focus to the invalid source');
    assert.equal(await page.locator('#binary-editor').getAttribute('aria-invalid'),'true');
    assert.equal(await page.locator('#binary-editor').evaluate(input=>input.value.slice(input.selectionStart,input.selectionEnd)),'badtoken');
    assert.equal(await page.locator('#registers').textContent(),registers);
    assert.equal(await page.locator('#history-position').textContent(),history);
    await tabTo('import-program');
    assert.ok(await page.locator('#import-program').evaluate(input=>input.labels.length),'file import has an accessible label');
    assert.equal(await page.locator('#import-program').evaluate(input=>getComputedStyle(input.closest('label')).outlineStyle),'solid','the transparent file control has a visible label focus ring');
    // File selection is supplied by Playwright; the native OS picker is outside this browser regression.
    await page.locator('#import-program').setInputFiles({name:'keyboard.bin',mimeType:'application/octet-stream',buffer:Buffer.from([0xB8,0x2A,0,0xF4])});
    await page.waitForFunction(()=>document.getElementById('byte-count').textContent==='4 BYTES');
    assert.equal(await page.locator('#binary-editor').getAttribute('aria-invalid'),null);
    assert.equal(await page.locator('#step-count').textContent(),'0000');
    await tabTo('step');await page.keyboard.press('Enter');
    assert.match(await page.locator('#status').textContent(),/MOV AX, 42 executed/);
  } finally {
    await page.locator('#pause').evaluate(button=>{if(!button.disabled)button.click();});
    await page.locator('#keyboard-test-editable').evaluateAll(elements=>elements.forEach(element=>element.remove()));
    await page.locator('#execution-shortcuts').check();await page.locator('#preset').selectOption('immediates');
    await page.locator('#speed').evaluate((input,value)=>{input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));},speed);
  }
}
