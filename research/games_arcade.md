# Arcade and other boxing games: what Last Bell can use

Date: Oct 17 2026.

Sources caveat: web search summaries only, no page fetches. Search returned thin results on AI internals for most of these games. Items marked (search) came from a search summary or review. Items marked (memory) are general knowledge of the game, not verified this session. Items marked (fan) are forum or fan accounts. Nothing here is developer documentation. Skipped as asked: Fight Night, Undisputed / eSports Boxing Club, Thrill of the Fight.

## Punch-Out!! (NES 1987, Wii 2009)

- Every boxer has tells: a gesture before certain punches (head wobble before a jab, a squat before an uppercut). Some are visual, some are how he reacts to your hits. (search)
- Each boxer has a fixed set of patterns the player must memorize. Win = learn the pattern, then timing and patience. (search)
- Early boxers have an obvious hole. Glass Joe guards one spot, and if you hit the open spot three times he switches guard. His taunt is a free opening. (search, fan guide)
- Mid boxers hide the hole. Von Kaiser needs you to stand back and watch. King Hippo's weakness is not obvious. (search)
- The big move is also the weakness. Bald Bull's charge can be punished the moment it starts. (search)
- Stars: hit him at the right moment (just before a strong punch, or when he grins) and you earn a star for a big punch. Get hit and you lose them. This pays you for reading the tell. (search)
- Little Mac has hearts. Blocking and getting hit drain them, dodging gives them back, empty hearts means exhausted and slow. (search)
- Fan report: Mr. Sandman repeats the exact same punch order in rounds 1 and 2, then switches to a new fixed order after each knockdown. (fan, one user, not official) Useful idea: the pattern set changes when he is hurt.
- Later bouts and rematches speed up and add variants of the same patterns (memory). Hits to specific body parts at specific moments make him dizzy or drop him (memory).

## Ready 2 Rumble Boxing (1999) and Round 2

- Arcade, big-headed cartoon fighters with a taunt/momentum meter: land hard shots or taunt to fill letters, then a Rumble flurry with infinite stamina. (search)
- Taunting costs you: once you start you are open. Risk for showing off. (search)
- Reviewers: CPU blocks every time against the flurry, so the big mode is less of a swing than sold. (search)
- Very hard, and you must bob and weave and choose when to back away. But no parry and little reward for weaving. (search)
- Some boxers are just plain better than others regardless of skill. Roster not balanced. (search)
- Each boxer has a flavor and move set and a silly entrance (memory). Fighters feel different by animation and move list more than by AI.
- Midway claimed Round 2 AI was "smarter, harder, faster". Publisher claim only. (search)

## Knockout Kings 2000 / 2001 / 2002

- 2001 added a corner man who gives advice between rounds, and a cutman you use to bring down swelling and treat cuts. (search)
- Faces show the beating, with detailed facial damage. Collision detection praised by one review, criticized by another. (search)
- GameCritics: most matches are an endurance test where one man slowly wears the other down. Style, personality and brutality barely matter. (search) That is the failure Last Bell wants to avoid.
- Licensed real fighters, each with ratings, but reviews say they play alike. (search, reviewer opinion)
- Metacritic 81 for 2001, mixed reviews overall. (search)
- Knockout Kings had a bar that you build up, plus a "Fight Fury"-like power state in some entries (memory, unverified).

## Creed: Rise to Glory (VR, 2018)

- Enemy AI is fairly simple. The main difference between boxers is how much damage they can take and how hard they hit. (search)
- Later opponents block and dodge more often. (search)
- Reviewers: fights become pattern recognition and timing. Even the hardest boxers have tells. (search)
- Little attack variety. Difficulty is mostly HP and punch power, which many reviewers called a weak way to scale. (search)
- Campaign is about two hours. Human PvP praised because humans do not play like the AI. (search)
- Punch readability is high because VR gives real depth and a fast arm swing (memory).

## Big Rumble Boxing: Creed Champions (2021)

- Reviewers: stiff, robotic fighters, long animations, no bob and weave. (search)
- Fighters feel identical because styles barely differ, so tactics never change between opponents. (search)
- Some power moves are abusable against the AI (the Drago backward triangle move was named). (search) A cheese case: one strong move that the AI never answers.
- Still fun in short bursts, knockouts feel satisfying. (search)
- Mechanic: special/rumble-style power moves on a meter, with cartoon KO effects (memory).

