# ROADMAP — Frise Série: Historical Series Timeline

**Project mode:** mvp (Vertical MVP — each phase delivers a working user-facing slice)
**Granularity:** Fine
**Requirements mapped:** 21/21
**Last updated:** 2026-05-17

---

## Phases

- [ ] **Phase 1: Data Foundation + yearToPixel** — Mathematical backbone: schema, seed data, non-linear scale function
- [ ] **Phase 2: Parallax Engine + Era Backgrounds** — Scrollable three-layer fresco with era colour bands
- [ ] **Phase 3: Show Cards** — Cards placed at correct position with poster, metadata, and accuracy score
- [ ] **Phase 4: Historical Events + Flashbacks** — Event markers on the axis and flashback secondary placements
- [ ] **Phase 5: Detail Panel** — Slide-in panel with historical context, similar shows, and streaming links
- [ ] **Phase 6: Filters + Search + Navigation** — Region filter, text search, keyboard nav, shareable URLs, era jump
- [ ] **Phase 7: Bilingual Routing + i18n** — Full FR/EN parity: routing, translations, locale-aware metadata
- [ ] **Phase 8: Mobile Polish + WCAG AA** — Touch swipe QA and full accessibility audit
- [ ] **Phase 9: Data Completion + SEO** — 100+ shows at launch, SSG show pages, sitemap

---

## Phase Details

### Phase 1: Data Foundation + yearToPixel
**Goal:** Lock the mathematical backbone before any visual work — yearToPixel() exists, is unit-tested, and seed data is loaded.
**Mode:** mvp
**Depends on:** Nothing
**Requirements:** TL-02
**Success Criteria:**
  1. `yearToPixel(year)` and `pixelToYear(px)` are inverse-verified for every era boundary, including year 0 (1 BC) and negative years down to -3000.
  2. Non-linear scale produces denser pixel density for era-rich periods (e.g. Renaissance) and compressed density for sparse ancient eras — visible in a test render of the axis.
  3. `data/eras.json` defines all historical periods with `yearStart`, `yearEnd`, `colorPalette`, and `pixelsPerYear` ratio, and era boundaries in `yearToPixel` are derived solely from this file (no duplicated constants).
  4. A seed dataset of 30–40 shows spans the full time range (3000 BC to present) and conforms to the TypeScript `Show` interface — importable without TypeScript errors.
  5. BC date convention (INTEGER, 0 = 1 BC, -1 = 2 BC) is documented in the schema and a `yearToDisplay(year, locale)` utility formats dates correctly for both FR and EN.
**Plans:** 4/5 plans executed
Plans:
- [x] 01-01-PLAN.md — Walking Skeleton: install Vitest, create vitest.config.mts, write test stubs
- [x] 01-02-PLAN.md — Schema update: add pixelsPerYear to HistoricalEra + data/eras.ts values
- [x] 01-03-PLAN.md — TDD: implement lib/yearToPixel.ts + lib/yearToDisplay.ts, pass tests
- [x] 01-04-PLAN.md — Dataset expansion: append 14 shows to data/shows.ts (30 total)
- [ ] 01-05-PLAN.md — Backward-compat shim: lib/timeline.ts re-export + CLAUDE.md corrections

### Phase 2: Parallax Engine + Era Backgrounds
**Goal:** The scroll experience exists — user can scroll horizontally and see the three-depth-layer fresco with era colour bands and progressive loading.
**Mode:** mvp
**Depends on:** Phase 1
**Requirements:** TL-01, TL-03, UX-04
**Success Criteria:**
  1. User can scroll the timeline horizontally from ~3000 BC to the present in a single continuous motion on both desktop and a physical iOS Safari device.
  2. Three parallax depth layers are visible during scroll: era backgrounds move at slow speed (0.3×), the time axis moves at 1×, and the show card track moves at fast speed — depth effect is perceivable at 60 fps on desktop and smooth on mobile.
  3. Each historical era (Antiquity, Middle Ages, Renaissance, Early Modern, Modern, Contemporary) renders a distinct colour band with illustrative texture; era labels appear on the background layer.
  4. The timeline skeleton (era backgrounds + axis) is visible in the browser within 1 second of navigation, measured with Lighthouse throttled mobile.
  5. On a device with `prefers-reduced-motion: reduce`, parallax depth movement is suppressed and the timeline still renders fully as a flat scroll.
**Plans:** TBD
**UI hint:** yes

