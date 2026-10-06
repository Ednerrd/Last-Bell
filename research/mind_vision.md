# The Mind of a Boxer: vision, reading, and composure

Research for Last Bell's AI (Ring IQ, `react()`, feints, `decide()`). Companion to `combat_research.md`, which already covers punch speeds, the 310 to 390 ms fatigue reaction number, and the basic AI layout. This file is about what a boxer sees and how his head works under fire.

Tags: **[study]** = peer-reviewed or thesis, **[fighter]** / **[trainer]** = interview quote, **[unverified]** = seen in summaries or common lore, not checked against an original source.

---

## 1. What they look at

- **The "visual pivot".** Ripoll et al. (1995) eye-tracked boxers. Experts parked their central gaze on the middle of the opponent's body (chest and head area) and used peripheral vision to pick up the hands and feet starting an attack. Novices chased the hands. **[study]** (cited in the Frontiers 2020 narrative review on combat sports perception)
- **Fewer, longer looks.** Expert boxers made fewer fixations that lasted longer. The gap between experts and novices only showed in *complex* situations, where experts answered more accurately, while plain reaction time was the same for all groups. **[study]** (Ripoll/Piras line of work, see review links)
- **Same pattern in other combat sports.** Judo experts fixate the lapel and face, novices the sleeve. Kendo experts look at the eyes and head, novices at the sword. A meta-analysis of 12 martial arts papers found longer fixations in experts. **[study]**
- **Mayweather:** reported as saying he does not look at any one spot, he scans the whole body and has the opponent figured out in about two rounds. **[unverified]** quote, but it matches the visual pivot idea.
- **Trainer lore:** "watch the chest / the sternum, the shoulders tell you first, never chase the hands." Common in gyms. **[unverified]**, though the occlusion study in section 3 backs the "upper body tells you" part.

**Takeaway:** good fighters do not look at the fist. They look at the middle of the man and let the edges of their vision catch the start of the move. The shoulder and hip start before the hand does.

## 2. Speed of perception: the numbers

- Jab: about 0.4 s from movement onset to contact, including the wind-up (Piorkowski et al. 2011). The visible extension is maybe 100 to 150 ms. **[study]** + est.
- Simple visual reaction time in healthy adults is roughly 180 to 250 ms. **[textbook]**
- Rear straight to a light signal: about 310 ms fresh, 390 ms after three hard rounds (Jyväskylä thesis, already in combat_research.md). **[study]**
- Mori, Ohtani & Imanaka (2002), karate: experts and novices had the **same simple reaction time**, but experts were faster and more accurate on **choice reaction** (which attack is it?) using realistic video. **[study]**
- "Choice reaction time is not related to competition success in karate" (UCM study): raw lab reaction speed does not predict who wins fights. **[study]**
- Muay Thai, 18 elite athletes: simple reaction time got slower after induced fatigue. **[study]**

**Takeaway:** the hand outruns the eye. If a fighter waits to see the punch, he loses. Elite defense is mostly *knowing early*, not reacting fast. Raw reflexes barely separate the best from the rest; reading does.

## 3. Anticipation and tells

- **Upper body is the main cue.** In a karate occlusion study (Nittaidai thesis), hiding the attacker's upper body slowed defenders' reactions, so the shoulders and trunk carried the key early information. Experts also showed shorter P3 brain-wave latency, meaning faster "which punch is it" processing, mostly on head punches. **[study]**
- **Experts read earlier frames.** General finding across combat sports: high-level fighters respond faster and more accurately to attacks and fix on fewer points. **[study]**
- **Tells trainers name:** **[trainer lore, unverified]**
  - Shoulder dip or turn before the right hand.
  - Weight shift to the front foot before a lead hook or jab-in.
  - Dropping the hand slightly (cocking) before a hook.
  - Breath: many fighters exhale sharply on the punch, some inhale or "set" just before.
  - Rhythm: a fighter who bounces on a beat often punches on the same beat.
  - Habit chains: "always throws the hook after the double jab", "always pulls straight back after a jab".
