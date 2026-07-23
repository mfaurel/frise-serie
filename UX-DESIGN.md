# UX Design Specification — Frise Série MVP

## Design Target

**Desktop-first.** Primary viewport: 1440×900. Minimum supported: 1024×768.
Mobile is Phase 2 — the MVP should not break on mobile but does not optimize for touch.

---

## Visual Identity

### Tone

**Interactive museum meets premium editorial.** The timeline should feel like walking through a curated exhibition — each era has its own atmosphere, and the parallax creates physical depth. Not a dashboard. Not a spreadsheet of shows.

### Typography

| Role | Font | Fallback | Weight | Usage |
|------|------|----------|--------|-------|
| Display / era names | **Playfair Display** | Georgia, serif | 700, 900 | Era titles overlaid on backgrounds, "Antiquité", "Moyen Âge" |
| UI / navigation | **DM Sans** | system-ui, sans-serif | 400, 500, 700 | Nav bar, filter labels, buttons, card titles |
| Monospace / dates | **JetBrains Mono** | monospace | 400 | Year labels on axis, date ranges on cards |

Load via `next/font/google` — self-hosted, no external requests.

Apply `font-variant-numeric: tabular-nums` to all year displays.
Apply `text-wrap: balance` to era titles and show card titles.
Apply `-webkit-font-smoothing: antialiased` on root layout.

### Color System

**Dark-dominant with era-specific accent gradients.** The dark background lets era gradients and poster art pop.

```css
:root {
  /* Base palette */
  --bg-primary: #0a0a0f;          /* Deep near-black */
  --bg-surface: #14141f;          /* Card surfaces */
  --bg-elevated: #1e1e2e;         /* Panels, sheets */
  --text-primary: #e8e6e3;        /* Off-white, warm */
  --text-secondary: #8a8891;      /* Muted labels */
  --text-accent: #c9a96e;         /* Gold accent for era names */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(255, 255, 255, 0.12);

  /* Interaction */
  --focus-ring: #6366f1;          /* Indigo for keyboard focus */
  --filter-active: #c9a96e;       /* Gold for active filter chips */
}
```

**Light mode** (toggle in nav): invert base palette, keep era gradients at reduced opacity. Deferred to late MVP or Phase 2.

### Era Color Palettes

Each era defines a gradient used for the background layer. These are the only visual era-differentiators in MVP (no illustrations).

| Era | Years | Gradient (left → right) | Mood |
|-----|-------|------------------------|------|
| Antiquité | -3000 → 476 | `#1a0a00` → `#2d1810` → `#4a2a1a` | Burnt umber, terracotta |
| Moyen Âge | 476 → 1453 | `#0a0f1a` → `#1a2040` → `#2a1a30` | Deep indigo, iron |
| Renaissance | 1453 → 1600 | `#1a1000` → `#3d2b00` → `#5c4a1a` | Rich gold, Florentine |
| Époque Moderne | 1600 → 1789 | `#0a1a1a` → `#1a3030` → `#2a1a3a` | Teal, Baroque purple |
| Révolutions | 1789 → 1848 | `#1a0a0a` → `#3a1010` → `#4a1a1a` | Revolutionary red, dark |
| XIXe siècle | 1848 → 1914 | `#0f0f1a` → `#1a1a2a` → `#2a2530` | Steel blue, industrial |
| Guerres mondiales | 1914 → 1945 | `#0a0a0a` → `#1a1a1a` → `#2a2020` | Charcoal, blood accent |
| Guerre froide | 1945 → 1991 | `#0a0a1a` → `#101a2a` → `#1a2a3a` | Cold blue, noir |
| Époque contemporaine | 1991 → now | `#0a0f14` → `#141e28` → `#1e2832` | Modern slate, digital |

Gradients are rendered as full-height `<div>`s with `background: linear-gradient(to right, ...)`, positioned and sized by the density zones. They scroll at 0.3× parallax speed.

---

## Layout Anatomy

```
┌──────────────────────────────────────────────────────────────────┐
│  NAVIGATION BAR (fixed top, 56px)                                │
│  [Logo]  [Era quick-jump pills]           [Filters] [FR|EN]     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░ LAYER 1: Era backgrounds (parallax 0.3×) ░░░░░░░░░░░░░░░░  │
│  ░░ Full-height gradient bands, era name in large serif ░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                                  │
│  ── LAYER 2: Time axis (parallax 0.6×) ──────────────────────── │
│  │   │   │   ▼476   │   │   ▼1453  │   │   │   ▼1789  │   │    │
│  ── tick marks, year labels, historical event pins ──────────── │
│                                                                  │
│  ▓▓ LAYER 3: Show cards (parallax 1.0× = scroll speed) ▓▓▓▓▓▓  │
│  ▓▓ Cards positioned by yearToPixel, laid out by engine ▓▓▓▓▓▓  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  DETAIL BOTTOM SHEET (slides up when show selected, 40vh)        │
│  [Poster] [Title] [Synopsis] [Platforms] [Similar] [Wikipedia]   │
└──────────────────────────────────────────────────────────────────┘
```

