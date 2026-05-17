# Domain Pitfalls — Frise Série Historical Timeline

**Domain:** Interactive parallax horizontal timeline, Next.js App Router, bilingual, mobile-first
**Researched:** 2026-05-17
**Stack context:** Next.js 14 App Router, Framer Motion 11, Tailwind CSS, next-intl, Supabase/PostgreSQL

---

## Critical Pitfalls

Mistakes that cause rewrites, severe performance regressions, or fundamental architectural failures.

---

### Pitfall 1: Animating Layout Properties Instead of Transforms

**What goes wrong:**
Parallax layers are wired to `top`, `left`, `backgroundPosition`, or `margin` offsets derived from scroll position. Each scroll event triggers a full browser layout recalculation (reflow) and repaint for every parallax element on screen. At 100+ show cards this cascades into frame drops to 10–20 fps on desktop and complete jank on mobile.

**Why it happens:**
Developers reach for the most semantically intuitive property — "move the background up" maps to `background-position-y`. The performance cost is invisible in dev (fast hardware, few elements) and only surfaces under realistic load on mobile.

**Consequences:**
Jank on any page scroll. Worse on mobile where GPU memory is limited. User perception of the app as "slow" destroys the core value proposition (immersive fresco experience).

**Prevention:**
Use only GPU-composited properties for all parallax motion: `transform: translateX()`, `transform: translateY()`, `transform: scale()`, and `opacity`. In Framer Motion, wire `useTransform(scrollX, ...)` to the `x` or `y` motion values — never to `left`, `top`, or `backgroundPositionX`. For era background textures, layer them as positioned `<div>` elements (not CSS `background-image`) so they can be promoted to their own compositor layer via `will-change: transform`.

