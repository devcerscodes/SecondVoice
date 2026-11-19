/* Second Voice — app logic. Plain JS, no build step. */
(() => {
  'use strict';
  const D = window.SV_DATA;
  const REPO = 'https://github.com/devcerscodes/SecondVoice'; // forks: keep the notice, point this at your fork

  /* ================= Utilities ================= */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = (n) => String(n).padStart(2, '0');
  const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayKey = () => keyOf(new Date());
  const parseKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (k, n) => { const d = parseKey(k); d.setDate(d.getDate() + n); return keyOf(d); };
  const diffDays = (a, b) => Math.round((parseKey(b) - parseKey(a)) / 864e5);
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const hashStr = (s) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); };
  const words = (s, base = 0) => s.split(' ').map((w, i) => `<span class="w" style="animation-delay:${base + i * 70}ms">${esc(w)}</span>`).join(' ');
  const isTyping = (el) => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
  /* A language name from a file or a setting: letters only, so it can't smuggle instructions into a prompt. */
  const langName = (v) => { const s = String(v ?? '').trim().slice(0, 30); return /^\p{L}[\p{L} ()-]{1,29}$/u.test(s) ? s : ''; };
  /* Languages the learner can pick. The English name goes into the prompts; the language's own name
     ("español") helps people find theirs. Names come from the browser, so nothing here needs translating.
     Anything missing can be typed in as "Other". */
  const LANG_CODES = ['af', 'am', 'ar', 'az', 'be', 'bg', 'bn', 'bs', 'ca', 'cs', 'cy', 'da', 'de', 'el', 'en', 'es', 'et', 'eu', 'fa', 'fi', 'fil', 'fr', 'ga', 'gl', 'gu', 'ha', 'he', 'hi', 'hr', 'hu', 'hy', 'id', 'ig', 'is', 'it', 'ja', 'jv', 'ka', 'kk', 'km', 'kn', 'ko', 'ku', 'ky', 'lo', 'lt', 'lv', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'ne', 'nl', 'no', 'pa', 'pl', 'ps', 'pt-BR', 'pt-PT', 'ro', 'ru', 'si', 'sk', 'sl', 'so', 'sq', 'sr', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'tk', 'tr', 'uk', 'ur', 'uz', 'vi', 'xh', 'yo', 'zh-Hans', 'zh-Hant', 'zu'];
  const LANGS = (() => {
    let en = null;
    try { en = new Intl.DisplayNames(['en'], { type: 'language' }); } catch { /* old browser: fallback below */ }
    const out = [];
    for (const code of en ? LANG_CODES : []) {
      const name = langName(en.of(code));
      if (!name || name === code) continue;
      let self = '';
      // Only when the browser knows that language; otherwise it answers in its own UI language ("Arnavutça").
      try { if (Intl.DisplayNames.supportedLocalesOf([code]).length) self = new Intl.DisplayNames([code], { type: 'language', fallback: 'none' }).of(code) || ''; } catch { /* no native name */ }
      out.push({ code, name, self: self && self.toLowerCase() !== name.toLowerCase() && self !== code ? self : '' });
    }
    if (out.length < 20) {
      for (const name of ['English', 'Turkish', 'Arabic', 'Chinese', 'Dutch', 'French', 'German', 'Hindi', 'Indonesian', 'Italian', 'Japanese', 'Korean', 'Persian', 'Polish', 'Portuguese', 'Russian', 'Spanish', 'Ukrainian', 'Vietnamese']) {
        if (!out.some((l) => l.name === name)) out.push({ code: '', name, self: '' });
      }
    }
    return out.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  })();
  /* The browser's language, as a guess for the first-run question. English doesn't count: they're learning it. */
  function browserLang() {
    for (const tag of navigator.languages?.length ? navigator.languages : [navigator.language || '']) {
      const base = String(tag).split('-')[0].toLowerCase();
      if (!base || base === 'en') continue;
      const code = base === 'zh' ? (/TW|HK|MO|Hant/i.test(tag) ? 'zh-Hant' : 'zh-Hans')
        : base === 'pt' ? (/-PT/i.test(tag) ? 'pt-PT' : 'pt-BR')
          : base === 'nb' || base === 'nn' ? 'no' : base === 'tl' ? 'fil' : base;
      const hit = LANGS.find((l) => l.code === code);
      if (hit) return hit.name;
    }
    return '';
  }
  /* <option>s for a language <select>. A typed-in language that isn't on the list still shows up. */
  function langOptions(selected, { english = true } = {}) {
    const list = LANGS.filter((l) => english || l.name !== 'English');
    const extra = selected && !list.some((l) => l.name === selected) ? `<option value="${esc(selected)}" selected>${esc(selected)}</option>` : '';
    return extra + list.map((l) => `<option value="${esc(l.name)}"${l.name === selected ? ' selected' : ''}>${esc(l.name)}${l.self ? ` · ${esc(l.self)}` : ''}</option>`).join('');
  }

  const I = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
    slow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    flame: '<svg class="flame" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c1 3.5 5 6 5 11a5 5 0 0 1-10 0c0-2.2 1.2-3.8 2.4-5 .2 1.6 1 2.8 2.1 3.2C11 8.6 11.3 5 12 2z"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M9 8h6"/></svg>',
    mark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    bulb: '<svg viewBox="0 0 48 48" aria-hidden="true"><g class="rays" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M24 3v4M8 10l3 3M40 10l-3 3M3 24h4M41 24h4"/></g><path d="M24 12a11 11 0 0 0-6 20.2V36h12v-3.8A11 11 0 0 0 24 12z" fill="currentColor" opacity=".18"/><path d="M24 12a11 11 0 0 0-6 20.2V36h12v-3.8A11 11 0 0 0 24 12z" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M20 40h8M21 44h6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/></svg>'
  };

  /* Illustrated portraits for the people you talk to */
  const PORTRAITS = new Set(['gp', 'landlord', 'garage', 'luggage', 'restaurant', 'bank', 'barber', 'returns',
    'party', 'meeting', 'raise', 'interview', 'witness', 'sam', 'hotel', 'transit', 'phone']);
  let avaN = 0;
  function avatar(a = {}, label = '') {
    const id = 'av' + (++avaN);
    // Painted portraits (portraits/<key>.jpg) win; the drawn template below is the fallback.
    if (PORTRAITS.has(a.portrait)) {
      return `<img class="avatar avatar-img" src="portraits/${a.portrait}.jpg" alt="${esc(label)}" width="512" height="512" decoding="async" style="background:${a.bg || '#FBE5DA'}">`;
    }
    const skin = a.skin || '#D9A47C', hc = a.hairColor || '#2B2118', shirt = a.shirt || '#E0501A', bg = a.bg || '#FBE5DA';
    const hair = {
      short: `<path d="M53 70c-2-22 12-36 27-36s30 12 27 36c-5-10-14-15-27-15s-22 5-27 15z" fill="${hc}"/>`,
      long: `<path d="M50 72c0-25 13-38 30-38s30 13 30 38v40c-5 4-10 4-14 0V76c-5-8-10-12-16-12s-11 4-16 12v36c-4 4-9 4-14 0z" fill="${hc}"/>`,
      bun: `<circle cx="80" cy="33" r="11" fill="${hc}"/><path d="M53 72c-2-22 12-34 27-34s29 12 27 34c-7-11-16-16-27-16s-20 5-27 16z" fill="${hc}"/>`,
      curly: `<g fill="${hc}"><circle cx="59" cy="58" r="11"/><circle cx="70" cy="47" r="12"/><circle cx="86" cy="45" r="12"/><circle cx="100" cy="55" r="11"/><circle cx="104" cy="69" r="8"/><circle cx="56" cy="71" r="8"/></g>`,
      bald: `<path d="M57 62c4-13 13-20 23-20s19 7 23 20" fill="none" stroke="${hc}" stroke-width="3" opacity=".3"/>`,
      cap: `<path d="M52 64c0-18 13-30 28-30s28 12 28 30z" fill="#1F2A44"/><rect x="47" y="60" width="66" height="8" rx="3" fill="#111827"/><path d="M48 60h64" stroke="#D8DEE9" stroke-width="2" stroke-dasharray="4 3"/><rect x="74" y="42" width="12" height="11" rx="2" fill="#E8C547"/>`
    }[a.hair || 'short'];
    const acc = {
      stethoscope: '<path d="M62 122c0 20 8 28 18 28s18-8 18-28" stroke="#C9CED6" stroke-width="3.5" fill="none"/><circle cx="80" cy="150" r="6" fill="#C9CED6"/>',
      tie: '<path d="M76 118h8l-2 6 5 22-7 7-7-7 5-22z" fill="#1F2A44"/>',
      lanyard: '<path d="M64 118l16 26 16-26" stroke="#0E7468" stroke-width="3" fill="none"/><rect x="71" y="142" width="18" height="13" rx="2" fill="#fff"/><rect x="74" y="146" width="12" height="2" fill="#9AA3AE"/>',
      apron: '<path d="M62 126h36v40H62z" fill="#F5F5F0"/><path d="M62 126l-6-8M98 126l6-8" stroke="#F5F5F0" stroke-width="3"/>',
      headset: '<path d="M54 74c0-19 12-31 26-31s26 12 26 31" stroke="#222" stroke-width="3.5" fill="none"/><rect x="48" y="70" width="9" height="15" rx="3" fill="#222"/><path d="M53 84q4 15 20 13" stroke="#222" stroke-width="2.5" fill="none"/><circle cx="74" cy="97" r="2.5" fill="#222"/>',
      wrench: '<g transform="translate(108 128) rotate(28)"><rect x="-3.5" y="2" width="7" height="26" rx="2" fill="#9AA3AE"/><path d="M-8 -2a8 8 0 1 0 16 0l-4 4h-8z" fill="#9AA3AE"/></g>',
      scissors: '<g transform="translate(106 134) rotate(-20)" stroke="#C9CED6" stroke-width="3" fill="none"><circle cx="-5" cy="14" r="4"/><circle cx="5" cy="14" r="4"/><path d="M-3 10L4-8M3 10L-4-8"/></g>',
      glass: '<g transform="translate(108 120)"><path d="M-8 0h16l-3 14h-10z" fill="#F7D774" opacity=".9"/><path d="M-8 0h16l-3 14h-10z" fill="none" stroke="#fff" stroke-width="1.5"/><path d="M0 14v10M-5 24h10" stroke="#fff" stroke-width="2"/></g>',
      mug: '<g transform="translate(106 124)"><rect x="-8" y="0" width="16" height="18" rx="3" fill="#F5F5F0"/><path d="M8 4h3a4 4 0 0 1 0 8H8" fill="none" stroke="#F5F5F0" stroke-width="2.5"/><path class="steam" d="M-3-4q3-4 0-8M3-4q3-4 0-8" stroke="#fff" stroke-width="1.6" fill="none" opacity=".7"/></g>',
      phone: '<g transform="translate(104 98) rotate(12)"><rect x="-5" y="-12" width="11" height="22" rx="3" fill="#1F2937"/><rect x="-3" y="-9" width="7" height="14" rx="1" fill="#60A5FA" opacity=".8"/></g>',
      vest: '<path d="M44 166l10-40 26 16 26-16 10 40z" fill="#F2E34B"/><path d="M50 150h60" stroke="#D1D5DB" stroke-width="5"/><rect x="72" y="128" width="16" height="6" rx="1" fill="#1F2A44"/>'
    }[a.acc] || '';
    return `<svg class="avatar" viewBox="0 0 160 160" role="img" aria-label="${esc(label)}">
      <defs><clipPath id="${id}"><circle cx="80" cy="80" r="80"/></clipPath></defs>
      <g clip-path="url(#${id})">
        <circle cx="80" cy="80" r="80" fill="${bg}"/>
        <circle class="halo" cx="80" cy="80" r="62" fill="#fff" opacity=".35"/>
        ${a.hair === 'long' ? hair : ''}
        <path d="M30 168c4-32 24-48 50-48s46 16 50 48z" fill="${shirt}"/>
        <rect x="72" y="98" width="16" height="22" rx="6" fill="${skin}"/>
        <path d="M70 118l10 10 10-10" fill="none" stroke="rgba(0,0,0,.15)" stroke-width="2"/>
        <circle cx="54" cy="77" r="5.5" fill="${skin}"/><circle cx="106" cy="77" r="5.5" fill="${skin}"/>
        <ellipse cx="80" cy="76" rx="26" ry="28" fill="${skin}"/>
        ${a.hair !== 'long' ? hair : ''}
        <g class="eyes" fill="#1B1B1B"><circle cx="70" cy="77" r="2.8"/><circle cx="90" cy="77" r="2.8"/></g>
        <path d="M65 70q5-3 10 0M85 70q5-3 10 0" stroke="${hc}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".8"/>
        <circle cx="64" cy="86" r="4" fill="#E87B6B" opacity=".25"/><circle cx="96" cy="86" r="4" fill="#E87B6B" opacity=".25"/>
        <ellipse class="mouth" cx="80" cy="91" rx="6" ry="2.4" fill="#7A3B2A"/>
        ${acc}
      </g>
    </svg>`;
  }

  /* ================= State ================= */
  const LS = 'second-voice:v1';
  const TALKS_MAX = 40; // saved role-play conversations, newest first
  const fresh = () => ({
    v: 1, name: '', start: todayKey(), rate: 1, rateV: 2, voice: '', autoSpeak: true, lang: '', native: '',
    neural: false, nvVoice: '', handsFree: true, talks: [],
    days: {}, goals: {}, cards: {}, custom: [], scenesDone: {}, trapBest: 0,
    lexicon: [], lexUpdated: 0, quizBest: 0,
    stats: { spoken: 0, reviewed: 0, shadowed: 0, pairs: 0, traps: 0, written: 0, scenes: 0, lookups: 0, quizzed: 0 },
    updated: 0
  });
  function normalize(s) {
    const o = Object.assign(fresh(), s || {});
    o.stats = Object.assign(fresh().stats, o.stats || {});
    for (const k of ['days', 'goals', 'cards', 'scenesDone']) if (!o[k] || typeof o[k] !== 'object' || Array.isArray(o[k])) o[k] = {};
    if (!Array.isArray(o.custom)) o.custom = [];
    if (!Array.isArray(o.lexicon)) o.lexicon = [];
    if (!Array.isArray(o.talks)) o.talks = [];
    o.talks = o.talks.filter((t) => t && typeof t.id === 'string' && Array.isArray(t.msgs)).slice(0, TALKS_MAX);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(o.start)) o.start = todayKey();
    o.lang = langName(o.lang); o.native = langName(o.native);
    // The old default (0.95) sounded a touch slow; move untouched defaults to natural speed once.
    if (s && !s.rateV && +s.rate === 0.95) o.rate = 1;
    o.rateV = 2;
    o.rate = Math.min(1.2, Math.max(0.6, +o.rate || 1));
    return o;
  }
  function readLocal() { try { const r = localStorage.getItem(LS); return r ? JSON.parse(r) : null; } catch { return null; } }
  function writeLocal() { try { localStorage.setItem(LS, JSON.stringify(S)); } catch { /* storage unavailable */ } }
  let S = normalize(readLocal());
  function save() {
    S.updated = Date.now();
    const keys = Object.keys(S.days).sort();
    while (keys.length > 240) delete S.days[keys.shift()];
    writeLocal();
    Cloud.queue();
  }
  function saveLex() { S.lexUpdated = Date.now(); Cloud.lexDirty = true; save(); }

  /* Per-person state in the artifact's db, when the page runs on claude.ai.
     The word collection lives in its own document so it can grow. */
  const Cloud = {
    ref: null, lexRef: null, lexDirty: false, busy: false, again: false, t: 0, state: 'local', who: '',
    async init() {
      if (!window.claude?.use) { this.set('local'); return; }
      try {
        const [db, user] = await Promise.all([claude.use('db'), claude.use('user')]);
        // The signed-in name, shown on Connect. "" unless the page declares the user "profile" scope.
        user?.me().then((m) => { this.who = str(m?.name, 80); refreshConnect(); }, () => {});
        if (!db || !user) { this.set('local'); return; }
        const id = await user.id();
        if (!id) { this.set('local'); return; }
        this.ref = db.doc(`data/users/${id}/state`);
        this.lexRef = db.doc(`data/users/${id}/lexicon`);
        const [snap, lsnap] = await Promise.race([
          Promise.all([this.ref.get(), this.lexRef.get()]),
          new Promise((_, rej) => setTimeout(() => rej({ code: 'timeout' }), 10000))
        ]);
        let changed = false;
        if (snap.exists) {
          const remote = snap.data() || {};
          if ((remote.updated || 0) > (S.updated || 0)) {
            const lex = S.lexicon, lu = S.lexUpdated;
            S = normalize(JSON.parse(JSON.stringify(remote)));
            S.lexicon = lex; S.lexUpdated = lu; changed = true;
          } else if ((S.updated || 0) > (remote.updated || 0)) this.queue();
        } else if (S.updated) this.queue();
        if (lsnap.exists) {
          const rl = lsnap.data() || {};
          if ((rl.updated || 0) > (S.lexUpdated || 0) && Array.isArray(rl.items)) { S.lexicon = JSON.parse(JSON.stringify(rl.items)); S.lexUpdated = rl.updated; changed = true; }
          else if ((S.lexUpdated || 0) > (rl.updated || 0)) { this.lexDirty = true; this.queue(); }
        } else if (S.lexicon.length) { this.lexDirty = true; this.queue(); }
        if (changed) { writeLocal(); rerender(); }
        if (Lang.known()) Setup.close(); // answered on another device
        this.set('cloud');
      } catch (e) {
        this.ref = this.lexRef = null;
        this.set(e?.code === 'timeout' ? 'offline' : 'local');
      }
    },
    queue() { if (!this.ref) return; clearTimeout(this.t); this.t = setTimeout(() => this.flush(), 1500); },
    async flush() {
      if (!this.ref) return;
      if (this.busy) { this.again = true; return; }
      this.busy = true;
      try {
        const { lexicon, ...rest } = S;
        await this.ref.set(JSON.parse(JSON.stringify(rest)));
        if (this.lexDirty && this.lexRef) {
          const mark = S.lexUpdated;
          await this.lexRef.set({ items: JSON.parse(JSON.stringify(lexicon)), updated: mark || Date.now() });
          if (S.lexUpdated === mark) this.lexDirty = false;
        }
        this.set('cloud');
      }
      catch (e) {
        const c = e?.code;
        if (['invalid_argument', 'revoked', 'not_granted', 'capability_disabled', 'capability_removed'].includes(c)) { this.ref = this.lexRef = null; this.set('local'); }
        else if (c === 'quota_exceeded') toast('Cloud storage is full. Your progress is still saved on this device.');
        else this.set('offline');
      } finally {
        this.busy = false;
        if (this.again) { this.again = false; this.flush(); }
      }
    },
    set(s) {
      this.state = s;
      const map = { local: ['', 'Saved on this device'], cloud: ['on', 'Synced to your account'], offline: ['warn', 'Sync paused, saved locally'] };
      const [c, t] = map[s];
      const p = $('#sync-pill'); if (p) p.innerHTML = `<span class="dot ${c}"></span><span>${t}</span>`;
      refreshConnect();
    }
  };

  /* ================= Coach files =================
     The coach (the learner's own AI agent, see AGENTS.md) keeps its memory in learner/*.json.
     When the app is served from this folder it reads those files. It never writes them. */
  const L = {
    state: 'none', profile: null, brain: null, backlog: null, err: '', sig: '',
    local: location.protocol !== 'file:' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname),
    async get(f) {
      const r = await fetch(`learner/${f}.json`, { cache: 'no-store' });
      // A host without these files may answer with an HTML page; only JSON counts.
      if (!r.ok || !/json/i.test(r.headers.get('content-type') || '')) return null;
      const txt = await r.text();
      try { return { txt, data: JSON.parse(txt) }; } catch { throw Object.assign(new Error('bad'), { file: f + '.json' }); }
    },
    /* Returns true when something changed since the last load. */
    async load() {
      let next;
      if (location.protocol === 'file:') next = { state: 'none' };
      else {
        try {
          const [p, b, q] = await Promise.all(['profile', 'brain', 'backlog'].map((f) => this.get(f)));
          next = (p || b || q)
            ? { state: 'ok', profile: p?.data || {}, brain: b?.data || {}, backlog: q?.data || {}, raw: [p, b, q].map((x) => x?.txt || '').join('\u0000') }
            : { state: 'none' };
        } catch (e) { next = e?.file ? { state: 'bad', err: e.file } : { state: 'none' }; }
      }
      const sig = next.state + '|' + (next.raw || next.err || '');
      if (sig === this.sig) return false;
      Object.assign(this, { profile: null, brain: null, backlog: null, err: '' }, next, { sig });
      delete this.raw;
      this.pill();
      return true;
    },
    /* Called when the learner comes back to the tab: the agent may have updated the files. */
    async refresh() {
      if (!(await this.load())) return;
      if (['today', 'plan', 'connect'].includes(current)) R[current]();
      updateChrome();
    },
    on() { return this.state === 'ok'; },
    /* The coach writes its own name into brain.coach (see coach/brain.md). The page can't detect it otherwise. */
    agent() {
      const c = this.brain?.coach;
      return { name: str(c?.agent, 40), seen: /^\d{4}-\d{2}-\d{2}$/.test(String(c?.last_seen || '')) ? c.last_seen : '' };
    },
    pill() {
      const p = $('#coach-pill'); if (!p) return;
      p.hidden = !this.local && !this.on();
      const up = ageLabel(this.brain?.updated || this.backlog?.updated), who = this.agent().name;
      const [c, t] = this.on() ? ['on', `${who ? 'Coach: ' + who : 'Coach files loaded'}${up ? ' · ' + up : ''}`] : this.state === 'bad' ? ['warn', `Coach: can't read ${this.err}`] : ['', 'Coach: not set up yet'];
      p.innerHTML = `<span class="dot ${c}"></span><span>${esc(t)}</span>`;
    }
  };
  function ageLabel(k) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(k || ''))) return '';
    const n = diffDays(k, todayKey());
    return n <= 0 ? 'updated today' : n === 1 ? 'updated yesterday' : `updated ${n} days ago`;
  }
  const coachWeek = () => { const w = Math.floor(+L.profile?.plan_week); return L.on() && w >= 1 ? Math.min(12, w) : 0; };

  /* ================= Derived ================= */
  const weekOf = (k) => (k === todayKey() && coachWeek()) || Math.min(12, Math.max(1, Math.floor(diffDays(S.start, k) / 7) + 1));
  const weekNow = () => weekOf(todayKey());
  const phaseOf = (w) => D.phases.find((p) => p.weeks.includes(w));
  const day = (k = todayKey()) => (S.days[k] ||= { xp: 0, tasks: {}, newSeen: 0 });
  const xpOf = (k) => S.days[k]?.xp || 0;
  function streak() {
    let k = todayKey(), n = 0;
    if (!xpOf(k)) k = addDays(k, -1);
    while (xpOf(k) > 0) { n++; k = addDays(k, -1); }
    return n;
  }
  const totalXP = () => Object.values(S.days).reduce((a, d) => a + (d.xp || 0), 0);

  /* Vault: Leitner boxes with growing gaps (days) */
  const GAPS = [0, 1, 3, 7, 16, 35, 80];
  const NEW_PER_DAY = 10;
  const allCards = () => [...D.deck, ...S.custom];
  function dueCards() {
    const t = todayKey(), due = [], unseen = [];
    for (const c of allCards()) {
      const st = S.cards[c.id];
      if (!st) unseen.push(c); else if (st.due <= t) due.push(c);
    }
    const left = Math.max(0, NEW_PER_DAY - (S.days[t]?.newSeen || 0));
    return due.concat(unseen.slice(0, left));
  }
  function nextState(c, r) {
    const t = todayKey();
    const st = { ...(S.cards[c.id] || { box: 0, due: t, n: 0, lapses: 0 }) };
    if (r === 1) { st.box = 0; st.lapses++; st.due = t; }
    else if (r === 2) { st.box = Math.max(1, st.box); st.due = addDays(t, Math.max(1, Math.round(GAPS[st.box] / 2))); }
    else if (r === 3) { st.box = Math.min(6, st.box + 1); st.due = addDays(t, GAPS[st.box]); }
    else { st.box = Math.min(6, st.box + 2); st.due = addDays(t, GAPS[st.box]); }
    st.n++;
    return st;
  }
  const gapLabel = (c, r) => { const d = diffDays(todayKey(), nextState(c, r).due); return d === 0 ? 'now' : d === 1 ? '1 day' : d + ' days'; };
  function addToVault(en, tr = '', ex = '', tag = 'mine') {
    en = String(en || '').trim();
    if (!en) return false;
    if (allCards().some((c) => c.en.toLowerCase() === en.toLowerCase())) { toast('Already in your Vault.'); return false; }
    S.custom.push({ id: 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), en, tr: String(tr || ''), ex: String(ex || ''), tag });
    save();
    toast('Added to your Vault.');
    updateChrome();
    return true;
  }

  /* ================= Audio ================= */
  /* Natural neural voices: Kokoro-82M in a worker (voice-worker.js). Off until the learner
     downloads it once (about 330 MB with a GPU, 90 MB without; then cached by the browser);
     system voices are the fallback. */
  const CAST_VOICE = {
    gp: 'bf_emma', landlord: 'bm_george', garage: 'am_puck', luggage: 'bf_alice', restaurant: 'am_michael',
    bank: 'af_sarah', barber: 'af_bella', returns: 'bm_fable', party: 'bf_isabella', meeting: 'af_heart',
    raise: 'bm_daniel', interview: 'af_kore', witness: 'bm_lewis', sam: 'af_river', hotel: 'af_nova',
    transit: 'am_eric', phone: 'bf_lily'
  };
  const NV_PICKS = [['af_heart', 'Heart · American'], ['af_bella', 'Bella · American'], ['am_michael', 'Michael · American'],
    ['bf_emma', 'Emma · British'], ['bf_isabella', 'Isabella · British'], ['bm_george', 'George · British'], ['bm_fable', 'Fable · British']];
  const NV = {
    w: null, state: 'off', pct: 0, seq: 0, wait: new Map(), ctx: null, src: null, token: 0, timers: [],
    start() {
      if (this.w || !window.Worker) return;
      this.state = 'loading'; this.pct = 0; this.paint();
      try { this.w = new Worker('voice-worker.js', { type: 'module' }); }
      catch { this.fail(); return; }
      this.w.onmessage = (e) => {
        const m = e.data || {};
        if (m.type === 'progress' && m.total) { this.pct = Math.round((m.loaded / m.total) * 100); this.paint(); }
        else if (m.type === 'ready') { this.state = 'ready'; this.paint(); if (S.neural !== true) { S.neural = true; save(); } }
        else if (m.type === 'error') this.fail(m.message);
        else if (m.type === 'note') console.warn('[voices]', m.message);
        else if (m.type === 'audio') { const p = this.wait.get(m.id); if (!p) return; this.wait.delete(m.id); m.error ? p.rej(new Error(m.error)) : p.res(m); }
      };
      this.w.onerror = () => this.fail();
      this.w.postMessage({ type: 'load', gpu: true });
    },
    fail(msg) {
      try { this.w?.terminate(); } catch { /* gone */ }
      this.w = null; this.state = 'error'; this.paint();
      this.wait.forEach((p) => p.rej(new Error('voice engine stopped'))); this.wait.clear();
      if (msg) console.warn('[voices]', msg);
    },
    ready() { return this.state === 'ready'; },
    gen(text, voice, speed) {
      return new Promise((res, rej) => { const id = ++this.seq; this.wait.set(id, { res, rej }); this.w.postMessage({ type: 'speak', id, text, voice, speed }); });
    },
    fallbackVoice() { return S.nvVoice || (String(L.profile?.variant || '').toLowerCase().startsWith('amer') ? 'af_heart' : 'bf_emma'); },
    halt() { this.token++; this.timers.forEach(clearTimeout); this.timers = []; try { this.src?.stop(); } catch { /* not playing */ } this.src = null; },
    /* Speaks sentence by sentence: the next one is generated while the current one plays. */
    play(text, o, onStart, onEnd) {
      this.halt();
      const my = this.token;
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.ctx.resume?.();
      const parts = [...text.matchAll(/[^.!?…]+[.!?…]+["')\]]*\s*|[^.!?…]+$/g)].map((m) => ({ s: m[0], at: m.index })).filter((p) => p.s.trim());
      if (!parts.length) { onEnd(); return; }
      const voice = o.voice || this.fallbackVoice(), speed = o.rate ?? S.rate;
      const jobs = [];
      const job = (k) => (jobs[k] ||= this.gen(parts[k].s.trim(), voice, speed));
      let k = 0, started = false;
      const next = async () => {
        if (my !== this.token) return;
        if (k >= parts.length) { onEnd(); return; }
        let r;
        try { r = await job(k); } catch { if (my === this.token) { started ? onEnd() : o.fallback?.(); } return; }
        if (my !== this.token) return;
        if (k + 1 < parts.length) job(k + 1);
        if (!started) { started = true; onStart(); }
        const buf = this.ctx.createBuffer(1, r.pcm.length, r.sr);
        buf.copyToChannel(r.pcm, 0);
        const src = this.ctx.createBufferSource();
        src.buffer = buf; src.connect(this.ctx.destination); this.src = src;
        if (o.onWord) {
          const p = parts[k], starts = [...p.s.matchAll(/\S+/g)].map((m) => p.at + m.index);
          const per = (buf.duration * 1000) / Math.max(1, starts.length);
          starts.forEach((c, i) => this.timers.push(setTimeout(() => { if (my === this.token) o.onWord(c); }, i * per)));
        }
        src.onended = () => { if (my !== this.token) return; k++; next(); };
        src.start();
      };
      next();
    },
    paint() {
      $$('[data-nv]').forEach((el) => { el.innerHTML = nvStatus(); });
    }
  };
  const voiceFor = (sc) => CAST_VOICE[sc?.ava?.portrait] || '';
  function nvStatus() {
    if (NV.state === 'ready') return `${I.check}<span>Natural voices on</span>`;
    if (NV.state === 'loading') return `<span class="nv-spin" aria-hidden="true"></span><span>Downloading natural voices… ${NV.pct}%</span>`;
    if (NV.state === 'error') return `${I.warn}<span>Natural voices could not load. Using system voices.</span> <button class="btn sm" data-act="nv-start">Try again</button>`;
    return `<button class="btn sm" data-act="nv-start">${I.spark} Natural voices</button><span class="muted">One-time download, about ${navigator.gpu ? '330' : '90'} MB</span>`;
  }

  const NOVELTY = /^(Albert|Bahh|Bells|Boing|Bubbles|Cellos|Deranged|Eddy|Flo|Fred|Good News|Bad News|İyi Haber|Kötü Haber|Grandma|Grandpa|Hysterical|Jester|Junior|Kathy|Organ|Pipe Organ|Org|Princess|Ralph|Reed|Rocko|Sandy|Shelley|Superstar|Trinoids|Whisper|Wobble|Zarvox)\b/i;
  const GOOD_COMPACT = /^(Samantha|Daniel|Karen|Moira|Tessa|Serena|Ava|Allison|Zoe|Evan|Tom|Susan|Nathan|Joelle|Noelle|Jamie|Kate|Oliver|Martha|Arthur|Catherine|Gordon|Fiona|Rishi|Nicky|Aaron)\b/i;
  const TTS = {
    ok: 'speechSynthesis' in window, voices: [],
    init() {
      if (!this.ok) return;
      const load = () => {
        this.voices = speechSynthesis.getVoices().filter((v) => /^en([-_]|$)/i.test(v.lang));
        if (current === 'prefs') fillVoices();
      };
      load();
      speechSynthesis.addEventListener?.('voiceschanged', load);
    },
    /* How natural a voice sounds. Neural and premium voices first; joke and
       robotic voices (Zarvox, Bubbles, the old Eloquence set) never get picked. */
    score(v) {
      const n = v.name;
      if (NOVELTY.test(n)) return -1;
      let s = 30;
      if (/\bNatural\b/i.test(n)) s = 100;                       // Edge / Windows neural voices
      else if (/Premium/i.test(n)) s = 95;                       // macOS / iOS downloadable voices
      else if (/Enhanced|Neural|Siri/i.test(n)) s = 85;
      else if (/^Google (US|UK) English/i.test(n)) s = 70;      // Chrome's network voices
      else if (GOOD_COMPACT.test(n)) s = 50;
      const variant = String(L.profile?.variant || '').toLowerCase();
      const want = variant.startsWith('brit') ? /en[-_]GB/i : variant.startsWith('amer') ? /en[-_]US/i : null;
      if (want ? want.test(v.lang) : /en[-_](US|GB)/i.test(v.lang)) s += 8;
      return s;
    },
    natural(v) { return !!v && this.score(v) >= 80; },
    ranked() { return this.voices.filter((v) => this.score(v) >= 0).sort((a, b) => this.score(b) - this.score(a) || a.name.localeCompare(b.name)); },
    voice() {
      const vs = this.voices;
      if (!vs.length) return null;
      if (S.voice) { const v = vs.find((x) => x.name === S.voice); if (v) return v; }
      return this.ranked()[0] || vs[0];
    },
    speak(text, o = {}) {
      if (NV.ready() && !o.system) {
        if (this.ok) speechSynthesis.cancel();
        const end = () => { Wave.calm(); document.body.classList.remove('tts-on'); o.onEnd?.(); };
        NV.play(text, { ...o, fallback: () => this.speak(text, { ...o, system: true }) },
          () => { Wave.kick(); document.body.classList.add('tts-on'); o.onStart?.(); }, end);
        return;
      }
      if (!this.ok) { toast('This browser has no speech engine. Chrome or Safari will read the lines aloud.'); o.onEnd?.(); return; }
      const u = new SpeechSynthesisUtterance(text);
      const v = this.voice();
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-US';
      u.rate = o.rate ?? S.rate;
      let bounded = false, timer = 0, lead = 0;
      u.onboundary = (e) => { if (e.name && e.name !== 'word') return; bounded = true; clearInterval(timer); o.onWord?.(e.charIndex); };
      u.onstart = () => {
        Wave.kick();
        document.body.classList.add('tts-on');
        o.onStart?.();
        if (!o.onWord) return;
        // Some voices never fire word boundaries: estimate the timing instead.
        const starts = [...text.matchAll(/\S+/g)].map((m) => m.index);
        const per = 60000 / (170 * u.rate);
        let i = 0;
        lead = setTimeout(() => {
          if (bounded) return;
          o.onWord(starts[0]);
          timer = setInterval(() => {
            if (bounded || ++i >= starts.length) { clearInterval(timer); return; }
            o.onWord(starts[i]);
          }, per);
        }, 280);
      };
      const end = () => { clearTimeout(lead); clearInterval(timer); Wave.calm(); document.body.classList.remove('tts-on'); o.onEnd?.(); };
      u.onend = end; u.onerror = end;
      // Chrome drops an utterance queued right after cancel(), so give it a beat.
      if (speechSynthesis.speaking || speechSynthesis.pending) { speechSynthesis.cancel(); setTimeout(() => speechSynthesis.speak(u), 80); }
      else speechSynthesis.speak(u);
    },
    stop() {
      NV.halt();
      if (this.ok) speechSynthesis.cancel();
      Wave.calm(); document.body.classList.remove('tts-on');
    }
  };

  /* Plays a list of lines one after another; any other playback cancels it */
  let queueId = 0;
  function playQueue(items) {
    const my = ++queueId;
    let i = 0;
    const next = () => {
      $$('.pb-row.now').forEach((r) => r.classList.remove('now'));
      if (my !== queueId || i >= items.length) return;
      const it = items[i++];
      if (it.el) { it.el.classList.add('now'); it.el.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' }); }
      TTS.speak(it.text, { onEnd: () => setTimeout(next, 650) });
    };
    next();
  }

  function kara(text) {
    let html = '', last = 0;
    for (const m of text.matchAll(/\S+/g)) {
      html += esc(text.slice(last, m.index)) + `<span class="kw" data-c="${m.index}">${esc(m[0])}</span>`;
      last = m.index + m[0].length;
    }
    return html + esc(text.slice(last));
  }
  function sayKaraoke(box, text, rate) {
    const ws = $$('.kw', box);
    const clear = () => { box.classList.remove('playing'); ws.forEach((w) => w.classList.remove('done', 'now')); };
    clear();
    box.classList.add('playing');
    TTS.speak(text, {
      rate,
      onWord: (ci) => {
        let now = -1;
        ws.forEach((w, i) => { if (+w.dataset.c <= ci) now = i; });
        ws.forEach((w, i) => { w.classList.toggle('done', i < now); w.classList.toggle('now', i === now); });
      },
      onEnd: clear
    });
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let micBlocked = false;
  const dictationHint = () => toast('The microphone is blocked inside this page. Use dictation instead: press Fn twice on a Mac, or tap the mic on your phone keyboard, then speak into the text box.', 8000);
  /* patient: keep listening through short thinking pauses (learners pause mid-sentence) and
     end the turn after SILENCE_MS of quiet once something was said. */
  const SILENCE_MS = 1800;
  const Mic = {
    rec: null, aborted: false,
    start(btn, onText, onDone, o = {}) {
      if (this.rec) { this.stop(); return; }
      if (!SR || micBlocked) { dictationHint(); $('#say-input, #wr-text, #cue-notes, #nat-in')?.focus(); return; }
      const r = new SR();
      const variant = String(L.profile?.variant || '').toLowerCase();
      r.lang = variant.startsWith('brit') ? 'en-GB' : 'en-US'; r.interimResults = true; r.continuous = !!o.patient;
      let fin = '', last = '', quiet = 0, cap = 0;
      this.aborted = false;
      r.onresult = (e) => {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) fin += (fin && !/\s$/.test(fin) && !/^\s/.test(t) ? ' ' : '') + t; else interim += t;
        }
        last = (fin + ' ' + interim).replace(/\s+/g, ' ').trim();
        onText?.(last);
        if (o.patient) { clearTimeout(quiet); quiet = setTimeout(() => this.stop(), SILENCE_MS); }
      };
      r.onerror = (e) => { if (['not-allowed', 'service-not-allowed', 'audio-capture', 'network'].includes(e.error)) { micBlocked = true; dictationHint(); } };
      r.onend = () => {
        clearTimeout(quiet); clearTimeout(cap);
        this.rec = null; btn?.classList.remove('live'); onAir(false);
        if (!this.aborted) onDone?.((fin.trim() || last).trim());
      };
      try {
        r.start(); this.rec = r; btn?.classList.add('live'); onAir(true);
        if (o.patient) cap = setTimeout(() => this.stop(), 60000); // one turn is at most a minute
      } catch { micBlocked = true; dictationHint(); }
    },
    stop() { try { this.rec?.stop(); } catch { /* already stopped */ } },
    abort() { if (!this.rec) return; this.aborted = true; try { this.rec.abort(); } catch { /* already stopped */ } }
  };
  const onAir = (on) => $$('.onair').forEach((x) => x.classList.toggle('live', on));

  /* ================= AI coach ================= */
  /* Two ways in: on claude.ai the page's own AI; on localhost the learner's agent, through server.js. */
  const AI = {
    s: null, state: 'pending', via: null,
    init() {
      if (window.claude?.use) {
        claude.use('sample').then((s) => { this.s = s; this.set(s ? 'on' : 'off'); }).catch(() => this.set('off'));
      } else if (L.local) {
        fetch('/api/agent', { cache: 'no-store', headers: { 'X-Second-Voice': '1' } })
          .then((r) => (r.ok ? r.json() : null))
          .then((j) => { if (j?.agent) { this.via = j; this.s = localAgent; this.set('on'); } else this.set('off'); })
          .catch(() => this.set('off'));
      } else { this.set('off'); return; }
      setTimeout(() => { if (this.state === 'pending') this.set('off'); }, 11000);
    },
    set(st) {
      const changed = this.state !== st;
      this.state = st;
      const map = { pending: ['', 'AI coach: connecting…'], on: ['on', this.via ? `AI coach: ${this.via.name}` : 'AI coach ready'], off: ['warn', 'AI coach offline'] };
      const [c, t] = map[st];
      const p = $('#ai-pill'); if (p) p.innerHTML = `<span class="dot ${c}"></span><span>${t}</span>`;
      if (changed && ['speak', 'write', 'words', 'prefs', 'lab', 'connect'].includes(current)) rerender();
      if (changed) { Tx.status(); if (st === 'on') Tx.pump(); }
      if (changed && st === 'on' && U.speak.scen && U.speak.stage === 'chat' && !U.speak.msgs.length && !U.speak.busy) aiTurn();
      if (changed && st === 'on' && U.speak.scen?.needsBrief && !U.speak.briefBusy) makeBrief(U.speak.scen);
    },
    async ask(input, tier = 'default') {
      if (!this.s) throw Object.assign(new Error('off'), { code: 'off' });
      const r = await this.s(input, { cache: false, modelTier: tier });
      return parseJSON(r?.text);
    }
  };
  /* A CLI takes one prompt, so a chat (the role-play sends [{role, content}…]) becomes one transcript. */
  function flatPrompt(input) {
    if (!Array.isArray(input)) return String(input);
    const text = (c) => (typeof c === 'string' ? c : Array.isArray(c) ? c.map((b) => b?.text || '').join('') : String(c ?? ''));
    return input.map((m) => `[${m.role === 'assistant' ? 'YOU' : 'USER'}]\n${text(m.content)}`).join('\n\n')
      + '\n\n[YOU]\nWrite your next message now, following the first USER message\'s instructions and format.';
  }
  /* Same shape as claude.ai's sample(): a prompt or a chat in, { text } out. server.js runs the agent's CLI. */
  async function localAgent(input, o = {}) {
    let r;
    try {
      r = await fetch('/api/ask', {
        method: 'POST', cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'X-Second-Voice': '1' },
        body: JSON.stringify({ prompt: flatPrompt(input), tier: o.modelTier || 'default' })
      });
    } catch { throw Object.assign(new Error('down'), { code: 'agent_down' }); }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(j.error || 'agent'), { code: j.code || 'agent_failed', detail: j.error || '' });
    return { text: j.text };
  }
  function parseJSON(t) {
    t = String(t || '').replace(/```(?:json)?/gi, '');
    const a = t.indexOf('{'), b = t.lastIndexOf('}');
    if (a < 0 || b < a) throw Object.assign(new Error('parse'), { code: 'parse' });
    try { return JSON.parse(t.slice(a, b + 1)); } catch { throw Object.assign(new Error('parse'), { code: 'parse' }); }
  }
  function aiError(e) {
    const c = e?.code;
    if (c === 'off' || c === 'no_agent') { if (c === 'no_agent') AI.set('off'); toast(L.local ? 'No AI agent found. Install Claude Code, Codex or Gemini CLI, then restart npm run dev.' : 'The AI coach works when this page is open on claude.ai.', 5000); }
    else if (c === 'agent_down') toast('The local server is not running. Start it again with npm run dev.', 5000);
    else if (c === 'timeout') toast('Your agent took too long to answer. Try again.');
    else if (c === 'agent_failed') toast(`${AI.via?.name || 'Your agent'} could not answer: ${e.detail || 'unknown error'}. See the npm run dev terminal.`, 7000);
    else if (c === 'not_granted') { AI.set('off'); toast('AI access was not allowed for this page.'); }
    else if (c === 'rate_limited') toast('Too many requests in a row. Wait a minute and try again.');
    else if (c === 'parse') toast('The coach answered in an unexpected format. Try again.');
    else toast('The coach could not answer just now. Try again in a moment.');
  }
  const aiNote = () => AI.state === 'on' ? '' : AI.state === 'off' && L.local
    ? `<div class="note">${I.info}<span><b>No AI agent found on this computer.</b> The page uses Claude Code, Codex or Gemini CLI when one is installed: install one, sign in, then restart <code>npm run dev</code>. Everything else on this page works as is.</span></div>`
    : `<div class="note">${I.info}<span><b>${AI.state === 'pending' ? 'Connecting to the AI coach…' : 'The AI coach is offline here.'}</b> It runs when this page is open on claude.ai. Everything else on this page works without it.</span></div>`;
  /* The learner's language. Preferences win, then the coach profile (learner/profile.json), then Turkish,
     the language the course content is written in. */
  const Lang = {
    coach() { return langName(L.profile?.explain_in); },
    coachNative() { return langName(L.profile?.native_language); },
    /* Set once: in the first-run question, Preferences, or the coach's profile. */
    known() { return !!(S.native || this.coachNative()); },
    native() { return S.native || this.coachNative() || 'Turkish'; },
    /* Explanations follow the native language unless the learner picked another one (often simple English). */
    explain() { return S.lang || S.native || this.coach() || this.coachNative() || 'Turkish'; }
  };

  /* The course notes and page texts were written in Turkish. When the learner reads in another language,
     the AI coach translates what is on screen, a batch at a time, and the translations are kept in this
     browser, so each text is translated once. Text nodes and a few attributes only: markup and the
     learner's own input are never touched. */
  const SRC_LANG = 'Turkish';
  /* Turkish letters, common Turkish words ("I've" is not "ve"), or Turkish verb endings. */
  const TR_RE = /[çğıöşüÇĞİÖŞÜ]|(?:^|[^'’A-Za-z0-9_])(?:ve|bir|bu|ile|için|gibi|daha|sonra|ya da|dene|kez|dk|mi|mu|ne zaman|var|yok|yerine|kadar|istiyorum|lütfen|değil)\b|\B(?:abilir|ebilir|iyor|uyor|meyen|mayan)|\B(?:mak|mek)\b/i;
  /* Short Turkish words with none of that ("eklem", "maden suyu") are found by where they sit in data.js:
     a field whose texts are mostly Turkish (a phrase's meaning, a group's subtitle) is Turkish throughout. */
  let trSet = null;
  function trFields() {
    if (trSet) return trSet;
    const by = new Map();
    (function walk(v, sig) {
      if (typeof v === 'string') { const k = v.trim(); if (k) { if (!by.has(sig)) by.set(sig, []); by.get(sig).push(k); } }
      else if (Array.isArray(v)) { const tuple = v.length <= 3 && v.every((x) => typeof x === 'string'); v.forEach((x, i) => walk(x, sig + '[' + (tuple ? i : '') + ']')); }
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, sig + '.' + k);
    })(D, '');
    // The few page labels in this file that the pattern can't tell from English.
    trSet = new Set(['Okuma listesi', 'haftada', 'Sitede', 'Elindekiler', 'Eksik', 'Hedef', 'Dinle', 'Kontrol et']);
    for (const arr of by.values()) if (arr.filter((s) => TR_RE.test(s)).length / arr.length >= 0.2) arr.forEach((s) => trSet.add(s));
    return trSet;
  }
  const TX_ATTRS = ['placeholder', 'title', 'aria-label'];
  const TX_SKIP = 'script,style,textarea,code,[data-notx],[contenteditable="true"]';
  const Tx = {
    lang: '', map: {}, want: new Set(), held: new Map(), busy: false, pause: 0, obs: null, t: 0, saveT: 0,
    done: new WeakMap(),
    on() { return !!this.lang && this.lang !== SRC_LANG; },
    isTr(s) { return s.length > 1 && s.length < 1500 && (TR_RE.test(s) || trFields().has(s)); },
    /* A string from data.js (for example a phrase meaning saved to the Vault), in the reading language if we have it. */
    text(s) { const k = String(s ?? '').trim(); return (this.on() && this.map[k]) || s; },
    /* Follow the reading language. Callers re-render afterwards, which puts the source text back. */
    sync() {
      const l = Lang.explain();
      if (l === this.lang) return;
      this.lang = l; this.want.clear(); this.held.clear(); this.pause = 0; this.busy = false; // an answer for the old language is dropped
      this.map = {};
      if (this.on()) {
        try { this.map = JSON.parse(localStorage.getItem('second-voice:tx:' + l) || '{}') || {}; } catch { /* storage unavailable */ }
        if (!this.obs && window.MutationObserver) {
          this.obs = new MutationObserver(() => { clearTimeout(this.t); this.t = setTimeout(() => this.scan(), 40); });
        }
        this.obs?.observe(document.body, { childList: true, subtree: true, characterData: true });
      } else this.obs?.disconnect();
      this.status();
    },
    put(holder, key, cur, set) {
      const k = cur.trim();
      if (!k) return;
      const d = this.done.get(holder);
      if (d && d[key] === cur) return; // already our translation
      if (!this.isTr(k)) return;
      const t = this.map[k];
      if (t) {
        const out = cur.match(/^\s*/)[0] + t + cur.match(/\s*$/)[0];
        this.done.set(holder, Object.assign(d || {}, { [key]: out }));
        set(out);
      } else if (!((this.held.get(k) || 0) > Date.now())) this.want.add(k);
    },
    scan() {
      if (!this.on()) return;
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => (!n.parentElement || n.parentElement.closest(TX_SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT)
      });
      for (let n = w.nextNode(); n; n = w.nextNode()) this.put(n, 'v', n.nodeValue, (v) => { n.nodeValue = v; });
      for (const el of document.body.querySelectorAll('[placeholder],[title],[aria-label]')) {
        if (el.closest(TX_SKIP) && el.tagName !== 'TEXTAREA') continue;
        for (const a of TX_ATTRS) if (el.hasAttribute(a)) this.put(el, a, el.getAttribute(a), (v) => el.setAttribute(a, v));
      }
      this.obs?.takeRecords(); // our own edits aren't news
      this.status();
      this.pump();
    },
    async pump() {
      if (this.busy || !this.want.size || !this.on() || AI.state !== 'on') { this.status(); return; }
      const wait = this.pause - Date.now();
      if (wait > 0) { clearTimeout(this.pumpT); this.pumpT = setTimeout(() => this.pump(), wait + 50); return; }
      const lang = this.lang, batch = [];
      let size = 0;
      for (const k of this.want) { if (batch.length && (batch.length >= 40 || size + k.length > 3500)) break; batch.push(k); size += k.length; }
      batch.forEach((k) => this.want.delete(k));
      this.busy = true; this.status();
      try {
        const r = await AI.ask(`You translate the interface and course notes of an English speaking-practice app from Turkish into ${lang}. The reader is learning English.
Rules:
- Translate only the Turkish. Keep every English word, phrase, example sentence, title, name, number, symbol and piece of code exactly as written.
- Keep the meaning, tone and roughly the length. Speak to the reader as "you", informally if ${lang} has an informal form.
- Keep leading or trailing punctuation such as ":", "(", "→" or "·".
- If an item contains no Turkish, return it unchanged.
Answer with ONLY JSON: {"t": [one string per item, in the same order]}. There are exactly ${batch.length} items.
Items:
${JSON.stringify(batch)}`, 'quick');
        if (lang !== this.lang) return;
        const out = Array.isArray(r?.t) && r.t.length === batch.length ? r.t : null;
        if (!out) throw Object.assign(new Error('parse'), { code: 'parse' });
        batch.forEach((k, i) => {
          const v = typeof out[i] === 'string' ? out[i].trim() : '';
          if (v && v.length < k.length * 4 + 80) this.map[k] = v; else this.held.set(k, Date.now() + 10 * 60e3);
        });
        this.persist();
      } catch (e) {
        if (lang !== this.lang) return;
        const later = Date.now() + (e?.code === 'rate_limited' ? 90e3 : 30e3);
        batch.forEach((k) => this.held.set(k, later + 120e3)); // this batch waits a little longer
        this.pause = later;
        if (e?.code === 'not_granted') AI.set('off');
      } finally {
        if (lang === this.lang) this.busy = false;
      }
      this.scan();
    },
    persist() {
      clearTimeout(this.saveT);
      this.saveT = setTimeout(() => {
        const keys = Object.keys(this.map);
        if (keys.length > 6000) for (const k of keys.slice(0, keys.length - 6000)) delete this.map[k];
        try { localStorage.setItem('second-voice:tx:' + this.lang, JSON.stringify(this.map)); } catch { /* storage full or unavailable */ }
      }, 400);
    },
    status() {
      let el = $('#tx-status');
      const show = this.on() && (this.busy || this.want.size > 0);
      if (!show) { if (el) el.hidden = true; return; }
      if (!el) {
        el = document.createElement('div');
        el.id = 'tx-status'; el.className = 'tx-status'; el.setAttribute('data-notx', ''); el.setAttribute('role', 'status');
        document.body.append(el);
      }
      el.hidden = false;
      const lang = esc(this.lang);
      el.innerHTML = AI.state === 'on'
        ? `<span class="dot on"></span><span>Translating this page into ${lang}…</span>`
        : AI.state === 'pending'
          ? `<span class="dot"></span><span>Waiting for the AI coach to translate into ${lang}…</span>`
          : `<span class="dot warn"></span><span>Some notes are still in Turkish. They switch to ${lang} once the AI coach is connected.</span> <a href="#connect">Connect</a>`;
    }
  };

  /* First run: ask the learner's native language before anything else, so every explanation starts in it. */
  const Setup = {
    open() {
      if ($('#setup') || Lang.known()) return;
      const guess = browserLang();
      const el = document.createElement('div');
      el.id = 'setup'; el.className = 'setup'; el.setAttribute('data-notx', '');
      el.innerHTML = `<form class="setup-card" role="dialog" aria-modal="true" aria-labelledby="setup-h">
          <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>
          <h2 id="setup-h">Welcome to Second Voice</h2>
          <p class="muted">You practise in English. Tips, corrections and translations come in your own language.</p>
          <div class="field"><label for="su-native">What is your native language?</label>
            <select class="input" id="su-native" required><option value=""${guess ? '' : ' selected'} disabled>Choose your language</option>${langOptions(guess, { english: false })}<option value="__other">Other…</option></select></div>
          <div class="field" id="su-other-f" hidden><label for="su-other">Your language, in English</label><input class="input" id="su-other" maxlength="30" autocomplete="off" placeholder="e.g. Swahili"></div>
          <div class="field"><label for="su-explain">Explanations in</label>
            <select class="input" id="su-explain"><option value="">My native language</option><option value="English">Simple English</option></select></div>
          <p class="muted setup-small">You can change both in Preferences at any time.</p>
          <button class="btn primary" type="submit">Continue</button>
        </form>`;
      document.body.append(el);
      const sel = $('#su-native', el), other = $('#su-other', el), otherF = $('#su-other-f', el);
      sel.addEventListener('change', () => { otherF.hidden = sel.value !== '__other'; if (!otherF.hidden) other.focus(); });
      $('form', el).addEventListener('submit', (e) => {
        e.preventDefault();
        const name = sel.value === '__other' ? langName(other.value) : langName(sel.value);
        if (!name) { toast(sel.value === '__other' ? 'Type the language name in English, letters only.' : 'Choose your native language.'); (sel.value === '__other' ? other : sel).focus(); return; }
        S.native = name;
        S.lang = $('#su-explain', el).value === 'English' ? 'English' : '';
        U.lab.recent = [];
        save();
        this.close();
        rerender();
        toast(`Explanations will be in ${Lang.explain()}. You can change this in Preferences.`, 4500);
      });
      setTimeout(() => sel.focus(), 50);
    },
    close() { $('#setup')?.remove(); }
  };
  const ctx = () => `The learner is a ${Lang.native()} speaker at B2 level (understands films and work English well) aiming for C1 speaking. Explanations meant for the learner are in ${Lang.explain()}; English examples stay in English.`;

  /* ================= Feedback effects ================= */
  function toast(msg, ms = 3400) {
    const w = $('#toasts'); if (!w) return;
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    w.append(t);
    while (w.children.length > 3) w.firstElementChild.remove();
    setTimeout(() => {
      const a = t.animate?.([{ opacity: 1 }, { opacity: 0, transform: 'translateY(8px)' }], { duration: 250 });
      if (a) a.onfinish = () => t.remove(); else t.remove();
    }, ms);
  }
  function burst(el, xp) {
    if (!el || !el.getBoundingClientRect) return;
    const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (xp) {
      const p = document.createElement('div');
      p.className = 'xp-pop'; p.textContent = `+${xp} XP`;
      p.style.left = x + 'px'; p.style.top = y + 'px';
      document.body.append(p);
      const a = p.animate([
        { transform: 'translate(-50%,-50%) scale(.6)', opacity: 0 },
        { transform: 'translate(-50%,-140%) scale(1)', opacity: 1, offset: .3 },
        { transform: 'translate(-50%,-240%) scale(1)', opacity: 0 }
      ], { duration: reduced ? 1 : 1100, easing: 'cubic-bezier(.2,.8,.2,1)' });
      a.onfinish = () => p.remove();
    }
    if (reduced) return;
    const colors = ['var(--accent)', 'var(--listen)', 'var(--ink)', '#FFB089'];
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('i');
      s.className = 'spark'; s.style.left = x + 'px'; s.style.top = y + 'px'; s.style.background = colors[i % 4];
      document.body.append(s);
      const ang = Math.random() * Math.PI * 2, d = 30 + Math.random() * 55;
      const a = s.animate([
        { transform: 'translate(-50%,-50%)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(ang) * d}px), calc(-50% + ${Math.sin(ang) * d}px)) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], { duration: 650 + Math.random() * 350, easing: 'cubic-bezier(.2,.8,.2,1)' });
      a.onfinish = () => s.remove();
    }
  }
  function gain(xp, stat, el) {
    const d = day();
    d.xp = Math.max(0, d.xp + xp);
    if (stat) S.stats[stat] = (S.stats[stat] || 0) + 1;
    save();
    if (xp > 0) burst(el, xp);
    updateChrome();
  }

  /* Ambient waveform on the Today screen; swells while English is spoken */
  const t0 = performance.now();
  const Wave = {
    cv: null, ctx: null, e: .18, target: .18, raf: 0, t: 0, w: 0, h: 0,
    mount(cv) {
      cancelAnimationFrame(this.raf); this.raf = 0;
      this.cv = cv; if (!cv) return;
      this.ctx = cv.getContext('2d');
      this.resize();
      this.loop();
    },
    resize() {
      if (!this.cv) return;
      const r = this.cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      this.w = r.width; this.h = r.height;
      this.cv.width = Math.max(1, r.width * dpr); this.cv.height = Math.max(1, r.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) this.draw();
    },
    kick() { this.target = 1; }, calm() { this.target = .18; },
    loop() {
      const step = () => {
        this.raf = 0;
        if (!this.cv || !this.cv.isConnected || this.cv.offsetParent === null) return;
        this.draw();
        if (!reduced) this.raf = requestAnimationFrame(step);
      };
      this.raf = requestAnimationFrame(step);
    },
    draw() {
      const { ctx, w, h } = this; if (!ctx) return;
      this.e += (this.target - this.e) * .06; this.t += .016;
      ctx.clearRect(0, 0, w, h);
      const gap = 6, bars = Math.floor(w / gap), mid = h * .6;
      for (let i = 0; i < bars; i++) {
        const p = i / bars, env = Math.sin(p * Math.PI);
        const n = Math.sin(i * .33 + this.t * 2.6) * .55 + Math.sin(i * .12 - this.t * 1.5) * .35 + Math.sin(i * .9 + this.t * 6) * .25 * this.e;
        const amp = (4 + Math.abs(n) * h * .5 * (this.e * .85 + .15)) * env;
        ctx.fillStyle = `rgba(255,${110 + Math.round(70 * p)},${50 + Math.round(60 * p)},${(.14 + .55 * env * this.e).toFixed(3)})`;
        ctx.fillRect(i * gap + 1.5, mid - amp / 2, 3, amp);
      }
      const tc = $('#tc');
      if (tc) {
        const ms = performance.now() - t0, s = Math.floor(ms / 1000);
        tc.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(Math.floor(ms / 40) % 25)}`;
      }
    }
  };
  addEventListener('resize', () => Wave.resize());

  /* ================= Router ================= */
  const VIEWS = ['today', 'lab', 'plan', 'speak', 'shadow', 'words', 'write', 'traps', 'library', 'connect', 'prefs'];
  let current = null;
  const R = {};
  const U = {
    speak: { tab: 'roles', scen: null, stage: 'brief', msgs: [], busy: false, hints: [], summary: null, err: '', briefBusy: false, phase: 'idle', turn: 0 },
    lab: { tab: 'look', q: '', busy: false, entry: null, err: '', recent: [], filter: '', pos: 'all', quiz: null, scr: 0 },
    pb: { sel: 'doctor', q: '' },
    plan: { area: 'speak' },
    cue: { i: Math.floor(Math.random() * D.cueCards.length), phase: 'idle', left: 60, total: 60, timer: 0, notes: '', res: null, busy: false },
    sh: { tab: 'shadow', set: null, i: 0, res: null },
    pr: { set: 'th', cur: null, answered: null, right: 0, total: 0 },
    w: { tab: 'review', queue: null, flipped: false, q: '', tag: 'all', busy: false },
    wr: { tab: 'lab', prompt: pick(D.writePrompts), text: '', busy: false, res: null, nat: '', natRes: null, natBusy: false },
    cn: { agent: '', pending: null, pendingName: '' },
    tp: null
  };

  function route() {
    const h = location.hash.slice(1);
    go(VIEWS.includes(h) ? h : 'today');
  }
  function go(v) {
    queueId++; U.speak.turn++; TTS.stop(); Mic.abort(); U.speak.phase = 'idle';
    if (v !== 'speak') stopCue();
    if (v !== 'lab') { clearInterval(U.lab.scr); U.lab.scr = 0; }
    current = v;
    for (const id of VIEWS) $('#v-' + id).hidden = id !== v;
    $$('.nav a').forEach((a) => {
      const on = a.getAttribute('href') === '#' + v;
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      if (on && a.closest('#nav-m')) a.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
    });
    R[v]();
    window.scrollTo(0, 0);
  }
  function rerender() { Tx.sync(); if (current) R[current](); updateChrome(); }
  const trapsName = () => (Lang.native() === 'Turkish' ? 'Turkish traps' : 'Common traps');
  function updateChrome() {
    $$('.nav a[href="#traps"]').forEach((a) => { const n = a.lastChild; if (n?.nodeType === 3 && n.nodeValue !== trapsName()) n.nodeValue = trapsName(); });
    const tv = $('#v-traps'); if (tv) tv.setAttribute('aria-label', trapsName());
    const due = dueCards().length;
    const k = todayKey(), tasks = tasksFor(k);
    const left = tasks.filter((t) => !S.days[k]?.tasks?.[t.id]).length;
    $$('[data-badge="words"]').forEach((b) => { b.textContent = due; b.hidden = !due; });
    $$('[data-badge="today"]').forEach((b) => { b.textContent = left; b.hidden = !left; });
    $$('[data-badge="lab"]').forEach((b) => { b.textContent = S.lexicon.length; b.hidden = !S.lexicon.length; });
    // Locally, flag Connect until the coach has written its files.
    $$('[data-badge="connect"]').forEach((b) => { b.hidden = !(L.local && !L.on()); });
  }
  function refreshConnect() { if (current === 'connect') R.connect(); }
  const view = (v) => $('#v-' + v);
  const tabs = (name, items, sel) => `<div class="tabs" role="tablist">${items.map(([k, label]) => `<button role="tab" aria-selected="${k === sel}" data-act="tab" data-group="${name}" data-tab="${k}">${label}</button>`).join('')}</div>`;
  const chipCls = (k) => ({ Vault: 'accent', Shadow: 'listen', Speak: 'accent', Input: '', Write: 'listen', Plan: '', 'Self-talk': 'listen' }[k] || '');
  const sayBtn = (text, label = '', extra = '', cls = 'btn sm') => `<button class="${cls}" data-act="say" data-text="${esc(text)}" ${extra} aria-label="Listen: ${esc(text)}">${I.play}${label ? ' ' + label : ''}</button>`;
  const vaultBtn = (en, tr = '', ex = '', label = 'Vault') => `<button class="btn sm" data-act="vault-add" data-en="${esc(en)}" data-tr="${esc(tr)}" data-ex="${esc(ex)}">${I.plus} ${label}</button>`;

  /* ================= Today ================= */
  function tasksFor(k) {
    const dow = parseKey(k).getDay(), w = weekOf(k), wk = D.weeks[w - 1];
    const due = dueCards().length, h = hashStr(k);
    const vault = { id: 'vault', min: 10, k: 'Vault', t: 'Review your Vault', d: `${due} card${due === 1 ? '' : 's'} waiting`, href: '#words' };
    if (dow === 6) return [
      vault,
      { id: 'long', min: 45, k: 'Input', t: 'Watch a full episode or film with English subtitles', d: 'Kendin söylemeyeceğin 10 ifadede durdur ve Vault\'a ekle', href: '#library' },
      { id: 'write', min: 20, k: 'Write', t: 'Writing lab: your piece of the week', d: 'Geri bildirimi al, sonra C1 versiyonunu sesli oku', href: '#write' },
      { id: 'record', min: 5, k: 'Speak', t: 'Weekly voice memo', d: wk.record + '. Telefonunun ses kaydedicisini kullan.', href: null }
    ];
    if (dow === 0) return [
      vault,
      { id: 'free', min: 15, k: 'Speak', t: 'Free talk: ' + D.freeTalks[h % D.freeTalks.length], d: 'Konuşma stüdyosunda serbest sohbet', href: '#speak' },
      { id: 'review', min: 10, k: 'Plan', t: `Tick off your Week ${w} goals`, d: 'Haftanın hedeflerini işaretle, eksik kalanı bir sonraki haftaya taşı', href: '#plan' }
    ];
    return [
      vault,
      { id: 'shadow', min: 10, k: 'Shadow', t: `Shadow the ${D.shadowSets[wk.shadowSet].name} set`, d: '8 cümle: önce yavaş, sonra normal hızda', href: '#shadow' },
      { id: 'speak', min: 15, k: 'Speak', t: wk.speak[dow % wk.speak.length], d: 'Coach notlarındaki doğal versiyonları Vault\'a ekle', href: '#speak' },
      { id: 'input', min: 15, k: 'Input', t: wk.input, d: 'Aktif dinle: 5 yeni ifade not et', href: '#library' },
      { id: 'self', min: 5, k: 'Self-talk', t: D.selfTalk[h % D.selfTalk.length], d: 'Gün içinde, sesli ya da içinden', href: null }
    ];
  }
  function phraseOfDay() {
    const pool = D.deck.filter((c) => ['idiom', 'discourse', 'collocation'].includes(c.tag));
    return pool[((diffDays('2026-01-01', todayKey()) % pool.length) + pool.length) % pool.length];
  }
  function heatmap() {
    const t = todayKey(), dow = (parseKey(t).getDay() + 6) % 7, start = addDays(t, -dow - 7 * 19);
    let html = '', active = 0;
    for (let i = 0; i < 140; i++) {
      const k = addDays(start, i), x = xpOf(k);
      if (x) active++;
      const l = x === 0 ? 0 : x < 20 ? 1 : x < 40 ? 2 : x < 70 ? 3 : 4;
      html += `<i data-l="${l}" class="${k === t ? 'today' : ''}${k > t ? ' future' : ''}" title="${k}: ${x} XP" style="animation-delay:${Math.floor(i / 7) * 22}ms"></i>`;
    }
    return { html, active };
  }
  const taskRow = (t, on) => `
    <div class="task${on ? ' done' : ''}" data-task="${t.id}">
      <button class="check" data-act="task" data-id="${t.id}" aria-pressed="${!!on}" aria-label="Mark done: ${esc(t.t)}">${I.check}</button>
      <div>
        <div class="task-title">${esc(t.t)}</div>
        <div class="task-meta"><span class="chip ${chipCls(t.k)}">${t.k}</span><span class="mono">${t.min} min</span><span>${esc(t.d)}</span></div>
      </div>
      ${t.href ? `<a class="btn sm" href="${t.href}">Open</a>` : '<span></span>'}
    </div>`;

  /* The coach's side of Today: the backlog it built, and the patterns it is working on. */
  const COACH_TYPES = {
    roleplay: ['Role-play', 'accent'], cuecard: ['Cue card', 'accent'], freetalk: ['Free talk', 'accent'], drill: ['Drill', 'accent'],
    write: ['Write', 'listen'], words: ['Words', 'listen'], shadow: ['Shadow', 'listen'], input: ['Input', ''], read: ['Read', ''], people: ['Real people', '']
  };
  const COACH_ROUTE = { shadow: '#shadow', input: '#library', read: '#plan', people: '#library', words: '' };
  /* What to type into the agent. Plain phrases work in every agent (AGENTS.md maps them). */
  function coachPrompt(it) {
    const ref = it.ref && !String(it.ref).startsWith('#') ? String(it.ref) : '';
    return {
      roleplay: `roleplay ${ref || it.title || ''}`, cuecard: `cue card: ${ref || it.title || ''}`, freetalk: `free talk: ${ref || it.title || ''}`,
      drill: `drill ${ref || it.title || ''}`, write: `write: ${it.title || ''}`, words: 'review my words'
    }[it.type]?.trim() || '';
  }
  function coachToday() {
    const all = (Array.isArray(L.backlog?.items) ? L.backlog.items : []).filter((i) => i && typeof i === 'object' && i.status === 'todo');
    all.sort((a, b) => (+a.priority || 9) - (+b.priority || 9) || String(a.created || '').localeCompare(String(b.created || '')));
    const budget = +L.profile?.minutes_per_day || 45, out = [];
    let sum = 0;
    for (const it of all) {
      if (out.length >= 4) break;
      const m = +it.minutes || 10;
      if (out.length && sum + m > budget) continue;
      out.push(it); sum += m;
    }
    return { items: out, left: all.length, sum };
  }
  function coachStreak() {
    const s = L.brain?.streak, last = String(s?.last_day || '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(last)) return 0;
    return diffDays(last, todayKey()) <= 1 ? (+s.current || 0) : 0;
  }
  const coachRow = (it) => {
    const [label, cls] = COACH_TYPES[it.type] || [String(it.type || 'Task'), ''];
    const prompt = coachPrompt(it);
    const route = String(it.ref || '').startsWith('#') ? String(it.ref) : COACH_ROUTE[it.type];
    const act = prompt
      ? `<button class="btn sm" data-act="coach-copy" data-text="${esc(prompt)}" title="Copy, then paste into your AI agent">Copy <code>${esc(prompt.length > 26 ? prompt.slice(0, 25) + '…' : prompt)}</code></button>`
      : route ? `<a class="btn sm" href="${esc(route)}">Open</a>` : '<span></span>';
    return `
      <div class="c-item">
        <span class="chip ${cls}">${esc(label)}</span>
        <div class="c-body">
          <div class="task-title">${esc(it.title || label)}</div>
          <div class="task-meta"><span class="mono">${+it.minutes || 10} min</span>${it.why ? `<span>${esc(it.why)}</span>` : ''}</div>
        </div>
        ${act}
      </div>`;
  };
  function coachCard() {
    if (L.state === 'bad') return `
      <section class="card coach-card warn-card">
        <div class="section-title"><h2>From your coach</h2></div>
        <p class="muted">The app couldn't read <code>learner/${esc(L.err)}</code>: it isn't valid JSON. Ask your coach to fix it: <i>"learner/${esc(L.err)} is broken, please repair it."</i></p>
      </section>`;
    if (!L.on()) return L.local ? `
      <section class="card coach-card">
        <div class="section-title"><h2>Connect your coach</h2><span class="mono">uses the AI you already have</span></div>
        <p class="muted">Open your AI agent (Claude Code, Codex, Gemini CLI…) in this folder and say <b>start</b>. It sets up your profile, takes a short baseline and builds a plan. Your plan, mistakes and words then show up here.</p>
        <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn primary sm" data-act="coach-copy" data-text="start">Copy <code>start</code></button><a class="btn sm" href="#connect">Step-by-step guide →</a><span class="muted" style="font-size:13px">Your data stays in <code>learner/</code>, on this computer.</span></div>
      </section>` : '';
    const { items, left, sum } = coachToday();
    const errs = (Array.isArray(L.brain?.errors) ? L.brain.errors : [])
      .filter((e) => e && typeof e === 'object' && e.status !== 'resolved')
      .sort((a, b) => (+b.count || 0) - (+a.count || 0)).slice(0, 3);
    const due = (Array.isArray(L.brain?.words) ? L.brain.words : []).filter((x) => x && x.status !== 'mastered' && x.due && String(x.due) <= todayKey()).length;
    const st = coachStreak(), up = ageLabel(L.backlog?.updated || L.brain?.updated);
    const stale = L.backlog?.updated && diffDays(L.backlog.updated, todayKey()) > 3;
    const meta = [up, st ? `${st}-day streak` : '', due ? `${due} word${due === 1 ? '' : 's'} due` : ''].filter(Boolean).join(' · ');
    return `
      <section class="card coach-card">
        <div class="section-title"><h2>From your coach</h2><span class="mono">${esc(meta)}</span></div>
        <div class="c-grid">
          <div class="c-plan">
            ${items.length ? items.map(coachRow).join('') : `<p class="muted">Nothing in your backlog yet. Tell your coach <b>today</b> and it will build one.</p>`}
            ${items.length ? `<p class="c-note mono">${items.length} of ${left} · about ${sum} min${stale ? ' · backlog is getting old: say <b>today</b> to rebuild it' : ''}</p>` : ''}
          </div>
          <aside class="c-focus">
            <h3>Working on</h3>
            ${errs.length ? errs.map((e) => `
              <div class="c-err">
                <div class="c-err-top"><b>${esc(e.pattern || e.id)}</b><span class="mono">×${+e.count || 0}</span></div>
                ${e.fix ? `<div class="sub c-fix">${esc(e.fix)}</div>` : ''}
                ${e.status === 'improving' ? '<span class="chip listen">improving</span>' : ''}
              </div>`).join('') : '<p class="muted" style="font-size:14px">No recurring mistakes logged yet.</p>'}
          </aside>
        </div>
        <p class="c-foot muted">Copy a line, paste it into your AI agent in this folder. Say <b>wrap up</b> when you're done; this page picks up the changes when you come back.</p>
      </section>`;
  }

  R.today = () => {
    const k = todayKey(), w = weekNow(), ph = phaseOf(w), wk = D.weeks[w - 1];
    const tasks = tasksFor(k), d = S.days[k] || { xp: 0, tasks: {} };
    const done = tasks.filter((t) => d.tasks?.[t.id]).length;
    const pod = phraseOfDay(), st = streak(), due = dueCards().length;
    const hr = new Date().getHours();
    const greet = hr < 5 ? 'Still up' : hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
    const date = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    const hm = heatmap();
    view('today').innerHTML = `
      <header class="page-head">
        <div class="eyebrow"><span>${date}</span><span>·</span><b>Week ${w} of 12</b><span>·</span><span>Phase ${ph.n}: ${ph.name}</span></div>
        <h1 class="h-rise">${words(`${greet}, ${String(L.profile?.name || '').trim() || S.name || 'friend'}.`)} <span class="sub">${words("Let's get you talking.", 280)}</span></h1>
        <p class="lead">This week: <b>${esc(wk.title)}</b> (${esc(wk.tr)}). ${esc(ph.goal)}</p>
      </header>
      <form class="lookup-bar" data-form="today-lookup" role="search">
        <span class="lookup-ico" aria-hidden="true">${I.book}</span>
        <input id="today-q" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Look up a word, phrasal verb or idiom…" aria-label="Look up a word">
        <button class="btn primary" type="submit">Look up</button>
      </form>
      <div class="today-grid">
        <article class="screen" aria-label="Phrase of the day">
          <div class="screen-top"><span class="rec"><i></i>Phrase of the day</span><span class="timecode" id="tc">00:00:00:00</span></div>
          <canvas class="wave" id="wave" aria-hidden="true"></canvas>
          <div class="subtitle">
            <div><span class="line karaoke" id="pod">${kara(pod.en)}</span></div>
            <p class="tr-line">${esc(pod.tr)}</p>
            <p class="ex">“${esc(pod.ex)}”</p>
          </div>
          <div class="screen-actions">
            <button class="btn primary" data-act="say" data-text="${esc(pod.en)}" data-kara="#pod">${I.play} Listen</button>
            <button class="btn" data-act="say" data-text="${esc(pod.en)}" data-rate="0.65" data-kara="#pod">${I.slow} Slow</button>
            <button class="btn" data-act="say" data-text="${esc(pod.ex)}">${I.play} Example</button>
            <button class="btn" data-act="vault-add" data-en="${esc(pod.en)}" data-tr="${esc(pod.tr)}" data-ex="${esc(pod.ex)}">${I.plus} Vault</button>
          </div>
        </article>
        <div class="tiles">
          <div class="tile streak${st ? ' lit' : ''}"><span class="k row" style="gap:6px">${I.flame} Streak</span><span class="v">${st}<small>${st === 1 ? 'day' : 'days'}</small></span></div>
          <div class="tile"><span class="k">XP today</span><span class="v" id="xp-today">${d.xp || 0}</span></div>
          <a class="tile" href="#words" style="text-decoration:none;color:inherit"><span class="k">Cards due</span><span class="v">${due}</span></a>
          <a class="tile" href="#lab" style="text-decoration:none;color:inherit"><span class="k">Words saved</span><span class="v">${S.lexicon.length}</span></a>
        </div>
      </div>
      ${coachCard()}
      <section class="card">
        <div class="section-title"><h2>${L.on() ? 'In the app' : "Today's session"}</h2><span class="mono" id="task-count">${done}/${tasks.length} done · about ${tasks.reduce((a, t) => a + t.min, 0)} min</span></div>
        <div class="progress" style="margin:14px 0 6px"><i id="task-bar" style="width:${(done / tasks.length) * 100}%"></i></div>
        <div class="session">${tasks.map((t) => taskRow(t, d.tasks?.[t.id])).join('')}</div>
      </section>
      <section class="card stack" style="gap:16px">
        <div class="section-title"><h2>Last 20 weeks</h2><span class="mono">${hm.active} active days · ${totalXP()} XP total</span></div>
        <div class="heat-wrap"><div class="heat" role="img" aria-label="Activity over the last 20 weeks">${hm.html}</div></div>
        <div class="legend">Less <i style="background:var(--surface-2)"></i><i style="background:color-mix(in srgb,var(--accent) 28%,var(--surface-2))"></i><i style="background:color-mix(in srgb,var(--accent) 52%,var(--surface-2))"></i><i style="background:color-mix(in srgb,var(--accent) 76%,var(--surface-2))"></i><i style="background:var(--accent)"></i> More</div>
      </section>
      <section class="grid g3">
        <button class="card quick" data-act="quick-scene"><span class="chip accent">Speak</span><h3>Throw me into a situation</h3><p class="muted">Hiç girmediğin bir durumda rastgele bir role-play başlat.</p><span class="arrow">Random scene →</span></button>
        <a class="card quick" href="#shadow" data-act="quick-pairs"><span class="chip listen">Sounds</span><h3>Train your ear</h3><p class="muted">θ, ð, w/v ve uzun-kısa sesler: Türk kulağının zorlandığı çiftler.</p><span class="arrow">Sound pairs →</span></a>
        <a class="card quick" href="#traps"><span class="chip">Quiz</span><h3>${Lang.native() === 'Turkish' ? 'Spot the Turkish trap' : 'Spot the trap'}</h3><p class="muted">"I am agree", "discuss about"... Hangisi doğru, 24 soruda gör.</p><span class="arrow">Start quiz →</span></a>
      </section>`;
    Wave.mount($('#wave'));
  };

  /* ================= Word Lab ================= */
  /* Drifting letters behind the search box */
  const Letters = {
    cv: null, ctx: null, ps: [], raf: 0, w: 0, h: 0,
    chars: 'abcdefghijklmnopqrstuvwxyzθðʃʒŋæɪʊəɜɔ',
    mount(cv) {
      cancelAnimationFrame(this.raf); this.raf = 0;
      this.cv = cv; if (!cv) return;
      this.ctx = cv.getContext('2d');
      const r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      this.w = r.width; this.h = r.height;
      cv.width = Math.max(1, r.width * dpr); cv.height = Math.max(1, r.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!this.ps.length) this.ps = Array.from({ length: 46 }, () => this.spawn(true));
      const step = () => {
        this.raf = 0;
        if (!this.cv || !this.cv.isConnected || this.cv.offsetParent === null) return;
        this.draw();
        if (!reduced) this.raf = requestAnimationFrame(step);
      };
      step();
    },
    spawn(anywhere) {
      return { x: Math.random() * (this.w || 800), y: anywhere ? Math.random() * (this.h || 300) : (this.h || 300) + 30, s: 14 + Math.random() * 34,
        v: .15 + Math.random() * .45, a: .05 + Math.random() * .16, ch: this.chars[Math.floor(Math.random() * this.chars.length)],
        hot: Math.random() < .12, r: (Math.random() - .5) * .5 };
    },
    draw() {
      const { ctx, w, h } = this; if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < this.ps.length; i++) {
        const p = this.ps[i];
        p.y -= p.v * (U.lab.busy ? 4 : 1);
        if (p.y < -40) this.ps[i] = this.spawn(false);
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.font = `italic ${p.s}px "Instrument Serif", Georgia, serif`;
        ctx.fillStyle = p.hot ? `rgba(255,106,43,${p.a * 2.2})` : `rgba(243,241,236,${p.a})`;
        ctx.fillText(p.ch, 0, 0);
        ctx.restore();
      }
    }
  };

  const FAMILY = [['noun', 'n'], ['verb', 'v'], ['adjective', 'adj'], ['adverb', 'adv']];
  const posCls = (p = '') => { p = String(p).toLowerCase(); if (p.includes('adverb')) return 'pos-d'; if (p.includes('adj')) return 'pos-a'; if (p.includes('noun')) return 'pos-n'; if (p.includes('verb')) return 'pos-v'; return 'pos-x'; };
  const posLabel = (p = '') => ({ noun: 'noun', verb: 'verb', adjective: 'adj', adverb: 'adv' }[String(p).toLowerCase()] || String(p).toLowerCase());
  const str = (v, max = 400) => String(v ?? '').trim().slice(0, max);
  function cleanEntry(r, q) {
    const senses = (Array.isArray(r.senses) ? r.senses : []).slice(0, 4).map((s) => ({ pos: str(s.pos, 30), en: str(s.en), tr: str(s.tr, 160), example: str(s.example) })).filter((s) => s.en);
    const fam = {}; FAMILY.forEach(([k]) => { fam[k] = str(r.family?.[k], 40); });
    return {
      id: 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      word: str(r.word, 60) || q, ipa: str(r.ipa, 60), level: str(r.level, 8), register: str(r.register, 20),
      senses, family: fam, assoc: str(r.assoc_tr, 500),
      collocations: (Array.isArray(r.collocations) ? r.collocations : []).slice(0, 5).map((x) => str(x, 60)).filter(Boolean),
      synonyms: (Array.isArray(r.synonyms) ? r.synonyms : []).slice(0, 5).map((x) => str(x, 40)).filter(Boolean),
      right: 0, wrong: 0
    };
  }
  const savedOf = (word) => S.lexicon.find((e) => e.word.toLowerCase() === String(word).toLowerCase());

  async function lookup(q) {
    q = str(q, 80); if (!q) return;
    const L = U.lab;
    L.q = q; L.tab = 'look'; L.err = '';
    const hit = savedOf(q) || L.recent.find((e) => e.word.toLowerCase() === q.toLowerCase() || e._q === q.toLowerCase());
    if (hit) { L.entry = hit; R.lab(); return; }
    if (AI.state !== 'on') { L.entry = null; L.err = 'off'; R.lab(); return; }
    L.busy = true; L.entry = null; R.lab();
    try {
      const ln = Lang.explain(), nl = Lang.native();
      const r = await AI.ask(`You are a learner's dictionary for a ${nl} speaker at B2 level aiming for C1. Look up: "${q}".
It may be a single word, a phrasal verb, an idiom or a collocation. If it is not English (for example a ${nl} word), choose the most natural English equivalent and look that up instead. If it is misspelled, correct it.
Answer with ONLY a JSON object:
{"word": "the headword in its base form", "ipa": "British IPA between slashes", "level": "CEFR level such as B2", "register": "neutral, formal, informal or slang",
 "senses": [{"pos": "noun, verb, adjective, adverb, phrasal verb, idiom...", "en": "a clear learner-dictionary definition in simple English", "tr": "short ${ln} equivalent", "example": "one natural, modern example sentence that uses the headword"}],
 "family": {"noun": "", "verb": "", "adjective": "", "adverb": ""},
 "assoc_tr": "1-2 sentences in ${ln}: what the word evokes, a memory hook, or how it differs from a similar word ${nl} speakers confuse it with",
 "collocations": ["3 to 5 common collocations"], "synonyms": ["2 to 4 synonyms"]}
Give at most 3 senses, the most common first. In "family" give related forms from the same root, and "" where none exists.
If the input is not a real word or phrase, answer {"error": "short explanation in ${ln}"}.`);
      if (r.error) { L.err = str(r.error, 200); }
      else {
        const e = cleanEntry(r, q); e._q = q.toLowerCase();
        L.entry = savedOf(e.word) || e;
        L.recent = [e, ...L.recent.filter((x) => x.word.toLowerCase() !== e.word.toLowerCase())].slice(0, 10);
        gain(1, 'lookups');
      }
    } catch (e) { aiError(e); L.err = 'fail'; }
    finally { L.busy = false; clearInterval(L.scr); L.scr = 0; if (current === 'lab') R.lab(); }
  }
  function toggleSave(btn) {
    const e = U.lab.entry; if (!e) return;
    const ex = savedOf(e.word);
    if (ex) { S.lexicon = S.lexicon.filter((x) => x !== ex); toast(`Removed “${e.word}” from your words.`); }
    else {
      const { _q, ...clean } = e;
      const item = { ...clean, saved: todayKey() };
      S.lexicon.unshift(item); U.lab.entry = item;
      gain(3, null, btn);
      toast(S.lexicon.length >= 4 ? `Saved. ${S.lexicon.length} words ready for a quiz.` : `Saved. ${4 - S.lexicon.length} more to unlock quizzes.`);
    }
    saveLex(); updateChrome();
    const b = $('#save-btn');
    if (b) { const on = !!savedOf(e.word); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.lastChild.textContent = on ? ' Saved' : ' Save word'; }
    const head = $('#lab-count'); if (head) head.textContent = `${S.lexicon.length} words saved`;
  }

  function entryHTML(e) {
    const saved = !!savedOf(e.word);
    const famOn = FAMILY.filter(([k]) => e.family?.[k]);
    const posList = [...new Set(e.senses.map((s) => s.pos.toLowerCase()))];
    return `
      <article class="entry" aria-label="Dictionary entry for ${esc(e.word)}">
        <div class="entry-head">
          <div class="stack" style="gap:10px">
            <div class="eyebrow">${e.level ? `<b>${esc(e.level)}</b>` : ''}${e.register ? `<span>·</span><span>${esc(e.register)}</span>` : ''}${saved ? '<span>·</span><span>in your words</span>' : ''}</div>
            <h2 class="entry-word">${esc(e.word)}</h2>
            <div class="row" style="gap:8px">${e.ipa ? `<span class="mono ipa">${esc(e.ipa)}</span>` : ''}${posList.map((p) => `<span class="pos ${posCls(p)}">${esc(posLabel(p))}</span>`).join('')}</div>
          </div>
          <div class="row">
            ${sayBtn(e.word, 'Listen', '', 'btn')}${sayBtn(e.word, 'Slow', 'data-rate="0.6"', 'btn')}
            <button class="btn save-btn${saved ? ' on' : ''}" id="save-btn" data-act="lab-save" aria-pressed="${saved}">${I.mark}<span>${saved ? ' Saved' : ' Save word'}</span></button>
          </div>
        </div>
        <div class="senses">${e.senses.map((s, i) => `
          <div class="sense" style="--d:${i}">
            <span><span class="pos ${posCls(s.pos)}">${esc(posLabel(s.pos))}</span></span>
            <div>
              <p class="def">${esc(s.en)}</p>
              <p class="tr-def">${esc(s.tr)}</p>
              ${s.example ? `<p class="exs">${sayBtn(s.example, '', '', 'btn ghost icon-btn sm')}<span>“${esc(s.example)}”</span></p>` : ''}
            </div>
          </div>`).join('')}</div>
        ${famOn.length ? `<div class="stack" style="gap:10px"><div class="section-title"><h3 style="font-size:16px">Word family</h3><span class="mono muted">noun · verb · adj · adv</span></div>
          <div class="family">${FAMILY.map(([k, s], i) => `<button class="fam${e.family[k] ? ' on' : ''}" style="--d:${i}" ${e.family[k] ? `data-act="lab-look" data-q="${esc(e.family[k])}"` : 'disabled'}><span class="pos ${posCls(k)}">${s}</span><b>${esc(e.family[k] || '—')}</b></button>`).join('')}</div></div>` : ''}
        ${e.assoc ? `<div class="assoc"><span class="bulb">${I.bulb}</span><div><b>Çağrışım</b><p>${esc(e.assoc)}</p></div></div>` : ''}
        ${e.collocations.length || e.synonyms.length ? `<div class="grid g2">
          ${e.collocations.length ? `<div class="stack" style="gap:8px"><span class="mono muted">Collocations</span><div class="row" style="gap:6px">${e.collocations.map((c) => `<button class="chip" data-act="say" data-text="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>` : ''}
          ${e.synonyms.length ? `<div class="stack" style="gap:8px"><span class="mono muted">Synonyms · tap to look up</span><div class="row" style="gap:6px">${e.synonyms.map((c) => `<button class="chip listen" data-act="lab-look" data-q="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>` : ''}
        </div>` : ''}
        <div class="row" style="border-top:1px solid var(--line);padding-top:16px">
          ${vaultBtn(e.word, e.senses[0]?.tr || '', e.senses[0]?.example || '', 'Add to Vault flashcards')}
          <span class="spacer"></span><span class="mono muted">${S.stats.lookups} lookups so far</span>
        </div>
      </article>`;
  }
  function startScramble(word) {
    clearInterval(U.lab.scr);
    const el = $('#scr'); if (!el || reduced) return;
    const pool = 'abcdefghijklmnopqrstuvwxyzθðʃŋæə';
    let t = 0;
    U.lab.scr = setInterval(() => {
      const box = $('#scr'); if (!box) { clearInterval(U.lab.scr); return; }
      t++;
      box.textContent = [...word].map((c, i) => c === ' ' ? ' ' : (i < (t / 3) % (word.length + 4) ? c : pool[Math.floor(Math.random() * pool.length)])).join('');
    }, 55);
  }

  function lexCard(e, i) {
    const tot = e.right + e.wrong, pct = tot ? Math.round((e.right / tot) * 100) : 0;
    return `<div class="wcard" style="--i:${i}">
      <button class="wcard-main" data-act="lab-open" data-id="${e.id}">
        <span class="row" style="gap:5px">${[...new Set(e.senses.map((s) => s.pos.toLowerCase()))].slice(0, 3).map((p) => `<span class="pos ${posCls(p)}">${esc(posLabel(p))}</span>`).join('')}</span>
        <span class="w">${esc(e.word)}</span>
        <span class="tr">${esc(e.senses[0]?.tr || '')}</span>
      </button>
      <div class="row" style="gap:8px;flex-wrap:nowrap"><span class="strength" title="${tot ? pct + '% correct in quizzes' : 'Not quizzed yet'}"><i style="width:${tot ? pct : 0}%"></i></span><span class="mono muted">${tot ? pct + '%' : 'new'}</span>
        ${sayBtn(e.word, '', '', 'btn ghost icon-btn sm')}<button class="btn ghost icon-btn sm" data-act="lab-del" data-id="${e.id}" aria-label="Delete ${esc(e.word)}">${I.trash}</button></div>
    </div>`;
  }
  function renderLexList() {
    const box = $('#lex-list'); if (!box) return;
    const q = U.lab.filter.trim().toLowerCase(), pos = U.lab.pos;
    const list = S.lexicon.filter((e) => (!q || (e.word + ' ' + e.senses.map((s) => s.tr + ' ' + s.en).join(' ')).toLowerCase().includes(q))
      && (pos === 'all' || e.senses.some((s) => posCls(s.pos) === pos)));
    box.innerHTML = list.length ? list.map(lexCard).join('') : `<div class="empty" style="grid-column:1/-1"><h3>${S.lexicon.length ? 'No match' : 'Your collection is empty'}</h3><p>${S.lexicon.length ? 'Aramayı değiştir.' : 'Bir kelime ara ve "Save word" ile buraya ekle.'}</p></div>`;
  }

  /* Quiz built from the saved words; weak words come up first */
  const wordRe = (w) => new RegExp('\\b' + w.replace(/[.*+?^$()|[\]\\{}]/g, '\\$&') + '\\b', 'i');
  function buildQuiz(n) {
    const words = S.lexicon.filter((e) => e.senses.length);
    const order = shuffle(words).sort((a, b) => (b.wrong - b.right) - (a.wrong - a.right));
    const qs = [];
    const others = (e, k) => shuffle(words.filter((x) => x !== e).map(k).filter(Boolean));
    for (let i = 0; qs.length < n && i < n * 3; i++) {
      const e = order[i % order.length], s = pick(e.senses);
      const types = ['def', 'tr'];
      const forms = [e.word, ...FAMILY.map(([k]) => e.family?.[k]).filter(Boolean)];
      const gapForm = s.example && forms.find((f) => wordRe(f).test(s.example));
      if (gapForm) types.push('gap');
      const famKeys = FAMILY.filter(([k]) => e.family?.[k] && e.family[k].toLowerCase() !== e.word.toLowerCase());
      if (famKeys.length) types.push('form');
      const type = pick(types);
      let q;
      if (type === 'def') q = { type, label: 'Which word matches this definition?', prompt: s.en, answer: e.word };
      else if (type === 'tr') q = { type, label: 'Which word matches this translation?', prompt: s.tr, answer: e.word };
      else if (type === 'gap') {
        const re = wordRe(gapForm);
        const surface = s.example.match(re)[0];
        q = { type, label: 'Fill the gap', prompt: s.example.replace(re, '_____'), answer: surface, serif: true };
      } else {
        const [k] = pick(famKeys);
        q = { type, label: `What is the ${k} form of “${e.word}”?`, prompt: '', answer: e.family[k],
          pool: [...FAMILY.map(([kk]) => e.family[kk]).filter((f) => f && f !== e.family[k]), e.word, ...others(e, (x) => x.family?.[k])] };
      }
      const pool = q.pool || others(e, (x) => x.word);
      const distract = [...new Set(pool.filter((p) => p && p.toLowerCase() !== q.answer.toLowerCase()))].slice(0, 3);
      if (distract.length < 2 || !q.answer) continue;
      q.options = shuffle([q.answer, ...distract]); q.id = e.id; q.picked = null;
      qs.push(q);
    }
    return { qs, i: 0, score: 0, n: qs.length, done: false };
  }
  function quizHTML() {
    const L = U.lab, qz = L.quiz;
    if (S.lexicon.length < 4) return `<section class="card empty quiz-lock">${lockArt()}<h3>Save ${4 - S.lexicon.length} more word${4 - S.lexicon.length === 1 ? '' : 's'} to unlock quizzes</h3><p>Quiz, kaydettiğin kelimelerden üretilir: tanım, Türkçe karşılık, boşluk doldurma ve kelime ailesi soruları.</p><div class="row" style="justify-content:center;margin-top:14px"><button class="btn primary" data-act="tab" data-group="lab" data-tab="look">Look up a word</button></div></section>`;
    if (!qz) return `<section class="card quiz-start">
        <div class="quiz-art" aria-hidden="true">${['def', 'tr', 'gap', 'v'].map((t, i) => `<span style="--i:${i}">${{ def: 'Aa', tr: 'Tr', gap: '_ _', v: 'n·v' }[t]}</span>`).join('')}</div>
        <div class="stack"><h3 style="font-size:26px">Quiz your words</h3>
        <p class="muted">${S.lexicon.length} kelimeden karışık sorular: tanım → kelime, Türkçe → kelime, örnek cümlede boşluk ve kelime ailesi. Önce en çok yanıldığın kelimeler gelir.</p>
        <div class="row"><button class="btn primary" data-act="quiz-start" data-n="10">Start 10 questions</button><button class="btn" data-act="quiz-start" data-n="20">20 questions</button></div>
        ${S.quizBest ? `<span class="mono muted">Best: ${S.quizBest}%</span>` : ''}</div>
      </section>`;
    if (qz.done) {
      const pct = qz.n ? Math.round((qz.score / qz.n) * 100) : 0;
      const missed = [...new Set(qz.qs.filter((q) => q.picked !== null && q.picked !== q.answer).map((q) => q.id))].map((id) => S.lexicon.find((e) => e.id === id)).filter(Boolean);
      return `<section class="card raised quiz-done">
        <div class="score-ring" style="--p:${pct}"><b>${pct}%</b><span>${qz.score}/${qz.n}</span></div>
        <h3>${pct >= 90 ? 'These words are yours now.' : pct >= 70 ? 'Solid. A few still slip away.' : 'Good practice. Run it again tomorrow.'}</h3>
        ${missed.length ? `<div class="stack" style="gap:8px;width:100%"><span class="mono muted">Review these</span><div class="row" style="justify-content:center">${missed.map((e) => `<button class="chip accent" data-act="lab-open" data-id="${e.id}">${esc(e.word)}</button>`).join('')}</div></div>` : ''}
        <div class="row" style="justify-content:center"><button class="btn primary" data-act="quiz-start" data-n="${qz.n}">Play again</button><button class="btn" data-act="quiz-exit">Done</button></div>
      </section>`;
    }
    const q = qz.qs[qz.i], answered = q.picked !== null, e = S.lexicon.find((x) => x.id === q.id);
    return `<section class="qcard" key="${qz.i}">
      <div class="row"><span class="mono muted">Question ${qz.i + 1} of ${qz.n}</span><span class="spacer"></span><span class="chip accent">Score ${qz.score}</span></div>
      <div class="progress"><i style="width:${(qz.i / qz.n) * 100}%"></i></div>
      <span class="eyebrow">${esc(q.label)}</span>
      ${q.prompt ? `<p class="qprompt${q.serif ? ' serif' : ''}">${esc(q.prompt)}</p>` : ''}
      <div class="qopts">${q.options.map((o) => { const cls = !answered ? '' : o === q.answer ? ' right' : o === q.picked ? ' wrong' : ''; return `<button class="opt${cls}" data-act="quiz-pick" data-v="${esc(o)}" ${answered ? 'disabled' : ''}><span>${esc(o)}</span></button>`; }).join('')}</div>
      ${answered && e ? `<div class="explain row" style="align-items:flex-start;gap:14px">
        <div style="flex:1;min-width:200px"><b class="sub" style="font-size:22px">${esc(e.word)}</b> <span class="tr">${esc(e.senses[0]?.tr || '')}</span><p class="muted" style="margin-top:4px">${esc(e.senses[0]?.en || '')}</p></div>
        <div class="row">${sayBtn(e.word, 'Hear it')}<button class="btn dark" data-act="quiz-next">${qz.i === qz.n - 1 ? 'See score' : 'Next'} ${I.next}</button></div></div>` : ''}
    </section>`;
  }
  const lockArt = () => `<svg class="lock-art" viewBox="0 0 120 90" aria-hidden="true"><rect x="10" y="20" width="44" height="58" rx="6" fill="var(--surface-2)" stroke="var(--line)" stroke-width="2" transform="rotate(-8 32 49)"/><rect x="38" y="14" width="44" height="58" rx="6" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/><rect x="66" y="20" width="44" height="58" rx="6" fill="var(--screen)" transform="rotate(8 88 49)"/><text x="60" y="50" text-anchor="middle" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="20" fill="var(--accent)">Aa</text><text x="88" y="54" text-anchor="middle" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="16" fill="#F3F1EC" transform="rotate(8 88 49)">?</text></svg>`;

  R.lab = () => {
    const L = U.lab;
    let body = '';
    if (L.tab === 'look') {
      if (L.busy) body = `<article class="entry loading" aria-busy="true"><span class="eyebrow">Looking it up…</span><h2 class="entry-word" id="scr">${esc(L.q)}</h2><div class="stack">${[92, 70, 84, 55].map((w) => `<span class="skel" style="width:${w}%"></span>`).join('')}</div></article>`;
      else if (L.entry) body = entryHTML(L.entry);
      else if (L.err === 'off') body = L.local
        ? `<div class="note">${I.info}<span><b>Lookups need your AI agent.</b> Bilgisayarında Claude Code, Codex ya da Gemini CLI bulunamadı. Birini kurup giriş yap, sonra <code>npm run dev</code>'i yeniden başlat. Kaydettiğin kelimeler burada yine de açılır.</span></div>`
        : `<div class="note">${I.info}<span><b>Lookups need the AI coach.</b> It runs when this page is open on claude.ai. Kaydettiğin kelimeler burada yine de açılır.</span></div>`;
      else if (L.err) body = `<section class="card empty"><h3>${L.err === 'fail' ? 'That lookup did not work' : esc(L.err)}</h3><p>${L.err === 'fail' ? 'Bir daha dene.' : 'Yazımı kontrol et ya da başka bir kelime dene.'}</p></section>`;
      else body = `<section class="lab-empty">
          <div class="spec" aria-hidden="true">
            <span class="sp-word sub">serendipity</span><span class="sp-ipa mono">/ˌser.ənˈdɪp.ə.ti/</span>
            <span class="sp-pos pos pos-n">noun</span><span class="sp-tr">hoş bir tesadüf</span>
            <span class="sp-line l1"></span><span class="sp-line l2"></span><span class="sp-line l3"></span>
          </div>
          <div class="stack" style="max-width:46ch">
            <h3 style="font-size:24px">What you get for every word</h3>
            <ul class="gets">
              <li><span class="pos pos-n">noun</span><span class="pos pos-v">verb</span><span class="pos pos-a">adj</span><span class="pos pos-d">adv</span> türü ve kelime ailesi</li>
              <li>İngilizce tanım ve Türkçe karşılık</li>
              <li>Çağrışım: akılda tutma ipucu ve karıştırılan kelimeler</li>
              <li>Doğal örnek cümle, telaffuz ve collocation'lar</li>
              <li>Kaydet, sonra kendi kelimelerinden quiz çöz</li>
            </ul>
          </div>
        </section>`;
    } else if (L.tab === 'mine') {
      body = `<div class="row"><input class="input" id="lex-search" placeholder="Search your words" value="${esc(L.filter)}" style="flex:1;min-width:200px" aria-label="Search your words"></div>
        <div class="row">${[['all', 'All'], ['pos-n', 'Nouns'], ['pos-v', 'Verbs'], ['pos-a', 'Adjectives'], ['pos-d', 'Adverbs'], ['pos-x', 'Phrases']].map(([k, n]) => `<button class="chip" aria-pressed="${k === L.pos}" data-act="lab-pos" data-id="${k}">${n}</button>`).join('')}</div>
        <section class="wgrid" id="lex-list"></section>`;
    } else body = quizHTML();

    view('lab').innerHTML = `
      <section class="lab-hero">
        <canvas id="letters" aria-hidden="true"></canvas>
        <div class="eyebrow" style="color:rgba(243,241,236,.6)"><span>Word Lab</span><span>·</span><b id="lab-count">${S.lexicon.length} words saved</b></div>
        <h1 class="h-rise">${words('Type a word.')} <span class="sub">${words('Get the whole picture.', 200)}</span></h1>
        <form class="search" data-form="lookup" role="search">
          <input id="lab-q" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="e.g. reluctant, come across, aslında" value="${esc(L.tab === 'look' ? L.q : '')}" aria-label="Word to look up">
          <button class="btn primary" type="submit" ${L.busy ? 'disabled' : ''}>${L.busy ? 'Looking…' : 'Look up'}</button>
        </form>
        ${L.recent.length ? `<div class="row recent"><span class="mono">Recent</span>${L.recent.slice(0, 8).map((e) => `<button class="chip" data-act="lab-look" data-q="${esc(e.word)}">${esc(e.word)}</button>`).join('')}</div>` : ''}
      </section>
      <div class="row">${tabs('lab', [['look', 'Look up'], ['mine', `My words (${S.lexicon.length})`], ['quiz', 'Quiz']], L.tab)}</div>
      ${body}`;
    Letters.mount($('#letters'));
    if (L.tab === 'mine') renderLexList();
    if (L.busy) startScramble(L.q);
  };

  /* ================= Plan ================= */
  function weekCard(wk) {
    const cur = wk.w === weekNow();
    const n = wk.goals.filter((_, i) => S.goals[`${wk.w}-${i}`]).length, complete = n === wk.goals.length;
    return `
      <article class="week${cur ? ' current' : ''}${complete ? ' complete' : ''}" id="week-${wk.w}">
        ${cur ? '<span class="here">You are here</span>' : ''}
        <div class="week-top"><span class="mono">W${pad(wk.w)}</span><span class="chip${complete ? ' good' : ''}" data-wcount="${wk.w}">${n}/${wk.goals.length}</span></div>
        <h4>${esc(wk.title)} <span class="tr">· ${esc(wk.tr)}</span></h4>
        <div class="stack" style="gap:8px">
          ${wk.goals.map((g, i) => { const id = `${wk.w}-${i}`, on = !!S.goals[id]; return `<label class="goal${on ? ' on' : ''}"><input type="checkbox" data-act="goal" data-id="${id}" data-week="${wk.w}"${on ? ' checked' : ''}><span>${esc(g)}</span></label>`; }).join('')}
        </div>
        <details${cur ? ' open' : ''}>
          <summary>Speaking, input, reading and writing</summary>
          <dl>
            <dt>Speak</dt><dd>${wk.speak.map(esc).join(' · ')}</dd>
            <dt>Input</dt><dd>${esc(wk.input)}</dd>
            <dt>Shadow</dt><dd>${D.shadowSets[wk.shadowSet].name}</dd>
            <dt class="dt-read">Read</dt><dd>${esc(wk.read)}</dd>
            <dt class="dt-write">Write</dt><dd>${esc(wk.write)}</dd>
            <dt>Record</dt><dd>${esc(wk.record)}</dd>
          </dl>
        </details>
      </article>`;
  }

  /* ---- Advice by area ---- */
  const svgA = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const AREA_ICON = {
    speak: svgA('<path d="M4 5h16v11H10l-5 4v-4H4z"/><path d="M8 9.5h8M8 12.5h5"/>'),
    shadow: svgA('<path d="M3 12h1.5M7 8.5v7M11 5v14M15 8v8M19 10v4"/>'),
    listen: svgA('<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>'),
    read: svgA('<path d="M3 5.5c2.5-1 6-1 9 1 3-2 6.5-2 9-1v13c-2.5-1-6-1-9 1-3-2-6.5-2-9-1z"/><path d="M12 6.5v13"/>'),
    write: svgA('<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>'),
    words: svgA('<rect x="3" y="7" width="13" height="13" rx="2"/><path d="M8 4h11a2 2 0 0 1 2 2v11"/><path d="M7 12h5M7 15h3"/>'),
    people: svgA('<circle cx="9" cy="8" r="3.2"/><path d="M3 19a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.2A5 5 0 0 1 21 19"/>')
  };
  const AC = { accent: 'var(--accent)', listen: 'var(--listen)', ink: 'var(--ink)', indigo: 'var(--indigo)', amber: 'var(--amber)', rose: 'var(--rose)', good: 'var(--good)' };
  function areaPanel(a) {
    const idx = D.areas.indexOf(a), ph = Math.min(2, Math.floor((weekNow() - 1) / 4));
    const books = a.books ? `
      <div class="ap-books">
        <div class="section-title"><h3>Okuma listesi</h3><span class="mono">12 hafta · 3 kitap + yedekler</span></div>
        <div class="books">${a.books.map((b, i) => `
          <article class="book" style="--i:${i};--bc:${b.bc}">
            <div class="cover" aria-hidden="true"><span>${esc(b.t)}</span></div>
            <div><h4>${esc(b.t)}</h4><div class="by">${esc(b.a)}</div>
              <div class="meta"><span class="chip">${esc(b.w)}</span><span class="chip">${esc(b.lvl)}</span></div>
              <p><b>${esc(b.tag)}.</b> ${esc(b.why)}</p></div>
          </article>`).join('')}</div>
      </div>` : '';
    return `
      <div class="area-panel" id="area-panel" role="tabpanel" style="--c:${AC[a.c]}">
        <div class="ap-head">
          <div class="ap-ico">${AREA_ICON[a.id]}</div>
          <div class="ap-txt"><span class="mono">Alan ${pad(idx + 1)} / ${pad(D.areas.length)}</span><h3>${esc(a.name)} <span class="tr">${esc(a.tr)}</span></h3><p>${esc(a.why)}</p></div>
          <div class="ap-dose"><b>${a.mins}′</b><span>haftada</span><small>${esc(a.dose)}</small></div>
        </div>
        <div class="ap-grid">
          <ol class="ap-tips">${a.tips.map(([t, d], i) => `<li style="--i:${i}"><span class="n">${pad(i + 1)}</span><div><b>${esc(t)}</b><p>${esc(d)}</p></div></li>`).join('')}</ol>
          <aside class="ap-side">
            <span class="mono">Aşamalara göre</span>
            <div class="ap-phases">${D.phases.map((p, i) => `
              <div class="ap-ph${i === ph ? ' now' : ''}" style="--i:${i}"><span class="mono">W${p.weeks[0]}–${p.weeks[p.weeks.length - 1]}</span>
                <div><b>${esc(p.name)}${i === ph ? ' <span class="chip">Şu an</span>' : ''}</b><p>${esc(a.phase[i])}</p></div></div>`).join('')}</div>
            <span class="mono">Sitede</span>
            <div class="ap-links">${a.links.map(([l, to, tab]) => `<button class="btn" data-act="plan-go" data-to="${to}"${tab ? ` data-tab="${tab}"` : ''}>${esc(l)} ${I.next}</button>`).join('')}</div>
          </aside>
        </div>
        ${books}
      </div>`;
  }
  function areasHTML() {
    const sel = D.areas.find((a) => a.id === U.plan.area) || D.areas[0];
    const total = D.areas.reduce((s, a) => s + a.mins, 0);
    const hours = (total / 60).toFixed(1).replace('.', ',');
    return `
      <section class="areas stack" style="gap:16px">
        <div class="section-title"><h2>Advice by area</h2><span class="mono">${D.areas.length} alan · haftada ~${hours} saat</span></div>
        <p class="muted">Haftalık süren alanlara böyle dağılıyor. Bir alan seç: neden önemli, nasıl çalışılır ve şu anki aşamada ne yapacağın.</p>
        <div class="dose" aria-label="Haftalık dakika dağılımı">${D.areas.map((a, i) => `<button style="--m:${a.mins};--c:${AC[a.c]};--i:${i}" class="${a.id === sel.id ? 'on' : ''}" data-act="plan-area" data-id="${a.id}" aria-label="${esc(a.name)}: haftada ${a.mins} dakika"><b>${a.mins}′</b><span>${esc(a.name)}</span></button>`).join('')}</div>
        <div class="area-tabs" role="tablist">${D.areas.map((a) => `<button role="tab" class="area-tab" style="--c:${AC[a.c]}" aria-selected="${a.id === sel.id}" data-act="plan-area" data-id="${a.id}">${AREA_ICON[a.id]}<b>${esc(a.name)}</b><span>${esc(a.tr)}</span></button>`).join('')}</div>
        ${areaPanel(sel)}
      </section>`;
  }
  R.plan = () => {
    const w = weekNow();
    const started = parseKey(S.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const colors = { words: 'f-words', shadow: 'f-shadow', speak: 'f-speak', input: 'f-input' };
    view('plan').innerHTML = `
      <header class="page-head">
        <div class="eyebrow"><span>Started ${started}</span><span>·</span><b>Week ${w} of 12</b><span>·</span><a href="#prefs">Change start date</a></div>
        <h1 class="h-rise">${words('Twelve weeks from')} <span class="sub">${words('understanding', 210)}</span> ${words('to speaking.', 280)}</h1>
        <p class="lead">Dinlediğini anlıyorsun; eksik olan, o İngilizceyi hiç girmediğin durumlarda ağzından çıkarabilmek. Bu plan pasif bilgini aktife çeviriyor: her gün 50 dakika artı akşam 15 dakika okuma, haftada 2-3 kısa yazı, üç aşama, her 4 haftada bir kendi sesinle kontrol noktası.</p>
      </header>

      <section class="diag">
        <div class="card"><h3><span class="chip good">Güçlü</span> Elindekiler</h3><ul>
          <li>Dizi, film ve şarkıları bağlamdan kopmadan anlıyorsun</li>
          <li>Lisansın İngilizce: okuma ve teknik İngilizcen sağlam</li>
          <li>İşinde her gün İngilizce kullanıyorsun</li>
          <li>Disiplinli çalışma alışkanlığın var</li></ul></div>
        <div class="card"><h3><span class="chip accent">Eksik</span> Kapatacağımız boşluklar</h3><ul>
          <li>Konuşma kası zayıf, çünkü günlük hayatın Türkçe</li>
          <li>Karşılaşmadığın alanlarda (sağlık, ev, resmî işler) kelime boşluğu</li>
          <li>Pasif kelime aktif değil: anlıyorsun ama kullanamıyorsun</li>
          <li>Sınav İngilizcesi ile gerçek hayat arasında köprü eksik</li></ul></div>
        <div class="card"><h3><span class="chip listen">Hedef</span> 12 hafta sonra</h3><ul>
          <li>Bilmediğin bir durumda donmadan konuşmak</li>
          <li>Kafada çeviri yapmadan, İngilizce düşünerek cevap vermek</li>
          <li>Üslubu duruma göre ayarlamak: kibar, ikna edici, esprili</li>
          <li>W1 ve W12 kayıtların arasında duyulabilir fark</li></ul></div>
      </section>

      <section class="stack" style="gap:16px">
        <div class="section-title"><h2>The daily formula</h2><span class="mono">Hafta içi · 50 dk</span></div>
        <div class="formula" role="img" aria-label="Daily routine: 10 min Vault, 10 min shadowing, 15 min speaking, 15 min input">
          ${D.routine.weekday.map((r) => `<div class="${colors[r.k]}" style="flex:${r.min}"><b>${r.min}′</b><span>${esc(r.t)}</span></div>`).join('')}
        </div>
        <p class="muted">${esc(D.routine.weekend)} Akşam: 15 dk okuma, mümkünse sesli kitapla. Gün boyu: self-talk, yani yaptığın işi içinden ya da sesli İngilizce anlat.</p>
      </section>

      ${areasHTML()}

      <section class="stack" style="gap:16px">
        <div class="section-title"><h2>Why this works</h2><span class="mono">8 principles</span></div>
        <div class="principles">${D.principles.map((p, i) => `<div class="principle"><span class="n">${pad(i + 1)}</span><h3>${esc(p.t)}</h3><p>${esc(p.d)}</p></div>`).join('')}</div>
      </section>

      <section>
        <div class="section-title" style="margin-bottom:6px"><h2>The roadmap</h2><span class="mono">3 phases · 12 weeks · 48 goals</span></div>
        ${D.phases.map((ph) => `
          <div class="phase">
            <div class="phase-head"><span class="num">0${ph.n}</span><div><h3>${esc(ph.name)}</h3><span class="tr">${esc(ph.tr)}</span></div><p>${esc(ph.goal)}</p></div>
            <div class="weeks">${ph.weeks.map((n) => weekCard(D.weeks[n - 1])).join('')}</div>
          </div>`).join('')}
      </section>

      <div class="note">${I.info}<span><b>Kontrol noktaları: 4, 8 ve 12. hafta.</b> Telefonunla aynı soruya 2-3 dakikalık bir cevap kaydet ve W1 kaydınla karşılaştır. Akıcılık, duraksama sayısı ve kullandığın ifadeler: farkı kendi kulağınla duyman en güçlü motivasyon.</span></div>`;
  };

  /* ================= Speak ================= */
  const freePhrases = [
    ['That\'s a good question.', 'Güzel soru.'], ['I see your point, but...', 'Ne demek istediğini anlıyorum ama...'],
    ['What I mean is...', 'Demek istediğim...'], ['How about you?', 'Peki ya sen?'],
    ['That reminds me of...', 'Bu bana ...\'i hatırlattı.'], ['I\'ve never thought about it that way.', 'Hiç böyle düşünmemiştim.']
  ];
  const freeScene = (topic) => ({
    ...D.freeBrief,
    id: 'free:' + topic, title: 'Free talk: ' + topic, where: 'Coffee with a friend', level: 'B2+', tag: 'Chat',
    role: 'a curious, witty native-speaker friend', learner: 'a friend', phrases: freePhrases,
    setup: `A relaxed chat about "${topic}". Share opinions, tell short anecdotes, ask follow-up questions and disagree sometimes.`,
    goal: 'Fikrini savun, soru sor, sohbeti canlı tut.'
  });
  const customScene = (txt) => ({
    id: 'custom:' + hashStr(txt), title: txt, where: 'Your own scene', level: 'Any', tag: 'Custom',
    role: 'whichever person this situation needs (choose a realistic character)', learner: 'themselves', phrases: freePhrases,
    setup: txt, goal: 'Kendi kurduğun sahnede akıcı kal.',
    name: 'Your partner', job: 'Whoever the scene needs',
    who: 'Sahneye göre gerçekçi bir karakter.', beats: ['Karakter sahneyi açar', 'Bir soru ya da sorun çıkarır', 'Senden bir karar ya da açıklama ister', 'Sahne doğal bir sonla kapanır'],
    you: ['Durumu net anlat', 'En az iki soru sor', 'Sahneyi bir sonuca bağla'], watch: 'Kelime bulamazsan etrafından dolaş: "the thing you use to..."',
    ava: { skin: '#D9A47C', hair: 'short', hairColor: '#2A1C14', shirt: '#E0501A', bg: '#FBE5DA' }, needsBrief: true
  });
  async function makeBrief(sc) {
    if (AI.state !== 'on') return;
    U.speak.briefBusy = true; R.speak();
    try {
      const ln = Lang.explain();
      const r = await AI.ask(`${ctx()}\nThe learner wants to practise this situation in a speaking role-play: "${sc.setup}".\nDesign the scene. Answer with ONLY JSON:\n{"title": "short English title", "where": "place", "name": "the partner's first name or title and name", "job": "the partner's role in a few English words", "role_en": "one English sentence describing the partner's personality and attitude", "learner_en": "who the learner plays, in English", "setup_en": "2 English sentences describing the scene for the partner", "who": "1-2 sentences in ${ln} describing the partner", "beats": ["4 short steps in ${ln} describing how the scene will unfold"], "you": ["3 short tasks for the learner, in ${ln}"], "watch": "1 tip in ${ln} about a likely mistake or useful phrase", "phrases": [["useful English phrase", "meaning in ${ln}"]], "look": {"hair": "short|long|bun|curly|bald", "shirt": "#hex colour"}}\nGive exactly 6 phrases.`);
      if (U.speak.scen !== sc) return;
      Object.assign(sc, {
        title: str(r.title, 80) || sc.title, where: str(r.where, 60) || sc.where, name: str(r.name, 40) || sc.name, job: str(r.job, 60) || sc.job,
        role: str(r.role_en) || sc.role, learner: str(r.learner_en, 120) || sc.learner, setup: str(r.setup_en) || sc.setup,
        who: str(r.who) || sc.who, watch: str(r.watch) || sc.watch,
        beats: Array.isArray(r.beats) && r.beats.length ? r.beats.slice(0, 5).map((x) => str(x, 160)) : sc.beats,
        you: Array.isArray(r.you) && r.you.length ? r.you.slice(0, 4).map((x) => str(x, 160)) : sc.you,
        phrases: Array.isArray(r.phrases) && r.phrases.length ? r.phrases.slice(0, 6).map((p) => [str(p[0], 120), str(p[1], 120)]).filter((p) => p[0]) : sc.phrases,
        ava: { ...sc.ava, hair: ['short', 'long', 'bun', 'curly', 'bald'].includes(r.look?.hair) ? r.look.hair : sc.ava.hair, shirt: /^#[0-9a-f]{6}$/i.test(r.look?.shirt || '') ? r.look.shirt : sc.ava.shirt },
        needsBrief: false
      });
    } catch (e) { aiError(e); }
    finally { U.speak.briefBusy = false; if (U.speak.scen === sc && current === 'speak') R.speak(); }
  }
  function sceneFromLabel(label) {
    const s = D.scenarios.find((x) => label.toLowerCase().includes(x.title.toLowerCase()));
    if (s) return s;
    if (/^free talk:/i.test(label)) return freeScene(label.replace(/^free talk:\s*/i, ''));
    return null;
  }

  function rolePrompt(sc) {
    return `You are the conversation partner in an English speaking-practice app. ${ctx()}

SCENE: ${sc.setup}
YOUR CHARACTER: ${sc.name ? sc.name + ', ' + (sc.job || '') + '. ' : ''}${sc.role}
THE LEARNER PLAYS: ${sc.learner}
HOW THE SCENE SHOULD UNFOLD (move through these one step at a time; they are written for the learner and may not be in English): ${(sc.beats || []).map((b, i) => `${i + 1}) ${b}`).join(' ')}

How to write "reply":
- Stay in character and talk like a real person in this place would: natural spoken English with contractions and everyday expressions. It will be read aloud, so write it the way people speak: no lists, no stage directions, no emojis.
- React to what the learner actually said, including their exact details (days, amounts, names). Details the learner gives about their own situation replace the ones in the scene description above. You have not spoken to the learner before this conversation: you know only what they say here, so never claim they told you something earlier or differently. If something they said is unclear, ask about it the way this person would.
- 1 to 3 short sentences. Now and then ask a question or add a realistic complication, so the learner has to react.
- Never mention that this is practice, never correct the learner, never comment on their English.
- The learner's lines come from speech recognition: ignore missing punctuation, odd capitals and homophones.

Answer with ONLY a JSON object and nothing around it: {"reply": "..."}`;
  }
  function buildConversation(sc) {
    const out = [{ role: 'user', content: rolePrompt(sc) + '\n\nStart the scene now with your first line in character.' }];
    for (const m of U.speak.msgs) {
      if (m.who === 'ai') out.push({ role: 'assistant', content: JSON.stringify({ reply: m.text }) });
      else out.push({ role: 'user', content: 'Learner: ' + m.text });
    }
    return out;
  }
  /* Corrections wait until the scene ends (fluency first). Only a coach profile with
     correction_style "inline" asks for a note after each line, in a separate call. */
  const inlineCoach = () => String(L.profile?.correction_style || '').toLowerCase() === 'inline';
  async function coachLine(m, sc) {
    try {
      const r = await AI.ask(`${ctx()}\nSpeaking role-play. Scene: ${sc.setup}\nThe learner plays: ${sc.learner}.\nThe partner's last line: "${[...U.speak.msgs].reverse().find((x) => x.who === 'ai')?.text || ''}"\nThe learner said (speech recognition, so ignore punctuation and homophones): "${m.text}"\n\nAnswer with ONLY JSON: {"ok": true if a fluent speaker would accept it as natural and correct, "corrected": "the line with only the necessary fixes", "natural": "how a fluent speaker would most likely say it here", "tip": "one short tip in ${Lang.explain()}, at most 20 words, or empty"}`, 'quick');
      if (U.speak.scen === sc) { m.coach = r; renderMsgs(); }
    } catch { /* an inline note is optional */ }
  }
  const transcript = () => U.speak.msgs.map((m) => (m.who === 'ai' ? 'Partner: ' : 'Learner: ') + m.text).join('\n');

  /* Every role-play is saved as it happens (in this browser's storage, newest first), so a
     scene that ends abruptly is still there to read back. Starts once the learner has spoken. */
  const slimSummary = (r) => ({
    summary_tr: str(r.summary_tr || '', 600),
    strengths: (r.strengths || []).slice(0, 3).map((x) => str(x, 200)),
    fixes: (r.fixes || []).slice(0, 5).map((f) => ({ you: str(f.you || '', 300), better: str(f.better || '', 300), why: str(f.why || '', 200) })),
    phrases: (r.phrases || []).slice(0, 4).map((p) => ({ en: str(p.en || '', 160), tr: str(p.tr || '', 160) }))
  });
  function logTalk() {
    const sp = U.speak, sc = sp.scen;
    if (!sc || !sp.msgs.some((m) => m.who === 'me')) return;
    if (!sp.talkId) sp.talkId = 't' + Date.now().toString(36);
    let t = S.talks.find((x) => x.id === sp.talkId);
    if (!t) {
      t = { id: sp.talkId, at: Date.now(), scene: sc.id, title: str(sc.title, 80), name: str(sc.name || '', 40), job: str(sc.job || '', 60), ava: sc.ava || {} };
      S.talks.unshift(t);
    }
    t.msgs = sp.msgs.slice(-80).map((m) => ({ who: m.who === 'ai' ? 'ai' : 'me', text: String(m.text || '').slice(0, 1200) }));
    if (sp.summary) t.summary = slimSummary(sp.summary);
    t.updated = Date.now();
    if (S.talks.length > TALKS_MAX) S.talks.length = TALKS_MAX;
    save();
  }
  /* Stops whatever the scene is doing (voice, mic, the hands-free loop). */
  function hushScene() { U.speak.turn++; Mic.abort(); TTS.stop(); U.speak.phase = 'idle'; }
  function openScene(sc) {
    hushScene(); queueId++;
    Object.assign(U.speak, { tab: 'roles', scen: sc, stage: 'brief', msgs: [], hints: [], summary: null, err: '', talkId: null, log: null });
    R.speak();
    if (sc.needsBrief) makeBrief(sc);
  }
  function goLive() {
    if (U.speak.msgs.length) { U.speak.stage = 'chat'; R.speak(); return; }
    Object.assign(U.speak, { stage: 'chat', msgs: [], hints: [], summary: null, err: '', talkId: null });
    R.speak();
    window.scrollTo(0, 0);
    if (AI.state === 'on') aiTurn();
  }
  async function aiTurn() {
    const sp = U.speak, sc = sp.scen;
    sp.busy = true; sp.err = ''; setPhase('thinking'); renderMsgs();
    let reply = '';
    try {
      const r = await AI.ask(buildConversation(sc));
      if (sp.scen !== sc) return;
      reply = String(r.reply || '').trim() || '...';
      sp.msgs.push({ who: 'ai', text: reply });
      logTalk();
    } catch (e) {
      sp.err = 'The partner did not answer.';
      aiError(e);
    } finally {
      sp.busy = false;
      if (sp.scen === sc) { renderMsgs(); if (!reply) setPhase('idle'); }
    }
    if (reply && sp.scen === sc) partnerSpeaks(reply, sc);
  }
  /* The partner speaks in their own voice; then, hands-free, the mic opens for the learner. */
  function partnerSpeaks(text, sc) {
    const sp = U.speak, turn = ++sp.turn;
    const after = () => {
      if (turn !== sp.turn || sp.scen !== sc || sp.stage !== 'chat' || current !== 'speak') return;
      setPhase('idle');
      if (S.handsFree) listenTurn();
    };
    if (!S.autoSpeak) { after(); return; }
    setPhase('partner');
    TTS.speak(text, { voice: voiceFor(sc), onEnd: after });
  }
  function listenTurn() {
    const sp = U.speak;
    if (!SR || micBlocked || sp.busy || sp.stage !== 'chat' || current !== 'speak' || Mic.rec) return;
    const ta = $('#say-input'), btn = $('#talk-btn');
    if (!ta || !btn) return;
    const turn = sp.turn;
    setPhase('listening');
    Mic.start(btn, (txt) => { ta.value = txt; }, (said) => {
      if (turn !== sp.turn || sp.stage !== 'chat') return;
      if (said) sendLine(); else setPhase('idle');
    }, { patient: true });
    if (!Mic.rec) setPhase('idle');
  }
  /* idle · partner (speaking) · listening · thinking */
  function setPhase(p) {
    const sp = U.speak; sp.phase = p;
    const name = esc(sp.scen?.name || 'Your partner');
    const txt = {
      idle: SR && !micBlocked ? (S.handsFree ? 'Tap the mic and speak, or type.' : 'Tap the mic to speak, or type.') : 'Type your line, or use your keyboard\'s dictation.',
      partner: `${name} is speaking… <span class="muted">tap the mic to cut in</span>`,
      listening: 'Listening… <span class="muted">pause when you\'re done</span>',
      thinking: `${name} is thinking…`
    }[p] || '';
    const st = $('#talk-state'); if (st) st.innerHTML = txt;
    const c = $('.composer'); if (c) c.dataset.phase = p;
  }
  async function sendLine() {
    const ta = $('#say-input'); if (!ta) return;
    const text = ta.value.trim();
    if (!text || U.speak.busy) return;
    if (AI.state !== 'on') { aiError({ code: 'off' }); return; }
    Mic.abort();
    U.speak.turn++; TTS.stop();
    ta.value = '';
    const m = { who: 'me', text };
    U.speak.msgs.push(m);
    U.speak.hints = [];
    logTalk();
    gain(5, 'spoken', $('#talk-btn') || $('#send-btn'));
    if (inlineCoach()) coachLine(m, U.speak.scen);
    await aiTurn();
  }
  async function getHints(btn) {
    if (U.speak.busy) return;
    btn.disabled = true;
    try {
      const r = await AI.ask(`${ctx()}\nScene: ${U.speak.scen.setup}\nThe learner plays: ${U.speak.scen.learner}.\nConversation so far:\n${transcript() || '(nothing yet)'}\n\nSuggest 3 different things the learner could say next, in natural spoken English at B2+ to C1 level, each under 25 words. Answer with ONLY JSON: {"options": ["...", "...", "..."]}`, 'quick');
      U.speak.hints = (r.options || []).slice(0, 3).map(String);
      renderMsgs();
    } catch (e) { aiError(e); }
    finally { btn.disabled = false; }
  }
  async function endScene(btn) {
    if (!U.speak.msgs.some((m) => m.who === 'me')) { toast('Say at least one line before asking for feedback.'); return; }
    hushScene(); setPhase('idle');
    btn.disabled = true; btn.textContent = 'Reviewing…';
    try {
      const r = await AI.ask(reviewPrompt(U.speak.scen.setup, transcript()));
      U.speak.summary = r;
      logTalk();
      const id = U.speak.scen.id;
      if (!S.scenesDone[id]) { S.scenesDone[id] = todayKey(); }
      gain(15, 'scenes', btn);
      renderSummary();
    } catch (e) { aiError(e); }
    finally { btn.disabled = false; btn.textContent = 'End & get feedback'; }
  }
  function reviewPrompt(setup, tx) {
    const ln = Lang.explain();
    return `${ctx()}\nThis was a speaking role-play. Scene: ${setup}\nThe learner's lines came from speech recognition: never count missing punctuation, capitals or homophones as mistakes. Pronunciation cannot be judged from text.\n\nTranscript:\n${tx}\n\nReview ONLY the learner's lines. Pick the corrections with the highest impact: first what hurts understanding, then what sounds clearly unnatural or impolite for this situation; a pattern that repeats beats a one-off slip. Skip anything that is already fine. Answer with ONLY JSON:\n{"summary_tr": "2 sentences in ${ln} on how it went", "strengths": ["short, in ${ln}", "..."], "fixes": [{"you": "what the learner said, quoted exactly", "better": "how a fluent speaker would naturally say it here, one sentence the learner can say aloud", "why": "one short line in ${ln}"}], "phrases": [{"en": "a useful C1 phrase for this situation", "tr": "meaning in ${ln}"}]}\nGive at most 3 strengths, at most 5 fixes (ordered by impact) and exactly 4 phrases.`;
  }
  /* Feedback for a saved conversation that ended before "End & get feedback". */
  async function reviewTalk(t) {
    if (U.speak.reviewBusy) return;
    U.speak.reviewBusy = t.id; R.speak();
    try {
      const setup = D.scenarios.find((s) => s.id === t.scene)?.setup || t.title;
      const tx = t.msgs.map((m) => (m.who === 'ai' ? 'Partner: ' : 'Learner: ') + m.text).join('\n');
      const r = await AI.ask(reviewPrompt(setup, tx));
      t.summary = slimSummary(r);
      save();
    } catch (e) { aiError(e); }
    finally { U.speak.reviewBusy = null; if (current === 'speak') R.speak(); }
  }

  function coachHTML(c, said) {
    const nat = String(c.natural || '').trim(), fix = String(c.corrected || '').trim(), tip = String(c.tip || '').trim();
    const same = (a, b) => a.toLowerCase().replace(/[^a-z']/g, '') === b.toLowerCase().replace(/[^a-z']/g, '');
    if (c.ok) {
      return `<div class="coach"><span><span class="chip good">Natural</span>${nat && !same(nat, said) ? ` Also: <span class="natural">${esc(nat)}</span>` : ''}</span>${tip ? `<span class="tr">${esc(tip)}</span>` : ''}</div>`;
    }
    return `<div class="coach fix">
      <span><b>Better:</b> <span class="natural">${esc(nat || fix)}</span></span>
      ${fix && nat && !same(fix, nat) && !same(fix, said) ? `<span class="tr">Minimal fix: ${esc(fix)}</span>` : ''}
      ${tip ? `<span class="tr">${esc(tip)}</span>` : ''}
      <div class="row">${sayBtn(nat || fix, 'Hear it')}${vaultBtn(nat || fix, 'Senin cümlen: ' + said, '', 'Vault')}</div>
    </div>`;
  }
  function renderMsgs() {
    const box = $('#msgs'); if (!box) return;
    const sp = U.speak;
    let html = sp.msgs.map((m) => m.who === 'ai'
      ? `<div class="msg ai"><span class="who">${esc(sp.scen.name || 'Partner')} ${sayBtn(m.text, '', '', 'btn ghost icon-btn sm')}</span><div class="bubble">${esc(m.text)}</div></div>`
      : `<div class="msg me"><span class="who">You</span><div class="bubble">${esc(m.text)}</div>${m.coach ? coachHTML(m.coach, m.text) : ''}</div>`).join('');
    if (!sp.msgs.length && !sp.busy) {
      html = AI.state === 'on'
        ? '<div class="empty"><h3>Setting the scene…</h3></div>'
        : `<div class="empty"><h3>Your partner is offline here</h3><p>${L.local ? 'Yapay zekâ partneri bilgisayarındaki agent ile çalışır (Claude Code, Codex ya da Gemini CLI), ama burada bulunamadı.' : 'Yapay zekâ partneri claude.ai üzerinde çalışır.'} Şimdilik soldaki ifadeleri sesli oku ve iki rolü de kendin canlandır.</p></div>`;
    }
    if (sp.busy) html += '<div class="msg ai"><div class="bubble typing" aria-label="Partner is typing"><i></i><i></i><i></i></div></div>';
    if (sp.err) html += `<div class="row" style="justify-content:center"><span class="muted">${esc(sp.err)}</span><button class="btn sm" data-act="retry">Try again</button></div>`;
    box.innerHTML = html;
    box.scrollTop = box.scrollHeight;
    const hints = $('#hints');
    if (hints) hints.innerHTML = sp.hints.map((h) => `<button data-act="use-hint" data-text="${esc(h)}">${esc(h)}</button>`).join('');
  }
  const tryHTML = (t) => `<span class="chip ${t.score >= 80 ? 'good' : ''}">${t.score >= 80 ? 'Got it' : 'Again'} · ${t.score}%</span>
    <span class="diff">${t.words.map((w, i) => `<span class="${t.hit[i] ? 'ok' : 'miss'}">${esc(w)}</span>`).join(' ')}</span>
    <span class="muted">We heard: “${esc(t.heard)}”</span>`;
  function renderSummary() {
    const box = $('#summary'); const r = U.speak.summary;
    if (!box) return;
    if (!r) { box.innerHTML = ''; return; }
    box.innerHTML = `
      <div class="card raised stack">
        <div class="section-title"><h2>How it went</h2><span class="chip good">+15 XP</span></div>
        <p>${esc(r.summary_tr)}</p>
        ${(r.strengths || []).length ? `<div><b>İyi yaptıkların</b><ul style="margin:6px 0 0;padding-left:20px" class="muted">${r.strengths.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}
        ${(r.fixes || []).length ? `<div class="stack" style="gap:6px"><b>Say it again</b><span class="muted" style="font-size:14px">Hear the natural version, then say it out loud. The mic checks the words; for pronunciation use the Shadow page.</span></div>` : ''}
        ${(r.fixes || []).map((f, i) => `<div class="issue"><span class="o">${esc(f.you)}</span><span class="f">${esc(f.better)}</span>${f.why ? `<span class="tr">${esc(f.why)}</span>` : ''}<div class="why row">${sayBtn(f.better, 'Hear')}<button class="btn sm mic" data-act="fix-say" data-i="${i}">${I.mic} Say it</button>${vaultBtn(f.better, 'Senin cümlen: ' + f.you)}</div><div class="fix-try" id="fix-try-${i}" aria-live="polite">${f.try ? tryHTML(f.try) : ''}</div></div>`).join('')}
        ${(r.phrases || []).length ? `<div><b>Steal these phrases</b>${r.phrases.map((p) => `<div class="phrase">${sayBtn(p.en, '', '', 'btn ghost icon-btn sm')}<div><div class="en">${esc(p.en)}</div><div class="tr">${esc(p.tr)}</div></div><button class="btn ghost icon-btn sm" data-act="vault-add" data-en="${esc(p.en)}" data-tr="${esc(p.tr)}" aria-label="Add to Vault">${I.plus}</button></div>`).join('')}</div>` : ''}
      </div>`;
  }

  function stopCue() { clearInterval(U.cue.timer); U.cue.timer = 0; if (U.cue.phase === 'prep' || U.cue.phase === 'talk') U.cue.phase = 'idle'; }
  function cueTick() {
    const c = U.cue;
    c.left--;
    if (c.left <= 0) {
      if (c.phase === 'prep') { c.phase = 'talk'; c.total = c.left = 120; toast('Time to talk. Two minutes, no stopping.'); }
      else { clearInterval(c.timer); c.timer = 0; c.phase = 'done'; gain(10, 'spoken', $('.ring')); }
      R.speak(); return;
    }
    paintRing();
  }
  function paintRing() {
    const c = U.cue, bar = $('#ring-bar'), lab = $('#ring-num'); if (!bar) return;
    const C = 2 * Math.PI * 90;
    bar.style.strokeDasharray = C;
    bar.style.strokeDashoffset = c.phase === 'idle' ? 0 : C * (1 - c.left / c.total);
    lab.textContent = c.phase === 'done' ? '0:00' : c.phase === 'idle' ? '1:00' : `${Math.floor(c.left / 60)}:${pad(c.left % 60)}`;
  }
  async function evalCue(btn) {
    const ta = $('#cue-notes'); const text = ta?.value.trim();
    if (!text || text.split(/\s+/).length < 15) { toast('Write or dictate at least a few sentences of what you said.'); return; }
    U.cue.notes = text; U.cue.busy = true; btn.disabled = true; btn.textContent = 'Evaluating…';
    const card = D.cueCards[U.cue.i];
    try {
      const ln = Lang.explain();
      U.cue.res = await AI.ask(`${ctx()}\nThe learner just spoke for 2 minutes on this IELTS Speaking Part 2 cue card: "${card.t}" (${card.b.join('; ')}). This is their transcript, dictated or written from memory:\n"""${text}"""\n\nJudge it like an IELTS examiner on fluency and coherence, lexical resource and grammatical range (pronunciation cannot be judged from text). Answer with ONLY JSON:\n{"band": "estimated band like 6.5", "fluency": "1-2 sentences in ${ln}", "vocab": "1-2 sentences in ${ln}", "grammar": "1-2 sentences in ${ln}", "upgrade": "the learner's main idea rewritten as a natural C1 answer, 4-6 sentences", "phrases": [{"en": "...", "tr": "meaning in ${ln}"}]}\nGive exactly 4 phrases.`);
      gain(5, 'written', btn);
    } catch (e) { aiError(e); }
    finally { U.cue.busy = false; R.speak(); }
  }

  /* Phrasebook: lines for rarely met situations, in conversation order */
  const lc = (s) => String(s || '').toLocaleLowerCase('tr');
  const pbAva = (s) => s.ava || D.scenarios.find((x) => x.id === s.scene)?.ava || {};
  const pbCount = (s) => s.groups.reduce((a, g) => a + g.p.length, 0);
  const pbRow = ([en, tr, note], i, key) => `
    <div class="pb-row" style="--i:${i}" data-pb="${key}">
      ${sayBtn(en, '', '', 'btn ghost icon-btn sm')}
      <div class="pb-txt"><span class="en">${esc(en)}</span><span class="tr">${esc(tr)}</span>${note ? `<span class="pb-note">${esc(note)}</span>` : ''}</div>
      <button class="btn ghost icon-btn sm" data-act="vault-add" data-en="${esc(en)}" data-tr="${esc(tr)}" aria-label="Add to Vault: ${esc(en)}">${I.plus}</button>
    </div>`;
  function pbSituation(s) {
    const sc = D.scenarios.find((x) => x.id === s.scene);
    return `
      <section class="pb-head">
        <div class="pb-portrait">${avatar(pbAva(s), s.title)}</div>
        <div class="stack" style="gap:8px;min-width:0">
          <div class="eyebrow"><span>Phrasebook</span><span>·</span><b>${pbCount(s)} phrases</b><span>·</span><span>${s.groups.length} stages</span></div>
          <h2 class="pb-title">${esc(s.title)} <span class="sub">${esc(s.tr)}</span></h2>
          <p class="lead">${esc(s.intro)}</p>
          <div class="row">
            ${sc ? `<button class="btn primary" data-act="scene" data-id="${sc.id}">Practise with ${esc(sc.name)}</button>` : ''}
            <button class="btn" data-act="pb-play" data-s="${s.id}" data-g="all">${I.play} Listen to everything</button>
          </div>
        </div>
      </section>
      <div class="pb-layout">
        <div class="pb-main">
          ${s.groups.map((g, gi) => `
            <section class="pb-group" style="--g:${gi}">
              <div class="pb-gh"><span class="pb-num">${pad(gi + 1)}</span><div><h3>${esc(g.t)}</h3><span class="tr">${esc(g.tr)}</span></div><span class="spacer"></span>
                <button class="btn sm ghost" data-act="pb-play" data-s="${s.id}" data-g="${gi}">${I.play} Play section</button></div>
              <div class="pb-list">${g.p.map((p, i) => pbRow(p, i, `${s.id}-${gi}-${i}`)).join('')}</div>
            </section>`).join('')}
        </div>
        <aside class="pb-side">
          ${s.compare.length ? `<div class="card pb-compare"><span class="bk">Textbook → natural</span>
            ${s.compare.map(([a, b, w], i) => `<div class="cmp" style="--i:${i}"><span class="cmp-a">${esc(a)}</span><span class="cmp-b">${I.next}<span>${esc(b)}</span></span><span class="cmp-w">${esc(w)}</span>${sayBtn(b.split(' / ')[0], 'Hear it', '', 'btn sm ghost')}</div>`).join('')}</div>` : ''}
          ${s.banks.map((b) => `<div class="card pb-bank"><span class="bk">Word bank · ${esc(b.t)}</span><div class="bank-grid">${b.items.map(([en, tr], i) => `<button class="bank-item" style="--i:${i}" data-act="say" data-text="${esc(en)}"><b>${esc(en)}</b><span>${esc(tr)}</span></button>`).join('')}</div></div>`).join('')}
          <div class="note">${I.info}<span><b>Nasıl çalışılır:</b> Bir bölümü "Play section" ile dinle, her cümleden sonra durdurup sesli tekrar et. Sonra cümleleri Türkçesine bakarak İngilizce söylemeye çalış. İşine yarayanları + ile Vault'a ekle.</span></div>
        </aside>
      </div>`;
  }
  function pbBody() {
    const pb = U.pb, q = lc(pb.q.trim());
    if (!q) return pbSituation(D.phrasebook.find((s) => s.id === pb.sel) || D.phrasebook[0]);
    const out = [];
    D.phrasebook.forEach((s) => s.groups.forEach((g, gi) => {
      const rows = g.p.map((p, i) => [p, i]).filter(([p]) => lc(p.join(' ') + (Tx.on() ? ' ' + p.map((x) => Tx.text(x)).join(' ') : '')).includes(q));
      if (rows.length) out.push(`<section class="pb-group"><div class="pb-gh"><div><h3>${esc(s.title)}</h3><span class="tr">${esc(g.t)} · ${esc(g.tr)}</span></div></div><div class="pb-list">${rows.map(([p, i], n) => pbRow(p, n, `${s.id}-${gi}-${i}`)).join('')}</div></section>`);
    }));
    return out.length ? `<div class="pb-main">${out.join('')}</div>` : `<section class="card empty"><h3>No phrases found</h3><p>Başka bir kelime dene: ağrı, bill, taxi, room...</p></section>`;
  }
  function renderPb() {
    const b = $('#pb-body'); if (b) b.innerHTML = pbBody();
    $$('[data-act="pb-sel"]').forEach((x) => x.setAttribute('aria-pressed', !U.pb.q.trim() && x.dataset.id === U.pb.sel));
  }
  const phrasebookHTML = () => `
    <div class="pb-search"><span class="lookup-ico" aria-hidden="true">${I.book}</span><input id="pb-search" autocomplete="off" placeholder="${Tx.on() ? `Search every phrase, in English or ${esc(Lang.explain())}` : 'Search every phrase, in English or Turkish: ağrı, bill, taxi…'}" value="${esc(U.pb.q)}" aria-label="Search phrases"></div>
    <div class="pb-strip">${D.phrasebook.map((s, i) => `
      <button class="pb-sit" style="--i:${i}" aria-pressed="${!U.pb.q.trim() && s.id === U.pb.sel}" data-act="pb-sel" data-id="${s.id}">
        <span class="pb-ava">${avatar(pbAva(s), '')}</span>
        <span class="pb-sit-t"><b>${esc(s.title)}</b><span>${esc(s.tr)}</span></span>
        <span class="mono">${pbCount(s)}</span>
      </button>`).join('')}</div>
    <div id="pb-body">${pbBody()}</div>`;

  R.speak = () => {
    const sp = U.speak;
    const head = `<header class="page-head">
        <div class="eyebrow"><span>Speaking studio</span><span>·</span><b>${Object.keys(S.scenesDone).length} scenes completed</b></div>
        <h1 class="h-rise">${words('Say it before')} <span class="sub">${words('you feel ready.', 210)}</span></h1>
        <p class="lead">Hiç girmediğin durumlar burada provadan geçer. Partnerin karakterde kalır, coach her cümlenin altına daha doğal versiyonunu yazar. Konuşmak için mikrofonu ya da klavyendeki dikteyi kullan.</p>
      </header>
      <div class="row">${tabs('speak', [['roles', 'Role-play'], ['book', 'Phrasebook'], ['cue', 'Cue cards']], sp.tab)}</div>`;

    if (sp.tab === 'book') {
      view('speak').innerHTML = head + phrasebookHTML();
      return;
    }

    if (sp.tab === 'cue') {
      const c = U.cue, card = D.cueCards[c.i], C = 2 * Math.PI * 90;
      view('speak').innerHTML = head + `
        <section class="card raised cue">
          <div>
            <div class="eyebrow">Cue card ${c.i + 1} of ${D.cueCards.length} · IELTS Part 2 style</div>
            <h3 style="margin-top:10px">${esc(card.t)}</h3>
            <p class="muted" style="margin-top:12px">You should say:</p>
            <ul>${card.b.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
            <div class="row" style="margin-top:18px">
              ${c.phase === 'idle' || c.phase === 'done' ? `<button class="btn primary" data-act="cue-start">${I.play} Start 1-min prep</button>` : `<button class="btn dark" data-act="cue-skip">${c.phase === 'prep' ? 'Skip prep, talk now' : 'Finish early'}</button>`}
              <button class="btn" data-act="cue-next">${I.shuffle} Another card</button>
            </div>
          </div>
          <div class="ring ${c.phase === 'prep' ? 'prep' : ''}">
            <svg viewBox="0 0 200 200" aria-hidden="true"><circle class="track" cx="100" cy="100" r="90"/><circle class="bar" id="ring-bar" cx="100" cy="100" r="90" style="stroke-dasharray:${C};stroke-dashoffset:0"/></svg>
            <div class="label"><div><b id="ring-num">1:00</b><span>${{ idle: 'Ready', prep: 'Prepare', talk: 'Talk', done: 'Done' }[c.phase]}</span></div></div>
          </div>
        </section>
        <div class="note">${I.info}<span><b>Nasıl çalışılır:</b> 1 dakika not al (sadece anahtar kelimeler), sonra 2 dakika durmadan konuş. Telefonunla kaydet. Bitince ne söylediğini aşağıya dikte et ya da hatırladığın kadarıyla yaz, coach değerlendirsin.</span></div>
        <section class="card stack">
          <div class="section-title"><h2>What did you say?</h2><span class="mono" id="cue-wc">${c.notes.split(/\s+/).filter(Boolean).length} words</span></div>
          <div class="field"><label for="cue-notes">Your answer, dictated or from memory</label><textarea class="input" id="cue-notes" rows="6" placeholder="Well, I'd like to talk about a time when...">${esc(c.notes)}</textarea></div>
          <div class="row"><button class="btn" data-act="mic-into" data-target="#cue-notes">${I.mic} Dictate</button><span class="spacer"></span><button class="btn primary" data-act="cue-eval" ${AI.state === 'on' ? '' : 'disabled'}>${I.spark} Evaluate</button></div>
          ${aiNote()}
        </section>
        ${c.res ? `<section class="card raised stack">
          <div class="row" style="align-items:flex-end"><div><div class="eyebrow">Estimated band</div><div class="level-badge">${esc(c.res.band)}</div></div></div>
          <div class="grid g3"><div><b>Fluency</b><p class="muted">${esc(c.res.fluency)}</p></div><div><b>Vocabulary</b><p class="muted">${esc(c.res.vocab)}</p></div><div><b>Grammar</b><p class="muted">${esc(c.res.grammar)}</p></div></div>
          <div><div class="row" style="margin-bottom:8px"><b>C1 version</b>${sayBtn(c.res.upgrade, 'Listen & shadow')}</div><p class="rewrite">${esc(c.res.upgrade)}</p></div>
          <div>${(c.res.phrases || []).map((p) => `<div class="phrase">${sayBtn(p.en, '', '', 'btn ghost icon-btn sm')}<div><div class="en">${esc(p.en)}</div><div class="tr">${esc(p.tr)}</div></div><button class="btn ghost icon-btn sm" data-act="vault-add" data-en="${esc(p.en)}" data-tr="${esc(p.tr)}" aria-label="Add to Vault">${I.plus}</button></div>`).join('')}</div>
        </section>` : ''}`;
      paintRing();
      return;
    }

    if (!sp.scen && sp.log) {
      const t = S.talks.find((x) => x.id === sp.log);
      if (t) { view('speak').innerHTML = convoView(t); return; }
      sp.log = null;
    }
    if (!sp.scen) {
      const thisWeek = D.weeks[weekNow() - 1].speak.map(sceneFromLabel).filter(Boolean);
      const shown = sp.allTalks ? S.talks : S.talks.slice(0, 4);
      view('speak').innerHTML = head + `
        ${aiNote()}
        ${S.talks.length ? `<section class="stack"><div class="section-title"><h2>Your recent conversations</h2><span class="mono">${S.talks.length} saved</span></div>
          <div class="convo-list">${shown.map(convoCard).join('')}</div>
          ${S.talks.length > 4 ? `<div class="row"><button class="btn sm ghost" data-act="talks-all">${sp.allTalks ? 'Show fewer' : `Show all ${S.talks.length}`}</button></div>` : ''}</section>` : ''}
        ${thisWeek.length ? `<section class="stack"><div class="section-title"><h2>This week's scenes</h2><span class="mono">Week ${weekNow()}</span></div>
          <div class="scen-grid">${thisWeek.map(scenCard).join('')}</div></section>` : ''}
        <section class="stack"><div class="section-title"><h2>Unfamiliar situations</h2><span class="mono">${D.scenarios.length} scenes</span></div>
          <div class="scen-grid">${D.scenarios.map(scenCard).join('')}</div></section>
        <section class="grid g2">
          <div class="card stack">
            <h3>Free talk</h3><p class="muted">Bir konu seç, arkadaş sohbeti gibi tartış.</p>
            <div class="row">${D.freeTalks.map((t) => `<button class="chip" data-act="free" data-topic="${esc(t)}">${esc(t)}</button>`).join('')}</div>
          </div>
          <form class="card stack" data-form="custom">
            <h3>Build your own scene</h3><p class="muted">Yakında yaşayacağın bir durumu yaz: "Calling to cancel my gym membership", "Meeting my partner's British parents".</p>
            <div class="row"><input class="input" id="custom-scene" placeholder="Describe a situation in English or Turkish" style="flex:1;min-width:200px"><button class="btn dark" type="submit">Start</button></div>
          </form>
        </section>`;
      return;
    }

    const sc = sp.scen;
    if (sp.stage === 'brief') {
      const busy = sp.briefBusy;
      view('speak').innerHTML = `
        <div class="row"><button class="btn ghost" data-act="leave-scene">${I.back} All scenes</button></div>
        <section class="brief${busy ? ' is-busy' : ''}">
          <aside class="dossier">
            <span class="stamp">Briefing</span>
            <div class="portrait">${avatar(sc.ava, sc.name || 'Your partner')}</div>
            <div><div class="nm">${esc(sc.name || 'Your partner')}</div><div class="rl">${esc(sc.job || '')}</div></div>
            <div class="row" style="justify-content:center;gap:6px"><span class="chip dk">${esc(sc.tag)}</span><span class="chip dk">${esc(sc.level)}</span></div>
            <p class="dossier-where">${I.target}<span>${esc(sc.where)}</span></p>
          </aside>
          <div class="brief-body">
            <header class="page-head" style="gap:8px">
              <div class="eyebrow"><span>Mission brief</span><span>·</span><b>~5 minutes</b></div>
              <h1 class="h-rise" style="font-size:clamp(30px,4.4vw,52px)">${words(sc.title)}</h1>
              <p class="lead">${esc(sc.goal)}</p>
            </header>
            ${busy ? `<div class="card stack"><span class="eyebrow">Writing your brief…</span>${[88, 64, 76].map((w) => `<span class="skel" style="width:${w}%"></span>`).join('')}</div>` : `
            <div class="brief-grid">
              <div class="bcard"><span class="bk">Karşındaki</span><p>${esc(sc.who)}</p></div>
              <div class="bcard"><span class="bk">Sahne nasıl ilerler</span><ol class="beats">${(sc.beats || []).map((b, i) => `<li style="--i:${i}">${esc(b)}</li>`).join('')}</ol></div>
              <div class="bcard mission"><span class="bk">Senin görevlerin</span><ul>${(sc.you || []).map((y, i) => `<li style="--i:${i}">${I.target}<span>${esc(y)}</span></li>`).join('')}</ul></div>
              <div class="bcard warn-card"><span class="bk">${I.warn} Dikkat</span><p>${esc(sc.watch)}</p></div>
            </div>
            <div class="stack" style="gap:10px"><span class="mono muted">Phrases to have ready · tap to hear</span>
              <div class="row" style="gap:8px">${sc.phrases.map(([en]) => `<button class="chip phrase-chip" data-act="say" data-text="${esc(en)}">${I.play}${esc(en)}</button>`).join('')}</div></div>`}
            <div class="row golive-row">
              <button class="btn primary golive" data-act="go-live" ${busy ? 'disabled' : ''}><span class="light"></span>Go on air</button>
              ${D.phrasebook.some((p) => p.scene === sc.id) ? `<button class="btn" data-act="pb-open" data-id="${D.phrasebook.find((p) => p.scene === sc.id).id}">${I.book} Full phrasebook</button>` : ''}
              <span class="muted" style="font-size:14px">${AI.state === 'on' ? `${esc(sc.name || 'Your partner')} konuşmayı başlatacak.${SR && S.handsFree ? ' Sonra mikrofon kendiliğinden açılır: konuş, bitince kısa bir sus.' : ''}` : `AI partner ${L.local ? 'bilgisayarındaki agent ile' : 'claude.ai üzerinde'} çalışır. Şimdilik brief ile kendi başına prova yapabilirsin.`}</span>
            </div>
            ${NV.ready() ? '' : `<div class="nv-line" data-nv>${nvStatus()}</div>`}
          </div>
        </section>`;
      return;
    }
    view('speak').innerHTML = `
      <div class="row"><button class="btn ghost" data-act="leave-scene">${I.back} All scenes</button><button class="btn ghost" data-act="show-brief">Brief</button></div>
      <header class="page-head" style="gap:6px">
        <div class="eyebrow"><span>${esc(sc.where)}</span><span>·</span><b>${esc(sc.level)}</b><span>·</span><span>${esc(sc.tag)}</span></div>
        <h1 style="font-size:clamp(28px,4vw,44px)">${esc(sc.title)}</h1>
        <p class="lead">${esc(sc.goal)}</p>
      </header>
      <div class="studio">
        <aside class="studio-side">
          <div class="card bcard mission"><span class="bk">Senin görevlerin</span><ul>${(sc.you || []).map((y, i) => `<li style="--i:${i}">${I.target}<span>${esc(y)}</span></li>`).join('')}</ul></div>
          <div class="card">
            <div class="section-title" style="margin-bottom:6px"><h2 style="font-size:18px">Phrase pack</h2><span class="mono">${sc.phrases.length}</span></div>
            ${sc.phrases.map(([en, tr]) => `<div class="phrase">${sayBtn(en, '', '', 'btn ghost icon-btn sm')}<div><div class="en">${esc(en)}</div><div class="tr">${esc(tr)}</div></div><button class="btn ghost icon-btn sm" data-act="vault-add" data-en="${esc(en)}" data-tr="${esc(tr)}" aria-label="Add to Vault">${I.plus}</button></div>`).join('')}
          </div>
          <div class="note">${I.info}<span><b>Konuşurken durma.</b> Kelime bulamazsan etrafından dolaş: "the thing you use to..." de. Düzeltmeleri sonra coach notlarından al.</span></div>
        </aside>
        <div class="stack">
          <section class="card chat" aria-label="Conversation">
            <div class="chat-head"><span class="mini-ava live">${avatar(sc.ava, sc.name || 'Partner')}</span><div style="min-width:0"><b style="font-size:15px;display:block">${esc(sc.name || 'Partner')}</b><span class="muted" style="font-size:13px">${esc(sc.job || '')}</span></div><span class="onair">On air</span><span class="spacer"></span>
              <div class="chat-opts">
                <label class="row muted"><input type="checkbox" id="auto-speak" data-act="auto-speak"${S.autoSpeak ? ' checked' : ''}> Read replies aloud</label>
                ${SR ? `<label class="row muted"><input type="checkbox" id="hands-free" data-act="hands-free"${S.handsFree ? ' checked' : ''}> Hands-free</label>` : ''}
              </div></div>
            <div class="msgs" id="msgs" aria-live="polite"></div>
            <div class="hints" id="hints"></div>
            <form class="composer" data-form="say" data-phase="${esc(sp.phase || 'idle')}">
              <div class="talk-row">
                <button class="talk mic" id="talk-btn" type="button" data-act="talk" aria-label="Talk">${I.mic}</button>
                <div class="talk-state" id="talk-state" aria-live="polite"></div>
              </div>
              <div class="type-row">
                <textarea class="input" id="say-input" rows="1" placeholder="Your words appear here as you speak. You can also type and press Enter."></textarea>
                <button class="btn primary icon-btn" id="send-btn" type="submit" aria-label="Send">${I.send}</button>
              </div>
            </form>
          </section>
          ${NV.ready() ? '' : `<div class="nv-line" data-nv>${nvStatus()}</div>`}
          <div class="row">
            <button class="btn" data-act="hints" ${AI.state === 'on' ? '' : 'disabled'}>${I.spark} What could I say?</button>
            <button class="btn" data-act="restart-scene">Restart</button>
            <span class="spacer"></span>
            <button class="btn dark" data-act="end-scene" ${AI.state === 'on' ? '' : 'disabled'}>End &amp; get feedback</button>
          </div>
          <p class="muted" style="font-size:13.5px;margin:-4px 0 0">${inlineCoach() ? 'Your coach profile asks for a note after each line.' : 'No corrections while you talk. They come after the scene, when you press End &amp; get feedback.'}</p>
          <div id="summary"></div>
        </div>
      </div>`;
    renderMsgs();
    renderSummary();
    setPhase(sp.busy ? 'thinking' : sp.phase || 'idle');
  };
  /* Saved conversations: a card in the list, and a read-back view with the feedback. */
  const whenTalk = (ms) => new Date(ms).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const convoStats = (t) => {
    const mine = t.msgs.filter((m) => m.who === 'me');
    return { lines: mine.length, words: mine.reduce((a, m) => a + m.text.split(/\s+/).filter(Boolean).length, 0) };
  };
  const convoCard = (t) => {
    const s = convoStats(t);
    return `<button class="convo" data-act="talk-open" data-id="${esc(t.id)}">
      <span class="mini-ava">${avatar(t.ava, '')}</span>
      <span class="convo-main"><b>${esc(t.title)}</b><span class="muted">${t.name ? `with ${esc(t.name)} · ` : ''}${esc(whenTalk(t.at))}</span></span>
      <span class="convo-meta"><span class="mono">${s.lines} ${s.lines === 1 ? 'line' : 'lines'} · ${s.words} words</span>${t.summary ? '<span class="chip good">Feedback</span>' : '<span class="chip">No feedback</span>'}</span>
    </button>`;
  };
  function convoSummary(r) {
    return `<div class="card raised stack">
      <div class="section-title"><h2>Feedback</h2></div>
      ${r.summary_tr ? `<p>${esc(r.summary_tr)}</p>` : ''}
      ${(r.strengths || []).length ? `<div><b>İyi yaptıkların</b><ul style="margin:6px 0 0;padding-left:20px" class="muted">${r.strengths.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}
      ${(r.fixes || []).map((f) => `<div class="issue"><span class="o">${esc(f.you)}</span><span class="f">${esc(f.better)}</span>${f.why ? `<span class="tr">${esc(f.why)}</span>` : ''}<div class="why row">${sayBtn(f.better, 'Hear')}${vaultBtn(f.better, 'Senin cümlen: ' + f.you)}</div></div>`).join('')}
      ${(r.phrases || []).length ? `<div><b>Steal these phrases</b>${r.phrases.map((p) => `<div class="phrase">${sayBtn(p.en, '', '', 'btn ghost icon-btn sm')}<div><div class="en">${esc(p.en)}</div><div class="tr">${esc(p.tr)}</div></div><button class="btn ghost icon-btn sm" data-act="vault-add" data-en="${esc(p.en)}" data-tr="${esc(p.tr)}" aria-label="Add to Vault">${I.plus}</button></div>`).join('')}</div>` : ''}
    </div>`;
  }
  function convoView(t) {
    const s = convoStats(t), v = CAST_VOICE[t.ava?.portrait] || '';
    const busy = U.speak.reviewBusy === t.id;
    return `
      <div class="row"><button class="btn ghost" data-act="talk-close">${I.back} All scenes</button><span class="spacer"></span><button class="btn ghost" data-act="talk-del" data-id="${esc(t.id)}">${I.trash} Delete</button></div>
      <header class="page-head" style="gap:6px">
        <div class="eyebrow"><span>Saved conversation</span><span>·</span><b>${esc(whenTalk(t.at))}</b></div>
        <h1 style="font-size:clamp(28px,4vw,44px)">${esc(t.title)}</h1>
        <p class="lead">${s.lines} ${s.lines === 1 ? 'line' : 'lines'} from you · ${s.words} words</p>
      </header>
      <div class="convo-view">
        <section class="card chat" aria-label="Saved conversation">
          <div class="chat-head"><span class="mini-ava">${avatar(t.ava, t.name || 'Partner')}</span><div style="min-width:0"><b style="font-size:15px;display:block">${esc(t.name || 'Partner')}</b><span class="muted" style="font-size:13px">${esc(t.job || '')}</span></div></div>
          <div class="msgs convo-msgs">${t.msgs.map((m) => m.who === 'ai'
            ? `<div class="msg ai"><span class="who">${esc(t.name || 'Partner')} ${sayBtn(m.text, '', v ? `data-voice="${v}"` : '', 'btn ghost icon-btn sm')}</span><div class="bubble">${esc(m.text)}</div></div>`
            : `<div class="msg me"><span class="who">You · as the mic heard it</span><div class="bubble">${esc(m.text)}</div></div>`).join('')}</div>
        </section>
        <div class="stack">
          ${t.summary ? convoSummary(t.summary) : `<div class="note">${I.info}<span><b>Bu konuşmanın geri bildirimi yok.</b> Sahne "End &amp; get feedback"e basılmadan bitmiş. Kayıttaki metinden şimdi alabilirsin.</span></div>
            <div class="row"><button class="btn primary" data-act="talk-review" data-id="${esc(t.id)}" ${AI.state === 'on' && !busy ? '' : 'disabled'}>${busy ? 'Reviewing…' : I.spark + ' Get feedback now'}</button></div>`}
          <p class="muted" style="font-size:13.5px">Kayıtlar sadece bu tarayıcıda durur (en fazla ${TALKS_MAX} konuşma). Ses kaydedilmez; "You" satırları mikrofonun yazıya döktüğü hâlidir.</p>
        </div>
      </div>`;
  }
  const scenCard = (s, i = 0) => `
    <button class="scen${S.scenesDone[s.id] ? ' done-mark' : ''}" data-act="scene" data-id="${esc(s.id)}" style="--i:${i}">
      <span class="ava">${avatar(s.ava, s.name || '')}</span>
      <span class="row" style="gap:6px"><span class="chip accent">${esc(s.tag)}</span><span class="chip">${esc(s.level)}</span>${S.scenesDone[s.id] ? '<span class="tick">Done</span>' : ''}</span>
      <h3>${esc(s.title)}</h3>
      ${s.name ? `<span class="with">with <b>${esc(s.name)}</b></span>` : ''}
      <span class="where">${esc(s.where)}</span>
      <span class="tr">${esc(s.goal)}</span>
    </button>`;

  /* ================= Shadow & sounds ================= */
  const normW = (s) => s.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean);
  function compare(target, said) {
    const a = normW(target), b = normW(said), m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const hit = new Array(m).fill(false);
    let i = 0, j = 0;
    while (i < m && j < n) { if (a[i] === b[j]) { hit[i] = true; i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
    return { score: m ? Math.round((dp[0][0] / m) * 100) : 0, words: a, hit };
  }
  R.shadow = () => {
    const sh = U.sh;
    if (!sh.set) sh.set = D.weeks[weekNow() - 1].shadowSet;
    const head = `<header class="page-head">
        <div class="eyebrow"><span>Shadow &amp; sounds</span><span>·</span><b>${S.stats.shadowed} lines shadowed</b></div>
        <h1 class="h-rise">${words('Borrow the rhythm,')} <span class="sub">${words('then make it yours.', 200)}</span></h1>
        <p class="lead">Shadowing, duyduğunu aynı tonla yarım saniye geriden tekrarlamak demek. Telaffuzunu, vurgunu ve bağlı konuşmanı en hızlı bu geliştirir. Sound pairs ise Türk kulağının ayırt etmekte zorlandığı sesleri çalıştırır.</p>
      </header>
      <div class="row">${tabs('shadow', [['shadow', 'Shadowing'], ['pairs', 'Sound pairs']], sh.tab)}</div>`;

    if (sh.tab === 'pairs') {
      const pr = U.pr, set = D.soundPairs.find((p) => p.id === pr.set);
      const cur = pr.cur;
      view('shadow').innerHTML = head + `
        <div class="row">${D.soundPairs.map((p) => `<button class="chip" aria-pressed="${p.id === pr.set}" data-act="pair-set" data-id="${p.id}">${esc(p.name)}</button>`).join('')}</div>
        <section class="card raised stage">
          <div class="eyebrow"><span>Which word did you hear?</span><span>·</span><b>${pr.right}/${pr.total} correct</b></div>
          <button class="play-big" data-act="pair-play" aria-label="${cur && pr.answered === null ? 'Play the word again' : 'Play a mystery word'}">${I.play}</button>
          <span class="mono muted">${cur && pr.answered === null ? 'Tap again to replay' : 'Tap to hear a mystery word'}</span>
          <div class="pair-opts">${cur ? set.pairs[cur.p].map((w, i) => `<button class="pair-opt${pr.answered !== null && i === cur.which ? ' right' : ''}${pr.answered !== null && pr.answered === i && i !== cur.which ? ' wrong' : ''}" data-act="pair-answer" data-i="${i}" ${pr.answered !== null ? 'disabled' : ''}>${esc(w)}<br><span class="mono muted" style="font-weight:400">${set.ipa[i]}</span></button>`).join('') : '<p class="muted" style="grid-column:1/-1">Önce dinle, sonra iki seçenekten birini seç.</p>'}</div>
          ${pr.answered !== null ? `<div class="row" style="justify-content:center"><span class="chip ${pr.answered === cur.which ? 'good' : ''}">${pr.answered === cur.which ? 'Correct' : 'It was “' + esc(set.pairs[cur.p][cur.which]) + '”'}</span>${sayBtn(set.pairs[cur.p].join('. '), 'Hear both', 'data-rate="0.7"')}<button class="btn sm dark" data-act="pair-play">Next word</button></div>` : ''}
        </section>
        <div class="note">${I.info}<span><b>${esc(set.name)}:</b> ${esc(set.tip)}</span></div>
        <section class="card">
          <div class="section-title" style="margin-bottom:8px"><h2 style="font-size:18px">All pairs in this set</h2><span class="mono">Listen, then say both out loud</span></div>
          <div class="grid g3">${set.pairs.map((p) => `<div class="row" style="justify-content:space-between;padding:8px 0;border-top:1px solid var(--line)"><span class="sub" style="font-size:22px">${esc(p[0])} · ${esc(p[1])}</span>${sayBtn(p.join('. '), '', 'data-rate="0.75"', 'btn ghost icon-btn sm')}</div>`).join('')}</div>
        </section>`;
      return;
    }

    const set = D.shadowSets[sh.set], line = set.lines[sh.i];
    view('shadow').innerHTML = head + `
      <div class="row">${Object.entries(D.shadowSets).map(([k, s]) => `<button class="chip" aria-pressed="${k === sh.set}" data-act="shadow-set" data-id="${k}">${esc(s.name)}</button>`).join('')}</div>
      <section class="card raised stage">
        <div class="dots" aria-label="Line ${sh.i + 1} of ${set.lines.length}">${set.lines.map((_, i) => `<i class="${i === sh.i ? 'on' : i < sh.i ? 'seen' : ''}"></i>`).join('')}</div>
        <p class="big light-karaoke" id="sh-line">${kara(line)}</p>
        <div class="row" style="justify-content:center">
          <button class="btn primary" data-act="say" data-text="${esc(line)}" data-kara="#sh-line">${I.play} Listen</button>
          <button class="btn" data-act="say" data-text="${esc(line)}" data-rate="0.7" data-kara="#sh-line">${I.slow} Slow</button>
          <button class="btn mic" data-act="shadow-mic">${I.mic} Say it</button>
        </div>
        <div id="sh-res" class="stack" style="align-items:center">${shadowResult()}</div>
        <div class="row" style="justify-content:center">
          <button class="btn ghost" data-act="shadow-step" data-d="-1" ${sh.i === 0 ? 'disabled' : ''}>${I.back} Previous</button>
          <span class="mono muted">${sh.i + 1} / ${set.lines.length}</span>
          <button class="btn ghost" data-act="shadow-step" data-d="1">${sh.i === set.lines.length - 1 ? 'Start over' : 'Next'} ${I.next}</button>
        </div>
      </section>
      <div class="steps">
        <div><b>Dinle</b>Cümleyi 2 kez dinle, metne bakmadan anlamaya çalış.</div>
        <div><b>Mırıldan</b>Kelimeleri değil melodiyi taklit et: vurgu, iniş çıkış.</div>
        <div><b>Aynı anda</b>Ses çalarken üstüne konuş, yarım saniye geriden.</div>
        <div><b>Kontrol et</b>"Say it" ile söyle ya da kendini kaydedip dinle.</div>
      </div>`;
  };
  function shadowResult() {
    const r = U.sh.res;
    if (!r) return `<div class="row" style="justify-content:center"><span class="muted">Mikrofon yoksa kendini puanla:</span><button class="btn sm" data-act="shadow-self" data-v="3">Nailed it</button><button class="btn sm" data-act="shadow-self" data-v="2">Close</button><button class="btn sm" data-act="shadow-self" data-v="1">Again</button></div>`;
    if (r.listening) return `<span class="chip accent">Listening… ${esc(r.heard || '')}</span>`;
    return `<div class="score" style="color:${r.score >= 85 ? 'var(--good)' : r.score >= 60 ? 'var(--warn)' : 'var(--bad)'}">${r.score}%</div>
      <p class="diff">${r.words.map((w, i) => `<span class="${r.hit[i] ? 'ok' : 'miss'}">${esc(w)}</span>`).join(' ')}</p>
      <p class="muted">We heard: “${esc(r.heard)}”</p>`;
  }

  /* ================= Vault ================= */
  const tagNames = { all: 'All', phrasal: 'Phrasal verbs', collocation: 'Collocations', idiom: 'Idioms', discourse: 'Discourse markers', situation: 'Situations', mine: 'Mine' };
  function vaultStats() {
    const cs = allCards();
    let learning = 0, mastered = 0;
    for (const c of cs) { const b = S.cards[c.id]?.box ?? -1; if (b >= 5) mastered++; else if (b >= 0) learning++; }
    return { total: cs.length, learning, mastered, unseen: cs.length - learning - mastered };
  }
  const boxes = (c) => { const b = S.cards[c.id]?.box ?? -1; return `<span class="boxes" title="${b < 0 ? 'New' : 'Box ' + b}">${[1, 2, 3, 4, 5].map((i) => `<i class="${b >= i ? 'on' : ''}"></i>`).join('')}</span>`; };
  R.words = () => {
    const w = U.w, vs = vaultStats(), due = dueCards();
    if (w.tab === 'review' && !w.queue) w.queue = due.map((c) => c.id);
    let body = '';
    if (w.tab === 'review') body = reviewHTML();
    else if (w.tab === 'browse') body = `
      <div class="row"><input class="input" id="w-search" placeholder="Search your Vault" value="${esc(w.q)}" style="flex:1;min-width:200px" aria-label="Search your Vault"></div>
      <div class="row">${Object.entries(tagNames).map(([k, n]) => `<button class="chip" aria-pressed="${k === w.tag}" data-act="w-tag" data-id="${k}">${n}</button>`).join('')}</div>
      <section class="card" id="vlist" style="padding:6px 18px"></section>`;
    else body = `
      <form class="card stack" data-form="add-card" style="max-width:720px">
        <h3>Add a phrase you noticed</h3>
        <p class="muted">Dizide, podcast'te ya da işte duyduğun ve "ben böyle demezdim" dediğin her ifadeyi buraya ekle. Tek kelime değil, kalıp olarak.</p>
        <div class="field"><label for="n-en">English phrase</label><div class="row"><input class="input" id="n-en" placeholder="e.g. it's a long shot" style="flex:1;min-width:200px" required><button class="btn" type="button" data-act="ai-fill" ${AI.state === 'on' ? '' : 'disabled'}>${I.spark} Fill the rest</button></div></div>
        <div class="field"><label for="n-tr">Meaning (${esc(Lang.explain())})</label><input class="input" id="n-tr" placeholder="zayıf bir ihtimal"></div>
        <div class="field"><label for="n-ex">Example sentence</label><input class="input" id="n-ex" placeholder="It's a long shot, but it might work."></div>
        <div class="field"><label for="n-tag">Type</label><select class="input" id="n-tag">${Object.entries(tagNames).filter(([k]) => k !== 'all').map(([k, n]) => `<option value="${k}"${k === 'mine' ? ' selected' : ''}>${n}</option>`).join('')}</select></div>
        <div class="row"><button class="btn primary" type="submit">${I.plus} Add to Vault</button></div>
        ${aiNote()}
      </form>`;
    view('words').innerHTML = `
      <header class="page-head">
        <div class="eyebrow"><span>The Vault</span><span>·</span><b>${due.length} due today</b><span>·</span><span>Spaced repetition: 1, 3, 7, 16, 35 days</span></div>
        <h1 class="h-rise">${words('Chunks, not')} <span class="sub">${words('words.', 140)}</span></h1>
      </header>
      <div class="grid g4">
        <div class="tile"><span class="k">Due today</span><span class="v">${due.length}</span></div>
        <div class="tile"><span class="k">Learning</span><span class="v">${vs.learning}</span></div>
        <div class="tile"><span class="k">Mastered</span><span class="v">${vs.mastered}</span></div>
        <div class="tile"><span class="k">In the Vault</span><span class="v">${vs.total}</span></div>
      </div>
      <div class="row">${tabs('words', [['review', 'Review'], ['browse', 'Browse'], ['add', 'Add phrase']], w.tab)}</div>
      ${body}`;
    if (w.tab === 'browse') renderVList();
  };
  function reviewHTML() {
    const w = U.w;
    const c = w.queue.length ? allCards().find((x) => x.id === w.queue[0]) : null;
    if (!c) return `<section class="card empty"><h3>All caught up</h3><p>Bugünlük tekrar bitti. Yeni ifade ekle ya da yarın tekrar gel.</p><div class="row" style="justify-content:center;margin-top:14px"><button class="btn" data-act="tab" data-group="words" data-tab="add">${I.plus} Add a phrase</button><button class="btn ghost" data-act="tab" data-group="words" data-tab="browse">Browse the Vault</button></div></section>`;
    const isNew = !S.cards[c.id];
    return `
      <div class="flip${w.flipped ? ' flipped' : ''}" id="flip">
        <div class="flip-inner" data-act="flip" role="button" tabindex="0" aria-label="Flip card">
          <div class="face front">
            <span class="row" style="justify-content:center"><span class="chip" style="background:rgba(255,255,255,.08);color:rgba(243,241,236,.75)">${tagNames[c.tag] || 'Mine'}</span>${isNew ? '<span class="chip accent">New</span>' : ''}</span>
            <div class="term">${esc(c.en)}</div>
            <span class="hint">Say what it means, then tap or press Space</span>
          </div>
          <div class="face back">
            <div class="meaning">${esc(c.tr || '—')}</div>
            ${c.ex ? `<div class="ex">“${esc(c.ex)}”</div>` : ''}
            <div class="row" style="justify-content:center">${sayBtn(c.en, 'Phrase')}${c.ex ? sayBtn(c.ex, 'Example') : ''}</div>
            <span class="hint">How well did you know it? Keys 1 to 4</span>
          </div>
        </div>
      </div>
      <div id="rate-area">${rateArea(c)}</div>
      <p class="mono muted" style="text-align:center">${w.queue.length} left in this session</p>`;
  }
  const rateArea = (c) => U.w.flipped ? `<div class="rate">
        <button class="r1" data-act="rate" data-r="1">Again<span>${gapLabel(c, 1)}</span></button>
        <button class="r2" data-act="rate" data-r="2">Hard<span>${gapLabel(c, 2)}</span></button>
        <button class="r3" data-act="rate" data-r="3">Good<span>${gapLabel(c, 3)}</span></button>
        <button class="r4" data-act="rate" data-r="4">Easy<span>${gapLabel(c, 4)}</span></button>
      </div>` : `<div class="row" style="justify-content:center"><button class="btn dark" data-act="flip">Show meaning</button>${sayBtn(c.en, 'Hear it')}</div>`;
  function renderVList() {
    const box = $('#vlist'); if (!box) return;
    const q = U.w.q.trim().toLowerCase(), tag = U.w.tag;
    const list = allCards().filter((c) => (tag === 'all' || c.tag === tag) && (!q || (c.en + ' ' + c.tr + ' ' + c.ex).toLowerCase().includes(q)));
    box.innerHTML = list.length ? list.map((c) => `
      <div class="vrow">
        <div><div class="en">${esc(c.en)}</div>${c.ex ? `<div class="ex">${esc(c.ex)}</div>` : ''}</div>
        <div class="tr">${esc(c.tr)}</div>
        ${boxes(c)}
        <span class="row" style="gap:4px;flex-wrap:nowrap">${sayBtn(c.en, '', '', 'btn ghost icon-btn sm')}${c.id.startsWith('c') ? `<button class="btn ghost icon-btn sm" data-act="del-card" data-id="${c.id}" aria-label="Delete ${esc(c.en)}">${I.trash}</button>` : ''}</span>
      </div>`).join('') : '<div class="empty"><h3>Nothing here yet</h3><p>Aramayı değiştir ya da yeni bir ifade ekle.</p></div>';
  }

  /* ================= Write ================= */
  R.write = () => {
    const wr = U.wr;
    const head = `<header class="page-head">
        <div class="eyebrow"><span>Writing lab</span><span>·</span><b>${S.stats.written} pieces reviewed</b></div>
        <h1 class="h-rise">${words('Write it slow,')} <span class="sub">${words('speak it fast.', 200)}</span></h1>
        <p class="lead">Yazmak, konuşmanın yavaş çekimidir: kelime seçmeye vaktin olur. Coach hatalarını Türkçe açıklar, metnini C1 seviyesine taşır. Sonra o versiyonu sesli okuyup shadow et.</p>
      </header>
      <div class="row">${tabs('write', [['lab', 'Writing lab'], ['natural', 'Say it naturally']], wr.tab)}</div>`;
    if (wr.tab === 'natural') {
      const r = wr.natRes;
      view('write').innerHTML = head + `
        <form class="card stack" data-form="natural">
          <h3>How would a native speaker say this?</h3>
          <p class="muted">Türkçe düşündüğün bir cümleyi ya da kendi İngilizce cümleni yaz. Üç üslupta doğal karşılığını al: arkadaşa, iş yerine, resmî yazıya.</p>
          <div class="field"><label for="nat-in">Your sentence</label><textarea class="input" id="nat-in" rows="3" placeholder="Toplantıyı yarına erteleyebilir miyiz, bugün çok yoğunum.">${esc(wr.nat)}</textarea></div>
          <div class="row"><button class="btn" type="button" data-act="mic-into" data-target="#nat-in">${I.mic} Dictate</button><span class="spacer"></span><button class="btn primary" type="submit" ${AI.state === 'on' && !wr.natBusy ? '' : 'disabled'}>${wr.natBusy ? 'Thinking…' : I.spark + ' Say it naturally'}</button></div>
          ${aiNote()}
        </form>
        ${r ? `<section class="card raised">
          ${[['casual', 'Casual'], ['neutral', 'Neutral'], ['formal', 'Formal']].map(([k, n]) => r[k] ? `<div class="reg"><span class="lab">${n}</span><span class="txt">${esc(r[k])}</span><span class="row" style="gap:4px;flex-wrap:nowrap">${sayBtn(r[k], '', '', 'btn ghost icon-btn sm')}<button class="btn ghost icon-btn sm" data-act="vault-add" data-en="${esc(r[k])}" data-tr="${esc(wr.nat)}" aria-label="Add to Vault">${I.plus}</button></span></div>` : '').join('')}
          ${r.note_tr ? `<div class="note" style="margin-top:12px">${I.info}<span>${esc(r.note_tr)}</span></div>` : ''}
        </section>` : ''}`;
      return;
    }
    const r = wr.res, wc = wr.text.split(/\s+/).filter(Boolean).length;
    view('write').innerHTML = head + `
      <section class="card stack">
        <div class="row"><span class="chip accent">Prompt</span><span class="spacer"></span><button class="btn sm ghost" data-act="new-prompt">${I.shuffle} Another prompt</button></div>
        <p style="font-family:var(--f-sub);font-style:italic;font-size:24px;line-height:1.3">${esc(wr.prompt)}</p>
        <div class="field"><label for="wr-text">Your text (aim for 120 to 200 words)</label><textarea class="input" id="wr-text" rows="9" placeholder="Start writing…">${esc(wr.text)}</textarea></div>
        <div class="row"><span class="mono muted" id="wr-wc">${wc} words</span><button class="btn sm" data-act="mic-into" data-target="#wr-text">${I.mic} Dictate</button><span class="spacer"></span><button class="btn primary" data-act="write-eval" ${AI.state === 'on' && !wr.busy ? '' : 'disabled'}>${wr.busy ? 'Reading…' : I.spark + ' Get feedback'}</button></div>
        ${aiNote()}
      </section>
      ${r ? `<section class="card raised stack">
        <div class="row" style="align-items:flex-end;gap:18px"><div><div class="eyebrow">Estimated level</div><div class="level-badge">${esc(r.level)}</div></div><p class="muted" style="flex:1;min-width:220px">${esc(r.summary_tr)}</p></div>
        ${(r.issues || []).length ? `<div><b>Fixes</b>${r.issues.map((x) => `<div class="issue"><span class="o">${esc(x.original)}</span><span class="f">${esc(x.fix)}</span><span class="why">${esc(x.why_tr)}</span></div>`).join('')}</div>` : ''}
        <div><div class="row" style="margin-bottom:8px"><b>C1 rewrite</b>${sayBtn(r.rewrite, 'Listen & shadow')}</div><p class="rewrite">${esc(r.rewrite)}</p></div>
        ${(r.phrases || []).length ? `<div><b>Phrases worth stealing</b>${r.phrases.map((p) => `<div class="phrase">${sayBtn(p.en, '', '', 'btn ghost icon-btn sm')}<div><div class="en">${esc(p.en)}</div><div class="tr">${esc(p.tr)}</div></div><button class="btn ghost icon-btn sm" data-act="vault-add" data-en="${esc(p.en)}" data-tr="${esc(p.tr)}" aria-label="Add to Vault">${I.plus}</button></div>`).join('')}</div>` : ''}
      </section>` : ''}`;
  };
  async function writeEval(btn) {
    const wr = U.wr, text = wr.text.trim();
    if (text.split(/\s+/).length < 30) { toast('Write at least 30 words so the coach has something to work with.'); return; }
    wr.busy = true; btn.disabled = true; btn.textContent = 'Reading…';
    try {
      const ln = Lang.explain();
      wr.res = await AI.ask(`${ctx()}\nWriting prompt: "${wr.prompt}"\nLearner's text:\n"""${text}"""\n\nAnswer with ONLY JSON:\n{"level": "CEFR estimate like B2 or B2+", "summary_tr": "2 sentences in ${ln}: main strength and main thing to improve", "issues": [{"original": "exact phrase from the text", "fix": "corrected or more natural version", "why_tr": "short reason in ${ln}"}], "rewrite": "the whole text rewritten at natural C1 level, same ideas, similar length", "phrases": [{"en": "...", "tr": "meaning in ${ln}"}]}\nList at most 6 issues, most important first, and exactly 4 phrases from the rewrite.`);
      gain(15, 'written', btn);
    } catch (e) { aiError(e); }
    finally { wr.busy = false; R.write(); }
  }
  async function naturalEval() {
    const wr = U.wr, ta = $('#nat-in');
    wr.nat = ta.value.trim();
    if (!wr.nat) { toast('Type a sentence first.'); return; }
    wr.natBusy = true; R.write();
    try {
      wr.natRes = await AI.ask(`${ctx()}\nThe learner wants to express this (it may be ${Lang.native()} or imperfect English):\n"""${wr.nat}"""\n\nGive the most natural way a fluent speaker would say it in three registers. Answer with ONLY JSON:\n{"casual": "to a friend", "neutral": "at work, spoken", "formal": "in a formal email", "note_tr": "1-2 sentences in ${Lang.explain()} about a key word choice or common mistake"}`, 'quick');
      gain(3, null, $('#nat-in'));
    } catch (e) { aiError(e); }
    finally { wr.natBusy = false; R.write(); }
  }

  /* ================= Traps ================= */
  function newTrapRound() { U.tp = { order: shuffle(D.traps.map((_, i) => i)), i: 0, score: 0, answered: null, flip: Math.random() < .5 }; }
  R.traps = () => {
    if (!U.tp) newTrapRound();
    const tp = U.tp, total = tp.order.length, finished = tp.i >= total;
    let quiz;
    if (finished) {
      quiz = `<section class="card raised empty"><div class="score" style="color:var(--accent)">${tp.score}/${total}</div><h3 style="margin-top:10px">${tp.score >= 20 ? 'You rarely fall for these.' : tp.score >= 14 ? 'Solid. A few traps still catch you.' : 'These traps catch you often. Run it again tomorrow.'}</h3><p>Best: ${S.trapBest}/${total}</p><div class="row" style="justify-content:center;margin-top:14px"><button class="btn primary" data-act="trap-restart">Play again</button></div></section>`;
    } else {
      const t = D.traps[tp.order[tp.i]], opts = tp.flip ? [t.b, t.a] : [t.a, t.b];
      quiz = `<div class="quiz">
        <div class="row"><span class="mono muted">Question ${tp.i + 1} of ${total}</span><span class="spacer"></span><span class="chip accent">Score ${tp.score}</span></div>
        <div class="progress"><i style="width:${(tp.i / total) * 100}%"></i></div>
        <h2 style="font-size:22px;margin-top:6px">Which one sounds right?</h2>
        ${opts.map((o, i) => { const right = o === t.a; const cls = tp.answered === null ? '' : right ? ' right' : tp.answered === i ? ' wrong' : ''; return `<button class="opt${cls}" data-act="trap-answer" data-i="${i}" ${tp.answered !== null ? 'disabled' : ''}><span>${esc(o)}</span>${tp.answered !== null && right ? '<span class="chip good">Correct</span>' : ''}</button>`; }).join('')}
        ${tp.answered !== null ? `<div class="explain"><p>${esc(t.why)}</p><div class="row" style="margin-top:12px">${sayBtn(t.a, 'Hear it')}<span class="spacer"></span><button class="btn dark" data-act="trap-next">${tp.i === total - 1 ? 'See score' : 'Next'} ${I.next}</button></div></div>` : ''}
      </div>`;
    }
    view('traps').innerHTML = `
      <header class="page-head">
        <div class="eyebrow"><span>${trapsName()}</span><span>·</span><b>Best ${S.trapBest}/${D.traps.length}</b></div>
        <h1 class="h-rise">${words('The mistakes')} <span class="sub">${words(Lang.native() === 'Turkish' ? 'your Turkish makes for you.' : 'your first language makes for you.', 140)}</span></h1>
        <p class="lead">Bunlar bilgi eksikliği değil, Türkçenin İngilizceye sızması. Anladığında fark etmezsin, konuşurken ağzından çıkar. Hızlı karar ver: konuşurken düşünmeye vaktin olmayacak.</p>
        ${Lang.native() === 'Turkish' ? '' : `<div class="note">${I.info}<span>These traps were collected from Turkish speakers. Many catch ${esc(Lang.native())} speakers too. For the ones typical of ${esc(Lang.native())}, ask your coach: role-play and writing feedback already look for them.</span></div>`}
      </header>
      ${quiz}
      <details class="card"><summary style="cursor:pointer;font-weight:650">All ${D.traps.length} traps at a glance</summary>
        <div style="margin-top:10px">${D.traps.map((t) => `<div class="issue"><span class="o">${esc(t.b)}</span><span class="f">${esc(t.a)}</span><span class="why">${esc(t.why)}</span></div>`).join('')}</div>
      </details>`;
  };

  /* ================= Library ================= */
  R.library = () => {
    const L = D.library;
    const res = (x) => `<a class="res" href="${x.u}" target="_blank" rel="noopener noreferrer"><b>${esc(x.n)}<span>open ↗</span></b><p>${esc(x.why)}</p></a>`;
    view('library').innerHTML = `
      <header class="page-head">
        <div class="eyebrow"><span>Immersion</span><span>·</span><b>Input you will actually enjoy</b></div>
        <h1 class="h-rise">${words('Watch like a')} <span class="sub">${words('student,', 140)}</span> ${words('not a fan.', 220)}</h1>
        <p class="lead">Dizi izlemek seni zaten B2'ye getirdi. C1 için izleme şeklini değiştir: pasif izleme yerine aktif avcılık. Her hafta farklı bir tür ve aksan ekle.</p>
      </header>
      <section class="card stack">
        <div class="section-title"><h2>How to watch actively</h2><span class="mono">5 rules</span></div>
        <ol class="method">${L.method.map((m) => `<li>${esc(m)}</li>`).join('')}</ol>
      </section>
      <section class="card">
        <div class="section-title" style="margin-bottom:6px"><h2>The series ladder</h2><span class="mono">Easy → hard</span></div>
        <div class="ladder">${L.shows.map((s) => `<div class="lad"><b>${esc(s.n)}</b><span class="meter" aria-label="Difficulty ${s.lv} of 5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= s.lv ? 'on' : ''}"></i>`).join('')}</span><p class="muted">${esc(s.why)}</p></div>`).join('')}</div>
      </section>
      <section class="grid g3">
        <div class="card"><div class="section-title" style="margin-bottom:6px"><h2 style="font-size:19px">Podcasts</h2></div>${L.podcasts.map(res).join('')}</div>
        <div class="card"><div class="section-title" style="margin-bottom:6px"><h2 style="font-size:19px">YouTube</h2></div>${L.youtube.map(res).join('')}</div>
        <div class="card"><div class="section-title" style="margin-bottom:6px"><h2 style="font-size:19px">Tools &amp; people</h2></div>${L.tools.map(res).join('')}</div>
      </section>
      <div class="note">${I.info}<span><b>Cihazlarını İngilizceye çevir.</b> Telefon, bilgisayar, Netflix arayüzü. Günde yüzlerce küçük input, sıfır ekstra efor.</span></div>`;
  };

  /* ================= Preferences ================= */
  function fillVoices() {
    const sel = $('#p-voice'); if (!sel) return;
    const curV = TTS.voice(), cur = curV?.name || '';
    const list = TTS.ranked();
    // Keep a hand-picked voice selectable even if it is one we would never choose.
    if (curV && !list.includes(curV)) list.push(curV);
    sel.innerHTML = list.length
      ? list.map((v) => `<option value="${esc(v.name)}"${v.name === cur ? ' selected' : ''}>${TTS.natural(v) ? '★ ' : ''}${esc(v.name)} · ${esc(v.lang)}</option>`).join('')
      : '<option value="">No English voices found</option>';
    const hint = $('#voice-hint'); if (!hint) return;
    const hasNatural = TTS.voices.some((v) => TTS.natural(v));
    const mac = /Mac/i.test(navigator.platform || navigator.userAgent);
    hint.innerHTML = !TTS.voices.length ? '' : TTS.natural(curV)
      ? `${I.check}<span><b>Doğal bir ses kullanıyorsun.</b> ★ işaretli sesler en doğal olanlar.</span>`
      : hasNatural
        ? `${I.info}<span>Listede ★ işaretli, daha doğal sesler var. Birini seç ve "Test voice" ile dinle.</span>`
        : mac
          ? `${I.info}<span><b>Bu Mac'te doğal (Premium) İngilizce ses yüklü değil</b>, bu yüzden ses biraz robotik. Ücretsiz indirmek için: System Settings → Accessibility → Read &amp; Speak (Spoken Content) → System voice → Manage Voices → English. <b>Zoe (Premium)</b>, <b>Ava (Premium)</b> ya da İngiliz aksanı için <b>Jamie (Premium)</b> / <b>Serena (Premium)</b> seç. Sonra bu sayfayı yenile; uygulama en doğal sesi kendisi seçer.</span>`
          : `${I.info}<span><b>Bu cihazda doğal bir İngilizce ses bulunamadı.</b> Windows'ta Microsoft Edge'in "Natural" sesleri, diğer yerlerde Chrome'un Google sesleri daha doğaldır.</span>`;
    hint.hidden = !hint.innerHTML;
  }
  R.prefs = () => {
    const nat = Lang.native(), sameAs = S.native ? nat : (Lang.coach() || Lang.coachNative() || 'Turkish');
    const langCard = `
        <div class="card stack" data-notx>
          <h3>Your language</h3>
          <div class="field"><label for="p-native">Native language</label><select class="input" id="p-native" data-pref="native">
            ${S.native ? '' : `<option value="" selected>${Lang.coachNative() ? `From your coach profile (${esc(Lang.coachNative())})` : 'Not set (Turkish)'}</option>`}
            ${langOptions(S.native, { english: false })}<option value="__other">Other…</option>
          </select></div>
          <div class="field" id="p-native-other" hidden><label for="p-native-o">Your language, in English</label><input class="input" id="p-native-o" maxlength="30" autocomplete="off" placeholder="e.g. Swahili" data-pref="nativeOther"></div>
          <div class="field"><label for="p-lang">Explanations &amp; translations in</label><select class="input" id="p-lang" data-pref="lang">
            <option value=""${S.lang ? '' : ' selected'}>${S.native ? 'My native language' : Lang.coach() ? 'From your coach profile' : 'Same as native'} (${esc(sameAs)})</option>
            ${langOptions(S.lang)}
          </select></div>
          <p class="muted" style="font-size:14px">The AI coach writes every tip, correction and meaning in ${esc(Lang.explain())}. The course notes were written in Turkish${Tx.on() ? `, so the AI coach translates them into ${esc(Lang.explain())} as you open each page and keeps the translations in this browser` : ''}.${L.local ? ' Your agent coach reads <code>native_language</code> and <code>explain_in</code> in <code>learner/profile.json</code>; tell it if you want those changed too.' : ''}</p>
        </div>`;
    view('prefs').innerHTML = `
      <header class="page-head">
        <div class="eyebrow"><span>Preferences</span></div>
        <h1 class="h-rise">${words('Make it')} <span class="sub">${words('yours.', 140)}</span></h1>
      </header>
      <section class="grid g2">
        <div class="card stack">
          <h3>You &amp; your plan</h3>
          <div class="field"><label for="p-name">Your name</label><input class="input" id="p-name" value="${esc(S.name)}" data-pref="name"></div>
          <div class="field"><label for="p-start">Plan start date</label><input class="input" type="date" id="p-start" value="${esc(S.start)}" data-pref="start"></div>
          <p class="muted" style="font-size:14px">Hafta numaran bu tarihten hesaplanır. Şu an: Week ${weekNow()}.</p>
        </div>
        ${langCard}
        <div class="card stack">
          <h3>Voice</h3>
          <div class="stack" style="gap:8px">
            <div class="nv-line" data-nv>${nvStatus()}</div>
            <p class="muted" style="font-size:14px">Natural voices run on your computer, in the browser. The model downloads once from Hugging Face and stays cached; what you hear is generated here and never sent anywhere. Each role-play character gets their own voice.</p>
            <div class="field"><label for="p-nv">Natural voice for phrases and drills</label><select class="input" id="p-nv" data-pref="nvVoice">
              <option value=""${S.nvVoice ? '' : ' selected'}>Automatic (${L.profile?.variant && String(L.profile.variant).toLowerCase().startsWith('amer') ? 'Heart · American' : 'Emma · British'})</option>
              ${NV_PICKS.map(([id, n]) => `<option value="${id}"${S.nvVoice === id ? ' selected' : ''}>${n}</option>`).join('')}
            </select></div>
          </div>
          <div class="field"><label for="p-voice">System voice (used when natural voices are off)</label><select class="input" id="p-voice" data-pref="voice"></select></div>
          <div class="field"><label for="p-rate">Speed: <span id="p-rate-v">${S.rate.toFixed(2)}×</span></label><input type="range" id="p-rate" min="0.6" max="1.2" step="0.05" value="${S.rate}" data-pref="rate"></div>
          <label class="goal"><input type="checkbox" id="p-auto" data-pref="autoSpeak"${S.autoSpeak ? ' checked' : ''}><span>Read role-play replies aloud</span></label>
          <div class="row"><button class="btn" data-act="say" data-text="Hi! This is how I sound. Could you understand everything I said?">${I.play} Test voice</button></div>
          <div class="note" id="voice-hint"></div>
        </div>
        <div class="card stack">
          <h3>Coach, sync &amp; backup</h3>
          <div class="row">${$('#sync-pill').outerHTML.replace('id="sync-pill"', '')}${$('#ai-pill').outerHTML.replace('id="ai-pill"', '')}</div>
          <p class="muted" style="font-size:14px">AI agent bağlantısı, ilerlemenin nerede saklandığı, yedek alma ve geri yükleme artık Connect sayfasında.</p>
          <div class="row"><a class="btn" href="#connect">Open Connect →</a></div>
        </div>
        <div class="card stack">
          <h3>Microphone</h3>
          <p class="muted" style="font-size:14px">Mikrofon bu sayfa içinde engelli olabilir: o zaman klavyedeki dikteyi kullan (Mac'te Fn tuşuna iki kez bas, telefonda klavyedeki mikrofon).</p>
        </div>
      </section>
      <p class="muted" data-notx style="font-size:13px;margin-top:24px">© 2026 devcerscodes · Second Voice is free software: you can share and change it under the <a href="${REPO}/blob/main/LICENSE" target="_blank" rel="noopener">GNU AGPL v3.0</a>. It comes with no warranty. <a href="${REPO}" target="_blank" rel="noopener">Source code</a></p>`;
    fillVoices();
  };

  /* ================= Connect =================
     Where the AI comes from and where progress is kept. The page can't see the agent itself:
     it only sees the files the agent writes in learner/, and the agent signs them in brain.coach. */
  const AGENTS = [
    { id: 'claude', name: 'Claude Code', cmd: 'claude', acct: '/status', acctNote: 'agent içinde yaz' },
    { id: 'codex', name: 'Codex', cmd: 'codex', acct: 'codex login status', acctNote: 'terminalde çalıştır' },
    { id: 'gemini', name: 'Gemini CLI', cmd: 'gemini', acct: '', acctNote: '' },
    { id: 'cursor', name: 'Cursor', cmd: '', acct: '', acctNote: '' }
  ];
  const copyBtn = (text, label = '') => `<button class="btn sm cmd" data-act="copy" data-text="${esc(text)}" title="Copy">${label || `<code>${esc(text)}</code>`}<span class="cmd-ico" aria-hidden="true">⧉</span></button>`;
  function backupSummary(o) {
    const n = (x) => (x && typeof x === 'object' ? (Array.isArray(x) ? x.length : Object.keys(x).length) : 0);
    const when = +o.updated ? new Date(+o.updated).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    return [`${n(o.days)} active days`, `${n(o.lexicon)} Word Lab words`, `${n(o.cards)} Vault cards practised`, n(o.custom) && `${n(o.custom)} own phrases`, when && `last change ${when}`].filter(Boolean).join(' · ');
  }
  /* A backup is the state object itself (what "Copy as text" and "Download progress" produce). */
  function parseBackup(txt) {
    try {
      const o = JSON.parse(String(txt || ''));
      return o && typeof o === 'object' && !Array.isArray(o) && o.days && typeof o.days === 'object' ? o : null;
    } catch { return null; }
  }
  function restoreBackup(o) {
    S = normalize(o); U.w.queue = null; U.lab.quiz = null; U.lab.entry = null;
    saveLex(); toast(`Backup restored: ${backupSummary(S)}.`, 5000); rerender();
  }
  R.connect = () => {
    const ag = L.agent(), up = ageLabel(L.brain?.updated || L.backlog?.updated);
    const aiOn = AI.state === 'on', pending = AI.state === 'pending';
    const known = AGENTS.find((a) => ag.name && a.name.toLowerCase() === ag.name.toLowerCase());
    const sel = U.cn.agent || known?.id || 'claude', A0 = AGENTS.find((a) => a.id === sel) || AGENTS[0];

    /* 1. The three connections, the same ones the sidebar pills show. */
    const coachCard = (() => {
      if (!L.local) return { dot: '', state: 'Only on your computer', body: `<p>Agent koç, uygulama bilgisayarında çalışırken (<code>npm run dev</code>, localhost) bağlanır. Bu sayfa claude.ai'de açık olduğu için burada görünmez.</p>` };
      if (L.state === 'bad') return { dot: 'warn', state: `Can't read ${esc(L.err)}`, body: `<p><code>learner/${esc(L.err)}</code> geçerli bir JSON değil. Agent'ına şunu söyle: <i>"learner/${esc(L.err)} is broken, please repair it."</i></p>` };
      if (!L.on()) return { dot: '', state: 'Not connected yet', body: `<p>Henüz bir agent <code>learner/</code> dosyalarını yazmadı. Aşağıdaki adımları izle, iki dakika sürer.</p>` };
      return {
        dot: 'on', state: ag.name ? esc(ag.name) : 'Connected',
        body: `<dl class="kv">
            <dt>Agent</dt><dd>${ag.name ? esc(ag.name) : '<span class="muted">Adını henüz yazmadı. Bir sonraki aktiviteden sonra görünür.</span>'}</dd>
            <dt>Last active</dt><dd>${esc(ageLabel(ag.seen) || up || '—')}</dd>
            <dt>Account</dt><dd>${known?.acct ? `Sayfa bunu göremez. Kontrol için ${copyBtn(known.acct)} <span class="muted">(${known.acctNote})</span>` : '<span class="muted">Sayfa bunu göremez. Agent\'ın ayarlarında kontrol et.</span>'}</dd>
          </dl>`
      };
    })();
    const aiCard = aiOn && AI.via
      ? { dot: 'on', state: esc(AI.via.name), body: `<dl class="kv"><dt>Runs on</dt><dd>${esc(AI.via.name)}, bu bilgisayarda</dd><dt>Account</dt><dd>Agent'ın kendi girişi. API anahtarı gerekmez.</dd></dl><p class="muted">Word Lab araması, role-play sohbeti ve yazı geri bildirimi <code>npm run dev</code> üzerinden agent'ına gider. Başka bir agent seçmek için: <code>SV_AGENT=codex npm run dev</code>.</p>` }
      : aiOn
      ? { dot: 'on', state: 'Ready', body: `<dl class="kv"><dt>Runs on</dt><dd>claude.ai, Claude hesabınla</dd><dt>Signed in as</dt><dd>${Cloud.who ? esc(Cloud.who) : '<span class="muted">Claude hesabın (ad bu sayfayla paylaşılmadı)</span>'}</dd></dl><p class="muted">Word Lab araması, role-play sohbeti ve yazı geri bildirimi bununla çalışır.</p>` }
      : pending ? { dot: '', state: 'Connecting…', body: '<p>claude.ai bağlantısı bekleniyor.</p>' }
      : L.local ? { dot: 'warn', state: 'No agent found', body: `<p>Sayfa içi koç (Word Lab araması, role-play sohbeti, yazı geri bildirimi) bilgisayarındaki agent ile çalışır, ama <code>npm run dev</code> Claude Code, Codex ya da Gemini CLI bulamadı. Birini kurup giriş yap ve sunucuyu yeniden başlat.</p>` }
      : { dot: 'warn', state: 'Offline', body: '<p>Yapay zekâ izni verilmedi ya da bağlantı kurulamadı. Sayfayı yenile; izin sorulursa onayla.</p>' };
    const syncCard = Cloud.state === 'cloud'
      ? { dot: 'on', state: 'Synced to your account', body: '<p>İlerlemen claude.ai hesabına kaydediliyor. Bu linki açtığın her cihazda aynı.</p>' }
      : Cloud.state === 'offline'
        ? { dot: 'warn', state: 'Sync paused', body: '<p>Hesaba bağlanılamadı. İlerlemen şimdilik bu tarayıcıda; bağlantı gelince eşitlenir.</p>' }
        : { dot: '', state: 'This browser only', body: `<p>İlerlemen bu tarayıcıda, <code>${esc(location.host || 'this page')}</code> adresine bağlı olarak saklanıyor. Başka tarayıcı ya da adres onu görmez. Taşımak için aşağıdan yedek indir.</p>` };
    const tile = (k, title, c) => `
      <article class="card conn-card" data-conn="${k}">
        <div class="conn-top"><span class="mono">${title}</span><span class="pill"><span class="dot ${c.dot}"></span><span>${c.state}</span></span></div>
        <div class="conn-body">${c.body}</div>
      </article>`;

    /* 2. The guide. Step 0 is done when the page already runs locally. */
    const steps = [
      { done: L.local, t: 'Run the app on your computer', d: `Second Voice klasöründe bir terminal aç ve sunucuyu başlat, sonra <code>http://localhost:5173</code> adresini aç.${L.local ? ' <b>Şu an buradasın.</b>' : ''}`, act: copyBtn('npm run dev') },
      { done: L.on(), t: `Open ${esc(A0.name)} in the same folder`, d: A0.cmd ? `Aynı klasörde ikinci bir terminal aç ve ${esc(A0.name)}'u başlat. Koç talimatlarını (<code>AGENTS.md</code>) kendisi okur, API anahtarı gerekmez.` : `${esc(A0.name)}'da <b>File → Open Folder</b> ile Second Voice klasörünü aç, sonra sohbet panelini kullan. Koç talimatlarını (<code>AGENTS.md</code>) kendisi okur.`, act: A0.cmd ? copyBtn(A0.cmd) : '' },
      { done: L.on(), t: 'Say “start”', d: 'Koç birkaç soru sorar, kısa bir seviye ölçümü yapar ve <code>learner/</code> klasörünü kurar. Hafızası bu dosyalardır.', act: copyBtn('start') },
      { done: L.on(), t: 'Come back to this tab', d: 'Sayfa <code>learner/</code> dosyalarını kendisi okur. Sekmeye dönünce soldaki rozet yeşile döner ve agent\'ın adı görünür.', act: L.local ? `<button class="btn sm" data-act="coach-check">Check now</button>` : '' }
    ];
    const guide = `
      <section class="card stack conn-guide" id="guide">
        <div class="section-title"><h2>Connect an AI agent</h2><span class="mono">${L.on() ? 'connected' : 'about 2 minutes'}</span></div>
        <p class="muted">Koç, zaten kullandığın AI agent'ı. Agent bu klasördeki dosyaları okuyup yazar, sayfa da bu dosyaları gösterir. Ayrı bir hesap, sunucu ya da API anahtarı yok.</p>
        <div class="agent-pick" role="radiogroup" aria-label="Your AI agent">${AGENTS.map((a) => `<button role="radio" aria-checked="${a.id === sel}" data-act="cn-agent" data-id="${a.id}">${esc(a.name)}</button>`).join('')}</div>
        <ol class="cn-steps">${steps.map((s, i) => `
          <li class="${s.done ? 'done' : ''}">
            <span class="step-n" aria-hidden="true">${s.done ? I.check : i + 1}</span>
            <div class="step-b"><b>${s.t}</b><p class="muted">${s.d}</p></div>
            <div class="step-a">${s.act}</div>
          </li>`).join('')}
        </ol>
        <div class="stack" style="gap:8px">
          <span class="mono muted">Then, any day · say these to your agent</span>
          <div class="row" style="gap:6px">${['today', 'roleplay', 'check my writing', 'review my words', 'weekly review', 'wrap up'].map((x) => copyBtn(x)).join('')}</div>
        </div>
      </section>`;

    /* 3. Where each kind of data lives. */
    const where = [
      { on: true, t: 'This browser', what: 'Today görevleri, Vault kartları, Word Lab kelimeleri, quiz skorları, ses ayarları', fmt: `JSON · localStorage <code>${LS}</code>`, note: `Adrese bağlı: <code>${esc(location.host || 'this page')}</code>. localhost ile claude.ai birbirini görmez.` },
      { on: Cloud.state === 'cloud', t: 'Your claude.ai account', what: 'Tarayıcıdakinin aynısı, cihazlar arası eşitlenir', fmt: 'JSON · sayfanın veritabanı, sadece sana açık', note: 'Sadece sayfa claude.ai\'de açıkken.' },
      { on: L.on(), t: 'learner/ folder', what: 'Koçun hafızası: profil, hatalar, kelimeler, sıradaki işler, günlükler', fmt: 'JSON + Markdown · <code>profile.json</code> <code>brain.json</code> <code>backlog.json</code> <code>journal/*.md</code> <code>reviews/*.md</code>', note: 'Agent yazar, sayfa sadece okur. Bilgisayarında kalır, git\'e girmez.' }
    ];
    const pend = U.cn.pending;

    view('connect').innerHTML = `
      <header class="page-head">
        <div class="eyebrow"><span>Connect</span><b>${[L.on() ? 'agent connected' : L.local ? 'agent not connected' : '', aiOn ? 'in-page AI on' : '', Cloud.state === 'cloud' ? 'synced' : 'saved in this browser'].filter(Boolean).join(' · ')}</b></div>
        <h1 class="h-rise">${words('Connect your coach.')} <span class="sub">${words('See where it all lives.', 140)}</span></h1>
        <p class="lead">Second Voice iki yerden yapay zekâ alır: bilgisayarındaki AI agent ve claude.ai'deki sayfa içi koç. İlerlemen de üç yerde durabilir. Hepsi burada.</p>
      </header>
      <section class="conn-grid">
        ${tile('coach', 'AI agent coach', coachCard)}
        ${tile('ai', AI.via ? 'In-page AI · your agent' : 'In-page AI · claude.ai', aiCard)}
        ${tile('sync', 'Progress', syncCard)}
      </section>
      ${guide}
      <section class="stack">
        <div class="section-title"><h2>Where your data lives</h2><span class="mono">plain JSON and Markdown</span></div>
        <div class="cn-where">${where.map((w) => `
          <div class="where-row${w.on ? ' on' : ''}">
            <div class="where-t"><b>${w.t}</b>${w.on ? '<span class="chip good">in use</span>' : '<span class="chip">not here</span>'}</div>
            <div class="where-what">${w.what}</div>
            <div class="where-fmt mono">${w.fmt}</div>
            <div class="where-note muted">${w.note}</div>
          </div>`).join('')}
        </div>
      </section>
      <section class="card stack" id="backup">
        <div class="section-title"><h2>Back up &amp; move</h2><span class="mono">${esc(backupSummary(S))}</span></div>
        <p class="muted">İlerlemeni tek bir <code>.json</code> dosyası olarak indir. Başka bir tarayıcıya, bilgisayara ya da localhost ile claude.ai arasında taşımak için orada geri yükle. <code>learner/</code> klasörü bu dosyaya dahil değil: o zaten bilgisayarındaki dosyalar.</p>
        <div class="row">
          <button class="btn primary" data-act="backup-download">${I.plus} Download progress</button>
          <label class="btn">Restore from file…<input type="file" accept=".json,application/json" data-file="restore" hidden></label>
          <button class="btn ghost" data-act="export">Copy as text</button>
        </div>
        ${pend ? `
          <div class="restore-box">
            <div><b>${esc(U.cn.pendingName)}</b><div class="muted">${esc(backupSummary(pend))}</div></div>
            <p class="muted">Geri yüklersen bu tarayıcıdaki ilerlemenin yerine geçer${Cloud.state === 'cloud' ? ' ve hesabına da eşitlenir' : ''}. Önce mevcut olanı indirmen iyi olur.</p>
            <div class="row"><button class="btn primary" data-act="backup-restore">Replace my progress</button><button class="btn ghost" data-act="backup-cancel">Cancel</button></div>
          </div>` : ''}
        <details class="paste">
          <summary>Paste a backup as text</summary>
          <div class="stack" style="margin-top:10px">
            <textarea class="input" id="p-import" rows="3" placeholder='{"v":1, ...}'></textarea>
            <div class="row"><button class="btn" data-act="import">Restore from text</button><span class="spacer"></span><button class="btn ghost" data-act="reset" style="color:var(--bad)">Erase all progress</button></div>
          </div>
        </details>
      </section>`;
  };

  /* ================= Actions ================= */
  const A = {
    say(t) {
      queueId++;
      const text = t.dataset.text; const rate = t.dataset.rate ? +t.dataset.rate : undefined;
      const k = t.dataset.kara ? $(t.dataset.kara) : null;
      if (k) sayKaraoke(k, text, rate); else TTS.speak(text, { rate, voice: t.dataset.voice || '' });
    },
    task(t) {
      const id = t.dataset.id, d = day(), on = !d.tasks[id];
      if (on) d.tasks[id] = true; else delete d.tasks[id];
      const row = t.closest('.task'); row.classList.toggle('done', on); t.setAttribute('aria-pressed', on);
      gain(on ? 10 : -10, null, t);
      const tasks = tasksFor(todayKey()), n = tasks.filter((x) => d.tasks[x.id]).length;
      $('#task-bar').style.width = (n / tasks.length) * 100 + '%';
      $('#task-count').textContent = `${n}/${tasks.length} done · about ${tasks.reduce((a, x) => a + x.min, 0)} min`;
      $('#xp-today').textContent = d.xp;
      if (on && n === tasks.length) { toast('Session complete. That is how fluency is built: one ordinary day at a time.'); burst($('#task-bar'), 0); }
    },
    goal(t) {
      const on = t.checked; if (on) S.goals[t.dataset.id] = true; else delete S.goals[t.dataset.id];
      t.closest('.goal').classList.toggle('on', on);
      const w = +t.dataset.week, wk = D.weeks[w - 1], n = wk.goals.filter((_, i) => S.goals[`${w}-${i}`]).length;
      const chip = $(`[data-wcount="${w}"]`); chip.textContent = `${n}/${wk.goals.length}`; chip.classList.toggle('good', n === wk.goals.length);
      $('#week-' + w).classList.toggle('complete', n === wk.goals.length);
      gain(on ? 5 : -5, null, on ? t : null);
    },
    tab(t) {
      const g = t.dataset.group, k = t.dataset.tab;
      if (g === 'speak') { U.speak.tab = k; if (k !== 'cue') stopCue(); }
      if (g === 'shadow') U.sh.tab = k;
      if (g === 'words') { U.w.tab = k; U.w.queue = null; U.w.flipped = false; }
      if (g === 'write') U.wr.tab = k;
      if (g === 'lab') U.lab.tab = k;
      TTS.stop(); R[current]();
    },
    'plan-area'(t) {
      const a = D.areas.find((x) => x.id === t.dataset.id);
      if (!a || U.plan.area === a.id) return;
      U.plan.area = a.id;
      $$('.area-tab').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.id === a.id)));
      $$('.dose button').forEach((b) => b.classList.toggle('on', b.dataset.id === a.id));
      $('#area-panel').outerHTML = areaPanel(a);
    },
    'plan-go'(t) {
      const to = t.dataset.to, tab = t.dataset.tab;
      if (to === 'speak' && tab) { U.speak.tab = tab; U.speak.scen = null; }
      location.hash = to; window.scrollTo(0, 0);
    },
    async 'coach-copy'(t) {
      const text = t.dataset.text || '';
      try { await navigator.clipboard.writeText(text); toast(`Copied “${text}”. Paste it into your AI agent.`); }
      catch { toast(`Type this into your AI agent: ${text}`, 6000); }
    },
    'vault-add'(t) { if (addToVault(t.dataset.en, Tx.text(t.dataset.tr), t.dataset.ex)) burst(t, 0); },
    'quick-scene'() { U.speak.tab = 'roles'; const sc = pick(D.scenarios); location.hash = 'speak'; setTimeout(() => openScene(sc), 0); },
    'quick-pairs'() { U.sh.tab = 'pairs'; },
    scene(t) { const sc = D.scenarios.find((s) => s.id === t.dataset.id) || D.weeks[weekNow() - 1].speak.map(sceneFromLabel).find((s) => s && s.id === t.dataset.id); if (sc) { openScene(sc); window.scrollTo(0, 0); } },
    free(t) { openScene(freeScene(t.dataset.topic)); window.scrollTo(0, 0); },
    'leave-scene'() { hushScene(); U.speak.scen = null; R.speak(); },
    'restart-scene'() { hushScene(); U.speak.msgs = []; goLive(); },
    'go-live'() { goLive(); },
    'pb-open'(t) { Object.assign(U.speak, { tab: 'book' }); Object.assign(U.pb, { sel: t.dataset.id, q: '' }); TTS.stop(); R.speak(); window.scrollTo(0, 0); },
    'pb-sel'(t) { U.pb.sel = t.dataset.id; U.pb.q = ''; const inp = $('#pb-search'); if (inp) inp.value = ''; queueId++; TTS.stop(); renderPb(); },
    'pb-play'(t) {
      const s = D.phrasebook.find((x) => x.id === t.dataset.s); if (!s) return;
      const groups = t.dataset.g === 'all' ? s.groups.map((g, gi) => [g, gi]) : [[s.groups[+t.dataset.g], +t.dataset.g]];
      const items = [];
      groups.forEach(([g, gi]) => g.p.forEach((p, i) => items.push({ text: p[0], el: $(`[data-pb="${s.id}-${gi}-${i}"]`) })));
      playQueue(items);
    },
    'show-brief'() { hushScene(); U.speak.stage = 'brief'; R.speak(); window.scrollTo(0, 0); },
    'nv-start'() { NV.start(); },
    'talk-open'(t) { hushScene(); U.speak.log = t.dataset.id; R.speak(); window.scrollTo(0, 0); },
    'talk-close'() { TTS.stop(); U.speak.log = null; R.speak(); },
    'talk-del'(t) {
      const i = S.talks.findIndex((x) => x.id === t.dataset.id); if (i < 0) return;
      if (!confirm('Delete this saved conversation? This cannot be undone.')) return;
      S.talks.splice(i, 1); save(); U.speak.log = null; R.speak(); toast('Conversation deleted.');
    },
    'talk-review'(t) { const c = S.talks.find((x) => x.id === t.dataset.id); if (c) reviewTalk(c); },
    'talks-all'() { U.speak.allTalks = !U.speak.allTalks; R.speak(); },
    /* The big mic: start talking, cut in while the partner speaks, or finish your turn. */
    talk() {
      const sp = U.speak;
      if (Mic.rec) { Mic.stop(); return; }
      if (sp.busy) return;
      if (!SR || micBlocked) { dictationHint(); $('#say-input')?.focus(); return; }
      if (sp.phase === 'partner') { sp.turn++; TTS.stop(); }
      listenTurn();
    },
    'hands-free'(t) { S.handsFree = t.checked; save(); setPhase(U.speak.phase || 'idle'); },
    'fix-say'(t) {
      const f = U.speak.summary?.fixes?.[+t.dataset.i]; if (!f) return;
      TTS.stop();
      const out = $(`#fix-try-${t.dataset.i}`);
      Mic.start(t, (txt) => { if (out) out.innerHTML = `<span class="chip accent">Listening… ${esc(txt)}</span>`; }, (said) => {
        if (!said) { if (out) out.innerHTML = f.try ? tryHTML(f.try) : ''; return; }
        f.try = { ...compare(f.better, said), heard: said };
        if (f.try.score >= 80 && !f.passed) { f.passed = true; gain(3, 'spoken', t); }
        if (out) out.innerHTML = tryHTML(f.try);
      });
    },
    'lab-look'(t) { lookup(t.dataset.q); window.scrollTo(0, 0); },
    'lab-save'(t) { toggleSave(t); },
    'lab-open'(t) { const e = S.lexicon.find((x) => x.id === t.dataset.id); if (!e) return; Object.assign(U.lab, { entry: e, tab: 'look', q: e.word, err: '' }); R.lab(); window.scrollTo(0, 0); },
    'lab-del'(t) {
      const e = S.lexicon.find((x) => x.id === t.dataset.id); if (!e) return;
      S.lexicon = S.lexicon.filter((x) => x !== e); saveLex(); updateChrome(); renderLexList();
      const head = $('#lab-count'); if (head) head.textContent = `${S.lexicon.length} words saved`;
      toast(`Removed “${e.word}”.`);
    },
    'lab-pos'(t) { U.lab.pos = t.dataset.id; $$('[data-act="lab-pos"]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.id === U.lab.pos)); renderLexList(); },
    'quiz-start'(t) {
      const qz = buildQuiz(+t.dataset.n || 10);
      if (!qz.n) { toast('Not enough variety yet. Save a few more words with examples.'); return; }
      U.lab.quiz = qz; U.lab.tab = 'quiz'; R.lab();
    },
    'quiz-pick'(t) {
      const qz = U.lab.quiz, q = qz?.qs[qz.i]; if (!q || q.picked !== null) return;
      q.picked = t.dataset.v;
      const e = S.lexicon.find((x) => x.id === q.id), ok = q.picked === q.answer;
      if (e) { if (ok) e.right++; else e.wrong++; }
      if (ok) qz.score++;
      saveLex();
      R.lab();
      if (ok) gain(2, 'quizzed', $('.qopts .opt.right'));
    },
    'quiz-next'() {
      const qz = U.lab.quiz; if (!qz) return;
      qz.i++;
      if (qz.i >= qz.n) {
        qz.done = true;
        const pct = Math.round((qz.score / qz.n) * 100);
        if (pct > S.quizBest) { S.quizBest = pct; save(); }
        R.lab();
        if (pct >= 80) setTimeout(() => { const r = $('.score-ring'); burst(r, 0); setTimeout(() => burst(r, 0), 220); }, 300);
        return;
      }
      R.lab();
    },
    'quiz-exit'() { U.lab.quiz = null; R.lab(); },
    retry() { aiTurn(); },
    hints(t) { getHints(t); },
    'use-hint'(t) { const ta = $('#say-input'); ta.value = t.dataset.text; ta.focus(); },
    'end-scene'(t) { endScene(t); },
    'auto-speak'(t) { S.autoSpeak = t.checked; save(); },
    'mic-into'(t) {
      const ta = $(t.dataset.target); if (!ta) return;
      const base = ta.value && !t.dataset.send ? ta.value.replace(/\s*$/, ' ') : '';
      Mic.start(t, (txt) => { ta.value = base + txt; ta.dispatchEvent(new Event('input', { bubbles: true })); }, (fin) => { if (t.dataset.send && fin) sendLine(); });
    },
    'cue-start'() { const c = U.cue; c.phase = 'prep'; c.total = c.left = 60; c.res = null; clearInterval(c.timer); c.timer = setInterval(cueTick, 1000); R.speak(); },
    'cue-skip'() { const c = U.cue; if (c.phase === 'prep') { c.phase = 'talk'; c.total = c.left = 120; R.speak(); } else { c.left = 1; cueTick(); } },
    'cue-next'() { stopCue(); const c = U.cue; let i; do { i = Math.floor(Math.random() * D.cueCards.length); } while (i === c.i && D.cueCards.length > 1); c.i = i; c.phase = 'idle'; c.left = c.total = 60; c.notes = ''; c.res = null; R.speak(); },
    'cue-eval'(t) { evalCue(t); },
    'shadow-set'(t) { U.sh.set = t.dataset.id; U.sh.i = 0; U.sh.res = null; R.shadow(); },
    'shadow-step'(t) { const n = D.shadowSets[U.sh.set].lines.length; U.sh.i = (U.sh.i + +t.dataset.d + n) % n; U.sh.res = null; TTS.stop(); R.shadow(); },
    'shadow-self'(t) {
      const v = +t.dataset.v; gain(3, 'shadowed', t);
      if (v === 3) setTimeout(() => A['shadow-step']({ dataset: { d: 1 } }), 450);
      else if (v === 1) { const line = D.shadowSets[U.sh.set].lines[U.sh.i]; sayKaraoke($('#sh-line'), line, 0.7); }
    },
    'shadow-mic'(t) {
      const line = D.shadowSets[U.sh.set].lines[U.sh.i];
      TTS.stop();
      U.sh.res = { listening: true, heard: '' }; $('#sh-res').innerHTML = shadowResult();
      Mic.start(t, (txt) => { U.sh.res = { listening: true, heard: txt }; $('#sh-res').innerHTML = shadowResult(); },
        (fin) => {
          if (!fin) { U.sh.res = null; if ($('#sh-res')) $('#sh-res').innerHTML = shadowResult(); return; }
          U.sh.res = { ...compare(line, fin), heard: fin };
          if ($('#sh-res')) $('#sh-res').innerHTML = shadowResult();
          gain(3, 'shadowed', t);
        });
      if (!Mic.rec) { U.sh.res = null; $('#sh-res').innerHTML = shadowResult(); }
    },
    'pair-set'(t) { U.pr = { set: t.dataset.id, cur: null, answered: null, right: 0, total: 0 }; R.shadow(); },
    'pair-play'() {
      const pr = U.pr, set = D.soundPairs.find((p) => p.id === pr.set);
      if (!pr.cur || pr.answered !== null) { pr.cur = { p: Math.floor(Math.random() * set.pairs.length), which: Math.random() < .5 ? 0 : 1 }; pr.answered = null; R.shadow(); }
      TTS.speak(set.pairs[pr.cur.p][pr.cur.which], { rate: 0.85 });
    },
    'pair-answer'(t) {
      const pr = U.pr; if (!pr.cur || pr.answered !== null) return;
      pr.answered = +t.dataset.i; pr.total++;
      const ok = pr.answered === pr.cur.which; if (ok) pr.right++;
      R.shadow();
      if (ok) gain(2, 'pairs', $('.pair-opt.right'));
    },
    flip() {
      const c = allCards().find((x) => x.id === U.w.queue?.[0]); if (!c) return;
      U.w.flipped = !U.w.flipped;
      $('#flip')?.classList.toggle('flipped', U.w.flipped);
      $('#rate-area').innerHTML = rateArea(c);
    },
    rate(t) {
      const w = U.w, id = w.queue[0], c = allCards().find((x) => x.id === id); if (!c) return;
      const r = +t.dataset.r, isNew = !S.cards[c.id];
      S.cards[c.id] = nextState(c, r);
      if (isNew) day().newSeen = (day().newSeen || 0) + 1;
      w.queue.shift(); if (r === 1) w.queue.push(id);
      w.flipped = false;
      gain(2, 'reviewed', t);
      R.words();
    },
    'w-tag'(t) { U.w.tag = t.dataset.id; $$('[data-act="w-tag"]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.id === U.w.tag)); renderVList(); },
    'del-card'(t) { const id = t.dataset.id; S.custom = S.custom.filter((c) => c.id !== id); delete S.cards[id]; save(); renderVList(); updateChrome(); toast('Removed from your Vault.'); },
    async 'ai-fill'(t) {
      const en = $('#n-en').value.trim(); if (!en) { toast('Type the English phrase first.'); return; }
      t.disabled = true;
      try {
        const r = await AI.ask(`${ctx()}\nThe learner wants to save this English phrase to a flashcard: "${en}". Answer with ONLY JSON: {"en": "the phrase in its most natural base form", "tr": "short meaning in ${Lang.explain()}", "ex": "one natural example sentence", "tag": "one of phrasal, collocation, idiom, discourse, situation, mine"}`, 'quick');
        $('#n-en').value = r.en || en; $('#n-tr').value = r.tr || ''; $('#n-ex').value = r.ex || '';
        if (tagNames[r.tag]) $('#n-tag').value = r.tag;
      } catch (e) { aiError(e); }
      finally { t.disabled = false; }
    },
    'new-prompt'() { let p; do { p = pick(D.writePrompts); } while (p === U.wr.prompt); U.wr.prompt = p; U.wr.res = null; R.write(); },
    'write-eval'(t) { writeEval(t); },
    'trap-answer'(t) {
      const tp = U.tp; if (tp.answered !== null) return;
      tp.answered = +t.dataset.i;
      const tr = D.traps[tp.order[tp.i]], opts = tp.flip ? [tr.b, tr.a] : [tr.a, tr.b], ok = opts[tp.answered] === tr.a;
      if (ok) tp.score++;
      R.traps();
      if (ok) gain(2, 'traps', $('.opt.right'));
    },
    'trap-next'() {
      const tp = U.tp; tp.i++; tp.answered = null; tp.flip = Math.random() < .5;
      if (tp.i >= tp.order.length && tp.score > S.trapBest) { S.trapBest = tp.score; save(); }
      R.traps();
    },
    'trap-restart'() { newTrapRound(); R.traps(); },
    async export(t) {
      try { await navigator.clipboard.writeText(JSON.stringify(S)); toast('Progress copied. Paste it somewhere safe.'); }
      catch {
        toast('Copy was blocked here. Select the backup box text instead.');
        const box = $('#p-import'); if (!box) return;
        box.closest('details').open = true; box.value = JSON.stringify(S); box.select();
      }
    },
    import() {
      const o = parseBackup($('#p-import')?.value);
      if (!o) { toast('That does not look like a Second Voice backup.'); return; }
      restoreBackup(o);
    },
    async copy(t) {
      const text = t.dataset.text || '';
      try { await navigator.clipboard.writeText(text); toast(`Copied “${text}”.`); }
      catch { toast(`Copy was blocked. Type it yourself: ${text}`, 6000); }
    },
    'cn-agent'(t) { U.cn.agent = t.dataset.id; R.connect(); },
    async 'coach-check'(t) {
      t.disabled = true;
      const changed = await L.load().catch(() => false);
      updateChrome(); R.connect();
      toast(L.on() ? (changed ? 'Coach files found.' : 'Connected. Nothing new since the last check.') : 'No coach files yet. Say “start” to your agent first.');
    },
    async 'backup-download'() {
      const filename = `second-voice-progress-${todayKey()}.json`, data = JSON.stringify(S, null, 2);
      // On claude.ai the page runs in a frame: the platform's save dialog is the reliable way out.
      const dl = window.claude?.use ? await claude.use('downloads').catch(() => null) : null;
      if (dl) {
        try { const r = await dl.save({ filename, data }); if (r?.status === 'saved') toast(`Saved ${filename}.`); return; }
        catch (e) { if (e?.code === 'declined') return; if (e?.code === 'rate_limited') { toast('A save dialog is already open.'); return; } }
      }
      try {
        const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
        const a = Object.assign(document.createElement('a'), { href: url, download: filename });
        document.body.append(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        toast(`Downloaded ${filename}.`);
      } catch { A.export(); }
    },
    'backup-restore'() { const o = U.cn.pending; U.cn.pending = null; if (o) restoreBackup(o); else R.connect(); },
    'backup-cancel'() { U.cn.pending = null; R.connect(); },
    reset(t) {
      if (!t.dataset.armed) { t.dataset.armed = '1'; t.textContent = 'Click again to erase everything'; setTimeout(() => { if (t.isConnected) { delete t.dataset.armed; t.textContent = 'Erase all progress'; } }, 4000); return; }
      S = normalize({ name: S.name, voice: S.voice, rate: S.rate, lang: S.lang }); U.w.queue = null; U.lab.quiz = null; U.lab.entry = null; saveLex(); toast('All progress erased. Fresh start.'); rerender();
    }
  };

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-act]');
    if (!t || t.disabled) return;
    const act = t.dataset.act;
    if (t.tagName === 'INPUT' && t.type === 'checkbox') { A[act]?.(t, e); return; }
    if (t.tagName === 'A') { A[act]?.(t, e); return; }
    e.preventDefault();
    A[act]?.(t, e);
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-form]'); if (!f) return;
    e.preventDefault();
    const k = f.dataset.form;
    if (k === 'say') sendLine();
    if (k === 'lookup') lookup($('#lab-q').value);
    if (k === 'today-lookup') { const v = $('#today-q').value.trim(); if (v) { location.hash = 'lab'; lookup(v); } }
    if (k === 'custom') { const v = $('#custom-scene').value.trim(); if (v) { openScene(customScene(v)); window.scrollTo(0, 0); } }
    if (k === 'natural') naturalEval();
    if (k === 'add-card') {
      const en = $('#n-en').value;
      if (addToVault(en, $('#n-tr').value.trim(), $('#n-ex').value.trim(), $('#n-tag').value)) {
        gain(3, null, f.querySelector('[type="submit"]'));
        f.reset(); $('#n-tag').value = 'mine'; $('#n-en').focus();
      }
    }
  });
  document.addEventListener('input', (e) => {
    const t = e.target;
    if (t.id === 'w-search') { U.w.q = t.value; renderVList(); }
    if (t.id === 'lex-search') { U.lab.filter = t.value; renderLexList(); }
    if (t.id === 'pb-search') { U.pb.q = t.value; renderPb(); }
    // Typing by hand while the mic listens: the keyboard wins, the mic stops without sending.
    if (t.id === 'say-input' && e.isTrusted && Mic.rec && U.speak.phase === 'listening') { U.speak.turn++; Mic.abort(); setPhase('idle'); }
    if (t.id === 'wr-text') { U.wr.text = t.value; const wc = $('#wr-wc'); if (wc) wc.textContent = t.value.split(/\s+/).filter(Boolean).length + ' words'; }
    if (t.id === 'cue-notes') { U.cue.notes = t.value; const wc = $('#cue-wc'); if (wc) wc.textContent = t.value.split(/\s+/).filter(Boolean).length + ' words'; }
    if (t.id === 'nat-in') U.wr.nat = t.value;
    if (t.id === 'say-input') { t.style.height = 'auto'; t.style.height = Math.min(160, t.scrollHeight) + 'px'; }
    if (t.id === 'p-rate') { $('#p-rate-v').textContent = (+t.value).toFixed(2) + '×'; }
  });
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset?.file === 'restore') {
      const f = t.files?.[0]; t.value = '';
      if (!f) return;
      if (f.size > 20 * 1024 * 1024) { toast('That file is too big to be a Second Voice backup.'); return; }
      f.text().then((txt) => {
        const o = parseBackup(txt);
        if (!o) { toast('That does not look like a Second Voice backup.'); return; }
        U.cn.pending = o; U.cn.pendingName = f.name; R.connect();
        $('.restore-box')?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
      }, () => toast('Could not read that file.'));
      return;
    }
    const p = t.dataset?.pref; if (!p) return;
    if (p === 'name') S.name = t.value.trim().slice(0, 40);
    if (p === 'start' && /^\d{4}-\d{2}-\d{2}$/.test(t.value)) S.start = t.value;
    if (p === 'voice') { S.voice = t.value; fillVoices(); }
    if (p === 'nvVoice') { S.nvVoice = NV_PICKS.some(([id]) => id === t.value) ? t.value : ''; if (NV.ready()) TTS.speak('Hi! This is how I sound now.'); }
    if (p === 'rate') S.rate = Math.min(1.2, Math.max(0.6, +t.value || 1));
    if (p === 'autoSpeak') S.autoSpeak = t.checked;
    if (p === 'native' && t.value === '__other') { const f = $('#p-native-other'); if (f) { f.hidden = false; $('#p-native-o')?.focus(); } return; }
    if (p === 'nativeOther' && !langName(t.value)) { toast('Type the language name in English, letters only.'); return; }
    if (p === 'native' || p === 'nativeOther' || p === 'lang') {
      if (p === 'lang') S.lang = langName(t.value); else S.native = langName(t.value);
      U.lab.recent = []; // cached lookups were written in the old language
      save(); rerender();
      toast(`The AI coach now explains in ${Lang.explain()}.`);
      return;
    }
    save(); updateChrome();
    if (p === 'start') toast(`Plan updated. You are in Week ${weekNow()}.`);
  });
  document.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t.id === 'say-input' && e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); sendLine(); return; }
    if (isTyping(t)) return;
    if (current === 'words' && U.w.tab === 'review' && U.w.queue?.length) {
      if (e.key === ' ' || (e.key === 'Enter' && t.dataset?.act === 'flip')) { e.preventDefault(); A.flip(); }
      else if (U.w.flipped && ['1', '2', '3', '4'].includes(e.key)) { const b = $(`[data-act="rate"][data-r="${e.key}"]`); if (b) A.rate(b); }
    }
  });
  addEventListener('hashchange', route);

  /* ================= Boot ================= */
  $('#nav-m').innerHTML = $('#nav').innerHTML;
  TTS.init();
  if (S.neural) NV.start(); // already downloaded once: loads from the browser cache
  /* Wait briefly for the coach files so Today renders once, with them. */
  let booted = false;
  const boot = () => {
    if (booted) return;
    booted = true;
    Tx.sync();
    route();
    updateChrome();
    AI.init();
    Cloud.init();
    Setup.open();
  };
  L.load().then((changed) => {
    if (Lang.known()) Setup.close(); // the coach's profile arrived after the question opened
    if (booted && changed) { if (['today', 'plan'].includes(current)) R[current](); Tx.sync(); Tx.scan(); }
  }).catch(() => {}).finally(boot);
  setTimeout(boot, 800);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) L.refresh(); });
  addEventListener('focus', () => L.refresh());
})();
