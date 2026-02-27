---
title: "feat: Add Visual Life — Typography, Texture, and Geometric Accents"
type: feat
date: 2026-02-15
---

# Add Visual Life — Typography, Texture, and Geometric Accents

## Overview

The site's structural foundation (tokens, spacing, surface alternation, hover states) is solid. But it reads as a well-structured wireframe with tokens applied — **correct without being alive**. Jobs and Rams both designed with simplicity, but their work had *presence*: the Braun T3's clear acrylic lid, the iPod's click wheel. This plan adds that layer of presence through three channels: **distinctive typography**, **subtle texture**, and **geometric structural accents**.

**Audience:** Recruiters and peers scanning fast. The goal is to be memorable within 3 seconds.

**Design philosophy:** Rams' "less, but better" — every addition must earn its place. No decoration, only decisions.

## Problem Statement

1. **Inter everywhere** — Zero typographic identity. Every heading, every label, every hero uses the same font. Recruiter sees 50 student sites, remembers none.
2. **No visual texture** — The entire site is flat CSS surfaces. No materiality, no atmosphere. Feels like a screen, not a designed experience.
3. **Surface alternation invisible** — #fafaf9 vs #ffffff is nearly imperceptible. The structural rhythm exists in code but not in perception.
4. **No visual anchors** — No graphic element, no pattern, nothing to look at except text in a column.
5. **Contact section is a footnote** — The site's primary CTA ("reach out") is three small links below an uppercase label.

## Proposed Solution

### 1. Display Serif Font — Instrument Serif

Add **Instrument Serif** as a display font for the hero name and key headings. Keep Inter for body text and UI.

**Why Instrument Serif:**
- Modern editorial feel — "design studio meets finance magazine"
- High stroke contrast creates strong visual counterpoint to Inter
- Released 2023, still under-used compared to established serifs
- Excellent pairing with Inter (documented across real-world sites)
- Single weight (400) — constraint forces discipline (display use only)

**Where to use it:**
- Hero `h1` (the name "John Litzsinger")
- Section headings (optional: "Work", "Writing" could remain uppercase Inter)
- Blog post titles (h1 in BlogPostLayout)

**Installation:**
```bash
npm install @fontsource/instrument-serif
```

**Import in `src/components/BaseHead.astro`:**
```astro
import '@fontsource/instrument-serif';
```

**New token in `global.css`:**
```css
--font-display: 'Instrument Serif', Georgia, 'Times New Roman', serif;
```

### 2. Subtle Noise Grain Overlay

Add a very light noise grain to surface sections using inline SVG `feTurbulence`. This adds materiality — the difference between a screen and good paper.

**Technique:** SVG data URI background with `feTurbulence` (industry standard, zero network requests, resolution-independent).

**Implementation — global `::after` on surface sections:**
```css
.hero::after,
.writing::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 182px;
  opacity: 0.04;
  pointer-events: none;
  z-index: 1;
}
```

**Parameters:**
- `baseFrequency: 0.65` — Fine grain, not chunky
- `numOctaves: 3` — Enough detail without CPU cost
- `opacity: 0.04` — Barely visible on stone palette. Should feel like texture, not filter.
- Only on `--surface` background sections (hero, writing) — not on `--background` sections

**Dark mode:** Same filter, but reduce opacity to `0.03` (grain is more visible on dark backgrounds).

**Sections need `position: relative; overflow: hidden;`** to contain the pseudo-element.

### 3. Dot Grid Pattern on Hero

Add a subtle dot grid as a background texture element in the hero section. This is the "Braun speaker grille" idea — a geometric pattern that exists just below conscious perception.

**Implementation:**
```css
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle,
    rgba(12, 10, 9, 0.05) 0.75px,
    transparent 0.75px
  );
  background-size: 24px 24px;
  /* Fade at edges so it doesn't feel like wallpaper */
  mask-image: radial-gradient(
    ellipse 70% 70% at 50% 50%,
    black 30%,
    transparent 100%
  );
  -webkit-mask-image: radial-gradient(
    ellipse 70% 70% at 50% 50%,
    black 30%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 0;
}
```

**Dark mode version:**
```css
rgba(250, 250, 249, 0.05) /* invert dot color */
```

**Note:** The mask-image creates an elliptical fade so the dots concentrate in the center and dissolve toward edges. This prevents the "tiled wallpaper" look.

### 4. Stronger Surface Alternation

Adjust `--surface` to be more perceptibly different from `--background`.

**Current:** `--surface: #fafaf9` (stone-50) — barely distinguishable from `#ffffff`
**Proposed:** `--surface: #f7f5f2` — slightly warmer and darker, perceptibly different

**Dark mode current:** `--surface: #1c1917`
**Dark mode proposed:** `--surface: #1a1614` — slightly deeper for contrast

This makes the hero/writing bands visually distinct from work/footer without being dramatic.

### 5. Geometric Accent Lines

Add thin hairline accent elements as structural punctuation. Rams used rules to organize, not decorate.

**a) Hero accent bar:**
A thin 2px amber accent line at the bottom of the hero, running partial width (e.g., 64px). Creates a visual terminus and adds a warm color moment.

```css
.hero-inner::after {
  content: "";
  display: block;
  width: 64px;
  height: 2px;
  background: var(--accent-warm);
  margin-top: var(--space-xl);
  border-radius: 1px;
}
```

**b) Section divider enhancement:**
Replace the Experience section's `border-bottom` entry dividers with a more refined approach — thinner, with slight inset:

```css
.entry {
  border-bottom: 1px solid var(--border);
  /* Stays the same — already working */
}
```