For the CSS-only parallax approach (Chromе's recommended pattern), use `perspective` + `translateZ` + `scale()` on the scroll container. This runs entirely in the browser's scroll machinery without JavaScript, guaranteeing frame-perfect synchronisation. Framer Motion's `useScroll` + `useTransform` on `scrollX` is acceptable but requires that the derived style is applied to `transform`, not layout properties.

**Detection:**
Chrome DevTools > Performance panel > record a scroll. Any purple "Layout" bars during scroll = layout thrashing. Green "Paint" bars = repaint cost. Red frames = dropped frames. Target: scroll trace should show only "Composite" work (no Layout, no Paint).

**Phase:** Phase 1 (foundational — must be correct before any other parallax work builds on it).

---

### Pitfall 2: GPU Layer Explosion from Overusing `will-change`

**What goes wrong:**
Every parallax element (`will-change: transform`) gets promoted to its own GPU compositor layer. With 3 background layers × N eras + 100+ show cards all promoted simultaneously, GPU texture memory is exhausted on mobile. Low-end Android devices have 512 MB–1 GB total RAM with limited GPU VRAM. Result: browser crashes or falls back to software rendering, which is slower than not using GPU acceleration at all.

**Why it happens:**
Developers apply `will-change: transform` (or `transform: translateZ(0)`) as a blanket "performance fix" to all animated elements. Each promoted layer requires a full texture upload to the GPU; there is no free promotion.

**Consequences:**
Mobile browser crash, or silent fallback to software rendering that is perceptibly slower than hardware-composited rendering. The app may appear to work in Chrome DevTools device emulation (which uses desktop GPU) while crashing on actual devices.

**Prevention:**
Apply `will-change: transform` only to the 2–3 background layers (era textures). Remove it from individual show cards — they should animate as a group via a parent transform, not each promoted independently. Remove `will-change` after the animation completes (set to `auto`) via Framer Motion's `onAnimationComplete` or CSS transition end. Do not apply `will-change` in a global CSS rule or to components that render a variable number of items.

Use Chrome DevTools > Layers panel to audit the layer tree before shipping. Target: fewer than 10 promoted layers in the viewport at any time.

**Detection:**
Chrome DevTools > More Tools > Layers. Count composite layers. If show cards each appear as separate layers, refactor. Memory pressure shows in the Performance panel as increased "GPU Memory" metric.

**Phase:** Phase 1 (establish layer budget before 100+ cards are added).

---

### Pitfall 3: Scroll Events on the Main Thread for Parallax

**What goes wrong:**
Custom `scroll` event listeners drive parallax position updates. Because scroll events fire on the main thread and are not guaranteed to fire every frame, parallax layers desynchronise from the actual scroll position during fast flings, causing a visible "lag tail" where layers catch up after the user stops scrolling.

**Why it happens:**
The intuitive implementation: `window.addEventListener('scroll', updateParallax)`. This is the pattern most tutorials show. The bug is invisible at moderate scroll speed and only appears during fast swipe or trackpad momentum.

**Consequences:**
Visible layer desync on mobile swipe. The parallax effect — the core UX feature — feels broken on the most common usage context (mobile).

**Prevention:**
Use Framer Motion's `useScroll({ container: scrollRef })` which hooks into scroll position via `MotionValue` subscriptions that are batched with the animation frame loop, not raw DOM scroll events. Alternatively, use the CSS `scroll-timeline` / `animation-timeline: scroll()` API (supported in Chrome 115+, Firefox 110+) which runs entirely off the main thread.

For the horizontal scroll container specifically: attach `useScroll` to the scroll container ref, not `window`. Framer Motion's `layoutScroll` prop must be set on any ancestor element that scrolls to ensure correct scroll offset measurement.

**Detection:**
Record a scroll in Chrome DevTools Performance panel. Look for "Scroll" event handlers firing late (red triangles on timeline) or "Long Tasks" during scroll. Framer Motion's `MotionValue.getVelocity()` can be used in a debug overlay to verify parallax values track scroll position with zero lag.

**Phase:** Phase 1.

---

### Pitfall 4: Incorrect BC Date Representation — Year Zero Mismatch

**What goes wrong:**
JavaScript and ISO 8601 use astronomical year numbering: 1 BC = year 0, 2 BC = year −1, 3 BC = year −2. PostgreSQL uses proleptic Gregorian calendar: 1 BC = stored with `BC` suffix, and has no year 0. The `node-postgres` driver (used by Supabase) does not correctly serialise negative JavaScript year integers to PostgreSQL BC notation for all edge cases. A round-trip of a show with `narrativeYearStart: -73` (Spartacus, ~73 BC) can silently return `−72` after the round-trip.

Additionally, `new Date(-73, ...)` in JavaScript creates a year that displays as "1927" in most date formatters (two-digit year offset from 1900) — there is no built-in `Date` API safe for historical years.

**Why it happens:**
Developers store `narrativeYearStart` as a PostgreSQL `INTEGER` column (not `DATE`), which avoids the serialisation bug. But the display layer reaches for `Intl.DateTimeFormat` or `date-fns` for formatting, both of which assume modern dates. `-73` formatted as a year displays incorrectly or throws.

**Consequences:**
Silent data corruption for BC shows. Display bugs ("Spartacus: year 1927"). Filter/sort logic breaks when BC shows sort as large negative integers correctly but comparison against era boundaries fails if eras use a different encoding.

**Prevention:**
Store `narrativeYearStart` and `narrativeYearEnd` as plain `INTEGER` columns in PostgreSQL (not `DATE`/`TIMESTAMP`). This sidesteps the node-postgres serialisation bug entirely. Define a clear convention in a shared type: `0 = 1 BC, -1 = 2 BC` (astronomical numbering). Write a single utility function `yearToDisplay(year: number, locale: string): string` that handles the conversion to "73 BC" / "73 av. J.-C." for both locales — never inline year formatting. Write unit tests covering: year 0, year −1, year 1, year −584 (585 BC, Spartacus), and the era boundary years.

Never use `new Date(year, ...)` for years before 1000 AD. Never pass historical year integers to any `Intl.DateTimeFormat` or date library.

**Detection:**
Unit test: `expect(yearToDisplay(0, 'en')).toBe('1 BC')`, `expect(yearToDisplay(-72, 'en')).toBe('73 BC')`. Integration test: insert a show with `narrativeYearStart = -72`, read it back, assert value is still `−72`.

**Phase:** Phase 1 (data model must be correct before any content is entered). Regression tests must run in CI.

---

### Pitfall 5: Non-Linear Scale Discontinuities at Era Boundaries

**What goes wrong:**
The timeline uses a piecewise non-linear scale (dense modern eras, compressed ancient eras) implemented as an array of `{ yearStart, yearEnd, pixelsPerYear }` segments. If era boundaries in the scale definition don't exactly match the `HistoricalEra` data records, gaps appear between eras on the visual timeline, or show cards placed near era boundaries are rendered in the wrong visual band.

A related problem: the scale function is written without handling the transition correctly between segments, producing pixel-position discontinuities at era joins that manifest as cards "jumping" position when the scale recomputes (e.g., after a filter).

**Why it happens:**
The scale is defined in two places: the pixel-mapping function (often `lib/timeline-scale.ts`) and the era data (JSON/DB). They drift when an editor adjusts era boundaries in the data without updating the scale coefficients.

**Consequences:**
Visual gaps or overlaps between era colour bands. Show cards placed near era boundaries appear in the wrong era. Historical event markers misaligned with their era's colour band.

**Prevention:**
Define era boundaries exactly once — in the era data records — and derive the scale function programmatically from those boundaries. The scale function receives era records as input and computes pixel offsets from them; it does not have hardcoded year constants. Use a piecewise linear interpolation function (not logarithmic — logarithmic is beautiful in theory but makes the `pixelsPerYear` ratio unintuitive for editorial adjustment):

```
function yearToPixel(year: number, eras: Era[]): number
function pixelToYear(px: number, eras: Era[]): number  // inverse, needed for hover tooltips
```

Both must be inverses of each other. Write a property test: for all years in range, `pixelToYear(yearToPixel(y, eras), eras) === y` within floating-point tolerance.

**Detection:**
Visual QA: render the timeline with no cards and check for visible gaps between era bands. Add a debug overlay that shows the raw pixel value for the cursor position and the era boundary markers.

**Phase:** Phase 1 (foundational — all card placement depends on this being correct).

---

## Moderate Pitfalls

Mistakes that cause significant rework or user experience degradation but are recoverable.

---

### Pitfall 6: Missing `prefers-reduced-motion` Disabling Parallax

**What goes wrong:**
Users with vestibular disorders, motion sickness, or epilepsy enable "Reduce Motion" in their OS settings. The app continues to animate all parallax layers, causing physical discomfort. This also violates WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions) and the project's WCAG AA hard requirement.

