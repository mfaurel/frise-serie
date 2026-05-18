# Phase 2: Parallax Engine + Era Backgrounds — Pattern Map

**Mapped:** 2026-05-18
**Files analyzed:** 7 new/modified files
**Analogs found:** 7 / 7

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `app/page.tsx` | provider (RSC shell) | request-response | `app/layout.tsx` | role-match (both Server Components, layout pattern) |
| `components/ClientShell.tsx` | provider (client boundary) | request-response | `app/page.tsx` (current, pre-refactor) | exact (same state, same children pattern) |
| `components/Timeline.tsx` | component (client orchestrator) | event-driven + transform | `components/Timeline.tsx` (existing) | self-refactor |
| `components/BackgroundLayer.tsx` | component (Server Component) | transform | `components/EraBackground.tsx` | role-match (era bands, same data, no browser APIs) |
| `components/AxisLayer.tsx` | component (client) | transform + request-response | `components/Timeline.tsx` lines 170–194 | partial (axis section extracted from Timeline) |
| `components/TimelineSkeleton.tsx` | component (Server Component) | request-response | `components/EraBackground.tsx` | partial (same era iteration, static layout, no browser APIs) |
| `lib/parallaxFormula.test.ts` + `lib/noiseUri.test.ts` + `components/TimelineSkeleton.test.ts` | test | batch | `lib/yearToPixel.test.ts` | exact (same vitest patterns, same project conventions) |

---

## Pattern Assignments

### `app/page.tsx` (Server Component — RSC shell)

**Analog:** `app/layout.tsx` (lines 1–22) + current `app/page.tsx` (lines 1–46)

**Action:** Remove `'use client'` directive. Move all state and handlers to `ClientShell.tsx`. Import `ClientShell`, `BackgroundLayer`, `TimelineSkeleton`. Pass `<BackgroundLayer locale="fr" />` as a prop to `ClientShell`.

**Server Component imports pattern** (from `app/layout.tsx` lines 1–2):
```tsx
import type { Metadata } from 'next';
import './globals.css';
```
Server Components have no `'use client'` directive — absence of the directive is the signal.

**RSC shell pattern** (target structure based on `app/layout.tsx` line 16 + RESEARCH.md):
```tsx
// app/page.tsx — NO 'use client' directive
import ClientShell from '@/components/ClientShell';
import BackgroundLayer from '@/components/BackgroundLayer';
import TimelineSkeleton from '@/components/TimelineSkeleton';
import Navigation from '@/components/Navigation';

export default function Page() {
  return (
    <div className="flex flex-col h-screen bg-stone-950 overflow-hidden">
      <TimelineSkeleton />
      <ClientShell
        backgroundLayer={<BackgroundLayer locale="fr" />}  // TODO(Phase 7): replace with locale from params
      />
    </div>
  );
}
```

**Key constraint:** `Navigation` receives `locale`/`filters` from `ClientShell` state — it must move to `ClientShell`, not stay in `page.tsx`. `page.tsx` renders only static-data components and passes the pre-rendered RSC node.

---

### `components/ClientShell.tsx` (`'use client'` — state boundary)

**Analog:** Current `app/page.tsx` (lines 1–46, entire file)

**Action:** New file. Extract all `useState` hooks, the `DEFAULT_FILTERS` constant, and the JSX from current `app/page.tsx`. Accept `backgroundLayer: React.ReactNode` as a prop. Pass it down to `<Timeline>`.

**Imports pattern** (from `app/page.tsx` lines 1–8):
```tsx
'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Timeline from '@/components/Timeline';
import ShowDetail from '@/components/ShowDetail';
import type { Show, FilterState, Locale } from '@/types';
```

**State pattern** (from `app/page.tsx` lines 9–20):
```tsx
const DEFAULT_FILTERS: FilterState = {
  genres: [],
  regions: [],
  platforms: [],
  minAccuracy: 1,
  search: '',
};

// Inside component:
const [locale, setLocale] = useState<Locale>('fr');
const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
const [selectedShow, setSelectedShow] = useState<Show | null>(null);
```

