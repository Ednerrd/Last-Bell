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
