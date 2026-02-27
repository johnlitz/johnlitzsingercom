---
title: "feat: Stack spine letters vertically and remove duplicate contact links"
type: feat
date: 2026-02-17
---

# Stack Spine Letters Vertically and Remove Duplicate Contact Links

Two small tweaks to finalize the site.

## Task 1: Stack spine letters vertically

**File:** `src/components/LeftColumn.astro`

Currently the spine uses `writing-mode: vertical-rl` + `transform: rotate(180deg)` which renders "John Litzsinger" sideways (characters rotated 90 degrees, reading bottom-to-top). The goal is upright stacked letters — each letter in its normal orientation, reading top-to-bottom, with "J" at the top.

**Approach:** Replace `transform: rotate(180deg)` with `text-orientation: upright`. This keeps `writing-mode: vertical-rl` for the vertical flow but renders each character upright instead of rotated.

```css
/* Before (LeftColumn.astro:52-65) */
.name-strip {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: var(--text-xl);
  letter-spacing: 0.08em;
  /* ... */
}

/* After */
.name-strip {
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-size: var(--text-xl);
  letter-spacing: 0.08em;
  /* ... */
}
```

**Sizing considerations:** "John Litzsinger" is 16 characters (including space). With upright stacking at `var(--text-xl)` (1.5rem / 24px) and ~1.2 line-height, the total height is approximately 16 x 24 x 1.2 = ~460px. This fits within a 100vh strip on most screens. If the user wants even larger letters, we may need to widen the 72px strip or accept truncation on shorter viewports.

**Note:** The space between "John" and "Litzsinger" will render as a natural gap in the vertical stack — a nice visual separator between first and last name.

## Task 2: Remove duplicate contact links

**File:** `src/pages/contact.astro`

Remove the `.links` section (lines 40-44) and its associated styles (lines 119-138). The footer already displays email, LinkedIn, and GitHub links.

**HTML to remove (line 40-44):**
```html
<div class="links">
  <a href="mailto:jlitzsin@purdue.edu">jlitzsin@purdue.edu</a>
  <a href="https://www.linkedin.com/in/johnlitzsinger" target="_blank" rel="noopener noreferrer">LinkedIn</a>
  <a href="https://github.com/johnlitz" target="_blank" rel="noopener noreferrer">GitHub</a>
</div>
```

**CSS to remove (lines 119-138):**
```css
.links { ... }
.links :global(a) { ... }
.links :global(a:hover) { ... }
```

Also remove `.links :global(a)` from the `prefers-reduced-motion` rule (line 144).

## Acceptance Criteria

- [x] Spine letters are stacked vertically with each letter upright (not rotated)
- [x] "J" is at the top, letters flow downward to "r" at the bottom
- [x] Hover underline still works on the stacked name
- [x] Contact page only shows the form — no email/LinkedIn/GitHub links below it
- [x] Footer still shows all three contact links (unchanged)
- [x] Build passes, push to Vercel

## References

- Spine component: `src/components/LeftColumn.astro:52-73`
- Contact page: `src/pages/contact.astro:40-44` (HTML), `:119-138` (CSS)
- Footer: `src/components/Footer.astro` (unchanged)
