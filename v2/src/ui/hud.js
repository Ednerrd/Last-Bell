// DOM on top of the 3D view: perf overlay and the quality bar.
import { OPTIONS } from './quality.js';

export function makeHud(root, q, onChange) {
  const perf = document.createElement('div');
  perf.className = 'perf';
  root.appendChild(perf);

  const bar = document.createElement('div');
  bar.className = 'qbar';
  const labels = { pr: 'res', shadows: 'shadows', cap: 'fps cap', cam: 'cam' };
  for (const k in OPTIONS) {
    const b = document.createElement('button');
    const paint = () => { b.innerHTML = `<small>${labels[k]}</small>${q[k]}`; };
    paint();
    b.onclick = () => {
      const o = OPTIONS[k];
      q[k] = o[(o.indexOf(q[k]) + 1) % o.length];
      paint();
      onChange(q);
    };
    bar.appendChild(b);
  }
  root.appendChild(bar);

  const top = document.createElement('div');
  top.className = 'fightbar';
  root.appendChild(top);

  return {
    // Round clock plus each man's style, guard, stance and current footwork mode.
    fight(f) {
      const mm = Math.floor(f.clock / 60), ss = String(Math.floor(f.clock % 60)).padStart(2, '0');
      const row = (m, c) => `<div class="man ${c}"><b>${m.f.style}</b> ${m.f.guard} · ${m.f.stance}<span>${m.mode}</span></div>`;
      top.innerHTML = `<div class="clock">R${f.round} ${f.rest ? 'rest' : mm + ':' + ss}</div>${row(f.men[0], 'red')}${row(f.men[1], 'blue')}`;
    },
    // Extra button on the bar (watch speed).
    button(label, values, get, set) {
      const b = document.createElement('button');
      const paint = () => { b.innerHTML = `<small>${label}</small>${get()}`; };
      paint();
      b.onclick = () => { set(values[(values.indexOf(get()) + 1) % values.length]); paint(); };
      bar.appendChild(b);
    },
    perf(s) {
      perf.textContent =
        `${s.fps.toFixed(0)} fps  ${s.ms.toFixed(1)} ms\n` +
        `${s.calls} calls  ${(s.tris / 1000).toFixed(1)}k tris\n` +
        `${s.w}x${s.h} @${s.pr.toFixed(2)}`;
    },
  };
}

export function fatal(root, title, msg) {
  root.innerHTML = `<div class="fatal"><h1>${title}</h1><p>${msg}</p></div>`;
}
