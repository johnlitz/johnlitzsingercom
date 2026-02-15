# Design System — Personal Website (Interface-Design)

This file is loaded by the `interface-design` plugin in Claude Code. It defines *non-negotiable* principles + concrete UI tokens/patterns so every edit stays consistent across sessions.

---

## Principles (applies to every UI decision)

### 1) “Less, but better” (Dieter Rams)
- Remove anything that doesn’t directly support a user need.
- Neutral, unobtrusive UI: content leads; UI supports.
- Be thorough down to details (spacing, alignment, states). Nothing arbitrary.

### 2) Focus + deep simplicity (Steve Jobs)
- Say **no** to optional UI flourishes until the core experience is excellent.
- Simplicity is earned: reduce concepts, then make what remains feel inevitable.
- End-to-end coherence: typography, spacing, and interaction patterns must read as one system.

### 3) Start with user needs (GOV.UK)
Primary visitor needs for a personal site:
1. Understand who I am (role, focus, values) within 10 seconds.
2. Validate credibility (work, writing, projects) with clear scanning.
3. Take action (contact / CTA) without searching.
4. Navigate with minimal cognitive load.

### 4) Usability heuristics (NN/g)
- **Visibility of status:** clear hover/active/focus, loading states, success/error feedback.
- **Match the real world:** plain language, familiar labels (“Work”, “Writing”, “Contact”).
- **User control:** easy escape, no “dead ends”, predictable back behavior.
- **Consistency:** same spacing, same component anatomy, same interaction rules.
- **Error prevention/recovery:** good defaults, inline validation, human error messages.
- **Recognition over recall:** navigation + context visible; avoid hidden controls.
- **Minimalist design:** every element earns its place.

### 5) Apple HIG fundamentals
- Strong **hierarchy**: clear reading order, intentional emphasis.
- **Harmony**: alignment, rhythm, and spacing feel coherent.
- **Consistency**: reusable components and conventions.
- Accessibility: contrast, readable type, and generous hit targets.

---

## Direction

**Personality:** Boldness & Clarity (content-forward, high readability, confident whitespace)
**Foundation:** Neutral (stone/white) with a single restrained accent
**Depth:** Mostly flat (borders); shadows only as a subtle interaction cue

---

## Tokens

### Spacing
Base: 4px  
Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96  
Rules:
- Never invent spacing values off-scale.
- Use 64–96 for section vertical rhythm; use 12–24 for within-component padding.

### Layout
- Max content width: 72rem (1152px) for reading + portfolio balance
- Reading measure: 60–75ch for long-form text
- Page gutters: 16px (mobile), 24px (tablet), 32px (desktop)

### Colors (CSS variables)
Use semantic tokens (support light/dark mode via variable overrides).
```
--background: #ffffff
--surface: #fafaf9        /* stone-50 */
--surface-2: #f5f5f4      /* stone-100 */

--foreground: #0c0a09     /* stone-950 */
--secondary: #44403c      /* stone-700 */
--muted: #78716c          /* stone-500 */

--border: rgba(12, 10, 9, 0.10)
--border-strong: rgba(12, 10, 9, 0.16)

--accent: #2563eb         /* blue-600 */
--accent-hover: #1d4ed8   /* blue-700 */
--accent-soft: rgba(37, 99, 235, 0.12)

--focus-ring: rgba(37, 99, 235, 0.45)
```
Rules:
- Accent is for *meaning* (links/CTAs), not decoration.
- Keep backgrounds quiet; avoid gradients unless they convey structure.

