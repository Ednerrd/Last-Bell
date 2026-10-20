# Fighter DNA cards, batch F (heavyweights from the r/Boxing "most exciting active fighters" thread)

Research for Last Bell's per-fighter AI knobs. Researched 2026-10-13. In-game names will be altered.

**How this was gathered.** WebSearch summaries only (no page fetches). Tags: [src: site] = a search summary of that site's report; [snippet] = search text with no clear outlet; [mem] = model memory, not re-checked; (est.) = judgement call; (calc) = my arithmetic. Status lines are "as found" on the date given. Punch numbers: 1 jab, 2 cross, 3 lead hook, 4 rear hook, 5 lead upper, 6 rear upper, b = body. For a southpaw, 1 is the right jab and 2 is the straight left.

Brain traits are 0–1: output jab power body combo initiative patience shell slip legs clinch composure risk killer range circle. "chin" is not a brain trait but is noted where it drives the fighter's story (heavyweight fights turn on it).

Not duplicated: Usyk already has a card (fighters_a.md). He appears below only as an opponent.

---

## 1. Tyson Fury ("the 6'9" boxer who fights like a middleweight")

- **Division / stance / nickname.** Heavyweight, orthodox who switches to southpaw mid-fight, "The Gypsy King" [mem].
- **Status (2026-10).** 36-2-1 after stopping Mariusz Wach (corner retirement after round 7, Pattaya, 2026-07-24) [src: thescore, boxingonly]. Earlier UD over Arslanbek Makhmudov, 120-108 x2, 119-109, Tottenham, 2026-04-11 [src: agentmma, boxingonly]. Fury–Joshua signed for Q4 2026; one search summary says Cardiff, 11 Dec, not confirmed [snippet].
- **Style.** Long range, hands low, upper-body feints and a pull back. Volume jab, then leans and mauls inside. CompuBox vs Makhmudov: 498 thrown and 199 landed (40%); jabs 73/225; power 126/273 (46%). That is ~41 thrown and ~17 landed per round (calc), with a 45% jab share (calc). Opponent landed ~5 per round [src: compuboxdata via search].
- **Signature.** Jab to the head and body (1, 1b), a lead uppercut in close (5), the 1-2 down the middle, and a 2-3 as the opponent ducks. Against Wilder 3 he leaned his weight on Wilder, then landed a short 4 [mem].
- **Why exciting.** Trash talk and the theatre of a giant who switches stance and showboats. He has got up from heavy knockdowns: Wilder 1 in round 12 (2018), Wilder 3 in round 4 (2021) and Ngannou in round 3 (2023) [mem].
- **Mind.** Patient and a reader, but he makes things happen when he chooses to. In the Wilder 2 game plan he switched from boxing to bully pressure [mem]. He is very composed when hurt: he gets up, clinches, smiles and resets. Flaws: he gets lazy or clowns when ahead. He was hurt and close to being stopped by Usyk in round 9 of the first fight (2024) [mem]. Body work and southpaw speed trouble him.
- **Library.** Klitschko 2015, UD: he out-feinted him with feints and switch-hitting. Wilder 2 2020, TKO7: forward pressure and a weight lean, Wilder dropped in rounds 3 and 5. Wilder 3 2021, KO11: a slugfest with 5 knockdowns in total, Fury down twice in round 4. Ngannou 2023, SD win after being down in round 3. Usyk 1 2024, SD loss after nearly being stopped in round 9 [all mem].
- **Brain knobs (est.).** output .55, jab .8, power .6, body .45, combo .45, initiative .55, patience .75, shell .3, slip .6, legs .65, clinch .9, composure .95, risk .35, killer .6, range .85, circle .55. Base style **outboxer** (boxerpuncher when he chooses to bully). Guard **handslow**.

## 2. Anthony Joshua ("the textbook puncher with a glass-half-full chin")

