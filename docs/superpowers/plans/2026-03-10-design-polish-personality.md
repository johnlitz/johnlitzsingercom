# Design Polish & Personality Injection — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the site's color system to OKLCH, fix homepage folder centering, add a live status dot, redesign the guest book as sticky notes with thumbtacks, and apply global polish tips.

**Architecture:** Five independent tasks executed sequentially. Task 1 (OKLCH tokens) is the foundation — all subsequent tasks depend on it. Tasks 2-5 are independent of each other but each builds on the new color tokens.

**Tech Stack:** Astro 5, React, CSS custom properties, OKLCH color functions

**Spec:** `docs/superpowers/specs/2026-03-10-design-polish-personality-design.md`

---

## Chunk 1: Color System + Global Polish

### Task 1: OKLCH Color Tokens

**Files:**
- Modify: `src/styles/global.css:50-60` (replace section color tokens)

- [ ] **Step 1: Replace section color tokens with OKLCH 5-step scales**

In `src/styles/global.css`, replace lines 50-60 (the `--folder-*` and `--section-bg-*` blocks) with:

```css
  /* Section color scales — OKLCH harmonized (equal L=0.70, C=0.17) */
  /* Now (blue, hue 264) */
  --now-50:  oklch(0.97 0.01 264);
  --now-100: oklch(0.93 0.04 264);
  --now-200: oklch(0.87 0.08 264);
  --now-500: oklch(0.70 0.17 264);
  --now-900: oklch(0.35 0.10 264);

  /* Work (green, hue 152) */
  --work-50:  oklch(0.97 0.01 152);
  --work-100: oklch(0.93 0.04 152);
  --work-200: oklch(0.87 0.08 152);
  --work-500: oklch(0.70 0.17 152);
  --work-900: oklch(0.35 0.10 152);

  /* Guest Book (amber, hue 80) */
  --guestbook-50:  oklch(0.97 0.01 80);
  --guestbook-100: oklch(0.93 0.04 80);
  --guestbook-200: oklch(0.87 0.08 80);
  --guestbook-500: oklch(0.70 0.17 80);
  --guestbook-900: oklch(0.35 0.10 80);

  /* About (purple, hue 295) */
  --about-50:  oklch(0.97 0.01 295);
  --about-100: oklch(0.93 0.04 295);
  --about-200: oklch(0.87 0.08 295);
  --about-500: oklch(0.70 0.17 295);
  --about-900: oklch(0.35 0.10 295);

  /* Status dot green */
  --status-green: oklch(0.72 0.19 145);

  /* Backward-compat aliases (remove after full migration) */
  --folder-now: var(--now-500);
  --folder-work: var(--work-500);
  --folder-guestbook: var(--guestbook-500);
  --folder-about: var(--about-500);
  --section-bg-now: var(--now-50);
  --section-bg-work: var(--work-50);
  --section-bg-guestbook: var(--guestbook-50);
  --section-bg-about: var(--about-50);
```

- [ ] **Step 2: Add global polish rules**

In `src/styles/global.css`, add after the existing heading styles (after line 159):

```css
/* Tabular numbers for dates/metrics */
time, [data-tabular] {
  font-variant-numeric: tabular-nums;
}
```

The `text-wrap: balance` is already on `h1, h2, h3, h4` — confirmed present at lines 144-154.

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: Clean build, no errors. All pages render with new OKLCH colors via the backward-compat aliases.

- [ ] **Step 4: Visual check**

