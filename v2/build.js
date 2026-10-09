// Bundles v2/src into ONE file: v2/index.html (the thing Ed uploads). node v2/build.js
// A small module bundler for our own code, so there's no npm dependency.
// Supported: import { a, b as c } from './x.js' | import * as X from './x.js'
//            export function|async function|const|let|class name  |  export { a, b as c }
// Only relative imports. three.js comes in at runtime through a dynamic import().
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'src');
const mods = new Map(); // abs path -> { id, code }
const order = [];

function load(file, stack = []) {
  if (mods.has(file)) return mods.get(file).id;
  if (stack.includes(file)) throw new Error('import cycle: ' + [...stack, file].map((f) => relative(src, f)).join(' -> '));
  let code = readFileSync(file, 'utf8');
  const head = [];
  code = code.replace(/^import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"];?[ \t]*$/gm, (_, what, spec) => {
    if (!spec.startsWith('.')) throw new Error(`${relative(src, file)}: only relative imports bundle (${spec})`);
    const dep = '__m' + load(resolve(dirname(file), spec), [...stack, file]);
    what = what.trim();
    if (what.startsWith('* as ')) head.push(`const ${what.slice(5).trim()} = ${dep};`);
    else if (what.startsWith('{')) head.push(`const ${what.replace(/\s+as\s+/g, ': ')} = ${dep};`);
    else throw new Error(`${relative(src, file)}: default imports aren't supported`);
    return '';
  });
  if (/^\s*import\s+['"]/m.test(code)) throw new Error(`${relative(src, file)}: bare side-effect imports aren't supported`);
  const names = [];
  code = code.replace(/^export\s+((?:async\s+)?function\*?|const|let|class)\s+([A-Za-z_$][\w$]*)/gm, (_, kw, name) => {
    names.push(name); return `${kw} ${name}`;
  });
  code = code.replace(/^export\s*\{([^}]*)\};?[ \t]*$/gm, (_, list) => {
    for (const part of list.split(',').map((s) => s.trim()).filter(Boolean)) {
      const [a, b] = part.split(/\s+as\s+/); names.push(b ? `${b}: ${a}` : a);
    }
    return '';
  });
  if (/^export\s/m.test(code)) throw new Error(`${relative(src, file)}: unsupported export form`);
  const m = { id: mods.size, code: '' };
  mods.set(file, m);
  m.code = `// ${relative(src, file)}\nconst __m${m.id} = (() => {\n${head.join('\n')}\n${code.trim()}\nreturn { ${names.join(', ')} };\n})();`;
  order.push(m);
  return m.id;
}

load(join(src, 'main.js'));
const js = order.map((m) => m.code).join('\n\n').replace(/<\/script/gi, '<\\/script');
const css = readFileSync(join(src, 'ui/style.css'), 'utf8').trim();
const shell = readFileSync(join(src, 'ui/shell.html'), 'utf8');
const html = shell.replace('/*@CSS@*/', () => css).replace('/*@JS@*/', () =>
  `// BUILD OUTPUT of v2/build.js. Don't edit: change v2/src and rebuild.\n${js}`);

// Published-page rule: no network calls except cdnjs / jsdelivr (scripts) and Google Fonts.
for (const url of html.match(/https?:\/\/[^\s'"`)]+/g) || []) {
  if (!/^https:\/\/(cdn\.jsdelivr\.net\/npm\/|cdnjs\.cloudflare\.com\/|fonts\.(googleapis|gstatic)\.com\/)/.test(url))
    throw new Error('disallowed URL in build: ' + url);
}
writeFileSync(join(here, 'index.html'), html);
console.log(`wrote v2/index.html  ${order.length} modules  ${(html.length / 1024).toFixed(1)}KB`);
