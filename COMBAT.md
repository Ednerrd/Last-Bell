# Combat polish plan (Oct 2026)

Ed: "Let's perfect the core game of the auto boxing mechanics. Smoothness, fluidity, pace, speed."

Full detail: `research/combat_research.md` (Fight Night, Undisputed, Thrill of the Fight, real timing data) and `research/combat_audit.md` (our engine, measured). Scratch tools from the audit (rec.html, rec.py, ana2.py, sheet.py, inst*.js) lived in the session scratchpad.

## Where we stand (measured)
- Pace is right: 55 thrown per fighter per round (CompuBox ~56–59). Combos are mostly 1–3 punches, the same combo twice in a row only 3.7% of the time.
- The motion is the problem:
  - ~400 velocity snaps per minute per fighter, because footwork sets velocity directly with no acceleration;
  - pops when one combo punch hands off to the next;
  - pose smoothing switches off on every hit;
  - fighters pass through each other and mirror in one frame (1.7 per minute).
- The rhythm is a metronome: an exchange every ~2.5 s, never a reset or feel-out, and fighters almost never pause.

## Plan (one commit each; R = render only, no sims needed; E = engine, `same.js` + audit before/after)
1. ✅ **R: combo hand-off blend.** When a new punch starts, fade the old pose's offset (hips, head, gloves, lunge) out over ~40 ms. Same for cancelled punches.
2. ✅ **R: always smooth the base pose.** Add hit, wind-up and stun motion on top after the smoothing.
3. ✅ **R: punch easing.** Accelerate into contact with a small overshoot, retract over 1.5–2x the extension time. Glove smear on the fastest frames.
4. ✅ **R: frame-rate safety (120Hz S25).** Camera, zoom and shake on dt; the KO erupt mode on the accumulator; blended replay.
5. ✅ **E: footwork acceleration.** Ease velocity toward its target, lock the rope-escape side for ~.4 s, smooth the cut-off tracking, sine-shaped punch step, a pull that really moves.
6. ✅ **R: animated turn** (was "E: no pass-through"). Locking the left-right order cost the outboxer 52% -> 44% (circling round a presser is his defense), so the engine is unchanged and the turn is animated instead. NOTES.md "Side swaps".
7. **R: uppercut curve fix, close-range spacing.**
8. **E: rhythm.** Burst-and-reset pacing (real activity ratios), feel-out moments, shorter wind-up on chained punches and counters.
9. **E: contact quality.** Clean / glancing / smothered / blocked, each with its own look and hit-stop (2–3 frames on a jab, 4–6 on power, 8–10 on a knockdown, ~0 when blocked).
10. **E: smarter AI.** Pick targets around the guard (high guard opens the body, low hands open the head), a fading memory of what hurt him, styles that differ in rhythm and range as well as numbers.
11. **R + E: footwork during punches** (step-in jab, pivot-out hook) and stamina in the feet (bouncy when fresh, flat when tired).

Fighter DNA cards (CompuBox + breakdowns, search summaries only): `research/fighters_a.md` (Stevenson, Lomachenko, Benavidez, Inoue, Usyk), `research/fighters_b.md` (Crawford, Bivol, Canelo, Nakatani, Bam, Mayweather, Tyson, Haney, Ennis). Feeds step 10 and the gym's fighter DNA.
