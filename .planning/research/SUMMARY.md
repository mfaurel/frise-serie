# Research Summary: Frise Serie Historical Series Timeline

Synthesized: 2026-05-17
Sources: STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md
Overall confidence: HIGH

---

## Executive Summary

Frise Serie is an interactive horizontal parallax timeline positioning TV series by narrative year, serving history enthusiasts, teachers, and binge-watchers. Core challenges: GPU-smooth multi-layer parallax on mobile, a non-linear time scale compressing sparse ancient periods while expanding dense modern ones, and bilingual (FR/EN) SEO keeping show content in SSR HTML despite heavy client-side animation.

Recommended v1: static JSON files, client-side filtering via fuse.js + nuqs URL state, zero infrastructure, sub-100ms filters, full SSG for SEO. Motion (motion/react) useScroll + useTransform, three layers, fixed speed ratios only. No spring physics in Phase 1. Supabase + Payload CMS deferred to Phase 2.

Highest-risk items: (1) yearToPixel non-linear scale function is the mathematical foundation for all card positions; an error cascades everywhere. (2) RSC/client component boundary: show card content must appear in SSR HTML or the product is invisible to Google, but the scroll container must be use-client. Both must be designed in Phase 1A to prevent a costly rewrite.

---

## 1. Recommended Stack

| Layer | Technology | Version | Key Decision |
|-------|-----------|---------|-------------|
| Framework | Next.js | 16.2.6 | App Router + React 19.2; Turbopack stable. Do NOT use v14. |
| Animation | motion (fka framer-motion) | 12.38.0 | Import from motion/react. useScroll + useTransform for parallax. |
| Styling | Tailwind CSS | 4.3.0 | CSS-first config. Start on v4 not v3. |
| URL/filter state | nuqs | latest | All filter state in URL params; shareable links; no Zustand in v1. |
| Client search | fuse.js | latest | ~24 KB; handles 150 records sub-5ms. Replace with Supabase FTS in v2. |
| i18n | next-intl | 4.12.0 | FR-primary, /fr and /en prefix routing. Type-safe keys. |
| Image CDN | Next.js Image + Vercel | built-in | Free zero-config. Cloudinary not justified at this scale. |
| Database | Supabase (PostgreSQL) | 2.105.4 | v1: JSON files. Promote to Supabase in v2. |
| CMS | Payload CMS | 3.84.1 | Phase 2 only. Installs directly into Next.js /app folder. |
| Hosting | Vercel | current | First-party Next.js support; free tier covers early traffic. |
| State (v2+) | Zustand | 5.0.13 | Not needed in v1; add when watchlist/auth cannot live in URL. |

Rejected from PRD:
- Algolia: overkill for 100-500 records; Supabase FTS is sufficient and free
- Cloudinary: Next.js built-in handles WebP/resize at no cost on Vercel
- CSS scroll-timeline as primary parallax: Firefox unsupported as of May 2026
- Next.js 14: two major versions behind; start on 16

---

## 2. Table Stakes

All must ship in Phase 1.

| # | Feature | Why Non-Negotiable |
|---|---------|-------------------|
| 1 | Horizontal parallax timeline (3 layers) | The entire product is this experience |
| 2 | Show cards at narrative year: poster, title, years, platform badge | Users trained by Netflix/JustWatch to recognise shows by poster |
| 3 | Narrative span bar | Shows difference between a 2-year story and a 400-year dynasty |
| 4 | Era colour-coding + background textures | Spatial anchor for 5000-year navigation |
| 5 | Era-jump sticky navigation | Users cannot scroll 5000 years to find medieval shows |
| 6 | Historical accuracy score on card | Core differentiator from a Wikipedia list |
| 7 | Side panel: historical context, Wikipedia link, streaming links | Converts discovery to watch intent |
| 8 | Filter by era and by platform | Primary navigation intent for all personas |
| 9 | Shareable era-anchored URL | Teachers need this from day one; US-03 user story |
| 10 | Mobile touch swipe + peeking right-edge affordance | 60%+ traffic is mobile; non-negotiable |
| 11 | Bilingual FR/EN | French-primary audience; core requirement |
| 12 | prefers-reduced-motion fallback | WCAG AA; legal risk in France (RGAA) |
| 13 | Keyboard navigation (arrow keys) | WCAG AA; also the power-user pattern |
| 14 | Skeleton loading under 1s | Users abandon if nothing renders in 1s |
| 15 | ARIA labels on scroll region and cards | WCAG AA; teachers (P3) are accessibility-dependent |

