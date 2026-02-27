---
title: Site restructured following Rams/Jobs design principles
date: 2026-02-15
category: ui-bugs
tags: [design-systems, information-architecture, typography, astro, css, scoped-styles]
severity: high
component: [Hero, About, Skills, Experience, Contact, Footer, Writing, index.astro, global.css]
symptoms:
  - All sections had equal visual weight despite different importance
  - Skills pills (Excel, CRM, Sales) added noise without demonstrating skill
  - About section repeated hero content
  - Blog hidden behind nav link despite being primary differentiator
  - Uniform 64px spacing eliminated section rhythm
  - Centered hero felt generic/template-like
  - Duplicate contact info in Contact section and Footer
  - Typography not utilizing full contrast range
root_cause: Initial site followed conventional portfolio layout patterns without content prioritization or visual hierarchy strategy
resolution: Deleted About and Skills sections, merged Contact into Footer, redesigned Experience as scannable list, added Writing section, left-aligned hero with 56px H1, varied section spacing, uppercase labels
related:
  - docs/brainstorms/2026-02-14-personal-website-brainstorm.md
  - docs/plans/2026-02-14-feat-personal-website-astro-mdx-plan.md
  - docs/solutions/ui-bugs/design-system-drift-System-20260215.md
  - interface-design-system.md
---

## Context

The personal website accumulated design debt: redundant sections, uniform spacing, a template-like centered hero, skills pills that added noise, and duplicate contact info. Every section had equal visual weight despite vastly different importance. The blog — the most interesting part of the site — was invisible on the homepage.

The site needed a structural redesign applying Dieter Rams' "Less, but better" and Steve Jobs' radical simplicity principles.

## Solution

### Root Cause

The original design followed conventional portfolio patterns (Hero, About, Experience, Skills, Contact) without evaluating whether each section earned its place. Content was organized by *category* (what it is) rather than *priority* (what the visitor needs).

### Changes Made

**Page structure** went from 6 sections to 4:

```
Before: Hero -> About -> Experience -> Skills -> Contact -> Footer
After:  Hero -> Work -> Writing -> Footer (with contact)
```

**Files modified:**
- `src/pages/index.astro` — removed About, Skills, Contact imports; added Writing
- `src/components/Hero.astro` — left-aligned, single CTA, 56px H1, absorbs About's purpose
- `src/components/Experience.astro` — rewritten as scannable typographic list
- `src/components/Writing.astro` — new component, surfaces latest 3 blog posts
- `src/components/Footer.astro` — merged with Contact section
- `src/styles/global.css` — new tokens, typography refinements, micro-details

**Components deleted:** About.astro, Skills.astro, Contact.astro
**Components created:** Writing.astro

### Key Implementation Details

**Hero (collapsed About, left-aligned, single CTA):**
```css
.hero { padding: var(--space-3xl) var(--gutter); text-align: left; }
h1 { font-size: var(--text-5xl); letter-spacing: -0.03em; line-height: 1.05; }
.cta {
  text-decoration: none !important; /* Override global a styles — see Astro note below */
  background: var(--accent);
  color: #fff !important;
}
```

**Experience (scannable list with CSS Grid):**
```css
.entry {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border);
}
```

Each role reduced from 3 bullet points to one summary sentence. Resume PDF has the detail.

**Writing (surfaces blog posts):**
```astro
const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 3);
```

Section only renders if posts exist. Same scannable list pattern as Experience.

**Section labels (consistent across Work, Writing, Footer):**
```css
.section-label {
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}
```

**New design tokens added to global.css:**
```css
--text-5xl: 3.5rem;   /* 56px — hero display */
--space-3xl: 8rem;     /* 128px — hero breathing room */
```

**Typography refinements:**
- H2 weight dropped from 600 to 500 (guides without competing with H1)
- `text-wrap: balance` on all headings
- `::selection { background: var(--accent-soft); }`
- `scroll-padding-top: 80px` for sticky header anchor offset
- `text-decoration-skip-ink: auto` on links

## Astro Scoped Style Specificity Gotcha

During implementation, the CTA button in Hero.astro rendered as a plain blue underlined link instead of a filled button.

**Cause:** Astro wraps scoped `<style>` selectors with `:where()`, giving them 0 specificity. Global styles in `global.css` (like `a { color: var(--accent); text-decoration: underline; }`) have normal specificity and override scoped component styles.

**Fix:** Use `!important` on the CTA button styles:
```css
.cta {
  text-decoration: none !important;
  color: #fff !important;
}
```

**Better long-term fix:** Narrow the global `a` selector (e.g., `main :where(a)` or use a `.prose a` wrapper) so it doesn't collide with button-like components.

## Prevention Strategies

1. **Audit before adding** — Every new section must answer: "Does this add unique value, or duplicate existing content?" Use the design system's 7-point mandate checks.
2. **Content inventory** — Maintain awareness of what each section communicates. Cross-reference before adding new components.
3. **Separate resume thinking from web thinking** — Bullet points and skill lists work on PDFs but don't translate to good web design. Let work demonstrate skill.
4. **Single source for contact info** — Footer only. If contact appears elsewhere, link to the footer anchor.
5. **Astro style rule** — When a scoped component's appearance conflicts with globals, first check if the global style is over-broad. Prefer `:global()` over `!important` — see [scoped-style-specificity-global-override-System-20260217.md](./scoped-style-specificity-global-override-System-20260217.md) for the idiomatic fix.

## Best Practices

- **Reductive design by default** — Start with minimum sections, add only when a specific user need is unmet.
- **Spacing as structure** — Vary rhythm between sections to signal importance (128px hero, 64px content, 64px footer). Uniform spacing = template feel.
- **Hero needs a perspective** — Avoid centered symmetric layouts for personal sites. Left-aligned with a single clear CTA feels more intentional.
- **Typography contrast** — Push H1 larger than feels safe. The contrast between 56px H1 and 16px body text creates hierarchy that guides the eye without decoration.
- **Uppercase labels** — Small, letter-spaced, muted section labels create visual pause points without competing with content.
