const fs=require('fs');const src=fs.readFileSync('index.html','utf8');
const a=src.indexOf('/* ===== LAST BELL : engine'), r=src.indexOf('/* ===== LAST BELL : render'), c=src.indexOf('const Comm = '), u=src.indexOf('/* ===== LAST BELL : ui part 1');
const api=new Function('window','Sfx',src.slice(a,r)+src.slice(c,u)+';return {Fight,Comm,genStats,rollGuard,STYLES};')({},{on:false});
const st=Object.keys(api.STYLES),cnt={};
for(let i=0;i<40;i++){const mk=()=>{const s=st[i%5];return {name:'A B',style:s,guard:api.rollGuard(s),stance:'orthodox',stats:api.genStats(78,s),wear:0,exp:20}};
 const f=new api.Fight(mk(),mk(),{rounds:10});api.Comm.reset();let n=0;
 while(f.phase!=='over'&&n++<600000){f.step();for(const e of f.stepEv){for(const l of api.Comm.handle(e,f,f.t)){cnt[e.type]=(cnt[e.type]||0)+1; if(Math.random()<.004&&l.kind==='pbp')console.log(' ',e.type,'->',l.text);}}
  if(f.phase==='corner')f.nextRound(f.aiStrategy(0),f.aiStrategy(1));}}
console.log(JSON.stringify(cnt));
