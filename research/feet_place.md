# Foot Placement and Angles — Last Bell research brief #3

**For the renderer.** How the feet look and where they are placed — stance shapes, angles, ring generalship, and what the feet do when a fighter is tired or hurt. Grounded in fight breakdowns, fight reports, and coaching sources. Full report with sources: `research_notes/boxing-foot-placement-20261116-1253/report.md`.

## Headline

**Squared vs bladed is the style tell, and tired and hurt look opposite.** The eye reads stance shape before anything else. A tired fighter goes flat-footed, wide, and square; a hurt fighter wobbles, staggers, and tangles. If the renderer uses one "bad feet" state for both, it will look wrong.

## Situation → foot placement

| Situation | Foot placement | Fighter example |
|---|---|---|
| Open stance, winning the outside | Lead foot outside opponent's lead foot, body shifted with it, stance width unchanged | Lomachenko vs Linares (2018) |
| Open stance, losing the outside | Lead foot inside, rear hand blocked by own lead shoulder, must pivot to re-face | Haney's 180° over-pivot (2023) |
| Open stance, inside-foot jab | Lead foot *inside* opponent's, jabbing clean past the lead hand | Lomachenko vs Piriyapinyo (2014) |
| After the jab, offensive angle | Short diagonal step off the line (orthodox: left), rear foot follows, stance rebuilt; or pivot on lead foot ~45°, rear foot swings out | Lomachenko / Usyk / Crawford (offline jab) |
| After a combo, exit | L-step: rear foot back and to the side, out of range on a new angle | Lomachenko |
| Counter-puncher's exit | Step back with lead foot into momentary southpaw, body moving away as the punch lands | Mayweather vs Maidana (2014), vs Hatton (2007) |
| Cutting the ring | Rear-foot side step to block the escape path, then lead foot driven across; both feet move, stance breaks; squared stance | Foreman, Chávez (vs Rosario 1987), Saddler |
| Cutting the ring, narrow variant | Lead foot cross-steps in front of the back foot; stance stays narrow and sideways, jab loaded | Golovkin |
| Circling away | Small steps, never crossed, toward center/open space; pivot after combos; change direction and pace | Ali; Willie Pep |
| Out-boxer stance | Bladed, narrow, long; rear foot ~45° out, weight rear, on the toes | Ali |
| Swarmer stance | Squared, feet nearly side by side, on the toes, low knees, shifting stances mid-combo | Tyson (peek-a-boo) |
| Slugger / pressure stance | Squared, wider, flatter-footed, short shuffling steps | Foreman; Chávez |
| Counter-puncher stance | Bladed, narrow, short controlled steps, rear-foot pivots | Mayweather (Philly shell) |
| Tired (early) | Heels drop, feet go flat, bounce gone | — (coaching model) |
| Tired (late) | Stance widens and squares, steps get bigger, feet cross, then stops moving entirely | Corbett (1897/1900); Joshua "leaden-footed" vs Ruiz (2019) |
| Hurt / stunned | Wobbling, staggering, stumbling back, feet tangling, leaning on ropes/post; fails the walk-to-referee gait test | Joshua vs Ruiz I (2019); Fury vs Wilder I (2018); Tyson vs Douglas (1990) |
| Rising from a knockdown | Slow rise, stutter step sideways on standing, unsteady first 1–2 steps | Fury vs Wilder I (2018); Warrington vs Wood (2023) |

## The details

**Lead-foot-outside battle (orthodox vs southpaw).** Whoever's lead foot is outside gets the rear-hand line to the chin and takes his head off the centerline. The winner's lead foot sits a half-step past the loser's, body shifted with it — stance width unchanged. **Lomachenko** is the exemplar: vs Linares (2018) he places his right foot outside Linares's left, traps the lead hand, circles past the shoulder to the flank, and hits him on the pivot. Answers: **Haney** (2023) over-pivoted nearly 180° + forearm shove; **Lopez** (2020) threw a cross-body uppercut. Caveat (Jack Slack): the battle's importance is "often overstated" — not all southpaws seek it.

**Stepping off the line after the jab.** Offline jab (diagonal step with the punch; Loma, Usyk, Crawford), standard angle-off (pivot on lead foot ~45°, rear foot swings out), compact angle step ("a shoe length, not a postcode"), L-step, and **Mayweather's** stepping check hook — steps back into momentary southpaw instead of pivoting (vs Maidana 2014, Hatton 2007).

