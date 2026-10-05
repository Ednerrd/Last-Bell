# Handoff (Oct 4 2026): combat polish

Read this first, then `CLAUDE.md` (rules, code map, tests) and `COMBAT.md` (the ranked plan). Don't read all of `index.html`: grep, then read the section.

## Who and how
- **Owner:** Ed. Talk to him like a homie: light, real, roasts welcome. He reads on his phone.
- **Branch:** `claude/new-session-ne6ynn`. Commit small, push after each step. No PRs unless he asks.
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
  - For render-only changes, `node tests/same.js 200` must stay at hash **3f36123a** (changed by step 8).
- **Don't** build the bond/trust system (future).

## Where we are
Ed: "Focus on combat: the boxing AI, combinations, punching, models. Perfect the core auto-boxing mechanics. Smoothness, fluidity, pace, speed." The gym mode (GYM.md, step 1 built) is parked until combat feels right.

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
| adeb0e3 / ad002b3 | **Step 5: footwork acceleration.** Feet ease toward target velocity at a per-style rate (4 + 24 x ret x legs), rope-escape side locked .4 s, smoothed cut-off read, sine punch step, timed pull. Counter style counter .6 -> .68. Audit 56.3 / 15.9 / 28.2% / stops 32%; styles 48.9-51.3; guards 47.9-58.4; specials 49-55 (angle 55.2, watch). same.js hash now f00751e1. Lab republished. Details: NOTES.md "Footwork acceleration". |

Ed asked for the lab: "don't show me the menus, just a boxing match I can randomize."

- **Rebuild:** `node tools/lab.js`.
- **Publish:** the `lab.html` file path, with no capabilities. Ignore the db/sample warnings: the lab doesn't save, and corner talk falls back to keywords.
- Last message to Ed: the lab is live; next is step 5; he should roll fights and say what looks off. Step 5 is done and the lab is republished. **Oct 5: step 6 dropped** (it's circling, not pass-through; only 2D shows it as a flip; see COMBAT.md). Ed is moving the fight view to 3D, so **no more 2D render polish**: skip step 7 and the render half of 11. **Next: engine steps 8 (rhythm), 9 (contact quality), 10 (smarter AI), engine half of 11**, all of which carry straight into 3D.
- **Oct 5, heads-up: two parallel sessions.** Branch `ccr-9a5a152f-n8ld1d` (built on `claude/handoff-review-32nske`) also did step 6 (XGAP side lock) and step 8a (`TEMPO` rhythm) and published them to the Fight Lab. This branch did neither step 6 (dropped: it's circling, a lock hurts 3D) nor their rhythm; its own rhythm (`RHY`) is in **Lab B**: https://claude.ai/artifact/YB3GCpPsrKw9PA6mUC9W7R. Ed picks one; don't republish the main lab from this branch until he does.
- **Oct 5: step 8 rhythm v1 done** (commits 4a58bdf..now; NOTES.md "Rhythm"). Base styles, guards, audit in band; output ~52.5 (a bit quiet). Specials awkward/volume/spoiler dropped 4-10 points: tuning pass pending, **after** Ed says whether the rhythm reads in the lab. same.js hash 3f36123a. Published as Lab B (main lab NOT republished, see above).

## Next (COMBAT.md steps 5–11)
1. **Step 5, engine: footwork acceleration** (the biggest jerkiness left; the audit measured ~400 velocity snaps/min per fighter).
   - `footwork()` sets velocity directly (~line 707). Ease it instead: `F.vx += (vx - F.vx) * (1 - Math.exp(-dt*12))`.
   - Lock the rope-escape side for ~.4 s (~704); it flip-flops ~180/min.
   - Smooth the opponent velocity used for cutting off the ring (~689).
   - Make the punch step a sine shape, not a square wave (~741).
   - The `react()` pull at ~1021 gets overwritten by footwork the next tick. Give it a timer.
   - Line numbers are from before this session's edits; grep. Changes balance, so do a full sim pass.
2. ~~**Step 6, engine: no pass-through.**~~ Dropped Oct 5: it's circling (45+ u apart in z at every swap), and 3D renders it as a turn.
3. **Step 7, render:** uppercut curve break at aP .4 in `body()` (switch at .35, ramp the lean); close-range spacing in `spreadView` (adds 0 below distance 32); smooth `bodyPush` / `settle` offsets.
4. **Steps 8–11:**
   - rhythm (burst then reset, feel-out moments);
   - contact quality (clean / glancing / smothered / blocked, each with its own hit-stop);
   - smarter AI (target around the guard, a fading memory of what hurt him, styles differ in rhythm and range; use the fighter DNA cards);
   - feet moving during punches, flat feet when tired.

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
