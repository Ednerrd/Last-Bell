# Skillr Boxing: notes for the brain

Source: Skillr Boxing (YouTube, ~346K subs, technique explainers and fighter breakdowns). Our own notes in our own words. Raw transcripts are not kept. Ed pastes the transcripts.
Same warning as every edited breakdown: the clips show the trick working, never how often it fails. Good for *how*, not *how often*.
Ed's shortlist (Oct 20), in order: anticipating an attack, the clinch + dirty boxing, guards explained, the 4 elements of rhythm, the real boxing styles. Then Four Kings, breaking the Philly shell, counterpunches, Inoue film study, setting up KOs.

# Batch 1 (Oct 20): anticipation + the clinch

## 1. Anticipating an attack (defense set up before the punch comes)
Their split: some punches are defended by reading and reacting, and many more by habits that already have you safe before he throws. Six habits:
- **Free hand up while you punch.** Single shots especially. If you both throw at once, the guard eats his. Their example: Haney's right hand dropped on every jab, and that's where Garcia's left hook landed.
  - Have: novices' hands come back late (`brain.mast.late`, the L2 damage bonus `L.late`) and the miss leaves him off balance (`offT`).
  - Missing: a man-specific *habit* (one hand drops on one punch, every time). That's a flaw/trait, not a level. Ties to f3 flaws (`BR.flaw`) and the traits pass.
- **Move to his weak side** (away from his power hand). Opposite stance: lead foot outside his lead foot, then pivot out. Same stance: the little shuffle to your rear-hand side, which is his lead-hand side. His right hand then isn't lined up with your head and he overreaches to find it.
  - Have: a `circle` trait, but no sense of *which way*.
  - Idea: the circle picks a side, away from his power hand, smarter = more often. Lands vs his rear hand drop a bit. This is a big stance thing, so check it with familiarity (L3) and stance work.
- **Roll after your own right hand.** Even when it lands and he answers nothing: a habit that kills the counter before it starts. A miss leaves you most open.
  - Have: roll is a *defense* (`roll` in the defense mix).
  - Idea: a "cover after the 2" chance by level; the counter-puncher's counter on a missed right hand loses some of its bite against him.
- **Head off the center line when you jab or throw the straight.** If both throw straight at once, the man whose head is off the line doesn't get hit.
  - Idea: on a trade of straights (both in flight), the one with the better slip/IQ wins it more. Check how we resolve a simultaneous exchange today before adding anything.
- **Head always moving.** Even before he attacks. It doesn't just avoid shots: the other man gets gun-shy and throws less.
  - Have: slip skill and the peekaboo guard; nothing on his *output* dropping because of it.
  - Idea: lower opponent output vs a high-slip mover in the feel-out (small, level-gated). Risk: it stacks with the counter style's edge, so sim it.
- **Step out after your combo.** Bivol: finish the combo, take a step back, and he's not there for the reply. The other man is still covering up, so he's late anyway.
  - Have: `stepOut` for outboxers (`STYLE_OUT`).
  - Idea: let any level-up boxer do it after a combo (more for outboxers), not only as a range move. Cost: you give up your ground and the follow-up.

Their line: **anticipate the attack, don't wait for it.** That's what reacting vs reading means for our skill levels: a novice reacts; a World-class man is already safe.

## 2. The clinch, three stages
### Why clinch
- **Breather**: pause button when he's overwhelming you. Have: stamina comes back for both in a clinch (`updateClinch`).
- **Kill his offense and rhythm**: also kills his counters.
- **Get the center back**: pinned on the ropes, clinch, and as the ref splits you, step around him to the middle. Have: the ref pulls both toward the middle on the break. Missing: the man who was on the ropes ending up *better off* than the other guy.
- **Sneak shots**: a short uppercut right as it breaks, short shots in close against a man who doesn't fight well inside (Ward). Have: dirty shots for spoilers only (`dirtyShot`, `STYLE_SPOIL`).

### Getting there (stage 1)
- The walk in is the danger: you cross his range to grab him. Cover the entry: a feint or a punch, or a defensive move (level change, high guard), and best both: jab, dip, quick step in.
- Two grips: arms wrapped over a high guard (weak, he breaks it by framing with a forearm or pushing off) or a body lock under a missed lead (strong, lets you turn him for an angle).
- From a high guard and square stance: the "breaststroke": go between his gloves, wrap both arms over and pin them, head over his shoulder.
- Have: `m.clinch && d < 50` starts it, no entry cost. Idea: getting to the clinch costs exposure, smart men set it up. A tie-up from range should eat a shot sometimes; from a dip or after a jab, less.

### Inside it (stage 2)
- Never 100% safe: one eye on chances, one on threats.
- Arms inside (covered, better for punching) vs outside (easier to turn him). Depends on the spot.
- **Size decides the game.** Taller man plays high: hang over him, push down, lift him off his base, drains the short man and kills his inside game. Shorter man stays low: more stable, controls the head; a man whose head is pushed off his axis can't punch with power.
- Have: both get the same breather, the same reset. Leaning on him drains him only for grab/spoil styles (`STYLE_GRAB.lean`). Ties to the CLIPS_WANTED gap "leaning on a man to tire him" and the tall-vs-short item.
- Idea: in a clinch, the bigger man drains the smaller one (lean), the smaller one gets the dirty-shot chance. Height/reach decide who.

### Getting out (stage 3)
- One arm tied: frame with the free one. Both tied: drop low, make space, use the head to push off. Loma is quick at it.
- **The break is a danger zone.** Leave it covered. If he walks out of it careless and the ref hasn't called break, hit him.
- Have: both get the same `resetT` 1.2 and a clean split.
- Idea: a break-shot chance for the smarter / dirtier man vs a careless one (lower IQ, tired). The ref's `dirty` dial decides whether it's a warning. This makes the refs matter more.

## What's new for us (each one an engine check first)
1. Clinch entry costs exposure, set up = cheaper. (`startClinch` call sites, `m.clinch`)
2. Size decides the clinch: the lean drains the smaller man, the dirty shot goes to the shorter man. (`updateClinch`, `STYLE_GRAB`)
3. The break is live: a sneak shot vs a careless man, the ref's `dirty` dial. (`updateClinch` break, `dirtyShot`, `REFS.dirty`)
4. Circle to his weak side: the `circle` trait gets a direction. (brain footwork, stance)
5. Defensive habits by level: free hand up, roll after the 2, step out after the combo. The missing ones become flaws for the traits pass (`BR.flaw`). (`mast.late`, `stepOut`)
6. Head movement makes him gun-shy (his output drops). Sim it; it may stack with the counter style's edge.
