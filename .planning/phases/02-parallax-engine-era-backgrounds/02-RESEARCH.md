# Phase 2: Parallax Engine + Era Backgrounds — Research

**Researched:** 2026-05-18
**Domain:** Framer Motion 11, Next.js 14.2 RSC boundaries, SVG feTurbulence, Lighthouse FCP
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Page Architecture**
- D-01: `app/page.tsx` converted to Server Component (remove `'use client'`)
- D-02: All interactive state (locale, filters, selectedShow) moves to `components/ClientShell.tsx`; page.tsx renders `<ClientShell />` as only client boundary
- D-03: `ClientShell.tsx` manages `locale` via `useState` default `'fr'`
- D-04: `TimelineSkeleton` is a Server Component (`components/TimelineSkeleton.tsx`) — rendered directly in SSR HTML path, no Suspense needed, uses static ERAS import

**Timeline.tsx 3-Layer Refactor**
- D-05: Three-layer architecture: `BackgroundLayer.tsx` (Server Component), `AxisLayer.tsx` (client), card track stays in `Timeline.tsx`
- D-06: `Timeline.tsx` remains `'use client'` orchestrator holding useScroll, useTransform, useReducedMotion, zoom, currentYear
- D-07: `EraBackground.tsx` replaced by `BackgroundLayer.tsx` (deleted, not renamed)

**Parallax Engine**
- D-08: `bgX` multiplier corrected from `0.4` to `0.7`: `bgX = useTransform(scrollXProgress, [0, 1], [0, -(TOTAL_WIDTH * zoom * 0.7)])`
- D-09: `useReducedMotion()` called unconditionally; boolean used inside `useTransform` output range, not around the hook call
- D-10: `touch-action: pan-x` as `style={{ touchAction: 'pan-x' }}` on `.timeline-scroll` div
- D-11: `will-change: transform` MUST NOT be set on `BackgroundLayer` or era band child divs

**Era Texture**
- D-12: Inline SVG feTurbulence noise overlay: `background-image: url("data:image/svg+xml,..."), linear-gradient(...)` with `background-blend-mode: overlay`, `background-size: 200px 200px, 100% 100%`; fill `rgba(255,255,255,0.03)`; all eras share same noise pattern

**Import Cleanup**
- D-13: All callers updated from `@/lib/timeline` to `@/lib/yearToPixel` and `@/lib/yearToDisplay`; `lib/timeline.ts` deleted after
- D-14: `formatYear` calls updated to `yearToDisplay` simultaneously

**Show Cards**
- D-15: Show cards remain visible — no regression

### Claude's Discretion

None specified.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TL-01 | User can scroll a horizontal parallax timeline spanning ~3000 BC to present with three depth layers (slow era backgrounds, time axis, fast show cards) | D-08 bgX formula verified; useReducedMotion pattern confirmed; three-layer DOM structure documented |
| TL-03 | Major historical eras are color-coded in the background with illustrative textures | SVG feTurbulence cross-browser support confirmed (Baseline Widely Available since 2015); encoding requirements documented |
| UX-04 | Timeline skeleton (era backgrounds + axis) visible in under 1 second; show cards and posters load progressively without layout shift | SSR skeleton strategy via TimelineSkeleton Server Component documented; Lighthouse FCP threshold (1.8s good) and mobile preset (4x CPU, 1.6 Mbps down) documented |
</phase_requirements>

---

## Summary

Phase 2 delivers the scroll experience: a three-layer parallax fresco with era colour bands and a <1s SSR skeleton. The implementation refactors `app/page.tsx` to a Server Component, extracts client state into `ClientShell.tsx`, and splits the timeline into three layers: `BackgroundLayer.tsx` (static Server Component with SVG noise texture), `AxisLayer.tsx`, and a card track wrapper.

**The most important implementation constraint** is the Next.js RSC boundary rule: a Client Component that directly `import`s another file in its module graph pulls that file into the client bundle. `BackgroundLayer.tsx` (intended as a Server Component) cannot be directly imported by `Timeline.tsx` (`'use client'`). Instead, `page.tsx` (Server Component) must instantiate `<BackgroundLayer />` and pass it to `Timeline.tsx` as a `children` prop. The CONTEXT.md note at D-06 ("client component importing a server component is valid in Next.js — it becomes statically rendered at build time") is NOT accurate per the current official Next.js docs — direct import silently demotes a Server Component to a Client Component.

