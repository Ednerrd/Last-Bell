// No-dependency test runner: node v2/tests/run.js
// Runs every *.test.js in this folder, then the determinism hash check.
// HASH=update rewrites tests/HASH after an intended change.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tests } from './t.js';
import { determinism } from './determinism.js';

const dir = dirname(fileURLToPath(import.meta.url));
const only = process.argv[2];
for (const f of readdirSync(dir).filter((f) => f.endsWith('.test.js')).sort()) {
  if (!only || f.includes(only)) await import(pathToFileURL(join(dir, f)).href);
}

let fail = 0;
for (const t of tests) {
  try { await t.fn(); console.log('  ok   ' + t.name); }
  catch (e) { fail++; console.log('  FAIL ' + t.name + '\n       ' + e.message); }
}

const file = join(dir, 'HASH');
const h = determinism();
const want = existsSync(file) ? readFileSync(file, 'utf8').trim() : null;
if (process.env.HASH === 'update' || !want) {
  writeFileSync(file, h + '\n');
  console.log(`  hash ${h} (written)`);
} else if (h !== want) {
  fail++;
  console.log(`  FAIL determinism hash ${h}, want ${want} (HASH=update if intended)`);
} else console.log(`  ok   determinism hash ${h}`);

console.log(fail ? `\n${fail} failed` : `\nall ${tests.length + 1} passed`);
process.exit(fail ? 1 : 0);
