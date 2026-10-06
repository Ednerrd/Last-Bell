# 3D proto phone-test panel, end to end headless: toggles every switch, runs the 5-setting test (~3 min), screenshots.
# python3 tools/measure/perf3d.py proto/ring3d.html <three.module.min.js> outprefix   (fps headless is meaningless, this checks it works)
import sys, time, pathlib
from playwright.sync_api import sync_playwright
html = pathlib.Path(sys.argv[1]).resolve().as_uri(); three = pathlib.Path(sys.argv[2]).read_bytes(); out = sys.argv[3]
errs=[]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width':412,'height':900}, device_scale_factor=2.6)
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: m.type=='error' and errs.append('console: '+m.text))
    pg.route('**/three*.js', lambda r: r.fulfill(body=three, content_type='application/javascript'))
    pg.goto(html); time.sleep(4)
    pg.click('#bPerf'); time.sleep(2.5)
    for k in ['pr','pr','sh','sh','cap','cap','cap','sh','pr','pr']:
        pg.click(f'#perf button[data-k="{k}"]'); time.sleep(.6)
    time.sleep(2); pg.screenshot(path=out+'_panel.png')
    print('panel:', pg.inner_text('#perf')[:400].replace('\n',' | '))
    pg.click('#perf button[data-k="cap"]'); time.sleep(3)
    print('cap60 fps:', pg.inner_text('#perf').split('\n')[0])
    pg.click('#perf button[data-k="cap"]'); time.sleep(3)
    print('cap30 fps:', pg.inner_text('#perf').split('\n')[0])
    pg.click('#perf button[data-k="cap"]')
    pg.click('#perf button[data-k="run"]'); time.sleep(5)
    print('testing:', pg.inner_text('#perf')[:200].replace('\n',' | '))
    time.sleep(172); pg.screenshot(path=out+'_result.png')
    print('result:', pg.inner_text('#perf').replace('\n',' | '))
    print('errors:', len(errs)); [print(' ',e[:300]) for e in errs[:10]]
    b.close()
