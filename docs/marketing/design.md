# HabitForge - Design System (design.md)

Documents the design of HabitForge **as currently built and live**, not a redesign proposal.
Sources: repo `Harshit9991/habitforge-tracker` at commit `3824a98` + live verification of https://www.habitforgetracker.in on 24 Oct 2026 (desktop dashboard, tracker and plans pages inspected visually; mobile pages documented from the `/m/` source).

---

## 1. Product and aesthetic concept

HabitForge is a 90-day habit campaign tracker. The visual identity is a dark "winter arc / blacksmith's forge" theme: near-black surfaces, amber "heated metal" accents, ember-orange live indicators, and cold blue tertiary accents. Every screen, label and metric speaks in forge vocabulary (strikes, anvil, tempering, ledger, crucible).

- Tagline: "Forge your fate."
- Footer motto: "Discipline over motivation."
- Hero art: `assets/forge.jpg` - a blacksmith at an anvil in snowfall, always rendered with a desaturating/dimming filter (`saturate-[0.88] brightness-[0.82] contrast-[1.12]`) and multi-layer gradients fading into the page background.
- Theme: **dark only**. Every page ships `class="dark"`; there is no light theme.

## 2. Tech and file map

Static HTML + Tailwind CSS (CDN build) with the full design-token config inlined in each page's `<script id="tailwind-config">`. Pages are generated from a Google Stitch export by `build.py` and then hand-maintained. All charts are hand-built inline SVG (no chart library).

| Surface | Pages |
| --- | --- |
| Desktop | `index.html` (sign-in), `tracker.html`, `dashboard.html`, `pricing.html`, `privacy.html` |
| Mobile | `m/index.html`, `m/tracker.html`, `m/dashboard.html`, `m/pricing.html` |
| Shared JS | `assets/core.js` (state, pillars, dates), `tracker.js`, `dashboard.js`, `tour.js`, `auth.js`, `supabase.js`, `billing.js` |

View routing: `data-view` (`desktop`/`mobile`) and `data-page` attributes on `<html>`; a `matchMedia('(max-width: 767px)')` check redirects between the desktop and `/m/` versions. `privacy.html` is the one exception to the token system - a standalone hand-styled page.

## 3. Design tokens

The token set is identical across desktop and mobile pages (Material-3-style role names, dark values).

### 3.1 Color

**Surfaces (near-black, blue-grey):**

| Token | Hex | Use |
| --- | --- | --- |
| `background` / `surface` / `surface-dim` | `#111319` | Page background |
| `surface-container-lowest` | `#0b0e13` | Headers, footers, hero cards, inputs, chart wells |
| `surface-container-low` | `#191c21` | Status chips, toggle rows, banner strips |
| `surface-container` | `#1d2025` | Standard cards |
| `surface-container-high` | `#272a30` | Hover states, logo chip, chart grid rings |
| `surface-container-highest` | `#32353b` | Small badges, gauge tracks |

**Primary (amber / heated metal):**

| Token | Hex | Use |
| --- | --- | --- |
| `primary` | `#ffc174` | Primary text accents, buttons, active nav underline, avatar, chart line highlights |
| `primary-container` | `#f59e0b` | Button hover, chart stroke (`#f59e0b` polyline), slider accent |
| `primary-fixed` | `#ffddb8` | Selected text, bright amber labels |
| `primary-fixed-dim` | `#ffb95f` | Link hover, gauge accents |
| `on-primary` | `#472a00` | Text on amber buttons |

**Secondary (ember orange):**

| Token | Hex | Use |
| --- | --- | --- |
| `secondary` | `#ffb599` | Warm secondary text |
| `secondary-container` | `#f66018` | "LIFETIME" badge, live ping dots, streak/fire accents, hero progress bar start |
| `on-secondary-container` | `#4f1700` | Text on ember elements |

**Tertiary (cold blue):**

| Token | Hex | Use |
| --- | --- | --- |
| `tertiary` | `#8ed5ff` | Kaizen/sync icons and labels |
| `tertiary-container` | `#38bdf8` | Blue progress bars, verification icons |

**Error:** `error #ffb4ab`, `error-container #93000a`, `on-error #690005` - destructive buttons (two-tap confirm), "At Risk" badges.

