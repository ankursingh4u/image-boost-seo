// Client-safe pricing display catalog (marketing copy + prices) for the pricing
// page and pricing wall. The source of truth for runtime gating/quotas is
// plans.server.js — keep the prices/quotas here in sync with that file and with
// the plans created in the Partner Dashboard.
//
// Note: because this is a Managed Pricing app, every "Choose plan" button sends
// the merchant to Shopify's hosted pricing page where they pick the real plan —
// the per-tier buttons here are purely informational about what they'll get.
// EVERY bullet below must name something a merchant on that tier can actually
// do today. This list previously advertised eight features that were never
// built — Restore originals, SEO filenames, Resize & crop, Scheduled runs,
// Watermarking & HEIC, Bulk image export, Priority processing — which is a
// straightforward App Store rejection and, for the paid tiers, charging for
// functionality that does not exist. Keep this in step with the entitlements
// in plans.server.js; that file is the gate, this one is only the copy.
export const PLAN_TIERS = [
  {
    name: "Free",
    price: 0,
    priceAnnual: 0,
    images: "100",
    tagline: "Try it out",
    features: [
      "100 images / month",
      "WebP conversion & compression",
      "Optimization analytics",
    ],
  },
  {
    name: "Starter",
    price: 19,
    priceAnnual: 190,
    images: "2,000",
    tagline: "For growing stores",
    features: [
      "2,000 images / month",
      "Everything in Free",
      "AI alt text",
    ],
  },
  {
    name: "Growth",
    price: 49,
    priceAnnual: 490,
    images: "15,000",
    tagline: "Most popular",
    popular: true,
    features: [
      "15,000 images / month",
      "Everything in Starter",
      "Auto-optimize new products",
      "Page Speed reports",
    ],
  },
  {
    name: "Pro",
    price: 499,
    priceAnnual: 2499,
    images: "50,000",
    tagline: "High volume",
    // NOTE: Pro now adds no capability over Growth — only quota. At $499/mo
    // against Growth's $49 that is a 10x price for 3.3x the images, which is a
    // hard sell with nothing else in the column. Either build the features that
    // were being advertised, or reprice/reposition this tier.
    features: [
      "50,000 images / month",
      "Everything in Growth",
    ],
  },
];
