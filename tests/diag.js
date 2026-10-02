const S=require('./sim.js');
const N=+process.argv[2]||60, RT=+process.argv[3]||82, only=process.argv[4];
const styles=Object.keys(S.STYLES).filter(k=>!S.STYLES[k].special);
const gs=only?only.split(','):Object.keys(S.GUARDS).filter(g=>g!=='standard');
for(const g of gs){
  let w=0,l=0,ko=0,cutT=0; const me={th:0,ld:0,dm:0,ctr:0,ev:0,bl:0}, op={th:0,ld:0,dm:0,ctr:0,ev:0,bl:0};
  for(let i=0;i<N;i++){ const st=styles[i%5];
    const A=S.sheet(RT,st,g), B=Object.assign({},A,{guard:'standard',stats:Object.assign({},A.stats)});
    const side=i%2; const f=side?S.run(B,A,{rounds:10}):S.run(A,B,{rounds:10});
    const win=f.result.winner; if(win!=null){ if(win===side)w++; else l++; }
    if(!f.result.decision)ko++; if(/cut/.test(f.result.method))cutT++;
    for(const e of f.events){
      const who = e.a===side?me:e.a===1-side?op:null; if(!who)continue;
      if(e.type==='throw')who.th++;
      if(e.type==='hit'){ if(e.blocked)who.bl++; else who.ld++; who.dm+=e.dmg; }
      if(e.type==='miss'&&e.why==='evade')who.ev++;
      if(e.type==='counterTry')who.ctr++; if(e.type==='knockdown'){(e.d===side?op:me).kd=((e.d===side?op:me).kd||0)+1;}
    }
  }
  const f=o=>`th${(o.th/N|0)} land${(100*o.ld/o.th).toFixed(0)}% blk${(100*o.bl/o.th).toFixed(0)}% ev${(100*o.ev/o.th).toFixed(0)}% dmg${(o.dm/N|0)} ctr${(o.ctr/N|0)} kd${((o.kd||0)/N).toFixed(2)}`;
  console.log(g.padEnd(9),'win',(100*w/(w+l)).toFixed(0)+'%','stop',(100*ko/N|0)+'%','| me:',f(me),'| opp:',f(op));
}
