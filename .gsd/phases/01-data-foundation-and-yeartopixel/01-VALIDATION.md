---
verdict: needs-attention
remediation_round: 0
---

# Milestone Validation: M001

## Success Criteria Checklist
## MV01 — Success Criteria Checklist

- [x] TypeScript interfaces for Show, Era, HistoricalEvent, Genre, Region, Platform match PRD data model — `types/index.ts` exports `Genre`, `Region`, `Platform`, `Show`, `HistoricalEvent`, `Era` (plus `DensityZone`, `LocalizedString`, `Flashback`); `npx tsc --noEmit` compiles the whole tree with zero errors (S01 Assessment: PASS).
- [x] Static data files with ~50 shows, 6+ eras, 20+ historical events — `data/shows.ts` = 53 shows, `data/eras.ts` = 9 eras, `data/events.ts` = 34 events, all counted directly from source and validated by `tests/data-integrity.test.ts` (25 passing cases; S01 Assessment: PASS).
- [x] yearToPixel and pixelToYear functions pass unit tests including BC dates, era boundaries, and density edge cases — `tests/year-to-pixel.test.ts`, 25 cases, part of the 86/86 passing suite confirmed live via `npx vitest run` (S02 Assessment: PASS).
- [x] buildDensityZones produces correct non-linear mapping from show distribution — `lib/density.ts` implements `buildDensityZones`, exercised by the same 25-case suite including zone/px-per-year assertions (S02 Assessment: PASS).
- [x] yearToDisplay formats BC dates correctly in FR and EN — `lib/yearToDisplay.ts` + `tests/year-to-display.test.ts` (11 cases), part of the 86/86 passing suite; roadmap demo case (`yearToDisplay(-73,'fr')` → '73 av. J.-C.', `(-73,'en')` → '73 BC') confirmed (S03 Assessment: PASS).
- [x] All pure functions tested with Vitest — 100% branch coverage on yearToPixel — `@vitest/coverage-v8` is now installed and wired into `vitest.config.ts` (`coverage.include: ['lib/**']`, `npm run test:coverage`). `yearToPixel.ts` and `pixelToYear.ts` are confirmed at 100% statement/branch/function/line coverage via `npx vitest run --coverage`. `density.ts` is 100% statement/line/function but 88.88% branch (61/63): the two uncovered branches (`density.ts:38,51`) are the `?? 0` fallback in `showCountByEra.get(era.id) ?? 0`, unreachable under the function's own invariant that `showCountByEra` is pre-populated with every `sortedEras` id before either read — documented as an accepted defensive-code gap, not an unmet requirement.

**Result:** 6/6 criteria evidenced. Coverage is now tooled and measured (not manually traced); the one sub-100% branch figure in `density.ts` is explained and accepted as unreachable defensive code rather than silently claimed as 100%.

## Slice Delivery Audit
## MV02 — Slice Delivery Audit

| Slice | SUMMARY.md | ASSESSMENT verdict | Outstanding items |
|---|---|---|---|
| S01: TypeScript types and static data files | Present | PASS | None blocking — known limitations (no yearToPixel/display yet) are expected sequencing, resolved by S02/S03. |
| S02: yearToPixel density algorithm | Present | PASS | Resolved by 2026-07-27 validation audit: `@vitest/coverage-v8` installed, branch coverage now measured (not manually traced); `yearToPixel.ts`/`pixelToYear.ts` at 100%, `density.ts` at 88.88% with the remaining gap documented as unreachable defensive code. Not yet wired into any UI component — expected, deferred to first UI-consuming slice per D001. |
| S03: Year display formatting and filter utilities | Present | PASS | Known limitation: no rendering-layer consumer yet for yearToDisplay/filters — expected, deferred to future filter-selection/axis-rendering slices. |

All three slices in the roadmap have a SUMMARY.md and an ASSESSMENT with verdict PASS. No missing artifacts. The only carried-forward outstanding item across slices is the manual (non-tooled) branch-coverage verification method for S02, which is a milestone-level gap rather than a slice-delivery failure — S02 completed all its own planned tasks and verification steps.

## Cross-Slice Integration
## MV03 — Cross-Slice Integration

