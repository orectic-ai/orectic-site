import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────
   ORECTIC — OS / company-vision site  ·  "Blueprint" system
   Dark canvas · blueprint grid · copper + steel · mono labels

   Section spine (EBI R2 — problem → identity → mechanism → product → proof):
   01 Why now · 02 What Orectic is · 03 The Loop · 04 Products · 05 Proof
   · 06 Who this is for · 07 Open a channel
   ───────────────────────────────────────────────────────── */

const CONTACT_EMAIL = "hello@orectic.ai";
const OVAE_URL = "https://ovae.ai";

// Illustrative example driving the on-page loop demonstration (#loop).
const DEMO_STAGES = [
  { id: "02", label: "Governance", line: "Checked against pricing policy & data-access rules — bounded, approved." },
  { id: "03", label: "Execution", line: "Drafted in your email tool, grounded in the CRM record + call transcript." },
  { id: "04", label: "Proof", line: "3 sources cited · written to the audit trail." },
  { id: "05", label: "Learning", line: "Your edits are captured — the next renewal draft starts sharper." },
];

const CSS = `
:root{
  --bg:#05060A; --bg2:#090B11; --panel:#0E1119; --steel:#161B26;
  --cu:#C98B72; --cu2:#A56C57; --sig:#86C7D6;
  --t1:#EDF0F5; --t2:#9AA3B2; --t3:#8A92A2;
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

/* mobile menu */
.os .menubtn{display:none;background:none;border:1px solid var(--lineH);color:var(--t1);width:42px;height:36px;cursor:pointer;align-items:center;justify-content:center;font-family:'IBM Plex Mono';font-size:16px;line-height:1}
.os .mobilemenu{display:none}
@media(max-width:760px){
  .os .links{display:none}
  .os .menubtn{display:inline-flex}
  .os .nav>.btn-pri{display:none}
  .os .mobilemenu.open{display:block;border-top:1px solid var(--line);background:rgba(5,6,10,.97);backdrop-filter:blur(16px)}
  .os .mobilemenu a{display:block;padding:15px 30px;border-bottom:1px solid var(--line);font-family:'IBM Plex Mono';font-size:14px;color:var(--t2)}
  .os .mobilemenu a.cta{color:var(--cu)}
}

/* skip link */
.os .skiplink{position:absolute;left:-9999px;top:0;z-index:100;background:var(--cu);color:#0a0807;padding:10px 16px;font-family:'IBM Plex Mono';font-size:12px}
.os .skiplink:focus{left:12px;top:12px}

/* honeypot (spam trap) */
.os .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}

.os .hero{position:relative;padding:158px 0 96px}
.os .coord{font-family:'IBM Plex Mono';font-size:11px;color:var(--t3);letter-spacing:.1em;margin-bottom:4px}
.os .hero h1{font-size:clamp(40px,6.4vw,78px);max-width:17ch;margin:22px 0 0;font-weight:300;letter-spacing:-.025em}
.os .hero h1 b{font-weight:500;color:var(--cu)}
.os .lede{margin-top:28px;max-width:62ch;font-size:18px;line-height:1.62;color:var(--t2)}
.os .cta{margin-top:40px;display:flex;gap:14px;flex-wrap:wrap}
.os .specrow{margin-top:58px;display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:1px solid var(--line)}
@media(max-width:760px){.os .specrow{grid-template-columns:1fr}}
.os .specrow>a{padding:20px 22px;border-right:1px solid var(--line);color:inherit;text-decoration:none;transition:.2s}
.os .specrow>a:last-child{border-right:none}
.os .specrow>a:hover{background:rgba(134,199,214,.05)}
.os .specrow>a:hover .v{color:var(--sig)}
@media(max-width:760px){.os .specrow>a{border-right:none;border-bottom:1px solid var(--line)}.os .specrow>a:last-child{border-bottom:none}}
.os .specrow .n{font-family:'IBM Plex Mono';font-size:11px;color:var(--t3);letter-spacing:.12em;display:flex;align-items:center;gap:8px}
.os .specrow .n:after{content:"↘";color:var(--cu);font-size:10px;opacity:.6}
.os .specrow .v{font-family:'Space Grotesk';font-size:16px;margin-top:8px;color:var(--t1)}

.os section{position:relative;padding:88px 0;border-top:1px solid var(--line);scroll-margin-top:84px}
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

/* without / with comparison */
.os .cmp{margin-top:44px;border:1px solid var(--line)}
.os .cmp-head,.os .cmp-row{display:grid;grid-template-columns:1fr 1fr}
.os .cmp-head>div{padding:15px 24px;font-family:'IBM Plex Mono';font-size:11px;letter-spacing:.14em;text-transform:uppercase}
.os .cmp-head .w0{color:var(--t3);border-right:1px solid var(--line)}
.os .cmp-head .w1{color:var(--cu)}
.os .cmp-row{border-top:1px solid var(--line)}
.os .cmp-row>div{padding:18px 24px;font-size:14.5px;display:flex;gap:11px;align-items:flex-start;line-height:1.5}
.os .cmp-row .c0{color:var(--t3);border-right:1px solid var(--line)}
.os .cmp-row .c1{color:var(--t1);transition:background .2s}
.os .cmp-row .mk{font-family:'IBM Plex Mono';flex:0 0 auto;font-size:13px}
.os .cmp-row .c0 .mk{color:#A56C57}
.os .cmp-row .c1 .mk{color:var(--sig)}
.os .cmp-row:hover .c1{background:rgba(134,199,214,.05)}
@media(max-width:680px){
  .os .cmp-head,.os .cmp-row{grid-template-columns:1fr}
  .os .cmp-head .w0,.os .cmp-row .c0{border-right:none;border-bottom:1px solid var(--line)}
}

/* mid-page CTA band */
.os .midcta{border-top:1px solid var(--line);background:linear-gradient(180deg,var(--panel),var(--bg))}
.os .midcta-row{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:38px 0;flex-wrap:wrap}
.os .midcta-t{font-family:'Space Grotesk';font-size:clamp(18px,2.4vw,24px);font-weight:300;max-width:42ch}

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

.os footer{border-top:1px solid var(--line);padding:34px 0 40px;margin-top:0;color:var(--t3);font-family:'IBM Plex Mono';font-size:12px}
.os .footnav{display:flex;flex-wrap:wrap;gap:22px;padding-bottom:22px;margin-bottom:18px;border-bottom:1px solid var(--line)}
.os .footnav a:hover{color:var(--sig)}
.os .foot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;align-items:center}
.os .foot a:hover{color:var(--sig)}

.os .reveal{opacity:0;transform:translateY(20px);transition:.85s cubic-bezier(.16,1,.3,1)}
.os .reveal.in{opacity:1;transform:none}

/* EBI R3 — craft */
.os a:focus-visible,.os button:focus-visible,.os input:focus-visible,.os textarea:focus-visible{outline:2px solid var(--sig);outline-offset:3px}
.os .btn:hover{transform:translateY(-1px)}
.os .links a,.os .footnav a{position:relative}
.os .links a:after,.os .footnav a:after{content:"";position:absolute;left:0;bottom:-4px;height:1px;width:0;background:var(--sig);transition:width .25s ease}
.os .links a:hover:after,.os .footnav a:hover:after{width:100%}
/* living FIG.01 loop — a signal pulses around the cycle */
@keyframes nodePulse{0%,100%{box-shadow:0 0 0 0 rgba(134,199,214,0)}45%{box-shadow:0 0 0 6px rgba(134,199,214,.12)}}
.os .step .dot{animation:nodePulse 4.5s ease-in-out infinite}
.os .flow .step:nth-child(1) .dot{animation-delay:0s}
.os .flow .step:nth-child(3) .dot{animation-delay:.9s}
.os .flow .step:nth-child(5) .dot{animation-delay:1.8s}
.os .flow .step:nth-child(7) .dot{animation-delay:2.7s}
.os .flow .step:nth-child(9) .dot{animation-delay:3.6s}
/* hero balance glyph */
.os .heroglyph{position:absolute;top:96px;right:-30px;width:430px;height:430px;opacity:.55;pointer-events:none;z-index:0}
.os .hero .wrap{position:relative;z-index:1}
@keyframes glyphspin{to{transform:rotate(360deg)}}
.os .heroglyph .spin{transform-origin:100px 100px;animation:glyphspin 80s linear infinite}
@media(max-width:980px){.os .heroglyph{display:none}}
/* blueprint corner ticks */
.os .tick{position:relative}
.os .tick:before,.os .tick:after{content:"";position:absolute;width:11px;height:11px;border-color:var(--cu);border-style:solid;opacity:.55;pointer-events:none}
.os .tick:before{top:-1px;left:-1px;border-width:1px 0 0 1px}
.os .tick:after{bottom:-1px;right:-1px;border-width:0 1px 1px 0}

/* EBI R4 — resonance */
html{scroll-behavior:smooth}
.os .hero .coord.reveal{transition-delay:.02s}
.os .hero .eyebrow.reveal{transition-delay:.10s}
.os .hero h1.reveal{transition-delay:.18s}
.os .hero .lede.reveal{transition-delay:.28s}
.os .hero .cta.reveal{transition-delay:.38s}
.os .hero .specrow.reveal{transition-delay:.48s}
.os .grid3 .cell.reveal:nth-child(2){transition-delay:.09s}
.os .grid3 .cell.reveal:nth-child(3){transition-delay:.18s}
.os .aud>.reveal:nth-child(2){transition-delay:.07s}
.os .aud>.reveal:nth-child(3){transition-delay:.14s}
.os .aud>.reveal:nth-child(4){transition-delay:.21s}
.os .cell:hover{background:rgba(201,139,114,.05);transform:translateY(-2px);box-shadow:0 12px 30px rgba(0,0,0,.28)}
.os .ovae{transition:box-shadow .3s}
.os .ovae:hover{box-shadow:inset 0 0 0 1px rgba(134,199,214,.18)}

/* EBI R5 — innovation */
.os .heroglyph{transition:transform .25s ease-out}
.os .heroglyph .orbit{transform-origin:100px 100px;animation:glyphspin 22s linear infinite}
.os .flow:hover .step,.os .flow:hover .arrow{opacity:.4;transition:opacity .25s}
.os .flow .step{transition:opacity .25s}
.os .flow .step:hover{opacity:1}
.os .flow .step:hover .dot{transform:scale(1.6);filter:drop-shadow(0 0 6px rgba(134,199,214,.55))}

/* EBI R6 — show, don't tell */
.os .heroproof{margin-top:22px;font-family:'IBM Plex Mono';font-size:12px;color:var(--t3);letter-spacing:.03em;display:flex;align-items:center;gap:9px}
.os .heroproof .dot{width:7px;height:7px;border-radius:50%;background:var(--sig);animation:livePulse 2.6s ease-in-out infinite;flex:0 0 auto}
.os .heroproof a{color:var(--sig)}
@keyframes livePulse{0%,100%{box-shadow:0 0 0 0 rgba(134,199,214,0)}50%{box-shadow:0 0 0 5px rgba(134,199,214,.16)}}
/* evidence chips under proof claims */
.os .ev{margin-top:14px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-family:'IBM Plex Mono';font-size:10.5px}
.os .ev .chip{border:1px solid var(--line);padding:3px 8px;color:var(--t2);letter-spacing:.04em}
.os .ev .chip.sig{border-color:rgba(134,199,214,.34);color:var(--sig)}
.os .ev .q{color:var(--t2)}
.os .ev .arr{color:var(--cu)}
/* the loop, demonstrated */
.os .demo{margin-top:18px;border:1px solid var(--line);padding:26px 30px;background:#070A11}
.os .demo-head{display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap;margin-bottom:16px}
.os .demo-head .cap{font-size:11px;color:var(--cu);letter-spacing:.14em}
.os .demo-note{font-family:'IBM Plex Mono';font-size:10.5px;color:var(--t3);letter-spacing:.06em}
.os .demo-intent{display:flex;gap:14px;align-items:flex-start;padding:14px 16px;border:1px solid var(--lineH);background:rgba(201,139,114,.05);flex-wrap:wrap}
.os .demo-tag{flex:0 0 auto;font-size:11px;letter-spacing:.1em;color:var(--cu);min-width:128px}
.os .demo-text{color:var(--t1);font-size:14px;line-height:1.5}
.os .demo-stage{display:flex;gap:14px;align-items:flex-start;padding:13px 16px;border-left:1px solid var(--line);margin-left:8px;opacity:0;transform:translateX(-6px);transition:opacity .4s,transform .4s}
.os .demo-stage.on{opacity:1;transform:none}
.os .demo-stage .demo-tag{color:var(--sig)}
.os .demo-stage .demo-text{color:var(--t2);font-size:13.5px;flex:1}
.os .demo-mk{color:var(--sig);flex:0 0 auto;font-family:'IBM Plex Mono'}
.os .demo-foot{display:flex;align-items:center;gap:18px;margin-top:20px;flex-wrap:wrap}
.os .demo-close{font-size:11.5px;color:var(--t3);letter-spacing:.04em;opacity:0;transition:opacity .5s}
.os .demo-close.on{opacity:1;color:var(--cu)}
@media(max-width:680px){.os .demo-tag{min-width:0}.os .demo-intent,.os .demo-stage{flex-direction:column;gap:6px}}
/* not a chatbot / not RPA band */
.os .diff{border-top:1px solid var(--line);padding:64px 0;background:linear-gradient(180deg,var(--bg),var(--panel))}
.os .diff-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:34px;border:1px solid var(--line)}
@media(max-width:820px){.os .diff-grid{grid-template-columns:1fr}}
.os .diff-cell{padding:26px 28px;border-right:1px solid var(--line)}
.os .diff-cell:last-child{border-right:none}
@media(max-width:820px){.os .diff-cell{border-right:none;border-bottom:1px solid var(--line)}}
.os .diff-cell .num{font-family:'IBM Plex Mono';color:var(--cu);font-size:11px;letter-spacing:.12em}
.os .diff-cell p{margin-top:12px;color:var(--t2);font-size:14.5px;line-height:1.55}
.os .diff-cell p b{color:var(--t1);font-weight:500}

@media(max-width:600px){ .os .coord{display:none} .os .hero{padding:140px 0 80px} }

@media (prefers-reduced-motion: reduce){
  html{scroll-behavior:auto !important}
  .os .reveal{opacity:1 !important;transform:none !important}
  .os *,.os *::before,.os *::after{transition-duration:.001ms !important;animation-duration:.001ms !important;scroll-behavior:auto !important}
}
`;

