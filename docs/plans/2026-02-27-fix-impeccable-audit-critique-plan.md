---
title: "fix: Impeccable Audit & Critique — UI Polish Pass"
type: fix
status: completed
date: 2026-02-27
deepened: 2026-02-27
---

# fix: Impeccable Audit & Critique — UI Polish Pass

## Enhancement Summary

**Deepened on:** 2026-02-27
**Research agents used:** impeccable:audit, impeccable:adapt, impeccable:animate, impeccable:frontend-design, code-simplicity-reviewer, security-sentinel, learnings-researcher

### Key Changes from Deepening
1. **Cut M8 (sidebar fade symmetry)** — Simplicity review: fade-in of appearing element already masks the instant pop-out. Adding opacity/visibility transitions fights against Astro's view transition system.
2. **Cut H3 (mobile nav max-height)** — Simplicity review: 7 nav items never overflow any viewport. Adding `overflow-y: auto` inside a sticky header creates nested scroll regions (UX antipattern). YAGNI.
3. **Refined H2 (scrollbar tokens)** — Only tokenize `scrollbar-color` shorthand; leave `-webkit-scrollbar-*` hardcoded (browser support limitations).
4. **Security review:** All changes confirmed safe. No XSS, injection, or privacy risks.

---

## Overview

Comprehensive audit and critique of johnlitzsinger.com using impeccable design commands, measured against the site's five design principles (Subtract don't add, Weight over decoration, Red means something, Generous space is confidence, Both modes matter). Fixes HIGH and MEDIUM issues discovered through systematic review.

## Findings Summary

### HIGH (2) — Must Fix

| # | Category | Issue | File |
|---|----------|-------|------|
| H1 | ANIMATE | BlogPostLayout missing `prefers-reduced-motion` for `.tag` and `.post-nav-link` transitions | `BlogPostLayout.astro` |
| H2 | CRITIQUE | Scrollbar `scrollbar-color` shorthand uses hardcoded rgba values instead of CSS tokens | `global.css` |

### MEDIUM (6) — Should Fix

| # | Category | Issue | File |
|---|----------|-------|------|
| M1 | AUDIT | Contact form inputs use `:focus` instead of `:focus-visible` | `contact.astro` |
| M2 | AUDIT | `Footer.astro` is dead code — never imported anywhere | `Footer.astro` |
| M3 | AUDIT | Global h1 `letter-spacing: -0.03em` overridden to `-0.02em` on every page — dead default | `global.css` |
| M4 | CRITIQUE | Duplicate `.prose :global(h2)` and `.prose :global(h3)` selectors | `BlogPostLayout.astro` |
| M6 | NORMALIZE | Blog entries missing mobile padding reduction that work/projects have | `blog/index.astro` |
| M9 | NORMALIZE | Blog listing `.desc` uses `line-height: 1.5` vs `1.55` on work/projects `.summary` | `blog/index.astro` |

### Intentionally Deferred

| # | Category | Issue | Reason |
|---|----------|-------|--------|
| H3 | ADAPT | Mobile nav max-height | YAGNI — 7 items never overflow; nested scroll is worse than the cure |
| M5 | NORMALIZE | Entry hover duplication | Astro colocation > DRY CSS; documented in MEMORY.md |
| M7 | ADAPT | Blog entry-header mobile | Blog has simpler structure, no side-by-side elements to stack |
| M8 | ANIMATE | Sidebar fade symmetry | Fade-in masks pop-out; opacity/visibility fights view transitions |

## Implementation Plan

### Phase 1: Accessibility & Code Cleanup (4 files)

**BlogPostLayout.astro:**
- Add `@media (prefers-reduced-motion: reduce)` block covering `.tag`, `.post-nav-link`, and `.post-footer a` transitions
- Merge duplicate `.prose :global(h2)` selectors (combine margin + font-weight into one rule)
- Merge duplicate `.prose :global(h3)` selectors (same)

```css
/* Merge these two separate blocks into one each: */
.prose :global(h2) {
  margin-top: var(--space-xl);
  margin-bottom: var(--space-md);
  font-weight: 600;
}
.prose :global(h3) {
  margin-top: var(--space-lg);
  margin-bottom: var(--space-sm);
  font-weight: 600;
}

/* Add at end of <style>: */
@media (prefers-reduced-motion: reduce) {
  .tag,
  .post-nav-link,
  .post-footer a {
    transition: none;
  }
}
```

**contact.astro:**
- Change `input:focus` and `textarea:focus` to `input:focus-visible` and `textarea:focus-visible`

```css
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
  border-color: var(--accent);
}
```

**global.css:**
- Tokenize `scrollbar-color` shorthand only (leave `-webkit-scrollbar-*` hardcoded)
- Fix global h1 `letter-spacing` from `-0.03em` to `-0.02em`

```css
/* scrollbar-color shorthand — use tokens */
html {
  scrollbar-color: var(--muted) transparent;
}
/* -webkit-scrollbar-* stays hardcoded (browser limitation) */
```

**Footer.astro:**
- Delete `src/components/Footer.astro` — confirmed dead code (73 lines, imported nowhere)

### Phase 2: Normalize Blog Listing (1 file)

**blog/index.astro:**
- Fix `.desc` line-height from `1.5` to `1.55`
- Add mobile padding reduction to match work/projects

```css
.desc {
  line-height: 1.55; /* was 1.5, match work/projects .summary */
}

@media (max-width: 768px) {
  .entry {
    padding: var(--space-md) 0.75rem; /* match work/projects mobile */
  }
}
```

## Acceptance Criteria

- [x] `npm run build` passes cleanly
- [x] BlogPostLayout has `prefers-reduced-motion: reduce` covering all transitions
- [x] Contact form focus rings only show on keyboard navigation (`:focus-visible`)
- [x] Scrollbar `scrollbar-color` shorthand uses CSS tokens
- [x] Footer.astro deleted
- [x] Blog listing `.desc` has `line-height: 1.55` and mobile padding matches work/projects
- [x] Global h1 `letter-spacing` is `-0.02em`
- [ ] Visual verification: dark mode, light mode, mobile (375px), desktop (1440px)

## Files Changed

| File | Action | Phase |
|------|--------|-------|
| `src/layouts/BlogPostLayout.astro` | Edit (reduced-motion, merge selectors) | 1 |
| `src/pages/contact.astro` | Edit (focus-visible) | 1 |
| `src/styles/global.css` | Edit (scrollbar tokens, h1 letter-spacing) | 1 |
| `src/components/Footer.astro` | Delete | 1 |
| `src/pages/blog/index.astro` | Edit (mobile padding, line-height) | 2 |

## Sources

- Repo audit: 35 findings across 6 impeccable categories (audit, critique, polish, normalize, adapt, animate)
- Institutional learnings: 11 documented patterns from docs/solutions/ and memory files
- Design principles: CLAUDE.md Design Context section
- Simplicity review: Cut 2 items (M8, H3) as YAGNI
- Security review: All changes confirmed safe
