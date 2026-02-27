# Visual Refinement: Rams/Jobs Design Principles

**Date:** 2026-02-15
**Status:** Approved
**Approach:** C — Surface Architecture + Depth

## What We're Building

A visual refinement of johnlitzsinger.com that transforms the site from "technically correct minimalism" to "crafted minimalism with life." The site currently has a well-defined token system and disciplined accent usage, but every section looks the same, there's no sense of physical depth, hover states are crude, and the page feels static rather than alive.

We're adding three layers of visual richness — all within the existing design system architecture:

1. **Depth & Materiality** — Layered shadow system, refined hover states with physical feedback
2. **Surface Rhythm** — Alternating background surfaces between sections to create visual music
3. **Warm Accent** — A second accent color (amber/orange from the stone family) for dates and tags, adding Braun-like warmth

## Why This Approach

Dieter Rams' products were alive because of **strategic color accents against neutral fields**, **material suggestion**, and **proportional harmony**. Jony Ive's designs showed **evidence of care** in every detail — shadows that fell correctly, transitions that responded naturally, spacing that gave content room to breathe.

The current site has the restraint but lacks the care. The single shadow token (`--shadow-sm`) creates no depth. The uniform section structure creates no rhythm. The opacity-based hover on Writing entries feels like a fade-out rather than an invitation. The hero is indistinguishable from body content.

Approach C addresses all of these while staying true to "as little design as possible" — we're not adding decoration, we're adding **physical believability**.

## Key Decisions

### 1. Layered Shadow System
Expand from 1 shadow token to 3 (sm/md/lg). Use warm-toned shadows matching the stone palette (rgba(12,10,9,...)) rather than pure black. Shadows are layered (multiple offset values) to mimic real light diffusion per Josh Comeau's research and Apple's depth philosophy.

- `--shadow-sm`: Resting state, barely visible ground shadow
- `--shadow-md`: Interactive elements at rest — cards, contact items
- `--shadow-lg`: Hover/active state — lifted elements responding to interaction

### 2. Transition Easing System
Add 2-3 transition tokens with cubic-bezier curves that feel organic rather than mechanical:

- `--transition-fast`: 150ms — hover color/border changes
- `--transition-base`: 250ms — shadow lifts, elevation changes
- `--transition-slow`: 400ms — reserved for future use

All respect `prefers-reduced-motion: reduce`.

### 3. Surface Differentiation
Use existing `--surface` and `--surface-2` tokens to create alternating section backgrounds. The hero gets `--surface` background that bleeds softly into the page (no hard border). Subsequent sections alternate between `--background` and `--surface` to create visual rhythm.

### 4. Warm Accent Color
Add `--accent-warm` (amber-600 range, ~#d97706 light / ~#fbbf24 dark) for:
- Publication dates in Writing entries and blog post cards
- Tag pill backgrounds (replacing current `--accent-soft` blue)
- Possibly the section labels

This creates Rams' "proportional harmony" — the blue accent means "action/navigation" while the warm accent means "metadata/temporal." Two colors, two clear roles.

### 5. Refined Hover States
Replace crude opacity hover on Writing entries with card-lift pattern:
- Resting: `--shadow-sm` or no shadow, `--border` outline
- Hover: `--shadow-md`, `--border-strong`, subtle `translateY(-1px)` or `translateY(-2px)`

CTA button gets a similar physical feel — slight shadow lift on hover alongside the existing background-color transition.

### 6. Hero Integration
The hero gets `--surface` background but flows naturally into content:
- No border-bottom on the hero section
- The surface background creates a gentle tonal shift rather than a hard zone
- Typography stays at current scale (no dramatic enlargement)
- More generous padding-bottom to let the content breathe before the next section

## Open Questions

1. **Warm accent exact hue:** Should it be amber (#d97706), orange (#ea580c), or a more muted warm tone? Need to test against the stone palette in both light and dark modes.
2. **Section label treatment:** Currently muted uppercase text. Should section labels get the warm accent treatment, or stay muted?
3. **Blog post cards:** Should they get `--shadow-md` at rest (elevated cards) or stay border-only with shadow only on hover?
4. **Footer contact links:** Currently have border + shadow-on-hover treatment. Should these match the new card-lift pattern?

## Scope

### In Scope
- `src/styles/global.css` — new tokens (shadows, transitions, warm accent)
- `src/components/Hero.astro` — surface background, refined spacing
- `src/components/Experience.astro` — surface alternation
- `src/components/Writing.astro` — card-lift hover, warm accent on dates
- `src/components/Contact.astro` — refined hover to match new pattern
- `src/components/BlogPostCard.astro` — warm accent on dates, refined hover
- `src/layouts/BaseLayout.astro` — if needed for section background alternation
- `.interface-design/system.md` — update design system documentation

### Out of Scope
- No new imagery, icons, or illustrations
- No scroll animations or entrance effects
- No changes to content or copy
- No changes to blog post layout or typography
- No dark mode toggle (stays OS-preference only)
- No changes to the font or type scale

## Success Criteria

The site should feel like someone cared about every surface, every shadow, every hover — without looking like anything was "added." Visitors should feel the difference without being able to point to what changed. That's the Rams/Ive standard: invisible craft.
