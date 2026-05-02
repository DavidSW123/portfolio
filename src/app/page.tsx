"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";

/* ─────────────── PARTICLE CANVAS ─────────────── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    type Particle = { x: number; y: number; r: number; speed: number; opacity: number; drift: number };
    const particles: Particle[] = [];
    const COUNT = 160;

    function spawn(): Particle {
      return {
        x: Math.random() * (canvas?.width ?? 1440),
        y: Math.random() * (canvas?.height ?? 900) - (canvas?.height ?? 900),
        r: Math.random() * 1.8 + 0.2,
        speed: Math.random() * 1.4 + 0.4,
        opacity: Math.random() * 0.55 + 0.08,
        drift: (Math.random() - 0.5) * 0.3,
      };
    }

    resize();
    for (let i = 0; i < COUNT; i++) {
      const p = spawn();
      p.y = Math.random() * (canvas.height);
      particles.push(p);
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,200,230,${p.opacity})`;
        ctx.fill();
        p.y += p.speed;
        p.x += p.drift;
        if (p.y > canvas.height + 4) {
          Object.assign(p, spawn());
          p.y = -4;
        }
      }
      raf = requestAnimationFrame(draw);
    }

    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

/* ─────────────── POWER BUTTON SVG ─────────────── */
function PowerIcon({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <circle cx="48" cy="48" r="44" stroke="white" strokeWidth="2.5" strokeOpacity="0.9" />
      <line x1="48" y1="20" x2="48" y2="48" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M30 28.5A30 30 0 1 0 66 28.5"
        stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"
      />
    </svg>
  );
}

/* ─────────────── MAIN PAGE ─────────────── */
const BRANDS = ["BMW", "Mercedes-Benz", "Porsche", "Audi", "Ferrari", "Lamborghini", "Maserati", "Bentley", "Rolls-Royce", "Range Rover", "McLaren", "Aston Martin"];

