# Website Redesign v2 — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the site from a generic portfolio template into a memorable personal artifact with macOS-style colored folders as the homepage centerpiece, file-browser aesthetics throughout, and a new Guest Book feature.

**Architecture:** Astro 5 static site. All pages are `.astro` files. Folder icons are inline SVGs with CSS-only hover animations (transform + opacity, GPU-composited). Guest Book uses a React island with Supabase for persistence and a Vercel Edge Function for writes. Urbanist font added as WOFF2 for the brand name only.

**Tech Stack:** Astro 5, React 19, Supabase JS client, Vercel Edge Functions, CSS custom properties

**Design doc:** `docs/plans/2026-03-09-website-redesign-v2-design.md`

---

## Task 1: Convert Urbanist font to WOFF2 and add to public/fonts

**Files:**
- Source: `/home/johnl/Downloads/Urbanist/Urbanist-VariableFont_wght.ttf`
- Create: `public/fonts/Urbanist-Variable.woff2`
- Cleanup: Remove unused fonts from `public/fonts/` (DMSans, Jost, VT323)

**Step 1: Install woff2 conversion tool**

Run: `pip install fonttools brotli 2>/dev/null || pip3 install fonttools brotli`

**Step 2: Convert Urbanist TTF to WOFF2**

Run:
```bash
python3 -c "
from fontTools.ttLib import TTFont
font = TTFont('/home/johnl/Downloads/Urbanist/Urbanist-VariableFont_wght.ttf')
font.flavor = 'woff2'
font.save('public/fonts/Urbanist-Variable.woff2')
print('Converted successfully')
"
```

Expected: `Converted successfully`

**Step 3: Remove unused font files**

Run:
```bash
rm public/fonts/DMSans-Regular.woff2 public/fonts/Jost-Bold.woff2 public/fonts/VT323-Regular.woff2
```

**Step 4: Verify fonts directory**

Run: `ls -la public/fonts/*.woff2`

Expected: `Urbanist-Variable.woff2`, `RethinkSans-Variable.woff2`, `RethinkSans-Italic-Variable.woff2`

**Step 5: Commit**

```bash
git add public/fonts/Urbanist-Variable.woff2
git rm public/fonts/DMSans-Regular.woff2 public/fonts/Jost-Bold.woff2 public/fonts/VT323-Regular.woff2
git commit -m "feat: add Urbanist font, remove unused fonts (DMSans, Jost, VT323)"
```

---

