# Phase 1: Data Foundation + yearToPixel — Pattern Map

**Mapped:** 2026-05-17
**Files analyzed:** 11 (new/modified files for this phase)
**Analogs found:** 8 / 11 (3 config files have no codebase analog)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `lib/yearToPixel.ts` | utility | transform | `lib/timeline.ts` | role-match (same math domain, replace linear with piecewise) |
| `lib/yearToDisplay.ts` | utility | transform | `lib/timeline.ts` (formatYear) | exact (rename + year-0 guard) |
| `lib/yearToPixel.test.ts` | test | — | _(none — no tests exist yet)_ | no-analog |
| `lib/yearToDisplay.test.ts` | test | — | _(none — no tests exist yet)_ | no-analog |
| `data/eras.ts` | config/data | — | `data/eras.ts` itself | exact (extend in place) |
| `types/index.ts` | model | — | `types/index.ts` itself | exact (add field to HistoricalEra) |
| `data/shows.ts` | config/data | — | `data/shows.ts` itself | exact (append entries) |
| `lib/timeline.ts` | utility | transform | `lib/timeline.ts` itself | exact (convert to re-export shim) |
| `vitest.config.mts` | config | — | _(none — no test config exists)_ | no-analog |
| `package.json` | config | — | `package.json` itself | exact (add scripts + devDeps) |
| `CLAUDE.md` | docs | — | `CLAUDE.md` itself | exact (edit two lines) |

---

## Pattern Assignments

### `lib/yearToPixel.ts` (utility, transform)

**Analog:** `lib/timeline.ts`

**Imports pattern** (lines 1, all of file):
```typescript
import { TIMELINE_START, TIMELINE_END, PIXELS_PER_YEAR } from '@/data/eras';
```
Copy the `@/` alias convention. New file changes to:
```typescript
import { ERAS } from '@/data/eras';
import type { HistoricalEra } from '@/types';
```

**Core pattern — replace linear math with piecewise** (lines 3-11 of `lib/timeline.ts`):
```typescript
// EXISTING (discard):
export function yearToPixel(year: number): number {
  return (year - TIMELINE_START) * PIXELS_PER_YEAR;
}
export function pixelToYear(px: number): number {
  return Math.round(px / PIXELS_PER_YEAR + TIMELINE_START);
}
export const TOTAL_WIDTH = yearToPixel(TIMELINE_END);
```

New piecewise implementation pattern (derived from RESEARCH.md mathematical verification):
```typescript
// lib/yearToPixel.ts

import { ERAS } from '@/data/eras';
import type { HistoricalEra } from '@/types';

/** Precompute cumulative pixel offsets at each era boundary (index-aligned with ERAS).
 *  offsets[ERAS.length] = TOTAL_WIDTH sentinel.
 *  Called once at module load — pure function of ERAS, no side effects.
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
export const TIMELINE_START = ERAS[0].yearStart;          // -3000 (derived, not hardcoded — D-04)
export const TIMELINE_END   = ERAS[ERAS.length - 1].yearEnd; // 2025 (derived, not hardcoded — D-04)

/**
 * Convert a historical year to a pixel offset from the timeline origin.
 * Negative = BC (direct negation: -52 = 52 BC). Year 0 treated as 1 BC for display only.
 * Out-of-range years clamp (no extrapolation).
 */
export function yearToPixel(year: number): number {
  for (let i = 0; i < ERAS.length; i++) {
    const era = ERAS[i];
    if (year >= era.yearStart && year <= era.yearEnd) {
      return ERA_OFFSETS[i] + (year - era.yearStart) * era.pixelsPerYear;
    }
  }
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

**Critical rules:**
- `TIMELINE_START` and `TIMELINE_END` MUST be derived from `ERAS` array, never hardcoded (D-04)
- Boundary condition: `year >= era.yearStart && year <= era.yearEnd` — inclusive on both ends (matches `getEraForYear` in `data/eras.ts` line 160)
- Clamp, never extrapolate: years outside `[-3000, 2025]` return `0` or `TOTAL_WIDTH`

---

### `lib/yearToDisplay.ts` (utility, transform)

**Analog:** `lib/timeline.ts` — `formatYear` function (lines 13-18)

**Existing pattern to adapt** (lines 13-18):
```typescript
export function formatYear(year: number, locale: 'fr' | 'en' = 'fr'): string {
  if (year < 0) {
    return locale === 'fr' ? `${Math.abs(year)} av. J.-C.` : `${Math.abs(year)} BC`;
  }
  return `${year}`;
}
```

**New file — add year-0 guard (D-06) and rename:**
```typescript
// lib/yearToDisplay.ts — NO imports needed (pure string utility)

