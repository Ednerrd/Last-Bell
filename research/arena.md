# The Arena Shorts: notes for the brain

Source: The Arena (YouTube Shorts, coach-and-fighter pad work). Our own notes in our own words. Engine names in brackets are from the old AI (retired Oct 16); map them onto the plug-in brain (`docs/PLUGIN.md`) when building. Overlaps already built: setups and traps (show, bank, draw, delay, vary), f1b clamped elbows, f2 World-class bait. raw transcripts are not kept.
Shortlist and checkboxes: `tools/arena/SHORTLIST.md`. Batch 1 = the top 5 (Oct 19).

## 1. Feints (FEINT_READ, STYLES.feint)
- Three feint types, each sells a different threat:
  - **Hand feint**: show the rear hand, and when their eyes go to it, the jab goes in fast.
  - **Shoulder feint**: a small shoulder dip reads as a power shot coming. Keep it small; an overdone feint reads fake.
  - **Eye/level feint**: look at the body, then throw the 1-2 to the head. Their guard drops to where you looked.
- Engine idea: a feint has a *kind* that pulls a specific defense (hand → they cover that side, level → guard drops). The punch that follows goes where that defense left a hole. Today `feint` is one number per style; this splits it into kinds with matching follow-ups.
- Overdone feints should *lose* value: high-IQ opponents stop biting if the feint is too big or too regular.

## 2. Stopping pressure (STYLES slugger/swarmer, pickCounter)
- When the presser opens up with a looping power shot, meet him **down the middle with a straight** (jab or 1-2). The straight is the shorter path, so it lands first.
- This is the best way to get a power-puncher off you: punish the wind-up, don't trade loops with loops.
- Engine idea: vs a hook/overhand that has started, a straight counter should win the race by path length. Check `pickCounter` favors straights over hooks against loopers, especially for out-boxers and counter-punchers vs sluggers/swarmers.

## 3. Setting up the liver (BODY, body KDs)
- Fighters who know you're a body puncher **glue the elbow to the ribs**. Don't punch the elbow: go around it.
- Two-shot pattern: the **first body shot is fast** (moves the elbow), the **second is hard** (hips turned, legs into it) into the gap.
- Finish upstairs (hook, straight) once their hands have dropped to cover the body, then reset the feet.
- Engine idea: a body-snatcher learns when the guard is covering the body (`F.mem`), throws a fast "mover" first, and only then the power body shot. Liver chance higher on the second shot of a pair than on a lone one.

## 4. Breaking a high guard (GUARDS.high, peekaboo)
- **Hand trap**: pull or push the lead glove down and fire the punch over it. The lower the glove goes, the cleaner the shot.
- Then **defend right away**. Going for the kill is when you get countered.
- Engine idea: a rare "trap" opener vs high/peekaboo/cross guards (shorter guard-block chance on the next punch). After a trap-and-hit, a short window where the attacker's own defense is worse unless he resets (IQ).

## 5. Predictable punches (MEMV, ANT, COMBOS)
- Staying on one target lets them settle in and wait. **Change levels**: stab the body over and over until they struggle, then the hand drops, and the hook goes on top.
- Same hand, second option: after the body shot, the same hand comes back up as an uppercut.
- Engine idea: level-mixing combos (body jab/straight → head hook; body → same-hand uppercut). Opponent memory should punish repeating the *same level*, not just the same punch.

## Takeaways for ROADMAP
- Feint kinds with matching follow-ups (1), straight beats loop for counters (2), fast-then-hard body pairs (3), hand-trap opener vs high guards (4), level-change combos + memory by level (5).
- All engine changes: sims before/after per CLAUDE.md.