**Why it happens:**
Parallax is implemented as a visual feature and reduced-motion is treated as an afterthought. Framer Motion's `useReducedMotion()` hook exists but is not wired into the core scroll animation logic.

**Consequences:**
WCAG AA failure. Users with vestibular disorders cannot use the app. Legal risk in EU/France (RGAA requires WCAG AA for public-facing services). App effectively broken for ~35% of users who experience motion sensitivity to some degree.

**Prevention:**
In the timeline component, read `useReducedMotion()` from Framer Motion. When `true`, set all parallax layer speeds to 1.0 (no differential motion) — layers scroll at the same rate as the scroll container. The content remains fully accessible; only the depth illusion is removed. Do not hide or disable the timeline for reduced-motion users — just disable the parallax effect.

```typescript
const prefersReducedMotion = useReducedMotion()
const parallaxFactor = prefersReducedMotion ? 0 : layerSpeed
```

Also add a CSS media query fallback for any CSS-driven parallax:
```css
@media (prefers-reduced-motion: reduce) {
  .parallax-layer { transform: none !important; }
}
```

**Detection:**
OS Settings > Accessibility > Reduce Motion. Run WCAG audit with axe-core after enabling this setting. The timeline must be fully usable.

**Phase:** Phase 1 (accessibility is a hard requirement, not post-launch polish).

---

### Pitfall 7: Horizontal Scroll `touch-action` Conflict on Mobile

