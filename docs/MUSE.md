# Last Bell: handoff for Muse (Claude x Muse collab)

Hey Muse. This is from Claude, the one who builds the code. Ed runs the game in your space. Here's what you need to work with him on gameplay.

## What the game is
- A phone-first auto-boxing sim. It's a watch/idle game with a side view, real boxing rules and 1v1 fights. **The player is the coach**: he doesn't throw punches. He picks the fighter, the camp and the plan, and he yells calls between and during rounds (body, jab, press, pick it up...).
- Every fighter runs his own AI brain. It reads the other man, finds his flaw, works it, gets hurt, bluffs and gasses out.
- Two pages:
  - **The fight lab**: one fight at a time.
  - **The full game**: career, saves, hub, offers, camp (drill / spar / film), weight classes, legends and P4P stars. The fighter learns from fight to fight: skills grow, he remembers rematches and carries KO scars.

## Where we are (Nov 2026)
- **Built:**
  - F1, how they move (stance, weight by style, the punch, step-drag feet, tired hands)
  - F2, fight feel (big moments at 1x, the camera pushes in on a KD, the KD replay)
  - F3, coaching (calls change what he does, and the feed shows what came of each call)
  - F4, fight IQ and balance
  - G1 + G2, the career shell and the learning
- **Known problems in the career:**
  - He levels too fast: Novice to Pro in about 25 fights.
  - The money is broken: purses pay millions by fight 30.
- **Next on the list:**
  1. Ed's notes from playing, then career tuning.
  2. G3, the world built on today's fighters (skills, size, flaws, scouting tape).
  3. G4, gym mode.
  4. 3D is parked.
- **Ideas parked:**
  - A live CompuBox stats bar
  - A highlight reel
  - A pick 'em / odds board
  - Haptics on knockdowns
  - A tournament bracket
  - A fight poster
  - Tale of the tape
  - Traits (glass jaw, slow starter, fades late)
  - A clinch rework
  - Named trainers

## Balance targets (the sim is tuned to these: don't eyeball-change them)
- Per round: ~52 punches thrown, ~15 landed, ~29% connect.
- Stoppages 30-35% of fights. Knockdowns .4-.6 a fight.
- Every style wins 48-53% against the field. A man one skill level down wins 15-20%.
- Drama: a lead change in ~40% of close fights, comebacks ~11%.

## How we split the work
- **Muse (you), with Ed:**
  - Playtest feel: what's boring, what's confusing, what's fun.
  - Design ideas, career and economy pacing, screen and UX notes.
  - Commentary and corner lines in a boxing voice.
- **Claude:**
  - Turns that into code, runs the sims (hundreds of fights per change) and keeps the balance on target.
- **The best handoff back to Claude:** one list, ranked, each item written as what Ed saw, what he wanted instead, and how much he cares. Example: "fight 12, he's already Pro, want ~40 fights to Pro, high."
- **Don't hand-edit the game files.** `game.html` is a build output. The engine changes need sims before and after, and balance numbers and visuals never change in the same step. Send ideas and notes; Claude does the edits.

## Questions open for Ed (good to work through together)
1. How many fights should it take to go Novice to Pro to World-class?
2. What should a purse look like early, mid and title fight?
3. Which of the parked extras first: stats bar, highlight reel, pick 'em, or haptics?
4. Fight feel at 4x: are the slow-downs and replays too much or not enough?
5. What does a fight look like that he wouldn't skip?
