/* ===== LAST BELL : boxer brain =====
   The AI inside a boxer's head. Renderer-agnostic: no DOM, no canvas, no engine globals.
   The game passes what is true on screen (perception). The brain's own eyes, nerves and gas tank add the error:
   it sees punches late, misreads them, bites on feints, forgets, gets scared, gets frustrated, gets tired.

   const b = BoxerBrain.create(profile, { rng })   // profile from BoxerBrain.makeProfile({ style, tier })
   each frame:        const act = b.think(perception, dt)   // see README.md for both shapes
   between rounds:    const note = b.rest(info)
   Distances are in the engine's units (a jab reaches 78, a hook 60, ring ropes at +-146). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BoxerBrain = factory();
})(typeof self !== 'undefined' ? self : this, function () {
'use strict';

const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
function mulberry32(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const gaussR = R => { let u = 0, v = 0; while (!u) u = R(); while (!v) v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
function wpickR(R, items, wfn) {
  let tot = 0; const ws = items.map(i => { const w = Math.max(0, wfn(i)); tot += w; return w; });
  if (tot <= 0) return null;
  let r = R() * tot;
  for (let i = 0; i < items.length; i++) { r -= ws[i]; if (r <= 0) return items[i]; }
  return items[items.length - 1];
}

/* ---------- the punches (same names and numbers as the engine) ---------- */
const PUNCHES = {
  jab:       { num: '1',  kind: 'straight', zone: 'head', arm: 'lead', cat: 'jab',   min: 36, max: 78, dur: .30, dmg: 1.5, cost: 1.0 },
  cross:     { num: '2',  kind: 'straight', zone: 'head', arm: 'rear', cat: 'power', min: 36, max: 76, dur: .40, dmg: 3.6, cost: 2.2 },
  hook:      { num: '3',  kind: 'hook',     zone: 'head', arm: 'lead', cat: 'power', min: 22, max: 60, dur: .46, dmg: 4.2, cost: 2.6 },
  rhook:     { num: '4',  kind: 'hook',     zone: 'head', arm: 'rear', cat: 'power', min: 20, max: 56, dur: .50, dmg: 4.4, cost: 2.8 },
  lupper:    { num: '5',  kind: 'upper',    zone: 'head', arm: 'lead', cat: 'power', min: 16, max: 50, dur: .42, dmg: 3.9, cost: 2.4 },
  uppercut:  { num: '6',  kind: 'upper',    zone: 'head', arm: 'rear', cat: 'power', min: 18, max: 54, dur: .48, dmg: 4.6, cost: 2.8 },
  bodyJab:   { num: '1b', kind: 'straight', zone: 'body', arm: 'lead', cat: 'body',  min: 34, max: 76, dur: .32, dmg: 1.4, cost: 1.0 },
  bodyCross: { num: '2b', kind: 'straight', zone: 'body', arm: 'rear', cat: 'body',  min: 34, max: 72, dur: .42, dmg: 3.3, cost: 2.2 },
  bodyHook:  { num: '3b', kind: 'hook',     zone: 'body', arm: 'lead', cat: 'body',  min: 20, max: 58, dur: .48, dmg: 3.9, cost: 2.6 }
};
const PTYPES = Object.keys(PUNCHES);
const NUM = {}; for (const k of PTYPES) NUM[PUNCHES[k].num] = k;
const kindOf = p => PUNCHES[p].zone === 'body' ? 'body' : PUNCHES[p].kind; // straight / hook / upper / body
// the combo book, in trainers' numbers (research/mind_combos.md). Hands alternate (each punch cocks the next), levels and lines change;
// same-hand doubles (1-1, 3b-3, 3-3b) are on purpose. Atlas' 1b-2-3 ("knock knock"), Canelo/Inoue's 1-2-3b-3, Inoue's 5-3b (lift the guard, then the liver),
// Crawford's 2-1, Loma's 1-3b-6, the inside rips 6-3-6 / 3b-6-3, Tyson's 6-3
const BOOK = ['1', '1-1', '1-2', '1-1-2', '1-2-3', '1-2-3-2', '1-2-3b', '1-1-1', '2', '3', '2-3', '3-2', '1-2b', '1b-2', '3b', '3b-3',
  '2-3-2', '1-6-3', '5-2', '3-6', '6-3', '2b-3', '3b-2', '1-2-5-2', '1-3b-6', '4', '2-3b', '1-2-1', '3-3b', '1b', '2b', '3-4-3b',
  '1b-2-3', '1-2-3b-3', '5-3b', '2-1', '6-3-6', '3b-6-3'];
const COMBOS = BOOK.map(s => {
  const ps = s.split('-').map(n => NUM[n]), n = ps.length, cnt = c => ps.filter(p => PUNCHES[p].cat === c).length / n;
  const head = p => PUNCHES[p].zone === 'head', last = ps[n - 1];
  return { id: s, ps, n, jab: cnt('jab'), power: cnt('power'), body: cnt('body'), min: PUNCHES[ps[0]].min, max: PUNCHES[ps[0]].max,
    endLead: PUNCHES[last].arm === 'lead' && last !== 'jab',                                         // ends on the lead hook: he's back in his stance first
    endRear: PUNCHES[last].arm === 'rear',                                                           // ends square, in range
    lowHigh: ps.some((p, i) => i < n - 1 && (!head(p) || PUNCHES[p].kind === 'upper')) && head(last), // lift or dig first, then upstairs
    inside: PUNCHES[ps[0]].max <= 60,
    str: ps.filter(p => PUNCHES[p].kind === 'straight').length / n, up: ps.filter(p => PUNCHES[p].kind === 'upper').length / n, // straight down the pipe vs the uppercut through a shell
    wide: ps.filter(p => p === 'rhook').length / n, hook: ps.filter(p => p === 'hook' || p === 'rhook').length / n };
});

/* ---------- skills: what he knows how to do (0..100). The tier is read off them ---------- */
const SKILLS = {
  offense: ['jab', 'power', 'combos', 'body', 'feints'],
  defense: ['block', 'slip', 'footwork', 'clinch'],
  ringcraft: ['cutoff', 'ropes', 'range', 'angles'],
  iq: ['counter', 'read', 'pacing', 'adjust']
};
const SKILL_KEYS = [].concat(...Object.values(SKILLS));
const TIERS = [
  { key: 'novice', label: 'Novice', min: 0, center: 34 },
  { key: 'intermediate', label: 'Intermediate', min: 46, center: 56 },
  { key: 'pro', label: 'Pro', min: 66, center: 74 },
  { key: 'world', label: 'World class', min: 84, center: 90 }
];
function tierOf(skills) { const v = SKILL_KEYS.reduce((s, k) => s + (skills[k] || 0), 0) / SKILL_KEYS.length; let t = TIERS[0]; for (const x of TIERS) if (v >= x.min) t = x; return { key: t.key, label: t.label, avg: Math.round(v) }; }

/* ---------- traits: how he LIKES to fight (0..1). Skill says how well ----------
   diet:     output (work rate), jab (jab hunger), power (sits down on shots vs flicks), body (goes downstairs), combo (length)
   lead/ctr: initiative (1 starts it, 0 waits to make you pay), patience (waits for the right shot)
   defense:  shell (gloves and arms), slip (head movement), legs (gets out of range), clinch (ties up)
   nerve:    composure (thinks straight hurt or losing), risk (trades), killer (finishes a hurt man)
   ring:     range (0 lives inside, 1 lives at the end of the jab), circle (moves laterally) */
const TRAIT_KEYS = ['output', 'jab', 'power', 'body', 'combo', 'initiative', 'patience', 'shell', 'slip', 'legs', 'clinch', 'composure', 'risk', 'killer', 'range', 'circle'];
const STYLES = {
  outboxer:     { label: 'Out-boxer',       t: { output: .55, jab: .85, power: .35, body: .25, combo: .4, initiative: .55, patience: .6, shell: .3, slip: .5, legs: .85, clinch: .35, composure: .6, risk: .3, killer: .4, range: .9, circle: .8 },
                  sk: { jab: 10, footwork: 10, range: 10, angles: 6, power: -6, cutoff: -8, clinch: -2 } },
  slugger:      { label: 'Slugger',         t: { output: .42, jab: .3, power: .9, body: .45, combo: .35, initiative: .75, patience: .35, shell: .75, slip: .25, legs: .2, clinch: .4, composure: .5, risk: .8, killer: .9, range: .3, circle: .2 },
                  sk: { power: 12, cutoff: 6, slip: -8, footwork: -8, jab: -6, angles: -4 } },
  swarmer:      { label: 'Swarmer',         t: { output: .9, jab: .35, power: .55, body: .7, combo: .85, initiative: .9, patience: .15, shell: .72, slip: .65, legs: .2, clinch: .3, composure: .78, risk: .7, killer: .7, range: .08, circle: .35 },
                  sk: { combos: 10, body: 10, cutoff: 10, slip: 12, block: 10, pacing: 4, range: -4, footwork: -4, jab: -4 } },
  counter:      { label: 'Counter-puncher', t: { output: .35, jab: .5, power: .55, body: .3, combo: .4, initiative: .15, patience: .9, shell: .45, slip: .8, legs: .55, clinch: .4, composure: .8, risk: .35, killer: .5, range: .65, circle: .55 },
                  sk: { counter: 12, read: 8, slip: 8, block: 2, combos: -6, cutoff: -8, body: -4 } },
  boxerpuncher: { label: 'Boxer-puncher',   t: { output: .66, jab: .6, power: .66, body: .45, combo: .55, initiative: .6, patience: .55, shell: .5, slip: .5, legs: .5, clinch: .4, composure: .65, risk: .5, killer: .7, range: .55, circle: .5 },
                  sk: { power: 6, jab: 6, combos: 5, adjust: 6, read: 4 } }
};
const STYLE_KEYS = Object.keys(STYLES);