| Boundary | Producer Summary | Consumer Summary | Status |
|---|---|---|---|
| S01→S02 (types/index.ts: DensityZone, Era, Show) | S01 provides types/index.ts | `lib/density.ts`, `lib/yearToPixel.ts`, `lib/pixelToYear.ts` import and use these types directly (confirmed by direct read) | Honored |
| S01→S02 (data/shows.ts, data/eras.ts) | S01 provides data/*.ts | `tests/year-to-pixel.test.ts` imports shows/eras and feeds them into `buildDensityZones`/`yearToPixel` | Honored |
| S01→S03 (types/index.ts: Genre, Platform, Region, Show) | S01 provides types/index.ts | `lib/filters.ts` imports and uses these types directly | Honored |
| S01→S03 (data/shows.ts) | S01 provides data/shows.ts | `tests/filters.test.ts` imports shows and exercises `filterShows`/`buildShowFilterPredicate` against real data | Honored |
| S02↔S03 | N/A — both depend only on S01 per roadmap | N/A | Not applicable — no mutual dependency declared or required |

Independently confirmed: whole-tree `npx tsc --noEmit` passes with zero errors, proving these boundaries compile together, not just in isolation. `npx vitest run` shows 86/86 tests passing across `data-integrity.test.ts`, `year-to-pixel.test.ts`, `year-to-display.test.ts`, `filters.test.ts`.

**Result:** All declared boundaries are honored with direct evidence. No integration gaps found.

## Requirement Coverage
## MV04 — Requirement Coverage

No separate R-numbered requirements file exists distinct from the roadmap's 6 success criteria for this milestone; those criteria are treated as the requirement set.

| Requirement | Status | Evidence |
|---|---|---|
| TypeScript interfaces for Show, Era, HistoricalEvent, Genre, Region, Platform match PRD data model | COVERED | `types/index.ts` defines all six types plus supporting `LocalizedString`/`Flashback`/`DensityZone`; verified against PRD per S01 summary. |
| Static data files with ~50 shows, 6+ eras, 20+ historical events | COVERED | 53 shows, 9 eras, 34 events counted directly from `data/*.ts`, exceeding stated minimums. |
| yearToPixel and pixelToYear functions pass unit tests including BC dates, era boundaries, and density edge cases | COVERED | 25-case suite in `tests/year-to-pixel.test.ts`, part of 86/86 passing tests confirmed live. |
| buildDensityZones produces correct non-linear mapping from show distribution | COVERED | `lib/density.ts` implementation exercised by the same test suite. |
| yearToDisplay formats BC dates correctly in FR and EN | COVERED | `lib/yearToDisplay.ts` + `tests/year-to-display.test.ts`, including year-0 century edge case. |
| All pure functions tested with Vitest — 100% branch coverage on yearToPixel | COVERED | Tests pass (91/91). `@vitest/coverage-v8` installed and run live: `yearToPixel.ts`/`pixelToYear.ts` 100% branch coverage; `density.ts` 88.88% branch (61/63), remaining gap is an unreachable `?? 0` defensive fallback, documented rather than hidden. |

**Result:** 6/6 requirements COVERED. No MISSING or PARTIAL requirements remain.

## Validation Audit 2026-07-27

| Metric | Count |
|--------|-------|
| Gaps found | 3 (untested `findEraForYear`-returns-undefined branch; two untested "gapped zones" fallback branches in `yearToPixel`/`pixelToYear`; unmeasured "100% branch coverage" claim) |
| Resolved | 3 (5 new test cases added to `tests/year-to-pixel.test.ts`; `@vitest/coverage-v8` installed and wired into `vitest.config.ts` + `npm run test:coverage`) |
| Escalated (human-only UAT) | 0 |

Test suite: 91/91 passing (`npx vitest run`). Coverage (`npx vitest run --coverage`, `lib/**` only): `yearToPixel.ts` 100%/100%/100%/100% (stmt/branch/func/line), `pixelToYear.ts` 100%/100%/100%/100%, `density.ts` 100%/88.88%/100%/100% — remaining 2 branches are the pre-populated-map `?? 0` fallback in `showCountByEra.get(era.id) ?? 0` (lines 38, 51), unreachable without violating the function's own loop invariant. No UI/exploratory surface exists yet in this milestone (pure-function phase, no rendering layer), so there are no human-UAT items to record.


## Verdict Rationale
All three independent reviewers agree the functional substance of M001 is solid: types match the PRD data model, static data exceeds minimums (53 shows/9 eras/34 events), yearToPixel/pixelToYear/buildDensityZones/yearToDisplay all pass a combined 86/86 Vitest suite covering BC dates and era boundaries, and cross-slice integration (S01's types/data consumed correctly by S02 and S03) is proven by both direct import inspection and a clean whole-tree `tsc --noEmit`. The single unresolved item — literal "100% branch coverage" — was verified only by manual code tracing because no coverage tooling (`@vitest/coverage-v8`) is installed; this is a verification-method gap, not evidence of an actual untested branch, so it does not warrant needs-remediation. No verification classes (Contract/Integration/Operational/UAT) were planned for this pure-function, no-UI milestone, which Reviewer C confirmed is consistent with all three slices' PLAN files (Proof Level: contract). Verdict: needs-attention.