### Typography
Font stack (Inter self-hosted via `@fontsource-variable/inter`, system fallbacks):
- `'Inter Variable', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

Scale (web):
- Body: 16px (base), line-height 1.6
- Small/meta: 14px, line-height 1.5
- H3: 20–24px, line-height 1.25
- H2: 28–32px, line-height 1.2
- H1: 40–48px, line-height 1.1

Weights: 400 (body), 500 (UI), 600 (headings), 700 (hero emphasis)  
Rules:
- Prefer fewer sizes; use weight + spacing for hierarchy.
- Never use low-contrast light gray for body text.
- Links are underlined by default (or on hover at minimum) for clarity.

### Radius
Scale: 10px (default), 14px (large surfaces), 999px (pills only)  
Rule: Keep radius consistent; do not mix many radii.

### Borders & Lines
- Default border: 1px solid `--border`
- Dividers: 1px solid `--border` with 24–32px vertical spacing around sections

### Depth (shadows)
Default: none  
Interactive cue only (hover/raised):
- `0 1px 2px rgba(0,0,0,0.06)`  
Rule: Do not stack heavy shadows; use borders first.

### Motion
- Duration: 120–180ms for hover/focus transitions
- Easing: standard ease-out
Rules:
- Motion must clarify state (never ornamental).
- Respect reduced motion settings.

### Accessibility
- Minimum hit target: 44×44px for interactive controls
- Visible focus: 2px ring using `--focus-ring`, never removed
- Contrast: meet WCAG AA for text; avoid muted text for body copy

---

## Patterns

### Container
- Max-width: 72rem
- Centered with responsive gutters
- Vertical section padding: 64px (default), 96px (hero/major sections)

### Navigation (Header)
- Height: 64px
- Link size: 14–16px, 500 weight
- Gaps: 16–24px between items
- Current page: underline + `--foreground` (not just color)
- Mobile: collapse to simple menu; avoid complex animations

### Link
- Default: underline (or underline-on-hover at minimum)
- Hover: `--accent-hover`
- Focus: 2px ring + underline retained

### Button (Primary)
- Height: 44px
- Padding: 12px 16px
- Radius: 10px
- Font: 15–16px, 600
- Background: `--accent`, text: white
- Hover: `--accent-hover`
- Focus: ring + no layout shift
- Disabled: reduce opacity, keep readable contrast

### Button (Secondary)
- Height: 44px
- Padding: 12px 16px
- Radius: 10px
- Border: 1px solid `--border-strong`
- Background: transparent / `--surface`
- Hover: `--accent-soft` background tint

### Card
- Border: 1px solid `--border`
- Background: `--surface`
- Padding: 20–24px
- Radius: 14px
- Hover (optional): subtle shadow cue + border strengthen
- Use for: project summaries, writing previews, CTA blocks

### Section Header Block
- Title + 1–2 lines of supporting text
- Spacing: 12px between title and subtitle; 32–48px before content grid
- Alignment: left; avoid centered paragraphs (harder to scan)

### Content Grid
- Default: 1 column (mobile), 2 columns (tablet/desktop) for cards
- Gap: 16px (tight), 24px (default), 32px (airy)
- Keep card heights natural; avoid forced equal-height unless necessary

### Form Input
- Height: 44px
- Padding: 12px 14px
- Radius: 10px
- Border: 1px solid `--border-strong`
- Focus: ring + border in `--accent`
- Error: message in plain language + actionable fix; do not rely on color alone

### Feedback (Status)
- Success: short confirmation + next step (if any)
- Error: “what happened” + “how to fix” in 1–2 sentences
- Loading: show progress or skeleton for lists; avoid spinners without context

---

## Mandate Checks (run before accepting any design change)
1. Does this support a primary user need?
2. Did we remove at least one thing before adding anything new?
3. Are spacing and sizes on the defined scales?
4. Is hierarchy clear within 3 seconds of scanning?
5. Are interactive states (hover/focus/active/disabled/loading) defined?
6. Is it accessible (contrast, focus, targets, motion)?
7. Is the change consistent with existing patterns?

---

## Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Boldness & Clarity direction | Personal site benefits from strong hierarchy + confident whitespace | 2026-02-14 |
| Borders-first depth | “Less, but better” and reduces visual noise | 2026-02-14 |
| Single accent color | Focus attention on actions and links; avoid decorative color | 2026-02-14 |
| 4px spacing grid | Consistency, rhythm, and faster iteration | 2026-02-14 |
| Underlined links | Clarity + recognizability; reduces ambiguity | 2026-02-14 |
| 44px button/input height | Comfortable touch targets and accessibility | 2026-02-14 |
