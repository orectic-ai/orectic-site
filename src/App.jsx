import { useState, useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";

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

function Btn({ children, primary = true, href = "#discovery", style: s = {} }) {
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
    <a href={href}
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
   NAV
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
    ["Your Oracle", "#oracle"],
    ["Investment", "#investment"],
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(24px, 5vw, 120px)",
        background: scrolled ? "rgba(8,8,15,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
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
          <span style={{ fontFamily: FONT.d, fontSize: 21, fontWeight: 600, color: C.t1, letterSpacing: 0.5 }}>Orectic</span>
        </a>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 36 }} className="nav-desktop">
          {links.map(([label, href]) => (
            <a key={label} href={href} style={{
              fontFamily: FONT.m, fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
              color: C.t3, textDecoration: "none", transition: "color 0.3s",
            }}
            onMouseEnter={e => e.target.style.color = C.g400}
            onMouseLeave={e => e.target.style.color = C.t3}
            >{label}</a>
          ))}
          <Btn href="#discovery" style={{ padding: "10px 22px" }}>Book Discovery</Btn>
        </div>

        {/* Mobile hamburger */}
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

      {/* Mobile drawer */}
      {drawer && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99, background: "rgba(8,8,15,0.97)",
          backdropFilter: "blur(30px)", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 32,
        }} onClick={() => setDrawer(false)}>
          {links.map(([label, href]) => (
            <a key={label} href={href} style={{
              fontFamily: FONT.d, fontSize: 28, color: C.t1, textDecoration: "none",
            }}>{label}</a>
          ))}
          <Btn href="#discovery">Book Discovery Sprint →</Btn>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   HERO — Editorial, asymmetric, left-heavy
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
      {/* Ambient */}
      <div style={{ position: "absolute", top: "-20%", right: "5%", width: 700, height: 700,
        background: `radial-gradient(circle, ${C.pGlow} 0%, transparent 65%)`, filter: "blur(100px)", pointerEvents: "none",
        opacity: loaded ? 1 : 0, transition: "opacity 2s ease 0.5s" }} />
      <div style={{ position: "absolute", bottom: "0%", left: "-5%", width: 500, height: 500,
        background: `radial-gradient(circle, rgba(212,168,83,0.05) 0%, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none",
        opacity: loaded ? 1 : 0, transition: "opacity 2.5s ease 1s" }} />
      {/* Subtle grid texture */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.015, pointerEvents: "none",
        backgroundImage: `linear-gradient(${C.t4} 1px, transparent 1px), linear-gradient(90deg, ${C.t4} 1px, transparent 1px)`,
        backgroundSize: "80px 80px" }} />

      <div style={{ maxWidth: 780, position: "relative", zIndex: 1, paddingTop: 100, paddingBottom: 80 }}>
        <div style={anim(0.2)}>
          <Label>Intelligence Extraction Platform</Label>
        </div>

        <h1 style={{
          fontFamily: FONT.d, fontSize: "clamp(44px, 6vw, 76px)", fontWeight: 400,
          lineHeight: 1.05, color: C.t1, margin: "28px 0 0", letterSpacing: "-0.02em", ...anim(0.35),
        }}>
          Your intelligence<br />
          is{" "}
          <span style={{
            fontStyle: "italic", fontWeight: 700,
            background: `linear-gradient(135deg, ${C.g500}, ${C.g300})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>trapped inside.</span>
        </h1>

        <p style={{
          fontFamily: FONT.b, fontSize: "clamp(16px, 1.3vw, 19px)", lineHeight: 1.75,
          color: C.t2, maxWidth: 540, margin: "32px 0 0", ...anim(0.5),
        }}>
          We extract it, structure it across 16 categories of intelligence, and deploy 
          an Oracle that knows everything your business knows — then gives it hands to act.
        </p>

        <div style={{ display: "flex", gap: 14, marginTop: 44, flexWrap: "wrap", ...anim(0.65) }}>
          <Btn href="#discovery">Book a Discovery Sprint →</Btn>
          <Btn primary={false} href="#how-it-works">See how it works ↓</Btn>
        </div>

        {/* Stats — staggered, not a clean row */}
        <div style={{ display: "flex", gap: "clamp(28px, 4vw, 56px)", marginTop: 72, ...anim(0.9) }}>
          {[
            ["500+", "Sources Extracted"],
            ["16", "Intelligence Categories"],
            ["48hr", "Discovery to Roadmap"],
          ].map(([num, label], i) => (
            <div key={i} style={{ marginTop: i === 1 ? 12 : 0 }}>
              <div style={{ fontFamily: FONT.d, fontSize: "clamp(28px, 2.5vw, 36px)", fontWeight: 600, color: C.g400, lineHeight: 1 }}>{num}</div>
              <div style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 2, color: C.t4, textTransform: "uppercase", marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PROBLEM — "The Intelligence Gap"
   ═══════════════════════════════════════════ */
function Problem() {
  const cards = [
    {
      tag: "Scattered",
      title: "You built the knowledge. It's buried in 47 places.",
      body: "Your methodology lives across Notion pages nobody finds, Slack threads that scroll into oblivion, email chains with critical decisions buried in reply #14, recordings nobody replays. Every tool captures a fragment. No tool connects them.",
      accent: C.p400,
    },
    {
      tag: "Invisible",
      title: "Hundreds of conversations. Zero intelligence extracted.",
      body: "You've refined your pricing, objection handling, and client success framework across hundreds of interactions. But that intelligence is implicit — locked inside your experience, inaccessible to anyone else. Implicit knowledge doesn't scale. It leaves when people leave.",
      accent: C.g400,
    },
    {
      tag: "Inert",
      title: "Your docs don't do anything.",
      body: "Even the intelligence you've documented sits in folders. It doesn't answer questions. It doesn't take actions. It doesn't compound. Static documentation is dead on arrival. Knowledge must be alive — queryable, actionable, learning.",
      accent: C.p300,
    },
  ];

  return (
    <section style={{ padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <Label>The Intelligence Gap</Label>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.12, maxWidth: 650, marginBottom: 72, letterSpacing: "-0.01em",
          }}>
            You already have the answers.{" "}
            <span style={{ color: C.t3 }}>They're buried everywhere.</span>
          </h2>
        </Reveal>

        {/* Staggered editorial cards — NOT a uniform 3-col grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {cards.map((c, i) => (
            <Reveal key={i} delay={0.1 + i * 0.12}>
              <Card {...c} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ tag, title, body, accent, index }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: C.card, borderRadius: 14, padding: "clamp(28px, 3vw, 44px)",
        border: `1px solid ${hov ? C.borderH : C.border}`,
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? `0 12px 48px rgba(0,0,0,0.4)` : "none",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        marginTop: index === 1 ? 32 : 0,
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Subtle top accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${accent}, transparent)`,
        opacity: hov ? 0.6 : 0.2, transition: "opacity 0.4s",
      }} />
      <span style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: accent }}>{tag}</span>
      <h3 style={{ fontFamily: FONT.b, fontSize: "clamp(17px, 1.5vw, 21px)", fontWeight: 600, color: C.t1, margin: "16px 0", lineHeight: 1.35 }}>{title}</h3>
      <GoldLine width={40} />
      <p style={{ fontFamily: FONT.b, fontSize: 15, lineHeight: 1.75, color: C.t2 }}>{body}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TRANSFORMATION — Before/After
   ═══════════════════════════════════════════ */
function Transformation() {
  const rows = [
    ["500+ recordings nobody replays", "Structured intelligence across 16 categories"],
    ['"Ask Sarah, she knows"', '"Ask your Oracle"'],
    ["New hires take 90 days to ramp", "New hires query the Oracle on day 1"],
    ["Methodology trapped in founder's head", "Methodology documented, deployed, compounding"],
    ["Tools that store data", "An Oracle that acts on intelligence"],
  ];

  return (
    <section style={{
      padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)",
      background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 50%, ${C.bg} 100%)`,
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Reveal><Label>The Transformation</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.15, marginBottom: 56,
          }}>
            From scattered intelligence to{" "}
            <span style={{ color: C.g400, fontStyle: "italic" }}>operational Oracle</span>.
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 0, alignItems: "stretch" }}>
          {/* Column headers */}
          <Reveal delay={0.15}>
            <div style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.t4, paddingBottom: 16 }}>Before</div>
          </Reveal>
          <div />
          <Reveal delay={0.2}>
            <div style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.g400, paddingBottom: 16 }}>After</div>
          </Reveal>

          {rows.map(([before, after], i) => (
            <Reveal key={i} delay={0.15 + i * 0.08} style={{ display: "contents" }}>
              <div style={{
                padding: "18px 20px 18px 0", borderTop: `1px solid ${C.border}`,
                fontFamily: FONT.b, fontSize: 15, color: C.t3, lineHeight: 1.5,
              }}>{before}</div>
              <div style={{
                width: 1, background: `linear-gradient(180deg, ${C.g400}33, ${C.g400}, ${C.g400}33)`,
                margin: "0 clamp(16px, 3vw, 40px)", borderTop: `1px solid ${C.border}`,
              }} />
              <div style={{
                padding: "18px 0 18px 0", borderTop: `1px solid ${C.border}`,
                fontFamily: FONT.b, fontSize: 15, color: C.t1, lineHeight: 1.5, fontWeight: 500,
              }}>{after}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   HOW IT WORKS — Phase tabs
   ═══════════════════════════════════════════ */
function HowItWorks() {
  const [active, setActive] = useState(0);
  const phases = [
    {
      label: "Phase 01", name: "The Extraction", price: "$5,000 one-time", time: "48–72 hours",
      desc: "We ingest your unstructured intelligence — documents, recordings, messages, emails, notes, databases — and run it through our extraction pipeline. 16 categories of structured business intelligence emerge. Your Oracle wakes up knowing everything.",
      items: ["Full multi-source data ingestion", "16-category intelligence extraction", "Structured knowledge base deployment", "Oracle provisioning and training", "48-72 hour turnaround", "Production-ready operational roadmap"],
    },
    {
      label: "Phase 02", name: "Your Oracle Goes Live", price: "Included", time: "Same sprint",
      desc: "Your team gets a conversational interface to your entire knowledge base. Ask it about pricing conversations from last quarter. Surface objection patterns. Query delivery timelines you discussed with a specific client. It knows.",
      items: ["Natural language queries across all sources", "Cross-source intelligence synthesis", "Contextual recall with source attribution", "Team-wide access and permissions", "Continuous learning from new data", "Name your Oracle — make it yours"],
    },
    {
      label: "Phase 03", name: "Oracle Operations", price: "$5,000/month", time: "Ongoing",
      desc: "The Oracle gets hands. Managed intelligence operations with autonomous agents grounded in your actual methodology, your voice, your relationships. They don't hallucinate your process — they execute it.",
      items: ["Autonomous agent deployment", "Continuous intelligence processing", "Integration orchestration across your stack", "Managed operations & optimization", "Priority SLA and dedicated support", "Scaling and new agent training"],
    },
  ];

  return (
    <section id="how-it-works" style={{ padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)", position: "relative" }}>
      <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)",
        width: 900, height: 900, background: `radial-gradient(circle, ${C.pGlow} 0%, transparent 55%)`,
        filter: "blur(120px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <Reveal><Label>How It Works</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.15, marginBottom: 48,
          }}>
            Three phases. One{" "}
            <span style={{ color: C.g400, fontStyle: "italic" }}>Oracle</span>.
          </h2>
        </Reveal>

        {/* Phase tabs */}
        <Reveal delay={0.15}>
          <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 48, overflowX: "auto" }}>
            {phases.map((p, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "16px clamp(16px, 2vw, 36px)",
                borderBottom: `2px solid ${active === i ? C.g400 : "transparent"}`,
                transition: "all 0.3s", marginBottom: -1, whiteSpace: "nowrap",
              }}>
                <span style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
                  color: active === i ? C.g400 : C.t4, display: "block", transition: "color 0.3s" }}>{p.label}</span>
                <span style={{ fontFamily: FONT.b, fontSize: 15, fontWeight: 600,
                  color: active === i ? C.t1 : C.t3, display: "block", marginTop: 3, transition: "color 0.3s" }}>{p.name}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Content */}
        <div key={active} style={{
          display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "clamp(24px, 4vw, 56px)",
          animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <div>
            <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
              <span style={{ background: C.gMuted, borderRadius: 6, padding: "7px 14px", fontFamily: FONT.m, fontSize: 12, color: C.g400 }}>
                {phases[active].price}
              </span>
              <span style={{ background: C.pGlow, borderRadius: 6, padding: "7px 14px", fontFamily: FONT.m, fontSize: 12, color: C.p300 }}>
                {phases[active].time}
              </span>
            </div>
            <p style={{ fontFamily: FONT.b, fontSize: "clamp(15px, 1.2vw, 17px)", lineHeight: 1.8, color: C.t2 }}>
              {phases[active].desc}
            </p>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "clamp(24px, 3vw, 40px)" }}>
            <h4 style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.t4, marginBottom: 20 }}>What's Included</h4>
            {phases[active].items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "11px 0",
                borderBottom: i < 5 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.g400, marginTop: 7, flexShrink: 0 }} />
                <span style={{ fontFamily: FONT.b, fontSize: 14, color: C.t1, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   ORACLE — Demo conversation
   ═══════════════════════════════════════════ */
function Oracle() {
  const chips = [
    "What did I promise on the Henderson call?",
    "Show me our onboarding gaps",
    "What objections keep recurring this quarter?",
    "How does close rate differ by lead source?",
  ];

  return (
    <section id="oracle" style={{ padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "clamp(32px, 5vw, 80px)", alignItems: "start" }}>
          {/* Left: headline + categories */}
          <div>
            <Reveal><Label>Your Oracle</Label></Reveal>
            <Reveal delay={0.1}>
              <h2 style={{
                fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
                color: C.t1, lineHeight: 1.12, marginBottom: 24,
              }}>
                Ask your Oracle{" "}
                <span style={{ fontStyle: "italic", color: C.g400 }}>anything</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p style={{ fontFamily: FONT.b, fontSize: 16, lineHeight: 1.75, color: C.t2, marginBottom: 40 }}>
                16 categories of structured intelligence, queryable through natural conversation. 
                Your Oracle knows what your business knows — and remembers what you've forgotten.
              </p>
            </Reveal>

            {/* Category tags */}
            <Reveal delay={0.2}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Pricing Intelligence", "Objection Patterns", "Client Success", "Sales Methodology",
                  "Communication Templates", "Onboarding Sequences", "Team Knowledge", "Process Docs",
                  "Competitive Positioning", "Relationship Context", "Decision History", "Strategic Direction",
                  "Product Feedback", "Operational Playbooks", "Cultural Values", "Growth Patterns"
                ].map((cat, i) => (
                  <span key={i} style={{
                    fontFamily: FONT.m, fontSize: 10, letterSpacing: 1, color: C.t3,
                    padding: "6px 10px", borderRadius: 6, border: `1px solid ${C.border}`,
                    transition: "all 0.3s", cursor: "default",
                  }}
                  onMouseEnter={e => { e.target.style.borderColor = C.g400; e.target.style.color = C.g400; e.target.style.background = C.gMuted; }}
                  onMouseLeave={e => { e.target.style.borderColor = C.border; e.target.style.color = C.t3; e.target.style.background = "transparent"; }}
                  >{cat}</span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: conversation demo */}
          <Reveal delay={0.2}>
            <div style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
              padding: "clamp(24px, 3vw, 40px)", position: "relative", overflow: "hidden",
            }}>
              {/* Ambient Oracle glow */}
              <div style={{
                position: "absolute", top: -60, right: -60, width: 200, height: 200,
                background: `radial-gradient(circle, ${C.gGlow} 0%, transparent 70%)`,
                animation: "pulse 4s ease-in-out infinite",
                pointerEvents: "none",
              }} />

              {/* User message */}
              <div style={{ display: "flex", gap: 14, marginBottom: 20, alignItems: "flex-start" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 7, flexShrink: 0,
                  background: C.p700, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FONT.b, fontSize: 13, fontWeight: 600, color: C.p300, marginTop: 2,
                }}>Y</div>
                <div style={{
                  background: `rgba(107,33,168,0.08)`, borderRadius: "4px 14px 14px 14px", padding: "14px 18px",
                  fontFamily: FONT.b, fontSize: 14, color: C.t1, lineHeight: 1.6,
                }}>
                  What patterns do you see in how I handle pricing objections across my last 20 sales conversations?
                </div>
              </div>

              {/* Oracle message */}
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 7, flexShrink: 0,
                  background: `linear-gradient(135deg, ${C.p500}, ${C.g400})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FONT.d, fontSize: 15, fontWeight: 700, color: "#fff", marginTop: 2,
                }}>O</div>
                <div style={{
                  background: C.gMuted, borderRadius: "4px 14px 14px 14px", padding: "14px 18px",
                  fontFamily: FONT.b, fontSize: 14, color: C.t1, lineHeight: 1.7,
                }}>
                  Across 20 conversations, you use three distinct approaches. With enterprise prospects, you anchor at the annual commitment and reframe monthly cost —{" "}
                  <span style={{ color: C.g400, fontWeight: 600 }}>this converted 7 of 9 times</span>. With SMBs, you lead with the pilot and mention ROI within the first 2 minutes —{" "}
                  <span style={{ color: C.g400, fontWeight: 600 }}>4 of 6 converted</span>. The pattern that underperforms: when you discount before being asked, close rate drops to{" "}
                  <span style={{ color: C.g400, fontWeight: 600 }}>20%</span>.
                  <br /><br />
                  <span style={{ color: C.t2 }}>Want me to pull the specific conversations where discounting was unprompted?</span>
                </div>
              </div>

              {/* Query chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
                {chips.map((chip, i) => (
                  <span key={i} style={{
                    fontFamily: FONT.m, fontSize: 10, padding: "7px 12px", borderRadius: 20,
                    border: `1px solid ${C.border}`, color: C.t3, cursor: "default",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={e => { e.target.style.borderColor = C.g400; e.target.style.color = C.g400; }}
                  onMouseLeave={e => { e.target.style.borderColor = C.border; e.target.style.color = C.t3; }}
                  >{chip}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   INTEGRATIONS
   ═══════════════════════════════════════════ */
function Integrations() {
  const items = [
    { name: "Notion", desc: "Pages, databases, wikis" },
    { name: "Slack", desc: "Channels, threads, DMs" },
    { name: "Gmail", desc: "Email chains, attachments" },
    { name: "Google Drive", desc: "Docs, sheets, presentations" },
    { name: "Zoom", desc: "Meeting recordings, transcripts" },
    { name: "Fathom", desc: "AI meeting notes" },
    { name: "Gong", desc: "Revenue intelligence data" },
    { name: "HubSpot", desc: "Contact history, deal notes" },
    { name: "Dropbox", desc: "Files, shared folders" },
    { name: "+ API", desc: "Custom integrations" },
  ];

  return (
    <section style={{
      padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)",
      background: C.bg2,
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal><Label>Connects Everywhere</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.15, marginBottom: 16,
          }}>
            Your Oracle doesn't care <span style={{ fontStyle: "italic" }}>where</span> the data lives.
          </h2>
          <p style={{ fontFamily: FONT.b, fontSize: 17, color: C.t2, marginBottom: 56 }}>
            It cares what the data <span style={{ color: C.g400, fontWeight: 500 }}>knows</span>.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {items.map((item, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <IntegrationTile {...item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function IntegrationTile({ name, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.card : "transparent",
        border: `1px solid ${hov ? C.borderH : C.border}`,
        borderRadius: 10, padding: "20px 16px", textAlign: "center",
        transition: "all 0.3s", cursor: "default",
      }}
    >
      <div style={{
        fontFamily: FONT.b, fontSize: 15, fontWeight: 600,
        color: hov ? C.t1 : C.t2, marginBottom: 4, transition: "color 0.3s",
      }}>{name}</div>
      <div style={{
        fontFamily: FONT.m, fontSize: 10, color: C.t4, letterSpacing: 0.5,
        opacity: hov ? 1 : 0, transform: hov ? "none" : "translateY(4px)",
        transition: "all 0.3s", maxHeight: hov ? 20 : 0, overflow: "hidden",
      }}>{desc}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   AUDIENCE
   ═══════════════════════════════════════════ */
function Audience() {
  const profiles = [
    {
      tag: "$500K–$5M/year", title: "High-Ticket Creators & Coaches",
      pain: "Hundreds of conversations worth of methodology, pricing evolution, and client insights — scattered across tools nobody opens.",
      outcome: "A structured knowledge base and Oracle that onboards, sells, and supports in your voice.",
    },
    {
      tag: "$1M–$10M/year", title: "Consultants & Agency Owners",
      pain: "Institutional knowledge that walks out the door with every departure. Every client handoff loses 40% of context.",
      outcome: "Institutional memory that compounds. New hires query the Oracle instead of senior partners.",
    },
    {
      tag: "Partner Channel", title: "Fractional COOs & EOS Implementers",
      pain: "Your clients are sitting on years of intelligence they've never mined. You know they need this — you've just never had the tool to deliver it.",
      outcome: "White-label intelligence extraction as a value-add to existing operational engagements.",
    },
  ];

  return (
    <section style={{ padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal><Label>Who We Serve</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.12, maxWidth: 700, marginBottom: 56,
          }}>
            Built for operators who know their intelligence is{" "}
            <span style={{ color: C.g400, fontStyle: "italic" }}>worth extracting</span>.
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {profiles.map((p, i) => (
            <Reveal key={i} delay={0.1 + i * 0.1}>
              <div style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
                padding: "clamp(28px, 3vw, 40px)", height: "100%", display: "flex", flexDirection: "column",
              }}>
                <span style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 2, color: C.g400, textTransform: "uppercase" }}>{p.tag}</span>
                <h3 style={{ fontFamily: FONT.b, fontSize: 19, fontWeight: 600, color: C.t1, margin: "12px 0 0", lineHeight: 1.3 }}>{p.title}</h3>
                <GoldLine width={36} />
                <p style={{ fontFamily: FONT.b, fontSize: 14, lineHeight: 1.7, color: C.t3, marginBottom: 20 }}>
                  {p.pain}
                </p>
                <p style={{ fontFamily: FONT.b, fontSize: 14, lineHeight: 1.7, color: C.t1, marginTop: "auto" }}>
                  <span style={{ color: C.g400, fontWeight: 600 }}>→ </span>{p.outcome}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   INVESTMENT — Pricing + FAQ
   ═══════════════════════════════════════════ */
function Investment() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    ["What kind of data can you actually process?", "Anything text-based or transcribable — documents, meeting transcripts, call recordings, Slack exports, email archives, Notion databases, Google Drive contents, CRM notes, and more. If your business created it, we can extract intelligence from it."],
    ["How is this different from just using ChatGPT?", "ChatGPT gives you a conversation with a general-purpose LLM. We give you a structured intelligence extraction across 16 categories, a persistent knowledge base that grows, and an Oracle trained on the relationships between your data — not just the data itself."],
    ["What happens to my data?", "Your data lives in your own dedicated instance. Never shared, never used for training, never accessible to other clients. You own it, export it, delete it."],
    ["How long does The Extraction take?", "48-72 hours from data handoff to structured knowledge base and live Oracle. Larger datasets (500+ sources) may take up to 5 business days."],
    ["Do I need Oracle Operations, or can I just do The Extraction?", "The Extraction is fully standalone. You keep your structured knowledge base and Oracle permanently. Oracle Operations adds managed agents, continuous processing, and integration orchestration."],
    ["What does the Discovery Sprint involve?", "30 minutes. We look at your data landscape, identify the highest-value extraction opportunities, and process a sample of your real data — so you see your own intelligence structured, not a generic demo."],
    ["Can my team access the Oracle?", "Yes. Permissions are role-based. You control who can query what, and all queries are logged for transparency."],
    ["What's the BYOK tier?", "If your team manages its own API infrastructure, Oracle Operations is $3,500/month instead of $5,000. Same service, same support — you just handle the API keys."],
  ];

  return (
    <section id="investment" style={{ padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <Reveal><Label>Investment</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.15, marginBottom: 56,
          }}>
            Transparent. Simple.{" "}
            <span style={{ color: C.t3 }}>Built to compound.</span>
          </h2>
        </Reveal>

        {/* Pricing cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 64 }}>
          {/* The Extraction */}
          <Reveal delay={0.15}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "clamp(28px, 3vw, 44px)" }}>
              <span style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.p300 }}>Entry Point</span>
              <h3 style={{ fontFamily: FONT.d, fontSize: 28, fontWeight: 600, color: C.t1, margin: "12px 0 4px" }}>The Extraction</h3>
              <div style={{ fontFamily: FONT.d, fontSize: "clamp(36px, 3vw, 44px)", fontWeight: 400, color: C.g400, margin: "4px 0" }}>$5,000</div>
              <div style={{ fontFamily: FONT.b, fontSize: 14, color: C.t3, marginBottom: 28 }}>One-time intelligence extraction</div>
              <GoldLine width={40} />
              {["Full multi-source data ingestion", "16-category intelligence extraction", "Structured knowledge base", "Oracle provisioning & training", "48-72 hour turnaround", "Operational roadmap"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0" }}>
                  <span style={{ color: C.g400, fontSize: 10 }}>✦</span>
                  <span style={{ fontFamily: FONT.b, fontSize: 14, color: C.t1 }}>{item}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Oracle Operations */}
          <Reveal delay={0.25}>
            <div style={{
              background: `linear-gradient(180deg, ${C.card} 0%, ${C.p900}40 100%)`,
              border: `1px solid ${C.borderH}`, borderRadius: 16,
              padding: "clamp(28px, 3vw, 44px)", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -1, left: 40, right: 40, height: 2,
                background: `linear-gradient(90deg, transparent, ${C.g400}, transparent)` }} />
              <span style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.g400 }}>Full Operations</span>
              <h3 style={{ fontFamily: FONT.d, fontSize: 28, fontWeight: 600, color: C.t1, margin: "12px 0 4px" }}>Oracle Operations</h3>
              <div style={{ fontFamily: FONT.d, fontSize: "clamp(36px, 3vw, 44px)", fontWeight: 400, color: C.g400, margin: "4px 0" }}>
                $5,000<span style={{ fontSize: 18, color: C.t3 }}>/mo</span>
              </div>
              <div style={{ fontFamily: FONT.b, fontSize: 14, color: C.t3, marginBottom: 28 }}>Managed intelligence + autonomous agents</div>
              <GoldLine width={40} />
              {["Everything in The Extraction", "Autonomous agent deployment", "Continuous intelligence processing", "Integration orchestration", "Managed ops & priority SLA", "Scaling & new agent training"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0" }}>
                  <span style={{ color: C.g400, fontSize: 10 }}>✦</span>
                  <span style={{ fontFamily: FONT.b, fontSize: 14, color: C.t1 }}>{item}</span>
                </div>
              ))}
              {/* BYOK callout */}
              <div style={{
                marginTop: 24, padding: "12px 16px", borderRadius: 8,
                background: C.gMuted, fontFamily: FONT.m, fontSize: 11, color: C.t2, lineHeight: 1.5,
              }}>
                <span style={{ color: C.g400 }}>BYOK:</span> Bring your own API keys → $3,500/mo
              </div>
            </div>
          </Reveal>
        </div>

        {/* FAQ */}
        <Reveal delay={0.1}>
          <h3 style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.t4, marginBottom: 24 }}>
            Common Questions
          </h3>
        </Reveal>
        <div>
          {faqs.map(([q, a], i) => (
            <Reveal key={i} delay={0.05 * i}>
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
                  maxHeight: openFaq === i ? 300 : 0, overflow: "hidden",
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

/* ═══════════════════════════════════════════
   DISCOVERY CTA
   ═══════════════════════════════════════════ */
function Discovery() {
  return (
    <section id="discovery" style={{
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
            Book a Discovery Sprint. 30 minutes. We process a sample of your real data 
            so you see your own intelligence structured — not a generic demo. 
            No pitch decks, no pressure.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <Btn href="https://calendly.com/isaiahzimmerman/one-on-one" style={{ padding: "18px 44px", fontSize: 13 }}>
            Book Your Discovery Sprint →
          </Btn>
        </Reveal>

        <Reveal delay={0.25}>
          <p style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 2, color: C.t4, marginTop: 20, textTransform: "uppercase" }}>
            30 min · No obligation · Discovery to roadmap in 48hrs
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{
      padding: "36px clamp(24px, 5vw, 120px)",
      borderTop: `1px solid ${C.border}`,
      display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 5,
          background: `linear-gradient(135deg, ${C.p500}, ${C.g400})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: FONT.d,
        }}>O</div>
        <span style={{ fontFamily: FONT.d, fontSize: 15, color: C.t3 }}>Orectic</span>
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        {["How It Works", "Your Oracle", "Investment"].map(label => (
          <a key={label} href={`#${label.toLowerCase().replace(/\s/g, "-")}`} style={{
            fontFamily: FONT.m, fontSize: 10, letterSpacing: 1, textTransform: "uppercase",
            color: C.t4, textDecoration: "none",
          }}>{label}</a>
        ))}
      </div>
      <span style={{ fontFamily: FONT.m, fontSize: 10, color: C.t4, letterSpacing: 0.5 }}>
        © 2026 Orectic · Austin, TX
      </span>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   ROOT
   ═══════════════════════════════════════════ */
export default function OrecticV2() {
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
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile { display: none !important; }
        }
      `}</style>
      <div style={{ minHeight: "100vh", background: C.bg }}>
        <Nav />
        <Hero />
        <Problem />
        <Transformation />
        <HowItWorks />
        <Oracle />
        <Integrations />
        <Audience />
        <Investment />
        <Discovery />
        <Footer />
        <Analytics />
      </div>
    </>
  );
}