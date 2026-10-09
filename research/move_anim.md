# Fluid procedural boxing: feet, springs, impact, timing (v2 render)

How procedural and mocap boxing games get their fluid feel, and a parameterized recipe for `v2/src/render3d/men.js`.
Builds on `combat_research.md`. That file already covers FN3/FN4/Undisputed/TotF design, hit-stop frame counts, trauma shake, combo overlap and the Rosen layering idea, so this file does not repeat them.

Tags. **(src)**: read in the primary text or code. **(snip)**: search-result snippet only, page blocked. **(est.)**: our inference or rule of thumb, not measured.
Proxy note: theorangeduck.com, gafferongames.com, gamedeveloper.com, unity.com, unrealengine.com, ea.com, critpoints.net and archive.org were all blocked.
- Daniel Holden's real code was read from `raw.githubusercontent.com/orangeduck/Motion-Matching` (`spring.h`, `controller.cpp`, `common.h`).
- Fiedler's article was read from its GitHub source (`gafferongames/gafferongames/.../fix_your_timestep.md`).

---

## 0. What the code does today (read from v2, 2026-10-09)

- `engine/fight.js footPos()`: when no step is running, feet = `feetAt(m, m.th, stance)`, a fixed offset from the centre that is rotated by facing. **(src)**
  - Each tick he turns toward the opponent (`TURN*DT`), and both feet swing around the centre with him: a **foot skate on every turn**.
  - During a punch step-in (`p.step`, up to 0.22 m on `bjab`), `m.step` is null. Both feet ride along with the centre: a **slide, not a step**.
  - In a real step, the first foot moves over 0–60% of the step and the second over 40–100%. That is good, but it is purely horizontal.
- `render3d/men.js`: feet are drawn at `y = 0.04` always. **No lift, no swing arc, no heel/toe.** Foot yaw is fixed except the rear foot turns with `R.yaw*0.6`. **(src)**
- The hips glide on a critically damped spring, `GLIDE = 26` (ω), with semi-implicit Euler at 1/120 s substeps. **(src)**
  - Converted with Holden's relation (y = ω = 2·ln2/halflife), that is a **halflife ≈ 53 ms**. **(est., arithmetic)**
  - The hips track the raw engine position, but the feet use the raw engine feet. Nothing ties the pelvis to the loaded foot.
- Hit snap: `a = t/0.06` up to 60 ms, then `exp(-9(t-0.06))`. This has a **velocity discontinuity at 60 ms**: the slope jumps from +16.7/s to about −9/s in one frame, which reads as a "tick". **(src + est.)**
- The punching glove is "not smoothed: the snap is the snap". If a punch starts while the glove is mid-blend, or gets cancelled, the glove **pops**. **(src)**
- Snap curve `1-(1-k)^3`: fastest at launch, **zero velocity at contact**. The fist decelerates into the target. `combat_research.md` says the opposite: peak speed at impact. **(src + est.)**
- Life layer: the bob is a pure sine (1.4–2.3 Hz), the weave is a sine at 0.37× that, and the glove sway uses sines at 0.45/0.5×. These fixed ratios make a visible loop after a few seconds. **(src + est.)**

---

## 1. Procedural locomotion: plant, step, pivot, weight

**What the sources say**
- Overgrowth (David Rosen, GDC 2014 "Animation Bootcamp: An Indie Approach to Procedural Animation"): "simple procedural techniques to achieve interactive and fluid animations using very few key frames". **(snip)**
  - The "13 keyframes in total" figure comes from a forum summary. **(snip)**
  - A Polycount poster describes a "spring damper system" on Overgrowth's crouch. **(snip)**
- Rain World (Joar Jakobsson): bodies are points held at fixed distances, with limbs drawn on top and moved by code from the inputs. "Soft and bendable". **(snip)**
- For Honor motion matching (Simon Clavet, GDC 2016): "you only need to pose match a few bones… mostly it is the positions and velocities of the feet". **(snip)**
  - Our lesson: the feet are the signal the eye judges motion by. **(est.)**
