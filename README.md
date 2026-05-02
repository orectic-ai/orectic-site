# Orectic Site

Public marketing site for Orectic. This repo is a Vite + React app with Three.js used in the single-page experience. It is the customer-facing `orectic.ai` surface, not the dashboard, pipeline, runtime, knowledge graph, or brand/governance source of truth.

## Current Audit Status

This README is aligned to the branch-bound Orectic audit dated 2026-04-29.

- Local path: `/Users/IsaiahZimmerman/projects/orectic/orectic-site`
- Remote: `orectic-ai/orectic-site`
- Branch: `main`
- Audit HEAD: `ce768a0`
- Authority class: `canonical-product`
- Role in platform manifest: public marketing site
- Audit note: local and GitHub default were reported aligned at audit time; this repo had an unrelated untracked `.claude/architecture/opportunities/` surface before this README edit.

The audit artifacts live outside this repo at:

- `/Users/IsaiahZimmerman/Documents/Playground/orectic-filesystem-map-2026-04-29.md`
- `/Users/IsaiahZimmerman/Documents/Playground/orectic-audit-artifacts-2026-04-29/`

Those artifacts are labels and maps only. They are not instructions to move files.

## Repository Map

```text
orectic-site/
|-- .claude/
|   |-- agent-reports/
|   |-- architecture/
|   |   |-- reports/2026-03-13-v3.1-rebuild.md
|   |   `-- ...
|   `-- sprints/archive/
|-- .github/workflows/
|   |-- claude-code-review.yml
|   `-- claude.yml
|-- public/
|   |-- favicon.svg
|   |-- privacy.html
|   |-- robots.txt
|   `-- terms.html
|-- src/
|   |-- App.jsx
|   `-- main.jsx
|-- CLAUDE.md
|-- README.md
|-- active_website_v3.1.md
|-- eslint.config.js
|-- index.html
|-- package-lock.json
|-- package.json
|-- vercel.json
`-- vite.config.js
```

Generated or local dependency surfaces such as `dist/`, `node_modules/`, `.git/`, and `.vercel/` may exist locally but are not source-authority surfaces for product content.

## Source Surfaces

- `src/App.jsx` is the main marketing-page implementation. It currently imports React hooks and `three`, centralizes the Calendly URL, and contains the public page content and interaction code.
- `src/main.jsx` mounts the app into `#root`.
- `index.html` owns SEO metadata, Open Graph/Twitter metadata, the canonical URL, favicon link, and JSON-LD organization data.
- `vite.config.js` configures Vite.
- `eslint.config.js` configures linting.
- `package.json` and `package-lock.json` are dependency and script authority for the Vite/React/Three app.
- `active_website_v3.1.md` is the March 13, 2026 rebuild sprint spec and should be read as historical execution context unless a newer sprint is explicitly added.
- `.claude/architecture/reports/2026-03-13-v3.1-rebuild.md` is the after-action report for the V3.1 rebuild.

## Scripts

The available scripts are exactly the scripts declared in `package.json`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

- `dev`: `vite`
- `build`: `vite build`
- `lint`: `eslint .`
- `preview`: `vite preview`

No separate Three.js script exists. Three.js is a runtime dependency used by the React app.

## Authority Files

Read these before changing product content or repo behavior:

- `CLAUDE.md`: repo constitution. It defines the marketing-site purpose, Orectic-only IP boundary, Vite/React/Vercel stack, and cautions against credential commits or unauthorized deploys.
- `package.json`: script and dependency authority.
- `package-lock.json`: installed dependency lock authority.
- `active_website_v3.1.md`: historical full-rebuild spec for the current V3.1 site shape.
- `.claude/architecture/reports/2026-03-13-v3.1-rebuild.md`: rebuild completion report and verification notes.
- `vercel.json`: static route rewrites for legal pages.
- `index.html`: public metadata authority.
- `public/privacy.html` and `public/terms.html`: legal-page content served from static public files.

