# Design System — johnlitzsinger.com

## Direction
**Boldness & Clarity** — Content-forward, high readability, confident whitespace.
Personal site for a finance student. Visitors are recruiters and peers scanning fast.

## Depth
Borders-first. Shadows only as hover interaction cues (`--shadow-sm`).

## Surfaces
White background (`#ffffff`), stone-50 cards (`#fafaf9`), stone-100 secondary (`#f5f5f4`).
Dark mode inverts to stone-950 bg, stone-800 surfaces.

## Colors
Stone neutral palette + single blue-600 accent. Accent is for meaning (links, CTAs), not decoration.

| Token | Light | Dark |
|-------|-------|------|
| `--background` | `#ffffff` | `#0c0a09` |
| `--surface` | `#fafaf9` | `#1c1917` |
| `--surface-2` | `#f5f5f4` | `#292524` |
| `--foreground` | `#0c0a09` | `#fafaf9` |
| `--secondary` | `#44403c` | `#a8a29e` |
| `--muted` | `#78716c` | `#78716c` |
| `--border` | `rgba(12,10,9,0.10)` | `rgba(250,250,249,0.10)` |
| `--border-strong` | `rgba(12,10,9,0.16)` | `rgba(250,250,249,0.16)` |
| `--accent` | `#2563eb` | `#60a5fa` |
| `--accent-hover` | `#1d4ed8` | `#93bbfd` |
| `--accent-soft` | `rgba(37,99,235,0.12)` | `rgba(96,165,250,0.12)` |
| `--focus-ring` | `rgba(37,99,235,0.45)` | `rgba(96,165,250,0.45)` |

## Typography
Inter Variable (self-hosted) with system fallbacks. 16px base, line-height 1.6.

| Level | Size | Weight | Line-height |
|-------|------|--------|-------------|
| Body | 16px (1rem) | 400 | 1.6 |
| Small/meta | 14px (0.875rem) | 400-500 | 1.5 |
| H4 | 20px (1.25rem) | 600 | 1.3 |
| H3 | 24px (1.5rem) | 600 | 1.25 |
| H2 | 30px (1.875rem) | 600 | 1.2 |
| H1/Hero | 48px (3rem) | 700 | 1.1 |

## Spacing
4px base grid: 4, 8, 12, 16, 24, 32, 48, 64, 96.

## Layout
- Max content: 72rem
- Reading measure: 65ch
- Gutters: 16px (mobile) → 24px (tablet) → 32px (desktop) via `--gutter`

## Radius
- Default: 10px (`--radius`)
- Large surfaces/cards: 14px (`--radius-lg`)
- Pills: 999px (`--radius-pill`)

## Patterns

### Card
- Border: `1px solid var(--border)`
- Background: `var(--surface)`
- Padding: `var(--space-6)` (24px)
- Radius: `var(--radius-lg)` (14px)
- Hover: `border-color: var(--border-strong); box-shadow: var(--shadow-sm);`

### Button (Primary)
- Height: 44px, inline-flex centered
- Padding: `0 var(--space-md)` (16px horizontal)
- Radius: `var(--radius)` (10px)
- Font: 1rem, weight 600
- Bg: `var(--accent)`, text: white
- Hover: `var(--accent-hover)`

### Button (Secondary)
- Same dimensions as primary
- Border: `1px solid var(--border-strong)`
- Bg: transparent
- Hover: `var(--accent-soft)` bg + `var(--accent)` border

### Navigation
- Header height: 64px
- Active page: underline (2px, 4px offset) + foreground color
- Links: 14px, weight 500, no underline

### Links
- Default: underlined, accent color
- Hover: accent-hover
- Focus: 2px ring using `--focus-ring`

### Section
- Default padding: `var(--space-xl)` (64px) vertical
- Hero/major: `var(--space-2xl)` (96px) vertical
- Horizontal: `var(--gutter)` (responsive)

## Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Stone palette over cool gray | Warmer, more grounded for personal site | 2026-02-14 |
| Borders-first depth | Aligns with "less, but better" — reduces noise | 2026-02-14 |
| Single blue accent | Focus attention on actions only | 2026-02-14 |
| 4px spacing grid | Consistency and rhythm | 2026-02-14 |
| Underlined links by default | Clarity and accessibility | 2026-02-14 |
| 44px button/input height | Comfortable touch targets | 2026-02-14 |
| 64px default section padding | Confident whitespace without excess | 2026-02-14 |
| Legacy CSS aliases | Backward compat during migration from --color-* to semantic tokens | 2026-02-14 |