- **Division / stance / nickname.** Heavyweight, orthodox, "AJ" [mem].
- **Status (2026-10).** Was 29-4 after the Jake Paul KO6 (2025-12-19, Miami) [src: aljazeera/AP]. Since then he stopped Kristian Prenga in round 2 (2026-07-25, Saudi Arabia) after being **down twice in round 1** [src: arise.tv, blueprint.ng], which makes him 30-4 (calc). Fury fight signed for late 2026 [snippet].
- **Style.** Mid to long range, tall high guard, stiff 1 then the 2. He fights from a crouch in close. Heavy single shots more than volume (est.). Signature: the 2-5 / 2-6 uppercut down the middle (the finishes of Klitschko and Paul) and the right uppercut after a jab feint [mem; Paul finish = right uppercut then combination, src: aljazeera].
- **Why exciting.** Knockdowns both ways. When his 2 lands, fights end. When he is caught early, he folds or gets badly hurt.
- **Mind.** Cautious by default since the Ruiz loss: "safety-first", jab and wait (est.). Two-sided killer instinct: devastating when the opponent is hurt (Ngannou KO2, Paul KO6). Composure when hurt is mixed. He survived the Klitschko round-6 knockdown, but against Ruiz 1 (2019) and Dubois (2024) he was dropped repeatedly. He beat Prenga after two first-round knockdowns. Flaw: he fades when hit first, and gets wild after a knockdown. He loses to fast feet or southpaw IQ (Usyk twice) [mem].
- **Library.** Klitschko 2017, TKO11: he dropped Klitschko in round 5, was down himself in round 6, then landed an uppercut and 2 knockdowns in round 11. Ruiz 1 2019, TKO7 loss: he dropped Ruiz in round 3 and was dropped 4 times in total. Ngannou 2024, KO2: a clinical 2. Dubois 2024, KO5 loss: down in rounds 1, 3 and 5. Prenga 2026, KO2 after being down twice in round 1 [mem + src as above].
- **Brain knobs (est.).** output .45, jab .65, power .9, body .35, combo .5, initiative .45, patience .7, shell .45, slip .3, legs .45, clinch .55, composure .5, risk .35, killer .9, range .65, circle .3. Base **boxerpuncher**. Guard **high**. Chin: below average for a heavyweight (est.).

## 3. Daniel Dubois ("the bomber who learned to get up")

- **Division / stance / nickname.** Heavyweight, orthodox, "Dynamite" [mem].
- **Status (2026-10).** WBO champion. Won it from Wardley by TKO11 at Co-op Live, Manchester (2026-05-09) after being **down twice**: an overhand right 10 seconds into round 1, then again in round 3 [src: aljazeera, wtop/AP, flashscore]. Rematch set for the O2 on 2026-10-17 (4 days after this was written). Records as listed: 23-3 (22 KO) vs Wardley's 20-1-1 [src: ringmagazine via search].
- **Style.** Upright, mid range, stiff 1 and a heavy 2 / overhand right. Not much head movement (est.). Turned the Wardley fight "once Don Charles had him thinking behind the left hand" rather than trading [src: flashscore/AP]. Pressure walk-down, right hands to the face [mem].
- **Why exciting.** Pure power and rally stories. He went from the Joyce loss (2020, knee down with a broken orbital) to flattening Joshua and getting up twice to beat Wardley.
- **Mind.** Patient stalker who sets up the 2 with the 1. Killer instinct is high once he sees blood (Wardley cut: near-stoppage in round 6, waved off in round 11) [src]. Composure when hurt has grown: he now gets up and keeps jabbing. Old flaw: "took a knee" (Joyce 2020) [mem]. Flaws: hittable by the overhand right (Wardley), and slow against a mover and body puncher (Usyk stopped him twice, 2023 KO9 and 2025 KO5) [mem].
- **Library.** Joyce 2020, KO10 loss: the jab broke his orbital. Hrgovic 2024, TKO8: the right hand closed the eye [mem]. Joshua 2024, KO5: AJ down in rounds 1, 3 and 5, a right-hand counter finished it [mem]. Wardley 2026, TKO11: down twice early, then took over behind the jab [src].
- **Brain knobs (est.).** output .5, jab .7, power .9, body .3, combo .4, initiative .7, patience .55, shell .4, slip .2, legs .3, clinch .3, composure .7, risk .55, killer .85, range .6, circle .2. Base **slugger** (moving toward boxerpuncher). Guard **standard**.

