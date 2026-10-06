# The Brain (Oct 6 2026): the AI boxer's fight IQ and decisions

Ed: "the fight iq, fight engine, the boxers iq, the decisions they make, play a huge part into how the game runs because the ai boxer is the brain."

This replaces COMBAT.md steps 8 (rhythm) and 10 (smarter AI) and feeds step 9. Steps 6, 7 and 11 stay as they are.

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
- **B5:** In-round and between-round adjustments, plus "what hurt me".
- **B6:** DNA numbers for every style from the research cards, then a full balance pass.
- Lab republished after each engine step so Ed can watch the brain work.
