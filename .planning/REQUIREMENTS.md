# Requirements: Frise Série — Historical Series Timeline

**Defined:** 2026-05-17
**Core Value:** The parallax scroll experience: an immersive fresco where era backgrounds and show cards move at different depths — and 100+ shows placed with historically accurate dates so the discovery is trustworthy.

## v1 Requirements

### Timeline Core

- [ ] **TL-01**: User can scroll a horizontal parallax timeline spanning from ~3000 BC to present, with three depth layers (slow era backgrounds, time axis, fast show cards)
- [ ] **TL-02**: Timeline uses a non-linear time scale (denser around era-rich periods, compressed for sparse ancient eras) so show cards are never overcrowded
- [ ] **TL-03**: Major historical eras (Antiquity, Middle Ages, Renaissance, Modern, etc.) are color-coded in the background with illustrative textures
- [ ] **TL-04**: Key historical events (Fall of Rome, French Revolution, etc.) appear as markers on the timeline axis with tooltips

### Show Cards

- [ ] **SC-01**: Each show card is placed at its story's start year (not broadcast year) and displays a span indicator stretching to the narrative end year
- [ ] **SC-02**: Show card displays poster image, title, narrative years, and streaming platform badges
- [ ] **SC-03**: Historical accuracy score (1–5 editorial rating) is always visible on the card surface, not only in the detail panel
- [ ] **SC-04**: Shows with flashbacks have a primary card at the main era and a badge linking to the flashback era

### Detail Panel

- [ ] **DP-01**: Clicking a show card opens a side panel / modal with a historical synopsis (context about the era, not the show's plot) and a link to the Wikipedia page for the historical period
- [ ] **DP-02**: Detail panel shows "Similar shows" — other works set in the same historical era
- [ ] **DP-03**: Detail panel shows direct links to streaming platforms (Netflix, Prime, Disney+, etc.)

### Filters & Search

- [ ] **FS-01**: User can filter the timeline by geographic region (Europe, Asia, Americas, Middle East, etc.) to show only relevant cards
- [ ] **FS-02**: User can search by TV series title or historical figure name and the timeline scrolls to and highlights matching cards
- [ ] **FS-03**: User can navigate the timeline with keyboard arrows (←/→) and mouse wheel / trackpad scroll
- [ ] **FS-04**: Every filter/era state produces a shareable URL (e.g. `/en?era=renaissance`) that another user can open to land on the same view — critical for teachers sharing resources
- [ ] **FS-05**: Era jump navigation allows users to instantly jump to a named era (Antiquity, Middle Ages, Renaissance, etc.) without scrolling the full timeline

### Data

- [ ] **DT-01**: At least 100 shows are present at launch, each with accurate narrative start/end years, poster, streaming platforms, and historical accuracy score — seeded from the PRD examples and expanded manually

### UX & Technical

- [ ] **UX-01**: All UI copy and show metadata (titles, historical synopses) are available in French and English via next-intl routing (`/fr`, `/en`)
- [ ] **UX-02**: The timeline supports native horizontal swipe on mobile devices (iOS Safari + Android Chrome) with no conflicts between parallax depth layers and touch scroll
- [ ] **UX-03**: The app meets WCAG AA: sufficient contrast ratios, full keyboard navigation, ARIA landmarks and labels on interactive elements, and suppressed parallax motion when OS `prefers-reduced-motion` is set
- [ ] **UX-04**: The timeline skeleton (era backgrounds + axis) is visible in under 1 second; show cards and posters load progressively without layout shift

## v2 Requirements

### Filters (deferred)

- **FLT-01**: Filter by streaming platform (Netflix, Prime, Disney+, etc.)
- **FLT-02**: Filter by genre (Peplum, Medieval, War, Biopic, Western, etc.)
- **FLT-03**: Filter by historical accuracy score (e.g. score ≥ 3 only)
- **FLT-04**: "Available in my country" filter using geolocation

### User Accounts & Watchlist

- **ACC-01**: User can sign up / log in via email or OAuth (Google / Apple)
- **ACC-02**: User can add shows to a personal watchlist
- **ACC-03**: User can mark shows as "Watched", "Watching", or "To Watch"
- **ACC-04**: User receives show recommendations based on watched history

### CMS & Editorial

- **CMS-01**: Editorial team can add, edit, and moderate shows via a back-office CMS (Payload v3) without code changes
- **CMS-02**: Streaming availability data is updated on a weekly schedule

### Search Enhancements

- **SCH-01**: Full-text search across show titles and historical figure names via Supabase FTS (bilingual FR/EN tsvector)

## v3 Requirements (Community)

- **COM-01**: User can submit a new show suggestion via a moderated form
- **COM-02**: User can vote to correct a show's narrative dates
- **COM-03**: User can add comments on a show's historical context
- **COM-04**: "Classroom mode" — shareable link frozen on a specific era for teacher use (distinct from regular shareable URL)
- **COM-05**: Interactive geographic map view (explore by region)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Films / movies | Series only for v1 — films would require a separate data model and moderation workflow |
| Podcasts, books, video games | Out of domain scope |
| User star ratings | Accuracy score is editorial, not crowdsourced — mixing them would undermine trust |
| Native mobile app | PWA + responsive web is sufficient for v1 |
| Monetization / display ads | Not in scope for any planned version |
| Real-time streaming availability API | Too expensive / complex; manual/weekly updates are sufficient |
| Social graph (followers, activity feed) | This is a discovery tool, not a social network |

## Traceability

*Populated during roadmap creation.*

| Requirement | Phase | Status |
|-------------|-------|--------|
| TL-01 | — | Pending |
| TL-02 | — | Pending |
| TL-03 | — | Pending |
| TL-04 | — | Pending |
| SC-01 | — | Pending |
| SC-02 | — | Pending |
| SC-03 | — | Pending |
| SC-04 | — | Pending |
| DP-01 | — | Pending |
| DP-02 | — | Pending |
| DP-03 | — | Pending |
| FS-01 | — | Pending |
| FS-02 | — | Pending |
| FS-03 | — | Pending |
| FS-04 | — | Pending |
| FS-05 | — | Pending |
| DT-01 | — | Pending |
| UX-01 | — | Pending |
| UX-02 | — | Pending |
| UX-03 | — | Pending |
| UX-04 | — | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 21 ⚠️

---
*Requirements defined: 2026-05-17*
*Last updated: 2026-05-17 after initial definition*