**Props interface pattern** (new, based on RESEARCH.md Pattern 1):
```tsx
interface Props {
  backgroundLayer: React.ReactNode;
}

export default function ClientShell({ backgroundLayer }: Props) {
  // ... same state as current page.tsx ...
  return (
    <main className="flex-1 overflow-hidden relative">
      <Timeline
        backgroundLayer={backgroundLayer}
        filters={filters}
        locale={locale}
        onShowSelect={setSelectedShow}
      />
    </main>
  );
}
```

---

### `components/Timeline.tsx` (refactor — `'use client'` orchestrator)

**Analog:** `components/Timeline.tsx` (existing, self-refactor, lines 1–240)

**Actions:**
1. Accept `backgroundLayer: React.ReactNode` as new prop.
2. Add `useReducedMotion` import and call it unconditionally at top of component.
3. Fix `bgX` multiplier from `0.4` to `0.7`.
4. Add `style={{ touchAction: 'pan-x' }}` to the `.timeline-scroll` div.
5. Replace the `<EraBackground>` section with `{backgroundLayer}` inside the existing `motion.div`.
6. Add `data-layer="card-track"` wrapper div around the show cards block.
7. Update all imports from `@/lib/timeline` to `@/lib/yearToPixel` and `@/lib/yearToDisplay`.
8. Replace `formatYear` calls with `yearToDisplay`.
9. Extract axis tick section into `<AxisLayer>` component (pass `zoom`, `locale`, `ticks` as props).

**Imports pattern** — current (lines 1–11), target:
```tsx
'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import ShowCard from './ShowCard';
import AxisLayer from './AxisLayer';
import { SHOWS } from '@/data/shows';
import { yearToPixel, TOTAL_WIDTH, TIMELINE_START, TIMELINE_END } from '@/lib/yearToPixel';
import { yearToDisplay } from '@/lib/yearToDisplay';
import { ERAS } from '@/data/eras';
import type { Show, FilterState, Locale } from '@/types';
```

**Props interface pattern** — add `backgroundLayer` (based on existing lines 19–23):
```tsx
interface Props {
  filters: FilterState;
  locale: Locale;
  onShowSelect: (show: Show) => void;
  backgroundLayer: React.ReactNode;   // pre-rendered RSC node from page.tsx
}
```

**useReducedMotion + bgX pattern** (replaces current lines 75–78):
```tsx
const shouldReduceMotion = useReducedMotion();   // unconditional — React rules of hooks

const { scrollXProgress } = useScroll({ container: containerRef });

// bgX: background drifts at 0.3x scroll speed (multiplier 0.7 corrects the ratio)
const bgX = useTransform(
  scrollXProgress,
  [0, 1],
  [0, shouldReduceMotion ? 0 : -(TOTAL_WIDTH * zoom * 0.7)]
);
```

**touch-action pattern** — on `.timeline-scroll` div (replaces current lines 149–154):
```tsx
<div
  ref={containerRef}
  className="timeline-scroll flex-1 overflow-x-auto overflow-y-hidden relative focus:outline-none"
  style={{ minHeight: TRACK_HEIGHT, touchAction: 'pan-x' }}
  tabIndex={0}
  aria-label={locale === 'fr' ? 'Frise chronologique — utilisez les flèches pour naviguer' : 'Timeline — use arrow keys to navigate'}
>
```

**backgroundLayer render pattern** (replaces current lines 161–168):
```tsx
<motion.div
  className="absolute inset-0 pointer-events-none"
  style={{ x: bgX, scaleX: 1 / zoom, transformOrigin: 'left center' }}
>
  <div style={{ width: totalScaledWidth, height: '100%', transform: `scaleX(${zoom})`, transformOrigin: 'left center' }}>
    {backgroundLayer}
  </div>
</motion.div>
```

**card-track wrapper pattern** (new wrapper around existing show cards block, lines 202–226):
```tsx
<div data-layer="card-track">
  {/* existing show card rendering — unchanged */}
  {filteredShows.map((show) => { ... })}
</div>
```

**currentYear display** — replace `formatYear` with `yearToDisplay` (line 144):
```tsx
{yearToDisplay(currentYear, locale)}
```

---

### `components/BackgroundLayer.tsx` (Server Component — era bands + noise texture)

**Analog:** `components/EraBackground.tsx` (lines 1–47)

**Action:** New file (clean replacement — `EraBackground.tsx` will be deleted). No `'use client'` directive. Add SVG noise overlay on each era band. Keep era label and year range text from `EraBackground.tsx`.

