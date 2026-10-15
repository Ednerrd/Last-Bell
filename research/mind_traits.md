# Fighter traits: glass jaw, slow starter, dangerous when hurt and the rest (Oct 2026)

Scope: trait list for the career sim, born vs earned, the "dangerous when hurt" question, stacking, and game knobs. Not repeated here: chin wear, age curves, gun-shy after a KO, ring rust (`mind_between.md` 3b, 4, 5); finishing and surviving a hurt man (`mind_finish.md`); round shape and the pace controller (`mind_pace.md`).

Honesty note: the proxy blocked page fetches (agentmma.com, combatsportslaw.com and others returned DNS errors), so everything below is search-snippet text. Almost NO boxing study measures traits. Hard numbers are UFC proxies. Fight facts are case evidence. Tags: [snippet, source], [unverified] (snippet only, thin), [mem] (my memory, not checked), (est.) (my estimate, a tuning knob, not a fact).

---

## 1. The trait list

"How common" = share of pros who a writer would honestly hang the label on. No source counts this. All shares are (est.).

### 1.1 Durability

| Trait | Definition | Fighters and fights | In the numbers | How common |
|---|---|---|---|---|
| **Iron chin** | Takes the clean shot, rarely floored, stays coherent when hit | George Chuvalo: 93 pro fights, never knocked down, not even in his stoppage losses to Frazier and Foreman [snippet, gvwire/AP Sep 2026]. Oliver McCall: 71 fights never down [snippet, list site; unverified]. Vitali Klitschko took Sanders' best and "never went down" [snippet, HBO/Vitali quote, 2004] | KD taken rate far under field (field ~1 KD per 10 to 15 rounds, est.). Iron men lose by cuts, accumulated damage, or corner stops, not by KO | 3 to 5% (est.) |
| **Glass jaw** | Folds or drops to a punch that would not floor a typical man | Wladimir Klitschko vs Corrie Sanders (Mar 2003): four knockdowns, stopped 27 s into R2 [snippet, Wikipedia/ESPN]. Klitschko vs Lamon Brewster (Apr 2004): hurt, standing 8 in R5, stopped [snippet, ESPN/boxingonly]. Hatton lost his chin and his unbeaten run to Mayweather (R10) then Pacquiao (R2) [mem, `mind_between.md` 5a] | KD rate 2x to 3x field (est.). Gets stopped in the first 5 rounds more than his record says. Per UFC proxy: a man who has been dropped 5+ times is stopped 25.3% of fights vs 13.9% for never-dropped [snippet, ufcalendar.com; unverified] | 8 to 10% (est.) |
| **Quick recoverer** | Hurt or dropped, he is back to normal in seconds; cleared head by the next exchange | Marquez vs Pacquiao 1 (May 2004): three KDs in R1, "weathered the storm", started landing his counters and drew the fight [snippet, Wikipedia + low-quality recaps] | Long hurt window is short; KD to stop conversion is low. UFC proxy: of 910 fights that went past the KD round, the dropped man still won 34.4% [snippet, agentmma.com knockdown audit] | 8% (est.) |
| **Slow recoverer / bad legs** | Once hurt, stays hurt, legs gone for a long time | Hearns vs Barkley 1 (Jun 1988): dropped in R3, "barely beat the count", stopped [snippet, Wikipedia]. Hearns after Leonard 2 (1989) and in 1992 [mem] | Hurt state lasts longer; survives fewer follow-up shots | 8% (est.) |
| **Body-shy** | Folds to the body, drops the guard after a body shot | Mayweather vs Corrales 1 (Jan 2001): body jab, Corrales dropped his right hand every time, left hooks floored him five times, corner stopped it R10 [snippet, Wikipedia/boxingscene]. Ward KO'd Gatti in R9 of Gatti-Ward 1 with a left hook to the liver [snippet, Wikipedia/ESPN] | Body KD share high (engine target 5 to 8% of KDs are body). Shell opens after a body hit | 6 to 8% (est.) |

### 1.2 Round-by-round shape