// one call makes a unique boxer: a style's DNA, his tier's skill level, and his own quirks on top
function makeProfile(o) {
  o = o || {};
  const R = o.rng || (o.seed != null ? mulberry32(o.seed) : Math.random), g = () => gaussR(R);
  const style = STYLES[o.style] ? o.style : STYLE_KEYS[Math.floor(R() * STYLE_KEYS.length)];
  const tier = TIERS.find(t => t.key === o.tier) || TIERS[1 + Math.floor(R() * 3)], S = STYLES[style], u = o.uniq == null ? 1 : o.uniq;
  const traits = {}, skills = {};
  for (const k of TRAIT_KEYS) traits[k] = clamp(S.t[k] + g() * .09 * u, 0, 1);
  const lean = g() * 4 * u; // some men are a little better than their tier, some a little worse
  for (const k of SKILL_KEYS) skills[k] = Math.round(clamp(tier.center + lean + (S.sk[k] || 0) * (tier.center / 74) + g() * 6 * u, 5, 99));
  if (o.traits) Object.assign(traits, o.traits);
  if (o.skills) Object.assign(skills, o.skills);
  return { name: o.name || S.label, style, styleLabel: S.label, tier: tierOf(skills), traits, skills, stats: Object.assign({}, o.stats || {}) };
}

/* ---------- tunables (the brain's knobs, one place) ---------- */
const BR = {
  spreadOwn: 1,           // how much his own strengths and holes count (1 = full size)
  spread: .6,             // squeezes how much a skill point is worth (1 = as is; lower = closer tiers, more upsets)
  react: [.34, .14],      // reaction time to a punch, novice .. world class (s)
  reactFat: .5, reactFear: .3, reactHurt: .35, jitter: .2,
  antic: .6,              // a read punch is seen this much sooner
  antPrior: [30, 10],     // evidence before a habit read means anything, novice .. world class (he downloads you over rounds, not seconds)

  tellSee: .07,           // a big tell is seen this much sooner (s per unit tell)
  moveT: .05,             // the least time a defense needs before the punch lands
  tryDef: [.5, .93],      // chance he tries to defend at all once he sees it
  misread: .4,            // misread chance at zero read skill
  defQ: .3,              // defense quality floor: even a novice's slip works sometimes
  biteRead: .55,          // how well a reader spots a feint
  decT: [.55, .24],       // time between offense decisions, novice .. world class
  throwP: .058,           // base chance per decision to let his hands go (times output)
  feintP: .05,            // base chance per decision to feint
  setupP: .16,            // chance a smart man picks a planned sequence instead of a single combo
  ctrP: [.06, .75],       // chance to counter after a defense works, by counter skill
  memTau: [25, 120], memNotice: [.35, 1], memPrior: 4,
  outShort: 14,           // novice distance misjudgment (units)
  reachStep: 6, reachLo: .08,
  workS: 8, workH: 16, workW: 13, workLo: .25, // a combo's working range: how far inside its reach a straight / a hook lands best, how wide, the floor outside it
 // a combo punch that can't reach from here (with the step he gets on the first one): weight left for a man with a perfect eye
  rushV: 48, rushP: 1,  // a man coming in faster than this (units/s) can be met with a check hook: chance per second at full counter skill
  jabCtr: .5,             // counter chance off a jab (it's back before you are)
  shortCtr: .5,           // a punch that fell short is a counter chance this often (the pull counter)
  stealT: 30,             // the last 30 s, where rounds get stolen
  hurtQ: .25,             // a hurt man's defense works this much worse
  fuse: { gas: .5, w: 1.5, liver: .5 }, // under this much gas he digs: body weight up to x(1 + w), the 3b on top
  // clarity: damage taken (this round's and the wear), and knockdowns, blur the eye. blur 0..1 -> reaction x(1 + react), misreads x(1 + mis), defense quality x(1 - q)
  blur: { cur: .5, wear: 2.5, late: 0, kd: .25, react: .5, mis: 2, q: .35, at: .5 }, // at: damage below this share of his head doesn't count. late: by the last round (the championship rounds)
  tunnel: { hunt: .5, huntSafe: .12, check: .1 }, // going for the finish, he sees the counter late
  // finishing (research/mind_finish.md 4a). Spell times in clock seconds (moods' time), looks in real seconds
  fin: { confirm: [2.4, .6],  // check-then-commit: a short look with straight shots first (clock s, slow read .. fast read)
    reckless: .5,             // x killer x (1 - composure): skips the check and goes all-out
    burst: [3, 6], look: [.15, .3], // flurry length (punches), then a reset look (s)
    commit: { hunt: .6, huntSafe: .3 }, // how much harder he sits down on it finishing (commit can go past 1 here: more damage, more gas)
    cap: 11, gasSafe: .35, gasOut: .2, // all-out cap per hurt spell (clock s); under this much gas the all-out hunt turns safe, then stops
    late: 20, lateX: 2,       // round time left (clock s) where he goes now, chance x
    shellBody: 2, shellUpper: 1.6, runHook: 1.3, // into a shell: dig and come up the middle; hooks catch a runner
    safePow: .5, safeStr: 1.5, safeWide: .6,     // the safe hunt: short and straight, no wide ones
    falseAlarm: .15,          // x (1 - read): a big shot lands and he thinks the man is hurt when he isn't
    baitCtr: 1.5, fireCtr: 1.2, ctrCommit: .4, // the hurt man's counter vs a hunter who dropped his hands, and how hard he sits down on it
    kdChase: 2,               // the man who scored the knockdown goes after him on the resume
    wob: 6, wobHead: .55,     // he saw him hurt this recently (clock s) and the man's still beat up: he's still hurt, keep going
    kdWob: 10 },              // he just got up off the floor: he's hurt, whatever he shows (clock s after the resume)
  // surviving (4b)
  surv: { hurtT: [12, 5],     // how long the hurt lasts in his head (clock s, composure 0 .. 1)
    hitAdd: 1, hurtMax: 15,   // each clean shot while hurt adds to it
    second: [1, 2], freeze: [.3, .8], // the second pick, freeze cap (clock s)
    steady: .7, clinchNear: .5, flipAt: 3, shellFlip: .4,
    late: 20, lateRun: 1.5, lateFire: .6, despFire: 1.8,
    kdFire: 2, kdShell: 1.5,  // after a knockdown: composure decides, fire back harder or shell
    after: 8, rally: .2 },    // after a knockdown: more range rest of the round (and the next, unless he's composed: then more initiative)
  desp: { last: 3, out: .35, commit: .2, power: .6, wide: .5, hunt: 1 } // behind on his cards in the last 3 rounds: risk, killer, output up (Walker, Wardley)
};
// intent modes: each lasts seconds, not one roll. aggr: how often he lets go. range: offset from his range. guard: how high the hands sit
const MODES = {
  feelout: { aggr: .35, range: 6, guard: .6, lat: .7 },
  work:    { aggr: 1, range: 0, guard: .6, lat: .6 },
  press:   { aggr: 1.25, range: -10, guard: .65, lat: .2, cut: 1 },
  burst:   { aggr: 4.2, range: -9, guard: .4, lat: .2 },
  reset:   { aggr: .12, range: 16, guard: .7, lat: 1 },
  counter: { aggr: .35, range: 2, guard: .75, lat: .5, ctr: 2 },
  hunt:    { aggr: 3, range: -14, guard: .45, lat: .1, cut: 1 },        // all-out
  huntSafe:{ aggr: 1.8, range: -8, guard: .7, lat: .15, cut: 1 },       // finish behind a guard, short straight shots
  check:   { aggr: 1.5, range: -6, guard: .65, lat: .2, cut: 1 },       // is he really hurt? one or two straight ones first
  survive: { aggr: .25, range: 20, guard: 1, lat: .9 }
};
// hurt: what he does with it (survive's own numbers by answer)
const SURV = {
  shell:  { aggr: .15, range: 12, guard: 1, lat: .4 },
  run:    { aggr: .2, range: 24, guard: .85, lat: 1 },
  fire:   { aggr: 1.5, range: 0, guard: .5, lat: .3, ctr: 1.5 },
  clinch: { aggr: .15, range: 0, guard: .95, lat: .4 },
  freeze: { aggr: .03, range: 0, guard: .45, lat: 0 },
  steady: { aggr: .6, range: 4, guard: .85, lat: .7 },                   // bites down, keeps the jab going
  bait:   { aggr: .3, range: 0, guard: .8, lat: .2, ctr: 2 }               // a counterpuncher plays possum for the overcommit
};
const HUNTS = { hunt: 1, huntSafe: 1, check: 1 };
// how much of a punch gets through each defense: a man who slips everything is open for hooks, a ducker eats uppercuts
const DEF_THRU = {
  none:  { straight: 1, hook: 1, upper: 1, body: 1 },
  block: { straight: .3, hook: .35, upper: .65, body: .4 },
  slip:  { straight: .1, hook: 1.15, upper: .8, body: 1 },
  duck:  { straight: .5, hook: .1, upper: 1.3, body: 1 },
  pull:  { straight: .3, hook: .35, upper: .45, body: .6 },
  roll:  { straight: .3, hook: .55, upper: .9, body: .7 }
};
// which defense fits which punch (for a man who called it)
const DEF_BEST = { straight: 'slip', hook: 'duck', upper: 'pull', body: 'block' };
// the counter book: WHAT he threw x HOW I got out of it -> the answer (research/mind_combos.md §3). [combo, weight, what it is]
// straights: slip outside the jab and come over it with the 2; catch it and shoot the 2; pull back and fire the 2 (Mayweather). Slip the 2: hook off the slip.
// hooks: a straight down the middle beats a wide one; duck it and come up the middle (6-3) or back with your own hook. Uppercuts drop his guard on that side: hook over the top.
// body shots: he dipped to reach, so the uppercut (or a stiff jab then the 6) when close, the 2 from range. He fell short: pull counter, or chase him with 2-1 (Crawford)
const CB = (s, w, why) => [s.split('-').map(n => NUM[n]), w, why];
const COUNTER_BOOK = {
  jab:      { slip: [CB('2', 3, 'right hand over the jab'), CB('2-3', 1.5, 'slip the jab, 2-3'), CB('3', .8, 'slip inside, hook')],
              block: [CB('2', 3, 'catch and shoot'), CB('1-2', 1, 'catch it, 1-2 back')], roll: [CB('2', 3, 'roll the jab, fire the right'), CB('2-3', 1, 'roll and 2-3')],
              pull: [CB('2', 3, 'pull counter'), CB('2-3', 1, 'pull counter, 2-3')], duck: [CB('2b', 1.5, 'under the jab, right to the body'), CB('2b-3', 1, 'under it, 2b-3')] },
  straight: { slip: [CB('3', 3, 'slip the right hand, hook'), CB('3-2', 2, 'slip, 3-2'), CB('3b', 1, 'slip, hook to the body')],
              block: [CB('3', 2, 'block the right, hook back'), CB('3-2', 1, 'block, 3-2')], roll: [CB('2', 3, 'shoulder roll, right hand back'), CB('2-3', 1.5, 'roll, 2-3')],
              pull: [CB('2', 2.5, 'pull counter'), CB('1-2', 1, 'pull, 1-2')], duck: [CB('3b', 1.5, 'duck, hook to the body'), CB('6-3', 1.5, 'duck, come up the middle')],
              jab: [CB('1-2', 1, 'counter jab, then the 2')] },
  hook:     { duck: [CB('6-3', 2.5, 'duck the hook, up the middle'), CB('3', 1.5, 'duck, hook back'), CB('2', 1, 'duck, right hand')],
              roll: [CB('3-2', 2, 'roll under, 3-2'), CB('2', 1, 'roll under, right hand')], block: [CB('2', 3, 'straight inside the hook'), CB('2-3', 1.5, 'block, 2-3')],
              pull: [CB('2', 3, 'he missed wide, right down the middle'), CB('1-2', 1, 'pull, 1-2')], slip: [CB('2', 2, 'straight inside the hook')] },
  upper:    { any: [CB('3', 3, 'hook over the uppercut'), CB('3-2', 1.5, 'over the top, 3-2'), CB('2', 1, 'right over the uppercut')] },
  body:     { close: [CB('6-3', 2.5, 'he dipped: uppercut'), CB('6', 1.5, 'he bent to reach: uppercut'), CB('3', 1, 'hook to the head')],
              far: [CB('1-6', 1.5, 'stiff jab, then the uppercut'), CB('2', 2, 'right hand while he digs'), CB('1-2', 1, '1-2 while he digs')] },
  short:    { any: [CB('2', 3, 'pull counter: he fell short'), CB('2-1', 1.2, 'chase him back, 2-1'), CB('1-2', 1, 'he fell short, 1-2')] },
  rush:     { any: [CB('3', 3, 'check hook'), CB('1', 1.5, 'jab him on the way in')] }   // he runs in head first: hook and pivot off the line
};
const DEF_SKILL = { block: 'block', slip: 'slip', duck: 'slip', pull: 'footwork', roll: 'block' };