- **Distance shapes the menu.** Hristovski et al. (2006): boxers' choice of jab, hook, or uppercut switched on and off at specific scaled distances to the target. Distance alone predicts a lot of what is coming. **[study]**

**Takeaway:** a read is three things: *where* he is (distance sets the menu), *what his body is doing* (shoulder, weight, hand), and *what he did last time* (habits).

## 4. Building a read over a fight

- **Crawford:** known for sitting back, collecting data, and adjusting, often using about the first three rounds to feel opponents out (CBS Sports). Said he figured Shawn Porter out "in round 1" and then broke him down. He also said his confidence grew in round 1 vs Spence "as we felt each other out". **[fighter]**
- **Mayweather:** often seemed to "give away" early rounds while studying, then took over (vs McGregor from about round 4; vs Pacquiao he found how to keep him on the end of the jab). **[analysis]**
- **Usyk:** described as spotting patterns fast, e.g. noticing when an opponent resets position and countering on that signal; adapts mid-fight. His rhythm is the key to his game (ESPN on Usyk vs Dubois). **[analysis]**
- **Inoue:** Teddy Atlas: "Inoue has great 'eyes' with a steely calm enabling him to see where the openings and proper placement for specific punches are." Inoue on his own growth: he can "respond accurately to my foe's movement". Father and trainer Shingo: "It's all about concentration. When Naoya is fully focused, he can make split-second decisions." **[fighter/trainer]**
- **Lomachenko:** training built by his father Anatoly with a psychologist: juggling, tennis, handstands, reaction timers and number-chart tests (the kind used for pilots and cosmonauts) (ESPN). His "seeing angles" is footwork plus reading where the opponent will turn. **[fighter profile]**
- **The pattern:** early rounds = gather, middle = test guesses (feint, see what he does), late = cash in. A good read is *specific*: "after his jab he drops the left", not "he is good".

## 5. Feints vs the read

- **What a feint is, in research words:** deception = giving false cues; disguise = hiding true cues. Both attack the opponent's anticipation (Expertise and Deceptive Movements in Sport, review). **[study]**
- **Experts read deception better.** Across 16 studies, experts beat novices at telling fake from real. **[study]**
- **But experts also bite more, on purpose.** In savate, expert fighters made *more* false alarms to feints than intermediates and novices. Authors think this is a strategic bias: an expert would rather react to a fake than eat a real one. **[study]** This is the key game idea: **the better your read, the more you commit early, and the more a feint can steal from you.**
- **How a feint hijacks the read:** it shows the early cue (shoulder twitch, step in) that the defender's brain has learned means "punch now". The defender commits a slip or block, which leaves a window (already modelled by `STYLE_BITE` and `read.reacts`).
- **Feints also mess with rhythm and with the read itself:** if half of his shoulder twitches are fake, your "shoulder means punch" link gets weaker. Feints lower the *trust* in a cue, not just one reaction.
- **Counter to feints:** veterans test with their own feints first, see if the opponent's feints are real, and stop biting when a cue keeps lying. **[trainer lore, unverified]**

## 6. Fear, composure, momentum

