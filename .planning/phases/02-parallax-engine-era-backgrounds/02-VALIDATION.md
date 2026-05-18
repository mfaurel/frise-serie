---
phase: 2
slug: parallax-engine-era-backgrounds
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-18
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.6 |
| **Config file** | `vitest.config.mts` |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| bgX formula | 01 | 0 | TL-01 | — | N/A | unit | `npx vitest run lib/parallaxFormula.test.ts` | ❌ W0 | ⬜ pending |
| SVG noise encoding | 01 | 0 | TL-03 | — | N/A | unit | `npx vitest run lib/noiseUri.test.ts` | ❌ W0 | ⬜ pending |
| TimelineSkeleton render | 01 | 0 | UX-04 | — | N/A | unit | `npx vitest run components/TimelineSkeleton.test.ts` | ❌ W0 | ⬜ pending |
| Full suite | — | each wave | all | — | — | unit | `npx vitest run` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `lib/parallaxFormula.test.ts` — unit tests for bgX formula: `TOTAL_WIDTH * zoom * 0.7` at progress=1; `shouldReduceMotion=true` produces range `[0, 0]`. Uses `@vitest-environment node` (default — no DOM needed).
- [ ] `lib/noiseUri.test.ts` — verifies `NOISE_SVG_URI` constant contains `%23` (not bare `#`); starts with `url("data:image/svg+xml,`. Uses `@vitest-environment node`.
- [ ] `components/TimelineSkeleton.test.ts` — `@vitest-environment jsdom`; renders `ERAS.length` divs; each has `left` matching `yearToPixel(era.yearStart)` and correct `width`; axis placeholder div at `top: 48`.

*Existing infrastructure covers automated testing — no new framework install needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `touch-action: pan-x` prevents pointercancel on diagonal swipe | TL-01, UX-02 | DevTools touch emulation does not reproduce pointercancel on iOS Safari | Test on physical iPhone: open timeline, swipe diagonally — scroll must not cancel. Only needed for final sign-off, not per-task. |
| Lighthouse FCP ≤ 1.8s on Lighthouse throttled mobile preset | UX-04 | Requires a running dev server and Lighthouse CLI | `npx next build && npx next start`, then `npx lighthouse http://localhost:3000 --preset=mobile --only-categories=performance`. Check "First Contentful Paint" ≤ 1.8s. Confirm FCP element is TimelineSkeleton era band, not a client-rendered element. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
