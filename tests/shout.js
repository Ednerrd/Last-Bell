// coach shouts: side 0's corner yells by a policy, side 1 stays quiet. Mirrored stats.
// node tests/shout.js 400 82 none,smart,random,spam   (TAG=x pools into /tmp/shout_x.txt; node tests/shout.js agg x)
if(process.argv[2]==='agg'){ const L=require('fs').readFileSync('/tmp/shout_'+process.argv[3]+'.txt','utf8').trim().split('\n').map(JSON.parse), a={};
  for(const r of L){ const o=a[r.p]=a[r.p]||{w:0,l:0,n:0}; o.w+=r.w; o.l+=r.l; o.n+=r.n; }
  for(const k in a){ const o=a[k], p=o.w/(o.w+o.l); console.log(k.padEnd(13),(100*p).toFixed(1)+'%','±'+(100*Math.sqrt(p*(1-p)/(o.w+o.l))).toFixed(1),'n'+o.n); }
  return; }
const S=require('./sim.js');
const N=+process.argv[2]||300, RT=+process.argv[3]||82, pols=(process.argv[4]||'none,smart,random,spam').split(',');
const styles=Object.keys(S.STYLES).filter(k=>!S.STYLES[k].special), gs=Object.keys(S.GUARDS), keys=Object.keys(S.SHOUTS);
function smart(f){
  const F=f.f[0],O=F.op;
  if(F.state==='stun'||F.head<F.headMax*.35) return 'hands';
  if(O.state==='stun'||O.head<O.headMax*.35) return 'press';
  if(f.trapped(F)) return 'move';
  if(F.stam<F.stamMax*.4) return 'move';
  if(O.guard==='high'||O.guard==='cross'||O.body<60) return 'body';
  return F.rs.landedPow+F.rs.landedJab<O.rs.landedPow+O.rs.landedJab ? 'counter' : 'jab';
}
const hurt=X=>X.state==='stun'||X.head<X.headMax*.35;
const C=(cond,k)=>({gap:4,f:f=>cond(f,f.f[0],f.f[1])?k:null});
const COND={
  c_hands:C((f,F)=>hurt(F),'hands'), c_press:C((f,F,O)=>hurt(O),'press'), c_move:C((f,F)=>f.trapped(F),'move'),
  c_body:C((f,F,O)=>O.guard==='high'||O.guard==='cross','body'), c_counter:C((f,F,O)=>/swarmer|slugger/.test(O.sheet.style),'counter'),
  c_jab:C((f,F,O)=>O.sheet.style==='counter','jab'),
  b_press:C((f,F)=>hurt(F),'press'), b_hands:C((f,F,O)=>hurt(O),'hands'), b_counter:C((f,F,O)=>/outboxer|counter/.test(O.sheet.style),'counter')
};
const oracle=f=>{ let best=null,bf=.5; for(const k of keys){ const v=f.shoutFit(f.f[0],k); if(v>bf){bf=v;best=k;} } return best; };
const worst=f=>{ let best=null,bf=2; for(const k of keys){ const v=f.shoutFit(f.f[0],k); if(v<bf){bf=v;best=k;} } return best; };
const POL={none:null, ...COND, oracle:{gap:4,f:oracle}, worst:{gap:8,f:worst}, ...Object.fromEntries(keys.map(k=>['only_'+k,{gap:8,f:()=>k}])), smart:{gap:8,f:smart}, random:{gap:8,f:()=>keys[Math.random()*keys.length|0]}, spam:{gap:2,f:smart}};
for(const p of pols){ let w=0,l=0,d=0,heard=0,shouts=0,ign=0;
  const stP=process.env.STY?process.env.STY.split(','):styles, gP=process.env.GRD?process.env.GRD.split(','):gs; // optional matchup filter
  for(let i=0;i<N;i++){ const st=stP[i%stP.length], g=gP[(i/stP.length|0)%gP.length];
    const A=S.sheet(RT,st,g), B=Object.assign({},A,{stats:Object.assign({},A.stats)});
    const f=new S.Fight(A,B,{rounds:10}); let n=0,next=3; const P=POL[p];
    while(f.phase!=='over'&&n<600000){ f.step(); n++;
      if(P&&f.phase==='fight'&&f.t>=next){ const k=P.f(f); if(k&&!(f.f[0].order&&f.f[0].order.k===k&&f.f[0].order.t>6)){ f.shout(0,k); next=f.t+P.gap; } else next=f.t+.5; }
      if(f.phase==='corner') f.nextRound(f.aiStrategy(0),f.aiStrategy(1));
      for(const e of f.events){ if(e.type==='shout')shouts++; else if(e.type==='heard')heard++; else if(e.type==='ignored')ign++; } f.events=[];
    }
    const r=f.result.winner; if(r===0)w++; else if(r===1)l++; else d++;
  }
  require('fs').appendFileSync('/tmp/shout_'+(process.env.TAG||'x')+'.txt',JSON.stringify({p:p+(process.env.STY?'@'+process.env.STY:'')+(process.env.GRD?'@'+process.env.GRD:''),RT,w,l,d,n:N,shouts,heard})+'\n');
  const pc=w/(w+l);
  console.log(p.padEnd(7),(100*pc).toFixed(1)+'%','±'+(100*Math.sqrt(pc*(1-pc)/(w+l))).toFixed(1),'n'+N,'draws',d,shouts?`heard ${(100*heard/shouts).toFixed(0)}% ignored ${(100*ign/shouts).toFixed(0)}%`:'');
}
