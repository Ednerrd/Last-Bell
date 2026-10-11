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
// the combo book, in trainers' numbers
const BOOK = ['1', '1-1', '1-2', '1-1-2', '1-2-3', '1-2-3-2', '1-2-3b', '1-1-1', '2', '3', '2-3', '3-2', '1-2b', '1b-2', '3b', '3b-3',
  '2-3-2', '1-6-3', '5-2', '3-6', '6-3', '2b-3', '3b-2', '1-2-5-2', '1-3b-6', '4', '2-3b', '1-2-1', '3-3b', '1b', '2b', '2-4', '3-4-3b'];
const COMBOS = BOOK.map(s => {
  const ps = s.split('-').map(n => NUM[n]), n = ps.length, cnt = c => ps.filter(p => PUNCHES[p].cat === c).length / n;
  return { id: s, ps, n, jab: cnt('jab'), power: cnt('power'), body: cnt('body'), min: PUNCHES[ps[0]].min, max: PUNCHES[ps[0]].max };
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
  swarmer:      { label: 'Swarmer',         t: { output: .9, jab: .35, power: .55, body: .7, combo: .85, initiative: .9, patience: .15, shell: .72, slip: .65, legs: .2, clinch: .3, composure: .7, risk: .7, killer: .7, range: .08, circle: .35 },
                  sk: { combos: 10, body: 10, cutoff: 10, pacing: 4, range: -4, footwork: -4, jab: -4 } },
  counter:      { label: 'Counter-puncher', t: { output: .35, jab: .5, power: .55, body: .3, combo: .4, initiative: .15, patience: .9, shell: .45, slip: .8, legs: .55, clinch: .4, composure: .8, risk: .35, killer: .5, range: .65, circle: .55 },
                  sk: { counter: 14, read: 8, slip: 8, block: 2, combos: -6, cutoff: -8, body: -4 } },
  boxerpuncher: { label: 'Boxer-puncher',   t: { output: .6, jab: .6, power: .6, body: .45, combo: .55, initiative: .6, patience: .55, shell: .5, slip: .5, legs: .5, clinch: .4, composure: .65, risk: .5, killer: .7, range: .55, circle: .5 },
                  sk: { power: 4, jab: 4, combos: 3, adjust: 4 } }
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
  stealT: 30              // the last 30 s, where rounds get stolen
};
// intent modes: each lasts seconds, not one roll. aggr: how often he lets go. range: offset from his range. guard: how high the hands sit
const MODES = {
  feelout: { aggr: .35, range: 6, guard: .6, lat: .7 },
  work:    { aggr: 1, range: 0, guard: .6, lat: .6 },
  press:   { aggr: 1.25, range: -10, guard: .65, lat: .2, cut: 1 },
  burst:   { aggr: 4.2, range: -9, guard: .4, lat: .2 },
  reset:   { aggr: .12, range: 16, guard: .7, lat: 1 },
  counter: { aggr: .35, range: 2, guard: .75, lat: .5, ctr: 2 },
  hunt:    { aggr: 3, range: -14, guard: .45, lat: .1, cut: 1 },
  survive: { aggr: .25, range: 20, guard: 1, lat: .9 }
};
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
// the counter that fits the defense: slip the straight, right hand over it; duck the hook, come up with one; pull back, step in behind a straight
const COUNTER_FOR = {
  slip: [['cross'], ['cross', 'hook'], ['hook', 'cross']],
  duck: [['hook'], ['uppercut', 'hook'], ['rhook']],
  pull: [['cross'], ['jab', 'cross']],
  block: [['hook'], ['cross'], ['uppercut']],
  roll: [['cross'], ['cross', 'hook']]
};
const DEF_SKILL = { block: 'block', slip: 'slip', duck: 'slip', pull: 'footwork', roll: 'block' };

class Brain {
  constructor(profile, opts) {
    opts = opts || {};
    this.p = profile; this.R = opts.rng || Math.random; this.debug = !!opts.debug;
    // spread squeezes his overall level (how far apart the tiers play) but keeps his own strengths full size: a counter-puncher's counter stays his edge
    const raw = s => (profile.skills[s] == null ? 50 : profile.skills[s]) / 100, avg = SKILL_KEYS.reduce((t, s) => t + raw(s), 0) / SKILL_KEYS.length, lvl = .5 + (avg - .5) * BR.spread;
    this.k = {}; for (const s of SKILL_KEYS) this.k[s] = clamp(lvl + (raw(s) - avg) * BR.spreadOwn, 0, 1);
    this.tr = Object.assign({}, STYLES.boxerpuncher.t, profile.traits);
    const k = this.k;
    this.iq = (k.read + k.counter + k.pacing + k.adjust) / 4;
    this.t = 0; this.mode = 'feelout'; this.modeT = 0; this.decT = .3; this.hurtResp = null;
    this.mem = { mine: {}, his: {}, lead: {}, after: {}, def: {}, hurt: {}, feints: 0 };
    this.emo = { conf: 0, frus: 0, fear: 0 };
    this.plan = { jab: 0, power: 0, body: 0, range: 0, initiative: 0 }; // between-round changes
    this.queue = null; this.setup = null; this.hist = [];
    this.threat = null; this.lastHisP = null; this.lastHisT = -9; this.lastMine = null; this.lastDef = null;
    this.rangeJit = 0; this.nd = 0; this.fat = 0; this.lat = (this.R() < .5 ? 1 : -1);
    this.sc = { me: 0, him: 0, lead: 0, rounds: [] }; // his own guess at the cards
    this.tel = { decisions: 0, holds: 0, throws: 0, feints: 0, setups: 0, counters: 0, seen: 0, late: 0, noTry: 0, misreads: 0, bites: 0, feintsRead: 0, antic: 0, reactSum: 0, reactN: 0, modeT: {}, techSum: 0, techN: 0 };
    this.log = [];
    this.out = { intent: 'feelout', move: { range: 64, lateral: 0, cut: 0, clinch: false }, guard: .6, punch: null, defend: null, why: '' };
  }
  rnd(a, b) { return a + this.R() * (b - a); }
  g() { return gaussR(this.R); }
  note(s) { if (this.debug) this.log.push(this.t.toFixed(1) + ' ' + s); }

  /* ---------- memory: what he has seen of the other man. Everything fades; read skill sets how much he notices and how long it sticks ---------- */
  tau() { return lerp(BR.memTau[0], BR.memTau[1], this.k.read); }
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
      if (ev.by === 'me') { this.sc.me += 3; E.conf = clamp(E.conf + .3, -1, 1); }
      else { this.sc.him += 3; E.fear = clamp(E.fear + .4 * (1.25 - comp), 0, 1); E.conf = clamp(E.conf - .3, -1, 1); }
      return;
    }
    if (!PUNCHES[ev.p]) return;
    if (ev.by === 'me') {
      const p = ev.p, kd = kindOf(p);
      if (ev.type === 'feinted') { if (ev.bit) this.madd(this.mem.def, 'feint', { n: 1, bit: 1 }); else this.madd(this.mem.def, 'feint', { n: 1 }); if (ev.bit && this.setup && this.setup.onBite) this.setup.bit = ev.def || 'block'; return; }
      this.madd(this.mem.mine, p, { n: 1, l: ev.type === 'landed' ? 1 : 0, b: ev.type === 'blocked' ? 1 : 0, e: ev.type === 'evaded' ? 1 : 0 });
      if (ev.def) this.madd(this.mem.def, kd, { n: 1, [ev.def]: 1 }); else if (ev.type === 'landed') this.madd(this.mem.def, kd, { n: 1, none: 1 });
      this.lastMine = { p, t: this.t };
      if (ev.type === 'landed') { E.conf = clamp(E.conf + .05 * (ev.dmg || 2) / 3, -1, 1); E.frus = Math.max(0, E.frus - .04); this.sc.me += guess(pts(p)); if (ev.hurt) this.oppHurtT = this.t; }
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
        if (ev.counter && this.lastMine && this.t - this.lastMine.t < 1.5) { this.madd(this.mem.mine, this.lastMine.p, { c: 1 }); E.frus = clamp(E.frus + .04 * (1 - comp * .5), 0, 1); }
      }
      if (ev.type === 'evaded' || ev.type === 'blocked') { if (ev.def) this.lastDef = { def: ev.def, p, t: this.t }; this.tryCounter(ev.def, p); }
    }
  }
  // a defense worked: does he make him pay?
  tryCounter(def, p) {
    const k = this.k, m = MODES[this.mode];
    let ch = lerp(BR.ctrP[0], BR.ctrP[1], k.counter) * (1.4 - 1.1 * clamp(this.tr.initiative + this.plan.initiative, 0, 1)) * (m.ctr || 1) * (1 - .5 * this.emo.fear);
    if (this.threat && this.threat.rd > .3) ch *= 1.3; // he called it: the counter is already loaded
    if (this.mode === 'survive') ch *= this.hurtResp === 'fire' ? 1.5 : .3;
    if (this.R() > ch) return;
    let c;
    if (this.R() < .25 + .7 * k.counter) { const opts = COUNTER_FOR[def] || COUNTER_FOR.block; c = opts[Math.floor(this.R() * opts.length)].slice(); if (c.length > 1 && this.R() > .3 + .6 * k.combos) c = c.slice(0, 1); }
    else c = [PTYPES[Math.floor(this.R() * PTYPES.length)]]; // he knows he should fire back, not with what
    this.queue = { ps: c, why: 'counter after ' + def, ctr: 1, at: this.t + lerp(.18, .02, k.counter) };
    this.tel.counters++;
  }

  /* ---------- the eyes: a punch is coming ---------- */
  see(P) {
    const H = P.him.punch, k = this.k, E = this.emo;
    if (!H) { this.threat = null; return; }
    if (!this.threat || this.threat.id !== H.id) {
      // a new punch: when will he see it?
      const fat = 1 - P.me.stam / (P.me.stamMax || 100), hurt = P.me.hurt ? 1 : 0;
      let d = lerp(BR.react[0], BR.react[1], k.read * .5 + (k.slip + k.block) * .25);
      d *= (1 + BR.reactFat * fat) * (1 + BR.reactFear * E.fear) * (1 + BR.reactHurt * hurt) * Math.exp(this.g() * BR.jitter);
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
    const T = this.threat;
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
    if (this.mode === 'survive' && this.hurtResp === 'freeze') tryP *= .4;
    if (P.me.punching) tryP *= .3 + .45 * this.tr.slip; // a head-mover still moves his head mid-combo
    if (this.R() > tryP) { this.tel.noTry++; return; }
    // what does he think it is?
    let seenAs = T.type;
    const exp = this.expected();
    if (exp && exp !== T.type && this.R() < this.predict(exp) * .6) seenAs = exp; // he was sure it was the other one
    else if (this.R() < BR.misread * (1 - k.read) * (1 + .5 * (1 - P.me.stam / (P.me.stamMax || 100))) * (1 - T.rd)) seenAs = PTYPES[Math.floor(this.R() * PTYPES.length)];
    if (seenAs !== T.type) this.tel.misreads++;
    const kd = kindOf(seenAs), tr = this.tr, best = DEF_BEST[kd], rd = seenAs === T.type ? T.rd : 0;
    const w = {
      block: (tr.shell * 1.3 + .2) * (.4 + k.block),
      slip: kd === 'straight' ? (tr.slip * 1.3 + .1) * (.3 + k.slip) : kd === 'upper' ? .1 : 0,
      duck: kd === 'hook' ? (tr.slip * 1.2 + .1) * (.3 + k.slip) : kd === 'straight' ? tr.slip * .3 : 0,
      pull: (tr.legs * 1.1 + .1) * (.3 + k.footwork),
      roll: kd === 'body' ? 0 : tr.shell * tr.slip * .8 * (.3 + k.block)
    };
    if (this.mode === 'survive' && this.hurtResp === 'shell') w.block *= 3;
    if (this.mode === 'survive' && this.hurtResp === 'run') w.pull *= 3;
    const def = wpickR(this.R, Object.keys(w), x => w[x] * (x === best ? 1 + 2 * rd + k.read * .5 : 1)) || 'block';
    const q = clamp(lerp(BR.defQ, 1, k[DEF_SKILL[def]]) * (1 - .35 * (1 - P.me.stam / (P.me.stamMax || 100))) * (1 + .3 * rd) * (1 - .15 * E.frus), .05, 1);
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
    const tr = this.tr, comp = tr.composure;
    this.modeT -= dt; this.tel.modeT[this.mode] = (this.tel.modeT[this.mode] || 0) + dt;
    if (P.me.hurt && this.mode !== 'survive') {
      // hurt changes the mind: composure decides what he does with it
      const w = { clinch: tr.clinch * (.3 + this.k.clinch) * comp * 1.5, shell: tr.shell * (1.2 - comp * .5), run: tr.legs * (.3 + this.k.footwork) * comp, fire: tr.risk * (1 - comp) * 1.4, freeze: (1 - comp) * (1 - this.k.read) * .6 };
      this.hurtResp = wpickR(this.R, Object.keys(w), x => w[x]) || 'shell';
      this.setMode('survive', this.rnd(2.5, 5), 'hurt: ' + this.hurtResp);
      return;
    }
    if (this.mode === 'survive') { if (!P.me.hurt && this.modeT <= 0) { this.hurtResp = null; this.pickMode(P); } return; }
    if (P.him.hurt && this.mode !== 'hunt') {
      // he smells it. A killer goes; a careful man checks the other man can still punch
      const go = tr.killer * lerp(.5, 1, this.k.read) * (1 - .4 * this.emo.fear);
      if (this.R() < go * dt * 4) { this.setMode('hunt', this.rnd(4, 8), 'he is hurt'); return; }
    }
    if (this.mode === 'hunt' && !P.him.hurt && this.modeT > 1.5) this.modeT = Math.min(this.modeT, this.rnd(.5, 1.5)); // he got away
    if (this.mode === 'feelout' && this.modeT <= 0) { this.pickMode(P); return; }
    if (this.modeT <= 0) this.pickMode(P);
  }

  /* ---------- the hands: when to throw, when not to, and what ---------- */
  offense(P) {
    const k = this.k, tr = this.tr, E = this.emo, m = MODES[this.mode], H = P.him;
    const fat = 1 - P.me.stam / (P.me.stamMax || 100);
    // his eye for distance: a novice misjudges and throws from where nothing reaches
    const dSeen = P.dist + this.g() * BR.outShort * (1 - k.range) * .6 + (1 - k.range) * -6;
    if (this.queue && this.t >= this.queue.at) { const q = this.queue; this.queue = null; return this.fire(q.ps, q.why, dSeen, q.ctr); }
    // a planned sequence in progress
    if (this.setup) { const s = this.stepSetup(P, dSeen); if (s) return s; }
    if (dSeen > 92) return null;
    const open = this.opening(P);
    // a quick thinker decides more often, not more: the work rate is his nature, the timing is his skill
    let p = BR.throwP * (.5 + 1.0 * tr.output) * m.aggr * (1 + open * (1.2 + (m.ctr ? 1 : 0))) * (this.decBase || .4) / .4;
    // when NOT to: he keeps getting countered, he's gassed (a smart man paces it), he's scared, the other man is loaded and waiting
    let ctr = 0, n = 0; for (const x in this.mem.mine) { const e = this.mpeek(this.mem.mine, x); ctr += e.c || 0; n += e.n || 0; }
    p *= 1 - clamp(ctr / Math.max(4, n) * 2.5, 0, .6) * k.read * (1 - tr.risk * .5);
    p *= lerp(1, clamp(1.25 - fat, .35, 1), k.pacing);
    p *= 1 - .5 * E.fear * (1 - tr.risk * .5);
    p *= 1 + .3 * E.conf + .4 * E.frus * (1 - tr.composure);
    p *= 1 + .45 * this.nd;
    if (P.round === 1) p *= lerp(.55 + .35 * tr.initiative, 1, P.clock / P.roundLen); // the first round: he's still finding out what the other man has
    if (H.punch && !H.punch.feint && (this.mode !== 'counter')) p *= .6 + .6 * (1 - k.read) * tr.risk; // he's punching: most men cover, the reckless trade
    if (this.R() > p) { if (dSeen < 80) this.tel.holds++; return null; }
    // feint, a planned sequence, or a combo
    if (this.R() < BR.feintP * (.4 + k.feints * 1.5) * (.5 + tr.patience) / Math.max(.3, m.aggr) * (this.mode === 'feelout' || this.mode === 'reset' ? 2 : 1)) return this.feint(dSeen);
    if (this.mode !== 'survive' && this.mode !== 'hunt' && this.R() < BR.setupP * k.read * (.5 + k.feints * .5 + k.combos * .5) * (this.mode === 'burst' ? .4 : 1)) { const s = this.startSetup(P, dSeen); if (s) return s; }
    const c = this.pickCombo(P, dSeen);
    if (!c) return null;
    return this.fire(c.ps, c.why, dSeen);
  }
  pickCombo(P, dSeen) {
    const k = this.k, tr = this.tr, E = this.emo, md = this.mode, H = P.him, fat = 1 - P.me.stam / (P.me.stamMax || 100), pl = this.plan;
    const maxLen = 1 + Math.round(1 + 3 * k.combos * (.6 + .5 * tr.combo));
    const last = this.hist[this.hist.length - 1], noise = lerp(.75, .3, (k.read + k.combos) / 2) * (1 + .8 * fat) * (1 + .6 * E.frus);
    const nd = this.nd;
    let best = null, bw = 0, tot = 0; const ws = [];
    for (const c of COMBOS) {
      // range: the first punch has to reach (as far as he can tell)
      if (dSeen > c.max + 4 || dSeen < c.min - 12) { if (this.R() > .12 * (1 - k.range)) continue; }
      let w = 1;
      { const jt = clamp(tr.jab + pl.jab, 0, 1); w *= c.jab ? lerp(.5, 4, jt) * (.5 + c.jab) : lerp(1.6, .3, jt); }
      w *= 1 + c.power * (clamp(tr.power + pl.power, 0, 1) * 2 - .6);
      w *= 1 + c.body * (clamp(tr.body + pl.body, 0, 1) * 2.4 - .7);
      w *= c.n === 1 ? 1.5 - tr.combo : c.n === 2 ? 1 : (.2 + tr.combo * 1.3) * (c.n > 3 ? .6 : 1);
      if (c.n > maxLen) w *= .15; // tries it anyway, badly
      // what's been working against this man (a smart man weighs it, a novice barely notices)
      let v = 0; for (const p of c.ps) v += this.punchVal(p); w *= Math.pow(v / c.n, 1.5);
      if (md === 'feelout' || md === 'reset') w *= c.n === 1 && c.jab ? 4 : c.jab ? 1 : .25;
      if (md === 'hunt') w *= 1 + c.power * 2.5 * tr.killer;
      if (md === 'survive') w *= c.n === 1 ? 2 : .3;
      if (nd > 0) w *= 1 + c.power * nd; else w *= 1 + (c.jab - c.power) * -nd * .6; // behind: sit down on it. ahead: jab and stay safe
      if (H.guard < .4) w *= 1 + (c.power - c.body) * k.read;  // hands are down: go upstairs
      if (H.guard > .8) w *= 1 + c.body * k.read;               // shell up high: go to the body
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
    return this.fire(st.slice(), 'setup: ' + S.name, dSeen);
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
    const commit = clamp(tr.power * .5 + tr.risk * .3 + (this.mode === 'hunt' ? .3 : 0) + E.frus * .2 - (ps.length > 2 ? .2 : 0), 0, 1);
    const tell = clamp((1 - tech[0]) * .8 + commit * .25 * (1 - k.power), 0, 1); // loading up shows it
    this.tel.throws++; this.tel.techSum += tech[0]; this.tel.techN++;
    const id = ps.map(p => PUNCHES[p].num).join('-');
    this.hist.push(id); if (this.hist.length > 6) this.hist.shift();
    this.note('throws ' + id + ' (' + why + ')');
    return { type: ps[0], combo: ps, feint: false, tech, tell, commit, counter: !!ctr, why, num: id };
  }

  /* ---------- the feet ---------- */
  move(P) {
    const k = this.k, tr = this.tr, md = MODES[this.mode], E = this.emo, fat = this.fat;
    let pv = 0, n = 0; for (const p of ['hook', 'rhook', 'uppercut', 'lupper', 'bodyHook']) { pv += this.punchVal(p); n++; }
    let po = 0; for (const p of ['jab', 'cross', 'bodyJab']) po += this.punchVal(p);
    const shift = clamp(pv / n - po / 3, -1, 1) * 10 * k.range * (tr.range > .7 ? .4 : 1); // what's working decides where he wants to be, inside his style
    let range = lerp(50, 76, tr.range) + md.range + this.plan.range - shift + fat * 5 + E.fear * 10 + this.rangeJit;
    if (this.mode === 'survive' && this.hurtResp === 'clinch') range = 30;
    if (this.mode === 'survive' && this.hurtResp === 'fire') range = 50;
    if (this.mode === 'survive' && this.hurtResp === 'freeze') range = P.dist;
    let lateral = tr.circle * lerp(.4, 1, k.angles) * (md.lat || .5);
    // on the ropes: get off them (a man without ring craft stays there and covers up)
    if (P.ropes.me > .4) lateral = Math.max(lateral, P.ropes.me * lerp(.15, 1, k.ropes) * (this.mode === 'survive' && this.hurtResp === 'shell' ? .3 : 1));
    const cut = (md.cut || (tr.initiative > .6 && tr.range < .5) || P.ropes.him > .4) ? lerp(.2, 1, k.cutoff) * (md.cut ? 1 : .6) : 0;
    let clinch = false;
    if (P.dist < 46) {
      if (this.mode === 'survive' && this.R() < (this.hurtResp === 'clinch' ? .5 : .1) * (.4 + k.clinch)) clinch = true;
      else if (fat > .55 && this.R() < .04 * tr.clinch * (.4 + k.clinch)) clinch = true;
      else if (P.ropes.me > .6 && P.dist < 40 && this.R() < .02 * tr.clinch * k.clinch) clinch = true; // smother the man who has him pinned
      else if (tr.range > .7 && P.dist < 40 && this.R() < .015 * tr.clinch) clinch = true;      // an out-boxer doesn't want it in there
    }
    return { range: clamp(range, 28, 90), lateral: clamp(lateral, 0, 1) * this.lat, cut, clinch, feet: lerp(.75, 1.1, k.footwork) }; // feet: how well he moves (no crossed feet, small steps)
  }

  /* ---------- the one call: perception in, action out ---------- */
  think(P, dt) {
    this.t = P.t; this.out.punch = null; this.out.defend = null;
    if (P.events) for (const ev of P.events) this.hear(ev);
    const E = this.emo, comp = this.tr.composure;
    E.conf *= 1 - .02 * dt; E.frus *= 1 - (.03 + .05 * comp) * dt; E.fear *= 1 - (.02 + .08 * comp) * dt * (P.me.hurt ? .2 : 1);
    this.fat = 1 - P.me.stam / (P.me.stamMax || 100);
    if (P.me.down) { this.out.intent = 'down'; return this.out; }
    this.updMode(P, dt);
    this.see(P);
    this.decT -= dt;
    if (this.decT <= 0) {
      this.tel.decisions++;
      this.nd = this.need(P);
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
    const md = MODES[this.mode];
    this.out.intent = this.mode;
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
    this.mode = 'feelout'; this.modeT = this.rnd(2, 6) * (1.3 - tr.initiative);
    this.note('round ' + (info.round || '?') + ' ' + (r > 0 ? 'won' : r < 0 ? 'lost' : 'even') + ' (he thinks)' + (change ? ', change: ' + change : ''));
    return { thinks: r, lead: this.sc.lead, change };
  }
  roundStart(round) { this.mode = 'feelout'; this.modeT = (round === 1 ? this.rnd(15, 40) : this.rnd(2, 6)) * (1.3 - this.tr.initiative); }
  state() { return { mode: this.mode, hurtResp: this.hurtResp, emo: Object.assign({}, this.emo), plan: Object.assign({}, this.plan), lead: this.sc.lead }; }
}

function create(profile, opts) { return new Brain(profile, opts); }
return { create, makeProfile, tierOf, mulberry32, PUNCHES, COMBOS, SKILLS, SKILL_KEYS, TRAIT_KEYS, TIERS, STYLES, MODES, BR, DEF_THRU, kindOf };
});
