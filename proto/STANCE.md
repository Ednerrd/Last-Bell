# The stance spec (3D boxer)

Oct 23, 2026. What the research says a boxer's stance looks like, set against what `proto/boxer3d.js` does today, and the changes it points to. The sources are in `research/stance.md` (our research + 25 coaching clips). This file is **docs only**: nothing below is built yet. Ed's screenshots (real boxers next to ours) are the check before and after.

Source tags: **[R]** our research files, **[YT]** coaching captions (ids in `research/stance.md`), **[Ed]** Ed's call, **[gen]** standard coaching with no clip behind it (the stance tutorials with the numbers were bot-walled), **[geo]** worked out from our rig.

## 1. Our man today (hs 1, G 1: ~100 tall)
| | Today | Where |
|---|---|---|
| Feet | lead +9.5 fwd / +6.1 out, rear -9.5 / -7.6: 19 front-back, 13.7 across, 23.4 apart (shoulder joints 24.8) | `stanceL`, `stanceW` |
| Lead knee | measured standing (Oct 23): ~37° of bend (peekaboo 54); the ~11° [geo] guess was wrong, the knees were never the miss: the stride was | `crouch` line, `GUARD3D.c` |
| Rear leg | too far for the leg at rest, so the rear heel has to come up to reach [geo] | IK |
| Chest turn (blade) | std 34, high 26, peekaboo 18, philly 52, cross 24, low 38 | `GUARD3D.bl` |
| Hips | x .55 of the chest: **hips squarer than shoulders** | `hipBlade` |
| Weight | hips 1.5 behind center, a slow sway on top (`RHY.sw`) | `hipF` |
| Torso lean | lean x .55 + tension: std ~4-6° | `pitch` |
| Toes | lead 9° **in** (toward his rear side; read as out until Oct 24), rear 46° out | `toeYaw` |
| Rhythm | out-boxer bounces on the toes, slugger flat, counter still, swarmer bobs | `RHY` |

## 2. The base stance (every man, before style)
1. **Knees soft, a spring, not a squat**: bent so a slip is one move, never locked [R: Roach; YT: Jeffries, Betts]. Target **lead knee 20-35° of bend** [gen]. Ours ~11°: **the main change.** Note [geo]: knee bend buys little drop at first (11° -> 35° is only ~2 units of hip drop on our rig), so it's cheap to do and won't make him look short.
2. **Feet about shoulder width, staggered on a line toward the man**, never crossed, never lined up heel-to-heel, not too narrow, not square [R: Roach; YT: Jeffries, Skillr; gen]. Ours: 23.4 apart vs shoulders 24.8 joint / ~28 outer: a touch short. Target ~26-28 apart, the extra going front-back.
3. **Rear heel up a little, lead foot flat** [gen]; the rear heel turns over on the right hand and drops on the lead hook [YT: Jeffries, Precision]. Ours has this (and the heel is forced up by the reach problem: fix the leg, then set the heel on purpose).
4. **Lead toe a little in toward the man, rear foot turned out ~45°** [gen]. Ours: lead 9° out, rear 46°: point the lead toe straight or slightly in.
5. **Weight**: slightly back at rest in range (head far from him, hips back) [YT: Betts]; ~50/50 when moving around [YT: Betts]; forward through the punch, back home after [YT: Jeffries, Precision]. A hook loads ~60% on the front foot, Tyson's ~70% [YT: Jeffries]. Ours sits 1.5 back: fine as the base, styles move it (section 3).
6. **Hips and shoulders are two numbers** [YT: Canelo breakdown]. Bladed legs with square shoulders (Canelo) is real; hips squarer than shoulders (ours, every man) is the odd one. Default: **hips about as bladed as the chest**, then guards split them.
7. **Chin down, elbows in, lead hand up** through steps and pivots [YT: Jeffries; R]. **Don't lean the head over the front foot** [R: boxinglife; YT: Betts]: the head stays back of the lead knee.
8. Traditional blade **~45°** [YT: Jeffries]. Ours 34 for standard: raise toward 40-45.

