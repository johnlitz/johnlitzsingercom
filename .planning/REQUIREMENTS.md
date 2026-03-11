# Requirements: johnlitzsinger.com Site Refresh

**Defined:** 2026-03-11
**Core Value:** The site must feel like a personal artifact the creator is proud of — visually distinctive, buttery smooth, zero lag.

## v1 Requirements

### Design — Inner Pages

- [ ] **DESIGN-01**: Now page has polished layout, typography, spacing, and visual hierarchy
- [ ] **DESIGN-02**: Work page has polished layout with carousel title/description properly positioned
- [ ] **DESIGN-03**: About page has polished layout with bio and GIF properly composed
- [ ] **DESIGN-04**: Guest Book page has polished sticky note layout with proper spacing and alignment
- [ ] **DESIGN-05**: Blog post pages have polished prose styling, tag pills, and metadata display
- [ ] **DESIGN-06**: 404 page has polished typography and clear navigation home

### Design — Chrome

- [ ] **CHROME-01**: Top bar (brand name + social icons) is properly spaced and responsive
- [ ] **CHROME-02**: Breadcrumb navigation is visually consistent with monospace styling
- [ ] **CHROME-03**: Back arrow stays left-aligned regardless of breadcrumb depth
- [ ] **CHROME-04**: Footer status text is well-formatted with animated link hover
- [ ] **CHROME-05**: Page transitions between sections are smooth with correct section color shifts
- [ ] **CHROME-06**: Section color system is consistent (logo, hovers, backgrounds, underlines)

### Design — Mobile

- [ ] **MOBILE-01**: All pages render correctly on phone-width viewports (320px-480px)
- [ ] **MOBILE-02**: Navigation chrome adapts properly (brand name hide, icon adjustments)
- [ ] **MOBILE-03**: Folder grid on homepage adjusts to smaller viewport
- [ ] **MOBILE-04**: Carousel is usable on touch devices
- [ ] **MOBILE-05**: Guest Book form and sticky notes adapt to narrow widths

### Performance

- [ ] **PERF-01**: ProjectCarousel hydration lag is eliminated or imperceptible
- [ ] **PERF-02**: Font loading causes no visible flash or layout shift
- [ ] **PERF-03**: Client hydration directives are optimized (load vs visible vs idle per component)
- [ ] **PERF-04**: Initial page load feels instant (no perceptible delay before interactive)

### Code Quality

- [ ] **CODE-01**: Dead code removed (unused files like zones.ts, old styles, unreferenced components)
- [ ] **CODE-02**: All hardcoded hex/rgba color values consolidated into CSS custom properties
- [ ] **CODE-03**: React components use design system tokens consistently (no inline colors/sizes)

### Guest Book Backend

- [ ] **GBOOK-01**: Supabase table created with schema for entries (name, message, signature, image, approved status)
- [ ] **GBOOK-02**: Environment variables configured (PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
- [ ] **GBOOK-03**: Frontend submits entries to Supabase (name, message, signature drawing, optional image)
- [ ] **GBOOK-04**: Only owner-approved entries display publicly (approval-gated moderation)
- [ ] **GBOOK-05**: Entries load and display from Supabase with correct sticky note styling

### Ship

- [ ] **SHIP-01**: All uncommitted changes committed with clean history
- [ ] **SHIP-02**: Branch merged to master
- [ ] **SHIP-03**: Production deployment to Vercel verified working

## v2 Requirements

### Design — Homepage

- **HOME-01**: Homepage tagline typography refinement
- **HOME-02**: Folder icon sizing, spacing, and hover animation polish
- **HOME-03**: Overall homepage composition and visual balance

### Guest Book Enhancements

- **GBOOK-V2-01**: Admin dashboard for approving/rejecting entries
- **GBOOK-V2-02**: Email notification when new entries are submitted

## Out of Scope

| Feature | Reason |
|---------|--------|
| Dark mode | Light-only is a deliberate aesthetic choice |
| Contact form | Removed in v3 redesign |
| Blog CMS / admin panel | MDX files are the content system |
| JS animation libraries | CSS transitions only, by design principle |
| Sidebar layout | Replaced by centered column in v3 |
| Mobile app | Web-only |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| *(Populated during roadmap creation)* | | |

**Coverage:**
- v1 requirements: 26 total
- Mapped to phases: 0
- Unmapped: 26

---
*Requirements defined: 2026-03-11*
*Last updated: 2026-03-11 after initial definition*
