import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════ */
const C = {
  bg: "#08080f",
  bg2: "#0e0e1a",
  card: "#111122",
  elevated: "#1a1a2e",
  p900: "#1e0a3e",
  p700: "#3b1764",
  p500: "#6b21a8",
  p400: "#9333ea",
  p300: "#a855f7",
  pGlow: "rgba(107,33,168,0.15)",
  g500: "#c9a84c",
  g400: "#d4a853",
  g300: "#e8c878",
  g200: "#f0dca0",
  gMuted: "rgba(212,168,83,0.10)",
  gGlow: "rgba(212,168,83,0.18)",
  t1: "#f0ecf7",
  t2: "#a8a0b8",
  t3: "#6b6580",
  t4: "#4a4460",
  border: "rgba(212,168,83,0.08)",
  borderH: "rgba(212,168,83,0.2)",
  borderA: "rgba(212,168,83,0.35)",
};

const FONT = {
  d: "'Playfair Display', Georgia, serif",
  b: "'DM Sans', -apple-system, sans-serif",
  m: "'JetBrains Mono', monospace",
};

const CAL = "https://calendly.com/isaiahzimmerman/one-on-one";

/* ═══════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════ */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ═══════════════════════════════════════════
   PRIMITIVES
   ═══════════════════════════════════════════ */
function Reveal({ children, delay = 0, y = 40, style = {} }) {
  const [ref, v] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? "none" : `translateY(${y}px)`,
      transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

function Label({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.g400, boxShadow: `0 0 10px ${C.g400}` }} />
      <span style={{ fontFamily: FONT.m, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: C.g400 }}>{children}</span>
    </div>
  );
}