export default function HomePage() {
  const { t, locale } = useLanguage();
  const [started, setStarted] = useState(false);
  const [fading, setFading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleStart() {
    setFading(true);
    setTimeout(() => setStarted(true), 700);
  }

  const lbl = (es: string, en: string, ru: string, de: string, it: string, fr: string, zh: string) =>
    ({ es, en, ru, de, it, fr, zh }[locale] ?? es);

  /* ── INTRO SCREEN ── */
  if (!started) {
    return (
      <div style={{
        position: "fixed", inset: 0, overflow: "hidden",
        background: "linear-gradient(160deg, #0b0f18 0%, #060a10 60%, #020408 100%)",
        display: "flex", flexDirection: "column",
        opacity: fading ? 0 : 1, transition: "opacity 0.7s ease",
      }}>
        <ParticleCanvas />

        {/* Extra depth gradients */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 30% 40%, rgba(30,50,100,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 40% at 70% 60%, rgba(10,20,50,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Navbar */}
        <nav style={{
          position: "relative", zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(1.5rem,5vw,3.5rem)", height: 72,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          {/* Logo — script style */}
          <div>
            <div style={{
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontSize: "clamp(1.3rem,2.5vw,1.8rem)", fontWeight: 700,
              color: "rgba(255,255,255,0.92)", letterSpacing: "0.02em", lineHeight: 1.1,
            }}>
              AutoImport Pro
            </div>
            <div style={{
              fontSize: 9, fontWeight: 400, letterSpacing: "0.28em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: 2,
            }}>
              Import &amp; Business Manager
            </div>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(1.2rem,3vw,2.5rem)", flexWrap: "wrap" }}>
            {[
              { href: "/catalog", label: t.nav.catalog },
              { href: "/login",   label: t.nav.login },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{
                fontSize: 12, fontWeight: 400, letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.65)", textDecoration: "none", transition: "color 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
              >
                {item.label}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Center: power + START */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "clamp(1rem,2.5vw,1.8rem)",
          position: "relative", zIndex: 10,
        }}>
          {/* Power button — clickable */}
          <button
            onClick={handleStart}
            aria-label="Start"
            style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              opacity: 0.9, transition: "opacity 0.2s, transform 0.2s",
              animation: "pulse 2.5s ease-in-out infinite",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            <PowerIcon size={typeof window !== "undefined" && window.innerWidth < 480 ? 72 : 100} />
          </button>

          {/* START text */}
          <button
            onClick={handleStart}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: 0,
              fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700,
              fontSize: "clamp(2.8rem,8vw,5.5rem)",
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.92)",
              textShadow: "0 0 40px rgba(255,255,255,0.15)",
              lineHeight: 1,
            }}
          >
            START
          </button>

          <p style={{
            fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)", marginTop: 4,
          }}>
            {lbl("Haz clic para entrar","Click to enter","Нажмите для входа","Klicken Sie hier","Clicca per entrare","Cliquez pour entrer","点击进入")}
          </p>
        </div>

        {/* Bottom brand strip */}
        <div style={{
          position: "relative", zIndex: 10,
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "14px 0", overflow: "hidden",
          background: "rgba(0,0,0,0.3)",
        }}>
          <div style={{ display: "flex", gap: "clamp(2rem,4vw,3.5rem)", animation: "marquee 28s linear infinite", width: "max-content" }}>
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)", whiteSpace: "nowrap" }}>
                {b}
              </span>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
          @keyframes pulse {
            0%, 100% { opacity: 0.9; }
            50% { opacity: 0.6; }
          }
        `}</style>
      </div>
    );
  }

  /* ── MAIN CONTENT (after START) ── */
  return (
    <div style={{
      background: "#000", color: "#fff", fontFamily: "var(--font-sans)", overflowX: "hidden",
      animation: "fadeIn 0.6s ease",
    }}>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(1.25rem,5vw,3rem)", height: 64,
        background: "rgba(0,0,0,0.88)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <button onClick={() => setStarted(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(1rem,2vw,1.25rem)", fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.02em" }}>
            AutoImport Pro
          </span>
          <span style={{ fontSize: 8, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginTop: 1 }}>
            Import &amp; Business Manager
          </span>
        </button>

        <div className="hidden md:flex" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {[{ href: "/catalog", label: t.nav.catalog }, { href: "/login", label: t.nav.login }].map((item) => (
            <Link key={item.href} href={item.href} style={{
              fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)", textDecoration: "none",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LanguageSwitcher />
          <Link href="/register" className="hidden sm:inline-flex" style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
            padding: "9px 18px", background: "var(--accent)", color: "#fff", textDecoration: "none",
          }}>
            {t.nav.register}
          </Link>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", padding: 4 }}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{ position: "fixed", inset: "64px 0 0 0", zIndex: 40, background: "rgba(0,0,0,0.97)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
          {[{ href: "/catalog", label: t.nav.catalog }, { href: "/login", label: t.nav.login }, { href: "/register", label: t.nav.register }].map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: item.href === "/register" ? "var(--accent)" : "rgba(255,255,255,0.8)", textDecoration: "none" }}>
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* HERO */}
      <section style={{
        minHeight: "100svh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "clamp(3rem,8vw,6rem) clamp(1.25rem,5vw,3rem)",
        position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg,#0b0f18 0%,#060a10 60%,#000 100%)",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 60% at 50% 20%,rgba(27,43,94,0.28) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "60vw", height: "30vh", background: "radial-gradient(ellipse,rgba(232,97,26,0.12) 0%,transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: 860 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.42em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "clamp(1.2rem,2.5vw,2rem)" }}>
            {lbl("Importación de vehículos de lujo","Luxury vehicle imports","Импорт премиальных авто","Luxusfahrzeuge importieren","Importazione veicoli di lusso","Importation de véhicules de luxe","豪华车辆进口")}
          </p>
          <h1 style={{
            fontFamily: "var(--font-serif)", fontWeight: 700, lineHeight: 1.0,
            fontSize: "clamp(2.8rem,8vw,6.5rem)", letterSpacing: "-0.02em", color: "#fff", margin: 0,
          }}>
            {t.hero.title}
            <br />
            <em style={{ color: "var(--accent)", fontStyle: "italic" }}>{t.hero.accent}</em>
          </h1>
          <div style={{ width: 48, height: 1, background: "var(--accent)", margin: "clamp(1.5rem,3vw,2.2rem) auto" }} />
          <p style={{ maxWidth: 520, margin: "0 auto", fontSize: "clamp(0.8rem,1.6vw,0.92rem)", fontWeight: 300, lineHeight: 1.8, letterSpacing: "0.02em", color: "rgba(255,255,255,0.48)" }}>
            {t.hero.subtitle}
          </p>
          <div style={{ marginTop: "clamp(2rem,4vw,3rem)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "clamp(0.7rem,1.4vw,0.9rem) clamp(1.5rem,2.5vw,2rem)", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", background: "var(--accent)", color: "#fff", textDecoration: "none" }}>
              {t.hero.cta1} <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
            <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "clamp(0.7rem,1.4vw,0.9rem) clamp(1.5rem,2.5vw,2rem)", fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.18)", textDecoration: "none" }}>
              {t.hero.cta2}
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "grid", gridTemplateColumns: "repeat(2,1fr)" }} className="sm-4col">
        {t.stats.map((s, i) => (
          <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(1.25rem,3vw,2rem) 1rem", borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.06)" : undefined, borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}>{s.value}</span>
            <span style={{ marginTop: 6, fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", textAlign: "center" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* BRANDS MARQUEE */}
      <div style={{ background: "#030303", padding: "16px 0", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", gap: "clamp(2rem,5vw,4rem)", animation: "marquee 28s linear infinite", width: "max-content" }}>
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.14)", whiteSpace: "nowrap" }}>{b}</span>
          ))}
        </div>
      </div>

      {/* PROCESS */}
      <section style={{ padding: "clamp(4rem,10vw,8rem) clamp(1.25rem,5vw,3rem)", background: "#000" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: "clamp(2.5rem,6vw,5rem)" }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14 }}>{lbl("Cómo trabajamos","How we work","Как мы работаем","So arbeiten wir","Come lavoriamo","Comment nous travaillons","我们如何工作")}</p>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem,4.5vw,3rem)", fontWeight: 700, lineHeight: 1.1, color: "#fff", margin: 0 }}>
                {lbl("Simple. Rápido. Seguro.","Simple. Fast. Secure.","Просто. Быстро. Надёжно.","Einfach. Schnell. Sicher.","Semplice. Veloce. Sicuro.","Simple. Rapide. Sûr.","简单。快速。安全。")}
              </h2>
            </div>
            <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none", paddingBottom: 3, borderBottom: "1px solid var(--accent)", flexShrink: 0 }}>
              {t.nav.catalog} <ArrowUpRight style={{ width: 11, height: 11 }} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 1, background: "rgba(255,255,255,0.06)" }}>
            {[
              { n: "01", t: lbl("Consulta gratuita","Free consultation","Бесплатная консультация","Kostenlose Beratung","Consulenza gratuita","Consultation gratuite","免费咨询") },
              { n: "02", t: lbl("Selección del vehículo","Vehicle selection","Выбор автомобиля","Fahrzeugauswahl","Selezione del veicolo","Sélection du véhicule","车辆选择") },
              { n: "03", t: lbl("Importación y entrega","Import & delivery","Импорт и доставка","Import & Lieferung","Importazione e consegna","Importation et livraison","进口与交付") },
            ].map((step) => (
              <div key={step.n} style={{ background: "#000", padding: "clamp(1.5rem,4vw,3rem)" }}>
                <span style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", color: "var(--accent)", marginBottom: 18 }}>{step.n}</span>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.1rem,2.5vw,1.5rem)", fontWeight: 600, color: "#fff", lineHeight: 1.2, margin: "0 0 20px" }}>{step.t}</h3>
                <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.12)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "clamp(4rem,10vw,8rem) clamp(1.25rem,5vw,3rem)", background: "#060606", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 500, marginBottom: "clamp(2.5rem,6vw,5rem)" }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14 }}>{t.features.sub}</p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.8rem,4.5vw,3rem)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: 0 }}>{t.features.title}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 1, background: "rgba(255,255,255,0.05)" }}>
            {t.features.items.map((f, i) => <FeatureCard key={f.title} number={i + 1} title={f.title} desc={f.desc} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "clamp(4rem,10vw,8rem) clamp(1.25rem,5vw,3rem)", background: "#000", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 80% at 50% 110%,rgba(232,97,26,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.38em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 18 }}>
            {lbl("Empieza ahora","Get started","Начать","Jetzt starten","Inizia ora","Commencer","立即开始")}
          </p>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,5.5vw,3.8rem)", fontWeight: 700, lineHeight: 1.05, color: "#fff", margin: "0 0 clamp(1rem,2vw,1.5rem)" }}>{t.cta.title}</h2>
          <p style={{ fontSize: "clamp(0.8rem,1.5vw,0.9rem)", fontWeight: 300, lineHeight: 1.7, color: "rgba(255,255,255,0.38)", marginBottom: "clamp(1.5rem,3vw,2.5rem)" }}>{t.cta.sub}</p>
          <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "clamp(0.8rem,1.5vw,1rem) clamp(2rem,3.5vw,2.8rem)", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", background: "var(--accent)", color: "#fff", textDecoration: "none" }}>
            {t.cta.btn} <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "clamp(1.5rem,3vw,2.5rem) clamp(1.25rem,5vw,3rem)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(1rem,2vw,1.1rem)", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>AutoImport Pro</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(1rem,3vw,2rem)" }}>
          {[{ href: "/catalog", l: t.nav.catalog }, { href: "/login", l: t.nav.login }, { href: "/register", l: t.nav.register }].map((item) => (
            <Link key={item.href} href={item.href} style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>{item.l}</Link>
          ))}
        </div>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", letterSpacing: "0.05em" }}>{t.footer.rights}</p>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @media (min-width: 640px) { .sm-4col { grid-template-columns: repeat(4,1fr) !important; } }
      `}</style>
    </div>
  );
}

function FeatureCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? "#0e0e0e" : "#060606", padding: "clamp(1.5rem,4vw,3rem)", transition: "background 0.25s", cursor: "default" }}>
      <span style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", color: "rgba(255,255,255,0.16)", marginBottom: 18 }}>{String(number).padStart(2, "0")}</span>
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1rem,2.2vw,1.3rem)", fontWeight: 600, color: "#fff", lineHeight: 1.2, margin: "0 0 12px" }}>{title}</h3>
      <p style={{ fontSize: "clamp(0.75rem,1.4vw,0.85rem)", fontWeight: 300, lineHeight: 1.75, color: "rgba(255,255,255,0.36)", margin: 0 }}>{desc}</p>
      <div style={{ marginTop: 24, width: hovered ? 48 : 24, height: 1, background: "var(--accent)", transition: "width 0.3s" }} />
    </div>
  );
}
