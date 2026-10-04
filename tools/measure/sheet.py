import os,io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
S=os.environ.get('OUTDIR', os.path.dirname(os.path.abspath(__file__))); NF=int(os.environ.get('NF','40')); TAG=os.environ.get('TAG','ex')
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
    pg=b.new_page(viewport={'width':412,'height':915},device_scale_factor=2)
    pg.goto('file://'+S+'/'+os.environ.get('HTML','rec.html')); pg.wait_for_timeout(500)
    pg.evaluate("ACT.newSlot({i:0})"); pg.evaluate("ACT.newCareer({i:0})"); pg.evaluate("ACT.startCareer()"); pg.evaluate("ACT.offers()"); pg.evaluate("ACT.sign({i:1})")
    pg.evaluate("save.pending.campDone=true; startFight(); FX.speed=1")
    pg.wait_for_function("F && F.phase==='fight'", timeout=20000); pg.wait_for_timeout(int(os.environ.get('WAIT','9000')))
    pg.evaluate("""(()=>{window.__go=0; const st=F.step.bind(F); F.step=function(dt){ st(dt); if(!window.__go && F.stepEv.some(e=>e.type==='throw' && F.f[e.a].queue.length>=2) && Math.abs(F.f[0].x-F.f[1].x)<75){ window.__go=1; } }; })()""")
    pg.wait_for_function("window.__go===1", timeout=60000, polling=1)
    pg.evaluate("window.__raf=window.requestAnimationFrame; window.requestAnimationFrame=()=>0; cancelAnimationFrame(rafId); window.__ts=FX.last; window.__info=[]; window.__rec=o=>{ window.__info.push(o.f.map(v=>(v.aT?v.aT+' '+(+v.aP||0).toFixed(2):(v.def||v.st))+((+v.hitT||0)>0.05?' hit'+(+v.hitT).toFixed(2):''))) }; 0")
    box=pg.locator('#cv').bounding_box()
    imgs=[]; info=[]
    for i in range(NF):
        pg.evaluate("window.__ts+=1000/60; loop(window.__ts)")
        png=pg.screenshot(clip={'x':box['x'],'y':box['y']+box['height']*0.18,'width':box['width'],'height':box['height']*0.62})
        imgs.append(Image.open(io.BytesIO(png)).convert('RGB'))
    info=pg.evaluate("window.__info")
    b.close()
w,h=imgs[0].size; imgs=[im.crop((int(w*.08),int(h*.12),int(w*.72),h)) for im in imgs]; w,h=imgs[0].size; sc=0.5; tw,th=int(w*sc),int(h*sc); cols=8; rows=(NF+cols-1)//cols
sheet=Image.new('RGB',(tw*cols,(th+22)*rows),(20,20,20)); d=ImageDraw.Draw(sheet)
for i,im in enumerate(imgs):
    x,y=(i%cols)*tw,(i//cols)*(th+22); sheet.paste(im.resize((tw,th)),(x,y+22))
    t=info[i] if i<len(info) else ['','']; d.text((x+3,y+1),f"{i} L:{t[0]}",fill=(255,220,120)); d.text((x+3,y+11),f"R:{t[1]}",fill=(140,200,255))
sheet.save(S+f'/contact_{TAG}.png'); print(sheet.size, [x for x in info[:NF]])