### Dimensions

| Element | Height | Notes |
|---------|--------|-------|
| Nav bar | 56px | Fixed top, glass morphism (`backdrop-filter: blur(12px)`) |
| Era background | 100vh - 56px | Full remaining height |
| Time axis | 48px | Positioned at ~65% from top |
| Show card zone | ~35% of viewport | Below the axis, cards grow upward on hover |
| Bottom sheet | 40vh when open | Slides up with spring animation, draggable edge |
| Timeline total width | Computed by density engine | ~8000-15000px depending on data |

---

## Component Specifications

### Navigation Bar

```
┌─────────────────────────────────────────────────────────────┐
│  FRISE SÉRIE    [Antiquité] [Moyen Âge] [Renaissance] ...   │
│                                          [⚙ Filtres] [FR]  │
└─────────────────────────────────────────────────────────────┘
```

- **Logo:** "FRISE SÉRIE" in Playfair Display 700, gold accent color
- **Era pills:** Horizontal scrollable chip bar. Click → smooth scroll to era start position. Active era highlighted based on current scroll position.
- **Filter button:** Opens FilterPanel overlay. Badge count for active filters.
- **Locale switch:** Toggle `FR ↔ EN`. Navigates to `/{otherLocale}/` preserving query params.

### Show Card

```
┌──────────────┐
│              │
│   [POSTER]   │  ← 120×180px (2:3 ratio), rounded-lg
│              │  ← Subtle 1px outline (rgba white 0.08)
│              │
├──────────────┤
│ Title        │  ← DM Sans 500, 13px, 2 lines max, text-wrap: balance
│ 793 – 1002   │  ← JetBrains Mono 400, 11px, tabular-nums, text-secondary
│ ★★★★☆       │  ← Historical accuracy, gold stars
│ [Netflix]    │  ← Platform badge, tiny pill
└──────────────┘
```

**Card width:** 136px. **Card height:** ~280px.
**Hover state:** Scale 1.05, elevation shadow increases, z-index lifts above neighbors. Transition: 200ms `cubic-bezier(0.2, 0, 0, 1)`.
**Click:** Opens DetailBottomSheet. Sets `?show=` in URL via nuqs.
**Narrative span:** If the show covers multiple years, render a thin horizontal line from card left edge extending rightward to `yearToPixel(narrativeYearEnd)`. Line color matches era gradient. Opacity 0.4.

### Card Layout Engine — Adaptive Density

This is the core UX challenge: shows clustering in the same time period.

#### Strategy: Swim Lanes with Stacking Fallback

```
Low density (≤ 3 shows in same 50px zone):
┌──┐  ┌──┐  ┌──┐
│A │  │B │  │C │         ← Single row, spaced naturally
└──┘  └──┘  └──┘

Medium density (4-6 shows in same 50px zone):
┌──┐  ┌──┐  ┌──┐
│A │  │B │  │C │         ← Row 1 (swim lane)
└──┘  └──┘  └──┘
┌──┐  ┌──┐
│D │  │E │               ← Row 2 (swim lane)
└──┘  └──┘

High density (7+ shows in same 50px zone):
┌──┐  ┌──┐  ┌──┐
│A │  │B │  │C │         ← Row 1
└──┘  └──┘  └──┘
      ┌─┬─┬─┐
      │D│E│F│ +2 more    ← Stacked cluster with "+N" badge
      └─┴─┴─┘
        ↓ click to fan out
```

#### Algorithm

1. **Sort** shows by `narrativeYearStart`
2. **Group** shows whose `yearToPixel` positions are within `CARD_WIDTH + GAP` (136 + 16 = 152px)
3. **For each group:**
   - If `count ≤ 6`: assign swim lanes (rows). Each lane is `CARD_HEIGHT + LANE_GAP` (280 + 12 = 292px) tall. Cards are top-aligned per lane.
   - If `count > 6`: first 5 in swim lanes, remainder in a stacked cluster with a "+N" badge. Clicking the cluster fans cards out in a temporary overlay row.
4. **Swim lane count** determines the total height of the card zone. Maximum 3 lanes before clustering kicks in.

#### Fan-Out Interaction

When a cluster badge is clicked:
- An overlay row appears above the cluster
- Fanned cards animate in with staggered `translateY` (100ms delay per card)
- Click a fanned card → opens its detail
- Click elsewhere → fan collapses with subtle exit animation (fixed `translateY(-8px)` + opacity fade)