class Brain {
  constructor(profile, opts) {
    opts = opts || {};
    this.p = profile; this.R = opts.rng || Math.random; this.debug = !!opts.debug;
    this.pace = opts.pace || 1; // a game whose rounds run faster than the clock (the Last Bell engine: 3) squeezes the slow things (moods, memory, intent modes) and keeps the work rate per round; reactions stay human
    // spread squeezes his overall level (how far apart the tiers play) but keeps his own strengths full size: a counter-puncher's counter stays his edge
    const raw = s => (profile.skills[s] == null ? 50 : profile.skills[s]) / 100, avg = SKILL_KEYS.reduce((t, s) => t + raw(s), 0) / SKILL_KEYS.length, lvl = .5 + (avg - .5) * BR.spread;
    this.k = {}; for (const s of SKILL_KEYS) this.k[s] = clamp(lvl + (raw(s) - avg) * BR.spreadOwn, 0, 1);
    this.tr = Object.assign({}, STYLES.boxerpuncher.t, profile.traits);
    const k = this.k;
    this.iq = (k.read + k.counter + k.pacing + k.adjust) / 4;
    this.t = 0; this.mode = 'feelout'; this.modeT = 0; this.decT = .3; this.hurtResp = null;
    this.ct = 0; this.desp = 0; this.wary = null; this.blur = 0; this.kds = 0; // clock time (s), late desperation, range kept after a hurt
    this.h = { t0: -99, end: -99, n: 0, goal: 4, look: -9, kdBy: -99, kdMe: -99, ctrd: -99, chk: 0, falseA: 0, unans: 0, flip: 0, second: 0, freezeEnd: 0, kdR: 0 }; // the hunt and the hurt
    this.mem = { mine: {}, his: {}, lead: {}, after: {}, def: {}, hurt: {}, feints: 0 };
    this.emo = { conf: 0, frus: 0, fear: 0 };
    this.plan = { jab: 0, power: 0, body: 0, range: 0, initiative: 0 }; // between-round changes
    this.queue = null; this.setup = null; this.hist = [];
    this.threat = null; this.lastHisP = null; this.lastHisT = -9; this.lastMine = null; this.lastDef = null;
    this.rangeJit = 0; this.nd = 0; this.fat = 0; this.lat = (this.R() < .5 ? 1 : -1);
    this.sc = { me: 0, him: 0, lead: 0, rounds: [] }; // his own guess at the cards
    this.tel = { decisions: 0, holds: 0, throws: 0, feints: 0, setups: 0, counters: 0, seen: 0, late: 0, noTry: 0, misreads: 0, bites: 0, feintsRead: 0, antic: 0, reactSum: 0, reactN: 0, modeT: {}, techSum: 0, techN: 0, hunts: 0, hurts: 0, caught: 0, hurtR: {}, mThr: {}, mLand: {} };
    this.log = [];
    this.out = { intent: 'feelout', move: { range: 64, lateral: 0, cut: 0, clinch: false }, guard: .6, punch: null, defend: null, why: '' };
  }
  rnd(a, b) { return a + this.R() * (b - a); }
  mm() { return this.mode === 'survive' ? SURV[this.hurtResp] || MODES.survive : MODES[this.mode]; } // the numbers of what he's doing now
  g() { return gaussR(this.R); }
  note(s) { if (this.debug) this.log.push(this.t.toFixed(1) + ' ' + s); }

  /* ---------- memory: what he has seen of the other man. Everything fades; read skill sets how much he notices and how long it sticks ---------- */
  tau() { return lerp(BR.memTau[0], BR.memTau[1], this.k.read) / this.pace; }
  mget(tbl, key) { const e = tbl[key] || (tbl[key] = { t: this.t }), f = Math.exp(-(this.t - e.t) / this.tau()); if (f < 1) for (const x in e) if (x !== 't') e[x] *= f; e.t = this.t; return e; }
  madd(tbl, key, fields) { const e = this.mget(tbl, key), w = lerp(BR.memNotice[0], BR.memNotice[1], this.k.read); for (const x in fields) e[x] = (e[x] || 0) + fields[x] * w; return e; }
  mpeek(tbl, key) { const e = tbl[key]; if (!e) return null; const f = Math.exp(-(this.t - e.t) / this.tau()), o = {}; for (const x in e) if (x !== 't') o[x] = e[x] * f; return o; }
  // how good my punch p has been against this man: what lands, what gets countered, and what his defense habits leave open
  punchVal(p) {
    const m = this.mpeek(this.mem.mine, p), pr = BR.memPrior;
    let emp = 1;
    if (m && m.n > 0) emp = clamp(((m.l || 0) + pr * .3) / ((m.n || 0) + pr) / .3, .4, 2) / (1 + 1.5 * (m.c || 0) / ((m.n || 0) + pr));
    const d = this.mpeek(this.mem.def, kindOf(p)); let inf = 1;
    if (d && d.n > 1) { let thru = 0; for (const dk in DEF_THRU) thru += ((d[dk] || 0) / d.n) * DEF_THRU[dk][kindOf(p)]; const avg = .6; inf = clamp(lerp(1, thru / avg, Math.min(1, d.n / 8)), .5, 1.8); }
    return clamp(lerp(1, emp * .6 + inf * .4, this.k.read), .45, 1.9);
  }
  // how sure he is the coming punch is this one: what the man leads with, or what he throws after the last one
  predict(type) {
    const M = this.mem, recent = this.lastHisP && this.t - this.lastHisT < 1.2; let tot = 0, hit = 0;
    if (recent) { for (const key in M.after) if (key.startsWith(this.lastHisP + '>')) { const e = this.mpeek(M.after, key); tot += e.n; if (key === this.lastHisP + '>' + type) hit = e.n; } }
    else for (const p in M.lead) { const e = this.mpeek(M.lead, p); tot += e.n; if (p === type) hit = e.n; }
    const pr = lerp(BR.antPrior[0], BR.antPrior[1], this.k.read), base = 1 / PTYPES.length, q = (hit + pr * base) / (tot + pr);
    return clamp((q - base) / .45, 0, 1) * this.k.read * (PUNCHES[type].cat === 'jab' || type === 'bodyJab' ? .5 : 1);
  }
  // his best guess at what comes next (for misreads: a man who reads you hard gets fooled when you change it)
  expected() {
    let best = null, bv = 0;
    for (const p of PTYPES) { const v = this.predict(p); if (v > bv) { bv = v; best = p; } }
    return bv > .25 ? best : null;
  }