## 4. Fabio Wardley ("the white-collar bomber who is always one right hand from winning")

- **Division / stance / nickname.** Heavyweight, orthodox, no settled nickname found. White-collar background, no amateur pedigree [mem].
- **Status (2026-10).** 20-1-1 (19 KO). He won the WBO interim title by TKO11 over Joseph Parker (2025-10-25, O2) while **behind on two cards** [src: cbssports, newstalkzb]. He was elevated to full WBO champion 2025-11-17 when Usyk vacated [src: wikipedia]. He lost it to Dubois by TKO11 on 2026-05-09 after dropping him twice [src]. Rematch 2026-10-17 [src: boxingnewsonline, eventmasters].
- **Style.** Mid range, explosive starts, crude but fast. The overhand right is the whole identity: a "perfectly timed overhand right" then a 3 and a clubbing 2 vs Clarke 2 [src: ringmagazine]. He jumps opponents at the bell: dropped Dubois in 10 seconds, swarmed Parker at the start of round 11 [src]. He loses rounds on technique and then lands the equaliser.
- **Why exciting.** The late comeback KO ("Wilder moment" per Warren): Huni was ahead and was knocked out in round 10 [src: espn, swboxing]; Parker was ahead and was stopped in round 11. Every round he is live.
- **Mind.** High risk, high initiative in bursts, gambler. Killer instinct maximal. The finish is a flurry where "many punches missed" (Parker) [src: cbssports]. He keeps believing when losing on cards. Flaws: he bleeds (nose cut by the Clarke jab in 2024; face swollen and bleeding vs Dubois) [src]. Poor defense, a jab-able target.
- **Library.** Clarke 1 2024, split draw: he dropped Clarke in round 5 while bleeding from the nose. Clarke 2 2024, KO1. Huni 2025, KO10 from behind. Parker 2025, TKO11 from behind. Dubois 2026, TKO11 loss after 2 early knockdowns [src as above].
- **Brain knobs (est.).** output .55, jab .4, power .9, body .3, combo .5, initiative .75, patience .3, shell .3, slip .3, legs .45, clinch .3, composure .8, risk .85, killer .95, range .5, circle .3. Base **slugger**. Guard **standard**. Sim hook: a "late equaliser" bonus to the chance of an overhand when behind on the cards in rounds 9+ (est.).

## 5. Moses Itauma ("the southpaw prodigy who ends fights in a round")

