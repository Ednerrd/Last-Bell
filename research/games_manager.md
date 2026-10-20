# Boxing and fight manager games: what Last Bell can steal

Date: Oct 17 2026

Sources caveat: from web search summaries only (store pages, reviews, forum posts). No page was fetched in full. Anything marked (2nd) is secondhand or from my own memory, not confirmed. Football Manager engine internals are mostly fan guesses, Sports Interactive does not publish them. Prizefighters 1, Boxing Promoter games and Boxing Champs gave little or nothing, so they are thin below.

## Title Bout Championship Boxing (and Title Bout 2)
- Roots: tabletop game by the Trunzo brothers in the late 1970s, then Avalon Hill, then a PC/Mac sim, now sold by PISD. Title Bout 2 is a separate board game (Kickstarter 2017).
- Sim: a stat-driven engine fed by large real or custom fighter databases (reports say 3600 to 8000+ fighters). Dice-style at heart, with ratings per fighter. (2nd on the exact internals.)
- Coach: very limited. You pick a basic strategy, and cutmen and trainers act between rounds. The AI can run those for you.
- Realism: reviewers praise rare events. Stoppages from accidental headbutts, cuts, odd endings. Trainers, corner men and referees are modeled.
- Fun: it is a "tabletop on a computer" for boxing nerds. Reviewers say it is not for everyone.
- Fun: players love re-running historic matchups and making their own fighters. The story comes from the fighter, not the fight animation.
- Hated or limited: almost no direct interaction. You watch text and results.

## World Championship Boxing Manager 1 and 2 (1990 Spectrum, then Steam)
- 1990 original: stable of up to five boxers against 17 computer managers. Magazine scores ranged 60 to 91 percent.
- Zzap! complaint: you never seem to influence results, and the fights are dull because commentary is text with no visual. This is the exact trap for a watch-only game.
- Modern Steam versions rate Mixed (28 and 88 reviews, about 68 percent for the sequel).
- Modern fight loop: pick one of four strategies per round, from balanced to ultra cautious. A round is about 20 seconds and can be sped up. Between rounds you repair damage or restore energy.
- Reviewer says that barring a KO, that is all you do for 12 rounds. Little involvement.
- Another complaint: you do not know your opponent until right before the bout, so you cannot prepare.
- Sequel sold a "quicker loop" as its fix, so pace of the whole career was a pain point too.
- Original was meant to be about impressing judges. Judging is part of the pitch.

## Punch Club 1 and 2
- Sim: fully automated, no control of punches. Reviews say it is RNG with your stats shifting the odds. Some say fights feel decided in the first seconds.
- Your lever is pre-fight loadout: pick a set of skills from unlocked ones, like deck building.
- Growth: train three stats at gym equipment. Stats decay if you stop training, so you peak for the fight date. Focus on one of three styles to unlock advanced moves. Strength is high damage, low accuracy, high energy use. Speed is accuracy and evasion.
- Praise: charm, 80s and 90s references, a strong sense of a life being built.
- Hated: grind, a badly balanced skill tree, fights that are not worth watching.
- Punch Club 2: combat is hard to read and gives too little info on core mechanics. Energy management often decides fights, and defense drains energy faster than offense.
- Punch Club 2: some players say stats feel irrelevant, a 25 percent stat enemy can win. Others say moveset matters more than stats. Either way the link from stat to result is opaque.
- Punch Club 2: final boss spikes and long chapters felt like padding.

## Prizefighters 1 and 2 (mobile)
- Mostly a real-time touch boxing game, not a manager. You dodge, bob, weave and punch with taps. Prizefighters 2 adds more boxing mechanics and stamina.
- Prizefighters 2 has three career modes: boxer, Boxing Gym Manager, Be the Promoter. The manager and promoter modes are behind the premium unlock.
- Praise (TouchArcade): more strategy, kept simple controls. Retro look and sound design.
- Hated: too many buttons on a phone ("more buttons than screen"), monetization.
- Lesson for a phone-first sim: every on-screen control must earn its space. Last Bell's watch-only design avoids this.
- Prizefighters 1 and Boxing Promoter games: no useful findings from my searches.

