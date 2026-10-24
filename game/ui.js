/* ===== LAST BELL : game screens (title, create, hub, offers, camp, result; game/build.js puts this in game.html in place of the lab) ===== */
const money = n => (n < 0 ? '-$' : '$') + Math.abs(Math.round(n)).toLocaleString('en-US');
function modal(html) {
  const m = document.createElement('div'); m.className = 'modal'; m.innerHTML = `<div class="sheet">${html}</div>`;
  document.body.appendChild(m); return m;
}
function closeModal() { document.querySelectorAll('.modal').forEach(m => m.remove()); }

/* ---------- storage: localStorage always, claude db sync when available ---------- */
const Store = {
  KEY: 'lastbell_game_v2', db: null, uid: null, chain: [Promise.resolve(), Promise.resolve(), Promise.resolve()],
  load() { try { const s = JSON.parse(localStorage.getItem(this.KEY)); if (Array.isArray(s) && s.length === 3) return s.map(x => { try { return migrateSave(x); } catch (e) { return x; } }); } catch (e) { } return [null, null, null]; },
  saveLocal() { try { localStorage.setItem(this.KEY, JSON.stringify(slots)); } catch (e) { } },
  async connect() {
    try {
      if (!window.claude || !claude.use) return;
      const [db, user] = await Promise.all([claude.use('db'), claude.use('user')]);
      if (!db || !user) return;
      const id = await user.id(); if (!id) return;
      this.db = db; this.uid = id; let changed = false;
      for (let i = 0; i < 3; i++) {
        try {
          const snap = await db.doc(`data/users/${id}/game${i}`).get();
          if (snap.exists) {
            const d = snap.data();
            if (d && (d.z || d.json)) { const s = d.z ? await Backup.decode(d.z) : migrateSave(JSON.parse(d.json)); if (!slots[i] || (s.savedAt || 0) > (slots[i].savedAt || 0)) { slots[i] = s; changed = true; } }
            else if (d && d.empty && slots[i] && (d.savedAt || 0) > (slots[i].savedAt || 0)) { slots[i] = null; changed = true; }
          }
        } catch (e) { }
      }
      if (changed) { this.saveLocal(); if (cur < 0) titleScreen(); }
    } catch (e) { }
  },
  push(i) {
    this.saveLocal();
    if (!this.db) return;
    const s = slots[i]; const ref = this.db.doc(`data/users/${this.uid}/game${i}`);
    // the save goes up gzipped (a backup code): the memory tables grow every fight and a db doc holds 256 KiB
    const json = s ? JSON.stringify(s) : null, at = s ? s.savedAt || Date.now() : Date.now();
    this.chain[i] = this.chain[i].then(async () => ref.set(json ? { z: await Backup.pack(json), savedAt: at } : { empty: true, savedAt: at })).catch(() => { });
  }
};
let slots = Store.load(); let cur = -1; let save = null;
function persist() { const s = save; if (cur < 0 || !s) return; s.savedAt = Date.now(); slots[cur] = s; Store.push(cur); }
const slotName = s => s.player.name;

/* ---------- backup codes: a whole career as text. Copy it out, paste it back on any device ---------- */
const toB64 = u => { let t = ''; for (let i = 0; i < u.length; i += 0x8000) t += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(t); };
const fromB64 = t => Uint8Array.from(atob(t), c => c.charCodeAt(0));
const pipeBytes = async (bytes, stream) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
const Backup = {
  // LBz1. = gzipped (about a quarter of the size), LB1. = plain, for browsers without CompressionStream
  encode(s) { return this.pack(JSON.stringify(s)); },
  async pack(json) {
    const bytes = new TextEncoder().encode(json);
    if (window.CompressionStream) { try { return 'LBz1.' + toB64(await pipeBytes(bytes, new CompressionStream('gzip'))); } catch (e) { } }
    return 'LB1.' + toB64(bytes);
  },
  async decode(code) {
    const m = String(code).replace(/\s+/g, '').match(/^LB(z?)1\.([A-Za-z0-9+/=]+)$/);
    if (!m) throw new Error("That isn't a Last Bell backup code. Paste the whole thing, starting with LB.");
    let bytes; try { bytes = fromB64(m[2]); } catch (e) { throw new Error('The code got cut off or changed. Copy it again.'); }
    if (m[1]) {
      if (!window.DecompressionStream) throw new Error("This browser can't open compressed codes. Try a newer browser.");
      try { bytes = await pipeBytes(bytes, new DecompressionStream('gzip')); } catch (e) { throw new Error('The code got cut off or changed. Copy it again.'); }
    }
    let s; try { s = JSON.parse(new TextDecoder().decode(bytes)); } catch (e) { throw new Error('The code got cut off or changed. Copy it again.'); }
    if (!s || (!s.player || !s.player.stats || !s.world || !Array.isArray(s.world.roster))) throw new Error('That code is missing pieces of the career.');
    return migrateSave(s);
  }
};
async function copyText(t, ta) {
  try { await navigator.clipboard.writeText(t); return true; } catch (e) { }
  try { ta.focus(); ta.select(); ta.setSelectionRange(0, t.length); return document.execCommand('copy'); } catch (e) { return false; }
}

