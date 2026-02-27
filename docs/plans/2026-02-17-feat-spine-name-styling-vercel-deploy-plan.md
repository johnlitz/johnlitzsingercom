---
title: "feat: Enlarge spine name, add hover underline, deploy to Vercel"
type: feat
date: 2026-02-17
---

# Enlarge Spine Name, Add Hover Underline, Deploy to Vercel

## Overview

Three changes: (1) increase the vertical spine name text from 1rem to ~2rem with subtle letter-spacing, (2) add a hero-nav-style red underline on hover, and (3) push the site to Vercel once complete.

## Problem Statement / Motivation

The spine name on inner pages ("John Litzsinger" rendered vertically along the left strip) is currently small (1rem/16px) and has a plain color-only hover effect. It should be a more prominent design element with larger, spaced-out lettering and a hover underline consistent with the homepage section titles.

## Proposed Solution

### Task 1: Enlarge spine name with letter-spacing

**File:** `src/components/LeftColumn.astro:52-60`

Change `.name-strip` styles:

```css
/* Before */
.name-strip {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: var(--text-base);       /* 1rem */
  letter-spacing: 0.02em;
  color: var(--muted);
  text-decoration: none;
  white-space: nowrap;
  transition: color var(--duration-fast) ease;
}

/* After */
.name-strip {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: var(--text-xl);          /* 1.5rem (24px) — 2rem would be tight in 72px strip */
  letter-spacing: 0.08em;            /* Subtle spacing per user preference */
  color: var(--muted);
  text-decoration: none;
  white-space: nowrap;
  transition: color var(--duration-fast) ease,
              text-decoration-color var(--duration-base) ease;
}
```

**Note on sizing:** The strip is 72px wide. With `writing-mode: vertical-rl`, the font-size controls the cross-axis (horizontal width of each glyph). At 2rem (32px), each character glyph would consume ~32px of the 72px strip, leaving only ~20px of padding per side — visually tight. Two options:

- **Option A:** Use `var(--text-xl)` (1.5rem / 24px) — fits comfortably in the existing 72px strip, still a 50% increase from current
- **Option B:** Use `2rem` (32px) and widen the strip from 72px to ~96px — requires updating `--strip-width` in `global.css` and the `margin-left` transition in `BaseLayout.astro`

The plan defaults to **Option A** (1.5rem) for simplicity. If the result feels too small after implementation, widening to Option B is a quick follow-up.

### Task 2: Add hero-nav-style hover underline

**File:** `src/components/LeftColumn.astro:63-66`

Update `.name-strip:hover` to match the homepage hero link underline pattern from `src/pages/index.astro`:

```css
/* Before */
.name-strip:hover {
  color: var(--foreground);
  text-decoration: none;
}

/* After */
.name-strip:hover {
  color: var(--foreground);
  text-decoration: underline;
  text-decoration-color: var(--accent);
  text-underline-offset: 8px;
  text-decoration-thickness: 3px;
}
```

**Vertical writing-mode consideration:** With `writing-mode: vertical-rl` + `rotate(180deg)`, `text-decoration: underline` renders as a vertical line along the text. The `text-underline-offset` pushes it away from the glyphs. This should produce a red accent line running parallel to the name — visually analogous to the horizontal underline on hero nav links.

Also add `text-decoration-color` transition to the base `.name-strip` rule (already included in Task 1 above) so the underline fades in smoothly rather than popping:

```css
transition: color var(--duration-fast) ease,
            text-decoration-color var(--duration-base) ease;
```

And set a transparent starting state to enable the fade:

```css
.name-strip {
  /* ... existing ... */
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 8px;
  text-decoration-thickness: 3px;
}
```

**Reduced motion:** The existing `@media (prefers-reduced-motion: reduce)` block already sets `transition: none` on `.name-strip`, which will cover the new transition property.

### Task 3: Deploy to Vercel

After Tasks 1-2 are implemented and verified locally:

1. Commit changes on the current branch
2. Push to the remote repository
3. Vercel auto-deploys from the connected GitHub repo (static build via `npm run build`)

No configuration changes needed — Vercel adapter and `astro.config.mjs` are already set up.

## Acceptance Criteria

- [x] Spine name on inner pages is visually larger (~1.5rem) with subtle letter-spacing (0.08em)
- [x] Hovering the spine name shows a thick red underline (3px, accent color, 8px offset) matching hero nav links
- [x] Underline fades in smoothly (200ms transition) rather than appearing instantly
- [x] Hover still transitions color from muted to foreground
- [x] `prefers-reduced-motion: reduce` disables all transitions (already covered)
- [x] Mobile layout unaffected (spine is hidden below 768px)
- [x] Site deployed to Vercel at johnlitzsinger.com

## Dependencies & Risks

- **Low risk:** Changes are CSS-only in a single component file, no structural HTML changes
- **Vertical underline rendering:** `text-decoration` in vertical writing modes can behave inconsistently across browsers. If the underline doesn't render correctly, fallback to a `border-left` or `border-right` approach instead
- **Strip width:** If 1.5rem feels too small, widening the strip to accommodate 2rem is a straightforward follow-up (update `--strip-width` in `global.css`)

## References

- Spine component: `src/components/LeftColumn.astro`
- Hero nav underline pattern: `src/pages/index.astro` (`.hero-link:hover .hero-link-title`)
- Design tokens: `src/styles/global.css`
- Layout shell: `src/layouts/BaseLayout.astro`
