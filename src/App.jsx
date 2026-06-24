import { lazy, Suspense } from "react";
import OsSite from "./os/OsSite.jsx";

/*
 * Dependency-free pathname router.
 *   /          -> OsSite        (Orectic = the operating system / company-vision site)
 *   /legacy    -> LegacyProduct (the previous product-funnel page, preserved)
 *
 * LegacyProduct is lazy-loaded so its Three.js bundle is code-split and only
 * fetched when someone actually visits /legacy — the homepage stays lean.
 * Client routes are served index.html via the SPA catch-all rewrite in vercel.json.
 */
const LegacyProduct = lazy(() => import("./legacy/LegacyProduct.jsx"));

export default function App() {
  const path =
    typeof window !== "undefined"
      ? window.location.pathname.replace(/\/+$/, "") || "/"
      : "/";

  if (path === "/legacy") {
    return (
      <Suspense fallback={null}>
        <LegacyProduct />
      </Suspense>
    );
  }
  return <OsSite />;
}
