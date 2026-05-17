# Technology Stack

**Project:** Frise Série — Historical Series Timeline
**Researched:** 2026-05-17
**Overall confidence:** HIGH (all critical choices verified with current npm versions, official docs, and multiple sources)

---

## Verdict on PRD Proposal

| PRD Choice | Verdict | Change |
|------------|---------|--------|
| Next.js 14 | REPLACE | Upgrade to Next.js 16 (current stable) |
| Framer Motion | KEEP with rename | Now published as `motion` (same library, rebranded) |
| Tailwind CSS | KEEP with version | Upgrade to v4 (CSS-first, 5x faster builds) |
| Zustand | KEEP | v5 is stable and well-suited |
| PostgreSQL / Supabase | KEEP | Solid BaaS choice for this scale |
| Algolia | REPLACE | Supabase FTS is sufficient for ≤500 records; Algolia cost not justified |
| Supabase Auth | DEFER to stretch goal | Auth is post-launch per PROJECT.md |
| Payload CMS | KEEP | v3 installs directly into Next.js App folder — no separate server |
| Cloudinary | REPLACE | Vercel's built-in `<Image>` optimization is free and zero-config for this scale |
| Vercel | KEEP | Optimal for Next.js |
| next-intl | KEEP | v4 is the clear winner for App Router FR/EN routing |

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Next.js | 16.2.6 | Full-stack React framework | Current stable LTS (released Oct 2025). App Router + React 19.2. Turbopack stable by default (5-10x faster HMR). Built-in `use cache` directive replaces manual revalidation. `generateStaticParams` enables static generation of 150+ show pages for SEO. PPR (Partial Prerendering) lets timeline shell render instantly while card data streams in. **Do not start on 14.** |
| React | 19.2 (via Next.js 16) | UI layer | Bundled with Next.js 16. React Compiler is stable — automatic memoization eliminates most manual `useMemo`/`useCallback` on filter-heavy components. |

### Animation & Parallax

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| motion (fka framer-motion) | 12.38.0 | Parallax, transitions, gestures | Rebranded from `framer-motion`. Import from `motion/react`. `useScroll` + `useTransform` is the standard pattern for multi-layer parallax: track a container ref's `scrollXProgress`, map it to different `x` translation ranges per layer (slow for backgrounds, fast for cards). Automatically uses browser's native ScrollTimeline API for GPU-accelerated, jank-free scroll sync when available. Spring physics give the "floating card" feel naturally. |
| CSS scroll-driven animations | Native (Chrome 115+, Safari 26+, Firefox pending) | Accent animations only | **Do NOT use as primary parallax mechanism.** Firefox support is still absent as of May 2026. Safari 26 added support but iOS 26 is not yet majority traffic. Use CSS scroll-driven animations only for non-critical decorative effects (era label fade-ins). Core three-layer parallax must use Motion's JS path for cross-browser reliability. |

**Parallax architecture decision:** Use `useScroll({ container: timelineRef })` with `scrollXProgress`, then three `useTransform` calls mapping 0→1 scroll to different pixel ranges:
- Layer 1 (era backgrounds): `useTransform(scrollXProgress, [0, 1], [0, -totalWidth * 0.3])`
- Layer 2 (axis/events): `useTransform(scrollXProgress, [0, 1], [0, -totalWidth * 0.7])`
- Layer 3 (show cards): direct scroll (1:1, no transform needed)

All transforms use `transform` CSS property → GPU-accelerated, no layout thrash.

### Styling

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Tailwind CSS | 4.3.0 | Utility-first CSS | v4 is a breaking change from v3 but the right starting point for a greenfield project. CSS-first config (`@theme` directive in CSS instead of `tailwind.config.js`). Automatic content detection — no `content[]` array to maintain. Built-in Lightning CSS compiler — full rebuilds 5x faster, incremental builds 100x faster. `color-mix()` and `@property` support unlock era color palette transitions natively. Dark/light mode as first-class. **Start on v4, do not start on v3.** |

