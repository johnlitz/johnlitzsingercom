# Website Redesign v2 — Folders on a Clean Surface

**Date:** 2026-03-09
**Status:** Approved
**Branch:** feat/website-redesign-minimal (continuing)

## Intent

Redesign the site from a generic starter-template feel into a memorable personal artifact. Large, colored macOS-style folder icons are the centerpiece. File-browser aesthetic throughout — but restrained, not cosplay. The site should feel like opening someone's personal desktop, not browsing a portfolio template.

## Design Direction

- **Tone:** Intentionally human, bold, minimal with purposeful rough edges
- **Metaphor:** macOS desktop / Finder — folders, breadcrumbs, file listings, metadata
- **Differentiator:** 4 large colored folders ARE the homepage. Nothing else.
- **Performance:** Zero lag. Every click instant. Static Astro, near-zero JS.

## Pages

### Homepage (`/`)

**Top bar:** `jl` logo (28px) + "John Litzsinger" in Urbanist bold (left), 4 social icons (right) — Email, X, LinkedIn, GitHub. Reddit and HN removed.

**Tagline:** Large bold one-liner in Rethink Sans: "Finance @ Purdue interested in startups."

**Folders — the centerpiece:** 4 large macOS-style folder icons in a centered row. Each folder ~80-100px tall with a filled, rounded folder shape (not wireframe outlines). Label in clean sans-serif below each.

| Folder | Color | Route |
|--------|-------|-------|
| Work | Blue `#3B82F6` | `/work` |
| Feed | Green `#22C55E` | `/blitz-feed` |
| Guest Book | Amber `#F59E0B` | `/guest-book` |
| About | Purple `#8B5CF6` | `/about` |

**Hover animation:**
- Lift up 8px (`translateY(-8px)`)
- Scale to 1.08x
- Folder tab rotates open ~12 degrees, revealing accent color inside
- Subtle colored shadow appears underneath (matches folder color)
- Label color shifts to folder's accent color
- Duration: 200ms ease-out enter, 150ms ease-in leave
- Feel: picking a folder up off a desk. Physical, tactile, satisfying.
- Mobile: tap triggers same animation briefly before navigating.

**Nothing else on the homepage.** No project grid, no cards, no "PROJECTS" label. The folders are the homepage. Whitespace below is intentional.

### Work (`/work`)

**Breadcrumb:** `jl / Work` (monospace)

**Page title:** "Work" in large Rethink Sans bold

**File-listing table** (not cards):

| Column | Style |
|--------|-------|
| Name | Bold foreground, clickable → `/work/[slug]` |
| Tech | Muted text |
| Links | Accent color (Live, GitHub) |

- Rows separated by subtle `1px` dividers (Finder list-view style)
- Hover: row gets faint background highlight, name shifts to accent color
- No descriptions in listing — descriptions live on detail pages
- Mobile: stacked list — name bold on one line, tech + links below

### Project Detail (`/work/[slug]`)

**Breadcrumb:** `jl / Work / Project Name` (monospace, each segment clickable)

- Title, tech pills, full description, external links
- Back navigation via breadcrumb (no separate "← All projects" link)
- Same minimal single-column layout

### Feed (`/blitz-feed`)

**Breadcrumb:** `jl / Feed` (monospace)

**Page title:** "bLitz Feed" in large Rethink Sans bold

**Single column of posts** (no two-column layout, social stub removed):
- Date in muted monospace (`--font-mono`, `--text-xs`)
- Title bold, large (`--text-lg`), clickable
- Description in secondary color, 1-2 lines
- Tags as small inline text: `tags: finance, technology` (not pills — comma-separated muted text with `tags:` prefix, like file metadata)
- Hover: title shifts to accent color

**Empty/sparse state:** Muted note at bottom: "More writing coming soon." — honest, not apologetic.

### Guest Book (`/guest-book`)

**Breadcrumb:** `jl / Guest Book` (monospace)

**Page title:** "Guest Book" in large Rethink Sans bold

**Intro line:** "Leave a note. Say hi. Draw something." in muted text.

**Sign form (top):**
- Name — text input, required
- Message — textarea, ~3 rows, required
- Submit button: "Sign" in accent color, solid fill, Urbanist font
- Inputs: bottom-border only (no full box borders), monospace placeholder text
- No email field, no visible CAPTCHA
- Honeypot field for spam, rate limiting on API
- After signing: new entry appears at top with brief fade-in

