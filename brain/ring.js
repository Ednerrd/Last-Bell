/* ===== LAST BELL : dummy ring =====
   The smallest fight that can test the brain: two dummies on a line between the ropes, real punch timing, simple hit math, 10-point must.
   It knows nothing about how a boxer thinks. It builds perception (what's true), calls brain.think(), and applies what comes back.
   Stats here are the body (power, speed, chin, body, stamina, recovery, heart, legs). Skills live in the brain. */
const BB = typeof require === 'function' ? require('./brain.js') : self.BoxerBrain; // Node or the browser
const { PUNCHES, DEF_THRU, kindOf } = BB;

const RING = 146, MIN_D = 30;
// the ring's knobs: land chance, damage, gas, knockdowns
const RS = {
  dt: 1 / 30, roundLen: 180, rounds: 10,
  land: .7,           // clean-hit chance for a perfect punch with no defense in the way
  techL: .3, techD: .3, // how much the brain's technique moves land chance and damage (a novice arm punch vs a world-class one)
  guard: [.1, .36],   // passive block chance, hands low .. high
  defWin: [.02, .45], // a defense counts if it started this long before the punch lands
  dmg: .5, chin: .6, stun: 6.2, flash: .05,
  ctrK: 1.3,          // caught while punching
  ctrLand: 1.25,      // a counter fired off a defense that worked lands more (he's open, mid-punch)
  cutBack: .35,       // how much cutting the ring off slows the other man's backpedal
  smother: .75,       // straights jammed in close (inside 46)
  tight: 54,          // inside this, counters get half their bonus
  circ: .5,           // how much ground a circling man costs the man chasing him (cutting the ring off cancels it)
  gasCost: 1.05, regen: [.5, 1.1],
  getUp: .55, ref: 6,
  heal: .06          // head recovery per second in the round (times recovery / 100)
};
const STAT0 = { power: 70, speed: 70, chin: 70, body: 70, stamina: 70, recovery: 70, heart: 70, legs: 70 };

function mkBoxer(profile, side, rng, opts) {
  const s = Object.assign({}, STAT0, profile.stats || {});
  return {
    prof: profile, side, s, brain: BB.create(profile, { rng, debug: opts.debug }),
    x: side ? 70 : -70, head: 100, headMax: 100, bodyHp: 100, stam: 100, stamMax: 100,
    act: null, queue: [], qi: 0, def: null, stunT: 0, down: false, clinchT: 0, gapT: 0,
    lastPEnd: -9, lastRes: null, lastDefOk: -9, kdR: 0, kds: 0, hurtHits: [], guard: .6, out: null, events: [],
    T: { thrown: { jab: 0, power: 0, body: 0 }, landed: { jab: 0, power: 0, body: 0 }, ctrLanded: 0, feints: 0, clinches: 0, dist: 0, distN: 0,
      perRound: [], defTry: 0, defOk: 0, pTimes: [], dmg: 0, kd: 0, bites: 0 },
    R: { thrown: 0, lp: 0, lj: 0, lb: 0, dmg: 0, kd: 0 }
  };
}

class Ring {
  constructor(pa, pb, opts) {
    opts = opts || {};
    this.o = Object.assign({}, RS, opts);
    this.rng = opts.rng || (opts.seed != null ? BB.mulberry32(opts.seed) : Math.random);
    this.f = [mkBoxer(pa, 0, this.rng, opts), mkBoxer(pb, 1, this.rng, opts)];
    this.f[0].op = this.f[1]; this.f[1].op = this.f[0];
    this.t = 0; this.round = 0; this.clock = 0; this.ids = 0; this.over = null; this.cards = [[0, 0], [0, 0], [0, 0]]; this.notes = [];
  }
  R() { return this.rng(); }
  dist() { return this.f[1].x - this.f[0].x; }
  ropes(F) { const back = F.side ? RING - F.x : F.x + RING; return Math.max(0, Math.min(1, 1 - (back - 6) / 30)); }
  hurt(F) { return F.stunT > 0 || F.head < F.headMax * .3; }
  push(F, ev) { F.events.push(ev); }
  ev(A, D, type, extra) { this.push(A, Object.assign({ type, by: 'me' }, extra)); this.push(D, Object.assign({ type, by: 'him' }, extra)); }

