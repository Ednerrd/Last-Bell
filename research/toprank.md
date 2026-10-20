# Top Rank (YouTube): notes for the brain, the corners and the refs

Source: Top Rank's YouTube channel (full fights, highlight reels, post-fight interviews). Our own notes in our own words; raw transcripts are not kept. Ed pastes the transcripts. Auto-captions garble names ("Anyway" = Inoue, "Gotti" = Gatti, "Tony Tubbs" = James Toney): fixed here.
Claude's shortlist (Oct 20): Porter's father on the towel + what Crawford said after, Loma begging Commey's corner, "Times We Saw There Are Levels in Boxing", Cotto-Margarito 1, Pacquiao-Algieri, Teofimo-Loma.

# Batch 1 (Oct 20)

## 1. "Times We Saw There Are Levels in Boxing" (booth calls, a reel)
What a level gap looks like, fight by fight:
- **Beterbiev-Smith Jr.:** "caught Smith coming in", off balance, a knockdown. Then clubbing shots that "get around the guard", the uppercut sneaking in, the man crumbling into the ropes. Round two, done.
- **Crawford-Indongo:** the other man "a little tight" (tense). A right hand to the body on the back hand, a knockdown; then a body shot ends it.
- **Inoue-Fulton:** Fulton "so wide, really hard to get in and out", a high work rate early, but he "gets himself out of position" trying to start his own offense. Inoue "never stops hunting for the knockout". A huge right, then he chases him down. Fulton grabs at the ropes, backs into the corner.
- **Pacquiao-De La Hoya:** the smaller man's speed *and* power. De La Hoya can't get off the ropes, legs gone, "when do you see Oscar stand back and take stuff like this". Stopped after the 8th (his corner).
- **Mayweather-Corrales:** speed and blinding punches; Corrales "befuddled, confused, frustrated", "his eyes drop". Down five times (left hooks), one punch landing **behind the head while he was on a knee**. His corner stopped it mid-round: "no way he can win at this point".
- **Roy Jones-Toney:** both fake ("decoy game"), Jones does the little fake-out first, Toney copies it, and Jones's jump-in hook catches him mid-fake. Jones "suckered him into it". A push-down that's ruled a knockdown is argued (off balance or hurt, "a little of both"). Toney pinned in his own corner. The booth on the ref (Mills Lane-era style): "getting in the way too much, let them fight".
- **Haney-Kambosos:** Kambosos switches stance "to get different looks" but in the wrong range: off balance, eats shots. He "comes in headfirst", trips over Haney's feet, never throws a body shot. Haney keeps landing one-twos and the right over the top.
- **Toney-Barkley:** Barkley hurt seconds in, "still swinging from his heels", wild, misses by a lot. Both eyes nearly swollen shut, lost every round: **the doctor stops it**, Barkley pleads, his corner agrees.
- **Shakur-Valdez:** "Why not risk getting hit trying to get your offense off?" Shakur times the **left uppercut as Valdez came straight in** (he'd been "looking to time that a few times in recent rounds"), a knockdown. Then body, straight back, Valdez "hopelessly chases".
- **Loma-Rigondeaux:** Rigo stuck in his defensive posture, "nothing he can do besides hold" (holding behind the neck), sneaks a shot "on what was assumed to be a break". Loma "turns right around him". Rigo's corner looks at the tape between rounds; **he quits on his stool** after six.
- **Mayweather-Gatti:** "you block two left hands and you're happy, then he nails you down the middle with a right". Gatti loads up, Mayweather "knew", hits him with three. **"If the other guy is quicker than you and makes you pay when you make a mistake, you get gun shy."** Left eye almost shut; "the corner has to step in at some point". The corner stops it after six.

## 2. Porter-Crawford: Kenny Porter on throwing in the towel
- Shawn: "we never had a conversation about it, an unspoken understanding: if he sees what he needs to see, he does what he did." He didn't expect it, felt he could go on, but admits **"he was catching me too clean, I think that's what my dad saw"**; his timing was off, Crawford never let him find his rhythm.
- Kenny's reasons, in his words: Shawn didn't prepare the way he wanted (a fighter at a certain level "believes he knows what he's doing" and stops taking in information), so he was "at a deficit, fighting this guy blindfolded". Andre Ward asked whether it was about what happened or **what he saw could happen**: what could happen. Shawn was hurt, still coming forward, "he can't defend himself like he should, and I had to protect him." "It's an easy decision for me."
- Context: two knockdowns, the cards close until then.

## 3. Loma-Commey: the winner talks to the other corner
- Loma pointing at Commey's corner mid-round: "you want me to give him more, or do you want to stop this?" Then he goes and does it.
- Commey holds to survive, legs barely there, "so prideful", "too tough for your own good". Keeps firing back while being beaten down.
- Commey's corner (Andre Rozier's instruction earlier): back him up, keep digging to the body.

## Engine check, batch 1 (Oct 20; code read, no engine changes)
- **The towel: built, but thin.** `nextRound` (`index.html` ~2928): between rounds only, if he's worn (`headMax < 26`) and behind on the cards, a coin flip says RTD. No corner judgment (trainer, how clean he's getting hit, knockdowns this fight, his preparation), never mid-round (Corrales and Porter were stopped mid-fight), and no button for the coach. Fixes `research/ring.md`, which said the corner never throws it.
- **The doctor stop for eyes: built** (`TKO (eye)`, swelling). Barkley's two shut eyes fit.
- **Quitting on the stool (Rigondeaux):** the same RTD path; no "he doesn't want it any more" (morale) reason. Ties to the `emo` idea in `ring.md` #1 ("he's taken my best").
- **Caught coming in (Beterbiev, Shakur's uppercut on Valdez): built** (`caught` x1.3, `counterWin`). **Timing it over a few rounds:** the brain learns his habits (opponent memory, `COUNTER_BOOK`); whether it learns *when he comes in straight* specifically is a check for later.
- **Gun shy vs the quicker man (Gatti): partly.** `punchVal` cuts the value of a punch that keeps getting countered (`mem.mine[p].c`), so he throws it less. A global "he's quicker than me, I go shy" is not built (`skillr.md` #6 asks the same).
- **Hit on a knee / behind the head (Mayweather-Corrales), a shot on the break (Rigondeaux): not built.** Same list as `ring.md` #5 (more fouls).
- **Switching stance in the wrong range (Kambosos):** the switch-hitter special swaps freely; no cost for switching up close. Small idea.
- **Comes in headfirst (Kambosos): built** as an f3 flaw (the swarmer's lunge), not yet in the game for real fighters (the traits pass).
- **Tense ("a little tight", Indongo):** not built; color (same as `skillr.md` #11).
- **Never stops hunting (Inoue): built** (`tr.killer`).
- **Talking to the other corner (Loma):** color for commentary.

## What's new from batch 1 (each one an engine check first)
1. **A real towel.** The corner (AI or the coach's button) stops it on what could happen: how clean he's getting hit, knockdowns this fight, his legs, his trainer's nerve; mid-round as well as on the stool. Replaces the coin flip. Watch the stop rate (30–35% target, Ed).
2. **Quitting on the stool** when he's lost hope (the `emo` side of `ring.md` #1).
3. **Gun shy vs the quicker man:** output drops when he keeps getting beaten to the punch.
4. **Switching stance up close costs balance.**
5. More fouls (hit on a knee, on the break): already `ring.md` #5.
