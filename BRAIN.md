# The Brain (Oct 6 2026): the AI boxer's fight IQ and decisions

Ed: "the fight iq, fight engine, the boxers iq, the decisions they make, play a huge part into how the game runs because the ai boxer is the brain."

This replaces COMBAT.md steps 8 (rhythm) and 10 (smarter AI) and feeds step 9. Steps 6, 7 and 11 stay as they are.

## Skill levels: the brain's backbone (Ed, Oct 7, planned, not built)

Ed: step back to the beginning. A beginner doesn't do the champ's things worse, he does different things. Decided in a 12-question review (Oct 7):

- **Levels:** Novice, Intermediate, Pro/Elite, Worldclass. The overall level is built from per-skill mastery (both: a Pro jab can sit next to a Novice body attack).
- **Skills (all four groups):**
  - Offense: jab, power shots, combos, body work, feints and setups.
  - Defense: blocking, slipping and rolling, footwork out, clinching.
  - Ring craft: cutting off the ring, rope escape, range control, angles.
  - Fight IQ: countering, reading habits, pacing, adjusting between rounds, taking corner advice.
- **Scalable, earned:** mastery grows from real fights and training (and what he learns from both). No sparring for now (Ed: skip it).
- **Training teaches knowledge:** how to deal with each style and stance, plus his own skills. He carries a familiarity rating per opponent style and per stance. A man who's never seen a southpaw is lost early; camp can drill the next opponent's style.
- **A skill he doesn't own still gets tried, badly:** telegraphed (read and countered harder), off balance after a miss, arm-punch damage, and the commentary calls it ("he's trying to feint, nobody's buying it"). Funny and real.
- **Upsets:** a fighter one level down wins ~15–20%, more with the right plan, high IQ, or a great combination landing.
- **Start levels (no preference from Ed, default):** raw beginner = Novice; journeyman = Intermediate with a few Pro skills; veteran = Pro with fading legs; ranked pro = Pro/Worldclass with set habits. Generated opponents get mastery from record and rank.
- **Shown as:** a skill sheet (a mastery bar per skill) and level-up moments ("he's finally sitting down on that right hand"). No level badge.

How the built brain maps on: B1 memory → reading habits; B3 anticipation/counters → countering; feint read and FEINT_READ → feints; `need()` → pacing; corner as teacher (`TEACH`, `teachK`) → taking corner advice; B4 setups → feints and setups; B2 rhythm → pacing at the top levels. Today these all scale off `ringIQ()` (stats + `exp`); the skill sheet replaces that one dial.

**Open before building:** the overlap between the 10 `STATS` and the skills (accuracy, defense, footwork). Proposal: stats stay the body and tools (power, speed, chin, stamina, ...), skills are what he knows how to do with them.

### Build order (each a commit, sims before and after, never balance + visuals together)
- **L0:** `tests/levels.js`: win % by level gap, skill use and success by level, bad-technique counts. Baseline first.
- **L1:** data only. `sheet.sk` (mastery per skill), `sheet.know` (per style + stance), the level derived from them, defaults per walk-in type and opponent record. Recording only: same.js hash holds.
- **L2:** the engine reads mastery: how often a skill is tried, how well, and the bad-technique outcomes (telegraph read, off-balance beat, damage cut, commentary hook).
- **L3:** style and stance familiarity in the fight (slow reads early against the unfamiliar, caught more).
- **L4:** learning: fights and training raise mastery and knowledge; camp drills the next opponent's style.
- **L5:** UI: skill sheet and level-up moments (visual commit, separate).
- **L6:** balance: upsets one level down 15–20%, then the CLAUDE.md targets (styles, guards, audit). The old B6 list folds in here.

