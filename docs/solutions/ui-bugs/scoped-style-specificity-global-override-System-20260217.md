---
module: System
date: 2026-02-17
problem_type: ui_bug
component: frontend_stimulus
symptoms:
  - "Contact links render as accent-colored underlined text instead of muted no-underline style"
  - "Scoped component styles silently overridden by global a {} rule in global.css"
root_cause: scope_issue
resolution_type: code_fix
severity: medium
tags: [astro, scoped-styles, specificity, css, global-styles, where-selector, global-directive]
---

# Troubleshooting: Astro Scoped Style Specificity — Global Styles Override Component Styles

## Problem

Scoped `<style>` in Astro components are silently overridden by global CSS rules. In `Contact.astro`, links appeared as accent-colored with underlines (from `global.css`'s `a { color: var(--accent); }`) instead of the component's intended muted, no-underline style.

## Environment

- Module: System (Contact component)
- Framework: Astro 5 with scoped `<style>` tags
- Affected Component: `src/components/Contact.astro`
- Date: 2026-02-17

## Symptoms

- Contact section links display as bright blue with underline (global style)
- Component's scoped `.links a { color: var(--secondary); text-decoration: none; }` has no effect
- No warning or error — styles silently lose the specificity battle
- DevTools shows global `a {}` rule winning over scoped rule

## What Didn't Work

**Previous approach (from 2026-02-15):** Used `!important` on styles to force override. This works but creates maintenance problems — any future style change also needs `!important`.

## Solution

Use Astro's `:global()` directive to wrap link styles inside a scoped parent selector. This escapes the `:where()` wrapper for the inner selector while keeping the outer selector scoped.

**Code changes:**

```css
/* Before (broken — zero specificity due to :where() wrapper): */
.links a {
  color: var(--secondary);
  text-decoration: none;
}

/* After (fixed — :global() escapes :where() for the a selector): */
.links :global(a) {
  color: var(--secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--duration-fast) ease;
}

.links :global(a:hover) {
  color: var(--foreground);
  text-decoration: none;
}
```

## Why This Works

1. **Root cause**: Astro wraps all scoped style selectors with `:where([data-astro-cid-xxx])`, which has **zero specificity**. A global `a { color: var(--accent); }` rule has specificity `(0,0,1)` — higher than `(0,0,0)` from `:where()`. So global type selectors always win over scoped selectors.

2. **`:global()` escapes the `:where()` wrapper.** When you write `.links :global(a)`, Astro compiles it to `.links[data-astro-cid-xxx] a` — the `.links` part gets the scoped attribute (still inside `:where()`), but `a` does NOT get wrapped. The effective specificity becomes `(0,1,1)` (class + element), which beats the global `(0,0,1)`.

3. **Why not `!important`?** It works but is a blunt instrument:
   - Future hover/focus states also need `!important`
   - Creates specificity arms race
   - Harder to debug and maintain
   - `:global()` is the Astro-idiomatic solution

4. **Why not narrow the global `a` rule?** That would be the ideal long-term fix (e.g., `.prose a` instead of bare `a`), but it's a larger refactor affecting all pages.

## Prevention

- **Before styling links in any Astro component**, check `global.css` for bare `a {}` rules. If they exist, use `:global()` for link styles in scoped components.
- **Pattern to follow:**
  ```css
  .container :global(a) { /* your styles */ }
  .container :global(a:hover) { /* hover styles */ }
  ```
- **Never use bare element selectors** in `global.css` (`a {}`, `button {}`, `input {}`). Prefer class-scoped selectors (`.prose a {}`) to avoid collisions with component styles.
- **Long-term fix:** Refactor `global.css` to scope the `a { color: var(--accent); text-decoration: underline; }` rule under `.prose` or `main :where(a)` so it doesn't collide with component-level link styling.

## Related Issues

- See also: [site-restructure-rams-jobs-principles.md](./site-restructure-rams-jobs-principles.md) — Section "Astro Scoped Style Specificity Gotcha" documents the same root cause, solved with `!important`. The `:global()` approach documented here is the preferred fix.
