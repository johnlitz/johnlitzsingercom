---
title: "feat: Multi-page site architecture split"
type: feat
date: 2026-02-17
brainstorm: docs/brainstorms/2026-02-17-multi-page-split-brainstorm.md
supersedes: docs/plans/2026-02-17-feat-projects-contact-sidebar-layout-plan.md
---

# feat: Multi-Page Site Architecture Split

## Overview

Split the single-scroll homepage into five standalone pages (Home, Work, Projects, Writing, Contact) plus a form thank-you page. The sidebar becomes the sole navigation paradigm with real route links replacing `/#anchor` links. Each page follows the proven writing-page pattern: single-word H1, `max-width: var(--content-max)`, border-top entry rhythm. A Formspree-backed contact form is the only new interaction pattern.

## Problem Statement

The current architecture puts all content on one page with anchor-link navigation. This creates:
- No room for expanded content (work entries are limited to one-line summaries)
- Projects can't have rich descriptions or multiple links
- No contact form — just three links
- The "Projects" and "Contact" sidebar links have no active state (they're hash links, not routes)
- Content can't grow independently per section

## Proposed Solution

**Clean route split.** Each section becomes its own Astro page file. The sidebar nav updates from `/#anchor` links to real routes. The homepage becomes a minimal tagline-only landing. All pages share the same `BaseLayout` and follow the same structural pattern established by the blog index.

## Technical Approach

### Architecture

```
Before:                              After:
/           → All sections           /              → Tagline only
/blog       → Blog listing           /work          → Expanded work history
/blog/[slug]→ Blog posts             /projects      → Rich project cards
                                     /blog          → Blog listing (unchanged)
                                     /blog/[slug]   → Blog posts (unchanged)
                                     /contact       → Form + links
                                     /contact/thanks→ Post-submission confirmation
```

**Sidebar active state model:** Astro's `<ClientRouter />` swaps the entire `<body>` on each soft navigation. The sidebar visually persists during the crossfade transition animation, but the DOM is rebuilt from server-rendered HTML on each page. This means `aria-current` and `.active` classes update automatically — no client-side JS needed for active state management.

### Implementation Phases

---

#### Phase 1: Foundation — Config and Sidebar

Small, high-impact changes that prevent bugs and establish the routing foundation.

**1.1 Add `trailingSlash` config**

File: `astro.config.mjs`

Add `trailingSlash: 'never'` to the Astro config to ensure consistent path comparison for sidebar active states. Without this, Vercel may serve `/work/` which would fail the `=== '/work'` check.

```js
export default defineConfig({
  site: 'https://johnlitzsinger.com',
  trailingSlash: 'never',
  // ... rest of config
});
```

**1.2 Update sidebar navigation**

File: `src/components/Sidebar.astro`

Update all nav links from hash anchors to real routes. Add `class:list` active state bindings and `aria-current` to Projects and Contact (currently missing).

Desktop nav (lines 10-14) — change to:

```astro
<a href="/work" class:list={['nav-link', { active: currentPath === '/work' }]} aria-current={currentPath === '/work' ? 'page' : undefined}>Work</a>
<a href="/projects" class:list={['nav-link', { active: currentPath === '/projects' }]} aria-current={currentPath === '/projects' ? 'page' : undefined}>Projects</a>
<a href="/blog" class:list={['nav-link', { active: currentPath.startsWith('/blog') }]} aria-current={currentPath.startsWith('/blog') ? 'page' : undefined}>Writing</a>
<a href="/contact" class:list={['nav-link', { active: currentPath.startsWith('/contact') }]} aria-current={currentPath.startsWith('/contact') ? 'page' : undefined}>Contact</a>
<a href="/John_Litzsinger_Resume.pdf" class="nav-link">Resume</a>
```

Mobile nav (lines 35-39) — mirror the same pattern with `mobile-link` class.

**Active state logic table:**

| Nav Label | `href` | Active when | `aria-current` |
|-----------|--------|-------------|-----------------|
| Work | `/work` | `currentPath === '/work'` | `page` |
| Projects | `/projects` | `currentPath === '/projects'` | `page` |
| Writing | `/blog` | `currentPath.startsWith('/blog')` | `page` |
| Contact | `/contact` | `currentPath.startsWith('/contact')` | `page` |
| Resume | PDF link | Never | Never |

Homepage (`/`): No nav item is active. Intentional.

**1.3 Update mobile nav close handler**

File: `src/components/Sidebar.astro` (JS section, ~line 64)

Expand the close-on-tap handler from `a[href*="#"]` to ALL nav links. Add current-page detection to prevent unnecessary navigation:

```js
// Close mobile nav on any link tap
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', (e) => {
    // If tapping the current page link, just close nav — no navigation
    if (link.getAttribute('href') === window.location.pathname) {
      e.preventDefault();
    }
    toggle.setAttribute('aria-expanded', 'false');
    nav.hidden = true;
  });
});
```

Remove the old `a[href*="#"]`-specific handler.

**1.4 Keep `astro:after-swap` handler defensively**

The hash scroll handler stays — blog posts may use heading anchors. It's harmless on pages without hash targets.

---

#### Phase 2: Homepage Strip

**2.1 Strip homepage to tagline only**

File: `src/pages/index.astro`

Remove all component imports and section renders. Update SEO metadata.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="John Litzsinger"
  description="Finance, markets, and technology."
>
  <div class="intro">
    <p class="tagline">Finance student at Purdue, entrepreneur, and market analyst — building at the intersection of capital markets, data, and technology.</p>
  </div>
</BaseLayout>

<style>
  .intro {
    max-width: var(--content-max);
  }

  .tagline {
    font-size: var(--text-lg);
    color: var(--secondary);
    line-height: 1.5;
    max-width: 50ch;
  }
</style>
```

Note: Remove `margin-bottom: var(--space-xl)` from `.intro` — there's no content below to space from.

---

#### Phase 3: Create Work Page

**3.1 Create `/work` page with expanded entries**

File: `src/pages/work.astro` (NEW)

Migrate data from `Experience.astro`, expand summaries to 2-3 sentences each. Follow the blog index page pattern: `BaseLayout` wrapper, H1, list with border-top rhythm.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const experiences = [
  {
    title: 'Rotational Intern, Employee Benefits',
    company: 'Shepherd Insurance',
    period: 'Summer 2025',
    summary: 'Analyzed pharmacy benefit structures and drug trend data to surface cost-saving opportunities in employer health plans. [USER: expand to 2-3 sentences with key accomplishments]',
  },
  {
    title: 'Co-founder & Finance Executive',
    company: 'Purdue Launch Consulting Club',
    period: '2023 – Present',
    summary: 'Co-founded a student consulting org — managed finances, led project teams, and built the website. [USER: expand to 2-3 sentences with key accomplishments]',
  },
  {
    title: 'Founder & Head Analyst',
    company: 'Father Flips',
    period: '2021 – 2023',
    summary: 'Built a market analysis group around limited-availability software pricing. 260% client ROI. [USER: expand to 2-3 sentences with key accomplishments]',
  },
];
---

<BaseLayout
  title="Work — John Litzsinger"
  description="Work experience and professional background."
>
  <div class="work-page">
    <h1>Work</h1>
    <div class="list">
      {experiences.map((exp) => (
        <div class="entry">
          <div class="entry-header">
            <div>
              <h3>{exp.title}</h3>
              <p class="company">{exp.company}</p>
            </div>
            <span class="period">{exp.period}</span>
          </div>
          <p class="summary">{exp.summary}</p>
        </div>
      ))}
    </div>
  </div>
</BaseLayout>
```

Scoped `<style>` replicates Experience.astro's CSS patterns: `.work-page { max-width: var(--content-max) }`, H1 at `--text-2xl`, entries with `border-top`, entry-header flex row with `space-between`, `align-items: baseline`. Mobile stacks entry-header to column at 768px.

---

#### Phase 4: Create Projects Page

**4.1 Create `/projects` page with rich cards**

File: `src/pages/projects.astro` (NEW)

Migrate data from `Projects.astro`. Expand to new data model: `links: Array<{label, url}>` replaces `url: string`. Add paragraph descriptions.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const projects = [
  {
    title: 'Personal Website',
    description: 'Portfolio and blog built with Astro, MDX, and React. Brutalist-minimal design with VTF Lack typography. [USER: expand to full paragraph]',
    tech: 'Astro / React',
    links: [
      { label: 'Live', url: 'https://johnlitzsinger.com' },
      { label: 'GitHub', url: 'https://github.com/johnlitz/johnlitzsingercom' },
    ],
  },
  {
    title: 'Pharmacy Benefit Analyzer',
    description: 'Internal tool for modeling drug trend data and surfacing cost-saving opportunities in employer health plans. [USER: expand to full paragraph]',
    tech: 'Python / Pandas',
    links: [],
  },
  {
    title: 'Launch Consulting Site',
    description: 'Marketing site for Purdue Launch Consulting Club. Designed and built as co-founder. [USER: expand to full paragraph]',
    tech: 'HTML / CSS / JS',
    links: [
      { label: 'GitHub', url: 'https://github.com/johnlitz' },
    ],
  },
];
---

<BaseLayout
  title="Projects — John Litzsinger"
  description="Selected projects in finance, data, and technology."
>
  <div class="projects-page">
    <h1>Projects</h1>
    <div class="list">
      {projects.map((project) => (
        <div class="entry">
          <div class="entry-header">
            <h3>{project.title}</h3>
            <span class="tech">{project.tech}</span>
          </div>
          <p class="summary">{project.description}</p>
          {project.links.length > 0 && (
            <div class="links">
              {project.links.map((link, i) => (
                <>
                  {i > 0 && <span class="sep">/</span>}
                  <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
                </>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</BaseLayout>
```

Scoped `<style>`: `.projects-page { max-width: var(--content-max) }`. Same entry/border-top pattern. Links row uses `--text-sm`, `--secondary` color, hover to `--accent`. Use `:global(a)` pattern for link styles (documented gotcha — Astro scoped styles have zero specificity against global `a` rules). `links` array is optional — if empty, links row not rendered.

---

#### Phase 5: Create Contact Page + Thank You

**5.1 Create `/contact` page with form and links**

File: `src/pages/contact.astro` (NEW)

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const formAction = 'https://formspree.io/f/XXXXXXXX'; // TODO: Replace with real Formspree endpoint
const redirectUrl = new URL('/contact/thanks', Astro.site).href;
---

<BaseLayout
  title="Contact — John Litzsinger"
  description="Get in touch."
>
  <div class="contact-page">
    <h1>Contact</h1>

    <form action={formAction} method="POST">
      <input type="hidden" name="_next" value={redirectUrl} />
      <!-- Honeypot: hidden from real users, catches bots -->
      <div aria-hidden="true" style="position:absolute;left:-9999px;">
        <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" />
      </div>

      <div class="field">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required />
      </div>

      <div class="field">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required />
      </div>

      <div class="field">
        <label for="message">Message</label>
        <textarea id="message" name="message" rows="6" required></textarea>
      </div>

      <button type="submit">Send</button>
    </form>

    <div class="links">
      <a href="mailto:jlitzsin@purdue.edu">jlitzsin@purdue.edu</a>
      <a href="https://www.linkedin.com/in/johnlitzsinger" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href="https://github.com/johnlitz" target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
  </div>
</BaseLayout>
```

Scoped `<style>` for form elements:

```css
.contact-page {
  max-width: var(--content-max);
}

/* H1: same pattern as all pages */
h1 {
  font-size: var(--text-2xl);
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: var(--space-lg);
}

form {
  margin-bottom: var(--space-xl);
}

.field {
  margin-bottom: var(--space-6);
}

label {
  display: block;
  font-size: var(--text-sm);
  color: var(--secondary);
  margin-bottom: var(--space-xs);
}

input,
textarea {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  font-family: var(--font);
  font-size: var(--text-base);
  color: var(--foreground);
  background: transparent;
  border: 1px solid var(--border);
  transition: border-color var(--duration-fast) ease;
}

input:focus,
textarea:focus {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
  border-color: var(--accent);
}

textarea {
  resize: vertical;
}

button[type="submit"] {
  font-family: var(--font);
  font-size: var(--text-sm);
  letter-spacing: 0.04em;
  padding: var(--space-sm) var(--space-lg);
  background: var(--foreground);
  color: var(--background);
  border: none;
  cursor: pointer;
  transition: opacity var(--duration-fast) ease;
}

button[type="submit"]:hover {
  opacity: 0.8;
}

button[type="submit"]:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

/* Links section below form */
.links {
  border-top: 1px solid var(--border);
  padding-top: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* :global() to override global a styles — documented gotcha */
.links :global(a) {
  color: var(--secondary);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--duration-fast) ease;
}

.links :global(a:hover) {
  color: var(--foreground);
}
```

Key form styling decisions:
- Inputs: transparent background, `1px solid var(--border)`, no border-radius
- Focus: `outline: 2px solid var(--focus-ring)` + `border-color: var(--accent)` (matches existing link focus pattern)
- Submit button: inverted colors (`--foreground` bg, `--background` text), hover reduces opacity
- Labels: `--text-sm`, `--secondary` color
- Honeypot: positioned offscreen, `tabindex="-1"`, `aria-hidden="true"`, `autocomplete="off"`

**5.2 Create `/contact/thanks` page**

File: `src/pages/contact/thanks.astro` (NEW)

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Thank You — John Litzsinger"
  description="Message received."
>
  <div class="thanks-page">
    <h1>Thank you</h1>
    <p>Your message has been sent. I'll get back to you soon.</p>
    <a href="/">Back to home</a>
  </div>
</BaseLayout>
```

Add `<meta name="robots" content="noindex">` to this page. Two options:
- (a) Add a `noindex` prop to `BaseHead.astro` and pass it from this page
- (b) Use Astro's `<head>` slot injection (simpler — just add the meta tag in the page's frontmatter section)

Recommend (b): Add `<meta slot="head" name="robots" content="noindex" />` or handle via the BaseLayout. Since BaseLayout doesn't have a head slot, the simpler approach is to add a conditional `noindex` prop to BaseHead.

Scoped styles: `.thanks-page { max-width: var(--content-max) }`, H1 at `--text-2xl`, paragraph at `--secondary`, link styled as `--secondary` → `--accent` on hover.

---

#### Phase 6: CSS and Sitemap Cleanup

**6.1 Remove `.section-label` from global CSS**

File: `src/styles/global.css` (lines 200-206)

Delete the `.section-label` class. It was used by homepage section components which are being removed. New pages use H1, not section labels.

```css
/* DELETE these lines: */
.section-label {
  font-size: var(--text-sm);
  letter-spacing: 0.08em;
  color: var(--accent);
  margin-bottom: var(--space-md);
}
```

**6.2 Update sitemap filter**

File: `astro.config.mjs`

Update the sitemap filter to exclude `/contact/thanks`:

```js
sitemap({
  filter: (page) => !page.includes('/draft/') && !page.includes('/contact/thanks'),
}),
```

**6.3 Add `noindex` support to BaseHead (optional)**

File: `src/components/BaseHead.astro`

Add an optional `noindex` prop:

```ts
interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  publishedDate?: Date;
  noindex?: boolean;
}
```

Then in the `<head>`: `{noindex && <meta name="robots" content="noindex" />}`

Pass `noindex={true}` from `contact/thanks.astro` through `BaseLayout`.

---

#### Phase 7: Cleanup and Polish

**7.1 Delete old components**

Remove these files:
- `src/components/Experience.astro` — content migrated to `work.astro`
- `src/components/Projects.astro` — content migrated to `projects.astro`
- `src/components/Writing.astro` — no longer used (blog index is the standalone page)
- `src/components/Contact.astro` — content migrated to `contact.astro`

**7.2 Update 404 page**

File: `src/pages/404.astro`

Add links to `/work` and `/projects` alongside existing `/` and `/blog` links for better recovery:

```html
<a href="/">Go home</a>
<a href="/work">See my work</a>
<a href="/projects">View projects</a>
<a href="/blog">Read the blog</a>
```

**7.3 Verify no remaining references to deleted components**

Search the codebase for imports of `Experience`, `Projects`, `Writing`, `Contact` components. After Phase 2 (homepage strip), `index.astro` no longer imports them. Verify no other files reference them.

---

## Acceptance Criteria

### Functional Requirements

- [x] Homepage (`/`) shows only the tagline sentence — no sections, no component imports
- [x] `/work` page renders expanded work entries (2-3 sentences each) with H1 "Work"
- [x] `/projects` page renders rich project cards with descriptions and multiple links per project
- [x] `/blog` page is unchanged — still shows all posts
- [x] `/contact` page shows a working form (name, email, message) + direct links
- [x] Contact form POSTs to Formspree and redirects to `/contact/thanks`
- [x] `/contact/thanks` shows confirmation message and link back to home
- [x] Sidebar nav uses real routes (`/work`, `/projects`, `/blog`, `/contact`)
- [x] Sidebar active state highlights the correct link on every page
- [x] Homepage has no active nav state — intentional
- [x] Mobile hamburger nav closes on any link tap
- [x] Tapping the current-page link on mobile closes nav without navigating
- [x] View transitions work between all pages (crossfade, no glitches)
- [x] Old components (`Experience.astro`, `Projects.astro`, `Writing.astro`, `Contact.astro`) are deleted

### Non-Functional Requirements

- [x] All pages pass HTML validation (no duplicate IDs, valid ARIA attributes)
- [x] `<meta name="robots" content="noindex">` on `/contact/thanks`
- [x] Sitemap excludes `/contact/thanks`
- [x] `trailingSlash: 'never'` set in `astro.config.mjs`
- [x] Form honeypot uses `tabindex="-1"` and `aria-hidden="true"`
- [x] All form inputs have associated `<label>` elements
- [x] Focus-visible states work on all interactive elements (links, form fields, submit button)
- [x] `prefers-reduced-motion` respected (existing pattern — verify transitions)
- [x] Light mode renders correctly on all new pages
- [x] SEO meta tags (title, description, og:*) set correctly per page

### Quality Gates

- [x] `npm run build` succeeds with no errors
- [x] All pages render correctly at desktop (1280px+) and mobile (375px) widths
- [x] Mobile nav tested across 3+ page navigations (no handler accumulation)
- [ ] Contact form tested: submit with all fields, submit with missing fields, honeypot field not keyboard-focusable

---

## Dependencies & Prerequisites

1. **Formspree account** — Must be created and form endpoint ID obtained before Phase 5. Use placeholder `action="#"` during development but **do not deploy** with placeholder.
2. **Expanded content** — User needs to provide:
   - 2-3 sentence descriptions for each work entry
   - Paragraph descriptions for each project
   - Correct project link URLs (demo, GitHub, etc.)
3. **No external dependencies** — No new npm packages needed. Formspree is a pure HTML integration.

---

## Risk Analysis & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Sidebar active state doesn't update during view transitions | High — broken nav wayfinding | Astro's default body-swap handles this. No `transition:persist` on sidebar. Verified in spec analysis. |
| Trailing slash mismatch breaks active states | High — silent failure | `trailingSlash: 'never'` in config prevents this class of bugs |
| Scoped styles overridden by global CSS | Medium — links appear wrong | Use `:global()` pattern per documented gotcha. Apply to all link styles in new pages. |
| Formspree placeholder deployed to production | Medium — silent form failure | Comment in code: `// TODO: Replace with Formspree endpoint before deploy`. Verify before merge. |
| Mobile nav handler accumulation | Medium — toggle breaks after navigating | `data-bound` sentinel pattern already in place. Verified in learnings. |
| Formspree rate limit (50/month) exceeded | Low — off-brand error page | Acceptable trade-off for free tier on personal site. |

---

## Files Summary

### New (4 files):
| File | Description |
|------|-------------|
| `src/pages/work.astro` | Work page — expanded entries |
| `src/pages/projects.astro` | Projects page — rich cards |
| `src/pages/contact.astro` | Contact page — form + links |
| `src/pages/contact/thanks.astro` | Thank-you page — post-submission redirect |

### Modified (5 files):
| File | Changes |
|------|---------|
| `astro.config.mjs` | Add `trailingSlash: 'never'`, update sitemap filter |
| `src/components/Sidebar.astro` | Nav hrefs, active state logic, mobile close handler |
| `src/pages/index.astro` | Strip to tagline only, update SEO metadata |
| `src/styles/global.css` | Remove `.section-label` class |
| `src/pages/404.astro` | Add `/work` and `/projects` recovery links |

### Modified (optional, 2 files):
| File | Changes |
|------|---------|
| `src/components/BaseHead.astro` | Add optional `noindex` prop |
| `src/layouts/BaseLayout.astro` | Pass `noindex` prop through to BaseHead |

### Deleted (4 files):
| File | Reason |
|------|--------|
| `src/components/Experience.astro` | Content migrated to `work.astro` |
| `src/components/Projects.astro` | Content migrated to `projects.astro` |
| `src/components/Writing.astro` | Blog index is the standalone page |
| `src/components/Contact.astro` | Content migrated to `contact.astro` |

---

## SEO Metadata Per Page

| Route | `<title>` | `<meta description>` | `og:type` | `noindex` |
|-------|-----------|---------------------|-----------|-----------|
| `/` | John Litzsinger | Finance, markets, and technology. | website | No |
| `/work` | Work — John Litzsinger | Work experience and professional background. | website | No |
| `/projects` | Projects — John Litzsinger | Selected projects in finance, data, and technology. | website | No |
| `/blog` | Writing — John Litzsinger | *(unchanged)* | website | No |
| `/contact` | Contact — John Litzsinger | Get in touch. | website | No |
| `/contact/thanks` | Thank You — John Litzsinger | Message received. | website | **Yes** |

---

## References & Research

### Internal References
- Brainstorm: `docs/brainstorms/2026-02-17-multi-page-split-brainstorm.md`
- Blog index (page template): `src/pages/blog/index.astro`
- Sidebar component: `src/components/Sidebar.astro`
- Design tokens: `src/styles/global.css:30-87`
- Event listener sentinel: `docs/solutions/ui-bugs/event-listener-accumulation-persistent-sidebar-System-20260217.md`
- Scoped style gotcha: `docs/solutions/ui-bugs/scoped-style-specificity-global-override-System-20260217.md`
- Cross-route anchor scroll: `docs/solutions/ui-bugs/cross-route-anchor-scroll-failure-System-20260217.md`
- Design system drift: `docs/solutions/ui-bugs/design-system-drift-System-20260215.md`

### Design Principles (from brutalist redesign plan)
1. "If it's not type or space, question it."
2. "One typeface." Hierarchy through size, case, opacity.
3. "Red means interactive."
4. "Dark is default."
5. "No hover animations."
