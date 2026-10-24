# HabitForge - Product Marketing Context

**Document version:** v1
**Last updated:** 2026-10-24
**Status:** Draft for Harshit's review. Built from the live product (habitforgetracker.in, repo head commit 3824a98) and the 24 Oct strategy discussion. Every section labels VERIFIED product fact vs HYPOTHESIS. No external customer, traction, or persona evidence was verified in this work, and none is invented here.

## Product Overview
- **One-liner (VERIFIED):** HabitForge is a gamified habit tracker that runs one 90-day campaign per user - daily habit check-ins across four pillars, with a paid insights dashboard.
- **What it does (VERIFIED):** Free users ("The Kindling") track habits with a name, one of four pillars, daily/weekly cadence, daily check-ins and notes against a success threshold (default 75%). Paid users ("The Crucible") unlock dashboard insights: completion %, per-pillar split, streaks, weekly Kaizen count with thermal debt, and the 90-day "Winter Crucible" heatmap.
- **Pricing (VERIFIED):** Pricing page lists INR 149 one-time lifetime. In one observed INR test checkout (22 Oct), the charged total was INR 175.82 after added tax; tax treatment elsewhere is unknown. 7-day refund policy via email contact. No subscription, no ads.
- **Product category:** Habit tracker / self-improvement tool (consumer web app).
- **Product type:** B2C web app, Google sign-in only (Supabase Auth), desktop and mobile versions.
- **Business model (VERIFIED):** Freemium. One paid tier, one-time lifetime payment via Dodo Payments.

## Target Audience
- **Primary ICP (HYPOTHESIS - to be validated, not evidence):** Placement-focused students and freshers in India starting a defined 60-90 day preparation push, who have tried and abandoned a tracker or plan before.
- **Primary use case (HYPOTHESIS):** Stay consistent with the daily actions behind placement preparation and see where consistency breaks.
- **Jobs to be done (HYPOTHESIS):**
  - Keep a preparation routine honest day to day.
  - See objectively where the routine slips (which pillar, which weeks).
  - Feel progress across a long push without maintaining a spreadsheet.
- **Explicitly not the target:** "everyone who wants better habits" (too broad to message); productivity power users comparing feature lists.
- **Campus circle:** first testing ground and conversation source, not proof of a market.

## Problems & Pain Points (HYPOTHESIS until first interviews)
- **Core problem (hypothesized wording):** "I make a prep plan, lose consistency, and don't know where I'm slipping."
- **Why alternatives might fall short (HYPOTHESES to test, not established facts about other products):** a bounded 90-day campaign may suit a defined push better than open-ended trackers; manually maintained spreadsheets may hide patterns; motivation-only approaches may not show where effort slips.
- **What it costs them (HYPOTHESIS):** an inconsistent placement season; restarting plans repeatedly.
- **Emotional tension (HYPOTHESIS):** guilt after missed days; uncertainty about whether the effort is working.

