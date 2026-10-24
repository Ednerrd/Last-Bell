# 3D bench tools (headless Chromium + swiftshader)

Run from the repo root after `node proto/build.js`. Outputs go wherever you point them (keep them out of git: `*.png` is ignored).
Playwright comes from the global install (`PW=path` to override).

- `node proto/tools/shot.js proto/ring3d.html out.png [waitMs] [w h] [js]`: one screenshot (js runs first: `__dbg.stand=true`, `__dbg.gray=true`, `__dbg.cam.user=true; __dbg.cam.yaw=.3`...).
- `node proto/tools/catch.js proto/ring3d.html pre_ "cond1;;cond2" [w h] [setupJs]`: pauses the fight when each condition is true (over `s0`, `s1` = the snapshot, `F` = the fight), screenshots, then a grid `pre_sheet.png`. E.g. `s0.aT==='cross'&&s0.aP>.55&&s0.aP<.65`.
- `node proto/tools/strip.js proto/ring3d.html out.png "cond" [frames] [ticks] [w h] [camjs]`: catches a moment, then steps the sim `ticks` at a time: a frame-by-frame strip of one punch.
- `node proto/tools/probe.js proto/ring3d.html [secs]`: arm extension when shots land, by punch (ext = shoulder-wrist / arm, want = where the spot was), engine distance d and 3D distance d3. The spacing check (B3.map).
- `node proto/tools/clip.js proto/ring3d.html [secs]`: anti-clip stats: % of frames with a glove in the other man's head (any, >2 units), chest overlap, draw calls, triangles.
- `node proto/tools/feet.js proto/ring3d.html [secs] [seed] [setupJs]`: footwork: foot moves a second per man, step length, step-drag pairs, stance width, feet crossing, body speed; with `window.__feet=[]` as setup, steps a second by why (push, drag, one = pivot, punch, walk). Fast + deterministic.
- **Fast mode** (`fast.js`): seeded `Math.random`, frames driven at a fixed 30 fps, rendering off, so two builds compare on the same fight and a minute of fight takes seconds. `feet.js` always; `FAST=seed node proto/tools/probe.js|clip.js ...` (secs = fight time; draw calls read 0).
- `node proto/tools/stance.js proto/ring3d.html [styles|all] [guards|all] [secs]`: the stance measured standing, per style x guard: weight (hips along the feet, 0 rear .. 100 lead), hip height, head ahead of the lead foot, trunk lean, knee bends (per 100 of height), toe turn and heel lift per foot, each shoulder under the chin, head height. Fast.
- `node proto/tools/dbg.js proto/ring3d.html "cond" "evalJs" out.png [setupJs]`: catch + print an eval (default setup: spoiler vs jab-and-grab at 4x, for clinches).

Page hooks: `__dbg.newFight({sa, sb})` picks styles, `__dbg.step(n)` runs n sim ticks, `window.__paused`, `window.__focus = () => Vector3` points the camera.