function GoldLine({ width = 50, delay = 0 }) {
  const [ref, v] = useReveal();
  return (
    <div ref={ref} style={{
      height: 1.5, background: `linear-gradient(90deg, ${C.g400}, transparent)`,
      width: v ? width : 0, transition: `width 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      margin: "20px 0",
    }} />
  );
}

function Btn({ children, primary = true, href = CAL, style: s = {} }) {
  const [hov, setHov] = useState(false);
  const base = primary
    ? {
        background: hov ? C.g300 : `linear-gradient(135deg, ${C.g500}, ${C.g300})`,
        color: C.bg, fontWeight: 600,
        boxShadow: hov ? `0 6px 32px ${C.gGlow}` : `0 4px 20px rgba(212,168,83,0.15)`,
      }
    : {
        background: "transparent", color: hov ? C.g400 : C.t2,
        border: `1px solid ${hov ? C.g400 : C.border}`,
      };
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-block", fontFamily: FONT.m, fontSize: 12, letterSpacing: 1.5,
        textTransform: "uppercase", textDecoration: "none", padding: "15px 30px",
        borderRadius: 8, transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        transform: hov ? "translateY(-2px)" : "none", cursor: "pointer", ...base, ...s,
      }}
    >{children}</a>
  );
}

/* ═══════════════════════════════════════════
   SECTION 1: NAV
   ═══════════════════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    ["How It Works", "#how-it-works"],
    ["Pricing", "#pricing"],
    ["Login", "https://app.orectic.ai"],
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(24px, 5vw, 120px)",
        background: scrolled ? "rgba(8,8,15,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "all 0.5s ease",
      }}>
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: `linear-gradient(135deg, ${C.p500}, ${C.g400})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: FONT.d,
          }}>O</div>
          <span style={{ fontFamily: FONT.d, fontSize: 21, fontWeight: 600, color: C.t1, letterSpacing: 0.5 }}>ORECTIC</span>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="nav-desktop">
          {links.map(([label, href]) => (
            <a key={label} href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              style={{
                fontFamily: FONT.m, fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
                color: C.t3, textDecoration: "none", transition: "color 0.3s",
              }}
              onMouseEnter={e => e.target.style.color = C.g400}
              onMouseLeave={e => e.target.style.color = C.t3}
            >{label}</a>
          ))}
          <a href="#platform" style={{
            fontFamily: FONT.m, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase",
            color: C.t4, textDecoration: "none", transition: "color 0.3s",
          }}
          onMouseEnter={e => e.target.style.color = C.g400}
          onMouseLeave={e => e.target.style.color = C.t4}
          >For Investors →</a>
          <Btn href={CAL} style={{ padding: "10px 22px" }}>Book a Discovery Sprint</Btn>
        </div>

        <button onClick={() => setDrawer(!drawer)} className="nav-mobile"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "none" }}
          aria-label="Toggle navigation"
        >
          <div style={{ width: 22, height: 2, background: C.g400, marginBottom: 5, transition: "all 0.3s",
            transform: drawer ? "rotate(45deg) translateY(7px)" : "none" }} />
          <div style={{ width: 22, height: 2, background: C.g400, marginBottom: 5, opacity: drawer ? 0 : 1, transition: "all 0.3s" }} />
          <div style={{ width: 22, height: 2, background: C.g400, transition: "all 0.3s",
            transform: drawer ? "rotate(-45deg) translateY(-7px)" : "none" }} />
        </button>
      </nav>

      {drawer && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99, background: "rgba(8,8,15,0.97)",
          backdropFilter: "blur(30px)", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 32,
        }} onClick={() => setDrawer(false)}>
          {links.map(([label, href]) => (
            <a key={label} href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              style={{ fontFamily: FONT.d, fontSize: 28, color: C.t1, textDecoration: "none" }}
            >{label}</a>
          ))}
          <a href="#platform" style={{ fontFamily: FONT.m, fontSize: 14, color: C.t4, textDecoration: "none" }}>For Investors →</a>
          <Btn href={CAL}>Book a Discovery Sprint →</Btn>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   SECTION 2: HERO
   ═══════════════════════════════════════════ */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 150); }, []);

  const anim = (delay) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "none" : "translateY(28px)",
    transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "0 clamp(24px, 5vw, 120px)", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "-20%", right: "5%", width: 700, height: 700,
        background: `radial-gradient(circle, ${C.pGlow} 0%, transparent 65%)`, filter: "blur(100px)", pointerEvents: "none",
        opacity: loaded ? 1 : 0, transition: "opacity 2s ease 0.5s" }} />
      <div style={{ position: "absolute", bottom: "0%", left: "-5%", width: 500, height: 500,
        background: `radial-gradient(circle, rgba(212,168,83,0.05) 0%, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none",
        opacity: loaded ? 1 : 0, transition: "opacity 2.5s ease 1s" }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.015, pointerEvents: "none",
        backgroundImage: `linear-gradient(${C.t4} 1px, transparent 1px), linear-gradient(90deg, ${C.t4} 1px, transparent 1px)`,
        backgroundSize: "80px 80px" }} />

      <div style={{ maxWidth: 780, position: "relative", zIndex: 1, paddingTop: 100, paddingBottom: 80 }}>
        <h1 style={{
          fontFamily: FONT.d, fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 400,
          lineHeight: 1.05, color: C.t1, margin: 0, letterSpacing: "-0.02em", ...anim(0.2),
        }}>
          Your best thinking is trapped in files nobody will ever open again.
        </h1>

        <p style={{
          fontFamily: FONT.b, fontSize: "clamp(17px, 1.4vw, 21px)", lineHeight: 1.75,
          color: C.t2, maxWidth: 560, margin: "36px 0 0", ...anim(0.4),
        }}>
          We extract it. Structure it. And deploy an Oracle that{" "}
          <span style={{ color: C.g400, fontWeight: 500 }}>acts on it</span>.
        </p>

        <p style={{
          fontFamily: FONT.b, fontSize: 14, color: C.t3, margin: "14px 0 0", ...anim(0.5),
        }}>
          If your business created it, your Oracle can learn from it.
        </p>

        <div style={{ display: "flex", gap: 14, marginTop: 44, flexWrap: "wrap", ...anim(0.6) }}>
          <Btn href={CAL}>Book a Discovery Sprint →</Btn>
          <Btn primary={false} href="#how-it-works">See how it works ↓</Btn>
        </div>

        <div style={{ display: "flex", gap: "clamp(28px, 4vw, 56px)", marginTop: 72, flexWrap: "wrap", ...anim(0.85) }}>
          {[
            ["748", "relationships mapped from one client"],
            ["48hr", "from intake to live Oracle"],
            ["Every file type.", "Every source."],
          ].map(([num, label], i) => (
            <div key={i} style={{ marginTop: i === 1 ? 12 : 0 }}>
              <div style={{ fontFamily: FONT.m, fontSize: "clamp(24px, 2.2vw, 32px)", fontWeight: 600, color: C.g400, lineHeight: 1 }}>{num}</div>
              <div style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 2, color: C.t4, textTransform: "uppercase", marginTop: 6, maxWidth: 180 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 3: PROBLEM — "The Intelligence Gap"
   ═══════════════════════════════════════════ */
function Problem() {
  return (
    <section style={{ padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal><Label>The Problem</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.12, maxWidth: 750, marginBottom: 72, letterSpacing: "-0.01em",
          }}>
            Every conversation, document, and file you've ever created contains intelligence you've never extracted.
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {[
            {
              tag: "Scattered",
              body: "Recordings. Documents. Messages. Spreadsheets. Decks. Videos. Dozens of sources that have never talked to each other.",
              accent: C.p400, large: false,
            },
            {
              tag: "Invisible",
              body: "Hundreds of conversations happened. Zero intelligence was extracted.",
              accent: C.g400, large: false,
            },
            {
              tag: "Inert",
              body: "Your data doesn't act.",
              accent: C.p300, large: true,
            },
          ].map((c, i) => (
            <Reveal key={i} delay={0.1 + i * 0.12}>
              <ProblemCard {...c} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ tag, body, accent, index, large }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: C.card, borderRadius: 14, padding: "clamp(28px, 3vw, 44px)",
        border: `1px solid ${hov ? C.borderH : C.border}`,
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? "0 12px 48px rgba(0,0,0,0.4)" : "none",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        marginTop: index === 1 ? 32 : 0,
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${accent}, transparent)`,
        opacity: hov ? 0.6 : 0.2, transition: "opacity 0.4s",
      }} />
      <span style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: accent }}>{tag}</span>
      <GoldLine width={40} />
      <p style={{
        fontFamily: FONT.b,
        fontSize: large ? "clamp(22px, 2vw, 28px)" : 15,
        fontWeight: large ? 600 : 400,
        lineHeight: 1.75, color: C.t1,
      }}>{body}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION 4: PROOF POINTS
   ═══════════════════════════════════════════ */
