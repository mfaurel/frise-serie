# Technical Decisions — Frise Serie

Every technology choice documented with rationale, alternatives considered, and tradeoffs accepted.

---

## 1. Framework — Next.js 16

**Choice:** Next.js 16 (App Router, `output: 'export'` for MVP)

**Why:**
- App Router provides React Server Components (RSC) for build-time data injection — show data is embedded in static HTML, zero runtime fetch.
- `output: 'export'` generates a fully static site deployable to GitHub Pages with zero server infrastructure.
- When the project moves to Phase 2 (user accounts, Supabase), removing `output: 'export'` unlocks SSR, API routes, and middleware without a framework migration.
- `generateStaticParams` handles the `[locale]` segment naturally.

**Alternatives considered:**
| Alternative | Why rejected |
|-------------|-------------|
| Vite + React | Lighter for SPA, but migrating to Next.js for Phase 2 SSR is painful. Next.js is an investment in the migration path. |
| Astro | Great for static content sites, but the heavy client interactivity (parallax, filters, scroll-driven animations) means most of the page is a React island anyway — Astro's value proposition diminishes. |
| Remix | Requires a server runtime; no static export equivalent. |

**Tradeoff accepted:** We pay for framework weight (~85 KB baseline) whose main value (server rendering) is disabled in MVP. Worth it for the zero-friction upgrade path.

---

## 2. Animation — Motion 12

**Choice:** Motion 12 (the `motion/react` package, formerly Framer Motion)

**Why:**
- `useScroll` + `useTransform` are purpose-built for scroll-driven parallax — the project's core interaction.
- Hardware-accelerated CSS transforms only (`transform: translate3d`), no layout-triggering properties.
- `useReducedMotion` hook for accessibility (WCAG requirement).
- Tree-shakeable: importing only `useScroll`, `useTransform`, `motion` keeps the bundle under 20 KB gzipped.

**Alternatives considered:**
| Alternative | Why rejected |
|-------------|-------------|
| CSS `scroll-timeline` | Native performance is excellent, but browser support is incomplete (no Safari stable as of July 2026). Would need a JS fallback anyway, doubling the code. |
| GSAP + ScrollTrigger | More powerful for complex choreography, but the license (Club GreenSock for commercial use) adds friction, and the API is imperative rather than declarative React. |
| Lenis + custom transforms | Lenis handles smooth scrolling well, but we'd still need a transform orchestration layer. Motion does both. |
| No library (raw `IntersectionObserver` + CSS) | Sufficient for fade-in reveals, but inadequate for continuous parallax factor mapping (`scrollProgress -> translateY`). |

**Performance contract:**
- All animated properties: `transform` and `opacity` only — never `top`, `left`, `width`, `height`.
- `will-change: transform` on parallax layers, removed after initial scroll.
- 60fps budget: each frame must complete in < 16ms.

---

## 3. Styling — Tailwind CSS v4

**Choice:** Tailwind CSS v4 (CSS-first configuration)

**Why:**
- v4's CSS-based config (`@theme` in CSS) replaces `tailwind.config.js` — simpler, faster builds.
- Utility-first approach matches component-per-file React architecture.
- Dark mode via `class` strategy — the V5-atlas-editorial design is dark-first, light mode is a future addition.
- Design tokens (colors, spacing, typography) defined once in CSS custom properties, consumed by both Tailwind utilities and raw CSS where needed.

**Alternatives considered:**
| Alternative | Why rejected |
|-------------|-------------|
| CSS Modules | Good encapsulation but verbose for responsive + state variants. Tailwind's `md:` / `hover:` / `group-*` utilities are more productive. |
| Styled Components / Emotion | Runtime CSS-in-JS adds bundle weight and hydration cost. The industry has moved away from runtime CSS-in-JS for performance reasons. |
| vanilla-extract | Zero-runtime, type-safe CSS — excellent, but the learning curve and tooling setup don't justify it for a project this size. |
| UnoCSS | Faster builds, but smaller ecosystem. Tailwind v4 closed the build-speed gap significantly. |

**Design token mapping:**
The V5-atlas-editorial palette will be mapped to Tailwind's `@theme`:
```css
@theme {
  --color-void: #050510;
  --color-void-light: #0a0a1f;
  --color-star-gold: #f5e6c8;
  --color-star-gold-dim: #f5e6c840;
  --color-text-primary: #e8e0d4;
  --color-text-secondary: #9a9486;
  --color-text-muted: #5a554e;
}
```

---

## 4. URL State — nuqs

**Choice:** nuqs 2.9 for all shareable client state

**Why:**
- Every filter combination produces a unique URL: `?region=europe_west&genre=medieval&show=vikings`. Users can share, bookmark, and deep-link into any view.
- `useQueryState` is a drop-in replacement for `useState` that syncs to the URL.
- Works with Next.js App Router and static export — no server-side parsing needed.
- Replaces Zustand entirely for MVP: the only state is filters + selected show, both URL-encodable.

