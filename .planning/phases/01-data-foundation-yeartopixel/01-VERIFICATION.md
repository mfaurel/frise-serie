---
phase: 01-data-foundation-yeartopixel
verified: 2026-05-17T23:37:00Z
status: passed
score: 5/5 must-haves verified
overrides_applied: 0
---

# Phase 1: Data Foundation + yearToPixel — Verification Report

**Phase Goal:** Lock the mathematical backbone before any visual work — rebuild yearToPixel() as a non-linear, era-aware piecewise function, add unit tests (Vitest), expand the seed dataset to 30 shows spanning 3000 BC to present, update the HistoricalEra type to carry per-era pixelsPerYear. No UI work — purely data and math.
**Verified:** 2026-05-17T23:37:00Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | yearToPixel and pixelToYear are inverse-verified — Vitest suite passes with round-trip for 15 years | VERIFIED | `npm run test:run` exits 0; 38 tests pass across 2 files including full `pixelToYear round-trip — all 15 D-13 test years` describe block |
| 2 | Non-linear scale: renaissance denser than antiquity (renaissance pixelsPerYear: 5.0, antiquity: 1.0) | VERIFIED | `data/eras.ts` has `pixelsPerYear: 1.0` for antiquity and `pixelsPerYear: 5.0` for renaissance; test `produces denser pixels for renaissance vs antiquity` asserts and passes |
| 3 | data/eras.ts defines all 9 eras with pixelsPerYear; all era boundaries derived from data/eras.ts only (no duplicated constants in lib/) | VERIFIED | `grep -c "pixelsPerYear" data/eras.ts` → 9; `lib/yearToPixel.ts` line 46: `export const TIMELINE_START: number = ERAS[0].yearStart`; no hardcoded -3000 in lib/; PIXELS_PER_YEAR absent from data/eras.ts |
| 4 | 30 shows spanning -1200 to 2005, TypeScript-clean (npx tsc --noEmit exits 0) | VERIFIED | `grep -c "id: '" data/shows.ts` → 30; earliest `narrativeYearStart: -1200` (troy_fall_of_a_city); latest narrative end 2005 (the_crown); `npx tsc --noEmit` produces no output (exit 0) |
| 5 | BC convention documented in CLAUDE.md; yearToDisplay() handles year -1, 0, -3000 correctly | VERIFIED | CLAUDE.md: "negative = BC, direct negation: -52 = 52 BC, -1 = 1 BC"; `yearToDisplay.test.ts` passes tests: `yearToDisplay(-1, 'en') === '1 BC'`, `yearToDisplay(0, 'en') === '1 BC'`, `yearToDisplay(-3000, 'en') === '3000 BC'` |

**Score:** 5/5 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `lib/yearToPixel.ts` | Piecewise yearToPixel + pixelToYear + TOTAL_WIDTH + TIMELINE_START + TIMELINE_END | VERIFIED | All 5 exports present; 105 lines of substantive implementation with JSDoc; TIMELINE_START derived from ERAS[0].yearStart (D-04 compliant) |
| `lib/yearToDisplay.ts` | yearToDisplay(year, locale) with year-0 guard | VERIFIED | 31 lines; year-0 guard on line 20 (`const displayYear = year === 0 ? -1 : year`); exports `yearToDisplay` |
| `lib/timeline.ts` | Pure re-export shim — no implementation logic | VERIFIED | 4 lines total; re-exports from `./yearToPixel` and `./yearToDisplay` only; no function bodies or constants |
| `data/eras.ts` | 9 eras with pixelsPerYear, last era yearEnd: 2025 | VERIFIED | 9 era objects each with pixelsPerYear; `20th_century_late` has `yearEnd: 2025`; PIXELS_PER_YEAR / TIMELINE_START / TIMELINE_END constants removed |
| `data/shows.ts` | 30 Show entries spanning -1200 to 2005 | VERIFIED | 30 entries confirmed; Bronze Age show at -1200; Classical Greece at -334; latest end year 2005; TypeScript-clean |
| `types/index.ts` | HistoricalEra interface with pixelsPerYear: number field | VERIFIED | Line 82: `pixelsPerYear: number;` present between `yearEnd` and `gradient` |
| `lib/yearToPixel.test.ts` | Full test suite including round-trip for 15 years | VERIFIED | 38 total passing tests; `describe('pixelToYear round-trip — all 15 D-13 test years')` block present with parametric tests |
| `lib/yearToDisplay.test.ts` | Full test suite for yearToDisplay | VERIFIED | 10 passing tests covering FR/EN BC formatting, year-0 guard, default locale |
| `vitest.config.mts` | Vitest config with tsconfigPaths + react plugins | VERIFIED | Contains `tsconfigPaths()` before `react()`; `environment: 'node'` |
| `CLAUDE.md` | Correct stack versions and BC dates convention | VERIFIED | Stack line: "Next.js 14.2, Framer Motion 11, Tailwind CSS 3, next-intl 3"; BC line: "direct negation: -52 = 52 BC, -1 = 1 BC" |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `lib/yearToPixel.ts` | `data/eras.ts` | `import { ERAS } from '@/data/eras'` | WIRED | Line 17 import; ERAS used in buildOffsets(), TIMELINE_START/END derived from it |
| `lib/yearToPixel.ts` | `types/index.ts` | `import type { HistoricalEra } from '@/types'` | WIRED | Line 18; HistoricalEra used as param type in buildOffsets() |
| `lib/timeline.ts` | `lib/yearToPixel.ts` | re-export `from './yearToPixel'` | WIRED | Line 3; exports yearToPixel, pixelToYear, TOTAL_WIDTH, TIMELINE_START, TIMELINE_END |
| `lib/timeline.ts` | `lib/yearToDisplay.ts` | re-export `from './yearToDisplay'` | WIRED | Line 4; exports yearToDisplay as formatYear |
| `data/eras.ts` | `types/index.ts` | `import type { HistoricalEra } from '@/types'` | WIRED | Line 1; all 9 era objects conform to HistoricalEra interface including pixelsPerYear |
| `data/shows.ts` | `types/index.ts` | `import type { Show } from '@/types'` | WIRED | SHOWS array typed as Show[]; 30 entries pass TypeScript validation |
| `lib/yearToPixel.test.ts` | `lib/yearToPixel.ts` | `from './yearToPixel'` | WIRED | All 5 exports imported and used in assertions |
| `lib/yearToDisplay.test.ts` | `lib/yearToDisplay.ts` | `from './yearToDisplay'` | WIRED | yearToDisplay imported and tested |

