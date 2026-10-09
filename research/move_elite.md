# How world-class fighters MOVE: body signatures for the animator

Scope: the BODY only (stance, bounce, steps, defense shapes, what the body does while punching).
Strategy and minds live in fighters_a.md, fighters_b.md, mind_p4p_a.md, mind_p4p_b.md. Not repeated here.

Tags:
- (src) = read in a search result that quoted the source text. Source key in [brackets], list at the bottom.
- (snip) = search-snippet summary only. The proxy blocked every full-page fetch (Bloody Elbow, ESPN, Wikipedia).
- (est.) = our inference for animation. Not a measured fact.
- Our render today (v2/src/render3d/men.js `LIFE`): pure sine bob, weave = sine at 0.37 x bob Hz.
  outboxer 2.3 Hz / 1.6 cm / weave 1.2 cm; boxer 1.8 / 1.1 / 1.6; pressure 1.4 / 0.8 / 3.5.

## 0. Hard numbers we found (the few that exist)

- No study measures boxer bounce in Hz. No published step cadence for any fighter. (snip) [TM]
- Elite amateur activity:rest ratio about 18:1; novices about 9:1. Ratio drops over rounds in novices. (snip) [TM]
- 2012 Olympic winners showed more footwork (duration) and higher punch frequency than losers. (snip) [TM]
- Elite boxers react faster with the jab than with the cross (Brazilian national team, 2015). (snip) [RT]
- Ali's jab was timed with an "omegascope" in Sports Illustrated, 5 May 1969. Result not found. (snip) [RT]
- Defense numbers (opponent connect %), CompuBox, all (snip):
  - Mayweather: opponents 16% in his last 9 fights (2012), lowest in CompuBox's ~4,000-fight database; +30 plus-minus. 17% / +24 by 2014. [CB-FM]
  - Roy Jones prime (1994-2002, 19 fights): opponents 27.9% overall, 35.2% power; +19.8. Another window: opponents 26.9%, jabs 18.2%. [CB-RJ]
  - Lomachenko: opponents landed 7.4 punches per round vs a CompuBox average of 16.8. [CB-VL]
  - Whitaker vs Chavez 1993: Whitaker landed 311 vs 220. 46% power accuracy. 50 landed in round 8. [CB-PW]
- Volume / shape numbers, CompuBox (snip):
  - Lomachenko jabs landed per round: 7.2-7.4 (Linares), 8.1 (Walters), 7.8 (Pedraza); lightweight avg 4.6. [CB-VL]
  - Crawford vs Spence: 185/369 total (50%), jabs 87/206, power 98/163 (60%). Jab+power add up to the total. [CB-TC]
  - Usyk vs Fury 2: Usyk 179/423 (42.3%), Fury 144/509 (28.3%). Power 106 vs 100. [CB-UF]
  - Bivol vs Canelo: Bivol landed 152, Canelo 84 (7 per round, his 12-round career low). Bivol double digits every round. [CB-BC]
  - GGG vs Canelo 1: GGG 218/703, Canelo 169/505. Rematch: GGG 234/879, Canelo 202/622; body 46-8 for Canelo. [CB-GC]
  - Fury vs Wilder 2: Fury 82/267, Wilder 34/141; jabs 24/107 vs 16/86; power 58/160 vs 18/55. [CB-FW]
  - Stevenson vs Lopez 2025: Stevenson landed 165 incl. a career-high 105 jabs. Lopez "offered" 72, 59 of them to the body (unclear if thrown or landed). [SS]
- Animation reading (est.): the defense numbers say the best defenders get hit 16-27% of the time. That is not "never hit". Show contact through the guard, not perfect dodges.

## 1. Fighter movement cards

### 1. Vasiliy Lomachenko (southpaw, "the angle machine")
- Stance: southpaw, compact. Lead (right) foot fights to be OUTSIDE the opponent's lead foot. (snip) [VL]
- Guard: standard-high, hands near face (est. from footage memory; not sourced).
- Bounce: light, on the balls of the feet (est.). No cadence data.
- Signature step: one step forward behind the jab, then pivot on the lead foot and swing the rear foot round. Ends at the side, "sometimes the back". Described as about 90 degrees (descriptive, not measured). (snip) [VL]
- vs Linares: right foot lands outside the left foot; when it reaches between his feet, he pivots right and attacks. (snip) [VL]
- Uses a punch's build-up momentum to jump to a new angle instead of finishing the punch. (snip) [VL]
- Backhand feint: hand stays up in front of the opponent's eyes while he walks outside. (snip) [VL]
- While punching: jab -> low lead hook to body -> rear hook or uppercut to head, thrown from the new angle. (snip) [VL]
- Why the pivot works: the opponent turning to face him has one weightless foot, so he can't punch. Loma hits him mid-turn. (snip) [VL]
- Recognizable on screen: (1) jab + lead-foot pivot that swings him 60-90 deg off line; (2) hitting the man while he turns; (3) feint-to-step, the hand stays as the body moves.

