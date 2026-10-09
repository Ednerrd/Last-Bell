// Tiny event bus: engine -> render / commentary / stats.
// The engine only emits. Listeners never change a result.

export function makeBus() {
  const subs = new Map();
  return {
    on(type, fn) {
      if (!subs.has(type)) subs.set(type, []);
      subs.get(type).push(fn);
      return () => { const l = subs.get(type); const i = l.indexOf(fn); if (i >= 0) l.splice(i, 1); };
    },
    emit(type, data) {
      const l = subs.get(type);
      if (l) for (const fn of l.slice()) fn(data);
      const all = subs.get('*');
      if (all) for (const fn of all.slice()) fn(type, data);
    },
  };
}
