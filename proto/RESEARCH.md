# Research: Fight Night Round 4, Fight Night Champion, The Thrill of the Fight, Undisputed

Done Oct 2026 for the 3D plan (`proto/PLAN.md`).

**Caveat on sources:** this environment's proxy blocked fetching the pages themselves, so everything below comes from search-engine summaries of the sources listed at the bottom. Items marked [?] could not be confirmed. The best primary sources, for whoever can open them:
- The GDC 2011 talk "Iterating Realistic Human Rendering: Boxers in Fight Night Champion".
- Ian Fitz's "Official Guide to The Thrill of the Fight" on Steam.

---

## Fight Night Champion (EA Canada, 2011)

### Where it came from
- **Round 3 (2006):**
  - punches thrown with the stick ("Total Punch Control");
  - "impact punches": a flash-KO haymaker, and a stun punch that switched to a first-person view;
  - ESPN broadcast presentation.
- **Round 4 (2009)** was the tech jump:
  - animation rebuilt as **physics-based, blending mocap with procedural motion**: "every punch is procedurally animated on the fly";
  - full-body collision, so arms don't pass through each other and gloves don't sink into torsos;
  - where a punch lands (nose, chin, cheek, forehead, neck, shoulder, the back of the head) and whether it's flush, semi-solid or glancing comes from the **angle between the fighters and how stiff the shot is**;
  - height and reach matter: long men fight outside, short men have to get inside;
  - Legacy career mode first appeared here.
- **FNC** kept Round 4's physics core and changed four things: controls, stamina, the look of damage, and the story mode.

### Animation and physics
- **Physics layer:** muscle flex, flesh jiggle, and a **body ripple that runs through the man who gets hit and back through the man who threw it**. Sweat drips down the face and sprays off on impact.
- **"Full Spectrum Punch Control":** the stick angle maps 1:1 to the punch angle, so punches sit on a **continuous range** (jab → hook → uppercut) rather than a few fixed clips.
- **Blocking:** one button. Round 4's slow-motion parry window was removed. Tapping block just before impact bats the punch away.
- **Knockdowns:**
  - the camera sways as a man is about to go;
  - the fall is a physics blend (not a pure ragdoll [?]);
  - an **automatic slow-motion replay** plays from several angles.
- **Weak spot:** reviewers called the footwork weak ("footwork is still weak") and said the corner did little without player input.

### Models and visuals
- **Skin:** pre-integrated subsurface scattering with spherical-harmonics lighting. Blood scatters under the skin, so bruises look real.
- **Damage tracked per region** (each part of the face and body separately), shown in stages: **redness → swelling → bruising → cuts**, possibly leading to a ref or doctor stoppage. Blood **drips and soaks into the trunks**, and the face skin ripples in slow-motion replays.
- **The "gritty" look:** dark venues with the ring as the main light, haze and smoke in the light cones, and a night sky over outdoor venues. When a man is stunned the camera tilts and a faint ringing plays.
- **Minimal HUD:** health and stamina mostly hidden during the fight, stats shown between rounds.
- **Controversy:** players felt blood and cuts got much rarer after a patch (the "Bring Back Brutality" petition).

### Fight systems
- **Three meters:**
  - **Stamina**: affects power, speed and recovery.
  - **Health**: how close he is to a knockdown.
  - **Damage**: builds up, raises the chance of a cut stoppage and makes it harder to get up.
- **Stamina is split in two:** Endurance (the maximum for the fight, drops permanently) and Conditioning (short-term ability to throw).
- **Regional Anaerobic Fatigue (RAF):** four hidden meters (left arm, right arm, torso, legs).
  - Overusing one gives weak punches.
  - Taking shots to one area drains stamina faster.
  - Between-round recovery depends on how the round went.
- **Flash KO and critical stun** only unlock once the puncher's power passes a threshold. They're more likely when the victim has just emptied his tank throwing combinations, or walks into a hook.
- **Getting up:** a balancing mini-game that gets harder after each knockdown and as damage builds.
- **Fouls:** low blows and headbutts do extra damage and open cuts, then cost point deductions and finally a DQ (as in Round 2; FNC [?]).
- **Seven fighting styles**; skill points go into each punch separately.
- **AI:** reviewers said 12 rounds of AI-vs-AI still look good. The community says the AI sliders don't fix bad decisions.

