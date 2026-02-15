---
title: "feat: Build Personal Website with Astro + MDX"
type: feat
date: 2026-02-14
brainstorm: docs/brainstorms/2026-02-14-personal-website-brainstorm.md
---

# Build Personal Website with Astro + MDX

## Overview

Build johnlitzsinger.com as a blog + portfolio hybrid using Astro 5 with MDX, deployed on Vercel. The site has two parts: a single-page scrollable landing page (hero, about, experience, education, skills, contact) and a blog section at `/blog` with MDX posts that support interactive React components.

## Architecture

```
Tech Stack:
- Framework: Astro 5 (static output)
- Content: Content Collections (Content Layer API) + MDX
- Interactive islands: React via @astrojs/react
- Styling: Scoped Astro styles + CSS custom properties + global.css
- Deployment: Vercel (git integration, static mode)
- SEO: Custom BaseHead component + @astrojs/sitemap + JSON-LD
- Fonts: @fontsource (self-hosted Inter)
- Transitions: <ClientRouter /> for view transitions
```

### Project Structure

```
/
├── public/
│   ├── favicon.svg
│   ├── og-image.png                  # Default OG image for social sharing
│   ├── John_Litzsinger_Resume.pdf    # Downloadable resume
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── headshot.jpg              # Profile photo (optimized by Astro)
│   ├── components/
│   │   ├── BaseHead.astro            # SEO meta, OG tags, fonts, JSON-LD
│   │   ├── Header.astro              # Sticky nav: name + Blog link
│   │   ├── Footer.astro              # Copyright, social links
│   │   ├── Hero.astro                # Name, tagline, two CTAs
│   │   ├── About.astro               # Bio + education
│   │   ├── Experience.astro          # Timeline cards for 3 roles
│   │   ├── Skills.astro              # Skill tags/chips
│   │   ├── Contact.astro             # Email link, LinkedIn, resume download
│   │   ├── BlogPostCard.astro        # Card for blog listing page
│   │   └── react/                    # Interactive React islands
│   │       └── Chart.tsx             # Example chart component (added per-post as needed)
│   ├── content/
│   │   └── blog/
│   │       └── hello-world.mdx       # Starter blog post
│   ├── layouts/
│   │   ├── BaseLayout.astro          # HTML shell: BaseHead + Header + <slot> + Footer
│   │   └── BlogPostLayout.astro      # Blog post wrapper: title, date, tags, reading time
│   ├── pages/
│   │   ├── index.astro               # Landing page: imports Hero, About, Experience, Skills, Contact
│   │   ├── blog/
│   │   │   ├── index.astro           # Blog listing: sorted posts with BlogPostCard
│   │   │   └── [...slug].astro       # Dynamic blog post route
│   │   ├── 404.astro                 # Custom 404 page
│   │   └── rss.xml.ts                # RSS feed generation
│   ├── styles/
│   │   └── global.css                # Reset, CSS custom properties, base typography
│   └── content.config.ts             # Content Collection schema definition
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── CLAUDE.md
```

### Navigation

Minimal sticky header on all pages:
- Left: "John Litzsinger" (links to `/`)
- Right: "Blog" (links to `/blog`)
- On mobile: both links remain visible (no hamburger — only 2 links)
- On blog post pages: header is the same, providing consistent navigation back to home or blog listing

### Blog Content Collection Schema

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

Blog post URLs: `/blog/[slug]` where slug is derived from filename.

### Design Direction

**Clean & minimal** — high contrast, generous whitespace, desaturated accent color.

```css
:root {
  --color-bg: #fafafa;
  --color-text: #1a1a1a;
  --color-text-muted: #6b7280;    /* WCAG AA compliant on --color-bg */
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-border: #e5e7eb;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --max-width: 65ch;              /* Optimal reading measure */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;
  --space-2xl: 6rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0a0a0a;
    --color-text: #e5e5e5;
    --color-text-muted: #9ca3af;
    --color-accent: #60a5fa;
    --color-accent-hover: #93bbfd;
    --color-border: #374151;
  }
}
```

- Typography: Inter via `@fontsource-variable/inter`, base 18px, modular scale 1.25
- Line height: 1.6 body, 1.2 headings
- Section spacing: `var(--space-2xl)` between landing page sections
- `prefers-reduced-motion`: disable smooth scrolling and view transitions

