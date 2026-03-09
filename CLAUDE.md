# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website for John Litzsinger at johnlitzsinger.com. Portfolio + blog built with Astro 5, MDX, React, deployed on Vercel.

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
- **Styling:** Scoped Astro `<style>` tags per component + CSS custom properties in `src/styles/global.css`. No CSS framework. Dark/light via `prefers-color-scheme`
- **Layout:** Single centered column (max-width 720px) with top bar. No sidebar, no hamburger menu
- **Fonts:** Rethink Sans (variable weight 400-800) for all text + system monospace for folder nav accent. Self-hosted as WOFF2

### Key files

- `astro.config.mjs` — Astro configuration (site URL, integrations, Vercel adapter)
- `src/content.config.ts` — Blog collection schema (title, description, pubDate, tags, draft, heroImage)
- `src/layouts/BaseLayout.astro` — HTML shell: top bar (logo + social icons), centered main content, BaseHead SEO, ClientRouter view transitions
- `src/layouts/BlogPostLayout.astro` — Blog post wrapper with prose styling, prev/next navigation
- `src/pages/index.astro` — Homepage with tagline, monospace folder nav (Work, bLitz Feed), project grid
- `src/pages/work.astro` — Project grid listing (same cards as homepage)
- `src/pages/work/[slug].astro` — Individual project detail pages
- `src/pages/blitz-feed.astro` — Two-column feed: blog posts (left) + social feed stub (right)
- `src/pages/blog/[...slug].astro` — Dynamic blog post route with prev/next navigation
- `src/pages/blog/index.astro` — Redirects to `/blitz-feed`
- `src/pages/404.astro` — Error page with link home
- `src/data/projects.ts` — Project data (slug, title, description, tech, links)
- `src/styles/global.css` — Design tokens (colors, type scale, spacing), @font-face, reset, global element styles

### Key components

- `src/components/BaseHead.astro` — SEO meta tags, OG/Twitter cards, font preloading

### Navigation

- **Top bar (all pages):** jl logo + "John Litzsinger" left, social icon links (Email, X, LinkedIn, GitHub, Reddit, HN) right
- **Folder nav (homepage only):** Monospace-styled folder icons linking to Work and bLitz Feed
- **No sidebar.** No hamburger menu. No numbered nav items
- Mobile: top bar stays as-is, brand name hides below 480px

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

### Adding a project

Add an entry to `src/data/projects.ts`:

```ts
{
  slug: 'project-slug',
  title: 'Project Title',
  description: 'Brief description.',
  tech: ['Astro', 'React'],
  links: [{ label: 'GitHub', url: 'https://...' }],
}
```

This automatically creates a `/work/project-slug` detail page and adds the project to the homepage and `/work` grids.

## Design Context

### Users
Primarily for personal creative satisfaction. Secondary audiences: recruiters/hiring managers and peers/collaborators in tech and finance. The site should feel like a personal artifact the creator is proud of, not a tool optimized for conversion.

### Brand Personality
Bold, Minimal, Direct. No fluff, no apologies — the work speaks for itself.

### Aesthetic Direction
- **Visual tone:** Minimal single-column layout inspired by vladsavruk.com, pucek.capital, walzr.com. Content first, no chrome
- **Typeface:** Rethink Sans (variable, 400-800) for everything + system monospace for folder nav labels
- **Color:** Near-monochrome + one red accent from the jl logo. Both dark and light modes equally polished
- **Personality element:** Monospace folder navigation on homepage — the Linux folder aesthetic is the distinctive touch
- **References:** vladsavruk.com (centered column, project gallery), pucek.capital (bold one-liner, scannable grid), walzr.com (name up top, project grid, single font), janina.works (folder icons for nav)
- **Anti-references:** Cluttered portfolios, excessive decoration, gradients/shadows, too many words

### Color Tokens

| Token | Dark mode | Light mode |
|-------|-----------|------------|
| Background | `#0a0a0a` | `#ffffff` |
| Surface | `#141414` | `#f5f5f5` |
| Foreground | `#e8e8e8` | `#1a1a1a` |
| Muted | `#999999` | `#666666` |
| Accent | `#ef0000` | `#d80000` |

### Design Principles
1. **Single column, centered** — max-width 720px, generous vertical spacing
2. **Content first** — no chrome, no decoration, content speaks
3. **One font, one color** — sans-serif + red accent, that's it
4. **Folder nav is the personality** — monospace Linux folders are the distinctive element
5. **Both modes are first-class** — light and dark equally polished

## Notes

- `public/icon.png` is force-added to git despite `*.png` in `.gitignore`
- Font files in `public/fonts/` — `RethinkSans-Variable.woff2` (upright) and `RethinkSans-Italic-Variable.woff2` (italic)
- Social link URLs for X, Reddit, and HN are placeholder platform roots — update with actual profile URLs when available
