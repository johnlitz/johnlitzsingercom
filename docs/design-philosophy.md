# Design Philosophy

## Universal Principles

### Spacing: Every Element Earns Its Place

I don't add space by default and remove it when things feel crowded. I start with nothing and add space only when elements need breathing room to read clearly. The question is never "how much padding?" but "does this element need separation from its neighbors?" If the answer is no, there is no space.

### Typography: Hierarchy Without Decoration

I establish hierarchy through weight and size, never through color variety or decorative treatments. Body text is 400. Emphasis is 600. Headlines are 700–800 and optically kerned. If I need a third level of hierarchy, something is wrong with the structure.

### Color: Context-Dependent Life

Color should mean something. I use the warm cream background as a neutral field, the red accent as a brand signal, and four section colors (blue, green, amber, purple) to give each area of the site its own identity. When a user enters Work, the site subtly shifts green. When they enter About, it shifts purple. The chrome follows them — the logo hue-rotates, social icon hovers change, background tints. Decoration that doesn't encode information is noise.

### Motion: Statement Moments Only

I use animation for two purposes: confirming an interaction happened (button press, card click) and guiding spatial attention (carousel slide direction). Ambient animation — loading spinners, parallax, scroll reveals — is off by default. The exception is the status dot pulse, which is earned: it communicates real-time presence, not decoration.

### Craft Standard: Pixel-Perfect Obsession

The thing that separates a good site from a memorable one is the 5% of details that 95% of visitors feel but never consciously notice. The folder icon glow that matches the section color. The brand underline that animates from center outward. The back arrow that never shifts layout. These are not features. They are craft.

---

## Site-Specific Decisions

### Palette: Warm Cream Light-Only

I chose a warm cream background (`#faf8f5`) instead of pure white because pure white reads as clinical — appropriate for a SaaS product, wrong for a personal artifact. The warmth signals intention. I dropped dark mode entirely: maintaining two equally polished modes is twice the work, and a warm cream light-only site with vivid folder colors reads more distinctively than a mode-switching one.

### Type System: Rethink Sans + Urbanist

Rethink Sans is the workhorse — variable, 400–800 weight range, legible at every size, with just enough personality in the letterforms to feel human. Urbanist handles the brand name only: geometric, high contrast at heavy weights, distinctly different from Rethink Sans so the brand name reads as a logotype, not just text. System monospace handles breadcrumbs and metadata because it signals "filesystem" — which is the aesthetic I want for navigation chrome.

### Section Identity: The Folder Aesthetic

The macOS-colored-folder metaphor is the core personality element. Each section is a folder. The color of that folder permeates everything: the background tint, the folder icon in the breadcrumb, the logo hue-rotate filter, social icon hover states, the brand underline color, even the tech pill background tint in the work carousel. This is not a theme switcher — it is a single, coherent section-aware color system implemented in CSS custom properties set at render time.

### OKLCH Color Scales

I use OKLCH for section colors because perceptual uniformity matters when mixing transparencies. `color-mix(in srgb, var(--work-500) 8%, transparent)` for a background tint looks different from `color-mix(in oklch, ...)` — the sRGB mix washes out. The section OKLCH scales (50 for tints, 500 for full colors) give consistent perceived brightness across all four hues.

### Layout: Viewport-Locked Column

The site fits in one viewport. No scrolling on the homepage or section landing pages. This is a deliberate constraint: it forces every element to earn its place, it makes the site feel like an app rather than a document, and it eliminates the cognitive overhead of "how long is this page?" Inner pages (blog posts, project details) allow scrolling because content drives length there.
