# Comebacks: how often does the man behind at halfway win?

Researched Oct 16, 2026 (web search only; page fetches were blocked, so everything below comes from search-result summaries, not full papers).

## Summary (5 lines)
1. **No reliable published figure** for "behind on the cards at the halfway point, goes on to win" in pro boxing. I found no study, dataset write-up or analytics piece that reports it.
2. Same for lead-change rate, wide-vs-close decision shares, and pro-boxing split/majority rates: none found. Famous-comeback lists exist, but they are not rates.
3. Best proxy is my own toy model (estimate, section C): if every round is a coin flip, the man behind after 5 of 10 wins the decision ~12.8% of the time (24.6% draw). Real fights have a stronger man more often, so real decision-comebacks should be lower; late stoppages of the leader add a bit.
4. The sim today (11-14% behind-at-5 wins) sits right at that coin-flip ceiling; nothing found says it is too high or too low.
5. **Recommended game target: 8-14% for evenly matched 10-rounders (aim ~11%)**, lower (3-8%) with a real skill gap. Reasoning: chance alone gives ~13%, skill gaps and judge momentum push it down, a late KO/TKO of a leader pushes it up. A judgment call, not a measured number.

## A. Hard data (what actually exists)

**Pro boxing, outcome mix (not comebacks):**
- Neurology (abstract), "Retrospective Analysis of Professional Boxing Fight Outcomes in the United States during a 6 Month Study Period in 2017", https://www.neurology.org/doi/10.1212/01.wnl.0000580936.14660.4e . Sample: all US pro bouts in a 6-month window in 2017, draws/no-contests excluded; size not visible in the summary. Judges' decisions ~46.5%, TKO ~35%, KO ~18%. Mixed-level cards (lots of short fights), so not a title-fight figure. Second-hand, abstract only.

