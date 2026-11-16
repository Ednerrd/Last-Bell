# Arm extension at contact

By Muse (Stephie), Nov 16, 2026: Claude's research brief #1. Why: our punches aim at ~92% of the arm, but at impact the arm renders only ~50-60% out (jab .55, cross .50: `proto/PLAN.md` Phase 1 exit, open). They look smothered. The engine decides punches with rolls, not hitboxes (the result settles at 60% of the throw), so the fix is how the punch *looks* when it lands.

**Headline:** real boxers almost never land with a fully straight arm, except on the long-range jab. Extension at contact scales with range. Our render is far too bent for long and mid-range straights, about right for inside fighting, and hooks and uppercuts are *supposed* to look bent.

Angle convention: the elbow angle, 180° = a fully straight arm. % = angle / 180. Tags: [M] measured (motion capture), [T] textbook (AIBA), [I] inference (flagged, not a measurement).

## Extension at contact

| Punch | Long range | Mid range | Inside |
|---|---|---|---|
| Jab | ~180° (100%) [T]: no measurement exists | ~130–150° (72–83%) [I] | ~110–130° (61–72%) [I] |
| Cross | 137±12° (76%) [M] | 112.9±9.2° (63%) [M] | 102±17° (57%) [M] |
| Lead hook | n/a (not thrown) | ~98–105° (54–58%) [M†] | ~90° (50%) [T] |
| Rear hook | n/a (not thrown) | 105–117° (58–65%) [M] | ~90–105° (50–58%) |
| Uppercut | n/a (not thrown) | ~100° (56%) [M, rear only] | ~90–100° (50–56%) |
| Body jab | not measured | ~130–160° [I, placeholder] | not measured |

† The hook values were measured without a lead/rear split (Bingul 2018) or on the rear hook (Whiting 1988; Dinu 2020). Lead-hook angles are unmeasured.

Why the cross differs by study (102° vs 113° vs 137°): Cheraghi puts it down to range. Amateurs punch from further out for speed (137°); pros punch from closer in, with more elbow bend, for effective mass (102°). It's a real range effect, not noise. No study measured the contact angle by range directly: the split above is built from the AIBA range classes plus that explanation.

## Timing (ms; frames at 30 fps in brackets)

Two definitions, don't mix them: (A) the full launch to contact, from the first body movement; (B) the fist's flight only, from leaving the guard to contact (the visible arm-extension phase).

| Punch | Out: full launch (A) | Out: fist flight (B) | Back to guard | Total cycle |
|---|---|---|---|---|
| Jab | 405±150 [12] | 117±25 [3.5] | 262±42 [8] | 523±63 [16] |
| Cross | 495±150 [15] | 111±41 [3.3] | 169±41 [5] | 402±65 [12] |
| Lead hook | 657±145 [20] | not measured | not measured | not measured |
| Rear hook | 586±96 [18] | 91±50 [2.7] | 168±97 [5] | 441±104 [13] |
| Uppercut | 606–627 [18–19] | 71±36 [2] | 171±33 [5] | 385±65 [12] |
| Body jab | not measured | not measured | not measured | not measured |

The jab's return (262 ms) is *longer* than its way out (117 ms): the return is not a mirror of the punch.

## Per punch

