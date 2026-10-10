from playwright.sync_api import sync_playwright
import os; os.makedirs('shots', exist_ok=True)
errs=[]
pairs=[('peekaboo','philly'),('high','handslow'),('cross','standard')]
with sync_playwright() as p:
    b=p.chromium.launch(**({'executable_path':'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'} if os.path.exists('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') else {})); pg=b.new_page(viewport={'width':390,'height':700},device_scale_factor=1)
    pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.goto('file://'+__import__('os').path.abspath('index.html')+''); pg.wait_for_timeout(500)
    for n,(ga,gb) in enumerate(pairs):
        pg.evaluate(f"LAB.ga='{ga}'; LAB.gb='{gb}'; labNew(false)")
        pg.wait_for_timeout(5000)
        for i in range(12):
            pg.locator('canvas').first.screenshot(path=f'shots/lv{n}_{i:02d}.png'); pg.wait_for_timeout(110)
        pg.evaluate("cancelAnimationFrame(rafId)")
    b.close()
print('errors',errs)
