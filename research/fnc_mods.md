# Fight Night Champion: CPU-AI mods and plugging an outside AI in (web research, 2026-10-27)

Method: WebSearch + WebFetch only. Search coverage was THIN: psx-place, forums.rpcs3.net, rpcs3.net, web.archive.org, and raw patch.yml were all blocked (403/404 or fetch refused). Anything not linked below is NOT verified.

## Summary
- Nobody has been found who modded FNC's CPU AI (behavior, difficulty, sliders, stamina). Zero hits for an AI mod, cheat table, or AI-vs-AI bot on FNC, Round 3/4, Undisputed or Thrill of the Fight. Absence in thin search, not proof.
- Only PS3 FNC mod lead: psx-place thread "PS3 Need devs for modding Fight Night Champion" by 2banditos, a call for people with reverse-engineering/Ghidra skills. Thread unreadable (403), date, replies and progress unknown. Looks like a recruiting post, not a working mod.
- "Fight Night Forever" (announced ~Feb 28, 2025): only evidence is a Steam forum thread where one user calls it a "Fight Night Champion mod, same game different skins". Unverified, no developer found. Likely a reskin/roster mod, not an AI overhaul.
- Real, verifiable FNC reverse-engineering: **FNC Reborn** (github.com/whompay/FNCReborn), a static recompile of the Xbox 360 `default.xex` to a native Windows x86-64 exe (ReXGlue SDK). Playable, 60/120/144 fps, hooks the game's frame timer and camera. It touches no AI, but it proves game code is hookable and gives a function manifest and file hints (`databigs`, `fe.big`).
- RPCS3 status for FNC could NOT be confirmed (compat page 403). A 2020-21 Steam thread had a user running Champion on RPCS3 with Story/Legacy modes working and occasional "opponent AI stuck" freezes. Treat as anecdotal.
- Best route to put an outside AI in: not modding the AI. Drive the player side. Run FNC (RPCS3 or the FNC Reborn Windows port), feed a virtual gamepad, read state via screen capture and/or memory reads. For AI vs AI you need both sides controlled (two virtual pads in Fight Now local versus). No prior art found.
- Biggest blockers: no known memory map or cheat table, no documented archive/attribute formats, RPCS3 speed and stability unknown, and hooking the in-game CPU brain needs real reverse engineering (nobody public has done it).
- Side note: EA announced a new Fight Night on Oct 20, 2026 ("The Fight Is Never Over"), per [Bleacher Report](https://bleacherreport.com/articles/25513665-ea-sports-announces-return-fight-night-boxing-video-game-fight-never-over) and [GamingBible](https://www.gamingbible.com/news/ea-fight-night-comeback-confirmed-after-15-years-759862-20261021). Not FNC modding, but it will draw modders' attention.

## 1. Mods touching the CPU AI
- psx-place "Need devs for modding Fight Night Champion" (user 2banditos). Seen only as a snippet via search result for [2banditos recent content](https://psx-place.com/members/2banditos.159868/recent-content): wants people with reverse engineering experience, Ghidra skills and general PS3 structure knowledge. Date, status, replies: NOT VERIFIED (403, archive.org blocked). Assume dormant unless shown otherwise.
- "Fight Night Forever": [Steam thread, Feb 28 2025 onward](https://steamcommunity.com/app/1451190/discussions/0/594016333228718073) (posted in Undisputed's forum). OP says it is a newly announced boxing game, probably offline-only. Reply by EsTeVaN (Feb 28 2025): "Fight Night Champion mod ... same game different skins". Linked video: https://www.youtube.com/watch?v=hlwzKT0YbmU (not watched). Who makes it, platform (PS3/360/PC), AI changes, whether alive: NOT VERIFIED. No official page found.
- No other FNC AI/difficulty/slider/stamina-cheat mods found. NOT VERIFIED that none exist (Operation Sports, GBAtemp, Nexus, Discords were not reachable via search).
- Official context: EA shipped a Champion title update ([EA news](https://ea.com/en-gb/news/fight-night-champion-title-update)); not examined for AI changes.

## 2. FNC modding scene, formats, tools
- FNC Reborn, [repo](https://github.com/whompay/FNCReborn) and [wiki](https://github.com/whompay/FNCReborn/wiki), page copyright 2026 (so recent; the repo shows 1 commit, 86 stars, 15 issues). Native Windows port of the Xbox 360 game: PowerPC recompiled via ReXGlue SDK ([github.com/rexglue/rexglue-sdk](https://github.com/rexglue/rexglue-sdk)) + clang to x86-64, D3D12 GPU layer. Input is a user's own `.iso` or a folder with `default.xex` and `databigs`. Windows 10/11 + D3D12 GPU. Known glitches: fighters vanishing after in-fight cinematics, menu flicker, one disc version supported.
- [HOW_IT_WORKS.md](https://github.com/whompay/FNCReborn/blob/main/docs/HOW_IT_WORKS.md) (read 2026-10-27): hooks at game-code level. `fnc_hooks.cpp` replaces the game's 30 Hz frame timer; `player_camera.cpp` repositions the camera using head bones the camera system tracks; a DISPLAY tab is injected by editing `fe.big`; `fnc_manifest.toml` lists 715 functions static analysis missed (vtable targets). Credits a Xenia-canary "Unlock FPS" patch for FNC from [xenia-canary/game-patches](https://github.com/xenia-canary/game-patches) (author "illusion"); file contents not checked.
- File format: the game stores data in `.big` archives under `databigs` (fe.big named). No documented spec or extractor found for FNC `.big`. EA's generic BIG format exists for other titles; whether FNC's variant matches: NOT VERIFIED. FNC Reborn's author clearly edits `fe.big`, so a tool exists inside that repo (`tools/display_tab`), not inspected.
- Roster/attribute editor, save editor, Artemis cheats for FNC: none found. (Codex Gamicus notes user-created fighters like Mayweather exist via the in-game Create-a-Fighter, [page](https://gamicus.fandom.com/wiki/Fight_Night_Champion), which is not file modding.)
- Leaked [May 18, 2010 prototype](https://hiddenpalace.org/Fight_Night_Champion_(May_18,_2010_prototype)) exists at Hidden Palace: possibly debug symbols/strings; not opened. Worth a look for function names (UNVERIFIED value).

## 3. FNC on RPCS3
- Serials: BLUS30608 (US) per the task brief; BLES01140 (EU) likewise unconfirmed by me.
- Compatibility rating, fps, issues: NOT VERIFIED ([rpcs3.net/compatibility](https://rpcs3.net/compatibility?g=BLUS30608) returned 403 to every fetch).
- Anecdote: [Steam thread, ~2020-21](https://steamcommunity.com/app/1451190/discussions/0/2997674076196444558/?l=polish): one user ran Champion with Story and Legacy working; another saw "opponent AI sometimes gets stuck, wait for the round to end" (a bot-relevant hazard); the "in game only" remark in that thread referred to Fight Night Round 4. Low-quality spam site claims referee shirt flicker fixed by "Write Color Buffers" (ignore unless confirmed).
- RPCS3 patch.yml entry for FNC: NOT FOUND. raw.githubusercontent.com paths I tried 404'd (wrong path), so absence is not established.
- Xbox route: FNC is backward compatible on Xbox One ([Windows Central](https://windowscentral.com/boxing-game-fight-night-champion-joins-xbox-backward-compatibility)); Xenia support and FNC Reborn are alternatives to RPCS3. RPCS3 is not proven the best host.

## 4. Memory addresses / cheat tables
- Nothing found for health, stamina or positions: no Cheat Engine table, Artemis code, or RPCS3 cheat for FNC. Searches only returned unrelated games.
- Practical note (generic, not FNC-specific): RPCS3 guest memory can be scanned with Cheat Engine by attaching to the rpcs3 process; PS3 values are big-endian. Stamina in FNC is four meters (each arm, abs, legs) per [Game Informer, Jan 12 2011](https://gameinformer.com/b/news/archive/2011/01/12/fnc-stamina.aspx), so there are several floats to locate. Finding them is a from-scratch job.
- FNC Reborn's recompiled code (C++ per function, no symbols given) could be a route to locate the fighter/AI structs; no one has published it.

## 5. Prior art: bots / AI vs AI via virtual gamepad
- None found for Fight Night Round 3/4, Champion, Undisputed or Thrill of the Fight. Searches returned only generic RL-in-fighting-games material.
- Related, not plug-in-to-commercial-game: [mbaske/ml-selfplay-fighter](https://github.com/mbaske/ml-selfplay-fighter) (Unity ML-Agents self-play boxing, listing only, not inspected); [Unity self-play blog](https://unity.com/blog/engine-platform/training-intelligent-adversaries-using-self-play-with-ml-agents); [ReCIBE fighting-game agent paper](https://recibe.cucei.udg.mx/index.php/ReCIBE/article/view/379).
- Generic technique (no source checked): virtual controller via vJoy/ViGEm (Windows) or uinput (Linux), RPCS3 accepts pad input, plus screen capture or memory reads for state. The FNC Reborn input layer (it hides short controller disconnects, per HOW_IT_WORKS) may behave well with a virtual pad but this is untested.

## Could not verify / next steps
- Read the psx-place thread (try a real browser or Google cache); contact 2banditos.
- Check rpcs3.net compat entry and RPCS3 `bin/Patches` repo for BLUS30608/BLES01140 in a browser.
- Find who makes "Fight Night Forever" (the YouTube link above); ask whether it touches AI.
- Check the FNC Reborn issues/discussions and `docs/` for hooks that reach the AI/controller layer; test a virtual pad against it.
- Search Operation Sports and GBAtemp directly for FN Champion roster/attribute editing.
