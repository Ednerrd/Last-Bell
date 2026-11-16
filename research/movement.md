# Movement & Rhythm — research for the Last Bell renderer + brain

**For:** the stiffness problem — fighters stand in place bouncing between punches, no personal rhythm, no free movement.
**Researched:** 2026-11-16. Full report with sources: `research_notes/boxing-movement-rhythm-20261116-2126/report.md`.
**Flag key:** **[M]** measured · **[C]** coaching convention (taught, not measured in fights) · **[A]** fight-breakdown observation · **[I]** unverified inference.

## Headline

Real boxers are almost never still — but "moving" rarely means travelling. The default between exchanges is small step-drags, weight shifts, and bounces, with the stance restored after every step. Punching occupies only ~10–20% of a round [C]. The game's stiffness has four causes, and the research names all four:

1. **The bounce is a metronome.** Real rhythm is *broken* — pauses, half-beats, sudden tempo changes. A constant-frequency bounce reads as a screensaver.
2. **Lateral movement is invisible in side view.** Circling travels toward/away from the camera, so the renderer must *signal* it — it can't show it as translation.
3. **Idle is loaded stillness, never a frozen pose.** Even the stillest fighters (Canelo, Mayweather) keep head movement, shoulder feints, weight shifts, guard adjustments.
4. **Feet and hands are in dialogue.** Punches land as feet land; exits begin as the last punch retracts. Decouple them and the fighter reads as a statue with a bounce.

## 1. Between exchanges — what the feet do

The foundational unit is the **step-drag (shuffle)** [C]: the foot nearest the direction of travel steps, the other drags/slides along the floor to restore stance spacing. "The feet never cross and never come together" (Boxing Canada).

| Step | Size | Source |
|---|---|---|
| Forward step | 10–15 cm | [C] Swiss Boxing |
| Step-drag generally | 4–10 in (~10–25 cm) | [C] Fight Encyclopedia |
| Beginner drill steps | ~2 in (~5 cm) | [C] FightCamp / Haislet 1940 |
| Circling step | 6–8 in (~15–20 cm) | [C] Haislet |
| Retreating step | 6–12 in (~15–30 cm) | [C] Fight Encyclopedia |

