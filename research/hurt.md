# Surviving hurt (YouTube): notes for the hurt brain

Source: YouTube clips pulled with `tools/yt/yt.py` (`research/CLIPS_WANTED.md` item 3). Our own notes in our own words; raw transcripts are not kept. Auto-captions garble names ("Mekong" / "make on" = Amir Khan): fixed here where sure.
Read with `research/mind_finish.md` section 2 (the options, recovery time) and the brain's hurt answers (`survStart` / `survUpd`, `SURV` in `brain/brain.js`: shell, run, fire, clinch, freeze, steady, bluff, bait).

# Batch 1 (Oct 20)

Pulled: 7 tried, 4 with captions, 3 useful (Loma-Linares was a fan recap: "got up quickly, survived the round, then went to the body"). Bot-walled (no captions, retry later): Bazooka Joe "strategies to survive being hurt or rocked" (`ve1t5-8YFic`), fightTIPS "recover after a big hit" (`3mzP2YM1YfQ`), "fighters that didn't know how to stay down" (`rJyHh3pxGLs`), Atlas on why Fury got up (`XVsaB4_Z42c`), Fury on round 12 (`TWP6rAPUxDs`).

## 1. Regal Boxing: "Dos and don'ts when hurt" (Khan-Garcia, a coach's breakdown)
Khan dropped by Garcia's wide left hook; the coach goes through what he did wrong, then a second fighter (name lost in the captions) who did it right.
- **Right first move:** double guard up. Then Khan pushed Garcia off and punched back: wrong.
- **Don't make space.** Backing off "sounds like it makes sense" but the wider the gap, the more room the other man has to swing wild shots. Stay close and smother. (Against our `run`: range 24, and the `wary` box-long after a KD. Inoue's fix vs Cardenas was distance *after* he'd recovered (`mind_finish.md` 2b): the two fit if close is the answer while the legs are gone and long is the plan once they're back.)
- **Don't fire back while hurt.** Your reaction time is gone, and a shot that wouldn't bother you fresh hurts you a lot more now. Khan kept trading and kept getting countered with full hooks and overhands; the end came from a punch that "didn't look too hard", on top of the head.
- **Temper is the tell.** Khan taunted, shouted, "seeing red, in fight mode". Calm down and survive. He covered well in parts, then got rattled, fired back, and got caught flush. (Our `fire` answer comes from risk x low composure: this is the same man. A taunt or shout when hurt is a commentary hook.)
- **The right way:** hold on "for dear life", lean on him, walk him back shamelessly, not one punch thrown, because he's still conscious and can think even with shaking legs. "A fight isn't a sprint." Survive the patch, come on later.
- **A punch now and then** so the other man knows you're still in there (and the ref does), but the mind stays on defense.
- **Leaning is offense.** Position your body so he wants to punch, then dip, lean, hold. That weight "is as if you're landing punches": it tires him and makes him think "this guy's tough". **First source for the size gap "leaning on a man to tire him"** (`CLIPS_WANTED.md` item 2): a coach's claim, no numbers.

