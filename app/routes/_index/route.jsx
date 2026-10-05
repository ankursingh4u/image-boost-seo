import { redirect } from "react-router";
import styles from "./styles.module.css";

// Public landing page, shown when someone opens the app URL directly.
//
// There is deliberately NO "enter your shop domain" form here. App Store
// requirement 2.3.1 forbids asking a merchant to type their myshopify.com
// address: installation has to start from a Shopify surface and the shop must
// be identified through OAuth or a session token. The Shopify template ships
// that form by default and it had been carried over unchanged.
//
// The redirect below is the supported path — Shopify sends ?shop= when it
// opens the app, and that is forwarded into the embedded app with the rest of
// the parameters intact.
export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return null;
};

export default function App() {
  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>ImageBoost SEO</h1>
        <p className={styles.text}>
          Image optimization and SEO for Shopify stores. Compress product images,
          convert them to WebP, generate alt text, and track the page-speed gains.
        </p>
        <p className={styles.text}>
          Install ImageBoost SEO from the Shopify App Store to get started.
        </p>
        <ul className={styles.list}>
          <li>
            <strong>Smart image compression</strong>. Convert product images to WebP and
            replace the originals, keeping your image order intact.
          </li>
          <li>
            <strong>AI alt text</strong>. Generate SEO alt text for images that are missing
            it, then apply it in bulk.
          </li>
          <li>
            <strong>Performance reports</strong>. Track page speed and see the size saved
            across your catalog.
          </li>
        </ul>
        <p className={styles.text}>
          <a href="/privacy">Privacy policy</a>
        </p>
      </div>
    </div>
  );
}
