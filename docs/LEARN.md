# L4: the learning brain (design, Oct 17)

Ed (Oct 15): the learning brain every fighter has is the heart of the game. Skills grow from fights and camp, style and stance know grows, he remembers men he fought, and a bad night can leave a scar. Learn more from losses than wins (no snowball). Per-opponent memory fades fast, style know slowly, skills only when unused. The fighter grows on his own; the player picks what camp drills.

Research: `research/mind_learn.md` sections 2 and 4b–4d (numbers marked est. are starting points, not facts). Built so far: L1 sheet (`sheet.sk`, `sheet.know`), L2 what a level does, L3 familiarity in the fight. Nothing writes to a sheet after a fight yet.

## 0. Where it lives (no career right now)

Learning is **between fights**, so it never touches a fight in progress: the default field (fresh sheets, no history) plays exactly as today and the `same.js` hash holds through every step except where noted.

- **The record:** the sheet itself carries everything: `sk` (skills), `know` (styles, stances), `cap` (talent ceiling per skill, rolled once), `opp` (men he remembers), `scar` (what a bad night left), `log` (last few fights, for decay and the UI).
- **One pure function:** `learn(sheet, fight, side, camp)` reads the finished fight and returns what changed (`{ sk: {jab: +1.8, ...}, know: {...}, opp: {...}, scar: ..., lines: [...] }`); `applyLearn(sheet, diff)` writes it. The career, the lab and the sims all call the same two.
- **Camp:** `camp(sheet, pick, nextOpp)` before a fight: one pick (section 5).
- **Headless first:** `tests/grow.js` runs fighters through careers (a season = N fights vs a field) and prints growth pace, the level spread over time and the win % of men who learned vs a frozen twin. The lab UI comes last.

## 1. What he did this fight (L4a, recording only)

`fightReport(F, side)`: per skill, how much he **used** it and how well it **worked**, from the brain's telemetry (`tel`), its memory and the engine's round stats. One table, so growth has something honest to read.

| Skill | Used | Worked |
|---|---|---|
| jab, power, body | thrown | landed % (and damage for power) |
| combos | combos started | combos with 2+ landed |
| feints | feints | bites (`tel.bites`) |
| block, slip | his punches at me, defended by that kind | defended / tried |
| footwork | time pressed or on the ropes | escapes |
| clinch | clinches | clinches when hurt that got him to the bell |
| cutoff, ropes, range, angles | time the ring geometry was in play | `trap` time on him, rope escapes, range held, angle exits |
| counter | counter chances seen | counters landed (`tel.counters`) |
| read | his punches seen | anticipated (`tel.antic / tel.seen`) |
| pacing | rounds | gas left vs the budget (`BR.gas`) |
| adjust | changes made (`tel.chg`) | changes that paid (`tel.chgPay`) |

Plus **what beat him:** his punches that hurt or dropped me (`mem.hurt`), by kind. Some cells need a new counter in the brain or engine (combos started, angle exits): add them with plain counters, no behavior change, hash holds.

## 2. Skills grow (L4b)

Per skill after each fight:

`gain = base × use × (.5 + success) × teacher × headroom × age × result`

- **base** ~3–5 points for a skill he leaned on all night (est., tuned to the pace below).
- **use:** his use vs a normal fight's use for that skill, capped at 1.5. A skill he never touched gains nothing.
- **headroom:** `(1 − m / cap)^1.5`. Slows near his ceiling.
- **cap:** talent, rolled once per skill. Most men top out in Pro; World class needs the talent. Lab fighters get one from rating and record.
- **teacher:** the corner. Calls that paid off this fight (`teach()` lessons, see below) put ×1.5 on the matching skill; a fight with a silent corner ×.8.
- **age:** ×1.2 under 24, ×1 to 30, ×.6 after 32. After ~32 the legs (footwork, slip) start to slide; IQ skills keep growing (Hopkins).
- **result, the anti-snowball rule:** a loss ×1.5 overall, and ×2 on the **defensive answer to what beat him** (dropped by right hands → block and slip; outworked → pacing; trapped all night → ropes, footwork). A win ×.8.
- **disuse:** a skill unused for 5+ fights loses ~1 point a fight above his tier floor. Slow on purpose.

**Pace targets** (mind_learn 2c / 4b): Novice → Intermediate in ~8–15 fights, Intermediate → Pro in ~15–30 more, Pro → World only with the talent, ~30+ more. **No snowball:** across a simulated league the level spread must not widen season over season, and a fighter's win % shouldn't climb by more than his skill does.

**Corner lessons (`teach()`) get a job here:** today they only print the 'learned' line (nothing in the brain reads them since Oct 16). Plan: keep `teach()` as is in the fight, read `F.read.les` after it as the teacher bonus. A good coach grows a better fighter. That's the "a new trainer is usually the trigger" pattern from the research.

## 3. Style and stance know grows (L4b)