## Public, Legal, and Static Surfaces

The public static directory currently contains:

- `public/favicon.svg`
- `public/privacy.html`
- `public/robots.txt`
- `public/terms.html`

`vercel.json` rewrites these routes:

- `/privacy` -> `/privacy.html`
- `/privacy-policy` -> `/privacy.html`
- `/terms` -> `/terms.html`
- `/terms-of-service` -> `/terms.html`

`index.html` references `/og-image.png`, but no `public/og-image.png` appears in the current source map. Treat that as a public/static asset gap to verify before changing metadata or launch materials.

## Deployment Notes

This repo is configured for Vercel deployment as a Vite project. The existing README noted that Vercel should auto-detect Vite, build the site, and serve `orectic.ai` / `www.orectic.ai` after domain setup.

Preserved repo-local deploy assumptions:

- Build command is the package script `npm run build`.
- Vercel route rewrites are declared in `vercel.json`.
- Domain setup belongs in the Vercel dashboard and DNS provider, not in source files.
- Do not deploy from this repo without explicit operator instruction.

## Relationship to Other Orectic Repos

This repo presents the public marketing surface. It should reference platform capabilities conservatively and should not become the implementation home for other systems.

- Dashboard: `/Users/IsaiahZimmerman/projects/orectic/dashboard` is the canonical product dashboard repo. The site links to `https://app.orectic.ai` but does not own dashboard implementation, auth, database, or product UI.
- Pipeline: `/Users/IsaiahZimmerman/projects/orectic/pipeline` is the canonical extraction/indexing/intelligence pipeline. Marketing claims about extraction should be checked against pipeline truth before publication.
- Hermes runtime: `/Users/IsaiahZimmerman/projects/orectic/hermes-runtime` is the active runtime/oracle/factory surface. Do not document legacy runtime behavior as current unless verified there.
- Knowledge graph: `/Users/IsaiahZimmerman/projects/orectic/orectic-knowledge` is the canonical knowledge graph, vault, MCP/API, and manifest surface. The April 29 audit says generated KG maps/stats may be stale and should not be treated as current without regeneration.
- OrecticOS and skills: `/Users/IsaiahZimmerman/projects/orectic/orectic-os` and `/Users/IsaiahZimmerman/projects/orectic/orectic_skills` are governance and methodology surfaces. Do not copy skills or governance docs into the site.
- Brand, funding, legal, IP, and archive docs: `Formation Documentation/`, `orectic_funding/`, `ip-registry-intake/`, `archive/`, and related handoff folders are evidence/brand/legal archives. Reference them as inputs, not as files to consolidate into this repo.

## Path-Bound Cautions

The April 29 audit found the Orectic workspace is path-bound by design. Many governance, sprint, skill, manifest, and knowledge-graph surfaces hardcode paths under `/Users/IsaiahZimmerman/projects/orectic`.

For this repo:

- Do not move this directory as part of README or docs cleanup.
- Do not move `.claude/`, `public/`, `src/`, or deploy config files.
- Do not copy dashboard, pipeline, runtime, KG, or skill files into the site to "consolidate" context.
- Do not edit generated/local dependency output as source truth.
- Do not include secrets, environment values, tokens, credentials, private keys, or sensitive personal details in docs.
- Treat `.vercel/` as local Vercel linkage metadata, not general documentation.

## Consolidation Notes

The correct consolidation move for this repo is documentation clarity, not filesystem restructuring.

- Keep `orectic-site` as the public marketing surface.
- Keep implementation ownership for dashboard, pipeline, Hermes runtime, KG, and skills in their own repos.
- Use audit manifests and README labels to reduce duplicate-looking confusion.
- Verify public claims against the product repos before changing sales copy.
- Preserve legal/static routes while checking missing public assets such as `og-image.png`.
- Future cleanup should prefer manifests, authority labels, and generated indexes over physical moves.
