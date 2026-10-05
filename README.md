# ImageBoost SEO

Shopify embedded admin app: bulk image optimization (WebP + compression), AI alt
text, auto-optimization of new products, page-speed reporting and optimization
analytics.

Rebuild of **PixelPerfect** (previously OptiPix, originally ImageGenie) under a
new Shopify app identity after the original Partner account access was lost. The
functionality and the pricing model are carried over unchanged.

- **Live:** https://imageboostseo.onkra.online
- **Stack:** React Router 7 · Shopify App React Router v1 · Polaris 13 · Prisma/PostgreSQL · Sharp
- **Hosting:** Docker on Coolify (`coolify.solnix.store`), health check at `/healthz`

---

## ⚠️ Launch-critical: plans must be created in the Dev/Partner Dashboard

This is a **Shopify Managed Pricing** app. It **cannot** create charges — the
Billing API is blocked for managed-pricing apps, and there is deliberately no
`billing:` config in `app/shopify.server.js`. Plans live in the Dashboard and
merchants subscribe on Shopify's hosted pricing page.

`app/plans.server.js` resolves a subscription to a tier **by exact name**,
stripping a trailing `" Annual"`. These names must match the Dashboard
**byte-for-byte** — a typo silently drops the merchant to Free:

| Plan name | Monthly | Annual | Images/mo | Adds |
|---|---|---|---|---|
| `Free` | $0 | — | 100 | optimize, webp, revert |
| `Starter` / `Starter Annual` | $19 | $190 | 2,000 | altText, filenameSeo, resize, scheduling |
| `Growth` / `Growth Annual` | $49 | $490 | 15,000 | watermark, heic, autoOptimize, pageSpeed |
| `Pro` / `Pro Annual` | $499 | $2,499 | 50,000 | bulkExport, priority |

**The `Free` plan is mandatory.** `app/routes/app.jsx` gates the entire app on
`hasActivePlan`; with no subscription the merchant sees only the pricing wall.
If no Free plan exists, an App Store reviewer on a development store hits a wall
they cannot get past — an automatic rejection. Development stores also cannot
approve *paid* managed-pricing subscriptions, which is what `DEV_PLAN_OVERRIDE`
exists for.

`app/planCatalog.js` holds the marketing copy shown in-app. Prices are
intentionally **not** rendered — they are owned by the Dashboard and would go
stale in code.

---

## Environment

Copy `.env.example` to `.env` for local work; set the same keys in Coolify for
the deployment. Mark them **runtime-only** in Coolify — nothing here is needed
at build time, and flagging them build-time passes the app secret as a Docker
build ARG, where it persists in image history.

| Variable | Required | Purpose |
|---|---|---|
| `SHOPIFY_API_KEY` | yes | App client ID |
| `SHOPIFY_API_SECRET` | yes | App client secret |
| `SHOPIFY_APP_URL` | yes | Public HTTPS origin |
| `SCOPES` | yes | `write_products,write_files` |
| `SHOPIFY_APP_HANDLE` | yes | Path segment in the hosted pricing URL — see below |
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `OPENAI_API_KEY` | feature | AI alt text. Unset ⇒ falls back to `"<title> - product image"` |
| `ANTHROPIC_API_KEY` | feature | Alternate alt-text provider |
| `GOOGLE_PAGESPEED_API_KEY` | feature | Page Speed reports. Unset ⇒ feature cannot run |
| `DEV_PLAN_OVERRIDE` | dev only | Force a tier (`starter`/`growth`/`pro`). **Never set in production** |
| `DEV_PLAN_OVERRIDE_SHOP` | dev only | Scope the override to one shop |

Encoder tuning (`WEBP_QUALITY`, `MAX_IMAGE_DIM`, `BATCH_CONCURRENCY`, …) is
documented inline in `app/optimize.server.js`; all have working defaults.

### `SHOPIFY_APP_HANDLE`

