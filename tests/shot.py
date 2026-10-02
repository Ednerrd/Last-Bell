from playwright.sync_api import sync_playwright
import os; os.makedirs('shots', exist_ok=True)
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch()
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.goto('file://'+__import__('os').path.abspath('index.html')+''); pg.wait_for_timeout(800)
    pg.evaluate("""()=>{
      document.body.innerHTML='<div id=g style="display:grid;grid-template-columns:repeat(4,1fr);gap:2px;background:#111"></div>';
      const g=document.getElementById('g'); const look=randLook(4);
      const rows=[['idle',{}],['head block',{def:'block'}],['body block',{def:'block',defZ:'body'}],['tired',{tired:1}]];
      for(const gd of Object.keys(GUARDS)) for(const [n,o] of rows){
        const w=document.createElement('div'); w.style.cssText='color:#ccc;font:10px sans-serif;text-align:center';
        w.innerHTML=gd+' / '+n; const c=document.createElement('canvas'); c.style.cssText='width:96px;height:120px;display:block;margin:auto';
        w.appendChild(c); g.appendChild(w); Render.portrait(c,look,Object.assign({guard:gd,stance:'orthodox'},o));
      }
      const w=document.createElement('div');w.style.cssText='color:#ccc;font:10px sans-serif;text-align:center';w.innerHTML='philly / roll';
      const c=document.createElement('canvas');c.style.cssText='width:96px;height:120px;display:block;margin:auto';w.appendChild(c);g.appendChild(w);
      Render.portrait(c,look,{guard:'philly',def:'roll'});
    }""")
    pg.wait_for_timeout(300); pg.screenshot(path='shots/poses.png',full_page=True)
    b.close()
print('errors:',errs)
