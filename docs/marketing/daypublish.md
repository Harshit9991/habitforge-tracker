---
name: daypublish
description: Daily content pipeline for HabitForge (or another named project). Activate whenever the user types "/daypublish", asks for today's content, daily posts, or the daily content routine. Runs three stages - Brainstorm topics, Draft pieces using the marketingskills library sub-skills (social, copywriting, image, video), then Audit every piece for facts, brand fit and channel optimization - and returns a review package. Never auto-posts: publishing, sending or scheduling anything requires the user's explicit approval per piece.
---

# /daypublish - Daily Content Pipeline

Produce today's content pieces through three ordered stages: **Brainstorm → Draft → Audit**. Output is always a review package for Harshit's approval, never a published post.

## Invocation

- `/daypublish` - today's default set for HabitForge.
- `/daypublish [channel]` - focus one channel (e.g. `/daypublish linkedin`, `/daypublish reddit`).
- `/daypublish [topic or angle]` - force a theme (e.g. `/daypublish placement prep consistency`).
- `/daypublish [project name]` - run for a different project; its own brand docs must be located first.

## Required grounding (read before every run)

1. **Brand docs** (HabitForge, private in Harshit's MU Drive - fetch with google-drive tools):
   - product-marketing.md (id `11IGkB_BUYHv1_MLjVNotircLvDLDzsKj`) - VERIFIED product facts vs HYPOTHESES, brand vocabulary, never-use list, proof-point status.
   - brand-guidelines.md (id `1zjfawciomnPdw8evuG2D2dTDubg3za4D`) - voice, tone-by-context, naming system.
   - brand-design.md (id `1Mn_e6f6IDP6961HI5rQEt92HlLSt4fWv`) - visual spec for any image/video brief.
   - design.md (id `12H9Xx4ZHfCoahmXd-jvClnIMBvtv75Qy`) - full UI reference for accurate product depictions.
   If a fetch fails, say so and either use the most recent delivered copy in conversation context or stop rather than drafting from memory.
2. **Proposed-rule status.** The brand docs contain both "As built (VERIFIED)" and "Proposed" rules. Apply proposed rules only if Harshit has approved them; until then they are pending, and the audit stage must flag drafts that rely on them.
3. **Library routing.** The marketing playbook library lives at `/skills/personal/marketingskills/` (52 sub-skills under `skills/`). Read a sub-skill's SKILL.md before using it. Confirmed names include: `social`, `copywriting`, `copy-editing`, `image`, `video`, `content-strategy`, `marketing-ideas`, `marketing-psychology`, `customer-research`, `cro`, `launch`. Do not assume other names exist - resolve against the routing table in `/skills/personal/marketingskills/SKILL.md`.

## Stage 1 - Brainstorm

Generate 3-5 topic options for today, each with: working title, angle, target channel(s), funnel stage (awareness / consideration / conversion), and which hypothesis or verified fact it leans on.

- Ground topics in the current marketing plan (10-day sprint: placement-focused ICP test hypothesis, warm outreach priority, demo-asset need) and the ICP's hypothesized pains - labeled as hypotheses.
- Use `content-strategy`, `marketing-ideas` and `marketing-psychology` playbooks for angle generation; use `social` for channel-native formats.
- **Connectors (future):** Harshit plans to connect data connectors (analytics, community listening, inbox signals) for sharper topics. Until they are demonstrably connected and returning data in the current run, treat connector input as absent: say topics are generated from brand docs and playbook methods, never imply live trend/audience data was used.
- Present the options and let Harshit pick, unless he said to pick for him - then pick and say which and why.

## Stage 2 - Draft

Draft each approved piece by routing to the matching sub-skill and following it in full:

- Text posts, threads, captions, community posts → `social` + `copywriting`.
- Visual assets → `image` (briefs must follow brand-design.md: dark surface ladder, ember/ice ramps, tight radii, Plus Jakarta Sans / JetBrains Mono, Material Symbols, forge.jpg treatment recipe).
- Video/reels → `video` (scripts/storyboards only unless tooling exists; demo concepts must depict the product accurately per design.md).
- Long-form or landing copy → `copywriting` + `cro`.

Drafting rules:
- Voice per brand-guidelines.md: short, direct, disciplined; no hype; no lore in checkout/support contexts.
- Product claims only from VERIFIED sections of product-marketing.md. Hypotheses (ICP pains, differentiation, payment-as-commitment) may be explored as questions or stories, never asserted as proven.
- Never invent testimonials, user counts, results, or features (no coaching, predictions, social features, verified sync, or security claims).
- No "private build" language. Pricing mentions use the honest framing: INR 149 list, tax added at checkout.

## Stage 3 - Audit

Every drafted piece passes an audit before entering the review package. Audit each piece on four axes and record pass/fix per axis:

1. **Fact check** - every product claim traced to a VERIFIED source (product-marketing.md verified sections, design.md, live product). Anything unverifiable is cut or reworded as question/story. No fabricated numbers or proof.
2. **Brand adherence** - voice attributes, tone for the context, brand vocabulary, never-use list, visual rules for assets. Check against the "doesn't mean" columns, not vibes.
3. **Channel optimization** - format, length, hook, CTA and posting conventions for the specific channel per the `social` playbook; community posts additionally require the target community's self-promotion rules to be checked before any post is proposed.
4. **Language quality** - plain-English pass and AI-tell check per `copywriting`/`copy-editing` references.

Show the audit result per piece (one line per axis). Fix failures and re-audit once; if a piece still fails, hold it out and say why.

## Output - the review package

Deliver to the conversation:
1. Today's pieces, each with channel, final copy/asset or asset brief, and its audit line.
2. Brainstorm shortlist (so unchosen topics stay visible).
3. Anything held back and why.
4. What is needed to publish (account access, community permission, his own send).

**Hard rule:** /daypublish prepares; it never publishes, posts, sends, schedules or spends. Each act of publishing requires Harshit's explicit approval for that piece and channel, under the standing representation rules.

## Persistence

Keep a simple run log in the package footer: date, pieces drafted, pieces approved, pieces published (with where, when Harshit reports or a connected tool confirms). Learnings about what performed belong back in product-marketing.md's Learnings table - propose the row, apply on his approval.
