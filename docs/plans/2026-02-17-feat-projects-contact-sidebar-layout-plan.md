---
title: "feat: Add Projects section, Contact section & widen sidebar"
type: feat
date: 2026-02-17
deepened: 2026-02-17
---

# Add Projects Section, Contact Section & Widen Sidebar

## Enhancement Summary

**Deepened on:** 2026-02-17
**Research agents used:** best-practices-researcher, framework-docs-researcher, architecture-strategist, code-simplicity-reviewer, pattern-recognition-specialist, performance-oracle, security-sentinel, julik-frontend-races-reviewer, Context7 (Astro docs)

### Bugs Found in Original Plan (3)
1. **Mobile nav close handler uses wrong state mechanism** — plan used `classList.remove('open')` but existing code uses `nav.hidden`/`aria-expanded`. The close-on-anchor handler would silently do nothing.
2. **Duplicate event listeners accumulate** — `astro:page-load` fires on every soft navigation, but the sidebar DOM is persistent (outside `<slot>`). Handlers stack and break the toggle after 2+ navigations.
3. **Cross-route anchor scroll may fail** — view transition animation competes with hash scroll. Needs explicit scroll handler in `astro:after-swap`.

### Simplifications Applied (4)
1. Replaced `const Tag`/`linkProps` abstraction with explicit ternary — immediately readable, no dynamic tags
2. Dropped `.linked` CSS class — style `a.entry` directly, HTML tag is the semantic differentiator
3. Removed hover arrow indicator — premature polish for placeholder data
4. Dropped `.entry-title` class on `<h3>` — match Experience.astro which styles via scoped `h3`

### Architecture Improvements (3)
1. Extract `.section-label` to global.css — currently duplicated across 4 components
2. Add `aria-current="page"` to active nav links for accessibility
3. Add `data-bound` sentinel to prevent duplicate event listener accumulation

---

## Overview

Three coordinated changes to the homepage:

1. **Projects section** — New homepage section showcasing projects with placeholder data, following the Experience.astro inline-array pattern
2. **Contact section** — Homepage section with Email, LinkedIn, and GitHub links (no form, stays fully static)
3. **Sidebar width** — Increase `--sidebar-width` from 280px to 340px for better visual proportions

All changes preserve the fully static output mode. No new dependencies.

## Proposed Solution

Follow the established section component pattern: self-contained `.astro` files with scoped styles, imported as zero-prop components in `index.astro`. Update the sidebar nav to include anchor links for the new sections. Change a single CSS custom property for the width.

## Technical Considerations

### Navigation architecture (critical)

The sidebar currently has page-level links (`/`, `/blog`, resume PDF). The new "Projects" and "Contact" links are anchor-based. Key decisions:

- **Use `/#projects` and `/#contact`** (not `#projects`) so they work from `/blog` and blog post pages
- **Keep "Work" as `href="/"`** and "Writing" as `href="/blog"` — accept the mixed link types since both have semantic meaning (Work = homepage, Writing = blog index)
- **Mobile nav must close on anchor tap** — currently the toggle only listens to the hamburger button. Without this, the nav overlay blocks the scrolled-to section

#### Research Insights: ClientRouter Hash Navigation

**Astro's ClientRouter handles hash navigation in two distinct paths:**

1. **Same-page hash** (clicking `#projects` while on `/`): Takes a **fast path** — skips the entire view transition pipeline. No `astro:before-preparation`, no `astro:after-swap`, no `astro:page-load` fires. Delegates to browser-native `location.href` assignment for instant scroll.

2. **Cross-page hash** (clicking `/#projects` from `/blog`): Triggers the **full transition pipeline** — fetch, swap, animation, then native hash scroll after the swap.

