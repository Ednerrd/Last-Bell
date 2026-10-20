# The numbers: our targets vs real data (Oct 19, full pages)

Page fetches worked this time (curl; WebFetch could not resolve hosts). boxingscene and web.archive.org stayed blocked, so some CompuBox lines are still search quotes.

Tags: **[S]** full source read. **[T]** my own tally from a real public dataset (below). **[Q]** quote or snippet only. **[B]** not confirmed, no data found.

Two datasets I could finally open:
- **Sloan 2026 data** (duBoef et al.): github.com/mduboef/Jabbr-AI-Boxing-Judging, `pairedData.csv`. 1,228 pro bouts with round-by-round cards from 3 judges, result method and winner (names and dates scrambled). Mostly TV-level fights found on video, 12-rounders heavy. I tallied it myself.
- **CompuBox round PDFs**: api2.compuboxdata.com/round-stats/ID. Only the latest 18 fights (Oct 2026 cards) are online: 268 fighter-rounds of thrown/landed, jab/power, body landed.

## Top table

| # | Our target | Real data | Verdict |
|---|---|---|---|
| 1a | 53 thrown / 15 landed / 29% per round | 52 / 13.6 / 26% (2026 cards, n=268 rds). 56 / 18 / 32% (CompuBox avg, 2009). HW titles 38 / 13 / 35% | **Keep** (band 52-56 / 14-18 / 26-32) |
| 1b | Jab connect ~27% (sim today) | ~17% (2026). HW titles 28%. Best jabbers 25-32% | **Move down** to ~18-20% (28% HW) |
| 1c | Power connect ~31% | 31% (2026). HW titles 42% | Keep |
| 1d | Body ~24% of landed | 24.4% (2026) | Keep |
| 1e | Round 1 = 0.88x output | 0.72-0.78x (n=34, thin) | Maybe 0.8 |
| 2 | 25-30% stoppages | 45-53% for all pro cards, HW titles 66%. Floor for 10-12 rounders ~28% | **Move up** to ~35-40% (band 30-45) |
| 3a | KDs: sim 0.9 per fight | 0.4 rounds per fight scored 10-8 (decisions); 0.6 incl. stoppages | Probably high, check |
| 3b | Body KDs 5-8% | no data | [B] keep as design |
| 3c | KD scorer loses | scorer wins decision 80%, loses 19% (n=188) | Check sim vs this |
| 4 | Cut stops 1.2-1.7%, eye 0.3% | no stoppage-by-cause data. Technical decisions 0.6% | [B] keep |
| 5a | Split+majority ~10-17% of decisions | 28% (n=660). UD 72 / SD 16 / MD 12 | **Move up** to ~25-28% |
| 5b | Draws ~8% of decisions | 5.2% | Move to ~5% |
| 5c | Comeback ~11% (close fights) | 11.0% decisions only; 11-16% with late stops | **Keep 11%**, and make it hold for all fights |
| 5d | Lead change ~41% close | 37% of all decisions (12 rd 41%, 10 rd 29%) | Keep |
| 5e | Lead change in last 3 rds ~6.5% | 11.5% | **Move up** to ~10% |
| 6 | Upset one level down 15-20% | A-side wins 82% (proxy). Odds data: none for boxing | Keep, no data |
| 7 | Reaction floor ~.25 s, jab .3-.4 s | Simple visual RT 231 ms mean (n=1,469). Jab ~.3-.4 s | Jab keep. Floor: see item 7 |

---

## 1. CompuBox output

**Our target:** ~53 thrown, ~15 landed, ~29% connect, per fighter per round.