**Alternatives considered:**
| Alternative | Why rejected |
|-------------|-------------|
| Zustand | Powerful but in-memory only — URLs wouldn't reflect state, breaking shareability (a core UX requirement from US-03). |
| React `useState` + manual `URLSearchParams` | Works but error-prone: manual sync, missing type safety, no debouncing. nuqs handles this correctly. |
| TanStack Router search params | Requires TanStack Router — we're on Next.js App Router. |
| Jotai with URL atoms | Possible but more abstraction than needed; nuqs is purpose-built for this exact use case. |

**State ownership:**
| State | Mechanism | In URL? |
|-------|-----------|---------|
| Filters (region, genre, platform, accuracy) | nuqs `useQueryState` | Yes |
| Selected show | nuqs `useQueryState` | Yes |
| Scroll position | Motion `useScroll` ref | No |
| Locale | `[locale]` path segment | Yes |
| Detail panel open | Derived from `selectedShow !== null` | Yes (implicit) |

---

## 5. i18n — next-intl

**Choice:** next-intl 4.13 with `[locale]` path segments

**Why:**
- Official Next.js i18n solution for App Router.
- `generateStaticParams` produces `/fr/` and `/en/` at build time — clean URLs, good SEO.
- Message extraction to `messages/fr.json` / `messages/en.json` — familiar workflow.
- No middleware needed for static export (middleware is impossible on GitHub Pages).

**Locale detection strategy:**
- Root `/` page does a client-side redirect based on `navigator.language`.
- `<meta http-equiv="refresh" content="0; url=/fr/">` as a no-JS fallback (prevents blank page if JS fails).
- Default locale: `fr` (primary audience is French-speaking).

**Alternatives considered:**
| Alternative | Why rejected |
|-------------|-------------|
| react-i18next | Battle-tested but heavier runtime; next-intl integrates more naturally with App Router's static generation. |
| Paraglide (inlang) | Compile-time i18n with zero runtime — promising, but ecosystem is young and fewer Next.js examples. |
| Manual JSON + React Context | Works but reinvents routing, pluralization, and date formatting that next-intl handles. |

---

## 6. Testing — Vitest

**Choice:** Vitest 4.1

**Why:**
- Native ESM support — matches Next.js 16's module system.
- Fast execution with Vite's transform pipeline.
- Jest-compatible API — low learning curve.
- Priorities for testing: `yearToPixel` / `pixelToYear` inverse mapping, density zone computation, filter predicate logic, year display formatting (BC dates).

**Alternatives considered:**
| Alternative | Why rejected |
|-------------|-------------|
| Jest | Slower, requires more ESM configuration with Next.js 16. |
| Playwright | Overkill for unit tests; will be added for E2E in Phase 2. |
| Testing Library + Vitest | React Testing Library will be added for component tests, but core logic (yearToPixel) is pure functions — Vitest alone suffices for MVP. |

---

## 7. Hosting — GitHub Pages (MVP) -> Vercel (Phase 2+)

**Choice:** GitHub Pages for MVP, Vercel for post-MVP

**Why GitHub Pages for MVP:**
- Zero cost, zero configuration for a static site.
- `next build` with `output: 'export'` outputs to `out/` — upload directly via GitHub Actions.
- Sufficient for a site with no backend, no auth, no API routes.

**Limitations accepted:**
| Limitation | Mitigation |
|-----------|-----------|
| No server-side redirects | Client-side redirect on root `/` page + `<meta http-equiv="refresh">` |
| No custom headers (CSP, cache) | Acceptable for MVP; TMDB images are external, no sensitive data |
| 100 MB repo size soft limit | Static JSON + poster URLs (not embedded images) keeps repo small |
| No edge functions / geolocation | Country availability filter deferred to Phase 2 |

**Migration to Vercel (Phase 2):**
- Remove `output: 'export'` from `next.config.mjs`.
- Add Supabase Auth + API routes.
- Enable middleware for locale detection + auth redirects.
- Add Vercel Analytics.

---

## 8. Data — Static JSON (MVP)

**Choice:** TypeScript files in `data/` exporting typed arrays, imported at build time by RSC.

**Why:**
- ~50 shows for MVP — a JSON file is simpler than any database.
- Build-time import means zero runtime data fetching.
- Type safety via TypeScript interfaces.
- Easy to edit, review in PRs, and version in git.

**Migration path:**
| Phase | Data source |
|-------|------------|
| MVP | Static TypeScript files in `data/` |
| Phase 2 (150+ shows) | Supabase PostgreSQL — shows table, editorial CMS |
| Phase 2+ | TMDB API for poster URLs + metadata enrichment |

---

## 9. Typography — Instrument Serif + Space Grotesk

**Choice:** Google Fonts, loaded via `next/font/google` for self-hosting.

| Font | Role | Why |
|------|------|-----|
| Instrument Serif | Headlines, era initials, show titles in detail cards | Editorial/atlas feel, elegant serifs that match the "premium visual magazine" goal |
| Space Grotesk | Body text, UI labels, navigation, filters | Clean geometric sans-serif, excellent legibility at small sizes, pairs well with Instrument Serif |