  perceive(F) {
    const O = F.op, a = O.act;
    return {
      t: this.t, clock: this.clock, roundLen: this.o.roundLen, round: this.round, rounds: this.o.rounds,
      dist: this.dist(), ropes: { me: this.ropes(F), him: this.ropes(O) },
      me: { head: F.head, headMax: F.headMax, stam: F.stam, stamMax: F.stamMax, hurt: this.hurt(F), down: F.down, clinch: F.clinchT > 0,
        punching: !!F.act, busy: !!F.act || F.stunT > 0 || F.down || F.clinchT > 0 || F.gapT > 0 || !!(F.def && this.t - F.def.at < .4) },
      him: {
        punch: a && !a.hit && !a.done ? { id: a.id, type: a.type, t: a.t, impactIn: Math.max(0, a.impactAt - a.t), feint: a.feint, sell: a.sell, tell: a.tell } : null,
        recover: a ? null : this.t - O.lastPEnd, lastRes: O.lastRes, guard: O.guard, gas: O.stam / O.stamMax, hurt: this.hurt(O), head: O.head / 100
      },
      events: F.events
    };
  }

  startPunch(F, type, info, i) {
    const P = PUNCHES[type], fat = 1 - F.stam / F.stamMax, feint = !!info.feint;
    const tech = Array.isArray(info.tech) ? info.tech[i] : info.tech, tell = i ? (info.tell || 0) * .4 : (info.tell || 0);
    const dur = P.dur * (1.25 - F.s.speed / 200) * (1 + .3 * fat), wind = tell * .12;
    F.act = { id: ++this.ids, type, t: 0, wind, dur: feint ? wind + .22 : wind + dur, impactAt: feint ? 99 : wind + dur * .6, hit: false, feint, sell: info.sell || 0, tell, tech, commit: info.commit || 0, counter: info.counter && !i, start: this.t };
    F.stam -= P.cost * this.o.gasCost * (1.2 - F.s.stamina / 200) * (feint ? .3 : 1) * (1 + .3 * (info.commit || 0));
    if (feint) F.T.feints++;
    else { F.T.thrown[P.cat]++; F.R.thrown++; F.T.pTimes.push(this.t); }
  }

