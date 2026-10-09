# Last Bell: vision (Ed's words, Oct 9 2026)

This is the source of truth for what the game is. `GAME.md` and `FOUNDATION.md` serve this page. If they disagree with it, this page wins.

---

**Unofficial name of the game** - Last Bell (subject to final change)

**General main Idea** - 3D Autoboxing mobile video game inspired by games like fight night series and vr boxing thrill of the fight, and other boxing games alike. Ran by a smart adaptive boxing AI that keeps the fights different every single time. Every boxer has a uniqueness that keeps the game fresh and fights not the same. From beginner boxers to elite and worldclass, each with styles, traits, and thinking that you will have adjust fighting to win. Some fights will be easy, some will be difficult, as in boxing, all it takes is that one punch even if your up, boxing is unpredictable.

**Main gameplay story** - You are a new official licenced boxing coach. You put your whole life into now owning a startup boxing gym. You first start up with the beginners, and as you gain recognition and fame, intermediate, elite, worldclass would want you in their corner.

Before fights, you train your fighters, get them ready for their fight night. Sparring, mits, heavy bag, cardio. Make sure not to overtrain! Have them learn new combos, new stances, new blocking techniques, but only special ones you can get by beating the very top!

**Gameplay and AI** - the main goal is to create an AI Boxing engine, that makes that fighter adapt and learn from fighting / sparring. Whether it's Orthodox vs southpaw and how they adapt, to how to fight off a slugger as a outboxer. In real boxing, fighters come in with a game plan, but sometimes it doesn't work out and the coach (you) have to tell your fighters to do this instead. AI engine will determine (or try to) the best combos, and ways to adjust and fight on the fly. How to get around certain guards, clinch to survive etc.

Plus there's levels to this, so new fights will get demolished fighting an elite class, so difficulty will be scalable.

---

## Ed's calls (Oct 9 2026, his answers)

1. **Shouts during the round:** "Yeah you can shout during, and he'll follow it, but only a short duration before he's back to his self. He always listens, but it can be a chance he will ignore you (depending on relationship or the type of fighter he is)."
2. **The business:** "Yeah, you gotta maintain that gym, more wins, more high value fights, give you upgrades and such."
3. **Fighters leaving:** "Absolutely, the fighter can leave you and even be your rival! Mostly if they just lose alot by x amount of times. Not going into the whole fighting a contract with promotors. And yes they can retire."
4. **Stablemates fighting each other:** "Rarely, but no."
5. **The end game:** "Similar to like retrobowl, you can aim for HOF, get a fighter in every division, keeps going until you retire your created coach."
6. **Upsets:** "Whatever makes sense, research stats, but in general."
7. **Watching fights:** "your the coach so you gotta be there for fights, sure you can spectate different fights. You can sim forward if you don't want to sit through specific matches."

### What that means for the build (Claude's reading; Ed corrects)
- **Shouts.**
  - A shout works for a short window, then he drifts back to his own style.
  - He usually listens. The chance he ignores you goes up with a bad relationship or a stubborn type (ego).
  - So a **relationship** value per fighter is in. That's v1's parked bond/trust, now a core system.
- **The gym is a business.**
  - Upkeep is paid from purses.
  - Wins bring bigger fights, and bigger fights bring money and upgrades.
  - The gym can struggle.
- **Fighters can leave and become your rival.**
  - The main trigger is losing a lot (X losses, a streak), with the relationship as a factor.
  - A fighter who left joins the world and can fight your guys.
  - Retirement is in.
  - No promoter contracts or legal fights.
- **No stablemate vs. stablemate fights.** They never get matched.
- **A coach career like Retro Bowl.**
  - You create a coach.
  - The goals are the Hall of Fame and a fighter in (a champ in?) every division.
  - It runs until you retire the coach.
  - So a coach profile, a legacy score and HOF criteria are in.
- **Upsets** come from the research (pending).
- **Fight night.**
  - You're in the corner for your own fighters' fights, with sim-forward to skip one.
  - Watching any other fight in the world is an option.
