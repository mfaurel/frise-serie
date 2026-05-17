# Phase 1: Data Foundation + yearToPixel - Context

**Gathered:** 2026-05-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Lock the mathematical backbone before any visual work: rebuild `yearToPixel()` as a non-linear, era-aware function, add unit tests (Vitest), expand the seed dataset to 30–40 shows spanning 3000 BC to present, and update the `HistoricalEra` type to carry per-era `pixelsPerYear`. No UI work — this phase is purely data and math.

</domain>

<decisions>
## Implementation Decisions

### Non-Linear Scale

- **D-01:** `pixelsPerYear` is baked into `data/eras.ts` as a static constant per era — not computed at runtime from show counts. Rationale: dynamic calculation would shift all card positions as shows are added, breaking shareable URLs.
- **D-02:** Ratios should reflect show density (era-rich periods denser, sparse ancient eras compressed). The researcher should propose concrete `pixelsPerYear` values per era based on seed dataset distribution.
- **D-03:** Target total timeline width: **~8,000–10,000 px** (roughly 3–4× desktop viewport). This is the constraint that anchors the absolute `pixelsPerYear` values.
- **D-04:** `yearToPixel()` derives all era boundaries solely from `data/eras.ts` — no duplicated constants in `lib/`.

### BC Date Convention

- **D-05:** **Direct negation** convention: `-52 = 52 BC`, `-1 = 1 BC`, `1 = 1 AD`. The 16 existing shows already use this convention and require no changes.
- **D-06:** Year `0` is treated as `1 BC` in `yearToDisplay()` (display guard, not a data convention — shows should not store `0` for 1 BC, but if they do, it renders correctly).
- **D-07:** Update `CLAUDE.md` "BC dates" constraint line to say "negative = BC, -52 = 52 BC" instead of the current "0 = 1 BC" wording.

### Seed Dataset

- **D-08:** Additional shows (14–24 needed to reach 30–40 total) are manually curated by the researcher agent — no TMDB API enrichment needed in Phase 1. Poster URLs from TMDB CDN are acceptable as-is.
- **D-09:** Priority gaps to fill:
  1. Ancient Near East (3000–500 BC) — Mesopotamia, Egypt, Persia
  2. Classical Greece & Persia (500–300 BC) — Alexander, Persian Wars
  3. Late Antiquity & Byzantium (300–700 AD) — Constantine, Justinian
  4. Post-WWII to present (1945–2024) — Cold War shows, contemporary period pieces
- **D-10:** Data stays in **TypeScript (`.ts`)** format — both `data/shows.ts` and `data/eras.ts`. The ROADMAP's mention of `data/eras.json` is treated as a typo; type-safety wins.

### Testing

- **D-11:** **Vitest** is the test framework to add. Native ESM, no config overhead with Next.js 14/TypeScript.
- **D-12:** Test files are co-located with source: `lib/yearToPixel.test.ts`, `lib/yearToDisplay.test.ts`.
- **D-13:** Tests must cover: round-trip inverse (`pixelToYear(yearToPixel(y)) === y`), all era boundaries, year `0` display edge case, `-3000` (timeline start), and the BC/AD crossing.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Requirements
- `.planning/REQUIREMENTS.md` §TL-02 — Non-linear scale requirement (the requirement this phase satisfies)
- `.planning/ROADMAP.md` §Phase 1 — Success criteria (5 specific, testable criteria to hit)
- `.planning/PROJECT.md` — Core value and constraints

### Existing Implementation (to rebuild, not reuse as-is)
- `lib/timeline.ts` — Current LINEAR `yearToPixel` + `formatYear`. Needs full rebuild. Read to understand what to replace.
- `data/eras.ts` — 9 existing era definitions. `TIMELINE_START = -100` (wrong — needs `-3000`). No `pixelsPerYear` field. Read and extend.
- `data/shows.ts` — 16 existing shows in `Show[]` format. Keep and extend.
- `types/index.ts` — `Show`, `HistoricalEra`, `HistoricalEvent` interfaces. `HistoricalEra` needs `pixelsPerYear: number` field added.

### Architecture Constraints
- `CLAUDE.md` §Critical Constraints — `yearToPixel()` constraints, RSC/client boundary, GPU layer budget
- `CLAUDE.md` §Architecture Quick Reference — file layout (`lib/yearToPixel.ts`, `lib/yearToDisplay.ts`)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/timeline.ts:formatYear(year, locale)` — BC display logic already works (`year < 0` → "N BC"). `yearToDisplay()` is a rename + year-0 guard on top of this.
- `data/eras.ts:getEraForYear(year)` — useful utility to keep; it'll need updating once `yearStart`/`yearEnd` values change.
- `types/index.ts:HistoricalEra` — solid interface, just needs `pixelsPerYear: number` added.
- `types/index.ts:Show` — complete interface, no changes needed for Phase 1.

### Established Patterns
- All data files use TypeScript (`data/*.ts`) with named exports (`export const SHOWS`, `export const ERAS`). Stay consistent.
- BC date storage: negative integer = BC year number (direct negation). 16 shows already conform.
- The `@/` path alias is active (see `lib/timeline.ts` import of `@/data/eras`).

### Integration Points
- Phase 2 will import `yearToPixel` from `lib/yearToPixel.ts` (new file, not `lib/timeline.ts`). Keep the split clean.
- Phase 2 will import `ERAS` from `data/eras.ts` for background rendering.
- `lib/timeline.ts` currently exports `yearToPixel`, `pixelToYear`, `TOTAL_WIDTH`, `formatYear`. Phase 1 should split: math → `lib/yearToPixel.ts`, display → `lib/yearToDisplay.ts`. Keep a re-export from `lib/timeline.ts` for backward compat until Phase 2 cleans it up.

### Stack Reality Check
- Actual installed stack: **Next.js 14.2**, **Framer Motion 11**, **Tailwind CSS 3**, **next-intl 3** — NOT the v16/12/v4 versions listed in CLAUDE.md. CLAUDE.md needs a stack version update (Phase 1 or Phase 2 scope).
- No test runner installed. Vitest must be added to `devDependencies`.
- `nuqs` is NOT installed — needed for Phase 6, not Phase 1. Don't add it here.

</code_context>

<specifics>
## Specific Ideas

- The researcher should look for shows set in ancient Egypt/Mesopotamia (e.g., *Tutankhamun*, *Barbarians*, if set in the right period) and check their `narrativeYearStart` against the timeline range.
- For the non-linear scale, a ratio table approach works well: define each era's `pixelsPerYear` so the grand total of `sum(era.pixelsPerYear * (era.yearEnd - era.yearStart))` lands in the 8,000–10,000px range.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 1 — Data Foundation + yearToPixel*
*Context gathered: 2026-05-17*
