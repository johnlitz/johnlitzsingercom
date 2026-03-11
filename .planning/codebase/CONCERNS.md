# Codebase Concerns

**Analysis Date:** 2026-03-10

## Tech Debt

**Node 24 Polyfill Workaround:**
- Issue: Astro and Rollup have compatibility issues with Node 24's `URL.canParse` and `Headers.getSetCookie` APIs. Work-around requires `polyfill-url.mjs` to be injected via `--require` in npm scripts.
- Files: `package.json` (lines 7-9), `polyfill-url.mjs`
- Impact: Development requires Node 24 workaround; production (Vercel uses Node 20) is unaffected. Adds build complexity.
- Fix approach: Remove once Astro officially supports Node 24. Monitor Astro releases for fix; when available, remove `--require ./polyfill-url.mjs` from dev/build/preview scripts and delete polyfill file.

**Guest Book Incomplete Implementation:**
- Issue: Guest book form is disabled (all inputs have `disabled` attribute) and backend integration is stubbed with "Coming soon" text. Signature canvas, image upload, color choosers, and submit button are all non-functional.
- Files: `src/components/react/GuestBookPage.tsx` (lines 256, 265, 294, 314, 318), `src/pages/guest-book.astro`
- Impact: Visitors cannot actually sign the guest book. Form UI is visible but unusable. Placeholder entries are hardcoded.
- Fix approach: (1) Set up Supabase with `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` env vars. (2) Implement form submission handler in `handleSubmit()` (line 230). (3) Replace hardcoded `PLACEHOLDER_ENTRIES` array with real data fetching. (4) Remove `disabled` attributes. (5) Implement pagination for viewing all entries. See CLAUDE.md line 142 for current status.

## Scaling Limits

**Single Column Layout with Fixed Viewport:**
- Current capacity: Designed for desktop viewport-locked to `100dvh` with no scrolling on homepage/work/about/now pages.
- Limit: Adding more projects or content will overflow. Homepage folder grid assumes 4 items; Adding 5th folder breaks layout centering. Max-width is 720px.
- Scaling path: Consider pagination for projects, lazy-load blog posts, or expand max-width thoughtfully. Guest Book page already enables scrolling via `scrollable` prop on BaseLayout.

**Image Compression Quality:**
- Current capacity: Max image size 200KB after compression in guest book.
- Limit: High-resolution images will be heavily compressed. GuestBookPage.tsx line 40 uses hardcoded `MAX_IMAGE_SIZE_KB = 200`.
- Scaling path: If image quality becomes issue, increase limit or implement quality detection. Monitor actual upload sizes from users.

## Fragile Areas

**Homepage Centering Logic:**
- Files: `src/pages/index.astro` (lines 77-112), `src/layouts/BaseLayout.astro` (lines 391-400)
- Why fragile: Folder grid centering relies on careful CSS math: `--chrome-above` (5.25rem on desktop, 4.5rem on mobile) must match actual top-bar height. If BaseLayout header height changes, folders will misalign. CLAUDE.md explicitly warns against using `margin-top: auto` instead of `justify-content: center`.
- Safe modification: (1) If changing top-bar height, update `--chrome-above` in .home style. (2) Test on both desktop and mobile. (3) Never remove `position: absolute` from `.home` or `.folder-grid`. (4) Keep using viewport percentages (33.33dvh, 50dvh) not pixel offsets.
- Test coverage: No unit tests. Visual regression testing recommended.

**Canvas Rendering in SignatureCanvas:**
- Files: `src/components/react/GuestBookPage.tsx` (lines 120-196)
- Why fragile: Canvas assumes browser DevicePixelRatio is 1:1 with CSS pixels (see `getPos()` calculations at lines 127-128). High-DPI displays (Retina) may render blurry signatures. No DPI scaling applied.
- Safe modification: Add `canvas.width = canvas.offsetWidth * devicePixelRatio` and `canvas.height = canvas.offsetHeight * devicePixelRatio` to fix DPI. Adjust context scale accordingly.
- Test coverage: Not covered. Test on Retina devices.