- Holden's motion-matching demo locks the foot contact as a post-process (`contact_update`). **(src)**
  - On contact start, it stores `contact_point` (foot position, `y = foot_height`) and **inertializes** from the animated foot to the locked point.
  - While locked, it feeds the locked point with zero velocity.
  - It unlocks when `length(contact_point - input_position) > unlock_radius`, or when the animation says the contact ended. It then inertializes back to the animated foot.
  - Defaults: `ik_unlock_radius = 0.2` m, `ik_foot_height = 0.02` m, `ik_blending_halflife = 0.1` s, `ik_max_length_buffer = 0.015` m. **(src)**
  - Leg IK then solves hip→knee→foot to the locked point. The demo also has `ik_look_at` and a two-joint IK with a forward/pole vector. **(src)**
- Generic step practice: a foot steps when its planted spot drifts past a threshold from a predicted target, and only when the other foot is planted. Swing feet aim at the predicted landing spot. **(snip, Roblox/Unreal forum/Vulkan tutorial)**
- Swing height of "0.1–0.3 × leg length" and duration of "0.2–0.4 s" are search-engine general practice, not boxing. **(snip, low trust)**
- Undisputed: mocap of each boxer's footwork. The 1.0 patch updated "step-in straight / step-in body jab", and "flat-footed movement" applies at low stamina. **(snip)**

**Boxing-specific rules (est., from coaching convention)**
- Step-drag: the foot nearest the direction of travel moves first and the other follows. The engine already does this. Stance width is restored after every step.
- Boxers shuffle low. The swing foot barely clears the canvas: a glide, not a march.
- Weight sits roughly 50/50 to 60/40 on the rear foot in guard. It goes forward onto the lead foot on a cross and onto the rear on a pull.
- The rear heel turns out on a cross or rear hook (rear-foot pivot). The lead foot pivots on its ball for a lead hook.
- A pivot turn rotates about the ball of the lead foot. The foot does not slide.
- Shoulders out-rotate hips. On a cross the hips turn some way and the shoulders turn further, which creates torso twist. In guard, the shoulders are slightly more bladed than the hips.

---

## 2. Secondary motion

- **Additive hit reactions are the norm in shipped tools.** An impulse goes in at the hit bone with direction and strength, then a spring returns it. Rotation is clamped per bone, and the motion propagates up the spine. **(snip, UE "Easy Procedural Hit Reactions")**
  - CS2's "Procedural Hit Reacts" node exposes `Counter Rotation Scale`, `Propagation Scale`, `Whip Delay Time` and `Spring Strength`. **(snip)**
  - That suggests the recipe: the chest takes the hit, the head follows after a short delay (whip), and the hips counter-rotate slightly. **(est.)**
- Fight Night Champion (EA art blog): muscle flex, fat jiggle, and a "body ripple that runs both through the struck fighter and back through the puncher". Regions are "driven by the physics system". Flinch/clench happens on landed and blocked shots, and "none of which are canned". **(snip)**
  - Lesson: the **puncher reacts to contact too** (a small recoil). **(est.)**
- FN4's physics knockouts, per Brian Hayes (UFC 2 interview): "tremendous variety – every knockout was different. It also looked completely unrealistic." **(snip)**
  - UFC went back to mocap knockouts. Lesson: keep physics/springs for small reactions and use authored poses for big falls. **(est.)**
- Creed: Rise to Glory "Phantom Melee": "Responsive Control" desyncs the avatar when staggered, and "Virtual Stamina" slows the avatar after flurries. **(snip)**
  - For us: fatigue should lower the spring stiffness and the punch speed, not just the numbers. **(est.)**
- Thrill of the Fight: damage is judged per hit from "how and where" it landed. **(snip)**
  - Players say the AI blocking arms "magically teleport". **(snip)** Lesson: guard moves need spring travel time. **(est.)**
- Anticipation and follow-through (classic animation principles, est.):
  - Load = a small move opposite to the strike (shoulder back, hip coils).
  - Follow-through = the torso keeps turning 1–2 frames after the glove stops, then settles.
  - Overlap = the head lags the chest, the chest lags the pelvis, and the gloves lag the shoulders on recovery.
- Idle noise: sum 2–3 octaves of 1D value or Perlin noise per channel (pelvis x/z, chest yaw, head tilt, each glove) at incommensurate rates. This never visibly repeats, unlike fixed sine ratios. **(est.)**
- Breathing: chest scale or rise at the breath rate, faster and deeper when the stamina gauge is low. Visible mainly in close shots and between rounds. **(est.; no sourced breath-rate figure here)**

---

## 3. Interpolation, springs, timing (primary sources read)

