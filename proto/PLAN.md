# 3D Last Bell: plan

Ed's call (Oct 2026): **3D replaces the 2D side view as the live fight screen.** Target phone: Galaxy S25 Ultra.

## Ground rules
- **Render only.** Engine, career, balance, saves and UI flow are not touched, so no sims are needed except to prove nothing moved.
- **Same input.** The 3D renderer reads the same `view` object the fight loop already builds:
  - `{f, looks, t, venue, cam, zoom, excite, ref, replay, ev, flash}`
  - built by `liveView()` / `startReplay()`, with `spreadView` + `blendSnap`
- **Same interface.** `Render3D` exposes the same functions as `Render`: `init`, `reset`, `resize`, `frame(view, dt)`. The fight loop picks one, so this swap is about 5 lines.
- **2D stays.**
  - `Render.portrait` keeps doing the hub, offers and locker portraits.
  - The 2D fight view stays as the fallback when WebGL is missing or three.js fails to load.
  - Settings get a "Classic 2D view" toggle.
- **One file.**
  - New section `/* ===== LAST BELL : render3d ===== */` in `index.html`.
  - three.js comes from jsdelivr through a dynamic `import()` at fight start. It's allowed by the publishing rules and is cached after the first load. The title and hub screens never wait on it.
  - Expected size: +1,000–1,400 lines.
- **Dev bench.** `proto/ring3d.src.html` + `build.js` stays the bench until the merge. Each phase is published to a **preview** artifact for Ed. It goes to the live URL only when Ed says so.

## Phase 0: phone check (do first, short)
- Build a perf page: the current proto plus an overlay showing fps, frame ms and draw calls, and a quality switch (shadows on/off, pixel ratio 1.5 / 2 / native).
- Ed runs a full fight on the S25 Ultra and reports:
  - fps on each setting
  - whether the phone gets warm after 10 minutes
  - battery drop
- **Budget:**
  - Steady 60 fps.
  - Pixel ratio capped at 2.
  - One shadow light at 1024.
  - Under 150 draw calls.
  - A 30 fps "battery saver" option, because this is an idle sim that people leave running.
- **Exit:** numbers in hand, and quality defaults picked.

## Phase 1: foundation (fix the duct tape before adding looks)
1. **Spacing.**
   - The engine's distances were tuned for 2D, so the proto spreads them apart (`spad`, up to +26) and lunges punches in (up to 30–34).
   - Replace this with one clean mapping: engine distance → 3D distance between the men, sized so a jab at the engine's jab range lands with the arm about 95% straight.
   - Keep `lunge` only for real step-in shots.
2. **Animation system.**
   - Swap the per-frame formulas for keyed poses with blending.
   - Poses per guard (6 guards). Punches by kind with load → snap → hold → retract curves.
   - Defenses: slip, roll, block, pull back.
   - Reactions by punch type, plus clinch and knockdowns.
   - Everything 2D learned carries over: straights land nearly locked out, contact pushes the man getting hit (not the puncher), the back heel rolls up, elbows bend the right way on the walk.
3. **Footwork.** Feet plant and step instead of sliding. Steps are driven by how far the hips move. Pivots on hooks. The back foot follows on a lunge.
4. **Anti-clip.** Keep `settle()` (glove in head 80 → 2). Add stat tools that work headless (swiftshader) to measure it, like `clip2d.py` does for 2D.
- **Exit:** clip stats around 0, straights at about 0.9 extension at contact, Ed approves the motion on the preview.

## Phase 2: look
- **Fighters.** Better heads and faces, and muscle by build (flyweight wiry, heavyweight thick, same `G = build^1.5` idea). Skin tones, hair, trunks/gloves/boots from `looks`, including the kit-clash swap.
- **Damage.** Swelling and cuts on the face. Blood that builds up across rounds. A sweat sheen that rises with rounds and gas.
- **Venues.** All 5 venues (`VEN` / `VENUE_NAMES`): gym, hall, civic, coliseum, vegas. Each gets its own lights, crowd size, ring colors and apron logo.
  - The crowd is cheap billboards or instanced silhouettes that react to `excite`.
- **Impact FX.** Sweat/mist spray, a camera nudge on big shots, a short hit-stop at 1x only.

## Phase 3: everything the 2D fight screen does
- **Corner between rounds:** stool, trainer and cutman, and the camera zooming out.
- **Knockdowns:** the ref counts beside the downed man, the knee drop on body shots, the wave-off.
- **Replay:** the finishing sequence (`F.replay`) in slow-mo from a better camera angle, with the grey/letterbox look.
- **Special styles:** stance switch, angle step-offs, spoiler holding and clinch fouls, and warnings/point deductions shown by the ref.
- **Cameras:** TV (default), ringside, high, corner; drag to look around. Also a camera director that cuts to a close angle on big moments.
- **Check the extras:** coach shouts, commentary, the HUD and the overlays still work on top of the 3D view (they're DOM, so they should).
- **Nice to have:** a walkout/intro shot, the decision announcement with hands raised, a belt on the winner.

## Phase 4: merge and ship
- Merge into `index.html` behind the 3D/2D toggle, with 3D as the default.
- Ed plays it on the **preview** artifact for a few days of careers.
- Headless check: run 1800 frames for clip stats and catch page errors.
- When Ed says go, update CLAUDE.md, and Ed publishes it live.

## Risks
- **Heat and battery** in long idle sessions. That's why Phase 0 comes first and the 30 fps option exists.
- **File size and complexity.** index.html grows to about 5,000 lines. The render3d section must stay self-contained.
- **Two renderers to maintain.** 2D gets frozen and becomes fallback only. No new 2D features after the merge.
