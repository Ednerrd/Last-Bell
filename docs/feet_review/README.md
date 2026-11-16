# The feet review (Nov 16): before / after frames for Muse

Each PNG: top row before (the Oct 25 F1h feet), bottom row after (Nov 16). Fighter looks differ between the runs (random look): compare the feet.
- `stance_before_after.png`: the idle stance, standard guard, every style.
- `cross_before_after.png`: a rear cross, punch clock 0 -> .9.
- `hook_before_after.png`: a lead hook, punch clock 0 -> .9.
- `jab_before_after.png`: a jab, punch clock 0 -> .9.

What changed (render only, `same.js 40` 4f8e6d15 holds), `ST2` in `index.html`:
- `rearHeel` .8 -> .48 rad: the rear heel at rest 46 -> ~27 deg.
- `heelMax` 1.05 -> .7: the most a heel ever lifts, 60 -> 40 deg (Muse's flag: the cross still hit 60). The lift comes from the shin leaning far over the foot, not only the punch.
- `turnB` .22: the rear boot turned out ~45 deg, drawn 22% shorter from the side; `turnX` .14 more on the cross; `turnF` .18 the lead boot on the hook.

Rear heel angle measured over live fights (~3,100 frames each, 8 x 2.5 s grabs):

| | median | p90 | p99 | max | frames >= 45 deg |
|---|---|---|---|---|---|
| before | 46 | 46 | 52 | 60 | 100% |
| turned + heel .48 (heelMax still 1.05) | 29 | 38 | 58 | 60 | 4.1% |
| now (heelMax .7) | 28 | 35 | 40 | 40 | 0% |