### Modes
- **Champion mode** (a story mode) was the most praised part. Each fight has a **constraint**:
  - stay outside against a body puncher;
  - protect a cut eye;
  - fight with a hurt hand;
  - head shots only, under a crooked referee.
- **Legacy career:** a calendar, training minigames, sponsors, gyms, rivals, a Legacy/GOAT meter, 50 boxers across 7 divisions, aging and retirement.
  - It also had **fight challenges**: bonus XP for scoring a knockdown before round X, taking little damage, or opening a cut.
  - Reviewers called Legacy "archaic", "soulless" and "dull", and the minigames a "necessary evil".
- **Reception:** Metacritic about 85.
  - **Praised:** the models, punch physics, damage/blood/sweat, the lighting, the KO replays, RAF stamina, Champion mode.
  - **Criticized:** footwork, the corner, the auto-block feel, the dry career mode, damage toned down.
- **New EA Fight Night:** only rumours. Reportedly in on-and-off development, with guesses of 2027–28.

---

## The Thrill of the Fight 1 (2016) and 2 (2024): VR, Ian Fitz / Sealost (ToF2 with Halfbrick)

### Damage (ToF1, from Fitz's guide)
- **No health bars.** Each hit's force = the fist's speed × a mass value × a balancing multiplier (hooks have their own).
- **Damage ≈ force × weak-spot bonus × pain/trauma factor ÷ chin.**
- **Below the chin threshold** a hit does nothing lasting. **Above it**, the hit feeds:
  - a fast-draining **daze** meter: fill it fast enough and he goes down;
  - slow **head trauma** / **body pain**, which lower the threshold a tiny bit, "extremely small, but it adds up". So knockdowns cluster late.
- **Weak spots count only when hit from the right direction:** the chin, the side of the jaw (a hook there can knock out in one) and the solar plexus. **Head rotation** is rewarded.
- **Colour-coded impact flashes** (blue → yellow → orange → red) were the players' damage readout.
- **Knockdowns:** a mandatory 8-count. Time on the floor follows how hard the knockdown shot was plus his built-up trauma.
- **Judging:** 3 judges each pick a round winner. Whoever scored more knockdowns wins the round; otherwise the one who dealt more damage.
- Visible injuries reset between rounds.
- **ToF2** dropped the force multiplier. Angle, the guard and timing now matter. A solid contact on the arms means **no damage even if the physics pushes the glove through**: the rules decide, not the collision.

### Opponent AI
- **Attack:** he looks for openings around the guard. High hands → he comes close and hooks around them. A tight guard → he goes to the body.
- **Hurt state:** jaw drops, eyes wander, less power. He **backs off and covers the hurt spot**, which makes him harder to hit for a few seconds, then he regroups. After eating clean shots he leans defensive for a while.
- **Fast men slip, and slip more right after being hit** (Lightning Luis).
- **The ToF1 roster is a ladder, each man built around one trait:**

  | Opponent | Trait |
  |---|---|
  | Ugly Joe | Rocky-type brawler, slow feet |
  | The Reverend | Glass jaw, high block |
  | Lightning Luis | Fast and angry; first one to slip |
  | The Spider | Long reach, no defence, glass jaw |
  | Hojo | Southpaw counter-puncher who punishes you for covering up |
  | Duke Bell | One-punch power and endurance |
  | Mateo Vega | Evasion |
  | Moneymaker | All of the above |

- **Champions** get small hidden edges: about +5% power and −3% damage taken.
- **ToF2 AI:** rushers, patient counter-punchers, and men who mix feints and pressure. UploadVR found it intense.

### Animation, visuals, performance
- **Hit reactions** scale with how hard the shot was (grimace, eyes roll, dazed posture). ToF2's head moves with the punch: an uppercut snaps it back and up, a shot on the ear spins it [?].
- **ToF2's biggest complaint:** the AI walking *inside* the player's body. Players called **bodies overlapping the top immersion-breaker**.
- **Visible damage:** cuts, bruises and eye swelling. ToF2 adds venues from a small gym to a stadium, a reacting crowd (cheers, gasps), and Coach Berg with 2,000+ voiced lines (corner advice and post-fight breakdowns).
- **The Quest (mobile chip) port:** the only cut was a **smaller crowd**. "Already graphically simple", so the sim stayed identical. Lesson: simple art, crowd density as the first setting to drop.
- **Reception:**
  - ToF1 is widely called the best VR boxing game: real effort pays off, each opponent teaches one skill.
  - ToF2 is split (UploadVR about 6/10): praised for visuals, AI and coach; criticized for inconsistent damage, weak body shots, flailing exploits, clipping and phantom fouls.