Run: `npm run dev`
Open `http://localhost:4321` and navigate to each section. Verify:
- All four folder colors are visible on homepage
- Each section page has its correct background tint
- Section-aware chrome (logo filter, social hover, breadcrumb color) still works
- Colors feel equally "loud" — no section overpowers another

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: OKLCH harmonized 5-step color scales for all sections"
```

---

### Task 2: Migrate Color References (remove old tokens)

**Files:**
- Modify: `src/layouts/BaseLayout.astro:22-26` (sectionColorMap)
- Modify: `src/pages/now.astro:84,113,146,153` (--folder-now refs)
- Modify: `src/pages/work.astro:31` (--folder-work ref)
- Modify: `src/pages/work/[slug].astro:81,115,166` (--folder-work refs)
- Modify: `src/pages/about.astro:49` (--folder-about ref)
- Modify: `src/pages/guest-book.astro:29` (--folder-guestbook ref)
- Modify: `src/pages/index.astro:13,28,43,58` (--folder-* refs in inline styles)

- [ ] **Step 1: Update BaseLayout sectionColorMap**

In `src/layouts/BaseLayout.astro`, replace lines 22-27:

```ts
const sectionColorMap: Record<string, { color: string; bg: string }> = {
  'Now': { color: 'var(--now-500)', bg: 'var(--now-50)' },
  'Work': { color: 'var(--work-500)', bg: 'var(--work-50)' },
  'Guest Book': { color: 'var(--guestbook-500)', bg: 'var(--guestbook-50)' },
  'About': { color: 'var(--about-500)', bg: 'var(--about-50)' },
};
```

- [ ] **Step 2: Update homepage folder inline styles**

In `src/pages/index.astro`, update the four folder `<a>` tags:

- Line 13: `--folder-color: var(--folder-now)` → `--folder-color: var(--now-500)`
- Line 28: `--folder-color: var(--folder-work)` → `--folder-color: var(--work-500)`
- Line 43: `--folder-color: var(--folder-guestbook)` → `--folder-color: var(--guestbook-500)`
- Line 58: `--folder-color: var(--folder-about)` → `--folder-color: var(--about-500)`

- [ ] **Step 3: Update Now page color references**

In `src/pages/now.astro`:

- Line 84: `color: var(--folder-now)` → `color: var(--now-500)`
- Line 113: `border-left: 3px solid var(--folder-now)` → `border-left: 3px solid var(--now-500)`
- Line 146: `color: var(--folder-now)` → `color: var(--now-500)`
- Line 153: `background: var(--folder-now)` → `background: var(--now-500)`

- [ ] **Step 4: Update Work page color references**

In `src/pages/work.astro`:

- Line 31: `color: var(--folder-work)` → `color: var(--work-500)`

In `src/pages/work/[slug].astro`:

- Line 81: Replace both `var(--folder-work)` → `var(--work-500)`
- Line 115: `background: var(--folder-work)` → `background: var(--work-500)`
- Line 166: `color: var(--folder-work)` → `color: var(--work-500)`

- [ ] **Step 5: Update About and Guest Book page color references**

In `src/pages/about.astro`:

- Line 49: `color: var(--folder-about)` → `color: var(--about-500)`

In `src/pages/guest-book.astro`:

- Line 29: `color: var(--folder-guestbook)` → `color: var(--guestbook-500)`

- [ ] **Step 6: Remove backward-compat aliases from global.css**

In `src/styles/global.css`, delete the six `--folder-*` and `--section-bg-*` alias lines added in Task 1.

- [ ] **Step 7: Build and verify**

Run: `npm run build`
Expected: Clean build, zero references to old token names.

Run: `grep -r "folder-now\|folder-work\|folder-guestbook\|folder-about\|section-bg-" src/`
Expected: No output (all old tokens removed).

- [ ] **Step 8: Commit**

```bash
git add src/
git commit -m "refactor: migrate all color references to OKLCH token names"
```

---

### Task 3: Global Polish — Shadows, Image Outline

**Files:**
- Modify: `src/pages/now.astro:102-109` (entry card styles)
- Modify: `src/pages/about.astro:68-73` (about-gif styles)
- Modify: `src/components/react/GuestBookPage.tsx:334,345,432,499` (hardcoded amber hex)

- [ ] **Step 1: Update Now page entry cards — shadows instead of borders**

In `src/pages/now.astro`, the `.entry-card` already uses `box-shadow` (line 106) — good. But the `.entry-update` uses a `border-left` (line 113) which is intentional design (accent border), so keep it.

No changes needed for Now page shadow — already correct.

- [ ] **Step 2: Add image outline to About page**

In `src/pages/about.astro`, update `.about-gif` styles to add a subtle outline:

```css
  .about-gif {
    max-width: 280px;
    width: 100%;
    height: auto;
    border-radius: 12px;
    outline: 1px solid oklch(0.50 0.00 0 / 0.08);
    outline-offset: -1px;
  }
