import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

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
  glass: "rgba(17,17,34,0.6)",
  glassBorder: "rgba(212,168,83,0.12)",
};

const FONT = {
  d: "'Playfair Display', Georgia, serif",
  b: "'DM Sans', -apple-system, sans-serif",
  m: "'JetBrains Mono', monospace",
};

const CAL = "https://calendly.com/isaiahzimmerman/one-on-one";
const APP = "https://app.orectic.ai";

/* ═══════════════════════════════════════════
   TOOL LOGOS
   ═══════════════════════════════════════════ */
const TOOL_LOGOS = {
  Gmail: "https://cdn.simpleicons.org/gmail/EA4335",
  Calendar: "https://cdn.simpleicons.org/googlecalendar/4285F4",
  Slack: "https://cdn.simpleicons.org/slack/4A154B",
  QuickBooks: "https://cdn.simpleicons.org/quickbooks/2CA01C",
  Stripe: "https://cdn.simpleicons.org/stripe/635BFF",
  HubSpot: "https://cdn.simpleicons.org/hubspot/FF7A59",
  Notion: "https://cdn.simpleicons.org/notion/ffffff",
  Drive: "https://cdn.simpleicons.org/googledrive/4285F4",
  Salesforce: "https://cdn.simpleicons.org/salesforce/00A1E0",
  Zoom: "https://cdn.simpleicons.org/zoom/0B5CFF",
  Loom: "https://cdn.simpleicons.org/loom/625DF5",
  Dropbox: "https://cdn.simpleicons.org/dropbox/0061FF",
  Teams: "https://cdn.simpleicons.org/microsoft/5E5E5E",
  Telegram: "https://cdn.simpleicons.org/telegram/26A5E4",
  Figma: "https://cdn.simpleicons.org/figma/F24E1E",
  Jira: "https://cdn.simpleicons.org/jira/0052CC",
  Asana: "https://cdn.simpleicons.org/asana/F06A6A",
  Shopify: "https://cdn.simpleicons.org/shopify/7AB55C",
  GitHub: "https://cdn.simpleicons.org/github/ffffff",
  Airtable: "https://cdn.simpleicons.org/airtable/18BFFF",
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
function Reveal({ children, delay = 0, y = 40, x = 0, style = {} }) {
  const [ref, v] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? "none" : `translate(${x}px, ${y}px)`,
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

function Btn({ children, primary = true, href = APP, style: s = {} }) {
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

function GlassCard({ children, style: s = {}, hoverable = true }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => hoverable && setHov(true)}
      onMouseLeave={() => hoverable && setHov(false)}
      style={{
        background: C.glass,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${hov ? C.borderH : C.glassBorder}`,
        borderRadius: 16, padding: "clamp(24px, 3vw, 40px)",
        transform: hoverable && hov ? "translateY(-3px)" : "none",
        boxShadow: hoverable && hov ? `0 12px 48px rgba(0,0,0,0.4)` : "none",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        position: "relative", overflow: "hidden",
        ...s,
      }}
    >{children}</div>
  );
}

/* Gradient mesh divider between sections */
function MeshDivider({ variant = 0 }) {
  const gradients = [
    `radial-gradient(ellipse 80% 50% at 20% 50%, ${C.pGlow} 0%, transparent 70%), radial-gradient(ellipse 60% 60% at 80% 40%, ${C.gGlow} 0%, transparent 70%)`,
    `radial-gradient(ellipse 70% 50% at 70% 50%, ${C.pGlow} 0%, transparent 65%), radial-gradient(ellipse 50% 70% at 30% 50%, rgba(212,168,83,0.08) 0%, transparent 70%)`,
    `radial-gradient(ellipse 90% 40% at 50% 50%, rgba(107,33,168,0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 15% 60%, ${C.gGlow} 0%, transparent 65%)`,
  ];
  return (
    <div style={{
      width: "100%", height: 120, position: "relative", overflow: "hidden",
      background: gradients[variant % gradients.length],
    }}>
      {/* Noise texture */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />
      {/* Subtle line */}
      <div style={{
        position: "absolute", top: "50%", left: "10%", right: "10%", height: 1,
        background: `linear-gradient(90deg, transparent, ${C.border}, transparent)`,
      }} />
    </div>
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
    ["Login", APP],
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
          <Btn href={APP} style={{ padding: "10px 22px" }}>Get Started Free</Btn>
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
          <Btn href={APP}>Get Started Free</Btn>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   ORACLE VISUALIZATION (animated orb)
   ═══════════════════════════════════════════ */
/* ═══════════════════════════════════════════
   ORACLE ORB — WebGL Shader (ported from dashboard)
   ═══════════════════════════════════════════ */
const ORB_VERTEX = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const ORB_FRAGMENT = `
  precision highp float;
  uniform float uTime, uIntensity, uStateBlend;
  uniform vec2 uResolution;
  varying vec2 vUv;
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  float flowNoise(vec3 p,float t){
    float n1=snoise(p*1.0+t*0.3);float n2=snoise(p*2.0-t*0.2+vec3(5.2,1.3,2.8));
    float n3=snoise(p*3.0+t*0.15+vec3(9.1,4.7,6.3));return n1*0.55+n2*0.30+n3*0.15;
  }
  void main(){
    vec2 uv=(vUv-0.5)*2.0;float aspect=uResolution.x/uResolution.y;uv.x*=aspect;
    float dist=length(uv);
    float speed=mix(0.12,0.45,uStateBlend);float colorSpeed=mix(0.08,0.35,uStateBlend);
    float glowStr=mix(0.5,1.4,uStateBlend)*uIntensity;float innerActivity=mix(0.3,1.0,uStateBlend);
    float pulseRate=mix(0.4,2.0,uStateBlend);float t=uTime*speed;
    vec3 deepPurple=vec3(0.15,0.04,0.32);vec3 purple=vec3(0.42,0.13,0.66);
    vec3 brightPurple=vec3(0.576,0.2,0.918);vec3 gold=vec3(0.831,0.659,0.325);
    vec3 goldLight=vec3(0.91,0.784,0.471);vec3 warmWhite=vec3(0.96,0.94,0.98);
    float radius=0.48;float pulse=sin(uTime*pulseRate)*0.006*uIntensity;float r=radius+pulse;
    float sphereMask=1.0-smoothstep(r-0.03,r+0.003,dist);
    float sphereZ=sqrt(max(0.0,1.0-(dist*dist)/(r*r)));vec3 spherePos=vec3(uv/r,sphereZ);
    float flow1=flowNoise(spherePos*1.2,t);float flow2=flowNoise(spherePos*0.8+vec3(3.0,7.0,1.0),t*0.7);
    float flow3=snoise(spherePos*1.5+vec3(uTime*colorSpeed,0.0,uTime*colorSpeed*0.5));
    float colorA=flow1*0.5+0.5;float colorB=flow2*0.5+0.5;float colorC=flow3*0.5+0.5;
    vec3 baseColor=mix(deepPurple,purple,colorA);
    float goldAmount=smoothstep(0.45,0.75,colorB)*innerActivity;baseColor=mix(baseColor,gold,goldAmount*0.7);
    float brightAmount=smoothstep(0.5,0.8,colorC)*innerActivity;baseColor=mix(baseColor,brightPurple,brightAmount*0.5);
    float hotspot=smoothstep(0.65,0.85,flow1*flow2+0.3)*innerActivity;baseColor=mix(baseColor,goldLight,hotspot*0.6);
    float centerGlow=1.0-dist/r;centerGlow=pow(max(centerGlow,0.0),2.0);
    baseColor+=warmWhite*centerGlow*0.15*uIntensity;
    float fresnel=1.0-sphereZ;fresnel=pow(fresnel,3.0);
    vec3 rimColor=mix(purple,gold,0.6+sin(uTime*0.3)*0.2);baseColor+=rimColor*fresnel*0.6*uIntensity;
    baseColor*=(1.0+pow(max(centerGlow,0.0),0.8)*0.3);
    float glowDist=max(dist-r,0.0);
    float glow1=exp(-glowDist*4.0)*glowStr*0.6;float glow2=exp(-glowDist*1.8)*glowStr*0.25;
    float glow3=exp(-glowDist*12.0)*glowStr*0.4;
    float glowHue=sin(uTime*0.2)*0.5+0.5;
    vec3 glowColorInner=mix(purple,gold,glowHue*0.4+0.2);vec3 glowColorOuter=mix(deepPurple,purple,0.5)*0.8;
    float ringDist=abs(dist-r-0.02);float ring=exp(-ringDist*40.0)*uStateBlend*uIntensity*0.5;
    float ringPulse=sin(uTime*3.0)*0.5+0.5;vec3 ringColor=mix(gold,goldLight,ringPulse);
    float orbAngle1=uTime*1.5;float orbAngle2=uTime*1.5+3.14159;
    vec2 orb1=vec2(cos(orbAngle1),sin(orbAngle1))*(r+0.06);vec2 orb2=vec2(cos(orbAngle2),sin(orbAngle2))*(r+0.06);
    float orbLight1=exp(-length(uv-orb1)*20.0)*uStateBlend*uIntensity*0.4;
    float orbLight2=exp(-length(uv-orb2)*20.0)*uStateBlend*uIntensity*0.3;
    vec3 color=vec3(0.0);color+=glowColorOuter*glow2;color+=glowColorInner*glow1;
    color+=mix(gold,warmWhite,0.3)*glow3;color=mix(color,baseColor,sphereMask);
    color+=ringColor*ring;color+=goldLight*orbLight1;color+=gold*orbLight2;
    color=color/(color+vec3(0.8))*1.1;
    float alpha=sphereMask;alpha=max(alpha,glow1*0.9);alpha=max(alpha,glow2*0.6);
    alpha=max(alpha,glow3*0.7);alpha=max(alpha,ring);alpha=max(alpha,orbLight1+orbLight2);
    alpha=clamp(alpha,0.0,1.0);
    gl_FragColor=vec4(color,alpha);
  }
`;

const ORB_STATE_VALUES = { calm: 0.0, active: 0.5, energy: 1.0 };

function OracleOrbWebGL({ state = "calm", size = 400 }) {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const frameRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const currentStateRef = useRef(ORB_STATE_VALUES[state]);

  const initScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(size, size);
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const material = new THREE.ShaderMaterial({
        vertexShader: ORB_VERTEX, fragmentShader: ORB_FRAGMENT, transparent: true, depthWrite: false,
        uniforms: {
          uTime: { value: 0 }, uIntensity: { value: 1.5 },
          uStateBlend: { value: ORB_STATE_VALUES[state] },
          uResolution: { value: new THREE.Vector2(size, size) },
        },
      });
      materialRef.current = material;
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
      const animate = () => {
        frameRef.current = requestAnimationFrame(animate);
        material.uniforms.uTime.value = (Date.now() - startTimeRef.current) / 1000;
        material.uniforms.uStateBlend.value += (currentStateRef.current - material.uniforms.uStateBlend.value) * 0.025;
        renderer.render(scene, camera);
      };
      animate();
    } catch (e) {
      // WebGL not supported — canvas stays blank, CSS fallback handles it
    }
  }, [size, state]);

  useEffect(() => {
    initScene();
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, [initScene]);

  useEffect(() => { currentStateRef.current = ORB_STATE_VALUES[state] ?? 0; }, [state]);

  return <canvas ref={canvasRef} width={size} height={size} style={{ width: size, height: size, display: "block", borderRadius: "50%" }} />;
}

function OracleOrb() {
  const [webglOk, setWebglOk] = useState(false);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
      setWebglOk(ok);
    } catch { setWebglOk(false); }
  }, []);

  if (!webglOk) {
    // CSS fallback for browsers without WebGL
    return (
      <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", maxWidth: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", inset: "20%", borderRadius: "50%",
          background: `radial-gradient(circle, rgba(212,168,83,0.15) 0%, rgba(107,33,168,0.1) 50%, transparent 70%)`, filter: "blur(30px)",
          animation: "pulse 4s ease-in-out infinite" }} />
        <div style={{ width: "32%", height: "32%", borderRadius: "50%",
          background: `radial-gradient(circle at 40% 35%, ${C.g300}, ${C.g500} 40%, ${C.p500} 75%)`,
          boxShadow: `0 0 60px ${C.gGlow}, 0 0 120px ${C.pGlow}` }} />
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <OracleOrbWebGL state="calm" size={420} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION 2: HERO — Split Layout
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
      {/* Background Oracle Orb — large, persistent, behind everything */}
      <div style={{
        position: "absolute", top: "50%", right: "-8%", transform: "translateY(-50%)",
        opacity: loaded ? 0.6 : 0, transition: "opacity 3s ease 0.3s",
        pointerEvents: "none", zIndex: 0,
      }}>
        <OracleOrbWebGL state="active" size={1200} />
      </div>
      {/* Ambient glows */}
      <div style={{ position: "absolute", top: "-20%", right: "5%", width: 700, height: 700,
        background: `radial-gradient(circle, ${C.pGlow} 0%, transparent 65%)`, filter: "blur(100px)", pointerEvents: "none",
        opacity: loaded ? 1 : 0, transition: "opacity 2s ease 0.5s" }} />
      <div style={{ position: "absolute", bottom: "0%", left: "-5%", width: 500, height: 500,
        background: `radial-gradient(circle, rgba(212,168,83,0.05) 0%, transparent 65%)`, filter: "blur(80px)", pointerEvents: "none",
        opacity: loaded ? 1 : 0, transition: "opacity 2.5s ease 1s" }} />
      {/* Grid texture */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.015, pointerEvents: "none",
        backgroundImage: `linear-gradient(${C.t4} 1px, transparent 1px), linear-gradient(90deg, ${C.t4} 1px, transparent 1px)`,
        backgroundSize: "80px 80px" }} />
      {/* Noise texture overlay */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px" }} />

      {/* Split layout container */}
      <div className="hero-split" style={{
        display: "flex", alignItems: "center", gap: "clamp(40px, 5vw, 80px)",
        width: "100%", maxWidth: 1300, margin: "0 auto",
        position: "relative", zIndex: 1, paddingTop: 100, paddingBottom: 80,
      }}>
        {/* Left: text (60%) */}
        <div className="hero-text" style={{ flex: "0 1 60%" }}>
          <h1 style={{
            fontFamily: FONT.d, fontSize: "clamp(56px, 8vw, 96px)", fontWeight: 400,
            lineHeight: 1.0, color: C.t1, margin: 0, letterSpacing: "-0.03em", ...anim(0.2),
          }}>
            Not an assistant.{" "}
            <span style={{
              background: `linear-gradient(135deg, ${C.g400}, ${C.g200})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontStyle: "italic",
            }}>A colleague.</span>
          </h1>

          <p style={{
            fontFamily: FONT.b, fontSize: "clamp(18px, 1.5vw, 22px)", lineHeight: 1.7,
            color: C.t2, maxWidth: 580, margin: "36px 0 0", ...anim(0.4),
          }}>
            oracle connects to{" "}
            <span style={{ color: C.g400, fontWeight: 500 }}>every tool you already use</span>{" "}
            — Gmail, Slack, QuickBooks, your CRM, all of it — and{" "}
            <span style={{ color: C.g400, fontWeight: 500 }}>does the work</span>.
            You don't need another tool. You need a colleague.
          </p>

          <div style={{ display: "flex", gap: 14, marginTop: 44, flexWrap: "wrap", ...anim(0.6) }}>
            <Btn href={APP}>Get Started Free</Btn>
            <Btn primary={false} href="#how-it-works">See how it works</Btn>
          </div>

          {/* Stats bar */}
          <div style={{ display: "flex", gap: "clamp(28px, 4vw, 56px)", marginTop: 72, flexWrap: "wrap", ...anim(0.85) }}>
            {[
              ["3,000+", "tool integrations"],
              ["~3 min", "to first conversation"],
              ["Free", "to start"],
            ].map(([num, label], i) => (
              <div key={i}>
                <div style={{ fontFamily: FONT.m, fontSize: "clamp(24px, 2.2vw, 32px)", fontWeight: 600, color: C.g400, lineHeight: 1 }}>{num}</div>
                <div style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 2, color: C.t4, textTransform: "uppercase", marginTop: 6, maxWidth: 180 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side left open — large background orb fills this space */}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 3: THE SHIFT — Comparison Table
   ═══════════════════════════════════════════ */
function TheShift() {
  const comparisons = [
    {
      them: "ChatGPT",
      themDesc: "Gives you text.",
      us: "oracle",
      usDesc: "Gives you a teammate who already read everything.",
    },
    {
      them: "Zapier / Make",
      themDesc: "Follows rules you wrote.",
      us: "oracle",
      usDesc: "Figures out what needs doing.",
    },
    {
      them: "Fathom / Otter",
      themDesc: "Summarizes your meeting.",
      us: "oracle",
      usDesc: "Cross-references it against every meeting, email, and document you\u2019ve ever had.",
    },
    {
      them: "Viktor",
      themDesc: "Lives in Slack.",
      us: "oracle",
      usDesc: "Lives everywhere \u2014 Slack, Telegram, your dashboard, your tools.",
    },
  ];

  return (
    <section style={{
      padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)",
      background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 50%, ${C.bg} 100%)`,
      position: "relative",
    }}>
      {/* Noise texture */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.02, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px" }} />

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
        <Reveal><Label>The Shift</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.15, marginBottom: 56,
          }}>
            You don't need another tool.{" "}
            <span style={{ color: C.t3, fontStyle: "italic" }}>You need a colleague.</span>
          </h2>
        </Reveal>

        {/* Table header */}
        <Reveal delay={0.15}>
          <div className="shift-table-head" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
            marginBottom: 4,
          }}>
            <div style={{
              padding: "14px 24px",
              fontFamily: FONT.m, fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
              color: C.t4, borderBottom: `2px solid ${C.border}`,
            }}>Others</div>
            <div style={{
              padding: "14px 24px",
              fontFamily: FONT.m, fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
              color: C.g400, borderBottom: `2px solid ${C.g400}44`,
              borderLeft: `1px solid ${C.border}`,
            }}>your oracle</div>
          </div>
        </Reveal>

        {/* Table rows */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {comparisons.map((row, i) => (
            <ShiftTableRow key={i} {...row} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShiftTableRow({ them, themDesc, usDesc, index }) {
  const [ref, visible] = useReveal();
  const isEven = index % 2 === 0;
  return (
    <div ref={ref} className="shift-table-row" style={{
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
      background: isEven ? "rgba(255,255,255,0.01)" : "transparent",
      borderBottom: `1px solid ${C.border}`,
    }}>
      {/* Left — them */}
      <div style={{
        padding: "clamp(16px, 2vw, 24px) 24px",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateX(-30px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${0.1 + index * 0.08}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${0.1 + index * 0.08}s`,
      }}>
        <div style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.t4, marginBottom: 6 }}>{them}</div>
        <div style={{ fontFamily: FONT.b, fontSize: 15, color: C.t3, lineHeight: 1.5 }}>{themDesc}</div>
      </div>

      {/* Right — oracle */}
      <div style={{
        padding: "clamp(16px, 2vw, 24px) 24px",
        borderLeft: `1px solid ${C.border}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateX(30px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + index * 0.08}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + index * 0.08}s`,
      }}>
        <div style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.g400, marginBottom: 6 }}>oracle</div>
        <div style={{ fontFamily: FONT.b, fontSize: 15, color: C.t1, lineHeight: 1.5, fontWeight: 500 }}>{usDesc}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION 4: HOW IT WORKS — Horizontal Steps
   ═══════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      name: "Connect your tools",
      desc: "Google SSO. 3,000+ integrations via Pipedream. Two minutes to connect everything.",
      icon: "\u25CE",
    },
    {
      num: "02",
      name: "oracle processes your data",
      desc: "500 files free. Your first briefing arrives in 30 minutes \u2014 not a demo, your actual intelligence.",
      icon: "\u2295",
    },
    {
      num: "03",
      name: "oracle starts working",
      desc: "Reads, writes, and acts across your tools. Every action governed, every claim cited, every insight grounded in your data.",
      icon: "\u25C8",
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
            color: C.t1, lineHeight: 1.15, marginBottom: 64,
          }}>
            Connect. Process. Work.
          </h2>
        </Reveal>

        {/* Horizontal steps with arrows */}
        <div className="hiw-steps" style={{
          display: "flex", alignItems: "flex-start", gap: 0,
        }}>
          {steps.map((step, i) => (
            <Reveal key={i} delay={0.15 + i * 0.15} style={{ flex: 1, display: "flex", alignItems: "flex-start" }}>
              {/* Step content */}
              <div style={{ flex: 1, textAlign: "center", padding: "0 clamp(8px, 1.5vw, 20px)" }}>
                {/* Large number */}
                <div style={{
                  fontFamily: FONT.d, fontSize: "clamp(48px, 5vw, 72px)", fontWeight: 400,
                  color: C.g400, lineHeight: 1, marginBottom: 16, opacity: 0.2,
                }}>{step.num}</div>
                {/* Icon area */}
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", margin: "0 auto 20px",
                  background: `linear-gradient(135deg, ${C.p900}, ${C.card})`,
                  border: `1px solid ${C.borderH}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FONT.m, fontSize: 22, color: C.g400,
                }}>{step.icon}</div>
                <h3 style={{ fontFamily: FONT.b, fontSize: 18, fontWeight: 600, color: C.t1, marginBottom: 12 }}>{step.name}</h3>
                <p style={{ fontFamily: FONT.b, fontSize: 14, color: C.t2, lineHeight: 1.7 }}>{step.desc}</p>
              </div>
              {/* Arrow connector (not after last) */}
              {i < steps.length - 1 && (
                <div className="hiw-arrow" style={{
                  display: "flex", alignItems: "center", paddingTop: 70, flexShrink: 0,
                }}>
                  <svg width="40" height="24" viewBox="0 0 40 24" style={{ opacity: 0.35 }}>
                    <line x1="0" y1="12" x2="32" y2="12" stroke={C.g400} strokeWidth="1.5" />
                    <polyline points="28,6 36,12 28,18" fill="none" stroke={C.g400} strokeWidth="1.5" />
                  </svg>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 5: ORACLE DEMO — Full Width + Typewriter
   ═══════════════════════════════════════════ */
function OracleDemo() {
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [showDiscrepancy, setShowDiscrepancy] = useState(false);

  const oracleThinkingText = "Reviewing 23 sources across email, Slack, and documents for Redline Health...";
  const oraclePrefaceText = "Prep brief ready. But I found something first:";

  const [ref, visible] = useReveal();
  useEffect(() => {
    if (visible && step === 0) {
      setStep(1);
    }
  }, [visible]);

  // Autoplay step progression
  useEffect(() => {
    if (!autoPlay) return;
    if (step === 0) return;
    if (step === 1) {
      const timer = setTimeout(() => setStep(2), 1800);
      return () => clearTimeout(timer);
    }
    if (step === 2) {
      // Start typewriter for thinking text
      setTypedText("");
      setShowDiscrepancy(false);
      let idx = 0;
      const fullText = oracleThinkingText;
      const interval = setInterval(() => {
        idx++;
        setTypedText(fullText.slice(0, idx));
        if (idx >= fullText.length) {
          clearInterval(interval);
          setTimeout(() => setStep(3), 600);
        }
      }, 25);
      return () => clearInterval(interval);
    }
    if (step === 3) {
      // Typewriter for preface
      setTypedText("");
      let idx = 0;
      const fullText = oraclePrefaceText;
      const interval = setInterval(() => {
        idx++;
        setTypedText(fullText.slice(0, idx));
        if (idx >= fullText.length) {
          clearInterval(interval);
          setTimeout(() => {
            setShowDiscrepancy(true);
            setStep(4);
          }, 400);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step, autoPlay]);

  // Status icon animation
  const statusIcon = step < 2 ? "\u23F3" : step < 3 ? "\u{1F914}" : step < 4 ? "\u{1F9E0}" : "\u2705";
  const statusText = step < 2 ? "oracle is processing..." : step < 3 ? "oracle is thinking..." : step < 4 ? "oracle is cross-referencing..." : "oracle found something.";

  return (
    <section style={{
      padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)",
      background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 50%, ${C.bg} 100%)`,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal><Label>oracle in action</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.15, marginBottom: 16,
          }}>
            Not a search engine.{" "}
            <span style={{ color: C.g400, fontStyle: "italic" }}>A co-worker.</span>
          </h2>
          <p style={{ fontFamily: FONT.b, fontSize: 16, color: C.t3, marginBottom: 48 }}>
            Watch oracle catch a discrepancy your team missed.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div ref={ref} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
            padding: "clamp(28px, 4vw, 48px)", position: "relative", overflow: "hidden",
          }}>
            {/* Oracle ambient glow */}
            <div style={{
              position: "absolute", top: -60, right: -60, width: 200, height: 200,
              background: `radial-gradient(circle, ${C.gGlow} 0%, transparent 70%)`,
              animation: "orbPulse 4s ease-in-out infinite", pointerEvents: "none",
            }} />

            {/* Status bar with animated icon */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 24,
              padding: "8px 14px", borderRadius: 8, background: C.gMuted,
              width: "fit-content",
            }}>
              <span className="status-icon" style={{ fontSize: 12, display: "inline-block" }}>{statusIcon}</span>
              <span style={{ fontFamily: FONT.m, fontSize: 11, color: C.t3 }}>
                {statusText}
              </span>
            </div>

            {/* User message */}
            <div style={{
              display: "flex", gap: 14, marginBottom: 24, alignItems: "flex-start",
              opacity: step >= 1 ? 1 : 0, transform: step >= 1 ? "none" : "translateY(12px)",
              transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: C.p700, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT.b, fontSize: 14, fontWeight: 600, color: C.p300, marginTop: 2,
              }}>Y</div>
              <div style={{
                background: "rgba(107,33,168,0.08)", borderRadius: "4px 14px 14px 14px", padding: "14px 20px",
                fontFamily: FONT.b, fontSize: 15, color: C.t1, lineHeight: 1.6,
              }}>
                Prep me for the Redline Health call tomorrow at 2pm.
              </div>
            </div>

            {/* Oracle response with typewriter */}
            <div style={{
              display: "flex", gap: 14, marginBottom: 24, alignItems: "flex-start",
              opacity: step >= 2 ? 1 : 0, transform: step >= 2 ? "none" : "translateY(12px)",
              transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: `linear-gradient(135deg, ${C.p500}, ${C.g400})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT.d, fontSize: 16, fontWeight: 700, color: "#fff", marginTop: 2,
                animation: "orbPulse 4s ease-in-out infinite",
              }}>O</div>
              <div style={{
                background: C.gMuted, borderRadius: "4px 14px 14px 14px", padding: "18px 22px",
                fontFamily: FONT.b, fontSize: 14, color: C.t1, lineHeight: 1.8, flex: 1, minWidth: 0,
              }}>
                {/* Step 2: typing thinking text */}
                {step === 2 && (
                  <span style={{ color: C.t2 }}>{typedText}<span className="cursor-blink">|</span></span>
                )}
                {/* Step 3: thinking done, typing preface */}
                {step === 3 && (
                  <>
                    <span style={{ color: C.t2 }}>{oracleThinkingText}</span>
                    <br /><br />
                    <span style={{ fontWeight: 600 }}>{typedText}<span className="cursor-blink">|</span></span>
                  </>
                )}
                {/* Step 4: all done, show discrepancy */}
                {step >= 4 && (
                  <>
                    <span style={{ color: C.t2 }}>{oracleThinkingText}</span>
                    <br /><br />
                    <span style={{ fontWeight: 600 }}>{oraclePrefaceText}</span>
                    <br /><br />
                    <div style={{
                      margin: "12px 0", padding: "14px 18px", borderRadius: 10,
                      background: "rgba(212,168,83,0.06)", border: `1px solid ${C.borderH}`,
                      opacity: showDiscrepancy ? 1 : 0,
                      transform: showDiscrepancy ? "none" : "translateY(8px)",
                      transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <span style={{ fontFamily: FONT.m, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#e8a040", fontWeight: 600 }}>DISCREPANCY DETECTED</span>
                      </div>
                      <p style={{ fontFamily: FONT.b, fontSize: 13, color: C.t2, lineHeight: 1.7 }}>
                        In your <span style={{ color: C.g400 }}>proposal from Oct 12</span>, you quoted Redline a $4,200/mo rate.
                        But in the <span style={{ color: C.g400 }}>Slack thread with Marcus (Oct 19)</span>, you mentioned $3,800/mo as the "agreed number."
                      </p>
                      <p style={{ fontFamily: FONT.b, fontSize: 13, color: C.t2, lineHeight: 1.7, marginTop: 8 }}>
                        The signed SOW (Oct 24) says <span style={{ fontWeight: 600, color: C.t1 }}>$4,200</span>. Redline may bring up $3,800 on the call.
                      </p>
                    </div>
                    <span style={{ fontFamily: FONT.m, fontSize: 11, color: C.t3 }}>3 sources cross-referenced &middot; 14 related documents reviewed</span>
                  </>
                )}
              </div>
            </div>

            {/* Replay button */}
            {step >= 4 && (
              <button
                onClick={() => { setAutoPlay(true); setStep(0); setTypedText(""); setShowDiscrepancy(false); setTimeout(() => setStep(1), 400); }}
                style={{
                  background: "none", border: `1px solid ${C.border}`, borderRadius: 6,
                  padding: "8px 16px", cursor: "pointer", fontFamily: FONT.m, fontSize: 11,
                  color: C.t3, letterSpacing: 1, transition: "all 0.3s",
                  display: "block", margin: "0 auto",
                }}
                onMouseEnter={e => { e.target.style.borderColor = C.g400; e.target.style.color = C.g400; }}
                onMouseLeave={e => { e.target.style.borderColor = C.border; e.target.style.color = C.t3; }}
              >REPLAY</button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   KNOWLEDGE GRAPH — Live Force-Directed Visualization
   ═══════════════════════════════════════════ */
function LiveGraphViz({ size = 500, active = false }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const nodesRef = useRef(null);
  const edgesRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Cluster colors — 6 clusters, all positioned within a circle
    const half = size / 2;
    const graphRadius = size * 0.44; // circular boundary
    const clusters = [
      { color: [107, 33, 168], glow: [147, 51, 234], cx: 0.38, cy: 0.30, r: 0.16, count: 130 },  // purple — people
      { color: [201, 168, 76], glow: [232, 200, 120], cx: 0.65, cy: 0.32, r: 0.14, count: 100 },  // gold — opportunities
      { color: [59, 23, 100], glow: [107, 33, 168], cx: 0.55, cy: 0.60, r: 0.15, count: 110 },    // deep purple — frameworks
      { color: [168, 85, 247], glow: [212, 168, 83], cx: 0.30, cy: 0.58, r: 0.13, count: 80 },    // bright purple — commitments
      { color: [212, 168, 83], glow: [240, 220, 160], cx: 0.72, cy: 0.56, r: 0.11, count: 60 },   // gold accent — relationships
      { color: [56, 189, 176], glow: [100, 230, 218], cx: 0.50, cy: 0.72, r: 0.12, count: 70 },   // teal — technology/tools
    ];

    // Generate nodes — constrained to circular boundary
    if (!nodesRef.current) {
      const nodes = [];
      clusters.forEach((cluster, ci) => {
        for (let i = 0; i < cluster.count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * cluster.r * size;
          let x = cluster.cx * size + Math.cos(angle) * dist;
          let y = cluster.cy * size + Math.sin(angle) * dist;
          // Clamp to circle
          const dx = x - half, dy = y - half;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > graphRadius) {
            x = half + (dx / d) * graphRadius * (0.92 + Math.random() * 0.08);
            y = half + (dy / d) * graphRadius * (0.92 + Math.random() * 0.08);
          }
          const nodeSize = 0.6 + Math.random() * 2.2;
          nodes.push({
            x, y,
            vx: (Math.random() - 0.5) * 0.1,
            vy: (Math.random() - 0.5) * 0.1,
            size: nodeSize,
            cluster: ci,
            color: cluster.color,
            glow: cluster.glow,
            homeX: x, homeY: y,
            pulseOffset: Math.random() * Math.PI * 2,
            brightness: 0.4 + Math.random() * 0.6,
          });
        }
      });
      nodesRef.current = nodes;

      // Generate edges — denser within clusters + more cross-cluster bridges
      const edges = [];
      nodes.forEach((n, i) => {
        nodes.forEach((m, j) => {
          if (j <= i) return;
          const dx = n.x - m.x, dy = n.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          // Same cluster — connect if close
          if (n.cluster === m.cluster && dist < cluster_r(n.cluster) * 0.6 && Math.random() < 0.12) {
            edges.push({ a: i, b: j, strength: 0.4 + Math.random() * 0.6 });
          }
          // Cross-cluster bridges
          if (n.cluster !== m.cluster && dist < size * 0.2 && Math.random() < 0.008) {
            edges.push({ a: i, b: j, strength: 0.2 + Math.random() * 0.3, bridge: true });
          }
        });
      });
      edgesRef.current = edges;

      function cluster_r(ci) { return clusters[ci].r * size; }
    }

    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    let startTime = Date.now();

    function draw() {
      frameRef.current = requestAnimationFrame(draw);
      const t = (Date.now() - startTime) / 1000;
      ctx.clearRect(0, 0, size, size);

      // Gentle node drift — clamped to circular boundary
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        // Pull back toward home position
        n.x += (n.homeX - n.x) * 0.003;
        n.y += (n.homeY - n.y) * 0.003;
        // Enforce circular boundary
        const dx = n.x - half, dy = n.y - half;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > graphRadius) {
          n.x = half + (dx / d) * graphRadius;
          n.y = half + (dy / d) * graphRadius;
          n.vx *= -0.3;
          n.vy *= -0.3;
        }
        // Subtle breathing
        n.vx += (Math.random() - 0.5) * 0.015;
        n.vy += (Math.random() - 0.5) * 0.015;
        n.vx *= 0.98;
        n.vy *= 0.98;
      });

      // Draw edges
      edges.forEach(e => {
        const a = nodes[e.a], b = nodes[e.b];
        const alpha = e.bridge
          ? 0.06 + Math.sin(t * 0.8 + e.a) * 0.03
          : 0.03 + e.strength * 0.04;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        if (e.bridge) {
          ctx.strokeStyle = `rgba(212, 168, 83, ${alpha})`;
          ctx.lineWidth = 0.8;
        } else {
          ctx.strokeStyle = `rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, ${alpha})`;
          ctx.lineWidth = 0.5;
        }
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach(n => {
        const pulse = Math.sin(t * 1.2 + n.pulseOffset) * 0.3 + 0.7;
        const sz = n.size * pulse;
        const alpha = n.brightness * (0.6 + pulse * 0.4);

        // Glow
        if (n.size > 2) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, sz * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${n.glow[0]}, ${n.glow[1]}, ${n.glow[2]}, ${alpha * 0.06})`;
          ctx.fill();
        }

        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${alpha})`;
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(n.x, n.y, sz * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.glow[0]}, ${n.glow[1]}, ${n.glow[2]}, ${alpha * 0.8})`;
        ctx.fill();
      });
    }

    draw();
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [size, active]);

  return <canvas ref={canvasRef} style={{ width: size, height: size, display: "block", borderRadius: 24 }} />;
}

