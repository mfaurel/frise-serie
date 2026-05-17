---
phase: 1
slug: data-foundation-yeartopixel
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-17
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (to be installed in Wave 0) |
| **Config file** | `vitest.config.mts` — Wave 0 installs |
| **Quick run command** | `npx vitest run lib/yearToPixel.test.ts lib/yearToDisplay.test.ts` |
| **Full suite command** | `npm run test:run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run lib/yearToPixel.test.ts lib/yearToDisplay.test.ts`
- **After every plan wave:** Run `npm run test:run`
- **Before `/gsd:verify-work`:** Full suite green + `npx tsc --noEmit` green

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 0 | TL-02-A | yearToPixel(-3000) === 0 | unit | `npx vitest run lib/yearToPixel.test.ts` | ❌ Wave 0 | ⬜ pending |
| 1-01-02 | 01 | 0 | TL-02-B | Renaissance denser than Antiquity | unit | `npx vitest run lib/yearToPixel.test.ts` | ❌ Wave 0 | ⬜ pending |
| 1-01-03 | 01 | 0 | TL-02-C | Round-trip: pixelToYear(yearToPixel(y)) === y | unit | `npx vitest run lib/yearToPixel.test.ts` | ❌ Wave 0 | ⬜ pending |
| 1-01-04 | 01 | 0 | TL-02-D | yearToDisplay(0, 'en') === '1 BC' | unit | `npx vitest run lib/yearToDisplay.test.ts` | ❌ Wave 0 | ⬜ pending |
| 1-01-05 | 01 | 0 | TL-02-E | yearToDisplay(-52, 'fr') === '52 av. J.-C.' | unit | `npx vitest run lib/yearToDisplay.test.ts` | ❌ Wave 0 | ⬜ pending |
| 1-01-06 | 01 | 3 | TL-02-F | import { SHOWS } compiles without TS errors | type-check | `npx tsc --noEmit` | ❌ Wave 0 | ⬜ pending |
| 1-01-07 | 01 | 2 | TL-02-G | No duplicated era constants in lib/ | manual | Code review | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `lib/yearToPixel.test.ts` — stubs for TL-02-A, TL-02-B, TL-02-C
- [ ] `lib/yearToDisplay.test.ts` — stubs for TL-02-D, TL-02-E
- [ ] `vitest.config.mts` — framework configuration with `vite-tsconfig-paths` for `@/` alias
- [ ] Framework install: `npm install -D vitest @vitejs/plugin-react jsdom vite-tsconfig-paths`
- [ ] `package.json` scripts: add `"test": "vitest"` and `"test:run": "vitest run"`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No duplicated era constants in lib/ | TL-02-G | Structural code review, not a runtime assertion | Grep `lib/*.ts` for hardcoded year values; only `data/eras.ts` should define them |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
