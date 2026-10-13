// Local Firefox/WebKit coverage complements the detailed Chromium interaction tests.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,stat} from 'node:fs/promises';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {parseBits} from '../site/binary.mjs';
import {checkIntroductions} from './introduction_browser_checks.mjs';
import {checkEncoding} from './encoding_browser_checks.mjs';
import {checkBitKeyboard} from './bit_keyboard_browser_checks.mjs';
import {checkProgramDownloads} from './program_download_checks.mjs';
import {checkHexDrafts} from './hex_browser_checks.mjs';
import {checkProgramLinks} from './program_link_browser_checks.mjs';
import {checkRegisterMOV} from './register_mov_browser_checks.mjs';
import {checkMemoryMOV} from './memory_mov_browser_checks.mjs';
import {checkSignedBranches} from './signed_branches_browser_checks.mjs';
import {checkCarry} from './carry_browser_checks.mjs';
import {checkPresetSources} from './preset_sources_browser_checks.mjs';
import {checkSelfModifying} from './self_modifying_browser_checks.mjs';
import {checkSourceErrors} from './source_error_browser_checks.mjs';
import {checkELF} from './elf_browser_checks.mjs';
import {checkBitDiff} from './bit_diff_browser_checks.mjs';
import {checkPrintLessons} from './print_browser_checks.mjs';
import {checkVGABitmap} from './vga_bitmap_browser_checks.mjs';
import {checkIndicators} from './indicator_browser_checks.mjs';
import {checkExecutionKeyboard} from './execution_keyboard_browser_checks.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),site=resolve(root,'site');
const playwright=await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href : 'playwright');
const engines=(process.env.PLAYWRIGHT_ENGINES || 'firefox,webkit').split(',').map(name=>name.trim()).filter(Boolean);
assert.ok(engines.length>0 && engines.every(name=>['firefox','webkit'].includes(name)),'PLAYWRIGHT_ENGINES must select firefox and/or webkit');
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.gif':'image/gif','.xml':'application/xml','.txt':'text/plain'};
const routes=['','playground/','boot-builder/','cpu-lab/','challenges/','learn/','architecture/','examples/','roadmap/','examples/optimization/','docs.html'];
const server=createServer(async (request,response)=>{
  try {
    const route=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    if (!route.startsWith('/bitborn/')) {response.writeHead(404).end();return;}
    let path=resolve(site,route.slice('/bitborn/'.length) || 'index.html');
    if (!path.startsWith(site+'/')) {response.writeHead(403).end();return;}
    if ((await stat(path)).isDirectory()) path=resolve(path,'index.html');
    const content=await readFile(path);
    response.writeHead(200,{'Content-Type':types[extname(path)] || 'application/octet-stream'}).end(content);
  } catch {response.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=process.env.SITE_BASE_URL || `http://127.0.0.1:${server.address().port}/bitborn/`;
await mkdir(resolve(root,'build/cross-engine'),{recursive:true});

try {
  for (const engine of [...new Set(engines)]) {
    const browser=await playwright[engine].launch({headless:true});
    try {
      const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',acceptDownloads:true});
      const page=await context.newPage(),errors=[];
      page.setDefaultTimeout(20000);
      page.on('pageerror',error=>errors.push(error.message));
      page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
      const open=async path=>{
        const response=await page.goto(new URL(path,base).href);
        assert.equal(response.status(),200,`${engine}: ${path || 'home'} HTTP status`);
        await page.locator('main h1').waitFor({state:'visible'});
        if (path==='boot-builder/') await page.waitForFunction(()=>document.querySelectorAll('.builder-byte').length===512);
        else if (path==='cpu-lab/') await page.waitForFunction(()=>document.querySelectorAll('.register').length===14);
        else if (path.startsWith('challenges/')) await page.locator('#challenge-app').waitFor({state:'visible'});
        else if (path==='roadmap/') await page.locator('.milestone-row').first().waitFor({state:'visible'});
        else if (path==='examples/optimization/') await page.locator('#comparison button').first().waitFor({state:'visible'});
        else if (!path || path==='playground/') await page.locator('#bit-editor button').first().waitFor({state:'visible'});
      };
      for (const width of [1440,320]) {
        await page.setViewportSize({width,height:width===320 ? 844 : 1000});
        for (const route of routes) {
          await open(route);
          assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${engine}: ${width}px overflow on ${route || 'home'}`);
          assert.equal(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),true,`${engine}: reduced motion is active`);
        }
      }

      // A real bit edit changes both modeled output streams and the exported literal bytes.
      await page.setViewportSize({width:1440,height:1000}); await open('boot-builder/');
      assert.match(await page.locator('#builder-load-status').textContent(),/SHA-256 verified/);
      await page.locator('#jump-offset').fill('176'); await page.locator('#jump-form button').click();
      assert.equal(await page.locator('#builder-hex').textContent(),'0x48');
      await page.locator('[data-bit="2"]').click();
      assert.equal(await page.locator('#builder-hex').textContent(),'0x68');
      assert.match(await page.locator('#change-count').textContent(),/1 byte · 1 bit changed/);
      await page.locator('#simulation-run').click();
      await page.waitForFunction(()=>document.getElementById('simulation-status').textContent.includes('HLT reached'));
      assert.match(await page.locator('#simulation-output').textContent(),/hello from raw machine code!/);
      assert.equal(await page.locator('#simulation-output').textContent(),await page.locator('#simulation-serial').textContent());
      const downloadedImage=page.waitForEvent('download'); await page.locator('#export-image').click();
      const imagePath=resolve(root,`build/cross-engine/${engine}-edited.img`); await (await downloadedImage).saveAs(imagePath);
      const downloadedSource=page.waitForEvent('download'); await page.locator('#export-bits').click();
      const sourcePath=resolve(root,`build/cross-engine/${engine}-edited.bits`); await (await downloadedSource).saveAs(sourcePath);
      const image=new Uint8Array(await readFile(imagePath));
      assert.equal(image.length,512); assert.equal(image[176],0x68); assert.deepEqual([...image.slice(510)],[0x55,0xAA]);
      const canonical=JSON.parse(await readFile(resolve(site,'boot.json'),'utf8')).bytes;
      assert.deepEqual([...image].map((value,offset)=>value===canonical[offset] ? null : offset).filter(offset=>offset!==null),[176],'only the selected byte changed in the export');
      assert.deepEqual(parseBits(await readFile(sourcePath,'utf8')),image,`${engine}: downloaded .bits exactly reproduces all 512 image bytes`);

      // Step highlights exact register bits; arithmetic flags and bounded memory stay inspectable.
      await open('cpu-lab/'); await page.locator('#step').click();
      assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'002A');
      assert.deepEqual(await page.locator('[data-register="AX"] .changed-bit').evaluateAll(bits=>bits.map(bit=>Number(bit.dataset.bit))),[5,3,1]);
      await page.locator('#preset').selectOption('flags'); await page.locator('#step').click(); await page.locator('#step').click();
      assert.match(await page.locator('[data-flag="CF"]').textContent(),/CF1/); assert.match(await page.locator('[data-flag="ZF"]').textContent(),/ZF1/);
      await page.locator('#back').click();assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'FFFF');
      assert.match(await page.locator('[data-flag="CF"]').textContent(),/CF0/);
      await page.locator('#forward').click();assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'0000');
      assert.equal(await page.locator('#history-position').textContent(),'2 / 2 recorded');
      await page.locator('#preset').selectOption('memory');
      for (let step=0;step<5;step++) await page.locator('#step').click();
      await page.locator('#memory-address').fill('00120'); await page.locator('#memory-form button').click();
      assert.equal(await page.locator('[data-address="00120"]').textContent(),'CD'); assert.equal(await page.locator('[data-address="00121"]').textContent(),'AB');
      assert.equal(await page.locator('.memory-byte.changed-bit').count(),2);
      await page.locator('#back').click();assert.equal(await page.locator('[data-address="00120"]').textContent(),'00');
      await page.locator('#forward').click();assert.equal(await page.locator('[data-address="00120"]').textContent(),'CD');
      assert.equal(await page.locator('#step-count').textContent(),'0005');
      await page.locator('#timeline').focus();await page.keyboard.press('Home');
      assert.equal(await page.locator('#step-count').textContent(),'0000');
      assert.equal(await page.locator('[data-address="00120"]').textContent(),'00');
      await page.keyboard.press('End');assert.equal(await page.locator('#step-count').textContent(),'0005');
      assert.equal(await page.locator('[data-address="00120"]').textContent(),'CD');
      assert.equal(await page.locator('#timeline').evaluate(input=>document.activeElement===input),true);
      await page.locator('#memory-address').fill('FFFFF'); await page.locator('#memory-form button').click();
      assert.equal(await page.locator('.memory-byte').count(),1);
      await page.locator('#memory-address').fill('100000'); await page.locator('#memory-form button').click();
      assert.equal(await page.locator('[data-address="FFFFF"]').count(),1,'invalid memory input keeps the previous range');
      await page.locator('#preset').selectOption('branch');
      await page.locator('#speed').evaluate(input=>{input.value='12';input.dispatchEvent(new Event('input',{bubbles:true}));});
      await page.locator('[data-breakpoint="6"]').click(); await page.locator('#run').click();
      await page.waitForFunction(()=>document.getElementById('status').textContent.includes('Paused before execution'));
      assert.equal(await page.locator('#step-count').textContent(),'0002');
      await page.locator('#run').click();
      await page.waitForFunction(()=>document.getElementById('step-count').textContent==='0004' && document.getElementById('status').textContent.includes('Paused before execution'));
      assert.match(await page.locator('#pointer-change').textContent(),/control transfer/);
      await page.locator('#step').click(); assert.equal(await page.locator('#step-count').textContent(),'0005');
      await page.locator('#reset').click(); await page.locator('#step').focus(); await page.keyboard.press('Enter');
      assert.equal(await page.locator('#step-count').textContent(),'0001','keyboard activation works across engines');
      await page.locator('#import-program').setInputFiles({name:'bom.bits',mimeType:'text/plain',buffer:Buffer.from('\ufeff11110100')});
      await page.waitForFunction(()=>document.getElementById('byte-count').textContent==='1 BYTES');
      await page.locator('#step').click();assert.equal(await page.locator('#run-state').textContent(),'HALTED');
      await page.locator('#import-program').setInputFiles({name:'double.bits',mimeType:'text/plain',buffer:Buffer.from('\ufeff\ufeff11110100')});
      await page.waitForFunction(()=>document.getElementById('editor-status').textContent.includes('Current program and state kept'));
      assert.equal(await page.locator('#run-state').textContent(),'HALTED');
      await page.locator('#preset').selectOption('immediates');
      await page.locator('#import-program').setInputFiles({name:'invalid.bits',mimeType:'text/plain',buffer:Buffer.from([255])});
      await page.waitForFunction(()=>document.getElementById('editor-status').textContent.includes('valid UTF-8'));
      assert.equal(await page.locator('#step-count').textContent(),'0000');

      // Solve the two puzzles by their actual bit buttons and verify local progress after reload.
      await open('challenges/?id=return-42'); await page.locator('#validate').click();
      assert.match(await page.locator('#result').textContent(),/goal is still unmet/);
      await page.locator('[data-offset="2"][data-bit="6"]').click(); await page.locator('[data-offset="2"][data-bit="7"]').click();
      await page.locator('#validate').click(); assert.match(await page.locator('#result').textContent(),/Solved in.*2 changed bits/);
      await open('challenges/?id=repair-boot'); await page.locator('#validate').click();
      assert.doesNotMatch(await page.locator('#result').textContent(),/Solved in/);
      for (const [offset,bit] of [[1,7],[17,6],[17,7]]) await page.locator(`[data-offset="${offset}"][data-bit="${bit}"]`).click();
      await page.locator('#validate').click(); assert.match(await page.locator('#result').textContent(),/Solved in.*3 changed bits/);
      assert.equal(await page.locator('.goal-checks .fail').count(),0);
      await page.reload(); await page.locator('#challenge-app').waitFor({state:'visible'});
      const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('bitborn.challenges.v1')));
      assert.deepEqual([...progress.completed].sort(),['repair-boot','return-42']);
      assert.match(await page.locator('#completion-count').textContent(),/^2 \/ 20$/);
      await page.locator('#binary-source').fill('00000000 '.repeat(513)); await page.locator('#validate').click();
      assert.match(await page.locator('#result').textContent(),/512|limit|large|maximum/i,'oversized input is rejected');
      await open('challenges/?id=direction-flag');await page.locator('#validate').click();
      assert.match(await page.locator('#result').textContent(),/goal is still unmet/);
      await page.locator('[data-offset="7"][data-bit="7"]').click();
      assert.equal(await page.locator('.editable-byte small').textContent(),'Starting source: CLD');
      await page.locator('#validate').click();assert.match(await page.locator('#result').textContent(),/Solved in 9.*1 changed bit/);
      assert.equal(await page.locator('.goal-checks .fail').count(),0);

      // The displayed roadmap must be the exact generated, fetched record.
      const roadmapResponse=page.waitForResponse(response=>new URL(response.url()).pathname.endsWith('/progress.json'));
      await open('roadmap/');
      const fetched=await (await roadmapResponse).json(), generated=JSON.parse(await readFile(resolve(site,'progress.json'),'utf8'));
      assert.deepEqual(fetched,generated,`${engine}: fetched roadmap matches the generated file`);
      assert.equal(await page.locator('#roadmap-updated').textContent(),`UPDATED ${generated.updated}`);
      assert.deepEqual(await page.locator('.milestone-row').evaluateAll(rows=>rows.map(row=>({milestone:row.querySelector('h3').textContent,progress:row.querySelector('.milestone-progress').textContent}))),generated.milestones);

      await open('examples/optimization/');
      const optimization=JSON.parse(await readFile(resolve(site,'optimization.json'),'utf8'));
      assert.equal(await page.locator('#before-size').textContent(),String(optimization.before.bytes.length));
      assert.equal(await page.locator('#after-size').textContent(),String(optimization.after.bytes.length));
      await page.locator('#comparison [data-offset="1"]').focus(); await page.keyboard.press('Enter');
      assert.match(await page.locator('#bit-detail').textContent(),/Offset 1\nBefore: [01]{8}\nAfter:  [01]{8}\nXOR:/);
      await page.setViewportSize({width:320,height:844}); await open('cpu-lab/'); await page.locator('#step').click();
      assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'002A');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${engine}: mobile state-change layout`);
      await page.screenshot({path:resolve(root,`build/cross-engine/${engine}-cpu-mobile.png`),fullPage:true});
      await checkIntroductions(page,base);
      await open('playground/');await checkEncoding(page);
      await open('');await checkBitKeyboard(page);
      await open('cpu-lab/');await checkProgramDownloads(page);
      await checkSourceErrors(page);
      await checkHexDrafts(page);
      await checkRegisterMOV(page);
      await checkMemoryMOV(page);
      await checkSignedBranches(page);
      await checkCarry(page);
      await checkPresetSources(page);
      await checkSelfModifying(page);
      await checkProgramLinks(page);
      await checkELF(page,base);
      await checkBitDiff(page,base);
      await checkPrintLessons(page,base);
      await checkVGABitmap(page,base);
      await checkIndicators(page);
      await checkExecutionKeyboard(page);
      assert.deepEqual(errors,[],`${engine}: page errors and HTTP asset failures`);
      console.log(`${engine} ${browser.version()} passed locally: 8 dedicated routes + optimization, home/docs, eight localized introductions with RTL/LTR code and keyboard navigation, 16/32/64 inspection with exact imm64 and read-only bit/context changes, desktop/320px reduced motion, real H→h binary downloads, CPU state/flags/memory/breakpoint resume, three bit-button challenges and local progress, generated roadmap, optimization byte inspection.`);
    } finally {await browser.close();}
  }
} finally {await new Promise(resolve=>server.close(resolve));}