### Phase 3: Show Cards
**Goal:** Cards appear on the timeline at the historically accurate position, showing poster, metadata, and accuracy score at a glance.
**Mode:** mvp
**Depends on:** Phase 2
**Requirements:** SC-01, SC-02, SC-03
**Success Criteria:**
  1. Each show card is horizontally positioned at `yearToPixel(narrativeYearStart)` and a span bar extends to `yearToPixel(narrativeYearEnd)` — a show spanning 200 years is visually wider than one spanning 10 years.
  2. A show card displays: poster image (lazy-loaded via `next/image`), title, narrative years in `yearToDisplay` format, and streaming platform badge(s) — all of this content is present in the SSR HTML (verified by `curl`-ing the page as Googlebot).
  3. The historical accuracy score (1–5) is rendered as a badge directly on the card surface, visible without clicking or hovering.
  4. Card images do not cause layout shift during progressive load (CLS = 0 for the card strip, verified in Lighthouse).
**Plans:** TBD
**UI hint:** yes

### Phase 4: Historical Events + Flashbacks
**Goal:** The timeline axis carries historical landmark markers, and shows with flashbacks are anchored to their main era with a visible link to the secondary era.
**Mode:** mvp
**Depends on:** Phase 3
**Requirements:** SC-04, TL-04
**Success Criteria:**
  1. Key historical event markers (e.g. Fall of Rome 476, French Revolution 1789) appear on the timeline axis at their correct pixel position; hovering or focusing a marker reveals a tooltip with the event name and year.
  2. A show with a significant flashback (e.g. a present-day show with ancient Rome episodes) displays its primary card at the main narrative era AND a secondary flashback badge at the flashback era, with both linking to the same detail panel.
  3. Removing all flashback shows from the dataset and reloading the timeline shows no orphaned badges or broken links — the feature degrades cleanly to zero.
**Plans:** TBD
**UI hint:** yes