**What the sources say**
- **CompuBox's own editors, 2009** [S]: "The overall CompuBox average is 18 punches landed per round and 56 thrown." Holyfield threw 32 a round, "14 less than the heavyweight average" (so HW avg about 46). Mosley landed 11, "CompuBox avg is 18". https://www.badlefthook.com/2009/12/8/1192157/compubox-worst-title-fight
- **CompuBox "Mexican greats" page** [S]: Olivares threw 83.8 a round, "nearly 30 more than the CompuBox avg" (so avg about 54-55). https://beta.compuboxdata.com/reports/49
- **CompuBox "all-time middleweights" page** [S]: Hagler's 28.4 landed is "13 more than middle avg" (so ~15.4). His 43.2% is "14% higher" (so ~29%). His power connect 47% is "18% higher" (so ~29%). https://beta.compuboxdata.com/reports/93
- **World heavyweight title fights, PLOS ONE 2022** [S]: 135 title bouts with CompuBox counts, 1991-2022. Per fighter per round: 37.6 thrown, 13.3 landed, 34.6% connect. Winners 44 thrown / 17.3 landed (38%), losers 31 / 9.3 (30%). Jabs 53.8% of thrown, jab connect 27.9%. Power (any non-jab) 46.2% of thrown, connect 42.4%. https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0263038
- **Significance magazine** [S]: 263 men's title-level fights tracked since 2015. Average jabs landed about 40 per fighter per fight (about 4 a round). https://significancemagazine.com/boxing-with-george-box/
- **Class averages from CompuBox articles** [Q] (search snippets, boxingscene blocked, years 2013-2016): jr middle 17 landed, middle 18, lightweight 19 (power landed 14, power connect 36%), light heavy power landed 12, HW 15 landed / 45 thrown. No full table by weight class exists online. Lighter men throw more, heavies less (Zepeda 128 a round at lightweight, HW titles 38).
- **CompuBox Oct 2026 cards, my tally [T]** (18 fights, 8 ended early, 268 fighter-rounds, api2.compuboxdata.com/round-stats/16878 to 16915):
  - All rounds: 52.2 thrown, 13.6 landed, 26.0% connect.
  - Jab: 38% of thrown, 17.2% connect, 25% of landed. Power: 62% of thrown, 31.3% connect.
  - Body: 24.4% of all landed punches (887 body of ~3,640 landed, the 17 fights with a full body report).
  - Round by round (thrown / connect): R1 42 / 27.8%, R2-3 51 / 25.7%, R4-8 54 / 25.8%, R9-12 55 / 25.7%.
  - Only the 9 fights that went 10+ rounds: R1 41, R4-6 57.5, R7-9 57.6, R10-12 53.8. So R1 is ~0.72x of the peak, and the last 3 rounds ease ~6%.
- **Sim now** (audit 80 fights, noisy): 50.7 thrown, 15.1 landed, 29.8%. Jab 18.5 a round (36% of thrown) at 27.3%, head power 22.0 at 29.0%, body 10.2 at 36.0% (so power+body 31%, body ~24% of landed).

