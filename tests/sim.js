const fs=require('fs');
const src=fs.readFileSync(process.env.LB||'index.html','utf8');
const a=src.indexOf('/* ===== LAST BELL : engine'), b=src.indexOf('/* ===== LAST BELL : render');
const code=src.slice(a,b);
const api=new Function(code+';'+(process.env.PATCH||'')+';return {Fight,GUARDS,STYLES,CUT,genStats,ovr,STATS,rollGuard,guardSkill,ringIQ,TUNE,setDMG:v=>DMG=v};')();
module.exports=api;
api.run=function(A,B,opts){
  const f=new api.Fight(A,B,opts||{}); let n=0;
  while(f.phase!=='over' && n<600000){ f.step(); n++;
    if(f.phase==='corner'){ f.nextRound(f.aiStrategy(0),f.aiStrategy(1)); }
  }
  return f;
};
api.sheet=function(r,style,guard,exp){ return {name:'x',style,guard,stance:'orthodox',stats:api.genStats(r,style),wear:0,exp:exp==null?20:exp}; };
