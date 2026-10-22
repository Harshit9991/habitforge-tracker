/* HabitForge billing: plan gate config, entitlement check, checkout routing. No dependencies. */
(function () {
  'use strict';
  /* MASTER SWITCH: keep ENFORCE false until the Dodo Payments checkout link below is set.
     While false, the plans page and all CTAs are live but nothing is gated.
     Tier model (frozen 22 Oct): FREE = the daily tracker for any signed-in user.
     PAID (lifetime, one-time) = the dashboard: insights, patterns, streaks, heatmap, export. */
  var CONFIG = {
    ENFORCE: true,           /* true = signed-in users without an entitlement can't open the dashboard */
    CHECKOUT_LIFETIME: 'https://checkout.dodopayments.com/buy/pdt_0NqHv2GHWEkdXBD90yHOT?quantity=1&redirect_url=https%3A%2F%2Fhabitforgetracker.in%2Fpricing.html'    /* Dodo Payments checkout link for the lifetime Crucible pass */
  };
  var KEY = 'habitforge:billing:v1';
  /* Owner testing exemption. Client-side only, just like the rest of this gate.
     Read the current auth session on every check, including before auth.js loads.
     Never persist a paid grant: signing out/switching accounts removes the exemption. */
  function ownerExempt() {
    try {
      var s = JSON.parse(localStorage.getItem('habitforge:auth:v1') || 'null');
      return !!(s && s.sub && s.exp > Date.now() && typeof s.email === 'string' &&
        s.email.toLowerCase() === 'harshit.chebolu99@gmail.com');
    } catch (e) { return false; }
  }
  function entitled() {
    if (ownerExempt()) return true;
    try { var e = JSON.parse(localStorage.getItem(KEY) || 'null'); return !!(e && e.plan); } catch (e) { return false; }
  }
  function grant(plan) { try { localStorage.setItem(KEY, JSON.stringify({ plan: plan, at: Date.now() })); } catch (e) {} }
  function isMobile() { return window.matchMedia('(max-width: 767px)').matches; }
  function pageUrl(name) { return (isMobile() ? '/m/' : '/') + name; }
  function plansUrl() { return pageUrl('pricing.html'); }
  function trackerUrl() { return pageUrl('tracker.html'); }
  function locked() { return !!CONFIG.ENFORCE && !entitled(); }
  function requireAccess() {
    if (!locked()) return;
    /* Before bouncing, give the cloud one async re-check: right after a purchase the
       entitlement row exists but the local grant may not have landed yet. */
    if (window.HFCloud && HFCloud.whenUser) {
      HFCloud.whenUser(function (u) {
        if (!u) { location.replace(plansUrl()); return; }
        HFCloud.checkEntitlement(u.email, function (row) {
          if (row) { grant(row.plan || 'lifetime'); location.reload(); }
          else location.replace(plansUrl());
        });
      }, 3500);
      return;
    }
    location.replace(plansUrl());
  }
  /* Free users land on the tracker (their tier); paid users go where they were headed. */
  function afterSigninUrl(fallback) { return locked() ? trackerUrl() : fallback; }
  function toast(msg) {
    if (window.H && H.toast) return H.toast(msg);
    var el = document.getElementById('hf-toast');
    if (!el) {
      el = document.createElement('div'); el.id = 'hf-toast';
      el.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#272a30;color:#e1e2ea;padding:10px 16px;border-radius:8px;font:600 12px "JetBrains Mono",monospace;letter-spacing:.06em;text-transform:uppercase;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.5);display:none';
      document.body.appendChild(el);
    }
    el.textContent = msg; el.style.display = 'block';
    clearTimeout(el._t); el._t = setTimeout(function () { el.style.display = 'none'; }, 2600);
  }
  function checkout(plan) {
    var url = CONFIG.CHECKOUT_LIFETIME;
    if (url) { location.href = url; return; }
    toast('Checkout opens soon - Dodo wiring in progress');
  }
  /* Dodo static payment links redirect back with ?payment_id=...&status=succeeded (and email).
     A succeeded return grants the lifetime pass on this device and sends the user to the dashboard. */
  function handleReturn() {
    try {
      if (!location.search) return;
      var q = new URLSearchParams(location.search);
      var ok = q.get('status') === 'succeeded' && (q.get('payment_id') || q.get('subscription_id'));
      if (!ok) return;
      grant('lifetime');
      if (history && history.replaceState) history.replaceState(null, '', location.pathname);
      toast('Crucible pass claimed - welcome in');
      location.replace(pageUrl('dashboard.html'));
    } catch (e) {}
  }
  window.HFBilling = { CONFIG: CONFIG, entitled: entitled, grant: grant, locked: locked, requireAccess: requireAccess, afterSigninUrl: afterSigninUrl, plansUrl: plansUrl, trackerUrl: trackerUrl, checkout: checkout, toast: toast };

  /* Handle a payment return on any page, then auto-gate the dashboard only.
     The tracker, sign-in and plans pages stay open to every signed-in user (free tier). */
  handleReturn();
  var page = document.documentElement.getAttribute('data-page');
  if (page === 'dashboard') requireAccess();
})();
