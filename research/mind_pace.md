# The Mind of a Boxer: pace and fight management

How real boxers spend their output across a round and across 12 rounds, and how to turn that into a pace controller for Last Bell. Fighter style DNA lives in `fighters_a.md` / `fighters_b.md`; punch timing and basic volume live in `combat_research.md` section 5. This file does not repeat them.

Source note: CompuBox, BoxingScene and Ring pages were blocked for direct fetch from this sandbox, so most numbers below come from search result extracts of those articles (CompuBox write-ups on BoxingScene, Ring "CompuBox Corner", ESPN Stats & Info). Each number names its source fight. Anything marked **(est.)** is my own estimate or derived arithmetic, not a published figure.

---

## 1. Numbers table

### League averages (per fighter, per round, CompuBox)

| Group | Thrown | Landed | Connect | Notes |
|---|---|---|---|---|
| Light divisions (122 lb) | ~63 | n/a | n/a | Figueroa's 127/rd was "more than double the 122 lb average" (BoxingScene) |
| Lightweight (135) | 60.2 | n/a | n/a | Commey write-up: 118/rd was "nearly twice the 60.2 lightweight average" |
| Jr welter (140) | 59 | n/a | n/a | BoxingScene CompuBox. Typical 140 lb round: 26 power connects **combined** (Gatti-Ward write-up) |
| Welterweight (147) | 57-58 | ~19 | ~33% (est.) | Mayweather write-up: "17 landed/rd, weight class average 19" |
| Middleweight (160) | n/a | 18 | n/a | Middleweight jabs landed ~4.7/rd (GGG's 9.4 was "double the average") |
| Heavyweight | ~45 (est.) | ~15 (est.) | ~33% (est.) | CompuBox quotes 90 thrown / 30 landed **combined** per round; halved here |
| Amateur study | n/a | n/a | winners 33%, losers 23% | Winners also missed less into air (17% vs 27%) |
| **Last Bell audit** | **~56** | **~16** | **~29%** | Right on the welterweight line. Fine as a "neutral" league |

Jab vs power, rough real split (est., from the leaders table and fight lines below): about 45-55% of all punches are jabs; jabs connect ~20-30%, power ~35-45%. Most landed damage comes from power shots even for jab-heavy fighters.

### Named elites (CompuBox)

| Fighter | Number | Source |
|---|---|---|
| Floyd Mayweather | +30 plus-minus (best ever tracked); 43% own connect vs 19% opponents; last 9 fights 46% vs 16% | ESPN Stats & Info, BoxingScene |
| Shakur Stevenson | +20.2 plus-minus (best active); opponents land 7.1/rd, 16.7% total, 19.5% power | BoxingScene plus-minus list |
| David Benavidez | +17.4; 40% total connect (leader); 36.9 power thrown/rd (leader) | CompuBox leaders |
| Jesse Rodriguez | +17.2; 48.6% power connect (leader); one fight 91 thrown / 48 landed per round | CompuBox leaders |
| Dmitry Bivol | +16.7; 8.3 jabs landed/rd (leader); lowest opponent connect % | CompuBox leaders |
| Junto Nakatani | 35.6 jabs thrown/rd (leader) | CompuBox leaders |
| Gennady Golovkin | 9.4 jabs landed/rd across the Canelo fights (9 of 30 in fight 1) | BoxingScene |

### Single fights that show shape

| Fight | Line | Per round (est.) |
|---|---|---|
| Stevenson vs Lopez (12 rds) | Shakur 165/372 (44.4%), jabs 105/252, power 60/120 (50%). Lopez 72/468 (15.4%) | Shakur 31 thrown / 14 landed. Lopez 39 / 6. Low volume plus huge accuracy wins 119-109 |
| Crawford vs Porter | Crawford 98/328, Porter 79/347; jabs landed 33 vs 12 | Crawford ~33 thrown/rd over 10 rds |
| Usyk vs Gassiev | Usyk 14 landed/rd in R1-6, 29 landed/rd in R7-12; 47/117 in R12 | Doubles his landed output in the second half |
| Usyk vs Fury 1 | Fury up 63-56 in power landed going into R7; Usyk 23/68 per round in R11-12, 36 power landed R10-12 vs 15 | Late surge flips the fight |
| Bivol vs Beterbiev 2 | Bivol 33-23 in power landed R1-6; Beterbiev 67-51 in R7-12, 29-19 in R11-12 | Beterbiev wins it late |
| De La Hoya (ref. Tom Donelson) | 100+ thrown in R1, then 72/rd over the next five | Big first round then settles |
| Groves vs Froch 2 | Groves only 35/rd early, "too tentative" | Slow start lets the slow starter in |
| Gatti vs Ward 1, R9 | 110 landed combined, 102 power (42 Gatti, 60 Ward) | Nearly 4x a normal 140 lb round |

---

## 2. Round shape (across 12)

Patterns that show up again and again:

- **Feel-out first round.** Usyk-Fury 2 R1: only 6 landed each. Most fighters throw below their average in R1 (est. 80-90%). Exceptions are planned fast starters (De La Hoya 100+, Commey 118/rd for 5 rounds).
- **The fast-start fade.** High early output almost always drops: De La Hoya 100+ to 72. Fury in the Usyk rematch "exceeded his typical exertions early" then faded late. Amateur data in `combat_research.md` shows the same (activity ratio 16:1 to 8:1 to 6:1 in novices).
- **The slow-start reader.** Crawford is "typically a slow starter": slow R1-2 vs Sanabria, then 2-1 in power landed over the next three rounds; slow vs Dulorme then stops him in R6; studies Brook then KOs him in R4. Rule of thumb (est.): reader types score below average in R1-3 and well above it from R4-5.
- **The second-half fighter.** Usyk doubles his landed output after R6 (Gassiev 14 to 29) and wins the championship rounds (Fury 1). Beterbiev did the same to Bivol. Their gas tank and the opponent's fatigue do the work.
- **Championship rounds (10-12).** Elites often push here. Canelo had "strong starts to the 10th, 11th and 12th" vs GGG. Usyk R12 vs Gassiev was his best round. Most ordinary fighters drop in total output but raise intent (est. -10% volume, +power share).
- **Mid-fight swing.** Fury led on power landed going into R7 vs Usyk, then lost it. Close fights often turn in R7-9 when one man's legs go.

Rough curve multipliers (est., for a "normal" fighter): R1 0.85, R2-4 1.0, R5-8 0.97, R9-11 0.93, R12 1.0 (last round push).

---

## 3. Within-round clock

- **Opening 20-30 seconds:** jabs, feints and range finding. Low power share. Fighters come out of the corner with whatever instruction they just got, so the first exchange often shows the adjustment.
- **Middle 90 seconds:** the real work. Bursts of 1-4 punches every few seconds (see `combat_research.md` §5), with resets.
- **Last 30 seconds: "stealing the round".** Turning on the gas in the final 30-60 s to make it look like you won it. Judges (and fans) remember the final 30 s best and tend to ignore the first 150 s if nothing big happened. Sugar Ray Leonard was famous for a flurry in the last 30 seconds to steal rounds. Mayweather publicly asked judges to "watch the whole round", which shows how real the bias is.
- **The 10-second clapper:** many gyms knock on the apron with 10 seconds left. Fighters throw a final flurry or make sure they land the last clean shot.
- **Hurting someone near the bell** is the worst timing for the attacker: the hurt man gets 60 seconds of rest. Ward dropped Gatti with a liver hook in R9 and could not finish; Gatti rallied in the same round.

---

## 4. Gas tank and gear changes

- **Burst vs steady.** Two ways to spend energy: steady pressure (Golovkin, Benavidez, high power volume all round) or bursts with rest-in-motion (Mayweather, Stevenson, Usyk: move, feint, jab, then 2-4 punch bursts). Bursts look sharper to judges and save energy. Pressure wins by draining the other man.
- **Rest in motion.** Elite boxers recover while moving, not standing. Amateur research: over rounds, clinch time rises, guards drop more often, bouncing on the feet decreases. These are the visible signs of fatigue.
- **Missing costs more than landing.** A missed punch is not stopped by a target, so the boxer has to brake it with his own body and recover balance. Widely repeated by trainers; boxing games (Fight Night) model it the same way, a whiff takes a large chunk of stamina. Exact ratio is not published (est. 1.5-2x a landed punch).
- **Body work tax.** Body shots drain the receiver's legs and breath over time; they pay off late (Inoue: body shots wore down Cardenas' arms, then the head opened; Inoue dropped Donaire with a body shot in R11; Dasmarinas went out from repeated left hooks to the side). Treat body damage as a stamina-recovery debuff that compounds.
- **Fatigue hits power punches more than jabs.** Lab data: punch force falls more in crosses and hooks (trunk rotation) than jabs. Reaction time slows ~25% after 3 rounds (`combat_research.md` §5). So a tired fighter should jab more, throw fewer hooks, and slip less.
- **When champions step on the gas:**
  1. They just hurt the opponent (see §5).
  2. They are behind on the cards late. Leonard vs Hearns: down 116-112 / 117-112 / 117-111 after 12. Dundee: "You're blowing it now, son." Leonard landed a 25-punch unanswered flurry in R13 and stopped Hearns in R14. Chavez vs Taylor: behind on two cards, dropped Taylor with 16 seconds left in R12, stoppage with 2 seconds left.
  3. The opponent is fading (Usyk, Beterbiev after R6).
  4. The last 30 s of a close round.
  5. After the corner gives a clear new plan (first 30 s of the next round).