- After a fight: `know[his style] += .2 × (1 − know)`, same for his stance. Five fights vs the style puts a man near .67.
- Slow fade: ×.97 per fight without seeing it, floor at half of what he had. Style know is slow to come and slow to go.
- This is what makes L3 show up outside `levels.js know`: a prospect fed only orthodox pressure fighters walks in lost against a slick southpaw.

## 4. He remembers the man (L4c)

- **Kept after a fight (`sheet.opp[id]`):** the other man's top habits from the brain's memory, as shares (lead punch, favorite follow-up, defense answers, the punches that hurt me), plus the result, how he won or lost, and the round.
- **Fades:** ×.85 per fight in between, floor .3. You never fully forget a man who stopped you.
- **In the rematch:** the brain gets those habits as a **prior**: a second memory table that doesn't decay with fight time and that live reads blend into. Trust in it drops fast when the live read disagrees (he changed), so a smart man drops a stale read within about a round. A dumb one keeps waiting for a punch that never comes.
- **Both men remember.** The loser also walks in with one adjustment pre-loaded (Bivol: "start earlier"). The winner's edge stays mostly intact.
- **Target:** the same two men, run back with memory vs without: the first fight's loser gains a few points (aim +3–6), and the first winner still takes ~70–80% of rematches that weren't close. If the loser's lesson flips more than that, the prior is too strong.
- Brain change, neutral without a prior: hash holds.

## 5. Camp: the player's one pick (L4d)

