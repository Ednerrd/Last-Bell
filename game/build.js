// Builds game.html: the full game (docs/GAME.md). index.html is the fight lab; the game is the same page with the lab front end
// (the section from its "LAST BELL : lab" marker to </script>) swapped for game/career.js + game/ui.js. One engine, no copies to keep in step.
//   node game/build.js          write game.html
//   node game/build.js --check  exit 1 if game.html is out of date
const fs = require('fs'), path = require('path'), root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'index.html'), 'utf8'), M = '/* ===== LAST BELL : lab', E = '</script>';
const a = src.indexOf(M), b = src.indexOf(E, a); if (a < 0 || b < 0) throw new Error('no lab section in index.html');
const game = ['career.js', 'ui.js'].map(f => fs.readFileSync(path.join(__dirname, f), 'utf8').trimEnd()).join('\n\n');
const out = (src.slice(0, a) + game + '\n' + src.slice(b)).replace(/<title>[^<]*<\/title>/, '<title>Last Bell</title>');
const file = path.join(root, 'game.html');
if (process.argv.includes('--check')) { const ok = fs.existsSync(file) && fs.readFileSync(file, 'utf8') === out; console.log(ok ? 'game.html ok' : 'game.html is out of date: node game/build.js'); process.exit(ok ? 0 : 1); }
fs.writeFileSync(file, out); console.log('wrote game.html', (out.length / 1024).toFixed(0) + 'KB');
