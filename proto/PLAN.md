# 3D Last Bell: plan

Ed's call (Oct 2026): **3D replaces the 2D side view as the live fight screen.** Target phone: Galaxy S25 Ultra.

Plan checked against the code Oct 23 (pre-3D baseline): stale bits from before the Oct cut fixed (hub, careers, settings, Phase 0, size). The bench still builds and runs a fight on today's engine with no page errors.

## Ground rules
- **Render only.** Engine, balance and the fight screen's flow are not touched, so no sims are needed except the hash that proves nothing moved: the pre-3D baseline, `same.js 40` **3fd3c667** / `same.js 200` **6c94c895** (Oct 23).
- **Same input.** The 3D renderer reads the same `view` object the fight loop already builds:
  - `{f, looks, t, venue, cam, zoom, excite, ref, replay, ev, flash}`
  - built by `liveView()` / `startReplay()`, with `spreadView` + `blendSnap`
- **Same interface.** `Render3D` exposes the same functions as `Render`: `init`, `reset`, `resize`, `frame(view, dt)`. The fight loop picks one, so this swap is about 5 lines.
- **2D stays.**
  - The game is one fight screen now (the Oct cut removed career, hub, offers and locker): no menus to keep 2D for. `Render.portrait` is unused since the cut (dead code, leave it until the merge).
  - The 2D fight view stays as the fallback when WebGL is missing or three.js fails to load.
  - There is no settings screen: the 3D/2D switch is a button in the fight screen's lab row (next to New fight / Rematch / Pick), remembered in localStorage.
- **One file.**
  - New section `/* ===== LAST BELL : render3d ===== */` in `index.html`.
  - three.js comes from jsdelivr through a dynamic `import()` at fight start. It's allowed by the publishing rules and is cached after the first load. The 2D view draws until it's loaded, then hands over.
  - Expected size: +1,000–1,400 lines (index.html 5,164 today, so ~6,200–6,600).
- **Dev bench.** `proto/ring3d.src.html` + `build.js` stays the bench until the merge. Each phase is published to a **preview** artifact for Ed. It goes to the live URL only when Ed says so.

## Phase 0: phone check (moved to the end of Phase 1)
- **Done once, Oct 9, on the v2 bench** (`claude/brave-einstein-ojkyzm`): 60 fps on the S25 Ultra on every setting, shadows on; defaults res 2 / shadows on / cap 60 (`docs/NOTES.md`). The Phase 1 bodies (layers, more bones, outlines) cost more, so **rerun it on the new bench at the end of Phase 1**, not first. The bench's "Phone test" button already has the overlay below.
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
1. **Spacing and size.**
   - The engine's distances were tuned for 2D, so the proto spreads them apart (`spad`, up to +26) and lunges punches in (up to 30–34).
   - Replace this with one clean mapping: engine distance → 3D distance between the men, sized so a jab at the engine's jab range lands with the arm about 95% straight.
   - Keep `lunge` only for real step-in shots.
  - **Size (s1-s3) shows.** The bench ignores it today. Each man is drawn at his height, arms at his reach (`rs`: every punch reaches x `rs`), so a 4 in reach gap reads on screen; the spacing mapping uses each man's own arm, not one jab length.
2. **Animation system.**
   - Swap the per-frame formulas for keyed poses with blending.
   - Poses per guard (6 guards). Punches by kind with load → snap → hold → retract curves.
   - Defenses: slip, roll, block, pull back.
   - Reactions by punch type, plus clinch and knockdowns.
   - Everything 2D learned carries over: straights land nearly locked out, contact pushes the man getting hit (not the puncher), the back heel rolls up, elbows bend the right way on the walk.
3. **Footwork.** Feet plant and step instead of sliding. Steps are driven by how far the hips move. Pivots on hooks. The back foot follows on a lunge.
4. **Anti-clip.** Keep `settle()` (glove in head 80 → 2). Add stat tools that work headless (swiftshader) to measure it, like `clip2d.py` does for 2D.
- **First look for Ed:** plain gray men, no punches: standing loose, bouncing, breathing ("Bodies and movement" below). If they look like boxers standing still, punches go on top.
- **Exit:** clip stats around 0, straights at about 0.9 extension at contact, the height/reach gap visible, Ed approves the motion on the preview, then the Phase 0 phone rerun.

