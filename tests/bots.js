// One-trick "players" for the plug-in brain tests (cheese.js, flaws.js). The bot side's brain still decides WHEN (timing, gas, events stay real);
// its think() is wrapped and the bot rewrites WHAT: feet, punches, defense. bots(PU) with BoxerBrain.PUNCHES; each bot is (out, Perception, its own state, dt) -> out.
module.exports = PU => {
  const mk = (ps, x) => Object.assign({ type: ps[0], combo: ps, feint: false, counter: false, tech: .75, tell: .15, commit: .4, why: 'cheese', num: ps.join('-') }, x || {});
  const BODY = { jab: 'bodyJab', cross: 'bodyCross', hook: 'bodyHook', rhook: 'bodyHook', uppercut: 'bodyHook', lupper: 'bodyHook' };
  const free = P => !P.me.busy && !P.me.punching, R = Math.random, mv = (o, m) => Object.assign({}, o.move, { clinch: false }, m);
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
    jabMove: (o, P, s, dt) => { o.move = mv(o, { range: 76, lateral: 1, cut: 0 }); o.punch = P.dist < 80 && (o.punch || (free(P) && R() < 2 * dt)) ? mk(['jab']) : null; return o; },        // vs the slugger: jab and move
    pressure: (o, P, s, dt) => { o.move = mv(o, { range: 34, lateral: 0, cut: 1 }); o.punch = P.dist < 64 && (o.punch || (free(P) && R() < 1.4 * dt)) ? mk(P.dist < 50 ? ['hook', 'cross'] : ['jab', 'cross', 'hook']) : null; return o; }, // vs the outboxer: cut off the ring
    stepCounter: (o, P, s, dt) => { // vs the swarmer: step back and counter him on the way in
      o.move = mv(o, { range: 76, lateral: .4, cut: 0 });
      const go = P.him.closing > 15 && P.dist < 72 && free(P) && P.t - (s.ctr || -9) > .5 && R() < 6 * dt;
      o.punch = go ? mk([P.dist < 52 ? 'hook' : 'cross'], { counter: true, commit: .6 }) : o.punch && o.punch.type === 'jab' ? o.punch : null; if (go) s.ctr = P.t; return o; },
    outwork: (o, P, s, dt) => { o.move = mv(o, { range: 70, lateral: .6, cut: 0 }); o.punch = P.dist < 80 && (o.punch || (free(P) && R() < 2.2 * dt)) ? mk(R() < .65 ? ['jab'] : ['jab', 'cross']) : null; return o; }, // vs the counter-puncher: outwork him
    overJab: (o, P, s, dt) => { // vs the boxer-puncher: the right hand over his jab (the rest is his own fight)
      if (his(P, e => e.p === 'jab' && e.type !== 'thrown' && e.type !== 'pulled' && e.type !== 'feinted')) s.ctr = P.t;
      if (P.t - (s.ctr || -9) < .35 && free(P)) { o.punch = mk(['cross'], { counter: true, commit: .6 }); s.ctr = -9; } return o; }
  };
};