Defer to Phase 2: text + historical figure search, dark/light mode, trailer links, event markers on axis.
Defer to Phase 3: user accounts + watchlist, classroom mode, geolocation streaming, community suggestions.

---

## 3. Critical Path

Each step gates the next.

Step 1  TypeScript interfaces (Show, HistoricalEra, HistoricalEvent from PRD section 7)
  |
Step 2  data/eras.json (year ranges, colour palettes, pixel density ratios)
  |
Step 3  lib/yearToPixel.ts + lib/pixelToYear.ts  -- HARDEST PIECE: unit-test before wiring --
  |
Step 4  data/shows.json (20-30 seed shows spanning full time range)
  |
Step 5  TimelineRoot + TimelineScrollContainer (scroll mechanics; no parallax yet)
         Verify on desktop AND physical iOS Safari before proceeding
  |
Step 6  EraBackground + TimeAxis (colour bands positioned by yearToPixel)
  |
Step 7  ParallaxLayer + ShowCardTrack (3-layer; 0.3x bg / 1.0x axis+cards)
  |
Step 8  ShowCard (poster, title, accuracy badge, narrative span bar)
  |
Step 9  ShowDetailPanel (dynamic import; slide-in drawer; nuqs ?show=slug)
  |
Step 10 FilterBar + nuqs URL state (era, platform filters; fuse.js search)
  |
Step 11 next-intl: setRequestLocale() in every layout BEFORE useTranslations()
  |
Step 12 SEO: generateStaticParams + generateMetadata for /[locale]/show/[slug]
Step 13 SkeletonTimeline, reduced-motion fallback, keyboard nav, ARIA audit

Safe to parallelise: yearToDisplay BC/AD utility, messages key skeleton, show data entry once schema stable.

---

## 4. Watch Out For

### 1. Animating layout properties instead of transforms (CRITICAL)
top/left/margin/background-position triggers reflow on every scroll event. At 100+ cards: 10-20 fps on mobile.
Rule: animate only transform translateX/Y and opacity. Chrome DevTools Performance: zero Layout bars during scroll.

### 2. BC date year zero off-by-one (CRITICAL)
1 BC = year 0 in astronomical numbering; node-postgres has serialisation bugs. Round-trip of -73 can silently return -72.
Rule: plain INTEGER column. Convention: 0=1BC, -1=2BC. Write yearToDisplay(year, locale); never use Intl.DateTimeFormat for historical years. Unit-test years 0, -1, -72, -584 before data entry.

### 3. yearToPixel discontinuities at era boundaries (CRITICAL)
If scale function and era data define boundaries separately they drift: visual gaps, cards in wrong era.
Rule: boundaries once in eras.json; yearToPixel derived programmatically. Property test: pixelToYear(yearToPixel(y)) === y for all years in range.

### 4. SEO black hole: show content in use client (HIGH)
If timeline + cards are Client Component, Googlebot sees empty skeleton, zero shows indexed.
Rule: RSC composition pattern day one. Scroll container is use-client; card content is Server Component children. Verify with curl Googlebot.

### 5. touch-action conflict on iOS (HIGH)
Without touch-action: pan-x, iOS Safari sends pointercancel for diagonal touches making timeline nearly unswipeable.
Rule: touch-action: pan-x + overscroll-behavior-x: contain. height: 100dvh. Physical iPhone test required.

Moderate: GPU layer explosion (will-change on 2-3 bg layers only); next-intl setRequestLocale first; missing sizes on card images; parallax scope creep.

---

## 5. Open Questions

