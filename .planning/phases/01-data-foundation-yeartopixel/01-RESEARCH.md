# Phase 1: Data Foundation + yearToPixel — Research

**Researched:** 2026-05-17
**Domain:** TypeScript data modelling, piecewise-linear mathematics, Vitest testing setup, historical TV series curation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** `pixelsPerYear` is baked into `data/eras.ts` as a static constant per era — not computed at runtime from show counts. (Dynamic calculation would shift all card positions as shows are added, breaking shareable URLs.)
- **D-02:** Ratios should reflect show density. Researcher must propose concrete `pixelsPerYear` values per era.
- **D-03:** Target total timeline width: **~8,000–10,000 px** (roughly 3–4× desktop viewport).
- **D-04:** `yearToPixel()` derives all era boundaries solely from `data/eras.ts` — no duplicated constants in `lib/`.
- **D-05:** **Direct negation** BC convention: `-52 = 52 BC`, `-1 = 1 BC`, `1 = 1 AD`. Existing 16 shows already conform.
- **D-06:** Year `0` is treated as `1 BC` in `yearToDisplay()` (display guard only — shows should not store `0`).
- **D-07:** Update `CLAUDE.md` "BC dates" constraint line to say "negative = BC, -52 = 52 BC".
- **D-08:** Additional shows (14–24 needed) are manually curated by researcher — no TMDB API enrichment in Phase 1.
- **D-09:** Priority era gaps: Ancient Near East (3000–500 BC), Classical Greece & Persia (500–300 BC), Late Antiquity & Byzantium (300–700 AD), Post-WWII to present (1945–2024).
- **D-10:** Data stays in **TypeScript (`.ts`)** format — both `data/shows.ts` and `data/eras.ts`.
- **D-11:** **Vitest** is the test framework to add.
- **D-12:** Test files are co-located: `lib/yearToPixel.test.ts`, `lib/yearToDisplay.test.ts`.
- **D-13:** Tests must cover: round-trip inverse, all era boundaries, year `0` display, `-3000`, BC/AD crossing.

### Claude's Discretion

None specified — all key choices are locked.

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TL-02 | Timeline uses a non-linear time scale (denser around era-rich periods, compressed for sparse ancient eras) so show cards are never overcrowded | Piecewise-linear yearToPixel with per-era pixelsPerYear, concrete values computed and verified below |

</phase_requirements>

---

## Summary

Phase 1 is pure math and data — no UI, no React, no server. It has three distinct deliverables: (1) a piecewise-linear `yearToPixel()` function in a new `lib/yearToPixel.ts` file, (2) an expanded `data/eras.ts` with `pixelsPerYear` per era and `TIMELINE_START = -3000`, and (3) a seed dataset of 30–40 shows covering the full 3000 BC–2025 timeline. The existing `lib/timeline.ts` uses a single linear `PIXELS_PER_YEAR = 0.8` with `TIMELINE_START = -100` — both must be replaced, not patched.

The piecewise formula is mathematically straightforward: precompute cumulative pixel offsets at each era boundary, then within any era use `offset[i] + (year - era.yearStart) * era.pixelsPerYear`. The inverse (`pixelToYear`) uses the same offset table in reverse. Verified via round-trip test: all 15 historical boundary years produce exact integer round-trips with floating-point accuracy at the millisecond level.

Vitest 4.1.6 installs cleanly alongside Next.js 14 with four packages: `vitest`, `@vitejs/plugin-react`, `jsdom`, and `vite-tsconfig-paths`. The math-only test files (`lib/yearToPixel.test.ts`, `lib/yearToDisplay.test.ts`) can use `environment: 'node'` — no jsdom needed for pure functions, which keeps test startup sub-100ms.

**Primary recommendation:** Implement `lib/yearToPixel.ts` as a pure function that receives `ERAS` at call time (not imported at module level), enabling isolated unit testing without mocking.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| yearToPixel math | Pure TypeScript (lib/) | — | Zero dependencies, must be unit-testable in isolation |
| yearToDisplay formatting | Pure TypeScript (lib/) | — | Locale-aware string formatting, no DOM, no React |
| Era definitions + pixelsPerYear | Data layer (data/eras.ts) | — | Static constants consumed by both lib/ and components |
| Show dataset | Data layer (data/shows.ts) | — | SSR-importable TypeScript, type-checked at build time |
| Type interfaces (Show, HistoricalEra) | Types (types/index.ts) | — | Single source of truth for all tiers |
| Backward-compat re-exports | lib/timeline.ts | — | Keep existing import paths working until Phase 2 cleans up |

---

## Standard Stack

### Core (no new runtime dependencies — this phase is pure TypeScript)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | 5.5.4 (already installed) | Type-safe era/show schema | Already in devDeps |
| Vitest | 4.1.6 | Unit test runner | Official Next.js recommendation; ESM-native; no Jest config overhead |
| @vitejs/plugin-react | 6.0.2 | JSX/TSX transform for test files | Required by Vitest when project uses React JSX |
| vite-tsconfig-paths | 6.1.1 | Resolves `@/` alias in test files | Reads tsconfig.json automatically; zero manual alias config |
| jsdom | 29.1.1 | DOM environment for future component tests | Standard Vitest pairing; install now, configure per-file environment |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @vitest/coverage-v8 | 4.1.6 | Code coverage reports | Optional — add if coverage gates are required in CI |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vitest | Jest | Jest requires Babel transform for ESM; Vitest works natively with Next.js/TypeScript; Vitest recommended by Next.js docs |
| vite-tsconfig-paths | Manual alias object in vitest.config | vite-tsconfig-paths reads tsconfig automatically; manual approach requires updating both tsconfig AND vitest.config when aliases change |

