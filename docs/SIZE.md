# Size: height, reach, leverage (design draft, Oct 22)

ROADMAP item 3. The last engine step before 3D. Research: `research/size.md` (sections 1-7, "For Last Bell" A-H, video batch 1); **new since this draft: `research/dynamic.md`** (Oct 22, Teddy Atlas batch 1 + Ed's paste: Fundora-Tszyu's full-extension jab and step-back double, Fury-Ngannou geography, the short man's two ways in (jab in, or draw the tall man in), around the mountain, the head-on-cheek inside position, ring cutting): not yet folded into this plan. s1 is built (Oct 22, section "s1, built" below); next is s2 (the brain, high effort), which should fold in `research/dynamic.md` first.

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
- Tale of the tape, "reach +6" on screen: parked WIP, not part of this step (Ed's call 5).

## The steps (one per session)
- **s1, sizes and arms (medium effort).** Roll `ht`/`reach` (own dice, overrides), `rs` scales every punch's range in the host, `look.h` from `ht`. The brain still thinks everyone is 78: this measures the raw effect of longer arms alone. New `tests/size.js`: mirror matches with a forced gap 0/4/8/12 in, by division band. Moves the hash.
- **s2, the brain knows (high effort).** `me.rs`/`him.rs` in Perception (typed, `tsc`), own-reach checks, the danger line, the band for the long man, the two short-man plans, gated by level. Sims vs the table above.
- **s3, the balance re-check (medium).** The full `check.sh` (styles 48-53, one level down 15-20, audit 52/15/29, stops 30-35), `size.js` on the table, swarmer short vs outboxer tall at equal skill: 42-50% for the short man (over 50 = entry too cheap, under 38 = too costly). Then CLAUDE.md, ROADMAP, and 3D is next.

## s1, built (Oct 22)
Hash 40 118b22b1 (`SIZE.on=0` gives back 4fba7bcf).
- `SIZE` in TUNING (`per` .005, `sd` 2.3, `ape` 1.6, clamp -3..+9, `heavy` 1.3, `lean` outboxer +.75 / swarmer -.75, the division table `div`), `sizeOf(sheet)` (own dice off name, style, stats; `sheet.ht` / `sheet.reach` override; `sheet.div`, default welter), `punOf(rs)` -> `F.pun`: the host's resolve, miss, the straight-to-hook swap and the stick jab read his own scaled punches. `F.size` = { ht, reach, rs, h }. The brain still reads `PUNCHES` (78 for all): that's s2.
- Drawn height: `FX.looks[i].h = F.f[i].size.h` (ht / division mean, .9-1.1). The lab puts `div` on the sheet; `genFighter` keeps `div`; the 10 P4P stars carry `ht`/`reach` (Inoue 65/67.5, Usyk 75/78, Stevenson 68/68, Rodriguez 64/67, Benavidez 74/74.5, Bivol 72/72, Nakatani 68/68.5, Haney 68/71, Ennis 70/74, Collazo 62/61; web and memory, check Haney / Ennis / Rodriguez on Wikipedia).
- `tests/size.js` (mirror, forced gap, 1200 a gap), long man's win %: `per` .015: 4 in 61.1, 8 in 69.7, 12 in 75.2 (a whole skill level: he lands more, KDs don't move). .0075 (600): 56.0 / 57.9. **.005: 4 in 53.6, 8 in 57.4, 12 in 59.2** (the table: 52-53 / 56). Rs reads only the gap, so the division bands come out the same: the table's heavier-is-stronger column isn't modeled (a `per` by division if s3 wants it).
- Full check `s1c` (per .005, lean 1.5): audit 51.8 / 15.1 / 29.1%, stops 34.5 (finish 33.0), KDs .39, body 5.5%, one level down 15.7 / 16.0 / 15.7; **styles: outboxer 53.8, slugger 51.7, bp 50.6, swarmer 47.3, counter 46.7**. Lean off (`s1n`, styles): slugger 53.2, outboxer 51.7, bp 50.3, swarmer 48.5, counter 46.2. So the lean was ~2 points to the outboxer, ~1 off the swarmer: halved per call 3 (not rechecked; s3 does it after s2).
- **The counter-puncher drops ~2 with size whatever the lean** (48.3 before s1): his game is exact range, and his brain still thinks every man reaches 78. Short, his counters fall short; long, he passes on counters he'd land. s2 (own reach in the brain) is the fix; re-read him first in s2.
- KDs .39 at the bottom edge of .4-.6 (was .49): watch in s3.

## Ed's calls (answered Oct 22)
1. **Strength: half of real** (the table above, well under one skill level).
2. **Reach relative to the division**: every division averages the 78 jab, only the gap matters.
3. **Style and size: the realistic lean** (Ed: "the realistic choice based on research"). Out-fighters need reach, in-fighters are the short men who bob under it (`research/size.md` 2-3: Wikipedia, Tyson, Frazier; no hard numbers, so keep it small): the reach mean by style, out-boxer +1.5 in, swarmer -1.5, the rest 0 (the field's mean holds). The ape and height rolls stay as they are. s3 checks styles 48-53 with it on; if it knocks one out, shrink it before touching anything else.
4. **Leverage, the lean and Fundora wait** for the clinch rework and traits (after 3D).
5. **No intro line**: the reach shows when the tale of the tape comes back (parked WIP, `claude/bold-faraday-bryk6t`). Nothing on screen in this step but the drawn height.
6. **The P4P stars get their real sizes**: a small table on `P4P_2026` (Inoue 65/67.5, Usyk 75/78, Bivol 72/72 ...), Wikipedia infobox figures.
