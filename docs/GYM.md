# Last Bell: the gym (new direction, Oct 2026)

## In Ed's words
Auto boxing game with realistic, true-to-boxing AI: different fighters and styles, today's boxing (2026). Influences: Fight Night Champion, Thrill of the Fight 1 and 2 (VR), some of Undisputed.

You are a new coach. You open a boxing gym in your town (more locations later). Locals start to notice, and new, old and expert fighters come to join. You scout and pick who to train. New fighters start from scratch and you shape them (style, technique). Experienced fighters and pros come already built; your job is to take them under your wing and make them champions, in one weight or several.

Training: teach combinations, build resilience and strength, mitts, heavy bag, sparring (with stablemates, visiting pros, boxers from rival gyms).

Fight: you are the corner. Between rounds you tell him how to adjust ("throw more jabs", "jab and move", "naw man keep your hands up and counter, he's tagging you"). During the round you can yell micro adjustments when he doesn't adjust on his own.

Everyone is unique: style, technique, age, ring IQ, the jab itself. Study Shakur Stevenson, Lomachenko and Benavidez to see how different styles really are.

## What we keep
The whole fight engine: styles, guards, combos in trainers' numbers, Ring IQ, shouts, corner talk (notes + text/voice + Claude), commentary, judging, cuts, weight classes, legends, scouting, the 2D render (3D stays the long-term plan).

## What changes
One fighter's career becomes a **gym with a stable**. Each fighter in it is what a career is today (stats, style, guard, record, ranking, camp), plus what makes him a person.

## Fighter DNA (what makes each one unique)
On top of style + guard + stats:
- **Combo book:** the combos he owns, each with a fluency (drilled on the mitts). A raw kid knows 1, 1-2. A pro has his own set.
- **Signature moves (strengths):** shoulder roll + pull counter, pivot to the outside angle, stiff range jab, body shots, feints, volume in bunches.
- **Habits (flaws):** drops the right after the jab, straight-legged/squared up when coming forward, backs straight up, only fights going forward, gasses when he can't stop the other man.
- **Person:** age (prime ~26–32; older men know more, recover less), coachability (how fast he learns, how well he hears you), ego (pros push back on changes), heart, ambition.

Reference fighters (inspired-by, fictional names in game):
- **Shakur Stevenson type:** southpaw technician, sharp disruptive jab, shoulder roll when pressured, pull counters off the ropes, distance control, low output, high IQ. Wins on the cards.
- **Lomachenko type:** southpaw, footwork and angles: steps to the outside foot, jab then pivots 90° to the side and hits as you turn; feints to move; makes you shell up, then goes around the guard. Jab, low lead hook to the body, then hook or uppercut upstairs.
- **Benavidez type:** pressure plus volume, fast hands, clusters of combos to the body and head that break you down. Flaw: flat, straight-legged feet, breaks stance walking forward, narrow and off balance.
(Most of this maps onto existing knobs: philly guard + counter style, angle trait, volume/swarmer + combo book, plus new habits.)

## The loop
1. **Gym:** reputation grows with wins, belts, good sparring. More rep = better walk-ins.
2. **Recruit:** each week a few people show up (raw kids, journeymen, a faded vet, sometimes a pro looking for a new trainer). Scout and sign. Stable size limited by gym level.
3. **Train (per fighter, per week):** pick sessions.
   - Mitts: teach or sharpen a combo (combo book fluency).
   - Heavy bag: power, stamina.
   - Conditioning / roadwork: stamina, recovery.
   - Defense drills: head movement, a signature defense.
   - Sparring: Ring IQ + experience, can fix or reveal habits; risk of wear/injury. Partners: stablemates, visiting pros, rival gyms (ties into rivalries).
   - Rest: fatigue (Fight Night's lesson: train too hard and he shows up tired).
4. **Fight:** corner talk between rounds (built) + in-round yells (built as shouts; free text in-round = future).
5. **Grow:** titles, more divisions, a second gym location, the gym's name in the rankings.

## Build order (each step small, sims before/after on any engine change)
1. **Gym + stable:** wrap today's career as one fighter of a gym; switch between fighters; one calendar for the gym.
2. **Recruitment:** walk-ins by tier (raw / journeyman / vet / pro) with ages, styles, DNA; gym reputation.
3. **Training sessions:** mitts with a combo book (engine: fluency weights the combo pick and its speed), bag, roadwork, defense, rest/fatigue.
4. **Sparring:** headless engine fights inside the gym (stablemates, visitors, rival gyms).
5. **Signature moves and habits** in the engine (sims!), and the reference fighter types.
6. **In-round micro talk** (free text during the round), locations, gym upgrades.
Future (Ed: not now): the bond/trust system.

## Ed's calls (Oct 2026)
- All fresh: a new save type (old careers stay as "classic").
- Stable of 3–5 fighters (gym level sets it).
- The current pound-for-pound top 10 are in, with slightly changed names (The Ring, June 29 2026).

## Built (step 1, Oct 2026)
- Title: an empty slot opens a gym (or a classic career). Gym save: `mode: 'gym'`, `newGym`, `G.fighters` (each one is a career player object plus `plan`, `booked`, `fightWk`, `busy`), `G.worlds` (one world per division, made when needed), `G.walkins`, `G.log`.
- One weekly clock: `gymWeek` trains every fighter on his plan (`trainWeek`, teenagers learn fastest), heals, pays dues/upkeep, sims the divisions every 2 weeks, new walk-ins every 4 weeks. A booked fight is N camp weeks out (`CAMP_WEEKS`); the week can't move past a fight night until it's fought.
- Walk-ins: raw (you pick weight, style, stance, guard), journeyman, veteran (rep 15+), ranked pro (rep 35+, comes off the real rankings). `signWalkin`.
- Money: the gym account pays everything (a fighter's `money` is bound to it, not saved); the coach keeps 15% of purses (`GYM_CUT`); reputation grows with wins (`REP_WIN`). Gym levels reuse `GYMS` (training mult, cutman) with `GYM_LV` (cost, cap, upkeep).
- The career code runs a gym fighter through `fv(G, P)` (a view with player/world/week/pending), so offers, fights, corner talk, results all work unchanged. Stablemates are ranked but never matched.
- P4P stars: `P4P_2026`, `genStar`, `ensureStars`: #1 in their division with belts, don't fade, beating one unlocks his style.
- Test: `node tests/gym.js 3` runs a gym for 3 years headless.

Not yet: combo book / mitts, sparring, signature moves and habits, weight moves for gym fighters, releasing a fighter, retirement, multiple fights in one week.

Sources (style research): ringmagazine.com (Stevenson vs Zepeda analysis), evolve-mma.com (Lomachenko breakdown), bloodyelbow.com (Benavidez vs Andrade breakdown), reviews of Fight Night Champion Legacy mode (training, fatigue).