### State Management

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Zustand | 5.0.13 | Client-side filter + UI state | v5 uses React 18's `useSyncExternalStore` for concurrent-safe updates. Selector-based subscriptions prevent re-renders on unrelated state changes — critical when 100+ cards are displayed and filters change. Minimal boilerplate for: `activeFilters`, `searchQuery`, `selectedShowId`, `scrollPosition`. **Do not use React Context or Redux** for this — Context causes full tree re-renders on every filter change. |
| TanStack Query | 5.100.10 | Server state / data fetching cache | Not in PRD but recommended. Supabase data calls from client components (filter results, show detail fetch) benefit from query-level caching, background refetch, and suspense integration. Pairs with Zustand cleanly: Zustand owns UI state, TanStack owns server state. |

### Database & Backend

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Supabase (PostgreSQL) | @supabase/supabase-js 2.105.4 | Primary database + Auth + Storage | PostgreSQL with full FTS, JSONB, PostGIS support. Relational model is correct for this data (shows → eras → events → platforms with FK constraints). Free tier: 500MB DB, 1GB storage — sufficient for 150 shows + poster URLs. Pro: $25/month. Auth and Storage bundled when stretch goals land. Row-level security for future user watchlists. |

**Important Supabase FTS configuration for bilingual data:**
```sql
-- Combined tsvector for FR+EN search
ALTER TABLE shows ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('french', coalesce(title_fr, '')) ||
    to_tsvector('english', coalesce(title_en, '')) ||
    to_tsvector('simple', coalesce(array_to_string(historical_figures, ' '), ''))
  ) STORED;

CREATE INDEX shows_search_idx ON shows USING GIN(search_vector);
```
French `tsvector` correctly handles accents, stemming (séries → série), and stopwords. `simple` config for proper nouns (historical figure names) prevents incorrect stemming.

### Search

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Supabase FTS (PostgreSQL) | — | Title + historical figure search | **Algolia is overkill and costs money for this scale.** At 100–500 records, Supabase's built-in `textSearch()` with a GIN-indexed tsvector column returns results in <10ms. French + English language configs handle bilingual queries correctly. Typo tolerance can be added with `pg_trgm` trigram similarity if needed. **Use Algolia or Meilisearch only if** search relevance feedback shows FTS is insufficient after launch — treat as a stretch goal optimization. |

**Why not Meilisearch:** Requires a separate service to host/manage. Complexity cost is not justified for 500 records. Revisit at 5,000+ records or if faceted search on multiple dimensions proves slow.

**Why not Algolia:** $0 for first 10K records/10K searches, but vendor lock-in, API cost uncertainty at scale, and added SDK complexity for a feature Supabase already covers.

### CMS

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Payload CMS | 3.84.1 | Editorial show data management | v3 installs directly into the Next.js `/app` folder — no separate server, no Docker, no API layer. Code-first TypeScript schema definitions give end-to-end type safety: Payload collection types flow directly into Next.js Server Components with zero manual interface duplication. Admin panel available at `/admin`. Self-hosted in the same Vercel deployment. Collections map directly to PRD data model: `Shows`, `HistoricalEras`, `HistoricalEvents`. **Defer Payload for Phase 2** (stretch goal per PRD roadmap) — Phase 1 uses JSON seed data. **Why not Directus:** Requires separate Docker container. **Why not Sanity:** External SaaS with per-seat pricing; Payload self-hosted is free. |

### i18n

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| next-intl | 4.12.0 | FR/EN routing and translations | Highest benchmark score of all Next.js i18n libraries. Native App Router support with Server Components. Locale-based routing via `[locale]` segment (`/fr/...`, `/en/...`). Type-safe message keys. ICU message syntax for plurals and variables. Works with `generateStaticParams` to statically generate all locale variants of show pages for SEO. In Next.js 16, the middleware file is renamed `proxy.ts` — next-intl v4 accounts for this. |

### Image Handling

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Next.js `<Image>` + Vercel CDN | Built-in | Poster image optimization | **Replace Cloudinary.** Vercel's built-in image optimization handles WebP/AVIF conversion, responsive `srcset`, lazy loading, and edge CDN delivery with zero configuration and zero added cost (generous free tier). For 150 show posters with basic crop/resize needs, this covers 100% of requirements. Cloudinary at $89/month is unjustified. **Only add Cloudinary if** you need AI cropping, focal-point transformations, or video delivery — none of which are in scope. |

