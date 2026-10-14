---
title: HabitForge requirements
date: 2026-10-15
status: approved-by-request
---
# HabitForge - requirements (ce-brainstorm)

Source: Stitch export "the_wynter_arc_tracker" (5 HTML screens: dashboard desktop/mobile, daily tracker desktop x2 variants, mobile).

## Goal
Habit tracker web app for newly formed habits over a 3-month campaign. Client-side only, localStorage, no database.

## Hard constraints
- R1. Aesthetic is frozen. No colour, type, spacing, layout or imagery changes. Functional and copy fixes only.
- R2. Rename to HabitForge everywhere user-visible.
- R3. Everything verified on desktop AND mobile viewports.
- R4. Deploy to Vercel, push code to a new GitHub repo.

## Findings from inventory (inconsistencies to resolve)
1. Every nav link is href="#"; screens are not connected.
2. Two desktop tracker variants disagree (Content & Craft vs Content & Speech; one has the note panel, one has add/edit/delete + settings modal). Merge into one.
3. Desktop and mobile show different data (10 vs 4 habits on dashboard, 2024 vs 2026 dates, 17 vs 18 day streak, 92 vs 90 days).
4. Dashboard numbers (78.4%, 18 days, chart, heatmap) are hardcoded and never reflect tracker input; heatmap has 91 cells for a 92-day arc.
5. "19:40 PM" style invalid times; 12h/24h mixed.
6. Copy claims Supabase / Google Sheets / Postgres / Apps Script sync that does not exist.
7. Dashboard donut draws both arcs with the same offset (missed arc hidden); chart x-axis labels and "TODAY" are hardcoded.
8. Month/year pills, range buttons, Export, Filters selects, Jump-to-date, Mark all/Reset, add/edit/delete mostly decorative or demo state.
9. Persona leakage ("Postgraduate", "Dr. Vance", "Mentor Union") in sample copy.

## Scope decisions
- Single shared state in localStorage, rendered into both desktop and mobile pages from the same code.
- Campaign = 3 calendar months from start date. First run is a cold start (the design has a cold-start banner); a "Load sample ledger" action seeds demo history.
- Weekly habits count toward the daily score like the design shows; weekly quota is Mon-Sun.
