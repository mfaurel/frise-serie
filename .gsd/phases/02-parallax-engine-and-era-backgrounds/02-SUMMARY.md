---
id: M002
title: "Parallax Engine and Era Backgrounds"
status: complete
completed_at: 2026-07-30T15:07:26.838Z
key_decisions:
  - Switched scroll axis from horizontal to vertical (overflow-y) to match V5-atlas-editorial design reference
  - Parallax layers driven by direct DOM mutation (useRef + style.transform) rather than useState to avoid 60fps re-render overhead
  - TimelineContainer converted to Client Component in S03 when scroll event listeners and DOM refs became necessary
  - next.config.ts uses output: 'export' + images.unoptimized for fully static HTML output
key_files:
  - app/components/TimelineContainer.tsx
  - app/page.tsx
  - lib/yearToPixel.ts
  - lib/density.ts
  - lib/constants.ts
  - next.config.ts
  - postcss.config.mjs
  - playwright.config.ts
lessons_learned:
  - Direct DOM mutation via useRef is the correct pattern for scroll-driven animation — setState on the scroll path causes layout thrash at 60fps
  - Tailwind v4 uses @tailwindcss/postcss in postcss.config.mjs and @import 'tailwindcss' in globals.css — no tailwind.config file needed
---

# M002: Parallax Engine and Era Backgrounds

**Built the Next.js scaffold, vertical-scroll timeline container with yearToPixel width, and 3-layer parallax with era nebula backgrounds.**

## What Happened

M002 delivered the full visual foundation for the Frise Série timeline in three sequential slices.

S01 bootstrapped the Next.js 16 App Router project with static export (out/index.html), Tailwind v4 via @tailwindcss/postcss, and Playwright smoke test infrastructure. `npm run build` and `npm run typecheck` both exit clean.

S02 introduced the timeline container with a horizontally (later revised to vertically per design decision) scrolling inner div whose height is derived from the sum of yearToPixel density zones. Year-axis labels are positioned at correct pixel offsets. The design alignment decision switched scroll axis to vertical (overflow-y) matching V5-atlas-editorial.

S03 converted TimelineContainer to a Client Component ('use client') to enable scroll event listeners, added three composited layers (background 0.3×, axis 0.6×, cards 1.0×) driven by direct DOM mutation via useRef to avoid React re-render overhead on every scroll frame, and applied era-specific nebula gradient backgrounds using the V5-atlas-editorial dark void palette.

## Success Criteria Results

Not provided.

## Definition of Done Results

Not provided.

## Requirement Outcomes

Not provided.

## Deviations

None.

## Follow-ups

None.
