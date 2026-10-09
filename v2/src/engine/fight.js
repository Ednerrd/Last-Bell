// The fight sim: fixed 60 steps a second, seeded, deterministic. Zero DOM.
// M1: two men, one ring, footwork, facing. No punches yet.
import { makeRng } from '../core/rng.js';
import { RING, clamp } from '../core/math.js';
import { makeFighter } from '../fighter/make.js';
import { MIN_D, separate, feetAt, wrap } from './space.js';
import { pickMode, planStep, pauseFor, interrupt } from '../brain/footwork.js';

export const DT = 1 / 60;
const TURN = 7; // rad/s, how fast he squares up to the other man

function makeMan(spec, corner) {
  const f = makeFighter(spec);
  const s = corner === 0 ? -1 : 1, c = (RING.half - 0.7) * s;
  const m = {
    f, corner, x: c, z: c, th: corner === 0 ? Math.PI / 4 : -3 * Math.PI / 4,
    vx: 0, vz: 0, step: null, pause: 0, mode: 'feel', modeT: 0, circle: 1, feelSec: 0,
    feet: null, steps: 0,
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
      m.step = null; m.pause = rng.range(0.2, 0.8); m.vx = m.vz = 0;
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

    for (const m of men) {
      const o = men[1 - m.corner];
      m.modeT -= DT;
      if (m.modeT <= 0 || (!m.step && interrupt(m, o, rng))) setMode(m, o);
      if (m.step) {
        const s = m.step;
        s.t += DT;
        const k = clamp(s.t / s.dur, 0, 1), e = k * k * (3 - 2 * k);
        m.x = s.from.x + (s.to.x - s.from.x) * e;
        m.z = s.from.z + (s.to.z - s.from.z) * e;
        if (k >= 1) { m.step = null; m.pause = pauseFor(m, rng); m.steps++; }
      } else if ((m.pause -= DT) <= 0) {
        const p = planStep(m, o, rng);
        if (p) m.step = { from: { x: m.x, z: m.z }, to: p.to, dur: p.dur, t: 0, first: p.first };
        else m.pause = pauseFor(m, rng);
      }
    }

    // No overlap, ever: push apart, and if they're both pinned, keep last tick's legal spots.
    const [a, b] = men;
    if (!separate(a, b)) {
      men.forEach((m, i) => { m.x = prev[i].x; m.z = prev[i].z; if (m.step) { m.step = null; m.pause = 0.1; } });
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
