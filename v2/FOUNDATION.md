# Last Bell v2: foundation

Draft, Oct 9 2026. Ed: start from ground zero, but with everything v1 taught us. **3D is the main goal.** Same game: auto-boxing, you're the coach.

Ed: cross out anything you hate, then we code. Questions for you are at the bottom.

v1 (`index.html` at the repo root) stays as it is. It's still playable and still publishable, and it's the reference. v2 lives in `v2/` and copies ideas from v1, not code (unless a piece is clean enough to lift whole).

---

## 1. The game in one breath
You run a boxing gym. Fighters walk in: raw kids, journeymen, veterans, ranked pros. You train them and work their corner. Each fighter runs his own career and picks his next fight. The fight plays itself in 3D on your phone. Between rounds you tell him what to change, and during the round you can shout. Whether he listens and whether he can do it depends on who he is.

Influences: Fight Night Champion (the look, the replays, the damage), Thrill of the Fight (contact feel), real 2026 boxing (styles, CompuBox numbers, rules).

## 2. What v1 got right (keep the idea)
- **Coach, not fighter.** Pure watch sim, with corner talk and shouts as the levers.
- **Real rules.** 10-point must, knockdowns and counts, cuts, the doctor, fouls and point deductions, weight classes.
- **Styles and guards.** Base styles and special styles, plus 6 guards fixed per career: standard, high, peekaboo, philly, cross, hands low.
- **Combos in trainers' numbers** (1-2-3b), and combos that flow.
- **The brain pieces:** a fading memory of the other man, anticipation, counters keyed to the defense he used, round rhythm, and round awareness.
- **Corner talk.** Round notes, text or voice, and the corner as teacher.
- **Gym mode and the stable**, plus fighter DNA: combo book, signatures, habits, the person.
- **Legends, scouting and commentary.**
- **The research folder**, which carries over whole: `research/`, `proto/RESEARCH.md`.
- **The targets**, which carry over whole. Per round: ~53 thrown, ~15 landed, ~29% connect. Stoppages ~25–30%. Body KDs 5–8%. Styles 48–53% vs the field.

## 3. What bit us (don't repeat)

| v1 problem | v2 rule |
|---|---|
| Rating decides the whole fight. One level down wins 4.4%. | **Skill is the fight.** Levels are built into the base design. Upsets one level down at 15–20% is a test from the first fight. |
| Skills planned on top of 10 stats after the fact. | **Body and skills split from day one** (section 4). |
| The engine lives in 2D. 3D had to fake the spacing (`spad` +26, lunges of 30–34). | **The engine works in real 3D space**, in meters. The renderer draws exactly where the engine says the men are. No mapping, no fudge. |
| `decide()` re-rolls a dice stack every .2–.6 s, so he has no intent. | **Intent first.** He's always in one mode that lasts seconds, and actions get picked inside the mode. |
| Ring IQ is one flat dial. | Fight IQ is a **group of skills**: reading, countering, pacing, adjusting, listening. |
| One 4,600-line file. Tests have to cut sections out of the HTML to run. | **Modules in `src/`, built into one file.** The engine is plain JS that Node runs directly. |
| Per-frame animation formulas, plus clip fixes (`settle()`). | **Keyed poses with blending**, driven by engine events. |
| Render and balance tangled together. | The engine knows nothing about drawing. The render never changes a result. |

## 4. The fighter: body and skills

The open question from v1 (ROADMAP Ed item 3). **Proposal:**

**Body (stats, 0–100).** What he was born with and builds in the gym. It changes slowly and fades with age.
- power, hand speed, chin, body toughness, stamina, recovery, heart
- plus frame: height, reach, weight class, stance

**Skills (mastery, 0–100 each).** What he knows how to do with the body. Each skill is learned from fights and training.
- **Offense:** jab, power shots, combos, body work, feints and setups.
- **Defense:** blocking, slipping and rolling, footwork out, clinching.
- **Ring craft:** cutting off the ring, rope escape, range control, angles.
- **Fight IQ:** countering, reading habits, pacing, adjusting between rounds, taking corner advice.

**Knowledge.** Familiarity per opponent style and per stance. A man who's never seen a southpaw is lost early.

v1's `accuracy`, `defense` and `footwork` stats stop being stats. They become skills: accuracy lives in each punch skill, defense in blocking and slipping, footwork in footwork out and angles.