SVG feTurbulence is Baseline Widely Available (since July 2015) and works in Chrome, Firefox, and Safari. The only encoding requirement for cross-browser CSS data URIs is that `#` characters must be percent-encoded as `%23`; other characters do not need encoding in modern browsers. The SVG must use single quotes internally when embedded in a double-quoted CSS value.

**Primary recommendation:** Pass `<BackgroundLayer />` as a `children` prop through `ClientShell.tsx` → `Timeline.tsx` rather than importing it directly inside `Timeline.tsx`.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Era colour bands + SVG texture | Frontend Server (SSR/BackgroundLayer.tsx) | — | Static data (ERAS), no browser APIs; Server Component keeps this content in SSR HTML for Googlebot and fast FCP |
| Parallax transform engine | Browser / Client (Timeline.tsx) | — | useScroll, useTransform, useReducedMotion require browser APIs; Motion values cannot be serialized to RSC |
| Time axis ticks + labels | Browser / Client (AxisLayer.tsx) | — | zoom prop affects tick density; zoom lives in Timeline.tsx client state |
| Skeleton loading state | Frontend Server (SSR/TimelineSkeleton.tsx) | — | Must be in SSR HTML to guarantee <1s FCP before any JS executes |
| Scroll container + event listeners | Browser / Client (Timeline.tsx) | — | useRef, useEffect, scroll event listeners are browser-only |
| Page-level layout + RSC shell | Frontend Server (SSR/page.tsx) | — | Server Component shell renders skeleton + passes BackgroundLayer as prop to ClientShell |

---

## Standard Stack

### Core (no new packages — Phase 2 uses only what is already installed)

| Library | Version (installed) | Purpose | Why Standard |
|---------|---------------------|---------|--------------|
| framer-motion | 11.18.2 | useScroll, useTransform, useReducedMotion, motion.div | Already in project; provides scroll-linked Motion values without scroll state in React |
| next | 14.2.35 | App Router, RSC, SSR | Already in project; Server Components enable SSR skeleton with zero JS |
| tailwindcss | 3.4.10 | Utility CSS, animate-pulse, animate-fade-in | Already in project; `animate-fade-in` keyframe already defined in tailwind.config.ts |
| vitest | 4.1.6 | Unit tests | Already in project; 38 existing tests passing |

### Supporting

None — Phase 2 installs zero new packages. All capabilities are met with the installed stack.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| SVG feTurbulence data URI | External PNG texture | External asset requires network fetch, breaks <1s skeleton budget |
| SVG feTurbulence data URI | CSS noise via repeating-conic-gradient | Less organic/film-grain appearance; browser support for complex gradients varies |
| Passing BackgroundLayer as children | Direct import of BackgroundLayer in Timeline.tsx | Direct import silently promotes BackgroundLayer to Client Component (content leaves SSR HTML, SEO regresses) |

**Installation:** No new packages. Zero `npm install` commands in this phase.

---

## Package Legitimacy Audit

No new packages are installed in Phase 2. This section is not applicable.

---

## Architecture Patterns

### System Architecture Diagram

```
Browser request
      |
      v
app/page.tsx  [Server Component]
  |-- renders TimelineSkeleton (SSR HTML, visible in <1s)
  |-- instantiates <BackgroundLayer locale={locale} />  (RSC — static HTML)
  |-- renders <ClientShell backgroundLayer={<BackgroundLayer />}>
                    |
                    v
            ClientShell.tsx  ['use client']
              |-- useState(locale='fr'), useState(filters), useState(selectedShow)
              |-- renders <Timeline backgroundLayer={backgroundLayer} ...>
                              |
                              v
                      Timeline.tsx  ['use client']
                        |-- useScroll({ container: containerRef })
                        |-- useTransform(scrollXProgress, ...) → bgX Motion value
                        |-- useReducedMotion() → shouldReduceMotion boolean
                        |-- renders:
                        |    [1] <motion.div style={{ x: bgX }}>
                        |         {backgroundLayer}  ← BackgroundLayer RSC output
                        |        </motion.div>
                        |    [2] AxisLayer.tsx  ['use client']  (zoom, ticks)
                        |    [3] <div data-layer="card-track">  (show cards — Phase 3)
                        |    [4] Show cards (existing, no regression)
```

