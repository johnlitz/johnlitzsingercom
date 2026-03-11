# Phase 1: Design Polish - Research

**Researched:** 2026-03-11
**Domain:** Web design systems, CSS layouts, responsive design, Astro component patterns
**Confidence:** HIGH

## Summary

This phase focuses on visual and layout refinement across all pages and chrome components of a personal portfolio website built with Astro 5, React islands, and a light-only CSS design system. The codebase has solid foundations: a complete design token system (OKLCH color scales, typography, spacing), viewport-locked layout with section-aware styling, and established component patterns. Research reveals a mature CSS strategy with no framework dependencies and clear design philosophy. The key work involves applying these systems consistently across pages (Now, Work, About, Guest Book, Blog, 404), adapting the layout for mobile (removing viewport lock below 640px), and ensuring chrome components (top bar, breadcrumb, footer, transitions) function flawlessly.

**Primary recommendation:** Implement design polish systematically per page, using existing design tokens and patterns as the single source of truth. Test mobile responsiveness early at 320px-480px and 640px breakpoints.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Design Philosophy
- **Core feeling:** Sharp craft — every pixel intentional, obsessive attention to detail. The site itself IS the portfolio
- **Whitespace:** Generous and deliberate — every element earns its space. But with strategic bursts of "life" and color (think Apple iPod commercials: bold minimal silhouettes with bright color)
- **Color life:** Context-dependent — sometimes color comes through interactions/hovers, sometimes section identity, sometimes accent moments, sometimes typography. Not always all at once; varies by context
- **Motion philosophy:** Statement moments — most things quiet, key interactions (folder hovers, page transitions) are intentional and memorable. Everything else is still
- **Polish bar:** Pixel-perfect obsession — multiple rounds until it feels flawless
- **Page personality:** Shared bones, unique accents — same structural layout but each page gets subtle personality through its section color

#### Design Philosophy Document
Create a portable design philosophy document with two layers:
1. **Universal principles** (transferable to any project): spacing logic, typography ratios, color philosophy, motion principles, craft standards
2. **Site-specific decisions** (this project): warm cream palette, folder icons, section colors, OKLCH scales, Rethink Sans + Urbanist

#### Homepage Layout Change
- **Brand name ("John Litzsinger")** moves from top bar to homepage hero position (where the tagline currently sits)
- **Tagline** ("Finance & CS @ Purdue...") becomes subtitle below the name — two-line introduction
- **jl logo** stays top-left but slightly larger
- **Folder grid** remains below name+tagline, centered as group
- Social icons remain in top-right

#### Inner Page Spacing & Hierarchy
- **Title prominence:** Present but understated — orients you, then gets out of the way. Content is the star
- **Vertical rhythm:** Even spacing throughout with focus on BALANCE — not top-heavy or bottom-heavy. All pages should flow with the same organizational feel
- **Now page:** Ultra-minimal title + date table of contents. No excerpts, no cards. Just a clean list of titles and dates. Click to read
- **About page:** Bio text above, Calvin & Hobbes GIF below. Sequential top-to-bottom flow

#### Chrome
- **Top bar:** Grounding presence — clearly there, sets the frame, but doesn't demand attention. Like a gallery wall label
- **Section transitions:** Quick ease (100-150ms) — fast enough to feel instant, slow enough to feel intentional. ease-in-out easing, zero lag
- **Footer:** Always visible on every page. Content: current activity/building + open to opportunities at startups
- **Breadcrumb:** Integrated into the page title itself — no "jl /" prefix. Just the section name and page name as the title (e.g., "Work / Project Name")
- **Easing:** ease-in-out for all animations, lean and extremely fast durations

#### Mobile Layout
- **Scrolling:** Allow scrolling on mobile (release viewport-lock below desktop breakpoint)
- **Homepage folders:** Become a single-folder carousel below 640px with dots indicator + swipe gestures (no arrows)
- **All pages:** Must render correctly on 320px-480px viewports

#### Folder Icons
- **Hover animation:** Keep all current effects (lift, scale, tab open, color glow) — folders are THE statement moment
- **Labels:** Always visible below icons
- **Size:** Current size is good
- **Shadows:** Colored shadows ONLY — NO black shadows. Each folder's shadow matches its section color

#### Content Strategy
- **Work carousel cards:** Title + thumbnail + description + tech (brief tech touch — focus on the creation and the story behind it). Requires project images
- **About page bio:** Personality first — interests, values, what excites. Professional details are secondary (work page handles that)
- **Footer status:** Current activity/building + open to opportunities at startups
- **404 page:** On-brand with folder metaphor ("This folder is empty" or similar). Tie error state back to the site's visual identity

#### Typography
- **Type scale:** Current scale (text-xs through text-2xl with clamp) is good — keep as-is
- **Metadata:** Clearly secondary — smaller, lighter, possibly monospace. Functional info, not content
- **Hover states:** Keep current behavior (no changes)