| Trait | Definition | Fighters and fights | In the numbers | How common |
|---|---|---|---|---|
| **Slow starter** | Feel-out lasts longer; loses R1-3 on cards, wins the middle and late | Kostya Tszyu, "notoriously slow starter", lost R1-2 to Hatton in Jun 2005 [snippet, Wikipedia]. Carl Froch: "as usual started slowly" vs Groves 2, KO R8 [snippet, report on Groves-Froch 2]. Bernard Hopkins: "slow starter who marshals his resources"; Shumenov 2011 was a poor feel-out round, jab from R4 [snippet, Inquirer 2012; round-by-round account] | R1 output 0.7 to 0.8x field (engine R1 average 0.85x, `mind_pace.md`). Loses ~2 of the first 3 rounds, wins ~60% of the last 6. Cuts both ways: a fast starter picks up easy rounds | 15 to 20% (est.) |
| **Fast starter** | Hits hardest and busiest early; wants it over by R6 | Hatton vs Tszyu: won the first two rounds, aggressive start [snippet, Wikipedia]. Pacquiao in R1 of Marquez 1 (three KDs) [snippet, Wikipedia]. Tyson: most KOs inside 3 rounds, 44 of 50 wins by KO per one sheet [snippet, low-quality PDFs; unverified] | R1 to R3 output 1.1 to 1.2x field. Lead after R3 of 70%+ . Later rounds drift down, especially if he does not finish | 12 to 15% (est.) |
| **Strong closer** | Steps it up in the last 3 rounds and the last 30 s of each round | Froch vs Taylor 1 (Apr 2009): behind 106-102 on all cards, dropped Taylor in R12, stopped him with 14 s left [snippet, Ring/report]. Chavez vs Meldrick Taylor 1: stopped in R12 [snippet, Ring list]. Carmen Basilio vs DeMarco: stopped him in R12 after being knocked out on his feet in R7 [snippet, Ring list] | Rounds 10 to 12 output 1.0x to 1.1x vs field, 0.9x for the rest. Wins late rounds ~65%. Comeback KOs in R10-12 | 8 to 10% (est.) |
| **Fades late** | Gas runs out; output and legs drop from R7 onward | Tszyu vs Hatton: Hatton's pressure slowed the aging champion, trainer stopped it after R11 [snippet, Wikipedia]. Hatton "faded late on" vs Collazo [snippet, BoxRec forum; unverified]. Joshua vs Klitschko R5-6 gassed after a 2-min flurry [snippet, in `mind_finish.md` 1d] | Output drops 20 to 30% by R10 (field ~10 to 15%, est.). Stoppage losses concentrate in R9+ | 12 to 15% (est.) |

### 1.3 Cuts and hurt-state behavior

| Trait | Definition | Fighters and fights | In the numbers | How common |
|---|---|---|---|---|
| **Cut-prone** | Skin/brow bone opens fast, bleeds heavily, reopens | Rocky Marciano, "known bleeder" [snippet, boxingnewsonline]. Fury vs Wallin (Sep 2019): cut over the right eye in R3, doctor check in R6, 47 stitches across two cuts per ESPN (Fury: just over 40), won UD [snippet, ESPN/Sporting Life/AP]. Nate Diaz's right brow reopened in 8 fights; win rate fell when blood hit the eye (UFC, same mechanism) [snippet, Vice]. Marcus Davis got stitches above his eyes 77 times in 16 years [snippet, NYT via ufc.com] | Cuts open 2x to 3x as often (est.). Per a sports-medicine source facial cuts are ~29% of reported boxing injuries (population not confirmed) [snippet, Sports Med Open 2025; unverified]. Headgear-free fights show "considerably more" cuts [snippet, meta-analysis, ~17,000 bouts]. A cut stoppage is a doctor's call, so the fight ends before the KO | 8 to 12% (est.) |
| **Dangerous when hurt** | Hurt or down, he is MORE dangerous: fires back, uses the opening, lands one big counter | Corrales vs Castillo 1 (May 2005): dropped twice in R10 (25 s, then < 1 min later, a point deducted for the mouthpiece), a "perfect right", Weeks stopped it at 2:06 [snippet, Wikipedia/Ring]. Wilder vs Ortiz 1 (Mar 2018): Ortiz won R7 10-8 on all cards, Wilder KO'd him in R10 [snippet, ESPN/PBC]. Fury vs Wilder 3 (Oct 2021): Fury up from two R4 knockdowns, stopped Wilder in R11 [snippet, Gulf News/CBS]. Barkley (1988): cut over both eyes after R2, KO'd Hearns in R3 [snippet, Wikipedia] | See section 3 | 4 to 6% born (est.), more earned |
| **Quitter / low heart** | Takes the out: turns away, stops punching, won't go on | Duran vs Leonard 2 "no mas" (Nov 1980) [mem]. Chavez-Taylor in reverse: Taylor was "not allowed" to quit [mem] | Stops under pressure, wins no rounds after the first big hit | 4% (est.) |

