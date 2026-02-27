---
title: "Visual Refinement: Depth, Warmth, and Craft"
type: feat
date: 2026-02-15
brainstorm: docs/brainstorms/2026-02-15-visual-refinement-brainstorm.md
status: ready-for-work
---

# Visual Refinement: Depth, Warmth, and Craft

## Overview

Transform the site from "technically correct minimalism" to "crafted minimalism with life" by adding three layers of visual richness within the existing design system:

1. **Layered shadow system** — warm-toned, multi-level shadows for physical depth
2. **Surface differentiation** — alternating section backgrounds for visual rhythm
3. **Warm amber accent** — second accent color for temporal metadata (dates, tags)
4. **Refined hover states** — card-lift interactions replacing crude opacity fades
5. **Transition tokens** — centralized easing and duration values

All changes follow Dieter Rams: "as little design as possible" — we add physical believability, not decoration.

---

## Current State (Verified from Source)

| File | Key Issues |
|------|-----------|
| `src/styles/global.css:76` | Only `--shadow-sm` exists, no md/lg shadows |
| `src/styles/global.css` | No transition tokens — components hardcode `150ms ease-out` |
| `src/styles/global.css` | No warm accent tokens |
| `src/components/Hero.astro:9-10` | `max-width` + `margin: 0 auto` on section — no full-bleed bg |
| `src/components/Experience.astro:42-45` | Same constraint — no full-bleed bg |
| `src/components/Writing.astro:30-34` | Same constraint — no full-bleed bg |
| `src/components/Writing.astro:75,83-86` | Hover uses `opacity: 0.75` — feels like fade-out |
| `src/components/BlogPostCard.astro:59-61` | `time` uses `--color-text-muted` (legacy alias) |
| `src/components/BlogPostCard.astro:83-89` | Tags use `--color-accent` (blue on non-interactive) |
| `src/layouts/BlogPostLayout.astro:76,96-97` | Uses legacy `--color-text-muted`, `--color-accent` |
| `src/components/Footer.astro` | Already has inner wrapper pattern (`.footer-inner`) |

### Page Structure
```
Hero → Work (Experience) → Writing → Footer (with contact)
```

---

## Implementation Steps

### Step 1: Add New Tokens to global.css

**File:** `src/styles/global.css`

Add these tokens to the `:root` block (after line 28, before legacy aliases):

```css
/* Warm accent — amber for temporal metadata */
--accent-warm: #d97706;
--accent-warm-hover: #b45309;
--accent-warm-soft: rgba(217, 119, 6, 0.10);

/* Transition tokens */
--ease-out: cubic-bezier(0.33, 1, 0.68, 1);
--ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 350ms;
```

Update shadow token at line 76:

```css
/* Shadows — warm-toned, layered */
--shadow-sm: 0 1px 2px rgba(12, 10, 9, 0.06);
--shadow-md:
  0 1px 2px rgba(12, 10, 9, 0.04),
  0 2px 4px rgba(12, 10, 9, 0.04),
  0 4px 8px rgba(12, 10, 9, 0.04);
--shadow-lg:
  0 2px 4px rgba(12, 10, 9, 0.03),
  0 4px 8px rgba(12, 10, 9, 0.03),
  0 8px 16px rgba(12, 10, 9, 0.03),
  0 16px 32px rgba(12, 10, 9, 0.03);
```

Add to dark mode block (inside `@media (prefers-color-scheme: dark)` after line 99):

```css
--accent-warm: #f59e0b;
--accent-warm-hover: #fbbf24;
--accent-warm-soft: rgba(245, 158, 11, 0.10);

--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.20);
--shadow-md:
  0 1px 2px rgba(0, 0, 0, 0.15),
  0 2px 4px rgba(0, 0, 0, 0.15),
  0 4px 8px rgba(0, 0, 0, 0.12);
--shadow-lg:
  0 2px 4px rgba(0, 0, 0, 0.12),
  0 4px 8px rgba(0, 0, 0, 0.12),
  0 8px 16px rgba(0, 0, 0, 0.10),
  0 16px 32px rgba(0, 0, 9, 0.10);
```

Add legacy alias for warm accent:

```css
--color-accent-warm: var(--accent-warm);
```

**Verify:** `npm run build` succeeds — all subsequent steps depend on these tokens.

---

### Step 2: Restructure Sections for Full-Bleed Backgrounds

