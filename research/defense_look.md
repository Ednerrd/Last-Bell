# What each defense looks like

By Muse (Stephie), Nov 16, 2026: Claude's research brief #5. It pairs with `contact.md`: once the arms reach right, the hits need to land right too. Both go in the same render pass.

The engine already produces these outcomes: clean, blocked, leaky block, parried, slipped, rolled, countered. This file gives the frames for each one: the gloves, head and feet, and how the attacker's arm reacts. One real fighter per example. Tags: [M] measured (lab or study), [T] textbook or taxonomy, [I] inference (flagged, not a measurement). "Unmeasured" means no source has it: the renderer picks the value, and should know it's a pick.

**Claude's map onto the engine** (`miss()` in `index.html`, the `mt` field): the engine already splits `rolled` (def `roll`) from `ducked` (def `duck`), so **rolled = (A) the shoulder roll** and **ducked = (B) the bob and weave**. It also has `pulled` (the pull back), `short`, `jammed` and `wild`, which this file doesn't cover. Countered = the defender's own punch landing on a man caught extended: his frames are the defense first, then a clean punch.

## Summary

| Outcome | Gloves | Head | Feet | Attacker's arm |
|---|---|---|---|---|
| Clean | Down or out of position, no contact | Snaps back or turns, chin to the collarbone | Planted, then buckle | Drives through ~110 mm, then comes back |
| Blocked | Guard set, the punch lands on the gloves or forearms | Stays behind the guard, no snap | Set, planted | Stopped on the guard or deflected over the top |
| Leaky block | Parted or gone around, a glancing contact | Takes a damped hit (how much: unmeasured) | Unmeasured | Keeps going through the guard |
| Parried | A short sharp tap, straight back to the guard | A slight slip, doesn't fully leave the line | Planted, a small step to the side after | Caught and redirected, a big miss |
| Slipped | Stay up, no contact | 2–4 in off the line | Planted, the weight shifts (a pivot is a variant) | Whiffs fully out, over the shoulder |
| Rolled (A), shoulder roll | Lead low, rear at the cheek; the shoulder takes it | Tilts away behind the raised lead shoulder | A pivot, weight to the back foot | Slides off the shoulder, past the ear |
| Ducked (B), bob and weave | Stay up, never drop with the head | Drops 6–12 in, a U under the punch | Planted, knees and hips bend, weight moves across | Swings over the ducked head and carries on past |
| Countered | The defense hand first, then the counter fires | Moves first (slip, pull, duck), then back on the line | Planted (pull) or a 90° pivot (check hook) | The victim's arm is stuck out |

## Timing

- Punch start to impact ~100 ms (~3 frames at 30 fps), 8.9 m/s at impact; peak force inside 14 ms of contact (under a frame) [M, Atha 1985].
- Punch times disagree across studies (jab 148 ms vs 405 ms): different start points. No single value to trust.
- The counter window is the only sourced defensive timing: 150–400 ms after the other man's punch peaks (~5–12 frames); slip + counter 0.3–0.5 s (~9–15 frames) [T, taxonomy typicals, not lab data].
- How long a slip, block, leaky block, parry, shoulder roll or bob and weave takes: unmeasured. Don't assign ms.
- Lab anchor (Wang & Korobeynikov 2026, 28 elite boxers, slips / ducks / sidesteps pooled): centre of mass moves 25.6±2.8 cm at 133.2 cm/s, time to peak force 85±18 ms, activation delay 62±14 ms. That's the whole body's centre of mass across three moves: NOT the head's movement and NOT one move's duration.

## Clean (lands flush)

Not a defense: the defense failing.

