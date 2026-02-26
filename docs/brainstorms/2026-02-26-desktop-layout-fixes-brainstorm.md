# Desktop Layout Fixes Brainstorm

**Date:** 2026-02-26
**Status:** Approved
**Branch:** feat/mobile-holistic-redesign (continuing from mobile work)

## What We're Building

Three targeted fixes to the desktop homepage layout:

1. **Name underline visibility** — Both "John" and "Litzsinger" need clearly visible, separate red underlines on the homepage. Currently the underline under "John" is hidden by "Litzsinger" sitting directly below it due to tight `line-height: 1.05`.

2. **No-scroll homepage** — The homepage (Work, Projects, Writing, Contact sections) must fit entirely within the viewport with zero scrolling. Footer is hidden on the homepage. Minimum supported height: 768px.

3. **No-scroll sidebar** — The left sidebar must scale its content to always fit the viewport height. Uses flexible spacing so it never requires scrolling.

## Why This Approach

**Flexbox viewport-lock (Approach A)** chosen over CSS Grid because:
- The homepage already uses a flex column layout — minimal changes needed
- Flexbox `flex: 1` distribution is simpler and more predictable for 4 equal-ish cards
- Grid would add complexity without clear benefit for this content pattern

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Underline style | Two separate lines (one per word) | Matches existing design intent, just needs spacing fix |
| Footer on homepage | Hidden | Frees vertical space for sections to fill viewport |
| Min viewport height | 768px | Covers the widest range of laptop screens (1366x768 is most common) |
| Sidebar overflow | Scale to fit | Flexible spacing/sizing adapts to any viewport height |
| Layout method | Flexbox | Simpler than Grid, already in use, minimal CSS changes |

## Approach Details

### 1. Name Underline Fix
- Increase gap between `.name-line` spans in `LeftColumn.astro` so the `::after` underline under "John" (at `bottom: -4px`) doesn't collide with "Litzsinger" below
- May adjust `line-height` or add explicit `margin-bottom` / `gap` to the `.name-full` flex container

### 2. Viewport-Locked Homepage
- `.site-main` on homepage: `height: 100dvh`, `overflow: hidden`
- `.home-content`: flex column, `flex: 1`
- `.highlights`: `flex: 1`, each `.highlight` card gets `flex: 1` for even distribution
- Footer: `display: none` on `body[data-page="home"]`
- Below 768px height: allow natural scroll as fallback

### 3. Sidebar Scale-to-Fit
- `.left-column-inner`: flex column, `height: 100%`, distribute space via `justify-content` or flex gaps
- Keep `overflow-y: auto` as safety net but ensure content never triggers it
- On inner pages (with nav visible), flex distributes space between identity + nav
- Use `clamp()` for font sizes/spacing to scale down on shorter viewports

## Files to Modify

- `src/components/LeftColumn.astro` — name spacing, sidebar flex scaling
- `src/layouts/BaseLayout.astro` — site-main viewport lock
- `src/pages/index.astro` — homepage content flex distribution
- `src/components/Footer.astro` — hide on homepage
- `src/styles/global.css` — possible token adjustments

## Open Questions

None — all questions resolved during brainstorm.
