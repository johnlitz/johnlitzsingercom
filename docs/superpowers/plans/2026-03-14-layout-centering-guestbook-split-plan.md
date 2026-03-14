# Layout Centering, Guest Book Split, Resume Relocation — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 3 independent UI improvements: vertically center section page content, split guest book into two routes, and add a resume link to the top bar.

**Architecture:** Each change is independent and can be implemented in any order. Change 1 modifies BaseLayout's `<main>` flex alignment. Change 2 splits the monolithic `GuestBookPage.tsx` into two components with a new Astro page. Change 3 adds a social link and removes a duplicate.

**Tech Stack:** Astro 5, React, CSS custom properties

**Spec:** `docs/superpowers/specs/2026-03-14-layout-centering-guestbook-split-design.md`

---

## Chunk 1: Section Page Visual Centering

### Task 1: Center section page content in viewport

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (lines 365-374, the `main` style rule)

- [ ] **Step 1: Add scoped centering rule to BaseLayout**

Do NOT modify the existing `main` rule. Instead, add a new CSS rule after the `main` block (after line 374 in `BaseLayout.astro`'s `<style>`) that targets only section pages:

```css
body:not(.allow-scroll):has(.section-header) main {
  justify-content: center;
  padding-bottom: 15vh;
}
```

**Why this selector works:**
- `.section-header` is only rendered when `breadcrumbs.length === 1 && !breadcrumbs[0].href` — i.e., top-level section pages (Now, Work, Guest Book, About)
- `body:not(.allow-scroll)` excludes scrollable pages (About, blog posts, entries)
- The homepage has no breadcrumbs → no `.section-header` → rule doesn't fire
- Sub-pages (work/[slug], guest-book/entries) use multi-item breadcrumbs → `.breadcrumb` nav, not `.section-header` → rule doesn't fire

The existing `main` rule stays exactly as-is (no `justify-content`, no `padding-bottom` changes).

- [ ] **Step 4: Run build to verify**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 5: Visual check**

Run: `npm run dev`
Check at 375px, 768px, 1440px:
- `/now` — content visually centered, biased slightly upward
- `/work` — carousel centered in viewport
- `/about` — scrollable, content flows from top (NOT centered)
- `/` — homepage unchanged, tagline + folders centered as before

- [ ] **Step 6: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: vertically center section page content in viewport"
```

---

## Chunk 2: Guest Book Route Split

### Task 2: Create shared types and extract fetch logic

**Files:**
- Create: `src/components/react/guestbook/types.ts`
- Create: `src/components/react/guestbook/data.ts`

- [ ] **Step 1: Create shared types file**

Create `src/components/react/guestbook/types.ts` with the `Entry` interface and color constants extracted from `GuestBookPage.tsx`:

```typescript
export const NOTE_COLORS = [
  { name: 'Lemon', value: 'oklch(0.93 0.04 95)' },
  { name: 'Blush', value: 'oklch(0.93 0.04 15)' },
  { name: 'Sky', value: 'oklch(0.93 0.04 240)' },
  { name: 'Mint', value: 'oklch(0.93 0.04 160)' },
  { name: 'Lavender', value: 'oklch(0.93 0.04 300)' },
  { name: 'Peach', value: 'oklch(0.93 0.04 55)' },
] as const;

export const PIN_COLORS = [
  { name: 'Red', value: 'oklch(0.65 0.20 25)' },
  { name: 'Blue', value: 'oklch(0.65 0.17 264)' },
  { name: 'Green', value: 'oklch(0.65 0.17 152)' },
  { name: 'Gold', value: 'oklch(0.65 0.17 80)' },
  { name: 'Purple', value: 'oklch(0.65 0.17 295)' },
  { name: 'Black', value: 'oklch(0.30 0.00 0)' },
] as const;

export interface Entry {
  id?: number;
  name: string;
  message: string;
  created_at: string;
  signature?: string;
  image?: string;
  note_color?: string;
  pin_color?: string;
  approved?: boolean;
}

export const PLACEHOLDER_ENTRIES: Entry[] = [
  { name: 'Alex', message: 'Cool site! Love the folder design.', created_at: '2026-02-28', note_color: NOTE_COLORS[2].value, pin_color: PIN_COLORS[1].value },
  { name: 'Jordan', message: 'Found you through Launch Club. Keep building!', created_at: '2026-02-25', note_color: NOTE_COLORS[0].value, pin_color: PIN_COLORS[3].value },
  { name: 'Sam', message: 'Clean design. Astro is the way.', created_at: '2026-02-20', note_color: NOTE_COLORS[3].value, pin_color: PIN_COLORS[2].value },
  { name: 'Taylor', message: 'The pharmacy analyzer sounds interesting.', created_at: '2026-02-15', note_color: NOTE_COLORS[4].value, pin_color: PIN_COLORS[4].value },
  { name: 'Riley', message: 'Go Boilers!', created_at: '2026-02-10', note_color: NOTE_COLORS[1].value, pin_color: PIN_COLORS[0].value },
];
```

- [ ] **Step 2: Create shared data-fetching file**

Create `src/components/react/guestbook/data.ts`:

```typescript
import { type Entry, PLACEHOLDER_ENTRIES } from './types';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

export const isConfigured = Boolean(SUPABASE_URL);

export async function fetchEntries(): Promise<Entry[]> {
  if (!isConfigured) return PLACEHOLDER_ENTRIES;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/guestbook?select=id,name,message,created_at,signature,image,note_color,pin_color&approved=eq.true&order=created_at.desc&limit=50`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    if (res.ok) {
      const data = await res.json();
      return data.length > 0 ? data : PLACEHOLDER_ENTRIES;
    }
  } catch {
    // fall through
  }
  return PLACEHOLDER_ENTRIES;
}

export async function submitEntry(entry: {
  name: string;
  message: string;
  signature: string;
  image: string;
  note_color: string;
  pin_color: string;
}): Promise<boolean> {
  if (!isConfigured) return false;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/guestbook`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ ...entry, approved: false }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
```

- [ ] **Step 3: Commit shared modules**

```bash
git add src/components/react/guestbook/
git commit -m "refactor: extract guest book shared types and data layer"
```

### Task 3: Create GuestBookForm component

**Files:**
- Create: `src/components/react/GuestBookForm.tsx`

- [ ] **Step 1: Create GuestBookForm component**

Create `src/components/react/GuestBookForm.tsx`. This component contains:
- The form (name, message, signature canvas, color pickers, image upload)
- 3-note preview board
- "See all entries" link (an `<a>` tag, not a scroll button)

Copy from `GuestBookPage.tsx` lines 84–931 but with these changes:
- Import types/colors from `./guestbook/types`
- Import `isConfigured`, `fetchEntries`, `submitEntry` from `./guestbook/data`
- Remove the `SUPABASE_URL`, `SUPABASE_ANON_KEY` constants (now in data.ts)
- Remove `NOTE_COLORS`, `PIN_COLORS`, `Entry`, `PLACEHOLDER_ENTRIES` (now in types.ts)
- Remove the "All Entries" section (the `gb-all-section` div and its grid)
- Change the "See all entries" button to an `<a href="/guest-book/entries">` link
- Remove `compressImage`, `MAX_IMAGE_WIDTH`, `MAX_IMAGE_SIZE_KB` — move to a local utility or keep inline (keep inline, it's only used here)
- Keep the `Thumbtack`, `ColorChooser`, `SignatureCanvas` sub-components as-is
- Rename export to `GuestBookForm`
- Remove the `gb-all-section`, `gb-all-title`, `gb-all-grid` CSS rules
- Change `fetchEntries()` call to use the imported function
- Change submit logic to use `submitEntry()` from data.ts

The "See all entries" link replacement — change the button (lines 432-442 of GuestBookPage.tsx):

```tsx
{entries.length > 3 && (
  <a href="/guest-book/entries" className="gb-see-more">
    See all entries
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  </a>
)}
```

Note: arrow icon changed from chevron-down (`M6 9l6 6 6-6`) to chevron-right (`M9 18l6-6-6-6`) since it's now a navigation link, not a scroll trigger. The `.gb-see-more` styles stay the same but add `text-decoration: none;` since it's now an `<a>` tag.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds. `GuestBookForm` isn't used yet, but it should compile.

- [ ] **Step 3: Commit**

```bash
git add src/components/react/GuestBookForm.tsx
git commit -m "feat: create GuestBookForm component for viewport-locked guest book page"
```

### Task 4: Create GuestBookEntries component

**Files:**
- Create: `src/components/react/GuestBookEntries.tsx`

- [ ] **Step 1: Create GuestBookEntries component**

Create `src/components/react/GuestBookEntries.tsx`. This is the full scrollable entries grid:

```tsx
import { useState, useEffect } from 'react';
import { type Entry, NOTE_COLORS, PIN_COLORS } from './guestbook/types';
import { fetchEntries } from './guestbook/data';

function Thumbtack({ color }: { color: string }) {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" className="note-pin" aria-hidden="true">
      <circle cx="8" cy="6" r="5" fill={color} />
      <rect x="7" y="10" width="2" height="9" rx="1" fill="oklch(0.45 0.02 80)" />
      <circle cx="8" cy="6" r="2.5" fill="oklch(0.85 0.02 80)" opacity="0.5" />
    </svg>
  );
}

