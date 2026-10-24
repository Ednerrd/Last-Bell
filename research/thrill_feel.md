# Thrill of the Fight: how it plays and feels (gameplay, not visuals)

Oct 2026. Question: what makes TotF feel real, and what survives for a watch-sim on a phone with a first-person camera the viewer does not drive.

Tags: [dev] developer's own words, [review] press review, [players] player/forum/YouTube claims, [?] my guess or a thin source.

Naming: TotF 1 = Ian Fitz / Sealost, Steam July 2016 early access, Quest port 2019. TotF 2 = Halfbrick + Ian Fitz, Quest only, multiplayer early access Nov 21 2024, 1.0 with single-player career Nov 19 2025.

## Sources
- UploadVR, TotF2 review ("Between Realism And Fun", 3/5): https://www.uploadvr.com/the-thrill-of-the-fight-2-review/
- GamingTrend, TotF2 review (70/100): https://gamingtrend.com/reviews/the-thrill-of-the-fight-2-review/
- ThumbCulture, TotF2 Quest 3 review: https://www.thumbculture.co.uk/?p=85874
- UploadVR, TotF2 exits early access: https://www.uploadvr.com/the-thrill-of-the-fight-2-exits-early-access-with-singleplayer-campaign/
- UploadVR, TotF2 update 0.2.1: https://www.uploadvr.com/the-thrill-of-the-fight-2-update-new-venue-multiplayer-tweaks/
- UploadVR, TotF2 live spectator event: https://uploadvr.com/the-thrill-of-the-fight-2-turned-vr-boxing-into-a-live-spectator-event
- UploadVR, TotF2 early access launch: https://www.uploadvr.com/the-thrill-of-the-fight-2-multiplayer-out-now-in-early-access-on-quest/
- UploadVR, TotF1 Quest: https://uploadvr.com/thrill-fight-boxing-quest/
- Meta blog, TotF2 launch interview: https://www.meta.com/blog/thrill-of-the-fight-2-launch-meta-quest/
- GamingTrend, TotF2 full release: https://gamingtrend.com/news/thrill-of-the-fight-2-punches-into-full-release/
- The VR Grid, TotF1: https://www.thevrgrid.com/thrill-of-the-fight/
- OldCynic, TotF1 Quest 2: https://oldcynic.com/the-thrill-of-the-fight-review-meta-quest-2
- VR Fitness Insider, TotF1 updates: https://www.vrfitnessinsider.com/new-updates-thrill-fight/ , https://www.vrfitnessinsider.com/thrill-of-the-fight-update-offers-champion-difficulty-mode/ , https://www.vrfitnessinsider.com/thrill-of-the-fight-gets-closer-to-full-release-with-this-comprehensive-update/
- Reality Remake guide: https://www.realityremake.com/articles/the-thrill-of-the-fight-beginners-guide-and-knockout-tips
- Steam guide "Official Guide to TotF" (id 1780809608, since removed from public view, read via cache): https://steamcommunity.com/sharedfiles/filedetails/?id=1780809608
- Steam dev threads (Ian/Sealost): damage model https://steamcommunity.com/app/494150/discussions/0/3272436852832413572/ , punch impact https://steamcommunity.com/app/494150/discussions/0/2549465882918381503/ , moving in ring https://steamcommunity.com/app/494150/discussions/0/1353742967812642948/ , AI beta feedback https://steamcommunity.com/app/494150/discussions/1/1628539187782220763
- Steam TotF2 spectator-app thread (players only): https://steamcommunity.com/app/3279600/discussions/0/603020878754672387
- YouTube captions pulled: Gamertag VR (egawjHjDv78), WeeKnight (e7YZCtNW050). Other captions blocked by YouTube this session.
- Grokipedia page on TotF2: used only as a pointer, it is AI-written and contradicts itself. Not cited for facts below except where marked [?].
- Not reachable: Reddit (fetch blocked), Meta store reviews, Steam news pages. Reddit/Discord dev posts are therefore missing. Steam forum posts by Ian stand in for "dev".

## 1. Hit model

