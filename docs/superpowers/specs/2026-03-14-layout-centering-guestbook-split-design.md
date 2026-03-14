# Layout Centering, Guest Book Split, Resume Relocation

**Date:** 2026-03-14
**Branch:** `feat/site-refresh-light-only`
**Scope:** 3 independent UI changes

## Change 1: Section Page Visual Centering

**Problem:** Section pages (Now, Work, Guest Book, About) render content at the top of the viewport with vast empty space below. The homepage centers its content group, but inner pages don't — creating an inconsistent feel.

**Fix:** Vertically center content in the remaining space below the section header, biased upward (~30-35% from top) so it feels visually centered without being mathematically centered.

**Implementation:**
- In `BaseLayout.astro`, add `justify-content: center` to `.page-content` (the `<main>` element) — it's already `display: flex; flex-direction: column`
- Add `padding-bottom: 15vh` to bias content upward from true center
- This only applies to viewport-locked pages. Scrollable pages (`allow-scroll`) should not center — they flow naturally from top
- The section header stays pinned at the top; only the content *within* `<main>` centers

**Files:** `src/layouts/BaseLayout.astro`

## Change 2: Guest Book Split into Two Routes

**Problem:** The guest book renders form + preview notes + full entries grid on a single scrollable page. The "All Entries" section is visible immediately, breaking the viewport-locked feel of other section pages.

**Fix:** Split into two routes:

### Route: `/guest-book` (viewport-locked)
- Shows: form, signature canvas, color pickers, 3-note preview, "See all entries" link
- `scrollable={false}` — viewport-locked like Now, Work
- Content visually centered (inherits Change 1)
- "See all entries" is an `<a href="/guest-book/entries">` link, not a scroll trigger

### Route: `/guest-book/entries` (new page, scrollable)
- Shows: full entries grid (all approved entries)
- `scrollable={true}`
- Breadcrumbs: `[{ label: 'Guest Book', href: '/guest-book' }, { label: 'All Entries' }]`
- Standard section page layout, user scrolls through entries
- Back arrow in breadcrumb navigates to `/guest-book`

### Component Split
- Rename/refactor `GuestBookPage.tsx` into two components:
  - `GuestBookForm.tsx` — form, signature canvas, color pickers, 3-note preview, "See all entries" link. Used by `/guest-book`
  - `GuestBookEntries.tsx` — full scrollable entries grid. Used by `/guest-book/entries`
- Both components share the same Supabase fetch logic and entry types
- Shared types/fetch logic extracted if needed, but keep it simple — duplicate is fine for 2 consumers

**Files:**
- Modify: `src/pages/guest-book.astro` (remove scrollable, remove all-entries rendering)
- Create: `src/pages/guest-book/entries.astro` (new page)
- Refactor: `src/components/react/GuestBookPage.tsx` → `GuestBookForm.tsx` + `GuestBookEntries.tsx`

## Change 3: Resume Link in Top Bar

**Problem:** The resume link is buried on the about page. Recruiters — a key audience — need fast access from any page.

**Fix:** Move the resume PDF link from the about page to the top bar social links nav in `BaseLayout.astro`.

**Implementation:**
- Add a resume link after GitHub in the social links nav
- Icon: document SVG (18x18, stroke style matching existing icons)
- Same styling as other social links: `color: var(--muted)`, hover `color: var(--section-color)`
- 44x44px touch target, `aria-label="Resume"`
- `target="_blank" rel="noopener noreferrer"` (opens PDF)
- Visible at all breakpoints including `<480px` (joins Email and GitHub as always-visible)
- Remove the resume link from `src/pages/about.astro`

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (add resume link to social nav)
- Modify: `src/pages/about.astro` (remove resume link)

## Verification

1. `npm run build` passes
2. Visual check at 375px, 768px, 1440px:
   - Section pages: content visually centered in viewport
   - `/guest-book`: form + 3 notes centered, no "All Entries" visible
   - `/guest-book/entries`: scrollable, breadcrumb back to guest book
   - Resume icon visible in top bar on all pages, all breakpoints
3. Homepage unchanged (already centered)
4. Scrollable pages (about, guest-book/entries, blog posts) flow from top, not centered
