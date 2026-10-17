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
- Fair check (`cheese.js`, Oct 17): expert's mean reaction is ~.09 s (World's base .14; a read punch is seen up to 60% sooner, floor .04). Ed: smart, not psychic. Next: a floor ~.10 for a read punch, its own full check.

### The eyes: read the whole fighter (Ed, Oct 17)
Ed: from the boxer's POV, stance up, analyzing his whole body, not telegraphing, deciding (a double jab to get inside?). The engine shows it, the brain reads it, together. Today the brain sees of the other man only his head meter, gas, guard and hurt. The eyes come first, then targeting the damage (below) reads off them.
- What's on screen goes into Perception: the face (cut, swelling, blood in the eye), the body (folding after a body shot, elbows clamping, breathing), the hands (dropping when tired, a guard breaking down), the feet (weight back = loading up, flat = gassed, set = about to punch).
- The brain notices by skill and state: where he looks (a novice watches the gloves, a vet the chest and shoulders: sees more, sooner), what the blur and the fear take away. A man can miss a cut he isn't looking for.
- Then he decides from it: get inside (double jab, step in behind it), go to the cut, dig the body, reset. The plan, the read and the body language in one loop.
- Measure: how often each cue is noticed by level, and what it's worth (win % with the cue on vs off, levels.js-style).

### Target the damage (Ed, Oct 17: "if his eye is damaged, go more to his eye")
What the engine tracks on a man: the head meter (and its wear, `headMax`), the body meter (no in-fight regen, little between rounds), cuts (`D.cut`, `CUT.onEye`: an eye cut can bring the doctor), arm wear (`gi`: blocked shots break the guard down), the liver (right-side body hooks and rear-hand body shots, `BODY.liver`) and the wind (straights to the body, `BODY.wind`). No temple or swelling zone.
What the brain sees of the other man today: his head meter, gas, guard (height x arm wear), hurt. Not his body meter, not his cut.
- Pass `him.body` and `him.cut` in Perception (what's on screen: a cut bleeds, a man folding over his stomach shows it).
- The brain weights its picks toward the damage: a cut, go upstairs (straights and hooks to that side; a better ring IQ more surely); a sinking body meter, dig (the fuse code already digs when he's tired); worn arms, more power through the guard.
- The corner's side of it: a cut man's corner tells him to cover that side and move off it.
- Measure: stoppages by cut and body KDs before and after; the audit's cut stops and body KD share must stay in range.

## 4. The drop-in guide (P4)
`brain/README.md` gets a "Plug it into your game" section: the minimal host loop (from `ring.js`), the Perception fields a host must fill and which can be faked, the events to send, presets, what to save between fights (`memo()`, the skill sheet), the per-frame cost (`think()` time on a phone), and the knobs a host should leave alone.

## Build order
P1 cheese bots + baseline (`tests/cheese.js`), P2 presets (`BoxerBrain.preset`, the ladder test), P3 fix holes, P4 guide. Each a commit; P1, P2 and P4 hold the hash, P3 moves it on purpose.
