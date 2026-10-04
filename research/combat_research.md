# Smooth, fast, realistic boxing: techniques for a 2D procedural auto-boxing sim

Notes on sources: most publisher and academic pages (uploadvr, siggraph history, uclan PDF) were blocked by the network proxy, so the details below come from search-result abstracts and review text, plus well-established fighting-game craft. Numbers marked (est.) are practitioner rules of thumb, not measured data.

---

## 1. Fight Night Round 3 / Round 4 / Champion (EA)

**What they did**
- **FN Round 3 (2006) Total Punch Control:** analog-stick gestures map to punch families (flick = jab, quarter circle = hook, half circle = uppercut). The **haymaker is a wind-back then fire**, so its startup is visibly longer, and it was deliberately made *slower but more powerful* in R3. "Impact punches" (flash KO, stun punch) are high-risk swings that "can leave a boxer vulnerable to counter moves" ([GameRevolution FNR3](https://www.gamerevolution.com/?p=36636), [GameSpot](https://www.gamespot.com/videos/fight-night-round-3-video-review/2300-6144686)). The design rule: **a bigger payoff needs a longer, readable wind-up, and missing it leaves an opening.**
- **FN Round 4 (2009) physics-driven animation:** EA's CG supervisor and lead gameplay engineer presented "Fight Night 4: Physics-Driven Animation and Visuals" at SIGGRAPH ([SIGGRAPH history](https://history.siggraph.org/?p=148974)). The physics engine "analyzed the direction, the force and the level of contact for each punch" and produced **missed, glancing, and full knockout hits**, plus inside fighting ([MCV](https://mcvuk.com/ea-announces-fight-night-round-4/), [ESPN](https://africa.espn.com/espn/thelife/videogames/news/story?id=3968745)). Reviewers: "in past games fists clipped through bodies and punch animations could be **halted mid-throw if the opponent got to you first**; now hooks **glance off forearms**, uppercuts break through guarded elbows, and jabs can **land simultaneously**". Punches can also "connect without making impact" when the range is too far or too close, i.e. a smothered or overreached punch ([OSFTW FN4 review](https://osftw.com/reviews/488/fight-night-round-4/?page=2)). Reach and height feed directly into the collision.
- **FN Champion (2011):** Full Spectrum Punch Control (a simpler flick), with a refined physics animation system for locomotion, punching and stamina ([Wikipedia](https://en.wikipedia.org/wiki/Fight_Night_Champion)).

**Technique → 2D canvas application**
- **Contact quality is continuous, not hit/miss.** At resolve time, compute `q` from (glove-to-target distance at peak extension relative to ideal range) × (angle vs. guard). Map `q` to *miss / smothered (too close) / glancing / clean*. Each band gets its own visual: a glancing hit deflects the glove sideways and gives the head a small snap; a clean hit gives a full snap plus hit-stop. That variety alone makes exchanges look physical.
- **Arm-vs-arm interaction:** when a hook's glove path crosses the defender's forearm segment, clamp the glove to the forearm and slide it along (a "glance"), then rebound it. Two straight punches thrown at the same time can both land (a trade) and that reads as dramatic.
- **Interruptible punches:** if a fighter is hit during the startup of their own punch, cancel it into a hit reaction (a counter "beats" it). If hit during the active phase, let it finish at reduced power. That is the FN4 lesson: stopping mid-throw only looks wrong when it happens *after* extension.
- **Wind-up proportional to payoff:** power shots get a visible load (shoulder dips back, rear heel lifts) of 2–3× the jab's startup, and a whiff leaves a long recovery the AI can exploit.

## 2. Undisputed (Steel City Interactive, 2023 EA → Oct 2024 1.0)

**What they did / what felt bad**
- 60+ distinct punches, feints, punches from multiple angles; boxers mocapped individually for footwork, slips, and dodges ([Digital Trends](https://www.digitaltrends.com/gaming/undisputed-is-by-and-for-boxing-fans/), [PlayStation Blog](https://blog.playstation.com/?p=396984)). "Loose Movement" modifier for freer steps; **flat-footed movement when stamina is low** ([CogConnected](https://cogconnected.com/review/undisputed-review/)). Lomachenko-style pivots were planned ([SGO](https://www.sportsgamersonline.com/?p=68077)).
- Complaints: "oddly sluggish feeling gameplay", "boxers seem a bit sluggish despite their speed rating", punches thrown toward the opponent "yet miss" ([TheSixthAxis](https://thesixthaxis.com/2024/10/07/undisputed-review), [SteamDeckHQ](https://steamdeckhq.com/game-reviews/undisputed/)). Players: "you can't lunge and strike in a fluid motion or hook and move out quickly because you have to **wait for the animation to play out**"; arms clip and clash on simultaneous punches; knockdowns look wonky; there is movement input delay; fighters get "locked in" when close ([Steam discussion](https://steamcommunity.com/app/1451190/discussions/0/3766734182331718761), [AU Review](https://www.theaureview.com/games/undisputed-review/)).

**Technique → 2D canvas application**
- The sluggish feeling comes from **long animation commitment plus no overlap between movement and punching.** In your sim, let footwork keep running *during* punches: a step-in jab (the lead foot travels during the extension) and a pivot-out hook (rotate and step laterally during recovery). Never freeze the legs while the arms work.
- **Stamina should show in how a fighter moves:** fresh fighters bounce on the balls of their feet, tired ones go flat-footed (less vertical bob, shorter steps, longer recovery). This is cheap, readable, and Undisputed's best-liked idea.
- Avoid clipping by giving the two fighters' gloves a simple separation constraint (circle vs. capsule) and resolving overlaps with deflection, not interpenetration.

## 3. The Thrill of the Fight 1 & 2 (Ian Fitz, VR)

**What they did**
- Opponents are distinct characters with exploitable "tiny windows" in their playstyles; for example, "Thai Spider" is huge with reach, blocks with arms and shoulders, and keeps his hands near his face, which leaves his temples and solar plexus open ([Steam discussions](https://steamcommunity.com/app/494150/discussions/0/1694920442954472503), [VRFitnessInsider](https://vrfitnessinsider.com/?p=98935)). A later update added **body punches** to AI that had been head-only ([VRFitnessInsider update](https://www.vrfitnessinsider.com/thrill-of-the-fight-gets-closer-to-full-release-with-this-comprehensive-update/)).
- TotF2: AI "**looks for openings**: if you hold your hands in front of your face they'll get close and swing around them; if you guard your head well they start swinging at your body." It "closes the distance if it senses you are tired, backs off if you prove a dangerous counter-puncher". One reviewer was unsure whether the opponents were AI at all ([GamingTrend](https://gamingtrend.com/reviews/the-thrill-of-the-fight-2-review/), [UploadVR review](https://www.uploadvr.com/the-thrill-of-the-fight-2-review/)).

**Technique → 2D canvas application**
- **Target selection from the defender's guard state:** each frame, compute which zones are open (high guard → body and around-the-guard hooks; low hands → straight shots to the head; philly shoulder → right hand to the body or the lead-side hook). Weight punch choice by `openness[zone]`. This is the single biggest "AI looks smart" lever.
- **Opponent modelling with decaying memory:** keep running averages of what hurt me (counters vs. leads, head vs. body) and of the opponent's stamina. Shift range preference and aggression from these (opponent tired → press; opponent counters well → feint more and lead less). Use an EMA with a half-life of about 20–40 s so behaviour visibly adapts within a round.
- **Signature weakness per fighter:** give each style one fixed hole (a dropped hand after the jab, a lean on the hook). The coach can then *discover and call* it, which fits your corner-talk loop.

## 4. Fighting-game animation craft

**Frame phases (60 fps).** Startup / active / recovery. Typical 2D fighter values: light attacks 3–5f startup, 2–3f active, 6–10f recovery; heavies 8–15f startup, 15–25f recovery (est., cf. [SF6 frame data](https://srk.shib.live/w/Street_Fighter_6/Game_Data), [Dustloop GGST](https://dustloop.com/w/GGST/Esoterica)). For a *realistic* boxing sim, scale these to real time (see section 5): jab ≈ 60–90 ms startup, 60–100 ms extension, 120–180 ms retraction (est.).

**Hit-stop (impact freeze).** Freeze *both* fighters for a few frames on contact: "light ~9f, medium ~11f, hard ~13f" in most fighters; it "sells that the collision happened, gives the eyes frames to register it" ([critpoints](https://critpoints.net/2017/05/17/hitstophitfreezehitlaghitpausehitshit/), [SSB wiki Hitlag](https://www.ssbwiki.com/Hitlag), [Sakurai via Source Gaming](https://sourcegaming.info/2015/11/11/thoughts-on-hitstop-sakurais-famitsu-column-vol-490-1/)). 3D/realistic games use much less ([critpoints](https://critpoints.net/2017/05/17/hitstophitfreezehitlaghitpausehitshit/)). For a realistic boxing sim: **2–3f (35–50 ms) on clean jabs, 4–6f (70–100 ms) on clean power shots, 8–10f on knockdown punches.** Nothing on blocked or glancing hits beyond 1–2f. Optionally shake the victim's head by ±1–2 px during the freeze.

**Screen shake (trauma model).** Squirrel Eiserloh, GDC 2016 "Juicing Your Cameras With Math": keep `trauma ∈ [0,1]`, add on impact, decay linearly (~1/s), offset = `maxOffset * trauma²` (or ³) * smooth noise(t) — noise rather than random so the shake is continuous ([Game Developer](https://www.gamedeveloper.com/programming/video-sprucing-up-cameras-with-math), [Bevy example](https://bevy.org/examples/camera/2d-screen-shake/)). On phones keep maxOffset small (3–6 px, ~1° rotation), and only for big shots and knockdowns, or it turns into noise.

**Easing for punches (fast out, slow back).**
- Extension: ease-*in* acceleration (cubic or `t^2`) that peaks *at* contact. The fist should reach top speed at the target, not decelerate into it. A slight overshoot (2–5% past the target, then settle) sells snap.
- Retraction: ease-out (`1-(1-t)^2`) and ~1.5–2× the extension time. "Fast out, slow back" is what reads as speed; a symmetrical in/out punch looks like a piston.
- Smear/afterimage: draw 1–2 faded glove copies along the path during the 2–3 fastest frames, or stretch the forearm stroke. On a stick-ish canvas this is the cheapest "speed" signal there is.

**Canceling and chaining.** A combo's next punch should start *during the previous punch's retraction* (a cancel window around 40–70% into recovery), not after it ends. The rear hand begins loading while the lead retracts. This overlap is what makes combos look fluid instead of sequential.

**Procedural layering (David Rosen, GDC 2014 "An Indie Approach to Procedural Animation").** Overgrowth animated everything with about 13 keyframes, using spring-interpolated poses plus procedural layers ([GDC/Game Developer](https://gamedeveloper.com/design/video-an-indie-approach-to-procedural-animation), [Unity thread](https://discussions.unity.com/t/an-indie-approach-to-procedural-animation-gdc-video-talk/538228)). Application: build the base pose from a few key poses (guard, jab-extended, cross-extended, hook-loaded, hook-extended, uppercut, slip-L/R, duck, hurt), blend between them with critically damped springs, then **additively layer** on top:
  1. rhythm bob (sin, ~1.5–2.5 Hz, amplitude scaled by stamina);
  2. head offset (slips and rolls) that is independent of the arms;
  3. a hit-reaction impulse (a spring kick to the head and torso in the punch direction);
  4. breathing (slow ~0.3 Hz chest scale when tired).
  Because each layer is a spring, interruptions never pop.

**IK for gloves.** Drive the glove target (where the fist should be) and solve the 2-bone arm analytically (law of cosines, choose elbow bend direction per punch type: hooks bend the elbow out, straights keep it down). Targets: on a punch, the target's head or body point plus an offset; in guard, a point relative to the chin. This keeps gloves on target as the fighters move.

**Blending and crossfading.** Use spring or critically damped interpolation toward the new target pose, with a stiffness per transition: very stiff (~25–40 Hz feel) for punch extension, softer for retraction and guard return. Never hard-cut poses except at hit-stop.

**Root motion and foot sliding.** In 2D: plant feet. Each foot has a world-space anchor that only moves during a step (lift, arc, plant over ~120–200 ms); the body moves between the anchors. When the hip drifts more than X from the feet's midpoint, trigger a step. This removes moonwalking. Punches carry their own weight shift: the hip travels ~10–20% of stance width toward the target on a cross and returns.

**Rhythm stance.** Real boxers bounce or shift weight on a beat. Give each style its own tempo (pressure fighter: steady heavy shuffle; outboxer: light, quick bounce; counterpuncher: low, still, almost no bob) and start punches *on* the rhythm beat with some probability. Breaking the rhythm (a punch off-beat) is itself a "feint" signal.

## 5. Real boxing timing data

- **Punch speed:** in 3D motion capture of competition boxers, lead and rear hooks are faster at the fist than the jab and cross (lead hook peak ~11.95 ± 1.84 m/s); single maximal punches average ~9.3 m/s contact speed vs. ~7.5–8.0 m/s inside combinations ([Piorkowski et al. 2011, Sports Biomechanics](https://lida.sport-iat.de/ta/Record/4021264), [UCLan](https://clok.uclan.ac.uk/3757)). **Delivery time is lower for the jab and cross than for hooks**, and lower for "in-sync" combinations than for single maximal punches. Search abstracts quote the jab as the fastest at ~0.4 s from movement onset to contact (including the preparatory movement). The authors note a defender "may have more evasion time than previously reported".
- **Reaction time:** a rear straight on a stimulus took ~310 ms in the competition period and ~390 ms when fatigued after the third round ([Jyväskylä thesis](https://jyx.jyu.fi/handle/123456789/47781), [LIDA](https://lida.sport-iat.de/ta/Record/4043483?lng=de)). Jab reactions are faster than cross reactions ([LIDA](https://lida.sport-iat.de/ta/Record/4037692)).
- **Practical game timings (est., consistent with the above):** jab total 300–400 ms (visible extension ~100–150 ms); cross 400–500 ms; hook 450–550 ms; uppercut 450–550 ms; power haymaker 600–800 ms. Inside a combo, consecutive punches every ~200–300 ms ("1-2" ≈ 0.5 s, "1-2-3" ≈ 0.8–0.9 s). Fatigue adds 15–25% (310 → 390 ms).
- **Volume (CompuBox):** junior welterweight average ~59 thrown per round; lightweight ~38 power punches thrown per round with ~36% power connect ([BoxingScene CompuBox](https://www.boxingscene.com/articles/compubox-inside-numbers-sho-wars-gradovich)). Spread: Jermain Taylor 38/rd vs. Kelly Pavlik 70/rd ([BoxingScene](https://www.boxingscene.com/articles/compubox-pavlik-vs-taylor-full-punch-stats)); extremes ~81 (20% connect) and Brandon Figueroa ~127/rd, "more than double the 122 lb average". Elite connect rates: total 28–40%, jabs 19–29%, power 36–49% ([CompuBox leaders](https://dev.compuboxdata.com/reports/49), [roundbyround](https://roundbyroundboxing.com/news/compubox-superfly-3-pre-fight-stats/)). **Your audit target (~56 thrown, ~29%) is right on the average.** That works out to roughly one punch every 3.2 s, mostly in bursts.
- **Exchange structure:** elite amateur activity:rest ratio ~18:1 vs. novices ~9:1, with novices fading round by round (16:1 → 8:1 → 6:1); winners throw more and move their feet more ([MDPI Sports 2025](https://www.mdpi.com/2075-4663/13/6/187), [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12197034)). "Activity" includes footwork. Punches come in **bursts** (1–4 punches in ~0.3–1.5 s) separated by 2–6 s of feinting, stepping, and resetting (est.).

**Technique → application:** make *the time between exchanges* full of motion (steps, feints, level changes, guard adjustments) and keep exchanges short and fast. Speed comes from the burst, and fluidity comes from the motion between bursts. Use the real ratios: about 85–90% of a round in movement-without-punching at a fresh pace, falling as stamina drops.

## 6. Boxing AI design

- **Architecture: utility AI on a small FSM.** States: `RANGE` (outside, stalking), `ENGAGE` (at punching range), `EXCHANGE` (mid-combo), `DEFEND` (reacting), `CLINCH`, `HURT`, `RESET` (exit after an exchange). Inside each state, score actions with utility curves (distance, stamina, damage, openness, opponent pattern, style weights) and pick by **weighted random among the top 2–3** rather than argmax, which avoids robotic repetition ([utility AI in fighting games, JANAPATI](https://ejournal.undiksha.ac.id/index.php/janapati/article/view/82040)). Add a per-action **recency penalty** (score × (1 − 0.3 × timesUsedInLast10s)).
- **Range management:** each style has a preferred distance band (outboxer: just outside the opponent's jab range, i.e. at his own reach; pressure: inside the opponent's reach; counterpuncher: at the edge, waiting). The core loop is footwork towards the preferred band, with lateral steps when the opponent is at an angle and cutting the ring when the opponent is near a rope.
- **Feints and rhythm:** a feint is a startup-only punch (shoulder twitch, 80–120 ms, then cancel). The opponent's `react()` sees a punch starting and may commit a slip or block; that leaves a window. The AI uses feints more against counterpunchers and against opponents whose memory says they "react a lot". Break rhythm: occasionally delay a punch by half a beat.
- **Reading the opponent:** the defender's reaction isn't perfect. Detection probability = f(ring IQ, punch startup time, whether a feint preceded it, fatigue). Rewards long telegraphs and punishes the "always blocks" look. Counterpunchers get a high read on *power* punches (long startup) and counter during the attacker's recovery.
- **Combo selection:** use a table of combos with an opening condition (e.g. "1-2" when at range and the guard is high; "1-1-2"; "2-3-2"; "body 3 then head 3" when the opponent has lowered his guard; "6-3" inside). Pick via utility on openness + style weights, then **after each punch, re-evaluate** whether to continue (hit → continue, blocked → change level, missed → abort or pivot out). That "check" makes combos look reactive instead of scripted.
- **Making styles differ (beyond numbers):**
  - *Pressure/swarmer:* inside the band, high volume, body work, a bob-and-weave head layer, low reset time, walks through jabs.
  - *Outboxer:* jab-heavy, exits with a pivot or step after every exchange, high lateral movement, quick bouncy rhythm.
  - *Counterpuncher:* low output, waits; trigger = opponent's punch startup or a whiff; throws 1–2-punch counters during the attacker's recovery; still rhythm.
  - *Slugger:* few but long-windup power shots, slower reset, more hit-stop and shake per landed shot.
  Change the *timing distributions* and *rhythm* per style, not just the damage. Two styles with the same win rate should still look different in silhouette and tempo.
- **Clinch and stagger:** a clinch trigger when one fighter is hurt or inside and smothered; arms wrap, both bodies lean on each other, and a referee break after 2–4 s. A stagger is a spring impulse plus a forced step (or two) backward, with the guard dropping lower and a balance-recovery step. FN3's flash KO / stun state shows that being "hurt" should be an *exploitable state* with a visible tell.

---

## Top 10 (prioritized for smoothness, fluidity, pace and perceived speed)

1. **Asymmetric punch easing:** accelerate into contact with peak speed at impact, 2–5% overshoot, retract in 1.5–2× the extension time with ease-out. This is the biggest speed-perception win for the least code.
2. **Hit-stop scaled by contact quality:** 2–3f for jabs, 4–6f for power shots, 8–10f for knockdowns, ~0 when blocked. Pair it with a small head-snap spring impulse.
3. **Combo overlap / cancel windows:** start the next punch during the previous one's retraction (~50% in). Bursts of 1–4 punches at a 200–300 ms cadence.
4. **Spring-based pose blending plus additive layers** (rhythm bob, head movement, hit impulse, breathing) so that nothing ever pops, including interruptions (Rosen/Overgrowth).
5. **Planted feet with step triggers,** and footwork that keeps running during punches (step-in jab, pivot-out hook). Fixes foot sliding and avoids Undisputed's "locked in an animation" feel.
6. **Continuous contact quality** (clean / glancing / smothered / miss, plus glove-vs-forearm deflection and simultaneous trades) with a distinct visual for each, à la FN4.
7. **Burst-and-reset pacing that follows real ratios:** about 56 thrown per round in short bursts; fill the 2–6 s gaps with feints, level changes, steps and guard adjustments.
8. **Guard-aware target selection plus a decaying opponent model** (TotF2: go around a high guard, attack the body, press when the opponent is tired, back off a dangerous counterer).
9. **Utility AI with weighted-random top-k selection, recency penalties, and per-punch combo re-evaluation** to avoid robotic repetition; styles differ in rhythm, timing and range, not just numbers.
10. **Light juice:** 1–2 frame glove smears or afterimages on fast frames, and trauma² noise screen shake only for big shots and knockdowns (small on phones), plus a stamina-driven tempo shift (bouncy → flat-footed).
