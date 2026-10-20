# Ring Magazine (YouTube): notes for the brain, the corners and the refs

Source: The Ring's YouTube channel (Riyadh Season era: full fights, Inside the Ring with Max Kellerman, pre-fight rules talks). Our own notes in our own words; raw transcripts are not kept. Ed pastes the transcripts.
Ed's shortlist (Oct 20): Crawford-Canelo breakdown, "Teo had no strategy" (Inside the Ring), Thomas Taylor's rules talk, Usyk-Dubois 2 review, Ryan Garcia's left hook. Then full fights: Shakur-Teofimo, Bivol-Beterbiev 2, Joshua-Prenga, Parker-Wilder, Hrgovic-Itauma.

# Batch 1 (Oct 20)

## 1. Crawford-Canelo (Sep 2025), a post-fight breakdown
(A guest analyst's review, not a ring-side corner.) The small man moving up two divisions won it on tempo and distance.
- **Early, even.** Bud boxed better and threw more; Canelo threw harder, mostly to the body, and cut the ring. When Canelo found his range, Bud slid out and made him reset.
- **Rounds 4-5: the big man's surge.** Canelo turned up the pressure and landed big shots upstairs to show him the weight difference.
- **Round 6: the turn.** Bud came out fast to start the round. By then he'd taken Canelo's best and was fine, and from there he held the tempo and the range.
- **He fires back every time he's tagged.** Never lets the big man's shot stand alone.
- **Late: the big man's tank goes.** Canelo's shots lost their snap and he started telegraphing, so Bud started putting combinations together. The championship rounds were all Bud: conditioning.
- **Scores all over the place** during the fight (close rounds), but the end result matched what most saw: 116-112, 115-113 x2.

Engine check:
- Tired punches telegraph: **built.** Fatigue cuts technique (`fire()`: tech x (1 - .25 fat)), and worse technique shows more wind-up (`tell`), which the other man reads (`BR.tellSee`).
- He fires back when tagged: partly. The hurt man's answers and the unanswered count exist (`hurtResp`, `unans`), but a *normal* answer-back habit (every time he eats one, one comes back) is a trait idea, not a thing.
- Taking the big man's best early, then turning it: no "he's taken my best" read. Idea: a man whose big shots aren't hurting him loses confidence (`emo`), the other gains it. Ties to the drama work (the turn of a fight).
- Close rounds scored all over: **built** (`JUDGES` taste weights + `noise`).
- Size: fights in the game stay inside a division; a two-division jump isn't a thing we simulate.

## 2. Inside the Ring: Shakur outclasses Teofimo (Kellerman, Malik Scott, Coppinger, McCoy)
- **Shakur boxed every second.** No running, no holding (maybe 20 seconds once, end of round 9). Jab, range, check hook off the jab. Kellerman's line: boxing is standing in range and punching, using the legs only to get out; holding and running to protect a lead is *not* boxing (he contrasts Haney vs Norman: boxed early, then "sat on a lead").
- **Kellerman: strategy vs tactics.** Strategy is controlling the board (chess: the center); tactics are the exchanges. Whoever controls the space wins the exchanges.
  - **Southpaw vs orthodox: the lead foot battle.** The man with his lead foot outside the other's controls the space: his rear hand is closer, he moves naturally in his direction, the other man is pushed into a retreat even while they circle. From outside: the hook to the body, the right hand to the chest/head are open; the other man's rear hand is far and his hook is out of reach.
  - **Teo had no strategy.** The one round he won (the 8th) was when he jumped his foot outside and hooked the body, and then he never went back to it.
  - **The corner.** No instructions in Teo's corner that he could use. The good ones are calm, short and *actionable* ("get your lead foot outside", not "you'll hate yourself tomorrow"). Malik Scott's counter: some nights the other man is just better and no corner fixes it.
- **Shakur after:** "I knew by round 2 it was over. I'm stronger than he is." Teo "fought not to get stopped."

Engine check:
- Holding to protect a lead: we have holding and the ref's `holdN` warnings; a "sitting on a lead" mode exists in the brain (running late, `SV.late`/`lateRun` when hurt; the AI corner's Slow down). Fine.
- The lead foot battle: **not built.** Nothing in the brain or engine knows whose lead foot is outside (`grep` finds no outside-foot logic). The stance only flips the guard and the switch-hitter's re-read. Idea (big, after the long guard): in an open-stance fight, a fight for the outside foot; the man who wins it gets his rear hand closer (a small landed edge on the power hand) and the other man's hook is farther. Pairs with Skillr's "circle to his weak side" (`research/skillr.md` #4).
- Actionable corner instructions: **built-ish.** The AI corner gives one plan between rounds (`aiStrategy`), and corner talk names the call (`planVerdict`). A corner whose calls are vague (lower trainer quality) would fit the trainers plan (`research/trainers.md`).
- Against our grid (`skillr.md` #13: nobody beats the counter-puncher): this fight backs the engine more than it fixes it. Teo came forward with no plan and got boxed. Pressure beats a counter-puncher only *with* a strategy (cut the angle, the foot outside, the body).

## 3. Thomas Taylor's pre-fight rules talk (Garcia-Benn, both dressing rooms)
The real ref our **Tom Tyler** is modeled on, in his own rules talk:
- **Clinches:** he lets them break on their own first ("pull your arm out, hands are free, work out of it"). If not, he says stop: stop punching, take a full step back, **no punch on the break**.
- **Down:** "down, corner", the furthest neutral corner, wait for him.
- **Intentional fouls get no in-ring warning:** the warning is the dressing room talk. By rule it's points, maybe a DQ.
- **Accidental fouls** (heads, rabbit punches, kidney shots, low blows) happen. But keep doing it and he calls it intentional. **Retaliating is an intentional foul.**
- **On the ropes:** "Got to show me something. Fight back, bob and weave, hold him, run, but do something." If he's taking a lot to the head and body and not protecting himself smartly, Taylor stops it. (Holding counts as doing something here.)
- **The bell:** no punch after it. (`refs.md`: he took a point for a punch after the bell in Benavidez-Morrell.)
- **Mouthpiece out:** he waits for a lull, calls time, wipes it, back in.
- **The corner can stop it:** tell the inspector beside you, they get the ref's attention.
- **Corners lobby him:** Benn's corner asked him not to let Garcia hold inside (and hit behind the head); Garcia's corner asked him to watch the rabbit punches. His answer: holding slows the fight, he wants "an even flow" and the fight to come to its natural end.

Engine check against `REFS` and `foul()`:
- Tom Tyler today: `stop: 1` (quick), `hold: 1`, `holdN: 6`, `dirty: 1`, the middle on holding. Taylor's own talk leans **against** holding ("slows the fight down", took a point for it early in Cruz-Bravo, `refs.md`). Possible tweak, Ed's call: holdN 6 -> 5, or keep him middle (the talk is the same for every fight; what he does in the ring is what `refs.md` rated 5 on clinch).
- **Intentional = no warning:** our `foul()` warns twice before a point, for holding and for dirty shots both. By Taylor's rules a deliberate foul is a point right away. Holding is a warning-first foul for most refs (fine); the dirty shot in the clinch is closer to accidental (fine). Nothing to change unless we add real deliberate fouls (punch after the bell, hitting on the break, hitting a downed man).
- **No punch on the break:** fits batch 1 of Skillr (#3 "the break is live"): the sneak shot on the break is exactly the foul Taylor warns about. So the idea needs both sides: a sneak shot that lands, and a strict ref who takes a point for it (`dirty`).
- **"Do something" on the ropes:** **built.** That's the unanswered-punch stop (`unanswered`, `REFS.stop`). Taylor counts holding and running as doing something. Checked: the count (`F.unanswered`) only grows on power shots into a stunned or badly hurt man, and clears when he lands one back or after 2.5 s with nothing new (`unT`). A clinch doesn't clear it: a short tie-up (1.1–2.3 s x the ref's `hold`) can leave the count standing when they break. Small fix idea: a clinch he started, or getting off the ropes, clears it (Taylor's "hold him, run, do something").
- **Corner stop (towel):** built but thin (corrected Oct 20, `toprank.md`): between rounds, worn and behind on the cards, a coin flip says RTD. No real corner call, never mid-round, no button for the coach. Idea for the AI corner (and the coach player: a "stop it" button).
- Rabbit punches, kidney shots, low blows, head clashes, the punch after the bell: **not built.** Only holding and the clinch dirty shot are fouls today. Low blows and head clashes are the common ones (a head clash cut is a real fight-changer). Parking-lot ideas.

## What's new from batch 1 (each one an engine check first)
1. "He's taken my best": the big puncher loses confidence when his best doesn't hurt the man; the other man gains it.
2. The lead foot battle in open-stance fights (whose foot is outside).
3. Corner quality = actionable calls (trainers plan).
4. Tom Tyler a touch stricter on holding? (Ed's call.)
5. More fouls: punch on the break, after the bell, low blows, head clashes; deliberate ones cost a point at once.
6. Holding or getting off the ropes should clear the unanswered-punch count (checked: today a clinch doesn't).
7. The corner throws the towel for real (AI corner, and a button for the coach): see `toprank.md` #1.
