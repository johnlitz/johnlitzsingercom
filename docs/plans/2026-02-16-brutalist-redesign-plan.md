# Brutalist-Minimal Redesign Plan

**Date:** 2026-02-16
**Status:** Draft — awaiting approval

---

## Design Direction

**Aesthetic:** Brutalist-minimal. Swiss poster DNA. Every element earns its place or gets removed.
**Theme:** Dark-primary
**Font:** VTF Lack (single weight + italic) for ALL text
**Accent:** Sharp red `#ff3b30`
**Layout:** Two-column split (fixed sidebar + scrolling content)

---

## 1. Typography — VTF Lack Everywhere

### What changes
- **Remove** Inter Variable and Instrument Serif entirely
- **Install** VTF Lack (Regular + Italic) as self-hosted `@font-face`
- One typeface, one weight. Italic for emphasis only.

### Type scale (simplified)
```
--text-sm:    0.8125rem   (13px — meta, dates, small labels)
--text-base:  1rem        (16px — body text, nav)
--text-lg:    1.25rem     (20px — section headings)
--text-xl:    1.5rem      (24px — H2)
--text-2xl:   2.5rem      (40px — page titles)
--text-hero:  clamp(3rem, 6vw, 5rem)  (hero name)
```

### Hierarchy through size + case + spacing, NOT weight
Since Lack has one weight, hierarchy comes from:
- **Size** — larger = more important
- **Letter-spacing** — tight for display (`-0.02em`), slightly open for labels (`0.08em`)
- **Case** — uppercase for section labels (WORK, WRITING)
- **Opacity** — `opacity: 0.5` for muted/secondary text
- **Italic** — for dates, metadata, subtle emphasis

---

## 2. Color System — Achromatic + Red

### Light and dark (dark is primary)

```css
/* Dark (primary) */
--background:     #0a0a0a;
--surface:        #141414;
--foreground:     #e8e8e8;
--secondary:      rgba(232, 232, 232, 0.55);
--muted:          rgba(232, 232, 232, 0.35);
--border:         rgba(232, 232, 232, 0.12);
--accent:         #ff3b30;
--accent-hover:   #ff6259;

/* Light (secondary, respects prefers-color-scheme) */
--background:     #f5f5f5;
--surface:        #ffffff;
--foreground:     #0a0a0a;
--secondary:      rgba(10, 10, 10, 0.55);
--muted:          rgba(10, 10, 10, 0.35);
--border:         rgba(10, 10, 10, 0.12);
--accent:         #dc2626;
--accent-hover:   #b91c1c;
```

### What gets removed
- All warm/amber accent variables
- All shadow variables (no shadows at all)
- All accent-soft/warm-soft variables
- Noise grain textures
- Dot grid textures

---

## 3. Layout — Two-Column Split

### Structure
```
┌─────────────────────────────────────────────┐
│ SIDEBAR (fixed)     │  CONTENT (scrolls)    │
│                     │                       │
│ John                │  [Page content]       │
│ Litzsinger          │                       │
│                     │                       │
│ Work                │                       │
│ Writing             │                       │
│ Resume              │                       │
│                     │                       │
│                     │                       │
│                     │                       │
│ jlitzsin@purdue.edu │                       │
│ LinkedIn            │                       │
│                     │                       │
│ © 2026              │                       │
└─────────────────────────────────────────────┘
```

### Sidebar specs
- **Width:** ~280px fixed (desktop), collapses to top bar on mobile (<768px)
- **Position:** `position: fixed; left: 0; top: 0; height: 100vh;`
- **Border:** 1px right border (`--border` color) — the only visible line on the page
- **Content:** Name (large), nav links (stacked), contact links (bottom-anchored), copyright
- **Name treatment:** "John Litzsinger" in `--text-2xl`, no decoration, just type
- **Nav links:** `--text-base`, no decoration. Active page indicated by red accent color. Hover: underline.
- **Contact links:** `--text-sm`, muted by default, full opacity on hover

### Content area specs
- **Left margin:** 280px (sidebar width) on desktop, 0 on mobile
- **Max-width:** 720px within the content area
- **Padding:** 48px vertical, 32px horizontal (desktop); 24px 16px (mobile)
- **Top padding:** generous — content starts ~20vh from top (breathe)

### Mobile behavior
- Sidebar becomes a horizontal top bar: name left, hamburger/nav right
- Content fills full width below
- Contact links move to footer

---

## 4. Homepage Sections

### Hero → Replaced by intro
No more separate hero section. On the homepage, the content area starts with:

```
John Litzsinger

Finance student at Purdue, entrepreneur, and
market analyst — building at the intersection
of capital markets, data, and technology.
```

- Name: `--text-hero`, tight letter-spacing
- Tagline: `--text-lg`, `--secondary` color, max-width 50ch
- No CTA button. The sidebar already has all navigation.
- Simple red horizontal rule (`<hr>`) below the intro — 48px wide, 2px thick

