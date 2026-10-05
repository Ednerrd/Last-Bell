# Last Bell

Phone-first auto-boxing career sim. One self-contained file: `index.html` (~4,000 lines). Owner: Ed. Pure watch/idle sim, side view, real boxing rules, 1v1. The player is the coach.

**New direction:** `GYM.md` (gym + stable, Oct 2026). **Current focus:** `COMBAT.md` (smoothness/pace plan, ranked). **Read on demand, not up front:** `VISION.md` (old vision), `NOTES.md` (system details, balance history, past measurements: grep the heading you need), `proto/PLAN.md` + `proto/RESEARCH.md` (3D).

## Publishing (important)
The live game is a published Claude artifact: https://claude.ai/artifact/KYmQg6PQo4qE4qoyDDDt7k
Claude Code can NOT publish there. When a version is ready, Ed uploads `index.html` in a claude.ai chat and asks to publish it to that URL (capabilities db + user carry forward; save sync uses data/users/<id>/slot0..2).
**Talk to your fighter needs the `sample` capability:** the next live publish must declare db + user + sample (`{db:{},user:{},sample:{}}`). Without sample the corner talk still works on a simple keyword matcher.
Published-page rules: external scripts only from cdnjs/jsdelivr/tailwind/jquery CDNs, fonts from Google Fonts, no other network calls. Keep it one file.
Private preview for Ed (Claude Code can publish here): https://claude.ai/artifact/KcaS5AaPWu316tV7nENsVo (sample + db + user).
Fight lab for Ed (straight into a fight, no menus): https://claude.ai/artifact/QhC1gMrw1pSabzuLzMw7Ev. Rebuild with `node tools/lab.js`, publish `lab.html` (no capabilities needed). Republish after every combat change.

## Working rules
- Small, chunked edits. Commit after each working step (git is the safety net).
- Engine changes need sims before and after. 50 fights is noise (±8%). 300+ per guard/style for balance, 400–500 for the audit; pool 1500+ before trusting a 1–2% difference.
- Never change balance numbers and visuals in the same commit.
- Ed's voice in any writing is his own. Commentary lines are fine to write.
- Save tokens: never read all of `index.html`; grep, then read the section. Run long sims through a subagent or print summaries only. Put new long-form detail in `NOTES.md`, keep this file short.

## Code map (markers `/* ===== LAST BELL : ... ===== */`)
engine (~197) → career (~1372) → render (~1900) → audio (~2831) → commentary (`const Comm`) → ui part 1 (~2995: storage, title, create) → ui part 2 (hub, offers, camp) → ui gym (gym hub, walk-ins, training plan) → ui part 3 (~3499: fight loop, corner, replay, results).
- Ring: x ±146 (RING), z ±115 (ZR), MIN_D 30. `P3()` projection.
- Fight loop: `footwork()` every frame, `decide()` on a timer, `react()` when a punch starts, `resolve()` at 60% of the punch, `miss()`. `nextRound()` at phase 'corner'.
- Knobs: `TUNE` (combat), `DMG` (global damage), `CUT` (cuts/doctor), `GUARDS` (guard factors), `STYLES` / `STYLE_*`, `SHOUTS` / `SHOUT_EDGE`, `COMBOS` / `PNUM` / `OPEN_W`.
- Guards: standard, high, peekaboo, philly, cross, handslow. Fixed per career. Ring IQ: `ringIQ(sheet)`.
- Render: `drawFighter`, `body()`, `arms()` → `elbow()`, `lunge()`, `bodyPush()`, `settle()`, `blendSnap`, `spreadView()`. Details in NOTES.md.
- Gym mode (see GYM.md "Built"): logic at the end of the career section (`newGym`, `fv`, `gymWeek`, `trainWeek`, `signWalkin`, `bookFight`, `P4P_2026`), UI in `ui gym`. Globals: `gymG` (the gym save), `save` = `fv(G, P)` while a fighter is open.
- Corner talk: `roundNotes()`, `talkPrompt`, `ACT.talk`, `talkWords()` fallback, `FX.cornerCall` fires in `updShouts`.

## Tests (`tests/`, run from repo root)
Node extracts the engine+career sections and runs fights headless. `PATCH="js code"` injects overrides. `LB=file.html` runs against another copy.
- `node tests/audit.js 500`: CompuBox-style audit (output, connect %, KDs, stoppages, decisions, upsets).
- `node tests/bal2.js 300 82 peekaboo,philly TAG` then `node tests/agg.js TAG`: guard win % vs standard.
- `TAG=x node tests/styles.js 300 82` then `node tests/styles.js agg x`: style round robin (`BIAS=1`, `GRD=roll`, `vs:volume,angle` for specials, pairs to split over cores).
- `TAG=x node tests/shout.js 600 82 none,oracle,random,smart` then `node tests/shout.js agg x`: coach shout policies.
- `node tests/same.js 200`: seeded determinism hash for recording-only engine changes (now 26d689a1).
- `node tests/swap.js 100`: side swaps per minute (left-right order flips).
- `node tests/rhythm.js 200`: tempo (gaps between exchanges, share >3 s, longest quiet, round-1 feel-out).
- `node tests/gas.js 250`: gas by round, style and stamina stat (tank, end-of-round gas, output). `node tests/bodykd.js 300`: knockdowns by head/body.
- `node tests/gym.js 3`: gym mode headless for N years (signing, training, booking, fights, P4P).
- Also: `cut.js`, `diag.js`, `probe.js`, `commtest.js`; Playwright captures `strip.py`, `shot.py`, `live.py` into `shots/` (gitignored).

## Current targets (to check after engine changes)
Audit: ~56 thrown / ~16 landed / ~29% connect per round, stoppages ~30%. Styles 48–53% vs the field. Guards @82 vs standard within ~48–58 (handslow highest). Specials vs base styles 48–54%.

## Env notes
- Playwright: if it asks for `playwright install`, launch with `executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`.

## To do
1. Ed publishes via chat (big batch: style pass, camp learning, special styles, weight classes, legends, visuals, backup codes, scouting, corner talk, combos). Tell Ed to make a backup code of his careers first.
2. Phone performance check on a real device (S25 Ultra).
3. Ideas: drill a combo in camp, call combos by number in the corner talk, AI corner shouts. Future (not now): bond/trust system.