## How the brain works now (engine, `decide` ~768, `pickCombo` ~949, `react` ~1005, `pickCounter` ~1032)
- **A dice stack on a timer.** Every .2–.6 s `decide()` re-rolls everything: clinch → grab → escape → step out → combo → feint → block. 53% of rolls do nothing but nudge footwork. He has no intent that lasts longer than one roll.
- **No rhythm.** An exchange every ~2.5 s, all fight. No feel-out, no burst-then-reset, no "take a breather", no "steal the round late".
- **The read is thin.** `F.read` counts which of HIS punch kinds the other man avoided and which of his punches landed. Plus guard holes. It never forgets, and it knows nothing about the OTHER man's habits: what he leads with, what he throws after a jab, which way he slips, when he punches.
- **Defense is a stat roll.** `react()` is one chance per punch from defense/footwork/speed. Seeing the same jab 20 times doesn't make him any better at reading it.
- **Counters are random.** `pickCounter()` picks from a short list. It doesn't care which defense he used (slip outside should bring the right hand over, a duck brings the hook back, a pull brings a straight on the way in).
- **No setups.** Feints are a flat 7% roll. Only the feint-master style has a feint → bite → punish loop. Nobody sets up the right hand with the jab, or goes to the body to bring the hands down.
- **Ring IQ barely matters.** `iqK` mostly scales how much the read weights combo picks, plus some noise. It should decide what he notices, how fast he catches on, and how well he adjusts.
- **What already exists to build on:** style knobs, guard holes, shouts/plans, bait on the ropes, the escape menu, and the fighter DNA cards (`research/fighters_a.md`, `fighters_b.md`), which already hold if/then AI rules for 14 real fighters.

