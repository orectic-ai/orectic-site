# ACTIVE SPRINT: Orectic.ai Website V3.1 — Full Rebuild

**Date:** March 13, 2026
**Mode:** FULL AUTONOMOUS EXECUTION — No stop gates. Run all 5 sprints end-to-end. Do not pause for approval between sprints.
**Repo:** `orectic-site` on GitHub (Orectic org)
**Branch:** `main` (push directly — Vercel auto-deploys)
**Scope:** ONLY touch files inside the `orectic-site` repo. Do NOT touch any other repo, folder, or project.

---

## CRITICAL CONSTRAINTS

1. **ONLY modify files in the orectic-site repo.** Do not touch pipeline code, dashboard code, or any other project.
2. **The site is a single-file React app.** All content lives in `src/App.jsx`. All meta lives in `index.html`. That's it.
3. **Preserve the existing design system exactly.** Colors, typography, animations, spacing patterns — do not change these. You are rebuilding CONTENT and STRUCTURE, not design.
4. **Every claim must be real.** If you're not sure a capability exists in production, use the conservative version documented in this spec.
5. **Run `npm run build` after all changes.** Push only if build passes clean.

---

## FILE STRUCTURE (existing — do not change structure)

```
orectic-site/
├── index.html          ← SEO meta, OG tags, JSON-LD (UPDATE)
├── vite.config.js      ← Do not touch
├── package.json        ← Do not touch
├── .gitignore          ← Do not touch
├── README.md           ← Do not touch
├── public/
│   ├── favicon.svg     ← Do not touch
│   ├── robots.txt      ← Do not touch
│   └── og-image.png    ← Do not touch
└── src/
    ├── main.jsx        ← Do not touch
    └── App.jsx         ← REBUILD THIS (all content lives here)
```

---

## DESIGN SYSTEM REFERENCE (preserve exactly)

### Colors
```javascript
const COLORS = {
  bg: '#08080f',
  bgSecondary: '#0e0e1a',
  bgCard: '#111122',
  bgElevated: '#1a1a2e',
  purple900: '#1e0a3e',
  purple700: '#3b1764',
  purple500: '#6b21a8',
  purple400: '#9333ea',
  purple300: '#a855f7',
  purpleGlow: 'rgba(107, 33, 168, 0.15)',
  gold500: '#c9a84c',
  gold400: '#d4a853',
  gold300: '#e8c878',
  gold200: '#f0dca0',
  goldMuted: 'rgba(212, 168, 83, 0.12)',
  goldGlow: 'rgba(212, 168, 83, 0.2)',
  textPrimary: '#f0ecf7',
  textSecondary: '#a8a0b8',
  textMuted: '#6b6580',
  textDim: '#4a4460',
  borderDefault: 'rgba(212, 168, 83, 0.08)',
  borderHover: 'rgba(212, 168, 83, 0.2)',
  borderActive: 'rgba(212, 168, 83, 0.35)',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  white: '#ffffff',
};
```

### Typography
- **Display/Headlines:** `'Playfair Display', Georgia, serif`
- **Body:** `'DM Sans', -apple-system, sans-serif`
- **Technical/Labels:** `'JetBrains Mono', monospace`
- Load from Google Fonts CDN (already in index.html)

### Animations (preserve these exact patterns)
- **Scroll reveal:** IntersectionObserver at 15% threshold, translateY 40px→0, opacity 0→1, 800ms duration, 100-150ms stagger on children
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)`
- **Hover states:** Cards lift -3px with border glow, CTAs lift -1px, nav links shift to gold. All 300ms ease.
- **Oracle breathing glow:** opacity 0.1→0.2 over 4s infinite (gold) — only looping animation
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` — instant opacity 200ms, no transforms, no pulse

### Responsive Breakpoints
- **Mobile (375px):** Single column, stacked CTAs, 48px headline
- **Tablet (768px):** 2-column grids, 56px headline
- **Desktop (1440px):** 3-column grids, 7/5 asymmetric hero, 80px headline, 120px outer margins

### Layout Grammar
- Editorial feel: asymmetric grids (7/5 splits), left-heavy text, staggered vertical rhythm
- Reference: Bloomberg Businessweek / Monocle, NOT Vercel homepage
- Cards: subtle gold border on hover, elevated background
- Section spacing: generous — each section should breathe