  /* ---------- what happened since last frame ---------- */
  hear(ev) {
    const E = this.emo, comp = this.tr.composure, pts = p => PUNCHES[p].cat === 'jab' ? .45 : PUNCHES[p].cat === 'body' ? .75 : 1;
    const guess = x => x * Math.max(0, 1 + this.g() * (1 - this.k.pacing) * .5); // his eye for the score
    if (ev.type === 'kd') {
      if (ev.by === 'me') { this.sc.me += 3; E.conf = clamp(E.conf + .3, -1, 1); this.h.kdBy = this.ct; }
      else { this.sc.him += 3; E.fear = clamp(E.fear + .4 * (1.25 - comp), 0, 1); E.conf = clamp(E.conf - .3, -1, 1); this.h.kdMe = this.ct; this.h.kdR = 1; this.h.kdUp = 1; this.kds++; } // he gets up hurt, whatever the legs say, and picks again
      return;
    }
    if (!PUNCHES[ev.p]) return;
    if (ev.by === 'me') {
      const p = ev.p, kd = kindOf(p);
      if (ev.type === 'feinted') { if (ev.bit) this.madd(this.mem.def, 'feint', { n: 1, bit: 1 }); else this.madd(this.mem.def, 'feint', { n: 1 }); if (ev.bit && this.setup && this.setup.onBite) this.setup.bit = ev.def || 'block'; return; }
      this.madd(this.mem.mine, p, { n: 1, l: ev.type === 'landed' ? 1 : 0, b: ev.type === 'blocked' ? 1 : 0, e: ev.type === 'evaded' ? 1 : 0 });
      if (ev.def) this.madd(this.mem.def, kd, { n: 1, [ev.def]: 1 }); else if (ev.type === 'landed') this.madd(this.mem.def, kd, { n: 1, none: 1 });
      this.lastMine = { p, t: this.t };
      if (ev.type === 'landed' && PUNCHES[p].zone === 'body') this.bodyL = (this.bodyL || 0) + 1; // body work in the bank
      if (ev.type === 'landed') {
        E.conf = clamp(E.conf + .05 * (ev.dmg || 2) / 3, -1, 1); E.frus = Math.max(0, E.frus - .04); this.sc.me += guess(pts(p)); if (ev.hurt) this.oppHurtT = this.t;
        this.h.unans = 0; if (this.mode === 'check') this.h.chk = 1;
        { const mk = this.mode === 'survive' ? 's:' + this.hurtResp : this.mode; this.tel.mLand[mk] = (this.tel.mLand[mk] || 0) + 1; }                              // the check shot landed
        if (!ev.hurt && (ev.dmg || 0) > 4 && this.R() < BR.fin.falseAlarm * (1 - this.k.read)) this.h.falseA = 1; // he thinks that one hurt him
      }
      else E.frus = clamp(E.frus + .022 * (1 - comp * .6), 0, 1);
      if (ev.type === 'blocked' && this.setup && this.setup.onBlock) this.setup.blocked = true;
    } else {
      const p = ev.p;
      if (ev.type === 'feinted') { if (ev.bit) this.tel.bites++; this.mem.feints = this.mem.feints * .9 + 1; return; }
      if (ev.type === 'landed') {
        const dmg = ev.dmg || 2;
        this.madd(this.mem.hurt, p, { d: dmg });
        E.conf = clamp(E.conf - .035 * dmg / 3, -1, 1); E.fear = clamp(E.fear + dmg / 90 * (1.25 - comp), 0, 1);
        this.sc.him += guess(pts(p));
        if (this.mode === 'survive') { if (PUNCHES[p].cat !== 'jab') this.h.unans++; this.modeT = Math.min(BR.surv.hurtMax, this.modeT + BR.surv.hitAdd); }
        if (ev.counter) { this.h.ctrd = this.ct; if (HUNTS[this.mode] && PUNCHES[p].cat !== 'jab' && !this.h.stung) { this.h.stung = 1; this.tel.stung = (this.tel.stung || 0) + 1; } } // walked onto one
        if (ev.counter && this.lastMine && this.t - this.lastMine.t < 1.5) { this.madd(this.mem.mine, this.lastMine.p, { c: 1 }); E.frus = clamp(E.frus + .04 * (1 - comp * .5), 0, 1); }
      }
      if (ev.type === 'evaded' || ev.type === 'blocked') { if (ev.def) this.lastDef = { def: ev.def, p, t: this.t }; this.tryCounter(ev.def, p); }
      else if (ev.type === 'missed' && ev.short && this.R() < BR.shortCtr) this.tryCounter('short', p); // he fell short: he's reaching, and coming back slow
    }
  }
  // a defense worked: does he make him pay?
  tryCounter(def, p) {
    const k = this.k, m = this.mm();
    let ch = lerp(BR.ctrP[0], BR.ctrP[1], k.counter) * (1.4 - 1.1 * clamp(this.tr.initiative + this.plan.initiative, 0, 1)) * (m.ctr || 1) * (1 - .5 * this.emo.fear);
    if (this.threat && this.threat.rd > .3) ch *= 1.3; // he called it: the counter is already loaded
    if (p && PUNCHES[p].cat === 'jab' || p === 'bodyJab') ch *= BR.jabCtr; // a jab snaps back: much harder to counter than a missed hook
    if (this.mode === 'survive') {
      const r = this.hurtResp; ch *= { shell: .3, run: .4, clinch: .3, freeze: .1 }[r] || 1;
      if ((r === 'fire' || r === 'bait') && this.hisG < .55) ch *= r === 'bait' ? BR.fin.baitCtr : BR.fin.fireCtr; // he came in with his hands down: the finisher gets caught
    }
    if (this.R() > ch) return;
    let c, why = 'counter';
    if (this.R() < .25 + .7 * k.counter) { const o = this.counterFor(def, p); if (o) { c = o[0].slice(); why = 'counter: ' + o[2]; if (c.length > 1 && this.R() > .3 + .6 * k.combos) c = c.slice(0, 1); } }
    if (!c) { const d = this.dNow == null ? 60 : this.dNow, ok = PTYPES.filter(x => PUNCHES[x].max + BR.reachStep >= d); c = [ok.length ? ok[Math.floor(this.R() * ok.length)] : 'jab']; } // he knows he should fire back, not with what (but he can see what reaches)
    this.queue = { ps: c, why, ctr: 1, at: this.t + lerp(.18, .02, k.counter) };
    this.tel.counters++;
  }

  // the textbook answer to what he threw and how I got out of it; a better counterpuncher picks it more surely, and only what reaches from here
  counterFor(def, p) {
    const P = PUNCHES[p], d = this.dNow == null ? 60 : this.dNow, k = this.k, B = COUNTER_BOOK;
    let row;
    if (def === 'short') row = B.short.any;
    else if (def === 'rush') row = B.rush.any;
    else if (P.zone === 'body') row = d < 54 ? B.body.close : B.body.far;
    else if (P.kind === 'upper') row = B.upper.any;
    else if (P.kind === 'hook') row = B.hook[def] || B.hook.block;
    else { const t = p === 'jab' ? B.jab : B.straight; row = (t[def] || t.block).concat(p !== 'jab' && k.counter > .6 ? B.straight.jab : []); }
    return wpickR(this.R, row, o => Math.pow(o[1], .5 + 1.5 * k.counter) * (d > PUNCHES[o[0][0]].max + BR.reachStep ? .1 : 1));
  }

  /* ---------- the eyes: a punch is coming ---------- */
  see(P) {
    const H = P.him.punch, k = this.k, E = this.emo;
    if (!H) { this.threat = null; return; }
    if (!this.threat || this.threat.id !== H.id) {
      // a new punch: when will he see it?
      const fat = 1 - P.me.stam / (P.me.stamMax || 100), hurt = P.me.hurt ? 1 : 0;
      let d = lerp(BR.react[0], BR.react[1], k.read * .5 + (k.slip + k.block) * .25);
      d *= (1 + BR.reactFat * fat) * (1 + BR.reactFear * E.fear) * (1 + BR.reactHurt * hurt) * (1 + BR.blur.react * this.blur) * (1 + (BR.tunnel[this.mode] || 0)) * Math.exp(this.g() * BR.jitter);
      const rd = H.feint ? this.predict(H.type) * .5 : this.predict(H.type);
      d *= 1 - BR.antic * rd;
      d -= BR.tellSee * (H.tell || 0);
      d = Math.max(.04, d);
      const start = this.t - (H.t || 0), deadline = H.feint ? start + .3 : this.t + (H.impactIn != null ? H.impactIn : .25);
      this.threat = { id: H.id, type: H.type, feint: !!H.feint, sell: H.sell || 0, start, at: start + d, deadline, rd, done: false };
      if (!H.feint) {
        // he files it: what this man throws, what he opens with, what follows what
        this.madd(this.mem.his, H.type, { n: 1 });
        if (this.lastHisP && this.t - this.lastHisT < 1.2) this.madd(this.mem.after, this.lastHisP + '>' + H.type, { n: 1 });
        else this.madd(this.mem.lead, H.type, { n: 1 });
        this.lastHisP = H.type; this.lastHisT = this.t;
      }
      this.tel.seen++;
      if (rd > .3) this.tel.antic++;
    }
    const T = this.threat, hurt = P.me.hurt || this.ct - this.h.kdMe < BR.fin.kdWob ? 1 : 0;
    if (T.done || this.t < T.at) return;
    T.done = true;
    if (T.at > T.deadline - BR.moveT) { this.tel.late++; return; } // never saw it
    this.tel.reactSum += T.at - T.start; this.tel.reactN++;
    if (T.feint) {
      // is it real? a reader who has seen his feints doesn't buy them; a feint master's still look real
      const spot = BR.biteRead * k.read * (.4 + .6 * Math.min(1, this.mem.feints / 6)) * (1 - .7 * T.sell);
      if (this.R() < spot) { this.tel.feintsRead++; this.note('read the feint'); return; }
    }
    let tryP = lerp(BR.tryDef[0], BR.tryDef[1], (k.block + k.slip + k.footwork) / 3) * (1 - .25 * E.frus);
    if (this.mode === 'burst' || this.mode === 'hunt') tryP *= .7; // busy punching
    else if (this.mode === 'huntSafe') tryP *= .9;
    if (this.mode === 'survive' && this.hurtResp === 'freeze') tryP *= .4;
    if (P.me.punching) tryP *= .3 + .45 * this.tr.slip; // a head-mover still moves his head mid-combo
    if (this.R() > tryP) { this.tel.noTry++; return; }
    // what does he think it is?
    let seenAs = T.type;
    const exp = this.expected();
    if (exp && exp !== T.type && this.R() < this.predict(exp) * .6) seenAs = exp; // he was sure it was the other one
    else if (this.R() < BR.misread * (1 - k.read) * (1 + .5 * (1 - P.me.stam / (P.me.stamMax || 100))) * (1 + BR.blur.mis * this.blur) * (1 - T.rd)) seenAs = PTYPES[Math.floor(this.R() * PTYPES.length)];
    if (seenAs !== T.type) this.tel.misreads++;
    const kd = kindOf(seenAs), tr = this.tr, best = DEF_BEST[kd], rd = seenAs === T.type ? T.rd : 0;
    const w = {
      block: (tr.shell * 1.3 + .2) * (.4 + k.block),
      slip: kd === 'straight' ? (tr.slip * 1.3 + .1) * (.3 + k.slip) : kd === 'upper' ? .1 : 0,
      duck: kd === 'hook' ? (tr.slip * 1.2 + .1) * (.3 + k.slip) : kd === 'straight' ? tr.slip * .3 : 0,
      pull: (tr.legs * 1.1 + .1) * (.3 + k.footwork),
      roll: kd === 'body' ? 0 : tr.shell * tr.slip * .8 * (.3 + k.block)
    };
    if (this.mode === 'survive' && (this.hurtResp === 'shell' || this.hurtResp === 'steady')) w.block *= this.hurtResp === 'shell' ? 3 : 1.6;
    if (this.mode === 'survive' && this.hurtResp === 'run') w.pull *= 3;
    const def = wpickR(this.R, Object.keys(w), x => w[x] * (x === best ? 1 + 2 * rd + k.read * .5 : 1)) || 'block';
    const q = clamp(lerp(BR.defQ, 1, k[DEF_SKILL[def]]) * (1 - .35 * (1 - P.me.stam / (P.me.stamMax || 100))) * (1 + .3 * rd) * (1 - .15 * E.frus) * (1 - BR.hurtQ * hurt) * (1 - BR.blur.q * this.blur), .05, 1); // hurt or beat up: the legs and the hands are slow
    this.out.defend = { kind: def, zone: PUNCHES[seenAs].zone, vs: seenAs, quality: q };
    this.note('defends ' + def + ' vs ' + seenAs + (seenAs !== T.type ? ' (it was a ' + T.type + ')' : '') + (T.feint ? ' (bit on a feint)' : ''));
  }

