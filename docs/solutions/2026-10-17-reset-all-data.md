# Erase all data (17 Oct 2026)

## What changed
- Tracker settings now carry TWO reset controls (`tracker.html`, `m/tracker.html`,
  wiring in `assets/tracker.js`):
  - **Restart Campaign** (unchanged): erases the daily logs and restarts the campaign from
    today, but keeps the habit list and threshold. Two-tap confirm: "Confirm: erases all logs".
  - **Erase All Data** (new, red: `border-error/50 bg-error-container/30 text-error`):
    full wipe - `H.replaceState(H.fresh())` clears habits, logs, notes and settings back to
    the cold empty first-run state. Caution confirm: first tap arms it
    ("Confirm: resets everything to zero"), reverts after 3.5s; second tap executes.
    Toast: "All data reset to zero".
- First-run tour explains both buttons on the tracker steps (desktop + mobile copy in
  `assets/tour.js`); step counts and anchors unchanged.
- Sign-in session (`habitforge:auth:v1`) and tour seen flag (`habitforge:tour:v1`) are untouched.

## Why
User asked to wipe his populated habit list to zero, then chose to keep Restart Campaign
as-is and add a separate red Erase All Data button behind a caution confirm.

## Trigger paths
- Restart Campaign: Daily Tracker > forge settings (tune icon, desktop) / settings panel (mobile) > Restart Campaign > Confirm.
- Erase All Data: same panel > red Erase All Data button > Confirm.