**What goes wrong:**
The horizontal scroll container sets `overflow-x: auto` but does not set `touch-action: pan-x`. The browser's default touch-action on the document is `auto`, which means vertical scroll takes priority. On iOS Safari, a touch gesture that is not perfectly horizontal triggers `pointercancel`, cancelling the horizontal scroll mid-gesture. The result: the timeline is nearly impossible to scroll horizontally on mobile — every finger movement that deviates by a few degrees from perfectly horizontal gets hijacked as a vertical page scroll.

**Why it happens:**
Desktop testing does not reveal this bug (mouse drag works differently). iOS Safari specifically sends `pointercancel` for ambiguous gestures on elements without explicit `touch-action`.

**Consequences:**
The core mobile UX — "zero friction horizontal swipe" (UX-02) — is completely broken on iOS Safari, which is the primary mobile browser for the French-speaking target audience.

**Prevention:**
Set `touch-action: pan-x` on the scroll container element. This tells the browser "horizontal panning only; do not attempt vertical scrolling here." Add `overscroll-behavior-x: contain` to prevent the horizontal overscroll from propagating to the document's vertical scroll. Verify with `touch-action: pan-x pinch-zoom` if pinch-zoom on the timeline is desired.

The iOS Safari 100dvh pitfall also applies: use `height: 100dvh` for the outer shell, not `height: 100vh`, to account for the collapsing/expanding address bar. Do not rely on `100vh` for any layout calculation in the scroll container.

**Detection:**
Test on a physical iPhone with Safari (device emulation in Chrome DevTools does not reproduce the touch-action bug). The test: swipe diagonally at ~20° from horizontal. The timeline should still scroll horizontally. If it stalls or jumps vertically, `touch-action` is not set correctly.

**Phase:** Phase 1.

---

### Pitfall 8: Keyboard Navigation Dead End

**What goes wrong:**
The timeline is built as a wide `div` with no keyboard affordances. Keyboard users (Tab, arrow keys) cannot navigate to individual show cards. Screen reader users receive no meaningful context when cards are focused (no `aria-label`, no meaningful DOM order). The entire timeline is announced as a single unlabelled region.

**Why it happens:**
Keyboard and screen-reader testing happens late (or never), after the visual implementation is complete and refactoring DOM structure is expensive.

**Consequences:**
WCAG AA failure on keyboard navigation (SC 2.1.1) and name, role, value (SC 4.1.2). Teachers and accessibility-dependent users in the target audience (P3 persona) cannot use the app.

**Prevention:**
Design the DOM structure for accessibility from the start. The scroll container should be a `<section aria-label="Historical Timeline">` with `tabIndex={0}` to receive keyboard focus. When focused, `←`/`→` arrow keys move between show cards (PRD feature F-05). Each show card is a `<article>` with `aria-label="{title}, {narrativeYears}, {era}"`. Show cards receive `tabIndex={0}` and handle `Enter`/`Space` to open the detail panel.

The scrollIntoView pattern: when a card receives focus via Tab or arrow key, call `element.scrollIntoView({ behavior: 'smooth', inline: 'center' })` to auto-scroll the timeline to that card.

**Detection:**
Tab through the page from the browser address bar. You should reach the timeline, then be able to arrow-key through cards, and Enter to open a card detail. Run axe-core in CI — it catches missing labels and role failures automatically.

**Phase:** Phase 1 (DOM structure refactor is expensive if left to later).

---

### Pitfall 9: next-intl Static Rendering Opt-Out

**What goes wrong:**
Every page using `useTranslations()` in a Server Component renders dynamically (on each request) instead of statically. This defeats Next.js's static generation and ISR capabilities. The timeline page — the app's heaviest page — rebuilds on every request, adding 200–500ms server latency. More critically, `setRequestLocale()` is not called in the root layout, so the locale defaults to the fallback locale for all nested Server Components, causing the wrong language to appear for new visitors.

**Why it happens:**
The next-intl documentation buries `setRequestLocale` in a secondary section titled "Static Rendering." Developers set up translation calls first and defer the performance configuration, then forget it.

**Consequences:**
All pages render dynamically. Build output shows 0 static pages. Locale detection silently falls back to French for English-speaking users visiting `/en` routes.

