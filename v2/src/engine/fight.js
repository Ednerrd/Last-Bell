// The fight sim: fixed 60 steps a second, seeded, deterministic. Zero DOM.
// M1: two men, one ring, footwork, facing. M2: punches (engine/punch.js, brain/offense.js).
import { makeRng } from '../core/rng.js';
import { RING, clamp } from '../core/math.js';
import { makeFighter } from '../fighter/make.js';
import { MIN_D, separate, feetAt, wrap, clampRing, dist } from './space.js';
import { pickMode, planMove, thinkFor, interrupt, FOOT } from '../brain/footwork.js';
import { startPunch, stepPunch, resolve } from './punch.js';
import { makeOffense, wantPunch, chainReady } from '../brain/offense.js';
import { DEF, startDefense } from './defense.js';
import { chooseDefense } from '../brain/defense.js';

export const DT = 1 / 60;
const TURN = 7; // rad/s, how fast he squares up to the other man

function makeMan(spec, corner) {
  const f = makeFighter(spec);
  const s = corner === 0 ? -1 : 1, c = (RING.half - 0.7) * s;
  const m = {
    f, corner, x: c, z: c, th: corner === 0 ? Math.PI / 4 : -3 * Math.PI / 4,
    vx: 0, vz: 0, step: null, pause: 0, mode: 'feel', modeT: 0, circle: 1, feelSec: 0, walk: false,
    mv: { x: 0, z: 0 }, aim: { x: 0, z: 0 }, beat: 0, // flow movement: velocity, where it's easing to, rhythm phase
    feet: null, steps: 0, punch: null, off: makeOffense(), def: null,
  };
  m.feet = feetAt(m, m.th, f.stance);
  return m;
}