The handle is the path segment in
`admin.shopify.com/store/<store>/charges/<handle>/pricing_plans`. Shopify
derives it from the app name but **appends a numeric suffix on collision** —
the previous build ended up as `optipix-3`. Read the real value off the
Dashboard URL. A wrong handle makes every "Choose plan" CTA 404.

At runtime the app prefers the handle Shopify itself reports
(`currentAppInstallation.app.handle`); this env var is the fallback used when
that query is unavailable — which is exactly when the pricing wall shows, so it
still has to be correct.

---

## Local development

```bash
npm install
cp .env.example .env     # then fill it in
npm run dev              # shopify app dev
```

`npm run build` must pass before deploying. Note `npm run lint` is currently
non-functional: the ESLint dependencies are present but there is no config file
in the repo (inherited gap).

## Deployment

The Dockerfile runs `npm run setup && npm run start`, where `setup` is
`prisma migrate deploy`.

**`prisma/migrations/0001_init` is the schema.** It was regenerated for this
rebuild because the inherited migration created only `Session` (without
`refreshToken`/`refreshTokenExpires`) and had nothing for `UsageCounter`,
`ShopSettings` or `ImageSize`. The old app hid that by running
`prisma db push --accept-data-loss` on every container start, which reconciles
against `schema.prisma` directly and never reads migration history — so the
migrations were free to rot. Regenerate the baseline with:

```bash
prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
```

Once any database has it applied, add forward migrations instead of editing it.

### Pushing app config to Shopify

`shopify.app.toml` (URLs, scopes, webhook subscriptions) only takes effect once
deployed to Shopify:

```bash
export SHOPIFY_APP_AUTOMATION_TOKEN=<app automation token>
shopify app deploy --allow-updates
```

`SHOPIFY_APP_AUTOMATION_TOKEN` is the Dev Dashboard app automation token; it
replaces the older `SHOPIFY_CLI_PARTNERS_TOKEN`. `--allow-updates` is required
in non-interactive environments.

---

## Architecture notes

| File | Role |
|---|---|
| `app/optimize.server.js` | Encode pipeline. Two-pass WebP (q76, retrying at q66 when the first pass gains <20%), skips images gaining <2% so a credit is never burned to shave kilobytes. Per-image entry points let the browser drive a real progress bar. |
| `app/catalog.server.js` | Product catalog for the optimizer. Deliberately behind `/api/catalog` rather than in the page loader — building it inline made "Open optimizer" appear dead for 4–10s. |
| `app/usage.server.js` | Monthly quota metering, keyed `shop` + `YYYY-MM`. Reserve-then-refund so concurrent per-image requests cannot overshoot the quota. Depends on the `UsageCounter(shop, period)` unique index. |
| `app/billing.server.js` | Reads live subscription state; caches **positive** results for 120s only, so a fresh subscribe unlocks instantly while a cancel relocks within the TTL. |
| `app/plans.server.js` | Tier catalog and feature entitlements — the single source of truth for gating. |
| `prisma/schema.prisma` | `Session`, `UsageCounter`, `ShopSettings`, `ImageSize` (a CDN-url → byte-size cache that removes a HEAD request per image per page render). |

Features are gated **server-side** on entitlements, not just hidden in the nav —
`app.alttextsuggestions.jsx` and `app.pagespeedimpactreports.jsx` both fail
closed if the plan lookup throws.

## Privacy / compliance

`app/routes/webhooks.compliance.jsx` handles `customers/data_request`,
`customers/redact` and `shop/redact`. The app stores no customer records, so
the first two acknowledge; `shop/redact` deletes the shop's sessions, usage
counters and settings. Unsigned requests are rejected (HMAC verified before the
handler runs).

The app sends image URLs to OpenAI (`gpt-4o-mini` vision) and optionally
Anthropic for alt-text generation, and product URLs to the Google PageSpeed
Insights API. **Both must be disclosed in the App Store listing and privacy
policy.**
