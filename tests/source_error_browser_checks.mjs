import assert from 'node:assert/strict';

export async function checkSourceErrors(page) {
  await page.locator('#preset').selectOption('immediates');await page.locator('#step').click();
  const registers=await page.locator('#registers').textContent(),history=await page.locator('#history-position').textContent(),share=await page.locator('#program-link').inputValue();
  const binary=page.locator('#binary-editor'),hex=page.locator('#hex-editor');
  const focus=()=>page.evaluate(()=>document.activeElement.id);
  const selection=editor=>editor.evaluate(element=>element.value.slice(element.selectionStart,element.selectionEnd));
  const unchanged=async()=>{
    assert.equal(await page.locator('#registers').textContent(),registers);
    assert.equal(await page.locator('#history-position').textContent(),history);
    assert.equal(await page.locator('#program-link').inputValue(),share);
  };
  await binary.fill('# comment 🧪\n00000000\u00A000000000\tbad🧪token # ignored');
  assert.equal(await focus(),'binary-editor','live validation keeps current input focus');
  await page.locator('#load-program').click();
  assert.equal(await focus(),'binary-editor');assert.equal(await selection(binary),'bad🧪token');
  assert.equal(await binary.getAttribute('aria-invalid'),'true');
  assert.match(await page.locator('#editor-status').textContent(),/Line 2/);
  assert.equal(await binary.getAttribute('aria-errormessage'),'editor-status');await unchanged();
  await binary.fill('00000000 '.repeat(512)+'11111111');await page.locator('#load-program').click();
  assert.equal(await selection(binary),'11111111');assert.equal(await focus(),'binary-editor');await unchanged();
  await hex.fill('# emoji 🧪\n00 00 GG # ignored');await page.locator('#load-hex').click();
  assert.equal(await focus(),'hex-editor');assert.equal(await selection(hex),'GG');
  assert.equal(await hex.getAttribute('aria-invalid'),'true');
  assert.equal(await hex.getAttribute('aria-errormessage'),'hex-status');await unchanged();
  await page.locator('#import-program').setInputFiles({name:'invalid-location.bits',mimeType:'text/plain',buffer:Buffer.from('\uFEFF# emoji 🧪\r\n00000000 badtoken','utf8')});
  await page.waitForFunction(()=>document.activeElement.id==='binary-editor'&&document.getElementById('editor-status').textContent.includes('received badtoken'));
  assert.equal(await selection(binary),'badtoken','import ranges use the textarea-normalized newline snapshot');await unchanged();
  await binary.fill('11110100');
  assert.equal(await binary.getAttribute('aria-invalid'),null);assert.equal(await hex.getAttribute('aria-invalid'),null);
  assert.equal(await page.locator('#editor-status').evaluate(element=>element.classList.contains('error')),false,'correcting a draft clears stale error presentation');
  await page.locator('#load-program').click();assert.equal(await binary.getAttribute('aria-invalid'),null);
  await hex.fill('F4');await page.locator('#load-hex').click();assert.equal(await hex.getAttribute('aria-invalid'),null);
  await page.locator('#preset').selectOption('immediates');
}
