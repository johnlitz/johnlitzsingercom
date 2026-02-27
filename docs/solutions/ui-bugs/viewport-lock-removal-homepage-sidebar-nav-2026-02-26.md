---
title: "Viewport-locked homepage to calm, scrollable Keybase-inspired design"
date: 2026-02-26
category: ui-bugs
tags:
  - layout
  - responsive-design
  - homepage
  - sidebar-nav
  - spacing
  - scrolling
  - astro
severity: major-refactor
component:
  - BaseLayout.astro
  - LeftColumn.astro
  - index.astro
  - work.astro
  - projects.astro
  - blog/index.astro
  - contact.astro
  - global.css
symptoms:
  - Homepage had overflow:hidden and height:100dvh preventing scroll
  - Sidebar navigation was hidden on homepage
  - Cards forced to fill viewport with flex:1
  - Insufficient spacing between content sections
  - Name underline persisted on homepage inappropriately
resolution_type: design-overhaul
---

# Viewport-Lock Removal: Homepage to Keybase-Inspired Scrollable Design

## Problem

The homepage was intentionally viewport-locked using `overflow: hidden` and `height: 100dvh` to create a dramatic full-screen first impression. However, this approach:

- Broke the consistent fixed-sidebar + scrollable-content layout pattern established on all inner pages
- Hid the sidebar navigation on homepage via `display: none`, reducing wayfinding
- Required special-case media queries for edge cases (short viewports < 659px)
- Created an inconsistent UX where the homepage felt dramatically different from inner pages

The inner pages (work, projects, blog, contact) all used the same calm pattern: sticky sidebar + scrolling main content. The homepage was the only outlier.

## Root Cause

Three CSS rules created the divergent homepage behavior:

1. **Viewport lock** in `BaseLayout.astro` — two media queries forced `height: 100dvh; overflow: hidden` on `.site-main` for `body[data-page="home"]`
2. **Hidden nav** in `LeftColumn.astro` — `display: none` on `.sidebar-nav` for homepage
3. **Flex-fill cards** in `index.astro` — `flex: 1` on `.home-content`, `.highlights`, and `.highlight` stretched cards to fill viewport

## Solution

### Step 1: Remove viewport lock (BaseLayout.astro)

Deleted two media queries:

```css
/* DELETED — homepage viewport lock */
@media (min-width: 769px) {
  :global(body[data-page="home"]) .site-main {
    height: 100dvh;
    min-height: 0;
    overflow: hidden;
    padding-top: clamp(0.5rem, 2dvh, 2rem);
    padding-bottom: clamp(0.5rem, 1.5dvh, 1rem);
  }
}

/* DELETED — short viewport fallback */
@media (min-width: 769px) and (max-height: 659px) {
  :global(body[data-page="home"]) .site-main {
    height: auto;
    min-height: 100dvh;
    overflow: auto;
  }
}
```

Increased main content padding for breathing room:

```css
/* Before */ padding: var(--space-lg) var(--gutter) var(--space-md);
/* After  */ padding: var(--space-xl) var(--gutter) var(--space-lg);
```

### Step 2: Show sidebar nav on homepage (LeftColumn.astro)

Deleted:

```css
:global(body[data-page="home"]) .sidebar-nav {
  display: none;
}
```

### Step 3: Restyle homepage cards for natural scroll (index.astro)

```css
/* Before — viewport-filling */
.home-content { flex: 1; display: flex; flex-direction: column; }
.highlights  { flex: 1; }
.highlight   { flex: 1; justify-content: center; padding: var(--space-sm) 0; }

/* After — natural scroll */
.home-content { max-width: var(--content-max); }
.highlights   { display: flex; flex-direction: column; }
.highlight    { display: block; padding: var(--space-xl) 0; /* 4rem */ }
```

### Step 4: Remove persistent name underline (LeftColumn.astro)

Deleted:

```css
:global(body[data-page="home"]) .name-line::after {
  transform: scaleX(1);
}
```

### Step 5: Increase inner page spacing

All inner pages (work, projects, blog, contact):
- h1 `margin-bottom`: `--space-lg` (2rem) → `--space-xl` (4rem)
- Entry `padding`: `--space-6` (1.5rem) → `--space-lg` (2rem)

### Step 6: Add spacing token (global.css)

Added `--space-3xl: 8rem` after `--space-2xl: 6rem`.

## Verification

Verified at:
- 1366x768 (common laptop) — cards scroll naturally, sidebar stays fixed
- 1920x1080 — same behavior, all 4 cards visible
- 375x812 (mobile) — MobileHeader visible, sidebar hidden, cards scroll
- Dark mode — monochromatic palette works correctly
- Production build — passes cleanly (8 pages)

## Prevention Strategies

### 1. Layout consistency rule
All pages should follow the same fixed-sidebar + scrollable-content pattern. The homepage is not special — it should use the same layout architecture as inner pages. If the homepage needs differentiation, achieve it through content and spacing, not by breaking the layout model.

### 2. Avoid page-specific CSS overrides via data-page
Using `body[data-page="home"]` to create diverging behavior is an anti-pattern. Each override creates a maintenance burden and makes the layout harder to reason about. If you need conditional styling, prefer content-level differences (different components) over layout-level overrides.

### 3. Never use overflow:hidden on content areas
`overflow: hidden` on the main content area is almost always wrong for content-driven pages. It clips content unpredictably, requires fallback media queries for edge cases, and fights the browser's natural scroll behavior.

### 4. Use spacing tokens consistently
Using `--space-xl`, `--space-lg` etc. rather than arbitrary values ensures visual rhythm. When increasing spacing, do it proportionally across all pages to maintain consistency.

### 5. Testing checklist for layout changes
- [ ] Homepage at 1366x768 and 1920x1080
- [ ] All inner pages (work, projects, blog, contact)
- [ ] Mobile (375px) — MobileHeader, no sidebar
- [ ] Tablet (768-1024px) — narrower sidebar
- [ ] Dark mode
- [ ] View transitions between pages
- [ ] Production build passes

## Related Documentation

- `docs/plans/2026-02-26-feat-desktop-layout-viewport-lock-plan.md` — Original viewport-lock plan (now reversed)
- `docs/plans/2026-02-18-feat-persistent-sidebar-nav-redesign-plan.md` — Foundational sidebar architecture
- `docs/plans/2026-02-19-feat-responsive-fluid-layout-all-screens-plan.md` — Fluid spacing tokens
- `docs/brainstorms/2026-02-20-mobile-holistic-redesign-brainstorm.md` — Mobile MobileHeader design
- `docs/solutions/ui-bugs/footer-removal-sidebar-consolidation-Layout-20260226.md` — Recent sidebar footer consolidation
- `docs/solutions/ui-bugs/event-listener-accumulation-persistent-sidebar-System-20260217.md` — Sidebar event listener pattern
- `docs/solutions/ui-bugs/border-spacing-scrollbar-viewport-polish.md` — Prior spacing/scrollbar polish