**Installation:**
```bash
npm install -D vitest @vitejs/plugin-react jsdom vite-tsconfig-paths
```

**Version verification (run at install time to confirm):**
```bash
npm view vitest version              # 4.1.6 as of 2026-05-17
npm view @vitejs/plugin-react version   # 6.0.2
npm view vite-tsconfig-paths version    # 6.1.1
npm view jsdom version              # 29.1.1
```

---

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| vitest | npm | ~4 years | 45M+ total | github.com/vitest-dev/vitest | [SUS] — false positive: "close to vite" | Approved — maintained by Evan You (Vue/Vite core), Anthony Fu; officially recommended by Next.js docs |
| @vitejs/plugin-react | npm | ~4 years | High | github.com/vitejs/vite-plugin-react | [OK] | Approved |
| vite-tsconfig-paths | npm | ~4 years | High | github.com/aleclarson/vite-tsconfig-paths | [OK] | Approved |
| jsdom | npm | ~13 years | 100M+/wk | github.com/jsdom/jsdom | [OK] | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** None

**Packages flagged as suspicious [SUS]:** `vitest` — slopcheck flagged as "close to vite" but this is a well-known false positive. Vitest is the official Vite testing framework maintained by the Vite core team (Evan You, Anthony Fu), recommended by Next.js official documentation [VERIFIED: nextjs.org/docs/app/guides/testing/vitest], with 45M+ npm downloads. The slopcheck flag is a name-similarity heuristic false positive.

---

## Architecture Patterns

### System Architecture Diagram

```
data/eras.ts  ──────────────────────────────────────────────────────────────┐
  ERAS: HistoricalEra[]                                                      │
  (yearStart, yearEnd, pixelsPerYear per era)                                │
                                                                             ▼
                                                               lib/yearToPixel.ts
data/shows.ts ─────────────────────────────────────────────►  yearToPixel(year, eras)
  SHOWS: Show[]                                                pixelToYear(px, eras)
  (narrativeYearStart, narrativeYearEnd, BC as negatives)      TOTAL_WIDTH
                                                                             │
                                                                             ▼
                                                               lib/yearToDisplay.ts
types/index.ts ────────────────────────────────────────────►  yearToDisplay(year, locale)
  HistoricalEra + pixelsPerYear field (new)                    (handles -1→"1 BC", 0→"1 BC")
  Show interface (unchanged)
                                                                             │
                                                               lib/timeline.ts (re-exports)
                                                               yearToPixel, pixelToYear,
                                                               TOTAL_WIDTH, formatYear
                                                               (backward compat until Phase 2)
```

### Recommended Project Structure (unchanged from CLAUDE.md)

```
lib/
  yearToPixel.ts          # NEW — piecewise math function
  yearToPixel.test.ts     # NEW — co-located unit tests (Vitest)
  yearToDisplay.ts        # NEW — BC/AD display formatting
  yearToDisplay.test.ts   # NEW — co-located unit tests
  timeline.ts             # MODIFIED — re-exports from new files (backward compat)
data/
  eras.ts                 # MODIFIED — add pixelsPerYear, fix TIMELINE_START = -3000
  shows.ts                # MODIFIED — add 14–24 new shows
types/
  index.ts                # MODIFIED — add pixelsPerYear: number to HistoricalEra
vitest.config.mts         # NEW — Vitest configuration
```

### Pattern 1: Piecewise-Linear yearToPixel

**What:** The function iterates sorted `ERAS` array, computes cumulative pixel offsets at each era boundary, then converts a year within its era to pixels.

**When to use:** Any time a year coordinate is needed for positioning.

**Formula:**
For a year `y` that falls in era `i` (where `era.yearStart <= y <= era.yearEnd`):
```
px = sum(era[0..i-1].pixelsPerYear * era[0..i-1].span) + (y - era[i].yearStart) * era[i].pixelsPerYear
```

Where `span = yearEnd - yearStart` for each era.

**Inverse formula:**
For a pixel value `px` that falls in era `i` (where `offset[i] <= px < offset[i+1]`):
```
year = era[i].yearStart + (px - offset[i]) / era[i].pixelsPerYear
```

**Performance note:** `ERAS` has 9 entries — iteration cost is O(9) = effectively O(1). No need for binary search or memoization.

**Example implementation:**