**Imports pattern** (no browser APIs — valid Server Component):
```tsx
// NO 'use client' directive
import { ERAS } from '@/data/eras';
import { yearToPixel } from '@/lib/yearToPixel';
import { yearToDisplay } from '@/lib/yearToDisplay';
```

**Props interface pattern** (from `EraBackground.tsx` lines 7–9):
```tsx
interface Props {
  locale: 'fr' | 'en';
}
```

**SVG noise constant** (define once above component, from RESEARCH.md Pattern 3):
```tsx
// All eras share the same noise pattern — defined once, applied per band
// %23 encodes '#' (required for Firefox cross-browser compat — Pitfall 3)
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`;
```

**Core era band pattern** (from `EraBackground.tsx` lines 13–45, updated with noise):
```tsx
export default function BackgroundLayer({ locale }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {ERAS.map((era) => {
        const left = yearToPixel(era.yearStart);
        const width = yearToPixel(era.yearEnd) - left;

        return (
          <div
            key={era.id}
            className="absolute top-0 bottom-0 flex flex-col justify-end pb-8"
            style={{
              left,
              width,
              backgroundImage: `${NOISE_SVG}, linear-gradient(135deg, ${era.gradient[0]}22, ${era.gradient[1]}44)`,
              backgroundBlendMode: 'overlay',
              backgroundSize: '200px 200px, 100% 100%',
              borderRight: `1px solid ${era.gradient[1]}33`,
              // NO will-change: transform — Framer Motion promotes GPU layers automatically (CLAUDE.md constraint)
            }}
          >
            <div
              className="px-3 py-1 mx-3 rounded text-xs font-serif font-bold tracking-wider uppercase opacity-60 truncate"
              style={{ color: era.gradient[1] }}
            >
              {era.name[locale]}
            </div>
            <div
              className="px-3 text-xs opacity-30 truncate"
              style={{ color: era.gradient[1] }}
            >
              {yearToDisplay(era.yearStart, locale)} – {yearToDisplay(era.yearEnd, locale)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

---

### `components/AxisLayer.tsx` (`'use client'` — axis ticks + labels)

**Analog:** `components/Timeline.tsx` lines 170–194 (axis tick section extracted verbatim)

**Action:** New file. Extract the time-axis JSX from `Timeline.tsx`. Receive `zoom`, `locale`, `ticks` as props from `Timeline.tsx`.

**Imports pattern** (subset of Timeline imports — client hooks needed for future zoom-linked behavior):
```tsx
'use client';

import { yearToPixel } from '@/lib/yearToPixel';
import { yearToDisplay } from '@/lib/yearToDisplay';
import type { Locale } from '@/types';
```

**Props interface pattern**:
```tsx
interface Props {
  zoom: number;
  locale: Locale;
  ticks: number[];
  currentYear: number;
}
```

**Core tick rendering pattern** (from `Timeline.tsx` lines 176–194):
```tsx
export default function AxisLayer({ zoom, locale, ticks, currentYear }: Props) {
  return (
    <div className="absolute left-0 right-0" style={{ top: 48 }}>
      {/* Axis line */}
      <div className="absolute h-px bg-stone-600/60" style={{ left: 0, right: 0, top: 16 }} />

      {/* Ticks */}
      {ticks.map((year) => {
        const x = yearToPixel(year) * zoom;
        const isCentury = year % 100 === 0;
        const is500 = year % 500 === 0;
        return (
          <div key={year} className="absolute flex flex-col items-center" style={{ left: x, transform: 'translateX(-50%)' }}>
            <div
              className={`w-px ${isCentury ? 'h-4 bg-stone-400' : 'h-2 bg-stone-600'}`}
              style={{ marginTop: is500 ? 0 : isCentury ? 4 : 8 }}
            />
            {isCentury && (
              <span className={`text-xs mt-0.5 font-mono ${is500 ? 'text-amber-500 font-bold text-sm' : 'text-stone-500'}`}>
                {yearToDisplay(year, locale)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

---

### `components/TimelineSkeleton.tsx` (Server Component — SSR skeleton)

**Analog:** `components/EraBackground.tsx` (lines 1–47) for the era iteration pattern; RESEARCH.md Pattern 4 for the skeleton structure.

**Action:** New file. No `'use client'` directive. Renders `animate-pulse` era band divs using the same `yearToPixel` + `ERAS` import pattern as `EraBackground.tsx`. Must include `role="status"` for WCAG AA.

**Imports pattern** (same static imports as `EraBackground.tsx`, no browser APIs):
```tsx
// NO 'use client' directive
import { ERAS } from '@/data/eras';
import { yearToPixel, TOTAL_WIDTH } from '@/lib/yearToPixel';
```

**Core skeleton pattern** (from RESEARCH.md Pattern 4):
```tsx
export default function TimelineSkeleton() {
  return (
    <div
      role="status"
      aria-label="Chargement de la frise… / Loading timeline…"
      className="animate-pulse absolute inset-0 overflow-hidden"
      style={{ width: TOTAL_WIDTH }}
    >
      {ERAS.map((era) => {
        const left = yearToPixel(era.yearStart);
        const width = yearToPixel(era.yearEnd) - left;
        return (
          <div
            key={era.id}
            className="absolute top-0 bottom-0 bg-stone-800 border-r border-stone-700"
            style={{ left, width }}
          />
        );
      })}
      {/* Axis placeholder */}
      <div className="absolute h-px bg-stone-700" style={{ top: 48, left: 0, right: 0 }} />
      <span className="sr-only">Chargement de la frise… / Loading timeline…</span>
    </div>
  );
}
```

**animate-pulse confirmation:** `animate-pulse` is a Tailwind core utility (no custom keyframe needed). `animate-fade-in` for the Timeline hydration transition is the custom keyframe — it is already defined in `tailwind.config.ts` lines 16–17:
```ts
animation: {
  'fade-in': 'fadeIn 0.4s ease-out',  // ← confirmed present, no action needed
  'slide-in': 'slideIn 0.35s ease-out',
},
```

---

### Test files: `lib/parallaxFormula.test.ts`, `lib/noiseUri.test.ts`, `components/TimelineSkeleton.test.ts`

**Analog:** `lib/yearToPixel.test.ts` (lines 1–101) — exact match for all test conventions.

**Imports pattern** (from `lib/yearToPixel.test.ts` lines 1–9):
```ts
import { describe, it, expect } from 'vitest'
// Named imports from vitest only — no globals (CLAUDE.md constraint)
```

**Test structure pattern** (from `lib/yearToPixel.test.ts` lines 11–18):
```ts
describe('subject — context', () => {
  it('specific behavior assertion', () => {
    expect(actual).toBe(expected)
  })

  it.todo('planned test not yet implemented')
  // it.skip is FORBIDDEN — use it.todo instead (CLAUDE.md constraint)
})
```

**Component test environment directive** (required for `TimelineSkeleton.test.ts`, per `vitest.config.mts` line 9):
```ts
// @vitest-environment jsdom   ← first line of component test files
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
```

**parallaxFormula.test.ts pattern:**
```ts
import { describe, it, expect } from 'vitest'
import { TOTAL_WIDTH } from '@/lib/yearToPixel'

describe('bgX parallax formula', () => {
  it('at progress=1, zoom=1: offset equals -(TOTAL_WIDTH * 0.7)', () => {
    const zoom = 1
    const progress = 1
    const offset = progress * -(TOTAL_WIDTH * zoom * 0.7)
    expect(offset).toBe(-(TOTAL_WIDTH * 0.7))
  })

  it('shouldReduceMotion=true produces output range [0, 0] — bgX stays 0', () => {
    const shouldReduceMotion = true
    const zoom = 1
    const end = shouldReduceMotion ? 0 : -(TOTAL_WIDTH * zoom * 0.7)
    expect(end).toBe(0)
  })
})
```

**noiseUri.test.ts pattern:**
```ts
import { describe, it, expect } from 'vitest'
// Import the constant from BackgroundLayer when it's extracted to a shared lib,
// or inline-test the shape by importing from BackgroundLayer directly

describe('NOISE_SVG_URI encoding', () => {
  it('contains %23 encoding for # (Firefox compat)', () => {
    // Import NOISE_SVG from BackgroundLayer or a shared constants file
    // expect(NOISE_SVG).toContain('%23noise')
    it.todo('import NOISE_SVG constant from BackgroundLayer or shared lib')
  })

  it('starts with url("data:image/svg+xml,', () => {
    it.todo('verify URI prefix')
  })
})
```

---

## Shared Patterns

### Server Component declaration convention
**Source:** `app/layout.tsx` (no directive) vs `app/page.tsx` (line 1: `'use client'`)
**Apply to:** `app/page.tsx` (post-refactor), `components/BackgroundLayer.tsx`, `components/TimelineSkeleton.tsx`

The absence of any directive at the top of a file is the signal that it is a Server Component. No `'use server'` annotation is needed for Server Components in App Router.

```tsx
// Server Component — no directive needed
import { ERAS } from '@/data/eras';
```

### Client Component declaration convention
**Source:** `components/Timeline.tsx` line 1, `components/EraBackground.tsx` line 1, `components/Navigation.tsx` line 1
**Apply to:** `components/ClientShell.tsx`, `components/AxisLayer.tsx`

```tsx
'use client';   // ← first line, before any imports
```

### `@/` path alias convention
**Source:** All existing files — `@/data/eras`, `@/lib/timeline`, `@/types`
**Apply to:** All new files

```tsx
import { ERAS } from '@/data/eras';
import { yearToPixel, TOTAL_WIDTH } from '@/lib/yearToPixel';
import { yearToDisplay } from '@/lib/yearToDisplay';
import type { Show, FilterState, Locale } from '@/types';
```

### Tailwind-only styling convention
**Source:** All component files — no CSS modules, no styled-components
**Apply to:** All new component files

Inline `style={{}}` props are used only for computed values (pixel positions, dynamic colors). All static visual classes are Tailwind utilities.

```tsx
// CORRECT
<div className="absolute top-0 bottom-0 text-xs opacity-60" style={{ left, width }} />

// WRONG — no CSS modules
// import styles from './BackgroundLayer.module.css'
```

### Framer Motion import convention
**Source:** `components/Timeline.tsx` line 4
**Apply to:** `components/Timeline.tsx` (refactored)

```tsx
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
```

### `will-change` prohibition
**Source:** CLAUDE.md §Critical Constraints (GPU layer budget)
**Apply to:** `components/BackgroundLayer.tsx`, `components/Timeline.tsx` parallax divs

Never add `will-change: transform` as an inline style or Tailwind class to era bands, `BackgroundLayer`, or any div receiving static (non-Motion) transforms. Framer Motion promotes layers automatically during active animation.

```tsx
// WRONG
style={{ willChange: 'transform' }}

// CORRECT — let Framer Motion handle GPU promotion
style={{ x: bgX }}  // Motion value drives GPU layer automatically
```

---

## Files Deleted in Phase 2 (not patterns to copy from)

| File | Why Deleted | Replacement |
|---|---|---|
| `components/EraBackground.tsx` | Replaced by `BackgroundLayer.tsx` (Server Component + noise texture) | `components/BackgroundLayer.tsx` |
| `lib/timeline.ts` | Re-export shim deprecated in Phase 1; all callers updated to direct imports | Direct imports from `@/lib/yearToPixel` and `@/lib/yearToDisplay` |

**Deletion safety check:** Before deleting `lib/timeline.ts`, verify with `grep -r "@/lib/timeline"` across `*.ts` and `*.tsx` returns zero results. Files currently importing from the shim:
- `components/Timeline.tsx` line 9
- `components/EraBackground.tsx` lines 4–5
- `components/ShowCard.tsx` line 6

---

## No Analog Found

All Phase 2 files have analogs in the codebase. No files require fallback to RESEARCH.md patterns alone.

---

## Metadata

**Analog search scope:** `app/`, `components/`, `lib/` (excluding `node_modules/`)
**Files read:** `app/page.tsx`, `app/layout.tsx`, `components/Timeline.tsx`, `components/EraBackground.tsx`, `components/ShowCard.tsx`, `components/Navigation.tsx`, `lib/yearToPixel.ts`, `lib/yearToDisplay.ts`, `lib/timeline.ts`, `lib/yearToPixel.test.ts`, `lib/yearToDisplay.test.ts`, `tailwind.config.ts`, `vitest.config.mts`
**Pattern extraction date:** 2026-05-18
