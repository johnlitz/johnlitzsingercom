# Architecture

**Analysis Date:** 2026-03-10

## Pattern Overview

**Overall:** Static Site Generation (SSG) with Islands Architecture

**Key Characteristics:**
- Static HTML output via Astro 5 with pre-rendered routes and opt-in hydration
- React "islands" (interactive components) hydrated on-demand with `client:load`, `client:visible`, or `client:idle`
- Content-driven via Astro Content Collections (blog posts as MDX files with Zod schema validation)
- Viewport-locked layout (100dvh fixed height, no scrolling) with fallback scrollable pages
- Section-aware UI chrome that dynamically colors based on navigation context (breadcrumbs)
- CSS-first styling with design tokens and OKLCH color system for harmonic color scales

## Layers

**Pages (Routing & Entry Points):**
- Purpose: Define public routes and aggregate content for static generation
- Location: `src/pages/`
- Contains: Astro `.astro` files that export static routes or dynamic `getStaticPaths()` functions
- Depends on: Layouts, data, content collections
- Used by: URL router; generates final HTML output

**Layouts (Structure & Shell):**
- Purpose: Provide reusable HTML structure (header, nav, footer, viewport locking) and pass props down to pages
- Location: `src/layouts/BaseLayout.astro`, `src/layouts/BlogPostLayout.astro`
- Contains: Common chrome (top bar, breadcrumbs, section coloring), slot for page content
- Depends on: Components (BaseHead), data (currentStatus), styles
- Used by: All pages inherit BaseLayout; blog posts use BlogPostLayout (which wraps BaseLayout)

**Components (Reusable UI Fragments):**
- Purpose: Isolated, composable UI chunks (both Astro and React)
- Location: `src/components/` (Astro), `src/components/react/` (React islands)
- Contains: BaseHead.astro (SEO meta), GuestBookPage.tsx (guest book form + entries), ProjectCarousel.tsx (carousel widget)
- Depends on: Styles, data
- Used by: Layouts and pages import components

**Data & Content:**
- Purpose: Provide structured data (projects, status, blog posts)
- Location: `src/data/`, `src/content/`
- Contains: TS data objects (`projects.ts`, `status.ts`), MDX blog post files (`content/blog/*.mdx`)
- Depends on: Zod schemas for validation (`content.config.ts`)
- Used by: Pages and components fetch this data to render UI

**Styles (Design System):**
- Purpose: Shared design tokens, typography, global resets, utility animations
- Location: `src/styles/global.css`
- Contains: CSS custom properties (colors, spacing, type scale), @font-face, keyframes, base element styles
- Depends on: Font files in `public/fonts/`
- Used by: All pages and components inherit global.css; scoped styles override via `<style>` blocks

## Data Flow

**Homepage (Folder Navigation):**

1. User visits `/` (root)
2. `src/pages/index.astro` renders without props
3. Wraps content in `BaseLayout` (provides top bar, section coloring via red/accent color)
4. Renders tagline and 4 folder icons with hardcoded links (`/now`, `/work`, `/guest-book`, `/about`)
5. Folder icons styled with CSS custom property `--folder-color` (section-aware via BaseLayout CSS vars)

**Blog Post Viewing (Content Collections):**

1. User visits `/blog/post-slug`
2. `src/pages/blog/[...slug].astro` executes `getStaticPaths()`:
   - Fetches all blog posts from `src/content/blog/` via `getCollection('blog')`
   - Filters out posts with `draft: true`
   - Sorts by `pubDate` descending
   - Generates static route params and props (post data, prev/next post refs)
3. Post is rendered via `BlogPostLayout` (wraps BaseLayout)
4. `<Content />` slot injects MDX-rendered HTML
5. Prev/next navigation links computed from position in sorted array

**Project Carousel (Data-Driven):**

1. User visits `/work`
2. `src/pages/work.astro` imports `projects` array from `src/data/projects.ts`
3. Passes to `<ProjectCarousel client:load />` React island
4. React component manages carousel state and navigation client-side
5. Carousel hydrated immediately on page load (not deferred)

**Guest Book (Supabase Integration, Deferred):**

1. User visits `/guest-book`
2. `src/pages/guest-book.astro` wraps `<GuestBookPage client:visible />`
3. GuestBookPage React island hydrates only when visible in viewport
4. Placeholder entries displayed immediately (no runtime dependency)
5. Form allows signature canvas + image upload with client-side compression
6. Supabase integration not yet configured (env vars `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` required)

