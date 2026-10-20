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

# Batch 2 (Oct 20): guards, rhythm, the real styles

## 3. All the guards (cross, high, Philly, low, long)
How each one defends, attacks, and where it leaks, by their read:
- **Cross guard** (Moore, Frazier, Norton, late Foreman, Holyfield): one or both forearms across the face, crouched, weight on the front foot, so the covered head is closer than the open body. Straights: easy, no guessing. Hooks: an elbow up stops them at some ranges, but they wrap around to the side of the head. **Uppercuts: the riskiest shot to defend from it**, they come up through the middle. Body: wide open, and the time to drop the arms is too long against a set-up shot. Offense: mostly counters (catch and hook back, turn and load the cross). Good for short pressure spells.
- **High guard**: the most common and one of the safest. Close the gloves for straights, open them for hooks, small shifts up and down for head and body. The most offense of any guard (square, rear hand closer). Costs: a bigger target, narrower vision, more static.
- **Philly shell**: bladed, lead arm across the belly, chin behind the shoulder. Body covered, head open. Jab: catch or parry. Right hand: shoulder roll. Lead hook: rear hand or bend. Rear hook: pull back or bend. **Uppercuts mostly don't work against it** (bladed). Offense: lead hand, jab and hook, counters off the roll; the rear hand is far, so less of it. "Unsafe": miss the timing on the roll and it's clean.
- **Low guard**: the riskiest, least advised. Head defense is all head movement and rolling the shoulder. Pros: hands out of his eyeline, so the jab comes from nowhere; loose whipping shots. "The cons win almost every time."
- **Long guard**: lead hand out to post, rear hand at the chin, bladed. The outside man's guard: the extended lead parries and jams his rear hand, steps back from body shots while posting. Most lead-hand control (measure, blind, pin his guard). Costs: tiring arm, and the body on that side is open.

Checked against `GUARDS` (`gf()`: over 1 = better at stopping that punch):
- **Two conflicts.**
  - Cross: ours is the *best* vs uppercuts (`up` 1.45, and the only guard that can block an uppercut at all, the `D.guard === 'cross'` check in the block roll). Skillr says it's the *worst*.
  - Philly: ours leaks uppercuts (`up` .85). Skillr says uppercuts barely work on it.
  - Our cross desc ("built for head shots and uppercuts") follows the Moore version (lead forearm low, across the ribs). The Foreman/Frazier version is the one with the gap up the middle. One source says each way: get a second source before touching numbers (guard numbers move the guard balance, 47.7–55.8).
- **Agrees**: low guard (`handslow`: head .75, eats more, huge evade); Philly hooks (.8); high guard covers the head, ctr .85.
- **Mixed**: high guard body. Ours is open (.8), Skillr says both partly covered. Precision said open. Leave it.
- **Missing**: the long guard. A natural fit for the outboxer (`STYLE_GUARDS`): lead hand jams his rear hand, body open on the lead side, gas cost for the arm. A 7th guard is a balance job (300+ per guard).

## 4. Rhythm: pulse, tempo, meter, notes and rests
- **Every fighter has a rhythm**: some keep a steady pace (always in your face), some fight in spurts (wait, then explode; Tank). Read his rhythm and you can predict him.
- **Fight in yours, not his.** A spurt fighter dragged into a steady pace is uncomfortable. Don't try to out-fast a faster man or out-wait a patient one: make him fight your way.
- **Tempo**: change speed suddenly. Slow, slow, then a burst. Hopkins walks away slowly, then comes in fast.
- **Meter**: weak and strong beats inside a combo. Two throwaway shots, then two hard ones. The soft ones set up the real ones.
- **Notes and rests**: the same 1-2-3 thrown three ways: no pause, a pause after the 1, a pause before the 3. He expects one cadence and gets another. The out-of-rhythm 1-2 (long gap before the 2).
- **Breaking rhythm** = set a pattern, then break it. Rock the weight front-back and jab *in the middle* of the shift. Same punch at the same beat, then a different one. Or read *his* pattern and hit the gap (that's timing, their next video).

Checked against the brain:
- Have: spurts vs steady mostly comes out of the modes (`burst`, `reset`, `work`; `output`, `patience`); the hitch (a pause inside the combo) is already an idea in `precision.md` #3.
- New:
  - **Fight your own rhythm**: nothing in the brain *minds* being dragged off its pace. Idea: a man pushed off his natural tempo (a spurt man made to work, a steady man made to wait) loses a little: gas or accuracy. Pairs with the drama work (who controls the fight).
  - **Meter**: a combo's weak shots (lighter, faster, to blind or set up) and strong ones. Today every punch in a combo is thrown the same. Idea: tag throwaway punches, less damage, more blinding, and the strong one lands more after it.
  - **The read**: the brain already remembers his patterns (`mem`). Idea: a man who's learned his cadence gets a small timing edge on his next combo.

## 5. The real styles: 3 axes, 8 archetypes
Their fix for "Floyd is four styles at once": three yes/no questions.
1. **Ring movement**: forward (pressure) or backward (outboxer).
2. **Punching style**: clean single shots (sniper) or as many as possible (volume).
3. **Attack dynamic**: leads the exchanges (starter) or waits to catch him (counter).

The 8, with their examples where the clip gave one:
- **Out / sniper / counter**: great lateral feet, calm under pressure, fights in spurts, makes you chase, then the clean counter. "Boring" to casuals.
- **Out / sniper / starter**: ring general, feints a lot, singles and short bursts, the jab is the main punch, ties you up when he's not the one attacking (Lewis).
- **Pressure / sniper / counter**: walks in behind a high guard or bob-and-weave, throws little, wants the one perfect shot, catches you as you try to back him up.
- **Pressure / sniper / starter**: long reach, heavy hands, pushes you back with power, not feet. "One power shot at a time."
- **Out / volume / starter**: moves and throws all night, huge gas tank (many Soviets).
- **Out / volume / counter**: loose snappy shots off a low guard to keep you out *and* bait you, then a sudden hard counter (Martinez).
- **Pressure / volume / starter**: forward and relentless, steady pace, breaks you down slowly.
- **Pressure / volume / counter**: forward volume with tight defense, the volume baits you, then the counter.
- Most real fighters are neutral on one or two axes (Floyd starts with the jab and counters too).

Checked against the brain: **we already have the three axes as traits** (`range`: forward/back, `output`: volume/sniper, `initiative`: starter/counter in `brain/brain.js` `STYLES.t`). Our 5 styles sit at:
- outboxer: out / sniper-ish / starter.
- slugger: pressure / sniper / starter.
- swarmer: pressure / volume / starter.
- counter: out / sniper / counter.
- boxerpuncher: the middle.

The empty corners: **pressure-counter** (both kinds), **out-volume** (Soviet / Loma; the `volume` special is closest), **out-volume-counter** (Martinez). Idea for the traits pass: let a fighter's style be three dials (plus guard), not one of 5 presets, so a Floyd or a Canelo can be built. Check that the brain's modes read those three traits cleanly before trusting it.

## What's new from batch 2 (each one an engine check first)
7. Cross vs Philly uppercut conflict: second source, then maybe flip `up` (a guard balance run).
8. A long guard for the outboxer (balance job).
9. Off his own rhythm: a cost for the man dragged off his natural tempo.
10. Weak and strong beats in a combo (throwaway shots that set up the hard one).
11. Style = 3 dials (range, output, initiative) for the traits pass; fill the empty corners.
