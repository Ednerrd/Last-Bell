# Handoff: Last Bell in Unity (for Antigravity)

Hey. You're helping Ed (the owner) put Last Bell into Unity. Read this first, then `CLAUDE.md` for the house rules.

## Where it stands (Nov 23, updated)
- **It runs in Ed's Unity** (new 3D project + `unity/Assets/LastBell` dropped into `Assets`, hit Play). First run: ring, two boxers, HUD, the fight plays. Ed's verdict on the first rig: "terrible LMAO" (stick legs, floating gloves, far camera).
- **Rig v2 is written but not yet seen in Unity**: jointed arms and legs (two-bone IK), a real body, the step-in on punches, a closer TV camera, a crowd, a ring spotlight. **Your first job: get Ed's eyes on rig v2, then fix what looks off** (list under "Known gaps").
- Checked here without an editor: compiles with Mono against a stub of the Unity API (old Unity and Unity 6 `#if` paths), the fight file parses (7833 frames, 924 events, 158 ms), and the IK was tested with real vector math (bone lengths hold; every guard puts the elbow under its glove).

## What Last Bell is
A phone-first **auto-boxing sim**: two AI boxers fight, real boxing rules (rounds, judges, knockdowns, the ref, cuts, the corner), side view, 1v1. The player is the coach, not the fighter. It's all plain JS today: `index.html` (the fight lab, ~5k lines), `game.html` (the career game, built by `node game/build.js`), and the boxer AI in `brain/brain.js`.

## The plan (Ed picked it, Nov 23): "A", Unity is a skin
- **The JS engine + brain stay the single source of truth.** All the balance (punch output, connect %, stoppages, styles, guards) is tuned and sim-checked in JS. Don't port the engine or the brain to C#.
- **Unity only draws a fight the JS engine already ran.** Step 1: play back a recorded fight (JSON). Later, maybe live: run the JS in Unity (Jint or a WebView), or stream frames from node. Don't decide that yet.
- Ed has Unity installed. Target: his phone eventually (Android/iOS or WebGL), so keep it light.

## How to get a fight
```bash
node tools/unity/record.js [seed] [out.json] [rounds] [styleA] [styleB] [rating]
```
```bash
node tools/unity/record.js 7 tools/unity/sample_fight.json 4
```
- Same seed = the exact same fight every time. Styles: `outboxer boxerpuncher counter slugger swarmer` (more exist, see `STYLES` in `index.html`). Rating ~60-95, default 80.
- `tools/unity/sample_fight.json` is committed (seed 7, 4 rounds, slugger vs boxerpuncher, ~1.5 MB) so you can start without node.
- The recorder only reads the engine. **Never edit the engine section of `index.html` for Unity's sake.** If you need a new field, add it to the recorder. Check with `node tests/same.js 40`: it must still print `299c7598`.

## The recording (v1)
Top level:
| key | what |
|---|---|
| `v` | format version (1) |
| `seed` | the seed |
| `dt` | seconds between frames (1/30) |
| `ring` | `{x:146, z:115}`: the ring runs x ±146, z ±115 (engine units) |
| `fighters` | `[red, blue]`: `{name, style, guard, stance, reach}` |
| `punches` | punch table: `{id, name, dur, kind (straight/hook/upper), zone (head/body), arm (lead/rear)}` |
| `states` | fighter state names, indexed by `state` |
| `frameKeys`, `fighterKeys` | the column names below |
| `result` | `{winner (0/1/null), method (KO/TKO/UD/SD/MD/draw...), round, time, cards}` |
| `frames` | one array per frame (no frames during the corner break between rounds) |
| `events` | the fight's events; `i` = index of the frame it happened on |

A frame: `[t, round, live, clinch, red, blue, clock]`
- `clock` the round clock in seconds (0-180, what the TV shows). `t` sim time in seconds; `live` 1 while the round is on (0 = walking to corners, KD counts, etc.); `clinch` 1 while they're tied up.
- **A round is 60 s of sim time** (the clock shows 3:00, it runs 3x). Play back at `dt` per frame for real speed.