**Measured cadence [M]:** elite male amateurs average ~1.4 actions/second, including ~47 vertical hip movements per minute — the hips bob roughly once every 1.3 seconds even between punches (Davis et al. 2015, 29 Olympic bouts). Extreme case: Guillermo Rigondeaux took **5,818 steps in 12 rounds** vs Casimero (2021), ~485/round, ~2.7 steps/second of ring time, while landing only 44 punches [M — single fight, Bad Left Hook's semi-satirical "CompuWalk" count].

**Is a boxer ever truly still?** No — except deliberately and briefly. Even the still fighters keep micro-motion. Genuine federation disagreement: Boxing Canada teaches the pendulum bounce; England Boxing teaches minimal bounce [C].

## 2. Individual rhythms — the six fighters

No measured bounce frequency, step size, or moving-vs-planted share exists for any named fighter — those numbers don't exist in the public record. What follows is qualitative, from fight breakdowns.

| Fighter | Default between-punch motion | Bounce | Direction changes | Moving vs planted |
|---|---|---|---|---|
| **Ali** | Toe-bounce + circle, broken rhythm | Continuous, light | Constant, explosive reversals | Mostly moving |
| **Tyson** | Side-to-side sway, weight leg-to-leg | None (sway, not bounce) | Frequent, via slips/shifts | Mostly moving forward |
| **Canelo** | Planted stillness, head/upper-body only | None | Rare; pivots left defensively | Mostly planted |
| **Mayweather** | Minimal drift, feet planted in defence | None | Pivots (check hook) | Planted when defending, drifts between |
| **Lomachenko** | Angle steps + pivots, spiralling | Light | Constant, 45–90° pivots | Mostly moving |
| **Pacquiao** | Bounce in/out in bursts | Continuous in bursts | Constant; darting | Mostly moving |

- **Ali [A]:** jabs mid-step or mid-bounce on a "half-beat" — the jab lands as the foot lands, so opponents see it only after impact. Deliberately broke rhythm: fast jabs, then pauses; slow bounce, then a sudden strike. The **Ali Shuffle** (debuted vs Cleveland Williams, 14 Nov 1966): rapid alternating feet front-to-back in place, heels never touching the floor — used to draw the eyes down, then step in.
- **Tyson [A]:** peek-a-boo is "a rhythm of movement, not a static posture." Head left = left foot forward; head right = right foot forward — shoulder/head motion synchronized with the feet. Signature steps: the **back-foot step** (rear foot steps up beside the lead, then an explosive lead step in), the **slip step**, the **D'Amato shift** (slip, weight over lead leg, galloping counter-clockwise hip turn, ends on the opponent's side in the opposite stance).
- **Canelo [A]:** the stillest of the six. After the Mayweather loss (2013) he learned "you only need to move when it's an absolute necessity." Defence by micro head movement and upper-body slips — made Jacobs miss 17 shots in a row [M]. Weakness: doesn't adjust his feet when distance is created; cross-steps when circling, costing "that extra beat."
- **Mayweather [A]:** "moves just enough to reset distance." Feet planted while defending — defence is upper-body (shoulder roll, head tilt, weight slightly back). Threw **38.6 punches/round vs the 58.4 welterweight average** [M, CompuBox]; opponents landed 16%, the lowest in CompuBox's then-4,000-fight database.
- **Lomachenko [A]:** steps outside the opponent's lead foot and pivots — "The Matrix." Signature: the **slip-shift** (step with a slip, coil, spring forward so the lead foot rounds the opponent's lead foot), the **step-through**, the **jab-and-pivot** (jab, pivot 45° on the lead foot). Vs Linares (2018): right foot outside, trapped the lead hand, walked toward his back, pivoted and landed the left cross as Linares turned.
- **Pacquiao [A]:** "bounce in, unleash a flurry, and then bounce out." Entry starts with a slight weight shift, then a quick lead-foot step; inside, short choppy steps constantly adjusting the angle. Lead-foot placement determines the exit path: lead foot outside → exit right (vs Cotto); step in on the left cross → exit left.

## 3. The step-back / reset

**Mechanics [C]:** the standard retreating step — **rear foot moves first**, stepping back 6–12 in, then the lead foot follows the same distance so stance width, foot angle, and guard height are unchanged at the finish. Moving the lead foot first is the classic mistake (narrows the stance dangerously).

**Straight back or at an angle? [C/A]:** one short step back "can solve a problem for one beat. An angle can solve the next one." Textbook sequence: **step back, then angle out**. Stepping straight back repeatedly just walks you to the ropes. If the opponent can't reach you in two normal steps after your retreat, you've gone too far.

**How long out? [M]:** no-fighting phases average ~1.8–4.7 s, range ~1.6–7.1 s (Martusciello et al. 2025, 12 world-championship finals). A real reset is typically **about 2–7 seconds** — a few breaths and a re-read, not a long holiday. Clinches, the other reset tool, averaged 4.06 ± 2.27 s.

**Hands during it [C/A]:** gloves stay near the face, chin tucked, knees soft — the stance must look the same after the step as before. Mayweather's variant is the **pull**: lean the head/torso back while the feet stay, then fire the pull-counter.

**Fighters famous for it [A]:** Terence Crawford (vs Madrimov, 2024 — breakdowns explicitly annotate "Resetting Distance" / "Step Back Reset"); Rigondeaux (his whole game vs Casimero was step-back-and-reset); Mayweather (pull-and-reset). Canelo is famous for the *opposite* — "No Step, No Reset."

## 4. In-and-out

