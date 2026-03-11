# Codebase Structure

**Analysis Date:** 2026-03-10

## Directory Layout

```
johnlitzsingercom/
├── src/
│   ├── components/               # Reusable Astro components
│   │   ├── BaseHead.astro       # SEO meta tags, font preloading
│   │   └── react/               # React island components
│   │       ├── ProjectCarousel.tsx
│   │       └── GuestBookPage.tsx
│   ├── content/
│   │   └── blog/                # MDX blog posts
│   │       └── *.mdx
│   ├── data/                    # Structured data objects
│   │   ├── projects.ts          # Project definitions
│   │   ├── status.ts            # Current status (footer)
│   │   └── zones.ts             # (Appears unused)
│   ├── layouts/                 # Reusable page shells
│   │   ├── BaseLayout.astro     # HTML wrapper, top bar, breadcrumbs, footer
│   │   └── BlogPostLayout.astro # Blog post wrapper with metadata
│   ├── pages/                   # Routes (file-based routing)
│   │   ├── index.astro          # Homepage (/)
│   │   ├── now.astro            # Now page (/now)
│   │   ├── work.astro           # Work listing (/work)
│   │   ├── about.astro          # About page (/about)
│   │   ├── guest-book.astro     # Guest book (/guest-book)
│   │   ├── 404.astro            # Error page (404)
│   │   ├── blog/
│   │   │   ├── index.astro      # Redirects to /now
│   │   │   └── [...slug].astro  # Dynamic blog post route
│   │   └── work/
│   │       └── [slug].astro     # Dynamic project detail route
│   ├── styles/
│   │   └── global.css           # Design tokens, resets, base styles
│   └── content.config.ts        # Content Collections schema
├── public/
│   ├── icon.png                 # Logo icon (jl)
│   └── fonts/                   # Self-hosted fonts
│       ├── RethinkSans-Variable.woff2       # Body text
│       ├── RethinkSans-Italic-Variable.woff2
│       └── Urbanist-Variable.woff2          # Brand name only
├── astro.config.mjs             # Astro configuration
├── package.json                 # Dependencies, scripts
├── tsconfig.json                # TypeScript config
└── .vercel/                     # Vercel output (generated)
```

## Directory Purposes

**`src/components/`:**
- Purpose: Reusable UI fragments (Astro components)
- Contains: BaseHead.astro for SEO meta, and subdirectories for other component types
- Key files: `BaseHead.astro`

**`src/components/react/`:**
- Purpose: React island components (hydrated on client)
- Contains: Interactive widgets that manage their own state
- Key files: `ProjectCarousel.tsx` (carousel with arrows, dots), `GuestBookPage.tsx` (form + entries)

**`src/content/blog/`:**
- Purpose: Blog post content files in MDX format
- Contains: Each file is a blog post with frontmatter (title, description, pubDate, tags, draft, type)
- Key files: `*.mdx` (dynamically loaded via Content Collections)

**`src/data/`:**
- Purpose: Static JavaScript/TypeScript data objects
- Contains: Type-safe data structures for projects, status, and other global data
- Key files: `projects.ts` (Project interface + array), `status.ts` (footer status), `zones.ts` (appears unused)

**`src/layouts/`:**
- Purpose: Reusable page wrappers that define layout structure
- Contains: Astro components that provide HTML shell, header, footer, and slot for page content
- Key files: `BaseLayout.astro` (main wrapper for all pages), `BlogPostLayout.astro` (blog post specific layout)

**`src/pages/`:**
- Purpose: Routes (file-based routing; each `.astro` file creates a route)
- Contains: Top-level pages (`index.astro`, `now.astro`, etc.) and subdirectories for nested routes
- Key files: All files here are routable (except `BaseLayout.astro` and related which are in `layouts/`)

**`src/styles/`:**
- Purpose: Global CSS and design system
- Contains: Design tokens (colors, spacing, type scale), @font-face declarations, base element styles, global animations
- Key files: `global.css` (only file; imported by BaseLayout)

**`public/`:**
- Purpose: Static assets served as-is
- Contains: `icon.png` (logo, force-added to git despite .gitignore), font files in WOFF2 format
- Key files: `icon.png` (jl logo), `fonts/*.woff2` (Rethink Sans, Urbanist)

## Key File Locations

**Entry Points:**
- `src/pages/index.astro`: Homepage with tagline + 4 folder icons
- `src/pages/blog/[...slug].astro`: Dynamic blog post routes
- `src/pages/work/[slug].astro`: Dynamic project detail pages
- `src/pages/now.astro`: Blog feed listing
- `src/pages/work.astro`: Project carousel
- `src/pages/guest-book.astro`: Guest book page with React island
- `src/pages/about.astro`: About page
- `src/pages/404.astro`: Error page