### Claude's Discretion
- Exact spacing values within the "even and balanced" philosophy
- How the breadcrumb-as-title integration looks in practice
- Mobile carousel implementation details for homepage folders
- Specific animation durations within the 100-150ms range
- How the design philosophy file is structured (format, sections)
- Typography weight for the hero brand name at large size
- How "life" and color manifest in specific contexts on each page

### Deferred Ideas (OUT OF SCOPE)
- Project thumbnail images for carousel cards — need to source/create images (may need Phase 2 or separate task)
- Dark mode — explicitly out of scope (light-only is deliberate)
- Admin dashboard for Guest Book — Phase 3 / v2

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DESIGN-01 | Now page has polished layout, typography, spacing, and visual hierarchy | Design tokens in global.css, BaseLayout section colors, entry-feed layout in now.astro — all established. Spacing optimization and hover refinements needed. |
| DESIGN-02 | Work page has polished layout with carousel title/description properly positioned | ProjectCarousel.tsx exists with title/description above cards (carousel-info div). Spacing and alignment polish needed. |
| DESIGN-03 | About page has polished layout with bio and GIF properly composed | about.astro has sequential layout (bio → resume link → GIF). Spacing and alignment polish needed. |
| DESIGN-04 | Guest Book page has polished sticky note layout with proper spacing and alignment | GuestBookPage.tsx (React island) exists with sticky note styling. Spacing and form alignment polish needed. |
| DESIGN-05 | Blog post pages have polished prose styling, tag pills, and metadata display | BlogPostLayout.astro has established prose styles, tag styling, metadata. Polish and consistency refinement needed. |
| DESIGN-06 | 404 page has polished typography and clear navigation home | 404.astro exists with basic structure. Typography and folder metaphor polish needed. |
| CHROME-01 | Top bar (brand name + social icons) is properly spaced and responsive | BaseLayout.astro has top-bar with brand name, icons. Mobile breakpoints at 480px, 768px exist. Spacing refinement needed. |
| CHROME-02 | Breadcrumb navigation is visually consistent with monospace styling | breadcrumb element in BaseLayout.astro with monospace font-family. Consistent styling established. |
| CHROME-03 | Back arrow stays left-aligned regardless of breadcrumb depth | back-arrow positioned absolutely left. Already implemented, verify on all pages. |
| CHROME-04 | Footer status text is well-formatted with animated link hover | site-footer with footer-status in BaseLayout.astro. footer-status-link has animated underline. Polish needed. |
| CHROME-05 | Page transitions between sections are smooth with correct section color shifts | ClientRouter with fade transition (150ms). Section color system with hue-rotate on icon. Verify smooth transitions all pages. |
| CHROME-06 | Section color system is consistent (logo, hovers, backgrounds, underlines) | sectionColorMap in BaseLayout.astro drives --section-color, --icon-filter, --page-bg. OKLCH scales per section in global.css. Verify consistency across all interactions. |
| MOBILE-01 | All pages render correctly on phone-width viewports (320px-480px) | Breakpoints at 480px and 768px in BaseLayout. verify all content readable, no overflow. |
| MOBILE-02 | Navigation chrome adapts properly (brand name hide, icon adjustments) | brand-name hidden at 480px, X/LinkedIn icons hidden at 480px. Verify icon spacing and functionality. |
| MOBILE-03 | Folder grid on homepage adjusts to smaller viewport | Context.md specifies single-folder carousel below 640px with dots + swipe. Currently full grid above breakpoint — implementation needed. |
| MOBILE-04 | Carousel is usable on touch devices | ProjectCarousel.tsx has arrow/dot navigation. Touch adaptation and swipe handling may need polish. |
| MOBILE-05 | Guest Book form and sticky notes adapt to narrow widths | GuestBookPage.tsx (React island). Touch-friendly form, readable sticky notes at 320px needed. |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | ^5.17.1 | Framework for static site with islands architecture | Official choice for performance + content-first model |
| React | ^19.2.4 | Client-side interactive components (Carousel, GuestBook) | Minimal-footprint islands (client:load/visible/idle) avoid bloat |
| @astrojs/mdx | ^4.3.13 | MDX content rendering for blog posts | Standard for content + React component embedding |
| @astrojs/react | ^4.4.2 | Astro → React integration | Direct support for React islands in Astro pages |

### Design System
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS custom properties (OKLCH) | Native CSS | Color scales, spacing tokens, transitions | All pages — established in global.css |
| @astrojs/sitemap | ^3.7.0 | Auto-generate XML sitemaps for SEO | Included, used for blog discovery |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @astrojs/vercel | ^9.0.4 | Vercel deployment adapter + analytics | Production deployment only |
| @astrojs/rss | ^4.0.15 | RSS feed generation for blog | Available if needed, optional |
| zod | (implicit via Astro) | Content collection schema validation | Used in src/content.config.ts for blog frontmatter |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Astro | Next.js + Static Export | More setup, larger bundle, overkill for static portfolio |
| Native CSS | Tailwind CSS | Contradicts design philosophy (hand-crafted over utilitarian) |
| React islands | htmx / Alpine.js | React better for complex Carousel, GuestBook state management |
| OKLCH color system | Tailwind color palette | Current OKLCH setup allows perceptually uniform color scales, matches design intent |