**Outline / text:** `outline #a08e7a` (muted warm-grey labels), `outline-variant #534434` (borders, dividers), `on-surface #e1e2ea` (primary text), `on-surface-variant #d8c3ad` (secondary text).

**Selection:** amber on dark (`selection:bg-primary selection:text-on-primary`).

### 3.2 Typography

Two Google Fonts, loaded on every page:

- **JetBrains Mono** - all micro-labels, stats, numbers ("machine voice" of the product)
- **Plus Jakarta Sans** - headlines and body ("human voice")

| Token | Font | Size / Line height | Tracking | Weight | Use |
| --- | --- | --- | --- | --- | --- |
| `headline-xl` | Plus Jakarta Sans | 40 / 48 | -0.03em | 700 | Desktop hero ("Forge your fate.") |
| `headline-xl-mobile` | Plus Jakarta Sans | 30 / 36 | -0.02em | 700 | Mobile hero |
| `headline-lg` | Plus Jakarta Sans | 28 / 36 | -0.02em | 600 | Dashboard hero |
| `headline-md` | Plus Jakarta Sans | 22 / 28 | -0.01em | 600 | Section titles, plan names |
| `stat-display` | JetBrains Mono | 32 / 36 | -0.04em | 700 | Big KPI numbers (0.0%, Rs 149) |
| `body-lg` | Plus Jakarta Sans | 16 / 26 | 0 | 400 | Habit titles |
| `body-md` | Plus Jakarta Sans | 14 / 22 | 0 | 400 | Default body |
| `body-sm` | Plus Jakarta Sans | 12 / 18 | 0 | 400 | Helper text |
| `label-lg` | JetBrains Mono | 14 / 20 | 0.04em | 600 | Wordmark, card titles (uppercase) |
| `label-md` | JetBrains Mono | 12 / 16 | 0.06em | 500 | Nav items, table headers (uppercase) |
| `label-sm` | JetBrains Mono | 10 / 14 | 0.08em | 500 | Micro-labels, chips, badges (uppercase, wide tracking) |

Micro-labels are almost always uppercase with wide letter-spacing. Motivational quotes are italic body text ("The winter will pass regardless...").

### 3.3 Spacing

Named tokens: `space-xs` 0.25rem, `space-sm` 0.5rem, `space-md` 1rem, `space-lg` 1.5rem, `space-xl` 2.5rem, `gutter` 1.5rem, `gutter-sm` 0.75rem, `gutter-lg` 2rem, page padding `margin` 2rem (desktop) and `margin-mobile` 1rem (mobile).

### 3.4 Shape and elevation

- Radius scale is deliberately small and utilitarian: `DEFAULT` 2px, `lg` 4px, `xl` 8px, `full` 12px. Cards use `rounded-xl` (8px); chips and small controls use `rounded` (2px); pills and dots use `rounded-full`.
- Elevation: Tailwind `shadow-sm/md/lg/xl`, plus custom amber glows such as `shadow-[0_0_16px_rgba(255,193,116,0.25)]` on the paid CTA and `shadow-[0_0_24px_rgba(255,193,116,0.08)]` on the featured plan card.
- Sticky chrome (desktop header, mobile bottom bar) uses `bg-surface-container-lowest/90` + `backdrop-blur`.

## 4. Layout

**Desktop:** fixed top header (`h-16`, `max-w-7xl`, `px-margin`), content `max-w-7xl mx-auto px-margin py-space-lg`. Hero sections are 12-column grids splitting 6/6 (image left, copy right). Dashboard uses `lg:col-span-8` + `lg:col-span-4` chart/sidebar pairs and a 4-up KPI grid (`sm:grid-cols-2 lg:grid-cols-4`). Tracker is a 2x2 pillar grid. Footer mirrors the header styling.

**Mobile (`/m/`):** separate pages, not responsive reflows of the desktop ones. `h-14` header, `px-margin-mobile` (1rem) padding, stacked single-column cards, `headline-xl-mobile` type, `viewport-fit=cover` with `pt-safe`/`pb-safe` env() insets, and a fixed bottom tab bar (`backdrop-blur-xl`) for Dashboard / Tracker / Plans. Mobile viewport sets `maximum-scale=1.0, user-scalable=no` (current behavior, noted as-is).