TotF 1
- No health bars. Every punch is judged alone. [dev]
- Force = fist speed x a fixed mass number, times a player multiplier. Hooks on the bag/dummy get a separate hook multiplier. [dev, guide]
- Why the multiplier: real punch speed would be too hard for normal people, a flat boost too easy for fast punchers. So the game watches your hardest swing and scales all punches to it. Auto-adjust: it drops after any landed punch, rises only at the end of a round that had enough punches. [dev]
- Dev wants real-world expectations to carry over with no extra "game" layer. Known flaw he named: the multiplier can drift mid-fight and slow steady punches can be read as max force. [dev, 2017]
- Light hit: solid cyan splash, counts for nothing. Hard hits show blue to yellow to red. [dev, guide]
- Dev's numbers (from memory, Apr 2022, "may be outdated"): effective-hit threshold 2700, dizzy threshold 3200, direct knockdown in one swing 4280 (same for player and every opponent). Chin/Toughness shrinks your damage so thresholds are harder to hit. [dev]
- Once a punch reaches the threshold, ALL of its damage counts toward score and trauma/pain. Trauma/pain build is exponential, "needs to build up quite a bit before it has much of an effect". [dev]
- Weak points (chin, temple, solar plexus/liver, behind the ear): a punch in the right direction on the spot does bonus damage. Dummy shows dots. Straight hit on the chin or a hook to the jaw side can drop a man in one. AI aims for weak points too. [dev, guide]
- Head hits build trauma, body hits build pain. Each makes that area more vulnerable and lengthens the knockdown. [guide]
- Dev's design line: "more highly damaging hits being much more important than just throwing a large number of hits". [dev]
- Round scaling: opponent is easier to hurt and knock down in late rounds from the same effort. Built in on purpose, because players tire. [dev]
- Hits stop counting the moment the bell rings or the man starts to fall. [dev]
- Stamina: none. "No arbitrary stamina system", you get tired when you really get tired. One reviewer gassed himself so he could not throw a proper jab. [dev, guide, review]
- Jan 2018 (update 17): force tied closer to knockdown, less randomness. Earlier versions were hitpoint based. Also an arm-whip exploit (wild flick = huge speed) fixed with mass reduction. [review, dev]
- Jan 2019: AI throws body shots, full-arm block boxes. Dev admits body model is not perfect but "close enough to still feel correct" because most defense is arm blocking. "Snake hip" dodging will not register. [review, dev]

TotF 2 (what changed)
- Same idea (speed and force, hidden numbers) plus a "body effort" score: legs and hip rotation must drive the punch, arm-only flicks score low. Dummy shows force and body effort %. [review, dev promo]
- Reviewers split on whether it works. UploadVR: "doesn't record the effort in my punches properly most of the time", gloves feel like pillows. GamingTrend: punches "often don't connect or register", "damage isn't properly calculated". A player: with 100% effort, the slower, more telegraphed punch hits harder. [review, players]
- Stun mechanic: screen flashes, stunned man deals less and takes more (from an AI-written page, [?]).
- Referees now penalize turning away or keeping the head down (0.2.1). Bot clipping into the player causes false fouls on the player. [review]
- Damage got "a series of balancing updates" in 0.2.1, numbers not published. [review]
- Players call it very inconsistent: chin and solar plexus do most, "punching through" beats fast throws, straights feel weak. [players]

## 2. Opponent AI

TotF 1
- Roster: ~10 CPU boxers, unlock in order, sparring partner to a champion. Names seen: Sparring Partner, Alexei Petrov "Melky" (weak chin, passive, the newbie fight), Ugly Joe Nasato, Duke Bell (higher base power), Lightning Luis, The Thai Spider (reach), The Reverend, The Artist, Mateo Vega "Matty" (fast, slippery, defensive, was the last unlock), Money Maker Edward Price (champion, OldCynic). Halloween novelty bots: zombie, ghost, headless. [review, dev, guide; the style list is thin]
- Per-opponent stats: chin, power, fist speed, dodge speed, block speed, aggression. Styles come from those numbers plus aggression. [dev]
- Round count is per opponent: sparring 1x90s, Joe 3x2m, Reverend/Luis/Spider 3x3m, Artist/Duke 4x3m. [dev]
- AI behaviour: aggression sets how eagerly he closes for hooks/uppercuts, how long his combos run, lunges, how long he presses. After a damaging hit he pauses, backs off or re-guards, more likely the harder the hit. When dizzy: jaw drops, gaze drifts, he retreats and covers. [guide, dev]
- Blocks "where you last landed a forceful hit" and also blocks in anticipation. Switch targets (sides of head, then straight down the middle) to open him. Body shots open the guard. [guide, review]
- Boxers get more aggressive when behind on points, notice uppercut and combo openings more (2018). [review]
- Difficulty: Easy / Normal / Challenger / Champion (opp stats 85% to 115%), later Endurance / Outclassed (one punch can floor you) and Custom (up to 12 rounds, your own stats). [dev, guide]
- Cheap/real, players on TotF1:
  - Real: AI "hits you less but hits flush on weak points". Dev: AI cannot hit harder than you can, but hits hard with nearly every punch it lands. [players, dev]
  - Cheap/gamey: both men guarding and dodging, only attacking sometimes (passive). AI that "relies on you getting physically tired". Predictable timings, a cheesy loop that KOs him, lunges "that would not work in a real fight", long wild combos no real boxer throws. [players, Steam beta thread]
  - Dev fixes: lowered AI's low-end punch force, aggression slider affects more behaviour.

