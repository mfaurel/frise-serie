# Phase 2: Parallax Engine + Era Backgrounds - Context

**Gathered:** 2026-05-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the scrollable three-layer fresco: parallax engine (0.3× background, 1× axis, 1.15× card track), era colour bands with SVG noise texture, and a < 1s SSR skeleton. Show cards remain visible (no regression) but are not improved — that is Phase 3 scope. Phase 2 also converts the page architecture to a proper RSC boundary with a Server Component shell.

</domain>

<decisions>
## Implementation Decisions

### Page Architecture (app/page.tsx)

- **D-01:** `app/page.tsx` is converted to a **Server Component** in Phase 2. The `'use client'` directive is removed.
- **D-02:** All interactive state (locale, filters, selectedShow) is extracted into a new **`components/ClientShell.tsx`** client component. `page.tsx` renders `<ClientShell />` as its only client boundary.
- **D-03:** `ClientShell.tsx` manages `locale` via `useState` with default `'fr'`. Phase 7 will replace this with locale from `[locale]` route params when it adds `app/[locale]/page.tsx` routing.
- **D-04:** `TimelineSkeleton` is a new **Server Component** (`components/TimelineSkeleton.tsx`). It renders era bands as static divs with `animate-pulse`. It is rendered directly in the SSR HTML path — no Suspense fallback needed since its data (ERAS) is a static import.

### Timeline.tsx Refactor (3-Layer Architecture)

- **D-05:** `Timeline.tsx` is refactored into a **3-layer architecture** using separate files for each layer:
  - `components/BackgroundLayer.tsx` — **Server Component** — era colour bands + SVG noise texture. Imports `ERAS` from `@/data/eras` and `yearToPixel` from `@/lib/yearToPixel`. No browser API. Replaces `EraBackground.tsx`.
  - `components/AxisLayer.tsx` — client component (receives `zoom` prop from Timeline) — time axis ticks + labels + current-year pill.
  - Card track rendering **stays in `Timeline.tsx`** for Phase 2. A `div[data-layer="card-track"]` wrapper is added around the existing card rendering block. Phase 3 will extract this into `CardTrackLayer.tsx`.
- **D-06:** `Timeline.tsx` remains the `'use client'` orchestrator. It composes `BackgroundLayer`, `AxisLayer`, and the card track section. It holds `useScroll`, `useTransform`, `useReducedMotion`, `zoom`, and `currentYear` state.
- **D-07:** `EraBackground.tsx` is **replaced** by `BackgroundLayer.tsx` (not renamed — a clean new file to avoid confusion). The old file is deleted.

### Parallax Engine Fixes

- **D-08:** `bgX` multiplier corrected from `0.4` to `0.7`:
  ```
  bgX = useTransform(scrollXProgress, [0, 1], [0, -(TOTAL_WIDTH * zoom * 0.7)])
  ```
  This produces the required 0.3× background speed (background moves 0.3px per 1px scroll).
- **D-09:** `useReducedMotion()` wraps all parallax transforms. Implementation must use the non-conditional pattern:
  ```tsx
  const shouldReduceMotion = useReducedMotion();
  const bgXValue = useTransform(scrollXProgress, [0, 1], [0, shouldReduceMotion ? 0 : -(TOTAL_WIDTH * zoom * 0.7)]);
  ```
  The hook must be called unconditionally (React rules of hooks). The motion value computation uses the boolean inside the transform, not around the `useTransform` call.
- **D-10:** `touch-action: pan-x` is applied as `style={{ touchAction: 'pan-x' }}` on the `.timeline-scroll` container div (Tailwind v3 has no utility for this).
- **D-11:** `will-change: transform` must NOT be set on `BackgroundLayer` or any era band child div. Framer Motion promotes GPU layers automatically via active transforms.

### Era Texture

- **D-12:** Era texture is delivered via an **inline SVG noise overlay** on each era band:
  ```css
  background-image:
    url("data:image/svg+xml,..."),   /* SVG feTurbulence baseFrequency 0.65 */
    linear-gradient(135deg, {era.gradient[0]}22, {era.gradient[1]}44);
  background-blend-mode: overlay;
  background-size: 200px 200px, 100% 100%;
  ```
  All eras share the same noise pattern (only color varies). No external image assets, no `next/image` for era backgrounds. The noise SVG fill is `rgba(255,255,255,0.03)` — intentionally subtle.

### Import Path Cleanup

- **D-13:** Both `Timeline.tsx` and `EraBackground.tsx` currently import from `@/lib/timeline` (the shim). Phase 2 updates all callers to import directly:
  - `yearToPixel`, `pixelToYear`, `TOTAL_WIDTH` → `@/lib/yearToPixel`
  - `formatYear` (now `yearToDisplay`) → `@/lib/yearToDisplay`
  - After updating all callers, `lib/timeline.ts` is **deleted**.
- **D-14:** `formatYear` calls in `EraBackground.tsx` and `Timeline.tsx` should be updated to `yearToDisplay` at the same time — same function, renamed in Phase 1.

### Show Cards During Phase 2