## Task 2: Update design tokens and global CSS

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/BaseHead.astro`

**Step 1: Add Urbanist @font-face and folder color tokens to global.css**

In `src/styles/global.css`, add Urbanist @font-face declaration after the existing Rethink Sans declarations:

```css
/* Urbanist — brand name only (variable, 100-900) */
@font-face {
  font-family: 'Urbanist';
  src: url('/fonts/Urbanist-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

Add to `:root` tokens:

```css
  /* Brand font */
  --font-brand: 'Urbanist', system-ui, sans-serif;

  /* Folder colors */
  --folder-work: #3B82F6;
  --folder-feed: #22C55E;
  --folder-guestbook: #F59E0B;
  --folder-about: #8B5CF6;
```

Remove the VT323 @font-face if still present (it was from the old design).

**Step 2: Add Urbanist preload to BaseHead.astro**

In `src/components/BaseHead.astro`, add after the existing Rethink Sans preload line:

```html
<link rel="preload" href="/fonts/Urbanist-Variable.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
```

**Step 3: Verify dev server still works**

Run: `curl -s http://localhost:4321 | head -20`

Expected: HTML output with no errors

**Step 4: Commit**

```bash
git add src/styles/global.css src/components/BaseHead.astro
git commit -m "feat: add Urbanist font tokens and folder color variables"
```

---

## Task 3: Update BaseLayout — header, breadcrumbs, footer

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

This is the biggest layout change. The header needs: Urbanist brand name, Reddit/HN links removed, breadcrumb support for inner pages, and a new footer.

**Step 1: Update BaseLayout.astro props to accept breadcrumbs**

Add to the Props interface:

```typescript
breadcrumbs?: { label: string; href?: string }[];
```

**Step 2: Replace the header HTML**

Remove the Reddit and HN social link `<a>` tags (the two links to `https://reddit.com` and `https://news.ycombinator.com`).

Change the brand `<span class="brand-name">` to use Urbanist:

```html
<span class="brand-name" style="font-family: var(--font-brand); font-weight: 700;">John Litzsinger</span>
```

Remove the `page-nav` section entirely. Replace it with a breadcrumb bar that renders when `breadcrumbs` prop is provided:

```astro
{breadcrumbs && breadcrumbs.length > 0 && (
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/" class="crumb">jl</a>
    {breadcrumbs.map((crumb) => (
      <>
        <span class="crumb-sep">/</span>
        {crumb.href ? (
          <a href={crumb.href} class="crumb">{crumb.label}</a>
        ) : (
          <span class="crumb crumb-current">{crumb.label}</span>
        )}
      </>
    ))}
  </nav>
)}
```

**Step 3: Add footer HTML before closing `</body>`**

```html
<footer class="site-footer">
  <span>&copy; 2026 John Litzsinger</span>
  <span>Built with Astro</span>
</footer>
```

**Step 4: Add breadcrumb and footer styles**

```css
.breadcrumb {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--gutter);
  max-width: var(--content-max);
  margin-inline: auto;
}

.crumb {
  color: var(--muted);
  text-decoration: none;
}

.crumb:hover {
  color: var(--foreground);
  text-decoration: none;
}

.crumb-current {
  color: var(--foreground);
}

.crumb-sep {
  color: var(--muted);
  user-select: none;
}

.site-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: var(--content-max);
  margin-inline: auto;
  padding: var(--space-2xl) var(--gutter) var(--space-lg);
  font-size: var(--text-xs);
  color: var(--muted);
}
```

**Step 5: Update mobile styles**

In the existing `@media (max-width: 480px)` block, add:

```css
.social-links a[aria-label="X"],
.social-links a[aria-label="LinkedIn"] {
  display: none;
}
```

This keeps only Email + GitHub on small screens.

**Step 6: Verify the header renders on homepage and inner pages**

Run dev server, check `http://localhost:4321` and `http://localhost:4321/work`

**Step 7: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: Urbanist brand, breadcrumbs, footer, remove Reddit/HN links"
```

---

## Task 4: Redesign homepage — folders as centerpiece

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Replace the entire homepage content**

Remove the project grid and small folder nav. Replace with 4 large macOS-style folder icons. Each folder is an inline SVG with a filled macOS folder shape (~80px tall), colored per the design tokens.

The SVG folder shape should be a filled macOS-style folder: rounded body rectangle with a tab in the upper-left. The tab portion should be a separate SVG group so it can be transformed (rotated open) on hover.

Structure:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="John Litzsinger"
  description="Finance, markets, and technology."
>
  <div class="home">
    <p class="tagline">Finance @ Purdue interested in startups.</p>

    <nav class="folder-grid" aria-label="Browse">
      <a href="/work" class="folder" style="--folder-color: var(--folder-work);">
        <div class="folder-icon">
          <svg viewBox="0 0 80 64" width="80" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g class="folder-body">
              <rect x="0" y="14" width="80" height="50" rx="4" fill="var(--folder-color)" />
            </g>
            <g class="folder-tab">
              <path d="M0 6a4 4 0 0 1 4-4h22a4 4 0 0 1 3.2 1.6L34 10H0V6Z" fill="var(--folder-color)" />
            </g>
            <rect x="0" y="10" width="80" height="4" fill="var(--folder-color)" opacity="0.85" />
          </svg>
        </div>
        <span class="folder-label">Work</span>
      </a>

      <a href="/blitz-feed" class="folder" style="--folder-color: var(--folder-feed);">
        <div class="folder-icon">
          <svg viewBox="0 0 80 64" width="80" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g class="folder-body">
              <rect x="0" y="14" width="80" height="50" rx="4" fill="var(--folder-color)" />
            </g>
            <g class="folder-tab">
              <path d="M0 6a4 4 0 0 1 4-4h22a4 4 0 0 1 3.2 1.6L34 10H0V6Z" fill="var(--folder-color)" />
            </g>
            <rect x="0" y="10" width="80" height="4" fill="var(--folder-color)" opacity="0.85" />
          </svg>
        </div>
        <span class="folder-label">Feed</span>
      </a>

      <a href="/guest-book" class="folder" style="--folder-color: var(--folder-guestbook);">
        <div class="folder-icon">
          <svg viewBox="0 0 80 64" width="80" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g class="folder-body">
              <rect x="0" y="14" width="80" height="50" rx="4" fill="var(--folder-color)" />
            </g>
            <g class="folder-tab">
              <path d="M0 6a4 4 0 0 1 4-4h22a4 4 0 0 1 3.2 1.6L34 10H0V6Z" fill="var(--folder-color)" />
            </g>
            <rect x="0" y="10" width="80" height="4" fill="var(--folder-color)" opacity="0.85" />
          </svg>
        </div>
        <span class="folder-label">Guest Book</span>
      </a>

      <a href="/about" class="folder" style="--folder-color: var(--folder-about);">
        <div class="folder-icon">
          <svg viewBox="0 0 80 64" width="80" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g class="folder-body">
              <rect x="0" y="14" width="80" height="50" rx="4" fill="var(--folder-color)" />
            </g>
            <g class="folder-tab">
              <path d="M0 6a4 4 0 0 1 4-4h22a4 4 0 0 1 3.2 1.6L34 10H0V6Z" fill="var(--folder-color)" />
            </g>
            <rect x="0" y="10" width="80" height="4" fill="var(--folder-color)" opacity="0.85" />
          </svg>
        </div>
        <span class="folder-label">About</span>
      </a>
    </nav>
  </div>
</BaseLayout>
```

**Step 2: Add folder styles with hover animation**

```css
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2xl);
  padding-top: var(--space-xl);
}

.tagline {
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--foreground);
  max-width: 20ch;
  text-align: center;
}

.folder-grid {
  display: flex;
  justify-content: center;
  gap: var(--space-xl);
  flex-wrap: wrap;
}

.folder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  color: var(--foreground);
  cursor: pointer;
}

.folder-icon {
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
              filter 200ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, filter;
}

.folder:hover .folder-icon {
  transform: translateY(-8px) scale(1.08);
  filter: drop-shadow(0 8px 16px color-mix(in srgb, var(--folder-color) 40%, transparent));
}

.folder:hover .folder-tab {
  transform-origin: 0 10px;
  transform: rotate(-12deg);
}

.folder-tab {
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.folder-label {
  font-size: var(--text-sm);
  font-weight: 500;
  transition: color 200ms ease;
}

.folder:hover .folder-label {
  color: var(--folder-color);
}

@media (max-width: 600px) {
  .folder-grid {
    gap: var(--space-lg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .folder-icon,
  .folder-tab,
  .folder-label {
    transition: none;
  }
  .folder:hover .folder-icon {
    transform: none;
    filter: none;
  }
  .folder:hover .folder-tab {
    transform: none;
  }
}
```

**Step 3: Verify homepage in browser**

Navigate to `http://localhost:4321` — should show tagline + 4 colored folders with hover animations

**Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: redesign homepage with macOS-style colored folder icons"
```

---

## Task 5: Redesign Work page — file-listing table

**Files:**
- Modify: `src/pages/work.astro`

**Step 1: Replace Work page with file-listing layout**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { projects } from '../data/projects';
---

<BaseLayout
  title="Work — John Litzsinger"
  description="Selected projects in finance, data, and technology."
  breadcrumbs={[{ label: 'Work' }]}
>
  <div class="work-page">
    <h1>Work</h1>
    <div class="file-listing">
      {projects.map((p) => (
        <a href={`/work/${p.slug}`} class="file-row">
          <span class="file-name">{p.title}</span>
          <span class="file-tech">{p.tech.join(' / ')}</span>
          <span class="file-links">
            {p.links.map((link, i) => (
              <>
                {i > 0 && <span class="sep"> / </span>}
                <span>{link.label}</span>
              </>
            ))}
          </span>
        </a>
      ))}
    </div>
  </div>
</BaseLayout>
```

**Step 2: Add file-listing styles**

```css
.work-page { max-width: var(--content-max); }

h1 {
  font-size: var(--text-2xl);
  letter-spacing: -0.02em;
  margin-bottom: var(--space-lg);
}

.file-listing {
  display: flex;
  flex-direction: column;
}

.file-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-sm);
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: inherit;
  transition: background-color var(--duration-fast) ease;
}

.file-row:first-child {
  border-top: 1px solid var(--border);
}

.file-row:hover {
  background-color: var(--surface);
  text-decoration: none;
}

.file-row:hover .file-name {
  color: var(--accent);
}

.file-name {
  font-weight: 600;
  color: var(--foreground);
  flex: 1;
  transition: color var(--duration-fast) ease;
}

.file-tech {
  font-size: var(--text-xs);
  color: var(--muted);
  white-space: nowrap;
}

.file-links {
  font-size: var(--text-xs);
  color: var(--accent);
  white-space: nowrap;
}

.file-links .sep {
  color: var(--muted);
}

@media (max-width: 600px) {
  .file-row {
    flex-direction: column;
    gap: var(--space-xs);
  }
}

@media (prefers-reduced-motion: reduce) {
  .file-row, .file-name { transition: none; }
}
```

**Step 3: Verify at `http://localhost:4321/work`**

**Step 4: Commit**

```bash
git add src/pages/work.astro
git commit -m "feat: work page file-listing table, replace card grid"
```

---

## Task 6: Update Work detail page with breadcrumbs

**Files:**
- Modify: `src/pages/work/[slug].astro`

**Step 1: Add breadcrumbs prop to the BaseLayout call**

Replace the existing `<BaseLayout>` opening tag:

```astro
<BaseLayout
  title={`${project.title} — John Litzsinger`}
  description={project.description}
  breadcrumbs={[{ label: 'Work', href: '/work' }, { label: project.title }]}
>
```

**Step 2: Remove the `<a href="/work" class="back-link">` element**

The breadcrumb now handles navigation back to `/work`.

**Step 3: Remove the `.back-link` CSS styles**

**Step 4: Verify at `http://localhost:4321/work/personal-website`**

**Step 5: Commit**

```bash
git add src/pages/work/[slug].astro
git commit -m "feat: add breadcrumb navigation to project detail pages"
```

---

## Task 7: Redesign Feed page

**Files:**
- Modify: `src/pages/blitz-feed.astro`

**Step 1: Replace bLitz Feed with breadcrumb and new styling**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

<BaseLayout
  title="bLitz Feed — John Litzsinger"
  description="Blog posts and writing."
  breadcrumbs={[{ label: 'Feed' }]}
>
  <div class="feed-page">
    <h1>bLitz Feed</h1>
    {posts.length === 0 ? (
      <p class="empty">No posts yet. More writing coming soon.</p>
    ) : (
      <div class="post-listing">
        {posts.map((post) => (
          <a href={`/blog/${post.id}`} class="post-row">
            <time datetime={post.data.pubDate.toISOString()}>
              {post.data.pubDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
            <h3>{post.data.title}</h3>
            <p>{post.data.description}</p>
            {post.data.tags.length > 0 && (
              <span class="post-tags">tags: {post.data.tags.join(', ')}</span>
            )}
          </a>
        ))}
      </div>
    )}
    {posts.length > 0 && posts.length < 3 && (
      <p class="more-soon">More writing coming soon.</p>
    )}
  </div>
</BaseLayout>
```

**Step 2: Add feed styles**

```css
.feed-page { max-width: var(--content-max); }

h1 {
  font-size: var(--text-2xl);
  letter-spacing: -0.02em;
  margin-bottom: var(--space-lg);
}

.post-listing {
  display: flex;
  flex-direction: column;
}

.post-row {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: var(--space-md) var(--space-sm);
  border-bottom: 1px solid var(--border);
  transition: background-color var(--duration-fast) ease;
}

.post-row:first-child {
  border-top: 1px solid var(--border);
}

.post-row:hover {
  background-color: var(--surface);
  text-decoration: none;
}

.post-row:hover h3 {
  color: var(--accent);
}

.post-row time {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--muted);
  display: block;
  margin-bottom: var(--space-xs);
}

.post-row h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: var(--space-xs);
  transition: color var(--duration-fast) ease;
}

.post-row p {
  font-size: var(--text-sm);
  color: var(--secondary);
  line-height: 1.5;
}

.post-tags {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--muted);
  margin-top: var(--space-xs);
}