function ProofPoints() {
  return (
    <section style={{
      padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)",
      background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 50%, ${C.bg} 100%)`,
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal><Label>Proof</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.15, marginBottom: 64,
          }}>
            What one extraction looks like.
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
          {[
            ["748", "relationships identified and cross-referenced"],
            ["1,453", "opportunities mapped with progression tracking"],
            ["262", "commitments tracked with accountability signals"],
          ].map(([num, desc], i) => (
            <Reveal key={i} delay={0.15 + i * 0.1}>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: FONT.d, fontSize: "clamp(56px, 6vw, 80px)", fontWeight: 600,
                  color: C.g400, lineHeight: 1, marginBottom: 12,
                }}>{num}</div>
                <div style={{ fontFamily: FONT.b, fontSize: 15, color: C.t2, lineHeight: 1.5 }}>{desc}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <p style={{
            fontFamily: FONT.b, fontSize: 16, color: C.t2, textAlign: "center",
            marginTop: 48, maxWidth: 600, margin: "48px auto 0",
          }}>
            From 244 files across 9 source types — in a single engagement.
          </p>
        </Reveal>
        <Reveal delay={0.5}>
          <p style={{
            fontFamily: FONT.b, fontSize: 15, color: C.t3, fontStyle: "italic",
            textAlign: "center", marginTop: 16,
          }}>
            This is what 30 minutes and a Discovery Sprint produces.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 5: HOW IT WORKS
   ═══════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    {
      num: "01", name: "Discovery Sprint",
      desc: "30 minutes. We map your intelligence landscape.",
      icon: "◎",
    },
    {
      num: "02", name: "The Extraction",
      desc: "Every file processed into 16 categories of structured intelligence.",
      sub: "Not a meeting summary. Not a search tool. Intelligence extracted from every source, cross-referenced into a knowledge graph no single tool can build.",
      sources: "Calls, contracts, proposals, Slack threads, CRM exports, Loom recordings, PDFs, spreadsheets, slide decks, voice memos — all of it.",
      icon: "⊕",
    },
    {
      num: "03", name: "Oracle Deployed",
      desc: "Your Oracle goes live where you already communicate.",
      icon: "◈",
    },
    {
      num: "04", name: "Command Center",
      desc: "Search, explore, and act on everything your business knows.",
      icon: "▣",
    },
  ];

  return (
    <section id="how-it-works" style={{ padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)", position: "relative" }}>
      <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)",
        width: 900, height: 900, background: `radial-gradient(circle, ${C.pGlow} 0%, transparent 55%)`,
        filter: "blur(120px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
        <Reveal><Label>How It Works</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.15, marginBottom: 64,
          }}>
            From chaos to Oracle in four steps.
          </h2>
        </Reveal>

        <div style={{ position: "relative" }}>
          {/* Vertical timeline line */}
          <div style={{
            position: "absolute", left: 23, top: 0, bottom: 0, width: 1,
            background: `linear-gradient(180deg, ${C.g400}33, ${C.g400}, ${C.g400}33)`,
          }} className="timeline-line" />

          {steps.map((step, i) => (
            <Reveal key={i} delay={0.15 + i * 0.1}>
              <div style={{
                display: "flex", gap: 32, marginBottom: i < 3 ? 56 : 0,
                paddingLeft: 0, position: "relative",
              }}>
                {/* Step number circle */}
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                  background: C.card, border: `1px solid ${C.borderH}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FONT.m, fontSize: 12, color: C.g400, letterSpacing: 1,
                  position: "relative", zIndex: 1,
                }}>{step.num}</div>

                <div style={{ flex: 1, paddingTop: 4 }}>
                  <h3 style={{ fontFamily: FONT.b, fontSize: 20, fontWeight: 600, color: C.t1, marginBottom: 8 }}>{step.name}</h3>
                  <p style={{ fontFamily: FONT.b, fontSize: 16, color: C.t2, lineHeight: 1.65 }}>{step.desc}</p>
                  {step.sub && (
                    <p style={{ fontFamily: FONT.b, fontSize: 14, color: C.t2, lineHeight: 1.65, marginTop: 16 }}>{step.sub}</p>
                  )}
                  {step.sources && (
                    <div style={{
                      marginTop: 16, padding: "14px 18px", borderRadius: 8,
                      background: C.gMuted, border: `1px solid ${C.border}`,
                    }}>
                      <p style={{ fontFamily: FONT.m, fontSize: 12, color: C.t3, lineHeight: 1.7 }}>{step.sources}</p>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 6: PRICING
   ═══════════════════════════════════════════ */
function Pricing() {
  const [openFaq, setOpenFaq] = useState(null);

  const tiers = [
    {
      revenue: "For businesses doing $500K–2M in revenue",
      name: "Your first Oracle",
      price: "$1,500/month",
      deployment: "$5,000 one-time deployment",
      roi: "10:1 ROI — replaces a $41K/year role",
      features: [
        "Full 16-category extraction (up to 500 sources, any file type)",
        "Command Center dashboard",
        "Oracle via messaging",
        "48-hour SLA",
      ],
      cta: "Book a Discovery Sprint \u2192",
      ctaPrimary: false,
      featured: false,
    },
    {
      revenue: "For businesses doing $2M–15M in revenue",
      name: "Full intelligence operations",
      price: "Typically $4,000–$6,000/month",
      priceIsRange: true,
      roi: "4:1 ROI — replaces $220K–$340K/year across CoS, department heads, and EA roles",
      features: [
        "Everything in Starter",
        "Unlimited source processing across all file types",
        "Multi-integration ingestion",
        "Advanced Oracle skills: meeting prep, commitment tracking, opportunity recovery",
        "Context engine with three-source triangulation",
        "Custom skill library",
        "24-hour SLA",
      ],
      cta: "Scoped in your Discovery Sprint \u2192",
      ctaPrimary: true,
      featured: true,
    },
    {
      revenue: "For businesses doing $15M+ in revenue",
      name: "Enterprise command center",
      price: "Custom — scoped in your Discovery Sprint",
      priceIsRange: true,
      roi: "5:1 ROI — replaces $470K–$950K/year in ops teams, tools, and consulting",
      features: [
        "Everything in Growth",
        "Multi-department deployment",
        "Multiple Oracle instances",
        "Contradiction detection across sources",
        "Competitive signal routing",
        "Dedicated vertical calibration",
        "Same-day SLA",
        "Monthly strategic review",
      ],
      cta: "Scoped in your Discovery Sprint \u2192",
      ctaPrimary: false,
      featured: false,
    },
  ];

  const faqs = [
    ["What is The Extraction?", "We process every file your business has ever created — recordings, documents, messages, spreadsheets, contracts, videos — into 16 categories of structured intelligence. Not summaries. Structured, searchable, actionable intelligence your Oracle uses to know your business."],
    ["How quickly does my Oracle go live?", "48 hours from intake completion to first intelligence delivery. Not 48 hours to a demo — 48 hours to a working Oracle with your actual data."],
    ["What data sources can you process?", "Everything. PDFs, Word docs, slide decks, spreadsheets, call recordings, Loom videos, voice memos, Slack exports, email threads, CRM dumps, Notion exports, calendar data, contracts, proposals — 17 file types and growing. If your business created it, your Oracle can learn from it."],
    ["Do I need to change my tools?", "No. Your Oracle integrates with the tools you already use and ingests data from sources you don't have integrations for. Drop a folder of files from 2019. Upload a CRM export. Record a Loom walkthrough. It all becomes intelligence."],
    ["What's the deployment fee?", "A one-time investment that covers extracting your intelligence and configuring your Oracle. Think of it as the difference between installing software and deploying an intelligence function. The Extraction alone is often worth more than the fee."],
    ["Can I try it before committing?", "We'll process a sample of your actual data during the Discovery Sprint. You'll see your own intelligence — your people, your opportunities, your commitments — extracted from your own files before you decide anything. If it's not useful, you've lost 30 minutes. If it is, you've found your Oracle."],
    ["What if I want to bring my own API keys?", "Available as a monthly cost modifier within any tier. We'll discuss during your Discovery Sprint."],
    ["How is this different from Fathom, Gong, Notion AI, etc.?", "They summarize meetings or search within one workspace. We extract intelligence across everything — recordings, documents, messages, spreadsheets, contracts, videos — cross-reference it into a unified knowledge graph, and deploy an Oracle that acts on it. They help you remember one meeting. We help you operate across your entire business history."],
  ];

  return (
    <section id="pricing" style={{ padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal><Label>Investment</Label></Reveal>

        <Reveal delay={0.1}>
          <p style={{
            fontFamily: FONT.b, fontSize: 17, color: C.t2, textAlign: "center",
            marginBottom: 48, maxWidth: 600, margin: "0 auto 48px",
          }}>
            Most clients invest $2,000–$6,000/month depending on business size and data complexity.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 80 }}>
          {tiers.map((tier, i) => (
            <Reveal key={i} delay={0.15 + i * 0.1}>
              <PricingCard tier={tier} />
            </Reveal>
          ))}
        </div>

        {/* FAQ */}
        <Reveal delay={0.1}>
          <h3 style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.t4, marginBottom: 24 }}>
            Common Questions
          </h3>
        </Reveal>
        <div>
          {faqs.map(([q, a], i) => (
            <Reveal key={i} delay={0.03 * i}>
              <div style={{ borderBottom: `1px solid ${C.border}` }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "18px 0", textAlign: "left",
                  }}
                >
                  <span style={{ fontFamily: FONT.b, fontSize: 15, fontWeight: 500, color: openFaq === i ? C.t1 : C.t2, transition: "color 0.3s", paddingRight: 16 }}>{q}</span>
                  <span style={{
                    fontFamily: FONT.m, fontSize: 14, color: C.g400, flexShrink: 0,
                    transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.3s",
                  }}>+</span>
                </button>
                <div style={{
                  maxHeight: openFaq === i ? 400 : 0, overflow: "hidden",
                  transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
                }}>
                  <p style={{ fontFamily: FONT.b, fontSize: 14, lineHeight: 1.75, color: C.t2, paddingBottom: 20 }}>{a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ tier }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: tier.featured
          ? `linear-gradient(180deg, ${C.card} 0%, ${C.p900}40 100%)`
          : C.card,
        border: `1px solid ${tier.featured ? C.g400 + "55" : (hov ? C.borderH : C.border)}`,
        borderRadius: 16, padding: "clamp(28px, 3vw, 44px)",
        position: "relative", overflow: "hidden", height: "100%",
        display: "flex", flexDirection: "column",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: tier.featured && hov ? `0 12px 48px ${C.gGlow}` : (hov ? "0 12px 48px rgba(0,0,0,0.4)" : "none"),
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {tier.featured && (
        <div style={{ position: "absolute", top: -1, left: 40, right: 40, height: 2,
          background: `linear-gradient(90deg, transparent, ${C.g400}, transparent)` }} />
      )}

      <span style={{ fontFamily: FONT.b, fontSize: 12, color: C.t3 }}>{tier.revenue}</span>
      <h3 style={{ fontFamily: FONT.d, fontSize: 24, fontWeight: 600, color: C.t1, margin: "12px 0 8px", lineHeight: 1.2 }}>{tier.name}</h3>

      {tier.priceIsRange ? (
        <div style={{ fontFamily: FONT.b, fontSize: 16, color: C.t2, marginBottom: 4 }}>{tier.price}</div>
      ) : (
        <div style={{ fontFamily: FONT.d, fontSize: "clamp(28px, 2.5vw, 36px)", fontWeight: 400, color: C.g400, marginBottom: 4 }}>{tier.price}</div>
      )}

      {tier.deployment && (
        <div style={{ fontFamily: FONT.b, fontSize: 13, color: C.t2, marginBottom: 4 }}>{tier.deployment}</div>
      )}

      <div style={{ fontFamily: FONT.m, fontSize: 11, color: C.g400, marginBottom: 20 }}>{tier.roi}</div>

      <GoldLine width={40} />

      <div style={{ flex: 1 }}>
        {tier.features.map((feat, j) => (
          <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0" }}>
            <span style={{ color: C.g400, fontSize: 10, marginTop: 4, flexShrink: 0 }}>✦</span>
            <span style={{ fontFamily: FONT.b, fontSize: 14, color: C.t1, lineHeight: 1.5 }}>{feat}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28 }}>
        <Btn primary={tier.ctaPrimary} href={CAL} style={{ width: "100%", textAlign: "center", padding: "14px 24px", fontSize: 11 }}>
          {tier.cta}
        </Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION 7: PRIMARY CTA
   ═══════════════════════════════════════════ */
function PrimaryCta() {
  return (
    <section style={{
      padding: "clamp(80px, 10vw, 120px) clamp(24px, 5vw, 120px)",
      position: "relative",
    }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 400, height: 400, background: `radial-gradient(circle, ${C.gGlow} 0%, transparent 60%)`,
          filter: "blur(80px)", pointerEvents: "none",
        }} />
        <Reveal>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.12, marginBottom: 20, position: "relative",
          }}>
            Ready to see your own intelligence?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{
            fontFamily: FONT.b, fontSize: 17, lineHeight: 1.75, color: C.t2, marginBottom: 40,
          }}>
            Book a Discovery Sprint — 30 minutes. We process your real data. You see your own intelligence before deciding anything.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <Btn href={CAL} style={{ padding: "18px 44px", fontSize: 13 }}>
            Book a Discovery Sprint →
          </Btn>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   ═══ DEEP SCROLL (below primary CTA) ═══
   ═══════════════════════════════════════════ */

/* ═══════════════════════════════════════════
   SECTION 8: ORACLE DEMO
   ═══════════════════════════════════════════ */
function OracleDemo() {
  return (
    <section style={{
      padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)",
      background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 50%, ${C.bg} 100%)`,
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Reveal><Label>Your Oracle</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.15, marginBottom: 48,
          }}>
            Ask your Oracle anything.
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
            padding: "clamp(24px, 3vw, 40px)", position: "relative", overflow: "hidden",
          }}>
            {/* Oracle ambient glow */}
            <div style={{
              position: "absolute", top: -60, right: -60, width: 200, height: 200,
              background: `radial-gradient(circle, ${C.gGlow} 0%, transparent 70%)`,
              animation: "pulse 4s ease-in-out infinite", pointerEvents: "none",
            }} />

            {/* User message */}
            <div style={{ display: "flex", gap: 14, marginBottom: 24, alignItems: "flex-start" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 7, flexShrink: 0,
                background: C.p700, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT.b, fontSize: 13, fontWeight: 600, color: C.p300, marginTop: 2,
              }}>Y</div>
              <div style={{
                background: "rgba(107,33,168,0.08)", borderRadius: "4px 14px 14px 14px", padding: "14px 18px",
                fontFamily: FONT.b, fontSize: 14, color: C.t1, lineHeight: 1.6,
              }}>
                What pricing frameworks have I used across my last 20 client proposals and calls?
              </div>
            </div>

            {/* Oracle response */}
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 7, flexShrink: 0,
                background: `linear-gradient(135deg, ${C.p500}, ${C.g400})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT.d, fontSize: 15, fontWeight: 700, color: "#fff", marginTop: 2,
                animation: "pulse 4s ease-in-out infinite",
              }}>O</div>
              <div style={{
                background: C.gMuted, borderRadius: "4px 14px 14px 14px", padding: "18px 20px",
                fontFamily: FONT.b, fontSize: 14, color: C.t1, lineHeight: 1.8,
              }}>
                <span style={{ color: C.t2 }}>Based on 14 relevant sources (6 proposals, 5 call recordings, 3 internal documents):</span>
                <br /><br />
                <span style={{ fontWeight: 600 }}>Your primary pricing framework is Value-Based Anchoring.</span>
                <br /><br />
                Most recent usage:
                <br />
                <div style={{ margin: "12px 0", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>📄</span>
                    <span style={{ color: C.t2 }}>
                      <span style={{ color: C.g400 }}>"Acme Corp Proposal Q4.pdf"</span> — anchored at 3x implementation cost, discounted to 2.2x for annual commitment
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>🎙️</span>
                    <span style={{ color: C.t2 }}>
                      <span style={{ color: C.g400 }}>Call with Sarah Chen (Nov 14)</span> — "I always start at the value number, not the cost number"
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>📄</span>
                    <span style={{ color: C.t2 }}>
                      <span style={{ color: C.g400 }}>"Enterprise Pricing Template.docx"</span> — standardized 3-tier structure with 15% annual discount
                    </span>
                  </div>
                </div>
                Also frequently used: <span style={{ fontWeight: 500 }}>Tiered Commitment Ladder</span> (8 occurrences) and{" "}
                <span style={{ fontWeight: 500 }}>ROI Guarantee Frame</span> (3 occurrences, increasing in recent months).
                <br /><br />
                <span style={{ fontFamily: FONT.m, fontSize: 11, color: C.t3 }}>Sources span: Q3 2024 — present</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 9: VERTICAL REPLICATION
   ═══════════════════════════════════════════ */
function Verticals() {
  return (
    <section style={{ padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal><Label>Proven Across Industries</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.15, marginBottom: 56,
          }}>
            Deployed from the same platform.
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {/* Card 1 — Text-forward, editorial */}
          <Reveal delay={0.15}>
            <VerticalCard>
              <span style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.p300 }}>Creator & Coach</span>
              <GoldLine width={36} />
              <p style={{ fontFamily: FONT.b, fontSize: 16, color: C.t2, lineHeight: 1.8, fontStyle: "normal" }}>
                Every framework you've taught, every client proposal you've written, every objection you've handled on camera. Searchable. Actionable.{" "}
                <span style={{ fontStyle: "italic", color: C.t1, fontWeight: 500 }}>In your voice.</span>
              </p>
            </VerticalCard>
          </Reveal>

          {/* Card 2 — Data-forward, proof-heavy */}
          <Reveal delay={0.25}>
            <VerticalCard>
              <span style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.g400 }}>B2B Sales</span>
              <GoldLine width={36} />
              <p style={{ fontFamily: FONT.b, fontSize: 16, color: C.t2, lineHeight: 1.8 }}>
                <span style={{ fontFamily: FONT.d, fontSize: 28, color: C.g400, fontWeight: 600 }}>748</span> people.{" "}
                <span style={{ fontFamily: FONT.d, fontSize: 28, color: C.g400, fontWeight: 600 }}>1,453</span> opportunities.{" "}
                <span style={{ fontFamily: FONT.d, fontSize: 28, color: C.g400, fontWeight: 600 }}>262</span> commitments.{" "}
                Across recordings, CRM exports, email threads, and proposal documents. Not just what was said — what was written, promised, and committed.
              </p>
            </VerticalCard>
          </Reveal>

          {/* Card 3 — Industry-specific, grounded */}
          <Reveal delay={0.35}>
            <VerticalCard>
              <span style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.p400 }}>Trades & Contracting</span>
              <GoldLine width={36} />
              <p style={{ fontFamily: FONT.b, fontSize: 16, color: C.t2, lineHeight: 1.8 }}>
                Job bids, supplier contracts, crew communications, project docs — the intelligence running your business, extracted from every format it lives in.
              </p>
            </VerticalCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function VerticalCard({ children }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: C.card, border: `1px solid ${hov ? C.borderH : C.border}`,
        borderRadius: 14, padding: "clamp(28px, 3vw, 44px)", height: "100%",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? "0 12px 48px rgba(0,0,0,0.4)" : "none",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >{children}</div>
  );
}