Each section currently has `max-width` + `margin: 0 auto` on the `<section>` element. This prevents full-viewport backgrounds. Restructure to: outer `<section>` for full-bleed background, inner `<div>` for content constraints.

**Important:** Footer.astro already uses this pattern (`.footer` → `.footer-inner`). Hero, Experience, Writing need it.

#### 2a. Hero.astro

**File:** `src/components/Hero.astro`

Wrap content in `<div class="hero-inner">`:

```html
<section id="hero" class="hero" aria-label="Introduction">
  <div class="hero-inner">
    <h1>John Litzsinger</h1>
    <p class="tagline">...</p>
    <a href="#contact" class="cta">Get in Touch</a>
  </div>
</section>
```

CSS changes:
- `.hero`: Remove `max-width`, `margin`. Add `background: var(--surface)`.
- `.hero-inner`: Gets `max-width: var(--max-width-wide)`, `margin: 0 auto`, inherits padding from `.hero`.
- Mobile media query: Move padding override to `.hero-inner`.

Surface: `--surface` (stone-50 light / stone-900 dark).

#### 2b. Experience.astro

**File:** `src/components/Experience.astro`

Same restructuring. Wrap `<h2>` and `.list` in `<div class="experience-inner">`.

```html
<section id="experience" class="experience" aria-label="Work experience">
  <div class="experience-inner">
    <h2 class="section-label">Work</h2>
    <div class="list">...</div>
  </div>
</section>
```

CSS: `.experience` loses `max-width`, `margin`. Gets `background: var(--background)`.
`.experience-inner` gets `max-width: var(--max-width-wide)`, `margin: 0 auto`, padding.

Surface: `--background` (white light / stone-950 dark) — contrasts with hero's `--surface`.

**Note:** Experience currently has `border-top: 1px solid var(--border)`. The surface alternation replaces this as the visual separator. Remove the `border-top` since the background shift handles rhythm.

#### 2c. Writing.astro

**File:** `src/components/Writing.astro`

Same restructuring. Wrap `.section-header` and `.list` in `<div class="writing-inner">`.

```html
<section id="writing" class="writing" aria-label="Recent writing">
  <div class="writing-inner">
    <div class="section-header">...</div>
    <div class="list">...</div>
  </div>
</section>
```

CSS: `.writing` loses `max-width`, `margin`. Gets `background: var(--surface)`.
`.writing-inner` gets `max-width: var(--max-width-wide)`, `margin: 0 auto`, padding.

Surface: `--surface` — creating A-B-A rhythm (surface, background, surface).

#### Surface Alternation Summary

| Section | Background | Effect |
|---------|-----------|--------|
| Header | Frosted glass (unchanged) | Unchanged |
| Hero | `--surface` (stone-50 / stone-900) | Warm tonal zone |
| Experience | `--background` (white / stone-950) | Contrast shift |
| Writing | `--surface` (stone-50 / stone-900) | Returns to warm tone |
| Footer | `--background` (white / stone-950) | Clean base |

**Verify:** Visual check at 375px, 768px, 1440px, 2560px. Backgrounds extend full viewport width.

---

### Step 3: Refine Hover States

#### 3a. Writing.astro — Replace Opacity Hover with Card-Lift

**File:** `src/components/Writing.astro`

This is the biggest interaction change. Replace `opacity: 0.75` with implicit-card-on-hover.

Current (line 69-86):
```css
.entry {
  display: block;
  text-decoration: none;
  color: inherit;
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border);
  transition: opacity 150ms ease-out;
}
.entry:hover {
  text-decoration: none;
  opacity: 0.75;
}
```

New:
```css
.entry {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: var(--space-sm) var(--space-md);
  margin: 0 calc(-1 * var(--space-md));
  border-radius: var(--radius-lg);
  transition:
    background-color var(--duration-base) var(--ease-out),
    box-shadow var(--duration-base) var(--ease-out),
    transform var(--duration-base) var(--ease-out);
}

.entry:hover {
  text-decoration: none;
  background: var(--surface-2);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.entry:active {
  transform: translateY(0);
}

.entry:focus-visible {
  background: var(--surface-2);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```

Remove border-bottom separators between entries — the implicit card hover makes them feel heavy. Use gap spacing only via `.list { gap: var(--space-sm); }` (tighter than current `--space-lg` since entries now have their own padding).

