# Feet During Punches — Last Bell research brief #2

**For the renderer.** How the feet look and move when a punch is thrown. Grounded in fight breakdowns, slow-mo replays, and lab studies. Full report with sources: `research_notes/boxing-feet-punches-20261116-1253/report.md`.

## Headline

**The jab is the only punch that steps. Everything else plants and pivots.** The cross pivots the rear foot, the hook pivots the same-side foot, the uppercut dips the knees and drives up off the same-side foot. After any step-in, the rear foot drags/slides up to restore stance width. The textbook isn't the whole story — the exceptions are what make fighters recognisable.

## Punch → what each foot does

| Punch | Lead foot | Rear foot | Weight at landing | Step or plant? |
|---|---|---|---|---|
| Step jab | Steps forward, lands on the ball with the fist | Drags/slides up immediately after | Slightly back → forward through the step | **STEP** |
| Stationary jab | Planted | Small push-off, stays down | Slightly back | Plant |
| Cross | Planted | **Pivots on ball**, heel out + slightly up | ~60% front (measured) | Plant |
| Lead hook (textbook) | **Pivots on ball**, heel out | Planted | ~50/50 (measured) | Plant |
| Lead hook (Canelo) | **Planted flat**, no pivot | Planted, drives | Front-foot heavy | Plant |
| Lead hook (Napoles) | **Hops** — both feet leave the canvas | **Hops** | Forward through the hop | Hop |
| Rear hook | Planted | **Pivots aggressively**, heel out | ~50/50 | Plant |
| Lead uppercut | Pushes off, drives up | Heel **plants** into the floor | Slightly lead | Plant |
| Rear uppercut | Planted | Pushes off ball + **pivots** | Slightly rear, then rises | Plant |
| Combo exit (pivot) | **Planted on ball**, body rotates around it | Lifts slightly, swings in an arc (30–90°) | Centred | Pivot |
| Combo exit (L-step) | Steps 45° out (or follows) | Steps back-and-side, forms the L | Centred | Step |
| Shift (Dempsey/Tyson) | Becomes the rear foot | **Steps past the lead foot** mid-punch | Forward through the shift | Step-through |

## The details

**Step vs plant.** The step jab: lead foot stabs forward and lands at the same moment the fist lands — "the jab and the step are one motion, not two separate things." Lead foot lands on the ball, not flat (landing flat "kills agility"). When already in range, the jab plants: lead foot stays down, small push off the rear foot. Cross, hooks, uppercuts all plant. Fighter example: **Jose Napoles** — frame-by-frame breakdown shows the textbook stepping jab in a real fight, back foot brought up second to shorten the stance.

**Lead-hook pivot.** Textbook: lead foot pivots on its ball, heel swinging outward, hip rotation drags the arm through — "the power is in the pivot, not the swing." But **Canelo plants his lead foot and doesn't pivot** (three social breakdowns, bag-work footage only, contested in comments — flagged, not fight-verified). **Napoles hopped** into his hook with both feet off the canvas. Weight on the hook is ~50/50 measured (Dinu & Louis 2020), despite coaching sources disagreeing about which way it shifts.

**Back foot on the cross.** Pivots on the ball, heel turns outward and lifts slightly ("stubbing out a cigarette"). Does NOT lift off entirely or drag. Lead foot stays planted. Unanimous across 7 sources. Measured: cross has the highest ground reaction force of any punch (947.54 N, Stewart et al. 2025), driven by the rear leg. Fighter example: **Thomas Hearns** — carried most of his weight on his back foot until violently shifting into the cross.

**Step-out after a combo.** Three exits, never straight back: (1) lead-foot pivot — rear foot swings 30–90° in an arc, **Lomachenko** vs Linares (2018) is the signature example; (2) L-step — rear foot back-and-side, also Lomachenko; (3) push step — **Naoya Inoue**. The last punch can BE the exit: the hook's hip rotation carries the rear foot into a pivot.

**Drag after step-in.** Yes — the rear foot slides along the canvas immediately after the lead foot lands, restoring stance width. A slide, not a second step. Exception: the Dempsey/Tyson shift, where the rear foot steps PAST the lead foot mid-punch.

**Weight at landing, by style.** Measured per punch (Dinu & Louis 2020): cross ≈ 60% front foot, hook/uppercut ≈ 50/50. Per style is **observational only — no study has measured it**: out-boxer centred-to-back on toes (**Ali**), swarmer forward/heavy on front leg (**Frazier, Tyson**), slugger flat-footed and planted (**Foreman, Canelo**), counter-puncher weight back (**Mayweather** — his pull-back hook has weight already retreating at impact), boxer-puncher balanced with violent shifts (**Hearns, Napoles**).

## Notes for the renderer

1. **The jab is the only step.** If the renderer steps on every punch, it will look wrong. Crosses, hooks, and uppercuts are thrown from planted feet — the feet rotate, they don't travel.
2. **The rear foot is the engine, the lead foot is the anchor.** The drive starts at the rear forefoot and the rear leg produces most of the ground force. When in doubt: rear foot moves, lead foot stays.
3. **Show the heel.** The single most visible foot detail is the rear heel lifting and swinging outward on the cross, and the lead heel swinging outward on the hook pivot. Get the heels right and the feet read correctly even at small size.
4. **The drag is a slide, not a step.** After the step jab, the rear foot slides along the canvas, pulled not placed. If it lifts and steps, it reads as a second step and the rhythm breaks.
5. **The pivot exit is the money move.** Lomachenko's whole style is: punch, pivot off the lead foot, punch from the new angle. The rear foot swinging in an arc while the lead foot stays pinned is the most recognisable footwork in modern boxing.
6. **Style should change the feet, not just the hands.** Swarmer front-foot heavy and crouched; counter-puncher weight-back with the pull-back hook; slugger flat-footed and planted; out-boxer up on the toes. The style table is observational, not measured — but the visual differences are real and visible in footage.
7. **The exceptions are features, not bugs.** Canelo planting on the hook, Napoles hopping into the hook, Tyson stepping rear-foot-first, Dempsey shifting mid-hook — these are what make individual fighters recognisable. Consider giving different archetypes different foot behaviours: textbook pivot for the out-boxer, plant for the slugger, hop for the flashy boxer-puncher, shift for the swarmer.

## Could NOT verify

- Pivot angles in degrees (no measurement exists for any pivot).
- Weight distribution by fighting style (no study splits by style).
- Drag distance/timing in ms, step-out timing in ms, rear-heel lift height in cm.
- Body-jab footwork specifically.
- Frazier's lead-hook foot (no frame breakdown found).
- The Canelo no-pivot claim in a real fight (bag-work footage only, contested).

## Key sources

Dinu & Louis 2020 (PMC, punch biomechanics + weight distribution); Stewart et al. 2025 (lower-limb kinetics, GRF); Sensors 2026 (plantar pressure); Fight Primer — Napoles (frame-by-frame); BOXwithSimmy (pivot, jab); Jabster (hook); BoxRope + Darren Barker (cross); Fight Encyclopedia (step jab, double shift).
