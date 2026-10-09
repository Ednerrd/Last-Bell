# Move Fundamentals: how coaches teach boxers to stand, step, punch and defend

Goal: make the Last Bell v2 fighters move like real boxers, smoothly and not in stop-motion. This file covers beginner and fundamentals body mechanics and turns them into rules for a procedural animator.

**Tags**
- **(snip)**: taken from a search-result snippet only. The proxy blocked direct fetches of every site tried: expertboxing, evolve-mma, wikipedia, frontiers, PMC, uclan, aassjournal, chesterrep and konstanz. So almost every sourced line below is (snip).
- **(est.)**: our own inference. It is not a sourced fact.
- Code references: `v2/src/render3d/men.js`, `v2/src/engine/punch.js`, `v2/src/engine/fight.js`, `v2/src/engine/space.js`, `v2/src/brain/footwork.js`.

---

## 1. Stance

**Feet**
- **Width:** shoulder width is the usual starting point. One guide says to step the rear foot back "a little more than your shoulder width" (Livestrong / Ringsport, snip).
- **ExpertBoxing "High and Heavy" test:** start at shoulder width and widen until you can't rock side to side. Then come back up until you feel as tall as possible while still "heavy" in the hips (ExpertBoxing, snip).
- **Too wide or too narrow:** a wider stance gives more balance but less rear-hand power and less mobility. Too narrow loses your base (ExpertBoxing, AoM, snip).
- **Foot angle:** lead toes point at the target or slightly in. Rear toes point out about 45° (Warrior Punch, snip). One guide keeps the rear foot still and turns the lead foot toward the opponent (snip).
- **Toe-heel line:** line up the front toe with the rear heel. Do not put the feet on one line, which is the "tightrope" mistake (snip).

**Weight split** (sources disagree)
- 50/50 (Ringsport, snip).
- 55/45 front (Evolve MMA, snip). ExpertBoxing's bounce-step page also says about 55/45 (snip).
- 60/40 back (FightShape, snip).
- Evolve warns that too much weight on the front foot makes it hard to step away (snip).

**Heels and knees**
- Rear heel up 3–4 cm and front heel up 1–2 cm (Ringsport, snip).
- Evolve says the rear heel is "up to an inch" off the floor, with weight on the ball of the foot (snip).
- Livestrong says about 3 inches, which is an outlier (snip).
- Knees slightly bent, never locked (Ringsport and several others, snip).

**Torso, hands and head**
- **Torso:** angled about 45°, matching the feet (Ringsport, snip). The chest is "slightly turned towards" the opponent, not square (snip).
- **Hands:** fists at cheekbone level. The lead hand is about 10 cm out from the face. The rear hand is beside the chin (Ringsport, snip). Another guide puts the knuckles just under the cheekbones (snip).
- **Elbows:** tucked into the sides of the body (Ringsport, snip). Elbows held out are a listed mistake (snip).
- **Chin and eyes:** chin down, eyes looking up. Bring the lead shoulder slightly forward (Ringsport, snip).
- **Orthodox vs southpaw:** the stance is mirrored. Orthodox has the left foot forward. Orthodox fighters drift left most naturally: they push off the right leg and the left foot is closer to the opponent (Straight2Boxing, snip).

## 2. Footwork

**Step-drag (push step)**
- The foot nearest the direction of travel moves first. The other foot is "dragged" to restore the stance width (BoxFit UK, Title Boxing, snip).
- **Forward:** the lead foot steps while the rear foot pushes, then the rear foot closes up (Ringsport, snip).
- **Back:** the rear foot moves first and the lead foot follows (snip).
- **Left (orthodox):** the lead foot moves first and the push comes from the right foot. The right foot then follows "an equal distance" (Straight2Boxing, snip).
- **Right (orthodox):** the rear (right) foot moves first (est., from the "nearest foot first" rule).
- **Never cross the feet and never bring them together.** Both crossing and closing the feet kill the base (BoxFit UK, Title, snip). Keep the width constant (several drills, snip).
- **Step length:** sources say "short and quick". A big step leaves a foot in the air too long, so you can't slip or punch if you're hit mid-step (snip). Only one drill gave a number: "a 2-inch step" laterally for each foot (FightCamp drill, snip). No source gave cm for a normal ring step. This is missing.
- **Backward-first moves:** one analysis calls moving the back foot first when going forward a mistake, because the lead foot then has to catch up (snip). Pushing off the back foot first can also be a timing tell (forum, snip).