### Hosting & Infrastructure

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Vercel | — | Hosting + edge functions | Optimal for Next.js — first-party support, Turbopack integration, PPR support. Edge functions handle future geolocation filtering (streaming availability by country). Free tier handles early traffic; Pro at $20/month when needed. |

---

## Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@tanstack/react-query` | 5.100.10 | Server state cache | Client-side data fetching (filter results, show detail) |
| `motion` | 12.38.0 | Parallax + UI animations | Replace any `framer-motion` imports with `motion/react` |
| `next-intl` | 4.12.0 | i18n | All user-facing string translations |
| `zustand` | 5.0.13 | Filter/UI state | `activeFilters`, `selectedShowId`, `searchQuery` |
| `@supabase/supabase-js` | 2.105.4 | DB client | All database queries |
| `payload` | 3.84.1 | CMS (Phase 2) | Editorial show management UI |

---

## What to Keep vs Change from PRD

### Keep (validated)

- **Next.js App Router** — correct choice; upgrade from 14 to 16
- **Framer Motion** — correct; install as `motion` not `framer-motion`
- **Tailwind CSS** — correct; start on v4 not v3
- **Zustand** — correct; v5 is the stable release
- **Supabase PostgreSQL** — correct for relational show data
- **Vercel hosting** — correct
- **next-intl** — correct; v4 is current

### Change

| PRD Choice | Replacement | Reason |
|------------|-------------|--------|
| Next.js 14 | **Next.js 16** | 14 is two major versions behind; 16 is current LTS with Turbopack stable, React 19.2, PPR |
| `framer-motion` package | **`motion` package** | Same library, rebranded; import from `motion/react`; `framer-motion` still works but is the legacy name |
| CSS `scroll-timeline` as primary | **Motion `useScroll` as primary** | CSS scroll-driven animations lack Firefox support as of May 2026; use CSS scroll-driven only for non-critical decorative effects |
| Algolia | **Supabase FTS** | 100-500 records does not justify external search service; Postgres GIN index + tsvector is sub-10ms at this scale; add Algolia/Meilisearch post-launch if needed |
| Cloudinary | **Next.js `<Image>` + Vercel CDN** | No transformation needs beyond WebP/resize; Vercel handles this free; Cloudinary at $89/month is not justified |
| Tailwind v3 | **Tailwind v4** | Greenfield project — start on current version; CSS-first config is cleaner; 5x build speed |

### Defer (post-launch)

- **Supabase Auth** — Correct to defer; user accounts are stretch goal per PROJECT.md
- **Payload CMS** — Phase 2 per PRD roadmap; Phase 1 uses JSON seed data
- **Algolia/Meilisearch** — Revisit if Supabase FTS proves insufficient after launch

---

## Accessibility Stack Implications

The WCAG AA requirement directly impacts animation choices:

1. **`prefers-reduced-motion`** — wrap all Motion animations:
   ```tsx
   const prefersReduced = useReducedMotion(); // Motion hook
   const parallaxOffset = prefersReduced ? 0 : calculatedOffset;
   ```

2. **Horizontal scroll keyboard navigation** — the timeline container must have `tabIndex={0}` and respond to `ArrowLeft`/`ArrowRight` keys. Screen readers need visible focus and ARIA labels on scrollable region.

3. **Motion's `useReducedMotion` hook** — built-in, returns `true` when OS motion reduction is set. Use to disable parallax layers and revert to flat scroll.

4. **Contrast** — Tailwind v4's `color-mix()` integration aids era color palette generation while preserving contrast ratios. Target APCA Lc 60+ for body text on era backgrounds.

---

## Installation

```bash
# Core framework
npx create-next-app@latest frise-serie --typescript --tailwind --app --turbopack

# Animation
npm install motion

# State
npm install zustand @tanstack/react-query @tanstack/react-query-devtools

# i18n
npm install next-intl

# Database
npm install @supabase/supabase-js @supabase/ssr

# CMS (Phase 2 only — do not install until Phase 2)
# npm install payload
```

**Note on Tailwind:** `create-next-app` with `--tailwind` installs v4. No additional config — the new CSS-first setup is handled automatically.

---

## Alternatives Considered and Rejected

