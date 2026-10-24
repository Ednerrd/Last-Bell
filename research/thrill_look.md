# Thrill of the Fight: what it looks like from the eyes

Oct 2026. Visual evidence only, for the Last Bell first-person camera idea. Gameplay feel is covered elsewhere.

Tags: no tag = I saw it in a screenshot. [text] = from a review, forum post or caption. [?] = my guess.

## Sources

Screenshots I downloaded and looked at (Steam store media, 1920x1080, in `scratchpad/totf/`, not in the repo):
- TotF 1, Steam app 494150: https://store.steampowered.com/app/494150/ (5 shots: gym, KD, two fight shots, ring with ref)
- TotF 2, Steam app 4884540: https://store.steampowered.com/app/4884540/ (9 shots: 4 fight/ring, 1 coach, 4 menus/gym)
- TotF 2 Spectator app (separate Steam app 3279600) exists. I only saw its name, no media.

Text sources:
- UploadVR TotF 2 review: https://www.uploadvr.com/the-thrill-of-the-fight-2-review/
- UploadVR early access / Ian Fitz interview: https://www.uploadvr.com/the-thrill-of-the-fight-2-ian-fitz-interview-early-access-impressions/
- TheVRGrid TotF 1: https://www.thevrgrid.com/thrill-of-the-fight/
- Old Cynic TotF 1 review: https://oldcynic.com/the-thrill-of-the-fight-review-meta-quest-2
- Steam forum, dev reply on hit effects (TotF 1): https://steamcommunity.com/app/494150/discussions/1/1628539187782220763
- Gamertag VR TotF 2 review, YouTube captions (egawjHjDv78, via `tools/yt/yt.py`)
- Enesgaming TotF 2 rant, YouTube captions (mJ0NEVNYxBM)

Limits: screenshots are marketing stills, picked to look good. They show no hit reaction, no KD from the player side, no round-break view. Video captions gave little visual detail. A Tyborg video "New Facial Damage Looks BRUTAL" exists (title only, caption download got rate limited). Treat the hit/KO sections as thin.

## Camera

TotF 1 (2016)
- The eye is the player's real head. Standing view, head height, about eye level with the opponent's face. In the best fight shots (jab range) his head sits in the upper-middle of the frame, chest and belt below. [from shots]
- No own gloves in any of the 4 fight stills. In one shot an opponent glove fills the lower left of the frame as a punch comes in, huge and blurred in depth. The player's own hands are probably there when raised, but the stills do not prove it. [?]
- No own body, no arms, no shoulders in frame. Hands are the only body. [text: VR, tracked controllers] [?]
- FOV looks like a normal VR view, a bit wide. Ring corner posts, ropes, the whole ring floor all fit. At jab range the opponent shows head to belt line, about 65% of frame height (shot t1_3).
- Close range (shot t1_2): his face, chest and one glove fill most of the frame. Ropes and crowd behind him. The camera does not give any "personal space" on the opponent: he can get inside arm length.
- [text] "the camera moves as I swing" (UploadVR, TotF 2, but same real-head idea). [text] Opponent sometimes clips straight into the player at close range.

TotF 2 (2024)
- Same real-head view. Now the player's own gloves are clearly in frame, big and shiny, red leather (shot t2_0), grey (t2_5), gold (t2_6). They fill the lower third to half of the frame when held up. Stitching, creases, light highlights show.
- A bare forearm with hand wraps is visible on the player's arm (practice-dummy shot t2_4). So forearms are drawn, glove-to-elbow. No torso, no legs in any shot.
- Dummy shot shows the glove hits with the arm foreshortened toward the target. [from shot]
- Fighting range (t2_5): his head is about half the frame height, his shoulders and chest run off the bottom. Two of the player's gloves frame him left and right. Very close.
- Mid range (t2_0): opponent seen head to hips, own glove(s) huge in the foreground, ring corner and crowd behind. The view is tilted a little down onto the ring, the opponent is slightly below or level with the eyes. [?]
- Entrance shot (t2_6): long view down the aisle to the ring, own gloves low in frame. The ring is tiny and far.