- **Cus D'Amato:** "Fear is like fire. If you learn to control it, you let it work for you. If you don't learn to control it, it'll destroy you and everything around you." And: "The hero and the coward both feel the same thing, but the hero uses his fear, projects it onto his opponent, while the coward runs." (widely quoted, via Tyson's books and quote collections) **[trainer]**
- **Anxiety eats attention.** Attentional Control Theory (Eysenck et al.): worry competes for working memory, so efficiency drops under anxiety, and gaze gets less efficient. Tested mostly outside boxing. **[study, general]**
- **Fight, flight, freeze:** a hard shot triggers an adrenaline spike; some fighters fire back, some run, some freeze for a moment while the thinking brain catches up. Trainers use gradual stress exposure (hard sparring) to reduce panic. **[practitioner sources, not lab data]**
- **Bivol:** "I am trying to not follow my emotions. You should not follow your emotions because your brain will not like it in the future. Now I just try to be like a machine, see and win." And on Canelo's opponents: "their emotions was against them". Eddie Hearn: "If you check Dmitry Bivol's pulse right now, you might not feel anything." **[fighter]**
- **Shakur Stevenson:** "Hit and don't get hit" is "the first thing my granddad taught me". A "never emotional" line is often attributed to him. **[the second one unverified]**
- **Momentum is real but small.** A judo study found psychological momentum (winning the previous exchange or bout) had a significant effect on performance, possibly through testosterone. Other research argues much of "momentum" is strategy, not mind. **[study, debated]**
- **Being in someone's head / intimidation:** when an opponent keeps being right (countered every time he jabs), fighters stop throwing: "he froze up", "he's gun-shy". Well-known in commentary, no lab number found. **[unverified]**

**Takeaway:** composure is not "no fear", it is keeping the read and the plan while scared or hurt. Low composure = when hurt, the brain drops the read and goes to one blunt habit (shell, run, or swing).

## 7. Fatigue, damage, and cognition

- **Fatigue makes fighters fast and wrong.** After max aerobic effort, athletes decided faster but made more errors, and their gaze used more fixations (less efficient, the opposite of expert gaze). Physical plus mental load together hurt anticipation the most (Leeds Beckett soccer study). **[study]**
- **Reaction slows:** 310 ms to 390 ms on the rear straight after three rounds (see section 2). **[study]**
- **Head contact hurts thinking within minutes.** Di Virgilio et al. (2019, Stirling): 20 amateur boxers, three 3-minute sparring rounds. One hour later: more corticomotor inhibition, changed motor control, worse memory. Back to normal by 24 h. **[study]**
- **Collegiate boxers:** after two 2-minute rounds, small drops in delayed memory (response time actually improved, probably arousal). **[study]**
- **In fight terms:** a tired or shaken fighter (a) reads cues later, (b) guesses more and commits early, (c) forgets the read he built ("he stopped seeing the right hand"), (d) falls back on his deepest habit. This is why late-round KOs come from punches the fighter "saw all night".

---

## 8. Engine translation

What already exists: `F.read` stores **offensive** knowledge (what of mine lands or gets avoided: `th`, `av`, `thr`, `land`, `reacts`) and feeds `pickCombo`. `react()` uses `iqK(D)` only as a flat ±8% factor. Nothing remembers **the other man's habits** on defense. That is the gap.

### 8a. A defensive read: "I know what he throws next"

Each fighter keeps a tiny table of the opponent's punch transitions (what follows what) plus his openers. Cheap: a few dozen small integers.

```js
// in newRead(): add
seen: {},      // seen['jab>cross'] = count; seen['>jab'] = openers (first punch of a combo)
seenN: 0,      // total punches observed
trust: 1,      // how much he believes his cues (feints wear it down)

// startPunch(A, type): the defender watches (only if not stunned, and he can see it)
const Rd = A.op.read, key = (A.inCombo ? A.prevP : '') + '>' + type; // inCombo: whatever flag marks a follow-up punch
if (A.op.state !== 'stun') {
  const see = .5 + .5 * iqK(A.op);                 // smart fighters notice more of what he does
  if (R() < see) { Rd.seen[key] = (Rd.seen[key] || 0) + 1; Rd.seenN++; }
}

// how well can D predict this punch? 0..1
function guess(D, A, type) {
  const Rd = D.read, prev = A.inCombo ? A.prevP : '';
  let tot = 0, hit = 0;
  for (const k in Rd.seen) if (k.startsWith(prev + '>')) { tot += Rd.seen[k]; if (k === prev + '>' + type) hit += Rd.seen[k]; }
  if (tot < 3) return 0;                            // needs a few looks first
  const p = hit / tot;                              // how habitual is this exact move
  return clamp((p - .25) * 1.6, 0, 1) * Math.min(1, tot / 12); // a 60% habit seen 12+ times = strong read
}
```

