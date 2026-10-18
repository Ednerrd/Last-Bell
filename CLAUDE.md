# Last Bell

Phone-first auto-boxing fight sim, stripped to the engine: `index.html` (~4,700 lines) boots straight into a fight (random or picked fighters). Career, saves, hub, camp and gym mode were cut (Oct 2026); the old full game lives in git history on `claude/epic-goldberg-ps6ip4` before that cut. Owner: Ed. Pure watch/idle sim, side view, real boxing rules, 1v1. The player is the coach.

**The boxer brain: `brain/`** (standalone AI module + dummy ring + sims, `brain/README.md`). Wired into `index.html` as the only AI: the old engine AI (`decide()`/`react()`) was retired Oct 16. `brain/brain.js` is inlined by `node brain/inline.js`: edit the source, rerun it, never edit the copy.

**What to do next: `ROADMAP.md`** (the only to-do list). Design docs, read on demand: `docs/BRAIN.md` (AI fight IQ, skill levels plan, brain measurements), `docs/GYM.md` (gym + stable mode), `docs/NOTES.md` (system details, balance history: grep the heading you need), `proto/PLAN.md` (3D), `research/` (boxing research; `research/MIND.md` is the index).

## Who and how
- Ed reads on his phone. Talk to him like a homie: light, real, roasts welcome. Short answers.
- Ed runs parallel sessions: `git fetch` and check `git branch -r` for newer work before starting. The main line is `claude/epic-goldberg-ps6ip4` (the default branch, last touched Oct 8); current work is on `claude/brain-wire` (82 commits, re-rooted Oct 16: it shares no history with main; the full history up to Oct 16, main included, is `claude/retire-old-ai`; `claude/plugin-body` merged in Oct 18). A v2 3D restart sits on `claude/brave-einstein-ojkyzm`: parked (Ed, Oct 14), v1 is the game.
- Never publish to the live game without Ed's explicit OK.
- Models (Ed, Oct 14): Opus for tuning, code and design; Sonnet for research subagents, with a tight brief (topic, what to pull out, which file to write). Sonnet subagents are fine for grunt work too (docs bookkeeping, sim runs and tables).
- Effort (Ed, Oct 15, replaces Oct 14): **medium is the default.** Before a task that needs high, say so in one line and ask Ed to switch, then wait for his OK. High = debugging odd sim results, retiring or refactoring engine code that must keep the same.js hash, design plans (L4 learning, the drama build). Sim-driven knob tries, docs, roadmap edits, overviews, running sims and reading numbers stay at medium.
- Sessions (Ed, Oct 15): one roadmap step per session. Long sessions drag their whole context into every message; the docs are the handoff. End a step with CLAUDE.md, ROADMAP.md and a `docs/BRAIN.md` handoff note current, then start fresh.
- The container restarts often and kills background jobs: run sim batches through `tests/check.sh` (resumable) or write each job's result to disk as it finishes.

## Links
- **Live game** (Claude Code can NOT publish): https://claude.ai/artifact/KYmQg6PQo4qE4qoyDDDt7k. Ed uploads `index.html` in a claude.ai chat with `{db:{},user:{},sample:{}}` (sample powers corner talk; without it a keyword matcher runs). Save sync uses data/users/<id>/slot0..2.
- **Fight lab**: https://claude.ai/artifact/QhC1gMrw1pSabzuLzMw7Ev. `index.html` IS the lab now: publish it as-is, no capabilities.
- **Private preview** (full game, sample + db + user): https://claude.ai/artifact/KcaS5AaPWu316tV7nENsVo.
- **Brain lab** (private): https://claude.ai/artifact/5UhTsjMSCTqhtRnCfdZBSV. `node brain/build-lab.js`, publish `brain/lab.html` (build output, gitignored) to that URL.
- **3D phone test**: https://claude.ai/artifact/5kVb4PyywgDcPBHSVSc3cu. `node proto/build.js`, publish a copy of `proto/ring3d.html` with the doctype/html/head/body tags stripped.
- `proto/ring3d.html` is a build output: rebuild, don't edit.
- Published-page rules: scripts only from cdnjs/jsdelivr/tailwind/jquery, fonts from Google Fonts, no other network calls, one file.