**Pivots, shuffle and L-step**
- **Lead-foot pivot:** plant the lead foot and rotate on its ball. The rear foot swings round in an arc, usually a 90° quarter turn. Push off the back foot to start it. Don't lean forward or stand tall during the pivot, because that makes it slow and counterable (Evolve University, Elite Sports, snip).
- **Rear-foot pivot:** the mirror move. Push off the front foot and pivot on the rear ball. It is more common in the Cuban style (snip).
- **Shuffle:** lift the lead foot while pushing off the rear foot at the same time. It is quicker than a step and mostly used in reaction to an attack. Heel slightly raised on the back leg, knees bent (Evolve, Dynamic Striking, snip).
- **L-step (orthodox goes right):** the lead foot steps straight back, then "very soon after" the rear foot steps to the side (Straight2Boxing, snip).

**Bounce vs flat-footed**
- The bounce step changes direction faster and covers more ground. It costs more energy than step-drag (ExpertBoxing, snip).
- Bounce off and land on both legs, with weight kept roughly even (about 55/45). Don't hop from leg to leg (ExpertBoxing, snip).
- Keep it small. Big bounces waste leg energy (snip). "Bouncing downwards keeps your hips grounded" so you can change direction and punch (FightCamp, snip).
- Flat feet reduce mobility and slow reactions (snip). They are also listed as a stance mistake (snip).
- Pendulum step: both feet briefly off the floor (Straight2Boxing, snip).

## 3. Weight transfer per punch

**Kinetic chain**
- Power runs from the legs through trunk rotation to the arm (several, snip).
- Filimonov 1985, cited by a Lincoln University blog: rear-leg extension gives 38.5% of punch force, trunk rotation 37.4% and arm extension 24.1% (snip).
- Cheraghi 2014 (8 elite boxers, straight right): lower-body kinematics show "leg drive" and a stretch-shortening cycle (snip).

**Jab**
- The lead shoulder rolls up to cover the chin. Don't lean into the punch (snip).
- Snap it "like a whip rather than a bat". It "launches quickly and comes back faster" (snip).
- Start the pull-back from the waist (snip). Return along the same line, not lower (snip).
- The rear hand stays glued to the face (snip).
- Some coaches pivot the front foot slightly as the arm extends (snip).

**Cross**
- Push off the ball of the rear foot and lift the heel. Spin until the rear toes point at about 1 o'clock (orthodox) or 11 o'clock (southpaw) (Evolve, snip).
- Hips and torso rotate anticlockwise for orthodox (Wikipedia-sourced wiki, snip).
- Lead the rotation with the pelvis, then the trunk (Lincoln blog citing Cheraghi, snip).
- Coaches add knee flexion and hip and shoulder rotation (Irish coaches study, snip).

**Measured trunk rotation (elite)**
- Wan & Liu 2026, 17 elite boxers: trunk rotation range of motion is 73.0 ± 8.0° for the rear straight and 42.7 ± 7.7° for the lead straight (Springer/PubMed, snip).
- The lead-hand punch is significantly faster to complete (same study, snip).

**Lead hook**
- Slight knee and hip drop first to load the lead leg (snip).
- Pivot on the ball of the lead foot, with the heel lifting. Some coaches say don't force the pivot (snip).
- Weight shifts from the front leg toward the back. The rear heel comes down (snip).
- Elbow about 90° and forearm about parallel to the floor. A straightened arm makes it "a slap" (snip).
- Stop before over-rotating. Reverse the motion straight back to guard (snip).

**Rear hook**
- No specific source found. Mirror the cross's rear-foot drive with a bent arm (est.).

**Uppercuts**
- More "squat" than twist. "Hips go DOWN while the punch goes UP" (ExpertBoxing, snip).
- Hand drop: sources disagree. Some drop the lead hand to about elbow-at-hip height with the palm up. Others say never drop below the hip, or don't drop at all because it telegraphs (snip).
- Rear uppercut: drive the right heel up to rotate the rear foot, knee, hips and shoulders. The elbow closes to about 90°. The fist lands vertical with the elbow under it (FightCamp / Peloton, snip).

