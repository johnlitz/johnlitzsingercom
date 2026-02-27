---
title: "Astro mobile nav — hidden attribute and view transition script pitfalls"
date: 2026-02-22
category: ui-bugs
tags: [CSS-specificity, view-transitions, Astro-scripts, mobile-nav, hidden-attribute, ClientRouter]
component: src/components/MobileHeader.astro
severity: high
symptoms:
  - Pyramid nav displayed when it should be hidden by default
  - Chevron toggle button unresponsive after view transition navigation
root_causes:
  - Author stylesheet display:flex overriding UA stylesheet [hidden] { display:none }
  - Astro module scripts execute once; ClientRouter view transitions swap DOM without re-running them
---

# Astro Mobile Nav: Hidden Attribute and View Transition Script Pitfalls

Two bugs discovered during the MobileHeader component build. Both are easy to miss in development but break core interactive behavior.

---

## Bug 1: HTML `hidden` Attribute Overridden by Author Stylesheet

### Symptom

The `.pyramid-nav` element had the `hidden` attribute set in HTML, but it was visually showing on page load. The collapsible nav should have been collapsed by default.

### Root Cause

Author stylesheets always beat User Agent stylesheets in the CSS cascade, regardless of specificity. When `.pyramid-nav { display: flex; }` was defined in the component's scoped `<style>` block, it overrode the UA stylesheet's `[hidden] { display: none }`. The `hidden` attribute was functionally ignored.

### Fix

Add an explicit rule that respects the `hidden` attribute before the `display: flex` rule:

```css
.pyramid-nav[hidden] {
  display: none;
}

.pyramid-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm) var(--space-lg);
  padding: var(--space-sm) var(--space-md) var(--space-md);
}
```

---

## Bug 2: Astro Module Script Not Re-running After View Transitions

### Symptom

After navigating from Home to Work via Astro view transition (ClientRouter), the chevron toggle button stopped working. The click handler was bound to a DOM element that got swapped out during the transition.

### Root Cause

Astro module `<script>` tags (without `is:inline`) are bundled and deduplicated by content hash. They execute exactly once on initial page load. When ClientRouter swaps the DOM during view transitions, the module scripts do NOT re-execute. Any DOM references captured at script initialization become stale pointers to detached elements.

### Fix

Use `astro:page-load` for handlers that need to rebind to new DOM elements after every navigation. For global listeners (like keydown), add them once in module scope but query DOM fresh inside the handler:

```javascript
// Re-attach click handler after every navigation
document.addEventListener('astro:page-load', () => {
  const chevron = document.querySelector('.mobile-chevron');
  const nav = document.getElementById('mobile-pyramid-nav');
  if (chevron && nav) {
    chevron.addEventListener('click', () => {
      const expanded = chevron.getAttribute('aria-expanded') === 'true';
      chevron.setAttribute('aria-expanded', String(!expanded));
      nav.hidden = expanded;
    });
  }
});

// Keydown listener — added once in module scope, queries DOM fresh each time
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const nav = document.getElementById('mobile-pyramid-nav');
  const chevron = document.querySelector('.mobile-chevron');
  if (nav && chevron && !nav.hidden) {
    nav.hidden = true;
    chevron.setAttribute('aria-expanded', 'false');
    (chevron as HTMLElement).focus();
  }
});
```

Key pattern: `astro:page-load` for element-specific setup, module scope for global listeners with fresh DOM queries inside.

---

## Prevention

### Checklist

- Any element with a `display` property in author CSS that also uses `[hidden]` must have a matching `selector[hidden] { display: none; }` rule
- All interactive Astro components must be tested by navigating away and back via view transitions
- Search for `document.querySelector` / `document.getElementById` at module top-level — move into `astro:page-load` handlers
- Code review: flag any Astro `<style>` block with `display` changes that lacks a `[hidden]` rule

### Best Practices

- **Hidden attribute**: Always pair `[hidden]` CSS rules with any `display` property override on the same selector. The UA stylesheet cannot be relied on when author styles are present.
- **View transition scripts**: Use `astro:page-load` for all DOM-dependent setup. Use module scope only for global delegation patterns where the handler queries DOM fresh each invocation.
- **Testing**: After building any interactive component, navigate to at least one other page and back via client-side nav before considering it done.

### When This Bites You

- Mobile hamburger menu stays visible after closing (display override)
- Accordion/tab panels fail to hide (display override)
- Any click handler stops working after the second page view (stale script)
- Form validation, scroll-to-top, keyboard shortcuts all break after view transition navigation (stale script)

---

## Related Documentation

### Internal

- [event-listener-accumulation-persistent-sidebar](../ui-bugs/event-listener-accumulation-persistent-sidebar-System-20260217.md) — Related `data-bound` sentinel pattern for persistent DOM
- [scoped-style-specificity-global-override](../ui-bugs/scoped-style-specificity-global-override-System-20260217.md) — Astro CSS specificity with `:global()` and `:where()` wrapper
- [cross-route-anchor-scroll-failure](../ui-bugs/cross-route-anchor-scroll-failure-System-20260217.md) — View transition `astro:after-swap` pattern
- [multi-page-site-architecture-split](../integration-issues/multi-page-site-architecture-split-Astro-20260217.md) — Synthesizes multiple related patterns

### External

- [Astro: Scripts in View Transitions](https://docs.astro.build/en/guides/view-transitions/) — Official lifecycle event docs
- [MDN: hidden attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) — UA stylesheet behavior
- [MDN: CSS Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) — Author vs UA stylesheet precedence