/* ═══════════════════════════════════════════
   SECTION 5.5: KNOWLEDGE GRAPH — Orb → Graph Reveal
   ═══════════════════════════════════════════ */
function KnowledgeGraphSection() {
  const [revealed, setRevealed] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSectionVisible(true);
          setTimeout(() => setRevealed(true), 2500);
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} style={{
      padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal><Label>The Architecture</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 52px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.12, marginBottom: 20,
          }}>
            Underneath every answer:{" "}
            <span style={{
              background: `linear-gradient(135deg, ${C.g400}, ${C.p300})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>a knowledge graph.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{
            fontFamily: FONT.b, fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.75,
            color: C.t2, maxWidth: 700, marginBottom: 56,
          }}>
            Most AI tools answer questions from flat context windows. oracle builds a persistent, cross-referenced knowledge graph from every source your business has ever created — people, commitments, opportunities, frameworks, relationships — all interconnected. Every new conversation makes the graph deeper. Every new source makes the answers sharper.
          </p>
        </Reveal>

        <div className="kg-visual" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 4vw, 64px)",
          alignItems: "center",
        }}>
          {/* Left: Orb → Live Graph crossfade — no container box */}
          <Reveal delay={0.2}>
            <div style={{
              position: "relative", width: "100%", aspectRatio: "1 / 1",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* Orb layer — fades out */}
              <div style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                opacity: sectionVisible ? (revealed ? 0 : 1) : 0,
                transition: "opacity 1.5s cubic-bezier(0.16,1,0.3,1)",
                zIndex: 2,
              }}>
                {sectionVisible && <OracleOrbWebGL state="energy" size={500} />}
              </div>

              {/* Live graph layer — fades in */}
              <div style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                opacity: revealed ? 1 : 0,
                transition: "opacity 1.5s cubic-bezier(0.16,1,0.3,1) 0.3s",
                zIndex: 1,
              }}>
                {sectionVisible && <LiveGraphViz size={500} active={revealed} />}
              </div>
            </div>
          </Reveal>

          {/* Right: what the graph does for YOUR business */}
          <div>
            <Reveal delay={0.25}>
              <div style={{ marginBottom: 40 }}>
                {[
                  {
                    headline: "Every source, connected.",
                    desc: "Calls, emails, documents, Slack, CRM, invoices — oracle doesn't just store them. It maps the relationships between them. A name in a transcript links to a deal in your CRM, a commitment in an email, and a follow-up that never happened.",
                  },
                  {
                    headline: "It gets smarter every day.",
                    desc: "Every conversation you have, every file you upload, every tool you connect deepens the graph. By day seven, oracle knows your business better than any new hire could learn it in six months.",
                  },
                  {
                    headline: "Cross-referencing, not search.",
                    desc: "Search finds what you ask for. The graph finds what you didn't know to ask — contradictions between what was promised and what was invoiced, opportunities that went cold, commitments that were never followed up.",
                  },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: 32 }}>
                    <h3 style={{
                      fontFamily: FONT.d, fontSize: "clamp(20px, 2vw, 26px)", fontWeight: 500,
                      color: C.g400, lineHeight: 1.2, marginBottom: 8,
                    }}>{item.headline}</h3>
                    <p style={{ fontFamily: FONT.b, fontSize: 14, color: C.t2, lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div style={{
                padding: "20px 24px", borderRadius: 12,
                background: C.glass, border: `1px solid ${C.glassBorder}`,
                backdropFilter: "blur(12px)",
              }}>
                <p style={{ fontFamily: FONT.m, fontSize: 11, color: C.t3, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>
                  Beyond file-system RAG
                </p>
                <p style={{ fontFamily: FONT.b, fontSize: 14, color: C.t2, lineHeight: 1.65 }}>
                  Most AI tools paste your files into a context window and hope for the best. oracle builds a persistent knowledge graph with vectorized embeddings, semantic edges, and entity resolution — so it reasons across your data, not just retrieves from it.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 6: USE CASES — Horizontal Tab Bar
   ═══════════════════════════════════════════ */
function UseCases() {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef([]);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const autoRotateRef = useRef(null);

  const tabs = [
    {
      role: "Founders & CEOs",
      items: [
        { title: "Commitment tracking", desc: "oracle cross-references every promise made in calls, emails, and Slack \u2014 and flags when follow-through stalls." },
        { title: "Investor update drafts", desc: "Monthly updates written from your actual data \u2014 revenue, hiring, product milestones \u2014 not templates." },
        { title: "Opportunity recovery", desc: "oracle surfaces deals that went cold, relationships that lapsed, and leads that never got a follow-up." },
      ],
    },
    {
      role: "Marketing & Growth",
      items: [
        { title: "Campaign intelligence", desc: "What messaging worked, what didn't, and why \u2014 sourced from call recordings, analytics, and team discussions." },
        { title: "Content from calls", desc: "Your best insights are in recordings. oracle extracts them into blog posts, social threads, and email sequences." },
        { title: "Competitive signals", desc: "Every mention of a competitor across every source \u2014 tracked, trended, and ready for your strategy." },
      ],
    },
    {
      role: "Operations",
      items: [
        { title: "Process automation", desc: "oracle identifies repetitive tasks across your tools and automates them with governed workflows." },
        { title: "Vendor tracking", desc: "Contract terms, renewal dates, pricing changes, and performance \u2014 all in one place." },
        { title: "Team context", desc: "New hire? oracle gives them the full context of every project, decision, and relationship \u2014 instantly." },
      ],
    },
    {
      role: "Agencies",
      items: [
        { title: "Per-client knowledge", desc: "Each client gets their own oracle with their own data \u2014 no cross-contamination, full context." },
        { title: "Cross-client patterns", desc: "What's working across all clients? oracle surfaces patterns you'd never see manually." },
        { title: "Automated reporting", desc: "Client reports generated from actual data sources, not spreadsheets someone forgot to update." },
      ],
    },
  ];

  // Measure actual tab button positions for underline
  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      const parent = el.parentElement;
      const parentRect = parent.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setUnderline({ left: elRect.left - parentRect.left, width: elRect.width });
    }
  }, [activeTab]);

  // Auto-rotate every 3 seconds
  useEffect(() => {
    autoRotateRef.current = setInterval(() => {
      setActiveTab(prev => (prev + 1) % tabs.length);
    }, 3000);
    return () => clearInterval(autoRotateRef.current);
  }, [tabs.length]);

  // Pause auto-rotate on manual click, resume after 6s
  const handleTabClick = (i) => {
    setActiveTab(i);
    clearInterval(autoRotateRef.current);
    autoRotateRef.current = setTimeout(() => {
      autoRotateRef.current = setInterval(() => {
        setActiveTab(prev => (prev + 1) % tabs.length);
      }, 3000);
    }, 6000);
  };

  return (
    <section style={{ padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal><Label>Use Cases</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.15, marginBottom: 48,
          }}>
            oracle works the way{" "}
            <span style={{ fontStyle: "italic", color: C.g400 }}>you</span> work.
          </h2>
        </Reveal>

        {/* Horizontal tab bar with sliding underline */}
        <Reveal delay={0.15}>
          <div style={{ position: "relative", marginBottom: 40, borderBottom: `1px solid ${C.border}` }}>
            <div className="uc-tabs" style={{ display: "flex", gap: 0 }}>
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  ref={el => tabRefs.current[i] = el}
                  onClick={() => handleTabClick(i)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: "14px 24px",
                    fontFamily: FONT.m, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase",
                    color: activeTab === i ? C.g400 : C.t3,
                    fontWeight: activeTab === i ? 600 : 400,
                    transition: "color 0.3s",
                    whiteSpace: "nowrap",
                    position: "relative",
                  }}
                >
                  {tab.role}
                </button>
              ))}
            </div>
            {/* Sliding underline — tracks actual button position */}
            <div style={{
              position: "absolute", bottom: -1, height: 2,
              background: `linear-gradient(90deg, ${C.g500}, ${C.g300})`,
              width: underline.width,
              left: underline.left,
              transition: "left 0.35s cubic-bezier(0.16,1,0.3,1), width 0.35s cubic-bezier(0.16,1,0.3,1)",
              borderRadius: 1,
            }} />
          </div>
        </Reveal>

        {/* Large content card */}
        <Reveal delay={0.2}>
          <GlassCard hoverable={false} style={{ padding: "clamp(32px, 4vw, 56px)" }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, ${C.g400}66, transparent)`,
            }} />
            <h3 style={{
              fontFamily: FONT.d, fontSize: "clamp(22px, 2.5vw, 30px)", fontWeight: 500,
              color: C.t1, marginBottom: 32,
            }}>
              {tabs[activeTab].role}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {tabs[activeTab].items.map((item, i) => (
                <div key={`${activeTab}-${i}`} style={{
                  display: "flex", alignItems: "flex-start", gap: 16,
                }}>
                  <span style={{
                    color: C.g400, fontSize: 14, marginTop: 3, flexShrink: 0,
                    fontFamily: FONT.m,
                  }}>{"\u2726"}</span>
                  <div>
                    <h4 style={{ fontFamily: FONT.b, fontSize: 17, fontWeight: 600, color: C.t1, marginBottom: 6 }}>{item.title}</h4>
                    <p style={{ fontFamily: FONT.b, fontSize: 15, color: C.t2, lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 7: SOCIAL PROOF — Full-Width Horizontal
   ═══════════════════════════════════════════ */
function SocialProof() {
  const quotes = [
    {
      text: "It's 98% accurate. And then the 2% that's broke, you just tell it to fix it, and it fixes all of it.",
      name: "Elijah Z.",
      role: "Business Owner, Restoration & Remodel",
      accent: C.g400,
    },
    {
      text: "If you can just tell me you'll save me X, Y, Z, because I can hire an AI to do it rather than a person... I'm in.",
      name: "Raj D.",
      role: "GTM Strategist, $3.5M Portfolio",
      accent: C.p400,
    },
    {
      text: "The entire business is getting closers spending their time on warm leads, not doing admin work. That's what this replaces.",
      name: "Dustin M.",
      role: "CEO, Insurance Distribution",
      accent: C.p300,
    },
    {
      text: "I've been banging my head against the wall for 4 months trying to build an intelligence layer. This is what I was trying to build.",
      name: "Robbie T.",
      role: "Agency Founder",
      accent: C.g400,
    },
  ];

  return (
    <section style={{
      padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)",
      background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bg2} 50%, ${C.bg} 100%)`,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal><Label>What They Said</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.15, marginBottom: 56,
          }}>
            The problem is real.{" "}
            <span style={{ color: C.t3, fontStyle: "italic" }}>They told us themselves.</span>
          </h2>
        </Reveal>

        {/* Full-width horizontal quotes */}
        <div className="proof-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32,
        }}>
          {quotes.map((q, i) => (
            <Reveal key={i} delay={0.15 + i * 0.1}>
              <div style={{
                borderLeft: `3px solid ${q.accent}`,
                paddingLeft: 28,
                paddingTop: 8,
                paddingBottom: 8,
                height: "100%",
                display: "flex", flexDirection: "column",
              }}>
                {/* Large quotation mark */}
                <div style={{
                  fontFamily: FONT.d, fontSize: 72, color: C.g400, lineHeight: 0.8,
                  marginBottom: 16, opacity: 0.25, userSelect: "none",
                }}>&ldquo;</div>
                <p style={{
                  fontFamily: FONT.b, fontSize: 17, color: C.t1, lineHeight: 1.75,
                  fontStyle: "italic", marginBottom: 28, flex: 1,
                }}>{q.text}</p>
                <div>
                  <div style={{ fontFamily: FONT.b, fontSize: 15, fontWeight: 600, color: C.t1 }}>{q.name}</div>
                  <div style={{ fontFamily: FONT.m, fontSize: 11, color: C.t3, letterSpacing: 1, marginTop: 2 }}>{q.role}</div>
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
   SECTION 8: PRICING
   ═══════════════════════════════════════════ */
function Pricing() {
  const [openFaq, setOpenFaq] = useState(null);

  const tiers = [
    {
      name: "Free",
      model: "Done by you",
      tagline: "Connect your tools. See what oracle finds.",
      price: "$0",
      priceSub: "forever",
      audience: "Anyone curious",
      features: [
        "Unlimited tool connections (read-only)",
        "500 files processed",
        "Auto model routing (Haiku + Sonnet)",
        "Knowledge graph builds in background",
      ],
      guarantee: "If oracle can't execute at least 3 tasks for you a day, we failed.",
      cta: "Get Started Free",
      ctaPrimary: true,
      featured: false,
      href: APP,
    },
    {
      name: "Starter",
      model: "Done by you",
      tagline: "oracle reads, writes, and acts across your tools.",
      price: "$1,500\u2013$3,000",
      priceSub: "/month",
      audience: "1\u20135 employees \u00b7 $500K\u2013$3M revenue",
      features: [
        "Read/write tool connections",
        "Scheduled automations",
        "Governed actions: propose-before-execute",
        "Full knowledge graph + entity matching",
      ],
      cta: "Book a Discovery Sprint",
      ctaPrimary: false,
      featured: false,
      href: CAL,
    },
    {
      name: "Growth",
      model: "Done with you",
      tagline: "Cross-source intelligence. Proactive alerts. Full governance.",
      price: "$3,000\u2013$7,500",
      priceSub: "/month",
      audience: "5\u201320 employees \u00b7 $3M\u2013$10M revenue",
      features: [
        "Everything in Starter",
        "Cross-source validation + contradiction detection",
        "Proactive alerts + opportunity recovery",
        "Full 12-agent governance suite",
        "Dedicated onboarding support",
      ],
      cta: "Book a Discovery Sprint",
      ctaPrimary: true,
      featured: true,
      href: CAL,
    },
    {
      name: "Custom",
      model: "Done for you",
      tagline: "White-glove deployment. We build and operate it.",
      price: "Custom",
      priceSub: null,
      audience: "15+ employees \u00b7 high revenue \u00b7 complex tool stack or sensitive data",
      features: [
        "Everything in Growth",
        "Dedicated account manager",
        "Custom governance rules + industry calibration",
        "Unlimited automations + integrations",
        "SLA guarantees + quarterly reviews",
      ],
      cta: "Talk to Us",
      ctaPrimary: false,
      featured: false,
      href: CAL,
    },
  ];

  const faqs = [
    ["How quickly does oracle go live?", "Minutes. Sign in, connect your tools, and oracle has live access to your business data immediately via API. The knowledge graph builds in the background over the first seven days \u2014 running overnight experiments, getting smarter with every conversation. By day seven, oracle is at full power."],
    ["What tools does oracle connect to?", "3,000+ tools via Pipedream: Gmail, Calendar, Slack, QuickBooks, Stripe, HubSpot, Notion, Google Drive, Salesforce, Jira, Asana, and thousands more. If you use it, oracle connects to it."],
    ["Do I need to change my workflow?", "No. oracle works inside the tools you already use. It reads from them, writes to them, and acts through them. You don't adapt to oracle \u2014 oracle adapts to you."],
    ["What does 'governed' mean?", "Every action oracle takes is logged, cited, and controlled. On Starter, oracle proposes actions before executing. On Growth+, the full 12-agent governance suite reviews every decision. You always have an audit trail."],
    ["How is this different from ChatGPT, Zapier, or Viktor?", "ChatGPT gives you text. Zapier follows rules you write. Viktor lives in Slack. oracle connects to all your tools, reads your entire business history, cross-references everything, and does actual work \u2014 governed, cited, and grounded in your data."],
    ["Can I bring my own API keys?", "Yes. Available as a cost modifier on any paid tier. We'll discuss during your Discovery Sprint."],
    ["Is my data private?", "Your data never touches another tenant's oracle. Isolation is enforced at the infrastructure level \u2014 by architecture, not policy."],
  ];

  return (
    <section id="pricing" style={{ padding: "clamp(80px, 10vw, 140px) clamp(24px, 5vw, 120px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal><Label>Investment</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.15, marginBottom: 16,
          }}>
            Start free. Scale when oracle proves itself.
          </h2>
          <p style={{
            fontFamily: FONT.b, fontSize: 17, color: C.t2, marginBottom: 48,
          }}>
            No credit card. No demo call. Connect your tools and let oracle work.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 80 }}>
          {tiers.map((tier, i) => (
            <Reveal key={i} delay={0.1 + i * 0.08}>
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
        borderRadius: 16, padding: "clamp(24px, 2.5vw, 36px)",
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

      {tier.featured && (
        <div style={{
          position: "absolute", top: 14, right: 14, padding: "4px 10px", borderRadius: 6,
          background: `linear-gradient(135deg, ${C.g500}, ${C.g300})`, fontFamily: FONT.m,
          fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: C.bg, fontWeight: 600,
        }}>Popular</div>
      )}

      {/* Model label */}
      <div style={{
        fontFamily: FONT.m, fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
        color: C.g400, marginBottom: 8, opacity: 0.7,
      }}>{tier.model}</div>

      <h3 style={{ fontFamily: FONT.d, fontSize: 22, fontWeight: 600, color: C.t1, margin: "0 0 6px", lineHeight: 1.2 }}>{tier.name}</h3>
      <p style={{ fontFamily: FONT.b, fontSize: 13, color: C.t3, marginBottom: 4, lineHeight: 1.5 }}>{tier.tagline}</p>

      {/* Audience */}
      {tier.audience && (
        <p style={{ fontFamily: FONT.m, fontSize: 10, color: C.t4, letterSpacing: 0.5, marginBottom: 16 }}>{tier.audience}</p>
      )}

      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
        <span style={{ fontFamily: FONT.d, fontSize: "clamp(28px, 2.5vw, 36px)", fontWeight: 400, color: C.g400 }}>{tier.price}</span>
        {tier.priceSub && <span style={{ fontFamily: FONT.b, fontSize: 14, color: C.t3 }}>{tier.priceSub}</span>}
      </div>

      <div style={{ height: 1.5, background: `linear-gradient(90deg, ${C.g400}, transparent)`, width: 40, margin: "0 0 20px" }} />

      <div style={{ flex: 1 }}>
        {tier.features.map((feat, j) => (
          <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "6px 0" }}>
            <span style={{ color: C.g400, fontSize: 10, marginTop: 4, flexShrink: 0 }}>{"\u2726"}</span>
            <span style={{ fontFamily: FONT.b, fontSize: 13, color: C.t1, lineHeight: 1.5 }}>{feat}</span>
          </div>
        ))}
      </div>

      {tier.guarantee && (
        <div style={{
          marginTop: 16, padding: "10px 14px", borderRadius: 8,
          background: C.gMuted, border: `1px solid ${C.border}`,
        }}>
          <p style={{ fontFamily: FONT.m, fontSize: 11, color: C.g400, lineHeight: 1.6, fontStyle: "italic" }}>{tier.guarantee}</p>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <Btn primary={tier.ctaPrimary} href={tier.href} style={{ width: "100%", textAlign: "center", padding: "13px 20px", fontSize: 11 }}>
          {tier.cta}
        </Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SECTION 9: INTEGRATIONS — Real Logos
   ═══════════════════════════════════════════ */
function Integrations() {
  const tools = [
    { name: "Gmail", logo: TOOL_LOGOS.Gmail },
    { name: "Calendar", logo: TOOL_LOGOS.Calendar },
    { name: "Slack", logo: TOOL_LOGOS.Slack },
    { name: "QuickBooks", logo: TOOL_LOGOS.QuickBooks },
    { name: "Stripe", logo: TOOL_LOGOS.Stripe },
    { name: "HubSpot", logo: TOOL_LOGOS.HubSpot },
    { name: "Notion", logo: TOOL_LOGOS.Notion },
    { name: "Drive", logo: TOOL_LOGOS.Drive },
    { name: "Salesforce", logo: TOOL_LOGOS.Salesforce },
    { name: "Zoom", logo: TOOL_LOGOS.Zoom },
    { name: "Loom", logo: TOOL_LOGOS.Loom },
    { name: "Dropbox", logo: TOOL_LOGOS.Dropbox },
    { name: "Teams", logo: TOOL_LOGOS.Teams },
    { name: "Telegram", logo: TOOL_LOGOS.Telegram },
    { name: "Figma", logo: TOOL_LOGOS.Figma },
    { name: "Jira", logo: TOOL_LOGOS.Jira },
    { name: "Asana", logo: TOOL_LOGOS.Asana },
    { name: "Shopify", logo: TOOL_LOGOS.Shopify },
    { name: "GitHub", logo: TOOL_LOGOS.GitHub },
    { name: "Airtable", logo: TOOL_LOGOS.Airtable },
    { name: "3,000+ more", logo: null },
  ];

  // Double the array for seamless loop
  const marqueeTools = [...tools, ...tools];

  return (
    <section style={{
      padding: "clamp(60px, 8vw, 100px) 0",
      background: C.bg2, position: "relative", overflow: "hidden",
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 clamp(24px, 5vw, 120px)", position: "relative" }}>
        <Reveal><Label>Integrations</Label></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.15, marginBottom: 16,
          }}>
            oracle connects to everything you use.
          </h2>
          <p style={{ fontFamily: FONT.b, fontSize: 17, color: C.t2, marginBottom: 48 }}>
            3,000+ tools via Pipedream. If your team uses it, oracle already works with it.
          </p>
        </Reveal>
      </div>

      {/* Marquee scroll — full width, edge fade */}
      <div style={{ position: "relative" }}>
        {/* Left fade */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 120, zIndex: 2,
          background: `linear-gradient(90deg, ${C.bg2}, transparent)`, pointerEvents: "none",
        }} />
        {/* Right fade */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 120, zIndex: 2,
          background: `linear-gradient(270deg, ${C.bg2}, transparent)`, pointerEvents: "none",
        }} />

        <div className="marquee-track" style={{
          display: "flex", gap: 16, width: "max-content",
          animation: "marqueeScroll 45s linear infinite",
        }}>
          {marqueeTools.map((tool, i) => (
            <div key={i} style={{
              flexShrink: 0, width: 120,
              background: C.glass, border: `1px solid ${C.glassBorder}`,
              borderStyle: tool.logo ? "solid" : "dashed",
              borderRadius: 12, padding: "18px 12px", textAlign: "center",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              backdropFilter: "blur(8px)",
            }}>
              {tool.logo ? (
                <img src={tool.logo} alt={`${tool.name} logo`} width={24} height={24} style={{ opacity: 0.8 }} />
              ) : (
                <div style={{
                  width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FONT.m, fontSize: 18, color: C.g400, opacity: 0.5,
                }}>+</div>
              )}
              <div style={{ fontFamily: FONT.b, fontSize: 11, fontWeight: 500, color: C.t3, whiteSpace: "nowrap" }}>{tool.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 10: THE PLATFORM
   ═══════════════════════════════════════════ */
function Platform() {
  const points = [
    {
      title: "Intelligence that compounds.",
      body: "Each new source processed deepens cross-references, surfaces patterns across longer timelines, and teaches oracle more about how your business actually operates.",
    },
    {
      title: "Your data. Only your data.",
      body: "oracle never sees another tenant's information \u2014 by architecture, not by policy. Isolation is enforced at the infrastructure level.",
    },
    {
      title: "12-agent governance suite.",
      body: "Every action oracle takes passes through a governed pipeline. Cited sources. Audit trails. Propose-before-execute. This isn't a chatbot \u2014 it's controlled intelligence.",
    },
    {
      title: "Every deployment makes the next one smarter.",
      body: "Each vertical we deploy into makes the next deployment faster and more accurate. The 50th deployment costs a fraction of the first.",
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
            Built to run your business.{" "}
            <span style={{ color: C.t3, fontStyle: "italic" }}>Not just answer questions.</span>
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
   SECTION 11: FINAL CTA
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
            animation: "orbPulse 4s ease-in-out infinite",
          }}>O</div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: FONT.d, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 400,
            color: C.t1, lineHeight: 1.12, marginBottom: 20,
          }}>
            Get started free.
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p style={{
            fontFamily: FONT.b, fontSize: 17, lineHeight: 1.75, color: C.t2, marginBottom: 12,
          }}>
            500 files processed. First briefing in 30 minutes.
          </p>
          <p style={{
            fontFamily: FONT.b, fontSize: 15, lineHeight: 1.75, color: C.t3, marginBottom: 40,
          }}>
            No credit card. No demo call. Just connect your tools and let oracle work.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn href={APP} style={{ padding: "18px 44px", fontSize: 13 }}>
              Get Started Free
            </Btn>
            <Btn primary={false} href={CAL} style={{ padding: "18px 32px", fontSize: 13 }}>
              Book a Discovery Sprint
            </Btn>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <p style={{ fontFamily: FONT.m, fontSize: 11, color: C.t3, marginTop: 32 }}>
            isaiah@orectic.ai &middot; Austin, TX
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <a href={APP} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: FONT.m, fontSize: 11, color: C.t4, textDecoration: "none",
            display: "inline-block", marginTop: 12, transition: "color 0.3s",
          }}
          onMouseEnter={e => e.target.style.color = C.g400}
          onMouseLeave={e => e.target.style.color = C.t4}
          >
            Already have an account? Log in &rarr;
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SECTION 12: FOOTER
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
        &copy; 2026 Orectic &middot; orectic.ai &middot; Austin, TX
      </span>
      <span style={{ color: C.t4 }}>&middot;</span>
      <a href="/privacy" style={{ fontFamily: FONT.m, fontSize: 11, color: C.t4, textDecoration: "none" }}>Privacy</a>
      <a href="/terms" style={{ fontFamily: FONT.m, fontSize: 11, color: C.t4, textDecoration: "none" }}>Terms</a>
      <a href="mailto:support@orectic.ai" style={{ fontFamily: FONT.m, fontSize: 11, color: C.t4, textDecoration: "none" }}>Support</a>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   ROOT
   ═══════════════════════════════════════════ */
export default function OrecticV5() {
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
        @keyframes marqueeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes orbPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes orbRingSpin1 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbRingSpin2 {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes orbDotFloat1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(8px, -6px); }
          50% { transform: translate(-4px, -10px); }
          75% { transform: translate(-8px, 4px); }
        }
        @keyframes orbDotFloat2 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-10px, 5px); }
          66% { transform: translate(6px, 8px); }
        }
        @keyframes orbDotFloat3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -8px); }
        }
        @keyframes orbCoreGlow {
          0%, 100% { box-shadow: 0 0 60px rgba(212,168,83,0.18), 0 0 120px rgba(107,33,168,0.15), inset 0 0 30px rgba(255,255,255,0.05); }
          50% { box-shadow: 0 0 80px rgba(212,168,83,0.28), 0 0 160px rgba(107,33,168,0.22), inset 0 0 40px rgba(255,255,255,0.08); }
        }
        @keyframes statusPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .orb-ring-1 { animation: orbRingSpin1 20s linear infinite; }
        .orb-ring-2 { animation: orbRingSpin2 30s linear infinite; }
        .orb-ring-3 { animation: orbRingSpin1 40s linear infinite; }
        .orb-core { animation: orbCoreGlow 4s ease-in-out infinite; }
        .orb-dot-1 { animation: orbDotFloat1 8s ease-in-out infinite; }
        .orb-dot-2 { animation: orbDotFloat2 10s ease-in-out infinite; }
        .orb-dot-3 { animation: orbDotFloat3 12s ease-in-out infinite; }
        .status-icon { animation: statusPulse 2s ease-in-out infinite; }
        .cursor-blink { animation: cursorBlink 0.8s step-end infinite; font-weight: 300; color: ${C.g400}; }

        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 200ms !important; }
        }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: block !important; }
          .hero-split { flex-direction: column !important; }
          .hero-text { flex: 1 1 100% !important; }
          .hero-orb { flex: 1 1 100% !important; max-width: 280px; margin: 0 auto; }
          .shift-table-head { display: none !important; }
          .shift-table-row { grid-template-columns: 1fr !important; }
          .hiw-steps { flex-direction: column !important; }
          .hiw-arrow { display: none !important; }
          .uc-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .proof-grid { grid-template-columns: 1fr !important; }
          .kg-visual { grid-template-columns: 1fr !important; }
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
        <Integrations />
        <TheShift />
        <MeshDivider variant={0} />
        <HowItWorks />
        <OracleDemo />
        <KnowledgeGraphSection />
        <UseCases />
        <SocialProof />
        <MeshDivider variant={1} />
        <Pricing />
        <Platform />
        <FinalCta />
        <Footer />
      </div>
    </>
  );
}