### Phase 5: Detail Panel
**Goal:** Clicking a show card reveals rich historical context and converts discovery into watch intent.
**Mode:** mvp
**Depends on:** Phase 3
**Requirements:** DP-01, DP-02, DP-03
**Success Criteria:**
  1. Clicking any show card opens a slide-in panel without a full page navigation; the panel displays a historical synopsis of the era (not the show's plot) and a clickable link to the relevant Wikipedia article.
  2. The panel lists "Similar shows" — at least the other shows in the dataset set in the same or adjacent historical era — and clicking one closes the current panel and opens the clicked show's panel.
  3. The panel displays direct streaming platform links (Netflix, Prime, Disney+, etc.) that open in a new tab and resolve to the show's actual page.
  4. The panel is keyboard-accessible: Tab cycles through interactive elements, Escape closes it, and focus returns to the originating card on close (ARIA `role="dialog"` with `aria-labelledby` pointing to the show title).
**Plans:** TBD
**UI hint:** yes

### Phase 6: Filters + Search + Navigation
**Goal:** The timeline becomes discoverable and shareable — every filter state produces a URL a teacher can send to students.
**Mode:** mvp
**Depends on:** Phase 5
**Requirements:** FS-01, FS-02, FS-03, FS-04, FS-05
**Success Criteria:**
  1. Selecting a geographic region filter (Europe, Asia, Americas, Middle East, etc.) immediately hides cards outside that region and updates the URL query string — refreshing the page restores the same filtered view.
  2. Typing a show title or historical figure name in the search box scrolls the timeline to the first matching card and highlights all matching cards; clearing the search restores the full unfiltered view.
  3. Pressing ← / → arrow keys scrolls the timeline by one era width; mouse wheel and trackpad produce horizontal scroll without triggering vertical page scroll.
  4. A user who copies the current URL (e.g. `/en?era=renaissance&region=europe`) and pastes it in a new browser tab lands on the same era position with the same filters applied.
  5. Clicking an era name in the era-jump navigation bar (always visible, sticky) instantly scrolls the timeline to that era's start year without manual scrolling.
**Plans:** TBD
**UI hint:** yes

### Phase 7: Bilingual Routing + i18n
**Goal:** Every screen, string, and show metadata is available in both French and English via locale-prefixed routing.
**Mode:** mvp
**Depends on:** Phase 2
**Requirements:** UX-01
**Success Criteria:**
  1. Navigating to `/fr` serves the full timeline with all UI copy in French; navigating to `/en` serves it in English — no untranslated strings (no fallback keys visible in production).
  2. Switching locale via the language toggle preserves the user's current timeline position, active filters, and open panel state.
  3. All show metadata (titles, historical synopses, streaming platform names) are present in both locales in the JSON dataset, and `next-intl` type-safe key checking produces zero TypeScript errors on `tsc --noEmit`.
  4. `hreflang` alternates (`<link rel="alternate" hreflang="fr" ...>` and `hreflang="en"`) are present in the `<head>` of every SSG-rendered page.
**Plans:** TBD
**UI hint:** yes

### Phase 8: Mobile Polish + WCAG AA
**Goal:** The timeline is smooth on every real device and fully accessible — contrast, keyboard, and screen reader requirements met.
**Mode:** mvp
**Depends on:** Phase 6
**Requirements:** UX-02, UX-03
**Success Criteria:**
  1. On a physical iPhone (iOS Safari) and a physical Android device (Chrome), horizontal swipe scrolls the timeline smoothly with no accidental vertical page scroll and no `pointercancel` events triggered by diagonal swipe (verified with touch-action: pan-x).
  2. All interactive elements (cards, filters, era-jump buttons, panel close) meet WCAG AA contrast ratio: text ≥ 4.5:1, large text and UI components ≥ 3:1 (verified with axe DevTools).
  3. A keyboard-only user can: navigate to any show card using Tab/arrow keys, open its detail panel with Enter, navigate within the panel, and close it with Escape — without a mouse at any point.
  4. A screen reader user (tested with VoiceOver on macOS and NVDA on Windows) hears meaningful announcements when scrolling the timeline, opening a card, and applying a filter — timeline region has a labelled `role="region"`, cards are `role="article"`, and filter results trigger an ARIA live region update.
**Plans:** TBD
**UI hint:** yes

### Phase 9: Data Completion + SEO
**Goal:** 100+ historically-verified shows are present at launch and every show and era has an indexable, shareable SSG page.
**Mode:** mvp
**Depends on:** Phase 7
**Requirements:** DT-01
**Success Criteria:**
  1. The dataset contains at least 100 distinct TV series, each with verified narrative `yearStart` / `yearEnd`, poster URL, streaming platform(s), historical accuracy score (1–5), and FR/EN synopsis — the count is verifiable by running `jq '. | length' data/shows.json`.
  2. `generateStaticParams` produces SSG routes for `/[locale]/show/[slug]` for every show in both locales; `next build` completes with zero errors and all show pages appear in the build output log.
  3. Each show page has a unique `<title>` tag, `<meta name="description">`, and `og:image` sourced from the poster — verified by loading `/fr/show/vikings` and `/en/show/vikings` in a browser and inspecting `<head>`.
  4. A `sitemap.xml` is generated at build time and lists all show and era URLs in both locales; submitting it to Google Search Console returns zero "URL not found" errors.
**Plans:** TBD

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Data Foundation + yearToPixel | 4/5 | In Progress|  |
| 2. Parallax Engine + Era Backgrounds | 0/? | Not started | — |
| 3. Show Cards | 0/? | Not started | — |
| 4. Historical Events + Flashbacks | 0/? | Not started | — |
| 5. Detail Panel | 0/? | Not started | — |
| 6. Filters + Search + Navigation | 0/? | Not started | — |
| 7. Bilingual Routing + i18n | 0/? | Not started | — |
| 8. Mobile Polish + WCAG AA | 0/? | Not started | — |
| 9. Data Completion + SEO | 0/? | Not started | — |

---

## Requirement Coverage

| Requirement | Phase |
|-------------|-------|
| TL-01 | Phase 2 |
| TL-02 | Phase 1 |
| TL-03 | Phase 2 |
| TL-04 | Phase 4 |
| SC-01 | Phase 3 |
| SC-02 | Phase 3 |
| SC-03 | Phase 3 |
| SC-04 | Phase 4 |
| DP-01 | Phase 5 |
| DP-02 | Phase 5 |
| DP-03 | Phase 5 |
| FS-01 | Phase 6 |
| FS-02 | Phase 6 |
| FS-03 | Phase 6 |
| FS-04 | Phase 6 |
| FS-05 | Phase 6 |
| DT-01 | Phase 9 |
| UX-01 | Phase 7 |
| UX-02 | Phase 8 |
| UX-03 | Phase 8 |
| UX-04 | Phase 2 |

**Coverage: 21/21 ✓**