**Installation:**
```bash
# Already installed. To add dependencies:
npm install [new-package-name]
npm run dev       # Start dev server on localhost:4321
npm run build     # Production build to .vercel/output/
npm run preview   # Preview production build locally
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── BaseHead.astro          # SEO meta, font preloading
│   ├── react/
│   │   ├── ProjectCarousel.tsx # Work page carousel
│   │   └── GuestBookPage.tsx   # Guest book form + entries
│   └── *.astro                 # Reusable Astro components
├── content/
│   ├── blog/                   # MDX files for blog posts
│   ├── config.ts               # Content collection schema (Zod)
│   └── projects.ts             # Project data
├── data/
│   ├── projects.ts             # Project metadata
│   └── status.ts               # Footer status message
├── layouts/
│   ├── BaseLayout.astro        # Master layout: viewport-lock, header, footer, nav
│   └── BlogPostLayout.astro    # Blog post wrapper: prose styles, metadata, prev/next nav
├── pages/
│   ├── index.astro             # Homepage: brand name + tagline + folder grid
│   ├── now.astro               # Now page: blog feed (posts + updates)
│   ├── work.astro              # Work page: carousel
│   ├── work/[slug].astro       # Project detail page
│   ├── about.astro             # About page: bio + resume link + GIF
│   ├── guest-book.astro        # Guest book form page
│   ├── blog/[...slug].astro    # Dynamic blog post route
│   ├── blog/index.astro        # Blog redirect to /now
│   └── 404.astro               # Error page
└── styles/
    └── global.css              # Design tokens, resets, global styles
```

### Pattern 1: Section-Aware Color System

**What:** Dynamic color shifts based on which section (Now, Work, About, Guest Book) the user is viewing. Logo icon hue-rotates, social link hovers change, background tints, page transitions animate smoothly between colors.

**When to use:** Every page requires section color identity. Homepage uses red accent.

**Example:**
```astro
// Source: src/layouts/BaseLayout.astro
---
const sectionColorMap: Record<string, { color: string; bg: string }> = {
  'Now': { color: 'var(--now-500)', bg: 'var(--now-50)' },
  'Work': { color: 'var(--work-500)', bg: 'var(--work-50)' },
  'Guest Book': { color: 'var(--guestbook-500)', bg: 'var(--guestbook-50)' },
  'About': { color: 'var(--about-500)', bg: 'var(--about-50)' },
};
const firstCrumb = breadcrumbs?.[0]?.label ?? '';
const section = sectionColorMap[firstCrumb];
const sectionColor = section?.color ?? 'var(--accent)';
const sectionBg = section?.bg ?? 'var(--background)';

const sectionFilterMap: Record<string, string> = {
  'Now':        'hue-rotate(217deg) saturate(0.85) brightness(1.75)',
  'Work':       'hue-rotate(142deg) saturate(0.75) brightness(1.95)',
  'Guest Book': 'hue-rotate(38deg)  saturate(0.9)  brightness(1.65)',
  'About':      'hue-rotate(262deg) saturate(0.85) brightness(1.25)',
};
---

<html lang="en" style={`--page-bg: ${sectionBg}; --section-color: ${sectionColor}; --icon-filter: ${iconFilter};`}>
  <!-- css in <style> uses these custom properties -->
</html>
```

**Design tokens involved:** `--now-50/500`, `--work-50/500`, `--guestbook-50/500`, `--about-50/500` (OKLCH scales in global.css). CSS filters for logo. Transitions on html element (150-300ms ease).

### Pattern 2: Viewport-Locked Layout (with Mobile Release)

**What:** Desktop (640px+) uses `height: 100dvh; overflow: hidden` to lock layout. Below 640px, switches to `height: auto; overflow-y: auto` to allow scrolling. Footer always visible, main content flex:1 fills remaining space.

**When to use:** All pages via BaseLayout.scrollable prop. Set `scrollable={true}` on pages that exceed viewport (GuestBook, potentially Blog).

**Example:**
```astro
// Source: src/layouts/BaseLayout.astro <style>
.viewport-lock {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
}

.viewport-lock.allow-scroll {
  height: auto;
  min-height: 100dvh;
  overflow-y: auto;
}

// Applied on body: class:list={['viewport-lock', { 'allow-scroll': scrollable }]}

@media (max-width: 640px) {
  // Implicitly triggers allow-scroll via width check
}
```

**Key caveat:** Must release lock below 640px to avoid content overflow on narrow devices.

### Pattern 3: Breadcrumb as Title (Section Pages)

**What:** Inner pages (Now, Work, About, Guest Book) render a minimal breadcrumb header with back arrow + section folder icon + section title (e.g., "Work"). No "jl / Work" hierarchy — just "Work". Blog posts show full path "Now › Blog Post Title".

