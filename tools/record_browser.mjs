// Real browser screenshots of the bounded teaching model; never native CPU footage.
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer(async(request,response)=>{
  const route=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  const path=resolve(root,'site',route.slice('/bitborn/'.length)+(route.endsWith('/')?'index.html':''));
  if (!route.startsWith('/bitborn/') || !path.startsWith(resolve(root,'site')+'/')) {response.writeHead(403).end();return;}
  try {const data=await readFile(path);response.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'});response.end(data);}
  catch {response.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}/bitborn/`;
let browser;
const captures=[];
try {
  browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{})});
  const page=await browser.newPage({viewport:{width:1280,height:960},reducedMotion:'reduce'});
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  let name,frames,actions,directory;
  const begin=async(slug)=>{name=slug;frames=0;actions=[];directory=resolve(root,'build/browser-recording',slug);await mkdir(directory,{recursive:true});};
  const capture=async(action)=>{actions.push(action);await page.screenshot({path:resolve(directory,`${String(frames++).padStart(4,'0')}.png`)});};
  const encode=async()=>{
    const output=resolve(root,'assets',`${name}-demo.gif`);
    // Probe a real source frame before encoding; palette + resize are the only visual alterations.
    const inputProbe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-of','json',resolve(directory,'0000.png')],{encoding:'utf8'}));
    assert.equal(inputProbe.streams[0].width,1280);assert.equal(inputProbe.streams[0].height,960);
    execFileSync('ffmpeg',['-v','error','-y','-framerate','1','-i',resolve(directory,'%04d.png'),'-frames:v',String(frames),'-filter_complex','scale=960:-1,split[a][b];[a]palettegen[p];[b][p]paletteuse','-loop','0',output]);
    const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','stream=nb_frames:format=duration','-of','json',output],{encoding:'utf8'}));
    const pngHashes=[];
    for(let frame=0;frame<frames;frame++)pngHashes.push(createHash('sha256').update(await readFile(resolve(directory,`${String(frame).padStart(4,'0')}.png`))).digest('hex'));
    captures.push({file:`assets/${name}-demo.gif`,sha256:createHash('sha256').update(await readFile(output)).digest('hex'),capturedFrames:frames,encodedFrames:Number(probe.streams[0].nb_frames),durationSeconds:Number(probe.format.duration),actions,sourceFrameSha256:pngHashes});
  };

  await begin('boot-builder');
  await page.goto(new URL('boot-builder/',base).href);
  await page.waitForFunction(()=>document.querySelectorAll('.builder-byte').length===512);
  await capture('Loaded the baseline boot sector; page labels browser simulation separately from QEMU.');
  await page.locator('#jump-offset').fill('176');await page.locator('#jump-form button').click();
  await page.locator('#builder-bits').scrollIntoViewIfNeeded();await capture('Selected literal greeting byte176, ASCII H.');
  await page.locator('[data-bit="2"]').click();await capture('Toggled MSB-index2: H→h, exactly one changed bit.');
  await page.locator('#simulation-run').click();
  await page.waitForFunction(()=>document.querySelector('#simulation-status').textContent.includes('HLT reached'));
  assert.match(await page.locator('#simulation-output').textContent(),/hello from raw machine code!/);
  await page.locator('#simulation-output').scrollIntoViewIfNeeded();await capture('Model reached HLT and displayed lowercase hello in the screen/COM1 outputs.');
  await capture('Held the verified browser result for readability.');await encode();

  await begin('cpu-lab');
  await page.goto(new URL('cpu-lab/',base).href);
  await page.locator('#preset').selectOption('stack');await capture('Loaded the literal stack/CALL/RET preset.');
  await page.locator('#step').scrollIntoViewIfNeeded();
  for(let index=0;index<8;index++){
    await page.locator('#step').click();await capture(`Actual browser Step control ${index+1}; registers, flags and stack are model state.`);
    if(index===1||index===4){await page.locator('#stack').scrollIntoViewIfNeeded();await capture('Inspected actual model stack bytes written by PUSH or CALL.');}
  }
  assert.match(await page.locator('#status').textContent(),/HLT|halted/i);
  await page.locator('#preset').selectOption('flags');
  await page.locator('#step').click();await page.locator('#step').click();
  await page.locator('#flags').scrollIntoViewIfNeeded();await capture('Arithmetic preset FFFF+1 wraps AX to zero and sets CF/ZF in the teaching model.');await encode();

  await begin('challenges');
  await page.goto(new URL('challenges/?id=repair-boot',base).href);
  await page.waitForFunction(()=>document.querySelector('#challenge-title').textContent.includes('boot'));
  await capture('Opened the three-bit real boot repair challenge.');
  await page.locator('#editable-bytes').scrollIntoViewIfNeeded();await capture('Inspected the locked/editable offsets and three-bit budget.');
  for(const [offset,bit] of [[1,7],[17,6],[17,7]]){await page.locator(`[data-offset="${offset}"][data-bit="${bit}"]`).click();await capture(`Flipped editable offset${offset}, MSB-index${bit}.`);}
  await page.locator('#validate').click();await page.locator('#result-panel').scrollIntoViewIfNeeded();
  assert.match(await page.locator('#result').textContent(),/Solved/);
  await capture('Deterministic browser goal checks passed; the curated solution is also QEMU-tested.');
  await capture('Held the solved challenge result and local progress count.');await encode();
  assert.deepEqual(errors,[]);
  const hashes={};
  for(const source of ['boot/boot.bits','site/simulator.mjs','site/binary.mjs','site/boot-builder/app.mjs','site/cpu-lab/lab.mjs','site/cpu-lab/presets.mjs','site/challenges/challenges.mjs','challenges/catalog.json']){
    hashes[source]=createHash('sha256').update(await readFile(resolve(root,source))).digest('hex');
  }
  const metadata={kind:'Actual browser screenshots of bounded educational simulation; not native CPU or QEMU footage',browser:browser.version(),viewport:{width:1280,height:960},presentationFps:1,alterations:'960px resize and GIF palette encoding only; each frame is an actual captured browser state. Step pacing is for explanation, not a benchmark.',sourceSha256:hashes,captures,reproduce:'make site-test && npm ci && npx playwright install chromium && npm run record:browser',requires:'ffmpeg and ffprobe; PLAYWRIGHT_CHROMIUM_EXECUTABLE may select an installed Chrome'};
  await writeFile(resolve(root,'assets/browser-demo-recording.json'),JSON.stringify(metadata,null,2)+'\n');
  console.log('Recorded three genuine browser GIFs with frame/source hashes and explicit simulation provenance.');
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