---

## Implementation Phases

### Phase 1: Project Scaffolding

Set up the Astro project with all integrations and configuration.

**Tasks:**

- [x] Initialize Astro project: `npm create astro@latest` (empty template)
- [x] Install integrations: `npx astro add mdx react sitemap vercel`
- [x] Install font: `npm install @fontsource-variable/inter`
- [x] Configure `astro.config.mjs`:

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://johnlitzsinger.com',
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [
    mdx(),
    react(),
    sitemap({ filter: (page) => !page.includes('/draft/') }),
  ],
});
```

- [x] Create `src/content.config.ts` with blog collection schema (see above)
- [x] Create `src/styles/global.css` with CSS reset, custom properties, base typography
- [x] Create `public/robots.txt`
- [x] Move `John_Litzsinger_Resume.pdf` to `public/John_Litzsinger_Resume.pdf`
- [x] Initialize git repo with `.gitignore` (node_modules, dist, .vercel, .astro)
- [x] Verify `npm run dev` starts successfully

**Files created:**
`astro.config.mjs`, `src/content.config.ts`, `src/styles/global.css`, `public/robots.txt`, `.gitignore`, `tsconfig.json`, `package.json`

### Phase 2: Layouts and Shared Components

Build the HTML shell, navigation, and SEO infrastructure.

**Tasks:**

- [x] Create `src/components/BaseHead.astro` — accepts `title`, `description`, `image` props. Renders:
  - Charset, viewport, canonical URL
  - `<title>` and meta description
  - OG tags (og:title, og:description, og:image, og:url, og:type)
  - Twitter Card tags (summary_large_image)
  - Font preload for Inter
  - Link to sitemap
  - JSON-LD structured data (Person schema on homepage, BlogPosting on blog posts)
- [x] Create `src/layouts/BaseLayout.astro` — HTML shell:
  - `<BaseHead>` in `<head>`
  - `<ClientRouter />` for view transitions
  - `<Header>` component
  - `<main>` with `<slot />`
  - `<Footer>` component
  - Import `global.css`
- [x] Create `src/components/Header.astro` — sticky nav:
  - "John Litzsinger" on left → links to `/`
  - "Blog" on right → links to `/blog`
  - Semantic `<header>` + `<nav>` with proper ARIA
  - Transparent background with backdrop blur on scroll
- [x] Create `src/components/Footer.astro`:
  - Copyright year (dynamically generated)
  - Social links: LinkedIn, Email
  - Semantic `<footer>`
- [x] Create `src/layouts/BlogPostLayout.astro` — extends BaseLayout:
  - Renders post title as `<h1>`, pubDate, reading time, tags
  - `<article>` wrapper with `<slot />` for MDX content
  - Prose styling for MDX output (headings, code blocks, lists, links, blockquotes)

**Files created:**
`src/components/BaseHead.astro`, `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/layouts/BlogPostLayout.astro`

### Phase 3: Landing Page

Build the single-page scrollable landing page with all content sections.

**Tasks:**

- [x] Create `src/components/Hero.astro`:
  - Name: "John Litzsinger"
  - Tagline: One-line bio adapted from resume summary (e.g., "Finance student & entrepreneur building at the intersection of markets, data, and technology")
  - Two CTAs: "Read the Blog" (primary, links to `/blog`) + "Get in Touch" (secondary, scrolls to `#contact`)
  - Each section gets an `id` attribute for anchor linking
- [x] Create `src/components/About.astro`:
  - Adapted from resume summary — written in first person, conversational tone
  - Include education: "BS Finance, Purdue University (Mitch Daniels School of Business) — graduating August 2026"
  - Section ID: `#about`
- [x] Create `src/components/Experience.astro`:
  - Three experience cards/timeline entries:
    1. **Shepherd Insurance** — Rotational Intern, Employee Benefits (June–Aug 2025)
    2. **Purdue Launch Consulting Club** — Co-founder, Executive Finance (Apr 2023–Present)
    3. **Father Flips** — Founder, Head Analyst (Jan 2021–Mar 2023)
  - Each card: role title, company, date range, 2-3 bullet points (condensed from resume)
  - Dick's Sporting Goods role intentionally excluded (discussed in brainstorm)
  - Section ID: `#experience`