**Level** (Novice → Intermediate → Pro → Worldclass) is read off the skills. It's never stored and never shown as a badge. The skill sheet shows a bar per skill, plus level-up moments ("he's finally sitting down on that right hand").

**A skill he doesn't own still gets tried, badly.** It's telegraphed (read and countered harder), he ends up off balance after the miss, the damage is cut, and the commentary calls it.

**Example.** Power 90 with a Novice jab: he hits like a truck, and his jab is slow, readable, and leaves him open. Power 60 with a Worldclass jab: he wins rounds with it all night.

## 5. The fight engine

- **A fixed-step sim** at 60 steps a second. It's seeded and fully deterministic: the same seed plus the same shouts gives the same fight, every time.
  - Replays re-run the sim, so nothing gets recorded.
  - Tests get a hash for free.
- **Real space.**
  - The ring is 6.1 m inside the ropes (20 ft), measured in meters.
  - Each man has a position, a facing angle, a stance and a reach.
  - Ranges come from real arm lengths: jab range is where his lead arm reaches about 95% straight.
- **Punches.**
  - Every punch has phases: load → snap → contact → retract, each timed by the body (speed) and the skill.
  - The engine decides land, block or miss, how clean it was (glancing / solid / flush), and where it hit (head or body, plus side).
  - The renderer picks the exact contact point from the live angle.
- **Defense.** Block, slip, roll, pull back, step out, clinch. The chance comes from skill, plus anticipation (memory of his habits), minus fatigue, damage and clarity.
- **Damage and gas.**
  - Head and body tracked separately, plus per region (eyes, nose, mouth, ribs) for cuts and swelling.
  - The gas tank recovers between rounds.
  - Knockdowns, counts, the doctor.
- **Officials.** The ref (breaks, warnings, deductions, stoppages) and three judges who score like humans: they lean on clean shots and effective aggression, and sometimes see it differently.
- **Events out.** The engine emits a stream for the renderer, commentary and stats:
  - punch start
  - contact (quality, region)
  - defense used
  - hurt
  - knockdown
  - mode change
  - round end

## 6. The brain (designed in, not bolted on)

1. **Intent mode.** One of: feel-out, work, press, burst, reset, wait-to-counter, hunt, survive.
   - Style DNA sets how long each mode lasts and what follows it.
   - Score, damage, stamina and the round clock push the changes.
2. **Memory of the other man.** What he leads with, what follows what, how he defends each punch, when he punches, and what hurt me. Old evidence fades. The *reading habits* skill sets how fast he learns.
3. **Anticipation.** A shot he predicted is easier to defend and easier to counter. Low skill rarely predicts anything. High skill starts reading you by round 3 or 4.
4. **Counters that make sense:**
   - slip outside the jab → right hand over
   - duck the hook → hook or uppercut back
   - pull back → straight on the way in
   - shoulder roll → right off the shoulder
5. **Setups and traps.**
   - jab-jab-right
   - body, body, then head
   - feint to draw the slip
   - show it twice, change it on the third
6. **Adjusting.** In the round, he drops what gets countered. Between rounds, his own brain plus your corner talk. Low adjusters wait too long, which is exactly why the coach matters.
7. **Hurt brain.** Shell, run, fire back, clinch or freeze, by composure. The finisher confirms the hurt and weighs the risk.
8. **Clarity.** Fatigue, damage and knockdowns blur his read.
9. **Listening.** Your shout has to beat his ego, and the *taking corner advice* skill decides whether he hears you and can actually do it.

Every one of these reads a skill. No flat IQ dial anywhere.

## 7. The 3D view

- **three.js**, pinned to an exact version and loaded from jsdelivr. Phone first, with the S25 Ultra as the target.
- **Budget:** steady 60 fps, pixel ratio capped at 2, one shadow light at 1024, under 150 draw calls, and a 30 fps battery saver because people leave idle sims running. Your phone test sets the defaults.
- **Motion:**
  - Keyed poses per guard and per punch, blended.
  - Feet plant and step, pivot on hooks, and the back foot follows on a lunge.
  - Bodies never overlap. Clinches use a scripted overhook pose.
- **Contact feel:**
  - Glancing, solid and flush each look different.
  - The head moves with the punch. Recoil goes through the puncher too.
  - A short hit-stop on flush shots.
