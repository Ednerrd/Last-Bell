# Boxing Life: "Genius Boxing Advice" playlist (Ed, Oct 21)

Ed's playlist: https://youtube.com/playlist?list=PLMCIO3_ynz3gGmXYyF6HulGw88dU9caqx (5 comps of coach and fighter interviews cut over fight footage, ~6.5 h). Our own words; raw captions stay in `tools/yt/raw/` (gitignored).

| # | Video | Length | Status |
|---|---|---|---|
| 1 | Genius Boxing Advice + Examples, 30 min (`iFwtyDqW8eo`) | 32 min | notes below |
| 2 | ... 40 min, Part 2 (`YEDO2xdMgjg`) | 41 min | notes below |
| 3 | Boxing IQ Masterclass, 1 h (`lIbPgk0emDo`) | 61 min | bot wall, not pulled (likely inside 5) |
| 4 | 1 Hour ... Pt. 4 (`x7QpK_B8qnA`) | 66 min | bot wall, not pulled (likely inside 5) |
| 5 | Master Edition (`a73enqvVRak`) | 3 h 20 | notes below (opens with all of V1 and V2, then new) |

Resume 3 and 4 if wanted: `python3 tools/yt/yt.py get lIbPgk0emDo x7QpK_B8qnA` (YouTube 429s after a pull or two: space them minutes apart).

## V1. 30 minutes (Teddy Atlas-style interviews: Ward, Hopkins, Mayweather, Tyson's trainer, a Cuban-school coach)

