# Design: Top Navigation + About Sidebar Layout

**Date:** 2026-02-17
**Status:** Approved

## Summary

Restructure the site layout from a fixed left sidebar with navigation to a two-mode layout: an About identity column on the left (collapsing on inner pages) with navigation moved to a horizontal bar at the top of the content area.

## Design Principles

- Dieter Rams: "As little design as possible." Every element earns its place.
- Steve Jobs: The interface is the product. Navigation becomes the homepage experience.
- Hierarchy by size and opacity only. No bold weights, no decorative color.
- Single accent color (red) reserved for interactive moments.

## Homepage Layout (Desktop, >=768px)

### Left Column (~340px, full viewport height)

- "John Litzsinger" in large stacked type (`--text-2xl`, ~40px), line-height 1.05, letter-spacing -0.02em
- Tagline below in `--secondary` at `--text-lg`: "Finance student at Purdue, entrepreneur, and market analyst..."
- No links, no contact info, no copyright. The column breathes.
- No right border (clean edge, the content separation is spatial)

### Right Area

**Top nav bar (static, scrolls away):**
- Horizontal links: Work, Projects, Writing, Contact, Resume
- Font-size: `--text-base`, color: `--muted`
- Hover: color transitions to `--foreground` (150ms ease)
- Active page: `--accent` color + thin underline (1px, text-underline-offset: 4px)
- Spacing: flex row with appropriate gap

**Large typographic nav (main content):**
- Each section (Work, Projects, Writing, Contact) as a full-width row
- Type size: `clamp(2.5rem, 5vw, 4rem)` — large but responsive
- One-line description beneath each in `--secondary` at `--text-base`
- No borders between rows. Spacing via padding/margin.
- **Hover:** Thick red underline appears (3-4px, `--accent`), transition 200ms ease
- **Click/active:** Text color shifts to `--accent`
- Resume link can appear as the last row or only in the top nav (it's a PDF, not a page)

### Descriptions for each nav item

- **Work** — "Where I've built and what I've learned"
- **Projects** — "Things I've made from scratch"
- **Writing** — "Ideas on markets, tech, and building"
- **Contact** — "Start a conversation"

(These are suggestions — can be refined.)

## Inner Page Layout (Desktop, >=768px)

### Left Strip (~60-80px, full viewport height)

- "John Litzsinger" rotated 90deg counter-clockwise, running vertically
- Links back to homepage on click
- Color: `--muted`, hover: `--foreground`
- Right border: 1px solid `--border`
- Fixed position (persists on scroll)

### Top Nav Bar

- Same horizontal links as homepage (Work, Projects, Writing, Contact, Resume)
- Sits at the top of the main content area, right of the strip
- Static (scrolls away with page content)
- Active page indicated by `--accent` color + underline

### Main Content Area

- Fills remaining width
- Max-width: `--content-max` (720px)
- Existing page content (Work, Projects, Writing, Contact) renders as-is
- No layout changes to page content itself

### Footer

- Contact info (email, LinkedIn) + copyright moves to bottom of main content
- Appears on all pages as a simple footer element
- Style: `--text-sm`, `--muted` color, border-top separator

## Page Transition Animation

When navigating between homepage and inner pages:

- Left column width animates from 340px to 60-80px (or vice versa) via CSS transition on `width` (`--duration-base`, 200ms)
- Main content `margin-left` adjusts correspondingly
- Creates a satisfying "collapse" effect leaving home, "expand" returning
- Respects `prefers-reduced-motion: reduce` (0ms duration)

## Mobile Layout (<768px)

### Homepage (Mobile)

- No left column. Full-width vertical stack.
- **Top:** Name "John Litzsinger" in large type + tagline beneath
- **Below:** Large typographic nav links stack full-width
  - Same large type, same hover/tap behavior
  - Each link + description on its own row
- No hamburger needed — the navigation IS the content

### Inner Pages (Mobile)

- Vertical name strip disappears
- Compact sticky header: name (left) + hamburger toggle (right)
- Hamburger opens to reveal five links stacked vertically
- Main content full width below
- Footer with contact info at bottom

## Interaction Details

| Element | Default | Hover | Active/Current |
|---------|---------|-------|----------------|
| Homepage large nav row | `--foreground` text, no underline | Thick red underline (3-4px `--accent`), 200ms | Text color `--accent` |
| Top nav link | `--muted` | `--foreground`, 150ms | `--accent` + thin underline |
| Vertical name strip | `--muted` | `--foreground`, 150ms | N/A |
| Footer links | `--muted` | `--foreground` | N/A |

## Accessibility

- Skip nav link retained, targets `#main-content`
- `aria-current="page"` on active nav links
- `aria-label` on navigation landmarks
- Focus rings (`--focus-ring`) on all interactive elements
- Reduced motion: all transitions collapse to 0ms
- Rotated text in vertical strip uses `writing-mode` or `transform: rotate(-90deg)` with appropriate ARIA

## Files to Modify

- `src/components/Sidebar.astro` — Replace with new layout components (or heavily refactor)
- `src/layouts/BaseLayout.astro` — Update layout structure (left column + top nav + main)
- `src/pages/index.astro` — Homepage with large typographic nav
- `src/styles/global.css` — New CSS custom properties, layout rules
- Possibly split into new components:
  - `src/components/TopNav.astro` — Horizontal navigation bar
  - `src/components/IdentityColumn.astro` — Left column (full on home, collapsed on inner)
  - `src/components/Footer.astro` — Contact info footer
