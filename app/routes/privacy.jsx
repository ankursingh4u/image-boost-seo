// Public privacy policy, served at /privacy.
//
// Hosted inside the app rather than as a separate site so the URL lives on the
// same domain Shopify already knows about, and so it can never drift out of
// sync with what the code actually does. Deliberately unauthenticated: the App
// Store listing links here and a reviewer must be able to read it without
// installing anything.
//
// Everything below is a factual description of the app's behaviour. If the
// data flows change, change this page in the same commit.

import { useLoaderData } from "react-router";

const UPDATED = "5 October 2026";

// Set SUPPORT_EMAIL in the environment. The fallback is the developer address
// so the page is never contactless, but a role address is better for a public
// listing.
export const loader = () => ({
  email: process.env.SUPPORT_EMAIL || "a4ankur.mail@gmail.com",
});

export default function Privacy() {
  const { email } = useLoaderData();
  return (
    <main style={s.page}>
      <div style={s.wrap}>
        <p style={s.eyebrow}>IMAGEBOOST SEO</p>
        <h1 style={s.h1}>Privacy Policy</h1>
        <p style={s.updated}>Last updated: {UPDATED}</p>

        <p style={s.p}>
          ImageBoost SEO is a Shopify app that compresses product images, converts them to
          WebP, and generates alt text. This policy explains exactly what data the app
          handles, where it goes, and how long it is kept.
        </p>

        <h2 style={s.h2}>What the app stores</h2>
        <p style={s.p}>The app keeps the following in its own database:</p>
        <ul style={s.ul}>
          <li style={s.li}>
            <strong>Store session data</strong> — your myshopify.com domain, the access token
            Shopify issues to the app, and, when Shopify provides them, the name, email
            address and locale of the staff member who installed the app. This is what lets
            the app talk to your store.
          </li>
          <li style={s.li}>
            <strong>Usage counts</strong> — the number of images optimized by your store each
            calendar month, used to enforce your plan&rsquo;s limit.
          </li>
          <li style={s.li}>
            <strong>Your settings</strong> — currently a single on/off preference for
            automatically optimizing newly created products.
          </li>
          <li style={s.li}>
            <strong>An image size cache</strong> — a record of how many bytes a given Shopify
            CDN image URL is, so the app does not have to re-measure the same file repeatedly.
            This is keyed by URL only and is not linked to any store or person.
          </li>
        </ul>

        <h2 style={s.h2}>What the app does not collect</h2>
        <p style={s.p}>
          The app does not collect, store or process any data about your customers. It
          requests only the <code style={s.code}>write_products</code> and{" "}
          <code style={s.code}>write_files</code> permissions, which do not grant access to
          orders, customers or payment information.
        </p>

        <h2 style={s.h2}>Your images</h2>
        <p style={s.p}>
          To optimize an image, the app downloads it from Shopify&rsquo;s CDN into memory,
          re-encodes it, uploads the smaller version back to your store, and discards the
          temporary copy. Your images are never written to disk on our servers and are never
          retained after the operation finishes.
        </p>

        <h2 style={s.h2}>Third parties the app shares data with</h2>
        <ul style={s.ul}>
          <li style={s.li}>
            <strong>OpenAI</strong> — when AI alt text is generated, the app sends the product
            title and a link to a reduced-size copy of the product image to OpenAI&rsquo;s API,
            which returns a written description. OpenAI retrieves the image from Shopify&rsquo;s
            CDN. This happens only for images you choose to caption, and only on plans that
            include the alt text feature. Handled under OpenAI&rsquo;s own privacy terms.
          </li>
          <li style={s.li}>
            <strong>Google PageSpeed Insights</strong> — when you run a page speed report, the
            app sends the public URL of the product page being tested to Google, which loads
            that page and returns performance measurements. Only public store URLs are sent.
          </li>
          <li style={s.li}>
            <strong>Shopify</strong> — the app reads and writes your product images, their alt
            text, and optimization records stored as product metafields, through Shopify&rsquo;s
            Admin API.
          </li>
        </ul>
        <p style={s.p}>
          Data is not sold, rented, or shared with anyone else. There is no advertising or
          analytics tracking in the app.
        </p>

        <h2 style={s.h2}>Where data is held</h2>
        <p style={s.p}>
          Application data is stored in a PostgreSQL database on servers operated on our
          behalf by our hosting provider. All traffic between your browser, Shopify and the
          app is encrypted with TLS.
        </p>

        <h2 style={s.h2}>How long data is kept</h2>
        <ul style={s.ul}>
          <li style={s.li}>
            Your session is deleted as soon as the app is uninstalled.
          </li>
          <li style={s.li}>
            All remaining data for your store — usage counts and settings — is deleted when
            Shopify sends its shop redaction request, which it does within 48 hours of
            uninstall.
          </li>
          <li style={s.li}>
            Image size cache entries hold only a URL and a byte count, contain no personal
            data, and are not associated with any store.
          </li>
        </ul>
        <p style={s.p}>
          The app implements Shopify&rsquo;s mandatory privacy webhooks for customer data
          requests, customer redaction and shop redaction.
        </p>

        <h2 style={s.h2}>Your rights</h2>
        <p style={s.p}>
          You can remove all of your data at any time by uninstalling the app. If you would
          like a copy of the data held about your store, or want it erased sooner, contact us
          and we will action the request.
        </p>

        <h2 style={s.h2}>Changes</h2>
        <p style={s.p}>
          If this policy changes, the date at the top of this page is updated. Material
          changes to how data is handled will be communicated to installed stores.
        </p>

        <h2 style={s.h2}>Contact</h2>
        <p style={s.p}>
          Questions about this policy or about your data:{" "}
          <a style={s.a} href={`mailto:${email}`}>{email}</a>
        </p>
      </div>
    </main>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "var(--ib-tint, #F5F7FF)",
    padding: "56px 24px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif",
    color: "var(--ib-body, #374151)",
    lineHeight: 1.65,
  },
  wrap: {
    maxWidth: 760,
    margin: "0 auto",
    background: "#FFFFFF",
    border: "1px solid var(--ib-border, #E2E8F5)",
    borderRadius: 16,
    padding: "40px 44px",
    boxShadow: "0 1px 2px rgba(17,24,39,0.05)",
  },
  eyebrow: {
    fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
    color: "var(--ib-accent, #2563EB)", margin: "0 0 10px 0",
  },
  h1: {
    fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em",
    color: "var(--ib-ink, #111827)", margin: "0 0 6px 0",
  },
  updated: { fontSize: 13, color: "var(--ib-muted, #6B7280)", margin: "0 0 28px 0" },
  h2: {
    fontSize: 17, fontWeight: 700, color: "var(--ib-ink, #111827)",
    margin: "30px 0 10px 0",
  },
  p: { fontSize: 15, margin: "0 0 14px 0" },
  ul: { margin: "0 0 14px 0", paddingLeft: 20 },
  li: { fontSize: 15, marginBottom: 10 },
  a: { color: "var(--ib-accent, #2563EB)" },
  code: {
    background: "var(--ib-soft-1, #EEF2FF)",
    padding: "1px 6px", borderRadius: 5, fontSize: 13,
  },
};