## 3. By guard (the silhouette is what reads)
| Guard | Feet / blade | Crouch / lean | Hands | Head | Source |
|---|---|---|---|---|---|
| Standard | bladed ~45° | soft knees, upright | gloves a little out front, rear at the chin | small drift | YT Jeffries |
| High | **square-ish** | slight crouch, a little forward | both gloves at the brow / temples, elbows on the ribs, close through the middle, open to the sides on hooks | almost still | YT Skillr, Jeffries; R skillr |
| Peekaboo | **square**, lead foot ~45° | **deep knee bend, spine upright**, weight forward | gloves on the cheeks (not over the eyes), forearms on the center line, elbows on the liver / middle | side-to-side U / figure-8, never still, never backward | YT Jeffries, Fight Club; R |
| Philly | **most bladed** | a little bent over, weight back (lean-back) | lead forearm flat across the belly, elbow on the ribs; rear glove at the cheek; **lead shoulder up to the chin**; elbows down, never winged [Ed] | small rolls and tilts, the shoulder roll | YT Skillr, Pro Striking; R; Ed |
| Cross-arm | **square** | crouched, **front-heavy**, hunched forward | Ed's Norton stack: rear forearm on top across the chest under the chin, rear glove on the lead shoulder; lead forearm below across the belly, glove at the rear side; elbows tight | almost none, a dip under the block | Ed (wins over the clips' "across the face") |
| Hands low | tall, bladed | upright, can lean back | hands at the belt, wrists loose, lead dangles; **chin stays tucked** | head does the defending, bouncy | YT FightMap, Skillr; R |

Ours already fits most of the hand spots. The gaps: high and cross need to be squarer (26 / 24 is close; they need **square hips** too), peekaboo needs the **deep knees** and the weight forward, Philly needs the lead shoulder up and the weight back, cross-arm needs the hunch.

## 4. By style (rest weight, height, how he moves)
| Style | Height | Rest weight | Feet | Head / rhythm | Source |
|---|---|---|---|---|---|
| Out-boxer | tall, on the toes | back, 50/50 moving | narrow-ish (Hearns, Leonard), light bounce | pulls straight back (tall men) | R skillr, size; YT Jeffries |
| Boxer-puncher | middle | slightly back | standard | moderate | R |
| Counter | low, still | back (loaded) | quiet, small resets | "still but loose", torso shifts in the pocket | R; Ed |
| Slugger | upright or hunched, heavy | even to forward | wide, **flat, planted** | little head | R |
| Swarmer | **low** | **forward** | short shuffles, walks straight in, never backs up | bob and weave; **Frazier hinges at the waist**, Tyson bends the knees with the spine up | YT MMA, Jeffries; R |
| Awkward | odd | shifts | odd steps, leans, drifts | broken rhythm | R |

So **crouch comes in two kinds**: knees (Tyson, Ball, peekaboo) and a waist hinge (Frazier, cross-arm hunch). Today we have one `crouch` + `lean`. The table needs a rest-weight column and a hinge column.

## 5. Moving (what's built, what's not)
- Step-drag, nearest foot first, never cross: **built** (round 2) [YT Skillr; R Roach].
- **Pivot: lead foot pinned like a nail, rear foot swings ~90°, lands back in stance**, sink a little first, then rise [YT Skillr, Jeffries, Precision]. Ours: lone-foot pivots exist; check they pin the lead and swing the rear.
- **The foot lands with the punch** on a stepping shot (out of time looks off-balance) [YT Jeffries, Precision]. Ours: the jab's lead step; check the timing against impact.
- Weight forward through the punch, home after [YT]: the hip carry is ~10-20% of stance width toward him on a cross [R combat_research].
- On the toes = light, in and out, costs gas; flat = power and balance [YT Jeffries]. Matches `RHY`.
- Guards blend, not fixed (Floyd: high, long, low, shell; Frazier cross-blocks on the way in) [YT Pro Striking, MMA]. Later: phase 3.

## 6. States
- **Tired**: bounce dies, flat feet, shorter steps, hands drop [R]. Real amateurs had the guard down 24 / 31 / 34 s of rounds 1-3 [R tells, Dunn 2017]: the hands should sit lower more often, round by round. Mouth open, head up are blog-only [R].
- **Hurt**: knees dip, feet wider and slower, stumbling side steps; the shell goes gloves to the forehead, elbows in, **weight on the back foot** [R hurt, mind_finish]. Flat-footed the next round, then back on the toes after the corner [R].
- **Inside**: square up, short hooks off a hip rhythm, head on his chest or cheek [R dynamic].

