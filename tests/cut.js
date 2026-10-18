// cuts and swelling (1e): node tests/cut.js N [seed]. How often a man gets cut, how often the doctor looks and stops it, eyes swollen and shut,
// and where the head shots go once he's damaged: the share of clean head shots landing on the damaged eye's side, by the puncher's level
const S=require('./sim.js');const N=+process.argv[2]||200;const st=Object.keys(S.STYLES).filter(k=>!S.STYLES[k].special);
let seed=+(process.argv[3]||7);const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
const A={cut:0,eye:0,stop:0,cutAny:0,docLook:0,eyeLook:0,swell:0,shut:0,swMax:0,n:0};const aim={};
for(let i=0;i<N;i++){const r=60+rnd()*28|0;
 const mk=()=>{const s=st[rnd()*5|0];return S.sheet(r+(rnd()*8-4|0),s,S.rollGuard(s),rnd()*30|0)};
 const f=S.run(mk(),mk(),{rounds:[6,8,10,12][i%4]});A.n++;
 const m=f.result.method||'';if(/cut/.test(m))A.cut++;if(/eye/.test(m))A.eye++;if(!f.result.decision)A.stop++;
 const ev=f.events;if(ev.some(e=>e.type==='cut'))A.cutAny++;if(ev.some(e=>e.type==='doctorLook'&&!e.eye))A.docLook++;if(ev.some(e=>e.type==='doctorLook'&&e.eye))A.eyeLook++;
 if(ev.some(e=>e.type==='swell'))A.swell++;if(ev.some(e=>e.type==='eyeShut'))A.shut++;
 for(const F of f.f)A.swMax+=Math.max(F.sw?F.sw.L:0,F.sw?F.sw.R:0)/2;
 // where the clean head shots go: once the man has a cut or a swelling side, the share on that side (lane: an uppercut counts half)
 const dmgS=[{},{}];for(const e of ev){if(e.type==='cut'&&e.fresh)dmgS[e.d].cut=e.side;if(e.type==='swell')dmgS[e.d].sw=dmgS[e.d].sw||e.side;
  if(e.type==='hit'&&e.zone==='head'&&!e.blocked){const t=dmgS[e.d],sd=t.cut||t.sw;if(!sd)continue;const lv=S.levelOf?S.levelOf(f.f[e.a].sheet).key:'all';const k=aim[lv]=aim[lv]||{on:0,n:0};k.n++;k.on+=e.lane==='under'?.5:e.side===sd?1:0;}}}
const pc=x=>(100*x/A.n).toFixed(1)+'%';
console.log(`fights ${A.n} | stops ${pc(A.stop)} | cut TKO ${pc(A.cut)} eye TKO ${pc(A.eye)} | any cut ${pc(A.cutAny)} doc looks (cut) ${pc(A.docLook)} (eye) ${pc(A.eyeLook)} | eye swelling ${pc(A.swell)} shut ${pc(A.shut)} | avg worst eye at the end ${(A.swMax/A.n).toFixed(2)}`);
console.log('head shots on the damaged side, by the puncher\'s level: '+Object.keys(aim).sort().map(k=>`${k} ${(100*aim[k].on/aim[k].n).toFixed(1)}% (${aim[k].n})`).join(' | '));