/**
 * Format a historical year for display.
 * Negative = BC (direct negation). Year 0 treated as 1 BC (display guard — D-06).
 * @param year  Integer year. -52 = 52 BC, -1 = 1 BC, 0 = display as 1 BC, 1 = 1 AD.
 * @param locale 'fr' | 'en', defaults to 'fr'
 */
export function yearToDisplay(year: number, locale: 'fr' | 'en' = 'fr'): string {
  // Display guard: year 0 → treat as -1 (no year 0 in proleptic Gregorian calendar)
  const displayYear = year === 0 ? -1 : year;

  if (displayYear < 0) {
    const abs = Math.abs(displayYear);
    return locale === 'fr' ? `${abs} av. J.-C.` : `${abs} BC`;
  }
  return `${displayYear}`;
}
```

**Key delta from `formatYear`:** single `const displayYear = year === 0 ? -1 : year` guard before the branch. All other logic is identical.

---

### `lib/yearToPixel.test.ts` (test)

**Analog:** No existing tests. Follow RESEARCH.md test structure.

**Test file pattern** (Vitest, co-located, node environment):
```typescript
// lib/yearToPixel.test.ts
import { describe, it, expect } from 'vitest';
import { yearToPixel, pixelToYear, TOTAL_WIDTH, TIMELINE_START } from './yearToPixel';
import { ERAS } from '@/data/eras';

describe('yearToPixel', () => {
  it('maps TIMELINE_START (-3000) to 0px', () => {
    expect(yearToPixel(-3000)).toBe(0);
  });

  it('maps timeline end (2025) to TOTAL_WIDTH', () => {
    const lastEra = ERAS[ERAS.length - 1];
    expect(yearToPixel(lastEra.yearEnd)).toBe(TOTAL_WIDTH);
  });

  it('produces denser pixels for renaissance vs antiquity (non-linear)', () => {
    const antiquityDensity  = yearToPixel(-999) - yearToPixel(-1000);
    const renaissanceDensity = yearToPixel(1401) - yearToPixel(1400);
    expect(renaissanceDensity).toBeGreaterThan(antiquityDensity);
  });

  it('handles all era boundaries — adjacent eras share the same pixel', () => {
    ERAS.forEach((era, i) => {
      if (i > 0) {
        expect(yearToPixel(era.yearStart)).toBeCloseTo(yearToPixel(ERAS[i - 1].yearEnd), 5);
      }
    });
  });

  it('clamps years before TIMELINE_START to 0px', () => {
    expect(yearToPixel(-9999)).toBe(0);
  });

  it('clamps years after TIMELINE_END to TOTAL_WIDTH', () => {
    expect(yearToPixel(9999)).toBe(TOTAL_WIDTH);
  });
});

describe('pixelToYear round-trip (D-13)', () => {
  const testYears = [-3000, -1000, -500, -52, 1, 476, 793, 1066, 1492, 1600, 1789, 1815, 1900, 1945, 2024];

  testYears.forEach(year => {
    it(`round-trips year ${year}`, () => {
      // Use Math.round() — float division may produce sub-integer drift (see RESEARCH.md Pitfall 3)
      expect(Math.round(pixelToYear(yearToPixel(year)))).toBe(year);
    });
  });
});
```

**Import pattern:** relative import for the unit under test (`./yearToPixel`), `@/` alias for shared data (`@/data/eras`). No `.ts` extension in imports (TypeScript/Vitest resolves automatically).

---

### `lib/yearToDisplay.test.ts` (test)

**Analog:** No existing tests. Mirror structure of `yearToPixel.test.ts`.

```typescript
// lib/yearToDisplay.test.ts
import { describe, it, expect } from 'vitest';
import { yearToDisplay } from './yearToDisplay';