- **Gloves:** down or out of place at impact; the glove never touches the punch. Pacquiao "leaped at Marquez, hands-down" before the right landed.
- **Head:** snaps back and/or turns hard, the chin forced to the collarbone. Lab: 53 g head acceleration [M, Atha 1985]; a hook 71.2 g and 9,306 rad/s² [M, Viano 2005]. How far the head moves in a real fight: unmeasured.
- **Feet:** planted at impact, then they go: the legs give, he falls back. (Sources describe the KO; a clean jab that doesn't drop him is undescribed.)
- **Attacker's arm:** drives through the target, following through ~110 mm past first contact, 1.8 m/s left after 8.9 at impact [M, Atha 1985 full text, via a transcription: flag]. It does NOT stop dead or bounce off.
- **Duration:** the punch 100 ms (~3 frames), peak force under a frame; the head snap and the fall play out over the next frames (unmeasured).
- **Fighter: Mike Tyson.** Against the unbeaten Michael Spinks (27 June 1988, 91 seconds), a right hand snapped Spinks's head back and "literally lifted him off his feet."

## Blocked

- **Gloves:** a set guard the punch lands on. High guard: both gloves by the cheekbones, forearms parallel, elbows down; hooks land on the gloves, straights are stopped or go over the top. Cross-arm: forearms across the face, elbows together; punches land on the forearms and elbows.
- **Head:** stays behind the guard. No source describes a head snap on a good block: the guard takes it, not the head. At most a small brace or shudder (an artistic choice).
- **Feet:** set and planted; the cross-arm is for "absorbing combinations in the corner or against the ropes". No step, pivot or weight shift described.
- **Attacker's arm:** "stopped by the gloves or deflected over the top of the guard." Thud and give, the glove squashing, the rebound: NOT in any source. Safe reading: the arm stops on the guard or goes over the top, then comes back.
- **Duration:** unmeasured; the guard is already there before the punch arrives.
- **Fighter: Ronald "Winky" Wright.** A high guard with freakishly long forearms; Shane Mosley was "simply unable to penetrate Winky's guard effectively" in two fights.

## Leaky block (the punch gets through the guard)

The thinnest one. "Leaky block" isn't a standard term anywhere, and no study exists; this is rebuilt from fight reports of punches that split a guard.

- **Gloves:** start in a guard, then get parted or pushed aside. Canelo "squeezed a pinpoint left hook through Plant's guard to the temple" in round 11 (2021); the shot "pierced his guard, opening up a hole where his glove was." How: short uppercuts slide up the middle seam between the gloves, most of all after body shots, when the elbows flare. How far the gloves move: unmeasured.
- **Head:** takes part of it. Plant took "a disorientating shot" through the guard: the head snaps or turns, less than on a clean shot (how much: unmeasured). The renderer picks a damped clean snap, as a design call.
- **Feet:** unmeasured.
- **Attacker's arm:** keeps going through the guard instead of stopping on it or glancing off: that's what sets it apart from a block. Speed or follow-through after the gloves: unmeasured.
- **Duration:** unmeasured.
- **Fighter:** nobody is famous for *having* a leaky block (flag). On the other side, **Canelo Alvarez** made them: vs Caleb Plant (6 Nov 2021, round 11) the left hook through the guard, then the right uppercut for the first knockdown, on the way to undisputed at 168.

## Parried

- **Gloves:** one glove makes a short sharp tap; it doesn't catch or stop the punch. "Wrist and elbow generate the small deflecting arc, shoulder holds the guard frame." The hand "moves only a few inches to redirect the punch" and "then immediately returns to guard position." Where it meets the punch, sources disagree: mid-extension (a defense guide) vs the last third of the punch (a parry page). The renderer picks.
- **Head:** mostly stays, with a slight slip that finishes with the parry; the parry "does not fully remove the head from the jab's path." How far: unmeasured ("slight").
- **Feet:** planted during the parry (less footwork than a slip). A parry alone leaves him on the same line: "the step offline (a slight lateral step with the lead or rear foot) is what opens the angle." Step length: unmeasured.
- **Attacker's arm:** caught and redirected, not stopped. "A lateral nudge at the wrist or forearm rotates the attacking arm about the opponent's shoulder and multiplies into a large miss at the fist." Knocked across the defender's body or past the lead shoulder; the sweep "forces the opponent's arm across their own centerline, opening the chin to the counter cross."
- **Duration:** unmeasured: a brief contact, the hand straight back.
- **Fighter: Bernard Hopkins.** His "Shield": the lead arm across the middle, the chin behind the shoulder, parrying while making counter openings, vs Kovalev and Dawson (the source is a social-media breakdown: weaker, flag). Better documented: Pacquiao's parry and counter on Mayweather, 2015.

## Slipped

- **Gloves:** stay up, never touch the punch. "Dropping the hands while slipping" is a listed mistake. Canelo-Plant round 6: "most [of Plant's 21 jabs] didn't even touch his gloves."
- **Head:** a few inches off the line to the side with a slight dip: 2–4 in (5–10 cm) across sources, 3–4 in per Haislet 1940. The trunk turns, the punch goes over the shoulder and past the ear, the chin stays behind the shoulder, eyes level.
- **Feet:** sources disagree. Most (Fight Encyclopedia): the feet stay planted and the ankles tilt the base; weight to the lead foot (outside slip) or a little to the rear foot (inside slip). A variant (FightCamp): pivot the foot and open the stance; Whitaker pivoted after the slip. Default: planted with the weight shift; a small pivot is a documented variant.
- **Attacker's arm:** whiffs past the head, fully out, over the shoulder ("the punch's forward vector passes over the shoulder without meeting any structure to transfer into"). He's left "still extended and momentarily unable to recover their guard."
- **Duration:** unmeasured. Nearby numbers only: reading the shoulder gives a 60–100 ms earlier cue; 85±18 ms to peak force for pooled moves. Arithmetic only (flag): 25.6 cm ÷ 133.2 cm/s from Wang ≈ 190 ms ≈ 6 frames, not a measured slip.
- **Fighter: Canelo Alvarez.** End of round 6 vs Caleb Plant (6 Nov 2021): Plant threw his left 21 times, never landed once, and most didn't touch Canelo's gloves.

## Rolled: two moves share the name

The shoulder roll "uses the lead shoulder to deflect a jab or cross"; the bob and weave is "designed for hooks and overhands". In our engine they're already two outcomes: `rolled` is (A), `ducked` is (B).

### (A) Shoulder roll / Philly shell (the engine's `rolled`)

- **Gloves:** the lead hand low across the body, the rear hand high at the cheek; the shoulder meets the punch, not the gloves. "The rear hand stays glued to the chin: it's the primary guard for the other side of the head."
- **Head:** tilts or rolls away behind the raised lead shoulder, the chin tucked behind it ("the torso rotates away from the incoming punch as the lead shoulder lifts toward the jaw and the chin tucks behind it"). How far: unmeasured.
- **Feet:** "hips and rear ankle pivot to supply the rotation rather than the arms"; weight to the back foot. No step: a pivot and a weight shift, feet planted.
- **Attacker's arm:** glances off the shoulder and slides past ("redirected tangentially across the curved shoulder and up past the ear"). Vs Canelo 2013, the slow motion shows "Canelo's right hand contacting Mayweather's shoulder" as he turns and raises the lead shoulder, the punch sliding off, the chin tucked.
- **Duration:** unmeasured ("requires exceptional timing").
- **Fighter: Floyd Mayweather Jr.** "Perfected it into the most effective defensive system in modern boxing"; vs Canelo (14 Sept 2013) he caught Canelo's right on the raised lead shoulder again and again.

### (B) Bob and weave, rolling under a hook (the engine's `ducked`)

- **Gloves:** stay up and never drop with the head ("shoulders loaded so the hands never drop with the head").
- **Head:** drops 6–12 in (15–30 cm) and traces a U under the punch. "Knees and hips flex to drop the head six to twelve inches below the arc of a horizontal punch, the trunk staying upright enough to see, then weight shifts laterally along a U-shaped path under the strike and the legs extend to rise on the far side of the arm, chin tucked." The eyes stay on him the whole way. The 6–12 in is the only sourced head range for any rolling move: a technique taxonomy citing Haislet and Dempsey, not a lab number.
- **Feet:** planted but deeply bent; the weight moves across ("ankles dorsiflex while knees and hips act as the primary level-changers"). No step. The key mistake: "bending at the waist instead of the knees."
- **Attacker's arm:** swings over the ducked head and carries on past; coming back up lands "while the swinging arm has carried the opponent's shoulders past their centreline and left ribs and jaw unguarded." How far it overshoots: unmeasured.
- **Duration:** unmeasured ("the wider the hook, the more time the defender has to complete the dipping motion").
- **Fighter: Mike Tyson.** The peekaboo of Cus D'Amato: ducking under and countering with hooks and uppercuts.

## Countered

"Countered" has two men to draw: the counter-puncher, who defends and then lands, and the man caught extended. Below, the counter-puncher is the defender.

- **Gloves (counter-puncher):** the defense hand does its job first (the slip's hands stay guarding, the parry hand taps, the shoulder roll's rear hand stays at the cheek), then the counter fires from the loaded spot. "All 10 techniques require a defensive movement first; without the defensive trigger, there is no counter." The pull counter's rear hand comes "in the same straight line the jab traveled, arriving while the opponent's arm is still extended." Parry and counter are "a single continuous motion, not two separate actions." The victim's gloves: out, unable to guard.
- **Head (counter-puncher):** moves first (slip, pull back, duck under), then comes back on the line to deliver. Pull counter: "weight shifts to the rear foot, head moves straight back and offline." Marquez "dropped his head underneath Pacquiao's left hand, and threw his right at Pacquiao's chin." The victim's head: as in Clean.
- **Feet (counter-puncher):** planted for the pull counter ("because the feet don't move, the counter travels the shortest possible path back to target"), planted for Marquez, a pivot for the check hook ("pivots 90 degrees to the side while simultaneously throwing the lead hook"). The victim's feet: stepping or leaping in, into it.
- **The victim's punch arm:** whiffs or gets knocked aside, then is stuck out while the counter lands: that's the window. Marquez's right came "over a jab from Pacquiao that missed." The counter's own arm then drives through like a clean shot (~110 mm).
- **Duration:** the only outcome with a sourced window: "typically 150–400 ms after the opponent's punch peaks", the guard open and the balance committed (~4.5–12 frames). The outside slip + counter cross runs "approximately 0.3–0.5 seconds at the elite level" (~9–15 frames). Taxonomy typicals, not footage measurements.
- **Fighter: Juan Manuel Márquez.** 2:59 of round 6 vs Manny Pacquiao (8 Dec 2012, MGM Grand), his back on the ropes: he planted, dropped his head under Pacquiao's left and threw a short right over the jab that "landed purely, forced Pacquiao's chin to his right collarbone, and rendered the Filipino entirely unconscious before he landed face-first." Alternative: Mayweather, the pull-counter man.

## Gaps (couldn't verify)

- How far the head moves in a real fight on clean, blocked, leaky, parried, shoulder roll, countered: never measured. Only the slip (2–4 in) and the bob and weave (6–12 in down) have ranges, neither from a lab.
- How long a slip, block, leaky block, parry, shoulder roll or bob and weave takes: never measured. Only the counter window (150–400 ms) and slip + counter (300–500 ms), both taxonomy typicals.
- The attacker's arm after a blocked punch (thud, give, rebound) and after a leaky block (exit speed, deflection): never measured or described frame by frame.
- The defender's feet on a block or leaky block beyond "set".
- Whether a leaky block slows the punch or the head's acceleration vs a clean shot: no data.
- Punch times disagree across studies (jab 148 vs 405 ms: start points).
- The parry's contact point: mid-extension vs the last third.
- The slip's feet: planted (Fight Encyclopedia) vs a pivot (FightCamp).
- Several signature moments lean on social-media breakdowns, flagged where used. The strongest text sources: BoxingScene (Canelo-Plant), 15Rounds / ESPN (Marquez-Pacquiao), and the studies (Atha, Viano, Wang).

## Sources

- Fight Encyclopedia defense guide + technique pages: slip, parry, shoulder roll / Philly shell, bob and weave, counter-striking.
- Wang & Korobeynikov 2026, BMC Sports Sci Med Rehabil 18:252 (28 elite boxers, simulated combat).
- Atha et al. 1985 (PubMed abstract; full text via a transcription).
- Viano et al. 2005, hook impact on a Hybrid III dummy (71.2 g, 9,306 rad/s²).
- Boroushak et al. 2021, straight punch to the head (simulation).
- Stanley et al. 2018; Piorkowski et al. 2011 (punch times).
- BoxingScene, Canelo-Plant (6 Nov 2021); 15Rounds / ESPN, Marquez-Pacquiao IV (8 Dec 2012); ESPN / Norvan Reports, Canelo-Plant R11; Evolve MMA, 5 Boxing Guards (Winky Wright); Boxing247, Winky Wright; lbsports, breaking down the high guard.
