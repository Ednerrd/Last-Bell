// Builds proto/ring3d.html: the semi-3D test page, driven by the real fight engine from index.html.
//   node proto/build.js
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const a = src.indexOf('/* ===== LAST BELL : engine'), b = src.indexOf('/* ===== LAST BELL : render');
const tpl = fs.readFileSync(path.join(__dirname, 'ring3d.src.html'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'ring3d.html'), tpl.replace('/*@ENGINE@*/', () => src.slice(a, b)));
console.log('wrote proto/ring3d.html', (fs.statSync(path.join(__dirname, 'ring3d.html')).size / 1024).toFixed(0) + 'KB');
