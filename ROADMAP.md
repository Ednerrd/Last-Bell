# Roadmap (one list, in order)

**v2 restart (Oct 9):** `v2/FOUNDATION.md` is the new plan. Its build order (M0–M8) replaces the Claude list below once Ed signs off. v1 items stay here until then.

The only to-do list. When something is done, delete its line here and put the numbers in `docs/NOTES.md`.

## Ed (only he can do these)
1. **Publish the live game.** Make a backup code of his careers first, then upload `index.html` in a claude.ai chat and publish to the live URL with `{db:{},user:{},sample:{}}`. Live is weeks behind (styles, legends, corner talk, combos, all the combat and brain work).
2. **3D phone test on the S25 Ultra** (https://claude.ai/artifact/5kVb4PyywgDcPBHSVSc3cu): "Run test (3 min)", then 10 min on one setting. Send fps per setting, heat, battery drop. Sets the 3D quality defaults (`proto/PLAN.md` phase 0).
3. **Answer:** how do skills overlap with the 10 `STATS`? Proposal: stats are the body (power, speed, chin, stamina), skills are what he knows how to do with them.

## Claude, in this order
1. **Skill levels L1–L6** (`docs/BRAIN.md` "Skill levels"). Novice → Intermediate → Pro → Worldclass from per-skill mastery, style/stance familiarity, bad technique when he tries a skill he doesn't own, learning from fights and camp. L0 baseline is in (`tests/levels.js`, numbers in `docs/BRAIN.md`). Next is L1, blocked on Ed's answer to item 3 above.
2. **Brain pieces that hang off the levels** (fold into L2–L4 where they fit):
   - Setups and traps: jab-jab-right, body then head, feint to draw the slip, "show it twice, change it" (`research/mind_combos.md`).
   - Hurt brain: shell / run / fire back / clinch / freeze by composure; finisher weighs the risk (`research/mind_vision.md` 8d).
   - AI between-round adjustment: change one thing when losing exchanges; low adjusters wait too long.
   - Clarity: fatigue, damage and knockdowns blur the read.
   - Gassers save it for later (stamina pacing).
   - Check first, maybe not needed: within-round read decay (B1 already fades), defensive read inside `react()` capped ±25% per guard (B3 covers part).
3. **Balance pass** (L6). Upsets one level down 15–20%, then the CLAUDE.md targets. Known weak: feinter ~46–47, swarmer ~47.4, high/cross guards swing between runs (pool 600+ per guard).
4. **Gym mode steps 3–6** (`docs/GYM.md`): mitts + combo book, training sessions, sparring, signature moves and habits, in-round talk.
5. **3D phase 1** once Ed's phone numbers are in (`proto/PLAN.md`). Recommended start: the engine drives the 3D and draws punch lanes, why a shot lands or misses.
6. **Footwork during punches** (step-in jab, pivot-out hook) and stamina in the feet. Do it in 3D, not 2D.

## Decided (don't reopen)
- No 2D-only render polish (uppercut curve, close-range spacing): 3D redoes the animation.
- Lab B rhythm (`ccr-026fa9ad-j4d8rw`) is dead; Ed picked Lab A. The parallel step 6 (`ccr-b57f3498-nk3hk1`) is superseded.
- Ring IQ when hurt or tired as its own step: parked; it lives in the hurt brain now.
- Corner lesson size: medium (`TEACH` .18 / .7 / .7).
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
