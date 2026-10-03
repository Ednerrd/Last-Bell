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
- Render: `GUARD_POSE` table + per-guard idle/defense animation in `body()` and `arms()`. Anatomy (pass 1): `drawFighter` builds tapered, muscled limbs with `segPath` (width at each end + a bulge on each side), merges pieces with `mass()` (outline all, then fill), torso from the `TORSO` profile in its own hip→neck frame (`torsoPts`), trunks on the hips with flat hems. Girth `G = build^1.5`, so flyweights are wiry and heavyweights thick. Cost ~+1.5–2 ms/frame in headless (6.8 → ~8.5–9). Pass 2: face (eye white/pupil, brow, nostril, cheek/jaw shadow, swelling puffs out, mouth opens when gassed/hurt), `rim()` light on upward-facing edges, `crease()` muscle lines, boots rebuilt (`boot()`: foot + shaft as one shape, rotates about the toe). Animation: breathing (`J.breath`, chest + shoulders), chin tucks behind the punching shoulder, back heel turns over on rear shots (`J.heelB`), front foot pivots on hooks (`J.pivotF`), jab steps in, clean head shots knock the gloves out, body shots drop the elbows, knees buckle on big shots, hurt legs wobble. ~9.1 ms/frame headless. Pose smoothing via `v._sm` (per-fighter state in `SM`). Snapshot fields used: guard, defZ, defU, ctr, tired, gi, hitKind, hitT.

## Tests (`tests/`, run from repo root)
Node extracts the engine+career sections and runs fights headless. `PATCH="js code"` env var injects overrides (e.g. `PATCH="Object.assign(TUNE,{vol:.36});DMG=.32"`).
- `node tests/audit.js 500` — CompuBox-style realism audit: output, connect %, KDs, stoppage rate and timing, decision types, upset rate by OVR gap.
- `node tests/bal2.js 300 82 peekaboo,philly TAG` then `node tests/agg.js TAG` — guard win % vs standard with mirrored stats (results append to /tmp/res_TAG.txt).
- `node tests/cut.js 500` — cut TKO %, cut frequency, doctor looks.
- `node tests/diag.js 150 82 philly` — per-guard detail (land/block/evade %, KDs).
- `node tests/probe.js` — knockdowns and stoppages by round.
- `node tests/commtest.js` — runs fights through commentary, counts lines per event.
- `TAG=x node tests/styles.js 300 82` then `node tests/styles.js agg x` — style round robin: every pair of styles, identical stats + standard guard, sides swapped. Prints win % vs the field, a fingerprint per style (punches/rd, power %, landed, avg distance, gas, counters/rd, seconds on the ropes per round, stoppage wins) and the matchup grid. `BIAS=1` gives each fighter his style's stat lean, `GRD=roll` rolls his style's usual guard (BIAS=1 GRD=roll = what the AI roster looks like). Pass pairs to split runs over cores: `outboxer-counter,slugger-swarmer`.
- `TAG=x node tests/shout.js 600 82 none,oracle,random,worst,smart,only_body` then `node tests/shout.js agg x` — coach shout policies (side 0 shouts, mirrored stats). `STY=`/`GRD=` filter matchups. Note side 0 alone wins ~48–52% with no shouts; compare against `none` from the same batch.
- `python3 tests/strip.py "<js rows>" out.png`, `tests/shot.py`, `tests/live.py` — Playwright captures (poses, UI flow, live fight bursts) into `shots/`.

## Current state
Live build has: 6 guards, Ring IQ, combo AI, ring movement, doctor fix, guard UI, commentary, per-guard animations, all under the OLD combat tuning.