export default function GuestBookEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="gb-loading">Loading entries...</p>;
  }

  return (
    <div className="gb-entries-layout">
      <h2 className="gb-all-title">All Entries</h2>
      <div className="gb-all-grid">
        {entries.map((entry, i) => {
          const hash = entry.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
          const rotation = ((hash % 7) - 3) * 0.5;
          const noteColor = entry.note_color || NOTE_COLORS[hash % NOTE_COLORS.length].value;
          const pinColor = entry.pin_color || PIN_COLORS[hash % PIN_COLORS.length].value;

          return (
            <div
              key={entry.id ?? i}
              className="sticky-note"
              style={{
                '--note-bg': noteColor,
                '--note-rotation': `${rotation}deg`,
              } as React.CSSProperties}
            >
              <Thumbtack color={pinColor} />
              <p className="note-message">{entry.message}</p>
              <span className="note-author">&mdash; {entry.name}</span>
              {entry.image && (
                <img src={entry.image} alt={`Photo by ${entry.name}`} className="note-image" />
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .gb-entries-layout {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding: var(--space-md) 0 var(--space-lg);
        }

        .gb-loading {
          font-size: var(--text-sm);
          color: var(--muted);
          text-align: center;
          padding: var(--space-lg);
        }

        .gb-all-title {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--guestbook-500);
          letter-spacing: -0.01em;
        }

        .gb-all-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--space-lg);
          width: 100%;
          max-width: 720px;
          padding: 0 var(--space-sm) var(--space-lg);
        }

        .sticky-note {
          position: relative;
          background: var(--note-bg, oklch(0.93 0.04 95));
          border-radius: 2px;
          padding: var(--space-lg) var(--space-md) var(--space-md);
          transform: rotate(var(--note-rotation, 0deg));
          box-shadow:
            0 1px 3px oklch(0.00 0.00 0 / 0.06),
            0 4px 12px oklch(0.00 0.00 0 / 0.04);
          transition: transform var(--duration-base) cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow var(--duration-base) ease;
        }

        .sticky-note:hover {
          transform: rotate(var(--note-rotation, 0deg)) translateY(-4px) scale(1.02);
          box-shadow:
            0 4px 8px oklch(0.00 0.00 0 / 0.08),
            0 12px 32px oklch(0.00 0.00 0 / 0.06);
        }

        .note-pin {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          filter: drop-shadow(0 1px 2px oklch(0.30 0.00 0 / 0.25));
        }

        .note-message {
          font-size: var(--text-xs);
          color: oklch(0.25 0.00 0);
          line-height: 1.55;
          margin-bottom: var(--space-sm);
        }

        .note-author {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: oklch(0.40 0.00 0);
        }

        .note-image {
          margin-top: var(--space-sm);
          max-width: 100%;
          max-height: 100px;
          border-radius: 4px;
          object-fit: cover;
        }

        @media (max-width: 600px) {
          .gb-all-grid {
            grid-template-columns: 1fr;
            max-width: 280px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sticky-note {
            transition: none;
          }
          .sticky-note:hover {
            transform: rotate(var(--note-rotation, 0deg));
          }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/react/GuestBookEntries.tsx
git commit -m "feat: create GuestBookEntries component for scrollable entries page"
```

### Task 5: Create `/guest-book/entries` page and update `/guest-book`

**Files:**
- Create: `src/pages/guest-book/entries.astro`
- Modify: `src/pages/guest-book.astro` → move to `src/pages/guest-book/index.astro`

- [ ] **Step 1: Move guest-book.astro to directory-based routing**

Astro supports both `guest-book.astro` and `guest-book/index.astro` for the same route. To add a sub-route, we need the directory form:

```bash
mkdir -p src/pages/guest-book
git mv src/pages/guest-book.astro src/pages/guest-book/index.astro
```

- [ ] **Step 2: Update `/guest-book/index.astro` to use GuestBookForm**

Replace the content of `src/pages/guest-book/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import GuestBookForm from '../../components/react/GuestBookForm';
---

<BaseLayout
  title="Guest Book — John Litzsinger"
  description="Leave a note. Say hi."
  breadcrumbs={[{ label: 'Guest Book' }]}
>
  <div class="guestbook-page">
    <GuestBookForm client:idle />
  </div>
</BaseLayout>

<style>
  .guestbook-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
    flex: 1;
  }
</style>
```

Key changes from original:
- Import path changes (`../../layouts/` instead of `../layouts/`)
- Uses `GuestBookForm` instead of `GuestBookPage`
- Removed `scrollable` prop — page is now viewport-locked (inherits centering from Task 1)

- [ ] **Step 3: Create `/guest-book/entries.astro`**

Create `src/pages/guest-book/entries.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import GuestBookEntries from '../../components/react/GuestBookEntries';
---

<BaseLayout
  title="All Entries — Guest Book — John Litzsinger"
  description="All guest book entries."
  breadcrumbs={[{ label: 'Guest Book', href: '/guest-book' }, { label: 'All Entries' }]}
  scrollable={true}
>
  <div class="entries-page">
    <GuestBookEntries client:idle />
  </div>
</BaseLayout>

<style>
  .entries-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
</style>
```

Key points:
- `scrollable={true}` — this page scrolls
- Breadcrumbs: two items, first links back to `/guest-book`, second is current
- This renders the breadcrumb trail variant (not section-header), which includes a back arrow

- [ ] **Step 4: Run build to verify**

Run: `npm run build`
Expected: Build succeeds. Both `/guest-book` and `/guest-book/entries` routes generated.

- [ ] **Step 5: Visual check**

Run: `npm run dev`
- `/guest-book` — form + 3-note preview centered in viewport, "See all entries" link visible
- Click "See all entries" → navigates to `/guest-book/entries`
- `/guest-book/entries` — breadcrumb shows `jl › Guest Book › All Entries`, back arrow goes to `/guest-book`, scrollable grid of all entries
- No "All Entries" section visible on `/guest-book`

- [ ] **Step 6: Delete old GuestBookPage.tsx**

Once both new components are working and the old one is no longer imported:

```bash
git rm src/components/react/GuestBookPage.tsx
```

- [ ] **Step 7: Commit**

```bash
git add src/pages/guest-book/ src/components/react/GuestBookPage.tsx
git commit -m "feat: split guest book into viewport-locked form + scrollable entries page"
```

---

## Chunk 3: Resume Link in Top Bar

### Task 6: Add resume link to top bar social nav

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (lines 69-82, social links nav)
- Modify: `src/pages/about.astro` (lines 18-27, resume link)

- [ ] **Step 1: Verify resume PDF exists**

Check that `public/resume.pdf` exists:

```bash
ls -la public/resume.pdf
```

If it doesn't exist, **stop here** and ask the user to add their resume PDF to `public/`. The link won't work without it. (Note: as of plan creation, this file does not exist — it must be added before or during this task.)

- [ ] **Step 2: Add resume link to social nav in BaseLayout**

In `src/layouts/BaseLayout.astro`, add a new link after the GitHub link (after line 81, before the closing `</nav>`):

```html
<a href="/resume.pdf" target="_blank" rel="noopener noreferrer" aria-label="Resume">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
</a>
```

This uses the same document icon SVG already used on the about page (18x18, stroke style). It inherits all existing social link styles: `color: var(--muted)`, hover `color: var(--section-color)`, 44x44px touch target.

- [ ] **Step 3: Keep resume link visible on small screens**

In the `@media (max-width: 480px)` rule (line 400-403), the X and LinkedIn links are hidden. The resume link should remain visible (like Email and GitHub). Since we're selecting by `aria-label`, the existing hide rule only targets X and LinkedIn — the resume link is already safe. No change needed here, but verify.

- [ ] **Step 4: Remove resume link from about page**

In `src/pages/about.astro`:
1. Remove lines 18-27 (the `<a href="/resume.pdf" ...>` link and its SVG)
2. Remove the `.resume-link` CSS rule (lines 66-74)
3. Remove the `.resume-link:hover` CSS rule (lines 76-79)
4. Remove the `.resume-link` entry inside the `@media (prefers-reduced-motion: reduce)` block (lines 106-110)

The about page should then show: bio → Calvin and Hobbes GIF → caption (no resume link).

- [ ] **Step 5: Run build to verify**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 6: Visual check**

Run: `npm run dev`
- All pages: resume icon visible in top bar next to GitHub icon
- At 480px: resume icon still visible (X and LinkedIn hidden)
- `/about`: no resume link in page body
- Click resume icon → opens PDF in new tab

- [ ] **Step 7: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/about.astro
git commit -m "feat: move resume link from about page to top bar social nav"
```

---

## Final Verification

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: Clean build, no warnings.

- [ ] **Step 2: Cross-viewport visual audit**

Run: `npm run dev`
Check at 375px, 768px, 1440px:
1. Section pages (Now, Work, Guest Book): content visually centered in viewport
2. `/guest-book`: form + 3 notes centered, no "All Entries" visible, "See all entries" link works
3. `/guest-book/entries`: scrollable, breadcrumb back to guest book, full grid
4. Resume icon visible in top bar on all pages at all breakpoints
5. Homepage unchanged
6. Scrollable pages (About, Guest Book Entries, blog posts) flow from top, not centered
