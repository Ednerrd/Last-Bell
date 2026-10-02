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
- `TAG=x node tests/shout.js 600 82 none,oracle,random,worst,smart,only_body` then `node tests/shout.js agg x` — coach shout policies (side 0 shouts, mirrored stats). `STY=`/`GRD=` filter matchups. Note side 0 alone wins ~48–52% with no shouts; compare against `none` from the same batch.
- `python3 tests/strip.py "<js rows>" out.png`, `tests/shot.py`, `tests/live.py` — Playwright captures (poses, UI flow, live fight bursts) into `shots/`.

## Current state
Live build has: 6 guards, Ring IQ, combo AI, ring movement, doctor fix, guard UI, commentary, per-guard animations, all under the OLD combat tuning.

Repo (not yet published) has the COMBAT REALISM PASS finished:
```
TUNE: vol .36, pace 1.45, jabEv .12, jabBlk 1.4, form 3.8, even .01, evenAt .25,
      jShare .3, jNoise .9, jLean .7, flash .009, kdHurt .18, upFloor 3, wear .08,
      kdAt 3, kdBase 2.6, kdDiv 9
DMG .32
CUT fresh .004, worn .06, wearPow 1.2, onEye .65
GUARDS: cross str 1.08, peekaboo head 1 / ev .98, handslow ctr 1.3
```
Audit (2000+ fights) vs real (CompuBox ~54 thrown / ~16–17 landed / ~30% per round):
60 thrown, 19 landed, 32% connect; jab 25%, power 33%; stoppages ~32% (timing ~20% early / 24% mid / 56% late); draws ~8% of decisions; favorites win ~60% at "+3" (really +2: the audit rounds gap/2 down on each side), ~74% at +6, ~87% at +10.
Cuts (cut.js, 5000 fights): cuts in ~27% of fights, doctor TKO ~2.0%, doctor looks ~4%. CUT.doc alone barely moves it; onEye is the lever.
Guard balance (600+ mirrored fights each, vs standard): at 82 high 54, peekaboo 52.6 (n2100), philly 49, cross 49, handslow 52; at 65 philly 48, handslow 47, cross 51.
(Stoppage/draw/upset targets are estimates, not sourced.)

What the knobs do: vol/pace = punch output; jabEv/jabBlk = jabs get picked off more; form = random on/off night (upsets); even/evenAt/jShare/jNoise/jLean = judging (shared view + per-judge taste); flash = clean counters can drop a fresh fighter; kdHurt/upFloor = a knockdown leaves him hurt and finishable; wear = permanent headMax damage per head shot (drives late stoppages); kdAt/kdBase/kdDiv = KD check on hurt fighters (uses shot danger `dn`, normalized to DMG).

Coach shouts (repo only): during a round the player yells one of six calls (`SHOUTS`: jab, body, press, counter, move, hands). `Fight.shout(side, k)` sets `F.order` for SHOUT_LEN (14 sim-s, ~40s of fight clock). `sgOf(F)` mixes the call's mods into the STRATS lookup, scaled by `q` (how well he hears it: Ring IQ, heart, hurt, and spam makes him tune out). `shoutFit()` scores the call 0..1 against the moment (guard holes, his body/gas, who is hurt/trapped, his punch pace), worn down by `F.used` (the other corner adjusts to a call you keep using). Above `SHOUT_EDGE.bar` the call gives an edge (atkEdge/defEdge/ctrEdge in react, evade, block, counters); below it the call costs (60%). Only the player's corner shouts; the AI never does. No shouts = old behavior exactly.
Shout results (600 mirrored fights each, vs no shouting): perfect coach +12%, simple human rules +2%, worst call 0%, random yelling −3%, mashing one call −5% (Body ~+3%).

## To do
1. Ed publishes via chat.
2. Optional: phone performance check on a real device.
3. Ideas: the AI corner could shout too (title fights?), and a better human-ish policy in tests/shout.js to tune against.

## Planned: legends + special styles (Ed's call, NOT started, wait for his go)
Problem found first: the five base styles are badly unbalanced. Identical stats, standard guard, 400 fights per matchup: Counter-puncher wins ~71% vs the field, Boxer-puncher ~57, Swarmer ~55, Slugger ~43, Out-boxer ~24 (Out-boxer vs Counter 13%). Likely causes: counter's miss-counter (`STYLES.counter.counter` .85) + rope-a-dope + low output; Out-boxer lives on the jab, which the realism pass made easier to block and slip.
Build order:
1. Balance the five base styles (target ~45–55% each vs the field, 400+ fights per matchup).
2. Engine support for new styles: Volume puncher, Pressure boxer, Body snatcher, Jab-and-grab (existing knobs); Angle fighter (pivot after combos), Switch-hitter (stance switch mid-fight + render flip), Awkward (blunts the opponent's read), Veteran spoiler (needs a fouls system: warnings, point deductions, DQ).
3. One legend per division, the only fighter with that style. Stays top 5, may hold a belt. The boss version is stronger than the unlocked version (the unlock is a sidegrade, not an upgrade).
   Names: inspired by real fighters, slightly altered so you know who it is but it's not them.
4. Beat the legend → unlock his style. Ed picked: move up/down in weight like real boxing (one fighter chases legends across divisions). Careers are currently locked to one division with one roster, so this needs per-division rosters, weight-change rules and size/stat shifts.
   Open: can the current fighter learn an unlocked style (camp?) or only new fighters.

## Env notes
- Python Playwright here may not match the preinstalled browser. If `live.py` asks for `playwright install`, launch with `executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'` instead.
- Even 600-fight guard runs swing ±2–4% between runs. Pool to 1500+ before trusting a 1–2% difference.

## Known notes / ideas
- Referee lane fixed (was within a body-width of a fighter 96% of frames, now ~10%).
- Guard card shows fit now plus a ceiling tick (new fighters start near 0% for skill guards).
- Philly used to win ~58% at OVR 65 (low-IQ opponents don't throw the lead right). Under the new combat it's 48%, so the flavor is gone.
- AI corner switches to 'ko' when trailing late, which causes a knockdown spike around round 8 of 10. Realistic, but watch it.
- Phone performance with the new animations is untested on a real device.
