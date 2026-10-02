# Last Bell

Phone-first auto-boxing career sim. One self-contained file: `index.html` (~2,800 lines). Owner: Ed. Pure watch/idle sim, side view, real boxing rules, 1v1.

## Publishing (important)
The live game is a published Claude artifact: https://claude.ai/artifact/KYmQg6PQo4qE4qoyDDDt7k
Claude Code can NOT publish there. When a version is ready, Ed uploads `index.html` in a claude.ai chat and asks to publish it to that URL (capabilities db + user carry forward; save sync uses data/users/<id>/slot0..2).
Published-page rules: external scripts only from cdnjs/jsdelivr/tailwind/jquery CDNs, fonts from Google Fonts, no other network calls. Keep it one file.

## Working rules
- Small, chunked edits. Commit after each working step (git is the safety net).
- Engine changes need sims before and after. Sample sizes matter: this sim is very sensitive. 50 fights is noise (±8%). Use 300+ fights per guard for balance, 400–500 for the combat audit.
- Never change balance numbers and visuals in the same commit.
- Ed's voice in any writing is his own. Commentary lines are fine to write.

## Code map (markers `/* ===== LAST BELL : ... ===== */`)
engine → career → render → audio → commentary (`const Comm`) → ui part 1 (storage, title, create) → ui part 2 (hub, offers, camp) → ui part 3 (fight loop, corner, replay, results).
- Ring: x ±146 (RING), z ±115 (ZR), MIN_D 30. `P3()` projection.
- Fight loop: `footwork()` every frame, `decide()` on a timer, `react()` when a punch starts, `resolve()` at 60% of the punch, `miss()`. `nextRound()` at phase 'corner'.
- `TUNE` object (engine top) holds the combat knobs. `DMG` is global damage. `CUT` holds cut/doctor params. `GUARDS` table holds guard factors.
- Guards: standard, high, peekaboo, philly, cross, handslow. Fixed per career. `guardSkill()` scales perks; weaknesses always apply.
- Ring IQ: `ringIQ(sheet)`, drives combo reading, ring cutting, escapes.
- Render: `GUARD_POSE` table + per-guard idle/defense animation in `body()` and `arms()`. Pose smoothing via `v._sm` (per-fighter state in `SM`). Snapshot fields used: guard, defZ, defU, ctr, tired, gi, hitKind, hitT.

## Tests (`tests/`, run from repo root)
Node extracts the engine+career sections and runs fights headless. `PATCH="js code"` env var injects overrides (e.g. `PATCH="Object.assign(TUNE,{vol:.36});DMG=.32"`).
- `node tests/audit.js 500` — CompuBox-style realism audit: output, connect %, KDs, stoppage rate and timing, decision types, upset rate by OVR gap.
- `node tests/bal2.js 300 82 peekaboo,philly TAG` then `node tests/agg.js TAG` — guard win % vs standard with mirrored stats (results append to /tmp/res_TAG.txt).
- `node tests/cut.js 500` — cut TKO %, cut frequency, doctor looks.
- `node tests/diag.js 150 82 philly` — per-guard detail (land/block/evade %, KDs).
- `node tests/probe.js` — knockdowns and stoppages by round.
- `node tests/commtest.js` — runs fights through commentary, counts lines per event.
- `python3 tests/strip.py "<js rows>" out.png`, `tests/shot.py`, `tests/live.py` — Playwright captures (poses, UI flow, live fight bursts) into `shots/`.

## Current state
Live build has: 6 guards (balanced 51–55% vs standard at OVR 82 under the OLD combat tuning), Ring IQ, combo AI, ring movement, doctor fix, guard UI, commentary, per-guard animations.

In progress: COMBAT REALISM PASS. Knobs exist in `TUNE` but defaults still reproduce the old behavior. Tested candidate values (500-fight audit):

```
TUNE: vol .36, pace 1.45, jabEv .12, jabBlk 1.4, form 3.8, even .01, evenAt .25,
      jShare .3, jNoise .9, jLean .7, flash .009, kdHurt .18, upFloor 3, wear .08,
      kdAt 3, kdBase 2.6, kdDiv 9
DMG .32
CUT fresh .004, worn .06, wearPow 1.2   (cuts in ~30% of fights, doctor TKO 0.8%)
```
Result vs real (CompuBox ~54 thrown / ~16–17 landed / ~30% per round):
59 thrown, 19 landed, 32% connect; jab 25%, power 33%; stoppages 28% (timing 23% early / 24% mid / 53% late); draws 6% of decisions, SD 6%; favorites win 70% at +3 OVR, 77% at +6, 86% at +10.
(Stoppage/draw/upset targets are estimates, not sourced.)

What the knobs do: vol/pace = punch output; jabEv/jabBlk = jabs get picked off more; form = random on/off night (upsets); even/evenAt/jShare/jNoise/jLean = judging (shared view + per-judge taste); flash = clean counters can drop a fresh fighter; kdHurt/upFloor = a knockdown leaves him hurt and finishable; wear = permanent headMax damage per head shot (drives late stoppages); kdAt/kdBase/kdDiv = KD check on hurt fighters (uses shot danger `dn`, normalized to DMG).

## To do (in order)
1. Make the candidate values above the defaults. Re-run the audit to confirm.
2. Cut tuning: target doctor TKO ~2% of fights (`tests/cut.js`). Try lowering `CUT.doc` slightly or raising `onEye`.
3. Re-run guard balance at 300/guard (all 5 vs standard at OVR 82, plus philly/handslow/cross at 65). Target 45–55% at 82. Previous guard numbers were tuned under old combat.
4. Live visual check (tests/live.py), commit, then Ed publishes via chat.

## Known notes / ideas
- New fighters show 0% guard fit for skill guards (starting stats ~48, formula starts at 50). Idea: show projected fit at ceiling in the UI.
- Philly wins ~58% at OVR 65 because low-IQ opponents don't throw the lead right. Left in as flavor; one-line fix if it feels cheap.
- AI corner switches to 'ko' when trailing late, which causes a knockdown spike around round 8 of 10. Realistic, but watch it.
- Phone performance with the new animations is untested on a real device.
