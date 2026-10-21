/* ===== LAST BELL : boxer brain =====
   The AI inside a boxer's head. Renderer-agnostic: no DOM, no canvas, no engine globals.
   The game passes what is true on screen (perception). The brain's own eyes, nerves and gas tank add the error:
   it sees punches late, misreads them, bites on feints, forgets, gets scared, gets frustrated, gets tired.

   const b = BoxerBrain.create(profile, { rng })   // profile from BoxerBrain.makeProfile({ style, tier })
   each frame:        const act = b.think(perception, dt)   // see README.md for both shapes
   between rounds:    const note = b.rest(info)
   Distances are in the engine's units (a jab reaches 78, a hook 60, ring ropes at +-146). */
// @ts-check (tsconfig.json: `tsc -p .` checks this file, no build step)
/**
 * What the game tells him each frame (index.html perceive(), brain/ring.js). Distances in engine units.
 * @typedef {Object} Perception
 * @property {number} t          fight time (sim s)
 * @property {number} clock      seconds into the round
 * @property {number} roundLen   seconds in a round
 * @property {number} round
 * @property {number} rounds
 * @property {number} dist       distance between the two men
 * @property {{ me: number, him: number }} ropes  0 = center of the ring .. 1 = on the ropes
 * @property {{ head: number, headMax: number, stam: number, stamMax: number, hurt: boolean, down: boolean, clinch: boolean, punching: boolean, busy: boolean,
 *   strat?: string, order?: ?{ k: string, q: number, left: number, age: number }, south?: boolean, eye?: ?{ s: string, v: number }, body?: number }} me   his own body (body: the meter, 1 fresh .. 0 gone), the corner's plan and live shout, his stance (south: a southpaw), his worse eye (a cut or a swelling: side, 0..1)
 * @property {{ closing: number, punch: ?SeenPunch, recover: ?number, lastRes: ?string, guard: number, gas: number, hurt: boolean, head: number, look?: Look }} him
 * @property {Array<{ type: string, by: 'me' | 'him', [k: string]: any }>} events  what happened since last frame (landed, blocked, evaded, feinted, thrown...)
 */
/**
 * What's on screen about the other man (the eyes, E1: the truth; his eyes decide what he notices). All 0..1, optional: a host without one leaves it out.
 * @typedef {Object} Look
 * @property {number} [cut]     how bad the cut is (0 none .. 1 the doctor's looking)
 * @property {?string} [cutS]   which eye it's over ('L' / 'R', his own left or right)
 * @property {number} [swell]   the worse eye's swelling (0 none .. .4 half shut .. .85 shut)
 * @property {string} [swS]     which eye that is ('L' / 'R')
 * @property {number} [body]    his body meter (1 fresh .. 0 gone)
 * @property {number} [arms]    arm wear (1 fresh .. 0 the guard's breaking down)
 * @property {number} [fold]    bent over a body shot right now
 * @property {number} [legs]    heavy, flat feet (tired, a sinking body)
 * @property {number} [wobble]  the legs going (stunned 1, hurt .6; less while he bluffs)
 * @property {number} [sell]    he's acting fine (1f bluff: the nod, the smile, punching back), 0..1 as it shows (less while he moves sideways)
 * @property {number} [elbows]  elbows clamped to his ribs, gloves low (f1b: his body's hurt; the bluff can't hide it)
 * @property {number} [bait]    f2: he's dropped his hands on purpose to invite one (an id per bait, 0 = not baiting). The low hands show in `guard`; this lets a reader roll to see through it
 */
/**
 * A punch in the air, as it truly is (his eyes add the error).
 * @typedef {Object} SeenPunch
 * @property {number} id
 * @property {string} type       PUNCHES key
 * @property {number} t          seconds since it started
 * @property {number} impactIn   seconds until it lands (99 for a feint)
 * @property {boolean} feint
 * @property {number} sell       how real the feint looks
 * @property {?string} look      a changed ending (traps)
 * @property {number} tell       how much it was telegraphed
 * @property {number} [blind]    how shut his own eye is on the side it comes in on (0 open .. 1 shut: he can't see it coming)
 */
/**
 * What he decides each frame (think()). The game turns it into feet, hands and a guard.
 * @typedef {Object} Action
 * @property {string} intent     his mode: feelout, work, pressure, hunt, survive, down...
 * @property {{ range: number, lateral: number, cut: number, clinch: boolean }} move
 * @property {number} guard      0..1 how high and tight the hands are
 * @property {number} [low]      0..1 elbows down over the body (he's read a body digger): the body's covered, the head less
 * @property {number} [clamp]    0..1 his own body's hurt (f1b): elbows clamped to the ribs, gloves low. Covers the body like low, opens the head, and it shows (Look.elbows)
 * @property {?Object} punch     { type, combo, counter, feint, tech, commit, tell, ... } or null
 * @property {?{ kind: string, zone: string, vs: string, quality: number }} defend
 * @property {string} why
 * @property {?string} [hurt]    how he answers being hurt (survive mode)
 * @property {number} [bluff]    0..1 hurt and hiding it (1f): the host shows a smaller wobble and sends Look.sell
 * @property {?{ s: string, k: number }} [cover]  his bad eye covered (1e): the side, and how much (the glove stays up there, he moves off it)
 * @property {?{ k: number, zone?: string, cat?: string }} [hole]  f3 easy flaw: punches (of that zone / PUNCHES cat, or all) he's open to right now; the host's own defense vs them x (1 - k)
 * @property {number} [post]    0..1 the long guard (1b): his lead hand left posted out at the end of the jab at long range. The host jams the other man's jab (and some of his lead hook) off it; it costs gas, opens the lead-side body, and a man who walks in under it gets a beat before it comes home
 * @property {number} [bait]    f2: an id while he shows the opening on purpose (World class: hands low, the defense and the counter ready for the punch he's sure is coming), else 0. The host sends it as Look.bait
 */