.empty, .more-soon {
  color: var(--muted);
  font-size: var(--text-sm);
  margin-top: var(--space-lg);
}

@media (prefers-reduced-motion: reduce) {
  .post-row, .post-row h3 { transition: none; }
}
```

**Step 3: Verify at `http://localhost:4321/blitz-feed`**

**Step 4: Commit**

```bash
git add src/pages/blitz-feed.astro
git commit -m "feat: feed page with monospace dates, tags metadata, breadcrumb"
```

---

## Task 8: Update BlogPostLayout with breadcrumbs

**Files:**
- Modify: `src/layouts/BlogPostLayout.astro`

**Step 1: Add breadcrumbs to the BaseLayout call**

Replace the `<BaseLayout>` opening tag:

```astro
<BaseLayout
  title={`${title} — John Litzsinger`}
  description={description}
  image={heroImage}
  type="article"
  publishedDate={pubDate}
  breadcrumbs={[{ label: 'Feed', href: '/blitz-feed' }, { label: title }]}
>
```

**Step 2: Remove the post-footer "Back to feed" link**

The breadcrumb handles this now. Remove the entire `<footer class="post-footer">` block and its CSS.

**Step 3: Verify at `http://localhost:4321/blog/hello-world`**

**Step 4: Commit**

```bash
git add src/layouts/BlogPostLayout.astro
git commit -m "feat: add breadcrumb to blog posts, remove back-to-feed link"
```

