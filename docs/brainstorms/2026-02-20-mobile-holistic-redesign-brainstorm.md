# Mobile Holistic Redesign Brainstorm

**Date:** 2026-02-20
**Status:** Ready for planning
**Design philosophy:** Steve Jobs, Rick Rubin, Dieter Rams — "Less, but better"

---

## What We're Building

A cohesive mobile redesign that brings the editorial identity of the desktop experience to mobile screens (768px and below) and fixes the tablet dead zone (769-1024px). The desktop sidebar — name, navigation, spine — has no mobile equivalent today. This pass gives mobile its own faithful translation of that identity.

### Scope

- Mobile (375px-768px): Full redesign of header, navigation, and spatial rhythm
- Tablet (769px-1024px): Intermediate breakpoint to fix sidebar cramping content
- All 6 pages: Home, Work, Projects, Writing (blog), Contact, Blog posts

---

## Why This Approach

The mobile critique surfaced 8 observations. Rather than patching them individually, we're treating mobile as a cohesive design surface that deserves the same intentionality as desktop. The "surgical mobile layer" approach adds one new component and touches 4-5 existing files — minimum footprint, maximum impact.

Guiding constraint: **same designer, different canvas**. Every mobile decision should feel like it came from the same hand that designed the desktop sidebar.

---

## Key Decisions

### 1. Identity: Name as anchor

- **"John Litzsinger"** centered at the top of every mobile page
- Tapping the name navigates Home (same as desktop sidebar behavior)
- This is the mobile equivalent of the desktop sidebar spine
- Typography: Same VTF Lack, sized appropriately for mobile

### 2. Navigation: Collapsible inverted pyramid

- Below the name: a **minimalist chevron (∨)** that toggles a dropdown
- The chevron is wider than a typical caret — more like a gentle V
- Dropdown reveals an **inverted pyramid** layout:
  - **Row 1:** `Projects` | `Work` | `Writing` (left / center / right)
  - **Row 2 (staggered below, between the gaps):** `Contact` | `Resume`
- When open: chevron flips to **∧** to close
- Smooth CSS animation for open/close
- Implementation: Astro component with minimal inline `<script>` for toggle state, CSS Grid for the pyramid layout

### 3. Separator

- **1px border** below the header area (name + chevron), matching the desktop border vocabulary
- Consistent with `border-top: 1px solid var(--border)` used throughout the site

### 4. Spatial rhythm: Context-dependent

- **Tighten:** Blog post section spacing (currently over-generous for vertical mobile scrolling)
- **Add room:** Page titles need breathing room below the new header
- **Reduce:** Dead space below sparse pages (contact, projects)
- **Fix:** Work page date/company layout that breaks at mobile widths
- Each page area gets exactly the spacing it needs — no universal tighten/loosen

### 5. Footer and form: Stay minimal

- No personality additions. The footer is a footer. The form is a form.
- "If it's not type or space, question it" — functional elements stay functional
- Any improvements are structural (spacing), not decorative

### 6. Tablet intermediate breakpoint

- New breakpoint at **1024px** to address the 769-1024px dead zone
- Sidebar currently consumes ~33% at these widths, cramping content
- Solution: Narrower sidebar or adjusted grid proportions at tablet sizes

---

## Implementation Approach: Surgical Mobile Layer

### New files
- `src/components/MobileHeader.astro` — Name + chevron + collapsible nav dropdown

### Modified files
- `src/layouts/BaseLayout.astro` — Replace tab-bar markup with MobileHeader component
- `src/styles/global.css` — Add 1024px intermediate breakpoint, mobile spacing adjustments
- `src/pages/work.astro` — Fix mobile date/company layout
- `src/layouts/BlogPostLayout.astro` — Tighten mobile section spacing

### Technical details
- Inline `<script>` for toggle (no React/framework JS needed)
- CSS Grid for the inverted pyramid nav layout
- CSS `transform: rotate()` for smooth chevron flip animation
- `aria-expanded` and `aria-controls` for accessibility
- View transition compatible (`transition:persist` considerations)

---

## Open Questions

1. **Chevron design:** Exact width/weight of the ∨ character — SVG path, CSS border trick, or Unicode character?
2. **Nav animation:** Simple opacity fade or height slide for the dropdown?
3. **Tablet sidebar:** Narrower sidebar at 769-1024px, or switch to the mobile header pattern?
4. **Active state in pyramid nav:** Red underline like the current tab bar, or different indicator for the staggered layout?
5. **Dropdown overlay vs inline:** Does the nav push content down or overlay it?

---

## What This Does NOT Include

- Desktop changes (faithful to "same designer, different canvas" — desktop stays as-is)
- New pages or content
- Design system overhaul (tokens stay, just add mobile-specific adjustments)
- Dark mode changes (already handled by `prefers-color-scheme`)
- Performance work (already clean per review)
