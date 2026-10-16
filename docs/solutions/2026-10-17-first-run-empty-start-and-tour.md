# First-run experience: empty start + one-time guided tour (2026-10-17)

Request (Harshit, WhatsApp, Oct 17): (1) a first login must show a completely empty
habit list so each user adds their own habits; (2) the first-ever login per account
shows a dialog-box tour of each page's key features, later logins skip it.

## What changed

- `assets/core.js`: removed the `STARTERS` habit list and the auto-seed in
  `fresh()` - a brand-new browser now starts with zero habits. Removed `seed()`
  (sample 20-day ledger generator) and its export.
- `assets/dashboard.js`: removed the seed-button handler and the mobile seed link.
- `dashboard.html`, `m/dashboard.html`: the cold-state banner no longer offers
  "Load Sample Ledger"; copy now points the user at the Daily Tracker to add their
  first habit. Seed button markup removed. `assets/tour.js` included.
- `tracker.html`, `m/tracker.html`: `assets/tour.js` included.
- `assets/tour.js` (new): dialog-style guided tour, one sequence per page
  (dashboard 8 steps desktop / 7 mobile, tracker 6 steps), spotlighting the key
  controls in the existing Tailwind visual language (no aesthetic changes).
  Seen-state is stored per Google account (`habitforge:tour:v1`, keyed by the
  Google `sub`), so the tour plays once per account per browser and is skipped on
  later logins.
- `README.md`: documents the empty first run and the tour.

## Decisions

- Existing stored data is never touched: anyone with a saved `habitforge:v1`
  (Harshit's own ledger) keeps it exactly as-is; only fresh browsers get the
  empty start.
- The sample-ledger preview ("Load Sample Ledger") was removed entirely rather
  than kept as an option: a first-run user should build their own list, and the
  tour now covers the "what is this page" job the sample data used to do.
- Tour seen-state is per-account via the Google `sub`, but storage is
  localStorage-only (the app has no backend), so the same account on a second
  browser/device sees the tour once there too.

## Notes

- Edits were made to the built HTML/JS directly (same as the SSO commit);
  `build.py` predates the SSO gate and would regenerate stale pages.
- Verified on a preview deploy (desktop + mobile, empty state, tour skip/finish
  persistence, per-account replay, add-habit flow, no console errors) and then
  deployed to production at https://habitforge-tracker.vercel.app.
