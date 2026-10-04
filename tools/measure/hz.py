import os,sys
from playwright.sync_api import sync_playwright
S=os.environ.get('OUTDIR', os.path.dirname(os.path.abspath(__file__))); HTML=sys.argv[1]; HZ=float(sys.argv[2])
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
    pg=b.new_page(viewport={'width':412,'height':915})
    errs=[];pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.goto('file://'+S+'/'+HTML); pg.wait_for_timeout(400)
    pg.evaluate("ACT.newSlot({i:0})"); pg.evaluate("ACT.newCareer({i:0})"); pg.evaluate("ACT.startCareer()"); pg.evaluate("ACT.offers()"); pg.evaluate("ACT.sign({i:1})")
    pg.evaluate("save.pending.campDone=true; startFight(); FX.speed=1")
    pg.wait_for_function("F && F.phase==='fight'", timeout=20000)
    r=pg.evaluate("""(()=>{ window.requestAnimationFrame=()=>0; cancelAnimationFrame(rafId);
      const st=F.step.bind(F); let steps=0; F.step=function(d){steps++; return st(d)};
      F.f[1].head=1; F.f[1].headMax=1; F.f[1].s.chin=1;   // glass jaw: next clean shot ends it
      let ts=FX.last||1000, out={}, n=0, eruptSteps=0, eruptFrames=0, cams=[];
      while(n<200000 && FX.mode!=='done'){ ts+=1000/%f; const m=FX.mode, s0=steps; loop(ts); n++;
        if(m==='erupt'){eruptSteps+=steps-s0; eruptFrames++;}
        if(m==='replay'){ out.replayFrames=(out.replayFrames||0)+1; }
      }
      out.mode=FX.mode; out.eruptSteps=eruptSteps; out.eruptFrames=eruptFrames; out.frames=n; return out; })()""" % HZ)
    print(HTML,HZ,r,'errs',errs[:3]); b.close()
