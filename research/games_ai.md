# Learning and adaptive AI in other games

Date: Oct 17 2026. For: Last Bell brain (anti-cheese, difficulty, rematch memory).

Sources caveat: this is from web search summaries only. Fetches were blocked (gamedeveloper.com did not resolve), so no talk or postmortem was read in full. Items marked [S] come from search summaries. Items marked [M] are from model memory and unverified. Forum complaints are anecdotes, not measurements. Check before quoting anything to Ed as fact.

## Killer Instinct (2013) Shadows
- [S] Shadow is built from your own play. A few training sessions in the dojo are enough to start a usable copy.
- [S] Design rule from Iron Galaxy: everything the shadow does is something you actually did. Options come from recorded habits, not a script.
- [S] You can keep feeding it later fights, so it updates over time.
- [S] Method is case-based reasoning (Bruce Hayles talk, "The Killer Groove" article). Match the current situation to stored cases, replay what you did there.
- [S] Not pure ML. A lot of structure and variable tweaking was hand made.
- [M] Shadows can be shared and fought by others, and players liked meeting "themselves" and being punished for their own habits. Unverified.
- [M] Cases carry the situation (range, health, state) as the key, so the copy is only as good as the situation match.
- Lesson: a clone of the player is the best anti-cheese tutor. It repeats exactly the habit the player overuses.

## Tekken Ghost and Tekken 8 Super Ghost
- [S] Super Ghost learns how you move, which attacks you favor, and how you execute them, then fights in that style.
- [S] Ghosts keep changing. More matches means a more accurate ghost.
- [S] Pre-release summary said Q-learning for fast repeatable movement. Not confirmed in the shipped game.
- [S] You can fight CPU ghosts, your own, or downloaded ghosts from other players.
- [M] Older Tekken (Tag 2, 7) ghosts were recordings or rule-based copies of a replay, and were beatable once you learned their loop. Unverified.
- [M] Players like ghosts as practice for a named rival. Complaints were that ghosts are too perfect in execution (no human slips) and sometimes too passive. Unverified.
- Lesson: copy habits, but keep the copy's execution human. A ghost that never slips feels fake.

## Virtua Fighter 4 AI (Kumite, trainable fighter)
- [S] You rate the AI's moves live with O (good) and X (bad). It then favors the rated techniques.
- [S] A saved fighter plays in normal modes using what you taught it.
- [S] One forum user said an AI left in Kumite picked up moves by watching other AIs in mirror matches.
- [S] Forum advice: train in Arcade first where losses do not count.
- [M] Each saved AI had a fighting style that drifted with training. Unverified.
- Lesson: learning from praise and blame is simple and readable. Last Bell's corner can do the same, "that worked, keep it."

## Street Fighter 6 CPU
- [S] Capcom CEDEC 2024 (planner Yasuhara, one conference report): CPU draws from "tactical card decks" picked by situation and level.
- [S] Higher levels get a richer card library and better execution ability, not extra frame data or free reads.
- [S] A pressure gauge exists. Lower levels are hit harder by pressure, so they crack under heat like a human.
- [S] CPU can fumble inputs on purpose (Zangief piledriver example).
- [S] Forum complaints: CPU reads inputs on jab/grab mixups, level 8 feels brutal, "all ranks play the same". Anecdotal, unverified.
- [S] A forum comment says unlike a human the CPU does not learn, so it can be overcome with one trick. This is the exact complaint Last Bell wants to avoid.
- Lesson: skill = deck size + execution + pressure fragility. Not cheating. Players still suspect cheating when a read feels too instant.

## UFC 4 and UFC 5 (EA)
- [S] UFC 5 patch notes: higher AI levels got better leg kick defense and timing. Ground and pound combos changed because early elbows were too easy to counter.
- [S] AI got the ability to fake in submission battles, with a chance to turn things around when the opponent has the stamina lead.
- [S] Closest adaptive AI complaint found was UFC 3: after a patch an adaptive AI appeared and a player asked for an off switch (UFC 2 had one).
- [S] A forum thread called fake-kick-into-body-knee a legal exploit. That was about human players.
- [M] Known community gripes: AI counters feel scripted, AI throws the same one move to exhaustion, and "reading inputs" on counters/blocks at higher levels. Unverified.
- Lesson: patch notes show devs fix cheese by tuning the AI's defense to it, per difficulty. Players accept that. They dislike an AI that adapts invisibly with no off switch.

## Mortal Kombat 11 and 1
- [S] MK11 launch: Towers of Time AI too hard. NetherRealm patched AI difficulty down and cut opponent health, and later adjusted the curve.
- [S] Steam fan claim: input reading on/off plus a combo optimisation slider. Fan assertion, not confirmed.
- [S] 2025 Legacy Kollection retained arcade era behavior even at Very Easy. Sony refunds reported. Reason: classic "SNK boss" cheating AI is what players hate most.
- [M] MK AI is widely said to use input reading on its hardest levels and to punish unsafe moves at frame perfect speed. Unverified.
- Lesson: what players hate is frame perfect reaction, damage boosts for the CPU, and a difficulty setting that does not do what the label says.