What changed 1 to 2: gloves and forearms now part of the picture (or at least shown in stills), higher fidelity, much richer light and materials, and a bigger venue set.

### Getting hit (all [text], thin)
- TotF 1, dev reply on the Steam forum: a thud sound plays. A light hit flashes only the edges of the vision. A damaging hit flashes the whole screen bright white. An especially damaging hit adds a moan, "dizzy effects" and a vignette.
- TotF 1, TheVRGrid: each hit after the first changes the view. On Quest the screen goes black and white. On PC it blurs. Enough hits and you are knocked out, with a 10-count heard.
- Another TotF 1 review said the screen blurs, the edges go dark and the sound muffles for a few moments after consecutive hits. (Seen only in the search summary, not from the page.)
- TotF 2 early access interview: when stunned, "the screen fills with white" and you are expected to cover up with a high guard. The flash is something "you can't miss."
- So the pattern: edge flash for light, full white flash for a big hit, desaturation or blur and vignette for accumulated damage, sound muffle. Not seen in any still by me.
- A hit that does nothing shows a "solid blue splash" on the target. Hit strength is color-coded on the hit effect. [text, Steam forum]

## Opponent

TotF 1
- Realistic proportions, low-to-mid poly, a bit mannequin-like. Skin has a flat game-texture look, faces are individual and ugly-on-purpose: scowl, scar, stubble, mouthguard showing (teal guard in t1_2, red in t1_4).
- Faces are readable at close range, because the camera is that close. Brow, eye bags, nose all show.
- Bare torso with muscle shading, dark gym-light shadows. Red or purple gloves with white wraps. Trunks have the name on the leg ("DUKE", t1_4).
- Guard: both gloves up at cheek height, elbows out, a boxy two-glove pose. Reads very clearly because the gloves are big saturated color blocks against the pale torso.
- Punch telegraph in stills: his lead arm is already straight and the glove is huge in foreground (t1_2). A thrown punch grows fast in the frame. The scale change IS the readable signal. [from shot]
- Damage: [text, TheVRGrid] fighters "bruise and show damage" as you hit them, including visible cuts. I saw a little brow bruise on the TotF 1 guy in t1_2 and a scar over the left eye on the t1_3 fighter, not an in-fight swell. [?] Could be authored features.
- KD (t1_1): the downed boxer lies on the canvas in a green outfit, one glove on his head, seen from above and to the side. A ref in a blue shirt and bow tie stands in the left foreground, arm raised. Camera looks down on the body from standing height. Posters on the wall, digital clock on a stand above the ring ropes.

TotF 2
- Clearly higher fidelity. Real skin shading, pores, eyes with wet highlights, hair with strands. Realistic, not stylized (t2_0 blonde braids female fighter, t2_5 male, t2_2 coach).
- Faces still slightly "doll like": symmetric, eyes a bit glassy (t2_0). Strong forward-set eyes, readable.
- Boxers are customizable, avatars with hair, beard, outfits, gear. Same system for opponents. [text, Steam page and shots t2_3, t2_8]
- Guard: gloves up, high and tight (t2_0: one glove at chin, one at cheek). Their lead arm in t2_5 is out and extended toward the camera, glove on the right of his face, the player's own glove in the foreground partly blocks it.
- Damage: launch version had no physical damage. The Gamertag VR reviewer said: no physical damage system, only a "sad meme filter" face when he is close to KO. [text, early on]. UploadVR says the game later got a damage system retune. A "facial damage" video exists. Not confirmed by me. [?]
- No ref in the ring at launch. Reviewer: "unbelievably, there's no referee. You can hear him, but you'll never see him." [text] TotF 1 has the ref physically in the ring. [text, TheVRGrid, and my TotF 1 stills t1_1, t1_4]

## Ring and arena

