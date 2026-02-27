# Brainstorm: Multi-Page Site Architecture

**Date:** 2026-02-17
**Status:** Approved (reviewed and refined)
**Scope:** Separate the single-page homepage into five distinct pages while preserving the brutalist-minimal design philosophy
**Supersedes:** `docs/plans/2026-02-17-feat-projects-contact-sidebar-layout-plan.md` (single-page anchor architecture)

---

## What We're Building

Split the current single-scroll homepage into five standalone pages:

1. **Home** (`/`) — Minimal landing. Single tagline sentence. Sidebar handles all discovery.
2. **Work** (`/work`) — Expanded work history. Each role gets 2-3 sentences, key accomplishments. Same border-top list rhythm.
3. **Projects** (`/projects`) — Rich project cards. Each project gets a paragraph description, tech stack listing, and multiple links (demo, source, etc.). All type and space, no images.
4. **Writing** (`/blog`) — Already exists as a standalone page. No structural changes needed.
5. **Contact** (`/contact`) — Minimal contact form (Formspree, free tier) alongside direct links (email, LinkedIn, GitHub).
6. **Thank You** (`/contact/thanks`) — Post-submission redirect page. Brief confirmation message, link back to home.

---

## Why This Approach

**Clean route split** — each page is a self-contained destination. The sidebar is the sole navigation paradigm. No cross-page "next" links, no homepage previews. This is the most disciplined expression of the existing design philosophy.

The writing page already demonstrates that this pattern works: single-word H1, border-top rhythm, `max-width: var(--content-max)`, sidebar handles wayfinding. We're applying that proven template to every section.

---

## Key Decisions

### 1. Homepage = Emptiness
- Single tagline sentence at `--text-lg`, `--secondary`, `max-width: 50ch`
- No sections, no previews, no "View all" links
- The sidebar name (40px) + tagline = the entire content area
- The emptiness IS the design
- No active nav state on the homepage — intentional. The name link is the implicit home link.
- Remove the `margin-bottom: var(--space-xl)` on `.intro` (no content below to space from)

### 2. Single-Word H1 Headers
- Every page: "Work", "Projects", "Writing", "Contact"
- `font-size: var(--text-2xl)` (40px), `letter-spacing: -0.02em`
- Matches sidebar nav labels 1:1
- Follows the writing page precedent — H1 directly inside the page wrapper, no extra `.page-header` div needed

### 3. Sidebar Nav Updates
- All links become real routes: `/work`, `/projects`, `/blog`, `/contact`
- Remove `/#anchor` pattern entirely — no trailing slashes on routes
- Resume link stays (external PDF)
- Mobile hamburger nav uses the same route links

**Active state logic table:**

| Nav Label | `href` | Active when | `aria-current` |
|-----------|--------|-------------|-----------------|
| Work | `/work` | `currentPath === '/work'` | `page` |
| Projects | `/projects` | `currentPath === '/projects'` | `page` |
| Writing | `/blog` | `currentPath.startsWith('/blog')` | `page` |
| Contact | `/contact` | `currentPath.startsWith('/contact')` | `page` |
| Resume | PDF link | Never | Never |

Homepage (`/`): No nav item is active. The name "John / Litzsinger" links to `/` but has no active styling. This is intentional.

### 4. Work Page: Expanded Entries
- Same list structure: `.entry` with border-top, entry-header with title + period
- Each role gets 2-3 sentences (vs. current 1-line summary)
- Key accomplishments or technologies surfaced
- Still uses `--text-sm` for descriptions, `--secondary` color, `max-width: 60ch`

### 5. Projects Page: Rich Cards
- Each project becomes a mini-section within the list
- Structure per entry: title + tech stack (header row), paragraph description, links row
- **Data model change:** Current `url: string` becomes `links: Array<{label: string, url: string}>` (e.g., `[{label: "Demo", url: "..."}, {label: "GitHub", url: "..."}]`)
- Links styled as `--secondary` → `--accent` on hover, separated by ` / ` or `·`
- No images, no screenshots — type and space only
- Border-top rhythm maintained between entries

### 6. Contact Page: Form + Links
- **Form fields:** Name (`name="name"`), email (`name="email"`, `type="email"`), message (`name="message"`, `<textarea>`)
- **Validation:** HTML5 `required` attributes only. No custom JS validation.
- **Spam protection:** Formspree `_gotcha` honeypot hidden field
- **Backend:** Formspree (free tier, 50 submissions/month). HTML `action` attribute, `method="POST"`
- **Submission UX:** Form POST → Formspree processes → redirects to `/contact/thanks` via `_next` hidden field. User stays on-brand.
- **Links section:** Email, LinkedIn, GitHub. Below the form.
- **Form styling:** Inputs use `--font`, `1px solid var(--border)` borders, `background: transparent`, `color: var(--foreground)`, `--accent` focus ring. No rounded corners. Submit button: `background: var(--foreground)`, `color: var(--background)`, simple inversion.
- **Textarea:** `rows="6"`, no max-length restriction
- **Note:** Formspree account and form endpoint must be created before implementation. Use placeholder `action="#"` until endpoint is ready.

