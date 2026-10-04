// Builds lab.html: the fight lab (straight into a fight, random or picked fighters), from the real index.html.
//   node tools/lab.js
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
let src = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const lab = fs.readFileSync(path.join(__dirname, 'lab.src.js'), 'utf8');
const boot = '\ntitleScreen();\n';
if (src.split(boot).length !== 2) throw new Error('boot line not found once');
src = src.replace(boot, () => '\n' + lab + '\n').replace(/<title>[^<]*<\/title>/, '<title>Last Bell Fight Lab</title>');
fs.writeFileSync(path.join(root, 'lab.html'), src);
console.log('wrote lab.html', (fs.statSync(path.join(root, 'lab.html')).size / 1024).toFixed(0) + 'KB');
