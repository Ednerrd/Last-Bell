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

# Batch 2 (Oct 20): Cotto-Margarito I and II (pressure vs a mover, both ways)
Fight I (2008, Top Rank PPV booth) and fight II (2011, HBO: Lampley, Kellerman, Steward, with **both corners mic'd**). The rematch is the same matchup with the lessons learned, so the pair is a before/after of pressure fighting.

## 4. Cotto-Margarito I: the pressure man wins late
- **Rounds 1-6, Cotto.** He moves laterally, double jabs, and catches Margarito *coming in*. Margarito leans forward and ducks in, which throws away his own height and reach, and the shorter man's uppercuts land on the leaning head. "Zero adjustments in five rounds." Cotto moving **to his left** sets up his left hook to the body; Margarito wants to push him the other way and doesn't.
- **The booth's key line:** when Margarito lands, he catches Cotto *moving* (away, less on it); when Cotto lands, he catches Margarito *coming in or static* (full on it). That's the difference in damage.
- **Stepping straight back is the danger:** "he can't just step backwards, he has to step laterally", that's where the long puncher catches you.
- **Body work early pays later.** Round 2's body shots "slowed Cotto down, made him tuck his hands in".
- **Margarito follows instead of cutting** in the middle rounds: "he needs to take a drastic step to his right and force Cotto back a different direction."
- **Round 7, the turn:** Margarito lets it all hang out, 130 thrown, 48 landed (outlands Cotto 48-23), uppercuts on the inside. "The idea of waiting for Margarito has run its course." Cotto's nose bleeds, he's breathing through his mouth.
- **After the turn:** Cotto's movement changes "from setting him up to escaping him: the getaway car". He keeps his right hand at his chin (the hook that hurt him), so Margarito works over the top. Sits on the second rope, drops his hands for the first time. Margarito "never flinches, keeps walking through you, and psychologically that's a great edge."
- **The cards:** close rounds go to the man pressing; the man backing up has to *dominate* to get them ("ring generalship" when he shows the presser up). Margarito was up two points on two cards, even on one.
- **The end, round 11:** Cotto takes a knee twice, his uncle (his trainer) waves it off.
- Fouls along the way: headbutts (one bloodies Cotto's nose), a low-blow warning, belt-line shots.

## 5. Cotto-Margarito II: the mover wins with the fix
- **Cotto's plan:** move side to side, change direction, stay off the ropes (4 minutes before he touches them: "very important"), punch and move away. And **when he comes in, lock him up and push him back**: the shorter man's leverage breaks the pressure man's forward momentum (Mosley did it too). "A brilliant tactic." Cotto's corner: "Turn him. Don't stand still. Middle of the ring."
- **Margarito's corner, round after round (our ring-cutting lesson in one voice):** "Lateral, side to side. Don't walk in straight." "You're following him. Cut him off. Turn him." "Move off to your right, block him off, get behind him." "Start at the bottom: body and uppercuts." "Pressure. Risk a little."
- **Steward on why it failed:** "Cotto circles to his left *all the time*. All Margarito has to do is take a step to his right and he's got him cut off. He doesn't do it." The corner says it; the fighter doesn't do it.
- **The eye:** Cotto targets Margarito's right eye (damaged by Pacquiao), and the jab opens it in round 3. Closed for three rounds; Margarito, leading with the right hand, "couldn't see where Cotto was". The doctor stops it after 10 (no vision, no peripheral vision). Margarito's corner, at that moment: "It was our best round!" (He *was* finally landing and Cotto was starting to wilt.) Steward: in a normal fight with no history on the eye, they probably let him go on.
- **Ref Steve Smoger:** known for letting fights go, "non-intrusive". He talks to Cotto for a punch after the bell.
- **Kellerman: can you win running away?** Steward: he isn't running, he's landing the effective shots.
- **Punching on the way back is an arm punch**, less on it.
- **Numbers:** Cotto 37-43% connect, 51% of power shots; Margarito 22-23%, throwing far more (through 6: Cotto 134/333, Margarito 102/450). Margarito's jab is slow and lazy, a range-finder.

## Engine check, batch 2 (Oct 20; code read, no engine changes)
- **Cutting the ring: built** (batch 4 of `skillr.md`). This fight shows the real problem isn't the geometry: it's *reading a habit*. In the engine **nobody has a circling habit**: the brain's direction flips at random (8% a decision, more on the ropes, `brain.js` ~1291), and the cutter leads the man's current velocity. So "he always circles left, step right" can't happen yet: no habit to read, no read of one. Idea: a man's preferred side (a trait: most fighters favor one, a predictable one is a flaw), and the cutter/brain notices it over the rounds (opponent memory) and steps across it. Fits the traits pass and the weak-side idea (`skillr.md` #18).
- **Caught coming in hits harder; caught moving away less: partly built.** `caught` (mid-punch) x1.3 and the counter; walking-in momentum only doubles *body* KDs. Getting hit while moving away doesn't take anything off, and punching while moving back isn't weaker. Idea: momentum on both ends (the man coming in eats more, the man going away eats and throws less). Check against the style grid before tuning (this would help the mover).
- **Stepping straight back is dangerous: built-ish.** The pull is a fixed impulse; the escape picks lanes (`escDir`). No penalty for a straight retreat vs a lateral one. Pairs with the line above.
- **Body work makes him tuck the hands: built** (f1b: a hurt body clamps the elbows, `clampOf`, `Look.elbows`).
- **Lock him up and push him back:** the clinch exists, the push doesn't. Idea for the clinch rework: the stronger/shorter man leans the pressure fighter back on the break, resetting him to the center.
- **The turn (round 7) and "never flinches":** the hunt and the gas exist; "his best doesn't hurt me" is the `emo` idea (`ring.md` #1). The mover going from "setting traps" to "the getaway car" = the brain's `survive` mode. Built.
- **Covering the side that got hurt** (right hand stuck at the chin): the cover exists for a bad eye (`coverEye`), not for a punch that hurt him. Small idea.
- **The judges reward the presser in close rounds: built** (`JUDGES` taste weights include aggression; check it matches "the man backing up must dominate").
- **Targeting a bad eye, the doctor stop: built** (`target()`, `TKO (eye)`, `blindTo`: he can't see punches on that side). The doctor ignores the fight's flow (fine, real).
- **Corner calls that the fighter doesn't follow:** the AI corner gives a plan and the brain may follow it or not (`ACT.talk`, `planVerdict`). Built.
- **Punch after the bell, headbutts, low blows:** not built (`ring.md` #5).
- **Pressure = volume, low connect (22% vs 40%):** matches our swarmer shape. Fine.

## What's new from batch 2 (each one an engine check first)
6. **A circling habit** (a preferred side), and the cutter reads it and steps across it. The swarmer's real tool vs the mover, and a flaw for the traits pass ("circles one way").
7. **Momentum on both ends:** caught coming in eats more, caught going away eats less, punches on the way back lighter. Watch the style grid (it helps movers).
8. **Lock up and push back:** the clinch break resets the pressure man (clinch rework).
9. **Cover the side that got hurt** (hand stuck high after a hook hurt him: the body and the other side open).