- **When they ease off:** clearly ahead late (protect the lead, more jab and move), after being hurt, or when the opponent is dangerous and still dangerous while hurt.

---

## 5. Finishing and surviving

**Closing the show (elites):**
- Step 1, confirm: one more clean shot to see if the hurt is real (legs, holding, eyes).
- Step 2, choose the target: varied punches, head and body, not wild arm punches. Leonard's 25-punch flurry vs Hearns came after a right hand had already buckled him.
- Step 3, cut off the escape: trap him on the ropes or in a corner so he cannot clinch or run.
- Inoue style: patient sniper until hurt, then explosive. Even when hurt himself (dropped by Nery R1, by Cardenas), he reset, then finished later (Nery R6, Cardenas R8). The finish is often a body shot.
- **When to hold back:** if the hurt man is a puncher who still throws back (Gatti R9 vs Ward; Wilder style), the smart attacker keeps a tight guard and throws shorter, sure punches instead of loading up. Overcommitting to a finish is the classic way to get countered (est. common pattern, many examples, no single stat).

**Surviving (the hurt fighter):**
- **Clinch and hold.** The most common reason for a clinch is right after getting hurt. It kills the space for power punches; 5-10 seconds tied up can be enough for the legs and eyes to come back.
- **Take a knee.** Going down on purpose starts a count; 8-10 seconds of guaranteed rest at the cost of a 10-8 round.
- **Move and cover.** Back up behind a high guard, turn off the ropes, keep the feet moving, throw a single shot back to show the referee you are still in it.
- **Fire back.** Some fighters punch their way out (Gatti R9). High risk, big crowd reaction.
- **The referee.** A hurt fighter who stops punching back and cannot defend gets stopped, even late (Taylor with 2 seconds left).
- **The bell is the best friend.** One minute in the corner gives a big recovery (Gatti came back the same round, Fury got up and finished vs Usyk 1).

