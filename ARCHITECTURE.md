# Architecture Model — Frise Série MVP

## Deployment Model

**Target:** GitHub Pages (fully static)
**Build:** `next build` with `output: 'export'` → static HTML/CSS/JS
**No server at runtime:** no SSR, no API routes, no middleware, no edge functions

### Implications

| Feature | How it works on GitHub Pages |
|---------|------------------------------|
| Data | Static JSON imported at build time. No database. |
| i18n | `[locale]` path segment + `generateStaticParams`. Client-side redirect on `/`. No middleware. |
| URL state (filters, selected show) | nuqs reads/writes `searchParams` client-side after hydration |
| Auth, watchlist, CMS | **Deferred.** Not possible without a backend. |
| Images | Poster URLs from TMDB CDN. No Cloudinary. |

---

## Stack

| Layer | Package | Version | Why |
|-------|---------|---------|-----|
| Framework | Next.js | 16 | App Router, static export, RSC for build-time rendering |
| Animation | motion | 12 | `useScroll`, `useTransform` for parallax. Client component. |
| Styling | Tailwind CSS | v4 | Utility-first, dark mode via `class` strategy |
| i18n | next-intl | latest | Static export compatible with `[locale]` segments |
| URL state | nuqs | latest | Filter state in URL query params, shareable links |
| Linting | ESLint + Prettier | — | Standard Next.js config |
| Testing | Vitest | — | Unit tests for yearToPixel, data transforms |

**Rejected for MVP:** Zustand (nuqs + React state sufficient), Algolia (static data, client-side filter), Supabase (no backend), Cloudinary (direct TMDB URLs).

---

## Directory Structure

```
app/
  [locale]/
    layout.tsx          ← NextIntlClientProvider, locale fonts, metadata
    page.tsx            ← RSC shell: imports data, renders <ClientShell />
    show/
      [showId]/
        page.tsx        ← Deep-link to show detail (popin mode)
  layout.tsx            ← Root layout (html, body, globals.css)
  page.tsx              ← Root redirect: detect navigator.language → /fr or /en

components/
  Timeline.tsx          ← Main horizontal scroll container + parallax orchestration
  BackgroundLayer.tsx   ← Era gradient backgrounds (parallax slow layer)
  AxisLayer.tsx         ← Year markers, historical event pins
  ShowCardLayer.tsx     ← Positioned show cards (parallax fast layer)
  ShowCard.tsx          ← Individual card: poster, title, narrative span
  CardLayoutEngine.tsx  ← Collision detection: swim lanes vs stacking
  DetailBottomSheet.tsx ← Slide-up detail panel (primary)
  DetailPopin.tsx       ← Modal overlay (for shareable deep links)
  FilterPanel.tsx       ← Region, genre, platform, accuracy filters
  Navigation.tsx        ← Top bar: logo, era quick-jump, filter toggle, locale switch
  TimelineSkeleton.tsx  ← Loading skeleton (< 1s requirement)

data/
  shows.ts              ← Static show data (typed, ~50 shows for MVP)
  eras.ts               ← Era definitions: year ranges, color palettes, descriptions
  events.ts             ← Historical event markers with years
  density.ts            ← Precomputed density zones from show distribution

lib/
  yearToPixel.ts        ← Non-linear time → pixel mapping (data-driven density)
  pixelToYear.ts        ← Inverse mapping (for axis labels, click positioning)
  density.ts            ← Density computation: show count per era → px/year ratio
  filters.ts            ← Filter logic: predicate builders from nuqs state
  yearToDisplay.ts      ← Year formatting: "73 av. J.-C." / "73 BC"
  constants.ts          ← Timeline dimensions, breakpoints, parallax factors
  i18n/
    request.ts          ← next-intl getRequestConfig for static export
    routing.ts          ← Locale config, default locale, supported locales

messages/
  fr.json               ← French translations
  en.json               ← English translations

types/
  index.ts              ← Show, Era, HistoricalEvent, Genre, Region, Platform types

public/
  era-prompts.md        ← AI illustration prompts per era (for future asset generation)
```

---

## Component Architecture

### Rendering Boundary

```
RSC (build-time)                    Client ("use client")
─────────────────                   ─────────────────────
app/[locale]/page.tsx               components/ClientShell.tsx
  ↓ imports data                      ↓ owns scroll state
  ↓ passes as props                   ├── Timeline.tsx
                                      │   ├── BackgroundLayer.tsx  (parallax 0.3x)
                                      │   ├── AxisLayer.tsx        (parallax 0.6x)
                                      │   └── ShowCardLayer.tsx    (parallax 1.0x)
                                      │       ├── CardLayoutEngine
                                      │       └── ShowCard.tsx[]
                                      ├── FilterPanel.tsx
                                      ├── Navigation.tsx
                                      ├── DetailBottomSheet.tsx
                                      └── DetailPopin.tsx
```

**Why this split:** `page.tsx` is an RSC that imports JSON data at build time and passes it as serialized props to `ClientShell`. Everything interactive (scroll, parallax, filters, detail panel) is a client component. This keeps the static HTML meaningful for SEO while all interactivity hydrates client-side.

### Data Flow