Before a fight, pick one (Ed, Oct 16: scouting in camp):
- **Drill a skill:** a chunk of XP to one skill (the camp-sized version of a fight's gain), headroom and age apply.
- **Spar a lookalike:** `know` for the next man's style and stance +.25.
- **Tape:** a noisy prior on his habits, like rematch memory but weaker (up to half his real habit weights, noise by trainer skill). A prospect or a short-notice man has little or no tape. **Stale tape:** if he changed since (a new trainer, a style switch after a loss), 20–30% chance a seeded habit is wrong. Worth ~1–1.5 rounds of live reading for a Pro reader, less for World class (he reads live anyway), nothing for a Novice. Low-IQ men with strong habits are the best film targets.
- **Nothing:** he walks in blind and reads him in the ring.

## 6. Scars (L4e)

- **Caution after a KO loss:** higher guard, fewer risks, more clinch for 2–4 fights, then half of it fades. Uses the brain's existing levers (confidence `E.conf`, the defensive lean on the plan). The research's most common real fix (Wlad, Pacquiao, AJ).
- **Gun-shy:** low composure + a KO loss: a slower trigger instead of caution (Wilder vs Parker: "couldn't pull the trigger").
- Traits (glass jaw, slow starter...) stay ROADMAP item 2. Some can grow out of scars later.

## 7. In the game (L4f, visual, its own commit)

The lab has no career, so: a **"what he learned"** card after a fight ("He's finally sitting down on that right hand", "He'll see that hook coming next time", "That knockout's still in his head"). The camp pick and rematches show when the career is back. The full career and the skill-sheet screen (L5) come later and call the same functions.

## Build order (each a commit, sims before and after)

| Step | What | Hash | Measured by |
|---|---|---|---|
| L4a | `fightReport`: use and success per skill, what beat him | holds | the table looks sane over 200 fights |
| L4b | `learn` / `applyLearn`: skills, know, teacher bonus (`teach()` wired), disuse, age, talent caps | holds | `tests/grow.js`: pace targets, no widening spread, learner vs frozen twin |
| L4c | opponent memory + the brain's prior, both men | holds (neutral) | `tests/rematch.js`: loser +3–6, first winner 70–80% |
| L4d | camp: drill, spar, tape (stale chance), nothing | holds | `rematch.js` variants: tape worth ~1 round for a Pro, ~0 for a Novice |
| L4e | scars: caution, gun-shy | holds | `grow.js`: KO losers' guard and risk shift, fades in 2–4 fights |
| L4f | lab: the learned card | holds (UI) | browser check |

After L4: the **plug-in brain** milestone (ROADMAP).

## Decided (Ed, Oct 17)
1. **The lab shows the learned card only, no Run it back button.** Rematch memory (L4c) is still built and measured headless (`tests/rematch.js`); it shows in the game when the career comes back.
2. **Realistic pace:** Novice → Intermediate ~8–15 fights, Intermediate → Pro ~15–30 more, World class only with the talent.
3. **Corner lessons:** no preference from Ed, so the recommendation stands: `teach()` stays and feeds growth as the teacher bonus.

## Built
### L4a: the fight report (Oct 17, hash 1a66d14e holds)
- Brain: `this.rep` (per fight, never decays, nothing in the fight reads it): my punches by type [thrown, landed], his punches at me and how they ended (blocked, evaded, short, landed), combos [started, punches, landed], feints that bit, counter punches [thrown, landed], damage and knockdowns by his punch type. The round log keeps the gas at the bell (`log.gas`).
- `fightReport(f, side)`: per skill `[use, rate]` (table in section 1; counter = counter punches landed / thrown, read = 1 - (never saw it + misread) / seen, footwork = his punches that fell short), what beat him (`hurt`, `kd`, `outworked`, `trapped`, `outlanded`), the result, the corner's lessons, the other man's style and stance.
- `node tests/report.js 200`: use / rate by level. Rates climb with level on jab, power, body, block, slip, footwork, range, read, pacing; feints and counters are used more by better men. Weak signals: cutoff, angles, clinch, ropes (ring skills grow mostly from use).

### L4b: growth (Oct 17, hash holds: nothing in a fight calls it)
- `learnInit` (skills off the body if no `sk`, know, talent `cap` per skill from the body: `capBase` 80 + (rating - 78), the style's strengths, noise 5), `learn(sheet, f, side)` returns the change, `applyLearn` writes it. Knobs `LRN` (TUNING block). `base` 2, headroom `1 - (m / cap)^3`.
- `TAG=x node tests/grow.js 10 80` (x4) then `node tests/grow.js agg x`: prospects from raw beginners (rating 70-89, age 20-23) through 80 fights against a field matched to their level (the field doesn't learn; 4 to 10 rounders), a year per 8 fights for the first 40, then per 3.

| Rating | Intermediate | Pro | World class | Skill at the end (cap) |
|---|---|---|---|---|
| 70-75 (n16) | fight 10 | 33 | never | 71 (75) |
| 76-83 (n11) | 8 | 28 | never | 75 (81) |
| 84-89 (n13) | 8 | 23 | 57 (6 of 13) | 82 (88) |

- Snowball: in the same talent band, the early winners (first 10 fights) end only 0.4-1.1 points closer to their cap than the early losers. Know at the end: ~.71 for the base styles, ~.70 southpaw.
- Harness quirk: a learner wins ~55-65% against a field "matched" on average skill. His learned skills sit where he uses them, a generated man's are spread by style, so the average undersells him.
- Tried: base 1.4 linear headroom (Intermediate at ~25 fights, too slow); base 3 linear (Pro late, no World class: the linear ceiling closes too early); cubic headroom with base 1.8 (World class 1 of 6) / 2.2 (6 of 8 by 57, Intermediate at 8-9).

### L4c: opponent memory (Oct 17, hash holds: no prior = neutral)
- Brain: `memT` (the memory tables, whole fight, never fading), `memo()` (rates per second), `priorSet(opts.prior)`: every memory read (`mpeek`) adds the remembered rates x `tau` x `BR.prior.k` .6 x weight x trust. Prior-only keys are seeded as empty live entries so the readers that walk a table see them. `priorCheck` on each lead: a lead the memory gives under half a fair share costs `drop` .08 x read in trust, a common one earns a quarter of that back. The loser walks in with his best between-round change made (`adjOpts`, the round-end menu, now a method). Weight x `won` .6 / `lost` 1.6.
- Engine: `learn` keeps `sheet.opp[id]` (memo, result, KO, how, rounds, times fought; the others fade x.85 a fight, gone under .05, a man who stopped him never under .3) and gives the other man an `id` if he has none. `priorOf(F)` hands it to `brainInit`.
- `TAG=x node tests/rematch.js 300` (x4) then `agg`: two Pros (sk ~74, rating 78) fight, then the rematch from the same sheets several ways; `ARMS=none,mem,full,wmem,lmem`, `SKIP=mine,def` leaves tables out. 1,100+ decided rematches per row, first winner's share (±1.5):

| Rematch | First winner wins | vs none |
|---|---|---|
| none (5 runs) | 51.9-55.0 | |
| both remember (k 1/1) | 52.9 | -0.6 |
| both remember + growth | 52.0 | -1.5 |
| only the winner remembers | 57.7 | **+5.8** |
| only the loser remembers | 53.4 | +1.5 (his notes don't help him) |
| loser, no pre-loaded change / no notes on his own punches | 54.7 / 53.0 | +1.8 / +1.1 |
| both, won .6 / lost 1.6 (**default**) | 51.2 (growth 51.4) | -1.4 |
| both, won .6 / lost 1.6, the change made twice | 54.1 | -0.9 |

- **What it means:** memory is a real edge when one man has it (the winner doubles down on what worked: +6). When both have it, the loser's notes predict exactly that, and it cancels. The design target (loser +3-6) is **not met**: with equal Pros, nothing tried gets the loser past ~+1.5. The real-world gap (first winner 70-80%) is mostly talent, which equal Pros don't have (the base here is ~53%).
- **For L4d:** tape is one-sided by nature, so it's worth real points (up to the ~+6 a full memory gives), scaled down by noise and staleness.
- Open: a loser's lesson that works would need a targeted change from what beat him (the punch that hurt him read earlier, a plan that holds 3+ rounds), not more weight on the same notes.

