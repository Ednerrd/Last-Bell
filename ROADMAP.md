# Roadmap (one list, in order)

The only to-do list. When something is done, delete its line here and put the numbers in `docs/NOTES.md`.

## Ed (only he can do these)
1. **Publish the live game.** Make a backup code of his careers first, then upload `index.html` in a claude.ai chat and publish to the live URL with `{db:{},user:{},sample:{}}`. Live is weeks behind (styles, legends, corner talk, combos, all the combat and brain work).
2. **3D phone test on the S25 Ultra** (https://claude.ai/artifact/5kVb4PyywgDcPBHSVSc3cu): "Run test (3 min)", then 10 min on one setting. Send fps per setting, heat, battery drop. Sets the 3D quality defaults (`proto/PLAN.md` phase 0).
3. **Answer:** how do skills overlap with the 10 `STATS`? Proposal: stats are the body (power, speed, chin, stamina), skills are what he knows how to do with them.

## Claude, in this order
0. **Boxer brain on the engine (branch `claude/brain-wire`, reviewed Oct 13).** Wired behind `AI.brain` (default 0 = old AI, same.js 7f58e976), lab has an AI row. Audit and styles on target (`docs/BRAIN.md` "The brain on the engine" + "Review and handoff").
   - **Ed:** watches brain vs brain on the private brain test page (https://claude.ai/artifact/HQopfRTmoBmSZLbEfDa94P, `index.html` with `AI.brain: 1`) and says go/no-go on the default.
   - **After that:**
     - **Finishing and the hurt brain: built (Oct 13, `docs/BRAIN.md` "Finishing and the hurt brain").** Stops 19.6 → ~24%, styles 46.8–54.1. Left from it:
       - finisher caught (hurt) 0.7% of hunts, wanted 5–10 (stung 12%); same-round stop after a KD ~25%, research guess 35–45;
       - brain vs old AI fell 38 → ~27% (the old AI doesn't blur);
       - Ed: watch it on the private brain test page.
     - **Balance pass: done (Oct 14, `docs/BRAIN.md` "Balance pass (Oct 14)").** Connect 31.6 → 30.4%, stops 25.8% (pooled 2000), styles 48.2–52.5 (600/pair). **Ed:** thrown 51.6 vs the 53 target: move the brain's target to ~51–52, or try an output bump? Left: connect into 29–30 (defQ ~1.6).
     - **Re-check on the balance numbers: done (Oct 14, `docs/BRAIN.md` "Re-check on the balance-pass numbers").** Guards 49–58 (high 57.9 on top this run, handslow 55.1), bvo 35.4%, dummy ring stops 28.0 / connect 34.3.
     - **Weak specials volume and body: done (Oct 14, `docs/BRAIN.md` "Weak specials").** Volume 46 → 52.8, body 44 → 50.3 (600/pair); base styles 48.7–51.3.
     - **Angle fighter: done (Oct 14, `docs/BRAIN.md` "Angle fighter").** 44.6 → 51.5 (900/pair): boxer-puncher brain base.
     - **Body KDs: on target, no change (Oct 14, `docs/BRAIN.md` "Body KDs re-measured").** 5.7% of KDs (1800 fights); the old 4.1% was a small, older sample.
     - **Out-boxer off the ropes: done (Oct 14, `docs/BRAIN.md` "Out-boxer off the ropes").** 12.6 → 6.7 s/rd (old AI 7.7); styles 47.6–53.7 (out-boxer and swarmer on the band edges); bvo 30.3%.
     - **All specials at 300/pair: done (Oct 14, `docs/BRAIN.md` "All specials vs base styles").** 47.4–52.1, none under 47 (pboxer 47.7, switch 47.4 a hair under 48).
     - **Next, in this order (recommended):**
       - then retire `decide()`/`react()`.
1. **Republish the fight lab** (with Ed's OK): `index.html` IS the lab now, publish it as-is to the fight lab URL, no capabilities. It still shows the Oct 6 build without the brain. Merge `claude/brain-wire` into the main line first.
2. **Skill levels L0–L6** (`docs/BRAIN.md` "Skill levels"). Novice → Intermediate → Pro → Worldclass from per-skill mastery, style/stance familiarity, bad technique when he tries a skill he doesn't own, learning from fights and camp. Start with L0 (`tests/levels.js` baseline). Tier tables, growth, rematch memory and scouting: `research/mind_learn.md`. Needs Ed's answer to item 3 above before L1.
3. **Brain pieces that hang off the levels** (fold into L2–L4 where they fit):
   - Setups and traps: "show it twice, change it" gated on HIS answer, armed traps, body bank, adjust delay by tier (`research/mind_traps.md`, `mind_combos.md`).
   - Hurt brain by tier (the base is built: hunt / survive / blur); finisher weighs the risk (`research/mind_vision.md` 8d).
   - AI between-round adjustment: change one thing when losing exchanges; low adjusters wait too long.
   - Gassers save it for later (stamina pacing).
   - Check first, maybe not needed: within-round read decay (B1 already fades), defensive read inside `react()` capped ±25% per guard (B3 covers part).
4. **Balance pass** (L6). Upsets one level down 15–20%, then the CLAUDE.md targets. Known weak: feinter ~46–47, swarmer ~47.4, high/cross guards swing between runs (pool 600+ per guard).
5. **Gym mode steps 3–6** (`docs/GYM.md`): mitts + combo book, training sessions, sparring, signature moves and habits, in-round talk.
6. **3D phase 1** once Ed's phone numbers are in (`proto/PLAN.md`). Recommended start: the engine drives the 3D and draws punch lanes, why a shot lands or misses.
7. **Footwork during punches** (step-in jab, pivot-out hook) and stamina in the feet. Do it in 3D, not 2D.

## Decided (don't reopen)
- No 2D-only render polish (uppercut curve, close-range spacing): 3D redoes the animation.
- Lab B rhythm (`ccr-026fa9ad-j4d8rw`) is dead; Ed picked Lab A. The parallel step 6 (`ccr-b57f3498-nk3hk1`) is superseded.
- Ring IQ when hurt or tired as its own step: parked; it lives in the hurt brain now.
- Corner lesson size: medium (`TEACH` .18 / .7 / .7).
- Coach shouts / corner orders do NOT get wired into the brain (Ed, Oct 13).
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
