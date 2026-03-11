# External Integrations

**Analysis Date:** 2026-03-10

## APIs & External Services

**Supabase (PostgreSQL Backend):**
- Guest book data persistence (entries: id, name, message, created_at)
- SDK/Client: Direct REST API calls via `fetch` (no official SDK imported)
- Auth: Anonymous key-based auth (`PUBLIC_SUPABASE_ANON_KEY`)
- Endpoints:
  - `GET {SUPABASE_URL}/rest/v1/guestbook?select=...` — Fetch entries (50 most recent)
  - `POST {SUPABASE_URL}/rest/v1/guestbook` — Create new guest book entry
- Status: Not yet configured in production — guest book shows "coming soon" fallback if env vars not set
- Implementation: `src/components/react/GuestBook.tsx` lines 10-60

## Data Storage

**Databases:**
- Supabase PostgreSQL (optional, not configured)
  - Table: `guestbook` (schema inferred: id, name, message, created_at)
  - Connection: REST API via `PUBLIC_SUPABASE_URL`
  - Client: Native `fetch` API (no ORM)
  - Status: Optional — feature degrades gracefully if unconfigured

**File Storage:**
- None currently used
- No image upload integration despite GuestBookPage.tsx comment about "image upload" — feature planned but not implemented

**Caching:**
- None (static site generation — no runtime caching layer)

## Authentication & Identity

**Guest Book Auth:**
- Method: Supabase anonymous key (no user accounts required)
- API Key: `PUBLIC_SUPABASE_ANON_KEY` (public, safe to expose)
- Honeypot field: `website` (hidden input, bot trap in form)

**Visitor Analytics:**
- Method: Vercel Web Analytics (first-party)
- Configuration: Enabled in `astro.config.mjs` via `vercel({ webAnalytics: { enabled: true } })`
- Status: Automatically tracked by Vercel adapter on production

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- None — guest book errors fail silently (catch blocks swallow errors, no logging)
- Guest book fetch errors: `catch { /* Silent fail — guest book entries just won't show */ }`
- Guest book submit errors: show user message "Failed to sign. Try again." but no error logging

**Web Analytics:**
- Vercel Web Analytics (first-party, privacy-friendly)
- Enabled automatically by `@astrojs/vercel` adapter

## CI/CD & Deployment

**Hosting:**
- Vercel (via `@astrojs/vercel` adapter v9.0.4)
- Static output (pre-rendered HTML)
- Vercel Web Analytics enabled

**CI Pipeline:**
- Not configured in repository
- Assumed to be handled by Vercel's automatic deployments

**Build:**
- Command: `npm run build` (outputs to `.vercel/output/`)
- Polyfill for Node.js compatibility: `polyfill-url.cjs` (for Node 24 URL.canParse workaround)

## Environment Configuration

**Required env vars (production on Vercel):**
- `PUBLIC_SUPABASE_URL` - Supabase project URL (e.g., `https://xxxx.supabase.co`)
- `PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous public key

**Optional:**
- If either is missing, guest book feature degrades to "coming soon" message

**Secrets location:**
- Vercel Environment Variables (managed in Vercel dashboard)
- Prefixed with `PUBLIC_` because they are safe to expose (anonymous credentials only)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected
- Guest book submit is direct REST API POST, not webhook-based

## Content Delivery

**RSS/Feeds:**
- RSS feed generation via `@astrojs/rss` for blog posts
- Location: `/rss.xml` (generated automatically from blog collection)
- Filters out draft posts (`draft: true` excluded from feeds)

**Sitemap:**
- XML sitemap via `@astrojs/sitemap`
- Location: `/sitemap-index.xml`
- Filters out draft posts (drafts excluded from sitemap)

## Third-Party Assets

**Fonts:**
- Self-hosted WOFF2 files in `public/fonts/`
  - RethinkSans-Variable.woff2 (body text, variable 400-800)
  - RethinkSans-Italic-Variable.woff2 (body italic)
  - Urbanist-Variable.woff2 (brand name only, variable 100-900)
- No CDN or third-party font service (Google Fonts, etc.)
- Font preloading: Configured in `src/components/BaseHead.astro`

**Icons/Images:**
- Favicon: `public/icon.png` (force-added to git despite `*.png` in `.gitignore`)
- Images: `public/images/` directory (not fully populated — structure exists)
- No CDN — served directly from Vercel's static hosting

## Data Fetching

**Static Generation:**
- Astro generates static HTML at build time
- No runtime GraphQL or REST API calls on page load (except guest book)

**Guest Book (Runtime):**
- Browser-side `fetch` to Supabase REST API
- Only runs when GuestBook React component mounts (`useEffect` on client)
- Graceful degradation if endpoint unreachable

---

*Integration audit: 2026-03-10*