describe('yearToDisplay', () => {
  it('formats negative years as BC in French', () => {
    expect(yearToDisplay(-52, 'fr')).toBe('52 av. J.-C.');
  });
  it('formats negative years as BC in English', () => {
    expect(yearToDisplay(-52, 'en')).toBe('52 BC');
  });
  it('formats year -3000 (timeline start)', () => {
    expect(yearToDisplay(-3000, 'en')).toBe('3000 BC');
  });
  it('treats year 0 as 1 BC — display guard (D-06)', () => {
    expect(yearToDisplay(0, 'en')).toBe('1 BC');
    expect(yearToDisplay(0, 'fr')).toBe('1 av. J.-C.');
  });
  it('treats year -1 as 1 BC', () => {
    expect(yearToDisplay(-1, 'en')).toBe('1 BC');
  });
  it('formats positive years as plain number (no AD suffix)', () => {
    expect(yearToDisplay(1, 'en')).toBe('1');
    expect(yearToDisplay(1789, 'fr')).toBe('1789');
  });
  it('defaults locale to French', () => {
    expect(yearToDisplay(-52)).toBe('52 av. J.-C.');
  });
});
```

---

### `data/eras.ts` (config/data — MODIFY in place)

**Analog:** `data/eras.ts` itself (full file read above).

**Existing file structure pattern** (lines 1-166):
```typescript
import type { HistoricalEra } from '@/types';

export const ERAS: HistoricalEra[] = [
  {
    id: 'antiquity',
    name: { fr: 'Antiquité', en: 'Antiquity' },
    yearStart: -3000,
    yearEnd: 476,
    gradient: ['#c9a84c', '#e8d5a3'],
    textColor: '#3d2b00',
    description: { fr: '...', en: '...' },
    keyEvents: [ ... ],
  },
  // ... 8 more eras
];

export function getEraForYear(year: number): HistoricalEra | undefined {
  return ERAS.find((e) => year >= e.yearStart && year <= e.yearEnd);
}

export const TIMELINE_START = -100;   // ← WRONG, change to -3000 (or remove — derives from ERAS[0].yearStart)
export const TIMELINE_END = 2000;     // ← WRONG, update to 2025 (or remove — derives from ERAS[last].yearEnd)
export const PIXELS_PER_YEAR = 0.8;  // ← REMOVE (replaced by per-era pixelsPerYear)
```

**Changes required:**
1. Add `pixelsPerYear: number` field to each era object (after `types/index.ts` is updated)
2. Change last era `yearEnd` from `1991` to `2025` (RESEARCH.md era table shows `20th_century_late` ends 2025)
3. Remove `PIXELS_PER_YEAR` export constant (line 165)
4. Remove `TIMELINE_START` and `TIMELINE_END` export constants (lines 163-164) — these move to `lib/yearToPixel.ts` derived from `ERAS`
5. Keep `getEraForYear` utility unchanged (line 159-161)

**Proposed `pixelsPerYear` values per era** (RESEARCH.md — verified to sum to 9,135px total):
```typescript
// antiquity:            pixelsPerYear: 1.0   (yearStart: -3000, yearEnd: 476)
// early_middle_ages:    pixelsPerYear: 2.5   (yearStart: 476,   yearEnd: 1000)
// middle_ages:          pixelsPerYear: 3.0   (yearStart: 1000,  yearEnd: 1400)
// renaissance:          pixelsPerYear: 5.0   (yearStart: 1400,  yearEnd: 1600)
// early_modern:         pixelsPerYear: 4.0   (yearStart: 1600,  yearEnd: 1789)
// revolution_empire:    pixelsPerYear: 8.0   (yearStart: 1789,  yearEnd: 1815)
// 19th_century:         pixelsPerYear: 5.0   (yearStart: 1815,  yearEnd: 1900)
// 20th_century_early:   pixelsPerYear: 8.0   (yearStart: 1900,  yearEnd: 1945)
// 20th_century_late:    pixelsPerYear: 5.0   (yearStart: 1945,  yearEnd: 2025)
```

**Example of one era entry after edit:**
```typescript
  {
    id: 'antiquity',
    name: { fr: 'Antiquité', en: 'Antiquity' },
    yearStart: -3000,
    yearEnd: 476,
    pixelsPerYear: 1.0,          // ← NEW FIELD
    gradient: ['#c9a84c', '#e8d5a3'],
    textColor: '#3d2b00',
    description: { ... },
    keyEvents: [ ... ],
  },
