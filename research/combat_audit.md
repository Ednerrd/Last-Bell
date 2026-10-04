# Last Bell: combat smoothness / pace audit (read-only, index.html @ 4283 lines)

Method: code read (engine 499-1250, render 2125-2950, loop 3950-4040). Headless instrumentation (`scratchpad/inst.js`, `inst2.js`, `inst3.js`): 80 fights × 4 rds, 75 OVR, mixed base styles, about 18k sim-s. Browser: instrumented copy `scratchpad/rec.html` (hook after `settle()` records world hip, head, gloves, lunge, bodyPush and settle deltas per frame). Ran 20 s and 60 s at 1x, 412×915 (`rec.py`, `ana2.py`). Contact sheets: `contact_ex2.png` (best) and `contact_ex.png` (`sheet.py`, 40 manual 16.67 ms `loop()` steps).
Units: 1 sim-s = 1 real s at 1x. Clock runs 3× (`CLOCK=3`), so a round is 60 real s.

## 1. Timing

| punch | base dur | measured mean (s) | windup 0–.35 | extension .35–.60 | retract .60–1 | next combo punch starts at .82 |
|---|---|---|---|---|---|---|
| jab | .30 | .270 | (no windup: still 0–.2) .054 | .2–.6: .108 | .6–.8: .054 (+.054 neutral) | .221 |
| bodyJab | .32 | .288 | .058 | .115 | .058 | .236 |
| cross (30% drawn as overhand, render only) | .40 | .362 | .127 | .091 | .145 | .297 |
| bodyCross | .42 | .380 | .133 | .095 | .152 | .312 |
| lead hook | .46 | .419 | .147 | .105 | .168 | .344 |
| rear hook | .50 | .460 | .161 | .115 | .184 | .377 |
| lead upper | .42 | .384 | .134 | .096 | .154 | .315 |
| rear upper | .48 | .438 | .153 | .110 | .175 | .359 |
| bodyHook | .48 | .437 | .153 | .109 | .175 | .358 |

dur = base × (1.2 − speed·.004) × (1.15 − .15·stamFac) (`startPunch` 975). resolve() fires at 60% (full extension). A feint lasts .24 s.

- **Gap inside a combo:** chained at p ≥ .82 when the next punch is not a `~` beat (line 745). Start-to-start is .82·dur, so .22–.38 s. Measured all in-combo gaps: p10 .233, mean .50 (this includes `~` beats of .1–.22 s plus .3 s, and feint follow-ups).
- **decide() interval:** coded as (.22–.64)·(1.25 − speed·.005)·1.45. After a combo start it is (.15–.45)·1.45. Measured mean .78 s, p10 .32, p50 .65, p90 1.28.
- **Throws:** 55.1 per fighter per round, against the audit target of about 56. That is one punch every 1.09 real seconds at 1x. Sources: decide 41%, combo continuation 47%, counter/other 8%, stick jab 5%.
- **Occupancy:** punching 30.4%, moving 48.5%, defending 19.0%, clinch 1.3%, stun 0.4%, idle 0.4%. Standing still (not punching or defending, speed < 8) is only 2.2% of the time, in runs averaging 0.10 s (p90 .27, max 1.3). **Fighters essentially never stand still.** They are never robotically idle. The opposite problem shows: nobody resets or pauses.

## 2. Movement

- `footwork()` (658–709) assigns `F.vx/vz` directly every tick. There is **no acceleration or velocity smoothing**. Speed is (34 + footwork·.6)·…, roughly 60–80 u/s. Slides run at 1.9–2.4× that.
- The punch "step" is a square wave (741): +10/(.6·dur) u/s forward (about 45–60 u/s), then an instant reversal at contact to −step·ret/(.4·dur), then velocity is set to 0.
- Headless counts, per fighter per minute:
  - Velocity jumps above 15 u/s in a single tick: **412/min** (317 of them above 40 u/s).
  - Footwork jumps: 345/min, median Δv **98 u/s in one tick**. Causes: the rope "angle off" branch (704) re-picks its side every tick and flip-flops, about 180/min. Cutting mirrors the opponent's raw velocity (689), copying his snaps, 115/min. Resuming after a punch or defense, 50/min.
  - Punch-step reversal: 57/min. Chain velocity flip: 57/min.
