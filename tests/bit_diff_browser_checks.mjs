import assert from 'node:assert/strict';

export async function checkBitDiff(page,base) {
  await page.goto(new URL('bit-diff/',base).href);
  await page.waitForFunction(()=>document.getElementById('diff-status').textContent.includes('no code was executed'));
  assert.equal(await page.locator('#modified-count').textContent(),'1');assert.equal(await page.locator('#flipped-count').textContent(),'1');
  assert.equal(await page.locator('#reinterpreted-count').textContent(),'1','unchanged ModR/M byte changes field roles');
  assert.equal(await page.locator('.offset-row').count(),2);
  await page.locator('.offset-row').first().focus();await page.keyboard.press('ArrowDown');
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.offset),'1');
  assert.match(await page.locator('#bit-roles').textContent(),/This byte is unchanged/);assert.match(await page.locator('#bit-roles').textContent(),/Destination register → Source register/);
  await page.keyboard.press('Home');assert.equal(await page.evaluate(()=>document.activeElement.dataset.offset),'0');
  assert.equal(await page.locator('.offset-row[tabindex="0"]').count(),1);
  await page.locator('#diff-example').selectOption('selfmod');
  assert.equal(await page.locator('#flipped-count').textContent(),'1');assert.equal(await page.locator('#reinterpreted-count').textContent(),'0');
  assert.equal(await page.locator('.offset-row').count(),1);assert.equal(await page.locator('.offset-row').getAttribute('data-offset'),'50');
  assert.match(await page.locator('#before-classification').textContent(),/80 bytes/);
  assert.equal(await page.locator('#before-source').getAttribute('href'),'../reference/examples/self-modifying/control.bits');
  assert.equal(await page.locator('#after-source').getAttribute('href'),'../reference/examples/self-modifying/program.bits');
  await page.locator('#diff-example').selectOption('signed');
  assert.match(await page.locator('#before-classification').textContent(),/MOV AX, \[BP-2\]/);
  assert.match(await page.locator('#after-classification').textContent(),/MOV AX, \[BP\+126\]/);
  assert.match(await page.locator('#bit-roles').textContent(),/Displacement sign bit/);
  await page.locator('#diff-format').selectOption('hex');assert.equal((await page.locator('#diff-before').inputValue()).trim(),'8B 46 FE');
  await page.locator('#diff-example').selectOption('immediate');assert.equal(await page.locator('#diff-mode').inputValue(),'32');
  assert.match(await page.locator('#before-classification').textContent(),/MOV EAX, 42/);
  await page.locator('#diff-mode').selectOption('16');assert.match(await page.locator('#before-classification').textContent(),/Stopped at offset 3/);
  const stable=await page.locator('#modified-count,#flipped-count,#before-classification,#after-classification').allTextContents();
  await page.locator('#diff-after').fill('<img src=x onerror=alert(1)>');
  assert.match(await page.locator('#diff-status').textContent(),/Last valid 16-bit comparison is kept/);
  assert.deepEqual(await page.locator('#modified-count,#flipped-count,#before-classification,#after-classification').allTextContents(),stable);
  assert.equal(await page.locator('#diff-status img').count(),0);assert.equal(await page.locator('#after-source').isHidden(),true);
  await page.locator('#diff-format').selectOption('binary');assert.equal(await page.locator('#diff-format').inputValue(),'hex','invalid conversion keeps notation and both drafts');
  await page.locator('#diff-before').fill('F4');await page.locator('#diff-after').fill('F4 00');
  assert.equal(await page.locator('#added-count').textContent(),'1');assert.equal(await page.locator('#flipped-count').textContent(),'0');
  assert.match(await page.locator('#bit-roles').textContent(),/missing/);
  await page.locator('#diff-swap').click();assert.equal(await page.locator('#removed-count').textContent(),'1');assert.equal(await page.locator('#added-count').textContent(),'0');
  const maximum=Array(512).fill('90').join(' ');await page.locator('#diff-before').fill(maximum);await page.locator('#diff-after').fill(maximum);
  assert.match(await page.locator('#before-classification').textContent(),/512 linearly inspected instructions/);assert.equal(await page.locator('.offset-row').count(),0);
  await page.locator('#diff-after').fill(maximum+' 90');assert.match(await page.locator('#diff-status').textContent(),/512/);
  await page.locator('#diff-example').selectOption('direction');
  for(const width of [1440,320]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`bit diff fits ${width}px`);}
}