**Key data flow for FCP:**
```
Server render → TimelineSkeleton HTML → browser paints era bands (FCP)
                                              |
                                    JS bundle parses + hydrates
                                              |
                                    Timeline.tsx mounts
                                              |
                                    motion.div replaces skeleton
                                    (animate-fade-in 0.4s transition)
```

### Recommended Project Structure

```
app/
  page.tsx              # Server Component — SSR shell (remove 'use client')
components/
  ClientShell.tsx        # NEW 'use client' — locale/filter/selectedShow state
  Timeline.tsx           # 'use client' — scroll container + parallax orchestrator
  BackgroundLayer.tsx    # NEW Server Component — era bands + SVG noise texture
  AxisLayer.tsx          # NEW 'use client' — axis ticks, labels, current-year
  TimelineSkeleton.tsx   # NEW Server Component — animate-pulse era band skeleton
  EraBackground.tsx      # DELETE after BackgroundLayer.tsx complete
lib/
  timeline.ts            # DELETE after updating all callers to import directly
```

### Pattern 1: Server Component passed as children to Client Component

**What:** The correct RSC composition pattern when a Server Component must be visually nested inside a Client Component without being pulled into the client bundle.

**When to use:** Any time a Server Component (`BackgroundLayer.tsx`) must be positioned inside a Client Component (`Timeline.tsx`) that applies transforms to it.

**Example:**
```tsx
// Source: https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components

// app/page.tsx  (Server Component)
import ClientShell from '@/components/ClientShell';
import BackgroundLayer from '@/components/BackgroundLayer';

export default function Page() {
  return (
    <ClientShell
      backgroundLayer={<BackgroundLayer locale="fr" />}
    />
  );
}

// components/ClientShell.tsx  ('use client')
interface Props {
  backgroundLayer: React.ReactNode;
}
export default function ClientShell({ backgroundLayer }: Props) {
  // ... state ...
  return <Timeline backgroundLayer={backgroundLayer} ... />;
}

// components/Timeline.tsx  ('use client')
interface Props {
  backgroundLayer: React.ReactNode;
  // ...
}
export default function Timeline({ backgroundLayer, ... }: Props) {
  // ...
  return (
    <motion.div style={{ x: bgX }}>
      {backgroundLayer}
    </motion.div>
  );
}
```

**Why this works:** `BackgroundLayer` is not in `Timeline.tsx`'s import graph. It is rendered by `page.tsx` (Server Component) and passed as a pre-rendered React node (RSC Payload). The client bundle never contains `BackgroundLayer.tsx` code. [VERIFIED: nextjs.org/docs/app/getting-started/server-and-client-components]

### Pattern 2: useReducedMotion — unconditional hook, boolean used in transform range

**What:** Call `useReducedMotion()` unconditionally at the top of the component. Use the returned boolean to compute the Motion value output range — NOT to conditionally call `useTransform`.

**When to use:** All parallax transforms in Timeline.tsx.

**Example:**
```tsx
// Source: https://motion.dev/docs/react-use-reduced-motion

// CORRECT — hook called unconditionally, boolean used in range computation
const shouldReduceMotion = useReducedMotion();
const bgX = useTransform(
  scrollXProgress,
  [0, 1],
  [0, shouldReduceMotion ? 0 : -(TOTAL_WIDTH * zoom * 0.7)]
);

// WRONG — violates Rules of Hooks (conditional hook call)
// const bgX = shouldReduceMotion
//   ? 0
//   : useTransform(scrollXProgress, [0, 1], [0, -(TOTAL_WIDTH * zoom * 0.7)]);
```

**Note:** The UI-SPEC shows a conditional pattern (`const bgX = shouldReduceMotion ? 0 : useTransform(...)`) which IS a Rules of Hooks violation. The CONTEXT.md (D-09) correctly identifies the safe pattern. Always use the non-conditional form. [VERIFIED: motion.dev docs]

### Pattern 3: SVG feTurbulence noise as CSS data URI

**What:** An inline SVG with `feTurbulence` as a `background-image` data URI for the noise/grain texture on each era band.