## 5. Components

### 5.1 Navigation

- **Desktop header:** flame icon in a bordered square chip + stacked wordmark ("HABITFORGE" / "Forge your fate."), tab links (Dashboard, Daily Tracker, Plans) where the active tab is amber with a 2px `primary-container` underline, year/month pill tabs, a "Saved locally" chip with a pulsing amber dot, settings gear button, and a round amber avatar with a soft amber glow.
- **Mobile bottom tab bar:** fixed, safe-area padded, blurred; active tab highlighted with `bg-surface-container-high/90 text-primary-container`.

### 5.2 Hero card (sign-in, dashboard, plans)

Full-width `rounded-xl shadow-xl` card on `surface-container-lowest`: forge photo left (filtered, gradient-masked), copy right. Always carries the "ANVIL SYNCHRONIZED" atmospheric chip - a blurred dark pill with an ember `animate-ping` dot and wide-tracked amber micro-label. Sign-in hero adds the Google sign-in button and plan link; dashboard hero adds the Campaign Velocity gauge; plans hero leads with "Your ledger awaits."

### 5.3 Buttons

- **Primary:** `bg-primary text-on-primary`, uppercase JetBrains Mono label, `rounded`, bold, hover to `bg-primary-fixed` or `bg-primary-container`. Used for "Claim the Crucible", tour "NEXT", "Apply Parameters".
- **Secondary/ghost:** bordered or `surface-container` fills with `text-on-surface-variant`, e.g. "+ Habit", "Dismiss", "Manage Plan".
- **Destructive:** error red; delete actions are a two-tap confirm (icon switches `delete` -> `delete_forever` in red), and "Erase All Data" is a red two-tap confirm in Settings.
- **Icon buttons:** 8x8 (desktop) / 7x7 (mobile) rounded squares with Material Symbols, hover fill.

### 5.4 Cards and KPI tiles

Standard card: `bg-surface-container p-space-lg rounded-xl shadow-md`, hover lifts to `bg-surface-container-high`. KPI tiles (Monthly Consistency, Current Arc Streak, Weekly Kaizen, Local Ledger) follow one anatomy: uppercase `label-sm` outline title + small status dot or icon, a `stat-display` mono number, then a footer row of `label-sm` supporting facts. Delta chips are tiny mono pills on `surface-container-lowest`.

### 5.5 Habit rows (tracker)

Each habit is a row card (`surface-container/30`, hover to full, thin `outline-variant/20` border): a 6x6 `rounded` checkbox (Material `check` icon), habit title in `body-lg` (completed = `line-through opacity-80`), a cadence chip (`surface-container-highest`, 9px uppercase), time/status micro-label ("Pending" / time / "Upcoming"), and hover-revealed rename/delete icon buttons. Future dates dim to `opacity-60` with `cursor-not-allowed`.

### 5.6 Status chips and badges

- Counter chips: "0 / 0 CLEARED" in mono on `surface-container` pills.
- Habit status badges: **Met** (amber tint + check icon), **At Risk** (`error-container/40` + warning icon), **In Progress** (neutral pill).
- Live indicators: 1.5-2px dots with `animate-ping` (ember) or `animate-pulse` (amber).

### 5.7 Forms

Inputs sit on `surface-container-lowest` with `outline-none`, thin `outline-variant/40` borders and `focus:border-primary`. Examples: add-habit text input (60-char max, placeholder in forge voice: "e.g. Distributed Consensus Benchmark Script..."), "Jump to date" date picker, threshold range slider (`accent-primary-container`, 50-100, default 75), settings popover selects (threshold, pacing algorithm).

### 5.8 Guided tour overlay

First-run tour (per browser/device per account): full-screen dim backdrop, a spotlight ring (`1px` amber border, giant box-shadow cutout, `0.25s ease` transitions), and a floating dark card with "HABITFORGE TOUR - n / N" micro-label, title, body, "SKIP" (ghost) and "NEXT" (primary). 6 steps on the tracker, 8 on the dashboard.

### 5.9 Data visualization (dashboard)

All hand-built SVG in `dashboard.js`:

