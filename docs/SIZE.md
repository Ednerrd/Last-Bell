# Size: height, reach, leverage (design draft, Oct 22)

ROADMAP: the last engine step before 3D. Research: `research/size.md` (sections 1-7, "For Last Bell" A-H, video batch 1); `research/dynamic.md` (Teddy Atlas batch 1 + Ed's paste), folded into "The brain: s2 design" below (Oct 22). s1 and s2 are built (sections "s1, built", "s2, built"); s3, the pre-3D baseline, is next.

## What's in today
- Every man has the same arms. The jab reaches 78, the cross 76, hooks 56-60, uppercuts 50-54 (`PUNCH` in the engine, `PUNCHES` in the brain, the same numbers twice).
- `look.h` (0.95-1.05) and `look.build` (by division) only change how he's drawn. The engine never reads them.
- The brain picks where to stand off its own style: `range = lerp(50, 76, tr.range)` plus the mode, the plan, fear and so on (`brain.js` ~1246). It never thinks about the other man's arms.
- Where reach is read (small footprint): host `resolve()` range check (~2681), `extRaw()` the punch's sweet spot (~1962), `TUNE.reach` reaching for a power shot (~2723), the miss kind short/jammed (~2842), the jab-in-step check (~2626). Brain: about 10 `PUNCHES[x].max` "does it reach" checks (combos, counters, the step-in fix).

## The idea in one line
Reach stretches every punch a man throws. The long man gets a strip of floor where only he lands (the free band). Both brains know it and fight over it: the long man holds the band, the short man either gets through it or refuses to stand in it. No flat "tall man bonus": the edge comes from range, feet and the brain.

## The numbers
- **Each fighter rolls `ht` and `reach`** (inches) from his division's table (`research/size.md` section 7: fly 64.5/65.5 ... welter 69.5/71.5 ... heavy 75.8/79). Height sd 2.3, reach = height + ape, ape ~ N(division, 1.6), clamped -3..+9 (built: 2.4 gave a reach sd 3.5 and 7+ in gaps in 17% of fights; 1.6 gives the real ~2.8 and ~1 in 10). Heavyweights get the fatter tail (sd x1.3: Fury, Wilder).
- **Own dice**, like `flawOf()`: rolled off his name, so the same man is always the same size and the fight's rng never moves for it. `sheet.ht` / `sheet.reach` override it (tests, the P4P stars).
- **Reach scale `rs = 1 + per x (reach - his division's mean reach)`**, `per` .005 as built (planned .015: arms alone won 61% at 4 in, 70% at 8 in). Every punch's min and max x `rs`. A 6 in gap = 3% = ~2.3 units of jab. That is the free band.
  - **Relative to the division, not absolute** (my pick, Ed's call below): the average man in every division keeps the 78 jab, so the ring, the footwork and every balance number stay where they are on average. Only the gap between the two men matters, which is what the real data measures.
- **Height** stays small. Real data: with the same reach, a height gap barely moves results. Use it for the drawing (`look.h` from `ht`, so 3D gets real sizes) and one tilt: 4+ in shorter, his body share goes up a little (the target's right there). Nothing else for now.
- **How strong** (`research/size.md` B, half the raw boxing numbers because the longer man is often just better): mirror match, the longer man wins

| Reach gap | Light (fly-light) | Welter-middle | Light heavy-heavy |
|---|---|---|---|
| 0-2 in | 50 | 50 | 50 |
| 3-4 in | 51 | 52-53 | 54 |
| 5-6 in | 51-52 | 54 | 57 |
| 7-8 in | 52-53 | 56 | 60 |

  Size stays well under one skill level (one level down still wins 15-20%). A typical fight's gap is ~3 in, 7+ in maybe 1 fight in 12.

## The brain: s2 design (folded from `research/dynamic.md`, Oct 22)
**The scale problem first.** `per` .005 makes the free band tiny: a 3 in gap (the typical fight) is ~1.2 units of jab, 8 in ~3 units, about the brain's own range noise (`rangeJit` 2-5, `dSeen`). So the old plan's "range target between his jab + 2 and my jab - 1, if the edge is 4+ units" never fires (4 units = a 10 in gap). The fix: **the brain thinks in inches, the ring in units.** A fighter knows "he's got 6 inches on me" off the tale of the tape and picks his plan off that; the plans then change his feet and his punches by amounts that don't depend on how tiny the geometry is. The geometry (own-reach checks) stays exact.

**Perception** (typed, `tsc`): `me.rs`, `me.reach`, `him.rs`, `him.reach` (reach in inches, rs the host's scale). The brain's `gap` = `me.reach - him.reach` (+ = he's the long man). `BR.size.on = 0` must give back the s1 brain exactly (hash 118b22b1): every new roll sits behind the gate.

**1. Own arms (every level, through his eye for distance).** The brain's punch table is scaled by his own rs: `this.pu[p].max = PUNCHES[p].max x rs` (combo min/max too). Every "does it reach" check reads it: `fits`, the counter picks (`counterFor`, the reply that reaches), `pickCombo` (first punch, the rest, the working range), `fitReach`. A Novice's `dSeen` noise already blurs it; nothing extra.
- **The danger line** = his jab x `him.rs` (+ a step). Read where the brain asks "can he hit me from here": the counterman's draw bait, the long man's band, the short man's waiting spot.

**2. The long man: own the geography** (Fundora-Tszyu, Fury-Ngannou). Gate: gap >= `BR.size.long` (3 in), the eye `k.range`, and a style that lives outside (`tr.range` > .5) or a plan that says so.
- **Full extension:** his range target moves out to the end of his own jab (`pu.jab.max - 1`), never past it (no three-quarter jabs from too close). Jab share up a little (Klitschko's 75% is the far end).
- **The double step:** when the short man walks in (`him.closing` fast, inside the danger line), he fights harder for the distance (`push` up) and steps back more than the man steps in. Uses the step-out he already has; an out-boxer's tool, a slugger's barely.
- **Rushed / on the ropes:** pivot out (`lateral` up) or tie up (the clinch he has). On the ropes the edge halves (he can't step back): the double step is off.
- **The mistake (Ed's call, Oct 22: in s2, by level):** a tall man who forgets his size and **fights small** (Fundora before Tszyu): per round, chance by level (Novice ~.5, Intermediate ~.3, Pro ~.1, World 0, `BR.size.small`), his range target comes in like a pressure man's and the band logic is off that round. A World-class man never does it; the corner's "jab" or "move" call ends it (the corner already pushes range).

**3. The short man: two plans** (all four sources: don't chase). Gate: gap <= -`BR.size.long` and the eye. The plan is picked once a fight by style, then by what's working (World class switches mid-fight on `punchVal`):
- **a. Get through it** (swarmer, slugger, pressure plans, `tr.initiative` high): **jab his way in** (Atlas on Tszyu: you don't have to out-jab him, make him respect yours): the jab-in step gets more likely when he's between his own reach and the danger line; feint the entry (World class, video batch 1); once inside, **around the mountain**: `lateral` up while he's inside the long man's reach (never parked in front), body share up, hooks and uppercuts. Never free: each entry walks through the danger line.
- **b. Don't stand in it** (counter, out-boxer, `tr.initiative` low): his range target sits just outside the danger line (a step past his jab x him.rs), output down a little, the draw bait (`dlBait`) more often: make him come, make him miss, counter (Romero, Inoue, Crawford "walk in the rain"). The tall man's output drops too.
- **Standing in the band** (the middle, where only the long man lands) is what a Novice does: no plan, walks straight in or stands at his own style range.

**4. By level** (`k.range`, plus the `lv` sheet): a Novice ignores the size (no plans, own arms through his blurry eye); an Intermediate half-runs a plan; a Pro runs the plan for his style; a World-class man picks the plan by what's working and feints the entry. The plan strength scales `lerp(0, 1, k.range)` like the other range knobs.

**5. The counter-puncher (46.7 after s1) first.** Measure before building: his counters by rs (thrown, short misses, landed) on a frozen copy. His game is exact range: own-arm counters and the danger line in the draw bait should bring him back to ~48.

**Sims** (`tests/size.js`, mirror, forced gap): the table above (4 in 52-53, 8 in ~56), now with the brain on; the styles (counter back to 48+, nobody out of 48-53); the hash with `BR.size.on=0` = 118b22b1. If the long man's plan makes size worth more than the table, `per` comes down first (the brain stays), s3 rechecks it all.

**Folded in, built later** (`research/dynamic.md` For Last Bell 3-7): read the feet (attack when his weight drifts back, Inoue), exit or commit (the man who stays in the middle after his punch, Tank-Cruz), feints by temperament, ring cutting as a parallel step (check `cutK`), the corner's "two lies" line. The head-on-cheek inside lock stays parked (the short man's inside home, after 3D with the clinch rework).

## Left out on purpose
- **Leaning in the clinch, leverage, weight** (`research/size.md` F): it lives in the clinch rework, which moved after 3D. Inside one division the weights are close anyway (only heavyweight has real gaps).
- **The tall man inside on purpose** (Fundora, section E) as a trait: after 3D. The mistake version (he forgets his size) is in s2 (Ed, Oct 22).
- **The tall man's retaliation** (he loses the range fight and comes forward square, the counter window): a brain idea for the design pass after 3D (`emo.frus`).
- Tale of the tape, "reach +6" on screen: parked WIP, not part of this step (Ed's call 5).

## The steps (one per session)
- **s1, sizes and arms (medium effort).** Roll `ht`/`reach` (own dice, overrides), `rs` scales every punch's range in the host, `look.h` from `ht`. The brain still thinks everyone is 78: this measures the raw effect of longer arms alone. New `tests/size.js`: mirror matches with a forced gap 0/4/8/12 in, by division band. Moves the hash.
- **s2, the brain knows (high effort).** `me.rs`/`him.rs` in Perception (typed, `tsc`), own-reach checks, the danger line, the band for the long man, the two short-man plans, gated by level. Sims vs the table above.
- **s3, the pre-3D baseline (medium; Ed, Oct 22: a full test + a light review, one session).** 3D is render only, so these numbers stand until the brain pass after 3D: make them complete.
  - Full test: `check.sh` with every part (s a l f sp g: styles 48-53, specials 48-54, guards ~48-58, one level down 15-20, audit 52/15/29, stops 30-35, KDs .4-.6), judges (`judges.js`), cheese hard + expert (haymaker not rechecked since 2a), drama (lead change ~40%, comebacks ~11%), `size.js` on the table, swarmer short vs outboxer tall at equal skill: 42-50% for the short man (over 50 = entry too cheap, under 38 = too costly).
  - Light review (no new features): anything out of band gets a knob only (the counter-puncher, KDs); docs and ROADMAP agree; branch list current; `tsc` clean; the hash written down as the pre-3D baseline. No deep code review (3D doesn't touch the engine).
  - Then CLAUDE.md, ROADMAP, and 3D is next.

## s1, built (Oct 22)
Hash 40 118b22b1 (`SIZE.on=0` gives back 4fba7bcf).
- `SIZE` in TUNING (`per` .005, `sd` 2.3, `ape` 1.6, clamp -3..+9, `heavy` 1.3, `lean` outboxer +.75 / swarmer -.75, the division table `div`), `sizeOf(sheet)` (own dice off name, style, stats; `sheet.ht` / `sheet.reach` override; `sheet.div`, default welter), `punOf(rs)` -> `F.pun`: the host's resolve, miss, the straight-to-hook swap and the stick jab read his own scaled punches. `F.size` = { ht, reach, rs, h }. The brain still reads `PUNCHES` (78 for all): that's s2.
- Drawn height: `FX.looks[i].h = F.f[i].size.h` (ht / division mean, .9-1.1). The lab puts `div` on the sheet; `genFighter` keeps `div`; the 10 P4P stars carry `ht`/`reach` (Inoue 65/67.5, Usyk 75/78, Stevenson 68/68, Rodriguez 64/67, Benavidez 74/74.5, Bivol 72/72, Nakatani 68/68.5, Haney 68/71, Ennis 70/74, Collazo 62/61; web and memory, check Haney / Ennis / Rodriguez on Wikipedia).
- `tests/size.js` (mirror, forced gap, 1200 a gap), long man's win %: `per` .015: 4 in 61.1, 8 in 69.7, 12 in 75.2 (a whole skill level: he lands more, KDs don't move). .0075 (600): 56.0 / 57.9. **.005: 4 in 53.6, 8 in 57.4, 12 in 59.2** (the table: 52-53 / 56). Rs reads only the gap, so the division bands come out the same: the table's heavier-is-stronger column isn't modeled (a `per` by division if s3 wants it).
- Full check `s1c` (per .005, lean 1.5): audit 51.8 / 15.1 / 29.1%, stops 34.5 (finish 33.0), KDs .39, body 5.5%, one level down 15.7 / 16.0 / 15.7; **styles: outboxer 53.8, slugger 51.7, bp 50.6, swarmer 47.3, counter 46.7**. Lean off (`s1n`, styles): slugger 53.2, outboxer 51.7, bp 50.3, swarmer 48.5, counter 46.2. So the lean was ~2 points to the outboxer, ~1 off the swarmer: halved per call 3 (not rechecked; s3 does it after s2).
- **The counter-puncher drops ~2 with size whatever the lean** (48.3 before s1): his game is exact range, and his brain still thinks every man reaches 78. Short, his counters fall short; long, he passes on counters he'd land. s2 (own reach in the brain) is the fix; re-read him first in s2.
- KDs .39 at the bottom edge of .4-.6 (was .49): watch in s3.

## s2, built (Oct 22)
Hash 40 **37081a79** (`BoxerBrain.BR.size.on=0` gives back s1, 118b22b1).
- Perception `me.rs/reach`, `him.rs/reach` (typed). Brain: `size(P)` each frame (rs, hrs, the gap in inches, the plans once a round), `mx(p)` his own reach, `danger()` the other man's jab x his rs. Own-reach checks in `changeFor`, the counters (`counterFor`, the fallback that reaches), `pickCombo` (first punch, the rest, the working range), `fitReach`.
- Knobs `BR.size`: plan from a 3 in gap (`long`, sure by `full` 6), strength by the eye (`k.range` .35 -> .85: Novice none, World class all). The long man: `szL` (jab share x `jab` .6), `szO` = szL x how outside his style is (range target to the end of his jab - `end` 1, the double step `dbl` .8 when the man walks in inside `danger + step`, pivot `piv`); on the ropes it halves. The mistake: `small` .5 x (1 - eye) a round, range to `smallR` 54. The short man: plan by style (`tr.range` < .5 'in', else 'out'), World class flips after a lost round (`sw` x eye^2); 'in': jab at the door (`jabIn`), inside the danger line - `inD` around the mountain (`mount`) and dig (`dig`); 'out': range to `danger + out` 2, output x (1 - `wait` .15), the draw bait x (1 + `draw`).
- **Counter-puncher** (his 4 pairs, 300 each, size on vs off): **47.4 -> 49.1**. His counters know his arms.
- **`size.js`** (rating 80, 1200 a gap, brain on): 4 in **50.3**, 8 in **54.2** (off, pooled with s1: 52.7 / 55.9). The short man's plans take ~2 points back; a touch under the table (52-53 / 56). s3's knob if it wants it: `per` up a hair (.006), not the plans.
- **Check `s2b`** (styles 2x300/pair + audit 3x500): **styles 48.5-52.1** (bp 52.1, outboxer 50.5, slugger 50.2, swarmer 48.7, counter 48.5: all in band, tighter than s1's 46.7-53.8), audit 51.7 / 14.9 / 28.7%, stops 30.7 (low half of 30-35), KDs .4-.5. Levels, finish, specials, guards not run: s3 (the pre-3D baseline) runs them all.
- Not built (kept for after 3D): the short man's lunge as a size tool (`research/skillr.md` #23), probing the distance with the lead hand and pinning (#22), the long man's roughness inside, read the feet, exit or commit.

## Ed's calls (answered Oct 22)
1. **Strength: half of real** (the table above, well under one skill level).
2. **Reach relative to the division**: every division averages the 78 jab, only the gap matters.
3. **Style and size: the realistic lean** (Ed: "the realistic choice based on research"). Out-fighters need reach, in-fighters are the short men who bob under it (`research/size.md` 2-3: Wikipedia, Tyson, Frazier; no hard numbers, so keep it small): the reach mean by style, out-boxer +1.5 in, swarmer -1.5, the rest 0 (the field's mean holds). The ape and height rolls stay as they are. s3 checks styles 48-53 with it on; if it knocks one out, shrink it before touching anything else.
4. **Leverage, the lean and Fundora wait** for the clinch rework and traits (after 3D).
5. **No intro line**: the reach shows when the tale of the tape comes back (parked WIP, `claude/bold-faraday-bryk6t`). Nothing on screen in this step but the drawn height.
6. **The P4P stars get their real sizes**: a small table on `P4P_2026` (Inoue 65/67.5, Usyk 75/78, Bivol 72/72 ...), Wikipedia infobox figures.
7. **The tall man fighting inside (Fundora before Tszyu) is a mistake in s2, by level** (Ed, Oct 22): a Novice or Intermediate tall man forgets his size some rounds; the trait version waits for traits.