**CSS Custom Property Fallbacks:**
- Files: Multiple files use `var(--section-color, var(--accent))` and other nested fallbacks (BaseLayout.astro, GuestBookPage.tsx).
- Why fragile: If CSS custom properties fail to load or are undefined, fallbacks cascade. No validation that colors actually exist in global.css.
- Safe modification: Always test section pages and verify color tokens load. Run build and check computed styles in DevTools.
- Test coverage: None.

## Missing Critical Features

**Supabase Configuration:**
- Problem: Guest book backend is completely disconnected. No database, no authentication, no persistence.
- Blocks: Cannot save or display real guest book entries. Form is UI-only.
- Current state: Placeholder entries are hardcoded in JavaScript. Form submit handler (line 230) has only a honeypot spam check, no actual save logic.

**RSS Feed:**
- Problem: `src/pages/rss.xml.ts` exists but content unknown. Check if RSS is actually generated and linked.
- Blocks: Readers cannot subscribe to blog updates.

**Sitemap Configuration:**
- Problem: Sitemap is enabled in `astro.config.mjs` (line 15) but draft posts are filtered. Verify sitemap includes all public pages and is submitted to search engines.

**Blog Post Metadata:**
- Problem: Only one blog post exists (`src/content/blog/hello-world.mdx`). Missing real content for portfolio.
- Blocks: Limited content to showcase portfolio. Job seekers/recruiters see minimal blog activity.

## Security Considerations

**Honeypot SPAM Protection Insufficient:**
- Risk: Guest book form only has honeypot protection (line 242). No rate limiting, no CAPTCHA, no email verification.
- Files: `src/components/react/GuestBookPage.tsx` (lines 206, 232, 241-247)
- Current mitigation: Honeypot field (`website` input) hidden and disabled. Submission rejected if filled.
- Recommendations: (1) Add rate limiting at Supabase level (limit entries per IP per hour). (2) Consider CAPTCHA for production. (3) Add email verification before displaying entry. (4) Implement moderation queue.

**Client-Side Image Compression:**
- Risk: Image compression happens entirely in browser. No server-side validation. Malicious users could send oversized or malicious payloads.
- Files: `src/components/react/GuestBookPage.tsx` (lines 42-77)
- Current mitigation: Max 200KB check in `compressImage()`. File type check (`file.type.startsWith('image/')`).
- Recommendations: (1) Validate image dimensions server-side. (2) Re-compress on backend. (3) Store in signed, expiring storage URLs (Supabase can do this).

**Environment Variables Leaking:**
- Risk: `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` are public (prefixed with `PUBLIC_`). This is intentional for Supabase but exposes service URL.
- Files: CLAUDE.md line 142
- Current mitigation: Anon key is read-only by default in Supabase RLS. URL is public anyway.
- Recommendations: (1) Set up Row-Level Security (RLS) in Supabase to prevent unauthorized reads/writes. (2) Enable signature verification for entries before display.

**X (Twitter) URL Placeholder:**
- Risk: Social link for X points to `https://x.com` (platform root), not actual profile.
- Files: `src/layouts/BaseLayout.astro` (line 73)
- Current mitigation: It's a public root, no security risk, just incomplete.
- Recommendations: Update to actual X profile URL once available.

## Performance Bottlenecks

**Large Guest Book Component:**
- Problem: `GuestBookPage.tsx` is 812 lines in a single component. Renders placeholder entries twice (preview grid + "All Entries" grid).
- Files: `src/components/react/GuestBookPage.tsx`
- Cause: No component split. All logic (form, canvas, color choosers, entry rendering) in one file. Re-renders entire component on any state change.
- Improvement path: (1) Extract `SignatureCanvas`, `ColorChooser`, `StickyNote` to separate components. (2) Memoize entry cards with React.memo. (3) Implement virtual scrolling for "All Entries" section if >100 entries.

**Canvas Drawing Without Requestanimationframe:**
- Problem: Signature canvas uses raw mouse/touch events without throttling or RAF. Rapid event firing on draw could cause jank.
- Files: `src/components/react/GuestBookPage.tsx` (lines 150-159)
- Cause: `draw()` fires on every mousemove/touchmove. No debounce or RAF batching.
- Improvement path: Wrap `ctx.stroke()` in requestAnimationFrame or throttle event handlers to 60fps max.

