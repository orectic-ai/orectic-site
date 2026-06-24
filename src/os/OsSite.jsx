import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────
   ORECTIC — OS / company-vision site  ·  "Blueprint" system
   Dark canvas · blueprint grid · copper + steel · mono labels
   ───────────────────────────────────────────────────────── */

const CONTACT_EMAIL = "hello@orectic.ai";
const OVAE_URL = "https://ovae.ai";

const CSS = `
:root{
  --bg:#05060A; --bg2:#090B11; --panel:#0E1119; --steel:#161B26;
  --cu:#C98B72; --cu2:#A56C57; --sig:#86C7D6;
  --t1:#EDF0F5; --t2:#9AA3B2; --t3:#5E6677;
  --grid:rgba(134,199,214,.06); --line:rgba(154,163,178,.14); --lineH:rgba(201,139,114,.4);
}
body{margin:0}
.os{min-height:100vh}
.os *{box-sizing:border-box;margin:0;padding:0}
.os{background:var(--bg);color:var(--t1);font-family:'Inter',system-ui,sans-serif;font-weight:300;line-height:1.6;overflow-x:hidden;-webkit-font-smoothing:antialiased;
  background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);
  background-size:46px 46px}
.os h1,.os h2,.os h3,.os h4{font-family:'Space Grotesk',sans-serif;font-weight:400;letter-spacing:-.015em;line-height:1.05}
.os .mono{font-family:'IBM Plex Mono',monospace}
.os .wrap{max-width:1160px;margin:0 auto;padding:0 30px}
.os a{color:inherit;text-decoration:none}
.os .sig{color:var(--sig)} .os .cu{color:var(--cu)}
.os .eyebrow{font-family:'IBM Plex Mono';font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--cu)}
.os .eyebrow:before{content:"[ "}.os .eyebrow:after{content:" ]"}

.os nav{position:fixed;top:0;left:0;right:0;z-index:50;transition:.35s;border-bottom:1px solid transparent}
.os nav.scr{background:rgba(5,6,10,.86);backdrop-filter:blur(16px);border-bottom:1px solid var(--line)}
.os .nav{display:flex;align-items:center;justify-content:space-between;height:70px}
.os .brand{display:flex;align-items:center;gap:11px;font-family:'Space Grotesk';letter-spacing:.2em;font-size:15px;font-weight:500}
.os .logo{width:26px;height:26px;border:1px solid var(--cu);display:grid;place-items:center;font-family:'IBM Plex Mono';font-size:13px;color:var(--cu)}
.os .links{display:flex;gap:32px;font-family:'IBM Plex Mono';font-size:12.5px;color:var(--t2)}
.os .links a:hover{color:var(--sig)}
.os .btn{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;font-family:'IBM Plex Mono';font-size:12.5px;transition:.22s;cursor:pointer;border:1px solid var(--lineH);letter-spacing:.04em;background:none;color:inherit}
.os .btn-pri{background:var(--cu);color:#0a0807;border-color:var(--cu)}
.os .btn-pri:hover{background:var(--cu2);border-color:var(--cu2)}
.os .btn-pri:disabled{opacity:.55;cursor:default}
.os .btn-gh{color:var(--t1)}
.os .btn-gh:hover{border-color:var(--sig);color:var(--sig)}
@media(max-width:760px){.os .links{display:none}}

.os .hero{position:relative;padding:158px 0 96px}
.os .coord{position:absolute;top:120px;left:30px;font-family:'IBM Plex Mono';font-size:11px;color:var(--t3);letter-spacing:.1em}
.os .hero h1{font-size:clamp(40px,6.4vw,78px);max-width:17ch;margin:22px 0 0;font-weight:300}
.os .hero h1 b{font-weight:500;color:var(--cu)}
.os .lede{margin-top:28px;max-width:62ch;font-size:18px;color:var(--t2)}
.os .cta{margin-top:40px;display:flex;gap:14px;flex-wrap:wrap}
.os .specrow{margin-top:58px;display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:1px solid var(--line)}
@media(max-width:760px){.os .specrow{grid-template-columns:1fr}}
.os .specrow div{padding:20px 22px;border-right:1px solid var(--line)}
.os .specrow div:last-child{border-right:none}
.os .specrow .n{font-family:'IBM Plex Mono';font-size:11px;color:var(--t3);letter-spacing:.12em}
.os .specrow .v{font-family:'Space Grotesk';font-size:16px;margin-top:8px;color:var(--t1)}

.os section{position:relative;padding:88px 0;border-top:1px solid var(--line)}
.os .shead{max-width:64ch}
.os .shead h2{font-size:clamp(27px,3.6vw,42px);margin-top:14px;font-weight:300}
.os .shead h2 b{font-weight:500;color:var(--cu)}
.os .shead p{margin-top:16px;color:var(--t2);font-size:16.5px;max-width:58ch}

.os .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:44px;border:1px solid var(--line)}
@media(max-width:820px){.os .grid3{grid-template-columns:1fr}}
.os .cell{padding:28px;border-right:1px solid var(--line);transition:.25s;position:relative}
.os .cell:last-child{border-right:none}
@media(max-width:820px){.os .cell{border-right:none;border-bottom:1px solid var(--line)}}
.os .cell:hover{background:rgba(201,139,114,.04)}
.os .cell .num{font-family:'IBM Plex Mono';color:var(--cu);font-size:12px;letter-spacing:.1em}
.os .cell h3{font-size:20px;margin:14px 0 9px;font-weight:400}
.os .cell p{color:var(--t3);font-size:14px}

.os .schem{margin-top:50px;border:1px solid var(--line);padding:34px 30px;background:linear-gradient(180deg,var(--panel),var(--bg2));position:relative}
.os .schem .cap{font-family:'IBM Plex Mono';font-size:11px;color:var(--t3);letter-spacing:.14em;position:absolute;top:-9px;left:24px;background:var(--bg);padding:0 10px}
.os .flow{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.os .step{flex:1;min-width:150px;text-align:center}
.os .step .dot{width:12px;height:12px;border:1px solid var(--sig);border-radius:50%;margin:0 auto 14px;position:relative}
.os .step .dot:after{content:"";position:absolute;inset:3px;background:var(--sig);border-radius:50%;opacity:.6}
.os .step .id{font-family:'IBM Plex Mono';font-size:10.5px;color:var(--sig);letter-spacing:.1em}
.os .step h4{font-family:'Space Grotesk';font-size:17px;margin:6px 0 7px;font-weight:500}
.os .step p{font-size:12.5px;color:var(--t3);max-width:22ch;margin:0 auto}
.os .arrow{font-family:'IBM Plex Mono';color:var(--cu);font-size:18px;flex:0 0 auto}
@media(max-width:820px){.os .arrow{display:none}.os .step{min-width:100%;text-align:left;display:flex;gap:14px;align-items:flex-start;margin:10px 0}.os .step .dot{margin:5px 0 0}.os .step p{max-width:none}}
.os .return{margin-top:22px;font-family:'IBM Plex Mono';font-size:12px;color:var(--cu);letter-spacing:.04em}

.os .prod{display:grid;grid-template-columns:1.25fr 1fr;gap:0;margin-top:44px;border:1px solid var(--line)}
@media(max-width:820px){.os .prod{grid-template-columns:1fr}}
.os .ovae{padding:36px;border-right:1px solid var(--line);background:radial-gradient(120% 120% at 100% 0%,rgba(134,199,214,.07),transparent 55%)}
@media(max-width:820px){.os .ovae{border-right:none;border-bottom:1px solid var(--line)}}
.os .tag{font-family:'IBM Plex Mono';font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--sig);border:1px solid rgba(134,199,214,.34);padding:5px 11px}
.os .ovae h3{font-size:32px;margin:18px 0 10px;font-weight:400}
.os .ovae p{color:var(--t2);max-width:42ch}
.os .future{padding:36px;display:flex;flex-direction:column;justify-content:center}
.os .future .l{font-family:'IBM Plex Mono';color:var(--cu);font-size:11.5px;letter-spacing:.12em;text-transform:uppercase}
.os .future h3{font-size:22px;color:var(--t2);margin:14px 0 8px;font-weight:300}
.os .future p{color:var(--t3);font-size:14px}

.os .aud{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:44px;border:1px solid var(--line)}
@media(max-width:820px){.os .aud{grid-template-columns:1fr 1fr}}
.os .aud div{padding:24px;border-right:1px solid var(--line)}
.os .aud div:last-child{border-right:none}
.os .aud .h{font-family:'Space Grotesk';font-size:16px;margin-bottom:8px;font-weight:500}
.os .aud .h:before{content:"// ";color:var(--cu);font-family:'IBM Plex Mono';font-size:13px}
.os .aud p{font-size:12.5px;color:var(--t3)}

.os .about{margin-top:44px;max-width:62ch;color:var(--t2);font-size:16px}
.os .about b{color:var(--t1);font-weight:400}

.os .contact{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:46px;align-items:start}
@media(max-width:820px){.os .contact{grid-template-columns:1fr;gap:32px}}
.os .contact .intro h2{font-size:clamp(26px,3.4vw,40px);font-weight:300}
.os .contact .intro h2 b{color:var(--cu);font-weight:500}
.os .contact .intro p{margin-top:16px;color:var(--t2);font-size:16px;max-width:42ch}
.os .form{border:1px solid var(--line);padding:30px;background:linear-gradient(180deg,var(--panel),var(--bg2))}
.os .field{margin-bottom:18px}
.os .field label{display:block;font-family:'IBM Plex Mono';font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--t3);margin-bottom:8px}
.os .field input,.os .field textarea{width:100%;background:#070A11;border:1px solid var(--line);color:var(--t1);padding:12px 14px;font-family:'Inter',sans-serif;font-size:14.5px;outline:none;transition:.2s}
.os .field input:focus,.os .field textarea:focus{border-color:var(--sig)}
.os .field textarea{min-height:118px;resize:vertical}
.os .formnote{font-family:'IBM Plex Mono';font-size:11.5px;color:var(--t3);margin-top:12px;line-height:1.6}
.os .formnote.sent{color:var(--sig)} .os .formnote.err{color:var(--cu)}

.os footer{border-top:1px solid var(--line);padding:36px 0;margin-top:0;color:var(--t3);font-family:'IBM Plex Mono';font-size:12px}
.os .foot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;align-items:center}
.os .foot a:hover{color:var(--sig)}

.os .reveal{opacity:0;transform:translateY(20px);transition:.85s cubic-bezier(.16,1,.3,1)}
.os .reveal.in{opacity:1;transform:none}
`;

