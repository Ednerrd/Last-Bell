# Drama doc (DRAFT, Oct 15: Ed approves before L4 design)

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
- **The crowd.** Today: excitement spikes on big shots and fades. Make it: a mood across the whole fight (who they're behind, bored by a stinker, booing excess clinching, roaring the late rally). A quiet crowd and a hostile road crowd can nudge composure and confidence (small).
- **The clinch.** Today: a hurt answer and a spoiler trick. Make it: a pacing device a tired or hurt man uses to steal 10–20 s, the ref breaking it, the crowd booing too much of it. The coach can call "tie him up" when his man is hurt.
- **The other corner.** Today: the AI corner picks a plan with no read of the fight (only ~3 pts over a silent corner). Make it: a rival trainer with a known style (aggressive, cautious, adjusts fast). Being out-coached should feel like something.

## 4. What the coach does, and how he knows it mattered
- **Information:** a live read line ("he drops his right when he jabs", "he's breathing hard") so a shout is a decision, not a guess. Better scouting and a smarter corner make better reads.
- **Calls that show:** a shout should visibly change what the man does within a few seconds.
- **Feedback:** the corner screen tells you if the plan worked ("Pressure: you won the round 10-9, he landed 12 power shots to 6").
- **Weight:** coaching matters most in close fights, least in mismatches. A great coach with a weaker fighter still usually loses. Today: a good coach ~+3.5 pts, a bad one ~-5.5 pts (mirrors).

## 5. Stakes
A tune-up and a title fight should not feel the same: the walkout, the commentary, the crowd size, the ref and judges assigned, maybe nerves for a man who's never been there. This lands with the career mode; the fight screen needs a hook for it now (a `stakes` field the commentary and crowd can read).

## 6. How we measure drama (sims, like everything else)
New lines in the audit, with targets to agree on:
- **Lead changes** on the cards per fight (target ~1 in 3 fights has one).
- **Rounds-won spread:** how many decisions are 7-3 or closer vs 10-0 shutouts.
- **Comebacks:** the man behind after 6 rounds wins (target ~15–20%).
- **Rounds with a "moment"** (KD, hurt spell, cut check, big swing): how many of 10.
- **Dead rounds:** low output, nothing landing clean, no swing (keep few).

## 7. How it feeds L4 learning
What a fight felt like decides what a fighter takes from it: a man who got dropped and came back learns something different from one who coasted; a loss to a pressure fighter teaches him about pressure. The moments in section 2 are the natural "lessons" L4 should record.

## Open questions for Ed
1. Refs and judges with names and reputations: yes? Shown before the fight?
2. Crowd affects the fighters (small composure nudges), or only the look and sound?
3. Comeback target: ~15–20% of fights won by the man behind after 6. Right feel?
4. Build order: the drama metrics in the audit first (cheap, measures what we have), then refs/judges, then the crowd mood?
