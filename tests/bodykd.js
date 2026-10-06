const S=require('./sim.js');const st=Object.keys(S.STYLES).filter(k=>!S.STYLES[k].special);
const kd={},ev={},n=+process.argv[2]||300;let bodyLand=0,fights=0;
for(let i=0;i<n;i++){const a=st[i%5],b=st[(i/5|0)%5];const f=new S.Fight(S.sheet(75,a,S.rollGuard(a),15),S.sheet(75,b,S.rollGuard(b),15),{rounds:10});
 const o=f.knockdown.bind(f); f.knockdown=(D,A,how,lv)=>{const k=lv?'liver':how||'head';kd[k]=(kd[k]||0)+1;return o(D,A,how,lv)};
 const oe=f.emit.bind(f); f.emit=(t,e)=>{if(t==='liver'||t==='wind')ev[t]=(ev[t]||0)+1;return oe(t,e)};
 let k=0;while(f.phase!=='over'&&k<900000){f.step();k++;if(f.phase==='corner')f.nextRound(f.aiStrategy(0),f.aiStrategy(1));}
 for(const F of f.f)bodyLand+=F.tot.landed.body;fights++;}
console.log('knockdowns by type',kd,'liver/wind shots',ev,'body landed/fight',(bodyLand/fights).toFixed(1));