| # | Question | Deadline | Impact |
|---|---------|---------|--------|
| 1 | Non-linear scale calibration: pixelsPerYear per era? | Before Step 3 | All card positions wrong if changes post-data-entry |
| 2 | Total fresco width (px for 5000-year span)? | Before Step 5 | Scroll container height wrong |
| 3 | Sticky-vertical vs native horizontal scroll? Sticky-vertical recommended; switching is a rebuild. | Before Step 5 | Scroll container is the root component |
| 4 | Seed data scope: 20-show dev minimum vs 100+ launch? | Before Step 4 | Data entry blocks launch date |
| 5 | Accuracy score rubric: what does 1/5 mean vs 5/5? | Before show data entry | Core differentiator inconsistent |
| 6 | Flashback badge Phase 1 or 2? Requires flashbacks[] in model; migration needed post-launch. | Before Step 1 | Schema locked once seed data entered |
| 7 | Text search Phase 1 or 2? FEATURES says Phase 2; ARCHITECTURE includes fuse.js in Phase 1 bundle. | Before Step 10 | FilterBar scope differs significantly |

---

## 6. Roadmap Implications

### Phase Structure

Phase 1: The Timeline (foundation + core UX)
SEO-ready, bilingual, WCAG AA parallax timeline with 20-100 shows. No accounts, no DB, no CMS.
- 1A: Data foundation: interfaces, JSON seed, yearToPixel, yearToDisplay
- 1B: Timeline skeleton: scroll container, era bands, parallax layers
- 1C: Show cards + detail panel
- 1D: Filters + bilingual routing
- 1E: Production quality: SSG/SEO, skeletons, keyboard nav, WCAG audit
Research flag: yearToPixel and RSC + parallax composition need design before implementation.

Phase 2: Discovery Layer
Text + historical figure search, Supabase DB migration, event markers, dark/light mode, Payload CMS, trailer links. No auth.
Research flag: Supabase Auth + next-intl middleware chaining has known conflicts.

Phase 3: Community + Personalisation
Accounts, watchlist, classroom mode, community suggestions, geolocation streaming.
Research flag: streaming availability API needs a dedicated spike before Phase 3 planning.

### Research Flags by Phase

| Phase | Needs Spike | Skip (well-documented) |
|-------|------------|------------------------|
| Phase 1 | yearToPixel math; RSC + parallax composition | next-intl setup; nuqs; Motion useScroll |
| Phase 2 | Supabase Auth + next-intl middleware | Supabase FTS SQL (STACK.md); Payload v3 |
| Phase 3 | Streaming availability API; Supabase RLS | Supabase Auth (done Phase 2) |

### Anti-Features
Never build: user ratings, comments, social feed, pagination, list-view toggle, algorithmic recs, native app, user-editable dates.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack choices | HIGH | All versions verified npm + official docs |
| Parallax via Motion useScroll | HIGH | Docs verified; CSS scroll-driven rejected on confirmed Firefox gap |
| Non-linear scale | MEDIUM | Pattern clear; calibration values are design decision not yet made |
| Supabase FTS bilingual | HIGH | SQL verified in official Supabase docs |
| Mobile touch iOS Safari | HIGH | touch-action confirmed; physical device testing mandatory |
| Feature scope | HIGH | NN/G research, JustWatch/Letterboxd analogues, PRD alignment |
| Phase 2 auth middleware | MEDIUM | Known conflict flagged; needs research before Phase 2 |

Gaps: scale calibration values, total fresco width, Phase 1 show count, accuracy rubric.

---

## Sources

- Next.js 16: https://nextjs.org/blog/next-16
- Motion useScroll: https://motion.dev/docs/react-use-scroll
- CSS scroll-driven support: https://caniuse.com/wf-scroll-driven-animations
- Tailwind v4: https://tailwindcss.com/blog/tailwindcss-v4
- Supabase FTS: https://supabase.com/docs/guides/database/full-text-search
- Payload CMS v3: https://payloadcms.com/posts/blog/payload-30-the-first-cms-that-installs-directly-into-any-nextjs-app
- next-intl: https://next-intl.dev/docs/getting-started/app-router
- nuqs: https://nuqs.dev/
- Chrome performant parallaxing: https://developer.chrome.com/blog/performant-parallaxing
- node-postgres BC date bug: https://github.com/brianc/node-postgres/pull/1864
- touch-action MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
- WCAG 2.1 SC 2.3.3: https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
- NN/G Horizontal Scrolling: https://www.nngroup.com/articles/horizontal-scrolling/
- GPU Animation: https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/