/* ═══════════════════════════════════════════
   SECTION 10: INTEGRATIONS — Convergence Funnel
   ═══════════════════════════════════════════ */
function Integrations() {
  const sources = [
    "PDFs", "Slide Decks", "Spreadsheets", "Call Recordings", "Loom Videos",
    "Voice Memos", "Slack Exports", "Email Threads", "CRM Data", "Contracts",
  ];

  const logos = [
    "Zoom", "Fathom", "Gong", "Slack", "Gmail", "Google Drive",
    "Notion", "Dropbox", "HubSpot", "Loom", "Audio", "Custom API",
  ];

  return (
    <section style={{
      padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)",
      background: C.bg2,
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal><Label>Universal Ingestion</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.15, marginBottom: 56,
          }}>
            Your Oracle ingests everything.{" "}
            <span style={{ color: C.t3 }}>Not just meetings.</span>
          </h2>
        </Reveal>

        {/* Convergence Funnel */}
        <Reveal delay={0.2}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "clamp(16px, 3vw, 40px)",
            alignItems: "center",
            marginBottom: 64,
          }} className="funnel-grid">
            {/* Left: scattered source types */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
              {sources.map((src, i) => (
                <div key={i} style={{
                  fontFamily: FONT.m, fontSize: 12, color: C.t3, letterSpacing: 1,
                  padding: "6px 14px", borderRadius: 6, border: `1px solid ${C.border}`,
                  transform: `translateX(${(i % 3 - 1) * 12}px)`,
                  transition: "all 0.3s",
                }}>{src}</div>
              ))}
            </div>

            {/* Center: convergence arrow */}
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            }}>
              <svg width="60" height="200" viewBox="0 0 60 200" style={{ overflow: "visible" }}>
                {/* Converging lines */}
                {sources.map((_, i) => {
                  const startY = (i / (sources.length - 1)) * 180 + 10;
                  return (
                    <line key={i}
                      x1="0" y1={startY} x2="60" y2="100"
                      stroke={C.g400} strokeWidth="0.5" opacity="0.3"
                    />
                  );
                })}
                <circle cx="30" cy="100" r="4" fill={C.g400} />
              </svg>
              <div style={{
                fontFamily: FONT.m, fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
                color: C.g400, textAlign: "center", whiteSpace: "nowrap",
              }}>The Extraction</div>
            </div>

            {/* Right: Oracle output */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                padding: "24px 32px", borderRadius: 14,
                background: C.gMuted, border: `1px solid ${C.borderH}`,
                textAlign: "center",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, margin: "0 auto 12px",
                  background: `linear-gradient(135deg, ${C.p500}, ${C.g400})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FONT.d, fontSize: 22, fontWeight: 700, color: "#fff",
                  animation: "pulse 4s ease-in-out infinite",
                }}>O</div>
                <div style={{ fontFamily: FONT.d, fontSize: 16, color: C.t1, fontWeight: 500 }}>Your Oracle</div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Integration logos grid */}
        <Reveal delay={0.3}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
            {logos.map((name, i) => (
              <IntegrationTile key={i} name={name} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <p style={{
            fontFamily: FONT.b, fontSize: 16, color: C.t2, textAlign: "center",
            marginTop: 40,
          }}>
            17 file types and growing. If your business created it, your Oracle can learn from it.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function IntegrationTile({ name }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.card : "transparent",
        border: `1px solid ${hov ? C.borderH : C.border}`,
        borderRadius: 10, padding: "16px 12px", textAlign: "center",
        transition: "all 0.3s", cursor: "default",
      }}
    >
      <div style={{
        fontFamily: FONT.b, fontSize: 13, fontWeight: 500,
        color: hov ? C.t1 : C.t3, transition: "color 0.3s",
      }}>{name}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION 11: THE PLATFORM
   ═══════════════════════════════════════════ */
function Platform() {
  const points = [
    {
      title: "Every extraction improves the system.",
      body: "Intelligence isn't static. Each new source processed deepens the cross-references, surfaces patterns across a longer timeline, and teaches your Oracle more about how your business actually operates.",
    },
    {
      title: "Your data. Only your data.",
      body: "Your Oracle never sees another client's information — by architecture, not by policy. Isolation is enforced at the infrastructure level, not the permission level.",
    },
    {
      title: "Infrastructure that grows with you.",
      body: "Cloud-native architecture designed for thousands of tenants. Adding sources, users, or departments doesn't require new infrastructure — it just works.",
    },
    {
      title: "Every industry makes the next one smarter.",
      body: "Each vertical we deploy into makes the next deployment faster and more accurate. The 50th deployment costs a fraction of the first. Your Oracle benefits from everything the platform has learned.",
    },
  ];

  return (
    <section id="platform" style={{ padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Reveal><Label>The Platform</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.15, marginBottom: 64,
          }}>
            Your intelligence compounds.
          </h2>
        </Reveal>

        {points.map((point, i) => (
          <Reveal key={i} delay={0.15 + i * 0.1}>
            <div style={{
              display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "clamp(24px, 4vw, 56px)",
              marginBottom: 48, alignItems: "start",
            }} className="platform-row">
              <div>
                <h3 style={{
                  fontFamily: FONT.b, fontSize: 20, fontWeight: 600, color: C.t1,
                  marginBottom: 12, lineHeight: 1.3,
                }}>
                  {point.title}
                </h3>
                <p style={{ fontFamily: FONT.b, fontSize: 15, color: C.t2, lineHeight: 1.75 }}>
                  {point.body}
                </p>
              </div>
              <div style={{
                height: 1, background: `linear-gradient(90deg, ${C.border}, ${C.g400}33)`,
                marginTop: 14,
              }} className="platform-line" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 12: FINAL CTA
   ═══════════════════════════════════════════ */
function FinalCta() {
  return (
    <section style={{
      padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)",
      background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 40%, ${C.bg} 100%)`,
      position: "relative",
    }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 600, height: 600, background: `radial-gradient(circle, ${C.pGlow} 0%, transparent 60%)`,
        filter: "blur(100px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <Reveal>
          <div style={{
            width: 56, height: 56, borderRadius: 14, margin: "0 auto 28px",
            background: `linear-gradient(135deg, ${C.p500}, ${C.g400})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: FONT.d,
            boxShadow: `0 8px 40px ${C.gGlow}`,
            animation: "pulse 4s ease-in-out infinite",
          }}>O</div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.12, marginBottom: 20,
          }}>
            Your intelligence is{" "}
            <span style={{ color: C.g400, fontStyle: "italic", fontWeight: 600 }}>waiting</span>.
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p style={{
            fontFamily: FONT.b, fontSize: 17, lineHeight: 1.75, color: C.t2, marginBottom: 40,
          }}>
            30 minutes. No obligation. We'll process a sample of your real data — you'll see your own intelligence before you decide anything.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <Btn href={CAL} style={{ padding: "18px 44px", fontSize: 13 }}>
            Book a Discovery Sprint →
          </Btn>
        </Reveal>

        <Reveal delay={0.25}>
          <p style={{ fontFamily: FONT.m, fontSize: 11, color: C.t3, marginTop: 24 }}>
            isaiah@orectic.ai · Austin, TX
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <a href="https://app.orectic.ai" target="_blank" rel="noopener noreferrer" style={{
            fontFamily: FONT.m, fontSize: 11, color: C.t4, textDecoration: "none",
            display: "inline-block", marginTop: 12, transition: "color 0.3s",
          }}
          onMouseEnter={e => e.target.style.color = C.g400}
          onMouseLeave={e => e.target.style.color = C.t4}
          >
            Already talked to us? Log in →
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 13: FOOTER
   ═══════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{
      padding: "32px clamp(24px, 5vw, 120px)",
      borderTop: `1px solid ${C.border}`,
      display: "flex", justifyContent: "center", alignItems: "center",
      flexWrap: "wrap", gap: 16,
    }}>
      <span style={{ fontFamily: FONT.m, fontSize: 11, color: C.t4, letterSpacing: 0.5 }}>
        © 2026 Orectic · orectic.ai · Austin, TX
      </span>
      <span style={{ color: C.t4 }}>·</span>
      <a href="#" style={{ fontFamily: FONT.m, fontSize: 11, color: C.t4, textDecoration: "none" }}>Privacy</a>
      <a href="#" style={{ fontFamily: FONT.m, fontSize: 11, color: C.t4, textDecoration: "none" }}>Terms</a>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   ROOT
   ═══════════════════════════════════════════ */
export default function OrecticV3() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: ${C.bg}; color: ${C.t1}; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        ::selection { background: rgba(212,168,83,0.3); color: #fff; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.p700}; border-radius: 3px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes pulse { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.22; } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 200ms !important; }
        }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: block !important; }
          .funnel-grid { grid-template-columns: 1fr !important; }
          .platform-row { grid-template-columns: 1fr !important; }
          .platform-line { display: none !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile { display: none !important; }
        }
      `}</style>
      <div style={{ minHeight: "100vh", background: C.bg }}>
        <Nav />
        <Hero />
        <Problem />
        <ProofPoints />
        <HowItWorks />
        <Pricing />
        <PrimaryCta />
        <OracleDemo />
        <Verticals />
        <Integrations />
        <Platform />
        <FinalCta />
        <Footer />
      </div>
    </>
  );
}
