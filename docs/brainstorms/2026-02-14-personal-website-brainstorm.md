# Personal Website Brainstorm

**Date:** 2026-02-14
**Status:** Approved

## What We're Building

A personal website for John Litzsinger at johnlitzsinger.com — a blog + portfolio hybrid built with Astro and MDX, deployed on Vercel.

**Structure:**
- **Single-page landing** — one scrollable page with hero, about, experience, skills, and contact sections. Content sourced from resume.
- **Blog section** (`/blog`) — MDX-powered posts on a mix of topics (finance, career, tech, personal). Supports embedding interactive components (charts, data visualizations) inside posts.

**Target audience:** Potential employers, professional contacts, and readers interested in John's insights.

## Why This Approach

**Astro + MDX + Vercel** was chosen because:

1. **Astro** ships zero JS by default, making the site fast. Its Content Collections provide type-safe frontmatter validation for blog posts.
2. **MDX** allows embedding interactive components (React/Svelte) inside Markdown posts — useful for financial data visualizations and market analysis content, while keeping simple posts as easy as plain Markdown.
3. **Markdown files in the repo** keeps the blog workflow simple — no external CMS to manage. Write, commit, deploy.
4. **Vercel** provides free hosting, automatic deploys from git, and easy custom domain setup.

**Alternatives considered:**
- Plain Markdown Collections — simpler but loses the ability to embed interactive components
- Headless CMS (Sanity) — overkill for a personal blog starting out; can migrate later if needed

## Key Decisions

1. **Single-page + blog architecture** — all professional info on one scrollable landing page, blog as a separate section
2. **Astro framework** with MDX integration for blog content
3. **Clean & minimal visual style** — lots of whitespace, simple typography, muted colors
4. **Markdown/MDX files in repo** for blog posts (no external CMS)
5. **Vercel deployment** with custom domain (johnlitzsinger.com)
6. **Content sourced from resume PDF** — experience, education, skills, and summary already documented
7. **Interface-design skill** to be used for visual design and implementation

## Content Sections (Landing Page)

- **Hero** — Name, tagline, CTA (e.g., "Read the blog" or "Get in touch")
- **About** — Adapted from resume summary
- **Experience** — Timeline or cards for: Shepherd Insurance, Launch Consulting, Father Flips
- **Skills** — Market analysis, financial analysis, Excel, web development, etc.
- **Contact** — Email, LinkedIn, resume download

## Open Questions

- Color palette and typography specifics (to be determined during interface-design)
- Whether to include a projects/case studies section separate from experience
- Blog post categories or tagging system
- Whether to add a dark mode toggle
