# Phase Structure Thinking — Frise Série

## Context

21 v1 requirements across 6 categories:
- TL-01..04: Timeline core (parallax, non-linear scale, era backgrounds, event markers)
- SC-01..04: Show cards (placement, metadata, accuracy score, flashbacks)
- DP-01..03: Detail panel (historical synopsis, similar shows, streaming links)
- FS-01..05: Filters & search (region filter, text search, keyboard nav, shareable URLs, era jump)
- DT-01: 100+ shows at launch
- UX-01..04: Bilingual, mobile swipe, WCAG AA, skeleton loading

## Vertical MVP Breakdown (PROJECT_MODE=mvp)

Each phase delivers a working, shippable slice. Stack: Next.js 16, Motion 12 (useScroll), Tailwind v4, next-intl, static JSON, nuqs.

### Phase 1: Data Foundation + yearToPixel
**Goal:** Lock the mathematical backbone before any visual work. Nothing can be built until yearToPixel() exists and is tested.
Requirements: DT-01 (partial — seed data + schema), TL-02 (non-linear scale algorithm)
- Show data schema (TypeScript interfaces from PRD)
- yearToPixel(year, eras) function with unit tests
- Era data (name, yearStart, yearEnd, colorPalette)
- Seed dataset: 30-40 shows (expand PRD examples)
- pixelToYear() inverse for keyboard/URL nav
- BC date convention (INTEGER, no JS Date)

### Phase 2: Parallax Engine + Era Backgrounds
**Goal:** The scroll experience exists. User can scroll and see the three-depth-layer fresco. No show cards yet.
Requirements: TL-01, TL-03, UX-04
- Horizontal scroll container with touch-action: pan-x
- 3-layer parallax (Motion useScroll + useTransform)
- Era background tiles (color + texture per era)
- Timeline axis with year labels
- GPU layer budget (will-change budget respected)
- prefers-reduced-motion (Motion useReducedMotion)
- Progressive skeleton loading < 1s
- FR/EN routing foundation (next-intl middleware + layout)

### Phase 3: Show Cards + Historical Event Markers
**Goal:** Cards appear on the timeline at the right position. The core value proposition is visible.
Requirements: SC-01, SC-02, SC-03, SC-04, TL-04
- ShowCard component placed at yearToPixel(narrativeYearStart)
- Span indicator (line from start to end year)
- Poster image with Next.js <Image> + lazy loading
- Platform badges
- Historical accuracy score badge (always visible)
- Flashback badge + secondary card placement
- Historical event markers on the axis (tooltips)
- RSC composition boundary: card content in SSR HTML, parallax transforms in client wrapper

### Phase 4: Detail Panel
**Goal:** Clicking a card reveals rich historical context. The "discovery" flow completes.
Requirements: DP-01, DP-02, DP-03
- Slide-in panel (right side) on card click
- Historical synopsis (FR/EN)
- Wikipedia link to the historical period
- "Similar shows" section (filter by era)
- Streaming platform links (per show data)
- Keyboard accessibility (focus trap in panel, Escape to close)
- ARIA: dialog role, aria-labelledby

### Phase 5: Filters + Search + Navigation
**Goal:** The timeline becomes discoverable and shareable. Teacher use-case (US-03) works.
Requirements: FS-01, FS-02, FS-03, FS-04, FS-05
- Region filter (nuqs — persists in URL)
- Text search by title or historical figure (fuse.js, client-side)
- Keyboard ←/→ navigation (scroll by era width)
- Mouse wheel / trackpad → horizontal scroll
- Shareable URLs (/en?era=renaissance, /en?year=1500&show=tudors)
- Era jump navigation bar (Antiquity, Medieval, Renaissance...)
- Filter state in URL (every filter combo shareable)

### Phase 6: Mobile Polish + WCAG AA Audit
**Goal:** Smooth on every device. Accessible for everyone.
Requirements: UX-02, UX-03
- iOS Safari + Android Chrome horizontal swipe QA
- touch-action: pan-x on scroll container (hardware test)
- WCAG AA audit: contrast ratios, focus indicators
- Screen reader pass (NVDA/VoiceOver): timeline as scrollable region, cards as articles
- Keyboard-only navigation audit
- ARIA live region for filter results count

### Phase 7: Data Completion + SEO
**Goal:** 100+ shows at launch. Google indexes show and era pages.
Requirements: DT-01 (complete), UX-01 (complete)
- Expand dataset to 100+ shows with verified narrative dates
- generateStaticParams for /[locale]/show/[slug] pages
- generateMetadata for SEO (title, description, og:image)
- hreflang FR/EN alternates
- Show detail page (SSG, same data as panel, for SEO + direct links)
- Sitemap generation
- FR/EN translations complete (all UI strings + show metadata)

## Horizontal Layers Alternative

Phase 1: Data model + schema + yearToPixel
Phase 2: Next.js routing + next-intl + layout foundation
Phase 3: Parallax engine (scroll container + Motion layers)
Phase 4: Era backgrounds + time axis
Phase 5: Show card component
Phase 6: Card placement + span indicators + flashbacks
Phase 7: Detail panel
Phase 8: Filters + search + navigation
Phase 9: Mobile QA + accessibility
Phase 10: SEO + data completion

## Recommendation

**Vertical MVP** — 7 phases. Reasons:
1. Solo developer (implied by project context) — horizontal layers only shine with multiple devs
2. Phase 1 (yearToPixel) must come first regardless of mode — it's the critical dependency
3. After Phase 3, the product is demonstrable and shareable for feedback
4. Fine granularity (user chose this) aligns with 7 focused phases
5. Research flagged yearToPixel as the highest-risk item — vertical MVP de-risks it early

## Open Questions Before Asking User

- Does "fine granularity" (8-12 phases) mean I should split some of these phases further?
  - Could split Phase 3 into: 3a Show Cards (no flashbacks) + 3b Flashbacks + Event Markers
  - Could split Phase 7 into: 7a Data (50→100+ shows) + 7b SEO
  - This would give 9 phases, which fits "fine" (8-12 range)