- **Jab (Larry Holmes).** Max elbow bend ~55–70° [I], about the guard angle: the jab goes straight out of the guard, no big wind-up. The shoulder turns forward and up and is pushed furthest forward at impact, the fist turns palm-down, the chin tucks behind the raised lead shoulder. Peak shoulder speed 691°/s, ~12% before the elbow's peak. Holmes: a long left snapped to near-full extension, loose, turned over at impact.
- **Cross (Thomas Hearns).** Max bend 52±7° [M]: the elbow bends *further* first (67° at the start down to ~52°, a stretch-shortening cycle), then opens to 102–137° at contact. Shoulder flexion 20° → 86±5° at impact, fully forward. Hearns: a long right almost fully out, driving down over the guard, the elbow turned up at the last instant (his was chopping, near overhand; Lennox Lewis is the cleaner textbook cross).
- **Lead hook (Joe Frazier).** Max bend ~90–97° [I]: the elbow stays near ~90° through the punch; the power is the trunk and shoulder turning, not the elbow. The shoulder is half the hook's speed; it lifts out to the side, ending level with the ground. Frazier: short, compact, the elbow ~90° and low, whipped up out of the bob and weave.
- **Rear hook (Rocky Marciano, the "Suzie Q").** Max bend 97±11° [M]: the elbow stays between ~97 and 116° the whole punch; the torso whips the fist around. Marciano: a short right looped tight, ~90°, from a crouch with a violent turn (the Suzie Q is more an overhand/hook hybrid than a textbook rear hook).
- **Uppercut (Mike Tyson).** Max bend ~60–70° at the dip [I], opening ~25–30° to ~90–100° at contact: no big bend-then-open. The shoulder is 55% of the punch's speed; uppercuts have the fastest shoulders of any punch (~1062–1070°/s); the upper arm stays low and close to the body. Tyson: the elbow ~90° tucked low, palm up, driven up out of the peekaboo crouch.
- **Body jab (Miguel Cotto).** No measurements exist: everything here is inference. It's a jab at a lower, closer target after a level change (knees bent, trunk down), so the arm reaches less than a long head jab; ~130–160° is an animator's placeholder. Timing: the head jab's numbers as a lower bound (the level change adds time). Cotto: a stiff left near-straight, angled down into the solar plexus from a low base, the shoulder rolled forward.

## What it means for the game

- **Straights need extension by range:** long ~137–180°, mid ~113–150°, inside ~102–130°. Today's render (~55% jab, ~50% cross) is right for inside fighting and wrong everywhere else.
- **Hooks and uppercuts stay bent:** ~50–65% at contact is real, not a bug. Don't straighten them.
- **Timing:** the fist's flight is only 2–4 frames at 30 fps; most of a punch on screen is the wind-up and the return. Returns are slow (5–8 frames home), and the jab comes back slower than it goes out.
- **Shoulder:** it rolls forward into every punch (the cross's shoulder at ~86° at impact); hooks and uppercuts are shoulder-driven (50–55% of the speed).

## Gaps (couldn't verify)

- The jab's elbow angle at contact: no published motion capture (Stanley 2020 confirms the gap); 180° is the textbook ideal.
- The body jab: no data of any kind.
- Lead hook and lead uppercut joint angles: unmeasured.
- No study measures contact angle by range; the range split is built, not measured.
- How much reach the shoulder adds (cm): unmeasured ("several centimetres" is a coach's estimate).
- Return times for the lead hook, lead uppercut, body jab: unmeasured.
- Whiting 1988 and Joch 1981 were read through Cheraghi 2014 / Stanley 2020 (which agree), not directly.

## Sources

- Cheraghi et al. 2014, Kinematics of Straight Right Punch in Boxing, Ann Appl Sport Sci 2(2):39–50.
- Stanley 2020, Maximal punching performance in amateur boxing (PhD thesis, University of Chester); incl. Stanley et al. 2018, Int J Perform Anal Sport 18:835–854.
- Piorkowski, Lees & Barton 2011, Single maximal versus combination punch kinematics, Sports Biomechanics.
- Dinu & Louis 2020, Biomechanical Analysis of the Cross, Hook, and Uppercut in Junior vs. Elite Boxers, Front Sports Act Living 2:598861.
- Bingul et al. 2018, The Effects of Biomechanical Factors to Teach Different Hook Punch Techniques in Boxing, J Educ Train Stud 6(3a).
- Menzel & Potthast 2021, Application of a Validated Innovative Smart Wearable for Performance Analysis in Boxing, Sensors 21:7882.
- Xu et al. 2024, A comparative analysis of punching in boxing and sanda, Front Sports Act Living 6:1441470.
- Fighter breakdowns: Holmes (boxraw.com, boxing247.com), Hearns (thefight-site.com, modernmartialartist.com), Frazier (bestboxing.net, tdatraining.blogspot.com), Marciano (orderisda.org), Tyson (bloodyelbow.com), Cotto (bloodyelbow.com, boxwithsimmy.com).
