# Fight Night visuals (Oct 9 2026)

Ed: the v2 look is mostly the Fight Night series (Round 3, Round 4, Champion). This file adds to `proto/RESEARCH.md` ("Models and visuals", "Presentation") and `research/fnc.md`. Read those first.

**How solid this is.** The sandbox proxy blocked almost every article (ea.com, wikipedia, gamingbolt, engadget and more). Everything below comes from search snippets, not full pages. No screenshots or videos were opened. Tags: (snip) = search snippet only. (est.) = our inference. Missing facts are listed at the bottom, so don't guess them.

## 1. Camera
- FNR3: the camera follows the action, then shifts focus and position when a man takes heavy blows (HEXUS, Trusted Reviews, snip).
- FNR4: a clean knockdown punch slows the action and zooms the camera in (GamePro, snip).
- FNC: when a man is about to fall, the camera sways "as if the cameraman is hanging freely above the ring" (Benzinga, snip). A stun tilts the camera and a ringing sound plays (already in proto/RESEARCH.md).
- FNC KO replays: the last 1–3 punches in slow-mo, the angle can change during the replay, and the face skin ripples (Benzinga, Washington Examiner, snip).
- Real broadcasts, for feel: an apron camera at ringside, in-ring high-speed cameras up to 480 fps (Showtime), a 1,000 fps overhead (Phantom), and cable cams that drop to shoulder height. Big events run 12–24 cameras (sportsvideo.org, snip).

## 2. Light and grade
- FNC: "the crowd is usually dark and the only real source of light comes from the ring." One review says it's "a bit too dark at times" (GodIsAGeek, snip). Others call the lighting perfect, so it's a matter of taste.
- FNC closed venues have smog and dust in the light. Outdoor venues have a dark-blue night crowd and dim signs in the distance (OS Tech Force, snip).
- Real events pump haze so the light beams read on camera. One promotion ran it at 50% for the undercard, 75% for the PPV and 100% for the main event (TPI, snip).
- Sweat builds as the fight goes on (FNR4 Push Square; FNC "rivulets of sweat", snip).

## 3. Fighters and damage
- FNR3 PS3 skin shader: subsurface scattering, ambient occlusion, spherical harmonics, blended wrinkle maps, and refracted blood and sweat (SIGGRAPH archive, snip).
- FNR4/FNC: muscles flex on punches and footwork (snip).
- FNC: cuts and bruises grow more swollen and deeper as the fight goes on (co-optimus, snip). Swelling can shut an eye (fnc.md).
- FNR3: on knockouts, sweat and blood-tinged spit spray from the face (GamesRadar, snip).
- FNR3: you read the face instead of a health bar (Pocket-lint, snip).

## 4. HUD
- FNR3: no bars by default. FNR4: bars on by default, with a toggle to turn them off. FNC: one visible stamina bar, fed by four hidden pools.
- Undisputed: stamina, an ECG-style heart line, and body-part bars that appear when that part gets hit (snip).

## From Ed's screenshots (Oct 9, the real target)
Ed sent 5 frames. Read by eye, so these are first-hand rather than snippets. The images aren't in the repo (EA copyright).

**1. FNC close-up, a hook landing (the "money shot").**
- Camera low at shoulder height, very close, long lens. The crowd behind is blurred out (shallow depth of field) into warm dark blobs.
- Skin is very glossy with sweat: hard specular highlights on shoulders, arms and face.
- Damage: bloodied brow and cheek, a swollen eye, blood smeared on the hand wraps and tape.
- Impact: the hit man's face distorts and his mouth opens, and his head turns with the punch.
- Red ropes. Tattoos.

**2. FNR3/4 heavyweights (the "arena glow" shot).**
- Camera at waist height looking slightly up, so the fighters loom.
- Strong overhead backlight gives rim-lit silhouettes and a blown-out glow around the lights (bloom and lens flare).
- Cool blue haze and light beams over a near-black arena. Banners hang in the dark.
- Warm, saturated skin pops against the cool background. That's the core color contrast.
- White wrist tape, thick waistbands on the trunks, big glossy gloves.

**3. Undisputed, the elevated gameplay cam.**
- Camera high in a corner (~3–4 m up), looking down at ~35°, wide. That's close to our current TV cam, which shows it's a real gameplay view.
- Here the crowd is lit and dense, not dark. A black canvas with big sponsor logos, white ropes and pads, and a referee in the ring.
- Brighter, flatter lighting than FN.

