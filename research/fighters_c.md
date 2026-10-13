# Fighter DNA cards, batch C (exciting 140–160 power and pressure fighters)

Research for Last Bell's per-fighter AI knobs, from Ed's r/Boxing "most exciting active fighters" thread. Researched 2026-10-13. In-game names will be altered.

**How this was gathered.** WebSearch only (search-engine summaries of the cited pages; most boxing sites block direct fetch). Tags: [src: site] = a search summary of that page, [snippet] = summary text with weak or mirror sourcing, [mem] = from training memory (pre-mid-2026), (est.) = judgement, (calc) = my arithmetic. Status lines are as found on the date shown. Punch numbering: 1 jab, 2 cross, 3 lead hook, 4 rear hook, 5 lead upper, 6 rear upper, b = body. For a southpaw, 1 is the right jab and 2 the straight left. League norm: ~56 thrown, ~16 landed, ~29% per round.

Skipped (already carded in fighters_a/b or mind_p4p_b): none of this batch overlapped.

**Knob key.** Traits 0–1: output jab power body combo initiative patience shell slip legs clinch composure risk killer range circle. `range` high = prefers long range. `circle` high = lateral movement rather than straight lines.

---

## 1. Vergil Ortiz Jr. ("the body-snatching walk-down")

**154, orthodox, Grand Prairie TX, Golden Boy.** Status (Nov 2025): 24-0 (22 KO), interim WBC 154 [src: Wikipedia, CBS]. Ennis fight off "for now" and a Golden Boy court win against him may stall plans (Mar 2026) [snippet]. No 2026 fight found.

- **Style:** mid-to-inside range, high-ish standard guard, steady forward walk behind a busy jab, including **jab to the body** [src: sportskeeda Madrimov rbr]. Goes "forehead to forehead or shoulder to shoulder" and works hooks and body shots off the contact [src: DAZN Lubin preview]. "Loads up and leverages his power on body shots exceptionally well" [src: DAZN].
- **Punch diet:** body-first. Vs Bohachuk: 265 landed to 225, power 189-143, 43% power connect, **body landed 101 to 32** (~38% of his landed went to the body, calc) [src: CBS, Ring]. Out-jabbed Hooker most rounds [src: bloodyelbow].
- **Signatures:** 3b (left hook to the liver, ended Salgado 2018 and McKinson) [src: 3kingsboxing], 1b-1-2, 2-3b, right hands in bunches on the ropes (Lubin finish) [src: CBS].
- **Why exciting:** 22 KOs in 24, every fight a siege, and when he meets a puncher (Bohachuk) he trades and gets dropped and gets up.
- **Mind:** high initiative, moderate patience (works the body for rounds, does not rush the head). Composure under fire is real: up from two knockdowns (rd 1 retro-ruled, rd 8 left hook on the retreat) to rally and win [src: Ring, BoxingScene]. Killer instinct: once hurt opponents reach the ropes, he unloads right hands until the ref grabs them (Lubin, 1:30 rd 2) [src: CBS]. Adjusts slowly to awkward movers (took "a few rounds" to solve Madrimov) [src: snippet].
- **Flaws:** walks straight in; a fighter who measures with the jab and **steps back with a counter hook** catches him (Bohachuk rd 8) [src: BoxingScene]. Was known for a soft body defence early on [src: bloodyelbow, Hooker preview].
- **Library:** Hooker 2021 TKO 7 (out-jabbed him, KDs rd 6 and 7). Madrimov 2025 UD (solved the awkward guy). **Bohachuk 2024 MD (FOTY contender: down twice, 101-32 body edge)**. Lubin Nov 2025 TKO 2 (right hands on the ropes, ref holds Lubin up).
- **Brain knobs (est.):** output .70 jab .60 power .80 body .90 combo .65 initiative .80 patience .55 shell .45 slip .30 legs .35 clinch .20 composure .75 risk .60 killer .85 range .30 circle .25. Base **swarmer** leaning boxerpuncher; guard **standard**.

## 2. Sebastian Fundora ("the 6'6\" southpaw who fights in a phone booth")

**154, southpaw, "The Towering Inferno" [mem], PBC.** Status (2026-03-28): WBC 154 champion, 24-1-1 (16 KO) after TKO 6 of Keith Thurman [src: AP via news4jax].