  /* ---------- the clock and the cards: does he need something? ---------- */
  need(P) {
    const left = Math.max(1, P.rounds - P.round + 1);
    let n = clamp(-this.sc.lead / left * .6, -1, 1);
    const tl = P.clock - (P.roundLen - BR.stealT);
    if (tl > 0) { const m = this.sc.me - this.sc.him; if (m < 2 && m > -6) n += .7 * tl / BR.stealT * (m > -3 ? 1 : .5); }
    return clamp(n, -1, 1) * lerp(.3, 1, this.k.pacing);
  }

  /* ---------- intent: what he's trying to do for the next few seconds ---------- */
  setMode(m, dur, why) { if (m !== this.mode) this.note('-> ' + m + (why ? ' (' + why + ')' : '')); this.mode = m; this.modeT = dur; }
  pickMode(P) {
    const tr = this.tr, E = this.emo, fat = 1 - P.me.stam / (P.me.stamMax || 100), nd = this.nd, ini = clamp(tr.initiative + this.plan.initiative, 0, 1);
    const inRange = P.dist < 84;
    const w = {
      work: 1,
      press: ini * (1 - tr.range) * 1.4 + Math.max(0, nd) * .6 + (P.ropes.him > .5 ? .5 : 0),
      burst: inRange ? tr.output * .7 + this.opening(P) * .8 + Math.max(0, nd) * .7 + Math.max(0, E.conf) * .3 + E.frus * (1 - tr.composure) * .6 : 0,
      counter: (1 - ini) * 1.5 + E.fear * .5 - Math.max(0, nd) * .4,
      reset: (1 - tr.output) * .35 + fat * .8 + tr.patience * .2 + E.fear * .3
    };
    if (this.desp) { w.press += this.desp * .8; w.burst += inRange ? this.desp * .6 : 0; w.counter *= 1 - .5 * this.desp; } // behind late: go get it
    if (this.mode === 'burst') { w.reset += tr.patience * 1.2 + (1 - tr.output); w.burst *= .3; }
    const m = wpickR(this.R, Object.keys(w), x => w[x]) || 'work';
    const dur = { work: this.rnd(4, 10), press: this.rnd(3, 8), burst: this.rnd(1.2, 2.5 + 2.5 * tr.output) * lerp(.7, 1.2, this.k.pacing * (1 - fat)), counter: this.rnd(3, 9), reset: this.rnd(1.5, 4) * (.6 + tr.patience) }[m];
    this.setMode(m, dur);
  }
  // how open the other man is right now (what he can see)
  opening(P) {
    const H = P.him, k = this.k; let o = 0;
    if (H.recover != null && H.recover < .5) o = Math.max(o, (H.lastRes === 'missed' || H.lastRes === 'evaded' ? 1 : .6) * lerp(.4, 1, k.counter)); // he just threw and he's coming back
    if (P.ropes.him > .6) o = Math.max(o, .5 * lerp(.5, 1, k.cutoff));
    if (H.gas < .35) o = Math.max(o, .4 * k.read);
    if (H.guard < .4) o = Math.max(o, .5 * k.read);
    if (H.hurt) o = Math.max(o, lerp(.5, 1, k.read));
    return o;
  }
  updMode(P, dt) {
    const tr = this.tr, H = this.h, hunting = HUNTS[this.mode];
    if (P.him.hurt) H.seen = this.ct;
    this.modeT -= dt; this.tel.modeT[this.mode] = (this.tel.modeT[this.mode] || 0) + dt;
    if (H.kdUp) { H.kdUp = 0; if (hunting) this.tel.caught++; this.survStart(P); return; } // off the floor
    if (P.me.hurt && this.mode !== 'survive') {
      if (hunting || this.ct - H.end < 2) this.tel.caught++; // walked onto one going for the finish
      if (hunting) H.end = this.ct;
      this.survStart(P); return;
    }
    if (this.mode === 'survive') { this.survUpd(P); return; }
    const offFloor = this.ct - H.kdBy < BR.fin.kdWob;
    if ((P.him.hurt || H.falseA || offFloor) && !hunting && P.me.stam / (P.me.stamMax || 100) > BR.fin.gasOut && this.ct - H.end > .5) {
      // he smells it. A killer goes; a careful man checks the other man can still punch
      const late = P.roundLen - P.clock < BR.fin.late;
      let go = tr.killer * lerp(.5, 1, this.k.read) * (1 - .4 * this.emo.fear) * (late ? BR.fin.lateX : 1) * (1 + BR.desp.hunt * this.desp);
      if (offFloor) go *= BR.fin.kdChase; // he just got up: go get him
      if (this.R() < go * dt * 4) { H.falseA = 0; this.huntStart(P, late || offFloor && this.R() < tr.killer); return; }
    }
    if (hunting) { this.huntUpd(P); return; }
    if (this.modeT <= 0) this.pickMode(P);
  }
  // is he still hurt? The engine's tells come and go; the man who saw it knows the legs aren't back yet
  wobbly(P) { if (P.him.hurt) this.h.seen = this.ct; return P.him.hurt || (this.ct - (this.h.seen || -99) < BR.fin.wob && P.him.head < BR.fin.wobHead) || this.ct - this.h.kdBy < BR.fin.kdWob; }
  // the hunt: check, then commit (all-out or behind a guard); flurries with a look in between; capped, and it costs gas
  huntStart(P, late) {
    const tr = this.tr, H = this.h;
    this.tel.hunts++; H.t0 = this.ct; H.n = 0; H.stung = 0; H.goal = Math.round(this.rnd(BR.fin.burst[0], BR.fin.burst[1] + tr.killer)); H.look = -9; H.chk = 0;
    const reckless = this.R() < BR.fin.reckless * tr.killer * (1 - tr.composure) + .3 * this.desp;
    if (reckless || late) { if (reckless) this.tel.reckless = (this.tel.reckless || 0) + 1; this.setMode('hunt', this.rnd(4, 8), late ? 'he is hurt, the bell is coming' : 'he is hurt: all in'); return; }
    this.tel.confirm = (this.tel.confirm || 0) + 1;
    this.setMode('check', lerp(BR.fin.confirm[0], BR.fin.confirm[1], this.k.read) * this.rnd(.8, 1.2), 'is he hurt?');
  }
  huntUpd(P) {
    const H = this.h, gas = P.me.stam / (P.me.stamMax || 100), F = BR.fin, hurt = this.wobbly(P);
    const stop = why => { H.end = this.ct; this.setMode('press', this.rnd(2, 4), why); };
    if (this.mode === 'check') {
      if (this.modeT > 0 && !H.chk) return;
      H.chk = 0;
      if (!hurt) { stop('he is fine'); return; }
      // he still throws back, or he's countered me, or I'm low: finish behind the guard
      const safe = this.t - this.lastHisT < 1 || this.ct - H.ctrd < 5 || gas < F.gasSafe;
      if (safe) this.tel.huntSafe = (this.tel.huntSafe || 0) + 1;
      this.setMode(safe ? 'huntSafe' : 'hunt', this.rnd(4, 8), safe ? 'he is hurt, careful' : 'he is hurt');
      return;
    }
    if (this.ct - H.t0 > F.cap) { this.tel.huntCap = (this.tel.huntCap || 0) + 1; stop('punched out'); return; }
    if (gas < F.gasOut) { stop('nothing left'); return; }
    if (this.mode === 'hunt' && gas < F.gasSafe) this.mode = 'huntSafe';
    if (!hurt && this.modeT > 1.5) this.modeT = Math.min(this.modeT, this.rnd(.5, 1.5)); // he got away
    if (this.modeT <= 0) { if (hurt) this.modeT = this.rnd(2, 4); else { H.end = this.ct; this.pickMode(P); } }
  }
  // hurt: the first reaction, then a second pick a second or two later. Composure decides both
  survStart(P) {
    const tr = this.tr, comp = tr.composure, k = this.k, SV = BR.surv, H = this.h;
    const w = { clinch: tr.clinch * (.3 + k.clinch) * comp * 1.5, shell: tr.shell * (1.2 - comp * .5), run: tr.legs * (.3 + k.footwork) * comp, fire: tr.risk * (1 - comp) * 1.4, freeze: (1 - comp) * (1 - k.read) * .6,
      bait: comp > .6 ? (tr.patience - .4) * k.counter * 1.2 : 0 };
    if (this.ct - H.kdMe < 8) { w.fire += comp * tr.risk * SV.kdFire; w.shell *= lerp(SV.kdShell, 1, comp); } // off the floor: fire back harder, or cover up
    if (P.roundLen - P.clock < SV.late) { w.run *= SV.lateRun; w.clinch *= SV.lateRun; w.fire *= SV.lateFire; } // ride it to the bell
    if (this.desp) w.fire *= SV.despFire;
    this.hurtResp = wpickR(this.R, Object.keys(w), x => w[x]) || 'shell';
    this.tel.hurts++; this.tel.hurtR[this.hurtResp] = (this.tel.hurtR[this.hurtResp] || 0) + 1;
    H.unans = 0; H.flip = 0; H.second = this.ct + this.rnd(SV.second[0], SV.second[1]); H.freezeEnd = this.ct + this.rnd(SV.freeze[0], SV.freeze[1]);
    this.queue = null; this.setup = null;
    if (this.ct - H.kdMe < 1 && comp < .7) this.wary = { v: SV.after, until: P.round }; // off the floor: box long the rest of the round
    this.setMode('survive', lerp(SV.hurtT[0], SV.hurtT[1], comp) * this.rnd(.8, 1.2), 'hurt: ' + this.hurtResp);
  }
  survUpd(P) {
    const tr = this.tr, comp = tr.composure, k = this.k, SV = BR.surv, H = this.h, was = this.hurtResp;
    if (was === 'freeze' && this.ct > H.freezeEnd) this.hurtResp = 'shell';
    if (H.second && this.ct > H.second) {
      H.second = 0;
      const w = { keep: .6 + (1 - comp) * .6, clinch: tr.clinch * (.3 + k.clinch) * comp * 1.2, steady: comp > SV.steady ? comp * comp * k.read * 1.2 * 2 : 0, shell: (1 - comp) * .4 };
      const o = wpickR(this.R, Object.keys(w), x => w[x]);
      if (o && o !== 'keep' && o !== this.hurtResp) { this.tel.second = (this.tel.second || 0) + 1; this.hurtResp = o; }
    }
    // shell is what gets you stopped: after a few unanswered he has to fire or hold
    if (this.hurtResp === 'shell' && H.unans >= SV.flipAt && !H.flip) {
      H.flip = 1;
      if (this.R() < SV.shellFlip) { this.hurtResp = this.R() < tr.risk / (tr.risk + tr.clinch + .01) ? 'fire' : 'clinch'; this.tel.flip = (this.tel.flip || 0) + 1; }
    }
    if (this.hurtResp !== was) this.note('hurt: ' + was + ' -> ' + this.hurtResp);
    if (this.modeT <= 0 && !P.me.hurt) { this.hurtResp = null; this.pickMode(P); }
  }