Not from the original list but common in writing: **one-punch power** (Wilder, Hearns): every punch is a KD roll (see 3 and 6).

---

## 2. Born vs earned

### 2.1 What sources say
- Chin: "mostly genetic but affected by total blows taken" is the common view, a consensus not a measurement [snippet, Wikipedia "Chin (combat sports)"]. A 2023 UFC study asked whether a fighter can develop a glass jaw and concluded SOME are more susceptible: individual, not universal [snippet, Rev. Artes Marciales Asiáticas, 2023]. Prior KO history was the only independent predictor of a next-fight KO loss (22.7% of 705 fighters lost the next fight by KO/TKO, so 77.3% did not) [snippet, agentmma.com].
- Cuts: bone structure and brow ridge (Diaz has a more prominent supraorbital ridge than average) plus scar tissue [snippet, Vice]. Cuts "occur most commonly around the eyebrows, eye socket and nose because of facial bone structure" [snippet, boxing medicine page]. Scar tissue makes the next cut easier. Good stitching limits it [snippet, fightersonly]. Surgery is a real fix [snippet, NYT via ufc.com].
- Starts and fades: stamina and style, so trainable. A style set by camp: a pressure fighter starts fast on purpose; a counter-puncher reads first (`mind_pace.md`).

### 2.2 Table

| Trait | Born | Gained | Lost | Timescale / example |
|---|---|---|---|---|
| Iron chin | Mostly | Little | Slowly, with wear | Chuvalo held his for 23 years (1956 to 1979) [snippet] |
| Glass jaw | Mostly | By wear: 3+ KOs, wars, weight cuts | Rarely. Style fix can hide it | Klitschko: two KO losses 2003-04, then Steward taught him clinch, jab, distance; he was a different man by the 2007 Brewster rematch [snippet, worldboxingnews/Sky; sources differ on whether the chin itself was "fixed"]. A decade unbeaten followed (2004 to Fury 2015) [mem] |
| Cut-prone | Mostly (bone, skin) | Yes: scar tissue builds after each cut | Surgery, or a new style that stops the head being hit | Marcus Davis 77 stitch sessions in 16 years [snippet]. Fury got a fight-cutting wound in 2019 [snippet] |
| Slow starter | Part (temperament) | By style or age (veterans pace themselves) | A trainer can drill R1 starts in 1 camp | Hopkins was labeled a slow starter at 47 (2012); Tszyu at 35 [snippet] |
| Fast starter | Part | From early KO wins | Fades with age | Hatton: fast early, "faded late" vs Collazo [snippet, BoxRec forum; unverified] |
| Strong closer | Part | Gained through conditioning, a late-comeback win | Lost with age/legs | Froch built it through 20+ title fights [mem] |
| Fades late | No: conditioning and weight | Weight cut, age | A new strength coach/camp, move up in weight | 1 camp |
| Dangerous when hurt | Part (power, heart) | Yes, with fights survived | Yes: lost after an ugly KO loss | Corrales (see 3.2) |
| Body-shy | Part | By a bad body KD | Drilling (guard, elbows) | Corrales dropped his right hand to the body jab in 2001; he beat Castillo in 2005 [snippet] |
| Gun-shy | No | After a KO loss | A win | `mind_between.md` 3b |
| Quick recoverer | Part | Experience | Age | Marquez: 3 KDs in Pacquiao 1 at fight 40 or so [mem] |