TotF 1
- The gym (t1_0): white-painted brick, red lower wall, single window, one fluorescent light, lockers, bags. Flat bright light, cheap but clean.
- Fight venue stills (t1_3, t1_4): near-black arena. Ring is the only lit thing: pale bright canvas, white ropes with a red middle rope, blue corner pad. Crowd is a dark silhouette. Two spotlights cone down from above (t1_4). A yellow "THRILL OF THE FIGHT" banner hangs over the ring, floor logo in orange and yellow.
- Gym fight (t1_2): crowd stands outside the ropes, low poly people, mostly still and a few raising fists. Daylight window goes dark navy for the night fight.
- The ring is seen at eye level. Ropes at chest height in front of you form the ring edge. Ring size is real scale: about 4 to 5 metres between you and the ropes. [?]
- Position reads from: the rope lines (they converge to a corner), corner pad color, the floor logo, how close the crowd is. Blurry or dark: everything outside the ring. [from shots]

TotF 2
- Much more setting variety (shots show a banquet hall with chandelier and table seating, t2_0; a old theatre with blue corner and wall lamps, t2_2 and t2_5; a big hall with two balconies and chandeliers, t2_6; a warehouse with blue windows and pennant flags, t2_7). A hotel venue was added in a patch. [text, UploadVR update]
- Crowd is a lot more numerous and detailed. Seated, many idle poses, some cheer. In t2_5 they are further back and slightly blurred or soft (depth of field is not obviously used, just distance).
- Lighting is warm, moody, bounce light on the ring canvas, strong blue canvas and red/blue ropes. High contrast between the lit ring and darker surrounds.
- The ring is a little bit more "dim" than TotF 1's bright white canvas. Colored canvas (blue) and colored ropes help the opponent skin pop.
- Floor has a green boundary line and giant text logo (t2_5). Corner post color shows which corner (red post in t2_5, blue in t2_0). That is how you know where you are in the ring.
- Ropes: 3 ropes, each a clear single-color line. They are the dominant horizontal structure and cross the frame as soon as the opponent is near a corner.
- Spectator view (t2_7) [?]: an outside "broadcast" side view through the ropes, two fighters in profile, full bodies, bunting above. This looks like the TotF 2 Spectator app, a camera for onlookers. The two boxers read well from the side: guards, stances, glove colors. It is the most "Last Bell" looking image in the set. Stance, distance and glove color all read.

## HUD

TotF 1
- No bars in the fight. No health, no stamina. [text, TheVRGrid: no stamina meters]
- Round clock is a physical object in the world: a digital clock board on a stand next to the ring, red and blue seven-segment digits "01 01:11" (probably round and time) (t1_1). Not drawn on the glass. [from shot]
- The ref and the coach are the main information channel. Coach in your corner. The ref appears at the start, the end and between rounds, then walks off during the fight. [text, TheVRGrid]
- A red square on the floor shows the real-room boundary when space is short. [text]
- Round length: 3 min with a 1 min break (real boxing rules). [text, Old Cynic]
- Knockdown: 10-count heard. [text] The KD still shows the ref counting and the body on the floor (t1_1), one shot only.

TotF 2
- Main menu is a tablet held in the player's glove: "SINGLEPLAYER", boxer card with W-L record, age, "Next up: Tournament finals" and a red FIGHT button (t2_1). Tournament bracket poster on the wall with names in red and green boxes. Paper-texture UI, condensed sans-serif headings in red, blue buttons. Very readable.
- Gym dummy shows yellow floating numbers: FORCE, WEAKPOINT, PUNCH TYPE (t2_4). Numbers are shown only in practice. In real fights they are hidden. [text, Gamertag VR]
- Customization and Thrill Shop are big floating paper panels with a laser pointer (t2_3, t2_8).
- In a fight: no HUD in any of the stills (t2_0, t2_5). The reviewer also says damage numbers are hidden.
- Round break: each fighter watches the other from their corner during the one-minute break [text, UploadVR]. The coach is outside the ropes, leaning over the rope, talking at you, in a red tracksuit and flat cap (t2_2). He talks about what happened in the last round. Not a stool scene. [text, Gamertag VR: his feedback comes from the sidelines, not in the ring]
- Results screen: UploadVR mentions a "Score Details" screen per round (forum, TotF 1 beta) that highlights a stat after a round lost on KDs. I did not see it. [text]

