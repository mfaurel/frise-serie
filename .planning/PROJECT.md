# Frise Série — Historical Series Timeline

## What This Is

An interactive parallax timeline that lets users discover major eras of human history through TV series. Users scroll a horizontal fresco from Antiquity to the present day and see shows anchored to the period their story unfolds in. Built for a public audience curious about history through fiction — from binge-watchers looking for what to watch tonight, to teachers seeking classroom-ready cultural references.

## Core Value

The parallax scroll experience: an immersive, visually rich fresco where era backgrounds and show cards move at different depths, making history feel alive — and 100+ shows placed with historically accurate dates so the discovery is trustworthy.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Horizontal scrollable timeline from ~3000 BC to present, with non-linear time scale (denser around era-rich periods)
- [ ] Multi-layer parallax: era backgrounds (slow) + timeline axis + show cards (fast)
- [ ] Major historical eras color-coded in background with illustrative textures
- [ ] Historical event markers at key moments (Fall of Rome, French Revolution, etc.)
- [ ] Show cards placed at story start year (not broadcast year), with narrative span indicator
- [ ] Show card displays: poster, title, narrative years, streaming platforms
- [ ] Historical accuracy score (1–5 editorial rating)
- [ ] Side panel / modal with historical synopsis, Wikipedia link, similar shows, streaming links
- [ ] Filters: geographic region, streaming platform, genre, historical accuracy score
- [ ] Text search by title or historical figure
- [ ] Bilingual FR/EN interface
- [ ] Responsive mobile (native horizontal swipe)
- [ ] Accessible WCAG AA (contrast, keyboard nav, ARIA)
- [ ] Flashback support: primary placement + badge linking to another era
- [ ] 100+ shows with accurate historical placement at launch
- [ ] Progressive loading (timeline skeleton < 1s)

### Stretch Goals (post-launch)

- User accounts (email + OAuth Google/Apple)
- Personal watchlist with "Watched / Watching / To Watch" states
- Recommendations based on watched shows
- Community contribution (suggest shows, correct dates, contextual comments)
- "Available in my country" filter with geolocation
- CMS back-office for editorial team

### Out of Scope (v1)

- Films (movies) — series only
- Podcasts, books, video games
- User rating stars (accuracy score is editorial, not crowdsourced)
- Native mobile app (PWA is sufficient)
- Monetization / display ads
- Real-time streaming availability API (manual/weekly updates)

## Context

- **Existing codebase**: There's an initial scaffold (Next.js + Tailwind + Framer Motion) with timeline components. User wants to start from scratch — the PRD is the source of truth, not the existing code.
- **Tech stack**: Open to revision. PRD proposed Next.js 14, Framer Motion, Tailwind CSS, Supabase, Algolia/Supabase FTS, Vercel. Stack will be informed by research.
- **Data**: ~16 example shows in PRD; need to reach 100+ with accurate historical dates for launch.
- **Bilingual**: FR/EN from day one (next-intl proposed).
- **Author**: Michael Faurel (Michael.FAUREL@esante.gouv.fr)

## Constraints

- **Tech**: Stack is open — research should validate or replace PRD choices before planning begins
- **Data quality**: 100+ shows minimum at launch with historically accurate narrative dates
- **Accessibility**: WCAG AA is a hard requirement, not a nice-to-have
- **Performance**: Timeline skeleton must appear < 1s; parallax must be smooth on mobile

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Start from scratch (ignore existing scaffold) | User wants a clean foundation rather than polishing a prototype | — Pending |
| User accounts as post-launch stretch goal | Ship the discovery experience fast; accounts slow v1 down | — Pending |
| Tech stack open for research | PRD stack was a first pass; research should validate choices | — Pending |
| Story year placement (not broadcast year) | Defines the whole value prop — users orient by historical period | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-17 after initialization*
