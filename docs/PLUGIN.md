# The plug-in brain (ROADMAP 1, design Oct 17)

Ed (Oct 16): the smartest boxing AI out there. One brain you plug into any fighter, set to easy / hard / expert, and let it work. Fight Night's AI is beatable with the same trick all night; Thrill of the Fight's barely reads you. This one should read you, punish a pattern and never fall for the same cheese twice.

What already exists: `brain/brain.js` is standalone (no DOM, no engine globals, Node + browser). The contract is typed (Perception in, Action out, events through `hear`). `brain/ring.js` is a minimal host. `brain/README.md` covers the profile, the contract and what's inside. Skill levels (L1-L3) and learning (L4) give a per-man level, style and type familiarity, and memory across fights.

## 1. Difficulty presets (P2)
`BoxerBrain.preset(level, { style, seed })` returns a profile (and the recommended create opts):

| Preset | Skill center | What it means |
|---|---|---|
| easy | 56 (Intermediate) | telegraphs, reads late, adjusts rarely, short combos, gasses |
| hard | 74 (Pro) | the default game AI: reads habits in 2-3 rounds, setups and traps, paces |
| expert | 90 (World class) | reads in 1-2 rounds, punishes a habit, adjusts between rounds, fights the cards |

- No new knobs: a level is the skill sheet (`BR.lv` already scales reads, telegraphs, feints, combo length, adjusts, freezing). One level apart wins ~16-18% (`levels.js sk`), so easy vs hard vs expert are real steps.
- Expert also gets memory across fights in a session (L4c prior) when the host keeps a `memo()`.
- Measure: each preset vs a fixed "average player" (a Pro brain, no corner): easy ~15-20%, hard ~50%, expert ~80%.

