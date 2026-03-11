# Coding Conventions

**Analysis Date:** 2026-03-10

## Naming Patterns

**Files:**
- Astro components: PascalCase (e.g., `BaseLayout.astro`, `BaseHead.astro`)
- React components: PascalCase (e.g., `GuestBookPage.tsx`, `ProjectCarousel.tsx`)
- TypeScript data files: camelCase (e.g., `projects.ts`, `status.ts`, `zones.ts`)
- CSS: Global file named `global.css` in `src/styles/`

**Functions:**
- camelCase for all functions (e.g., `compressImage`, `getPageZone`, `startDraw`)
- React hook names follow React convention: `useX` (e.g., `useState`, `useRef`, `useCallback`)
- Utility functions prefixed when appropriate (e.g., `getPageZone`, `getPos`, `startDraw`)

**Variables:**
- camelCase for all variables (e.g., `MAX_IMAGE_WIDTH`, `NOTE_COLORS`)
- Constants in UPPER_SNAKE_CASE (e.g., `MAX_IMAGE_WIDTH`, `MAX_IMAGE_SIZE_KB`, `PLACEHOLDER_ENTRIES`)
- React state variables: `[value, setValue]` pattern with descriptive names (e.g., `[current, setCurrent]`, `[isAnimating, setIsAnimating]`)

**Types:**
- PascalCase for interfaces and type aliases (e.g., `Props`, `Entry`, `Project`)
- Interfaces used for component props: `interface Props { ... }`
- Astro component props typed via `interface Props` in frontmatter

## Code Style

**Formatting:**
- No explicit linter configured (no eslint, prettier, or biome config files)
- Consistent spacing: 2-space indentation throughout (Astro, React, CSS)
- Line breaks before/after JSX elements follow standard React patterns

**Linting:**
- No linter configured in codebase
- Type safety via TypeScript strict mode (`tsconfig.json` extends `astro/tsconfigs/strict`)

## Import Organization

**Order:**
1. React/Astro framework imports (e.g., `import { useState } from 'react'`)
2. Internal Astro imports (e.g., `import { getCollection } from 'astro:content'`)
3. Local component imports (e.g., `import BaseLayout from '../layouts/BaseLayout.astro'`)
4. Data/utility imports (e.g., `import { projects } from '../data/projects'`)
5. Style imports (e.g., `import '../styles/global.css'`)

**Path Aliases:**
- No path aliases configured — relative imports used throughout
- Parent directory traversal with `../` patterns (e.g., `import BaseLayout from '../layouts/BaseLayout.astro'`)

## Error Handling

**Patterns:**
- Try-catch with silent failure on non-critical operations (e.g., `GuestBookPage.tsx` lines 217-222: image compression errors are caught and silently ignored with `catch { // silently fail }`)
- No global error handler for promise rejections
- UI errors handled by disabling form fields (e.g., guest book form fields marked `disabled` until Supabase is configured)
- Event handler errors: No explicit error handling; relies on browser defaults
- File read errors: Promise rejections assigned to event handlers (e.g., `img.onerror = reject` in `GuestBookPage.tsx`)

## Logging

**Framework:** Console (browser native `console` object)

**Patterns:**
- No logging statements in source code
- No logging framework imported or used
- Error information currently appears only in try-catch blocks with silent failures

## Comments

**When to Comment:**
- High-level purpose comments for complex functions (e.g., `GuestBookPage.tsx` Thumbtack component has brief JSDoc)
- Section comments in CSS using `/* ... */` format (e.g., `/* Reset */`, `/* Design tokens */`)
- Inline comments for non-obvious logic (e.g., `// silently fail` in `GuestBookPage.tsx` line 221)
- No TODO or FIXME comments in source code (except one `// Supabase integration -- coming soon` placeholder)

**JSDoc/TSDoc:**
- Minimal JSDoc usage
- Brief function documentation where present (e.g., `zones.ts` has block comment explaining zone mapping)
- No parameter-level JSDoc annotations

## Function Design

**Size:** Generally small, focused functions (50-100 lines typical)
- `compressImage`: ~35 lines, encapsulates image resizing and compression logic
- `startDraw`, `draw`, `endDraw`: Each 10-15 lines for canvas drawing operations
- Larger functions like `GuestBookPage` (default export) ~615 lines: React component with embedded styling

**Parameters:**
- Destructured props in function signatures (e.g., `function Thumbtack({ color }: { color: string })`)
- Callback functions passed as props with inline type annotations
- Rest parameters used when needed (e.g., `...[styles]` in scoped CSS)

**Return Values:**
- JSX/TSX components return JSX.Element or React.ReactElement
- Utility functions return specific types (e.g., `getPageZone` returns `string`)
- Promises used for async operations (e.g., `compressImage` returns `Promise<string>`)
- Functions may return null/undefined implicitly (e.g., event handlers in `useCallback`)

## Module Design

**Exports:**
- Named exports for data/utilities (e.g., `export const projects: Project[]`, `export function getPageZone`)
- Default exports for components (e.g., `export default function GuestBookPage()`)
- Interface exports for types (e.g., `export interface Project`)
- Type imports using `import type` where applicable

**Barrel Files:**
- Not used in this codebase
- Each file is imported individually by its path
- No index.ts aggregation files

## Astro-Specific Conventions

**Component Structure:**
- Frontmatter (---) contains imports and logic
- HTML template follows frontmatter
- Scoped `<style>` blocks at end of `.astro` files
- Props passed via `interface Props` and destructured from `Astro.props`
- `class:list={}` directive used for conditional classes (e.g., `class:list={['viewport-lock', { 'allow-scroll': scrollable }]}`)

**Data Passing:**
- Astro content collections via `defineCollection()` in `src/content.config.ts` with Zod schema
- Static data via TypeScript files imported as modules (e.g., `projects.ts`, `status.ts`)
- Props to React components: typed interface on Astro page, passed directly (e.g., `<ProjectCarousel client:load projects={projects} />`)

## React-Specific Conventions

**Component State:**
- Functional components with hooks
- `useState` for state management
- `useRef` for DOM references (e.g., canvas refs, form refs)
- `useCallback` for memoized event handlers

**Event Handling:**
- Inline event handlers with arrow functions
- Type annotations for events (e.g., `React.ChangeEvent<HTMLInputElement>`)
- preventDefault() called where needed (e.g., form submission, drag operations)

**Styling:**
- Scoped `<style>` tags within component JSX (template literal)
- CSS custom properties (variables) for theming (e.g., `--note-bg`, `--swatch-color`)
- CSS Grid and Flexbox for layout
- Transitions and animations via `@keyframes` and `transition` properties
- `prefers-reduced-motion` media query respected for animation toggles

---

*Convention analysis: 2026-03-10*