---

## Fight Night Round 4 (EA Canada, 2009)

Metacritic 88, GameSpot 9.0. Many fans still call it the most "sim" Fight Night; Champion was later called "dumbed down".

### Physics and animation
- **Engine:** new in-house physics layer. Every punch is "procedurally animated on the fly". Most likely authored clips bent at runtime by physics and collision [?].
- **Speed:** 60 fps, physics at **120 Hz**.
- **Contact:** reads speed, direction, angle, how much the glove touched, the distance and position of the two men, height and reach, and the deflection off a face or glove.
  - Outcomes run from "face crunchers" to semi-solid shots to **glancing blows that barely make contact**.
  - Shots land on the nose, chin, cheek, forehead, neck, shoulders, even the back of the head.
  - **Clean shots were the minority** (in Round 3 almost everything landed solid).
  - A partly blocked punch can leak through the guard.
- **Momentum:** walking into a punch makes it heavier; rolling or moving away makes it lighter. A duck can still get clipped on top of the head.
- **Full-body collision:** arms don't pass through each other and can **get tangled**.
- **Inside fighting (the headline feature):**
  - Round 3 had an invisible wall between the boxers. Round 4 let them lean on each other, push, and put "Tyson's head in Ali's chest and throw bombs".
  - Slips keep forward momentum, so a man can get inside while slipping.
- **Hit reactions:** fighters absorb shots more and contort less. A big stun = camera zoom + the fighter flashes yellow.
- **Knockdowns:** physics-varied falls [?]. **The big complaint:** the fall didn't match his condition. A man fell like he was finished, then got up fresh. Fans wanted a wobble after he rises.

### Fight systems
- **Three bars:** health, stamina, block.
  - Head shots drain health. Body shots and missed punches drain stamina.
  - **Low stamina makes head shots hit much harder**, so body work sets up the knockout.
  - The block meter wears down: an overused guard gets knocked aside and lets punches through.
- **Defence and counters:**
  - Round 3's parry → haymaker counter was cut as "gamey".
  - A counter is now a well-timed block or dodge that does extra damage.
  - On high difficulty it became a counter-punching spamfest.
- **Power shots:**
  - Haymakers are a modifier on any punch.
  - **Flash KOs are no longer a special move**; they come out of the physics (clean shot, right spot, right moment).
- **Corner between rounds:**
  - **Points earned from the round:** e.g. +12 for landing over 60%, plus points for dodges, stuns, knockdowns and getting up.
  - The points are spent on health, stamina or cuts.
  - Eye cuts can stop fights.
- **Get-up:** balance mini-game. About four knockdowns until it's effectively impossible.
- **Sliders the sim community lived in:**
  - power, damage, toughness, counter window;
  - ref foul and damage awareness;
  - CPU offense, defense and output.
  - "Fred's sim sliders" turned power down to 7 so that jabs wouldn't stun.
- **AI "R.E.A.L."** (Record, Evaluate, Adapt, Learn), styled from classic fight footage.
  - **Praised:** it plays to each fighter's strengths.
  - **Hated:**
    - it read button inputs (instant blocks, inhuman counters);
    - its defence switched on and off within a round.
- **Patch (Sept 2009):** haymakers cost more stamina, and spamming bob-and-weave drains stamina. The community argued "patched vs unpatched" for years.

### Legacy mode (first appearance)
- **Ladder:** Bum → Prospect → Contender → Champion → Ring Legend → GOAT, with goals at each step. GOAT needs about a 90% win rate, #1 pound-for-pound, 100% popularity and title defences.
- **What it had:**
  - a 50-man division;
  - a calendar and an email inbox;
  - pound-for-pound rankings;
  - unifying belts;
  - year-end awards.
- **Training and weight:**
  - Six training mini-games; auto-train caps at about 50%.
  - Young fighters gain more from training.
  - Moving up a weight class only as champion, at most two divisions.
