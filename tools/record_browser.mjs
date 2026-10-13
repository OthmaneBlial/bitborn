// Real inspection/model screenshots; never native CPU footage.
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {parseBits} from '../site/binary.mjs';
import {presets} from '../site/cpu-lab/presets.mjs';

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

  await begin('elf');
  await page.goto(new URL('elf/',base).href);
  await page.waitForFunction(()=>document.getElementById('elf-status').textContent.includes('structural inspection complete'));
  await page.locator('#entry-mapping').scrollIntoViewIfNeeded();
  assert.match(await page.locator('#entry-mapping').textContent(),/file offset 120/);
  await capture('Checksum-verified eight-byte exit ELF: declared 400078 maps to file offset120; inspection only.');
  await page.locator('[data-field="PH0.p_flags"]').click();await page.locator('#elf-bytes').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('.elf-byte.selected').count(),4);await capture('Selected the program-header permission field: actual file bytes encode RX as 05.');
  await page.locator('#show-entry').click();await page.locator('#elf-bytes').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('[data-file-offset="120"]').textContent(),'6A');await capture('Followed the declared entry to the actual first instruction byte 6A; no imported program executes.');
  await page.locator('#elf-example').selectOption({label:'exit-code.elf'});
  await page.waitForFunction(()=>document.getElementById('elf-facts').textContent.includes('132 file bytes'));
  await page.locator('#entry-mapping').scrollIntoViewIfNeeded();await capture('Loaded the reviewed 12-byte baseline: container grows to132 bytes while the entry mapping stays at120.');await encode();

  await begin('bit-diff');
  await page.goto(new URL('bit-diff/',base).href);await page.waitForFunction(()=>document.getElementById('diff-status').textContent.includes('no code was executed'));
  assert.equal(await page.locator('#flipped-count').textContent(),'1');assert.equal(await page.locator('#reinterpreted-count').textContent(),'1');
  await page.locator('.diff-layout').scrollIntoViewIfNeeded();await capture('A one-bit MOV direction change modifies the opcode and reinterprets an unchanged ModR/M byte; counts keep those categories separate.');
  await page.locator('[data-offset="1"]').click();await capture('Selected unchanged D8: its six source/destination selector-bit roles reverse although the raw byte does not change.');
  await page.locator('#diff-example').selectOption('signed');await capture('Compared FE (-2) and7E (+126): only the displacement sign bit changes; default SS remains the same.');
  await page.locator('#diff-example').selectOption('immediate');await page.locator('.diff-scope').scrollIntoViewIfNeeded();await capture('Explicit32-bit context classifies a five-byte MOV immediate on both sides; comparison executes neither program.');
  await page.locator('#diff-mode').selectOption('16');assert.match(await page.locator('#before-classification').textContent(),/Stopped at offset 3/);await capture('Switching to16-bit context consumes three bytes, then classification stops at the unsupported remaining byte without resynchronizing.');
  await page.locator('#diff-format').selectOption('hex');await page.locator('#diff-before').fill('F4');await page.locator('#diff-after').fill('F4 00');
  assert.equal(await page.locator('#added-count').textContent(),'1');assert.equal(await page.locator('#flipped-count').textContent(),'0');await page.locator('.diff-layout').scrollIntoViewIfNeeded();await capture('An added zero byte is missing on the before side; it counts as one addition and zero flipped shared bits.');
  await page.locator('#diff-example').selectOption('selfmod');assert.equal(await page.locator('#flipped-count').textContent(),'1');assert.equal(await page.locator('.offset-row').getAttribute('data-offset'),'52');await page.locator('.diff-layout').scrollIntoViewIfNeeded();await capture('The two literal self-modification programs differ only at source writer byte52, bit5: 41 becomes61. This workbench performs no execution; native effects are verified separately.');
  await page.locator('#diff-before').fill('# emoji 🧪\nF4 GG');await page.locator('#diff-after').fill('F4 ZZ');await page.locator('#diff-format').selectOption('binary');
  assert.equal(await page.locator('#diff-before').evaluate(editor=>editor.value.slice(editor.selectionStart,editor.selectionEnd)),'GG');assert.equal(await page.locator('#flipped-count').textContent(),'1');await page.locator('.diff-inputs').scrollIntoViewIfNeeded();await capture('Both invalid comparison sides are identified; failed notation conversion focuses/selects Before GG and preserves the last valid one-bit comparison.');
  await page.locator('#diff-before').fill('F4');await page.locator('#diff-format').selectOption('binary');assert.equal(await page.locator('#diff-before').getAttribute('aria-invalid'),null);assert.equal(await page.locator('#diff-after').evaluate(editor=>editor.value.slice(editor.selectionStart,editor.selectionEnd)),'ZZ');await page.locator('.diff-inputs').scrollIntoViewIfNeeded();await capture('Correcting Before clears its error marker; conversion now focuses/selects After ZZ without altering either draft or the original notation.');
  await page.locator('#diff-after').fill('F4');await page.locator('#diff-format').selectOption('binary');assert.equal(await page.locator('#diff-after').getAttribute('aria-invalid'),null);assert.equal(await page.locator('#flipped-count').textContent(),'0');await page.locator('.diff-inputs').scrollIntoViewIfNeeded();await capture('Both corrected F4 drafts convert to literal binary with zero byte differences; stale error markers clear and the read-only comparison resumes.');await encode();

  await begin('encoding');
  await page.goto(new URL('playground/',base).href);
  await page.locator('#instruction-select').selectOption('mov32');
  await page.locator('#encoding-explanation').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV AX, 42');
  await capture('Inspected the literal B8 fixture in 16-bit context: three bytes consumed for MOV AX,42.');
  await page.locator('#decode-mode').selectOption('32');
  assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV EAX, 42');
  assert.equal(await page.locator('#execute-instruction').isDisabled(),true);
  await capture('Selected explicit 32-bit context: the same B8 fixture consumes five bytes for MOV EAX,42; simulation is disabled.');
  await page.locator('#decode-mode').selectOption('64');await page.locator('#instruction-select').selectOption('mov64');
  await page.locator('#bit-editor').scrollIntoViewIfNeeded();await capture('Inspected the literal REX.W+B prefix, register opcode and eight immediate bytes in 64-bit mode.');
  await page.locator('#encoding-explanation').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV R8, 18446744073709551615');
  await capture('Displayed exact unsigned imm64 without Number rounding; no instruction was executed.');
  await page.locator('[data-bit="0-0"]').click();
  assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV RAX, 18446744073709551615');
  await page.locator('#encoding-explanation').scrollIntoViewIfNeeded();await capture('Flipped REX.B: the destination changes from R8 to RAX, with the same exact immediate.');
  await page.locator('[data-bit="0-3"]').click();
  assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV EAX, 4294967295');
  await page.locator('#encoding-explanation').scrollIntoViewIfNeeded();await capture('Cleared REX.W: the operand becomes 32-bit and consumes only four immediate bytes.');
  await page.locator('#decode-mode').selectOption('16');
  assert.equal(await page.locator('#decoded-instruction').textContent(),'INC AX');
  await capture('Changed context to 16-bit: the same initial 40 byte is INC AX rather than a REX prefix.');
  await page.locator('#instruction-select').selectOption('mov');await page.locator('#execute-instruction').click();
  await page.locator('#instruction-select').selectOption('movRegister');assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV AX, BX');
  assert.equal(await page.locator('#execute-instruction').isEnabled(),true);await capture('Inspected register-direct MOV AX,BX and ModR/M roles; unprefixed byte/word forms are available in the bounded 16-bit model.');
  await page.locator('[data-bit="0-1"]').click();assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV BX, AX');
  await capture('Flipped only opcode direction bit1: source/destination names and ModR/M role labels reverse.');
  await page.locator('#execute-instruction').click();assert.equal(await page.locator('#play-registers .register').filter({hasText:/^BX/}).locator('strong').textContent(),'002A');
  await capture('Simulated MOV BX,AX: the previously loaded 42 is copied into BX; this is model state, not native CPU execution.');
  await page.locator('#decode-mode').selectOption('64');await page.locator('#instruction-select').selectOption('movByte');
  assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV AL, AH');await capture('Without REX, register selector100 names the high byte AH.');
  await page.locator('#instruction-select').selectOption('movByteRex');assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV AL, SPL');
  await capture('The literal 40 REX prefix remaps selector100 to SPL in 64-bit mode; no instruction executes.');
  await page.locator('[data-bit="0-3"]').click();assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV AL, SPL');
  await capture('Setting REX.W leaves the eight-bit MOV unchanged; the bit label identifies W as unused.');
  await page.locator('#instruction-select').selectOption('movMemoryBP');await page.locator('#decode-mode').selectOption('16');
  assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV AX, [BP-2]');assert.equal(await page.locator('#execute-instruction').isEnabled(),true);
  await capture('Inspected BP minus signed disp8: default SS is explained without reading registers or RAM; simulation is available for the unprefixed form.');
  await page.locator('[data-bit="2-7"]').click();assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV AX, [BP+126]');
  await capture('Flipped only displacement sign bit7: FE (-2) becomes 7E (+126); BP still selects SS.');
  await page.locator('#instruction-select').selectOption('movMemoryAbsolute');assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV DX, [32]');
  await capture('The mod00/rm110 exception selects an absolute little-endian offset in default DS, not BP.');
  await page.locator('#instruction-select').selectOption('movMemoryPair');assert.equal(await page.locator('#decoded-instruction').textContent(),'MOV CX, [BX+SI]');
  await capture('Inspected BX+SI addressing in default DS; wider/overridden addressing remains unavailable.');
  await page.locator('#instruction-select').selectOption('shortBranch');assert.equal(await page.locator('#decoded-instruction').textContent(),'JL -2');await page.locator('#encoding-explanation').scrollIntoViewIfNeeded();await capture('Short JL exposes condition-group, inversion and signed-rel8 fields in16-bit inspection; no flags are read.');
  await page.locator('#decode-mode').selectOption('64');assert.equal(await page.locator('#execute-instruction').isDisabled(),true);await capture('The same unprefixed short-Jcc fields are valid in64-bit inspection; execution remains disabled.');
  await page.locator('[data-bit="0-0"]').click();assert.equal(await page.locator('#decoded-instruction').textContent(),'JGE -2');await page.locator('#encoding-explanation').scrollIntoViewIfNeeded();await capture('Toggling opcode bit0 selects the inverse condition: SF differing from OF becomes SF equal to OF.');
  await page.locator('[data-bit="1-7"]').click();assert.equal(await page.locator('#decoded-instruction').textContent(),'JGE +126');await page.locator('#encoding-explanation').scrollIntoViewIfNeeded();await capture('Toggling rel8 bit7 changes FE (-2) to7E (+126); no absolute target or runtime flag state is guessed.');
  const beforeLinux=await page.locator('#play-registers').textContent();
  for(const [name,mnemonic] of [['linuxPushNumber','PUSH 60'],['linuxPopNumber','POP RAX'],['linuxPushArgument','PUSH 42'],['linuxPopArgument','POP RDI'],['linuxSyscall','SYSCALL'],['linuxMovNumber','MOV EAX, 60'],['linuxMovArgument','MOV EDI, 42']]) {
    await page.locator('#instruction-select').selectOption(name);assert.equal(await page.locator('#decoded-instruction').textContent(),mnemonic);
    assert.equal(await page.locator('#execute-instruction').isDisabled(),true);assert.equal(await page.locator('#play-registers').textContent(),beforeLinux);
    await page.locator('#encoding-explanation').scrollIntoViewIfNeeded();await capture(`Inspected canonical Linux payload slice ${mnemonic} in64-bit context; registers/stack are untouched and no syscall executes.`);
  }
  await page.locator('#instruction-select').selectOption('linuxPushNumber');await page.locator('[data-bit="1-7"]').click();
  assert.equal(await page.locator('#decoded-instruction').textContent(),'PUSH -68');await page.locator('#encoding-explanation').scrollIntoViewIfNeeded();await capture('Flipped the imm8 sign bit: 3C becomes BC and sign-extends to FFFFFFFFFFFFFFBC. This is inspection, not a Linux request.');await encode();

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
  await page.locator('#execution-shortcuts').uncheck();await page.locator('#lab-title').click();await page.keyboard.press('s');
  assert.equal(await page.locator('#step-count').textContent(),'0000');await capture('Disabled execution shortcuts; pressing S leaves loaded model state untouched. Native controls remain available.');
  await page.locator('#execution-shortcuts').check();await page.locator('#step').click();
  assert.match(await page.locator('#status').textContent(),/^Step 1:.*Next 0000:7C03/);await capture('Manual Step reports its instruction number and next CS:IP in the atomic status region; automatic Run ticks are checked separately.');
  await page.locator('#preset').selectOption('stack');await capture('Loaded the literal stack/CALL/RET preset.');
  await page.locator('#step').scrollIntoViewIfNeeded();
  for(let index=0;index<8;index++){
    await page.locator('#step').click();await capture(`Actual browser Step control ${index+1}; registers, flags and stack are model state.`);
    if(index===1||index===4){await page.locator('#stack').scrollIntoViewIfNeeded();await capture('Inspected actual model stack bytes written by PUSH or CALL.');}
    if(index===2){
      assert.equal(await page.locator('[data-flag="AF"] strong').textContent(),'?');
      await page.locator('#flags').scrollIntoViewIfNeeded();await capture('XOR clears AX and displays AF as undefined, not a promised native zero; the guided flags reference is visible.');
    }
    if(index===4){
      await page.locator('#memory-address').fill('07BFE');await page.locator('#memory-form button').click();
      await page.locator('#back').click();
      assert.equal(await page.locator('[data-address="07BFE"]').textContent(),'34');assert.equal(await page.locator('[data-address="07BFF"]').textContent(),'12');
      await page.locator('#memory').scrollIntoViewIfNeeded();await capture('Back across CALL restores the saved 1234 word as34 12 below SP; this is recorded model RAM, not native reversal.');
      await page.locator('#forward').click();
      assert.equal(await page.locator('[data-address="07BFE"]').textContent(),'0A');assert.equal(await page.locator('[data-address="07BFF"]').textContent(),'7C');
      await capture('Forward replays the CALL overwrite as0A 7C, the logical return address7C0A, without executing CALL again.');
    }
  }
  assert.match(await page.locator('#status').textContent(),/HLT|halted/i);
  await page.locator('#timeline').scrollIntoViewIfNeeded();
  await page.locator('#timeline').focus();await page.keyboard.press('Home');
  assert.equal(await page.locator('#step-count').textContent(),'0000');
  await capture('Selected initial recorded state with Home; registers and stack RAM restored without executing instructions.');
  await page.locator('#memory-address').fill('07BFE');await page.locator('#memory-form button').click();
  assert.equal(await page.locator('[data-address="07BFE"]').textContent(),'00');
  await page.locator('#memory').scrollIntoViewIfNeeded();await capture('Inspected previously written stack memory at 07BFE: undo restored 00.');
  await page.locator('#timeline').scrollIntoViewIfNeeded();await page.locator('#timeline').focus();
  await page.keyboard.press('End');assert.equal(await page.locator('#step-count').textContent(),'0008');
  await capture('Selected final recorded state with End; exact registers, RAM and HLT restored through recorded replay.');
  const pendingDownload=page.waitForEvent('download');await page.locator('#export-raw').click();
  const download=await pendingDownload;
  const exported=await readFile(await download.path());
  assert.equal(download.suggestedFilename(),'bitborn-program.bin');assert.deepEqual(new Uint8Array(exported),parseBits(presets.find(preset=>preset.id==='stack').source));
  await page.locator('#download-status').scrollIntoViewIfNeeded();await capture('Downloaded the exact loaded raw program; export controls identify original loaded bytes and no BIOS/ELF framing.');
  await page.locator('#binary-editor').fill('10111000 00101010 00000000 # retained comment\n11110100');
  assert.equal((await page.locator('#hex-editor').inputValue()).trim(),'B8 2A 00 F4');
  await page.locator('#hex-editor').scrollIntoViewIfNeeded();await capture('A valid binary draft updates the equivalent hex view while preserving binary comments and the loaded execution state.');
  await page.locator('#hex-editor').fill('B8 07 00 F4');await page.locator('#load-hex').click();
  assert.equal(await page.locator('#step-count').textContent(),'0000');
  await capture('Explicit Load hex replaces the binary draft with the same literal bytes and resets the model.');
  const sharedProgram=await page.locator('#program-link').inputValue();assert.match(sharedProgram,/#program=v1.B80700F4$/);
  await page.locator('#program-link').scrollIntoViewIfNeeded();await capture('The loaded four-byte program becomes an exact bounded URL fragment; comments, drafts and machine history are omitted.');
  await page.goto(sharedProgram);await page.waitForFunction(()=>document.getElementById('lesson').textContent.startsWith('Shared literal'));
  assert.equal(await page.locator('#step-count').textContent(),'0000');await page.locator('.control-panel').scrollIntoViewIfNeeded();await capture('Opened the shared literal bytes in a paused deterministic state; the link does not execute the program.');
  await page.locator('#binary-editor').fill('10111000 11001101 10101011\n10111011 00110100 00010010\n10001000 11100000\n10001010 11100011\n11110100');await page.locator('#load-program').click();
  for(let index=0;index<3;index++)await page.locator('#step').click();
  assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'ABAB');await page.locator('#registers').scrollIntoViewIfNeeded();await capture('Modeled MOV AL,AH reads the original high byte and preserves AH, changing ABCD to ABAB.');
  await page.locator('#step').click();assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'34AB');await capture('Modeled MOV AH,BL copies byte34 while preserving AL=AB.');
  await page.locator('#back').click();assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'ABAB');await capture('Recorded-state rewind restores the exact byte-alias result ABAB without executing instructions.');
  await page.locator('#forward').click();assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'34AB');await capture('Recorded replay restores 34AB and the instruction pointer; wider/prefixed execution remains unavailable.');
  await page.locator('#preset').selectOption('flags');
  await page.locator('#step').click();await page.locator('#step').click();
  await page.locator('#flags').scrollIntoViewIfNeeded();await capture('Arithmetic preset FFFF+1 wraps AX to zero and sets CF/ZF in the teaching model.');
  await page.locator('#preset').selectOption('memory-mov');
  for(let index=0;index<21;index++)await page.locator('#step').click();
  assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'2233');await page.locator('#registers').scrollIntoViewIfNeeded();await capture('Canonical BP/DS/SS exercise: BP-2 reads2233 from SS while the matching DS offset contains1111. Identical source also runs in curated QEMU checks.');
  for(let index=0;index<4;index++)await page.locator('#step').click();
  await page.locator('#memory-address').fill('10030');await page.locator('#memory-form button').click();
  assert.equal(await page.locator('[data-address="10030"]').textContent(),'11');await page.locator('#memory').scrollIntoViewIfNeeded();await capture('Modeled ModR/M word store writes11 11 to physical10030; exact changed bytes are journaled.');
  await page.locator('#back').click();assert.equal(await page.locator('[data-address="10030"]').textContent(),'00');await capture('Rewind restores both original zero RAM bytes without executing an instruction.');
  await page.locator('#forward').click();assert.equal(await page.locator('[data-address="10030"]').textContent(),'11');await capture('Replay restores the exact word store and register/flag state.');
  for(let index=0;index<3;index++)await page.locator('#step').click();
  assert.equal(await page.locator('[data-register="DX"] .register-value').textContent(),'1122');await page.locator('#registers').scrollIntoViewIfNeeded();await capture('A high-byte store and low-byte load produce DX1122 while preserving flags; the exercise halts after28 supported steps.');
  await page.locator('#binary-editor').fill(await readFile(resolve(root,'docs/instruction-encoding/fixtures/signed-branches.bits'),'utf8'));await page.locator('#load-program').click();
  for(let index=0;index<11;index++)await page.locator('#step').click();
  assert.equal(await page.locator('[data-flag="SF"] strong').textContent(),'0');assert.equal(await page.locator('[data-flag="OF"] strong').textContent(),'1');
  await page.locator('#flags').scrollIntoViewIfNeeded();await capture('CMP -32768 with 1: SF0 and OF1 make signed less true despite the positive wrapped subtraction result.');
  await page.locator('#step').click();assert.equal(await page.locator('[data-register="BX"] .register-value').textContent(),'0000');await page.locator('#registers').scrollIntoViewIfNeeded();await capture('JL follows SF versus OF and skips the sentinel write; unsigned below takes a different path.');
  for(let index=0;index<4;index++)await page.locator('#step').click();
  assert.equal(await page.locator('[data-flag="SF"] strong').textContent(),'1');assert.equal(await page.locator('[data-flag="OF"] strong').textContent(),'1');await page.locator('#flags').scrollIntoViewIfNeeded();await capture('CMP 32767 with -1: SF1 and OF1 mean signed greater, despite the negative wrapped result.');
  await page.locator('#step').click();await page.locator('#registers').scrollIntoViewIfNeeded();await capture('JG skips the second sentinel write; all branch instructions preserve the comparison flags.');
  await page.locator('#run').click();await page.waitForFunction(()=>document.getElementById('run-state').textContent==='HALTED');
  assert.equal(await page.locator('[data-register="BX"] .register-value').textContent(),'0000');await page.locator('#registers').scrollIntoViewIfNeeded();await capture('The exact 95-byte exercise halts with all signed, unsigned and equality markers; independent QEMU checks verify the same literal program.');
  await page.locator('#binary-editor').fill(await readFile(resolve(root,'docs/instruction-encoding/fixtures/carry-borrow.bits'),'utf8'));await page.locator('#load-program').click();
  for(let index=0;index<12;index++)await page.locator('#step').click();
  assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'0000');assert.equal(await page.locator('[data-flag="CF"] strong').textContent(),'1');await page.locator('#registers').scrollIntoViewIfNeeded();await capture('ADC propagates a low-word carry through FFFF; the middle result is zero with outgoing CF1.');
  for(let index=0;index<4;index++)await page.locator('#step').click();
  assert.equal(await page.locator('[data-register="DX"] .register-value').textContent(),'0001');await page.locator('#registers').scrollIntoViewIfNeeded();await capture('The extension word consumes carry: DX:CX:BX becomes 0001:0000:0000 after FFFFFFFF plus one.');
  for(let index=0;index<9;index++)await page.locator('#step').click();
  assert.equal(await page.locator('[data-register="BP"] .register-value').textContent(),'FFFF');await page.locator('#registers').scrollIntoViewIfNeeded();await capture('SBB propagates borrow across three zero words: BP:DI:SI becomes FFFF:FFFF:FFFF with outgoing CF1.');
  await page.locator('#run').click();await page.waitForFunction(()=>document.getElementById('run-state').textContent==='HALTED');
  assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'AB00');await page.locator('#memory-address').fill('02000');await page.locator('#memory-form').evaluate(form=>form.requestSubmit());await page.locator('#memory').scrollIntoViewIfNeeded();await capture('Byte ADC/SBB preserve AH as AB; both exact AB00 results are stored in model RAM, and the 81-byte program halts after32 steps.');
  await page.locator('#binary-editor').fill(await readFile(resolve(root,'examples/self-modifying/program.bits'),'utf8'));await page.locator('#load-program').click();
  for(let index=0;index<27;index++)await page.locator('#step').click();
  await page.locator('#memory-address').fill('07C3D');await page.locator('#memory-form').evaluate(form=>form.requestSubmit());assert.equal(await page.locator('[data-address="07C3D"]').textContent(),'41');await page.locator('#memory').scrollIntoViewIfNeeded();await capture('Before the self-write, the future MOV operand at07C3D contains literal41, uppercase A. This is model RAM.');
  await page.locator('#step').click();assert.equal(await page.locator('[data-address="07C3D"]').textContent(),'61');await page.locator('#memory').scrollIntoViewIfNeeded();await capture('The modeled byte store changes exactly bit5 of the future operand:41 becomes61, lowercase a.');
  await page.locator('#step').click();await page.locator('#step').click();assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'0061');await page.locator('#registers').scrollIntoViewIfNeeded();await capture('After JMP, live instruction fetch reads61 and loads AL with lowercase a rather than the unchanged source-file operand41.');
  await page.locator('#run').click();await page.waitForFunction(()=>document.getElementById('run-state').textContent==='HALTED');assert.equal(await page.locator('#serial-output').textContent(),'a');await page.locator('#serial-output').scrollIntoViewIfNeeded();await capture('The40-step model emits a and writes61 0F to VGA RAM. Separate native QEMU boots verify the same program; this browser GIF is simulation.');
  await page.locator('#binary-editor').fill('# emoji 🧪\n11110100 badtoken');await page.locator('#load-program').click();
  assert.equal(await page.locator('#binary-editor').evaluate(editor=>editor.value.slice(editor.selectionStart,editor.selectionEnd)),'badtoken');assert.equal(await page.locator('#serial-output').textContent(),'a');await page.locator('#binary-editor').scrollIntoViewIfNeeded();await capture('A failed binary load focuses and selects the exact invalid token; the loaded self-modifying program and its output remain intact.');
  await page.locator('#hex-editor').fill('F4 GG');await page.locator('#load-hex').click();
  assert.equal(await page.locator('#hex-editor').evaluate(editor=>editor.value.slice(editor.selectionStart,editor.selectionEnd)),'GG');await page.locator('#hex-editor').scrollIntoViewIfNeeded();await capture('A failed hexadecimal load selects GG in the relevant editor and preserves the loaded execution history.');
  await page.locator('#binary-editor').fill('11110100');assert.equal(await page.locator('#binary-editor').getAttribute('aria-invalid'),null);assert.equal(await page.locator('#serial-output').textContent(),'a');await page.locator('#binary-editor').scrollIntoViewIfNeeded();await capture('Correcting the binary draft clears stale error indicators; the new program replaces the loaded state only when Load is pressed.');
  await page.locator('#preset').selectOption('flags');await page.locator('#step').click();await page.locator('#step').click();
  assert.equal(await page.locator('[data-flag="CF"] strong').textContent(),'1');assert.equal(await page.locator('[data-flag="OF"] strong').textContent(),'0');
  await page.locator('#flags').scrollIntoViewIfNeeded();await capture('FFFF +1 wraps to0000 with unsigned CF=1 and signed OF=0; zero low-byte parity is even.');
  await page.locator('#step').click();assert.equal(await page.locator('[data-flag="CF"] strong').textContent(),'1');
  await page.locator('#flags').scrollIntoViewIfNeeded();await capture('INC changes AX to0001 while retaining the preceding carry; condition flags are not recomputed from the register alone.');
  const signedSource=await readFile(resolve(root,'challenges/signed-overflow/solution.bits'),'utf8');
  await page.locator('#binary-editor').fill(signedSource);await page.locator('#load-program').click();
  for(let count=0;count<3;count++)await page.locator('#step').click();
  assert.equal(await page.locator('[data-register="AX"] .register-value').textContent(),'8000');
  assert.equal(await page.locator('[data-flag="CF"] strong').textContent(),'0');assert.equal(await page.locator('[data-flag="OF"] strong').textContent(),'1');
  await page.locator('#flags').scrollIntoViewIfNeeded();await capture('The reviewed 7FFF +1 source gives8000 with CF=0 and OF=1 in the model; native QEMU flag checks are separate.');await encode();

  await begin('challenges');
  await page.goto(new URL('challenges/?id=repair-boot',base).href);
  await page.waitForFunction(()=>document.querySelector('#challenge-title').textContent.includes('boot'));
  await capture('Opened the three-bit real boot repair challenge.');
  await page.locator('#editable-bytes').scrollIntoViewIfNeeded();await capture('Inspected the locked/editable offsets and three-bit budget.');
  for(const [offset,bit] of [[1,7],[17,6],[17,7]]){await page.locator(`[data-offset="${offset}"][data-bit="${bit}"]`).click();await capture(`Flipped editable offset${offset}, MSB-index${bit}.`);}
  await page.locator('#validate').click();await page.locator('#result-panel').scrollIntoViewIfNeeded();
  assert.match(await page.locator('#result').textContent(),/Solved/);
  await capture('Deterministic browser goal checks passed; the curated solution is also QEMU-tested.');
  await capture('Held the solved challenge result and local progress count.');
  await page.goto(new URL('challenges/?id=direction-flag',base).href);
  await page.locator('#editable-bytes').waitFor({state:'visible'});
  const directionStart=await readFile(resolve(root,'challenges/direction-flag/start.bits'),'utf8');
  const directionSolution=await readFile(resolve(root,'challenges/direction-flag/solution.bits'),'utf8');
  assert.deepEqual(parseBits(await page.locator('#binary-source').inputValue()),parseBits(directionStart));
  await page.locator('#validate').click();assert.match(await page.locator('#result').textContent(),/goal is still unmet/);
  await page.locator('#result-panel').scrollIntoViewIfNeeded();await capture('The reviewed broken direction seed halts but fails the AB memory goal; both controls have separate native QEMU proof.');
  await page.locator('#editable-bytes').scrollIntoViewIfNeeded();await capture('Byte7 is FC: CLD advances DI after STOSB, placing A to the right of B.');
  await page.locator('[data-offset="7"][data-bit="7"]').click();
  assert.deepEqual(parseBits(await page.locator('#binary-source').inputValue()),parseBits(directionSolution));
  assert.equal(await page.locator('.editable-byte small').textContent(),'Starting source: CLD','immutable annotations must not claim to decode edited bytes');
  await capture('Flipped byte7 bit0 (the rightmost bit): FC becomes FD, selecting STD without changing any other byte.');
  await page.locator('#validate').click();assert.match(await page.locator('#result').textContent(),/Solved in 9/);
  await page.locator('#result-panel').scrollIntoViewIfNeeded();await capture('The repaired model writes A at0600 and B at0601, restores DF=0 and halts after nine steps. This is browser footage, not native execution.');await encode();
  await begin('byte-order');await page.goto(base+'learn/');
  await page.waitForFunction(()=>document.querySelector('#lesson-branch').textContent.includes('JMP -6'));
  await page.locator('#byte-order-title').scrollIntoViewIfNeeded();
  await capture('The learning path starts with the actual six handwritten bytes, linked byte and word values, and inspection-only controls.');
  await page.locator('#lesson-bit').click();
  assert.equal(await page.locator('#lesson-word').textContent(),'B8 35 12 → MOV AX, 4661 (0x1235)');
  await capture('Flipping bit0 changes the immediate low byte from52 to53 and the whole word from4660 to4661.');
  await page.locator('#lesson-swap').click();await page.locator('#lesson-word').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('#lesson-word').textContent(),'B8 12 35 → MOV AX, 13586 (0x3512)');
  await capture('Swapping the two edited immediate bytes changes the word to3512 without changing its MOV opcode.');
  await page.locator('#lesson-sign').click();await page.locator('#lesson-branch').scrollIntoViewIfNeeded();
  assert.match(await page.locator('#lesson-branch').textContent(),/JMP \+122.*0x7C80/);
  await capture('The branch sign-bit flip turns FA (-6) into7A (+122), placing the calculated target outside this fragment. No instruction executes.');
  await page.locator('#lesson-reset').click();
  assert.equal(await page.locator('#lesson-word').textContent(),'B8 34 12 → MOV AX, 4660 (0x1234)');
  assert.match(await page.locator('#lesson-boundary').textContent(),/offset 0 inside/);
  await capture('Reset restores the six source bytes and the original backward branch to7C00.');await encode();
  assert.deepEqual(errors,[]);
  const hashes={};
  for(const source of ['tools/record_browser.mjs','boot/boot.bits','site/elf.mjs','site/elf/index.html','site/elf/app.mjs','site/elf/elf.css','site/elf/catalog.json','site/downloads/exit-code-small.elf','site/downloads/exit-code.elf','site/styles.css','site/learn/routes.css','site/app.js','site/bit-diff.mjs','site/bit-diff/index.html','site/bit-diff/app.mjs','site/bit-diff/diff.css','site/encoding.mjs','site/encoding-presets.mjs','site/playground/index.html','docs/instruction-encoding/fixtures/mov32.bits','docs/instruction-encoding/fixtures/mov64.bits','docs/instruction-encoding/fixtures/mov-register.bits','docs/instruction-encoding/fixtures/mov-register64.bits','docs/instruction-encoding/fixtures/mov-byte.bits','docs/instruction-encoding/fixtures/mov-byte-rex.bits','docs/instruction-encoding/fixtures/mov-memory-bp.bits','docs/instruction-encoding/fixtures/mov-memory-absolute.bits','docs/instruction-encoding/fixtures/mov-memory-pair.bits','docs/instruction-encoding/fixtures/mov-register-reverse.bits','docs/instruction-encoding/fixtures/mov-memory-positive.bits','docs/instruction-encoding/fixtures/mov32-next.bits','site/address16.mjs','site/simulator.mjs','site/binary.mjs','site/history.mjs','site/program-link.mjs','site/boot-builder/index.html','site/boot-builder/builder.css','site/boot-builder/model.mjs','site/boot-builder/app.mjs','site/cpu-lab/index.html','site/cpu-lab/lab.css','site/cpu-lab/lab.mjs','site/cpu-lab/presets.mjs','site/cpu-lab/memory-program.mjs','docs/instruction-encoding/fixtures/memory-mov-program.bits','site/challenges/index.html','site/challenges/challenges.css','site/challenges/challenges.mjs','site/challenges/catalog.json','challenges/catalog.json']){
    hashes[source]=createHash('sha256').update(await readFile(resolve(root,source))).digest('hex');
  }
  const metadata={kind:'Actual browser screenshots of instruction inspection and bounded educational simulation; not native CPU or QEMU footage',browser:browser.version(),viewport:{width:1280,height:960},presentationFps:1,alterations:'960px resize and GIF palette encoding only; each frame is an actual captured browser state. Step pacing is for explanation, not a benchmark.',sourceSha256:hashes,captures,reproduce:'make site-test && npm ci && npx playwright install chromium && npm run record:browser',requires:'ffmpeg and ffprobe; PLAYWRIGHT_CHROMIUM_EXECUTABLE may select an installed Chrome'};
  const branchSource='docs/instruction-encoding/fixtures/signed-branches.bits';
  metadata.sourceSha256[branchSource]=createHash('sha256').update(await readFile(resolve(root,branchSource))).digest('hex');
  const carrySource='docs/instruction-encoding/fixtures/carry-borrow.bits';
  metadata.sourceSha256[carrySource]=createHash('sha256').update(await readFile(resolve(root,carrySource))).digest('hex');
  for(const preset of presets)metadata.sourceSha256[preset.sourcePath]=createHash('sha256').update(await readFile(resolve(root,preset.sourcePath))).digest('hex');
  for(const name of ['program','control']) {const source=`examples/self-modifying/${name}.bits`;metadata.sourceSha256[source]=createHash('sha256').update(await readFile(resolve(root,source))).digest('hex');}
  for(const name of ['short-branch','short-branch-inverse']) {const source=`docs/instruction-encoding/fixtures/${name}.bits`;metadata.sourceSha256[source]=createHash('sha256').update(await readFile(resolve(root,source))).digest('hex');}
  for(const name of ['start','solution']) {const source=`challenges/direction-flag/${name}.bits`;metadata.sourceSha256[source]=createHash('sha256').update(await readFile(resolve(root,source))).digest('hex');}
  for(const name of ['exit-code','exit-code-small']) {const source=`examples/${name}/program.bits`;metadata.sourceSha256[source]=createHash('sha256').update(await readFile(resolve(root,source))).digest('hex');}
  for(const source of ['site/learn/index.html','site/learn/byte-order.mjs','site/learn/byte-order-source.mjs','docs/tutorials/byte-order.bits'])metadata.sourceSha256[source]=createHash('sha256').update(await readFile(resolve(root,source))).digest('hex');
  const signedSourcePath='challenges/signed-overflow/solution.bits';metadata.sourceSha256[signedSourcePath]=createHash('sha256').update(await readFile(resolve(root,signedSourcePath))).digest('hex');
  await writeFile(resolve(root,'assets/browser-demo-recording.json'),JSON.stringify(metadata,null,2)+'\n');
  console.log(`Recorded ${captures.length} genuine browser GIFs with frame/source hashes and explicit inspection/simulation provenance.`);
} finally {await browser?.close();await new Promise(resolve=>server.close(resolve));}
