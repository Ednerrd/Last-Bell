# Fight Night Champion (EA, 2011) + Round 3 (2006): research notes (Oct 2026)

Ed asked for "FNC 3, just for any info". Covers Fight Night Champion (FNC) and Fight Night Round 3 (FNR3). Short Fight Night notes already live in `combat_research.md` §1. Search summaries only: page fetches were blocked in this environment, so treat the details as secondhand.

## Fight Night Champion (2011)
- **Full Spectrum Punch Control:** 1:1 stick-to-animation. Any flick angle throws a punch from that angle, so a punch is a continuous range, not a fixed set of moves.
- **Physics damage:** every hit is scored on **power, angle, how flush the contact was, and where it landed**. Each part of the face and body takes damage separately. Cuts come out of the physics contact, so one can open on the first punch of a fight or not at all for a couple of fights. Swelling can shut **both eyes**, which can mean a TKO depending on how lenient the ref is.
- **One-punch KOs** were new to the series in FNC (earlier games didn't have them).
- **Stamina, four hidden pools:** each arm, the abs (body) and the legs, all feeding one visible bar. Throwing too much with one hand, or taking too many hits to one area, drains it faster.
- **Two-tier stamina:** current stamina drains and refills fast (short bursts). Max stamina drains slowly and only comes back between rounds, and how much comes back depends on how hard he worked in the round.
- **Blocking:** one button, auto-aims at the incoming punch. A **timed block** ("flick" just before contact) has a higher block chance; holding it blocks more shots but some leak through. **Reflexes and Blocking Strength wear down the longer he sits behind the guard**, so turtling loses.
- **Counters:** punches thrown while the other guy is recovering from a miss or a blocked shot do more damage. Lean, weave, step and block all set them up.
- **AI:** reviewers praised each opponent having his own personality and traits.
- **Tuner Sets:** EA could change stamina, punch power, counter windows, ratings, XP growth, AI and Legacy logic online, without a patch.
- **Legacy mode:** XP spent on stats, plus new paid training at famous gyms that each specialise in an area.
- **Visual damage:** dynamic bruising and swelling, muscle flex, fat jiggle and body ripple on a secondary rig, KO replays from several angles.

## Fight Night Round 3 (2006)
- **Total Punch Control:** stick gestures map to punch families (flick = jab, quarter circle = hook, half circle = uppercut).
- **Impact punches:** high risk, high reward, and they leave you open to a counter if you miss.
  - **Haymaker:** harder to land than before, but more powerful.
  - **Flash KO punch:** one shot can put him in KO danger.
  - **Stun punch:** stuns at once and opens a short first-person window to finish with a combo or a haymaker.
- **Parry:** a well-timed parry leaves the attacker open for a few seconds.
- **Clinching and pacing** matter. Reviewers: "it pays to understand boxing".

## Where we already match
- Two-tier stamina: `stam` / `stamMax`, and body shots cut `stamMax` (~1142).
- Guard wears down under pressure and comes back when it stops (`F.gi`, ~749).
- Flash knockdowns off clean counters (`TUNE.flash`, ~1169).
- Counter window (`counterWin`), `TUNE` = our tuner set, cuts and doctor (`CUT`), camp training.

## Worth stealing (mapped to COMBAT.md)
1. **Contact quality from angle and flushness (step 9).** Emit it in the `hit`/`miss` events (hand, lane, quality, miss type) so the 3D render can draw it, like FNC shows where a shot lands. This is FNC's whole damage model. Score each landed punch clean / glancing / smothered / blocked from distance, angle and the defender's guard and slip. Give each its own damage, look and hit-stop.
2. **Arm fatigue (step 10/11).** A per-arm pool next to `stam`: a jab-heavy round tires the lead arm, the jab gets slower and the hand drops. Good for the AI ("his left is tired, he stopped jabbing") and for corner talk.
3. **Block wear plus timed blocks (step 9).** Reflexes and block strength already sort of wear via `gi`. Add a timed-block roll: a block that fires early (`react()` reading the shot) holds much better than a guard that was just sitting there, so high-guard turtling bleeds.
4. **Missed impact punch = punished (step 8/9).** We have wild/loaded punches. Make a whiffed loaded shot open a longer `counterWin` for the other guy, with a readable over-rotation.
5. **Stun-window drama (render).** No first-person view, but when a man is stunned: a short zoom plus the crowd rising, and the finisher looks for the big one. That's our version of the FNR3 stun moment.
6. **Max stamina back by work rate.** Between rounds, `stamMax` recovers less after a high-output round. Small, realistic, and it rewards pacing (fits step 8, rhythm).
7. **Swollen eye (later, with cuts).** Swelling on one side raises the hit chance from that side and can bring a doctor stoppage. It's the FNC eye-shut TKO.
8. **Fighter personality AI (step 10).** Already planned with the DNA cards. FNC's praise was exactly this.

## Not for us
- Stick gesture controls (we're a watch sim, the coach doesn't punch).
- 3D physics collision (2D procedural; we fake contact in `resolve()`).

Sources: [Wikipedia: FNC](https://en.wikipedia.org/wiki/Fight_Night_Champion), [GamingBolt: Brian Hayes interview](https://gamingbolt.com/fight-night-champion-an-exclusive-interview-with-brian-hayes-lead-gameplay-designer), [Game Informer: FNC stamina](https://www.gameinformer.com/b/news/archive/2011/01/12/fnc-stamina.aspx), [OSFTW: FNC gameplay/Legacy blog](https://www.osftw.com/news/456128/fight-night-champion-blog-gameplay-legacy), [OSFTW: FNC controls tutorial](https://www.osftw.com/news/467143/fight-night-champion-blog-controls-tutorial), [The Register review](https://www.theregister.com/2011/03/10/games_review_fight_night_champion/?page=2), [Game Informer preview](https://gameinformer.com/games/fight_night_champion/b/xbox360/archive/2011/02/23/a-dramatic-finish-in-a-fight-to-the-top.aspx), [ESPN: FNR4 physics interview](https://africa.espn.com/espn/thelife/videogames/news/story?id=3968745), [GameRevolution FNC review](https://www.gamerevolution.com/review/50336-fight-night-champion-review), [Gameswelt FNR3](https://www.gameswelt.de/fight-night-round-3/test/voll-auf-die-12-2063/3), [MobyGames FNR3](https://www.mobygames.com/game/24001/), [SportsGamersOnline: Fight Night revival](https://www.sportsgamersonline.com/games/ea-set-to-revive-fight-night/).
