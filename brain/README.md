# The boxer brain (`brain/`)

The AI inside a boxer's head, built on its own so any game (2D canvas, the 3D prototype, whatever's next) can plug it in. The game says what's true on screen. The brain's eyes, nerves and gas tank add the human error.

- `brain.js`: the brain. No DOM, no canvas, no engine globals. Works in Node (`require`) and the browser (`window.BoxerBrain`).
- `ring.js`: a dummy ring. Two boxers on a line between the ropes, real punch timing, simple hit math, 10-point must. It knows nothing about thinking: it builds perception, calls `think()`, and applies the answer. Use it as the reference for wiring a real game.
- `tests/`: headless sims (below).
- `inline.js`: copies `brain.js` into `index.html` (the engine runs it behind `AI.brain`). `--check` verifies the copy.
- `lab.src.html` + `build-lab.js`: the brain lab, a side-view viewer that runs both files live in the browser (https://claude.ai/artifact/5UhTsjMSCTqhtRnCfdZBSV). `node brain/build-lab.js` writes `lab.html` (build output, not tracked).

## Plugging it in

```js
const B = BoxerBrain;                       // or require('./brain/brain.js')
const prof = B.makeProfile({ style: 'counter', tier: 'pro', seed: 7 });   // a unique fighter
const brain = B.create(prof, { rng: B.mulberry32(42), debug: true });     // rng optional (Math.random)
// pace: a game whose rounds run faster than the clock (Last Bell's engine: 3) squeezes moods, memory, intent modes and keeps the work rate per round
brain.roundStart(1);
// every frame:
const act = brain.think(perception, dt);
// between rounds:
const note = brain.rest({ round });          // { thinks: 1|0|-1, lead, change: 'more body' | null }
```

### Profile (who he is)
`makeProfile({ style, tier, seed, name, traits, skills, stats, uniq })` gives `{ name, style, tier, traits, skills, stats }`.
- **Skills** (0–100, how WELL): offense `jab power combos body feints`, defense `block slip footwork clinch`, ring craft `cutoff ropes range angles`, fight IQ `counter read pacing adjust`. The tier is read off their average.
- **Tiers:** Novice, Intermediate, Pro, World class (Ed, Oct 7).
- **Traits** (0–1, how he LIKES to fight): `output jab power body combo` (punch diet), `initiative patience` (leads or counters), `shell slip legs clinch` (defense habit), `composure risk killer` (nerve), `range circle` (where he lives).
- **Styles** are trait presets plus a skill lean: `outboxer slugger swarmer counter boxerpuncher`. Every fighter gets his own jitter on top (`uniq`, default 1), so no two are the same.
- **Stats** are the body (power, speed, chin, body, stamina, recovery, heart, legs). The brain never reads them; the game does.

### Perception (what the game passes each frame)
```js
{
  t, clock, roundLen, round, rounds,          // fight time and round clock (s)
  dist,                                       // between them, engine units (a jab reaches 78)
  ropes: { me, him },                         // 0 open ring .. 1 back on the ropes
  me:  { head, headMax, stam, stamMax, hurt, down, clinch, punching, busy },
  him: { punch: null | { id, type, t, impactIn, feint, sell, tell },   // the truth; the brain decides how fast and how well it sees it
         recover, lastRes, guard, gas, hurt, head },
  events: [ { type: 'landed'|'blocked'|'evaded'|'missed'|'feinted'|'kd', by: 'me'|'him', p, def, dmg, counter, hurt, bit } ]
}
```
Passing the truth is on purpose: reaction time, misreads and feint bites live in the brain, so every game gets the same human.

### Action (what comes back)
```js
{
  intent: 'feelout'|'work'|'press'|'burst'|'reset'|'counter'|'hunt'|'survive'|'down',
  move:   { range, lateral, cut, clinch, feet },     // wanted distance, circling (-1..1), cutting the ring off (0..1), wants to tie up, footwork quality
  guard:  0..1,                                      // how high and tight the hands are right now
  punch:  null | { type, combo: ['jab','cross'], num: '1-2', feint, sell, tech: [..], tell, commit, counter, why },
  defend: null | { kind: 'block'|'slip'|'duck'|'pull'|'roll', zone, vs, quality },
  why                                                 // the reason for the last punch: 'counter after slip', 'setup: jab-jab-right', ...
}
```
- `tech` per punch (0–1): how well it's thrown. Low = arm punch, off balance. The game scales land chance and damage by it.
- `tell` (0–1): how much he shows it coming (low skill, loading up). The game adds wind-up time; the other brain sees it sooner.
- `commit`: how much he sits down on it (more damage, more gas).
- `debug: true` keeps a readable log in `brain.log` ("defends slip vs jab (it was a hook)", "-> survive (hurt: clinch)"). Commentary hooks for free.

## What's inside
- **Intent modes** that last seconds: feel-out, work, press, burst, reset, wait-to-counter, hunt (he's hurt), survive (I'm hurt). Traits, the cards, gas, fear and openings push the transitions.
- **When to throw / when not to:** a work rate from his nature, openings (he just missed, on the ropes, hurt, gassed, hands down), and brakes (I keep getting countered, I'm gassed and smart enough to pace, I'm scared, he's punching).
- **What to throw:** a 33-combo book in trainers' numbers, weighed by his diet, what's been landing on this man, what his defense leaves open, mode, the cards, and variety (a smart man doesn't show the same thing three times).
- **Setups:** jab-jab-right, body then head when the hands drop, feint to draw the slip then hook where he went, "show it twice, change it."
- **The eyes:** reaction time 0.34 s (Novice) to 0.14 s (World class), slower tired, scared or hurt. Habits he's read get seen sooner. Misreads, being fooled by a habit change, biting on feints (a reader stops buying them).
- **Counters** keyed to the defense that worked (slip the straight, right hand over it; duck the hook, come up with one).
- **Memory** of the other man that fades: what he throws, what he leads with, what follows what, how he defends each punch, what hurt me.
- **Emotion:** confidence, frustration (wild, worse picks), fear (less output, more defense). Composure decides how much they move him.
- **Hurt brain:** clinch, shell, run, fire back, or freeze, by composure and habits.
- **Round awareness:** his own guess at the cards (fuzzy for a low pacing skill), steal the last 30 s, protect a lead, a first-round feel-out.
- **Between rounds:** a good adjuster changes one thing when he thinks he lost (more of what works, less of what gets countered, stop leading, change range). A poor one waits too long.

## Tests (run from the repo root)
- `node brain/tests/audit.js 300 [tier]`: CompuBox audit of the dummy ring.
- `node brain/tests/tiers.js 150 [adj]`: tier ladder with identical stats, plus how each tier's brain behaves (reaction, late, misreads, setups, counters, technique).
- `node brain/tests/styles.js 100 [tier]`: style fingerprints (output, jab/power/body share, counters, distance, modes) and a round robin.
- `node brain/tests/human.js 60`: adaptation (a 1-2 habit man vs each tier, with a no-habit control) and variety (the same two men, many fights).
- Knob overrides without editing: `BRP='{throwP:.06}'` (brain `BR`), `RSP='{dmg:.5}'` (ring `RS`).
