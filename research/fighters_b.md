# Fighter DNA cards (set B): real fighters to AI knobs

Researched 2026-10-04 for Last Bell AI styles. The fetch proxy blocked every article domain (boxingscene, ringmagazine, compuboxdata, bloodyelbow, wikipedia, evolve-mma, boxraw), so the numbers below come from search-engine summaries of those pages. Each URL is the page the summary came from. **(est.)** means I derived the number (division, subtraction, or reading the tape) and no source states it. **(calc)** means simple arithmetic on cited totals.

Punch numbering: 1 jab, 2 cross, 3 lead hook, 4 rear hook, 5 lead uppercut, 6 rear uppercut, b = body. For a southpaw, the "1" is the right-hand jab and the "2" is the straight left.

Reference baseline (Last Bell targets): ~56 thrown, ~16 landed, ~29% connect per round.

---

## 1. Terence Crawford ("switch-hitting reader")

**Stance / guard:** Natural orthodox who fights mostly southpaw against good opponents and switches freely. Against Spence he matched southpaw (closed stance), and his right jab won the fight ([Bloody Elbow](https://bloodyelbow.com/2023/07/30/terence-crawford-vs-spence-breakdown)). Mid-high guard, parries, and a lot of defense done with distance (he stays "right on the end of his opponent's reach") ([Evolve](https://evolve-mma.com/blog/5-ways-to-fight-like-terence-crawford/)). When pressured or on the ropes he stays calm, lets the opponent commit, and fires the counter uppercut and right hook. In round 7 against Spence he "let Spence come onto him early before countering with a thunderous uppercut, followed by a right hook" for a knockdown, and Spence bounced off the ropes into another right hook ([so.affino/Ring](https://so.affino.com/schedules-and-results/schedules-and-results/speed-and-counters-kill-terence-crawford-floors-errol-spence-jr-three-times-wins-by-stoppage)).

**Output (CompuBox):**
| Sample | Thrown/rd | Landed/rd | Jab share | Connect (tot / jab / pwr) | Opp connect |
|---|---|---|---|---|---|
| Career avg ([compuboxdata via search](https://api2.compuboxdata.com/reports/79)) | ~44 (calc: 22.9 J + 21 P) | 13.2 | 52% | 30.1 / 19.2 / 41.9 | opp land 7.1/rd, 5.2 pwr/rd |
| vs Spence 2023, 8.x rds ([BoxingScene](https://www.boxingscene.com/articles/terence-crawford-vs-errol-spence-compubox-punch-stats)) | ~43 (calc) | ~21.5 | 56% (206/369) | 50.1 / 42.2 / 60.1 | Spence 20% (jab 11.1, pwr 34.2) |
| vs Canelo 2025, 12 rds ([SI](https://www.si.com/fannation/boxing/canelo-alvarez-vs-terence-crawford-punch-stats-tell-interesting-story), [CompuBox rounds](https://api2.compuboxdata.com/round-stats/15676)) | 44.5 | 9.6 | 61% (326/534) | ~21.5 / ~14 / 33.7 (calc) | Canelo 29% total (calc 99/338), 31.9 pwr |
| vs Madrimov 2024 ([CBS](https://www.cbssports.com/boxing/news/terence-crawford-vs-israil-madrimov-fight-results-highlights-bud-outpoints-foe-to-claim-wba-title/live)) | 36 | 7.9 | jab-led | 21.9 | Madrimov 30.5% |

- **Body %:** vs Canelo, 23 of 115 landed went to the body (20%) ([SI](https://www.si.com/fannation/boxing/canelo-alvarez-vs-terence-crawford-punch-stats-tell-interesting-story)). Most of his body work is jab and straight to the body. Estimate 15–20% of landed (est.).
- **Note:** The "37% vs 38%" accuracy figures quoted for Canelo–Crawford in some articles do not match 115/534, so treat them as unreliable. The calc says 21.5% for Crawford.

**Range / footwork:** Long-to-mid range. He holds the edge of the opponent's reach and steps in behind the jab. Uses pivots and stance switches to reset the angle when cut off ("forces opponents to reset over and over") ([Complex](https://www.complex.com/sports/a/bernadette-giacomazzo/zab-judah-broke-down-exactly-how-terence-crawford-beat-canelo-alvarez)). When the opponent retreats he chases. He cut the ring off on Spence once Spence was hurt.

**Rhythm / tempo:** Slow, steady start, then he takes over. Madrimov rounds 1–3 had 3, 13 and 11 combined landed punches ([CBS](https://www.cbssports.com/boxing/news/terence-crawford-vs-israil-madrimov-fight-results-highlights-bud-outpoints-foe-to-claim-wba-title/live)). Early on he "might even lose a couple of rounds… slowly exerts more and more control over timing, distance and pace" ([Complex](https://www.complex.com/sports/a/bernadette-giacomazzo/zab-judah-broke-down-exactly-how-terence-crawford-beat-canelo-alvarez)). He finishes strong: vs Canelo he landed 39 in rounds 11–12 (~19.5/rd, twice his fight average), 32 of them power ([SI](https://www.si.com/fannation/boxing/canelo-alvarez-vs-terence-crawford-punch-stats-tell-interesting-story)). His jab volume against Canelo by round was 17, 31, 24, 27, 27, 37, 28, 19, 39, 26, 23, 28: the jab output steps up after round 1 and peaks in the middle rounds ([CompuBox rounds via search](https://api2.compuboxdata.com/round-stats/15676)).

**Combos / counters:**
- **Counter jab (southpaw right):** his #1 weapon against a lunging straight left. Trainer McIntyre drilled it as a power punch ([so.affino/Ring](https://so.affino.com/schedules-and-results/schedules-and-results/speed-and-counters-kill-terence-crawford-floors-errol-spence-jr-three-times-wins-by-stoppage)).
- **Counter right hook (southpaw lead hook, a "3"):** thrown "virtually every time he plays the southpaw role" when the opponent commits to a jab ([Evolve](https://evolve-mma.com/blog/5-ways-to-fight-like-terence-crawford/)).
- **Chase 2-1:** when the opponent jabs to the body and pulls back, he follows with a 2-1 (Spence knockdown 1) ([Bloody Elbow](https://bloodyelbow.com/2023/07/30/terence-crawford-vs-spence-breakdown)).
- **Pull/check into 6-3:** rear uppercut then lead hook while the opponent walks onto him (Spence round 7).
- **Finishing:** once the opponent is hurt, long volleys at 60%+ power accuracy and a mean streak.

**Strengths:** reads opponents and makes adjustments, best-in-class counter accuracy (60% power vs Spence), switch-stance angles, finishing instinct, defense through distance.
**Flaws:** passive early rounds, so a fast starter can bank 2–4 rounds. Lower volume than a pressure fighter: vs Canelo he was out-landed on power in many rounds and was hit to the body 51 times. A disciplined counterpuncher who never commits (Madrimov) drags him into close, low-output fights.

**AI rules:**
1. `if round <= 2: output *= 0.65, jabShare = 0.65, no commits; record opp tendencies (lead punch freq, lunge rate)`. Starting in round 3, `counterSkill += min(0.25, 0.05*roundsSeen)`.
2. `if opp.lungesStraight (lead-hand straight with weight forward): counter = jab (power-weighted) 70% / lead hook 30%`.
3. `if opp throws jab and Bud is southpaw: 50% chance counter 3 (right hook) over the jab`.
4. `if stance matchup is open (orth vs south) and opp dominates outside foot for >2 s: switch stance` (base switch rate ~1 per 30–60 s, est.).
5. `if opp hurt OR round >= 10 and score close: output *= 1.6, powerShare -> 0.6, close to mid range`.

---

## 2. Dmitry Bivol ("jab-and-distance fencer")

**Stance / guard:** Orthodox, tall high guard (gloves at the temples, elbows in). He catches hooks on the gloves and arms and keeps it simple ([Boxraw](https://boxraw.com/blogs/blog/fight-breakdown-how-bivol-beat-canelo)). When pressured he steps back or circles off and "seize[s] the initiative quickly by taking back centre ring" ([Boxraw](https://boxraw.com/blogs/blog/fight-breakdown-how-bivol-beat-canelo)). He rarely stays on the ropes. Against Canelo's body/arm attack he braced and countered as soon as Canelo reset.

**Output (CompuBox):**
| Sample | Thrown/rd | Landed/rd | Jab share | Connect | Opp |
|---|---|---|---|---|---|
| Career ([compuboxdata via search](https://api2.compuboxdata.com/reports/79)) | ~51 (calc: 33.6 J / 0.655) | 16 | **65.5%**, highest in boxing | 30.9 tot, 24.7 jab | opp land **6.8/rd**, +17.8 plus/minus (3rd best) |
| vs Canelo 2022 ([BoxingScene](https://www.boxingscene.com/canelo-vs-bivol-compubox-punch-stats--166060), [CBS](https://www.cbssports.com/boxing/news/canelo-alvarez-vs-dmitry-bivol-results-takeaways-what-can-the-mexican-superstar-fix-for-a-rematch)) | **59** | 13 | ~59% (est.) | 21 tot, 36 pwr | Canelo 41/rd, 7 landed, 17% |
| vs Beterbiev 1, 2024 (L) ([Ring via search](https://ringmagazine.com/en/news/dmitry-bivol-vs-artur-beterbiev-rematch-compu-box-punch-stats), [BoxingScene](https://www.boxingscene.com/compubox-stats-artur-beterbiev-dmitry-bivol--186425)) | 35 (calc 423/12) | 11.8 | 60% (calc 255/423) | 33.6 tot, ~23 jab (calc 58/255), **50 pwr** | Beterbiev 57/rd, 20.1% |
| vs Beterbiev 2, 2025 (W) ([ESPN](https://africa.espn.com/boxing/story/_/id/43972205/dmitry-bivol-gets-revenge-edges-artur-beterbiev-decision)) | ~40 (est.) | 14.2 (170 total) | jab +40 over Beterbiev | — | Beterbiev landed 121 (10.1/rd) |

- **Body %:** low, estimate 10–15% of landed (est.). The main body shot is a 2b (straight right to the body) used to lower the guard.
- **Consistency:** double-digit landed punches in every round vs Canelo, and in 11 of 12 vs Beterbiev 2 ([BoxingScene](https://www.boxingscene.com/canelo-vs-bivol-compubox-punch-stats--166060), [Ring via search](https://www.worldboxingnews.com/?p=135059)).

**Range / footwork:** Long range, "almost like a fencer". He makes opponents miss "by a very small margin" and is then set to counter ([Evolve](https://evolve-mma.com/blog/breaking-down-dmitry-bivols-style-of-boxing/)). He moves on the back foot, pivots off the line after combos, and never stays square in front of a puncher. He takes the center back when the opponent pauses to breathe.

**Rhythm / tempo:** Steady metronome. Same output every round and no feel-out dip. Gets stronger late in the rematch: Beterbiev led rounds 3–5 by 50-43 landed, then "from the sixth round on Bivol found another gear" ([ESPN/Ring via search](https://africa.espn.com/boxing/story/_/id/43972205/dmitry-bivol-gets-revenge-edges-artur-beterbiev-decision)). In fight 1 he faded late: rounds 7–12 power landed were Beterbiev 67, Bivol 51, and rounds 11–12 were 29-19 ([BoxingScene](https://www.boxingscene.com/compubox-stats-artur-beterbiev-dmitry-bivol--186425)).

**Combos / counters:**
- **Jab variety:** a pawing jab that occupies a high guard, a stiff jab, and doubled/tripled jabs (1-1, 1-1-1) at varied speeds ([Boxraw](https://boxraw.com/blogs/blog/fight-breakdown-how-bivol-beat-canelo), [Evolve](https://evolve-mma.com/blog/breaking-down-dmitry-bivols-style-of-boxing/)).
- **Staples:** 1-2, 1-1-2, then a 2-3-2 flurry and step out.
- **Exchange-ender burst:** after blocking a hook, a 4–5 punch straight-punch flurry (2-3-2-3), then a pivot out.
- **Counter trigger:** the opponent stops after loading up, and Bivol immediately jabs "to keep his high guard occupied" so the opponent cannot reset ([Boxraw](https://boxraw.com/blogs/blog/fight-breakdown-how-bivol-beat-canelo)).

**Strengths:** distance management, jab volume and accuracy, an elite rate of opponent punches landed, a tight high guard against hooks, and steady pace.
**Flaws:** modest one-punch power with few KOs at elite level. A stronger pressure fighter who keeps throwing through his shell can out-work him late (Beterbiev 1 rounds 7–12). Arms can be battered (Canelo targeted his left arm). Few uppercuts, so a tight high-guard opponent gives him few new looks.

**AI rules:**
1. `preferredRange = opp.reach + 5% ; if dist < preferred: step back or pivot before punching (75%)`. Never stand at MIN_D for more than 1.5 s.
2. `jabShare = 0.60–0.65; on each jab 35% double, 10% triple`. Vary jab speed (0.8–1.2× windup).
3. `if opp blocks or misses a hook at mid range: counter 2-3-2 then pivot 30–45° away`.
4. `if opp idle for more than 0.6 s after a combo (resetting): jab immediately (no reset allowed)`.
5. Output is flat across rounds (±5%), with no feel-out multiplier. `if opp is pressure + high output and round >= 7: lose 10% output` (fight-1 fade). This can be removed for a "rematch Bivol" variant.

---

## 3. Saul "Canelo" Alvarez ("counter-puncher with a body attack")

**Stance / guard:** Orthodox, high tight guard plus subtle head movement. Slips and rolls by a hair, then counters while staying in range ([Evolve](https://evolve-mma.com/blog/breaking-down-canelo-alvarezs-style-of-boxing/)). Rather than chase, he "likes to lean back and let his opponents come to him" ([Evolve](https://evolve-mma.com/blog/breaking-down-canelo-alvarezs-style-of-boxing/)). When pressured or on the ropes he is comfortable: he rolls under, catches on the guard, and counters with a 3 or a 3b. He walks the opponent down behind the guard rather than cutting off with footwork.

**Output (CompuBox):**
| Sample | Thrown/rd | Landed/rd | Jab share | Connect | Body |
|---|---|---|---|---|---|
| Career ([ESPN Stats](https://www.espn.com/blog/statsinfo/post/_/id/117903/canelo-alvarez-amir-khan-stats-infos-preview)) | ~35 (15.5 J + 19.6 P) | 12.3 (calc 3.5+8.8) | 44% | 35 tot / 22.6 jab / **44.9 pwr** | — |
| vs GGG 2, 2018 ([BoxingScene](https://www.boxingscene.com/canelo-golovkin-rematch-compubox-punch-stats--131871), [WBN](https://www.worldboxingnews.net/?p=56938)) | 42 | 14.1 | 46% (calc 233/505) | 33.5 / ~24 / 41.9 | **46 body landed** (~27% of landed, calc); GGG 6 |
| vs Bivol 2022 ([BoxingScene](https://www.boxingscene.com/canelo-vs-bivol-compubox-punch-stats--166060)) | 41 | **7** (career-low 84 total) | very low | 17 | single digits in 10 of 12 rds |
| vs Crawford 2025 ([SI](https://www.si.com/fannation/boxing/canelo-alvarez-vs-terence-crawford-punch-stats-tell-interesting-story)) | **28** | 8.3 | **23%** (78/338) | 29 / ~20 / 31.9 | **51 of 99 landed = 52% body** |
| vs Mayweather 2013 ([ESPN](https://www.espn.com/blog/boxing/post?id=2906)) | 44 | 9.8 | 56% | 22 | — |

- Jab use collapses against movers: 4, 7, 9, 5, 10, 6, 3, 5, 7, 7, 2, 13 jabs per round vs Crawford ([CompuBox rounds via search](https://api2.compuboxdata.com/round-stats/15676)).

**Range / footwork:** Mid range and the pocket. Flat-footed, steady forward walk, with head off the center line on entry. He doesn't move side to side much. He depends on the opponent to come to him, and struggles when they don't (Lara, Mayweather, Bivol, Crawford) ([warriorpunch](https://warriorpunch.com/?p=3220), [Bloody Elbow Ryder](https://bloodyelbow.com/2023/05/09/canelo-vs-ryder-technical-breakdown)).

**Rhythm / tempo:** Slow start with feel-out rounds ([cohorted](https://app.cohorted.co.uk/news/canelo-alvarezs-recent-battles-and)). Fights in bursts: he loads up with a 2–4 punch power combo, then pauses to reset, and that pause is when Bivol jabbed him. He manages stamina carefully. If he "sprints" for 12 rounds, he either gets the KO or fades ([Bloody Elbow Ryder](https://bloodyelbow.com/2023/05/09/canelo-vs-ryder-technical-breakdown)). He often finishes with a late flurry (12th round vs Crawford: 17 of 49 landed, his most active round).

**Combos / counters:**
- **Counter 3 (left hook) after slipping a jab or right hand.** He slips "just a hair" and comes back.
- **3b-3 (hook to body, hook to head)** and **2b-3**: a body-head shift.
- **Rear uppercut 6** inside, against opponents who duck or come in low; **6-3** on the ropes.
- **Feint jab into 3b:** a jab feint to raise the guard, then a body hook.
- **Arm punching** against high-guard fighters (hooks into the forearms to tire them), as with Bivol ([Boxraw](https://boxraw.com/blogs/blog/fight-breakdown-how-bivol-beat-canelo)).

**Strengths:** power-punch accuracy (~45% career), elite body attack (half his landed punches vs Crawford), defense through head movement, a granite chin, and the ability to roll under combos.
**Flaws:** low volume, which drops to ~28–41/rd against movers. A lazy jab against elite boxers. Waits for the opponent to commit, so a disciplined long jabber wins rounds on volume. Pauses to reset after loaded combos. Gasses if forced to sprint.

**AI rules:**
1. `if opp moving laterally or outside his range for > 3 s: output *= 0.7 (wait); do not chase with footwork, walk forward slowly`. Movers drop his volume.
2. `if opp throws 1 or 2 at mid range: slip (60%) -> counter 3 or 3b (power 0.9)`.
3. `target split: body 35–50% of power punches (higher vs high guards / tall opponents)`. Favor 3b-3, 2b-3 and 1-feint-3b.
4. `after a 3+ punch combo: reset window 0.8–1.2 s with output 0 (exploitable)`.
5. `if stamina < 40% and round >= 9: output *= 0.85, except round 12 burst (output *= 1.4)`.

---

## 4a. Junto Nakatani ("long southpaw who will brawl")

**Stance / guard:** Southpaw, tall and upright (5'8"/173 cm at 118–122 lb, est. from public records). Long, hanging right hand that blinds the opponent, "brushes aside guards with cuffing shots", and doubles or triples at varied angles ([fightlibrary](https://fightlibrary.substack.com/p/does-junto-nakatani-beat-naoya-inoue)). Defense is mostly distance plus an intercepting left. When pressured or on the ropes he **brawls**: "leaky defense and tendency to brawl" ([Ring](https://ringmagazine.com/en/news/junto-nakatani-vs-sebastian-hernandez-prediction-prelude-to-inoue-showdown)). Inside, his answer is uppercuts and body shots ([Bloody Elbow](https://bloodyelbow.com/2024/02/25/junto-nakatani-beatdown)).

**Output (CompuBox):**
| Sample | Thrown/rd | Landed/rd | Jab share | Connect | Notes |
|---|---|---|---|---|---|
| Last 13 fights ([compuboxdata via search](https://api2.compuboxdata.com/reports/79)) | **71.4** | 17.7 | 50% (35.6 J / 35.8 P) | 24.8 tot, ~12 jab (calc), ~37 pwr (calc) | **19.7% of landed to body** |
| vs Nishida 2025 ([Dan Rafael](https://danrafael.substack.com/p/nakatani-stops-nishida-in-6th-round)) | — | — | — | **52 pwr** (78/150) | TKO6, eye closed |
| vs S. Hernandez 2025 ([Ring/DAZN](https://ringmagazine.com/en/news/junto-nakatani-beats-sebastian-hernandez-result)) | ~68 rds 7–12 (calc 409/6) | 23.7 rds 1–6, 25.8 rds 7–12 | — | — | Hernandez out-landed him 179-155 in rds 7–12 |
| vs Inoue 2026 (L) ([CompuBox via search](https://beta.compuboxdata.com/round-stats/16431), [ABC](https://abcnews.com/Sports/wireStory/naoya-inoue-beats-junto-nakatani-unanimous-decision-tokyo-132601561)) | 40 | 10 | 54% (258/476) | 25.2 / 17.8 / 33.9 | lost rounds 1–4; out-landed Inoue 48-34 in rds 8–10 |

**Range / footwork:** Long range. Uses height and reach to "peck away with right jabs then land left hands, right hooks, and uppercuts" ([Bloody Elbow](https://bloodyelbow.com/2024/02/25/junto-nakatani-beatdown)). Throws the straight left as an interceptor at the moment the opponent enters range, and a left uppercut **while stepping backward** ([fightlibrary](https://fightlibrary.substack.com/p/does-junto-nakatani-beat-naoya-inoue)).

**Rhythm / tempo:** High-volume grinder, with a cautious start when told to box. Against Inoue his corner held him back: "we started too late" (lost rounds 1–4) ([Ring](https://www.ringmagazine.com/news/nakatani-s-coach-reveals-mistake-leading-to-inoue-loss-6hRi4Y8bboXt4tMfJtvyEN)). He starts boxing behind the jab from round 3 ([Dan Rafael](https://danrafael.substack.com/p/nakatani-stops-nishida-in-6th-round)). He can be dragged into a firefight in the second half (Hernandez).

**Combos / counters:**
- **Blinding 1-1-2:** cuffing right jab, then the straight left.
- **Body first, then head:** 2b early, then overhand 2 and uppercut 6 (the left uppercut) ([Bloody Elbow](https://bloodyelbow.com/2024/02/25/junto-nakatani-beatdown)).
- **Intercepting 2:** a straight left as the opponent steps in.
- **Retreating 6:** a left uppercut on the back step against a ducking, onrushing opponent.
- **Inside:** 6-3-6 (uppercut, hook, uppercut) and 3b.

**Strengths:** volume (71/rd), reach, a versatile lead hand, uppercuts at every range, durability.
**Flaws:** leaky upright defense, brawls when pressed and gets out-landed in exchanges (Hernandez rounds 7–12), slow starts against elite opponents, takes facial damage (swelling, cuts).

**AI rules:**
1. `baseOutput = 1.25× league; jabShare 0.50; lead hand 'paw' (blinding jab) 30% of jabs`, which lowers the opponent's counter accuracy for 0.4 s.
2. `if opp enters range (dist crosses opp.reach): intercept with 2 (55%) or retreating 6 (20%)`.
3. `body share 20% of landed; body share x1.5 in rounds 1–4, then shift upstairs`.
4. `if pinned (ropes or dist < MIN_D+10 for > 2 s): 60% brawl (trade 6-3-6), defense -20%`, instead of escaping.
5. `if opp is elite (rating diff < 3) and round <= 4: output *= 0.7` (the corner-held-back start).

## 4b. Jesse "Bam" Rodriguez ("southpaw angle sniper and body breaker")

**Stance / guard:** Southpaw, mid guard with a lot of angle footwork. "Excellent southpaw jab, beautiful footwork and plenty of angles to keep opponents off-rhythm" ([Ring via search](https://www.ringtv.com/640875-jesse-rodriguez-scores-star-making-tko-win-over-srisaket-sor-rungvisai-to-retain-wbc-junior-bantamweight-title/)). He "never allows opponents who need to set their feet" to do so and turns them when they close distance ([ESPN](https://africa.espn.com/boxing/story/_/id/39130315/jesse-rodriguez-unifies-belts-tko-sunny-edwards-9th)). When pressured he steps right (outside the orthodox lead foot) and fires the left, or meets body attacks with a stiff jab and an uppercut (vs Sor Rungvisai) ([Dan Rafael](https://danrafael.substack.com/p/rodriguez-dominates-stops-sor-rungvisai)).

**Output (CompuBox):**
| Sample | Thrown/rd | Landed/rd | Power share | Connect | Notes |
|---|---|---|---|---|---|
| Career ([compuboxdata via search](https://api2.compuboxdata.com/reports/79), [Ring](https://ringmagazine.com/en/news/jesse-bam-rodriguez-knocks-out-fernando-martinez)) | **60.7** | **23.6** | 57% (34.6 P) | **38.9 tot (#1), 49 pwr (#1)** | plus/minus 2nd best in boxing |
| vs Sunny Edwards 2023 ([BoxingScene](https://www.boxingscene.com/articles/compubox-bam-rodriguez-lands-62-power-punches-on-sunny-edwards)) | — | — | — | **62 pwr** (180/290) | **61 body landed**; KD by 1b then overhand 2 |
| vs Estrada 2024 ([ESPN](https://africa.espn.com/boxing/story/_/id/40464058/jesse-bam-rodriguez-takes-estrada-title-7th-round-ko)) | — | ~22 (156 in 7 rds) | — | — | KO7 with a left to the body |
| vs F. Martinez 2025 ([Ring](https://ringmagazine.com/en/news/jesse-bam-rodriguez-knocks-out-fernando-martinez)) | ~75 (calc 717/9.5) | ~29 | 69% (492/717) | 38 / ~18 jab / 47 pwr | KO10 with the left; Martinez 25% |

- **Body %:** high. 61 body landed vs Edwards and fight-ending body shots (Estrada, Sor Rungvisai). Estimate 30–35% of landed power (est.).

**Range / footwork:** Mid range, by choice. He can "box on the outside, is good at mid-range, and can fight on the inside" ([SA Current](https://www.sacurrent.com/arts/sports-and-recreation/go-bam-go-jesse-rodriguez-san-antonios-low-profile-boxing-champion-faces-his-toughest-test-yet/)). Signature move: a small step to the right (outside foot), then the left. "Stepping to his right before throwing his left" produced the Sor Rungvisai knockdown ([Ring](https://www.ringtv.com/640875-jesse-rodriguez-scores-star-making-tko-win-over-srisaket-sor-rungvisai-to-retain-wbc-junior-bantamweight-title/)).

**Rhythm / tempo:** Methodical breakdown that builds over rounds. He "slowly breaks down opponents before finishing them", "gauges his options" ([ESPN](https://africa.espn.com/boxing/insider/story/_/id/39104679/bam-rodriguez-power-vs-sunny-edwards-rhythm)). Opens later rounds with a 4–5 punch burst (round 8 vs Sor Rungvisai) ([Dan Rafael](https://danrafael.substack.com/p/rodriguez-dominates-stops-sor-rungvisai)).

**Combos / counters:**
- **1b → overhand 2:** jab to the body, then an overhand left (Edwards knockdown) ([ESPN](https://africa.espn.com/boxing/story/_/id/39130315/jesse-rodriguez-unifies-belts-tko-sunny-edwards-9th)).
- **3 → 6:** lead right hook sets up the left uppercut ("lead right hooks to set up his opponent for his uppercut").
- **2 (long) → 6 → 2:** the round-8 combo vs Sor Rungvisai: long left, uppercut through the guard, then cross.
- **Step-right 3b/2b:** a body shot off the angle.
- **Counter:** when the opponent attacks the body, stiff jab plus uppercut.

**Strengths:** the best accuracy in the sport (39% total / 49% power), a body attack, angles, power that carries up in weight, inside-outside versatility.
**Flaws:** momentary lapses in focus. Garcia said he "loses focus for a split second", as in round 6 vs Estrada ([SA Current](https://www.sacurrent.com/arts/sports-and-recreation/go-bam-go-jesse-rodriguez-san-antonios-low-profile-boxing-champion-faces-his-toughest-test-yet/)). His offense is ahead of his defense; Garcia had to tell him not to get hit cleanly in sparring. Smaller frame.

**AI rules:**
1. `before a power left: 40% chance to take a 1-step right angle (outside foot) first`. That angle gives +15% hit chance and -15% opponent counter chance for 0.5 s.
2. `bodyShare 0.30–0.35 of power; prefer 1b -> 2 and 3 -> 6`.
3. `if opp throws to Bam's body: counter stiff 1 + 6 (65%)`.
4. `if opp hp/stamina < 50%: burst 4–5 punch volley at round start (first 15 s)`.
5. `focus lapse: 4% chance per round of a 3–5 s window with defense -30%` (the Estrada round 6 scare).

---

## 5. Archetype references

### Floyd Mayweather Jr. ("Philly shell, pull counter, lead right")
- **Guard:** Philly shell / shoulder roll. Lead arm low across the body, lead shoulder high, chin tucked, rear hand at the cheek. He rolls straight punches off the shoulder, stands in the pocket and shifts his torso forward/back and side to side ([Evolve](https://evolve-mma.com/blog/5-of-floyd-mayweathers-signature-boxing-techniques-you-can-add-to-your-game/), [expertboxing](https://expertboxing.com/10-floyd-mayweather-boxing-tricks)). On the ropes he rolls, pulls back, and counters with the right, then turns out.
- **Output:** ~37 thrown / ~16 landed per round, **~43–44% connect** over late-career runs ([ESPN Stats](https://www.espn.com/blog/boxing/post/_/id/2922/stats-info-how-mayweather-can-win)). Jab connect 50% and power 46.8% over three welterweight fights. **Opponents connected 16%**, the lowest in the CompuBox database, for a +30 plus/minus ([TSS](https://tss.ib.tv/boxing/boxing-articles/14163-stats-back-up-floyds-claims-of-greatness)). vs Pacquiao: 435 thrown, 148 landed (34%), jab 267 thrown (61% jab share), Pacquiao 19% ([BoxingScene](https://www.boxingscene.com/articles/mayweather-vs-pacquiao-by-numbers-review)). vs Canelo: 232/505 (46%), jab 139/330 (65% jab share), power 53%, Canelo 22% ([ESPN](https://www.espn.com/blog/boxing/post?id=2906)). Body: estimate 10–15% of landed, mostly jabs to the body and the 2b (est.).
- **Rhythm:** feel-out rounds 1–3 (he gives up some early rounds), then a lot of control in the middle rounds. Late rounds are steady and he does not sprint.
- **Signatures:** **pull counter 2:** offers his head (drops the lead hand, leans in), pulls back as the opponent jabs, and springs forward with the right ([expertboxing](https://expertboxing.com/10-floyd-mayweather-boxing-tricks)). **Lead right hand:** a straight right thrown without a jab setup, with the shoulder turn and punch nearly simultaneous so it can't be read. Check hook (3) as the opponent rushes. Jab to the body to keep the opponent honest.
- **Flaws:** low volume, which concedes rounds to pressure and volume (Castillo 1, Maidana 1). The low lead hand leaves him open to an overhand right/left hook over the shoulder and to body attacks into the open side ([MMASucka "Cracks in the Castle"](https://mmasucka.com/opinion/floyd-mayweather-style-guide-part-4/)).
- **AI rules:** (1) `if opp throws 1 at mid range: pull (65%) -> counter 2 within 0.25 s`. (2) `lead-right-without-jab: 20% of 2s are thrown with no setup and a 0.8× windup tell`. (3) `defense vs straights ×1.5, vs overhands/rear hooks ×0.8, vs body ×0.85` (shell geometry). (4) `output 0.65× league; rounds 1–3 output 0.5× (reading)`. (5) `if pinned on ropes: roll + 2 + pivot out (80%)`.

### Mike Tyson ("peekaboo pressure, bob-and-weave, body-head combos")
- **Guard:** peekaboo. Gloves at the cheeks, elbows tight, constant side-to-side head movement, bobbing and weaving, rising uppercuts and hooks off the duck ([Wikipedia: Peek-a-boo](https://en.wikipedia.org/wiki/Peek-a-boo_(boxing_style)), [Evolve](https://evolve-mma.com/blog/what-is-the-peek-a-boo-style-in-boxing/)). On the ropes he slips and counters immediately. He goes straight back to offense.
- **Output:** 40–50 thrown and ~14 landed per round in prime. **47.2% total, 55.1% power connect** in his first reign, against heavyweight averages of 32.4/39.7 ([ESPN Stats](https://www.espn.com.au/blog/statsinfo/post/_/id/120595/mike-tyson-turns-50)). Against Berbick he landed more power punches (46) than Berbick threw in total (43). Jab share estimate 25–30% (est.); body share is high, estimate 25–30% of power punches (est.).
- **Range / footwork:** inside. He closes behind head movement plus a step-in (and occasionally a shift into the opposite stance); he does not jab his way in. D'Amato numbered punches so combos fire by call: "3-2-3 body-head-body", "3-3-2 body-body-head" in D'Amato's own numbering, where the left hook is "1" ([titleboxing](https://www.titleboxing.com/blogs/news/cus-damato)). In trainer numbering his trademark is **4b-6** (right hook to the body, right uppercut), along with **4b-6-3**, 3b-3, 2-3-2 and slip-6.
- **Rhythm:** explosive starts with KO hunting in rounds 1–3. Output and creativity drop if the opponent survives.
- **Flaws:** after his prime he became one-dimensional, with "predictable straight line attacks"; he fell for feints and lateral movement (Douglas). A long jab kept him out, and holding and leaning (Holyfield) neutralized his inside work ([search summary, Douglas/Holyfield](https://monitor1.icoastalnet.com/?p=9379)). Frustrated when the first plan fails. Stamina dips late.
- **AI rules:** (1) `approach: if dist > opp.reach: move in with head movement (slip/duck chance 0.45 vs 1/2), no jab needed`. (2) `after a successful slip/duck: immediate counter 6 or 3 (power 1.1)`. (3) `combo pool weighted: 4b-6 (25%), 3b-3 (20%), 4b-6-3 (15%), 2-3-2 (15%)`. (4) `rounds 1–3 aggression ×1.3; if no KD by round 5: head movement -30%, straight-line entries +40%` (the prime-to-late fade). (5) `if opp clinches > 2× per round: output -15% for that round` (frustration).

### Devin Haney ("jab and grab")
- **Guard / defense:** orthodox, tall, high guard. Jabs, then grabs when the opponent gets past the jab ([Bloody Elbow](https://bloodyelbow.com/2023/05/22/devin-haney-vs-lomachenko-breakdown)). On the ropes or when rushed he clinches and leans.
- **Output:** 16.7 jabs thrown / 3.9 landed per round (23.4% jab connect). Opponents connect ~19.5% total and 10.5% jab over a four-fight sample ([compuboxdata via search](https://app2.compuboxdata.com/reports/79)). Prograis landed just **36 punches in 12 rounds (10%)**, a CompuBox record low; Haney landed 129, 80 power at 47% ([WBN](https://www.worldboxingnews.com/?p=116652)). vs Lomachenko: Haney 27.2% / power 41.5% and **50 body shots landed vs 9**, mostly the straight right to the body ([Reuters/RJ via search](https://develop.reviewjournal.com/?p=2554363)). Can be extremely low-output: Ramirez 2025 (Haney landed 70 in 12 rounds, ~6/rd) ([SI](https://www.si.com/fannation/boxing/devin-haney-vs-jose-ramirez-sets-unfortunate-punch-record-in-times-square-fight)). Total output estimate ~35–45/rd at his peak (est.).
- **Range:** long, then a clinch as soon as the opponent gets inside. He overextends on the jab, leaning onto the front foot.
- **Rhythm:** steady and low-risk. He banks early rounds, then protects the lead. He survived late scares (Linares, Lomachenko rounds 9–11).
- **Signatures:** 1, 1-2, **2b** (straight right to the body, his most consistent punch against Lomachenko), 1-2b, then clinch.
- **Flaws:** a "bow and arrow" jab that yanks the right hand back and leaves the chin open to a counter left hook; he leans forward on the jab; his head stays on the center line when moving back ([Bloody Elbow](https://bloodyelbow.com/2023/05/22/devin-haney-vs-lomachenko-breakdown)). Ryan Garcia dropped him 3 times with the left hook and out-landed him nearly 2-1 on power ([Yahoo](https://au.sports.yahoo.com/ryan-garcia-drops-devin-haney-3-times-en-route-to-stunning-upset-052220458.html)).
- **AI rules:** (1) `if opp dist < MIN_D+15 after Haney jabs: clinch 55%` (ref breaks, 1.5–2 s rest). (2) `jabShare 0.55, body target on the 2: 45%`. (3) `on every jab: rear hand drops (guard -25%) for 0.3 s`, which opens a counter 3 window. (4) `if leading on cards after round 8: output ×0.8, clinch ×1.3`. (5) `stepping back: 70% straight back (no angle)`, which makes him catchable by step-in jabs.

### Jaron "Boots" Ennis ("switch-hitting, adaptable volume finisher")
- **Stance:** a true switch-hitter who changes stance mid-fight and mid-combo, with good slips and rolls ([Ennis analyses via search](https://africa.espn.com/boxing/story/_/id/44605055/boxing-experts-picks-best-bets-jaron-boots-ennis-speed-power-vs-eimantas-stanionis-relentless-attack)). On the ropes he rolls and counters with hooks/uppercuts.
- **Output:** vs Stanionis (2025): 424 thrown in 6 rounds (~71/rd), 81 landed (19%), 65-29 power, **23-9 power to the body**, ended by an uppercut flurry ([BoxingScene/WBN via search](https://www.worldboxingnews.com/?p=136174), [ESPN](https://africa.espn.com/boxing/story/_/id/44651157/boots-ennis-unifies-belts-stanionis-corner-halts-fight)). vs Lipinets: 125/300 (42%), power 91/172 (53%), **48 body landed in 6 rounds** ([BoxingScene](https://www.boxingscene.com/articles/jaron-ennis-vs-sergey-lipinets-compubox-punch-stats)). vs Avanesyan: **47% of landed were body**, 53% of landed power were body ([boxingnews.com](https://boxingnews.com/news/ennis-dominates-avanesyan-with-impressive-compubox-stats)). A search summary also credited Ennis with 148/431 (34%), 131 power at 49% "vs Xander Zayas" ([WBN](https://www.worldboxingnews.com/?p=127556)). That attribution is unverified because Ennis and Zayas have not fought, so treat it as a different fight. Typical: 50–70/rd, power share ~55–60% (est.).
- **Range / footwork:** any range. He adapts during the fight, switching to whichever stance gives the open angle.
- **Rhythm:** fast hands with flurries, a body-first breakdown, then an uppercut finish. Against an awkward runner he chases and loses shape.
- **Signatures:** 3b-3 and 2b-3 from either stance, 6-5 uppercut pairs, flurries of 4–6 punches. He changes stance during a combo to land the hook from the new lead side.
- **Flaws:** defensive holes when frustrated. Chukhadzhian (a mover) "showed the world where Ennis is ultimately vulnerable", wobbled him in round 8, and drew Ennis into "pressing for a knockout while chasing" ([Kevin Iole](https://keviniole.com/2024/11/09/jaron-ennis-remains-unbeaten-with-win-over-karen-chukhadzhian-but-is-he-ready-for-prime-time), [Ring](https://ringmagazine.com/en/news/jaron-ennis-chukhadzhian-rematch-is-what-it-is-promises-fans-will-see-better-version-versus-stanionis)).
- **AI rules:** (1) `every 20–40 s or when the opponent's counter connect > 30% over the last 60 s: switch stance`. (2) `bodyShare 0.40–0.50 of power until opp stamina < 50%, then head + uppercuts`. (3) `adapt: each round, raise the weight of the punch type with the best connect % by +10%`, shifting toward what works. (4) `if opp is a mover (lateral > 50% of time) and no KD by round 4: frustration → chase (footwork straight), defense -20%`. (5) `if opp hurt: 4–6 punch flurry with 2 uppercuts`.

---

## Quick knob table (est., for tuning; league ~56 thrown)

| Fighter | Output ×league | Jab share | Body % (power) | Connect target | Opp connect | Range | Tempo |
|---|---|---|---|---|---|---|---|
| Crawford | 0.8 | 0.55 | 15–20% | 30–40% (power 42–60%) | ~20% | long/mid | slow start, strong finish |
| Bivol | 1.0 (0.6 early in Beterbiev 1) | 0.62 | 10–15% | 30% (power 36–50%) | ~17–20% | long | flat metronome |
| Canelo | 0.6–0.75 | 0.25–0.45 | 35–50% | 33% (power 42–45%) | ~25–29% | mid/pocket | feel-out, bursts and resets |
| Nakatani | 1.25 | 0.50 | 20–25% | 25% (power 35–50%) | ~30% (est.) | long, brawls when pinned | slow start vs elite, grinds |
| Bam | 1.1–1.3 | 0.40 | 30–35% | 39% (power 49%) | ~22–25% | mid, angles | builds, late bursts |
| Mayweather | 0.65 | 0.60 | 10–15% | 43% | **16%** | mid/pocket shell | feel-out, controlled |
| Tyson | 0.8 (heavyweight) | 0.25 | 25–30% | 47% (power 55%) | — | inside | explosive start |
| Haney | 0.6–0.8 | 0.55 | 35–45% (2b) | 27–40% | ~10–20% | long + clinch | steady, protects lead |
| Ennis | 1.0–1.25 | 0.40 | 40–50% | 35–42% (power ~50%) | — | any, switch | flurries, chases movers |

Caveats: CompuBox per-fight numbers depend on the opponent. Some search summaries mixed up the Beterbiev 1 and 2 stats; where they conflicted I used the BoxingScene fight-1 article (Bivol 142/423, Beterbiev 137/682) and the ESPN fight-2 report (Bivol 170 landed vs 121). For Canelo–Bivol thrown, sources say both 495 and 660 for Canelo; 41/rd × 12 = 492 matches 495.
