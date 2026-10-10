# Last Bell

Phone-first auto-boxing fight sim, stripped to the engine: `index.html` (~3,400 lines) boots straight into a fight (random or picked fighters). Career, saves, hub, camp and gym mode were cut (Oct 2026); the old full game lives in git history on `claude/epic-goldberg-ps6ip4` before that cut. Owner: Ed. Pure watch/idle sim, side view, real boxing rules, 1v1. The player is the coach.

**What to do next: `ROADMAP.md`** (the only to-do list). Design docs, read on demand: `docs/BRAIN.md` (AI fight IQ, skill levels plan, brain measurements), `docs/GYM.md` (gym + stable mode), `docs/NOTES.md` (system details, balance history: grep the heading you need), `proto/PLAN.md` (3D), `research/` (boxing research; `research/MIND.md` is the index).

## Who and how
- Ed reads on his phone. Talk to him like a homie: light, real, roasts welcome. Short answers.
- Ed runs parallel sessions: `git fetch` and check `git branch -r` for newer work before starting. The main line is `claude/epic-goldberg-ps6ip4` (the default branch).
- Never publish to the live game without Ed's explicit OK.

## Links
- **Live game** (Claude Code can NOT publish): https://claude.ai/artifact/KYmQg6PQo4qE4qoyDDDt7k. Ed uploads `index.html` in a claude.ai chat with `{db:{},user:{},sample:{}}` (sample powers corner talk; without it a keyword matcher runs). Save sync uses data/users/<id>/slot0..2.
- **Fight lab**: https://claude.ai/artifact/QhC1gMrw1pSabzuLzMw7Ev. `index.html` IS the lab now: publish it as-is, no capabilities.
- **Private preview** (full game, sample + db + user): https://claude.ai/artifact/KcaS5AaPWu316tV7nENsVo.
- **3D phone test**: https://claude.ai/artifact/5kVb4PyywgDcPBHSVSc3cu. `node proto/build.js`, publish a copy of `proto/ring3d.html` with the doctype/html/head/body tags stripped.
- `proto/ring3d.html` is a build output: rebuild, don't edit.
- Published-page rules: scripts only from cdnjs/jsdelivr/tailwind/jquery, fonts from Google Fonts, no other network calls, one file.

## Working rules
- Small, chunked edits. Commit after each working step, push.
- Engine changes need sims before and after. 50 fights is noise (±8%). 300+ per guard/style for balance, 400–500 for the audit; pool 1500+ before trusting a 1–2% difference.
- Render-only changes must keep the `same.js` hash (now **7f58e976**).
- Never change balance numbers and visuals in the same commit.
- Ed's voice in any writing is his own. Commentary lines are fine to write.
- Save tokens: never read all of `index.html`; grep, then read the section. Run long sims through a subagent or print summaries only. Long-form detail goes in `docs/NOTES.md`; keep this file short.

## Code map (markers `/* ===== LAST BELL : ... ===== */`)
engine (~203) → career (~1584: just fighter gen, divisions, gear, P4P stars) → render → audio → ui part 1 (helpers) → ui part 3 (fight loop, corner, replay) → the fight screen (`LAB`, `labNew`, `labFight`, `resultScreen`).
- Ring: x ±146 (RING), z ±115 (ZR), MIN_D 30. `P3()` projection.
- Fight loop: `footwork()` every frame, `decide()` on a timer, `react()` when a punch starts, `resolve()` at 60% of the punch, `miss()`. `nextRound()` at phase 'corner'.
- Knobs: `TUNE` (combat), `DMG` (damage), `CUT` (cuts/doctor), `GUARDS`, `STYLES` / `STYLE_*`, `SHOUTS` / `SHOUT_EDGE`, `COMBOS` / `PNUM` / `OPEN_W`, `TEMPO` (rhythm), `NEED` (round awareness), `TEACH` (corner lessons), `ANT` / `MEMV` / `FEINT_READ` (brain).
- Brain: `F.mem` + `memAdd`/`memPeek` (opponent memory), `antRead` (anticipation), `pickCounter(…, def)`, `need()`, `teachK`/`planOf`. Ring IQ: `ringIQ(sheet)`, `iqK`.
- Guards: standard, high, peekaboo, philly, cross, handslow. Fixed per career.
- Render: `drawFighter`, `body()`, `arms()` → `elbow()`, `lunge()`, `bodyPush()`, `settle()`, `carry()`, `blendSnap`, `spreadView()`.
- Corner talk: `roundNotes()`, `talkPrompt`, `ACT.talk`, `talkWords()` fallback, `FX.cornerCall` in `updShouts`.

## Tests (`tests/`, run from repo root)
Node extracts the engine+career sections and runs fights headless (`sim.js` is the shared loader). `PATCH="js code"` injects overrides. `LB=file.html` runs against another copy.
- `node tests/same.js 200`: determinism hash.
- `node tests/audit.js 500`: CompuBox-style audit (output, connect %, KDs, stoppages, decisions, upsets).
- `node tests/bal2.js 300 82 peekaboo,philly TAG` then `node tests/agg.js TAG`: guard win % vs standard.
- `TAG=x node tests/styles.js 300 82` then `node tests/styles.js agg x`: style round robin (`BIAS=1`, `GRD=roll`, `vs:volume,angle` for specials).
- `TAG=x node tests/shout.js 600 82 none,oracle,random,smart` then `node tests/shout.js agg x`: coach shout policies.
- `node tests/brain.js [tempo|iq|adapt|pace|styles] N`: brain report. Baselines in `docs/BRAIN.md`.
- `QUIET=3 node tests/teach.js 300 82 body 20`: corner-as-teacher log (control `PATCH="TEACH.max=0"`).
- `node tests/swap.js 100` side swaps, `rhythm.js 200` tempo, `gas.js 250` gas by round, `bodykd.js 300` KDs head/body.
- Also `cut.js`, `diag.js`, `probe.js`, `commtest.js`. Playwright: `tests/strip.py`, `shot.py`, `live.py` into `shots/` (gitignored); render tools in `tools/measure/` (see its README).

## Targets (check after engine changes)
Audit: ~53 thrown / ~15 landed / ~29% connect per round, stoppages ~25–30%, body KDs 5–8%. Styles 48–53% vs the field. Guards @82 vs standard ~48–58 (handslow highest). Specials vs base styles 48–54%.

## Env
- Playwright: if it asks for `playwright install`, launch with `executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`.
