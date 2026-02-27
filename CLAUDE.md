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
- **Font:** Inter (variable weight) self-hosted via `@fontsource-variable/inter`

### Key files

- `astro.config.mjs` — Astro configuration (site URL, integrations, Vercel adapter)
- `src/content.config.ts` — Blog collection schema (title, description, pubDate, tags, draft, heroImage)
- `src/layouts/BaseLayout.astro` — HTML shell used by all pages (includes BaseHead SEO, Header, Footer, ClientRouter)
- `src/layouts/BlogPostLayout.astro` — Blog post wrapper with prose styling
- `src/pages/index.astro` — Landing page (imports Hero, About, Experience, Skills, Contact components)
- `src/pages/blog/[...slug].astro` — Dynamic blog post route

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
