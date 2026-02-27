---
title: "feat: Mobile holistic redesign — identity, collapsible nav, spatial rhythm"
type: feat
date: 2026-02-20
brainstorm: docs/brainstorms/2026-02-20-mobile-holistic-redesign-brainstorm.md
reviewed: true
---

# Mobile Holistic Redesign

## Overview

Replace the current horizontal tab bar on mobile (768px and below) with a centered name header + collapsible inverted pyramid navigation. Add an intermediate breakpoint at 1024px for tablets. Apply context-dependent spacing fixes across all pages. The desktop experience is unchanged.

This is a **faithful translation** of the desktop editorial identity to mobile — same VTF Lack typeface, same red accent, same border vocabulary, same designer's hand.

## Problem Statement

The mobile experience has no identity. "John Litzsinger" never appears on any mobile page — the sidebar is `display: none` at 768px and the tab bar only shows navigation links. The Resume link is completely inaccessible on mobile. Spatial rhythm across pages is inconsistent — some areas have too much dead space, others are cramped. Tablets (769-1024px) get a sidebar that consumes ~33% of the viewport.

## Proposed Solution

### New: MobileHeader component

A single new Astro component — `src/components/MobileHeader.astro` — that replaces the tab bar markup in BaseLayout. Structure:

```
┌─────────────────────────────────┐
│      John Litzsinger            │  ← centered, tappable → Home
│            ∨                    │  ← chevron toggle (SVG, rotates on open)
├─────────────────────────────────┤  ← 1px border-bottom on .mobile-header
│                                 │
│  (page content starts here)     │
└─────────────────────────────────┘
```

When chevron is tapped, the nav expands inline (pushes content down):

```
┌─────────────────────────────────┐
│      John Litzsinger            │
│            ∧                    │  ← chevron flipped
│                                 │
│   Projects    Work    Writing   │  ← flex-wrap produces 3+2 naturally
│       Contact    Resume         │
│                                 │
├─────────────────────────────────┤  ← border stays at bottom of header
│                                 │
│  (page content)                 │
└─────────────────────────────────┘
```

