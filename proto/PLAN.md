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

Research (FNC + Thrill of the Fight) and the items it adds to each phase: `proto/RESEARCH.md` → "What Last Bell takes from this".

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

## Guard reference for the 3D models (Ed, Oct 6 2026)
- **Cross-arm (Ken Norton, Ed's photos):** both forearms horizontal, stacked across the body. Rear forearm on top, across the chest just under the chin, rear glove resting on the lead shoulder. Lead forearm below, across the belly, lead glove out at the rear side. Chin tucked down behind the top arm and the lead shoulder, elbows tight to the ribs. The 2D render can only fake this (forearms point at the camera); the 3D model should show the stack. Right hand comes straight off the chin, no hammer.
- **Philly / cross-arm blocks:** elbows stay down by the ribs, never winged out (Ed: "elbows out, not natural").

## The look: readable punches (Ed, Oct 19 2026)
Ed's references are 5 stock images, not committed (watermarked stock). Kept in words:
- **Style:** clean flat vector / cel look. Bold shapes, 2–3 tone shading, dark outlines, readable gloves and trunk colors. Two-color corners (red vs blue) so you always know who is who. FNC-like framing: side-on, both men full body, ring ropes behind, ref in the back.
- **The point is reading the fight.** You should see *what* he threw, *where* it landed and *whether it got through*:
  - **Where it lands.** Chin, temple, nose, body/liver, shoulder, gloves. A visible spot plus the right reaction (head snaps back on a straight, turns on a hook, lifts on an uppercut, folds on the body).
  - **Through the guard.** A blocked shot thuds into the gloves and the arms give. A leaky block (engine `blockLeak`) shows the glove pushing *through* the guard into the face. A clean one hits open space.
  - **Clean vs blocked vs missed** reads different at a glance: impact flash and sweat spray on clean, a dull glove-on-glove pop on blocked, a whiff and an off-balance step on a miss.
- **The engine already has most of this.** `resolve()` knows the zone (`P.zone` head/body), the kind (jab, cross, hook, upper), blocked or not, rolled/evaded, and how much leaked (`mult`). Missing: a finer spot (chin vs temple, liver vs ribs). Pick it in render from kind + side, so no engine change.
- **Where it fits:** Phase 1 (reactions by punch type, contact) and Phase 2 (look, impact FX). Not now: 3D comes right after Size (ROADMAP item 4; Ed, Oct 22).

## Bodies and movement: loose but ready (Ed, Oct 22 2026)
Ed on the first 3D try: the camera was fine; **the bodies and the movement were the problem: too stiff.** A boxer is relaxed, light on his feet, always moving; the hands are loose but ready, and the guard is only tight when something's coming. Plan for Phase 1-2:
- **Layers, not poses.** Base guard pose + a rhythm layer (bounce, weight shifting foot to foot, knees soft) + a "life" layer (head never still, shoulders rolling, hands floating and pumping a little, breathing) + punches/defense on top.
- **A tension dial (0 loose .. 1 shell)** drives the blend: low at range, rising as he closes or reads a punch coming, snaps to full on a block, eases back after. Read off the brain's state (threat, `him.closing`, `him.punch`, hurt, `emo.fear`). Loose hands sit lower and wider and drift; tight hands lock to the chin.
- **Rhythm by man:** an out-boxer bounces on his toes, a slugger is flat-footed and heavy, a counter man is still but loose, a swarmer bobs and weaves. A gassed man's bounce dies, hands sag, he breathes through the mouth. Hurt: the legs wobble, the rhythm breaks.
- **Feet never planted for long:** small steps and resets between real moves; planted only to punch.
- **Snap from loose:** punches start from the relaxed hand and snap, then come home to the guard (the snap reads better from loose).
- **Bodies:** proper shapes (cel shading, outlines), shoulders and lats, a torso that twists into punches, not tubes.
- Test: plain gray models first; if they look like boxers when nobody's punching, the rest follows.

## Code first, plug-and-play later (Ed, Oct 22 2026)
Ed's call: Claude builds the whole 3D fight in code first (bodies, motion, camera, the show), no downloads. Real models and recorded motion come later, only where they make it look better, and they must drop in with no rewrite.
- **The skeleton contract.** The code-built man uses a standard humanoid skeleton (Mixamo bone names: hips, spine, spine1, spine2, neck, head, shoulder/arm/forearm/hand, upleg/leg/foot/toe, both sides). Any rigged model on that skeleton (Mixamo, MakeHuman/MPFB, a bought pack) swaps in as the body.
- **Three layers, each swappable:**
  1. *Body*: the mesh. Code-built now; a model file later.
  2. *Motion source per move*: a code pose curve now (load, snap, hold, retract; the loose-but-ready layers above). Later any single move (a hook, a knockdown) can be a recorded clip instead; the rest stays code. One table maps move -> source.
  3. *On top, always code*: timing stretched to the engine's punch (impact at the 60% resolve), the glove steered onto the spot the engine says it hit, feet planted, springs on the head and shoulders, guard and style tweaks, hurt and gas.
- **Later options, ranked:** filmed clips (Ed shadowboxing or a real boxer on video, turned into motion data by Rokoko Vision / DeepMotion; Claude reads the numbers, doesn't need to watch), Mixamo (free, Adobe login, generic moves, no guards like peekaboo/philly), Quaternius (free, cartoony), paid boxing packs (Fab, ActorCore; check the license for web).
- **First test (Oct 22): QuickMagic, text prompt "A boxer".** FBX (binary, 2 MB) loads in three.js `FBXLoader` with textures (fix: map its Windows texture paths to the file name). 3ds Max Biped skeleton (`Bip001_*`, 68 bones, full fingers), not Mixamo: needs a bone-name map. 10 s at 30 fps: guard + jab usable; a lunging, square-stance straight right (karate, not boxing); 4 s frozen in a shell; ends walking off. Verdict: the format passes, the boxing doesn't. Ask for one move per clip, 2-3 s, "bladed stance, no step", "keeps bouncing". Bake-off when the time comes: DeepMotion, QuickMagic, AIMoCap on the same filmed clip.
- **Engine untouched throughout:** render only, the hash holds.