### P2 ladder (Oct 18, `cheese.js 40 x4 [easy|hard|expert] none`, hash 4cdff551)
| Preset | wins vs a Pro (n160) | target | defends 1st look -> read | react s |
|---|---|---|---|---|
| easy | 21.7 ±3 | 15-20 | 46 -> 57% | .139 |
| hard | 54.0 ±4 | ~50 | 49 -> 63% | .124 |
| expert | 87.7 ±3 (85.7 pooled with 83.1 n120) | ~80 | 53 -> 69% | .106 |
All within a few points: real steps, no retune. Every level reads (defends better once he's seen it), none is psychic.

## 2. The anti-cheese test (P1, first: measure before building)
A "player" who repeats one exploit all fight, run on the Last Bell engine (the real host). A cheese is the brain with its offense or defense pinned to a script (a wrapped brain: everything else, events and gas included, stays real).

| Cheese | What the player does |
|---|---|
| jabSpam | jabs from the edge of range, nothing else |
| oneTwo | the same 1-2 every time |
| pullCounter | waits, pulls back from everything, fires the cross straight back |
| shell | covers up on the ropes, throws only when the other man stops (rope-a-dope) |
| bodyOnly | only to the body |
| haymaker | walks forward winging the right hand |
| runner | backs up and circles all night, jabs when cut off |
| clinch | ties up every time it gets close |

- Metrics, per cheese x preset (hard, expert): the brain's win %, and the cheese's share of landed punches in rounds 1-3 vs 8-10 (the brain should take the trick away as it reads it).
- Targets: expert wins 80%+ against every cheese, hard 65%+, and the cheese's landed share falls from early to late. A cheese that holds or climbs is a hole to fix (P3).

### P1 baseline (Oct 17, `cheese.js`, 160 fights per row, both sides rating 78, the cheese man a Pro)
| Cheese | hard wins | expert wins | cheese landed share R1-3 -> R8-10 (hard / expert) |
|---|---|---|---|
| none (control) | 52.3 | 84.1 | 50 -> 50 / 44 -> 36 |
| jabSpam | 89.2 | 97.4 | 54 -> 53 / 49 -> 48 |
| oneTwo | 77.0 | 93.0 | 51 -> 45 / 46 -> 36 |
| pullCounter | 99.4 | 100 | 16 -> 17 / 9 -> 10 |
| shell | 99.4 | 100 | 19 -> 23 / 11 -> 13 |
| **bodyOnly** | **6.3** | **19.1** | **59 -> 70 / 51 -> 58** |
| haymaker | 79.4 | 90.0 | 34 -> 32 / 30 -> 28 |
| runner | 100 | 100 | 31 -> 35 / 27 -> 31 |
| **clinch** | **55.4** | 83.7 | 50 -> 51 / 47 -> 46 |

- The control lands where the presets plan says: hard vs a Pro ~50%, expert ~84%.
- Most cheeses lose worse than playing straight (one trick is easy to read). The ones that climb late (shell, runner, pullCounter) climb from tiny shares and lose every fight anyway.
- **Hole 1, bodyOnly (big):** the brain's own picks, every punch moved to the body, beats a Pro brain 94% at hard and 81% at expert. Probe (hard, 30 fights): the cheese lands 18.1 a round vs 10.7 (straight: 14.9 vs 16.1), the brain throws 38.9 (straight 53), ends with his body meter at 11 (straight 78) and gas at .47, and goes down 1.27 times a fight (straight .13). Wins: 11 KO, 5 TKO, 11 UD. So the brain neither guards low when it's all body nor makes the man pay upstairs for bending in, and body damage then drains the gas and the legs. Part brain (P3: read the body habit, guard low, counter over the top), maybe part engine (body work that never gets punished may be too strong: check with the body tests before tuning).
- **Hole 2, clinch at hard (small):** 55% (target 65). Tying up every time costs the cheese nothing; the brain doesn't punish the way in (uppercuts, short shots, turning off). Expert passes.
- P3 done Oct 17 (below).

## 3. Fix what the cheese finds (P3)
Each hole is a brain change with sims before and after (the usual balance checks: styles, audit, levels, the hash moves on purpose).

### P3 body: first tries (Oct 17, `claude/plugin-body`, not shipped)
Baseline to hold (hash 1a66d14e): styles 48.1-51.5, specials 48.0-54.3, one level down wins 15.8-18.0, stops ~25-28%, body KDs 5-8% of KDs.

| Try | hard vs bodyOnly | stops (audit / finish) | body KDs | styles | specials | one level down | hash |
|---|---|---|---|---|---|---|---|
| dip .9/.5, lowEv 1 | 70% (expert 95%) | 39.9 / 39.3 | 2.3% | 43.7-56.5 | 44.3-54.3 | 13.3-20.3 | fe02b0a8 |
| dip .35/.3, lowEv 2 | 74% (n80) | 31.3 / 29.0 | 4.4% | 46.3-54.9 | 44.4-56.5 | 11.7-12.7 | 84d0bd78 |
| dip 0, norm .45, read x ring IQ | 60.5% | 26.1 / 26.3 | 4.3% | 46.9-52.6 | - | 13.0-17.7 | - |
| dip 0, norm .45, k .75 flat, lowLeak .35 | 56.5% | 25.0 / 25.7 | 4.2% | 47.1-52.2 | 47.4-54.3 | 18.0-19.3 | - |
| **dip 0, norm .6 (shipped on the branch)** | **51% (expert 73%)** | 27.1 / 26.2 | 4.0% | 47.4-52.9 | (as above) | 13.3-18.3 | 98938548 (same.js 40) |

- Both fail. Losers: swarmer, volume, body (they live downstairs more than .25 of the time, so the read and the dip hit them too); winners: counter, awkward, angle. The level gap widened (the read scales with ring IQ).
- Next try: dip 0 (`BODY.over=0`), and the read only for a real digger: `BR.body.norm` .25 -> ~.45 (a bodyOnly man sits at ~.95, so he's still read hard). Check bodyOnly first (cheese.js, 160), then the full check. If the level gap stays wide, take `k.read` out of the read's strength.

- **Shipped: norm .6.** The read fires only against a real digger: 17 reads in 20 normal fights, so normal balance is the old engine's (with the read off, same.js 40 is the old 63a19c0; on, the hash moves only by those few rolls). What's left off the baseline (out-boxer ~47, PvI 13.3, body KDs 4.0) is noise: the same runs with the read off land body KDs at 7.1%. bodyOnly: hard 6 -> 51%, expert 19 -> 73% (targets 65 / 80: short, but the trick no longer wins). A stronger read for a digger (lower norm) bled into swarmer, volume and the body special; any more needs the eyes (him.body in Perception: dig only when the body's really going).
- **Final P3 (Oct 17, check p3h, same.js 40 = 99ee5c3f):** body read on his whole-fight diet (`memT`, norm .5, min 20, k 1): no style crosses it (max ~.32, body special and volume), so with the read on or off normal fights hash the same. Clinch: holding's third warning costs a point for sure, Lettum warns at 12 clinches a round, and the brain's clinch read (`BR.cl`, norm 4) skips a hurt man holding on (fires in 8 of 40 normal fights, .14% of the time). hard vs bodyOnly 67%, vs clinch 71% (n160; were 6 and 55). Styles 48.8-51.4, specials 49.2-54.2, audit 51.2 / 15.2 / 29.7%, stops 26.1 (audit) / 26.2 (finish 1800), one level down 14.0-19.0.
- Body KDs (closed): 4.0% (1800) vs the old 5.8% (2400) looked real, but it's the stat's noise: with both reads off the engine hashes the same as the old one plus the ref change (635e67de), and two 1200-fight runs of that same engine gave 3.1% and 5.2%. Body KD share needs 3000+ fights per side to trust a 1-2 point gap. same.js 200 = b30af66c.
- Fair check (`cheese.js`, Oct 17): expert's mean reaction is ~.09 s (World's base .14; a read punch is seen up to 60% sooner, floor .04). Ed: smart, not psychic. Done Oct 18: `BR.reactMin` .1 (was .04): expert .106 s, defends 54% on first look -> 68% read, expert vs a Pro 83%; full check `rm` passes (styles 47.8-51.1, one level down 15.7-18.0, audit 51.1 / 15.1 / 29.5%, stops 25.5 / 29.2, body KDs 6.3%), hash 4cdff551.

### The eyes: read the whole fighter (Ed, Oct 17)
Ed: from the boxer's POV, stance up, analyzing his whole body, not telegraphing, deciding (a double jab to get inside?). The engine shows it, the brain reads it, together. Today the brain sees of the other man only his head meter, gas, guard and hurt. The eyes come first, then targeting the damage (below) reads off them.
- What's on screen goes into Perception: the face (cut, swelling, blood in the eye), the body (folding after a body shot, elbows clamping, breathing), the hands (dropping when tired, a guard breaking down), the feet (weight back = loading up, flat = gassed, set = about to punch).
- The brain notices by skill and state: where he looks (a novice watches the gloves, a vet the chest and shoulders: sees more, sooner), what the blur and the fear take away. A man can miss a cut he isn't looking for.
- Then he decides from it: get inside (double jab, step in behind it), go to the cut, dig the body, reset. The plan, the read and the body language in one loop.
- Measure: how often each cue is noticed by level, and what it's worth (win % with the cue on vs off, levels.js-style).

#### The eyes: the build (Ed OK'd Oct 18; his calls: E4 yes, the line on first sight per cue + big moments)
- **E1 (done Oct 18, hash holds 44b4f117):** `perceive()` sends `him.look` = { cut, body, arms, fold, legs, wobble }, all 0..1 (typedef `Look` in `brain/brain.js`, README Perception). Nothing reads it yet. In normal fights (12 fights sampled): cut > 0 14% of the time (p99 .56), body p10 .60, arms p10 .71, legs p50 .08 / p90 .40, fold and wobble flash ~2% (fold peaks are small: only a big body shot folds him).
- **E2 the eye (done Oct 18, hash holds 44b4f117):** `Brain.look(P, sdt)` each think: per cue a chance a second of clock = `BR.eye.rate` x where he looks (lerp `nov` -> `vet` by gaze = his read mastery, (m.read - .3) / .6) x salience (v / `thr`, cap 1.5) x state (blur, fear, hurt, gas, the hunt's tunnel on all but wobble and legs). A sighting is held in `this.eye[c]` ({ v, t, first, big }); `seen(c)` fades it by `tau`. `this.eyeLog`: first sightings and big moments (for E3). Own dice (`this.eR`, seeded from the profile): no draw from the fight's rng. `tests/eyes.js` (160 fights a level, seen % of episodes / median delay s of clock):
  | | cut | body | arms | fold | legs | wobble |
  |---|---|---|---|---|---|---|
  | Novice | 83% 17s | 92% 95s | 83% 2s | 38% | 40% 23s | 84% 1.2s |
  | Intermediate | 100% 10s | 98% 31s | 84% 2s | 50% | 64% 15s | 89% .6s |
  | Pro | 96% 9s | 99% 21s | 86% 2s | 63% | 84% 12s | 92% .5s |
  | World class | 95% 8s | 95% 20s | 86% 2s | 71% | 87% 9s | 99% .4s |
  A novice watches the gloves (arms flat across levels), misses the body and the legs, and about 1 hurt moment in 6. First try used the squeezed `k.read` (Novice .4 .. World .74): too flat. Cut episodes are few at low levels (n5-12).
- **E3 show it (done Oct 18, UI only, hash holds 44b4f117):** `brainTick` drains `F.brain.eyeLog` into a `saw` event (`a` the man who saw, `d` the other, `cue`, `first`, `big`). Commentary `saw_<cue>` / `saw_<cue>Big` lines: once per man per line a fight (`once` in Comm, reset per fight), 20 s apart (6 s for a big one): ~6 a 10-round fight. Corner notes (`roundNotes`): "You've spotted his body going." / "He's seen your cut and your legs slowing." from `seen(c)` over .75 x thr (the stand-in for More until the info toggle exists). Note: the event field is `cue`, not `c` (Comm reads `c` as a fighter: crashed the page in the first try).
- **E4 swap truth for sight:** what he already reacts to (him.hurt, him.gas, him.guard) goes through the eye: a novice can miss that you're hurt, a vet sees the hands drop before the gas would tell him. Hash moves, full check, expect the level gap to widen (tune).
  - **Done Oct 18** (`BR.eye.e4`, `perc()` in `think`, `this.ph`): hurt = true hurt AND he caught a wobble or a fold in the last `hold` 6 s (a head shot wobbles him, a body shot folds him); gas = 1 until he sees the legs go, then from the legs; guard = the guard as if the arms were fresh, the wear only as much as he noticed it. Tries: hold 1.5 s cut stops to 21.6%; wobble only (no fold) cut body KDs 6.3 -> 2.5% (no hunt on a body-hurt man); wobble/legs rate 1.2/.08 left WvP at 13.2 (pooled 600), 2.4/.16 brought it back.
  - Final (check e4f + e4t finish + bk_fold): audit 51.4 / 15.4 / 29.9%, stops 28.2% audit / 28.3% finish, body KDs 5.0%, same-round stop after a KD ~32%; levels IvN 14.3, PvI 18.7, WvP 16.7 (300 each; with e4w 15.3 / 15.0 / 15.0); styles slugger 52.5, counter 51.2, swarmer 50.8, bp 49.6, **outboxer 45.8** (45.9 / 46.5 / 45.8 over three E4 checks; 47.8 before E4: about -2, his own stops 115 -> ~107). Hash 791b3971 (same.js 40: 3bafb140).
- Then target the damage (below) reads the noticed cues.

### Target the damage (Ed, Oct 17: "if his eye is damaged, go more to his eye")
What the engine tracks on a man: the head meter (and its wear, `headMax`), the body meter (no in-fight regen, little between rounds), cuts (`D.cut`, `CUT.onEye`: an eye cut can bring the doctor), arm wear (`gi`: blocked shots break the guard down), the liver (right-side body hooks and rear-hand body shots, `BODY.liver`) and the wind (straights to the body, `BODY.wind`). No temple or swelling zone.
What the brain sees of the other man today: his head meter, gas, guard (height x arm wear), hurt. Not his body meter, not his cut.
- Pass `him.body` and `him.cut` in Perception (what's on screen: a cut bleeds, a man folding over his stomach shows it).
- The brain weights its picks toward the damage: a cut, go upstairs (straights and hooks to that side; a better ring IQ more surely); a sinking body meter, dig (the fuse code already digs when he's tired); worn arms, more power through the guard.
- The corner's side of it: a cut man's corner tells him to cover that side and move off it.
- Measure: stoppages by cut and body KDs before and after; the audit's cut stops and body KD share must stay in range.

#### Target the damage: built (Oct 18, ROADMAP 1e; Ed OK'd the plan: eye stops ~1%, a shut eye slows his read on that side)
- **(a) Sides and swelling (engine).** A cut opens over the eye the punch came in on (`F.cutS`, from `laneOf`): shots to that eye tear it as before, to the other eye `CUT.off` (.5) as often (an uppercut half way). Each eye swells (`F.sw.L/R`, 0..10, knobs `SW`) from clean head shots to that side (jab x1.3, hook x1.15, uppercut half to each), faster on a worn face (`SW.wear`); the cutman takes `SW.ice` x his skill off between rounds. Half shut at `SW.at` 4, shut at `SW.full` 8.5: a punch on that side is seen `BR.eyeShut` (.09 s) later on top of everything (`SeenPunch.blind`, `blindTo`). The doctor at 8+: `TKO (eye)`. Events `swell`, `eyeShut`, `doctorLook`/`doctor` with `eye: 1`; commentary lines; the eyes get a `swell` cue (`look.swell`, `look.swS`, `look.cutS`).
- **(b) He goes after it (brain, `pickCombo`, `BR.tgt`, times `k.read`).** A seen cut or swelling (`target()`: the stronger of the two, with its side) tilts the pick toward head straights and hooks that land on that eye and away from the other (combo `lead`/`rear` shares, his stance from `me.south`); a seen sinking body pulls body work; seen worn arms pull power over the jab. Thrown head shots onto the damaged eye (16 fights, on vs off): 66 -> 73% when it's his jab side, 40 -> 46% on his power side (most damage ends up on the jab side). The first try (a plain boost on the right-side share) moved nothing: balanced combos (1-2) dominate.
- **(c) The cut man's corner.** `me.eye` (his worse eye: a cut against the doctor's line, a swelling against shut). The brain covers it (`Action.cover`, `BR.cover`): the cutman tells him at the break (`rest` info.eye), before that only a smart man does it himself (self .3, novice .4 of it). The engine: more passive blocks on that side, more when he circles off it, a few less on the other (`coverEye`, `COV`); past `COV.feet` he circles off the bad eye (`offEye`: a right eye is hit by the other man's left hand, so he moves to his left). Cover off vs on (cut.js 400): eye TKO 3.0 -> 1.0%, shut 15.8 -> 12.0%. The cutman's line names the eye and the way off it.
- **(d) Render.** The near eye (facing right, his right side is toward the camera) puffs from its own swelling, narrows past 4, shuts at 8.5; a cut over the far eye shows only the blood.
- **Tuning.** Sides alone cut the cuts in half (bad cut 4.3 -> 2.0%), so `CUT.widen` .085 -> .11. First full check (e1: swelling .075, shut eye .12 s) ran hot: stops 30.9%, eye stops ~3% and cuts 2.5% of the audit field, swarmer 47.9 (vs slugger 48.6 -> 39.3: the slugger's heavy shots shut his eyes). Final `SW.k` .06, `BR.eyeShut` .09.
- **Numbers (check e2 vs base, same 31 jobs):** audit 51.3 / 15.2 / 29.7%, stops 26.0% (base 51.2 / 15.1 / 29.5%, 26.2%); cut stops 1.2% (base 1.7%), eye stops 0.3% of the audit field; finish.js stops 24.5% (29.3), body KDs 7.7% (4.2; noisy, in band); one level down IvN 14.0, PvI 14.3, WvP 21.0 (16.7 / 14.3 / 16.7); styles counter 53.0, swarmer 52.2, bp 50.5, **slugger 47.5**, outboxer 46.9 (base 47.3-51.9). Slugger vs boxer-puncher swings between checks (45.3 at 600, a rerun 53.0 at 300; with swelling, targeting or cover off 48.0 / 46.8 / 54.0): noise, not one piece. cut.js 600: bad cut 4.8%, cut TKO 1.3%, doctor looks at a cut 2.3% / an eye 1.8%, swelling 26%, shut 3%. Eye stops came in rarer than Ed's ~1%: `SW.doc` (9) is the knob if he wants more. Hash 12ad1b42 (same.js 40: 045ba267).

## 4. The drop-in guide (P4)
`brain/README.md` gets a "Plug it into your game" section: the minimal host loop (from `ring.js`), the Perception fields a host must fill and which can be faked, the events to send, presets, what to save between fights (`memo()`, the skill sheet), the per-frame cost (`think()` time on a phone), and the knobs a host should leave alone.

## Build order
P1 cheese bots + baseline (`tests/cheese.js`), P2 presets (`BoxerBrain.preset`, the ladder test), P3 fix holes, P4 guide. Each a commit; P1, P2 and P4 hold the hash, P3 moves it on purpose.
