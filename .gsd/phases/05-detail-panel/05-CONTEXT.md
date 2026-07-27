# M005: Detail Panel

**Gathered:** 2026-07-27
**Status:** Ready for planning

## Project Description

Build the show detail panel for the historical TV series timeline. When a user clicks a show card on the timeline, a bottom sheet slides up displaying the show's full details: poster, title, narrative years, historical context (bilingual), accuracy stars, streaming platform links, Wikipedia link, and similar shows. The panel is driven by a `?panel=<slug>` nuqs query param — shareable, deep-linkable, and closed with the browser back button.

## Why This Milestone

Users click show cards to learn more — the historical context behind the era, where to stream the show, and what else exists from the same period. Without the detail panel, the timeline is a discovery surface with no depth. M005 is the "click → learn" payoff for all four PRD personas.

## User-Visible Outcome

### When this milestone is complete, the user can:

- Click a show card on the timeline → a bottom sheet slides up with the show's full historical context, accuracy stars, platform links, Wikipedia link, and similar shows
- Share the URL (`?panel=vikings`) — navigating to it opens the panel directly over the timeline
- Press Escape or click the overlay to close the panel and return focus to the card
- Read all panel content in French or English based on the current locale

### Entry point / environment

- Entry point: Timeline page (`/fr` or `/en`) — clicking a show card
- Environment: Browser (desktop and mobile)
- Live dependencies involved: None — streaming platform links and Wikipedia URLs are static external links, no API calls

## Completion Class

- Contract complete means: Unit tests confirm similar-shows algorithm returns correct results; panel component renders all Show fields; focus trap and Escape close are verified
- Integration complete means: nuqs `?panel=` param opens and closes the panel correctly on the live timeline page; bilingual content switches with locale
- Operational complete means: None (no background processes, no server-side state)

## Final Integrated Acceptance

To call this milestone complete, we must prove:

- Navigate to the timeline, click a show card → panel opens with correct historicalContext, accuracy stars, platform links, Wikipedia link, and similar shows in the current locale
- Copy the `?panel=<slug>` URL, open it in a new tab → panel opens immediately over the timeline
- Press Escape → panel closes; focus returns to the originating show card
- Switch locale (FR/EN) → all panel text updates; platform links and Wikipedia URL remain correct

## Architectural Decisions

### Panel routing via nuqs query param

**Decision:** The detail panel is driven by a single `?panel=<slug>` query param managed by nuqs on the timeline page. There is no dedicated `/[locale]/show/[slug]` route for M005.

**Rationale:** nuqs is already in the stack and synchronizes URL ↔ React state without a page navigation. This means the bottom sheet and "deep link" modal are the same component — navigating to `?panel=vikings` opens the panel over the timeline. Back button closes it naturally. One component, one route, zero duplication.

**Alternatives Considered:**
- Dedicated `/[locale]/show/[slug]` route — rejected for M005; would enable per-show SSR and OG meta but those are deferred to M009 (SEO milestone)
- Both query param + dedicated route — rejected as premature; adds complexity before SEO is a requirement

### Similar shows algorithm

**Decision:** Similar shows are computed at runtime by finding shows whose narrative year ranges overlap with the current show's era (±margin) AND share at least one genre or region with the current show. No `similarShows` field is added to the `Show` type.

**Rationale:** The `Show` type already has `genres`, `regions`, `narrativeYearStart`, `narrativeYearEnd` — enough to compute similarity without any data authoring. Pure function, fully testable. Manual curation would require upfront editorial work on every show entry.

**Alternatives Considered:**
- Computed: era overlap only — rejected; too broad, returns unrelated shows from the same century
- Manually curated `similarShows: string[]` in data — rejected for M005; editorial overhead not justified when computed is sufficient

### Watchlist deferred

**Decision:** F-16 ("Add to watchlist") is out of scope for M005. No button, no placeholder.

**Rationale:** No auth system exists. Rendering a disabled button would imply a feature that has no backend path yet. Watchlist belongs in a dedicated auth milestone.

**Alternatives Considered:**
- Placeholder UI button — rejected; a non-functional button that implies auth creates false affordance with no plan

### Per-show SEO metadata deferred

**Decision:** The timeline page's `?panel=` URL uses the generic page metadata (title, OG image). No per-show `generateMetadata` override in M005.

**Rationale:** Per-show metadata requires server-side reads on the timeline route and is the kind of SEO work explicitly scoped to M009. With nuqs query params, the page is client-rendered and Next.js does not automatically derive show-specific metadata from them.

**Alternatives Considered:**
- `generateMetadata` on the timeline page reading `?panel=` — rejected for M005; deferred to M009

---

> See `.gsd/DECISIONS.md` for the full append-only register of all project decisions.

## Error Handling Strategy