Rule of thumb: chin and cut-prone are roughly 70% born, 30% career. Starts, closing, fade are roughly 70% career (camp, conditioning, age), 30% temperament. Dangerous when hurt is 50/50.

### 2.3 Gained or lost: examples
- **Lost chin (appeared to).** Klitschko 2003 to 2004, three fights (Sanders KO2, Rahman and Brewster in between, Brewster KO5) [mem]. Hatton at 30 to 31, two fights (Mayweather, Pacquiao) [snippet, `mind_between.md`]. Not every fighter drops: Pacquiao was KO'd cold by Marquez at 33 (Dec 2012), and Hatton said he looked "better and better" after, wins over Rios, Bradley, Algieri [snippet, boxingscene 2014]. One KO is not a trait.
- **Gained "dangerous when hurt".** Corrales: five KDs and a corner stop vs Mayweather (Jan 2001, 33-0), a first knockout loss to Casamayor in 2003 [mem], then Castillo in 2005, four years and about 8 fights later, where he came back from two KDs in R10 [snippet]. The same body, now with an answer.
- **Slow starter "fixed".** Hopkins' later fights show it kept returning, so unfixed at 47 [snippet]. Evidence for a quick fix is thin. Treat it as a half-fix: R1 deficit shrinks, does not vanish (est.).
- **Strong closer made.** Froch's Taylor R12 (2009) and Groves 2 (2014) came about 5 years apart; by Groves 2 it was both a reputation and a plan [snippet].
- **Cut-prone made.** Scar tissue: a brow opens in fight 6, and reopens in fights 7 to 12 [snippet, Diaz 8 reopenings].

---

## 3. "Dangerous when hurt": how often, and does experience matter

### 3.1 The famous cases
| Fight | Round | The hurt man | What happened |
|---|---|---|---|
| Corrales vs Castillo 1, May 2005 | R10 | Corrales, down twice, point off | Right hand, Weeks stopped it 2:06 [snippet, Wikipedia] |
| Wilder vs Ortiz 1, Mar 2018 | R7 to R10 | Wilder, out-boxed, hurt in R7 | KO R10 with a right [snippet, ESPN] |
| Fury vs Wilder 3, Oct 2021 | R4 to R11 | Fury, down twice R4 | Stops Wilder R11. Five total KDs [snippet, Gulf News/CBS] |
| Froch vs Taylor 1, Apr 2009 | R12 | Froch, behind 106-102 | Down Taylor, stop with 14 s left [snippet, Ring list] |
| Moore vs Durelle, Dec 1958 | R5 to R11 | Moore, down 4 times in 5 rounds | Stops him R11 [snippet, Ring list] |
| Duran vs DeJesus, 1973 | R1 to R11 | Duran, down in R1 | Stops him R11 [snippet, Ring list] |
| Basilio vs DeMarco | R7 to R12 | Basilio, out on his feet R7 | Stops him R12 [snippet, Ring list] |
| Gatti vs Ward 1, May 2002 | R9 | Gatti, dropped by a liver shot | Won the round by a mile in an all-time round, lost the fight by majority decision [snippet, SI/ESPN] |
| Barkley vs Hearns, Jun 1988 | R3 | Barkley, cut both eyes | Two rights, TKO R3 [snippet, Wikipedia] |
| Pacquiao-Marquez 1 (inverse) | R1 | Marquez, three KDs | Recovered; draw. Hurt, not KO'd [snippet] |

