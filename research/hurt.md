# Surviving hurt (YouTube): notes for the hurt brain

Source: YouTube clips pulled with `tools/yt/yt.py` (`research/CLIPS_WANTED.md` item 3). Our own notes in our own words; raw transcripts are not kept. Auto-captions garble names ("Mekong" / "make on" = Amir Khan): fixed here where sure.
Read with `research/mind_finish.md` section 2 (the options, recovery time) and the brain's hurt answers (`survStart` / `survUpd`, `SURV` in `brain/brain.js`: shell, run, fire, clinch, freeze, steady, bluff, bait).

# Batch 1 (Oct 20)

Pulled: 7 tried, 4 with captions, 3 useful (Loma-Linares was a fan recap: "got up quickly, survived the round, then went to the body"). Bot-walled (no captions, retry later): Bazooka Joe "strategies to survive being hurt or rocked" (`ve1t5-8YFic`), fightTIPS "recover after a big hit" (`3mzP2YM1YfQ`), "fighters that didn't know how to stay down" (`rJyHh3pxGLs`), Dorian Boxing Coach "How Inoue recovered from the knockdown: 4 decisions" (`xPWqIFuZTPg`, the best lead), Ben Davison on Fury's round 12 (`rL9BcK4vDU0`), Atlas on why Fury got up (`XVsaB4_Z42c`), Fury on round 12 (`TWP6rAPUxDs`).

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

## For Last Bell (ideas, not built)
1. **Close, not far, while the legs are gone** (Regal): `run` (range 24) is the textbook mistake for a man with bad legs; smother/lean (`clinch`, `shell` close) is the coach's answer. Run could stay for a man whose legs still work (`tr.legs`, footwork), and the far `wary` plan could start once the hurt clears (Inoue). Check `finish.js` hurt answers before touching it.
2. **Hurt magnifies damage** (Regal, and the light punch on top of Khan's head): the engine's hurt is a low head meter (`hurtNow`: stun or head under 30%), so he is already closer to the floor; nothing scales a punch up while he trades. Open question for the balance pass (stops 30-35%): a hurt man who fires pays a little more per shot taken.
3. **Temper:** a hurt man who taunts / fires back is the low-composure `fire` pick; a commentary line ("he's seeing red") and maybe a corner call ("calm down, hold") for the AI corner.
4. **Carry-over hurt:** the legs stay heavy into the next round (Gamboa R6), the corner can revive him (R7). Today the break clears most of it (`mind_finish.md` 4b item 6 has a residue idea). The hunter missing it is a level thing (the eyes).
5. **Lean to tire him** (size, item 4 on the roadmap): the hurt man leaning on the hunter costs the hunter gas. One coach's claim, no numbers yet.
