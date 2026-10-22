/* HabitForge auth: Google SSO via Supabase (HFCloud), sign-in page handler, avatar sign-out. No dependencies. */
(function () {
  'use strict';
  var KEY = 'habitforge:auth:v1';

  function session() {
    try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.exp && s.exp > Date.now()) return s; } catch (e) {}
    return null;
  }
  function signOut() {
    if (window.HFCloud && HFCloud.signOut) HFCloud.signOut();
    try { localStorage.removeItem(KEY); } catch (e) {}
    location.replace((window.matchMedia('(max-width: 767px)').matches ? '/m/' : '/') + 'index.html');
  }
  function initSignin() {
    var host = document.getElementById('g_id_signin');
    if (!host || !window.HFCloud) return false;
    if (host.getAttribute('data-rendered')) return true;
    host.setAttribute('data-rendered', '1');
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'inline-flex items-center gap-space-sm px-space-lg h-11 rounded-full bg-on-surface text-surface font-label-lg text-label-lg uppercase tracking-wider hover:bg-primary-fixed transition-colors';
    b.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"/><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" fill="#34A853"/><path d="M3.97 10.72a5.41 5.41 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z" fill="#FBBC05"/><path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.64 8.64 0 0 0 9 0 9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/></svg><span>Continue with Google</span>';
    b.addEventListener('click', function () { HFCloud.signInWithGoogle(); });
    host.appendChild(b);
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
  window.HFAuth = { session: session, signOut: signOut };

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