- **Damage you can see.** Redness → swelling → bruise → cut, building across rounds. Sweat, plus blood with a gore setting.
- **Presentation:**
  - Gritty lighting: hot key light, dark crowd, haze.
  - Venue tiers, from the back-room gym up to Vegas.
  - Automatic slow-mo knockdown replays from 2–3 angles.
  - The corner scene between rounds.
- **The HUD** is DOM on top of the 3D view: clock, score, shout buttons, commentary line. Kept minimal.
- **No 2D fallback** at first. If WebGL is missing, it shows a "your phone can't run it" screen. (Question 3.)

## 8. Code layout

```
v2/
  FOUNDATION.md      this file
  CLAUDE.md          v2 working rules (short)
  src/
    core/            rng, math, events
    engine/          fight sim: space, punches, defense, damage, rules, judges
    brain/           intent, memory, anticipation, counters, setups, adjusting
    fighter/         body, skills, knowledge, levels, generation
    career/          gym, stable, training, fighter goals + fight choice, rankings, saves
    render3d/        scene, rigs, poses, camera, fx (never imports engine internals)
    ui/              screens, HUD, corner talk
  tests/             node, headless, import src/ directly
  build.js           bundles src/ into one index.html
  index.html         build output (publish this, don't edit it)
```

- Plain modern JS (ES modules), no framework, no npm dependencies in the game. three.js comes from the CDN.
- `build.js` puts everything into **one file**, because that's what Ed uploads to publish. The published-page rules from v1 still apply.
- The engine and brain have zero DOM. Node runs a 300-fight sim in seconds.
- Saves are versioned from save #1, with a migration per version.

## 9. Build order (each milestone ends with something Ed can open)

| # | Milestone | Done when |
|---|---|---|
| M0 | **Skeleton.** Folders, build, seeded RNG, test runner, empty 3D ring on a preview artifact. | The ring renders on your S25. Fps overlay on. |
| M1 | **Two men, one ring.** Footwork in real space, guards, facing. No punches yet. | They circle, cut off, back up. No overlap, ever. |
| M2 | **Punches and defense.** Jab, cross, hooks, uppercuts, body shots, block, slip, roll, pull. Keyed poses. | The audit runs: thrown, landed, connect % near targets. Straights land about 95% extended. |
| M3 | **Damage, gas, rules.** Knockdowns, counts, cuts, the doctor, judges, 10-point must. | Full fights end in real results. Stoppages and body KDs near target. |
| M4 | **Body + skills + levels** (section 4). | Upsets one level down at 15–20%. Same level ~50%. |
| M5 | **The brain** (section 6), in order: intent, memory, anticipation, counters, setups, hurt, adjusting, clarity. | The brain report per piece. Styles 48–53%. |
| M6 | **Coach.** Shouts (follow for a short window, then drift back; ignore chance by relationship + ego), the corner between rounds, corner talk, relationship value. | The coach shout sim: a smart coach beats no coach by a real margin, and a random coach doesn't. |
| M7 | **Look.** Fighters by build, damage on faces, venues, crowd, replays, commentary. | You play it for a week and the phone stays cool. |
| M8 | **Career and gym.** Created coach, walk-ins, stable, training incl. sparring (teaches skills, knowledge, stances, blocking; specials unlocked by beating the top), gym business + upgrades, fighters picking their own fights and goals, leaving/rivals/retiring, 9 weight classes × 4 belts, legends, HOF + coach retirement, sim-forward, saves. | A 3-year gym sim runs headless. Then you publish. |

From M2 on, every engine change gets a sim before and after, same as v1.

## 10. Working rules that carry over
- Small steps, a commit each, push.
- 50 fights is noise. 300+ for balance, 1500+ before trusting a 1–2% difference.
- Never change balance and visuals in the same commit.
- Determinism hash for render-only changes.
- Never publish to the live game without Ed's OK. v2 goes to its own preview artifact until Ed says it replaces v1.

---

## Decisions (Oct 9, Ed's calls in `VISION.md`)
- Body vs skills split (section 4): Ed didn't object, so this is the default. Flag it to him again at M4.
- 3D only: no 2D fallback. Weak phones get a "can't run" screen.
- 9 weight classes, 4 fictional belts.
- M0: go (Ed: "go off our list").
- Leftover Open items in `GAME.md` (staff, amateurs, media and hype, walkouts, sound, free camera): **later** by default. Ed can pull any of them in.
