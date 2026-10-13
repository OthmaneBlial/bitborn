import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {formatBits} from '../site/binary.mjs';

export async function checkOptimizationChallenges(page,base) {
  const catalog=JSON.parse(readFileSync(new URL('../site/challenges/catalog.json',import.meta.url),'utf8'));
  for(const width of [1440,320]) {
    await page.setViewportSize({width,height:844});
    for(const challenge of catalog.filter(item=>item.optimization)) {
      await page.goto(new URL(`challenges/?id=${challenge.id}`,base).href);
      await page.locator('#challenge-app').waitFor({state:'visible'});
      assert.match(await page.locator('#edit-budget').textContent(),new RegExp(`${challenge.startBytes.length} starting bytes.*${challenge.optimization.maxBytes} payload bytes.*7 bytes locked`));
      assert.match(await page.locator('#source-limit').textContent(),/rewrite or shorten/);
      await page.locator('#validate').click();
      assert.match(await page.locator('.goal-checks .fail').textContent(),/payload bytes/,'the starting program reaches the value goals but exceeds its byte budget');
      for(const [text,bytes] of [[challenge.solutionText,challenge.solutionBytes],...challenge.alternatives.map(item=>[item.text,item.bytes])]) {
        await page.locator('#binary-source').fill(text);
        assert.equal(await page.locator('.editable-byte').count(),bytes.length-7,'shortening redraws only the editable tail');
        assert.equal(await page.locator('[data-offset="0"]').count(),0,'setup has no edit buttons');
        await page.locator('#validate').focus();await page.keyboard.press('Enter');
        assert.match(await page.locator('#result').textContent(),new RegExp(`${bytes.length} payload bytes, ${challenge.startBytes.length-bytes.length} fewer`));
        assert.equal(await page.locator('.goal-checks .fail').count(),0);
      }
      const damaged=Uint8Array.from(challenge.solutionBytes);damaged[0]^=1;
      await page.locator('#binary-source').fill(formatBits(damaged));await page.locator('#validate').click();
      assert.match(await page.locator('#result').textContent(),/Keep the first 7 setup bytes/);
      await page.locator('#binary-source').fill(formatBits([...challenge.startBytes.slice(0,7),0xF4]));await page.locator('#validate').click();
      assert.ok(await page.locator('.goal-checks .fail').count()>0,'meeting size alone cannot solve the challenge');
      await page.locator('#reset').click();assert.equal(await page.locator('#binary-source').inputValue(),challenge.startText);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${width}px optimization overflow`);
    }
  }
}
