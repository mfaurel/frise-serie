---
estimated_steps: 17
estimated_files: 1
skills_used: []
---

# T01: Convert TimelineContainer to parallax Client Component with era nebula backgrounds

Why: Parallax requires reading scrollLeft (a browser-only API), so the Server Component from S02 must become a Client Component. Era colorPalette arrays (4 hex stops each) drive per-era CSS gradient backgrounds. Direct DOM mutation via refs avoids React re-renders on each scroll event, keeping animation at 60fps.

Do:
1. Add 'use client' at the top of the file.
2. Import useRef and useCallback from 'react'.
3. Declare three refs: scrollRef (outer div), bgLayerRef (background layer div), axisLayerRef (axis layer div).
4. Implement handleScroll callback: reads scrollLeft from scrollRef.current and directly sets bgLayerRef.current.style.transform = `translateX(${sl * 0.7}px)` and axisLayerRef.current.style.transform = `translateX(${sl * 0.4}px)`. Do NOT use useState here — direct DOM mutation avoids React re-renders on the hot scroll path.
5. Restructure JSX into 3 absolutely-positioned layers inside the existing outer/inner div structure:
   - Outer: <div ref={scrollRef} data-testid="timeline-scroll" onScroll={handleScroll} className="overflow-x-auto w-full" style={{ height: '100vh' }}>
   - Inner: <div data-testid="timeline-inner" style={{ width: totalWidth, height: '100%', position: 'relative' }}>
   - Layer 1 (bg, 0.3x): <div ref={bgLayerRef} data-testid="parallax-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
       Per era: <div key={era.id} data-testid="era-bg" style={{ position: 'absolute', left: yearToPixel(era.yearStart, zones), top: 0, bottom: 0, width: yearToPixel(era.yearEnd, zones) - yearToPixel(era.yearStart, zones), background: `linear-gradient(to right, ${era.colorPalette.join(', ')})` }} />
   - Layer 2 (axis, 0.6x): <div ref={axisLayerRef} data-testid="parallax-axis" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
       Era year labels (keep existing data-testid="year-label" spans, moved here from flat inner div)
   - Layer 3 (cards, 1.0x): <div data-testid="parallax-cards" style={{ position: 'absolute', inset: 0 }}> (empty placeholder for M003 show cards)
6. Remove the old year-label rendering from the flat inner div — it moves exclusively into Layer 2.
7. Parallax speed math: when container scrollLeft = S, layer visible speed = S * speedFactor. For a layer that moves at speedFactor, apply transform translateX(S * (1 - speedFactor)). Background (0.3x): translateX(S * 0.7). Axis (0.6x): translateX(S * 0.4). Cards (1.0x): no transform.

Done when: npm run typecheck exits 0 with zero TypeScript diagnostics. All 3 parallax layers present in JSX with correct data-testid attributes. S02 data-testids (timeline-scroll, timeline-inner, year-label) are preserved.

## Inputs

- `app/components/TimelineContainer.tsx`
- `data/eras.ts`
- `lib/yearToPixel.ts`
- `lib/density.ts`
- `lib/constants.ts`
- `types/index.ts`

## Expected Output

- `app/components/TimelineContainer.tsx`

## Verification

npm run typecheck

## Observability Impact

Scroll-driven transforms are visible in browser DevTools Elements panel under style.transform for parallax-bg and parallax-axis divs. No structured log output.