**4. FNC gym (Champion mode).**
- Brick walls, fight posters, heavy bags, weights.
- A sepia/desaturated warm grade with high contrast, crushed blacks and a vignette.
- This is the look for the gym/training screens and the "back-room gym" venue tier.

**5. FNC amateur bout, the standard fight cam and HUD.**
- Camera at chest/head height, just outside the ropes, side-on to the fighters. They fill most of the frame height in landscape.
- Blue canvas with a logo, red ropes with white tape spacers, red/blue corner pads with logos, a dark crowd.
- HUD sits at the bottom only: name plus a thin stamina bar bottom-left, and a center scorebug with punch totals on each side (266 / 206), the clock (1:50) and "ROUND 4 OF 4". Gold-on-black. Nothing at the top of the screen.

**What this means for v2 (est.)**
- **Two cams.** A *fight cam* (FN default: low, side-on, close, tracks the midpoint, keeps both men in frame) and the *wide cam* (what we have now, Undisputed-style). The fight cam is the default, with a button to switch.
- **The FN look comes from contrast:** warm glossy skin against a cool, hazy, near-black arena, with rim light from overhead. Copy that before anything else.
- **Shallow depth of field** is too pricey as a real effect on a phone. Fake it with a darker, softer crowd and fog.
- **HUD goes to the bottom:** a scorebug with the clock, round and punch totals, plus name and stamina corners. The top stays clear for the action.
- **Ring kit options** per venue: blue canvas with red ropes (amateur/FNC), black canvas with white ropes (modern PPV).

## Reference links (from search results, not opened)
1. https://www.engadget.com/2010-11-15-fight-night-champion-screens-are-a-knockout.html (FNC screens)
2. https://www.gematsu.com/2010/12/new-fight-night-champion-clips-have-heart (FNC clips)
3. https://www.ea.com/news/fight-night-champion-art-blog (FNC art blog)
4. https://www.godisageek.com/2011/03/fight-night-champion-review
5. https://pushsquare.com/reviews/ps3/fight_night_round_4
6. https://pocket-lint.com/games/reviews/playstation/69424-fight-night-round-3-boxing
7. https://history.siggraph.org/?p=47968 (FNR3 shader)
8. https://www.sportsvideo.org/2017/09/13/hbo-boxing-to-unleash-first-ever-dual-aerial-camera-attack-for-massive-alvarez-golovkin-bout/ (real HBO camera rig)
- YouTube: search "Fight Night Champion launch trailer" and "Fight Night Round 3 PS3 knockout replay".

## Not found (don't guess)
- Camera height, distance, FOV and lens, and cut timing between rounds.
- Grade numbers: bloom, contrast, color temperature.
- Canvas, rope and corner-pad colors, logos, ringside props, crowd rendering.
- Body proportions by weight class, guard pose visuals.
- Head-snap, shockwave and hit-stop frame counts. HUD placement.
- Best next step: Ed sends screenshots he likes, or a session with open web access looks at real frames.

## Phone-budget plan (S25 Ultra: 60 fps, < 150 draws, one 1024 shadow light). All (est.)
**Copy cheaply**
- One hot spot over the ring with shadows. The crowd falls off to near-black. We already have this.
- Crowd: one instanced or atlas mesh (2–3 draws), dim, with a sway uniform for motion.
- Light cones and haze: additive cones and planes near the lights (4–6 draws).
- One fullscreen grade and vignette: slightly desaturated, cool shadows, warm ring.
- Camera: ringside with a lerp follow, FOV 35–45, a long-lens feel. Dip in on heavy shots, sway on a coming knockdown, zoom and tilt on a stun.
- Hit-stop on flush shots: 60–100 ms at a 0.2–0.4 time scale. KO replay: rewind 2–3 s and play at ~0.3x from 2–3 angles. Our sim is deterministic, so a replay is a re-run.
- Sweat: skin roughness drops over the rounds, plus 10–20 pooled droplet sprites on big hits.
- Damage: a face decal swapped by stage (redness → swelling → bruise → cut), plus 1–2 swelling morph targets.
- HUD: round clock and minimal info. Health stays hidden; you read the face (FNR3).

**Fake:** subsurface scattering (use a rim/fresnel tint instead), face ripple (a ~100 ms shader pulse), glove squash (scale for 2–3 frames), canvas reflections (a cheap env map).

**Skip:** cloth sim, blood soaking into trunks, individual crowd meshes, a press row, full-res bloom.

**Draw estimate:** fighters ~16, ring ~12, crowd 3, light and haze 6, arena 6, so ≈ 45–60 in all.