## 2. Crawford-Gamboa (Top Rank full fight, 2014, booth call)
Gamboa winning rounds 2-4 with speed, Crawford fighting southpaw and getting beaten to the punch; then it turns.
- **Hurt by getting brave.** Gamboa "got a little too reckless", out of position: hurt with a right, dropped with a left (R5). "The rest of this round he's fighting on instinct." He fought back "valiantly", staggering, nailed again and again; saved by the bell.
- **The legs tell the story after.** Into R6 "very flat-footed", "heavy feet", "his legs still aren't there two minutes into the sixth". Then up on his toes, bouncing. **"I don't think Terence realizes he's still in trouble":** the hunter missed a hurt that was still there the next round. (Our hurt read lives in the eyes (`Look`, legs); a carry-over hurt between rounds is what the booth saw.)
- **The corner revives him.** By R7 his legs are "totally back": "whatever they've done in the corner, he's revived."
- **Looking down when hurt gets you hit.** "He's been looking down, and when he looked down Crawford popped him."
- **Caught while firing back.** R8: down again on a right-left; up, then hurt again *as he threw his two-shot punches*, Crawford "blasted him". The hurt man's counter is the finisher's chance too.
- **Behind on the cards, he has to gamble.** After two knockdowns "he's got to throw all caution to the wind. If he gets stopped he gets stopped, but he can't win without taking a lot of risk." (Our `desp` x `despFire`: the same rule.)
- **Tired from emotion.** Back to the corner after R8 "a little tired": a young man's first fight like this, "his emotions running very high, it takes a lot out of you."
- **Turning his back** in R9 (lucky it didn't draw a shot behind the head). Down with a hook, up, "no quit in him, keeps battling", stopped with 22 s to go (R9). Career note from the booth: down six times before this fight, always got up.

## 3. TJlovesFights: "Why boxers hug so much" (the clinch, the rules)
- **Two reasons to clinch:** (1) hurt, needs a breather or to reach the bell: the most common use, the least booed, a last resort, so rare in a fight. (2) To stop the counter or kill the other man's offense: land, then grab (Mayweather vs Hatton; Ward, Rigondeaux, Klitschko vs Povetkin, Ruiz "the Squeeze").
- **Clinch vs hold:** a clinch ties both arms (nobody can punch, the ref must break it); a hold takes one arm and leaves a hand free (Duran, Fury work inside this way; Spence-Brook let to fight in the half-clinch with minimal breaks).
- **Docking:** the rules allow points off for excessive holding, rarely used on stars. Example: Sharon Sands warned Daryl Hayes in R2 and docked him seconds later for an intentional hold (the crowd cheered). Kellerman's idea, 3 clinches then a point: our refs already work this way (`REFS.holdN` 3-8 clinches before a warning, strict refs dock).
- His fix (an opinion): ban the full clinch, allow the one-arm hold and let them work. Not for the engine; it does say the hurt man's grab should stay cheap (a last resort the crowd accepts) while the tactical grab is the one refs count. (Today `clinch` events from a hurt man don't go in the grabber's memory, `brain.js` ~590: the same split.)

## 4. Dorian Boxing Coach: "How Inoue recovered from the knockdown" (Inoue-Cardenas, R3; Ed pasted it)
Round 3, the round after Cardenas dropped Inoue at the end of R2. A coach goes through it punch by punch: how a World-class man rebuilds after a knockdown once his legs are back.
- **The jab rebuilds it.** Jabs are ~70% of what he throws. Touch jabs to the gloves, framed there a half second; a "high jab" to the top of the guard / forehead, "much more commanding than aiming for the chin". Even landing on the gloves it pushes a square man back, keeps the range, and tells him to respect the power. The bigger shots come off it (threes: 1-1-2-3, a feint then 1-2-3, all to the guard).
- **Small steps back, not big distance.** "Not creating too much distance too quickly, that's what he doesn't want to do after getting knocked down": he keeps the other man's respect. Economical feet: a small step instead of a full reset. He sets his feet so he isn't pushed back, circles left so he isn't near the ropes.
- **Defense first, no rush.** Slip looks, high-guard looks, step backs: "he wants to trust and have confidence in his defense", "super cautious, the correct thing after getting dropped". He waits for it.
- **Feints buy respect.** A slip feint before the jab (not every time, so not a tell), level-change feints to the body that make Cardenas hesitate and shell up, then the combination into the shell.
- **How he got dropped (the trap):** Cardenas's high guard looks safe and basic, but he is quick off the trigger with the counter left hook: let the other man think it's safe to unload so he closes the distance recklessly. That's the R2 knockdown (a chopping hook). In R3 Cardenas also double-feints the entry to time Inoue's pull-back, and jabs from the temple, which a low lead hand can't parry upward.
- **Let him get greedy, then step in.** Inoue covers and lets Cardenas unload (double jab, body hooks, head hook), knowing he'll get greedy and comfortable; then the right hand as he comes in, and Cardenas backs off "heavily". After that Inoue walks him down with touch jab -> straight right.
- **His holes (the coach's read):** regular patterns when he "really wants to retaliate" (tells), and almost no jab going backward: he always steps in with his attacks, so he closes the distance for a counter-puncher. Twice he steps into Cardenas's slip-inside left hook doing it. A square base after defending gets caught by the third punch.
- **Fit with section 1:** Regal says smother while the legs are gone; this is the next phase, the legs back: box long at a short-step distance behind the jab, defense first, feints, and counter the hunter's greed. (Our `wary` after a KD, `SV.after`, is the box-long part.)

## 5. Ben Davison on Fury-Wilder I, round 12 (TNT interview)
Fury's trainer on the round he got up from. Most of the interview is the comeback story; the fight parts:
- **The late-round plan vs a puncher: "make it boring."** Feint, keep the distance, change height, tie him up. "Lose 10 seconds here, 10 seconds there, you can make a three-minute round a two-minute round." Nullify, no silly chances: a dangerous man with three minutes left can land at any time. Keep him calm: anxiety makes mistakes.
- **The knockdown came from greed.** Fury was worried about the judges and wanted to finish strong. He'd been landing the 1-2 "in two phases" all night (land, take a little distance, land again); he landed it, thought "I'm going to get you again", got "a little too offensively minded" for a split second, and got caught. (A man ahead going for the late finish: our `desp` is the other side of this, the man behind.)
- **The corner reads the floor.** "When a fighter's hurt but going to get up, something's moving: hands, feet, rolling over, the head pops up." Fury lay still, so Davison thought it was over and didn't even think of the towel. The ref (Jack Reiss) has him step to the side: legs under him, go on.
- **After he got up:** full guard, eats a big left hook, the corner wonders whether to step in, then he ties Wilder up at the right moment. ~20 s left. The corner wanted only "nullify, see the round out, you're not winning this round back"; Fury pushed Wilder back the last 10-20 s instead.
- **Getting up breaks the finisher.** "Being able to break the man in front of you is a massive part of boxing": Fury rising "took a huge part of Wilder away from him".

## For Last Bell (ideas, not built)
1. **Close, not far, while the legs are gone** (Regal): `run` (range 24) is the textbook mistake for a man with bad legs; smother/lean (`clinch`, `shell` close) is the coach's answer. Run could stay for a man whose legs still work (`tr.legs`, footwork), and the far `wary` plan could start once the hurt clears (Inoue). Check `finish.js` hurt answers before touching it.
2. **Hurt magnifies damage** (Regal, and the light punch on top of Khan's head): the engine's hurt is a low head meter (`hurtNow`: stun or head under 30%), so he is already closer to the floor; nothing scales a punch up while he trades. Open question for the balance pass (stops 30-35%): a hurt man who fires pays a little more per shot taken.
3. **Temper:** a hurt man who taunts / fires back is the low-composure `fire` pick; a commentary line ("he's seeing red") and maybe a corner call ("calm down, hold") for the AI corner.
4. **Carry-over hurt:** the legs stay heavy into the next round (Gamboa R6), the corner can revive him (R7). Today the break clears most of it (`mind_finish.md` 4b item 6 has a residue idea). The hunter missing it is a level thing (the eyes).
6. **After the KD, once he's back** (Inoue R3): the `wary` box-long plan could look like this: jab share way up (~70%, touches to the guard count for range and respect), short steps back instead of max range, more feints, defense first, and a counter-trap for a hunter who unloads. A reckless re-entry right after a KD (retaliating) shows tells and walks into the counter.
7. **The counter-trap guard** (Cardenas): a high guard that looks basic, a fast counter hook; let him think it's safe. Same idea as f2 the bait and the coach-clip list 1b(5).
8. **Make it boring** (Davison): a corner plan for a man ahead late vs a puncher: feints, range, height changes, clinches that eat the clock. Our AI corner has Slow down; this is the safe-lead version. The other side: a man ahead who goes for the late finish (greed) is open to the counter.
9. **Getting up hurts the hunter** (Fury-Wilder): a man rising from a big KD dents the finisher's confidence (`emo.conf`). Small, a commentary hook either way.
5. **Lean to tire him** (size, item 4 on the roadmap): the hurt man leaning on the hunter costs the hunter gas. One coach's claim, no numbers yet.
