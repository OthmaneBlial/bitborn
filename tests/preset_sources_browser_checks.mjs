import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {presets} from '../site/cpu-lab/presets.mjs';

export async function checkPresetSources(page) {
  const link=page.locator('#preset-source');
  for(const preset of presets) {
    await page.locator('#preset').selectOption(preset.id);
    assert.equal(await page.locator('#binary-editor').inputValue(),preset.source);
    assert.equal(await link.isVisible(),true);
    const response=await page.request.get(new URL(await link.getAttribute('href'),page.url()).href);
    assert.equal(response.status(),200);
    assert.equal(await response.text(),readFileSync(new URL('../'+preset.sourcePath,import.meta.url),'utf8'));
    assert.equal(await link.getAttribute('download'),preset.sourcePath.split('/').pop());
  }
  await page.locator('#binary-editor').fill('10010000 11110100');await page.locator('#load-program').click();
  assert.equal(await link.isVisible(),false);assert.equal(await link.getAttribute('href'),null);
  await page.locator('#binary-editor').fill(presets[0].source);await page.locator('#load-program').click();
  assert.equal(await link.isVisible(),true,'byte-identical source imports identify the canonical preset');
  const href=await link.getAttribute('href');
  await page.locator('#binary-editor').fill('bad token');await page.locator('#load-program').click();
  assert.equal(await link.getAttribute('href'),href,'invalid drafts retain the source of the loaded program');
  assert.equal(await link.isVisible(),true);
  await page.locator('#preset').selectOption('immediates');
}
