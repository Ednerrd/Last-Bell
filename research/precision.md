# Precision Boxing Shorts: notes for the brain

Source: Precision Boxing (YouTube Shorts, coach explainers). Our own notes in our own words. Engine names in brackets are from the old AI (retired Oct 16); map them onto the plug-in brain (`docs/PLUGIN.md`) when building. Overlaps already built: setups and traps (show, bank, draw, delay, vary), f1b clamped elbows, f2 World-class bait. raw transcripts not kept.
Shortlist: `tools/precision/SHORTLIST.md`. Batch 1 = Ed's top 5 (Oct 19).

## 1. Collecting data (TEMPO feel-out, MEMV, F.mem)
- Early on, a smart fighter runs **safe probes** just to see the reaction, not to land: a short single jab then move the head, step in then straight back out, come forward with the guard high and throw nothing.
- He's reading three things: does the other man **counter** (and how fast), **evade/retreat**, or **cover and hold his ground**? Plus his patterns and where he's open.
- The answer changes the plan: retreats → you have to cut him off; covers → you can work; counters on your jab → now you know his timing, open up off it.
- Have today: a feel-out phase (`TEMPO.feel1/feelN`) that's jabs and feints, and memory that replaces the scouting report with what he's seen (`MEMV.seen`).
- Idea: make the feel-out *ask questions on purpose*. Each probe gets tagged with the reaction it drew (counter / evade / cover), and that tag sets the plan: a counter-heavy reaction → feint first and draw it; retreat → cut the ring; cover → body work. Higher ring IQ = fewer probes needed.

## 2. Every guard covers some things and opens others (GUARDS)
- No guard is a frozen pose. It shuts certain doors and you have to **move** to cover the rest.
  - High guard: body more open, has to go get body shots.
  - Peekaboo: top of the head more open, has to rely on head movement.
  - Tight middle guard (Soviet-style): middle shut, hooks around the side are the threat; answer is move or pull back.
  - Philly shell: rear side open; answer is dip, turn, pull. It's also an in-and-out guard, weak at side-to-side pressure.
  - Cross-arm: vs body shots, bring the arm in (it turns into a forward-facing shell), move, and **expect the lead hook** next.
- Have today: per-guard zone and punch multipliers and a defense mix (`GUARDS.*.def`).
- Idea: guards fold into a second shape when the hole is attacked (cross-arm → shell vs body work), at the cost of a new hole. Also check the Philly shell is weaker at lateral pressure than standard.

## 3. Breaking rhythm (TEMPO, rhythm)
- Every fighter has a natural cadence, usually his top speed. Steady cadence is easy to read: he's either punching or not.
- **Breaking it**: a little delay or hitch inside the combo (1, pause, 2), or punch, small step/shift/cover, punch again. The other man thinks it's over, drops his guard, and eats the late one.
- Cost: the gap is a window to get hit. Only works if you're watching.
- Idea: a "hitch" option in combos: a short pause before the last punch. Bonus to land if the defender has lowered his guard / started his reply; risk that he counters into the gap. Higher for awkward and feint-master styles, IQ-gated.

## 4. Same-side counter (pickCounter, react)
- The moment a hook or right hand touches the guard, fire back **with the same side that just blocked**, short and straight, almost like an elbow with a fist. Super tight range.
- The skill is doing it from uncomfortably close; most people only drill longer, looping counters.
- Idea: a block-then-counter where the arm that took the punch throws straight back (lead block → short lead straight/hook; rear block → short rear straight). Fast, short range, low power. Counter-punchers and Philly-type guards favor it.

## 5. Beating the machine-gun puncher (STYLES.volume, swarmer)
- First answer is **gas**: if he simply outworks you, it's a conditioning problem.
- Style answers:
  - **Lateral movement**: don't be standing where he's punching. Circle and fight off the move.
  - Or **counter + head movement**: cover the burst, counter into the side his last punch left open (often right after his last right hand), then **move the head or get out**. Don't stay there trading.
- Idea: vs volume/swarmer styles, the AI leans into lateral movement (circ up) if it has the legs, else "cover, same-side counter on his last punch, then exit". Ties into #4.

## Takeaways for ROADMAP
- Probing feel-out that tags reactions (1), guards that shift shape and open a new hole (2), rhythm hitches (3), same-side counter (4), anti-volume game plan (5).
- Overlaps with Arena batch 1 (`research/arena.md`): feints + rhythm hitch go together; straight-down-the-middle + same-side counter go together.
- All engine changes: sims before/after per CLAUDE.md.
