# Boxing Life: "Genius Boxing Advice" playlist (Ed, Oct 21)

Ed's playlist: https://youtube.com/playlist?list=PLMCIO3_ynz3gGmXYyF6HulGw88dU9caqx (5 comps of coach and fighter interviews cut over fight footage, ~6.5 h). Our own words; raw captions stay in `tools/yt/raw/` (gitignored).

| # | Video | Length | Status |
|---|---|---|---|
| 1 | Genius Boxing Advice + Examples, 30 min (`iFwtyDqW8eo`) | 32 min | notes below |
| 2 | ... 40 min, Part 2 (`YEDO2xdMgjg`) | 41 min | YouTube bot wall (429), retry |
| 3 | Boxing IQ Masterclass, 1 h (`lIbPgk0emDo`) | 61 min | retry |
| 4 | 1 Hour ... Pt. 4 (`x7QpK_B8qnA`) | 66 min | retry |
| 5 | Master Edition (`a73enqvVRak`) | 3 h 20 | retry (likely overlaps 1-4) |

Resume: `python3 tools/yt/yt.py get YEDO2xdMgjg lIbPgk0emDo x7QpK_B8qnA a73enqvVRak` (skips what's pulled).

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
