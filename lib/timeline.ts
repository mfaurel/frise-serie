// lib/timeline.ts — re-export shim (backward compat — Phase 2 will remove this file)
// Math → lib/yearToPixel.ts | Display → lib/yearToDisplay.ts
export { yearToPixel, pixelToYear, TOTAL_WIDTH, TIMELINE_START, TIMELINE_END } from './yearToPixel';
export { yearToDisplay as formatYear } from './yearToDisplay';
