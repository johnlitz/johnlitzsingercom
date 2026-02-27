---
module: System
date: 2026-02-15
problem_type: ui_bug
component: frontend_stimulus
symptoms:
  - "10 CSS values off design system scales (spacing, radius, typography)"
  - "Accent color used decoratively on non-link elements"
  - "Flat typography hierarchy — body text same weight as headings"
  - "No section dividers creating monotone page rhythm"
root_cause: logic_error
resolution_type: code_fix
severity: medium
tags: [design-system, css, spacing-grid, typography, audit, astro]
---

# Troubleshooting: Design System Drift — Off-Scale Values and Craft Gaps

## Problem

After initial site build, CSS values drifted from the design system defined in `interface-design-system.md`. Hard-coded values bypassed design tokens, accent color was used decoratively on non-interactive elements, and typography/layout lacked the hierarchy and rhythm the system specifies.

## Environment

- Module: System (site-wide CSS and Astro components)
- Framework: Astro 5 with scoped `<style>` tags
- Design System: `interface-design-system.md` (4px grid, stone palette, borders-first depth)
- Date: 2026-02-15

## Symptoms

- Spacing values off the 4px grid: `0.4em 1em` (Skills pills), `0.15em 0.6em` (tags), `5px` (bullet markers)
- Radius values off scale: `6px` (nav link), `4px` (inline code) — scale is 10/14/999px only
- Typography below minimum scale: `0.75rem` (12px) tags when smallest token is `--text-sm` (14px)
- Accent color (`--accent` blue) used on company names in Experience cards — these are not links
- About section body text at `--foreground` weight, same as headings — no hierarchy
- No section dividers — page reads as a flat, monotone stack with identical spacing
- Footer links missing underlines — look like plain text until hovered
- Display headings lack letter-spacing — feel default rather than crafted

## What Didn't Work

**Direct solution:** Issues were identified systematically through audit (round 1: scale violations) and visual critique with screenshots (round 2: craft gaps). Both rounds were fixed on first attempt.

## Solution

### Round 1: Scale Compliance (10 violations)

**Spacing fixes:**
```css
/* Before (off-grid): */
.skill { padding: 0.4em 1em; }
.tag { padding: 0.15em 0.6em; font-size: 0.75rem; }
li::before { width: 5px; height: 5px; }

/* After (on-grid): */
.skill { padding: var(--space-sm) var(--space-3); }     /* 8px 12px */
.tag { padding: var(--space-xs) var(--space-sm); font-size: var(--text-sm); }  /* 4px 8px, 14px */
li::before { width: 4px; height: 4px; }
```

**Radius fixes:**
```css
/* Before (off-scale): */
.nav-link { border-radius: 6px; }
code { border-radius: 4px; }

/* After (on-scale): */
.nav-link { border-radius: var(--radius); }   /* 10px */
code { border-radius: var(--radius); }         /* 10px */
```

**Other fixes:**
- Contact section header gap: `--space-md` (16px) → `--space-3` (12px) per Section Header Block pattern
- 404 display heading: `6rem` → `var(--text-4xl)` (48px) to stay on type scale
- Design system doc updated to reflect intentional Inter-first font stack

### Round 2: Craft Refinements (6 issues)

**Typography tightening:**
```css
/* Added letter-spacing to all heading levels in global.css: */
h1 { letter-spacing: -0.025em; }
h2 { letter-spacing: -0.015em; }
h3 { letter-spacing: -0.01em; }
```

**Accent color misuse fix:**
```css
/* Before — blue on non-link text: */
.company { color: var(--color-accent); }

/* After — secondary for non-interactive text: */
.company { color: var(--secondary); }
```

**Hierarchy fix:**
```css
/* Before — body text same weight as headings: */
.about-content p { color: var(--color-text); }  /* --foreground */

/* After — softer body creates heading dominance: */
.about-content p { color: var(--secondary); }   /* --secondary */
```

**Section rhythm:**
```css
/* Added border-top to Experience and Contact sections: */
.experience { border-top: 1px solid var(--border); }
.contact { border-top: 1px solid var(--border); }
```

**Footer links:**
```css
/* Before — no underline by default: */
.footer-links a { text-decoration: none; }

/* After — underlined per design system link pattern: */
.footer-links a { text-decoration: underline; text-underline-offset: 2px; text-decoration-thickness: 1px; }
```

## Why This Works

1. **Root cause**: During initial build, values were written as raw numbers rather than referencing design tokens. This is natural when building fast — you type `6px` instead of `var(--radius)` because you're thinking about the visual, not the system.

2. **The token system exists precisely for this reason.** Using `var(--radius)` instead of `10px` means the radius lives in one place. When the system changes, everything updates. Hard-coded values silently drift.

3. **Accent color misuse** happened because blue "looked good" on company names — a decorative choice that violates the system rule: "Accent is for meaning (links/CTAs), not decoration." This causes user confusion about what's clickable.

4. **Typography hierarchy** requires intentional contrast between heading and body weights. When everything is `--foreground`, the eye has no guidance. `--secondary` for body text creates a clear reading order.

5. **Letter-spacing at display sizes** is a craft detail — Inter's default tracking is slightly loose above 24px. Professional typography tightens tracking proportionally as size increases.

## Prevention

- **Always use CSS custom properties** (`var(--space-sm)`) instead of raw values. Search for hard-coded `px`, `rem`, or `em` values in style blocks as a lint check.
- **Run `/interface-design:audit` after each significant UI change** to catch drift before it accumulates.
- **Accent color rule**: Before applying `--accent` to any element, ask "Is this interactive?" If no, use `--secondary` or `--muted`.
- **Heading letter-spacing**: Add negative letter-spacing to any heading above 20px. Scale: `-0.01em` at 24px, `-0.015em` at 30px, `-0.025em` at 40px+.
- **Section rhythm check**: If three or more consecutive sections have identical padding and no visual separator, add a `border-top` divider at the strongest thematic boundary.

## Files Changed

### Round 1 (commit `b5c4acb`)
- `src/styles/global.css` — inline code radius
- `src/components/Header.astro` — nav link radius
- `src/components/Skills.astro` — pill padding
- `src/components/BlogPostCard.astro` — tag size + padding
- `src/layouts/BlogPostLayout.astro` — tag size + padding
- `src/components/Experience.astro` — bullet marker size
- `src/components/Contact.astro` — section header spacing
- `src/pages/404.astro` — display heading size
- `interface-design-system.md` — font stack documentation

### Round 2 (commit `eb6770c`)
- `src/styles/global.css` — heading letter-spacing
- `src/components/Hero.astro` — h1 letter-spacing
- `src/components/About.astro` — body text hierarchy
- `src/components/Experience.astro` — company name color, section divider
- `src/components/Contact.astro` — section divider
- `src/components/Footer.astro` — link underlines

## Related Issues

No related issues documented yet.