**Note:** Negative margin + padding trick keeps text alignment but creates larger hover target. Test at 375px for alignment.

#### 3b. BlogPostCard.astro — Add Card-Lift

**File:** `src/components/BlogPostCard.astro`

Upgrade hover from `--shadow-sm` to `--shadow-md` + translateY:

```css
.post-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  transition:
    border-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-base) var(--ease-out),
    transform var(--duration-base) var(--ease-out);
}

.post-card:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.post-card:active {
  transform: translateY(0);
}

.post-card:focus-within {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

#### 3c. Hero.astro — CTA Button Shadow Lift

**File:** `src/components/Hero.astro`

Add shadow and lift to CTA hover:

```css
.cta {
  /* existing styles... */
  transition:
    background-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-base) var(--ease-out),
    transform var(--duration-base) var(--ease-out);
}

.cta:hover {
  background: var(--accent-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
  color: #fff !important;
  text-decoration: none !important;
}

.cta:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}
```

#### 3d. Footer.astro — Contact Link Hover

**File:** `src/components/Footer.astro`

Add subtle translateY to contact links:

```css
.contact-links a {
  /* existing styles... */
  transition:
    color var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-out);
}

.contact-links a:hover {
  color: var(--accent);
  transform: translateY(-1px);
}

.contact-links a:active {
  transform: translateY(0);
}
```

#### 3e. Reduced Motion — All Components

Every component with new `transform` transitions must include:

```css
@media (prefers-reduced-motion: reduce) {
  .entry, .post-card, .cta, .contact-links a {
    transition: none;
    transform: none !important;
  }
}
```

Add per-component in their respective `<style>` blocks. Update existing reduced-motion rules in Writing.astro, BlogPostCard.astro, Hero.astro.

---

### Step 4: Apply Warm Accent Color

The warm accent (`--accent-warm`) is for **temporal metadata** — dates and tags. Blue accent stays for **actions/navigation**. Two colors, two clear roles.

#### 4a. Writing.astro — Dates

**File:** `src/components/Writing.astro:88-93`

```css
/* Before */
time { color: var(--muted); }

/* After */
time { color: var(--accent-warm); }
```

#### 4b. Experience.astro — Period Dates

**File:** `src/components/Experience.astro:96-103`

```css
/* Before */
.period { color: var(--muted); }

/* After */
.period { color: var(--accent-warm); }
```

#### 4c. BlogPostCard.astro — Dates and Tags

**File:** `src/components/BlogPostCard.astro:58-89`

```css
/* Date — migrate from legacy alias */
time {
  font-size: var(--text-sm);
  color: var(--accent-warm);  /* was --color-text-muted */
}

/* Title — migrate from legacy alias */
h3 {
  color: var(--foreground);  /* was --color-text */
}

/* Description — migrate from legacy alias */
p {
  color: var(--secondary);  /* was --color-text-muted */
}

/* Tags — switch from blue to warm */
.tag {
  font-size: var(--text-sm);
  color: var(--accent-warm);  /* was --color-accent */
  background: var(--accent-warm-soft);  /* was color-mix blue */
  padding: var(--space-xs) var(--space-sm);
  border-radius: 9999px;
  font-weight: 500;
}
```

#### 4d. BlogPostLayout.astro — Post Header Dates and Tags

**File:** `src/layouts/BlogPostLayout.astro:74-101`

```css
/* Date */
.post-meta {
  color: var(--accent-warm);  /* was --color-text-muted */
}

.updated {
  color: var(--muted);  /* was --color-text-muted — keep muted, it's secondary info */
}

