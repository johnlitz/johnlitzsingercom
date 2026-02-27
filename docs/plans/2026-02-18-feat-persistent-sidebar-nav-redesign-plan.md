---
title: "feat: Persistent sidebar navigation across all pages"
type: feat
date: 2026-02-18
deepened: 2026-02-18
---

# Persistent Sidebar Navigation Redesign

## Enhancement Summary

**Deepened on:** 2026-02-18
**Research agents used:** 12 (Astro view transitions, mobile tab nav, fixed sidebar patterns, Rick Rubin, Steve Jobs, Dieter Rams, architecture strategist, code simplicity reviewer, performance oracle, security sentinel, pattern recognition specialist, frontend races reviewer)

### Key Improvements from Research
1. **BUG FIX:** Active state logic mismatch between server (exact match) and client JS (prefix match) — use `data-match` attributes for single source of truth
2. **Accessibility:** Add `aria-current="page"` to mobile tab bar (was missing)
3. **Performance:** Preload Lack-Regular.woff2 font, use `100dvh` instead of `100vh`
4. **Naming:** Rename `.tab` to `.tab-link` for pattern consistency
5. **Visual separation:** Use `background: var(--surface)` on sidebar instead of border-only
6. **Resilience:** Add bfcache restoration handler for stale active state after Formspree redirect
7. **CSS:** Add `overscroll-behavior: contain` to sidebar, scrollbar styling for dark theme

### New Considerations Discovered
- Sidebar scroll position preservation via `transition:persist` is automatic (DOM node survives swap)
- `transition:animate="none"` on sidebar prevents z-index stacking context issues during transitions
- Mobile tabs should be scrollable (`overflow-x: auto`) at 320px, not forced equal-width
- `viewport-fit=cover` needed for iOS safe area insets on sticky tab bar
- Hash-scroll handler from existing code MUST be preserved during refactor

---

## Overview

Replace the current dual-mode layout (340px sidebar on homepage / 72px spine strip on inner pages) with a **unified 340px sidebar** that persists across all pages. The sidebar always shows identity (name + tagline) and navigation links. The right panel shows hero-nav on the homepage and page content on inner pages. Mobile replaces the hamburger menu with **horizontal sticky tabs**.

After implementation, critique the design using principles from Rick Rubin, Steve Jobs, and Dieter Rams.

## Problem Statement

The current layout has three distinct navigation paradigms:
1. **Homepage desktop**: Full sidebar (identity only) + hero-nav in right panel
2. **Inner page desktop**: Narrow 72px spine strip + TopNav horizontal bar
3. **Mobile**: Hamburger dropdown (inner) or stacked full-screen nav (home)

This creates cognitive overhead. The user must relearn navigation context on every page transition. The spine strip, while visually interesting, provides no wayfinding value — it's decorative text that consumes 72px.

## Proposed Solution

**One layout paradigm for all pages:**

```
Desktop (all pages):
+------------------+----------------------------------+
|                  |                                  |
|  John            |   [Page content / Hero-nav]      |
|  Litzsinger      |                                  |
|                  |                                  |
|  tagline...      |                                  |
|                  |                                  |
|  Work            |                                  |
|  Projects        |                                  |
|  Writing         |                                  |
|  Contact         |                                  |
|  Resume          |                                  |
|                  |                                  |
|     340px        |          flex: 1                  |
+------------------+----------------------------------+

Mobile (all pages):
+------------------------------------------+
| Work | Projects | Writing | Contact      |  <- sticky tabs
+------------------------------------------+
|                                          |
|  [Page content]                          |
|                                          |
+------------------------------------------+
```

