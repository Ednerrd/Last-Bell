// The stance, measured standing (Stand mode): per style x guard, averaged over a few seconds so the sway drops out.
//   node proto/tools/stance.js proto/ring3d.html [styles|all] [guards|all] [secs]
// Per 100 of height: weight (hips along the feet line, 0 = over the rear foot, 100 = over the lead, 50 = even),
// hipY (hip height), headF (head ahead of the lead foot: + = past it), pitch (trunk lean, hips -> chest, deg, + = forward),
// kneeL / kneeR (knee bend, deg), toeL / toeR (toe turn off the line to his man, deg, + = toward his rear side: the lead toe in, the rear toe out),
// heelL / heelR (ankle -> ball, deg down from level: the flat foot reads its own build angle, more = heel up). Forced orthodox. Fast + deterministic (fast.js).
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const ALL_S = ['outboxer', 'boxerpuncher', 'counter', 'slugger', 'swarmer', 'awkward'], ALL_G = ['standard', 'high', 'peekaboo', 'philly', 'cross', 'handslow'];
(async () => {
  const [file, st = 'all', gu = 'standard', secs = 3] = process.argv.slice(2);
  const S = st === 'all' ? ALL_S : st.split(','), Gs = gu === 'all' ? ALL_G : gu.split(',');
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const fast = require('./fast'), pg = await fast.open(b, file, 7);
  console.log('style        guard      weight hipY  headF pitch kneeL kneeR  toeL  toeR heelL heelR');
  for (const s of S) for (const g of Gs) {
    await pg.evaluate(`__dbg.newFight({sa:'${s}',sb:'${s}'});__dbg.fight.f.forEach(F=>{F.guard='${g}';F.stance='orthodox';if(F.sheet){F.sheet.guard='${g}';F.sheet.stance='orthodox'}});__dbg.stand=true;window.__st={n:0,w:0,y:0,h:0,p:0,k0:0,k1:0,t0:0,t1:0,e0:0,e1:0}`);
    await fast.run(pg, 2); // settle
    await fast.run(pg, secs, `{const B=__dbg.boxers()[0],R=__st,V=()=>new __dbg.THREE.Vector3(),bn=n=>B.bones.find(x=>x.name==='mixamorig'+n).getWorldPosition(V());
      const hip=bn('Hips'),ch=bn('Spine2'),hd=bn('Head'),f=B.fwd,H=100/(B.hs*100),a=B.ft[0].at,c=B.ft[1].at;
      const along=v=>v.x*f.x+v.z*f.z,ang=(p,q,r)=>{const u=p.clone().sub(q).normalize(),w=r.clone().sub(q).normalize();return 180-Math.acos(Math.max(-1,Math.min(1,u.dot(w))))*57.3};
      R.w+=(along(hip)-along(c))/(along(a)-along(c))*100;R.y+=hip.y*H;R.h+=(along(hd)-along(a))*H;
      R.p+=Math.atan2(along(ch)-along(hip),ch.y-hip.y)*57.3;R.k0+=ang(bn('LeftUpLeg'),bn('LeftLeg'),bn('LeftFoot'));R.k1+=ang(bn('RightUpLeg'),bn('RightLeg'),bn('RightFoot'));
      ['Left','Right'].forEach((sd,i)=>{const an=bn(sd+'Foot'),ba=bn(sd+'ToeBase'),dx=ba.x-an.x,dz=ba.z-an.z,hz=Math.hypot(dx,dz);R['t'+i]+=Math.atan2(-dx*f.z+dz*f.x,dx*f.x+dz*f.z)*57.3;R['e'+i]+=Math.atan2(an.y-ba.y,hz)*57.3});R.n++}`);
    const r = await pg.evaluate(`(()=>{const R=__st,n=R.n;return [R.w/n,R.y/n,R.h/n,R.p/n,R.k0/n,R.k1/n,R.t0/n,R.t1/n,R.e0/n,R.e1/n].map(x=>x.toFixed(1).padStart(5)).join(' ')})()`);
    console.log(s.padEnd(12), g.padEnd(10), r);
  }
  if (pg.errs.length) console.log('errors', pg.errs);
  await b.close();
})();
