/* HabitForge dashboard (desktop + mobile). Uses window.HF from core.js */
(function () {
  'use strict';
  var H = HF, S = H.S;
  var MOBILE = document.documentElement.getAttribute('data-view') === 'mobile';
  var $ = function (id) { return document.getElementById(id); };
  var range = 30, forceCold = false;
  var PC = [
    { t: 'text-primary', bar: 'bg-primary', dot: 'bg-primary-fixed-dim', gauge: 'bg-primary-fixed-dim', mt: 'text-primary', mbar: 'bg-primary-container' },
    { t: 'text-primary', bar: 'bg-primary-container', dot: 'bg-primary-container', gauge: 'bg-primary-container', mt: 'text-tertiary-container', mbar: 'bg-tertiary-container' },
    { t: 'text-tertiary', bar: 'bg-tertiary-container', dot: 'bg-tertiary-container', gauge: 'bg-tertiary-container', mt: 'text-secondary', mbar: 'bg-secondary' },
    { t: 'text-secondary', bar: 'bg-secondary-container', dot: 'bg-secondary', gauge: 'bg-secondary-container', mt: 'text-on-surface-variant', mbar: 'bg-on-surface-variant' }
  ];
  var MNAME = ['Physical', 'Mental', 'Professional', 'Content'];
  var DNAME = ['Physical Mastery', 'Mental &amp; Spiritual', 'Professional &amp; Ship', 'Content &amp; Craft'];
  var C = 238.76;

  function stats() {
    var c = H.campaign(), st = H.streaks(), t = c.today;
    var last30 = H.lastN(30), prev = [];
    var from = H.addDays(last30.length ? last30[0] : t, -30);
    for (var i = 0; i < 30; i++) { var d = H.addDays(from, i); if (d >= c.start && d < (last30[0] || t)) prev.push(d); }
    var cons = H.avgPct(last30), pcons = prev.length ? H.avgPct(prev) : null;
    var wk = 0, wt = 0, wd = H.weekStart(t) ; var inW = t >= c.start;
    S.habits.forEach(function (h) { wt += H.weekTarget(h); wk += Math.min(H.weekCount(h, t), H.weekTarget(h)); });
    var dayIdx = ((new Date(t.replace(/-/g, '/')).getDay() + 6) % 7) + 1, expected = wt * dayIdx / 7;
    var tempered = 0, d; var lastDay = t > c.end ? c.end : t;
    for (d = c.start; d <= lastDay; d = H.addDays(d, 1)) if (H.met(d)) tempered++;
    var forged = 0, possible = 0; last30.forEach(function (x) { forged += H.score(x).done; possible += H.score(x).total; });
    return { c: c, st: st, cons: cons, pcons: pcons, wk: wk, wt: wt, wpct: wt ? Math.round(wk / wt * 100) : 0, wpace: wk >= expected + 1 ? 'Ahead' : wk + 1 < expected ? 'Behind' : 'Normal', tempered: tempered, split: possible ? Math.round(forged / possible * 100) : 0, last30: last30 };
  }
  function pctText(n) { return (Math.round(n * 10) / 10).toFixed(1) + '%'; }

  /* ---------- KPIs ---------- */
  function kpisDesktop(s) {
    var cons = s.cons, up = s.pcons === null ? null : cons - s.pcons;
    var lab = cons >= S.threshold ? 'Tempered High' : cons >= S.threshold - 15 ? 'Tempering' : 'Cooling';
    var delta = up === null ? '<span class="material-symbols-outlined text-[14px]">remove</span>n/a' : '<span class="material-symbols-outlined text-[14px]">' + (up >= 0 ? 'arrow_upward' : 'arrow_downward') + '</span>' + (up >= 0 ? '+' : '') + (Math.round(up * 10) / 10).toFixed(1) + '%';
    var tag = s.wt && s.wpct >= 100 ? '100% COMPLETE' : s.wpct + '% COMPLETE';
    var upd = H.hasAnyLogs() ? 'Updated ' + ago(S.savedAt) : 'No data yet';
    return '<div class="bg-surface-container p-space-md rounded-lg shadow-sm flex flex-col justify-between hover:bg-surface-container-high transition-colors"><div class="flex items-center justify-between"><span class="font-label-sm text-label-sm uppercase text-outline tracking-wider">Monthly Consistency</span><span class="w-2 h-2 rounded-full bg-primary-container"></span></div><div class="my-space-sm flex items-baseline justify-between"><span class="font-stat-display text-stat-display text-on-surface font-bold">' + pctText(cons) + '</span><div class="flex items-center text-primary font-label-sm text-label-sm gap-0.5 bg-surface-container-lowest px-2 py-0.5 rounded">' + delta + '</div></div><div class="flex items-center justify-between text-outline font-label-sm text-label-sm"><span>Target: ≥ ' + S.threshold + '.0%</span><span class="text-on-surface-variant font-medium">' + lab + '</span></div></div>' +
      '<div class="bg-surface-container p-space-md rounded-lg shadow-sm flex flex-col justify-between hover:bg-surface-container-high transition-colors"><div class="flex items-center justify-between"><span class="font-label-sm text-label-sm uppercase text-outline tracking-wider">Current Arc Streak</span><div class="w-6 h-6 rounded bg-on-secondary-container/40 flex items-center justify-center"><span class="material-symbols-outlined text-secondary text-[16px]">local_fire_department</span></div></div><div class="my-space-sm flex items-baseline gap-space-xs"><span class="font-stat-display text-stat-display text-primary font-bold">' + s.st.cur + '</span><span class="font-label-md text-label-md text-on-surface-variant uppercase">Day' + (s.st.cur === 1 ? '' : 's') + ' Hot</span></div><div class="flex items-center justify-between text-outline font-label-sm text-label-sm"><span>Personal Best: ' + s.st.best + 'd</span><span class="text-primary font-medium">' + (s.st.cur >= 7 ? 'Flawless Week' : s.st.cur > 0 ? 'Building' : 'Cold Anvil') + '</span></div></div>' +
      '<div class="bg-surface-container p-space-md rounded-lg shadow-sm flex flex-col justify-between hover:bg-surface-container-high transition-colors"><div class="flex items-center justify-between"><span class="font-label-sm text-label-sm uppercase text-outline tracking-wider">Weekly Kaizen</span><span class="material-symbols-outlined text-tertiary text-[16px]">verified</span></div><div class="my-space-sm flex items-baseline justify-between"><div class="flex items-baseline gap-space-xs"><span class="font-stat-display text-stat-display text-on-surface font-bold">' + s.wk + '</span><span class="font-label-lg text-label-lg text-on-surface-variant">/ ' + s.wt + '</span></div><div class="flex items-center text-tertiary font-label-sm text-label-sm bg-surface-container-lowest px-2 py-0.5 rounded">' + tag + '</div></div><div class="flex items-center justify-between text-outline font-label-sm text-label-sm"><span>Pacing: ' + s.wpace + '</span><span class="text-on-surface-variant font-medium">' + (S.habits.length ? 'Required by Sun' : 'No habits') + '</span></div></div>' +
      '<div class="bg-surface-container p-space-md rounded-lg shadow-sm flex flex-col justify-between hover:bg-surface-container-high transition-colors"><div class="flex items-center justify-between"><span class="font-label-sm text-label-sm uppercase text-outline tracking-wider">Local Ledger</span><span class="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span></div><div class="my-space-sm"><div class="flex items-center gap-space-xs text-on-surface font-label-lg text-label-lg"><span class="material-symbols-outlined text-primary text-[18px]">sync_saved_locally</span><span>This device</span></div><div class="font-label-sm text-label-sm text-on-surface-variant mt-1">Saved in your browser</div></div><div class="flex items-center justify-between text-outline font-label-sm text-label-sm"><span>Entries: ' + H.entryCount() + '</span><span class="text-primary font-medium">' + upd + '</span></div></div>';
  }
  function kpisMobile(s) {
    var lab = s.cons >= S.threshold ? 'Tempered High' : s.cons >= S.threshold - 15 ? 'Tempering' : 'Cooling';
    var card = 'flex flex-col justify-between p-3 rounded-lg bg-surface-container shadow-md';
    return '<div class="' + card + '"><div class="flex items-center justify-between"><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Consistency</span><span class="w-1.5 h-1.5 rounded-full bg-primary-container"></span></div><div class="my-1.5 flex items-baseline gap-1"><span class="font-stat-display text-stat-display text-primary tracking-tight">' + pctText(s.cons) + '</span></div><div class="flex items-center justify-between text-on-surface-variant"><span class="font-label-sm text-[9px] uppercase">Goal: ≥' + S.threshold + '%</span><span class="font-label-sm text-[9px] text-primary-fixed uppercase font-semibold">' + lab + '</span></div></div>' +
      '<div class="' + card + '"><div class="flex items-center justify-between"><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Current Streak</span><span class="material-symbols-outlined text-secondary-container text-[14px]">local_fire_department</span></div><div class="my-1.5 flex items-baseline gap-1"><span class="font-stat-display text-stat-display text-on-surface tracking-tight">' + s.st.cur + '</span><span class="font-label-md text-label-md text-secondary uppercase font-semibold">Day' + (s.st.cur === 1 ? '' : 's') + '</span></div><div class="flex items-center justify-between text-on-surface-variant"><span class="font-label-sm text-[9px] uppercase">Best: ' + s.st.best + 'd</span><span class="font-label-sm text-[9px] text-tertiary uppercase font-semibold">' + (s.st.cur >= 7 ? 'Flawless Week' : s.st.cur > 0 ? 'Building' : 'Cold Anvil') + '</span></div></div>' +
      '<div class="' + card + '"><div class="flex items-center justify-between"><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Kaizen Pacing</span><span class="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span></div><div class="my-1.5 flex items-baseline gap-1"><span class="font-stat-display text-stat-display text-on-surface tracking-tight">' + s.wk + '</span><span class="font-headline-md text-headline-md text-on-surface-variant font-light">/</span><span class="font-stat-display text-stat-display text-on-surface-variant">' + s.wt + '</span></div><div class="flex items-center justify-between text-on-surface-variant"><span class="font-label-sm text-[9px] uppercase">Weekly Target</span><span class="font-label-sm text-[9px] text-tertiary uppercase font-semibold">' + s.wpace + '</span></div></div>' +
      '<div class="' + card + '"><div class="flex items-center justify-between"><span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Data Sync</span><span class="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span></div><div class="my-1.5 flex items-center gap-1.5"><span class="font-label-lg text-label-lg text-tertiary font-bold uppercase tracking-wide">Saved</span></div><div class="flex items-center justify-between text-on-surface-variant"><span class="font-label-sm text-[9px] uppercase">Entries</span><span class="font-label-sm text-[9px] text-on-surface uppercase font-semibold">' + H.entryCount() + ' Logged</span></div></div>';
  }
  function ago(ts) { var m = Math.floor((Date.now() - ts) / 60000); return m < 1 ? 'just now' : m < 60 ? m + 'm ago' : m < 1440 ? Math.floor(m / 60) + 'h ago' : Math.floor(m / 1440) + 'd ago'; }

  /* ---------- chart ---------- */
  function chartPoints() {
    var c = H.campaign(), dates;
    if (range === 0) { var last = c.today > c.end ? c.end : c.today; dates = []; for (var d = c.start; d <= last; d = H.addDays(d, 1)) dates.push(d); } else dates = H.lastN(range);
    return dates;
  }
  function chart(dates) {
    var y = function (p) { return 20 + (100 - p) * 2.16; };
    var thr = S.threshold, ty = y(thr);
    var base = '<defs><linearGradient id="forgeHeatGradient" x1="0%" x2="0%" y1="0%" y2="100%"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0.32"></stop><stop offset="70%" stop-color="#f66018" stop-opacity="0.08"></stop><stop offset="100%" stop-color="#0b0e13" stop-opacity="0.0"></stop></linearGradient><pattern height="40" id="gridPattern" patternUnits="userSpaceOnUse" width="40"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#272a30" stroke-width="0.75"></path></pattern></defs><rect fill="url(#gridPattern)" height="220" width="760"></rect>';
    [[100, '#a08e7a', '#32353b', '2 3'], [50, '#a08e7a', '#32353b', '2 3'], [25, '#a08e7a', '#32353b', '2 3']].forEach(function (g) { base += '<line stroke="' + g[2] + '" stroke-dasharray="' + g[3] + '" stroke-width="1" x1="40" x2="740" y1="' + y(g[0]) + '" y2="' + y(g[0]) + '"></line><text fill="' + g[1] + '" font-family="JetBrains Mono" font-size="10" text-anchor="end" x="32" y="' + (y(g[0]) + 4) + '">' + g[0] + '%</text>'; });
    base += '<line stroke="#534434" stroke-dasharray="4 4" stroke-width="1.2" x1="40" x2="740" y1="' + ty + '" y2="' + ty + '"></line><text fill="#d8c3ad" font-family="JetBrains Mono" font-size="10" text-anchor="end" x="32" y="' + (ty + 4) + '">' + thr + '%</text>';
    var n = dates.length;
    if (n < 2) return { svg: '<svg class="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 760 220">' + base + '</svg><div class="absolute inset-0 flex items-center justify-center font-label-sm text-label-sm uppercase text-outline text-center px-space-md">' + (n === 1 ? 'One day logged. Come back tomorrow to see a trend.' : 'No data in this range yet.') + '</div>', slope: 'Slope: n/a', pts: [] };
    var pts = dates.map(function (d, i) { var p = H.score(d).pct; return { d: d, p: p, x: 50 + i * (665 / (n - 1)), y: y(p) }; });
    var line = pts.map(function (q) { return q.x.toFixed(1) + ',' + q.y.toFixed(1); }).join(' ');
    var area = '50,180 ' + line + ' ' + pts[n - 1].x.toFixed(1) + ',180';
    var out = base + '<polygon fill="url(#forgeHeatGradient)" points="' + area + '"></polygon><polyline fill="none" points="' + line + '" stroke="#f59e0b" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></polyline>';
    var step = n > 45 ? Math.ceil(n / 45) : 1;
    pts.forEach(function (q, i) {
      var isLast = i === n - 1; if (!isLast && i % step) return;
      var low = q.p < 50;
      out += '<circle cx="' + q.x.toFixed(1) + '" cy="' + q.y.toFixed(1) + '" r="' + (isLast ? 4 : low ? 4 : 3) + '" fill="' + (isLast ? '#ffc174' : low ? '#690005' : '#111319') + '" stroke="' + (isLast ? '#ffffff' : low ? '#ffb4ab' : '#ffc174') + '" stroke-width="1.5"><title>' + H.shortNice(q.d) + ': ' + q.p + '%</title></circle>';
    });
    var marks = 6, last = n - 1;
    for (var k = 0; k < marks; k++) { var i = Math.round(k * last / (marks - 1)), q = pts[i], isEnd = i === last && q.d === H.today(); out += '<text fill="' + (isEnd ? '#ffc174' : '#a08e7a') + '" font-family="JetBrains Mono" font-size="10" text-anchor="' + (k === 0 ? 'start' : k === marks - 1 ? 'end' : 'middle') + '" x="' + (k === 0 ? 40 : k === marks - 1 ? 735 : q.x.toFixed(1)) + '" y="206">' + (isEnd ? 'TODAY' : H.monDay(q.d)) + '</text>'; }
    var mx = (n - 1) / 2, my = pts.reduce(function (a, q) { return a + q.p; }, 0) / n, num = 0, den = 0;
    pts.forEach(function (q, i) { num += (i - mx) * (q.p - my); den += (i - mx) * (i - mx); });
    var sl = den ? num / den : 0;
    return { svg: '<svg class="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 760 220">' + out + '</svg>', slope: 'Current Slope: ' + (sl >= 0 ? '+' : '') + sl.toFixed(2) + '% daily', pts: pts };
  }
  function tooltip(pts) {
    var lg = null; for (var i = pts.length - 1; i >= 0; i--) if (H.score(pts[i].d).done) { lg = pts[i]; break; }
    if (!lg) return '';
    var l = H.S.logs[lg.d] || {}, names = S.habits.filter(function (h) { return Object.prototype.hasOwnProperty.call(l, h.id); }).slice(0, 3).map(function (h) { return H.esc(h.title.split(/[ (]/)[0]); }).join(' • ');
    return '<div class="absolute top-8 right-16 bg-surface-container-high/90 backdrop-blur-md px-3 py-1.5 rounded shadow-lg text-left hidden sm:block"><div class="font-label-sm text-label-sm text-outline">DAY ' + (H.diff(lg.d, H.S.start) + 1) + ' STRIKE</div><div class="font-label-md text-label-md text-primary font-bold">' + lg.p + '% EXECUTION</div><div class="font-label-sm text-label-sm text-on-surface-variant">' + names + '</div></div>';
  }
  function chartMobile(dates) {
    var n = dates.length, thr = S.threshold;
    var lab = '<div class="absolute left-2 right-2 flex items-center justify-between pointer-events-none opacity-60" style="top:' + (8 + (100 - thr) * 0.6) + '%"><span class="font-label-sm text-[9px] text-primary-fixed uppercase">Floor (' + thr + '%)</span><span class="h-[1px] flex-1 ml-2 bg-primary-container/30"></span></div>';
    if (n < 2) return lab + '<div class="absolute inset-0 flex items-center justify-center font-label-sm text-[10px] uppercase text-on-surface-variant text-center px-3">' + (n === 1 ? 'One day logged. Trend appears tomorrow.' : 'No data in this range yet.') + '</div>';
    var pts = dates.map(function (d, i) { return [i * (200 / (n - 1)), 56 - H.score(d).pct * 0.52]; });
    var line = pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    var svg = '<svg class="w-full flex-1" viewBox="0 0 200 60" preserveAspectRatio="none" fill="none" style="min-height:0;height:70%"><defs><linearGradient id="mg" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0.35"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/></linearGradient></defs><polygon fill="url(#mg)" points="0,60 ' + line + ' 200,60"/><polyline points="' + line + '" stroke="#f59e0b" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/></svg>';
    var marks = 5, ticks = '';
    for (var k = 0; k < marks; k++) { var i = Math.round(k * (n - 1) / (marks - 1)), isEnd = k === marks - 1 && dates[i] === H.today(); ticks += '<span class="' + (isEnd ? 'text-primary font-bold' : '') + '">' + (isEnd ? 'TODAY' : H.monDay(dates[i]).replace(/^(\w+) 0?/, '$1 ')) + '</span>'; }
    return lab + svg + '<div class="flex justify-between items-center pt-1.5 px-1 font-label-sm text-[9px] text-on-surface-variant">' + ticks + '</div>';
  }

  /* ---------- donut / bars / table / heat ---------- */
  function donutD(p) {
    return '<svg class="w-44 h-44 -rotate-90 transform" viewBox="0 0 100 100"><circle cx="50" cy="50" fill="transparent" r="38" stroke="#272a30" stroke-width="9"></circle><circle cx="50" cy="50" fill="transparent" r="38" stroke="#534434" stroke-dasharray="' + C + '" stroke-dashoffset="0" stroke-linecap="round" stroke-width="9"></circle><circle class="transition-all duration-1000" cx="50" cy="50" fill="transparent" r="38" stroke="#f59e0b" stroke-dasharray="' + C + '" stroke-dashoffset="' + (C * (1 - p / 100)).toFixed(2) + '" stroke-linecap="round" stroke-width="9" style="' + (p === 0 ? 'opacity:0' : '') + '"></circle></svg><div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"><span class="font-stat-display text-stat-display font-bold text-on-surface leading-none">' + p + '%</span><span class="font-label-sm text-label-sm uppercase tracking-wider text-outline mt-1">FORGED</span></div>';
  }
  function donutM(p) {
    return '<svg class="w-full h-full -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="transparent" stroke="#272a30" stroke-width="9"/><circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" stroke-width="9" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="' + (C * (1 - p / 100)).toFixed(2) + '" style="' + (p === 0 ? 'opacity:0' : '') + '"/></svg><div class="absolute inset-0 flex flex-col items-center justify-center"><span class="font-stat-display text-[18px] leading-tight text-on-surface">' + p + '%</span><span class="font-label-sm text-[8px] tracking-wider text-primary uppercase font-bold">Forged</span></div>';
  }
  function bars(dates) {
    return H.PILLARS.slice(0, 4).map(function (p, i) {
      var r = H.pillarRate(p.id, dates), c = PC[i % 4];
      return MOBILE
        ? '<div class="flex flex-col gap-0.5"><div class="flex justify-between items-center text-[10px] font-label-sm"><span class="text-on-surface">' + MNAME[i] + '</span><span class="' + c.mt + ' font-semibold">' + r + '%</span></div><div class="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden"><div class="h-full ' + c.mbar + ' rounded-full" style="width: ' + r + '%"></div></div></div>'
        : '<div><div class="flex justify-between font-label-sm text-label-sm mb-1"><span class="text-on-surface font-medium">' + DNAME[i] + '</span><span class="' + c.t + ' font-bold">' + r + '%</span></div><div class="w-full h-1.5 rounded bg-surface-container-lowest overflow-hidden"><div class="h-full ' + c.bar + ' rounded" style="width: ' + r + '%"></div></div></div>';
    }).join('');
  }
  function status(h, t) {
    var cnt = H.weekCount(h, t), tg = H.weekTarget(h), left = 7 - (((new Date(t.replace(/-/g, '/')).getDay() + 6) % 7)); // days left incl today
    if (cnt >= tg) return 'met';
    return (tg - cnt) > left ? 'risk' : 'prog';
  }
  function tableRows() {
    var t = H.today(); if (t < S.start) t = S.start;
    if (!S.habits.length) return '<tr><td class="py-space-md px-space-md text-outline font-body-sm" colspan="5">No habits yet. Add some in the Daily Tracker.</td></tr>';
    return S.habits.slice().sort(function (a, b) { return a.pillar - b.pillar; }).map(function (h) {
      var cnt = H.weekCount(h, t), tg = H.weekTarget(h), st = status(h, t), c = PC[h.pillar % 4], w = Math.min(100, Math.round(cnt / tg * 100));
      var badge = st === 'met' ? '<span class="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase px-2 py-0.5 rounded bg-primary-container/20 text-primary font-semibold"><span class="material-symbols-outlined text-[14px]">check</span> Met</span>'
        : st === 'risk' ? '<span class="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase px-2 py-0.5 rounded bg-error-container/40 text-error font-bold"><span class="material-symbols-outlined text-[14px]">warning</span> At Risk</span>'
        : '<span class="inline-flex items-center gap-1 font-label-sm text-label-sm uppercase px-2 py-0.5 rounded bg-surface-container-lowest text-primary font-semibold">In Progress</span>';
      return '<tr class="hover:bg-surface-container-high/40 transition-colors"><td class="py-space-sm px-space-md font-medium flex items-center gap-space-sm"><span class="w-1.5 h-1.5 rounded-full ' + c.dot + '"></span><span>' + H.esc(h.title) + '</span></td><td class="py-space-sm px-space-md font-label-sm text-label-sm text-on-surface-variant uppercase">' + tg + 'x / Week</td><td class="py-space-sm px-space-md font-label-md text-label-md font-bold text-on-surface">' + cnt + ' / ' + tg + '</td><td class="py-space-sm px-space-md w-48"><div class="w-full h-2 rounded bg-surface-container-lowest overflow-hidden"><div class="h-full ' + (st === 'risk' ? 'bg-error' : c.gauge) + ' rounded" style="width: ' + w + '%"></div></div></td><td class="py-space-sm px-space-md text-right">' + badge + '</td></tr>';
    }).join('');
  }
  function kaizenMobile() {
    var t = H.today(); if (t < S.start) t = S.start;
    if (!S.habits.length) return '<p class="font-body-sm text-body-sm text-on-surface-variant p-2">No habits yet. Add some in the Tracker.</p>';
    return S.habits.slice().sort(function (a, b) { return a.pillar - b.pillar; }).map(function (h) {
      var cnt = H.weekCount(h, t), tg = H.weekTarget(h), st = status(h, t), p = H.PILLARS[h.pillar] || { name: '' };
      var met = st === 'met', risk = st === 'risk';
      var icon = met ? '<div class="w-5 h-5 rounded bg-tertiary-container flex items-center justify-center text-on-tertiary-container font-label-sm text-[11px] font-bold">★</div>' : risk ? '<div class="w-5 h-5 rounded bg-surface-container-highest flex items-center justify-center text-error font-label-sm text-[11px] font-bold">!</div>' : '<div class="w-5 h-5 rounded bg-primary-container flex items-center justify-center text-on-primary font-label-sm text-[11px] font-bold">' + (cnt > 0 ? '✓' : '·') + '</div>';
      var badge = met ? '<span class="px-1.5 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-label-sm text-[9px] uppercase font-bold">MET</span>' : risk ? '<span class="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-[9px] uppercase font-bold">AT RISK</span>' : '<span class="px-1.5 py-0.5 rounded bg-primary-container/20 text-primary font-label-sm text-[9px] uppercase">Active</span>';
      return '<div class="flex items-center justify-between p-2.5 rounded ' + (met ? 'bg-surface-container-high hover:bg-surface-container-highest' : 'bg-surface-container hover:bg-surface-container-high') + ' transition-colors"><div class="flex items-center gap-2.5 min-w-0">' + icon + '<div class="flex flex-col min-w-0"><span class="font-body-sm text-body-sm font-semibold ' + (met ? 'text-tertiary' : 'text-on-surface') + ' truncate">' + H.esc(h.title) + '</span><span class="font-label-sm text-[9px] text-on-surface-variant uppercase truncate">' + H.esc(p.name) + ' • ' + (h.cadence === 'daily' ? 'Daily' : 'Weekly ' + h.target + 'x') + '</span></div></div><div class="flex items-center gap-2 flex-shrink-0"><span class="font-label-md text-label-md ' + (met ? 'text-tertiary' : risk ? 'text-error' : 'text-primary') + ' font-bold">' + cnt + ' / ' + tg + '</span>' + badge + '</div></div>';
    }).join('');
  }
  function heat() {
    var c = H.campaign(), t = c.today, out = '', temp = 0;
    for (var i = 0; i < c.total; i++) {
      var d = H.addDays(c.start, i), s = H.score(d), fut = d > t, isT = d === t, day = i + 1;
      if (MOBILE) {
        var cls = isT ? 'bg-tertiary-container shadow-[0_0_6px_#38bdf8]' : fut ? 'bg-surface-container-high border border-outline-variant/30' : s.pct >= S.threshold ? 'bg-primary-container' : s.pct > 0 ? 'bg-primary-container/40' : 'bg-outline-variant/40';
        out += '<div class="aspect-square rounded-[2px] ' + cls + '" title="Day ' + day + ' - ' + (fut ? 'upcoming' : s.pct + '%') + '"></div>';
      } else {
        var cl = fut ? 'bg-surface-container-highest' : isT ? 'bg-primary-container ring-1 ring-primary animate-pulse' : s.pct >= 100 ? 'bg-primary' : s.pct >= S.threshold ? 'bg-primary-container' : s.pct > 0 ? 'bg-outline-variant' : 'bg-outline-variant/40';
        out += '<div class="w-5 h-5 rounded ' + cl + '" title="Day ' + day + ' - ' + (fut ? 'upcoming' : s.pct + '%') + '"></div>';
      }
    }
    return out;
  }
  function monthsLabel() {
    var c = H.campaign(), out = [], m = c.start.slice(0, 7);
    var d = c.start;
    var cur = null;
    for (var i = 0; i < c.total; i++) { var x = H.addDays(c.start, i), mm = x.slice(0, 7); if (!cur || cur.m !== mm) { cur = { m: mm, a: i + 1, b: i + 1 }; out.push(cur); } cur.b = i + 1; }
    return out.map(function (o) { return '<span>' + H.MON[+o.m.slice(5, 7) - 1].charAt(0) + H.MON[+o.m.slice(5, 7) - 1].slice(1).toLowerCase() + ' (D' + H.pad(o.a) + '-' + H.pad(o.b) + ')</span>'; }).join('');
  }

  /* ---------- header pills (shared with tracker; click goes to tracker for that month) ---------- */
  function monthsSpan() { var c = H.campaign(), out = [], d = c.start.slice(0, 7) + '-01'; while (d <= c.end) { out.push(d.slice(0, 7)); d = H.iso(new Date(+d.slice(0, 4), +d.slice(5, 7), 1)); } return out; }

  /* ---------- render ---------- */
  function render() {
    S = H.S; H.setCold(forceCold);
    var s = stats(), c = s.c, cold = !H.hasAnyLogs() && !forceCold;
    var day = c.notStarted ? 0 : Math.min(c.day, c.total), pct = c.total ? day / c.total * 100 : 0;
    var phase = c.ended ? 'CAMPAIGN COMPLETE' : pct <= 33 ? 'EARLY CAMPAIGN' : pct <= 66 ? 'MID-CAMPAIGN' : 'FINAL STRETCH';
    var dates = chartPoints(), last30 = H.lastN(30);
    $('kpis').innerHTML = MOBILE ? kpisMobile(s) : kpisDesktop(s);
    var cm = $('hf-month'); var curM = H.today().slice(0, 7);
    if (cm) cm.innerHTML = monthsSpan().map(function (m) { var on = m === curM, lab = H.MON[+m.slice(5, 7) - 1]; return MOBILE ? '<a href="tracker.html#' + m + '" class="px-2.5 py-1 rounded ' + (on ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant hover:text-on-surface') + ' font-label-sm text-label-sm uppercase font-semibold transition-all" data-month="' + m + '">' + lab + '</a>' : '<a href="tracker.html#' + m + '" class="font-label-sm text-label-sm uppercase px-space-sm py-[2px] rounded ' + (on ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface') + '" data-month="' + m + '">' + lab + '</a>'; }).join('');
    var yr = $('hf-year'); if (yr) { var ys = [+c.start.slice(0, 4)]; if (+c.end.slice(0, 4) !== ys[0]) ys.push(+c.end.slice(0, 4)); yr.innerHTML = ys.map(function (y) { return '<span class="font-label-sm text-label-sm uppercase px-space-sm py-[2px] rounded ' + (y === +H.today().slice(0, 4) ? 'text-primary bg-surface-container font-semibold' : 'text-on-surface-variant') + '">' + y + '</span>'; }).join(''); }
    $('hero-day').textContent = (MOBILE ? '' : 'HABITFORGE • ') + (MOBILE ? 'Day ' : 'DAY ') + day + (MOBILE ? ' of ' : ' OF ') + c.total;
    $('hero-pct').textContent = pctText(pct);
    if (!MOBILE) {
      $('hero-phase').textContent = phase; $('hero-bar').style.width = pct.toFixed(1) + '%';
      $('hero-start').textContent = H.monDay(c.start) + ' • ANVIL COLD'; $('hero-forged').textContent = s.tempered + ' DAY' + (s.tempered === 1 ? '' : 'S') + ' FORGED'; $('hero-end').textContent = H.monDay(c.end) + ' • TEMPER TEST';
      var ban = $('emptyStateBanner'); ban.classList.toggle('hidden', !(cold || forceCold) || (cold && ui.dismissed));
      var tb = $('toggleDataState'); tb.textContent = forceCold ? 'Cold Start Mode (Day 0)' : 'Live Telemetry'; tb.classList.toggle('text-error', forceCold);
      $('base-pct').textContent = S.threshold;
      $('range-btns').innerHTML = [[30, '30 Days'], [90, '90 Days'], [0, 'Full Arc']].map(function (r) { return '<button type="button" data-range="' + r[0] + '" class="font-label-sm text-label-sm uppercase px-2.5 py-0.5 rounded ' + (range === r[0] ? 'text-primary bg-surface-container font-semibold' : 'text-on-surface-variant hover:text-on-surface') + '">' + r[1] + '</button>'; }).join('');
      var ch = chart(dates); $('chart-host').innerHTML = ch.svg + tooltip(ch.pts); $('chart-slope').textContent = ch.slope;
      $('donut-host').innerHTML = donutD(s.split);
      $('kaizen-body').innerHTML = tableRows();
      var ws = H.weekStart(H.today() < c.start ? c.start : H.today()), wn = Math.floor(H.diff(ws, H.weekStart(c.start)) / 7) + 1;
      $('week-no').textContent = 'Week ' + H.pad(wn) + ' / ' + H.pad(Math.floor(H.diff(H.weekStart(c.end), H.weekStart(c.start)) / 7) + 1);
      var sp = $('sel-threshold'), opts = [[70, 'Relaxed (70% Completion)'], [75, 'Standard (75% Completion)'], [80, 'Strict (80% Completion)'], [90, 'Ironclad (90% Completion)']];
      if (!opts.some(function (o) { return o[0] === S.threshold; })) opts.push([S.threshold, 'Custom (' + S.threshold + '% Completion)']);
      if (document.activeElement !== sp) sp.innerHTML = opts.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === S.threshold ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('');
      var pc = $('sel-pacing'); if (document.activeElement !== pc) pc.value = S.pacing;
    } else {
      var ch2 = chartMobile(dates); $('chart-host').innerHTML = ch2;
      var lastPt = dates.length ? dates[dates.length - 1] : null;
      $('chart-last-label').textContent = lastPt ? 'Day ' + (H.diff(lastPt, c.start) + 1) + ':' : 'Day --:'; $('chart-last').textContent = lastPt ? H.score(lastPt).pct + '%' : '--';
      $('donut-host').innerHTML = donutM(s.split);
      $('kaizen-list').innerHTML = kaizenMobile();
      var ws2 = H.weekStart(H.today() < c.start ? c.start : H.today()), wn2 = Math.floor(H.diff(ws2, H.weekStart(c.start)) / 7) + 1;
      $('week-no').textContent = 'WEEK ' + H.pad(wn2);
      $('heat-day').textContent = 'Day ' + day + ' / ' + c.total;
      var frozen = Math.max(0, c.total - day);
      $('lg-tempered').textContent = 'Tempered (' + s.tempered + 'd)'; $('lg-today').textContent = 'Today (D' + day + ')'; $('lg-frozen').textContent = 'Frozen (' + frozen + 'd)';
      $('heat-months').innerHTML = monthsLabel(); $('heat-months').className = 'contents';
      $('heat-start').textContent = H.monDay(c.start); $('heat-end').textContent = H.monDay(c.end);
      $('heat-mid').textContent = 'DAY ' + day + ' (' + pct.toFixed(1) + '%)'; $('heat-bar').style.width = pct.toFixed(1) + '%';
      $('heat-streak').textContent = s.st.cur + 'd'; $('heat-remain').textContent = frozen + ' DAYS REMAINING'; $('heat-pace').textContent = s.cons >= S.threshold ? 'On Track' : 'Behind';
      $('foot-state').textContent = cold ? 'No data yet • Log a strike in Tracker' : 'Telemetry clean • Local ledger active';
      $('seed-wrap').innerHTML = cold ? '<button type="button" id="seed-btn" class="underline">Load sample</button>' : '';
    }
    $('pillar-bars').innerHTML = bars(last30);
    $('heat-host').innerHTML = heat();
    var yn = $('hf-year-now'); if (yn) yn.textContent = new Date().getFullYear();
  }
  var ui = { dismissed: false };

  function csv() {
    var rows = [['date', 'habit', 'pillar', 'cadence', 'completed_at']];
    Object.keys(S.logs).sort().forEach(function (d) { S.habits.forEach(function (h) { var l = S.logs[d]; if (Object.prototype.hasOwnProperty.call(l, h.id)) rows.push([d, h.title, (H.PILLARS[h.pillar] || {}).name || '', h.cadence === 'daily' ? 'daily' : 'weekly ' + h.target + 'x', l[h.id] || '']); }); });
    var txt = rows.map(function (r) { return r.map(function (v) { v = String(v); if (/^[=+\-@]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/csv' })); a.download = 'habitforge-ledger-' + H.today() + '.csv'; document.body.appendChild(a); a.click(); a.remove();
    H.toast(rows.length > 1 ? 'Ledger exported (' + (rows.length - 1) + ' entries)' : 'Exported empty ledger');
  }

  document.addEventListener('click', function (e) {
    var t = e.target, el;
    if ((el = t.closest('[data-range]'))) { range = +el.getAttribute('data-range'); return render(); }
    if (t.closest('#toggleDataState')) { forceCold = !forceCold; return render(); }
    if (t.closest('#cold-dismiss')) { if (forceCold) forceCold = false; else ui.dismissed = true; return render(); }
    if (t.closest('[data-settings-toggle]')) { var p = $('settingsPopover'); if (p) p.classList.toggle('hidden'); if (t.closest('#sel-threshold,#sel-pacing')) return; var ap = t.closest('button'); if (ap && /Apply/i.test(ap.textContent)) { S.threshold = +$('sel-threshold').value; S.pacing = $('sel-pacing').value; H.save(); render(); H.toast('Parameters applied'); } return; }
    if (t.closest('#seed-btn')) { forceCold = false; H.seed(); S = H.S; render(); return H.toast('Sample ledger loaded'); }
    if (t.closest('#export-btn')) return csv();
    if (t.closest('#gear-btn') && !MOBILE) { var pp = $('settingsPopover'); pp.classList.toggle('hidden'); if (!pp.classList.contains('hidden')) pp.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  });
  render();
  setInterval(function () { if (!document.hidden) render(); }, 60000);
  window.addEventListener('storage', render);
})();