/* Tags */
.tag {
  color: var(--accent-warm);  /* was --color-accent */
  background: var(--accent-warm-soft);  /* was color-mix blue */
}
```

Also migrate other legacy aliases in BlogPostLayout.astro:
- `.prose :global(blockquote)` — `--color-accent` → `--accent`, `--color-text-muted` → `--muted`
- `.prose :global(a)` — `--color-accent` → `--accent`
- `.prose :global(a:hover)` — `--color-accent-hover` → `--accent-hover`
- `.prose :global(hr)` — `--color-border` → `--border`
- `.post-footer` — `--color-border` → `--border`
- `.post-footer a` — `--color-text-muted` → `--muted`
- `.post-footer a:hover` — `--color-accent` → `--accent`

#### 4e. blog/index.astro — Empty State

**File:** `src/pages/blog/index.astro:52`

```css
.empty { color: var(--muted); }  /* was --color-text-muted */
```

---

### Step 5: Transition Token Migration

Migrate all touched components from hardcoded `150ms ease-out` to new tokens. Most of this happens naturally during Steps 3-4 but verify:

| Component | Current | New |
|-----------|---------|-----|
| Hero.astro `.cta` | `150ms ease-out` | `var(--duration-fast) var(--ease-out)` for bg, `var(--duration-base)` for shadow/transform |
| Writing.astro `.entry` | `150ms ease-out` | `var(--duration-base) var(--ease-out)` |
| BlogPostCard.astro `.post-card` | `150ms ease-out` | `var(--duration-fast)` for border, `var(--duration-base)` for shadow/transform |
| Footer.astro `.contact-links a` | none | `var(--duration-fast) var(--ease-out)` |

**Not in scope:** Header.astro (`0.15s` without easing) — leave for separate cleanup.

---

### Step 6: Update Design System Documentation

**File:** `.interface-design/system.md`

Update these sections:

**Depth:** Replace "Borders-first. Shadows only as hover interaction cues (`--shadow-sm`)." with:

> Three-level shadow system for physical depth. Borders for structure, shadows for elevation.
> - `--shadow-sm`: Resting ground shadow (barely visible)
> - `--shadow-md`: Interactive elements — card hover, button hover
> - `--shadow-lg`: Reserved for elevated modals/overlays
> Card-lift hover pattern: `translateY(-2px) + --shadow-md` on hover, `translateY(0)` on `:active`.

**Colors table:** Add warm accent rows:

| Token | Light | Dark |
|-------|-------|------|
| `--accent-warm` | `#d97706` | `#f59e0b` |
| `--accent-warm-hover` | `#b45309` | `#fbbf24` |
| `--accent-warm-soft` | `rgba(217,119,6,0.10)` | `rgba(245,158,11,0.10)` |

Add note: "Two-accent system: blue for actions/navigation, amber for temporal metadata (dates, tags)."

**Add Transitions section:**

> ## Transitions
> - `--ease-out`: `cubic-bezier(0.33, 1, 0.68, 1)` — standard easing
> - `--ease-out-back`: `cubic-bezier(0.34, 1.56, 0.64, 1)` — card-lift overshoot
> - `--duration-fast`: 150ms — color/border changes
> - `--duration-base`: 200ms — shadow lifts, transforms
> - `--duration-slow`: 350ms — reserved
> All transitions must include `@media (prefers-reduced-motion: reduce)` guard.

**Decisions table:** Add 4 new entries:

| Decision | Rationale | Date |
|----------|-----------|------|
| Layered shadow system (sm/md/lg) | Physical depth without decoration | 2026-02-15 |
| Warm accent (amber) for metadata | Rams' "strategic color accent against neutral field" | 2026-02-15 |
| Section surface alternation | Visual rhythm without borders or decoration | 2026-02-15 |
| Card-lift hover pattern | Physical feedback acknowledging interaction | 2026-02-15 |

---

## Gotchas from Past Solutions

1. **Astro scoped style specificity** — Scoped `<style>` selectors have 0 specificity via `:where()`. Global `a { color: var(--accent) }` overrides them. Use `!important` on `.cta` color/decoration as documented workaround. (Source: `docs/solutions/ui-bugs/site-restructure-rams-jobs-principles.md`)

2. **Legacy alias migration** — BlogPostCard and BlogPostLayout still use `--color-*` aliases. Migrate to semantic tokens (`--foreground`, `--muted`, `--accent`, `--border`) during Steps 3-4. Don't touch Header.astro aliases unless directly needed.

3. **Accent color rule** — `--accent-warm` is for temporal metadata only (dates, tags). Never for interactive elements. Interactive = blue accent. Metadata = warm accent. (Source: `docs/solutions/ui-bugs/design-system-drift-System-20260215.md`)

4. **Always use tokens** — No hardcoded `px` values for spacing, radius, or font-size. Use `var(--space-*)`, `var(--radius*)`, `var(--text-*)`. (Source: same)

5. **translateY on hover + View Transitions** — Add `transform: translateY(0)` on `:active` to reset before navigation starts, preventing View Transition artifacts.

---

## Implementation Order