A fighter (`red` / `blue`): `[x, z, yaw, state, punch, punchP, feint, hitT, hitZone, hitPow, downP, rise, sit, tired, def, defP, dmg, cut, swL, swR, hurt]`
| col | meaning |
|---|---|
| `x`, `z` | position on the canvas. x is left-right as the 2D camera sees it, z is depth |
| `yaw` | facing in radians, `atan2(dz, dx)` in engine x/z (can be 0 early on) |
| `state` | index into `states`: idle, move, punch, clinch, stun, slump, down |
| `punch` | index into `punches`, or -1 |
| `punchP` | 0→1 through the punch. The hand lands at ~0.6 (`resolve()` runs at 60%) |
| `feint` | 1 = it's a feint (pulls up early) |
| `hitT` | >0 for a moment after he gets hit (flinch timer); `hitZone` head/body, `hitPow` how hard |
| `downP` | 0→1 going down on a knockdown; `rise` 1 while he's getting up |
| `sit` | 1 = on the stool |
| `tired` | 0 fresh → 1 gassed (drop the hands, slow the bounce) |
| `def` / `defP` | defense move (block, roll, slip, duck, pull, parry) and its 0→1 progress |
| `dmg` | 0→1 head wear; `cut` cut size; `swL` / `swR` eye swelling; `hurt` 1 = he's in trouble |

Events worth hooking up first: `throw` (`a` = who, `p` = punch), `hit` (`a`, `d`, `zone`, `p`, `blocked`, `crit`, `q` the quality, `hand`, `glove`), `miss` (`why`, `def`), `knockdown`, `count`, `up`, `bell`, `clinch`, `break`, `stoppage`, `end`. Every event also has `t`, `round`, `clock` (seconds on the round clock, 0-180).

## Mapping to Unity (as built in `unity/`, step 1)
- Position: `FightPlayer.W(x, z)` = `(x * S, 0, -z * S)`, S = **0.0185 m per unit**. Why: in the sample fight clean shots land a median 54 units apart (p90 64, hooks 51), and a real jab lands ~1.0 m center to center. The ring comes out ~5.4 x 4.3 m. z flips because in the 2D view +z is nearer the camera: the Unity camera sits at -z, so left and right match the lab.
- Facing: `FightPlayer.Yaw(yaw)` = `90 + yaw * Rad2Deg` degrees (with the z flip). When yaw is 0 on both frames, he faces the other man.
- Frames are lerped (position, facing, punchP, downP, defP), and the corner break isn't lerped across.
- Parsing: `MiniJson.cs` (a small reader, no packages). `FightData.Parse()` reads columns by name from `frameKeys` / `fighterKeys`, so new recorder columns won't break it.

