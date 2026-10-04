# Fighter DNA cards, batch A (Stevenson, Lomachenko, Benavidez, Inoue, Usyk)

Research for Last Bell's per-fighter AI knobs. Researched Oct 2026. In-game names will be altered.

**How this was gathered.** Direct page fetches were blocked by the proxy (ringmagazine, boxingscene, compuboxdata, bloodyelbow, substack and fightprimer all returned EGRESS_BLOCKED). Every number below comes from search-engine summaries of the cited pages. Treat single-source figures as "likely right, verify before tuning". Derived numbers (per round, shares) are my arithmetic and are marked (calc). Pure judgement calls are marked (est.). Where sources conflict, both figures are given.

**Reference points.** CompuBox norms, used across all cards: a typical fighter throws about 50–60 punches per round and lands about 30%. Opponents of elite defenders land about 5–8 per round. Last Bell's audit target is about 56 thrown, 16 landed and 29% connect per round. Punch numbering: 1 jab, 2 cross, 3 lead hook, 4 rear hook, 5 lead uppercut, 6 rear uppercut, b = to the body. For a southpaw, "1" is the right jab and "2" is the straight left.

---

## 1. Shakur Stevenson ("the low-risk sniper")

**Stance / guard.** Southpaw. Uses a Philly shell / shoulder roll, an extended lead hand and a pull-back. He stands at long range just outside the opponent's reach. "Elite lead hand control": he extends the lead (right) hand to invite a hand fight, then leaves the opponent's hand hanging and punches around it with a lead hook ([BoxingScene community breakdown](https://www.boxingscene.com/community/posts/696846); [Boxing Showtimes profile](https://boxingshowtimes.com/boxers/shakur-the-fearless-stevenson)).
**When pressured or on the ropes:** he rolls behind the shoulder and springs off the ropes with pull counters. Against Zepeda he "adopted a shoulder-roll guard ... a series of pull-back counters off the ropes" and countered whenever Zepeda opened up ([round-by-round summary, Boxing News](https://boxingnewsonline.net/shakur-stevenson-beats-william-zepeda-by-unanimous-decision/); [Ring: "got hit too much"](https://ringmagazine.com/en/news/shakur-stevenson-got-hit-too-much-william-zepeda)). Once he "digs his lead foot in behind the jab it is difficult to make him budge". Zepeda managed to move him only sparingly.

**Output (CompuBox).**
| Fight | Thrown/rd | Landed/rd | Total % | Jab L/T | Power L/T | Opp landed, opp % |
|---|---|---|---|---|---|---|
| Career avg (10 fights, [CompuBox via search](https://app2.compuboxdata.com/reports/79)) | ~41 (calc) | 15.1 | 36.9% | 4.0/rd, 22.6% | 11.1 of 23.2/rd, 47.8% | #1 fewest opp landed and lowest opp %; prior opponents ~5.4–7/rd |
| Valdez 2022 ([ESPN](https://africa.espn.com/boxing/story/_/id/33835704/shakur-stevenson-dominates-oscar-valdez-win-second-title-via-unanimous-decision)) | 48 (calc) | 15.8 | 33% (189/580) | – | 53% | 110/508, 22% |
| Conceição 2022 ([CBS](https://www.cbssports.com/boxing/news/shakur-stevenson-batters-robson-conceicao-en-route-to-decision-win-in-junior-lightweight-finale); [BoxingScene](https://www.boxingscene.com/articles/shakur-stevenson-show-weekend-afterthoughts)) | 44 (calc) | 16.6 | 37% (199/531) | – | – | ~5/rd, 12%; single digits in 11 of 12 rounds |
| De Los Santos 2023 ([Ring](https://ringmagazine.com/en/news/edwin-de-los-santos-sure-shakur-stevenson-felt-his-power-feared-it-in-regrettably-boring-12-rounder)) | low | ≤9 every round | – | – | only 19 power landed all fight | **40 landed (3.3/rd), the lowest in a 12-rounder since 1985** |
| Zepeda 2025 ([CompuBox via ESPN/search](https://global.espn.com/boxing/story/_/id/45728180/shakur-stevenson-showed-boxing-fight-second-none)) | 47 | 24.6 | 52.5% (295/565) | 96/207, 46.4% | 199/358, 55.6% | 272/979 (82 thrown/rd, 23 landed/rd), 27.8% |
| Padley 2025 ([WBN](https://www.worldboxingnews.com/?p=135050)) | – | – | – | – | 48%; **41% of power connects to the body** | TKO 9: three body-shot knockdowns in round 9 |
| T. Lopez Jan 2026 ([Wikipedia](https://en.wikipedia.org/wiki/Teofimo_Lopez_vs._Shakur_Stevenson); [Ring CompuBox](https://www.ringmagazine.com/news/compu-box-corner-stats-back-shakur-stevenson-s-dominant-win-against-teofimo-lopez-1AUapXouaavfeCmH1xp7uw)) | 31 | 13.75 | 44.4% (165/372) | **105/252, 41.7% (career high)** | 60/120, 50% | 72/468, 15.4%; ≤5 landed in 7 of 12 rounds |

- **Jab share:** career ~43% of thrown (calc: 23.2 power out of ~41). It ranged from 37% (Zepeda, who forced exchanges) to 68% (Lopez, pure range fight). **Body share:** ~14% of landed vs Zepeda (42/295); he goes body-heavy once he spots a hurt opponent (41% of power connects vs Padley).
- **Defense quality:** opponents land 3–7 per round at 12–22%. The outlier is a volume swarmer (Zepeda, 23/rd at 28%).

**Range / footwork.** Long range, just outside the opponent's jab. He backs up in straight lines and short arcs, and plants the lead foot to hold the centre. He does not cut off the ring. He lets the opponent come and makes them miss (est.).

**Rhythm.** A steady low-to-moderate tempo. Feel-out rounds are normal: he gives away early rounds to volume punchers (Zepeda won rounds 2–3 on volume). Output and accuracy rise from about round 6 once he has the read. Against Zepeda, rounds 6, 8 and 9–12 were his most dominant ([round-by-round](https://www.boxingscene.com/articles/shakur-stevenson-vs-william-zepeda-round-9)). If the opponent is dangerous and patient (De Los Santos), he goes almost dormant: about 3 landed per round from each side.

**Signature weapons and counters.**
- Straight left (2) used many ways: snapping pull counter, split counter, lead straight left, left to the body (2b), and uppercuts (6, 6b) ([BoxingScene community](https://www.boxingscene.com/community/posts/696846)).
- Body jab (1b) to lower the guard, then a switch upstairs. "By consistently landing his jab to the body, Stevenson laid the groundwork for the knockout" ([summary](https://tss.ib.tv/boxing/?p=16762)).
- Check hook / lead right hook (3) on a forward step. Valdez was dropped by a cuffing right hook then a second right in round 6 ([Ring TV](https://www.ringtv.com/638663-shakur-stevenson-outclasses-oscar-valdez-to-unify-junior-lightweight-titles-win-ring-championship/)).
- Feint the 1 to draw the opponent's lead hook, then counter 2.
- Combos: 1-2, 1b-2, 2-3 (left then right hook), and pull-2-3 off the ropes.
- **Trigger: opponent's jab or lead hook → pull back (lean to rear foot) → straight left.**

**Strengths.** Elite reads and accuracy (around 50% power connect). Lowest opponent connect rate in boxing. Hand trapping.
**Flaws.** He can go passive: low volume, and he loses rounds he doesn't care to win (fans booed the De Los Santos fight). High-volume body-first pressure lands on him, as Zepeda did with double jabs then body combos, and knocked him off balance in round 3. Low power at 135–140 means opponents don't fear trading. He can be forced to the ropes for short spells.

**AI rules.**
1. IF the opponent starts a jab or lead hook AND distance is at or past the opponent's range edge → 70% pull back, then throw a 2 (counter window ~0.3 s).
2. IF the opponent's output over the last 10 s is above 2× his own AND he is on the ropes → shell (shoulder roll, block bonus) and fire a pull-2-3 on each opponent miss; otherwise pivot off along the ropes.
3. IF round ≤ 3 → output ×0.7, jab share 55%. IF round ≥ 6 AND he leads on landed punches → output ×1.15 and allow 3-punch combos.
4. IF the opponent's guard is high → body jab ×2 weight for 2 exchanges, then 2 to the head.
5. IF the opponent's power or KO threat is high AND he is ahead on the cards → "safe mode": output drops to ~25/rd, jab-only and pull counters.

---

## 2. Vasiliy Lomachenko ("the angle machine")

**Stance / guard.** Southpaw. Hands high-ish and relaxed, with constant head and upper-body movement and a forward "lean" of the head. He defends mainly by stepping off the line rather than by blocking. Lead-hand control: he traps or taps the opponent's lead hand, and against Linares trapped the left hand to deny the follow-up hook ([summary of technique breakdowns](https://modernmartialartist.com/lomachenko-s-matrix-style-footwork-matador-feints-explained-technique-breakdown); [Boxing News "how to fight like"](https://boxingnewsonline.net/how-to-fight-like-vasyl-lomachenko/)).
**When pressured:** he rarely stays on the ropes. He pivots out ("matador" turn) to the opponent's back side. Bigger men who lean on him and push him off balance when he takes the outside angle (Lopez) disrupt him ([Jack Slack via search](https://www.fightprimer.com/lopez-vs-loma-outside-angle-biatch)).

**Output (CompuBox).**
| Fight | Thrown/rd | Landed/rd | Total % | Notes |
|---|---|---|---|---|
| Career ([CompuBox via search](https://www.worldboxingnews.net/?p=49306)) | **61.9** | ~23 (calc) | 37.5% | Opponents throw 47/rd, land 7.9/rd, 16.8%. +20.7 plus-minus (#1 at the time). Only ~14% of connects to the body |
| Rigondeaux 2017, 6 rds ([ESPN](https://africa.espn.com/boxing/story/_/id/21723843/vasyl-lomachenko-beats-guillermo-rigondeaux-keep-wbo-junior-lightweight-title)) | 56.5 (calc) | 9.2 | 16.2% (55/339) | Rigondeaux 15/178 (8.4%), never more than 3 landed in a round; quit on his stool |
| Linares 2018, TKO 10 ([BoxingScene CompuBox](https://www.boxingscene.com/lomachenko-vs-linares-compubox-punch-stats--128110); [ESPN](https://africa.espn.com/boxing/story/_/id/23485907/vasiliy-lomachenko-lomachenko-stops-jorge-linares-tko-10th-round)) | ~65 (calc) | ~22 | 34% (213 landed) | Linares 207 landed, 28%. 7.2 jabs landed/rd (division avg 4.6). Body 18.3% of connects. A "40.2 jab attempts / 11.5 connects per round" line also appears (unclear which fight it describes) |
| T. Lopez 2020 ([CBS](https://www.cbssports.com/boxing/news/teofimo-lopez-jr-upsets-vasyl-lomachenko-to-claim-undisputed-lightweight-crown-in-masterful-performance/live)) | 26.75 (calc) | 11.75 | 44% (141/321) | **Only 58 thrown in rounds 1–6 (~10/rd); 31 landed in rounds 1–7**, then 19/38 in round 8. Lopez 183/659 |
| Haney 2023 ([Wikipedia](https://en.wikipedia.org/wiki/Devin_Haney_vs._Vasiliy_Lomachenko)) | 47 (calc) | 10.3 | 22% (124/564) | Out-jabbed Haney 29–20 but **body 9 vs Haney's 50**. Haney 110/405, 27% (sources conflict on who landed more power; one gives power % 41.5 Haney vs 30.3 Loma) |

- **Jab share:** high, around 55–65% (est., from the Linares jab rate of ~40 of ~65). The jab is a fencing-style, often doubled range finder and vision blocker ([tildes/Hasselbach-style breakdown](https://tildes.net/~sports.combat/sik/vasyl_lomachenkos_fencing_like_jabs_explained_technique_breakdown)). **Body share:** low, 14–18% of connects, and a big flaw vs Haney (9 body landed).

**Range / footwork.** Mid-range "in-and-out", then a pivot. His routine: decoy jab or backhand feint → sidestep or pivot to his right → take the outside angle on an orthodox opponent's left flank → fire 3-4 punch flurries from the angle while the opponent is still squaring up ([summaries](https://modernmartialartist.com/?p=839)). He doubles the jab to block vision while stepping around. He controls the centre of the ring and does not need the ropes.

**Rhythm.** Classic slow starter and studier. He can run whole half-fights at very low output (Lopez: ~10 thrown/rd in rounds 1–6) and then switch to bursts of 40–60+. He wears opponents mentally (a run of corner retirements: Walters, Sosa, Marriaga, Rigondeaux; from memory, not sourced here). He is a burst fighter: 2–4 explosive flurries per round, then a reset.

**Signature combos / counters.**
- 1-1 (double jab) + step to the outside → 2-3-2 or 2-3b-2.
- Feint 2 → pivot right → 3-2 from the angle.
- Lead-hand trap (pin the opponent's lead) → 2.
- Liver shot finisher: Linares was stopped by a left (2b / rear "hook" to the liver) inside a flurry ([Bloody Elbow technique](https://bloodyelbow.com/2018/05/19/lomachenko-vs-linares-moves-to-remember-boxing-technique-breakdown-jab-liver-punch-hook-body)).
- Counter trigger: opponent overextends a 2 → slip outside plus pivot → 2-3 into the opponent's open side.

**Strengths.** Angles, feints, volume when he flips the switch, and mental attrition.
**Flaws.**
- **Straight rear hand down the middle as he steps in.** Linares dropped him in round 6 with a counter right as he "wandered forward" ([Bad Left Hook](https://www.badlefthook.com/2018/5/12/17348762/vasyl-lomachenko-gets-off-canvas-stops-jorge-linares-in-10)).
- **Head lean on entry** gets timed by a patient jab and an inside right hook / check hook (Lopez) ([mmasucka breakdown](https://mmasucka.com/news/vasyl-lomachenko-vs-teofimo-lopez-the-breakdown/)).
- Size: bigger and longer men push him off his angle.
- Low body work.
- Can "wait too long" and give away rounds.

**AI rules.**
1. IF the opponent is squared up or facing his previous position (angle advantage > 30°) → throw a 3–4 punch flurry immediately (combo burst window).
2. IF neutral at mid range → 1-1 plus a lateral step to the outside (pivot right vs orthodox), then re-evaluate. Feint rate high (~30% of actions are feints; est.).
3. IF round ≤ 4 (or ≤ 6 against a puncher) → output ×0.4, read mode (gather opponent tendency data). Afterwards, output ×1.3 with bursts.
4. IF he steps in AND the opponent holds a ready rear hand → 15% chance to eat a counter 2 (flaw hook; est.). Bigger opponents add +10% to angle-break chance.
5. IF the opponent is hurt → target the liver (2b) 35% within the flurry.

---

## 3. David Benavidez ("the volume mauler")

**Stance / guard.** Orthodox, tall for the weight. Fights "straight up" with a high guard and walks forward behind a "lancing jab". He has fast hands but slow, flat feet ([Bloody Elbow, Benavidez–Andrade breakdown](https://bloodyelbow.com/2023/11/26/breakdown-david-benavidez-andrade); [Bloody Elbow, Plant breakdown](https://bloodyelbow.com/2023/03/26/turning-the-tide-david-benavidez-vs-caleb-plant-technical-breakdown)). Defense is mostly blocking and absorbing. He is "criticized for being flat-footed and having no defense".
**When pressured:** he usually is not; he is the presser. When countered, he answers with more volume rather than moving out. He was rocked by Morrell in round 4 and flash-dropped in round 11 (Morrell docked a point for punching after the bell) ([SI](https://www.si.com/fannation/boxing/jim-lampley-praises-david-benavidez-s-win-over-david-morrell)).

**Output (CompuBox).**
| Fight | Thrown/rd | Landed/rd | Total % | Notes |
|---|---|---|---|---|
| Career, prior 13 fights ([Ring CompuBox Corner via search](https://www.ringmagazine.com/news/compu-box-corner-what-do-numbers-say-about-benavidez-ramirez-2Awk13nWfZQNDd1piXl8iX)) | **58.5** | **22.5** (also cited 22.9, 3rd highest tracked) | ~38% (calc) | Jab 21 thrown/rd (36%), power 37.5 thrown/rd |
| Plant 2023 ([CBS / Dan Rafael summary](https://danrafael.substack.com/p/benavidez-pounds-plant-in-2nd-half)) | 46 (calc) | 17.5 | 38% (210/551) | Power 180/419, 43%; jab 30/132 (calc), 23%. **Rounds 7–12 outlanded Plant 161–46; 43 landed in round 10** (most ever vs Plant). Plant 91/624, 15% |
| Andrade 2023, RTD 6 ([ESPN](https://africa.espn.com/boxing/story/_/id/38981982/david-benavidez-triumphs-demetrius-andrade-corner-stops-bout)) | – | – | – | Overhand right knockdown in round 4. **Outlanded Andrade 78–24 in rounds 4–6.** One summary gives power 181/378 and jab 43/175 (=224/553), identical to the Morrell totals and likely conflated; do not use |
| Morrell 2025 ([PBC release](https://presscenter.premierboxingchampions.com/sites/default/files/pdf/2-1%20Results%20Release.pdf); [Bleacher Report](https://nodereport.bleacherreport.com/articles/10153136-david-benavidez-vs-david-morrell-jr-judges-scorecards-punch-stats-and-highlights)) | 46 (calc) | 18.7 | 40.5% (224/553) | Power 181 landed (48%). **Body 76 = 34% of connects.** Morrell 165/601 (27.5%); Benavidez outlanded him in 10 of 12 rounds, twice as many body punches |

- **Jab share:** ~36% career; ~24% vs Plant (calc). **Power share:** ~64%. **Body:** a heavy attritional body attack, ~30–35% of connects (Morrell) (est. as typical).
- **Defense:** opponents land a fair amount: Morrell 27.5%, about 14/rd. The low opponent % vs Plant (15%) came from Plant's own movement and holding, not from Benavidez's defense (est.).

**Range / footwork.** Mid to close range. He closes distance by walking straight in and cutting off the ring. Even in Plant's oversized 22 ft ring he "was able to cut the ring off really good" by round 7–8 ([Ring TV](https://www.ringtv.com/651109-david-benavidez-overcomes-slow-start-to-pound-caleb-plant-over-12/)). No lateral game; a slow reset after misses.

**Rhythm.** Slow starter that crescendos: "a faucet turned on whose current only gains strength". Against Plant he was even or behind after 6 (cards 59-55 Plant, 58-56, 57-57 at halfway), then 161–46 in the second half. The middle rounds are where opponents "fall apart". He punches in long flurries of 5–8 punches rather than single shots.

**Signature combos.**
- 1-2-3-2 and 2-3-2 flurries.
- 3b-3 (hook to body then head).
- 6-3 (right uppercut then left hook; he "teed off with a right uppercut" vs Andrade).
- Overhand 2 (dropped Andrade).
- 1b to the body to drag the guard down (est.).
- Doubles hooks to the same side (3b-3, 4b-4).
- Counter habit: answers any landed shot with a 4–6 punch burst (est.).

**Strengths.** Volume plus power, conditioning, chin, ring cutting.
**Flaws.**
- Slow feet: a mobile jabber wins early rounds (Plant).
- Open to counters during combos: a southpaw straight left and right hook got through (Morrell rocked him in round 4).
- Slow starts.
- Flat-footed when retreating.

**AI rules.**
1. IF the opponent is out of range → walk forward cutting the angle (move to intercept the opponent's escape side, not straight at him); jab only on entry.
2. IF in mid or close range → throw combos of length 3–6 (weighted to 4), 64% power, 30% body.
3. Output curve: rounds 1–3 ×0.8, rounds 4–6 ×1.0, rounds 7+ ×1.2 (+ fatigue resistance). Track the opponent's stamina; IF the opponent's stamina < 50% → push to max volume.
4. IF hit cleanly → 60% retaliate immediately with a 4+ punch burst (no defensive reset).
5. Defense: block-only (high guard) and no slips. Counter-vulnerability +20% while mid-combo (est.).

---

## 4. Naoya Inoue ("the monster: patient sniper → explosive finisher")

**Stance / guard.** Orthodox. Standard-to-high guard with good distance management and some upper-body movement. Mostly a step-back / fade-away defense, plus parrying the jab ([Evolve MMA style breakdown](https://evolve-mma.com/blog/breaking-down-naoya-inoues-style-of-fighting/); [Fight Library](https://fightlibrary.substack.com/p/how-naoya-inoue-walks-opponents-onto)). He parries the opponent's lead hand down and then throws the 3 from that hand.
**When pressured:** he steps back and counters (fade-away hook, body jab into a forward-coming opponent). He is rarely on the ropes. When dropped he does not panic: he goes back to the jab and the body.

**Output (CompuBox).**
| Fight | Thrown/rd | Landed/rd | Total % | Notes |
|---|---|---|---|---|
| Career, last 17 fights ([CompuBox via search](https://ringmagazine.com/en/news/naoya-inoue-vs-alan-picasso-compu-box-punch-stats)) | **51.4** | **17.8** | 34.6% (calc) | **Jab 27.6 thrown / 7.3 landed (26.4%); power 23.8 / 10.5 (44.1%). Jab share ~54%** |
| Donaire 1, 2019, 12 rds ([Sportskeeda](https://www.sportskeeda.com/pro-boxing/news-naoya-inoue-vs-nonito-donaire-2-statistical-comparison)) | – | 18.9 | – | 227 vs 141 landed; jabs 111–42; power 116–99; rounds 10–12 82–34. (These stats are often mislabeled "Donaire 2"; the rematch ended in round 2) |
| Donaire 2, 2022 ([CBS](https://www.cbssports.com/boxing/news/naoya-inoue-vs-nonito-donaire-2-results-highlights-the-monster-smashes-the-filipino-legend-for-quick-tko)) | – | – | – | TKO 2: right hand knockdown at the end of round 1, then a round-2 blitz |
| Fulton 2023, TKO 8 ([BoxingScene CompuBox](https://www.boxingscene.com/articles/naoya-inoue-vs-stephen-fulton-compubox-punch-stats); [Ring TV](https://www.ringtv.com/656436-naoya-inoue-proves-he-is-the-worlds-best-pound-for-pound-by-stopping-stephen-fulton-in-eight/)) | ~49 (calc) | ~14.7 | 30% (114/379) | 44 jabs landed; Fulton only 47 landed; outlanded him in 7 of 8 rounds; "ravaged Fulton to the body". Finish: **1b → 2 → 3** |
| Tapales 2023, KO 10 ([BoxingScene](https://www.boxingscene.com/articles/naoya-inoue-vs-marlon-tapales-compubox-punch-stats); [ABS-CBN](https://abs-cbn.com/sports/12/26/23/inoue-stops-gutsy-tapales-to-unify-super-bantamweight-titles)) | – | 14.6 | – | Power 114/263 (43%); Tapales 52 landed, 16.8% |
| Nery 2024, TKO 6 ([ESPN](https://africa.espn.com/boxing/story/_/id/40093324/naoya-inoue-rallies-retain-undisputed-junior-featherweight-title)) | ~43 (calc) | ~19 | 44.8% (107/239) | **Dropped in round 1 by a counter left hook**; then 3 knockdowns; outlanded 107–54 |
| Cardenas 2025, TKO 8 ([ESPN](https://africa.espn.com/boxing/story/_/id/45002676/naoya-inoue-avoids-disaster-stops-ramon-cardenas-thriller)) | – | – | – | **Dropped in round 2 by a counter left hook** ("distance got loose in round 2"); then jab → body attrition |
| Akhmadaliev Sep 2025 ([CompuBox via search](https://ringmagazine.com/en/news/naoya-inoue-vs-alan-picasso-compu-box-punch-stats)) | 48.8 | 11.75 | 24% | **Jab 31.6 thrown/rd (65%)**, 5.6 landed; opponent 31.3 thrown/rd; 141–62 total |
| Picasso Dec 2025 ([Ring](https://ringmagazine.com/en/news/naoya-inoue-outclasses-alan-picasso-sets-up-nakatani-fight)) | – | **27** | – | Jabs landed 161–63, power 167–107; opponent 14/rd |

- **Body %:** high. He sets up the body with the 1b and finishes with the 3b. (A "68 body landed vs 22" Fulton figure appears in one summary, mixed with a wrong total, so treat as unverified.)
- **Defense:** opponents typically land 5–14/rd. Danger is concentrated in counter left hooks.

**Range / footwork.** Prefers mid range: just inside his jab and just outside the opponent's hook. He controls it with a jab-heavy step-in, step-out. He "walks opponents onto" shots: he retreats a step to draw the opponent forward, then times them ([Fight Library](https://fightlibrary.substack.com/p/how-naoya-inoue-walks-opponents-onto)). He cuts the ring when the opponent is hurt.

**Rhythm.** Round 1 is often patient: he jabs to gauge reactions ([Champ Theory: Donaire breakdown](https://champtheorywritings.substack.com/p/boxing-breakdowns-inoue-donaire)). Then sudden explosive switches: when he sees an opening or the opponent is hurt, a long finishing blitz (Donaire 2, Nery round 6). Recent fights against slick boxers (Akhmadaliev, Picasso) were steady jab-led 12-rounders.

**Signature combos / counters.**
- **1b → 2 → 3** (Fulton finish), 1b-2 to the head, 2-3b.
- Parry (pat the lead down) → 3.
- **Fade-away 3** against an opponent stepping in with a 2.
- Body jab to stop forward movement.
- Unorthodox order: 3 before 1, 3-3b, 2-3-2 ([Evolve](https://evolve-mma.com/blog/breaking-down-naoya-inoues-style-of-fighting/)).
- Feints to draw counters, then counter the counter.

**Strengths.** One-shot power with both hands, body work, unpredictable sequencing, finishing instinct, composure after knockdowns.
**Flaws.**
- **Counter left hook while he is coming in or loose in mid range** (Nery round 1, Cardenas round 2; Donaire 1 hook broke his orbital bone).
- Overconfidence early: he drifts into the opponent's range.
- Slick movers can make him jab-heavy and lower his landed rate (Akhmadaliev, 24%).

**AI rules.**
1. IF round 1 → jab-heavy (60%+), output ×0.8, collect opponent reaction data (does he raise the guard on a 1b? lean on a feint?).
2. IF the opponent lowers his guard after a body shot → next combo 1b-2-3 (head after body).
3. IF the opponent steps in with a 2 → 50% fade-away 3 counter. IF the opponent jabs → parry-3.
4. IF the opponent is hurt (stagger) → blitz mode: output ×2, power share 80%, cut off the ring until the stoppage or the bell.
5. Flaw hook: IF he is advancing in mid range with his guard low after his own combo → opponent counter-3 has a +25% land chance (est.). After being knocked down, flip to "careful" (jab + body, flaw chance halved) for the rest of the fight.

---

## 5. Oleksandr Usyk ("the rhythm-breaker")

**Stance / guard.** Southpaw (naturally right-handed). Long, active lead hand, constant small steps, and a "Soviet school" outside-foot game. Defense is mostly footwork and positional: he takes the head off the line as he punches, then pivots away ([Evolve: how to box like Usyk](https://evolve-mma.com/blog/how-to-box-like-heavyweight-champion-oleksandr-usyk/); [BoxRaw: Joshua 2 breakdown](https://boxraw.com/blogs/blog/usyk-vs-joshua-2-fight-breakdown)).
**On the ropes:** he tries to stay off them by circling mainly to his right (away from an orthodox man's power hand) and taking the centre. When trapped he can be hurt: AJ pinned him in a corner in round 6 and rocked him with body shots in round 9 of the rematch ([Boxing News: 10 things](https://www.boxingnewsonline.net/10-things-we-learned-from-usyk-vs-joshua-ii/)). Fury landed well in rounds 5–7 of fight 1.

**Output (CompuBox).**
| Fight | Thrown/rd | Landed/rd | Total % | Notes |
|---|---|---|---|---|
| Heavyweight career ([Ring "By the Numbers"](https://ringmagazine.com/en/news/by-the-numbers-compu-box-breakdown-for-usyk-vs-dubois-pacquiao-vs-barrios-and-bam-vs-cafu)) | **44.9** | **13.7** | 30.5% (calc) | **Jab 23.8 thrown (53%), 4.9 landed (20.6%)** |
| Joshua 1, 2021 ([Wikipedia](https://en.wikipedia.org/wiki/Anthony_Joshua_vs_Oleksandr_Usyk)) | 44 (calc) | 12.3 | 28% (148/529) | AJ 123/641, 19.2%. 29 landed in round 12 (most by an AJ opponent) |
| Joshua 2, 2022 ([WBN](https://www.worldboxingnews.com/?p=96861)) | – | 14.2 | – | 170 landed (record vs AJ). **Last 3 rounds: 232 thrown (77/rd) vs 149; outlanded 79–29** |
| Fury 1, May 2024 ([BoxingScene CompuBox](https://www.boxingscene.com/compubox-stats-oleksandr-usyk-tyson-fury--183645)) | 34 (calc) | 14.2 | 41.8% (170/407) | Fury 157/496, 31.7%. After 3: Fury led jabs 25–14, Usyk led power 21–12. Fury led power 63–56 after 7. **Rounds 8–12 Usyk took over**: round 8 power 12–6; knockdown (standing count) in round 9; rounds 10–12 power 36–15 |
| Fury 2, Dec 2024 ([Channel 103 / CompuBox](https://channel103.com/news/sport/usyk-vs-fury-2-tyson-fury-and-oleksandr-usyk-punch-stats-analysed-were-the-judges-correct)) | 35 (calc) | 14.9 | 42.3% (179/423) | Fury 144/509, 28.3%. Out-landed Fury in jabs and body (sources disagree on the splits: "jabs 73–44" vs "78 body shots"; treat the breakdown as unverified) |
| Dubois 2, Jul 2025, KO 5 ([SI](https://www.si.com/fannation/boxing/usyk-vs-dubois-ii-undercard-results-lawrence-okolie-stakes-claim-to-heavyweight-title-shot); [Boxing News](https://boxingnewsonline.net/news/oleksandr-usyk-knocks-out-daniel-dubois-in-round-five/)) | lower than Dubois 1 | – | power 46% | Dubois threw 179 total. **Round 5: Usyk landed 8 of 11 power**, finished with a short straight left |

- **Body:** a straight left to the body (2b) off the outside angle is a staple ([Evolve](https://evolve-mma.com/blog/how-to-box-like-heavyweight-champion-oleksandr-usyk/)). Body share is moderate, ~15–20% (est.).
- **Defense:** heavyweights land 19–32% on him. That is good but not elite. He wins on position and late volume, not on making opponents miss everything.

**Range / footwork.** Long-to-mid range. He constantly changes distance with small steps, hand-fights with the lead, and takes the outside angle (lead foot outside the opponent's lead foot), which lines his left hand up with the opponent's chin. He uses the "outside dip" to beat longer reach. He circles right as the default, but he also walks forward and pressures in late rounds.

**Rhythm.** The defining trait: **he sets a rhythm, then breaks it**. He hand-fights at a steady tempo until the opponent syncs, then a sudden double jab plus a step outside → 2 ([Evolve](https://evolve-mma.com/blog/how-to-box-like-heavyweight-champion-oleksandr-usyk/)). He is a slow starter who gets stronger late: AJ2 late rounds 77 thrown/rd, Fury 1 rounds 8–12, AJ1 round 12. His output roughly doubles in the championship rounds.

**Signature combos / counters.**
- 1-1 (double jab) + step outside → 2.
- 2b → 2 (body then head with the same hand).
- 1-2-3 at close range.
- Lead-hand feints and taps; draw → pivot → 2.
- Short straight 2 counter as the opponent loads up (Dubois 2 finish).
- Late-fight flurries of 6–10 punches against a tiring opponent (Fury round 9).

**Strengths.** Footwork, positioning, conditioning (late-round surge), rhythm manipulation, IQ against bigger men.
**Flaws.**
- **Body shots and pressure that traps him** (AJ2 rounds 5, 6, 9).
- Can be out-jabbed early by a long man (Fury led jabs 25–14 after 3).
- Hurt by uppercuts and rear hands when he stands square in mid range (Fury rounds 5–7) (est.).
- Low early output loses early rounds.

**AI rules.**
1. Rhythm model: during "set" phases, act on a fixed period (e.g. a feint or tap every 0.8 s). After N≥4 regular beats, break with an off-beat 1-1-2 plus an outside step (bonus to land chance because the opponent's timing is synced).
2. IF neutral → move to the outside-foot angle (circle right vs orthodox); IF the angle is gained → 2 or 2b (50/50).
3. Output curve: rounds 1–4 ×0.75, rounds 5–8 ×1.0, rounds 9–12 ×1.5. IF the opponent's stamina is below his → +20% more.
4. IF his back is near the ropes → priority is lateral exit (pivot right). If blocked → cover and clinch; body-shot vulnerability +20% while trapped (est.).
5. IF the opponent loads a big power punch (long windup) → straight 2 counter down the middle (short left).

---

## Cross-card comparison (for knob calibration)

| Knob | Stevenson | Lomachenko | Benavidez | Inoue | Usyk |
|---|---|---|---|---|---|
| Thrown/rd (avg) | ~41 (31–48) | ~62 (bursty, 10–65) | ~58 (46–60) | ~51 (43–49) | ~45 (34–77 late) |
| Landed/rd | 15 | ~23 | 22.5 | 17.8 | 13.7 |
| Connect % | 37–52% | 37.5% | ~38–40% | ~35% | ~30% (42% vs Fury) |
| Jab share | ~43% (37–68) | ~55–65% (est.) | ~36% | ~54% (up to 65) | ~53% |
| Body share of connects | ~14% (41% vs a hurt opponent) | 14–18% | ~30–35% | high (est. 25–30%) | ~15–20% (est.) |
| Opponent landed/rd | 3–7 (23 vs Zepeda) | 7.9 | ~14 | ~5–14 | ~10–14 |
| Opponent connect % | 12–22% | 16.8% | 15–28% | ~17–30% | 19–32% |
| Range | long | mid with angles | mid/close | mid | long-mid |
| Start | slow/feel-out | very slow | slow | patient round 1 | slow |
| Late-round trend | ↑ accuracy | ↑ bursts | ↑↑ volume | blitz when hurt | ↑↑ volume |
| Nearest Last Bell guard | philly | standard (high-ish, slips) | high | standard | standard (long lead, handslow-ish) |

Sources not reachable directly (blocked): compuboxdata.com, ringmagazine.com, boxingscene.com, bloodyelbow.com, fightprimer.com, substack. Figures from those domains are taken from search-result summaries.