**Inline Styles in JSX:**
- Problem: Multiple inline style objects created per render (GuestBookPage.tsx lines 109, 335-338, 379-382).
- Files: `src/components/react/GuestBookPage.tsx`
- Cause: Style objects defined inline in JSX render.
- Improvement path: Define style objects outside component or use CSS classes. Reduces object creation overhead.

## Test Coverage Gaps

**No Unit Tests:**
- What's not tested: None of the components have unit tests.
- Files: All files in `src/components/react/`, `src/pages/`, `src/layouts/`
- Risk: (1) Refactoring blindly risks breaking features. (2) Canvas rendering bugs on high-DPI displays undetected. (3) Homepage centering math never validated. (4) Color token fallbacks never tested.
- Priority: High - Add tests for: (a) Homepage folder centering across viewports, (b) Canvas DPI scaling, (c) CSS custom property loading, (d) ProjectCarousel navigation logic, (e) Guest book form state.

**No E2E Tests:**
- What's not tested: User journeys across pages.
- Risk: Navigation breakage, view transitions failing, breadcrumbs incorrect.
- Priority: Medium - Add E2E suite for: (a) Homepage → Section pages → back home, (b) Blog post navigation (prev/next), (c) Guest book form flow (when enabled).

**No Visual Regression Tests:**
- What's not tested: Responsive design across breakpoints.
- Risk: Mobile layout breaks silently. Folder grid misaligns on tablet. Text truncation unnoticed.
- Priority: Medium - Test at 480px, 600px, 768px, 1024px breakpoints.

## Dependencies at Risk

**Astro 5 Beta/Cutting Edge:**
- Risk: Astro 5.17.1 is recent. Node 24 polyfill suggests Astro is still catching up with Node releases.
- Impact: May encounter breaking changes in minor updates. Vercel (Node 20) and local dev (Node 24) drift possible.
- Migration plan: Pin Astro to stable minor versions. Monitor Astro releases. Test locally on Node 20 before deploying.

**React 19 New:**
- Risk: React 19.2.4 is very new. Few production apps use it yet.
- Impact: May have undiscovered edge cases. Libraries may lag React 19 support.
- Migration plan: Monitor React issues, test thoroughly. Can downgrade to React 18 if critical bugs found.

## Browser & Platform Compatibility

**Viewport Lock Issues:**
- Problem: Design uses `100dvh` (dynamic viewport height) and `overflow: hidden` to prevent scrolling.
- Risk: (1) Safari on iOS has quirks with `dvh` units (changes during scroll reveal/hide of address bar). (2) Older browsers don't support `dvh`. (3) Mobile browsers with keyboard input may break viewport-lock assumption.
- Files: `src/layouts/BaseLayout.astro` (lines 154-159), `src/styles/global.css` (line 124)
- Recommendations: (1) Test on iOS Safari with keyboard input. (2) Provide fallback for `100vh` if `dvh` not supported. (3) Consider `allow-scroll` flag when forms active (already done for guest-book).

**Canvas Touch Events:**
- Problem: Signature canvas has touch support but no `touch-action: none` on all ancestors.
- Risk: Browser may interpret touch as scroll/pinch zoom, canceling signature drawing.
- Files: `src/components/react/GuestBookPage.tsx` (line 590 has `touch-action: none` but only on canvas)
- Recommendations: Ensure parent container also has `touch-action: none` or test touch behavior on actual devices.

## Known Quirks & Gotchas

**Folder Grid Centering Math (Documented in CLAUDE.md):**
- Don't use `margin-top: auto` on `.folder-grid`. It centers folders below tagline, not the group as a whole.
- Use `justify-content: center` on `.home` instead. Currently correct in code.

**Section Color Hue-Rotate Filter Complexity:**
- Logo icon color changes per section via CSS hue-rotate filter (BaseLayout.astro lines 36-44). Filter includes hue-rotate + saturate + brightness.
- Values are calibrated for visual balance but are fragile. If section colors change in global.css, filters may need recalibration.
- Files: `src/layouts/BaseLayout.astro` (lines 36-45)

**Image Compression Quality Loss:**
- JPEG compression at 0.2-0.8 quality may produce artifacts for line drawings or signatures (lots of sharp edges). Test with actual signatures to verify quality.

---

*Concerns audit: 2026-03-10*
