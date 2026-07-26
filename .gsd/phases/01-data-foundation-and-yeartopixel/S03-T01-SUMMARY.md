---
id: T01
parent: S03
milestone: M001
key_files:
  - lib/yearToDisplay.ts
  - tests/year-to-display.test.ts
key_decisions:
  - Defined a local Locale = "fr" | "en" union type in lib/yearToDisplay.ts since no shared Locale type existed in types/index.ts yet
duration: 
verification_result: passed
completed_at: 2026-07-26T20:37:58.995Z
blocker_discovered: false
---

# T01: Added lib/yearToDisplay.ts formatting historical years to FR/EN display strings (BC/AD, year-0 century edge case) with 11 Vitest cases.

**Added lib/yearToDisplay.ts formatting historical years to FR/EN display strings (BC/AD, year-0 century edge case) with 11 Vitest cases.**

## What Happened

Implemented yearToDisplay(year, locale) per TECHNICAL.md section 13's spec table: positive years pass through unchanged (both locales share the same string), negative (BC) years render as `{abs} av. J.-C.` in French or `{abs} BC` in English, and year 0 renders as the historical "1st century" placeholder ('Ier s.' / '1st c.'). No existing lib/types exposed a Locale type, so a local `Locale = "fr" | "en"` union was added to the new module, matching the fr/en pattern already used elsewhere in types/index.ts (e.g. Show.title). Wrote tests/year-to-display.test.ts with 11 cases following the existing test file's plain describe/it style (see tests/year-to-pixel.test.ts): the two roadmap demo assertions (-73 in fr/en), the TECHNICAL.md table's -3000 example, both locales of the year-0 edge case, positive-year pass-through (including year 1, the first AD year) in both locales, and the -1/0 boundary distinction confirming no year-zero collapsing. No changes were needed to yearToPixel.ts or any other existing file — yearToDisplay is a standalone pure function with no consumers yet, same posture as S02's lib functions before a Timeline/UI component exists.

## Verification

Ran the task's two specified verification commands via gsd_exec, plus a full-suite regression check: `npx vitest run tests/year-to-display.test.ts` (11/11 new tests pass), `npx tsc --noEmit` (strict-mode project-wide typecheck, zero errors), and `npx vitest run` (all suites, no regressions to the existing 25 data-integrity + 25 yearToPixel tests).

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx vitest run tests/year-to-display.test.ts` | 0 | pass | 2907ms |
| 2 | `npx tsc --noEmit` | 0 | pass | 3740ms |
| 3 | `npx vitest run` | 0 | pass | 3449ms |

## Deviations

none

## Known Issues

none

## Files Created/Modified

- `lib/yearToDisplay.ts`
- `tests/year-to-display.test.ts`