**Body shots**
- Get low by bending the knees enough to reach. Don't throw from upright (FightCamp, snip). Keep the trunk upright (snip).
- Cross to the body (Boxing News): slide the front foot in and squat to about 90° at the front knee (snip).

**Measured speeds and delivery times**
- Stanley et al. 2018 (15 amateurs, maximal effort on a bag):
  - Jab has the shortest delivery, about 405 ms.
  - Lead hook has the highest fist velocity, about 11.95 m/s.
  - Rear uppercut has the highest shoulder angular velocity, about 1070°/s. (snip)
- Piorkowski 2011: straight punches deliver faster than hooks. Pooled figures quoted are 357 ± 178 ms (straight) and 477 ± 203 ms (hook). Punches in combinations deliver faster than single maximal punches (snip).
- Cross contact speed is about 8.2 m/s (snip).
- Liu 2022: peak lead-punch velocity is 7.16 m/s for elite boxers and 6.32 m/s for juniors (snip).

## 4. Defense

**Slip**
- The move comes from the legs, not the waist. Spine upright, chin tucked, eyes on the opponent (FightCamp, Evolve, snip).
- Move only far enough to take the head off the "punching line". "Don't overdo it" (snip). No source gave cm.
- **Outside slip vs a jab (orthodox):** rotate clockwise and lean slightly right, so weight goes onto the rear leg. Pivot both feet the same way (Straight2Boxing / ExpertBoxing, snip).
- **Rule:** lean onto the leg on the side you slip toward and twist the hips that way (snip).
- An inside slip toward the lead leg is riskier, because you can slip into the cross (snip).
- Timing: too early exposes you and too late gets you hit (snip).

**Roll / bob-and-weave**
- The head travels in a "U" (or V) under the punch and to the outside, from one side to the other (Evolve, snip).
- Depth: enough that the punch clears the head. Not so low that you can't come back fast, and not so low that you eat an uppercut (snip).
- Bend the knees, not the torso (snip). Return to stance immediately (snip).

**Pull / lean back**
- Pull the head back "about the length of one of your feet" and counter as his arm retracts (Evolve, snip).
- Going farther costs balance. It works best against a single jab (snip).

**Parry and catch**
- The rear hand moves at most 3–4 inches (about 8–10 cm) from the face (FightCamp, snip).
- "Let it come to you", with an open glove and the palm toward him. It is a light tap that knocks the punch off line. Then straight back to guard, with the head behind the hand (FightCamp / Evolve, snip).

**High guard and blocking**
- Gloves high by the temples, elbows tight. This protects the head and ribs together (snip).
- For hooks, raise the blocking arm above normal guard height (Evolve, snip).

**Shoulder roll**
- Raise the lead shoulder to the chin and turn the hips away, so the punch slides off. Roll only as far as needed. The rear hand covers and counters (FightCamp / Evolve, snip).

## 5. Rhythm between punches

- **Bounce:** small, both feet, downward-weighted (see §2). No source gave a cadence in Hz. That is missing.
- **Breathing:** a short, sharp exhale on each punch ("tss"), not emptying the lungs. Combos go "t-t-t-tss" (FightShape, ExpertBoxing, snip).
- **Breathing in combos:** one guide says breathe in before a combo, out on each punch, then step back and breathe in (Warrior Punch, snip).
- **Relaxed vs tense:** relaxed between punches. Tight shoulders, chest or throat limit speed (snip). Hands stay relaxed "until the split second before contact" (Warrior Punch, snip).
- **Feints and hand pumping:** no fundamentals source found in this pass. See mind_* files (est.).

## 6. Beginner mistakes (to show on low-skill fighters)

