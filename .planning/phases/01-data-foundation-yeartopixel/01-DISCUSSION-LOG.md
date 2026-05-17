# Phase 1: Data Foundation + yearToPixel - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-17
**Phase:** 1 — Data Foundation + yearToPixel
**Areas discussed:** Non-linear scale design, Year 0 / BC convention, Seed data coverage, Testing setup

---

## Non-linear scale design

### What drives the ratios?

| Option | Description | Selected |
|--------|-------------|----------|
| Era density (number of shows) | More shows in an era → more pixels. Adjusts as data grows. | ✓ |
| Historical importance / editorial | Manually set per era based on cultural significance. | |
| Fixed logarithmic compression | Global log scale on year axis. Simple but no per-era control. | |

**User's choice:** Era density

---

### Static vs dynamic pixelsPerYear?

| Option | Description | Selected |
|--------|-------------|----------|
| Baked into data/eras.ts (static) | Compute once, stable URLs, matches CLAUDE.md architecture. | ✓ |
| Computed at runtime from show count | Dynamic. Positions shift as shows are added — breaks URLs. | |

**User's choice:** Baked into data/eras.ts

---

### Target total timeline width?

| Option | Description | Selected |
|--------|-------------|----------|
| ~8,000–10,000 px | 3–4× desktop viewport. Common for horizontal timelines. | ✓ |
| ~20,000–30,000 px | Very wide, strong historical depth sense. Heavy on mobile. | |
| You decide | Let researcher/planner calculate optimal width. | |

**User's choice:** ~8,000–10,000 px

---

## Year 0 / BC convention

### Which convention?

| Option | Description | Selected |
|--------|-------------|----------|
| Direct negation: -52 = 52 BC | Intuitive. Current 16 shows already conform. No year 0. | ✓ |
| Astronomical: 0 = 1 BC, -51 = 52 BC | Continuous number line. All existing shows need +1 adjustment. | |

**User's choice:** Direct negation (keep existing data)

---

### Year 0 edge case in yearToDisplay()?

| Option | Description | Selected |
|--------|-------------|----------|
| Treat year 0 as 1 BC (display guard) | Render year 0 as "1 BC" to handle data errors gracefully. | ✓ |
| Forbid year 0 in data (docs only) | No code handling — human convention enforced manually. | |

**User's choice:** Treat year 0 as 1 BC

---

### Update CLAUDE.md to match?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — update CLAUDE.md | Single source of truth. Prevents future contributor confusion. | ✓ |
| No — leave CLAUDE.md as-is | Keep existing doc, rely on schema comments in code. | |

**User's choice:** Yes, update CLAUDE.md

---

## Seed data coverage

### How to source additional shows?

| Option | Description | Selected |
|--------|-------------|----------|
| Manual curation by researcher agent | Highest quality, no external API. Researcher identifies accurate shows per missing era. | ✓ |
| TMDB API enrichment (script exists) | Semi-automated. Faster for metadata. Requires TMDB API key. | |
| Start from PRD examples only | Use existing 16, defer expansion to later phase. | |

**User's choice:** Manual curation by researcher agent

---

### Priority gaps?

| Option | Description | Selected |
|--------|-------------|----------|
| Ancient Near East (3000–500 BC) | Mesopotamia, Egypt, Persia, Babylon. | ✓ |
| Classical Greece & Persia (500–300 BC) | Alexander, Persian Wars, Athens. | ✓ |
| Late Antiquity & Byzantium (300–700 AD) | Constantine, Justinian, fall of Rome. | ✓ |
| Post-WWII to present (1945–2024) | Cold War spy shows, 1960s–70s period dramas. | ✓ |

**User's choice:** All four gaps

---

### Data format?

| Option | Description | Selected |
|--------|-------------|----------|
| Keep TypeScript (.ts) | Type-safe, consistent with existing codebase and CLAUDE.md. | ✓ |
| Migrate to JSON (.json) | More portable. Needs separate types file + runtime validation. | |

**User's choice:** Keep TypeScript

---

## Testing setup

### Framework?

| Option | Description | Selected |
|--------|-------------|----------|
| Vitest | Native ESM, fastest for Next.js/TypeScript. Minimal config. | ✓ |
| Jest | Battle-tested. Extra ESM config needed for Next.js 14. | |
| Node.js built-in test runner | Zero deps. Minimal assertions API. | |

**User's choice:** Vitest

---

### Test file location?

| Option | Description | Selected |
|--------|-------------|----------|
| Co-located (lib/yearToPixel.test.ts) | Easy to find, modern TS convention. | ✓ |
| Separate __tests__ directory | Traditional, keeps tests out of source tree. | |

**User's choice:** Co-located with source

---

## Claude's Discretion

- Concrete `pixelsPerYear` values per era — researcher proposes, constrained by 8,000–10,000px total.
- Specific shows to add for each gap era — researcher curates with historical accuracy in mind.

## Deferred Ideas

None — discussion stayed within Phase 1 scope.
