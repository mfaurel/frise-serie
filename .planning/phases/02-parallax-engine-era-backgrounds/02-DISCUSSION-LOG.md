# Phase 2: Parallax Engine + Era Backgrounds - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-18
**Phase:** 2 — Parallax Engine + Era Backgrounds
**Areas discussed:** page.tsx SSR architecture, Timeline.tsx refactor scope, Cards during Phase 2

---

## page.tsx SSR Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Full conversion now | Convert page.tsx to Server Component; extract locale/filters/selectedShow into ClientShell.tsx; TimelineSkeleton renders in SSR | ✓ |
| Minimal SSR: skeleton only | Keep page.tsx as 'use client'; add TimelineSkeleton as a server-rendered element via a separate import | |
| Defer to Phase 7 | Accept client-side skeleton measurement; defer full SSR conversion to Phase 7 when [locale] routing forces the refactor | |

**User's choice:** Full conversion now
**Notes:** Phase 7 will add [locale] routing on top — the ClientShell architecture is designed to be forward-compatible.

---

### Follow-up: Locale state location

| Option | Description | Selected |
|--------|-------------|----------|
| ClientShell.tsx holds locale state | useState('fr') in ClientShell; Phase 7 replaces with route params | ✓ |
| Hardcode 'fr' for Phase 2 | No locale toggle in Phase 2; added in Phase 7 | |

**User's choice:** ClientShell.tsx holds locale state (useState, default 'fr')

---

## Timeline.tsx Refactor Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Targeted fixes only | Fix bgX ratio, add touch-action, useReducedMotion, update imports; leave cards/events untouched | |
| Refactor to 3-layer architecture | Extract BackgroundLayer, AxisLayer; Timeline becomes orchestrator | ✓ |

**User's choice:** Refactor to 3-layer architecture

---

### Follow-up: Card/event logic during refactor

| Option | Description | Selected |
|--------|-------------|----------|
| Stay in Timeline.tsx, restructured around layers | Card + event rendering reorganized inside the new card track section; no logic moved to new files | ✓ |
| Strip cards/events, pure fresco in Phase 2 | Remove card rendering; Phase 3 re-adds | |
| Move to CardTrackLayer.tsx (new file) | Extract now; Phase 3 extends | |

**User's choice:** Stay in Timeline.tsx, restructured around layers

---

### Follow-up: Layer file structure

| Option | Description | Selected |
|--------|-------------|----------|
| Separate files: BackgroundLayer.tsx, AxisLayer.tsx | Clear RSC boundary per file; testable individually | ✓ |
| Inline sections in Timeline.tsx | No new files; restructured with comments only | |

**User's choice:** Separate files — BackgroundLayer.tsx (Server Component) + AxisLayer.tsx

---

## Cards During Phase 2

| Option | Description | Selected |
|--------|-------------|----------|
| Keep cards visible | Card rendering stays; 30+ shows visible; no regression | ✓ |
| Strip cards, pure fresco | Remove card rendering for a clean Lighthouse benchmark | |

**User's choice:** Keep cards visible (no regression)

---

## Claude's Discretion

None — all areas were explicitly decided by the user.

## Deferred Ideas

None — discussion stayed within phase scope.