- **D-15:** Show cards **remain visible** in Phase 2 — no regression from the current state. The card rendering, row-assignment, and filter logic stay in `Timeline.tsx`. Phase 3 improves card presentation (posters, accuracy scores, span bars).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 2 Requirements
- `.planning/REQUIREMENTS.md` §TL-01, §TL-03, §UX-04 — The three requirements this phase satisfies
- `.planning/ROADMAP.md` §Phase 2 — 5 success criteria (horizontal scroll, 3 parallax layers, era colour bands, < 1s skeleton, prefers-reduced-motion)

### Design Contract (Visual + Interaction)
- `.planning/phases/02-parallax-engine-era-backgrounds/02-UI-SPEC.md` — **APPROVED UI design contract.** Locks parallax ratios, era texture approach, skeleton colours, typography, spacing, touch-action, useReducedMotion pattern, copywriting (FR + EN ARIA labels). Downstream agents MUST read this before writing any component code.

### Architecture Constraints
- `CLAUDE.md` §Critical Constraints — RSC/client boundary, GPU layer budget (will-change prohibition), touch-action, prefers-reduced-motion, yearToPixel load-bearing status
- `CLAUDE.md` §Architecture Quick Reference — file layout conventions

### Phase 1 Deliverables (to import, not rebuild)
- `lib/yearToPixel.ts` — `yearToPixel(year)`, `pixelToYear(px)`, `TOTAL_WIDTH` — the non-linear scale function
- `lib/yearToDisplay.ts` — `yearToDisplay(year, locale)` — BC/AD formatting
- `data/eras.ts` — `ERAS` array with `yearStart`, `yearEnd`, `gradient`, `pixelsPerYear`, `name.fr`, `name.en`
- `lib/timeline.ts` — the re-export shim that Phase 2 will DELETE after updating all callers

### Existing Code to Refactor
- `components/Timeline.tsx` — current scroll container, parallax, card rendering. Phase 2 refactors this.
- `components/EraBackground.tsx` — current era bands (no texture). Phase 2 replaces with `BackgroundLayer.tsx`.
- `app/page.tsx` — currently `'use client'` — Phase 2 converts to Server Component + ClientShell split.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Timeline.tsx: useScroll({ container: containerRef })` + `useTransform(scrollXProgress)` — the Motion hook setup is already correct; only the multiplier value needs fixing.
- `Timeline.tsx: getTickInterval(zoom)` — tick density function reusable in `AxisLayer.tsx`.
- `Timeline.tsx: handleScroll` + `currentYear` indicator — reusable as-is in refactored Timeline.
- `Timeline.tsx: applyFilters()` + `assignRows()` — stay in Timeline.tsx for Phase 2, untouched.
- `EraBackground.tsx` — the gradient+opacity values (`22`/`44`/`33`) are already correct per UI-SPEC; Phase 2 adds the noise overlay on top.

### Established Patterns
- All data files use TypeScript named exports (`export const ERAS`, `export const SHOWS`).
- `@/` path alias is active (confirmed by existing imports).
- Tailwind utility classes only — no CSS modules, no styled-components.
- `'use client'` at the top of client components; Server Components have no directive.
- `motion.div` from Framer Motion wraps anything that needs parallax transforms.

### Integration Points
- `page.tsx` → `ClientShell.tsx` → `Timeline.tsx`: new hierarchy after Phase 2 conversion.
- `BackgroundLayer.tsx` is imported by `Timeline.tsx` (client component importing a server component is valid in Next.js — it becomes statically rendered at build time).
- `AxisLayer.tsx` receives `{ zoom, locale, ticks }` props from `Timeline.tsx`.
- `data-layer="card-track"` div in `Timeline.tsx` is the mount contract for `CardTrackLayer.tsx` in Phase 3.
- `TimelineSkeleton.tsx` is imported and rendered by `page.tsx` (Server Component → Server Component).

### React Hooks Constraint
- `useReducedMotion()` must be called unconditionally at the top of `Timeline.tsx`. The parallax Motion value uses the boolean result inside `useTransform`, not around it. The UI-SPEC shows the correct pattern.
- `useScroll`, `useTransform`, `useState`, `useRef`, `useCallback`, `useEffect` are all in `Timeline.tsx` — these are all valid since it is `'use client'`.

</code_context>

<specifics>
## Specific Ideas

- The researcher should verify that the inline SVG `feTurbulence` noise approach works across Chrome, Firefox, and Safari before the planner commits to it. A fallback (gradient-only) should be noted if browser support is inconsistent.
- The Lighthouse < 1s measurement should be documented: use `Lighthouse > Performance > First Contentful Paint` with the "Throttled 4G Mobile" preset. The skeleton's SSR paint (from `TimelineSkeleton`) is what gets measured, not the animated Timeline hydration.
- The `animate-fade-in` transition from skeleton to Timeline (on hydration) requires `tailwind.config.ts` to have the `fadeIn` keyframe defined. Verify it exists or add it in Phase 2.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 2 — Parallax Engine + Era Backgrounds*
*Context gathered: 2026-05-18*
