# Size: height, reach, leverage (design draft, Oct 22)

ROADMAP item 3. The last engine step before 3D. Research: `research/size.md` (sections 1-7, "For Last Bell" A-H, video batch 1). This is the plan; nothing is built. **Ed's calls are at the bottom.**

## What's in today
- Every man has the same arms. The jab reaches 78, the cross 76, hooks 56-60, uppercuts 50-54 (`PUNCH` in the engine, `PUNCHES` in the brain, the same numbers twice).
- `look.h` (0.95-1.05) and `look.build` (by division) only change how he's drawn. The engine never reads them.
- The brain picks where to stand off its own style: `range = lerp(50, 76, tr.range)` plus the mode, the plan, fear and so on (`brain.js` ~1246). It never thinks about the other man's arms.
- Where reach is read (small footprint): host `resolve()` range check (~2681), `extRaw()` the punch's sweet spot (~1962), `TUNE.reach` reaching for a power shot (~2723), the miss kind short/jammed (~2842), the jab-in-step check (~2626). Brain: about 10 `PUNCHES[x].max` "does it reach" checks (combos, counters, the step-in fix).

## The idea in one line
Reach stretches every punch a man throws. The long man gets a strip of floor where only he lands (the free band). Both brains know it and fight over it: the long man holds the band, the short man either gets through it or refuses to stand in it. No flat "tall man bonus": the edge comes from range, feet and the brain.

## The numbers
- **Each fighter rolls `ht` and `reach`** (inches) from his division's table (`research/size.md` section 7: fly 64.5/65.5 ... welter 69.5/71.5 ... heavy 75.8/79). Height sd 2.3, reach = height + ape, ape ~ N(division, 2.4), clamped -3..+9. Heavyweights get the fatter tail (sd x1.3: Fury, Wilder).
- **Own dice**, like `flawOf()`: rolled off his name, so the same man is always the same size and the fight's rng never moves for it. `sheet.ht` / `sheet.reach` override it (tests, the P4P stars).
- **Reach scale `rs = 1 + .015 x (reach - his division's mean reach)`.** Every punch's min and max x `rs`. A 6 in gap = ~9% = 7 units of jab (78 vs 85). That is the free band.
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

## The brain (where the fight actually changes)
Perception gets `me.rs` and `him.rs` (he can see the other man's arms; it's on the tale of the tape). Every "does it reach" check uses his own `rs`. The danger line is the other man's jab x his `rs`.

**The long man** (any style with `range` trait over ~.5, and a real edge, ~4+ units): his range target moves into the band, between the other man's jab + 2 and his own jab - 1. Jab share up (Klitschko threw 75% jabs). Rushed: pivot out and rebuild the band (uses the existing step-out), or tie up (the clinch he already has). Back on the ropes: the edge halves (he can't step back).

**The short man, two plans** (all four sources: don't chase):
1. **Get through it** (swarmer, slugger, the pressure plans): don't walk in straight; enter behind his jab (his hand's out, the recovery window), behind feints, or slipping under it; once in, stay on the chest, body share up, hooks and uppercuts. It costs: each entry eats a jab about as often as the long man lands at range. Never free.
2. **Don't stand in it** (counter, out-boxer, short): sit just outside his reach, make him step in, counter as he comes (Romero, Inoue, Pacquiao). His output drops, and so does the tall man's.

**By level** (`k.range`, the eye for distance): a Novice ignores the size and walks straight in (or stands in the band); a Pro uses the plan; a World-class man picks the plan by what's working and feints the entry many times (video batch 1, Usyk/Loma).

## Left out on purpose
- **Leaning in the clinch, leverage, weight** (`research/size.md` F): it lives in the clinch rework, which moved after 3D. Inside one division the weights are close anyway (only heavyweight has real gaps).
- **The tall man inside on purpose** (Fundora, section E): a trait, so it goes with traits (after 3D).
- **The tall man's retaliation** (he loses the range fight and comes forward square, the counter window): a brain idea for the design pass after 3D (`emo.frus`).
- Tale of the tape, "reach +6" on screen: parked WIP, not part of this step (Ed's call 5 below).

## The steps (one per session)
- **s1, sizes and arms (medium effort).** Roll `ht`/`reach` (own dice, overrides), `rs` scales every punch's range in the host, `look.h` from `ht`. The brain still thinks everyone is 78: this measures the raw effect of longer arms alone. New `tests/size.js`: mirror matches with a forced gap 0/4/8/12 in, by division band. Moves the hash.
- **s2, the brain knows (high effort).** `me.rs`/`him.rs` in Perception (typed, `tsc`), own-reach checks, the danger line, the band for the long man, the two short-man plans, gated by level. Sims vs the table above.
- **s3, the balance re-check (medium).** The full `check.sh` (styles 48-53, one level down 15-20, audit 52/15/29, stops 30-35), `size.js` on the table, swarmer short vs outboxer tall at equal skill: 42-50% for the short man (over 50 = entry too cheap, under 38 = too costly). Then CLAUDE.md, ROADMAP, and 3D is next.

## Ed's calls (answer on the phone, short is fine)
1. **How strong:** the table above (half the raw boxing numbers, under one skill level)? *My pick: yes.*
2. **Reach relative to the division** (every division averages the same 78 jab, only the gap matters) or **absolute** (a flyweight's jab is 71, a heavyweight's 85, same ring)? *My pick: relative. Absolute changes every division's fights and the ring isn't scaled.*
3. **Style and size:** do out-boxers roll a bit longer and swarmers a bit shorter (real life leans that way), or no link? *My pick: no link for now. A link stacks on the style balance we just finished.*
4. **Leverage, the lean and Fundora** wait for the clinch rework and traits (after 3D). OK?
5. **Show the reach** before the fight: one line at the intro ("Reach: +6 for Reyes"), or wait for the tale of the tape? *My pick: one intro line in s1, so you can coach for it. It's tiny and render-only.*
6. **The P4P stars** get their real heights and reaches (Inoue 65/67.5, Usyk 75/78, Bivol 72/72...)? *My pick: yes, it's a data table.*