### Time Axis

```
──│──────│──────│──────▼──────│──────│──────│──
  500    600    700   Fall    900    1000   1100
                      of Rome
                      (476)
```

- **Tick marks:** Every N years (adaptive — fewer ticks in compressed eras, more in dense ones)
- **Year labels:** JetBrains Mono, `text-secondary`, below tick marks
- **Historical event markers:** Diamond icon (▼) above axis, tooltip on hover showing event name in current locale
- **Event tooltip:** Appears on hover, 200ms delay. Dark popover with event name and year. `backdrop-filter: blur(8px)`.

### Filter Panel

Overlay that slides in from the right, 360px wide, full height.

```
┌─ FILTRES ──────────────── [✕] ─┐
│                                 │
│  Région                         │
│  [○ Toutes]                     │
│  [● Europe Ouest]  [○ Asie]    │
│  [○ Méditerranée]  [○ ...]     │
│                                 │
│  Genre                          │
│  [□ Péplum]  [☑ Médiéval]      │
│  [□ Guerre]  [□ Biopic]        │
│                                 │
│  Fiabilité historique           │
│  [★ ★ ★ ★ ★]  ← min slider    │
│                                 │
│  Plateforme                     │
│  [□ Netflix] [□ Prime Video]   │
│  [□ Disney+] [□ Apple TV+]     │
│                                 │
│  ─────────────────────────────  │
│  [Réinitialiser]    [Appliquer] │
└─────────────────────────────────┘
```

- **Region:** Single-select radio group (+ "All")
- **Genre:** Multi-select checkboxes
- **Accuracy:** Minimum threshold slider (1-5)
- **Platform:** Multi-select checkboxes
- Filter state is persisted in URL via nuqs. Closing and reopening the panel preserves selections.
- "Réinitialiser" clears all filters (removes query params).
- When filters are active, a badge count appears on the filter button in the nav bar.
- Filtered-out cards animate out with `opacity: 0` + `scale: 0.95`, 200ms. Remaining cards reflow.

### Detail Bottom Sheet

Primary show detail view. Slides up from bottom when a show card is clicked.

```
┌─────────────── drag handle ────────────────┐
│  ═══════                                    │  ← Drag handle bar (40×4px, rounded)
│                                             │
│  ┌─────────┐  Titre de la série             │
│  │         │  793 – 1002 · Europe Nord       │
│  │ POSTER  │  ★★★★☆ Fiabilité historique    │
│  │ (large) │                                 │
│  │         │  Synopsis historique             │
│  │         │  "Les Vikings ont dominé..."    │
│  └─────────┘                                 │
│                                             │
│  Où regarder                                │
│  [Netflix]  [Prime Video]                    │
│                                             │
│  Séries similaires (même époque)            │
│  ┌──┐ ┌──┐ ┌──┐                            │
│  │  │ │  │ │  │  ← Mini cards, horizontal   │
│  └──┘ └──┘ └──┘    scroll                    │
│                                             │
│  [📎 Copier le lien]  [Wikipedia ↗]         │
└─────────────────────────────────────────────┘
```

- **Height:** 40vh default. Draggable to expand (up to 70vh) or dismiss (drag down).
- **Animation:** Spring physics via Motion 12. `type: "spring", stiffness: 300, damping: 30`.
- **Backdrop:** Semi-transparent overlay on the timeline area above. Click backdrop = dismiss.
- **"Copier le lien"** copies a shareable URL: `/{locale}/show/{showId}` — when opened directly, this URL renders the show in a **popin** (centered modal overlay) instead of the bottom sheet.

### Detail Popin (Deep Link Mode)

When a user navigates directly to `/{locale}/show/{showId}`:

```
┌─────────────────────────────────────────────┐
│              (dimmed timeline)                │
│                                             │
│         ┌───────────────────────┐           │
│         │                       │           │
│         │   Same content as     │           │
│         │   bottom sheet but    │           │
│         │   centered modal      │           │
│         │   640×auto, max 80vh  │           │
│         │   rounded-2xl         │           │
│         │   shadow-2xl          │           │
│         │                       │           │
│         │              [✕]      │           │
│         └───────────────────────┘           │
│                                             │
└─────────────────────────────────────────────┘
```

- **Same component** renders both modes. Prop `mode: 'sheet' | 'popin'` controls positioning.
- **Close button** (✕) navigates back to `/{locale}/` with `router.back()`.
- **ESC** also closes.

---

## Parallax System

### Layer Speeds

| Layer | Content | Parallax Factor | Scroll Speed |
|-------|---------|----------------|--------------|
| 1 — Background | Era gradients, era names | 0.3× | Slow |
| 2 — Axis | Year markers, events | 0.6× | Medium |
| 3 — Cards | Show cards | 1.0× | Normal (matches scroll) |

