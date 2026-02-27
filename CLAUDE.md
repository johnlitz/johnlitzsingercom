# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website for John Litzsinger at johnlitzsinger.com. Blog + portfolio hybrid built with Astro 5, MDX, React, deployed on Vercel.

## Commands

```bash
npm run dev       # Start dev server (localhost:4321)
npm run build     # Production build (outputs to .vercel/output/)
npm run preview   # Preview production build locally
```

**Node 24 workaround:** The npm scripts include `polyfill-url.cjs` via `--require` to work around a Rollup/Astro compatibility issue with `URL.canParse` and `Headers.getSetCookie`. This polyfill can be removed once Astro officially supports Node 24. On Vercel (which uses Node 20), it's harmless.

## Architecture

- **Framework:** Astro 5 (static output) with `@astrojs/mdx`, `@astrojs/react`, `@astrojs/sitemap`, `@astrojs/vercel`
- **Content:** Blog posts are MDX files in `src/content/blog/`. Content Collections with Zod schema defined in `src/content.config.ts`
- **Interactive islands:** React components in `src/components/react/` can be used inside MDX posts with `client:visible` or `client:idle` directives
- **Styling:** Scoped Astro `<style>` tags per component + CSS custom properties in `src/styles/global.css`. No CSS framework. Dark mode via `prefers-color-scheme`
- **Font:** Rethink Sans (variable weight 400-800) self-hosted as WOFF2

### Key files

- `astro.config.mjs` — Astro configuration (site URL, integrations, Vercel adapter)
- `src/content.config.ts` — Blog collection schema (title, description, pubDate, tags, draft, heroImage)
- `src/layouts/BaseLayout.astro` — HTML shell: two-column grid with persistent sidebar (LeftColumn via `transition:persist`), MobileHeader, BaseHead SEO, ClientRouter
- `src/layouts/BlogPostLayout.astro` — Blog post wrapper with prose styling, prev/next navigation
- `src/pages/index.astro` — Landing page with numbered highlight cards linking to Work/Projects/Writing/Contact
- `src/pages/blog/[...slug].astro` — Dynamic blog post route with prev/next navigation
- `src/pages/work.astro`, `projects.astro`, `contact.astro` — Inner content pages
- `src/pages/404.astro`, `contact/thanks.astro` — Error and confirmation pages
- `src/data/nav.ts` — Navigation menu items (numbered: 01 Work, 02 Projects, etc.)
- `src/styles/global.css` — Design tokens (colors, type scale, spacing), @font-face, reset, global element styles

### Key components

- `src/components/LeftColumn.astro` — Persistent sidebar (identity, nav, social icons)
- `src/components/MobileHeader.astro` — Collapsible pyramid nav for mobile
- `src/components/ReadingProgress.astro` — Scroll-driven reading progress bar on blog posts
- `src/components/BaseHead.astro` — SEO meta tags, OG/Twitter cards, fonts

### Sidebar (LeftColumn)

- Persists across view transitions via `transition:persist="sidebar"` on `BaseLayout.astro`
- Three layers: identity (name+icon+tagline) at top, numbered nav with left accent-bar active state in middle, social icons at bottom
- Nav hidden on homepage via CSS `:global(body[data-page="home"]) .sidebar-nav { display: none }` — nav must always be in DOM for persistence
- `body[data-page]` attribute set server-side and updated client-side in `astro:after-swap` handler
- `MobileHeader.astro` handles navigation on mobile (<=768px) independently

### Adding a blog post

Create a new `.mdx` file in `src/content/blog/` with this frontmatter:

```yaml
---
title: 'Post Title'
description: 'Brief description for SEO and card preview'
pubDate: 2026-02-14
tags: ['finance', 'technology']
draft: false
---
```

Posts with `draft: true` are excluded from production builds. To use a React component in a post, import it and add a `client:` directive (e.g., `<Chart client:visible />`).

## Design Context

### Users
Primarily for personal creative satisfaction. Secondary audiences: recruiters/hiring managers and peers/collaborators in tech and finance. The site should feel like a personal artifact the creator is proud of, not a tool optimized for conversion.

### Brand Personality
Bold, Minimal, Direct. No fluff, no apologies — the work speaks for itself.

### Aesthetic Direction
- **Visual tone:** Brutalist-minimal with editorial sensibility. Typography-driven hierarchy using weight and size, not decoration
- **Typeface:** Rethink Sans (variable, 400-800). Geometric humanist sans-serif. Weight variation creates hierarchy (Regular body, Medium nav, SemiBold headings, Bold display)
- **Color:** Achromatic palette + vivid brand red matching icon.png. Both dark and light modes equally polished
- **Color tokens:** Dark: accent `#ef0000`, bg `#0a0a0a`, surface `#141414`. Light: accent `#d80000`, bg `#fafafa`, surface `#f0f0f0`
- **References:** remix-star-expand.figma.site (Rethink Sans typography, size contrast, generous spacing), Kent Gigger (minimalism, formatting discipline)
- **Anti-references:** Cluttered portfolios, excessive decoration, gradients/shadows, too many words

### Design Principles
1. **Subtract, don't add** — Every element must earn its place. When in doubt, remove.
2. **Weight over decoration** — Use font weight and size for hierarchy, not colors, borders, or backgrounds.
3. **Red means something** — The accent red is reserved for: active states, interactive affordances, and brand identity. Never decorative.
4. **Generous space is confidence** — Whitespace signals that the content doesn't need to compete for attention.
5. **Both modes matter** — Dark and light modes are first-class citizens, not an afterthought.

## Notes

- `public/icon.png` is force-added to git despite `*.png` in `.gitignore`
- Font files in `public/fonts/` — `RethinkSans-Variable.woff2` (upright) and `RethinkSans-Italic-Variable.woff2` (italic)
