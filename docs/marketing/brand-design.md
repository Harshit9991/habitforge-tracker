# HabitForge - Brand Design

**Document version:** v1
**Last updated:** 2026-10-24
**Scope:** The visual brand-design specification - how HabitForge looks and how new surfaces should reproduce that look. Sections marked "As built" are verified from the live product and repo (head commit 3824a98); sections marked "Proposed" are new rules awaiting Harshit's approval, not current behavior. Companion files: design.md (full UI/component specs), brand-guidelines.md (identity, voice, naming), product-marketing.md (audience, positioning).

## 1. Design Idea (as built)
A forge in winter, kept like a ledger. The interface is a dark workshop: near-black surfaces, ember light for what matters, ice blue as the cold counterpoint, sharp edges, and monospace bookkeeping type. Every decorative choice serves the 90-day campaign metaphor - heat (effort) against cold (time passing).

Verified texture phrases used in-product: "HABITFORGE PROTOCOL - RESTRICTED LEDGER", "ANVIL SYNCHRONIZED", "TEMPERED STEEL - 90-DAY GAUNTLET", "DISCIPLINE OVER MOTIVATION."

## 2. Logo and Wordmark (as built)
- **Mark (VERIFIED from favicon.svg):** a single amber flame (`#f59e0b`) on a near-black rounded square (`#111319`, corner radius 6/32). One flame, no wordmark inside the mark.
- **Header lockup (VERIFIED):** flame icon (Material Symbols `local_fire_department`, primary color) inside a small bordered chip + "HABITFORGE" in uppercase JetBrains Mono with wide tracking, with "Forge your fate." beneath in the small label style.
- **Snowflake motif (VERIFIED):** Material Symbols `ac_unit` appears as the winter counter-sign in eyebrows and the footer.

### Proposed usage rules (not yet formalized)
- Minimum clear space: one flame-width around the mark.
- Never recolor the flame outside the ember ramp; never place the mark on light backgrounds without the dark square.
- The flame means the brand; the snowflake means the campaign/winter. Don't swap their roles.

## 3. Color System (as built, VERIFIED from the tailwind config)
Material-style role tokens. Hex values exact from source.

### Ember ramp (primary - the fire, main brand/action color)
| Role | Hex | Used for |
|---|---|---|
| primary | `#ffc174` | headlines accents, links, icons, borders of featured elements |
| primary-container | `#f59e0b` | the flame mark, strong fills |
| primary-fixed / primary-fixed-dim | `#ffddb8` / `#ffb95f` | light ember tints, hover states |
| inverse-primary / on-primary | `#855300` / `#472a00` | text/icons on ember fills |

### Forge orange (secondary - heat at full burn)
| Role | Hex | Used for |
|---|---|---|
| secondary | `#ffb599` | warm accents |
| secondary-container | `#f66018` | live/status indicator dots (pulsing), high-heat states |

### Ice ramp (tertiary - the winter counterpoint, used sparingly)
| Role | Hex | Used for |
|---|---|---|
| tertiary | `#8ed5ff` | cold accents |
| tertiary-container | `#38bdf8` | ice blue fills |
| tertiary-fixed / -dim | `#c4e7ff` / `#7bd0ff` | light ice tints |

### Surface ladder (dark-only; lightest at the bottom)
| Role | Hex |
|---|---|
| surface-container-lowest | `#0b0e13` |
| background / surface / surface-dim | `#111319` |
| surface-container-low | `#191c21` |
| surface-container | `#1d2025` |
| surface-container-high | `#272a30` |
| surface-container-highest / surface-variant | `#32353b` |
| surface-bright | `#36393f` |

### Text and lines
| Role | Hex | Used for |
|---|---|---|
| on-surface | `#e1e2ea` | primary text |
| on-surface-variant | `#d8c3ad` | secondary text (warm ash) |
| outline | `#a08e7a` | muted labels |
| outline-variant | `#534434` | borders and dividers (often at 20-30% opacity) |

### Error / destructive
`#ffb4ab` (error), `#93000a` (error-container), `#690005` (on-error). Reserved for errors and the Erase All Data flow only.

### Usage rules (observed patterns, VERIFIED)
- Ember = action, brand, "hot" states. Ice = cold counter-accent, used sparingly. Red = destructive only.
- Selection color: primary background with dark `#472a00` text.
- The featured/paid pricing card carries an ember glow: `border-primary/60` plus `shadow-[0_0_24px_rgba(255,193,116,0.08)]`. Glow marks importance; do not apply it to ordinary cards.
- Known exception: privacy.html sits outside this token system.

## 4. Typography (as built, VERIFIED)
Two families plus one icon font, all Google Fonts:
- **Plus Jakarta Sans** - headlines and body
- **JetBrains Mono** - labels, stats, the ledger voice
- **Material Symbols Outlined** - icons