## Competitive Landscape
- **Direct:** Dedicated habit trackers (mobile apps, gamified trackers). The angle HabitForge would test against them: a bounded 90-day campaign with a defined end and verdict rather than an open-ended list. Whether buyers value that is unproven.
- **Secondary:** Spreadsheets, Notion templates, paper planners - free and flexible; whether their manual upkeep and lack of built-in pattern views pushes users to switch is a hypothesis to test.
- **Indirect:** Doing nothing / relying on motivation.
- **Honest note (from the professor's 43/100 feedback, 24 Oct audit):** beyond the aesthetic and campaign structure, differentiation is thin and unproven. Treat this as an open strategic question, not a solved strength.

## Product Attributes and Possible Differentiators
- **Verified attributes of the current build (product facts, not proven competitor differentiation):** one 90-day "arc" per user with start/end and pacing; four named pillars (Physical Vessel, Mental & Spiritual, Professional Arc, Content & Craft); a deliberate dark forge aesthetic; one-time lifetime pricing instead of a subscription.
- **How it works differently (VERIFIED as product behavior):** habit tracking framed as a campaign with a success threshold and verdict, not a perpetual list.
- **Why customers would choose it (HYPOTHESIS):** people who want a defined push with visible progress, at a low one-time price, without another subscription. The "payment as commitment device" idea is also a hypothesis, not established buyer psychology.

## Objections
| Objection | Response direction |
|---|---|
| "Free trackers exist" | Show the campaign structure and insights; must be demonstrated, not asserted |
| "Rs 149 for a student's side project?" | 7-day refund policy; show the actual dashboard before asking |
| "Another app I'll abandon" | The 90-day arc has an end and a verdict; insights show where you slip |
| "Sign-in friction" | Known issue; guest-mode decision is an open product gate |

**Anti-persona:** feature-checklist power users; anyone expecting coaching, placement predictions, or social features the product does not have. Never imply those exist.

## Switching Dynamics (HYPOTHESIS)
- **Push:** abandoned trackers, spreadsheet fatigue, a bad mock interview.
- **Pull:** a defined 90-day push with visible progress and pattern insights.
- **Habit:** existing checklist apps, Notion, paper.
- **Anxiety:** paying for an unproven student product; data safety; sign-in friction.

## Customer Language
- **Customer verbatims:** NONE COLLECTED in this work. Do not write copy as if we have them. First outreach conversations exist to capture these.
- **Product's own language (VERIFIED from live copy):** "Forge your fate." / "The winter will pass regardless. Who will you be when the snow melts?" / "Your ledger awaits."
- **Brand vocabulary (VERIFIED, in-product terms):**

| Term | Meaning |
|---|---|
| The Kindling | Free tier: daily habit tracker |
| The Crucible | Paid tier: lifetime dashboard insights |
| 90-day ledger | The campaign's day-by-day record |
| Pillars | Four habit categories: Physical Vessel, Mental & Spiritual, Professional Arc, Content & Craft |
| Kaizen | Weekly improvement count on the dashboard |
| Thermal debt | Falling behind on weekly Kaizen |
| Winter Crucible | 90-day heatmap visualization |
| Wynter Arc | Original concept name of the product |

## Brand Voice
| Attribute | Means | Doesn't mean | Example line (VERIFIED) |
|---|---|---|---|
| Forge-lit epic | Frames effort as a campaign against winter | Fantasy roleplay or cringe | "Forge your fate." |
| Stoic challenge | Direct, demanding, respectful | Hype or hustle-bro shouting | "The winter will pass regardless. Who will you be when the snow melts?" |
| Ledger-precise | Concrete records and numbers | Vague inspiration | "Your ledger awaits." |

**Brand vocabulary:** Kindling, Crucible, ledger, pillars, Kaizen, thermal debt, Winter Crucible (in-product names, not claimed as exclusive marks).
**Never use (with reasons):** "revolutionary", "crush it", "10x" (hype breaks the stoic voice); claims of coaching, prediction, or social features (they do not exist in the product); fake urgency or scarcity (the paid tier is already a one-time lifetime purchase).

## Proof Points
- **Metrics:** none verified in this work. No analytics installed; no measured conversion, activation, or retention.
- **Customers / traction:** no external customer or traction evidence verified in this work. Absence of evidence here is not proof that none exists - this section reflects only what this work checked. One internal end-to-end test purchase (22 Oct, refund in progress) showed checkout functioning; it is not traction.
- **Testimonials:** none collected. Never invent results.
- **Known readiness gaps (must not be papered over in marketing):** a known paid-access control weakness; cross-device sync and per-user data isolation unverified; no guest mode; listed price (INR 149) vs one observed charged total (INR 175.82 after tax) mismatch.

## Goals
- **Business goal (user-stated):** 1,000 paying AND active users in 10 days, within 30 min/day of founder time. Feasibility unestablished - depends on unknown reachable audience and budget.
- **Conversion action:** verified payment, then first post-payment habit check-in (counted separately).
- **Current metrics:** none verified; measurement is a pre-launch gate.

## Learnings
*One seed entry from prior review work; fills further as work ships.*
| Date | Learning | Evidence | Applies to | Status |
|---|---|---|---|---|
| 2026-10-24 | Professor review (43/100) flagged weak differentiation beyond theme, sign-in friction, missing analytics/SEO basics | Grader feedback PDF + live audit 24 Oct | Positioning, gates, channels | active |

## Changelog
- v1 (2026-10-24) - Initial context, drafted from live product and strategy discussion; ICP and pains are labeled hypotheses pending first customer conversations.