- Dropping the guard while punching or when tired. The fix coaches give: keep the non-punching fist at the face (Evolve University / Decathlon, snip).
- Returning the jab low, to where it started, instead of along the line (snip).
- Squaring up, standing flat-footed, the lead foot "pointing", standing up straight, chin up (Sting / Livestrong, snip).
- Feet too close, crossed, or in line, which costs balance on every slip (snip).
- Leaning into the jab or reaching, which leaves you off balance and open to counters (snip).
- All shoulder and arm with no hip rotation (snip).
- Telegraphing: winding up, dropping the shoulder before a hook, pulling the arm back before a straight (Evolve, snip).
- Holding the breath. Going too fast early and gassing (snip).
- Dropping the hand low to "prepare" an uppercut (snip).
- Folding at the waist to duck, which takes the eyes off him (snip).
- Bending too low on a bob (snip). Over-rotating a hook (snip).

---

## 7. Engine and render translation

### What we have now (read from the code)

| Thing | Value in code | Real-world reference | Verdict |
|---|---|---|---|
| Stance (`space.js feetAt`) | Lead foot 0.22 m forward, rear 0.20 back (42 cm front-back). Lateral ±0.10 / 0.12 (22 cm). | Shoulder width (about 40–45 cm, est.). Rear foot "a little more than" shoulder width back. | Plausible. Keep it. |
| Foot yaw (`men.js:272`) | Lead 0.3 rad (17°). Rear 0.9 rad (52°), turning to about 0.57 rad (33°) at full cross. | Rear 45°, pivoting to about 1 o'clock (about 30°). | **Right.** |
| Lead-foot pivot | None. The lead foot never turns on a hook. | Lead foot pivots on its ball and the heel lifts. | Missing. |
| Heel lift | None. The foot box sits flat at y=.04. | Rear heel 3–4 cm up in stance; heel lifts on cross and rear hook/upper. | Missing. Biggest cheap realism win. |
| Torso yaw on punch (`men.js turn`) | Rear 0.55 rad (32°). Jab 0.12 rad (7°). Hook −0.3 rad (17°). | Elite trunk range of motion: 73° rear straight, 43° lead straight. | All about half to a third too small. Range of motion includes the load, so target peaks around 45–55° cross, 20–25° jab, 35–45° hook (est.). |
| Guard (`men.js GUARD.standard`) | Gloves y 1.42 / 1.45 for a 1.78 m man. | Cheekbone level. | Probably about 10 cm low. Cheekbone is about 1.58–1.62 on a 1.78 m man (est.). Raise the rear glove to chin/cheek. |
| Step (`footwork.js`, `fight.js footPos`) | Duration 0.14–0.32 s. Length 0.12–0.46 m. First foot moves over k 0–0.6, second over 0.4–1. | Short, quick steps. Nearest foot first. Never cross. | Step-drag overlap is good. **Bug:** see the step rule below. |
| Punch step-in (`fight.js`) | Moves m.x with no `m.step`, so `feetAt` slides **both** feet with the body. | Lead foot steps with the jab; rear foot drags after. | Foot-skate during jabs. Fix in the punch step rule below. |
| Rhythm (`men.js LIFE`) | Outboxer 2.3 Hz, bob 1.6 cm. Boxer 1.8 Hz, 1.1 cm. Pressure 1.4 Hz, 0.8 cm bob + 3.5 cm weave. | Small and downward. Hz not found. | Plausible (est.). Amplitudes fit "small bounce". |
| Rhythm during punches | Damped to 0.25 while punching or defending. | Bounce stops while planted to punch (est.). | Right. |
| Punch timings (`punch.js`) | Jab 0.04 / 0.11 / 0.14 s (contact at 0.15 s). Cross contact at 0.21 s. | Lab delivery: jab about 405 ms (maximal effort); straights about 357 ms pooled; combos faster. | Ours is about 2× faster than lab single maximal punches. That is fine for a game read. **But ret > snap** on every punch, against the coaching rule. See the punch return rule below. |
| Slip (`men.js def`) | 15 cm lateral, 7 cm down, 3 cm forward. | "Just off the line"; knees, not waist. | Lateral is about one head width (est.), good. Drive the drop through the knees and hips, not just the head offset. Add a torso tilt and weight onto the slip-side leg. |
| Roll | 22 cm down, 10 cm sine sideways. | U path, punch clears the head. | Good shape. Add a knee bend that matches the 22 cm drop. |
| Pull | 13 cm back. | About one foot length (about 25–28 cm, est.). | A bit short unless the engine's real step-back covers the rest. |