### 2. Floyd Mayweather (orthodox, Philly shell)
- Stance: bladed (side-on), small target. Knees BENT, unlike most shell users. (snip) [FM]
- Guard: lead arm draped across the belly. Lead shoulder raised. Chin tucked behind it. Rear glove at the chin or just in front of the face (sources split). (snip) [FM]
- Lean: slightly away from the opponent. (snip) [FM]
- Signature defense, the shoulder roll: rotate the torso toward the rear side so the rear-hand straight glances off the raised lead shoulder; chin stays down. (snip) [FM]
- Counter off it: the rotation pre-loads the rear hand. Short straight right, uppercut, less often a right hook. Also jab -> shoulder-block the cross -> lead hook. (snip) [FM]
- Pull counter (est., classic description): weight rocks back onto the rear foot, head goes back out of range, then rocks forward with the right hand. Not found in a reachable source; see list.
- Entry/exit: when an angle opens he counters, then "darts out". (snip) [FM]
- Recognizable: (1) lead arm low across the stomach, shoulder up to the ear; (2) small torso twists, not big dips; (3) rock back, fire the right, step out.

### 3. Oleksandr Usyk (southpaw, rhythm-breaker)
- Stance: southpaw. Wins the outside-foot battle: right foot outside the opponent's left. (snip) [OU]
- Feet: constant lateral movement, mostly circling to HIS right (away from an orthodox right hand). (snip) [OU]
- In close quarters early in AJ 2: "feints and sidesteps within a relatively small area". (snip) [OU]
- Lead hand never still: probes, measures, blocks lanes, breaks the other man's timing. (snip) [OU]
- Head kept off the line of punches, then pivots out. (snip) [OU]
- Split entry: slip the jab with the lead foot AND head going outside together, throw the left straight. (snip) [OU]
- Switches to a "slicker, broken-rhythm" mode when his jab is matched. (snip) [OU]
- Said he copied Naseem's awkward steps, hands-down stance and sudden angles. (snip) [NH]
- Recognizable: (1) never still: small shuffles, hand pawing; (2) rhythm breaks (pause, then sudden step); (3) head and lead foot move outside together.

### 4. Canelo Alvarez (orthodox, flat-footed upper-body defense)
- Feet: "fairly static", planted. Picks his moments. (snip) [CA]
- Yet strong pivots and torso rotation; attacks from angles. (snip) [CA]
- Rarely blocks. Three shapes: lean out of range, roll under, roll the head away "all the way to his left". (snip) [CA]
- Jab bait: sways his head to new angles so the jab reaches long, then counters over it. (snip) [CA]
- Later career: less flashy rolling; small sways so shots "fall short or slip past". (snip) [CA]
- While punching: in close, strings of body shots around the guard. Rematch body landed 46 vs 8. (snip) [CA][CB-GC]
- Recognizable: (1) feet set, upper body does all the defense; (2) deep U-roll then a hook to the body; (3) small sways that make punches fall short.

### 5. Naoya Inoue (orthodox, sniper -> explosion)
- Safe stance: WIDE and deep, back foot far behind. Body lower; bursts forward or back. (snip) [NI]
- Attack stance: front foot closer, crouches forward, weight over elbows and arms. Explodes up into uppercut, jab, or left hook. (snip) [NI]
- Defense: slides straight back so the opponent is "circling air". Fadeaway hook vs a man coming forward. (snip) [NI]
- Guards change: high guard as bait; dual low (both hands at chest); hybrid (right high, left low). (snip) [NI]
- Jab to the body: dropped Fulton's hands, set up the KO left hook. (snip) [NI]
- Recognizable: (1) visible stance change from long/wide to crouched/forward before he attacks; (2) body jab from a low wide base; (3) guard-shape swaps.