**When to use:** All section pages pass `breadcrumbs={[{ label: 'SectionName' }]}` to BaseLayout. Blog posts pass `breadcrumbs={[{ label: 'Now', href: '/now' }, { label: 'PostTitle' }]}`.

**Example:**
```astro
// Source: src/layouts/BaseLayout.astro
{breadcrumbs && breadcrumbs.length > 0 && (
  breadcrumbs.length === 1 && !breadcrumbs[0].href ? (
    // Section page — show as title
    <nav class="section-header">
      <a href="/" class="section-back">← back</a>
      <svg class="section-folder"><!-- section folder icon --></svg>
      <h1 class="section-title">{breadcrumbs[0].label}</h1>
    </nav>
  ) : (
    // Blog post — show full breadcrumb path
    <nav class="breadcrumb">
      <a href="/" class="back-arrow">←</a>
      <a href="/" class="crumb">jl</a>
      {breadcrumbs.map((crumb) => (
        <>
          <span class="crumb-sep">›</span>
          {crumb.href ? (
            <a href={crumb.href} class="crumb">{crumb.label}</a>
          ) : (
            <span class="crumb crumb-current">{crumb.label}</span>
          )}
        </>
      ))}
    </nav>
  )
)}
```

### Pattern 4: React Islands with Hydration Control

**What:** Interactive components (ProjectCarousel, GuestBookPage) are React islands using `client:load`, `client:visible`, or `client:idle` directives. No full-page React — just islands.

**When to use:**
- `client:load` — Carousel (needs immediate interactivity), GuestBook form
- `client:visible` — Expensive components that appear below the fold
- `client:idle` — Analytics, deferred interactions

**Example:**
```astro
// src/pages/work.astro
<ProjectCarousel client:load projects={projects} />

// src/pages/guest-book.astro
<GuestBookPage client:load />
```

**Note:** ProjectCarousel has known hydration lag (deferred to Phase 2 performance work). Keep eye on LCP metrics.

### Pattern 5: Scoped Component Styles

**What:** Each Astro page and component defines `<style>` blocks. Styles are scoped to that component only, no global CSS pollution. Global tokens (colors, spacing, transitions) live in `src/styles/global.css`.

**When to use:** Always. Never use global CSS for page-specific styling.

**Example:**
```astro
// src/pages/now.astro
<style>
  .now-page {
    max-width: var(--content-max);
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  .entry-feed {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    width: 100%;
    max-width: 540px;
  }
  /* ... */
</style>
```

### Pattern 6: CSS Transitions Only (No JS Animation)

**What:** All animations use CSS `transition` property with `ease-in-out` easing. No `@keyframes` on pages using Astro's `transition:persist`. No JS animation libraries (Framer Motion, etc.). Respects `prefers-reduced-motion` always.

**When to use:** Every interaction (hovers, page transitions, status dot pulse).

**Example:**
```css
/* Good: CSS transition */
.entry-post {
  transition: transform var(--duration-base) cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow var(--duration-base) ease;
}

.entry-post:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Bad: @keyframes on transition:persist page */
/* This replays on every navigation — don't do it */
```

### Anti-Patterns to Avoid
- **Using `justify-content: center` on main content in viewport-locked layouts:** Causes titles to shift vertically when content length varies. Use `flex-start` with padding-top instead.
- **`@keyframes` on pages with `transition:persist`:** Animations replay on every navigation. Use CSS transitions only.
- **Hardcoded hex/rgba colors outside design tokens:** All colors must reference CSS custom properties (`var(--now-500)`, etc.). Enables section awareness and consistency.
- **Black shadows on elements:** Use colored shadows (`color-mix(in srgb, var(--section-color) 30%, transparent)`) to match section identity.
- **Inline styles for layout/spacing:** Use token-based CSS classes. Inline styles make responsive design harder.
- **Forgetting mobile viewport lock release:** Pages must become scrollable below 640px or content overflows on phones.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Color harmonization across sections | Custom color picker, manual RGB blending | OKLCH 5-step scales in global.css (50/100/200/500/900 per section) | OKLCH is perceptually uniform, ensures colors feel balanced at any lightness. Manual RGB leads to muddy or jarring colors. |
| Page transitions between sections | Custom state machine, JS scroll listeners | Astro ClientRouter + CSS transitions on html element (100-150ms ease) | Built-in, performant, respects prefers-reduced-motion. No extra JS. |
| Responsive font sizes | Media query breakpoints for every font | CSS `clamp()` function: `font-size: clamp(1.75rem, 1.46rem + 1.15vw, 2.5rem)` | clamp() eliminates breakpoint thrashing, scales smoothly across all viewport widths. |
| Mobile footer that doesn't overlap | Fixed positioning with z-index juggling | Flex column with `flex-shrink: 0`, main gets `flex: 1` | Flex layout prevents overlap naturally, avoids layout bugs. |
| Carousel with swipe gestures | Hand-rolled touch event handlers | Use React `useRef` + `touch` event listeners or third-party carousel lib (SwiperJS) | Complex touch math (delta calculations, velocity detection) is error-prone. Phase 2 may add library if needed. |
| Design consistency across pages | Manual spacing/color checks | Design tokens in global.css + CSS custom properties on elements | Single source of truth. Change one token, updates everywhere. Manual consistency breaks. |