**Fiedler, "Fix Your Timestep" (src)**
- The loop: `frameTime = min(newTime - currentTime, 0.25)`, then `accumulator += frameTime`, then `while (accumulator >= dt) { previous = current; integrate; accumulator -= dt; }`.
- Render with `alpha = accumulator/dt` and `state = current*alpha + previous*(1-alpha)`.
- Without the interpolation, the leftover time causes "a subtle but visually unpleasant stuttering". Use slerp for orientations.
- "Spiral of death": clamp the steps per frame, so the sim slows under load instead of falling further behind.
- v2 already does this (`m.ta`). Check that **every** sim field the renderer reads is interpolated: `th`, the feet, the step clock and the punch clock. **(est.)**

**Holden, springs (src, `spring.h`)**
- `halflife_to_damping(h) = 4·ln2 / h`, and `y = damping/2`.
- Exact critically damped step, frame-rate independent:
  `j0 = x - g; j1 = v + j0*y; e = negexp(y*dt); x = e*(j0 + j1*dt) + g; v = e*(v - j1*y*dt)`.
- `decay_spring_damper_exact`: the same thing with g = 0. Used for offsets.
- `fast_negexpf(x) = 1/(1 + x + 0.48x² + 0.235x³)`.
- `damper_exact(x, g, h, dt) = lerp(x, g, 1 - negexp(ln2*dt/h))`. This is a frame-rate-independent exponential smoother. Ours: `1 - exp(-dt*k)`, which is fine.
- **Inertialization**:
  - On a switch, store `off_x = (src_x + off_x) - dst_x` and `off_v = (src_v + off_v) - dst_v`.
  - Each frame, decay the offset with `decay_spring_damper_exact` and output `in + off`.
  - The new target is followed exactly. Only the jump decays. Demo default `inertialize_blending_halflife = 0.1` s. **(src)**
  - This is the fix for every "pop": punch start, punch cancel, defense start, foot lock and unlock.
- Demo gait values: `simulation_velocity_halflife = 0.27`, `simulation_rotation_halflife = 0.27`, `adjustment_position_halflife = 0.1`, `adjustment_rotation_halflife = 0.2`. **(src)**
  - These are walking/running values, too soft for boxing hips. Ours is 53 ms. **(est.)**