**Footwork [C/A]:** entry — lead foot leads, rear foot follows, punch lands as the foot lands. Exit — **rear foot leads** (the universal rule: the foot nearest the direction of travel moves first), lead foot follows, stance restored. The best exits are not straight back: **angle out, jab out, or roll out**. The roll-out: drop straight down, push the back foot out, slide the front foot back, rise into guard. The jab-out: throw a jab as you pull the back foot out — the jab stops the opponent following. Vary the exit.

**How far? [I]:** roughly 0.3–0.6 m total (one step-back of 6–12 in plus an angle step) — derived from the step sizes above; no fight-measured exit distance exists.

**Who does it best [A]:** Pacquiao is the archetype (vs Cotto 2009, Hatton 2009, Thurman 2019, De La Hoya 2008). Ali is the heavyweight archetype (Liston I, 1964).

## 5. Circling — and what it looks like from the side

**How boxers circle [C]:** primarily the **lateral step-drag** — the foot in the direction of travel steps sideways, the other shuffles after it, hips square, feet never crossing. The **pivot** is a different tool: plant the lead foot (ball = axle, heel lifted ~half an inch), swing the rear leg around like a gate, rotating the whole stance **45–90°** without surrendering ground. A cross-step is generally coached *against* — but Ali used it, and Canelo cross-steps when circling (costing him a beat) [A].

**From a 2D side view [I — no source addresses this; derived from the geometry]:** circling travels toward/away from the camera, so a literal side view cannot show it as translation. It must be *signalled*:

1. **Feet shuffling without horizontal travel** — small alternating steps in place while screen-x barely changes.
2. **Apparent stance-width change** — the projected distance between the feet narrows and widens as the body rotates.
3. **Torso/shoulder rotation** — shoulders square to camera ↔ edge-on; the lead shoulder rising/falling and the head moving off the centre line are the strongest readable signals.
4. **Lead-foot cross-over** — on a pivot, the rear foot sweeps in a visible arc past the planted lead foot while the torso rotates.
5. **Subtle scale change** — circling toward the camera = fighter grows slightly; away = shrinks.
6. **The opponent's response is the tell** — the circling fighter forces the opponent to turn: the *opponent's* feet shuffling to re-face is what sells that someone is circling. In real footage the giveaway is rarely the circler's translation — it's that the other man keeps resetting his feet.

**Renderer rule:** if the fighter's feet are moving but his screen position isn't, and his shoulders/hips are rotating while the opponent re-faces — the viewer reads "circling." If none of those happen, he reads as standing still.

## 6. Foot feints

**What they look like [C/A]:** the **step feint** — step in as if attacking, then **freeze**; the opponent fires a counter at the expected attack, and you counter the committed counter. The basic foot feint is "a quick step that mimics a real move but is retracted sharply." Related: the **slip feint** (slip to one side without punching, drawing the counter). Against pressure fighters, step/slip feints are *less* effective — the opponent isn't primarily counter-punching.

**Who uses them [A]:** Willie Pep — reportedly once won a round without throwing a single punch, controlling it by feints and movement alone. Ali — feinting *while moving* (shoulders + feet + hands simultaneously). Tommy Hearns — foot feints vs Cuevas to gauge responses. Tyson Fury — feints on the ropes vs Klitschko (2015). Also Morales, Canelo, Mayweather (shoulder feints to probe guard response), Leonard, Pacquiao.

**How often?** No measured feint frequency exists. Qualitative: elite fighters feint *constantly* between exchanges.

## 7. Movement by style

| Style | Observable movement | Step frequency | Direction | Stance |
|---|---|---|---|---|
| **Out-boxer** (Ali, Leonard) | Long range, quick feet, lateral, stick-and-move, pivots out after landing | Highest; needs "elite footwork endurance… moving for 36 minutes" [C] | Circles away from power hand; in-and-out | Bladed, mobile, on toes |
| **Swarmer** (Frazier, Chavez, Tyson) | Constant forward movement, forces opponent onto back foot; bobbing/weaving through the jab | High but *forward* — steps close distance; cutting steps are lateral-interception | Forward with lateral cutting steps | Squared-up, crouched |
| **Slugger** (Foreman, Wilder) | "Less mobile, more stable platform"; slow, predictable feet; walks forward flat-footed | Lowest; but Foreman was an elite ring-cutter using offensive side-steps, not footspeed [A] | Plodding forward; cuts laterally in short steps | Wide, stable, flat-footed |
| **Counter-puncher** (Mayweather, Marquez, Canelo) | Waits, minimal movement, slips/blocks/parries then returns fire in the same motion | Lowest *travel* but constant micro-adjustment | Small pivots and pull-backs | Balanced, weight slightly back; planted in defence |

