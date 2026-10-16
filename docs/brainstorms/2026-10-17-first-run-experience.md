---
title: First-run experience - empty start + guided tour
date: 2026-10-17
status: from-user-request
---
# First-run experience (ce-brainstorm)

Source: Harshit, WhatsApp, 17 Oct 2026 ~02:57 IST, before submitting HabitForge
for AI in Business2 Submission 3 ("Working Product", due 17 Oct 23:59 IST).

## Requested
1. First login: the habit list must be completely empty - each user adds the
   habits and disciplines they want themselves.
2. First-ever login per account: dialog boxes that explain the key features of
   a page, as a tour. Later logins of the same account skip it (the app is
   intuitive enough after one pass).
3. Use the compound-engineering loop; desktop + mobile tested; aesthetic
   unchanged; redeploy on the same URL; push to GitHub.

## Constraints carried over
- R1 aesthetic freeze still applies: tour UI must reuse the existing design
  tokens (dark surfaces, amber primary, JetBrains Mono labels, uppercase).
- Static site, localStorage only, no backend.

## Decisions
- Empty start: stop auto-seeding the 11 starter habits in `core.js fresh()`.
  Existing stored ledgers (Harshit's own browser) are NOT migrated or wiped -
  only brand-new browsers start empty.
- Sample ledger: with zero habits the "Load Sample Ledger" action produces
  nothing meaningful, so the button (desktop banner), the mobile "Load sample"
  link and `HF.seed()` are removed. Cold-start banner stays and points at the
  Daily Tracker.
- Pillars (the four disciplines) stay fixed; users add habits inside them.
  Pillar management is out of scope.
- Tour seen-state is per account: keyed by the Google `sub` from the SSO
  session (`habitforge:tour:v1`). localStorage is per-browser, so the same
  account on a second device sees the tour once there too - unavoidable
  without a backend.
- Habit data stays per-browser (`habitforge:v1`), unchanged. Per-account data
  separation is a known limitation, not part of this request.
- Tour is per page: dashboard and tracker each get their own short pass,
  desktop and mobile variants included.