---

## COMPLETE SECTION SPEC (13 sections — build in this exact order)

### SECTION 1: Nav (Sticky)

```
[Orectic Logo (gradient O + wordmark)]     How It Works | Pricing | Login     [Book a Discovery Sprint] (gold button)
```

- Logo: Gradient purple→gold "O" mark + "ORECTIC" wordmark in Playfair Display
- Nav links: "How It Works" (anchor #how-it-works), "Pricing" (anchor #pricing), "Login" (external link to https://app.orectic.ai)
- CTA button: "Book a Discovery Sprint" → Calendly link (search for existing Calendly URL in current App.jsx and preserve it exactly)
- Sticky on scroll, background blur on scroll (backdrop-filter: blur(12px))
- "For Investors →" subtle link, right-aligned near CTA or in secondary nav row, anchor-scrolls to #platform section

### SECTION 2: Hero

**Headline:** "Your best thinking is trapped in files nobody will ever open again."
- Playfair Display, large (80px desktop / 56px tablet / 48px mobile), textPrimary color
- "trapped" in italics for emphasis

**Subhead:** "We extract it. Structure it. And deploy an Oracle that acts on it."
- DM Sans, textSecondary, smaller than headline
- "acts on it" in gold400 color for emphasis

**Tagline (small, beneath subhead, textMuted):** "If your business created it, your Oracle can learn from it."

**Primary CTA:** "Book a Discovery Sprint →" (gold button, large)
**Secondary CTA:** "See how it works ↓" (text link, textSecondary, anchor to #how-it-works)

**Stats bar (3 items, horizontal row, JetBrains Mono for numbers):**
1. **748** — "relationships mapped from one client"
2. **48hr** — "from intake to live Oracle"
3. **Every file type.** — "Every source."

### SECTION 3: Problem — "The Intelligence Gap"

**Section label:** JetBrains Mono, small, gold400, "THE PROBLEM"
**Headline:** "Every conversation, document, and file you've ever created contains intelligence you've never extracted."

Three cards with staggered vertical layout (middle card offset higher):

**Card 1 — Scattered**
"Recordings. Documents. Messages. Spreadsheets. Decks. Videos. Dozens of sources that have never talked to each other."
- Fragment list style. Each word could be its own visual beat.

**Card 2 — Invisible**
"Hundreds of conversations happened. Zero intelligence was extracted."
- Past tense = forensic finding tone.

**Card 3 — Inert**
"Your data doesn't act."
- Four words. Maximum impact. Largest font of the three cards.

### SECTION 4: Proof Points

**Section label:** JetBrains Mono, small, gold400, "PROOF"
**Headline:** "What one extraction looks like."

**3 large metrics (Playfair Display, very large numbers, gold400 color):**

- **748** — "relationships identified and cross-referenced"
- **1,453** — "opportunities mapped with progression tracking"
- **262** — "commitments tracked with accountability signals"

**Subtext (DM Sans, textSecondary):** "From 244 files across 9 source types — in a single engagement."

**CTA bridge (DM Sans, textMuted, italic):** "This is what 30 minutes and a Discovery Sprint produces."

Visual treatment: Bloomberg terminal readout feel — data-forward, no fluff, numbers dominate.

### SECTION 5: How It Works {#how-it-works}

**Section label:** JetBrains Mono, small, gold400, "HOW IT WORKS"
**Headline:** "From chaos to Oracle in four steps."

4-step vertical timeline or horizontal stepper:

**Step 1 — Discovery Sprint**
Title: "Discovery Sprint"
Description: "30 minutes. We map your intelligence landscape."
Icon/visual: Calendar or compass motif

**Step 2 — The Extraction**
Title: "The Extraction"
Description: "Every file processed into 16 categories of structured intelligence."
Subtext (smaller, muted, styled as a secondary block — NOT inline): "Calls, contracts, proposals, Slack threads, CRM exports, Loom recordings, PDFs, spreadsheets, slide decks, voice memos — all of it."
Icon/visual: Convergence/funnel motif

**Step 3 — Oracle Deployed**
Title: "Oracle Deployed"
Description: "Your Oracle goes live where you already communicate."
Icon/visual: Message/conversation motif

**Step 4 — Command Center**
Title: "Command Center"
Description: "Search, explore, and act on everything your business knows."
Icon/visual: Dashboard/grid motif

Between Step 2 description and subtext, add a single-line differentiator (DM Sans, textSecondary): "Not a meeting summary. Not a search tool. Intelligence extracted from every source, cross-referenced into a knowledge graph no single tool can build."

### SECTION 6: Pricing {#pricing}

**Section label:** JetBrains Mono, small, gold400, "INVESTMENT"

**Framing line above all cards (DM Sans, textSecondary, centered):** "Most clients invest $2,000–6,000/month depending on business size and data complexity."

**Three cards side by side (Growth has gold border accent):**

---

**STARTER CARD:**
- First line (small, textMuted): "For businesses doing $500K–2M in revenue"
- Tier name (Playfair Display, medium): "Your first Oracle"
- Price (large, textPrimary): "$1,500/month"
- Deployment (smaller, textSecondary): "$5,000 one-time deployment"
- Labor callout (small, gold400): "10:1 ROI — replaces a $41K/year role"
- Divider line
- Features (DM Sans, textSecondary, compact list):
  - Full 16-category extraction (up to 500 sources, any file type)
  - Command Center dashboard
  - Oracle via messaging
  - 48-hour SLA
- CTA: "Book a Discovery Sprint →" (outlined button)

---

**GROWTH CARD (FEATURED — gold border, slightly elevated):**
- First line (small, textMuted): "For businesses doing $2M–15M in revenue"
- Tier name (Playfair Display, medium): "Full intelligence operations"
- Price indication (DM Sans, textSecondary): "Typically $4,000–6,000/month"
- Labor callout (small, gold400): "4:1 ROI — replaces $220K–340K/year across CoS, department heads, and EA roles"
- Divider line
- Features:
  - Everything in Starter
  - Unlimited source processing across all file types
  - Multi-integration ingestion
  - Advanced Oracle skills: meeting prep, commitment tracking, opportunity recovery
  - Context engine with three-source triangulation
  - Custom skill library
  - 24-hour SLA
- CTA: "Scoped in your Discovery Sprint →" (gold filled button, links to Calendly)

---

**SCALE CARD:**
- First line (small, textMuted): "For businesses doing $15M+ in revenue"
- Tier name (Playfair Display, medium): "Enterprise command center"
- Price indication (DM Sans, textSecondary): "Custom — scoped in your Discovery Sprint"
- Labor callout (small, gold400): "5:1 ROI — replaces $470K–950K/year in ops teams, tools, and consulting"
- Divider line
- Features:
  - Everything in Growth
  - Multi-department deployment
  - Multiple Oracle instances
  - Contradiction detection across sources
  - Competitive signal routing
  - Dedicated vertical calibration
  - Same-day SLA
  - Monthly strategic review
- CTA: "Scoped in your Discovery Sprint →" (outlined button)

---

**FAQ accordion below pricing (8 items):**

**Q: What is The Extraction?**
A: "We process every file your business has ever created — recordings, documents, messages, spreadsheets, contracts, videos — into 16 categories of structured intelligence. Not summaries. Structured, searchable, actionable intelligence your Oracle uses to know your business."

**Q: How quickly does my Oracle go live?**
A: "48 hours from intake completion to first intelligence delivery. Not 48 hours to a demo — 48 hours to a working Oracle with your actual data."

**Q: What data sources can you process?**
A: "Everything. PDFs, Word docs, slide decks, spreadsheets, call recordings, Loom videos, voice memos, Slack exports, email threads, CRM dumps, Notion exports, calendar data, contracts, proposals — 17 file types and growing. If your business created it, your Oracle can learn from it."

**Q: Do I need to change my tools?**
A: "No. Your Oracle integrates with the tools you already use and ingests data from sources you don't have integrations for. Drop a folder of files from 2019. Upload a CRM export. Record a Loom walkthrough. It all becomes intelligence."

**Q: What's the deployment fee?**
A: "A one-time investment that covers extracting your intelligence and configuring your Oracle. Think of it as the difference between installing software and deploying an intelligence function. The Extraction alone is often worth more than the fee."

**Q: Can I try it before committing?**
A: "We'll process a sample of your actual data during the Discovery Sprint. You'll see your own intelligence — your people, your opportunities, your commitments — extracted from your own files before you decide anything. If it's not useful, you've lost 30 minutes. If it is, you've found your Oracle."

**Q: What if I want to bring my own API keys?**
A: "Available as a monthly cost modifier within any tier. We'll discuss during your Discovery Sprint."

**Q: How is this different from Fathom, Gong, Notion AI, etc.?**
A: "They summarize meetings or search within one workspace. We extract intelligence across everything — calls, documents, messages, spreadsheets, contracts, videos — cross-reference it into a unified knowledge graph, and deploy an Oracle that acts on it. They help you remember one meeting. We help you operate across your entire business history."

### SECTION 7: PRIMARY CTA

Centered block. Gold accent border or subtle gold glow.

**Headline (Playfair Display, large):** "Ready to see your own intelligence?"

**Subtext (DM Sans, textSecondary):** "Book a Discovery Sprint — 30 minutes. We process your real data. You see your own intelligence before deciding anything."

**CTA button (large, gold, filled):** "Book a Discovery Sprint →" (links to Calendly)

This is the natural conversion point. Everything above this is the sales funnel. Everything below is deep-scroll content for engaged visitors and investors.

---

### ═══ DEEP SCROLL (below primary CTA) ═══

---

### SECTION 8: Oracle Demo

**Section label:** JetBrains Mono, small, gold400, "YOUR ORACLE"
**Headline:** "Ask your Oracle anything."

Simulated chat interface (dark card background, rounded corners, subtle border):

**User message bubble:**
"What pricing frameworks have I used across my last 20 client proposals and calls?"

**Oracle response bubble (with gold Oracle indicator/avatar):**
```
Based on 14 relevant sources (6 proposals, 5 call recordings, 3 internal documents):

Your primary pricing framework is Value-Based Anchoring.

Most recent usage:
📄 "Acme Corp Proposal Q4.pdf" — anchored at 3x implementation cost, 
   discounted to 2.2x for annual commitment
🎙️ Call with Sarah Chen (Nov 14) — "I always start at the value number, 
   not the cost number"
📄 "Enterprise Pricing Template.docx" — standardized 3-tier structure 
   with 15% annual discount

Also frequently used: Tiered Commitment Ladder (8 occurrences) and 
ROI Guarantee Frame (3 occurrences, increasing in recent months).

Sources span: Q3 2024 — present
```

**Key design notes:**
- The response MUST show citations from different file types (📄 PDF + 🎙️ call recording + 📄 document). This is the cross-source synthesis proof.
- Use emoji or small icons to differentiate source types visually
- Oracle avatar/indicator should have the gold breathing glow animation
- The response should feel real — not a marketing mockup. Use realistic file names, realistic dates, realistic language.

### SECTION 9: Vertical Replication

**Section label:** JetBrains Mono, small, gold400, "PROVEN ACROSS INDUSTRIES"
**Headline:** "Deployed from the same platform."

Three cards — each with a DIFFERENT visual structure to prevent pattern fatigue:

**Card 1 — Creator & Coach Intelligence**
"Every framework you've taught, every client proposal you've written, every objection you've handled on camera. Searchable. Actionable. In your voice."
- Visual emphasis: italic "In your voice" as the emotional anchor
- Style: text-forward, minimal, editorial

**Card 2 — B2B Sales Intelligence**
"748 people. 1,453 opportunities. 262 commitments. Across call recordings, CRM exports, email threads, and proposal documents. Not just what was said — what was written, promised, and committed."
- Visual emphasis: the three numbers should be large/bold, rest is supporting text
- Style: data-forward, proof-heavy

**Card 3 — Trades & Contracting Intelligence**
"Job bids, supplier contracts, crew communications, project docs — the intelligence running your business, extracted from every format it lives in."
- Visual emphasis: the em dash creates a natural pause before the payoff
- Style: industry-specific language, grounded

### SECTION 10: Integrations

**Section label:** JetBrains Mono, small, gold400, "UNIVERSAL INGESTION"
**Headline:** "Your Oracle ingests everything. Not just meetings."

**Primary visual: Convergence funnel** — file types flowing into a single extraction point:

Left side (source types, scattered/staggered, textSecondary):
```
PDFs
Slide Decks
Spreadsheets
Call Recordings
Loom Videos
Voice Memos
Slack Exports
Email Threads
CRM Data
Contracts
```

Center: Arrow/flow visual converging to a single point labeled "The Extraction"

Right side: "Your Oracle" with gold glow

**Below the funnel:** Grid of integration logos/icons (smaller, supporting):
Zoom, Fathom, Gong, Slack, Gmail, Google Drive, Notion, Dropbox, HubSpot, Loom, Audio, Custom API

**Subtext:** "17 file types and growing. If your business created it, your Oracle can learn from it."

### SECTION 11: The Platform {#platform}

**Section label:** JetBrains Mono, small, gold400, "THE PLATFORM"
**Headline (Playfair Display):** "Your intelligence compounds."

4 proof points in editorial 2-column layout (text left, subtle visual element right):

**1. "Every extraction improves the system."**
"Intelligence isn't static. Each new source processed deepens the cross-references, surfaces patterns across a longer timeline, and teaches your Oracle more about how your business actually operates."

**2. "Your data. Only your data."**
"Your Oracle never sees another client's information — by architecture, not by policy. Isolation is enforced at the infrastructure level, not the permission level."

**3. "Infrastructure that grows with you."**
"Cloud-native architecture designed for thousands of tenants. Adding sources, users, or departments doesn't require new infrastructure — it just works."

**4. "Every industry makes the next one smarter."**
"Each vertical we deploy into makes the next deployment faster and more accurate. The 50th deployment costs a fraction of the first. Your Oracle benefits from everything the platform has learned."

### SECTION 12: Final CTA

Centered block. Oracle breathing gold glow animation (the animated O mark).

**Headline (Playfair Display, large):** "Your intelligence is waiting."

**Subtext (DM Sans, textSecondary):** "30 minutes. No obligation. We'll process a sample of your real data — you'll see your own intelligence before you decide anything."

**CTA button (large, gold, filled):** "Book a Discovery Sprint →" (links to Calendly)

**Below button (small, textMuted):** "isaiah@orectic.ai · Austin, TX"

**Below that (smaller, textDim):** "Already talked to us? Log in →" (links to https://app.orectic.ai)

### SECTION 13: Footer

```
© 2026 Orectic · orectic.ai · Austin, TX
Privacy | Terms
```

- Privacy and Terms are placeholder links (href="#") for now
- Minimal. One line. No footer bloat.

---

## INDEX.HTML UPDATES

Replace the existing `<head>` meta content with:

```html
<title>Orectic — AI Operating System for Business Intelligence</title>
<meta name="description" content="Orectic extracts intelligence from every file your business has ever created — calls, documents, messages, spreadsheets, contracts, video — and deploys an autonomous Oracle that acts on it. Starting at $1,500/month." />

<!-- Open Graph -->
<meta property="og:title" content="Orectic — Your Business Deserves an Oracle" />
<meta property="og:description" content="We extract intelligence from 17 source types and deploy an Oracle that knows everything your business knows. 748 relationships mapped from a single client. Starting at $1,500/month." />
<meta property="og:image" content="/og-image.png" />
<meta property="og:url" content="https://orectic.ai" />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Orectic — Your Business Deserves an Oracle" />
<meta name="twitter:description" content="Intelligence extraction across 17 source types. Autonomous Oracle agents. Starting at $1,500/month." />
<meta name="twitter:image" content="/og-image.png" />

<!-- Canonical -->
<link rel="canonical" href="https://orectic.ai" />
```

Add JSON-LD structured data before closing `</head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Orectic",
  "url": "https://orectic.ai",
  "description": "AI Operating System for Business Intelligence — universal intelligence extraction across every file type, deployed as an autonomous Oracle agent",
  "foundingDate": "2026",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Austin",
    "addressRegion": "TX",
    "addressCountry": "US"
  }
}
</script>
```

Preserve all existing Google Fonts `<link>` tags. Preserve existing favicon reference. Preserve existing viewport meta.

---

## TERMINOLOGY ENFORCEMENT

Before pushing, search the entire `App.jsx` for these terms and replace:

| If You Find | Replace With |
|---|---|
| chatbot, AI assistant, bot | Your Oracle / an Oracle |
| data processing, data mining | intelligence extraction |
| setup fee, onboarding fee | deployment fee (or "one-time deployment") |
| dashboard (in customer-facing copy) | Command Center |
| demo, free consultation | Discovery Sprint |
| call intelligence, meeting intelligence | intelligence from every source |
| your calls, your transcripts | your data / your files / your sources |
| calls and docs | recordings, documents, and messages |
| your meeting recordings | every file your business has created |
| serverless | cloud-native |
| Cloudflare, Workers, R2, KV | (remove entirely — never expose) |
| Agent SDK, MCP | (remove entirely) |
| Haiku, Sonnet, Claude | (remove entirely as infrastructure references) |
| OpenClaw | (remove entirely — dead) |
| VPS, Xavier | (remove entirely — retired) |
| Telegram | "where you already communicate" |
| Supabase, Prisma, Clerk | (remove entirely) |

---

## EXECUTION SEQUENCE

Run all 5 sprints sequentially. No stop gates. Do not pause for approval.

### Sprint 1: Rebuild App.jsx Content
- Rebuild `src/App.jsx` with all 13 sections per this spec
- Preserve the existing React component structure pattern (single default export, inline styles, IntersectionObserver scroll animations)
- Preserve the existing Calendly link (search current file for the URL and reuse it exactly)
- Preserve the existing Google Fonts imports in the `<style>` tag
- Ensure all section IDs are set for nav anchor scrolling (#how-it-works, #pricing, #platform)

### Sprint 2: New Components
- Build the convergence funnel visual (Section 10) — can be SVG or CSS, whatever renders cleanly
- Build the simulated chat interface for Oracle Demo (Section 8) — dark card, user/oracle bubbles, source type icons
- Build the FAQ accordion (Section 6) — click to expand/collapse, smooth animation
- Build the Proof Points large-number display (Section 4) — Bloomberg terminal feel

### Sprint 3: SEO & Meta
- Update `index.html` with all meta tags per the spec above
- Add JSON-LD structured data
- Verify OG tags are correctly formatted

### Sprint 4: Responsive & Polish
- Verify all 13 sections render correctly at 375px / 768px / 1440px
- Ensure scroll animations fire on all new sections (same IntersectionObserver pattern as existing sections)
- Pricing cards: Growth card has gold border, cards stack on mobile
- Stats bar: horizontal on desktop, stacked on mobile
- Convergence funnel: simplified on mobile (vertical list → single point)
- Oracle Demo chat: full width on mobile, constrained width on desktop
- FAQ accordion: full width on all breakpoints

### Sprint 5: Build, Verify, Push
- Run `npm run build` — must pass clean with zero errors
- Run the terminology check: search for every "never say" term in the file and confirm zero occurrences
- Verify the Calendly link is correct and not broken
- Verify https://app.orectic.ai link is correct in Login nav item
- Commit with message: `V3.1 rebuild — universal intelligence positioning, GENESIS pricing, cross-source Oracle demo, investor signal, data-agnostic copy`
- Push to `main`
- Vercel auto-deploys. Done.

---

## WHAT SUCCESS LOOKS LIKE

After push, orectic.ai should:
- Load with the new hero: "Your best thinking is trapped in files nobody will ever open again."
- Show 3 proof point numbers (748 / 1,453 / 262) with real extraction context
- Display 4-step How It Works with the long file type list in Step 2
- Show 3 pricing tiers with Growth featured, framing line above, labor ROI callouts
- Primary CTA appears after pricing (position 7) AND at bottom (position 12)
- Oracle Demo shows cross-source query with citations from PDF + call recording + document
- Vertical cards show 3 different industries with different copy structures
- Integrations section shows convergence funnel visual
- The Platform section reads as durability/compounding to prospects, infrastructure maturity to investors
- "For Investors →" link in nav scrolls to The Platform section
- "Login" link in nav goes to app.orectic.ai
- All meta tags and OG tags updated for social sharing
- Zero occurrences of: chatbot, data processing, setup fee, OpenClaw, VPS, Cloudflare, Telegram, Supabase, Prisma, Clerk, call intelligence, meeting intelligence
- Mobile responsive at all breakpoints
- Build passes clean

---

*Full send. No gates. Rip it.*
