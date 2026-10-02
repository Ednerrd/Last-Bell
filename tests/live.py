from playwright.sync_api import sync_playwright
import os; os.makedirs('shots', exist_ok=True)
errs=[]
pairs=[('peekaboo','philly'),('high','handslow'),('cross','standard')]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':700},device_scale_factor=1)
    pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.goto('file://'+__import__('os').path.abspath('index.html')+''); pg.wait_for_timeout(500)
    pg.evaluate("ACT.newSlot({i:0})"); pg.evaluate("ACT.startCareer()"); pg.evaluate("ACT.offers()"); pg.evaluate("ACT.sign({i:1})")
    for n,(ga,gb) in enumerate(pairs):
        pg.evaluate(f"save.player.guard='{ga}'; save.player.stats=Object.fromEntries(STATS.map(k=>[k,80])); save.pending.offer.opp.guard='{gb}'; save.pending.offer.opp.stats=Object.fromEntries(STATS.map(k=>[k,80])); save.pending.campDone=true; startFight()")
        pg.wait_for_timeout(5000)
        for i in range(12):
            pg.locator('canvas').first.screenshot(path=f'shots/lv{n}_{i:02d}.png'); pg.wait_for_timeout(110)
        pg.evaluate("cancelAnimationFrame(rafId)")
    b.close()
print('errors',errs)