**Pro boxing, judging research (no usable rates in the abstracts I could see):**
- duBoef, Romeas, Charbonneau, Svejstrup, "Interpretable Prediction and Large Scale Analysis of Judging in Professional Boxing", MIT Sloan Sports Analytics Conference, March 6, 2026. https://www.sloansportsconference.com/research-papers/interpretable-prediction-and-large-scale-analysis-of-judging-in-professional-boxing . Sample: 7,323 rounds, computer-vision round stats vs judges' scores. Builds a points-based scoring model that matches pro judges' accuracy and ranks which stats drive scores. Abstract only; the full paper may hold round-margin or lead-change data. Best lead for a follow-up.
- Gift (2018), cited second-hand in a 2021 paper (J. Sports Analytics, https://journals.sagepub.com/doi/10.3233/JSA-200478): boxing judges agree unanimously on a 10-8 round ~93% of the time (the MMA figure in the same source is ~14%). Second-hand; primary not seen. Says nothing about how often 10-8s occur.
- arXiv 2402.06594 and Reading working paper emdp202401, "They were robbed! Scoring by the middlemost to attenuate biased judging in boxing". About biased-judge aggregation rules, not comeback or margin rates.

**Amateur boxing (wrong level):**
- University of Chester master's thesis (2018), 87 bouts from the 2016 Olympics and 2017 World Championships: 25 performance parameters differed between unanimous winners and losers, only 4 between split-decision winners and losers. Meaning: splits are genuinely close fights. https://chesterrep.openrepository.com/entities/publication/a2aabca9-a8c8-4137-b627-b39d7e4321f9 . No split rate given.

**Not found at all for pro boxing:** lead-change frequency; share of decisions that are 10-0 / 9-1 / close; split + majority decision rate; any "who wins after leading at round X" study; any CompuBox-based comeback analysis. CompuBox coverage found was per fight only, e.g. Canelo-GGG 2017: GGG outlanded Canelo 218-169 and landed more in 10 of 12 rounds, yet the cards ran from 118-110 Canelo to 115-113 GGG with one draw (SI, https://www.si.com/boxing/2017/09/17/canelo-vs-ggg-judges-scorecards-compubox-stats ). Anecdote, not a rate. A university page claims "judges agree on winners only 68% of the time" from a 2021 study; the citation was vague, treat as unverified.

## B. MMA/UFC analogs (fallback only, NOT boxing)
Different scoring (max 5 rounds, more finishes, different 10-8 culture), so do not copy these into the game; loose sanity check only.
- GrapplerHQ, "UFC Statistics: Finish Rates & Fight Trends, 1994-2026 (8,591 Bouts)", https://www.grapplerhq.com/mma/ufc-statistics/ . Of 4,016 decisions: 3,098 unanimous (77.1%), 818 split (20.4%), 100 majority (2.5%). Split + majority ~23% of UFC decisions. (Percentages computed by me from the counts.)
- AgentMMA, UFC 2023-2025, https://agentmma.com/mma-lab/ufc-unanimous-split-majority-decision . 836 judged outcomes: 657 unanimous (78.6%), 161 split (19.3%), 9 majority, 9 draws. Self-published, methodology unverified.
- UFCalendar judges database, https://www.ufcalendar.com/judges : 152 judges, 35,692 round-by-round commission scorecards since 1995. A real dataset, but MMA. Its 10-8 rate is ~2.09% of judge-rounds in 2025 (peak 6.39% in 2019) per https://www.ufcalendar.com/blog/the-vanishing-10-8-round (34,509 judged rounds).
- AgentMMA, knockdown survival (FightStats data), https://agentmma.com/fr/mma-lab/ufc-knockdown-survival-rate : first-knockdown scorer won 86.1% overall; when the downed man survived the round, the scorer still won 65.6% of 910 fights. Closest thing to "early lead converts?", but it is knockdowns, not cards, and MMA has submissions.
- No MMA study found for "trailing on cards at round N wins X%" either.

## C. My own estimate (labeled, not data)
Toy model I ran in Python: 10 rounds, each an independent 50/50 coin flip, no draw rounds, no skill gap, no judge momentum. Looking at the man behind after round 5 (tied-after-5 excluded):
- Behind-after-5 wins the decision: **12.8%**. Draw: 24.6%. Loses: ~62.6%.
- Lead changes hands at least once: ~51%.
- Decision winner lost 3+ rounds: ~85%.
- 12 rounds, looking after round 6: behind wins 7.9%, draw 18.5%, lead change ~42%.
Read: ~13% is roughly the ceiling for decision comebacks in an evenly matched 10-rounder. Any skill gap or judge momentum lowers it. Stoppages of the leader raise it a bit.

## D. Anecdotes / notable comebacks (NOT rates)
Selection bias: lists only contain the fights that flipped.
- Carl Froch KO12 Jermain Taylor (2009): behind 106-102 on all three cards going into round 12 (Ring Magazine, https://ringmagazine.com/en/news/top-5-come-from-behind-victories ).
- Julio Cesar Chavez TKO12 Meldrick Taylor (1990): behind on two cards, stopped Taylor in the last round (same Ring piece).
- Kyeong Ja Bae TKO9 Qinyan Lu (2026): behind on all three cards throughout (per a search summary of a news report).
- Fabio Wardley KO10 Justis Huni: behind on all three cards (same summary).
- More lists: Evolve MMA, "5 Amazing Come From Behind Victories In Boxing", https://evolve-mma.com/blog/5-amazing-come-from-behind-victories-in-boxing/ .
Pattern worth keeping in the game: a man far behind wins late by stoppage (rounds 9-12), almost never by a decision flip.

## E. Recommendation for the sim
- Main question: **no measured number.** Target 8-14% for even 10-rounders (current 11-14% is fine). Don't push it above ~14%: chance alone gives ~13% for decisions.
- Lead change in ~35% of fights: plausible. Pure coin flips give ~51%; real rounds are autocorrelated (styles, judge momentum), so lower is reasonable. No data to confirm.
- 46% of decisions with the winner losing 3+ rounds: unverified. Coin flips give ~85%, so the sim's rounds are far less random, which fits the feel that most real decisions are clear.
- Split + majority ~10% of decisions: only comparison is the UFC (~23%), a different sport. 10-15% for boxing is a judgment, not data.
- Next step if real numbers are wanted: hand-tally Nevada Athletic Commission result PDFs (boxing.nv.gov, per-bout three-judge totals) for decision type and margins, or get the Sloan 2026 paper's data. Round-by-round comeback rates need BoxRec or round cards and a tally; I could not do that from here.