/* ---------- shared bits ---------- */
const GUARD_SCOUT = {
  standard: 'Textbook guard. No obvious hole, so just outwork him.',
  high: 'Hands glued high. Dig to the body and split the gloves with uppercuts.',
  peekaboo: 'Bobs and weaves inside. Stick the jab and touch the body before he gets there.',
  philly: 'Shoulder roll. Lead with the right hand and make him reach for it.',
  cross: 'Arms locked over his face. The ribs and liver are wide open.',
  handslow: 'Hands down, eyes up. Sharp straight shots, then make him work tired.'
};
/* ---------- tale of the tape: his numbers next to yours, and what the corner makes of it ---------- */
const TAPE_HIM = { power: 'he hits harder than you', speed: 'his hands are quicker', accuracy: "he's the sharper puncher", defense: "he's harder to hit", footwork: 'he moves better', chin: 'he takes a shot better', body: 'he takes the body better', stamina: "he's got the bigger gas tank", recovery: 'he bounces back quicker', heart: "he won't break easy" };
const TAPE_YOU = { power: 'you hit harder', speed: 'your hands are quicker', accuracy: "you're the sharper puncher", defense: "you're harder to hit", footwork: 'you move better', chin: 'you take a shot better', body: 'you take the body better', stamina: "you've got more gas", recovery: 'you bounce back quicker', heart: "you've got more heart" };
const TAPE_HOLE = { power: 'No real pop, so you can walk through him.', speed: 'Slow hands. Beat him to the punch.', accuracy: "He's wild. Make him miss and make him pay.", defense: "He's there to be hit.", footwork: 'Flat feet. Cut the ring off.', chin: "Chin's a question. Test it early.", body: 'Soft downstairs. Dig to the body.', stamina: 'He fades late. Make it a long night.', recovery: 'Once he is hurt he stays hurt. Jump on him.', heart: 'He folds when it gets ugly. Break his will.' };
const cap1 = t => t[0].toUpperCase() + t.slice(1);
const pct = (a, b) => b ? Math.round(100 * a / b) : 0;
// what anyone could tell you from his record
function publicRead(save, f) {
  const out = [], rc = f.record || { w: 0, l: 0, ko: 0 }, kp = pct(rc.ko, rc.w), L = f.last;
  if (L && L.w === 0 && L.ko) out.push(L.you ? 'You stopped him last time out. He remembers.' : 'Got stopped last time out. The chin could be shaky.');
  if (rc.w >= 6 && kp >= 70) out.push(`${kp}% of his wins by KO. Respect the power.`);
  else if (rc.w >= 8 && kp <= 30) out.push(`Only ${kp}% KOs. He wins on points, not power.`);
  if (f.age >= 34) out.push(`He's ${Math.floor(f.age)}. The legs might not be there late.`);
  else if (f.age <= 23 && !f.club) out.push('Young and still getting better.');
  return out.slice(0, 2);
}
function cornerRead(save, f) {
  const me = save.player.stats, him = liveStats(f), known = isScouted(save, f);
  const gap = ovr(him) - ovr(me);
  const verdict = gap >= 8 ? "On paper he's a lot better than you." : gap >= 4 ? "He's the better fighter on paper." : gap > -4 ? 'Even fight on paper.' : gap > -8 ? "You're the better fighter on paper." : 'You should handle him.';
  if (!known) return [verdict, ...publicRead(save, f), 'Get film on him to know more.'].join(' ');
  let hk = null, yk = null;
  for (const k of STATS) { const d = him[k] - me[k]; if (d >= 4 && (!hk || d > him[hk] - me[hk])) hk = k; if (d <= -4 && (!yk || d < him[yk] - me[yk])) yk = k; }
  const edge = hk && yk ? cap1(TAPE_HIM[hk]) + ', but ' + TAPE_YOU[yk] + '.' : hk ? cap1(TAPE_HIM[hk]) + '.' : yk ? cap1(TAPE_YOU[yk]) + '.' : '';
  const avg = STATS.reduce((t, k) => t + him[k], 0) / STATS.length;
  let lo = null; for (const k of STATS) if (him[k] - avg <= -6 && k !== yk && (!lo || him[k] < him[lo])) lo = k;
  return [verdict, edge, lo ? TAPE_HOLE[lo] : ''].filter(Boolean).join(' ');
}
function winLine(w) { return `<li class="${w.you ? 'you' : ''}">${w.you ? (w.ko ? 'Stopped <b>you</b>' : 'Beat <b>you</b>') : (w.ko ? 'KO ' : 'Beat ') + esc(w.n)}${w.r ? ` <small>(#${w.r})</small>` : ''}${w.t && w.t.length ? ' ' + beltChips(w.t) : ''}</li>`; }
function lastLine(L) {
  if (!L) return 'No pro fights on record.';
  const who = L.you ? 'you' : esc(L.n);
  return L.w == null ? `Drew with ${who}` : L.w ? `Beat ${who}${L.ko ? ' by KO' : ' on points'}` : `Lost to ${who}${L.ko ? ' by KO' : ' on points'}`;
}
// offer: the fight on the table. open: start expanded. The tape always shows the public side; his numbers need film
function tapeHtml(save, offer, open, idx) {
  const P = save.player, f = resumeOf(save, oppNow(save, offer)), known = isScouted(save, f), me = P.stats, him = liveStats(f);
  const prow = (a, l, b) => `<span class="pv me">${a}</span><span class="l">${l}</span><span class="pv him">${b}</span>`;
  const hr = f.club ? 'Unranked' : '#' + (rankList(save).findIndex(e => e.id === f.id) + 1), mr = P.points < 30 ? 'Unranked' : '#' + playerRank(save);
  const pub = prow(Math.floor(age(save)), 'Age', Math.floor(f.age)) + prow(rec(P.record), 'Record', rec(f.record)) + prow(`${P.record.ko} <small>(${pct(P.record.ko, P.record.w)}%)</small>`, 'KOs', `${f.record.ko} <small>(${pct(f.record.ko, f.record.w)}%)</small>`) + prow(cap1(P.stance), 'Stance', cap1(f.stance)) + prow(mr, 'Ranking', hr);
  const rows = STATS.map(k => {
    const a = Math.round(me[k]), b = Math.round(him[k]);
    return known ? `<span class="v ${a > b ? 'w' : ''}">${a}</span><span class="b me"><i style="width:${a}%"></i></span><span class="l">${STAT_LABEL[k]}</span><span class="b him"><i style="width:${b}%"></i></span><span class="v ${b > a ? 'w' : ''}">${b}</span>`
      : `<span class="v">${a}</span><span class="b me"><i style="width:${a}%"></i></span><span class="l">${STAT_LABEL[k]}</span><span class="b him unk"></span><span class="v q">??</span>`;
  }).join('');
  const belts = f.club ? [] : beltsOf(save, f.id), ex = (f.exBelts || []).filter(k => !belts.includes(k));
  const res = `<div class="resume"><h5>Notable wins</h5>${f.wins.length ? `<ul>${f.wins.map(winLine).join('')}</ul>` : '<p class="mute small">Nobody worth mentioning yet.</p>'}
    <p class="small"><span class="mute">Last fight:</span> ${lastLine(f.last)}</p>
    ${belts.length ? `<p class="small"><span class="mute">Holds:</span> ${beltChips(belts)}</p>` : ''}${ex.length ? `<p class="small"><span class="mute">Former champ:</span> ${beltChips(ex)}</p>` : ''}</div>`;
  const c = scoutCost(offer);
  const foot = known ? `<p class="mute tiny">${(P.history.some(h => h.oppId ? h.oppId === f.id : h.opp === f.name)) ? "You've been in there with him. You know what he has." : 'Scouted. Your corner has film on him.'}</p>`
    : `<div class="scout"><button class="btn sm" data-act="scout" data-i="${idx}" ${P.money < c ? 'disabled' : ''}>Scout him: ${money(c)}</button><span class="mute tiny">Film study. Shows his real numbers for a year.</span></div>`;
  return `<details class="tape" ${open ? 'open' : ''}><summary>Tale of the tape${known ? '' : ' <small class="mute">(not scouted)</small>'}</summary><div class="tt"><span class="h" style="grid-column:1/3">You</span><span></span><span class="h" style="grid-column:4/6;text-align:right">Him</span>${pub}${rows}
    <span class="v w">${ovr(me)}</span><span></span><span class="l"><b>Overall</b></span><span></span><span class="v w">${ovr(him)}</span></div>${res}${foot}</details>`;
}
// pot: his ceiling stats, if known. Fit at the ceiling is where the guard is headed
function guardCard(stats, g, iq, pot) {
  const G = GUARDS[g] || GUARDS.standard, fit = guardSkill(stats, g), top = pot ? Math.max(fit, guardSkill(pot, g)) : null;
  const pc = x => Math.round(x * 100), need = G.skill ? G.skill.map(k => STAT_LABEL[k]).join(', ') : '';
  const warn = !G.skill || fit >= .5 ? ''
    : top != null && top < .5 ? `<p class="alert small">Even at his ceiling he only half-runs this guard (fit ${pc(top)}%). The holes stay, the perks never fully arrive.</p>`
    : `<p class="alert small">His stats can't run this yet (fit ${pc(fit)}%${top != null ? `, ${pc(top)}% at his ceiling` : ''}). The holes are there now, the perks come as ${esc(need)} climb.</p>`;
  return `<div class="gcard"><div class="gtop"><b>${G.label}</b>${iq != null ? `<span>Ring IQ <b>${Math.round(iq)}</b></span>` : ''}</div><p class="mute small">${G.desc}</p>
    ${G.skill ? `<div class="stat"><span class="sl">Guard fit</span><span class="bar"><i style="width:${pc(fit)}%"></i>${top != null ? `<b style="left:${pc(top)}%"></b>` : ''}</span><span class="sv">${pc(fit)}</span><span></span></div><p class="mute tiny">Runs on ${esc(need)}.${top != null ? ' The tick is his ceiling.' : ''}</p>` : ''}${warn}</div>`;
}
function beltChips(list) { return list.map(k => { const o = ORGS.find(x => x.k === k); return `<span class="belt" style="--bc:${o.c}">${k}</span>`; }).join(''); }
function statRow(k, v, pot, delta) {
  const d = delta ? `<span class="delta ${delta > 0 ? 'up' : 'down'}">${delta > 0 ? '+' : ''}${delta.toFixed(1)}</span>` : '';
  return `<div class="stat"><span class="sl">${STAT_LABEL[k]}</span><span class="bar"><i style="width:${v}%"></i>${pot ? `<b style="left:${pot}%"></b>` : ''}</span><span class="sv">${Math.round(v)}</span>${d}</div>`;
}

/* ---------- title ---------- */
// ---------- the brain side on screen: ring skills (P.sk) against his talent (P.cap), size ----------
const SK_LABEL = { jab: 'Jab', power: 'Power shots', combos: 'Combinations', body: 'Body work', feints: 'Feints', block: 'Blocking', slip: 'Slipping', footwork: 'Footwork', clinch: 'Clinch',
  cutoff: 'Cutting the ring', ropes: 'Off the ropes', range: 'Range', angles: 'Angles', counter: 'Counters', read: 'Reading him', pacing: 'Pacing', adjust: 'Adjusting' };
const SK_GROUP = [['Offense', ['jab', 'power', 'combos', 'body', 'feints']], ['Defense', ['block', 'slip', 'footwork', 'clinch']], ['Ring craft', ['cutoff', 'ropes', 'range', 'angles']], ['Fight IQ', ['counter', 'read', 'pacing', 'adjust']]];
const ftIn = n => `${Math.floor(n / 12)}'${Math.round(n % 12)}"`;
function skRow(P, k, delta) {
  const v = P.sk[k], d = delta ? `<span class="delta ${delta > 0 ? 'up' : 'down'}">${delta > 0 ? '+' : ''}${delta.toFixed(1)}</span>` : '';
  return `<div class="stat"><span class="sl">${SK_LABEL[k]}</span><span class="bar"><i style="width:${v}%"></i>${P.cap ? `<b style="left:${P.cap[k]}%"></b>` : ''}</span><span class="sv">${Math.round(v)}</span>${d}</div>`;
}
function skillsHtml(P) {
  const L = lvOf(P);
  return `<div class="ovr">Ring skills <b>${esc(L.label)}</b><span class="mute"> avg ${L.avg}. The tick is his talent.</span></div>
    ${SK_GROUP.map(([g, ks]) => `<h5 class="skg">${g}</h5><div class="stats">${ks.map(k => skRow(P, k)).join('')}</div>`).join('')}
    <p class="mute tiny">What he knows how to do with his body. It grows from fights (what he uses and what works, more from a loss) and from camp drills. Skills he stops using slip. Novice, Intermediate (46), Pro (66), World class (84).</p>`;
}
function titleScreen() {
  cur = -1; save = null;
  const cards = slots.map((s, i) => {
    if (!s) return `<button class="slot empty" data-act="newSlot" data-i="${i}"><span class="sn">Slot ${i + 1}</span><span class="st">New career</span></button>`;
    const P = s.player;
    const status = P.retired ? 'Retired' : P.injury ? 'Injured' : `#${playerRank(s)} ${DIVS[P.div].name}`;
    return `<div class="slot"><button class="slot-main" data-act="loadSlot" data-i="${i}">
      <span class="sn">${P.nick ? `"${esc(P.nick)}" ` : ''}${esc(P.name)}</span>
      <span class="st">${rec(P.record)} (${P.record.ko} KO), age ${Math.floor(age(s))}, ${esc(status)}</span>
      ${P.belts.length ? `<span class="chips">${beltChips(P.belts)}</span>` : ''}</button>
      <button class="x" data-act="backupSlot" data-i="${i}" aria-label="Backup slot ${i + 1}">Backup</button>
      <button class="x" data-act="delSlot" data-i="${i}" aria-label="Delete slot ${i + 1}">Delete</button></div>`;
  }).join('');
  show(`<div class="title-wrap">
    <div class="marquee"><div class="bulb"></div><h1>Last Bell</h1><p>You are the coach. Build a fighter, pick his fights, run his camps, work his corner. He learns from every one.</p></div>
    <div class="slots">${cards}</div>
    <div class="row center"><button class="btn ghost sm" data-act="restore">Restore from a backup code</button></div>
    <div class="row center">${soundBtns()}</div>
  </div>`, 'title');
}
ACT.newSlot = d => createScreen(+d.i);
ACT.loadSlot = d => { cur = +d.i; save = migrateSave(slots[cur]); if (save.player.retired) retiredCard(); else hub(); };
ACT.delSlot = d => {
  const i = +d.i; const m = modal(`<h3>Delete this career?</h3><p class="mute">${esc(slotName(slots[i]))} will be gone for good.</p><div class="row"><button class="btn ghost" data-close>Keep it</button><button class="btn danger" data-del>Delete</button></div>`);
  m.querySelector('[data-close]').onclick = closeModal;
  m.querySelector('[data-del]').onclick = () => { slots[i] = null; Store.push(i); closeModal(); titleScreen(); };
};

ACT.backupSlot = async d => {
  const i = +d.i, s = slots[i]; if (!s) return;
  const m = modal(`<h3>Backup code</h3><p class="mute">${esc(slotName(s))}, ${rec(s.player.record)}. Copy this and keep it somewhere safe (notes app, text it to yourself). Paste it into "Restore from a backup code" to bring him back, on this phone or any other.</p>
    <textarea class="code" readonly aria-label="Backup code">Making the code…</textarea><p class="mute tiny" data-msg></p>
    <div class="row"><button class="btn ghost" data-close>Done</button><button class="btn" data-copy disabled>Copy code</button></div>`);
  m.querySelector('[data-close]').onclick = closeModal;
  const ta = m.querySelector('textarea'), btn = m.querySelector('[data-copy]'), msg = m.querySelector('[data-msg]');
  let code; try { code = await Backup.encode(s); } catch (e) { ta.value = ''; msg.textContent = "Couldn't make a code on this browser."; return; }
  ta.value = code; btn.disabled = false; msg.textContent = `${Math.ceil(code.length / 1000)}k characters. Copy all of it.`;
  ta.onfocus = () => ta.select();
  btn.onclick = async () => { const ok = await copyText(code, ta); btn.textContent = ok ? 'Copied' : 'Select all and copy'; if (!ok) ta.select(); };
};
ACT.restore = () => {
  let pickI = slots.findIndex(x => !x); if (pickI < 0) pickI = 0;
  const m = modal(`<h3>Restore a career</h3><p class="mute">Paste a backup code, then pick the slot it goes in.</p>
    <textarea class="code" aria-label="Backup code" placeholder="LBz1.…" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea>
    <div class="seg small" data-slots></div><p class="alert small" data-err hidden></p>
    <div class="row"><button class="btn ghost" data-close>Cancel</button><button class="btn" data-go>Restore</button></div>`);
  const ta = m.querySelector('textarea'), err = m.querySelector('[data-err]'), go = m.querySelector('[data-go]'), seg = m.querySelector('[data-slots]');
  const draw = () => {
    seg.innerHTML = slots.map((x, i) => `<button class="${i === pickI ? 'on' : ''}" data-i="${i}">Slot ${i + 1}${x ? '' : ' (empty)'}</button>`).join('');
    seg.querySelectorAll('button').forEach(b => b.onclick = () => { pickI = +b.dataset.i; draw(); });
    go.textContent = slots[pickI] ? `Replace ${slotName(slots[pickI])}` : 'Restore';
    go.classList.toggle('danger', !!slots[pickI]);
  };
  draw(); ta.oninput = () => { err.hidden = true; };
  m.querySelector('[data-close]').onclick = closeModal;
  go.onclick = async () => {
    err.hidden = true; go.disabled = true;
    try {
      const s = await Backup.decode(ta.value); s.savedAt = Date.now();
      slots[pickI] = s; Store.push(pickI); closeModal(); titleScreen();
      const ok = modal(`<h3>He's back</h3><p class="mute">${esc(slotName(s))}, restored to slot ${pickI + 1}.</p><button class="btn" data-ok>OK</button>`);
      ok.querySelector('[data-ok]').onclick = closeModal;
    } catch (e) { err.textContent = e.message || 'That code did not work.'; err.hidden = false; go.disabled = false; }
  };
  setTimeout(() => ta.focus(), 50);
};

/* ---------- create ---------- */
let draft = null;
const BASE = 42, POOL = 100, CAP = 72;
function rollDraft(mode, keep) {
  const div = keep ? keep.div : 4; const style = pick(BASE_STYLES);
  const d = { mode, slot: keep ? keep.slot : 0, name: keep && keep.nameLocked ? keep.name : pick(FIRST) + ' ' + pick(LAST), nick: keep && keep.nameLocked ? keep.nick : pick(NICKS), nameLocked: keep ? keep.nameLocked : false, div, style: keep && mode === 'build' ? keep.style : style, stance: R() < .22 ? 'southpaw' : 'orthodox', look: randLook(div) };
  d.guard = keep && keep.guard ? keep.guard : mode === 'random' ? rollGuard(d.style) : 'standard';
  if (keep && keep.lookLocked) { d.look = keep.look; d.lookLocked = true; }
  if (mode === 'random') { d.stats = genStats(ri(50, 58), d.style); d.potAdd = {}; STATS.forEach(k => d.potAdd[k] = ri(16, 42)); }
  else { d.stats = {}; STATS.forEach(k => d.stats[k] = BASE); d.potAdd = {}; STATS.forEach(k => d.potAdd[k] = ri(20, 38)); }
  return d;
}
function spent() { return STATS.reduce((s, k) => s + (draft.stats[k] - BASE), 0); }
function ceilingGrade() { const avg = STATS.reduce((s, k) => s + Math.min(97, draft.stats[k] + draft.potAdd[k]), 0) / STATS.length; return avg >= 86 ? 'A' : avg >= 80 ? 'B' : avg >= 74 ? 'C' : 'D'; }
function createScreen(slot) { draft = rollDraft('random'); draft.slot = slot; renderCreate(); }
function renderCreate() {
  const D = draft; const build = D.mode === 'build'; const left = POOL - spent();
  const statsHtml = STATS.map(k => build
    ? `<div class="stat alloc"><span class="sl">${STAT_LABEL[k]}</span><button class="pm" data-act="pm" data-k="${k}" data-v="-1" aria-label="Lower ${STAT_LABEL[k]}">−</button><span class="bar"><i style="width:${D.stats[k]}%"></i></span><button class="pm" data-act="pm" data-k="${k}" data-v="1" aria-label="Raise ${STAT_LABEL[k]}">+</button><span class="sv">${D.stats[k]}</span></div>`
    : statRow(k, D.stats[k])).join('');
  show(`<div class="screen">
    <div class="topbar"><button class="link" data-act="toTitle">Back</button><span class="tb-title">New fighter</span><span></span></div>
    <div class="seg" role="tablist"><button class="${!build ? 'on' : ''}" data-act="mode" data-v="random">Random</button><button class="${build ? 'on' : ''}" data-act="mode" data-v="build">Build him</button></div>
    <div class="create-top">
      <canvas class="portrait" id="pv"></canvas>
      <div class="ct-info">
        <label>Name<input id="inName" maxlength="24" value="${esc(D.name)}"></label>
        <label>Nickname<input id="inNick" maxlength="20" value="${esc(D.nick)}" placeholder="Optional"></label>
        <div class="mini">Overall <b>${ovr(D.stats)}</b> &nbsp; Ceiling <b>${ceilingGrade()}</b> &nbsp; Ring IQ <b>${Math.round(ringIQ({ stats: D.stats, exp: 0 }))}</b></div>
        ${!build ? `<button class="btn ghost sm" data-act="reroll">Reroll</button>` : ''}
      </div>
    </div>
    <h4>Division</h4>
    <select id="inDiv">${DIVS.map((v, i) => `<option value="${i}" ${i === D.div ? 'selected' : ''}>${v.name} (${v.lb})</option>`).join('')}</select>
    <h4>Style <span class="pts">locked for the career</span></h4>
    <div class="chips wrap">${BASE_STYLES.map(k => `<button class="chip ${D.style === k ? 'on' : ''}" data-act="style" data-v="${k}">${STYLES[k].label}</button>`).join('')}</div>
    <p class="mute small">${esc(STYLES[D.style].desc)} The only way to change it later: beat a legend and learn his.</p>
    <h4>Stance <span class="pts">can change in camp</span></h4>
    <div class="seg small"><button class="${D.stance === 'orthodox' ? 'on' : ''}" data-act="stance" data-v="orthodox">Orthodox</button><button class="${D.stance === 'southpaw' ? 'on' : ''}" data-act="stance" data-v="southpaw">Southpaw</button></div>
    <h4>Guard <span class="pts">locked for the career</span></h4>
    <div class="chips wrap">${Object.keys(GUARDS).map(k => `<button class="chip ${D.guard === k ? 'on' : ''}" data-act="guard" data-v="${k}">${GUARDS[k].label}</button>`).join('')}</div>
    ${guardCard(D.stats, D.guard, null, Object.fromEntries(STATS.map(k => [k, Math.min(97, D.stats[k] + D.potAdd[k])])))}
    <h4>Look</h4>
    <div class="swatches">${SKINS.map(c => `<button class="sw ${D.look.skin === c ? 'on' : ''}" style="background:${c}" data-act="look" data-k="skin" data-v="${c}" aria-label="Skin tone"></button>`).join('')}</div>
    <div class="chips wrap">${HAIRS.map(h => `<button class="chip ${D.look.hair === h ? 'on' : ''}" data-act="look" data-k="hair" data-v="${h}">${h === 'bald' ? 'Bald' : h[0].toUpperCase() + h.slice(1)}</button>`).join('')}<button class="chip ${D.look.beard ? 'on' : ''}" data-act="beard">Beard</button></div>
    <div class="swatches">${HAIR_COLS.map(c => `<button class="sw ${D.look.hairCol === c ? 'on' : ''}" style="background:${c}" data-act="look" data-k="hairCol" data-v="${c}" aria-label="Hair color"></button>`).join('')}</div>
    <h4>Attributes ${build ? `<span class="pts ${left === 0 ? 'done' : ''}">${left} points left</span>` : ''}</h4>
    <div class="stats">${statsHtml}</div>
    <button class="btn big" data-act="startCareer" ${build && left > 0 ? 'disabled' : ''}>${build && left > 0 ? `Spend ${left} more points` : 'Start career'}</button>
  </div>`, 'create');
  Render.portrait($('#pv'), D.look, { stance: D.stance, guard: D.guard });
  const keepName = () => { D.name = $('#inName').value; D.nick = $('#inNick').value; D.nameLocked = true; };
  $('#inName').oninput = keepName; $('#inNick').oninput = keepName;
  $('#inDiv').onchange = e => { const to = +e.target.value; D.look.build *= DIVS[to].build / DIVS[D.div].build; D.div = to; renderCreate(); }; // keeps his own size within the division
}
ACT.toTitle = () => titleScreen();
ACT.mode = d => { const k = { slot: draft.slot, name: draft.name, nick: draft.nick, nameLocked: draft.nameLocked, div: draft.div, style: draft.style, guard: draft.guard, look: draft.look, lookLocked: true }; draft = rollDraft(d.v, k); renderCreate(); };
ACT.reroll = () => { draft = rollDraft('random', { slot: draft.slot, name: draft.name, nick: draft.nick, nameLocked: draft.nameLocked, div: draft.div }); renderCreate(); };
ACT.style = d => { draft.style = d.v; if (draft.mode === 'random') draft.stats = genStats(ovr(draft.stats), d.v); renderCreate(); };
ACT.stance = d => { draft.stance = d.v; renderCreate(); };
ACT.guard = d => { draft.guard = d.v; renderCreate(); };
ACT.look = d => { draft.look[d.k] = d.v; draft.lookLocked = true; renderCreate(); };
ACT.beard = () => { draft.look.beard = !draft.look.beard; renderCreate(); };
ACT.pm = d => {
  const k = d.k, v = +d.v; const left = POOL - spent();
  if (v > 0 && (left <= 0 || draft.stats[k] >= CAP)) return;
  if (v < 0 && draft.stats[k] <= BASE - 10) return;
  draft.stats[k] += v; renderCreate();
};
ACT.startCareer = () => {
  const D = draft; const name = (D.name || '').trim() || 'No Name';
  const pot = {}; STATS.forEach(k => pot[k] = Math.min(97, D.stats[k] + D.potAdd[k]));
  save = newCareer({ name, nick: (D.nick || '').trim(), div: D.div, style: D.style, guard: D.guard, stance: D.stance, stats: Object.assign({}, D.stats), pot, look: D.look, age: ri(19, 22) });
  cur = D.slot; persist(); hub();
};

let hubTab = 'fighter';
function hub(tab) {
  if (tab) hubTab = tab;
  const P = save.player; const rank = playerRank(save); const a = Math.floor(age(save));
  const pend = save.pending;
  let primary;
  if (P.retired) primary = `<button class="btn big ghost" data-act="toTitle">Back to menu</button>`;
  else if (P.injury) primary = `<button class="btn big" data-act="rest">Rest and rehab (${P.injury.weeks} weeks left)</button>`;
  else if (pend && pend.campDone) primary = `<button class="btn big hot" data-act="fightNight">Fight night: ${esc(pend.offer.opp.name)}</button>`;
  else if (pend) primary = `<button class="btn big" data-act="camp">Start camp for ${esc(pend.offer.opp.name)}</button>`;
  else primary = `<button class="btn big" data-act="offers">Find the next fight</button>`;
  const status = (P.injury ? `<div class="alert">${esc(P.injury.name)}. Out ${P.injury.weeks} more weeks.</div>` : '')
    + (P.scar ? `<div class="alert small">${P.scar.kind === 'gunShy' ? 'That knockout is still in his head. He might hold his hands back for a while.' : 'He remembers getting stopped. He will be careful for a fight or two.'}</div>` : '');
  show(`<div class="screen">
    <div class="topbar"><button class="link" data-act="quit">Save &amp; exit</button><span class="tb-title">${DIVS[P.div].name}</span><span class="cash">${money(P.money)}</span></div>
    <div class="poster stitched">
      <canvas class="portrait" id="pv"></canvas>
      <div class="pinfo">
        ${P.nick ? `<span class="nick">"${esc(P.nick)}"</span>` : ''}
        <h2>${esc(P.name)}</h2>
        <div class="recbig">${rec(P.record)} <small>${P.record.ko} KO</small></div>
        <div class="mute">Age ${a}, ${STYLES[P.style].label.toLowerCase()}${P.styleFrom ? ` (learning, ${Math.round(P.styleFit * 100)}%)` : ''}, ${P.stance}${P.stanceFit != null ? ` (new, ${Math.round(P.stanceFit * 100)}%)` : ''}</div>
        <div class="mute">${gLabel(P.guard).replace(/ guard$/i, '')} guard, ${esc(lvOf(P).label)}, ${ftIn(P.ht)} with a ${Math.round(P.reach)}" reach</div>
        <div class="mute">${DIVS[P.div].name} (${DIVS[P.div].lb})${(P.titleDivs || []).length > 1 ? `, champion in ${P.titleDivs.length} divisions` : ''}</div>
        <div class="mute">${P.retired ? 'Retired' : `Ranked #${rank} of ${save.world.roster.length + 1}`}${P.peakRank ? `, peak #${P.peakRank}` : ''}</div>
        ${P.belts.length ? `<div class="chips">${beltChips(P.belts)}</div>` : ''}
      </div>
    </div>
    ${status}
    <div class="wear"><span>Career damage</span><span class="bar warn"><i style="width:${P.wear}%"></i></span><span class="sv">${Math.round(P.wear)}</span></div>
    ${primary}
    ${!P.retired ? `<div class="row"><button class="btn ghost" data-act="rest" ${P.injury ? 'disabled' : ''}>Rest 6 weeks</button><button class="btn ghost" data-act="weight" ${save.pending || P.injury ? 'disabled' : ''}>Weight class</button><button class="btn ghost" data-act="retire">Retire</button></div>` : ''}
    <div class="tabs" role="tablist">${[['fighter', 'Fighter'], ['rank', 'Rankings'], ['locker', 'Locker'], ['history', 'Record']].map(([k, l]) => `<button class="${hubTab === k ? 'on' : ''}" data-act="tab" data-v="${k}">${l}</button>`).join('')}</div>
    <div class="tabbody">${hubBody()}</div>
  </div>`, 'hub');
  Render.portrait($('#pv'), P.look, { stance: P.stance, guard: P.guard, dmg: Math.min(.5, P.wear / 200) });
  if (hubTab === 'locker') { const c = $('#lockpv'); if (c) Render.portrait(c, P.look, { stance: P.stance, guard: P.guard }); }
}
function hubBody() {
  const P = save.player;
  if (hubTab === 'fighter') {
    return skillsHtml(P) + `<div class="ovr">Body <b>${ovr(P.stats)}</b><span class="mute"> overall. The faint tick is his ceiling.</span></div><div class="stats">${STATS.map(k => statRow(k, P.stats[k], P.pot[k])).join('')}</div>
    ${guardCard(P.stats, P.guard, playerIQ(save), P.pot)}<p class="mute tiny">Ring IQ grows with fights and with accuracy, head movement, footwork and heart. Smarter fighters read guards, cut off the ring and slip off the ropes.</p>
    <p class="mute small">Gym: ${GYMS[P.gym].name}. Career earnings ${money(P.earnings)}.</p>`;
  }
  if (hubTab === 'rank') {
    const list = rankList(save); const pr = playerRank(save);
    const row = (e, i) => { const b = beltsOf(save, e.id); return `<div class="rk ${e.isPlayer ? 'me' : ''}"><span class="n">${i + 1}</span><span class="nm">${esc(e.name)}${e.f && e.f.legend ? ` <span class="lgd" title="${e.f.star ? 'Pound for pound' : 'Legend'}">★</span>` : ''}${b.length ? ' ' + beltChips(b) : ''}</span><span class="rc">${rec(e.record)}</span><span class="ov">${Math.round(e.rating)}</span></div>`; };
    let rows = list.slice(0, 15).map(row).join('');
    if (pr > 15) rows += `<div class="rk gap">…</div>` + row(list[pr - 1], pr - 1);
    const champs = ORGS.map(o => { const id = save.world.belts[o.k]; const nm = id === save.player.id ? save.player.name : (findFighter(save, id) || {}).name || 'Vacant'; return `<div class="champ"><span class="belt" style="--bc:${o.c}">${o.k}</span><span>${esc(nm)}</span></div>`; }).join('');
    const beat = save.player.beatLegends || [];
    const lg = LEGENDS.map((L, d) => `<div class="rk ${beat.includes('L' + d) ? 'me' : ''}"><span class="n">${beat.includes('L' + d) ? '✓' : '★'}</span><span class="nm">${esc(L.name)}<small class="mute" style="display:block">${esc(STYLES[L.style].label)}, "${esc(L.nick)}"</small></span><span class="rc">${esc(DIVS[d].name)}</span></div>`).join('');
    const pp = p4p(save).map((e, i) => `<div class="rk ${e.isPlayer ? 'me' : ''}"><span class="n">${i + 1}</span><span class="nm">${esc(e.name)}</span><span class="rc">${esc(e.div)}</span></div>`).join('');
    return `<h4>World champions</h4><div class="champs">${champs}</div><h4>${DIVS[P.div].name} rankings</h4><div class="rklist"><div class="rk head"><span class="n">#</span><span class="nm">Fighter</span><span class="rc">Record</span><span class="ov">OVR</span></div>${rows}</div><h4>Pound for pound</h4><div class="rklist">${pp}</div>
      ${`<h4>Legends</h4><p class="mute small">One in every division, and nobody else fights like him. Beat him and you can learn his style in camp.</p><div class="rklist">${lg}</div>`}`;
  }
  if (hubTab === 'locker') {
    const kinds = [['trunks', 'Trunks'], ['gloves', 'Gloves'], ['shoes', 'Boots']];
    return `<canvas class="portrait wide" id="lockpv"></canvas><p class="mute small">Looks only. No stat boosts, just drip.</p>` + kinds.map(([k, l]) => `<h4>${l}</h4><div class="gear">${GEAR[k].map(g => {
      const own = P.owned.includes(g.id), on = P.look[k] === g.id;
      return `<button class="gi ${on ? 'on' : ''}" data-act="gear" data-k="${k}" data-id="${g.id}" ${!own && g.price > P.money ? 'disabled' : ''}><span class="gsw" style="background:${g.c}"></span><span>${g.name}</span><small>${on ? 'Wearing' : own ? 'Owned' : money(g.price)}</small></button>`;
    }).join('')}</div>`).join('');
  }
  if (hubTab === 'history') {
    if (!P.history.length) return `<p class="mute">No pro fights yet. Go get one.</p>`;
    return `<div class="hist">${P.history.map(h => `<div class="hr ${h.r}"><span class="res">${h.r}</span><span class="hd"><b>${esc(h.opp)}</b> <small>${h.oppRec}</small><br><small>${esc(h.method)}${!h.dec ? `, R${h.round}` : ''} at ${esc(h.venue)}</small></span><span class="hp">${money(h.purse)}${h.title.length ? '<br>' + beltChips(h.title) : ''}</span></div>`).join('')}</div>`;
  }
  return '';
}
ACT.tab = d => hub(d.v);
ACT.quit = () => { persist(); titleScreen(); };
ACT.gear = d => {
  const P = save.player; const g = GEAR[d.k].find(x => x.id === d.id);
  if (!P.owned.includes(g.id)) { if (P.money < g.price) return; P.money -= g.price; P.owned.push(g.id); }
  P.look[d.k] = g.id; persist(); hub();
};
ACT.rest = () => {
  const r = rest(save); persist();
  const lines = STATS.filter(k => Math.abs(r.delta[k]) >= .1).map(k => statRow(k, save.player.stats[k], 0, r.delta[k])).join('');
  const m = modal(`<h3>${r.weeks} weeks off</h3><p class="mute">${r.healed ? 'Body feels better. Wear is down a little.' : 'Still healing.'} Time off costs sharpness.</p><div class="stats">${lines}</div><button class="btn" data-ok>OK</button>`);
  m.querySelector('[data-ok]').onclick = () => { closeModal(); hub(); };
};
ACT.weight = () => {
  const P = save.player, opt = (to, dir) => divMoveOk(save, to) ? `<button class="opt" data-div="${to}"><b>Move ${dir} to ${DIVS[to].name}</b><span>${DIVS[to].lb}</span><small>${dir === 'up' ? 'Bigger, stronger men. His power will not carry the same (power -2, chin -1), but he is the quicker man (hand speed +1).' : 'He hits harder at this weight (power +1, chin +1), but the cut drains him (stamina -3, recovery -2).'} He starts lower in the rankings${P.belts.length ? ' and vacates his belts' : ''}.</small></button>` : '';
  const m = modal(`<h3>Weight class</h3><p class="mute">Fighting at ${DIVS[P.div].name.toLowerCase()} (${DIVS[P.div].lb}). Each division has its own rankings and champions.</p><div class="opts">${opt(P.div + 1, 'up')}${opt(P.div - 1, 'down')}</div><button class="btn ghost" data-close>Stay here</button>`);
  m.querySelector('[data-close]').onclick = closeModal;
  m.querySelectorAll('[data-div]').forEach(b => b.onclick = () => {
    const notes = changeDiv(save, +b.dataset.div); persist(); closeModal(); hub();
    if (notes) { const r = modal(`<h3>New weight class</h3>${notes.map(n => `<p class="alert">${esc(n)}</p>`).join('')}<button class="btn" data-ok>Back to the gym</button>`); r.querySelector('[data-ok]').onclick = closeModal; }
  });
};
ACT.retire = () => {
  const m = modal(`<h3>Hang up the gloves?</h3><p class="mute">This ends the career for good. The record is final.</p><div class="row"><button class="btn ghost" data-close>Not yet</button><button class="btn danger" data-go>Retire</button></div>`);
  m.querySelector('[data-close]').onclick = closeModal;
  m.querySelector('[data-go]').onclick = () => { save.player.retired = true; save.pending = null; persist(); closeModal(); retiredCard(); };
};
function retiredCard() {
  const P = save.player;
  const titles = P.history.filter(h => h.title.length && h.r === 'W').length;
  show(`<div class="screen"><div class="poster stitched col"><canvas class="portrait wide" id="pv"></canvas>
    <span class="nick">${P.nick ? `"${esc(P.nick)}"` : ''}</span><h2>${esc(P.name)}</h2>
    <div class="recbig">${rec(P.record)} <small>${P.record.ko} KO</small></div>
    <p class="mute">Retired at ${Math.floor(age(save))}. Peak rank #${P.peakRank || '-'}. ${titles} title fight wins. ${money(P.earnings)} earned.</p>
    ${P.belts.length ? `<div class="chips">${beltChips(P.belts)}</div>` : ''}</div>
    <button class="btn big ghost" data-act="toTitle">Back to menu</button></div>`, 'hub');
  Render.portrait($('#pv'), P.look, { stance: P.stance, guard: P.guard, dmg: Math.min(.5, P.wear / 200) });
}

/* ---------- offers ---------- */
let offerCache = null;
ACT.offers = () => { offerCache = genOffers(save); renderOffers(); };
function renderOffers(openI) {
  const cards = offerCache.map((o, i) => {
    const f = o.opp; const fr = o.opp.club ? 'Unranked' : '#' + (rankList(save).findIndex(e => e.id === f.id) + 1);
    return `<div class="offer stitched ${o.title.length ? 'title-fight' : ''}">
      <div class="ol">${esc(o.label)}${o.title.length ? ' ' + beltChips(o.title) : ''}</div>
      <div class="om"><canvas class="portrait sm" data-look="${i}"></canvas><div>
        <h3>${esc(f.name)}</h3>${f.nick ? `<div class="nick">"${esc(f.nick)}"</div>` : ''}
        <div class="mute">${rec(f.record)} (${f.record.ko} KO), ${fr}, OVR ${Math.round(f.rating)}, ${esc(lvOf(ready(f, save.world.div)).label)}</div>
        <div class="mute">${STYLES[f.style].label}, ${gLabel(f.guard).toLowerCase()}, ${f.stance}, age ${Math.floor(f.age)}</div></div></div>
      <p class="read"><b>Corner:</b> ${esc(cornerRead(save, oppNow(save, o)))}</p>
      ${tapeHtml(save, o, openI === i, i)}
      <div class="of"><div><span class="purse">${money(o.purse)}</span><small>${o.rounds} rounds at ${esc(VENUE_NAMES[o.venue])}</small></div><button class="btn" data-act="sign" data-i="${i}">Sign</button></div>
    </div>`;
  }).join('');
  show(`<div class="screen"><div class="topbar"><button class="link" data-act="backHub">Back</button><span class="tb-title">Fight offers</span><span class="cash">${money(save.player.money)}</span></div>
    <p class="mute">Your promoter came back with these. Pick one.</p>${cards || '<p>No offers right now.</p>'}</div>`, 'offers');
  document.querySelectorAll('canvas[data-look]').forEach(c => { const o = offerCache[+c.dataset.look]; Render.portrait(c, o.opp.look, { stance: o.opp.stance, guard: o.opp.guard, dir: -1 }); });
}
ACT.scout = d => {
  const camp = d.i === 'camp', offer = camp ? save.pending.offer : offerCache[+d.i];
  if (!scoutHim(save, offer)) return;
  persist(); const y = window.scrollY;
  if (camp) { campOpenTape = true; campScreen(); } else renderOffers(+d.i);
  window.scrollTo(0, y);
};
let campOpenTape = false;
ACT.backHub = () => hub();
ACT.sign = d => { campOpenTape = false; save.pending = { offer: offerCache[+d.i], campDone: false }; persist(); campScreen(); };

/* ---------- camp ---------- */
let plan = null;
ACT.camp = () => campScreen();
function campScreen() {
  const P = save.player; const o = save.pending.offer;
  if (!plan) plan = { gym: P.gym, focus: ['technique', 'conditioning'], intensity: 'normal', sci: false, spar: false };
  if (!plan.work) plan.work = { kind: 'spar', skill: weakSkill(P) };
  if (GYMS[plan.gym].cost > P.money) plan.gym = 0;
  const need = focusNeed(); while (plan.focus.length > need) plan.focus.pop();
  const sk = plan.learn || P.style, other = P.stance === 'southpaw' ? 'orthodox' : 'southpaw';
  const prog = P.styleFrom ? ` Still learning it: ${Math.round(P.styleFit * 100)}% (was ${STYLES[P.styleFrom].label.toLowerCase()}).` : '';
  const styleNote = plan.learn ? `New style: ${STYLES[sk].desc} One camp gets him part of the way. Fights and more camps finish the job.` : `${STYLES[sk].label}: ${STYLES[sk].desc}${prog}${campStyles(P).length < 2 ? ' His style is locked in. Beat a legend and you can learn his.' : ''}`;
  const cost = campCost(plan); const after = P.money - cost;
  show(`<div class="screen"><div class="topbar"><button class="link" data-act="backHub">Back</button><span class="tb-title">Fight camp</span><span class="cash">${money(P.money)}</span></div>
    <p class="mute">Eight weeks to get ready for ${esc(o.opp.name)} (${STYLES[o.opp.style].label.toLowerCase()}, ${gLabel(o.opp.guard).toLowerCase()}, OVR ${Math.round(o.opp.rating)}).</p>
    <p class="alert gold small"><b>Scouting:</b> ${GUARD_SCOUT[o.opp.guard] || GUARD_SCOUT.standard}</p>
    <p class="read"><b>Corner:</b> ${esc(cornerRead(save, oppNow(save, o)))}</p>
    ${tapeHtml(save, o, campOpenTape, 'camp')}
    <h4>Ring IQ work <span class="pts">pick one</span></h4><div class="opts">${campWorkHtml(P, o)}</div>
    <h4>Gym</h4><div class="opts">${GYMS.map((g, i) => `<button class="opt ${plan.gym === i ? 'on' : ''}" data-act="pgym" data-i="${i}" ${g.cost > P.money ? 'disabled' : ''}><b>${g.name}</b><span>${g.cost ? money(g.cost) + ' per camp' : 'Free'}</span><small>${g.note}</small></button>`).join('')}</div>
    <h4>Style and stance <span class="pts">a change uses a focus slot</span></h4>
    ${campStyles(P).length < 2 ? '' : `<div class="chips wrap">${campStyles(P).map(k => `<button class="chip ${sk === k ? 'on' : ''}" data-act="plearn" data-v="${k}">${STYLES[k].label}${k === P.style && !plan.learn ? ' (now)' : ''}</button>`).join('')}</div>`}
    <p class="mute small">${esc(styleNote)}</p>
    <div class="chips"><button class="chip ${plan.stance ? 'on' : ''}" data-act="pstance">Switch to ${other}</button></div>
    <p class="mute small">${plan.stance ? `He will be rusty fighting ${other} for a while: a little less accurate, a little easier to hit.` : `Fights ${P.stance}${P.stanceFit != null ? `, still getting used to it (${Math.round(P.stanceFit * 100)}%)` : ''}.`}</p>
    <h4>Focus <span class="pts">pick ${need === 2 ? 'two' : need === 1 ? 'one' : 'none'}</span></h4><div class="opts two">${Object.keys(FOCUS).map(k => `<button class="opt ${plan.focus.includes(k) ? 'on' : ''}" data-act="pfocus" data-k="${k}" ${need === 0 ? 'disabled' : ''}><b>${FOCUS[k].label}</b><small>${FOCUS[k].stats.map(s => STAT_LABEL[s]).join(', ')}</small></button>`).join('')}</div>
    <h4>Intensity</h4><div class="seg">${INTENSITY.map(i => `<button class="${plan.intensity === i.k ? 'on' : ''}" data-act="pint" data-v="${i.k}">${i.label}</button>`).join('')}</div>
    <p class="mute small">Hard camps build more but you can get hurt before fight night.</p>
    <h4>Extras</h4><div class="opts">${Object.keys(ADDONS).map(k => `<button class="opt ${plan[k] ? 'on' : ''}" data-act="padd" data-k="${k}" ${!plan[k] && ADDONS[k].cost > P.money - cost ? 'disabled' : ''}><b>${ADDONS[k].label}</b><span>${money(ADDONS[k].cost)}</span><small>${ADDONS[k].desc}</small></button>`).join('')}</div>
    <div class="sumbar"><span>Camp cost <b>${money(cost)}</b></span><span>Left after <b class="${after < 0 ? 'neg' : ''}">${money(after)}</b></span></div>
    <button class="btn big" data-act="runCamp" ${after < 0 || plan.focus.length !== need ? 'disabled' : ''}>Start camp</button></div>`, 'camp');
}
// L4d camp(): drill one skill, spar men who fight like him, or watch film on him (his habits come in as a prior, like a rematch)
const weakSkill = P => Object.keys(P.sk).sort((x, y) => P.sk[x] / P.cap[x] - P.sk[y] / P.cap[y])[0];
function campWorkHtml(P, o) {
  const w = plan.work, opt = (k, b, t) => `<button class="opt ${w.kind === k ? 'on' : ''}" data-act="pwork" data-v="${k}"><b>${b}</b><small>${t}</small></button>`;
  const lb = STYLES[o.opp.style].label.toLowerCase(), kn = Math.round(100 * ((P.know.style || {})[o.opp.style] || 0));
  return opt('drill', 'Drill a skill', 'Reps on one thing. It grows more the further he is from his talent.')
    + (w.kind === 'drill' ? `<select class="skpick" onchange="plan.work.skill=this.value">${BoxerBrain.SKILL_KEYS.map(k => `<option value="${k}"${w.skill === k ? ' selected' : ''}>${SK_LABEL[k]} (${Math.round(P.sk[k])} of ${P.cap[k]})</option>`).join('')}</select>` : '')
    + opt('spar', 'Spar a lookalike', `Partners who fight like ${/^[aeiou]/.test(lb) ? 'an' : 'a'} ${esc(lb)}, ${esc(o.opp.stance)}. He knows the look ${kn}% now; new looks fool a man.`)
    + opt('tape', 'Watch film', 'Three of his fights. Your man walks in knowing his habits. Grainier than fighting him.');
}
ACT.pwork = d => { plan.work = { kind: d.v, skill: plan.work.skill || weakSkill(save.player) }; campScreen(); };
ACT.pgym = d => { plan.gym = +d.i; campScreen(); };
ACT.pfocus = d => { const i = plan.focus.indexOf(d.k); if (i >= 0) plan.focus.splice(i, 1); else { plan.focus.push(d.k); if (plan.focus.length > focusNeed()) plan.focus.shift(); } campScreen(); };
function focusNeed() { return 2 - (plan.learn ? 1 : 0) - (plan.stance ? 1 : 0); }
ACT.plearn = d => { plan.learn = d.v === save.player.style ? null : d.v; campScreen(); };
ACT.pstance = () => { plan.stance = !plan.stance; campScreen(); };
ACT.pint = d => { plan.intensity = d.v; campScreen(); };
ACT.padd = d => { plan[d.k] = !plan[d.k]; campScreen(); };
ACT.runCamp = () => {
  show(`<div class="screen"><h2>Camp</h2><p class="mute">Eight weeks of work${plan.work.kind === 'tape' ? ', and the film room' : ''}…</p></div>`, 'camp');
  setTimeout(campDone, 60); // the film runs sims: let the screen paint first
};
function campDone() {
  const P = save.player; P.gym = plan.gym; const sk0 = Object.assign({}, P.sk);
  const r = runCamp(save, plan);
  plan.learn = null; plan.stance = false;
  if (r.injury) save.pending = null; else save.pending.campDone = true;
  persist();
  const lines = STATS.filter(k => Math.abs(r.delta[k]) >= .1).sort((a, b) => r.delta[b] - r.delta[a]).map(k => statRow(k, P.stats[k], P.pot[k], r.delta[k])).join('');
  const w = r.work, wl = !w ? '' : w.kind === 'drill' ? `<div class="stats">${skRow(P, w.skill, P.sk[w.skill] - sk0[w.skill])}</div>`
    : w.kind === 'spar' ? `<p class="mute small">Sparred the look. He knows ${STYLES[save.pending.offer.opp.style].label.toLowerCase()}s ${Math.round(100 * w.know.style)}% now, ${save.pending.offer.opp.stance}s ${Math.round(100 * w.know.stance)}%.</p>`
    : w.kind === 'tape' ? `<p class="mute small">${w.none ? 'The film was no good.' : `Watched ${w.n} of his fights. He knows his habits now.`}</p>` : '';
  const m = modal(`<h3>${r.injury ? 'Camp ended early' : 'Camp report'}</h3>${r.notes.map(n => `<p class="alert">${esc(n)}</p>`).join('')}<div class="stats">${lines}</div>${wl}
    <button class="btn ${r.injury ? '' : 'hot'}" data-ok>${r.injury ? 'Back to the gym' : 'Fight night'}</button>`);
  m.querySelector('[data-ok]').onclick = () => { closeModal(); if (r.injury) hub(); else careerFight(); };
}
ACT.fightNight = () => careerFight();
function careerFight() {
  const o = save.pending.offer;
  startFight(playerSheet(save), oppSheet(save, o), { rounds: o.rounds, venue: o.venue, cutmanA: GYMS[save.player.gym].cut, cutmanB: .45, intro: esc(TIERS[o.tier].label) + (o.title.length ? ' ' + beltChips(o.title) : '') });
}

/* ---------- results ---------- */
function resultScreen() {
  if (!F || !save.pending) return;
  Comm.stop();
  const res = F.result; const o = save.pending.offer;
  const out = applyResult(save, o, F); persist();
  const A = F.f[0], B = F.f[1]; const win = res.winner === 0, draw = res.winner == null;
  const verdict = draw ? 'Draw' : win ? 'Win' : 'Loss';
  const mName = { UD: 'Unanimous decision', SD: 'Split decision', MD: 'Majority decision' }[res.method] || res.method;
  const how = res.decision ? mName : `${mName}, round ${res.round} at ${res.time}`;
  const cards = res.cards.map((c, i) => `<div><span>${esc(F.judges[i].name)}</span><b>${c[0]}-${c[1]}</b><small>${esc(F.judges[i].taste)}</small></div>`).join('');
  const ln = out.learn ? learnLines(out.learn.d, out.learn.before, B) : [];
  const row = (l, k) => `<div class="pr"><b>${A.tot.landed[k]}/${A.tot.thrown[k]}</b><span>${l}</span><b>${B.tot.landed[k]}/${B.tot.thrown[k]}</b></div>`;
  const tl = X => X.tot.landed.jab + X.tot.landed.power + X.tot.landed.body, tt = X => X.tot.thrown.jab + X.tot.thrown.power + X.tot.thrown.body;
  const rankMove = out.rankBefore - out.rankAfter;
  Sfx.crowd(0, 1.5);
  show(`<div class="screen">
    <div class="verdict ${verdict.toLowerCase()}"><h1>${verdict}</h1><p>${esc(how)}</p><p class="mute">vs ${esc(B.sheet.name)} at ${esc(VENUE_NAMES[o.venue])}</p></div>
    ${out.notes.map(n => `<p class="alert ${/champion/.test(n) ? 'gold' : ''}">${esc(n)}</p>`).join('')}
    <div class="sumgrid"><div><small>Purse</small><b>${money(o.purse)}</b></div><div><small>Rank</small><b>#${out.rankAfter}</b><small class="${rankMove > 0 ? 'up' : rankMove < 0 ? 'down' : ''}">${rankMove > 0 ? '▲ ' + rankMove : rankMove < 0 ? '▼ ' + (-rankMove) : 'No change'}</small></div><div><small>Record</small><b>${rec(save.player.record)}</b></div></div>
    ${res.cards.some(c => c[0] + c[1] > 0) ? `<h4>Scorecards${res.decision ? '' : ' at the stoppage'}</h4><div class="cards">${cards}</div>` : ''}
    <h4>Punch stats</h4><div class="pstats"><div class="pr head"><b>${esc(A.sheet.name.split(' ').slice(-1)[0])}</b><span></span><b>${esc(B.sheet.name.split(' ').slice(-1)[0])}</b></div>
      <div class="pr"><b>${tl(A)}/${tt(A)}</b><span>Total</span><b>${tl(B)}/${tt(B)}</b></div>${row('Jabs', 'jab')}${row('Power', 'power')}${row('Body', 'body')}
      <div class="pr"><b>${A.kd}</b><span>Knocked down</span><b>${B.kd}</b></div></div>
    ${ln.length ? `<div class="learned"><h3>What he takes from this one</h3><ul>${ln.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
    <p class="mute small">Damage absorbed this fight: ${Math.round(out.taken)}. Career damage now ${Math.round(save.player.wear)}.</p>
    <button class="btn big" data-act="afterFight">Continue</button></div>`, 'result');
  F = null;
}
ACT.afterFight = () => { plan = null; hub('fighter'); };

const gameCss = document.createElement('style');
gameCss.textContent = `.modal{position:fixed;inset:0;background:rgba(10,7,5,.6);display:flex;align-items:flex-end;justify-content:center;z-index:50;padding:0 0 env(safe-area-inset-bottom,0px)}
.sheet{background:var(--bg);width:100%;max-width:560px;max-height:85vh;overflow:auto;border-radius:12px 12px 0 0;padding:20px 16px 24px}
.sheet h3{font-size:28px;margin-bottom:6px}.sheet .stats{margin:12px 0 16px}
h5.skg{margin:10px 0 2px;font-size:13px;color:var(--mute);text-transform:uppercase;letter-spacing:.06em}
.skpick{width:100%;font:inherit;padding:8px;border-radius:8px;background:#fffaf2;color:#2a2018;border:1px solid #c9bba5;margin:-2px 0 6px}`;
document.head.appendChild(gameCss);
/* ---------- boot ---------- */
titleScreen();
Store.connect();
