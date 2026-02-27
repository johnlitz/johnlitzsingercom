---
module: System
date: 2026-02-17
problem_type: ui_bug
component: frontend_stimulus
symptoms:
  - "Mobile nav toggle adds duplicate event listeners after each page navigation"
  - "Mobile nav behavior degrades progressively — multiple open/close cycles per click"
  - "No visible error; bug only manifests after navigating between pages"
root_cause: async_timing
resolution_type: code_fix
severity: high
tags: [astro, view-transitions, client-router, event-listeners, mobile-nav, persistent-dom, sentinel]
---

# Troubleshooting: Event Listener Accumulation on Persistent Sidebar DOM with Astro ClientRouter

## Problem

When using Astro's ClientRouter (view transitions), the sidebar DOM persists across soft navigations because it lives outside the `<slot>` in `BaseLayout.astro`. The `astro:page-load` event fires on every navigation, causing event listeners to accumulate on the same DOM elements — each click triggers multiple handlers.

## Environment

- Module: System (Sidebar component)
- Framework: Astro 5 with ClientRouter (view transitions)
- Affected Component: `src/components/Sidebar.astro` mobile nav toggle script
- Date: 2026-02-17

## Symptoms

- Mobile nav toggle registers a new click handler after each soft navigation
- After navigating to 3 pages, a single tap on the hamburger fires 3 open/close cycles
- No console errors — behavior silently degrades
- Only affects mobile nav (desktop sidebar has no JS handlers)

## What Didn't Work

**Direct solution:** The bug was identified during plan research (deep-plan phase) before implementation. The fix was applied correctly on the first attempt.

## Solution

Add a `data-bound` sentinel attribute to the toggle button. Check for it before attaching listeners. Since the DOM element persists across view transitions, the sentinel persists too — preventing duplicate registration.

**Code changes:**

```typescript
// Before (broken — listeners accumulate):
document.addEventListener('astro:page-load', () => {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    // handler registered AGAIN on every navigation
  });
});

// After (fixed — sentinel prevents duplicates):
document.addEventListener('astro:page-load', () => {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.mobile-nav');
  if (!toggle || !nav) return;

  // Sentinel: sidebar DOM persists across view transitions.
  // Without this guard, handlers accumulate on every soft navigation.
  if ((toggle as HTMLElement).dataset.bound) return;
  (toggle as HTMLElement).dataset.bound = 'true';

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    (nav as HTMLElement).hidden = expanded;
  });
});
```

## Why This Works

1. **Root cause**: Astro's ClientRouter replaces only the content inside `<slot>` during view transitions. Components in the layout shell (like `Sidebar.astro`) are NOT re-rendered — their DOM persists. But `astro:page-load` fires on every navigation (initial load + soft navigations), so any `addEventListener` calls inside that handler run repeatedly on the same DOM nodes.

2. **The sentinel works because the DOM persists.** Setting `data-bound="true"` on the toggle element survives across navigations since the element itself isn't replaced. On the next `astro:page-load`, the check `if (toggle.dataset.bound)` returns true and skips re-registration.

3. **Alternative approaches considered:**
   - `{ once: true }` on `astro:page-load` — won't work because we need the handler to fire on initial load
   - AbortController — more complex than needed for a simple guard
   - Moving script to `<script>` without `astro:page-load` — won't work because Astro scripts run once at page load but the DOM might not be ready after a view transition

## Prevention

- **Any `<script>` in a persistent layout component** (sidebar, header, footer) that uses `astro:page-load` MUST include a sentinel guard if it attaches event listeners to DOM elements.
- **Pattern to follow:**
  ```typescript
  if ((element as HTMLElement).dataset.bound) return;
  (element as HTMLElement).dataset.bound = 'true';
  ```
- **Quick check:** Search for `addEventListener` inside `astro:page-load` handlers. If the target element is in a layout component (not inside `<slot>`), it needs a sentinel.
- **Astro mental model:** `astro:page-load` = "the page is ready" (fires every time). `astro:after-swap` = "the DOM was just replaced" (fires only on soft navigation). For persistent elements, prefer the sentinel pattern over event choice.

## Related Issues

No related issues documented yet.
