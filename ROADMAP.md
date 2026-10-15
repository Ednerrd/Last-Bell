# Roadmap (one list, in order)

The only to-do list. When something is done, delete its line here and put the numbers in `docs/NOTES.md`.

## Ed (only he can do these)
1. **Delete the old branches on GitHub** (this session can't: 403). Safe to delete: `ccr-026fa9ad-j4d8rw`, `ccr-88f84d50-12dv5y`, `ccr-9a5a152f-n8ld1d`, `ccr-b57f3498-nk3hk1`, `claude/boxer-brain`, `claude/festive-thompson-e2ch70`, `claude/handoff-review-32nske`, `claude/new-session-ne6ynn`, `claude/step9-contact`. Keep `claude/determined-feynman-6z4lju` (the only copy of the Oct 2–6 history: the main line was re-rooted Oct 8) and `claude/brave-einstein-ojkyzm` (v2, parked).

## Claude, in this order
1. **Brain pieces that hang off the levels** (fold into L3–L4):
   - Setups and traps (`research/mind_traps.md`, `mind_combos.md`). **Built, all off (Oct 15).** Ed (Oct 15): dig first, then switch **all five** on. Dig = style runs with all-minus-one (all minus show, minus bank, minus draw, minus delay, minus vary), 300/pair, to find what lifts the outboxer to 57 and drops the counter-puncher to 44; fix it, then switch on (steps in `docs/BRAIN.md` "Handoff (Oct 15, after traps)"). Also check PvN 3.7 vs the traps-off run.
   - Hurt brain by tier; the finisher weighs the risk (`research/mind_vision.md` 8d). Ed: most go for the stop; a novice swings for the fences, a vet picks clean shots and respects that a hurt man can still defend, fight back, or land a fight-ending counter (rare). Most dangerous when hurt: experienced men; anyone can, rarely. Finisher caught 0.7% of hunts (want 5–10); same-round stop after a KD ~25% (research 35–45).
   - Gas pacing + coach calls into the brain (built together). Ed: a man who knows his tank adjusts naturally and adapts to the fight; the coach can tell him to pick it up or slow down. Calls reach the brain both from the corner (weighs more) and live mid-round; he always listens (no trust system yet). Then the rest of the shouts/corner orders.
2. **L6 balance pass** (one level down 15–20%; then the CLAUDE.md targets; specials not re-checked since L2). Ed: "the better fighter wins": no single factor decides; landing, adjusting, best shots, best combos and coaching all add up, style vs style included.
3. **Fighter traits** (glass jaw, slow starter, dangerous when hurt, fades late), from the parking lot.
4. **L4 learning** (skills grow from fights and camp).
5. **Retire `decide()`/`react()`** (bvo and the same.js old-AI hash still use it).
6. **Merge `claude/brain-wire` into the main line.** Republish the fight lab only when Ed says (Oct 15: "when I say").
7. **After the whole engine is done (items 1–6):** 3D phase 1 (`proto/PLAN.md`; Ed's top gripe is the 2D look: fighters, punches, distance, can't read punches), footwork during punches (in 3D), career back, L5 (skill sheet UI), gym mode steps 3–6 (`docs/GYM.md`).

## Done lately (numbers in `docs/BRAIN.md`)
- Oct 11–14: the brain on the engine (behind `AI.brain`), finishing and the hurt brain, balance pass, weak specials, angle fighter, out-boxer off the ropes, all specials 47.4–52.1, body KDs on target.
- Oct 14: skill levels L3 (style and stance familiarity, `sheet.know` read by the brain), tuned softer to `research/mind_southpaw.md`: never saw a southpaw ~46%, the southpaw at default know ~53%, never saw the style ~48% (`docs/BRAIN.md`). Possible ~1.5 pt orthodox edge in the engine itself, unproven.
- Oct 14: skill levels L0 (baseline), L1 (skill sheet: `sheet.sk`, `sheet.know`, `levelOf`, walk-in and record defaults) and L2 (what a level does: force, gas, off balance, flinch, tells, feints, combo length, adjusts, freezing; one level down wins 15–20%, was ~31%).
- Oct 14: project review, dead code from the career cut removed. The brain is the default AI (same.js ac686464).
- Oct 9 (on the v2 branch): Ed's S25 Ultra phone test, 60 fps on every quality setting with shadows on. Defaults res 2 / shadows on / cap 60.

## Decided (don't reopen)
- Ed, Oct 14 (project review): keep v1, v2 (`claude/brave-einstein-ojkyzm`) parked. Focus is the AI, the brain and the fight sim; career, camp and the rest of the game come after. Live game stays as is until then. The brain is the default AI. Brain thrown target ~52/rd. Skill-sheet walk-in defaults OK as they are.
- No 2D-only render polish (uppercut curve, close-range spacing): 3D redoes the animation.
- Lab B rhythm (`ccr-026fa9ad-j4d8rw`) is dead; Ed picked Lab A. The parallel step 6 (`ccr-b57f3498-nk3hk1`) is superseded.
- Ring IQ when hurt or tired as its own step: parked; it lives in the hurt brain now.
- Corner lesson size: medium (`TEACH` .18 / .7 / .7).
- Ed, Oct 15 (12-question round): coach calls DO go into the brain now (replaces Oct 13's no): corner and live, corner weighs more, he always listens. 3D waits until the engine is done (brain list, balance, traits, L4). Lab republish only when Ed says.
- Stats vs skills (Ed, Oct 14, after L0: "start the next phase"): stats are the body (power, speed, chin, stamina...), skills are what he knows how to do with them and grow from fights and camp. Level comes from skills; bodies inside a division stay close; a skill level gets worth a bit more (L0: skills-only gap 32% upsets, target 15-20%).
- No sparring in the skill system for now. No bond/trust system yet.

## Parking lot (ideas, not scheduled)
- Corner: "fire him up" / "calm him down" / "tell him the truth"; cutman priority (cut, swelling, or breathing).
- Mentality: confidence, composure, frustration that leads to fouls.
- Opponent-specific camp: spar partners who copy his style, film study that reveals a habit to call.
- Live read line during the round ("he's landing the right over your jab").
- Call combos by number in corner talk; AI corner shouts; drill a combo in camp.
- Mind knobs for named fighters (`research/mind_p4p_a.md`, `_b.md`), P4P data refresh (verify first: Opetaia, Nakatani at 122).
- Bond/trust: good calls build trust, low trust argues back and can leave.