**Why `next/font/google`:**
- Self-hosts fonts at build time — no external requests to Google Fonts at runtime.
- Automatic `font-display: swap` — text renders immediately with fallback, swaps when font loads.
- Subset optimization — only Latin + Latin Extended characters.

---

## 10. Image Strategy — TMDB CDN Direct

**Choice:** Direct `<img>` tags pointing to TMDB's image CDN (`image.tmdb.org`).

**Why:**
- TMDB provides multiple poster sizes (`w185`, `w342`, `w500`, `w780`, `original`).
- No image processing infrastructure needed.
- `loading="lazy"` for off-screen posters.
- `next/image` with `unoptimized: true` (no Image Optimization API on static export).

**Tradeoff accepted:** No WebP/AVIF conversion or responsive `srcset` generation. TMDB serves JPEG. For MVP with ~50 shows, this is acceptable. Phase 2 can add Cloudinary or Vercel Image Optimization.

---

## 11. Layout Decision — Horizontal Scroll with Atlas Aesthetic (Option B)

**Choice:** Horizontal-scroll parallax timeline (from architecture) with V5-atlas-editorial visual language.

**Rationale:**
- The horizontal timeline is the project's identity — the PRD describes a "fresque" (fresco) and the `yearToPixel` density algorithm only makes sense on a horizontal axis.
- The V5-atlas-editorial design's visual language (dark void palette, star-gold accents, constellation lines, nebula gradients, Instrument Serif typography) will be applied as the skin.
- Constellation lines between shows sharing tags/themes will be ported from the design — they add a discovery layer not in the original architecture.
- Sidebar era navigation from the design will be adapted as a quick-jump overlay on desktop.

**What we keep from V5-atlas-editorial:**
- Color palette (void/star-gold/nebula)
- Typography (Instrument Serif + Space Grotesk)
- Star-node glow effect for show cards
- Constellation lines (shared-tag connections)
- Nebula gradients per era
- Detail card design (floating near card, glassmorphism)

**What we keep from the architecture:**
- Horizontal scroll as primary interaction
- 3-layer parallax (background, axis, cards)
- `yearToPixel` non-linear density mapping
- Narrative span bars (shows stretching across years)
- nuqs-driven filter panel
- Bottom sheet detail panel (replaces floating card for mobile)

---

## 12. Filter Density Behavior — Soft Collapse (Option 3)

**Choice:** Hybrid soft-collapse when filters reduce visible shows.

**Behavior:**
- Eras with visible shows: keep their computed `yearToPixel` width unchanged.
- Eras with zero visible shows: collapse to a minimum width (200px) showing the era name + "No shows match your filters" message.
- Transition: animated width change over 400ms with easing.
- Scroll position is adjusted to keep the user's viewport anchored to the same show they were looking at.

**Why not full recompute:** Everything shifts, the user loses spatial memory. Confusing when toggling filters on/off.

**Why not fully stable:** Heavy filtering (e.g., "only Asia") would leave huge empty stretches of European eras, wasting screen space.

---

## 13. BC Date Handling

Negative years represent BC dates. The `yearToDisplay` function formats them:

| Internal | FR display | EN display |
|----------|-----------|-----------|
| -73 | 73 av. J.-C. | 73 BC |
| -3000 | 3000 av. J.-C. | 3000 BC |
| 0 | Ier s. | 1st c. |
| 1492 | 1492 | 1492 |

**No year zero:** The project follows the historical convention (1 BC -> 1 AD, no year 0). `yearToPixel` handles this internally.

---

## 14. Accessibility

| Requirement | Implementation |
|-------------|---------------|
| WCAG AA contrast | Dark theme palette verified: star-gold on void = 11.2:1 ratio |
| Keyboard navigation | Arrow keys for timeline scroll, Tab for card focus, Enter for detail, Escape to close |
| Reduced motion | `useReducedMotion` from Motion: disables parallax, replaces scroll animations with instant transitions |
| Screen reader | ARIA labels on era sections, show cards, filter controls. Timeline is `role="region"` with `aria-label` |
| Focus management | Detail panel traps focus when open, returns focus to card on close |

---

## 15. Performance Budget

| Metric | Target | Strategy |
|--------|--------|----------|
| First paint | < 1s | Skeleton renders immediately, data inlined at build |
| JS bundle | < 150 KB gzipped | Tree-shake Motion, no Zustand, no heavy deps |
| Parallax | 60fps | CSS transform only, `will-change: transform`, no layout thrashing |
| Card render | < 16ms | Viewport-aware rendering at 150+ shows (MVP has ~50, optional) |
| Filter response | < 100ms | Client-side predicate, no network |
| Font load | < 200ms | Self-hosted via `next/font`, subset to Latin |

---

*Document version 1.0 — 2026-07-26*
*Author: Michael Faurel + Claude*
