# Google SSO sign-in (16 Oct 2026)

## What changed
- `index.html` is now the sign-in landing page (desktop); `m/index.html` the mobile one.
  The dashboard moved to `dashboard.html` / `m/dashboard.html`.
- `assets/auth-config.js` holds the Google OAuth 2.0 Web client ID
  (Google Cloud project "HabitForge", id `habitforge-511808`; consent screen in
  Testing mode, harshit.chebolu99@gmail.com listed as test user).
- `assets/auth.js` - session store (`habitforge:auth:v1`, 30-day expiry), GIS
  credential handler, avatar sign-out wiring.
- `assets/core.js` - combined router: signed-out visits to any app page bounce to
  the sign-in page; signed-in visits to the sign-in page go to the dashboard;
  viewport (desktop <-> mobile) routing unchanged.
- All four app pages: header avatar gets `id="hf-avatar"` (shows Google photo,
  click to sign out); dashboard nav links point to `dashboard.html`.

## Notes
- Static-site gate: sign-in state lives in localStorage; this is a personal-app
  wall, not server-side security.
- OAuth client secret is not used (GIS ID-token flow needs only the client ID).
- Deploy: `vercel deploy --prod` from repo root (project already linked).