export default function OsSite() {
  const [form, setForm] = useState({ name: "", email: "", org: "", role: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  useEffect(() => {
    const nav = document.getElementById("os-nav");
    const onScroll = () => nav && nav.classList.toggle("scr", window.scrollY > 40);
    window.addEventListener("scroll", onScroll);

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".os .reveal").forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const upd = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const mailtoFallback = () => {
    const subject = encodeURIComponent(`Orectic inquiry — ${form.name || "website"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nOrganization: ${form.org}\nRole: ${form.role}\n\n${form.message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Contact endpoint returned ${res.status}`);
      setStatus("sent");
    } catch (err) {
      // Never fail silently: log the real error, then fall back to mailto so the
      // message still reaches us even before email delivery is wired in preview.
      console.error("Contact submit failed; falling back to mailto:", err);
      setStatus("error");
      mailtoFallback();
    }
  };

  return (
    <div className="os">
      <style>{CSS}</style>

      <nav id="os-nav">
        <div className="wrap nav">
          <div className="brand">
            <span className="logo">O</span> ORECTIC
          </div>
          <div className="links">
            <a href="#system">/system</a>
            <a href="#loop">/loop</a>
            <a href="#products">/products</a>
            <a href="#company">/company</a>
          </div>
          <a className="btn btn-pri" href="#contact">
            Request access
          </a>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap">
          <div className="coord mono">ORECTIC · LAYER 01 · OPERATING SYSTEM</div>
          <div className="eyebrow" style={{ marginTop: 34 }}>
            Governed intent-to-execution infrastructure
          </div>
          <h1>
            The operating system for <b>governed intelligence.</b>
          </h1>
          <p className="lede">
            Orectic converts the implicit expertise inside a business into governed, executable
            intelligence — extracted, structured, and acted on through a self-correcting loop. It
            is the infrastructure beneath the product, not the product itself.
          </p>
          <div className="cta">
            <a className="btn btn-pri" href="#contact">
              Request access →
            </a>
            <a className="btn btn-gh" href={OVAE_URL} target="_blank" rel="noopener noreferrer">
              See OVAE, our first product
            </a>
          </div>
          <div className="specrow">
            <div>
              <div className="n mono">LAYER 01</div>
              <div className="v">Orectic · the system</div>
            </div>
            <div>
              <div className="n mono">LAYER 02</div>
              <div className="v">OVAE · the surface</div>
            </div>
            <div>
              <div className="n mono">CYCLE</div>
              <div className="v">Intent → … → Learning</div>
            </div>
          </div>
        </div>
      </header>

      <section id="system">
        <div className="wrap">
          <div className="shead reveal">
            <div className="eyebrow">What Orectic is</div>
            <h2>
              Not a product. <b>A construct.</b>
            </h2>
            <p>
              Orectic is the company, the methodology, and the operating model — the why and the how
              that survives any single product. Products are how the doctrine reaches the world.
            </p>
          </div>
          <div className="grid3">
            <div className="cell reveal">
              <div className="num mono">01 / DOCTRINE</div>
              <h3>A doctrine</h3>
              <p>
                Implicit expertise can be made explicit through systematic extraction — and explicit
                expertise can be operationalized through governed agents.
              </p>
            </div>
            <div className="cell reveal">
              <div className="num mono">02 / MODEL</div>
              <h3>An operating model</h3>
              <p>
                Every action is grounded, cited, and governed. Control by architecture, not policy.
                Nothing is asserted that cannot be shown.
              </p>
            </div>
            <div className="cell reveal">
              <div className="num mono">03 / LOOP</div>
              <h3>A loop</h3>
              <p>
                Intent becomes governed execution; execution produces proof; proof becomes learning;
                learning re-enters as intent.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="thesis">
        <div className="wrap">
          <div className="shead reveal">
            <div className="eyebrow">Why now</div>
            <h2>
              Every business runs on intelligence <b>it can't reach.</b>
            </h2>
            <p>
              It's trapped in calls, documents, decisions, and relationships. A generation of tools
              made that knowledge searchable. The next layer makes it executable — and the only
              version worth deploying is governed. That layer is what Orectic builds.
            </p>
          </div>
          <div className="grid3">
            <div className="cell reveal">
              <div className="num mono">SHIFT 01</div>
              <h3>From documents to decisions</h3>
              <p>
                The value was never the file. It's the decision the file should have informed —
                surfaced, in context, when it matters.
              </p>
            </div>
            <div className="cell reveal">
              <div className="num mono">SHIFT 02</div>
              <h3>From answers to actions</h3>
              <p>
                Answering questions is table stakes. Doing the work — across the tools a business
                already runs on — is the frontier.
              </p>
            </div>
            <div className="cell reveal">
              <div className="num mono">SHIFT 03</div>
              <h3>From automation to governance</h3>
              <p>
                Ungoverned automation is a liability. Cited, bounded, auditable execution is what
                lets a business actually hand work over.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="loop">
        <div className="wrap">
          <div className="shead reveal">
            <div className="eyebrow">The Loop</div>
            <h2>
              One self-correcting cycle, <b>running underneath the work.</b>
            </h2>
          </div>
          <div className="schem reveal">
            <div className="cap mono">FIG.01 — THE ORECTIC LOOP</div>
            <div className="flow">
              <div className="step">
                <div className="dot" />
                <div className="id mono">01</div>
                <h4>Intent</h4>
                <p>Captured from how the business actually operates.</p>
              </div>
              <div className="arrow">→</div>
              <div className="step">
                <div className="dot" />
                <div className="id mono">02</div>
                <h4>Governance</h4>
                <p>Reviewed, cited, bounded before it runs.</p>
              </div>
              <div className="arrow">→</div>
              <div className="step">
                <div className="dot" />
                <div className="id mono">03</div>
                <h4>Execution</h4>
                <p>Work done across existing tools, grounded in real data.</p>
              </div>
              <div className="arrow">→</div>
              <div className="step">
                <div className="dot" />
                <div className="id mono">04</div>
                <h4>Proof</h4>
                <p>An auditable trail — the customer's own intelligence, visible.</p>
              </div>
              <div className="arrow">→</div>
              <div className="step">
                <div className="dot" />
                <div className="id mono">05</div>
                <h4>Learning</h4>
                <p>Outcomes sharpen the system, then re-enter as intent.</p>
              </div>
            </div>
            <div className="return mono">
              ↺ RETURN: learning(05) → intent(01) — the loop is self-referential by design.
            </div>
          </div>
        </div>
      </section>

      <section id="products">
        <div className="wrap">
          <div className="shead reveal">
            <div className="eyebrow">Products</div>
            <h2>
              OVAE is <b>the first.</b>
            </h2>
            <p>
              The doctrine is generative — it predicts the product. OVAE is the first productized
              implementation of Orectic, and the first of more to come.
            </p>
          </div>
          <div className="prod">
            <div className="ovae reveal">
              <span className="tag">LIVE · FIRST PRODUCT</span>
              <h3>
                OVAE<span className="sig">.ai</span>
              </h3>
              <p>
                The public-facing surface where a business is diagnosed, sold, and onboarded —
                outcome-led, software-delivered. OVAE is what the market touches; Orectic is the
                system that runs it.
              </p>
              <div style={{ marginTop: 26 }}>
                <a className="btn btn-gh" href={OVAE_URL} target="_blank" rel="noopener noreferrer">
                  Visit OVAE →
                </a>
              </div>
            </div>
            <div className="future reveal">
              <div className="l mono">THE NEXT LAYER</div>
              <h3>More products, one doctrine.</h3>
              <p>
                OVAE is the first manifestation of Orectic — not the ceiling. The same operating
                model can spawn the next.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="proof">
        <div className="wrap">
          <div className="shead reveal">
            <div className="eyebrow">How it earns trust</div>
            <h2>
              Governed by architecture, <b>not by promise.</b>
            </h2>
            <p>
              Trust isn't a marketing claim — it's a property of the system. Every action a customer
              relies on can be traced, sourced, and bounded.
            </p>
          </div>
          <div className="grid3">
            <div className="cell reveal">
              <div className="num mono">GROUNDED</div>
              <h3>Grounded</h3>
              <p>
                Every action traces to the business's own data, voice, and relationships — not a
                generic model's guess.
              </p>
            </div>
            <div className="cell reveal">
              <div className="num mono">CITED</div>
              <h3>Cited</h3>
              <p>
                Answers and actions carry their sources. The customer's own organizational
                intelligence is the proof.
              </p>
            </div>
            <div className="cell reveal">
              <div className="num mono">GOVERNED</div>
              <h3>Governed</h3>
              <p>
                Proposed before executed, bounded, and auditable. Control lives in the architecture,
                not in a policy document.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="company">
        <div className="wrap">
          <div className="shead reveal">
            <div className="eyebrow">Who this is for</div>
            <h2>
              Built with the people <b>building what's next.</b>
            </h2>
          </div>
          <div className="aud">
            <div className="reveal">
              <div className="h">Investors</div>
              <p>A durable construct, not a single product bet.</p>
            </div>
            <div className="reveal">
              <div className="h">Partners</div>
              <p>An OS to build products and deployments on.</p>
            </div>
            <div className="reveal">
              <div className="h">Enterprise</div>
              <p>Governed, cited, grounded intelligence at scale.</p>
            </div>
            <div className="reveal">
              <div className="h">Talent</div>
              <p>For people who want to build the system.</p>
            </div>
          </div>
          <p className="about reveal">
            <b>Orectic is an operating-system company based in Austin, Texas.</b> We build governed
            intelligence infrastructure and the products that run on it — OVAE first, with more to
            follow from the same doctrine.
          </p>
        </div>
      </section>

      <section id="contact">
        <div className="wrap">
          <div className="contact">
            <div className="intro reveal">
              <div className="eyebrow">Open a channel</div>
              <h2 style={{ marginTop: 14 }}>
                Let's <b>talk.</b>
              </h2>
              <p>
                If you're building, backing, or deploying governed intelligence, tell us a little
                about you and we'll be in touch.
              </p>
            </div>
            <form className="form reveal" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="c-name">Name</label>
                <input id="c-name" value={form.name} onChange={upd("name")} required autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="c-email">Email</label>
                <input id="c-email" type="email" value={form.email} onChange={upd("email")} required autoComplete="email" />
              </div>
              <div className="field">
                <label htmlFor="c-org">Organization</label>
                <input id="c-org" value={form.org} onChange={upd("org")} autoComplete="organization" />
              </div>
              <div className="field">
                <label htmlFor="c-role">You are a…</label>
                <input id="c-role" value={form.role} onChange={upd("role")} placeholder="Investor · Partner · Enterprise · Candidate" />
              </div>
              <div className="field">
                <label htmlFor="c-msg">Message</label>
                <textarea id="c-msg" value={form.message} onChange={upd("message")} required />
              </div>
              <button className="btn btn-pri" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Request access →"}
              </button>
              {status === "sent" && (
                <div className="formnote sent">
                  ✓ Received. We'll be in touch at the address you provided.
                </div>
              )}
              {status === "error" && (
                <div className="formnote err">
                  Opening your email client as a fallback — or write us directly at {CONTACT_EMAIL}.
                </div>
              )}
              {status === "idle" && (
                <div className="formnote">
                  Or email us directly at {CONTACT_EMAIL}.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap foot">
          <div>© 2026 ORECTIC · AUSTIN TX</div>
          <div>
            <a href={OVAE_URL} target="_blank" rel="noopener noreferrer">
              OVAE ↗
            </a>{" "}
            · <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ·{" "}
            <a href="/legacy">Previous site ↗</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
