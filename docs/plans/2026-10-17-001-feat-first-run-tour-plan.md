---
title: "feat: empty first run + per-account guided tour"
type: feat
date: 2026-10-17
origin: docs/brainstorms/2026-10-17-first-run-experience.md
---
# Plan (ce-plan)

## Approach
Small, surgical edits on top of the frozen design. State changes live in
`assets/core.js`; the tour is a new self-contained `assets/tour.js` included
by all four app pages, styled with the same Tailwind tokens.

## Units
1. core.js: drop `STARTERS` and the auto-seed in `fresh()`; drop `seed()`.
2. dashboard.js: remove the seed button handler and the mobile seed link.
3. dashboard.html: cold-start banner copy (no more sample ledger), remove the
   "Load Sample Ledger" button.
4. assets/tour.js (new): spotlight overlay + dialog card; steps per
   page x viewport; per-account seen flags (`habitforge:tour:v1`, keyed by
   Google `sub`); Skip/Back/Next/Done, Esc, backdrop click, reposition on
   scroll/resize; marks seen on finish or skip.
5. Include tour.js in dashboard/tracker, desktop + mobile.
6. Docs + README.

## Verification
Vercel preview deploy, cloud browser at desktop and mobile widths:
- fresh state (cleared `habitforge:v1`): tracker shows 4 empty pillars,
  dashboard shows cold banner without the sample button, kaizen table empty
  state renders.
- tour appears on first dashboard visit, steps anchor to real elements on
  both viewports, skip and done both suppress it on reload.
- tracker tour appears once on first tracker visit.
- existing ledger (seeded logs) still renders, tour still shows once for an
  account that has not seen it.
- console error-free.

## Risks
- Tour anchors are element ids/selectors; a missing anchor falls back to a
  centered dialog (handled).
- Tailwind CDN generates classes at runtime; structural tour styling uses
  inline styles so first paint is safe.