/**
 * @typedef {Object} BrainOpts
 * @property {() => number} [rng]   the game's dice (seeded fights stay seeded)
 * @property {number} [pace]        game rounds that run faster than the clock squeeze the slow things (Last Bell: 3)
 * @property {boolean} [thrownEv]   the game sends 'thrown' events for punches that really started
 * @property {boolean} [debug]
 * @property {?Object} [fam]        style/stance familiarity (L3)
 * @property {?{kind: string, v: number}} [scar]  what a KO loss left (L4e): 'caution' or 'gunShy', how much
 * @property {?{tbl: Object, w?: number, lost?: boolean, won?: boolean}} [prior]  what he remembers of this man (L4c): a memo() from their last fight, its weight, did he lose it
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BoxerBrain = factory();
})(/** @type {any} */ (typeof globalThis !== 'undefined' ? globalThis : this), function () {
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
    wide: ps.filter(p => p === 'rhook').length / n, hook: ps.filter(p => p === 'hook' || p === 'rhook').length / n,
    lead: ps.filter(p => PUNCHES[p].zone === 'head' && PUNCHES[p].kind !== 'upper' && PUNCHES[p].arm === 'lead').length / n, rear: ps.filter(p => PUNCHES[p].zone === 'head' && PUNCHES[p].kind !== 'upper' && PUNCHES[p].arm === 'rear').length / n }; // 1e: head straights and hooks by hand: the lead lands on his right eye (orthodox), the rear on his left
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
  outboxer:     { label: 'Out-boxer',       t: { output: .45, jab: .85, power: .35, body: .25, combo: .4, initiative: .55, patience: .6, shell: .3, slip: .5, legs: .85, clinch: .35, composure: .6, risk: .3, killer: .4, range: .9, circle: .8 },
                  sk: { jab: 10, footwork: 2, range: 4, angles: 2, power: -6, cutoff: -8, clinch: -2 } },
  slugger:      { label: 'Slugger',         t: { output: .44, jab: .3, power: .9, body: .45, combo: .35, initiative: .75, patience: .35, shell: .75, slip: .25, legs: .2, clinch: .4, composure: .5, risk: .8, killer: .9, range: .3, circle: .2 },
                  sk: { power: 12, cutoff: 6, slip: -8, footwork: -8, jab: -6, angles: -4 } },
  swarmer:      { label: 'Swarmer',         t: { output: .9, jab: .35, power: .55, body: .7, combo: .85, initiative: .9, patience: .15, shell: .72, slip: .65, legs: .2, clinch: .3, composure: .78, risk: .7, killer: .7, range: .08, circle: .35 },
                  sk: { combos: 10, body: 10, cutoff: 14, slip: 14, block: 10, pacing: 4, range: -4, footwork: -4, jab: -4 } },
  counter:      { label: 'Counter-puncher', t: { output: .4, jab: .5, power: .55, body: .3, combo: .4, initiative: .15, patience: .9, shell: .45, slip: .8, legs: .55, clinch: .4, composure: .8, risk: .35, killer: .5, range: .65, circle: .55 },
                  sk: { counter: 12, read: 8, slip: 8, block: 2, combos: -6, cutoff: -8, body: -4 } },
  boxerpuncher: { label: 'Boxer-puncher',   t: { output: .66, jab: .6, power: .66, body: .45, combo: .55, initiative: .6, patience: .55, shell: .5, slip: .5, legs: .5, clinch: .4, composure: .65, risk: .5, killer: .7, range: .55, circle: .5 },
                  sk: { power: 8, jab: 6, combos: 5, adjust: 6, read: 4, slip: 2, block: 2 } }
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
  // the eyes (E2): what he notices about the other man (P.him.look). rate: sightings a second of clock at full salience; nov / vet: where he looks (a novice watches the gloves, a vet the chest: gaze = his read);
  // thr: how much there has to be before it's there to see (salience = v / thr, capped 1.5); tau: how long a sighting holds once it stops being seen (s of clock); big: a moment worth a line (E3)
  eye: { on: 1, rate: { cut: .1, swell: .1, body: .05, arms: .35, fold: 2.5, legs: .16, wobble: 2.4, elbows: .5 }, nov: { cut: .2, swell: .2, body: .1, arms: .9, fold: .45, legs: .12, wobble: .3, elbows: .8 }, vet: { cut: 1, swell: 1, body: .9, arms: 1, fold: 1, legs: .9, wobble: 1, elbows: 1 },
    thr: { cut: .1, swell: .3, body: .3, arms: .4, fold: .15, legs: .35, wobble: .3, elbows: .25 }, tau: { cut: 60, swell: 60, body: 60, arms: 30, fold: 4, legs: 30, wobble: 6, elbows: 10 }, big: { cut: .5, swell: .8, body: .5, legs: .6, wobble: .9 },
    blur: .5, fear: .4, hurt: .6, fat: .3, tunnel: .5,
    e4: 1, hold: 6 }, // e4: he fights on what he saw, not the truth (hurt from a wobble he caught, held hold s of clock; his gas from the legs; the arm wear in the guard). 0 = the truth (A/B)
  reactMin: .1,           // the fastest he ever sees a punch, read or not (s; was .04: expert averaged .09)
  // target the damage (1e): what he's spotted pulls his picks, times his read. eye: straights and hooks onto a seen cut or swelling; body: dig on a seen sinking body; arms: power through a seen worn guard.
  // cut / swell / body / arms: [where it starts to count, where it counts in full] of the cue as he saw it
  tgt: { on: 1, eye: 2, body: .8, arms: .6, cut: [.1, .45], swell: [.25, .7], bodyAt: [.3, .75], armsAt: [.3, .75] },
  // his own bad eye (1e): cover it and move off it. at .. full: how bad (P.me.eye.v) before he bothers .. in full; self: how much before the corner's told him (at the break), lo: a novice's share of it
  cover: { on: 1, at: .3, full: .8, self: .3, lo: .4 },
  eyeShut: .09,           // a punch on the side of his shut eye (SeenPunch.blind 1) comes from where he can't see: seen this much later on top, read or not (s)
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
  hurtQ: .6,              // a hurt man's defense works this much worse
  ropes: { lo: .5, hi: 1.3, legs: [.7, 1.6], flip: 0 }, // on the ropes: how hard he slides off (by ropes skill, by how much a mover he is: a mover gets off, a shell man can stay), how often he tries the other side
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
    kdWob: 25 },              // he just got up off the floor: he's hurt, whatever he shows (clock s after the resume)
  // surviving (4b)
  surv: { hurtT: [12, 5],     // how long the hurt lasts in his head (clock s, composure 0 .. 1)
    hitAdd: 1, hurtMax: 15,   // each clean shot while hurt adds to it
    second: [1, 2], freeze: [.3, .8], // the second pick, freeze cap (clock s)
    steady: .7, clinchNear: .5, flipAt: 3, shellFlip: .4,
    late: 20, lateRun: 1.5, lateFire: .6, despFire: 1.8,
    kdFire: 2, kdShell: 1.5,  // after a knockdown: composure decides, fire back harder or shell
    after: 8, rally: .2 },    // after a knockdown: more range rest of the round (and the next, unless he's composed: then more initiative)
  // the bluff (1f): a hurt vet hides it (nods, fires back, stands his ground); the legs still give him away (docs/PLUGIN.md)
  bluff: { on: 1, p: [0, .2, .5, .75], comp: [.6, 1.2], // chance at the hurt by mastery (Novice never), x composure (lerp .6..1.2): World ~75%, Pro ~50%
    talk: .85,                // while he sells it, a man who watches the face lets go of what he saw this much sooner (x 1 - gaze: a vet keeps it)
    kd: 8,                    // off the floor (clock s): everyone saw it, nothing to hide
    pick: [1.2, 2.5, .3],     // what he throws while he sells it (Ed, Oct 20): singles, 1-2s and doubles (the best), longer x .3: he fires back, nothing wild
    wild: { wide: 2, commit: .3 } }, // the act breaks and he goes out swinging (fire): wild, wide hooks (x 1 + wide x share), sitting down on them
  desp: { last: 3, out: .35, commit: .2, power: .6, wide: .5, hunt: 1 }, // behind on his cards in the last 3 rounds: risk, killer, output up (Walker, Wardley)
  // skill levels L2: what mastery does (research/mind_learn.md 4a). Each table is [Novice, Intermediate, Pro, World class] at the tier centers,
  // read on his mastery (not squeezed by spread). Neutral at Pro (1, or 0 for the penalties) so a Pro-level field plays as before:
  // the effects sit on the Novice and Intermediate rungs (and a small World class edge). on: how much of each applies (0 = off)
  lv: { on: { kLvl: 1, force: 1, gas: 1, off: 1, late: 1, flinch: 1, tell: 1, feint: 1, len: 1, adjust: 1, freeze: 1 },
    own: .3,                         // how much of one skill's own gap from his level the tables see (1 = all of it)
    kLvl:   [[.34, .43], [.56, .55], [.74, .644], [.82, .692], [.90, .86]], // [mastery, level as the brain plays it]: spread .6 through a rating-82 field (~.79), then World class pulls away. Novice and Intermediate sit a little closer
    force:  [.7, .85, 1, 1.06],     // punch force x (Smith 2000: novice ~.55 of an elite's)
    gas:    [1.22, 1.12, 1, .92],     // gas per punch x (holds his breath, arm punches, tense)
    off:    [.28, .15, 0, 0],        // extra off balance after a miss (s), on top of a Pro's: crossed feet, overreaching
    late:   [.28, .15, 0, 0],        // hands come back late: extra damage if he's caught on the way back
    flinch: [.17, .07, 0, 0],        // eyes shut on a hard shot: no defense for the next one
    tell:   [.65, .33, 0, -.1],      // extra wind-up he shows, 0 at Pro (x AI.tell in the game: a Novice ~+70 ms on top of his bad technique)
    feint:  [.15, .4, 1, 1.4],       // feints per round x (a novice barely feints; the ones he does, nobody buys)
    len:    [2, 3, 9, 9],            // longest combo he really owns (a Pro's own taste decides past that)
    adjust: [.05, .25, .55, .8],     // chance to change one thing between rounds when losing
    freeze: [.75, .25, 0, 0] },      // extra weight on freezing when hurt (novice ~40% of his answers)
  // skill levels L3: style and stance familiarity (research/mind_learn.md 4b). opts.fam = { style, stance }: how well he knows THIS man's style and stance (0..1, sheet.know).
  // No fam = neutral. Unfamiliar = under `at`, all the way at 0. It fades over the first rounds (`full` rounds at full size, gone by `gone`, a reader adapts sooner)
  // Tuned to research/mind_southpaw.md (Oct 14): a Pro who never saw the stance wins ~46%, default know vs a southpaw ~47%, never saw the style ~48%
  // L4c, a man he fought before (priorSet): k = how much of a live read the memory is worth at full weight; a lead the memory gives under odd / punch types costs drop x read
  // trust, a lead it called earns back x back; adjust = the loser walks in with one change made
  // won / lost: x k when he won / lost that fight (losses teach more: the loser studies the tape, the winner gets comfortable; measured Oct 17, rematch.js: one-sided memory
  // is worth ~+6 to whoever has it, both remembering cancels out)
  // L4e scars (scarSet): x v (the game sends ~.15 fresh after a KO loss). caution: risk x(1 - risk v), shell / clinch + v, initiative - ini v, killer x(1 - kill v); gunShy: output, initiative, power, killer
  // plan / planShy: his game plan (pv) shifted by these x v all fight: caution backs off and boxes long, gun-shy won't commit
  // tuned Oct 17 (tests/scar.js, 1,200 pairs): less initiative was a buff here (boxing long beats leading in this engine), so caution = less power + long, gun-shy = output
  scar: { on: 1, plan: { range: 40, power: -.6 }, planShy: { power: -1 }, risk: 2, shell: 1, clinch: 1, ini: 1, kill: 1, shyOut: 4, shyIni: 1.5, shyPow: 1, shyKill: 2 },
  cl: { on: 1, norm: 4, span: 4, range: 10, rush: 4, rushV: .5 }, // he ties up every time he gets close (his clinches in memory over norm, out of span): keep him on the end of the jab (range), meet him on the way in (rush: the check hook fires more, and on a slower walk-in, rushV x BR.rushV)
  // f1b, the hands tell the truth (Ed): a body-hurt man clamps his elbows to his ribs, the head opens. at .. full: how far his body meter is gone before it starts .. in full; hit: each power shot
  // that lands downstairs (fades, tau s of clock, hitMax at most); the other man: see (the guard he sees drops this much at a full clamp seen), up (go upstairs), open (an opening)
  // 1b, the long guard (research/longguard.md): by style (a trait: profile.traits.post wins), only out at long range (near .. far), not hurt, gas over gas; how well: his jab + range skill (q, low .. high)
  post: { on: 1, by: { outboxer: .8, boxerpuncher: .25, counter: .2 }, near: 56, far: 84, gas: .35, q: [.5, 1], close: 30 }, // close: a man walking in faster than this (units/s): the hand comes home
  clamp: { on: 1, at: .35, full: .85, hit: .12, hitMax: .6, tau: 45, see: .15, up: .2, open: .25 },
  // f2, the World-class bait (Ed, Oct 19; Atlas: jab, step back, invite the right, counter the miss). Once he's sure of the other man's lead (sure, the lead read), at mid-range (d) he drops the hands (guard)
  // for win s: the defense for that punch picked (the best of DEF_THRU vs it, chosen x def), seen sooner (rd), the counter loaded (ctr x). Only World class: (read + counter) mastery over at, full at World.
  // Rare, and it goes by the man (Ed): p a decision x (1.3 - initiative) x (.4 + patience) x (.5 + composure) x his counter skill; gap s between, quit after that many in a row with no bite (the round).
  // The other man: thru = chance to see through it by his read [N, I, P, W] (Ed), x(1 + wary per bite); seen through he takes nothing (throws x hold, the guard he sees stays up at seeG)
  wb: { on: 1, at: .82, sure: .5, d: [58, 82], p: .02, gap: 10, win: 1.5, after: .8, quit: 2, guard: .3, rd: .7, def: 6, try: .95, ctr: 3,
    thru: [.05, .1, .25, .5], wary: .15, hold: .2, seeG: .6, modes: { work: 1, counter: 1, feelout: 1, press: 1, reset: 1 } },
  // f3 easy flaws (plug-in only: preset('easy') sets profile.flaw by his style; the game never does): one hole a player can spot and beat, never fixed in the fight. in: he's closing = his own feet bring him in faster than this (units/s, smoothed)
  // jab (slugger): walks in behind no jab defense, tries to defend a jab x try while he closes. fold (outboxer): crowded (the man inside near) for build s running, he shells for hold s: guard, output x out and no counters, slides off x lat, fights for room x push, blocks x blk, the body open (hole).
  // straight (swarmer): head comes in straight, lunging in (his feet faster than v) he tries to defend a power shot x try at quality x q. same (counter, Ed Oct 20: a habit to find): every counter he throws is the same punch (p), and for t s after it his guard's at guard and he defends head shots x try: slip that one and come back.
  // drop (boxer-puncher): the jab hand comes back low, t s after a jab the guard's at guard and he defends head shots x try. hole: what the host's own (passive) defense loses to those punches meanwhile (Action.hole)
  flaw: { by: { slugger: 'jab', outboxer: 'fold', swarmer: 'straight', counter: 'same', boxerpuncher: 'drop' }, in: 8, k: .6, // k: how open the holes are, all of them (the defense he loses x k; .6, Ed Oct 20: easy vs a Pro ~15%, was 11% at 1)
    jab: { try: .2, hole: .7 }, fold: { near: 48, build: 1, hold: 2.5, guard: .95, out: .25, lat: .15, push: .3, blk: 3, hole: .4 }, straight: { try: .3, q: .7, hole: .8, v: 25 },
    same: { p: 'cross', t: .5, guard: .35, try: .45, hole: .5 }, drop: { t: .4, guard: .3, try: .45, hole: .4 } },
  body: { on: 1, k: 1, norm: .5, min: 20, ctr: 1.5, trade: .6, def: .5, range: 8, out: .3 }, // he lives downstairs (his body share over norm): counter over the top, even when it lands (trade), cover low (def: more tries), keep him on the end of the jab (range), and nothing's coming at the head: let the hands go (out)
  prior: { on: 1, k: .6, won: .6, lost: 1.6, odd: .5, drop: .08, back: .25, adjust: 1 }, // adjust: how many times the loser makes his change before the bell (it fades like any round's change)
  fam: { on: 1, at: .45, atS: .9, full: 1, gone: [4.5, 3], keep: .2, // atS: the stance bar (southpaws are rare, most men sit under it); keep: the part that never fades in the fight
    react: .2,              // he sees everything later (x(1 + react) at full unfamiliarity)
    weapon: .22,            // the opposite stance's main weapon (the southpaw's straight left, the lead hook) comes from where he doesn't look: seen this much later on top
    pred: .3,               // the predicted-punch bonus, cut by this much
    mem: .3,                // reads his habits this much slower (memory notice)
    mis: .3 },              // misreads up this much
  // setups and traps (research/mind_traps.md 4). Tables [Novice, Intermediate, Pro, World class] on mastery, like BR.lv. on: each piece's switch (0 = off, the old code)
  trap: { on: { show: 1, bank: 1, draw: 1, delay: 1, vary: 1 },
    // show it, change it: he watches how the man answers a combo, and once the answer is the same every time, he changes the ending to beat it
    shows:  [9, 4, 3, 2],          // looks at a combo before he trusts the answer (a novice never really does)
    same:   .6,                    // the top answer's share that counts as "he does that every time"
    spring: [.15, .4, .6, .8],     // chance the change goes on the next use, once he trusts it
    right:  [.35, .65, .9, 1],     // he picks the change from the answer (else any change: often the wrong one)
    bait:   [0, .15, .3, .4],      // shows a combo again on purpose while he builds the read (weight up)
    ctrWin: 1.2,                   // he answered my combo with a counter this soon after (s)
    ctrUp:  1.6,
    fool:   .5,                    // the changed punch: chance the man answers it on autopilot, the way he always does                   // the change vs a counterman: half the combo, then my counter is loaded (counter chance x)
    // the body bank: invest early, cash it upstairs later (Ward, Inoue)
    bankFade: .85,                 // body work carries to the next round this much
    invest: [0, .15, .3, .4],      // extra body weight in the first part of the fight (x his body taste)
    investTo: .35,                 // ... up to this share of the rounds
    payFrom: 3,                    // the bank pays from this round
    pay:    [0, .5, 1, 1.2],       // head-ending-after-body weight x(1 + pay x min(payMax, payK x bank))
    payK: .1, payMax: .6,
    // the armed trap: draw the lead (show the jab, he steps in behind his lead, the pull counter) (Atlas, Marquez)
    draw:   [0, 0, .3, .4],        // chance a throw is the bait instead (x(1.3 - initiative): counter-minded men more), when he has the skills
    drawCtr: .6,                   // counter skill it takes
    drawWin: 1.1,                  // he led into it this soon after the bait (s)
    drawBack: 0, drawBackT: .6,    // a step back after the bait jab (range, s). Off: it gave a mover free room (counter-puncher 44 vs the field, styles.js Oct 15)
    drawNeed: [9, 9, 3, 2],        // he led into the bait this often before it's armed
    drawHide: 1,                   // before it's armed, he doesn't burn the counter on the bait (counter chance x). 1: hiding it cost a counterman more than the trap paid
    drawRd: .6,                    // armed: he's sure what's coming (read bonus)
    drawSpring: [.35, .4],         // armed and he leads into it: chance the counter goes with his shoulder (+ x counter skill)
    // adjust delay: rounds of losing before he changes anything (Crawford 2-3, Loma 8, Canelo never)
    delay:  [5, 3.5, 2, 1],  
    menu:   [2, 4, 6, 6],          // how many answers he knows between rounds
    // his side: a smart defender doesn't give the same answer every time
    vary:   [0, .15, .35, .55],    // chance he breaks his habit when one answer is over `same` of his last ones
    varyN: 5, varyX: .35,
    burnWin: 1.2, burnN: 2, burnFade: .5 },
  // the hurt brain by tier (Ed, Oct 15): a novice swings for the fences, a vet picks clean shots and respects a hurt man's counter; a hurt vet is the dangerous one.
  // Tables [Novice, Intermediate, Pro, World class] on mastery, neutral at Pro. on: each piece's switch (0 = off, the old code)
  // the corner (Ed, Oct 15: the corner and live shouts, the corner weighs more, he always listens; research/mind_coach.md 4-5). Each call is an offset on his own plan
  // (initiative, range, jab, power, body: the same units as this.plan), out = throw rate x, guard = + on his guard. Corner plan (STRATS key) at full strength, fading to 1 - fade by the bell;
  // corner x (blind plans at 1 swung mirror fights -4..+7: research says 20-40% of the gap); a live shout (SHOUTS key) at live x how well he took it (engine q), in over ramp clock s, out with the engine's own fade. Output calls are capped by the tank (gasOut .. 1)
  coach: { on: 1, corner: .6, live: .45, ramp: 2, fade: .5, gasOut: .5,
    plan: { pressure: { initiative: .25, range: -8, out: 1.1 }, move: { range: 10, initiative: -.15, jab: .25, power: -.1 }, body: { body: .35, range: -4 },
      counter: { initiative: -.3, out: .9 }, ko: { power: .3, initiative: .25, range: -6, out: 1.1 }, survive: { range: 12, initiative: -.35, out: .75, guard: .15 },
      up: { out: 1.18, initiative: .15 }, down: { out: .85 } },
    call: { jab: { jab: .3, range: 3 }, body: { body: .35, range: -3 }, press: { initiative: .3, range: -8 }, counter: { initiative: -.3 }, move: { range: 8, initiative: -.15 },
      hands: { guard: .15, out: .85 }, up: { out: 1.18, initiative: .15 }, down: { out: .85 } } },
  // gas pacing (Ed, Oct 15: a man who knows his tank adjusts naturally and adapts to the fight; research/mind_pace.md 2, 4). A throw-rate x for the round, on top of the in-the-moment fatigue throttle.
  // know [N, I, P, W] on pacing mastery: how much he budgets. His tank (stamMax vs the first bell) against the line from 1 to end by the last round (the field's tank runs ~1 to .64 by R11 of 12): ahead of it he spends, behind it he saves (adj per point, capped at max).
  // last: the last round, nothing to save. fade: the other man's gas under fadeAt and well under mine, step on it (x read). rush: a novice comes out too hot the first rushR rounds (the fast-start fade)
  gas: { on: 1, know: [0, .4, .8, 1], end: .62, adj: 1.2, max: .15, last: .1, fade: .12, fadeAt: .4, rush: [.12, .06, 0, 0], rushR: 3 },
  hb: { on: { reck: 1, ignore: 1, respect: 1, wild: 1, tunnel: 1, danger: 1 },
    reck:    [.35, .15, 0, 0],      // finisher (read + pacing): extra chance he skips the look and goes all in
    ignore:  [.6, .3, 0, 0],        // ... he doesn't see the warning signs (still throwing back, countered me) and goes all out anyway
    respect: [0, 0, 0, .25],        // ... no warning signs, but he finishes behind the guard anyway (a hurt man can still bite)
    wild:    [1.6, 1.25, 1, .85],   // all-out hunt: wide punches x(lerp to this by how wide)
    tunnel:  [1.4, 1.15, 1, .8],    // hunting, he sees the counter late: x this on BR.tunnel
    danger:  [.8, .9, 1, 1.25] } // he only varies once the habit got him hit: he answered, then ate the next one this soon (s); full chance at burnN burns; burns carry to the next round this much         // last answers he remembers, weight left on the habit
};
// the opposite stance's main weapons: the rear straight down the middle, the lead hook from outside
const FAM_WPN = { cross: 1, bodyCross: .7, hook: .5 };
const TIER_C = [.34, .56, .74, .90];
// a level table read at mastery m (0..1): straight lines between the tier centers, flat past the ends
function tierV(m, t) { if (m <= TIER_C[0]) return t[0]; for (let i = 1; i < 4; i++) if (m <= TIER_C[i]) return lerp(t[i - 1], t[i], (m - TIER_C[i - 1]) / (TIER_C[i] - TIER_C[i - 1])); return t[3]; }
// a curve through [x, y] points, flat past the ends
function ptsV(x, P) { if (x <= P[0][0]) return P[0][1]; for (let i = 1; i < P.length; i++) if (x <= P[i][0]) return lerp(P[i - 1][1], P[i][1], (x - P[i - 1][0]) / (P[i][0] - P[i - 1][0])); return P[P.length - 1][1]; }
// the same, eased toward 1 (Pro) by how much of it is switched on
function lvV(key, m) { const on = BR.lv.on[key] || 0, v = tierV(m, BR.lv[key]); return on === 1 ? v : lerp(key === 'off' || key === 'late' || key === 'flinch' || key === 'tell' || key === 'freeze' ? 0 : key === 'len' ? 9 : 1, v, on); }
// a trap table (BR.trap) read at mastery m
const trV = (key, m) => tierV(m, BR.trap[key]);
// a hurt-brain table (BR.hb) at mastery m, or neutral (Pro's value) when that piece is off
const hbV = (key, m) => BR.hb.on[key] ? tierV(m, BR.hb[key]) : BR.hb[key][2];
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
  bluff:  { aggr: .8, range: 2, guard: .85, lat: .5 },                   // acts fine (1f): stands his ground and fires back, no shell, no run, no grab
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
  /** @param {any} profile @param {BrainOpts} [opts] */
  constructor(profile, opts) {
    opts = opts || {};
    this.p = profile; this.R = opts.rng || Math.random; this.debug = !!opts.debug;
    this.thrownEv = !!opts.thrownEv; // the game tells him which punches really started ('thrown' / 'pulled' events): telemetry counts those, not what he decided
    this.pace = opts.pace || 1; // a game whose rounds run faster than the clock (the Last Bell engine: 3) squeezes the slow things (moods, memory, intent modes) and keeps the work rate per round; reactions stay human
    // spread squeezes his overall level (how far apart the tiers play) but keeps his own strengths full size: a counter-puncher's counter stays his edge
    const raw = s => (profile.skills[s] == null ? 50 : profile.skills[s]) / 100, avg = SKILL_KEYS.reduce((t, s) => t + raw(s), 0) / SKILL_KEYS.length, lvl0 = .5 + (avg - .5) * BR.spread, lvl = BR.lv.on.kLvl ? lerp(lvl0, ptsV(avg, BR.lv.kLvl), BR.lv.on.kLvl) : lvl0;
    this.k = {}; for (const s of SKILL_KEYS) this.k[s] = clamp(lvl + (raw(s) - avg) * BR.spreadOwn, 0, 1);
    this.m = {}; for (const s of SKILL_KEYS) this.m[s] = avg + (raw(s) - avg) * BR.lv.own; // mastery as the level tables (BR.lv) read it: his level, plus a slice of his own strengths and holes (a style's holes already cost him in the brain)
    this.lvUpd();
    this.famSet(opts.fam); this.fx = { u: 0, s: 0 };
    this.tr = Object.assign({}, STYLES.boxerpuncher.t, profile.traits);
    this.pst = profile.traits.post != null ? profile.traits.post : BR.post.by[profile.style] || 0; // 1b: how much he likes the long guard
    this.scarSet(opts.scar);
    const k = this.k;
    this.iq = (k.read + k.counter + k.pacing + k.adjust) / 4;
    this.t = 0; this.mode = 'feelout'; this.modeT = 0; this.decT = .3; this.hurtResp = null;
    this.ct = 0; this.desp = 0; this.wary = null; this.blur = 0; this.kds = 0; // clock time (s), late desperation, range kept after a hurt
    this.h = { t0: -99, end: -99, n: 0, goal: 4, look: -9, kdBy: -99, kdMe: -99, ctrd: -99, chk: 0, falseA: 0, unans: 0, flip: 0, second: 0, freezeEnd: 0, kdR: 0 }; // the hunt and the hurt
    this.mem = { mine: {}, his: {}, lead: {}, after: {}, def: {}, hurt: {}, feints: 0 };
    this.memT = {}; this.memN = new Map(); for (const nm in this.mem) if (typeof this.mem[nm] === 'object') { this.memN.set(this.mem[nm], nm); this.memT[nm] = {}; } // the same tables, whole fight, never fading: what he takes home (memo)
    this.emo = { conf: 0, frus: 0, fear: 0 };
    this.plan = { jab: 0, power: 0, body: 0, range: 0, initiative: 0 }; // between-round changes
    this.queue = null; this.setup = null; this.hist = [];
    this.bait = {}; this.lf = null; this.ctrReady = -9; this.payNext = null; this.dl = { hits: 0, led: {}, armed: null, win: -9, back: -9, next: 0, armedR: 0 }; // setups and traps: how he answers each of my combos, my last combo on its way, the counter I loaded
    this.threat = null; this.lastHisP = null; this.lastHisT = -9; this.lastMine = null; this.lastDef = null;
    this.rangeJit = 0; this.nd = 0; this.fat = 0; this.lat = (this.R() < .5 ? 1 : -1);
    this.sc = { me: 0, him: 0, lead: 0, rounds: [] }; // his own guess at the cards
    this.tel = { decisions: 0, holds: 0, throws: 0, feints: 0, setups: 0, counters: 0, seen: 0, late: 0, noTry: 0, misreads: 0, bites: 0, feintsRead: 0, antic: 0, reactSum: 0, reactN: 0, modeT: {}, techSum: 0, techN: 0, hunts: 0, hurts: 0, caught: 0, hurtR: {}, mThr: {}, mLand: {}, chg: 0, chgRight: 0, chgPay: 0, chgL: 0, baits: 0, bitL: 0, armed: 0, sprung: 0, trapN: 0, trapL: 0, trapR: [] };
    // the fight report (L4 learning reads it after the bell): my punches by type [thrown, landed], his at me and how they ended, combos [started, punches, landed], feints that bit, counter punches [thrown, landed], what hurt and dropped me. Counts only, nothing reads them in the fight
    this.pri = null; this.trust = 1; this.priW = 0; this.sp = this.sp || null;
    this.rep = { p: {}, at: { n: 0, blk: 0, ev: 0, land: 0, short: 0 }, combo: [0, 0, 0], inC: 0, feintBit: 0, ctr: [0, 0], inCtr: 0, hurtBy: {}, kdBy: {}, lastHit: null };
    this.log = [];
    { let h = 7; for (const s of SKILL_KEYS) h = Math.imul(h ^ (profile.skills[s] || 0), 0x9E3779B1) + 1; for (const c of String(profile.name || '')) h = Math.imul(h ^ c.charCodeAt(0), 0x85EBCA77);
      this.eR = mulberry32(h); } // the eyes roll their own dice: noticing never moves the fight's rng
    this.wb = { p: null, until: -9, next: 0, id: 0, bit: 0, bitT: -9, right: 0, miss: 0, off: 0, def: null }; this.wbS = { id: 0, thru: -9, bites: 0, live: 0 }; // f2: my bait, and his (what I saw of it)
    this.eye = {}; this.eyeLog = []; // what he's seen of the other man: cue -> { v, t, first }; eyeLog: first sightings and big moments, for the game to show (E3)
    this.priorSet(opts.prior); this.flawSet(profile.flaw);
    this.out = { intent: 'feelout', move: { range: 64, lateral: 0, cut: 0, clinch: false }, guard: .6, punch: null, defend: null, why: '' };
  }
  // f3: an easy man's one hole (BR.flaw), null = none. A host (or a test) can call it again after create
  flawSet(f) { this.fl = Object.values(BR.flaw.by).includes(f) ? f : null; this.flT = -9; this.dropT = -9; this.myV = 0; this.pD = null; this.pr = 0; }
  // his initiative, with the plan and the corner on top
  ini() { return clamp(this.tr.initiative + this.pv('initiative'), 0, 1); }
  inn(P) { return this.myV > BR.flaw.in; } // he's walking in
  lunge() { return this.myV > BR.flaw.straight.v; } // ... fast
  flawTry(P, p) { const x = this.flawT(P, p); return 1 - (1 - x) * BR.flaw.k; }
  flawT(P, p) { const F = BR.flaw, f = this.fl; // how much of his defense the hole leaves him, vs this punch
    if (f === 'jab' && PUNCHES[p].cat === 'jab' && this.inn(P)) return F.jab.try;
    if (f === 'straight' && this.lunge() && PUNCHES[p].cat === 'power') return F.straight.try;
    if ((f === 'drop' || f === 'same') && this.t < this.dropT && PUNCHES[p].zone === 'head') return F[f].try;
    return 1; }
  holeOf(P) { const h = this.holeT(P); if (h) h.k *= BR.flaw.k; return h; }
  holeT(P) { const F = BR.flaw, f = this.fl; // ... and what's open to the host's own defense
    if (f === 'jab' && this.inn(P)) return { cat: 'jab', k: F.jab.hole };
    if (f === 'straight' && this.lunge()) return { cat: 'power', k: F.straight.hole };
    if ((f === 'drop' || f === 'same') && this.t < this.dropT) return { zone: 'head', k: F[f].hole };
    if (f === 'fold' && this.t < this.flT) return { zone: 'body', k: F.fold.hole }; // shelled up top, the elbows leave the body
    return null; }
  // what his mastery does to the body of his punches, for the game to read (BR.lv): per punch skill, and his defense habits
  lvUpd() {
    const m = this.m, sk = { jab: m.jab, power: m.power, body: m.body }, L = this.mast = { force: {}, gas: {}, off: {}, late: {} };
    for (const c in sk) { L.force[c] = lvV('force', sk[c]); L.gas[c] = lvV('gas', (sk[c] + m.pacing) / 2); L.off[c] = lvV('off', (sk[c] + m.footwork) / 2); L.late[c] = lvV('late', (sk[c] + m.block) / 2); }
    L.flinch = lvV('flinch', (m.block + m.slip) / 2);
  }
  // L3: how new this man is to him (0 = seen plenty, 1 = never), by style and by stance. null = neutral. The game calls it again when he switches stance
  famSet(f) { const F = BR.fam, u = (k, a) => k == null ? 0 : clamp((a - k) / a, 0, 1); this.fam = f ? { style: u(f.style, F.at), stance: u(f.stance, F.atS || F.at) } : null; }
  // ... and now: it fades as the rounds go (a reader adapts sooner). fx.u = his reads, fx.s = the stance (the main weapon)
  famUpd(P) {
    const F = BR.fam, x = this.fx; if (!this.fam || !F.on) { x.u = x.s = 0; return; }
    const rf = (P.round || 1) - 1 + (P.clock || 0) / (P.roundLen || 180), gone = lerp(F.gone[0], F.gone[1], this.k.read), fade = Math.max(F.keep, clamp((gone - rf) / Math.max(.1, gone - F.full), 0, 1)) * F.on;
    x.s = this.fam.stance * fade; x.u = Math.max(this.fam.style * fade, x.s);
  }
  rnd(a, b) { return a + this.R() * (b - a); }
  mm() { return this.mode === 'survive' ? SURV[this.hurtResp] || MODES.survive : MODES[this.mode]; } // the numbers of what he's doing now
  g() { return gaussR(this.R); }
  note(s) { if (this.debug) this.log.push(this.t.toFixed(1) + ' ' + s); }

  /* ---------- memory: what he has seen of the other man. Everything fades; read skill sets how much he notices and how long it sticks ---------- */
  tau() { return lerp(BR.memTau[0], BR.memTau[1], this.k.read) / this.pace; }
  mget(tbl, key) { const e = tbl[key] || (tbl[key] = { t: this.t }), f = Math.exp(-(this.t - e.t) / this.tau()); if (f < 1) for (const x in e) if (x !== 't') e[x] *= f; e.t = this.t; return e; }
  madd(tbl, key, fields) { const e = this.mget(tbl, key), w = lerp(BR.memNotice[0], BR.memNotice[1], this.k.read) * (1 - BR.fam.mem * this.fx.u); for (const x in fields) e[x] = (e[x] || 0) + fields[x] * w;
    const nm = this.memN.get(tbl); if (nm) { const T = this.memT[nm][key] || (this.memT[nm][key] = {}); for (const x in fields) T[x] = (T[x] || 0) + fields[x] * w; }
    return e; }
  mpeek(tbl, key) { const e = tbl[key]; if (!e) return null; const f = Math.exp(-(this.t - e.t) / this.tau()), o = {}; for (const x in e) if (x !== 't') o[x] = e[x] * f;
    if (this.pri) { const P = this.pri.get(tbl), q = P && P[key]; if (q) { const sc = this.tau() * BR.prior.k * this.priW * this.trust; for (const x in q) o[x] = (o[x] || 0) + q[x] * sc; } } // what he remembers of this man (L4c)
    return o; }
  /* ---------- L4c: a man he has fought before. The memo (rates per second of what he filed, whole fight) comes back as a prior: as if he had been watching him `k` of a live read,
     times how much of it is left (w) and how much he still trusts it. A lead the prior says he never throws costs trust (a reader drops a stale read fast). The loser walks in with one change made ---------- */
  priorSet(pr) {
    if (!pr || !pr.tbl || !BR.prior.on) return;
    this.pri = new Map(); this.priW = (pr.w == null ? 1 : pr.w) * (pr.lost ? BR.prior.lost : pr.won ? BR.prior.won : 1); this.trust = 1;
    for (const nm in pr.tbl) { const tbl = this.mem[nm]; if (!tbl || typeof tbl !== 'object') continue; this.pri.set(tbl, pr.tbl[nm]);
      for (const key in pr.tbl[nm]) if (!tbl[key]) { const z = { t: 0 }; for (const x in pr.tbl[nm][key]) z[x] = 0; tbl[key] = z; } } // so the readers that walk the table see what he remembers
    if (pr.lost && BR.prior.adjust) { const o = this.adjOpts().reduce((a, b) => b[1] > a[1] ? b : a); if (o[1] > .05) { for (let i = 0; i < BR.prior.adjust; i++) o[2](); this.note('remembers losing to him: ' + o[0]); } }
  }
  // L4e: what a knockout loss left (opts.scar, written between fights by the game). Caution: guard up, fewer risks, more clinch, waits more. Gun-shy (a man without the composure):
  // the trigger sticks, he throws less and doesn't sit down on it. v = how much is left (BR.scar x v at full)
  scarSet(sc) {
    if (!sc || !sc.v || !BR.scar.on) return; const t = this.tr, v = sc.v, cl = x => clamp(x, 0, 1), S = BR.scar;
    if (sc.kind === 'gunShy') { t.output = cl(t.output * (1 - S.shyOut * v)); t.initiative = cl(t.initiative - S.shyIni * v); t.power = cl(t.power - S.shyPow * v); t.killer = cl(t.killer * (1 - S.shyKill * v)); }
    else { t.risk = cl(t.risk * (1 - S.risk * v)); t.shell = cl(t.shell + S.shell * v); t.clinch = cl(t.clinch + S.clinch * v); t.initiative = cl(t.initiative - S.ini * v); t.killer = cl(t.killer * (1 - S.kill * v)); }
    const P = sc.kind === 'gunShy' ? S.planShy : S.plan; this.sp = {}; for (const x in P) this.sp[x] = P[x] * v; // the game plan he walks in with, all night
    this.scar = sc.kind;
  }
  priorCheck(type) {
    const P = this.pri && this.pri.get(this.mem.lead); if (!P) return; let tot = 0; for (const x in P) tot += P[x].n || 0; if (!tot) return;
    const sh = (P[type] ? P[type].n || 0 : 0) / tot, B = BR.prior, rd = .2 + .8 * this.k.read;
    if (sh < B.odd / PTYPES.length) this.trust = Math.max(0, this.trust - B.drop * rd); else if (sh > 1.5 / PTYPES.length) this.trust = Math.min(1, this.trust + B.drop * B.back * rd);
  }
  memo() { const out = {}, T = Math.max(1, this.t); for (const nm in this.memT) { out[nm] = {}; for (const key in this.memT[nm]) { const o = {}; for (const x in this.memT[nm][key]) o[x] = +(this.memT[nm][key][x] / T).toPrecision(3); out[nm][key] = o; } } return out; }
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
    return clamp((q - base) / .45, 0, 1) * this.k.read * (PUNCHES[type].cat === 'jab' || type === 'bodyJab' ? .5 : 1) * (1 - BR.fam.pred * this.fx.u);
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
      else { this.sc.him += 3; E.fear = clamp(E.fear + .4 * (1.25 - comp), 0, 1); E.conf = clamp(E.conf - .3, -1, 1); this.h.kdMe = this.ct; this.h.kdR = 1; this.h.kdUp = 1; this.kds++; const L = this.rep.lastHit; if (L) this.rep.kdBy[L] = (this.rep.kdBy[L] || 0) + 1; } // he gets up hurt, whatever the legs say, and picks again
      return;
    }
    if (ev.type === 'clinch') { if (ev.by === 'him' && !this.hisHurt && this.mode !== 'survive') this.madd(this.mem.def, 'clinch', { n: 1 }); return; } // he grabbed me (a hurt man holding on, or me hurt, isn't a grabber's habit)
    if (!PUNCHES[ev.p]) return;
    if (ev.by === 'me') {
      const p = ev.p, kd = kindOf(p);
      if (ev.type === 'thrown' || ev.type === 'pulled') { const n = ev.type === 'thrown' ? 1 : -1; if (ev.first) this.tel.throws += n; this.tmode(n); return; } // the engine started it (or he pulled it back before it was a punch)
      if (ev.type === 'feinted') { if (ev.bit) this.rep.feintBit++; if (ev.bit) this.madd(this.mem.def, 'feint', { n: 1, bit: 1 }); else this.madd(this.mem.def, 'feint', { n: 1 }); if (ev.bit && this.setup && this.setup.onBite) this.setup.bit = ev.def || 'block'; return; }
      { const Rp = this.rep, e = Rp.p[p] || (Rp.p[p] = [0, 0]), l = ev.type === 'landed' ? 1 : 0; e[0]++; e[1] += l; if (Rp.inCtr > 0) { Rp.inCtr--; Rp.ctr[0]++; Rp.ctr[1] += l; } if (Rp.inC > 0) { Rp.inC--; Rp.combo[1]++; Rp.combo[2] += l; } }
      this.madd(this.mem.mine, p, { n: 1, l: ev.type === 'landed' ? 1 : 0, b: ev.type === 'blocked' ? 1 : 0, e: ev.type === 'evaded' ? 1 : 0 });
      if (ev.def) this.madd(this.mem.def, kd, { n: 1, [ev.def]: 1 }); else if (ev.type === 'landed') this.madd(this.mem.def, kd, { n: 1, none: 1 });
      this.lastMine = { p, t: this.t }; if (this.fl === 'drop' && p === 'jab') this.dropT = this.t + BR.flaw.drop.t; // f3: and the hand comes back low
      if (this.lf && (BR.trap.on.show || BR.trap.on.draw)) this.lfHear(ev);
      if (ev.type === 'landed' && PUNCHES[p].zone === 'body') { this.bodyL = (this.bodyL || 0) + 1; this.bank = (this.bank || 0) + 1; } // body work in the bank
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
      { const A = this.rep.at; A.n++; if (ev.type === 'blocked') A.blk++; else if (ev.type === 'evaded') A.ev++; else if (ev.type === 'missed') A.short++; else if (ev.type === 'landed') { A.land++; this.rep.hurtBy[p] = (this.rep.hurtBy[p] || 0) + (ev.dmg || 2); this.rep.lastHit = p; } }
      if (ev.type === 'landed') {
        const dmg = ev.dmg || 2;
        this.madd(this.mem.hurt, p, { d: dmg });
        E.conf = clamp(E.conf - .035 * dmg / 3, -1, 1); E.fear = clamp(E.fear + dmg / 90 * (1.25 - comp), 0, 1);
        this.sc.him += guess(pts(p));
        if (PUNCHES[p].zone === 'body' && p !== 'bodyJab') this.bp = (this.bp || 0) + 1; // f1b: it hurt downstairs (the elbows come in)
        if (this.mode === 'survive') { if (PUNCHES[p].cat !== 'jab') this.h.unans++; this.modeT = Math.min(BR.surv.hurtMax, this.modeT + BR.surv.hitAdd); }
        if (ev.counter) { this.h.ctrd = this.ct; if (HUNTS[this.mode] && PUNCHES[p].cat !== 'jab' && !this.h.stung) { this.h.stung = 1; this.tel.stung = (this.tel.stung || 0) + 1; } } // walked onto one
        if (ev.counter && this.lf && BR.trap.on.show && this.t - (this.lf.done || this.t) < BR.trap.ctrWin) { this.madd(this.bait, this.lf.id, { ctr: 1 }); this.lf = null; } // he answers that one with a counter
        if (BR.trap.on.vary && this.lastDef && this.t - this.lastDef.t < BR.trap.burnWin) this.burn = (this.burn || 0) + 1; // my answer got me hit
        if (ev.counter && this.lastMine && this.t - this.lastMine.t < 1.5) { this.madd(this.mem.mine, this.lastMine.p, { c: 1 }); E.frus = clamp(E.frus + .04 * (1 - comp * .5), 0, 1); }
      }
      if (ev.type === 'landed' && PUNCHES[p].zone === 'body' && this.mode !== 'survive') { const e = this.bodyRead(); if (e && this.R() < BR.body.trade * e) this.tryCounter('trade', p); } // take it on the elbow and hit him while he's down there
      if (ev.type === 'evaded' || ev.type === 'blocked') { if (ev.def) this.lastDef = { def: ev.def, p, t: this.t }; this.tryCounter(ev.def, p); }
      else if (ev.type === 'missed' && ev.short && this.R() < BR.shortCtr) this.tryCounter('short', p); // he fell short: he's reaching, and coming back slow
    }
  }
  // show it, change it: each punch of my last combo comes back; the last one tells me how he answers a combo that ends on that punch (the change's own punch: did it work?)
  lfHear(ev) {
    const L = this.lf, i = L.k++;
    if (L.trap) { if (!i) this.tel.trapN++; if (!i && ev.type === 'landed') { this.tel.trapL++; this.dlPaid(); } return; } // the trap's counter: it landed, he won't step in like that again
    if (i === L.pay) { this.tel.chgPay++; if (ev.type === 'landed') { this.tel.chgL++; if (L.base) delete this.bait[L.base]; } } // it landed: he'll stop answering it that way, start over
    if (i !== L.n - 1 || L.done) return;
    L.done = this.t;
    if (L.pay == null && BR.trap.on.show) this.madd(this.bait, L.id, { n: 1, [ev.def || (ev.type === 'landed' ? 'none' : ev.type === 'missed' ? 'miss' : 'block')]: 1 });
  }
  // his answer to this combo, if he gives the same one every time (and I've seen it enough to trust it)
  baitRead(id) {
    const e = this.mpeek(this.bait, id); if (!e || !e.n) return null;
    let top = null, v = 0; for (const x in e) if (x !== 'n' && e[x] > v) { v = e[x]; top = x; }
    return { n: e.n, ans: top, share: v / e.n };
  }
  // the change that beats his answer to combo ps (a copy). null = nothing to change (it lands, or it's out of range)
  changeFor(ps, ans) {
    const last = ps[ps.length - 1], out = ps.slice();
    if (ans === 'block' || ans === 'roll') { const sw = { jab: 'bodyJab', cross: 'bodyCross', hook: 'bodyHook', rhook: 'bodyHook', uppercut: 'hook', lupper: 'cross', bodyJab: 'jab', bodyCross: 'hook', bodyHook: 'hook' }; out[out.length - 1] = sw[last]; return out; } // he covers where it always goes: go where the guard isn't
    const d = this.dNow == null ? 60 : this.dNow, fits = p => PUNCHES[p].max + BR.reachStep >= d;
    if (ans === 'slip') { if (last !== 'hook' && fits('hook')) out.push('hook'); else out[out.length - 1] = PUNCHES[last].zone === 'head' ? (last === 'jab' ? 'bodyJab' : 'bodyCross') : 'hook'; return out; } // he slips the last one: the hook where he slips to (from long range: the head moves, the body doesn't)
    if (ans === 'duck') { out.push(['uppercut', 'bodyHook', 'bodyCross'].find(fits) || 'bodyCross'); return out; }  // he ducks it: come up the middle
    if (ans === 'pull') { out.unshift('jab'); return out; }                                 // he pulls back: double up the jab, walk him down first
    if (ans === 'ctr') return out.length > 1 ? out.slice(0, -1) : out;                       // he counters it: show half, my counter is loaded for his
    return null;
  }
  // draw the lead: he stepped in behind his lead right after my bait jab. Once he does it every time (the same punch), the trap is armed
  dlBit(H) {
    const D = this.dl, T = BR.trap, m = (this.m.counter + this.m.read) / 2;
    D.win = -9; this.tel.bitL++;
    if (D.armed && H.type === D.armed) { // there it is: he's sure what's coming. Pull back from it, and the right hand goes as he comes back (the pull counter)
      if (this.threat) this.threat.rd = Math.max(this.threat.rd, T.drawRd);
      if (this.mode !== 'survive' && this.R() < T.drawSpring[0] + T.drawSpring[1] * this.k.counter) {
        if (this.threat) this.threat.pull = 1;
        this.queue = { ps: ['cross'], why: 'trap: pull counter', ctr: 1, at: this.t + (H.impactIn != null && H.impactIn < 1 ? H.impactIn : .2) + lerp(.1, .03, this.k.counter), trap: 1 };
        this.tel.counters++; this.tel.sprung++; this.tel.trapR.push(this.rd || 0); }
      return; }
    D.hits++; D.led[H.type] = (D.led[H.type] || 0) + 1;
    let top = null, v = 0; for (const x in D.led) if (D.led[x] > v) { v = D.led[x]; top = x; }
    if (!D.armed && D.hits >= trV('drawNeed', m) && v / D.hits >= .5) { D.armed = top; D.armedR = this.rd || 0; this.tel.armed++; this.note('trap armed: he steps in behind the ' + top); }
  }
  dlPaid() { const D = this.dl; D.hits = 0; D.led = {}; D.armed = null; } // he got caught: he stops biting, start over
  // the bait: a jab, then a step back to invite him in
  dlBait(dSeen) {
    const D = this.dl, T = BR.trap;
    this.tel.baits++; D.win = this.t + .3 + T.drawWin; D.back = this.t + .3 + T.drawBackT; D.next = this.t + 2;
    return this.fire(['jab'], 'bait: show the jab' + (D.armed ? ' (armed)' : ''), dSeen);
  }
  // how much he lives downstairs: his body share over the usual, as far as I've noticed it (0 = normal)
  bodyRead() {
    if (!BR.body.on) return 0; let b = 0, t = 0;
    const H = this.memT.his; for (const p of PTYPES) { const e = H[p]; if (!e || !e.n) continue; t += e.n; if (PUNCHES[p].zone === 'body') b += e.n; } // his diet all night, not the last flurry: a man digging to finish a sinking body isn't a body-only fighter
    return t < BR.body.min ? 0 : clamp((b / t - BR.body.norm) / (1 - BR.body.norm), 0, 1) * BR.body.k; // anyone sees a man who only goes downstairs: no ring-IQ scaling (it widened the level gap)
  }
  clRead() { if (!BR.cl.on) return 0; const e = this.mpeek(this.mem.def, 'clinch'), n = e ? e.n || 0 : 0; return clamp((n - BR.cl.norm) / BR.cl.span, 0, 1) * lerp(.4, 1, this.k.read); } // a man who grabs every time he's close
  // the eyes (E2): each cue on screen has a chance a second to be noticed, by where he looks (his read), how much there is, and his state (blur, fear, hurt, gas, the hunt's tunnel vision)
  look(P, sdt) { // gaze from his mastery (the level tables' read), not the squeezed k: a Novice watches the gloves, World class the chest
    const L = P.him.look, B = BR.eye; if (!B.on || !L) return;
    const val = { cut: L.cut, swell: L.swell, body: L.body == null ? null : 1 - L.body, arms: L.arms == null ? null : 1 - L.arms, fold: L.fold, legs: L.legs, wobble: L.wobble, elbows: L.elbows };
    const gaze = clamp((this.m.read - .3) / .6, 0, 1), tun = HUNTS[this.mode] ? B.tunnel : 0;
    const st = (1 - B.blur * this.blur) * (1 - B.fear * this.emo.fear) * (P.me.hurt ? 1 - B.hurt : 1) * (1 - B.fat * this.fat);
    for (const c in val) {
      const v = val[c]; if (v == null || v < B.thr[c] * .5) continue;
      const w = lerp(c === 'wobble' && L.sell ? lerp(B.nov.wobble, B.nov.legs, L.sell) : B.nov[c], B.vet[c], gaze) * st * (tun && c !== 'wobble' && c !== 'legs' ? 1 - tun : 1), sal = Math.min(1.5, v / B.thr[c]);
      if (this.eR() < 1 - Math.exp(-B.rate[c] * w * sal * sdt)) {
        const e = this.eye[c], first = !e;
        if (first || this.t - e.t > 1) this.note('sees ' + c + ' ' + v.toFixed(2));
        const big = B.big[c] != null && v >= B.big[c] && !(e && e.big);
        this.eye[c] = { v, t: this.t, ct: this.ct, first: e ? e.first : this.t, big: big || !!(e && e.big), s: c === 'cut' ? L.cutS : c === 'swell' ? L.swS : null }; // s: the side of the face it's on
        if ((first || big) && this.eyeLog.length < 40) this.eyeLog.push({ c, v, t: this.t, round: P.round, clock: P.clock, first, big });
      }
    }
  }
  // E4: what he believes about the other man, from his eyes (BR.eye.e4) or the truth
  perc(P) {
    const H = P.him, L = H.look, B = BR.eye;
    if (!B.e4 || !L) return { hurt: !!H.hurt, gas: H.gas, guard: H.guard, tgt: this.target() };
    this.tk = 1 - (L.sell || 0) * BR.bluff.talk * (1 - clamp((this.m.read - .3) / .6, 0, 1)); // 1f: he's selling 'I'm fine': a face-watcher lets go of what he saw sooner
    const hold = B.hold * this.tk, w = this.eye.wobble, f = this.eye.fold, hurt = !!H.hurt && (!!w && this.ct - w.ct < hold || !!f && this.ct - f.ct < hold); // hurt only if he caught it (and it still shows): a head shot wobbles him, a body shot folds him
    const lg = this.seen('legs'), gas = lg > 0 ? clamp(.6 - lg, 0, 1) : 1; // the tank as the feet show it; nothing seen = he looks fresh
    const bg = L.arms != null ? H.guard / (.5 + .5 * L.arms) : H.guard, guard = (L.arms != null ? bg * (.5 + .5 * (1 - this.seen('arms'))) : H.guard) * (1 - BR.clamp.see * this.seen('elbows')); // the hands he sees; the wear only if he's noticed it, the gloves low if he's seen the elbows clamp (f1b)
    return { hurt, gas, guard, tgt: this.target(), el: BR.clamp.on ? clamp(this.seen('elbows') / BR.eye.thr.elbows - .5, 0, 1) : 0 };
  }
  // 1e: the damage he's spotted, to go after: the worse eye (a cut or a swelling, with its side), a sinking body, worn arms (0..1 each, as he saw them)
  target() {
    const T = BR.tgt; if (!T.on || !BR.eye.on) return null;
    const at = (v, r) => clamp((v - r[0]) / (r[1] - r[0]), 0, 1), c = this.eye.cut, w = this.eye.swell;
    const ec = c ? at(this.seen('cut'), T.cut) : 0, es = w ? at(this.seen('swell'), T.swell) : 0;
    const eye = Math.max(ec, es), side = eye <= 0 ? null : ec >= es ? c && c.s : w && w.s;
    const body = at(this.seen('body'), T.bodyAt), arms = at(this.seen('arms'), T.armsAt);
    return eye > 0 && side || body > 0 || arms > 0 ? { eye: side ? eye : 0, side, body, arms } : null;
  }
  // 1e: his own cut or closing eye: cover that side and move off it. The corner tells him at the break; before that, a smart man thinks of it himself
  // f1b: his own body's hurt, the elbows clamp to the ribs and the gloves come down with them: the meter going, and the last few that really landed down there
  // 1b: the long guard, the lead hand left out at the end of the jab while the man is out at the end of it; pulled home when he comes inside, when hurt, when the tank's low
  postOf(P) { const L = BR.post; if (!L.on || !this.pst || P.me.hurt || P.me.clinch || this.mode === 'survive' || P.dist < L.near || P.dist > L.far || P.him.closing > L.close || P.me.stam / Math.max(1, P.me.stamMax) < L.gas) return 0; return this.pst * lerp(L.q[0], L.q[1], (this.k.jab + this.k.range) / 2); }
  clampOf(P) { const C = BR.clamp; return !C.on || P.me.body == null ? 0 : clamp(clamp((1 - P.me.body - C.at) / (C.full - C.at), 0, 1) + Math.min(C.hitMax, (this.bp || 0) * C.hit), 0, 1); }
  coverOf(P) {
    const e = P.me.eye, C = BR.cover; if (!C.on || !e || !e.s || e.v < C.at) return null;
    const k = clamp((e.v - C.at) / (C.full - C.at), 0, 1) * lerp(C.self, 1, this.told === e.s ? 1 : 0) * lerp(C.lo, 1, this.k.read);
    return k > .02 ? { s: e.s, k } : null;
  }
  /** what he believes about a cue right now (0 = he hasn't seen it, or it's been a while) @param {string} c */
  seen(c) { const e = this.eye[c]; return e ? e.v * Math.exp(-(this.ct - e.ct) / BR.eye.tau[c]) : 0; }
  // f2: the other man's lead he's sure of (the lead table, like predict() with nothing just thrown): { p, q } or null
  wbLead() {
    const M = this.mem.lead; let tot = 0, best = null, bn = 0; for (const p in M) { const e = this.mpeek(M, p); tot += e.n; if (e.n > bn) { bn = e.n; best = p; } }
    if (!best) return null; const pr = lerp(BR.antPrior[0], BR.antPrior[1], this.k.read), base = 1 / PTYPES.length, q = clamp(((bn + pr * base) / (tot + pr) - base) / .45, 0, 1) * this.k.read * (1 - BR.fam.pred * this.fx.u); // the habit, not the timing: a jab he always leads with counts in full (predict() halves it)
    return q > BR.wb.sure ? { p: best, q } : null;
  }
  // f2: show him the opening. World class only, at mid-range, sure of his lead; rare, more for a patient counterman than a slugger
  wbTry(P, dSeen) {
    const W = BR.wb, D = this.wb, mm = (this.m.read + this.m.counter) / 2;
    if (mm < W.at || this.t < D.next || D.off === this.rd || dSeen < W.d[0] || dSeen > W.d[1] || !W.modes[this.mode] || P.ropes.me > .5 || P.me.hurt || this.queue || this.setup) return false;
    const L = this.wbLead(); if (!L) return false;
    const tr = this.tr, sf = (1.3 - this.ini()) * (.4 + tr.patience) * (.5 + tr.composure) * lerp(.6, 1.4, this.k.counter);
    if (this.R() > W.p * sf * clamp((mm - .74) / .16, 0, 1)) return false;
    const kd = kindOf(L.p); let def = 'block', v = 9; for (const x in DEF_THRU) if (x !== 'none' && DEF_THRU[x][kd] < v) { v = DEF_THRU[x][kd]; def = x; }
    Object.assign(D, { p: L.p, def, until: this.t + W.win, next: this.t + W.gap, bit: 0, right: 0 }); D.id++; this.tel.wbN = (this.tel.wbN || 0) + 1;
    this.note('bait: hands down for his ' + L.p + ' (' + Math.round(L.q * 100) + '% sure), ' + def + ' and the counter ready');
    return true;
  }
  // a defense worked: does he make him pay?
  tryCounter(def, p) {
    if (this.queue && this.queue.trap) return;
    if (this.t < this.flT) return; // f3: folded, nothing comes back // the trap's counter is already on its way
    const k = this.k, m = this.mm();
    let ch = lerp(BR.ctrP[0], BR.ctrP[1], k.counter) * (1.4 - 1.1 * this.ini()) * (m.ctr || 1) * (1 - .5 * this.emo.fear);
    if (this.threat && this.threat.rd > .3) ch *= 1.3; // he called it: the counter is already loaded
    if (this.t < this.ctrReady) ch *= BR.trap.ctrUp;   // I showed him half of it to draw his counter: mine is waiting
    if (this.wb.right && this.t - this.wb.bitT < 1) ch *= BR.wb.ctr; // f2: he took the bait: the counter was loaded for it
    if (BR.trap.on.draw && !this.dl.armed && this.t < this.dl.win + .6) ch *= BR.trap.drawHide;              // building the trap: don't show him the counter yet
    if (p && PUNCHES[p].zone === 'body') ch *= 1 + BR.body.ctr * this.bodyRead(); // he keeps bending to dig: the head comes with it
    if (p && PUNCHES[p].cat === 'jab' || p === 'bodyJab') ch *= BR.jabCtr; // a jab snaps back: much harder to counter than a missed hook
    if (this.mode === 'survive') {
      const r = this.hurtResp; ch *= { shell: .3, run: .4, clinch: .3, freeze: .1 }[r] || 1;
      if ((r === 'fire' || r === 'bait') && this.hisG < .55) ch *= (r === 'bait' ? BR.fin.baitCtr : BR.fin.fireCtr) * (BR.hb.on.danger ? hbV('danger', (this.m.counter + this.m.read) / 2) : 1); // he came in with his hands down: the finisher gets caught (a hurt vet more)
    }
    if (this.R() > ch) return;
    let c, why = 'counter';
    if (this.R() < .25 + .7 * k.counter) { const o = this.counterFor(def, p); if (o) { c = o[0].slice(); why = 'counter: ' + o[2]; if (c.length > 1 && this.R() > .3 + .6 * k.combos) c = c.slice(0, 1); } }
    if (!c) { const d = this.dNow == null ? 60 : this.dNow, ok = PTYPES.filter(x => PUNCHES[x].max + BR.reachStep >= d); c = [ok.length ? ok[Math.floor(this.R() * ok.length)] : 'jab']; } // he knows he should fire back, not with what (but he can see what reaches)
    if (this.fl === 'same') { c = [BR.flaw.same.p]; why = 'counter (always the ' + c[0] + ')'; } // f3: the habit
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
      d *= (1 + BR.reactFat * fat) * (1 + BR.reactFear * E.fear) * (1 + BR.reactHurt * hurt) * (1 + BR.blur.react * this.blur) * (1 + (BR.tunnel[this.mode] || 0) * (BR.hb.on.tunnel && HUNTS[this.mode] ? hbV('tunnel', this.finM()) : 1)) * Math.exp(this.g() * BR.jitter);
      d *= (1 + BR.fam.react * this.fx.u) * (1 + BR.fam.weapon * this.fx.s * (FAM_WPN[H.type] || 0)); // L3: a style he hasn't seen, a stance he hasn't seen
      const D = this.wb, wbR = !H.feint && D.p && this.t < D.until && !D.bit ? (kindOf(H.type) === kindOf(D.p) ? 2 : 1) : 0; // f2: he bit on my bait (2: the punch I was waiting on)
      if (wbR) { D.bit = 1; D.bitT = this.t; D.miss = 0; D.right = wbR === 2 ? 1 : 0; D.until = Math.min(D.until, this.t + BR.wb.after); this.tel.wbBit = (this.tel.wbBit || 0) + 1; if (D.right) this.tel.wbRight = (this.tel.wbRight || 0) + 1; this.note('he took the bait: ' + H.type); }
      const rd = Math.max(H.feint ? this.predict(H.type) * .5 : this.predict(H.type), wbR === 2 ? BR.wb.rd : 0);
      d *= 1 - BR.antic * rd;
      d -= BR.tellSee * (H.tell || 0);
      d = Math.max(BR.reactMin, d); // even a punch he's read needs a beat: no psychic blocks (Ed, Oct 17: smart, not psychic)
      d += BR.eyeShut * (H.blind || 0); // his eye's shut on that side
      const start = this.t - (H.t || 0), deadline = H.feint ? start + .3 : this.t + (H.impactIn != null ? H.impactIn : .25);
      this.threat = { id: H.id, type: H.type, feint: !!H.feint, sell: H.sell || 0, look: H.look || null, start, at: start + d, deadline, rd, done: false, wb: wbR === 2 };
      if (!H.feint) {
        // he files it: what this man throws, what he opens with, what follows what
        this.madd(this.mem.his, H.type, { n: 1 });
        if (this.lastHisP && this.t - this.lastHisT < 1.2) this.madd(this.mem.after, this.lastHisP + '>' + H.type, { n: 1 });
        else { this.madd(this.mem.lead, H.type, { n: 1 }); this.priorCheck(H.type); if (BR.trap.on.draw && this.t < this.dl.win) this.dlBit(H); }
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
    // a changed ending: on autopilot he answers the punch it always was (or doesn't answer at all: it always stopped there)
    if (T.look && BR.trap.on.show && this.R() < BR.trap.fool) { this.tel.fooled = (this.tel.fooled || 0) + 1; if (T.look === 'end') return; T.as = T.look; }
    let tryP = lerp(BR.tryDef[0], BR.tryDef[1], (k.block + k.slip + k.footwork) / 3) * (1 - .25 * E.frus);
    if (this.mode === 'burst' || this.mode === 'hunt') tryP *= .7; // busy punching
    else if (this.mode === 'huntSafe') tryP *= .9;
    if (this.mode === 'survive' && this.hurtResp === 'freeze') tryP *= .4;
    if (P.me.punching) tryP *= .3 + .45 * this.tr.slip; // a head-mover still moves his head mid-combo
    if (T.wb) tryP = Math.max(tryP, BR.wb.try); // f2: he was waiting on it
    if (this.fl) tryP *= this.flawTry(P, T.type); // f3: the hole
    if (PUNCHES[T.type].zone === 'body') tryP = Math.min(1, tryP * (1 + BR.body.def * this.bodyRead())); // he's been going downstairs: the elbows are already there
    if (this.R() > tryP) { this.tel.noTry++; return; }
    // what does he think it is?
    let seenAs = T.as || T.type;
    const exp = this.expected();
    if (T.as) { /* already decided what it is */ }
    else if (exp && exp !== T.type && this.R() < this.predict(exp) * .6) seenAs = exp; // he was sure it was the other one
    else if (this.R() < BR.misread * (1 - k.read) * (1 + .5 * (1 - P.me.stam / (P.me.stamMax || 100))) * (1 + BR.blur.mis * this.blur) * (1 + BR.fam.mis * this.fx.u) * (1 - T.rd)) seenAs = PTYPES[Math.floor(this.R() * PTYPES.length)];
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
    if (T.pull) w.pull = Math.max(w.pull, .5) * 4; // the trap: he's ready to pull back from it
    const st = this.fl === 'straight' && this.lunge() && PUNCHES[T.type].cat === 'power'; // f3: the head comes in straight
    if (this.t < this.flT) w.block *= BR.flaw.fold.blk; // f3: folded, he shells
    if (T.wb && seenAs === T.type) w[this.wb.def] = Math.max(w[this.wb.def] || 0, .3) * BR.wb.def; // f2: the defense he picked for it before it came
    if (BR.trap.on.vary) { const hs = (this.myDef || (this.myDef = {}))[kd] || [], c = {}; let top = null; for (const x of hs) { c[x] = (c[x] || 0) + 1; if (!top || c[x] > c[top]) top = x; }
      if (top && hs.length >= 3 && c[top] / hs.length >= BR.trap.same && w[top] && this.burn && this.R() < trV('vary', (this.m.read + this.m.block + this.m.slip) / 3) * Math.min(1, this.burn / BR.trap.burnN)) { w[top] *= BR.trap.varyX; this.tel.varied = (this.tel.varied || 0) + 1; } } // he's been giving the same answer: a smart man changes it before it gets him hit
    const def = wpickR(this.R, Object.keys(w), x => w[x] * (x === best ? 1 + 2 * rd + k.read * .5 : 1)) || 'block';
    if (BR.trap.on.vary) { const hs = this.myDef[kd] = this.myDef[kd] || []; hs.push(def); if (hs.length > BR.trap.varyN) hs.shift(); }
    const q = clamp(lerp(BR.defQ, 1, k[DEF_SKILL[def]]) * (1 - .35 * (1 - P.me.stam / (P.me.stamMax || 100))) * (1 + .3 * rd) * (1 - .15 * E.frus) * (1 - BR.hurtQ * hurt) * (1 - BR.blur.q * this.blur), .05, 1); // hurt or beat up: the legs and the hands are slow
    this.out.defend = { kind: def, zone: PUNCHES[seenAs].zone, vs: seenAs, quality: st ? q * BR.flaw.straight.q : q };
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
    const tr = this.tr, E = this.emo, fat = 1 - P.me.stam / (P.me.stamMax || 100), nd = this.nd, ini = this.ini();
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
    const ph = this.ph || { hurt: H.hurt, gas: H.gas, guard: H.guard, el: 0 }; // what he's seen, not the truth (1f the hurt, f1b the gas and the guard)
    if (ph.gas < .35) o = Math.max(o, .4 * k.read);
    if (ph.guard < .4) o = Math.max(o, .5 * k.read);
    if (ph.el) o = Math.max(o, BR.clamp.open * ph.el * k.read); // his elbows are glued to his ribs: the head's there
    if (ph.hurt) o = Math.max(o, lerp(.5, 1, k.read)); // the hurt he's caught (a bluff can't leak through here)
    return o;
  }
  updMode(P, dt) {
    const tr = this.tr, H = this.h, hunting = HUNTS[this.mode];
    if (this.ph.hurt) H.seen = this.ct;
    this.modeT -= dt; this.tel.modeT[this.mode] = (this.tel.modeT[this.mode] || 0) + dt;
    if (H.kdUp) { H.kdUp = 0; if (hunting) this.tel.caught++; this.survStart(P); return; } // off the floor
    if (P.me.hurt && this.mode !== 'survive') {
      if (hunting || this.ct - H.end < 2) this.tel.caught++; // walked onto one going for the finish
      if (hunting) H.end = this.ct;
      this.survStart(P); return;
    }
    if (this.mode === 'survive') { this.survUpd(P); return; }
    const offFloor = this.ct - H.kdBy < BR.fin.kdWob;
    if ((this.ph.hurt || H.falseA || offFloor) && !hunting && P.me.stam / (P.me.stamMax || 100) > BR.fin.gasOut && this.ct - H.end > .5) {
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
  // the corner's calls on top of his own plan (BR.coach): rebuilt every decision; null when off
  coachUpd(P) {
    const C = BR.coach; if (!C.on) { this.cc = null; return; }
    const o = { initiative: 0, range: 0, jab: 0, power: 0, body: 0, out: 1, guard: 0 }, gas = P.me.stam / (P.me.stamMax || 100);
    const add = (m, w) => { if (!m || w <= 0) return; for (const x in m) { if (x === 'out') { const v = m.out > 1 ? 1 + (m.out - 1) * lerp(C.gasOut, 1, gas) : m.out; o.out *= 1 + (v - 1) * w; } else o[x] += m[x] * w; } };
    if (P.me.strat) add(C.plan[P.me.strat], C.corner * (1 - C.fade * P.clock / P.roundLen));
    const s = P.me.order; if (s) add(C.call[s.k], C.live * s.q * Math.min(1, s.age / C.ramp) * Math.min(1, s.left / .3));
    this.cc = o;
  }
  // how hard to work this round, for the tank (BR.gas)
  gasPace(P) {
    const G = BR.gas, kn = tierV(this.m.pacing, G.know), mx = P.me.stamMax || 100, gas = P.me.stam / mx;
    if (this.tank0 == null) this.tank0 = mx;
    let v = 1;
    const R = Math.max(2, P.rounds), line = 1 - (1 - G.end) * (P.round - 1) / (R - 1);
    v += clamp((mx / this.tank0 - line) * G.adj, -G.max, G.max) * kn; // ahead of the line: spend it; behind: save it
    if (P.round === P.rounds) v += G.last * kn;
    if (this.ph.gas < G.fadeAt && gas > this.ph.gas + .2) v += G.fade * kn * this.k.read; // he's fading: go
    if (P.round <= G.rushR) v += tierV(this.m.pacing, G.rush); // a novice comes out too hot
    return v;
  }
  pv(x) { return this.plan[x] + (this.cc ? this.cc[x] : 0) + (this.sp ? this.sp[x] || 0 : 0); } // his plan plus what the corner told him, plus what a KO loss left (L4e: it doesn't fade in the fight)
  finM() { return (this.m.read + this.m.pacing) / 2; } // finishing mastery: reading the hurt, and knowing when to spend it
  wobbly(P) { if (this.ph.hurt) this.h.seen = this.ct; return this.ph.hurt || (this.ct - (this.h.seen || -99) < BR.fin.wob * (this.tk == null ? 1 : this.tk) && P.him.head < BR.fin.wobHead) || this.ct - this.h.kdBy < BR.fin.kdWob; }
  // the hunt: check, then commit (all-out or behind a guard); flurries with a look in between; capped, and it costs gas
  huntStart(P, late) {
    const tr = this.tr, H = this.h;
    this.tel.hunts++; H.t0 = this.ct; H.n = 0; H.stung = 0; H.goal = Math.round(this.rnd(BR.fin.burst[0], BR.fin.burst[1] + tr.killer)); H.look = -9; H.chk = 0;
    const reckless = this.R() < BR.fin.reckless * tr.killer * (1 - tr.composure) + .3 * this.desp + hbV('reck', this.finM());
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
      const sold = P.him.look && P.him.look.sell > 0; // 1f: he's selling it
      if (!hurt) { if (sold && P.him.hurt) this.tel.bought = (this.tel.bought || 0) + 1; stop('he is fine'); return; }
      if (sold) this.tel.sawThru = (this.tel.sawThru || 0) + 1; // he isn't buying it: he saw the legs
      // he still throws back, or he's countered me, or I'm low: finish behind the guard
      const warn = this.t - this.lastHisT < 1 || this.ct - H.ctrd < 5, fm = this.finM(), HB = BR.hb.on;
      const safe = warn && !(HB.ignore && this.R() < hbV('ignore', fm)) || gas < F.gasSafe || !warn && HB.respect && this.R() < hbV('respect', fm); // a novice misses the signs; a vet respects a hurt man anyway
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
    const w = { clinch: tr.clinch * (.3 + k.clinch) * comp * 1.5, shell: tr.shell * (1.2 - comp * .5), run: tr.legs * (.3 + k.footwork) * comp, fire: tr.risk * (1 - comp) * 1.4, freeze: (1 - comp) * (1 - k.read) * .6 + lvV('freeze', (this.m.read + this.m.clinch) / 2),
      bait: comp > .6 ? (tr.patience - .4) * k.counter * 1.2 : 0 };
    if (this.ct - H.kdMe < 8) { w.fire += comp * tr.risk * SV.kdFire; w.shell *= lerp(SV.kdShell, 1, comp); } // off the floor: fire back harder, or cover up
    if (P.roundLen - P.clock < SV.late) { w.run *= SV.lateRun; w.clinch *= SV.lateRun; w.fire *= SV.lateFire; } // ride it to the bell
    if (this.desp) w.fire *= SV.despFire;
    this.hurtResp = wpickR(this.R, Object.keys(w), x => w[x]) || 'shell';
    this.sell = 0; this.wild = 0;
    if (BR.bluff.on && this.ct - H.kdMe >= BR.bluff.kd) { const bm = this.finM(), ch = tierV(bm, BR.bluff.p) * lerp(BR.bluff.comp[0], BR.bluff.comp[1], comp); // a vet hides it: nod, smile, fire back
      if (ch > 0 && this.R() < ch) { this.hurtResp = 'bluff'; this.sell = clamp(comp * bm, 0, 1); this.tel.bluffs = (this.tel.bluffs || 0) + 1; } }
    this.tel.hurts++; this.tel.hurtR[this.hurtResp] = (this.tel.hurtR[this.hurtResp] || 0) + 1;
    H.unans = 0; H.flip = 0; H.second = this.ct + this.rnd(SV.second[0], SV.second[1]); H.freezeEnd = this.ct + this.rnd(SV.freeze[0], SV.freeze[1]);
    this.queue = null; this.setup = null;
    if (this.ct - H.kdMe < 1 && comp < .7) this.wary = { v: SV.after, until: P.round }; // off the floor: box long the rest of the round
    this.setMode('survive', lerp(SV.hurtT[0], SV.hurtT[1], comp) * this.rnd(.8, 1.2), 'hurt: ' + this.hurtResp);
  }
  survUpd(P) {
    const tr = this.tr, comp = tr.composure, k = this.k, SV = BR.surv, H = this.h, was = this.hurtResp;
    if (was === 'freeze' && this.ct > H.freezeEnd) this.hurtResp = 'shell';
    if (H.second && this.ct > H.second && this.hurtResp === 'bluff') { H.second = 0; if (this.R() < .3 * k.read) this.hurtResp = 'steady'; } // he's selling it: keep it up, or bite down behind the jab (still selling)
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
    if (this.sell && H.unans >= SV.flipAt) { this.sell = 0; this.hurtResp = this.R() < tr.risk / (tr.risk + tr.clinch + .01) ? 'fire' : 'clinch'; this.wild = this.hurtResp === 'fire' ? 1 : 0; this.tel.bluffBroke = (this.tel.bluffBroke || 0) + 1; } // he's eating them clean: the act is over
    if (this.hurtResp !== was) this.note('hurt: ' + was + ' -> ' + this.hurtResp);
    if (this.modeT <= 0 && !P.me.hurt) { this.hurtResp = null; this.sell = 0; this.pickMode(P); }
  }

  /* ---------- the hands: when to throw, when not to, and what ---------- */
  offense(P) {
    const k = this.k, tr = this.tr, E = this.emo, m = this.mm(), H = P.him;
    const fat = 1 - P.me.stam / (P.me.stamMax || 100);
    // his eye for distance: a novice misjudges and throws from where nothing reaches
    const dSeen = P.dist + this.g() * BR.outShort * (1 - k.range) * .6 + (1 - k.range) * -6;
    if (this.queue && this.t >= this.queue.at) { const q = this.queue; this.queue = null; if (q.trap) this.payNext = { pay: 0, trap: 1 }; const ps = this.fitReach(q.ps, dSeen); const a = ps ? this.fire(ps, q.why, dSeen, q.ctr) : null; if (a && q.pivot) a.pivot = true; return a; }
    // a planned sequence in progress
    if (this.setup) { const s = this.stepSetup(P, dSeen); if (s) return s; }
    if (dSeen > 92) return null;
    if (this.t < this.h.look) return null; // between flurries: a look (is he still there?)
    if (this.t < this.wb.until) return null; // f2: the bait is out: he waits on it (a loaded counter went first, above)
    if (BR.wb.on && this.wbTry(P, dSeen)) return null;
    const open = this.opening(P);
    // a quick thinker decides more often, not more: the work rate is his nature, the timing is his skill
    let p = BR.throwP * (.5 + 1.0 * tr.output) * m.aggr * (1 + open * (1.2 + (m.ctr ? 1 : 0))) * (this.decBase || .4) / .4 * this.pace * (this.cc ? this.cc.out : 1) * (this.gp || 1) * (1 + BR.body.out * (this.bRd || 0)); // he never comes upstairs: let the hands go
    // when NOT to: he keeps getting countered, he's gassed (a smart man paces it), he's scared, the other man is loaded and waiting
    let ctr = 0, n = 0; for (const x in this.mem.mine) { const e = this.mpeek(this.mem.mine, x); ctr += e.c || 0; n += e.n || 0; }
    p *= 1 - clamp(ctr / Math.max(4, n) * 2.5, 0, .6) * k.read * (1 - tr.risk * .5);
    p *= lerp(1, clamp(1.25 - fat, .35, 1), k.pacing);
    p *= 1 - .5 * E.fear * (1 - tr.risk * .5);
    p *= 1 + .3 * E.conf + .4 * E.frus * (1 - tr.composure);
    p *= 1 + .45 * this.nd + BR.desp.out * this.desp;
    if (P.round === 1) p *= lerp(.55 + .35 * this.tr.initiative, 1, P.clock / P.roundLen); // the first round: he's still finding out what the other man has
    if (H.punch && !H.punch.feint && this.mode !== 'counter' && !(this.mode === 'survive' && this.hurtResp === 'bait')) p *= .6 + .6 * (1 - k.read) * tr.risk; // he's punching: most men cover, the reckless trade
    if (this.t < this.wbS.thru) p *= BR.wb.hold; // f2: I see the bait for what it is: I don't take it
    if (this.t < this.flT) p *= BR.flaw.fold.out; // f3: folded, the hands stop
    if (this.R() > p) { if (dSeen < 80) this.tel.holds++; return null; }
    // the bait: a counterman shows the jab and steps back, to draw the lead
    if (BR.trap.on.draw && this.t > this.dl.next && dSeen > 58 && dSeen < 82 && this.k.counter >= BR.trap.drawCtr && (this.mode === 'counter' || this.mode === 'work' || this.mode === 'feelout')
      && this.R() < trV('draw', (this.m.counter + this.m.read) / 2) * (1.3 - this.ini())) return this.dlBait(dSeen);
    // feint, a planned sequence, or a combo
    if (this.R() < BR.feintP * (.4 + k.feints * 1.5) * lvV('feint', this.m.feints) * (.5 + tr.patience) / Math.max(.3, m.aggr) * (this.mode === 'feelout' || this.mode === 'reset' ? 2 : 1)) return this.feint(dSeen);
    if (this.mode !== 'survive' && !HUNTS[this.mode] && this.R() < BR.setupP * k.read * (.5 + k.feints * .5 + k.combos * .5) * (this.mode === 'burst' ? .4 : 1)) { const s = this.startSetup(P, dSeen); if (s) return s; }
    const c = this.pickCombo(P, dSeen);
    if (!c) return null;
    if (BR.trap.on.show && !HUNTS[this.mode] && this.mode !== 'survive') { const s = this.showChange(c); if (s) return s; }
    return this.fire(c.ps, c.why, dSeen);
  }
  // he's shown this combo enough and the man answers it the same way every time: change the ending to beat that answer
  showChange(c) {
    const T = BR.trap, m = (this.m.read + this.m.combos) / 2, end = c.ps[c.ps.length - 1], b = this.baitRead(end);
    if (!b || b.n < trV('shows', m) || b.share < T.same || this.R() > trV('spring', m)) return null;
    let ans = b.ans, right = this.R() < trV('right', m);
    if (ans === 'ctr' && this.k.counter < .6) right = false; // he can't counter the counter
    let ps = right ? this.changeFor(c.ps, ans) : null;
    if (!right) { const alt = { jab: 'bodyJab', cross: 'hook', hook: 'uppercut', bodyJab: 'jab', bodyHook: 'hook', uppercut: 'hook', rhook: 'bodyHook', lupper: 'cross', bodyCross: 'hook' }; ps = c.ps.slice(); ps[ps.length - 1] = alt[ps[ps.length - 1]] || 'hook'; if (ps.length === 1) ps.unshift('jab'); ans = 'guess'; } // any change: often the wrong one
    if (!ps) return null;
    this.tel.chg++; if (right) this.tel.chgRight++;
    if (ans === 'ctr') this.ctrReady = this.t + 1.5;
    this.payNext = { pay: ans === 'ctr' ? null : ps.length - 1, base: end, ans };
    const o = this.fire(ps, 'change: ' + c.id + ' (he ' + ans + 's it)', this.dNow);
    if (o) o.look = ans === 'ctr' ? null : ps.length > c.ps.length && ans !== 'pull' ? 'end' : ps[ps.length - 1] !== end ? end : null; // it looks like the old ending, or like it's over
    return o;
  }
  pickCombo(P, dSeen) {
    const k = this.k, tr = this.tr, E = this.emo, md = this.mode, H = P.him, fat = 1 - P.me.stam / (P.me.stamMax || 100);
    const maxLen = Math.min(1 + Math.round(1 + 3 * k.combos * (.6 + .5 * tr.combo)), BR.lv.on.len ? Math.round(lvV('len', this.m.combos)) : 9);
    const last = this.hist[this.hist.length - 1], noise = lerp(.75, .3, (k.read + k.combos) / 2) * (1 + .8 * fat) * (1 + .6 * E.frus);
    const nd = this.nd, tg = this.ph && this.ph.tgt, south = !!P.me.south, hg = this.ph ? this.ph.guard : H.guard, hgas = this.ph ? this.ph.gas : H.gas, el = this.ph ? this.ph.el || 0 : 0; // f1b: the guard and the tank he sees
    let ctrN = 0, mN = 0; for (const x in this.mem.mine) { const e = this.mpeek(this.mem.mine, x); ctrN += e.c || 0; mN += e.n || 0; }
    const ctrRate = ctrN / Math.max(4, mN);
    let best = null, bw = 0, tot = 0;
    /** @type {[any, number][]} */ const ws = [];
    for (const c of COMBOS) {
      // range: the first punch has to reach (as far as he can tell)
      if (dSeen > c.max + 4 || dSeen < c.min - 12) { if (this.R() > .12 * (1 - k.range)) continue; }
      let w = 1;
      // the rest of it has to reach too: a hook from where only the jab lands is wasted (a man with a good eye for range knows it)
      for (let i = 1; i < c.n; i++) if (dSeen > PUNCHES[c.ps[i]].max + BR.reachStep) w *= lerp(.6, BR.reachLo, k.range);
      { // every combo has a working range: a hook wants to be well inside its reach (he only has to lean back from one at the end of it), a straight at the end of the arm
        const P0 = PUNCHES[c.ps[0]], ideal = P0.max - (P0.kind === 'straight' ? BR.workS : BR.workH);
        w *= lerp(1, BR.workLo + Math.exp(-Math.pow((dSeen - ideal) / BR.workW, 2)), k.range); }
      { const jt = clamp(tr.jab + this.pv('jab'), 0, 1); w *= c.jab ? lerp(.5, 4, jt) * (.5 + c.jab) : lerp(1.6, .3, jt); }
      w *= 1 + c.power * (clamp(tr.power + this.pv('power'), 0, 1) * 2 - .6);
      w *= 1 + c.body * (clamp(tr.body + this.pv('body'), 0, 1) * 2.4 - .7);
      w *= c.n === 1 ? 1.5 - tr.combo : c.n === 2 ? 1 : (.2 + tr.combo * 1.3) * (c.n > 3 ? .6 : 1);
      if (c.n > maxLen) w *= .15; // tries it anyway, badly
      // what's been working against this man (a smart man weighs it, a novice barely notices)
      let v = 0; for (const p of c.ps) v += this.punchVal(p); w *= Math.pow(v / c.n, 1.5);
      if (md === 'feelout' || md === 'reset') w *= c.n === 1 && c.jab ? 4 : c.jab ? 1 : .25;
      if (md === 'hunt') w *= (1 + c.power * 2.5 * tr.killer) * (BR.hb.on.wild ? lerp(1, hbV('wild', this.finM()), c.wide) : 1);
      else if (md === 'huntSafe') w *= (1 + c.power * 2.5 * BR.fin.safePow * tr.killer) * lerp(1, BR.fin.safeStr, c.str) * lerp(1, BR.fin.safeWide, c.wide) * (c.n > 3 ? .6 : 1);
      else if (md === 'check') w *= lerp(.4, 1.6, c.str) * (c.n <= 2 ? 1.3 : .3);
      if (HUNTS[md]) {
        if (hg > .75) w *= lerp(1, BR.fin.shellBody, c.body) * lerp(1, BR.fin.shellUpper, c.up * 2);  // he's in a shell: dig, and come up the middle
        if (H.closing < -25) w *= lerp(1, BR.fin.runHook, c.hook * 2);                                    // he's running: hooks cut him off
      }
      if (md === 'survive') { const r = this.hurtResp; w *= r === 'fire' ? (1 + c.power) * (this.wild ? 1 + BR.bluff.wild.wide * c.wide : 1) : r === 'bluff' ? BR.bluff.pick[Math.min(c.n, 3) - 1] : r === 'steady' ? (c.jab && c.n <= 2 ? 3 : .4) : c.n === 1 ? 2 : .3; }
      if (this.desp) w *= (1 + c.power * BR.desp.power * this.desp * tr.power) * (1 + c.wide * BR.desp.wide * this.desp) * (c.jab && c.n === 1 ? 1 - .5 * this.desp : 1); // the late equaliser: sit down on the right hand
      if (nd > 0) w *= 1 + c.power * nd; else w *= 1 + (c.jab - c.power) * -nd * .6; // behind: sit down on it. ahead: jab and stay safe
      if (hg < .4) w *= 1 + (c.power - c.body) * k.read;  // hands are down: go upstairs
      if (hg > .8) w *= 1 + c.body * k.read;               // shell up high: go to the body
      if (el) w *= 1 + BR.clamp.up * el * (c.power - c.body) * k.read; // f1b: the elbows are on his ribs: the body's done its work, go upstairs
      if (hgas < BR.fuse.gas && !HUNTS[md]) w *= 1 + (c.body + (c.ps.includes('bodyHook') ? BR.fuse.liver : 0)) * (BR.fuse.gas - hgas) / BR.fuse.gas * BR.fuse.w * k.read; // he's tired: the body is the slow fuse, dig to the liver
      if (tg) { // 1e: go to the damage he's spotted (a smart man more surely)
        if (tg.eye) { const on = (tg.side === 'R') !== south; w *= Math.exp(BR.tgt.eye * tg.eye * ((on ? c.lead : c.rear) - (on ? c.rear : c.lead)) * k.read); } // the eye: straights and hooks that land on that side, fewer to the other
        if (tg.body) w *= 1 + BR.tgt.body * tg.body * c.body * k.read;                                      // the body's going: dig
        if (tg.arms) w *= 1 + BR.tgt.arms * tg.arms * (c.power - .5 * c.jab) * k.read;                      // the arms are gone: sit down on it, through the guard
      }
      // the situation (a smart man sees it, a novice throws his favourites)
      let sit = 1;
      if (hg > .7 && c.lowHigh) sit *= 1.3;                          // lift then dig, or dig then lift: a high guard can't cover both
      if (c.lowHigh && this.bodyL && !BR.trap.on.bank) sit *= 1 + Math.min(.4, .08 * this.bodyL / Math.max(1, P.round)); // the body work pays upstairs later
      if (P.ropes.him > .6 && c.inside) sit *= 1.3;                        // he's on the ropes: rip inside
      if (P.round <= 3 && c.n === 1 && c.jab) sit *= 1.15;                 // early: probe with the jab
      if (ctrRate > .15) sit *= c.endLead ? 1.15 : c.endRear ? .85 : 1;    // he counters: finish on the lead hook, back in your stance
      w *= lerp(1, sit, k.read);
      if (BR.trap.on.bank) { const T = BR.trap, mb = (this.m.body + this.m.pacing) / 2;
        if (P.round <= Math.max(1, Math.round((P.rounds || 10) * T.investTo))) w *= 1 + c.body * trV('invest', mb) * (.5 + tr.body); // early: put it in the bank
        if (P.round >= T.payFrom && c.lowHigh && this.bank) w *= 1 + trV('pay', mb) * Math.min(T.payMax, T.payK * this.bank); } // later: the hands come down, go upstairs
      // variety: a smart man doesn't show the same thing over and over; a novice falls in love with one
      if (last && last === c.id) w *= lerp(1.4, .3, k.read);
      if (BR.trap.on.show) { const b = this.baitRead(c.ps[c.n - 1]); if (b && b.share >= BR.trap.same && b.n < trV('shows', (this.m.read + this.m.combos) / 2)) w *= 1 + trV('bait', (this.m.read + this.m.combos) / 2); } // building the read: show it again
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
    if (!BR.trap.on.show && this.hist.length >= 2 && this.hist[this.hist.length - 1] === this.hist[this.hist.length - 2]) opts.push(['change', 2.5]); // shown it twice: change it on the third
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
    if (S.name === 'body then head' && S.i === 2 && this.ph.guard > .5 && !S.blocked) { S.steps[2] = ['bodyHook']; } // the hands haven't dropped yet: one more downstairs
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
  tmode(n) { const mk = this.mode === 'survive' ? 's:' + this.hurtResp : this.mode; this.tel.mThr[mk] = (this.tel.mThr[mk] || 0) + n; } // throws by mode
  // technique: how well he throws it. A skill he doesn't own still gets tried, badly: telegraphed, arm punches, off balance
  fire(ps, why, dSeen, ctr) {
    const k = this.k, tr = this.tr, E = this.emo, fat = this.fat || 0;
    if (!ps || !ps.length) return null;
    const skillOf = p => PUNCHES[p].cat === 'jab' ? k.jab : PUNCHES[p].cat === 'body' ? k.body : k.power, skillM = p => this.m[PUNCHES[p].cat === 'jab' ? 'jab' : PUNCHES[p].cat === 'body' ? 'body' : 'power'];
    const tech = ps.map((p, i) => clamp(skillOf(p) * (i ? lerp(.7, 1, k.combos) : 1) * (1 - .25 * fat) * (1 - .15 * E.frus * (1 - tr.composure)) + this.g() * .06, .1, 1));
    let commit = clamp(tr.power * .5 + tr.risk * .3 + BR.desp.commit * this.desp + E.frus * .2 - (ps.length > 2 ? .2 : 0), 0, 1) + (BR.fin.commit[this.mode] || 0); // finishing: he sits down on everything (past his usual)
    if (ctr && this.mode === 'survive' && (this.hurtResp === 'fire' || this.hurtResp === 'bait')) commit = Math.min(1, commit + BR.fin.ctrCommit); // nothing to lose: he sits down on it
    if (this.wild && this.mode === 'survive' && this.hurtResp === 'fire') commit = Math.min(1, commit + BR.bluff.wild.commit); // the bluff broke: he's swinging for it
    if (this.mode === 'hunt' || this.mode === 'huntSafe') { const H = this.h; H.n += ps.length; if (H.n >= H.goal) { H.n = 0; H.goal = Math.round(this.rnd(BR.fin.burst[0], BR.fin.burst[1] + tr.killer)); H.look = this.t + this.rnd(BR.fin.look[0], BR.fin.look[1]); } } // the flurry, then a look
    const tell = clamp(clamp((1 - tech[0]) * .8 + commit * .25 * (1 - k.power), 0, 1) + lvV('tell', skillM(ps[0])), 0, 2); // loading up shows it; a novice shows it from the parking lot
    this.tel.techSum += tech[0]; this.tel.techN++;
    if (ps.length > 1) { this.rep.combo[0]++; this.rep.inC = ps.length; } else this.rep.inC = 0; this.rep.inCtr = ctr ? ps.length : 0;
    if (!this.thrownEv) { this.tel.throws++; this.tmode(ps.length); } // no word from the game: count what he decided
    if (ctr && this.fl === 'same') this.dropT = this.t + BR.flaw.same.t + .3; // f3: and the hands come down after it
    if (this.wbS.live && !ctr) { this.wbS.live = 0; this.wbS.bites++; this.tel.wbTook = (this.tel.wbTook || 0) + 1; } // f2: I went for his low hands (each one makes me warier of the next)
    const id = ps.map(p => PUNCHES[p].num).join('-');
    this.hist.push(id); if (this.hist.length > 6) this.hist.shift();
    if (BR.trap.on.show || BR.trap.on.draw) { const q = this.payNext; this.lf = { id: ps[ps.length - 1], n: ps.length, k: 0, t: this.t, pay: q ? q.pay : null, base: q ? q.base : null, trap: q && q.trap, ans: q && q.ans }; this.payNext = null; }
    this.note('throws ' + id + ' (' + why + ')');
    return { type: ps[0], combo: ps, feint: false, tech, tell, commit, counter: !!ctr, why, num: id };
  }

  /* ---------- the feet ---------- */
  move(P) {
    const k = this.k, tr = this.tr, md = this.mm(), E = this.emo, fat = this.fat, sv = this.mode === 'survive' ? this.hurtResp : null;
    let pv = 0, n = 0; for (const p of ['hook', 'rhook', 'uppercut', 'lupper', 'bodyHook']) { pv += this.punchVal(p); n++; }
    let po = 0; for (const p of ['jab', 'cross', 'bodyJab']) po += this.punchVal(p);
    const shift = clamp(pv / n - po / 3, -1, 1) * 10 * k.range * (tr.range > .7 ? .4 : 1); // what's working decides where he wants to be, inside his style
    let range = lerp(50, 76, tr.range) + md.range + this.pv('range') - shift + fat * 5 + E.fear * 10 + this.rangeJit + (this.wary && P.round <= this.wary.until ? this.wary.v : 0);
    if (BR.body.on) { if (!(this.t < this.bRdT)) { this.bRd = this.bodyRead(); this.bRdT = this.t + .5; } range += BR.body.range * this.bRd; } // he digs from close: make him reach
    if (BR.cl.on) { if (!(this.t < this.clT)) { this.clR = this.clRead(); this.clT = this.t + .5; } range += BR.cl.range * this.clR; } // he grabs when it's close: box him at the end of the jab
    if (this.t < this.dl.back) range += BR.trap.drawBack; // the step back after the bait
    if (sv === 'clinch') range = 30;
    if (sv === 'fire') range = 50;
    if (sv === 'freeze' || sv === 'bait') range = P.dist;
    let lateral = tr.circle * lerp(.4, 1, k.angles) * (md.lat || .5);
    // on the ropes: get off them (a man without ring craft stays there and covers up; hurt, the runner and the steady man push off first)
    if (P.ropes.me > .4) lateral = Math.max(lateral, P.ropes.me * lerp(BR.ropes.lo, BR.ropes.hi, k.ropes) * lerp(BR.ropes.legs[0], BR.ropes.legs[1], tr.legs) * (sv === 'shell' ? .3 : sv === 'run' || sv === 'steady' ? 1.5 : 1));
    const fold = this.t < this.flT; if (fold) lateral *= BR.flaw.fold.lat; // f3: folded, he slides off weakly
    let cut = (md.cut || (this.tr.initiative > .6 && tr.range < .5) || P.ropes.him > .4) ? lerp(.2, 1, k.cutoff) * (md.cut ? 1 : .6) : 0;
    if (HUNTS[this.mode] && P.him.closing < -25) cut = Math.min(1, cut * 1.5); // he's running: cut the ring, trap him on the ropes
    let clinch = false;
    if (P.dist < 46) {
      if (this.mode === 'survive' && this.R() < (sv === 'clinch' ? BR.surv.clinchNear + .4 * k.clinch : sv === 'steady' || sv === 'run' ? .15 * (.4 + k.clinch) : .1 * (.4 + k.clinch))) clinch = true;
      else if (fat > .55 && this.R() < .04 * tr.clinch * (.4 + k.clinch)) clinch = true;
      else if (P.ropes.me > .6 && P.dist < 40 && this.R() < .02 * tr.clinch * k.clinch) clinch = true; // smother the man who has him pinned
      else if (tr.range > .7 && P.dist < 40 && this.R() < .015 * tr.clinch) clinch = true;      // an out-boxer doesn't want it in there
    }
    // push: how hard he fights for that distance. A mover who lives outside fights for room; a pressure man fights to close it. Footwork and range skill win the tug of war
    const out = range > P.dist, push = (out ? lerp(.4, 2, tr.legs) * lerp(.6, 1.3, k.footwork) : lerp(.4, 2, this.tr.initiative * (1 - tr.range)) * lerp(.6, 1.3, k.cutoff)) * lerp(.7, 1.2, k.range) * (this.mode === 'survive' ? 1.3 : 1);
    return { range: clamp(range, 28, 90), lateral: clamp(lateral, 0, 1) * this.lat, cut, clinch, feet: lerp(.75, 1.1, k.footwork), push: fold ? push * BR.flaw.fold.push : push }; // feet: how well he moves (no crossed feet, small steps)
  }

  /* ---------- the one call: perception in, action out ---------- */
  /** @param {Perception} P @param {number} dt @returns {Action} */
  think(P, dt) {
    this.t = P.t; this.rd = P.round; this.out.punch = null; this.out.defend = null; this.dNow = P.dist; this.hisHurt = this.ph ? this.ph.hurt : !!P.him.hurt;
    if (P.events) for (const ev of P.events) this.hear(ev);
    const E = this.emo, comp = this.tr.composure;
    const sdt = dt * this.pace; // slow time: moods and intent
    E.conf *= 1 - .02 * sdt; E.frus *= 1 - (.03 + .05 * comp) * sdt; E.fear *= 1 - (.02 + .08 * comp) * sdt * (P.me.hurt ? .2 : 1);
    this.fat = 1 - P.me.stam / (P.me.stamMax || 100);
    this.ct += sdt; this.hisG = this.ph ? this.ph.guard : P.him.guard;
    if (this.bp) this.bp *= Math.exp(-sdt / BR.clamp.tau);
    { const B = BR.blur, cur = Math.max(0, 1 - P.me.head / Math.max(1, P.me.headMax) - B.at) / (1 - B.at); // only real damage counts: a jab here and there doesn't blur anything
      this.blur = clamp((cur * B.cur + (1 - (P.me.headMax || 100) / 100) * B.wear + (P.round - 1) / Math.max(1, P.rounds - 1) * B.late + this.kds * B.kd) * (1.3 - .6 * this.tr.composure), 0, 1); }
    this.famUpd(P);
    this.look(P, sdt); this.ph = this.perc(P);
    { const W = BR.wb, S = this.wbS, Lb = W.on && P.him.look ? P.him.look.bait || 0 : 0; // f2: his hands are down on purpose: do I see it?
      if (Lb && Lb !== S.id) { S.id = Lb; S.live = 1; const ch = Math.min(.9, tierV(this.m.read, W.thru) * (1 + W.wary * S.bites)); this.tel.wbRoll = (this.tel.wbRoll || 0) + 1; this.tel.wbP = (this.tel.wbP || 0) + ch; if (this.R() < ch) { S.thru = this.t + W.win; S.live = 0; this.tel.wbThru = (this.tel.wbThru || 0) + 1; this.note('sees the bait: not taking it'); } }
      if (!Lb) S.live = 0; else if (this.t < S.thru) this.ph.guard = Math.max(this.ph.guard, W.seeG);
      const D = this.wb; if (D.p && this.t >= D.until) { if (!D.bit && ++D.miss >= W.quit) { D.off = this.rd; this.note('he will not bite: no more baits this round'); } D.p = null; } }
    this.hisG = this.ph.guard; // E4: he fights on what he sees
    if (P.me.down) { this.out.intent = 'down'; this.pD = null; return this.out; } // f3: his feet start over when he's up
    this.updMode(P, sdt);
    if (this.fl) { const v = this.pD == null ? 0 : (this.pD - P.dist) / Math.max(dt, 1e-3) - P.him.closing; this.myV = this.myV * .8 + v * .2; this.pD = P.dist; } // f3: how fast his own feet bring him in
    if (this.fl === 'fold') { const F = BR.flaw.fold; this.pr = P.dist < F.near ? this.pr + dt : Math.max(0, this.pr - 2 * dt); if (this.pr > F.build) this.flT = this.t + F.hold; } // f3: crowded, he folds
    this.see(P);
    // he's rushing in head first: a counterpuncher meets him with the check hook and pivots off the line (Mayweather vs Hatton)
    const clr = this.clR || 0; // a grabber walking in to tie up: meet him on the way
    if (P.him.closing > BR.rushV * (clr ? BR.cl.rushV : 1) && P.dist < 66 && P.dist > 40 && !this.queue && !P.me.busy && !P.him.punch && this.mode !== 'survive'
      && this.R() < BR.rushP * this.k.counter * (1.3 - clamp(this.tr.initiative, 0, 1)) * (1 + BR.cl.rush * clr) * dt) {
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
      if (this.R() < .08 + (P.ropes.me > .5 ? BR.ropes.flip : 0)) this.lat *= -1;
      this.coachUpd(P); this.gp = BR.gas.on ? this.gasPace(P) : 1;
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
    this.out.guard = clamp(md.guard * lerp(.7, 1.2, this.tr.shell) * (1 - .35 * this.fat) * (this.mode === 'survive' && this.hurtResp === 'shell' ? 1.3 : 1) + (this.cc ? this.cc.guard : 0), .1, 1);
    this.out.cover = this.coverOf(P);
    this.out.bluff = this.mode === 'survive' && this.sell ? this.sell : 0; // 1f: how well he's selling 'I'm fine'
    this.out.low = BR.body.on ? clamp((this.bRd || 0) * lerp(.6, 1.2, this.k.block), 0, 1) : 0; // he's read a body digger: elbows in
    this.out.clamp = this.clampOf(P);
    this.out.post = this.postOf(P);
    this.out.bait = this.wb.p && this.t < this.wb.until ? this.wb.id : 0; // f2: the hands down on purpose
    if (this.out.bait) this.out.guard = Math.min(this.out.guard, BR.wb.guard);
    if (this.t < this.flT) this.out.guard = Math.max(this.out.guard, BR.flaw.fold.guard); // f3: folded behind the gloves
    if (this.t < this.dropT) this.out.guard = Math.min(this.out.guard, BR.flaw[this.fl].guard); // f3: the jab hand on its way back (drop), the hands down after his counter (same)
    this.out.hole = this.fl ? this.holeOf(P) : null;
    return this.out;
  }

  /* ---------- between rounds: his own read of the round, and whether he changes anything ---------- */
  rest(info) {
    info = info || {};
    if (info.eye) this.told = info.eye; // the cutman: cover that eye
    const k = this.k, tr = this.tr, E = this.emo, won = this.sc.me - this.sc.him;
    const r = won > 1 ? 1 : won < -1 ? -1 : 0;
    this.sc.rounds.push(r); this.sc.lead += r; this.sc.me = 0; this.sc.him = 0;
    E.fear *= .5; E.frus *= .3; E.conf *= .7; if (this.bank) this.bank *= BR.trap.bankFade; if (this.burn) this.burn *= BR.trap.burnFade;
    this.queue = null; this.setup = null; this.threat = null; this.lf = null; this.wb.miss = 0; this.wb.p = null; this.wb.until = -9;
    { const D = this.dl; D.hits *= .8; for (const x in D.led) D.led[x] *= .8; if (D.armed && (info.round || 0) - D.armedR >= 2) this.dlPaid(); D.win = D.back = -9; } // he forgets some; armed two rounds and never sprung: drop it
    const lost = this.sc.rounds.slice(-2).filter(x => x < 0).length;
    // the best adjust between rounds; the shared way they lose is waiting too long
    const on = BR.lv.on.adjust, TD = BR.trap.on.delay;
    let ch = lerp(Math.pow(k.adjust, 1.4) * (1 + .5 * lost), tierV(this.m.adjust, BR.lv.adjust) * (1 + .3 * lost), on) * (r < 0 ? 1 : .25);
    if (TD) { let st = 0; for (let i = this.sc.rounds.length - 1; i >= 0 && this.sc.rounds[i] < 0; i--) st++; ch *= clamp((st - trV('delay', this.m.adjust) + 1) / 2, .15, 1.2); } // the shared way they lose: waiting too long (a world-class man sees it in a round or two)
    let change = null;
    if (this.R() < ch) {
      const opts = this.adjOpts();
      const menu = TD ? [0, 5, 1, 2, 3, 4].slice(0, Math.round(trV('menu', this.m.adjust))).map(i => opts[i]) : opts; // a man with one plan has 'more of the same' and 'go to work'
      const o = wpickR(this.R, menu, x => x[1] + .05 * this.R());
      if (o && o[1] > .05) { o[2](); change = o[0]; if (this.tel.adj1 == null) this.tel.adj1 = info.round || 0; }
    }
    // plans fade back toward his nature
    if (!change) for (const x in this.plan) this.plan[x] *= .8;
    // dropped this round: a composed man comes out firing (the rally), the rest box careful and long
    if (this.h.kdR) { if (tr.composure >= .65) { this.plan.initiative = clamp(this.plan.initiative + BR.surv.rally, -.4, .4); this.plan.power = clamp(this.plan.power + .1, -.4, .4); } else this.plan.range = clamp(this.plan.range + BR.surv.after, -16, 16); }
    this.h.kdR = 0; this.despR = 0; this.mode = 'feelout';
    this.mode = 'feelout'; this.modeT = this.rnd(2, 6) * (1.3 - this.tr.initiative);
    this.note('round ' + (info.round || '?') + ' ' + (r > 0 ? 'won' : r < 0 ? 'lost' : 'even') + ' (he thinks)' + (change ? ', change: ' + change : ''));
    return { thinks: r, lead: this.sc.lead, change };
  }
  // the between-round changes he can make, each scored by what he has seen (live memory + the prior)
  adjOpts() {
    const cat = c => { let v = 0, n = 0; for (const p of PTYPES) if (PUNCHES[p].cat === c) { v += this.punchVal(p); n++; } return v / n; };
    const vals = { jab: cat('jab'), power: cat('power'), body: cat('body') };
    const bestC = Object.keys(vals).reduce((a, b) => vals[a] > vals[b] ? a : b), worstC = Object.keys(vals).reduce((a, b) => vals[a] < vals[b] ? a : b);
    let ctr = 0, n = 0; for (const x in this.mem.mine) { const e = this.mpeek(this.mem.mine, x); ctr += e.c || 0; n += e.n || 0; }
    let hurtIn = 0, hurtOut = 0; for (const p in this.mem.hurt) { const e = this.mpeek(this.mem.hurt, p); if (['jab', 'cross', 'bodyJab', 'bodyCross'].includes(p)) hurtOut += e.d; else hurtIn += e.d; }
    /** @type {Array<[string, number, () => void]>} */
    const opts = [
      ['more ' + bestC, vals[bestC] - 1, () => { this.plan[bestC] = clamp(this.plan[bestC] + .2, -.4, .4); }],
      ['less ' + worstC, BR.trap.on.bank && worstC === 'body' && this.bank > 2 ? 0 : 1 - vals[worstC], () => { this.plan[worstC] = clamp(this.plan[worstC] - .2, -.4, .4); }],
      ['stop leading, make him miss and pay', ctr / Math.max(4, n) * 3, () => { this.plan.initiative = clamp(this.plan.initiative - .25, -.4, .4); }],
      ['get inside, he is killing me at range', hurtOut > hurtIn * 1.5 ? .5 : 0, () => { this.plan.range = clamp(this.plan.range - 8, -16, 16); }],
      ['stay long, he is killing me inside', hurtIn > hurtOut * 1.5 ? .5 : 0, () => { this.plan.range = clamp(this.plan.range + 8, -16, 16); }],
      ['go to work, I am waiting too long', this.sc.lead < 0 ? .4 : 0, () => { this.plan.initiative = clamp(this.plan.initiative + .25, -.4, .4); }]
    ];
    return opts;
  }
  roundStart(round) { this.flT = this.dropT = -9; this.pD = null; this.pr = 0; this.myV = 0; // f3: a fold or a dropped hand doesn't carry over the bell
    this.mode = 'feelout'; this.modeT = (round === 1 ? this.rnd(15, 40) : this.rnd(2, 6)) * (1.3 - this.tr.initiative); }
  state() { return { mode: this.mode, hurtResp: this.hurtResp, emo: Object.assign({}, this.emo), plan: Object.assign({}, this.plan), lead: this.sc.lead }; }
}

/** @param {ReturnType<typeof makeProfile>} profile @param {BrainOpts} [opts] @returns {Brain} */
function create(profile, opts) { return new Brain(profile, opts); }

// difficulty presets (P2, docs/PLUGIN.md): a level is the skill sheet, no extra knobs. easy = Intermediate (plus one flaw a player can find, f3: BR.flaw), hard = Pro (the default game AI), expert = World class (and keeps a memory of you across fights)
const PRESETS = { easy: { tier: 'intermediate', mem: 0, flaw: 1 }, hard: { tier: 'pro', mem: 0 }, expert: { tier: 'world', mem: 1 } };
/** @param {'easy'|'hard'|'expert'} level @param {{style?: string, seed?: number, name?: string, memo?: Object, lost?: boolean, won?: boolean, flaw?: ?string}} [o]  memo: his memo() from the last fight with this player (expert only reads it); flaw: easy's hole (default his style's, BR.flaw.by; null = none) @returns {{profile: ReturnType<typeof makeProfile>, opts: BrainOpts}} */
function preset(level, o) {
  o = o || {}; const P = PRESETS[level] || PRESETS.hard;
  const profile = makeProfile({ style: o.style, tier: P.tier, seed: o.seed, name: o.name }), c = TIERS.find(t => t.key === P.tier).center;
  const off = c - SKILL_KEYS.reduce((t, k) => t + profile.skills[k], 0) / SKILL_KEYS.length; // a preset is a promise: recenter on the tier, keep his style's shape and jitter
  for (const k of SKILL_KEYS) profile.skills[k] = Math.round(clamp(profile.skills[k] + off, 5, 99));
  profile.tier = tierOf(profile.skills);
  profile.flaw = P.flaw ? (o.flaw !== undefined ? o.flaw : BR.flaw.by[profile.style]) : null; // f3: easy has one hole a player can find
  const opts = {}; if (P.mem && o.memo) opts.prior = { tbl: o.memo, lost: !!o.lost, won: !!o.won };
  return { profile, opts };
}
return { create, preset, PRESETS, makeProfile, tierOf, tierV, mulberry32, PUNCHES, COMBOS, SKILLS, SKILL_KEYS, TRAIT_KEYS, TIERS, STYLES, MODES, SURV, BR, DEF_THRU, kindOf };
});
