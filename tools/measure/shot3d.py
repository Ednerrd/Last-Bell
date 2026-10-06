# 3D proto: runs a fight headless (swiftshader) for 40 s, screenshot + page errors.
# python3 tools/measure/shot3d.py proto/ring3d.html <three.module.min.js> out.png
# three.js: npm i three@0.170.0 in a scratch dir (the page imports it from jsdelivr; this routes it locally)
import sys, time, pathlib
from playwright.sync_api import sync_playwright
html = pathlib.Path(sys.argv[1]).resolve().as_uri()
three = pathlib.Path(sys.argv[2]).read_bytes()
errs=[]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
        args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width':412,'height':900})
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: m.type=='error' and errs.append('console: '+m.text))
    pg.route('**/three*.js', lambda r: r.fulfill(body=three, content_type='application/javascript'))
    pg.goto(html); time.sleep(40)
    pg.screenshot(path=sys.argv[3])
    print('errors:', len(errs)); [print(' ',e[:300]) for e in errs[:10]]
    b.close()
