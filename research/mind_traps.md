# The Mind of a Boxer: traps and adjustments (across rounds, between rounds, before the fight)

Scope: how pros SET TRAPS over time and ADJUST (in the round, between rounds, before the fight). Does not repeat `mind_engage.md` (cues, reading phase), `mind_combos.md` (combo grammar, counter table, set-up chains 5.1-5.6) or `mind_vision.md` (tells, feints vs the read).
Sourcing: the proxy blocked every page fetch (beehiiv, dynamicstriking, evolve all failed), so everything comes from search-result text. Tags: **[snippet]** = search result text quoting or summarising an outlet (outlet named), **[mem]** = my own knowledge, not checked this pass, **(est.)** = my design guess. Quotes are as the outlet reported them; verify before using them as game text.

---

## 1. Traps

### 1.1 What a trap is (the shared model)
A trap has three parts: **bait** (a look you show), **conditioning** (he answers it the same way often enough to stop thinking), **payoff** (you hit where that answer puts him).
- "When you give an opponent the exact same look three times in a row, their brain stops calculating and starts automating its defense." The repeated sequence continues "until they get the reaction that they desired", then the fighter punishes the commitment. [snippet: Doc's Corner, "The art of setting traps"]
- Atlas compares it to fishing: with enough IQ and skill "you can start to try to reel in and bait your opponents." Simplest bait: "throw a jab and step back which should invite the other fighter to step in and commit to throwing a straight right." His line: "Set a trap, but there is no cheese over here for the traps... just punches." [snippet: Dynamic Striking, Teddy Atlas]
- Coldwell on Usyk: "It's quite easy to fall for [Usyk's] baits and his triggers. He won't look to hurt you with every shot. He'll look to position you for another shot, look to knock you off balance, or break your rhythm or stop you from throwing a shot." [snippet: Sky Sports, Joshua vs Usyk revisited]
- Mayweather's jab "serves as the perfect bait": the counter window is tiny, and the opponent's counters "serve only to open them up for Mayweather's counter." His guard works as a funnel toward a few targets. [snippet: MMA Sucka, Mayweather Style Guide]

**Rule of thumb:** the bait must be a real, scoring, safe shot on its own (the jab, a body jab), so showing it costs nothing even if he never bites. A trap built from a risky bait is just a gamble.

### 1.2 Trap types with named examples

| Trap | Bait | Conditioned answer | Payoff | Example (round) |
|---|---|---|---|---|
| Show it, change it | Same combo/opener 2-4 times | He blocks/slips the known last punch | New ending around the block (1-2 → 1-2-3), or 1\|2 | Generic teaching [snippet: Doc's Corner]; Foreman vs Moorer (below) |
| Throwaway shot moves the head | Soft jab / short left | Head moves the same way every time | Right hand where the head goes | Foreman vs Moorer 1994: throwaway jabs and lefts moved Moorer's head, short left then right KO in R10. Atlas (Moorer's trainer) says he saw the plan "during the eighth and ninth rounds" and warned Moorer to keep his distance [snippet: Dynamic Striking / Atlas]. So: ~2 rounds of visible setup, sprung in round 3 of it |
| Draw the lead | Jab and step back, or lowered lead hand, or a lean | He steps in with a lead / reaching jab | Pull counter, counter right | Atlas basic trap [snippet]; Mayweather lean + low lead [mind_combos 3]; Atlas to Bivol vs Canelo: counter right hands over his jab "to make Canelo hesitant to jab" [snippet: Planet Sport] |
| Counter the lunge | Stand at the edge of his range, let him win the early exchanges | He gets confident and lunges in behind the jab | Counter right as the shoulder moves | Marquez vs Pacquiao 4 (Dec 2012): "We knew he was going to come out aggressive. We knew we had to capitalize on that." "We always work on that [counter right]." KO at 2:59 of R6: "Marquez shot forward with his own counter right the instant Pacquiao's shoulder shifted forward" behind a jab [snippet: TSS / Reuters]. Pacquiao was ahead on the cards [snippet]. The same right had already dropped Pacquiao in R3 [mem] |
| Body investment | Body jabs, body hooks every round | Elbows drop, he bends, legs go | Head shot over the low guard, or the body shot that finishes | Inoue vs Fulton 2023: varied jab heights early, head and body jab "kept to his game plan" in R4, a body jab in R8 dropped Fulton's right hand, right over the top, stopped in R8 [snippet: RingTV, Mark Whicker]. Ward vs Kovalev 2 (2017): sustained body attack from ~R5, Ward "saw Kovalev reacting to body shots", stopped in R8 [snippet: ESPN/Pressreader]. Fury vs Wilder 2: KD from a left to the body in R5, stopped R7 [snippet: Ring]. Canelo vs Smith R9, Bam vs Estrada R7 [mind_combos 5.6] |
| Rhythm break | Tap/touch on a steady beat | He times his defense and his counters to the beat | Off-beat shot, half-beat early or late | Usyk (mind_combos 5.3, fighters_a); Coldwell "break your rhythm" [snippet] |
| Feint pattern | Feint the same punch 2-3 times with nothing behind it | He stops reacting to that feint (or over-reacts) | The real punch off the same look, or a different punch into his reaction | Usyk "flicked his right as a feint, then the straight left" [mind_combos 2]; FEINT_READ already models trust wear |
| Push him into the weapon | Attack one side | He moves away from it, toward your other hand | The hand he moved into | Donaire vs Inoue 1 (R2): attacked Inoue's jab side "to push him toward his left hook"; when Inoue popped up throwing a hook with the right guard low, Donaire's counter hook hurt him [snippet: Bradley, ESPN] |
| Ropes trap (rope-a-dope) | Lie on the ropes, cover | He punches himself out | Fire off the ropes when he's tired | Ali vs Foreman 1974: on the ropes from the start of R2; Dundee: "When he went to the ropes, I felt sick." Ali: "I know what I'm doing." [snippet: Britannica/Fight City]. KO R8 [mem]. A world-class, once-in-a-career trap: needs elite chin and composure |
| Counter the counter | Throw the punch he loves to counter, half-committed | He fires his favourite counter | Your counter to his counter | Mayweather (above); Locche/Benitez style [mind_engage S11] |

### 1.3 How long until it's sprung (repetitions and rounds)
- **Within a round (micro-trap):** 2-4 identical looks, sprung on the 3rd-5th. "Three times in a row" is the teaching number [snippet: Doc's Corner]. Engine already: `change` setup fires after 2 identical throws.
- **Across rounds (macro-trap):** the bait is shown for 2-5 rounds before the payoff, and the payoff usually lands **R5-R9** in a 12. Data points: Foreman-Moorer ~2 rounds of visible setup then R10; Marquez-Pacquiao 4 counter right shown R3, sprung R6; Inoue-Fulton body jab from R1, payoff R8; Ward-Kovalev 2 body from R5, payoff R8 (3 rounds); Fury-Wilder 2 body KD R5, finish R7; Canelo-Smith R9, Bam-Estrada R7.
- **Across fights:** Marquez had 36+ rounds of Pacquiao before fight 4. In fight 1 Beristain told him "to look out for the left hand because Pacquiao has power and speed in this punch" and he "changed during the fight, moved my body, started landing combinations" [snippet: TSS, Marquez]. Rematches are where traps are deepest (§2.1).
- **Payoff once, then it decays.** After a trap lands, the victim stops biting on that bait (Inoue: "from then thereafter I made sure I didn't take that punch again", mind_engage 3). Elite trappers then use the mirror: Inoue got countered by Donaire's left hook in fight 1, and in fight 2 won with his own left hooks in R2 [snippet: Dan Rafael, CBS].

### 1.4 How opponents detect and beat traps
- **Notice the "too easy" look.** Atlas read Foreman's throwaway-shot plan after two rounds and told Moorer to keep distance [snippet]. Detection = seeing the bait repeated without real intent behind it (low commitment, same rhythm).
- **Don't bite on schedule:** vary the answer (block one time, step back the next, ignore the third), so there's no conditioned response to punish. (est., standard gym teaching)
- **Remove the trigger, not just the payoff:** McIntyre noticed Spence "will hardly bring his feet with him when he goes to the body" and starts with a jab; plan was to not stand still and get off the ropes before Spence's double jab to the body [snippet: Bad Left Hook]. Crawford's camp also built a firmer jab "so we could neutralize his" [snippet: Mark Whicker].
- **Don't lead into a counter man:** Pacquiao's mistake in PM4 was the lunging jab while ahead on points. A lead protects a fighter only if he lowers risk (mind_engage 5).
- **Counter-trap:** Ortiz vs Loma: "Once he worked out one problem Ortiz would bring a new one into play" [snippet: Bloody Elbow]. A fighter who keeps changing the look denies the read.
- **Cost of detection:** the detector has to give up something (stop jabbing, stop leading, hold more), which cuts his own output. That's the trap's hidden win even when it never springs. (est.)

---

## 2. Adjustments

### 2.1 Rematch and between-fight changes (the biggest, slowest adjustments)

| Fight | What changed | Result |
|---|---|---|
| Bivol vs Beterbiev 2 (Feb 2025) | Stood flat-footed in front instead of moving on his toes, sat down on punches, combinations, then mixed in and-out and lateral movement again; leg massages between rounds ("stamina would be key"). Beterbiev stepped on the gas in R5 [snippet: CBS, DAZN]. Fight 1: Bivol faded late after early body work [snippet] | Bivol MD. CBS: his "ability to make adjustments to the data he'd accumulated over their time in the ring together was the difference" |
| Fury vs Wilder 2 (2020) | From boxing on the back foot (fight 1) to walking him down at ~273 lb, jab and right hand, body, leaning on him. Fury: "This time I wanted the knockout"; SugarHill: "use the jab, box him and control and keep coming at him, be aggressive" [snippet: ESPN, Ring] | KD R3 (right), KD R5 (body), stopped R7. Wilder 3: "one plan and that was to knock Fury out", no Plan B [snippet: Sowetan] |
| Canelo vs GGG 2 (2018) | Reynoso on fight 1: "we had a great plan... but we needed 40 more punches"; "Just throw more punches... we have to be more active"; later said they "changed their entire game plan" [snippet: Sportskeeda, SCMP] | Canelo MD (went forward more [mem]) |
| Ward vs Kovalev 2 (2017) | Start the attack earlier than fight 1; smother and move, then body from R5; Hunter trained him "for a knockout" [snippet: ESPN/LA Times] | TKO R8 |
| Joshua vs Ruiz 2 (2019) | McCracken: jab-heavy, hit from outside, never give a stationary target; ~11 lb lighter. Ruiz knew it was coming ("would try to box him around") but couldn't stop it [snippet: Yahoo/Sky] | Joshua UD |
| Crawford vs Spence (2023) | Firmer jab instead of the usual flick, counter jab to beat Spence's jab, read Spence's body-jab entry [snippet: Whicker, BLH] | KD R2 (counter jab + left), stopped R9, 60% power connect |
| Usyk vs Joshua 2 (2022) | Joshua: committed body attack (his best success, peak R9). Usyk changed plan **from R4**: "circle more and fire off combinations with the intention to touch Joshua more than hurt him" [snippet: CBS]; tied up inside to survive R9, took R10 | Usyk SD |

Takeaway: between fights, camps change the BIG dial (range, who leads, body share, tempo, stamina plan). Within a fight, they mostly change one smaller thing.

### 2.2 In-fight adjustments: how long they take

| Who | Fight | Adjusted at | What |
|---|---|---|---|
| Crawford | vs Brook | R3 (lost R1-2) | "gained enough information to make the key adjustment, moving lefty on a full-time basis in Round 3"; KO R4 [snippet: CBS] |
| Crawford | vs Porter | R1 by his account | "figured Porter out in Round 1", but early southpaw switch "didn't necessarily work" and "the biggest adjustment... was dialing in a vicious body attack"; stopped R10 [snippet: CBS/Fox] |
| Mayweather | general | R3-4 | "usually takes three or four rounds to read an opponent" [snippet: Round by Round]; vs McGregor the shift came R4, stopped R10 [snippet: AP]; vs Maidana 1 not solved until ~R6 [snippet: forum, weak] |
| Usyk | vs Joshua 2 | R4 | circle + touch (above) |
| Usyk | vs Fury 1 (May 2024) | R7-8 | Fury controlled early (jab, body uppercuts, showboating); Usyk worked the body and footwork in the middle rounds, took over R8, R9 KD at the bell, SD. Stats 170/407 vs 157/496 [snippet: CBS, Ring, Yahoo] |
| Marquez | vs Pacquiao 1 (2004) | after R1 | dropped 3x in R1 [mem]; corner: watch the left hand; he moved his body, combinations, distance. Draw [snippet: TSS] |
| Lomachenko | vs Lopez (2020) | R8 | landed 31 punches in R1-7, "finally picking up the pace in the eighth" [snippet: AP]. Loma: "in the second half, I took it over" [snippet: BoxingScene]. Lost UD: the classic "waited too long" |
| Canelo | vs Crawford (2025) | never | "seemed unable to make in-fight adjustments"; Marquez: the corner did not put in strategy or change the style; Durán: Reynoso "didn't teach him anything for this fight" [snippet: eldiariony, laopinion] |
| Canelo | vs Bivol (2022) | never really | Bivol's jab, combos, early body shots; Canelo "didn't go to the body as much as expected" [snippet] |
| Wilder | vs Fury 3 | never | one plan: the KO [snippet: Sowetan] |

**Spread:** world-class adjusters 1-4 rounds (median ~3); good pros 4-6; slow or stubborn 7+ or never (est. from the table). The failure is not "can't" but "doesn't in time": Loma (R8 of 12), Canelo vs Crawford.

### 2.3 What corners actually say (between rounds)
- **Study (amateur, 2015 Australian championships, 12 coaches, 25 bouts, 445 statements):** ~8 statements per round. Coaches gave more controlling (53%) than autonomy-supportive (6%) and more positive (29%) than negative (12%) feedback. **Winning bouts got less internal and less controlling feedback and more positive feedback** than losing ones (may not be causal) [snippet: Halperin et al. 2016, Psychology of Sport and Exercise].
- Common content (est. from the fights above): one tactical change (jab more, go to the body, turn him, cut him off, stop leading), one physical cue (breathe, legs, hands up), one belief line ("you're winning", "he's tired").
- Examples: Beristain "look out for the left hand" (Marquez-Pacquiao 1); Fulton's corner in R6 "hold the center of the ring and not retreat to the corners" [snippet: Yahoo]; Reynoso before R12 vs Bivol "you can't knock him out anymore" (mind_engage 5); Dundee reportedly "felt sick" and had no say once Ali chose the ropes.
- Corners sometimes have no plan: Roach on Fury's team before Wilder 1: "They didn't really have one set... It was dependent on Tyson doing things himself" [snippet: Sporting Life]. Fury adjusts himself; Wilder doesn't.

### 2.4 Mid-round adjustments
- **Taken the same counter twice: stop that lead** (Inoue vs Donaire 1, mind_engage 3).
- **His weapon is working: take away the lane.** Usyk circled to his right vs Joshua "to limit the potential threat of Joshua's big right hand" [snippet: Boxraw].
- **Hurt: tie up inside to smother**, then answer next round (Usyk R9-10 vs Joshua 2) [snippet].
- **Trapped on the ropes: lock and pivot** (Mayweather vs Maidana: "locked Maidana's arms and pivoted away"; also planted and threw from underneath when Maidana weaved in) [snippet: Spin.ph].
- **Stance switch to change the picture** (Crawford vs Brook R3; Pavlik's advice to switch vs Canelo so he "couldn't settle in") [snippet].
- Mid-round changes are small and local (one punch, one direction, one distance). Big plan changes happen at the stool. (est.)

### 2.5 Elite vs average: what differs
1. **Speed of the diagnosis.** Elite name the problem in 1-3 rounds and act; average see it at 5-8 or never (2.2).
2. **Number of plans.** Elite have a Plan B and C they can run well (Bivol: mover AND flat-footed puncher; Crawford: orthodox, southpaw, body, counter jab; Usyk: outbox, then touch-and-circle, then clinch inside). One-dimensional fighters only have "more of the same, harder" (Wilder 3: "one plan").
3. **Change one thing, not everything.** Successful in-fight changes are one dial (stance, body share, range, who leads). (est., consistent with every case above)
4. **They accept losing early rounds to read** (Crawford, Mayweather, Usyk vs Fury) but not more than ~3-4 (Loma vs Lopez is the line being crossed).
5. **They hide what they know.** Marquez showed the counter right once (R3 KD) and waited three rounds for the lunge that let it land clean. (est. reading of [mem]+[snippet])
6. **Average fighters adjust to emotion, not data:** frustration → load up and chase; fear → stop punching. (mind_vision; est.)

---

## 3. Pre-fight game plans

### 3.1 Film study and camp
- Active pros analyse footage of future opponents to find tendencies; camps hire sparring partners to mimic the style [snippet: getphysical/warriorpunch, generic]. Limits: Fielding's trainer: "no combination of sparring partners can fully provide what the Mexican champion brings," so he looks for partners who bring "certain elements" [snippet: Fightful].
- Some fighters skip tape: risk of too much respect, and the opponent may have fixed the flaw you saw [snippet: warriorpunch].
- What camps prepare (examples): Roach vs Hatton ("pumps his hands before he throws... a sucker for a right hook", mind_engage); McIntyre vs Spence (body-jab entry, footwork); Marquez vs Pacquiao 4 (counter right "for four months" [snippet: Philstar]); Atlas to Bivol (jab "at the right place and time and distance", too close invites a right-hand counter [snippet: Planet Sport]); Fury-Wilder 2 (size, jab, right hand, aggression).
- **Pattern:** a camp plan = 1-2 tendencies to exploit + 1 weapon drilled (a specific counter or body attack) + a target range/tempo. Not a script.

### 3.2 How fast a plan is abandoned
- "Everybody has a plan until they get punched in the mouth" (Tyson) [mem].
- Signals that kill a plan (from the cases): getting dropped or badly hurt (Marquez R1 vs Pacquiao 1: changed at once), losing 2-3 rounds clearly with the plan working as designed but not scoring (Crawford vs Brook R3, Usyk vs Joshua 2 R4), the opponent showing something new (rematch surprise: Fury came forward in Wilder 2; Wilder never found an answer).
- Good corners also **keep** a working plan through a bad round: Inoue vs Fulton "kept to his game plan" in R4 while Fulton went inside [snippet]; Ward kept investing in the body. Sticking with a plan that's working slowly (body work) is as much a skill as changing.
- Stubborn failure: Canelo vs Crawford and Canelo vs Bivol, same plan for 12 rounds; Wilder 3.

---

## 4. For the brain (implementable rules)

Fits `brain/brain.js`: `mem` (mine/his/lead/after/def/hurt/feints), `plan` (jab/power/body/range/initiative), modes (feelout/work/press/burst/counter/reset/survive/hunt), `startSetup`/`stepSetup`, `rest()`. All numbers (est.), sim before trusting. Skills: k.read, k.feints, k.counter, k.adjust, k.body, k.pacing; tiers novice (~34) / intermediate (~56) / pro (~74) / world (~90).

### 4.1 New state
```
this.bait = {}        // per bait id (my combo id or 'jabStep', 'lean', 'bodyJab', 'beat'):
                      //   { shown, resp: {block,slip,pull,duck,roll,counter,none,stepIn}, lastR, sprung, paid }
this.trap = null      // active macro trap: { kind, bait, payoff, armedAt, needShows, startedR, until }
this.bodyBank = 0     // body punches landed, faded x.85 per round; his guard-drop flag after body hits
this.gamePlan = null  // pre-fight plan (4.6): { focus, range, lead, weapon, conf, rounds }
this.planAge = 0      // rounds since the last between-round change
this.beat = { iv, n } // my own touch rhythm (mean interval of jabs/touches)
```
His side (detection): `mem.after` already counts what follows what. Add `mem.baitSeen[id]` = how often he saw this exact look followed by a different payoff (got trapped by it).

### 4.2 Recording the conditioned response
- After every bait thrown, log his answer in `bait[id].resp` (the defense he used, or 'counter' if he fired back within .5 s, 'stepIn' if he moved forward into range).
- **Conditioned** = `shown >= needShows` AND top answer share `>= .6` over the last 4-6 shows (use the faded counts like `mpeek`).
- `needShows`: world 2, pro 3, intermediate 4, novice never builds a macro trap (est.; "three times" teaching number).
- Noticing it at all is gated by read: chance per show to update the ledger = `.3 + .7 * k.read` (a novice doesn't watch what his jab does).

### 4.3 Trap catalog (bait → conditioned answer → payoff)
Reuses the `react` table already in `stepSetup` for feint-to-draw; same shape, longer horizon.
```
SHOW_CHANGE  bait: combo X        answer: block on last punch  → X with last punch swapped (2→3, 3→6, head→body); or 1|2 if he parries the 1
                                  answer: slip outside           → X + hook where he slips to
                                  answer: pull back              → X with a step-in double jab first (cover the gap)
                                  answer: counter after X        → X half-committed, then MY counter (counter the counter, gate k.counter >= .7)
DRAW_LEAD    bait: jab + step back (or low lead hand, lean)   answer: stepIn / lead jab / reaching cross → pull counter (cross), or counter right over the jab
                                  gate: k.counter >= .6, trait patience >= .4; best in counter mode
LUNGE        bait: stay at the edge of his range, let him win a few exchanges  answer: he lunges behind a jab when ahead or confident
                                  payoff: counter right on his shoulder move (react() priority + big tech); needs his `mem.lead` entry rhythm
BODY_BANK    bait: bodyJab / body hooks every round   answer: guard drop after body hits, slower legs (he.stam), bends
                                  payoff: head-ending combos (1b-2, 3b-3, 1-2-3b-3 → head) x(1 + min(.6, .1*bodyBank)), plus body finisher when his stam < .4
BEAT         bait: touches on a steady beat for 20-40 s    answer: his counters/defense timed to it (his reaction latency drops)
                                  payoff: off-beat shot (half-beat early) or a skipped beat then a 2-punch; gate k.feints >= .6
FEINT_FLIP   bait: feint X 2-3 times with no follow    answer: his bite on X falls (FEINT_READ already)  → real X off the same look
                                  answer: still over-reacts                        → feint X, hit his reaction (existing feintHook)
PUSH_SIDE    bait: attack his jab side, step to it     answer: he moves toward my other hand            → my lead hook as he arrives (Donaire)
```

### 4.4 Timing rules
- **Micro (inside a round):** after a combo is shown 2x and his answer was the same both times, chance to spring the change on the next use = `.25 + .6 * k.read` (world ~.8, novice ~.45 and it's often the wrong change). Current code springs `change` purely on my own repetition: gate it on HIS answer being the same (4.2), else it's noise.
- **Macro (across rounds):** start a trap only after feelout (round >= 2, or after `readLevel` threshold). Show the bait at 1.3-1.6x its normal weight while `trap.armed` is false. Spring when conditioned AND (round >= startedR + 1). Typical spring: R4-R8 of 12 (scale by rounds: 35-70% of the fight).
- **Spring chance once armed:** per opportunity `.35 + .4 * k.counter` (the counter or the swapped combo), not 100%: real traps also need the moment (he steps in, feet set).
- **Hide the payoff:** before arming, payoff punch weight x.7 for that pattern (don't burn it early). Exception: one "taste" is allowed (Marquez R3), after which the payoff is hidden again for >= 1 round (world class only, est.).
- **After a payoff lands clean:** that bait is `paid`. His bite on it drops (his side: `mem.baitSeen[id]++`, his answer to that bait randomizes at `.5 + .4 * k.read`). Mine: payoff weight x.5 for the rest of the round, x.75 next round. World class switch to the mirror trap (same bait, different payoff, or the payoff as a lead).
- **Abandon a trap** if: 2 rounds armed and never sprung, his answer changes (no longer conditioned), I'm behind by 2+ rounds late and need volume, or I'm hurt.
- **Body bank timing:** bodyBank pays from round 3+, peaks R6-R9; `softBody` style weight when his stam < .5. Keep investing even in a round I lose if bodyBank is rising and he's showing guard drops (Ward/Inoue rule: "kept to his game plan").

### 4.5 Detecting and beating traps (his brain, same rules)
- **"Too easy" detector:** when the other man shows the same low-commit look >= 3 times in a round (commit < .3, same id), chance to flag it as bait = `.15 + .7 * k.read` (Atlas on Foreman). Flagged → his answer to that look randomizes, and he stops leading into it (lead weight x.6 for that line).
- **Don't lead into a known counter:** if he's been countered off the same lead 2x this round → that lead x.5 for the round (mind_engage Inoue rule, keep). Add: if ahead on his card and the other man is a counter type (mem shows counters >= 30%), lunge/lead commitment x.7 (the Pacquiao 4 lesson).
- **Vary the answer:** world-class defenders keep their top defense share under ~55% vs a repeated look (rotate block/slip/step out). Novices sit at 75-90% one answer (est.).

### 4.6 Pre-fight game plan (set before round 1)
- Camp quality `cq` (corner skill or average of k.read and k.adjust) seeds `mem.his/lead/def` from his profile's habits at `.3 * cq` of one round's weight ("film study"). Rematch: seed from the actual first fight at `.6` weight.
- **Plan surprise:** each fighter has a 10-20% chance (higher in a rematch after a loss, ~35%) to come with a different style dial (range ±12, initiative ±.3). A seeded read that doesn't match what he does fades 2x faster (the Fury-Wilder 2 problem).
- `gamePlan = { focus: 'body'|'jab'|'counter'|'pressure', weapon: one payoff punch, range, conf }`. It biases `plan` +.15 on its dials from round 1 and drives which macro trap is preferred (body focus → BODY_BANK, counter → DRAW_LEAD/LUNGE).
- **Abandon the game plan** when: knocked down; or lost 2 of the last 3 rounds with the plan's main dial unchanged; or his style differs from the seed (surprise). Patience before abandoning, by tier: world 1-2 bad rounds (with a clear signal) but keeps a plan that's working slowly (bodyBank rising); pro 2-3; intermediate 3-4; novice never abandons, he just gets emotional (frustration → load up).

### 4.7 Between rounds: `rest()` upgrades
Today: one change with chance `adjust^1.4 * (lost ? 1 : .25) * (1 + .5*lost2)`, else plans fade x.8.
- **Diagnose before changing.** Score each candidate with data the brain already has: connect rate by category (`punchVal`), counters taken (`mem.mine.c`), damage taken by range (`mem.hurt`), bodyBank trend, trap state. Pick the top one only (one main change; elite may stack a second small one).
- **Give a change time:** `planAge` must be >= 1 before the same dial changes again, unless the round was lost badly (10-8 or hurt). Reverting a change that just failed counts as a change.
- **Adjust delay by tier** (rounds of clear losing before the change fires, est., from 2.2): world 1-2, pro 2-3, intermediate 3-5, novice 5+ or never. Implement as `ch *= clamp((lostStreak - delay + 1) / 2, .15, 1.2)` with `delay = lerp(5, 1, k.adjust)`.
- **Plan B menu size by skill:** novice draws from 2 options ("more of what works", "go to work"), intermediate 4, pro 6, world all + stance/range flips. A low-repertoire fighter whose only option is "more power" turns into Wilder 3: `plan.power +.2`, `initiative +.2`, nothing else.
- **New options worth adding** (all seen above): `switch stance` (Crawford R3; gate k.angles/footwork >= .7 and a switch-hitter trait), `tie him up inside` (Usyk vs Joshua R9), `stand and sit down on it` (Bivol-Beterbiev 2: range -6, power +.15, lat .5x), `circle away from his power hand` (Usyk vs Joshua), `bank the body, keep going` (plan.body stays, no fade, when bodyBank is rising and he's guard-dropping), `spring the trap now` (arm the macro trap next round).
- **Keep what works:** if won the round and the last change is the reason (its dial's category value rose), no fade on that dial; fade the others.
- **Tone (for corner talk):** the study says winners heard more positive, less controlling talk. Corner line = 1 instruction + 1 positive; avoid 3+ instructions (they get ignored, est.).

### 4.8 Mid-round adjustments (no stool)
```
every ~10 s of round time, check (chance k.read * .5 + .2):
  countered off same lead 2x this round          -> that lead x.5 (exists in spirit; keep)
  his best weapon landed 3x this round            -> move away from that hand (lat dir), range +6 for 15 s
  losing exchanges at this range for 45 s         -> range ±8 toward the side I'm winning (temp, decays by round end)
  on the ropes 2x in 30 s                         -> pivot/lock exit priority up (Mayweather vs Maidana)
  body landing and he drops elbows (flag)         -> switch next combo to head-ending (exists in mind_combos plan)
```
World class also does one bigger in-round switch per fight (stance or full mode change) when losing the round clearly at the 1:30 mark: chance `k.adjust^2 * .5`.

### 4.9 Skill gates (summary)
| Tier | Micro traps | Macro traps | Reads traps | Adjust delay | Plan B menu |
|---|---|---|---|---|---|
| Novice | rare, often the wrong change | none | almost never; same answer 75-90% | 5+ rounds or never | 2 |
| Intermediate | show-change after 3 | body bank only | sometimes (3+ repeats) | 3-5 | 4 |
| Pro | 2-3 shows, mostly right | body bank, draw lead, show-change | often | 2-3 | 6 |
| World class | 2 shows, picks payoff from his answer | all, incl. lunge, beat, mirror trap after payoff | hides answers, flags baits | 1-2, keeps slow-working plans | all + stance/range flips |

### 4.10 Telemetry and tests
- Log: traps started / armed / sprung / landed, round sprung, payoff damage, rounds to first change, change kinds per tier. Commentary hooks: "He's been showing that jab all night... THERE it is", "He's figured out the 1-2", "Different fighter this round".
- Checks (est. targets): world class should spring 1-3 macro traps per 12, mostly R4-R9; novice none. Rounds-to-first-adjust medians ~2 (world), ~3 (pro), ~5 (intermediate). Trap payoffs should not push KD rate above the audit target (body KDs 5-8%); run `node tests/brain.js adapt 300` and `node tests/bvo.js 300` before and after.

---

## Sources (search-result text only; pages not opened)
- Doc's Corner #3 "The art of setting traps" (docscorner.beehiiv.com); Dynamic Striking, Teddy Atlas traps pages; Evolve MMA "5 boxing traps" (titles only)
- Marquez-Pacquiao 4: TSS ("Marquez was skillful surgeon"), Philstar 2012-12-12 "Marquez patience pays off", BoxingScene "Nacho admits he shocked", Reuters-based reports; TSS 2008 "Marquez diet: no more eating 1st round lefts"
- Bivol-Beterbiev 2: CBS results/takeaways, DAZN "two big changes", ESPN live blog, BoxingScene preview
- Fury-Wilder 2/3: ESPN Africa "surprise move", RingTV ?p=623986, Sky Sports, Sowetan 2021-10-15; Roach on Fury: Sporting Life
- Usyk-Fury 1: CBS takeaways, Ring, Yahoo; Usyk-Joshua 2: CBS live, Boxraw breakdown, Sky Sports revisited (Coldwell)
- Canelo-Bivol: Boxraw, Planet Sport (Atlas); Canelo-GGG: Sportskeeda (Reynoso), SCMP; Canelo-Crawford: eldiariony, laopinion, CBS, SI
- Crawford: Mark Whicker Substack, Bad Left Hook (McIntyre), CBS Porter/Brook live blogs, Fox News
- Loma-Lopez: AP via KSAT/News3LV, BoxingScene "I took over second half"; Loma-Ortiz: Bloody Elbow; Loma-Kambosos: ESPN
- Inoue-Fulton: RingTV, Mark Whicker; Inoue-Donaire: ESPN (Bradley), Dan Rafael, CBS
- Ward-Kovalev 2: ESPN, Pressreader (Orlando Sentinel, LA Times)
- Mayweather: Round by Round Boxing, AP (McGregor), MMA Sucka style guide, Bloody Elbow, Spin.ph (Maidana)
- Ali-Foreman: Britannica, The Fight City; Joshua-Ruiz 2: Yahoo, Sky Sports, SI
- Halperin et al. 2016, "Coaching cues in amateur boxing", Psychology of Sport and Exercise (ECU/ACU/UNLV repositories); Warwick, File "Focus on coach talk"
- Film/sparring: Fightful (Fielding's trainer), warriorpunch, getphysical (generic)