### 3.2 Rate (no boxing study found)
- No boxing count of "hurt man wins by KO". Closest: UFC, 3,005 fights with a KD: the man who scored the first KD won 86.1% (inflated by same-round stops). Of 910 fights that went past that round, the dropped man won 34.4% [snippet, agentmma.com knockdown audit]. Not all by KO.
- The Ring's "top 5 comebacks" style lists carry about 5 to 8 names per generation of fighters; against about 100,000 pro bouts that is a very rare event [mem, snippet lists]. So the base rate per hurt moment is small.
- **Working base rate (est.):** a man who is hurt or dropped turns it into a KO or stoppage win later in the same fight about 3 to 5% of the time. The figure for a fighter flagged "dangerous when hurt": 10 to 15% (est.).

### 3.3 Does experience make it more likely?
- No study measures it. UFC data: first-time KD (a form of inexperience) is the biggest predictor of being stopped; "FES 0" (new) boxers have higher KO/TKO rates and winless boxers are elevated [snippet, Phys Sportsmed 2024, PubMed 37990916]. So new men are stopped more. This supports "experience helps the hurt man survive and answer".
- Mechanisms that favor the veteran (est.): composure and clinching, knowing the follow-up, saving the legs, cleverness ("the trap" in `mind_traps.md`), fewer panics. Corrales vs Castillo 1 is a veteran: a former champion with a corner stop (2001) and at least one more stoppage loss behind him [mem].
- Mechanisms that go the other way: veterans have more wear (chin goes), age 34+ with 3+ KDs: 27.5% stopped vs 19.1% never-dropped [snippet, ufcalendar.com; unverified].
- Counter-examples: young one-punch men are dangerous hurt without experience: Wilder (Ortiz 1, 2018, unbeaten champion) [snippet]. Power punchers are the second source of the trait.
- **Owner's wish, as written: experienced men most dangerous when hurt, anyone can do it rarely.** Fits the evidence as a rule: composure source = experience; power source = one-punch men; base for everyone = small.

---

## 4. Interactions

| Combo | Result | Example / logic |
|---|---|---|
| Glass jaw + great defense | Hidden. Rarely tested; when he is hit, he drops fast | Klitschko after Steward: jab, clinch, distance, rarely hit cleanly [snippet]. Defense postponed the problem |
| Glass jaw + pressure style | Worst. Eats shots to get in | Corrales-Mayweather (est.) |
| Glass jaw + dangerous when hurt | Common pair in action fighters. High variance fights: both KD him and he KOs back | Gatti-style (mem). Real fights are 50/50 swings |
| Iron chin + fades late | The man others cannot hurt, but whom a pressure fighter can wear | Chuvalo lost to Frazier/Foreman stoppages without a KD [snippet] |
| Slow starter + strong closer | Classic "banker": loses early, steals late. Judges' cards depend on the R10-12 | Froch, Hopkins [snippet] |
| Slow starter + fades late | Lethal: no good rounds | Aging Tszyu (est.) |
| Fast starter + fades late | Typical puncher: wins R1-5, drowned R9+ | Hatton vs Collazo [snippet; unverified] |
| Fast starter + strong closer | Rare, elite conditioning. Cancels each other's weaknesses | Almost no one (est.) |
| Cut-prone + pressure/clinch-head | The bone meets the head: cut stoppage | Hagler vs Hearns R2-3: cut checked by the doctor, no cut stoppage, won R3 [snippet, Wikipedia]. Fury cut R3 vs Wallin by a punch plus later head clash [snippet] |
| Cut-prone + dangerous when hurt | Blood does not slow him; a cut makes him dangerous (Barkley) | Barkley cut both eyes, KO'd Hearns R3 [snippet] |
| Quick recoverer + glass jaw | Rare (conflicting): goes down, gets up fast, drops again. High KD count both ways | est. |
| Body-shy + glass jaw | Two paths to the canvas | Corrales 2001 [snippet] |
| Gun-shy + any chin trait | Caution after a KO, so fewer exchanges, lower KD rate; hides the glass jaw while scores slip | `mind_between.md` 3b |

Cancel rule: when two traits push the same stat in opposite directions, take the average and keep the flavor text of the stronger (est.).

---

## 5. Game knobs

