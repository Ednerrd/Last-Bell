// DOM on top of the 3D view: perf overlay and the quality bar.
import { OPTIONS } from './quality.js';

export function makeHud(root, q, onChange) {
  const perf = document.createElement('div');
  perf.className = 'perf';
  root.appendChild(perf);

  const bar = document.createElement('div');
  bar.className = 'qbar';
  const labels = { pr: 'res', shadows: 'shadows', cap: 'fps cap' };
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

  return {
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
