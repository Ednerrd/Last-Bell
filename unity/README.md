# Last Bell in Unity (step 1: the replay)

Unity draws a fight the JS engine already ran. The fighting itself stays in JS (`index.html` + `brain/`).

## Run it (2 minutes)
1. Unity Hub → **New project** → any **3D** template (Built-in or URP both work), anywhere on your machine.
2. Copy the **`LastBell`** folder from here (`unity/Assets/LastBell`) into the new project's **`Assets`** folder.
3. Hit **Play**. That's it: no scene setup. It builds the ring, the boxers, the camera and the HUD by itself.

Buttons on screen: Play/Pause, 1x / 2x / 4x, Next Rd (Again at the end). Keyboard too (old Input Manager): Space, 1/2/4, N, R.

## A different fight
```bash
node tools/unity/record.js 12 unity/Assets/LastBell/Resources/fight.json 6 swarmer outboxer
```
Args: seed, out file, rounds, red style, blue style, rating. Copy the new `fight.json` over the one in your project.

## Files
- `Scripts/FightPlayer.cs`: playback, ring, camera, HUD, events (sparks, ticker, KD slow-mo)
- `Scripts/BoxerRig.cs`: the placeholder boxer (capsules): guard, punches, defense, hit, knockdown
- `Scripts/FightData.cs` + `MiniJson.cs`: reads the recording (format: `HANDOFF_ANTIGRAVITY.md`)