### 7. Thank You Page (`/contact/thanks`)
- Minimal page: H1 "Thank you", brief confirmation sentence (`--secondary`), back-to-home link
- Same `BaseLayout` + `max-width: var(--content-max)` pattern
- No sidebar active state (same as homepage — it's a transient destination)

### 8. No Cross-Page Navigation
- No "Next: Projects →" links at page bottoms
- No "← Back to Home" links (except blog posts keep "← Back to writing")
- The sidebar is the ONLY wayfinding mechanism
- This enforces the principle: "If it's not type or space, question it."

### 9. URL Migration
- Old hash URLs (`/#experience`, `/#projects`, `/#contact`) will land on the minimal homepage
- **No client-side redirect.** Accept the breakage — this is a personal site with low external link density
- The sidebar on the homepage provides immediate navigation to all pages

### 10. SEO Per-Page Metadata

| Page | `<title>` | `<meta description>` |
|------|-----------|---------------------|
| `/` | John Litzsinger | Finance, markets, and technology. |
| `/work` | Work — John Litzsinger | Work experience and professional background. |
| `/projects` | Projects — John Litzsinger | Selected projects in finance, data, and technology. |
| `/blog` | Writing — John Litzsinger | *(already exists, unchanged)* |
| `/contact` | Contact — John Litzsinger | Get in touch. |
| `/contact/thanks` | Thank You — John Litzsinger | *(no indexing needed)* |

All pages use `og:type: website` except blog posts which use `article`.

### 11. Mobile Behavior
- Mobile nav closes immediately on ANY link tap (expand handler from `a[href*="#"]` to all nav links)
- If the tapped link is the current page, just close the nav — no navigation
- View transitions (`<ClientRouter />`) handle animated crossfade between pages; sidebar DOM persists

---

## Design System Implications

### What stays the same:
- All design tokens (colors, type scale, spacing, layout variables)
- Dark/light mode behavior
- VTF Lack as sole typeface
- Border-top entry rhythm
- BaseLayout structure (sidebar + content area)
- Blog post layout and prose styles
- Accessibility patterns (aria-labels, skip-nav, focus-visible)

### What changes:
- Sidebar nav links: `/#anchor` → real routes
- Sidebar `aria-current` logic: per active state table above
- Mobile nav: close handler applies to ALL link taps, not just anchor links
- Homepage: remove all section component imports, strip to tagline
- `.section-label` global CSS class: **remove from `global.css`** — no longer used (pages use H1, not section labels)

### What to keep defensively:
- `astro:after-swap` hash scroll handler — blog posts may have heading anchors. Keep it; it's harmless.
- `data-bound` sentinel on mobile toggle — still needed for view transition persistence

### New patterns:
- Contact form styling (inputs, textarea, submit button) — composed from existing tokens, no new variables needed
- Form input focus states: `outline: 2px solid var(--focus-ring); outline-offset: 2px` (matches existing link focus pattern)

---

## Files to Create/Modify

### New files:
- `src/pages/work.astro` — Work page (expanded entries, content inline)
- `src/pages/projects.astro` — Projects page (rich cards, content inline)
- `src/pages/contact.astro` — Contact page (form + links)
- `src/pages/contact/thanks.astro` — Thank-you page (post-submission redirect)

### Modified files:
- `src/pages/index.astro` — Strip to tagline only, remove section imports, update SEO metadata
- `src/components/Sidebar.astro` — Update nav hrefs, active state logic, mobile close handler
- `src/styles/global.css` — Remove `.section-label` class, add form input styles

### Remove:
- `src/components/Experience.astro` — Content migrates into `work.astro` with expanded descriptions
- `src/components/Projects.astro` — Content migrates into `projects.astro` with rich data model
- `src/components/Writing.astro` — No longer used; blog index at `/blog` is the standalone page
- `src/components/Contact.astro` — Content migrates into `contact.astro` with form

### Unchanged (file content):
- `src/pages/blog/index.astro` — Already standalone (note: rendered output changes because Sidebar changes)
- `src/pages/blog/[...slug].astro` — No changes
- `src/layouts/BaseLayout.astro` — No changes (note: rendered output changes because Sidebar it includes changes)
- `src/layouts/BlogPostLayout.astro` — No changes

### Should review:
- `src/pages/404.astro` — Currently links to `/` and `/blog`. Consider adding `/work` or `/projects` for better recovery, since homepage is now minimal. Low priority.
- Sidebar bottom contact links — Keep as-is (email + LinkedIn). The `/contact` page provides the full set.

---

## Open Questions (Remaining)

1. **Expanded work content** — User needs to provide the 2-3 sentence descriptions for each role
2. **Rich project content** — User needs to provide paragraph descriptions and additional links per project
3. **Additional contact links** — Should Twitter/X or other platforms be added beyond email, LinkedIn, GitHub?
4. **Sidebar nav order** — Current: Work, Projects, Writing, Contact, Resume. Does this order change?
5. **Formspree endpoint** — Account must be created and form ID obtained before implementation

---

## Resolved Questions (from review)

| Question | Decision |
|----------|----------|
| Homepage active nav state | No active state — intentional emptiness |
| Old hash URL migration | Accept breakage, no redirects |
| Form submission UX | Custom redirect to `/contact/thanks` via Formspree `_next` field |
| Page header pattern | Simple H1 inside page wrapper, no extra div (matches blog index) |
| `.section-label` class | Remove from global CSS — deprecated |
| Mobile nav close behavior | Close on ALL link taps, not just anchor links |
| `astro:after-swap` handler | Keep defensively for potential blog heading anchors |
| Sidebar bottom contact links | Keep as-is |
| No trailing slashes on routes | Confirmed |

---

## What This Does NOT Include

- No new design tokens or CSS custom properties
- No images, icons, or decorative elements on any page
- No JavaScript beyond mobile nav toggle and Formspree honeypot
- No changes to blog architecture or content schema
- No new fonts or type scale additions
- No hover animations or transitions beyond existing `color` / `border-color` changes
- No changes to the RSS feed or content collection schema
