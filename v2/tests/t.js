// Minimal test helpers. Test files call test(); run.js runs them.
export const tests = [];
export function test(name, fn) { tests.push({ name, fn }); }
export function ok(v, msg = 'expected truthy') { if (!v) throw new Error(msg); }
export function eq(a, b, msg) {
  const A = JSON.stringify(a), B = JSON.stringify(b);
  if (A !== B) throw new Error((msg ? msg + ': ' : '') + `got ${A}, want ${B}`);
}
// FNV-1a over any JSON-able value, as 8 hex chars.
export function hash(v) {
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(8, '0');
}
