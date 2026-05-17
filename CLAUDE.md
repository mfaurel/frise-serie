# Frise Série — Claude Code Guide

## Project

Interactive parallax historical timeline for discovering TV series by the era their story unfolds in. Users scroll a horizontal fresco from ~3000 BC to present and see shows anchored to their narrative period.

**Stack:** Next.js 14.2, Framer Motion 11 (useScroll/useTransform), Tailwind CSS 3, next-intl 3, nuqs (Phase 6+), static JSON (v1), Supabase (v2+)

**Planning:** `.planning/` — PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md, research/

## GSD Workflow

This project uses Get-Shit-Done (GSD) for structured development.

**Current state:** Project initialized. Ready for Phase 1.

**Next step:**
```
/gsd:discuss-phase 1
```
or skip discussion:
```
/gsd:plan-phase 1
```

**Check progress anytime:**
```
/gsd:progress
```

## Critical Constraints

- **yearToPixel()** is the load-bearing function — all card positions depend on it. Must be built and unit-tested in Phase 1 before any visual work.
- **BC dates** stored as plain INTEGER (negative = BC, direct negation: -52 = 52 BC, -1 = 1 BC). Never use JS `Date` objects or `Intl.DateTimeFormat` for historical years. Year 0 is a display-only edge case handled in `yearToDisplay()` — do not store 0 in show data.
- **RSC/client boundary** — show card *content* must be in SSR HTML (Server Component); parallax *transforms* live in a `'use client'` wrapper. Googlebot must see card content.
- **GPU layer budget** — never apply `will-change: transform` to all 100+ cards simultaneously. Only apply to currently-animated cards.
- **touch-action: pan-x** — required on the scroll container for iOS Safari. Invisible in DevTools emulation, only caught on physical hardware.
- **prefers-reduced-motion** — wrap all parallax transforms with Motion's `useReducedMotion()` from day one.

## Architecture Quick Reference

```
app/
  [locale]/           # next-intl locale routing
    page.tsx          # Timeline SSR shell (Server Component)
    show/[slug]/      # SSG show detail pages
components/
  Timeline.tsx        # 'use client' — scroll container + parallax layers
  EraBackground.tsx   # Era color bands + textures (inside Timeline)
  ShowCard.tsx        # 'use client' — card + Motion transforms
  DetailPanel.tsx     # 'use client' — slide-in panel
  FilterPanel.tsx     # 'use client' — region filter + search
  Navigation.tsx      # Era jump nav
data/
  shows.ts            # Static show dataset (TypeScript)
  eras.ts             # Era definitions with yearToPixel ratios
lib/
  yearToPixel.ts      # yearToPixel(year) + pixelToYear(px) — unit test this
  yearToDisplay.ts    # yearToDisplay(year, locale) — handles BC formatting
```

## State Ownership

- **Filter state, active show, search query** → URL search params via `nuqs` (`useQueryStates`)
- **Scroll position** → Motion value — never enters React state
- **No Zustand in v1** — nuqs handles all persistent state

## Phases

| # | Phase | Status |
|---|-------|--------|
| 1 | Data Foundation + yearToPixel | Not started |
| 2 | Parallax Engine + Era Backgrounds | Not started |
| 3 | Show Cards | Not started |
| 4 | Historical Events + Flashbacks | Not started |
| 5 | Detail Panel | Not started |
| 6 | Filters + Search + Navigation | Not started |
| 7 | Bilingual Routing + i18n | Not started |
| 8 | Mobile Polish + WCAG AA | Not started |
| 9 | Data Completion + SEO | Not started |

See `.planning/ROADMAP.md` for full success criteria per phase.
