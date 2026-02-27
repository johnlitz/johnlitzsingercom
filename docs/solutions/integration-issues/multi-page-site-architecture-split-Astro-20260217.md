---
title: Multi-Page Architecture Migration - Single-Page to Standalone Routes
category: integration-issues
date: 2026-02-17
severity: medium
component: Navigation, Page Structure, Routing
tags: ['astro', 'routing', 'navigation', 'multi-page', 'refactor', 'formspree', 'contact-form', 'sidebar', 'active-state']
symptoms: "Single-page site with hash navigation (/#projects, /#contact) limited content growth; hash links prevented proper sidebar active states; no room for expanded project descriptions or contact form; content couldn't scale independently"
root_cause: "Monolithic single-page architecture with hash-based navigation incompatible with multi-section content expansion and proper accessibility patterns"
resolution: "Split into 5 standalone pages (Home, Work, Projects, Contact, Writing) plus /contact/thanks. Updated sidebar nav from hash anchors to real routes with active states via aria-current. Added Formspree contact form with honeypot spam protection. Configured trailingSlash: 'never' to prevent active-state mismatches."
---

# Multi-Page Site Architecture Split

## Problem

The personal website (johnlitzsinger.com, Astro 5 static site) had all content on a single page with hash-link navigation (`/#projects`, `/#contact`). This created several limitations:

- No room for expanded content (work entries limited to one-line summaries)
- Projects couldn't have rich descriptions or multiple links
- No contact form — just three plain links
- Sidebar active states didn't work for hash links (Projects and Contact had no `aria-current` or `.active` class)
- Content couldn't grow independently per section

The Sidebar.astro component used hash anchors for navigation:

```astro
<a href="/" class:list={['nav-link', { active: currentPath === '/' }]}>Work</a>
<a href="/#projects" class="nav-link">Projects</a>
<a href="/#contact" class="nav-link">Contact</a>
```

## Root Cause

The architecture treated the site as a single scrollable page rather than multiple discrete pages. This created cascading issues:

1. **Path comparison failure** — Hash links (`/#projects`) don't change `Astro.url.pathname`, so there was no clean way to determine which "section" was active in the sidebar
2. **Content scaling** — All sections shared one page, preventing independent growth
3. **Form routing** — Contact form submissions needed a separate success page (`/contact/thanks`), but there was no dedicated contact route
4. **SEO limitations** — Each section couldn't have unique metadata, titles, or descriptions

## Solution

### Phase 1: Foundation — Config and Sidebar

**Added `trailingSlash: 'never'`** to `astro.config.mjs` to ensure consistent path comparison. Without this, Vercel may serve `/work/` which would fail the `=== '/work'` check for active states.

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://johnlitzsinger.com',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/draft/') && !page.includes('/contact/thanks'),
    }),
  ],
});
```

**Updated sidebar navigation** from hash anchors to real routes with active state bindings:

```astro
<a href="/work" class:list={['nav-link', { active: currentPath === '/work' }]}
   aria-current={currentPath === '/work' ? 'page' : undefined}>Work</a>
<a href="/projects" class:list={['nav-link', { active: currentPath === '/projects' }]}
   aria-current={currentPath === '/projects' ? 'page' : undefined}>Projects</a>
<a href="/contact" class:list={['nav-link', { active: currentPath.startsWith('/contact') }]}
   aria-current={currentPath.startsWith('/contact') ? 'page' : undefined}>Contact</a>
```

**Updated mobile nav close handler** from hash-only to all links, with current-page detection:

```js
// Before: only hash links
nav.querySelectorAll('a[href*="#"]').forEach(link => { /* ... */ });

// After: all links, with current-page prevention
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', (e) => {
    if (link.getAttribute('href') === window.location.pathname) {
      e.preventDefault(); // Don't navigate, just close nav
    }
    toggle.setAttribute('aria-expanded', 'false');
    nav.hidden = true;
  });
});
```

### Phase 2: Homepage Strip

Removed all component imports from `index.astro`. Reduced to tagline-only landing page. Homepage intentionally has no active nav state.

### Phase 3-4: New Pages (Work, Projects)

Created `/work` and `/projects` pages following the blog index pattern: `BaseLayout` wrapper, H1 at `--text-2xl`, entries with `border-top` rhythm.

Projects page introduced a multi-link data model:

```ts
links: Array<{ label: string; url: string }>
// Renders: "Live / GitHub" with separator
```

Used `:global()` pattern to override global `a` styles (documented Astro gotcha):

```css
/* Astro scoped styles have zero specificity vs global rules */
.links :global(a) {
  color: var(--secondary);
  text-decoration: none;
}
```

### Phase 5: Contact Form

Created `/contact` with Formspree form and honeypot spam protection:

```html
<!-- Honeypot: hidden from real users, catches bots -->
<div aria-hidden="true" style="position:absolute;left:-9999px;">
  <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" />