- **Campaign Velocity bar:** horizontal progress bar with a `secondary-container -> primary-container -> primary` gradient fill (`duration-700` transition), flanked by mono start/end labels ("OCT 24 - ANVIL COLD" / "JAN 23 - TEMPER TEST").
- **Daily Strike Completion chart:** line chart on a 40px grid pattern with dashed 25/50/100% guides, dashed threshold line at the user's target, `forgeHeatGradient` area fill (amber fading to transparent), 2.5px `#f59e0b` polyline, and point markers - latest point amber with white ring, trough points red.
- **Execution Split donut:** three-ring radial gauge (9px strokes: track `#272a30`, base `#534434`, value `#f59e0b`), center `stat-display` percentage with "FORGED" micro-label.
- **Pillar bars:** per-pillar progress bars cycling amber / ember / blue / neutral across the four pillars.
- **Weekly Kaizen Protocol table:** dark table with mono headers, per-habit gauge bars (red when at risk) and status badges.
- **90-Day Winter Crucible Matrix:** 7-row density heatmap, one block per campaign day; legend: Upcoming (`surface-container-highest`), Partial (`outline-variant`), Tempered (`primary` amber).

### 5.10 Pricing cards

Two "PASS" cards: Pass 01 "The Kindling" (Rs 0, free tier) and Pass 02 "The Crucible" (Rs 149 one-time, featured). The featured card carries a `primary/60` border, an amber outer glow, and a floating "LIFETIME" pill in `secondary-container` ember. Prices use `stat-display` mono with the rupee glyph. Trust strip below: "Secured by Dodo Payments" and "Ember-back guarantee - 7 days - No questions - Full refund".

### 5.11 Empty and locked states

- Empty discipline: "No habits in this discipline yet. Use + Habit to forge one." in outline grey.
- Empty dashboard: "Cold Start Ledger Detected" banner with `hourglass_empty` icon.
- Locked dashboard (free tier): `hf-locked-banner` - dark banner with lock icon, "Crucible access locked" and an amber "View Plans" button.

## 6. Iconography and imagery

- **Icons:** Material Symbols Outlined (variable font). Recurring set: `local_fire_department` (logo, streaks), `ac_unit` (protocol/footer snowflake), `fitness_center`, `psychology`, `terminal`, `mic` (the four pillars), `settings`, `check`, `delete`/`delete_forever`, `warning`, `verified`, `sync_saved_locally`, `hourglass_empty`, `lock`, `tune`, `filter_alt`.
- **Favicon:** `assets/favicon.svg`.
- **Photography:** only `assets/forge.jpg`, always filtered and gradient-masked.

## 7. Voice and naming system

Copy is terse, uppercase-heavy for labels, and consistently metaphorical:

- Product protocol: "HabitForge Protocol", "Restricted Ledger", "Anvil Synchronized"
- Tiers: "The Kindling" (free), "The Crucible" (paid, lifetime)
- Pillars: Discipline I "Physical Vessel", II "Mental & Spiritual", III "Professional Arc", IV "Content & Craft"
- Actions/metrics: strikes, "tempered strike day", "Days Hot", "Cold Anvil", "Weekly Kaizen Protocol", "thermal debt", "Campaign Velocity", "Execution Split", "90-Day Winter Crucible Matrix"
- Data copy: "Live Telemetry", "Telemetry Range", "Saved locally / Last save", "Local Ledger"

## 8. Motion

Restrained and functional: `transition-colors` on most interactive elements, `duration-700` on the campaign bar, `duration-1000` on the radial gauge, `0.25s ease` on the tour spotlight, `active:scale-90` tap feedback on mobile checkboxes, and `animate-ping`/`animate-pulse` reserved for live-status dots.

## 9. Accessibility and platform notes (as built)

- Interactive controls carry `aria-label`s; habit toggles use `role="checkbox"` + `aria-checked`; active nav uses `aria-current="page"`.
- Text is antialiased; selection styled amber; scrollbars hidden globally.
- Dark theme only; `theme-color #111319`.
- Mobile pages lock zoom (`user-scalable=no`) - documented as current behavior.

---

*Scope note: this file records the current design only. Improvement ideas (guest mode, OG/social meta, analytics, light theme, etc.) are tracked separately and intentionally excluded here.*