- **Missing poster image**: `posterUrl` values in `data/shows.ts` may be stubs. The panel renders a styled placeholder (era color + show title initials) when `posterUrl` is empty or fails to load. No broken image states.
- **Unknown slug**: If `?panel=<slug>` does not match any show ID, the panel silently does not open (no error UI). The param is ignored.
- **Empty similar shows**: If the algorithm returns zero results, the "Similar shows" section is hidden entirely — no empty state needed.
- **External links**: Platform and Wikipedia links open in `_blank` with `rel="noopener noreferrer"`. No validation of link health in M005.

## Risks and Unknowns

- `posterUrl` values may be placeholder/missing in `data/shows.ts` — graceful fallback is required and must be verified during implementation
- M005 depends on M002 (parallax timeline) and M003 (show cards) being interactive; the panel trigger point (show card click) does not exist until those milestones ship
- `motion` (Framer Motion v12) API for bottom sheet slide-up — the exact animation variant/gesture API should be confirmed against v12 docs before implementation

## Existing Codebase / Prior Art

- `types/index.ts` — `Show` interface with `historicalContext: LocalizedString`, `wikipediaUrl`, `historicalAccuracyScore`, `platforms`, `genres`, `regions` — all panel fields are already typed
- `lib/filters.ts` — composable predicate system for genre/region/platform matching; similar-shows algorithm can reuse the intersection logic established here (D003)
- `data/shows.ts` — the show dataset the panel reads from
- `designs/V5A-riftlight.html`, `designs/V5B-cinema.html` — visual design references for panel aesthetic

## Relevant Requirements

- F-12 — Historical synopsis panel (the primary deliverable of M005)
- F-13 — Wikipedia link (Show.wikipediaUrl already present)
- F-14 — Similar shows (computed via era + genre/region overlap)
- F-15 — Streaming platform links (Show.platforms already present)
- F-10 — Historical accuracy score (Show.historicalAccuracyScore already present)

## Scope

### In Scope

- Bottom sheet component driven by `?panel=<slug>` nuqs param
- Panel content: poster, title (bilingual), narrative years, historicalContext (bilingual), accuracy stars (1–5), platform links, Wikipedia link
- Similar shows section (computed: era overlap + genre/region match)
- Escape key and overlay click to close
- Focus trapping while panel is open; focus return to originating card on close
- Smooth open/close animation via `motion`
- Bilingual rendering via `next-intl`
- Unit tests for similar-shows algorithm

### Out of Scope / Non-Goals

- F-16 watchlist / auth — deferred entirely (no auth system exists)
- Per-show SEO metadata / OG tags — deferred to M009
- Dedicated `/[locale]/show/[slug]` route — not needed with nuqs approach
- Trailer playback (`trailerUrl` field exists in Show type but panel does not include a video player)
- Editing or rating shows

## Technical Constraints

- Next.js 16 App Router + React 19 — panel is a client component
- nuqs v2 for `?panel=` query param state
- motion v12 for animation — verify bottom sheet gesture API against v12 docs
- next-intl v4 for bilingual content
- Tailwind v4 for styling
- No new dependencies — all required libraries are already in `package.json`

## Integration Points

- `nuqs` — `useQueryState('panel')` drives open/close and deep-link
- `data/shows.ts` — source of all panel content
- `next-intl` — `useTranslations` + locale param for bilingual rendering
- `motion` — `AnimatePresence` + `motion.div` for slide-up/slide-down
- Show card component (M003) — click handler sets `?panel=<slug>`; receives focus on panel close

## Testing Requirements

- **Unit**: similar-shows algorithm — test era overlap logic, genre/region intersection, edge cases (show with no genre, empty dataset, show similar to itself excluded)
- **Unit**: panel renders all Show fields correctly for a given fixture show
- **Integration**: `?panel=<slug>` opens panel; removing param closes it
- **Behavioral**: Escape closes panel; overlay click closes panel; focus returns to card
- **Coverage**: similar-shows pure function at 100% branch coverage (per M001 precedent)

## Acceptance Criteria

**S01 — Bottom sheet detail panel:**
- Clicking a show card sets `?panel=<show.id>` and the bottom sheet animates up
- Panel displays: poster (or fallback), title in current locale, narrative years, historicalContext in current locale, accuracy stars, platform badges with external links, Wikipedia link
- Similar shows section renders ≥1 result for shows with overlapping era + genre/region matches
- Escape key closes panel; overlay backdrop click closes panel
- Focus is trapped inside panel while open; focus returns to the originating card on close
- URL with `?panel=<slug>` is shareable — opening it in a new tab renders the panel

**S02 — Deep link popin modal:**
*(Delivered as part of S01 via the nuqs approach — no separate slice needed unless the visual treatment for direct navigation differs from the bottom sheet)*

## Open Questions

- Should the panel have a distinct "modal" visual treatment when opened via direct URL navigation (vs. a click from the timeline), or is the same bottom sheet appropriate in both cases? — Current thinking: same component, same visual; the `?panel=` param is agnostic to how the user arrived
- Maximum number of "similar shows" to display — no limit decided yet; likely 3–5 cards; implement with a configurable constant