</div>
```

Created `/contact/thanks` with `noindex` meta tag. Added `noindex` prop support to `BaseHead` and `BaseLayout`.

### Phase 6-7: Cleanup

- Removed `.section-label` class from `global.css`
- Deleted 4 old components: `Experience.astro`, `Projects.astro`, `Writing.astro`, `Contact.astro`
- Updated 404 page with links to new routes
- Verified no remaining references to deleted components

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| `trailingSlash: 'never'` | Prevents Vercel from serving `/work/` which breaks `=== '/work'` comparison |
| `:global()` for link overrides | Astro scoped styles wrap in `:where()` with zero specificity |
| `data-bound` sentinel on toggle | Prevents event handler accumulation across view transitions |
| Keep `astro:after-swap` handler | Blog posts may use heading anchors — handler is harmless elsewhere |
| Inverted submit button | `--foreground` bg, `--background` text — visual distinction for primary action |

## Prevention Strategies

### 1. URL Normalization & Path Consistency
- Enforce trailing slash convention at the framework level from project start
- Use `Astro.url.pathname` as single source of truth for active state detection
- For nested routes (blog posts), use `startsWith()` for parent route matching

### 2. Scoped Style Specificity
- Use `:global()` sparingly with clear comments explaining why
- Global CSS for: resets, design tokens, generic element defaults
- Scoped CSS for: component-specific overrides

### 3. Event Handler Accumulation
- Wrap all event binding in `astro:page-load` (not initial script run)
- Use `data-bound` sentinel pattern on persistent DOM elements
- Prefer event delegation over individual listeners where possible

### 4. Navigation Handler Scope
- Write handlers for intent, not implementation (`nav.querySelectorAll('a')` not `a[href*="#"]`)
- Close mobile nav on every navigation action
- Include current-page detection to prevent unnecessary re-navigation

### 5. Third-Party Service Configuration
- Never deploy with placeholder service endpoints
- Add `// TODO:` comments with clear instructions for replacement
- Test form submission end-to-end before production deploy

## Testing Checklist

- [ ] All pages render at desktop (1280px+) and mobile (375px)
- [ ] Sidebar active state highlights correct link on every page
- [ ] Homepage has no active nav state
- [ ] Mobile nav opens/closes correctly
- [ ] Tapping current-page link on mobile closes nav without navigating
- [ ] View transitions work between all pages
- [ ] `noindex` meta tag only on `/contact/thanks`
- [ ] Sitemap excludes `/contact/thanks`, includes all new routes
- [ ] `npm run build` succeeds with zero errors
- [ ] Contact form submits successfully to Formspree
- [ ] Honeypot field is not keyboard-focusable

## Related Documentation

- **Brainstorm:** `docs/brainstorms/2026-02-17-multi-page-split-brainstorm.md`
- **Plan:** `docs/plans/2026-02-17-feat-multi-page-site-architecture-plan.md`
- **Superseded plan:** `docs/plans/2026-02-17-feat-projects-contact-sidebar-layout-plan.md`
- **Event listener accumulation:** `docs/solutions/ui-bugs/event-listener-accumulation-persistent-sidebar-System-20260217.md`
- **Cross-route anchor scroll:** `docs/solutions/ui-bugs/cross-route-anchor-scroll-failure-System-20260217.md`
- **Scoped style specificity:** `docs/solutions/ui-bugs/scoped-style-specificity-global-override-System-20260217.md`
- **Site restructure principles:** `docs/solutions/ui-bugs/site-restructure-rams-jobs-principles.md`

## Files Changed

**Created (4):** `src/pages/work.astro`, `src/pages/projects.astro`, `src/pages/contact.astro`, `src/pages/contact/thanks.astro`

**Modified (7):** `astro.config.mjs`, `src/components/Sidebar.astro`, `src/components/BaseHead.astro`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `src/pages/404.astro`, `src/styles/global.css`

**Deleted (4):** `src/components/Experience.astro`, `src/components/Projects.astro`, `src/components/Writing.astro`, `src/components/Contact.astro`
