---
title: footer-removal-sidebar-consolidation
category: ui-bugs
component: Footer, LeftColumn, BaseLayout, MobileHeader
symptoms: Remove footer component from main content area and relocate footer links (Email, LinkedIn, GitHub) and copyright to left sidebar bottom, with links also added to mobile header dropdown
tags:
  - astro
  - layout
  - sidebar
  - flexbox
  - mobile-responsive
  - component-restructuring
date: 2026-02-26
---

# Footer Removal & Sidebar Consolidation

## Problem

The site had a separate `Footer.astro` component rendered at the bottom of the main content area in `BaseLayout.astro`. The footer contained Email, LinkedIn, GitHub links and a copyright line. It was already conditionally hidden on the homepage via `body[data-page="home"]` CSS, but still occupied vertical space on inner pages. The user wanted to consolidate all contact links into the left sidebar instead and remove the footer entirely.

## Solution

Consolidated the footer into the left sidebar instead of rendering it as a separate component. This cleaned up vertical space in the main content area and unified identity, navigation, and contact information into a single left-column hierarchy.

### 1. LeftColumn.astro — Added footer links and copyright

Wrapped the existing identity + navigation in a new `.sidebar-content` div and added a `.sidebar-footer` div below it:

```astro
<div class="sidebar-content">
  <div class="sidebar-identity">...</div>
  <nav class="sidebar-nav">...</nav>
</div>

<div class="sidebar-footer">
  <div class="sidebar-footer-links">
    <a href="mailto:jlitzsin@purdue.edu">Email</a>
    <a href="https://www.linkedin.com/in/johnlitzsinger" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    <a href="https://github.com/johnlitz" target="_blank" rel="noopener noreferrer">GitHub</a>
  </div>
  <p class="sidebar-copyright">&copy; {currentYear} John Litzsinger</p>
</div>
```

**Key CSS pattern:**

```css
.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: var(--space-sm);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}
```

`.sidebar-content` takes `flex: 1` and centers identity + nav vertically. `.sidebar-footer` uses `margin-top: auto` to pin itself to the bottom. Both are hidden on mobile via `@media (max-width: 768px)`.

### 2. BaseLayout.astro — Removed Footer component

- Removed `import Footer from '../components/Footer.astro'`
- Removed `<Footer />` from the `.site-main` div
- Removed `justify-content: center` from `.left-column-inner` (no longer needed since `.sidebar-content` handles centering internally)

### 3. MobileHeader.astro — Added footer links to mobile nav

Since the sidebar is hidden on mobile, added footer links to the collapsible pyramid nav dropdown:

```astro
<div class="mobile-footer-links">
  <a href="mailto:jlitzsin@purdue.edu" class="mobile-footer-link">Email</a>
  <a href="https://www.linkedin.com/in/johnlitzsinger" class="mobile-footer-link"
     target="_blank" rel="noopener noreferrer">LinkedIn</a>
  <a href="https://github.com/johnlitz" class="mobile-footer-link"
     target="_blank" rel="noopener noreferrer">GitHub</a>
</div>
```

Styled with a `border-top` separator, centered layout, and muted color scheme matching the sidebar footer.

## Key Pattern: Flex Column with Pinned Footer

The sidebar uses a three-layer flex pattern:

1. `.left-column-inner` — `display: flex; flex-direction: column; height: 100%`
2. `.sidebar-content` — `flex: 1; justify-content: center` — centers identity + nav
3. `.sidebar-footer` — `margin-top: auto` — sticks to bottom

This keeps the main content vertically centered while anchoring contact/copyright at the bottom.

## Prevention & Best Practices

- **Check all responsive code paths when consolidating components** — Moving footer links into the sidebar required updates to both LeftColumn.astro (desktop) and MobileHeader.astro (mobile). Always audit all breakpoints before removing a component.

- **Use `margin-top: auto` with flex containers for bottom-pinned content** — Wrap the main content in a flex child with `justify-content: center`, then apply `margin-top: auto` to the footer element. Avoids absolute positioning and scales across viewport sizes.

- **Extract shared footer link data to a separate file** — Footer links currently exist in both LeftColumn.astro and MobileHeader.astro. Consider creating a shared data file (e.g., `src/data/footerLinks.ts`) to maintain a single source of truth.

- **Clean up all references when removing a component** — After removing Footer from BaseLayout, also remove its import and audit for orphaned CSS that referenced it.

## Related Documentation

- `docs/solutions/ui-bugs/site-restructure-rams-jobs-principles.md` — Previous Contact-into-Footer consolidation
- `docs/plans/2026-02-18-feat-persistent-sidebar-nav-redesign-plan.md` — Sidebar `margin-top: auto` pattern, flex centering
- `docs/plans/2026-02-20-feat-mobile-holistic-redesign-plan.md` — MobileHeader component, collapsible pyramid nav
- `docs/solutions/ui-bugs/event-listener-accumulation-persistent-sidebar-System-20260217.md` — Persistent sidebar event handling
- `docs/solutions/ui-bugs/scoped-style-specificity-global-override-System-20260217.md` — `:global()` wrapper pattern for `body[data-page]` selectors
