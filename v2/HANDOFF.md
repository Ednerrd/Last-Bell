# v2 handoff (Oct 9 2026)

Start here.

## Read in this order
1. `v2/VISION.md`: Ed's own words, plus his calls. This is the source of truth.
2. `v2/GAME.md`: what the game is, aspect by aspect.
3. `v2/FOUNDATION.md`: how it's built. Section 9 is the build order (M0–M8), and "Decisions" sits at the bottom.
4. Only when needed: v1 lessons in `docs/BRAIN.md`, `docs/NOTES.md`, `proto/PLAN.md`, `proto/RESEARCH.md`, `research/`.

## Where things stand
- **v1** (`index.html` at the root) is frozen. It's the reference and the fallback. No new v1 work, unless it's Ed's items in `ROADMAP.md` (publishing live, the phone test).
- **v2** has docs only, no code yet. The next step is **M0**.

## M0 spec (skeleton)
- Create the folder layout from FOUNDATION section 8: `v2/src/{core,engine,brain,fighter,career,render3d,ui}`, `v2/tests`, `v2/build.js`, `v2/CLAUDE.md` (short v2 working rules).
- `src/core/rng.js`: a seeded, fast PRNG (e.g. mulberry32 or sfc32), with helpers `range`, `pick`, `chance` and `gauss`. It's deterministic: same seed, same sequence. Test it in `v2/tests/`.
- `src/core/events.js`: a tiny event bus (`on`, `emit`) for the engine → render/commentary/stats stream.
- `v2/tests/run.js`: a no-dependency test runner. Running `node v2/tests/run.js` runs every `*.test.js`, plus a determinism hash check.
- `src/render3d/`:
  - three.js pinned to an exact version from jsdelivr (an ES module through import maps, or a dynamic `import()`).
  - An empty ring with real dimensions: 6.1 m inside the ropes, posts, 3 or 4 ropes, the apron, a hot key light over the ring, a dark surround.
  - A TV camera.
  - An fps / frame-ms / draw-calls overlay.
  - A quality switch: pixel ratio 1.5/2/native, shadows on/off, 60/30 fps cap.
- `v2/build.js`: bundles `src/` into ONE `v2/index.html`. The published-page rules: scripts only from cdnjs/jsdelivr, fonts only from Google Fonts, no other network calls. The output is a build artifact: rebuild it, never hand-edit it.
- **Done when:**
  - `node v2/tests/run.js` passes.
  - `v2/index.html` opens headless in Playwright with no page errors, shown with a screenshot. See the root CLAUDE.md Env note for the chromium path.
  - It's published to a NEW private preview artifact (not v1's live game, not the old 3D test URL). Its link goes into `v2/CLAUDE.md`, and Ed gets the link to check fps on his S25 Ultra.
- Then **M1** (two men, one ring, footwork in real space), per FOUNDATION section 9.

## Rules
- Branch: `claude/brave-einstein-ojkyzm`. Commit each working step and push. No PR unless Ed asks. No model names in commits.
- Never publish to v1's live game. v2 goes to its own preview only.
- Engine code is plain JS with zero DOM, and Node runs it directly.
- Haiku helpers (`.claude/agents/researcher`, `sim-runner`): only for big-output jobs. Always verify what they report.
- Talk to Ed like a homie: short, light, roasts welcome. He reads on his phone.
