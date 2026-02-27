---
module: System
date: 2026-02-17
problem_type: ui_bug
component: frontend_stimulus
symptoms:
  - "Mobile inner pages show empty white screen below sticky header"
  - "Page content (main + footer) hidden on viewports below 768px"
  - "Mobile header renders below page content due to DOM order"
root_cause: logic_error
resolution_type: code_fix
severity: high
tags: [mobile-layout, css-display-none, data-attribute, dom-order, astro-layout]
---

# Troubleshooting: Mobile Layout Content Hidden by Blanket display:none on Wrapper

## Problem
When refactoring from a fixed sidebar layout to a dual-mode layout (data-page="home" vs "inner"), applying `display: none` to the entire `.site` wrapper at mobile breakpoints hid all page content on inner pages. Additionally, mobile-only elements rendered after the `.site` div appeared below content instead of above it.

## Environment
- Module: System (BaseLayout.astro)
- Framework: Astro 5
- Affected Component: BaseLayout layout wrapper, CSS mobile breakpoint
- Date: 2026-02-17

## Symptoms
- Mobile inner pages (Work, Projects, Writing, Contact) showed only the sticky mobile header with a blank white screen below
- Mobile homepage rendered correctly (dedicated `.mobile-home` div was separate from `.site`)
- Desktop layout worked perfectly for both home and inner states
- Hamburger toggle functioned but content area was empty

## What Didn't Work

**Attempted Solution 1:** Single CSS rule `.site { display: none }` at `@media (max-width: 768px)`
- **Why it failed:** This hid the entire `.site` wrapper which contained both the left column AND the main content area. On the homepage this was fine (a separate `.mobile-home` div existed), but inner pages had no alternative content container — their content lived inside `.site`.

## Solution

Two changes were needed:

**Fix 1: Scope mobile hiding to homepage only using data-page attribute**

```css
/* Before (broken): */
@media (max-width: 768px) {
  .site {
    display: none;
  }
}

/* After (fixed): */
@media (max-width: 768px) {
  /* Only hide desktop layout on homepage */
  [data-page="home"] {
    display: none;
  }

  /* Inner pages: keep .site visible, hide left column, reset margin */
  [data-page="inner"] .left-column {
    display: none;
  }

  [data-page="inner"] .site-main {
    margin-left: 0;
    padding: 0 var(--space-md) var(--space-lg);
  }

  /* Hide TopNav on mobile (hamburger replaces it) */
  [data-page="inner"] :global(.top-nav) {
    display: none;
  }
}
```

**Fix 2: Reorder DOM so mobile elements precede .site**

```html
<!-- Before (broken order): -->
<div class="site" data-page="...">
  <!-- All content here -->
</div>
<header class="mobile-header">...</header>  <!-- Renders BELOW content -->

<!-- After (fixed order): -->
<div class="mobile-home">...</div>           <!-- Mobile home (hidden on desktop) -->
<header class="mobile-header">...</header>   <!-- Mobile header (hidden on desktop) -->
<nav class="mobile-nav">...</nav>            <!-- Mobile nav dropdown -->
<div class="site" data-page="...">           <!-- Desktop layout -->
  <!-- All content here -->
</div>
```

## Why This Works

1. **Root cause:** The blanket `display: none` on `.site` treated both page modes identically. The homepage had an alternative mobile layout (`.mobile-home`), but inner pages relied on the same `.site` wrapper for their content.

2. **Data-page scoping:** By using `[data-page="home"]` vs `[data-page="inner"]` selectors, CSS can apply different mobile strategies per page type — hide the desktop layout entirely on homepage (replaced by `.mobile-home`) while keeping it visible on inner pages (just hiding the left column and resetting margins).

3. **DOM order matters:** CSS `display: none`/`flex` on mobile-only elements doesn't change DOM order. The mobile header must precede the content in the HTML so that when it becomes visible on narrow viewports, it naturally appears at the top without needing CSS `order` or absolute positioning.

## Prevention

- When using `data-*` attributes to toggle layout modes, always write mobile CSS rules scoped to each mode individually rather than targeting the shared wrapper
- Before hiding any wrapper element at a breakpoint, verify all child content has an alternative rendering path on that viewport
- Place mobile-only markup (headers, nav drawers) before the main desktop layout in the DOM, not after — CSS visibility toggling doesn't change source order
- Test mobile view for EVERY page type (home vs inner) during layout refactors, not just the one you're currently viewing

## Related Issues

- See also: [scoped-style-specificity-global-override-System-20260217.md](./scoped-style-specificity-global-override-System-20260217.md) — related Astro scoped style issue
- See also: [event-listener-accumulation-persistent-sidebar-System-20260217.md](./event-listener-accumulation-persistent-sidebar-System-20260217.md) — mobile toggle handler pattern reused here