```

- [ ] **Step 3: Update GuestBookPage hardcoded amber hex values**

In `src/components/react/GuestBookPage.tsx`, replace hardcoded `#F59E0B` references with the CSS custom property. These are inside a `<style>` tag in JSX:

- Line 345: `.gb-input:focus { border-color: #F59E0B; }` → `border-color: var(--guestbook-500);`
- Line 432: `.gb-submit { background: #F59E0B; }` → `background: var(--guestbook-500);`
- Line 499: All `rgba(245, 158, 11, ...)` shadows → `oklch(0.70 0.17 80 / 0.06)` etc.
- Line 582: `.gb-page-arrow:hover { color: #F59E0B; border-color: #F59E0B; }` → use `var(--guestbook-500)`

Specific replacements in the `<style>` tag:

```
#F59E0B → var(--guestbook-500)
rgba(245, 158, 11, 0.15) → oklch(0.70 0.17 80 / 0.15)
rgba(245, 158, 11, 0.06) → oklch(0.70 0.17 80 / 0.06)
rgba(245, 158, 11, 0.04) → oklch(0.70 0.17 80 / 0.04)
rgba(245, 158, 11, 0.08) → oklch(0.70 0.17 80 / 0.08)
rgba(245, 158, 11, 0.1) → oklch(0.70 0.17 80 / 0.10)
#b47800 → var(--guestbook-900)
```

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: Clean build.

- [ ] **Step 5: Commit**

```bash
git add src/pages/about.astro src/components/react/GuestBookPage.tsx
git commit -m "polish: image outlines, OKLCH colors in guest book component"
```

---

## Chunk 2: Homepage Centering + Status Dot

### Task 4: Homepage Folder Centering Fix

**Files:**
- Modify: `src/pages/index.astro:76-101` (homepage styles)

- [ ] **Step 1: Restructure .home CSS for folder-centric centering**

The goal: folders at the viewport's vertical midpoint, tagline above, status dot below.

The cleanest CSS approach: keep `justify-content: center` on `.home` so the *middle child* (folder-grid) lands at center. The tagline above and status below have equal `margin-*: auto` to balance.

Replace the `.home` and `.tagline` styles in `src/pages/index.astro`:

```css
  .home {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  .tagline {
    font-size: var(--text-2xl);
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.2;
    color: var(--foreground);
    max-width: 20ch;
    text-align: center;
    margin-top: auto;
    margin-bottom: clamp(1.5rem, 3vh, 2.5rem);
  }

  .folder-grid {
    display: flex;
    justify-content: center;
    gap: var(--space-xl);
    flex-wrap: wrap;
  }

  .status-line {
    margin-top: clamp(1.5rem, 3vh, 2.5rem);
    margin-bottom: auto;
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--text-sm);
    color: var(--muted);
  }
```

The key trick: `.tagline { margin-top: auto }` pushes the tagline down toward center. `.status-line { margin-bottom: auto }` pushes the status up toward center. The folder-grid sits between them at the midpoint.

- [ ] **Step 2: Build and verify centering**

