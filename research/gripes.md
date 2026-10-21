# What players hate in boxing games (Oct 21)

Source: Ed's paste, a Boxing Fanatico video from the Undisputed 2 creator event (the creator used to work at SCI, the trip was paid, nobody got to play it) plus two r/undisputedboxing threads (U2 hype, then the EA Fight Night revival tweet). Fan talk, not data. It backs up the Undisputed complaints already in `combat_research.md` §2. Last Bell is a watch sim with no netcode and no player thumbs, so half of this doesn't apply: the table says which half does.

## The gripes, loudest first

| # | Gripe (their words) | Where it comes from | Last Bell |
|---|---|---|---|
| 1 | **Cheese / spam meta**: "spammers", "magical machine-gun hooks", "push glitches with no penalty", "a team unable to balance it" | Undisputed online, the top-voted complaint | **Ours to own.** A one-trick man has to lose to a smart one: `tests/cheese.js` (jabSpam, haymaker, shell, runner, clinch...). Watch for one punch getting picked over and over in the audit. |
| 2 | **Stiff, locked in animations**: "you can't punch while moving", "move then punch, start stop", "wait for the animation to play out" | Undisputed 1. U2's whole pitch is fixing this | Partly ours: feet stop during a punch now. "Footwork during punches" is ROADMAP item 6 (in 3D). |
| 3 | **Hit detection**: "point blank punches missing", "let's just get basic hit detection down first" | Undisputed | Ours: a shot that looks like it lands has to land. `resolve()` at 60% of the punch: check that misses look like misses (`tools/measure/`). |
| 4 | **The weave looks bad**: "bobble head", "stiff, slow"; FNC's fast, smooth weave is the gold standard | Undisputed vs FNC | Render: the duck/slip should be quick and read clearly from the side view. |
| 5 | **KOs don't feel big**: "all I want are GOOD ragdoll KOs"; "it has to be a hybrid so they don't look arcadey and janky"; people missed the pre-release ragdolls | Undisputed | Render: the KD fall is the payoff of a whole fight. Hybrid = a set fall with some loose limbs, not a full ragdoll. |
| 6 | **Boring career**: "boring fights, spammers, boring career mode", "scratched an itch for 3 months" | Undisputed | Career is cut (git history), back in ROADMAP item 6. Fights that feel the same are the bigger version of this: the drama metrics (`tests/drama.js`) are the guard. |
| 7 | **Stamina doesn't show**: "LOW ON STAMINA BUT STILL MOVING", WeMod "unlimited stamina" | Undisputed | Ours: a gassed man has to look and move gassed (flat feet, slower hands). The STAM block does the numbers; check that the render shows it. |
| 8 | **No clinch / no inside game**: "no clinch whatsoever", "clinches better have some kinda inside game" | Undisputed, FN revival thread | We have a clinch. Inside game: `research/skillr.md` (the clinch in 3 stages). |
| 9 | Desync, rubber banding, quit glitches, no chat | Undisputed online | N/A: no online. |
| 10 | Hype distrust: "propaganda blitz", "pay influencers to say it's revolutionary", "I'm not falling for this again" | Both threads | Lesson for Ed: show real fights, not promises. The lab link is the pitch. |

## What they praised (worth keeping)
- Fight Night (Round 3, Champion): "each game was revered", "the greatest boxing game ever". Notes in `fnc.md`.
- U2 pitch (not proven, nobody played it): punch, slip and weave while moving, fast smooth weave, natural hand motion, MetaHuman faces, rollback netcode.
- One fan's guess: SCI kept signing big names (Pacquiao) while the game struggled, so they sold the fighters a better sequel. Roster sells.

## Check list for Last Bell
1. Cheese: run `cheese.js` after any brain change; no one trick should win much over 50%, and it should land less late than early.
2. Repeats: watch a fight (or 20) for the same punch over and over.
3. Contact: freeze-frame landed vs missed shots, no "landed from a foot away".
4. Gassed look: a round-11 man next to a round-1 man, side by side.
5. KD fall: does it look like a payoff or a glitch?