**Known issue:** [withastro/astro#15086](https://github.com/withastro/astro/issues/15086) — if the server issues a trailing-slash redirect, the hash fragment is stripped. Always include trailing slash before hash: `/#projects` not `/projects#projects`. Our links are `/#projects` (root path, no redirect risk), so we're safe.

**Cross-route scroll workaround required:** The view transition animation may compete with the hash scroll. The scroll position is set during the swap, but the animation is still playing. Add an explicit scroll handler:

```javascript
document.addEventListener('astro:after-swap', () => {
  const hash = window.location.hash;
  if (!hash) return;
  const target = document.querySelector(hash);
  if (target) target.scrollIntoView({ behavior: 'instant' });
});
```

Use `behavior: 'instant'` — smooth scrolling layered on a crossfade transition looks like dueling animations.

**Source:** Astro router source (`node_modules/astro/dist/transitions/router.js` lines 231-248), Astro View Transitions docs.

### Active state logic

Anchor links share the same pathname (`/`). No scroll-spy behavior — "Work" remains the active link on the homepage. "Projects" and "Contact" nav links never show an active state. This avoids complexity and matches the simplicity of the current nav.

#### Research Insight: Accessibility

Add `aria-current="page"` alongside the visual `.active` class for screen reader support. Style the active state off the ARIA attribute to keep styling and semantics in sync:

```astro
<a
  href="/"
  class:list={['nav-link', { active: currentPath === '/' }]}
  aria-current={currentPath === '/' ? 'page' : undefined}
>Work</a>
```

```css
.nav-link[aria-current="page"] {
  color: var(--foreground);
}
```

**Source:** W3C WAI Menu Structure Tutorial, WAI-ARIA `aria-current` specification.

### Sidebar contact info

**Keep sidebar contact info** (email + LinkedIn in sidebar-bottom). Removing it would leave blog pages and blog posts with zero visible contact information. The minor homepage redundancy is acceptable.

### Sidebar width squeeze zone

At 340px sidebar, viewports between 769px and ~900px have a narrower content area. At 769px: `769 - 340 - 64 = 365px` usable. Keep the 768px mobile breakpoint but flag as a QA checkpoint.

#### Research Insight: Squeeze Zone Mitigation

If content looks cramped after implementation, consider a targeted media query that narrows the sidebar in the squeeze zone:

```css
@media (min-width: 769px) and (max-width: 1080px) {
  :root {
    --sidebar-width: 280px;  /* Fall back to original width */
    --gutter: 1.25rem;       /* Tighter gutter */
  }
}
```

This uses the same single-token pattern — changing `--sidebar-width` cascades to both sidebar and content offset. Only add if QA reveals a problem; do not pre-optimize.

### Astro specificity

Scoped styles use `:where()` (specificity 0). Global link styles (`a { color: ... }`) override component styles.

#### Research Insight: Specificity Workarounds

Three strategies discovered, in order of preference:

1. **`:global()` for targeted overrides** (recommended for this project):
   ```css
   .links :global(a) { text-decoration: none; color: var(--secondary); }
   .links :global(a:hover) { color: var(--accent); }
   ```
   The `:global()` wrapper gives the selector its full specificity without changing project-wide behavior.

2. **Double-class specificity bypass:**
   ```css
   .entry.entry:hover h3 { color: var(--accent); }
   ```

3. **Switch `scopedStyleStrategy` to `'class'`** in `astro.config.mjs` — adds real class specificity to all scoped selectors. Only if specificity conflicts become widespread.

**Source:** Astro Styles and CSS docs, scopedStyleStrategy config reference.

### ClientRouter + anchor hashes

See "Research Insights: ClientRouter Hash Navigation" above. The `astro:after-swap` scroll handler is **required**, not optional.

### Event listener lifecycle (NEW — bug fix)

The sidebar DOM is **persistent** across view transitions (it lives outside `<main>` in BaseLayout). `astro:page-load` fires on every soft navigation. Without a guard, event handlers accumulate on the same DOM nodes — the toggle gets multiple click handlers that flip state in sequence, leaving it in an unpredictable state.

**Fix:** Add a `data-bound` sentinel:

```javascript
document.addEventListener('astro:page-load', () => {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.mobile-nav');
  if (!toggle || !nav) return;
  if (toggle.dataset.bound) return;  // Already wired up
  toggle.dataset.bound = 'true';

  // ... attach handlers once ...
});
```

**Note:** `astro:page-load` does NOT fire for same-page hash navigation (fast path). If code needs to run on hash change, use the native `hashchange` event instead.

**Source:** Astro router source analysis, frontend race conditions review.

## Acceptance Criteria

### Projects Section
- [ ] `src/components/Projects.astro` exists with inline data array (2-3 placeholder projects)
- [ ] Each project has: `title` (required), `description` (required), `tech` (optional), `url` (optional)
- [ ] Entries with `url` render as `<a>` with `target="_blank" rel="noopener noreferrer"`
- [ ] Entries without `url` render as `<div>` — no hover interaction suggesting clickability
- [ ] Section follows pattern: `<section id="projects" aria-label="Projects">` with `<h2 class="section-label">PROJECTS</h2>` and `.list` > `.entry` structure
- [ ] Title styled via scoped `h3` (no `.entry-title` class — matches Experience.astro pattern)
- [ ] Uses design tokens: `--content-max`, `--space-xl`, `--border`, `--accent`, `--secondary`, etc.
- [ ] No hard-coded px/rem values — all spacing, color, and typography use CSS custom properties
- [ ] Responsive at 768px breakpoint

### Contact Section
- [ ] `src/components/Contact.astro` exists with three links: Email (`mailto:jlitzsin@purdue.edu`), LinkedIn, GitHub
- [ ] Links use `target="_blank" rel="noopener noreferrer"` (except mailto which needs no target)
- [ ] Vertical link layout matching the site's vertical rhythm
- [ ] Section follows the same pattern: `<section id="contact" aria-label="Contact">`, section-label, etc.
- [ ] Uses `.links` container (not `.list`) — justified since these are flat links, not structured entries
- [ ] Link styles override global `a` styles using `:global()` wrapper
- [ ] No contact form, no external dependencies
- [ ] Appropriate bottom spacing as the terminal section (works with `<main>` padding)

### Sidebar & Layout
- [ ] `--sidebar-width` updated from `280px` to `340px` in `src/styles/global.css`
- [ ] `.section-label` base styles extracted to `global.css` (deduplicated from component scoped styles)
- [ ] Sidebar nav includes "Projects" (`/#projects`) and "Contact" (`/#contact`) links
- [ ] Nav link order: Work, Projects, Writing, Contact, Resume
- [ ] Active nav links include `aria-current="page"` attribute
- [ ] Anchor links work from `/blog` and blog post pages (use `/#` prefix)
- [ ] Mobile nav closes when an anchor link is tapped (uses `nav.hidden = true` and `aria-expanded`, NOT `classList`)
- [ ] Event listeners guarded with `data-bound` sentinel to prevent accumulation
- [ ] Cross-route anchor scroll handled via `astro:after-swap` handler
- [ ] Sidebar contact info (email + LinkedIn) retained in sidebar-bottom
- [ ] No visual breakage at 1024px, 1280px, 1440px viewports

### Homepage Composition
- [ ] Section order in `index.astro`: Intro -> Experience -> Projects -> Writing -> Contact
- [ ] Both new components imported and placed as zero-prop children

## Implementation Plan

### Phase 1: Global CSS changes

**File: `src/styles/global.css`**

1. Change `--sidebar-width: 280px` to `--sidebar-width: 340px` (line 69)
2. Extract `.section-label` base styles from component scoped styles to global.css:

```css
.section-label {
  font-size: var(--text-sm);
  letter-spacing: 0.08em;
  color: var(--accent);
  margin-bottom: var(--space-md);
}
```

This is currently duplicated in Experience.astro and Writing.astro (with slight variations). Extracting to global.css means Projects.astro and Contact.astro inherit it without copy-pasting. Component scoped styles can still override specific properties (e.g., Writing omits `margin-bottom`).

**Note:** Do NOT add `text-transform: uppercase` — existing labels use literal uppercase strings (`"WORK"`, `"WRITING"`). Keep that convention.

### Phase 2: Projects section component

**Create: `src/components/Projects.astro`**

Use explicit ternary instead of dynamic tag abstraction — immediately readable, no `const Tag` indirection:

```astro
---
const projects = [
  {
    title: 'Project Title One',
    description: 'Brief description of what this project does and why it matters.',
    tech: 'Astro / React',
    url: 'https://example.com',
  },
  {
    title: 'Project Title Two',
    description: 'Another project description with enough detail to be useful.',
    tech: 'Python / FastAPI',
  },
  {
    title: 'Project Title Three',
    description: 'A third project to fill out the section.',
    tech: 'TypeScript',
    url: 'https://github.com/example',
  },
];
---

<section id="projects" aria-label="Projects">
  <h2 class="section-label">PROJECTS</h2>
  <div class="list">
    {projects.map(project => project.url ? (
      <a href={project.url} target="_blank" rel="noopener noreferrer" class="entry">
        <div class="entry-header">
          <h3>{project.title}</h3>
          {project.tech && <span class="tech">{project.tech}</span>}
        </div>
        <p class="summary">{project.description}</p>
      </a>
    ) : (
      <div class="entry">
        <div class="entry-header">
          <h3>{project.title}</h3>
          {project.tech && <span class="tech">{project.tech}</span>}
        </div>
        <p class="summary">{project.description}</p>
      </div>
    ))}
  </div>
</section>
```

**Why explicit ternary over dynamic `Tag`:** The `const Tag = project.url ? 'a' : 'div'` with `linkProps` spread is a React idiom that works in Astro but reads as unfamiliar indirection. With 2-3 placeholder entries, the minor HTML duplication is a worthy tradeoff for immediate readability. The `<a>` vs `<div>` tag name is the semantic differentiator — no `.linked` class needed.

**Scoped styles:**

```css
section {
  max-width: var(--content-max);
  margin-bottom: var(--space-xl);
}

/* .section-label inherited from global.css */

.list {
  display: flex;
  flex-direction: column;
}

.entry {
  padding: var(--space-6) 0;
  border-top: 1px solid var(--border);
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

h3 {
  color: var(--foreground);
  font-size: var(--text-base);
  font-weight: 400;
}

/* Linked entries: style via tag selector, no .linked class */
a.entry {
  text-decoration: none;
  display: block;
  cursor: pointer;
}

a.entry:hover h3 {
  color: var(--accent);
}

.tech {
  font-size: var(--text-sm);
  color: var(--muted);
}

.summary {
  color: var(--secondary);
  font-size: var(--text-sm);
  margin-top: var(--space-xs);
}

@media (max-width: 768px) {
  .entry-header {
    flex-direction: column;
    gap: var(--space-xs);
  }
}
```

**Specificity note:** If global `a { color: var(--accent); text-decoration: underline; }` overrides the scoped `a.entry` styles, use `:global()`:

```css
section :global(a.entry) { text-decoration: none; color: inherit; }
section :global(a.entry:hover) h3 { color: var(--accent); }
```

### Phase 3: Contact section component

**Create: `src/components/Contact.astro`**

```astro
<section id="contact" aria-label="Contact">
  <h2 class="section-label">CONTACT</h2>
  <div class="links">
    <a href="mailto:jlitzsin@purdue.edu">jlitzsin@purdue.edu</a>
    <a href="https://linkedin.com/in/johnlitzsinger" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    <a href="https://github.com/johnlitz" target="_blank" rel="noopener noreferrer">GitHub</a>
  </div>
</section>
```

**Scoped styles:**

```css
section {
  max-width: var(--content-max);
  /* No margin-bottom — terminal section. <main> padding handles bottom space. */
}

/* .section-label inherited from global.css */

/* .links instead of .list — flat link list, no entry structure needed */
.links {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* Override global a styles using :global() for full specificity */
.links :global(a) {
  color: var(--secondary);
  text-decoration: none;
  font-size: var(--text-sm);
}

.links :global(a:hover) {
  color: var(--accent);
}
```

### Phase 4: Sidebar navigation update

**Modify: `src/components/Sidebar.astro`**

Desktop nav — add anchor links with `aria-current`:

```astro
<a href="/" class:list={['nav-link', { active: currentPath === '/' }]} aria-current={currentPath === '/' ? 'page' : undefined}>Work</a>
<a href="/#projects" class="nav-link">Projects</a>
<a href="/blog" class:list={['nav-link', { active: currentPath.startsWith('/blog') }]} aria-current={currentPath.startsWith('/blog') ? 'page' : undefined}>Writing</a>
<a href="/#contact" class="nav-link">Contact</a>
<a href="/John_Litzsinger_Resume.pdf" class="nav-link">Resume</a>
```

Mobile nav — same link additions.

**Corrected mobile nav script** (fixes all 3 bugs):

```javascript
document.addEventListener('astro:page-load', () => {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.mobile-nav');
  if (!toggle || !nav) return;

  // Sentinel: sidebar DOM persists across view transitions.
  // Without this guard, handlers accumulate on every soft navigation.
  if (toggle.dataset.bound) return;
  toggle.dataset.bound = 'true';

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.hidden = expanded;
  });

  // Close mobile nav when anchor links are tapped.
  // Uses nav.hidden/aria-expanded (not classList) to match existing toggle pattern.
  nav.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.hidden = true;
    });
  });
});

// Cross-route anchor scroll: ensure hash target is scrolled to
// after view transition swap completes. Uses 'instant' to avoid
// competing with the crossfade animation.
document.addEventListener('astro:after-swap', () => {
  const hash = window.location.hash;
  if (!hash) return;
  const target = document.querySelector(hash);
  if (target) target.scrollIntoView({ behavior: 'instant' });
});
```

### Phase 5: Homepage composition

**Modify: `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Experience from '../components/Experience.astro';
import Projects from '../components/Projects.astro';
import Writing from '../components/Writing.astro';
import Contact from '../components/Contact.astro';
---

<BaseLayout title="..." description="...">
  <div class="intro">
    <p class="tagline">...</p>
  </div>
  <Experience />
  <Projects />
  <Writing />
  <Contact />
</BaseLayout>
```

### Phase 6: QA checklist

Manual verification:

**Layout & responsiveness:**
- [ ] Desktop (1440px): all sections visible, sidebar proportions look balanced
- [ ] Desktop (1024px): content not cramped, Experience entry-header layout intact
- [ ] Narrow desktop (800px): check for squeeze, entries still readable
- [ ] Mobile (375px): sidebar hidden, all sections stack properly
- [ ] Light mode: verify colors and contrast in both schemes

**Navigation (critical path — test each):**
- [ ] On homepage `/`: click "Projects" in sidebar -> scrolls to `#projects` (same-page fast path)
- [ ] On homepage `/`: click "Contact" in sidebar -> scrolls to `#contact`
- [ ] Navigate to `/blog` -> click "Projects" in sidebar -> returns to homepage, scrolls to `#projects` (cross-page transition + `astro:after-swap` handler)
- [ ] Navigate to a blog post -> click "Contact" in sidebar -> returns to homepage, scrolls to `#contact`
- [ ] Mobile: tap hamburger -> tap "Projects" -> nav closes AND section is visible
- [ ] Mobile: tap hamburger -> tap "Contact" -> nav closes AND section is visible
- [ ] Navigate between pages 3+ times -> hamburger still works (no duplicate handler accumulation)

**Accessibility:**
- [ ] Keyboard: tab through all sections, linked project entries are focusable, non-linked are skipped
- [ ] Screen reader: "Work" link announces "current page" on homepage (aria-current)
- [ ] External links: LinkedIn, GitHub, project URLs open in new tab

**Design system compliance:**
- [ ] Verify no hard-coded px/rem values — all use design tokens
- [ ] Accent color used only on interactive elements (links, hover states), not decorative text
- [ ] `.section-label` renders consistently across all sections (from global.css)

## Files Summary

| Action | File | What changes |
|---|---|---|
| Create | `src/components/Projects.astro` | New section component with inline project data |
| Create | `src/components/Contact.astro` | New section component with contact links |
| Modify | `src/styles/global.css` | `--sidebar-width: 280px` -> `340px`; extract `.section-label` |
| Modify | `src/components/Sidebar.astro` | Add nav links, fix mobile script (sentinel + correct state + anchor scroll) |
| Modify | `src/pages/index.astro` | Import + place Projects and Contact components |
| Modify | `src/components/Experience.astro` | Remove scoped `.section-label` (now in global.css) |
| Modify | `src/components/Writing.astro` | Remove scoped `.section-label` (now in global.css) |

**Files unchanged:** `BaseLayout.astro` (layout adapts automatically via token), `BlogPostLayout.astro`, `src/pages/blog/index.astro`, font files, `content.config.ts`.

## Dependencies & Risks

| Risk | Severity | Mitigation |
|---|---|---|
| ClientRouter + anchor hash scroll | High | `astro:after-swap` handler with `scrollIntoView({ behavior: 'instant' })`. Already in plan. |
| Duplicate event listeners on persistent sidebar | High | `data-bound` sentinel guard. Already in plan. |
| Global `a` styles override scoped link styles | Medium | Use `:global()` wrappers. Guidance in Phase 2 and 3. |
| Squeeze zone (769-900px) | Low | QA checkpoint. Fallback: media query to narrow sidebar in that range. |
| `.section-label` extraction breaks existing styling | Low | Test Experience and Writing sections after extraction. The styles are simple — font-size, letter-spacing, color, margin. |

## Performance Notes

All proposed changes are pure static HTML and CSS. Zero performance risk:
- Two additional sections add ~3-4 KB HTML + scoped CSS to a 10.7 KB page
- No new JavaScript frameworks, no images, no API calls
- FCP/LCP unaffected — new content is below the fold
- Event listener overhead: 5-8 elements with click handlers, microseconds to set up
- Actual performance bottleneck on this site is font loading (Lack woff2, 53 KB) — unrelated to this plan

## Security Notes

Zero security concerns for these changes:
- All external links correctly use `rel="noopener noreferrer"`
- Inline data arrays are hardcoded at build time — no user input, no injection vectors
- Astro auto-escapes all `{}` template expressions
- mailto: link exposes email in plaintext — acceptable tradeoff for a portfolio site (purpose is to be contacted)
- Optional future hardening: add CSP headers via `vercel.json` (see security review for template)

## References

### Internal
- `src/components/Experience.astro` — Primary pattern reference for Projects section
- `src/components/Writing.astro` — Pattern reference for linked entries
- `src/components/Sidebar.astro` — Navigation and mobile toggle modification target
- `src/styles/global.css:69` — `--sidebar-width` token
- `src/layouts/BaseLayout.astro:39-52` — Content area layout using sidebar-width token
- `docs/solutions/ui-bugs/design-system-drift-System-20260215.md` — Use design tokens, avoid hard-coded values, accent color only for interactive elements
- `docs/solutions/ui-bugs/site-restructure-rams-jobs-principles.md` — Section spacing patterns, `:where()` specificity gotcha, section labels pattern

### External
- [Astro View Transitions docs](https://docs.astro.build/en/guides/view-transitions/) — ClientRouter lifecycle events
- [Astro Styles and CSS docs](https://docs.astro.build/en/guides/styling/) — Scoped style specificity, `:global()`, `scopedStyleStrategy`
- [withastro/astro#15086](https://github.com/withastro/astro/issues/15086) — Hash fragment dropped on redirect (trailing slash fix)
- [W3C WAI Menu Structure Tutorial](https://www.w3.org/WAI/tutorials/menus/structure/) — `aria-current="page"` pattern

### Brainstorm
- `docs/brainstorms/2026-02-16-projects-contact-layout-brainstorm.md` — Source specification
