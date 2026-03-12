# ROADMAP: johnlitzsinger.com Site Refresh

**Defined:** 2026-03-11
**Phases:** 4
**Granularity:** Coarse
**Coverage:** 26/26 v1 requirements mapped ✓

---

## Phases

- [x] **Phase 1: Design Polish** — All visual and layout refinements (pages, chrome, mobile responsive) ✓
- [ ] **Phase 2: Performance Optimization & Code Quality** — Carousel lag, font loading, hydration, code cleanup
- [ ] **Phase 3: Guest Book Backend** — Supabase integration for storing, moderating, and displaying entries
- [ ] **Phase 4: Ship** — Commit changes, merge to master, deploy to production

---

## Phase Details

### Phase 1: Design Polish

**Goal:** All pages are visually polished, chrome is consistent, and site is responsive on mobile. The design system feels intentional, well-spaced, and ready for public.

**Depends on:** Nothing (first phase)

**Requirements:**
- DESIGN-01, DESIGN-02, DESIGN-03, DESIGN-04, DESIGN-05, DESIGN-06 (Inner page polish)
- CHROME-01, CHROME-02, CHROME-03, CHROME-04, CHROME-05, CHROME-06 (Top bar, breadcrumb, footer, transitions, section colors)
- MOBILE-01, MOBILE-02, MOBILE-03, MOBILE-04, MOBILE-05 (Responsive, navbar, carousel, forms)

**Success Criteria** (what must be TRUE):
1. User views Now page and sees polished layout with clear visual hierarchy, proper spacing, and typography that feels intentional
2. User views Work page and sees carousel with properly positioned title/description above visual cards
3. User views About page and sees bio and GIF properly composed without awkward spacing or misalignment
4. User views Guest Book page and sees sticky note form with clear alignment, readable inputs, and good spacing
5. User views blog post and sees polished prose styling, readable tag pills, and visible publication metadata
6. User views 404 page and sees polished typography with clear "go home" navigation
7. User views top bar on any page and sees brand name and social icons properly spaced, logo icon shifts to current section color
8. User views breadcrumb navigation and sees consistent monospace styling, back arrow stays left-aligned regardless of depth
9. User navigates between sections and sees smooth transitions with correct section color shifts (logo, social hovers, backgrounds)
10. User views site on phone (320px-480px) and sees all content readable, navigation adapted (brand name hidden below breakpoint)
11. User touches carousel on mobile device and can navigate with arrows, dots visible and tappable
12. User views footer and sees status text well-formatted with animated link hover in section color

**Plans:** 4/4 plans executed ✓

Plans:
- [x] 01-01-PLAN.md — Homepage hero layout
- [x] 01-02-PLAN.md — Inner pages polish
- [x] 01-03-PLAN.md — Chrome polish
- [x] 01-04-PLAN.md — Mobile responsive + design audit fixes

---

### Phase 2: Performance Optimization & Code Quality

**Goal:** Site feels instant with zero lag. All interactive elements respond immediately. Codebase is clean, maintainable, and uses design system tokens consistently.

**Depends on:** Phase 1 (Design must be finalized before optimizing)

**Requirements:**
- PERF-01, PERF-02, PERF-03, PERF-04 (Carousel lag, font loading, hydration, initial load)
- CODE-01, CODE-02, CODE-03 (Dead code removal, color consolidation, token consistency)

**Success Criteria** (what must be TRUE):
1. User loads any page and carousel appears without lag, hydration flash, or visual shift
2. User loads page and fonts render without visible FOUT or layout shift
3. User clicks carousel arrows, links, or interactive elements and they respond instantly (no perceptible delay)
4. Developer inspects codebase and finds no unreferenced files (zones.ts, old styles) or dead code
5. Developer inspects CSS and finds all colors defined as custom properties in global.css, no hardcoded hex/rgba values in Astro or React components
6. Developer inspects React components and sees consistent use of design system tokens for sizes, spacing, and colors (no inline values)

**Plans:** 1/1 plans executed ✓

Plans:
- [x] 02-01: Dead code removal, hardcoded colors → tokens, hydration optimization

---

### Phase 3: Guest Book Backend

**Goal:** Guest Book is fully functional end-to-end. Entries are submitted to Supabase, owner can approve/reject, and approved entries display on the public page with correct styling and formatting.

**Depends on:** Nothing (can run in parallel with Phase 2)

**Requirements:**
- GBOOK-01, GBOOK-02, GBOOK-03, GBOOK-04, GBOOK-05 (Supabase table, env vars, form submission, approval moderation, entry display)

**Success Criteria** (what must be TRUE):
1. User submits Guest Book form with name, message, signature drawing, and optional image, sees confirmation
2. Image uploads without visible lag or errors, file size optimized
3. Owner logs into Supabase and sees new entry in guest_book table with all fields (name, message, signature, image_url, approved=false)
4. Owner approves entry in Supabase (sets approved=true), change immediately visible in public Guest Book page
5. User views Guest Book page and sees all approved entries displayed as styled sticky notes with legible text and signature/image
6. User can scroll or paginate through multiple approved entries without errors

**Plans:** TBD (1-2 plans expected)

---

### Phase 4: Ship

**Goal:** All work is committed, code is merged to master, site is deployed to production, and verified working end-to-end.

**Depends on:** Phase 1, Phase 2, Phase 3 (All polish, performance, and backend must be complete)

**Requirements:**
- SHIP-01, SHIP-02, SHIP-03 (Commit changes, merge to master, deploy to Vercel)

**Success Criteria** (what must be TRUE):
1. Developer has committed all uncommitted changes with clear commit messages
2. Branch is merged to master with clean history
3. Site is deployed to Vercel and staging URL verified working (all pages load, carousel interactive, Guest Book functional)
4. Production URL (johnlitzsinger.com) serves updated site with all polish, performance fixes, and Guest Book backend live

**Plans:** TBD (1 plan expected)

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Design Polish | 4/4 | Complete | 2026-03-11 |
| 2. Performance & Code Quality | 1/1 | Complete | 2026-03-11 |
| 3. Guest Book Backend | 0/1 | Not started | — |
| 4. Ship | 0/1 | Not started | — |

---

*Roadmap created: 2026-03-11*
*Phase 1 plans defined: 2026-03-11*