## What would read well or badly on a phone

Reads well (a small screen, no depth cue from head tracking):
- Big saturated gloves against pale skin. The guard pose is obvious from color blocks alone.
- A face with a mouthguard, scowl and eye shadows. Faces carry character even at low res.
- Scale change as a punch comes in. A glove growing from 5% to 40% of the frame is a strong signal without any sound.
- A lit ring against a dark crowd. Corner post color and the floor logo tell you where you are.
- The side broadcast view (t2_7): stances and distance read much better here than in first person.
- A world-space clock or ring card. No HUD glass needed.

Reads badly:
- TotF 2 interiors: warm, dim, detailed crowds. On a 6-inch phone they turn to mud and noise. Only the ring needs to be bright.
- Fine face damage: small swelling or a small cut disappears on a phone unless it is big and high-contrast.
- Own gloves filling a third of the frame: great in VR (they are your hands), but on a phone they hide the opponent in a watch-only game. Where the player has no control, they block the view for nothing.
- Ropes at chest height cross the frame all the time. They are a thin horizontal pattern and clutter the face. [?]
- Opponent far away (t2_6): a tiny stick figure. Phone FOV needs the camera to stay close.
- First-person sees only the front of one boxer. A phone watcher cannot read his own man's stance, tiredness or footwork. [?]

## For a phone POV camera

1. Keep the eye at the opponent's face height and put the opponent's head in the upper-middle of the frame, belt line at the bottom. TotF's best shots (t1_3, t2_0) all have this. Never frame feet.
2. Hold him at jab range, about 50 to 65% of frame height for his head to belt. Let the clinch and the close hooks push him to 100% so the face fills the screen. Do not pull the camera back to keep him small.
3. Make the telegraph the scale change. A punch coming at the lens grows fast, with the glove in front of his face. Hooks swing across the frame. This replaces windup animation and needs no UI.
4. Own gloves: show a pair of big saturated gloves low in the frame (bottom third), guard up, so it feels like a body. Keep them mostly out of the way of his face. Keep them subtle because the player does not control them. They can also be dropped for a cleaner view. [?]
5. Getting hit: borrow TotF's ladder. Light hit, edge flash only. Big hit, one full white flash plus a short camera kick. Accumulated damage, slow desaturation and vignette, plus a blur. KD, drop the camera and fade to dark. These effects were all described in text for TotF 1 and 2, none seen in stills by me.
6. Light the ring only. Pale canvas, one strong corner color, ropes in color, crowd and room almost black. This is what made TotF 1 read at low fidelity, and it costs almost nothing to draw on a phone.
7. Make ring position come from the world: corner post colors, the rope lines converging, the floor logo or boundary line. These work without a HUD.
8. Put the round clock on a physical board beside the ring (TotF 1 did). Phone digits in world space are easier to place than HUD and keep the "no UI" look. Keep it large.
9. Put damage on the face and make it big: one eye closing, a wide brow cut, color change. Subtle bruises will not show on a phone. The TotF 2 reviewer said the launch game had none and relied on a "sad" face, which was seen as weak.
10. Plan a second camera. The TotF 2 spectator-style side view (t2_7) is where a watch sim lives: both boxers, stances, distance. A phone-first idea: first-person for punches, a cut to the side view for the replays, KDs and the corner between rounds. [?]
11. The ref stays in the ring (TotF 1 did, TotF 2 got heat for not showing him). A KD with a visible 10-count over a body on the floor is the strongest moment in either game's stills.
