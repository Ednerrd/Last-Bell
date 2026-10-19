# The Mind of a Boxer (Oct 2026): synthesis + build order

Six research passes, merged. Detail lives in the source files; this is the map.

| File | What's in it |
|---|---|
| `mind_engage.md` | When/why to engage or not: 12 trigger cues, disengage rules, reading phase, score logic |
| `mind_combos.md` | Combo grammar, 19-row combo library, 12-row counter library, southpaw playbook, COMBOS gaps |
| `mind_pace.md` | CompuBox numbers, round shapes, round clock, gas, finishing/surviving, 15 corner calls, judging |
| `mind_finish.md` | Finishing a hurt man, surviving hurt, ref stoppages, recovery times, FINISH/SURVIVE knobs for the brain |
| `mind_learn.md` | Novice vs pro tells, punch force by level, teaching order, learning from losses, rematches, scouting; tier tables and growth rules for skill levels |
| `mind_southpaw.md` | Southpaw edge by the numbers (boxing, MMA, fencing, tennis), the experience effect, targets for the L3 familiarity knob |
| `mind_between.md` | Between fights: rest and medical suspensions, gaps between fights, what wins teach, matchmaking, confidence and complacency, gun-shy after a KO, ring rust (UFC data), chin wear, age curves by attribute, habits coming back; game rules with numbers |
| `mind_traps.md` | Traps across rounds (bait, answer, payoff), body banking, adjust timing by tier, rematch changes, corner talk, Plan B menus |
| `mind_coach.md` | Live shouts vs corner calls: what a fighter can hear and use, absorb limits (1-2 per break), famous corner turnarounds, est. knobs (strength, delay, half-life, hurt/gassed gates) for wiring calls into the brain (Oct 15) |
| `mind_traits.md` | 12 fighter traits (chin, recovery, starts/closers, cuts, dangerous when hurt, quitter): examples, numbers (mostly UFC proxies), born vs earned, stacks, est. knobs and roll rates (Oct 15) |
| `fighters_c.md` … `fighters_g.md` | Exciting fighters (Reddit r/Boxing list, Oct 2026): 60 DNA cards with style, why they're exciting, mind, best bouts, brain knobs. c 140-160 punchers, d feather-light, e 105-122, f heavyweights, g mixed + Pacquiao |
| `mind_vision.md` | Where boxers look, anticipation vs reaction, tells, feints vs the read, fear/composure, fatigue |
| `mind_p4p_a.md` | Mind profiles: Shakur, Loma, Inoue, Usyk, Crawford, Bivol, Canelo, Mayweather |
| `mind_p4p_b.md` | Ring + ESPN P4P (Sep 2026) vs `P4P_2026`, 17-division kings, 13 more mind profiles |

**Sourcing caveat:** the network proxy blocked most boxing sites, so quotes and numbers come from search-result text, not full articles. Each file tags sources and marks `[unverified]`, `[mem]` or `(est.)`. 2026 fight results are from search snippets: verify before putting them in game data.

## Five big findings

1. **Elite defense is anticipation, not reflex.** Experts are no faster at plain reaction time; they win on knowing *which* punch is coming. A jab lands in ~0.4 s. They watch the chest/middle and read hands and feet with peripheral vision.
2. **The read is built over rounds, and it's about the other man's habits.** Crawford "downloads" in 2 to 3 rounds, Mayweather adjusts instantly, Inoue never takes the same punch twice. Repeating yourself gets you countered.
3. **The best adjust between rounds; the shared way they lose is waiting too long.** Loma vs Lopez, Bivol vs Beterbiev 1 ("I had to act, not just waiting"), Canelo vs Crawford. This is the coach's job in Last Bell.
4. **Accuracy beats volume, and the round has a shape.** Shakur beat Lopez throwing fewer punches (372 vs 468) at 44% vs 15%. Round 1 is a feel-out (~0.85x), the last 30 s are where rounds get stolen, second-half fighters (Usyk) double their landed punches late, fast starters fade.
5. **Hurt changes the mind.** Shell, run, fire back, clinch or freeze. Composure (Inoue, Bivol, Usyk) decides which, and how long. Fatigue makes fighters decide faster and worse.

