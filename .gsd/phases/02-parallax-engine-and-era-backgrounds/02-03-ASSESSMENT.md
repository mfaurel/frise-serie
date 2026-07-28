---
sliceId: S03
uatType: runtime-executable
verdict: PASS
attempt: 1
runId: uat:M002:S03:attempt-1
worktreeRoot: C:\workspace\github\frise-serie
date: 2026-07-27T20:29:19.007Z
---

# UAT Result - S03

## Checks

| Check | Mode | Result | Evidence | Notes |
|-------|------|--------|----------|-------|
| Three parallax layers (parallax-bg, parallax-axis, parallax-cards) present and visible in the DOM | runtime | PASS | gsd_uat_exec:bbc02f02-8276-4148-b760-ade95ba2fcae | e2e/timeline-s03.spec.ts:3:1, :8:1, :13:1 — all 3 layer-visibility assertions passed (5 passed total in 6.6s) |
| Era backgrounds — exactly 9 distinct [data-testid="era-bg"] gradient elements | runtime | PASS | gsd_uat_exec:bbc02f02-8276-4148-b760-ade95ba2fcae | e2e/timeline-s03.spec.ts:18:1 — era-bg count assertion passed |
| Scroll drives parallax-bg transform at 0.7× offset — scrollLeft=500 yields translateX(350px) | runtime | PASS | gsd_uat_exec:bbc02f02-8276-4148-b760-ade95ba2fcae | e2e/timeline-s03.spec.ts:24:1 — scroll transform assertion passed with workers=1 |
| S02 regression — timeline-scroll visible, timeline-inner width >10000px, year-label visible (3 tests) | runtime | PASS | gsd_uat_exec:b4049771-9b2c-4249-8585-80a2314d07c6 | e2e/timeline-s02.spec.ts — all 3 S02 regression tests passed |
| Smoke regression — page loads without error, title matches /Frise Série/, timeline-scroll visible | runtime | PASS | gsd_uat_exec:f233093c-4d39-4245-8b32-be93a8e17a61 | e2e/smoke.spec.ts — smoke test passed |

## Overall Verdict

PASS - All 9 Playwright assertions passed (5 S03 parallax checks + 3 S02 regression checks + 1 smoke check); no failures or flakiness observed at workers=1.

## Tool Presentation

```json
{
  "surface": "mcp",
  "presentedTools": [
    "gsd_uat_exec",
    "gsd_uat_result_save",
    "gsd_resume",
    "gsd_milestone_status",
    "gsd_journal_query",
    "find",
    "glob",
    "grep",
    "ls",
    "read"
  ],
  "blockedTools": [
    {
      "name": "edit",
      "reason": "forbidden during run-uat"
    },
    {
      "name": "write",
      "reason": "forbidden during run-uat"
    },
    {
      "name": "gsd_exec",
      "reason": "forbidden during run-uat"
    },
    {
      "name": "gsd_summary_save",
      "reason": "forbidden during run-uat"
    },
    {
      "name": "gsd_save_gate_result",
      "reason": "forbidden during run-uat"
    },
    {
      "name": "search-the-web",
      "reason": "forbidden during run-uat"
    },
    {
      "name": "WebSearch",
      "reason": "forbidden during run-uat"
    },
    {
      "name": "Bash",
      "reason": "forbidden during run-uat"
    },
    {
      "name": "Write",
      "reason": "forbidden during run-uat"
    },
    {
      "name": "Edit",
      "reason": "forbidden during run-uat"
    }
  ],
  "toolPresentationPlanId": "run-uat/default-v1"
}
```

## Gate

Aggregate UAT gate saved as pass.
