# Design System — johnlitzsinger.com

## Direction
**Boldness & Clarity** — Content-forward, high readability, confident whitespace.
Personal site for a finance student. Visitors are recruiters and peers scanning fast.

## Depth
Three-level shadow system for physical depth. Borders for structure, shadows for elevation.
- `--shadow-sm`: Resting ground shadow (barely visible)
- `--shadow-md`: Interactive elements — card hover, button hover
- `--shadow-lg`: Reserved for elevated modals/overlays

Card-lift hover pattern: `translateY(-2px) + --shadow-md` on hover, `translateY(0)` on `:active`.

## Surfaces
White background (`#ffffff`), warm off-white surface (`#f5f3f0`), warmer secondary (`#eceae6`).
Dark mode inverts to stone-950 bg, stone-800 surfaces.

Section alternation creates visual rhythm: Hero (`--surface`) → Experience (`--background`) → Writing (`--surface`) → Footer (`--surface`).

## Texture
Surface sections (hero, writing) include two texture layers for materiality:
- **Noise grain**: SVG `feTurbulence` overlay at 4% opacity (3% dark mode). Adds paper-like warmth.
- **Dot grid** (hero only): `radial-gradient` dots at 5% opacity with elliptical mask fade. Structural pattern inspired by Braun speaker grilles.

Both layers use `pointer-events: none` and sit below content via z-index stacking.

## Colors
Stone neutral palette + two accent colors with clear roles:
- **Blue accent** — actions and navigation (links, CTAs, buttons)
- **Warm accent (amber)** — temporal metadata (dates, tags)

| Token | Light | Dark |
|-------|-------|------|
| `--background` | `#ffffff` | `#0c0a09` |
| `--surface` | `#f5f3f0` | `#1c1917` |
| `--surface-2` | `#eceae6` | `#292524` |
| `--foreground` | `#0c0a09` | `#fafaf9` |
| `--secondary` | `#44403c` | `#a8a29e` |
| `--muted` | `#78716c` | `#78716c` |
| `--border` | `rgba(12,10,9,0.10)` | `rgba(250,250,249,0.10)` |
| `--border-strong` | `rgba(12,10,9,0.16)` | `rgba(250,250,249,0.16)` |
| `--accent` | `#2563eb` | `#60a5fa` |
| `--accent-hover` | `#1d4ed8` | `#93bbfd` |
| `--accent-soft` | `rgba(37,99,235,0.12)` | `rgba(96,165,250,0.12)` |
| `--accent-warm` | `#d97706` | `#f59e0b` |
| `--accent-warm-hover` | `#b45309` | `#fbbf24` |
| `--accent-warm-soft` | `rgba(217,119,6,0.10)` | `rgba(245,158,11,0.10)` |
| `--focus-ring` | `rgba(37,99,235,0.45)` | `rgba(96,165,250,0.45)` |

## Typography
Two-font system: **Instrument Serif** for display/editorial, **Inter Variable** for body/UI.

- `--font-display`: Instrument Serif — hero name, page h1s, footer heading
- `--font-body`: Inter Variable — body text, labels, navigation, UI

| Level | Font | Size | Weight | Line-height |
|-------|------|------|--------|-------------|
| Body | Inter | 16px (1rem) | 400 | 1.6 |
| Small/meta | Inter | 14px (0.875rem) | 400-500 | 1.5 |
| H4 | Inter | 20px (1.25rem) | 600 | 1.3 |
| H3 | Inter | 24px (1.5rem) | 600 | 1.25 |
| H2 | Inter | 30px (1.875rem) | 500 | 1.2 |
| H1/Hero | Instrument Serif | clamp(3rem, 6vw, 4.5rem) | 400 | 1.05 |
| H1/Page | Instrument Serif | 48px (3rem) | 400 | 1.1 |

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

## Transitions
- `--ease-out`: `cubic-bezier(0.33, 1, 0.68, 1)` — standard easing
- `--ease-out-back`: `cubic-bezier(0.34, 1.56, 0.64, 1)` — card-lift overshoot
- `--duration-fast`: 150ms — color/border changes
- `--duration-base`: 200ms — shadow lifts, transforms
- `--duration-slow`: 350ms — reserved

All transitions must include `@media (prefers-reduced-motion: reduce)` guard.

## Patterns

### Card
- Border: `1px solid var(--border)`
- Background: `var(--surface)`
- Padding: `var(--space-6)` (24px)
- Radius: `var(--radius-lg)` (14px)
- Hover: `border-color: var(--border-strong); box-shadow: var(--shadow-md); transform: translateY(-2px);`
- Active: `transform: translateY(0);`

### Button (Primary)
- Height: 44px, inline-flex centered
- Padding: `0 var(--space-md)` (16px horizontal)
- Radius: `var(--radius)` (10px)
- Font: 1rem, weight 600
- Bg: `var(--accent)`, text: white
- Hover: `var(--accent-hover)` bg + `var(--shadow-md)` + `translateY(-1px)`

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
- Full-bleed: outer element for background, inner element for `max-width + margin: 0 auto`

### Writing Entry Hover
- Resting: text stack, no background, no border
- Hover: `background: var(--surface-2)`, `translateY(-2px)`, `box-shadow: var(--shadow-md)`
- Negative margin + padding trick for larger hover target while maintaining text alignment

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
| Layered shadow system (sm/md/lg) | Physical depth without decoration | 2026-02-15 |
| Warm accent (amber) for metadata | Rams' "strategic color accent against neutral field" | 2026-02-15 |
| Section surface alternation | Visual rhythm without borders or decoration | 2026-02-15 |
| Card-lift hover pattern | Physical feedback acknowledging interaction | 2026-02-15 |
| Instrument Serif display font | Editorial identity — serif/sans contrast creates typographic personality | 2026-02-15 |
| Noise grain overlay on surfaces | Materiality — paper-like warmth, prevents flat-screen feel | 2026-02-15 |
| Dot grid in hero with mask fade | Structural texture inspired by Braun speaker grille, below perception threshold | 2026-02-15 |
| Stronger surface values (#f5f3f0) | Surface alternation must be perceptible, not just structural | 2026-02-15 |
| Amber accent bar in hero | Geometric punctuation — small warm color moment as visual terminus | 2026-02-15 |
| Footer as surface section | Contact is a destination, not a footnote — gets visual treatment | 2026-02-15 |