**When to use:** `BackgroundLayer.tsx` — applied per era band as `style` prop.

**Encoding rules (cross-browser):**
- Use single quotes inside the SVG when the CSS value uses double quotes
- Percent-encode `#` as `%23` (the only encoding strictly required)
- `<` and `>` do not need encoding in modern browsers (Chrome, Firefox, Safari) but encoding them is harmless

**Example:**
```tsx
// Source: phpied.com/truth-encoding-svg-data-uris + css-tricks.com/creating-patterns-with-svg-filters

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`;

// Applied per era band in BackgroundLayer.tsx:
<div
  style={{
    backgroundImage: `${NOISE_SVG}, linear-gradient(135deg, ${era.gradient[0]}22, ${era.gradient[1]}44)`,
    backgroundBlendMode: 'overlay',
    backgroundSize: '200px 200px, 100% 100%',
  }}
/>
```

**Notes:**
- The `%23` encoding on `url(%23noise)` inside the SVG is required because `#` is a fragment identifier delimiter
- `opacity='0.03'` on the `<rect>` is the SVG equivalent of `rgba(255,255,255,0.03)` fill
- `stitchTiles='stitch'` prevents seams at the 200px tile boundary
- All eras share the same SVG string (define once, reuse) [VERIFIED: MDN + phpied.com]

### Pattern 4: TimelineSkeleton as Server Component

**What:** A pure Server Component that renders era bands as `animate-pulse` divs with no JS dependency.

**When to use:** Rendered by `page.tsx` before `ClientShell` mounts. Replaced by the animated `Timeline` on hydration via `animate-fade-in`.

**Example:**
```tsx
// components/TimelineSkeleton.tsx  — NO 'use client' directive

import { ERAS } from '@/data/eras';
import { yearToPixel, TOTAL_WIDTH } from '@/lib/yearToPixel';

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

**Why no Suspense is needed:** ERAS is a static TypeScript import — zero network fetches. The skeleton HTML is part of the initial server render, not deferred. [VERIFIED: Next.js docs — Suspense is for async Server Components with data fetching]

### Anti-Patterns to Avoid

- **Direct import of BackgroundLayer in Timeline.tsx:** `import BackgroundLayer from './BackgroundLayer'` inside a `'use client'` file silently demotes BackgroundLayer to a Client Component, removing its content from the SSR HTML and adding its code to the client bundle. [VERIFIED: nextjs.org/docs]
- **Conditional useTransform call:** `const bgX = shouldReduceMotion ? 0 : useTransform(...)` violates React Rules of Hooks. The correct form has `useTransform` called unconditionally with the boolean in the output range. [VERIFIED: React docs + Framer Motion docs]
- **will-change on BackgroundLayer:** Explicit `will-change: transform` on the background motion.div creates an unnecessary 100%-viewport composite layer. Framer Motion promotes GPU layers automatically during active animation. [VERIFIED: CLAUDE.md constraint + UI-SPEC]
- **Scroll position in React state for parallax:** `scrollXProgress` is a Framer Motion MotionValue — it must drive transforms directly. `setCurrentYear()` in the passive scroll listener is only for the year pill display, not for transform calculations. [ASSUMED — project pattern from existing Timeline.tsx]
- **Base64 encoding the SVG:** Base64 encoding is ~33% larger than URL-encoded SVG and provides no benefit in modern browsers. URL-encoding (encoding only `#` and `<>` as needed) is the current best practice. [VERIFIED: css-tricks.com/creating-patterns-with-svg-filters]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-linked parallax animation | Custom scroll listener + requestAnimationFrame | `useScroll` + `useTransform` from Framer Motion | Motion values are off the React render cycle; rAF re-renders cause jank and state cascade |
| Reduced motion detection | MediaQuery event listener | `useReducedMotion()` from Framer Motion | Handles the MediaQuery lifecycle, SSR, and re-render on OS setting change |
| SVG noise texture rendering | Canvas drawImage() or PNG assets | SVG feTurbulence in data URI | Zero network fetch, zero build step, CSS compositing handles blending |
| Fade-in skeleton → timeline transition | Custom CSS animation class | `animate-fade-in` (already in tailwind.config.ts) | Keyframe already defined; no new code required |

