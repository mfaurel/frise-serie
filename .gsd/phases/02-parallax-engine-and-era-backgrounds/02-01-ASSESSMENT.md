---
sliceId: S01
uatType: runtime-executable
verdict: PASS
attempt: 1
runId: uat:M002:S01:attempt-1
worktreeRoot: C:\workspace\github\frise-serie
date: 2026-07-27T15:41:03.218Z
---

# UAT Result - S01

## Checks

| Check | Mode | Result | Evidence | Notes |
|-------|------|--------|----------|-------|
| Static export artifact check: out/index.html present and non-empty; out/404.html present; out/_next/ present | artifact | PASS | gsd_uat_exec:02e33a27-884c-42e4-af63-1447a866154a | out/index.html 5306 bytes, out/404.html 7642 bytes, out/_next present with 2 entries. Top-level out/ contains: 404, 404.html, index.html, index.txt, _next, _not-found and Next.js tree/head txt files. |
| Playwright smoke test — dev server render: npx playwright test e2e/smoke.spec.ts exits 0 with 1 passed; page title Frise Serie and h1 visible | runtime | PASS | gsd_uat_exec:091299ba-7528-4131-8b03-d118123b8f74<br>gsd_uat_exec:0b082019-54a8-4d7d-81f4-6b9abae3d31a<br>gsd_uat_exec:084e5295-3796-4b8d-b11c-7d73dca7893a | After installing Chromium binaries (npx playwright install chromium), the smoke test ran successfully: 1 passed (22.9s). Dev server auto-started via webServer block. Title and h1 assertions passed. |
| TypeScript type-check: npm run typecheck (tsc --noEmit) exits 0 with no diagnostic output | runtime | PASS | gsd_uat_exec:b13bacb2-b48b-4688-8ea6-d6dce2d4f3e2 | npm run typecheck (tsc --noEmit) exited 0 with no diagnostic output. TypeScript baseline is clean. |

## Overall Verdict

PASS - All three automatable checks passed: static export artifacts present and non-empty, TypeScript type-check exits 0, and Playwright smoke test (1 passed, 22.9s) confirmed dev server renders page title and h1 heading correctly after installing Chromium binaries.

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