```

---

### `types/index.ts` (model — MODIFY in place)

**Analog:** `types/index.ts` itself (full file read above).

**Existing `HistoricalEra` interface** (lines 77-86):
```typescript
export interface HistoricalEra {
  id: string;
  name: { fr: string; en: string };
  yearStart: number;
  yearEnd: number;
  gradient: [string, string];
  textColor: string;
  description: { fr: string; en: string };
  keyEvents: HistoricalEvent[];
}
```

**Single change — add `pixelsPerYear` after `yearEnd`:**
```typescript
export interface HistoricalEra {
  id: string;
  name: { fr: string; en: string };
  yearStart: number;
  yearEnd: number;
  pixelsPerYear: number;          // ← ADD THIS LINE
  gradient: [string, string];
  textColor: string;
  description: { fr: string; en: string };
  keyEvents: HistoricalEvent[];
}
```

**No other changes to `types/index.ts` in Phase 1.** `Show`, `Flashback`, `Genre`, `Region`, `Platform`, `FilterState` interfaces are all unchanged.

---

### `data/shows.ts` (config/data — MODIFY in place, append entries)

**Analog:** `data/shows.ts` itself (full file read above, 16 existing shows).

**Established show entry pattern** (lines 4-26, `rome` entry):
```typescript
  {
    id: 'rome',
    title: { fr: 'Rome', en: 'Rome', original: 'Rome' },
    posterUrl: 'https://image.tmdb.org/t/p/w342/bzPdESSYEg2f5mVHVGEAGJdnCuH.jpg',
    narrativeYearStart: -52,
    narrativeYearEnd: -27,
    broadcastYearStart: 2005,
    broadcastYearEnd: 2007,
    historicalAccuracyScore: 4,
    genres: ['peplum'],
    regions: ['mediterranean'],
    platforms: ['max', 'prime_video'],
    flashbacks: [],
    historicalContext: {
      fr: '...',
      en: '...',
    },
    historicalFigures: ['Jules César', 'Marc Antoine', 'Octave Auguste', 'Cicéron', 'Brutus'],
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Late_Roman_Republic',
    languages: ['en', 'fr'],
    tmdbId: 1421,
    imdbId: 'tt0384766',
  },
```

**Field conventions to copy exactly:**
- `id`: lowercase snake_case (e.g., `'last_kingdom'`, `'band_of_brothers'`)
- `title`: always three keys: `fr`, `en`, `original` — even if all three are the same string
- `posterUrl`: TMDB CDN pattern `https://image.tmdb.org/t/p/w342/{hash}.jpg` or empty string `''` if unavailable
- `narrativeYearStart`: negative integer = BC year (direct negation, D-05)
- `broadcastYearEnd`: `null` for ongoing shows (see `narrativeYearEnd: number | null` in `types/index.ts` line 53)
- `historicalAccuracyScore`: integer 1–5 only
- `flashbacks`: `[]` unless show has documented flashback sequences
- `languages`: array of BCP-47 codes — always include `'en'` and `'fr'` for shows dubbed/subbed in French
- `tmdbId`: optional (`number | undefined`) — include if known
- `imdbId`: optional (`string | undefined`) — `'tt'` prefixed

**New shows to add** (from RESEARCH.md seed dataset — append to `SHOWS` array):

| Show id | narrativeYearStart | narrativeYearEnd | Key fields |
|---------|-------------------|-----------------|------------|
| `troy_fall_of_a_city` | -1200 | -1190 | genres: ['peplum'], regions: ['mediterranean'], platforms: ['netflix'], accuracy: 2 |
| `barbarians` | 9 | 11 | genres: ['peplum', 'war'], regions: ['europe_west'], platforms: ['netflix'], accuracy: 4 |
| `alexander_making_of_a_god` | -334 | -323 | genres: ['peplum', 'biopic'], regions: ['mediterranean', 'middle_east'], platforms: ['netflix'], accuracy: 3 |
| `medici` | 1429 | 1492 | genres: ['renaissance', 'biopic'], regions: ['mediterranean', 'europe_west'], platforms: ['netflix'], accuracy: 3 |
| `the_musketeers` | 1630 | 1635 | genres: ['empire'], regions: ['europe_west'], platforms: ['other'], accuracy: 2 |
| `downton_abbey` | 1912 | 1926 | genres: ['20th_century'], regions: ['europe_west'], platforms: ['prime_video'], accuracy: 4 |
| `ripper_street` | 1889 | 1897 | genres: ['20th_century'], regions: ['europe_west'], platforms: ['prime_video'], accuracy: 3 |
| `the_pacific` | 1942 | 1945 | genres: ['war'], regions: ['asia_east', 'americas_north'], platforms: ['max'], accuracy: 5 |
| `mad_men` | 1960 | 1970 | genres: ['20th_century', 'contemporary'], regions: ['americas_north'], platforms: ['prime_video'], accuracy: 4 |
| `the_crown` | 1947 | 2005 | genres: ['biopic', 'contemporary'], regions: ['europe_west'], platforms: ['netflix'], accuracy: 3 |
| `the_americans` | 1981 | 1987 | genres: ['cold_war', 'war'], regions: ['americas_north', 'europe_east'], platforms: ['prime_video'], accuracy: 4 |
| `halt_and_catch_fire` | 1983 | 1994 | genres: ['contemporary'], regions: ['americas_north'], platforms: ['prime_video'], accuracy: 4 |
| `deutschland_83` | 1983 | 1984 | genres: ['cold_war', 'war'], regions: ['europe_west', 'europe_east'], platforms: ['prime_video'], accuracy: 4 |
| `chernobyl` | 1986 | 1987 | genres: ['20th_century', 'war'], regions: ['europe_east'], platforms: ['max'], accuracy: 5 |