- **Criticized:**
  - no money or purses;
  - popularity was meaningless;
  - **the fighter's look never aged**;
  - no rivals or story;
  - frustrating mini-games.

### Presentation
- **Bodies and damage:**
  - muscles ripple on punches;
  - sweat builds and sprays;
  - bruises, cuts, blood spray, swelling.
- **HUD:** the bars came back, but could be turned off to read the fighter instead.
- **Replays:** slow-motion KO replay with a crunch and the face rippling. A free replay camera.
- **Roster:** 48 licensed boxers.
- **Commentary:** Tessitore and Atlas. **Hated for repeating** ("best round I've ever seen" every round), but liked for actual opinions about the sport.

---

## Undisputed (Steel City Interactive, Early Access 2023, 1.0 Oct 2024)

Built in **Unity** (Undisputed 2 is being rebuilt in Unreal 5). OpenCritic 7.3, IGN 6. Steam recent reviews fell to 58% at 1.0. Support ended after update 2.0 (Oct 2025) and the studio moved to the sequel.

### Tech and animation
- **Body scans** of real boxers; mocap with Roy Jones Jr. and others.
- **60+ punches** from multiple angles, plus feints and a power modifier.
- **Footwork (the selling point):**
  - "Loose" movement is bouncier and evades better, but he takes more damage.
  - **When gassed he goes "flat-footed" automatically**: sluggish, no bounce.
- **Movement was locked into states:**
  - 4-direction steps;
  - **no punching or slipping while moving**;
  - animations had to finish before the next action.
  - It read as clunky and robotic. The sequel's headline fix is 8-way movement with punching and weaving on the move.
- **Hit detection was the longest-running complaint:**
  - "a punch lands or misses and the result doesn't align with what I've seen on the screen";
  - punches going **over the head at close range** (fixed 9 months after launch);
  - **a punch on the glove or shoulder looked the same as a flush one.**
- **Punch feel:**
  - "Pillow fists", all arm, "uppercut… all arm, zero lower body, no impact".
  - FNC still wins on impact.
- **Knockdowns:** few fall animations, floppy ragdolls against the ropes ("ragdoll boxing").

### Fight systems
- **Stamina:**
  - Heart rate rises with output and drains energy (praised as smart).
  - Short-term vs long-term stamina; body shots drain it.
  - Blocked punches cost less than misses but more than landed punches.
  - Complaint: legends gassed by round 6.
- **Two health bars** (head and body) decide when he's **dazed**. A dazed man recovers if the attacker doesn't follow up within about 1 second [?].
- **Flash knockdowns** only happen when the victim's short-term stamina is under 30%; a flash KO needs under 20% (community explanation).
- **Get-up mini-game:** holding triggers to line up meters, widely hated.
- **Damage:**
  - The Dec 2023 update added blood on the face, chest and trunks, blood-tinged sweat, more cut spots and deeper bruising.
  - **The ref stops it when an eye is swollen shut**; the hired cutman works on it between rounds.
  - Before the update: "where is the facial damage?!"
- **AI:**
  - **"Frustration" and "Under Pressure" meters**: a frustrated fighter throws headbutts and low blows.
  - Four archetypes (boxer-puncher, slugger, swarmer, outside fighter).
  - Complaints:
    - passive (shells up all fight) or a "counter-punching machine" (138 counters to 18);
    - online body-uppercut spam;
    - the jab as the weakest punch.
- **Judges:** big "the judges are a joke" threads (one judge wildly off, robbed after a knockdown). A patch toned down how much each judge's taste counts.
- **No sim sliders**, though players asked for them.
- **No CPU-vs-CPU watch mode** either. Players asked for exactly that: "train fighters, watch their rise and fall and retirement". **That's Last Bell's whole premise.**

### Career
- **Start:** an amateur tournament sets your starting rank.
- **Team:** hire a coach (which stats can improve, injury healing), a cutman and a manager (negotiation).
- **Fight offers:** negotiate purse share, promotion budget, camp length, rematch clauses and media.
- **Camp:** 4 weeks picked from menus (no mini-games). Random camp injuries and a weight cut.
- **Belts:** national → continental → world → unified → undisputed.
- **The world lives on:** AI fighters train, fight, get hurt, cancel and retire.
- **Criticized:** "spreadsheet-style menus", "no drama", no rivalries, press or story, repetitive.

