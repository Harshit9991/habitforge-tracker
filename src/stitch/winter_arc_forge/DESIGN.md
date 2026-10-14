---
name: Winter Arc Forge
colors:
  surface: '#111319'
  surface-dim: '#111319'
  surface-bright: '#36393f'
  surface-container-lowest: '#0b0e13'
  surface-container-low: '#191c21'
  surface-container: '#1d2025'
  surface-container-high: '#272a30'
  surface-container-highest: '#32353b'
  on-surface: '#e1e2ea'
  on-surface-variant: '#d8c3ad'
  inverse-surface: '#e1e2ea'
  inverse-on-surface: '#2e3036'
  outline: '#a08e7a'
  outline-variant: '#534434'
  surface-tint: '#ffb95f'
  primary: '#ffc174'
  on-primary: '#472a00'
  primary-container: '#f59e0b'
  on-primary-container: '#613b00'
  inverse-primary: '#855300'
  secondary: '#ffb599'
  on-secondary: '#5a1c00'
  secondary-container: '#f66018'
  on-secondary-container: '#4f1700'
  tertiary: '#8ed5ff'
  on-tertiary: '#00354a'
  tertiary-container: '#38bdf8'
  on-tertiary-container: '#004965'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffddb8'
  primary-fixed-dim: '#ffb95f'
  on-primary-fixed: '#2a1700'
  on-primary-fixed-variant: '#653e00'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb599'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#7f2b00'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#111319'
  on-background: '#e1e2ea'
  surface-variant: '#32353b'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.04em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.08em
  stat-display:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 0.75rem
  gutter-lg: 2rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies the ritual of silent self-mastery during the isolation of winter. Inspired by the discipline of the blacksmith hammering glowing steel under falling snow, it merges dark tactical minimalism with restrained 8-bit precision and the stoic gravity of Souls-like progression.

The aesthetic avoids playful gamification or frivolous neon arcade tropes. Instead, it treats habit formation as metallurgy: deliberate strikes, tempered steel, and enduring resolve. High-contrast dark surfaces evoke frozen night, while disciplined amber and molten ember accents represent the internal fire stoked through daily execution.

Visual touchstones:
- **Quiet Discipline:** Austere negative space, razor-sharp information hierarchy, and absolute absence of decorative clutter.
- **Craftsman Precision:** Crisp borders simulating cold-rolled steel, hairline dividers, and monospaced technical readouts.
- **Tempered Warmth:** Glowing orange and amber states reserved strictly for active streaks, completed strikes, and progress indicators.

## Colors

The palette mimics the thermal spectrum of cold night against an active forge hearth:

- **Base Canvas (`#0c0f14`):** Abyssal charcoal ground representing the isolation and stillness of winter nights.
- **Surface Depth (`#121824`, `#182030`):** Sub-surfaces and module trays cast in frozen deep navy.
- **Structural Steel (`#1e293b`, border `#334155`):** Mid-tone slate for cards, inputs, and container partitions.
- **Hearth Accents (`#f59e0b`, `#ea580c`):** High-heat amber gold and ember orange used sparingly to denote completed strikes, unbroken streaks, and active states.
- **Frost Accent (`#38bdf8`):** Cold glacial cyan used exclusively for ambient date/time indicators, chill metrics, and target deadlines.
- **Typography Tiers:** Warm ivory (`#f8fafc`) for primary text and titles, muted silver-slate (`#94a3b8`) for secondary instructions, and cold slate (`#64748b`) for tertiary counters and inactive states.

## Typography

Typography balances stoic discipline with technical precision:

- **Primary Sans (Plus Jakarta Sans):** Grounded, modern, and razor-sharp. Headlines use tighter tracking (`-0.02em` to `-0.03em`) to project unyielding density and resolve. Body copy is set at generous line-heights for optimal legibility during focused review sessions.
- **Monospace Metric Engine (JetBrains Mono):** Drives every quantitative touchpoint—day counters, habit completion rates, completion percentages, streak counts, and micro labels. All labels are formatted in uppercase with expanded tracking (`0.04em` to `0.08em`) to mirror precision-machined technical interfaces.

## Layout & Spacing

The layout model is anchored by a rigid 12-column grid on desktop and tablet, collapsing to a single-column sequence on mobile.