## Sifu
- [S] Nothing found on Sifu AI design in search.
- [M] Sifu enemies attack in staggered turns and telegraph. Mastery comes from learning each enemy's moveset. Age penalty is the cost of death. Unverified.
- [S, general] Token systems (DOOM 2016, others) cap how many enemies attack at once. Higher difficulty means bigger token pools. This is how many games make "hard" without cheating.
- Lesson: telegraphs and limited simultaneous aggression make a fight read as fair. In 1v1 the equivalent is a visible wind up.

## Forza Drivatar and Gran Turismo Sophy
- [S] Drivatar copies a real player's driving style and adapts to the racing behavior of the person it is based on. Learning method not explained in what I found.
- [M] Drivatar learns from your laps (lines, braking points, aggression) in the cloud and drives for you when others race against "you". Common complaints: Drivatars hit you, crash, or rubber band. Unverified.
- [S] Sophy is deep reinforcement learning trained on cloud PlayStations. Reward favors gaining race position.
- [S] Sophy beat top human drivers. Reports said it was fast and accurate but its sportsmanship was poor. Sony's stated aim is a stimulating opponent, not just a fast one.
- [S] Sophy picked up human-like tricks on its own, such as rear rotation on corner entry. Sony later talked of more skill levels.
- Lesson: pure optimizing AI ends up rude and inhuman. A style copy ends up believable. Put a sportsmanship term in the reward, or in Last Bell's case, the foul and ref dials.

## General findings on adaptive and human-like AI
- [S] CMU thesis (Liu 2017) frames two routes: an optimal AI that adapts (hard to exploit, not human) or an imitation of a specific human. Built-in AI often cheats with perfect reaction and perfect state knowledge.
- [S] Dynamic scripting for fighting AI (CIG paper): simulate 0.25 s response time, update rule weights about every 4 seconds. Fast adaptation by reweighting rules.
- [S] Controlled randomness in reaction time keeps the AI unpredictable without feeling unfair (general tip).
- [M] Spronck style dynamic scripting also adapts difficulty by picking weaker rules when the AI is winning. "Rubber banding" of this kind is disliked when visible.
- [M] Common praise: AI that makes human mistakes, hesitates, gets rattled, and has a recognizable personality. Common hate: reads of your input, damage or health cheats, identical behavior at all levels, instant counters to every habit.

## Steal for Last Bell

1. Body digger and clincher reads: keep a per-situation case table (like KI cases) and punish a repeat only after the third or fourth match in the same range and state, not on first sight. Fast enough to feel smart, slow enough to feel earned.
2. Anti-cheese by tuning defense, not by input reading. When a habit repeats (body digger), raise the guard-drop or step-back chance against that punch for a few rounds, as UFC 5 raised leg kick defense at high levels. No frame perfect reaction.
3. Never fall for it twice: store the failed counter as a case, so the same cheese against the same fighter in a rematch meets the fix from round one (ties to rematch memory).
4. Expert only visible baiting: when the brain notices your habit, it shows a small tell (drops a hand, leans in) to invite the habit, then counters. Expert only, so players see "he read me" and it reads as skill.
5. Easy mode planted flaws: a fixed, learnable flaw per easy fighter (drops left after jab, lazy on the ropes, slow to cover body). This is SF6 style "lower deck, fumbles", so it can be learned and beaten, not random.
6. Pressure gauge: easy and novice fighters get rattled after being hurt or out-landed, losing execution and defense for a while, like the SF6 pressure meter. High skill is nearly immune.
7. Fakes: novices bite on fakes and on a sold fake hurt. High skill sees through a sold hurt after a short delay and does not rush in. Use a skill check on the fake, not a flat chance.
8. The eyes: skill sets what the brain notices. Novice sees only the obvious (knockdown, big swelling). Pro sees cuts, tired breathing, a dropped guard. World class sees the tells early and hunts them. Matches the "visible read" idea: show it as a corner or commentary line.
9. Rematch memory as a ghost: after a fight, save the brain's case table for that rival. Next fight, he opens with the plan that worked and avoids the exchange that hurt him. Cap how much carries over so one fight does not make him a mind reader.
10. Fair feel: no stat boosts for hard or expert. Raise deck size, execution, and read speed only. Add a short human reaction floor (about 0.25 s, with jitter) to every read. This keeps the "CPU cheats" complaint away.
11. Slow memory decay for habits but fast decay for failures: a trick that just worked stays flagged for a while, a counter that just failed is dropped quickly. Matches the dynamic scripting idea of reweighting every few seconds.
12. Corner feedback like VF4 rating: let the AI corner or the player praise or blame a plan between rounds, and nudge weights for that fight only. Cheap, readable, and fits the coach role.