## Other Steam boxing and MMA managers
- Boxing School 2 (80s setting, hire boxers, climb the ranks): described in a press release only, no reviews found. Boxing Club Manager: near-empty player base.
- Mouthpiece Boxing Manager (unreleased): corner choices between rounds like step it up, box and cover, go to the body, throw in the towel. A towel call is a nice dramatic lever.
- Pixel-art MMA gym sim (unreleased, planned Mar 2027): change tactics, rally morale, treat damage, offer advice between rounds.
- MMA Manager (mobile, Bit By Bit): 3.7 stars from 63 ratings. A recent update added pre-fight plans and between-round corner tactics. Options include no change, more volume, stay defensive, hunt takedowns, target body, all-out finish, conserve energy, full strategy change. Effects decay 50 percent per round.
- That decay is a clean idea: a call fades, so you must keep coaching.
- The dev pitch is "a huge number of possible combinations of actions", meaning an agent-ish sim. No reviews to confirm how it feels.
- Finding: the trend in new managers is to add corner calls between rounds, because pure watching was too passive.

## Football Manager (the watch-and-coach benchmark)
- Match is simulated in real time with player agents using attributes, then shown as 2D or 3D. Key moments are flagged on a timeline you can rewind (added around FM09). (2nd for some details.)
- Team talks (before, half time, full time) and touchline shouts set mood and morale, not tactics. Players react differently by personality. Guides note you cannot give tactical orders by shouting, only affect mind state.
- Tactical changes are separate and mid-match: team instructions, mentality, roles. The shouts layer is the "feel" layer.
- Reception: team talks were praised as long overdue (FM12). A reviewer said it is debatable how much players listen, so effect can feel invisible. Players want proof it worked.
- Hidden attributes (traits like composure, big matches, consistency) show up only via scouting as pros and cons. Fans want these to actually matter in the engine, and mods push that.
- The assistant manager and coaches can pick shouts for you. It is optional automation, which fits Last Bell's AI corner.
- Praise: stories. Late winners, comebacks, rivalries. Complaint: sometimes the engine seems rigged or random, and lack of explanation feels unfair.
- Mobile FM uses a lighter engine with fewer inputs. Simple is acceptable on a phone if the key choices stay.

## Steal for Last Bell
1. Corner calls decay: borrow MMA Manager's 50 percent fade per round, so a call is a nudge that needs renewing, not a switch.
2. Shouts act on mood, not moves: like FM, a yell lifts or steadies a fighter, and fighters of different temperaments react differently. Shows the same shout landing differently on different men.
3. Always show the reaction: after a shout or corner call, one short line of proof ("he heard you, jab is up") to fix the FM complaint that you cannot tell it worked.
4. Key-moment timeline: flag knockdowns, cuts, swing rounds on a scrub bar so replays and highlights are one tap. Fits the replay already in the game.
5. Simple view by default, More on tap: show four things (score, gas, damage, plan). The expanded view shows connect %, judge tastes, ref dials, the brain's current read. Punch Club 2 shows what happens when core mechanics are hidden with no way to dig.
6. Traits as scouting hints, not numbers: FM style pros and cons. "Fades late", "drops hands when tired", "ref's friend", revealed more the more fights you have seen of him. Hidden traits must really drive the brain, or players will notice.
7. Preview the opponent before the fight: WCBM2 was blasted for not knowing the opponent until the bell. Give a scouting card so corner prep has something to chew on.
8. A towel call and a ref/doctor check as drama levers: Mouthpiece's throw in the towel. Costs you the result, saves the fighter, and links to the career long-term health.
9. Make the brain's smarts visible: a small thought line from the fighter ("he is hunting the body", "he found the jab, keep going"). Zzap! said text-only fights are dull. The brain's adaptation is Last Bell's selling point, so name it when it happens.
10. Peak for fight night: Punch Club decays unused stats, so training timing matters. Later career idea: camp readiness and ring rust, tied to the existing camp step.
11. Comebacks need setup and payoff: the crowd and commentary should flag the swing round ("he is in trouble") so the comeback reads as a story, FM style late winner. Keep the ~11 percent target.
12. Stat-to-result clarity in the end card: after each fight, one line saying why it went that way (plan worked, gas gave out, judge favored the jab). Avoids the Punch Club 2 "stats feel irrelevant" complaint and teaches the player to coach.
