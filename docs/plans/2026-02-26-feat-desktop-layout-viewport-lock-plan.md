---
title: "feat: Desktop Layout — Viewport Lock, Sidebar Scale, Name Underline"
type: feat
status: completed
date: 2026-02-26
origin: docs/brainstorms/2026-02-26-desktop-layout-fixes-brainstorm.md
---

# feat: Desktop Layout — Viewport Lock, Sidebar Scale, Name Underline

## Overview

Three targeted CSS fixes to the desktop homepage layout:

1. **Name underline visibility** — Make the red underline visible under both "John" and "Litzsinger" by increasing spacing between the stacked name lines
2. **Viewport-locked homepage** — The 4 highlight cards (Work, Projects, Writing, Contact) fill the viewport exactly with no scrolling; footer hidden on homepage
3. **Sidebar scale-to-fit** — Left sidebar content dynamically scales via `clamp()` so it fills but never overflows the viewport height

## Problem Statement / Motivation

The current desktop homepage has three visual defects:

- The red `::after` underline under "John" is invisible because the `gap` between name lines (8px) barely exceeds the underline's space requirement (4px offset + 3px height = 7px), leaving only 1px clearance. "Litzsinger" visually overlaps it.
- The homepage can scroll on shorter laptops (1366x768 is the most common laptop resolution). The layout uses `min-height: 100dvh` which sets a *floor*, not a *ceiling*. The footer pushes content beyond the viewport.
- The sidebar has `overflow-y: auto`, meaning it can scroll if content grows — particularly on inner pages where 5 nav items are visible. There is no dynamic scaling.

## Proposed Solution

### Fix 1: Name Underline — Increase Gap

In `LeftColumn.astro`, increase the `gap` on `.name-full` (the flex container holding "John" and "Litzsinger") from the current tight `line-height: 1.05` spacing. Add explicit `gap` or `margin-bottom` so the `::after` pseudo-element at `bottom: -4px; height: 3px` has room to render without being overlapped by the next line.

**Approach:** Add `gap: var(--space-sm)` (8px) to the `.name-full` flex column. This gives the underline 8px of clearance below "John" instead of ~1px. The underline values (`bottom: -4px`, `height: 3px`) stay unchanged, maintaining consistency with the design system.

### Fix 2: Viewport-Locked Homepage — Flexbox Fill

**Homepage-only changes** (scoped via `body[data-page="home"]`):

1. **Hide footer:** Add `body[data-page="home"] .site-footer { display: none }` in `Footer.astro`. This follows the established pattern used for sidebar nav hiding.

2. **Lock main content to viewport:** On the homepage, change `.site-main` from `min-height: 100dvh` to `height: 100dvh` and `overflow: hidden`. The `.site` grid already uses `min-height: 100dvh` — the homepage override locks it to exactly the viewport.

3. **Distribute cards evenly:** The `.home-content` container gets `flex: 1` to fill available space. The `.highlights` container gets `flex: 1` with each `.highlight` card getting `flex: 1` to distribute evenly across available height.

4. **Graceful degradation below 660px:** Add `@media (max-height: 659px)` that relaxes the viewport lock — reverts to `min-height: 100dvh` and `overflow: auto` so content can scroll on very short viewports (e.g., browser zoom at 125%+ on a 768px monitor).

**Inner pages are NOT affected.** All changes are scoped to `body[data-page="home"]`.

### Fix 3: Sidebar Scale-to-Fit — `clamp()` + `dvh`

Make the sidebar's internal spacing and font sizes responsive to viewport height:

1. **`.left-column-inner`:** Set `height: 100%`, use `display: flex; flex-direction: column; justify-content: center` (homepage) or `justify-content: flex-start` with distributed gaps (inner pages).

2. **Font sizes:** Use `clamp()` with `dvh` for the name: e.g., `font-size: clamp(1.5rem, 3dvh, var(--text-2xl))`. This scales the name text between a readable minimum and the design system maximum based on viewport height.

3. **Spacing:** Use `clamp()` on padding and gaps: e.g., `padding: clamp(1rem, 3dvh, 2rem)`.

4. **Keep `overflow-y: auto` as safety net** but ensure content never triggers it at 660px+ viewport heights.

5. **Tagline font stays at `var(--text-base)` minimum** — does not scale down below 1rem for readability.

## Technical Considerations

### Viewport height units

Use `dvh` consistently (already the pattern in the codebase). `dvh` accounts for mobile browser chrome resize, though these fixes target desktop.

### View transitions

The sidebar persists across navigations via `transition:persist="sidebar"`. When navigating from an inner page to the homepage:
- `data-page` changes to `home` (handled by existing `astro:after-swap` handler)
- Footer hiding, viewport lock, and sidebar nav hiding all trigger automatically via CSS
- **Add sidebar scroll reset** in `astro:after-swap`: set `scrollTop = 0` on `.left-column` when navigating to homepage