  /* ---------- the hands: when to throw, when not to, and what ---------- */
  offense(P) {
    const k = this.k, tr = this.tr, E = this.emo, m = this.mm(), H = P.him;
    const fat = 1 - P.me.stam / (P.me.stamMax || 100);
    // his eye for distance: a novice misjudges and throws from where nothing reaches
    const dSeen = P.dist + this.g() * BR.outShort * (1 - k.range) * .6 + (1 - k.range) * -6;
    if (this.queue && this.t >= this.queue.at) { const q = this.queue; this.queue = null; const ps = this.fitReach(q.ps, dSeen); const a = ps ? this.fire(ps, q.why, dSeen, q.ctr) : null; if (a && q.pivot) a.pivot = true; return a; }
    // a planned sequence in progress
    if (this.setup) { const s = this.stepSetup(P, dSeen); if (s) return s; }
    if (dSeen > 92) return null;
    if (this.t < this.h.look) return null; // between flurries: a look (is he still there?)
    const open = this.opening(P);
    // a quick thinker decides more often, not more: the work rate is his nature, the timing is his skill
    let p = BR.throwP * (.5 + 1.0 * tr.output) * m.aggr * (1 + open * (1.2 + (m.ctr ? 1 : 0))) * (this.decBase || .4) / .4 * this.pace;
    // when NOT to: he keeps getting countered, he's gassed (a smart man paces it), he's scared, the other man is loaded and waiting
    let ctr = 0, n = 0; for (const x in this.mem.mine) { const e = this.mpeek(this.mem.mine, x); ctr += e.c || 0; n += e.n || 0; }
    p *= 1 - clamp(ctr / Math.max(4, n) * 2.5, 0, .6) * k.read * (1 - tr.risk * .5);
    p *= lerp(1, clamp(1.25 - fat, .35, 1), k.pacing);
    p *= 1 - .5 * E.fear * (1 - tr.risk * .5);
    p *= 1 + .3 * E.conf + .4 * E.frus * (1 - tr.composure);
    p *= 1 + .45 * this.nd + BR.desp.out * this.desp;
    if (P.round === 1) p *= lerp(.55 + .35 * tr.initiative, 1, P.clock / P.roundLen); // the first round: he's still finding out what the other man has
    if (H.punch && !H.punch.feint && this.mode !== 'counter' && !(this.mode === 'survive' && this.hurtResp === 'bait')) p *= .6 + .6 * (1 - k.read) * tr.risk; // he's punching: most men cover, the reckless trade
    if (this.R() > p) { if (dSeen < 80) this.tel.holds++; return null; }
    // feint, a planned sequence, or a combo
    if (this.R() < BR.feintP * (.4 + k.feints * 1.5) * (.5 + tr.patience) / Math.max(.3, m.aggr) * (this.mode === 'feelout' || this.mode === 'reset' ? 2 : 1)) return this.feint(dSeen);
    if (this.mode !== 'survive' && !HUNTS[this.mode] && this.R() < BR.setupP * k.read * (.5 + k.feints * .5 + k.combos * .5) * (this.mode === 'burst' ? .4 : 1)) { const s = this.startSetup(P, dSeen); if (s) return s; }
    const c = this.pickCombo(P, dSeen);
    if (!c) return null;
    return this.fire(c.ps, c.why, dSeen);
  }
  pickCombo(P, dSeen) {
    const k = this.k, tr = this.tr, E = this.emo, md = this.mode, H = P.him, fat = 1 - P.me.stam / (P.me.stamMax || 100), pl = this.plan;
    const maxLen = 1 + Math.round(1 + 3 * k.combos * (.6 + .5 * tr.combo));
    const last = this.hist[this.hist.length - 1], noise = lerp(.75, .3, (k.read + k.combos) / 2) * (1 + .8 * fat) * (1 + .6 * E.frus);
    const nd = this.nd;
    let ctrN = 0, mN = 0; for (const x in this.mem.mine) { const e = this.mpeek(this.mem.mine, x); ctrN += e.c || 0; mN += e.n || 0; }
    const ctrRate = ctrN / Math.max(4, mN);
    let best = null, bw = 0, tot = 0; const ws = [];
    for (const c of COMBOS) {
      // range: the first punch has to reach (as far as he can tell)
      if (dSeen > c.max + 4 || dSeen < c.min - 12) { if (this.R() > .12 * (1 - k.range)) continue; }
      let w = 1;
      // the rest of it has to reach too: a hook from where only the jab lands is wasted (a man with a good eye for range knows it)
      for (let i = 1; i < c.n; i++) if (dSeen > PUNCHES[c.ps[i]].max + BR.reachStep) w *= lerp(.6, BR.reachLo, k.range);
      { // every combo has a working range: a hook wants to be well inside its reach (he only has to lean back from one at the end of it), a straight at the end of the arm
        const P0 = PUNCHES[c.ps[0]], ideal = P0.max - (P0.kind === 'straight' ? BR.workS : BR.workH);
        w *= lerp(1, BR.workLo + Math.exp(-Math.pow((dSeen - ideal) / BR.workW, 2)), k.range); }
      { const jt = clamp(tr.jab + pl.jab, 0, 1); w *= c.jab ? lerp(.5, 4, jt) * (.5 + c.jab) : lerp(1.6, .3, jt); }
      w *= 1 + c.power * (clamp(tr.power + pl.power, 0, 1) * 2 - .6);
      w *= 1 + c.body * (clamp(tr.body + pl.body, 0, 1) * 2.4 - .7);
      w *= c.n === 1 ? 1.5 - tr.combo : c.n === 2 ? 1 : (.2 + tr.combo * 1.3) * (c.n > 3 ? .6 : 1);
      if (c.n > maxLen) w *= .15; // tries it anyway, badly
      // what's been working against this man (a smart man weighs it, a novice barely notices)
      let v = 0; for (const p of c.ps) v += this.punchVal(p); w *= Math.pow(v / c.n, 1.5);
      if (md === 'feelout' || md === 'reset') w *= c.n === 1 && c.jab ? 4 : c.jab ? 1 : .25;
      if (md === 'hunt') w *= 1 + c.power * 2.5 * tr.killer;
      else if (md === 'huntSafe') w *= (1 + c.power * 2.5 * BR.fin.safePow * tr.killer) * lerp(1, BR.fin.safeStr, c.str) * lerp(1, BR.fin.safeWide, c.wide) * (c.n > 3 ? .6 : 1);
      else if (md === 'check') w *= lerp(.4, 1.6, c.str) * (c.n <= 2 ? 1.3 : .3);
      if (HUNTS[md]) {
        if (H.guard > .75) w *= lerp(1, BR.fin.shellBody, c.body) * lerp(1, BR.fin.shellUpper, c.up * 2);  // he's in a shell: dig, and come up the middle
        if (H.closing < -25) w *= lerp(1, BR.fin.runHook, c.hook * 2);                                    // he's running: hooks cut him off
      }
      if (md === 'survive') { const r = this.hurtResp; w *= r === 'fire' ? 1 + c.power : r === 'steady' ? (c.jab && c.n <= 2 ? 3 : .4) : c.n === 1 ? 2 : .3; }
      if (this.desp) w *= (1 + c.power * BR.desp.power * this.desp * tr.power) * (1 + c.wide * BR.desp.wide * this.desp) * (c.jab && c.n === 1 ? 1 - .5 * this.desp : 1); // the late equaliser: sit down on the right hand
      if (nd > 0) w *= 1 + c.power * nd; else w *= 1 + (c.jab - c.power) * -nd * .6; // behind: sit down on it. ahead: jab and stay safe
      if (H.guard < .4) w *= 1 + (c.power - c.body) * k.read;  // hands are down: go upstairs
      if (H.guard > .8) w *= 1 + c.body * k.read;               // shell up high: go to the body
      if (H.gas < BR.fuse.gas && !HUNTS[md]) w *= 1 + (c.body + (c.ps.includes('bodyHook') ? BR.fuse.liver : 0)) * (BR.fuse.gas - H.gas) / BR.fuse.gas * BR.fuse.w * k.read; // he's tired: the body is the slow fuse, dig to the liver
      // the situation (a smart man sees it, a novice throws his favourites)
      let sit = 1;
      if (H.guard > .7 && c.lowHigh) sit *= 1.3;                          // lift then dig, or dig then lift: a high guard can't cover both
      if (c.lowHigh && this.bodyL) sit *= 1 + Math.min(.4, .08 * this.bodyL / Math.max(1, P.round)); // the body work pays upstairs later
      if (P.ropes.him > .6 && c.inside) sit *= 1.3;                        // he's on the ropes: rip inside
      if (P.round <= 3 && c.n === 1 && c.jab) sit *= 1.15;                 // early: probe with the jab
      if (ctrRate > .15) sit *= c.endLead ? 1.15 : c.endRear ? .85 : 1;    // he counters: finish on the lead hook, back in your stance
      w *= lerp(1, sit, k.read);
      // variety: a smart man doesn't show the same thing over and over; a novice falls in love with one
      if (last && last === c.id) w *= lerp(1.4, .3, k.read);
      w *= Math.exp(this.g() * noise);
      ws.push([c, w]); tot += w;
    }
    if (!tot) return null;
    let r = this.R() * tot; for (const [c, w] of ws) { r -= w; if (r <= 0) { best = c; bw = w; break; } }
    if (!best) best = ws[ws.length - 1][0];
    return { ps: best.ps.slice(), why: (this.opening(P) > .5 ? 'opening' : md) + ': ' + best.id, id: best.id };
  }
  // a counter or a planned shot from where it can't reach: a man with an eye for range turns the hook into a straight, or lets it go
  fitReach(ps, dSeen) {
    const k = this.k, P0 = PUNCHES[ps[0]];
    if (dSeen <= P0.max + BR.reachStep || this.R() > k.range) return ps;
    if (P0.kind === 'straight' || dSeen > PUNCHES.cross.max + BR.reachStep) return null;
    return [P0.zone === 'body' ? 'bodyCross' : 'cross'].concat(ps.slice(1).filter(p => PUNCHES[p].max + BR.reachStep >= dSeen));
  }
  // planned sequences: the smart man's tricks
  startSetup(P, dSeen) {
    const k = this.k, his = this.mpeek(this.mem.def, 'straight'), jd = this.mpeek(this.mem.def, 'feint');
    const opts = [];
    if (dSeen < 82) opts.push(['jjr', 1]);                                     // jab, jab, the right hand behind the third
    if (dSeen < 62) opts.push(['bodyHead', .6 + this.tr.body]);                // body, body, then upstairs when the hands drop
    if (dSeen < 80 && k.feints > .45) opts.push(['feintHook', .5 + (jd && jd.n > 1 ? 2 * jd.bit / jd.n : .5) + (his && his.n > 2 ? 1.5 * (his.slip || 0) / his.n : 0)]); // feint to draw the slip, hook where he slips to
    if (this.hist.length >= 2 && this.hist[this.hist.length - 1] === this.hist[this.hist.length - 2]) opts.push(['change', 2.5]); // shown it twice: change it on the third
    const o = wpickR(this.R, opts, x => x[1]); if (!o) return null;
    this.tel.setups++;
    const now = this.t;
    if (o[0] === 'jjr') this.setup = { name: 'jab-jab-right', steps: [['jab'], ['jab'], ['cross']], i: 0, gap: .3, next: now, until: now + 4 };
    else if (o[0] === 'bodyHead') this.setup = { name: 'body then head', steps: [['bodyJab'], [this.R() < .5 ? 'bodyHook' : 'bodyCross'], ['hook', 'cross']], i: 0, gap: .6, next: now, until: now + 6, onBlock: 1 };
    else if (o[0] === 'feintHook') { this.setup = { name: 'feint to draw', steps: ['feint', 'react'], i: 0, gap: .05, next: now, until: now + 1.6, onBite: 1 }; }
    else { const ps = this.hist[this.hist.length - 1].split('-').map(x => NUM[x]); const alt = { jab: 'bodyJab', cross: 'hook', hook: 'uppercut', bodyJab: 'jab', bodyHook: 'hook', uppercut: 'hook', rhook: 'bodyHook', lupper: 'cross', bodyCross: 'hook' }; ps[ps.length - 1] = alt[ps[ps.length - 1]] || 'hook'; if (ps.length === 1) ps.unshift('jab'); this.setup = { name: 'show it twice, change it', steps: [ps], i: 0, gap: 0, next: now, until: now + 1 }; }
    this.note('setup: ' + this.setup.name);
    return this.stepSetup(P, dSeen);
  }
  stepSetup(P, dSeen) {
    const S = this.setup;
    if (this.t > S.until || S.i >= S.steps.length || P.me.hurt) { this.setup = null; return null; }
    if (this.t < S.next) return 'wait';
    let st = S.steps[S.i];
    if (st === 'feint') { S.i++; S.next = this.t + .45; return this.feint(dSeen, 'setup: feint to draw'); }
    if (st === 'react') {
      if (!S.bit) { if (this.t > S.next + .3) this.setup = null; return 'wait'; }
      // he bit: punish where he went
      st = S.bit === 'slip' || S.bit === 'roll' ? ['hook'] : S.bit === 'duck' ? ['uppercut', 'hook'] : S.bit === 'pull' ? ['jab', 'cross'] : ['bodyHook', 'hook'];
    }
    if (S.name === 'body then head' && S.i === 2 && P.him.guard > .5 && !S.blocked) { S.steps[2] = ['bodyHook']; } // the hands haven't dropped yet: one more downstairs
    S.i++; S.next = this.t + S.gap;
    if (S.i >= S.steps.length) this.setup = null;
    const ps = this.fitReach(st.slice(), dSeen); return ps ? this.fire(ps, 'setup: ' + S.name, dSeen) : 'wait';
  }
  feint(dSeen, why) {
    const k = this.k, fat = this.fat || 0;
    const type = this.R() < .65 ? 'jab' : this.R() < .5 ? 'cross' : 'bodyJab';
    const sell = clamp(k.feints * (1 - .3 * fat) + this.g() * .12, 0, 1);
    this.tel.feints++;
    return { type, combo: [type], feint: true, sell, tech: sell, tell: 0, commit: 0, why: why || (sell < .35 ? 'feint (nobody is buying it)' : 'feint') };
  }
  // technique: how well he throws it. A skill he doesn't own still gets tried, badly: telegraphed, arm punches, off balance
  fire(ps, why, dSeen, ctr) {
    const k = this.k, tr = this.tr, E = this.emo, fat = this.fat || 0;
    if (!ps || !ps.length) return null;
    const skillOf = p => PUNCHES[p].cat === 'jab' ? k.jab : PUNCHES[p].cat === 'body' ? k.body : k.power;
    const tech = ps.map((p, i) => clamp(skillOf(p) * (i ? lerp(.7, 1, k.combos) : 1) * (1 - .25 * fat) * (1 - .15 * E.frus * (1 - tr.composure)) + this.g() * .06, .1, 1));
    let commit = clamp(tr.power * .5 + tr.risk * .3 + BR.desp.commit * this.desp + E.frus * .2 - (ps.length > 2 ? .2 : 0), 0, 1) + (BR.fin.commit[this.mode] || 0); // finishing: he sits down on everything (past his usual)
    if (ctr && this.mode === 'survive' && (this.hurtResp === 'fire' || this.hurtResp === 'bait')) commit = Math.min(1, commit + BR.fin.ctrCommit); // nothing to lose: he sits down on it
    if (this.mode === 'hunt' || this.mode === 'huntSafe') { const H = this.h; H.n += ps.length; if (H.n >= H.goal) { H.n = 0; H.goal = Math.round(this.rnd(BR.fin.burst[0], BR.fin.burst[1] + tr.killer)); H.look = this.t + this.rnd(BR.fin.look[0], BR.fin.look[1]); } } // the flurry, then a look
    const tell = clamp((1 - tech[0]) * .8 + commit * .25 * (1 - k.power), 0, 1); // loading up shows it
    this.tel.throws++; this.tel.techSum += tech[0]; this.tel.techN++;
    { const mk = this.mode === 'survive' ? 's:' + this.hurtResp : this.mode; this.tel.mThr[mk] = (this.tel.mThr[mk] || 0) + ps.length; }
    const id = ps.map(p => PUNCHES[p].num).join('-');
    this.hist.push(id); if (this.hist.length > 6) this.hist.shift();
    this.note('throws ' + id + ' (' + why + ')');
    return { type: ps[0], combo: ps, feint: false, tech, tell, commit, counter: !!ctr, why, num: id };
  }

