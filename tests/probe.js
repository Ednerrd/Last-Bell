const S=require('./sim.js');const st=Object.keys(S.STYLES);const kdR={},stopR={};let early=0,earlyFin=0,why={};
for(let i=0;i<300;i++){const r=60+Math.random()*30|0;const mk=()=>{const s=st[Math.random()*5|0];return S.sheet(r,s,S.rollGuard(s),10)};
 const f=S.run(mk(),mk(),{rounds:10});
 for(const e of f.events){ if(e.type==='knockdown'){kdR[e.round]=(kdR[e.round]||0)+1;} if(e.type==='stoppage')why[e.why]=(why[e.why]||0)+1;}
 if(!f.result.decision)stopR[f.result.round]=(stopR[f.result.round]||0)+1;}
console.log('KDs by round',JSON.stringify(kdR));console.log('stops by round',JSON.stringify(stopR));console.log('stop why',JSON.stringify(why));