## 7. The changes, in order (for when Ed says go; render only, hash 3fd3c667 holds)
1. **DONE (Oct 23): the long stance.** `B3.stance` { L 15 (was 9.5), close 3.5 shorter when he's on top of his man (dOp 45 -> 25), low 2 more crouch }. Measured standing (scratch `measure.js`): feet front-back 17.3 -> 28.4 per 100 of height, hips 49.7 -> 47.5, head 86.6 -> 84.4, lead knee 37 -> 46°, rear 36 -> 40° (peekaboo 60 / 54). Fast seed 7, 120 s: glove-in-head >2 units .11 -> .14%, feet crossing 1.0 -> 1.8% of frames, steps unchanged; `same.js 40` 3fd3c667. Was: **Knees**: base lead knee to ~25° (more crouch from the knees, not the hips folding), fix the rear leg's reach. One knob, biggest look change. Check with Stand + Gray.
2. **DONE (Oct 23): the blade split.** `GUARD3D.hb` (hips) apart from `bl` (chest): standard 40 / 40 (chest was 34), high 26 / 16, peekaboo 18 / 10, philly 52 / 50, cross 24 / 14, hands low 38 / 38. A rear-hand shot turns the extra hip blade back x `B3.stance.back` .6, so the cross still takes the hips past square (standard: hips 40 -> -13 at the peak, chest 40 -> -24). Measured standing (hips / chest, deg off square; feet line 68.5 for all): standard 18 / 35 -> 39 / 41, philly 28 / 53 -> 49 / 53, hands low 20 / 39 -> 37 / 39, high 14 / 27, peekaboo 9 / 19, cross 13 / 25 unchanged (square already). Fast seed 7, 120 s: glove-in-head >2 units .14% (same), feet unchanged; `same.js 40` 3fd3c667. Was: a hip blade per guard, standard toward 45°, hips at least as bladed as the chest; square hips for high, peekaboo, cross.
3. **DONE (Oct 24): rest weight + hinge per style.** `RHY.wt` / `lo` / `hinge` by style, `GUARD3D.wt` / `hinge` / `knees` by guard: rest weight (+ forward) out-boxer -1.5, counter -2, slugger 1.5, swarmer 4.5, boxer-puncher / awkward 0 (awkward drifts ±2.5); guards high .5, peekaboo 2, cross 2, philly -2, hands low -1.5. Moving halves it (50/50 on the move). Lower off the knees: swarmer 1.5, counter 1, out-boxer -1 (taller). Waist hinge (deg, capped 12): swarmer 9 (Frazier), slugger 2, cross guard 7 (the hunch); it tips the hips .3 and sits them back; a peekaboo man takes his style's hinge in the knees (Tyson). Measured standing (`proto/tools/stance.js`; weight = hips along the feet, 50 = even): was 44.6-47.3 for every style and 44.8-45.9 for every guard; now (standard guard) out-boxer 40, boxer-puncher 46, counter 39, slugger 49, swarmer 57, awkward 42; (boxer-puncher) peekaboo 52, philly 39, cross 49, hands low 40; swarmer + peekaboo 66 with the lead knee 80°, swarmer + cross 63 with the head 4 behind the lead foot (the most forward). Fast seed 7, 120 s: glove-in-head >2 units .14 -> .08%, feet unchanged; `same.js 40` 3fd3c667. Was: swarmer / peekaboo / cross forward, out-boxer / counter / Philly back; Frazier-type waist hinge vs Tyson-type knees.
4. **DONE (Oct 24): lead toe + rear heel.** The lead toe was already **9° in** (toward his rear side), not out: section 1 read the sign of `toeYaw` backwards (`proto/tools/stance.js` measures it off the bones: lead +8.6, rear +45.8 out), so the toes stay. The rear heel is set on purpose: `RHY.heel` by style (out-boxer .3, boxer-puncher .3, counter .2, slugger .15 the most planted, swarmer .35, awkward .25) + `GUARD3D.wt` x .03 (weight forward lifts it) + the toe bounce on top; was .1 + the bounce for everyone. The rear foot sits back `B3.stance.rear` 5 x the resting lift so the raised heel keeps the leg long. The rear heel drops on the lead hook (x 1 - .7 of the body turn). Measured standing (rear heel, deg of the ankle -> ball line, a flat foot reads ~15.6): was 19.1 (slugger) - 24.9 (out-boxer), now 20.9 - 32.0 (counter 23.8, boxer-puncher 29.4, swarmer 30.1); rear knee 39-55 -> 40-58 (it would have been 41-61 without the foot back); weight reads ~2 points more forward everywhere (the rear foot moved, same order). Fast seed 7, 120 s: glove-in-head >2 units .08 -> .11% (noise), feet unchanged (4.53 -> 4.58 steps/s, pairs .98); `same.js 40` 3fd3c667. Was: lead toe straight or slightly in; rear heel set on purpose.
5. **DONE (Oct 24): guard details.** `GUARD3D.cl` (shoulders at rest: lead up / fwd, rear up / fwd) + `chin` (head tucked, deg), held x .7-1 with the tension, x .7 gassed, off on the walk, in the clinch, down or on the stool. Philly: lead shoulder up 7 / fwd 2, chin 4: the lead shoulder joint 7.7 -> 3.5 under the chin (the deltoid's top meets it), the rear stays. Cross-arm: both shoulders up 1.5 / fwd 2 (rounded), chin 4, on top of change 3's hinge: shoulders 7.5 -> 6.4 under the chin. Peekaboo: crouch `c` 9 -> 13, lean 12 -> 7 (deep knees, spine upright), chin 2: boxer-puncher head 87.0 -> 85.7 per 100 of height, lead knee 57 -> 63°; a swarmer in peekaboo 80.7 / 85° (Tyson low). Standard / high / hands low unchanged. Fast seed 7, 120 s: glove-in-head >2 units .11 -> .08%, feet unchanged; `same.js 40` 3fd3c667. `proto/tools/stance.js` reads the shoulders vs the chin and the head height. Was: Philly lead shoulder up to the chin, cross-arm hunch, peekaboo deep crouch.
6. **DONE (Oct 24): pivot + punch-foot timing.** Measured first (new `proto/tools/land.js`, seed 7, 120 s): the stepping jab's lead foot landed at .63 of the punch (p25-p75 .57-.69) with the hand at ~.54-.6, a power shot's at .52; turns came as lone steps of either foot (lead 11, rear 9). Now: a punch's lead step is timed to land at `B3.step.land` .56 off the punch's measured pace (`pRate`): jab .57 (.52-.64), power .52, body .46. A turn of the stance past `B3.step.piv` .26 rad is a **pivot**: the lead foot stays pinned, the rear swings round it on an arc to where the turned stance puts it, the hips sink `sink` 1.5 and rise; lone lead steps 11 -> 3, ~.23 pivots a second a man. Feet (seed 7 / 11): steps 4.58 -> 4.65 / 5.31 -> 5.46 a second a man (the pivots), feet crossing .018 -> .009 / .009 -> .003, widths and body speed unchanged. Glove-in-head >2 units .11 -> .03%; `same.js 40` 3fd3c667. Was: check with `feet.js` (lead pinned on pivots, the step lands at impact).
7. **Tired hands** lower round by round (the Dunn numbers).
Each step: Ed's screenshots side by side, `proto/tools/clip.js` (glove-in-head stays ~.1%), `same.js 40` = 3fd3c667.

## 7b. What the photos say (Oct 23, sheets v2)
Real-fight photos (2025-26: Usyk, Inoue-Nakatani, Canelo-Crawford, Bivol-Beterbiev 2, Dubois-Wardley, Paro-Crocker, Stevenson; classics: Ali, Norton, Roy Jones; local only in `shots/stance/`, gitignored, copyright, reference only) next to ours standing:
- **The stride is the big miss.** Real men stand with the feet far apart front to back, roughly 1.3-1.6x shoulder width by eye (ours 19 units = ~.75x), and **hips sit low** off deep knee bend. Ours look tall with the feet under the hips. So change 1 is **knees + a longer stance together** (`stanceL` 9.5 -> ~14-17 by eye), not knees alone; the [gen] "about shoulder width" line undersells it.
- The rear leg runs long and straight-ish behind with the heel up; the lead knee is over the lead foot.
- Hands-low men (Ali, Roy) lean far back off that long stance. Norton's cross stack is low with the trunk hunched over it.
- The sheets are by-eye: a measured pass (feet apart / height on 3-4 full-body side shots) before setting the numbers.

## 8. Gaps
- No real foot width, toe angles or knee degrees from a source we could read: the [gen] lines are standard coaching. The bot-walled stance tutorials (ids in `research/stance.md`) would settle them; Ed can paste a transcript or two.
- Southpaw: a mirror is all the research says.
- Ali, Pacquiao, Hopkins, Holyfield stances: nothing. Naseem, Crawford, Usyk, Winky: the digger's own knowledge only.
- **Ed's screenshots are the real test**: a freeze-frame of a real boxer per guard next to ours, same angle.
