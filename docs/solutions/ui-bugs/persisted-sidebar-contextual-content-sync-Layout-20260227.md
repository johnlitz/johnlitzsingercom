---
module: Layout
date: 2026-02-27
problem_type: ui_bug
component: frontend_stimulus
symptoms:
  - "Persisted sidebar shows stale contextual content after view transition navigation"
  - "Homepage tagline/tags remain visible after navigating to inner pages"
  - "Blog post reading time metadata from previous post persists on new post"
root_cause: logic_error
resolution_type: code_fix
severity: high
tags: [astro, view-transitions, transition-persist, sidebar, client-side-dom]
---

# Troubleshooting: Persisted Sidebar Shows Stale Contextual Content After View Transitions

## Problem

When using Astro's `transition:persist` on a sidebar that displays different content per page (homepage tagline vs. numbered nav vs. blog post metadata), the sidebar DOM is preserved across navigations but the contextual content becomes stale — showing the previous page's data.

## Environment

- Module: Layout (BaseLayout + LeftColumn)
- Framework: Astro 5 with ClientRouter (View Transitions)
- Affected Component: Sidebar with `transition:persist="sidebar"`
- Date: 2026-02-27

## Symptoms

- Homepage shows tagline + tags + availability; navigating to /work still shows homepage content instead of nav + narrative
- Blog post sidebar shows reading time/date from previous post when navigating between posts
- `data-page` attribute updates correctly but sidebar DOM doesn't re-render (because it's persisted)

## What Didn't Work

**Direct solution:** The problem was identified and solved during initial implementation by recognizing the persist/render conflict upfront.

The naive approach would have been to rely solely on Astro's server-side rendering to set sidebar content per page. This fails because `transition:persist` explicitly prevents the sidebar from being re-rendered during navigation — the whole point is to keep it stable. So the server-rendered content for the new page is discarded.

## Solution

**Three-part pattern:**

1. **Embed contextual data in each page** via `<script is:inline>` with `define:vars`:

```astro
<!-- In BaseLayout.astro — each page renders this with its own data -->
<script is:inline define:vars={{ sidebarContextJSON: JSON.stringify(sidebarContext || null) }}>
  window.__sidebarContext = JSON.parse(sidebarContextJSON);
</script>
```

2. **Pass contextual data from each page** through props:

```astro
<!-- In work.astro -->
<BaseLayout
  title="Work — John Litzsinger"
  description="Work experience."
  sidebarContext={{ narrative: 'Building financial systems that scale.' }}
>

<!-- In BlogPostLayout.astro -->
const sidebarContext = {
  readingTime: `${readingMinutes} min read`,
  wordCount: `${wordCountFormatted}w`,
  publishDate: formattedDate,
  tags,
};

<BaseLayout sidebarContext={sidebarContext}>
```

3. **Update sidebar DOM client-side** in the `astro:after-swap` event handler:

```typescript
function updateSidebarContext(path: string) {
  const isHome = path === '/';
  const isBlogPost = path.startsWith('/blog/') && path !== '/blog/';
  const ctx = (window as any).__sidebarContext;

  const sidebarNav = document.querySelector('.sidebar-nav') as HTMLElement | null;
  const homeContext = document.querySelector('.sidebar-context') as HTMLElement | null;

  if (isHome) {
    // Hide nav, show homepage context
    if (sidebarNav) sidebarNav.style.display = 'none';
    if (homeContext) {
      homeContext.style.display = '';
      homeContext.innerHTML = `
        <p class="context-tagline">Building at the intersection of finance and technology.</p>
        <div class="context-tags">...</div>
        <p class="context-availability">Open to opportunities</p>
      `;
    }
  } else {
    // Show nav, update contextual content from window.__sidebarContext
    if (sidebarNav) sidebarNav.style.display = '';
    if (ctx && homeContext) {
      let html = '';
      if (isBlogPost && ctx.readingTime) {
        html += `<p class="context-meta">${ctx.readingTime} · ${ctx.wordCount}</p>`;
      }
      // ... build HTML from ctx
      homeContext.innerHTML = html;
    }
  }
}

// Called in astro:after-swap handler
document.addEventListener('astro:after-swap', () => {
  updateSidebarContext(window.location.pathname);
});
```

## Why This Works

1. **Root cause:** Astro's `transition:persist` preserves the sidebar DOM element across navigations. The server renders fresh sidebar content for each page, but the persisted element's DOM is kept from the previous page — the new page's sidebar HTML is discarded.

2. **The solution bridges server and client:** Each page embeds its contextual data into `window.__sidebarContext` via an inline script (which DOES execute on each navigation, unlike module scripts). The `astro:after-swap` handler reads this data and manually updates the persisted sidebar's innerHTML.

3. **Key Astro behavior:** `<script is:inline>` runs on every page load/navigation. Regular `<script>` (module) runs only once. The `define:vars` directive safely serializes server-side data into the inline script.

## Prevention

- **When using `transition:persist`:** Always assume the persisted element's content is stale after navigation. Plan client-side update logic from the start.
- **Data bridge pattern:** Embed per-page data in `window.__` via `<script is:inline define:vars={}>` and read it in `astro:after-swap`.
- **Test navigation flows:** After implementing persisted elements, manually navigate between all page types (homepage ↔ inner ↔ blog post) to verify content updates.
- **Consider whether `transition:persist` is worth the complexity.** If the sidebar content changes significantly per page, persistence may add more complexity than the animation smoothness it provides.

## Related Issues

- See also: [event-listener-accumulation-persistent-sidebar-System-20260217.md](./event-listener-accumulation-persistent-sidebar-System-20260217.md) — Related `transition:persist` sidebar issue with event listener accumulation
- See also: [astro-hidden-attr-and-view-transition-script-pitfalls.md](./astro-hidden-attr-and-view-transition-script-pitfalls.md) — View transition script execution pitfalls
- See also: [mobile-content-hidden-data-page-layout-System-20260217.md](./mobile-content-hidden-data-page-layout-System-20260217.md) — Data-page attribute conditional rendering issues