  // the punch lands (or doesn't)
  resolve(A, D) {
    const a = A.act, P = PUNCHES[a.type], d = this.dist(), kd = kindOf(a.type);
    a.hit = true;
    const out = res => { A.lastRes = res; };
    if (d > P.max + 6) { this.ev(A, D, 'missed', { p: a.type, short: true }); return out('missed'); }
    const fit = d < P.min - 8 ? .6 : (P.kind === 'straight' && d < 46 ? this.o.smother : 1);
    let thru = 1, defK = null, res = null;
    const df = D.def, dt = df ? this.t - df.at : 99;
    if (df && dt >= this.o.defWin[0] && dt < this.o.defWin[1] && !D.down && D.stunT <= 0) {
      defK = df.kind; thru = DEF_THRU[defK][kd]; if (defK === 'block' && df.zone !== P.zone) thru = .9;
      D.T.defTry++;
      if (thru < 1 && this.R() < df.quality * (1 - thru) * 1.15) { res = defK === 'block' || defK === 'roll' && thru > .25 ? 'blocked' : 'evaded'; D.T.defOk++; D.lastDefOk = this.t; }
    }
    if (!res && !defK && this.R() < (this.o.guard[0] + (this.o.guard[1] - this.o.guard[0]) * D.guard) * (P.zone === 'body' ? .75 : P.kind === 'upper' ? .6 : 1)) res = 'blocked';
    let landP = this.o.land * (1 - this.o.techL + this.o.techL * a.tech) * fit * (defK && !res ? Math.min(1.3, thru + .15) : 1);
    const tight = d < this.o.tight; // in close there's no room to set up a counter
    if (a.counter && this.t - A.lastDefOk < .8) landP *= tight ? (1 + this.o.ctrLand) / 2 : this.o.ctrLand;
    if (D.stunT > 0) landP = Math.min(.95, landP * 1.5);
    if (!res) res = this.R() < landP ? 'landed' : 'missed';
    if (res === 'missed') { this.ev(A, D, 'missed', { p: a.type, def: defK }); return out('missed'); }
    // damage
    const caught = D.act && !D.act.feint && !D.act.hit, ctr = caught || this.t - A.lastDefOk < .7 || (this.t - D.lastPEnd < .4 && D.lastRes !== 'landed');
    let dmg = P.dmg * this.o.dmg * (.55 + .9 * A.s.power / 100) * (1 - this.o.techD + this.o.techD * a.tech) * (1 + .35 * a.commit) * (caught ? (tight ? (1 + this.o.ctrK) / 2 : this.o.ctrK) : 1) * (thru > 1 ? thru : 1);
    if (res === 'blocked') { dmg *= .2; this.ev(A, D, 'blocked', { p: a.type, def: defK || 'block' }); D.stam -= dmg * .3; return out('blocked'); }
    if (res === 'evaded') { this.ev(A, D, 'evaded', { p: a.type, def: defK }); return out('evaded'); }
    A.T.landed[P.cat]++; A.lastRes = 'landed';
    if (ctr) A.T.ctrLanded++;
    if (P.cat === 'jab') A.R.lj++; else if (P.cat === 'body') A.R.lb++; else A.R.lp++;
    if (P.zone === 'body') { const bd = dmg * (1.3 - D.s.body / 100 * .6); D.bodyHp -= bd; D.stam -= bd * 1.6; D.head -= bd * .15; D.stamMax = Math.max(55, 60 + .4 * D.bodyHp); dmg = bd; }
    else { dmg *= 1.35 - D.s.chin / 100 * this.o.chin; D.head -= dmg; }
    A.R.dmg += dmg; A.T.dmg += dmg;
    // a clean power shot breaks his combo
    if (P.cat !== 'jab' && D.act && dmg > 2.5) { D.act = null; D.queue = []; }
    let stun = false;
    if (P.zone === 'head' && dmg > this.o.stun * .6 && this.R() < (dmg - this.o.stun * .6) / 10 * (1.3 - D.head / D.headMax)) { D.stunT = Math.max(D.stunT, .5 + this.R() * .8); stun = true; D.act = null; D.queue = []; D.def = null; }
    const wasHurt = this.hurt(D);
    this.ev(A, D, 'landed', { p: a.type, dmg, counter: ctr, hurt: wasHurt, def: defK });
    if (wasHurt && P.cat !== 'jab') D.hurtHits.push(this.t);
    if (D.head <= 0 || (stun && P.cat === 'power' && this.R() < this.o.flash * dmg / 4)) this.knockdown(A, D);
    else { D.hurtHits = D.hurtHits.filter(x => this.t - x < 6); if (D.hurtHits.length >= this.o.ref && this.R() < .5 - D.s.heart / 300) this.stop(A, 'TKO', 'ref stops it'); }
  }
  knockdown(A, D) {
    D.kds++; D.kdR++; A.R.kd++; A.T.kd++;
    this.ev(A, D, 'kd', {});
    if (D.kdR >= 3) return this.stop(A, 'TKO', 'three knockdowns');
    const up = this.o.getUp + D.s.heart / 100 * .35 - (D.kds - 1) * .14 + D.head / 100 * .3;
    if (this.R() > up) return this.stop(A, 'KO', 'counted out');
    D.down = true; D.downT = 6 + this.R() * 3; D.act = null; D.queue = []; D.def = null;
    D.headMax = Math.max(30, D.headMax - 12); D.head = D.headMax * (.35 + this.R() * .15);
    A.act = null; A.queue = [];
  }
  stop(A, method, why) { if (!this.over) this.over = { winner: A.side, method, round: this.round, time: this.clock, why }; }