### Design Decisions (resolving brainstorm open questions + review feedback)

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Header is **NOT** inside `transition:persist` | Nav resets to closed on every navigation — correct behavior, no stale state |
| 2 | DOM: `<div class="mobile-header">` wrapping `<a>` (name) + `<nav>` (pyramid) | Using `<div>` not `<header>` to avoid duplicate `banner` landmark (sidebar already serves as page identity). `<nav>` gets `aria-label="Site navigation"` (distinct from sidebar's "Main navigation") |
| 3 | Nav expands **inline** (pushes content down) | No overlay, no z-index, no scroll lock. Sticky header grows naturally. Simpler |
| 4 | Nav closes automatically on navigation | Header re-renders on view transition (not persisted), so closed is the default |
| 5 | Chevron: **inline SVG** with `aria-hidden="true"` inside a `<button aria-label="Toggle navigation" aria-expanded="false">` | Cross-platform reliable, accessible, animatable via CSS transform |
| 6 | Tablet (769-1024px): **narrower sidebar** via adjusted clamp() | Keep desktop layout pattern, just narrow the sidebar |
| 7 | Nav toggle: simple `hidden` attribute toggle, **no animation** on expand/collapse | Chevron rotation provides motion feedback. `hidden` works correctly for accessibility (removes from AT). Avoids the `hidden` + `display: grid` footgun entirely. The 0fr→1fr Grid trick is overengineered for a 5-link nav of known height |
| 8 | Name size: **var(--text-xl)** (1.5rem/24px) | Keeps collapsed header height ~72px. Desktop sidebar keeps its larger size |
| 9 | Active state: accent color + **2px bottom underline** per link | Matches existing tab bar and sidebar patterns, WCAG 1.4.1 compliant |
| 10 | `border-bottom` directly on `.mobile-header` | Matches existing tab-bar pattern, no `::after` pseudo-element needed |
| 11 | `prefers-reduced-motion`: chevron rotation **instant** | Matches existing codebase pattern |
| 12 | Name gets `aria-current="page"` on homepage + accent color | Mirrors sidebar behavior via `body[data-page="home"]` |
| 13 | Pyramid layout: **single flex container** with `flex-wrap: wrap` | 5 links in centered flex-wrap naturally produce 3+2 rows. No wrapper divs needed — the stagger emerges from content, not structure |
| 14 | Script: **module `<script>`** (Astro default), no `astro:page-load` wrapper | Since header is not `transition:persist`, it re-renders fresh each navigation. Module script runs once per fresh render. No sentinel guard needed — the pattern from `docs/solutions/event-listener-accumulation` applies only to persisted elements |
| 15 | Close behavior: **Escape key only** (no close-on-outside-tap) | Nav closes on every link click (navigation) and on Escape. Outside-tap adds a document-level listener for marginal UX benefit and introduces listener accumulation risk |

## Technical Approach

### Files to create

#### `src/components/MobileHeader.astro`

New component. Hidden on desktop, visible on mobile.

```astro
---
import { navItems } from '../data/nav';

const currentPath = Astro.url.pathname;

function isActive(href: string, match: string, path: string): boolean {
  return match === 'exact' ? path === href : path.startsWith(href);
}
---

<div class="mobile-header">
  <a href="/" class:list={['mobile-name', { active: currentPath === '/' }]}
     data-match="exact"
     aria-current={currentPath === '/' ? 'page' : undefined}>
    John Litzsinger
  </a>

  <button class="mobile-chevron" aria-expanded="false"
          aria-controls="mobile-pyramid-nav" aria-label="Toggle navigation">
    <svg width="20" height="12" viewBox="0 0 20 12" fill="none"
         stroke="currentColor" stroke-width="1.5" aria-hidden="true">
      <path d="M1 1 L10 10 L19 1" />
    </svg>
  </button>

  <nav id="mobile-pyramid-nav" class="pyramid-nav" aria-label="Site navigation" hidden>
    {navItems.map((item) => (
      <a href={item.href} data-match={item.match}
         class:list={['pyramid-link', { active: isActive(item.href, item.match, currentPath) }]}
         aria-current={isActive(item.href, item.match, currentPath) ? 'page' : undefined}>
        {item.label}
      </a>
    ))}
    <!-- Resume is intentionally hardcoded (not in navItems) to keep PDF
         links out of the data layer. Matches LeftColumn.astro behavior. -->
    <a href="/John_Litzsinger_Resume.pdf" class="pyramid-link"
       target="_blank" rel="noopener noreferrer">Resume</a>
  </nav>
</div>

<script>
  const chevron = document.querySelector('.mobile-chevron');
  const nav = document.getElementById('mobile-pyramid-nav');

  if (chevron && nav) {
    chevron.addEventListener('click', () => {
      const expanded = chevron.getAttribute('aria-expanded') === 'true';
      chevron.setAttribute('aria-expanded', String(!expanded));
      nav.hidden = expanded;
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !nav.hidden) {
        nav.hidden = true;
        chevron.setAttribute('aria-expanded', 'false');
        chevron.focus();
      }
    });
  }
</script>

<style>
  .mobile-header {
    display: none;
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--background);
    text-align: center;
    padding-top: env(safe-area-inset-top, 0px);
    border-bottom: 1px solid var(--border);
  }

  .mobile-name {
    display: block;
    font-size: var(--text-xl);
    letter-spacing: -0.015em;
    padding: var(--space-md) var(--space-md) var(--space-xs);
    color: var(--foreground);
    text-decoration: none;
    transition: color var(--duration-fast) ease;
  }

  .mobile-name:hover {
    color: var(--accent);
  }

  .mobile-chevron {
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    padding: var(--space-xs) var(--space-md) var(--space-sm);
    min-height: 44px;
    min-width: 44px;
    transition: color var(--duration-fast) ease;
  }

  .mobile-chevron:hover {
    color: var(--foreground);
  }

  .mobile-chevron svg {
    transition: transform var(--duration-base) ease;
  }

  .mobile-chevron[aria-expanded="true"] svg {
    transform: rotate(180deg);
  }

  /* Pyramid nav — flat flex container, 5 links wrap to 3+2 naturally */
  .pyramid-nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-sm) var(--space-lg);
    padding: var(--space-sm) var(--space-md) var(--space-md);
  }

  .pyramid-link {
    position: relative;
    font-size: var(--text-sm);
    color: var(--muted);
    text-decoration: none;
    padding: var(--space-xs) 0;
    transition: color var(--duration-fast) ease;
  }

  .pyramid-link:hover {
    color: var(--foreground);
  }

  .pyramid-link.active {
    color: var(--accent);
  }

  .pyramid-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--accent);
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .mobile-chevron svg {
      transition: none;
    }
  }

  /* Show on mobile */
  @media (max-width: 768px) {
    .mobile-header { display: block; }
  }

  /* Home page — name gets accent color */
  :global(body[data-page="home"]) .mobile-name {
    color: var(--accent);
  }
</style>
```

**Note on `isActive` duplication:** This helper is duplicated in BaseLayout and LeftColumn. This is pre-existing tech debt — a shared utility in `src/utils/nav.ts` would be cleaner but is out of scope for this plan.

**Note on `hidden` attribute:** When `hidden` is set, the browser applies `display: none`, which completely hides the pyramid-nav from both visual rendering and the accessibility tree. The `display: flex` in the scoped styles will NOT override `hidden` because `hidden` has higher specificity in the UA stylesheet. When `hidden` is removed, the scoped `display: flex` takes effect. This is the correct behavior — no `display` conflict.

### Files to modify

#### `src/layouts/BaseLayout.astro`

1. **Import** MobileHeader component at top of frontmatter
2. **Replace** the `<nav class="tab-bar">...</nav>` markup with `<MobileHeader />`
3. **Remove** all `.tab-bar` and `.tab-link` CSS rules (lines ~161-209)
4. **Update** the `updateActiveStates` script:
   - Change selector from `'.sidebar-link, .tab-link'` to `'.sidebar-link, .pyramid-link, .mobile-name'`
   - The `.mobile-name` link has `data-match="exact"` and `href="/"`, so the existing loop logic handles it — no separate code block needed
5. **Add** 1024px intermediate breakpoint for tablet sidebar narrowing:

```css
@media (max-width: 1024px) and (min-width: 769px) {
  .site {
    grid-template-columns: clamp(200px, 20vw, 260px) 1fr;
  }
}
```

6. **Adjust** mobile `.site-main` top padding:

```css
@media (max-width: 768px) {
  .site-main {
    padding: var(--space-md) var(--space-md) var(--space-lg);
    /* was: 0 var(--space-md) var(--space-lg) — add top padding for breathing room */
  }
}
```

#### `src/styles/global.css`

No changes. Existing tokens are sufficient.

#### `src/pages/work.astro`

The mobile rules for `.entry` and `.entry-header` already exist (lines 103-116). Only add `font-size: var(--text-sm)` to the existing `.period` mobile rule:

```css
/* EXISTING rule — only add font-size */
@media (max-width: 768px) {
  .period {
    margin-top: var(--space-xs);
    font-size: var(--text-sm);  /* NEW — tighter dates on mobile */
  }
}
```

#### `src/layouts/BlogPostLayout.astro`

Add mobile spacing overrides for blog post vertical rhythm:

```css
@media (max-width: 768px) {
  .prose :global(h2) { margin-top: var(--space-lg); }
  .prose :global(h3) { margin-top: var(--space-md); }
}
```

## Acceptance Criteria

### Functional

- [x] "John Litzsinger" appears centered at top of every mobile page
- [x] Tapping the name navigates to Home on all pages
- [x] Chevron toggles pyramid nav open/closed
- [x] Pyramid shows 5 links (Projects, Work, Writing, Contact, Resume) in centered flex-wrap layout
- [x] Resume link opens PDF in new tab (same as desktop sidebar)
- [x] Active page link has red accent color + 2px underline
- [x] Name has accent color on homepage only
- [x] Nav closes on: Escape key, page navigation (automatic re-render)
- [x] 1px border visible below header at all times

### Responsive

- [x] 375px: Full layout fits, no horizontal scroll, no text clipping
- [ ] 320px: All 5 pyramid links fit when wrapped
- [x] 768px: Mobile header visible, sidebar hidden
- [x] 769-1024px (tablet): Desktop sidebar visible but narrower, no mobile header
- [x] 1025px+: Full desktop layout unchanged
- [ ] Landscape phone: Header does not consume >40% of viewport height
- [x] iOS safe area: `env(safe-area-inset-top)` handled on header

### Accessibility

- [x] Chevron button has `aria-expanded` toggling true/false
- [x] Chevron button has `aria-controls="mobile-pyramid-nav"`
- [x] Chevron button has `aria-label="Toggle navigation"`
- [x] Nav hidden via `hidden` attribute when collapsed (correctly removed from AT)
- [x] Escape key closes nav and returns focus to chevron
- [x] `aria-current="page"` on active nav link and on name link when on home
- [x] Mobile nav uses `aria-label="Site navigation"` (distinct from sidebar's "Main navigation")
- [x] `prefers-reduced-motion` disables chevron rotation animation
- [x] All pyramid links have `data-match` attribute for active state updates
- [x] Hover states on all interactive elements (name, chevron, pyramid links)

### View Transitions

- [x] Nav resets to closed state on every page navigation (not persisted)
- [x] Active states update correctly after `astro:after-swap` (including `.mobile-name`)
- [x] No event listener accumulation (module script, not `astro:page-load`)
- [x] Hash scroll still works on cross-route navigation

### Pages to test

- [x] Home (`/`)
- [x] Work (`/work`)
- [ ] Projects (`/projects`)
- [x] Blog index (`/blog`)
- [x] Blog post (`/blog/[slug]`)
- [x] Contact (`/contact`)
- [ ] Contact thanks (`/contact/thanks`)
- [ ] 404 page

## Dependencies & Risks

**Dependencies:**
- None. All changes are CSS/HTML/Astro — no new packages needed.

**Risks:**
- **Pyramid layout at 320px:** Five links in flex-wrap at smallest viewport. Mitigate: test early, `--text-sm` (13px) keeps links compact.
- **Module script Escape listener on `document`:** This listener fires on every page but only acts when `.pyramid-nav` exists and is not hidden. On desktop, `.mobile-header` is `display: none` but the script still runs — the `querySelector` will find the hidden element. Mitigate: guard with a mobile media query check or accept the benign no-op (the `!nav.hidden` check prevents any action since `hidden` is always set on desktop).
- **`hidden` attribute specificity:** The `hidden` attribute's UA stylesheet rule (`[hidden] { display: none }`) will override the scoped `display: flex` on `.pyramid-nav`. This is correct behavior — when `hidden` is removed, scoped styles take effect. Verify this works in all target browsers.

## Implementation Sequence

1. Create `MobileHeader.astro` with markup, styles, and toggle script
2. Replace tab bar in `BaseLayout.astro` with `<MobileHeader />`
3. Update `updateActiveStates` selector to include `.pyramid-link, .mobile-name`
4. Remove old `.tab-bar` / `.tab-link` CSS from BaseLayout
5. Add 1024px tablet breakpoint to BaseLayout
6. Adjust mobile `site-main` top padding
7. Add `font-size: var(--text-sm)` to work.astro mobile `.period` rule
8. Add BlogPostLayout.astro mobile heading spacing
9. Test all 8 pages at 375px, 768px, 1024px
10. Test accessibility (keyboard nav, screen reader, reduced motion)
11. Visual verification at 320px, landscape, iOS safe area

## Review Findings Incorporated

This plan was reviewed by three parallel agents (architecture, simplicity, pattern consistency). Key changes from v1:

1. **Dropped CSS Grid animation** — simple `hidden` toggle instead of `0fr → 1fr` Grid trick. Eliminates the `hidden` + `display: grid` conflict that all 3 reviewers flagged.
2. **Flattened pyramid DOM** — single flex container instead of two wrapper divs. Layout emerges from content, not structure.
3. **Module `<script>`** — no `astro:page-load` wrapper or sentinel guard needed for non-persisted components.
4. **Dropped close-on-outside-tap** — eliminates document-level click listener and accumulation risk.
5. **Changed `<header>` to `<div>`** — avoids duplicate `banner` landmark.
6. **Added `border-bottom` directly** — not via `::after`, matching tab-bar pattern.
7. **Added `data-match` on all links** — required for `updateActiveStates` to work after view transitions.
8. **Added `position: relative` on `.pyramid-link`** — required for `::after` underline positioning.
9. **Added hover states** — on name, chevron, and pyramid links, matching codebase convention.
10. **Scoped work.astro change** — only adding `font-size`, existing mobile rules already present.
11. **Included `.mobile-name` in `updateActiveStates` selector** — has `data-match="exact"`, handled by existing loop logic.

## References

- **Brainstorm:** `docs/brainstorms/2026-02-20-mobile-holistic-redesign-brainstorm.md`
- **Event listener gotcha:** `docs/solutions/ui-bugs/event-listener-accumulation-persistent-sidebar-System-20260217.md`
- **Scoped style specificity:** `docs/solutions/ui-bugs/scoped-style-specificity-global-override-System-20260217.md`
- **Active state pattern:** `docs/plans/2026-02-17-feat-multi-page-site-architecture-plan.md`
- **Fluid layout tokens:** `docs/plans/2026-02-19-feat-responsive-fluid-layout-all-screens-plan.md`
- **Persistent sidebar plan:** `docs/plans/2026-02-18-feat-persistent-sidebar-nav-redesign-plan.md`