| Category | Recommended | Rejected | Reason Rejected |
|----------|-------------|----------|-----------------|
| Framework | Next.js 16 | Remix, Astro | Remix has no native SSG for 150+ show pages; Astro has weaker React ecosystem for complex interactive state |
| Animation | Motion (useScroll) | GSAP ScrollTrigger | GSAP requires paid license for commercial use; Motion is MIT |
| Animation | Motion (useScroll) | Pure CSS scroll-driven | Firefox still lacks support (May 2026) — too risky for public site |
| Search | Supabase FTS | Algolia, Meilisearch, Typesense | Scale does not justify added service; revisit post-launch |
| Image CDN | Vercel built-in | Cloudinary ($89/mo), Imgix | No custom transformation needs; Vercel free tier covers all use cases |
| CMS | Payload v3 | Sanity, Directus, Contentful | Sanity = external SaaS; Directus = separate Docker server; Contentful = expensive |
| State | Zustand | Redux Toolkit, Jotai | Redux = too much boilerplate; Jotai = atom model less natural for filter sets |
| i18n | next-intl | next-i18next, Lingui | next-i18next = Pages Router legacy; Lingui = compile step complexity unnecessary for 2 locales |
| DB | Supabase | Neon, PlanetScale | Neon = DB-only (no auth/storage bundled for stretch goals); PlanetScale = $34/mo minimum, no free tier |

---

## Confidence Levels

| Area | Confidence | Basis |
|------|------------|-------|
| Next.js 16 recommendation | HIGH | Official Next.js release blog + version log + npm verification |
| Motion parallax approach | HIGH | Official motion.dev docs + npm version verification |
| Tailwind v4 | HIGH | Official tailwindcss.com release blog + npm version verification |
| Supabase FTS for FR/EN | HIGH | Official Supabase docs confirming `to_tsvector('french', ...)` and PGroonga extension |
| Algolia rejection at this scale | HIGH | Multiple comparative analyses, pricing pages verified |
| Payload v3 Next.js integration | HIGH | Official Payload docs + multiple corroborating sources |
| CSS scroll-driven for Firefox | HIGH | caniuse.com confirmed Firefox unsupported May 2026 |
| Safari 26 CSS scroll support | MEDIUM | WebKit blog confirmed in Safari 26 / iOS 26, but adoption timeline is uncertain |
| Zustand v5 performance | HIGH | Official GitHub + multiple implementation guides |
| next-intl v4 stability | HIGH | npm verified 4.12.0, official docs up to date |
| Vercel image vs Cloudinary | MEDIUM | Comparative analysis articles; no direct benchmark run |

---

## Sources

- [Next.js 16 release blog](https://nextjs.org/blog/next-16)
- [Next.js upgrading to v16 guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Motion (Framer Motion rebranded) — official site](https://motion.dev/)
- [Motion useScroll docs](https://motion.dev/docs/react-use-scroll)
- [Motion scroll animations](https://motion.dev/docs/react-scroll-animations)
- [CSS scroll-driven animations — caniuse](https://caniuse.com/wf-scroll-driven-animations)
- [WebKit Safari 26 scroll-driven animations](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/)
- [Tailwind CSS v4.0 release](https://tailwindcss.com/blog/tailwindcss-v4)
- [Supabase Full Text Search docs](https://supabase.com/docs/guides/database/full-text-search)
- [Supabase PGroonga multilingual](https://supabase.com/docs/guides/database/extensions/pgroonga)
- [Supabase pricing](https://supabase.com/pricing)
- [Payload 3.0 Next.js native CMS announcement](https://payloadcms.com/posts/blog/payload-30-the-first-cms-that-installs-directly-into-any-nextjs-app)
- [next-intl App Router setup](https://next-intl.dev/docs/getting-started/app-router)
- [Meilisearch vs Algolia vs Typesense comparison](https://www.meilisearch.com/blog/algolia-vs-typesense)
- [Zustand v5 guide](https://dev.to/vishwark/mastering-zustand-the-modern-react-state-manager-v4-v5-guide-8mm)
- [WCAG horizontal scrolling accessibility](https://cerovac.com/a11y/2024/02/consider-accessibility-when-using-horizontally-scrollable-regions-in-webpages-and-apps/)