**Key insight:** The Motion library provides the exact abstractions needed for scroll-linked parallax — using raw DOM scroll events for animation bypasses the GPU-optimized transform path.

---

## Runtime State Inventory

Not applicable — this is not a rename/refactor/migration phase. Phase 2 creates new files and refactors existing components; no stored state, external service config, or OS registrations embed strings being renamed.

---

## Common Pitfalls

### Pitfall 1: Direct import of Server Component from Client Component

**What goes wrong:** `Timeline.tsx` has `import BackgroundLayer from './BackgroundLayer'` at the top. Next.js silently includes `BackgroundLayer.tsx` in the client bundle. Era band HTML is no longer in the SSR HTML. Googlebot cannot see it. `animate-fade-in` transition between skeleton and timeline breaks (skeleton shows era bands, Timeline shows nothing until JS runs).

**Why it happens:** The RSC module graph boundary means `'use client'` propagates to all transitive imports. There is no build error — it is silent.

**How to avoid:** `BackgroundLayer` must be instantiated in `page.tsx` (Server Component) and passed as a React node prop (`backgroundLayer: React.ReactNode`) through `ClientShell` → `Timeline`. The node is the already-rendered RSC output; Timeline wraps it in `motion.div` to apply `bgX`.

**Warning signs:** `next build` output shows `BackgroundLayer` in the client bundle size report. The SSR HTML does not contain era band markup when inspected via `curl localhost:3000`.

### Pitfall 2: useTransform called conditionally (Rules of Hooks violation)

**What goes wrong:** The UI-SPEC (Section: prefers-reduced-motion) shows the pattern:
```tsx
const bgX = shouldReduceMotion
  ? 0
  : useTransform(scrollXProgress, [0, 1], [0, -(TOTAL_WIDTH * zoom * 0.7)]);
```
This calls `useTransform` inside a ternary — a conditional hook call. React will throw an error at runtime when `shouldReduceMotion` changes.

**Why it happens:** Copy-paste from the UI-SPEC without checking React Rules of Hooks.

**How to avoid:** Always use the CONTEXT.md D-09 pattern: call `useTransform` unconditionally; put the conditional inside the output range array.

**Warning signs:** React console error "Rendered more hooks than during the previous render" or "Rendered fewer hooks than during the previous render" when toggling prefers-reduced-motion.

### Pitfall 3: SVG data URI renders blank in Firefox due to unencoded `#`

**What goes wrong:** The SVG noise uses `filter='url(#noise)'` with an unencoded `#`. In CSS data URIs, `#` is interpreted as a URL fragment separator, breaking the filter reference. Era bands render without texture in Firefox.

**Why it happens:** Chrome's SVG parser is more lenient with unencoded characters in data URIs than Firefox.

**How to avoid:** Encode `#` as `%23` in the SVG string before embedding: `filter='url(%23noise)'`. Use single quotes inside the SVG markup so the outer CSS double-quote wrapper does not need escaping.

**Warning signs:** Era texture visible in Chrome DevTools but absent in Firefox. Console error "Invalid filter reference" in Firefox.

### Pitfall 4: `lib/timeline.ts` shim not deleted — import drift

**What goes wrong:** Phase 2 updates callers to import from `@/lib/yearToPixel` and `@/lib/yearToDisplay`, but the shim `lib/timeline.ts` is not deleted. A future developer or AI agent adds a new caller that imports from the shim. Phase 3 or later encounters a confusing two-source import graph.

**Why it happens:** The shim deletion is easy to forget because `tsc --noEmit` does not flag unused re-export files.

**How to avoid:** Delete `lib/timeline.ts` as the last task of the import cleanup wave, after verifying `grep -r "@/lib/timeline"` returns zero results.

**Warning signs:** `grep -r "@/lib/timeline" --include="*.ts" --include="*.tsx"` returns non-empty output after cleanup.

### Pitfall 5: Lighthouse measures client bundle parse time, not skeleton FCP

**What goes wrong:** The skeleton is in SSR HTML, but the Lighthouse report shows FCP > 1.5s. Investigation reveals the FCP element is the `<Timeline>` client component, not the `<TimelineSkeleton>`, because the skeleton div has no visible content (wrong colors, no height, or positioned outside viewport).

