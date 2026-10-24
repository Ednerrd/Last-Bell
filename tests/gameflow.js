// Clicks through game.html headless (390x844, phone): title -> new career -> hub -> offers -> sign -> camp (WORK=drill|spar|tape) -> fight (run to the end) -> result -> hub.
//   node tests/gameflow.js [WORK]   screenshots in shots/g_*.png, page errors printed
const { chromium } = require('playwright');
(async () => {
  const work = process.argv[2] || 'tape', b = await chromium.launch(), pg = await b.newPage({ viewport: { width: 390, height: 844 } }), errs = [];
  pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('file://' + require('path').resolve('game.html')); await pg.waitForTimeout(800);
  const shot = async n => pg.screenshot({ path: `shots/g_${n}.png`, fullPage: true }), click = async s => { await pg.click(s); await pg.waitForTimeout(250); };
  await shot('1title'); await click('[data-act="newSlot"]'); await shot('2create');
  await click('[data-act="startCareer"]'); await shot('3hub');
  await click('[data-act="offers"]'); await shot('4offers');
  await click('[data-act="sign"][data-i="1"]'); await click(`[data-act="pwork"][data-v="${work}"]`); await shot('5camp');
  await click('[data-act="runCamp"]'); await pg.waitForSelector('.modal [data-ok]', { timeout: 30000 }); await shot('6report');
  await click('.modal [data-ok]'); await pg.waitForTimeout(1500); await shot('7fight');
  await pg.evaluate(() => { while (F.phase !== 'over') { F.step(DT); if (F.phase === 'corner') F.nextRound(F.aiStrategy(0), F.aiStrategy(1)); F.events = []; } FX.mode = 'done'; resultScreen(); });
  await pg.waitForTimeout(300); await shot('8result');
  console.log('result:', (await pg.innerText('.verdict')).replace(/\n/g, ' | '), '\nlearned:', await pg.evaluate(() => (document.querySelector('.learned') || {}).innerText));
  await click('[data-act="afterFight"]'); await shot('9hub');
  console.log('saved:', await pg.evaluate(() => { const s = JSON.parse(localStorage.getItem(Store.KEY)); return s[0].player.name + ' ' + rec(s[0].player.record) + ', ' + JSON.stringify(s[0]).length + ' bytes'; }));
  console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no errors'); await b.close();
})();