TotF 2
- Marketed as "smart and adaptive", learns your style and changes tactics. [dev/press, Meta blog] Reviewers: AI much harder than TotF1, dodges jabs easily, steps in with flurries. One reviewer briefly doubted it was AI. Another found it easy to win by patience: move, bob, guard, punch on openings. [review]
- Career opponents have different styles, heights and reaches. [review] No detailed roster found.
- Gamertag VR: opponents have no backstory or attitude, "just random avatars". Found one combo (hard rib shot, then hard right) that won every career fight in round 1 after losing the first several. [review]
- Spamming and hook-swinging are rewarded in multiplayer, one reviewer says. Early access had arm-flailers. Spam fixes were a stated 1.0 goal. [review, dev/press]

## 3. Feedback when you hit and get hit

- You hit (TotF1): impact sound that scales with force, sweat particles off the face, controller vibration (dev says it was weak, improved over time), reaction animation scaled to punch strength, a groan on a weak-point hit, smoke puff colored by strength. Opponent bruises and cuts build with damage. Dev rated the feedback "about 7 out of 10". [dev, review, guide]
- Hurt opponent tells: jaw drops, eyes drift, retreats, covers up. Gamertag VR on TotF2: no physical damage model, only a "sad meme filter" face when he is near KO, which is your cue to finish. [guide, review]
- You get hit: an audible "oof". Repeated hits turn the screen black and white on Quest (blur on PC). [review]
- Knockdown: referee counts to 8 (mandatory), 10 is a KO. Time on the floor depends on how big the hit was and on accumulated trauma. 3 knockdowns in a round is a TKO. Hits stop counting once he starts to fall. [guide, dev]
- TotF2 gripe: "unbelievably, there's no referee" you can see, only hear. Players want to see the count. [review]
- Gloves track controllers 1:1 so they do not shake or tumble after a blow (2018). [review]
- TotF2 coach: Coach Berg, 2,000+ voiced lines, corner advice and post-round results. Multiple reviewers say this is the best part: players catch themselves looking over for his approval. [review]
- Crowd moves and reacts to punches. Room-edge flashes during intense exchanges. [review, spectator piece]

## 4. Structure