**Key insight:** This codebase leverages modern CSS (custom properties, clamp, oklch, color-mix, hue-rotate) to eliminate hand-rolling. Avoid reimplementing what CSS and Astro provide out of the box.

## Common Pitfalls

### Pitfall 1: Ignoring Mobile Breakpoint Below 640px

**What goes wrong:** Content overflows, footer gets hidden, forms become untappable on 320px-480px phones.

**Why it happens:** Viewport-lock is set globally; didn't test on actual devices or forget to add `scrollable={true}` where needed.

**How to avoid:** Test every page at 320px, 375px, 480px widths. Use `scrollable={true}` on pages with form input (GuestBook) or long lists (Blog). Verify footer always visible by scrolling to bottom.

**Warning signs:** "content is cut off below the fold on my phone" — immediately suspect viewport-lock not released.

### Pitfall 2: Animated Underlines on Hover Don't Match Section Color

**What goes wrong:** Brand name underline or footer link underline stays red on Now page (should be blue).

**Why it happens:** Used hardcoded `var(--accent)` instead of `var(--section-color)` in CSS. Section color system not applied.

**How to avoid:** Search for all `::after` pseudo-elements with animated underlines. Verify they use `background: var(--section-color, var(--accent))`. Test hover on every section page.

**Warning signs:** Underline doesn't change color when navigating between sections.

### Pitfall 3: Spacing Imbalance (Top-Heavy or Bottom-Heavy Layout)

**What goes wrong:** Title takes up 20% of viewport, content squeezed into 80%. Or content too bunched at bottom with massive gap above.

**Why it happens:** Used margin-top/margin-bottom inconsistently, or forgot to use flex:1 on main.

**How to avoid:** Use design tokens consistently: `--space-xs` through `--space-2xl`. Audit spacing ratios on each page (title:content:footer should feel balanced). Use flex:1 on main element so it expands to fill available space.

**Warning signs:** Page feels cramped or has awkward empty space.

### Pitfall 4: Folder Icons Have Black Shadows Instead of Colored

**What goes wrong:** Folder shadows are black, don't match section color aesthetic.

**Why it happens:** Used default `box-shadow: 0 0 0 black` or Tailwind shadow classes.

**How to avoid:** Use `filter: drop-shadow(0 1px 3px color-mix(in srgb, var(--section-color) 30%, transparent))` on folder SVGs. Verify colors on all sections.

**Warning signs:** Shadows look "flat" or don't harmonize with section color.

### Pitfall 5: Breadcrumb Back Arrow Not Left-Aligned at Different Depths

**What goes wrong:** Back arrow shifts position based on breadcrumb text length.

**Why it happens:** Back arrow uses `position: relative` instead of `position: absolute left: var(--gutter)`.

**How to avoid:** Verify back-arrow CSS: `position: absolute; left: var(--gutter)`. Test blog post with long title to ensure arrow doesn't shift.

**Warning signs:** Arrow moves horizontally when clicking between blog posts with different title lengths.

### Pitfall 6: Carousel Hydration Lag on Work Page

**What goes wrong:** Carousel component doesn't render immediately, shows blank space or layout shift.

**Why it happens:** ProjectCarousel is complex React island; hydration is slow. Known issue flagged in CLAUDE.md.

**How to avoid:** This is a Phase 2 performance issue. For Phase 1, ensure fallback content or skeleton loads. Flag for investigation in performance phase.

**Warning signs:** "Carousel takes 2+ seconds to appear" or "layout shift when carousel hydrates".

### Pitfall 7: Mobile Carousel (Homepage Folders) Not Touchable

**What goes wrong:** Single-folder carousel below 640px doesn't respond to swipes or dots are too small.

**Why it happens:** Didn't implement touch handlers or dots are sized for desktop (too small at 320px).

**How to avoid:** Implement mobile carousel as a separate layout below 640px media query. Make dots at least 44px touch target. Test swipe on actual device or use Chrome DevTools device emulation.

**Warning signs:** Can't navigate carousel on mobile, dots invisible at 320px.

### Pitfall 8: Prose Styles (Blog) Not Applied to MDX Content

**What goes wrong:** Blog post has no margins, lists not indented, blockquotes not styled.

**Why it happens:** MDX content rendered inside `.prose` div, but prose styles missing or using wrong selectors (`:global()` forgotten).

**How to avoid:** BlogPostLayout.astro defines `.prose :global(h2)`, `.prose :global(p)`, etc. Verify all MDX block elements (headings, lists, blockquotes, code) have matching `:global()` styles. Test with a real blog post.

**Warning signs:** Blog post looks like unstyled plaintext.

## Code Examples

Verified patterns from official sources and codebase:

### Design Tokens - Colors (OKLCH Scales)