**Key behaviors:**
- Sidebar is `position: fixed`, `width: 340px`, always visible on desktop
- Sidebar background: `var(--surface)` for subtle visual separation from content
- Nav links in sidebar with active state (`--accent` color + underline) for current page
- No active nav link on homepage (`/`) — the name links home
- Homepage right panel: hero-nav (large visual links with descriptions)
- Inner page right panel: page content + footer
- Mobile: sticky horizontal tab bar replaces hamburger, no drawer
- Resume link opens PDF in new tab (`target="_blank"`)
- View transitions persist sidebar via `transition:persist`; active state updated via `astro:after-swap` script
- Sidebar has `overflow-y: auto` with `overscroll-behavior: contain` and dark-theme scrollbar styling

### Research Insights: Layout Strategy

**Best practice (from Akash Hamirwasia):** CSS Grid + `position: sticky` is recommended over `position: fixed` + `margin-left` for sidebar layouts because the coupling between sidebar width and content margin is defined in one place. However, `transition:persist` interacts more predictably with `position: fixed` (the element stays visually anchored regardless of DOM position during swaps). **Decision: Keep `position: fixed` for this iteration** for view transition compatibility.

**Sidebar visual separation:** In dark themes, shadows are nearly invisible. Use `background: var(--surface)` (`#141414`) against `var(--background)` (`#0a0a0a`) for natural separation. Add `border-right: 1px solid var(--border)` as secondary separator for light mode clarity.