The existing approach is fine. The hero accent bar is the key new geometric element.

### 6. Contact Section Enhancement

Make the contact section slightly more prominent without turning it into a dramatic CTA.

**Changes:**
- Add `background: var(--surface)` to create visual distinction from the content above
- Increase heading to `--text-xl` size (from `--text-sm`)
- Drop the uppercase/letter-spacing treatment — let it breathe
- Add more vertical padding (`--space-2xl` top, `--space-xl` bottom)
- Keep the same link style and layout

**Result:** Contact reads as a distinct, warm section rather than just the bottom of the page.

## Implementation Phases

### Phase 1: Foundation Tokens
- [ ] Install `@fontsource/instrument-serif` via npm
- [ ] Import in `src/components/BaseHead.astro`
- [ ] Add `--font-display` token to `global.css` (both light and dark)
- [ ] Adjust `--surface` value for stronger alternation (light and dark)
- [ ] Add noise grain CSS utility (could be in `global.css` or per-component)

### Phase 2: Hero Transformation
- [ ] Apply `--font-display` to hero `h1`
- [ ] Add dot grid `::before` pseudo-element with mask fade
- [ ] Add noise grain `::after` pseudo-element
- [ ] Add amber accent bar via `hero-inner::after`
- [ ] Ensure `position: relative; overflow: hidden` on `.hero`
- [ ] Ensure `.hero-inner` has `position: relative; z-index: 2` (above texture layers)
- [ ] Dark mode: adjust dot grid and grain for dark surfaces
- [ ] Mobile: verify textures don't cause performance issues on low-end devices

### Phase 3: Typography Integration
- [ ] Apply `--font-display` to blog post `h1` in `BlogPostLayout.astro`
- [ ] Optionally apply to blog page `h1` in `blog/index.astro`
- [ ] Verify font loading performance (check for FOUT/FOIT)
- [ ] Verify the serif renders well on Windows ClearType

### Phase 4: Texture & Surface
- [ ] Add grain overlay to `.writing` section (same approach as hero)
- [ ] Ensure `.writing` has `position: relative; overflow: hidden`
- [ ] Ensure `.writing-inner` has `position: relative; z-index: 2`
- [ ] Verify surface alternation is perceptible (take screenshots, compare)
- [ ] Dark mode: verify grain opacity and surface colors

### Phase 5: Contact Enhancement
- [ ] Add `background: var(--surface)` to footer section
- [ ] Increase heading size and remove uppercase treatment
- [ ] Adjust vertical padding for more breathing room
- [ ] Verify visual distinction from adjacent content

### Phase 6: Verification & Polish
- [ ] Full-page screenshot comparison (before/after)
- [ ] Blog page screenshot
- [ ] Blog post screenshot
- [ ] Dark mode verification (all pages)
- [ ] Mobile viewport verification
- [ ] Build passes
- [ ] Performance check (no layout shifts from font loading)
- [ ] Update `.interface-design/system.md` with new patterns

## Files to Modify

| File | Changes |
|------|---------|
| `package.json` | Add `@fontsource/instrument-serif` |
| `src/components/BaseHead.astro` | Import Instrument Serif |
| `src/styles/global.css` | Add `--font-display` token, adjust `--surface`, add grain utility |
| `src/components/Hero.astro` | Display serif on h1, dot grid `::before`, grain `::after`, accent bar |
| `src/components/Writing.astro` | Grain overlay, position: relative |
| `src/components/Footer.astro` | Background surface, larger heading, more padding |
| `src/layouts/BlogPostLayout.astro` | Display serif on h1 |
| `src/pages/blog/index.astro` | Display serif on h1 (optional) |
| `.interface-design/system.md` | Document new typography, texture patterns |

## Technical Considerations

### Font Loading
- `@fontsource/instrument-serif` uses `font-display: swap` by default
- The font is ~18KB (single weight, latin subset, woff2)
- Self-hosted via Astro build, no third-party requests
- Minimal FOUT since the serif is only used at display sizes where the layout shift is negligible

### Performance
- Noise grain SVG: rendered once by browser, cached. Negligible CPU cost on static site.
- Dot grid: pure CSS radial-gradient, hardware-accelerated
- Mask-image: supported in all modern browsers. No polyfill needed.
- `position: absolute` pseudo-elements don't affect layout flow

### Accessibility
- Instrument Serif has good legibility at display sizes (24px+)
- All texture elements use `pointer-events: none` — won't interfere with interaction
- No motion involved in textures — no `prefers-reduced-motion` guard needed
- Font contrast and readability unchanged (textures are behind content)

### Dark Mode
- Dot grid: invert rgba from `(12,10,9)` to `(250,250,249)`
- Grain: reduce opacity from 0.04 to 0.03
- Surface: adjust to `#1a1614` for stronger alternation
- Accent bar: amber already has dark mode value (`#f59e0b`)

## References

- [Instrument Serif on Google Fonts](https://fonts.google.com/specimen/Instrument+Serif)
- [@fontsource/instrument-serif](https://fontsource.org/fonts/instrument-serif)
- [CSS Grainy Gradients — CSS-Tricks](https://css-tricks.com/grainy-gradients/)
- [CSS Dot Grid Backgrounds — ibelick.com](https://ibelick.com/blog/create-grid-and-dot-backgrounds-with-css-tailwind-css)
- [Astro Font Loading](https://docs.astro.build/en/guides/fonts/)
- Brainstorm: `docs/brainstorms/2026-02-15-visual-refinement-brainstorm.md`
- Design system: `.interface-design/system.md`
