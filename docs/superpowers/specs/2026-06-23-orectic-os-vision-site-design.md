# Orectic — OS / Company-Vision Site — Design Spec

- **Date:** 2026-06-23
- **Branch:** `sprint/orectic-os-vision-site` (worktree off `origin/main`)
- **Status:** built; preview-only (NOT for `main`/production)

## Decision

Repositioned `orectic.ai` from a product-funnel selling "oracle" → **Orectic = the operating system / parent construct** (company-vision site). **OVAE remains the product/acquisition surface** at `ovae.ai`. Operator chose the **split** model and a **company/vision-first** audience (investors, partners, enterprise, talent) on 2026-06-23. The OVAE-credibility layer is a separate later build.

Positioning source of truth: `~/projects/orectic/dossier-followups/dossiers/2026-06-23-ovae-orectic-positioning/DOSSIER.md`.

## Design direction

**"Blueprint"** — chosen from three mockups (A Foundation / B Blueprint / C Doctrine) in the dossier `mockups/` folder. Dark canvas (`#05060A`) + faint blueprint grid, Space Grotesk + IBM Plex Mono + Inter, copper (`#C98B72`) + steel + cyan signal (`#86C7D6`). Reads as serious infrastructure, not SaaS.

## Scope

- **Full replacement** of the homepage with the Blueprint OS site.
- **Legacy product-funnel page preserved** at `/legacy` (the prior `src/App.jsx`, moved to `src/legacy/LegacyProduct.jsx`).

## Information architecture (homepage)

Hero → **Construct** (doctrine / model / loop) → **Why now** (3 shifts) → **The Loop** (FIG.01 schematic: Intent → Governance → Execution → Proof → Learning) → **Products** (OVAE = first product) → **Proof** (Grounded / Cited / Governed) → **Company** (audience grid + about) → **Contact** (form).

## Routing

- `src/App.jsx` = dependency-free pathname router. `/` → `OsSite`; `/legacy` → lazy-loaded `LegacyProduct` (Three.js code-split, fetched only on `/legacy`).
- `vercel.json` SPA catch-all rewrite `"/((?!api/).*)" → "/index.html"` (excludes `/api`). Existing `/privacy` + `/terms` rewrites retained ahead of it.

## Contact

- Form (name, email, org, role, message) → `POST /api/contact`.
- `api/contact.js` (Vercel serverless): logs every submission; delivers via **Resend** when `RESEND_API_KEY` is set, otherwise returns `{ok:true, delivered:false}` so the form works in preview without secrets. Never swallows errors.
- Client falls back to a prefilled `mailto:hello@orectic.ai` if the endpoint fails.
- Env (set per-env in Vercel for real delivery): `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`.

## Guardrails (from the dossier — enforced in copy)

No pricing/packaging; no P3/AI-Native as present tense; **visible proof trail only** (no red-team / executable-spec / internal-governance "invisible" trail); no Meridian; no link to `ovae.ai/sprint`.

## Build / perf

`vite build` clean. Homepage chunk ~218 kB (67 kB gz); legacy + Three.js split to ~557 kB, loaded only on `/legacy`.

## Deploy posture

Feature branch → **Vercel preview deploys only**. **Never** merge to `main` or promote to production without explicit operator instruction.

## Follow-ups / known items

- Wire real email delivery (`RESEND_API_KEY`) when ready.
- `og-image.png` referenced in `index.html` is missing in `public/` (pre-existing on `main`).
- `src/legacy/LegacyProduct.jsx` carries pre-existing lint errors inherited from `main` (not introduced here); fix only if the legacy page is kept long-term.
