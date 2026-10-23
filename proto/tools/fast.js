// Fast, deterministic runs for the headless tools: Math.random seeded, the page's frames driven at a fixed fps
// with rendering off (two builds compare on the same fight, and a minute of fight takes seconds).
//   const fast = require('./fast'); const pg = await fast.open(browser, file, seed); await fast.run(pg, secs[, perFrameJs]);
exports.open = async (b, file, seed = 7, w = 120, h = 90) => {
  const pg = await b.newPage({ viewport: { width: w, height: h } });
  pg.errs = []; pg.on('pageerror', e => pg.errs.push('PAGEERR ' + e.message));
  await pg.addInitScript(`(()=>{let s=${+seed}>>>0;Math.random=()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};
    window.__rq=null;window.__now=1000;window.requestAnimationFrame=cb=>{window.__rq=cb;return 1};})()`);
  await pg.goto('file://' + require('path').resolve(file));
  await pg.waitForFunction('window.__rq && window.__dbg');
  await pg.evaluate(`__dbg.__render=__dbg.renderer.render.bind(__dbg.renderer);__dbg.renderer.render=()=>{};`);
  return pg;
};
exports.run = (pg, secs, each = '', fps = 30) => pg.evaluate(`(()=>{const N=${+secs}*${fps};for(let n=0;n<N;n++){__now+=1000/${fps};const cb=__rq;__rq=null;cb(__now);${each}}})()`);