**Ring cutting vs circling.** Cutter steps across with the rear foot to block the escape path, then drives the lead foot across; both feet move, stance breaks. **Foreman, Saddler, Chávez** — squared stance; **GGG's** cross-step is the narrow-stance variant (lead foot crosses in front of the back foot, stance stays narrow, jab loaded). Circler: small steps, never crossed, toward center, pivot after combos — **Ali** bouncing on the balls of his feet; **Willie Pep** circling effortlessly.

**Stance by style.** Textbook baseline: shoulder-width, rear foot ~45° out, rear heel raised, toe–heel line. Out-boxer bladed/narrow/on toes (Ali); swarmer squared, feet nearly side by side (Tyson peek-a-boo, D'Amato shift); slugger squared/wide/flat (Foreman, Chávez); counter-puncher narrow/bladed, rear-foot pivots (Mayweather). ⚠️ Qualitative only — no measurement of stance width or turn-out by style exists.

**Feet when tired.** Five-stage coaching model: heels drop → stance **widens and squares** → steps get bigger → feet cross → stops moving. Note: tired feet go wider, *not* narrower. Footwork goes before the hands — legs work continuously holding a bent-knee stance, hands work 10–20% of a round.

**Feet when hurt.** Legs stop obeying: wobbling, staggering, tangling, leaning on the ropes/post. Best case: **Joshua vs Ruiz I** (June 2019) — "wobbling like a toddler," failed the walk-to-referee gait test, "leaning on the ring post to keep himself upright." Also Fury's Undertaker rise (Wilder I, 2018 — "I didn't know where my legs were going to be"), Tyson vs Douglas (1990, "rubbery-legged"). The ABC referee manual's Gait Test is the formal check: walk a few steps, turn, walk back — assess balance. ⚠️ No source describes a hurt fighter deliberately widening his stance — hurt feet wobble, they don't plant wide.

## Notes for the renderer

1. **The outside-foot battle is the single most renderable idea.** In open stance, the two lead feet are the whole fight: whoever's lead foot is outside has the rear-hand line and the angle. Sell it with one thing — lead-foot position relative to the opponent's lead foot — and everything else follows.
2. **Squared vs bladed is the style tell.** Out-boxer long and bladed on his toes; swarmer squared with feet nearly side by side; slugger squared and flat; counter-puncher narrow and still. Getting those four silhouettes right does more than any step animation.
3. **Tired and hurt look opposite.** Tired = flat feet, wide square stance, big slow steps, then standing still. Hurt = narrow, wobbling, tangling feet, stumbling backward, leaning on the ropes.
4. **The cutting step is a two-foot move.** The classic mistake is pivot-and-follow: the cutter pivots around his lead foot and the circler walks away along the ropes. Real cutters step across with the rear foot, then drive the lead foot across — both feet move, stance breaks, space disappears. GGG's cross-step is the narrow-stance variant worth having as a second cutter look.
5. **The gait test is a free knockdown tell.** After a knockdown, the referee makes the fighter walk a few steps, turn, and walk back. A hurt fighter who can't do that walk — Joshua in round 3 — is the most legible "he's done" signal in the sport. Worth a render beat if the game ever shows the count.

## Could NOT verify

- Stance width in cm by style; per-style foot turn-out angles; any step distances in cm.
- A "wide stance to stay up" when hurt (hurt feet wobble, they don't plant wide — tired and hurt look opposite).
- The "8/10 times" outside-foot win rate (unsourced coaching-site assertion).
- "30% stability / 15–20% punch force" junk numbers from a content farm (ignore).
- Tyson's back-foot step covering "twice the distance" (unsourced).
- The five-stage tired-feet sequence as a fixed order (one coaching site's framework).
- Any motion-capture study of foot placement in real fights — none exists.
- The exact 45° figure for the angle-off pivot and rear-foot turn-out is a coaching convention, not a measured angle.

## Key sources

Fight Primer (Jack Slack) — Haney/Loma, Lopez/Loma, Cutting the Ring; Bad Left Hook — Pacquiao/Algieri, Mayweather/Maidana; Sportsweek — Lomachenko/Linares; Modern Martial Artist — GGG; DAZN/Boxing News/Max Boxing — Joshua-Ruiz I; TNT Sports — Fury on the Wilder rise; ABC Boxing Referee Manual (2025); Knockout Fit — tired feet; David Christian, Footwork Wins Fights.
