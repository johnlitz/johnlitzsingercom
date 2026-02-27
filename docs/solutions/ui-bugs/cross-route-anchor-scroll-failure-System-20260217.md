---
module: System
date: 2026-02-17
problem_type: ui_bug
component: frontend_stimulus
symptoms:
  - "Clicking sidebar anchor link from non-homepage route navigates but does not scroll to target section"
  - "Hash present in URL but page shows top of content instead of target element"
root_cause: async_timing
resolution_type: code_fix
severity: medium
tags: [astro, view-transitions, anchor-scroll, hash-navigation, client-router, after-swap]
---

# Troubleshooting: Cross-Route Anchor Scroll Failure with Astro View Transitions

## Problem

When clicking a hash link (e.g., `/#projects`) from a different route (e.g., `/blog`), Astro's ClientRouter navigates to the homepage but fails to scroll to the target section. The URL shows the correct hash, but the page displays from the top. Same-page hash links work fine.

## Environment

- Module: System (Sidebar navigation)
- Framework: Astro 5 with ClientRouter (view transitions)
- Affected Component: `src/components/Sidebar.astro` anchor links
- Date: 2026-02-17

## Symptoms

- From `/blog`, clicking "Projects" (`/#projects`) in sidebar → page navigates to `/` but stays at top
- URL bar shows `/#projects` correctly
- Same-page hash clicks (already on `/`) scroll correctly
- Browser's native hash scroll is overridden by view transition animation

## What Didn't Work

**Direct solution:** The bug was identified during deep-plan research by the frontend-races-reviewer agent. The fix was applied correctly on the first attempt.

## Solution

Add an `astro:after-swap` event handler that manually scrolls to the hash target after the view transition DOM swap completes.

**Code changes:**

```typescript
// Added to Sidebar.astro <script> block:
document.addEventListener('astro:after-swap', () => {
  const hash = window.location.hash;
  if (!hash) return;
  const target = document.querySelector(hash);
  if (target) target.scrollIntoView({ behavior: 'instant' });
});
```

**Key detail:** `behavior: 'instant'` (not `'smooth'`) because:
1. The view transition animation already provides visual continuity
2. `'smooth'` would compete with the transition animation, causing janky movement
3. The scroll needs to complete before the transition animation ends

## Why This Works

1. **Root cause**: When Astro's ClientRouter handles a cross-route navigation with a hash (e.g., `/blog` → `/#projects`), it triggers the full view transition pipeline: `astro:before-preparation` → `astro:after-preparation` → `astro:before-swap` → `astro:after-swap` → `astro:page-load`. The browser's native hash-scroll behavior fires during or before the DOM swap, but the view transition animation overrides the scroll position.

2. **Same-page hash links take a "fast path"**: When clicking `/#projects` while already on `/`, Astro's ClientRouter detects it's a same-page hash and lets the browser handle it natively — no view transition fires. That's why same-page hashes work but cross-route hashes don't.

3. **`astro:after-swap` is the correct event** because:
   - It fires after the new DOM is in place (so `querySelector(hash)` finds the target)
   - It fires before the transition animation completes
   - It fires before `astro:page-load` (which is too late — animation may have already settled)

4. **Why not `astro:page-load`?** By the time `page-load` fires, the view transition is complete and the page has settled at the wrong scroll position. `after-swap` fires during the transition, allowing the scroll to happen as part of the animation.

## Prevention

- **Any site using ClientRouter with hash links that cross routes** needs this `astro:after-swap` scroll handler. It's not Astro-specific behavior — it's a consequence of view transitions overriding native scroll-to-hash.
- **Test hash navigation from different routes**, not just same-page. The two code paths are completely different in Astro.
- **Use `behavior: 'instant'`** for post-swap scrolling. Never `'smooth'` — it fights the view transition.
- **Reference**: This is a known pattern in the Astro community. The ClientRouter docs note that same-page hash navigation takes a fast path that skips lifecycle events.

## Related Issues

No related issues documented yet.
