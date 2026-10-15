# Roadmap (one list, in order)

The only to-do list. When something is done, delete its line here and put the numbers in `docs/NOTES.md`.

## Ed (only he can do these)
1. **Delete the old branches on GitHub** (this session can't: 403). Safe to delete: `ccr-026fa9ad-j4d8rw`, `ccr-88f84d50-12dv5y`, `ccr-9a5a152f-n8ld1d`, `ccr-b57f3498-nk3hk1`, `claude/boxer-brain`, `claude/festive-thompson-e2ch70`, `claude/handoff-review-32nske`, `claude/new-session-ne6ynn`, `claude/step9-contact`. Keep `claude/determined-feynman-6z4lju` (the only copy of the Oct 2–6 history: the main line was re-rooted Oct 8) and `claude/brave-einstein-ojkyzm` (v2, parked).

## Claude, in this order
1. **Brain pieces that hang off the levels** (fold into L3–L4):
   - Hurt brain: by tier ON, the finish after a KD ON (Oct 15). Still open: the hurt vet's counter danger unmeasured (too rare for 300/pair: pool it). Finisher caught ~1% of hunts; stung ~14% is the honest measure.
   - Coach calls + gas pacing: ON (Oct 15). Open: the AI corner (`aiStrategy`) is blind: its plans only beat a silent corner by ~3 in mirrors, pressure loses 4 pts as a blanket plan (the engine's lead-and-get-countered lean, L6). The AI corner never says pick it up / slow down yet. Rest of the corner talk (parking lot) later.
2. **L6 balance pass** (one level down 15–20%; then the CLAUDE.md targets; specials not re-checked since L2). Ed: "the better fighter wins": no single factor decides; landing, adjusting, best shots, best combos and coaching all add up, style vs style included.
3. **Fighter traits** (glass jaw, slow starter, dangerous when hurt, fades late), from the parking lot.
4. **L4 learning** (skills grow from fights and camp).
5. **Retire `decide()`/`react()`** (bvo and the same.js old-AI hash still use it).
6. **Merge `claude/brain-wire` into the main line.** Republish the fight lab only when Ed says (Oct 15: "when I say").
7. **After the whole engine is done (items 1–6):** 3D phase 1 (`proto/PLAN.md`; Ed's top gripe is the 2D look: fighters, punches, distance, can't read punches), footwork during punches (in 3D), career back, L5 (skill sheet UI), gym mode steps 3–6 (`docs/GYM.md`).

## Done lately (numbers in `docs/BRAIN.md`)
- Oct 15: coach calls + gas pacing ON (`BR.coach`, `BR.gas`). The corner's plan and the live shout move his own plan (corner .6, live .45 of it); new calls Pick it up / Slow down (buttons, corner plans, talk). Live shouts at 1200: oracle 54.5, none 51.1, random 45.7: a good coach wins fights, a bad one loses them. Gas: a smart man budgets his tank to the rounds left, spends in the last round and when the other man fades; a novice comes out hot. Styles 47.9–53.9, one level down 15.7–16.7. Hash 8443008f.
- Oct 15: the finish after a KD ON: a man off the floor heals at 30% speed the rest of the round (`TUNE.kdRegen` .3, engine) and the man who dropped him chases 25 s, not 10 (`BR.fin.kdWob`). Same-round stop after a KD 25.6 → 35.8%, stops 23.4 → 29.6% (finish 1200), audit 26.4%. Styles 46.3–52.3 (counter low), one level down 14.3–16.3. Hash caec652, old AI 445f9aa3.
- Oct 15: hurt brain by tier ON (`BR.hb`): Novice reckless hunts 18→51%, behind the guard 74→40%; World behind the guard 71→76%; one level down 14–17% (was 16–18). Hash 42febe1a.
- Oct 15: setups and traps ON (show, bank, draw, delay, vary). Leave-one-out dig: vary (unconditional habit breaking) cost the counter-puncher; now he only varies after the habit got him hit. Pooled styles on 46.9–53.5 (off 46.0–53.1), level gaps unchanged, audit 50.6 / 14.8 / 29.2%, stops 23.8%. Hash 281f4411. Research: `mind_coach.md`, `mind_traits.md`.
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
- Ed, Oct 15 (12-question round): coach calls DO go into the brain now (built and ON the same day) (replaces Oct 13's no): corner and live, corner weighs more, he always listens. 3D waits until the engine is done (brain list, balance, traits, L4). Lab republish only when Ed says.
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
