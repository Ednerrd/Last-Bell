# FNC bots (side quest)

Goal: the Last Bell brain plays Fight Night Champion (PS3, RPCS3, Ed's own disc), offline, AI vs AI in local versus.
Research: `research/fnc_mods.md`. Never online, never ship EA's files.

Plan:
1. **Pad test** (`pad_test.py`): two virtual Xbox pads, every input one by one, Ed writes down what FNC does. Gives the control map.
2. **Hands**: brain Action -> pad inputs (punch flicks, block, lean, feet), timed to FNC's animations.
3. **Eyes**: game state for the brain's Perception: Cheat Engine on rpcs3.exe for health / stamina (4 meters) / positions, screen capture as a fallback.
4. **Wire it**: Node runs `brain/brain.js` for both men, Python drives the pads.

## Step 1 on the laptop
1. RPCS3: Fight Now works, smooth (turn on the performance overlay: Config > Emulator > Performance Overlay).
2. Install Python 3 (python.org, tick "Add to PATH"), then `pip install vgamepad` (say yes to the ViGEmBus driver).
3. Unplug the real controller. Run `python pad_test.py`, open RPCS3 Pads: handler XInput, Player 1 = XInput #1, Player 2 = #2.
4. Fight Now, P1 vs P2 (human vs human). Pause. Run `python pad_test.py` again, unpause in the countdown, write down what each line did.