In `react()`, after the existing factors:

```js
const g = guess(D, A, A.act.type) * clarity(D) * D.read.trust * (1 - STYLE_ODD.read * (A.st.odd || 0));
ch *= 1 + READ.edge * g;                // READ.edge ~ .35: he saw this one coming
D.pendingDef.at *= 1 - .4 * g;          // and he moves earlier (looks like anticipation, not reflex)
if (g > .5 && kind !== 'block') D.bait = Math.max(D.bait, .4); // he knows it is coming: counter window
```

Why this shape: it rewards the **attacker who repeats himself** (real), it grows over rounds on its own (Crawford/Mayweather "download"), it scales with Ring IQ through what gets noticed, and the existing `swapStance` already halves reads (extend it to halve `seen`). It also gives the attacker a reason to vary combos, which the current `c.key === F.lastCombo` penalty half does already: make that penalty stronger when `A.op.read` has a strong guess on the combo's first move.

### 8b. Clarity: fatigue and damage blur the read

```js
function clarity(F) {                       // 1 = sharp, ~.4 = foggy
  const tired = 1 - stamFac(F);             // 0 fresh .. 1 empty
  const hurt = 1 - F.head / F.headMax;      // damage taken
  const shook = F.shook || 0;               // recent big shots, decays (see 8d)
  return clamp(1 - .35 * tired - .35 * hurt - .5 * shook, .3, 1);
}
```

Also on a knockdown or a big hurt, wipe part of the memory: `for k in seen: seen[k] = floor(seen[k] * .6)` ("he forgot what he'd figured out"). Composure (8d) scales how much is lost.

### 8c. Feints vs trust

Feints already count in `read.reacts`. Add: when D reacts to a feint, `D.read.trust = max(.5, trust - .06 * (1 - .5 * iqK(D)))`; each real punch D reads correctly gives `trust += .02` back (cap 1). Per the savate result, a high `g` should also mean D **bites harder** on a feint of that same punch: in `startFeint`, the bite chance uses `1 + .5 * guess(D, F, feintType)`. Smart fighters get punished by their own read, which is exactly the feint master's job.

### 8d. Composure and the "hurt brain"

No new trained stat needed at first: derive it.
```js
composure = clamp(.5 * heart + .3 * iq + .2 * exp_bonus, 20, 99)   // later: its own stat, trained by hard sparring
```
On a big landed shot (or a cut, or a KD), `F.shook += dmg / (40 + composure)`; it decays about `.15/s`. While `shook > .35` the fighter enters a short **panic mode** (1 to 3 s) and picks ONE response, weighted by style and composure:

| response | weight driver | behaviour |
| --- | --- | --- |
| shell | high guard / peekaboo, low heart | `def='block'` long, no punches, reacts only with block |
| run | outboxer, footwork | backs off, more pull, lateral moves |
| fire back | slugger / swarmer, high heart | throws a 2 to 3 punch power combo now, accuracy down 15% |
| clinch | spoiler / jab-grab, high IQ | grabs |
| freeze | low composure only | 0.3 to 0.6 s with no react() at all (the real danger moment) |

High composure (Bivol mode) shortens panic and swaps "freeze" for "clinch" or "smart shell". This makes "hurt" a readable, exploitable state with a visible tell, as combat_research §6 asked for, and gives the commentary lines ("he's frozen!", "he wants to trade!").

### 8e. Momentum and being in his head (small, capped)

`F.mo` in [-1, 1]: +.1 when he lands clean or wins an exchange, -.1 when he eats a counter, decays to 0 between rounds by half. Effects: `aggr *= 1 + .12 * mo`, `react ch *= 1 + .05 * mo`. If D's read keeps beating A (A eats 3+ counters in a short window), A gets `gunShy`: punch rate down 20% for a few seconds unless composure is high. Keep effects small (Section 6: momentum is real but debated).