---

## Task 9: Create About page

**Files:**
- Create: `src/pages/about.astro`

**Step 1: Create the About page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="About — John Litzsinger"
  description="Finance @ Purdue. Building startups, tools, and this website."
  breadcrumbs={[{ label: 'About' }]}
>
  <div class="about-page">
    <h1 class="about-name">John Litzsinger</h1>
    <p class="about-quip">I build things and break spreadsheets.</p>

    <dl class="stats">
      <div class="stat">
        <dt>Studying</dt>
        <dd>Finance @ Purdue</dd>
      </div>
      <div class="stat">
        <dt>Building</dt>
        <dd>Startups, tools, this website</dd>
      </div>
    </dl>

    <nav class="connect" aria-label="Connect">
      <a href="mailto:jlitzsin@purdue.edu" class="connect-link">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        <span>Email</span>
      </a>
      <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="connect-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
        <span>X</span>
      </a>
      <a href="https://www.linkedin.com/in/johnlitzsinger" target="_blank" rel="noopener noreferrer" class="connect-link">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
        <span>LinkedIn</span>
      </a>
      <a href="https://github.com/johnlitz" target="_blank" rel="noopener noreferrer" class="connect-link">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
        <span>GitHub</span>
      </a>
    </nav>
  </div>
</BaseLayout>
```

**Step 2: Add About page styles**

```css
.about-page {
  max-width: var(--content-max);
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.about-name {
  font-family: var(--font-brand);
  font-weight: 800;
  font-size: clamp(2.5rem, 2rem + 4vw, 5rem);
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--foreground);
}