```css
/* Source: src/styles/global.css */
:root {
  /* Section color scales — OKLCH harmonized (equal L=0.70, C=0.17) */
  /* Now (blue, hue 264) */
  --now-50:  oklch(0.97 0.01 264);
  --now-100: oklch(0.93 0.04 264);
  --now-200: oklch(0.87 0.08 264);
  --now-500: oklch(0.70 0.17 264);
  --now-900: oklch(0.35 0.10 264);

  /* Work (green, hue 152) */
  --work-50:  oklch(0.97 0.01 152);
  --work-100: oklch(0.93 0.04 152);
  --work-200: oklch(0.87 0.08 152);
  --work-500: oklch(0.70 0.17 152);
  --work-900: oklch(0.35 0.10 152);

  /* Guest Book (amber, hue 80) */
  --guestbook-50:  oklch(0.97 0.01 80);
  --guestbook-100: oklch(0.93 0.04 80);
  --guestbook-200: oklch(0.87 0.08 80);
  --guestbook-500: oklch(0.70 0.17 80);
  --guestbook-900: oklch(0.35 0.10 80);

  /* About (purple, hue 295) */
  --about-50:  oklch(0.97 0.01 295);
  --about-100: oklch(0.93 0.04 295);
  --about-200: oklch(0.87 0.08 295);
  --about-500: oklch(0.70 0.17 295);
  --about-900: oklch(0.35 0.10 295);
}
```

### Responsive Font Sizing with clamp()

```css
/* Source: src/styles/global.css */
:root {
  --text-2xl: clamp(1.75rem, 1.46rem + 1.15vw, 2.5rem);
}

/* Usage in headings */
h1 { font-size: var(--text-2xl); }
```

### Section-Aware Logo Icon Filter

```astro
/* Source: src/layouts/BaseLayout.astro */
<style>
  .brand-icon {
    border-radius: 4px;
    filter: var(--icon-filter, none);
    transition: filter var(--duration-slow) ease;
  }
</style>

<!-- Inline style sets filter per section -->
<html style={`--icon-filter: ${iconFilter};`}>
```

### Animated Link Underline (Section-Aware)

```astro
/* Source: src/layouts/BaseLayout.astro */
.brand-name::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  right: 50%;
  height: 2px;
  background: var(--section-color, var(--accent));
  border-radius: 1px;
  transition: left 0.25s cubic-bezier(0.22, 1, 0.36, 1),
              right 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

.brand:hover .brand-name::after {
  left: 0;
  right: 0;
}
```

### Colored Shadows on Folder Icons

```astro
/* Source: src/layouts/BaseLayout.astro */
.section-folder {
  flex-shrink: 0;
  filter: drop-shadow(0 1px 3px color-mix(in srgb, var(--section-color) 30%, transparent));
}
```

### Now Page Entry Feed Layout

```astro
/* Source: src/pages/now.astro */
.entry-feed {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
  max-width: 540px;
}

.entry-card {
  padding: var(--space-md) var(--space-6);
  background: var(--background);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  transition: transform var(--duration-base) cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow var(--duration-base) ease;
}

.entry-post:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

### Mobile Viewport-Lock Release

```astro
/* Source: src/layouts/BaseLayout.astro */
.viewport-lock {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
}

.viewport-lock.allow-scroll {
  height: auto;
  min-height: 100dvh;
  overflow-y: auto;
}

/* Applied as: -->
<body class:list={['viewport-lock', { 'allow-scroll': scrollable }]}>
```

### BlogPostLayout Prose Styles

```astro
/* Source: src/layouts/BlogPostLayout.astro */
.prose :global(h2) {
  margin-top: var(--space-xl);
  margin-bottom: var(--space-md);
  font-weight: 600;
}

.prose :global(p) {
  margin-bottom: var(--space-md);
  line-height: 1.65;
}

.prose :global(blockquote) {
  border-left: 3px solid var(--accent);
  padding-left: var(--space-md);
  margin: var(--space-md) 0;
  color: var(--secondary);
}