Repo (not yet published) has the COMBAT REALISM PASS finished:
```
TUNE: vol .36, pace 1.45, jabEv .12, jabBlk 1.4, form 3.8, even .01, evenAt .25,
      jShare .3, jNoise .9, jLean .7, flash .009, kdHurt .18, upFloor 3, wear .08,
      kdAt 3, kdBase 2.6, kdDiv 9
DMG .35 (was .32; raised after the style pass so stoppages stay ~30%)
CUT fresh .004, worn .06, wearPow 1.2, onEye .65
GUARDS: cross str 1.08 / head 1.2, peekaboo head 1 / ev .98, handslow ctr 1.3, high head 1.15 / hold 1.1
STYLE PASS: reach .2, reachIn 14, jabCtr .5, moveEv .2, setup .3 (TUNE); STYLE_IN, STYLE_OUT, STYLE_OPEN, STYLE_RAMP, STYLE_STICK, STYLE_PLANS
```
Audit after the style pass (900 fights, DMG .35): 57 thrown, 16.6 landed, 29% connect, stoppages ~30%, favorites 57/78/87 at +3/+6/+10, cut TKO 1.8%, cuts in ~21% of fights.
Audit before the style pass (2000+ fights) vs real (CompuBox ~54 thrown / ~16–17 landed / ~30% per round):
60 thrown, 19 landed, 32% connect; jab 25%, power 33%; stoppages ~32% (timing ~20% early / 24% mid / 56% late); draws ~8% of decisions; favorites win ~60% at "+3" (really +2: the audit rounds gap/2 down on each side), ~74% at +6, ~87% at +10.
Cuts (cut.js, 5000 fights): cuts in ~27% of fights, doctor TKO ~2.0%, doctor looks ~4%. CUT.doc alone barely moves it; onEye is the lever.
Guard balance after the style pass (pooled 600–1100 mirrored fights each, vs standard): at 82 high ~55, peekaboo 52, philly 48.5, cross ~53, handslow ~52; at 65 all 47.6–52.3. (Before: high 54, peekaboo 52.6, philly 49, cross 49, handslow 52.)
(Stoppage/draw/upset targets are estimates, not sourced.)

Style pass knobs: reach = a power shot thrown from the edge of its range is easier to see; jabCtr = a missed jab is harder to counter than a missed hook; moveEv = a moving target is harder to hit (scaled by guard ev); setup = a power shot right behind a jab is harder to slip/block. All evasion adds are scaled by the guard's ev factor.

What the knobs do: vol/pace = punch output; jabEv/jabBlk = jabs get picked off more; form = random on/off night (upsets); even/evenAt/jShare/jNoise/jLean = judging (shared view + per-judge taste); flash = clean counters can drop a fresh fighter; kdHurt/upFloor = a knockdown leaves him hurt and finishable; wear = permanent headMax damage per head shot (drives late stoppages); kdAt/kdBase/kdDiv = KD check on hurt fighters (uses shot danger `dn`, normalized to DMG).

Coach shouts (repo only): during a round the player yells one of six calls (`SHOUTS`: jab, body, press, counter, move, hands). `Fight.shout(side, k)` sets `F.order` for SHOUT_LEN (14 sim-s, ~40s of fight clock). `sgOf(F)` mixes the call's mods into the STRATS lookup, scaled by `q` (how well he hears it: Ring IQ, heart, hurt, and spam makes him tune out). `shoutFit()` scores the call 0..1 against the moment (guard holes, his body/gas, who is hurt/trapped, his punch pace), worn down by `F.used` (the other corner adjusts to a call you keep using). Above `SHOUT_EDGE.bar` the call gives an edge (atkEdge/defEdge/ctrEdge in react, evade, block, counters); below it the call costs (60%). Only the player's corner shouts; the AI never does. No shouts = old behavior exactly.
Shout results after the style pass (500 each, SHOUT_EDGE atk .6 def .5 ctr 1.1): perfect coach +10%, simple human rules +1%, random yelling −5%. (Before, at atk .4 def .35 ctr .8: +12 / +2 / −3, mashing one call −5%.)

## To do
1. Ed publishes via chat (big batch now: style pass, camp learning, special styles, weight classes, legends).
2. Optional: phone performance check on a real device.
3. Ideas: the AI corner could shout too (title fights?), and a better human-ish policy in tests/shout.js to tune against.