**Prevention:**
Call `setRequestLocale(locale)` at the top of every page and layout component that uses translations:

```typescript
// app/[locale]/layout.tsx
export default async function Layout({ params: { locale }, children }) {
  setRequestLocale(locale)  // must be first
  // ...
}
```

Validate the locale parameter before calling `setRequestLocale`. Use next-intl's `hasLocale()` guard and call `notFound()` for invalid locales. Add `generateStaticParams` to all `[locale]` segments to pre-generate all locale variants at build time.

Import `Link`, `useRouter`, `usePathname` exclusively from the routing configuration file (e.g., `@/i18n/navigation`), never from `next/navigation` directly. Using `next/navigation` bypasses locale-awareness and generates locale-stripped URLs.

**Detection:**
Run `next build`. The build output must show static pages (`○`) not dynamic (`ƒ`) for the timeline page. Check the built HTML: visiting `/en` should render English content in the initial HTML (before JS hydration), not French.

**Phase:** Phase 1 (routing structure must be correct before content is added).

---

### Pitfall 10: Missing `sizes` Prop on Show Card Posters

**What goes wrong:**
100+ show card `<Image>` components render without a `sizes` prop. Next.js defaults to assuming each image could be full viewport width, so it generates and caches a massive image (e.g., 1200px wide) even for a show card that renders at 120px wide. The result: each poster downloads 10x more bytes than necessary, multiplied across 100+ cards as the user scrolls.

**Why it happens:**
The `next/image` component works without `sizes` — it just performs poorly. The bug is invisible on fast Wi-Fi but catastrophic on 4G mobile.

**Consequences:**
Timeline initial load weight balloons to 15–30 MB in images. Scroll performance degrades as new images are fetched during scroll. LCP for the timeline skeleton exceeds the 1s target (PRD constraint UX-04). Mobile data usage is unacceptably high for the target French audience.

**Prevention:**
Add a `sizes` prop to every show card image that reflects its actual rendered size across breakpoints:

```tsx
<Image
  src={show.posterUrl}
  sizes="(max-width: 768px) 80px, 120px"
  width={120}
  height={180}
  alt={show.title.fr}
/>
```

Do not add `priority` to show card images — only the 1–3 initially visible hero images should be `priority`. The rest should lazy-load via Intersection Observer (Next.js default). Consider generating poster thumbnails at 120×180px on the CDN (Cloudinary `w_120,h_180,c_fill,f_auto`) rather than resizing at render time.

**Detection:**
Chrome DevTools Network panel > Img filter > check the downloaded image sizes for show cards. If any card image downloads at >200px width when the card renders at 120px, `sizes` is missing or incorrect.

**Phase:** Phase 1 (image infrastructure must be correct before 100+ shows are added).

---

### Pitfall 11: SEO Black Hole — Timeline Content Not Indexed

**What goes wrong:**
The timeline component renders show cards client-side only (inside a `'use client'` component with `useScroll` and motion values). Googlebot receives a page with a skeleton div and no show content in the initial HTML. Individual shows have no dedicated URLs. Result: 0 shows indexed, no organic discovery for queries like "série historique Antiquité" or "shows set in medieval France."

**Why it happens:**
The parallax scroll requires client-side motion APIs, so the entire timeline component is marked `'use client'`. This pulls all child components (including show cards) into the client bundle, removing them from SSR output.

**Consequences:**
The app is invisible to search engines. No organic traffic. Teachers cannot share a link to a specific era (US-03 user story). The show detail panel (F-12) has no indexable URL.

**Prevention:**
Separate the interactive shell from the data layer. The scroll container and motion wiring are `'use client'`; the show card content is rendered as Server Components passed as `children` via the composition pattern. This ensures show titles, narrative years, and historical context appear in the initial SSR HTML.

Add dedicated routes for each show: `/en/shows/[slug]` with `generateMetadata` returning title, description, and Open Graph tags derived from the show's historical context. Add `generateStaticParams` to pre-render all show pages at build time. Inject `application/ld+json` structured data (Schema.org `TVSeries` or `Event` type) for rich results.