export default function OsSite() {
  const [form, setForm] = useState({ name: "", email: "", org: "", role: "", message: "" });
  const [hp, setHp] = useState(""); // honeypot — humans never fill this
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [demoStep, setDemoStep] = useState(0); // 0 idle · 1-4 stages revealing · 5 done
  const demoTimers = useRef([]);

  const runDemo = () => {
    demoTimers.current.forEach(clearTimeout);
    demoTimers.current = [];
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDemoStep(5);
      return;
    }
    setDemoStep(0);
    for (let i = 1; i <= 5; i++) {
      demoTimers.current.push(window.setTimeout(() => setDemoStep(i), i * 750));
    }
  };

  // Clear demo timers on unmount.
  useEffect(() => () => demoTimers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const nav = document.getElementById("os-nav");
    const onScroll = () => nav && nav.classList.toggle("scr", window.scrollY > 40);
    window.addEventListener("scroll", onScroll);

    const reveals = document.querySelectorAll(".os .reveal");
    const revealAll = () => reveals.forEach((el) => el.classList.add("in"));
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let io;
    if (reduce || !("IntersectionObserver" in window)) {
      // Reduced-motion users (or no observer support) get content immediately, no animation.
      revealAll();
    } else {
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          }),
        { threshold: 0.12 }
      );
      reveals.forEach((el) => io.observe(el));
    }
    // Safety net: never leave content hidden if the observer never fires.
    const backstop = window.setTimeout(revealAll, 1600);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(backstop);
      if (io) io.disconnect();
    };
  }, []);

  // Cursor parallax on the hero glyph — subtle depth, pointer devices only.
  useEffect(() => {
    const glyph = document.querySelector(".os .heroglyph");
    if (!glyph) return;
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;
    let raf = 0;
    const onMove = (e) => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        glyph.style.transform = `translate(${(x * 20).toFixed(1)}px, ${(y * 16).toFixed(1)}px)`;
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
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
        body: JSON.stringify({ ...form, website: hp }),
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

  const ovaeExtra = { target: "_blank", rel: "noopener noreferrer" };

  return (
    <div className="os">
      <style>{CSS}</style>

      <a className="skiplink" href="#thesis">Skip to content</a>

      <nav id="os-nav" aria-label="Primary">
        <div className="wrap nav">
          <div className="brand">
            <span className="logo" aria-hidden="true">O</span> ORECTIC
          </div>
          <div className="links">
            <a href="#thesis">/why</a>
            <a href="#system">/system</a>
            <a href="#products">/products</a>
            <a href="#proof">/proof</a>
          </div>
          <a className="btn btn-pri" href="#contact">
            Request access
          </a>
          <button
            type="button"
            className="menubtn"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? "✕" : "≡"}
          </button>
        </div>
        <div
          className={"mobilemenu" + (menuOpen ? " open" : "")}
          onClick={() => setMenuOpen(false)}
        >
          <a href="#thesis">/why</a>
          <a href="#system">/system</a>
          <a href="#products">/products</a>
          <a href="#proof">/proof</a>
          <a className="cta" href="#contact">Request access →</a>
        </div>
      </nav>

      <header className="hero">
        <svg className="heroglyph" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#C98B72" strokeOpacity="0.22" strokeWidth="0.6" />
          <g className="spin">
            <circle cx="100" cy="100" r="58" fill="none" stroke="#86C7D6" strokeOpacity="0.16" strokeWidth="0.5" strokeDasharray="2 5" />
          </g>
          <g className="orbit">
            <circle cx="100" cy="20" r="3.4" fill="#86C7D6" />
          </g>
          <circle cx="100" cy="20" r="2.4" fill="#C98B72" />
          <circle cx="176" cy="76" r="2.4" fill="#C98B72" />
          <circle cx="146" cy="163" r="2.4" fill="#86C7D6" />
          <circle cx="54" cy="163" r="2.4" fill="#C98B72" />
          <circle cx="24" cy="76" r="2.4" fill="#C98B72" />
        </svg>
        <div className="wrap">
          <div className="coord mono reveal">ORECTIC · LAYER 01 · OPERATING SYSTEM</div>
          <div className="eyebrow reveal" style={{ marginTop: 20 }}>
            Governed intent-to-execution infrastructure
          </div>
          <h1 className="reveal">
            The operating system for <b>governed intelligence.</b>
          </h1>
          <p className="lede reveal">
            Orectic converts the implicit expertise inside a business into governed, executable
            intelligence — extracted, structured, and acted on through a self-correcting loop. It
            is the infrastructure beneath the product, not the product itself.
          </p>
          <div className="cta reveal">
            <a className="btn btn-pri" href="#contact">
              Request access →
            </a>
            <a
              className="btn btn-gh"
              href={OVAE_URL}
              {...ovaeExtra}
              aria-label="See OVAE, our first product (opens in a new tab)"
            >
              See OVAE, our first product
            </a>
          </div>
          <div className="heroproof reveal" style={{ transitionDelay: ".44s" }}>
            <span className="dot" aria-hidden="true" /> Already shipping —{" "}
            <a className="sig" href={OVAE_URL} {...ovaeExtra} aria-label="OVAE.ai (opens in a new tab)">
              OVAE.ai
            </a>
            , the first product built on Orectic.
          </div>
          {/* spec-row doubles as a clickable mini-TOC */}
          <div className="specrow reveal">
            <a href="#system">
              <div className="n mono">LAYER 01</div>
              <div className="v"><span className="cu">Orectic</span> · the system</div>
            </a>
            <a href="#products">
              <div className="n mono">LAYER 02</div>
              <div className="v"><span className="sig">OVAE</span> · the surface</div>
            </a>
            <a href="#loop">
              <div className="n mono">CYCLE</div>
              <div className="v">Intent → … → Learning</div>
            </a>
          </div>
        </div>
      </header>

      <section id="thesis">
        <div className="wrap">
          <div className="shead reveal">
            <div className="eyebrow">01 · Why now</div>
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
              <h3>Extraction finally works</h3>
              <p>
                Turning unstructured expertise — calls, docs, threads — into structured, queryable
                intelligence only became possible in the last two years.
              </p>
            </div>
            <div className="cell reveal">
              <div className="num mono">SHIFT 02</div>
              <h3>Governance became the bottleneck</h3>
              <p>
                Once AI started to act, the hard part stopped being capability and became control —
                cited, bounded, auditable.
              </p>
            </div>
            <div className="cell reveal">
              <div className="num mono">SHIFT 03</div>
              <h3>Memory is the moat</h3>
              <p>
                Models commoditize. A business's own intelligence — compounding with every loop —
                does not.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="cost">
        <div className="wrap">
          <div className="shead reveal">
            <div className="eyebrow">02 · The cost of running blind</div>
            <h2>
              Without governance, the same failures <b>repeat — silently.</b>
            </h2>
            <p>
              Knowledge stays trapped, the AI guesses, and automation can't be trusted. Governed
              intelligence flips each of those.
            </p>
          </div>
          <div className="cmp reveal">
            <div className="cmp-head">
              <div className="w0">Without governed intelligence</div>
              <div className="w1">With Orectic</div>
            </div>
            <div className="cmp-row">
              <div className="c0"><span className="mk">✕</span> Expertise lives in people's heads and scattered files.</div>
              <div className="c1"><span className="mk">✓</span> Implicit expertise extracted into a structured, queryable brain.</div>
            </div>
            <div className="cmp-row">
              <div className="c0"><span className="mk">✕</span> The AI answers from generic, ungrounded guesses.</div>
              <div className="c1"><span className="mk">✓</span> Every action grounded in your own data, voice, and relationships.</div>
            </div>
            <div className="cmp-row">
              <div className="c0"><span className="mk">✕</span> Automation you can't audit, cite, or trust.</div>
              <div className="c1"><span className="mk">✓</span> Cited, bounded, auditable execution — governed by architecture.</div>
            </div>
            <div className="cmp-row">
              <div className="c0"><span className="mk">✕</span> Insight stops at the answer; the work stays manual.</div>
              <div className="c1"><span className="mk">✓</span> Work gets done across the tools you already run on.</div>
            </div>
            <div className="cmp-row">
              <div className="c0"><span className="mk">✕</span> One exit or outage and institutional memory walks out the door.</div>
              <div className="c1"><span className="mk">✓</span> Memory is operational and owned — it compounds with every use.</div>
            </div>
          </div>
        </div>
      </section>

      <section id="system">
        <div className="wrap">
          <div className="shead reveal">
            <div className="eyebrow">03 · What Orectic is</div>
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
                A repeatable way to turn expertise into governed software — the model every Orectic
                product is built on.
              </p>
            </div>
            <div className="cell reveal">
              <div className="num mono">03 / LOOP</div>
              <h3>A loop</h3>
              <p>A self-correcting cycle that compounds with every use — detailed next.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="loop">
        <div className="wrap">
          <div className="shead reveal">
            <div className="eyebrow">04 · The Loop</div>
            <h2>
              One self-correcting cycle, <b>running underneath the work.</b>
            </h2>
          </div>
          <div className="schem reveal tick">
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

          <div className="demo reveal tick">
            <div className="demo-head">
              <span className="cap mono">RUN IT — WATCH THE LOOP RUN</span>
              <span className="demo-note">Illustrative · your data, your tools</span>
            </div>
            <div className="demo-intent">
              <span className="demo-tag mono">01 · INTENT</span>
              <span className="demo-text">
                "Draft the renewal email for the Lindqvist account — our real pricing, last call's
                commitments, in our voice."
              </span>
            </div>
            <div className="demo-stages">
              {DEMO_STAGES.map((s, i) => (
                <div key={s.id} className={"demo-stage" + (demoStep >= i + 1 ? " on" : "")}>
                  <span className="demo-tag mono">
                    {s.id} · {s.label}
                  </span>
                  <span className="demo-text">{s.line}</span>
                  <span className="demo-mk">✓</span>
                </div>
              ))}
            </div>
            <div className="demo-foot">
              <button
                type="button"
                className="btn btn-pri"
                onClick={runDemo}
                disabled={demoStep > 0 && demoStep < 5}
              >
                {demoStep === 0 ? "▶ Run the loop" : demoStep < 5 ? "Running…" : "↺ Run again"}
              </button>
              <span className={"demo-close mono" + (demoStep >= 5 ? " on" : "")}>
                ↺ learning re-enters as intent — the next run starts sharper.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="products">
        <div className="wrap">
          <div className="shead reveal">
            <div className="eyebrow">05 · Products</div>
            <h2>
              OVAE is <b>the first.</b>
            </h2>
            <p>
              The doctrine is generative — it predicts the product. OVAE is the first productized
              implementation of Orectic, and the first of more to come.
            </p>
          </div>
          <div className="prod">
            <div className="ovae reveal tick">
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
                <a
                  className="btn btn-gh"
                  href={OVAE_URL}
                  {...ovaeExtra}
                  aria-label="Visit OVAE (opens in a new tab)"
                >
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

      <div className="diff">
        <div className="wrap">
          <div className="shead reveal">
            <div className="eyebrow">Not a chatbot. Not RPA.</div>
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", marginTop: 14, fontWeight: 300 }}>
              Adjacent tools stop where Orectic <b>starts.</b>
            </h2>
          </div>
          <div className="diff-grid reveal">
            <div className="diff-cell">
              <div className="num mono">VS A CHATBOT</div>
              <p>It doesn't just answer — it <b>acts</b>, grounded in your data, and shows what it did.</p>
            </div>
            <div className="diff-cell">
              <div className="num mono">VS RPA</div>
              <p>Governed by architecture — not brittle scripts that break the moment a process changes.</p>
            </div>
            <div className="diff-cell">
              <div className="num mono">THE MOAT</div>
              <p>Defensibility isn't the model — it's your own intelligence, compounding with every loop.</p>
            </div>
          </div>
        </div>
      </div>

      <section id="proof">
        <div className="wrap">
          <div className="shead reveal">
            <div className="eyebrow">06 · How it earns trust</div>
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
              <div className="ev">
                <span className="chip">CRM</span>
                <span className="chip">Call transcript</span>
                <span className="chip">SOW.pdf</span>
              </div>
            </div>
            <div className="cell reveal">
              <div className="num mono">CITED</div>
              <h3>Cited</h3>
              <p>
                Answers and actions carry their sources. The customer's own organizational
                intelligence is the proof.
              </p>
              <div className="ev">
                <span className="q">"…net-60 payment terms."</span>
                <span className="chip sig">— Acme MSA · p.4</span>
              </div>
            </div>
            <div className="cell reveal">
              <div className="num mono">GOVERNED</div>
              <h3>Governed</h3>
              <p>
                Proposed before executed, bounded, and auditable. Control lives in the architecture,
                not in a policy document.
              </p>
              <div className="ev">
                <span className="chip">Proposed</span>
                <span className="arr">→</span>
                <span className="chip sig">Approved</span>
                <span className="arr">→</span>
                <span className="chip">Ran</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="midcta">
        <div className="wrap">
          <div className="midcta-row reveal">
            <div className="midcta-t">
              Building, backing, or deploying governed intelligence?
            </div>
            <a className="btn btn-pri" href="#contact">
              Request access →
            </a>
          </div>
        </div>
      </div>

      <section id="company">
        <div className="wrap">
          <div className="shead reveal">
            <div className="eyebrow">07 · Who this is for</div>
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
              <div className="eyebrow">08 · Open a channel</div>
              <h2 style={{ marginTop: 14 }}>
                Let's <b>talk.</b>
              </h2>
              <p>
                If you're building, backing, or deploying governed intelligence, this is where the
                conversation starts.
              </p>
            </div>
            <form className="form reveal tick" onSubmit={onSubmit}>
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
              {/* Honeypot: hidden from humans; bots that fill it are silently dropped. */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="c-website">Leave this field empty</label>
                <input
                  id="c-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                />
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
        <div className="wrap">
          <div className="footnav reveal">
            <a href="#thesis">Why now</a>
            <a href="#system">System</a>
            <a href="#loop">The Loop</a>
            <a href="#products">Products</a>
            <a href="#proof">Proof</a>
            <a href="#contact">Contact</a>
            <a href={OVAE_URL} {...ovaeExtra} aria-label="OVAE (opens in a new tab)">OVAE ↗</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
          <div className="foot">
            <div>© 2026 ORECTIC · AUSTIN TX</div>
            <div>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> ·{" "}
              <a href="/legacy">Previous site ↗</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
