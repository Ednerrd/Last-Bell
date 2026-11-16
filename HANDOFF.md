# Last Bell: handoff (Nov 16, for Muse)

One page to get you from zero to working. Owner: Ed. Repo: `ednerrd/last-bell`, main line `claude/epic-goldberg-ps6ip4`.

## What it is
A phone-first **auto-boxing fight sim**. Side view, real boxing rules, 1v1. You don't throw punches: **you're the coach**. You pick the fighter, yell calls between and during rounds, and watch the AI box. One HTML file, no server, runs as a claude.ai artifact.

## The files that matter
| File | What it is | Edit it? |
|---|---|---|
| `index.html` (~500 KB) | **The fight lab**: engine + brain + render + audio + UI. Boots straight into a fight. Tests read this file. | Yes, but grep then read a section, never the whole thing |
| `brain/brain.js` | **The boxer AI** (standalone module). Inlined into `index.html` by `node brain/inline.js`. | Yes: edit here, rerun inline, never edit the inlined copy |
| `game/career.js` + `game/ui.js` | **The full game** (career, saves, hub, offers, camp). | Yes |
| `game.html` | Build output: `node game/build.js` = `index.html` with its lab section swapped for the two game files. Committed so Ed can grab it. | No, rebuild it |
| `proto/` | The 3D version (parked). `ring3d.html` is a build output. | Parked |
| `tests/` | Headless sims in node (~55 scripts). | Yes |

Code map inside `index.html` (markers `/* ===== LAST BELL : ... ===== */`): engine → career (fighter gen) → render → audio → ui (fight loop, corner, replay, `startFight`) → lab. All balance knobs sit in one `TUNING` block; the brain's own knobs are `BoxerBrain.BR` in `brain/brain.js`.

## Where it stands (built)
- **Engine + brain**: real punch resolution, damage zones, cuts, swelling, the doctor, the ref's stoppages, judges, gas, body work, reach/height, a skill sheet per fighter, one flaw per fighter, opponent memory, fight IQ by level (Novice / Intermediate / Pro / World).
- **The fights (F1-F4, Oct 24-25)**: F1 how they move in 2D (stance by guard and style, punch flow, step-drag feet, tired hands; last touch F1i, the crouch toned down), F2 fight feel (slow-mo big moments, camera push-in, knockdown replay), F3 coaching (your calls change what he does, the feed shows the result), F4 balance (styles, specials, guards inside target).
- **The game (G1 + G2, Oct 24)**: career, saves (db, gzipped), hub, offers, camp (drill / spar / watch tape), weight classes, legends + 2026 P4P stars, and the learning carried fight to fight (skills, talent caps, rematch memory, KO scars).
- **3D**: first iteration + all 7 stance changes built, **parked** by Ed until the 2D game is done.

## What's next (`ROADMAP.md` is the only to-do list)
1. **Ed's notes on F1-F3** in the lab (waiting on him).
2. **G3, the world on today's fighters**: rosters, rankings, the scouting tape read off the brain (his flaw, his style's habits), offers, purses, belts, a headless career test. Two tuning reads first: skills grow Novice → Pro in ~25 fights (fast edge), purses hit millions by fight 30.
3. **G4 gym mode** (stable, walk-ins, weekly plan; `docs/GYM.md`).
4. After that: the brain design pass with Ed (F4 leftovers: haymaker cheese at hard 58 vs 65 target, lead changes 37 vs ~40, comebacks 9.9 vs ~11), traits, the clinch rework, named trainers.

## Rules (Ed's, don't skip)
- **Never publish to the live game without Ed's explicit OK.**
- Small chunked edits, commit + push after each working step. Finished steps go to main too.
- **Never change balance numbers and visuals in the same commit.**
- **Render-only changes must keep the determinism hash**: `node tests/same.js 40` = `4f8e6d15` (`same.js 200` = `c1d1cdc7`). If it moves, you touched the engine.
- Engine changes need sims before and after. 50 fights is noise (±8%); 300+ per style for balance, 1500+ pooled before trusting a 1-2% gap. Check a knob moves the hash before tuning it (some engine knobs are dead since the old AI retired).
- Bare `R()` rolls in the fight loop are kept on purpose so seeded fights don't shift.
- Published pages: scripts only from cdnjs / jsdelivr / tailwind / jquery, fonts from Google Fonts, one file, no other network calls.
- One roadmap step per session; end it with `CLAUDE.md`, `ROADMAP.md` and `docs/BRAIN.md` "Where we are" current.
- Talk to Ed like a homie: short, real, roasts welcome. He reads on his phone.

## How to check your work
- `tests/check.sh TAG` the full check (~25 min on 4 cores, resumable); `tests/check.sh TAG report` prints it. Add `sp` for specials.
- `node tests/same.js 40` quick determinism hash. `tsc -p .` type-checks the brain.
- `node game/build.js --check` (game.html current), `node tests/gameflow.js` clicks through the game, `node tests/boot.js page.html` loads a page and prints errors.
- Targets: ~52 thrown / ~15 landed / ~29% connect a round; stops 30-35%; KDs .4-.6 a fight; styles 48-53% vs the field; one level down wins 15-20%; split rounds ~27%, draws ~5%.
- **Latest full check (F4, `f4e`)**: 51.4 / 15.0 / 29.1%, stops 33.1, KDs .48, styles 47.8-53.5, guards 47.2-52.3, one level down 16.0 / 13.9 / 16.2.

## Links (private to Ed's claude.ai account)
- Fight lab (F1-F4): https://claude.ai/artifact/FBLVapx4zPsKM5v9RV2vqA
- The game: https://claude.ai/artifact/RF3wctrjte4R63FyN28mC5
- Live game (Ed publishes it, not us): https://claude.ai/artifact/KYmQg6PQo4qE4qoyDDDt7k

## Read next, in this order
1. `CLAUDE.md` (the full rulebook + every test command)
2. `ROADMAP.md`
3. `docs/BRAIN.md` "Where we are" (bottom of the file)
4. `docs/GAME.md` (the career plan, G3 next)
5. On demand: `docs/NOTES.md` (system details, balance history), `brain/README.md`, `docs/SIZE.md`, `docs/GYM.md`, `research/MIND.md` (the boxing research index)
