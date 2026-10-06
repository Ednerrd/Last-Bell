const S=require('./sim.js');const st=Object.keys(S.STYLES).filter(k=>!S.STYLES[k].special);
const by={}, add=(k,r,F,lo)=>{const o=by[k]=by[k]||{};const x=o[r]=o[r]||{n:0,s:0,m:0,t:0,lo:0};x.n++;x.s+=F.stam;x.m+=F.stamMax;x.t+=F.rs.thrown;x.lo+=lo;};
const N=+process.argv[2]||200;
for(let i=0;i<N;i++){const a=st[i%5],b=st[(i/5|0)%5];
 const A=S.sheet(75,a,S.rollGuard(a),15),B=S.sheet(75,b,S.rollGuard(b),15);
 const f=new S.Fight(A,B,{rounds:12}); let n=0, low=[0,0];
 while(f.phase!=='over'&&n<900000){f.step();n++;
  f.f.forEach((F,j)=>{ if(F.stam<F.stamMax*.45) low[j]++; });
  if(f.phase==='corner'){ f.f.forEach((F,j)=>{ add(j?b:a,f.round,F,low[j]); add('ALL',f.round,F,low[j]); const g=F.s.stamina>=80?'stam80+':F.s.stamina<65?'stam<65':'stam65-80'; add(g,f.round,F,low[j]); }); low=[0,0]; f.nextRound(f.aiStrategy(0),f.aiStrategy(1)); }
 }}
for(const k in by){ const rows=[1,3,6,9,12].filter(r=>by[k][r]).map(r=>{const x=by[k][r];return `r${r}: max ${(x.m/x.n).toFixed(0)} end ${(x.s/x.n).toFixed(0)} thr ${(x.t/x.n).toFixed(0)} gassed ${(100*x.lo/x.n/ (180*60) ).toFixed(0)}%`}); console.log(k.padEnd(10), rows.join(' | ')); }
