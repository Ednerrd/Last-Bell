# Handoff (Oct 6 2026, evening): the brain, merged

Read this first, then `CLAUDE.md` (rules, code map, tests) and `BRAIN.md` (the brain plan, every measurement). Don't read all of `index.html`: grep, then read the section.

## Who and how
- **Owner:** Ed. Talk to him like a homie: light, real, roasts welcome. He reads on his phone.
- **Branch:** `claude/admiring-archimedes-bczsms` is the newest line. It is the brain branch (`claude/laughing-pascal-31dfag`, which already had the main line `ccr-ce0946a0-yr9gyi` merged in) plus the corner-as-teacher work. Start new work from here.
- **Before you start, `git fetch` and check the other branches.** Ed runs parallel sessions. This session lost a pass by building on a two-day-old base while another session was rebuilding the same brain on the main line. If a newer branch touches the same code, ask Ed before working on it.
- **Commit trailer:** `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` + `Claude-Session: <your session link>`. No model IDs anywhere else.
- **Never publish to the live game** without Ed's explicit OK. Free to republish: the brain lab, the fight lab, the private preview (links in CLAUDE.md). The plain fight lab still shows the main line without the brain. Don't overwrite it with an older build (check what's live first, `Artifact read`).
- **Engine changes:** sims before and after, never balance + visuals in one commit. same.js hash is **84ba46a3**.

## Where we are
- **The brain (BRAIN.md):** B0 report, B1 opponent memory with fading, B3 anticipation + counters keyed to the defense used. On the main line: IQ 90 beats IQ 40 63%, IQ 80 beats 60 58%, a habit fighter gets figured out (smart man's counters climb 2.0 → 2.6/rd).
- **New this session (BRAIN.md "Corner as teacher"):**
  - Corner as teacher: a call that works leaves a lesson that outlasts the shout. Learning speed = IQ + career experience. Commentary says when it sticks.
  - Feint read: smart men stop biting on feints.
  - Warned spoiler: a smart spoiler eases off after a warning.
  - Dev log: `tests/teach.js`.
- **The teacher's measured effect is small.** About +1 point of body share after the corner goes quiet, gone by round 6–7, and no change in who wins. Exempting lessons from the between-round decay keeps them all fight but doesn't make them bigger. The dials are `TEACH.max` / `step`. **Waiting on Ed:** how much should a lesson be worth?

## Open, in order (Ed's order from the review chat)
1. **Ed's call on lesson size**, then retune `TEACH` and re-run `tests/teach.js` + `tests/shout.js` (smart / oracle, with and without `PATCH="TEACH.max=0"`).
2. **Round awareness / pacing** (Gap E/F): a `need()` signal (protect the lead vs need the KO) into aggression, power picks and resets. It may fold into B2 intent modes, so read BRAIN.md B2 first.
3. **B6 balance:** guards spread (high ~35–40, cross ~40, handslow/philly 55–60 vs standard), feinter ~44 (the feint read cost it ~1.5), pboxer and jabgrab low.
4. **Later (after the gym):** Gap C, defensive read inside `react()`. Ed's constraint: it re-weights within the guard's own defenses, capped around ±25%, so a peekaboo fighter stays a peekaboo fighter, with a commentary hook so it shows. B3 anticipation already covers part of it, so check before building.
5. Within-round read decay (~0.98 per exchange) was agreed in the review but not built. B1 memory already fades, so check whether it's still needed.

# Previous handoff (Oct 6 2026): next is the 3D conversation, on Ed's order

Read this first, then `CLAUDE.md` (rules, code map, tests) and `COMBAT.md` (the ranked plan). Don't read all of `index.html`: grep, then read the section.

## Who and how
- **Owner:** Ed. Talk to him like a homie: light, real, roasts welcome. He reads on his phone.
- **Branch:** `ccr-ce0946a0-yr9gyi` (Oct 6) is the newest line: `claude/determined-feynman-6z4lju` fast-forwarded, plus the phone test page and the spoiler fix. Before that, `claude/determined-feynman-6z4lju` was the main line: it merged all of `claude/step9-contact` (tree taken as-is) and added Ed's ideas 1, 2, 4 and the KD walk fix on top. Earlier lines: `claude/step9-contact`, `claude/festive-thompson-e2ch70`, `ccr-9a5a152f-n8ld1d`, `claude/handoff-review-32nske`. **Several sessions have run in parallel off one handoff and duplicated work: run `git fetch && git branch -r` and check the newest commits before starting.** Commit small, push after each step. No PRs unless he asks.
- **Commit trailer:**
  ```
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: <your session link>
  ```
  No model IDs anywhere else.
- **Never publish to the live game** (https://claude.ai/artifact/KYmQg6PQo4qE4qoyDDDt7k) without Ed's explicit OK.
- **You may republish freely:**
  - the Fight Lab, Ed's main way to look at combat now;
  - the private preview (full game).
  Both links are in CLAUDE.md.
- **Engine changes:**
  - Run sims before and after (`node tests/audit.js 500` plus style/guard checks per CLAUDE.md targets).
  - Never mix balance and visual changes in one commit.
  - For render-only changes, `node tests/same.js 200` must stay at hash **d48949f6** (changed by idea 2, gas + body shots).
- **Don't** build the bond/trust system (future).

## Where we are
Ed: "Focus on combat: the boxing AI, combinations, punching, models. Perfect the core auto-boxing mechanics. Smoothness, fluidity, pace, speed." The gym mode (GYM.md, step 1 built) is parked until combat feels right.

**Ed (Oct 5): solidify the boxing first, then convert to the 3D version again** (`proto/PLAN.md`). So engine work (AI, rhythm, contact, footwork) is the priority since it carries into 3D; 2D-only render polish (step 7) is lower value. Why 3D: to *see* punch lanes, where a shot lands or misses and why, like Fight Night Champion. So steps 9-10 should make the engine emit that detail in its `hit`/`miss` events (hand, lane/angle, contact quality, miss type: short, slipped left/right, ducked, pulled, blocked on which glove), not just pick an outcome. The 3D render then draws what the engine decided.

Done this session (all pushed):

| Commit | What |
|---|---|
| 5d6ebb8 | `COMBAT.md` plan, plus `research/combat_research.md` (Fight Night, Undisputed, Thrill of the Fight, real timing) and `research/combat_audit.md` (our engine, measured). |
| 61c2734 | Step 1: `carry()` in the render. Pose hand-offs (new combo punch, cancel, def or state change) fade out over ~40 ms instead of popping. Hip spikes 207 → 48/min; combo pops 62 → 2. |
| 52d5d0e | Step 2: `body()` keeps pose smoothing on through hits and stuns. Hit, stun and buckle deltas (`hd`) are added after smoothing. |
| 0e09677 | Step 4: same feel at 60 and 120Hz (Ed's S25 Ultra). Camera and zoom ease per second (`FX.dtR`); KO "erupt" runs on the sim accumulator; slow-mo replay blends snapshots; screen shake is smooth noise. |
| 49cc49f | Step 3: `snapIn` / `snapBack`. Punches accelerate into contact, overshoot ~3.5%, snap back. Contact still at aP .6. |
| 3e28239 | `research/fighters_a.md` and `research/fighters_b.md`: DNA cards for 14 real fighters (CompuBox output, jab share, body %, range, rhythm, combos, counters, flaws, if/then AI rules). |
| 5a85264 | **Fight Lab**: `tools/lab.src.js` + `tools/lab.js` build `lab.html`. It drops straight into a fight: New fight (random), Rematch, and Pick (weight, rounds, each side as random / a P4P star / any style, guard override). |
| 5d21ada..now | **Step 6: no pass-through.** Left-right order kept; escape pivots and rope angle-offs may still switch sides (walling them off cost the out-boxer 6 points). Facing turns over .2 s in render. Swaps 1.07 -> 0.6/min. Hash ef225fb9. |
| adeb0e3 / ad002b3 | **Step 5: footwork acceleration.** Feet ease toward target velocity at a per-style rate (4 + 24 x ret x legs), rope-escape side locked .4 s, smoothed cut-off read, sine punch step, timed pull. Counter style counter .6 -> .68. Audit 56.3 / 15.9 / 28.2% / stops 32%; styles 48.9-51.3; guards 47.9-58.4; specials 49-55 (angle 55.2, watch). same.js hash now f00751e1. Lab republished. Details: NOTES.md "Footwork acceleration". |

Ed asked for the lab: "don't show me the menus, just a boxing match I can randomize."

- **Rebuild:** `node tools/lab.js`.
- **Publish:** the `lab.html` file path, with no capabilities. Ignore the db/sample warnings: the lab doesn't save, and corner talk falls back to keywords.
- Step 6 is done (no pass-through, see NOTES.md "No pass-through"), lab republished. Step 8a (rhythm: resets, feel-outs) done, see NOTES.md "Rhythm" (watch slugger 58, high guard 46, handslow 60). **Oct 5: Ed picked Lab A (this line: step 6 + `TEMPO` rhythm) over Lab B (`ccr-026fa9ad-j4d8rw`, `RHY` rhythm, no step 6): "the pace was slightly better". Lab B is dead; don't merge it.** 8b done render-only (NOTES.md "Rhythm"), lab republished. **Next: 9 (contact quality, emit lane/miss detail for 3D), then 10. Skip step 7 (2D-only render polish) per Ed's 3D plan.** **Oct 5 (claude/step9-contact): step 9 part 1 done: hit/miss events carry hand, lane, contact quality, glove, miss type (9a); damage follows arm extension at contact (Ed asked for it). same.js fa768ffe. AI now reads extension too (out-boxer 43 -> 47). Next: hit-stop + look per quality (render), then step 10, slugger first (59%, eats out-boxer and swarmer).**

## LATEST (Oct 6, `claude/laughing-pascal-31dfag`): Ed switched to the brain project
- Ed: skip the 3D review for now; "the fight iq, fight engine, the boxers iq, the decisions they make... the ai boxer is the brain." Plan, baseline and results: **`BRAIN.md`**. Test: `node tests/brain.js`.
- This branch = main line `ccr-ce0946a0-yr9gyi` (merged in) + the brain work (B0 test, B1 fading memory, B3 anticipation and defense-keyed counters) + the gym-backup restore fix.
- B1/B3 were first built and tuned on the old step-5 engine. After the merge, the main line's balance numbers were taken and the brain was re-measured on the real engine (see BRAIN.md).
- **2D build for the live publish = main-line tip `4e62be9` + the restore fix, with no brain** (the brain still needs balance work). The `56bd4d4` file from earlier today was stale: it came from the old step-5 line. Don't ship it.
- Live game cloud saves are empty. Ed's gym save is in the preview's cloud. Never commit save data (the repo is public).

## NEXT SESSION: review the 3D model with Ed (Oct 6)
Ed: "handoff with 3D model and let's review in the next session." This is a **review**, not a build. Look at the 3D proto with him, write down what he likes and hates, then agree on where Phase 1 starts. Don't change code until he says go.

**What to look at.** The current 3D model is the phone test page: https://claude.ai/artifact/5kVb4PyywgDcPBHSVSc3cu (proto `proto/ring3d.html` + the perf panel; current engine as of `3ba1739`). The older 3D test link (https://claude.ai/artifact/D2MQxRkXSGLhmyLLa5EsmU) is a stale build; ignore it.
- Source: `proto/ring3d.src.html` (~950 lines). Build: `node proto/build.js`. What's in it: NOTES.md "Semi-3D test". Plan: `proto/PLAN.md` (phases 0-4). Research: `proto/RESEARCH.md` (FNC, Thrill of the Fight, Round 4, Undisputed).
- Look at it yourself first (headless, no GPU here): `npm i three@0.170.0` in the scratchpad, `pip install playwright` if missing, then `python3 tools/measure/shot3d.py proto/ring3d.html <scratch>/node_modules/three/build/three.module.min.js out.png` and Read the png. `tools/measure/perf3d.py` checks the phone-test panel end to end.

**Review agenda (walk Ed through it, collect notes per item):**
1. **Phone numbers first** (phase 0). Did he run "Run test (3 min)" and 10 min on one setting on the S25 Ultra? Get fps per setting, warmth, battery drop. Headless draw calls were 124-150, right at the 150 budget: if it stutters, merging meshes is the first fix. These numbers set the quality defaults.
2. **Spacing and reach.** The engine's 2D distances are spread apart in 3D (`spad` up to +26) and punches lunge in (up to 30-34). Does the distance look like real boxing? Phase 1 item 1 replaces this with one clean mapping.
3. **Punches.** Do straights land nearly locked out, hooks wide, uppercuts under? Is there snap (the 2D got coil + accelerating drive + hold + 1.5x return; the 3D has its own older load+snap curve)? Does he see the punch lanes and why a shot misses? That was the whole point of 3D (FNC style). The engine already emits hand/lane/contact quality/miss type in `hit`/`miss` events; the 3D only partly uses them.
4. **Guards.** **Cross-arm in 3D is still the old pose** (`GUARD3.cross`, forearms high), not Ed's Ken Norton stack (rear forearm across the chest under the chin, lead across the belly; PLAN.md "Guard reference"). Philly elbows must stay down. Check all 6 guards (Pick isn't in the proto: hit New fight until each shows up, or add a guard picker if he wants one).
5. **Footwork.** Planted feet that step vs sliding; pivots on hooks; back foot following a lunge.
6. **Hits and knockdowns.** Head snap by punch type, body shots folding late, knockdowns falling along the punch, taking a knee on body shots, getting up.
7. **Models and look.** Faces, builds by weight class, gloves, trunks. Phase 2 stuff, but note what bugs him.
8. **Ref and camera.** Ref placement, the 4 cameras + drag.

**Then decide with Ed** where Phase 1 starts. Options pitched before: (a) engine drives the 3D, drawing punch lanes and why a shot lands or misses (recommended, it's why we're going 3D); (b) fighter models and animation system first; (c) feet during punches first. Write his notes and the decision into this file and `proto/PLAN.md`.

## Next (Ed, Oct 6): small step first, then 3D
**Ed's call:** do the small step before the big one. #3 (Ring IQ when hurt or tired) is **parked**, Ed said "naw not #3". Skip 2D-only render polish (step 7, and the animation half of step 11): 3D redoes the animation.

1. ✅ **DONE (NOTES.md "Hit-stop and look per contact quality"), lab republished.** Was: hit-stop + look per contact quality (render only, finishes step 9).** The engine already tags every `hit` event with `q`: `clean` / `flush` / `glancing` / `smothered` / `blocked` (plus `hand`, `side`, `lane`, `glove`; misses carry the miss type). Today every landed shot looks the same and hit-stop is generic (grep `hitStop`: `FX.hitStop` is set on knockdowns ~.14 s and on some big hits). Target (research/combat_research.md, "Hit-stop"): freeze both men ~2-3 frames on a clean jab, 4-6 on flush/clean power, 8-10 on a knockdown punch, ~0-1 on blocked/glancing/smothered; optional ±1-2 px head shake during the freeze. Different look per quality: glancing slides off (glove skids past, small head turn), smothered is a shove with no snap, blocked thuds on the named glove/elbow, flush gets the big head snap + flash. Keep `same.js` at **d48949f6** (render only). Check it frame by frame with a contact sheet (`tools/measure/sheet.py`, or the cross-trigger capture idea in NOTES "Punches hit instead of paw") and at 60 and 120 Hz (`tools/measure/hz.py`): hit-stop must run on real time, not frames. Republish the lab after.
2. ✅ **Ed's pre-3D moves: done.** Cross-arm and Philly elbows tucked, straights drive through flat (no hammer right hand), cross-arm guard rebuilt on Ed's Ken Norton photos (rear forearm across the chest under the chin, lead across the belly, chin tucked). NOTES "Cross-arm and Philly elbows"; 3D guard reference in `proto/PLAN.md`. Lab republished (v14).
3. **Pre-3D checks (Oct 6), done:** 3D proto rebuilt on the current engine, runs clean headless. High guard 47.1% ±1.9 (n800): left alone. Spoiler 45.7 -> 48.9 (lean wears the tank, NOTES "Spoiler fix"). Lab republished (v15).
   **3D phase 0 (phone test), built, waiting on Ed:** `proto/ring3d.src.html` has a "Phone test" panel (fps, frame ms, draw calls; resolution / shadows / fps cap switches; "Run test" tries 5 settings for ~3 min and shows a table; session avg, fps by minute, battery). Published for Ed: https://claude.ai/artifact/5kVb4PyywgDcPBHSVSc3cu (publish copy strips the doctype/html/head/body tags). Ed runs it on the S25 Ultra: the 3-minute test, then 10 minutes on one setting for heat and battery. His numbers pick the quality defaults (PLAN.md phase 0 budget: 60 fps, ratio <= 2, one 1024 shadow, < 150 draw calls; headless showed 124-150 calls, right at the edge).
4. **The 3D conversation: see "NEXT SESSION" above.** Don't start anything until Ed says go. Then talk it through with him before building: how to start (options pitched: engine drives `proto/ring3d` drawing punch lanes and why a shot lands or misses, recommended; or fighter models first; or feet moving during punches first), phone performance on the S25 Ultra. Read `proto/PLAN.md`, `proto/RESEARCH.md`, NOTES "Semi-3D test" first. `node proto/build.js` injects the engine into `proto/ring3d.src.html`.
5. **Anytime (Ed's 5 minutes, not yours):** remind Ed the live game is far behind (style pass, legends, corner talk, combos, all of the combat work). He uploads `index.html` in a claude.ai chat, capabilities db + user + sample, after making a backup code of his careers.

Parked / open: #3 Ring IQ when hurt or tired + AI pacing (gassers don't save it for later); step 10 smarter AI; spoiler vs out-boxer ~43% (he never gets close enough to grab).

### Done on Ed's Oct 5 list
1. ✅ **Punches look like pawing: done** (render only, contact still at .6). Visible coil (shoulder and hips pull back), accelerating drive in the last ~18% (~4 frames on a right hand), 2-frame hold, home by 86%; body on the same clock. Right hand at range: ~3 frames out, 2 at contact, ~3 back (was ~8 hanging). Not done: extra head snap on the man hit (existing hit reaction kept). Details: NOTES.md "Punches hit instead of paw". Also done: KD neutral-corner walk stays on the standing man's side (within noise in sims).
2. ✅ **Stamina, gas and body shots: done** (NOTES.md "Gas and body shots"). Work wears the tank, a worn tank hits softer/slower/less, heavy power shots cost more, swarmer conditioning trait; liver shot (delayed fold), wind knocked out, worn body slows the legs; commentary lines. Output 54 -> 50 by r9, slugger 59 -> 50%, styles 47.7-51.1, body KDs 5.9%. Open: AI pacing (gassers don't save it), spoiler special ~46%, high guard ~45-46 (was already 46).
3. (parked) **Ring IQ when hurt or tired (step 10).** Now a hurt man clinches and moves; when the other man is hurt, `decide()` just does aggr ×1.8 (~813), no weighing. Want: hurt or gassed → disengage, jab his way back, buy time, re-engage. Smelling blood → weigh it (own gas, can the hurt man still crack, counter puncher playing possum, IQ/heart); a blitz that misses or gets blocked burns gas and leaves him open to a surprise KO.
4. ✅ **Slugger 59%**: fixed by 2 (50%). Was: folds into 2 and 3 (he slugs 12 rounds and never pays for it).

Skip step 7 (2D-only render polish). Still to do from step 9: hit-stop + look per contact quality (render); can ride with idea 1.

## Measuring tools (`tools/measure/`)
Python + Playwright, chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Point `OUTDIR` at a scratch folder that holds the html under test.

| Tool | Use |
|---|---|
| `mkrec.py SRC DST ANCHOR` | Copy SRC with a per-frame recorder hook inserted after the line containing ANCHOR. Use `"carry(v, J[i], AR[i], dt));"` for current code. |
| `rec.py` | Env `SECS`, `HTML`, `OUT`, `OUTDIR`. Records a live fight at 1x. |
| `ana2.py rec.json` | Spikes per minute by cause, plus the 20 worst frames. |
| `spk.py a.json b.json …` | Spikes per minute and per 100 punches thrown. Normalise this way: fight-to-fight variance is big, and running several browsers at once lowers fps and inflates spikes. Run one or two at a time. |
| `sheet.py` | Env `HTML`, `TAG`, `NF`, `WAIT`. Contact sheet of NF consecutive 60fps frames from a combo exchange: `contact_TAG.png`. Look at it with Read. |
| `hz.py HTML HZ` | Drives a fight to KO at a given refresh rate; checks erupt steps and replay frames. |
| `labtest.py` | Smoke test of `lab.html`: picks two stars, fights to the result, rematch. Check there are no errors. |

Ed can't send video easily. ffmpeg is installed: if he uploads a clip to `clips/` on the branch, split it into frames for reference.