**Entries (below, newest first):**
- Name bold (left), date muted monospace (right)
- Message in regular weight below
- Separated by thin `1px` dividers (consistent with Work and Feed)
- No avatars, no cards, no upvotes. Names and words only.

**Backend:**
- Supabase table (free tier) or simple JSON API
- Read: client-side fetch or SSR at page load
- Write: Vercel Edge Function
- Honeypot + rate limiting for spam

### About (`/about`)

**Breadcrumb:** `jl / About` (monospace)

**Visual profile / spec sheet layout (not paragraphs):**

**Top:** "John Litzsinger" huge in Urbanist extra bold, fills the width. Short quip in muted text below.

**Middle — stats grid:**

| Label (monospace, muted) | Value (Rethink Sans bold) |
|--------------------------|--------------------------|
| Studying | Finance @ Purdue |
| Building | Startups, tools, this website |

Two data points. That's it. Restraint is the personality.

**Bottom — Connect:**
4 social icons (Email, X, LinkedIn, GitHub) at ~24px with labels next to them. Larger than header versions. This is the CTA.

### 404

- Simple error page, link home. Same breadcrumb style: `jl / 404`

## Navigation

**Header (all pages):**
- `jl` logo + "John Litzsinger" in Urbanist bold (left)
- Social icons (right): Email, X, LinkedIn, GitHub
- On homepage: no extra nav (folders ARE the nav)
- On inner pages: Finder-style breadcrumb in monospace replaces tagline area. Each segment clickable. Current segment in foreground, parents in muted.

**Footer (all pages):**
- One line: `© 2026 John Litzsinger` (left), `Built with Astro` (right)
- Muted `--text-xs`, generous top margin

**Mobile:**
- Header: logo only below 480px (brand name hides)
- Social icons collapse to Email + GitHub
- Breadcrumb wraps, truncating middle segments if needed

**No hamburger menu.**

## Typography

| Role | Font | Usage |
|------|------|-------|
| Brand name | Urbanist (variable, 700-800) | "John Litzsinger" in header + About page |
| Body, headings, UI | Rethink Sans (variable, 400-800) | Everything else |
| Breadcrumbs, dates, metadata | System monospace (`--font-mono`) | File-browser thread |

## Color

| Token | Dark | Light |
|-------|------|-------|
| Background | `#0a0a0a` | `#ffffff` |
| Surface | `#141414` | `#f5f5f5` |
| Foreground | `#e8e8e8` | `#1a1a1a` |
| Muted | `#999999` | `#666666` |
| Accent | `#ef0000` | `#d80000` |

**Folder colors** (icon fills only — don't bleed into pages):

| Folder | Color |
|--------|-------|
| Work | `#3B82F6` |
| Feed | `#22C55E` |
| Guest Book | `#F59E0B` |
| About | `#8B5CF6` |

Dark/light via `prefers-color-scheme`. No manual toggle. Folder colors are saturated enough for both modes.

## What Changes from v1

- **Added:** About page, Guest Book page, Urbanist font, colored folder icons, breadcrumb navigation, footer
- **Removed:** Project cards on homepage, card grid layout, Reddit social link, HN social link, two-column bLitz Feed, social aggregation stub, UPPERCASE section labels
- **Changed:** Homepage is folders only (no project grid), Work page uses file-listing table (not cards), folder nav is 5x larger with hover animation, social icons reduced from 6 to 4

## Design Principles

1. **Folders are the personality** — large, colorful, animated, the first thing you see
2. **File-browser thread** — monospace breadcrumbs, dates, metadata labels tie pages together
3. **Content first, chrome never** — no bordered cards, no badges, no decoration
4. **Intentionally human** — casual copy, honest empty states, purposeful rough edges
5. **Zero lag** — static output, CSS-only animations, near-zero JS, instant transitions

## Performance Requirements

- Static Astro output, zero client JS except Guest Book form
- Urbanist + Rethink Sans preloaded as WOFF2
- Folder hover animations CSS-only (transform + opacity, GPU-composited)
- View transitions: ClientRouter + fade at 180ms
- Guest Book: client-side fetch for reads, Vercel Edge Function for writes