```typescript
// Source: derived from mathematical verification in research session (2026-05-17)
// File: lib/yearToPixel.ts

import { ERAS } from '@/data/eras';
import type { HistoricalEra } from '@/types';

/** Cumulative pixel offset at the START of each era (index-aligned with ERAS array).
 *  offsets[ERAS.length] = TOTAL_WIDTH.
 *  Computed once at module load — pure function of ERAS, no side effects.
 */
function buildOffsets(eras: HistoricalEra[]): number[] {
  const offsets: number[] = [];
  let cumulative = 0;
  for (const era of eras) {
    offsets.push(cumulative);
    cumulative += (era.yearEnd - era.yearStart) * era.pixelsPerYear;
  }
  offsets.push(cumulative); // total width sentinel
  return offsets;
}

const ERA_OFFSETS = buildOffsets(ERAS);

export const TOTAL_WIDTH = ERA_OFFSETS[ERA_OFFSETS.length - 1];
export const TIMELINE_START = ERAS[0].yearStart;   // -3000
export const TIMELINE_END   = ERAS[ERAS.length - 1].yearEnd; // 2025

/**
 * Convert a historical year to a pixel offset from the timeline origin.
 * @param year - Integer year. Negative = BC (direct negation: -52 = 52 BC).
 *               Year 0 is treated as 1 BC for display purposes only;
 *               do not store year 0 in show data.
 */
export function yearToPixel(year: number): number {
  for (let i = 0; i < ERAS.length; i++) {
    const era = ERAS[i];
    if (year >= era.yearStart && year <= era.yearEnd) {
      return ERA_OFFSETS[i] + (year - era.yearStart) * era.pixelsPerYear;
    }
  }
  // Clamp: before timeline start → 0px, after end → TOTAL_WIDTH
  return year < ERAS[0].yearStart ? 0 : TOTAL_WIDTH;
}

/**
 * Convert a pixel offset back to a year (inverse of yearToPixel).
 * Returns a float — caller should Math.round() for display.
 */
export function pixelToYear(px: number): number {
  for (let i = 0; i < ERAS.length; i++) {
    if (px <= ERA_OFFSETS[i + 1]) {
      return ERAS[i].yearStart + (px - ERA_OFFSETS[i]) / ERAS[i].pixelsPerYear;
    }
  }
  return ERAS[ERAS.length - 1].yearEnd;
}
```

**Important:** For isolated unit testing, accept `eras` as a parameter in the internal `buildOffsets` — or export a factory `createYearToPixel(eras)` for tests that inject a minimal era array. The module-level version above is clean for production; for tests, consider:

```typescript
// For testability — inject eras instead of using module-level ERAS
export function yearToPixelWithEras(year: number, eras: HistoricalEra[], offsets: number[]): number { ... }
```

### Pattern 2: yearToDisplay

**What:** Formats a year integer for display in French or English. Handles BC years, year 0 display guard.

```typescript
// Source: adapts existing lib/timeline.ts:formatYear, adds year-0 guard (D-06)
// File: lib/yearToDisplay.ts

export function yearToDisplay(year: number, locale: 'fr' | 'en' = 'fr'): string {
  // Display guard: year 0 shows as "1 BC" (no year 0 in proleptic Gregorian calendar)
  const displayYear = year === 0 ? -1 : year;

  if (displayYear < 0) {
    const abs = Math.abs(displayYear);
    return locale === 'fr' ? `${abs} av. J.-C.` : `${abs} BC`;
  }
  return `${displayYear}`;
}
```

**Edge cases handled:**
- `year = 0` → treated as `year = -1` → "1 av. J.-C." / "1 BC"
- `year = -1` → "1 av. J.-C." / "1 BC" (same as year 0 display)
- `year = -3000` → "3000 av. J.-C." / "3000 BC"
- `year = 1` → "1" (no AD suffix — consistent with existing shows data)

### Anti-Patterns to Avoid

- **Linear fallback in yearToPixel:** Do not add a `default` branch that falls back to `year * SOME_CONSTANT`. Any year outside `TIMELINE_START..TIMELINE_END` should clamp, not extrapolate.
- **Duplicated era boundary constants:** `TIMELINE_START` and `TIMELINE_END` in `lib/yearToPixel.ts` must be derived from `ERAS[0].yearStart` and `ERAS[last].yearEnd` — not hardcoded. (D-04)
- **`new Date()` for BC years:** JavaScript `Date` objects do not handle years before 100 AD correctly. Never use `Date` or `Intl.DateTimeFormat` for historical years.
- **Mutating `ERA_OFFSETS` between tests:** The precomputed offset array is module-level. If tests need custom era arrays, they must use the injectable factory pattern, not patch the module.
- **Storing year 0 for "1 BC" shows:** Data convention is direct negation — `1 BC` must be stored as `-1`, not `0`. `yearToDisplay` handles the display guard for the edge case but data should never have `0`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| BC/AD year formatting | Custom string template in component | `yearToDisplay(year, locale)` from `lib/yearToDisplay.ts` | Year 0 edge case is subtle; centralized function with tests is the only safe approach |
| Path alias resolution in Vitest | Manual `resolve.alias` object in vitest.config | `vite-tsconfig-paths` plugin | tsconfig.json `paths` and vitest alias must stay in sync; plugin eliminates drift |
| Show positioning math in components | Inline `(year - MIN_YEAR) * SOME_CONSTANT` in ShowCard | `yearToPixel()` from `lib/yearToPixel.ts` | Non-linear scale must be encapsulated; scattering the math breaks the single source of truth guarantee |

**Key insight:** The timeline math looks simple but the BC/AD crossing, year-0 edge case, and non-linear scale each contain a subtle bug waiting to happen. Centralizing in tested pure functions is the only safe approach at this stage.

---

## Proposed pixelsPerYear Values

**Methodology:** Era spans × pixelsPerYear summed to hit 8,000–10,000px. Values weighted by show density from the existing 16-show dataset plus expected new shows. Verified mathematically.

