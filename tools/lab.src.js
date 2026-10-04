/* ===== LAST BELL : fight lab (built by tools/lab.js; replaces the title screen) ===== */
// Straight into a fight: random or picked fighters, no menus, no saves. Uses the real engine, render, corner and commentary.
const LAB = { div: 'r', a: 'r', b: 'r', ga: 'auto', gb: 'auto', rounds: 6, last: null, open: false };
save = { player: { record: { w: 0, l: 0, d: 0 }, gym: 0 } }; cur = 0; // no slot screens, no saves
const LAB_STYLE_KEYS = Object.keys(STYLES);
function labPickOpts(sel) {
  return `<option value="r"${sel === 'r' ? ' selected' : ''}>Random</option>
    <optgroup label="Pound for pound">${P4P_2026.map((s, i) => `<option value="s${i}"${sel === 's' + i ? ' selected' : ''}>${esc(s.name)}</option>`).join('')}</optgroup>
    <optgroup label="Style">${LAB_STYLE_KEYS.map(k => `<option value="y${k}"${sel === 'y' + k ? ' selected' : ''}>${esc(STYLES[k].label)}</option>`).join('')}</optgroup>`;
}
function labGuardOpts(sel) { return `<option value="auto">Guard: fits style</option>` + Object.keys(GUARDS).map(k => `<option value="${k}"${sel === k ? ' selected' : ''}>${esc(GUARDS[k].label)}</option>`).join(''); }
function labMake(pickV, guardV, div) {
  let f;
  if (pickV[0] === 's') f = genStar(+pickV.slice(1));
  else {
    const rating = Math.round(rnd(72, 91));
    f = genFighter(div, rating, 100, ri(21, 34));
    const pool = BASE_STYLES.concat(LAB_STYLE_KEYS.filter(k => STYLES[k].special && R() < .5));
    const st = pickV[0] === 'y' ? pickV.slice(1) : pick(pool);
    f.style = st; f.guard = rollGuard(st); f.stats = genStats(rating, st);
  }
  if (guardV !== 'auto') f.guard = guardV;
  f.look = randLook(div);
  return f;
}
function labSheet(f) { return { name: f.name, nick: f.nick, style: f.style, guard: f.guard, stance: f.stance, stats: f.stats, look: f.look, wear: 0, exp: f.record ? f.record.w + f.record.l + f.record.d : 0 }; }
function labDesc(f) { return `${esc(STYLES[f.style].label)}, ${esc(gLabel(f.guard).toLowerCase())}, ${f.stance}, OVR ${Math.round(f.rating)}`; }
function labNew(rematch) {
  if (!rematch || !LAB.last) {
    const starDiv = v => v[0] === 's' ? P4P_2026[+v.slice(1)].div : null;
    const div = LAB.div !== 'r' ? +LAB.div : starDiv(LAB.a) ?? starDiv(LAB.b) ?? ri(0, DIVS.length - 1);
    LAB.last = { A: labMake(LAB.a, LAB.ga, div), B: labMake(LAB.b, LAB.gb, div), div, venue: pick(Object.keys(VENUE_NAMES)) };
  }
  labFight(LAB.last);
}
function labFight(L) {
  if (rafId) cancelAnimationFrame(rafId);
  Comm.stop && Comm.stop();
  const A = labSheet(L.A), B = labSheet(L.B), o = { venue: L.venue, rounds: LAB.rounds, title: [], tier: 'main' };
  save.pending = { offer: o };
  F = new Fight(A, B, { rounds: o.rounds, cutmanA: .6, cutmanB: .6 });
  FX = { offer: o, venue: o.venue, looks: [A.look, B.look], speed: FX ? FX.speed : 1, acc: 0, last: 0, hitStop: 0, mode: 'live', excite: 0, flash: 0, cam: 0, zoom: 1.32, ev: [], t: 0, rp: 0, rpLast: -1, eruptT: 0, strat: 'auto', cornerT: 0, done: false, ref: null };
  const ta = gearItem('trunks', A.look.trunks).c;
  if (colorDist(ta, gearItem('trunks', B.look.trunks).c) < CLASH) { const alt = GEAR.trunks.filter(g => colorDist(g.c, ta) >= CLASH); B.look = Object.assign({}, B.look, { trunks: (alt.length ? pick(alt) : GEAR.trunks.slice().sort((x, y) => colorDist(y.c, ta) - colorDist(x.c, ta))[0]).id }); }
  const ga = gearItem('gloves', A.look.gloves).c;
  if (colorDist(ga, gearItem('gloves', B.look.gloves).c) < CLASH) { const alt = GEAR.gloves.filter(g => colorDist(g.c, ga) >= CLASH); if (alt.length) B.look = Object.assign({}, B.look, { gloves: pick(alt).id }); }
  FX.looks = [A.look, B.look];
  Render.reset(); Comm.reset();
  const nm = s => esc(s.name.split(' ').slice(-1)[0]);
  show(`<div class="fight">
    ${labBar(L)}
    <div class="hud">
      <div class="hf l"><div class="hn">${nm(A)}</div><div class="hb"><i class="max" id="hm0"></i><i class="cur" id="hh0"></i></div><div class="sb"><i class="bd" id="hbd0"></i><i class="st" id="hs0"></i></div></div>
      <div class="clock"><span id="rd">R1</span><b id="ck">3:00</b></div>
      <div class="hf r"><div class="hn">${nm(B)}</div><div class="hb"><i class="max" id="hm1"></i><i class="cur" id="hh1"></i></div><div class="sb"><i class="bd" id="hbd1"></i><i class="st" id="hs1"></i></div></div>
    </div>
    <div class="stage"><canvas id="cv"></canvas><div class="ov" id="ov"></div><div class="pop" id="pop"></div><div class="yell" id="yell"></div></div>
    <div class="feed" id="feed" aria-live="polite"></div>
    <div class="shouts off" id="shouts" aria-label="Yell from the corner">${Object.keys(SHOUTS).map(k => `<button data-act="shout" data-v="${k}">${SHOUT_BTN[k]}<i></i></button>`).join('')}</div>
    <div class="cornerbox" id="cbox"></div>
    <div class="ctrl"><div class="seg small">${[1, 2, 4].map(s => `<button class="${FX.speed === s ? 'on' : ''}" data-act="speed" data-v="${s}">${s}x</button>`).join('')}</div><div class="row">${soundBtns()}</div></div>
  </div>`, 'fightmode');
  Render.init($('#cv'));
  Sfx.init(); Comm.initVoices(); Sfx.crowd(CROWD_BASE[FX.venue], 1);
  overlay(`<div class="intro"><span>Fight lab, ${esc(DIVS[L.div].name)}</span><b>${esc(A.name)}</b><em>vs</em><b>${esc(B.name)}</b><span>${o.rounds} rounds, ${esc(VENUE_NAMES[o.venue])}</span></div>`, 2300);
  rafId = requestAnimationFrame(loop);
}
function labBar(L) {
  return `<div class="lab">
    <div class="labrow"><button class="btn" data-act="labNew">🎲 New fight</button><button class="btn ghost" data-act="labRe">Rematch</button><button class="btn ghost" data-act="labSet">${LAB.open ? 'Hide' : 'Pick'}</button></div>
    <div class="labwho"><span class="labA">${esc(L.A.name)}</span> ${labDesc(L.A)}<br><span class="labB">${esc(L.B.name)}</span> ${labDesc(L.B)}</div>
    <div class="labset"${LAB.open ? '' : ' hidden'}>
      <div class="labf"><b>Weight</b><select onchange="LAB.div=this.value"><option value="r">Random</option>${DIVS.map((d, i) => `<option value="${i}"${LAB.div === '' + i ? ' selected' : ''}>${esc(d.name)}</option>`).join('')}</select></div>
      <div class="labf"><b>Rounds</b><select onchange="LAB.rounds=+this.value">${[4, 6, 8, 10, 12].map(n => `<option${LAB.rounds === n ? ' selected' : ''}>${n}</option>`).join('')}</select></div>
      <div class="labf"><b>Left</b><select onchange="LAB.a=this.value">${labPickOpts(LAB.a)}</select><select onchange="LAB.ga=this.value">${labGuardOpts(LAB.ga)}</select></div>
      <div class="labf"><b>Right</b><select onchange="LAB.b=this.value">${labPickOpts(LAB.b)}</select><select onchange="LAB.gb=this.value">${labGuardOpts(LAB.gb)}</select></div>
      <p class="mute small">Pick, then New fight. Random keeps rolling new men; a P4P star brings his own weight class.</p>
    </div></div>`;
}
ACT.labNew = () => labNew(false);
ACT.labRe = () => labNew(true);
ACT.labSet = (d, b) => { LAB.open = !LAB.open; const s = document.querySelector('.labset'); if (s) s.hidden = !LAB.open; b.textContent = LAB.open ? 'Hide' : 'Pick'; };
// the result: who won and how, the punch stats, then go again
resultScreen = function () {
  if (!F || !F.result) return;
  Comm.stop();
  const res = F.result, A = F.f[0], B = F.f[1], L = LAB.last;
  const mName = { UD: 'Unanimous decision', SD: 'Split decision', MD: 'Majority decision' }[res.method] || res.method;
  const how = res.decision ? mName : `${mName}, round ${res.round} at ${res.time}`;
  const who = res.winner == null ? 'Draw' : esc([L.A, L.B][res.winner].name) + ' wins';
  const row = (l, k) => `<div class="pr"><b>${A.tot.landed[k]}/${A.tot.thrown[k]}</b><span>${l}</span><b>${B.tot.landed[k]}/${B.tot.thrown[k]}</b></div>`;
  const keys = Object.keys(A.tot.landed);
  show(`<div class="screen">${labBar(L)}<h2>${who}</h2><p class="mute">${esc(how)}</p>
    <div class="cards">${res.cards.map((c, i) => `<div><span>Judge ${i + 1}</span><b>${c[0]}-${c[1]}</b></div>`).join('')}</div>
    <div class="pstats">${keys.map(k => row(k[0].toUpperCase() + k.slice(1), k)).join('')}</div></div>`, '');
};
const labCss = document.createElement('style');
labCss.textContent = `.lab{margin:0 0 6px}.labrow{display:flex;gap:6px}.labrow .btn{flex:1;padding:8px 6px;font-size:15px}
.labwho{font-size:12.5px;line-height:1.35;color:var(--mute,#999);margin:6px 2px}.labA,.labB{color:var(--ink,#2a2018);font-weight:700}
.labset{display:grid;gap:6px;margin:6px 0;font-size:13px}.labf{display:flex;gap:6px;align-items:center}.labf b{width:56px;flex:none;text-align:left}.labf select{flex:1;min-width:0;font:inherit;padding:6px;border-radius:8px;background:#fffaf2;color:#2a2018;border:1px solid #c9bba5}`;
document.head.appendChild(labCss);
labNew(false);
