import { lazy, Suspense, useEffect } from "react";
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

const TITLES = {
  "/": "Orectic — The Operating System for Governed Intelligence",
  "/legacy": "Orectic — Product Preview (legacy)",
};

export default function App() {
  const path =
    typeof window !== "undefined"
      ? window.location.pathname.replace(/\/+$/, "") || "/"
      : "/";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = TITLES[path] || TITLES["/"];
    }
  }, [path]);

  if (path === "/legacy") {
    return (
      <Suspense fallback={null}>
        <LegacyProduct />
      </Suspense>
    );
  }
  return <OsSite />;
}