- [x] Create `src/components/Skills.astro`:
  - Skill tags/chips from resume: Market analysis, Financial analysis, Excel, Client service, Leadership, Project management, Presentation skills, Web development, Fund management, CRM, Sales
  - Clean pill/chip layout
  - Section ID: `#skills`
- [x] Create `src/components/Contact.astro`:
  - Email: `mailto:jlitzsin@purdue.edu` (obfuscated with CSS or JS to reduce scraping)
  - LinkedIn: external link (opens new tab with `target="_blank" rel="noopener noreferrer"`)
  - Resume download: link to `/John_Litzsinger_Resume.pdf` (download attribute)
  - Phone number NOT included on website (personal decision — kept private)
  - Section ID: `#contact`
- [x] Create `src/pages/index.astro`:
  - Uses BaseLayout
  - Imports and renders: Hero → About → Experience → Skills → Contact
  - Smooth scroll behavior via CSS `scroll-behavior: smooth` (respects `prefers-reduced-motion`)

**Files created:**
`src/components/Hero.astro`, `src/components/About.astro`, `src/components/Experience.astro`, `src/components/Skills.astro`, `src/components/Contact.astro`, `src/pages/index.astro`

### Phase 4: Blog Infrastructure

Build the blog listing page, dynamic post routes, and a starter post.

**Tasks:**

- [x] Create `src/components/BlogPostCard.astro`:
  - Props: title, description, pubDate, tags, slug
  - Displays: title as link, description excerpt, date (absolute format: "February 14, 2026"), tags as small chips
  - Reading time estimate (word count ÷ 200 wpm)
- [x] Create `src/pages/blog/index.astro`:
  - Uses BaseLayout with title "Blog — John Litzsinger"
  - Queries all non-draft posts from blog collection, sorted by pubDate descending
  - Renders BlogPostCard for each post
  - Empty state message if no posts yet
- [x] Create `src/pages/blog/[...slug].astro`:
  - `getStaticPaths()` generates routes from all non-draft blog entries
  - Renders post using BlogPostLayout
  - Passes `<Content />` from `render(post)`
- [x] Create `src/pages/rss.xml.ts`:
  - Generates RSS feed from blog collection
  - Uses `@astrojs/rss` package (install: `npm install @astrojs/rss`)
- [x] Create `src/pages/404.astro`:
  - Friendly 404 page with link back to homepage and blog
  - Uses BaseLayout
- [x] Create starter blog post `src/content/blog/hello-world.mdx`:
  - Frontmatter: title, description, pubDate, tags
  - Short intro post ("Welcome to my blog...")
  - Demonstrates MDX capability (import and use a simple component)
- [x] Verify: `npm run dev` → navigate to `/blog` → click through to post → 404 page works

**Files created:**
`src/components/BlogPostCard.astro`, `src/pages/blog/index.astro`, `src/pages/blog/[...slug].astro`, `src/pages/rss.xml.ts`, `src/pages/404.astro`, `src/content/blog/hello-world.mdx`

### Phase 5: Accessibility, SEO, and Polish

Final pass for accessibility compliance, SEO optimization, and visual polish.

**Tasks:**

