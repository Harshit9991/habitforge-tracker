/* HabitForge cloud layer: Supabase Auth (Google only), state sync, entitlement check.
   Loaded after billing.js and core.js. Requires window.HF_SUPABASE_URL and
   window.HF_SUPABASE_ANON_KEY (supabase-config.js, public-safe values only). */
(function () {
  'use strict';
  var AUTH_KEY = 'habitforge:auth:v1';
  var SESSION_DAYS = 30;
  var client = null;
  var currentUser = null;
  var syncTimer = null;

  function ready() { return !!(window.supabase && window.HF_SUPABASE_URL && window.HF_SUPABASE_ANON_KEY); }
  function isSigninPage() { return document.documentElement.getAttribute('data-page') === 'signin'; }

  /* Bridge the Supabase user into the same local session blob the rest of the app
     already reads (billing owner exemption, avatar, sign-out). Never stores secrets. */
  function adoptSession(user) {
    if (!user || !user.email) return;
    var md = user.user_metadata || {};
    var s = {
      sub: user.id, email: user.email,
      name: md.full_name || md.name || '', picture: md.avatar_url || md.picture || '',
      exp: Date.now() + SESSION_DAYS * 864e5
    };
    try { localStorage.setItem(AUTH_KEY, JSON.stringify(s)); } catch (e) {}
    syncEntitlement(user.email);
    if (isSigninPage()) {
      var dest = (window.matchMedia('(max-width: 767px)').matches ? '/m/' : '/') + 'dashboard.html';
      if (window.HFBilling) dest = HFBilling.afterSigninUrl(dest);
      location.replace(dest);
    }
  }
  function dropSession() { try { localStorage.removeItem(AUTH_KEY); } catch (e) {} }

  function init() {
    if (client || !ready()) return client;
    client = window.supabase.createClient(window.HF_SUPABASE_URL, window.HF_SUPABASE_ANON_KEY);
    client.auth.onAuthStateChange(function (event, session) {
      currentUser = session && session.user ? session.user : null;
      if (event === 'SIGNED_IN' && currentUser) { adoptSession(currentUser); pullState(); }
      if (event === 'SIGNED_OUT') dropSession();
    });
    client.auth.getSession().then(function (r) {
      currentUser = r && r.data && r.data.session ? r.data.session.user : null;
      if (currentUser) { adoptSession(currentUser); pullState(); }
    });
    return client;
  }
  function user() { return currentUser; }
  function signInWithGoogle() {
    if (!init()) return;
    client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + location.pathname } });
  }
  function signOut() { if (client) return client.auth.signOut(); }

  /* ---- state sync: one row per user, whole tracker blob (same shape as localStorage) ---- */
  function pullState() {
    if (!client || !currentUser) return;
    client.from('states').select('data,updated_at').eq('user_id', currentUser.id).maybeSingle().then(function (r) {
      if (r.error) return;
      var local = null;
      try { local = JSON.parse(localStorage.getItem('habitforge:v1') || 'null'); } catch (e) {}
      if (!r.data) {
        // First cloud sign-in: upload existing local data if any.
        if (local && local.v === 1) pushState(local);
        return;
      }
      var cloud = r.data.data;
      var cloudNewer = !local || !local.savedAt || (cloud && cloud.savedAt && cloud.savedAt > local.savedAt);
      if (cloud && cloud.v === 1 && cloudNewer) {
        try { localStorage.setItem('habitforge:v1', JSON.stringify(cloud)); } catch (e) {}
        if (window.HFStore && HFStore.replaceState) HFStore.replaceState(cloud);
        location.reload();
      }
    });
  }
  function pushState(state) {
    if (!client || !currentUser || !state) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () {
      client.from('states').upsert({ user_id: currentUser.id, data: state, updated_at: new Date().toISOString() })
        .then(function () {});
    }, 800);
  }

  /* ---- entitlements: did this email buy the Crucible pass? ---- */
  function checkEntitlement(email, cb) {
    if (!init()) { cb(null); return; }
    client.from('entitlements').select('id,plan,status').eq('email', String(email || '').toLowerCase())
      .eq('status', 'active').limit(1).then(function (r) {
        cb(r && r.data && r.data.length ? r.data[0] : null);
      });
  }
  function syncEntitlement(email) {
    checkEntitlement(email, function (row) {
      if (row && window.HFBilling && HFBilling.grant) HFBilling.grant(row.plan || 'lifetime');
    });
  }

  /* Poll briefly for the session to resolve (OAuth redirect restores it async). */
  function whenUser(cb, ms) {
    var waited = 0, step = 150, max = ms || 3000;
    (function poll() {
      if (currentUser) { cb(currentUser); return; }
      if ((waited += step) >= max) { cb(null); return; }
      setTimeout(poll, step);
    })();
  }

  window.HFCloud = {
    init: init, user: user, signInWithGoogle: signInWithGoogle, signOut: signOut,
    pullState: pullState, pushState: pushState, checkEntitlement: checkEntitlement,
    syncEntitlement: syncEntitlement, whenUser: whenUser
  };
  init();
})();
