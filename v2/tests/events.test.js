import { test, eq } from './t.js';
import { makeBus } from '../src/core/events.js';

test('events: on/emit, wildcard, unsubscribe', () => {
  const bus = makeBus(), got = [];
  const off = bus.on('punch', (d) => got.push('p' + d.n));
  bus.on('*', (type, d) => got.push(type + ':' + d.n));
  bus.emit('punch', { n: 1 });
  off();
  bus.emit('punch', { n: 2 });
  bus.emit('ko', { n: 3 });
  eq(got, ['p1', 'punch:1', 'punch:2', 'ko:3']);
});