- [x] Accessibility audit:
  - All sections use semantic landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`, `<section aria-label="...">`)
  - Heading hierarchy: single `<h1>` per page, logical `<h2>` → `<h3>` order
  - Skip navigation link at top of BaseLayout
  - All images have `alt` text
  - All links have descriptive text (no "click here")
  - Color contrast meets WCAG AA (4.5:1 normal text, 3:1 large text)
  - Focus styles visible on all interactive elements
  - `prefers-reduced-motion` disables smooth scroll and transitions
- [x] SEO checklist:
  - `public/robots.txt` allows all crawlers, references sitemap
  - Sitemap auto-generated by `@astrojs/sitemap`
  - Canonical URLs on all pages via BaseHead
  - Default OG image (`public/og-image.png`) for pages without a specific image
  - JSON-LD `Person` schema on homepage, `BlogPosting` on blog posts
  - RSS feed link in `<head>`
- [x] Performance check:
  - Run `npm run build` and verify zero JS on landing page (unless React islands present)
  - Images in `src/assets/` use `<Image>` component (auto-optimized)
  - Font loaded via `@fontsource-variable/inter` with `font-display: swap`
  - Run Lighthouse audit targeting 90+ on all metrics
- [x] Visual polish:
  - View transitions via `<ClientRouter />` for smooth page navigation
  - Hover/focus states on all interactive elements
  - Responsive layout: test at 320px, 768px, 1024px, 1440px widths
  - Print stylesheet considerations (resume download is the primary print path)

### Phase 6: Deployment

Push to GitHub and deploy via Vercel.

**Tasks:**

- [ ] Create GitHub repository
- [ ] Push code to `main` branch
- [ ] Connect repo to Vercel
- [ ] Configure custom domain `johnlitzsinger.com` in Vercel dashboard
  - Set up DNS records (A record or CNAME)
  - Redirect `www.johnlitzsinger.com` → `johnlitzsinger.com`
  - Verify HTTPS is active
- [ ] Enable Vercel Web Analytics (free tier)
- [ ] Verify production build: all pages load, OG tags work (use https://opengraph.xyz to test), sitemap accessible, RSS feed valid
- [x] Update CLAUDE.md with build/dev/deploy commands

---

## Content Decisions (from resume)

| Resume Section | Website Location | Notes |
|---|---|---|
| Name, location, email | Hero + Contact | Phone number excluded from website |
| Summary | About section | Rewritten in first-person conversational tone |
| Shepherd Insurance | Experience card 1 | Include 2-3 condensed bullets |
| Purdue Launch Consulting | Experience card 2 | Include co-founder role + website mention |
| Father Flips | Experience card 3 | Include ROI metrics as highlights |
| Dick's Sporting Goods | Excluded | Not relevant to target professional narrative |
| Education (Purdue BS Finance) | About section | "Graduating August 2026" |
| Skills (11 items) | Skills section | All included as tags/chips |
| Portfolio link | Not needed | The website IS the portfolio |
| LinkedIn link | Contact section + Footer | External link, new tab |

## Open Questions Resolved

| Question | Decision |
|---|---|
| Color palette | Blue accent (#2563eb) on neutral bg — see CSS custom properties above |
| Typography | Inter (variable weight), self-hosted via @fontsource |
| Projects/case studies section | No — experience cards serve this purpose at launch. Can add later. |
| Blog categories/tagging | Tags supported in frontmatter schema but no category pages at launch. Tags displayed on posts and cards for visual organization. Category pages can be added when there are enough posts to warrant them. |
| Dark mode | System-based via `prefers-color-scheme`. No manual toggle. Built in from Phase 1 via CSS custom properties. |
| Contact email | `jlitzsin@purdue.edu` for now. Revisit before August 2026 graduation. |
| Analytics | Vercel Web Analytics (free, privacy-friendly, no cookie banner). |
| Charting library | Deferred. No charting component in initial build. MDX + React integration is in place so charts can be added per-post when needed. |

## Acceptance Criteria

- [ ] Landing page loads with all 5 sections (hero, about, experience, skills, contact)
- [ ] Blog listing page at `/blog` shows posts sorted by date
- [ ] Individual blog posts render MDX content correctly at `/blog/[slug]`
- [ ] Interactive React components hydrate correctly inside MDX posts
- [ ] Site respects `prefers-color-scheme` for dark/light mode
- [ ] All pages score 90+ on Lighthouse (Performance, Accessibility, Best Practices, SEO)
- [ ] OG tags generate correct previews when sharing links on LinkedIn/Twitter
- [ ] RSS feed is valid and accessible at `/rss.xml`
- [ ] Sitemap is generated at `/sitemap-index.xml`
- [ ] Resume PDF downloads correctly from Contact section
- [ ] Site deploys automatically on push to `main` via Vercel
- [ ] Navigation works on all pages (header links to home and blog)
- [ ] 404 page displays for invalid routes
- [ ] Site is fully responsive (320px to 1440px+)
- [ ] WCAG AA color contrast compliance

## References

- [Astro Content Collections (v5 Content Layer API)](https://docs.astro.build/en/guides/content-collections/)
- [Astro MDX Integration](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [Astro React Integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Astro Vercel Adapter](https://docs.astro.build/en/guides/integrations-guide/vercel/)
- [Astro Islands / Client Directives](https://docs.astro.build/en/concepts/islands/)
- [Astro Image Optimization (astro:assets)](https://docs.astro.build/en/guides/images/)
- Brainstorm: `docs/brainstorms/2026-02-14-personal-website-brainstorm.md`