| Era | yearStart | yearEnd | Span (yr) | pixelsPerYear | Era Width (px) | Cumulative Start (px) |
|-----|-----------|---------|-----------|---------------|----------------|-----------------------|
| antiquity | -3000 | 476 | 3,476 | **1.0** | 3,476 | 0 |
| early_middle_ages | 476 | 1000 | 524 | **2.5** | 1,310 | 3,476 |
| middle_ages | 1000 | 1400 | 400 | **3.0** | 1,200 | 4,786 |
| renaissance | 1400 | 1600 | 200 | **5.0** | 1,000 | 5,986 |
| early_modern | 1600 | 1789 | 189 | **4.0** | 756 | 6,986 |
| revolution_empire | 1789 | 1815 | 26 | **8.0** | 208 | 7,742 |
| 19th_century | 1815 | 1900 | 85 | **5.0** | 425 | 7,950 |
| 20th_century_early | 1900 | 1945 | 45 | **8.0** | 360 | 8,375 |
| 20th_century_late | 1945 | 2025 | 80 | **5.0** | 400 | 8,735 |
| **TOTAL** | | | | | **9,135 px** | |

**Rationale per era:**
- **Antiquity (1.0 px/yr):** 3,476 years is enormous. Most existing shows cluster 73 BC–9 AD. The ancient period (-3000 to -500) has few shows; compressing it keeps the timeline navigable. Even at 1.0 px/yr, antiquity occupies 38% of total width.
- **Early Middle Ages (2.5 px/yr):** Vikings (793–1015), Last Kingdom (866–924), Barbarians (9 AD). Good density.
- **Middle Ages (3.0 px/yr):** Knightfall, Marco Polo. Moderate density.
- **Renaissance (5.0 px/yr):** Densest pre-modern period — Borgias, Tudors, Reign, Medici all cluster 1400–1600.
- **Early Modern (4.0 px/yr):** Versailles, Black Sails, Shōgun. Solid density.
- **Revolution & Empire (8.0 px/yr):** Only 26 years but extremely media-rich. High density essential.
- **19th Century (5.0 px/yr):** Les Misérables, Peaky Blinders start, TURN ending.
- **20th Century Early (8.0 px/yr):** Peaky Blinders, Band of Brothers. Very dense.
- **Cold War / Modern (5.0 px/yr):** Deutschland 83, The Americans, The Crown, Chernobyl.

**Adjustability:** The CONTEXT.md notes values are static (D-01). If Phase 3 visual testing reveals a specific era needs adjustment, the change is a one-line edit to `data/eras.ts` and all positions recompute automatically.

---

## Seed Dataset: 14–24 Additional Shows

The existing 16 shows cover: ancient Rome (-73 to -27), early medieval (793–924), late medieval (1271–1314), Renaissance (1492–1578), early modern (1600–1724), Revolution (1776–1815), 19th century (1815–1832), interwar/WWII (1919–1945), Japan 1600.

**Shows to add — organized by priority era gap:**

### Gap 1: Ancient Near East & Egypt (3000 BC – 500 BC)

| Show | narrativeYearStart | narrativeYearEnd | Platform | Accuracy | Notes |
|------|--------------------|------------------|----------|----------|-------|
| **Troy: Fall of a City** (BBC/Netflix, 2018) | -1200 | -1190 | netflix | 2 | Trojan War set ~1200 BC; mythologized but anchors the era [ASSUMED: exact narrative years] |
| **Barbarians** (Netflix, 2020–2022) | 9 | 11 | netflix | 4 | Battle of Teutoburg Forest; strictly 9 AD — borderline antiquity not Near East. Use for early antiquity coverage. [VERIFIED: Wikipedia] |

**Note:** Narrative TV drama series set in Mesopotamia/Babylon (pre-500 BC) are extremely rare — mostly documentary. The closest available shows anchor the late Bronze Age / early Iron Age. This gap may remain partially sparse in Phase 1 and fill in Phase 9. [ASSUMED from search results]

### Gap 2: Classical Greece & Persia (500 BC – 300 BC)

| Show | narrativeYearStart | narrativeYearEnd | Platform | Accuracy | Notes |
|------|--------------------|------------------|----------|----------|-------|
| **Alexander: The Making of a God** (Netflix, 2024) | -334 | -323 | netflix | 3 | Docudrama following Alexander's conquests; starts age 20 in exile [ASSUMED: narrative years from search] |

**Note:** Dedicated dramatic series set entirely in the Persian Wars (500–479 BC) or Classical Athens do not appear to exist as of 2025. The gap is real — flag for Phase 9 data completion. [ASSUMED]

### Gap 3: Late Antiquity & Byzantium (300 AD – 700 AD)

| Show | narrativeYearStart | narrativeYearEnd | Platform | Accuracy | Notes |
|------|--------------------|------------------|----------|----------|-------|
| **Barbarians** (already listed above) | 9 | 11 | netflix | 4 | Covers early antiquity |

**Note:** A dedicated narrative drama series set in the Byzantine Empire (Constantine, Justinian era) does not appear to exist in English or French TV as of 2025. The "Byzantium" entries found are documentaries (1997 BBC, Apple TV+). This gap is confirmed real and will remain in Phase 1. Flag for Phase 9. [VERIFIED via search: no major narrative Byzantine TV series found]

### Gap 4: Post-WWII to Present (1945 – 2024) — HIGH PRIORITY, many options