## The rig (`BoxerRig.cs`, v2)
- Hierarchy: root (position, facing; faces +z, +x is his right) → `body` (pivot at the feet: only falls on a KD and sways) → `torso` (pivot at the pelvis, 0.90 m: pitch/twist/roll, duck, bounce, the step-in) → arms, gloves, head. Legs are solved in body space, arms in torso space.
- Sizes (m): pelvis 0.90, thigh .46, shin .44, shoulders .52 above the pelvis (x ±.20), upper arm .30, forearm-to-glove .36, head ~1.74 top. `L` = the lead side's x sign (orthodox -1 = left hand leads).
- IK: `Solve(s, ref h, a, b, pole)` two bones, clamps `h` to reach. Elbows aim at a **hint point** (`Tuck()`: under the glove, behind it, outside) blended toward a punch hint (straights tuck, hooks lift the elbow out level with the fist, uppercuts drop it). A single fixed pole direction didn't work for every guard (tested), the hint does.
- Guards: torso-space glove spots per guard + a `blade` (lead shoulder turned in, philly 30°). Peekaboo crouches.
- Punches over `punchP` with `Ext()` (out by .6 when the engine resolves, back by 1): straight lerp, hook / uppercut bezier arcs. Target = the other man's head (or belly) `dist` ahead. Out of reach: the step-in (`lunge`, up to .40 m: pelvis forward, lead foot steps, lean). Jab turns the lead shoulder in, everything else turns the hips over.
- Defense from `def`/`defP` (weight `sin(pi*defP)`), hit flinch from `hitT * hitPow` (head snaps back, body shots fold him), hurt wobble, KD fall back (`downP`), clinch wrap. Face reddens with `dmg`, flashes on a hit.
- Feet: lead forward, rear back and turned out 40°, steps from ground speed (render only, not the engine's real feet).

## Known gaps (fix by eye, Ed decides what matters)
- Feet slide: the steps are a fake cycle off ground speed. The engine knows real foot moves only inside the 3D proto (`proto/tools/feet.js`); later, record them.
- Gloves can pass through the other man (no contact solve). Blocked shots should stop on the gloves.
- Southpaw and every guard are untested by eye. `cross` and `handslow` especially.
- The camera is a fixed TV side view that follows; no KD camera or replay yet.
- The crowd is ~250 people as separate primitives (~500 draw calls): merge or swap for a backdrop before a phone build.
- Colors use `material.color` (works in Built-in and URP). Thigh = trunks color all the way down.

## Build order (small steps, Ed checks each one)
1. **Built (Nov 23, Claude Code):** ring + capsule boxers replaying the fight, with a round counter and clock, names, landed/thrown, an event ticker, Play/Pause, 1x/2x/4x, Next Rd, the result. Ed's eye: does the movement look like the 2D lab?
2. **Built roughly (Nov 23), rig v2 the same day:** jointed limbs, gloves punch over `punchP` (straight / hook arc / uppercut, lead/rear, southpaw swapped), the guards (standard, high, peekaboo, philly, cross, handslow), defense (block, roll, slip, duck, pull, parry), the flinch on `hitT`, falling on `downP`, wobbling when hurt, hit sparks, slow-mo on a KD. **Your first job: run it, fix what looks off, tune it by eye.**
3. **Fight feel**: hit sparks or sounds on `hit` events, a KD camera, the bell, the result card.
4. **The real boxer**: there's already a three.js 3D boxer in `proto/boxer3d.js` (skeleton, stance, punch motion layers), with the spec in `proto/STANCE.md`. Port the *look* from there instead of starting cold. Reference screenshots: `proto/tools/shot.js`.
5. Later: live fights (not a replay), the coach's calls, the career screens. **Ask Ed before starting these.**

## Where to put things
- The Unity code is in **`unity/Assets/LastBell/`** (`Scripts/` + `Resources/fight.json`). Setup: `unity/README.md`. Once it's a real Unity project, commit `Assets/`, `Packages/`, `ProjectSettings/`; `Library/` etc. are already gitignored.
- To hand Ed a build: zip `unity/Assets/LastBell` and he drops it into his project's `Assets` (that's how v1 got to him).
- No scene file needed: `FightPlayer` boots itself on Play (`RuntimeInitializeOnLoadMethod`) and builds everything. The scripts were type-checked with Mono against a stub of the Unity API, not in a real editor: expect small fixes.
- Recorder changes go in `tools/unity/record.js`. Bump `v` if the format changes, and update the table above.

## House rules (short version of `CLAUDE.md`)
- Don't touch `index.html`'s engine, `brain/brain.js` balance, or `game.html` (it's a build output). Unity work must not move the `same.js` hash.
- Small commits. `git pull --rebase` before every push: Ed runs several AI sessions on this repo (Claude Code, Muse). The main branch is `claude/epic-goldberg-ps6ip4`.
- Never publish anything live without Ed's OK.
- Ed reads on his phone: keep updates short and real. Roasts welcome.
