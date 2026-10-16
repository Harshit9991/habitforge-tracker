/* HabitForge core: state, stats, shared UI helpers. No dependencies. */
(function () {
  'use strict';
  var KEY = 'habitforge:v1';
  var MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  var DOW = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var PILLARS = [
    { id: 0, name: 'Physical Vessel', icon: 'fitness_center', roman: 'I', base: 'Somatic baseline' },
    { id: 1, name: 'Mental & Spiritual', icon: 'psychology', roman: 'II', base: 'Stillness quota' },
    { id: 2, name: 'Professional Arc', icon: 'terminal', roman: 'III', base: 'Shipping cadence' },
    { id: 3, name: 'Content & Craft', icon: 'mic', roman: 'IV', base: 'Vocal resonance' }
  ];
  var STARTERS = [
    [0, 'Gym (Strength / Hypertrophy Split)', 'Heavy compound lifts + mobility protocol', 'daily', 1],
    [0, '3-4 Liters Cold Water', 'Hydration goal with electrolytes', 'daily', 1],
    [1, 'Daily Prayer & Gratitude', 'Dawn devotion and evening examination', 'daily', 1],
    [1, 'Meditation & Breathwork', '15 min box breathing / cognitive reset', 'daily', 1],
    [1, 'Stoic Journaling', 'Kaizen reflection and trigger review', 'daily', 1],
    [2, 'Mentor Advisory Call', '30-min review with your mentor', 'weekly', 1],
    [2, 'Product Shipped + GitHub Docs', 'Release notes and updated docs', 'weekly', 2],
    [2, 'Portfolio Systems Architecture', 'Interactive system blueprint work', 'daily', 1],
    [3, 'Substack Winter Research Essay', 'Draft, edit or publish a section', 'weekly', 2],
    [3, 'Speech Practice Video', '10-minute cadence and pacing exercise', 'daily', 1],
    [3, 'Deepstash Module Synthesis', 'Curate mental models from reading', 'daily', 1]
  ];

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(s, n) { var d = parse(s); d.setDate(d.getDate() + n); return iso(d); }
  function diff(a, b) { return Math.round((Date.UTC.apply(null, ymd(a)) - Date.UTC.apply(null, ymd(b))) / 864e5); }
  function ymd(s) { var p = s.split('-'); return [+p[0], +p[1] - 1, +p[2]]; }
  function addMonths(s, n) { var d = parse(s); var day = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() + n); var last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); d.setDate(Math.min(day, last)); return iso(d); }
  function today() { return iso(new Date()); }
  function monDay(s) { var d = parse(s); return MON[d.getMonth()] + ' ' + pad(d.getDate()); }
  function nice(s) { var d = parse(s); var m = MON[d.getMonth()]; return m.charAt(0) + m.slice(1).toLowerCase() + ' ' + d.getDate() + ', ' + d.getFullYear(); }
  function shortNice(s) { var d = parse(s); var m = MON[d.getMonth()]; return m.charAt(0) + m.slice(1).toLowerCase() + ' ' + d.getDate(); }
  function dow(s) { return DOW[parse(s).getDay()]; }
  function weekStart(s) { var d = parse(s); var k = (d.getDay() + 6) % 7; return addDays(s, -k); } // Monday
  function time12(hhmm) { if (!hhmm) return 'Logged'; var p = hhmm.split(':'); var h = +p[0]; return pad(h % 12 === 0 ? 12 : h % 12) + ':' + p[1] + ' ' + (h >= 12 ? 'PM' : 'AM'); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function uid() { return 'h' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  var mem = null; // fallback when storage is blocked
  function fresh() {
    var t = today();
    var s = { v: 1, start: t, threshold: 75, pacing: 'weighted', habits: [], logs: {}, notes: {}, savedAt: Date.now() };
    STARTERS.forEach(function (h, i) { s.habits.push({ id: 'h-' + i, pillar: h[0], title: h[1], desc: h[2], cadence: h[3], target: h[4] }); });
    return s;
  }
  function valid(s) {
    return s && s.v === 1 && /^\d{4}-\d{2}-\d{2}$/.test(s.start) && Array.isArray(s.habits) && s.logs && typeof s.logs === 'object' && s.notes && typeof s.threshold === 'number';
  }
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) { var s = JSON.parse(raw); if (valid(s)) return s; } } catch (e) { if (mem) return mem; }
    return mem || fresh();
  }
  var S = load();
  function save() { S.savedAt = Date.now(); mem = S; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function replaceState(n) { S = n; save(); }

  /* ---- campaign ---- */
  function campaign() {
    var end = addDays(addMonths(S.start, 3), -1);
    var total = diff(end, S.start) + 1;
    var t = today();
    var day = diff(t, S.start) + 1; // 1-based, may be <=0 or > total
    return { start: S.start, end: end, total: total, day: day, today: t, ended: t > end, notStarted: t < S.start };
  }
  function clampDate(d) { var c = campaign(); return d < c.start ? c.start : d > c.end ? c.end : d; }

  /* ---- stats ---- */
  var COLD = false; // dashboard cold-start preview
  function logsFor(d) { if (COLD) return {}; return S.logs[d] || {}; }
  function score(d) {
    var l = logsFor(d), done = 0;
    S.habits.forEach(function (h) { if (Object.prototype.hasOwnProperty.call(l, h.id)) done++; });
    var total = S.habits.length;
    return { done: done, total: total, pct: total ? Math.round(done / total * 100) : 0 };
  }
  function need(total) { return Math.ceil(S.threshold * total / 100); }
  function met(d) { var s = score(d); return s.total > 0 && s.pct >= S.threshold; }
  function streaks() {
    var c = campaign(), t = c.today;
    var last = t > c.end ? c.end : t;
    var cur = 0, best = 0, run = 0, d;
    for (d = c.start; d <= last; d = addDays(d, 1)) { if (met(d)) { run++; if (run > best) best = run; } else run = 0; }
    d = last; if (!met(d)) d = addDays(d, -1);
    while (d >= c.start && met(d)) { cur++; d = addDays(d, -1); }
    return { cur: cur, best: best };
  }
  function weekCount(h, d) {
    var ws = weekStart(d), n = 0, l = COLD ? {} : S.logs;
    for (var i = 0; i < 7; i++) { var x = l[addDays(ws, i)]; if (x && Object.prototype.hasOwnProperty.call(x, h.id)) n++; }
    return n;
  }
  function weekTarget(h) { return h.cadence === 'daily' ? 7 : Math.max(1, h.target || 1); }
  function lastN(n) { // dates from max(start, today-n+1) to min(today,end)
    var c = campaign(), last = c.today > c.end ? c.end : c.today, out = [];
    if (last < c.start) return out;
    var from = addDays(last, -(n - 1)); if (from < c.start) from = c.start;
    for (var d = from; d <= last; d = addDays(d, 1)) out.push(d);
    return out;
  }
  function pillarRate(pid, dates) {
    var hs = S.habits.filter(function (h) { return h.pillar === pid; });
    if (!hs.length || !dates.length) return 0;
    var done = 0;
    dates.forEach(function (d) { var l = logsFor(d); hs.forEach(function (h) { if (Object.prototype.hasOwnProperty.call(l, h.id)) done++; }); });
    return Math.round(done / (hs.length * dates.length) * 100);
  }
  function avgPct(dates) {
    if (!dates.length) return 0;
    var pacing = S.pacing, sum = 0, w = 0, n = dates.length;
    dates.forEach(function (d, i) {
      var wt = 1;
      if (pacing === 'weighted') wt = i >= n - 7 ? 2 : 1;
      if (pacing === 'decay') wt = Math.pow(0.93, n - 1 - i);
      sum += score(d).pct * wt; w += wt;
    });
    return sum / w;
  }
  function hasAnyLogs() { if (COLD) return false; return Object.keys(S.logs).some(function (k) { return Object.keys(S.logs[k]).length; }); }
  function entryCount() { var n = 0; Object.keys(S.logs).forEach(function (k) { n += Object.keys(S.logs[k]).length; }); return n; }

  /* ---- sample data ---- */
  function seed() {
    var r = 12345; function rnd() { r |= 0; r = r + 0x6D2B79F5 | 0; var t = Math.imul(r ^ r >>> 15, 1 | r); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
    var t = today(), start = addDays(t, -20);
    var n = fresh(); n.start = start; n.threshold = S.threshold; n.pacing = S.pacing; n.habits = S.habits.slice(); n.notes = S.notes;
    var times = ['06:30', '07:15', '08:10', '11:00', '14:10', '16:45', '18:05', '19:40', '20:30'];
    for (var i = 0; i < 20; i++) {
      var d = addDays(start, i), base = 0.62 + rnd() * 0.38; if (i === 4 || i === 12) base = 0.35 + rnd() * 0.15; if (i === 16) base = 0.9;
      var l = {};
      n.habits.forEach(function (h) { if (rnd() < base) l[h.id] = times[Math.floor(rnd() * times.length)]; });
      if (i > 5 && i !== 12 && i !== 4 && i < 10) { n.habits.forEach(function (h, k) { if (k % 3 !== 0) l[h.id] = l[h.id] || '07:30'; }); }
      n.logs[d] = l;
    }
    var l2 = {}; n.habits.slice(0, 7).forEach(function (h) { l2[h.id] = '07:15'; }); n.logs[t] = l2;
    replaceState(n);
  }

  /* ---- auth session ---- */
  var AUTH_KEY = 'habitforge:auth:v1';
  function authSession() {
    try { var s = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); if (s && s.exp && s.exp > Date.now()) return s; } catch (e) {}
    return null;
  }

  /* ---- routing: auth gate + viewport ---- */
  var MQ = window.matchMedia('(max-width: 767px)');
  function route() {
    var page = document.documentElement.getAttribute('data-page') || 'app';
    var file = location.pathname.split('/').pop() || 'index.html';
    if (page !== 'signin' && !authSession()) file = 'index.html';
    else if (page === 'signin' && authSession()) file = 'dashboard.html';
    var path = (MQ.matches ? '/m/' : '/') + file;
    var cur = location.pathname === '/' ? '/index.html' : location.pathname;
    if (cur !== path) location.replace(path + location.search + location.hash);
  }
  route();
  (MQ.addEventListener ? MQ.addEventListener('change', route) : MQ.addListener(route));

  var toastT;
  function toast(msg) {
    var el = document.getElementById('hf-toast');
    if (!el) {
      el = document.createElement('div'); el.id = 'hf-toast';
      el.className = 'fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm uppercase shadow-xl flex items-center gap-2';
      el.setAttribute('role', 'status'); document.body.appendChild(el);
    }
    el.innerHTML = '<span class="material-symbols-outlined text-primary text-[16px]">check_circle</span><span></span>';
    el.lastChild.textContent = msg; el.style.display = 'flex';
    clearTimeout(toastT); toastT = setTimeout(function () { el.style.display = 'none'; }, 2600);
  }

  window.HF = {
    get S() { return S; }, save: save, replaceState: replaceState, fresh: fresh, seed: seed, toast: toast,
    PILLARS: PILLARS, MON: MON, pad: pad, iso: iso, parse: parse, addDays: addDays, diff: diff, today: today, monDay: monDay, nice: nice, shortNice: shortNice, dow: dow,
    weekStart: weekStart, time12: time12, esc: esc, uid: uid, campaign: campaign, clampDate: clampDate, score: score, need: need, met: met, streaks: streaks,
    weekCount: weekCount, weekTarget: weekTarget, lastN: lastN, pillarRate: pillarRate, avgPct: avgPct, hasAnyLogs: hasAnyLogs, entryCount: entryCount,
    setCold: function (v) { COLD = !!v; }, isCold: function () { return COLD; }
  };
})();