- **Division / stance / nickname.** Heavyweight, southpaw [mem]. Born 2004 (est.).
- **Status (2026-10).** Lost a vacant IBF title fight to Filip Hrgovic by TKO9 at the O2 (2026-08-29). The towel and the referee's stop came together; he was stretchered out and given oxygen [src: radiox, qatar-tribune, flashscore]. Before that he was 14-0 (12 KO) [snippet], with TKO5 over Jermaine Franklin (2026-03-28, the first stoppage loss of Franklin's career) [src: boxingonly, lbc] and KO1 over Dillian Whyte (2025-08-16, Riyadh) [src: cbssports].
- **Style.** Fast hands and a trigger right jab "that works more as a trigger than a range-finder" [snippet]. Head–body and body–head switches, feinting high to go low [snippet: DAZN preview]. Whyte finish: a straight left (2) hurt him, a left dropped him, flurry upstairs and downstairs, then a right hook (3) to the temple [src: cbssports, boxsport].
- **Why exciting.** Speed plus power at 20–21. He finishes elite-name veterans inside 2 minutes.
- **Mind.** Very high initiative. Killer instinct from the first bell. Vs Hrgovic he dropped him early (a standing count in round 2), cut him in round 4 and dominated rounds 5–6, then faded in rounds 7–8 and was stopped in round 9 [src: canberratimes, charter97]. Critics say he spent the fight "loading up" on every shot [snippet: roundtable]. Flaws: gas past round 6 has never been tested before Hrgovic, and composure when tired is an open question (est.).
- **Library.** McKean 2025, KO1 [mem]. Whyte 2025, KO1, 1:59 [src]. Franklin 2026, TKO5 [src]. Hrgovic 2026, TKO9 loss after dropping him in round 2 [src].
- **Brain knobs (est.).** output .6, jab .6, power .85, body .55, combo .7, initiative .9, patience .3, shell .35, slip .55, legs .6, clinch .25, composure .5, risk .7, killer .95, range .55, circle .45. Base **boxerpuncher**. Guard **standard** (southpaw). Gas: fast drain when power share is high (the Hrgovic lesson) (est.).

## 6. Agit Kabayel ("the best body puncher at heavyweight, with an engine")

- **Division / stance / nickname.** Heavyweight, orthodox, Germany, "Big Bang" [src: keviniole].
- **Status (2026-10).** WBC interim champion. Stopped Damian Knyba in round 3 (Oberhausen, Jan/Feb 2026: a flurry of right hands) [snippet]. The WBC ordered Usyk to face him next after the Verhoeven fight (June 2026) [snippet]. No date found.
- **Style.** Hand speed and aggression vs bigger men [src: ringmagazine]. Ring calls him "the division's best body puncher" with a "very high engine" [src]. He boxes on the move early, then switches to pressure: vs Makhmudov he moved in rounds 1–2 and attacked in rounds 3–4 [src: ringtv]. Diet: 3b and 2b to the solar plexus, then up to the head. Zhang was finished by a straight right to the solar plexus [src: ringmagazine].
- **Why exciting.** Body-shot knockouts of giants: Makhmudov was down three times from body shots in round 4. Comeback from his first career knockdown vs Zhang (round 5) to drop him twice in round 6 [src].
- **Mind.** Patient early, a body investment that "gradually slowed Zhang down round by round" [src]. Killer instinct once the body is softened. Composure: got up in round 5 vs Zhang and won the next round. Quote: "I don't look for the knockout, but our main goal is always to entertain" [src: ringmagazine headline]. Flaw: smaller and catchable by big left hands early (Zhang) (est.).
- **Library.** Makhmudov 2023, TKO4: three body-shot knockdowns. Frank Sanchez 2024, KO7: marched down the defensive boxer and dropped him twice in round 7 (one summary dates it 2025) [src: ringmagazine]. Zhang 2025, KO6 from a knockdown down in round 5. Knyba 2026, TKO3 [snippet].
- **Brain knobs (est.).** output .7, jab .5, power .7, body .95, combo .7, initiative .7, patience .6, shell .5, slip .5, legs .55, clinch .3, composure .85, risk .5, killer .8, range .35, circle .4. Base **swarmer**. Guard **high**.

## 7. Derek Chisora ("the war-every-time veteran", 50 pro fights)

