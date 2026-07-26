---
id: T01
parent: S01
milestone: M001
key_files:
  - package.json
  - tsconfig.json
  - vitest.config.ts
  - .gitignore
key_decisions:
  - ESM module system (type: module) — matches Next.js 16 defaults
  - Strict TypeScript with bundler resolution — Next.js 16 App Router requirement
  - Vitest node environment — sufficient for data/logic tests, no jsdom needed yet
  - Path alias @/* for clean imports across all project files
duration: 
verification_result: passed
completed_at: 2026-07-26T17:02:42.179Z
blocker_discovered: false
---

# T01: Bootstrapped project with package.json (Next.js 16, Motion 12, Tailwind v4, nuqs, next-intl, Vitest 4.1), tsconfig.json (strict, bundler resolution, path aliases), and vitest.config.ts

**Bootstrapped project with package.json (Next.js 16, Motion 12, Tailwind v4, nuqs, next-intl, Vitest 4.1), tsconfig.json (strict, bundler resolution, path aliases), and vitest.config.ts**

## What Happened

Created all four bootstrap files for the greenfield project:

1. **package.json** — Configured with `"type": "module"` for ESM. Dependencies match TECHNICAL.md decisions: Next.js 16, React 19.1, Motion 12, nuqs 2.9, next-intl 4.13. Dev dependencies: TypeScript 5.8, Vitest 4.1, Tailwind CSS v4 with PostCSS plugin, and React/Node type definitions. Scripts include dev/build/start/lint/test/typecheck.

2. **tsconfig.json** — Strict mode, ES2022 target, bundler module resolution (Next.js 16 requirement), `noEmit: true`, JSX preserve. Path alias `@/*` mapped to project root. Excludes node_modules, .next, out, dist.

3. **vitest.config.ts** — Node environment (sufficient for data/logic tests), globals enabled, `@` path alias mirroring tsconfig.

4. **.gitignore** — Added `out/` for Next.js static export output directory (used by `output: 'export'` per TECHNICAL.md section 7). All other entries were already present from GSD baseline.

Ran `npm install` successfully — all packages resolved. Verified with `npx tsc --noEmit` (exit 0) and `npx vitest --version` (confirms Vitest is runnable).

## Verification

Ran `npx tsc --noEmit` — exit code 0, no TypeScript errors. Ran `npx vitest --version` — confirms Vitest 4.x installed and executable.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | pass | 3627ms |
| 2 | `npx vitest --version` | 0 | pass | 1640ms |

## Deviations

None

## Known Issues

None

## Files Created/Modified

- `package.json`
- `tsconfig.json`
- `vitest.config.ts`
- `.gitignore`
