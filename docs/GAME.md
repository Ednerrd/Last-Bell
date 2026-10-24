# The 2D game back (Ed, Oct 24)

Ed: "put the whole engine, what we research, everything that's under the brain, and put it in the 2D version of the game." Both parts, in this order; 3D is parked until it's done.

1. **The full game back** on today's engine + brain: title screen, career, gym mode, saves, hub, camp, as it was before the Oct 10 cut, with the L4 learning wired in (a man carries what he learns fight to fight).
2. **The 3D motion research in the 2D drawing**: stance by guard and style, punch flow, step-drag feet, tired hands (`proto/STANCE.md` 7, `proto/PLAN.md` "Round 2"). Render only. Ed's call replaces the old "no 2D-only render polish" rule (ROADMAP Decided).

## Where the old game is
- The last full build: `git show 51ee63f^:index.html` (Oct 10, 4,569 lines; needs a full clone: `git fetch --unshallow`).
- The cut: `51ee63f` (UI: title, create, hub, camp, gym screens, saves) and `a483334` (career + gym logic down to fighter generation, `tests/gym.js`, the lab build); `321ea56` (Oct 14) dropped the dead bits left over (money, modal, `STAT_LABEL`).
- Sections in the old file (markers `/* ===== LAST BELL : ... ===== */`):
  - **career** (1584-2289, 705 lines; 100 left today). Gone: `newCareer`, `applyResult`, `genOffers`, `bookFight`, `runCamp`, `trainWeek`, `learnRate`, `STYLE_LEARN`, `INJURIES`, `rankList`, `p4p`, `worldSim`, `genRoster`/`genStars`/`ensureStars`, `LEGENDS`, `ORGS`, `purseFor`, `scoutHim`, `changeDiv`/`DIV_MOVE`, `migrateSave`; gym mode: `newGym`, `gymWeek`, `GYMS`, `WALKIN`/`genWalkin`/`signWalkin`, `gymAfterFight`, `GYM_REP`, `GYM_CUT`. Kept today: `genFighter`, `genStats`, `genRecord`, `genStar`, `P4P_2026`, `DIVS`, `GEAR`, looks and names.
  - **ui part 1** (3456-3781): `Store` (localStorage + claude `db`/`user` sync), `persist`, `Backup` (save codes), the scouting tape (`tapeHtml`, `publicRead`, `cornerRead`), `titleScreen`, `createScreen`/`rollDraft`.
  - **ui part 2** (3781-3976): `hub`, `hubBody`, `renderOffers`, `campScreen`, `retiredCard`.
  - **ui gym** (3976-4093): `gymCreate`, `gymHub`, `walkScreen`, `planScreen`, `gymCamp`.
  - **ui part 3** fight end: `applyResult(save, o, F)`, then `gymAfterFight`, then `persist()`.

## What changed in the engine since (the rewiring)
The old career learned the old way (stats grow from training weeks, `learnRate`, `STYLE_LEARN`). Everything below was built after the cut and has no career to live in yet:
- **Skills vs stats** (L0-L1): `sheet.sk` skills (`skillSheet`, `skFromRecord`), level from skills (`levelOf`, `BoxerBrain.tierOf`).
- **L4 learning** (`docs/LEARN.md`, `LRN` in TUNING): `learnInit`, `learn(sheet, f, side, rng)` after a fight, `applyLearn`, idle loss, legs with age, `know` of styles and stances.
- **Camp** (L4d): `camp(sheet, pick, opp, rng)`: drill a skill, spar a lookalike, or watch tape (`tapeOf`).
- **Rematch memory** (L4c): `sheet.opp`, `priorOf`, `BR.prior`. **Scars** (L4e): `LRN.scar`, `BR.scar`.
- **Flaws** (2a): `sheet.flaw`, `flawOf`. **Size** (s1-s3): `sizeOf` (height, reach), drawn at his height.
- The corner talk, the AI corner, judges, cuts, swelling, the doctor: all inside the fight already, nothing to wire.
- Saves: today's page already asks for `{db:{},user:{},sample:{}}`.

