import { PLAN_TIERS } from "../planCatalog";

// 4-tier pricing comparison used by both the standalone pricing page and the
// in-app pricing wall. Presentational only: every plan CTA is a real top-frame
// link (`target="_top"`) to Shopify's hosted managed-pricing page, where the
// actual price/cycle live and are picked. A direct anchor is used (rather than a
// form POST + reauthorize-header redirect) because a user click is a reliable
// user-activation that can navigate the top frame out of the embedded iframe —
// the POST-based redirect intermittently failed during initial setup and looped
// the merchant back to the app index.
//
// NOTE: we intentionally do NOT show prices here. Prices are owned by the
// Partner Dashboard plans and can be changed there without a code deploy;
// rendering them in-app would risk showing a stale amount. The merchant sees the
// real price on Shopify's pricing page after clicking through.
//
// Colours are CSS variables from app/styles/imageboost.css rather than literals.
// This file used to carry its own copy of the palette in hex, so a rebrand had
// to be applied here as well as in the stylesheet — and when it wasn't, the
// pricing page kept the old brand colour while the rest of the app changed.
export default function PricingTiers({ pricingUrl }) {
  return (
    <div style={s.page}>
      <p style={s.appLabel}>IMAGEBOOST SEO</p>
      <h1 style={s.heading}>Pricing that scales with you.</h1>
      <p style={s.subheading}>
        Optimize images, boost speed, and rank higher — pick the plan that fits your catalog.
      </p>

      <div style={s.grid}>
        {PLAN_TIERS.map((tier) => (
          <div key={tier.name} style={tier.popular ? s.cardPopular : s.card}>
            {tier.popular && <div style={s.popularBadge}>MOST POPULAR</div>}
            <p style={s.tierName}>{tier.name}</p>
            <p style={s.tierTagline}>{tier.tagline}</p>
            <a
              href={pricingUrl}
              target="_top"
              style={{
                ...(tier.popular ? s.ctaPrimary : s.ctaSecondary),
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              {tier.price === 0 ? "Start free" : "Choose plan"}
            </a>
            <div style={s.featureList}>
              {tier.features.map((f, i) => (
                <div key={i} style={s.featureRow}>
                  <span style={s.check}>✓</span>
                  <span style={s.featureText}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p style={s.disclaimer}>Secure billing through Shopify · Cancel anytime</p>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "var(--ib-grad-page)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "48px 24px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  appLabel: {
    fontSize: 11, fontWeight: 700, letterSpacing: "0.22em",
    color: "var(--ib-accent)", margin: "0 0 16px 0", textTransform: "uppercase",
  },
  heading: {
    fontSize: 40, fontWeight: 800, color: "var(--ib-ink)",
    margin: "0 0 10px 0", textAlign: "center", letterSpacing: "-0.5px", lineHeight: 1.1,
  },
  subheading: {
    fontSize: 15, color: "var(--ib-muted)", margin: "0 0 28px 0",
    textAlign: "center", maxWidth: 560,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
    width: "100%",
    maxWidth: 1080,
    alignItems: "start",
  },
  card: {
    position: "relative",
    background: "var(--ib-surface)",
    borderRadius: 16,
    padding: "28px 24px",
    boxShadow: "0 8px 30px var(--ib-ink-shadow)",
    border: "1px solid var(--ib-border)",
  },
  cardPopular: {
    position: "relative",
    background: "var(--ib-surface)",
    borderRadius: 18,
    padding: "28px 24px",
    boxShadow: "0 20px 50px var(--ib-glow-strong)",
    border: "2px solid var(--ib-accent)",
    transform: "translateY(-8px)",
  },
  popularBadge: {
    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
    background: "var(--ib-grad)", color: "#FFFFFF",
    fontSize: 10, fontWeight: 800,
    letterSpacing: "0.12em", padding: "5px 12px", borderRadius: 999, whiteSpace: "nowrap",
    boxShadow: "0 4px 12px var(--ib-glow-strong)",
  },
  tierName: { fontSize: 18, fontWeight: 800, color: "var(--ib-ink)", margin: "0 0 2px 0" },
  tierTagline: { fontSize: 12, color: "var(--ib-faint)", margin: "0 0 16px 0" },
  ctaPrimary: {
    width: "100%", padding: "12px", background: "var(--ib-grad)", color: "white",
    border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, marginBottom: 20,
    boxShadow: "0 6px 16px var(--ib-btn-shadow)",
  },
  ctaSecondary: {
    width: "100%", padding: "12px", background: "var(--ib-soft-1)", color: "var(--ib-accent-dark)",
    border: "1px solid var(--ib-border-strong)", borderRadius: 10, fontSize: 14, fontWeight: 700,
    marginBottom: 20,
  },
  featureList: { display: "flex", flexDirection: "column", gap: 10 },
  featureRow: { display: "flex", alignItems: "flex-start", gap: 8 },
  check: { color: "var(--ib-accent)", fontWeight: 800, fontSize: 13, lineHeight: "18px", flexShrink: 0 },
  featureText: { fontSize: 13, color: "var(--ib-body)", lineHeight: "18px" },
  disclaimer: { textAlign: "center", fontSize: 12, color: "var(--ib-faint)", marginTop: 32 },
};