- Tick-to-tick x direction reversals: 95/min headless. In the browser render: 39–132/min.
- `react()` pull sets vx = −55 (1021), but the next `footwork()` overwrites it. **The pull has at most one tick (about 0.9 u) of real root motion.**
- **Side swaps:** the fighters pass through each other's x-order **1.7 times per minute**. `face()` (615) flips `dir` instantly, so the whole body mirrors in one frame. This was caught on the contact sheet, frames 33–36.
- **Rendered pops** (60 s browser run; second difference above hip 4 / head 6 / glove 9 world units per frame²): hip 179/min, head 241/min, lead glove 192/min, rear glove 191/min, both fighters together. Roughly 35% of these are by design: punch extension start at aP .35, the jab at .2, the contact turn at .6, and hit-react onset.

  Non-design causes, ranked (hip/head per min):
  1. **Combo chain at aP ≥ .8: 49/34.** The worst offenders in the whole run, with gloves jumping 30–40 u and the head 25 u in one frame. The previous punch is still about 43% extended (ext = 1 − ease(.55)) and its lunge is about 55% (up to 11 u). The new punch starts at ext 0 and lunge 0. Because `aT` is set, body() takes the `imm` path (2249) and the punch glove `gpos` is unsmoothed, so everything snaps.
  2. **Lunge: 29/28.** `sm.lgN` re-targets while p < .4, and resets on chain.
  3. **Defense change while hitT > .15: 10/16.** For example, pull→none moved the head 21 u in one frame (frames 749–750). `imm` turns off **all** pose smoothing for about 0.27 s after every hit, so any def end or start in that window snaps.
  4. **Punch start: 8/13.** This is mostly a counter starting from a slip/pull/roll pose (`imm` again). Also the uppercut `lean += .18` applies from p = 0.
  5. **bodyPush: 8/9,** and **settle: about 11** on the rear glove. bodyPush's share switches 0/.5/1 when a straight crosses aP .3/.8 (2696). Both functions are stateless per frame.
  6. **Uppercut discontinuity at aP .4: 8/8.** On line 2217, `hipY` jumps from 9 to about 3.1 and `lean` from .18 to about −.03 at p = .4, because ext is already 0.49 there. Gloves pop up to 33 u.
  7. Punch cancelled mid-flight: react() kills a punch below 25% (1018), stun() and startClinch null `act`, and the bell ends one via walkTo. The glove snaps home.
  8. Tick aliasing: frames with 0 or 2 sim steps were 5.4% at 57.6 fps headless. Minor.

## 3. Frame loop
- requestAnimationFrame with real dt clamped to .05. **Below 20 fps the game runs slow.**
- Fixed 1/60 sim on an accumulator, with `FX.acc += dt·speed` (4016). The sim ticks separately from rendering. `blendSnap` interpolates between the last two snapshots (x, z, gait, aP, defP, hitT…), at the cost of one tick (16.7 ms) of latency. A new punch, a new def, a rising hitT, or a jump above 40 u is not blended (on purpose).
- 2x and 4x speed just run 2 or 4 ticks per frame. Interpolation still holds, but at 4x a jab extension is .108/4 = 27 ms, **about 1.6 frames**, and a cross extension about 1.4 frames. At 4x punches teleport.
- Frame-rate dependent:
  - Camera `FX.cam += …*.08` and zoom `*.06` (3987–3988) are per frame, and so are the replay cam and zoom (4032). They track twice as fast at 120 Hz, which matters on the S25 Ultra.
  - **erupt mode does one `F.step(DT)` per frame (4025):** the post-KO sequence runs at 2× speed on a 120 Hz phone.
  - The replay uses `floor(FX.rp)` with no interpolation (4029–4031). At .55× or .3× it holds each snapshot for 2–3.3 frames, so slow-mo stutters.
  - Shake draws a fresh random offset every frame (2950), so there is more jitter at 120 Hz.
  - hitStop is counted in real seconds, so it is the same in wall time at any speed.

