# Technology Stack

**Analysis Date:** 2026-03-10

## Languages

**Primary:**
- TypeScript - Full codebase (components, pages, configuration)
- JavaScript - Astro configuration files, build scripts

**Secondary:**
- JSX/TSX - React components for interactive islands
- MDX - Blog post content with embedded React components

## Runtime

**Environment:**
- Node.js 22+ (18.20.8, ^20.3.0, or >=22.0.0 supported per package-lock)
- No `.nvmrc` file — Node version managed externally (Vercel uses Node 20, local development uses Node 22)

**Package Manager:**
- npm (lockfile present: `package-lock.json` v3)

## Frameworks

**Core:**
- Astro 5.17.1 - Static site generation, page routing, integrations
- React 19.2.4 - Interactive client-side components (islands hydration)

**Content & Rendering:**
- @astrojs/mdx 4.3.13 - MDX support for blog posts with embedded React
- @astrojs/react 4.4.2 - React component integration with Astro
- @mdx-js/mdx (transitive) - MDX compilation and processing

**SEO & Discovery:**
- @astrojs/sitemap 3.7.0 - Automatic XML sitemap generation
- @astrojs/rss 4.0.15 - RSS feed generation for blog

**Deployment:**
- @astrojs/vercel 9.0.4 - Vercel adapter with web analytics enabled

## Key Dependencies

**Critical:**
- astro 5.17.1 - Static site builder and framework (main framework)
- react 19.2.4 - UI components (islands only, not used on every page)
- react-dom 19.2.4 - React DOM rendering

**Type Safety:**
- @types/react 19.2.14 - React TypeScript definitions
- @types/react-dom 19.2.3 - React DOM TypeScript definitions

**Build/Runtime Utilities (transitive):**
- @astrojs/compiler 2.13.1 - Astro component compilation
- @astrojs/markdown-remark 6.3.10 - Markdown/MDX processing
- @astrojs/prism 3.3.0 - Syntax highlighting for code blocks
- prismjs 1.30.0 - Prism syntax highlighter

**Content/File Processing (transitive):**
- hast-util-to-html, rehype-raw, remark-gfm, remark-smartypants - Markdown AST utilities
- vfile 6.0.3 - File abstraction for processing pipelines
- github-slugger 2.0.0 - Heading slug generation for blog
- js-yaml 4.1.1 - YAML parsing for frontmatter
- shiki 3.19.0 - Advanced syntax highlighting

## Configuration

**Environment:**
- Vite config (astro.config.mjs uses Vite under the hood)
- Site URL: `https://johnlitzsinger.com` (from `astro.config.mjs`)
- Trailing slash: `never` (URLs don't end with `/`)
- Output mode: `static` (pre-rendered HTML at build time)

**TypeScript:**
- Config: `tsconfig.json`
- Extends Astro strict config
- JSX: React JSX with `jsxImportSource: "react"`

**Environment Variables:**
- PUBLIC_SUPABASE_URL - Supabase project URL (public, prefixed with PUBLIC_)
- PUBLIC_SUPABASE_ANON_KEY - Supabase anonymous key (public, prefixed with PUBLIC_)
- Both optional — guest book shows "coming soon" fallback if not configured

**Build Script:**
- Uses Node.js `--require ./polyfill-url.cjs` to work around Astro/Rollup compatibility with `URL.canParse` and `Headers.getSetCookie` on Node 24
- Harmless on Vercel (Node 20) and Node 22

## Platform Requirements

**Development:**
- Node.js 18.20.8+, 20.3.0+, or 22.0.0+
- npm (any recent version)

**Production:**
- Vercel (only supported deployment platform per astro.config.mjs)
- Static hosting capable (pre-rendered HTML, CSS, JS assets)
- Web Analytics enabled on Vercel adapter

## Build Output

**Command:** `npm run build`

**Output:** `.vercel/output/` directory containing static assets (Vercel-specific output format)

**Command:** `npm run preview` - Local preview of production build

## Package Versions Summary

| Package | Version | Type |
|---------|---------|------|
| astro | ^5.17.1 | Core |
| react | ^19.2.4 | UI |
| react-dom | ^19.2.4 | UI |
| @astrojs/mdx | ^4.3.13 | Content |
| @astrojs/react | ^4.4.2 | Integration |
| @astrojs/rss | ^4.0.15 | Integration |
| @astrojs/sitemap | ^3.7.0 | Integration |
| @astrojs/vercel | ^9.0.4 | Adapter |

---

*Stack analysis: 2026-03-10*
