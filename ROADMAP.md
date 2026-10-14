# Roadmap (one list, in order)

The only to-do list. When something is done, delete its line here and put the numbers in `docs/NOTES.md`.

## Ed (only he can do these)
1. **Delete the old branches on GitHub** (this session can't: 403). Safe to delete: `ccr-026fa9ad-j4d8rw`, `ccr-88f84d50-12dv5y`, `ccr-9a5a152f-n8ld1d`, `ccr-b57f3498-nk3hk1`, `claude/boxer-brain`, `claude/festive-thompson-e2ch70`, `claude/handoff-review-32nske`, `claude/new-session-ne6ynn`, `claude/step9-contact`. Keep `claude/determined-feynman-6z4lju` (the only copy of the Oct 2–6 history: the main line was re-rooted Oct 8) and `claude/brave-einstein-ojkyzm` (v2, parked).

## Claude, in this order
1. **L3 targets with Ed:** L3 is built and on (`BR.fam`, `levels.js know`): never seen the style/stance = ~44% of decided fights, southpaw edge at default know ~4–5 points. Ed picks: keep, stronger, or softer.
2. **Brain pieces that hang off the levels** (fold into L3–L4):
   - Setups and traps: "show it twice, change it", armed traps, body bank, adjust delay by tier (`research/mind_traps.md`, `mind_combos.md`).
   - Hurt brain by tier; the finisher weighs the risk (`research/mind_vision.md` 8d). Finisher caught 0.7% of hunts (want 5–10); same-round stop after a KD ~25% (research 35–45).
   - Gassers save it for later (stamina pacing).
3. **L6 balance pass** (one level down is 15–20% now; then the CLAUDE.md targets; counter-puncher 47.2 and swarmer 53.9 on the band edges; specials not re-checked since L2).
4. **Retire `decide()`/`react()`**: the brain is the default now; L2 is in; keep the old AI until L3 settles (bvo and same.js old-AI hash still use it).
5. **Merge `claude/brain-wire` into the main line and republish the fight lab** (with Ed's OK; the lab still shows the Oct 6 build).
6. **After the AI / brain / fight sim:** career back, then L4 (learning from fights and camp), L5 (skill sheet UI), gym mode steps 3–6 (`docs/GYM.md`), 3D phase 1 (`proto/PLAN.md`; the phone numbers are in, see below), footwork during punches (do it in 3D).

## Done lately (numbers in `docs/BRAIN.md`)
- Oct 11–14: the brain on the engine (behind `AI.brain`), finishing and the hurt brain, balance pass, weak specials, angle fighter, out-boxer off the ropes, all specials 47.4–52.1, body KDs on target.
- Oct 14: skill levels L3 (style and stance familiarity, `sheet.know` read by the brain; numbers in `docs/BRAIN.md`).
- Oct 14: skill levels L0 (baseline), L1 (skill sheet: `sheet.sk`, `sheet.know`, `levelOf`, walk-in and record defaults) and L2 (what a level does: force, gas, off balance, flinch, tells, feints, combo length, adjusts, freezing; one level down wins 15–20%, was ~31%).
- Oct 14: project review, dead code from the career cut removed. The brain is the default AI (same.js ac686464).
- Oct 9 (on the v2 branch): Ed's S25 Ultra phone test, 60 fps on every quality setting with shadows on. Defaults res 2 / shadows on / cap 60.

## Decided (don't reopen)
- Ed, Oct 14 (project review): keep v1, v2 (`claude/brave-einstein-ojkyzm`) parked. Focus is the AI, the brain and the fight sim; career, camp and the rest of the game come after. Live game stays as is until then. The brain is the default AI. Brain thrown target ~52/rd. Skill-sheet walk-in defaults OK as they are.
- No 2D-only render polish (uppercut curve, close-range spacing): 3D redoes the animation.
- Lab B rhythm (`ccr-026fa9ad-j4d8rw`) is dead; Ed picked Lab A. The parallel step 6 (`ccr-b57f3498-nk3hk1`) is superseded.
- Ring IQ when hurt or tired as its own step: parked; it lives in the hurt brain now.
- Corner lesson size: medium (`TEACH` .18 / .7 / .7).
- Coach shouts / corner orders do NOT get wired into the brain (Ed, Oct 13).
- Stats vs skills (Ed, Oct 14, after L0: "start the next phase"): stats are the body (power, speed, chin, stamina...), skills are what he knows how to do with them and grow from fights and camp. Level comes from skills; bodies inside a division stay close; a skill level gets worth a bit more (L0: skills-only gap 32% upsets, target 15-20%).
- No sparring in the skill system for now. No bond/trust system yet.

## Parking lot (ideas, not scheduled)
- Corner: "fire him up" / "calm him down" / "tell him the truth"; cutman priority (cut, swelling, or breathing).
- Fighter traits (glass jaw, slow starter, dangerous when hurt, fades late), earned or lost over a career.
- Mentality: confidence, composure, frustration that leads to fouls.
- Opponent-specific camp: spar partners who copy his style, film study that reveals a habit to call.
- Live read line during the round ("he's landing the right over your jab").
- Call combos by number in corner talk; AI corner shouts; drill a combo in camp.
- Mind knobs for named fighters (`research/mind_p4p_a.md`, `_b.md`), P4P data refresh (verify first: Opetaia, Nakatani at 122).
- Bond/trust: good calls build trust, low trust argues back and can leave.