- **Rhythm:** An absolute 4px/8px modular spacing baseline governs all vertical and horizontal spacing.
- **Density:** High information density within cards, contrasted by wide margins that enclose the active workspace like an anvil in an empty hall.
- **Breakpoints:**
  - **Desktop (1024px+):** 12-column layout, max-width 1200px centered, `margin: 2rem`, `gutter: 1.5rem`.
  - **Tablet (768px – 1023px):** 6-column layout, `margin: 1.5rem`, `gutter: 1rem`.
  - **Mobile (< 768px):** Single-column stack, `margin: 1rem`, `gutter: 0.75rem`. Daily habit matrices scroll horizontally along the day-axis while keeping habit names locked.

## Elevation & Depth

Visual depth is achieved through cold surface layering and focused thermal illumination rather than fuzzy ambient drop shadows:

- **Surface Tiers:**
  - Base: `#0c0f14` (Deep Canvas)
  - Tier 1: `#121824` (Workspace wells & inset backdrops)
  - Tier 2: `#182030` (Interactive cards & steel slabs)
  - Tier 3: `#1e293b` (Elevated modals, tooltips, and active popovers)
- **Border Architecture:** Depth is defined by crisp, 1px borders using `#334155`. Cards do not blend into the background; their edges remain firmly delineated. Active containers transition their border to `#d97706` (amber) or `#38bdf8` (frost).
- **The Forge Glow:** Used strictly on focal interactive triggers (e.g., ticking off the final habit of the day, active streak nodes). Replaces soft shadows with a dual-stage directional glow: `box-shadow: 0 0 0 1px #ea580c, 0 4px 20px rgba(234, 88, 12, 0.25)`.

## Shapes

The shape vocabulary is strictly disciplined and architectural. A base curvature radius of `0.25rem` (4px) gives components a milled-steel finish—neither ruthlessly sharp nor playful:

- **Cards and Panels:** `0.25rem` (4px) corner radius with hard 1px strokes.
- **Micro-Indicators and Habit Toggles:** Crisp squares (`0px` to `2px` max) paying homage to restrained 8-bit tracking matrices.
- **Action Triggers & Chips:** `0.25rem` (4px) corners. Pill or oval shapes are strictly prohibited to maintain the deliberate, chiseled character of the system.

## Components

### Buttons & Action Bars
- **Primary ("Forge" Strike):** Solid amber background (`#f59e0b`), dark charcoal text (`#0c0f14`), font `JetBrains Mono` bold uppercase. Hover: shifts to `#ea580c` with ember perimeter glow.
- **Secondary (Steel Outline):** Background `#182030`, border 1px solid `#334155`, text `#f8fafc`. Hover: border shifts to `#94a3b8`, background shifts to `#1e293b`.
- **Destructive/Reset:** Background transparent, border 1px dashed `#64748b`, text `#94a3b8`. Hover: border and text `#ef4444`.

### Habit Checkbox ("The Anvil Strike")
- **Default State:** A 22x22px square crafted with a `#121824` background and a `#334155` border.
- **Hover State:** Border glows with a faint amber edge (`#b45309`).
- **Completed State:** Solid `#f59e0b` fill containing a pixel-art check mark or anvil glyph in `#0c0f14`. Emits a momentary, restrained spark animation (micro 2px ember particles) that settles into a static 1px rim illumination (`rgba(245, 158, 11, 0.4)`).

### Metric Cards & 90-Day Arc Grid
- **Surface:** `#182030` backed with a 1px solid `#334155` border.
- **Header:** Features a small monospaced label (`label-sm`) in `#64748b` accompanied by a 4x4px cold-cyan or amber status indicator.
- **Arc Day Matrix:** Compact 7x13 density grid representing the 90-day winter stretch. Incomplete days render as 6x6px squares in `#1e293b`. Completed days render as solid `#f59e0b` (amber) or `#ea580c` (streak bonus), producing a visual heatmap of discipline across October, November, and December.

### Input Fields & Terminal Prompts
- Background `#121824`, inset border 1px solid `#334155`.
- Text is warm ivory (`#f8fafc`), with placeholder text in cold slate (`#64748b`).
- Focus state: Replaces default ring with an unbroken 1px border in `#f59e0b` and a 1px inset glow.

### Segmented Tabs & Month Toggles
- Housing container: `#0c0f14` tray with 1px border `#1e293b`.
- Tab items: `JetBrains Mono` uppercase labels. Inactive state: transparent background, `#64748b` text. Active state: `#1e293b` fill, `#f8fafc` text, underlined by a 2px solid `#ea580c` heat bar.