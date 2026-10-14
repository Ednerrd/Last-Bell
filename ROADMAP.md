# Roadmap (one list, in order)

The only to-do list. When something is done, delete its line here and put the numbers in `docs/NOTES.md`.

## Ed: decide these (they block or reshape the list below)
1. **v1 or v2?** Branch `claude/brave-einstein-ojkyzm` (Oct 9–10) is a ground-zero 3D restart in `v2/` (M0–M2 done plus the FNC brief: fight cam, stagger, ~65 thrown/rd; next was M3). Its CLAUDE.md calls v1 "frozen", but all the work since (brain, finishing, balance, skill levels) went into v1 on `claude/brain-wire`. Pick one: keep v1 and park v2, or port the brain into v2.
2. **Career and gym: coming back?** They were cut from `index.html` (Oct 10). Skill levels L4 (learning from fights and camp) and the gym steps need a career to live in.
3. **Live game:** `index.html` has no career or saves now. Publishing it to the live URL would swap players' careers for the bare fight screen. Keep live as is until the career question is settled, or publish the fight screen somewhere else.
4. **Brain as default:** watch brain vs brain (https://claude.ai/artifact/UHAiLaZMKM7CPMfbsyaYzA), say go/no-go on `AI.brain` = 1.
5. **Brain output:** 51.6 thrown/rd vs the 53 target. Move the target to ~51–52, or bump output? (v2 moved its own target to ~60: "more action than real".)
6. **Skill sheet defaults** (`docs/BRAIN.md` "Skill levels L1"): journeyman / veteran / ranked starting skills are a first guess.

## Claude, in this order
1. **Skill levels L2: the engine reads mastery** (`docs/BRAIN.md` "Skill levels"). How often and how well a skill is tried; a skill he doesn't own gets tried badly (telegraphed, off balance, arm punches, commentary). Tune on `levels.js sk`: one level down wins ~31% today, target 15–20%. Fix the flat ones from L0: feints, between-round adjusts, freezing when hurt.
2. **L3:** style and stance familiarity in the fight (`sheet.know`: slow reads early vs the unfamiliar).
3. **Brain pieces that hang off the levels** (fold into L2–L4):
   - Setups and traps: "show it twice, change it", armed traps, body bank, adjust delay by tier (`research/mind_traps.md`, `mind_combos.md`).
   - Hurt brain by tier; the finisher weighs the risk (`research/mind_vision.md` 8d). Finisher caught 0.7% of hunts (want 5–10); same-round stop after a KD ~25% (research 35–45).
   - Gassers save it for later (stamina pacing).
4. **L4–L6** (after Ed's call on career): learning from fights and camp, the skill sheet UI, then the L6 balance pass (upsets one level down 15–20%, then the CLAUDE.md targets; known weak: feinter ~46–47, swarmer ~47.4).
5. **Retire `decide()`/`react()`** once the brain is the default (needs Ed's go, item 4).
6. **Merge `claude/brain-wire` into the main line and republish the fight lab** (with Ed's OK; the lab still shows the Oct 6 build).
7. **Later:** gym mode steps 3–6 (`docs/GYM.md`, needs the career back), 3D phase 1 (`proto/PLAN.md`; the phone numbers are in, see below), footwork during punches (do it in 3D).

## Done lately (numbers in `docs/BRAIN.md`)
- Oct 11–14: the brain on the engine (behind `AI.brain`), finishing and the hurt brain, balance pass, weak specials, angle fighter, out-boxer off the ropes, all specials 47.4–52.1, body KDs on target.
- Oct 14: skill levels L0 (baseline) and L1 (skill sheet: `sheet.sk`, `sheet.know`, `levelOf`, walk-in and record defaults; the brain reads `sheet.sk`).
- Oct 14: project review, dead code from the career cut removed.
- Oct 9 (on the v2 branch): Ed's S25 Ultra phone test, 60 fps on every quality setting with shadows on. Defaults res 2 / shadows on / cap 60.

## Decided (don't reopen)
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
