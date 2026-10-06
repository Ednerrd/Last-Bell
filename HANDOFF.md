# Handoff (Oct 6 2026): a few moves to work out, then 3D

Read this first, then `CLAUDE.md` (rules, code map, tests) and `COMBAT.md` (the ranked plan). Don't read all of `index.html`: grep, then read the section.

## Who and how
- **Owner:** Ed. Talk to him like a homie: light, real, roasts welcome. He reads on his phone.
- **Branch:** `claude/determined-feynman-6z4lju` is the main line: it merged all of `claude/step9-contact` (tree taken as-is) and added Ed's ideas 1, 2, 4 and the KD walk fix on top. Earlier lines: `claude/step9-contact`, `claude/festive-thompson-e2ch70`, `ccr-9a5a152f-n8ld1d`, `claude/handoff-review-32nske`. **Several sessions have run in parallel off one handoff and duplicated work: run `git fetch && git branch -r` and check the newest commits before starting.** Commit small, push after each step. No PRs unless he asks.
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

## Next (Ed, Oct 6): small step first, then 3D
**Ed's call:** do the small step before the big one. #3 (Ring IQ when hurt or tired) is **parked**, Ed said "naw not #3". Skip 2D-only render polish (step 7, and the animation half of step 11): 3D redoes the animation.

1. ✅ **DONE (NOTES.md "Hit-stop and look per contact quality"), lab republished.** Was: hit-stop + look per contact quality (render only, finishes step 9).** The engine already tags every `hit` event with `q`: `clean` / `flush` / `glancing` / `smothered` / `blocked` (plus `hand`, `side`, `lane`, `glove`; misses carry the miss type). Today every landed shot looks the same and hit-stop is generic (grep `hitStop`: `FX.hitStop` is set on knockdowns ~.14 s and on some big hits). Target (research/combat_research.md, "Hit-stop"): freeze both men ~2-3 frames on a clean jab, 4-6 on flush/clean power, 8-10 on a knockdown punch, ~0-1 on blocked/glancing/smothered; optional ±1-2 px head shake during the freeze. Different look per quality: glancing slides off (glove skids past, small head turn), smothered is a shove with no snap, blocked thuds on the named glove/elbow, flush gets the big head snap + flash. Keep `same.js` at **d48949f6** (render only). Check it frame by frame with a contact sheet (`tools/measure/sheet.py`, or the cross-trigger capture idea in NOTES "Punches hit instead of paw") and at 60 and 120 Hz (`tools/measure/hz.py`): hit-stop must run on real time, not frames. Republish the lab after.
2. **NOW (Ed, Oct 6): "there's a couple moves to work out before the 3D."** Done so far: cross-arm/Philly elbows tucked, cross-arm right hand no longer a hammer (NOTES "Cross-arm and Philly elbows"). Ask Ed what else, then work each one out in the engine and render: sims before and after per CLAUDE.md, contact sheet to check the look, republish the lab after each one. 3D waits until these are done.
3. **Then: back to 3D (ask Ed first)** (`proto/PLAN.md`, `proto/RESEARCH.md`, NOTES "Semi-3D test"). `node proto/build.js` injects the engine into `proto/ring3d.src.html`. The 3D render should draw what the engine decides: punch lanes, where a shot lands or misses and why (the event detail above). Feet moving during punches (the engine half of step 11) can come with it. Ask Ed how he wants to start before a big build.
4. **Anytime (Ed's 5 minutes, not yours):** remind Ed the live game is far behind (style pass, legends, corner talk, combos, all of the combat work). He uploads `index.html` in a claude.ai chat, capabilities db + user + sample, after making a backup code of his careers.

Parked / open: #3 Ring IQ when hurt or tired + AI pacing (gassers don't save it for later); step 10 smarter AI; spoiler special ~46%; high guard ~45-46% (it was 46 before the gas work too).

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