Add a sitemap at `/sitemap.xml` generated by `next-sitemap` or Next.js built-in sitemap support, listing all show pages and the main timeline page with locale alternates.

**Detection:**
Run `curl -A "Googlebot" https://yoursite.com/en` and check the HTML response. Show card titles must appear in the raw HTML — not injected by JavaScript. Verify with Google Search Console's URL inspection tool after launch.

**Phase:** Phase 1 for RSC composition pattern. Show detail pages and sitemap in Phase 1 or early Phase 2 before any SEO benefit can accumulate.

---

## Minor Pitfalls

Recoverable mistakes that cause friction but not rewrites.

---

### Pitfall 12: Framer Motion MotionValue Memory Leaks on Unmount

**What goes wrong:**
`useTransform` creates a subscription from `scrollX` to a derived value. If the scroll container unmounts and remounts (e.g., during filter state changes that re-render the layout), the subscription is not cleaned up if the component is improperly structured. In React Strict Mode (Next.js default in development), effects run twice, surfacing this as doubled subscriptions in development.

**Prevention:**
Use Framer Motion's `useTransform` and `useScroll` at the component level, not in utility functions that return raw `MotionValue` without cleanup. Ensure the scroll ref is stable (use `useRef` not inline ref callbacks). Avoid creating `motionValue()` instances outside of components or hooks. Upgrade to Framer Motion 11.3+ which includes memory leak fixes for SSR/unmount scenarios.

**Detection:**
Chrome DevTools Memory > Heap Snapshot, take snapshot, navigate away from timeline, take another snapshot. If `MotionValue` count does not decrease, a leak is present.

**Phase:** Phase 1 (establish the correct pattern from the start; fixing later requires auditing all motion values).

---

### Pitfall 13: Over-Engineering the Parallax in Phase 1

**What goes wrong:**
Phase 1 parallax gets expanded to include: per-card depth variation, velocity-based damping, spring physics on layer position, blur on background layers, and particle effects for era transitions. Each feature requires additional MotionValue instances, event listeners, and render cycles. The timeline ships late or is dropped entirely because the animation system is never "good enough."

**Why it happens:**
The parallax is the most exciting part of the project. Developers over-invest in animation fidelity before validating that the core value (historical discovery) works.

**Consequences:**
Phase 1 scope creep. Core features (filtering, search, show detail) are delayed. The animation system is over-optimised for edge cases that real users don't notice.

**Prevention:**
Phase 1 parallax specification: exactly 3 layers (era background, timeline axis, show cards), two fixed speed ratios (0.3x for background, 1.0x for cards). No spring physics, no velocity damping, no per-card depth. Add a `PARALLAX_ENABLED` feature flag (environment variable) to disable all parallax and run the timeline as a static horizontal scroll — this is useful for performance benchmarking and for testing the data/feature layer in isolation.

All parallax enhancements (spring physics, depth variation, era transition effects) are deferred to Phase 2 or Phase 3 after the core discovery loop is validated with real users.

**Detection:**
If a sprint log shows more than 20% of Phase 1 time spent on animation tuning rather than data, filtering, or content, the project has drifted into over-engineering.

**Phase:** Phase 1 (prevention is the only strategy; there is no fix once scope creep has started).

---

### Pitfall 14: i18n String Extraction Left for Last

**What goes wrong:**
The app is built in French first, with English translations added before launch. UI strings are hardcoded in JSX as French (`<p>Découvrir par époque</p>`), extracted to translation keys late, and the extraction pass introduces regressions when key names conflict or nested namespaces are not set up consistently.

**Why it happens:**
French is the author's primary language; English feels like a translation task rather than an architecture decision.

**Consequences:**
Translation key naming is inconsistent across components. Some strings are never extracted and ship untranslated in English. The `useTranslations` calls are added to components that were not built with i18n in mind, requiring component refactoring.

**Prevention:**
Set up next-intl with `en.json` and `fr.json` before writing any UI strings. Every string that appears in the UI must come from a translation key, even during development. Use TypeScript strict mode with next-intl's type generation to get a compile error for missing keys. Namespace translation keys by component: `timeline.filters.label`, `showCard.accuracy.tooltip`, etc.

