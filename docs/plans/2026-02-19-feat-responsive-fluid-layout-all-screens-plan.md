---
title: "feat: Responsive Fluid Layout for All Screen Sizes"
type: feat
date: 2026-02-19
---

# Responsive Fluid Layout for All Screen Sizes

## Overview

Make the website adapt to all screen sizes — from 320px phones to 4K ultra-wide monitors — without changing the visual design. Replace static pixel/rem tokens with fluid `clamp()` values, add intermediate breakpoints, and constrain the layout on ultra-wide screens.

## Problem Statement

The site currently uses a **single breakpoint** at 768px (mobile vs desktop) with **fixed pixel widths** for the sidebar (340px) and content (720px). This causes:

- **Tablets (768-1024px):** Sidebar consumes 33% of viewport, cramping content
- **Small laptops (1024-1280px):** Content area squeezed, sidebar proportionally too large
- **Ultra-wide (1920px+):** Content floats in a sea of empty space, no width constraint
- **Typography and spacing are static** — they don't scale between mobile and desktop

## Proposed Solution

Replace static tokens with fluid `clamp()` values. Keep the same visual design — just make it scale.

## Technical Approach

### Phase 1: Fluid Design Tokens (global.css)

Replace static type scale and spacing with fluid `clamp()` values that scale between 400px and 1440px viewport width:

**Typography:**
```css
--text-sm:   clamp(0.75rem,  0.71rem + 0.19vw, 0.875rem);
--text-base: clamp(0.875rem, 0.83rem + 0.24vw, 1rem);
--text-lg:   clamp(1.05rem,  0.96rem + 0.38vw, 1.25rem);
--text-xl:   clamp(1.25rem,  1.10rem + 0.58vw, 1.563rem);
--text-2xl:  clamp(1.5rem,   1.22rem + 1.15vw, 2.125rem);
--text-hero: clamp(2.25rem,  1.63rem + 2.69vw, 3.75rem);
```

**Spacing:**
```css
--space-xs:  clamp(0.25rem,  0.23rem + 0.10vw, 0.375rem);
--space-sm:  clamp(0.5rem,   0.44rem + 0.24vw, 0.75rem);
--space-3:   clamp(0.75rem,  0.67rem + 0.38vw, 1rem);
--space-md:  clamp(1rem,     0.88rem + 0.48vw, 1.25rem);
--space-6:   clamp(1.25rem,  1.06rem + 0.77vw, 1.75rem);
--space-lg:  clamp(1.5rem,   1.21rem + 1.15vw, 2.25rem);
--space-xl:  clamp(2.5rem,   1.92rem + 2.31vw, 4rem);
--space-2xl: clamp(3.5rem,   2.56rem + 3.85vw, 6rem);
```

**Layout:**
```css
--sidebar-width: clamp(260px, 22vw, 380px);
--content-max:   clamp(600px, 55vw, 820px);
--gutter:        clamp(1rem, 0.5rem + 2vw, 3rem);
```

### Phase 2: Layout Restructure (BaseLayout.astro)

Switch sidebar from `position: fixed` + `margin-left` to CSS Grid + `position: sticky`:

```css
.site {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  min-height: 100dvh;
}

.left-column {
  position: sticky;
  top: 0;
  height: 100dvh;
  align-self: start;
}

.site-main {
  /* No margin-left needed — grid handles it */
}
```

Add ultra-wide constraint:
```css
@media (min-width: 120em) {
  .site {
    max-width: 1920px;
    margin-inline: auto;
  }
}
```

### Phase 3: Verify All Pages

Test at 5 viewport sizes without changing any page-specific styles:
- 375px (mobile phone)
- 768px (tablet)
- 1366x660 (13" laptop — the user's screen)
- 1920px (desktop)
- 2560px (ultra-wide)

## Files to Modify

1. `src/styles/global.css` — Replace static tokens with fluid clamp() values
2. `src/layouts/BaseLayout.astro` — CSS Grid layout, sticky sidebar, ultra-wide constraint

## Acceptance Criteria

- [ ] Site looks identical at 1366x660 (user's current screen)
- [ ] Sidebar scales proportionally on tablets (768-1024px)
- [ ] Content and typography scale smoothly from mobile to desktop
- [ ] Ultra-wide screens (1920px+) have constrained layout width
- [ ] Mobile tab bar still works correctly at <768px
- [ ] No horizontal scrolling at any viewport width
- [ ] Footer visible on Contact page at all desktop sizes

## Post-Implementation: Mobile Design Critique

After responsive implementation, conduct a Steve Jobs / Rick Rubin style critique of the mobile experience at 375px width — observe, identify what doesn't feel right, and provide suggestions without implementing changes.