## 4. Easing
- **Power punches** (2210 and 2387):
  - Windup p 0–.35: smoothstep to −.18 (the glove draws back a little).
  - Extension .35–.6: ease-out cubic. Velocity jumps from 0 to maximum instantly; this is the intended "snap".
  - Retract .6–1: smoothstep.
- **Jab** (`jabK`, 2140): flat 0–.2, ease-out cubic .2–.6, smoothstep back .6–.8, then flat to the end.
- **Lunge** (2725): smoothstep in .1–.42, hold, out .66–1.
- **Hits:** `hitT` is set to 1 instantly and decays at 3.2/s, so a reaction lasts about **0.31 s**. Displacement k = hitT²·pow is a quadratic ease-out. A straight to the head can lean the body .42 rad, which moves the neck about 15 u in one frame. There is no anticipation or overshoot.
- **Stun:** .7–1.6 s of sinusoidal sway with root velocity −10.
- **Pose smoothing:** exponential, lean/hip at 14–30/s and guard gloves at 18–32/s. It is disabled whenever `aT && !ctr`, `hitT > .15`, or stun (2249). The punch glove itself is never smoothed.
- **Hit-stop:** .06 s on a clean head shot with dmg > 5.5, .11 s on a crit, .14 s on a knockdown (3899, 3906).
- **Screen shake:** 2.6·pow (head) or 1.6·pow (body), +3 on a crit, decays as `.02^dt`. A white flash goes up on knockdowns.

## 5. AI
- decide() is a stack of probabilities. In order: clinch check → grab → rope escape → step-out → combo (`aggr·TUNE.vol`) → feint (7%·…) → block (def·.22).
- Outcomes: **nothing 53%** (it only re-targets footwork `want/circ/cut`), combo 26.9%, block 9.5%, feint 6.0%, slide/escape 4.5%, clinch 0.1%. Every decide also flips circle direction 6% of the time and re-rolls `want` by ±4. Those retargets snap velocity because nothing is smoothed.
- Combos are a weighted pick of 39 strings. The same combo back to back happens 3.7% of the time (the .65 penalty works). Top picks: 1 (8.0%), 1-2 (7.3%), 1-1 (5.2%), 2-3 (4.9%), 2 (4.6%). Length: 1-punch 22%, 2-punch 51%, 3-punch 23%, 4-punch 4%.
- Exchanges (throws less than .7 s apart): mean 4.3 punches over 1.26 s, 62% two-way. Quiet gaps between them: mean 1.26 s, median .84, and only 14.6% longer than 2 s.

  **The rhythm is uniform:** an exchange every ~2.5 s, all fight, with no feel-outs or resets. It does not look robotic from stillness. It is monotonous because there are no tempo changes.

## 6. Contact sheet (`contact_ex2.png`: R throws 1-2-3b while L slips, then blocks)
- Frames 0–3: R's jab shows almost nothing for 4 frames (the flat .2 lead-in), then pops out.
- **Frames 12→13 (jab .80 → cross 0):** the jab arm jumps home in one frame.
- **Frames 13–21:** about 9 frames (.13 s) of near-nothing windup on the cross. In the middle of a combo this reads as a hitch, not a flow.
- **Frames 22–32:** the cross lunge carries R into L. Torsos and heads overlap heavily: inside range, `spreadView` pad → 0 below d = 32 (3974), and bodyPush caps at 14–20 u. It reads as hugging, not punching.
- **Frame 32→33:** chain pop into bodyHook.
- **Frames 33–36:** the pair swaps sides and both mirror instantly. This is the biggest single "glitch" look.
- Hit reactions on L show as a one-frame lean snap, then a smooth decay. That reads fine, but with no hit-stop on small shots it looks like jitter.

