/* HabitForge auth: Google SSO session, sign-in page handler, avatar sign-out. No dependencies. */
(function () {
  'use strict';
  var KEY = 'habitforge:auth:v1';
  var SESSION_DAYS = 30;

  function decodeJwt(t) {
    try {
      var p = t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(decodeURIComponent(atob(p).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')));
    } catch (e) { return null; }
  }
  function session() {
    try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.exp && s.exp > Date.now()) return s; } catch (e) {}
    return null;
  }
  function signOut() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.replace((window.matchMedia('(max-width: 767px)').matches ? '/m/' : '/') + 'index.html');
  }
  function onCredential(resp) {
    var c = resp && resp.credential ? decodeJwt(resp.credential) : null;
    var cid = window.HF_GOOGLE_CLIENT_ID;
    if (!c || !c.sub || (cid && c.aud !== cid) || (c.exp && c.exp * 1000 < Date.now())) return;
    var s = { sub: c.sub, email: c.email || '', name: c.name || '', picture: c.picture || '', exp: Date.now() + SESSION_DAYS * 864e5 };
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    var dest = (window.matchMedia('(max-width: 767px)').matches ? '/m/' : '/') + 'dashboard.html';
    if (window.HFBilling) dest = HFBilling.afterSigninUrl(dest);
    location.replace(dest);
  }
  function initSignin() {
    var host = document.getElementById('g_id_signin');
    if (!host || !window.google || !google.accounts || !google.accounts.id) return false;
    if (host.getAttribute('data-rendered')) return true;
    host.setAttribute('data-rendered', '1');
    google.accounts.id.initialize({ client_id: window.HF_GOOGLE_CLIENT_ID, callback: onCredential, ux_mode: 'popup' });
    google.accounts.id.renderButton(host, { theme: 'filled_black', size: 'large', shape: 'pill', text: 'signin_with', width: 300 });
    return true;
  }
  function wireAvatar() {
    var a = document.getElementById('hf-avatar');
    if (!a) return;
    var s = session();
    if (!s) return;
    a.style.cursor = 'pointer';
    a.setAttribute('title', (s.name ? s.name + ' - ' : '') + 'Sign out');
    if (s.picture) a.innerHTML = '<img src="' + s.picture + '" alt="" referrerpolicy="no-referrer" class="w-full h-full rounded-full object-cover">';
    a.addEventListener('click', function () { if (window.confirm('Sign out of HabitForge?')) signOut(); });
  }
  window.HFAuth = { session: session, signOut: signOut, onCredential: onCredential };

  var isSignin = document.documentElement.getAttribute('data-page') === 'signin';
  function ready(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  if (isSignin) {
    ready(function () {
      if (initSignin()) return;
      var tries = 0;
      var t = setInterval(function () { if (initSignin() || ++tries > 60) clearInterval(t); }, 250);
    });
  } else {
    ready(wireAvatar);
  }
})();