- **The KO is the one he doesn't see.** Size doesn't make a puncher; hand speed and the shoulder snap do. The classic setup: keep his mind on the body, the head shot after is the one that drops him (one to the body that rattles, then one to the head). Tyson's power came from staying in range, on top of the man, so shots land unseen.
- **Step to the side of the punch.** Step left to throw the left hook, right for the right hook: leverage and balance come from the position. Hook to the body, then the head (or reverse), only from position.
- **Hopkins' liver KO:** jab to set up, lean left, hook under the liver; heard the air go out, then a left hook up top. Body shots land with a **delayed reaction** (a shot, a beat, then down; Canelo clip).
- **The jab (Ward): set-up and escape hatch.** It sets up distance, leverage, timing; it keeps a man off you **when you're hurt**; you can win rounds with it alone. **Fencing:** the lead hand touches and feels his guard, and he can't tell whether it's a parry, a feint or the start of a punch, so the right comes over the top.
- **The "prevent" (Ward's name for the Philly shell):** shoulder up, lead hand controls. Use it **to rest in a round**, or **vs a big strong aggressive man in the first rounds**: just jab and control, like Holmes did. The host's pushback: as a full style it cuts your offense. Ward: it's a mode, not a style.
- **The jab to the stomach** (Ward says he took it from Mayweather): long range, so no short shots come back; steals his air, breaks him slowly, mostly in the early rounds. After 3-4 down there: **fake low, hook up top**, or fake low and jab high, then back down. "Discouraging."
- **Punch loose, close the fist at impact.** A tense punch is slower and shows on the face first (a tell).
- **Mayweather's pocket:** pick the jab with the open rear hand, catch the hook on the shoulder side, roll the right and come back with the right. Closer is worse for the man in front of him. "Always come in behind the jab."
- **Killer instinct (Durán):** hurt with the right, then follow him all the way to the ropes, no space given.
- **Hopkins' jab war:** you jab once, he jabs twice. Jabbing *with* you while blocking: you either stop jabbing or it's a fight of who jabs more and who brings punches behind it. Never cut in 50+ fights, rarely down: defense first, "hit and don't get hit".
- **Ready to get hit:** kids who fear being hit show it at once (they go into a "scare mode" when tagged). Ward visualizes the bad spots (on the ropes being pounded, hurt, **taking a knee**). A smart fighter **takes a knee to recover** rather than get stopped; a fight comes in waves.
- **The counter-puncher's read** (probably Mayweather): men who lean over the front foot when they punch are easy to counter; men who stay centred can roll back. **Read legs, hips, shoulders, never the eyes** ("the eyes can fool you"). He sees the whole ring (ref, ropes). When something is coming, **step out to where you can't be hit**: he has to come into your range, and you're there first. The jab is a set-up for his counter; "every positive has a negative": coming in square takes the jab harder than coming in turned, moving left-right is harder to hit.
- **Feet first (Ward):** the jab starts from the feet, not the hand; trained feet move him where he wants and keep him fresh. A man who hasn't drilled feet **gets tired** once he's made to move faster than he wants while getting hit. Ward's drills: track the man down behind the jab, let the hands go, then get out of the way when he comes back. Mitts in place are "pretty" and don't transfer; mitts that make you think and react do.
- **Formless / all-terrain (Ward):** prepared for a boxer, then he slips inside, pushes them back with short shots, then **takes them back to deep water** (outside), lets them think about it, comes again, until they break. Comfortable on the ropes, in the centre, backing up, going forward: no zone that makes him nervous.

### For Last Bell (not built)
1. **The prevent mode:** a shell switch as a *mode*, not a guard: on when he wants to rest a round, or the first rounds vs a strong pressure man (jab and control). Ties to pace (`mind_pace.md`) and the AI corner's "Slow down"; Philly guard already exists, this is a temporary posture any guard can drop into.
2. **Body to head, unseen:** after several body shots, the next head shot is "unseen" more often (his mind is downstairs). Overlaps `mind_traps.md` body banking and `arena.md` level changes; the delayed body reaction is in `corners_video.md` batch 11.
3. **Jab to the stomach, early:** a long-range body jab as a round 1-3 tool for a boxer vs a pressure man, then fake low/hit high. Check what `pickCombo` does with the body jab before tuning.
4. **The hurt man's jab:** a hurt boxer with a good jab keeps the hunter out with it (one more answer in the hurt brain besides hold/cover/run).
5. **Jab back twice:** a counter to a jabber: answer every jab with a double. Fits `jab.md`'s "countered jabs make him jab less".
6. **Lean = counterable:** a man who over-commits (lean past the front foot) gets countered more; a balanced one rolls back. A natural flaw for the easy level (f3 `BR.flaw`) or a gas effect late.
7. **Take a knee:** a smart (high IQ) hurt man takes a knee on purpose to get the count and recover, instead of eating the finish. Was "too proud to take a knee" in `corners_video.md` batch 10: two sides of the same choice.
8. **Deep water rhythm (Ward):** inside burst, then back out to let him think, repeat. A World-class style switch inside a round, not only between rounds.

## V2. 40 minutes, Part 2 (Calzaghe, Archie Moore, a slap-jab old-timer, a counter-puncher, Mayweather-school feints)

- **Drill "something's coming back":** never a mindless 1-2-3; end every combination ready for the return (the pause after a combo is when you get hit). No free shots: you can be rough without giving them.
- **Prepare for his best weapon:** last opponent had a big right and no hook, so the whole camp was getting the guard up for the right on time. One threat, one answer.
- **Moore's "step and fetch it":** lean back just before his lead lands, then meet him as he falls forward off the miss. The pull counter.
- **Outside = longevity:** take less punishment, beat inside men on the outside, but be able to fight inside when they close the gap. Power comes later with "man strength".
- **Kill his jab early:** counter it the moment it comes (slip inside, come over) so he loses confidence in it. A lazy jab gets countered.
- **Calzaghe (southpaw):** always move to his right, away from the orthodox right hand; lead hand out to parry the jab and come over with the left. Favorites: feint the body, left hand over the top; volume of quick slappy shots so the man covers and gets flustered, then load the big shots into the openings; switch head and body.
- **Rhythm:** constant motion in front of him (head off the centre line, feet working, jab measuring) so he can't guess; you find your rhythm once you let a few go.
- **Good head movement:** don't aim at the head; learn his slip pattern, throw where he'll be (quarterback to the receiver's spot). Ducker: punch the chest. Slips left on a punch: put the punch there.
- **When to uppercut:** not vs an upright jabber at range (you reach and leave yourself open). Use it when he bobs and weaves into it, or inside when he leans on you. Time him a couple of rounds first.
- **The slap jab:** loose and open, a range finder that annoys; once he's "drunk", close the fist and "mug" him.
- **Vs a man who always covers:** pull his guard down and hit; or straight to the body, then the head, let him get used to it, then the body again.
- **Micky Ward's liver hook (Gatti I, R9):** tap the head, his hand comes up, the hook goes in under the elbow.
- **Cutting off the ring (vs Ali):** step to the side, then step in; side, in; never straight at him. That walks him into the corner.
- **Feints (Mayweather school):** the "grasshopper": the lead hand dances to hold his eyes while the feet creep in. Feint **only men who react**; one who doesn't bite, just go. Fake to the body, right hand up top.
- **Counter-punching:** it discourages: get countered on a punch and you think twice before throwing it again. It makes him show his hand first; you watch early which punch he loves (the big right every opening) and block-counter it. Two kinds of fighters: the "war" man and the "don't touch me" man; train each his way.

## V5. Master Edition (3 h 20): the new parts

**Old trainers and the long view**
- **Dundee:** no wars in the gym; sparring is practice, longevity first.
- **Futch on McCallum:** make the other man do most of the moving; making a punch miss without the hands or a step back means perfect position. Slip, ride, roll; arms and shoulders to take body shots.
- **Conditioning:** what you do tired decides it; fighters who are good for half a fight fall apart late (body or mental stamina). **Overtraining** is the other side (Hearns vs Leonard I: came in 2 lb under, weak down the stretch).
- **Punch from the side:** where you can hit him and he can't hit you, throw the bomb with full intent.
- **Hopkins on age:** athleticism slows for everyone; what's learned stays (jab twice, feint, get behind the jab, cover, tie up when rocked). A man who learned to fight can beat people at 50.
- **"11 ways to make a lead miss"**; the best: pull his hand down and hit him on the way in.
- **Punchers (an old manager):** born, not made. They KO everyone at 4-6 rounds, then meet a 10-round man who takes it, and **deflate**: never learned the trade, no stamina. That's where upsets come from. Most punchers can't take a punch: too tense ("a board, not a rubber band").
- **The hook off the ropes is defense:** vs a man coming in behind a high guard, the hook behind his right hand is to get him off you, then step out.

**Feints, patterns and the jab**
- **Robert Garcia:** shoulder high on the jab/cross blocks the counter. Feints: touch, touch, touch, then stop touching and hit. **Land the right hard once, then only show it:** he flinches to the right and the hook lands; then back down the middle with the right.
- **Mayweather:** "mental, not physical". He does the same thing until you catch on, then switches, then goes back to the first thing. The jab to the pit of the stomach was his best punch vs Corrales.
- **Crawford-school jab:** touch range is mine if his swing comes up short. Jab the shoulders, hands, body, chest; a mover gets the chest. Feint the jab over and over, then the hook or right off the same look.
- **The power jab (back-foot boxer):** when you run out of room, drive off the back foot and make him give up real estate or eat it. **The tempo jab:** a flicking "hot stove" jab, gloves and arms too, so he can never set up; preventing his setup makes him err. Come in off the line, never straight. Bivol's lead hand on the gloves: pressure without committing.
- **Jab the counter-puncher everywhere** (shoulders, chest, belly) to keep him on defense instead of setting up his counter.

**Defense details**
- **Roach:** balance first, never cross the feet, stance not too narrow (no lateral base) and not square. Knees bent so the slip is one move. Slip choice by distance: close, slip inside; outside, slip, counter, and step out.
- **The long lead hand (on Pacquiao-Algieri):** Algieri's lead pointed at the floor let Pacquiao step in; the tall man must **keep the lead pointed at him wherever he goes**: layers of defense he has to get through. Same as the long guard in `size.md` V4.
- **Square + elbows out = body shots.** On a body shot, drop the elbow onto it; don't step back. "Catch and shoot": answer at once.
- **The uppercut comes from the blind spot.** Don't lean over the front knee; stay in position and you see it.
- **Calm when hit:** a fighter who gets excited when tagged lifts his head and hands, and gets hit again. Relaxed = anticipation.

**Body work (Hatton)**
- Don't throw at what isn't open (waste of gas). Tap the head till the elbows lift, then the body; if you keep drilling the middle he brings the elbows in, so touch and go round the side. Change the angle to find the gap.
- A Mexican coach vs southpaws: lead foot outside; after slipping his jab, everyone expects the uppercut or right; **a hook to the liver** instead lands "like it's going home" because he lifts the elbows. **Once inside, throw 4-5**: getting in is the hard part, don't waste it.
- **Smoke screen:** touch with the right shoulder to load the left; he's watching the right.

**Styles and plans**
- **Steward, tall vs short:** have the tall man be **physical** (push, pull, make him back up: Hearns-Duran, Lewis-Tyson). When the short man comes forward, half a step back, then press again. Short men fall apart; they don't expect it.
- **Holyfield vs Tyson (Steward):** from an angle, every time Tyson hooked he got hit with four, and Holyfield didn't back up.
- **Speed "ahead of himself":** fast men who never sit down lose power (Bradley); speed plus sitting down adds it.
- **The Russian rule:** vs a fighter, box; vs a boxer, fight. Use timing against speed; move against a stronger man (Leonard vs Hagler: move all 12, stop for a combination, move again).
- **Early rounds:** everyone is dangerous in round 1; keep him outside for three, then step in at 4 once he's slowed.
- **One-dimensional fighters:** the pressure man pushed back doesn't know what to do; the man sent to his "wrong" side can't react; the man whose best shot won't land has no second one. Spar what you don't like.
- **Fighting vs boxing (a Crawford stablemate):** "fighting" = emotional, a contest of who's stronger, and he gets hit; "boxing" = present, hit and not get hit. Self-study (watch your own sparring) as Crawford does.
- **Body language:** a tired man who shows it (falling over his feet, holding, hands on knees, leaning on the ropes) gives the other man energy and makes the judges go with the fresher-looking one. Cubans and Russians never break form, don't even sit between rounds.
- **Discipline when hunting (Hopkins / Nazim):** chin tucked even landing the big right; never overreact as hunter or hunted. Complacency (Calzaghe's father): champions stop fighting like challengers.

### For Last Bell (V2 + V5, not built; numbers keep the V1 list going)
9. **Countered punch, thrown less:** generalize `jab.md` to every punch: his right hand gets countered, his right hand rate drops for a while. Brain opponent memory; cheap.
10. **Learn his favorite, then block-counter it:** early rounds read the punch he loves, then sit on it. Opponent memory `mem` already counts punches; check if it feeds the counter choice.
11. **Pattern, then break (Mayweather / R. Garcia):** repeat one look until he adapts, switch, go back. Land one right, then show it so he flinches into the hook. Fits World class and the f2 bait family.
12. **Feint only men who bite:** the brain tracks how often he reacts to feints and stops feinting a man who doesn't. Fits `mind_vision.md` feints vs the read.
13. **Uppercut gate:** uppercuts mostly vs a man ducking or inside, rarely vs an upright jabber at range (that's a hole). Check `pickCombo` before touching it.
14. **Tap high, lift the elbows, go low (Hatton / Ward):** the guard *reacts* to head taps; body opens. Pairs with `clamp` (f1b) from the other side.
15. **Cut the ring like a linebacker:** move parallel, never follow (toprank batch 2 noted the engine has no circling habit to read).
16. **Steward's tall man:** physical early (push, make the short man back up), half step back when he comes. A tall-man plan for `size.md` section C.
17. **Round 1-3 caution:** everyone's dangerous early; a skilled man stays outside, steps in from 4. A round-clock rule (`mind_pace.md`).
18. **The deflating puncher:** a puncher whose man doesn't go and who's gassing loses heart and output. Brain `emo`.
19. **Body language to the judges:** a visibly gassed man (holding, falling in) lifts the other man and costs him a bit on the cards. `judgeScore` taste weights.
20. **Power jab off the ropes, tempo jab to stop his setup:** two jab jobs for the back-foot boxer: regain space, and break the pressure man's setup. Overlaps the outboxer redesign in ROADMAP (jab + footwork).
21. **Calm or excited when hit:** a low-level man who gets tagged lifts his head and eats the next one more often; Pro and up stay calm. Level tables.
22. **Don't waste the entry:** once inside, the presser throws 4-5, not 1-2.
23. **Box a fighter, fight a boxer:** a plain rule for the AI corner's plan (`aiStrategy`).
24. **One-dimensional comfort zones:** each style has a place it's lost in (pressure man going back, a man sent to his wrong side); World class has none (Ward, all-terrain).
