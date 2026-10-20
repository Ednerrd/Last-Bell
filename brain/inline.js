// Copies brain/brain.js into index.html between the brain markers (one file for published pages).
// node brain/inline.js          write it
// node brain/inline.js --check  exit 1 if index.html is out of date
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), html = path.join(root, process.env.LB || 'index.html');
const A = '/* ----- brain.js (inlined by brain/inline.js: edit brain/brain.js, not here) ----- */', B = '/* ----- end brain.js ----- */';
const src = fs.readFileSync(path.join(__dirname, 'brain.js'), 'utf8').trimEnd();
const block = A + '\nconst BoxerBrain = (() => { const module = { exports: {} };\n' + src + '\nreturn module.exports; })();\n' + B;
let s = fs.readFileSync(html, 'utf8');
const a = s.indexOf(A), b = s.indexOf(B);
let out;
if (a >= 0 && b > a) out = s.slice(0, a) + block + s.slice(b + B.length);
else { const m = '/* ===== LAST BELL : engine ===== */\n', i = s.indexOf(m); if (i < 0) throw new Error('no engine marker'); out = s.slice(0, i + m.length) + block + '\n' + s.slice(i + m.length); }
if (process.argv.includes('--check')) { if (out !== s) { console.log('index.html brain is out of date: node brain/inline.js'); process.exit(1); } console.log('brain inline ok'); }
else { fs.writeFileSync(html, out); console.log('brain inlined into', path.basename(html)); }