---

## 6. Corner adjustments: the top 15

Corner rules from coaches: the fighter needs the first ~30 seconds of the minute to breathe and calm the heart rate, so technical talk comes after that. Give one or two things only; a fighter "only remembers the last thing you tell him".

| # | What the corner says | What it changes |
|---|---|---|
| 1 | "Double the jab" / "jab, jab" | More jabs, often doubled; keeps range, stops the other man firing back right after |
| 2 | "Go to the body" | Raise body share; slows a mover; pays off late |
| 3 | "Head and body, mix it up" | Alternate levels in combos, opens the guard |
| 4 | "Turn him" / "angles" | Step off line after punching; stop going straight back or straight in |
| 5 | "Cut off the ring" | Pressure fighter steps sideways to trap a mover, no chasing |
| 6 | "Get off the ropes" / "stay off the ropes" | Retreat to center, less time pinned |
| 7 | "Hands up" / "chin down" | More guard, less output, fewer clean shots taken |
| 8 | "Let your hands go" / "throw more" | Raise output when he is being outworked or too tentative (Groves' problem) |
| 9 | "Slow down, pick your shots" | Lower output, higher accuracy, less missing; gas saving |
| 10 | "He's dropping his right/left after the jab, counter it" | Sets a specific counter trigger (Inoue vs Cardenas: bait the counter hook, counter the counter) |
| 11 | "Stay behind the jab, don't lunge" | Less overextension, shorter steps, fewer big misses |
| 12 | "Step on the gas / you need this round" / "You're blowing it" | Urgency when behind on the cards; whole-round output up |
| 13 | "Steal the round, finish strong" | Spend the last 30 s on a flurry |
| 14 | "Hold if he hurts you" / "tie him up" | Survival plan for the next round after being hurt |
| 15 | "Switch stance" / "go southpaw" | Changes angles and looks (Crawford style switch after reading) |

---

## 7. Judging

**Official criteria (ABC / unified rules, 10-point must):**
1. **Clean punches:** direct, clean punches with the knuckle part of the glove on the legal target (head and body above the belt).
2. **Effective aggression:** taking the fight to the opponent *and getting results*. Walking forward and missing does not count.
3. **Ring generalship:** the thinking boxer who controls where and how the fight happens, keeps the other man off balance.
4. **Defense:** punching while not being punched.

In practice clean, hard punching dominates; the other three break ties. Winner of a round gets 10, loser 9; knockdown 10-8; a very dominant round can be 10-8 without a knockdown.

**How judges actually behave:**
- Accuracy beats volume. In amateur research winners threw about the same number of punches as losers but landed more (33% vs 23%) and missed less into air. Accuracy plus a movement index classified 85% of bout outcomes; a 2021 model predicted round winners from punch stats with 89% accuracy.
- Power punches and visible effect (head snapping, legs buckling, crowd noise) count far more than jabs. Lopez threw more than Stevenson (468 vs 372) and lost every card 119-109.
- Recency: the last 30 s weigh most (see §3).
- Judges disagreed on the round winner in about 35% of rounds in one study of high-profile bouts. Close rounds are coin flips.
- Golovkin outlanded Canelo in 10 of 12 rounds in fight 1 and it was a draw: harder, cleaner single shots and late-round pushes can beat raw landed counts.

---

## 8. Engine translation

A pace controller sits on top of `decide()`: it gives an `outputMult` (how often to start a burst), a `powerShare` and a `riskMult` (how loaded and how committed). Everything is clamped so a round stays inside the audit targets.

```js
// --- per-fighter traits (from style / sheet) ---
// startSpeed: 0 reader (Crawford) .. 1 fast starter
// tank:       0 fades .. 1 second-half fighter (Usyk)
// killer:     0 cautious .. 1 finisher (Inoue)
// stealer:    0 .. 1 likes to steal the last 30s (Leonard)

function paceMult(f, o, rnd, tLeft, card) {   // tLeft in seconds of 180
  let m = 1;

  // 1. across the fight (section 2)
  if (rnd === 1)      m *= lerp(0.80, 1.15, f.startSpeed);
  else if (rnd <= 3)  m *= lerp(0.90, 1.05, f.startSpeed);
  m *= 1 + (rnd - 6) * 0.012 * (f.tank * 2 - 1);  // +-7% by R12
  if (rnd === lastRound) m *= 1.08;

  // 2. within the round (section 3)
  const tIn = 180 - tLeft;
  if (tIn < 20)       m *= 0.85;                       // feel out
  if (tLeft < 30)     m *= 1 + 0.15 + 0.20 * f.stealer;// steal the round
  if (tLeft < 10)     m *= 1.10;                       // clapper flurry

  // 3. scorecard (section 4)
  const diff = card.myEstimate - card.oppEstimate;    // in points, fighter's own guess
  const late = rnd >= totalRounds - 3;
  if (diff < 0 && late) m *= 1 + Math.min(0.35, -diff * 0.08);  // "you're blowing it"
  if (diff >= 3 && late) m *= 0.90;                    // protect the lead, more jab

  // 4. fatigue (stamina 0..1)
  m *= 0.60 + 0.40 * f.stamina;                       // tired = fewer bursts
  return clamp(m, 0.5, 1.6);
}

function powerShare(f, o, base) {
  let p = base;
  if (f.stamina < 0.4) p -= 0.10;                     // tired: jab more (force falls in hooks/crosses)
  if (o.hurt) p += 0.25 * f.killer;                   // finish
  return clamp(p, 0.2, 0.8);
}

// hurt opponent (section 5)
if (o.hurt) {
  const danger = o.power * o.stamina;                 // still dangerous?
  f.outputMult *= 1 + 0.6 * f.killer;
  f.riskMult    = danger > 0.5 ? 0.8 : 1.2;           // tight vs loaded
  f.footwork    = 'trap';                             // cut off, push to ropes
  if (tLeft < 8) f.outputMult *= 1.3;                 // beat the bell
}

// hurt self
if (f.hurt) {
  f.clinchChance = 0.35 + 0.3 * f.ringIQ;             // grab on contact
  f.outputMult  *= 0.4;                               // single shots back only
  f.footwork     = 'retreat_center';
  f.kneeChance   = (f.hp < 0.15 && f.ringIQ > 0.6) ? 0.2 : 0;
}

// stamina costs (section 4)
cost(punch) = base[punch.type] * (punch.landed ? 1.0 : 1.6) * (punch.power ? 1.5 : 1.0);
onBodyHit(o, dmg) { o.staminaRegenMult -= dmg * k; } // compounds, pays off late
corner(): stamina += 0.25 * (1 - stamina);           // first 30s of the minute is recovery
```

**Corner shouts as knob changes** (map to `SHOUTS`): double jab = jabShare +0.15; body = bodyShare +0.20; turn him = angleRate +; cut off = trapRate +; let hands go = outputMult x1.15 and accuracy -; pick shots = outputMult x0.85, accuracy +, stamina cost -; step on gas = paceMult floor 1.2 for one round; hold = clinchChance +0.2.

**Round scorer** (for judges, weights est.):
`score = 1.0*cleanPower + 0.5*cleanJab + 0.3*effectiveAggression + 0.2*generalship + 0.2*defense`, with the last 30 s weighted x1.5, a big visible hurt worth ~+6 landed, and per-judge noise so ~30-35% of close rounds can split.

**Calibration targets:**
- League per round: ~56 thrown / ~16 landed / ~29% (keep). Jabs ~50% of thrown, jab connect ~22%, power ~36%.
- R1 output ~85-90% of fight average. Last 30 s carry ~22-25% of a round's punches (flat would be 16.7%) (est.).
- Second-half fighters: landed per round R7-12 at 1.3-2.0x R1-6 vs a fading opponent (Usyk-Gassiev 2.07x is the top end).
- Fast starters: R1 at ~1.3-1.4x their later average (De La Hoya 100+ vs 72).
- Defensive elite (Mayweather/Shakur type): opponents land ~6-7/rd at 15-19%; own connect 40-45%; plus-minus +20 to +30.
- Volume mauler (Benavidez type): ~37 power thrown/rd, ~40% connect.
- Elite plus-minus range +15 to +20 for top active fighters; league average 0 by definition.
- Chaos round (Gatti-Ward R9) should be possible but rare: ~2-4x normal landed, maybe 1 in 200 rounds (est.).
- Upsets of the "you're blowing it" kind: a fighter behind on cards after R9 should win by stoppage in roughly a few % of fights (est., tune by feel).