**Measured volume [M, CompuBox]:** heavyweight ~45–46 thrown/round; lightweight 63.7; welterweight 58.4. Style extremes: Valero (pressure) 93.2/round; Mayweather (counter) 38.6/round. No measured distance-covered-per-round or step-frequency-by-style data exists.

## 8. Fresh vs tired — the feet go first

**What degrades first [C/A]:** the feet go before the hands. "Watch anyone in round three. The hands are still moving. The feet are flat, the stance has widened, and every position change now happens in two steps instead of one." Footwork is *continuous* — calves hold a partially-raised heel for the whole round — while punching is intermittent (~10–20% of a round).

**The five visible stages [C — coaching analysis]:**
1. **Heels drop** — no longer light on the balls of the feet.
2. **Stance widens and squares** — a wider, more stable base takes less work to hold; weight shifts take longer, the pivot slows, punches lose leg power.
3. **Steps get bigger** — fewer, larger steps, with longer off-balance periods.
4. **Feet cross** — the never-cross rule breaks down.
5. **Stop moving** — stand and trade; "a decision fatigue makes for you."

Critically, "punch mechanics can look acceptable through all five stages. The jab still snaps, the guard is still up. Coaches watching hands see a fighter who is doing fine; coaches watching feet see one who stopped moving two rounds ago."

**Measured [M]:** stop time rises across rounds, activity-to-break ratio falls (Davis 2015). Punching-phase duration fell 2.04 → 1.76 → 1.41 s across rounds in 81+ kg (Martusciello 2025); heavyweights increased clinching to 22.9% of fighting actions by round 3. Rigondeaux's step count fell from 582 (R8) to 367 (R11) vs Casimero.

**Named examples [A]:** McGregor vs Mayweather (2017) — "by round six, his footwork became sloppy, and his power faded" after looking untouchable in rounds 1–3. Canelo "takes minutes off during rounds quite frequently" as a pacing strategy. Corbett lost to Fitzsimmons and Jeffries "in the middle of the ring… due to fatigue" after his movement carried him early.

## 9. Cutting off vs escaping

### Cutting off the ring
**The pattern [A/C]:** do not chase in a straight line — **step laterally in the direction the opponent is moving** (mirror their sidestep), shrinking their space and herding them toward the ropes. The Fight Primer's key insight: the basic lead-foot pivot is a *flaw* for a ring cutter, because it swings the back leg away and hands the circling fighter space to escape. Instead the cutter takes an **offensive side step with the right foot** to physically obstruct the path along the ropes, then **drives the left foot across**, right foot behind. "Every step should take away *some* of the distance… from its full size, to a half of its size, to a quarter — and then the circling fighter is basically in the corner at all times." The vital skill is the ability to **step across, break stance, and move with both feet** — not the one-foot-then-drag habit.

**Stance [A]:** the finest cutters used a **more squared stance**; Saddler and Foreman used a smothering **hands-forward, palms-out** stance — Ali nicknamed Foreman "The Mummy." The forward right hand obstructed the opponent's jab.

**The double threat [A]:** Foreman punished escapes both ways — circling left ate a **stepping left hook**; circling right ate a **right hook to the body**. Circling *into* a punch doubles its force.

**Fighters [A]:** Sandy Saddler vs Willie Pep (beating the most elusive boxer ever is "equivalent to a PhD" in ringcraft); George Foreman (Rumble in the Jungle, 1974); Julio Cesar Chavez ("cut off the ring like no one," e.g. vs Roger Mayweather); prime Tyson (vs Biggs, Tubbs). Canelo is a *negative* example in recent years — struggling to cut off the ring laterally.