- **Division / stance / nickname.** Heavyweight, orthodox, "Del Boy", "War" [mem].
- **Status (2026-10).** 36-14. Lost a split decision to Deontay Wilder (115-111, 115-113, 112-115) at the O2 on 2026-04-04, billed as his last fight; it was the 50th fight for both men. He was down in round 8 when he went through the ropes, and Wilder was docked a point for the push [src: AP/foxsports, aljazeera]. Retirement not formally confirmed [src].
- **Style.** Short range, a crouched forward walk with a high guard. Overhand rights (2/4) and looping hooks (3, 3b), lots of body work and leaning. A low-skill, high-will clinch-and-maul pressure fighter (est. + mem).
- **Why exciting.** Never boring, never quits. Wars like Whyte 1 (2016) and the Pulev rematch; chaos inside and out of the ring [mem].
- **Mind.** Max initiative and toughness. He wins by grinding the opponent into a phone-booth fight. Composure: high durability. He has lost mostly on points and was rarely stopped late in his career (est.). Flaws: hittable, slow feet, and wild. Elite movers outbox him (Fury twice, Usyk 2020) [mem].
- **Library.** Whyte 1 2016, SD loss: a classic war. Usyk 2020, UD loss: he made Usyk work hard early. Pulev 2 2022, SD win [mem]. Joyce 2024, UD win [mem]. Wilder 2026, SD loss: chaos, 8th-round knockdown through the ropes [src].
- **Brain knobs (est.).** output .65, jab .3, power .7, body .65, combo .45, initiative .9, patience .2, shell .7, slip .3, legs .2, clinch .8, composure .85, risk .7, killer .6, range .2, circle .1. Base **swarmer**. Guard **high**.

## 8. Arslanbek Makhmudov ("the Lion: a 6'5" one-dimensional bomber")

- **Division / stance / nickname.** Heavyweight, orthodox, Russian-born, based in Montreal, "The Lion" [src: ringtv; Montreal mem].
- **Status (2026-10).** 21-3 (19 KO) after a UD loss to Fury (2026-04-11, 120-108 x2, 119-109) [src: agentmma]. No next fight announced [snippet]. Before Fury he beat Dave Allen in Sheffield and called out Joshua [src: si.com].
- **Style.** Forward walk, heavy single right hands and hooks, low output: CompuBox vs Fury 280 thrown over 12 rounds, ~23 per round, landing 59 (21%) and 13/69 jabs (calc from src: compuboxdata). Self-description: "a puncher, power" [src: ringtv].
- **Why exciting.** Started 17-0 with 17 KOs: every fight is a "who gets hit first" fight [src].
- **Mind.** Front-foot initiative, but slow to let hands go against movers (Fury out-landed him 17 to 5 per round) [src]. Composure under body fire is poor: dropped three times by body shots vs Kabayel (2023), though he says his hand broke in round 2 [src: worldboxingnews]. Flaws: slow hands, little defense, body.
- **Library.** Kabayel 2023, TKO4 loss: body shots. Allen 2025 (est.), win. Fury 2026, UD loss, shut out [src].
- **Brain knobs (est.).** output .35, jab .35, power .95, body .35, combo .3, initiative .7, patience .4, shell .4, slip .15, legs .2, clinch .35, composure .45, risk .6, killer .85, range .5, circle .1. Base **slugger**. Guard **standard**.

## 9. Justis Huni ("the slick Aussie with fast feet and hands")

- **Division / stance / nickname.** Heavyweight, orthodox, Australia [mem].
- **Status (2026-10).** Beat Frazer Clarke by majority decision over 10 rounds (2026-04-11, Fury undercard) despite an elbow injury that later needed surgery [src: boxingonly, nit.com.au]. ~13-1 (calc). Only loss: KO10 to Wardley in June 2025 while ahead [src].
- **Style.** "Fast feet and quick hands to subtly dismantle opponents" [src: aap]. Strong jab, smart aggression on the front foot, patience and ring IQ (Tabiti 2023) [src: boxingscene]. Bounce and split-step footwork to slip and counter [snippet]. Retooled defense after a scare vs Kevin Lerena, then shifted to a more aggressive style [src: ringtv, aap].
- **Why exciting.** High-tempo amateur-style rounds; leads on points against punchers until something happens.
- **Mind.** Patient points boxer with a moderate killer instinct. Composure good, but chin and power questioned [src: ringtv]. Flaw: stays in the pocket late when ahead and eats the big right (Wardley round 10).
- **Library.** Gallen 2021, TKO10 [src: canberratimes]. Tabiti 2023, UD. Lerena 2024, W after a late scare [src]. Wardley 2025, KO10 loss while ahead. Clarke 2026, MD [src].
- **Brain knobs (est.).** output .7, jab .8, power .45, body .4, combo .65, initiative .55, patience .6, shell .4, slip .6, legs .7, clinch .3, composure .65, risk .45, killer .5, range .7, circle .6. Base **outboxer**. Guard **standard**.