## Styles (repo only, done)
Ed's descriptions: Counter-puncher fights slower and waits for an opening; Boxer-puncher is the balanced hybrid that throws volume when needed; Swarmer throws a lot, burns stamina, relentless; Slugger is pressure + power (fewer, heavier shots); Out-boxer fights at distance, the outside is his strong suit.
Traits in `STYLES` (comments above the table): open, legs, stick, out, inside, hit, ramp. AI corner picks round plans per style (`STYLE_PLANS`).
Fingerprint (identical stats, thrown/rd, avg distance, gas): counter 43 / 63 / 96%, slugger 49 / 56 / 90% (83% power), boxer-puncher 60 / 61 / 87%, out-boxer 61 / 66 / 96% (43% power), swarmer 82 / 59 / 52%.
Balance: before, Counter-puncher won 72.5% vs the field and Out-boxer 22% (identical stats). Now 48.3–53.8 identical, 46.8–55.5 with stat leans + rolled guards. Matchups run ~38–62 (styles make fights).
How the out-boxer got fixed (for next time): he lost on the cards, not by KO; 43% of the power shots that landed on him caught him mid-punch in the pocket. Range/legs knobs alone did nothing; what worked was moveEv + setup + jabCtr + reach + stepping out when the other man gets inside.
Stat economy (NOT fixed, known): +8 in one stat vs identical fighter (400 fights): defense 61%, power 57, speed 57, accuracy 55.5, recovery 53, chin 52, stamina 51, body 50.5, heart 50, footwork 49. OVR weights price them almost the same, so builds that pump head movement win and chin/stamina/heart/body/footwork are near-dead points. Style stat leans were reworked to be value-neutral against this (see scratch calc in commit e014194 message). Fixing it properly = make the dead stats matter (stamina/heart in long fights, footwork in range control) or reprice OVR_W.

## Legends, special styles, weight classes, camp learning (repo only, done)
- Special styles (`special: true` in STYLES; random fighters, the create screen and the tests use `BASE_STYLES`): volume (Volume puncher), angle (Angle fighter), awkward, switch (Switch-hitter), body (Body snatcher), pboxer (Pressure boxer), spoiler (Veteran spoiler), jabgrab (Jab-and-grab), feinter (Feint master). Combo menus come from a base style via `STYLE_COMBO`. Traits: eco, angle (+ `lostT` on the other man), odd + leap, swap (stance flips mid-fight, `F.stance`, halves his read), bodyX, pjab, spoil (ties up combos, dirty shots in the clinch, warnings, point deductions via `rs.ded`), grab (+ lean), bite. Knobs: STYLE_ANGLE/ODD/SWAP/SPOIL/GRAB/BITE.
- Balance, each special vs each base style (identical stats, 200–260/pair): 48–54%. The unlock is a sidegrade; the legend's edge is his stats. `TAG=x node tests/styles.js 200 82 vs:volume,angle` runs it.
- Legends (`LEGENDS`, fictional, inspired-by names Ed asked for): one per division, generated into every roster by `ensureLegend` (old saves too), stays top 5, no fade/retire, may hold a belt. Wins 58–76% vs 87-rated contenders. Beat him → `P.unlocked` gets his style (camp chip), `P.beatLegends`. Rankings tab stars him and lists all nine.
- Style is locked for the career (Ed's call): camp only offers his own base style (`P.baseStyle`) plus legend styles he has earned (`campStyles`). Stance is free: picked at creation, changeable in camp.
- Camp learning: Style and stance row in camp, each change uses a focus slot. Fluency `styleFit`/`stanceFit` (STYLE_LEARN first .55 / camp .3 / fight .08, times gym mult and Ring IQ). While learning he fights a blend (`blendStyle`, `comboW`); a new stance is rusty (`stanceRust`).
- Corner's call (auto) now uses `aiStrategy(0)` for the player (style-aware), instead of a neutral plan all fight.
- Weight classes: hub "Weight class" button, one division at a time (`changeDiv`). Each division keeps its own roster/belts (`world.away`), catches up on return. Up: power −2, chin −1, speed +1; down: power +1, chin +1, stamina −3, recovery −2 (stats and ceiling). Keeps 60% of points, vacates belts. `P.titleDivs` tracks multi-division titles.
- Not done / ideas: no art for the special styles beyond the stance flip (angle step-offs use the normal slide); foul DQ is not in (warnings + point deductions only); legends never move divisions; the other divisions don't sim while you are away except a catch-up when you return.

## Env notes
- Python Playwright here may not match the preinstalled browser. If `live.py` asks for `playwright install`, launch with `executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'` instead.
- Even 600-fight guard runs swing ±2–4% between runs. Pool to 1500+ before trusting a 1–2% difference.

## Known notes / ideas
- Referee lane fixed (was within a body-width of a fighter 96% of frames, now ~10%).
- Guard card shows fit now plus a ceiling tick (new fighters start near 0% for skill guards).
- Philly used to win ~58% at OVR 65 (low-IQ opponents don't throw the lead right). Under the new combat it's 48%, so the flavor is gone.
- AI corner switches to 'ko' when trailing late, which causes a knockdown spike around round 8 of 10. Realistic, but watch it.
- Phone performance with the new animations is untested on a real device.
