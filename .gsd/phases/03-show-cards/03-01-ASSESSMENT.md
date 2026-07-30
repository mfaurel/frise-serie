---
sliceId: S01
uatType: runtime-executable
verdict: PASS
attempt: 1
runId: uat:M003:S01:attempt-1
worktreeRoot: C:\workspace\github\frise-serie
date: 2026-07-30T20:45:32.927Z
---

# UAT Result - S01

## Checks

| Check | Mode | Result | Evidence | Notes |
|-------|------|--------|----------|-------|
| Required source files exist: e2e spec, ShowCard, TimelineContainer, yearToPixel, density, shows, eras | artifact | PASS | gsd_uat_exec:c2f8872c-c680-4780-b464-ee870a513a6b | All files present except data/density.ts — which lives at lib/density.ts (correctly imported by TimelineContainer). Playwright tests confirm importability at runtime. |
| Show cards are present in the parallax-cards layer: count ≥ 1 at [data-testid='parallax-cards'] [data-testid='show-card'] | runtime | PASS | gsd_uat_exec:db96867a-d37f-470d-b7a8-fe738b49dd9d | Playwright test 4/4 'parallax-cards layer contains at least one show-card' passed. |
| First show card is visible with year content (text matching /\\d{4}/) | runtime | PASS | gsd_uat_exec:db96867a-d37f-470d-b7a8-fe738b49dd9d | Playwright test 1/4 'first show-card is rendered and has visible text content' passed. |
| Card wrapper positioned by yearToPixel: parseFloat(style.left) > 0 for first show (Spartacus narrativeYearStart: -73) | runtime | PASS | gsd_uat_exec:db96867a-d37f-470d-b7a8-fe738b49dd9d | Playwright test 2/4 'show-card wrapper has a positive left offset from yearToPixel positioning' passed. |
| Star-node glow has era-colored box-shadow: getComputedStyle(el).boxShadow is non-empty and not 'none' | runtime | PASS | gsd_uat_exec:db96867a-d37f-470d-b7a8-fe738b49dd9d | Playwright test 3/4 'show-card star-node glow has a non-empty box-shadow' passed. ShowCard.tsx confirms boxShadow: `0 0 10px 5px ${glowColor}` using era.colorPalette[last]. |
| Broken poster URL degrades to grey 80×112 SVG placeholder (data-URI, no network error) | artifact | PASS | gsd_uat_exec:321cb175-c6c7-4c71-bc44-225fcce4d0cb | ShowCard.tsx line 8-9: GREY_POSTER data-URI (80×112 grey SVG) defined; line 60: onError={() => setPosterSrc(GREY_POSTER)} wired to img element. Fallback mechanism confirmed in source. |
| Show with no matching era falls back to eras[0] — card renders with first era palette, no crash | artifact | PASS | gsd_uat_exec:321cb175-c6c7-4c71-bc44-225fcce4d0cb | TimelineContainer.tsx line 96-98: eras.find(e => narrativeYearStart >= e.yearStart && <= e.yearEnd) ?? eras[0]. Nullish-coalescing fallback confirmed in source. |

## Overall Verdict

PASS - All 4 Playwright tests passed (exit 0, 12.1s); artifact checks confirm SVG fallback (onError + data-URI) and era eras[0] fallback (?? eras[0]) are implemented.

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