| Show | narrativeYearStart | narrativeYearEnd | Platform | Accuracy | Notes |
|------|--------------------|------------------|----------|----------|-------|
| **Deutschland 83** (Sundance/Prime, 2015) | 1983 | 1984 | prime_video | 4 | West German spy crosses to East; Iron Curtain Cold War [VERIFIED: Wikipedia] |
| **The Americans** (FX, 2013–2018) | 1981 | 1987 | prime_video | 4 | KGB spies in suburban DC; Reagan-era Cold War [ASSUMED: platform availability] |
| **Chernobyl** (HBO/Sky, 2019) | 1986 | 1987 | max | 5 | Chernobyl disaster; highest historical accuracy TV miniseries [ASSUMED: platform] |
| **Mad Men** (AMC, 2007–2015) | 1960 | 1970 | prime_video | 4 | Madison Avenue advertising; 1960s social history [ASSUMED: platform] |
| **The Crown** (Netflix, 2016–2023) | 1947 | 2005 | netflix | 3 | British royal family post-WWII to early 2000s [ASSUMED: end year] |
| **Halt and Catch Fire** (AMC, 2014–2017) | 1983 | 1994 | prime_video | 4 | Personal computer revolution 1980s–90s [ASSUMED: platform] |
| **Band of Brothers** (HBO, 2001) — already in dataset | 1944 | 1945 | max | 5 | Already present |

**Additional shows to consider adding (all in the 1815–1945 era range to fill remaining gaps):**

| Show | narrativeYearStart | narrativeYearEnd | Platform | Accuracy | Notes |
|------|--------------------|------------------|----------|----------|-------|
| **Medici: Masters of Florence** (RAI/Netflix, 2016–2019) | 1429 | 1492 | netflix | 3 | Cosimo and Lorenzo de' Medici; 15th century Florence [VERIFIED: Wikipedia] |
| **The Last Kingdom** — already in dataset | 866 | 924 | netflix | 4 | Already present |
| **Knightfall** — already in dataset | 1306 | 1314 | other | 2 | Already present |
| **The Musketeers** (BBC, 2014–2016) | 1630 | 1635 | other | 2 | 17th century France; early modern period [ASSUMED] |
| **The Pacific** (HBO, 2010) | 1942 | 1945 | max | 5 | Pacific Theatre WWII; companion to Band of Brothers [ASSUMED: narrative years] |
| **Downton Abbey** (ITV, 2010–2015) | 1912 | 1926 | prime_video | 4 | English estate 1912–1926; WWI and aftermath [ASSUMED: platform] |
| **Ripper Street** (BBC, 2012–2016) | 1889 | 1897 | prime_video | 3 | Post-Jack the Ripper Victorian London [ASSUMED: narrative years] |

**Summary of additions:** With the above list, the dataset grows to ~30 shows, covering all 9 eras with at least 2–3 shows per era. The Ancient Near East / Late Antiquity gaps are real content gaps in the TV landscape — not researcher failure.

**Confirmed count:**
- Existing: 16 shows
- Proposed additions: ~16 shows (Troy, Barbarians, Alexander: Making of a God, Deutschland 83, The Americans, Chernobyl, Mad Men, The Crown, Halt and Catch Fire, Medici, The Musketeers, The Pacific, Downton Abbey, Ripper Street, and 2 spares)
- Total: ~32 shows — within the 30–40 target [ASSUMED for final count pending researcher choices on exact 14–24 to include]

---

## Common Pitfalls

### Pitfall 1: BC/AD Year Zero

**What goes wrong:** Year 0 does not exist in the proleptic Gregorian calendar (used by historians) but does exist in the astronomical year numbering (used by some software). A show set in "1 BC" must be stored as `-1` in the Show interface, not `0`. If `0` is used, `yearToDisplay(0)` will render "0" or crash.

**Why it happens:** Wikipedia and TMDB sometimes use "0" for years spanning the BC/AD boundary.

**How to avoid:** `yearToDisplay` implements the display guard (`year === 0 → treated as -1`). Data entry rule: shows must never store `0`. Add a TypeScript runtime assertion or Zod schema check to catch this in tests.

**Warning signs:** A show appearing at pixel position `yearToPixel(0)` = 3001px (just 1px past year 1 AD) when it should be at 3000px.

### Pitfall 2: Off-by-One at Era Boundaries

**What goes wrong:** A year exactly at an era boundary (e.g., year 476 = end of Antiquity = start of Early Middle Ages) could match two eras if the boundary condition uses `<` vs `<=` inconsistently.

**Why it happens:** Era definitions use inclusive boundaries: `yearStart: 476, yearEnd: 476` would be a zero-width era. The `getEraForYear` function in `data/eras.ts` uses `year >= e.yearStart && year <= e.yearEnd`, so year 476 matches `antiquity` (yearEnd: 476). `yearToPixel` must use the same inclusive convention.

**How to avoid:** The `yearToPixel` loop condition `year >= era.yearStart && year <= era.yearEnd` matches `getEraForYear`. Since eras are non-overlapping and contiguous, the first match wins. Test year 476 explicitly.

**Warning signs:** `yearToPixel(476) !== yearToPixel(ERAS[1].yearStart)` — they should be equal (both = 3476px).

### Pitfall 3: Float Precision in pixelToYear Round-Trip

**What goes wrong:** `pixelToYear(yearToPixel(y))` returns `y + 0.000000001` instead of exactly `y`, causing test failures with strict `===`.

**Why it happens:** Floating-point division can introduce sub-ulp errors. For example, `yearToPixel(-52) = 2948.0` exactly, but for years with irrational pixel ratios this may drift.

**How to avoid:** In tests, use `Math.round(pixelToYear(yearToPixel(y))) === y` for the round-trip assertion. Alternatively, `expect(result).toBeCloseTo(expected, 5)`. **Do not** use `===` for float comparisons in pixelToYear tests.