## What the new brain does
1. **Intent (the rhythm).** Each fighter is always in one mode, and it lasts seconds, not one roll:
   - feel-out, work (jab, establish range), press, burst (commit to an exchange), reset (step out, breathe), wait-to-counter, hunt (he's hurt), survive.
   - Style DNA sets how long each mode lasts and what follows it: activity ratio, burst length, patience. Score, damage, stamina and the round push the transitions.
   - `decide()` then picks actions inside the mode instead of re-rolling the whole stack.
2. **A memory of the other man (with forgetting).** It tracks what he leads with, what he throws after what, how he defends each punch, when he punches (after I jab, when he's on the ropes, when I reset), and what hurt me.
   - Old evidence fades, so habits that change get noticed.
   - Ring IQ sets how fast he learns, how much evidence he needs, and how many habits he can track at once.
3. **Anticipation.** A predicted punch is easier to defend and easier to counter. A low-IQ fighter rarely predicts anything; a high-IQ one starts reading you by round 3-4.
4. **Counters that make sense.** A table keyed to the defense he used and the punch he beat:
   - slip outside the jab → right hand over;
   - duck the hook → hook or uppercut back;
   - pull back from a straight → step in with a straight;
   - shoulder roll → right hand from the shoulder.
5. **Setups and traps.** Short planned sequences that use the memory:
   - jab, jab, then the right hand behind the third;
   - body, body, then the head when the hands drop;
   - feint the jab to draw his slip, then hook where he slips to;
   - show a look twice, change it on the third.
6. **Adjusting.**
   - In the round: stop throwing what keeps getting countered, and lean on what keeps landing.
   - Between rounds: his own brain plus the corner. A smart fighter makes real changes; a dumb one keeps doing the same thing.
7. **DNA.** Every base and special style gets real rhythm and choice numbers from the DNA cards: activity ratio, jab share, body %, range, counter rate, risk. Later the same DNA can sit on individual fighters (legends, gym fighters).

## How we measure it (`tests/brain.js`, built first)
- **Decision mix and tempo:** the gaps between exchanges should vary (feel-outs and bursts), not sit at 2.5 s like a metronome.
- **IQ ladder:** same stats, IQ 40 vs 90. The smart one should win clearly (target to be set from the baseline, roughly 65–75%), and his edge should grow as the fight goes on.
- **Adaptation test:** give one side a fixed habit (always slips right, always jabs after a jab). A high-IQ opponent's exploit rate should climb round by round. A low-IQ one stays flat.
- **Style identity:** output, jab share, body % and range per style, compared with the DNA cards.
- **Plus the usual targets:** audit (~56/16/29%, stops ~30%), styles 48–53, guards, specials, shouts.

## B0 baseline (Oct 6, `node tests/brain.js`, rating 80, 10 rds)
Run: `node tests/brain.js tempo 400`, `iq 400`, `adapt 300`, `styles 640` (one process each, ~5 min in parallel).

| Measure | Now | Target |
|---|---|---|
| decide() doing nothing | 52% | n/a (modes replace the roll) |
| Quiet gaps over 4 s | 1.8% (p90 2.3 s) | ~8–12% (feel-outs, resets) |
| Burstiness (CV of punches per 30 s) | 0.30 | ~0.5 |
| Output by round (per man) | 60 → 57 → 59, flat | round 1 ~15% under mid-fight, late rounds up (real cards: slow start, late surge) |
| IQ 90 vs 40, identical stats | wins 56% (loses 33%) | ~70%+ |
| IQ 90 vs 40, rounds won early → late | 57 → 60% | edge grows: ~55 → 70% |
| IQ 80 vs 60 | wins 46% vs 42%, a coin flip | ~58% |
| Slip habit: smart man's hook/upper share early → late | 32 → 29%, goes the WRONG way | climbs (he hooks the slipper) |
| 1-2 habit: smart man stops it early → late | 66 → 66%, flat | climbs 10+ points; IQ 40 stays flat |

Why the slip test goes backwards: `read.av` counts avoided shots per punch kind, and a man who slips everything avoids straights and hooks alike, so the read learns nothing. The 1-2 test is flat because `react()` has no memory at all.

Styles already differ in mix (out-boxer 54% jab, slugger 66% power, body snatcher 32% body, counter-puncher 4.2 counters landed/rd vs ~1.1 for the slugger). They don't differ in rhythm.

## On the main-line engine (Oct 6, after merging `ccr-ce0946a0-yr9gyi`)
B1/B3 were built on the old step-5 engine, then moved onto the main line (rhythm, contact quality, gas, no pass-through). The main line's balance numbers were taken, then retuned.

| Measure | Main line, no brain | Main line + brain (final) |
|---|---|---|
| Audit thrown / landed / connect, stops | 51.7 / 15.2 / 29.5%, 29.5% | 52.4 / 14.6 / 27.8%, 28% |
| IQ 90 vs 40 | 58.7% | 63% (300-run: 64%) |
| IQ 80 vs 60 | 52.3% | 58% |
| 1-2 habit man vs IQ 90 (smart man's win %) | 53.5% | 69.5%; counters climb 2.0 → 2.6/rd |
| Base styles | (not rerun) | 47.9–53.2 |
| Specials | 46.4–53.7 | 44.0–54.6: pboxer 44, feinter 44.9, jabgrab 46.3 |
| Guards vs standard | high 45, cross 45, peek 52, philly 52, handslow 56 | high 39, cross 43, peek 47.5, philly 58, handslow 63 |

- Tuning on top of the main line: counter style .68 → .63, `STYLE_IN.ctr` .5 → .65, swarmer inside 1.15 → 1.3, pressure boxer hit 1.18 → 1.25. The range shift is style-aware: out-boxers barely shift inside, and pressure men (cutK > .9) barely shift out.
- Ablation on pboxer and feinter (200/pairing): switching off anticipation or memory values moves each by ≤3 points, all within noise. No single brain part is the cause.
- **B6 list:** the guard spread (high/cross low, handslow/philly high, partly there before the brain), and the pboxer / feinter / jabgrab specials.

## Corner as teacher, feint read, warned spoiler (Oct 6, merged from `claude/admiring-archimedes-bczsms`)
Built first on the old step-5 engine, then re-applied on this branch's tip (`56354b5`). That branch's own `pickCounter` change was dropped: B3's `pickCounter(…, def)` already does it.
- **Corner as teacher** (`TEACH` step .12 / max .4 / keep .6, `teachK`, `planOf`, `Fight.teach`): a live call that pays off (its shot lands, a block on 'hands', an evasion on 'move') grows `read.les[call]`; `planOf` mixes `les * TEACH.max` of that call's mods into the round plan after the shout ends. `teachK = .15 + .45*iqK + .4*min(1, sqrt(exp)/5)`, so career experience finally matters. Emits `learned` at .3 (commentary `learned_*`). Only the player's corner shouts, so it only helps the player. This is B5's "between rounds: the corner" piece, started.
- **Feint read** (`FEINT_READ` per 10 / max .45): `read.feints` was never written. Now a fresh bite counts, and a smart defender bites less (`react(D, A, P, feint)`). Decays x.6 between rounds.
- **Warned spoiler** (`STYLE_SPOIL.cool` 1.5): dirty-shot rate / (1 + warn * cool * iqK).
- Hashes: brain tip `ddf15bfa`; with the feint read and spoiler patched off it still matches (the teacher only acts when the corner shouts); everything on: `84ba46a3`.

| Measure (n) | Brain tip | + these three |
|---|---|---|
| Audit thrown / landed / connect, stops (500) | 53.2 / 15.1 / 28.3%, 25.0% | 53.3 / 15.0 / 28.1%, 27.6% |
| Shouts none / smart / oracle (600, ±2.1) | n/a | 48.0 / 51.8 / 58.7; teacher off: smart 51.8, oracle 56.5 |
| Feinter vs base styles avg (300/pair) | 45.4 | 43.9 (smart men bite less; already a B6 item) |
| Spoiler vs base styles avg (300/pair) | 52.1 | 51.4 |
| Guards vs standard (300) | high 34.7, peek 52.0, philly 58.1, cross 39.3, handslow 59.9 | high 39.6, peek 50.4, philly 53.5, cross 40.4, handslow 55.5 |

**What survives the break** (`QUIET=3 node tests/teach.js 300 82 body 20`; the corner only calls "Body!" in rounds 1–3, control `PATCH="TEACH.max=0"`): lesson at the bell .34 / .43 / .47 in rounds 1–3, then .28 / .17 / .10 / .06 in rounds 4–7 once the corner is quiet. Body share in round 4: 22.0% vs 21.7% control (old engine: 22.9 vs 21.6). A live body call moves it about 4.5 points. With `TEACH.keep=1` (old engine) the lesson holds at ~.69 all fight but is still worth only ~1 point. **The break is not what washes it out, the size is:** a full lesson is at most 40% of a call, and a call itself is small. The dials are `TEACH.max` / `step` (and the `SHOUTS` mods), not `keep`. Ed's call.

**Ed's call (Oct 6): medium.** `TEACH` step .12 → .18, max .4 → .7, keep .6 → .7. Same QUIET=3 body test, body share with the corner quiet (control 20.9 / 21.3 / 20.3 in rounds 4 / 6 / 7): old 21.4 / 21.4 / 20.8, max .7 + step .18 alone 22.7 / 21.8 / 21.2, **with keep .7 23.2 / 22.3 / 21.3** (lesson at the bell .45 in round 4, .15 by round 7).
Win rates, smart corner vs a quiet one (shout.js, rating 82): old 51.8 (600; 51.9 pooled over 1800 with the milder variants: max .7 keep .6 51.4, max .55 keep .7 52.6). **New 55.8 ±1.1 over 2400** (runs of 600 went 61.4, 52.1, then 54.8 over 1200: pool before trusting one run). Oracle 60.7 (600, was 58.7). Hash holds at 84ba46a3 (no shouts in same.js).

## Round awareness / pacing (Oct 6, Gap E/F)
`need(F)` (engine, next to `tempoStart`): > 0 he needs something, < 0 he can protect what he has. Cards: `-lead / roundsLeft * .6`. Clock: in the last `NEED.stealT` (30) s of a round he reads the round with `rdScore` (the judges' formula, pulled out of `scoreRound`) and turns it up if it's close or slightly gone. Times `lerp(.35, 1, iqK)`: a dumb man barely reads the cards. Hurt, he never goes looking for it. Cached as `F.need` in `decide`.
- Uses: aggression (`NEED.aggr` .3 / `coast` .2), resets (`rstP` x (1 - .5 n) when he needs it, more when ahead), combo picks (power when he needs it; jabs and short work when protecting, replaces the old `late && lead` lines in `pickCombo`).
- `NEED.want` (range shift) is 0: at 6 it jammed the slugger in close (50.3 -> 46.8 vs the field); with range off he's back to 49.5.
- Not built: gassers saving it for later (stamina pacing). The corner's between-round plan (`aiStrategy` ko/move) already existed and stays.

`node tests/brain.js pace N` (new). Before -> after (800 / 800 fights, rating 80):
| Measure | Before | After |
|---|---|---|
| Rds 8-10 thrown/rd: ahead / close / behind on the cards | 55.7 / 51.7 / 57.5 | 52.8 / 50.2 / 62.8 |
| Power % when ahead / behind | 60.8 / 67.2 | 61.3 / 67.5 |
| Last 30 s vs the rest of the round, close round | 0.97 | 1.04 |
| Down 3+ after 7: comebacks | 2.2% | ~2% (no change: a man down 3 late at even stats rarely gets it back) |
| Audit thrown / landed / connect, stops (500) | 53.2 / 15.2 / 28.6%, 29.8% | 53.5 / 15.3 / 28.7%, 31.0% |
| IQ 90 vs 40 / 80 vs 60 (300) | 58.3 / 49.3 | 63.0 / 49.3 |
| Base styles round robin (300/pair) | bp 51.2, ctr 50.3, slug 50.3, swarm 49.2, out 49.0 | out 52.5, bp 52.4, slug 49.5, ctr 48.4, swarm 47.4 |
Hash 84ba46a3 -> **9fe862cf**. For B6: swarmer 47.4 sits just under the 48 floor.

## Steps (each a commit, sims before and after, never balance + visuals together)
- ✅ **B0:** `tests/brain.js` and a baseline report. No engine change.
- ✅ **B1:** Opponent memory with fading (`F.mem`, `memAdd`/`memPeek`, `punchVal`). Results, Oct 6:
  - Memory feeds combo picks and wanted range. The scouting report (`GUARD_HOLES`) fades out as his own memory builds (`MEMV.seen`).
  - A first cut (stronger inference, flat block value) took IQ 90 vs 40 to 61–63%, but broke balance: cross 43%, slugger 55%, spoiler 45%. Blocking guards got read twice (scouting + memory), and the out-boxer got dragged inside.
  - Final: block value uses the real `blockLeak` per guard and punch, inference .6, range shift 10 (out-boxers at .3 toward inside).
  - Balance: audit 56.4 / 16.2 / 28.7%, stoppages 33%. Base styles 47.8–52.2 (pairs). Guards 47–59 over two runs (±3). Specials 47.4–54.4.
  - IQ 90 vs 40 pooled over 800 fights: ~56%, about where it started; rounds won early → late 55 → 60%. **Memory alone doesn't make IQ win fights.** The lever is B3, where a low-IQ man can't use what he's seen.
- **B1 (original line):** Opponent memory with fading. Recording only first (same.js hash holds), then wired into combo picks.
- **B2 (next):** Intent modes and rhythm, from style DNA.
- ✅ **B3 (done before B2):** Anticipation plus the defense-keyed counter table (`antRead`, `antOn`, `ANT`, `ANT_BEST`, `pickCounter(…, def)`).
  - A read punch is defended more often (`ANT.react` .35) with the right defense: slip the straight, duck the hook, a block-leaning guard gets the gloves there. It's countered harder (`ANT.ctr` .3), and caught cleaner on the gloves (`ANT.catch` .4). Jab reads count half.
  - The first cut (react .6, ctr .6) took IQ 90 vs 40 to 67%, but put the counter-puncher at 66% and connect at 25.9%. Tuning: counter style .68 → .62, `STYLE_IN.ctr` .5 → .65, swarmer inside 1.15 → 1.3, `TUNE.react` .8 → .75, hands-low ctr 1.3 → 1.2.
  - Final: audit 57.2 / 16.1 / 28.1%, stoppages 31%. Base styles 48.7–51.4.
  - IQ 90 vs 40 ~66% pooled (62–71 across runs); IQ 80 vs 60 ~55%. The 1-2 habit man loses 64% to IQ 90 and only 36% to IQ 40; the smart man's counters climb 2.3 → 3.0/rd.
  - **For B6:**
    - Guards spread wider: high 41, cross 45, peekaboo 47, philly 58, hands-low 60. Smart opponents work the open body of high and cross; body cover +.08 made no difference.
    - Specials: feint master 42.8, jab-and-grab 46.
- **B4:** Setups, feint traps, "show it twice, change it".
- **B5:** In-round and between-round adjustments, plus "what hurt me". Started: corner as teacher (section above). Next: decide how big a lesson should be (`TEACH.max`), and let the fighter's own read carry between rounds the same way.
- **B6:** DNA numbers for every style from the research cards, then a full balance pass.
  - **Guards (Oct 6), after round awareness.** Before (300 each @82 vs standard): high 40.4, cross 42.7, peekaboo 57.1, philly 52.6, handslow 59.3 (900). The body holes weren't the lever (halving `GUARD_HOLES` body values for high/cross: 43.5 / 41.3); head movement was. `GUARDS.high.ev` .82 → .92, `cross.ev` .8 → .92 + `cross.body` .8 → .9, `handslow.ev` 1.3 → 1.27 (1.25 gave 55.1, under peekaboo).
  - After: high 48.5 (600), cross 51.3 (600), peekaboo 48.6, philly 55.3, handslow 57.4. Audit 53.5 / 15.1 / 28.2%, stops 25.2%. One run of 300 swung 52.2 → 43.2 on the same patch: pool 600+ per guard. Hash 8a08e67b.
  - **Specials (Oct 6), vs the 5 base styles, 200/pair.** Before: awkward 56.1, angle 53.8, body 52.8, switch 51.9, spoiler 51.8, volume 49.1, pboxer 45.5, jabgrab 42.9, feinter 42.2.
    - jabgrab: `aggr` .9 → 1, `STYLE_GRAB.lean` 4 → 5.5 (52.8). awkward: `odd` .8 → .6 (49.9).
    - pboxer: more aggression did nothing (44.9); he lost to counter 35 / swarmer 40. `inside` .4 (smothers in close, like real pressure). `hit` 1.4 + `cond` .8 also won but stoppages +50%.
    - feinter: the feint read made his feints worthless. `FEINT_READ.master` .7 (a feint master's feints still look real: the read only counts 30% vs him), `STYLE_BITE` t .8 → 1.2, edge 1.2 → 1.5. 42.2 → 48.8 / 45.7 over two runs (~47).
    - After: switch 55.0 (untouched, noise), awkward 53.1, pboxer 52.2, jabgrab 51.8, body 50.2, spoiler 50.1, angle 49.0, volume 48.9, feinter 45.7. Audit 54.5 / 15.4 / 28.3%, stops 30.3%. Hash holds (8a08e67b: same.js runs base styles only).
    - Still open for B6: feinter ~47, swarmer vs base styles (47.4 in the last round robin).
- Lab republished after each engine step so Ed can watch the brain work.
