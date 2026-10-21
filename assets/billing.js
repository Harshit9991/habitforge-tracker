/* HabitForge billing: plan gate config, entitlement check, checkout routing. No dependencies. */
(function () {
  'use strict';
  /* MASTER SWITCH: keep ENFORCE false until the Dodo Payments checkout links below are set.
     While false, the plans page and all CTAs are live but nothing is gated. */
  var CONFIG = {
    ENFORCE: false,         /* true = signed-in users without an entitlement are sent to the plans page */
    CHECKOUT_EMBER: '',     /* Dodo Payments checkout link for The Ember (monthly) */
    CHECKOUT_GAUNTLET: ''   /* Dodo Payments checkout link for The Gauntlet (90-day pass) */
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
  function plansUrl() { return (isMobile() ? '/m/' : '/') + 'pricing.html'; }
  function locked() { return !!CONFIG.ENFORCE && !entitled(); }
  function requireAccess() { if (locked()) location.replace(plansUrl()); }
  function afterSigninUrl(fallback) { return locked() ? plansUrl() : fallback; }
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
    var url = plan === 'gauntlet' ? CONFIG.CHECKOUT_GAUNTLET : CONFIG.CHECKOUT_EMBER;
    if (url) { location.href = url; return; }
    toast('Checkout opens soon - Dodo wiring in progress');
  }
  window.HFBilling = { CONFIG: CONFIG, entitled: entitled, grant: grant, locked: locked, requireAccess: requireAccess, afterSigninUrl: afterSigninUrl, plansUrl: plansUrl, checkout: checkout, toast: toast };

  /* Auto-gate protected pages. Sign-in and plans pages include this file too; they never redirect. */
  var page = document.documentElement.getAttribute('data-page');
  if (page !== 'signin' && page !== 'plans') requireAccess();
})();
