# Last Bell: the vision

## In Ed's words (Oct 2026)
> So the main point of the game, right, is you're like the coach of the fighter. It's like an auto battle or auto boxer where you create a fighter. Of course, road to glory type thing to become champion or multiple belts, whatever you're going to be. And during, like, and it's going to be the same similar footprint as Fight Night Champion, where in a sense, like, you have training camp, you can spar, you could hit the bag, whatever, do your training, and then when you go into the fight, Your, your fighter will fight for you, but you get to call out, like, the adjustments during the fight. In the corner, you get to amp him up, make him change the game plan up if he's beating you in a certain way, and adjust to fighting, and then pretty much come up top, because you're trying to, like, make a auto boxing that's more realistic, in a sense. And different every time. Every fighter is different. Everyone has something different on the table, but your fighter is going to be more so your own.

## The loop
Create your fighter → camp (train, spar, prepare for *this* opponent) → fight night (he fights; you coach: shouts during the round, adjustments and motivation in the corner) → results → rankings, belts, legends → next camp.

**The player is the coach.** Every system should answer one question: *what decision does the coach make here, and can he see whether it worked?*

## Where each part stands (Oct 2026)
| Part | Built | Missing |
|---|---|---|
| Create a fighter | Styles, stance, guard, special styles unlocked from legends | A fighter that becomes *yours* over a career: personality, habits, bond with you |
| Road to glory | Rankings, belts, unification, weight classes, legends, resumes, scouting | Story between fights: rivals, rematches, callouts |
| Camp | Gym tier, 2 focus slots, intensity, sparring partners, sports science, style and stance learning | Preparing for the specific opponent (sparring partners who copy his style, a game plan you drill) |
| In-fight calls | 6 shouts, scored against the moment; spamming one makes him tune out | A readable "what's going wrong" so the coach knows which call to make |
| Corner | Pick a round plan (7), trainer advice, cutman report | Amp him up or calm him down; choose what the cutman works on |
| Different every time | Style matchups, random form on the night, legends | One standout trait per fighter (glass jaw, slow starter, dangerous when hurt, fades late) |
| Realism | CompuBox-matched output and connect %, judging, cuts, doctor | 3D presentation (`proto/PLAN.md`) |

## Ideas for the missing parts (not built; each needs sims before and after)
- **Corner talk:** "Fire him up" (more heart and aggression next round, at the cost of defense). "Calm him down" (after a knockdown or when he's rattled). "Tell him the truth" (when he's ahead or behind on the cards).
- **Cutman priority:** choose what he works on between rounds (the cut, the swelling, or breathing/stamina). Round 4 earned corner points from how the round went.
- **Trust / bond:** good calls that work build trust, so he follows your shouts better. Bad calls and losses wear it down. A veteran who has been with you for 10 fights listens; a new one doesn't yet.
- **Mentality:** confidence that rises with wins and drops after knockouts. Composure under pressure. Frustration that leads to fouls (Undisputed's meters).
- **Traits:** 1–2 standout traits per fighter, visible once scouted (the Thrill of the Fight lesson). Your fighter earns or loses traits from his career (a knockout loss can leave a softer chin; going 12 rounds builds "late gas").
- **Opponent-specific camp:** spar partners who copy his style give an edge against that style. Film study reveals a habit you can call during the fight ("he drops the right after the jab").
- **Live read:** a short line during the round when something keeps happening ("he's landing the right hand over your jab"), so the coach has something to react to.

## Ed's follow-up (Oct 2026): talk to him, and the bond
> I mean, obviously, it's fighter to code connection where, um, and it's like, it's kind of, I don't know if I'm going to do it this way, but it's just an idea where the fighter, if you don't want to work with him or he's getting like, eh, then you get to move on and create another fighter. You don't have multiple, I mean, you can have multiple fighters in your roster, but that's a kind of a bit more complex thing. But what you said before, know what's going wrong. That's, that's the only way you'll know is actually watching the, them fight together where he can be like he's landing too many jabs or or maybe you, have, you tell it through, not AI, but through a text. Be like, you're throwing, maybe that's the way to do it is telling the fighter through text or through like voice or whatever is that you're doing this wrong, this wrong, and then AI can read that and be like, hey, and adjust to what you said instead of like text lines.

### How it could work (idea, not built)
- **Talk to your fighter.** In the corner (and later during the round), the coach types or speaks in his own words. Voice works through the phone keyboard's mic button. The published page asks Claude through the artifact `sample` capability (available on Ed's account; the viewer's own usage pays; the first call asks consent; `modelTier: 'quick'`). Claude gets:
  - the coach's words;
  - the fight facts (round stats, what keeps happening, the cards, cuts);
  - the fighter's personality and bond.

  It returns JSON: knob changes, chosen **only from the existing vocabulary** (STRATS/SHOUTS mods, each capped), plus the fighter's reply in his own voice.
- **Bounded on purpose.** Words can't buy power. "Just knock him out" only maps to the capped `ko`-type mods. The result is still scored by `shoutFit` against the moment: a good read helps, a bad read costs, the same as the buttons. The buttons stay as the fast option and as the fallback when `sample` is unavailable or offline (a simple keyword matcher).
- **Corner first.** Claude's answer takes seconds, which is fine during the break. During the round it is a stretch goal.
- **Knowing what's wrong.** The engine keeps a "pattern" log the coach can see and Claude can read: which punch keeps landing on you and off what (e.g. the right hand over your jab), time on the ropes, hands dropping when tired, who wins the exchanges. You mainly read it by watching, so the 3D must show it.
- **The bond.** Good calls that work raise trust, so he follows you more closely and his replies get warmer. Ignored or bad calls and losses lower it. Low trust: he argues back, half-follows, and in the end can **leave you** ("I'm going with another trainer"). You can also let him go and start a new fighter. A stable of several fighters is a later, bigger idea.