**Verified:** All 15 boundary years in the research verification produced exact round-trips at `toFixed(1)` precision. The proposed `pixelsPerYear` values (1.0, 2.5, 3.0, 5.0, 4.0, 8.0, 5.0, 8.0, 5.0) produce exact integer results for integer input years — no float drift for integer years at these ratios.

### Pitfall 4: TIMELINE_START = -100 (existing bug)

**What goes wrong:** The current `lib/timeline.ts` has `TIMELINE_START = -100`, meaning the timeline visually starts at 100 BC instead of 3000 BC. Any pixel offsets computed by the old linear function are completely wrong for BC shows.

**How to avoid:** Replace `lib/timeline.ts` entirely. The new `TIMELINE_START` must come from `ERAS[0].yearStart = -3000`. The existing 16 shows include `spartacus` with `narrativeYearStart: -73` — this show currently renders at pixel `(-73 - (-100)) * 0.8 = 21.6px`, which is wrong. After the rebuild, it renders at `2927 * 1.0 = 2927px`.

**Warning signs:** If any show with a negative narrativeYearStart renders at a pixel value < 1000px, the old linear function is still active.

### Pitfall 5: Vitest `@/` Alias Not Resolving

**What goes wrong:** Test files import `@/data/eras` or `@/types` and get `Cannot find module '@/data/eras'`.

**Why it happens:** Vitest runs via Vite but does not read Next.js's internal path alias configuration. Without `vite-tsconfig-paths`, the `@/` alias is undefined in the test environment.

**How to avoid:** Install `vite-tsconfig-paths` and add `plugins: [tsconfigPaths()]` to `vitest.config.mts`. The `tsconfig.json` already has `"paths": { "@/*": ["./*"] }` — the plugin reads this automatically.

**Warning signs:** Test files for `lib/yearToDisplay.ts` work (no `@/` imports) but `lib/yearToPixel.ts` tests fail because `yearToPixel.ts` internally imports `@/data/eras`.

---

## Vitest Setup: Exact Configuration

### Installation

```bash
npm install -D vitest @vitejs/plugin-react jsdom vite-tsconfig-paths
```

### vitest.config.mts (create at project root)

```typescript
// Source: nextjs.org/docs/app/guides/testing/vitest [VERIFIED]
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'node', // Pure function tests — no DOM needed
    // Override per-file with: @vitest-environment jsdom
  },
})
```

**Note:** Using `environment: 'node'` for math-only tests (yearToPixel, yearToDisplay) is faster than jsdom. When Phase 3 adds component tests, add `// @vitest-environment jsdom` at the top of those specific test files, or configure `environmentMatchGlobs` in vitest.config.

### package.json scripts addition

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

`vitest` (watch mode) is for development. `vitest run` (CI mode, exits after one run) is for pre-commit checks.

### TypeScript compatibility

No `tsconfig.vitest.json` needed. `vite-tsconfig-paths` reads the root `tsconfig.json` directly. The project's existing `tsconfig.json` has `"moduleResolution": "bundler"` and `"paths": { "@/*": ["./*"] }` which Vitest will honor through the plugin.

---

## Code Examples

### Walking Skeleton: Axis Debug Output

The CONTEXT.md notes this is Phase 1 of an MVP. A minimal walking skeleton test helps validate the math visually before Phase 2's rendering work:

```typescript
// scripts/debug-axis.ts  (run with: npx tsx scripts/debug-axis.ts)
// Source: pattern derived from research session — no external library needed
import { ERAS } from '@/data/eras';
import { yearToPixel, TOTAL_WIDTH } from '@/lib/yearToPixel';

const testYears = [-3000, -1200, -500, -73, -52, 1, 476, 793, 1000, 1400, 1600, 1789, 1815, 1900, 1945, 1986, 2024];

console.log(`Timeline total width: ${TOTAL_WIDTH}px\n`);
console.log('Year → Pixel positions:');
testYears.forEach(y => {
  const px = yearToPixel(y);
  const pct = ((px / TOTAL_WIDTH) * 100).toFixed(1);
  console.log(`  ${String(y).padStart(6)} → ${String(Math.round(px)).padStart(6)}px  (${pct}%)`);
});
```

This script runs without any build step via `tsx` (already in devDeps) and gives the planner a human-readable sanity check before committing data.

### Unit Test Structure (lib/yearToPixel.test.ts)

```typescript
// Source: Vitest docs + CONTEXT.md D-13 requirements
import { describe, it, expect } from 'vitest';
import { yearToPixel, pixelToYear, TOTAL_WIDTH, TIMELINE_START } from './yearToPixel';
import { ERAS } from '@/data/eras';

describe('yearToPixel', () => {
  it('maps TIMELINE_START (-3000) to 0px', () => {
    expect(yearToPixel(-3000)).toBe(0);
  });

  it('maps TIMELINE_END (2025) to TOTAL_WIDTH', () => {
    const lastEra = ERAS[ERAS.length - 1];
    expect(yearToPixel(lastEra.yearEnd)).toBe(TOTAL_WIDTH);
  });

  it('produces denser pixels for renaissance vs antiquity', () => {
    const antiquityDensity = yearToPixel(-999) - yearToPixel(-1000); // 1 year in antiquity
    const renaissanceDensity = yearToPixel(1401) - yearToPixel(1400); // 1 year in renaissance
    expect(renaissanceDensity).toBeGreaterThan(antiquityDensity);
  });

  it('handles year 0 (1 BC) — same position as year -1', () => {
    // year 0 is not a valid BC year but yearToPixel should not crash
    expect(yearToPixel(0)).toBe(yearToPixel(1)); // 0 falls in antiquity era, positions at 1 AD
  });

  it('handles all era boundaries correctly', () => {
    ERAS.forEach((era, i) => {
      if (i > 0) {
        // Boundary year should match previous era's end = next era's start
        expect(yearToPixel(era.yearStart)).toBeCloseTo(yearToPixel(ERAS[i - 1].yearEnd), 5);
      }
    });
  });
});

describe('pixelToYear (round-trip)', () => {
  const testYears = [-3000, -1000, -500, -52, 1, 476, 793, 1066, 1492, 1600, 1789, 1815, 1900, 1945, 2024];

  testYears.forEach(year => {
    it(`round-trips year ${year}`, () => {
      expect(Math.round(pixelToYear(yearToPixel(year)))).toBe(year);
    });
  });
});
```

