import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {rgba,composite,contrast} from './contrast.mjs';

export async function checkIndicators(page) {
  const viewport=page.viewportSize(),source=readFileSync(new URL('../examples/self-modifying/program.bits',import.meta.url),'utf8');
  let minimum=21,samples=0;
  async function inspect(label) {
    const items=await page.evaluate(()=>{
      const selectors='.register-value,.register-bits span,.register-change,.flag,.flag strong,.stack-byte,.memory-byte';
      return [...document.querySelectorAll(selectors)].flatMap(element=>{
        const rect=element.getBoundingClientRect();if(!rect.width||!rect.height)return [];
        const style=getComputedStyle(element),backgrounds=[];
        for(let current=element;current;current=current.parentElement) {
          const computed=getComputedStyle(current);
          if(computed.backgroundImage!=='none'||Number(computed.opacity)!==1)throw new Error('Indicator contrast scope requires flat backgrounds and full opacity.');
          backgrounds.push(computed.backgroundColor);
        }
        const container=element.closest('.register,.flag,.stack-word,.memory-grid').getBoundingClientRect();
        return [{name:element.className||element.parentElement.className,text:element.textContent,color:style.color,backgrounds,
          fontSize:parseFloat(style.fontSize),hasFontFloor:element.matches('.register-bits span,.flag,.flag strong'),underline:style.textDecorationLine.includes('underline'),changed:element.classList.contains('changed-bit')||element.matches('.flag.changed strong'),
          bounds:[rect.left,rect.right,container.left,container.right],fits:rect.left>=container.left-1&&rect.right<=container.right+1}];
      });
    });
    assert.ok(items.length>250,`${label}: actual visible indicator samples`);
    for(const item of items) {
      const backgrounds=item.backgrounds.map(rgba);assert.ok(backgrounds.some(color=>color[3]===1),'an explicit opaque backing exists');
      let background=[255,255,255];for(const color of backgrounds.reverse())background=composite(color,background);
      const ratio=contrast(composite(rgba(item.color),background),background);
      assert.ok(ratio>=4.5,`${label} ${item.name} ${item.text.trim()}: ${ratio.toFixed(3)} contrast`);
      assert.ok(item.fits,`${label} ${item.name} ${item.text.trim()}: bounds ${item.bounds} fit its container`);
      if(item.hasFontFloor)assert.ok(item.fontSize>=9,`${label}: bit and flag labels use the project's 9px minimum`);
      if(item.changed)assert.equal(item.underline,true,`${label}: changes have a non-color underline cue`);
      minimum=Math.min(minimum,ratio);samples++;
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${label}: no page overflow`);
  }
  try {
    for(const width of [1440,768,390,320]) {
      await page.setViewportSize({width,height:1000});await page.locator('#preset').selectOption('flags');
      await inspect(`${width}px initial`);
      await page.locator('#step').click();await inspect(`${width}px changed register`);
      await page.locator('#step').click();
      assert.equal(await page.locator('[data-flag="CF"] strong').textContent(),'1');assert.equal(await page.locator('[data-flag="ZF"] strong').textContent(),'1');
      assert.match(await page.locator('[data-flag="CF"]').getAttribute('aria-label'),/changed from 0/);
      await inspect(`${width}px carry/zero`);
      if(width===768)await page.locator('.machine-layout').screenshot({path:fileURLToPath(new URL('../build/cpu-indicators-768.png',import.meta.url))});
      await page.locator('#step').click();assert.equal(await page.locator('[data-flag="CF"] strong').textContent(),'1');await inspect(`${width}px preserved carry`);
      await page.locator('#preset').selectOption('stack');await page.locator('#step').click();await page.locator('#step').click();await inspect(`${width}px stack bytes`);
      await page.locator('#preset').selectOption('memory');await page.locator('#memory-address').fill('00120');await page.locator('#memory-form').evaluate(form=>form.requestSubmit());
      for(let count=0;count<5;count++)await page.locator('#step').click();await inspect(`${width}px changed memory`);
      await page.locator('#binary-editor').fill(source);await page.locator('#load-program').click();
      for(let count=0;count<10&&await page.locator('[data-flag="AF"] strong').textContent()!=='?';count++)await page.locator('#step').click();
      assert.equal(await page.locator('[data-flag="AF"] strong').textContent(),'?');assert.match(await page.locator('[data-flag="AF"]').getAttribute('aria-label'),/undefined/);
      await inspect(`${width}px undefined AF`);
      for(let count=0;count<48&&await page.locator('#run-state').textContent()!=='HALTED';count++)await page.locator('#step').click();
      assert.equal(await page.locator('#run-state').textContent(),'HALTED','curated timeline fixture reaches its halt independently of the speed slider');
      for(const position of [0,29])await page.locator('#timeline').evaluate((input,value)=>{input.value=String(value);input.dispatchEvent(new Event('input',{bubbles:true}));},position);
      assert.equal(await page.locator('.memory-byte.current-byte.changed-bit').count(),1,'a changed code operand is also the current instruction byte');
      await inspect(`${width}px timeline overlap`);
    }
  } finally {await page.locator('#preset').selectOption('immediates');if(viewport)await page.setViewportSize(viewport);}
  console.log(`Indicator contrast: ${samples} computed samples; minimum ${minimum.toFixed(3)}:1 across four widths and eight states. Scope excludes animations, gradients, printers and live assistive technology.`);
}