export function makeFight({ seed = 1, red = {}, blue = {}, roundSec = 180, bus = null } = {}) {
  const rng = makeRng(seed);
  const men = [makeMan({ name: 'Red', ...red }, 0), makeMan({ name: 'Blue', ...blue }, 1)];
  const F = { rng, men, round: 0, clock: 0, roundSec, ticks: 0, over: false };
  const emit = (t, d) => bus && bus.emit(t, d);

  F.startRound = function () {
    F.round++; F.clock = 0;
    men.forEach((m, i) => {
      const s = i === 0 ? -1 : 1, c = (RING.half - 0.7) * s;
      m.x = c; m.z = c; m.th = i === 0 ? Math.PI / 4 : -3 * Math.PI / 4;
      m.step = null; m.pause = rng.range(0.1, 0.4); m.vx = m.vz = 0; m.walk = false;
      m.mv = { x: 0, z: 0 }; m.aim = { x: 0, z: 0 }; m.beat = rng.range(0, 6.3);
      m.punch = null; m.off = makeOffense(); m.def = null;
      m.feelSec = F.round === 1 ? rng.range(10, 22) : rng.range(2, 8);
      m.mode = 'feel'; m.modeT = m.feelSec;
      m.feet = feetAt(m, m.th, m.f.stance);
    });
    emit('round', { n: F.round });
  };

  function setMode(m, o) {
    const prev = m.mode;
    m.mode = pickMode(m, o, rng, F.clock);
    if (m.mode !== prev) emit('mode', { corner: m.corner, mode: m.mode, t: F.clock });
  }

  F.tick = function () {
    if (F.clock >= F.roundSec) return false;
    F.ticks++; F.clock += DT;
    const prev = men.map((m) => ({ x: m.x, z: m.z }));

    // Defense moves run their clock; a pull back steps him away for real.
    for (const m of men) {
      const d = m.def;
      if (!d) continue;
      d.t += DT;
      if (d.kind === 'pull' && d.t > 0) {
        const k = Math.min(d.t / (d.dur * 0.6), 1), want = DEF.pull.back * k * k * (3 - 2 * k), dd = want - d.moved;
        m.x -= Math.cos(m.th) * dd; m.z -= Math.sin(m.th) * dd; d.moved = want;
        clampRing(m);
      }
      if (d.t >= d.dur) { m.def = null; emit('defenseEnd', { corner: m.corner }); }
    }

    // Punches: start, step in behind them, land or miss at contact, come home.
    for (const m of men) {
      const o = men[1 - m.corner];
      if ((!m.punch || chainReady(m.punch)) && !(m.def && m.def.t >= 0)) {
        const k = wantPunch(m, o, rng, DT);
        if (k) {
          const p = startPunch(m, o, k);
          emit('punch', { corner: m.corner, kind: k, combo: m.off.combo, t: F.clock });
          const dc = chooseDefense(o, m, p.P, rng);
          if (dc) {
            // He starts moving after his reaction time (t < 0 until then).
            startDefense(o, dc.kind, p.P.hand).t = -dc.delay;
            emit('defend', { corner: o.corner, kind: dc.kind, vs: k, delay: dc.delay, t: F.clock });
          }
        }
      }
      const p = m.punch;
      if (!p) continue;
      const ev = stepPunch(p, DT);
      if (p.step > 0 && p.t <= p.load + p.snap) {
        // The step in: eased over load + snap, along his facing.
        const k = Math.min(p.t / (p.load + p.snap), 1), want = p.step * k * k * (3 - 2 * k), dd = want - p.stepped;
        m.x += Math.cos(m.th) * dd; m.z += Math.sin(m.th) * dd; p.stepped = want;
        clampRing(m);
      }
      if (ev === 'contact') {
        p.res = resolve(m, o, rng);
        emit('contact', { corner: m.corner, t: F.clock, ...p.res });
      } else if (ev === 'done') m.punch = null;
    }

    for (const m of men) {
      const o = men[1 - m.corner];
      m.modeT -= DT;
      if (m.modeT <= 0 || interrupt(m, o, rng)) setMode(m, o);
      if (m.punch || (m.def && m.def.t >= 0)) {
        // Planted while he throws or defends: what he was carrying bleeds off fast.
        const k = Math.exp(-14 * DT); m.mv.x *= k; m.mv.z *= k;
      } else {
        if ((m.pause -= DT) <= 0) { m.aim = planMove(m, o, rng); m.pause = thinkFor(m, rng); }
        // Rhythm: in and out toward him, never quite still (not while walking up).
        const dna = FOOT[m.f.style];
        m.beat += DT * Math.PI * 2 * dna.hz;
        const r = m.walk ? 0 : Math.sin(m.beat) * dna.bob * (m.mode === 'back' || m.mode === 'escape' ? 0.4 : 1);
        const d = dist(m, o) || 1, ux = (o.x - m.x) / d, uz = (o.z - m.z) / d;
        // Ease into the new speed (~0.12 s): weight shifts, no snapping.
        const k = 1 - Math.exp(-8 * DT);
        m.mv.x += (m.aim.x + ux * r - m.mv.x) * k; m.mv.z += (m.aim.z + uz * r - m.mv.z) * k;
      }
      m.x += m.mv.x * DT; m.z += m.mv.z * DT;
      clampRing(m);
    }

    // No overlap, ever: push apart, and if they're both pinned, keep last tick's legal spots.
    const [a, b] = men;
    if (!separate(a, b)) {
      men.forEach((m, i) => { m.x = prev[i].x; m.z = prev[i].z; m.mv.x = m.mv.z = 0; });
    }

    for (const m of men) {
      const o = men[1 - m.corner];
      const want = Math.atan2(o.z - m.z, o.x - m.x);
      const dth = wrap(want - m.th), mx = TURN * DT;
      m.th = wrap(m.th + clamp(dth, -mx, mx));
      // Smoothed velocity, used by the man cutting the ring to lead this one.
      m.vx += ((m.x - prev[m.corner].x) / DT - m.vx) * 0.1;
      m.vz += ((m.z - prev[m.corner].z) / DT - m.vz) * 0.1;
      m.feet = footPos(m);
    }

    if (F.clock >= F.roundSec) emit('roundEnd', { n: F.round });
    return true;
  };

  // Feet: planted when he's still. In a step the first foot leads and the other follows.
  function footPos(m) {
    const s = m.step;
    if (!s) return feetAt(m, m.th, m.f.stance);
    const k = clamp(s.t / s.dur, 0, 1), e = k * k * (3 - 2 * k);
    const kf = clamp(k / 0.6, 0, 1), ks = clamp((k - 0.4) / 0.6, 0, 1);
    const sx = s.to.x - s.from.x, sz = s.to.z - s.from.z;
    const at = (kk) => feetAt({ x: m.x + sx * (kk - e), z: m.z + sz * (kk - e) }, m.th, m.f.stance);
    const A = at(kf), B = at(ks);
    return s.first === 'lead' ? { lead: A.lead, rear: B.rear } : { lead: B.lead, rear: A.rear };
  }

  F.runRound = function () { F.startRound(); while (F.tick()); };
  F.MIN_D = MIN_D;
  return F;
}