**Geometry [A]:** once a fighter's back is on the ropes, movement options collapse from 360° to **180°**; in a corner, to roughly **90°**.

### Escaping the ropes/corner
**The tools [C/A]:** (1) **Pivot out** — post the lead hand on the opponent's shoulder, step the lead foot hard to the outside (~45°), rotate the hips through the post — positions swap. (2) **Step out at an angle** — side step + jab/feint, exit diagonally. (3) **Punch your way out** — a sharp counter stuns the attacker for ~half a second; that half-second is the window, and it must be followed *immediately* by a pivot or clinch or it's wasted. (4) **Hook out** — pivot while throwing hooks. (5) **Clinch and turn** — the parachute when the pivot is blocked. (6) **Cross out** — move toward the rear-leg side firing crosses. Never step straight back along the ropes.

**Named examples [A]:** Lomachenko vs Commey (2021) — let Commey push him into the corner, then pivoted out and put Commey in the corner. Canelo vs GGG — the pivot-pull (90° pivot + head pull) off the ropes. Pacquiao vs De La Hoya (2008) — rebounded off the ropes with a looping left hand. Mayweather vs Hatton (2007) — the check hook is a pivot-exit with a punch attached (R10, TKO 1:35).

## 10. Alive vs stiff — the animation ingredients