Note: `cold_war` is not currently in the `Genre` type union (`types/index.ts` lines 1-16). Either add it to the union or use existing `'20th_century'` or `'war'` for cold-war shows. Decision: **add `'cold_war'` to the `Genre` type** (it is listed in `types/index.ts` already — confirmed line 11).

---

### `lib/timeline.ts` (utility — MODIFY to re-export shim)

**Analog:** `lib/timeline.ts` itself (full file read above, lines 1-18).

**Current file (full content to replace):**
```typescript
import { TIMELINE_START, TIMELINE_END, PIXELS_PER_YEAR } from '@/data/eras';

export function yearToPixel(year: number): number {
  return (year - TIMELINE_START) * PIXELS_PER_YEAR;
}
export function pixelToYear(px: number): number {
  return Math.round(px / PIXELS_PER_YEAR + TIMELINE_START);
}
export const TOTAL_WIDTH = yearToPixel(TIMELINE_END);
export function formatYear(year: number, locale: 'fr' | 'en' = 'fr'): string {
  if (year < 0) {
    return locale === 'fr' ? `${Math.abs(year)} av. J.-C.` : `${Math.abs(year)} BC`;
  }
  return `${year}`;
}
```

**Replacement — pure re-export shim** (backward compat until Phase 2 removes it):
```typescript
// lib/timeline.ts — re-export shim (backward compat — Phase 2 will remove this file)
// Math → lib/yearToPixel.ts | Display → lib/yearToDisplay.ts

export { yearToPixel, pixelToYear, TOTAL_WIDTH, TIMELINE_START, TIMELINE_END } from './yearToPixel';
export { yearToDisplay as formatYear } from './yearToDisplay';  // alias keeps old name working
```

---

### `vitest.config.mts` (config — NEW)

**Analog:** None in codebase. Pattern from RESEARCH.md (verified against official Next.js docs).

```typescript
// vitest.config.mts — project root
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'node',  // Pure function tests — no DOM needed for Phase 1
    // Component tests (Phase 3+): add @vitest-environment jsdom comment per file
  },
})
```

**Why `tsconfigPaths()` before `react()`:** plugin ordering matters — path resolution must run before JSX transform.

---

### `package.json` (config — MODIFY)

**Analog:** `package.json` itself (full file read above).

**Existing scripts section** (lines 5-11):
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "enrich": "tsx scripts/enrich-shows.ts"
},
```

**Add two test scripts:**
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "enrich": "tsx scripts/enrich-shows.ts",
  "test": "vitest",
  "test:run": "vitest run"
},
```

**Add devDependencies (install command):**
```bash
npm install -D vitest @vitejs/plugin-react jsdom vite-tsconfig-paths
```

This adds to the `devDependencies` section:
```json
"vitest": "^4.1.6",
"@vitejs/plugin-react": "^6.0.2",
"jsdom": "^29.1.1",
"vite-tsconfig-paths": "^6.1.1"
```

---

### `CLAUDE.md` (docs — MODIFY two lines)

**Analog:** `CLAUDE.md` itself.

**Change 1 — Stack version line (CONTEXT.md code_context section, stack reality check):**
- Find: `**Stack:** Next.js 16, Motion 12 (useScroll/useTransform), Tailwind v4, next-intl, nuqs, static JSON (v1), Supabase (v2+)`
- Replace: `**Stack:** Next.js 14.2, Framer Motion 11 (useScroll/useTransform), Tailwind CSS 3, next-intl 3, nuqs (Phase 6+), static JSON (v1), Supabase (v2+)`

