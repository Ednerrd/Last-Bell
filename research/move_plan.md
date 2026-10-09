# Movement plan (Oct 9 2026)

Built from `move_fundamentals.md`, `move_elite.md`, `move_flow.md` and `move_anim.md`. Most facts in them are (snip) because the proxy blocked full pages, and the Hz/cm numbers are (est.): tune them by eye on the strip and on Ed's S25.

## Bugs found (checked in code)
- Feet skate: `fight.js` rebuilds the feet from the center when he isn't stepping (`feetAt`, line ~147), so they slide on every turn and on the punch step-in.
- Feet never leave the canvas: they're drawn at a fixed y of 0.04 (`men.js`).
- A lateral step to the rear-hand side can move the wrong foot first (`footwork.js` picks it by forward/back only).
- The fist reaches zero speed at contact (snap curve `1-(1-k)^3`).

## Render passes (render only, hash kept), in order
1. Foot locking: each foot stays planted until the engine's foot drifts > ~7 cm or turns > 25°, then a 0.10–0.22 s swing with a 2.5–5 cm arc. Ball-of-foot pivots: rear heel 35–50° on a cross, lead foot 20–30° on a lead hook. Heels up 1–4 cm.
2. Weight and torso: pelvis over the loaded foot (lead ~0.4 in guard, ~0.65 on a cross, ~0.15 on a pull). Hips lead, shoulders follow. Torso turn peaks ~20° jab, ~50° cross, ~40° hook (now 7 / 32 / 17).
3. Springs + inertialization (Holden) in `core/math.js`, so punch starts, cancels, defense moves and plants never pop.
4. Hits as velocity kicks: the chest takes it, the head whips 30–40 ms later at ~1.6×, one wobble back. The puncher recoils at ~25%.
5. Fist drives through contact (small overshoot). On a miss, overshoot more and come back slower.
6. Life: replace the sine bounce with seeded noise plus pauses. Per style and guard (from `move_elite.md`): less bounce for boxer/pressure, a big U weave for peekaboo, tight for high guard. Head and torso never still for > ~1.3 s.
7. Defense shapes from the knees: deeper slips (12–18 cm), hips drop with the roll, shoulder roll for philly.

## Engine (sims before/after, own commits, after Ed's call on M4/M3)
- Keep the feet planted when not stepping (the foot-skate fix in `fight.js`) and fix the lateral first-foot rule. This changes the hash.
- Reaction floor: no defense starts sooner than ~100 ms after a punch's first visible frame unless it's a read (`brain/defense.js` delay now .03–.13 s).
- Optional: punches inside a flowing combo snap ~15% faster.
- Low-skill tells for M4: dropping the hand after the jab, squaring up, reaching, flat feet.
