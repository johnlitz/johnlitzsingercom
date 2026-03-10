# Design Polish & Personality Injection

**Date:** 2026-03-10
**Status:** Approved
**Scope:** Personality injection — same layout bones, richer color system, 2 signature micro-features, global polish

---

## Summary

Upgrade the site's visual system and add two signature interactive moments:

1. **OKLCH color system** — Replace flat hex section colors with perceptually harmonized 5-step OKLCH scales
2. **Homepage centering fix** — Folders at the viewport's vertical midpoint, tagline floating above
3. **Live status dot** — "Currently building X" on homepage + subtle dot in footer
4. **Guest book sticky notes** — Entries as rotated Post-it notes with thumbtacks and user-chosen colors
5. **Global polish** — Jakub's interface tips applied site-wide

**Constraint:** Lean and fast. CSS-only animations. No JS animation libraries. No runtime cost for the color system.

---

## 1. OKLCH Color System

### Problem

Current section colors are stock Tailwind hex values with inconsistent perceived brightness:

| Section | Current hex | OKLCH equivalent | Lightness |
|---------|-------------|------------------|-----------|
| Now (blue) | `#3B82F6` | oklch(0.63 0.196 264) | 0.63 |
| Work (green) | `#22C55E` | oklch(0.72 0.192 152) | 0.72 |
| Guest Book (amber) | `#F59E0B` | oklch(0.79 0.171 75) | 0.79 |
| About (purple) | `#8B5CF6` | oklch(0.56 0.228 293) | 0.56 |

Purple looks noticeably darker. Amber looks washed out next to blue. They fight.

### Solution

Harmonize all four section colors to **equal OKLCH lightness (L=0.70) and chroma (C=0.17)**, only varying hue. Then generate a 5-step scale for each.

#### Scale structure

```
--{section}-50   → L=0.97, C=0.01  (page background tint)
--{section}-100  → L=0.93, C=0.04  (card/surface fills, sticky note options)
--{section}-200  → L=0.87, C=0.08  (subtle borders via box-shadow, hover bg)
--{section}-500  → L=0.70, C=0.17  (primary — folder icon, headings, active)
--{section}-900  → L=0.35, C=0.10  (dark text on colored backgrounds)
```

#### Target values

**Now (blue) — hue 264:**
```css
--now-50:  oklch(0.97 0.01 264);
--now-100: oklch(0.93 0.04 264);
--now-200: oklch(0.87 0.08 264);
--now-500: oklch(0.70 0.17 264);
--now-900: oklch(0.35 0.10 264);
```

**Work (green) — hue 152:**
```css
--work-50:  oklch(0.97 0.01 152);
--work-100: oklch(0.93 0.04 152);
--work-200: oklch(0.87 0.08 152);
--work-500: oklch(0.70 0.17 152);
--work-900: oklch(0.35 0.10 152);
```

**Guest Book (amber) — hue 80:**
```css
--guestbook-50:  oklch(0.97 0.01 80);
--guestbook-100: oklch(0.93 0.04 80);
--guestbook-200: oklch(0.87 0.08 80);
--guestbook-500: oklch(0.70 0.17 80);
--guestbook-900: oklch(0.35 0.10 80);
```

**About (purple) — hue 295:**
```css
--about-50:  oklch(0.97 0.01 295);
--about-100: oklch(0.93 0.04 295);
--about-200: oklch(0.87 0.08 295);
--about-500: oklch(0.70 0.17 295);
--about-900: oklch(0.35 0.10 295);
```

#### Migration mapping

| Old token | New token |
|-----------|-----------|
| `--folder-now` | `--now-500` |
| `--folder-work` | `--work-500` |
| `--folder-guestbook` | `--guestbook-500` |
| `--folder-about` | `--about-500` |
| `--section-bg-now` | `--now-50` |
| `--section-bg-work` | `--work-50` |
| `--section-bg-guestbook` | `--guestbook-50` |
| `--section-bg-about` | `--about-50` |

Keep old token names as aliases during migration for backward compat, remove once all references are updated.

#### Homepage accent

The homepage red accent (`--accent: #d80000`) stays as-is. It already has personality and isn't part of the section system.

---

## 2. Homepage Centering Fix

### Problem

Currently `.home` uses `justify-content: center` which centers the tagline + folders as a group. This pushes the folders below the true vertical midpoint because the tagline takes up space above them.

### Solution

Make the **folder grid the gravitational center** of the viewport. The tagline floats above it, but the folders themselves sit at the exact vertical midpoint of the available content area.

#### Layout approach