.about-quip {
  font-size: var(--text-lg);
  color: var(--muted);
  margin-top: calc(-1 * var(--space-md));
}

.stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.stat {
  display: flex;
  gap: var(--space-lg);
  align-items: baseline;
}

.stat dt {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--muted);
  min-width: 10ch;
}

.stat dd {
  font-weight: 600;
  color: var(--foreground);
}

.connect {
  display: flex;
  gap: var(--space-lg);
  flex-wrap: wrap;
}

.connect-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--muted);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--duration-fast) ease;
}

.connect-link:hover {
  color: var(--accent);
  text-decoration: none;
}

@media (max-width: 600px) {
  .stat {
    flex-direction: column;
    gap: var(--space-xs);
  }
}

@media (prefers-reduced-motion: reduce) {
  .connect-link { transition: none; }
}
```

**Step 3: Verify at `http://localhost:4321/about`**

**Step 4: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: create visual About page with spec-sheet layout"
```

---

## Task 10: Create Guest Book page (frontend)

**Files:**
- Create: `src/pages/guest-book.astro`
- Create: `src/components/react/GuestBook.tsx`

**Step 1: Create the Guest Book Astro page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import GuestBook from '../components/react/GuestBook';
---

<BaseLayout
  title="Guest Book — John Litzsinger"
  description="Leave a note. Say hi."
  breadcrumbs={[{ label: 'Guest Book' }]}
>
  <div class="guestbook-page">
    <h1>Guest Book</h1>
    <p class="guestbook-intro">Leave a note. Say hi. Draw something.</p>
    <GuestBook client:load />
  </div>
</BaseLayout>

<style>
  .guestbook-page { max-width: var(--content-max); }

  h1 {
    font-size: var(--text-2xl);
    letter-spacing: -0.02em;
    margin-bottom: var(--space-sm);
  }

  .guestbook-intro {
    color: var(--muted);
    margin-bottom: var(--space-xl);
  }
</style>
```

