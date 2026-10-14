---
title: Turning a Stitch HTML export into a working static app without touching the design
date: 2026-10-15
category: workflow
tags: [stitch, static-site, localstorage, tailwind-cdn, puppeteer]
---
## Problem
Stitch exports are visual mockups: fake data, claims of backends that do not exist, duplicated variants, and remote images that can 403.

## What worked
- Generate pages from the export with a script (`build.py`) so the design markup stays byte-identical and only copy, wiring and data mount points change.
- Keep all state in one localStorage key and render data regions from it; empty first-run state needs its own banner.
- Self-host hero images; the export's Google image URL returned 403.
- Drive every control with puppeteer-core plus local Chrome at 1440 and 390 widths (`e2e.js`, 71 checks).

## Gotchas
- `overflow-hidden` on a card clipped an absolutely positioned popover. Clip only the inner strip.
- Decorative buttons (collapse toggles) ship without handlers; grep for ids with no listener.
- Full-page screenshots show fixed bottom navs mid-page; this is a capture artifact.