Run: `npm run dev`
Open `http://localhost:4321`. The folder grid should sit at the vertical midpoint of the viewport, with the tagline above and whitespace balanced above/below.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "fix: folders at viewport midpoint with balanced spacing"
```

---

### Task 5: Live Status Dot — Data + Homepage + Footer

**Files:**
- Create: `src/data/status.ts`
- Modify: `src/pages/index.astro` (add status dot below folders)
- Modify: `src/layouts/BaseLayout.astro` (add status dot in footer)
- Modify: `src/styles/global.css` (add pulse animation)

- [ ] **Step 1: Create status data file**

Create `src/data/status.ts`:

```ts
export const currentStatus = {
  text: 'building this website',
  url: '/work/personal-website',
};
```

- [ ] **Step 2: Add pulse animation to global.css**

At the end of `src/styles/global.css`, before the `.skip-nav` section, add:

```css
/* Status dot pulse */
@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@media (prefers-reduced-motion: reduce) {
  @keyframes status-pulse {
    0%, 100% { opacity: 1; }
  }
}
```

- [ ] **Step 3: Add status dot to homepage**

In `src/pages/index.astro`, add the import and HTML:

In the frontmatter (between `---` lines), add:
```ts
import { currentStatus } from '../data/status';
```

In the HTML, add after the closing `</nav>` (line 72) and before the closing `</div>` (line 73):

```html
    <div class="status-line">
      <span class="status-dot" aria-hidden="true"></span>
      <span class="status-text">
        Currently{' '}
        {currentStatus.url ? (
          <a href={currentStatus.url}>{currentStatus.text}</a>
        ) : (
          currentStatus.text
        )}
      </span>
    </div>
```

Add styles (inside the existing `<style>` block):

```css
  .status-line {
    margin-top: clamp(1.5rem, 3vh, 2.5rem);
    margin-bottom: auto;
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--text-sm);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--status-green);
    animation: status-pulse 2s ease-in-out infinite;
    flex-shrink: 0;
  }

  .status-text {
    font-family: var(--font-mono);
    color: var(--muted);
  }

  .status-text a {
    color: var(--muted);
    text-decoration: underline;
    text-decoration-color: var(--border);
    text-underline-offset: 3px;
    transition: color var(--duration-fast) ease;
  }

  .status-text a:hover {
    color: var(--foreground);
  }
```

- [ ] **Step 4: Add status dot to footer**

In `src/layouts/BaseLayout.astro`, add the import in the frontmatter:

```ts
import { currentStatus } from '../data/status';
```

Replace the footer HTML (lines 113-116):

```html
    <footer class="site-footer">
      <span>&copy; 2026 John Litzsinger</span>
      <span class="footer-status">
        <span class="footer-dot" aria-hidden="true"></span>
        {currentStatus.url ? (
          <a href={currentStatus.url}>{currentStatus.text}</a>
        ) : (
          currentStatus.text
        )}
      </span>
      <span>Built with Astro</span>
    </footer>
```

Add footer-status styles inside the existing `<style>` block:

```css
  .footer-status {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-family: var(--font-mono);
  }

  .footer-status a {
    color: var(--muted);
    text-decoration: none;
    transition: color var(--duration-fast) ease;
  }

  .footer-status a:hover {
    color: var(--foreground);
    text-decoration: none;
  }

  .footer-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--status-green);
    animation: status-pulse 2s ease-in-out infinite;
    flex-shrink: 0;
  }
```

Also add `.footer-dot` to the existing `prefers-reduced-motion` block:

```css
  @media (prefers-reduced-motion: reduce) {
    /* ...existing rules... */
    .footer-dot {
      animation: none;
    }
  }