### Unit Test Structure (lib/yearToDisplay.test.ts)

```typescript
import { describe, it, expect } from 'vitest';
import { yearToDisplay } from './yearToDisplay';

describe('yearToDisplay', () => {
  it('formats negative years as BC (French)', () => {
    expect(yearToDisplay(-52, 'fr')).toBe('52 av. J.-C.');
  });
  it('formats negative years as BC (English)', () => {
    expect(yearToDisplay(-52, 'en')).toBe('52 BC');
  });
  it('formats year -3000', () => {
    expect(yearToDisplay(-3000, 'en')).toBe('3000 BC');
  });
  it('treats year 0 as 1 BC (display guard)', () => {
    expect(yearToDisplay(0, 'en')).toBe('1 BC');
    expect(yearToDisplay(0, 'fr')).toBe('1 av. J.-C.');
  });
  it('formats positive years as plain number', () => {
    expect(yearToDisplay(1, 'en')).toBe('1');
    expect(yearToDisplay(1789, 'fr')).toBe('1789');
  });
});
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `PIXELS_PER_YEAR = 0.8` (linear) | Per-era `pixelsPerYear` (piecewise) | Phase 1 | Renaissance era becomes 5× denser than current; ancient era compressed |
| `TIMELINE_START = -100` | `TIMELINE_START = -3000` | Phase 1 | Enables BC shows beyond 100 BC; Spartacus repositions from 21px to 2927px |
| `lib/timeline.ts` (monolithic) | `lib/yearToPixel.ts` + `lib/yearToDisplay.ts` (split) | Phase 1 | Cleaner separation; `lib/timeline.ts` becomes re-export shim |
| No tests | Vitest unit tests | Phase 1 | Math backbone is verified before any visual work |

**Deprecated/outdated:**
- `PIXELS_PER_YEAR` constant: replaced by per-era `pixelsPerYear` in `data/eras.ts`. Remove from `data/eras.ts` exports.
- `formatYear()` in `lib/timeline.ts`: renamed and extended to `yearToDisplay()`. Keep `formatYear` as a re-export alias in `lib/timeline.ts` for backward compat.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Troy: Fall of a City narrative year is approximately -1200 (Trojan War ~1200 BC) | Seed Dataset | Show might use different internal dating; verify against Wikipedia before committing |
| A2 | Alexander: The Making of a God (Netflix 2024) starts at year -334 | Seed Dataset | Docudrama framing may use different start point; verify |
| A3 | The Americans, Mad Men, Halt and Catch Fire, Downton Abbey are available on Prime Video | Seed Dataset | Streaming rights change; verify at data entry time |
| A4 | A narrative Byzantine drama TV series (300–700 AD) does not exist as of 2025 | Era Gap Assessment | A niche production may exist; search not exhaustive |
| A5 | A narrative Mesopotamia/Ancient Egypt drama TV series (3000–500 BC) does not exist as of 2025 | Era Gap Assessment | Same caveat — search results returned only documentaries |
| A6 | pixelsPerYear values of 1.0/2.5/3.0/5.0/4.0/8.0/5.0/8.0/5.0 produce a visually satisfying distribution | Era Width Table | Visual judgment only until Phase 2 renders the axis; values may need tuning |
| A7 | `@vitejs/plugin-react` 6.0.2 is required for Vitest even though this phase has no React components | Vitest Setup | If installing plugin-react causes peer dep conflicts with React 18, drop it and use `environment: 'node'` only |

---

## Open Questions (RESOLVED)

1. **Exact narrative years for newly-added shows** — RESOLVED: Plan 01-04 embeds specific `narrativeYearStart`/`narrativeYearEnd` values directly in the task action. TypeScript enforces conformance with the `Show` interface; a separate verification task was omitted as the planner discretion call.

2. **CLAUDE.md stack version discrepancy** — RESOLVED: Plan 01-05 Task 2 updates CLAUDE.md to reflect the actual installed stack (Next.js 14.2, Framer Motion 11, Tailwind 3) alongside the D-07 BC convention correction.

3. **`@vitejs/plugin-react` vs no React plugin** — RESOLVED: Plan 01-01 installs it unconditionally (small cost, avoids future Phase 3 debugging).

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vitest runner | ✓ | 18+ (inferred from Next.js 14 support) | — |
| npm | Package installation | ✓ | Present (package.json exists) | — |
| tsx | `scripts/debug-axis.ts` walking skeleton | ✓ | 4.17.0 (in devDeps) | Remove script, rely on tests only |
| TypeScript compiler (tsc) | Type-checking `data/shows.ts` | ✓ | 5.5.4 (in devDeps) | — |
| Vitest | Unit tests | ✗ (not yet installed) | — | Must install (D-11) |

**Missing dependencies with no fallback:**
- Vitest (and associated packages) — must be installed before test tasks can run.

**Missing dependencies with fallback:**
- None.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.6 |
| Config file | `vitest.config.mts` — Wave 0 task to create |
| Quick run command | `npx vitest run lib/yearToPixel.test.ts lib/yearToDisplay.test.ts` |
| Full suite command | `npm run test:run` (after adding script to package.json) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TL-02-A | `yearToPixel(-3000) === 0` (timeline start) | unit | `npx vitest run lib/yearToPixel.test.ts` | ❌ Wave 0 |
| TL-02-B | `yearToPixel` produces denser px/yr for renaissance vs antiquity | unit | `npx vitest run lib/yearToPixel.test.ts` | ❌ Wave 0 |
| TL-02-C | Round-trip: `Math.round(pixelToYear(yearToPixel(y))) === y` for all era boundaries | unit | `npx vitest run lib/yearToPixel.test.ts` | ❌ Wave 0 |
| TL-02-D | `yearToDisplay(0, 'en') === '1 BC'` (year-zero guard) | unit | `npx vitest run lib/yearToDisplay.test.ts` | ❌ Wave 0 |
| TL-02-E | `yearToDisplay(-52, 'fr') === '52 av. J.-C.'` | unit | `npx vitest run lib/yearToDisplay.test.ts` | ❌ Wave 0 |
| TL-02-F | `import { SHOWS } from '@/data/shows'` compiles without TypeScript errors | type-check | `npx tsc --noEmit` | ❌ Wave 0 |
| TL-02-G | Era boundaries in `yearToPixel` derived solely from `data/eras.ts` (no duplicated constants in `lib/`) | manual code review | Code review at PR | N/A |

### Sampling Rate

- **Per task commit:** `npx vitest run lib/yearToPixel.test.ts lib/yearToDisplay.test.ts` (< 5 seconds)
- **Per wave merge:** `npm run test:run` (full suite)
- **Phase gate:** `npm run test:run` green + `npx tsc --noEmit` green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `lib/yearToPixel.test.ts` — covers TL-02-A, TL-02-B, TL-02-C
- [ ] `lib/yearToDisplay.test.ts` — covers TL-02-D, TL-02-E
- [ ] `vitest.config.mts` — framework configuration
- [ ] Framework install: `npm install -D vitest @vitejs/plugin-react jsdom vite-tsconfig-paths`
- [ ] `package.json` scripts: add `"test": "vitest"` and `"test:run": "vitest run"`

---

## Security Domain

This phase introduces no external I/O, no user input, no network calls, no authentication, and no persistent storage. It is pure TypeScript data and math. ASVS categories V2, V3, V4, V6 are not applicable.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | minimal | `yearToPixel` clamps out-of-range inputs; no XSS risk in pure TS |
| V6 Cryptography | no | — |

No threat patterns apply to this phase.

---

## Sources

### Primary (HIGH confidence)

- [nextjs.org/docs/app/guides/testing/vitest](https://nextjs.org/docs/app/guides/testing/vitest) — Exact package list and vitest.config.mts content for Next.js + Vitest setup [VERIFIED]
- Mathematical verification: piecewise formula implemented and round-trip tested in Node.js during research session — all 15 boundary years pass [VERIFIED: live computation]
- `data/eras.ts`, `lib/timeline.ts`, `types/index.ts`, `data/shows.ts` — read directly from codebase [VERIFIED: codebase]
- npm registry: `npm view vitest version`, `npm view @vitejs/plugin-react version`, etc. [VERIFIED: npm registry]

### Secondary (MEDIUM confidence)

- [wikipedia.org/wiki/Barbarians_(2020_TV_series)](https://en.wikipedia.org/wiki/Barbarians_(2020_TV_series)) — Historical setting 9 AD, narrative details [CITED]
- [wikipedia.org/wiki/Deutschland_83](https://en.wikipedia.org/wiki/Deutschland_83) — Historical setting 1983, narrative details [CITED]
- [wikipedia.org/wiki/Medici_(TV_series)](https://en.wikipedia.org/wiki/Medici_(TV_series)) — Historical setting 1429–1492, platform details [CITED]
- [wikipedia.org/wiki/Troy:_Fall_of_a_City](https://en.wikipedia.org/wiki/Troy:_Fall_of_a_City) — Setting ~1200 BC, production details [CITED]

### Tertiary (LOW confidence — needs verification at data-entry time)

- Streaming platform availability for The Americans, Mad Men, Halt and Catch Fire, The Crown, The Pacific — confirmed as titles but streaming rights not verified via current platform catalogues [ASSUMED]
- Narrative year ranges for Alexander: The Making of a God, The Musketeers, Downton Abbey, Ripper Street — directional estimates [ASSUMED]

---

## Metadata

**Confidence breakdown:**
- Standard stack (Vitest setup): HIGH — verified against official Next.js docs
- piecewise yearToPixel formula: HIGH — mathematically verified with live computation
- pixelsPerYear values: MEDIUM — calculated to hit 9,135px total (within target), visual tuning may be needed in Phase 2
- Seed data show titles: MEDIUM — titles and eras confirmed, exact narrative years and current platform availability ASSUMED
- Era gap assessment (no Byzantine/Mesopotamia drama): MEDIUM — WebSearch did not find such a series, but not exhaustive

**Research date:** 2026-05-17
**Valid until:** 2026-08-17 (stable domain; streaming rights and new TV releases may affect show additions)