.prose :global(a) {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| RGB/hex color palette per section | OKLCH perceptual color scales (5 steps per section) | 2026-03 (current session) | Ensures colors feel balanced at any lightness; enables predictable section identity |
| Media query breakpoints for every font size | CSS `clamp()` with fluid scaling | 2026-03 | Eliminates breakpoint thrashing; fonts scale smoothly across all viewport widths |
| Black shadows everywhere | Colored shadows matching section color | 2026-03 | Shadows now harmonize with section aesthetic, feels intentional not default |
| Hardcoded transition durations | CSS custom properties for timing (`--duration-fast` 150ms, `--duration-base` 200ms, `--duration-slow` 300ms) | 2026-02 | Centralized timing, consistency, easier to tune |
| viewport-lock always active | Conditional release below 640px via `.allow-scroll` class | 2026-03 | Enables mobile scrolling without layout shifts; desktop keeps smooth locked feel |
| Section colors only in backgrounds | Section color applied to logo (hue-rotate), hovers, underlines, shadows | 2026-03 | Cohesive section identity; every interaction reflects current section color |

**Deprecated/outdated:**
- Dark mode CSS — explicitly not implemented (light-only is intentional design choice)
- JS animation libraries (Framer Motion, etc.) — CSS transitions only per design philosophy
- Sidebar layout (from earlier versions) — replaced with centered column in v3
- Contact form (removed in v3) — portfolio focused, no conversion funnel

## Open Questions

1. **Homepage layout: Brand name positioning and sizing**
   - What we know: Brand name ("John Litzsinger") moves to hero position. Tagline becomes subtitle. jl logo stays top-left. Folder grid centered below.
   - What's unclear: Exact typography size/weight for hero brand name. Should it use Urbanist (brand font) or Rethink Sans (body font)? Line-height/spacing between name and tagline?
   - Recommendation: Test 2-3 typographic scales (2xl, 3xl, 4xl) with Urbanist vs Rethink Sans. Use clamp() for responsive sizing. Design decision: prioritize legibility at 320px and elegance at desktop.

2. **Mobile folder carousel implementation**
   - What we know: Below 640px, 4-folder grid becomes single-folder carousel with dots indicator + swipe.
   - What's unclear: Carousel library or custom React? Swipe velocity detection (how fast = next slide)? Dots size/spacing for mobile touch?
   - Recommendation: Implement as React component (reuse ProjectCarousel pattern). Use React's `touchmove`/`touchend` events for swipe. Dots: 44px+ touch targets, 8px gap. Test on actual devices.

3. **Breadcrumb-as-title integration for blog posts**
   - What we know: Section pages show "Now" / "Work" / "About" / "Guest Book" as title. Blog posts show "Now › Post Title" as breadcrumb path.
   - What's unclear: Does the "Now" in breadcrumb link back to /now? Or is it just visual? How does it look on mobile with long post titles?
   - Recommendation: "Now" should be clickable link to /now (facilitates navigation). On mobile (<480px), consider wrapping breadcrumb to two lines or abbreviating "Now" → "›".

4. **Design Philosophy document structure**
   - What we know: Needs two layers (universal principles + site-specific).
   - What's unclear: Markdown file? PDF? Location in repo? How detailed?
   - Recommendation: Single Markdown file at `/docs/design-philosophy.md`. Sections: Universal Principles (spacing, color, motion, typography), Site-Specific (palette, fonts, folder aesthetic, OKLCH scales). ~500 words total. Reference from CLAUDE.md.

5. **Mobile form usability (Guest Book)**
   - What we know: Guest book form + signature canvas + image upload. Must work on 320px.
   - What's unclear: Signature canvas size on mobile (should it be smaller than desktop?). Image upload button size for touch. Sticky notes readability at narrow width?
   - Recommendation: Signature canvas: max-width 100%, aspect-ratio square, cap at 200px on mobile. Upload button: 44px min height. Sticky notes: single-column layout below 480px. Test touch on iPhone SE (375px).

6. **Status dot animation timing**
   - What we know: Status dot pulses in footer. Animation exists in global.css.
   - What's unclear: Does pulse duration (2s ease-in-out infinite) feel right or too slow/fast? Should it pulse on all pages or only on homepage?
   - Recommendation: Keep as-is (2s pulse); it's subtle and doesn't distract. Test prefers-reduced-motion (should stop pulsing). Pulse on all pages (consistency).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None — no automated testing in Phase 1 (visual polish is manual verification) |
| Config file | None — no test config needed |
| Quick run command | Manual visual inspection at 320px, 480px, 768px, 1440px |
| Full suite command | Full visual regression test across all pages on all breakpoints |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Validation Method | Automated? |
|--------|----------|-----------|-------------------|-----------:|
| DESIGN-01 | Now page: layout, typography, spacing, hierarchy | Visual | Manual inspection: entry cards spacing, title prominence, font sizes at 320px/480px/1440px | ❌ Wave 0 |
| DESIGN-02 | Work page: carousel title/description positioned above cards | Visual | Manual: title/description visible at 320px, carousel cards below, not overlapping | ❌ Wave 0 |
| DESIGN-03 | About page: bio above, GIF below, properly spaced | Visual | Manual: bio readable (max-width 46ch), GIF max-width 280px on mobile, caption visible, vertical flow balanced | ❌ Wave 0 |
| DESIGN-04 | Guest Book: sticky note form, clear alignment, good spacing | Visual | Manual: form inputs 44px+ height for touch, sticky notes readable at 320px, signature canvas visible | ❌ Wave 0 |
| DESIGN-05 | Blog posts: prose styling, tag pills, metadata | Visual | Manual: h1/h2/h3 spacing per spec, tag pills styled, metadata monospace and secondary, blockquotes styled | ❌ Wave 0 |
| DESIGN-06 | 404 page: polished typography, clear navigation | Visual | Manual: 404 heading scales (3rem-6rem), "Go home" link accessible, on-brand folder metaphor text | ❌ Wave 0 |
| CHROME-01 | Top bar: brand name + icons properly spaced, responsive | Visual | Manual: desktop spacing, mobile brand name hidden at 480px, icons visible, no overflow at 320px | ❌ Wave 0 |
| CHROME-02 | Breadcrumb: monospace styling, consistent | Visual | Manual: monospace font on all pages with breadcrumb, separators visible, current page bold | ❌ Wave 0 |
| CHROME-03 | Back arrow: left-aligned regardless of depth | Visual | Manual: arrow position fixed across short/long breadcrumb paths, no horizontal shift | ❌ Wave 0 |
| CHROME-04 | Footer: status text well-formatted, animated link hover | Visual | Manual: status dot visible/pulsing, text readable, link underline animates on hover in section color | ❌ Wave 0 |
| CHROME-05 | Page transitions: smooth section color shifts | Visual | Manual: navigate between sections (Now → Work → About → Guest Book), colors transition smoothly (100-150ms), no lag | ❌ Wave 0 |
| CHROME-06 | Section color system: logo, hovers, backgrounds, underlines consistent | Visual | Manual: logo icon hue-rotates to section color, social link hovers use section color, background tints match, underlines section color | ❌ Wave 0 |
| MOBILE-01 | All pages readable 320px-480px | Visual | Manual: content not cut off, text readable, no horizontal overflow, footer visible | ❌ Wave 0 |
| MOBILE-02 | Navigation chrome adapts (brand name hide, icons) | Visual | Manual: brand name hidden <480px, X/LinkedIn icons hidden <480px, email/github visible, top bar not overflowing | ❌ Wave 0 |
| MOBILE-03 | Folder grid → carousel below 640px | Visual | Manual: 4 folders on desktop (≥640px), single carousel below 640px, dots visible, swipe gestures work | ❌ Wave 0 |
| MOBILE-04 | Carousel touchable on devices | Visual | Manual on device: swipe left/right navigates, dots clickable (44px), arrows visible (if shown) | ❌ Wave 0 |
| MOBILE-05 | Guest Book form + sticky notes adapt to narrow widths | Visual | Manual: form inputs stacked vertically, signature canvas visible at 320px, sticky notes single-column, readable text | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** Manual visual inspection on target breakpoints (320px, 480px, 1440px)
- **Per wave merge:** Full visual regression across all pages on all breakpoints (Chrome DevTools device emulation + real device testing)
- **Phase gate:** Manual visual validation across all 6 pages + 4 breakpoints before `/gsd:verify-work`

### Wave 0 Gaps

This phase is entirely visual/manual verification. No automated test infrastructure exists. Phase 2 may add:
- Visual regression testing (Percy, Chromatic, or similar)
- Accessibility testing (axe DevTools)
- Performance metrics (Lighthouse in CI)

For Phase 1, validation is manual:
- [ ] Browser DevTools: Test all pages at 320px, 480px, 768px, 1440px viewports
- [ ] Real device testing: iPhone SE (375px), iPhone 15 Pro (390px), desktop/tablet
- [ ] Responsive design checklist: font sizes, touch targets, spacing consistency
- [ ] Color consistency checklist: section colors applied to logo, hovers, backgrounds, underlines on all pages
- [ ] Animation checklist: transitions smooth, no lag, prefers-reduced-motion respected

*(No code tests needed for Phase 1. Focus on pixel-perfect visual polish.)*

## Sources

### Primary (HIGH confidence)
- **Astro official docs** — Framework APIs, integrations, transitions, islands architecture
- **CSS official specs** — OKLCH color model, clamp(), color-mix(), filter: drop-shadow(), transition property
- **Project codebase** — All patterns, tokens, components documented in source files (global.css, BaseLayout.astro, individual page files)

### Secondary (MEDIUM confidence)
- **CONTEXT.md** — User decisions locked in Phase 1 scope (design philosophy, mobile strategy, chrome requirements)
- **REQUIREMENTS.md** — Phase 1 requirements traced to success criteria (17 requirements: DESIGN-01-06, CHROME-01-06, MOBILE-01-05)
- **STATE.md** — Project architecture, dependencies, known issues (carousel hydration lag)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — All libraries currently in use, versions pinned in package.json, no speculation
- Architecture: HIGH — All patterns documented in codebase with working examples, section color system proven
- Pitfalls: MEDIUM — Based on codebase design and CLAUDE.md learnings; some edge cases may surface during implementation
- Mobile strategy: MEDIUM — 640px breakpoint for carousel is design decision; exact swipe implementation TBD
- Validation: MEDIUM — No automated test infrastructure; manual visual verification is the plan

**Research date:** 2026-03-11
**Valid until:** 2026-03-20 (9 days — visual design may shift during implementation)

**Key assumptions:**
- Project images for Work carousel will be sourced separately (deferred, not blocking Phase 1)
- Homepage brand name positioning/typography will be finalized via design iterations
- Mobile carousel will use React (reuse ProjectCarousel pattern)
- All spacing/color decisions use existing tokens (no new tokens added in Phase 1)
