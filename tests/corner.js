// corner policies in mirrors: side X's corner by a policy, the other corner by another. Sides swap every fight (no side-A edge).
// node tests/corner.js 600 82 ai/none,auto/none,pressure/none [auto/none]   (policy = plan/live; TAG=x pools into /tmp/corner_x.txt; node tests/corner.js agg x)
//   plan: auto (silent), ai (f.aiStrategy), or a fixed plan every round (pressure, move, body, counter, ko, survive, up, down)
//   live: none, smart (tests/shout.js smart, both sides), oracle (best shoutFit > .5), ai (the engine's own AI corner shouts, if it has them)
if(process.argv[2]==='agg'){ const L=require('fs').readFileSync('/tmp/corner_'+process.argv[3]+'.txt','utf8').trim().split('\n').map(JSON.parse), a={};
  for(const r of L){ const k=r.p+' vs '+r.o, o=a[k]=a[k]||{w:0,l:0,n:0}; o.w+=r.w; o.l+=r.l; o.n+=r.n; }
  for(const k in a){ const o=a[k], p=o.w/(o.w+o.l); console.log(k.padEnd(28),(100*p).toFixed(1)+'%','±'+(100*Math.sqrt(p*(1-p)/(o.w+o.l))).toFixed(1),'n'+o.n); }
  return; }
const S=require('./sim.js');
const N=+process.argv[2]||300, RT=+process.argv[3]||82, pols=(process.argv[4]||'ai/none,auto/none').split(','), opp=process.argv[5]||'auto/none';
const styles=Object.keys(S.STYLES).filter(k=>!S.STYLES[k].special), gs=Object.keys(S.GUARDS), keys=Object.keys(S.SHOUTS);
const hurt=X=>X.state==='stun'||X.head<X.headMax*.35;
function smart(f,s){ const F=f.f[s],O=F.op;
  if(hurt(F)) return 'hands';
  if(hurt(O)) return 'press';
  if(f.trapped(F)) return 'move';
  if(F.stam<F.stamMax*.4) return 'move';
  if(O.guard==='high'||O.guard==='cross'||O.body<60) return 'body';
  return F.rs.landedPow+F.rs.landedJab<O.rs.landedPow+O.rs.landedJab ? 'counter' : 'jab';
}
const oracle=(f,s)=>{ let best=null,bf=.5; for(const k of keys){ const v=f.shoutFit(f.f[s],k); if(v>bf){bf=v;best=k;} } return best; };
const LIVE={none:null, smart:{gap:8,f:smart}, oracle:{gap:4,f:oracle}};
const plan=(f,s,p)=>p==='auto'?'auto':p==='ai'?f.aiStrategy(s):p;
for(const p of pols){ let w=0,l=0,d=0,shouts=0; const [pp,pl]=p.split('/'), [op,ol]=opp.split('/');
  const stP=process.env.STY?process.env.STY.split(','):styles, gP=process.env.GRD?process.env.GRD.split(','):gs;
  for(let i=0;i<N;i++){ const st=stP[i%stP.length], g=gP[(i/stP.length|0)%gP.length], me=i&1;
    const A=S.sheet(RT,st,g), B=Object.assign({},A,{stats:Object.assign({},A.stats)});
    const f=new S.Fight(A,B,{rounds:10}); let n=0; const next=[3,3], PL=[], LV=[];
    PL[me]=pp; LV[me]=pl; PL[1-me]=op; LV[1-me]=ol;
    if(f.aiCorner) f.aiCorner=[LV[0]==='ai',LV[1]==='ai'];
    while(f.phase!=='over'&&n<600000){ f.step(); n++;
      if(f.phase==='fight') for(let s=0;s<2;s++){ const P=LIVE[LV[s]]; if(!P||f.t<next[s]) continue;
        const k=P.f(f,s), O=f.f[s].order; if(k&&!(O&&O.k===k&&O.t>6)){ f.shout(s,k); next[s]=f.t+P.gap; } else next[s]=f.t+.5; }
      if(f.phase==='corner') f.nextRound(plan(f,0,PL[0]),plan(f,1,PL[1]));
      for(const e of f.events) if(e.type==='shout'&&e.a===me) shouts++; f.events=[];
    }
    const r=f.result.winner; if(r===me)w++; else if(r===1-me)l++; else d++;
  }
  require('fs').appendFileSync('/tmp/corner_'+(process.env.TAG||'x')+'.txt',JSON.stringify({p,o:opp,RT,w,l,d,n:N,shouts})+'\n');
  const pc=w/(w+l);
  console.log((p+' vs '+opp).padEnd(28),(100*pc).toFixed(1)+'%','±'+(100*Math.sqrt(pc*(1-pc)/(w+l))).toFixed(1),'n'+N,'draws',d,'shouts/fight',(shouts/N).toFixed(1));
}
