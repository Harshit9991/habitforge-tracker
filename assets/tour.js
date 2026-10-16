/* HabitForge first-run tour: one guided pass per account per page. No dependencies. */
(function () {
  'use strict';
  var KEY = 'habitforge:tour:v1';
  var AUTH_KEY = 'habitforge:auth:v1';
  var DIM = 'rgba(4,6,10,0.72)';

  function session() {
    try { var s = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); if (s && s.exp && s.exp > Date.now()) return s; } catch (e) {}
    return null;
  }
  function seenMap() {
    try { var m = JSON.parse(localStorage.getItem(KEY) || '{}'); return m && typeof m === 'object' ? m : {}; } catch (e) { return {}; }
  }
  function markSeen(sub, page) {
    var m = seenMap(); if (!m[sub]) m[sub] = {}; m[sub][page] = 1;
    try { localStorage.setItem(KEY, JSON.stringify(m)); } catch (e) {}
  }

  var WELCOME = { sel: null, title: 'Welcome to HabitForge', body: 'A 90-day forge for new habits. This quick tour shows the key features - it appears once per account, then never again.' };
  var STEPS = {
    'dashboard:desktop': [
      WELCOME,
      { sel: '#kpis', title: 'Vitals at a glance', body: 'Monthly consistency vs your target, the current streak, weekly kaizen pacing, and where the ledger lives (this browser).' },
      { sel: '#chart-host', title: 'Execution curve', body: 'Daily completion against the temper line. Switch between 30 days, 90 days and the full arc.' },
      { sel: '#donut-host', title: 'Forged split', body: 'Share of strikes landed over the last 30 days, with per-discipline bars below.' },
      { sel: '#kaizen-body', title: 'Weekly kaizen ledger', body: 'Every habit against its weekly target - met, in progress, or at risk. Export the ledger as CSV anytime.' },
      { sel: '#heat-host', title: 'Campaign heatmap', body: 'Every day of the 90-day arc. A day tempers amber once you beat the threshold.' },
      { sel: '#gear-btn', title: 'Tune the forge', body: 'Set the target threshold and the pacing algorithm here.' },
      { sel: 'a[data-path="daily-tracker"]', title: 'Next: the Daily Tracker', body: 'Forge habits and log strikes there. A short tour greets you on your first visit.' }
    ],
    'dashboard:mobile': [
      WELCOME,
      { sel: '#kpis', title: 'Vitals at a glance', body: 'Consistency vs your target, current streak, weekly pacing and where the ledger lives (this browser).' },
      { sel: '#chart-host', title: 'Execution curve', body: 'Daily completion with the latest day called out. The temper line marks your target.' },
      { sel: '#pillar-bars', title: 'Discipline split', body: 'Execution rate per pillar, with the 30-day forged ring just above.' },
      { sel: '#kaizen-list', title: 'Weekly kaizen', body: 'Every habit against its weekly target - met, active, or at risk.' },
      { sel: '#heat-host', title: 'Campaign heatmap', body: 'The full 90-day arc. A day tempers amber once you beat the threshold.' },
      { sel: 'a[data-path="daily-tracker"]', title: 'Next: the Tracker', body: 'Forge habits and log strikes from here. A short tour greets you there.' }
    ],
    'tracker:desktop': [
      { sel: '#pillars', title: 'Four disciplines', body: 'Your habits live here, grouped by pillar. It starts empty - use + Habit on a pillar to forge your first one.' },
      { sel: '#day-label', title: 'Day navigator', body: 'Step through the campaign or jump to any date. Future days stay read-only.' },
      { sel: '#toggle-all-btn', title: 'Strike the day', body: 'Tap a habit to log a strike, or mark the whole day at once. Reset clears the viewed day.' },
      { sel: '#daily-postgraduate-notes', title: 'Field notes', body: 'A journal per day. It autosaves as you type.' },
      { sel: '#forge-settings-btn', title: 'Forge settings', body: 'Two resets live here. Restart Campaign erases your logs but keeps the habits. Erase All Data (the red one) wipes everything to zero - habits, logs and settings.' },
      { sel: 'a[data-path="dashboard"]', title: 'Back to the Dashboard', body: 'Curves, streaks and the heatmap update as you log. Tour complete - forge on.' }
    ],
    'tracker:mobile': [
      { sel: '#pillars', title: 'Four disciplines', body: 'Your habits live here, grouped by pillar. It starts empty - tap Add on a pillar to forge your first one.' },
      { sel: '#dateLabel', title: 'Day switcher', body: 'Move through the campaign with the arrows. Future days stay read-only.' },
      { sel: '#markAllBtn', title: 'Strike the day', body: 'Tap a habit to log it, or mark the whole day. Reset clears the viewed day.' },
      { sel: '#noteArea', title: 'Field notes', body: 'A journal per day. It autosaves as you type.' },
      { sel: '#toggleThresholdBtn', title: 'Threshold & resets', body: 'Two resets live here. Restart Campaign clears logs but keeps habits. Erase All Data (the red one) wipes everything to zero.' },
      { sel: 'a[data-path="dashboard"]', title: 'Back to the Dashboard', body: 'Stats, streaks and the heatmap update as you log. Tour complete - forge on.' }
    ]
  };

  function run(page, steps, sub) {
    var i = 0, done = false;
    var back = document.createElement('div');
    back.style.cssText = 'position:fixed;inset:0;z-index:100;background:' + DIM + ';';
    var spot = document.createElement('div');
    spot.style.cssText = 'position:fixed;z-index:101;pointer-events:none;border-radius:8px;border:1px solid rgba(255,193,116,0.9);box-shadow:0 0 0 9999px ' + DIM + ', 0 0 24px rgba(245,158,11,0.35);transition:all .25s ease;display:none;';
    var card = document.createElement('div');
    card.className = 'bg-surface-container-high border border-primary/30 rounded-lg shadow-2xl';
    card.style.cssText = 'position:fixed;z-index:102;padding:14px 16px;';
    card.setAttribute('role', 'dialog');
    document.body.appendChild(back); document.body.appendChild(spot); document.body.appendChild(card);

    function place() {
      if (done) return;
      var st = steps[i];
      var el = st.sel && document.querySelector(st.sel);
      var vw = window.innerWidth, vh = window.innerHeight;
      var cw = Math.min(340, vw - 24);
      card.style.width = cw + 'px';
      var r = el ? el.getBoundingClientRect() : null;
      if (!el || (r.width === 0 && r.height === 0)) {
        spot.style.display = 'none'; back.style.background = DIM;
        card.style.left = ((vw - cw) / 2) + 'px';
        card.style.top = Math.max(16, (vh - card.offsetHeight) / 2) + 'px';
        return;
      }
      back.style.background = 'transparent';
      var pad = 8;
      spot.style.display = 'block';
      spot.style.left = (r.left - pad) + 'px'; spot.style.top = (r.top - pad) + 'px';
      spot.style.width = (r.width + pad * 2) + 'px'; spot.style.height = (r.height + pad * 2) + 'px';
      var ch = card.offsetHeight, top;
      if (vh - r.bottom >= ch + 24) top = r.bottom + 12;
      else if (r.top >= ch + 24) top = r.top - ch - 12;
      else top = Math.max(12, (vh - ch) / 2);
      var left = Math.min(Math.max(12, r.left + r.width / 2 - cw / 2), vw - cw - 12);
      card.style.left = left + 'px'; card.style.top = top + 'px';
    }
    function draw() {
      var st = steps[i];
      card.innerHTML =
        '<div class="font-label-sm text-[10px] uppercase text-outline tracking-wider" style="margin-bottom:6px">HabitForge tour &middot; ' + (i + 1) + ' / ' + steps.length + '</div>' +
        '<div class="font-label-sm text-label-sm uppercase text-primary tracking-wider font-bold" style="margin-bottom:4px">' + st.title + '</div>' +
        '<div class="font-body-sm text-body-sm text-on-surface-variant" style="margin-bottom:12px">' + st.body + '</div>' +
        '<div style="display:flex;align-items:center;gap:8px">' +
          '<button type="button" data-t="skip" class="font-label-sm text-label-sm uppercase text-outline hover:text-on-surface" style="margin-right:auto">Skip</button>' +
          (i > 0 ? '<button type="button" data-t="back" class="font-label-sm text-label-sm uppercase px-3 py-1.5 rounded bg-surface-container-lowest text-on-surface-variant hover:text-on-surface">Back</button>' : '') +
          '<button type="button" data-t="next" class="font-label-sm text-label-sm uppercase px-4 py-1.5 rounded bg-primary text-on-primary font-bold hover:bg-primary-container">' + (i === steps.length - 1 ? 'Done' : 'Next') + '</button>' +
        '</div>';
      var st2 = steps[i];
      var el = st2.sel && document.querySelector(st2.sel);
      if (el && el.scrollIntoView) {
        try { el.scrollIntoView({ block: 'center', behavior: 'auto' }); } catch (e) { el.scrollIntoView(); }
      }
      requestAnimationFrame(function () { requestAnimationFrame(place); });
    }
    function finish() {
      if (done) return; done = true;
      markSeen(sub, page);
      back.remove(); spot.remove(); card.remove();
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      document.removeEventListener('keydown', keys, true);
    }
    function next() { if (i < steps.length - 1) { i++; draw(); } else finish(); }
    function prev() { if (i > 0) { i--; draw(); } }
    function keys(e) {
      if (e.key === 'Escape') { e.stopPropagation(); finish(); }
      else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.stopPropagation(); next(); }
      else if (e.key === 'ArrowLeft') { e.stopPropagation(); prev(); }
    }
    back.addEventListener('click', finish);
    card.addEventListener('click', function (e) {
      var b = e.target.closest('[data-t]'); if (!b) return;
      var a = b.getAttribute('data-t');
      if (a === 'skip') finish(); else if (a === 'back') prev(); else next();
    });
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    document.addEventListener('keydown', keys, true);
    draw();
  }

  function boot() {
    var s = session(); if (!s || !s.sub) return;
    var file = location.pathname.split('/').pop() || 'index.html';
    var page = file.indexOf('tracker') === 0 ? 'tracker' : file.indexOf('dashboard') === 0 ? 'dashboard' : null;
    if (!page) return;
    var view = document.documentElement.getAttribute('data-view') === 'mobile' ? 'mobile' : 'desktop';
    var steps = STEPS[page + ':' + view]; if (!steps) return;
    var m = seenMap(); if (m[s.sub] && m[s.sub][page]) return;
    setTimeout(function () { run(page, steps, s.sub); }, 450);
  }
  window.HFTour = { reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