- **Style:** the anti-tall man. Has a huge reach but often chooses mid and inside range, where his long uppercuts come up the middle [src: DAZN Tszyu II keys]. Mixes "sustained jab volume with the surprise of inside uppercuts" and uses his frame to crowd [src: WBN]. Standard-ish guard, upright, not much head movement (est.).
- **Output:** a volume giant. Tszyu I: **721 thrown vs 400**, 93 jabs landed vs 39 (60 thrown/rd, calc) [src: CBS]. Last six fights pre-Thurman: 20.4 landed/rd [src: Ring CompuBox corner]. Thurman: 96 landed vs 28, power 64-25, Thurman landed only 3 jabs [src: AP, Ring].
- **Signatures:** 1-1-2 to keep tall, then 5-6 / doubled lead uppercut "once he baits an opponent inside" [src: DAZN]. Long 2 down the pipe.
- **Why exciting:** a 6'6" man who wants to brawl. Fights turn bloody and close (Tszyu I, cut and nose bleeding everywhere), and he can be KO'd (Mendoza).
- **Mind:** high initiative, high work rate, accepts getting hit to land. Composure: fought Tszyu I with a broken nose spraying blood and won a split [mem]. Did not handle the Mendoza left hook (KO 7 while ahead) [src: Ring TV]. Finishes by accumulation and corner retirements (Lubin RTD 9, Tszyu II RTD 7) more than one-shot KOs.
- **Flaws:** chin is hittable when he stays inside; **left hook from a short orthodox fighter** ended him (Mendoza rd 7, a "picture-perfect left hook" then a right) [src: badlefthook, Ring TV]. Doesn't use his reach as much as he could.
- **Library:** Lubin 2022 TKO 9 (corner retired after a war, Fundora was down in rd 7 [mem]). Mendoza 2023 KO by 7 (ahead, then flattened). **Tszyu 2024 SD (bloody FOTY-type, 721 thrown)**. Tszyu II 2025 RTD 7 [src: snippet, conflicting rd 7/8]. Thurman 2026 TKO 6.
- **Brain knobs (est.):** output .85 jab .60 power .60 body .45 combo .70 initiative .80 patience .35 shell .30 slip .15 legs .40 clinch .30 composure .70 risk .70 killer .55 range .45 circle .25. Base **swarmer** (a tall one); guard **standard**. Note: give him a big reach stat and an uppercut-heavy inside diet so his "tall swarmer" identity shows.

## 3. Ryan Garcia ("the one-hook lottery ticket")

**147, orthodox, "KingRy", Golden Boy.** Status (2026-09-12): WBC welterweight champion, 26-2 (21 KO) after TKO 2 of Conor Benn (right hand KD at 0:45, stopped 1:25 rd 2) [src: AFP via Kuwait Times, GMA, Flashscore]. Won the vacant WBC belt from Mario Barrios 2026-02-21, UD 120-107, 119-108, 118-109 [src: AP/KSAT]. Called out Haney and Teofimo after the Benn fight [src: AFP].