**Step 2: Create the React GuestBook component**

```tsx
import { useState, useEffect, useRef } from 'react';

interface Entry {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

export default function GuestBook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    if (!SUPABASE_URL) return;
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/guestbook?select=id,name,message,created_at&order=created_at.desc&limit=50`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      if (res.ok) setEntries(await res.json());
    } catch {
      // Silent fail — guest book entries just won't show
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypotRef.current?.value) return; // Bot detected
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/guestbook`,
        {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          body: JSON.stringify({ name: name.trim(), message: message.trim() }),
        }
      );

      if (res.ok) {
        const [newEntry] = await res.json();
        setEntries((prev) => [newEntry, ...prev]);
        setName('');
        setMessage('');
      } else {
        setError('Failed to sign. Try again.');
      }
    } catch {
      setError('Failed to sign. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="gb-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          maxLength={100}
          className="gb-input"
        />
        {/* Honeypot */}
        <input
          ref={honeypotRef}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Leave a message..."
          required
          maxLength={500}
          rows={3}
          className="gb-textarea"
        />
        {error && <p className="gb-error">{error}</p>}
        <button type="submit" disabled={submitting} className="gb-submit">
          {submitting ? 'Signing...' : 'Sign'}
        </button>
      </form>

      <div className="gb-entries">
        {entries.map((entry) => (
          <div key={entry.id} className="gb-entry">
            <div className="gb-entry-header">
              <span className="gb-entry-name">{entry.name}</span>
              <time className="gb-entry-date">
                {new Date(entry.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </div>
            <p className="gb-entry-message">{entry.message}</p>
          </div>
        ))}
      </div>

      {!SUPABASE_URL && (
        <p style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-lg)' }}>
          Guest book coming soon — backend not yet configured.
        </p>
      )}
    </div>
  );
}
```

**Step 3: Add Guest Book CSS to the Astro page**

Add these styles inside the existing `<style>` tag in `guest-book.astro`:

```css
  :global(.gb-form) {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: var(--space-xl);
  }

  :global(.gb-input),
  :global(.gb-textarea) {
    font-family: var(--font);
    font-size: var(--text-base);
    color: var(--foreground);
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--border);
    padding: var(--space-sm) 0;
    outline: none;
    transition: border-color var(--duration-fast) ease;
  }

  :global(.gb-input)::placeholder,
  :global(.gb-textarea)::placeholder {
    font-family: var(--font-mono);
    color: var(--muted);
    opacity: 0.6;
  }

  :global(.gb-input):focus,
  :global(.gb-textarea):focus {
    border-color: var(--accent);
  }

  :global(.gb-textarea) {
    resize: vertical;
    min-height: 4rem;
  }

  :global(.gb-submit) {
    align-self: flex-start;
    font-family: var(--font-brand);
    font-weight: 700;
    font-size: var(--text-sm);
    color: var(--background);
    background: var(--accent);
    border: none;
    padding: var(--space-sm) var(--space-lg);
    cursor: pointer;
    transition: opacity var(--duration-fast) ease;
  }

  :global(.gb-submit):hover {
    opacity: 0.85;
  }

  :global(.gb-submit):disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.gb-error) {
    color: var(--accent);
    font-size: var(--text-sm);
  }

  :global(.gb-entries) {
    display: flex;
    flex-direction: column;
  }

  :global(.gb-entry) {
    padding: var(--space-md) 0;
    border-bottom: 1px solid var(--border);
  }

  :global(.gb-entry:first-child) {
    border-top: 1px solid var(--border);
  }

  :global(.gb-entry-header) {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: var(--space-xs);
  }

  :global(.gb-entry-name) {
    font-weight: 600;
    color: var(--foreground);
  }

  :global(.gb-entry-date) {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--muted);
  }

  :global(.gb-entry-message) {
    color: var(--secondary);
    line-height: 1.5;
  }
```

