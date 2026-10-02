const S=require('./sim.js');const N=+process.argv[2]||400;const st=Object.keys(S.STYLES).filter(k=>!S.STYLES[k].special);
const A={rounds:0,thr:0,ld:0,jT:0,jL:0,pT:0,pL:0,bT:0,bL:0,kd:0,fights:0,stop:0,ko:0,tko:0,cut:0,rtd:0,dec:0,ud:0,sd:0,md:0,draw:0,koRound:{},sched:{}};
const gapB={};
for(let i=0;i<N;i++){const base=60+Math.random()*30|0;const gap=[0,3,6,10][i%4];
 const mk=(r)=>{const s=st[Math.random()*5|0];return S.sheet(r,s,S.rollGuard(s),Math.random()*30|0)};
 const fav=mk(base+gap/2|0),dog=mk(base-gap/2|0); const rounds=[8,10,12][i%3];
 const f=S.run(fav,dog,{rounds}); A.fights++;
 const r=f.result; const rr=r.round; A.rounds+=r.decision?rounds:rr-.5;
 for(const F of f.f){A.thr+=F.tot.thrown.jab+F.tot.thrown.power+F.tot.thrown.body;A.ld+=F.tot.landed.jab+F.tot.landed.power+F.tot.landed.body;
  A.jT+=F.tot.thrown.jab;A.jL+=F.tot.landed.jab;A.pT+=F.tot.thrown.power;A.pL+=F.tot.landed.power;A.bT+=F.tot.thrown.body;A.bL+=F.tot.landed.body;A.kd+=F.kd;}
 if(r.decision){A.dec++;const m=r.method;if(m==='UD')A.ud++;else if(m==='SD')A.sd++;else if(m==='MD')A.md++;else A.draw++; A.dm=A.dm||{}; A.dm[m]=(A.dm[m]||0)+1;}
 else{A.stop++;const m=r.method;if(m==='KO')A.ko++;else if(/cut/.test(m))A.cut++;else if(m==='RTD')A.rtd++;else A.tko++;const b=Math.min(rounds,rr)/rounds;const k=b<=.34?'early':b<=.67?'mid':'late';A.koRound[k]=(A.koRound[k]||0)+1;}
 const g=gapB[gap]=gapB[gap]||{w:0,l:0,d:0};if(r.winner===0)g.w++;else if(r.winner===1)g.l++;else g.d++;
}
const pr=(x)=>x.toFixed(1);const fr=A.rounds*2;
console.log(`per fighter per round: thrown ${pr(A.thr/fr)} landed ${pr(A.ld/fr)} conn ${pr(100*A.ld/A.thr)}%`);
console.log(`jab ${pr(A.jT/fr)}/rd conn ${pr(100*A.jL/A.jT)}% | power(head) ${pr(A.pT/fr)}/rd conn ${pr(100*A.pL/A.pT)}% | body ${pr(A.bT/fr)}/rd conn ${pr(100*A.bL/A.bT)}%`);
console.log(`KDs per fight ${pr(A.kd/A.fights)} | stoppages ${pr(100*A.stop/A.fights)}% (KO ${A.ko} TKO ${A.tko} cut ${A.cut} RTD ${A.rtd}) | stop timing ${JSON.stringify(A.koRound)}`);
console.log(`decisions: UD ${A.ud} SD ${A.sd} MD ${A.md} draw ${A.draw} of ${A.dec} ${JSON.stringify(A.dm)}`);
for(const g in gapB){const o=gapB[g];console.log(`OVR gap ${g}: favorite wins ${pr(100*o.w/(o.w+o.l+o.d))}% (draws ${o.d})`);}
