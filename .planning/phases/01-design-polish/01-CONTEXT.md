# Phase 1: Design Polish - Context

**Gathered:** 2026-03-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Visual and layout refinements across all pages (Now, Work, About, Guest Book, Blog, 404), chrome components (top bar, breadcrumb, footer, transitions, section colors), and mobile responsiveness. 17 requirements: DESIGN-01-06, CHROME-01-06, MOBILE-01-05.

This phase does NOT include performance optimization (Phase 2), Guest Book backend (Phase 3), or shipping (Phase 4).

</domain>

<decisions>
## Implementation Decisions

### Design Philosophy
- **Core feeling:** Sharp craft — every pixel intentional, obsessive attention to detail. The site itself IS the portfolio
- **Whitespace:** Generous and deliberate — every element earns its space. But with strategic bursts of "life" and color (think Apple iPod commercials: bold minimal silhouettes with bright color)
- **Color life:** Context-dependent — sometimes color comes through interactions/hovers, sometimes section identity, sometimes accent moments, sometimes typography. Not always all at once; varies by context
- **Motion philosophy:** Statement moments — most things quiet, key interactions (folder hovers, page transitions) are intentional and memorable. Everything else is still
- **Polish bar:** Pixel-perfect obsession — multiple rounds until it feels flawless
- **Page personality:** Shared bones, unique accents — same structural layout but each page gets subtle personality through its section color

### Design Philosophy File
- Create a portable design philosophy document with two layers:
  1. **Universal principles** (transferable to any project): spacing logic, typography ratios, color philosophy, motion principles, craft standards
  2. **Site-specific decisions** (this project): warm cream palette, folder icons, section colors, OKLCH scales, Rethink Sans + Urbanist

### Homepage Layout Change
- **Brand name ("John Litzsinger")** moves from top bar to homepage hero position (where the tagline currently sits)
- **Tagline** ("Finance & CS @ Purdue...") becomes subtitle below the name — two-line introduction
- **jl logo** stays top-left but slightly larger
- **Folder grid** remains below name+tagline, centered as group
- Social icons remain in top-right

### Inner Page Spacing & Hierarchy
- **Title prominence:** Present but understated — orients you, then gets out of the way. Content is the star
- **Vertical rhythm:** Even spacing throughout with focus on BALANCE — not top-heavy or bottom-heavy. All pages should flow with the same organizational feel
- **Now page:** Ultra-minimal title + date table of contents. No excerpts, no cards. Just a clean list of titles and dates. Click to read
- **About page:** Bio text above, Calvin & Hobbes GIF below. Sequential top-to-bottom flow

### Chrome
- **Top bar:** Grounding presence — clearly there, sets the frame, but doesn't demand attention. Like a gallery wall label
- **Section transitions:** Quick ease (100-150ms) — fast enough to feel instant, slow enough to feel intentional. ease-in-out easing, zero lag
- **Footer:** Always visible on every page. Content: current activity/building + open to opportunities at startups
- **Breadcrumb:** Integrated into the page title itself — no "jl /" prefix. Just the section name and page name as the title (e.g., "Work / Project Name")
- **Easing:** ease-in-out for all animations, lean and extremely fast durations

### Mobile Layout
- **Scrolling:** Allow scrolling on mobile (release viewport-lock below desktop breakpoint)
- **Homepage folders:** Become a single-folder carousel below 640px with dots indicator + swipe gestures (no arrows)
- **All pages:** Must render correctly on 320px-480px viewports

### Folder Icons
- **Hover animation:** Keep all current effects (lift, scale, tab open, color glow) — folders are THE statement moment
- **Labels:** Always visible below icons
- **Size:** Current size is good
- **Shadows:** Colored shadows ONLY — NO black shadows. Each folder's shadow matches its section color

### Content Strategy
- **Work carousel cards:** Title + thumbnail + description + tech (brief tech touch — focus on the creation and the story behind it). Requires project images
- **About page bio:** Personality first — interests, values, what excites. Professional details are secondary (work page handles that)
- **Footer status:** Current activity/building + open to opportunities at startups
- **404 page:** On-brand with folder metaphor ("This folder is empty" or similar). Tie error state back to the site's visual identity

### Typography
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

</decisions>

<specifics>
## Specific Ideas

- "Think Apple iPod commercials — bold, minimal black silhouettes with bright colors" for the whitespace + color burst approach
- Now page should feel like a "table of contents" — ultra-minimal
- 404 page should use the folder metaphor to stay on-brand
- Folder hover is THE statement moment of the site — keep it dramatic
- "The site itself IS the portfolio" — craft of the site proves the craft of the person
- References from CLAUDE.md still apply: vladsavruk.com (centered column), pucek.capital (bold one-liner), walzr.com (name up top, single font), janina.works (folder icons)
- Anti-references: cluttered portfolios, excessive decoration, gradients/shadows, too many words, laggy animations

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `global.css` OKLCH 5-step color scales per section (50/100/200/500/900): Can drive section-specific accents and colored shadows
- `BaseLayout.astro` section color system (`sectionColorMap`, `--section-color`, `--icon-filter`, `--page-bg`): Already handles section awareness
- `ProjectCarousel.tsx`: Existing carousel pattern with arrows, dots, peek cards — can inform mobile folder carousel
- Design token system: Spacing (`--space-*`), type scale (`--text-*`), transitions (`--duration-*`), shadows (`--shadow-*`)
- Folder icon SVGs in `index.astro`: Already have hover animations (lift, scale, tab open, glow)

### Established Patterns
- Viewport-locked layout: `height: 100dvh; overflow: hidden` on body — will need conditional release on mobile
- Scoped Astro `<style>` per page: Design polish happens in individual page files, not just global.css
- React islands: `client:load`, `client:visible`, `client:idle` for interactive components
- CSS transitions only: No JS animation loops allowed

### Integration Points
- `BaseLayout.astro` breadcrumb system: Will need refactoring to integrate breadcrumb into page title
- `index.astro` homepage layout: Name+tagline swap, folder grid positioning
- `status.ts`: Footer status content — may need update for "open to opportunities" addition
- Mobile breakpoints: Currently in BaseLayout.astro — will need new 640px breakpoint for folder carousel

</code_context>

<deferred>
## Deferred Ideas

- Project thumbnail images for carousel cards — need to source/create images (may need Phase 2 or separate task)
- Dark mode — explicitly out of scope (light-only is deliberate)
- Admin dashboard for Guest Book — Phase 3 / v2

</deferred>

---

*Phase: 01-design-polish*
*Context gathered: 2026-03-11*
