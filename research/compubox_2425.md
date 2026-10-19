# CompuBox 2024-2025 (Oct 19)

Method: final CompuBox counts for 75 fights (26 in 2024, 49 in 2025; 53 went the distance or drew, 22 stopped; 16 heavyweight), pooled per fighter per round, weighted by rounds fought. 25 of them have the full jab/power thrown split (21 from The Ring's CompuBox sheet images, 4 from Wikipedia/press), so jab and power numbers come from those 25 only. Stoppage time was used when found; if not, the stoppage round counts whole (slightly low rates). Stats are two fighters per fight, so 150 fighter lines.

## Summary

Per fighter per round. Jab and power rows come from the 25 fully split fights (their overall connect is 31.8%, a bit above the all-fight 29.6%, so scale jab/power connect down about 7% if you want them to match the totals). 2024 has only 3 fully split fights (Usyk-Fury 1, Paul-Tyson, Wardley-Clarke): treat that column as a hint.

| stat | 2024 | 2025 | both | Oct 2026 tally | sim target |
|---|---|---|---|---|---|
| fights / fighter-rounds | 26 / 522 | 49 / 959 | 75 / 1481 | 18 / 268 | |
| thrown | 47.0 | 43.4 | 44.7 | 52.2 | ~53 |
| landed | 13.3 | 13.2 | 13.2 | 13.6 | ~15 |
| connect % | 28.3 | 30.3 | 29.6 | 26.0 | ~29 |
| jab thrown | 17.6 (n=3) | 20.4 | 20.0 | 19.8 | 18.5 |
| jab landed | 4.3 (n=3) | 4.8 | 4.8 | 3.4 | 5.0 |
| jab connect % | 24.6 (n=3) | 23.7 | 23.8 | 17.2 | ~27 |
| power thrown | 17.1 (n=3) | 25.6 | 24.5 | 32.4 | 32.2 |
| power landed | 7.1 (n=3) | 9.8 | 9.4 | 10.1 | 10.1 |
| power connect % | 41.4 (n=3) | 38.1 | 38.4 | 31.3 | ~31 |
| jab share of thrown % | 51 (n=3) | 44 | 45 | 38 | 36 |
| body share of landed % | 22 (n=1) | 28 (n=21) | 28 (n=22) | 24.4 | ~24 |

Sim jab and power rows are from the audit in `research/numbers.md` section 1 (jab 18.5 a round at 27.3%; head power 22.0 at 29.0% plus body 10.2 at 36.0%, so power+body 32.2 thrown, 31% connect).

Spread between fighters (rounds >= 3): thrown median 43 (10th-90th pct 23-66); landed median 12 (5.7-22.7); connect median 30% (18-40%). Winner vs loser in the same fight (rounds >= 3): the winner lands a median 1.35x the loser (middle half of fights 1.09x to 2.08x).

Pooled with the Oct 2026 tally (1,749 fighter-rounds): thrown 45.8, landed 13.3, connect 29.0%, jab connect 21.4%, power connect 35.4%, jab share 42%.

## Splits

**Year** (n = fights)

| group | n | thrown/rd | landed/rd | connect % | n split | jab conn % | power conn % | jab % of thrown | body % of landed |
|---|---|---|---|---|---|---|---|---|---|
| 2024 | 25 | 47.0 | 13.3 | 28.3 | 3 | 24.6 | 41.4 | 51 | 22 |
| 2025 | 49 | 43.4 | 13.2 | 30.3 | 22 | 23.7 | 38.1 | 44 | 28 |
| both | 74 | 44.7 | 13.2 | 29.6 | 25 | 23.8 | 38.4 | 45 | 28 |

**Heavyweight vs the rest** (n = fights)

| group | n | thrown/rd | landed/rd | connect % | n split | jab conn % | power conn % | jab % of thrown | body % of landed |
|---|---|---|---|---|---|---|---|---|---|
| heavyweight | 16 | 40.1 | 12.7 | 31.7 | 6 | 25.9 | 42.8 | 48 | 22 |
| all other classes | 58 | 45.7 | 13.3 | 29.1 | 19 | 23.3 | 37.7 | 44 | 29 |

**Winners vs losers** (n = fighters; draws left out)

| group | n | thrown/rd | landed/rd | connect % | n split | jab conn % | power conn % | jab % of thrown | body % of landed |
|---|---|---|---|---|---|---|---|---|---|
| winners | 67 | 47.3 | 15.6 | 33.1 | 21 | 29.0 | 42.9 | 46 | 25 |
| losers | 67 | 41.9 | 10.9 | 26.0 | 21 | 18.1 | 33.7 | 45 | 34 |

**Decisions vs stoppages** (n = fights; draws are in decisions)

| group | n | thrown/rd | landed/rd | connect % | n split | jab conn % | power conn % | jab % of thrown | body % of landed |
|---|---|---|---|---|---|---|---|---|---|
| went the distance | 52 | 44.7 | 13.1 | 29.3 | 20 | 23.5 | 38.2 | 44 | 29 |
| stopped | 22 | 44.5 | 13.7 | 30.9 | 5 | 26.8 | 43.2 | 56 | 24 |

**Winners vs losers, by how the fight ended** (n = fighters)

| group | n | thrown/rd | landed/rd | connect % | n split | jab conn % | power conn % | jab % of thrown | body % of landed |
|---|---|---|---|---|---|---|---|---|---|
| stoppage winners | 22 | 50.3 | 17.5 | 34.7 | 5 | 42.4 | 54.7 | 49 | 19 |
| stoppage losers | 22 | 38.7 | 10.0 | 25.8 | 5 | 13.9 | 25.1 | 64 | 39 |
| decision winners | 45 | 46.5 | 15.1 | 32.6 | 16 | 27.7 | 41.9 | 46 | 26 |
| decision losers | 45 | 42.7 | 11.1 | 26.1 | 16 | 18.7 | 34.2 | 43 | 33 |

**By weight** (n = fights)

| group | n | thrown/rd | landed/rd | connect % | n split | jab conn % | power conn % | jab % of thrown | body % of landed |
|---|---|---|---|---|---|---|---|---|---|
| HW | 16 | 40.1 | 12.7 | 31.7 | 6 | 25.9 | 42.8 | 48 | 22 |
| 175-200 | 9 | 49.3 | 14.3 | 29.0 | 2 | 20.0 | 36.0 | 56 | 27 |
| 154-168 | 15 | 41.2 | 12.7 | 30.8 | 5 | 27.1 | 39.7 | 44 | 30 |
| 140-147 | 16 | 41.0 | 10.9 | 26.6 | 5 | 20.7 | 36.7 | 46 | 25 |
| 135 and lighter | 18 | 52.0 | 15.6 | 30.1 | 7 | 24.1 | 37.4 | 41 | 31 |

Read of the splits:
- **Year:** 2024 and 2025 look the same on totals (47 vs 43 thrown, 13.3 vs 13.2 landed). Not enough 2024 split fights to compare jab/power.
- **Heavyweight:** fewer thrown (40 vs 46), about the same landed (12.7 vs 13.3), so higher connect (31.7% vs 29.1%). Matches the PLOS heavyweight-title numbers in numbers.md (37.6 / 13.3 / 34.6%; jab connect 27.9%; power connect 42.4%): here jab connect 25.9% and power 42.8%.
- **Weight:** the 53 a round only shows up at 135 and lighter (52). Heavyweights and the 140 to 168 groups are all 40 to 41 thrown; 175-200 is 49 (9 fights). The 140-147 group lands the least (10.9) and connects lowest (26.6%).
- **Winners vs losers:** winners throw 13% more and land 43% more (15.6 vs 10.9; connect 33% vs 26%). The sim's single 15 landed is a winner's number; the average fighter lands 13. Losers' jabs connect at 18%, winners' at 29%.
- **Stoppages:** the stopped man lands 10 a round at 26%, the stopper 17.5 at 35% (power 55%, only 5 fights split). Stoppage fights are not busier overall (44.5 vs 44.7), just lopsided.
- **Body:** 28% of landed overall; heavyweights 22% (n=3 fights), 135 and lighter 31%. The stopped man takes the most body (39%), the stopper lands the least (19%). The median fighter's body share is 29% (44 fighters with a body count).

## Verdict (sim targets)

Hold:
- **Connect % (~29):** holds. All fights 29.6%, pooled with 2026 29.0%, median fighter 30%.

Move or watch:
- **Thrown (~53):** moves down. Real is 44.7 (45.8 pooled with 2026). The sim's 53 fits only the 135-and-lighter group (52). The gap is all power punches: real jabs thrown are 20.0 a round (sim 18.5) but power thrown is 24.5 (sim 32.2). In the 25 split fights, landed jabs (4.8) and landed power (9.4) are already close to the sim (5.0 and 10.1). A single number near 46 to 48 fits the field better; or make it depend on weight (HW 40, middles 41, lights 52). Output has also fallen since the 2009 CompuBox average (56): 2025 had record lows for a 12-rounder (Canelo-Scull 445 thrown in total, the lowest in CompuBox history; Garcia-Romero 490 and Haney-Ramirez 503 were the 4th and 6th fewest).
- **Landed (~15):** moves down to about 13. 15 is what winners land (15.6); losers land 10.9.
- **Jab connect (sim ~27):** moves down to about 21 to 24. This sample 23.8 (24.0 without Paul-Tyson), pooled with 2026 21.4%. Only heavyweights (25.9) and the 154-168 group (27.1) reach 26 or more. The 2026 tally said 17%; this sample says 24%; the truth for a normal card is between them.
- **Jab share of thrown (sim 36%):** moves up to about 42 to 45%. Real fighters throw almost as many jabs as power shots (45% here, 38% in 2026; 48% heavyweights; 56% in the few split stoppage fights).
- **Power connect (~31):** moves up. This sample 38.4% (37.7% non-heavy, 42.8% HW); the 2026 tally was 31.3%; pooled 35.4%. Winners 43%, losers 34%.
- **Body share of landed (~24):** a little low. This sample 28% (n=22 fights), 2026 24.4%. Hold at 24 to 28.
- **Winner/loser gap:** worth checking in the sim. Here the average winner lands 15.6 vs the loser's 10.9 (1.43x pooled; median fight 1.35x).

## Notes and conflicts between sources

- **Beterbiev-Bivol 1 (Oct 2024):** Wikipedia, talkSPORT, Teddy Atlas (BN24): Beterbiev 137/682, Bivol 142/423. The Sun: Bivol 141/417. Boxing247: Bivol 142/489, Beterbiev 137/474. Used 137/682 and 142/423. Wikipedia says Bivol power 64; 142 minus 58 jabs is 84 (talkSPORT), used 84.
- **Beterbiev-Bivol 2 (Feb 2025):** Wikipedia says Bivol 170 of 574. The Ring sheet adds to 547 (jab 334 + power 213). Used the sheet.
- **Taylor-Essuman:** the Ring text says Essuman 140 of 363; the sheet says 140/636 (22%). Used the sheet.
- **Foster-Fulton:** Boxing247 says Foster 191/466 and Fulton 56/280; the Ring sheet says 191/600 and 56/438. Used the sheet.
- **Haney-Ramirez:** Haney 70/223 or 224; Ramirez 30 (The Sun) or 40 landed. Used 70/224 and 40/279 (adds to the 503 combined thrown).
- **Garcia-Romero:** 65/207 and 54/267 (Boxing247) vs 65/210 and 57/280 (BN24). Used the second (adds to 490 combined).
- **Usyk-Fury 1:** BN24 has typos (Usyk "107", Fury "57"). Used 170/407 and 157/496 with the Wikipedia table (jab 48/147 and 62/286, power 122/260 and 95/210).
- **Ortiz-Bohachuk:** BN24 printed 265/732 and 225/817 once (percents did not match) and 265/747 and 225/832 once (percents match). Used the second.
- **Canelo-Crawford:** BN24 has two sets (Crawford 115/534 and Canelo 99/338; Crawford 165/558 and Canelo 132/465); Jabbr.ai gives 172/552 and 68/338. Wikipedia's CompuBox line (Crawford 115 landed, 45 jabs + 70 power; Canelo 99, 16 + 83) matches the first set. Used it.
- **Kabayel-Sanchez:** BN24 printed "64 of 577 ... 28%"; 28% implies 164. Used 164/577.
- **Eubank-Benn 1:** the Wikipedia table has jab thrown 356 and Benn jab 35/170; The Sun says 140/350 and 35/137 (matches the percents). Used The Sun.
- **Navarrete-Berinchyk:** Wikipedia gives Navarrete 128/612 and Berinchyk 127/732, but its own text says Navarrete threw the high volume. The two thrown figures may be swapped; kept as printed.
- **Left out (sources disagree too much):** Benavidez-Gvozdyk (Wikipedia 223 vs 163 landed; BN24 270/749 vs 223/675), Stevenson-De Los Santos (Wikipedia 65/205 vs 40/316; BN24 80/444 vs 40/287), Tellez-Baraou (214/745 vs 205/674, or 160/718 vs 130/666).
- **Landed only:** Taylor-Catterall 2 (Catterall 88 jabs + 88 power = 176; Taylor 60 + 102 = 162) has no thrown counts, so it is in the table but not in the averages.
- **Partial jab/power rows** (landed only, no thrown) are marked "J 42" without a slash; they are not in the jab/power averages.
- **Round fractions:** KO times found for Ford-Kholmatov (0:07 left in 12), Norman-Santillan (10th, 1:33), Bivol-Zinad (6th, 2:06), Opetaia-Nyika (4th, 2:17), Sheeraz-Berlanga (5th, 0:17), Usyk-Dubois 2 (5th, 1:52), Whyte-Itauma (1st, 1:59), Tsutsumi-Ashfaq (3rd, 2:08), Kabayel-Sanchez (7th, 2:29), Joshua-Paul (6th, 1:31 knockdown). Others (Ortiz-Lubin, Davis-Martin, Kabayel-Zhang, Charlo-LaManna, Wilder-Herndon, Espinoza-Vazquez, Parker-Wardley, Beterbiev-Smith) count whole rounds. Tszyu retired on his stool after round 7 (counted 7). Catterall-H. Eubank was stopped by cuts after 6 completed rounds (counted 6).
- **Weight classes** are mine from the fight billing (a few are best guess, e.g. Lapin-Edmondson, Cruz-Roach). Only HW vs rest uses them in the verdict; the weight table is a rough guide.
- **Odd bouts kept:** Paul-Tyson (Tyson 58, 8 rounds) is in; without it jab connect goes 23.8 to 24.0 and nothing else moves.
- Source reliability: The Ring sheets are CompuBox's own report images; Wikipedia lines cite CompuBox/BoxingScene; BN24/Boxing247/The Sun/talkSPORT are press recaps quoting CompuBox. BoxingScene and the old CompuBox API were not reachable.

## Per-fight table

Winner first. Cells are total landed/thrown, J = jab landed/thrown, P = power landed/thrown, B = body landed. A figure without a slash is landed only. Blank means not found. Rds = rounds actually fought (decimal = stoppage time found).

| date | fight | class | rds | result | side 1 | side 2 | source |
|---|---|---|---|---|---|---|---|
| 2024-01-13 | Beterbiev def. C.Smith | LHW 175 | 7 | TKO7 (time n/a) | Beterbiev: 182/471 | C.Smith: 59/366 | [1](https://en.wikipedia.org/wiki/Artur_Beterbiev) |
| 2024-02-03 | Lopez def. Ortiz | SLW 140 | 12 | decision | Lopez: 78/384 | Ortiz: 80/409 | [1](https://www.thesun.co.uk/sport/25823377/teofimo-lopez-tears-jamaine-ortiz-booing-crowd/) |
| 2024-03-02 | Ford def. Kholmatov | FW 126 | 11.96 | TKO12 (0:07 left) | Ford: 182/598 | Kholmatov: 200/728 | [1](https://www.boxing247.com/boxing-news/raymond-ford-scores-dramatic-12th-round-tko-over-otabek-kholmatov/275168) |
| 2024-03-08 | Ball vs Vargas (draw) | FW 126 | 12 | MD draw | Ball: 111/472 | Vargas: 118/536 | [1](https://en.wikipedia.org/wiki/Anthony_Joshua_vs._Francis_Ngannou) |
| 2024-03-08 | Parker def. Zhang | HW | 12 | MD | Parker: 101/349 · J 22 · P 79 | Zhang: 75/273 · J 35 · P 40 | [1](https://en.wikipedia.org/wiki/Anthony_Joshua_vs._Francis_Ngannou) |
| 2024-03-30 | Wardley vs Clarke (draw) | HW | 12 | SD draw | Wardley: 151/476 · J 66/231 · P 85/245 | Clarke: 157/469 · J 65/222 · P 92/247 | [1](https://talksport.com/boxing/1809924/fabio-wardley-vs-frazer-clarke-punch-statistics-fight/) |
| 2024-04-06 | Hitchins def. Lemos | SLW 140 | 12 | UD | Hitchins: 172/548 | Lemos: 161/696 | [1](https://www.boxingnews24.com/2024/11/liam-paro-promises-dog-fight-against-richardson-hitchins/) |
| 2024-04-20 | Garcia def. Haney | SLW 140 | 12 | MD (later NC) | Garcia: 106/386 · J 11 · P 95 | Haney: 87/586 · J 42 · P 45 | [1](https://www.boxingnews24.com/2024/12/haneys-comeback-shaking-off-the-garcia-loss/) |
| 2024-05-18 | Berinchyk def. Navarrete | LW 135 | 12 | SD | Berinchyk: 127/732 | Navarrete: 128/612 | [1](https://en.wikipedia.org/wiki/Emanuel_Navarrete) |
| 2024-05-18 | Norman def. Santillan | WW 147 | 9.52 | KO10 1:33 | Norman: 157/555 | Santillan: 113/396 | [1](https://en.wikipedia.org/wiki/Brian_Norman_Jr) |
| 2024-05-18 | Usyk def. Fury | HW | 12 | SD | Usyk: 170/407 · J 48/147 · P 122/260 | Fury: 157/496 · J 62/286 · P 95/210 | [1](https://en.wikipedia.org/wiki/Tyson_Fury_vs._Oleksandr_Usyk) |
| 2024-05-18 | Kabayel def. Sanchez | HW | 6.83 | KO7 2:29 | Kabayel: 164/577 | Sanchez: 81/318 | [1](https://www.boxingnews24.com/2024/11/kabayel-vs-zhang-heavyweight-war-set-for-february-22nd-in-riyadh/) |
| 2024-05-25 | Catterall def. Taylor | SLW 140 | 12 | UD | Catterall: 176 landed · J 88 · P 88 | Taylor: 162 landed · J 60 · P 102 | [1](https://talksport.com/boxing/1896114/josh-taylor-jack-catterall-punch-stats-controversial-rematch/) |
| 2024-06-01 | Bivol def. Zinad | LHW 175 | 5.71 | TKO6 2:06 | Bivol: 93/221 | Zinad: 42/352 | [1](https://en.wikipedia.org/wiki/Dmitry_Bivol) |
| 2024-06-15 | Davis def. Martin | LW 135 | 8 | KO8 (time n/a) | Davis: 79/178 | Martin: 81/270 | [1](https://en.wikipedia.org/wiki/Gervonta_Davis) |
| 2024-07-27 | Chisora def. Joyce | HW | 10 | UD | Chisora: 192/564 · J 29 · P 163 | Joyce: 211/835 · J 60 · P 151 | [1](https://en.wikipedia.org/wiki/Joe_Joyce_vs._Derek_Chisora) |
| 2024-08-03 | Crawford def. Madrimov | JMW 154 | 12 | MD | Crawford: 95/433 · J 40 · P 55 | Madrimov: 84/275 · J 19 · P 65 | [1](https://en.wikipedia.org/wiki/Terence_Crawford)<br>[2](https://talksport.com/boxing/1996000/terence-crawford-israil-madrimov-punch-stats/) |
| 2024-08-03 | Miller vs Ruiz (draw) | HW | 10 | MD draw | Miller: 183/514 | Ruiz: 113/355 | [1](https://en.wikipedia.org/wiki/Jarrell_Miller) |
| 2024-08-10 | Ortiz def. Bohachuk | JMW 154 | 12 | UD | Ortiz: 265/747 | Bohachuk: 225/832 | [1](https://www.boxingnews24.com/2024/12/madrimov-vs-bohachuk-fury-usyk-undercard-preview/) |
| 2024-10-12 | Beterbiev def. Bivol | LHW 175 | 12 | MD | Beterbiev: 137/682 · J 47 · P 90 · B 31 | Bivol: 142/423 · J 58 · P 84 · B 31 | [1](https://en.wikipedia.org/wiki/Artur_Beterbiev)<br>[2](https://talksport.com/boxing/2159775/artur-beterbiev-vs-dmitry-bivol-punch-stats-fight/)<br>[3](https://en.wikipedia.org/wiki/Artur_Beterbiev_vs._Dmitry_Bivol) |
| 2024-11-09 | Ennis def. Chukhadzhian | WW 147 | 12 | UD | Ennis: 224/730 | Chukhadzhian: 173/522 | [1](https://www.boxing247.com/boxing-news/ennis-vs-chukhadzhian-2-final-punch-stats/283907) |
| 2024-11-15 | Paul def. Tyson | HW | 8 | UD | Paul: 78/278 · J 31/179 · P 47/99 | Tyson: 18/97 · J 5/62 · P 13/35 | [1](https://www.boxingnews24.com/2024/12/mike-tyson-i-feel-kind-of-depressed/) |
| 2024-11-16 | Zepeda def. Farmer | LW 135 | 10 | SD | Zepeda: 259/778 | Farmer: 193/587 | [1](https://www.boxingnews24.com/2024/11/boxing-results-william-zepeda-defeats-tevin-farmer-by-split-decision/) |
| 2024-11-16 | Zurdo Ramirez def. Billam-Smith | CW 200 | 12 | UD | Zurdo Ramirez: 223/786 | Billam-Smith: 200/676 | [1](https://www.boxingnews24.com/2024/11/chris-billiam-smith-battered-the-cost-of-war-with-ramirez/) |
| 2024-12-21 | Usyk def. Fury | HW | 12 | UD | Usyk: 179/423 | Fury: 144/509 | [1](https://en.wikipedia.org/wiki/Oleksandr_Usyk)<br>[2](https://www.boxing247.com/boxing-news/fury-refuses-to-accept-usyk-loss/285222) |
| 2024-12-21 | Bohachuk def. I.Davis | JMW 154 | 6 | RTD6 | Bohachuk: 135/414 | I.Davis: 65/223 | [1](https://www.boxingnews24.com/2024/12/bohachuk-overwhelms-davis-with-power-punches/) |
| 2025-01-08 | Opetaia def. Nyika | CW 200 | 3.76 | KO4 2:17 | Opetaia: 74/208 | Nyika: 44/190 | [1](https://en.wikipedia.org/wiki/Jai_Opetaia) |
| 2025-01-25 | A.Cruz def. Salcido | LW 135 | 10 | UD | A.Cruz: 203/610 | Salcido: 53/474 | [1](https://www.boxingnews24.com/2025/01/boxing-results-andy-cruz-dominates-salcido-in-lopsided-decision/) |
| 2025-02-01 | Benavidez def. Morrell | LHW 175 | 12 | UD | Benavidez: 224/553 | Morrell: 165/601 | [1](https://en.wikipedia.org/wiki/David_Benavidez)<br>[2](https://www.boxingnews24.com/2025/02/morrells-power-puts-benavidez-down/) |
| 2025-02-22 | Bivol def. Beterbiev | LHW 175 | 12 | MD | Bivol: 170/547 · J 85/334 · P 85/213 · B 42 | Beterbiev: 121/688 · J 43/426 · P 78/262 · B 52 | [1](https://www.ringmagazine.com/news/dmitry-bivol-vs-artur-beterbiev-rematch-compu-box-punch-stats-3dvhTD39ByiJJp1MPg8pER) |
| 2025-02-22 | Kabayel def. Zhang | HW | 6 | KO6 (time n/a) | Kabayel: 171/346 | Zhang: 79/232 | [1](https://en.wikipedia.org/wiki/Artur_Beterbiev_vs._Dmitry_Bivol_II) |
| 2025-02-22 | Ortiz def. Madrimov | JMW 154 | 12 | UD | Ortiz: 166/561 | Madrimov: 127/466 | [1](https://www.boxingnews24.com/2025/08/a-win-by-ortiz-jr-on-november-8th-paves-the-way-for-a-massive-fight-announcement-with-ennis/) |
| 2025-03-01 | Davis vs Roach (draw) | LW 135 | 12 | MD draw | Davis: 103/279 · J 10/69 · P 93/210 · B 50 | Roach: 112/400 · J 25/148 · P 87/252 · B 32 | [1](https://www.ringmagazine.com/news/gervonta-davis-vs-lamont-roach-compu-box-punch-stats-6zYGr5BNmzdGZwO0etDsuP) |
| 2025-03-01 | Puello def. S.Martin | SLW 140 | 12 | SD | Puello: 150/526 | S.Martin: 162/441 | [1](https://www.boxingnews24.com/2025/03/tonights-live-results-davis-vs-roach-valenzuela-vs-russell/) |
| 2025-03-01 | Tellez def. J.Williams | JMW 154 | 12 | UD | Tellez: 180/502 | J.Williams: 106/399 | [1](https://www.boxingnews24.com/2025/03/tonights-live-results-davis-vs-roach-valenzuela-vs-russell/) |
| 2025-03-29 | Zepeda def. Farmer | LW 135 | 12 | MD | Zepeda: 344/974 | Farmer: 152/679 | [1](https://www.boxing247.com/boxing-news/william-zepedas-near-1000-punches-lead-to-majority-decision-victory-over-tevin-farmer-in-dominant-display/289149) |
| 2025-04-26 | Eubank def. Benn | MW (catchweight 157) | 12 | UD | Eubank: 367/912 · J 140/350 · P 227/562 | Benn: 215/593 · J 35/137 · P 180/456 | [1](https://www.thesun.co.uk/sport/34670980/chris-eubank-jr-conor-benn-scorecards-ai-judge-rematch/)<br>[2](https://www.boxingnews24.com/2025/04/how-chris-eubank-jr-s-mid-fight-style-change-neutralized-conor-benns-early-onslaught-and-secured-a-unanimous-decision-victory-in-london/) |
| 2025-05-02 | Haney def. Ramirez | SLW 140 | 12 | UD | Haney: 70/224 · J 25 · P 45 | Ramirez: 40/279 · J 23 · P 17 | [1](https://www.boxingnews24.com/2025/11/norman-sr-predicts-hitchins-will-avoid-brian-jr-after-haney-fight-hes-going-to-make-up-some-s/)<br>[2](https://talksport.com/boxing/3172975/devin-haney-jose-ramirez-worst-fight/) |
| 2025-05-02 | Romero def. Garcia | SLW 140 | 12 | decision | Romero: 57/280 | Garcia: 65/210 | [1](https://www.boxingnews24.com/2025/08/ryan-calls-out-teofimo-lopez-dismissing-shakur-stevensons-claim-to-the-fight/) |
| 2025-05-03 | Canelo def. Scull | SMW 168 | 12 | UD | Canelo: 56/152 · J 8 · P 48 | Scull: 55/293 | [1](https://talksport.com/boxing/3174933/canelo-alvarez-william-scull-boxing-punch-stats/)<br>[2](https://www.boxingnews24.com/2025/05/is-canelo-finished-crawford-poised-to-exploit-alvarezs-evident-decline-in-100-million-matchup/) |
| 2025-05-04 | Espinoza def. Vazquez | FW 126 | 7 | KO7 (time n/a) | Espinoza: 207/520 | Vazquez: 123/325 | [1](https://www.boxingnews24.com/2025/05/rafael-espinozas-output-tops-riyadh-times-square/) |
| 2025-05-24 | Taylor def. Essuman | WW 147 | 12 | UD | Taylor: 125/493 · J 8/224 · P 117/269 · B 38 | Essuman: 140/636 · J 25/228 · P 115/408 · B 47 | [1](https://www.ringmagazine.com/news/josh-taylor-vs-ekow-essuman-compu-box-punch-stats-40L0Zni7Ibg8GtrwT05YYI) |
| 2025-05-30 | Melikuziev def. Fulghum | SMW 168 | 12 | UD | Melikuziev: 169/407 · J 38/102 · P 131/305 · B 44 | Fulghum: 170/442 · J 62/183 · P 108/259 · B 33 | [1](https://www.ringmagazine.com/news/bektemir-melikuziev-vs-darius-fulghum-compu-box-punch-stats-5uUW7rsIbG1YHwiWgcAYmc) |
| 2025-05-31 | Resendiz def. Plant | SMW 168 | 12 | MD | Resendiz: 186/600 · J 77/306 · P 109/294 · B 51 | Plant: 108/509 · J 38/316 · P 70/193 · B 44 | [1](https://www.ringmagazine.com/news/armando-resendiz-vs-caleb-plant-compu-box-punch-stats-1avPYz19q55lr97AWwQWoe) |
| 2025-05-31 | Charlo def. LaManna | SMW 168 | 6 | TKO6 (time n/a) | Charlo: 67/210 | LaManna: 19/150 | [1](https://www.boxingnews24.com/2025/06/jermall-charlo-rockets-to-wba-2-in-super-middleweight-rankings/) |
| 2025-06-14 | Hitchins def. Kambosos | SLW 140 | 8 | stopped after R8 | Hitchins: 205/398 · J 118/233 · P 87/165 · B 19 | Kambosos: 57/384 · J 34/267 · P 23/117 · B 28 | [1](https://www.ringmagazine.com/news/richardson-hitchins-vs-george-kambosos-compu-box-punch-stats-YkCGZCJbyj8jOdE6BIJNs) |
| 2025-06-27 | Wilder def. Herndon | HW | 7 | TKO7 (time n/a) | Wilder: 59/457 | Herndon: 15/85 | [1](https://en.wikipedia.org/wiki/Deontay_Wilder) |
| 2025-06-28 | J.Rodriguez def. Griffin | WW 147 | 10 | KO10 (last seconds) | J.Rodriguez: 92/223 | Griffin: 94/342 | [1](https://www.boxingnews24.com/2025/06/tonights-live-results-jake-paul-vs-julio-cesar-chavez-jr-from-anaheim/) |
| 2025-06-28 | Ramirez def. Dorticos | CW 200 | 12 | UD | Ramirez: 224/620 | Dorticos: 190/616 | [1](https://en.wikipedia.org/wiki/Gilberto_Ram%C3%ADrez_) |
| 2025-07-05 | Cordina def. Quiroz | LW 135 | 10 | UD | Cordina: 146/498 · J 45/193 · P 101/305 · B 53 | Quiroz: 83/422 · J 9/133 · P 74/289 · B 39 | [1](https://www.ringmagazine.com/news/joe-cordina-vs-jaret-gonzalez-quiroz-compu-box-punch-stats-6Eoo9mhRIHY4s7xxRdp5vW) |
| 2025-07-05 | Catterall def. H.Eubank | WW 147 | 6 | tech UD (cuts) | Catterall: 51/186 · J 24/111 · P 27/75 · B 13 | H.Eubank: 17/85 · J 7/34 · P 10/51 · B 4 | [1](https://www.ringmagazine.com/news/jack-catterall-vs-harlem-eubank-compu-box-punch-stats-5S39F1SF97apVMe5OL8PIZ) |
| 2025-07-12 | Stevenson def. Zepeda | LW 135 | 12 | UD | Stevenson: 295/565 · J 96 · P 199 | Zepeda: 272/979 | [1](https://www.boxing247.com/boxing-news/stevensons-self-praise-on-x-triggers-fresh-cherry-pick-accusations/298741) |
| 2025-07-12 | Sheeraz def. Berlanga | SMW 168 | 4.09 | TKO5 0:17 | Sheeraz: 62/162 | Berlanga: 46/119 | [1](https://en.wikipedia.org/wiki/Hamzah_Sheeraz) |
| 2025-07-19 | Usyk def. Dubois | HW | 4.62 | KO5 1:52 | Usyk: 57/153 · J 21/75 · P 36/78 · B 9 | Dubois: 35/179 · J 11/104 · P 24/75 · B 8 | [1](https://www.ringmagazine.com/news/oleksandr-usyk-vs-daniel-dubois-compu-box-punch-stats-17KfFtp2FexK7jUcvcYebM) |
| 2025-07-19 | Lapin def. Edmondson | CW 200 (?) | 10 | MD | Lapin: 108/304 · J 48/162 · P 60/142 · B 31 | Edmondson: 78/223 · J 20/59 · P 58/164 · B 17 | [1](https://www.ringmagazine.com/news/daniel-lapin-vs-lewis-edmondson-compu-box-punch-stats-6VxhZSKkeOhIN8JScBbkrp) |
| 2025-07-19 | Fundora def. Tszyu | JMW 154 | 7 | RTD7 | Fundora: 152/596 | Tszyu: 72/204 | [1](https://www.boxingnews24.com/2025/07/boxing-results-fundora-dominates-tszyu-quits-in-seventh-after-brutal-bout/) |
| 2025-07-19 | Pacquiao vs Barrios (draw) | WW 147 | 12 | MD draw | Pacquiao: 101/577 · J 20 · P 81 | Barrios: 120/658 · J 45 · P 75 | [1](https://www.boxingnews24.com/2025/07/tonights-live-results-pacquiao-vs-barrios-and-fundora-vs-tszyu-2-from-las-vegas/)<br>[2](https://www.saddoboxing.com/87603-pacquiao-and-barrios-battle-to-a-draw.html) |
| 2025-08-16 | Itauma def. Whyte | HW | 0.66 | KO1 1:59 | Itauma: 19/34 · J 3/10 · P 16/24 · B 8 | Whyte: 2/12 · J 2/12 · P 0/0 · B 2 | [1](https://www.ringmagazine.com/news/dillian-whyte-vs-moses-itauma-compu-box-punch-stats-1OsQsJVTTO8QLVqiw79Bia) |
| 2025-08-16 | Ball def. Goodman | FW 126 | 12 | UD | Ball: 240/747 · J 76/262 · P 164/485 · B 48 | Goodman: 220/582 · J 84/292 · P 136/290 · B 91 | [1](https://www.ringmagazine.com/news/nick-ball-vs-sam-goodman-compu-box-punch-stats-6xraVhQwp3v5SyOrKYxr9x) |
| 2025-08-16 | Hrgovic def. Adeleye | HW | 10 | UD | Hrgovic: 228/510 · J 59/159 · P 169/351 · B 51 | Adeleye: 92/244 · J 45/125 · P 47/119 · B 16 | [1](https://www.ringmagazine.com/news/filip-hrgovic-vs-david-adeleye-compu-box-punch-stats-oy7BSvC5ga1K9rlU99lpT) |
| 2025-08-16 | Tsutsumi def. Ashfaq | SFW 130 | 2.71 | TKO3 2:08 | Tsutsumi: 53/96 · J 9/24 · P 44/72 · B 25 | Ashfaq: 21/66 · J 10/33 · P 11/33 · B 4 | [1](https://www.ringmagazine.com/news/hayato-tsutsumi-vs-qais-ashfaq-compu-box-punch-stats-3whFgI6uShIyE7HnrmpmlB) |
| 2025-08-23 | Rafferty vs Chamberlain (draw) | SLW 140 | 12 | MD draw | Rafferty: 202/761 · J 53/297 · P 149/464 · B 69 | Chamberlain: 287/952 · J 125/544 · P 162/408 · B 42 | [1](https://www.ringmagazine.com/news/jack-rafferty-vs-mark-chamberlain-compu-box-punch-stats-from-majority-draw-6dbpAEA6Y2WRIJSQf8WdMG) |
| 2025-09-13 | Crawford def. Canelo | SMW 168 | 12 | UD | Crawford: 115/534 · J 45 · P 70 | Canelo: 99/338 · J 16 · P 83 | [1](https://www.boxingnews24.com/2025/10/bernie-davis-claims-terence-crawford-beat-a-polished-canelo-alvarez-worse-than-floyd-mayweather-ever-did/) |
| 2025-09-14 | Inoue def. Akhmadaliev | SBW 122 | 12 | UD | Inoue: 141/585 | Akhmadaliev: 62/376 | [1](https://en.wikipedia.org/wiki/Naoya_Inoue) |
| 2025-10-11 | Makhmudov def. Allen | HW | 12 | UD | Makhmudov: 142/456 | Allen: 118/512 | [1](https://www.boxing247.com/boxing-news/too-big-too-strong-too-mean-russian-lion-arslanbek-makhmudov-mauls-dave-allen-over-12-brutal-rounds-in-england-boxing-results/297054) |
| 2025-10-25 | Wardley def. Parker | HW | 11 | TKO11 (time n/a) | Wardley: 166/437 | Parker: 132/393 | [1](https://en.wikipedia.org/wiki/Joseph_Parker) |
| 2025-11-08 | Ortiz def. Lubin | JMW 154 | 2 | TKO2 (time n/a) | Ortiz: 28/62 · J 3/21 · P 25/41 · B 8 | Lubin: 7/42 · J 4/24 · P 3/18 · B 5 | [1](https://www.ringmagazine.com/news/vergil-ortiz-jr-vs-erickson-lubin-compu-box-punch-stats-2X6w4h26R465DsDCUOjx6S) |
| 2025-11-15 | Benn def. Eubank | MW (catchweight 157) | 12 | UD | Benn: 173/426 · J 81/239 · P 92/187 · B 70 | Eubank: 68/365 · J 36/219 · P 32/146 · B 15 | [1](https://www.ringmagazine.com/news/chris-eubank-jr-vs-conor-benn-ii-compu-box-punch-stats-5wx01j1egScWOOvwVrVPCY) |
| 2025-11-22 | Haney def. Norman | WW 147 | 12 | UD | Haney: 70/271 | Norman: 59/399 | [1](https://www.boxing247.com/boxing-news/devin-haney-survives-normans-late-rally-after-twelve-rounds-of-smothering-clinches-to-claim-the-wbo-welterweight-title-boxing-results/298448) |
| 2025-11-22 | Mason def. Noakes | LW 135 | 12 | UD | Mason: 214/566 | Noakes: 156/613 | [1](https://www.boxingnews24.com/2025/11/boxing-results-abdullah-mason-survives-savage-noakes-assault-to-win-the-vacant-wbo-lightweight-title-in-riyadh/) |
| 2025-12-06 | Cruz vs Roach (draw) | SLW 140 | 12 | draw | Cruz: 159/544 · J 27/162 · P 132/382 · B 75 | Roach: 191/467 · J 49/176 · P 142/291 · B 26 | [1](https://www.ringmagazine.com/news/lamont-roach-vs-isaac-cruz-compu-box-punch-stats-2mqQyaXR6Z1fmICgCz58G3) |
| 2025-12-06 | Foster def. Fulton | SFW 130 | 12 | UD | Foster: 191/600 · J 90/351 · P 101/249 · B 28 | Fulton: 56/438 · J 25/270 · P 31/168 · B 21 | [1](https://www.ringmagazine.com/news/oshaquie-foster-vs-stephen-fulton-compu-box-punch-stats-4MwcG5DuXGPtGlYvojNBso) |
| 2025-12-19 | Joshua def. J.Paul | HW | 5.51 | KO6 1:31 | Joshua: 48/146 | J.Paul: 16/56 | [1](https://en.wikipedia.org/wiki/Anthony_Joshua) |
| 2025-12-27 | Inoue def. Picasso | SBW 122 | 12 | UD | Inoue: 328/790 · J 161/426 · P 167/364 · B 96 | Picasso: 170/485 · J 63/218 · P 107/267 · B 66 | [1](https://www.ringmagazine.com/news/naoya-inoue-vs-alan-picasso-compu-box-punch-stats-5G6mdzgIpQy2w7Mpks0Bkk) |
| 2025-12-27 | Nakatani def. Hernandez | SBW 122 | 12 | UD | Nakatani: 297/837 · J 71/355 · P 226/482 · B 54 | Hernandez: 273/921 · J 26/142 · P 247/779 · B 103 | [1](https://www.ringmagazine.com/news/junto-nakatani-vs-sebastian-hernandez-compu-box-punch-stats-kKoR6s2vwyU0NGtWWXdWZ) |