**Change 2 — BC dates constraint line (D-07):**
- Find: `**BC dates** stored as plain INTEGER (negative = BC, 0 = 1 BC). Never use JS \`Date\` objects or \`Intl.DateTimeFormat\` for historical years.`
- Replace: `**BC dates** stored as plain INTEGER (negative = BC, direct negation: -52 = 52 BC, -1 = 1 BC). Never use JS \`Date\` objects or \`Intl.DateTimeFormat\` for historical years. Year 0 is a display-only edge case handled in \`yearToDisplay()\` — do not store 0 in show data.`

---

## Shared Patterns

### TypeScript `@/` Path Alias
**Source:** All existing files (`lib/timeline.ts` line 1, `data/eras.ts` line 1, `data/shows.ts` line 1)
**Apply to:** `lib/yearToPixel.ts`, and any file importing from `@/data/` or `@/types`
```typescript
// Always use @/ alias — never use relative ../../ paths across top-level directories
import { ERAS } from '@/data/eras';
import type { HistoricalEra } from '@/types';
```
The alias maps to the project root (see `tsconfig.json` line 16: `"paths": { "@/*": ["./*"] }`).

### Named Exports for Data Constants
**Source:** `data/eras.ts` line 3, `data/shows.ts` line 3
**Apply to:** All data and utility files
```typescript
// Use named exports — no default exports in data or utility files
export const ERAS: HistoricalEra[] = [ ... ];
export const SHOWS: Show[] = [ ... ];
export function yearToPixel(...) { ... }
```

### Bilingual String Object Pattern
**Source:** `data/eras.ts` lines 6-7, `data/shows.ts` lines 6-7
**Apply to:** Any new show entries in `data/shows.ts`, new era key events
```typescript
// Always both locales — never a raw string for user-visible text
name: { fr: 'Antiquité', en: 'Antiquity' },
description: { fr: '...', en: '...' },
title: { fr: 'Rome', en: 'Rome', original: 'Rome' },
```

### TypeScript `import type` for Interface-Only Imports
**Source:** `data/eras.ts` line 1, `data/shows.ts` line 1
**Apply to:** All files that import interfaces but not runtime values
```typescript
import type { HistoricalEra } from '@/types';
import type { Show } from '@/types';
```

### Vitest Test Import Pattern
**Source:** RESEARCH.md (no existing tests to copy)
**Apply to:** `lib/yearToPixel.test.ts`, `lib/yearToDisplay.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
// Named imports from vitest — no globals (environment: 'node' does not set globals by default)
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `lib/yearToPixel.test.ts` | test | — | No test files exist in the codebase yet |
| `lib/yearToDisplay.test.ts` | test | — | No test files exist in the codebase yet |
| `vitest.config.mts` | config | — | No test runner configured yet |

For these files, use RESEARCH.md "Vitest Setup: Exact Configuration" section and the test structure patterns documented in "Pattern Assignments" above.

---

## Anti-Patterns to Avoid

| Anti-Pattern | Source of Risk | Correct Approach |
|---|---|---|
| Hardcoding `TIMELINE_START = -3000` in `lib/yearToPixel.ts` | D-04 violation | Derive: `export const TIMELINE_START = ERAS[0].yearStart` |
| Using `year < 0` to detect BC in `yearToPixel` | Off-by-one at year 0 | Let `buildOffsets` handle the math — year 0 falls in antiquity era naturally |
| `===` comparison in `pixelToYear` round-trip tests | Float drift | Use `Math.round(pixelToYear(yearToPixel(y))) === y` or `.toBeCloseTo()` |
| Using `new Date()` for any year calculation | JS Date breaks for years < 100 AD | Direct integer arithmetic only |
| Keeping `PIXELS_PER_YEAR` in `data/eras.ts` | Obsolete constant | Remove entirely — replaced by per-era `pixelsPerYear` field |
| Calling `getEraForYear` inside `yearToPixel` | Unnecessary overhead | `yearToPixel` iterates `ERAS` directly in its own loop |

---

## Metadata

**Analog search scope:** `lib/`, `data/`, `types/` (full codebase — 4 relevant source files found)
**Files scanned:** `lib/timeline.ts`, `data/eras.ts`, `data/shows.ts`, `types/index.ts`, `tsconfig.json`, `package.json`
**Pattern extraction date:** 2026-05-17
