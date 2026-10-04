import sys
import os; os.makedirs('shots', exist_ok=True)
from playwright.sync_api import sync_playwright
rows = sys.argv[1]  # js expression: array of [label, [opts...]]
out = sys.argv[2]
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(**({'executable_path':'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'} if os.path.exists('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') else {})); pg=b.new_page(viewport={'width':760,'height':400},device_scale_factor=1.5)
    pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.goto('file://'+__import__('os').path.abspath('index.html')+''); pg.wait_for_timeout(500)
    pg.evaluate("""(rows)=>{
      document.body.innerHTML='<div id=g style="background:#111;padding:4px"></div>'; const g=document.getElementById('g');
      const look=randLook(4); look.skin='#a66f4a';
      for(const [lab,frames] of eval(rows)){
        const r=document.createElement('div'); r.style.cssText='display:flex;align-items:center;gap:2px;margin-bottom:2px';
        r.innerHTML='<div style="color:#ddd;font:11px sans-serif;width:78px">'+lab+'</div>'; g.appendChild(r);
        for(const o of frames){ const c=document.createElement('canvas'); c.style.cssText='width:84px;height:104px;background:#000'; r.appendChild(c); Render.portrait(c,look,o); }
      }}""", rows)
    pg.wait_for_timeout(200); pg.screenshot(path=out, full_page=True); b.close()
print('errors',errs)
