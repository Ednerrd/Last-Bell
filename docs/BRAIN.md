# The Brain (Oct 6 2026): the AI boxer's fight IQ and decisions

Ed: "the fight iq, fight engine, the boxers iq, the decisions they make, play a huge part into how the game runs because the ai boxer is the brain."

Design + measurements for the AI. What to build next is in `ROADMAP.md`.

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

## The standalone brain, v1 (Oct 11 2026, `brain/`, branch `claude/boxer-brain`)
Ed: the brain comes first, then plug it into any renderer. Answers (Oct 11): tiers Novice / Intermediate / Pro / World class; all four trait groups; v1 = brain + dummy ring (no learning across fights, no corner); stats are the body, skills are what he knows. API and internals: `brain/README.md`.

Measured on the dummy ring (identical stats, spread .6):
| Measure | Result | Target |
|---|---|---|
| Audit (pro, 150) thrown / landed / connect, stops | 50.4 / 16.5 / 32.6%, 22% | ~53 / 15 / 29%, 25-30% |
| Round 1 vs rounds 3-4 output | 0.89 | ~0.85-0.9 |
| Int vs Novice / Pro vs Int / World vs Pro (100 each) | 68 / 81 / 82% (upsets 22 / 14 / 15%) | ~80-85, upsets 15-20 |
| Reaction time Novice -> World | 0.206 -> 0.164 s | |
| Defense success Novice -> World | 41.5 -> 63.7% | |
| 1-2 habit man: right hands defended, habit vs control (30) | Pro 30-40% vs 17-19%; World 48-57% vs 31-36%; Novice ~3% vs 3% | smart man reads it, novice doesn't |
| Same two men, 30 fights | 30 distinct fights, results spread | |

