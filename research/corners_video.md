# Corners from video: batch 1 (Oct 19)

Source: one compilation, "greatest corner moments" (https://www.youtube.com/watch?v=lh54VURUX4c). Ed pasted the auto-transcript; it is not kept. Notes in our own words, with only a few short phrases quoted.

This adds to `research/corners.md` (26 corners, patterns, "For Last Bell" rules 1-20; on branch `claude/clever-planck-urj1i4` until it merges). Moorer-Holyfield is already there. Everything below is new.

**Caveat:** this is a highlight reel, so it only shows corners whose call worked. Don't read "need a KO, got a KO" as the usual result. The names marked (my ID) are my best match from the transcript's misspelled names. Check them before using a name in the game.

## The corners
1. **Nazim Richardson, Mosley-Margarito (2009).** A plan built to unfold over the fight:
   - Early: go to the body, "this guy ain't used to getting it back at the body." Body work now so "no gas in the car" late.
   - Then: the jab, then fast combos, then "swim without getting wet": hit, then slide out to the angle or behind the jab before he answers.
   - Mosley stopped him. Body early, cash in late.
2. **Nazim Richardson, Mayweather-Mosley (2010), before R11.**
   - Mosley was down on the cards. His hands had slowed and he was waiting for the perfect spot.
   - The order: stop waiting, move the hands, step over and come back.
   - Then he made Mosley **say the plan back to him**. That was a hidden stop check: if Mosley couldn't repeat it, Nazim was going to stop the fight. He could, so it went on.
3. **Virgil Hunter, Brandon Gonzales vs Oosthuizen (2013) (my ID).**
   - An unranked underdog vs a top-5 man. Hunter was calm the whole night and fit his talk to the fighter.
   - He repeated one confidence line ("he's ready to be beaten") plus one fix: don't throw one and let him get away.
   - The fighter piled up rounds and still got a draw. Calm corner, good result, robbed cards.
4. **Enzo Calzaghe, Calzaghe-Hopkins (2008).**
   - Calzaghe was down early. Enzo told him he needed a knockdown, which turned him offensive.
   - Hopkins's corner believed they were ahead and stayed careful.
   - Calzaghe won by about a round. That's a second "ahead, so coast" corner that lost (after Fury-Usyk I in `corners.md`).
5. **Freddie Roach, Toney-Jirov (2003), before R12 (my ID).**
   - An honest score: he told Toney he needed a knockdown, and "don't let him hustle you."
   - Toney dropped him in the last 20 seconds.
6. **Emanuel Steward, Lewis-Tyson (2002).**
   - Lewis was well ahead and Tyson was hurt, but Lewis wasn't finishing.
   - Steward was furious: you have a beaten man in front of you, let your hands go.
   - Lewis KO'd him in R8. The finish call on a hurt man, from a fresh fighter, worked.
7. **Randall Bailey vs Mike Jones (2012) (my ID).**
   - Bailey was behind and doing nothing. The head trainer gave up, and the **cutman** took over and screamed at him to do something big.
   - Two big shots, two knockdowns, title. A one-punch power puncher down big has a real "one shot" path.
8. **Chavez-Taylor (1990), R12.** The corner told him straight: you need a KO. He got it with seconds left.
9. **Whitaker-Hurtado (1997), late.**
   - Down on the cards, with a size disadvantage, and not a puncher. The corner said he needed a KO.
   - He landed one clean shot and finished it in R11.
   - This one goes against `corners.md` rule 6 ("no realistic KO, so say win the round").
10. **Miura-Uchiyama (2013), flavor (my ID).** After a big knockdown, the wrong man walked to the other guy's corner and sat on his stool. Both camps laughed.

## What's new for Last Bell
- **Stop check by repeat-back (Nazim).** This is better than `corners.md`'s "how you feel?" idea:
  - A hurt man is asked to say the plan back. His hurt level decides whether he can.
  - If he fails, the corner stops it.
  - Mostly invisible, but it can give a great line: "Say it back to me."
- **"Waiting for the perfect shot" is a real failure.** Output drops and the hands slow. The fix is volume, not power. This fits a counter man who goes passive. The corner call is "move the hands."
- **A plan across rounds.** Body early to empty the tank, cash in late (Nazim). This matches `mind_combos`/body work. The AI corner could hold a 2-step plan, not just one call per break.
- **Corner personality fits the fighter.** Calm and repetitive (Hunter) vs fire (Atlas, Steward, the Bailey cutman). Both work. A mismatch could cost follow-through. A second voice taking over (Bailey's cutman) is the "two voices" case where it helped.
- **"Need a KO" late: keep a real chance.**
  - `corners.md` says to tell a man who can't KO him to win the round. These four (Toney, Chavez, Whitaker, Bailey) show the KO call landing.
  - Rule: a power puncher, or a man whose opponent is tired or hurt, gets the KO call. Others get "win the round", with a small KO chance left in.
  - Highlight bias: most KO calls fail.
- **Coasting while ahead loses again (Hopkins).** This backs `corners.md` rule 7: a misread "we're up" makes the fighter coast.
- **Finish call (Steward-Lewis).** Ahead, fresh, the other man hurt: an angry finish call works. Matches rule 5's gas gate.