```
[Static JSON] ──build──→ [RSC page.tsx] ──props──→ [ClientShell]
                                                       │
                                          ┌────────────┼────────────┐
                                          ▼            ▼            ▼
                                    [nuqs URL state] [scroll pos] [selected show]
                                     (filters)      (Motion ref)   (React state)
                                          │            │            │
                                          ▼            ▼            ▼
                                    FilterPanel    Timeline      BottomSheet
                                          │            │          or Popin
                                          └──filter──→ │
                                                       ▼
                                              ShowCardLayer
                                         (filtered + positioned)
```

### State Management

| State | Owner | Mechanism | Shareable via URL? |
|-------|-------|-----------|-------------------|
| Active filters | FilterPanel | nuqs `useQueryState` | Yes — `?region=europe_west&genre=medieval` |
| Selected show | ClientShell | nuqs `useQueryState` | Yes — `?show=vikings` |
| Scroll position | Timeline | Motion `useScroll` ref | No |
| Detail panel open | ClientShell | Derived from `selectedShow !== null` | Yes (via show param) |
| Detail mode (sheet vs popin) | ClientShell | Sheet = clicked from timeline. Popin = navigated via URL/link. | — |
| Locale | URL path | `[locale]` segment | Yes — `/fr/` vs `/en/` |

---

## yearToPixel — Data-Driven Density

The core mapping function. Density adjusts based on show concentration per era.

### Algorithm

```
1. Count shows per era (from static data)
2. Compute base density: totalPixels / totalYears
3. For each era, compute weight = max(1, showCount / avgShowCount)
4. Scale px/year per era by weight (capped at min/max to prevent extreme compression/expansion)
5. Accumulate pixel offsets: each era starts where the previous one ends
6. Within an era, interpolate linearly
```

### Interface

```typescript
interface DensityZone {
  eraId: string;
  yearStart: number;
  yearEnd: number;
  pxPerYear: number;
  pixelStart: number;   // accumulated offset
  pixelEnd: number;
}

function buildDensityZones(shows: Show[], eras: Era[], totalWidth: number): DensityZone[];
function yearToPixel(year: number, zones: DensityZone[]): number;
function pixelToYear(px: number, zones: DensityZone[]): number;
```

**Zones are computed once at mount** (or at build time) from the full show dataset. They change only when filters change (filtered-out shows reduce density in their era).

---

## i18n — Static Export Setup

### Routing

```
/           → client-side redirect to /fr or /en (navigator.language)
/fr/        → French timeline
/en/        → English timeline
/fr/show/vikings  → French detail popin for Vikings
/en/show/vikings  → English detail popin for Vikings
```

### Configuration

```typescript
// next.config.mjs
export default {
  output: 'export',
  trailingSlash: true,  // GitHub Pages needs trailing slashes
  images: { unoptimized: true },  // No image optimization API on static host
};
```

```typescript
// app/[locale]/layout.tsx
export function generateStaticParams() {
  return [{ locale: 'fr' }, { locale: 'en' }];
}
```

No `createMiddleware` — impossible on static export. Locale detection is client-only on the root page.

---

## Performance Budget

| Metric | Target | Strategy |
|--------|--------|----------|
| First paint | < 1s | TimelineSkeleton renders immediately, data is inlined at build |
| JS bundle | < 150 KB gzipped | Tree-shake Motion (import only useScroll/useTransform), no Zustand |
| Parallax 60fps | Always | CSS transform only, `will-change: transform` on layers, no layout thrashing |
| Show card render | < 16ms per card | Virtualize off-screen cards (only render cards within viewport ± buffer) |
| Filter response | < 100ms | Client-side predicate filtering, no network |

### Virtualization Strategy

With ~50 shows (MVP) virtualization is optional. At 150+ shows (Phase 9), implement a viewport-aware renderer:
- Track scroll position via `useScroll`
- Compute visible pixel range: `[scrollLeft - buffer, scrollLeft + viewportWidth + buffer]`
- Only render ShowCards whose `yearToPixel` falls within range
- Use `content-visibility: auto` as progressive enhancement

---

## GitHub Pages Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: out }
      - uses: actions/deploy-pages@v4
```

`basePath` in next.config if deployed to `username.github.io/frise-serie/` (not root).

---

## Security Considerations

| Risk | Mitigation |
|------|-----------|
| No secrets to leak | Fully static, no API keys, no backend |
| XSS via show data | Data is build-time JSON, not user input. Sanitize any future community contributions before build. |
| Deep link injection | nuqs validates query params against expected types |
| TMDB poster URLs | Loaded via `<img>` with `loading="lazy"`, no `dangerouslySetInnerHTML` |

---

## Migration Path (Post-MVP)

| Phase | Change | Architecture Impact |
|-------|--------|-------------------|
| Phase 2 (accounts) | Add Supabase Auth + DB | Move to Vercel hosting, add API routes, remove `output: 'export'` |
| Phase 2 (search) | Client-side search sufficient at 150 shows | Add Fuse.js or similar. Algolia only if 500+ shows. |
| Phase 3 (community) | User-generated content needs moderation | Supabase required. CMS optional (admin UI vs direct DB). |
| Phase 9 (150+ shows) | Virtualization becomes mandatory | Implement viewport-aware card renderer |