## Built (Oct 24, G1 + G2)
Ed's answers: `game.html` next to the lab, career first (gym mode later), a private link (own link, not the old preview: reading the old page to overwrite it costs ~150k tokens and it's the last private copy of the pre-cut game).
- **Files.** `index.html` keeps one engine: its lab front end sits in its own section (`/* ===== LAST BELL : lab`), the fight screen is shared (`startFight(A, B, o)` with `bar`/`intro`, `learnLines(d, before, O)`). `node game/build.js` swaps the lab section for `game/career.js` (logic, no DOM, loads in node) + `game/ui.js` (screens, saves, boot) and writes `game.html` (committed; `--check`). The hash is untouched (`same.js 40` 3fd3c667).
- **Career logic** (`game/career.js`): the old one-fighter career (ranks, offers, purses, belts, legends, world sim, resumes, scouting, weight classes, injuries, wear, camp body work) with gym mode out. World rosters now carry the 2026 P4P stars as well as the legends (`ensureStars(ensureLegend(...))`).
- **The learning** (G2): the player keeps `sk`, `cap` (talent: off his ceiling `pot`, not today's body), `know`/`knowPk`, `idle`, `opp`, `scar`, `tape`, `flaw` and a fixed `ht`/`reach` (`newSkills`; `sizeOf` and `flawOf` hash his stats, so they're rolled once and kept). After each fight `learn()` + `applyLearn()` replace the old random stat bumps; the other man files his memory of you too (`opp.opp`, a rematch reads it). Camp adds one ring IQ pick: `camp()` drill a skill / spar a lookalike / watch film (3 sims; the screen paints first). World men get skills off their records, size and flaw the first time they're needed (`ready()`, skills refreshed every 4 fights of record).
- **Screens**: ring skills panel (4 groups, the talent tick, level), height and reach, the scar note, level on the offers, the camp pick, "What he takes from this one" on the result, judges by name. Corner talk and the brain box ride along from the lab.
- **Saves**: new key `lastbell_game_v2`, db docs `data/users/<id>/game<i>`, gzipped (`Backup.pack`): rematch memory is ~3 KB a man, 30 fights ~105 KB raw (~26 KB packed; a db doc holds 256 KiB). Old v1 saves (other key) are untouched; a pasted v1 backup code gets a skill side (`migrateSave`).
- **Checks**: `tests/career.js 2 30`: Novice (33-35) -> Pro (70-71) in ~25 fights, top 10-12 by fight 30, 14-17 men remembered, one scar; `tests/gameflow.js` drill / spar / tape: no page errors; a fake-db run: the save comes back after local storage is wiped.
- **Open for tuning (after Ed plays):** skill growth sits at the fast edge of the grow targets once camp drills stack on top (`LRN.camp.drill` 4); the old purses run to millions by fight 30 without a title; nothing yet shows him what he remembers of a man before a rematch (G3, the tape).

## The plan
- **G1. The shell back** (built). Bring the old career + UI sections back into a new `game.html` built from `index.html` (`index.html` stays the lab: tests and the 3D bench read it). Old saves: new save key, no migration (the sheets changed too much). Title -> new career or gym -> hub -> offers -> camp -> fight (today's fight screen) -> result -> hub. Engine untouched: the `same.js` hash on `index.html` holds.
- **G2. The learning wired in** (built). After each fight `learn()` + `applyLearn` replace `learnRate`/`trainWeek` stat growth; the camp screen offers `camp()` picks (drill / spar / tape); `sheet.opp` memory for rematches; scars on a KO loss. Training weeks keep the body (stats) only. Check with `tests/grow.js`-style runs through the career loop: fights to each level, no snowball.
- **G3. The world on today's fighters.** Rosters, rankings, the P4P stars with skills, size and flaws; the scouting tape reads today's brain (his flaw, his style's habits) instead of the old `GUARD_SCOUT` lines; offers, purses, belts. A headless career test (the old `tests/gym.js` back, updated).
- **G4. Gym mode on top** (stable, walk-ins, weekly plan) the same way.
- **G5. The 3D research in the 2D drawing**: moved up to ROADMAP F1 (Ed, Oct 24: the fights before the career), built Oct 24 (`docs/NOTES.md` "F1, how they move in 2D").

## Ed's answers (Oct 24)
`game.html` + the lab, career first, a private link first (the live game only on his OK).