### Scale (role - size/line-height, letter-spacing, weight)
| Role | Font | Spec |
|---|---|---|
| headline-xl | Plus Jakarta Sans | 40/48, -0.03em, 700 |
| headline-xl-mobile | Plus Jakarta Sans | 30/36, -0.02em, 700 |
| headline-lg | Plus Jakarta Sans | 28/36, -0.02em, 600 |
| headline-md | Plus Jakarta Sans | 22/28, -0.01em, 600 |
| stat-display | JetBrains Mono | 32/36, -0.04em, 700 |
| body-lg | Plus Jakarta Sans | 16/26, 400 |
| body-md | Plus Jakarta Sans | 14/22, 400 |
| body-sm | Plus Jakarta Sans | 12/18, 400 |
| label-lg | JetBrains Mono | 14/20, 0.04em, 600 |
| label-md | JetBrains Mono | 12/16, 0.06em, 500 |
| label-sm | JetBrains Mono | 10/14, 0.08em, 500 |

### Typographic voice rules (observed)
- Labels render UPPERCASE with wide tracking - this is the "protocol" voice ("RESTRICTED LEDGER", "ANVIL SYNCHRONIZED").
- Numbers and stats render in JetBrains Mono - the ledger look. Headlines and prose never use mono.
- Taglines and quotes can go italic ("The winter will pass regardless..."). Body copy does not.

## 5. Shape, Borders, Elevation (as built, VERIFIED)
- **Radius scale (deliberately tight and industrial):** DEFAULT 2px, lg 4px, xl 8px, full 12px. Actual usage: `rounded-xl` cards and panels, `rounded-lg` inner elements, `rounded-full` chips and status dots. No large soft radii anywhere - the brand is sharp-edged.
- **Borders:** 1px `outline-variant` at 20-30% opacity on cards and headers.
- **Elevation:** dark shadows (`shadow-[0_1px_8px_rgba(0,0,0,0.4)]` on the fixed header); the single ember glow reserved for featured elements; header uses `backdrop-blur-md` over `surface-container-lowest/90`.

## 6. Spacing (as built, VERIFIED)
Named scale: space-xs 4px, space-sm 8px, space-md 16px, space-lg 24px, space-xl 40px. Gutters: gutter-sm 12px, gutter 24px, gutter-lg 32px. Page margins: 32px desktop, 16px mobile. Layout max width `max-w-7xl`.

## 7. Iconography (as built, VERIFIED)
- Material Symbols Outlined only; no custom icon set.
- Pillar icons: I Physical Vessel `fitness_center`, II Mental & Spiritual `psychology`, III Professional Arc `terminal`, IV Content & Craft `mic`.
- Brand icons: `local_fire_department` (flame/brand), `ac_unit` (snowflake/winter).
- Icons inherit the text color role of their context (primary for brand moments, outline for muted).

## 8. Imagery and Art Direction (as built + proposed)
### As built (VERIFIED)
- One hero photograph: `assets/forge.jpg` - a blacksmith forging tempered steel on an anvil during snowfall (per its alt text), used on sign-in, dashboard and pricing.
- **Treatment recipe (exact from source):** `saturate-[0.88] brightness-[0.82] contrast-[1.12]`, then gradient overlays from the surface color so the photo dissolves into the dark page.
- Status "chips" combine a pulsing dot (secondary-container, `animate-pulse`/`animate-ping`) with an uppercase label - the brand's live-telemetry look.

### Proposed rules for new imagery (not yet formalized)
- Subject matter: real fire, metal, snow, hands at work. No stock smiles, no flat illustration, no cartoon fantasy.
- Apply the same treatment recipe (desaturate ~0.88, darken ~0.82, contrast ~1.12, dark gradient blend) so any new image lands in the same world.
- Never place untreated bright photography next to the token palette.

## 9. Data Visualization (as built, VERIFIED names; style notes from source)
Dashboard visualizations (SVG, rendered in the token palette): the **Winter Crucible** 90-day heatmap ("HEATMAP MATRIX"), the **Crucible Matrix**, the **Kaizen Matrix Table / Kaizen Protocol**, and **Streak Decay**. Charts live on dark surfaces and use the ember/ice ramps for encoding. Detailed per-chart specs belong to design.md.

### Proposed
- Encode effort/heat in the ember ramp and absence/cold in the ice ramp or empty surface states; never introduce third-hue category colors outside the token ramps.

## 10. Motion (as built, VERIFIED)
- Transitions are short and functional: `transition-colors` (the dominant pattern), `transition-all`, `transition-transform`, `transition-shadow`.
- `animate-pulse` and `animate-ping` mark live status dots; `animate-spin` for loading.
- Nothing bounces, springs, or plays. Motion is telemetry, not celebration.

## 11. Surfaces the Brand Currently Covers (as built)
Desktop pages (index/sign-in, tracker, dashboard, pricing, privacy) and parallel mobile pages under /m/ (auto-redirect below 768px), favicon, and the Dodo checkout handoff. No email templates, social assets, or print exist yet.

### Proposed
- New surfaces (social cards, launch assets, email) reuse: the dark surface ladder as background, the flame mark, headline-xl type style, uppercase label eyebrows, and the imagery treatment recipe from section 8.

## 12. Accessibility Notes (as built + proposed)
- Dark-only theme; no light mode exists.
- Proposed: check contrast before reusing ember-on-dark at small sizes, and before putting `on-surface-variant` (#d8c3ad) text on raised surfaces at label sizes.

## Changelog
- v1 (2026-10-24) - Initial brand-design spec recorded from the live product; proposed rules labeled.