**Animation principles [C — Thomas & Johnston's 12 principles]:** what reads as "alive" is not smoothness — it is **weight, anticipation, and variation**:
1. **Squash & stretch** — the body changes shape: compress on impact/landing, stretch in fast motion. "Brains know something is fake when it never changes shape."
2. **Anticipation** — a brief pull-back before moving forward. Robotic = moves instantly; organic = prepares first.
3. **Follow-through & overlapping action** — body parts stop at different times; the head, shoulders, hips, and feet move on slightly different timings.
4. **Slow in / slow out and arcs** — movements accelerate and decelerate; hands travel in curves, not straight lines.
5. **Timing & spacing** — contrast slow and fast timing. Guilty Gear Xrd's team **disabled interpolation entirely** and treated every displayed frame as a posed keyframe: "smoother didn't mean better."
6. **Secondary action** — breathing, blinking, guard micro-adjustments.
7. **Exaggeration** — push poses beyond anatomical limits; subtlety disappears at combat speed. "Motion capture without exaggeration often looks weak and floaty in games."

**Boxing-specific [A/C]:**
- **Weight transfer you can see** — the hips and shoulders must move with the feet (Tyson's head-left/foot-left synchrony; Pacquiao's weight shift *before* the lead-foot step). A bounce where only the feet move reads as robotic; the whole kinetic chain must participate. Haislet: "the greatest phase of footwork is the coördination of the hands and feet."
- **Broken rhythm, not a metronome** — "When you bounce in rhythm, he reads you. Step, stop… then go. Break the beat." England Boxing: "the real skill of footwork is in changing direction and tempo."
- **Purposeful micro-motion in "idle"** — even the stillest fighters are doing something. "Idle" is a *loaded* stillness — knees bent, weight on the balls of the feet, ready to move — never a frozen pose.
- **Feet and hands in dialogue** — punches land as feet land; exits begin as the last punch retracts; feints are full-body (shoulder + foot + head together).

## Renderer notes (for Claude)

- **The bounce needs a per-fighter signature, not a per-style sine.** The six fighters above differ in *what oscillates* (Ali: whole-body bounce; Tyson: lateral sway; Canelo: nothing below the waist; Lomachenko: pivots). A style-level bounce frequency is the metronome problem; the fix is per-fighter rhythm parameters — bounce vs sway vs stillness, tempo changes, pauses.
- **Circling must be signalled, not translated.** §5's six cues are the toolkit — feet shuffling without travel, stance-width change, shoulder rotation, rear-foot arc on the pivot, subtle scale, and the opponent re-facing. The opponent's re-facing is the strongest cue and it's free: the brain already makes the opponent turn.
- **The reset is 2–7 seconds.** The brain's reset mode (1.5–4 s) is in the right band — the render just needs to sell it: rear foot back first, then an angle, guard unchanged.
- **Tired feet are a free tell.** The five stages (§8) are a ready-made fatigue visual: heels drop, stance widens/squares, steps get bigger, feet cross, stop moving. The brain already tracks fatigue — the render can stage it.
- **The cutter's step is a two-foot move.** The offensive side step + drive across (§9) is the opposite of the step-drag — both feet move, stance breaks. The pivot-and-follow is the classic mistake.
- **Exaggerate.** At combat speed, subtlety disappears. The animation research is unanimous: push poses past anatomical limits.

## Could not verify

1. **Bounce frequency for any named fighter** — no source publishes a measured cadence in Hz, bounces/min, or steps/min for any individual fighter. Closest proxy: Davis et al. 2015's ~47 hip movements/min across elite male amateurs generally. *The game will need to set bounce cadence by feel/observation from footage, not from a published number.*
2. **Per-fighter step size, direction-change counts, moving-vs-planted time shares** — no source measures these for any individual fighter. Federation specs are coaching doctrine, not fight measurements.
3. **Distance covered per round** — no peer-reviewed measurement exists. The only figure is Rigondeaux's ~2.48 miles, derived from an assumed 27-inch walking stride — boxing steps are far shorter than walking strides, so it overstates true distance; illustrative only.
4. **Feint frequency** — no source counts feints.
5. **Fight-measured reset distances** — coaching specs give 6–12 in for a single retreating step; no fight study measures actual reset distances.
6. **Reset durations in professional (12-round) fights** — the only measured numbers are from elite amateur women (NF phases ~2–7 s). Professional pacing is likely slower/longer, but unmeasured.
7. **"15–25% decline in punching power and footwork precision by the fifth round"** — claimed by a betting article attributing it to IJSPP studies; no primary source found. Do not use.
8. **What circling looks like from a 2D side view** — no source addresses this; §5's cues are inference from the geometry of the step-drag/pivot mechanics, flagged [I].
9. **Disagreements:** bouncing (Boxing Canada teaches it, England Boxing teaches minimal bounce — no consensus); Canelo's flat feet (weakness vs deliberate energy-saving system — both readings cite the same fights); Ali vs Foreman 1974 (movement narrative vs Fight Primer's clinch/durability claim); Mayweather's feet ("never in one spot >1 s" vs "planted when defending" — reconcilable: planted *during* defensive exchanges, drifting *between* them); elite boxers cover *less* distance with better positioning ("waste zero movement"), contradicting the assumption that more steps = better footwork.
10. **Fight-footage preference:** most detailed footwork mechanics come from coaching sources, not fight breakdowns — quantitative footwork analysis of actual fights barely exists outside the time-motion studies and CompuBox counts cited above.

## Key sources

- Davis et al. 2015, "The Activity Profile of Elite Male Amateur Boxing," IJSPP 10:53-57
- Martusciello et al. 2025, "Time–Motion Analysis of the 2023 Women's World Boxing Championships Finals," Sports 13(6):187
- Finlay et al. 2022, systematic review, Eur J Sport Sci
- Bad Left Hook, "How far did Guillermo Rigondeaux go?" (2021)
- The Fight Primer, "Finding the Art — Cutting the Ring"
- Embracing the Grind, "Mike Tyson Technique Breakdown pt 3: Peekaboo"
- Paak Club, "Boxing footwork & distance" (England Boxing, Boxing Canada, Swiss Boxing)
- Fight Encyclopedia: footwork, retreating step, circle out, feints guides
- Haislet, *Boxing* (1940)
- Thomas & Johnston's 12 principles of animation (via Pixune, Artemisia College, Rantala 2013 thesis)
