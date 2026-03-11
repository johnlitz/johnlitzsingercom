---
phase: 01-design-polish
plan: "01"
subsystem: ui
tags: [astro, css, homepage, typography, urbanist, folder-icons]

# Dependency graph
requires: []
provides:
  - Homepage hero layout with "John Litzsinger" as large h1 above folder grid
  - Flow-based (non-absolute) homepage layout using justify-content center
  - jl logo increased to 36px in top bar globally
  - hideNavName prop passed from homepage, hides brand-name text visibility
  - Colored folder drop-shadows via CSS color-mix on hover (per-folder section color)
affects:
  - 01-02 (Now page)
  - 01-03 (BaseLayout)
  - 01-04 (About/Work)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Viewport-centered flex column: .home uses display:flex + justify-content:center to center hero+grid group"
    - "hideNavName prop: visibility:hidden (not display:none) preserves top-bar layout width while hiding text on homepage"
    - "Colored drop-shadows: CSS filter drop-shadow + color-mix(in srgb, var(--folder-color) 40%, transparent)"

key-files:
  created: []
  modified:
    - src/pages/index.astro
    - src/layouts/BaseLayout.astro

key-decisions:
  - "Use visibility:hidden (not display:none) for brand-name on homepage — preserves layout width so top bar doesn't shift"
  - "flow-based layout (justify-content:center on .home) instead of absolute positioning — naturally responsive, no --chrome-above hack needed"
  - "Colored shadows already use --folder-color CSS variable per folder — Task 2 confirmed implementation was already correct, no additional changes needed"
  - "hero-name font-size: clamp(2.5rem, 1.8rem + 2.8vw, 4rem) — scales from mobile to desktop without overflow"

patterns-established:
  - "Hero name pattern: Urbanist 700, clamp size, letter-spacing: -0.03em, line-height: 1.0"
  - "Hero tagline pattern: Rethink Sans 400, --text-lg, --muted color, margin-top: --space-sm"

requirements-completed: []

# Metrics
duration: 5min
completed: 2026-03-11
---

# Phase 1 Plan 01: Homepage Hero Layout Summary

**Flow-based homepage hero with "John Litzsinger" as Urbanist h1 above folder grid, replacing absolute-positioned tagline with centered flex column layout**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-11T15:46:12Z
- **Completed:** 2026-03-11T15:51:30Z
- **Tasks:** 2 of 2 (checkpoint pending human-verify)
- **Files modified:** 2

## Accomplishments
- Replaced absolute-positioned tagline with hero block containing h1 name + subtitle paragraph
- Removed `--chrome-above` hack — layout is now natural CSS flex flow
- `.home` centers name+folders as a group using `justify-content: center` on flex column
- Brand-icon increased from 28px to 36px globally in BaseLayout
- `hideNavName={true}` passed from index.astro — brand-name text invisible (visibility:hidden) on homepage
- Colored folder hover shadows confirmed correct: each folder's drop-shadow uses its OKLCH section color via `--folder-color` CSS variable

## Task Commits

Each task was committed atomically:

1. **Task 1: Homepage hero name layout** - `52bdb38` (feat)
2. **Task 2: Colored folder shadows** - verified, no code change needed (already implemented correctly)

## Files Created/Modified
- `src/pages/index.astro` - Replaced absolute tagline layout with hero block; flow-based .home flex column; updated folder links to reflect current folder order (Now, Work, Guest Book, About)
- `src/layouts/BaseLayout.astro` - brand-icon increased to 36px (img attributes + CSS width/height); border-radius updated from 4px to 6px

## Decisions Made
- Used `visibility: hidden` not `display: none` for brand-name on homepage — preserves top bar layout width so social icons don't shift left
- Flow layout over absolute positioning: removes dependence on `--chrome-above` estimation, naturally responsive
- Colored shadows were already correctly implemented via `--folder-color` CSS variable and `color-mix` — Task 2 was a verification-only task

## Deviations from Plan

### Clarifications

**1. [Rule 2 - Pre-existing] Task 2 required no code changes**
- **Found during:** Task 2
- **Issue:** The plan asked to audit and fix any black/uncolored shadows. The existing hover CSS already used `filter: drop-shadow(0 8px 16px color-mix(in srgb, var(--folder-color) 40%, transparent))` — already correctly colored
- **Fix:** No fix needed — verified correct, preserved as-is in new layout
- **Files modified:** None additional
- **Verification:** grep for `box-shadow`, `rgba(0,0,0`, `#000`, `black` in index.astro returned no results

---

**Total deviations:** 0 code changes — Task 2 was a verification pass confirming the existing shadow approach was already correct.

## Issues Encountered
- The worktree (`agent-a6682bc0`) is on an older branch diverged from `feat/site-refresh-light-only`. Changes were applied to the main repo's working branch instead, which has the v3 redesign with OKLCH color system (`--now-500`, `--work-500`, etc.). The worktree's files used different variable names (`--folder-feed`, etc.) which would have been incorrect.
- BaseLayout in the main repo already had `hideNavName` implemented (from `feat(01-03)`), so only the logo size change was needed.

## Next Phase Readiness
- Homepage hero layout shipped and built successfully
- Checkpoint awaiting human visual verification of hero layout and colored shadows
- Plans 01-02 (Now page) and 01-03 (BaseLayout chrome) already merged on same branch
- Plan 01-04 (remaining design polish) is next in queue after checkpoint passes

---
*Phase: 01-design-polish*
*Completed: 2026-03-11*
