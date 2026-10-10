# v2 handoff (Oct 9 2026)

Start here.

## Read in this order
1. `v2/VISION.md`: Ed's own words, plus his calls. This is the source of truth.
2. `v2/GAME.md`: what the game is, aspect by aspect.
3. `v2/FOUNDATION.md`: how it's built. Section 9 is the build order (M0–M8), and "Decisions" sits at the bottom.
4. Only when needed: v1 lessons in `docs/BRAIN.md`, `docs/NOTES.md`, `proto/PLAN.md`, `proto/RESEARCH.md`, `research/`.

## Where things stand
- **v1** (`index.html` at the root) is frozen. It's the reference and the fallback. No new v1 work, unless it's Ed's items in `ROADMAP.md` (publishing live, the phone test).
- **v2**: M0 (skeleton), M1 (footwork) and M2 (punches and defense) done Oct 9, preview link in `v2/CLAUDE.md`. Next is **M3** (damage, gas, rules).
  - M2: `src/engine/punch.js` (10 punches by trainer number, load → snap → contact → retract, step-in, land/block/miss, glancing/solid/flush, head/body + side), `src/engine/defense.js` (block, slip, roll, pull back: windows, right vs wrong move), `src/brain/offense.js` (combos by style, picked for the range), `src/brain/defense.js` (sees it or not, reaction, read or habit by style and guard). Events: `punch`, `contact`, `defend`, `defenseEnd`. Render: `src/render3d/men.js` keyed poses, `src/render3d/camera.js` fight cam + wide cam (`cam` button: auto/fight/wide).
  - M2 audit (`node v2/tests/audit.js 60`): 52.3 thrown / 15.0 landed / 28.6% per man per round; jabs 25.6%, power 30.6%; straights land at median 95% (mean 93%) extension. Pose check: `node v2/tests/poses.mjs <three>`.
  - Fluid motion pass (Oct 9, render only, hash kept): render interpolates between sim ticks, hips glide on a spring (feet stay planted), per-style bounce/weave (`LIFE` in `men.js`), fight cam on critically damped springs. Jolts in 2 min: 916 → ~10; cam cuts per 15 min: 34 → 10. Frame strip: `node v2/tests/strip.mjs <three>`. Movement research (Oct 9): `research/move_*.md`.
  - Movement pass (Oct 9, render only, hash kept), from `research/move_plan.md`: planted feet with real steps and ball-of-foot pivots, weight shift, torso turn closer to real, hits as impulses (head whips after the chest), defense drops from the knees, and `src/render3d/moves.js` gives each man his own movement (style → family → guard → personal jitter). `node v2/tests/rig.mjs <three>`: foot-slide frames ~2900 → ~230, head jolts ~39 → ~13 per 45 s. Still open from the plan (engine, own commits + sims): keep feet planted in `fight.js`, fix the lateral first-foot rule, a ~100 ms reaction floor on defense.
  - Bodies (Oct 9, render only, hash kept; Ed: "the stick figure concept ain't it"): `src/render3d/body.js` builds one smooth skinned body per man in code (no model files): lofted torso and limbs with the muscles sculpted in, a shaped head with soft vertex-color hair/brows/eyes/lips, baggy trunks with a waistband, boots, real gloves. 15 bones; `men.js` works out the joints (same movement as before) and frames each bone. Looks are seeded per fighter (`lookOf`: skin tone, hair, build from height, trim color). Two men: ~20 draw calls, ~27k tris. Lights got a canvas bounce, a warm broadcast-side fill and a cool rim; `normalBias` stops skin self-shadow blotches. Close-ups: `VIEWS=three,face,face1 node v2/tests/close.mjs <three> [matchup] [secs]`.
  - Gait (Oct 9, render only, hash kept; Ed: "baby steps"): the render stopped copying the engine's short stop-go steps. Hips flow on a softer spring (GLIDE 32 → 10), so he carries through the engine's pauses; feet stride on their own toward a spot that leads his velocity, one at a time, re-aiming mid-air (the proto's gait). `node v2/tests/rig.mjs` now prints the gait: stop-go frames ~35% → ~4% of moving frames, stride ~0.15–0.21 → ~0.18–0.20 m. The engine's step/pause rhythm itself is still choppy (`src/brain/footwork.js` LEN/pause): smoothing it is an engine change for later, with sims.
  - Walk up (Oct 9, engine, hash 57e61173 → eb0b5fa5; Ed: "baby stepping, not walking up ready to box"): well out of range (> 0.45 m past the distance he wants), `planStep` walks him up: 0.38–0.52 m strides toward his man, 1.3x step speed, near-zero pauses (`me.walk`). Bell to center: median 9.0 s → 1.9 s. Audit 300/pairing: thrown 52.2 → 55.0, landed 15.0 → 15.7, connect 28.7 → 28.5%; mean distance ~0.12 m closer.
  - Flow footwork (Oct 10, engine, hash eb0b5fa5 → see tests/HASH; Ed: "stop motion", "crabs", "they're going to get hit, be attuned"): the step/pause model is gone. `planMove` picks a velocity a few times a second (`thinkFor`), `fight.js` eases `m.mv` toward it (~0.12 s), plus a constant in-and-out rhythm toward his man (`FOOT[style].hz/bob`); planted (velocity bleeds off) while punching or defending. Pace per mode in `PACE`, walk-up `WALK` 1.25 m/s. Audit 300/pairing before → after: thrown 55.0 → 50.6, landed 15.7 → 14.8, connect 28.5 → 29.3%; pressure power 51.8 → 45.5/round, outboxers throw less (54 → 46, they keep more distance). Footwork report: pressure puts outboxers on the ropes 22 → 27%, `speed` column replaces steps/min.
  - Brain slice 1 (Oct 10, engine; Ed: "volume is low and the AI is lacking"): `brain/offense.js` `react()` counters in the gap a miss or block leaves (slip → 2 / 2-3 / 3, roll → 3 / 3-2 / 6-3, pull → 2, block → return 1-2 / 2 / 3-2) and fires back when tagged; `exitAfter()` gets a mover out at an angle after his combo (`exit` mode). Chances per style in `REACT`. Throw rates up (`OFF`). Audit 300/pairing before → after: thrown 50.6 → 60.0, landed 14.8 → 17.2, connect 29.3 → 28.7%. Counter punches per round: outboxer 6.4, boxer 10.8, pressure 12.3; exits per round 17.5 / 15.1 / 2.3. **Volume target moved to ~60 (Ed wants more action than the real ~53 average).** Rest of the brain (memory, anticipation, setups, feints as real events, hurt, adjusting) is still M5.
  - FNC brief (Oct 10, from Ed): done so far, each its own commit with sims for engine parts.
    - Broadcast fight cam (`camera.js`): keeps one side, low and close, slides and pans, rare motivated cuts, near-side ropes hide (`ring.hideSide`), handheld noise, thump on hits, leans in on a stagger. auto = this cam in both orientations.
    - Hitstop in `main.js` (2/4 render frames on solid/flush; the sim waits). Block recoil on the gloves.
    - Punch snap ~halved, returns +20%; defense reaction reads the setup (power shots 1.4x later). Feel-out 4-8 s (round 1), 1-3 s after. Footwork speed on a spring.
    - Render weight: GLIDE 9, longer plants, head snap (w 11, z 0.45), deeper body fold, whole-body slips.
    - Stagger: engine `m.stag` (power head shots: flush 30%, solid-after-solid 15%; 1-1.8 s; no punching, half pace, skill halved, attacker 1.8x rate), render guard sag/sway. ~0.68 per man per round.
    - Audit now: ~65 thrown / ~18 landed / ~28% per man per round.
    - Still to do from the brief: P2 damage + stamina + visible wear carried across rounds (that's M3), offense motivated by what just landed, more body work, stop throwing when tired; P3 crowd sound (ask first), round card.
  - Known for later: flush share is high (~32% of landed; wrong-way defense "into it" is 8.5% of all punches), power connect is a bit under real (~31 vs ~35%), outboxer lands least (26%). Skills are placeholders (`f.def` .5, `f.handSpeed` 1) until M4; damage does nothing until M3.
  - M1: `src/engine/space.js` (real space, no-overlap guarantee), `src/engine/fight.js` (60 Hz fixed step), `src/brain/footwork.js` (modes: feel, circle, hold, press, cut, back, escape; style DNA in `FOOT`), `src/render3d/men.js` (placeholder men, guards). Report: `node v2/tests/footwork.js 10`.
  - Ed's S25 Ultra test (Oct 9): 60 fps on every quality setting (native res, shadows on, M1 with two men). Defaults stay res 2 / shadows on / cap 60 to save battery; there's headroom for M7 looks.
  - Look target (Ed, Oct 9): mostly the Fight Night series. Visual research: `research/fn_visuals.md` (read "From Ed's screenshots" first).
  - **Camera call (Ed, Oct 9):** he watches mostly in **portrait**, and portrait gets the close FN-style **fight cam** (low, side-on, tracks the pair, both men in frame). **Landscape** gets the **wide whole-ring cam** (what M0/M1 has now). Ed's "not sure", so make it a switch, with the default picked by orientation.

## M2 kickoff (done Oct 9, kept for the record)
- FOUNDATION section 5 (punches) and section 9 M2: jab, cross, hooks, uppercuts, body shots; block, slip, roll, pull back; keyed poses. Done when the audit runs with thrown/landed/connect % near targets (~53 / ~15 / ~29% per round) and straights land at ~95% extension.
- Order: (1) the fight cam per the camera call above (render only, keep the hash); (2) the punch model in the engine (phases load → snap → contact → retract, land/block/miss, glancing/solid/flush, region), with events on the bus; (3) defense; (4) `tests/audit.js` CompuBox-style; (5) keyed poses in the render.
- Reuse v1 knowledge, not code: `docs/NOTES.md` (combat), `research/combat_research.md`, `research/combat_audit.md`.
- Balance and visuals never share a commit. Sims before and after every engine change.

## M0 spec (skeleton)
- Create the folder layout from FOUNDATION section 8: `v2/src/{core,engine,brain,fighter,career,render3d,ui}`, `v2/tests`, `v2/build.js`, `v2/CLAUDE.md` (short v2 working rules).
- `src/core/rng.js`: a seeded, fast PRNG (e.g. mulberry32 or sfc32), with helpers `range`, `pick`, `chance` and `gauss`. It's deterministic: same seed, same sequence. Test it in `v2/tests/`.
- `src/core/events.js`: a tiny event bus (`on`, `emit`) for the engine → render/commentary/stats stream.
- `v2/tests/run.js`: a no-dependency test runner. Running `node v2/tests/run.js` runs every `*.test.js`, plus a determinism hash check.
- `src/render3d/`:
  - three.js pinned to an exact version from jsdelivr (an ES module through import maps, or a dynamic `import()`).
  - An empty ring with real dimensions: 6.1 m inside the ropes, posts, 3 or 4 ropes, the apron, a hot key light over the ring, a dark surround.
  - A TV camera.
  - An fps / frame-ms / draw-calls overlay.
  - A quality switch: pixel ratio 1.5/2/native, shadows on/off, 60/30 fps cap.
- `v2/build.js`: bundles `src/` into ONE `v2/index.html`. The published-page rules: scripts only from cdnjs/jsdelivr, fonts only from Google Fonts, no other network calls. The output is a build artifact: rebuild it, never hand-edit it.
- **Done when:**
  - `node v2/tests/run.js` passes.
  - `v2/index.html` opens headless in Playwright with no page errors, shown with a screenshot. See the root CLAUDE.md Env note for the chromium path.
  - It's published to a NEW private preview artifact (not v1's live game, not the old 3D test URL). Its link goes into `v2/CLAUDE.md`, and Ed gets the link to check fps on his S25 Ultra.
- Then **M1** (two men, one ring, footwork in real space), per FOUNDATION section 9.

## Rules
- Branch: `claude/brave-einstein-ojkyzm`. Commit each working step and push. No PR unless Ed asks. No model names in commits.
- Never publish to v1's live game. v2 goes to its own preview only.
- Engine code is plain JS with zero DOM, and Node runs it directly.
- Haiku helpers (`.claude/agents/researcher`, `sim-runner`): only for big-output jobs. Always verify what they report.
- Talk to Ed like a homie: short, light, roasts welcome. He reads on his phone.
