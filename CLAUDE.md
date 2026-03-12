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
- **Styling:** Scoped Astro `<style>` tags per component + CSS custom properties in `src/styles/global.css`. No CSS framework. Light-only warm cream palette
- **Layout:** Viewport-locked (100dvh, overflow hidden, no scrolling). Single centered column (max-width 720px). Top bar, breadcrumb nav on inner pages, footer. Titles in upper portion, not vertically centered. Section-aware colors: logo icon, social link hovers, and brand underline all match the current section's folder color
- **Fonts:** Rethink Sans (variable 400-800) for body text, Urbanist (variable 100-900) for brand name only, system monospace for breadcrumbs/metadata. All self-hosted as WOFF2

### Key files

- `astro.config.mjs` — Astro configuration (site URL, integrations, Vercel adapter)
- `src/content.config.ts` — Blog collection schema (title, description, pubDate, tags, draft, heroImage)
- `src/layouts/BaseLayout.astro` — HTML shell: top bar (Urbanist brand + social icons), breadcrumb nav, centered main content, footer, BaseHead SEO, ClientRouter view transitions
- `src/layouts/BlogPostLayout.astro` — Blog post wrapper with prose styling, prev/next navigation, breadcrumb
- `src/pages/index.astro` — Homepage with tagline + 4 macOS-style colored folder icons (Now, Work, Guest Book, About) vertically centered as a group via `justify-content: center`
- `src/pages/work.astro` — Project carousel with title/description above cards, arrows, tech pills, dots
- `src/pages/work/[slug].astro` — Individual project detail pages with breadcrumb
- `src/pages/now.astro` — Now page: blog feed with entry cards (posts + status updates), replaces old blitz-feed
- `src/pages/about.astro` — About page with bio, Calvin and Hobbes GIF, caption
- `src/pages/guest-book.astro` — Guest book page with signature canvas, image upload, paginated entries (Supabase backend, not yet configured)
- `src/pages/blog/[...slug].astro` — Dynamic blog post route with prev/next navigation
- `src/pages/blog/index.astro` — Redirects to `/now`
- `src/pages/404.astro` — Error page with breadcrumb and link home
- `src/data/projects.ts` — Project data (slug, title, description, tech, links)
- `src/styles/global.css` — Design tokens (colors, type scale, spacing, folder colors), @font-face declarations, reset, global element styles
- `src/components/react/GuestBookPage.tsx` — React island: guest book form with signature canvas, image upload/compression, paginated entries
- `src/components/react/ProjectCarousel.tsx` — React island: project carousel with peek cards, arrows, title/description above cards

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
- **Visual tone:** macOS file-browser aesthetic with colored folder icons as homepage centerpiece. Warm, inviting, alive — not sterile
- **Typeface:** Rethink Sans (variable, 400-800) for body, Urbanist (variable, 100-900) for brand name, system monospace for breadcrumbs/metadata
- **Color:** Warm cream background (`#faf8f5`) + red accent from jl logo + 4 section folder colors (blue, green, amber, purple). Light-only — no dark mode. Each section tints its background subtly
- **Section-aware chrome:** Logo icon shifts to section color via CSS hue-rotate filter. Social link hovers and brand underline animation match section color. Homepage defaults to red accent
- **Personality elements:** macOS-style colored folder icons with hover animations (lift, scale, tab open, color glow). Brand underline animates from center outward on hover. Smooth background color transitions between sections
- **References:** vladsavruk.com (centered column), pucek.capital (bold one-liner), walzr.com (name up top, single font), janina.works (folder icons)
- **Anti-references:** Cluttered portfolios, excessive decoration, gradients/shadows, too many words, laggy animations

### Color Tokens

| Token | Value |
|-------|-------|
| Background | `#faf8f5` (warm cream) |
| Surface | `#f0ede8` |
| Foreground | `#1a1a1a` |
| Muted | `#666666` |
| Accent | `#d80000` (red, logo color) |

### Folder / Section Colors

| Folder | Color | Section BG |
|--------|-------|------------|
| Now | `#3B82F6` (blue) | `#f0f4fa` |
| Work | `#22C55E` (green) | `#f0f7f2` |
| Guest Book | `#F59E0B` (amber) | `#faf5ed` |
| About | `#8B5CF6` (purple) | `#f4f0fa` |

### Design Principles
1. **Viewport-locked, no scrolling** — everything fits within a single desktop viewport (`100dvh`, `overflow: hidden`)
2. **Content first** — no chrome, no decoration, content speaks
3. **Folders are the personality** — macOS-style colored folder icons are the distinctive element
4. **Section-aware** — the site adapts its chrome (logo, hovers, backgrounds) to the current section's color
5. **Alive but fast** — subtle animations and micro-interactions that never cause lag. CSS transitions only, no JS animation loops
6. **Titles in upper portion (inner pages)** — inner page titles sit in the upper ~20% of the viewport, not dead-center. Content flows from there. Exception: the homepage centers tagline + folders as a group using `justify-content: center` on `.home`

## Notes

- `public/icon.png` is force-added to git despite `*.png` in `.gitignore`
- Font files in `public/fonts/` — `RethinkSans-Variable.woff2`, `RethinkSans-Italic-Variable.woff2`, `Urbanist-Variable.woff2`
- Social link URL for X is placeholder platform root — update with actual profile URL when available
- Guest Book requires `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` env vars. Without them, shows "coming soon" fallback
- **Homepage centering gotcha:** Don't use `margin-top: auto` on `.folder-grid` — it centers folders in remaining space *below* the tagline, not in the viewport. Use `justify-content: center` on `.home` so tagline+folders center as a group