## 10. Frazer Clarke ("the Olympic jab that keeps getting into wars")

- **Division / stance / nickname.** Heavyweight, orthodox, 6'6" (est.), "Big Fraze" [mem]; Tokyo 2020 bronze [src: yahoo].
- **Status (2026-10).** 9-3-1 (7 KO) after an MD loss to Huni (2026-04-11) [snippet: champinon]. Also lost to TKV by split decision for the vacant British title (2025-11-29) [src: skysports] and was KO1'd by Wardley in 2024 [src: ringmagazine].
- **Style.** Long-range amateur boxer, "thudding jab" (it cut Wardley's nose) [src: yahoo/boxingnewsonline]. Repeated low blows: deducted vs Wardley in round 7 [src]. Opened with an "early bombardment" vs TKV and nearly ended it with a left hook in round 11 [src: skysports].
- **Why exciting.** Not by design: his fights become close-run brawls with knockdowns (Wardley 1 a fight of the year contender).
- **Mind.** Starts fast, fades, and gets clipped. Composure: got up in round 5 vs Wardley 1. Flaws: chin vs a big right (Wardley 2 KO1), and trading when he should box.
- **Library.** Wardley 1 2024, split draw: down in round 5, cut Wardley with the jab. Wardley 2 2024, KO1 loss. Dave Allen, TKO6 [src: boxingscene]. TKV 2025, SD loss. Huni 2026, MD loss.
- **Brain knobs (est.).** output .55, jab .8, power .55, body .45, combo .45, initiative .6, patience .45, shell .4, slip .3, legs .4, clinch .5, composure .55, risk .55, killer .55, range .7, circle .3. Base **boxerpuncher**. Guard **standard**.

## 11. Jeamie Tshikeva ("Jeamie TKV: rough, tough, rule-bending British-level grinder") — short card, thin sourcing

- **Division / stance.** Heavyweight, 6'4", ring name Jeamie TKV [src: wikipedia, mdx.ac.uk].
- **Status (2026-10).** 9-3 (5 KO) [snippet]. Won the vacant British title over Clarke by split decision (Derby, 2025-11-29), weathering an "early bombardment" and a near-finish in round 11, with a point deducted for repeated low blows [src: skysports]. Lost the title to Richard Riakporhe by TKO5 (2026-04-11): docked a point for a headbutt in round 4, dropped by a clubbing right, then stopped at 2:12 [src: worldboxingnews, boxingonly]. All 3 losses by stoppage (Macedo 2023, Adeleye 2025, Riakporhe 2026) [snippet].
- **Style / mind.** A grinding survivor; rule-bending inside (low blows, head) (est. from deductions). Will and durability over polish. Chin vulnerable against real punchers. Why exciting: messy, close, attritional British-title fights.
- **Brain knobs (est.).** output .55, jab .45, power .55, body .55, combo .4, initiative .55, patience .5, shell .55, slip .25, legs .35, clinch .7, composure .7, risk .5, killer .45, range .35, circle .2. Base **swarmer**. Guard **high**.

## 12. Richard Torrez Jr. ("the short southpaw Olympian who charges in")

- **Division / stance / nickname.** Heavyweight, southpaw, US, Tokyo 2020 silver [src: wikipedia, toprank].
- **Status (2026-10).** 14-1 (12 KO). KO2 loss to Frank Sanchez in an IBF eliminator at the Pyramids of Giza (2026-05-23) [src: boxingonly, worldboxingnews]. Previous fights: TKO over Tomáš Šálek (2025-11-15) and a 10-round UD over Guido Vianello (2025-04-05) [src].
- **Style.** Short for the division (est. ~6'0"). Hectic, explosive pressure and body work; he copied Kabayel's anti-Sanchez plan [src: box-sport.de]. Lands the right hook (3) from southpaw while pressing [src: badlefthook]. Hand speed and youth [src].
- **Why exciting.** All action: he walks through to get inside on taller men, with a high KO rate.
- **Mind.** Max initiative, high risk. Flaw: leads with a looping overhand that gets countered — Sanchez countered it with a short right uppercut (6), and Torrez couldn't stand up [src: dazn via search]. The Vianello win was "ugly" [src].
- **Library.** Vianello 2025, UD. Šálek 2025, TKO. Sanchez 2026, KO2 loss: countered by an uppercut [src].
- **Brain knobs (est.).** output .75, jab .4, power .75, body .7, combo .65, initiative .9, patience .25, shell .45, slip .45, legs .5, clinch .3, composure .55, risk .8, killer .8, range .25, circle .35. Base **swarmer**. Guard **peekaboo** (southpaw, crouching in) (est.).

---

## Unidentified

None. "Jeamie Tshikeva" = Jeamie TKV (same fighter, confirmed by several sources).

---

## Patterns: what makes heavyweights exciting (rules a sim can use)

1. **One punch flips the fight.** Wardley beat Huni and Parker while behind on the cards; Itauma lost to Hrgovic after dominating rounds 4–6. Rule: at heavyweight, a clean power shot gives a KO chance well above lighter divisions, and **cards don't protect the leader**. Give each power puncher a "late equaliser": rounds 9+ and behind on points → overhand weight ×1.5, risk +.2.
2. **Knockdowns both ways in the same fight.** Dubois–Wardley (down twice, then won), Kabayel–Zhang (down in round 5, KO in round 6), Joshua–Prenga (down twice in round 1, KO in round 2), Fury–Wilder 3 (5 knockdowns). Rule: after a knockdown, both fighters swing more (the dropper chases, the dropped man counters wild). Next-round KO odds go up for **both**, not only the man who scored the knockdown.
3. **Early burst, late fade.** Loaded-up power drains the tank fast (Itauma "loading up" → exhausted by round 8). Rule: gas cost scales with the power share; a fighter who throws >60% power from round 1 hits a wall around rounds 7–9.
4. **Body shots topple giants.** Kabayel stopped Makhmudov (3 body knockdowns) and Zhang (solar plexus). Rule: body damage slows the opponent's legs and output over rounds; big men take a larger penalty (est.).
5. **Cuts decide close fights.** Clarke's jab cut Wardley; Dubois's right hand closed Wardley's eye (stopped in round 11). Rule: the jab and right hand from a heavy hitter open cuts; doctor checks build drama in rounds 8–11.
6. **The comeback is the story.** Get up, jab, take over (Dubois, Fury). Rule: a high-composure fighter who survives a knockdown gets a recovery arc. He jabs to reset for 1–2 rounds, then returns to his plan. A low-composure fighter (Joshua vs Ruiz) gets wilder and is dropped again.
7. **Low output, high stakes.** Heavyweights throw ~25–45 per round (Makhmudov ~23, Fury ~41 vs Makhmudov) (calc), less than the game's ~53 audit target. Rule: scale heavyweight output to ~0.7× and raise per-punch KO and knockdown weight, so excitement comes from threat, not volume.
8. **Upsets come from the counter to the wild shot.** Sanchez's short uppercut on Torrez's overhand; Dubois's counter right on Joshua. Rule: a big looping shot from a high-risk swarmer raises his own chance of being knocked out by a counter (that is the price of the risk trait).
