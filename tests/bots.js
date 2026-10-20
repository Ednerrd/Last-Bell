// One-trick "players" for the plug-in brain tests (cheese.js, flaws.js). The bot side's brain still decides WHEN (timing, gas, events stay real);
// its think() is wrapped and the bot rewrites WHAT: feet, punches, defense. bots(PU) with BoxerBrain.PUNCHES; each bot is (out, Perception, its own state, dt) -> out.
module.exports = PU => {
  const mk = (ps, x) => Object.assign({ type: ps[0], combo: ps, feint: false, counter: false, tech: .75, tell: .15, commit: .4, why: 'cheese', num: ps.join('-') }, x || {});
  const BODY = { jab: 'bodyJab', cross: 'bodyCross', hook: 'bodyHook', rhook: 'bodyHook', uppercut: 'bodyHook', lupper: 'bodyHook' };
  const free = P => !P.me.busy && !P.me.punching, clear = P => free(P) && !(P.him.punch && !P.him.punch.feint), R = Math.random, mv = (o, m) => Object.assign({}, o.move, { clinch: false }, m);
  // clear: nothing of his on the way (a punch starting drops your own defense)
  const his = (P, f) => P.events.some(e => e.by === 'him' && f(e)); // something the brain did, this frame
  return {
    none: o => o,
    jabSpam: (o, P, s, dt) => { o.move = mv(o, { range: 74, lateral: 0, cut: 0 }); o.punch = P.dist < 80 && (o.punch || (free(P) && R() < 2 * dt)) ? mk(['jab']) : null; return o; },
    oneTwo: (o, P, s, dt) => { o.move = mv(o, { range: 62 }); o.punch = P.dist < 74 && (o.punch || (free(P) && R() < 1.2 * dt)) ? mk(['jab', 'cross']) : null; return o; },
    pullCounter: (o, P, s, dt) => {
      o.move = mv(o, { range: 66 });
      if (P.him.punch) { const p = PU[P.him.punch.type] || {}; o.defend = { kind: 'pull', zone: p.zone || 'head', vs: P.him.punch.type, quality: .8 }; }
      if (his(P, e => e.type === 'evaded' || e.type === 'missed')) s.ctr = P.t;
      o.punch = P.t - (s.ctr || -9) < .5 && free(P) ? mk(['cross'], { counter: true, commit: .6 }) : null; if (o.punch) s.ctr = -9; return o; },
    shell: (o, P, s, dt) => {
      o.move = mv(o, { range: 88, lateral: 0, cut: 0 }); o.guard = 1;
      if (P.him.punch) { const p = PU[P.him.punch.type] || {}; o.defend = { kind: 'block', zone: p.zone || 'head', vs: P.him.punch.type, quality: .8 }; s.quiet = P.t; }
      o.punch = P.t - (s.quiet || 0) > 1.2 && P.dist < 70 && free(P) && R() < 1.5 * dt ? mk(['hook', 'cross'], { commit: .6 }) : null; return o; },
    bodyOnly: o => { if (o.punch && !o.punch.feint) { const c = o.punch.combo.map(p => PU[p].zone === 'body' ? p : BODY[p] || 'bodyHook'); o.punch = Object.assign({}, o.punch, { type: c[0], combo: c }); } return o; },
    haymaker: (o, P, s, dt) => { o.move = mv(o, { range: 34, cut: 1 }); o.punch = (o.punch || (free(P) && R() < 1 * dt)) && P.dist < 74 ? mk([P.dist < 56 ? 'rhook' : 'cross'], { commit: .9, tell: .35 }) : null; return o; },
    runner: (o, P, s, dt) => { o.move = mv(o, { range: 88, lateral: 1, cut: 0 }); o.punch = o.punch && P.dist < 60 ? mk(['jab']) : null; return o; },
    clinch: (o, P) => { o.move = Object.assign({}, o.move, { clinch: P.dist < 50 }); return o; },
    // f3: the exploits, one per easy flaw (BR.flaw)
    // the exploits ride on his own fight (a player who knows the hole: the same man, plus the trick)
    jabMove: (o, P, s, dt) => { o.move = mv(o, { range: Math.max(o.move.range, 72), lateral: .8 }); // vs the slugger: keep him at the end of it, jab him as he comes in
      if (P.him.closing > 5 && P.dist < 80 && free(P) && R() < 3 * dt) o.punch = mk(['jab']); return o; },
    jabIn: (o, P, s, dt) => { // vs the slugger, take 2: his own fight, plus a jab every time he walks in
      if (P.him.closing > 8 && P.dist < 80 && clear(P) && R() < 4 * dt) o.punch = mk(['jab']); return o; },
    pressure: (o, P) => { o.move = mv(o, { range: 44, cut: 1 }); // vs the outboxer: cut off the ring, crowd him, dig the body when he covers up
      if (o.punch && !o.punch.feint && P.dist < 50 && P.him.guard > .7) { const c = o.punch.combo.map(p => PU[p].zone === 'body' ? p : BODY[p] || 'bodyHook'); o.punch = Object.assign({}, o.punch, { type: c[0], combo: c }); } return o; },
    stepCounter: (o, P, s, dt) => { o.move = mv(o, { range: Math.max(o.move.range, 70) }); // vs the swarmer: give ground, save the right hand for him stepping in
      if (o.punch && PU[o.punch.type].cat !== 'jab' && P.him.closing < 20) o.punch = null;
      if (P.him.closing > 20 && P.dist < 72 && free(P) && P.t - (s.ctr || -9) > .5 && R() < 6 * dt) { o.punch = mk([P.dist < 52 ? 'hook' : 'cross'], { counter: true, commit: .6 }); s.ctr = P.t; } return o; },
    jabIn2: (o, P, s, dt) => { // take 3: only when his own brain isn't punching, one jab a step in
      if (!o.punch && P.him.closing > 8 && P.dist < 80 && clear(P) && P.t - (s.j || -9) > .8 && R() < 3 * dt) { o.punch = mk(['jab']); s.j = P.t; } return o; },
    lungeCounter2: (o, P, s, dt) => { // take 3: only when his own brain isn't punching
      if (!o.punch && P.him.closing > 25 && P.dist < 72 && clear(P) && P.t - (s.ctr || -9) > .8 && R() < 6 * dt) { o.punch = mk([P.dist < 52 ? 'hook' : 'cross'], { counter: true, commit: .6 }); s.ctr = P.t; } return o; },
    crowd: (o, P) => { o.move = mv(o, { range: Math.min(o.move.range, 50) }); // vs the outboxer, take 2: his own fight, a step closer, and dig the body when he shells up
      if (o.punch && !o.punch.feint && P.dist < 54 && P.him.guard > .7) { const c = o.punch.combo.map(p => PU[p].zone === 'body' ? p : BODY[p] || 'bodyHook'); o.punch = Object.assign({}, o.punch, { type: c[0], combo: c }); } return o; },
    crowd2: (o, P) => { // vs the outboxer, take 3: his own fight; dig the body when he shells up
      if (o.punch && !o.punch.feint && P.dist < 54 && P.him.guard > .7) { const c = o.punch.combo.map(p => PU[p].zone === 'body' ? p : BODY[p] || 'bodyHook'); o.punch = Object.assign({}, o.punch, { type: c[0], combo: c }); } return o; },
    crowd3: (o, P) => { o.move = Object.assign({}, o.move, { range: Math.min(o.move.range, 60) }); // take 4: the same, never farther out than 60
      if (o.punch && !o.punch.feint && P.dist < 54 && P.him.guard > .7) { const c = o.punch.combo.map(p => PU[p].zone === 'body' ? p : BODY[p] || 'bodyHook'); o.punch = Object.assign({}, o.punch, { type: c[0], combo: c }); } return o; },
    lungeCounter: (o, P, s, dt) => { // vs the swarmer, take 2: his own fight, plus the right hand on him lunging in
      if (P.him.closing > 25 && P.dist < 72 && clear(P) && P.t - (s.ctr || -9) > .5 && R() < 6 * dt) { o.punch = mk([P.dist < 52 ? 'hook' : 'cross'], { counter: true, commit: .6 }); s.ctr = P.t; } return o; },
    slipCounter: (o, P, s, dt) => { // vs the counter-puncher: learn the punch he always counters with, slip it, come back over it
      const c = s.c || (s.c = {}); for (const e of P.events) if (e.by === 'him' && e.counter && e.p) c[e.p] = (c[e.p] || 0) + 1;
      let hab = null, n = 0; for (const x in c) if (c[x] > n) { n = c[x]; hab = x; } if (n < 2) return o; // two of the same and he's got it
      const H = P.him.punch; if (H && !H.feint && H.type === hab && H.id !== s.id) { s.id = H.id; o.defend = { kind: 'slip', zone: PU[hab].zone, vs: hab, quality: .9 }; s.go = P.t + (H.impactIn || .2) + .05; }
      if (s.go && P.t >= s.go) { if (free(P)) { o.punch = mk(['cross', 'hook'], { counter: true, commit: .6 }); s.go = 0; } else if (P.t > s.go + .4) s.go = 0; } return o; },
    overJab: (o, P, s, dt) => { // vs the boxer-puncher: the right hand over his jab (the rest is his own fight)
      if (his(P, e => e.p === 'jab' && e.type !== 'thrown' && e.type !== 'pulled' && e.type !== 'feinted')) s.ctr = P.t;
      if (P.t - (s.ctr || -9) < .35 && free(P)) { o.punch = mk(['cross'], { counter: true, commit: .6 }); s.ctr = -9; } return o; }
  };
};