### 6. Terence Crawford (switch-hitter)
- Opens orthodox, moves to southpaw, sometimes by round 2. (snip) [TC]
- Switches WHILE punching: right uppercut stepping back from orthodox into southpaw (Gamboa R9). (snip) [TC]
- One analysis: weight over the centerline, head aligned over the rear foot (not centered). Few head moves; uses feints and stance changes. (snip, single blog) [TC]
- Southpaw lets him move to his right and keep opponents turning. (snip) [TC]
- Recognizable: (1) stance flips mid-fight and mid-combination; (2) head sits back over the rear foot; (3) little bounce, compact.

### 7. Shakur Stevenson (southpaw, Philly-style)
- Guard: shell with LOW lead hand. (snip) [SS]
- Lead hand is a tool: extends to trap hands, occupy the guard, hold range. (snip) [SS]
- Pins the guard to the head with the lead hand, then straight left to the body. (snip) [SS]
- Feints low as if for a body jab, then jab, then left cross (Dawson KO). (snip) [SS]
- Resets the action: steps out so the opponent must start from distance again. (snip) [SS]
- Recognizable: (1) long, low lead arm reaching and touching; (2) step back -> reset -> repeat; (3) left to the body under a pinned guard.

### 8. Mike Tyson (orthodox, peekaboo)
- Stance: closer to SQUARE than normal, feet more side by side; slightly crouched, knees bent. (snip) [MT]
- Guard: gloves high at the cheeks, elbows tucked. (snip) [MT]
- Constant movement of head, trunk and hips, especially AFTER punching. (snip) [MT]
- Signature defense: deep inside slip, bending low to his left under the jab -> counter. (snip) [MT]
- Bob and weave: changes levels with bent knees so taller men can't find him. (snip) [MT]
- Shift: momentum carries him into a pivot to end on the far side of the opponent. (snip) [MT]
- Leaping hook: drives the hips and WIDENS the stance, travels off angle past the centerline. If they circle inside, he shifts right and catches them mid-pivot. (snip) [MT]
- Combos drilled by number (D'Amato/Rooney), e.g. "body-head-body". One source: left hook = "1". (snip, weak sources) [MT]
- Recognizable: (1) head never on the centerline, U-weave under every punch; (2) crouch -> spring up with a hook; (3) gloves glued to cheeks while the body moves.

### 9. Muhammad Ali (orthodox, dancer)
- Upright posture. Weight on the lead leg; rear foot often light/off the ground. (snip) [MA]
- Inside slip: leaned slightly left but stayed upright, head away from the power hand. Speed over weight. (snip) [MA]
- Lean-back / pull: depended on rear-foot placement; photos show him near the splits. (snip) [MA]
- Jab footwork: push off the back foot, jab, land on the lead foot, pivot out of range. (snip) [MA]
- Ali shuffle: rapid foot switching to pull the eyes down, then step in. First used vs Cleveland Williams, 14 Nov 1966. (snip) [MA]
- Broke his own rhythm on purpose. (snip) [MA]
- Recognizable: (1) bounce on the toes, upright, hands lowish; (2) straight pull back from the waist; (3) circling with a flicking jab.

### 10. Pernell Whitaker (southpaw, upper-body defense)
- Feet at long and mid range; head (slips, ducks, rolls, pulls) at mid and close. (snip) [PW]
- Squats into a deep crouch vs Chavez; crossed legs; sat into the ropes. (snip) [PW]
- Often hands low, on reflex. (snip) [PW]
- Small foot moves drive the upper body: slide back while pulling the head; duck out at a side angle with a full pivot. (snip, forum) [PW]
- Slips outside the jab, pivots right, throws a looping hook/jab over the top. (snip) [PW]
- Recognizable: (1) drops straight down then angles off; (2) exaggerated waist bends; (3) slips and punches at the same moment.

### 11. Prince Naseem Hamed (switch, unorthodox)
- Hands at the waist. He said he couldn't see with gloves up. (snip) [NH]
- Switches stance constantly, punches from both. (snip) [NH]
- Leans forward at the waist to whip out a backhand jab, then slides the rear foot back and leans back as the opponent comes. (snip) [NH]
- Recognizable: (1) arms hanging; (2) long lean-back with the head way behind the hips; (3) sudden leaping punches from odd angles.

### 12. Gennady Golovkin (orthodox, ring-cutting pressure)
- Cross step: lead foot crosses in front of the back foot. Keeps stance narrow, covers more ground, moves DIAGONALLY to take away escape routes. (snip) [GG]
- Weight stays on the front foot; stance never opens, so he can jab or cross at any moment. (snip) [GG]
- Stepping jab: stiff, heavy, leans forward, steps into it. Retracts by moving the body forward, glove stays. (snip) [GG]
- Jabs while parrying with the rear hand or slipping outside. (snip) [GG]
- Defense: tight guard, criticized for little head movement. (snip) [GG]
- Volume: 703 and 879 thrown vs Canelo. (snip) [CB-GC]
- Recognizable: (1) steady walk forward, diagonal steps, no bounce; (2) heavy stepping jab with forward lean; (3) hook to the side the man is circling to.

### 13. Tyson Fury (switch-capable, big-man movement)
- Feints constantly: twitches head, body, hands and feet. (snip) [TF]
- Pivots smaller and more deliberate than quick men, so he stays in punching position after defending. (snip) [TF]
- Can swarm (Wilder 3), cut angles, or counter. (snip) [TF]
- Wilder 2: "tying up and leaning at will", "bullying Wilder" in the clinch (live blog). (snip) [CB-FW]
- Recognizable: (1) constant small twitches; (2) tall, upright, leaning his weight on the man in the clinch; (3) small, compact pivots.

### 14. Dmitry Bivol (orthodox, fencer)
- "Best in distance management", "almost like a fencer". (snip) [DB]
- Short steps back, timed jab to stop the approach; stiff arm nudges the man off balance, then pivots out. (snip) [DB]
- Pawing jab into the high guard; doubles and triples it. (snip) [DB]
- Tight guard, long guard. (snip, partly forum) [DB]
- Recognizable: (1) small steps in and out of range, always the same distance; (2) double/triple jab; (3) pivot out after a stiff arm.

### 15. Artur Beterbiev (orthodox, heavy pressure)
- Comes forward, cuts off the ring; "doesn't dance". (snip) [AB]
- High, tight guard; absorbs on forearms and gloves; little head movement. (snip) [AB]
- Footwork got cleaner (Callum Smith fight): foot feints, small angle switches. Earlier often off-balance or squared up. (snip) [AB]
- "Will take three punches to throw one or two" (Kalajdzic). (src quoted in snip) [AB]
- Recognizable: (1) walking forward behind a high shell; (2) heavy, short punches; (3) eats a shot, fires back.

### 16. Roy Jones Jr (orthodox, hands low, speed)
- Hands often low; relied on reflexes; bob, weave, slip, counter. (snip) [RJ]
- Leads with a lead left hook "from the hip" instead of a jab. (snip) [RJ]
- "Dive bomb": arms wide, chin forward, charging in. (snip) [RJ]
- Recognizable: (1) arms loose at the hips; (2) explosive leaping lead hook; (3) sudden switch from still to very fast.

## 2. Cross-fighter patterns (for animation)

- Head moves WITH the feet, not instead of them: Usyk (head + lead foot outside), Loma (jab + pivot), Whitaker (foot slide + head pull). (snip, est.)
- Elite fighters are rarely fully still, but most do NOT bounce: Canelo, GGG, Beterbiev, Crawford, Bivol move by small steps and weight shifts. Bouncing belongs to Ali, Loma, Usyk, Naseem. (est. from cards above)
- Stance changes are visible tells: Inoue wide-safe vs crouched-attack; Crawford mid-combo switch; Naseem constant. (snip)
- The body keeps moving AFTER the punch (Tyson: head/trunk/hips "especially after punching"). Freezing after a punch reads as stop-motion. (snip, est.)
- Rhythm breaks are a signature (Ali, Usyk). A perfectly periodic sine bob is the opposite of that. (snip, est.)

## 3. Style archetypes -> movement knobs

All values below are (est.). No source gives Hz or cm for real boxers. They are tuned guesses from the cards.
Our man is 1.78 m; head at 1.64 m in the rig.

### 3.1 What's wrong now (est.)
- Pure sine bounce looks mechanical. Real bounce is push-off + brief float + landing: use a rectified/asymmetric curve (e.g. |sin|, or a fast rise and slower settle) and jitter the period by +/-10-15%.
- No rhythm breaks. Add a "hold" of 0.3-0.8 s every 2-5 s for outboxers (Ali/Usyk), then a quick step.
- Weave is a fixed sine at 0.37 x bob Hz, independent of feet. Couple it: weave target moves when a step lands; sum two sines (e.g. 0.37x and 0.61x) for non-repeating drift.
- `busy` drops life to 25% while punching. Elites move the head OFFLINE during the punch (Loma angle, Crawford switch, Tyson weave after). Keep weave at about 60% and add a head offset away from the opponent's rear hand on the rear-hand punch.
- Pressure weave 3.5 cm is a compromise that fits nobody: too small for peekaboo (Tyson's deep U), too much for GGG/Beterbiev (tight guard, little head movement). Drive it by GUARD, not just style.

### 3.2 Style knobs (proposed)

| knob | outboxer (Ali, Usyk, Loma) | boxer (Bivol, Crawford, Stevenson, Inoue safe) | pressure (GGG, Beterbiev, Canelo-flat) |
|---|---|---|---|
| bounce Hz | 2.0-2.4, jittered, with holds | 1.2-1.6 (more a weight-shift than a hop) | 0.6-1.0 weight-shift, no hop |
| bounce amp | 1.5-2.5 cm | 0.6-1.0 cm | 0.3-0.6 cm |
| bounce shape | rectified (feet leave floor) | soft sine | soft sine on the knees |
| weave lateral | 1-2 cm idle, + head-with-lead-foot on steps | 1.5-2.5 cm | 1-1.5 cm (high guard) |
| stance width | 1.1-1.2 x shoulder | 1.2-1.4 x (Inoue safe = widest) | 1.0-1.1 x, narrow (GGG cross step) |
| lean | upright, slight back (Ali) | neutral, head over rear foot (Crawford) | forward 5-10 deg |
| head height | full (1.64) | -2 to -4 cm | -4 to -7 cm |
| step length | long, 25-40 cm | short, 10-20 cm (Bivol) | medium, diagonal |
| step rate | high, continuous | medium, in/out | steady walk |
| pivot rate | high (Loma 60-90 deg off jab) | medium, pivot out after jab | low, small turns to cut |
| feint rate | high (lead hand always busy) | medium | low-medium (foot feints) |
| relaxed | loose arms, hands lowish | composed | tense, tight shell |
| keep current? | Hz ok; add holds, rectify, raise amp a little | Hz 1.8 -> about 1.4, amp 1.1 -> 0.8 cm | Hz 1.4 -> about 0.8, amp 0.8 -> 0.4 cm, weave 3.5 -> 1.2 cm unless peekaboo |

### 3.3 Guard knobs (proposed, layered on top of style)

| guard | who | shape / knobs |
|---|---|---|
| standard | Loma, Bivol, Usyk | gloves at cheek/chin; normal weave; lead hand pawing (feint rate up for Usyk-likes) |
| high | GGG, Beterbiev, Inoue bait | gloves at brow; weave x0.4; blocks absorb on forearms; forward lean; stepping jab |
| peekaboo | Tyson | near-square stance; crouch 7 cm (as now) +3 cm; U-weave 8-12 cm lateral with 5-10 cm dip at 0.5-0.8 Hz; head/trunk/hips keep moving after punches; elbows tucked, gloves on cheeks |
| philly | Mayweather, Stevenson | bladed; lead arm across belly (as now); knees bent; lean back 5 deg; defense = torso twist to rear side (shoulder roll) + rock back (pull); little bounce; low weave |
| cross | (cross-arm: Archie Moore style, not researched here) | keep; small weave; walks forward behind it |
| handslow | Ali, Jones, Naseem, Whitaker | hands at waist/hips; most head motion: pull-backs and lean-backs (head 15-25 cm behind hips at peak); loose arms; sudden leaping lead hook (Jones) |

### 3.4 Defense shapes to key (from cards)
- Shoulder roll (Mayweather): torso yaw ~20-30 deg to the rear side, lead shoulder up, chin down; head drops ~2 cm. (est.)
- Pull (Ali/Mayweather): weight to rear foot, head back 12-20 cm, then rock forward with the rear hand. Current `pull` offset is -13 cm: fine; add the rock-forward return. (est.)
- Deep inside slip (Tyson): bend low to his left under the jab; current `slip` drop of 7 cm is shallow for peekaboo, use 12-18 cm. (est.)
- U-roll (Canelo): roll head "all the way to his left"; current `roll` -22 cm dip is about right; add a hip turn. (est.)
- Lean-back (Naseem/Ali): slide rear foot back first, then lean. Order matters. (snip [NH][MA])
- Slide back (Inoue): straight back, both feet, head level. (snip [NI])

## 4. Missing facts (not found, do not invent)
- Any measured bounce frequency, amplitude, or step cadence for any boxer.
- Ali's 1969 omegascope jab time (article not reachable).
- Real stance widths, head heights, lean angles from motion capture.
- Mayweather pull-counter mechanics from a reachable source.
- Usyk "half steps" / step size; Loma "L-step" naming (no source used the term).
- Tyson career CompuBox defense numbers; Inoue-Fulton CompuBox (sources conflict: 114/379 vs 184/340).
- Canelo, Usyk, GGG career opponent-connect %.
- Reaction times of named fighters (only a generic jab-vs-cross study found).

## Sources (all via search snippets; full pages blocked)
- [VL] modernmartialartist.com Loma "Matrix footwork"; sports.vice.com "pivots and precision of Vasyl Lomachenko"; bloodyelbow.com 2018 Loma vs Linares; evolve-university.com advanced footwork.
- [FM] evolve-mma.com Mayweather style; boxraw.com Philly shell; elitesports.com; bloodyelbow.com 2013 Mayweather vs Alvarez preview.
- [OU] boxraw.com Usyk vs Joshua 2; africa.espn.com Usyk rhythm vs Dubois; mykhel.com AJ route vs Usyk.
- [CA] expertboxing.com Canelo tricks; bloodyelbow.com 2023 Canelo vs Charlo; bloodyelbow.com 2019 Canelo vs Jacobs.
- [NI] mmasucka.com Inoue vs Moloney; bloodyelbow.com 2023 Inoue vs Fulton; espn.com "Naoya Inoue 12 reasons".
- [TC] evolve-mma.com 5 ways to fight like Crawford; queensberry-rules.com Crawford vs Benavidez; ringmagazine.com southpaw vs Canelo.
- [SS] boxingshowtimes.com; dazn.com Lopez analysis; ringmagazine.com Stevenson trainer on Lopez.
- [MT] evolve-mma.com peekaboo + Tyson breakdown; modernmartialartist.com Tyson uppercuts/leaping hooks; boxing.fandom.com Peek-a-Boo; fightprimer.com Torres vs Cotton.
- [MA] bloodyelbow.com 2013 Jack Slack on Ali; modernmartialartist.com Ali footwork & jab; evolve-mma.com Ali style; joinfightcamp.com Ali shuffle.
- [PW] joinfightcamp.com best defensive boxers; boxingscene.com community posts; expertboxing.com evasion dance; swboxing.substack.com.
- [NH] bloodyelbow.com 2013 tricks of Naseem; thestar.co.uk Naz on arms-down style and legacy.
- [GG] modernmartialartist.com GGG power; thefightcity.com Lee Wylie on Golovkin vs Brook; roundbyroundboxing.com keys for GGG.
- [TF] evolve-mma.com Fury style; badlefthook.com 2015 Klitschko vs Fury preview; bloodyelbow.com 2020 Fury vs Wilder.
- [DB] bloodyelbow.com 2022 Bivol vs Ramirez; boxraw.com how Bivol beat Canelo; punchinggrace.com.
- [AB] boxingnewsonline.net Beterbiev vs Bivol keys + pro breakdown; si.com Kalajdzic; bloodyelbow.com 2024 Beterbiev vs Smith; punchinggrace.com.
- [RJ] evolve-mma.com 5 Roy Jones techniques; modernmartialartist.com (dive bomb).
- [CB-FM] boxingscene.com CompuBox Mayweather; espn.com stats blogs (Maidana, McGregor).
- [CB-RJ] ringtv.com CompuBox Tyson-Jones exhibition; boxingscene.com Mayweather vs Jones head-to-head.
- [CB-VL] worldboxingnews.net CompuBox Loma; boxingscene.com forum CompuBox historical reviews.
- [CB-PW] boxingscene.com "Pernell Whitaker CompuBox looks back"; Wikipedia Whitaker vs Chavez.
- [CB-TC] boxingscene.com Crawford vs Spence CompuBox. [CB-UF] boxingscene.com Usyk vs Fury CompuBox; channel103.com.
- [CB-BC] boxingscene.com Canelo vs Bivol CompuBox; cbssports.com. [CB-GC] si.com 2017; cbssports.com 2018.
- [CB-FW] cbssports.com Wilder vs Fury 2 live blog; espn.com.
- [TM] PMC12197034 amateur boxing review; mdpi.com Sports 13(6):187; FRAMI (revistas.rcaap.pt).
- [RT] lida.sport-iat.de "specific reaction time in elite boxers: jabs vs crosses"; gulfnews.com on SI 1969 omegascope.