```
Step 1 (Tokens)          ← all other steps depend on this
  ↓
Step 2 (Full-bleed)      ← structural change before visual
  ↓
Step 3 + 4 + 5           ← can be done per-component in parallel
  ↓
Step 6 (Docs)            ← document final state after visual verification
```

**Recommended per-component order within Steps 3-5:**
1. Writing.astro (biggest change — hover + warm accent + transitions)
2. BlogPostCard.astro (hover + warm accent + legacy migration)
3. Hero.astro (CTA hover + transitions)
4. Experience.astro (warm accent only)
5. Footer.astro (hover only)
6. BlogPostLayout.astro (warm accent + legacy migration)
7. blog/index.astro (legacy alias fix only)

---

## Verification Checklist

### Build
- [x] `npm run build` succeeds with no errors

### Visual (inspect at 375px, 768px, 1440px, 2560px)
- [x] Hero has stone-50 background extending full viewport width
- [x] Experience sits on white, visually distinct from hero and writing
- [x] Writing has stone-50 background matching hero
- [x] Footer sits on white with existing border-top
- [x] No layout breaks at any viewport width

### Dark Mode
- [ ] All surface alternations render correctly in dark mode
- [ ] Warm accent (amber-500) is visible but doesn't dominate blue accent
- [ ] Shadows use pure black in dark mode (not warm-toned)

### Hover States
- [x] Writing entries: background + translateY(-2px) + shadow-md on hover
- [x] BlogPostCards: border-strong + translateY(-2px) + shadow-md on hover
- [x] Hero CTA: accent-hover bg + translateY(-1px) + shadow-md on hover
- [x] Footer links: accent color + translateY(-1px) on hover
- [x] All hovers return to translateY(0) on `:active`

### Warm Accent
- [x] Dates in Writing section are amber
- [x] Dates in Experience section are amber
- [x] Dates in BlogPostCard are amber
- [x] Dates in blog post header are amber
- [x] Tags in BlogPostCard are amber text on amber-soft bg
- [x] Tags in blog post header match

### Accessibility
- [x] `prefers-reduced-motion: reduce` disables all transforms and transitions
- [ ] `--accent-warm` on `--surface` meets WCAG AA (4.5:1) in light mode
- [ ] `--accent-warm` on `--background` meets WCAG AA in dark mode
- [x] Keyboard Tab through Writing entries, BlogPostCards, CTA — all show focus states
- [x] No visible layout shift on hover (translateY doesn't affect flow)

### Legacy Cleanup
- [x] BlogPostCard.astro uses no `--color-*` aliases
- [x] BlogPostLayout.astro uses no `--color-*` aliases
- [x] blog/index.astro uses no `--color-*` aliases

---

## Files Modified (9 total)

| File | Steps | Changes |
|------|-------|---------|
| `src/styles/global.css` | 1 | Add shadow-md/lg, warm accent tokens, transition tokens |
| `src/components/Hero.astro` | 2a, 3c, 5 | Full-bleed structure, CTA shadow-lift, transition tokens |
| `src/components/Experience.astro` | 2b, 4b | Full-bleed structure, warm accent on dates |
| `src/components/Writing.astro` | 2c, 3a, 4a, 5 | Full-bleed structure, card-lift hover, warm accent, transitions |
| `src/components/Footer.astro` | 3d, 5 | Contact link hover, transition tokens |
| `src/components/BlogPostCard.astro` | 3b, 4c, 5 | Card-lift hover, warm accent, legacy migration, transitions |
| `src/layouts/BlogPostLayout.astro` | 4d | Warm accent on dates/tags, legacy migration |
| `src/pages/blog/index.astro` | 4e | Legacy alias fix |
| `.interface-design/system.md` | 6 | Document all new tokens, patterns, decisions |

---

## References

### Internal
- Brainstorm: `docs/brainstorms/2026-02-15-visual-refinement-brainstorm.md`
- Design system: `.interface-design/system.md`
- Prior audit: `docs/solutions/ui-bugs/design-system-drift-System-20260215.md`
- Restructure record: `docs/solutions/ui-bugs/site-restructure-rams-jobs-principles.md`

### External
- Josh Comeau: Designing Shadows — layered shadow technique
- Apple HIG: Depth and visual hierarchy
- Dieter Rams: "Strategic color accent against neutral field" (ET66 calculator)
