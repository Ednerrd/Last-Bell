# Research: Fight Night Champion and The Thrill of the Fight

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

### Engine ideas (separate from 3D; each needs sims before and after, and its own commits)
- **Regional fatigue (RAF):** lead arm, rear arm, legs. The jabber's lead hand drops late, the swarmer's legs go. It gives readable knobs without changing overall output.
- **Gate flash KOs:** puncher power over a floor, and the victim mid-combo or low on gas, or walking in.
- **Slip chance goes up for a moment after he's been hit;** a hurt man covering up is briefly harder to hit.
- **Attacker targets the defender's guard holes** (some of this already exists through shout fit; check it before adding).
- **Daze meter:** a fast-draining daze meter alongside the slow damage that already builds (`wear`/`kdHurt`). Compare against what the engine already does before changing anything.
- **Career storylines (Champion mode):** a hurt hand carried from the last fight, a cut from camp, a hometown ref. The coach's shouts become how you handle them.
- **Fight challenges (Legacy):** bonus for "drop him before round 5", "take little damage", "open a cut". Gives a watch-only player stakes inside each fight.
- **Avoid:** training minigames (the most hated part of Legacy) and quietly toning damage down later.

---

## Sources
**Fight Night:**
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