### Phase 1, first iteration (Oct 23): built, on the 3D phone test
Ed: "start the 3D transition, use all the research, scratch the old one if you have to." The old Boxer class is gone; the bench page keeps its ring, camera, phone test and fight loop.
- **The boxer: `proto/boxer3d.js`** (inlined by `build.js` at `/*@BOXER@*/`). A Mixamo-named skeleton (Hips, Spine/1/2, Neck, Head, shoulders, arms, legs, toes; facing +Z, his left +X, bind rotations identity). One code-built mesh skinned to it (parts merged, vertex colors, soft weights at elbows/knees, a torso that twists hips -> chest), cel look: `MeshToonMaterial` with a 3-step ramp + an inverted-hull outline. **2 draw calls a man; the whole scene ~20 calls** (budget 150). Plug-and-play: the solver writes each bone's world rotation as a delta from bind, so a rigged model on the same names takes `delta x itsBind`.
- **Motion layers** (`Boxer3.pose`): guard spots per guard off the head (`GUARD3D`, tight and loose) blended on a **tension dial** (loose at range, tight when his man throws, he's close, hurt, just hit, blocking; fast up, slow down); **rhythm by style** (`RHY`: bounce, on his toes, weight shift, bob-and-weave; dies with gas, breaks when hurt; specials map to a base); **life** (head drift, shoulder roll, hands floating, lead hand pawing, breath; heavier when tired); **punches** (load -> snap -> hold -> retract, impact at the engine's 60%; hips and shoulders turn, the back heel rolls on rear hands, the lead foot pivots on the hook, uppercuts dip and drive, body shots change levels; the glove steers to a spot by kind: chin/nose, jaw/temple, under the chin, ribs/liver/belly); **defense** (slip away from the incoming glove, U-roll, duck, pull, blocks to the zone, parry pat, the philly shoulder roll); **reactions on springs** (straight snaps the head back, hook turns it, uppercut lifts the chin, body folds him, a block knocks the gloves back, a clean one knocks the guard loose; the puncher recoils on a landed shot and overextends on a missed power shot); **states** (clinch, knockdowns: sit -> back, body KD to a knee, the get-up in reverse; stool with arms on the ropes; walk; the winner's hands up).
- **Solve:** hips + spine FK (blade and twist split hips/spine), neck bends to carry the head snap, two-bone IK for arms (elbows by guard tuck) and legs, feet planted until they're too far, then a step; heel lift and toe pivots on the ball of the foot; small resets so he's never planted long.
- **Spacing:** the spread hack is gone: one mapping `d3 = d x .9` about their midpoint (`B3.map`), clinch pulls to 19, a body push if chests/heads touch. Measured (`proto/tools/probe.js`): at the engine's usual landing distance (~57-60) a jab's spot sits at ~.92 of the arm; long ones step in (lunge cap 13). Inside fights (d ~38-42) land short and bent: that's the engine's smothered range.
- **Size shows:** height from `size.h`, arms from reach/height vs the division's, the tale of the tape (height, reach) under the names.
- **Anti-clip:** the punching glove ignores his guard until the engine says *blocked* (then it stops on the gloves), and flies through on a miss. `proto/tools/clip.js`: glove-in-head 0% of frames, chest overlap 0%.
- **The ref** runs on the same skeleton (his kit, square stance, hands for the count chop, the wave-off, the break).
- **Phone first look:** Stand (the fight holds still, they just stand in their stance) and Gray (plain gray men) buttons. Portrait camera framed tighter.
- **Not yet:** Ed's eye on the motion (the gate), the Phase 0 phone rerun, damage on the face, faces close up, the clinch pose needs a look, a crowd beyond silhouettes. Tools: `proto/tools/README.md`.

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
- Ed plays it on the **preview** artifact for a few days of fights (random and picked).
- Headless check: run 1800 frames for clip stats and catch page errors.
- When Ed says go, update CLAUDE.md, and Ed publishes it live.

## Risks
- **Heat and battery** in long idle sessions. That's why Phase 0 comes first and the 30 fps option exists.
- **File size and complexity.** index.html grows to about 6,200–6,600 lines. The render3d section must stay self-contained.
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
- **Where it fits:** Phase 1 (reactions by punch type, contact) and Phase 2 (look, impact FX).

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
- **First test (Oct 22): QuickMagic, text prompt "A boxer".** FBX (binary, 2 MB) loads in three.js `FBXLoader` with textures (fix: map its Windows texture paths to the file name). 3ds Max Biped skeleton (`Bip001_*`, 68 bones, full fingers), not Mixamo: needs a bone-name map. 10 s at 30 fps: guard + jab usable; a lunging, square-stance straight right (karate, not boxing); 4 s frozen in a shell; ends walking off. Verdict: the format passes, the boxing doesn't. Ask for one move per clip, 2-3 s, "bladed stance, no step", "keeps bouncing". Second test (Oct 22): **PINOC (Viggle)**, jab + straight right prompt: FBX on the **Mixamo skeleton** (Beta mannequin, plugs in with no bone map), 4 s at 30 fps, bladed stance, bounces, guard up, steps in. But it threw 3 jabs and **no right hand** (rear arm never past 52% extended); jabs reach 77-92% extended and ride a little high. Verdict: far better than QuickMagic; the best text-to-motion pick so far. Free tier: one export only. Model test (Oct 22): a **Ryan Garcia fan model** (FBX, Mixamo skeleton, 33 bones, 21.8k tris: phone-ready, trunks + gloves textured). The PINOC clip played on it straight away (rotations copied by bone name, hip height scaled from the clips' own hip tracks): **the plug-and-play path works**. Not for shipping: a real person's likeness and no license in the zip; files kept out of the repo. Bake-off when the time comes: DeepMotion, QuickMagic, AIMoCap on the same filmed clip.
- **Model test, the shortlist (Oct 22):** the Ryan model proved the path; for the game we need a licensed generic boxer (CC0 or CC BY fine, CC BY-SA OK but our changes stay under it; no NC, ND, Editorial, real names or game rips). Sketchfab search (rigged, downloadable, ~65 hits), the picks: #11 "Boxer 3D – Human Rigged Model" (realistic, shirtless, in stance, 32.9k faces: trim a little, CC BY-SA) https://sketchfab.com/3d-models/none-51edfec934004084b0ec3ec13e0b87bc ; #3 "Boxer 1" (clean neutral mannequin in a guard, 21.6k, CC BY: the base to color in code) https://sketchfab.com/3d-models/none-b16a527e908e4fc7b501be6aa7175564 ; #5 "Boxing Character – Handpainted" (cartoony, 9.7k, CC BY) https://sketchfab.com/3d-models/none-4fddd9021cd246f6a459efb112f5bb8b ; maybe #1 "Animated Boxer" (24.9k, CC BY, has an animation) https://sketchfab.com/3d-models/none-b39f64cdde4a480f87709771130b113f . Downloads need Ed's login (FBX or glTF, send the zip + license + artist). Plan: #11 and #3, the PINOC jabs on both, a side-by-side GIF. Credit CC BY artists in the game.
- **Engine untouched throughout:** render only, the hash holds.
