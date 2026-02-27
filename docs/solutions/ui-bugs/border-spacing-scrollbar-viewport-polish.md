---
title: "UI/CSS Layout and Styling Fixes: Borders, Spacing, Scrollbar"
category: ui-bugs
tags: [layout, spacing, borders, scrollbar, viewport-fit, astro, css-custom-properties]
module: "global styles, homepage, sidebar nav, blog post, contact page"
symptom: "Double border above footer on homepage; sidebar nav items too cramped with excessive empty space; no breathing room below Resume link; default browser scrollbar clashing with editorial aesthetic; Contact page form pushes footer off viewport; unnecessary border separator above 'Back to writing' link; orphaned line above 'Work' section on homepage"
root_cause: "Conflicting border rules (.highlight:last-child border-bottom + footer border-top); insufficient padding and font-size on nav items; missing margin-bottom on last nav item; missing custom scrollbar styling; excessive form margin-bottom; redundant .post-footer border-top; missing border suppression on .highlight:first-child"
date_solved: 2026-02-19
severity: low
---

# UI/CSS Layout and Styling Fixes: Borders, Spacing, Scrollbar

Seven UI polish fixes across five files to clean up borders, improve sidebar nav spacing, add a custom scrollbar, and ensure content fits the target viewport (1366x660 — 13" laptop with browser chrome).

## Fixes

### 1. Homepage Double Border

**File:** `src/pages/index.astro`

**Problem:** `.highlight:last-child` had `border-bottom` which doubled up with the footer's `border-top`, creating a visual double-line.

**Solution:**
```css
.highlight:last-child {
  border-bottom: none;
}
```

### 2. Orphaned Top Border on Homepage

**File:** `src/pages/index.astro`

**Problem:** The first `.highlight` item ("Work") inherited a `border-top` from the general rule, creating a line above the first section with nothing above it.

**Solution:**
```css
.highlight:first-child {
  border-top: none;
}
```

### 3. Sidebar Navigation Spacing

**File:** `src/components/LeftColumn.astro`

**Problem:** Nav items had `padding: var(--space-sm) 0` (8px) and `font-size: var(--text-lg)` (20px), leaving too much empty space below the nav on inner pages.

**Solution:**
```css
.nav-item {
  padding: var(--space-3) 0;  /* 12px, up from 8px */
}

.sidebar-link {
  font-size: var(--text-xl);  /* 24px, up from 20px */
}
```

### 4. Breathing Room Below Resume

**File:** `src/components/LeftColumn.astro`

**Problem:** The last nav item had no visual separation from the sidebar bottom.

**Solution:**
```css
.nav-item:last-child {
  margin-bottom: var(--space-sm);  /* 8px intentional negative space */
}
```

### 5. Custom Scrollbar

**File:** `src/styles/global.css`

**Problem:** Default browser scrollbar clashed with the editorial/minimal aesthetic (Lack font, red accent, achromatic palette).

**Solution:**
```css
/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

/* Webkit (Chrome, Safari, Edge) */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 0; }
::-webkit-scrollbar-thumb:hover { background: var(--muted); }
::-webkit-scrollbar-corner { background: transparent; }
```

Design choices: 6px thin, no border-radius (sharp/editorial to match the site's line-based aesthetic), transparent track, subtle thumb that brightens on hover.

### 6. Contact Page Scroll Fix

**File:** `src/pages/contact.astro`

**Problem:** `form { margin-bottom: var(--space-xl) }` (64px) pushed footer below viewport on 13" laptops.

**Solution:**
```css
form {
  margin-bottom: var(--space-md);  /* 16px, down from 64px */
}
```

### 7. Blog Post Separator Line

**File:** `src/layouts/BlogPostLayout.astro`

**Problem:** `.post-footer` had `border-top: 1px solid var(--border)` creating an unnecessary separator before "Back to writing".

**Solution:** Removed the `border-top` property from `.post-footer`.

## Prevention Strategies

### Border Management

- Establish a single source of truth for borders between sections. Assign border responsibility to one element only.
- For lists, use `:first-child { border-top: none }` and `:last-child { border-bottom: none }` patterns to avoid orphaned borders.
- Before committing, search for `border-bottom` and `border-top` in the same file — if found on different selectors, verify they don't stack.

### Viewport-Fit Testing

- Target viewport: 1366x660 (13" laptop with browser chrome eating ~100px).
- For any spacing change, manually verify at this viewport that footer is visible without scrolling on short-content pages (Contact, Projects).
- Measure cumulative vertical spacing before committing: padding + margins + content should not exceed viewport height.

### Custom Scrollbar Notes

- Always style both webkit (`::-webkit-scrollbar`) and Firefox (`scrollbar-width`, `scrollbar-color`) — they use different APIs.
- Safari has limited scrollbar customization — degrades gracefully to system scrollbar.
- Use design tokens (`var(--border)`, `var(--muted)`) so scrollbar respects light/dark mode automatically.

## Related Documentation

- `docs/solutions/ui-bugs/design-system-drift-System-20260215.md` — Design token compliance, spacing grid violations
- `docs/solutions/ui-bugs/scoped-style-specificity-global-override-System-20260217.md` — Astro `:global()` vs `!important` patterns
- `docs/solutions/ui-bugs/site-restructure-rams-jobs-principles.md` — Reductive design principles, prior Astro specificity fix
- `docs/plans/2026-02-18-feat-persistent-sidebar-nav-redesign-plan.md` — Sidebar nav architecture, scrollbar design, view transitions