## Victorious Boxers / Hajime no Ippo games

- PS2 Ippo's Road to Glory mixes sim and arcade, fights follow the manga fights. Jabs, hooks, uppercuts on buttons. (search)
- Wii Revolution: motion controls. Reviewers say the control scheme matters more than the story, and one swing mode did things you did not intend. (search)
- Metacritic-style average for the Wii game is about 58. (search)
- Reviewers said it leans too hard on the source material. (search)
- Style tied to character: Ippo is the infighter with a signature, Takamura the brawler, Miyata the counter-jabber, and each has special blows like the Dempsey Roll and a hurt/"guts" state (memory, not found in search). Strong reference for traits and signature moves.
- Not found: any detail on the AI itself.

## Boxing Star (mobile)

- Casual, humorous characters, counter-punch focus. Story mode vs AI, then online. (search, store listings)
- Monetization complaints: gear and membership added later. (search)
- Little real review on AI. Treat as low value. Counter-based combat on a phone is the one relevant point: counters are the main skill. (search)

## Real Boxing 2 (and Creed edition)

- Complaints are mostly progression and grind, not AI. (search)
- One review: the AI is cheap at times and that is frustrating. Comeback after two bad rounds feels good. (search)
- Switch version: your level-up is slow while opponents improve fast, so a difficulty spike. (search, one review)
- Nintendo Life 4/10: fights feel boring and a chore. (search)
- Fights use swipe punches, tap to block, and tilt/swipe to dodge, with a special "ultimate" move (memory).

## Others found

- Don King Presents: Prizefighter (2008, Venom Games, also made Rocky and Rocky Legends): reviewers liked the career and presentation and said the basic fight mechanics were wrong. (search)
- Rocky Legends: arcade, needs blocking and weaving and varied punches. Reviews said it was nearly the same as the game before it. (search)
- Style and AI differences in these were not covered by anything found.

## Steal for Last Bell

1. Planted flaw per easy fighter, Punch-Out style: one readable tell plus one punishable habit (guard flips only after 3 hits to the same spot; a telegraphed big move that can be countered). Glass Joe is the model.
2. Hide the flaw by tier: easy fighters have an obvious hole, mid fighters need watching, top fighters have none you can name. Von Kaiser to King Hippo ramp.
3. The big move is the weakness. A fighter's signature shot (charge, haymaker) should carry a clear cost when read and countered.
4. Tell-as-fact for readability: a one-beat cue before special punches (shoulder dip, squat, head wobble), shown in the render, so the coach and the brain can read it. A hit during the tell pays extra (the star idea) and becomes a hook for the brain's reads.
5. Pattern memory vs anti-cheese: Punch-Out AI is pure pattern and gets solved. Last Bell's brain should keep pattern bands but vary them, and the cheese tests (jabSpam, oneTwo) already cover the Big Rumble complaint of one move that beats the AI.
6. Pattern shift when hurt: new punch order after a knockdown (Sandman, fan report). Use it as a "hurt changes his mix" trait, and a fake-hurt could swap the mix on purpose.
7. Fakes: reward baiting. Ready 2 Rumble taunting is a risk for showing off, so a sold fake hurt or a taunt should cost him if the other man reads it and pay him if the other man falls for it.
8. Trait set, not just stat set: Ippo-style signatures (infighter with a signature blow, counter-jabber, brawler) plus glass jaw and slow starter. Creed and Big Rumble were panned for fighters feeling the same, and Knockout Kings for style not mattering.
9. Do not scale difficulty by HP and punch power alone. Creed Rise to Glory was criticized for it. Scale by reads, defense frequency and mistakes (opponents block and dodge more, as the campaign went on).
10. Eyes: Knockout Kings 2001 cutman and swelling show damage on the face. Show it on the render and let the brain read it, so the hunter reads the swollen eye and the hurt man protects it.
11. Exhaustion as a tell: Punch-Out hearts drain, empty = slow and open. Show gas on screen and let the brain read the other man's tired tells (slow hands, dropped guard).
12. Cheap-AI guard: Real Boxing 2 and Ready 2 Rumble reviewers hated an AI that is cheap or blocks everything. Cap how often the brain can punish or block perfectly, and keep a human-readable reason behind each defense.