**Step 4: Verify at `http://localhost:4321/guest-book`**

The form should render. Without Supabase env vars, it shows "Guest book coming soon" fallback.

**Step 5: Commit**

```bash
git add src/pages/guest-book.astro src/components/react/GuestBook.tsx
git commit -m "feat: create guest book page with React form and Supabase integration"
```

---

## Task 11: Update 404 page with breadcrumb

**Files:**
- Modify: `src/pages/404.astro`

**Step 1: Add breadcrumb to 404**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Page Not Found — John Litzsinger"
  description="The page you're looking for doesn't exist."
  breadcrumbs={[{ label: '404' }]}
>
  <div class="not-found">
    <h1>404</h1>
    <p>The page you're looking for doesn't exist.</p>
    <a href="/">Go home</a>
  </div>
</BaseLayout>
```

Keep the existing styles.

**Step 2: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: add breadcrumb to 404 page"
```

---

## Task 12: Fix broken /contact link in hello-world blog post

**Files:**
- Modify: `src/content/blog/hello-world.mdx`

**Step 1: Find and replace the broken link**

Search for `/contact` in the file and replace with `mailto:jlitzsin@purdue.edu` or `/about` depending on context.

**Step 2: Commit**

```bash
git add src/content/blog/hello-world.mdx
git commit -m "fix: replace broken /contact link with /about in hello-world post"
```

---

## Task 13: Build verification and visual QA

**Step 1: Run production build**

```bash
npm run build
```

Expected: Clean build with no errors.

**Step 2: Visual check each page**

Use Playwright to screenshot every page and verify:

- `http://localhost:4321` — 4 colored folders, tagline, Urbanist brand name, no project grid
- `http://localhost:4321/work` — file-listing table, breadcrumb
- `http://localhost:4321/work/personal-website` — detail page with breadcrumb
- `http://localhost:4321/blitz-feed` — post with monospace date, tags metadata
- `http://localhost:4321/blog/hello-world` — blog post with breadcrumb
- `http://localhost:4321/guest-book` — form and fallback message
- `http://localhost:4321/about` — big name, stats, connect links
- `http://localhost:4321/404-test` — 404 with breadcrumb

**Step 3: Check hover animations on homepage folders**

Verify CSS transform + drop-shadow works on hover, folder tab opens.

**Step 4: Check mobile responsiveness**

Resize to 375px width and verify:
- Folders wrap on small screens
- File listing stacks
- Brand name hides, social icons reduce

**Step 5: Final commit if any fixes needed**

---

## Task 14: Update CLAUDE.md and project memory

**Files:**
- Modify: `CLAUDE.md`
- Modify: `.claude/projects/-home-johnl-Desktop-johnlitzsingercom/memory/MEMORY.md`

**Step 1: Update CLAUDE.md**

Update the Architecture, Key files, Navigation, and Design Context sections to reflect the v2 redesign:
- Add Urbanist font references
- Add About and Guest Book pages
- Update navigation description (folders, breadcrumbs)
- Add footer mention
- Remove references to Reddit/HN
- Add Guest Book backend note

**Step 2: Update MEMORY.md**

Update the Current State and Architecture sections to reflect the v2 changes.

**Step 3: Commit**

```bash
git add CLAUDE.md .claude/projects/-home-johnl-Desktop-johnlitzsingercom/memory/MEMORY.md
git commit -m "docs: update CLAUDE.md and memory for v2 redesign"
```
