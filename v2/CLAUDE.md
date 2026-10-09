# Last Bell v2: working rules

3D phone-first auto-boxing coach sim, rebuilt from zero. Source of truth: `VISION.md` → `GAME.md` → `FOUNDATION.md` (build order in section 9). `HANDOFF.md` says where things stand.

## Links
- **v2 preview** (private, Claude Code publishes it): _pending_
- v1's live game is off limits. v2 only ever goes to its own preview until Ed says it replaces v1.

## Build and test
- `node v2/build.js` bundles `src/` into ONE `v2/index.html`. That file is build output: never hand-edit it. Commit it with the source change.
- `node v2/tests/run.js [filter]` runs every `tests/*.test.js` plus the determinism hash (`tests/HASH`, `HASH=update` after an intended change). Everything seeded goes into `tests/determinism.js`.
- `node v2/tests/shot.mjs <three.module.min.js>` opens the page headless, checks page errors, taps the quality buttons, screenshots into `v2/shots/` (gitignored). jsdelivr is blocked in the sandbox, so serve a local copy: `npm pack three@0.170.0` into the scratchpad and pass `package/build/three.module.min.js`.

## Code rules
- ES modules (`v2/package.json` is `type: module`). The bundler supports `import {a, b as c}` / `import * as X` from relative paths, and `export function|const|let|class` / `export {…}`. No default exports, no bare imports.
- Engine units: meters, seconds, y up, y = 0 is the canvas. `RING` lives in `src/core/math.js`.
- engine / brain / fighter / career: plain JS, zero DOM, Node runs them. Every random call goes through `makeRng(seed)`, never `Math.random`.
- render3d never imports engine internals and never changes a result. It listens on the event bus (`src/core/events.js`).
- three.js pinned at **0.170.0** from jsdelivr, loaded by dynamic `import()` in `src/render3d/three.js`.
- Published-page rules: scripts only from jsdelivr/cdnjs, fonts only Google Fonts, no other network calls (`build.js` enforces it).
- Budget (S25 Ultra): 60 fps, pixel ratio ≤ 2 by default, one 1024 shadow light, < 150 draw calls (M0 ring: 8).

## Working rules
- Small steps, commit each, push to the session branch. No PR unless Ed asks. No model names in commits.
- From M2 on: sims before and after every engine change. 300+ fights for balance, 1500+ before trusting 1–2%.
- Never change balance and visuals in the same commit.
- Haiku helpers only for big-output jobs; verify what they report.
- Ed reads on his phone: short, homie tone, roasts welcome.