### Implementation

```typescript
const containerRef = useRef<HTMLDivElement>(null);
const { scrollXProgress } = useScroll({ container: containerRef });

// Each layer transforms based on scrollXProgress
const bgX = useTransform(scrollXProgress, [0, 1], [0, -totalWidth * 0.3]);
const axisX = useTransform(scrollXProgress, [0, 1], [0, -totalWidth * 0.6]);
// Card layer scrolls naturally with the container (1.0×)
```

All transforms use `translateX` only — GPU-composited, no layout recalculation.

### Scroll Interaction

- **Mouse wheel:** Horizontal scroll (capture `wheel` event, convert `deltaY` → `scrollLeft`)
- **Trackpad:** Native horizontal scroll
- **Keyboard:** `←` / `→` arrow keys scroll by 200px increments. Smooth scrolling.
- **Era quick-jump:** Click era pill → `scrollTo({ left: eraPixelStart, behavior: 'smooth' })`

---

## Interaction Patterns

### Hover States

| Element | Hover Effect | Duration |
|---------|-------------|----------|
| Show card | Scale 1.05, shadow elevation, z-index lift | 200ms ease-out |
| Era pill | Background opacity 0.15, subtle underline | 150ms |
| Filter chip | Border highlight, text brighten | 150ms |
| Historical event marker | Tooltip appears with 200ms delay | 200ms |
| Platform badge | Slight brightness increase | 150ms |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `←` / `→` | Scroll timeline 200px |
| `Tab` | Focus next interactive element (cards, filters, nav) |
| `Enter` / `Space` | Activate focused element |
| `Escape` | Close detail panel, close filter panel |
| `Home` | Scroll to timeline start |
| `End` | Scroll to timeline end |

### Focus Indicators

Visible focus ring (`--focus-ring`) on all interactive elements. `outline: 2px solid var(--focus-ring); outline-offset: 2px`. Never `outline: none` without a visible alternative.

---

## Loading & Skeleton

The `< 1s` skeleton requirement is met by inlining critical data at build time.

### Skeleton State (before hydration)

```
┌──────────────────────────────────────────────┐
│  FRISE SÉRIE    [░░░░] [░░░░░] [░░░░]       │
├──────────────────────────────────────────────┤
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░ Gradient shimmer background ░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                              │
│  ──│────│────│────│────│────│────│────│────  │
│                                              │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐    │
│  │░░░░│  │░░░░│  │░░░░│  │░░░░│  │░░░░│    │
│  │░░░░│  │░░░░│  │░░░░│  │░░░░│  │░░░░│    │
│  │░░░░│  │░░░░│  │░░░░│  │░░░░│  │░░░░│    │
│  ├────┤  ├────┤  ├────┤  ├────┤  ├────┤    │
│  │░░░░│  │░░░░│  │░░░░│  │░░░░│  │░░░░│    │
│  └────┘  └────┘  └────┘  └────┘  └────┘    │
└──────────────────────────────────────────────┘
```

Shimmer animation: `background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)` animating `translateX` from -100% to 100% over 1.5s, infinite.

---

## Accessibility (WCAG AA)

| Requirement | Implementation |
|------------|----------------|
| Color contrast | All text meets 4.5:1 ratio against era backgrounds. Gold accent (#c9a96e) on dark bg = 7.2:1 ✓ |
| Keyboard navigation | Full tab order, arrow key scroll, ESC to close |
| Screen reader | `role="region"` on timeline, `aria-label` on cards, `aria-live="polite"` on filter results count |
| Reduced motion | `prefers-reduced-motion: reduce` → disable parallax, use instant transitions |
| Focus visible | 2px indigo outline on all focusable elements |
| Alt text | Poster images use `alt="{show title} poster"` |
| Landmark roles | `<nav>`, `<main>`, `<aside>` for filter panel, `role="dialog"` for detail panels |

### Reduced Motion Behavior

When `prefers-reduced-motion: reduce`:
- All parallax factors → 1.0× (no depth effect, everything scrolls together)
- Card hover → no scale, opacity change only
- Bottom sheet → no spring, instant `display` toggle
- Skeleton shimmer → disabled
- Filter transitions → instant

---

## Responsive Breakpoints (Desktop MVP)

| Breakpoint | Width | Adjustments |
|-----------|-------|-------------|
| Large | ≥ 1440px | Default layout as specified |
| Medium | 1024–1439px | Card width 120px, poster 100×150px, max 2 swim lanes |
| Small | < 1024px | Not optimized for MVP. Basic fallback: vertical scroll, cards in grid. |

Mobile optimization (touch targets, swipe gestures, bottom nav) is Phase 2 scope.
