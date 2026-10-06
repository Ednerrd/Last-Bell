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

## Steps (each a commit, sims before and after, never balance + visuals together)
- **B0:** `tests/brain.js` and a baseline report. No engine change.
- **B1:** Opponent memory with fading. Recording only first (same.js hash holds), then wired into combo picks.
- **B2:** Intent modes and rhythm, from style DNA.
- **B3:** Anticipation plus the defense-keyed counter table.
- **B4:** Setups, feint traps, "show it twice, change it".
- **B5:** In-round and between-round adjustments, plus "what hurt me".
- **B6:** DNA numbers for every style from the research cards, then a full balance pass.
- Lab republished after each engine step so Ed can watch the brain work.