### Rules for the procedural animator

**Feet**
- **Step rule:** the foot nearest the direction of travel moves first. The other follows, overlapping about 40% of the step.
  - **Bug:** `footwork.js` picks `first` only by the forward/back dot product. A lateral step toward the rear-hand side (right for orthodox) uses the lead foot first. That can visually cross or close the feet. Use the sign of the lateral component when |along| is small.
- **Width lock:** after every step the foot gap returns to the stance vector. Never let |lead − rear| fall below about 70% of stance width (est.). This is also the check for "crossed feet".
- **Heel lift:** rear heel up 3–4 cm in stance and front heel 1–2 cm (Ringsport). On the cross, rear hook and rear upper, lift the rear heel to about 6–8 cm and rotate the rear foot to about 30° (est.).
- **Lead-foot pivot:** on the lead hook and lead upper, pivot the lead foot about 30–45° on its ball (est.).
- **Pivot move:** rotate about 90° around the lead foot's ball. The rear foot sweeps an arc over a single step duration (about 0.25–0.3 s, est.).

**Punches**
- **Hips:** lead the torso. Hip yaw peaks about 30–40 ms before shoulder yaw (est., from "pelvis then trunk"). Peak trunk yaw: cross about 50°, jab about 20°, hook about 40° (est.).
- **Weight shift:** move the center 10–15% of stance length toward the lead foot on the jab and cross (est.). On the lead hook, move it back toward the rear foot (snip).
- **Knee load:** knee dip of 3–5 cm before hooks and uppercuts (est.). Uppercuts sink the hips down while the fist goes up.
- **Body shots:** lower the hip height by 10–15 cm through the knees and keep the spine upright (est. from "front knee to about 90°").
- **Return:** for skilled fighters the return should be at least as fast as the extension: `ret ≤ snap`. Our jab is snap 0.11 / ret 0.14; suggest snap 0.11 / ret 0.09–0.11 (est.).
  - Return along the outbound line.
  - For low skill, set ret at about 1.4× snap and route the glove 10–15 cm below the line on the way home (the "dropping the hand" mistake).
- **Non-punching glove:** locked to the chin during any punch. A beginner drifts it 8–15 cm (est.).
- **Punch step-in:** move the lead foot over load+snap and drag the rear foot over the next 0.08–0.12 s (est.). Do not slide both feet with the body.

**Defense**
- **Slip:** drive it with knee bend (hips drop about 5–7 cm, est.) and torso yaw about 15–20° toward the slip side (est.). Shift weight onto the slip-side leg. The head moves sideways about 12–15 cm.
- **Roll:** the hips must drop with the head. The torso stays upright (pitch under about 15°, est.).
- **Pull:** shift weight onto the rear leg. The head goes back about 25 cm and the hips about 10 cm (est.).
- **Parry:** the rear glove travels at most 8–10 cm and returns immediately.

**Rhythm and skill**
- **Rhythm layer:** keep the per-style Hz. Make the bounce two-footed and downward (the hip dips on the beat; there is no airtime). Exhale or chest-pulse on each punch.
- **Low-skill flags** (each one a toggle):
  - squared torso (yaw offset toward 0°)
  - chin up (head pitch +10°)
  - flat heels
  - lean over the front foot on the jab (head beyond the lead knee)
  - reach (step 0, arm locks, torso pitch forward)
  - telegraph (load ×1.5 with a visible shoulder dip or wind-back)
  - narrow or crossing steps

---

## Missing facts (not found; do not invent)

- A step length in cm for a normal ring step-drag (only the "2-inch" drill was found).
- Bounce cadence in Hz or bounce height in cm for boxers.
- How far the head moves in a slip, in cm. Bob-and-weave depth in cm.
- Hip and shoulder rotation degrees for hooks and uppercuts. Per-phase ms for jab extension vs retraction.
- Exact Piorkowski Table 1 values. Stanley 2018 per-punch delivery times other than the jab.
- The source for "returns faster than out" as a measured fact. It is a coaching cue only.
- Video-specific cues from Precision Striking, Tony Jeffries, Johnny Nguyen or Coach Anthony. No transcripts were reachable.