### Work section
```
WORK

Rotational Intern, Employee Benefits          Summer 2025
Shepherd Insurance
Analyzed pharmacy benefit structures and drug trend data
to surface cost-saving opportunities in employer health plans.

─────────────────────────────────────────────── (border)

Co-founder & Finance Executive            2023 – Present
Purdue Launch Consulting Club
Co-founded a student consulting org...
```

- "WORK" label: `--text-sm`, uppercase, `letter-spacing: 0.08em`, red accent color
- Job titles: `--text-base`, full foreground color
- Company names: `--text-sm`, italic
- Dates: `--text-sm`, `--secondary` color, right-aligned
- Descriptions: `--text-sm`, `--muted` color
- Dividers: 1px solid `--border`

### Writing section
```
WRITING

2026-02-14
Hello World
Welcome to my blog — where I write about finance,
markets, technology, and whatever else is on my mind.
```

- "WRITING" label: same treatment as WORK
- Date: `--text-sm`, `--muted`, italic
- Post title: `--text-lg`, red accent on hover (link)
- Description: `--text-sm`, `--secondary`
- No cards. No borders around posts. Just text, stacked.

---

## 5. Blog Pages

### Blog index (/blog)
- Same two-column layout
- List of posts, each is: date + title + description
- No cards, no grid. Vertical list with border dividers.
- "All Posts" as page heading in content area

### Blog post (/blog/[slug])
- Same two-column layout
- Post title: `--text-2xl`
- Date: `--text-sm`, `--muted`, italic
- Tags: `--text-sm`, inline, separated by ` / `
- Prose: `--text-base`, max-width 65ch, generous line-height (1.7)
- Blockquotes: 2px left border in red
- Code blocks: `--surface` background, Lack or fallback mono
- Links in prose: red, underlined

---

## 6. Interactions — Almost None

### What gets removed
- Card-lift hover animations (translateY, shadow-md)
- Button hover shadows
- Dot grid pattern
- Noise grain texture
- ease-out-back overshoot transitions

### What stays
- **Links:** Underline on hover (text-decoration, not pseudo-element)
- **Nav active state:** Red color
- **Opacity transitions:** 200ms ease for hover states on muted text
- **Focus states:** 2px solid red outline (accessibility)
- **`prefers-reduced-motion`** still respected

---

## 7. Files to Change

### Remove
- `@fontsource-variable/inter` (npm uninstall)
- `@fontsource/instrument-serif` (npm uninstall)

### Add
- `public/fonts/Lack-Regular.woff2`
- `public/fonts/Lack-Italic.woff2`
- `@font-face` declarations in global.css or a dedicated fonts.css

### Modify heavily
- `src/styles/global.css` — Complete token overhaul
- `src/layouts/BaseLayout.astro` — New two-column layout structure
- `src/layouts/BlogPostLayout.astro` — Simplified prose styles
- `src/components/Hero.astro` — Replace with inline intro (or remove)
- `src/components/Header.astro` — Replace with sidebar component
- `src/components/Footer.astro` — Merge into sidebar (desktop) / keep for mobile
- `src/components/Experience.astro` — Simplify to flat list
- `src/components/Writing.astro` — Simplify to flat list
- `src/components/BlogPostCard.astro` — Remove card styling, flatten
- `src/pages/index.astro` — New page structure
- `src/pages/blog/index.astro` — New list layout
- `src/components/BaseHead.astro` — Remove old font imports

### Maybe add
- `src/components/Sidebar.astro` — New sidebar component
- `src/components/MobileNav.astro` — Mobile navigation (if complex enough to extract)

---

## 8. Implementation Order

1. **Download & install Lack font files** → public/fonts/
2. **Rewrite global.css** → New tokens, @font-face, remove all old variables
3. **Build Sidebar component** → Fixed sidebar with name, nav, contacts
4. **Rewrite BaseLayout** → Two-column structure with sidebar
5. **Rewrite homepage** (index.astro) → Intro + Work + Writing in content column
6. **Simplify Experience.astro** → Flat list, no cards
7. **Simplify Writing.astro** → Flat list, no cards
8. **Rewrite blog index** → Flat post list
9. **Rewrite BlogPostLayout** → Simplified prose styles
10. **Mobile responsive pass** → Sidebar → top bar, content full-width
11. **Remove old components** → Clean up unused Hero, Header, Footer if fully replaced
12. **Light mode pass** → Verify light theme works as secondary

---

## Design Principles (for this site)

1. **If it's not type or space, question it.** No decoration for decoration's sake.
2. **One typeface.** Lack does everything. Hierarchy through size, case, opacity.
3. **Red means interactive.** The only color is reserved for things you can click.
4. **Dark is default.** The site lives in darkness. Light mode is a concession, not the identity.
5. **No hover animations.** Things don't move. They change state (color, underline, opacity).