### Presentation and reception
- **Roster and commentary:**
  - 70+ licensed fighters and 14 venues.
  - Commentary panned: the same lines "hundreds of times", calls that don't match the action.
  - "Lack of in-ring drama"; the sequel lists ring walks and cinematics as focus areas.
- **Liked:**
  - footwork and defense ("better than FNC" there);
  - feints;
  - the heart-rate stamina;
  - the models and the roster.
- **Disliked:**
  - punch feel;
  - hit detection that doesn't match what you see;
  - the AI extremes;
  - locked movement;
  - knockdown animations and the get-up mini-game;
  - netcode;
  - judging;
  - commentary;
  - **paid day-one DLC** with current champions locked behind it;
  - support ending early.
- **Community verdict:** Undisputed wins on movement and sim depth; Fight Night Champion wins on **punch weight, impact, cinematic knockdowns and polish**.

---

## What Last Bell takes from this

### For the 3D plan (render only, no balance change)

**Phase 1 (motion):**
1. **The engine decides the result, geometry decides the look.** The engine says land / block / miss and how clean. The renderer picks the contact point (nose, chin, cheek, forehead, shoulder, glove) from the live angle, so no two shots look the same. The ToF2 lesson: if a glove clips a little on a block, the result still reads right. Don't chase perfect glove contact.
2. **Bodies never overlap**, with a hard minimum chest gap (ToF2's top complaint). Clinches go into the scripted overhook pose.
3. **Punches drawn from a continuous angle** (more of the `pv` variety): a jab that catches the shoulder, a hook that clips the ear.
4. **Three tiers of contact:** glancing (deflect, small head turn, no spray), solid, and flush (big head snap plus spray).
5. **Head moves with the punch:** straight → back, hook → twist, uppercut → chin up. Size scales with damage. **Recoil goes through the puncher too** (shoulder kickback).
6. **Hurt body language:** jaw drops, eyes drift, he backs off and covers the spot that was hit, his punches go slow and soft.
7. **The get-up as a struggle:** the engine already knows whether he beats the count. Choreograph it: a wobble, a false start, worse with each knockdown.
8. **Tired body language from the engine's gas:** guard drooping on the tired side, heavy feet.

**Phase 2 (look):**
9. **Damage per region, drawn from where shots land** (the renderer tracks events per region: left/right eye, nose, mouth, ribs). Stages: redness → swelling → bruise → cut. It **builds across rounds** and never resets. "His left eye is closing" becomes visible.
10. **Lasting blood:** drips onto the chest, soaks the trunks, spots the canvas. Cheap with decals or vertex colours. Gore level as a setting.
11. **Sweat:** the sheen rises with rounds and gas, and spray flies off on big shots.
12. **Gritty lighting:** a hot key light over the ring, the crowd near black, haze in the light cone. It's cheap, and it hides a low-poly crowd. Each venue tier lit differently.
13. **Crowd:** reacts to `excite` (rises with exchanges, gasps on near misses). It's also the first setting to drop on the phone.

**Phase 3 (presentation):**
14. **Camera grammar:** a hurt man → slight sway plus a faint ringing. Knockdown → **automatic slow-motion replay from 2–3 angles** (low ringside, over the shoulder, high wide). Reviewers called this the best presentation feature.
15. **Corner scene that reflects the round:** cutman on the eye that's swelling, the fighter slumping harder in late rounds.
16. **Optional "analyst view":** colour-coded impact flashes (blue → red) for people who want to read the damage.

**Added from Round 4 and Undisputed:**
17. **Glancing is the common case** (Round 4). Clean, flush shots should be the minority on screen too.
    - Add a near-miss band: a late slip gets clipped on the crown, a punch skims the shoulder.
    - An arm tangle: both throw at once and the arms cross and stop.
18. **What you see must match what the engine decided** (Undisputed's worst complaint). Each result gets its own pose, sound and effect:
    - a blocked glove pops;
    - a shoulder roll glances off;
    - a flush shot snaps the head.
    - Never show a glove sinking into a face on a block.
19. **Power comes from the legs and hips** (Undisputed's "pillow fists"):
    - hips turn and the back heel turns over;
    - uppercuts drive up from a knee dip;
    - a short hit-stop on flush power shots.
    - Never all arm.
20. **No movement locked into states:** punches blend on top of a stepping lower body, so men punch and slip while moving. Close range gets the hardest clip testing (Undisputed's over-the-head bug).
21. **Gassed = flat-footed** (Undisputed): the bounce goes, the feet plant, the hands sag. **The guard wears down** (Round 4's block meter): late in a fight the gloves sit lower and wider and get knocked aside.
22. **The knockdown and the rise match his condition** (Round 4's big complaint):
    - choose the fall from how bad the shot was;
    - the rise speed from how much he has left;
    - a man who barely beats the count wobbles on the restart.
    - Falls are hand-made with variety (into the ropes, a delayed fall, a flash knockdown he pops right up from). Not floppy ragdolls.
23. **Inside work as its own look** (Round 4): heads on chests, shoulders leaning, short shots. Not a clinch, but `bodyPush` relaxes almost to touching.
24. **The broadcast package:** a ring walk, an intro card, corner chatter, a slow-motion knockout replay. Undisputed's "no drama" was a top complaint, and they're cheap next to what they add.
25. **Visible aging on the 3D model** (Round 4's fighter never aged): greying hair, a thicker middle, a slower idle bounce late in a career.

### Engine ideas (separate from 3D; each needs sims before and after, and its own commits)
- **Regional fatigue (RAF):** lead arm, rear arm, legs. The jabber's lead hand drops late, the swarmer's legs go. It gives readable knobs without changing overall output.
- **Gate flash KOs:** puncher power over a floor, and the victim mid-combo or low on gas, or walking in.
- **Slip chance goes up for a moment after he's been hit;** a hurt man covering up is briefly harder to hit.
- **Attacker targets the defender's guard holes** (some of this already exists through shout fit; check it before adding).
- **Daze meter:** a fast-draining daze meter alongside the slow damage that already builds (`wear`/`kdHurt`). Compare against what the engine already does before changing anything.
- **Career storylines (Champion mode):** a hurt hand carried from the last fight, a cut from camp, a hometown ref. The coach's shouts become how you handle them.
- **Fight challenges (Legacy):** bonus for "drop him before round 5", "take little damage", "open a cut". Gives a watch-only player stakes inside each fight.
- **Momentum** (Round 4): walking into a punch makes it heavier, moving away lighter. The engine already has footwork velocity; check it before adding anything.
- **Low stamina makes head shots hurt more** (Round 4), so body work sets up the knockout. Compare with what `wear`/gas already do.
- **Corner recovery earned in the round** (Round 4's points): the corner's work between rounds scales with how the round went.
- **Frustration / pressure meter** (Undisputed): a frustrated or trapped man fouls and retreats. It fits the spoiler's foul logic and the commentary.
- **"Fight settings" sliders for sim fans** (Round 4's community lived in them; Undisputed didn't have them): power, ref stoppage strictness, cut frequency, output, mapped onto TUNE/DMG/CUT. Results only count as "official" on defaults, if that matters.
- **Judging check** (Undisputed's "judges are a joke"): keep per-judge taste small, show the cards, and have commentary call close rounds before the cards come out.
- **Commentary pool size:** a no-repeat window per fight and per career, and never call a shot that didn't land (both Fight Night and Undisputed got panned for repetition).
- **Career drama between fights** (Undisputed's "spreadsheet menus"): rivalries, callouts, rematch clauses, injury stories, press lines. Resumes and legends already exist; turn them into story.
- **Avoid:**
  - training minigames (the most hated part of Legacy);
  - get-up minigames (hated in all three);
  - quietly toning damage down later;
  - paywalls or locking core content;
  - superhuman AI reads (Round 4) and AI that's all passive or all counters (Undisputed).

---

## Sources
**Round 4:**
- https://www.gamespot.com/articles/fight-night-round-4-the-physics-of-fighting/1100-6233939/
- https://www.gamespot.com/articles/fight-night-round-4-first-look/1100-6206056/
- https://www.gamespot.com/reviews/fight-night-round-4-review/1900-6212739/
- https://www.ea.com/en-gb/news/real-ai-in-fight-night-round-4
- https://www.ea.com/news/fight-night-round-4-producer-mike-mahar
- https://www.espn.com/espn/thelife/videogames/news/story?id=3968745
- https://pacejmiller.wordpress.com/2009/08/03/review-fight-night-round-4-part-ii-gameplay/
- https://pacejmiller.wordpress.com/2009/08/06/review-fight-night-round-4-part-iii-legacy-mode/
- https://gamefaqs.gamespot.com/boards/946195-fight-night-round-4/50243586 (sim sliders)
- https://www.shacknews.com/article/59440/fight-night-round-4-update

**Undisputed:**
- https://en.wikipedia.org/wiki/Undisputed_(video_game)
- https://opencritic.com/game/17418/undisputed
- https://www.pushsquare.com/reviews/ps5/undisputed
- https://www.forbes.com/sites/brianmazique/2023/02/05/undisputed-boxing-early-access-the-good-the-bad-and-the-bottom-line/
- https://www.forbes.com/sites/brianmazique/2024/10/11/undisputed-review-5-things-id-like-to-see-in-a-future-update/
- https://blog.playstation.com/2024/10/02/undisputed-launches-oct-11-how-body-scans-deliver-boxing-authenticity/
- https://playundisputed.com/news/womens-revolution-update
- https://www.operationsports.com/undisputed-patch-1-4-4-has-punch-tracking-improvements-return-of-flash-kos-and-more
- https://www.operationsports.com/undisputed-update-2-0-arrives-on-october-28-full-details-and-patch-notes/
- https://www.operationsports.com/undisputed-developers-confirm-no-more-updates-as-sequel-enters-production/
- https://forums.operationsports.com/forums/boxing/1012416-whats-better-fight-night-champion-vs-undisputed-lets-keep-real-2.html
- https://steamcommunity.com/app/1451190/discussions/0/3759977946668425919/ (judges)
- https://steamcommunity.com/app/1451190/discussions/0/3766734182330079704/ (get-up)

**Fight Night Champion:**
- https://blog.playstation.com/2011/01/04/fight-night-champion-full-spectrum-punch-control-saves-your-thumbs-controllers/
- https://www.ea.com/news/managing-your-stamina
- https://www.ea.com/news/fight-night-champion-art-blog
- https://www.ea.com/news/controls-tutorial
- https://www.destructoid.com/fight-night-champion-gets-serious-about-stamina/
- https://gamerant.com/fight-night-champion-damage-endurance-trailer/
- https://gdcvault.com/browse/gdc-11/play/1014661
- http://c0de517e.blogspot.com/2011/09/fight-night-champion-gdc.html
- https://www.gdcvault.com/play/1025210/Physics-Driven-Ragdolls-and-Animation
- https://www.gamespot.com/articles/fight-night-round-4-the-physics-of-fighting/1100-6233939/
- https://www.gamespot.com/reviews/fight-night-champion-review/1900-6301493/
- https://gameinformer.com/games/fight_night_champion/b/ps3/archive/2011/02/23/a-dramatic-finish-in-a-fight-to-the-top.aspx
- https://www.osftw.com/news/456128/fight-night-champion-blog-gameplay-legacy
- https://kotaku.com/fight-night-champion-starts-your-career-with-a-big-loss-5725940
- https://en.wikipedia.org/wiki/Fight_Night_Champion
- https://en.wikipedia.org/wiki/Fight_Night_Round_4

**Thrill of the Fight:**
- https://steamcommunity.com/sharedfiles/filedetails/?id=1780809608 (Fitz's official guide)
- https://steamcommunity.com/app/494150/discussions/0/3272436852832413572/ (damage Q&A)
- https://steamcommunity.com/app/494150/discussions/0/1620599015903604959/ (KOs and scoring)
- https://www.uploadvr.com/the-thrill-of-the-fight-2-ian-fitz-interview-early-access-impressions/
- https://www.uploadvr.com/the-thrill-of-the-fight-2-review/
- https://www.uploadvr.com/thrill-of-the-fight-quest/
- https://roadtovr.com/thrill-fight-2-boxing-sim-release-quest-3/
- https://www.techradar.com/gaming/the-thrill-of-the-fight-2-vr-gaming-preview
- https://medium.com/super-jump/how-to-design-boxing-in-vr-dc4aae95e2d6
- https://www.realityremake.com/articles/thrill-of-the-fight-opponent-breakdown