All (est.). Tune with the audit (targets: ~53 thrown, ~15 landed, ~29% connect, stoppages ~25 to 30%, body KDs 5 to 8%). Test each trait alone: a fighter with the trait vs a field of normals, 300+ fights; expected effect on win% against an equal normal man 40 to 45% for a pure weakness, 55 to 58% for a strength (not more).

### 5.1 Trait effects

| Trait | Sim effect (multiplier or shift) |
|---|---|
| Iron chin | KD threshold x1.25. Hurt-state duration x0.8. Stoppage after 3 KDs unchanged |
| Glass jaw | KD threshold x0.8. Hurt chance from a clean head shot +25%. Wobble on counters at lower damage |
| Quick recoverer | `hurt`/`shook` timer x0.7; KD recovery on the count +15% |
| Slow recoverer | `hurt` timer x1.35; on-rise legs shaky +1 s |
| Body-shy | Body-shot damage x1.25; guard drop 1.5 s after a clean body hit; body KD chance x1.4 |
| Slow starter | R1 `paceMult` 0.75 (default 0.85); R2 0.9; accuracy -8% R1-2 only; from R4 +3% accuracy |
| Fast starter | R1-3 `paceMult` 1.1; power +5% R1-3; `tank` -8% (burns early) |
| Strong closer | R10+ and last 30 s of any round: output x1.1, `tank` drain x0.85 from R9. `stealer` +0.2 |
| Fades late | `tank` drain x1.25 from R6; max output x0.8 after R9 |
| Cut-prone | `CUT` open threshold x0.6; reopen +40%; cut damage per punch x1.3; doctor look earlier. Bleeds more, so the fight is stopped earlier |
| Dangerous when hurt | While `hurt` or after a KD: counter chance +15% (veteran: +25%), power x1.15, fear/panic roll halved. Window ~10 s |
| Quitter | Under pressure after a KD: 5% per exchange to turn away; `heart` -20 |
| One-punch power | Each landed power shot rolls KD chance x1.25. No accuracy change |

### 5.2 The "dangerous when hurt" mechanic
- Hurt-state rally roll, once per hurt event: `p = 0.04 + 0.01 * veteranBonus + 0.08 (if trait)`; `veteranBonus = min(fights/10, 5)` (0 to 5), so a plain novice 4%, a plain 50-fight man 9%, a trait man 12 to 17% (est.).
- On success: 8 s of "live" state: counter chance +25%, KD power +30%, panic suppressed, plus the attacker's `finisherInstinct` check (he must respect it; `mind_finish.md` 1d).
- Cap at 1 rally per fight per fighter, so it stays a surprise.
- Commentary hook: "He's hurt but he's still dangerous!".

### 5.3 Roll rates on a new fighter

| Group | Rate |
|---|---|
| Chin: iron / solid / glass | 5% / 87% / 8% (not 100%: 1 chin trait max) |
| Cut-prone | 10% |
| Start: slow / fast / neutral | 16% / 13% / 71% |
| End: strong closer / fades late / neutral | 9% / 13% / 78% |
| Body-shy | 7% |
| Quick recoverer / slow recoverer | 7% / 7% |
| Dangerous when hurt | 5% (plus power punchers: +5%) |
| Quitter | 3% |
- Cap: 2 born traits per fighter at random (3 for "freak" stars). Overall ~45 to 50% carry one, ~15% two (est.).
- Pair rules from section 4: roll a fast starter first; strong closer then rolls at 4%.

### 5.4 Earned and lost: triggers

