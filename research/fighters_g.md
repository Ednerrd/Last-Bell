# Fighter DNA cards, batch G (Reddit "most exciting active fighters", batch 5)

Research for Last Bell's per-fighter AI knobs. Researched 2026-10-13. In-game names will be altered.

**How this was gathered.** WebSearch summaries only (no page fetches). Tags: [src: site] = from a search summary of that site, [snippet] = search-result text with unclear origin, [mem] = model memory, (est.) = judgement call. Aggregator pages (champinon.info, repost sites) were often stale or contradictory; where they disagree with Ring / Irish Times / Express & Star, the major outlet wins. Status lines are dated. Punch numbers: 1 jab, 2 cross, 3 lead hook, 4 rear hook, 5 lead upper, 6 rear upper, b = body.

Brain trait scale is 0-1, 0.5 = average pro.

---

## 1. Christian Mbilli ("the body-first freight train")
**168, orthodox [mem], "Solide".** Cameroon-born, raised in France, Rio 2016 Olympian, Montreal-based [src: boxingshowtimes, dazn].
**Status (2026-10):** 29-0-1 (24 KO), WBC super middleweight champion (interim, then elevated) [src: sportsnaut, badlefthook]. Last fight: split draw with Lester Martinez, 2025-09-13 (97-93 M, 96-94 Mbilli, 95-95) [src: ringmagazine]. Next: Canelo, Riyadh, 2026-10-31 (moved from a cancelled Sept 12 date) [src: boxinginsider, tapology].
- **Style:** short-to-mid range pressure, "physically imposing pressure fighter" [src: ringmagazine]. "A penchant for pounding the body with a left and raking across the jaw with a right" [src: dazn]. "Barreled in with a two-fisted attack that focused on the body and head" vs Derevyanchenko [src: tss]. Body work opens the "monstrous right uppercut" (Sulecki) [src: boxingnewsonline]. Signatures: 3b-6, 3b-2, 3b-3 (hook to body then to head; flush left hook KO'd Mohammedi [src: ringtv]). Body share high, ~30-35% of power (est.).
- **Volume:** vs Martinez CompuBox unofficial 273/787 (~79 thrown/rd over 10, 35%), Martinez 412/980 (42%) [src: ringmagazine]. So he throws a lot and also gets hit a lot.
- **Why exciting:** fast starts (Sulecki TKO1, June 2025), every fight is a body-punching siege, and he will stand and trade (Martinez was a Fight of the Night war) [src: worldboxingnews].
- **Mind:** high initiative, low patience. Starts fast and goes to the body from round 1 [src: ringtv]. Flaw: he loses exchanges to a matching volume puncher in the middle rounds. Martinez "began landing well in the middle rounds, pressuring Mbilli and matching his output" [src: lowkickmma]. His defense is a high guard while walking forward, which is leaky (est.).
- **Library:** Mohammedi 2022 KO5 (left hook) [src: ringtv]; Derevyanchenko 2024 UD (out-pressured a seasoned vet) [src: tss]; Sulecki 2025 TKO1 (interim WBC) [src: boxingnewsonline]; Martinez 2025 SD draw (all-action war) [src: ringmagazine].
- **Brain knobs (est.):** output .8, jab .3, power .8, body .85, combo .7, initiative .85, patience .25, shell .4, slip .35, legs .5, clinch .3, composure .65, risk .7, killer .8, range .3, circle .25. Base **swarmer**, guard **high**.

## 2. Aaron McKenna ("the Irish jab and switch")
**160, orthodox with stance switches, "The Silencer".** Irish (Monaghan), US-based since teenage years [src: irishtimes, the42].
**Status (2026-08-08):** 21-0 (10 KO), IBF middleweight champion. Beat Etinosa Oliha UD 118-110, 117-111, 116-112 at the 3Arena Dublin [src: ufc.com, irishtimes]. The belt was vacant after Alimkhanuly was stripped (meldonium) [snippet].
- **Style:** long-range boxer using height and reach. Vs Oliha "dominated much of the fight with his jab", with a slow start from the outside and "plenty of fighting in the clinch" [src: irishtimes]. Vs Liam Smith he boxed mostly on the back foot, "fleeting changes in stance from orthodox to southpaw" made him hard to lock onto, he snuck uppercuts through the guard, and he dropped Smith with "a pearler of a left hook to the body" in round 12 [src: the42]. Diet: jab-heavy (~45-50% est.), with a 3b and 5 as his finishers.
- **Why exciting:** honestly more of a slick technician than a banger (10 KO in 21). Fans like the stance switches, the body hook and the Irish-crowd big nights (est.).
- **Mind:** patient. He takes rounds 1-2 to read, then the jab takes over and grows late [src: irishtimes]. Composure is good: he ties up when crowded. He finishes with a body shot late rather than a head hunt. Flaw: slow starts, and a low KO rate means he can be dragged into clinch fights (est.).
- **Library:** Liam Smith 2025 UD 12 (KD with 3b in R12, 119-108) [src: the42]; Oliha 2026 UD 12 (IBF title in Dublin) [src: irishtimes].
- **Brain knobs (est.):** output .6, jab .75, power .45, body .55, combo .5, initiative .45, patience .7, shell .45, slip .55, legs .7, clinch .6, composure .75, risk .35, killer .5, range .75, circle .65. Base **outboxer** (boxerpuncher-lite), guard **standard**.

## 3. Conah Walker ("the late-rounds assassin")
**147, orthodox (est.; stance not confirmed in sources).** Wolverhampton. British welterweight champion [src: ringmagazine].
**Status (2026-05-02):** beat Sam Eggington TKO10 in Wolverhampton [src: expressandstar]. Next reportedly vs Alexis Rocha on Dec 5, a possible WBA eliminator (not confirmed official) [src: expressandstar].
- **Style:** mid-range pressure with a big overhand right, plus a counter left hook. Vs Liam Taylor he "came forward with hard shots", and a "picture-perfect counter-left hook" dropped Taylor [snippet]. His body left set up the Eggington finish: KD by a left to the body in R8, then "a series of right-hands" in R10 [src: expressandstar]. Signatures: overhand 2, counter 3, 3b.
- **Why exciting:** **the comeback KO.** Three straight big wins came from behind, late: Scarff TKO11 ("trailing widely ... right eye swollen, uncorked that overhand right") [src: boxingnewsonline], Pat McCormack KO12 in Monte Carlo [src: ringmagazine], and Eggington TKO10 while down two rounds on two cards [src: expressandstar].
- **Mind:** durable and keeps belief when losing on the cards. His power holds late, so he swings for the finish in the last third. He takes punishment early (cut and swollen eye vs Scarff). Flaw: he gets outboxed early by technicians and needs the KO; he lost a close UD to Lewis Crocker in 2024 (96-93, 96-93, 95-94; many felt he won) [src: 3kingsboxing].
- **Library:** Crocker 2024 L UD10 (disputed) [src: 3kingsboxing]; Scarff 2025 TKO11 (British + Commonwealth) [src: boxingnewsonline]; McCormack 2025 KO12 [src: ringmagazine]; Eggington 2026 TKO10 (KD R8 body, stoppage R10) [src: expressandstar].
- **Brain knobs (est.):** output .6, jab .4, power .75, body .6, combo .5, initiative .6, patience .5, shell .5, slip .4, legs .45, clinch .4, composure .9, risk .65, killer .85, range .45, circle .35. Base **boxerpuncher** (slugger lean), guard **standard**. Special: gets more dangerous as he falls behind late (see Patterns).

## 4. Troy Williamson ("the overhand-right underdog")
**168 (moved up from 154), orthodox [mem], "Trojan" [src: betfred].**
**Status (2026-08-08):** lost the rematch to Callum Simpson by UD (116-112, 117-112, 115-113) in Leeds, giving back the British and Commonwealth belts [src: thestar, boxingshowtimes]. He was 22-4-1 (16 KO) after the first Simpson fight [src: ringmagazine].
- **Style:** a puncher who hunts the overhand right over the jab. Vs Simpson he "tried to test his chin early with his overhand right time and time again", throwing the right over Simpson's jab at range [src: ringmagazine]. Inside he is less comfortable: "Simpson looked more comfortable when the two were in close" [src: ringmagazine]. Signatures: overhand 2 over the opponent's 1, then 2-3-2 when they're hurt.
- **Why exciting:** wars and a savage finishing burst. He dropped Simpson **four times** in round 10 for a TKO upset as the underdog (2025-12-20) [src: ringmagazine]. He also stopped Cheeseman in a "brutal war" (2021, R10) and Mark Dickinson in R9 [src: badlefthook, boxingnewsonline].
- **Mind:** he commits to one weapon and keeps going to it until it lands ("manifested" the KO for months [src: ringmagazine]). His killer instinct is extreme once one lands. Flaw: one-dimensional. A high-volume opponent who won't let him build momentum beats him on points (the Simpson rematch, where Simpson had a new trainer, Rob McCracken) [src: thestar].
- **Library:** Cheeseman 2021 TKO10 (war) [src: 3kingsboxing]; Dickinson 2025 TKO9 [src: boxingnewsonline]; Simpson I 2025 TKO10 (4 KDs, three titles) [src: ringmagazine]; Simpson II 2026 L UD [src: thestar].
- **Brain knobs (est.):** output .55, jab .35, power .8, body .4, combo .45, initiative .6, patience .45, shell .45, slip .4, legs .45, clinch .35, composure .7, risk .7, killer .9, range .5, circle .3. Base **slugger**, guard **standard**.

## 5. Ted Cheeseman ("the British war machine")
**154, orthodox [mem].** Bermondsey, London. Former British super-welter champion.
**Status:** no 2024-26 fight found. The last found bout is the TKO10 loss to Troy Williamson, 2021-10-09 [src: badlefthook, champinon]. Treat as inactive or unknown; the Reddit "active" tag may be stale.
- **Style:** a come-forward, high-work-rate brawler who will trade for 12 rounds. He beat Eggington in "an all-out war ... twelve relentless rounds of back and forth action" (116-113, 116-113, 115-114, 2020) [src: ringtv, 3kingsboxing]. Beat James Metcalf by KO11 in an "old school war" to regain the British title (2021, Gibraltar) [src: boxingwriter]. Punch diet: mostly hooks and body at mid-short range (est.).
- **Why exciting:** guaranteed Fight of the Year contenders, and he wins late in long wars.
- **Mind:** maximum grit. His career comeback after a gambling addiction [src: dazn] went straight into the Eggington war. Flaw: he absorbs a lot, and a puncher eventually breaks him late (Williamson R10). He also lost close decisions to sharper boxers (Fitzgerald 2019 UD, Sergio Garcia 2018) [src: southwarknews].
- **Library:** Fitzgerald 2019 L UD (British title) [src: southwarknews]; Eggington 2020 UD (war) [src: ringtv]; Metcalf 2021 KO11 [src: boxingwriter]; Williamson 2021 L TKO10 [src: badlefthook].
- **Brain knobs (est.):** output .75, jab .35, power .6, body .65, combo .65, initiative .75, patience .3, shell .45, slip .3, legs .4, clinch .35, composure .8, risk .75, killer .6, range .3, circle .25. Base **swarmer**, guard **high**.

## 6. Ben Whittaker ("the showman")
**175, orthodox [mem], "The Surgeon" [mem].** Tokyo 2020 Olympic silver [src: skysports].
**Status (2026-10-03):** 13-0-1. Beat Conor Wallace UD (117-111, 116-112, 115-113) in an IBF light-heavyweight final eliminator in Birmingham, making him mandatory for Bivol [src: boxingnews, irishtimes]. He was dropped by a straight left in R12; it was ruled a slip, and Wallace was "a punch or two from winning" [src: expressandstar, vavel]. 2026 also brought a TKO1 of Braian Suarez (Apr) and a TKO of Richard Rivera on his US debut (June) [src: geosuper, champinon].
- **Style:** fast hands with the lead hand low, upper-body feints and shimmies, pull counters. "Quick hands, flashy combinations and stiff jab" [src: skysports/ringtv]. He rocked Cameron with a right pull counter, then chased him to the ropes and finished [src: boxingonly]. Signatures: pull-2, 1-2-3, and a showboat feint into the 2.
- **Why exciting:** the showboating (shuffles, taunts, hands down) plus real knockout speed. Fans tune in to see him either make someone look silly or get caught.
- **Mind:** confident, sometimes lazy. He admitted "it was too easy ... I got lazy and got hit with a lucky shot" vs Wallace [src: boxingnews]. Killer instinct is high once his opponent is hurt (Cameron 2 TKO2, Suarez TKO1). Flaws: switches off and coasts, and gets timed by awkward or veteran opponents (Cameron I was a draw after both fell through the ropes in R5/6) [src: si, skysports]. Showboating opens counter windows.
- **Library:** Cameron I 2024 draw (fell through the ropes) [src: skysports]; Cameron II 2025 TKO2 (pull-counter right) [src: expressandstar]; Suarez 2026 TKO1 [src: geosuper]; Wallace 2026 UD (survived a late scare) [src: irishtimes].
- **Brain knobs (est.):** output .6, jab .6, power .6, body .35, combo .7, initiative .5, patience .5, shell .35, slip .75, legs .7, clinch .3, composure .55, risk .7, killer .8, range .6, circle .55. Base **counter** (boxerpuncher hybrid), guard **handslow**. Special: a "showboat" state that lowers output and guard when far ahead.

## 7. Richard Riakporhe ("the one-right-hand cruiser")
**Cruiser, now heavyweight; orthodox [mem]; tall and long.** London.
**Status (2026-04-11):** 20-1. Won the British heavyweight title, stopping Jeamie Tshikeva TKO5 (2:12) at Tottenham Hotspur Stadium, making him a two-weight British champ [src: boxingonly, champinon]. His only loss was a UD to Chris Billam-Smith for the WBO cruiser title, 2024-06-15 [src: expressandstar].
- **Style:** a rangy boxer-puncher. Patient early with "footwork and a long jab", then "height, length, and shocking power in his right hand" [src: boxinginsider]. Glowacki was finished by a left to the body followed by a right upstairs, R4 [src: badlefthook]. Welch was dropped twice by "a massive right", which put him "flat under the bottom ropes", R2 [src: 3kingsboxing]. Signatures: 1-2, 3b-2, single 2.
- **Why exciting:** **one-punch power.** Headlines read "finishes yet another opponent with one punch" [src: boxingnewsonline]. His KOs are sudden.
- **Mind:** patient-then-explode. Low output and waits for the right. Flaw: when the right doesn't land, a busier, cagier opponent outworks him over 12 (the Billam-Smith rematch loss) [src: expressandstar]. He beat CBS the first time (2019 SD) [mem].
- **Library:** Billam-Smith I 2019 SD W [mem]; Glowacki 2023 TKO4 [src: badlefthook]; Billam-Smith II 2024 L UD [src: expressandstar]; Welch 2025 TKO2 (2 KDs) [src: ringmagazine]; Tshikeva 2026 TKO5 [src: boxingonly].
- **Brain knobs (est.):** output .4, jab .55, power .9, body .45, combo .35, initiative .45, patience .7, shell .5, slip .35, legs .5, clinch .45, composure .6, risk .5, killer .85, range .7, circle .4. Base **boxerpuncher**, guard **standard**.

## 8. Jake Paul ("the overhand-right celebrity")
**Cruiser/heavyweight, orthodox, "The Problem Child".**
**Status:** last fight was a loss to Anthony Joshua by KO6 in Miami, 2025-12-20, with four knockdowns and a jaw broken in two places [src: expressandstar, bernama]. No 2026 bout found.
- **Style:** a power-first stalker with a high guard, built around a looping overhand right; a "reliance on power punches" with "limitations in defensive boxing" [snippet]. Vs Tommy Fury, Fury's jab kept him out of range for the right (CompuBox Paul 49/157 31%, Fury 88/302) and Paul's knockdown came from a jab in R8 [src: danrafael, boxingscene]. Vs Diaz he had 202 jabs thrown and 48% power connect [src: boxingscene]. Vs Chavez Jr he used the jab and body work [snippet]. Signatures: 1-2 (overhand), 2b, single overhand 2 counter.
- **Why exciting:** spectacle. Big-name opponents and highlight one-punch KOs of non-boxers (Woodley 2021, Perry 2024 TKO6 [mem]). He is now also a KO victim. For a sim this is a "low-skill puncher" archetype.
- **Mind:** front-runner. Fine when he can walk forward. Vs Joshua he tried to "use the whole ring with agile movement" and kept tumbling when AJ closed [src: anglocelt/expressandstar]. Low skill ceiling, low defense; composure breaks against real size.
- **Library:** Woodley II 2021 KO6 [mem]; T. Fury 2023 L SD [src: danrafael]; Diaz 2024 UD [src: boxingscene]; Tyson 2024 UD [mem]; Joshua 2025 L KO6 [src: expressandstar].
- **Brain knobs (est.):** output .45, jab .45, power .75, body .4, combo .35, initiative .55, patience .5, shell .55, slip .25, legs .4, clinch .5, composure .4, risk .5, killer .7, range .5, circle .3. Base **slugger**, guard **high**. Ring IQ low (an "amateur-level" sheet).

## 9. Alycia Baumgardner ("the counter bomb")
**130 (women), orthodox [mem], "The Bomb" [mem].**
**Status (2026-04-17):** unified WBA/WBO/IBF super featherweight champion, ~18-1 (7 KO) +1 NC. Beat Bo Mi Re Shin UD (98-92, 98-92, 99-91) at MSG Theater [src: geosuper].
- **Style:** "almost strictly a counter-puncher" with "elite head movement" [snippet, tpf]. Power from the counter right and the right uppercut. Vs Shin in R4 she threw "a sizzling right uppercut followed by a quick left hook and a right cross" (6-3-2) [src: tpf]. Vs Harper she "pounced on a lazy left hand with a perfect counter right to the jaw", and Harper was out on her feet, R4 [src: ringtv]. Signatures: counter 2 over a lazy 1, 6-3-2, overhand 2.
- **Why exciting:** knockout-level counter shots in women's boxing, where stoppages are rare; title-unifying upsets.
- **Mind:** patient reader who waits for a lazy jab and then explodes. Composure was tested vs Shin: rocked in R3 "for the first time in memory", answered with her best round in R4 [src: tpf]. Flaw: low volume lets jab-first boxers steal rounds (Mayer controlled early rounds, close disputed SD 2022) [src: ringtv].
- **Library:** Harper 2021 TKO4 (counter right, WBC title) [src: ringtv]; Mayer 2022 SD (unification, disputed) [src: ringtv]; Shin 2026 UD (rocked R3, rallied R4) [src: geosuper, tpf].
- **Brain knobs (est.):** output .45, jab .45, power .75, body .35, combo .55, initiative .35, patience .75, shell .5, slip .75, legs .55, clinch .35, composure .75, risk .45, killer .7, range .5, circle .5. Base **counter**, guard **standard**.

## 10. Manny Pacquiao (legend reference: career-defining traits only)
**Southpaw, 112 to 154 (8 divisions) [mem], "PacMan".**
**Status:** returned in 2025 at 46 for a majority draw with Mario Barrios (WBC 147), 2025-07-19 [src: ringmagazine]. A 2026 return was talked about (Jan 24 Las Vegas); no result found [src: dazn, gulfnews].
- **Style:** explosive in-and-out blitzer from odd angles. He leaps in with the straight left (2), steps off to his right (outside the orthodox lead foot) and fires again [mem]. Signatures: 1-2 (right jab, straight left), 2-3, 3-2-3, the double straight left, uppercuts in the pocket. Prime output was very high (est. 60-80 thrown per round [mem]). At 46, vs Barrios: 577 thrown (48/rd), 17.5% connect, power 81/259 [src: ringmagazine]. He still out-landed Barrios on power but faded: Barrios won rounds 10-12 on every card [src: ringmagazine].
- **Why exciting:** speed plus volume plus power from southpaw angles; violent stoppages of greats (Barrera, Morales, Hatton, Cotto); swinging trilogy wars (Marquez).
- **Mind:** aggressive and joyful. He keeps the initiative, throws in bunches and switches angles constantly (Roach). Killer instinct is extreme in his prime. Flaw: he leaped in with his chin exposed. Marquez timed the entry and KO'd him with a counter right in 2012 R6 [mem]. In later years he was more selective (est.).
- **Library:** Barrera I 2003 TKO11 [mem]; Morales II 2006 TKO10 [mem]; Hatton 2009 KO2 (left hook) [mem]; Cotto 2009 TKO12 [mem]; Marquez IV 2012 L KO6 (KD'd Marquez in R5 then KO'd walking in) [mem]; Thurman 2019 SD (KD R1) [mem].
- **Brain knobs (prime, est.):** output .9, jab .55, power .75, body .45, combo .85, initiative .9, patience .25, shell .3, slip .55, legs .95, clinch .2, composure .8, risk .75, killer .9, range .55, circle .8. Base **swarmer** (blitz), guard **standard** (hands high-ish, very mobile). Age-46 version: output .55, legs .5.

## 11. "Sadjo" = Kevin Lele Sadjo (short card)
**168, French-Cameroonian; stance not confirmed (est. orthodox).** 26-0 (23 KO) before his first loss [src: ringmagazine].
**Status:** lost UD to Diego Pacheco, 2025-12-13 (117-110, 116-111, 115-112, WBC Silver) [src: ringmagazine]. 2026 stoppage wins over Albrecht (Feb) and AlMahmoud (Mar) and a UD over Ubaya (Jun) appear only on an aggregator [src: champinon, unverified].
- **Style:** wide, stocky banger who goes chest to chest and wings hooks; "crazy style" (Pacheco's words) [src: ringmagazine title]. A body shot ended Jack Cullen in R6 for the European title (2021) [src: badlefthook]. "Picture-perfect left hook" dropped Pacheco in R8, the first knockdown of Pacheco's career [src: ringmagazine].
- **Why exciting:** 23 KOs in 26 wins, and the left hook can drop anyone late.
- **Mind:** aggressive and wild. Weakness: a long jabber with a reach edge controls him, and he holds a lot inside [src: ringmagazine, box-sport].
- **Brain knobs (est.):** output .6, jab .25, power .85, body .6, combo .5, initiative .7, patience .35, shell .5, slip .35, legs .4, clinch .6, composure .6, risk .75, killer .8, range .3, circle .25. Base **slugger**, guard **high**.

## 12. "Khalidov" = probably Murad Khalidov (short card, low confidence)
Most likely the Dagestan-born heavyweight/cruiser on the IBA Pro circuit, orthodox, 6'2.5" [src: iba.sport, champinon]. 12-1 (6 KO). KO'd Sergey Kuzmin in R7 (Oct 2025, the first stoppage of Kuzmin): "used uppercuts to snap Kuzmin's head back", "broke Kuzmin down to the head and body with heavy combination punching", finished with a crunching left hook [src: iba.sport]. Reportedly lost by TKO to Arslan Yallyev, 2026-07-11 [src: champinon, unverified]. Also linked to bare knuckle [snippet]. Not to be confused with Mamed Khalidov (KSW MMA).
- **Brain knobs (est.):** output .65, power .7, body .6, combo .7, initiative .75, patience .4, killer .75, range .4. Base **swarmer/boxerpuncher**, guard **standard**. If Ed meant someone else, drop this card.

---

## Unidentified
- None fully unidentified. "Khalidov" is a low-confidence guess (Murad Khalidov). Alternatives considered: Gazi Khalidov (Spanish amateur, 2019) and Mamed Khalidov (MMA, not boxing). "Sadjo" is confidently Kevin Lele Sadjo.
- Ted Cheeseman: no fights found after 2021, so he is probably not "active".

## Patterns: what makes fighters exciting (sim rules)

1. **Late comeback KO (the Walker rule).** A fighter behind on the cards in rounds 9+ with power ≥ .7 should *raise* risk and killer instead of fading: more overhand 2s, fewer jabs. Walker went 3 for 3 on late come-from-behind stoppages (R11, R12, R10). Comebacks need their power to stay high late (KO power should not decay with stamina as fast as accuracy does).
2. **Knockdowns both ways.** The most-watched fights have the A-side hurt too: Whittaker dropped/slipped in R12, Baumgardner rocked in R3, Pacheco dropped by Sadjo, Pacquiao-Marquez IV. A sim should allow the favourite to be hurt at a meaningful rate (est. 15-20% of "exciting" fights), and a hurt fighter with composure ≥ .7 should answer with a big round next (Baumgardner R4 after R3).
3. **Trade willingness = excitement.** Mbilli-Martinez (787 vs 980 thrown) and Cheeseman-Eggington were wars because both men stayed in the pocket. Excitement ≈ both fighters' output × time spent at short range. Two swarmers or swarmer vs slugger should produce FOTY-type fights.
4. **One-weapon hunters.** Williamson (overhand right over the jab) and Riakporhe (the right hand) throw the same shot until it lands. That is a hunt counter: count misses, keep throwing the shot, and the payoff is a sudden multi-knockdown round. Their counter-play is volume: a busier opponent beats them on points when the shot doesn't land (Simpson II, Billam-Smith II).
5. **Finish bursts.** Exciting finishers turn one hurt into a 3-4 knockdown sequence (Williamson 4 KDs in R10, Riakporhe 2 KDs in R2). On "opponent hurt", killer ≥ .8 should mean pinning to the ropes, throwing 4+ punch flurries and stepping in again after each knockdown.
6. **Fast starts vs slow readers.** Fast starters (Mbilli TKO1, Whittaker TKO1) excite early. Slow readers (McKenna, Baumgardner) win later. Mixing these profiles gives fights a story arc: early danger, then a middle-round adjustment.
7. **Showboating as a risk dial.** A "showboat" state (Whittaker, prime Pacquiao's joy) drops the guard and output when well ahead. It is crowd-pleasing but opens counter windows. That made the Wallace 12th-round scare.
8. **Body shot set-up into head finish.** Mbilli (3b → 6), Walker (3b KD R8 → rights R10), McKenna (3b KD R12), Sadjo (body KO of Cullen). Body investment should pay off with a later knockdown and a lowered guard.
9. **Age and fade.** Legends keep power but lose late rounds (Pacquiao at 46 lost rounds 10-12 on every card). A good model is age scaling legs and output in the championship rounds, not power.
