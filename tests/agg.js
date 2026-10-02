const fs=require('fs');const t=process.argv[2];const L=fs.readFileSync('/tmp/res_'+t+'.txt','utf8').trim().split('\n').map(JSON.parse);
const a={};for(const r of L){const k=r.g+'@'+r.RT;a[k]=a[k]||{w:0,l:0,n:0,cut:0};a[k].w+=r.w;a[k].l+=r.l;a[k].n+=r.n;a[k].cut+=r.cut;}
for(const k in a){const o=a[k];const p=o.w/(o.w+o.l);console.log(k.padEnd(14),(100*p).toFixed(1)+'%','±'+(100*Math.sqrt(p*(1-p)/(o.w+o.l))).toFixed(1),'n'+o.n,'cut'+(100*o.cut/o.n).toFixed(1)+'%');}
