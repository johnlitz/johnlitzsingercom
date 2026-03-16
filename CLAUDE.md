# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website for John Litzsinger at johnlitzsinger.com. Portfolio site built with Astro 5, deployed on Vercel. "The Document" aesthetic — minimal, viewport-locked, warm cream + single red accent.

## Commands

```bash
npm run dev       # Start dev server (localhost:4321)
npm run build     # Production build (outputs to .vercel/output/)
npm run preview   # Preview production build locally
```

**Node 24 workaround:** The npm scripts include `polyfill-url.cjs` via `--require` to work around a Rollup/Astro compatibility issue with `URL.canParse` and `Headers.getSetCookie`. This polyfill can be removed once Astro officially supports Node 24. On Vercel (which uses Node 20), it's harmless.

## Architecture

- **Framework:** Astro 5 (static output) with `@astrojs/mdx`, `@astrojs/react`, `@astrojs/sitemap`, `@astrojs/vercel`
- **Content:** Blog posts (future) are MDX files in `src/content/blog/`. Content Collections with Zod schema defined in `src/content.config.ts`
- **Styling:** Scoped Astro `<style>` tags per component + CSS custom properties in `src/styles/global.css`. No CSS framework. Light-only warm cream palette. System font stack only — no web fonts.
- **Layout:** Viewport-locked (`100dvh`, `overflow: hidden`, no scrolling). Single centered column (`max-width: 40rem`). Homepage: full viewport centering, no chrome. Inner pages: minimal top bar (`jl` mark left, page links right).

### Key files

- `astro.config.mjs` — Astro configuration (site URL, integrations, Vercel adapter)
- `src/content.config.ts` — Blog collection schema (title, description, pubDate, tags, draft, heroImage)
- `src/layouts/BaseLayout.astro` — HTML shell with two modes: homepage (no nav, centered) and inner pages (top bar with `jl` + nav links). Viewport-locked frame.
- `src/pages/index.astro` — Homepage: "John Litzsinger" large centered, tagline, 3 nav links (About, Work, Resume)
- `src/pages/about.astro` — Bio text, Calvin & Hobbes GIF, social links (Email, GitHub, LinkedIn)
- `src/pages/work.astro` — Row-based project index (title left, tech + arrow right)
- `src/pages/work/[slug].astro` — Project detail: back link, title, tech, description, external links
- `src/pages/resume.astro` — Embedded PDF viewer (iframe, wider max-width: 60rem)
- `src/pages/404.astro` — "Page not found. Go home →"
- `src/data/projects.ts` — Project data (slug, title, description, tech, links)
- `src/styles/global.css` — Design tokens (5 colors, 6 type sizes, 4 spacing levels), reset, base element styles
- `src/components/BaseHead.astro` — SEO meta tags, OG/Twitter cards, favicon

### Navigation

- **Homepage:** No nav bar. Name + tagline + 3 text links (About, Work, Resume) centered in viewport.
- **Inner pages:** Minimal top bar — `jl` (red, links home) left, `About Work Resume` right. Current page bold.
- **Mobile (≤480px):** Nav link text shrinks, gap tightens. No hamburger menu, no sidebar.

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

This automatically creates a `/work/project-slug` detail page and adds the project to the `/work` listing.

## Design Context

### Users
Primarily for personal creative satisfaction. Secondary audiences: recruiters/hiring managers and peers/collaborators in tech and finance. The site should feel like a personal artifact the creator is proud of, not a tool optimized for conversion.

### Brand Personality
Bold, Minimal, Direct. No fluff, no apologies — the work speaks for itself.

### Aesthetic Direction
- **Visual tone:** "The Document" — like a beautifully typeset letter on warm paper. Confidence through absence.
- **Typography:** System font stack only (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...`). One font family, weight variation creates hierarchy.
- **Color:** Warm cream background (`#faf8f5`) + single red accent (`#d80000`). No section colors. Light-only — no dark mode.
- **Personality:** Calvin & Hobbes GIF on about page. Generous whitespace. The space between things is the design.
- **References:** openauth.js.org (border-structured hierarchy), minimal.so/minimark (warm cream + system fonts), anoma.ly (confidence through absence)
- **Anti-references:** Cluttered portfolios, excessive decoration, gradients/shadows, too many fonts, section-colored chrome

### Color Tokens

| Token | Value |
|-------|-------|
| Background | `#faf8f5` (warm cream) |
| Text | `#1a1a1a` |
| Muted | `#666666` |
| Accent | `#d80000` (red) |
| Border | `rgba(0, 0, 0, 0.1)` |

### Design Principles
1. **Viewport-locked, no scrolling** — every page is a composed, complete frame (`100dvh`, `overflow: hidden`)
2. **Content first** — no chrome, no decoration, content speaks
3. **Earned simplicity** — every element justifies its existence. If removing it loses nothing, remove it.
4. **System fonts only** — zero web fonts. Fastest possible load. The absence of font choice IS the choice.
5. **One accent color** — red (`#d80000`) for links, the `jl` mark, and hover states. Everything else is black, gray, or cream.
6. **Homepage centers as a group** — name + tagline + nav links center vertically via `justify-content: center` on `.main`

## Notes

- `public/icon.png` is force-added to git despite `*.png` in `.gitignore`
- Guest Book is planned as a follow-up feature (not in current v1)
- Blog/Now pages are out of v1 scope but content schema (`src/content.config.ts`) is preserved for future use
- Resume PDF viewer uses `:global(.main:has(.resume))` to override max-width from 40rem to 60rem
