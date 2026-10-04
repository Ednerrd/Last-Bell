import sys,os,json
from playwright.sync_api import sync_playwright
S=os.environ.get('OUTDIR', os.path.dirname(os.path.abspath(__file__)))
SECS=float(os.environ.get('SECS','20'))
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
    pg=b.new_page(viewport={'width':412,'height':915},device_scale_factor=2)
    errs=[];pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.goto('file://'+S+'/'+os.environ.get('HTML','rec.html')); pg.wait_for_timeout(500)
    pg.evaluate("ACT.newSlot({i:0})"); pg.evaluate("ACT.newCareer({i:0})"); pg.evaluate("ACT.startCareer()"); pg.evaluate("ACT.offers()"); pg.evaluate("ACT.sign({i:1})")
    pg.evaluate("save.pending.campDone=true; startFight(); FX.speed=1")
    pg.wait_for_function("F && F.phase==='fight'", timeout=20000)
    pg.wait_for_timeout(1500)
    pg.evaluate("""(()=>{window.__R=[]; window.__steps=0; window.__ev=[];
      const st=F.step.bind(F); F.step=function(dt){ st(dt); window.__steps++; for(const e of F.stepEv) if(['throw','hit','miss','stun','feint','escape','counterTry','knockdown'].includes(e.type)) window.__ev.push({type:e.type,a:e.a,d:e.d,p:e.p,why:e.why,blocked:e.blocked,dmg:e.dmg}); };
      const od=F.decide.bind(F); F.decide=function(X){ window.__ev.push({type:'decide',a:X.side}); return od(X); };
      window.__rec=(o)=>{ o.now=performance.now(); o.steps=window.__steps; o.acc=FX.acc; o.ev=window.__ev; window.__ev=[]; window.__steps=0; window.__R.push(o); };
    })()""")
    pg.wait_for_timeout(int(SECS*1000))
    R=pg.evaluate("(()=>{window.__rec=null; return window.__R})()")
    json.dump(R,open(S+'/'+os.environ.get('OUT','rec.json'),'w'))
    print('frames',len(R),'errs',errs[:3])
    b.close()
