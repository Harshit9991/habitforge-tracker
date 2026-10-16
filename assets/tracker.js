/* HabitForge daily tracker (desktop + mobile). Uses window.HF from core.js */
(function () {
  'use strict';
  var H = HF, S = H.S;
  var MOBILE = document.documentElement.getAttribute('data-view') === 'mobile';
  var $ = function (id) { return document.getElementById(id); };
  var cur = H.clampDate(H.today());
  var ui = { addFor: null, addCad: 'daily', addTarget: 3, editing: null, delArm: null, resetArm: false, restartArm: false };
  var MICON = ['text-primary-container', 'text-tertiary', 'text-secondary', 'text-primary-fixed-dim'];

  function isFuture(d) { return d > H.today(); }
  function has(d, id) { return !!(S.logs[d] && Object.prototype.hasOwnProperty.call(S.logs[d], id)); }
  function nowHHMM() { var n = new Date(); return H.pad(n.getHours()) + ':' + H.pad(n.getMinutes()); }
  function cadLabel(h) { return h.cadence === 'daily' ? 'Daily (1x)' : 'Weekly (' + h.target + 'x)'; }
  function cadShort(h) { return h.cadence === 'daily' ? 'Daily 1x' : 'Weekly ' + h.target + 'x'; }

  /* ---------- templates: desktop ---------- */
  function dRow(h, d) {
    var on = has(d, h.id), fut = isFuture(d), t = on ? S.logs[d][h.id] : null;
    var edit = ui.editing === h.id, arm = ui.delArm === h.id;
    var box = on ? 'bg-primary text-on-primary shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'bg-surface-container-highest text-transparent';
    var title = edit
      ? '<input class="edit-input w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md px-space-sm py-0.5 rounded outline-none border border-primary" maxlength="60" value="' + H.esc(h.title) + '" aria-label="Habit name">'
      : '<span class="habit-title font-body-lg text-body-lg text-on-surface ' + (on ? 'line-through opacity-80 ' : '') + 'font-medium truncate">' + H.esc(h.title) + '</span><span class="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-label-sm text-[9px] uppercase tracking-wider font-semibold border border-outline-variant/20">' + cadLabel(h) + '</span>';
    return '<div class="habit-row flex items-start gap-space-md p-space-sm rounded ' + (on ? 'bg-surface-container/60' : 'bg-surface-container/30') + ' hover:bg-surface-container transition-colors ' + (fut ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer') + ' border border-outline-variant/20 relative group/row" data-id="' + h.id + '">' +
      '<button class="habit-checkbox w-6 h-6 rounded ' + box + ' flex items-center justify-center flex-shrink-0 mt-0.5" type="button" role="checkbox" aria-checked="' + on + '" aria-label="Toggle ' + H.esc(h.title) + '" data-act="toggle"' + (fut ? ' disabled' : '') + '><span class="material-symbols-outlined text-[16px] font-bold">check</span></button>' +
      '<div class="flex-1 min-w-0"><div class="flex items-center justify-between gap-space-sm"><div class="flex items-center gap-space-xs ' + (edit ? 'flex-1' : 'truncate') + '">' + title + '</div>' +
      '<div class="flex items-center gap-space-xs flex-shrink-0"><span class="habit-time font-label-sm text-[10px] ' + (on ? 'text-primary' : 'text-outline') + '">' + (on ? H.time12(t) : (fut ? 'Upcoming' : 'Pending')) + '</span>' +
      '<div class="' + (edit || arm ? 'flex' : 'hidden group-hover/row:flex focus-within:flex') + ' items-center gap-0.5"><button class="p-1 text-outline hover:text-primary transition-colors" title="Rename habit" aria-label="Rename habit" type="button" data-act="edit"><span class="material-symbols-outlined text-[14px]">' + (edit ? 'done' : 'edit') + '</span></button>' +
      '<button class="p-1 ' + (arm ? 'text-error' : 'text-outline') + ' hover:text-error transition-colors" title="' + (arm ? 'Click again to delete' : 'Delete habit') + '" aria-label="Delete habit" type="button" data-act="del"><span class="material-symbols-outlined text-[14px]">' + (arm ? 'delete_forever' : 'delete') + '</span></button></div></div></div>' +
      (h.desc ? '<p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">' + H.esc(h.desc) + '</p>' : '') + '</div></div>';
  }
  function dForm(p) {
    var wk = ui.addCad === 'weekly';
    return '<div class="p-space-sm rounded bg-surface-container-high border border-primary/40 shadow-inner space-y-space-xs mb-space-sm" data-form="add"><div class="flex items-center justify-between"><span class="font-label-sm text-[10px] text-primary uppercase font-bold flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">tune</span>Forge New Habit Node</span><span class="font-label-sm text-[9px] text-outline uppercase">Pillar: ' + H.esc(p.name) + '</span></div>' +
      '<div class="flex flex-col sm:flex-row items-center gap-space-xs"><input class="add-input w-full flex-1 bg-surface-container-lowest text-on-surface font-body-sm text-body-sm px-space-sm py-1 rounded outline-none border border-outline-variant/40 focus:border-primary" placeholder="e.g. Distributed Consensus Benchmark Script..." type="text" maxlength="60" aria-label="New habit name"><div class="flex items-center gap-1 w-full sm:w-auto">' +
      '<button class="flex-1 sm:flex-none px-2 py-1 rounded ' + (wk ? 'bg-surface-container text-primary font-semibold border border-primary/30' : 'bg-surface-container-lowest text-outline') + ' font-label-sm text-[10px] uppercase" type="button" data-act="cad-weekly">Weekly (' + ui.addTarget + 'x)</button>' +
      '<button class="flex-1 sm:flex-none px-2 py-1 rounded ' + (!wk ? 'bg-surface-container text-primary font-semibold border border-primary/30' : 'bg-surface-container-lowest text-outline') + ' font-label-sm text-[10px] uppercase" type="button" data-act="cad-daily">Daily (1x)</button></div></div>' +
      '<div class="flex items-center justify-end gap-space-xs pt-1"><button class="px-2 py-0.5 rounded text-outline hover:text-on-surface font-label-sm text-[10px] uppercase" type="button" data-act="add-cancel">Cancel</button><button class="px-space-sm py-0.5 rounded bg-primary text-on-primary font-label-sm text-[10px] uppercase font-bold hover:bg-primary-fixed" type="button" data-act="add-save">Forge Habit</button></div></div>';
  }
  function dPillar(p, hs, d) {
    var done = hs.filter(function (h) { return has(d, h.id); }).length, rate = hs.length ? Math.round(done / hs.length * 100) : 0;
    var open = ui.addFor === p.id;
    return '<div class="bg-surface-container-low rounded p-space-lg shadow-md flex flex-col justify-between relative group hover:shadow-lg transition-shadow border border-outline-variant/30" data-pillar="' + p.id + '"><div><div class="flex items-center justify-between mb-space-md"><div class="flex items-center gap-space-sm"><div class="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary"><span class="material-symbols-outlined text-[20px]">' + p.icon + '</span></div><div><span class="font-label-sm text-label-sm uppercase text-outline tracking-wider block">Discipline ' + p.roman + '</span><h2 class="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">' + H.esc(p.name) + '</h2></div></div>' +
      '<div class="flex items-center gap-space-xs"><span class="font-label-sm text-label-sm uppercase px-space-sm py-1 bg-primary/10 text-primary rounded font-semibold">' + done + ' / ' + hs.length + ' Cleared</span><button class="font-label-sm text-label-sm uppercase px-2 py-1 rounded ' + (open ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-highest text-primary') + ' transition-colors flex items-center gap-1 border border-outline-variant/30" type="button" data-act="add-open"><span class="material-symbols-outlined text-[14px]">add</span>Habit</button></div></div>' +
      '<div class="space-y-space-sm">' + (open ? dForm(p) : '') + (hs.length ? hs.map(function (h) { return dRow(h, d); }).join('') : '<p class="font-body-sm text-body-sm text-outline px-space-sm py-space-md">No habits in this discipline yet. Use + Habit to forge one.</p>') + '</div></div>' +
      '<div class="mt-space-md pt-space-sm flex items-center justify-between font-label-sm text-label-sm text-outline border-t border-outline-variant/20"><span>' + p.base + ': ' + (!hs.length ? 'Empty' : rate >= H.S.threshold ? 'Optimal' : rate > 0 ? 'Building' : 'Cold') + '</span><span class="flex items-center gap-1 ' + (rate >= H.S.threshold ? 'text-primary' : 'text-secondary') + '">' + (rate >= H.S.threshold ? '<span class="w-1.5 h-1.5 rounded-full bg-primary"></span> ' : '') + rate + '% Group Rate</span></div></div>';
  }

  /* ---------- templates: mobile ---------- */
  function mRow(h, d) {
    var on = has(d, h.id), fut = isFuture(d), t = on ? S.logs[d][h.id] : null, edit = ui.editing === h.id, arm = ui.delArm === h.id;
    var box = on ? 'bg-primary-container text-on-primary-container shadow-[0_0_8px_rgba(245,158,11,0.35)] transition-transform' : 'bg-surface-container-highest text-transparent hover:text-primary transition-all';
    var name = edit
      ? '<input class="edit-input w-full px-space-xs py-1 rounded bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none" maxlength="60" value="' + H.esc(h.title) + '" aria-label="Habit name">'
      : '<span class="font-body-md text-body-md font-medium text-on-surface truncate ' + (on ? 'opacity-90' : '') + '">' + H.esc(h.title) + '</span>';
    return '<div class="flex items-center justify-between p-space-xs rounded bg-surface-container-low hover:bg-surface-container-high/60 transition-colors ' + (fut ? 'opacity-60' : '') + '" data-id="' + h.id + '"><div class="flex items-center gap-space-xs min-w-0 flex-1">' +
      '<button class="habit-toggle w-6 h-6 rounded ' + box + ' flex items-center justify-center flex-shrink-0 active:scale-90" type="button" role="checkbox" aria-checked="' + on + '" aria-label="Toggle ' + H.esc(h.title) + '" data-act="toggle"' + (fut ? ' disabled' : '') + '><span class="material-symbols-outlined text-[16px] font-bold">check</span></button>' +
      '<div class="flex flex-col min-w-0 flex-1">' + name + '<div class="flex items-center gap-2 font-label-sm text-[11px] text-on-surface-variant"><span class="px-1 rounded bg-surface-container-highest uppercase text-tertiary">' + cadShort(h) + '</span><span>•</span><span class="' + (on ? 'text-primary-container' : '') + '">' + (on ? H.time12(t) : (fut ? 'Upcoming' : 'Pending')) + '</span></div></div></div>' +
      '<div class="flex items-center gap-1 flex-shrink-0"><button class="w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors" type="button" aria-label="Rename habit" data-act="edit"><span class="material-symbols-outlined text-[15px]">' + (edit ? 'done' : 'edit') + '</span></button>' +
      '<button class="w-7 h-7 flex items-center justify-center rounded ' + (arm ? 'text-error bg-surface-container-highest' : 'text-on-surface-variant') + ' hover:text-error hover:bg-surface-container-highest transition-colors" type="button" aria-label="Delete habit" data-act="del"><span class="material-symbols-outlined text-[15px]">' + (arm ? 'delete_forever' : 'delete') + '</span></button></div></div>';
  }
  function mForm() {
    var wk = ui.addCad === 'weekly';
    return '<div class="flex flex-col gap-space-xs p-space-sm rounded bg-surface-container-highest shadow-inner" data-form="add"><div class="flex items-center justify-between"><span class="font-label-sm text-label-sm uppercase font-bold text-primary">Forge New Habit</span><span class="font-label-sm text-[10px] text-on-surface-variant uppercase">Saved on this device</span></div>' +
      '<input class="add-input w-full px-space-xs py-1.5 rounded bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none" type="text" maxlength="60" placeholder="Name your habit" aria-label="New habit name">' +
      '<div class="flex items-center justify-between gap-space-xs mt-1"><div class="flex items-center gap-1"><button class="px-2 py-1 rounded ' + (!wk ? 'bg-primary-container text-on-primary-container font-bold shadow-sm' : 'bg-surface-container-low text-on-surface-variant') + ' font-label-sm text-label-sm uppercase" type="button" data-act="cad-daily">Daily (1x)</button><button class="px-2 py-1 rounded ' + (wk ? 'bg-primary-container text-on-primary-container font-bold shadow-sm' : 'bg-surface-container-low text-on-surface-variant') + ' font-label-sm text-label-sm uppercase" type="button" data-act="cad-weekly">Weekly (' + ui.addTarget + 'x)</button></div>' +
      '<div class="flex items-center gap-1"><button class="px-2 py-1 rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm uppercase" type="button" data-act="add-cancel">Cancel</button><button class="px-2.5 py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm uppercase font-bold shadow-sm" type="button" data-act="add-save">Forge Habit</button></div></div></div>';
  }
  function mPillar(p, hs, d) {
    var done = hs.filter(function (h) { return has(d, h.id); }).length, open = ui.addFor === p.id;
    return '<div class="flex flex-col gap-space-xs rounded-lg bg-surface-container p-space-sm shadow-sm" data-pillar="' + p.id + '"><div class="flex items-center justify-between pb-1"><div class="flex items-center gap-2"><div class="w-6 h-6 rounded bg-primary-container/20 flex items-center justify-center"><span class="material-symbols-outlined text-[15px] ' + MICON[p.id % 4] + '">' + p.icon + '</span></div><div class="flex items-center gap-1.5"><span class="font-label-md text-label-md uppercase font-bold text-on-surface">' + p.roman + '. ' + H.esc(p.name) + '</span><span class="font-label-sm text-label-sm ' + (done === hs.length && hs.length ? 'text-primary' : 'text-on-surface-variant') + ' px-1.5 py-0.2 rounded bg-surface-container-high">' + done + '/' + hs.length + ' Cleared</span></div></div>' +
      '<button class="flex items-center gap-1 px-2 py-0.5 rounded ' + (open ? 'bg-surface-container-highest text-primary font-semibold' : 'bg-surface-container-high hover:bg-surface-bright text-on-surface') + ' text-label-sm font-label-sm uppercase transition-all" type="button" data-act="add-open"><span class="material-symbols-outlined text-[14px] text-primary">' + (open ? 'expand_less' : 'add') + '</span><span>' + (open ? 'Active' : 'Add') + '</span></button></div>' +
      (open ? mForm() : '') + (hs.length ? hs.map(function (h) { return mRow(h, d); }).join('') : '<p class="font-body-sm text-body-sm text-on-surface-variant px-space-xs pb-1">No habits here yet. Tap Add to forge one.</p>') + '</div>';
  }

  /* ---------- render ---------- */
  function render() {
    var d = cur, c = H.campaign(), sc = H.score(d), fut = isFuture(d), st = H.streaks();
    var host = $('pillars');
    host.innerHTML = H.PILLARS.map(function (p) {
      var hs = S.habits.filter(function (h) { return h.pillar === p.id; });
      return MOBILE ? mPillar(p, hs, d) : dPillar(p, hs, d);
    }).join('');
    var inp = host.querySelector('.add-input'); if (inp) { inp.value = ui.addText || ''; if (ui.focusAdd) { inp.focus(); ui.focusAdd = false; } }
    var ed = host.querySelector('.edit-input'); if (ed && ui.focusEdit) { ed.focus(); ed.select(); ui.focusEdit = false; }

    var streakTxt = fut ? 'Upcoming day - logging opens ' + H.shortNice(d)
      : sc.pct >= S.threshold ? st.cur + '-day streak alive' : '+1 Day toward ' + (st.cur + 1) + '-day streak';
    var pct = sc.pct;
    if (!MOBILE) {
      $('strike-count').textContent = sc.done;
      $('strike-total').textContent = '/ ' + sc.total + ' Complete';
      var pe = $('strike-percentage'); pe.textContent = pct + '%';
      pe.className = 'ml-space-sm px-space-sm py-0.5 rounded font-label-md text-label-md font-bold ' + (pct >= S.threshold ? 'bg-primary text-on-primary shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-surface-container-highest text-primary');
      $('header-progress-fill').style.width = pct + '%';
      $('day-label').textContent = H.dow(d) + ' • ' + H.nice(d);
      $('streak-note').textContent = streakTxt;
      $('threshold-chip').textContent = 'Target Threshold: ' + S.threshold + '%';
      $('target-chip').textContent = 'Target: ' + S.threshold + '%';
      var mode = d === H.today() ? 'Live Ledger Mode • Logging ' : fut ? 'Upcoming • Viewing ' : 'Historical Ledger Mode • Viewing ';
      $('ledger-notice').textContent = mode + H.nice(d) + ' • Edits auto-save on this device';
      $('prev-day-btn').disabled = d <= c.start; $('next-day-btn').disabled = d >= c.end;
      $('prev-day-btn').style.opacity = d <= c.start ? .4 : ''; $('next-day-btn').style.opacity = d >= c.end ? .4 : '';
      $('sync-label').textContent = 'Saved locally';
      $('sync-timestamp').textContent = 'Last save ' + new Date(S.savedAt).toTimeString().split(' ')[0];
      $('threshold-val').textContent = S.threshold + '%'; $('threshold-slider').value = S.threshold;
      $('threshold-hint').textContent = 'Requires ' + H.need(sc.total) + ' of ' + sc.total + ' habits to forge a tempered strike day.';
      $('streak-rule').textContent = 'Current streak: ' + st.cur + ' day' + (st.cur === 1 ? '' : 's') + ' (best ' + st.best + ').';
      $('hf-year').innerHTML = renderYears(d); $('hf-month').innerHTML = renderMonths(d);
      renderTray(d);
    } else {
      $('strikeNumerator').textContent = sc.done;
      $('strikeTotal').textContent = '/ ' + sc.total + ' FORGED';
      $('strikePercentage').textContent = '(' + pct + '%)';
      $('progressBar').style.width = pct + '%';
      $('streakPill').textContent = st.cur + ' DAYS';
      $('streakNote').textContent = streakTxt;
      $('pinLine').style.left = S.threshold + '%';
      $('kaizenMark').textContent = 'KAISEN MARK: ' + S.threshold + '% (' + H.need(sc.total) + '/' + sc.total + ')';
      $('prevLabel').textContent = d <= c.start ? '--' : H.shortNice(H.addDays(d, -1)); $('nextLabel').textContent = d >= c.end ? '--' : H.shortNice(H.addDays(d, 1));
      $('prevBtn').disabled = d <= c.start; $('nextBtn').disabled = d >= c.end; $('prevBtn').style.opacity = d <= c.start ? .4 : ''; $('nextBtn').style.opacity = d >= c.end ? .4 : '';
      $('dateLabel').textContent = H.dow(d).slice(0, 3) + ', ' + H.shortNice(d);
      $('ledgerDate').textContent = H.monDay(d); $('ledgerState').textContent = 'AUTO-SAVED LOCALLY';
      $('syncState').textContent = 'SAVED';
      $('hf-month').innerHTML = renderMonths(d);
      $('thresholdSeg').innerHTML = renderSeg();
      $('thresholdHint').textContent = 'Default: 75% execution rate';
      $('restartStreak').textContent = 'Current streak ' + st.cur + 'd (best ' + st.best + 'd)';
    }
    $('markAllBtn') && ($('markAllBtn').disabled = fut);
    ($('toggle-all-btn') || {}).disabled = fut;
    var nt = $('daily-postgraduate-notes') || $('noteArea');
    if (document.activeElement !== nt) nt.value = S.notes[d] || '';
    ($('note-tags-day') || {}).textContent = 'Day ' + Math.max(1, H.diff(d, c.start) + 1) + ' of ' + c.total;
    ($('note-tags-score') || {}).textContent = 'Score: ' + pct + '%';
    renderWeek(d);
  }
  function renderYears(d) {
    var c = H.campaign(), ys = [+c.start.slice(0, 4)]; if (+c.end.slice(0, 4) !== ys[0]) ys.push(+c.end.slice(0, 4));
    var cy = +d.slice(0, 4);
    return ys.map(function (y) { return '<button class="font-label-sm text-label-sm uppercase px-space-sm py-[2px] rounded ' + (y === cy ? 'text-primary bg-surface-container font-semibold' : 'text-on-surface-variant hover:text-on-surface') + '" type="button" data-year="' + y + '">' + y + '</button>'; }).join('');
  }
  function monthsSpan() {
    var c = H.campaign(), out = [], d = c.start.slice(0, 7) + '-01';
    while (d <= c.end) { out.push(d.slice(0, 7)); d = H.iso(new Date(+d.slice(0, 4), +d.slice(5, 7), 1)); }
    return out;
  }
  function renderMonths(d) {
    var cm = d.slice(0, 7);
    return monthsSpan().map(function (m) {
      var on = m === cm, lab = H.MON[+m.slice(5, 7) - 1];
      return MOBILE ? '<button class="px-2.5 py-1 rounded ' + (on ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant hover:text-on-surface') + ' font-label-sm text-label-sm uppercase font-semibold transition-all" type="button" data-month="' + m + '">' + lab + '</button>'
        : '<button class="font-label-sm text-label-sm uppercase px-space-sm py-[2px] rounded ' + (on ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface') + '" type="button" data-month="' + m + '">' + lab + '</button>';
    }).join('');
  }
  function renderSeg() {
    var opts = [75, 85, 100]; if (opts.indexOf(S.threshold) < 0) { opts.push(S.threshold); opts.sort(function (a, b) { return a - b; }); }
    return opts.map(function (v) { return '<button class="px-2 py-0.5 rounded ' + (v === S.threshold ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant') + ' font-label-sm text-label-sm" type="button" data-thr="' + v + '">' + v + '%</button>'; }).join('');
  }
  function renderTray(d) {
    var c = H.campaign(), t = H.today(), out = '';
    var from = H.addDays(d, -2); if (from < c.start) from = c.start;
    for (var i = 0; i < 5; i++) {
      var x = H.addDays(from, i); if (x > c.end) break;
      var ok = true, sel = x === d;
      out += '<button class="px-space-sm py-[2px] ' + (sel ? 'bg-primary text-on-primary font-semibold rounded shadow-sm' : 'bg-surface-container-lowest rounded text-on-surface-variant hover:text-on-surface') + ' font-label-sm text-label-sm" type="button" data-jump="' + x + '">' + H.shortNice(x) + (x === t ? ' (Today)' : '') + '</button>';
    }
    $('tray-days').innerHTML = out;
    var di = $('jump-date'); di.min = c.start; di.max = c.end; di.value = d;
  }
  function renderWeek(d) {
    var ws = H.weekStart(d), labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'], wk = S.habits.filter(function (h) { return h.cadence === 'weekly'; });
    var t = H.today(), c = H.campaign();
    var weekNo = Math.floor(H.diff(ws, H.weekStart(c.start)) / 7) + 1, weeks = Math.floor(H.diff(H.weekStart(c.end), H.weekStart(c.start)) / 7) + 1;
    var wd = 0, wtot = 0; wk.forEach(function (h) { wtot++; if (H.weekCount(h, d) >= H.weekTarget(h)) wd++; });
    var el = $('week-title'); if (el) el.textContent = 'Weekly Quota Status (Week ' + weekNo + ' of ' + weeks + ')';
    var pe = $('week-text'); if (pe) pe.textContent = wk.length ? 'Weekly target habits (' + wk.map(function (h) { return h.title; }).join(', ') + ') evaluate on Sunday at 23:59. Current fulfillment: ' + Math.round(wd / wtot * 100) + '% (' + wd + '/' + wtot + ' complete).' : 'No weekly-target habits yet. Add a habit with a Weekly cadence to track a quota.';
    var cells = labels.map(function (l, i) {
      var x = H.addDays(ws, i), s = H.score(x), fut = x > t, today = x === t;
      var cls = fut || x < c.start || x > c.end ? 'bg-surface-container-high text-outline' : s.pct >= S.threshold ? 'bg-primary text-on-primary font-bold' : today ? 'bg-primary-container text-on-primary font-bold shadow-[0_0_8px_rgba(245,158,11,0.5)]' : s.pct > 0 ? 'bg-outline-variant text-on-surface' : 'bg-surface-container-high text-outline';
      return '<div class="w-7 h-7 rounded ' + cls + ' flex items-center justify-center font-label-sm text-label-sm' + (x === d ? ' ring-1 ring-primary' : '') + '" title="' + H.dow(x).slice(0, 3) + ': ' + (fut ? 'upcoming' : s.pct + '%') + '">' + l + '</div>';
    }).join('');
    var wb = $('week-days'); if (wb) wb.innerHTML = cells;
  }

  /* ---------- actions ---------- */
  function setCur(d) { cur = H.clampDate(d); ui.addFor = null; ui.editing = null; ui.delArm = null; render(); }
  function toggle(id) {
    if (isFuture(cur)) return;
    var l = S.logs[cur] || (S.logs[cur] = {});
    if (Object.prototype.hasOwnProperty.call(l, id)) delete l[id]; else l[id] = cur === H.today() ? nowHHMM() : '';
    H.save(); render();
  }
  function addHabit() {
    var inp = document.querySelector('.add-input'), v = (inp.value || '').trim();
    if (!v) { inp.classList.add('border-error'); inp.focus(); H.toast('Name your habit first'); return; }
    if (S.habits.some(function (h) { return h.pillar === ui.addFor && h.title.toLowerCase() === v.toLowerCase(); })) { inp.classList.add('border-error'); H.toast('That habit already exists here'); return; }
    S.habits.push({ id: H.uid(), pillar: ui.addFor, title: v, desc: '', cadence: ui.addCad, target: ui.addCad === 'weekly' ? ui.addTarget : 1 });
    H.save(); ui.addFor = null; ui.addText = ''; render(); H.toast('Habit forged');
  }
  function commitEdit(host) {
    var inp = host.querySelector('.edit-input'), v = inp ? inp.value.trim() : '';
    if (!v) { H.toast('Habit name cannot be empty'); return; }
    var h = S.habits.filter(function (x) { return x.id === ui.editing; })[0]; if (h) h.title = v;
    ui.editing = null; H.save(); render();
  }
  function bind() {
    document.addEventListener('click', function (e) {
      var t = e.target, a = t.closest('[data-act]');
      if (a) {
        var row = a.closest('[data-id]'), id = row && row.getAttribute('data-id'), act = a.getAttribute('data-act');
        if (act === 'toggle') return toggle(id);
        if (act === 'edit') { if (ui.editing === id) return commitEdit(row); ui.editing = id; ui.delArm = null; ui.focusEdit = true; return render(); }
        if (act === 'del') {
          if (ui.delArm === id) { S.habits = S.habits.filter(function (h) { return h.id !== id; }); Object.keys(S.logs).forEach(function (k) { delete S.logs[k][id]; }); ui.delArm = null; H.save(); render(); return H.toast('Habit deleted'); }
          ui.delArm = id; render(); setTimeout(function () { if (ui.delArm === id) { ui.delArm = null; render(); } }, 3000); return;
        }
        var pill = a.closest('[data-pillar]');
        if (act === 'add-open') { var pid = +pill.getAttribute('data-pillar'); ui.addFor = ui.addFor === pid ? null : pid; ui.addText = ''; ui.focusAdd = true; return render(); }
        if (act === 'add-cancel') { ui.addFor = null; return render(); }
        if (act === 'add-save') return addHabit();
        if (act === 'cad-daily') { ui.addText = document.querySelector('.add-input').value; ui.addCad = 'daily'; ui.focusAdd = true; return render(); }
        if (act === 'cad-weekly') { ui.addText = document.querySelector('.add-input').value; ui.addTarget = ui.addCad === 'weekly' ? (ui.addTarget % 6) + 1 : ui.addTarget; ui.addCad = 'weekly'; ui.focusAdd = true; return render(); }
      }
      // desktop: click on row toggles (not on inputs/buttons)
      var hr = t.closest('.habit-row');
      if (hr && !t.closest('button') && !t.closest('input')) return toggle(hr.getAttribute('data-id'));
      var m = t.closest('[data-month]'); if (m) { var mm = m.getAttribute('data-month'), cc = H.campaign(); var first = mm + '-01'; return setCur(mm === H.today().slice(0, 7) && H.today() >= cc.start ? H.today() : first); }
      var y = t.closest('[data-year]'); if (y) { var yy = y.getAttribute('data-year'), cc2 = H.campaign(); return setCur(cc2.start.slice(0, 4) === yy ? cc2.start : yy + '-01-01'); }
      var j = t.closest('[data-jump]'); if (j) return setCur(j.getAttribute('data-jump'));
      var th = t.closest('[data-thr]'); if (th) { S.threshold = +th.getAttribute('data-thr'); H.save(); return render(); }
    });
    document.addEventListener('keydown', function (e) {
      var t = e.target;
      if (t.classList && t.classList.contains('add-input')) { if (e.key === 'Enter') { e.preventDefault(); addHabit(); } if (e.key === 'Escape') { ui.addFor = null; render(); } }
      if (t.classList && t.classList.contains('edit-input')) { if (e.key === 'Enter') { e.preventDefault(); commitEdit(t.closest('[data-id]')); } if (e.key === 'Escape') { ui.editing = null; render(); } }
    });
    function markAll() { if (isFuture(cur)) return; var l = S.logs[cur] || (S.logs[cur] = {}); S.habits.forEach(function (h) { if (!Object.prototype.hasOwnProperty.call(l, h.id)) l[h.id] = cur === H.today() ? nowHHMM() : ''; }); H.save(); render(); }
    function reset(btn) {
      if (!ui.resetArm) { ui.resetArm = true; btn.textContent = 'Confirm?'; setTimeout(function () { ui.resetArm = false; btn.textContent = 'Reset'; }, 3000); return; }
      ui.resetArm = false; btn.textContent = 'Reset'; delete S.logs[cur]; H.save(); render(); H.toast('Day reset');
    }
    var ma = $('toggle-all-btn') || $('markAllBtn'), rs = $('reset-day-btn') || $('resetBtn');
    ma.addEventListener('click', markAll); rs.addEventListener('click', function () { reset(rs); });
    function restart(btn, label) {
      if (!ui.restartArm) { ui.restartArm = true; btn.textContent = 'Confirm: erases all logs'; setTimeout(function () { ui.restartArm = false; btn.textContent = label; }, 3500); return; }
      ui.restartArm = false; var f = H.fresh(); f.threshold = S.threshold; f.habits = S.habits; H.replaceState(f); S = H.S; cur = H.clampDate(H.today()); btn.textContent = label; render(); H.toast('Campaign restarted from today');
    }
    var rb = $('restart-btn'); if (rb) { var lab = rb.textContent; rb.addEventListener('click', function () { restart(rb, lab); }); }
    var noteEl = $('daily-postgraduate-notes') || $('noteArea'), noteSt = $('note-auto-status') || $('noteStatus'), tm;
    noteEl.addEventListener('input', function () { clearTimeout(tm); noteSt.textContent = 'Typing...'; tm = setTimeout(function () { S.notes[cur] = noteEl.value; H.save(); noteSt.textContent = MOBILE ? 'Draft stored locally' : 'Draft saved locally'; }, 500); });
    $('save-note-btn').addEventListener('click', function () { clearTimeout(tm); S.notes[cur] = noteEl.value; if (!noteEl.value.trim()) delete S.notes[cur]; H.save(); noteSt.textContent = MOBILE ? 'Saved' : 'Saved to ledger'; H.toast('Note saved'); });
    if (!MOBILE) {
      $('prev-day-btn').addEventListener('click', function () { setCur(H.addDays(cur, -1)); });
      $('next-day-btn').addEventListener('click', function () { setCur(H.addDays(cur, 1)); });
      $('toggle-jump-calendar').addEventListener('click', function () { $('calendar-jump-tray').classList.toggle('hidden'); });
      $('load-date-btn').addEventListener('click', function () { var v = $('jump-date').value; if (v) setCur(v); else H.toast('Pick a date first'); });
      var modal = $('forge-settings-modal'), open = function () { modal.classList.toggle('hidden'); };
      $('forge-settings-btn').addEventListener('click', open);
      $('close-settings-btn').addEventListener('click', function () { modal.classList.add('hidden'); });
      $('gear-btn').addEventListener('click', function () { modal.classList.remove('hidden'); window.scrollTo({ top: 0, behavior: 'smooth' }); });
      var nb = $('toggle-note-btn'); if (nb) nb.addEventListener('click', function () { var nbd = $('note-body'); var hid = nbd.classList.toggle('hidden'); nb.firstChild.textContent = hid ? 'unfold_more' : 'unfold_less'; nb.setAttribute('aria-expanded', !hid); });
      $('threshold-slider').addEventListener('input', function (e) { $('threshold-val').textContent = e.target.value + '%'; });
      $('save-threshold-btn').addEventListener('click', function () { S.threshold = +$('threshold-slider').value; H.save(); modal.classList.add('hidden'); render(); H.toast('Threshold set to ' + S.threshold + '%'); });
      $('force-sync-btn').addEventListener('click', function () { H.save(); render(); H.toast('Ledger saved on this device'); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') modal.classList.add('hidden'); });
    } else {
      $('prevBtn').addEventListener('click', function () { setCur(H.addDays(cur, -1)); });
      $('nextBtn').addEventListener('click', function () { setCur(H.addDays(cur, 1)); });
      var dp = $('datePicker');
      $('datePickerBtn').addEventListener('click', function () { var c = H.campaign(); dp.min = c.start; dp.max = c.end; dp.value = cur; if (dp.showPicker) { try { dp.showPicker(); } catch (e) { dp.focus(); } } else dp.focus(); });
      dp.addEventListener('change', function () { if (dp.value) setCur(dp.value); });
      var panel = $('thresholdPanel'), chev = $('thresholdChevron');
      function panelToggle(force) { var hid = panel.classList.contains('hidden'); var open = force === undefined ? hid : force; panel.classList.toggle('hidden', !open); panel.classList.toggle('flex', open); chev.textContent = open ? 'expand_less' : 'expand_more'; $('toggleThresholdBtn').setAttribute('aria-expanded', open); }
      $('toggleThresholdBtn').addEventListener('click', function () { panelToggle(); });
      $('gear-btn').addEventListener('click', function (e) { e.preventDefault(); panelToggle(true); panel.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
      if (location.hash === '#settings') panelToggle(true);
    }
  }
  bind(); render();
})();