  /* ---------- the feet ---------- */
  move(P) {
    const k = this.k, tr = this.tr, md = this.mm(), E = this.emo, fat = this.fat, sv = this.mode === 'survive' ? this.hurtResp : null;
    let pv = 0, n = 0; for (const p of ['hook', 'rhook', 'uppercut', 'lupper', 'bodyHook']) { pv += this.punchVal(p); n++; }
    let po = 0; for (const p of ['jab', 'cross', 'bodyJab']) po += this.punchVal(p);
    const shift = clamp(pv / n - po / 3, -1, 1) * 10 * k.range * (tr.range > .7 ? .4 : 1); // what's working decides where he wants to be, inside his style
    let range = lerp(50, 76, tr.range) + md.range + this.plan.range - shift + fat * 5 + E.fear * 10 + this.rangeJit + (this.wary && P.round <= this.wary.until ? this.wary.v : 0);
    if (sv === 'clinch') range = 30;
    if (sv === 'fire') range = 50;
    if (sv === 'freeze' || sv === 'bait') range = P.dist;
    let lateral = tr.circle * lerp(.4, 1, k.angles) * (md.lat || .5);
    // on the ropes: get off them (a man without ring craft stays there and covers up; hurt, the runner and the steady man push off first)
    if (P.ropes.me > .4) lateral = Math.max(lateral, P.ropes.me * lerp(.15, 1, k.ropes) * (sv === 'shell' ? .3 : sv === 'run' || sv === 'steady' ? 1.5 : 1));
    let cut = (md.cut || (tr.initiative > .6 && tr.range < .5) || P.ropes.him > .4) ? lerp(.2, 1, k.cutoff) * (md.cut ? 1 : .6) : 0;
    if (HUNTS[this.mode] && P.him.closing < -25) cut = Math.min(1, cut * 1.5); // he's running: cut the ring, trap him on the ropes
    let clinch = false;
    if (P.dist < 46) {
      if (this.mode === 'survive' && this.R() < (sv === 'clinch' ? BR.surv.clinchNear + .4 * k.clinch : sv === 'steady' || sv === 'run' ? .15 * (.4 + k.clinch) : .1 * (.4 + k.clinch))) clinch = true;
      else if (fat > .55 && this.R() < .04 * tr.clinch * (.4 + k.clinch)) clinch = true;
      else if (P.ropes.me > .6 && P.dist < 40 && this.R() < .02 * tr.clinch * k.clinch) clinch = true; // smother the man who has him pinned
      else if (tr.range > .7 && P.dist < 40 && this.R() < .015 * tr.clinch) clinch = true;      // an out-boxer doesn't want it in there
    }
    // push: how hard he fights for that distance. A mover who lives outside fights for room; a pressure man fights to close it. Footwork and range skill win the tug of war
    const out = range > P.dist, push = (out ? lerp(.4, 2, tr.legs) * lerp(.6, 1.3, k.footwork) : lerp(.4, 2, tr.initiative * (1 - tr.range)) * lerp(.6, 1.3, k.cutoff)) * lerp(.7, 1.2, k.range) * (this.mode === 'survive' ? 1.3 : 1);
    return { range: clamp(range, 28, 90), lateral: clamp(lateral, 0, 1) * this.lat, cut, clinch, feet: lerp(.75, 1.1, k.footwork), push }; // feet: how well he moves (no crossed feet, small steps)
  }