```
┌─────────────────────────┐
│ top-bar                 │
│                         │
│                         │
│   tagline (above)       │
│                         │
│   ┌───┐ ┌───┐ ┌───┐ ┌──│── folders at midpoint
│   │ N │ │ W │ │ G │ │ A│
│   └───┘ └───┘ └───┘ └──│
│                         │
│   status dot + text     │
│                         │
│                         │
│ footer                  │
└─────────────────────────┘
```

#### CSS strategy

```css
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* centers the folder grid */
  flex: 1;
}

.tagline {
  /* Positioned above the centered group but doesn't affect centering */
  margin-bottom: auto-ish spacing;
}

.folder-grid {
  /* This is the anchor point */
}

.status {
  /* Below folders, subtle */
}
```

The precise approach: use a CSS technique where the folder grid is the flex item that sits at center, and the tagline + status are positioned relative to it. One clean way: make `.home` a grid with `place-content: center`, put the tagline as a preceding element that doesn't affect the grid centering. Or use `margin-top: auto` on the folder grid and `margin-bottom: auto` on the status line to create balanced spacing.

Implementation should experiment to find the cleanest CSS that achieves: **folders at the dead center, tagline above, status below, all as a vertically balanced group where the folders are the midpoint.**

---

## 3. Live Status Dot

### Data model

New file: `src/data/status.ts`

```ts
export const currentStatus = {
  text: 'building this website',  // what you're currently doing
  url: '/work/johnlitzsingercom', // optional link (null if none)
  emoji: null,                     // optional emoji prefix
};
```

Updated by editing the file directly. No CMS, no API, no runtime fetching.

### Homepage placement

Below the folder grid, vertically centered as part of the homepage group:

```
● Currently building this website
```

- Green pulsing dot (CSS animation, `animation: pulse 2s ease-in-out infinite`)
- "Currently" label in monospace (`--font-mono`), muted color
- Status text in regular weight, linked if `url` is provided
- Font size: `--text-sm`

### Footer placement

In the site footer, next to the copyright:

```
© 2026 John Litzsinger  ·  ● building this website  ·  Built with Astro
```

- Smaller green dot (6px), same pulse animation
- Abbreviated text (no "Currently" prefix)
- Same muted color as existing footer text

### Pulse animation

```css
@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: oklch(0.72 0.19 145); /* harmonized green */
  animation: status-pulse 2s ease-in-out infinite;
}
```

Uses `prefers-reduced-motion: reduce` to disable the pulse for accessibility.

---

## 4. Guest Book Sticky Notes

### Layout

Replace the current list layout with a **scattered board** of Post-it style notes:

```
     📌          📌
  ┌────────┐  ┌────────┐
  │ "Hey!  │  │ Great  │
  │ Cool   │  │ site!" │
  │ site"  │  │        │
  │  — Sam │  │ — Alex │
  └────────┘  └────────┘
       📌          📌
    ┌────────┐  ┌────────┐
    │ "Love  │  │ "Nice  │
    │ the    │  │ work"  │
    │ design"│  │        │
    │  — Jo  │  │ — Kim  │
    └────────┘  └────────┘
```

#### Note styling

