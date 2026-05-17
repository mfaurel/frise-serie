# Walking Skeleton — Phase 1: Data Foundation + yearToPixel

**Phase:** 01-data-foundation-yeartopixel
**Skeleton type:** Test infrastructure end-to-end proof
**Produced by:** 01-01-PLAN.md (Wave 0)

---

## What Is the Walking Skeleton?

The thinnest possible end-to-end slice that proves the test infrastructure works before any real implementation is written.

**Deliverable:** `npx vitest run` exits 0 (green) with stub test files that assert `true` — proving that Vitest, `@/` alias resolution via `vite-tsconfig-paths`, and the `vitest.config.mts` configuration all work together end-to-end.

This is NOT the real implementation. The stubs will be replaced by real tests in Wave 2.

---

## What the Skeleton Proves

| Concern | Proof |
|---------|-------|
| Vitest is installed and runnable | `npx vitest run` exits 0 |
| `vite-tsconfig-paths` resolves `@/` | Stub imports `@/data/eras` without "module not found" |
| `vitest.config.mts` loads correctly | No config parse errors on first run |
| `package.json` test scripts work | `npm run test:run` exits 0 |
| TypeScript module resolution in tests | No TypeScript errors in stub files |

---

## Architecture Decisions Recorded Here

These decisions are made by Wave 0 and must not be renegotiated in subsequent phases:

| Decision | Value | Rationale |
|----------|-------|-----------|
| Test framework | Vitest 4.x | Native ESM, Next.js-recommended (nextjs.org/docs), zero Babel config |
| Path alias resolution | vite-tsconfig-paths plugin | Reads `tsconfig.json` automatically; no manual alias duplication |
| Test environment | `node` (default) | Phase 1 tests are pure math functions — no DOM needed. Phase 3+ component tests use `@vitest-environment jsdom` per file |
| Test file co-location | `lib/*.test.ts` | D-12: Co-located alongside source, not in separate `__tests__/` directory |
| Config file format | `vitest.config.mts` (`.mts` extension) | TypeScript `.mts` = ES module; avoids CommonJS/ESM interop issues with Next.js project |
| Watch vs CI mode | `npm test` = watch, `npm run test:run` = one-shot CI | Standard Vitest convention |

---

## Skeleton File Manifest

| File | Status After Wave 0 | Content |
|------|---------------------|---------|
| `vitest.config.mts` | Created (new) | defineConfig with tsconfigPaths() + react() plugins, environment: 'node' |
| `lib/yearToPixel.test.ts` | Created (stub) | Passing stubs — real assertions added in Wave 2 |
| `lib/yearToDisplay.test.ts` | Created (stub) | Passing stubs — real assertions added in Wave 2 |
| `package.json` | Modified | Added `"test": "vitest"` and `"test:run": "vitest run"` scripts |
| `node_modules/vitest/` | Installed | `npm install -D vitest @vitejs/plugin-react jsdom vite-tsconfig-paths` |

---

## Subsequent Build-On Constraints

Files created in Wave 0 that later waves MUST NOT break:

- `vitest.config.mts` — Wave 2 must not change `plugins` order (tsconfigPaths before react)
- `lib/yearToPixel.test.ts` — Wave 2 replaces stub bodies with real assertions but keeps the same `describe`/`it` structure
- `lib/yearToDisplay.test.ts` — Same: Wave 2 replaces stub bodies only
- `package.json` `test`/`test:run` scripts — Must remain unchanged throughout all phases

---

## Definition of Done for Skeleton

`npm run test:run` exits 0 with output showing all stub tests passing. No TypeScript errors. No "Cannot find module '@/data/eras'" error. Time to run: under 5 seconds.