**References:**
- [How to and not to build sidebar layouts (Akash Hamirwasia)](https://akashhamirwasia.com/blog/how-to-and-not-to-build-sidebar-layouts/)
- [Dynamically-sized sticky sidebar (CSS-Tricks)](https://css-tricks.com/a-dynamically-sized-sticky-sidebar-with-html-and-css/)

## Technical Approach

### Phase 1: Restructure LeftColumn — add sidebar nav

**File:** `src/components/LeftColumn.astro`

Remove the dual-mode (full/strip) architecture. Always render:
1. Name link (`John\nLitzsinger`) linking to `/`
2. Tagline paragraph
3. Vertical nav list: Work, Projects, Writing, Contact, Resume

The component now accepts `currentPath` as a prop to compute active states.

```astro
<!-- src/components/LeftColumn.astro -->
---
interface Props { currentPath: string; }
const { currentPath } = Astro.props;
---

<div class="sidebar-identity">
  <a href="/" class="name-full">John<br />Litzsinger</a>
  <p class="tagline">Finance student at Purdue...</p>
</div>

<nav class="sidebar-nav" aria-label="Main navigation">
  <a href="/work" data-match="exact"
     class:list={['sidebar-link', { active: currentPath === '/work' }]}
     aria-current={currentPath === '/work' ? 'page' : undefined}>Work</a>
  <a href="/projects" data-match="exact"
     class:list={['sidebar-link', { active: currentPath === '/projects' }]}
     aria-current={currentPath === '/projects' ? 'page' : undefined}>Projects</a>
  <a href="/blog" data-match="prefix"
     class:list={['sidebar-link', { active: currentPath.startsWith('/blog') }]}
     aria-current={currentPath.startsWith('/blog') ? 'page' : undefined}>Writing</a>
  <a href="/contact" data-match="prefix"
     class:list={['sidebar-link', { active: currentPath.startsWith('/contact') }]}
     aria-current={currentPath.startsWith('/contact') ? 'page' : undefined}>Contact</a>
  <a href="/John_Litzsinger_Resume.pdf" class="sidebar-link"
     target="_blank" rel="noopener noreferrer">Resume</a>
</nav>
```

**Sidebar nav styling:**
- Links: `--text-base`, `color: var(--muted)`, vertical stack with `gap: var(--space-3)`
- Hover: `color: var(--foreground)`, no underline
- Active: `color: var(--accent)`, `text-decoration: underline`, `text-underline-offset: 4px`, `text-decoration-thickness: 1px`
- Nav container: `margin-top: auto` with `padding-top: var(--space-lg)` (pushes nav to bottom of sidebar with minimum gap)
- Transitions: `transition: color var(--duration-fast) ease` with `prefers-reduced-motion: reduce` override

**Remove entirely:**
- `.left-strip` div and all `.name-strip` styles (spine is gone)
- All `:global([data-page="..."])` visibility toggles

### Research Insights: Active State Matching

**BUG FOUND by frontend races review:** The original plan used `path.startsWith(href)` for all links in the client-side `astro:after-swap` script, but the server template uses exact match (`===`) for `/work` and `/projects` and prefix match (`startsWith`) for `/blog` and `/contact`. If a future page like `/working-at-google` existed, the JS would incorrectly match `/work`.

**Fix:** Use `data-match="exact"` or `data-match="prefix"` attributes on each nav link so the client script reads the matching strategy from the DOM — single source of truth.

### Phase 2: Restructure BaseLayout — unified layout

**File:** `src/layouts/BaseLayout.astro`

**Remove:**
- `isHome` prop and all conditional logic based on it
- `data-page` attribute on `.site` div
- Mobile homepage stacked layout (`.mobile-home` and all children)
- Mobile hamburger header (`.mobile-header`, `.mobile-toggle`)
- Mobile slide-out nav (`.mobile-nav`)
- Conditional `{!isHome && <TopNav />}` rendering
- Width transitions on `.left-column` (it's always `--sidebar-width`)
- Margin transitions on `.site-main` (it's always `margin-left: var(--sidebar-width)`)
- Hamburger toggle JavaScript (the `astro:page-load` handler for `.mobile-toggle`)

**Add:**
- Pass `currentPath` to `LeftColumn`: `<LeftColumn currentPath={currentPath} />`
- `transition:persist="sidebar"` and `transition:name="sidebar"` and `transition:animate="none"` on `.left-column` div
- Mobile sticky tab bar (new HTML, all pages)
- `astro:after-swap` script to update sidebar active state after view transitions
- Bfcache restoration handler via `pageshow` event

**New mobile tab bar (replaces hamburger):**
```html
<nav class="tab-bar" aria-label="Site navigation">
  <a href="/work" data-match="exact"
     class:list={['tab-link', { active: currentPath === '/work' }]}
     aria-current={currentPath === '/work' ? 'page' : undefined}>Work</a>
  <a href="/projects" data-match="exact"
     class:list={['tab-link', { active: currentPath === '/projects' }]}
     aria-current={currentPath === '/projects' ? 'page' : undefined}>Projects</a>
  <a href="/blog" data-match="prefix"
     class:list={['tab-link', { active: currentPath.startsWith('/blog') }]}
     aria-current={currentPath.startsWith('/blog') ? 'page' : undefined}>Writing</a>
  <a href="/contact" data-match="prefix"
     class:list={['tab-link', { active: currentPath.startsWith('/contact') }]}
     aria-current={currentPath.startsWith('/contact') ? 'page' : undefined}>Contact</a>
</nav>
```

Resume excluded from mobile tabs (PDF link doesn't fit tab-bar mental model). Resume remains accessible from the desktop sidebar and the footer.

### Research Insights: Mobile Tab Bar

**Semantics (WAI-ARIA):** Do NOT use `role="tablist"` — that is for in-page panel switching, not page navigation. Use `<nav>` with `<a>` links styled as tabs. This is correct.

**Touch targets (WCAG 2.2 SC 2.5.8):** Minimum 44x44 CSS pixels recommended. Use `min-height: 44px` on tab links.

**Overflow at 320px:** Use scrollable tabs (`overflow-x: auto`, `flex-shrink: 0`, `white-space: nowrap`) rather than forced equal-width. Hide scrollbar visually.

**Active indicator:** Bottom border (2px) + color change. Never rely on color alone (WCAG 1.4.1).

**iOS safe areas:** Add `viewport-fit=cover` to `<meta name="viewport">` in BaseHead.astro. Use `padding-top: env(safe-area-inset-top, 0px)` on the tab bar.

**`position: sticky` performance:** Do NOT add `will-change: transform` preemptively. Only add if scroll jank is observed. Avoid `backdrop-filter` on sticky elements — expensive on mobile.

**Tab bar styling:**
```css
.tab-bar {
  display: none;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--background);
  border-bottom: 1px solid var(--border);
  padding-top: env(safe-area-inset-top, 0px);
}

.tab-bar::-webkit-scrollbar { display: none; }

.tab-link {
  flex-shrink: 0;
  white-space: nowrap;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  padding: 0 var(--space-md);
  font-size: var(--text-sm);
  color: var(--muted);
  text-decoration: none;
  position: relative;
  transition: color var(--duration-fast) ease;
}

.tab-link.active { color: var(--accent); }
.tab-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: var(--space-md);
  right: var(--space-md);
  height: 2px;
  background: var(--accent);
}

@media (max-width: 768px) {
  .tab-bar { display: flex; }
}

@media (prefers-reduced-motion: reduce) {
  .tab-link { transition: none; }
}
```

**References:**
- [W3C WAI Tabs Pattern (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [WCAG 2.2 Understanding 2.5.8: Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WebKit: Designing Websites for iPhone X (safe areas)](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)

**Active state persistence script (fixed version with data-match):**
```typescript
// Active state update — runs after view transition swap and bfcache restoration
// Class names must match LeftColumn.astro (.sidebar-link) and BaseLayout (.tab-link)
function updateActiveStates(path: string) {
  document.querySelectorAll('.sidebar-link, .tab-link').forEach((link) => {
    const href = link.getAttribute('href');
    const match = link.getAttribute('data-match');
    if (!href || !match) return;

    const isActive = match === 'exact'
      ? path === href
      : path.startsWith(href);

    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

// After view transition swap (sidebar is persisted, needs JS update)
document.addEventListener('astro:after-swap', () => {
  updateActiveStates(window.location.pathname);
});

// After bfcache restoration (e.g., back from /contact/thanks)
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    updateActiveStates(window.location.pathname);
  }
});

// Preserve hash-scroll handler from existing code
document.addEventListener('astro:after-swap', () => {
  const hash = window.location.hash;
  if (!hash) return;
  try {
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({ behavior: 'instant' });
  } catch { /* invalid selector in hash, ignore */ }
});
```

**Layout CSS changes:**
```css
.left-column {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);  /* always 340px */
  height: 100dvh;  /* dvh respects mobile browser chrome */
  z-index: 50;
  overflow-y: auto;
  overscroll-behavior: contain;  /* prevent scroll chaining */
  background: var(--surface);  /* subtle visual separation */
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-color: var(--muted) transparent;
}

/* Sidebar internal layout */
.left-column-inner {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: var(--space-xl) var(--space-lg);
}

.sidebar-nav {
  margin-top: auto;
  padding-top: var(--space-lg);  /* minimum gap even on short viewports */
}

.site-main {
  flex: 1;
  min-height: 100dvh;
  margin-left: var(--sidebar-width);  /* always 340px */
  display: flex;
  flex-direction: column;
  padding: var(--space-xl) var(--gutter);
}

/* View transition — prevent sidebar animation and z-index issues */
::view-transition-group(sidebar) {
  z-index: 100;
}

@media (max-width: 768px) {
  .left-column { display: none; }
  .site-main { margin-left: 0; padding: 0 var(--space-md) var(--space-lg); }
}

@media (max-height: 600px) {
  .left-column-inner {
    padding: var(--space-md);
  }
}

@media (prefers-reduced-motion: reduce) {
  .left-column { transition: none; }
}
```

### Research Insights: View Transitions

**`transition:persist` behavior:** The directive moves (not clones) the sidebar DOM into the new page during swap. Scroll position, event listeners, and component state survive. `astro:after-swap` fires AFTER the persisted element is in the new DOM, so `querySelectorAll` will find it.

**`transition:animate="none"`:** Prevents Astro from creating snapshot images of the sidebar, avoiding z-index stacking context issues where the sidebar could slip behind animating content.

**Rapid navigation:** If the user double-clicks or navigates quickly, the last `astro:after-swap` wins (class toggling is idempotent). No debouncing needed unless visual glitching is observed.

**References:**
- [Astro View Transitions docs](https://docs.astro.build/en/guides/view-transitions/)
- [Persistent Sidebar with Astro (JB Hutch)](https://jbhutch.com/blog/astro-with-peristent-sidebar/)
- [View Transitions and Stacking Context (Nic Chan)](https://www.nicchan.me/blog/view-transitions-and-stacking-context/)

### Phase 3: Remove TopNav

**File:** `src/components/TopNav.astro`

Delete this file entirely. Navigation is now handled by:
- Desktop: sidebar nav in `LeftColumn.astro`
- Mobile: tab bar in `BaseLayout.astro`

### Phase 4: Update page files

**`src/pages/index.astro`:**
- Remove `isHome` prop from `<BaseLayout>`
- Keep the hero-nav as page content (large visual links in right panel)
- The hero-nav is the homepage content — it's what fills the right panel

**Note on homepage nav redundancy:** The hero-nav duplicates the sidebar links. This is intentional — the hero-nav serves as a "landing page" experience with visual weight and descriptions ("Where I've built and what I've learned"). The sidebar nav is persistent wayfinding. If the redundancy feels wrong after implementation, the critique phase will flag it.

**All other pages (`work.astro`, `projects.astro`, `blog/index.astro`, `contact.astro`, etc.):**
- Remove `isHome={false}` if explicitly set (it defaults to not-home, but this prop is removed entirely)
- No other changes needed — they already render content in `<slot />`

**`src/layouts/BlogPostLayout.astro`:**
- Remove any `isHome` passing if present
- Should work unchanged since it wraps `BaseLayout`

### Phase 5: CSS + HTML cleanup

**`src/styles/global.css`:**
- Remove `--strip-width: 72px` custom property (spine is gone)
- Update skip-nav: `left` to `calc(var(--sidebar-width) + var(--space-md))` on desktop, reset to `var(--space-md)` on mobile
- Add global scrollbar styling: `scrollbar-width: thin; scrollbar-color: var(--muted) transparent`

**`src/components/BaseHead.astro`:**
- Add font preload: `<link rel="preload" href="/fonts/Lack-Regular.woff2" as="font" type="font/woff2" crossorigin />`
- Update viewport meta: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />`

**Optional: `vercel.json` (security headers):**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

### Phase 6: Design Critique

After implementation is complete, perform a structured critique using three design philosophies. The research for these has already been completed (see Design Critique Rubrics section below).

**Critique process:**
1. Build and deploy to dev server
2. Take full-page screenshots (desktop + mobile, dark + light)
3. Run `interface-design:critique` skill with screenshots
4. Apply the Rubin/Jobs/Rams rubrics (documented below) to the screenshots
5. Write critique document with specific, actionable findings
6. Implement the strongest critique findings (top 3-5 changes)

## Acceptance Criteria

### Functional
- [ ] Sidebar (340px) renders on every page with identity + nav links
- [ ] Active nav link highlighted with `--accent` on current page
- [ ] No active link on homepage (`/`)
- [ ] Clicking a sidebar nav link navigates to the correct page with view transition
- [ ] Sidebar persists across view transitions without flashing
- [ ] Active state updates correctly after view transition (uses `data-match` for server/client parity)
- [ ] Resume opens in new tab
- [ ] Homepage right panel shows hero-nav with large links
- [ ] Mobile shows sticky horizontal tabs (no hamburger)
- [ ] Mobile tab active state matches current page with `aria-current="page"`
- [ ] Blog post pages show "Writing" as active in sidebar/tabs
- [ ] Active state correct after bfcache restoration (browser back from `/contact/thanks`)

### Non-functional
- [ ] Sidebar scrolls independently on short viewports (`overflow-y: auto`)
- [ ] Sidebar scroll does not chain to main content (`overscroll-behavior: contain`)
- [ ] Skip-nav link appears right of sidebar when focused (resets on mobile)
- [ ] `prefers-reduced-motion` disables all transitions (sidebar links AND tab links)
- [ ] Light mode renders correctly (border, surface background, colors)
- [ ] No duplicate event listeners (script at BaseLayout root, outside `transition:persist` boundary)
- [ ] Hash-scroll handler preserved from existing code (with try-catch)
- [ ] Font preloaded for reduced FOUT

### Quality Gates
- [ ] `npm run build` succeeds with no errors
- [ ] All pages render at 1280px (desktop) and 375px (mobile)
- [ ] Design critique completed with Rubin/Jobs/Rams analysis
- [ ] Top 3-5 critique findings implemented

## Files to Modify

| Action | File | Purpose |
|--------|------|---------|
| Modify | `src/components/LeftColumn.astro` | Remove spine, add sidebar nav with `data-match` attributes, accept `currentPath` prop |
| Modify | `src/layouts/BaseLayout.astro` | Remove dual-mode, add tab bar with `aria-current`, add `transition:persist`, active state script with `data-match`, bfcache handler |
| Delete | `src/components/TopNav.astro` | Replaced by sidebar nav + tab bar |
| Modify | `src/pages/index.astro` | Remove `isHome` prop |
| Modify | `src/styles/global.css` | Remove `--strip-width`, update skip-nav, add scrollbar styling |
| Modify | `src/components/BaseHead.astro` | Add font preload, update viewport meta for safe areas |
| Create | `vercel.json` | Security headers (optional) |
| Review | `src/pages/work.astro` | Verify renders correctly |
| Review | `src/pages/projects.astro` | Verify renders correctly |
| Review | `src/pages/blog/index.astro` | Verify renders correctly |
| Review | `src/pages/blog/[...slug].astro` | Verify "Writing" active state |
| Review | `src/pages/contact.astro` | Verify renders correctly |
| Review | `src/pages/contact/thanks.astro` | Verify "Contact" active via prefix match |
| Review | `src/pages/404.astro` | Verify no active link |

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Sidebar active state stale after view transition | `astro:after-swap` script with `data-match` attributes for server/client parity |
| Active state logic mismatch between server and client | `data-match="exact"` / `data-match="prefix"` attributes — single source of truth |
| Mobile tabs overflow on 320px viewport | Scrollable tabs with `overflow-x: auto`, `flex-shrink: 0`, hidden scrollbar |
| Content cramped at 769-1100px viewports | Accept — content reflows naturally, sidebar stays 340px |
| Formspree redirect breaks sidebar persistence | Accept full reload on `/contact/thanks`. Add `pageshow` bfcache handler for back-nav. |
| Sidebar z-index during view transition | `transition:animate="none"` + `::view-transition-group(sidebar) { z-index: 100 }` |
| `querySelector(hash)` throws on malformed hash | Wrap in try-catch (robustness, not security) |
| Hash-scroll handler accidentally deleted during refactor | Explicitly preserve in plan; test after implementation |
| iOS notch overlaps sticky tabs | `viewport-fit=cover` + `env(safe-area-inset-top)` padding |
| FOUT on sidebar text | Preload Lack-Regular.woff2 |

## Design Critique Rubrics (Pre-Researched)

### Rick Rubin — 7 Evaluation Criteria

| # | Criterion | Core Question |
|---|-----------|---------------|
| 1 | Subtraction Test | Would removing this element improve the whole? Mute one thing at a time. |
| 2 | Silence Audit | Is the whitespace intentional and doing work, or leftover from padding defaults? |
| 3 | Ego Check | Does this serve the visitor or the designer? If it requires explanation, it serves the designer. |
| 4 | Beginner's Mind | Would a first-time visitor understand the site in 3 seconds? |
| 5 | Authenticity Inventory | Could this site only belong to this person, or is it a template with a name swap? |
| 6 | Emotional Core | What is the ONE feeling the site should produce? Does every element serve it? |
| 7 | Quality of Attention | How many things compete for focus simultaneously? (Should be 2-3 at most.) |

### Steve Jobs — 7 Evaluation Criteria

| # | Criterion | Core Question |
|---|-----------|---------------|
| 1 | Five-Second Verdict | Can a stranger understand the site's purpose instantly? |
| 2 | Discipline of No | Does every element justify its existence? Has enough been removed? |
| 3 | Form Is Function | Does the sidebar layout make the site *work* better, not just look different? |
| 4 | Authentic Simplicity | Is this refined minimalism or dressed-up emptiness? |
| 5 | Human Intersection | Does the site feel like a person built it, not a template? |
| 6 | Pixel-Perfect Detail | Does every spacing, color, and hover state follow a coherent system? |
| 7 | The Whole Widget | Do sidebar, nav, content, and footer operate as one unified product? |

### Dieter Rams — 10 Principles Applied

| # | Principle | Key Question for This Site |
|---|-----------|--------------------------|
| 1 | Innovative | Does the dual-width transition solve a real problem or just show off? |
| 2 | Useful | Can a visitor find work, read writing, and contact you within 10 seconds? |
| 3 | Aesthetic | Does the single-accent achromatic palette create cohesion or monotony? |
| 4 | Understandable | Would a wireframe-only version still communicate the hierarchy? |
| 5 | Unobtrusive | When reading a blog post, does the visitor forget the design exists? |
| 6 | Honest | Does the design polish match the depth of content? |
| 7 | Long-lasting | In 5 years, will this still look intentional or like a 2026 snapshot? |
| 8 | Thorough | Is every spacing value, focus ring, and selection color intentional? |
| 9 | Environmentally friendly | What is the total page weight? Is any resource loaded but never used? |
| 10 | As little as possible | Is there any element that, if removed, the site still communicates equally well? |

## References

### Internal
- Current LeftColumn: `src/components/LeftColumn.astro`
- Current BaseLayout: `src/layouts/BaseLayout.astro`
- Current TopNav: `src/components/TopNav.astro`
- Design tokens: `src/styles/global.css:30-78`

### Institutional Learnings (docs/solutions/)
- Event listener accumulation: `ui-bugs/event-listener-accumulation-persistent-sidebar-System-20260217.md`
- Multi-page architecture: `integration-issues/multi-page-site-architecture-split-Astro-20260217.md`
- Mobile layout gotchas: `ui-bugs/mobile-content-hidden-data-page-layout-System-20260217.md`
- Cross-route anchor scroll: `ui-bugs/cross-route-anchor-scroll-failure-System-20260217.md`
- Scoped style specificity: `ui-bugs/scoped-style-specificity-global-override-System-20260217.md`
- Design system drift: `ui-bugs/design-system-drift-System-20260215.md`
- Site structure principles: `ui-bugs/site-restructure-rams-jobs-principles.md`

### External Research
- [Astro View Transitions docs](https://docs.astro.build/en/guides/view-transitions/)
- [Persistent Sidebar with Astro (JB Hutch)](https://jbhutch.com/blog/astro-with-peristent-sidebar/)
- [View Transitions and Stacking Context (Nic Chan)](https://www.nicchan.me/blog/view-transitions-and-stacking-context/)
- [Sidebar layout patterns (Akash Hamirwasia)](https://akashhamirwasia.com/blog/how-to-and-not-to-build-sidebar-layouts/)
- [W3C WAI Tabs Pattern (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [WCAG 2.2 SC 2.5.8: Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WebKit: Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
- [CSS scrollbar styling (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scrollbars_styling)
- [Designing Beautiful Shadows (Josh Comeau)](https://www.joshwcomeau.com/css/designing-shadows/)