### Stacking context and z-index

No z-index changes needed. The `::after` underlines use `position: absolute` within their parent elements, which already have `position: relative`.

### Browser zoom

At 125%+ zoom on a 768px monitor, effective viewport drops below 660px. The `@media (max-height: 659px)` fallback handles this by allowing scrolling.

### Print styles

`overflow: hidden` and `height: 100dvh` have no meaning in print context. No print-specific overrides needed — the browser ignores viewport units when printing.

### WCAG text scaling

The sidebar's `dvh`-based font sizes respond to page zoom (which changes the viewport dimensions) but NOT to browser text-size-only zoom. This is an acceptable trade-off — the `clamp()` minimum ensures text never drops below readable sizes.

## Acceptance Criteria

- [x] Red underline is clearly visible under both "John" and "Litzsinger" on the homepage at all viewport widths (769px–2560px)
- [x] Red underline still animates correctly on hover on inner pages
- [x] Homepage shows all 4 highlight cards within the viewport with no scrollbar at 1366x768, 1440x900, and 1920x1080
- [x] Footer is not visible on the homepage
- [x] Footer is visible on all inner pages (work, projects, writing, blog, contact, 404)
- [x] Left sidebar content fits without scrolling at viewport heights 660px and above
- [x] Left sidebar nav (on inner pages) fits without scrolling at viewport heights 660px and above
- [x] At viewport heights below 660px, homepage allows natural scrolling (graceful degradation)
- [x] View transitions between homepage and inner pages work smoothly — footer appears/disappears, sidebar nav toggles, no layout shift
- [x] Homepage cards fill available vertical space evenly (not compressed at top with empty space below)
- [x] No regressions on mobile layout (below 768px width)

## Success Metrics

- Zero scrollbar on homepage at desktop viewports 1366x768 and above
- Both name underlines visually distinct and visible
- Sidebar content never triggers `overflow-y: auto` scrolling at 660px+ height

## Dependencies & Risks

**Risk: Content edits break viewport lock.** If highlight card descriptions are made significantly longer, text wrapping could push total card height beyond the viewport. **Mitigation:** Use `overflow: hidden` on individual cards and `text-overflow: ellipsis` on descriptions as a safety valve, or cap card description with a `max-height`.

**Risk: Sidebar tagline text reflow at scaled sizes.** The tagline (~130 characters) wraps to 3-6 lines depending on sidebar width and font size. Scaling the sidebar could change wrapping. **Mitigation:** Keep tagline font at `var(--text-base)` minimum, only scale name and spacing.

**Risk: `dvh` unit inconsistency across browsers.** `dvh` is well-supported in modern browsers (Chrome 108+, Firefox 101+, Safari 15.4+). The site already uses `dvh` throughout. **Mitigation:** None needed — existing pattern.

## Implementation Order

1. **Name underline fix** (isolated, quick) — `LeftColumn.astro`
2. **Footer hiding** — `Footer.astro`
3. **Sidebar scale-to-fit** — `LeftColumn.astro` + `BaseLayout.astro`
4. **Viewport-locked homepage** — `index.astro` + `BaseLayout.astro`
5. **View transition polish** — `BaseLayout.astro` script block
6. **Cross-viewport testing** — 1366x768, 1440x900, 1920x1080, 2560x1440; zoom 125%

## Files to Modify

| File | Changes |
|---|---|
| `src/components/LeftColumn.astro` | Increase `.name-full` gap; add `dvh`-based `clamp()` for font sizes and spacing |
| `src/components/Footer.astro` | Add `body[data-page="home"] .site-footer { display: none }` |
| `src/layouts/BaseLayout.astro` | Homepage-scoped `.site-main` height lock; sidebar scroll reset in script |
| `src/pages/index.astro` | Flex distribution on `.home-content` and `.highlights`; `flex: 1` on `.highlight` cards |
| `src/styles/global.css` | Possible: short-viewport fallback media query |

## Sources & References

- **Origin brainstorm:** [docs/brainstorms/2026-02-26-desktop-layout-fixes-brainstorm.md](docs/brainstorms/2026-02-26-desktop-layout-fixes-brainstorm.md) — Key decisions: flexbox approach, two separate underlines, footer hidden on homepage, 768px min height, sidebar scale-to-fit
- **Past solution — viewport polish:** `docs/solutions/ui-bugs/border-spacing-scrollbar-viewport-polish.md` — Target viewport is 1366x660 (browser chrome eats ~100px), audit vertical spacing before committing
- **Past solution — Astro scoped style specificity:** `docs/solutions/ui-bugs/scoped-style-specificity-global-override-System-20260217.md` — Use `:global()` wrapper for `body[data-page]` selectors (already established pattern)
- **Past solution — data-page layout:** `docs/solutions/ui-bugs/mobile-content-hidden-data-page-layout-System-20260217.md` — Scope conditional CSS to specific `data-page` values, don't use blanket rules