```

- [ ] **Step 5: Build and verify**

Run: `npm run build`
Expected: Clean build.

Run: `npm run dev`
Verify:
- Homepage shows green pulsing dot + "Currently building this website" below folders
- Footer on every page shows smaller green dot + "building this website"
- Clicking the link navigates to /work/personal-website
- `prefers-reduced-motion` disables the pulse

- [ ] **Step 6: Commit**

```bash
git add src/data/status.ts src/pages/index.astro src/layouts/BaseLayout.astro src/styles/global.css
git commit -m "feat: live status dot on homepage and footer"
```

---

## Chunk 3: Guest Book Sticky Notes

### Task 6: Guest Book Sticky Note Redesign

**Files:**
- Modify: `src/components/react/GuestBookPage.tsx` (complete visual overhaul of entries section + color chooser)

This is the largest task. The form section stays mostly the same (inputs, signature canvas, image upload). The entries display and the form's bottom section (add color choosers) change significantly.

- [ ] **Step 1: Add color constants and types**

At the top of `src/components/react/GuestBookPage.tsx`, after the imports, add:

```tsx
const NOTE_COLORS = [
  { name: 'Lemon', value: 'oklch(0.93 0.04 95)' },
  { name: 'Blush', value: 'oklch(0.93 0.04 15)' },
  { name: 'Sky', value: 'oklch(0.93 0.04 240)' },
  { name: 'Mint', value: 'oklch(0.93 0.04 160)' },
  { name: 'Lavender', value: 'oklch(0.93 0.04 300)' },
  { name: 'Peach', value: 'oklch(0.93 0.04 55)' },
] as const;

