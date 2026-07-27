---
estimated_steps: 12
estimated_files: 1
skills_used: []
---

# T01: Create TimelineContainer server component with scrollable div and year axis labels

Why: app/page.tsx currently shows only a centered heading. This task creates the timeline UI component — a horizontally-scrollable div whose pixel width equals the last density zone's pixelEnd, with era-boundary year labels absolutely positioned using yearToPixel.

Do:
1. Create app/components/TimelineContainer.tsx as a Next.js Server Component (no 'use client' — data imports are synchronous, no browser APIs needed).
2. Import: shows from @/data/shows, eras from @/data/eras, buildDensityZones from @/lib/density, yearToPixel from @/lib/yearToPixel, VIRTUAL_CANVAS_WIDTH from @/lib/constants.
3. Call buildDensityZones(shows, eras, VIRTUAL_CANVAS_WIDTH) to produce zones[].
4. Compute totalWidth = zones[zones.length - 1].pixelEnd.
5. Render:
   - Outer div: data-testid="timeline-scroll", className="overflow-x-auto w-full", height 80px.
   - Inner div: data-testid="timeline-inner", style={{ width: totalWidth, position: 'relative', height: '100%' }}.
   - For each era in eras[], compute px = yearToPixel(era.yearStart, zones) and render a span: data-testid="year-label", style={{ position: 'absolute', left: px, top: 4 }}, className="text-xs text-white/70 select-none". Label text: era.yearStart < 0 ? Math.abs(era.yearStart) + ' BC' : era.yearStart + ' AD'.
6. Export as default function TimelineContainer.

Done when: npm run typecheck exits 0 — no TypeScript errors in the new component or any file it imports.

## Inputs

- `data/shows.ts`
- `data/eras.ts`
- `lib/density.ts`
- `lib/yearToPixel.ts`
- `lib/constants.ts`
- `types/index.ts`

## Expected Output

- `app/components/TimelineContainer.tsx`

## Verification

npm run typecheck

## Observability Impact

npm run typecheck exits 0 with no diagnostics on success; TypeScript errors name exact file and line on failure.
