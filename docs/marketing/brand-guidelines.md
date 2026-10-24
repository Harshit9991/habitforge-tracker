# HabitForge - Brand Guidelines

**Document version:** v1
**Last updated:** 2026-10-24
**Scope:** Records the brand as it exists in the live product today (habitforgetracker.in, repo head commit 3824a98), plus clearly labeled PROPOSED rules where the current product has no established convention. Sections marked "As built" describe current fact; sections marked "Proposed" are recommendations for Harshit to approve, not current behavior. Full design tokens and component detail live in design.md (MU Drive).

## 1. Brand Story (as built)
- **Name:** HabitForge. Original concept name: "The Wynter Arc Tracker" - the winter-arc metaphor survives throughout the product.
- **Core idea:** self-improvement framed as one bounded 90-day campaign against winter. The campaign has a start, an end, and a verdict.
- **Tagline (VERIFIED, live):** "Forge your fate."
- **Founding quote (VERIFIED, on the sign-in page):** "The winter will pass regardless. Who will you be when the snow melts?"

## 2. Personality (read from current copy; not a formal founder decision)
- A forge, not an app: heat, metal, winter, ledger-keeping.
- Stoic and demanding in tone; the product challenges the user.
- Epic framing with precise bookkeeping underneath - the lore is a skin over concrete records.

## 3. Voice
### As built (VERIFIED from live copy)
- Short, declarative marketing lines: "Forge your fate."
- Concrete record-keeping framing: "Your ledger awaits."
- Consistent in-product naming (see section 4).

### Proposed rules (NOT yet established in the product - for approval)
- Do: short declarative sentences; concrete numbers; consistent brand vocabulary.
- Don't: hype words ("revolutionary", "crush it", "10x", "game-changer"); claims of features that don't exist (coaching, predictions, social); fake urgency or scarcity.
- Tone by context:
  - Marketing / sign-in: stoic challenge.
  - In-product empty states: encouraging but in-world.
  - Pricing / checkout: exact and lore-free, with the final tax-inclusive price shown (current checkout adds tax at payment: one observed INR checkout charged 175.82 against a 149 list price; display is not currently tax-inclusive).
  - Errors / refunds / support: plain, direct, human, no lore (current product does not have a defined support voice; this is the proposed one).

## 4. Naming System (VERIFIED, in-product brand vocabulary)
These are the product's internal names, recorded for consistent use - not claimed as exclusive trademarks.
| Name | What it is |
|---|---|
| The Kindling | Free tier - the daily tracker |
| The Crucible | Paid tier - lifetime dashboard insights ("Crucible Access" on the pricing page) |
| 90-day ledger | The campaign record |
| Pillars | Four habit categories, each with a Roman numeral and a baseline: I Physical Vessel ("Somatic baseline"), II Mental & Spiritual ("Stillness quota"), III Professional Arc ("Shipping cadence"), IV Content & Craft ("Vocal resonance") |
| Kaizen | Weekly improvement count |
| Thermal debt | Falling behind the weekly Kaizen pace |
| Winter Crucible | The 90-day heatmap |
| Restart Campaign / Erase All Data | The two settings actions (settings vocabulary stays plain) |

## 5. Visual Identity (as built, VERIFIED from source)

### Theme
Dark-only. No light mode exists. Every surface assumes the dark forge environment.

### Color palette
**Base / backgrounds:**
- `#0b0e13` - deepest background
- `#111319` - primary page background
- `#272a30`, `#32353b` - surfaces, cards, raised elements

**Text:**
- `#e1e2ea` - primary text on dark

**Ember / primary accents (the forge fire):**
- `#f59e0b` - primary amber
- `#ffb95f`, `#ffc174`, `#ffddb8` - lighter ember tints
- `#f66018`, `#855300`, `#7f2b00` - deep forge oranges

**Warm neutrals (leather/ash):**
- `#a08e7a`, `#d8c3ad`, `#534434`

**Ice accent (the winter counterpoint):**
- `#38bdf8` - ice blue
- `#8ed5ff`, `#7bd0ff`, `#c4e7ff` - lighter ice tints

**Error / destructive:**
- `#ffb4ab`, `#93000a`, `#690005` (used in error and Erase All Data contexts)

**Observed usage patterns:** ember carries brand/action emphasis; ice blue appears as a counter-accent; red appears in destructive/error contexts. Formal color-role rules beyond this are not documented in the product; design.md has the full token detail.

### Typography (VERIFIED from source)
- **Plus Jakarta Sans** - UI and body text (weights 400-700)
- **JetBrains Mono** - monospace accents, ledger/number contexts (weights 400-700)
- **Material Symbols Outlined** - all iconography; no custom icon set

### Iconography (as built)
- Material Symbols only. Pillar icons in-product: fitness_center (I), psychology (II), terminal (III), mic (IV).

### Layout and motion (as built; detail in design.md)
- Separate desktop and mobile experiences (mobile under /m/, auto-redirect under 768px).
- Guided tours: 6 steps on the tracker, 8 on the dashboard, first-run per device.

## 6. Caveats and Proposed Guardrails
**As-built caveats (VERIFIED):**
- Dark-only theme: any future light mode is a new decision, not a variant.
- privacy.html currently sits outside the shared token system.
- The sign-in page currently says "Private build - access limited to authorized Google accounts"; this was flagged in review as misleading, since any Google account can sign in.

**Proposed guardrails (for approval, not current policy):**
- Check contrast before reusing ember-on-dark combinations at small sizes.
- Do not repeat "private build" in external marketing while the misleading copy stands.
- Do not market "sync across devices" or "your data is secure/isolated" as facts until verified - both are currently unverified (24 Oct audit).
- Show the tax-inclusive price in marketing and on the pricing page once a final display decision is made.

## Changelog
- v1 (2026-10-24) - Initial guidelines recorded from the live product, with proposed rules labeled.