  tick() {
    const dt = this.o.dt, [A, B] = this.f;
    // brains first: both see the same frame
    for (const F of this.f) { const P = this.perceive(F); F.out = F.brain.think(P, dt); F.events = []; F.guard = F.out.guard; }
    for (const F of this.f) {
      const o = F.out;
      if (F.down || F.stunT > 0 || F.clinchT > 0) continue;
      if (o.defend) {
        if (F.act && F.act.t / F.act.dur > .3) { /* committed */ }
        else { if (F.act) { F.act = null; F.queue = []; } F.def = { kind: o.defend.kind, zone: o.defend.zone, quality: o.defend.quality, at: this.t }; }
      }
      if (o.punch && !F.act && F.gapT <= 0 && !(F.def && this.t - F.def.at < .3)) { F.queue = o.punch.combo.slice(1); F.qinfo = o.punch; F.qi = 0; this.startPunch(F, o.punch.type, o.punch, 0); }
    }
    // clinch
    if (A.clinchT <= 0 && !A.down && !B.down && this.dist() < 46 && (A.out.move.clinch || B.out.move.clinch)) {
      const T = 1.5 + this.R() * 2; for (const F of this.f) { F.clinchT = T; F.act = null; F.queue = []; F.def = null; }
      (A.out.move.clinch ? A : B).T.clinches++;
    }
    // feet
    if (A.clinchT > 0) {
      for (const F of this.f) { F.clinchT -= dt; F.stam = Math.min(F.stamMax, F.stam + dt * 1.5); }
      if (A.clinchT <= 0) { const c = (A.x + B.x) / 2; A.x = c - 32; B.x = c + 32; } // the ref breaks them
    } else {
      const v = [0, 0];
      for (const F of this.f) {
        if (F.down || F.stunT > 0) continue;
        const m = F.out.move, sf = .6 + .4 * F.stam / F.stamMax, spd = (28 + F.s.legs * .5) * sf * (this.hurt(F) ? .8 : 1) * (m.feet || 1);
        const err = this.dist() - m.range;
        v[F.side] = Math.max(-spd, Math.min(spd, err * 3)) * (F.act ? .35 : 1);
        // circling: a man who moves off the line costs the other man ground (unless he cuts the ring off)
        const lat = Math.abs(m.lateral), O = F.op;
        if (lat > 0 && O.out && v[O.side] > 0) v[O.side] *= 1 - this.o.circ * lat * (1 - O.out.move.cut);
        // a man who cuts the ring off takes the room behind the other man away: backing up straight doesn't buy as much
        if (v[F.side] < 0 && O.out && O.out.move.cut) v[F.side] *= 1 - this.o.cutBack * O.out.move.cut;
      }
      A.x += v[0] * dt; B.x -= v[1] * dt;
      if (this.dist() < MIN_D) { const c = (A.x + B.x) / 2; A.x = c - MIN_D / 2; B.x = c + MIN_D / 2; }
      for (const F of this.f) {
        // ropes: a man pinned there circles out along them, unless the other man cuts him off
        if (F.side ? F.x > RING : F.x < -RING) { const o = F.side ? F.x - RING : F.x + RING; A.x -= o; B.x -= o; }
        const lat = Math.abs(F.out.move.lateral);
        if (this.ropes(F) > .3 && lat > 0 && !F.down && F.stunT <= 0) {
          const esc = lat * (.25 + F.s.legs / 250) * (F.out.move.feet || 1) * (1 - .75 * (F.op.out.move.cut || 0)) * 40 * dt;
          const toC = F.side ? -esc : esc; A.x += toC; B.x += toC;
        }
      }
    }
    // hands
    for (const F of this.f) {
      if (F.down) { F.downT -= dt; if (F.downT <= 0) F.down = false; continue; }
      if (F.stunT > 0) F.stunT -= dt;
      if (F.gapT > 0) F.gapT -= dt;
      const a = F.act; if (!a) continue;
      a.t += dt;
      if (!a.feint && !a.hit && a.t >= a.impactAt) { this.resolve(F, F.op); if (this.over) return; }
      if (F.act !== a) continue;
      if (a.t >= a.dur) {
        F.act = null; F.lastPEnd = this.t;
        if (a.feint) { const D = F.op, bit = !!(D.def && D.def.at >= a.start); if (bit) D.T.bites++; this.ev(F, D, 'feinted', { p: a.type, bit, def: bit ? D.def.kind : null }); F.lastRes = 'feint'; }
        if (F.queue.length && F.stunT <= 0 && !F.down) { const nx = F.queue.shift(); F.qi++; this.startPunch(F, nx, F.qinfo, F.qi); }
        else F.gapT = .12;
      }
    }
    // gas and the clock
    for (const F of this.f) {
      const reg = this.o.regen[0] + (this.o.regen[1] - this.o.regen[0]) * F.s.stamina / 100;
      F.stam = Math.max(0, Math.min(F.stamMax, F.stam + reg * dt * (F.act ? .3 : 1)));
      if (F.stunT <= 0 && !F.down) F.head = Math.min(F.headMax, F.head + this.o.heal * F.s.recovery / 100 * dt);
      if (F.def && this.t - F.def.at > .5) F.def = null;
      F.T.dist += this.dist(); F.T.distN++;
    }
    this.t += dt; this.clock += dt;
  }