**Read:** totals are right. The one clear miss is jab connect: real jabs land ~17% on a normal card (28% in heavyweight titles, 25-32% only for the best jabbers on CompuBox's leader lists). Sim jabs land like an elite jab. Round 1 at 0.88x is on the soft side of real (0.72-0.78x) but the sample is 34 fighter-rounds.

**Verdict:** keep 53 / 15 / 29. Move jab connect to ~18-20%. Round 1 factor ~0.8 if cheap. Per-class tables: no data.

## 2. Stoppages

**Our target:** 25-30% of fights end inside the distance. (docs/NOTES.md already says "estimates, not sourced".)

**What the sources say**
- **All US pro bouts, 6 months of 2017** [Q] (Velasco et al., Neurology abstract, n=1,690; draws and no-contests excluded): decisions 46.5%, TKO 35.1% (594), KO 18.1% (306), DQ 0.2%. So **53.5% ended early.** Same 46.5% is repeated in the Sloan paper [S]. https://www.neurology.org/doi/10.1212/01.wnl.0000580936.14660.4e (page blocked; numbers via search result of the abstract)
- **BoxRec, all pro bouts 2014-2024** [S] (UCLA, AAN 2025 abstract, n=237,238): men (222,683 bouts) 15% KO + 32% TKO = **47%**. Women (2 min rounds) 29%. https://index.mirasmart.com/AAN2025/PDFfiles/AAN2025-005548.html
- **Sloan data, 1,228 TV-level bouts** [T]: KO 11.9%, TKO 28.1%, RTD 5.4%, DQ 0.2% = **45.5%** early. Decisions 54% (UD 476, SD 108, MD 76).
- **World heavyweight titles, 179 bouts, 1991-2022** [S]: KO/TKO 101 (56%), retirement 14, DQ 3, decision 57, draw 3. About **66% early.** https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0263038
- **By weight class** [Q]: a 2024 BoxRec study (Twohey et al., Physician and Sportsmedicine, 6 months of data) says heavyweights have the highest KO/TKO rate; no numbers in the abstract (PubMed 37990916). Nothing for other divisions.
- **My own tally of the Sloan data, stop round** [T]: stoppages are spread flat over rounds 1-9 (~5% of stops each), then thin out. 44% are in rounds 1-4, 38% in 5-8, 18% in 9-12 (mix of 4 to 12 round fights, so not a clean share of the distance).
- Lower bound for 10-12 round fights: only counting stops after round 6 against 10/12-round decisions gives 192 of 686 = **28%**. Early stops in title fights push it higher.

**Read:** no source puts pro boxing near 25-30%. Every full pool is 45-53%. Title and 10-12 round fights are probably lower than a mixed card, but not by half. Ed's 25-30 looks like the floor, not the middle. No title-fight number for lighter classes was found.

**Verdict:** **move up** to about 35-40% for 10-12 round sims (band 30-45), and say it is a judgment on top of 45-53% for all pro cards. Stop timing: the sim's late-heavy shape (docs/NOTES.md: ~20% early / 24% mid / 56% late) does not match real, which is flat to early.

## 3. Knockdowns

**Our target:** KDs per fight (sim 0.9, brain, finish.js); body share 5-8%; same-round stop after a KD; KD scorer loses.

**What the sources say**
- **KDs per fight:** no CompuBox, BoxRec or paper count found. One site claims 0.8 for 2023 (worldmetrics, no method) [B].
- **10-8 rounds as a stand-in** [T] (Sloan cards; a 10-8 round on 2+ judges' cards is nearly always a KD, rarely a deduction):
  - Decisions (660 bouts): 0.41 such rounds per fight, 4.1 per 100 rounds. 31% of fights have at least one, 8% have two or more.
  - Stoppages: 0.58 per fight. All bouts: 0.49.
  - Judge-rounds scored by margin 2+: 6.2% of all judge-rounds; margin 3+ (10-7): 0.7%.
  - Sloan paper [S]: 93.1% of rounds are plain 10-9 / 9-10; the other 6.8% (10-10, 10-8 and the like) were dropped. Those are "rare" without a KD or deduction.
  - This misses 10-9 KD rounds and counts a 2-KD round once, so real KDs per fight are somewhat higher than 0.4. Still, 0.9 is likely above real.
- **Does the KD scorer win?** [T] In 188 decisions where only one man had a 10-8+ round: he won 79.8%, drew 1.6%, **lost 18.6%**. Stopped fights where the eventual loser had earlier scored a 10-8 round: 5.4% (30 of 557).
- **Same-round stop after a KD:** [B]. In pro cards the stopped round is often not scored, so the cards cannot show it (only 20% of stops show a 10-8 last round).
- **Body share of KDs:** [B]. A Spanish study of the last four punches of HW champions (1921-2007) exists but the summary has no head/body split. Body share of landed punches is 24% (item 1), nothing on KDs.
- **MMA only** (from comebacks.md, not boxing): first-KD scorer wins 86% overall.

**Verdict:** the 5-8% body KD target has no source; keep it as a design choice. Check the sim by counting rounds with a 10-8 card instead of raw KDs: real is ~4 per 100 rounds in decisions. The KD scorer should lose about 1 in 5 decisions.

## 4. Cuts and the doctor

**Our target:** cut stops ~1.2-1.7%, eye stops ~0.3%.

**What the sources say**
- No study found that gives the share of pro fights stopped on cuts, or eye-closed stops, or headbutt vs punch cuts. Searched PubMed, Victoria data, commission pages.
- Victoria, Australia, 1997-2005 [S abstract] (PubMed 19124979): 214 injuries in 907 fights = 23.6 per 100 fights, mostly head and face lacerations. Injury, not stoppage.
- Accidental-cut stoppages that go to the cards (technical decision) [T]: 7 of 1,228 Sloan bouts (TD 5, TD-U 2) = **0.6%**. That is headbutt cuts late enough to score. BoxRec does not split cut TKOs from other TKOs.
- A boxing column calls cut stoppages "quite rare" (no numbers) [Q]. Wikipedia: a headbutt cut becomes a technical decision once the fight has gone far enough.

**Verdict:** no data, keep 1.2-1.7% and 0.3%. If the sim has headbutt cuts, ~0.6% of fights ending as technical decisions is the only real number.

## 5. Decisions, comebacks, judges

**Our targets:** split+majority ~10% of decisions (sim audit run today: 9 of 53 = 17%), draws ~8% (docs/NOTES.md), comeback ~11% close, lead change ~41% close.

**Sloan 2026 paper, read in full** [S] https://www.sloansportsconference.com/research-papers/interpretable-prediction-and-large-scale-analysis-of-judging-in-professional-boxing
- Sample: 1,003 bouts, 7,864 rounds, 17,575 judge scores (BoxRec cards + video stats from Jabbr's DeepStrike).
- **73.1% of rounds are won unanimously by all 3 judges, 26.9% are split.** (I get 72.6% from the CSV [T].) 93.1% of rounds are 10-9 / 9-10.
- Average pairwise agreement between two judges: 81.4% (7,250 rounds). Judges with 20+ rounds: mean 82.8%, best 98%, worst 55%.
- A model that only counts landed vs missed punches agrees with the judges' majority **73.1%** of rounds (full impact model 74.6-77.6%). So "the CompuBox leader wins the round" is about 3 in 4, not 9 in 10.
- Judges pay for impact: a max-impact punch counts over 10x a minimum one; power-commit ("aggression power") is the 2nd most important factor; "pressure movement" (walking him down) counts almost nothing.
- Winner lost 0-3+ rounds, 10-8 rate, lead changes: not in the paper. I took them from the data.

**arXiv 2402.06594 ("They were robbed", Baumann and Singleton, read)** [S]: theory and simulation of partisan judges, no empirical rates, nothing to pull. Its only numbers are model runs.

**My tally of the Sloan CSV** [T] (n=660 UD/SD/MD):
- Decision types: UD 72.1%, SD 16.4%, MD 11.5%. **Split + majority = 27.9%.**
- Draws (all coded SD/MD): 35 of 667 decisions = **5.2%** (2.9% of all bouts).
- Mean card margin: UD 6.7 pts, SD 1.2, MD 2.1.
- Decisions at 10/12 rounds, n=494. Lead = running sum of the 3-judge average, same rule as `tests/drama.js`:
  - A lead change at least once: **37.2%** (12 rd 41.2%, 10 rd 28.6%).
  - A lead change in the last 3 rounds: **11.5%** (12 rd 12.9%, 10 rd 8.4%).
  - Man behind at the halfway point wins: **11.0%**, draws 5.1%, loses 84% (tied at half: 4%).
  - Add the stoppages that ran past the half: **11.1%** (assuming 12 rounds; 16.0% if halfway is round 5). Late stoppage of the leader: behind-at-6 won 15.7% of 153 stops past round 7.
  - Winner lost 0 / 1 / 2 / 3+ rounds: 10 rd 35.6 / 12.3 / 13.0 / 39.0%. 12 rd 12.1 / 12.4 / 9.9 / 65.5%.
- Caveat: sample is TV-level fights with scorecards on BoxRec and video, mixed gaps between the men, so it is not the sim's "even fight" case.

**Compare to the sim (docs/DRAMA.md, Oct 16):** lead change 31% all / 35-41% close (real 37%). Last 3 rounds 6.3-6.6% (real **11.5%**, sim is thin). Behind at half wins 7.9% all / 11.0% close (real 11.1% for all). 10 rd winner lost 0 rounds: sim 19.5% all vs real 35.6% (the real sample has more mismatches and sweeps). Lost 3+: sim 39.3% vs real 39.0% for 10 rounds.

**Verdict:** keep comeback ~11% and make it the all-fights number (sim's 7.9% is low). Keep lead change ~37-41%. Raise late lead changes to ~10%. Split+majority to ~25-28% of decisions, draws to ~5%. Real judges also disagree on 27% of rounds: worth checking the sim's judge noise against that.

The 2018 Gift "judges agree on a 10-8 round 93%" quote in comebacks.md is still second-hand [Q]. Chester amateur thesis, MMA UFC rates: unchanged, wrong sport.

## 6. Upsets

**Our target:** one skill level down wins 15-20%.

**What the sources say**
- **Boxing odds data:** none found. No study with boxing closing lines. A 50-fight boxing sample appears in an old multi-sport odds paper (too small) [Q]. A betting-guide line says upsets beat the odds in heavyweight (no data) [Q].
- **Proxy** [T]: in the Sloan CSV the red corner (the A-side: favourite, house man, higher ranked) wins **81.9%** of fights (976 of 1,191, draws out): decisions 80.6%, stoppages 83.5%. B-side upsets ~18%. This is a corner label, not a betting line.
- **Other sports, Covers.com, July 2026** [S]: underdogs win NFL 33.3%, NBA 32.0%, MLB 42.7%, college football 27.3%, college hoops 26.9% (since 2021). https://www.covers.com/guides/which-sport-do-betting-underdogs-win-most-often
- **UFC** [Q]: favourites win ~66-68% (Pinnacle closing odds, 558 and 709 bouts), so underdogs ~32-34%. Heavy favourites (80%+) win ~85%.

**Verdict:** keep 15-20%. The A-side proxy (18% B-side wins) agrees. Boxing favourites look safer than in MMA and the big US leagues. No better number exists.

## 7. Reaction and punch speed

**Our target (per the brief):** reaction floor ~.25 s, jab .3-.4 s.
**What the code has:** `BR.react` .34 s (novice) to .14 s (world class), floor `reactMin` .10 s (brain.js). `PUNCH.jab.dur` .30, cross .40; contact at 60% of the punch (jab ~.18 s).

**What the sources say**
- **Simple visual reaction time** [S]: Woods et al. 2015, 1,469 people aged 18-65: mean **231 ms**; Galton-era best young adults under 190 ms. https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2015.00131/pdf
- **Boxers react no faster than others to plain stimuli; experts win on anticipation** (research/mind_vision.md, Ripoll and others, already in the repo). Peer-reviewed boxer data [Q]: rear straight reaction to a light ~310 ms rested, 390 ms after round 3 sparring (Jyväskylä thesis, LIDA). A jab-vs-cross study (Loturco 2015, 22 elite boxers) found jabs react faster than crosses, ~250 ms for jabs (snippet).
- **Jab duration** [Q]: amateur 3D study (Int J Perform Anal Sport 2018) lists jab delivery time 405 ms in the abstract, 657 in the table (garbled; definition unclear). Boxing Science and blogs say 50-100 ms "to land", which is nothing like start-to-finish. research/MIND.md says "a jab lands in ~0.4 s". Page for the 3D study was blocked.

**Read:** a jab taking .3-.4 s start to finish is fine. A pure reaction to something that appears cannot beat ~.19 s, and the average is .23. The sim's .14 world-class reaction and .10 floor are below any human simple RT. They only make sense as "he read the tell before the punch left" (anticipation), which is what the brain does.

**Verdict:** jab dur keep. The ".25 floor" in the brief is the real-world number, but the code floor is .10, set on Oct 18 on purpose ("no psychic blocks"). If a punch has no tell the floor should be near .2 s. Ed's call, not a measured fix.

---

## For Last Bell

Change (with the number I would use):
1. **Stoppage target 25-30% -> ~35-40%** (band 30-45). Every full pool is 45-53%. Needs Ed's OK, big retune.
2. **Jab connect ~27% -> ~18-20%**, keep total connect ~29% (so power or body takes up the slack; real jabs are ~25% of landed, sim ~33%).
3. **Split+majority 10% -> ~27% of decisions; draws 8% -> ~5%.** Check judge noise: real judges split on 27% of rounds.
4. **Late lead changes ~6.5% -> ~10%** (last 3 rounds). Comeback target stays 11%, and the all-fights number should hit it (sim 7.9%).
5. **KDs:** compare rounds scored 10-8 (real ~4 per 100 rounds in decisions, ~0.4-0.6 a fight) with the sim's 0.9 KDs a fight; probably trim. KD scorer should lose ~1 in 5 decisions.
6. **Round 1 output** 0.88x -> ~0.8x (low confidence).
7. **Stoppage timing:** real is flat to early; sim is late-heavy. Flag for step 1.

Keep: 53 / 15 / 29 per round, power connect ~31%, body ~24% of landed, 11% comeback, lead change 37-41%, upsets 15-20%, jab dur .30 s.

No data (leave as design): body-KD share 5-8%, cut stops 1.2-1.7%, eye stops 0.3%, same-round stop after a KD, stoppage by weight class (only "heavies highest").

Still open: reaction floor (.10 in code vs .19-.25 human), if you want the brain to be fair on tell-less punches.

**Sources not opened** (blocked): neurology.org, bjsm.bmj.com, pmc.ncbi.nlm.nih.gov, boxingscene.com, boxrec.com, tandfonline. Third-hand lines marked [Q].