**State Management:**
- **Layout/global:** Section color, breadcrumbs, top bar state managed via BaseLayout CSS variables and props
- **Page-level:** Navigation state passed via route params (`[...slug]`, `[slug]`) and static props
- **Component state:** React islands (ProjectCarousel, GuestBookPage) manage internal state via `useState` hooks; not synced between islands
- **Content:** All content is static (pre-built at compile time); no runtime CMS or real-time updates

## Key Abstractions

**Section-Aware Chrome:**
- Purpose: Unify visual identity across sections (Now, Work, Guest Book, About) by dynamically coloring logo, hovers, backgrounds
- Examples: `src/layouts/BaseLayout.astro` (lines 24-45), `src/styles/global.css` (lines 50-77)
- Pattern: Map breadcrumb labels to CSS custom properties (`--now-500`, `--work-500`, etc.) and apply via `style=` attribute; compute hue-rotate filter to shift logo icon color

**Content Collections:**
- Purpose: Type-safe blog post schema with MDX rendering
- Examples: `src/content.config.ts` (Zod schema), `src/content/blog/*.mdx` (post files)
- Pattern: Astro Content Collections loader with glob pattern; each post has title, description, pubDate, tags, draft flag, optional type (post/update); accessed via `getCollection()` in pages

**React Islands:**
- Purpose: Bring client-side interactivity to specific UI regions without hydrating entire page
- Examples: `src/components/react/ProjectCarousel.tsx`, `src/components/react/GuestBookPage.tsx`
- Pattern: Export React components; import into Astro pages with `client:` directive (`client:load` for immediate, `client:visible` for lazy)

**Static Routes with Dynamic Content:**
- Purpose: Generate multiple static HTML files from single dynamic route template
- Examples: `src/pages/blog/[...slug].astro` (dynamic blog posts), `src/pages/work/[slug].astro` (individual project pages)
- Pattern: Export `getStaticPaths()` function that returns array of `{ params, props }` objects; Astro pre-builds all combinations at build time

## Entry Points

**Homepage:**
- Location: `src/pages/index.astro`
- Triggers: User visits `/`
- Responsibilities: Render tagline and 4 section folder icons; establish visual identity via BaseLayout chrome

**Blog Post:**
- Location: `src/pages/blog/[...slug].astro`
- Triggers: User visits `/blog/post-slug` or any subpath
- Responsibilities: Fetch matching post from content collection, render via BlogPostLayout, compute prev/next navigation

**Project Detail:**
- Location: `src/pages/work/[slug].astro`
- Triggers: User visits `/work/project-slug`
- Responsibilities: Look up project in `projects` array, render project details (title, description, tech, links)

**Section Listing Pages:**
- Location: `src/pages/now.astro`, `src/pages/work.astro`, `src/pages/guest-book.astro`, `src/pages/about.astro`
- Triggers: User visits `/now`, `/work`, `/guest-book`, `/about`
- Responsibilities: Fetch section data (blog posts for `/now`, projects for `/work`, etc.) and render section-specific layout

**Error Page:**
- Location: `src/pages/404.astro`
- Triggers: User visits undefined route
- Responsibilities: Render 404 message with breadcrumb and link to home

## Error Handling

**Strategy:** Error boundaries not explicitly implemented; relies on Astro's default error handling

**Patterns:**
- Content filtering: Blog posts excluded if `draft: true` (via `getCollection('blog', ({ data }) => !data.draft)`)
- Null checks in templates: Optional fields like `heroImage`, `updatedDate` checked before rendering
- Fallbacks: Guest Book shows placeholder entries if Supabase not configured; `/blog/index.astro` redirects to `/now`
- 404 page provides recovery path (link to home)

## Cross-Cutting Concerns

**Logging:** None detected; no client-side logging library or server-side logging infrastructure

**Validation:** Zod schema in `src/content.config.ts` validates blog post frontmatter at build time

**Authentication:** None; site is public. Guest Book form has no auth (placeholder entries only until Supabase integration complete)

**Accessibility:**
- Skip-nav link in BaseLayout (`src/layouts/BaseLayout.astro` line 62)
- Semantic HTML: `<nav>`, `<article>`, `<header>`, `<footer>` used appropriately
- ARIA labels on social links, breadcrumbs, and folders
- Focus ring via outline on `:focus-visible` (red accent color)
- Reduced motion support: `@media (prefers-reduced-motion: reduce)` disables transitions and animations

---

*Architecture analysis: 2026-03-10*