| Trait | Gained when | Lost when |
|---|---|---|
| Glass jaw | KO'd twice in 12 months (not KD only), or 3 KO losses in a career, or 1 KO loss after a 12-round war. Chin wear >= 10 (`mind_between.md` 5a) | 18+ months without a KD and a new defensive coach: downgrade to "solid" (50% chance, never to iron) |
| Iron chin | Never | After 3 KO losses, or age 38+ with 2 stoppage losses |
| Cut-prone | 3 cuts over a career in the same brow; or any cut that ended a fight | Surgery between fights (30 days out): -50%; or a rematch camp, once |
| Slow starter | Loses R1-2 on cards in 4 of the last 6 fights | A camp where the corner drills the start, 60% over 2 fights; goes after 2 fast wins |
| Fast starter | Wins 3 fights by KO in R1-4 | Gassed out of 2 fights after R8; age 34+ |
| Strong closer | Won 3 fights from behind in R9-12, or stopped a man late twice | Age 36+; two late KO losses |
| Fades late | Loses 2 fights where R10+ got worse, or a weight cut > 5 lb two fights running | A new camp with a conditioning plan |
| Dangerous when hurt | Survived and then won after being dropped or hurt (2 times, or a comeback KO once) | A second KO loss in 12 months, or a KO loss after age 35 (the answer is gone) |
| Body-shy | A body KD or 2 body stoppage/KDs in a career | Corner drills it (shell/elbows) and he takes 5 body shots without a guard drop in a fight |
| Quick recoverer | Gets up from a KD and wins in 2 fights | Age 36+ |
| Gun-shy (not a trait, a state) | After KO loss, per `mind_between.md` | A win |
| Quitter | Stops fighting back in a loss (stopped on the stool) | A comeback win |

Hysteresis: a trait that appears has a one-fight "forming" message ("he looks shaky"), and a confirm on the next trigger. A trait at "earned" strength is 0.6x the born effect until it has held for 5 fights (est.).

### 5.5 Surfacing
- Corner/commentary: traits are read from the fighter's history, not shown as stats. Scouting report (`tests/scout.js`) lists "known for" after 20 fights.
- Opponent brain: a man who knows (via `F.mem`) that his rival is a glass jaw hunts earlier (`finisherInstinct` +), a cut-prone man gets cut-aimed jabs/hooks (head, brow) in the corner call.

---

## Sources (search snippets only, pages not fetched)
- Chuvalo never down 93 fights: gvwire.com 2026-09-14 (AP), adn.com 2026-09-19, roundbyroundboxing.com. McCall: list site (unverified).
- Klitschko-Sanders, Brewster, Steward: Wikipedia, ESPN 2003, worldboxingnews.net, Sky Sports, ESPN story 11873997.
- Corrales-Castillo 1: Wikipedia (Diego Corrales), CBS Sports oral history, Las Vegas Sun 2005. Mayweather-Corrales: Wikipedia, boxingscene, CBS.
- Hearns-Barkley 1 and 2: Wikipedia, boxingonly.net, SI Vault 1992. Hagler-Hearns: Wikipedia, badlefthook.
- Fury-Wilder 3: Gulf News, CBS Sports, ESPN. Wilder-Ortiz 1: ESPN, PBC, CBS. Fury-Wallin: ESPN, Sporting Life, AP, Boxing News.
- Froch-Taylor 1 and Groves 2: Ring "top 5 come from behind", Honolulu Advertiser 2009, badlefthook 2014. Ring list also: Moore-Durelle, Duran-DeJesus, Basilio-DeMarco.
- Tszyu-Hatton: Wikipedia (both pages), BoxRec forum (Collazo fade, unverified).
- Hopkins slow starter: Philadelphia Inquirer 2012-04-27, round-by-round accounts (Shumenov, Pascal II), boxingscene.
- Pacquiao after Marquez 4: boxingscene 2014 (Hatton), tss.ib.tv.
- Cuts: boxingnewsonline "10 worst cuts" (Marciano, Cotto), Vice (Diaz), ufc.com NYT (Davis), Sports Med Open 2025 (s40798-025-00871-4, 29%), fightersonly.
- KD/KO data: agentmma.com knockdown survival (3,005 fights, 86.1%, 910 fights, 34.4%) and knockout loss repeat risk (705 fighters, 22.7%); ufcalendar.com (13.9% vs 25.3%; 27.5% vs 19.1%); Phys Sportsmed 2024 (PubMed 37990916, FES 0 and heavyweights higher KO/TKO); Wikipedia chin page.
- Gatti-Ward 1: SI Vault 2003, boxingscene (referee quote), ESPN.