**Configuration:**
- `astro.config.mjs`: Astro build config (site URL, integrations, Vercel adapter)
- `src/content.config.ts`: Content Collections schema definition (Zod)
- `tsconfig.json`: TypeScript compiler options
- `package.json`: Node dependencies and npm scripts

**Core Logic:**
- `src/layouts/BaseLayout.astro`: Master layout (top bar, breadcrumbs, section coloring, footer)
- `src/layouts/BlogPostLayout.astro`: Blog post wrapper with metadata and nav
- `src/styles/global.css`: Design system (tokens, animations, base styles)
- `src/data/projects.ts`: Project data structure
- `src/content.config.ts`: Blog post schema validation

**Testing:**
- No test files detected in codebase

## Naming Conventions

**Files:**
- Astro components: PascalCase with `.astro` extension (e.g., `BaseLayout.astro`)
- React components: PascalCase with `.tsx` extension (e.g., `ProjectCarousel.tsx`)
- Data files: camelCase with `.ts` extension (e.g., `projects.ts`)
- Content files: kebab-case with `.mdx` extension (e.g., `blog-post-title.mdx`)
- Styles: `global.css` (single global file)

**Directories:**
- Standard English names: `components`, `data`, `layouts`, `pages`, `styles`, `content`
- Subdirectories use same naming: `src/pages/blog/`, `src/components/react/`
- No abbreviated or abbreviated names

**CSS Classes:**
- Kebab-case: `.viewport-lock`, `.folder-grid`, `.post-nav`, `.entry-card`
- BEM-like for variants: `.post-nav-link.post-nav-prev`, `.entry-card.entry-update`
- CSS custom properties (tokens): `--background`, `--section-color`, `--folder-color`

**React Props:**
- camelCase: `client:load`, `client:visible`, `client:idle`
- TypeScript interfaces: PascalCase (e.g., `interface Props`, `interface Project`)

## Where to Add New Code

**New Blog Post:**
- Create new `.mdx` file in `src/content/blog/YYYY-MM-DD-slug.mdx` (or any kebab-case name)
- Add frontmatter: `title`, `description`, `pubDate`, `tags`, `draft`, `type`
- Content Collections automatically discovers and renders via dynamic route `src/pages/blog/[...slug].astro`

**New Section (Listing Page):**
- Create `src/pages/section-name.astro`
- Import `BaseLayout` and pass `breadcrumbs={[{ label: 'Section Name' }]}`
- Section color auto-derives from breadcrumb label (must match `sectionColorMap` in BaseLayout, lines 25-30)
- Query data (from `src/data/` or `src/content/`) and render

**New Project:**
- Add entry to `src/data/projects.ts` array with slug, title, description, tech, links
- Project automatically appears in `/work` carousel
- Optionally create detail page at `src/pages/work/[slug].astro` to show full project page

**New React Island:**
- Create component in `src/components/react/ComponentName.tsx`
- Export default React component (can use hooks)
- Import into `.astro` page and add `client:load`, `client:visible`, or `client:idle` directive
- Example: `<GuestBookPage client:visible />`

**New Layout (Wrapper):**
- Create `.astro` file in `src/layouts/`
- Define `interface Props` with expected page props
- Import `BaseLayout` and wrap content
- Export props to page via `export const { prop1, prop2 } = Astro.props`

**Shared Utilities/Helpers:**
- Place in `src/data/` if data-related (e.g., helper functions that transform data)
- Or create `src/lib/` directory for general utilities (not yet present; consider for future use)

**Styles:**
- Global styles: Add to `src/styles/global.css` (design tokens, resets)
- Component-scoped styles: Use `<style>` block in `.astro` file or styled-jsx in React (not used; all React uses inline CSS)
- CSS custom properties: Define in `src/styles/global.css` under `:root`

## Special Directories

**`.astro/` (Hidden, Generated):**
- Purpose: Astro build artifacts and type definitions
- Generated: Yes (by Astro during build)
- Committed: No (in .gitignore)
- Contents: `content.d.ts` (Content Collections types), `types.d.ts` (global types)

**`.vercel/` (Generated Output):**
- Purpose: Vercel deployment output
- Generated: Yes (by Astro `npm run build`)
- Committed: No (in .gitignore)
- Contents: Optimized static HTML, JS, CSS for Vercel deployment

**`node_modules/` (Dependencies):**
- Purpose: Installed npm packages
- Generated: Yes (by `npm install`)
- Committed: No (in .gitignore)
- Size: Large; contains Astro, React, MDX, and integrations

**`public/` (Static Assets):**
- Purpose: Files served as-is (no processing)
- Generated: No (manually maintained)
- Committed: Yes (except *.png files usually, but `icon.png` is force-added)
- Contents: Logo, fonts, any static images

---

*Structure analysis: 2026-03-10*