const PIN_COLORS = [
  { name: 'Red', value: 'oklch(0.65 0.20 25)' },
  { name: 'Blue', value: 'oklch(0.65 0.17 264)' },
  { name: 'Green', value: 'oklch(0.65 0.17 152)' },
  { name: 'Gold', value: 'oklch(0.65 0.17 80)' },
  { name: 'Purple', value: 'oklch(0.65 0.17 295)' },
  { name: 'Black', value: 'oklch(0.30 0.00 0)' },
] as const;
```

Update the `Entry` interface:

```tsx
interface Entry {
  name: string;
  message: string;
  date: string;
  signature?: string;
  image?: string;
  noteColor?: string;
  pinColor?: string;
}
```

Update `PLACEHOLDER_ENTRIES` to include colors:

```tsx
const PLACEHOLDER_ENTRIES: Entry[] = [
  { name: 'Alex', message: 'Cool site! Love the folder design.', date: '2026-02-28', noteColor: NOTE_COLORS[2].value, pinColor: PIN_COLORS[1].value },
  { name: 'Jordan', message: 'Found you through Launch Club. Keep building!', date: '2026-02-25', noteColor: NOTE_COLORS[0].value, pinColor: PIN_COLORS[3].value },
  { name: 'Sam', message: 'Clean design. Astro is the way.', date: '2026-02-20', noteColor: NOTE_COLORS[3].value, pinColor: PIN_COLORS[2].value },
  { name: 'Taylor', message: 'The pharmacy analyzer sounds interesting.', date: '2026-02-15', noteColor: NOTE_COLORS[4].value, pinColor: PIN_COLORS[4].value },
  { name: 'Riley', message: 'Go Boilers!', date: '2026-02-10', noteColor: NOTE_COLORS[1].value, pinColor: PIN_COLORS[0].value },
];
```

- [ ] **Step 2: Add Thumbtack SVG component**

Add inside the file, before `GuestBookPage`:

```tsx
function Thumbtack({ color }: { color: string }) {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" className="note-pin" aria-hidden="true">
      <circle cx="8" cy="6" r="5" fill={color} />
      <rect x="7" y="10" width="2" height="9" rx="1" fill="oklch(0.45 0.02 80)" />
      <circle cx="8" cy="6" r="2.5" fill="oklch(0.85 0.02 80)" opacity="0.5" />
    </svg>
  );
}
```

- [ ] **Step 3: Add ColorChooser component**

Add inside the file:

```tsx
function ColorChooser({
  label,
  colors,
  selected,
  onSelect,
}: {
  label: string;
  colors: readonly { name: string; value: string }[];
  selected: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="color-chooser">
      <span className="color-chooser-label">{label}</span>
      <div className="color-chooser-row">
        {colors.map((c, i) => (
          <button
            key={c.name}
            type="button"
            className={`color-swatch ${i === selected ? 'color-swatch-selected' : ''}`}
            style={{ '--swatch-color': c.value } as React.CSSProperties}
            onClick={() => onSelect(i)}
            aria-label={c.name}
            title={c.name}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Add state for color selection in GuestBookPage**

In the `GuestBookPage` component, add state:

```tsx
const [noteColorIdx, setNoteColorIdx] = useState(() => Math.floor(Math.random() * NOTE_COLORS.length));
const [pinColorIdx, setPinColorIdx] = useState(() => Math.floor(Math.random() * PIN_COLORS.length));
```

- [ ] **Step 5: Add color choosers to the form**

In the JSX, insert the color choosers between the signature canvas and the `.gb-form-bottom` div:

```tsx
          <div className="color-choosers">
            <ColorChooser
              label="Note"
              colors={NOTE_COLORS}
              selected={noteColorIdx}
              onSelect={setNoteColorIdx}
            />
            <ColorChooser
              label="Pin"
              colors={PIN_COLORS}
              selected={pinColorIdx}
              onSelect={setPinColorIdx}
            />
          </div>
```

- [ ] **Step 6: Replace entry rendering with sticky notes**

Replace the entire `.gb-entries-section` div with:

```tsx
      <div className="gb-entries-section">
        <div className="gb-notes-board">
          {pageEntries.map((entry, i) => {
            // Deterministic rotation from entry name hash
            const hash = entry.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
            const rotation = ((hash % 7) - 3); // -3 to +3 degrees
            const noteColor = entry.noteColor || NOTE_COLORS[hash % NOTE_COLORS.length].value;
            const pinColor = entry.pinColor || PIN_COLORS[hash % PIN_COLORS.length].value;

            return (
              <div
                key={`${page}-${i}`}
                className="sticky-note"
                style={{
                  '--note-bg': noteColor,
                  '--note-rotation': `${rotation}deg`,
                } as React.CSSProperties}
              >
                <Thumbtack color={pinColor} />
                <p className="note-message">{entry.message}</p>
                <span className="note-author">— {entry.name}</span>
                {entry.image && (
                  <img src={entry.image} alt={`Photo by ${entry.name}`} className="note-image" />
                )}
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          /* keep existing pagination JSX unchanged */
        )}
      </div>
```

- [ ] **Step 7: Replace entry styles with sticky note styles**

Replace the entire `<style>` tag content. Key new styles:

```css
/* Notes board */
.gb-notes-board {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 220px));
  gap: 1.5rem;
  justify-content: center;
  width: 100%;
  max-width: 620px;
  padding: 0.5rem;
}

.sticky-note {
  position: relative;
  background: var(--note-bg, oklch(0.93 0.04 95));
  border-radius: 2px;
  padding: 1.75rem 1rem 1rem;
  transform: rotate(var(--note-rotation, 0deg));
  box-shadow:
    0 1px 3px oklch(0.50 0.00 0 / 0.06),
    0 4px 12px oklch(0.50 0.00 0 / 0.04);
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 200ms ease;
}

.sticky-note:hover {
  transform: rotate(var(--note-rotation, 0deg)) translateY(-4px) scale(1.02);
  box-shadow:
    0 4px 8px oklch(0.50 0.00 0 / 0.08),
    0 12px 32px oklch(0.50 0.00 0 / 0.06);
}

.note-pin {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  filter: drop-shadow(0 1px 2px oklch(0.30 0.00 0 / 0.25));
}

.note-message {
  font-size: 0.8125rem;
  color: oklch(0.25 0.00 0);
  line-height: 1.55;
  margin-bottom: 0.5rem;
}

.note-author {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: oklch(0.40 0.00 0);
}

.note-image {
  margin-top: 0.5rem;
  max-width: 100%;
  max-height: 100px;
  border-radius: 4px;
  object-fit: cover;
}

/* Color chooser */
.color-choosers {
  display: flex;
  gap: 1.5rem;
}

.color-chooser {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-chooser-label {
  font-size: 0.75rem;
  color: #666666;
}

.color-chooser-row {
  display: flex;
  gap: 0.375rem;
}

.color-swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: var(--swatch-color);
  cursor: pointer;
  transition: transform 150ms ease, border-color 150ms ease;
  padding: 0;
}

.color-swatch:hover {
  transform: scale(1.15);
}

.color-swatch-selected {
  border-color: oklch(0.40 0.00 0);
  transform: scale(1.1);
}

@media (max-width: 480px) {
  .gb-notes-board {
    grid-template-columns: 1fr;
    max-width: 260px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sticky-note,
  .color-swatch {
    transition: none;
  }
  .sticky-note:hover {
    transform: rotate(var(--note-rotation, 0deg));
  }
}
```

Keep all existing form styles (`.gb-form-section`, `.gb-form`, `.gb-input`, `.gb-textarea`, `.sig-*`, `.gb-image-*`, `.gb-submit`, `.gb-note`, `.gb-pagination`, `.gb-page-*`).

- [ ] **Step 8: Build and verify**

Run: `npm run build`
Expected: Clean build.

Run: `npm run dev`
Navigate to `/guest-book`. Verify:
- Entries display as rotated sticky notes with thumbtacks
- Each note has a different pastel background
- Thumbtacks have colored pin heads with 3D highlight
- Color chooser shows 6 swatches for note and pin color
- Selected swatch has a visible border and slight scale
- Notes hover with subtle lift animation
- Mobile: notes go single column
- `prefers-reduced-motion` disables hover transforms

- [ ] **Step 9: Commit**

```bash
git add src/components/react/GuestBookPage.tsx
git commit -m "feat: guest book sticky notes with thumbtacks and color chooser"
```

---

## Chunk 4: Final Verification + Logo Filter Tune

### Task 7: Tune Logo Hue-Rotate Filters for OKLCH Colors

**Files:**
- Modify: `src/layouts/BaseLayout.astro:36-41` (sectionFilterMap)

The hue-rotate filter values were tuned for the old hex colors. The new OKLCH values have slightly different rendered hues, so the filters may need adjustment.

- [ ] **Step 1: Visually compare each section's logo tint**

Run: `npm run dev`
Navigate to each section page. Compare the logo icon's tinted color against the section's heading color. If they don't match closely, adjust the `sectionFilterMap` values in `src/layouts/BaseLayout.astro`.

The filter values may need tweaking. If the OKLCH colors render close enough to the old hex values (they should be in the same hue family), the existing filters may work fine.

- [ ] **Step 2: Adjust filters if needed**

Only modify if visual inspection shows a mismatch. The hue-rotate values are empirical — adjust by +-5deg until the logo icon matches the section color.

- [ ] **Step 3: Full site build + verification**

Run: `npm run build`
Expected: Clean build, all pages generated.

Verify checklist:
- [ ] Homepage: folders centered at viewport midpoint, tagline above, status dot below
- [ ] Homepage: all 4 folder colors visible and equally vibrant
- [ ] Homepage: green pulsing status dot with "Currently building this website"
- [ ] Now page: blue section background, heading color, entry cards
- [ ] Work page: green section background, heading color, carousel
- [ ] Guest Book: amber section background, sticky notes with thumbtacks, color chooser
- [ ] About page: purple section background, image outline, heading color
- [ ] Footer: green dot + status text on all pages
- [ ] Logo icon tints match section colors
- [ ] Brand underline matches section color on hover
- [ ] Social link hovers match section color
- [ ] `prefers-reduced-motion` disables all animations
- [ ] Mobile: responsive at 480px and 768px breakpoints

- [ ] **Step 4: Commit if filters changed**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "fix: tune logo hue-rotate filters for OKLCH colors"
```

---

## Summary of Commits

1. `feat: OKLCH harmonized 5-step color scales for all sections`
2. `refactor: migrate all color references to OKLCH token names`
3. `polish: image outlines, OKLCH colors in guest book component`
4. `fix: folders at viewport midpoint with balanced spacing`
5. `feat: live status dot on homepage and footer`
6. `feat: guest book sticky notes with thumbtacks and color chooser`
7. `fix: tune logo hue-rotate filters for OKLCH colors` (if needed)
