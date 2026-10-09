// Quality switch: pixel ratio, shadows, fps cap, plus the camera pick. Remembered per phone (best effort).
const KEY = 'lb2.quality';
export const OPTIONS = {
  pr: ['1.5', '2', 'native'],
  shadows: ['on', 'off'],
  cap: ['60', '30'],
  cam: ['auto', 'fight', 'wide'],
};
const DEFAULTS = { pr: '2', shadows: 'on', cap: '60', cam: 'auto' };

export function loadQuality() {
  try {
    const q = JSON.parse(localStorage.getItem(KEY) || '{}');
    const out = { ...DEFAULTS };
    for (const k in OPTIONS) if (OPTIONS[k].includes(q[k])) out[k] = q[k];
    return out;
  } catch { return { ...DEFAULTS }; }
}

export function saveQuality(q) {
  try { localStorage.setItem(KEY, JSON.stringify(q)); } catch { /* private mode: fine */ }
}

export function pixelRatio(q, dpr) {
  return q.pr === 'native' ? dpr : Math.min(dpr, Number(q.pr));
}
