# Simplify and review pass
- Simplify: merged two desktop tracker variants, removed fake backend blocks (Supabase/Sheets/Postgres, streak grace, DB binding, queue custom pillar, auto-carry).
- Review findings fixed: settings popover clipped, dead collapse button, ambiguous pacing selector (now drives consistency KPI), mobile hero image 403.
- Residual: Tailwind and fonts load from CDN (as in the export); data is per-browser localStorage.