## Top issues, ranked by harm to smoothness and pace (with fixes)

1. **Combo-chain pop.** Engine 745 chains at .82; render 2249 `imm`, 2387 `gpos` and 2725 lunge all reset to zero.
   - Fix: render-only inertialization. When `aT` changes while the previous aP > .5, store the per-joint offset (hip, neck, head, both gloves, lunge) between the old and new pose in `SM` and decay it at about exp(−dt·25), adding it after pose computation.
   - Optionally skip the windup on chained punches: start the new `kOf` at k = current retract.
2. **Hits kill all smoothing** (2249 `v.hitT > .15`).
   - Fix: smooth the base pose always. Compute the hit, punch-load and stun deltas separately and add them after the smoothing step, so hits stay crisp while def and punch changes stay blended.
3. **Facing flip / pass-through** (`face` 615, `physics` 616–626, 1.7/min).
   - Fix (engine): keep the x-order. In `physics()`, when |dx| < MIN_D, push along x rather than along the vector. Or clamp `escDir`, spin and circling so they cannot cross.
   - Fix (render): animate a turn by lerping a `dirVis` over about .15 s.
4. **Snapping root velocity** (707; jitter at 689 and 704).
   - Fix: integrate toward the target: `F.vx += (vx - F.vx) * (1 - Math.exp(-dt * 12))`.
   - Lock the rope-angle sign for about .4 s (hysteresis).
   - Low-pass the opponent velocity used for cutting.
   - Shape the punch step as a sine instead of a square wave (741).
   - Make pull a short-lived `F.pullT` that footwork respects (1021).
   - This is an engine change: run `same.js`/`audit` before and after, and keep it in a separate commit.
5. **Uppercut curve discontinuity** (2217): use `p < .35` and a continuous blend. For example hipY = 9·(p/.35) for p < .35, then lerp(9, −3, ext). Ramp lean in as .18·load instead of a step at p = 0. This is a one-line render fix.
6. **Dead windup inside combos plus pace monotony.** 35% of every power punch is a small pull-back, and decide is "always busy". Pace numbers are on target, but the feel is metronomic.
   - Fix: shorten the windup to about .2 for chained and countering punches (render-only phase remap).
   - Add occasional reset beats: after an exchange, raise decT, or draw `want` from a wider spread so fighters break range and stop. That gives tempo contrast.
   - Optionally add small hit-stop (.03 s) on any clean power shot, not only dmg > 5.5.
7. **Interpenetration at inside range** (3974 pad 0 at d ≤ 32; bodyPush 2689 caps). Raise the minimum pad (for example 6–8) outside clinches. Smooth the bodyPush and settle offsets per fighter in `SM`, and blend the share at 2696.
8. **Frame-rate dependence.**
   - Use `1 - Math.exp(-dt*k)` for cam and zoom (3987, 3988, 4032).
   - Run erupt on the accumulator (4025).
   - Lerp replay snapshots: blend `R_[i]` and `R_[i+1]` with the fraction of `FX.rp`.
   - Time-step the shake (sample at about 30 Hz).
   - Must be checked on the S25 Ultra at 120 Hz.
9. **4x speed:** punches last 1–2 frames. Either cap the visual speed of `aP` (show them a bit slower or longer) or treat 4x as "skip" with no expectation of animation.
10. **Mid-flight cancels** (1018, stun, clinch, bell): fade the arm home over about .1 s through the same inertialization as #1.

Files:
- Instrumented copy: scratchpad/rec.html
- Headless scripts: scratchpad/inst.js, inst2.js, inst3.js
- Browser scripts: scratchpad/rec.py, ana2.py, sheet.py
- Data: scratchpad/rec60.json
- Contact sheets: scratchpad/contact_ex2.png, contact_ex.png
