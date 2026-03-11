# Testing Patterns

**Analysis Date:** 2026-03-10

## Test Framework

**Runner:**
- Not configured
- No test runner (Jest, Vitest, or other) present in codebase

**Assertion Library:**
- Not applicable — no testing framework installed

**Run Commands:**
- Not applicable — no test scripts in `package.json`

## Test File Organization

**Location:**
- Not applicable — no test files in source tree
- Test files from dependencies exist in `node_modules/` but project has no custom tests

**Naming:**
- Not applicable

**Structure:**
- Not applicable

## Test Structure

**Suite Organization:**
- Not applicable — no test suites present

**Patterns:**
- Not applicable

## Mocking

**Framework:**
- Not configured

**Patterns:**
- No mocking library configured

**What to Mock:**
- Not applicable

**What NOT to Mock:**
- Not applicable

## Fixtures and Factories

**Test Data:**
- Placeholder data hardcoded in components for development (e.g., `PLACEHOLDER_ENTRIES` in `GuestBookPage.tsx` lines 31-37)
- Example:
  ```typescript
  const PLACEHOLDER_ENTRIES: Entry[] = [
    { name: 'Alex', message: 'Cool site! Love the folder design.', date: '2026-02-28', noteColor: NOTE_COLORS[2].value, pinColor: PIN_COLORS[1].value },
    { name: 'Jordan', message: 'Found you through Launch Club. Keep building!', date: '2026-02-25', noteColor: NOTE_COLORS[0].value, pinColor: PIN_COLORS[3].value },
    // ... more entries
  ];
  ```
- Static project data in `src/data/projects.ts` exports arrays of project objects for carousel testing

**Location:**
- Placeholder data: `src/components/react/GuestBookPage.tsx` (lines 3-37)
- Static data files: `src/data/projects.ts`, `src/data/status.ts`, `src/data/zones.ts`

## Coverage

**Requirements:**
- Not enforced — no coverage tool configured

**View Coverage:**
- Not applicable

## Test Types

**Unit Tests:**
- Not present

**Integration Tests:**
- Not present

**E2E Tests:**
- Not configured
- No E2E test runner (Playwright, Cypress, etc.)

## Manual Testing Approach

**Development Testing:**
- Astro dev server runs at `localhost:4321` (`npm run dev`)
- Manual browser testing during development
- Hot-reload via Astro 5's native support (`@astrojs/react` integration)

**Build Verification:**
- Production build via `npm run build` outputs to `.vercel/output/`
- Preview via `npm run preview` before deployment
- Vercel deployment with web analytics enabled

## Testing Gaps

**Untested Areas:**
- All React components lack unit tests
  - `GuestBookPage.tsx` (615 lines): Canvas drawing, image compression, form state, color selection
  - `ProjectCarousel.tsx` (332 lines): Carousel navigation, animation state, dot indicators
  - `GuestBook.tsx`: Component logic unverified
- All Astro pages lack integration tests
  - Dynamic routes (`/blog/[...slug].astro`, `/work/[slug].astro`)
  - Content collection rendering
  - Static site generation correctness
- No tests for data modules
  - `projects.ts`, `status.ts`, `zones.ts` not validated
  - Type safety relies on TypeScript alone
- No E2E tests for user flows
  - Guest book form submission (Supabase not configured)
  - Project carousel navigation
  - Blog navigation and filtering
- No visual regression tests
  - Section-aware theming (logo color shifts, background color changes)
  - Responsive design (viewport-locked layout)
  - Animation behavior validation

**Risk Areas:**
- Image compression logic in `GuestBookPage.tsx` (lines 42-77): Promise-based file handling with silent error catching
- Canvas drawing operations: Browser APIs with no fallback testing
- CSS-in-JS styling within components: No visual validation framework
- Astro content collections: Zod schema validation only, no integration tests
- Dynamic route generation: `getStaticPaths()` correctness unverified

**Files with No Test Coverage:**
- `src/components/react/GuestBookPage.tsx` (615 lines)
- `src/components/react/ProjectCarousel.tsx` (332 lines)
- `src/components/react/GuestBook.tsx` (full file)
- `src/layouts/BaseLayout.astro` (180+ lines)
- `src/layouts/BlogPostLayout.astro`
- `src/pages/index.astro`
- `src/pages/work.astro`
- `src/pages/now.astro`
- `src/pages/about.astro`
- `src/pages/guest-book.astro`
- `src/pages/blog/[...slug].astro`
- `src/pages/work/[slug].astro`
- `src/data/projects.ts`
- `src/data/status.ts`
- `src/data/zones.ts`
- `src/content.config.ts`

**Priority for Testing:**
1. **High:** Image compression in `GuestBookPage.tsx` — handles user file uploads, complex Promise logic
2. **High:** Canvas drawing operations — browser-dependent, no graceful degradation tested
3. **High:** Dynamic route generation — broken paths would break deployed site
4. **Medium:** Component state management (carousel navigation, form validation)
5. **Medium:** Content collection integration — ensuring blog posts render correctly
6. **Low:** Static data validation — caught by TypeScript type checking

---

*Testing analysis: 2026-03-10*
