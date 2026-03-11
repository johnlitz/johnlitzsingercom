---
phase: 1
slug: design-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-11
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — Phase 1 is visual polish (manual verification) |
| **Config file** | None |
| **Quick run command** | `npm run build` (ensures no build errors) |
| **Full suite command** | Manual visual inspection across all pages at 320px, 480px, 768px, 1440px |
| **Estimated runtime** | ~10 seconds (build) + manual inspection |

---

## Sampling Rate

- **After every task commit:** Run `npm run build` to verify no regressions
- **After every plan wave:** Full visual inspection across all breakpoints
- **Before `/gsd:verify-work`:** Full suite must pass (build + visual)
- **Max feedback latency:** 10 seconds (build check)

---

## Per-Task Verification Map

| Req ID | Behavior | Test Type | Validation Method | Automated? |
|--------|----------|-----------|-------------------|-----------:|
| DESIGN-01 | Now page: layout, typography, spacing, hierarchy | Visual | Manual: entry list spacing, title prominence, font sizes at breakpoints | ❌ Manual |
| DESIGN-02 | Work page: carousel title/description above cards | Visual | Manual: title/description visible, carousel cards below, not overlapping | ❌ Manual |
| DESIGN-03 | About page: bio above, GIF below, properly spaced | Visual | Manual: bio readable, GIF proportional, vertical flow balanced | ❌ Manual |
| DESIGN-04 | Guest Book: sticky note form, alignment, spacing | Visual | Manual: form inputs accessible, sticky notes readable at 320px | ❌ Manual |
| DESIGN-05 | Blog posts: prose styling, tag pills, metadata | Visual | Manual: heading spacing, tag pills styled, metadata secondary | ❌ Manual |
| DESIGN-06 | 404 page: typography, folder metaphor, navigation | Visual | Manual: heading scales, "go home" link accessible, on-brand text | ❌ Manual |
| CHROME-01 | Top bar: brand + icons properly spaced | Visual | Manual: desktop spacing, mobile adaptation, no overflow | ❌ Manual |
| CHROME-02 | Breadcrumb: integrated into title, monospace | Visual | Manual: breadcrumb-as-title on all inner pages, consistent styling | ❌ Manual |
| CHROME-03 | Back arrow: left-aligned regardless of depth | Visual | Manual: arrow position fixed across short/long paths | ❌ Manual |
| CHROME-04 | Footer: status text, animated link hover | Visual | Manual: status visible, link animates in section color | ❌ Manual |
| CHROME-05 | Page transitions: smooth 100-150ms color shifts | Visual | Manual: navigate between sections, smooth transitions | ❌ Manual |
| CHROME-06 | Section color system: consistent across elements | Visual | Manual: logo, hovers, backgrounds, underlines match section | ❌ Manual |
| MOBILE-01 | All pages readable 320px-480px | Visual | Manual: no overflow, text readable, footer visible | ❌ Manual |
| MOBILE-02 | Navigation chrome adapts on mobile | Visual | Manual: brand name hidden <480px, icons visible | ❌ Manual |
| MOBILE-03 | Folder grid → carousel below 640px | Visual | Manual: grid on desktop, carousel on mobile, dots + swipe | ❌ Manual |
| MOBILE-04 | Carousel touchable on mobile | Visual | Manual: swipe works, dots tappable (44px+) | ❌ Manual |
| MOBILE-05 | Guest Book adapts to narrow widths | Visual | Manual: form stacked, canvas visible, notes single-column | ❌ Manual |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers build verification. All phase requirements are visual and require manual inspection.

- [ ] `npm run build` — must pass with zero errors after each change

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| All 17 requirements | DESIGN-01–06, CHROME-01–06, MOBILE-01–05 | Visual design polish cannot be automated — requires human judgment on spacing, hierarchy, balance, and craft quality | DevTools responsive mode at 320px, 480px, 768px, 1440px. Check each page for proper layout, spacing, typography, and section color consistency |

---

## Validation Sign-Off

- [x] All tasks have verification method (manual visual inspection)
- [x] Sampling continuity: build check after every task
- [x] Wave 0 covers build verification
- [x] No watch-mode flags
- [x] Feedback latency < 10s (build check)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