### 8f. Cost and tuning

- Memory: about 30 small counters per fighter. `guess()` runs only in `react()` (a few times per second). Fine on a phone.
- Balance risk: 8a makes defense better over a fight, so connect % may fall late. Offset with `READ.edge`, or let the attacker's combo picker avoid moves the defender has a strong guess on (that also adds visible variety). Check the audit target (~29% connect) per round, not only overall.
- Style hooks: counter-punchers learn faster (`see` × 1.3), sluggers slower; awkward already cuts the read; switch-hitter halves it; feint master drains `trust`.
- Corner talk: the coach can report the read: "He drops his left after the jab, I see it, he's ready for it" when `guess > .5`, or "He's figured out your 1-2, change it up" when the opponent's read on you is strong.

---

## Sources

- Perceptual-cognitive expertise in combat sports, narrative review and model (Frontiers in Sports and Active Living 2020): https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2020.00040/pdf and https://researchonline.ljmu.ac.uk/id/eprint/10516/
- Eye-tracking in combat sports, narrative review (Ido Movement for Culture): https://imcjournal.com/index.php/en/v2005/contents-number-31/2193-abstract-eye-tracking-analysis-of-perceptual-cognitive-processes-in-combat-sports-a-narrative-review
- Boxing visual search (Piras et al.): https://cris.unibo.it/handle/11585/389523 , https://iris.unige.it/handle/11567/662967
- Karate occlusion / P3 study (Nippon Sport Science Univ. thesis digest): https://nittaidai.repo.nii.ac.jp/record/1763/files/ETD-A0092-digest.pdf
- Choice reaction time is not related to competition success in karate: https://produccioncientifica.ucm.es/documentos/5d399a2c2999520684461019
- Milazzo et al. 2016, implicit perceptual training in karate: https://vuir.vu.edu.au/34294/
- Expertise and Deceptive Movements in Sport (review): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11166615/
- Hristovski et al. 2006, How boxers decide to punch a target: https://www.jssm.org/jssm-05-CSSI1-60.xml-abst
- Physical + mental load on anticipation: https://eprints.leedsbeckett.ac.uk/id/eprint/9850/
- Fatigue and combat athletes (Frontiers 2025): https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1512326/pdf
- Di Virgilio et al. 2019, sparring and brain changes: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6746992/ , https://www.stir.ac.uk/news/2019/09/routine-sparring-in-boxing-can-affect-brain-performance/
- Collegiate boxers neurocognition: https://www.iat.uni-leipzig.de/datenbanken/iks/drv-rugby/Record/4075566
- Psychological momentum in judo: https://econtent.hogrefe.com/doi/10.1026/1612-5010/a000393
- Cus D'Amato quotes: https://www.azquotes.com/author/23736-Cus_D_Amato
- Crawford: https://www.cbssports.com/boxing/news/terence-crawford-answers-challenge-from-jose-benavidez-jr-scores-12th-round-knockout , https://www.boxingscene.com/articles/crawford-spence-hit-hard-everyone-said-he
- Inoue: https://www.espn.com/boxing/story/_/id/38054594 , https://boxingnews.jp/english/107239/
- Lomachenko training: https://africa.espn.com/boxing/story/_/id/21681715
- Usyk rhythm: https://africa.espn.com/boxing/story/_/id/45762975/oleksandr-usyk-rhythm-key-there-way-daniel-dubois-disrupt-it
- Bivol: https://www.boxingscene.com/articles/dmitry-bivol-despite-artur-beterbiev-disappointment-avoids-following-his-emotions , https://develop.reviewjournal.com/?p=2332695
- Shakur Stevenson: https://www.si.com/fannation/boxing/like-floyd-mayweather-shakur-stevenson-says-olympic-heartbreak-made-me-who-i-am-
- Fight/flight/freeze (practitioner): https://muay-ying.com/navigating-the-fight-flight-freeze-response-in-muay-thai