## Working rules
- Small, chunked edits. Commit after each working step, push.
- Engine changes need sims before and after. 50 fights is noise (±8%). 300+ per guard/style for balance, 400–500 for the audit; pool 1500+ before trusting a 1–2% difference.
- Render-only changes must keep the `same.js` hash (now **791b3971**, Oct 18: eyes E4, he fights on what he saw; before it 4cdff551, the plug-in brain).
- Never change balance numbers and visuals in the same commit.
- Ed's voice in any writing is his own. Commentary lines are fine to write.
- Save tokens: never read all of `index.html`; grep, then read the section. Run long sims through a subagent or print summaries only. Long-form detail goes in `docs/NOTES.md`; keep this file short.

## Code map (markers `/* ===== LAST BELL : ... ===== */`)
engine (~200, the brain inlined at ~203) → career (~2590: just fighter gen, divisions, gear, P4P stars) → render → audio → ui part 1 (helpers) → ui part 3 (fight loop, corner, replay) → the fight screen (`LAB`, `labNew`, `labFight`, `resultScreen`).
- Ring: x ±146 (RING), z ±115 (ZR), MIN_D 30. `P3()` projection.
- Fight loop: `brainTick()` every frame (`perceive()` → `F.brain.think()` → feet, hands, defense), `footwork()`, `spoil()` when a punch starts, `resolve()` at 60% of the punch, `miss()`. `nextRound()` at phase 'corner'. Bare `R()` calls are rolls the old AI made, kept so the seeded fights don't shift: drop them only on purpose (new hash).
- Knobs: one marked block `TUNING` (TUNE combat, DMG damage, CUT cuts/doctor, STAM gas, BODY, EXT reach, AI the brain on this engine, SKL skill sheet, SHOUT_EDGE, AIC the AI corner, TEACH, STYLE_* tricks). Content tables stay with their code: `PUNCH`, `STYLES`, `GUARDS`, `STRATS` (labels), `SHOUTS`. The brain's own knobs: `BoxerBrain.BR` in `brain/brain.js`.
- Skill sheet (L1): `sheet.sk` (mastery, the brain reads it if set), `sheet.know`, `levelOf`, `skillSheet`, `skFromRecord`, knobs `SKL`. What a level does (L2): `BoxerBrain.BR.lv` (tables N/I/P/W, neutral at Pro, `on` switches), engine side `F.brain.mast`, `offT`, `flinchT`, `AI.offDmg`. Familiarity (L3): `BR.fam` (on), `famSet`/`famUpd`, engine `famOf` (sheet.know about the other man; none = neutral).
- Brain wiring: `brainInit`, `perceive` (the contract is typed in `brain/brain.js`: Perception, Action; `tsc -p .` checks it), `brainTick`, `bev` (events to both brains), `brainProfile`/`brainSkills` (stats or `sheet.sk` → skills). Opponent memory lives in the brain. Corner lessons: `teach()`/`teachK` (F.read.les: only the 'learned' commentary reads them now). Ring IQ: `ringIQ(sheet)`, `iqK`.
- Guards: standard, high, peekaboo, philly, cross, handslow. Fixed per career.
- Render: `drawFighter`, `body()`, `arms()` → `elbow()`, `lunge()`, `bodyPush()`, `settle()`, `carry()`, `blendSnap`, `spreadView()`.
- Learning (L4, `docs/LEARN.md`): `fightReport(f, side)` (use and success per skill from the brain's `rep` counts + round stats), `learnInit` / `learn` / `applyLearn` (knobs `LRN`: skills, know, talent caps, idle, legs, `sheet.opp` the men he fought). Called between fights only, never in one. Rematch memory (L4c): brain `memo()` / `priorSet` / `priorCheck` / `adjOpts`, knobs `BR.prior`; engine `priorOf(F)`. Camp (L4d): `camp(sheet, pick, opp)` (drill, spar, tape via `tapeOf`, none), `simFight`, knobs `LRN.camp`. Scars (L4e): `sheet.scar` from `learn`, brain `scarSet` + `this.sp` in `pv`, knobs `LRN.scar`, `BR.scar`. Learned card (L4f): `learnedLines()`, `LEARN_LINE` on the result screen.
- Corner talk: `roundNotes()`, `planVerdict()` (did the plan work, the round on the cards, calls on time: Drama step d), `talkPrompt`, `ACT.talk`, `talkWords()` fallback, `FX.cornerCall` in `updShouts`.
- Officials (Drama step b): `JUDGES` (taste weights `w`, `noise`) scored through `judgeScore(F, w)` in `scoreRound`; `REFS` (`stop` +1 early / 0 / -1 late: the unanswered-punch stop and the check after the count; `hold` clinch length; `holdN` clinches a round before a holding warning; `dirty`); `F.judges`, `F.ref`, pinned by `opts.judges` / `opts.ref`; `foul(F, O, why)`.
- AI corner: `aiStrategy(side)` between rounds (cards, gas, work rate, hurt; Pick it up / Slow down), `aiShout(F)` live (best `shoutFit` over `AIC.bar`; `f.aiCorner` per side, on for both; the player's yell quiets side 0 for `AIC.hold`). How right a call is: `shoutRead`; what it is worth in the engine: `orderPow`, `atkEdge`, `defEdge` (Move/Hands defend on every punch, the rest only on matching punches, Up/Down no engine edge).

## Tests (`tests/`, run from repo root)
Node extracts the engine+career sections and runs fights headless (`sim.js` is the shared loader). `PATCH="js code"` injects overrides. `LB=file.html` runs against another copy.
- **`tests/check.sh TAG [s a l f sp g]`: the full check on 4 cores, resumable after a restart (rerun the same line); `tests/check.sh TAG report` prints it all.** Default parts s a l f (~25 min); sp (specials) adds ~20 min.
- `node tests/same.js 200`: determinism hash (~95 s; `same.js 40` = 3bafb140 for a quick look). `tsc -p .`: type check of `brain/brain.js` (tsconfig `checkJs`, no build step).
- `node tests/audit.js 500`: CompuBox-style audit (output, connect %, KDs, stoppages, decisions, upsets).
- `node tests/bal2.js 300 82 peekaboo,philly TAG` then `node tests/agg.js TAG`: guard win % vs standard.
- `TAG=x node tests/styles.js 300 82` then `node tests/styles.js agg x`: style round robin (`BIAS=1`, `GRD=roll`, `vs:volume,angle` for specials).
- `TAG=x node tests/shout.js 600 82 none,oracle,random,smart` then `node tests/shout.js agg x`: coach shout policies (side 0 only, side 1's AI corner on: use corner.js for corner values).
- `TAG=x node tests/corner.js 600 82 ai/ai,auto/ai [auto/none]` then `node tests/corner.js agg x`: corner policies (plan/live) vs another, mirrors, sides swap every fight.
- `node tests/brain.js [tempo|iq|adapt|pace|styles] N`: brain report. Baselines in `docs/BRAIN.md`.
- `QUIET=3 node tests/teach.js 300 82 body 20`: corner-as-teacher log (control `PATCH="TEACH.max=0"`).
- Brain: `node tests/bprobe.js 150` how punches end, defense, counters, distance. `node tests/ropes.js 40 [style]` time on the ropes and how he gets off. `SEED=7 node tests/scout.js 20 [style|random] [rating] [guard|roll]` scouting report: one new fighter, 20 fights vs a random field, record, strengths, weaknesses (no learning between fights yet). `TAG=x node tests/levels.js 75 [curve|split]` (x4) then `node tests/levels.js agg x`: skill levels, win % across a level gap and skill use by level; `sk` mode = same body, levels from `sheet.sk` (L1). `know` mode = two Pros, A unfamiliar with B's style/stance (L3). `node tests/sheet.js` prints the skill-sheet defaults (walk-in types, records).
- Drama: `TAG=x node tests/drama.js 500` (x4) then `node tests/drama.js agg x [0]` (0 = close fights only): lead changes, comebacks, how wide decisions are, rounds with a moment, dead rounds (`docs/DRAMA.md` section 6).
- Learning: `node tests/report.js 200` the fight report by level; `TAG=x node tests/grow.js 10 80` (x4) then `node tests/grow.js agg x`: careers, fights to each level by talent, the snowball check. `TAG=x node tests/rematch.js 300` (x4) then `agg x`: rematch memory (`ARMS=none,mem,full,wmem,lmem`). `TAG=x node tests/camp.js 75` then `agg x`: camp picks. `TAG=x node tests/scar.js 75` then `agg x`: scars.
- Plug-in brain: `TAG=x node tests/cheese.js 40 [hard|expert]` (x4) then `node tests/cheese.js agg x`: one-trick players (jabSpam, oneTwo, pullCounter, shell, bodyOnly, haymaker, runner, clinch) vs the brain, win % and the cheese's landed share early vs late (`docs/PLUGIN.md`).
- Eyes: `TAG=x node tests/eyes.js 40` (x4) then `node tests/eyes.js agg x`: what each level notices of the other man (cut, body, arms, fold, legs, wobble), seen % and delay (`docs/PLUGIN.md`).
- Hurt man's danger: `TAG=x node tests/danger.js 300 [on|off] [N,I,P,W]` then `node tests/danger.js agg x`: a Pro hunting a hurt man of each level, stung and caught per hunt.
- Finishing: `TAG=x node tests/finish.js 150` (x4 processes) then `node tests/finish.js agg x`: stoppages, KDs both ways, same-round stop after a KD, late comebacks, hunts and hurt answers.
- `node tests/swap.js 100` side swaps, `rhythm.js 200` tempo, `gas.js 250` gas by round, `bodykd.js 300` KDs head/body.
- Also `cut.js`, `diag.js`, `probe.js`, `commtest.js`. Playwright: `tests/strip.py`, `shot.py`, `live.py` into `shots/` (gitignored); render tools in `tools/measure/` (see its README).

## Targets (check after engine changes)
Audit: ~53 thrown / ~15 landed / ~29% connect per round, stoppages ~25–30%, body KDs 5–8%.
- "Thrown" = punches that really start. With the brain on, a punch his own defense pulls back before 30% is un-counted (gas still spent); audit prints it as "unthrown /rd".
- Brain (default, with both AI corners, Oct 16): ~51.2 thrown / ~15.1 landed / ~29.5% connect, stops ~24.7–28% (audit 500 x3; finish.js 600: 25.8%; ~26% under every ref; E4 Oct 18: 28.2 / 28.3%), styles 48.1–51.5 (E4: 49.6–52.5, outboxer 45.8), specials 48.0–54.3 pooled (angle at the ceiling), guards 47.7–55.8 (before the officials). Skill levels: one level down wins 15.8–18.0% (`levels.js sk`, 600/pair). Drama (`drama.js`, close fights): a lead change in ~41%, comebacks ~11.5% (target ~11, Ed). AI corner vs a silent one +3.6 (53.6 over 1800). History: `docs/BRAIN.md` "AI corner reads the fight", "Balance pass L6". Thrown target for the brain ~52 (Ed, Oct 14). Styles 48–53% vs the field. Guards @82 vs standard ~48–58. Specials vs base styles 48–54%.

## Env
- Playwright: if it asks for `playwright install`, launch with `executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`.
