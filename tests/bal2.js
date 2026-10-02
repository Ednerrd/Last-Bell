const S=require('./sim.js'); const fs=require('fs');
const N=+process.argv[2], RT=+process.argv[3], gs=process.argv[4].split(','), tag=process.argv[5]||'x';
const styles=Object.keys(S.STYLES);
for(const g of gs){ let w=0,l=0,cut=0,n=0;
  for(let i=0;i<N;i++){ const st=styles[i%5];
    const A=S.sheet(RT,st,g), B=Object.assign({},A,{guard:'standard',stats:Object.assign({},A.stats)});
    const side=i%2; const f=side?S.run(B,A,{rounds:10}):S.run(A,B,{rounds:10}); n++;
    const win=f.result.winner; if(win!=null){ if(win===side)w++; else l++; } if(/cut/.test(f.result.method))cut++;
  }
  fs.appendFileSync('/tmp/res_'+tag+'.txt',JSON.stringify({g,RT,w,l,cut,n})+'\n');
}