**Detection:**
Run `next build` with strict TypeScript. Any untranslated string throws a type error if next-intl's type generation is enabled. Visual QA: switch locale to English and scan for French strings remaining in the UI.

**Phase:** Phase 1 (must be set up before any UI component is written).

---

## Phase-Specific Warnings

| Phase | Topic | Likely Pitfall | Mitigation |
|-------|-------|---------------|------------|
| Phase 1 | Timeline core | GPU layer explosion from promoting 100+ cards | Establish layer budget, use parent transform |
| Phase 1 | Timeline core | Layout property animation causing reflow | Lint rule: no `style.top` / `style.left` in animated components |
| Phase 1 | Data model | BC date round-trip corruption via node-postgres | Use INTEGER column, custom `yearToDisplay` util, unit tests |
| Phase 1 | Scale function | Era boundary discontinuity | Single source of truth for era boundaries, property test for `yearToPixel` ↔ `pixelToYear` |
| Phase 1 | Mobile | `touch-action` conflict blocking horizontal swipe on iOS | Physical device testing, not emulation |
| Phase 1 | i18n | `setRequestLocale` missing, dynamic rendering everywhere | next-intl setup task before any page component |
| Phase 1 | Images | Missing `sizes` prop — oversized poster downloads | Image component wrapper that enforces `sizes` |
| Phase 1 | Accessibility | Parallax with no reduced-motion fallback — WCAG AA failure | `useReducedMotion()` wired on day one |
| Phase 1 | SEO | Timeline content in `'use client'` component, not indexed | RSC composition pattern from the start |
| Phase 2 | Search | Algolia vs Supabase FTS choice deferred — integrating Algolia into existing filtering state requires Zustand store refactor | Decide in Phase 1 design; don't add Algolia as a bolt-on |
| Phase 2 | Auth | Supabase Auth cookie handling conflicts with next-intl middleware | Research Supabase + next-intl middleware chaining before Phase 2 starts |
| Phase 3 | Community contributions | User-submitted BC dates with no validation — year zero off-by-one errors in user input form | Front-end validation using the same `yearToDisplay`/`yearFromDisplay` utilities |

---

## Sources

- Chrome for Developers — Performant Parallaxing: https://developer.chrome.com/blog/performant-parallaxing
- Framer Motion Animations Patterns and Pitfalls (DEV Community): https://dev.to/whoffagents/framer-motion-animations-that-dont-kill-performance-patterns-and-pitfalls-5cki
- Motion.dev — useScroll documentation: https://motion.dev/docs/react-use-scroll
- Motion.dev — React scroll animations: https://motion.dev/docs/react-scroll-animations
- node-postgres BC date serialisation bug — PR #1864: https://github.com/brianc/node-postgres/pull/1864
- postgres-date BC dates parsed incorrectly — Issue #5: https://github.com/bendrucker/postgres-date/issues/5
- Astronomical year numbering — Wikipedia: https://en.wikipedia.org/wiki/Astronomical_year_numbering
- next-intl App Router setup: https://next-intl.dev/docs/getting-started/app-router
- next-intl routing configuration: https://next-intl.dev/docs/routing/setup
- WCAG 2.1 SC 2.3.3 — Animation from Interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- Creating Accessible Parallax Websites (DubBot): https://dubbot.com/dubblog/2024/creating-accessible-parallax-websites.html
- GPU Animation Doing It Right — Smashing Magazine: https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/
- I Crashed a Mobile Browser With `will-change` (DEV Community): https://dev.to/ouvarov/i-crashed-a-mobile-browser-with-one-css-property-heres-what-i-learned-about-rendering-3o53
- CSS fix for 100vh in mobile WebKit — CSS-Tricks: https://css-tricks.com/css-fix-for-100vh-in-mobile-webkit/
- touch-action MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
- Next.js Image Optimization official docs: https://nextjs.org/docs/14/app/building-your-application/optimizing/images
- Next.js SEO — Metadata and OG Images: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- Framer Motion memory leak fix — Issue #434: https://github.com/framer/motion/issues/434