  /* ---------- the one call: perception in, action out ---------- */
  think(P, dt) {
    this.t = P.t; this.out.punch = null; this.out.defend = null; this.dNow = P.dist;
    if (P.events) for (const ev of P.events) this.hear(ev);
    const E = this.emo, comp = this.tr.composure;
    const sdt = dt * this.pace; // slow time: moods and intent
    E.conf *= 1 - .02 * sdt; E.frus *= 1 - (.03 + .05 * comp) * sdt; E.fear *= 1 - (.02 + .08 * comp) * sdt * (P.me.hurt ? .2 : 1);
    this.fat = 1 - P.me.stam / (P.me.stamMax || 100);
    this.ct += sdt; this.hisG = P.him.guard;
    { const B = BR.blur, cur = Math.max(0, 1 - P.me.head / Math.max(1, P.me.headMax) - B.at) / (1 - B.at); // only real damage counts: a jab here and there doesn't blur anything
      this.blur = clamp((cur * B.cur + (1 - (P.me.headMax || 100) / 100) * B.wear + (P.round - 1) / Math.max(1, P.rounds - 1) * B.late + this.kds * B.kd) * (1.3 - .6 * this.tr.composure), 0, 1); }
    if (P.me.down) { this.out.intent = 'down'; return this.out; }
    this.updMode(P, sdt);
    this.see(P);
    // he's rushing in head first: a counterpuncher meets him with the check hook and pivots off the line (Mayweather vs Hatton)
    if (P.him.closing > BR.rushV && P.dist < 66 && P.dist > 40 && !this.queue && !P.me.busy && !P.him.punch && this.mode !== 'survive'
      && this.R() < BR.rushP * this.k.counter * (1.3 - clamp(this.tr.initiative, 0, 1)) * dt) {
      const o = this.counterFor('rush', 'jab'); this.queue = { ps: o[0].slice(), why: 'counter: ' + o[2], ctr: 1, at: this.t, pivot: o[2] === 'check hook' };
    }
    this.decT -= dt;
    if (this.decT <= 0) {
      this.tel.decisions++;
      this.nd = this.need(P);
      { const D = BR.desp, late = P.rounds >= 6 && P.round > P.rounds - D.last, b = -this.sc.lead; // behind on his own cards, late: the equaliser
        this.desp = late && b > 0 ? clamp(b / 2, .4, 1) * (.4 + .6 * this.tr.killer) * (.5 + .5 * this.tr.power) : 0;
        if (this.desp && !this.despR) { this.despR = 1; this.tel.desp = (this.tel.desp || 0) + 1; } }
      // fatigue makes him decide faster and worse
      this.decBase = lerp(BR.decT[0], BR.decT[1], (this.k.read + this.k.combos + this.k.counter) / 3);
      this.decT = this.decBase * (1 - .3 * this.fat) * Math.exp(this.g() * .25);
      if (this.R() < .1) this.rangeJit = this.g() * lerp(5, 2, this.k.range);
      if (this.R() < .08 + (P.ropes.me > .5 ? .15 : 0)) this.lat *= -1;
      this.out.move = this.move(P);
      if (!P.me.busy && !P.me.clinch) {
        const a = this.offense(P);
        if (a && a !== 'wait') { this.out.punch = a; this.out.why = a.why; }
      }
    } else if (this.queue && this.t >= this.queue.at && !P.me.busy && !P.me.clinch) {
      const a = this.offense(P); if (a && a !== 'wait') { this.out.punch = a; this.out.why = a.why; }
    }
    const md = this.mm();
    this.out.intent = this.mode; this.out.hurt = this.mode === 'survive' ? this.hurtResp : null;
    this.out.guard = clamp(md.guard * lerp(.7, 1.2, this.tr.shell) * (1 - .35 * this.fat) * (this.mode === 'survive' && this.hurtResp === 'shell' ? 1.3 : 1), .1, 1);
    return this.out;
  }

  /* ---------- between rounds: his own read of the round, and whether he changes anything ---------- */
  rest(info) {
    info = info || {};
    const k = this.k, tr = this.tr, E = this.emo, won = this.sc.me - this.sc.him;
    const r = won > 1 ? 1 : won < -1 ? -1 : 0;
    this.sc.rounds.push(r); this.sc.lead += r; this.sc.me = 0; this.sc.him = 0;
    E.fear *= .5; E.frus *= .3; E.conf *= .7;
    this.queue = null; this.setup = null; this.threat = null;
    const lost = this.sc.rounds.slice(-2).filter(x => x < 0).length;
    // the best adjust between rounds; the shared way they lose is waiting too long
    const ch = Math.pow(k.adjust, 1.4) * (r < 0 ? 1 : .25) * (1 + .5 * lost);
    let change = null;
    if (this.R() < ch) {
      const cat = c => { let v = 0, n = 0; for (const p of PTYPES) if (PUNCHES[p].cat === c) { v += this.punchVal(p); n++; } return v / n; };
      const vals = { jab: cat('jab'), power: cat('power'), body: cat('body') };
      const bestC = Object.keys(vals).reduce((a, b) => vals[a] > vals[b] ? a : b), worstC = Object.keys(vals).reduce((a, b) => vals[a] < vals[b] ? a : b);
      let ctr = 0, n = 0; for (const x in this.mem.mine) { const e = this.mpeek(this.mem.mine, x); ctr += e.c || 0; n += e.n || 0; }
      let hurtIn = 0, hurtOut = 0; for (const p in this.mem.hurt) { const e = this.mpeek(this.mem.hurt, p); if (['jab', 'cross', 'bodyJab', 'bodyCross'].includes(p)) hurtOut += e.d; else hurtIn += e.d; }
      const opts = [
        ['more ' + bestC, vals[bestC] - 1, () => { this.plan[bestC] = clamp(this.plan[bestC] + .2, -.4, .4); }],
        ['less ' + worstC, 1 - vals[worstC], () => { this.plan[worstC] = clamp(this.plan[worstC] - .2, -.4, .4); }],
        ['stop leading, make him miss and pay', ctr / Math.max(4, n) * 3, () => { this.plan.initiative = clamp(this.plan.initiative - .25, -.4, .4); }],
        ['get inside, he is killing me at range', hurtOut > hurtIn * 1.5 ? .5 : 0, () => { this.plan.range = clamp(this.plan.range - 8, -16, 16); }],
        ['stay long, he is killing me inside', hurtIn > hurtOut * 1.5 ? .5 : 0, () => { this.plan.range = clamp(this.plan.range + 8, -16, 16); }],
        ['go to work, I am waiting too long', this.sc.lead < 0 ? .4 : 0, () => { this.plan.initiative = clamp(this.plan.initiative + .25, -.4, .4); }]
      ];
      const o = wpickR(this.R, opts, x => x[1] + .05 * this.R());
      if (o && o[1] > .05) { o[2](); change = o[0]; }
    }
    // plans fade back toward his nature
    if (!change) for (const x in this.plan) this.plan[x] *= .8;
    // dropped this round: a composed man comes out firing (the rally), the rest box careful and long
    if (this.h.kdR) { if (tr.composure >= .65) { this.plan.initiative = clamp(this.plan.initiative + BR.surv.rally, -.4, .4); this.plan.power = clamp(this.plan.power + .1, -.4, .4); } else this.plan.range = clamp(this.plan.range + BR.surv.after, -16, 16); }
    this.h.kdR = 0; this.despR = 0; this.mode = 'feelout';
    this.mode = 'feelout'; this.modeT = this.rnd(2, 6) * (1.3 - tr.initiative);
    this.note('round ' + (info.round || '?') + ' ' + (r > 0 ? 'won' : r < 0 ? 'lost' : 'even') + ' (he thinks)' + (change ? ', change: ' + change : ''));
    return { thinks: r, lead: this.sc.lead, change };
  }
  roundStart(round) { this.mode = 'feelout'; this.modeT = (round === 1 ? this.rnd(15, 40) : this.rnd(2, 6)) * (1.3 - this.tr.initiative); }
  state() { return { mode: this.mode, hurtResp: this.hurtResp, emo: Object.assign({}, this.emo), plan: Object.assign({}, this.plan), lead: this.sc.lead }; }
}

function create(profile, opts) { return new Brain(profile, opts); }
return { create, makeProfile, tierOf, mulberry32, PUNCHES, COMBOS, SKILLS, SKILL_KEYS, TRAIT_KEYS, TIERS, STYLES, MODES, SURV, BR, DEF_THRU, kindOf };
});
