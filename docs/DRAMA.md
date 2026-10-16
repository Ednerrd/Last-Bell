# Drama doc (Oct 15; Ed's answers in "Decided" at the bottom)

What a fight should feel like, round to round, and what makes the coach lean in. The engine decides who wins; this doc decides whether watching it is worth it. It came out of the outside review (Oct 15): the mechanics exist, but most of them don't do drama work yet.

## 1. The shape of a fight
A good 10-rounder has a story, not ten copies of the same round.
- **Feel-out (R1–2):** jabs, reads, nobody commits. The coach learns what the other man has.
- **Escalation (R3–6):** someone finds something (the right hand over the jab, the body). The other corner answers.
- **Crisis (R7–9):** the tank, a cut, a knockdown, a man behind on the cards who has to go. Rounds get stolen in the last 30 s.
- **Resolution (R10 or the stoppage):** the finish, the late rally, or the cards.

Most of this is already in the brain (feel-out, gas pacing, late desperation, steal the round). What's missing is checking that fights really *have* the shape, and not just on average.

## 2. Moments that make you lean in
Ranked by how often they should happen in a 10-rounder between close fighters:
1. **A momentum swing:** the man losing the early rounds finds something and takes over. Target: a lead change on the cards in ~1 fight in 3.
2. **Hurt, and the decision:** he's hurt, he has to survive or fire back; the other man has to check or commit. (Hurt brain and the finish: built.)
3. **The knockdown and the count:** does he beat it, and can he last the round? (Built; same-round stop after a KD ~29–35%.)
4. **A cut:** the doctor looks at it, the cutman works on it, the clock is now against him. (Cuts and the doctor: built. The race against the clock isn't surfaced.)
5. **The close card:** a split or majority decision, a 95-95 that could go either way. (Built; ~10% of decisions.)
6. **The coach was right:** "he's tired, pressure him" and the round goes his way. (Not surfaced: nothing tells the coach his call worked.)

## 3. Characters, not functions
Each of these exists as a mechanic. The step is giving them a face and a reputation the coach can learn and plan around.
- **The referee.** Today: breaks clinches, warns for holding and hitting, takes points, stops fights (the same thresholds for every ref). Make it: each ref has a name and two dials, how early he stops a fight and how much holding he allows. A "quick hook" ref changes how you coach a man who's hurt; a "let them fight" ref rewards the spoiler less. Shown before the fight.
- **The judges.** Today: each gets a random lean per fight (noise). Make it: named judges with a fixed taste (likes pressure, likes clean punching, likes the champion / the house fighter). The coach sees the panel and can coach to it ("this judge loves aggression, get busy late").
- **The crowd.** Today: excitement spikes on big shots and fades. Make it: a mood across the whole fight (who they're behind, bored by a stinker, booing excess clinching, roaring the late rally). Look and sound only (Ed, Oct 15): the crowd never changes how the fighters fight.
  - **Booing a stinker (Ed, Oct 15):** a slow, boring fight (low output, lots of clinching, two counter-punchers staring at each other) and the crowd starts booing. Builds over a dead round, the commentary picks it up ("the crowd wants some action"), and a big exchange flips it to a roar. Look and sound only: the boos don't change the fighters. The "dead rounds" metric in section 6 is the trigger.
- **The clinch.** Today: a hurt answer and a spoiler trick. Make it: a pacing device a tired or hurt man uses to steal 10–20 s, the ref breaking it, the crowd booing too much of it. The coach can call "tie him up" when his man is hurt.
- **The other corner.** Since Oct 16 the AI corner reads the fight and yells live (+3.6 over a silent corner, `tests/corner.js`). Make it: a rival trainer with a known style (aggressive, cautious, adjusts fast). Being out-coached should feel like something.

## 4. What the coach does, and how he knows it mattered
- **Information:** a live read line ("he drops his right when he jabs", "he's breathing hard") so a shout is a decision, not a guess. Better scouting and a smarter corner make better reads.
- **Calls that show:** a shout should visibly change what the man does within a few seconds.
- **Feedback:** the corner screen tells you if the plan worked ("Pressure: you won the round 10-9, he landed 12 power shots to 6").
- **Weight:** coaching matters most in close fights, least in mismatches. A great coach with a weaker fighter still usually loses. Oct 15 (before the AI corner yelled): a good coach ~+3.5 pts, a bad one ~-5.5 pts (mirrors); re-measure with `tests/corner.js`.

## 5. Stakes
A tune-up and a title fight should not feel the same: the walkout, the commentary, the crowd size, the ref and judges assigned, maybe nerves for a man who's never been there. This lands with the career mode; the fight screen needs a hook for it now (a `stakes` field the commentary and crowd can read).

## 6. How we measure drama (sims, like everything else)
New lines in the audit, with targets to agree on:
- **Lead changes** on the cards per fight (target ~1 in 3 fights has one).
- **Rounds-won spread:** how many decisions are 7-3 or closer vs 10-0 shutouts.
- **Comebacks:** the man behind after 6 rounds wins (target ~15–20%).
- **Rounds with a "moment"** (KD, hurt spell, cut check, big swing): how many of 10.
- **Dead rounds:** low output, nothing landing clean, no swing (keep few).

**Measured (Oct 16, `tests/drama.js`, 2000 ten-rounders, audit field; "close" = the 500 gap-0 fights; hash d9fe6759):**
| | all | close |
|---|---|---|
| fights with a lead change on the cards (2+) | 31.2% (10.5) | 34.8% (10.8); first run 38.8 |
| a lead change in the last 3 rounds | 6.3% | 6.6% |
| the man behind at halfway wins | 7.9% | 11.0%; first run 13.9 |
| decisions: the winner lost 0 / 1 / 2 / 3+ rounds | 19.5 / 21.2 / 20.0 / 39.3% | 11.5 / 19.7 / 22.8 / 46.0% |
| rounds with a moment | 3.0 per 10 (hurt 3895, kd 1346, stop 549, cut 470, doctor/RTD 97) | 3.0 per 10 |
| dead rounds (no moment, both men under 80 thrown and 8 clean power) | 1.4% | 1.2% |
Per round, both men: thrown 76 / 89 / 103 / 115 / 125 (10/25/50/75/90%), clean power landed 9 / 13 / 18 / 25 / 32.
Read: the swings are there (1 in 3), the late drama is thin (few late lead changes, comebacks ~11% in close fights), and a stinker almost never happens: even the slowest rounds are busy.

## 7. How it feeds L4 learning
What a fight felt like decides what a fighter takes from it: a man who got dropped and came back learns something different from one who coasted; a loss to a pressure fighter teaches him about pressure. The moments in section 2 are the natural "lessons" L4 should record.

## The officials (Ed, Oct 16: funny, fully made-up names)
Fictional characters. Each is a familiar *type* fans know (the quick-hook ref, the judge who loves the busy man), but no name and no note points at a real official. Keep it that way when adding more.

**Judges** (each has a fixed taste; the panel is shown before the fight):
| Name | Taste |
|---|---|
| Wanda Wideman | Wide, hard-to-explain cards; loves the busier man even when he misses |
| Walt Levelhead | Steady veteran, scores clean punching, rarely an outlier |
| Priya Tallyworth | Counts everything: clean punches and effective defense |
| Monty Command | Ring generalship, likes the man dictating where it happens |
| Rocco Forward | Rewards aggression and the man coming forward |

**Referees** (two dials: how early he stops a fight, how much holding he allows):
| Name | Stops | Holding |
|---|---|---|
| Clarence Breakwell | On time | Breaks fast |
| Hank Lettum | Late (lets them fight) | Lets it go |
| Norma Rulebrook | On time | Strict, warns early |
| Teddy Quickhook | Early | Average |

## Decided (Ed, Oct 15)
1. **Refs and judges:** yes, named and shown before the fight. Oct 16: fully made-up funny names, types only, no real officials (table above).
2. **Crowd:** look and sound only (booing a stinker included). It never changes the fighters.
3. **Comeback target (Ed, Oct 16): ~11% (8–14%)** for close 10-rounders: the man behind at halfway wins. No published real-world figure exists; coin-flip rounds give ~12.7% (`research/comebacks.md`). Today's sim is on it. Late drama (lead changes in the last 3 rounds, ~7%) is the thin part: it should come from the crisis rounds, not more comebacks.
5. **Booing trigger (Oct 16):** relative dull, not truly dead (that's ~1%): boo the slowest ~5-10% of rounds against the usual pace, lots of clinching, no moment. It should show up in some fights, mostly counter-puncher mirrors. Look and sound only.
4. **Build order:** whatever flow makes sense. Plan: (a) drama metrics (done Oct 16: `tests/drama.js`, numbers in section 6) (lead changes, comebacks, dead rounds, rounds with a moment): cheap, measures what we have; (b) refs and judges as characters (engine: stoppage and holding dials, fixed judge tastes; the fight screen shows the panel); (c) crowd mood and booing (render and audio only: no sims needed beyond the same.js hash); (d) the coach feedback line on the corner screen.
