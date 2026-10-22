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
Oct 20 (1f review): this easy had no f3 flaw. Through the flaw (`cheese.js` now gives easy his style's hole, `FLAW=0` for none; 200 fights each, hash 4a735ef6): easy vs a Pro **10.9%** with it, 19.7% without.
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

### Cheese recheck (Oct 21, hash 28f99fe9, same table, 160 per row)
| Cheese | hard wins (Oct 17) | expert wins (Oct 17) | landed share R1-3 -> R8-10 (hard / expert) |
|---|---|---|---|
| none | 47.6 (52.3) | 87.7 (84.1) | 51 -> 51 / 43 -> 34 |
| jabSpam | 78.6 (89.2) | 94.9 (97.4) | 54 -> 54 / 50 -> 49 |
| oneTwo | 71.9 (77.0) | 94.9 (93.0) | 53 -> 46 / 45 -> 36 |
| pullCounter | 99.4 | 100 | 16 -> 17 / 10 -> 10 |
| shell | 95.6 (99.4) | 99.4 | 19 -> 23 / 13 -> 14 |
| **bodyOnly** | **60.5** (6.3) | 89.9 (19.1) | 46 -> 40 / 33 -> 27 |
| **haymaker** | **61.6** (79.4) | 83.1 (90.0) | 35 -> 28 / 31 -> 25 |
| runner | 100 | 100 | 31 -> 36 / 28 -> 34 |
| clinch | 76.7 (55.4) | 86.3 (83.7) | 51 -> 50 / 47 -> 44 |

- Expert passes everything (80%+). Hard misses 65 on two: bodyOnly (the P3 fix holds, still a bit short) and **haymaker, down 18 points since Oct 17**: the brain reads it (counters 24 -> 39 per 100, the cheese's share falls late) and still loses 38%. Best guess: the stops/power retunes since (stops ~25 -> ~32%) made the big shot worth more; untested. Every cheese but runner and shell loses ground at hard (the control is down 5 too, so part of it is noise and a softer hard).
- Repro: `LB=copy TAG=x node tests/cheese.js 40 hard` (x4, same for expert), `node tests/cheese.js agg x`.

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

### Fakes, flaws and baiting: the plan (ROADMAP 1f, design Oct 19; Ed's calls Oct 19 below)
Ed's calls (Decided, Oct 17): fakes exist, the higher the skill and the veterancy the more surely he sees through one, a novice rarely does. Easy gets one planted flaw per fighter; hard and expert none. Showing a read on purpose: expert only, hard adjusts quietly.

**Ed, Oct 19 (questions round):** a fake wobble (selling a hurt you don't have) and a fake gassed are rare in real boxing (a handful of men): **dropped**, both. The fake that's real is the **bluff**: a hurt man hiding it (shakes his head, nods, smiles, fires back) so the other man doesn't jump on him. The tell is **the legs**: face and hands say "I'm fine", the knees still dip a little, the feet go flat; a vet watches the legs, a novice watches the face and buys it. Vets bluff often, novices never. The coach sees the tell too (the smaller knee dip). Easy flaws: plug-in only for now (fighters in Last Bell get flaws with traits, ROADMAP 3). The bait: any World-class man (it goes by skill).

What's already there to build on: the eyes (E2: by gaze, a novice watches the gloves, a vet the chest and legs) and E4 (he only believes a hurt he caught: a wobble or a fold), the `steady` hurt answer (`SURV.steady`: bites down, keeps the jab going), the hunt, the trap tables (`show`, `draw`), `expected()` (his read of your lead punch).

**f1, the bluff (brain + engine, hash moves).**
- Who: a hurt man picks it at the hurt (`survStart`), chance = `trV('bluff', mastery)` [0, .2, .5, .75] (Novice never) x composure. A man off the floor can't bluff (everyone saw it).
- What he does: he acts fine. A new hurt answer `bluff` (near `steady`: keeps punching back, guard up, stands his ground, no shell, no run, no grab), `Action.bluff = sell` (his composure x mastery). The engine holds it and sends a smaller wobble: `look.wobble` x (1 - sell x .7) (a stun still shows in full: you can't hide your legs going), and draws the smaller knee dip.
- The watcher needs no new roll: the eyes already do it. A weaker wobble has less salience, and a novice's gaze weight on the legs is .3 vs a vet's 1, so a vet still catches it and a novice mostly doesn't. Caught: he hunts as now (and the bluffer, standing in front of him, is in more danger than a man in a shell). Missed: no hunt, the bluffer rides it out with his hands going.
- Fix on the way: `opening()` still reads the truth (`H.hurt`, `H.gas`, `H.guard`); it moves to what he sees (`this.ph`), so the bluff can't leak.
- UI: commentary ("{a} shakes his head: he wants you to think that didn't hurt", "{d} isn't buying it, he saw the legs"), a corner note, a `bluff` event.
- Expect fewer stoppages of vets (they hide hurts) and more late ones: check finish.js, retune if stops fall under ~25%.

**f1 built (Oct 19, Ed's review calls).** The review found the eyes alone can't do it: every level caught a hurt ~85% (72% start in a stun that shows in full, the spell runs 5-12 s, the eye rate is 2.4/s), and a smaller dip barely moved it (prototype: novice 75-77%). Ed's calls: **he talks you out of it** (while he sells it, a face-watcher reads the wobble with the legs' weight and lets go of what he saw sooner: hold x 1 - sell x `BR.bluff.talk` .85 x (1 - gaze); the `wobbly()` head-meter fallback shrinks the same way; a vet keeps it), the rate **x lerp(.6, 1.2, composure)** on `finM()` mastery (World ~57% of all hurts in the probe, Pro 42%, Int 19%, Novice ~0), `opening()` fixed for **hurt only** (gas, guard and the combo picker's truth reads move in f1b), **the turn** in (`AI.bluffTurn` .5 at `AI.bluffLat` 40 sideways). Skipped: late legs, the hunt tweak (balance pass). Engine: wobble .6 x (1 - `AI.bluffDim` .7 x sell), `Look.sell`, `Action.bluff`; `SURV.bluff` (aggr .8, range 2, guard .85); second pick keeps it or goes steady; 3 clean unanswered breaks it (fire or clinch). Render: smaller knee dip, the hands stay up (separate commit, hash held).
- Measure (`tests/fakes.js`, 300 fights each; caught = still hunting him 1.5 s after the stun): watcher Novice 21% plain -> **6%** bluffed, Int 24 -> 15, Pro 44 -> 25, World 45 -> **28**. Most of the vet's drop is the bluff's behavior, not his eyes: with the eye part off (behavior only) World 45 -> 23 and Novice 27 -> 16 (a hurt man punching back sends any hunter to huntSafe and eats fewer clean shots: Mosley-Mayweather). The eye part on top: Novice 16 -> 6, World 23 -> 28 (noise). When it fails it costs: bluffed W/P men dropped 7% of spells vs 1-4% plain. The plan's "World catches ~80%" counted any sighting: every hurt is seen (the stun), so it was the wrong measure.
- Full check (base = 12ad1b42 rerun, same day): audit 3x500 thrown 50.9 -> 51.0, landed 15.1, connect 29.6%, stops 27.5 -> **28.1%**; finish.js 600 stops 26.8 -> 24.2% (±1.8), KDs 0.81 -> 0.86/fight, body KDs 3.5 -> 4.8%; styles 45.4-53.1 -> **48.2-52.5** (outboxer 45.4 -> 48.2, counter 53.1 -> 49.0: the opening fix, he no longer counters into a hurt he never saw); levels one down 14.0-16.0% (base 14.3-16.3). No retune. Hash 93a5b79f (same.js 200; 40 = ee9a7874).

**f1b, the hands tell the truth (Ed, Oct 19: "a tired fighter keeps his hands down; hurt to the body real bad, he keeps his hands tight on his body, not on his head").** What's there: a tired man's hands drop on screen (`v.tired` in `arms()`) and he blocks less (`stamFac`); a body-hurt man's head block dropping (`BODY.elbows`) is 0 (it was a flat cost that only punished high/cross); the brain's elbows-down (`Action.low`, `lowHead`) fires only when he's read a body digger, and isn't drawn.
- His own body hurt pulls his elbows down: `low` also from his body meter and recent folds (more as it sinks), so the body's covered and the head's open (`lowHead`). Drawn: elbows clamped to the ribs, gloves low (render commit, hash holds).
- The other man's eyes see it (an `elbows` cue, or `arms` reading the low guard) and go upstairs: "go to the body, the head will follow".
- The bluff can't hide these: it hides the wobble only. Tired hands and clamped elbows still show, and a vet reads them.
- Measure: body-then-head KOs (head KD after the body went), body KDs stay 5-8%, stops in band.

**f1b built (Oct 19).** Engine commit c7dc990, render cbf5f85 (hash holds).
- His own body: `Action.clamp` from `clampOf()`: `BR.clamp` at .35 .. full .85 on his body meter gone (`P.me.body`, new), plus .12 per power shot that landed downstairs (`this.bp`, fades tau 45 s of clock, capped at .6: research's ~5% off the head guard per body shot, ~20% cap). Engine `F.clamp`, `lowB(F, head)`: the head guard catches less like the read's `low` (`BODY.lowHead` .3 at a full clamp), the body's covered x `BODY.clampBody` .35; the evade bonus (`lowEv`) stays the read's. Clamped ~13% of the time (mostly the pain part, after 2+ body shots).
- The other man: `Look.elbows` = F.clamp, a new eye cue (rate .5, novice .8: a glove-watcher sees gloves drop; thr .25, tau 10). Seen, it drops the guard he believes (`see` .15), pulls him upstairs (`up` .2 x power-minus-body: "go to the body, the head will follow") and counts as an opening (`open` .25). The bluff can't hide it.
- The reads: `opening()` and `pickCombo` read `this.ph.guard` / `this.ph.gas` (what he sees) instead of the truth. Tired hands: the guard he sees already carries the brain's fatigue drop (bg), so a tired man's low hands get read with no new cue.
- First try (up .8, see .3, the clamp covering the body in full) cut body KDs 5.4 -> 3.6% and attackers left the body for good; split runs: the reads alone 7.0%, the clamp alone 5.8%: the upstairs pull was the cost. Settled at the numbers above.
- `tests/hands.js` 1200 fights (base f1 -> f1b): stops 27.3 -> 29.4%, KDs .86 -> .91/fight, 31% of head KDs on a clamped man, head shots clean on a clamped man 38.7% (fresh 28.8%), head share of punches at a gone body 70 -> 72.5%.
- Full check (`check.sh f1b`, vs f1's): audit 3x500 thrown 51.0 -> 51.2, landed 15.3, connect 29.9%, stops 28.1 -> 27.2%; finish 600 stops 24.2 -> 25.0%, KDs .86 -> .82, **body KDs 4.8 -> 6.7%** (in the band); styles 46.8-53.1 (counter 53.1, bp 51.4, slugger 50.5, swarmer 48.2, outboxer 46.8); levels dog wins IvN 19.3, PvI 16.0, WvP 16.3, PvN 3.0. The outboxer is not f1b's: counter v outboxer 600 fights reads 62-38 on the f1 code and 60-40 with the reads moved (f1's 48.2 overall was a good run). Counter v outboxer goes to the balance pass. Hash 1d73cdbb (same.js 200; 40 = 9c74be58).

**f2, the expert bait: show a read (any World-class man).**
- Once `expected()` is sure of your lead punch (> .5) he offers it: hands drop at mid-range (visible: the engine draws the guard he picks), the defense for that punch pre-picked (best of `DEF_THRU` vs it), the counter loaded. 1.5 s window; nothing comes, back to normal. The watcher's `opening()` sees the low hands and his habit punch is the likely throw: that's the bite. A high read can see through it (a spot roll like the feint's) and take nothing.
- Table [0, 0, 0, x]: World class only. Pro keeps today's quiet tools (`show`, `draw`). Commentary: "He's baiting it. He knows it's coming." (the 'bait' lines exist, nothing fires them today).
- **Ed's calls (Oct 19, before the build):**
  - Who baits: **World class only** (as above).
  - The coach sees it: **commentary live + a corner note between rounds** when his man bit ("He's showing you the right, stop taking it").
  - How often: **rare, and it goes by the man**: his traits and style set the rate (a counter-puncher, a feinter, a high ring IQ bait more; a slugger or swarmer rarely), not one flat number. Keep a floor gap between baits so it never turns into fishing all night.
  - Who sees through it (takes nothing): **World ~50%, Pro ~25%, Intermediate ~10%, Novice ~5%**; each bite makes him warier, like `FEINT_READ` does for feints.

**f2 built (Oct 19).** Engine 7ded2b3, render 1a84c3a (hash holds). Knobs `BR.wb`; Action/Look `bait` (an id while it's out); engine `F.baitId`, events `wcBait` / `wcBit` / `wcThru`, round stats `bait`, `baitBit`, `baitP`, `baitThru`.
- Who: (read + counter) mastery over .82, full at World. The read: `wbLead()`, the lead table like `predict()` but the jab counts in full (the habit lead is the jab ~80% of the time; halved, nobody was ever sure). Sure > .5, mid-range 58-82, not hurt, not on the ropes, in work/counter/feelout/press/reset.
- Rate (Ed: rare, by the man): .02 a decision x (1.3 - initiative) x (.4 + patience) x (.5 + composure) x his counter skill, 10 s apart, done for the round after 2 with no bite. Per 10 rounds: counter-puncher ~5.3, out-boxer ~1.6, boxer-puncher ~1.0, slugger ~.2, swarmer ~0.
- The bait: guard .3 for 1.5 s (he doesn't lead meanwhile), the defense picked from DEF_THRU vs that punch (x6, tries .95, seen sooner: rd .7), counter x3 within 1 s of the bite; .8 s after the bite the hands come back.
- The other man sees the low hands (no roll): `opening()` reads them as an opening. Seen through: `tierV(read, [.05, .1, .25, .5])` (Ed) x (1 + .15 per bite he's taken, the fight): takes nothing (throws x .2, the guard he sees stays .6). Fight-wide average with the wariness: N 10, I 17, P 32, W 57% (rolled = expected; .5 per bite read 22/42/67 for I/P/W, too much).
- `tests/bait.js` (300, World vs a random level): bites 64-83% of baits, on the punch he waited for ~89%, counters landed .2-.35 a bite, KDs rare (2 in 300). World wins vs P 78-85% over 3 runs.
- Full check (`check.sh f2`): audit 3x500 51.6 / 15.6 / 30.1%, stops 28.1%; finish 600 stops 28.3%, KDs .89, body 5.8%; styles 48.5-51.6 (counter 51.6, swarmer 51.1, outboxer 49.5, slugger 49.3, bp 48.5); levels dog wins IvN 16.7, PvI 16.7, WvP 17.7, PvN 3.0. Hash 4a735ef6 (same.js 200; 40 = 76371bc7); `BR.wb.on = 0` gives back 9c74be58.
- Seen: commentary on the bait (30 s apart) and on a read ('not biting'); corner note when your man bit ("He's dropping his hands to draw your X. It's a trap") or when his bait works. Render: gloves to the waist (the handslow pose). Lab panel: 'hands down on purpose', 'baiting his X, slip ready', 'sees the bait'.

**f3, easy flaws (plug-in only: `preset('easy')` sets `profile.flaw`; the game never calls preset).** One per style, something a player can spot and beat; the brain never fixes it in the fight:
| Style | Flaw | Beat it with |
|---|---|---|
| slugger | walks in behind no jab defense (tries to defend a jab x .35 while closing) | jab and move |
| outboxer | folds under pressure: pressed or on the ropes he shells, output halves, slides off weakly | cut off the ring |
| swarmer | head comes in straight: counters on his way in land x1.5 | step back and counter |
| counter | won't lead: initiative floor, waits on you | outwork him |
| boxer-puncher | the jab hand comes back low (guard ~.3 for .4 s after a jab) | right hand over his jab |

**f3 built (Oct 19; Ed: "go ahead" on the four picks: brain-led, the exploit bots in, on all fight, one per style).** Knobs `BR.flaw` (`by` style -> flaw); `preset('easy')` sets `profile.flaw` (`o.flaw` overrides, null = none), brain `flawSet` (a host or test can call it after create). Hash holds: 4a735ef6 (same.js 200; 40 = 76371bc7).
- Brain-only wasn't enough: in Last Bell most blocks and slips are the engine's own passive defense (~9,400 jabs blocked or slipped vs ~2,300 brain defense calls in 20 fights), so a brain that stops defending moved landed jabs +7%. New contract piece `Action.hole` {k, zone?, cat?}: what he's open to right now; the engine's passive block and evade x (1 - k) (`holeF`). No flaw = no hole = x1 (no new rolls), so the hash holds.
- "Closing" is his own feet (`myV`: dist change plus the other man's closing speed, smoothed), not the range he wants (only 3% of jabs met that test).
- The flaws as built:
  - slugger `jab`: walking in (feet > 8/s) he tries to defend a jab x .2 and his passive defense vs jabs x .3 (hole .7).
  - outboxer `fold`: crowded (inside 48) for 1 s running, he shells for 2.5 s: guard .95, blocks x3, output x .25 and no counters, slides off x .15, fights for room x .3, the body open under the shell (hole .4). The ropes as a trigger let a straight player fold him 22% of the time; crowding is 0.1% straight vs ~39% under pressure.
  - swarmer `straight`: lunging in (feet > 25/s) he defends power shots x .3 at quality x .7, hole .8 on power. Walking in at all, or chasing a man who backs off, hit every player alike (the straight player got +15-17).
  - counter `wait` (replaced Oct 20, see below): initiative capped at .1, leads x .45 while the man's busy (punched in the last .6 s), lets 70% of jabs go without a counter: outwork him with the jab.
  - boxer-puncher `drop`: .4 s after his jab the guard's at .3, head shots defended x .45, hole .4 on the head.
- The bots (`tests/bots.js`, the cheese ones moved there too) ride on the player's own fight: a player who knows the hole is the same man plus the trick (a bot that only did the trick lost: jab-only 17% vs a slugger). jabMove (keep range, jab him as he comes in), pressure (cut the ring at 44, dig the body when he covers), stepCounter (give ground, power only on his step in), outwork (extra jabs), overJab (the right over his jab).
- `tests/flaws.js` final (600 a cell, player win %, flaw on - off): exploit / straight: slugger +18.2 / +2.3, outboxer +26.3 / +5.0, swarmer +18.9 / +8.0, counter +18.3 / +11.1, boxer-puncher +20.1 / +8.7. Run to run a cell moves ±2 (a difference ±3-4): the counter's straight read +3 / +7 / +7 / +11 over four runs, the outboxer's exploit +28.6 at hole .5. Took 12 rounds; the tries and why are in the commits (`f3 round N`).
- Not built: commentary or a corner note naming the hole (the plug-in host shows what it wants; Last Bell's own fighters get flaws with traits, ROADMAP 3). The game never calls preset, so nothing on screen changes.

**f3 after the review (Oct 20, Ed's calls).** The review found `flaws.js` scored the trick against itself with no flaw (the bots were handicapped), so it now also prints, flaw on, the trick minus boxing him straight (target +10-20).
- The counter's flaw is a habit now, `same` (`BR.flaw.same`): every counter is the same right hand (`p`), and for .5 s after it his hands are at .35 and he defends head shots x .45 (hole .5). Bot `slipCounter` learns the punch from his counters (2 of the same), slips it, comes back cross-hook. Outworking the old `wait` never beat boxing him (-6 to -1 over four tries); the habit at k 1: +25.
- `BR.flaw.k` (.6) scales every hole (Ed: easy vs a Pro ~15-18%): 10.9% at k 1, **14.4%** at .6 (200 fights).
- At k .6, trick - straight (flaw on), 600 a cell: boxer-puncher **+17.1**, counter +9.3, outboxer +7.7, swarmer +5.0, slugger **-21.8**. On - off: exploit +10 to +20, straight -0.2 to +6.6. The slugger's `jabMove` with no flaw wins 32.8% vs straight 59.7% (stops 48%): the bot is the problem, like outwork was. **Not done**: make each bot match straight play with no flaw (slipCounter does), then retune the holes on the new column.

**f3 retune, part 1: fair bots (Oct 20, branch `claude/kind-newton-dhep4n`, `tests/flaws.js`, 600 a cell, k .6).** Why the old bots lost: a punch starting drops your own defense (`startPunch`: `F.def = null`), and the bots fired whenever their hands were free, into his punch on the way (jabIn, same trick as jabMove without the footwork: 19.6% vs straight 63.4, stops 65%). Bots now punch only when `clear(P)` (nothing of his on the way) and only when his own brain isn't punching (`!o.punch`), with a cooldown. The outboxer trick (crowding) costs on its own (crowd to 60: 15.8%), so `crowd4` boxes straight and crowds (range 44, cut 1) only after it's seen him shell up inside twice: the player who spots the hole. New defaults: slugger `jabIn2`, outboxer `crowd4`, swarmer `lungeCounter2` (old ones kept in `bots.js`).
| style | bot | no flaw: bot / straight | flaw on: bot / straight | trick - straight |
|---|---|---|---|---|
| slugger | jabIn2 | 62.3 / 63.4 | 69.2 / 69.2 | 0 |
| outboxer | crowd4 | 29.8 / 29.5 | 34.0 / 26.6 | +7 |
| swarmer | lungeCounter2 | 58.6 / 64.1 (still -5) | 67.2 / 66.8 | 0 |
| counter | slipCounter (f3a) | 40.5 / 38.4 | 49.0 / 38.4 | +11 |
| boxer-puncher | overJab (f3a, fires on `free`, not `clear`) | 55.2 / 50.2 | 64.1 / 56.3 | +8 |
Part 2, sweep A (PATCH: jab try 0 hole 1, straight try .1 hole 1, fold hole .7): trick - straight slugger +5.2, swarmer +0.3, outboxer +0.3; the trick's own on - off +7 to +9. **The hole size isn't the lever**: the tricks rarely catch him inside the window (walking in, the lunge, the shell). **Next (high effort, debugging):** instrument the trick punches (how often each bot's trick fires, lands, and lands on an open hole, flaw on vs off), then widen the window or sharpen the bot's timing, then the holes; then easy vs a Pro (`cheese.js 75 x4 easy none`, ~15-18%).

**f3 retune, part 2 (Oct 22, 2a, `tests/trick.js`): the holes open when the trick comes.** trick.js follows every player punch: thrown by the trick or his own brain, the hole open at launch (L) and at impact (R, the engine's `holeF`), how it ended.
- Why the tricks missed (t1, 160 a cell, flaw on): slugger and swarmer: the walking-in / lunge hole flickers (658 / 470 openings a fight, .39 / .26 s each: `myV` hovers at the line), the trick fires into an open hole 64% of the time but it's shut by impact (trick punches into the open hole 36% / 28%). Into the hole they land 50-67% (out of it 17-37%): the hole works, the timing didn't. Outboxer: he folded ~4-6x a fight (a straight player is rarely inside 48 for 1 s vs a mover) and the shell (guard .95, blocks x3) helped him: player 28.5% flaw on vs 35.3 off. Counter: 44% into the hole, the rest mostly out of range (61% of those). Boxer-puncher: overJab lands ~50% in or out of the hole: it's a counter on his jab, not the hole. Trick jabs vs the slugger get parried 26-29% (1c, after the fair bots): with no flaw `jabIn2` now loses ~6-12 to straight.
- Built (knobs, hash holds): `jab.hold` .4 / `straight.hold` .35 (the hole stays open a beat after his feet slow: trick punches into it 90-95%); the fold also builds with his back on the ropes (`fold.rope` .7, `far` 70), `blk` 3 -> 2, `hole` .4 -> .6.
- Tried: bigger slugger/swarmer holes (jab hole 1 try 0, straight hole 1 try .1, with the holds): straight on - off rose with them (+10 / +13), trick - straight stayed +6-8: not the lever. Fold variants at 300 a cell: hole 1 + rope + build .6: exploit +47 (too much); blk 1 + rope + build .6: +32; **blk 2, hole .6, rope .7, build 1: +20.6** (taken).
- Final `flaws.js` f1 (600 a cell), on - off straight / exploit | flaw on trick - straight: slugger +3.1 / +8.4 | -0.5; **outboxer -0.8 / +22.0 | +18.5**; swarmer +11.4 / +25.1 | +5.5; **counter +2.3 / +10.7 | +20.9**; boxer-puncher +2.9 / +6.1 | +5.9. Run to run a difference moves ±5 at 300 a cell (h1 read the slugger +19.3 / swarmer straight +2.3): trust only 600. Easy vs a Pro (`cheese.js 75 x4 easy none`): **15.3%** (target 15-18).
- Left: slugger, swarmer, boxer-puncher trick - straight +6 or under (target +10-20). The cap is the bots: with no flaw `jabIn2` -6, `lungeCounter2` -8 vs straight (the parry eats spare jabs; the extra work costs gas). Next: make those bots fair again (fire only off a clear look: his feet set, not mid-combo; fewer, better-timed tricks), the boxer-puncher's `drop` hole on the right hand only (`cat`), then the build into the game.

**f3 retune, part 3 (Oct 22, 2a): fair bots, holes you have to find.** Plug-in only, hash holds (40 = 75856492).
- Why part 2 fell short: the bots added punches on top of his own fight (jabIn2: +160 jabs a fight, 27% parried with no flaw; -6 / -8 vs straight), and the slugger/swarmer holes were natural states (the slugger's open 442 s a fight: a straight player's own jabs went 25% into it, so boxing him straight took most of what the hole gave).
- Fair bots (`tests/bots.js`): each trick replaces the brain's next punch of that kind (same volume, moved into the hole). With no flaw they cost nothing now: `jabIn5` 62.2 vs straight 63.7, `lungeCounter3` 62.0 vs 61.3, `overJab2` 57.9 vs 51.5 (600 a cell). `jabIn5` fires inside .25 s of the step in starting (his closing over 8, after under 4).
- Holes: `jab.step` 1 (the slugger's jab hole opens as each step in starts, `hold` .5, not the whole walk: own jabs into it 25 -> 10%); **the stop** (`jab.stop`, `straight.stop`: caught in the hole he backs out to 76 for 1 s, output x.3, push x.5, the walk starts over: the jab that stops him is worth more than its points); `drop` is the rear hand only (`arm`: the right hand over the jab; `Action.hole.arm`, the engine's `holeF` reads it), `hole` .4 -> .6, `try` .45 -> .3.
- Final `flaws.js` (600 a cell, f3 = f1 + f2), on - off straight / exploit | flaw on trick - straight: **slugger +3.4 / +14.3 | +9.4**; swarmer +9.8 / +15.3 | +6.2; **boxer-puncher +1.4 / +12.4 | +17.4** (outboxer, counter unchanged from part 2: +18.5, +20.9). Easy vs a Pro (`cheese.js easy none`, 600): 12.8%; the control with no flaw (`FLAW=0`, 300) 13.6%: the flaws cost him ~1 point vs a straight Pro, the 15-18 target sits on the Intermediate-vs-Pro baseline itself (part 2's 15.3 was a high read).
- Tried (600 a cell unless noted): slugger step + stop t 1.5 / out .2 / range 80: +5.6 (200); step without the stop: +1.8 (200). Swarmer step (hold .3 / .45): +0 / +2.7 (200); stop t 1.5 / out .2 / range 80: +7.5; hold .2: +6.7; a 2-punch counter bot (cross-hook into the lunge): costs 17 with no flaw. Boxer-puncher hole .8 / try .2: +14.5 (200, overJab).
- Noise: two identical 200-fight cells read 61.0 and 48.2 (bp mirror, straight, flaw off). 200 a cell is a screen only.
- Left: the swarmer's trick +6 (target +10-20): a straight boxer counters his lunges anyway (+9.8 from the flaw). No knob moved it; a different swarmer flaw (or the build's eyes: the hole found by level) is the next lever. Slugger +9.4 at the edge.

**Ride-along: the outboxer knob** (separate commit, style numbers only). He read 46.8 at f1b and 49.5 at f2 (band 48-53; f3 holds the hash, so f2's stands): his pairs swing, so confirm he's low at 600 before sweeping. Sweep 2-3 candidates on his `STYLES` row (footwork/range skill, `legs`, output) at 300 a style, pick one, confirm at 600. Slugger: recheck first (±4 between runs), touch only if he stays under 48.

**Measure (`tests/fakes.js`, new):**
- Bluff (the plan's first targets, superseded: "f1 built" measures it as World ~57% of hurts bluffed, caught after the stun Novice 6% / World 28%): how often a hurt man bluffs by level (target: World ~75% of hurts, Pro ~50%, Novice 0); how often the other man still catches the hurt, by his level (target: Novice catches a bluffed hurt ~25%, World ~80%); hunts and stoppages after a bluffed hurt vs a plain one; stops overall stay ~25-30%.
- Bait: baits a fight at World, bites, counters landed off them; expert vs a Pro (P2 ladder ~84-88) stays under ~90; WvP stays ~14-21.
- Flaws: easy vs an Intermediate "player" with the matching cheese (jabSpam vs the slugger, a pressure bot vs the outboxer...) vs the same easy man flaw off: the exploit should be worth +15-25 points; playing straight against him barely changes.
- Each brain step: full check (`tests/check.sh`: audit, styles, levels, finish), the hash moves on purpose. f3 holds the game's hash (no flaw outside presets).

**What the trainers say (Oct 19, `research/coach_a.md` old masters, `coach_b.md` modern US/Mexico, `coach_c.md` today's elite; search summaries only, no trainer has an on-record tell list, so the tells are lore + Ed).** It backs the plan; changes to fold in when building:
- f1: the best real case is BoMac on Spence after the R2 knockdown: "more hurt than he let on" (feet slower and wider, no wobble). McCracken read Joshua by the eyes: "glazy", late to react. So the bluff hides the wobble but **not the late reactions**: keep the hurt's slower defense under a bluff (check the engine already does; don't let `bluff` restore it). The hunt on a caught bluffer: hard counters for 20-30 s, not wild volleys (BoMac), and don't empty the tank (Roach: Pacquiao hurt Horn in R9, then had nothing left). A hunter low on gas keeps 2-3 punch bursts.
- f1b: all three files land on "body first, the guard drops, go upstairs" (Atlas, Beristain, Garcia, Inoue). Starting numbers: his guard over the head down ~5% per landed body shot, capped at 20%. After 2 clean body hits in ~90 s, the reader favours the head. By the middle rounds men guard the body harder, so the head opens (Inoue).
- f2: Atlas teaches the bait exactly: jab, step back, invite the right, counter the miss. Roach's Hatton plan is the same idea from the other side: Hatton cocked his left hook, and after seeing it the counter goes on the cue (Pacquiao dropped him twice in R1). Reynoso drills one scripted counter per habit. Fits `expected()` > .5; no change.
- f3: the flaws trainers name match the table: walks in straight / upright (Futch's Frazier at Manila, swarmer), lunges with the feet left behind (Spence, slugger alt), cocks the hook (Hatton), hands come back slow (Shingo Inoue drills the opposite, boxer-puncher), never changes (Spence: counter). No change.
- **Full-page pass (Oct 19, `research/tells.md`, `corners.md`):**
  - The bluff breaks on a turn. Ref manual (ABC 2022): legs sturdy or wobbly, eyes tracking, make him walk and turn. Reiss: "any drunk can walk in a straight line": the hurt shows when he has to change direction. So the bluff hides less while he moves sideways or turns (`sell` x ~.5 while he pivots; a man planted and punching hides it best). A hunter who cuts the ring and makes him turn sees it.
  - Legs can go late: Burgos's legs went ~4 s after a punch he brushed off. Optional in f1: a bluffed hurt can leak a wobble 1-4 s after the shot (the old "0.2-0.6 s" guess in `mind_finish.md` is overturned).
  - A real vet bluff: Mayweather-Mosley R2. Floyd smiled; Mosley said later "hurt real bad", but couldn't finish a covered, moving man. That's `bluff` + `steady`.
  - A tired man's loaded punches turn to "pushing" punches (Bayless), and tired can look hurt (McGregor: "wobbly when I'm tired"): a novice may hunt a gassed man by mistake (the false hunt exists: `falseA`).
  - The corner's first words to a hurt man are a state check ("How do you feel? You sure?", "Breathe"), then one safe order: use it for the bluff corner note.
  - Still lore only: "elbows clamp" (f1b stands on Ed's call) and "watch the legs, not the face". No pro ever documented faking a head hurt to bait: dropping the fake wobble holds.
- Not 1f (corner, later): 1-2 notes a break, one voice; stay with a plan that's winning; "go back to the jab" when he drops it while ahead (Roach, De La Hoya 2007); switch a plan whose key punch lands under ~10% over 2 rounds (Derrick James vs Crawford); a stop threshold for the corner (Futch at Manila; Garcia's late Margarito stop).

Build order: f1 bluff, f1b hands (engine, then the render), f2 bait (each a commit with a full check), f3 flaws, the outboxer knob, then the numbers here and in ROADMAP.

## 4. The drop-in guide (P4)
`brain/README.md` gets a "Plug it into your game" section: the minimal host loop (from `ring.js`), the Perception fields a host must fill and which can be faked, the events to send, presets, what to save between fights (`memo()`, the skill sheet), the per-frame cost (`think()` time on a phone), and the knobs a host should leave alone.

## Build order
P1 cheese bots + baseline (`tests/cheese.js`), P2 presets (`BoxerBrain.preset`, the ladder test), P3 fix holes, P4 guide. Each a commit; P1, P2 and P4 hold the hash, P3 moves it on purpose.
