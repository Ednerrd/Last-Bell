# Last Bell: the game (what it is, before how)

Draft, Oct 9 2026. This is the "what", serving `VISION.md` (Ed's words, the source of truth). `FOUNDATION.md` is the "how" and comes after this.

Every aspect has three parts:
- **Idea:** the one-line point of it.
- **Known:** already decided by Ed or proven in v1.
- **Open:** your call.

---

## The pitch
**You're the coach, not the fighter.** You open a gym in your town, take in fighters, build them, and work their corner. The fights play out on their own in 3D, true to real 2026 boxing. You win with what you teach and what you say between rounds.

Influences: Fight Night Champion (look, damage, replays, Legacy mode), Thrill of the Fight (contact feel), Undisputed (real-world boxing), real fighters (Shakur, Loma, Benavidez, Inoue, Usyk, Canelo).

## The pillars (every feature has to serve one)
1. **Real boxing.** Styles, rules, numbers and the mind behave like the real sport. If a boxing fan would laugh at it, it's wrong.
2. **The fighter is a person.** Body, skills, habits, ego, age. No two fighters are the same, and a beginner fights *differently* from a champ, not just worse.
3. **The coach matters.** A good corner wins fights a bad corner loses. If the coach's input doesn't change results, the game has no point.
4. **Watchable on a phone.** You can leave it on, glance at it, and it looks and sounds like a real broadcast.

---

## 1. The core loop
- **Idea:** gym week → train → book → camp → fight night (you in the corner) → results → the gym grows.
- **Known:**
  - One weekly clock for the whole gym (v1 gym mode).
  - Camp is N weeks out from a booked fight.
  - Reputation grows with wins and belts, and better rep brings better walk-ins.
- **Open:**
  - How long a session is meant to be (one fight per sitting? a whole year?).
  - Whether you can sim a fight without watching it.

## 2. The fight
- **Idea:** a full sim of a real pro fight, watched live in 3D.
- **Known:**
  - Real rules: 10-point must, three judges, knockdowns and counts, the three-knockdown rule optional, cuts and the doctor, fouls, warnings, deductions.
  - The engine decides the outcome, and the render only shows it.
  - Numbers match CompuBox (~53 thrown, ~15 landed a round). Stoppages run ~25–30%.
  - Round shape: R1 is a feel-out, rounds get stolen in the last 30 s, gassers fade.
  - Contact comes in three grades: glancing, solid, flush.
- **Open:**
  - Fight speed: real time (3-minute rounds) or sped up? v1 runs sped up.
  - Do round counts vary (4, 6, 8, 10, 12) by career level?

## 3. The fighter
- **Idea:** body (born with it, built slowly) + skills (learned) + knowledge (styles and stances he's seen) + the person.
- **Known:**
  - Levels: Novice, Intermediate, Pro, Worldclass, built from mastery per skill.
  - The skill groups: offense, defense, ring craft, fight IQ.
  - Style is locked per fighter. Guard is fixed. Stance is picked.
  - Combo book: the combos he owns, each with a fluency.
  - Signature moves and habits (flaws).
  - The person: age (prime ~26–32), coachability, ego, heart, ambition.
  - He still tries a skill he doesn't own, and does it badly.
  - No level badge. A skill sheet shows a bar per skill, and level-ups show up as moments.
- **Open:**
  - The body/skills split. My proposal is in FOUNDATION section 4.
  - Can a habit be trained out? Can a signature be lost?

## 4. The brain (the AI boxer)
- **Idea:** Ed's words: "the ai boxer is the brain." He fights with intent, reads the other man, sets traps, adjusts, and panics when hurt.
- **Known:**
  - Intent modes: feel-out, work, press, burst, reset, counter, hunt, survive.
  - A memory of the other man's habits that fades over time.
  - Anticipation: elite defense is reading, not reflex.
  - Counters keyed to the defense he used.
  - Setups and traps.
  - The hurt brain: shell, run, fire back, clinch, freeze.
  - Adjusting between rounds, where low adjusters wait too long.
  - Fatigue and damage blur the read.
  - Every one of these reads a skill.
  - Fighter DNA cards for 14 real fighters, plus mind profiles for 21, are already in `research/`.
- **Open:** nothing big. This is the most researched part of the game.

## 5. You, the coach
- **Idea:** you're his corner, his trainer and his manager.
- **Known:**
  - **Between rounds:** round notes on what's happening, then you talk (text or voice), and the corner can teach a lesson.
  - **In the round:** shouts as levers: double the jab, go to the body, cut the ring, tie him up, steal the round, go get him.
  - **Listening:** whether he hears you depends on his "takes corner advice" skill and his ego. A pro pushes back.
  - **Cutman:** works on the cut, the swelling or the breathing.
  - **Scouting:** you pay to see the other man's numbers.
- **Open:**
  - **Bond and trust:** good calls build trust, and a fighter with low trust argues back or leaves. Parked in v1. In or out for v2?
  - **Corner moods:** "fire him up", "calm him down", "tell him the truth".
  - **Free-text shouts** during the round.

## 6. The gym
- **Idea:** your gym is the save file. It grows from a back room into a name.
- **Known:**
  - A stable of 3–5 fighters, with the cap set by gym level.
  - Walk-ins every few weeks, by tier: raw kid (you build him), journeyman, faded vet, ranked pro looking for a new trainer.
  - **Training per fighter, per week:**
    - mitts (teach or sharpen a combo)
    - heavy bag
    - roadwork
    - defense drills
    - sparring
    - rest
  - Overtraining means he shows up tired.
  - **Money:** purses, with the coach keeping 15%. Gym upkeep. Gym levels.
- **Open:**
  - **Sparring:** v1 said not for now. In v2, is it in from the start (stablemates, visiting pros, rival gyms)?
  - **Locations:** a second gym? other cities?
  - **Staff:** assistant trainers, a cutman you hire, a strength coach?
  - **Releasing fighters, retirement, a fighter leaving you.**

## 7. The world
- **Idea:** a living boxing world that moves on whether or not your guys fight.
- **Known:**
  - Weight classes, each with its own rankings and belts.
  - The world sims every couple of weeks.
  - Real 2026 P4P stars under slightly changed names.
  - One fictional legend per division: beat him and you unlock his style.
  - Fight offers with purses.
  - Tale of the tape and resumes.
- **Open:**
  - **Promoters and politics:** ducking, mandatories, four sanctioning bodies, rematch clauses.
  - **Rival gyms and rival coaches.**
  - **Amateurs** before the pros (Olympics?).
  - **Media and hype:** press, callouts, trash talk.

## 8. Time and legacy
- **Idea:** careers rise and end. Your gym's history is the long game.
- **Known:**
  - Age curve: young men learn fast, old men know more and recover less.
  - Fade with age.
- **Open:**
  - Retirement, comebacks, a hall of fame.
  - A gym legacy score.
  - Generations: your old champ becomes your assistant trainer?

## 9. The show (presentation)
- **Idea:** it should look and sound like a real fight broadcast, on a phone.
- **Known:**
  - 3D is the main goal, targeting the S25 Ultra at 60 fps, with a 30 fps saver.
  - Gritty lighting.
  - Venue tiers: back-room gym → union hall → civic arena → coliseum → Vegas.
  - Damage builds on the face over rounds.
  - Sweat and blood (with a gore setting).
  - Slow-mo knockdown replays from several angles.
  - The corner scene between rounds.
  - Commentary that calls what's happening, including the bad technique.
  - Fighters drawn by build and weight class.
- **Open:**
  - **Walkouts and ring announcer.**
  - **Sound:** crowd, punches, the bell, the commentator's voice?
  - **Camera:** a TV broadcast camera only, or free look?

## 10. Platform
- **Idea:** a phone-first web game, published as one file.
- **Known:**
  - Published as a claude.ai artifact, with cloud saves.
  - Corner talk runs on Claude when it's available, with a keyword fallback.
  - It's an idle sim, so it has to run cool.
- **Open:** offline? sharing a fight or a replay clip?

---

## What makes Last Bell different (from Fight Night, Undisputed, the rest)
1. **You never throw a punch.** Every other boxing game makes you the fighter.
2. **Beginners fight different, not just worse.** Bad technique is real, readable and funny.
3. **The AI actually thinks:** habits, reads, traps, adjustments.
4. **Your words in the corner change the fight.**

---

## Ed: go through the Open items
One word each is fine: **in, out, later.** The answers lock the scope for FOUNDATION's build order.