- "Dead blending" (Holden's later inertialization variant, extrapolate then blend) could not be read. **(missing)**

**Velocity continuity rules (est.)**
- Never set a position along a curve whose slope jumps. Either use C1 curves (smoothstep and friends) or drive the value through a spring with an impulse on velocity.
- Exponential smoothing toward a target that jumps gives a velocity jump at the switch. Use a spring (2nd order) when the target itself is discontinuous. That covers gloves returning to guard and the head offset on a defense start.
- Our Euler substep spring at 120 Hz is stable at ω = 26 (ω·h ≈ 0.22). Holden's exact form removes the substeps and any dt sensitivity. **(est.)**

---

## 4. Impact craft (only what is not in combat_research.md)

- Hit-stop counts, trauma shake and smears are already in `combat_research.md` §4. Reuse those numbers. (They are est./snip there too.)
- A hit-stop in a render-interpolated sim (est.):
  - Freeze **the render clock for the two men only**, not the sim. Or freeze the sim and the interpolation alpha together, so nothing desyncs.
  - Let the hit-reaction spring start **after** the freeze. The freeze is the "contact frame" and the spring is the "reaction".
- Contact frame (est.):
  - On a landed shot, hold the glove at the contact point for the hit-stop duration, then retract.
  - On a miss, overshoot 3–5% of reach and retract about 20% slower. A miss should look committed and costly.
- Puncher recoil (est., cf. the FNC "ripple back through the puncher"): give the puncher's chest a small impulse opposite to the punch direction, at about 20–30% of the victim's impulse.

---

## 5. Recipe for v2: top 10, prioritized (all params est. unless tagged)

**1. Render-side foot locking with swing arcs (biggest fix).** Add a per-foot state `{pos, yaw, locked, swing}` in `men.js`.
- *Planted:* draw at the locked world position and yaw, ignoring the engine foot.
- *Unlock:* when `|engineFoot - lockPos| > 0.07 m` (Holden's 0.2 m is for running; boxing stance drift is small), or when the yaw error is greater than 25°, or when an engine step starts for that foot.
  - Only unlock when the other foot is locked. Exception: a pull or a big shove.
- *Swing:* duration `= clamp(dist/1.6 m/s, 0.10, 0.22) s`. The engine step `dur` is 0.14–0.32 s (src); the second foot's window is 60% of it.
  - Horizontal motion: ease with smoothstep from the lift spot to the **predicted** engine foot at swing end.
  - Height: `h·sin(πu)` with `h = 0.025 m + 0.06·dist`, capped at 0.05 m. Pressure/flat-footed fighters get 0.6× that.
  - Toe down slightly in the first half; land heel or flat in the second.
- *Plant:* on landing, lock at the engine foot and inertialize any residual error (halflife 0.04 s).
- *Engine fix (tiny):* make `footPos` keep the **previous world feet** when not stepping, instead of `feetAt(m, m.th)`. This alone kills the turn-skate and the punch step-in slide in the sim data the AI also sees.

**2. Pivots instead of foot rotation about the centre.**
- When facing changes and a foot's yaw error exceeds 25°, rotate that foot about its **ball** (0.07 m ahead of the foot centre) over 0.12 s. No translation of the ball.
- Cross/rear hook: rear heel out by 35–50° (the existing `R.yaw*0.6` is the right idea), but pivot on the ball, with a heel lift of 1–2 cm.
- Lead hook: lead foot pivots 20–30° in on its ball.

**3. Pelvis over the loaded foot, and a counter-rotating torso.**
- Weight `w ∈ [0,1]` (0 = rear, 1 = lead) on a spring with halflife 0.06 s. Guard 0.4. Jab 0.5. Cross/rear hook 0.65–0.7. Lead hook 0.35 (it loads the rear). Pull 0.15. Mid-step: toward the planted foot.
- Pelvis target = lerp(rear, lead, w) projected onto the stance line, plus the glided centre's lateral position. Crouch: 2–3 cm lower when weight is moving.
- Yaw split: shoulders get 100% of `R.yaw`, chest 70%, pelvis 40–50%, with the pelvis leading by about 1 frame on the snap. That gives torso twist without a new rig, since the torso and hips are separate meshes already.

**4. Exact springs everywhere, and inertialization for every switch.**
- Port `simple_spring_damper_exact`, `decay_spring_damper_exact` and `inertialize_transition`/`update` to `core/math.js`, about 30 lines.
- Use them for: punch start (glove from current pose → new curve), punch cancel, defense start and end, guard swap, and the foot lock above.
- Halflife 0.05 s for gloves and 0.08 s for torso/head.
- Then remove "the punching glove isn't smoothed": keep the curve exact and inertialize only the start offset.

**5. Hit reaction as a spring impulse chain (replaces the ramp+exp snap).**
- On contact, add velocity, not position. Chest `v += dir·A`, then the head gets `v += dir·1.6A` after a 30–40 ms delay (the whip).
- Pelvis counter: `−0.3A` (opposite direction).
- Springs: head ω ≈ 18 with ζ ≈ 0.55 (one visible wobble back), chest ω ≈ 14 with ζ ≈ 0.75.
- Clamp the head to about 25° and the chest to about 12°.
- Scale A by contact quality, which already exists as `HIT_AMP[e.q]`. Body shots: chest fold impulse plus a 2–4 cm knee dip.
- Big shots (A above a threshold) also force a **reactive step**: unlock the rear foot and step it 10–20 cm along the hit direction. The legs catch the body. That is the "every punch moves him" feel.

**6. Punch curve with speed at contact, and per-outcome endings.**
- Snap `f(k) = 1.25k - 0.25k²`: starts at 1.25× mean speed and arrives at 0.75× mean, never zero. Or keep the cubic and add a 3–5% overshoot past the target.
- Landed: hold at contact for the hit-stop, then retract. Missed: overshoot, then retract 1.2× slower.
- Load (15%) moves the shoulder back and the hip coils 5–8° the other way. That is anticipation in the torso, not just the glove.
- Retract the glove on a spring to the **live** guard pose, not on a fixed smoothstep, so it never lands in a stale spot.

**7. Head stabilization and gaze.**
- Head target = chest-relative pose, plus a look-at to the opponent's chin, blended 60%.
- Spring halflife 0.08 s, so the head lags the chest on weaves and keeps the eyes level. Roll is limited to ±8° except on hits.
- This alone makes bob and weave read as deliberate rather than as a bobbing mannequin.

**8. Replace the sine life with noise and rhythm.**
- Keep the style bounce frequency, but phase-lock it to the steps: the dip is at foot plant and the rise is at push-off.
- Weave, glove sway, chest yaw (±3°) and head tilt (±2°) each get 2-octave value noise at 0.3–0.9 Hz with a per-fighter seed. Amplitudes stay as now.
- Fatigue: bounce amplitude ×(0.4 + 0.6·stamina) and the noise rate ×0.8. Breathing chest rise of 3–6 mm, faster and deeper when tired. Spring stiffness ×(0.75 + 0.25·stamina), so tired men look heavy (cf. Creed's Virtual Stamina).

**9. Puncher follow-through and recoil.**
- The chest yaw overshoots the punch turn by 10–15% and settles over 0.12 s (an underdamped spring, ζ ≈ 0.6).
- On a landed shot, the puncher's chest gets a small counter-impulse at 25% of the victim's (FNC's two-way ripple).
- Overlapping step-ins: the lead foot unlocks at the start of the snap and lands at contact. Don't hold the legs planted through the punch. That is Undisputed's "wait for the animation" complaint.

**10. Timing hygiene.**
- Interpolate `th`, the feet, and the step and punch clocks with `alpha`. Clamp `frameTime` to 0.25 s (Fiedler, src) and cap the sim steps per frame.
- Run all render springs with real `dt`, using the exact forms (frame-rate independent at 30/60/120 Hz on phones).
- Hit-stop freezes both men's render clocks. The camera keeps running and takes the shake.
- Add a 1-key debug overlay that plots foot height and glove speed over time. Discontinuities show up as vertical edges. The existing frame-strip test is a good host.

**Order of work:** 1+2 (feet), 4 (springs/inertialize, needed by everything), 5 (hits), 3 (weight), 6, 7, 8, 9, 10.

---

## 6. Sources

- Holden code (read): `github.com/orangeduck/Motion-Matching` `spring.h`, `controller.cpp` (contact lock, IK defaults), `common.h` (`fast_negexpf`). The Spring-It-On README points to "spring-roll-call".
- Fiedler (read): `github.com/gafferongames/gafferongames` `content/post/fix_your_timestep.md`.
- Rosen GDC 2014: gdcvault / gamedeveloper.com "video-an-indie-approach-to-procedural-animation"; Unity forum thread 538228; polycount (snip).
- Clavet GDC 2016: gdcvault 1022985; gamedeveloper.com "most-inspiring-game-animation-tech-talks-of-2016" (snip).
- Bollo GDC 2018, "Inertialization: High-Performance Animation Transitions in Gears of War": gdcvault 1025165 (snip, abstract only).
- Rain World: unity.com/blog/exploring-procedural-design-rain-world (snip).
- FN Champion art blog: ea.com/news/fight-night-champion-art-blog. Hayes UFC 2 interview: godisageek.com 2015/11 (snip).
- Creed Phantom Melee: roundbyroundboxing.com ?p=92810; unrealengine.com spotlight (snip).
- TotF: steamcommunity app 494150 dev posts (snip).
- Undisputed patch notes: mp1st.com 1.003.003, realsport101 (snip).
- Hit-react knobs: forums.unrealengine.com "kettunen-easy-procedural-hit-reactions"; s2v.app CS2 HitReactNode (snip).

## 7. Missing facts (not found or not readable; do not invent)

- Rosen's actual spring constants, keyframe list and foot-planting method (talk video not accessible).
- Holden's "Spring-It-On" article text and the "dead blending" article (site blocked). Only the code was read.
- Unity Animation Rigging and Unreal Full Body IK / Control Rig docs: not fetched.
- FN Round 4 SIGGRAPH 2009 slides: blend and reaction details unknown beyond the abstract.
- Undisputed: no source found for "60 fps mocap" or for how its footwork or pivot system works.
- FNC "Full Spectrum Punch Control": no animation-blending details, only control-scheme descriptions.
- TotF opponent animation method (keyed, procedural or physics): unknown.
- Measured boxer step durations, swing heights and weight-distribution percentages: none found. All of §5's foot, weight and spring numbers are est. and need tuning by eye with the frame strip.
- Hit-stop ms for 3D sports boxing games specifically: none found (fighting-game values only, in combat_research.md).