**Why it happens:** TimelineSkeleton renders at the correct pixel positions for the full `TOTAL_WIDTH`, but the scroll container clips it. Or `bg-stone-800` era bands have no height because `absolute top-0 bottom-0` requires a non-static parent.

**How to avoid:** Ensure the skeleton's parent div has a fixed pixel height (same `TRACK_HEIGHT` as Timeline or a viewport-height fallback). Verify FCP element identity in Lighthouse "Diagnostics" section. Use `npx lighthouse http://localhost:3000 --preset=desktop` and `--preset=mobile` to measure both.

**Warning signs:** Lighthouse "Largest Contentful Paint element" points to a div inside `<Timeline>` rather than `<TimelineSkeleton>`. FCP > 1.8s on mobile preset.

### Pitfall 6: `page.tsx` locale prop hardcoded — Phase 7 conflict

**What goes wrong:** `page.tsx` (Server Component) passes `locale="fr"` hardcoded to `BackgroundLayer`. Phase 7 must change this to read locale from `[locale]` route params — but `page.tsx` does not have the route params yet (Phase 2 does not add `app/[locale]/` routing).

**Why it happens:** Phase 2 architecture decisions anticipate the locale-from-param pattern but only deliver a hardcoded default.

**How to avoid:** Make the locale-related props to `BackgroundLayer` optional, defaulting to `'fr'`. Add a `// TODO(Phase 7): replace with locale from params` comment on the hardcoded value. This is explicit and prevents silent regressions.

**Warning signs:** Phase 7 fails to find `locale` in `page.tsx` and incorrectly duplicates locale logic.

---

## Code Examples

Verified patterns from official sources:

### bgX Motion value with useReducedMotion

```tsx
// Source: motion.dev/docs/react-use-reduced-motion + CONTEXT.md D-09
import { useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { TOTAL_WIDTH } from '@/lib/yearToPixel';

// Inside Timeline component:
const shouldReduceMotion = useReducedMotion();  // unconditional
const { scrollXProgress } = useScroll({ container: containerRef });

const bgX = useTransform(
  scrollXProgress,
  [0, 1],
  [0, shouldReduceMotion ? 0 : -(TOTAL_WIDTH * zoom * 0.7)]  // boolean inside range
);
```

### SVG noise data URI (full string, production-ready)

```tsx
// Source: encoding rules from phpied.com + MDN feTurbulence
// Note: %3C = <, %3E = >, %23 = #, %2F = /, %27 = ' (not needed if SVG uses single quotes)
const NOISE_SVG_URI = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`;
```

### touch-action: pan-x on scroll container

```tsx
// Source: CONTEXT.md D-10 + UI-SPEC
// Tailwind v3 has no touch-action: pan-x utility — must use inline style
<div
  ref={containerRef}
  className="timeline-scroll flex-1 overflow-x-auto overflow-y-hidden"
  style={{ touchAction: 'pan-x' }}
  tabIndex={0}
>
```

### Server Component passed as React.ReactNode prop

```tsx
// Source: nextjs.org/docs/app/getting-started/server-and-client-components
// app/page.tsx (Server Component)
import ClientShell from '@/components/ClientShell';
import BackgroundLayer from '@/components/BackgroundLayer';
import TimelineSkeleton from '@/components/TimelineSkeleton';