The league already sits on the real welterweight line (~57 to 63 thrown, ~19 landed): keep the audit targets.

## What the engine already has (don't rebuild)
- `F.read` (newRead): **offensive** memory (what of mine lands/gets avoided), feeds `pickCombo`. Faded x.6 between rounds (in `nextRound`). Switch-hitter halves it.
- `F.mem` + `antRead` (BRAIN B1/B3): fading opponent memory (his punches, openers, what follows what, his defense habits), anticipation in `react()` (`ANT`), defense-keyed counters. `FEINT_READ`: feints wear down a smart man's bite.
- `nextInCombo`: level swap after a block, hook after a slip, uppercut after a duck.
- `st.ramp` + `rampSig()` (~781): volume up when the fight calls for it. `F.lead`: the fighter's own scorecard guess.
- `iqK()` in `react()`: Ring IQ as a flat factor. Last-combo repeat penalty.

## Specs for the open brain work

The order lives in `ROADMAP.md`. Steps 1 and 3 are built (BRAIN B1 + B3); step 6 is started (corner as teacher); step 4 is partly built (rhythm `TEMPO`, round awareness `NEED`).

1. **[Done on the main line as BRAIN B1 + B3] Defensive read: "I know what he throws next."** Per-opponent punch transition counts (`seen['jab>cross']`), noticed at a rate set by Ring IQ. `guess()` in `react()` raises avoid chance (`READ.edge` ~.35) and starts the defense earlier vs habits. Attacker's picker avoids combos the defender reads well (free variety). Spec: `mind_vision.md` 8a. Watch: late-round connect % per round.
2. **Clarity + trust.** Fatigue and damage blur the read, a knockdown wipes part of it, feints wear down trust (and a strong read bites harder on feints of that punch: the feint master's job). `mind_vision.md` 8b/8c.
3. **Context counters.** Replace the generic `pickCounter` menu with a table keyed on how he avoided it and what was thrown (pull counter, catch and shoot, slip-cross, uppercut vs a duck, straight inside a wide hook, counter jab, check hook). `mind_combos.md` section 6. Watch counter style stays under ~54%.
4. **Pace controller.** `paceMult` on top of `decide()`: round 1 feel-out by `startSpeed`, late-fight `tank`, first-20 s feel-out, last-30 s steal by `stealer`, "you're blowing it" urgency from `F.lead` late, protect a lead. Targets: R1 ~85 to 90%, last 30 s ~22 to 25% of a round's punches. `mind_pace.md` section 8.
5. **Hurt brain.** Composure derived from heart + IQ (later a trained stat). Big shot -> `shook`; over a threshold, a 1 to 3 s panic pick (shell / run / fire back / clinch / freeze) by style and composure. Finisher logic: confirm the hurt, trap on the ropes, stay tight if he still punches back. Gives commentary hooks ("he's frozen!"). `mind_vision.md` 8d, `mind_pace.md` section 5.
6. **AI between-round adjustment.** `adjustAfterRound` per fighter: when losing exchanges, change one thing (double the jab, go to the body, turn him, cut off). Low adjusters wait too long, which is the real-world failure mode and gives the player's corner a reason to exist. Hooks into `nextRound()`.
7. **Combos + setup memory.** Add 1-1-1, 1b-2-3, 1-2-3b-3, 5-3b, 1-3b-6, 2-1, 1-2-1, 6-3-6. Body landed early raises head-ending combos late ("body early, head late"). Guard-drop flag after a body hit. `mind_combos.md` section 6.
8. **Mind knobs for named fighters.** 21 profiles scored 0 to 1 on readSpeed, riskTolerance, adjustAfterRound, composure, finisherInstinct, counterBias, pressureWhenAhead (`mind_p4p_a.md`, `mind_p4p_b.md` engine tables). Use for legends, P4P stars and walk-in personalities once steps 1 to 6 exist.

## Corner talk tie-ins
- Report the read: "He drops his left after the jab, I see it" / "He's figured out your 1-2, change it up."
- Shouts as levers: make him pay (counter window), cut the ring (cutK), tie him up (clinch), bank it (lead protection), steal the round (last 30 s), go get him (finisher), double the jab, go to the body.

## Data (verify first, data-only commit)
- `P4P_2026` matches the Ring list exactly (latest Ring update 2026-09-08, top 10 unchanged since June). ESPN differs: Opetaia in at No. 9, Collazo out.
- Candidates: add Opetaia (cruiser), move Nakatani to feather (he's at 122 now), maybe nudge Usyk down (behind on two cards vs Verhoeven before the R11 stop).
- Retired: Crawford (Dec 2025, 42-0), Lomachenko (June 2025). Legends material.

## Other games (Oct 17, search summaries only: claims tagged by source)
- `games_arcade.md`: Punch-Out, Ready 2 Rumble, Knockout Kings, Creed games, Ippo, Boxing Star, Real Boxing 2. Punch-Out's flaw ramp is the model for easy-mode planted flaws.
- `games_manager.md`: Title Bout, WCBM, Punch Club, Prizefighters, MMA managers, Football Manager. Calls that fade, shouts by temperament, a visible reaction line, towel, key-moment timeline.
- `games_ai.md`: KI Shadows, Tekken Ghost, VF4, SF6, UFC, MK, Drivatar, GT Sophy. Players hate input reading and stat boosts; difficulty from deck size, execution, fragility under pressure; reaction floor ~.25 s.

## Trainers (Oct 19, search summaries only: WebFetch was down; tags S sourced / B lore / D design)
- `coach_a.md`: Cus, Futch, Emanuel Steward, Dundee, Arcel, Atlas, Clancy. Atlas's bait (jab, step back, counter the right), Futch stopping Manila, Clancy keeps punching a hurt man, Steward's "out of fuel".
- `coach_b.md`: Roach, Floyd Sr. and Roger, Beristain, Sanchez, McGirt, Garcia, Shields. Roach's Hatton habit counter, finishing costs gas (Horn), corner: short, one voice, back to the jab.
- `coach_c.md`: Reynoso, Anatoly Lomachenko, Derrick James, Shingo Inoue, SugarHill, Davison, McCracken, BoMac. BoMac read Spence "more hurt than he let on", McCracken's "glazy" Joshua, Inoue's body-then-head, one scripted counter per habit.
- Each ends with "For Last Bell" if/then rules (numbers are starting values). What 1f takes from them: `docs/PLUGIN.md`, fakes plan. No trainer has an on-record tell list for hurt, tired, body-hurt or bluffing men.

## Full-page pass (Oct 19, page fetches open; YouTube, boxingscene, archive.org still blocked)
- `tells.md`: hurt, tired, body-hurt, bluffing. The ABC ref manual and a ringside doctor handbook (legs, eyes, walk and turn), the bluff breaks on a turn, legs can go ~4 s late, Mayweather-Mosley R2, tired punches turn to pushes. Unconfirmed: elbows clamp.
- `size.md`: height, reach, leverage. Studies (PLOS heavyweight titles, UFC 6,685 bouts): a small edge, bigger at heavyweight. Short man's plan, Fundora, leaning, a height/reach table by division.
- `numbers.md`: our targets vs real data (Sloan 2026 open data, 1,228 bouts tallied; 2026 CompuBox round PDFs). Totals hold; stoppages, jab connect, split decisions, draws and late lead changes are off (ROADMAP parking lot, Ed's call).
- `corners.md`: 26 real corners, quotes tagged. Notes per break (63% one), a hurt man gets a state check first, honest scores won, the loudest voice wins, stops come late.
