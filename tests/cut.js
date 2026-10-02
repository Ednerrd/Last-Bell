const S=require('./sim.js');const N=+process.argv[2];const st=Object.keys(S.STYLES),gs=Object.keys(S.GUARDS);
let cut=0,stop=0,cutAny=0,doc=0;
for(let i=0;i<N;i++){const r=60+Math.random()*28|0;
 const mk=()=>{const s=st[Math.random()*5|0];return S.sheet(r+(Math.random()*8-4|0),s,S.rollGuard(s),Math.random()*30|0)};
 const f=S.run(mk(),mk(),{rounds:[6,8,10,12][i%4]});
 if(/cut/.test(f.result.method))cut++; if(!f.result.decision)stop++; if(f.events.some(e=>e.type==='cut'))cutAny++; if(f.events.some(e=>e.type==='doctorLook'))doc++;}
console.log('cutTKO',(100*cut/N).toFixed(1)+'%','stops',(100*stop/N).toFixed(0)+'%','anyCut',(100*cutAny/N).toFixed(0)+'%','docLook',(100*doc/N).toFixed(0)+'%');
