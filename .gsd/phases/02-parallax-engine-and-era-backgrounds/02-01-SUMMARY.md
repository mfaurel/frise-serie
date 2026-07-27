---
id: S01
parent: M002
milestone: M002
provides:
  - Next.js 16 App Router scaffold at app/ with static export configuration
  - Static HTML build output at out/index.html (npm run build exits 0)
  - Playwright smoke test infrastructure (playwright.config.ts + e2e/smoke.spec.ts) with webServer auto-start
  - Clean TypeScript baseline (npm run typecheck exits 0)
  - Tailwind v4 PostCSS pipeline via @tailwindcss/postcss
requires:
  []
affects:
  []
key_files:
  - package.json
  - next.config.ts
  - postcss.config.mjs
  - app/globals.css
  - app/layout.tsx
  - app/page.tsx
  - playwright.config.ts
  - e2e/smoke.spec.ts
  - .gitignore
key_decisions:
  - next.config.ts uses output: 'export' + trailingSlash + images.unoptimized — images.unoptimized is required because Next.js Image Optimization API is incompatible with fully static HTML output
  - postcss.config.mjs uses @tailwindcss/postcss plugin (Tailwind v4) — replaces the old tailwindcss + autoprefixer pair from v3
  - app/globals.css uses @import 'tailwindcss' directive (Tailwind v4) — replaces @tailwind base/components/utilities from v3
  - playwright.config.ts uses webServer block to auto-start npm run dev; reuseExistingServer: !process.env.CI so local dev reuses a running server, CI always spawns fresh
patterns_established:
  - Playwright webServer pattern: dev server auto-starts for e2e tests via webServer block; CI vs local behavior controlled by reuseExistingServer: !process.env.CI
  - Tailwind v4 integration: @tailwindcss/postcss in postcss.config.mjs + @import 'tailwindcss' in globals.css — no tailwind.config file needed
observability_surfaces:
  - npm run build — exits 0 with out/index.html as success signal; TypeScript and Turbopack errors print to stdout on failure
  - npm run typecheck — exits 0 on success; type errors name exact file and line number
  - npx playwright test e2e/smoke.spec.ts — exit 0 = dev server starts and page renders correctly; non-zero = check webServer block output in playwright-report/
drill_down_paths:
  - .gsd/phases/02-parallax-engine-and-era-backgrounds/T01-SUMMARY.md
  - .gsd/phases/02-parallax-engine-and-era-backgrounds/T02-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-07-27T15:37:47.404Z
blocker_discovered: false
---

# S01: Next.js project scaffold with App Router and static export

**Next.js 16 App Router scaffold with static export (out/index.html), Tailwind v4, and Playwright smoke test infrastructure — npm run build exits 0 and typecheck is clean.**

## What Happened

The project had package.json with all required dependencies declared but no node_modules and no App Router structure. Two tasks ran in sequence to deliver the slice goal.

T01 bootstrapped the full runnable scaffold: ran `npm install` to hydrate node_modules, created `next.config.ts` with `output: 'export'` + `trailingSlash: true` + `images.unoptimized: true` (required because Next.js Image Optimization API is incompatible with static HTML output), created `postcss.config.mjs` using `@tailwindcss/postcss` (the correct Tailwind v4 PostCSS integration), created `app/globals.css` with `@import "tailwindcss"` (Tailwind v4 directive), created `app/layout.tsx` as the RootLayout with `<html lang="fr">` and Metadata export, and created `app/page.tsx` with a centered `<h1>Frise Série</h1>`. The existing `tsconfig.json` was already correctly configured for App Router — no changes needed. Verified with `npm run typecheck` (tsc --noEmit), which exited 0 with no errors.

T02 added the build artifact and browser test infrastructure: ran `npm install --save-dev @playwright/test` which added @playwright/test ^1.62.0, created `playwright.config.ts` with a `webServer` block pointing at `npm run dev` on localhost:3000 with `reuseExistingServer: !process.env.CI` (local dev reuses a running server; CI always spawns fresh), created `e2e/smoke.spec.ts` with one test that navigates to `/`, asserts page title is "Frise Série", and asserts the h1 heading is visible, and updated `.gitignore` to exclude playwright output directories. Ran `npm run build` which invoked Next.js 16 Turbopack, compiled successfully, ran TypeScript checks, and wrote static HTML to `out/`. Confirmed `out/index.html` exists. A final `npm run typecheck` pass exited 0 — the new Playwright files are type-correct.

Slice-level verification (gsd_exec 3706dc97) confirmed 8/8 checks pass: out/index.html present, playwright.config.ts and e2e/smoke.spec.ts present, next.config.ts contains `output: 'export'`, app/layout.tsx and app/page.tsx present, and package.json has both `build` and `typecheck` scripts.

## Verification

Build output: out/index.html present and non-empty after npm run build (gsd_exec node check, T02 verification row 2 + row 3). TypeScript: npm run typecheck exits 0 with no diagnostics — verified twice, after T01 (gsd_exec e854206b) and after T02 (T02 verification row 4). Playwright infrastructure: playwright.config.ts and e2e/smoke.spec.ts both present and type-correct (gsd_exec 3706dc97). Current state verification (gsd_exec 3706dc97-5195-42aa-9e07-8a9278f3dd81, exit 0): 8 pass, 0 fail.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

none

## Known Limitations

Playwright browser binaries must be installed separately with `npx playwright install chromium` before the first e2e test run — this is standard Playwright setup and not a code defect. The smoke test has not been executed end-to-end against a live browser in this environment because browser binaries were not pre-installed; the test infrastructure is in place and type-correct.

## Follow-ups

Run `npx playwright install chromium && npx playwright test e2e/smoke.spec.ts` once browser binaries are available to confirm the smoke test passes end-to-end against the live dev server.

## Files Created/Modified

- `package.json` — Added @playwright/test ^1.62.0 to devDependencies
- `next.config.ts` — Created — static export config: output: 'export', trailingSlash, images.unoptimized
- `postcss.config.mjs` — Created — Tailwind v4 PostCSS plugin (@tailwindcss/postcss)
- `app/globals.css` — Created — Tailwind v4 global styles with @import 'tailwindcss'
- `app/layout.tsx` — Created — RootLayout with <html lang='fr'>, Metadata export for title/description
- `app/page.tsx` — Created — Home page with centered <h1>Frise Série</h1>
- `playwright.config.ts` — Created — Playwright config with webServer block (npm run dev, localhost:3000, reuseExistingServer: !CI)
- `e2e/smoke.spec.ts` — Created — smoke test: navigate to /, assert title 'Frise Série' and h1 heading visible
- `.gitignore` — Added playwright output directories: test-results/, playwright-report/, blob-report/, playwright/.cache/