- **Style:** long-to-mid range, hands-low-ish standard guard, fast feet, mostly a counter and lead-hand puncher. Lives off **hand speed and a check / counter left hook**. Vs Barrios he finally jabbed: career-high 82/271 jabs, total 185/539 (34%), 103 power, and held Barrios to 106/328 [src: Ring, CompuBox]. Vs Haney he threw only 285 in 12 (24/rd, calc) [src: Yahoo].
- **Signatures:** **3 counter (check left hook)** stepping back or sideways (Haney rd 7 and 11, Duarte rd 8 finish) [src: ESPN, Ring TV]. Overhand 2 (dropped Barrios in 25 seconds) [src: Ring]. 3b to the liver (stopped Campbell rd 7) [src: ESPN].
- **Why exciting:** any moment can end the fight. KDs both ways: dropped by Campbell, Tank and Romero; dropped Haney three times, Barrios, Benn.
- **Mind:** low output and low initiative for long spells ("hesitancy" vs Romero) [src: ESPN]. Waits for the one hook, then explodes. **Killer when he smells it** (Benn: KD then "punishing flurries"). Composure when hurt is mixed: got up vs Campbell and won; vs Tank he took a knee from a body shot and stayed down [src: CBS]; vs Romero went cautious after the rd-2 KD and lost [src: ESPN].
- **Flaws:** body (Tank's left to the body), low output lets busy fighters steal rounds, a high right hand kills his hook (Romero kept the right glove at the jaw and Garcia had no Plan B) [src: ESPN]. Off-ring discipline: Haney win overturned to NC after a failed test, missed weight [mem/src: news4jax].
- **Library:** Campbell 2021 TKO 7 (up from rd-2 KD, liver hook). Davis 2023 KO by 7 (body shot). **Haney 2024 MD→NC (three KDs rd 7, 10, 11)**. Romero 2025 L UD (dropped by left hooks rd 2). Benn 2026 TKO 2.
- **Brain knobs (est.):** output .40 jab .45 power .90 body .30 combo .45 initiative .35 patience .75 shell .25 slip .40 legs .65 clinch .30 composure .50 risk .55 killer .85 range .70 circle .50. Base **counter** (hook sniper); guard **handslow**.

## 4. Conor Benn ("the reckless bull who learned to jab")

**147–160, orthodox, "The Destroyer" [mem], Matchroom then Zuffa cards.** Status (2026-09-12): 25-2 after TKO 2 loss to Ryan Garcia, his first world title fight [src: AFP]. Before that, beat Regis Prograis UD 98-92 x3 (2026-04-11, 150 catchweight) [src: UFC.com]. History of adverse drug findings (2022–23) [mem].

- **Style:** all-in pressure, short range, explosive lunging 1-2s and hooks, standard guard, square stance when he charges (est.). Rematch with Eubank: "stepping in behind a firm jab, driving hooks into the body and then whipping quick one-twos upstairs" [src: ESPN/CBS].
- **Output:** Eubank I: 215/593 (36%), only **35 jabs landed** vs Eubank's 140 [src: Ring, Boxing News]. Eubank II: 173/426 (36/rd, calc), **49% power connect, body 70-15** [src: CompuBox via search]. Prograis: 126 more thrown, power landed 94-48 [src: Ring].
- **Signatures:** 1-2 behind a step-in (Prograis staggered end of rd 1) [src]. 1 then a **chopping 2 behind the ear** (two KDs of Eubank, rd 12) [src: CBS]. 3b-3 on the inside.
- **Why exciting:** sheer violence and nerve. Eubank I was a two-way war where he was outworked and kept coming; Eubank II was a 12th-round double knockdown to finish a feud.
- **Mind:** max initiative, risk-loving. Killer instinct: closes hard when he smells it (two KDs in the last round while already miles ahead). Adjusts between fights more than within them (Eubank I to II: from a lunging hooker to a jab-and-body plan) [src: ESPN]. Composure question: got blasted in 2 by Garcia's right hand while charging (est. from result).
- **Flaws:** wide and square when lunging, walks onto right hands; low jab volume when he goes emotional; head clashes and cuts (Prograis) [src]. Size questions moving between 147 and 160.
- **Library:** **Eubank Jr I 2025 L UD (FOTY candidate, 912 vs 593 thrown)**. Eubank Jr II 2025 W UD (two KDs rd 12, 119-107). Prograis 2026 W UD. Garcia 2026 L TKO 2.
- **Brain knobs (est.):** output .65 jab .40 power .85 body .65 combo .60 initiative .95 patience .20 shell .30 slip .25 legs .55 clinch .25 composure .55 risk .90 killer .85 range .25 circle .20. Base **slugger** (pressure); guard **standard**.

## 5. Isaac "Pitbull" Cruz ("the 5'4\" bowling ball")

**140, orthodox, Mexico City, Sean Gibbons / PBC.** Status (2026-09-19): interim WBC 140, 29-3-2 (19 KO) after KO 6 of Nestor Bravo (left hook, 1:30 left in rd 6), Pechanga Arena; called out Ryan Garcia, manager says not before 2027 [src: El Financiero, Grupo Animal, HollywoodLife]. Drew with Lamont Roach (MD draw, 2025-12-06) [src: SA Current, Ring].

- **Style:** short, thick, pure pressure from a low crouch with head movement on the way in (est., [mem]). Throws "in bunches", looping power from both sides, digs to the body in the clinch [src: ESPN, Fightful]. Lives on the inside; almost no jab.
- **Output:** Romero 2024: 121/319 in under 8 rounds (~42 thrown/rd, calc) [src: Kevin Iole]. Doesn't throw huge volume; every punch is a power shot (est.).
- **Signatures:** looping 2 (overhand right) to get in (hurt Romero in rd 1) [src: badlefthook]. **3 to the chin** as the finisher (Romero rd 8, Bravo rd 6) [src]. 3b-3 hook doubles, body shots in the clinch [src: Fightful].
- **Why exciting:** forward every second, always throwing to hurt, and he gave Tank Davis his hardest night on two weeks' notice.
- **Mind:** max initiative, little patience. Grows into fights. Body work in the middle rounds slowed Tank; when Tank's left hand went he "continued to press forward, throwing in bunches" [src: ESPN, Fightful]. Killer: pounces on any wobble. Composure: durable, never stopped [mem].
- **Flaws:** short reach, eats jabs and counters on the way in; loses rounds to a mover with a jab (Valenzuela 2024 L UD [mem]); arguments with refs about holding (Roach) [src: Ring].
- **Library:** **Davis 2021 L UD (short notice, took Tank to the wire with body pressure)**. Romero 2024 TKO 8 (WBA 140). Roach 2025 MD draw (disputed, Spence thought Cruz won) [src: Ring]. Bravo 2026 KO 6.
- **Brain knobs (est.):** output .65 jab .15 power .85 body .75 combo .60 initiative .95 patience .20 shell .55 slip .55 legs .45 clinch .40 composure .80 risk .80 killer .85 range .05 circle .25. Base **swarmer**; guard **peekaboo** (crouching, high and tight).

## 6. William "Camarón" Zepeda ("the 94-a-round volume machine")

**135, southpaw, Mexico, Golden Boy.** Status (2026-08-01): WBC lightweight champion, beat Lamont Roach Jr UD (118-110, 117-111 x2) at Virgin Hotels Las Vegas; CompuBox 218 landed to 153 [src: SI, Ring, NSAC results]. Record 34-1 (27 KO) per SI. Only loss: Shakur Stevenson UD 2025 [src]. Next: Jadier Herrera, late 2026 or early 2027 [src: Boxing Showtimes].

- **Style:** relentless forward pressure, mid range, standard guard, non-stop combinations up and down. Broke three CompuBox lightweight records vs Joseph Diaz (total thrown, jabs in a round, total jabs) [src: BoxingScene]. **Career ~93.5–93.9 thrown per round, the highest in boxing** [src: CBS, Ring].
- **Output:** Farmer I: 78 thrown / 26 landed per rd (259/778) [src: CompuBox]. Farmer II: 344/974 with **130 body landed** (38% of landed, calc) [src: BoxingScene]. Stevenson: 82 thrown / 23 landed, 272/979 (28%) [src: ESPN]. Pre-Stevenson last 11: 94 thrown / 31 landed per rd [src: CBS].
- **Signatures:** 1-1-2-3b-3 rolling combos, 2b-2 and right-hook doubles off the jab (est.). He sets traps with sheer number rather than one shot.
- **Why exciting:** never stops throwing; every round is 80+ punches; first Farmer fight had him dropped and coming back to win.
- **Mind:** maximum initiative and output, belief that volume breaks anyone. Learned after Stevenson: vs Roach he "used his feet", and Roach thought he was a "one-trick pony" and was "one step ahead of me" [src: SI, Ring]. Credits the layoff and the loss for the upgrade. Composure: got up vs Farmer, won SD [src: CompuBox].
- **Flaws:** volume without defence; elite counter-punchers land clean (Stevenson landed 52.5% on him) [src: fighters_a]. Hittable, so a puncher with timing (Farmer) can drop him.
- **Library:** Diaz 2022 W UD (three CompuBox records). Hughes 2024 RTD 4. Cabrera 2024 KO 3. **Farmer I 2024 SD (dropped, outworked him 78-59/rd)**. Stevenson 2025 L UD. Roach 2026 W UD (new, feet-first Zepeda).
- **Brain knobs (est.):** output 1.0 jab .65 power .55 body .75 combo .95 initiative .95 patience .20 shell .30 slip .25 legs .50 clinch .15 composure .80 risk .70 killer .65 range .35 circle .35. Base **swarmer** (volume); guard **standard**.

## 7. Serhii Bohachuk ("the long Ukrainian who trades everything")

**154, orthodox, Ukraine/Los Angeles, "El Flaco" [mem, unconfirmed].** Status (2026-05-10): lost TKO 6 to Shane Mosley Jr at Zuffa Boxing 06 (a right stiffened him, another big right dropped him, stopped on the ropes at 2:38) [src: Ring, Sky]. Earlier won SD 10 over Radzhab Butaev (2026-02-01, 96-94 x2) [src: Ring]. Record about 27-4 (24 KO); sources differ [snippet].

- **Style:** tall-ish pressure puncher, likes to work into the inside and trade "head and body blows in close quarters" [src: CBS]. "Built his name on pressure, volume and power" [src: Boxing Only]. Standard guard, upright.
- **Output:** vs Ortiz 225 landed, 143 power, out-landed Ortiz in rds 4, 6, 7, 10 [src: CBS]. Vs Brandon Adams: 836 body attempts, 220 body landed (huge body volume) [src: BoxingScene/snippet].
- **Signatures:** **1 then a step back with a 3 (left hook on the retreat)**: measured Ortiz with the jab, stepped back, Ortiz walked into the hook, KD rd 8 [src: BoxingScene]. Long 2 down the middle; 3b.
- **Why exciting:** high KO rate, fights whoever stands in front of him, and the Ortiz fight had two knockdowns plus a disputed decision.
- **Mind:** high initiative, high risk, trades shot for shot. Gets stuck on the ropes when hurt and doesn't hold (Mosley finish). Struggles against a jab-and-counter fighter who stops his advance (Mosley "consistently stalled" him) [src: Sky].
- **Flaws:** body defence and chin hold up only so long (Adams stoppage 2021, Mosley TKO 2026) [src]; rhythm breaks against a busy jab.
- **Library:** Adams 2021 L (first loss; sources conflict UD vs TKO 8). **Ortiz 2024 L MD (dropped Ortiz twice, FOTY contender)**. Butaev 2026 W SD. Mosley Jr 2026 L TKO 6.
- **Brain knobs (est.):** output .70 jab .55 power .80 body .75 combo .60 initiative .80 patience .35 shell .35 slip .20 legs .35 clinch .15 composure .50 risk .80 killer .75 range .45 circle .20. Base **slugger** (pressure); guard **standard**. Short card: little technical writing exists beyond the Ortiz fight.

## 8. Keith "One Time" Thurman ("the athlete who boxes, then hunts")

**147–154, orthodox, Clearwater FL, PBC.** Status (2026-03-28): lost TKO 6 to Sebastian Fundora (stopped on his feet, 1:17 rd 6, protested it was early), 31-2 [src: AP]. Only four fights since start of 2019 [src: Ring]. No later fight found.

- **Style:** boxer-puncher with athletic, bouncy feet, long range, jab and reflexes vs pressure (Porter used the ropes, Thurman jabbed and moved) [src: abc7]. Standard guard, hands lowish (est.). When behind he turns aggressor and walks down (Pacquiao middle rounds) [src: Philstar].
- **Output:** Pacquiao: 210/571 (36.8%), **power 192/433 (43%)**, most landed by any Pacquiao opponent in 43 tracked fights [src: ABS-CBN]. Last four fights pre-Fundora: 17.3 landed/rd [src: Ring]. Fundora: only 28 landed, 3 jabs [src: AP].
- **Signatures:** **3 (left hook)**, buckled Porter in rd 10 [src]. 1-2-3, a wide 4 when hunting [mem]. Lead hook counter off the back foot.
- **Why exciting:** 2015–17 Thurman: KO power at 147, a fight with Porter that had no knockdowns and still felt like a war, and a 12-round unification with Danny Garcia [mem].
- **Mind:** confident, likes to box early and hunt late. Composure: got up from a rd-1 KD vs Pacquiao and fought back to a split [src]; body shots hurt him (Porter rd 8, Pacquiao rd 10 liver shot) and he retreats to survive [src]. Long layoffs made his legs and timing fade [src: opinion].
- **Flaws:** **body**, especially left to the liver; long inactivity; a right after a body shot (Pacquiao rd 1: 2b then right to the head) [src].
- **Library:** **Porter 2016 W UD 115-113 x3 (classic, no KDs, two-way all night)**. Danny Garcia 2017 W SD (unification) [mem]. Pacquiao 2019 L SD (down rd 1, hurt rd 10, still landed 210). Fundora 2026 L TKO 6.
- **Brain knobs (est.):** output .50 jab .55 power .75 body .40 combo .55 initiative .55 patience .55 shell .30 slip .45 legs .65 clinch .25 composure .65 risk .55 killer .65 range .60 circle .55. Base **boxerpuncher**; guard **standard**.

## 9. Regis "Rougarou" Prograis ("the southpaw hunter") — RETIRED

**140 (last fought at 150), southpaw, New Orleans.** Status: **retired** after losing UD 10 to Conor Benn on 2026-04-11 (98-92 x3); finished 30-4 (24 KO) [src: Ring, badlefthook]. Said he fought injured [src: Ring]. Two-time 140 champion (WBA 2019, WBC 2022–23) [src]. Keep him as a "legend" template, not an active fighter.

- **Style:** southpaw stalker, mid range, high-ish standard guard, walks forward behind a probing right jab and an overhand left. Big body attack.
- **Output:** **vs Omar Cowart 113.6 thrown/rd: 67.9 jabs, 45.8 power**, 82 body landed [src: Ring TV]. Vs Jose Zepeda: 156/634 (25%) vs 66/381 [src: Dan Rafael]. Vs Haney: out-landed in every category except body [src: snippet].
- **Signatures:** **overhand 2 (left)**, dropped Flanagan rd 8 [src]. 1-2b, 3b right hook to the body, 2-3 on the inside (est.).
- **Why exciting:** his prime (2017–19) was a forward-moving southpaw KO artist; the Josh Taylor final (2019 L MD, WBSS) was a two-way 12-round war [mem].
- **Mind:** stalker with an edge; trash-talks and fights angry. Late finisher (KO 11 of Jose Zepeda) [src]. Composure fell off in the late career (Haney shut him out, Catterall and Benn outworked him) [src/mem].
- **Flaws:** a long jab and a quick, mobile defence nullify him; slower hands late in his career; lost to the faster, busier man every time (Taylor, Haney, Catterall, Benn) [mem].
- **Library:** Relikh 2019 TKO 6 (WBA) [mem]. **Taylor 2019 L MD (WBSS final war)**. J. Zepeda 2022 KO 11 [src]. Haney 2023 L UD. Benn 2026 L UD, retirement.
- **Brain knobs (prime, est.):** output .80 jab .70 power .75 body .70 combo .65 initiative .80 patience .45 shell .35 slip .35 legs .40 clinch .20 composure .65 risk .65 killer .75 range .40 circle .30. Base **boxerpuncher** (southpaw stalker); guard **standard**.

## 10. Oscar "La Migraña" Duarte ("the headache that keeps coming")

**135–140, orthodox, Parral, Chihuahua, PBC / Golden Boy.** Status (2026-05-02): beat Angel Fierro SD 12 at T-Mobile Arena (Fierro 3.4 lb over); cards 116-112, 116-112, 115-113 Fierro [src: Ring, BoxRec; PBC page conflicts]. Also beat Botirzhon Akhmedov on points (late replacement) [src: Boxing News]. Record about 28-2-1 (est., sources disagree); ~23 KOs, KO rate ~74% [snippet].

- **Style:** "high-pressure, aggressive, heavy hooks to body and head; rarely steps back unless badly hurt"; the **jab is a range-closer, not a set-up** [src: Boxing Showtimes]. Sits down on his punches [src: Ring TV].
- **Signatures:** 3b-3 doubles, 4 to the body, and short hooks inside after the jab closes the gap (est.).
- **Why exciting:** bloody, toe-to-toe fights (Madueno TKO 7 2025 was described as "bloody action") [src: badlefthook]; even in losses he walks forward.
- **Mind:** max initiative, low patience; keeps pressing even when behind. Composure when hurt: got up vs Ryan Garcia and protested the stoppage ("unfair, I got up") [src: ESPN]. Close fights go to the scorecards (Fierro, Akhmedov).
- **Flaws:** eats counter hooks coming in (Garcia's **check left hook**, KO 8 in 2023, though Duarte was landing body shots and Garcia was hearing boos) [src: ESPN, Ring TV]. Not much defence (est.).
- **Library:** Joseph Diaz 2024 TKO 9 [src]. **Ryan Garcia 2023 L KO 8 (pressure + body work, then the check hook)**. Madueno 2025 TKO 7. Fierro 2026 W SD.
- **Brain knobs (est.):** output .70 jab .30 power .80 body .80 combo .60 initiative .90 patience .25 shell .40 slip .30 legs .35 clinch .20 composure .70 risk .80 killer .75 range .15 circle .20. Base **slugger** (pressure); guard **standard**. Short card: little technical writing found.

## 11. Jesus "Mono" Ramos Jr. ("the southpaw body digger")

**154–160, southpaw, Casa Grande AZ, PBC.** Status: won the interim WBC 160 belt by UD over Shane Mosley Jr (2025-12-06, 117-111, 116-112, 117-111) [src: Ring]. Record 24-1 (19 KO) [src: PBC]. Scheduled vs Meiirim Nursultanov for the interim WBC 160, 2026-09-19 in San Diego (Cruz-Bravo co-feature); **no result found** [src: fightmag, Ring]. Wants full champ Carlos Adames [src: Ring].

- **Style:** southpaw, mid range, steady pressure with lateral movement; counters as the opponent settles; **lead (right) hook and body work** [src: Ring Mosley report].
- **Output:** vs Lubin: 145/499 (~42 thrown/rd, calc), **body landed 78 to 25** (54% of his landed went to the body, calc) [src: PBC/CompuBox]. Lost on jab volume: Lubin threw 378 jabs vs his 274 [src: Ring TV].
- **Signatures:** 2 (straight left) power shots, 3 counter (right hook), 2b-3b body work (est.).
- **Why exciting:** body-punching power and he trades; vs Mosley he got hurt in rd 4 and came back with a counter hook and body work [src: Ring].
- **Mind:** medium-high initiative, invests in the body; composure good after getting hurt (Mosley rd 4). Got out-jabbed and lost a close decision when he didn't pressure enough (Lubin 2023) [src].
- **Flaws:** takes hard right hands (Mosley "got his attention several times") [src]; low jab output lets jabbers steal rounds.
- **Library:** **Lubin 2023 L UD (78-25 body edge but lost on jabs)**. Mosley Jr 2025 W UD (interim WBC 160, hurt rd 4, rallied). Nursultanov 2026 (result not found).
- **Brain knobs (est.):** output .55 jab .40 power .75 body .85 combo .55 initiative .65 patience .55 shell .40 slip .35 legs .45 clinch .20 composure .75 risk .55 killer .65 range .40 circle .45. Base **boxerpuncher**; guard **standard**.

## 12. Keyshawn Davis ("the patient body-snatcher")

**140 (was 135), orthodox, Norfolk VA, "The Businessman" [mem], Top Rank.** Status (2026-05-16): 15-0 (10 KO) (+1 NC) after UD 12 over Nahir Albright in Norfolk (117-109, 118-108 x2) [src: Top Rank, WTKR]. 2026-01-31: TKO 12 of Jamaine Ortiz at MSG in his 140 debut (two body-hook KDs, stopped with 13 s left; out-landed 180-88) [src: Ring, ESPN]. Lost the WBO 135 title on the scales in 2025 [mem].

- **Style:** Olympic silver medallist (2021) [mem]. Patient stalker at mid range; doesn't over-commit early, "stalking and looking for his opportunities" [src: Kevin Iole]. Standard guard, sharp counters, Crawford in the corner shouting "go to the body" [src: ESPN].
- **Output:** vs Albright I: threw 94 fewer than Albright but landed 47 more [src: BoxingScene]. Accuracy over volume (est.).
- **Signatures:** **3b (left hook to the liver)**: Berinchyk dropped rd 3 and finished rd 4, Ortiz dropped twice [src]. Counter 6 (right uppercut) [src: Iole]. 2b-3b to fold them.
- **Why exciting:** clean, mean finishes, especially to the body, and the late stoppage of a durable man (Ortiz, 13 seconds left).
- **Mind:** patience first, then rising aggression once he has the read; killer late. Composure: "classic performance" despite a contentious fight week [src: Iole]. Gets bothered by in-and-out movers early (Berinchyk's jumping) [src: BoxingScene].
- **Flaws:** discipline outside the ring (weight); can be dragged into ugly, messy fights by a spoiler (Albright II "messy") [src: WTKR].
- **Library:** Pedraza 2024 TKO 6 [src: Boxing Only]. **Berinchyk 2025 KO 4 (body shots, WBO 135)**. Ortiz 2026 TKO 12. Albright II 2026 W UD.
- **Brain knobs (est.):** output .50 jab .60 power .75 body .85 combo .55 initiative .55 patience .75 shell .45 slip .55 legs .55 clinch .30 composure .80 risk .45 killer .80 range .55 circle .45. Base **counter** leaning boxerpuncher; guard **standard** (could use **philly** in a pinch, unconfirmed).

---

## Unidentified

None. All 12 names were identified. Note: "Oscar Duarte" is Oscar Duarte Jurado (Mexico, 140), not the footballer.

---

## Patterns: what makes these fighters exciting (rules a sim can use)

1. **Knockdowns both ways.** The most-discussed fights (Ortiz-Bohachuk, Garcia-Haney, Fundora-Mendoza, Zepeda-Farmer I) had a knockdown or a near-finish for *each* side, or the favourite got dropped and rallied. Rule: a fighter with high `risk` and only middling `shell` should both score and absorb KDs. Don't make high-power fighters near-impossible to drop.
2. **Trade willingness beats accuracy for excitement.** Zepeda's 94 thrown/rd and Fundora's 721-punch fight read as more exciting than Garcia's 24/rd, even though Garcia lands bigger. Rule: high `output` and low `patience` produce "action" rounds; pair low output with high `killer` for "lottery" fighters (Garcia) so the quiet stretches can end at any moment.
3. **The body is the slow fuse.** Ortiz (101-32 body landed), Zepeda (130 body landed), Ramos (78-25), K. Davis and Garcia's liver finishes. Body work early pays off with knockdowns late (rds 7–12). Rule: body landed should lower the opponent's legs and composure over rounds, and body KDs should cluster after round 6.
4. **The counter hook on the retreat is the swarmer killer.** Bohachuk vs Ortiz, Garcia vs Duarte, Mendoza vs Fundora: the pressure fighter walking straight in eats a left hook. Rule: low `circle` plus high `initiative` raises the chance of eating counter 3s; a `counter` fighter with high `killer` should look for exactly that shot.
5. **Comebacks and in-fight adjustment.** Ortiz up twice and still won; Garcia up vs Campbell to KO him with a liver hook; Zepeda went feet-first after losing to Stevenson. Rule: after being dropped, high-`composure` fighters should become *more* aggressive (rally), low-composure ones go cautious (Garcia vs Romero). Learning across fights matters too: Benn went from a lunging hooker (Eubank I) to jab-and-body (Eubank II).
6. **Finish style when the opponent is hurt.** Ortiz, Benn, Cruz and Garcia all flood the ropes with right hands until the ref steps in (TKOs with the man still standing: Lubin, Benn, Thurman). Rule: `killer` should drive a flurry state on a wobble, and refs should stop on-the-feet beatdowns, not only count out KDs.
7. **Volume swarmers lose to elite counters, sluggers lose to busy jabbers.** Zepeda beaten by Stevenson; Cruz by a mover with a jab (Valenzuela); Bohachuk and Ramos by jabs (Mosley, Lubin). Rule: these matchups should be stylistic, which keeps the style triangle honest.
8. **Big men who fight small are box-office.** Fundora (6'6", wants the inside) is fun because he ignores his reach. Rule: allow a "tall swarmer" (long reach, low `range` knob, high uppercut share) so builds don't all play to type.
