# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website for John Litzsinger at johnlitzsinger.com. Portfolio + blog + guest book built with Astro 5, MDX, React, deployed on Vercel.

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
- **Interactive islands:** React components in `src/components/react/` (e.g., GuestBook) hydrated with `client:load`, `client:visible`, or `client:idle`
- **Styling:** Scoped Astro `<style>` tags per component + CSS custom properties in `src/styles/global.css`. No CSS framework. Dark/light via `prefers-color-scheme`
- **Layout:** Single centered column (max-width 720px) with top bar, breadcrumb nav on inner pages, footer. No sidebar, no hamburger menu
- **Fonts:** Rethink Sans (variable 400-800) for body text, Urbanist (variable 100-900) for brand name only, system monospace for breadcrumbs/metadata. All self-hosted as WOFF2

### Key files

- `astro.config.mjs` — Astro configuration (site URL, integrations, Vercel adapter)
- `src/content.config.ts` — Blog collection schema (title, description, pubDate, tags, draft, heroImage)
- `src/layouts/BaseLayout.astro` — HTML shell: top bar (Urbanist brand + social icons), breadcrumb nav, centered main content, footer, BaseHead SEO, ClientRouter view transitions
- `src/layouts/BlogPostLayout.astro` — Blog post wrapper with prose styling, prev/next navigation, breadcrumb
- `src/pages/index.astro` — Homepage with tagline + 4 macOS-style colored folder icons (Work, Feed, Guest Book, About)
- `src/pages/work.astro` — File-listing table of projects with breadcrumb
- `src/pages/work/[slug].astro` — Individual project detail pages with breadcrumb
- `src/pages/blitz-feed.astro` — Blog feed with monospace dates, tags metadata, breadcrumb
- `src/pages/about.astro` — About page with Urbanist name, quip, spec-sheet stats, connect links
- `src/pages/guest-book.astro` — Guest book page with React form (Supabase backend, not yet configured)
- `src/pages/blog/[...slug].astro` — Dynamic blog post route with prev/next navigation
- `src/pages/blog/index.astro` — Redirects to `/blitz-feed`
- `src/pages/404.astro` — Error page with breadcrumb and link home
- `src/data/projects.ts` — Project data (slug, title, description, tech, links)
- `src/styles/global.css` — Design tokens (colors, type scale, spacing, folder colors), @font-face declarations, reset, global element styles
- `src/components/react/GuestBook.tsx` — React island for guest book form + entries (Supabase REST API)

### Key components

- `src/components/BaseHead.astro` — SEO meta tags, OG/Twitter cards, font preloading (Rethink Sans + Urbanist)

### Navigation

- **Top bar (all pages):** jl logo + "John Litzsinger" (Urbanist font) left, social icon links (Email, X, LinkedIn, GitHub) right
- **Breadcrumb (inner pages):** Monospace `jl / Section / Page` path navigation below top bar
- **Folder nav (homepage only):** 4 large macOS-style colored folder icons (Work, Feed, Guest Book, About) with hover animations
- **Footer (all pages):** Copyright + "Built with Astro"
- **No sidebar.** No hamburger menu
- Mobile: brand name hides below 480px, X/LinkedIn icons hide on small screens (Email + GitHub remain)

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

This automatically creates a `/work/project-slug` detail page and adds the project to the `/work` file listing.

## Design Context

### Users
Primarily for personal creative satisfaction. Secondary audiences: recruiters/hiring managers and peers/collaborators in tech and finance. The site should feel like a personal artifact the creator is proud of, not a tool optimized for conversion.

### Brand Personality
Bold, Minimal, Direct. No fluff, no apologies — the work speaks for itself.

### Aesthetic Direction
- **Visual tone:** macOS file-browser aesthetic with colored folder icons as homepage centerpiece. Content first, no chrome
- **Typeface:** Rethink Sans (variable, 400-800) for body, Urbanist (variable, 100-900) for brand name, system monospace for breadcrumbs/metadata
- **Color:** Near-monochrome + one red accent from the jl logo + 4 folder colors (blue, green, amber, purple). Both dark and light modes equally polished
- **Personality element:** macOS-style colored folder icons on homepage with hover animations (lift, scale, tab open, color glow)
- **References:** vladsavruk.com (centered column), pucek.capital (bold one-liner), walzr.com (name up top, single font), janina.works (folder icons)
- **Anti-references:** Cluttered portfolios, excessive decoration, gradients/shadows, too many words

### Color Tokens

| Token | Dark mode | Light mode |
|-------|-----------|------------|
| Background | `#0a0a0a` | `#ffffff` |
| Surface | `#141414` | `#f5f5f5` |
| Foreground | `#e8e8e8` | `#1a1a1a` |
| Muted | `#999999` | `#666666` |
| Accent | `#ef0000` | `#d80000` |

### Folder Colors

| Folder | Color |
|--------|-------|
| Work | `#3B82F6` (blue) |
| Feed | `#22C55E` (green) |
| Guest Book | `#F59E0B` (amber) |
| About | `#8B5CF6` (purple) |

### Design Principles
1. **Single column, centered** — max-width 720px, generous vertical spacing
2. **Content first** — no chrome, no decoration, content speaks
3. **Folders are the personality** — macOS-style colored folder icons are the distinctive element
4. **File-browser aesthetic** — breadcrumbs, file listings, monospace metadata
5. **Both modes are first-class** — light and dark equally polished

## Notes

- `public/icon.png` is force-added to git despite `*.png` in `.gitignore`
- Font files in `public/fonts/` — `RethinkSans-Variable.woff2`, `RethinkSans-Italic-Variable.woff2`, `Urbanist-Variable.woff2`
- Social link URL for X is placeholder platform root — update with actual profile URL when available
- Guest Book requires `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` env vars. Without them, shows "coming soon" fallback
