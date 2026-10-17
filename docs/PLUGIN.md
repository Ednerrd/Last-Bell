# The plug-in brain (ROADMAP 1, design Oct 17)

Ed (Oct 16): the smartest boxing AI out there. One brain you plug into any fighter, set to easy / hard / expert, and let it work. Fight Night's AI is beatable with the same trick all night; Thrill of the Fight's barely reads you. This one should read you, punish a pattern and never fall for the same cheese twice.

What already exists: `brain/brain.js` is standalone (no DOM, no engine globals, Node + browser). The contract is typed (Perception in, Action out, events through `hear`). `brain/ring.js` is a minimal host. `brain/README.md` covers the profile, the contract and what's inside. Skill levels (L1-L3) and learning (L4) give a per-man level, style and type familiarity, and memory across fights.

## 1. Difficulty presets (P2)
`BoxerBrain.preset(level, { style, seed })` returns a profile (and the recommended create opts):

| Preset | Skill center | What it means |
|---|---|---|
| easy | 56 (Intermediate) | telegraphs, reads late, adjusts rarely, short combos, gasses |
| hard | 74 (Pro) | the default game AI: reads habits in 2-3 rounds, setups and traps, paces |
| expert | 90 (World class) | reads in 1-2 rounds, punishes a habit, adjusts between rounds, fights the cards |

- No new knobs: a level is the skill sheet (`BR.lv` already scales reads, telegraphs, feints, combo length, adjusts, freezing). One level apart wins ~16-18% (`levels.js sk`), so easy vs hard vs expert are real steps.
- Expert also gets memory across fights in a session (L4c prior) when the host keeps a `memo()`.
- Measure: each preset vs a fixed "average player" (a Pro brain, no corner): easy ~15-20%, hard ~50%, expert ~80%.

## 2. The anti-cheese test (P1, first: measure before building)
A "player" who repeats one exploit all fight, run on the Last Bell engine (the real host). A cheese is the brain with its offense or defense pinned to a script (a wrapped brain: everything else, events and gas included, stays real).

| Cheese | What the player does |
|---|---|
| jabSpam | jabs from the edge of range, nothing else |
| oneTwo | the same 1-2 every time |
| pullCounter | waits, pulls back from everything, fires the cross straight back |
| shell | covers up on the ropes, throws only when the other man stops (rope-a-dope) |
| bodyOnly | only to the body |
| haymaker | walks forward winging the right hand |
| runner | backs up and circles all night, jabs when cut off |
| clinch | ties up every time it gets close |

- Metrics, per cheese x preset (hard, expert): the brain's win %, and the cheese's share of landed punches in rounds 1-3 vs 8-10 (the brain should take the trick away as it reads it).
- Targets: expert wins 80%+ against every cheese, hard 65%+, and the cheese's landed share falls from early to late. A cheese that holds or climbs is a hole to fix (P3).

## 3. Fix what the cheese finds (P3)
Each hole is a brain change with sims before and after (the usual balance checks: styles, audit, levels, the hash moves on purpose).

## 4. The drop-in guide (P4)
`brain/README.md` gets a "Plug it into your game" section: the minimal host loop (from `ring.js`), the Perception fields a host must fill and which can be faked, the events to send, presets, what to save between fights (`memo()`, the skill sheet), the per-frame cost (`think()` time on a phone), and the knobs a host should leave alone.

## Build order
P1 cheese bots + baseline (`tests/cheese.js`), P2 presets (`BoxerBrain.preset`, the ladder test), P3 fix holes, P4 guide. Each a commit; P1, P2 and P4 hold the hash, P3 moves it on purpose.