- TotF1: climb a ladder of 8-10 named fighters in gym then stadium venues. 3 judges, 10-point must system, knockdowns decide a round first, then damage above a threshold. KO/TKO skips the cards. Clinch: lean in, the ref separates you, stalling too long ends the match. [guide]
- Real clock: 3-minute rounds, a real 1-minute rest. A review calls the rest "actual rest time". [review]
- TotF2: training (dummy with force and body-effort readout, sparring bot, coach videos), career (rookie, amateur, year-end world tournament, gold medals, stat training via mini-games between fights, skip a year if you miss the qualifier), ranked and casual multiplayer, global leaderboards, visible scores added (UploadVR: more "game-like" than the original's simulation feel). [review, dev/press]
- Reviewers found career thin: repeat grind, mini-games not fleshed out, trainer not in the ring. Best-of-three rounds format in career. [review]
- Live sport: a staged Quest-3 bout (Misfits champion vs a podcaster) ran at a gaming event with a crowd. Both men were drenched after. A PC spectator app with a "live sports" camera exists/was announced. [review] No detail on its camera work, so I cannot say how good it is.

## 5. Comfort

- No artificial locomotion at all in TotF1. Room scale is required. Steam page: joystick movement not supported, you step for real. [dev, store]
- Ian, 2017, why: built for Vive room scale with controllers held sideways, so no button presses. He considered thumbstick movement for standing play but was unsure. He is "personally sensitive to sliding VR movement", poor versions make him feel bad fast, even good ones wear him down over time. Players on the thread split: some say moving would make many people sick, others cite Onward/Pavlov and want a limited field of view while moving. [dev, players]
- Result: OldCynic played TotF1 seated, FAQ rating "Comfortable". Lists of "games for the motion sick" call it stationary. [review, players]
- TotF2 adds a standing mode with thumbstick movement and thumbstick turn on either hand (0.x/1.0). UploadVR: "not many comfort options to speak of". ThumbCulture: standing planted is "very difficult", room scale strongly preferred because the mechanics assume footwork. [review]
- Opponent stays within your tracking range. Small-space players get a red floor rectangle. The game is designed around about 2 m front to back so both men can be outside range. [dev, review]
- I found no motion-sickness complaint specific to either game in the sources I could reach. That fits: the camera only ever moves when your head moves. I could not read Reddit, so treat this as "not found", not "none". [?]
- The camera never moves on its own, apart from the black/white screen after hits. (TotF2 mixed-reality mode hides the room: safer but "reduced the sense of scale".) [review]

## 6. What players love / complain about

Love
- Feels like a boxing simulator that rewards real technique, not flailing. "Truest simulation of the sport." [review, players]
- It is a workout (TotF1 about 10-15 kcal/min, TotF2 about 110 kcal per 10 min). [review]
- Weak points, dummy practice, hard clean hits mattering more than volume. [dev, players]
- Coach Berg and the corner talk. [review]
- Cheap: TotF1 under $10, TotF2 $20-30. [review]

Complain
- TotF2: punch registration, body effort, inconsistent damage, bot clipping, false fouls, spam and hook swingers in multiplayer, latency, height exploits. Meta store about 3.0/5 over ~10k ratings against TotF1 4.8 and "Overwhelmingly Positive" on Steam. Many say 2 is worse than 1. [review, players, one AI-written page [?]]
- Repetition: one winning combo beats the career (Gamertag VR). Opponents have no personality. [review]
- Needs space. No visible referee. Environments and crowds weak on Quest TotF1. [review]
- TotF1 AI: passive stand-off, predictable, cheesable. [players]

## For a watch-sim POV on a phone

1. Keep the "one punch = one judged event" model. TotF has no health bar: threshold, trauma that builds slowly and then bites, a dizzy state that cuts power, a direct-KD line, 8-count, 3 KDs = TKO. Last Bell already has most of this. Show it, do not hide it.
2. The cues that read on a phone are the cheap ones, so build them: hit sound that scales with force, sweat spray, a clear face change (jaw drops, eyes drift), the man backing off and covering, a groan on a weak-point shot. Copy the dev's list. Skip haptics (or a tiny phone buzz on KDs only).
3. Weak points are the best thing to borrow. Chin, temple, liver shots that drop a man in one punch give the viewer a "he is in trouble" moment without any player control. Pair with the AI that blocks where it was last hit and gets opened by a target switch: a watcher can see that happen and shout it as coach.
4. Player-effort realism dies. Body effort, force multiplier, fatigue-from-your-own-arms, swing form and the dummy are all about the player's body. Do not copy them. The AI's own gas is the stamina. TotF's "no stamina bar" also would not carry: the viewer has no arms to tire, so Last Bell must keep its own stamina cue (breathing, slowing hands, dropped guard).
5. The coach is the player's emotional hook in TotF2 (2,000 lines, results each round, people look to him for approval). That matches our design. Give the corner a voice, a round result line, and let the viewer's POV face the corner between rounds.
6. Every complaint about the AI is a list of things to avoid: passive stand-off, predictable timing, one cheese combo, lunges no boxer would throw, combos too long, no personality. Give each fighter a name, a style, a tell, and a different answer to the same punch. Dev's own fix list (lower low-end power, aggression affecting more behaviour, comeback aggression when behind on points) all transfer.
7. Real clock helps: 3-minute rounds and a true 1-minute rest were praised. For a phone, keep real round structure but let the rest be the coach's screen. Show a visible referee and the count (players wanted it, TotF has none). A ref standing over a KD from the floor POV would be the strongest moment in the whole sim.
8. Comfort rule one: TotF never moves the camera except by your own head. A camera the viewer does not drive breaks that. The dev (a sliding-motion-sensitive player) avoided any smooth movement for years. So treat the POV camera like a locomotion system: slow, no acceleration surprises, no roll.
9. Comfort rule two (my guess, from standard VR practice, [?]): on a phone the risk is lower than VR (small screen, fixed frame, no head tracking), but keep it safe. Keep the horizon level always. Move the camera only slowly and on smooth curves, never snap-cut. Use head bob only a little and only at footstep rate. Never shake the whole frame for a hit: use a short zoom or a flash of black/white instead, as TotF does. Give an option to switch back to the side view.
10. Black-and-white and blur after heavy hits is a proven "I am hurt" cue that costs no motion. A KD from the loser's POV (camera drops, blur, ref's count, getting up) is the sequence TotF players ask for and TotF does not show. Do it with a fade and a slow camera drop, no tumble.
11. The POV question: in TotF the player is one of the two men, which is the whole feel. In Last Bell the viewer is the coach, so a first-person view from the boxer's eyes means "you are the fighter you are not controlling". That could feel odd or great. Safest: boxer's-eye cam as an option for key moments (KD, the corner, the last 10 seconds), not the whole fight. [?]
12. Watching works as a sport. TotF2 was staged live with a crowd, and the game ships a PC spectator camera. The hard part for a watch camera is that VR bouts read well from outside because bodies move honestly. Our sim already has that: honest bodies and a side view. Keep side view as the default.
