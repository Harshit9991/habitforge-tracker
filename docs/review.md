# Simplify and review pass
- Simplify: merged two desktop tracker variants, removed fake backend blocks (Supabase/Sheets/Postgres, streak grace, DB binding, queue custom pillar, auto-carry).
- Review findings fixed: settings popover clipped, dead collapse button, ambiguous pacing selector (now drives consistency KPI), mobile hero image 403.
- Residual: Tailwind and fonts load from CDN (as in the export); data is per-browser localStorage.
- 2026-10-17: First-run pass - removed starter-habit auto-seed and the sample-ledger seed (empty start; existing stored data untouched). Added per-account one-time guided tour (`assets/tour.js`, seen flag `habitforge:tour:v1` by Google sub; localStorage-only, so it replays once per browser). Verified on preview (desktop+mobile) before prod deploy. Residual: tour seen-state does not sync across devices (no backend); `build.py` is stale vs the SSO commit - built files are edited directly.
