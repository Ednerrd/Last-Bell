import { test, ok } from './t.js';
import { PUNCH, extAt, distFor, reaches, startPunch, stepPunch, resolve } from '../src/engine/punch.js';
import { makeFighter, jabRange } from '../src/fighter/make.js';
import { makeRng } from '../src/core/rng.js';

const man = (x, th, spec = {}) => ({ f: makeFighter(spec), x, z: 0, th, punch: null });

test('punch: a jab from jab range lands at ~95% extension', () => {
  const f = makeFighter();
  ok(Math.abs(extAt(f, PUNCH.jab, jabRange(f)) - 0.95) < 0.01, 'ext ' + extAt(f, PUNCH.jab, jabRange(f)));
  for (const k in PUNCH) ok(Math.abs(extAt(f, PUNCH[k], distFor(f, PUNCH[k], 0.8)) - 0.8) < 1e-9, k + ' round trip');
});

test('punch: hooks and uppers are short-range, straights long', () => {
  const f = makeFighter(), far = jabRange(f) + 0.1;
  ok(reaches(f, PUNCH.jab, far), 'jab with a step reaches');
  ok(!reaches(f, PUNCH.lhook, far) && !reaches(f, PUNCH.rupper, far), 'hook/upper do not');
  ok(reaches(f, PUNCH.lhook, 0.75) && !reaches(f, PUNCH.jab, 0.6), 'inside: hook yes, jab jammed');
});

test('punch: phases run load -> snap -> contact -> retract -> done', () => {
  const a = man(-0.5, 0), b = man(0.5, Math.PI);
  const p = startPunch(a, b, 'cross');
  const seen = [];
  let ev, n = 0;
  while ((ev = stepPunch(p, 1 / 60)) !== 'done' && n++ < 200) { if (ev) seen.push(ev); if (!seen.includes(p.phase)) seen.push(p.phase); }
  ok(seen.join() === 'load,snap,contact,retract', seen.join());
});

test('punch: too far is short, off line is wide', () => {
  const rng = makeRng(3);
  const a = man(-1.2, 0), b = man(1.2, Math.PI);
  startPunch(a, b, 'jab');
  ok(resolve(a, b, rng).how === 'short', 'short');
  const c = man(-0.48, 0.8), d = man(0.48, Math.PI);
  startPunch(c, d, 'jab');
  ok(resolve(c, d, rng).how === 'wide', 'wide');
});

test('defense: the right move beats the punch, the wrong one walks into it', async () => {
  const { defVs, startDefense } = await import('../src/engine/defense.js');
  const rng = makeRng(9);
  let slipJab = 0, slipHook = 0, late = 0;
  for (let i = 0; i < 400; i++) {
    const o = { def: null };
    startDefense(o, 'slip', 'lead').t = 0.1;
    const a = defVs(o.def, PUNCH.jab, rng), b = defVs(o.def, PUNCH.lhook, rng);
    if (a && a.how === 'slipped') slipJab++;
    if (b && b.result === 'land' && b.how === 'into it') slipHook++;
    o.def.t = -0.05;
    if (defVs(o.def, PUNCH.jab, rng).how === 'late') late++;
  }
  ok(slipJab > 280 && slipHook > 220 && late === 400, `${slipJab} ${slipHook} ${late}`);
});