  scoreRound() {
    const [A, B] = this.f, sc = F => F.R.lp + F.R.lj * .45 + F.R.lb * .75 + F.R.dmg * .05 + F.R.thrown * .02;
    const sa = sc(A), sb = sc(B);
    for (const c of this.cards) {
      const m = sa - sb + gauss(this.rng) * .8;
      let pa = 10, pb = 10; if (m > .2) pb = 9; else if (m < -.2) pa = 9;
      pa -= B.R.kd; pb -= A.R.kd; if (A.R.kd && B.R.kd === 0 && pa < 10 && pb < 10) pa = 10;
      c[0] += Math.max(7, pa); c[1] += Math.max(7, pb);
    }
    this.roundLog = this.roundLog || []; this.roundLog.push([sa, sb]);
  }

  // the rounds in steps, so a live viewer can drive them frame by frame (run() does the same in one go)
  startRound() {
    this.clock = 0;
    for (const F of this.f) { F.R = { thrown: 0, lp: 0, lj: 0, lb: 0, dmg: 0, kd: 0 }; F.kdR = 0; F.brain.roundStart(this.round); }
    this.f[0].x = -60; this.f[1].x = 60;
  }
  roundDone() { return this.clock >= this.o.roundLen || !!this.over; }
  endRound() {
    for (const F of this.f) F.T.perRound.push(F.R.thrown);
    if (this.over) return;
    this.scoreRound();
    for (const F of this.f) {
      F.note = F.brain.rest({ round: this.round });
      F.stam = Math.min(F.stamMax, F.stam + 30 + F.s.recovery * .3);
      F.head = Math.min(F.headMax, F.head + 6 + F.s.recovery * .12);
      F.act = null; F.queue = []; F.def = null; F.stunT = 0; F.clinchT = 0; F.down = false;
      if (F.note.change) this.notes.push({ round: this.round, side: F.side, change: F.note.change });
    }
  }
  finish() {
    if (!this.over) {
      const w = this.cards.map(c => c[0] > c[1] ? 0 : c[1] > c[0] ? 1 : -1), a = w.filter(x => x === 0).length, b = w.filter(x => x === 1).length;
      const winner = a > b ? 0 : b > a ? 1 : null;
      const method = winner == null ? 'D' : (a === 3 || b === 3) ? 'UD' : (a + b === 3) ? 'SD' : 'MD';
      this.over = { winner, method, round: this.o.rounds, cards: this.cards };
    }
    this.over.cards = this.cards;
    return this.over;
  }
  run() {
    for (this.round = 1; this.round <= this.o.rounds && !this.over; this.round++) {
      this.startRound();
      while (!this.roundDone()) this.tick();
      this.endRound();
      if (this.over) break;
    }
    return this.finish();
  }
}
function gauss(R) { let u = 0, v = 0; while (!u) u = R(); while (!v) v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

function fight(pa, pb, opts) { const r = new Ring(pa, pb, opts); const res = r.run(); return { res, ring: r }; }
if (typeof module === 'object' && module.exports) module.exports = { Ring, fight, RS, STAT0 };
else self.BoxerRing = { Ring, fight, RS, STAT0 };