**Oct 11, later: final v1 numbers** (after `spread` keeps a fighter's own strengths, rope pivots, circling, `move.push`). Audit (300): 47.2 / 15.2 / 32.1%, stops 23.3%, round 1 at 0.88x. Tiers (100/pair): 70 / 83 / 79%, upsets 22 / 13 / 16% (on target). Brain lab published (private): https://claude.ai/artifact/5UhTsjMSCTqhtRnCfdZBSV.

**Open: style balance (next).** Styles (100/pair, pro): swarmer 65.8, boxer-puncher 53.8, slugger 46.5, out-boxer 39.0, counter 27.0. The dummy ring favours volume and pressure. Found: distance used to settle halfway between both men's wishes, and the out-boxer sat on the ropes 86% of the time (now ~50% with rope pivots). Tried with little effect: cutting the ring takes backpedal room (`RS.cutBack`), straights jam inside 46 (`smother`), counters soften inside 54 (`tight`), circling keeps the ring (`circBack`), a landed jab stops a man coming in (`jabStop`), `move.push` (how hard he fights for his distance). Next ideas: counter-puncher counters land harder by counter skill; swarmer pays more gas for volume; or balance on the real engine instead of the 1D dummy ring.

## The brain on the engine (Oct 12 2026, branch `claude/brain-wire`)
Ed's calls (Oct 12): toggle first (old AI stays for A/B), specials think like the nearest base style, skills come from stats + ring IQ, coach shouts later.

**Wiring** (`index.html`, engine section, `AI` knobs + `brainProfile` + `Fight.brainInit/perceive/brainTick`). `brain/brain.js` is inlined between brain markers by `node brain/inline.js` (`--check` to verify); edit `brain/brain.js`, never the copy. `AI.brain = 1` (or `opts.brain = [a, b]` per side, the lab's AI row) hands over:
- Brain: when and what to punch, feints, setups, defense (kind + quality; botched with chance 1 − quality × `AI.defQ`), counters (its own, off evades and blocks), clinches, wanted range, circling direction, cutting the ring, push (how hard he fights for his distance), hands high/low (`AI.guardK` on passive block/evasion), technique/commit/tell (`AI.tech/commit/tell`).
- Engine keeps: footwork physics (`footwork()` reads `want/circ/circDir/cutting/inMul/legs`), hit math, rope pivots (`AI.esc` per second, by lateral and ropes skill), the in-combo adjustments in `nextInCombo`, special-style tricks (angle step-off, switch, spoiler, grab, bite, eco...), and the out-boxer's reflexes (stick jab, step out: `AI.out`).
- Off in brain mode: `decide()`, `react()`, the miss/tap-block counter rolls, `beat()` resets, coach shouts (`sgOf`).
- Time: the engine's rounds are 60 sim-s (clock ×3), so the brain runs with `pace: 3` (moods, memory, intent modes and the work rate squeezed to match; reactions stay human).
- Profiles: skills from stats + ring IQ + the brain style's lean ×`AI.lean`, `AI.skill` −8 (rating 82 lands in Pro). Specials map to base styles plus a trait nudge (`AI_MAP`). Guards nudge the defense habits (`AI_GUARD`: shell/slip/legs).
- The brain's own knobs for this engine: `AI.br` (react .2/.07, ctrP .04/.4, throwP .12, feintP .1). The engine's jab lands ~.15 s after it starts, faster than the dummy ring's eye.
- Brain fixes found on the engine (kept in `brain.js`, dummy ring still on target): every punch in a combo has to reach (`reachStep/reachLo`), combos have a working range (`workS/workH/workW/workLo`), counters and setups fit the distance (`fitReach`), boxer-puncher and counter-puncher leans.

**Numbers (brain on, @82):**
| Measure | Brain | Old AI | Target |
|---|---|---|---|
| Audit 500: thrown / landed / connect | 51.7–53.7 / 14.8–15.4 / 28.5–28.7% | 52.9 / 14.8 / 27.9% | ~53 / 15 / 29% |
| Stoppages | 19.6–23.2% | 24.2% | 25–30% |
| Body KDs (bodykd 300) | 3.2% | 5.4% | 5–8% |
| Styles 300/pair (br5 + boxer-puncher fix) | counter 52.0, slugger 51.6, swarmer 49.9, outboxer 49.5, boxer-puncher 48.4 (n1109) | 48.6–53.2 | 48–53 |
| Guards vs standard (300) | high 50.2 (n600), cross 49.4, handslow 51.9, peekaboo 50.4, philly 48.7 | | ~48–58, handslow highest |
| Brain vs old AI head to head (`tests/bvo.js`) | brain wins 35% | | |

The 1D dummy ring's style spread (swarmer 66 / counter 27) was the ring, not the brain: on the 2D engine the first run already read 55 / 50 / 49 / 48 / 47.

**Open:** stoppages a touch low and body KDs low (the brain throws more straight body shots, fewer liver hooks); out-boxer still on the ropes ~13 s/round (old AI 7); brain loses 65% head to head to the old AI at equal stats (the old AI's men slide out of punches more: 7% of its punches miss short vs 13% of the brain's); coach shouts not wired. Specials vs base styles (100/pair, ±2.4): spoiler 51, feinter 50, pboxer 49, volume 47, switch 47, awkward 46, body 43, jabgrab 43, angle 39 (target 48–54): angle, body and jab-and-grab need their tricks fed to the brain. Probes: `tests/bprobe.js` (how punches end, defense, counters, distance), `tests/bvo.js`.

### Combos and counters, real-boxing pass (Oct 12, later)
Ed asked: are the combos real, is the counter logic refined? Built from `research/mind_combos.md`.
- **Combos** (`BOOK` in `brain.js`): all trainer combos that follow the grammar (hands alternate, levels and lines change; same-hand doubles on purpose). Dropped the fake `2-4` (right hand, right hook: same hand twice). Added Atlas' `1b-2-3`, `1-2-3b-3`, Inoue's `5-3b`, Crawford's `2-1`, inside rips `6-3-6` / `3b-6-3` (38 now). Picked by the situation, weighted by read: lift-then-dig vs a high guard, body work landed earlier pays upstairs, rip inside when he's on the ropes, jab-probe in rounds 1–3, end on the lead hook (not square on a rear hand) against a man who counters.
- **Counters** (`COUNTER_BOOK` + `counterFor()`): keyed on WHAT he threw x HOW I got out of it, only what reaches from here, a better counterpuncher picks the textbook answer more surely. Right hand over the jab, catch and shoot, pull counter, hook off a slipped right, shoulder roll and fire, straight inside the hook, duck and come up the middle (6-3), hook over the uppercut, uppercut when he digs to the body, counter jab (Crawford). Also: pull counter when his punch falls short (`shortCtr`), check hook and pivot off the line when he rushes in (`rushV/rushP`, engine passes `him.closing`, `angleOff` after), jab is half as counterable (`jabCtr`, it snaps back), counters respect the smother (`STYLE_IN`). Counter reasons read like commentary ("counter: right hand over the jab").
- Balance after: swarmer slip +6 / block +4 (bob and weave), counter-puncher back to counter +12 / read +8, `AI.out` 1.1.
- **Styles (300/pair, br9):** boxer-puncher 51.6, outboxer 51.3, counter 50.9, slugger 48.4, swarmer 47.9. Audit (500): 53.7 / 15.1 / 28.1%, stops 20.8%.
- Counter mix per man per round ~10: textbook answers ~75%, low-skill "fire back with anything that reaches" ~23%, check hook ~3%.
- Specials vs base (100/pair, ±2.4): spoiler 50, angle 49, jabgrab 49, pboxer 48, switch 48, feinter 48, body 43, volume 42, awkward 41 -> 48.5 (n877) after `AI.odd` .5: an awkward man's punches reach the brain's eye later (negative tell). Next: volume (light hands, needs its edge in the brain's work rate), body snatcher.

### Review and handoff (Oct 13)
A code review of the whole branch found no change with the brain off (same.js 7f58e976 holds, no NaN, no exceptions). Fixed:
- Feints now cross between the brain and the old AI both ways. Before, a mixed fight never bit on a feint.
- A passive block no longer reuses a stale defense-quality roll (`defQ` set to 1).
- `pEnd` is set for both men.
- `AI.br` is applied once, so a PATCH on `BoxerBrain.BR` still wins.
- The passive-block fix first made a brain fighter's guard hold every time on the next shot inside .16 s (styles: outboxer 55.2, swarmer 45.7). New knob `AI.reflexQ` .5: that guard holds with chance reflexQ × `AI.defQ`. Styles 300/pair after: outboxer 53.3, counter 50.4, boxer-puncher 49.9, swarmer 49.2, slugger 47.4.

After the fixes (brain on, @82):

| Measure | Result |
|---|---|
| Audit 500 | 53.7 thrown / 15.2 landed / 28.2% connect |
| Stoppages | 19.6% |
| Draws | 9% |
| Body KDs | 4.2% (10 liver of 239) |
| Brain vs old AI | 38.4% |

Known, not fixed:
- ~~Telemetry overcount~~: fixed Oct 13, see "Thrown overcount fixed" below.
- **Passive evades.** These reach the brain as slip/duck/pull by punch type, so he counters from that row of the book (on purpose).
- **Corner orders.** `F.strategy` and `F.order` don't reach the brain, so corner orders don't change his plan. Ed's call: leave it that way.

### Finishing and the hurt brain (Oct 13, later)
Built in `brain/brain.js` from `research/mind_finish.md` §4 and the "Patterns" in `research/fighters_c.md`–`g.md`. Knobs: `BR.fin`, `BR.surv`, `BR.desp`, `BR.blur`, `BR.tunnel`, `BR.hurtQ`, `BR.fuse`; modes `check` / `hunt` / `huntSafe`; `SURV` (survive's numbers by answer). Probe: `tests/finish.js`.
- **Hunt:** check-then-commit (1–2 straight shots, `fin.confirm`), skipped by a reckless man (killer x (1 − composure)) or when the bell is near; then all-out `hunt` or `huntSafe` (short, straight, behind a guard) when he still throws back, has countered me, or I'm low on gas. Flurries of 3–6 with a short look, sits down on it (commit past 1 = more damage, more gas), 11 s cap, gas outs. Body and uppercuts into a shell, hooks and cut-off on a runner. He remembers the wobble after the engine's tell goes (`fin.wob`), chases a man off the floor (`fin.kdChase`, `kdWob`), sometimes sees a hurt that isn't there (`falseAlarm`). Tunnel vision: hunters see counters late.
- **Survive:** first answer (shell, run, fire, clinch, freeze, plus `steady` for composed men and `bait` for patient counterpunchers), each with its own numbers (`SURV`: fire really fires now), then a second pick at 1–2 s. Freeze capped, shell flips after 3 unanswered, ride it to the bell late, fire x1.8 when desperate, clinch inside harder. Off the floor he always survives first; composure decides fire back vs cover up, then next round rally (composed) or box long. A hurt man's defense works 25% worse.
- **Late desperation:** behind on his own cards in the last 3 rounds: output, commit, the right hand, hunts sooner.
- **Clarity (blur):** real damage (head under half), the fight's wear and knockdowns slow the eye, add misreads, worsen defense. This is the main stoppage lever: the brain's defenders rarely picked the wrong defense, so fewer flush shots than the old AI (56 vs 65%), fewer stuns (2.4 vs 3.5/fight), fewer KDs.
- **Slow fuse:** a man under half gas gets dug to the body, the 3b on top.
- Found on the way: the hunt was already on 73% of the time the other man was hurt; hurt is just rare (0.65% of frames). A man getting up was "hurt" by the engine only 35% of the time and went straight back to work. Any drop in defense favours the out-boxer (he lives out of range); a hunt output bump (aggr 4.5) punched swarmers out (styles 44).
- **Balance (own commit):** `AI.out` 1.1 → .8, swarmer slip +12 / block +10 / composure .78.

| Measure (brain on, @82) | Before | After |
|---|---|---|
| Audit 500: thrown / landed / connect | 53.7 / 15.2 / 28.2% | 53.7 / 16.5 / 30.6% |
| Stoppages (audit 500 + finish 600) | 19.6% | 24.6% + 23.7% (pooled ~24%) |
| Same-round stop after a first KD | ~19% | ~23–27% (est. real 35–45) |
| KDs both ways | ~6% | ~6.5–8% |
| Body KDs (liver share) | 4.2% | 4.1% (30 of 723 over 900 fights, fuse on) |
| Styles 300/pair | 47.4–53.3 | outboxer 54.1, counter 53.0, swarmer 48.4, slugger 48.1, boxer-puncher 46.8 |
| Brain vs old AI (bvo) | 38.4% | 27.4% (pooled 540; the old AI doesn't blur) |
| Hunts per man per fight | ~2 (no check) | 2.3 (check 66%, safe 44%, reckless 15%), stung 12%, hurt 0.7% |
| Dummy ring audit 300 | stops 23.3%, connect 32.1% | stops 28.3%, connect 34.1% |

Open: stops a hair under 25 (a weaker blur gets connect back to 29% but stops fall to ~22.6%: it's a straight trade); boxer-puncher 46.8 / outboxer 54.1 just out of band; finisher caught (hurt) only 0.7% of hunts (5–10% wanted; a fresh hunter almost never gets stunned in this engine, "stung" = ate a clean counter is 12%); same-round stop after a KD below the research guess; body KDs didn't move (the slow fuse digs more but the liver needs worn bodies); bvo down (blur and the long post-KD survive cost the brain against the old AI).

### Handoff (Oct 13, after finishing)
State: `claude/brain-wire` @ finishing + balance + slow fuse, brain off unchanged (same.js 7f58e976), private brain test page republished (v3). Not merged into the main line.

Lessons for the next session:
- **Noise is the enemy.** Styles at 150/pair swing ±3–4 per style between identical runs; trust only 300/pair (`/tmp` helpers aren't in the repo: copy the 4-process split from the task prompt). Stoppages need 1000+ fights pooled (audit and `finish.js` disagreed by up to 6 points on the same build).
- **Any drop in defense favours the out-boxer** (he lives out of range). Blur, hurt-man defense, tunnel vision: each costs swarmer/slugger first. Pair any defense nerf with a balance check.
- **Hunt output is capped by the engine**: decision timer + punch length, ~0.6 throws per clock-second at most. Raising `MODES.hunt.aggr` past 3 only burned swarmers' gas.
- **Hurt is rare** (0.65% of frames). Stoppages come from KDs, and KDs from flush shots (wrong-defense `mult > 1`, counters, crits). The brain picks the right defense more than the old AI, so it needs the blur to get KDs.
- **Finisher caught** can't reach 5–10% "hurt" in this engine (a fresh man is almost never stunned); "stung" (ate a clean counter while hunting) is the honest measure, 12%.
- Probes worth reusing: `tests/finish.js`; per-mode time/throws/lands come from `tel.mThr`/`tel.mLand`/`tel.modeT`.

### Thrown overcount fixed (Oct 13, after the handoff)
- **Engine** (`brainTick`): when the brain's own defense pulls back a punch before 30%, it's un-counted from `F.tot.thrown`, `rs.thrown`, `rs.thrownPow` (stamina still spent; feints and finished punches untouched). `F.tot.un` counts them; `tests/audit.js` prints "unthrown /rd" when it's non-zero. Brain-gated: same.js stays 7f58e976.
- **Brain** (`opts.thrownEv`, set by the engine): `tel.throws` / `tel.mThr` count from engine events, `thrown` when `startPunch` really starts a brain punch (`first` = the combo's lead) and `pulled` when he pulls it back. Smothered counters, pivot/step-out returns and busy frames no longer count. The dummy ring sends no events, so it still counts decisions. Behaviour-neutral: brain-on same.js hash is identical with the events on or off (b67920f2).
- Still not in `mThr`: punches the engine starts on its own (stick jabs, the smothered inside hook, follow-ups `nextInCombo` adds when he's hurt), ~4% of a brain man's output.

| Measure (brain on, @82) | Before | After |
|---|---|---|
| Unthrown (pulled back) per man per round | counted as thrown | 1.68 |
| Audit 1000 (4x250): thrown / landed / connect | 53.1 / 16.2 / 30.6% | 51.4 / 16.3 / 31.6% |
| Stoppages (same 1000) | 23.0% (16.8–25.6 per 250) | 24.8% (19.6–29.6 per 250) |
| Draws | 5.2% | 4.4% |
| Styles 300/pair (4 processes) | outboxer 54.6, counter 53.7, boxer-puncher 48.1, swarmer 47.4, slugger 46.5 | counter 53.4, outboxer 51.5, boxer-puncher 48.9, swarmer 48.9, slugger 47.6 |

Only the judges read `rs.thrown` (`rdScore`, .025 a punch, ~.04/round); the brain never sees the cards, so the stoppage swing is noise (a single 250 run ranged 16.8–29.6). Thrown now sits ~1.6 under the 53 target with connect ~31.6%: the brain's real output, not a bug. The styles moved toward the middle (outboxer −3, slugger and swarmer +1), within ~1.5σ.


### Handoff (Oct 14, after the overcount fix)
State: `claude/brain-wire` @ overcount fix, brain off unchanged (same.js 7f58e976), nothing published, not merged into the main line. CLAUDE.md "Targets" now has the brain-on numbers and what "thrown" means.

Next session: the balance pass (ROADMAP item 0, "Next").
- **Where it stands** (brain on, @82): audit 1000 = 51.4 thrown / 16.3 landed / 31.6% connect, stops 24.8%, draws 4.4%. Styles 300/pair: counter 53.4, outboxer 51.5, boxer-puncher 48.9, swarmer 48.9, slugger 47.6.
- **Goals:** connect back toward 29–30% without stops dropping under ~24; slugger into 48–53 without pushing counter over 53.5; decide whether thrown 51.4 needs a bump to ~53 (output knob) or the target moves for the brain (Ed's call if it's the target).
- **Levers:** `BR.blur` (connect vs stops trade), `AI.defQ` / `AI.reflexQ` (defense quality: any nerf favours the out-boxer), `AI.out`, per-style profile numbers in `brain/brain.js` (rerun `node brain/inline.js`).
- **Measure like last time:** audit 4x250 in parallel (pool 1000), styles 300 82 over 4 processes (TAG, then agg), same.js 200 must stay 7f58e976. Balance numbers and visuals never in one commit.

### Balance pass (Oct 14)
Knobs (commit 599098d): `AI.defQ` 1.3 → 1.5 (fewer botched defenses: connect down), `BR.hurtQ` .25 → .6 (a hurt man defends worse: buys the stops back where they come from), swarmer `sk` cutoff 10 → 14, slip 12 → 14 (defQ cost him ~1.5).
Measured with audit 4x250 (pool 1000) and styles 75 x4 processes (300/pair), brain on, @82. Each row is one run unless noted.

| Run | Thrown / landed / connect | Stops | Styles 300/pair |
|---|---|---|---|
| Base (doc, Oct 13) | 51.4 / 16.3 / 31.6% | 24.8% | counter 53.4, outboxer 51.5, bp 48.9, swarmer 48.9, slugger 47.6 |
| Base (re-run) | 52.2 / 16.8 / 32.1% | 26.3% | outboxer ~52.7, counter 51.1, bp 50.2, swarmer 49.1, slugger 46.8 |
| defQ 1.5 | 51.5 / 15.6 / 30.4% | 23.4% | outboxer 53.5, slugger 51.4, swarmer 49.5, counter 47.9, bp 47.6 |
| defQ 1.5 + blur.q .55 | 51.2 / 15.6 / 30.6% | 23.5% | outboxer 53.8, counter 52.1, slugger 48.3, swarmer 48.2, bp 48.0 |
| defQ 1.5 + blur.cur .9, kd .4 | 51.3 / 15.8 / 30.8% | 23.7% | slugger 51.9, outboxer 51.4, counter 50.6, bp 49.0, swarmer 47.2 |
| defQ 1.5 + hurtQ .5 | 51.4 / 15.7 / 30.5% | 24.8% | slugger 52.0, bp 50.9, outboxer 50.5, counter 48.8, swarmer 47.7 |
| + swarmer cutoff/slip 14 | 51.4 / 15.6 / 30.3% | 21.9% | slugger 51.7, outboxer 50.7, bp 50.7, counter 49.3, swarmer 47.5 |
| **Kept: + hurtQ .6 (2 runs pooled: 2000 audit, 600/pair)** | **51.6 / 15.7 / 30.4%** | **25.8%** (25.2, 26.3) | **outboxer 52.5, swarmer 50.3, counter 50.0, slugger 49.1, bp 48.2** |

Lessons:
- **Stops noise is huge**: ±2 points between 1000-fight runs at near-identical settings (21.9 vs 24.8 vs 25.2). Pool 2000 before trusting a stops move.
- `BR.blur` (q, cur, kd) barely moves stops once defQ is up: the blur is small most of the fight. `hurtQ` is the cleaner stops lever (it only bites on a hurt man, so connect stays put).
- A defense buff (defQ) didn't hurt the out-boxer here (he stayed ~51–53); it cost the swarmer ~1.5 instead.
- Styles at 300/pair still swing ±2 per style run to run (counter 47.9 → 52.1 between two defQ 1.5 runs).

Open:
- **Thrown 51.6 vs the 53 target: Ed's call.** The brain pulls back ~1.7 punches a round (un-counted, gas spent), and no balance knob here moved thrown. Either the brain's target becomes ~51–52, or an output bump (`BR.throwP`) gets tried; an output bump will push connect and stops around again.
- Connect 30.4%: inside 29–30 would want defQ ~1.6 (expect stops −1, swarmer −1).
- Not re-checked this pass: dummy ring audit, guards vs standard, specials, bvo, finish.js.

### Re-check on the balance-pass numbers (Oct 14, later)
Brain on, @82, code at 599098d (nothing changed for these).
- **Guards vs standard** (`bal2.js` 4x75 = 300/guard, ±3): high 57.9, handslow 55.1, cross 53.3, philly 53.1, peekaboo 49.2. All in 48–58; handslow isn't on top this run (high 57.9 vs 55.1 sits inside the ±3).
- **Specials vs base styles** (`styles.js` 75 x4, stopped at the 30-min background cap: ~260–290/pair, feinter ~190/pair): spoiler 53.1, awkward 51.4, jabgrab 50.9, feinter 50.4, pboxer 48.7, switch 47.8, angle 46.4, volume 46.3, body 44.3 (±1.3–1.6). The base styles in the same run: slugger 52.3, outboxer 52.2, swarmer 51.9, counter 51.5, bp 48.5. Weak: body, volume, angle. Volume throws the most (69/rd) but 77% power at light hands; body 79% power.
- **Brain vs old AI** (`bvo.js` 3x100 pooled): 35.4% (93-170, 37 draws), back up from ~27. The brain's out-boxer is the hole (7–19% by run); slugger ~56, counter ~41.
- **Dummy ring audit 300** (pro): 47.9 thrown / 16.4 landed / 34.3% connect, stops 28.0%, KDs 0.8/fight. Same as Oct 13 (28.3 / 34.1).
- Lesson: the full 9-special run at 75 x4 takes >30 min: run it in halves, or with a long background timeout.

### Weak specials: volume and body (Oct 14, later; commit c1f1c73)
`AI_MAP` takes a third slot, a skill lean (on top of the base brain style's `sk`, x `AI.lean`). Brain on, @82, `styles.js 75 x4 vs:volume,body` (300/pair, ±1.3 for the special, ±2.1 for each base row). Control = same-day run at 44a59fd.

| Try | Volume | Body | What |
|---|---|---|---|
| Control (2 runs: sp1 + c0) | 46.1 | 44.0 | volume `{output .1, power -.2, combo .1}`, body `{body .25, output -.1}` |
| 1: lighter, busier volume; body digs more | 42.2 | 41.0 | volume power -.35, jab +.15; body output 0, killer +.1 |
| 2: control traits + skill lean only | 43.2 | 45.4 | volume combos/pacing +8; body skill +10, power +4 |
| 3: volume output past 1 (1.25 cap), body cuts off | 40.5 | 39.0 | more pressure = walks onto counters (outboxer/counter 61–69 vs them) |
| 4: patience | 47.2 | 49.3 | volume `{combo .1, patience .1}` + pacing 8; body `{body .25, output -.2, patience .15}` + body 10 |
| 5: volume more patient (output -.1, patience .2) | 47.0 | 48.8 | |
| **Kept, 6: volume works from mid range (2 runs pooled, 600/pair)** | **52.8** (53.5, 52.0) | **50.3** (51.2, 49.4) | volume `{combo .1, patience .15, range .25, legs .15}` + pacing 8; body as 4 |

- Base styles round robin after it (unchanged code for them, 300/pair): bp 51.3, outboxer 50.5, swarmer 50.3, slugger 49.1, counter 48.7.
- Base rows vs the two specials (600/pair): counter 51.7, outboxer 51.3, slugger 47.3, bp 47.0, swarmer 45.3 (the swarmer is the one they beat).
- Brain-off same.js 7f58e976 (brainProfile only runs with the brain on).
- Lessons: both were losing by walking chest to chest into counters. Pressure and output knobs made it worse every time; patience fixed the body snatcher; volume needed range (his engine range is 62, the swarmer brain parked him at 54, where his light hands lose the trades). Volume still throws the most (68/rd) from 58.
- Next for specials: angle 46.4 (the other one under 48).

### Angle fighter (Oct 14, later; commit 98d4aaf)
Brain on, @82, `styles.js 75 x4 vs:angle` (300/pair per run). Control = same-day run at 9be2940.

| Try | Angle | Rope s/rd | What |
|---|---|---|---|
| Control | 44.6 | 6.6 | `['outboxer', { circle .12, range -.1 }]` |
| 1: ring craft on the out-boxer | 46.2 | 6.1 | + circle .2, skill lean ropes 12, angles 8 |
| **Kept, 2: boxer-puncher base (3 runs pooled, 900/pair)** | **51.5** (52.9, 52.5, 49.2) | 2.8 | `['boxerpuncher', { circle .3, legs .2, combo .1 }, { angles 8, ropes 8 }]` |

- Kept, pooled rows (angle's win % vs each): slugger ~54, bp ~54, swarmer ~53, counter ~51, outboxer ~45 (the out-boxer is the one that beats him).
- How he fights now: 55 thrown/rd, 68% power (was 57%), distance 61 (was 64), ropes 2.8 s/rd (was 6.6). Stops by him up from ~3% to ~6% of his fights.
- Brain-off same.js 7f58e976.
- Lesson: the out-boxer brain at the angle man's short engine range (64 vs the out-boxer's 72) gets walked to the ropes and stays there (the out-boxer brain's rope problem, same hole as in bvo). His engine combos already come from the boxer-puncher; the brain now matches, and the engine's angle-offs do the rest.

### Body KDs re-measured (Oct 14, later; no code change)
Brain on, @82, `finish.js` 4x150 three times (1800 fights, code at eea1102): body share of KDs **5.7% ±0.6** (90 of 1579; runs 5.9, 5.6, 5.6). Inside the 5–8% target, so nothing tuned. Stops 24.1%, KDs 0.88/fight in the same pool.
- The Oct 13 4.1% (30 of 723) was before the balance pass (`hurtQ` .6, `defQ` 1.5) and the body snatcher fix; small samples swing ±1.5 (30 body KDs).
- `bodykd.js` 3x200 (rating 75, base styles): brain 26 liver KDs of 493 (5.3%), body landed ~67/fight; old AI 8 of 182 (4.4%), ~59/fight.
- Every liver event became a KD in these runs; wind (straight to the gut) stuns ~0.3/fight and drops nobody (by design: gas hit, no KD).

### Out-boxer off the ropes (Oct 14, later; commit 591fa2b)
Real out-boxers stay off the ropes, and when they get there they pivot out first and punch second (Usyk circles right and takes the center; Mayweather locks and pivots off Maidana; `research/mind_engage.md`, `fighters_a.md`). Fighting on the ropes is for a hurt man (shell, clinch) or a rope fighter by choice (shoulder roll, counter), not a place a mover lives. Probe: `tests/ropes.js N [style]` (trapped s/rd, spells, how they end, hurt/cut-off share, his mode).

What the probe found (brain on, @82, out-boxer vs the other base styles, 160 fights): he reached the ropes as often as the old AI (~16 spells/rd) but stayed twice as long (12.6 vs 7.7 s/rd; p90 spell 2.4 vs 1.3 s), hurt only 0–1% of that time. His lateral on the ropes was .64 (old AI 1.05) and he pivoted out of 21% of spells (old AI 30%).

| Try (probe, out-boxer trapped s/rd) | s/rd |
|---|---|
| Control | 12.6 |
| Movers slide harder (`BR.ropes.legs` [.7, 1.6]) | 10.4 |
| Ropes skill counts more (`BR.ropes` lo .5, hi 1.3) | 11.1 |
| Keep the pivot's direction (`AI.escSync` 1, `BR.ropes.flip` 0) | 12.6 |
| All three | 10.2 |
| **All three + pivot rate `AI.esc` 1.1 → 2.2 (kept)** | **7.1** (6.7 from the committed code) |
| ... `AI.esc` 3.3 | 5.9 |

Getting off the ropes made him strong: out-boxer 58.1 in the round robin. Offsets, out-boxer vs the other four (300/pair): `AI.out` .8 → .5: 54.5; sk range 10 → 4 and footwork 10 → 6: 55.0; both: 53.8 (kept); + jab 6: 53.6; + angles 2: 60.7 (less circling made him stronger, not weaker). A stronger cut-off (`AI.escCut` .6 → .8, 600/pair) left him at 53.7 and dropped the boxer-puncher to 46.8: not kept (knob stays at .6).

Kept, brain on, @82:
| Measure | Before | After |
|---|---|---|
| Out-boxer on the ropes (probe) | 12.6 s/rd, pivots 21% of spells | 6.7 s/rd, pivots 36% |
| Counter-puncher on the ropes (probe, with the pivot rate) | 4.9 s/rd | 3.1 s/rd |
| Styles 600/pair (2 runs pooled) | outboxer 52.5, swarmer 50.3, counter 50.0, slugger 49.1, bp 48.2 | outboxer 53.7, counter 51.4, slugger 48.9, bp 48.7, swarmer 47.6 |
| Audit 4x250 | 51.6 / 15.7 / 30.4%, stops 25.8% | 51.3 / 15.6 / 30.4%, stops 27.2% |
| Brain vs old AI (bvo 3x100) | 35.4% (out-boxer 7–19) | 30.3% (out-boxer 19–40); ±2.7, noisy |
| Dummy ring audit 300 | 47.9 / 16.4 / 34.3%, stops 28.0 | 47.2 / 16.1 / 34.2%, stops 24.7 |

- Brain-off same.js 7f58e976 (`AI.esc`, `AI.out`, `AI.escSync`, `AI.escCut` are read only in `brainTick`).
- Out-boxer 53.7 and swarmer 47.6 sit just outside the 48–53 band (±1.1). The out-boxer beats the boxer-puncher ~57–43, the main gap.
- Jab-and-grab maps to the out-boxer brain, so it moved too: check it in the specials run.

### All specials vs base styles (Oct 14, later; code at a310a61)
Brain on, @82, `styles.js 75 x4` in two halves (`vs:volume,angle,awkward,switch,body` then `vs:pboxer,spoiler,jabgrab,feinter`), 300/pair, ±1.3–1.4 per special.
- Specials vs the five base styles: spoiler 52.1, volume 52.1, awkward 51.8, angle 50.5, jabgrab 49.9, feinter 49.6, body 48.8, pboxer 47.7, switch 47.4. All nine in 47.4–52.1 (target 48–54; pboxer and switch a hair under, inside the noise). Was 44.3–53.1 with body, volume, angle under 48 (Oct 14 re-check).
- Jab-and-grab (out-boxer brain) 50.9 → 49.9 after the rope fix: fine.
- Base styles vs the specials in the same run: outboxer 54.6, boxer-puncher 50.1, counter 49.3, swarmer 48.6, slugger 47.8. The out-boxer beats body (61), switch (59), angle (57), spoiler (56), pboxer (55).

### Skill levels L0: the baseline (Oct 14, later; `tests/levels.js`)

Brain on, random styles (specials too), rolled guards, 10 rounds, 300 fights per pair. A level today is just a rating: the brain's skills come from the stats, so with `AI.skill` -8 the level centers sit at ratings ~40 / 60 / 78 / 93 (Novice / Intermediate / Pro / World class).

**Across a level gap** (underdog wins; target one level down 15–20%):

| Pair | Dog wins | Stoppages |
|---|---|---|
| I v N | 1.7% | 75% |
| P v I | 1.0% | 53% |
| W v P | 3.0% | 21% |
| P v N, W v I (two down) | 0% | 87–99% |
| Mirrors N / I / P / W | ~50% (draws 4–9%) | 31 / 25 / 15 / 7% |

Pro rating curve (a 78 vs men under him): -4 wins 27.3%, -8 11.7%, -12 5.7%, -17 1.3%. **The 15–20% band is a 5–7 point gap. A level is 18 points**, so the gap is about 3x too steep.

**Skills vs body** (`split`: one level down, P 78 vs I 60):

| What the underdog is short of | Dog wins | Stoppages |
|---|---|---|
| Both (today's level) | 1.0% | 56% |
| Body only (stats of a 60, skills of a Pro) | 2.7% | 49% |
| Skills only (stats of a 78, skills of an Intermediate) | **31.7%** | 17% |

The body decides it. An 18-point stat gap alone is almost as decisive as the full level. A skill level alone is a real edge (68/32), but a little short of the 15–20% target. For the stats vs skills split (ROADMAP Ed item 3), this says: if levels come from skills, keep the bodies inside a division close (a few rating points), and a skill level needs to be worth a bit more (`BR.spread` .6 is the obvious knob).

**Skill use by level** (per man, mirror fights; N → I → P → W):
- Telegraphed first punches (tech < .5): 93 → 54 → 16 → 2.5%. Feints nobody buys (sell < .35): 39 → 11 → 2 → .5%.
- Reaction 151 → 133 → 117 → 107 ms. Misreads 11 → 10 → 8 → 6.5%. Feints read 14 → 18 → 20 → 20%.
- Counters landed .5 → 1.4 → 2.4 → 2.8 /rd. Punches evaded 7 → 12 → 18 → 20%, blocked 13 → 19 → 25 → 27%.
- Thrown 44 → 50 → 55 → 58 /rd, connect 24 → 28 → 28 → 26% (mirror; both men get better).
- Flat where `research/mind_learn.md` 4a says steep:
  - Feints: 3.3 → 4.5 → 5.1 → 5.5 /rd. Research: ~.6 → 1.5 → 4.5 → 6–9 per 3-min round.
  - Adjusts between rounds: 2.2 → 3.2 → 4.0 → 4.4 per fight. Research: 5 / 25 / 55 / 80% chance when losing.
  - Froze when hurt: 6 → 5 → 5 → 2%. Research: Novice 40%.
- Stoppages fall with level (31 → 7% in mirrors). Real life doesn't: world-class rates are high. Check in L6. The mirror pool (specials in, rating 78) also stops less than the audit (82, base styles): 15 vs ~26%.

### Skill levels L1: the skill sheet (Oct 14, later; data only)

Ed's call: stats are the body, skills are what he knows how to do with it; the level comes from skills. Built (index.html, after `brainProfile`):
- **`sheet.sk`**: mastery per brain skill (the 17 `BoxerBrain.SKILL_KEYS`), 0..100 on the brain's own scale (tiers: Novice under 46, Intermediate 46+, Pro 66+, World class 84+; centers 34 / 56 / 74 / 90). `research/mind_learn.md` 4 uses 0–30 / 30–55 / 55–80 / 80–100 bands; read its tier columns as these tiers.
- **`sheet.know`**: familiarity 0..1 per opponent style (every `STYLES` key) and stance (orthodox, southpaw). Specials x.6 and southpaws x.55 (scarcity). Nothing reads it yet (L3).
- **`levelOf(sheet)`**: `BoxerBrain.tierOf(sheet.sk)`, or, with no sheet, the skills the brain reads off the body.
- **The brain reads `sheet.sk`** when it's there (`brainProfile`); without it, `brainSkills(stats, iq, style)` does what it always did. `same.js` 7f58e976 (brain off) and **ac686464 with `PATCH="AI.brain=1"`** both held across L1.
- **Defaults** (`SKL`, `skillSheet(sheet, type)`, `skFromRecord(sheet, {w,l,d}, rating)`; `node tests/sheet.js` prints them):

| Walk-in / record | avg skill | Level | know (base / specials / southpaw) |
|---|---|---|---|
| beginner | 35 | N 100% | .12 / .07 / .07 |
| journeyman (Pro at clinch, ropes, pacing) | 59 | I 100% | .60 / .36 / .33 |
| veteran (IQ up, legs down) | 77 | P 100% | .80 / .48 / .44 |
| ranked (adjusts less: set habits) | 83 | P 76% / W 24% | .65 / .39 / .36 |
| 0-0 @70 | 27 | N | .12 |
| 4-0 @74 | 51 | I | .34 |
| 10-0 @78 | 66 | I 57% / P 43% | .56 |
| 20-25-2 @72 | 59 | I | .88 |
| 25-0 @82 | 79 | P | .80 |
| 45-2 @90 | 86 | W 90% | .88 |

  Record center = 30 + 34·(1−e^(−fights/15)) + (win% − .5)·36 + (rating − 78)·.5, clamped 20–92. Style leans as in `makeProfile`, noise ±6 per skill.

**`levels.js sk`** (the lever for L2/L6): same body (rating 78 both, random styles + guards), levels set by `sheet.sk` only. 300 fights per pair, brain on:

| Pair | Dog wins | Draws | Stoppages |
|---|---|---|---|
| I v N | 30.7% | 7.3% | 11.3% |
| P v I | 32.0% | 6.3% | 19.0% |
| W v P | 31.7% | 9.7% | 16.0% |
| P v N (two down) | 17.7% | 3.0% | 21.3% |
| P mirror | 45.0 / 46.3 | 8.7% | 13.7% |

Matches the L0 split (skills-only 31.7%). A skill level is worth ~68/32 today, the same at every rung; **two** levels is the 15–20% target. So L2 needs a level to hit about twice as hard (mastery effects: telegraph read, off balance, arm-punch damage, combo length, flinch; then `BR.spread` .6 in L6). Skill use by level from sheets looks like L0's (telegraphed 90 → 43 → 10 → 2%, unsold feints 41 → 13 → 4 → 1%, reaction 147 → 126/136 → 120 → 106 ms); feints /rd (3.5 → 5.4), adjusts and freezing when hurt (9.5 → 2.6%) still too flat, as in L0.

### Skill levels L2: the engine reads mastery (Oct 14, later)

What a level now does, all in `BR.lv` (brain/brain.js; tables are [Novice, Intermediate, Pro, World class] at the tier centers, `BR.lv.on` switches each one, `BR.lv.own` .3 = how much one skill's own gap from his level counts):

| Effect | N / I / P / W | Where |
|---|---|---|
| Punch force x | .7 / .85 / 1 / 1.06 | engine damage (`mast.force`) |
| Gas per punch x | 1.22 / 1.12 / 1 / .92 | engine punch cost |
| Off balance after a miss (s): no defense, no punch, takes +20% (`AI.offDmg`) | .28 / .15 / 0 / 0 | engine `miss()`, `offT` |
| Hands back late: extra damage caught on the way back | .28 / .15 / 0 / 0 | engine resolve |
| Flinch on a hard shot: no defense for .35 s (`AI.flinchT`) | .17 / .07 / 0 / 0 | engine resolve, `flinchT` |
| Extra wind-up (tell) | .65 / .33 / 0 / -.1 | brain `fire()` |
| Feints x | .15 / .4 / 1 / 1.4 | brain `offense()` |
| Longest combo he owns | 2 / 3 / any / any | brain `pickCombo()` |
| Adjust between rounds when losing | 5 / 25 / 55 / 80% | brain `rest()` |
| Extra weight on freezing when hurt | .75 / .25 / 0 / 0 | brain `survStart()` |
| Level as the brain plays it (`kLvl`, [mastery, k]) | .34→.43, .56→.55, .74→.644, .82→.692, .90→.86 | brain constructor (replaces the straight `spread` line) |

Rule learned the hard way: **every table is neutral at Pro.** The first cut had penalties at Pro (off balance .15 s, late hands, flinch, tell .17, a combo cap) and a straight World-class pull on the level: that changed the whole rating-82 field and swung the styles (swarmer 56–60, counter-puncher 42–44 vs 53.8 with L2 off). Ablations at 150/pair were too noisy to name one piece; making every table neutral at Pro put the styles back.

Commentary hooks (UI): `offBalance` ("misses and stumbles") and a feint sold under .3 ("nobody's buying it").

**Results** (brain default; `same.js` now **45127603**, old AI still 7f58e976):

| | Before L2 | After |
|---|---|---|
| `levels.js sk` I v N / P v I / W v P (300/pair) | 30.7 / 32.0 / 31.7% | **20.0 / 15.0 / 17.0%** |
| P v N (two down) | 17.7% | 2.3% |
| Feints /rd N → W | 3.5 → 5.4 | 0.8 → 7.1 |
| Froze when hurt N → W | 9.5 → 2.6% | 36.7 → 0.7% |
| Adjusts /fight N → W | 2.6 → 3.5 | 0.5 → 3.0 (P up to 4.7) |
| Styles 300/pair @82 | 45.1–53.8 (L2 off, same code) | 47.2–53.9 (swarmer 53.9, outboxer 50.8, slugger 49.4, bp 48.5, counter 47.2) |
| Audit 600 | 51.7 / 15.5 / 30.0%, stops 21.0%, fav @ gap 10 88.5% | 51.4 / 15.5 / 30.3%, stops 25.5%, fav @ gap 10 89.9% |

Left for L6: counter-puncher 47.2 and swarmer 53.9 at the band edges. Fighters without a skill sheet get their skills from their body, so a rating gap counts body and skills both (audit favourite at a 10-point gap 88.5 → 89.9%, inside noise); that goes away once fighters carry `sheet.sk` with close bodies.

### Handoff (Oct 14, after L2)

**State:** branch `claude/brain-wire`, last commit 01402c0. Brain is the default AI. `same.js 200` = **45127603** (brain + L2); old AI `PATCH="AI.brain=0"` = 7f58e976. Skill levels L0–L2 done; one level down wins 15–20% on `levels.js sk`. Audit 51.4 / 15.5 / 30.3%, stops 25.5%; styles 47.2–53.9 (300/pair).

**Ed's calls (Oct 14, ROADMAP "Decided"):** v1 is the game, v2 parked. Focus = AI, brain, fight sim; career/camp after. Live game untouched. Brain default. Thrown target ~52. Walk-in skill defaults OK. Ed still has to delete 9 old branches on GitHub (list at the top of ROADMAP; sessions get 403).

**Next: L3, style and stance familiarity in the fight** (`sheet.know`, built in L1 but read by nothing yet). Spec: `research/mind_learn.md` 4b "Style/stance familiarity": `know < .3` = reads at half speed for the first 3–4 rounds, the predicted-punch bonus halved, caught more by the main weapon (the southpaw's left). Scarcity is the edge (pros of both stances win less vs southpaws).
- Plan first, small chunks, a commit per working step, sims before and after.
- Same pattern as L2: knobs with an `on` switch at 0 first (hashes hold), then the engine/brain reads them, then switch on and tune.
- Where it plugs in (brain/brain.js, edit the source, `node brain/inline.js`): read speed = `see()` reaction and `predict()`/`antPrior` (memory download), plus `BR.antic`. The engine knows both men's style (`F.sk`, specials) and stance (`F.stance`); pass the opponent's style/stance familiarity into the brain at `brainInit` (sheet.know of THIS man about the OTHER man's style and stance), e.g. a multiplier that fades with rounds.
- A man with no `sheet.know` must fight as today (neutral), same rule as `sheet.sk`.
- Measure: add a `levels.js` mode (same level, same body; one man `know` low vs the other's style/stance, the other familiar). Targets to set with Ed; research hint: unfamiliar = clearly worse early, fades by mid-fight. Also report southpaw vs orthodox win % with default know.

**Lessons from L2 (don't relearn them):**
- Every effect neutral at Pro, or the whole rating-82 field changes and the styles swing (counter-puncher fell 54 → 44 from small Pro-level penalties).
- Styles at 150/pair are noise (±4 real, the printed ± undersells it). Use 300/pair (4 procs × 75) and an L2-off style control on the same code before blaming a change.
- `styles.js` gives both men the same body; style leans alone set the skill average there.
- Placing a line between an `if` and its `else` silently re-binds the else (it moved the old AI's hash). Bisect with `LB=` copies when a hash moves unexpectedly.
- Monitor for sims: `until grep -q DONE <out>` loops; foreground sleep is blocked.

### Skill levels L3: style and stance familiarity (Oct 14, later)

Built (brain/brain.js `BR.fam`, `famSet`/`famUpd`; engine `famOf`): at the bell each brain gets **how well he knows THIS man's style and stance** (`sheet.know.style[his style]`, `sheet.know.stance[his stance]`), again when a switch-hitter flips. No `know` = neutral (so the default field, audit, styles: same.js **45127603** with it on). Unfamiliar = `(at − know) / at`, at .45 (know .1 → .78, .3 → .33, .45+ → 0). Fades: full size round 1, gone by round 4.5 (a slow reader) to 3 (a fast one).

| Knob | Value | What |
|---|---|---|
| react | .35 | sees everything later, x(1 + .35·u) |
| weapon | .6 | stance only: the opposite stance's main weapons seen later on top (cross 1, bodyCross .7, lead hook .5) |
| pred | .5 | predicted-punch bonus cut |
| mem | .5 | reads his habits slower (memory notice); this part lingers after the fade |
| mis | .5 | misreads up |

**`levels.js know`** (two Pros, sk 74, rating 78, random styles/guards, no switch-hitters; A unfamiliar at know .1, B .8; 300/pair). A's share of decided fights (wins / (wins + losses)), and A's share of landed punches by rounds:

| Pair | Off: A share | On: A wins / loses | On: A share | Landed R1-2 / 3-4 / 5-7 / 8-10 |
|---|---|---|---|---|
| ctrl (both .8, orth v south) | 49.8% | 50.7 / 43.7 | 53.7% | 50.3 / 50.0 / 50.3 / 49.4 |
| style (A knows no styles) | 51.3% | 41.0 / 51.7 | **44.2%** | 47.2 / 48.2 / 49.0 / 48.2 |
| stance (A never saw a southpaw) | 52.1% | 39.7 / 52.0 | **43.3%** | 45.1 / 48.2 / 49.1 / 48.6 |
| both | 49.3% | 42.0 / 54.3 | **43.6%** | 44.9 / 47.1 / 47.6 / 47.0 |
| south (orth v south, default know .6) | 50.2% | 43.0 / 51.7 | **45.4%** | 48.2 / 49.4 / 49.5 / 49.6 |

Off = 50 ± 3 everywhere (noise at 300/pair). On: a Pro who has never seen the style or the stance wins ~44% of decided fights, the hole is clearest in rounds 1–2 and mostly closes by mid-fight (the slow habit read lingers a little). The southpaw's scarcity edge at default know: ~4–5 points. "Both" barely stacks (the read takes the larger of the two; only the weapon is stance-only).

#### L3 tuned softer (Oct 14, Ed: "soften it", from `research/mind_southpaw.md`)
The research: the real southpaw edge is small (2–4 points at normal familiarity; facing a southpaw costs top-20 pros ~4 points, 2014; lefty pros win ~52%, 2019), and nobody measured "never faced one". The first L3 (44% / 43%) was steeper than anything published. Changes:
- `atS` .9: a separate bar for the stance. Southpaws are rare, so most men's southpaw know (default .6 → .33) sits under it (u .63); a never-seen .1 → .89. Style keeps `at` .45.
- `keep` .2: a floor under the in-fight fade (a southpaw stays a bit awkward all night). The research has no in-fight fade data; mild and lasting beats sharp and gone.
- react .2, weapon .22, pred/mem/mis .3 (from .35 / .6 / .5).

`levels.js know` 1200/pair (`PR=style,stance,south`), A's share of decided fights, landed R1-2 / 3-4 / 5-7 / 8-10:

| Pair | A share | Landed |
|---|---|---|
| stance (never saw a southpaw) | **46.2%** | 48.3 / 49.4 / 49.4 / 48.7 |
| south (default know .6): the southpaw wins | **53.4%** (A 46.6) | 48.5 / 49.5 / 49.3 / 49.0 |
| style (never saw the style) | **48.2%** | 49.1 / 49.6 / 49.7 / 49.8 |

Targets (`mind_southpaw.md`): stranger ~45–47 ✓; southpaw at normal know 51–53, we sit at the top (some of it may be the engine, below). Tries on the way (600/pair): keep .3 with knobs ×.6 overshot (stance 41.7%); atS .7 with knobs ~×.45 left the default-know southpaw edge at ~0.
**Engine note:** ctrl (both know .8, A orthodox v B southpaw, fam has no effect there) pooled over 3,400 fights: A 51.6%. A possible ~1.5 point orthodox edge in the engine itself (about 1.2 SE, not proven). Check with a stance-swapped ctrl before trusting it.
same.js holds 45127603 (no know in the default field) / old AI 7f58e976.

### Handoff (Oct 15, after L3)

**State:** branch `claude/brain-wire`, last commit before this note 4ebabc9. Brain is the default AI. `same.js 200` = **45127603** (brain + L2 + L3; L3 is neutral for the default field because no sheet there carries `know`); old AI `PATCH="AI.brain=0"` = 7f58e976. Skill levels L0–L3 done.

**L3 in one breath:** `BR.fam` in brain/brain.js (`famSet`/`famUpd`), engine `famOf(F)` passes his `sheet.know` about the OTHER man's style and stance at `brainInit` (again on a stance switch). Unfamiliar = `(bar − know) / bar`, bar `at` .45 for styles and `atS` .9 for the stance (southpaws are rare). Hurts reaction, prediction, habit reads, misreads, plus the opposite stance's main weapons. Fades over rounds 1–4 with a `keep` .2 floor all fight. Tuned to `research/mind_southpaw.md`: never saw a southpaw 46%, the southpaw at default know 53%, never saw the style 48% (`levels.js know`, 1200/pair, `PR=style,stance,south`).

**Open questions:**
- Possible ~1.5 point orthodox edge in the engine itself (ctrl pair, 3,400 fights pooled, A orth 51.6%; ~1.2 SE). Quick check if anyone cares: a stance-swapped ctrl (A southpaw) in `levels.js`, 1600 fights with `BoxerBrain.BR.fam.on=0`.
- No fighter in the lab carries `know` yet, so L3 only shows in `levels.js know` until L4 (learning) or the career.

**Next (ROADMAP "Claude" item 1): the brain pieces that hang off the levels.** Ed picks which first:
- Setups and traps: "show it twice, change it", armed traps, body bank, adjust delay by tier (`research/mind_traps.md`, `mind_combos.md`).
- Hurt brain by tier; the finisher weighs the risk (`research/mind_vision.md` 8d). Finisher caught 0.7% of hunts (want 5–10); same-round stop after a KD ~25% (research 35–45).
- Gassers save it for later (stamina pacing).
Same pattern as L2/L3: knobs off first (hash holds), then the read, then on and tune; every effect neutral at Pro; a commit per working step.

**Lessons from L3 (on top of the L2 list above):**
- 600/pair is still ±2 on a win share; the ctrl pair drifted 49.8 → 53.7 between identical runs. Use 1200/pair for the final call and `PR=` to run only the pairs you need (4 procs × 300 ≈ 9 min for three pairs).
- Win share swings ~3× the landed-share gap, and later rounds carry the early damage, so a lasting floor (`keep`) costs far more wins than the same peak early.
- A research subagent's WebFetch was DNS-blocked: numbers came from search snippets only. Say so when quoting them.

### Setups and traps (Oct 15, built, all OFF)

`BR.trap` in brain/brain.js, five switches in `BR.trap.on`, all 0 so the hash holds (45127603 / old AI 7f58e976). Commits 43de6df, 83be36e, 99c21b3.
- **show** ("show it, change it"): `lfHear` files his answer to my last punch by that punch (`this.bait`, faded `madd`). Once he shows the same answer (`shows` by tier, share ≥ `same`), `changeFor` builds the change: block/roll → swap head↔body; slip → add a hook if it fits the range, else body; duck → uppercut/body shot; pull → jab first; he counters → drop it and load my counter. The changed punch carries `look` (engine: `a.look` → perception; a block set for the old zone fails on the new one; autopilot `fool` .5).
- **bank** (body bank): body landed fills `this.bank`, fades ×`bankFade` per round. Early rounds weight body investing, from round 3 lowHigh pays it off.
- **draw** (draw the lead): smart counter-punchers show a jab; when he leads into it `drawNeed` times the trap arms; next time he leads with that punch: pull (weight ×4), then a protected `cross` after his impact (`queue.trap`). No step back, no hidden counter (they cost the counter-puncher 3.6 pts).
- **delay**: adjust delay by tier (`delay` losing rounds before he changes; World 1, Novice 5), `menu` how many fixes he knows.
- **vary**: a smart defender (read/block/slip) notices his own habit (top answer ≥ .6 of the last 5) and fades it ×.35.
- `levels.js` rows: changes/fight, picked right, landed, baits, traps armed/sprung, trap counter landed, first adjust rd.

**All on (sk 300/pair):** IvN 18.7, PvI 16.0, PvN 3.7(!), WvP 15.0, P mirror 45/47.7. Audit 50.7 / 14.9 / 29.4%, stops 23.6%. Body: liver KDs 13 v 14 base. Pro: ~1.9 changes/fight (82% right, 40% land), traps armed .8 / sprung .5, pull counter lands 31%. World: ~8 changes, 1.5 armed / 1.3 sprung. First adjust: Pro rd ~4.0, World ~3.6.
**Styles (300/pair):** off 54.5 sw / 51.9 ob / 50.1 sl / 46.9 bp / 46.3 ctr. All on: ob 57.0, sw 51.7, bp 50.5, sl 46.9, ctr 44.0. Each piece alone sits in noise; stacked, the outboxer gains ~5 and the counter-puncher drops ~2.

### Handoff (Oct 15, after traps)

**State:** `claude/brain-wire`, traps built and pushed, everything off. Hashes unchanged (45127603 / 7f58e976). Docs for the traps live in the section above; CLAUDE.md and ROADMAP not yet changed for them.

**Waiting on Ed (two calls):**
1. A (rec): switch the traps on now, fix outboxer (57) / counter-puncher (44) in the L6 balance pass. B: keep off, dig into why the outboxer gains when stacked (style runs with all-minus-one: all minus vary, all minus show…), ~1–2 hrs.
2. If A: all five on, or skip some?

**When decided:** set `BR.trap.on`, `node brain/inline.js`, `node tests/same.js 200` (new hash), `PATCH="AI.brain=0" node tests/same.js 200` (expect 7f58e976). Update CLAUDE.md hash + brain targets, ROADMAP (traps item done), this file. Commit, push.

**Watch out:**
- PvN 3.7 in the all-on sk run looks off (a two-level gap should beat a one-level one). Compare with the base run's PvN row before switching on.
- Scratchpad copies (t1/t2/t3.html) die with the old session; rebuild with `PATCH=` on the switches.

**Still left on ROADMAP item 1:** hurt brain by tier (finisher weighs the risk), gassers pacing.

### Traps ON (Oct 15, the dig)

Ed: dig first, then all five on. Leave-one-out (styles.js 300/pair, all on = ob 54.2 / ctr 44.3): minus vary ob 50.2 / ctr 47.4, minus delay 50.9 / 46.0, minus show 51.1 / 46.9, minus draw 56.8 / 46.1, minus bank 55.8 / 44.3 (each ±1.5, a diff ±2.1).
- **Fix: vary only after a burn.** He varied his top answer whether or not anyone punished it: a pure cost for the slip-and-counter man. Now `this.burn` +1 when a punch lands within `burnWin` 1.2 s after one he blocked/evaded; vary chance × min(1, burn / `burnN` 2); burns ×`burnFade` .5 between rounds. Varied /fight (sk): Int 22–29, Pro ~67, World ~130.
- **Pooled styles (2×300/pair):** off ob 52.4 / sw 53.1 / sl 50.4 / bp 47.9 / ctr 46.0; on ob 53.5 / bp 50.4 / sw 50.2 / sl 49.0 / ctr 46.9. The old "off 54.5 vs on 57" pair was noise on both sides; single runs swing ±3.
- **Level gaps (levels.js sk 300):** off IvN 18.7 / PvI 17.7 / WvP 17.0 / PvN 3.7; on 16.7 / 16.0 / 19.7 / 4.0. PvN ~4 is the baseline, not the traps.
- **Audit 500:** 50.6 thrown / 14.8 landed / 29.2%, stops 23.8% (was 25.5 before traps). Hash 281f4411, old AI 7f58e976.
- Left for L6: counter-puncher 46.9 and outboxer 53.5 on the band edges (both were there with traps off), stops a hair low.

### Hurt brain by tier (Oct 15, ON)

Ed: most go for the stop; a novice swings for the fences, a vet picks clean shots and respects that a hurt man can still defend, fight back, or land a fight-ending counter (rare); experienced men are the most dangerous hurt, anyone can be, rarely. `BR.hb` in brain/brain.js, tables [N, I, P, W] neutral at Pro, `hbV(key, m)`; finishing mastery `finM()` = (read + pacing) / 2; danger reads (counter + read) / 2.
- **reck** [.35, .15, 0, 0] extra chance to skip the look and go all in. **ignore** [.6, .3, 0, 0] misses the warning signs (still throwing back / countered me) and goes all out. **respect** [0, 0, 0, .25] no warning signs, behind the guard anyway. **wild** [1.6, 1.25, 1, .85] wide punches in the all-out hunt. **tunnel** [1.4, 1.15, 1, .8] x BR.tunnel while hunting. **danger** [.8, .9, 1, 1.25] the hurt man's fire/bait counter chance.

| levels.js sk 300 (traps on) | off | on |
|---|---|---|
| Reckless hunts N / I / P / W | 18 / 15 / 13 / 12% | 51 / 26–31 / 15 / 12% |
| Behind the guard N / I / P / W | 74 / 66–73 / 67 / 71% | 40 / 55–59 / 70 / 76% |
| One level down wins IvN / PvI / WvP | 18.0 / 18.0 / 16.3 | 15.0 / 14.0 / 16.7 |
| PvI dog wins by stoppage | 25.9% | 14.3% |
| finish.js 600: stops / same-rd stop after KD / KDs both ways | 23.2 / 25.9 / 5.2% | 23.2 / 25.5 / 8.5% |
| audit 500: thrown / landed / conn, stops | 50.6 / 14.8 / 29.2, 23.8% | 50.2 / 14.8 / 29.5, 21.6% |

- Wild novices throw away their own stoppage chances: upsets one level down drop ~3 (to the band floor). Watch in L6.
- Danger (the hurt vet's counter) is ~0.5 events per man per fight: 300/pair can't see it. Pool 1500+ before tuning it.
- Hash 42febe1a, old AI 7f58e976.

### The finish after a knockdown (Oct 15, ON)
Probe (scratch, 600 fights): a man who beat the count came back at 34% of his head max, already above the engine's hurt line (30%). Over the ~80 s left he ate ~7 clean head shots, ~13 damage, and regenerated ~14: he healed as fast as he got hit. The man who dropped him called him hurt for only 10 clock s (`BR.fin.kdWob`). Same-round stop by when the KD came: <30 s left ~18%, 120+ s left only ~31%.
- `TUNE.kdRegen` (engine, new): head regen x this the rest of a round once he's been down (`F.kdR`). .3.
- `BR.fin.kdWob` 10 → 25: the chase on the resume (also how long he feels hurt himself).
- Either alone barely moves it (kdRegen .3: 29.8%; kdWob 30 alone: ~24%, 600 fights).

| finish.js 1200 | base | kdRegen .3 | .3 + kdWob 25 (ON) | .15 + kdWob 25 |
|---|---|---|---|---|
| stoppages | 23.4% | 24.4% | 29.6% | 26.4% |
| same-round stop after a first KD | 25.6% | 29.8% | 35.8% | 34.4% |
| KDs/fight | .82 | .80 | .89 | .84 |
| man dropped first wins | 23.2% | 21.3% | 19.9% | 22.4% |

After (ON): audit 500 50.6 / 15.1 / 29.9%, stops 26.4%, KDs .9/fight. Styles 2x300/pair: outboxer 52.3, swarmer 52.1, slugger 50.3, boxer-puncher 48.9, counter 46.3 (was 46.9: the low man, L6). levels sk 300: IvN 16.3, PvI 15.0, WvP 14.3, PvN 3.0. Hash caec652, old AI 445f9aa3 (the engine regen knob reaches the old AI too).

### Coach calls and gas pacing (Oct 15, ON)
Ed (12-question round): the coach's calls reach the brain, from the corner (weighs more) and live; he always listens (no trust yet). A man who knows his tank paces himself naturally; the coach can tell him to pick it up or slow down. Research: `research/mind_coach.md` 4-5, `mind_pace.md` 2, 4.
- `BR.coach`: the corner's round plan (`F.strategy`, STRATS key) and the live shout (`F.order`, SHOUTS key) are offsets on his own plan (initiative, range, jab, power, body: the `this.plan` units), a throw-rate x (`out`) and guard +. Corner at `corner` .6, fading to half by the bell; live at `live` .45 x the engine's q (how he took it), in over 2 clock s, out with the shout's own fade. Output calls are capped by the tank (`gasOut` .5 .. 1). Read through `pv(x)` (plan + corner) wherever the plan was read. The engine passes `me.strat` and `me.order`.
- `BR.gas`: a throw-rate x per decision. His tank (stamMax vs the first bell) against a line from 1 to `end` .62 by the last round (the field runs 1 to .64 by R11 of 12): ahead he spends, behind he saves (`adj` 1.2 per point, `max` .15); the last round +.1; the other man under .4 gas and well under his own +.12 x read; all x `know` [0, .4, .8, 1] on pacing mastery. A novice comes out hot the first 3 rounds (`rush` [.12, .06, 0, 0]).
- New calls: Pick it up / Slow down as live buttons (SHOUTS up/down, yells, shoutFit: outworked, the other man fading, behind late / emptying the tank, throwing and missing) and as corner plans (STRATS up/down, talk words, the Claude prompt menu).

| Coach value (mirrors @82, side 0's corner) | brain ignores the corner | brain follows (ON) |
|---|---|---|
| live: oracle (best fit) 1200 | 57.6 | 54.5 |
| live: none 1200 | 51.1 | 51.1 |
| live: random 1200 | 49.0 | 45.7 |
| corner plan vs a silent corner, 1200 (corner at 1.0; silent mirror 46.1) | - | ai 49.1, move 52.7, survive 52.9, counter 49.1, body 48.7, ko 45.3, pressure 41.8 |

Corner at 1.0 swung mirror fights -4..+7 for a blind plan (research: a talk-in moves the tendency 20-40% of the gap); cut to .6. Pressure as a blanket plan loses: the engine's lead-and-eat-counters lean (L6).

Full check (ON): audit 500 x3 50.6-51.5 thrown, ~15 landed, ~29.5%, stops pooled 23.5% (off 24.5%; one 500 read 19.8, noise); finish 600 28.0%, same-round stop after a KD 31%; styles 2x300/pair outboxer 53.9, swarmer 50.3, slugger 49.8, boxer-puncher 48.1, counter 47.9; levels sk IvN 15.7, PvI 16.7, WvP 16.7, PvN 1.7. Gas by round (12 rds @75): output 51 / 55 / 54 / 53 / 52 / 51 / 50 / 49 / 48 / 46 / 45 (R1-11), under 45% gas ~2-3 pts less late with pacing on. Pick it up / Slow down at 600: only_up 49.8, only_down 47.2 (blind spam costs), oracle 52.4. Hash 8443008f, old AI 445f9aa3.


### Balance pass L6 (Oct 15)
Brain on, @82. Styles 2x300/pair (600/pair, ±1.1 per style); specials 200/pair vs each base style (±1.6); audit 500 x3 pooled; levels `sk` 300/pair; finish 600.

**1. The pocket bug (commit 2444a36).** The pressure boxer read 42.7. Diagnosis on `vs:pboxer`: no pressure plans 48.9; a softer `BR.coach.plan.pressure` 46.8-47.5; the engine's `STRATS.pressure` neutral 48.5. Under the brain, the only engine-side leftover of a round plan was `updateF`'s `ret` x.6 on pressure/KO: after every punch he only stepped 60% of the way back, so he parked in the pocket and ate counters, on top of the brain's own pressure plan. Now old-AI only (`!F.brain`). Pressure boxer ~47.8 pooled, then 49.8 after the style tune.

| Blanket corner plan, every round (mirrors, 600 each, ±2.2) | after the pocket fix |
|---|---|
| silent / ai / move / survive | 53.4 (noise) / 50.5 / 49.6 / 50.9 |
| pressure / counter / body / KO | 48.0 / 48.5 / 45.7 / 45.2 |
Pressure was ~-4 vs silent (Oct 15 table, corner at 1.0), now about even. KO every round on a fresh man should lose; a well-timed KO call is unmeasured.

**2. The style tune (commit eedbd2c).** Tries (style's 4 pairs at 300, or the round robin):
| Try | Result |
|---|---|
| out-boxer `sk.jab` 10 -> 6 | first read 51.0, full 2x300 54.4: no effect (dropped) |
| boxer-puncher initiative .5, patience .6 | bp 47.2: no help |
| out-boxer `t.output` .55 -> .48 | out-boxer 52.8 (4 pairs) |
| out-boxer `sk.footwork`/`angles` 6 -> 2 | out-boxer 52.8 (4 pairs) |
| boxer-puncher `sk.power` 10, slip/block +4 | bp 48.8 (4 pairs); with both out-boxer trims: bp 52.1, counter 46.9 (overshot) |
| **Kept:** out-boxer output .48 + footwork/angles 2; bp power 8, slip/block +2; counter `t.output` .35 -> .4 | counter 52.1, swarmer 50.3, out-boxer 50.2, bp 49.3, slugger 48.2 |

| Full check | Before L6 (4932e28) | After L6 (hash 1de442e5) |
|---|---|---|
| Audit 3x500 | 51.6 / 15.2 / 29.5%, stops 27.7% | 51.5 / 15.1 / 29.3%, stops 26.6% |
| Styles | outboxer 53.0, swarmer 50.8, slugger 50.3, bp 48.4, counter 47.5 | counter 52.1, swarmer 50.3, outboxer 50.2, bp 49.3, slugger 48.2 |
| Specials vs base | body 53.2, volume 52.1, jabgrab 51.3, awkward 50.1, feinter 49.8, angle 49.5, spoiler 47.6, switch 46.7, pboxer 42.7 | body ~53.3 (55.2, 51.4), awkward 52.4, angle 52.0, jabgrab 51.6, spoiler 51.5, volume 50.9, pboxer 49.8, switch 49.2, feinter 48.3 |
| Guards vs standard (300) | high 50.4, peekaboo 48.3, philly 48.7, cross 55.4, handslow 53.6 | not re-run (guards untouched) |
| Levels sk | IvN 18.3, PvI 19.7, WvP 16.0, PvN 2.0 | IvN 14.4 (900), PvI 16.0, WvP 16.0, PvN 4.3 |
| finish 600 | 27.8%, same-round stop after a KD 35.2% | 26.3%, 31.1% |

Lessons:
- Stops were already in band: the "~23.5%" in CLAUDE.md was a low read. Three fresh 500s read 26-29%.
- A first 300/pair read can be 3 pts off (jab trim: 51.0 then 54.4). Never ship a style knob on one read of 4 pairs.
- Trait `output` is the strong style lever (+.05 on the counter-puncher moved him ~+5); skill leans of 4 points barely move anything (x .8 lean).
- Watch: IvN at ~14.4 (floor 15); the side-A edge in even fights (audit gap 0 pooled ~42% over ~750, ~47.5 expected with draws).

### Handoff (Oct 15, after L6)
**State:** `claude/brain-wire` = `claude/l6-balance` (L6 done, full check in "Balance pass L6" above). Hash 1de442e5, old AI 445f9aa3. CLAUDE.md and ROADMAP current. Drama decided (`docs/DRAMA.md`), L4 not started.

**Next (ROADMAP 2): retire the old AI** (`decide()`/`react()` and what only they use). Effort: high (ask Ed first; it must keep the brain hash 1de442e5).
- What still leans on the old AI: `tests/bvo.js` (brain vs old AI) and the `PATCH="AI.brain=0"` hash 445f9aa3; the engine's `if (!F.brain)` / `if (D.brain) return` branches (react, miss, beat, updateF's `ret`, sgOf/planOf used by decide). Grep `F.brain`, `D.brain`, `!F.brain`, `sgOf`, `planOf`, `STRATS[` before cutting.
- The brain path must not change: same.js 200 must still print 1de442e5 after every cut. Cut in small commits (dead branches first, then decide/react, then the STRATS fields only they read).
- Then: JSDoc + `// @ts-check` with a `tsconfig.json` `checkJs` (no build step) on `brain/brain.js` first, and gather the tuning knobs (TUNE, DMG, AI, BR...) into one marked block.
- bvo.js and the old-AI hash go away with it: update CLAUDE.md (hash line, Tests list, Code map: `decide()` on a timer, `react()`).

**Measurements queued before L4 design (ROADMAP 4):** `levels.js curve` (win % vs a continuous skill gap), the side-A edge in even fights (audit gap 0 pooled ~42% over ~750, ~47.5 expected; `tests/swap.js 100` is the tool), a well-timed KO call's value (a plan test: KO only when he's hurt or behind late, vs never; the blanket-plan script lived in the old scratchpad: corner calls a fixed plan every round in mirrors @82, the other side 'auto').

**Watch:** IvN one-level-down ~14.4% (floor 15). Body snatcher read 55.2 then 51.4 (fine pooled).

**Ed, Oct 15 (this session):** L4 learning before traits; outside review (DeepSeek) folded into ROADMAP: learn more from losses, drama before L4; crowd look and sound only; named officials with made-up names (`docs/DRAMA.md`); medium effort by default, one step per session. Roadmap flowchart (private artifact): https://claude.ai/artifact/JFthHeFf3SvBh2WUqEyogg (source lived in the scratchpad; rebuild from ROADMAP.md if it needs an update).

### Old AI retired (Oct 16)
**Done (ROADMAP 2, now gone from the list):** the brain is the only AI. Cut: the `AI.brain` flag, the lab's Old AI picker, `tests/bvo.js`, `decide()`, `react()` (the spoiler's tie-up stays as `spoil()`), the old counters (on a miss, out of the guard), the engine's `pickCombo`/`punchVal`/`pickCounter`/`need`/`escape`/`tryBait`/`startFeint`/`tempoStart`/`beat`, the engine combo book (`COMBOS`, `PNUM`, `RANGE_C`, `STYLE_COMBO`), its opponent memory (`F.mem`, `MEMV`, `memAdd`) and anticipation (`ANT`, `antRead`), the plan math (`planOf`/`sgOf`/`mixMods`, STRATS numbers, SHOUTS mods), `NEED`, most of `TEMPO`, `FEINT_READ`, `GUARD_FEINT`, `OPEN_W`, `F.bait`, `F.decT`, `ctrEdge`. All of it was unreachable or write-only with the brain on.
- **Hash held:** same.js 200 = 1de442e5 at every commit (same.js 40 = 3e588522 for a quick look). The old AI's dice rolls on shared paths (feel-out at fight/round start, the reset after an exchange, stick jab, clinch break, combo cut short, the opportunist) stay as bare `R()` calls with a `same.js hash` comment. Drop them only together, on purpose, and record the new hash. No sims needed: same seeds, same fights.
- **Type checks:** `tsconfig.json` (`checkJs`, `strict` off, no build step); `tsc -p .` is clean on `brain/brain.js`. Typedefs Perception, SeenPunch, Action, BrainOpts at the top of brain.js. Next files to add: `brain/ring.js`, then maybe an extracted engine.
- **Knobs:** one `TUNING` block in index.html right after the ring constants.
- **Found while cutting:** the corner's lessons (`teach()`, `F.read.les`) only ever fed the old AI's plan, so with the brain they do nothing but print the 'learned' line (`tests/teach.js` measures nothing now). L4 decides: wire them into the brain's plan or cut them (ROADMAP 3). The brain's own rope-a-dope has no 'bait' commentary event (parking lot).

### Handoff (Oct 16, after the old AI)
**State:** `claude/brain-wire` = `claude/retire-old-ai`. Hash 1de442e5 (no old-AI hash anymore). CLAUDE.md, ROADMAP current.
**Next (ROADMAP 1–3):** the brain pieces still open (the AI corner is blind: `aiStrategy`), then Drama (`docs/DRAMA.md`), then L4. The measurements queued before L4 (above) still stand.

**Plan for the next session: the AI corner reads the fight (ROADMAP 1, coach calls).** Effort: medium (knob tries and sims); ask for high only if the corner design gets bigger than below.
1. Baseline (mirrors @82, both brains, 600+/arm through `tests/check.sh` or written to disk): `aiStrategy` vs a silent corner ('auto' every round) vs a fixed blanket plan. Today: plans beat silent by only ~3; blanket pressure ~48, body ~46, KO ~45.
2. Between rounds, the AI corner reads what the player's corner sees (`roundNotes()` data: who landed what, gas both sides, the cards, hurt, time on the ropes, his guard leaks) and adds the calls it never makes: Pick it up (behind late / round slipping) and Slow down (his gas going, ahead). Keep `R()` draws in mind: a changed `aiStrategy` changes the hash (that's fine here, record the new one).
3. AI live shouts during the round: reuse the `smart` policy in `tests/shout.js` (scale: oracle 54.5 / none 51.1 / random 45.7 at 1200), gap ~8 s, both corners use it in the lab.
4. Target: a smart AI corner beats silent by ~+5 in mirrors, and balance holds with both sides using it: styles 48–53, specials 48–54, guards 48–58, audit thrown ~52 / connect ~29 / stops 25–30 (full `check.sh`). Then hash, CLAUDE.md, ROADMAP, a handoff note.
5. If time is left: pool the hurt vet's counter danger (ROADMAP 1, hurt brain) with `finish.js` 1200+.

### AI corner reads the fight (Oct 16, ROADMAP 1)
Branch `claude/ai-corner` (off brain-wire 0f5b463). Effort medium, then high for the pressure boxer dig (Ed's call). New test `tests/corner.js`: corner policies in mirrors @82, **sides swap every fight** (cancels the side-A edge). `node tests/corner.js 600 82 ai/ai,auto/ai [auto/none]` (policy = plan/live; TAG pools into /tmp/corner_TAG.txt).

**Built:**
- `aiStrategy` reads what the player's corner sees: cards, rounds left, gas both ways, last round's work (`F.rs.thrown`), hurt, ropes. New calls: Pick it up (behind with `AIC.plan.late` 3 rounds left and gas, the other man fading under .45 and well under mine, or outworked under .7x and not ahead), Slow down (gas under .4 with rounds to go and not behind by 2+). Pressure styles (`aggr` > `AIC.workAggr` 1.3: swarmer, volume) only under `workGas` .3.
- `Fight.aiShout(F)`: the AI corner yells live. Every `AIC.look` .5 s it takes the best `shoutFit` over `AIC.bar` .55, then gives him `gap` 8 s with it. Both corners by default (`opts.aiCorner`, `f.aiCorner`); in the lab side 0's AI corner goes quiet `hold` 20 s after the player yells (`F.userT`). Commentary 'heard' line throttled to 12 s.
- shoutRead fixes found on the way: the jab-on-style-alone fit .6 -> .5; Move when trapped .9 -> .7; **Counter no longer reads the other corner's plan** (`O.strategy`): a corner sees what the man does (pace), not the plan sheet.
- Style re-tunes for the new corners: out-boxer output .48 -> .45, slugger .42 -> .44 (brain.js), pressure boxer `hit` 1.25 -> 1.35 (engine STYLES).

**Baseline (sides swapped, 600 each, ±2.1):** the old corner was worth nothing. Its "+3" was the side-A edge.
| vs a silent corner | win % |
|---|---|
| old aiStrategy plans | 49.4 |
| blanket ko / pressure / body | 48.7 / 48.7 / 52.1 |
| live smart (shout.js) / oracle | 48.7 / 52.5 |
| new plans only | 49.7 (later 47.3) |
| new live only (bar .5) | 53.0 |
| new plans + live, bar .5 / .55 / .6 | 58.5 / 60.0 / 52.9 |
| old plans + new live | 54.5 |
| **final (all fixes), 1800** | **53.6 ±1.2** |
The plans alone never beat silent (47–50 every read). All the value is live shouts. The 58–60 reads leaned on the two bad reads (Move .9 and the plan peek). +3.6 is short of the +5 aim; a perfect-call player was ~+3.4 (oracle, Oct 15), so the AI corner coaches about as well as the best player. Shipped at +3.6 (Ed: ship, flag it).

**What broke balance and why (calls are not worth the same in the engine):** `defEdge` (Move, Hands) makes him harder to hit on every punch while the call lives; `atkEdge` (Jab, Body, Press, Counter) only on the matching punches; Up/Down carry no engine edge, only the brain's output. Mover corners had a call up ~52 s/rd vs ~41-45 for pressure men (`scratchpad edge.js`: order seconds and orderPow x dt by call).
- Swarmer 46.9: his corner said Slow down 12x/fight (gas runs low by design). Fix: workAggr.
- Out-boxer 56.2: Move off the ropes, the best call in the book. Trim .45.
- Pressure boxer ~45.5 (no corners 47.9-49.8). E1 no Up/Down live 44.6; E2 his own corner silent 42.9; **E3 the other corner silent 49.9**. Blocking one call of the other corner vs him: Move 49.0, Counter 46.9, Jab/Body/Up 44.4-45.3. Per opponent the out-boxer swung it: 59 with his corner, 44 silent (Move ~7, Counter ~8). Move .9 -> .7 alone: no change for him (base styles tightened to 48.7-51.3). Move with no brain push (`call.move={}`): 46.2. Plan peek removed: out-boxer vs him 59 -> 51.7, pboxer 46.0 (spread over the field). `hit` 1.35: 49.8 (5 pairs, 300). Tries that did nothing: STYLE_PLANS pboxer pressure 3 -> 1 (45.9), AI_MAP output lean +.05 (44.9), Press mirrors Move (.9 trapped + .6 vs a mover; 45.9, reverted), workAggr 1.0 (body 53.7 -> 47.7, reverted).

**Confirmation on the final code (slugger .44, check.sh aicZ s a sp):** styles counter 52.2, swarmer 51.0, bp 49.8, outboxer 49.7, slugger 47.4 (pooled with the 600/pair read 48.4); specials awkward 55.3, angle 54.7, feinter 52.8, volume 52.0, spoiler 50.9, switch 50.8, body 50.3, pboxer 49.1, jabgrab 48.5; audit 51.2 / 15.1 / 29.5%, stops 26.7%.

**Full check before the slugger nudge (styles/specials pooled 2 passes):** styles 47.4-52.7 before the slugger nudge (slugger 49.4 after, 4 pairs x600), specials 47.6-54.1 (pboxer 48.1, jabgrab 48.8, switch 47.6, angle 54.1), guards 47.7-55.8, levels sk IvN 16.5 PvI 20.0 WvP 17.0 (600/pair), finish 26.8%, audit 51.1 / 15.1 / 29.5%, stops 28.2%.

### Handoff (Oct 16, after the AI corner)
**State:** `claude/brain-wire` = `claude/ai-corner`. Hash d9fe6759 (same.js 40 = 5f989e36). CLAUDE.md, ROADMAP current. Both AI corners are on in every sim and the lab.
**Next (ROADMAP 1, what's left):** pool the hurt vet's counter danger (`finish.js` 1200+, the step-5 item this session didn't reach), then ROADMAP 2 Drama (`docs/DRAMA.md`).
**Open from this step:**
- The AI corner's plans are worth nothing alone (47–50 vs silent). If Ed wants a stronger corner, look there: a timed KO call (only when he's hurt or behind late), body when the body is really going. Measure with `tests/corner.js` (plan/none vs auto/none, 1200+).
- Edges of the bands: angle fighter ~54.3 pooled (54.1, 54.7: the one special at the ceiling with corners on), awkward ~53.0 pooled (51.9, 55.3), switch 47.6 then 50.8. Guards peekaboo 47.7. Slugger at .44: 49.4 (4 pairs x600) and 47.4 (2x300), pooled 48.4.
- `tests/shout.js` runs with side 1's AI corner on (default `aiCorner`), so its numbers aren't comparable to the Oct 15 table; corner.js is the tool now.
- The diagnostic scripts (calls by side, edge seconds by call, call attribution via PATCH on `aiShout`/`shoutFit`) lived in the session scratchpad; the PATCH pattern is in "AI corner reads the fight" above.

### The hurt man's danger, pooled (Oct 16, ROADMAP 1, closed)
`tests/danger.js`: a Pro hunter (same body @78, levels from `sheet.sk`) against a hurt N / I / P / W man, `BR.hb.on.danger` on vs off, 1200 fights per row (4x300, `/tmp/danger_dg.txt`). Stung = the hunter walked onto a clean power counter in a hunt; caught = he got hurt or dropped going for the finish.
| hurt man | hunts/fight on / off | stung/hunt on / off (±.6) | caught/hunt on / off (±.1-.2) | hurt man wins on / off |
|---|---|---|---|---|
| N | 4.89 / 4.75 | 17.0 / 15.7 | 0.3 / 0.3% | 3.6 / 4.1% |
| I | 3.58 / 3.78 | 17.2 / 17.0 | 0.6 / 0.5% | 15.4 / 17.1% |
| P | 2.43 / 2.62 | 17.2 / 15.6 | 1.1 / 0.6% | 45.7 / 46.5% |
| W | 1.99 / 1.93 | 15.7 / 15.1 | 1.2 / 0.8% | 77.7 / 79.8% |
- **The danger knob is inert.** P is neutral by definition (x1), yet P's on/off gap is as big as any: the rest is noise. N moves the wrong way. It only scales the fire/bait counter when the finisher's hands are down, a sliver of the stings.
- **The design holds from skill alone:** caught (the rare fight-ending counter) climbs with the hurt man's level, N .3 / I .55 / P .85 / W 1.0% pooled, ~3x. Stung (a clean counter) is flat ~16% at every level. A Pro hunts a hurt World man half as often as a hurt Novice (2.0 vs 4.8 a fight).
- Kept as is (no hash change, d9fe6759). If Ed wants a hurt vet scarier, the lever is his counter chance in a hunt itself, not this multiplier; measure with danger.js.

## Where we are (Oct 24, the 2D game back: G1 + G2 built)
Read this first. Older handoffs: `docs/NOTES.md` "Handoff log"; the pre-3D baseline: `docs/SIZE.md` "s3, the pre-3D baseline".
- **State:** main `claude/epic-goldberg-ps6ip4`. Engine untouched: `same.js 40` = **3fd3c667** (rechecked after the lab split). The brain inline is current.
- **Built:** `game.html`, the full career on today's engine + brain (`docs/GAME.md` "Built"): `game/build.js` swaps the lab section of `index.html` for `game/career.js` + `game/ui.js`. The learning is live: skills, talent caps, know, rematch memory both ways, scars, film, camp picks. Published privately: https://claude.ai/artifact/RF3wctrjte4R63FyN28mC5.
- **Next (Ed, Oct 24): the fights before the career** (ROADMAP Claude item 1): F1 how they move (the 3D stance research in the 2D drawing: render only, hash holds, high effort), F2 fight feel, F3 coaching, F4 fight IQ / balance. The career (G3, G4, the tuning reads) waits.
- **3D (parked, Ed Oct 24):** all 7 stance changes built, waiting on Ed's phone notes.
- **Parked for the brain pass (unchanged, Ed Oct 23):** counter 47.1, swarmer 47.8, peekaboo 44.7, specials 46-47.6, cheese haymaker 64.4 + bodyOnly 59.9 at hard, lead changes 35, PvI 14.6, the short man vs a long outboxer 39.3 at 6 in.
