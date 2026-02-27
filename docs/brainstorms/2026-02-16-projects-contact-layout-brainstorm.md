# Brainstorm: Projects Section, Contact Section & Layout Proportions

**Date:** 2026-02-16
**Status:** Ready for planning

## What We're Building

Three changes to the personal website:

1. **Projects section** — A new homepage section showcasing projects with placeholder data. Each entry optionally links to an external URL (live site, GitHub repo). Follows the same flat-list pattern as Experience and Writing.

2. **Contact section** — A homepage section displaying social/contact links: Email (jlitzsin@purdue.edu), LinkedIn, GitHub, Twitter/X. No contact form — just direct links. This replaces the sidebar as the primary contact surface.

3. **Sidebar width increase** — Widen from 280px to ~340px to give the left column more visual weight and make the overall layout more proportional (inspired by siansheu.com's ~30% left column ratio).

## Why This Approach

- **No form, no backend** — The site stays fully static (`output: 'static'`). No need to add Astro hybrid mode, serverless functions, or external email services. Zero new dependencies.
- **Same design language** — Both new sections use the existing section pattern (red uppercase label, border-top entry separators, `--content-max` constraint). No new UI patterns introduced.
- **340px sidebar** — A moderate increase from 280px that gives the name and nav more breathing room without dominating the viewport. Keeps the fixed-width approach (not percentage-based) for predictable layout behavior.

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Projects data source | Inline array in frontmatter | Matches Experience.astro pattern. No content collection needed for a small static list. |
| Project links | Optional per entry | Some projects may have live URLs or repos, others won't. Template handles both cases. |
| Contact approach | Links only, no form | Stays static, zero dependencies, no external signup. Visitors click through to email/social. |
| Contact links | Email, LinkedIn, GitHub | Three channels covering professional presence. No Twitter/X. |
| Section order | Work → Projects → Writing → Contact | Projects adjacent to work (both are portfolio content). Contact at the bottom as a natural page endpoint. |
| Sidebar width | 280px → 340px | Moderate increase for better proportions. Update `--sidebar-width` token + mobile breakpoint stays at 768px. |
| Sidebar nav | Add "Projects" and "Contact" links | Both sections get anchor IDs; sidebar nav links scroll to them. |

## Scope

### Files to create
- `src/components/Projects.astro` — New section component
- `src/components/Contact.astro` — New section component

### Files to modify
- `src/pages/index.astro` — Import and place both new sections
- `src/components/Sidebar.astro` — Add nav links for Projects and Contact, adjust for wider width if needed
- `src/styles/global.css` — Update `--sidebar-width: 340px`
- `src/layouts/BaseLayout.astro` — May need padding/gutter adjustments for new sidebar width

### Files unchanged
- `src/layouts/BlogPostLayout.astro` — Blog posts unaffected
- `src/pages/blog/index.astro` — Blog listing unaffected
- Font files, global tokens (other than sidebar-width) — No changes

## Projects Section Blueprint

```
<section id="projects" aria-label="Projects">
  <h2 class="section-label">PROJECTS</h2>
  <div class="list">
    {projects.map(project => (
      <div or <a class="entry">  <!-- <a> if project.url exists, <div> otherwise -->
        <div class="entry-header">
          <h3>{project.title}</h3>
          <span class="tech">{project.tech}</span>  <!-- optional tech stack -->
        </div>
        <p class="summary">{project.description}</p>
      </div or </a>
    ))}
  </div>
</section>
```

Data shape per project:
- `title`: string (required)
- `description`: string (required)
- `tech`: string (optional — e.g., "Astro / React")
- `url`: string (optional — external link)

Placeholder entries: 2-3 dummy projects with realistic titles/descriptions.

## Contact Section Blueprint

```
<section id="contact" aria-label="Contact">
  <h2 class="section-label">CONTACT</h2>
  <div class="links">
    <a href="mailto:jlitzsin@purdue.edu">jlitzsin@purdue.edu</a>
    <a href="https://linkedin.com/in/johnlitzsinger">LinkedIn</a>
    <a href="https://github.com/johnlitz">GitHub</a>
  </div>
</section>
```

Minimal styling — just the flat link list with the standard section pattern. No cards, no icons. Links styled with `--secondary` color, hover to `--accent`.

## Layout Changes Blueprint

```css
/* global.css */
--sidebar-width: 340px;  /* was 280px */

/* BaseLayout.astro — .content padding may need gutter adjustment */
/* Sidebar.astro — verify name, nav, and contact still fit at 340px */
/* Mobile breakpoint (768px) — sidebar hidden, no width change needed */
```

## Open Questions

- Should the sidebar contact info (email + LinkedIn currently in sidebar-bottom) be removed once the Contact section exists, or kept as redundant access?
