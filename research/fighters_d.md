# Fighter DNA cards, batch D (feather to lightweight volume punchers and brawlers, plus three off-weight names)

Research for Last Bell's per-fighter AI knobs, from Ed's Reddit r/Boxing thread on "the most exciting active fighters". Researched 2026-10-13. In-game names will be altered.

**How this was gathered.** WebSearch summaries only (the proxy blocks most boxing sites). Tags: [src: site] = a search summary quoting that outlet; [snippet] = search text with no clear outlet; [mem] = model memory, not re-checked; (est.) = judgement; (calc) = my arithmetic. Status lines give the date of the latest fight found. Punch numbers: 1 jab, 2 cross, 3 lead hook, 4 rear hook, 5 lead upper, 6 rear upper, b = body. Southpaw "2" is the straight left. League reference: ~53–56 thrown, ~15–16 landed, ~29% per round.

Knob scale 0–1, 0.5 = league average. Knobs: output jab power body combo initiative patience shell slip legs clinch composure risk killer range circle (`range` high = prefers long range; `circle` high = moves laterally a lot).

---

## 1. Emanuel "Vaquero" Navarrete ("the windmill who wins the war of attrition")

- **Division / stance:** 130 (three-division champ: 122, 126, 130), orthodox, tall and rangy [mem].
- **Status:** 40-2-1 (33 KO). WBO + IBF 130 after TKO 11 of Eduardo Nunez, 2026-02-28, Glendale [src: boxingonly, geosuper]. Charly Suarez (WBO mandatory) mentioned as next; no result found [snippet].
- **Style:** Mid range, loose low guard, long arms. Awkward, looping, wide punches from odd angles, constant uppercuts, swinging hooks both hands [mem]. "Awkward style… patented volume punching to the head and body" [src: Dan Rafael via search].
- **Output (CompuBox):** vs Valdez I 2023: **1,038 thrown / 216 landed (20.8%)** = 87 thrown, 18 landed per round (calc); power 176/604 (58% of thrown is power, calc) [src: ringtv]. vs Dogboe II 2019: 314/884 (35.5%), 74/rd (calc) [src: badlefthook]. vs Suarez 2025: 98/366 landed over ~7 rds (calc ~52/rd) [src: compuboxdata via search]. Lands low % but throws 1.5x the league.
- **Signature:** 5 / 6 uppercuts up the middle in the pocket, wide 3-4 to head then 3b, long arm "slap" hooks; throws in bunches of 4–6 with no clear pattern (est.).
- **Why exciting:** Pure volume and chaos, gets hurt and comes back, wins by drowning people. Valdez I was a "throwback Mexican battle" [src: cbssports].
- **Mind:** High initiative, high risk, low defense. Takes shots to give more. Hurt → keeps swinging, spits mouthpiece, buys time [src: Wilson coverage]. Finishes by attrition, not one shot (most KOs come late: 9, 11) [src]. Adjusts little; outworks instead. Flaws: open to short straight counters and hooks (dropped by Liam Wilson's left hook), low accuracy, can be out-pointed by tidy boxers (lost SD to Berinchyk 2024, drew Conceição 2024) [mem].
- **Library:**
  - vs Liam Wilson 2023: dropped R4 by a left hook, hurt again R6, took over R7–8 with flurries, TKO 9 (long-count controversy) [src: Dan Rafael, newdaily].
  - vs Oscar Valdez I 2023: UD, 1,038 thrown, broke Valdez's eye, hurt his own right hand R9 and kept throwing it [src: cbssports, ringtv].
  - vs Valdez II 2024: TKO 6 [src: espndeportes].
  - vs Isaac Dogboe II 2019: TKO 12, 884 thrown [src: badlefthook].
  - vs Eduardo Nunez 2026: TKO 11, unifies 130 [src].
- **Knobs (est.):** output 0.95, jab 0.35, power 0.6, body 0.6, combo 0.9, initiative 0.85, patience 0.25, shell 0.3, slip 0.25, legs 0.5, clinch 0.2, composure 0.85, risk 0.85, killer 0.6, range 0.55, circle 0.3. **Base: swarmer. Guard: handslow.**

## 2. Nick Ball ("the 5'2" pocket wrecking ball")

- **Division / stance:** 126, orthodox, 5'2" [src: Ring via search]. Liverpool, Frank Warren.
- **Status:** 23-1-1. Lost WBA 126 to Brandon Figueroa, TKO 12 (0:32), 2026-02-07, Liverpool [src: fightmag, boxingshowtimes]. No later fight found.
- **Style:** Short, squat, crouched pressure fighter. Closes distance behind a high guard and bobbing head, then rips short hooks and overhand rights inside [mem + src]. Uses shoulder pushes to make space for the hook ("a push and a left" dropped Vargas) [src: ringtv].
- **Output (CompuBox):** vs Figueroa 2026: 249/567 (43.9%) = 23 landed of 52 thrown per round (calc, 11 rds), outlanded Figueroa in 10 of 11 rounds, but **took 177 power punches, the most any opponent landed on him** [src: boxingonly, Ring]. vs Goodman 2025: outlanded in 8 of 12 rds; Goodman hit him with 46.9% of power shots (136/290) [src: Ring]. So: accurate, average volume, very hittable.
- **Signature:** overhand 2, 3 to head and 3b, 2-3-2 in the pocket, push-then-3 (est.).
- **Why exciting:** The little guy marching through long-range champions and dropping them. Every fight becomes a phone-booth fight.
- **Mind:** High initiative, accepts damage to get inside. Struggles early vs long jabbers, wins middle rounds once inside (Vargas) [src: ringtv]. Killer when he sees wobbly legs (two knockdowns of Vargas, R8 and R11). Composure good, but he admits he "took too many hits" [src: Ring/Goodman]. Flaws: body and power counters while closing; fades into a war of attrition with a bigger volume puncher (Figueroa stopped him in R12).
- **Library:**
  - vs Rey Vargas 2024: split draw for WBC 126; struggled with the reach early, hurt Vargas R7, dropped him R8 and R11 [src: ringtv, wbcboxing].
  - vs Raymond Ford 2024: SD win, WBA 126 [mem].
  - vs Sam Goodman 2025: UD (117-111, 118-110, 115-113), close slugfest [src: Ring].
  - vs Brandon Figueroa 2026: winning on activity in most rounds, dropped twice and stopped in the 12th, the last round [src].
- **Knobs (est.):** output 0.6, jab 0.3, power 0.75, body 0.55, combo 0.6, initiative 0.85, patience 0.35, shell 0.6, slip 0.6, legs 0.45, clinch 0.3, composure 0.7, risk 0.7, killer 0.75, range 0.1, circle 0.25. **Base: swarmer. Guard: peekaboo.**

## 3. Raymond Ford ("Savage", "the 12th-round closer")

- **Division / stance:** 130 (ex-WBA 126), southpaw, Camden NJ [mem].
- **Status:** 18-2-1. Lost MD to O'Shaquie Foster for the WBC 130 title, 2026-05-30, Houston (118-110, 116-112, 114-114); Foster "took charge late" [src: ESPN, Wikipedia via search]. "I'll be back" [src: Ring].
- **Style:** Fast-handed southpaw boxer-puncher. Boxes at mid range, sharp counters, hand speed in short bursts. Can go long stretches at a quiet pace and then explode [mem, est.].
- **Signature:** straight left (2), lead hook (3) counter, 2-3-2 flurries late (est.).
- **Why exciting:** Last-second drama. Down on two cards, he stopped Kholmatov with **7 seconds left in round 12** [src: ringtv, boxingscene]. "I didn't know I was behind" [src: boxingscene].
- **Mind:** Medium initiative, saves his big bursts. Killer instinct once the opponent is hurt, whatever the clock says. Composure under fire: good. Flaws: lets rounds slip on low output, loses close cards (SD loss to Ball, MD loss to Foster), opponents win him by finishing stronger (Foster's late surge) [src].
- **Library:**
  - vs Otabek Kholmatov 2024: TKO 12 (2:53), trailing 106-103 on two cards, vacant WBA 126 [src: ringtv].
  - vs Nick Ball 2024: SD loss [mem].
  - vs O'Shaquie Foster 2026: MD loss, level until the late rounds [src].
- **Knobs (est.):** output 0.5, jab 0.5, power 0.6, body 0.4, combo 0.6, initiative 0.45, patience 0.6, shell 0.4, slip 0.6, legs 0.6, clinch 0.35, composure 0.75, risk 0.5, killer 0.85, range 0.6, circle 0.55. **Base: boxerpuncher. Guard: standard.**

## 4. Abdullah Mason ("the kid who'll trade with you")

- **Division / stance:** 135, southpaw, Cleveland, Top Rank. Very young champion (about 22) [mem].
- **Status:** 21-0 (18 KO), WBO 135. First defense: TKO 12 (0:45) of Albert Bell, 2026-07-04, Cleveland, two knockdowns in the last round; stoppage "somewhat controversial" [src: toprank, fightmag].
- **Style:** Fast, long southpaw. Boxes off the jab early, then gets drawn into, and wins, trades. Left uppercut a weapon [src: ESPN, Ring on Noakes].
- **Signature:** right jab then 2, left uppercut (6 for a southpaw) inside, 2-3 (est.).
- **Why exciting:** Talented boxer who chooses to slug. Dropped twice by Yohan Vasquez, got up and stopped him in round 2 [src: Ring]. Went to a "dogfight" with Noakes [src: Ring].
- **Mind:** Starts patient, becomes the aggressor from about round 4 [src: ESPN/Ring on Noakes]. Killer late: Noakes badly hurt R10, Bell stopped in R12. Composure when hurt: strong (Vasquez). Flaws: willing to stand in exchanges he doesn't need, can be dropped early.
- **Library:**
  - vs Yohan Vasquez: down twice, then stopped Vasquez R2 [src: Ring].
  - vs Sam Noakes 2025-11-22: UD (117-111, 115-113 x2) for vacant WBO; outslugged a body-pressure fighter [src: Ring].
  - vs Albert Bell 2026-07-04: TKO 12 with two knockdowns [src].
- **Knobs (est.):** output 0.6, jab 0.55, power 0.7, body 0.45, combo 0.65, initiative 0.6, patience 0.5, shell 0.35, slip 0.5, legs 0.6, clinch 0.3, composure 0.85, risk 0.65, killer 0.8, range 0.55, circle 0.45. **Base: boxerpuncher. Guard: standard.**

## 5. Rafael "Divino" Espinoza ("cruiserweight frame, minimumweight output")

- **Division / stance:** 126, orthodox, extremely tall for the weight (often given as 6'1"; not confirmed in search) [mem]. Guadalajara.
- **Status:** 28-0 (24 KO), WBO 126, fourth defense all by stoppage: Arnold Khegai stopped R10/11 (sources differ), 2025-11-15, San Luis Potosi [src: Ring, badlefthook]. Linked to a defense on an Inoue card; no 2026 result found [snippet].
- **Style:** Long range but **he doesn't box like a tall man: he swarms**. Endless straight 1-2s and long hooks, steps forward, punches in long bursts. "A fighter with the dimensions of a cruiserweight and the punch output of a minimumweight" [src: Ring].
- **Output (CompuBox):** vs Ramirez II 2024: **995 thrown / 222 landed** = 83/rd, 18.5 landed (calc); **120 thrown in round 12** [src: worldboxingnews via search]. vs Vazquez 2025: 223/875 over ~10 rds = ~88/rd [src: Ring]. vs Chirino: 38 of 83 landed in R4 [src]. Accuracy only ~22–25%.
- **Signature:** 1-2-1-2 strings, long 3 over the top, 2b-3 (est.).
- **Why exciting:** Constant noise. Nobody can match his volume, and it breaks people (all defenses by stoppage).
- **Mind:** Very high initiative, low patience. Upset Robeisy Ramirez by MD in 2023 after a late knockdown in R12 [src: ringtv, mem]. Finishes by accumulation. Flaws: hittable, low accuracy, defensively loose, plays into counterpunchers' timing (Ramirez landed clean early in fight 1) [mem].
- **Library:**
  - vs Robeisy Ramirez I 2023: MD, WBO title, big underdog, late knockdown [src: ESPN "stunning upset"].
  - vs Ramirez II 2024: TKO 6, 995 thrown [src].
  - vs Sergio Chirino 2025: TKO 4 [src: boxingnewsonline].
  - vs Edward Vazquez 2025: TKO 7 [src].
- **Knobs (est.):** output 1.0, jab 0.55, power 0.5, body 0.45, combo 0.9, initiative 0.9, patience 0.2, shell 0.3, slip 0.3, legs 0.55, clinch 0.15, composure 0.75, risk 0.7, killer 0.7, range 0.65, circle 0.3. **Base: swarmer (a long-range volume swarmer). Guard: standard.**

## 6. Brandon "Heartbreaker" Figueroa ("the 1,000-punch tall brawler")

- **Division / stance:** 126, orthodox (switches), tall for the weight, Texas [mem].
- **Status:** 27-2-1 (20 KO), WBA 126 after TKO 12 of Nick Ball, 2026-02-07 [src: Ring]. Three-time champion. No later fight found.
- **Style:** Tall man who fights like a short one. Leans in, smothers, works inside with both hands, doesn't use the jab much [src: Ring on Ball]. Stance switches inside [mem].
- **Output (CompuBox):** vs Fulton I 2021: **314/1,060 (30%)** = 88/rd (calc) [src: Dan Rafael via search]. vs Ball 2026: **214/757 (28.3%)**, 177 power landed, **94 body landed, more than half his power connects to the body** [src: Ring, boxingonly]. vs Nery 2021: 177/648 but only 11 body landed, and one of them, a left to the ribs, ended it in R7 [src].
- **Signature:** 4b-3 / 3b-3 hooks to the body, inside uppercuts, leaning 4s, the counted-out liver shot (3b) (est.).
- **Why exciting:** He loses most rounds on accuracy and still breaks you. Volume, body, and late stoppages.
- **Mind:** Max initiative, max pressure; patience = keep working until the other guy cracks. Composure good, he absorbs a lot. Killer late (Ball in R12). Flaws: low accuracy, gets hit a lot, beaten by movers who counter with uppercuts and clinch (Fulton twice: MD 2021, UD 2025, "movement and counterpunching… hard uppercuts and right-hand counters") [src: CBS, Ring].
- **Library:**
  - vs Luis Nery 2021: KO 7, delayed-reaction body shot [src: Dan Rafael].
  - vs Stephen Fulton I 2021: MD loss, Fight of the Year (CBS), 1,060 thrown [src].
  - vs Mark Magsayo 2023: UD win [mem].
  - vs Nick Ball 2026: behind on activity in most rounds, dropped Ball twice in R12, TKO [src].
- **Knobs (est.):** output 0.95, jab 0.2, power 0.65, body 0.85, combo 0.8, initiative 0.9, patience 0.4, shell 0.55, slip 0.25, legs 0.35, clinch 0.35, composure 0.8, risk 0.7, killer 0.7, range 0.15, circle 0.2. **Base: swarmer. Guard: high.**

## 7. Mark "Magnifico" Magsayo ("the Filipino right hand")

- **Division / stance:** 135 now (ex-WBC 126), orthodox, Cebu, Pacquiao comparisons [src: skysports].
- **Status:** 29-2 (19 KO). TKO 5 (corner stoppage) of Feargal McCrory in his lightweight debut, 2026-04-05, Zuffa Boxing, Las Vegas [src: mb.com.ph, inquirer]. Andres Cortes 2026-09-12 listed by one site, result not found [snippet].
- **Style:** Explosive, short bursts. Jab and counter right hand when it works; lunging 2 and 3 when it doesn't [src: CBS on Ceja]. Lots of time spent loading up (est.).
- **Signature:** counter 2 over the jab, 3 to the head, 2-3 (est.).
- **Why exciting:** One-punch power and comebacks. Behind on all cards vs Ceja, KO'd him in round 10 [src: CBS].
- **Mind:** Medium initiative, waits for counter right. Hurt → keeps looking for the bomb. Killer when he lands clean. Flaws: low output stretches, loses to busy or rangy boxers (SD loss Rey Vargas 2022, UD loss Figueroa 2023) [mem].
- **Library:**
  - vs Julio Ceja 2021: dropped Ceja R1, dropped by body shot R5, behind on all cards, KO 10 with two rights [src: CBS, spin.ph].
  - vs Gary Russell Jr. 2022: MD, WBC 126 title [mem].
  - vs Feargal McCrory 2026: nearly KO in R4, corner stops it R5 [src].
- **Knobs (est.):** output 0.45, jab 0.45, power 0.85, body 0.35, combo 0.45, initiative 0.5, patience 0.55, shell 0.45, slip 0.5, legs 0.45, clinch 0.3, composure 0.75, risk 0.6, killer 0.85, range 0.5, circle 0.4. **Base: boxerpuncher (power-counter lean). Guard: standard.**

## 8. Edwin De Los Santos ("La Grenada", "the patient southpaw bomb")

- **Division / stance:** 135, southpaw, Dominican [src].
- **Status:** 17-3. **KO'd in round 2 by Jose Valenzuela** in their rematch, 2026-06-28, Zuffa Boxing 8: hurt by a big left, finished with a right hook off the ropes [src: skysports, fightmag].
- **Style:** Counter-punching southpaw power. Hangs at mid range and waits for the straight left [src: boxingscene/Adorno]. When the opponent is just as careful, both sides freeze (vs Shakur 2023: ~3 landed per round from each side; see fighters_a card 1).
- **Signature:** straight left (2), right hook counter, 2 to the body (est.).
- **Why exciting:** Every exchange could end the fight. Short-notice knockout of Valenzuela in 2022 made his name [src: ringtv].
- **Mind:** Low initiative, high patience, high risk only when he sees the shot. Killer: finishes fast (Valenzuela I, R3). Flaws: can be too passive vs elite boxers (Shakur fight booed), and can be hurt himself (KO'd in R2 in the rematch).
- **Library:**
  - vs Jose Valenzuela I 2022: short-notice replacement, both southpaws, straight left drops him early in R3, TKO [src: ringtv].
  - vs Joseph Adorno: one-sided UD, the straight left "early and often" [src: boxingscene].
  - vs Shakur Stevenson 2023: UD loss for WBC 135, record-low output [src, fighters_a].
  - vs Valenzuela II 2026: KO'd in R2 [src].
- **Knobs (est.):** output 0.35, jab 0.4, power 0.85, body 0.35, combo 0.35, initiative 0.3, patience 0.8, shell 0.4, slip 0.5, legs 0.55, clinch 0.3, composure 0.5, risk 0.55, killer 0.8, range 0.6, circle 0.5. **Base: counter. Guard: handslow.**

## 9. Curmel Moton ("Mayweather's prodigy with Tank's pop")

- **Division / stance:** 130–135, orthodox (est.), very young (18–20), Mayweather Promotions [src: Ring].
- **Status:** 9-0 (7 KO). Last fight: RTD over Wilfredo Flores, 2026-02-28 (single listing site) [snippet]. Missed weight badly in late 2024 [snippet].
- **Style:** Speed, mobility, ring generalship and power; "knows when to press an advantage" (Schaefer) [src: Ring]. Style described as a blend of Floyd Mayweather and Tank Davis [snippet]. Expect a shoulder-roll-adjacent counter-puncher who explodes (est.).
- **Why exciting:** Quick knockouts, first-round stoppages early in his career [snippet]. Prodigy hype.
- **Mind:** Thin film. (est.): patient reader who flips into finishing mode on the first clean hurt shot.
- **Library:** Too early. Renny Viamonte UD 2025 (went the distance) [snippet]; Flores RTD 2026.
- **Knobs (est., low confidence):** output 0.5, jab 0.5, power 0.75, body 0.45, combo 0.6, initiative 0.5, patience 0.6, shell 0.6, slip 0.7, legs 0.7, clinch 0.3, composure 0.6, risk 0.5, killer 0.85, range 0.5, circle 0.6. **Base: counter. Guard: philly.**

## 10. Subriel Matias ("the body-breaking grinder")

- **Division / stance:** 140, orthodox, Puerto Rico [mem].
- **Status:** 23-3 (22 KO). Lost WBC 140 to Dalton Smith, stopped in R5 after a knockdown, 2026-01-10, while **ahead on two cards**; first KO loss [src: Ring]. No later fight found.
- **Style:** Inside pressure, constant body attack. Walks forward behind a tight guard and works the body in the corners [src: PBC, Ring].
- **Output:** vs Ergashev 2023: 108/317 (34%) over 5 rds = 63 thrown, 22 landed per round (calc); 71 power, 37 jabs; opponent 44/235 [src: PBC]. vs Ananyan II 2022: **59 body landed vs 12** [src: ringtv]. vs Puello 2025: 101 body landed (one unreliable source) [snippet].
- **Signature:** 5 / 5b left uppercut then 3b left hook to the body, 2b when looking for an opening [src: boxingscene, PBC]. Head-snapping 3 to finish (Ananyan) [src].
- **Why exciting:** He drains people. Most opponents quit on the stool (Ergashev corner stop, Ponce, Ananyan R9).
- **Mind:** Very high initiative; patient breaker, not a one-shot finisher. Hurt → walks through. Learns: avenged his Ananyan loss by going to the body from round 1 [src]. Flaws: hittable coming forward, out-pointed by slick movers (lost IBF to Liam Paro 2024 UD) [mem], and caught clean by a puncher counter-attacking (Dalton Smith).
- **Library:**
  - vs Petros Ananyan II 2022: TKO 9, revenge win, left hook knockdown at the end of R9 [src: ringtv].
  - vs Jeremias Ponce 2023: corner stoppage, IBF title [mem].
  - vs Shohjahon Ergashev 2023: RTD 5, body breakdown [src: PBC, boxingscene].
  - vs Alberto Puello 2025: MD, WBC title [src: Ring].
  - vs Dalton Smith 2026: ahead, then dropped and stopped R5 [src].
- **Knobs (est.):** output 0.7, jab 0.35, power 0.8, body 0.9, combo 0.7, initiative 0.9, patience 0.6, shell 0.65, slip 0.3, legs 0.35, clinch 0.3, composure 0.8, risk 0.65, killer 0.7, range 0.2, circle 0.2. **Base: slugger (pressure). Guard: high.**

## 11. Najee "Chino" Lopez (identified, but light heavyweight; obscure)

- **Who:** Atlanta light heavyweight (started at cruiser), ProBox Promotions, two-time US amateur champ, 200+ amateur bouts [src: boxingscene, ringtv]. 13-0 (10 KO) after a TKO 6 of ex-title challenger Lenin Castillo (2025) [src: boxingscene]. No 2026 fight found. Not in this weight band.
- **Style:** Little film coverage. A stoppage puncher with a deep amateur base (est.).
- **Knobs (est., very low confidence):** output 0.55, power 0.7, killer 0.7, others ~0.5. **Base: boxerpuncher. Guard: standard.** Confirm he's the guy Reddit meant before using.

## 12. Brandon "The Cannon" Adams ("the comeback counter-hooker")

- **Who:** 154, orthodox, Watts LA, won *The Contender* season 5 (2018) [src: tss]. 26-4 (16 KO) [src: Ring].
- **Status:** Pulled out of an IBF 154 eliminator vs Caoimhin Agyarko (Las Vegas, 2026-04-11) after he collapsed with chest pain and went to hospital [src: Ring, 2026-04-10]. Last fight: UD 10 over Serhii Bohachuk, 2025-09-13 [src].
- **Style:** Counters with lateral movement, left hook as the money punch; in the rematch he went inside and to the body from the first bell [src: 3kingsboxing, boxingonly].
- **Why exciting:** Late knockouts from behind. Down on all three cards vs Bohachuk, then left hook, left hook, KO 8 [src: frontproof].
- **Mind:** Patient, counter-first, and adjusts between fights (counter-mover → inside body puncher). Composure high.
- **Library:** Bohachuk I 2021 KO 8 from behind on the cards [src]; Bohachuk II 2025 UD [src]; Contender final 2018 [src].
- **Knobs (est.):** output 0.5, jab 0.45, power 0.65, body 0.55, combo 0.5, initiative 0.45, patience 0.65, shell 0.5, slip 0.55, legs 0.6, clinch 0.4, composure 0.85, risk 0.45, killer 0.75, range 0.5, circle 0.6. **Base: counter. Guard: standard.**

## 13. Simon Zachenhuber (168, German, a mover; hard to call "exciting")

- **Who:** 168, southpaw, Stuttgart, born 1998, ex-national-team kickboxer, turned pro in 2018 with no amateur boxing; *Let's Dance* semi-finalist 2021 [src: stuttgarter-zeitung, prisma]. 29-2 (18 KO) [src: Ring].
- **Status:** Lost a majority decision to WBO champ Hamzah Sheeraz, 2026-07-25, Jeddah (116-112, 115-113, 114-114); Ring: "unimpressive", "stylistic struggle", a "cautious southpaw" who moved and broke Sheeraz's rhythm [src: Ring, schwaebische]. Earlier 2026 loss on points to Pawel August in London, April [snippet; may be confused, verify].
- **Style:** Mobile, cautious southpaw who frustrates rhythm. Little volume (est.).
- **Knobs (est.):** output 0.4, jab 0.6, power 0.45, body 0.35, combo 0.4, initiative 0.3, patience 0.75, shell 0.4, slip 0.55, legs 0.8, clinch 0.45, composure 0.7, risk 0.3, killer 0.4, range 0.75, circle 0.8. **Base: outboxer. Guard: standard.**

---

## Unidentified / caveats
- **Najee Lopez**: found Najee "Chino" Lopez, Atlanta light heavyweight prospect (13-0 at last report). Fits the name but not the "feather to lightweight" band or "most exciting active" tier. Possible thread mix-up; card kept short.
- **Brandon Adams** (154) and **Zachenhuber** (168) are also outside the band. Adams is clearly the Contender winner; Zachenhuber's style isn't what fans usually call "exciting".
- Not found: CompuBox for Navarrete–Nunez, Mason–Noakes, Ford's fights, Matias–Smith.

## Patterns: what makes these fighters exciting (sim rules)

1. **Volume over accuracy is the fan engine.** Navarrete (87/rd), Espinoza (83–88/rd), Figueroa (88/rd) all land only 20–30% yet stop people. Rule: a fighter with output ≥1.5x league and connect ≤25% should still win by accumulation. Fatigue/damage must build from landed volume, not only clean power.
2. **Late stoppages are a signature, not luck.** Ford (R12, 7 s left), Figueroa over Ball (R12), Mason over Bell (R12), Navarrete (R9, R11), Adams (R8), Magsayo (R10). Rule: when the clock is short and the cards are close or lost, `killer` + `NEED` pushes output and risk up in rounds 10–12, and accumulated damage makes late knockdowns more likely than early ones.
3. **Comebacks after being dropped.** Navarrete (down R4, wins R9), Mason (down twice, wins R2), Magsayo (down R5, wins R10). Rule: high `composure` fighters answer a knockdown with more offense next round, not a shell. Low-composure fighters go into a shell.
4. **Trade willingness beats talent for fun.** Mason boxes, then chooses to slug from round 4. Rule: a `risk` knob that rises when the fighter lands and gets landed on (mutual damage → both raise output) creates wars.
5. **Volume pressure loses to movers who counter.** Figueroa lost twice to Fulton's movement, uppercuts and clinches; Matias lost to Paro; Navarrete lost/drew vs tidy boxers. Rule: swarmers need a real counter to lateral movement + uppercuts (high `circle`, high `clinch`), or the sim's volume monsters become unbeatable.
6. **Pressure fighters are hittable.** Ball took the most power shots of his career while winning rounds; Goodman landed 47% of power on him. Rule: closing distance should cost shots (counter windows), so crowd-pleasers trade damage both ways.
7. **Two careful punchers = dead fight.** DLS vs Shakur (~3 landed/rd). Rule: when both sides have high `patience` and low `initiative`, the sim needs something (ref warnings, crowd, corner shout) to force engagement, or the matchup is boring by design. That's realistic, but rare.
8. **Body work is the stoppage path for pressure fighters.** Figueroa (Nery liver shot KO, >50% of power connects to the body vs Ball), Matias (59 vs 12 body landed vs Ananyan). Rule: `body` + `initiative` high → corner retirements and late KOs.
9. **Height doesn't decide style.** Espinoza and Figueroa are tall swarmers; Ball is a 5'2" swarmer who beats tall boxers inside. Rule: keep style knobs independent of reach; a long-armed swarmer is valid and fun.
