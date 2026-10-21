// KD probe (step d): where knockdowns come from. Tags each head KD path (flash, accum = the worn-head roll, zero = head <= 0) on a temp copy, then runs audit-style fights.
// node tests/kdwhy.js 100   (run x4 for ~400; read: share by path, counter/caught, crit, crit on a fresh head, fate, stops with a KD in the round)
const fs=require('fs'),os=require('os'),path=require('path');
let src=fs.readFileSync(process.env.LB||'index.html','utf8');const tag=(re,w,fr)=>{const n=src.replace(re,`$1this._why={w:"${w}",P,c:caught||A.counterWin>0,fr:${fr},crit};$2`);if(n===src)throw new Error('kdwhy: tag not found: '+w);src=n;};
tag(/(if \(D\.head <= 0\) \{ )(this\.knockdown\(D, A, 'head'\))/,'zero','0');
tag(/(if \(R\(\) < fk\) \{ )(this\.knockdown\(D, A, 'head'\))/,'flash','1-D.head/D.headMax');
tag(/(if \(R\(\) < kc\) \{ )(this\.knockdown\(D, A, 'head'\))/,'accum','1-D.head/D.headMax');
const tmp=path.join(os.tmpdir(),'kdwhy-'+process.pid+'.html');fs.writeFileSync(tmp,src);process.env.LB=tmp;process.on('exit',()=>{try{fs.unlinkSync(tmp)}catch(e){}});
const S=require('./sim.js');const N=+process.argv[2]||400;const st=Object.keys(S.STYLES).filter(k=>!S.STYLES[k].special);
const out={fights:0,kd:0,why:{},kind:{},whyCtr:{},rd:{},frB:{},fate:{},stop:{},stopAfterKD:0,stopWhy:{},kdFights:0,rdSeen:{},crit:{},critFresh:{}};
const inc=(o,k,v=1)=>o[k]=(o[k]||0)+v;
for(let i=0;i<N;i++){const base=60+Math.random()*30|0;const gap=[0,3,6,10][i%4];
 const mk=r=>{const s=st[Math.random()*5|0];return S.sheet(r,s,S.rollGuard(s),Math.random()*30|0)};
 const rounds=[8,10,12][i%3];const f=new S.Fight(mk(base+gap/2|0),mk(base-gap/2|0),{rounds});
 const ok=f.knockdown.bind(f);let kds=[];
 f.knockdown=(D,A,z,lv)=>{const w=z==='body'?(lv?'liver':'body'):(f._why?f._why.w:'?');const P=f._why&&z!=='body'?f._why.P:null;
  const rec={cr:f._why?!!f._why.crit:false,w,kind:P?(P.cat==='jab'?'jab':P.kind):z,c:f._why?f._why.c:false,fr:f._why?f._why.fr:0,rd:f.round,rel:f.round/rounds,dog:D.side===0?'fav':'dog',n:D.kd+1};kds.push(rec);f._why=null;return ok(D,A,z,lv)};
 const oe=f.emit.bind(f);let lastStop=null;f.emit=(t,e)=>{if(t==='stoppage')lastStop=e.why;return oe(t,e)};
 let k=0;while(f.phase!=='over'&&k<900000){f.step();k++;if(f.phase==='corner')f.nextRound(f.aiStrategy(0),f.aiStrategy(1));}
 out.fights++;out.kd+=kds.length;if(kds.length)out.kdFights++;
 const r=f.result;
 for(const x of kds){inc(out.why,x.w);inc(out.kind,x.w+':'+x.kind);if(x.c)inc(out.whyCtr,x.w);if(x.cr)inc(out.crit,x.w);if(x.cr&&x.fr<.3)inc(out.critFresh,x.w);const b=x.rel<=.34?'early':x.rel<=.67?'mid':'late';inc(out.rd,x.w+':'+b);
  const fb=x.fr<.3?'<30':x.fr<.6?'30-60':'60+';inc(out.frB,x.w+':'+fb);}
 // fate of each KD: last one could end it
 kds.forEach((x,j)=>{const last=j===kds.length-1;let fate='up';if(last&&!r.decision&&r.round===x.rd){fate=r.method==='KO'?'KO':'TKO-sameRd';}inc(out.fate,x.w+':'+fate);});
 if(!r.decision){const why=r.method==='KO'?'KO':lastStop||r.method;inc(out.stop,why);if(kds.some(x=>x.rd===r.round))out.stopAfterKD++;}
}
const F=out.fights;console.log('fights',F,'KD/fight',(out.kd/F).toFixed(2),'fights w/ a KD',(100*out.kdFights/F).toFixed(1)+'%');
for(const w in out.why)console.log(w,(out.why[w]/F).toFixed(3),'/fight','share',(100*out.why[w]/out.kd).toFixed(1)+'%','counter/caught',(100*(out.whyCtr[w]||0)/out.why[w]).toFixed(0)+'%');
console.log('by kind',JSON.stringify(out.kind));console.log('by part of fight',JSON.stringify(out.rd));console.log('head damage share when dropped',JSON.stringify(out.frB));
console.log('fate',JSON.stringify(out.fate));console.log("crit",JSON.stringify(out.crit),"crit+fresh",JSON.stringify(out.critFresh));
const sT=Object.values(out.stop).reduce((a,b)=>a+b,0);console.log('stops',(100*sT/F).toFixed(1)+'%',JSON.stringify(out.stop),'stop rounds with a KD in them',(100*out.stopAfterKD/sT).toFixed(0)+'%');