---

### Data-Flow Trace (Level 4)

Not applicable — this phase produces no data-rendering components. All artifacts are pure math functions, TypeScript data constants, and test files. No dynamic data render path exists to trace.

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| All 38 Vitest tests pass | `npm run test:run` | 38 passed (2 files), exit 0, 495ms | PASS |
| TypeScript globally clean | `npx tsc --noEmit` | No output (exit 0) | PASS |
| 9 eras have pixelsPerYear | `grep -c "pixelsPerYear" data/eras.ts` | 9 | PASS |
| Last era ends at 2025 | `grep "yearEnd: 2025" data/eras.ts` | Match found | PASS |
| 30 shows in dataset | `grep -c "id: '" data/shows.ts` | 30 | PASS |
| CLAUDE.md has Next.js 14.2 | `grep "Next.js 14.2" CLAUDE.md` | Match found | PASS |
| CLAUDE.md has direct negation | `grep "direct negation: -52 = 52 BC" CLAUDE.md` | Match found | PASS |
| Old Next.js 16 reference removed | `grep "Next.js 16" CLAUDE.md` | No match | PASS |
| TIMELINE_START derived from ERAS | `grep "TIMELINE_START.*ERAS\[0\]" lib/yearToPixel.ts` | Line 46 matches | PASS |
| timeline.ts has no implementation logic | `grep "function yearToPixel\|PIXELS_PER_YEAR" lib/timeline.ts` | No match | PASS |
| No year 0 in show data | `grep -c "narrativeYearStart: 0" data/shows.ts` | 0 | PASS |
| No debt markers (TBD/FIXME/XXX) | `grep -c "TBD\|FIXME\|XXX"` across all modified files | 0 in all files | PASS |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| TL-02 | 01-01, 01-02, 01-03, 01-04, 01-05 | Timeline uses non-linear time scale (denser for era-rich periods) | SATISFIED | piecewise yearToPixel with per-era pixelsPerYear implemented; renaissance 5.0 px/yr vs antiquity 1.0 px/yr; test suite passes |

---

### Anti-Patterns Found

None. Scan of all phase-modified files (`lib/yearToPixel.ts`, `lib/yearToDisplay.ts`, `lib/timeline.ts`, `data/eras.ts`, `data/shows.ts`, `types/index.ts`, `lib/yearToPixel.test.ts`, `lib/yearToDisplay.test.ts`, `CLAUDE.md`, `vitest.config.mts`) found:
- Zero TBD / FIXME / XXX markers
- Zero TODO / HACK / PLACEHOLDER comments
- No stub return patterns (`return null`, `return []`, `return {}`)
- No hardcoded empty props

The only `return TOTAL_WIDTH` fallback in `yearToPixel.ts` (line 78) is a documented unreachable guard, not a stub.

---

### ROADMAP Success Criteria Cross-Check

The ROADMAP SC-5 states "BC date convention (INTEGER, 0 = 1 BC, -1 = 2 BC)" — this is the old astronomical convention wording that predates the design decision D-05 (direct negation). The implementation correctly uses direct negation (-1 = 1 BC) per D-05, confirmed by CONTEXT.md, PATTERNS.md, and 01-05 PLAN.md which explicitly replaced this wording in CLAUDE.md. The ROADMAP wording is stale documentation — the actual code convention is correct and tested. This is not an implementation gap; the ROADMAP wording should be updated in a future housekeeping pass.

The ROADMAP SC-3 references `data/eras.json` but the project uses `data/eras.ts` (TypeScript, not JSON). This is the correct implementation choice per the validated stack (static TypeScript); the ROADMAP wording is stale.

Neither of these discrepancies affects the phase goal — both are ROADMAP documentation staleness, not implementation failures.

---

### Human Verification Required

None. All success criteria for Phase 1 are mathematical/data concerns verifiable programmatically. No UI, no visual behavior, no external services.

---

## Gaps Summary

No gaps found. All 5 observable truths are VERIFIED. The test suite runs 38 tests across 2 files, all passing. TypeScript is globally clean. The mathematical backbone is locked before any visual work begins, exactly as the phase goal specified.

---

_Verified: 2026-05-17T23:37:00Z_
_Verifier: Claude (gsd-verifier)_