- **Background:** User-chosen from 6 OKLCH-harmonized pastel options (see color chooser below)
- **Rotation:** Random between -3deg and +3deg, set via inline `style` attribute on render. Use a deterministic rotation based on entry ID so it doesn't shift on re-render
- **Shadow:** `box-shadow` instead of border (Jakub tip #10). Subtle, warm-toned
- **Border radius:** 2px (Post-its have barely-there rounded corners)
- **Padding:** Generous — `1.25rem 1rem`
- **Width:** Fixed ~200px per note on desktop, responsive on mobile
- **Grid:** CSS grid with `auto-fill, minmax(180px, 220px)`, centered. Not true masonry — just a grid with random rotations creating visual variety

#### Thumbtack

An SVG thumbtack pinned to the top-center of each note:

```svg
<svg width="16" height="20" viewBox="0 0 16 20">
  <circle cx="8" cy="6" r="5" fill="var(--pin-color)" />
  <rect x="7" y="10" width="2" height="9" rx="1" fill="oklch(0.45 0.02 80)" />
  <circle cx="8" cy="6" r="2.5" fill="oklch(0.85 0.02 80)" opacity="0.5" />
</svg>
```

- Pin head color: user-chosen (matches or complements note color)
- Pin body: neutral warm gray
- Highlight circle on pin head for 3D effect

#### Note color options (user chooses when posting)

6 pastel options, all at L=0.93, C=0.04 for consistency:

| Name | OKLCH | Visual |
|------|-------|--------|
| Lemon | oklch(0.93 0.04 95) | Warm yellow |
| Blush | oklch(0.93 0.04 15) | Soft pink |
| Sky | oklch(0.93 0.04 240) | Light blue |
| Mint | oklch(0.93 0.04 160) | Soft green |
| Lavender | oklch(0.93 0.04 300) | Light purple |
| Peach | oklch(0.93 0.04 55) | Warm peach |

#### Thumbtack color options

6 options, deeper/more saturated than note colors. At L=0.65, C=0.17:

| Name | OKLCH |
|------|-------|
| Red | oklch(0.65 0.20 25) |
| Blue | oklch(0.65 0.17 264) |
| Green | oklch(0.65 0.17 152) |
| Gold | oklch(0.65 0.17 80) |
| Purple | oklch(0.65 0.17 295) |
| Black | oklch(0.30 0.00 0) |

#### Color chooser UI

In the guest book form, before the submit button:

```
Note color:   [●] [●] [●] [●] [●] [●]    (colored circles, click to select)
Pin color:    [●] [●] [●] [●] [●] [●]    (colored circles, click to select)
```

- Simple row of circles with `border: 2px solid transparent` normally
- Selected state: `border-color` matches the color, subtle scale-up
- Default selection: random (assigned on form load)
- Stored with the guest book entry in Supabase

#### Mobile

Notes go single-column on mobile (<480px), still rotated, still with thumbtacks.

---

## 5. Global Polish (Jakub's Tips)

Applied across all pages, minimal effort, high impact:

### text-wrap: balance

```css
h1, h2, h3 { text-wrap: balance; }
```

Already partially present. Ensure it's on ALL headings.

### Shadows instead of borders

Replace any remaining hard borders with box-shadows:

```css
/* Instead of: border: 1px solid var(--border) */
box-shadow: 0 0 0 1px oklch(0.50 0.00 0 / 0.08);

/* For elevated cards (entry cards, sticky notes): */
box-shadow: 0 1px 3px oklch(0.50 0.00 0 / 0.06),
            0 0 0 1px oklch(0.50 0.00 0 / 0.04);
```

### Tabular numbers

```css
time, .date, [data-tabular] {
  font-variant-numeric: tabular-nums;
}
```

Apply to all `<time>` elements and date displays.

### Concentric border radius

When nesting rounded elements (e.g., a card inside a padded container), outer radius = inner radius + padding. Document this as a convention.

### Image outlines

Add a subtle outline to the Calvin & Hobbes GIF on the About page:

```css
.about-gif {
  outline: 1px solid oklch(0.50 0.00 0 / 0.08);
  outline-offset: -1px;
}
```

---

## 6. Performance Budget

| Metric | Target |
|--------|--------|
| New JS added | 0 bytes (status dot is static, colors are CSS) |
| Guest book form JS | Minimal — color chooser is ~20 lines of React state |
| CSS size increase | < 2KB (OKLCH tokens + sticky note styles + status dot) |
| Animation frames | All CSS transitions/animations, no JS requestAnimationFrame |
| Layout shifts | None — all sizing is predetermined |

---

## 7. Files to Modify

| File | Changes |
|------|---------|
| `src/styles/global.css` | OKLCH color tokens, shadow utilities, tabular-nums, text-wrap |
| `src/pages/index.astro` | Centering fix, status dot component |
| `src/layouts/BaseLayout.astro` | Footer status dot, update section color mapping to OKLCH |
| `src/pages/guest-book.astro` | Sticky note grid layout |
| `src/components/react/GuestBookPage.tsx` | Color chooser UI, note/pin color state, sticky note rendering |
| `src/pages/about.astro` | Image outline |
| `src/pages/now.astro` | Shadow instead of border on entry cards, tabular-nums on dates |
| `src/pages/work.astro` | Minor token updates |
| **New:** `src/data/status.ts` | Status dot data model |

---

## 8. What We're NOT Doing

Explicitly out of scope to stay lean:

- No staggered entrance animations (polish, not personality — can add later)
- No magnetic hover / cursor effects (JS-heavy)
- No folder-open page transitions (complex view transition API work)
- No film grain texture (cool but not a signature feature for this pass)
- No dark mode
- No JS animation libraries
- No masonry layout library (CSS grid with rotations is enough)

---

## Design Decisions Log

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Homepage centering | Folders at viewport midpoint, tagline above | Folders are the hero — the gravitational center |
| Ambition level | Personality injection (B) | Strong bones already; layer expression on top |
| Signature features | Guest book sticky notes + live status dot | Physical artifact feel + proof-of-life |
| Color approach | Vivid-but-harmonized OKLCH (B) | Bold and playful, equal perceived brightness |
| Guest book style | Sticky notes with thumbtacks (A) | Playful energy, contrasts with site precision |
| Status dot placement | Homepage + footer (A + C) | Full statement on homepage, ambient in footer |
| Sticky note colors | 6 OKLCH pastels, user-chosen | Personal expression within design system |
| Thumbtack colors | 6 options including black | Complements note colors, adds depth |