export default function Page() {
  return (
    <div className="flex flex-col h-screen bg-stone-950 overflow-hidden">
      <TimelineSkeleton />
      <ClientShell backgroundLayer={<BackgroundLayer locale="fr" />} />
    </div>
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| All page state in `page.tsx` `'use client'` | Server Component shell + ClientShell boundary | Next.js App Router (Next 13+) | Server Components get SSR'd to HTML; client bundle is smaller; FCP improves |
| EraBackground as `'use client'` | BackgroundLayer as Server Component | Phase 2 | Era bands in SSR HTML → Googlebot sees them; skeleton → timeline transition has no HTML diff |
| Background parallax at 0.4× multiplier (~0.6× speed) | 0.7× multiplier (correct 0.3× background speed) | Phase 2 fix | Correct perceptual depth: background drifts at 0.3px per 1px scroll |

**Deprecated/outdated:**
- `lib/timeline.ts` shim: deprecated in Phase 1, deleted in Phase 2 after updating all callers. Callers must import directly from `@/lib/yearToPixel` and `@/lib/yearToDisplay`.
- `components/EraBackground.tsx`: deleted in Phase 2, replaced by `components/BackgroundLayer.tsx`.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `BackgroundLayer.tsx` uses only static imports and no browser APIs, so it can be a Server Component with no async/await | Architecture Patterns | If yearToPixel.ts or eras.ts inadvertently import client-only code, the Server Component will fail at build time |
| A2 | The current `Timeline.tsx` background layer `scaleX` compensation (`style={{ scaleX: 1 / zoom, ... }}`) can be simplified or kept as-is alongside the bgX Motion value without layout conflict | Code Examples | If scaleX and bgX compose unexpectedly, era bands may misalign at zoom levels other than 1 |
| A3 | `AxisLayer.tsx` receiving `zoom` and `ticks` as plain props is sufficient — no Motion values need to be passed down | Architecture Patterns | If AxisLayer later needs scroll-linked behavior, the prop API will need to change |

**If this table is empty:** Not empty — three assumptions flagged for planner awareness.

---

## Open Questions

1. **BackgroundLayer locale prop in Phase 2 (hardcoded `'fr'`)**
   - What we know: Phase 2 converts `page.tsx` to a Server Component. Phase 7 adds `app/[locale]/` routing with locale from params.
   - What's unclear: Should `BackgroundLayer` in Phase 2 receive `locale="fr"` hardcoded, or should `page.tsx` accept a default locale prop?
   - Recommendation: Hardcode `locale="fr"` in Phase 2 with a `// TODO(Phase 7)` comment. The era band names are the only locale-dependent string in `BackgroundLayer`.

2. **TimelineSkeleton visibility during hydration**
   - What we know: `TimelineSkeleton` is in SSR HTML; `ClientShell` renders `Timeline` on hydration.
   - What's unclear: Does `TimelineSkeleton` need to be `display:none` once `Timeline` mounts, or does `animate-fade-in` on the Timeline wrapper handle the visual transition?
   - Recommendation: The `animate-fade-in` opacity transition on the Timeline wrapper creates a brief overlap where both are visible. Use `position: absolute` on both, same stacking context, so Timeline fades in over skeleton. Or add `useEffect` in `ClientShell` to unmount TimelineSkeleton after Timeline hydrates. The simpler approach is to let skeleton remain in DOM (it is static divs; no performance cost) and have Timeline's `animate-fade-in` cover it.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build, tests | ✓ | (via npm list) | — |
| vitest | Unit tests | ✓ | 4.1.6 | — |
| framer-motion | Parallax engine | ✓ | 11.18.2 | — |
| next | SSR, RSC | ✓ | 14.2.35 | — |
| tailwindcss | CSS utilities | ✓ | 3.4.10 | — |
| Physical iOS Safari device | UX-02 touch-action verification | Unknown | — | DevTools emulation (known to be insufficient — only physical hardware catches pointercancel) |

**Missing dependencies with no fallback:**
- Physical iOS Safari device for final `touch-action: pan-x` verification. DevTools emulation does not reproduce the `pointercancel` behavior on diagonal swipe. This is a manual test gate, not a blocker for code implementation.

**Missing dependencies with fallback:**
- None.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | vitest 4.1.6 |
| Config file | `vitest.config.mts` |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TL-01 | bgX Motion value formula produces 0.3× speed: offset at progress=1 equals `-(TOTAL_WIDTH * zoom * 0.7)` | unit | `npx vitest run lib/parallaxFormula.test.ts` | ❌ Wave 0 |
| TL-01 | touch-action pan-x present on scroll container | manual | Physical iOS Safari device | N/A |
| TL-03 | SVG noise URI contains `%23` encoding (not bare `#`) | unit | `npx vitest run lib/noiseUri.test.ts` | ❌ Wave 0 |
| UX-04 | TimelineSkeleton renders all ERAS as divs with correct `left`/`width` values | unit | `npx vitest run components/TimelineSkeleton.test.ts` | ❌ Wave 0 |
| UX-04 | Lighthouse FCP ≤ 1.8s on mobile throttle | manual | `npx lighthouse http://localhost:3000 --preset=mobile` | N/A |

**Note:** Component render tests for `BackgroundLayer.tsx` and `TimelineSkeleton.tsx` require `@vitest-environment jsdom` per the project convention (STATE.md decision 01-01). Add `// @vitest-environment jsdom` at the top of component test files.

### Sampling Rate

- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `lib/parallaxFormula.test.ts` — verifies bgX formula math: `TOTAL_WIDTH * zoom * 0.7` at progress=1; verifies `shouldReduceMotion=true` produces output range `[0, 0]`
- [ ] `lib/noiseUri.test.ts` — verifies NOISE_SVG_URI constant contains `%23` not bare `#`; verifies it starts with `url("data:image/svg+xml,`
- [ ] `components/TimelineSkeleton.test.ts` — `@vitest-environment jsdom`; renders all ERAS.length divs; each has `left` matching `yearToPixel(era.yearStart)` and `width` matching pixel span

---

## Security Domain

Phase 2 has no authentication, data validation, session management, or cryptographic operations. The only external input is the OS `prefers-reduced-motion` MediaQuery, which is read-only and cannot be injected. No ASVS controls apply to Phase 2's scope.

The inline SVG data URI is a compile-time constant — no user input is interpolated into it. No XSS vector exists.

---

## Sources

### Primary (HIGH confidence)
- [nextjs.org — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — RSC module graph rules, interleaving pattern, children-as-prop pattern
- [motion.dev — useReducedMotion](https://motion.dev/docs/react-use-reduced-motion) — hook signature, boolean result pattern, component-level usage
- [MDN feTurbulence](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence) — "Baseline Widely Available since July 2015"
- [Lighthouse throttling.md](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md) — mobile preset: 150ms RTT, 1.6 Mbps, 4× CPU slowdown
- [web.dev/fcp](https://web.dev/articles/fcp) — FCP threshold: ≤ 1.8s = green

### Secondary (MEDIUM confidence)
- [phpied.com — Truth about encoding SVG data URIs](https://www.phpied.com/truth-encoding-svg-data-uris/) — only `#` → `%23` required; other characters optional
- [css-tricks.com — Creating Patterns with SVG Filters](https://css-tricks.com/creating-patterns-with-svg-filters/) — feTurbulence in CSS data URI pattern
- [nextjs.org/discussions #51050](https://github.com/vercel/next.js/discussions/51050) — direct import of Server Component from Client Component causes silent demotion to Client Component

### Tertiary (LOW confidence)
- None — all claims verified against official or authoritative sources.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed and version-verified
- Architecture (RSC boundary): HIGH — verified against official Next.js docs; the "direct import is valid" claim in CONTEXT.md D-06 is contradicted by official docs
- Parallax formula: HIGH — verified from CONTEXT.md D-08 + Framer Motion docs
- SVG feTurbulence support: HIGH — MDN Baseline Widely Available status
- SVG encoding requirement: HIGH — phpied.com authoritative + search cross-verification
- Lighthouse FCP thresholds: HIGH — official Lighthouse throttling.md + web.dev/fcp

**Research date:** 2026-05-18
**Valid until:** 2026-06-18 (stable APIs — Next.js 14 and Framer Motion 11 are in maintenance mode for this project)

---

## Project Constraints (from CLAUDE.md)

All of the following must be honoured in every Phase 2 implementation task:

| Constraint | Rule |
|-----------|------|
| yearToPixel() | Load-bearing function — do not modify in Phase 2; import from `@/lib/yearToPixel` |
| BC dates | Stored as plain INTEGER (negative = BC). Never use JS `Date` or `Intl.DateTimeFormat` for historical years |
| RSC/client boundary | Show card content must be in SSR HTML; parallax transforms in `'use client'` wrapper |
| GPU layer budget | Never apply `will-change: transform` to BackgroundLayer, era band divs, or all cards simultaneously |
| touch-action: pan-x | Required on `.timeline-scroll` container; not detectable in DevTools emulation |
| prefers-reduced-motion | `useReducedMotion()` called unconditionally in Timeline.tsx from day one |
| Tailwind only | No CSS modules, no styled-components; utility classes only |
| No globals: true | Vitest test files use explicit named imports from vitest, not globals |
| it.todo not it.skip | Unimplemented test cases use `it.todo`, not `it.skip` |
