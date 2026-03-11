# johnlitzsinger.com — Site Refresh

## What This Is

Personal portfolio website for John Litzsinger — a viewport-locked, macOS-folder-inspired site built with Astro 5 and React islands. Currently in a v3 redesign on `feat/site-refresh-light-only` that needs to be polished, performance-tuned, and shipped to production.

## Core Value

The site must feel like a personal artifact the creator is proud of — visually distinctive, buttery smooth, and zero lag. Design quality is non-negotiable.

## Requirements

### Validated

<!-- Shipped and confirmed working in current codebase -->

- ✓ Homepage with tagline + 4 macOS-style colored folder icons — existing
- ✓ Viewport-locked layout (100dvh, no scrolling) with centered column — existing
- ✓ Section-aware chrome (logo hue-rotate, social hover colors, background tints) — existing
- ✓ Now page with blog feed (posts + status updates) — existing
- ✓ Work page with project carousel (peek cards, arrows, dots) — existing
- ✓ Individual project detail pages (`/work/[slug]`) — existing
- ✓ About page with bio and Calvin & Hobbes GIF — existing
- ✓ Guest Book page with sticky note UI, signature canvas, image upload — existing (frontend only)
- ✓ Blog posts via MDX Content Collections with tags, draft support — existing
- ✓ Self-hosted WOFF2 fonts (Rethink Sans + Urbanist) — existing
- ✓ OKLCH color system with harmonized 5-step scales — existing
- ✓ Vercel deployment with static output — existing
- ✓ SEO meta tags, OG/Twitter cards, sitemap, RSS — existing
- ✓ View transitions via ClientRouter — existing

### Active

<!-- Current scope — what needs to happen before merge to master -->

- [ ] Design polish across all pages (homepage, inner pages, chrome, mobile)
- [ ] Performance optimization (React hydration, carousel lag, initial load)
- [ ] Code cleanup (dead code, duplicate styles, design system alignment)
- [ ] Guest Book Supabase backend (fully functional end-to-end)
- [ ] Mobile responsive refinement (all pages feel right on phones/tablets)
- [ ] Commit outstanding changes, merge to master, deploy to production

### Out of Scope

- Dark mode — light-only is a deliberate aesthetic choice
- Blog CMS or admin panel — MDX files are the content system
- Contact form — removed in v3 redesign
- Sidebar layout — replaced by centered column in v3
- JS animation libraries — CSS transitions only, by design principle

## Context

- Branch `feat/site-refresh-light-only` has 6 uncommitted design fixes from last session (back arrow, folder shadows, footer status, tag pills, signature canvas)
- Last commit `d6a3aed` on Mar 10 added OKLCH colors, sticky note guest book, status indicator, homepage centering
- The owner will be extremely picky about design and will likely change their mind — phases must be iterative with feedback loops
- Carousel (ProjectCarousel.tsx) has noticeable hydration lag that needs investigation
- Guest Book needs `PUBLIC_SUPABASE_URL` + `PUBLIC_SUPABASE_ANON_KEY` env vars configured

## Constraints

- **Tech stack**: Astro 5 + React islands, no framework changes
- **Styling**: Scoped Astro `<style>` + CSS custom properties in global.css, no CSS framework
- **Animation**: CSS transitions only, no JS animation loops
- **Layout**: Viewport-locked (100dvh, overflow hidden), single centered column (max-width 720px)
- **Fonts**: Rethink Sans (body), Urbanist (brand name only), system mono (breadcrumbs/metadata)
- **Color**: Light-only warm cream palette, OKLCH section colors
- **Deployment**: Vercel with static output, Node 20 in production
- **Design iteration**: Owner is highly opinionated — expect multiple rounds of feedback per visual change

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Viewport-locked layout | Creates distinctive feel, forces content discipline | ✓ Good |
| macOS folder icons as homepage nav | Distinctive personality element, memorable | ✓ Good |
| Light-only, no dark mode | Deliberate warm aesthetic choice | ✓ Good |
| OKLCH color system | Better perceptual uniformity than hex | ✓ Good |
| React islands (not full React) | Minimal JS shipped, only interactive components hydrated | ✓ Good |
| Sticky note guest book UI | Playful, memorable, fits personality | — Pending (needs Supabase) |
| CSS transitions only | Performance guarantee, no animation jank | ✓ Good |

---
*Last updated: 2026-03-11 after initialization*
