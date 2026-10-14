---
title: "feat: HabitForge functional build on frozen Stitch design"
type: feat
date: 2026-10-15
origin: docs/brainstorms/2026-10-15-habitforge-requirements.md
---
# Plan (ce-plan)

## Approach
Keep Stitch markup/Tailwind config verbatim. A build script (`build.py`) rewrites copy, wires nav, and replaces hard-coded data regions with empty mount points. `assets/app.js` holds state (localStorage `habitforge:v1`), stats, and renderers that reuse the original class strings.

## Units
1. State + stats (dates, campaign, score, streak, weekly progress, pillar rates).
2. Tracker pages (desktop/mobile): date nav, jump, toggle, mark all/reset, add/rename/delete, notes, thresholds, restart.
3. Dashboard pages (desktop/mobile): hero, KPIs, chart, donut, pillar bars, weekly table, heatmap, cold-start, range, filters, export CSV.
4. Viewport routing: desktop `index.html`/`tracker.html`, mobile `m/*.html`, redirect on width < 768.
5. Rename + copy truthfulness.

## Verification
Puppeteer + Chrome at 1440x900 and 390x844: every control exercised, screenshots compared to the Stitch screens, console errors zero, no horizontal overflow on mobile.

## Risks
- Tailwind CDN needs network at runtime (same as the supplied pages). Fonts via Google Fonts.
- Stitch markup is class-heavy; templates must copy classes exactly.
