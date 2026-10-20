// Builds brain/lab.html (one file, publishable): lab.src.html with brain.js and ring.js inlined. node brain/build-lab.js
const fs = require('fs'), p = f => require('path').join(__dirname, f);
const src = fs.readFileSync(p('lab.src.html'), 'utf8');
const out = src.replace('/*BRAIN*/', () => fs.readFileSync(p('brain.js'), 'utf8')).replace('/*RING*/', () => fs.readFileSync(p('ring.js'), 'utf8'));
fs.writeFileSync(p('lab.html'), out);
console.log('brain/lab.html', (out.length / 1024).toFixed(0) + ' KB');
