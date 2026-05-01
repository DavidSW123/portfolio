"use client";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";

const BRANDS = [
  "BMW", "Mercedes-Benz", "Porsche", "Audi", "Ferrari",
  "Lamborghini", "Maserati", "Bentley", "Rolls-Royce", "Range Rover",
];

export default function HomePage() {
  const { t, locale } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const label = (es: string, en: string, ru: string, de: string, it: string, fr: string, zh: string) =>
    ({ es, en, ru, de, it, fr, zh }[locale] ?? es);

  return (
    <div style={{ background: "#000", color: "#fff", fontFamily: "var(--font-sans)", overflowX: "hidden" }}>

      {/* ──────────── NAVBAR ──────────── */}
      <nav style={{
        position: "fixed", inset: "0 0 auto 0", zIndex: 50, height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(1.25rem, 4vw, 3rem)",
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)" }}>
            AutoImport
          </span>
          <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.18)", display: "inline-block" }} />
          <span style={{ fontSize: 11, fontWeight: 300, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
            Pro
          </span>
        </Link>

        {/* Desktop center */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden md:flex">
          {[{ href: "/catalog", label: t.nav.catalog }, { href: "/login", label: t.nav.login }].map((item) => (
            <Link key={item.href} href={item.href} style={{
              fontSize: 11, fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LanguageSwitcher />
          <Link href="/register" className="hidden sm:inline-flex" style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "9px 20px", background: "var(--accent)", color: "#fff", textDecoration: "none",
          }}>
            {t.nav.register}
          </Link>
          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", padding: 4 }}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: "64px 0 0 0", zIndex: 40,
          background: "rgba(0,0,0,0.97)", backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36,
        }}>
          {[
            { href: "/catalog", label: t.nav.catalog },
            { href: "/login", label: t.nav.login },
            { href: "/register", label: t.nav.register },
          ].map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{
              fontSize: 13, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase",
              color: item.href === "/register" ? "var(--accent)" : "rgba(255,255,255,0.8)", textDecoration: "none",
            }}>
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* ──────────── HERO ──────────── */}
      <section style={{
        position: "relative", minHeight: "100svh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        paddingTop: 64, paddingBottom: 0,
        padding: `64px clamp(1.25rem, 5vw, 3rem) 0`,
      }}>
        {/* BG gradients */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 60% at 50% 20%, rgba(27,43,94,0.25) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, #000 100%)", pointerEvents: "none" }} />
        {/* Subtle grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.025, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }} />

        {/* Content */}
        <div style={{ position: "relative", width: "100%", maxWidth: 900, textAlign: "center", paddingBottom: "clamp(5rem,12vw,9rem)" }}>
          {/* Overline */}
          <p style={{
            marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.38em",
            textTransform: "uppercase", color: "var(--accent)",
          }}>
            {label("Importación de vehículos de lujo", "Luxury vehicle imports", "Импорт премиальных авто", "Luxusfahrzeuge importieren", "Importazione veicoli di lusso", "Importation de véhicules de luxe", "豪华车辆进口")}
          </p>

          {/* Headline */}
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.8rem, 8vw, 6.5rem)",
            fontWeight: 700, lineHeight: 1.0,
            letterSpacing: "-0.02em",
            color: "#fff", margin: 0,
          }}>
            {t.hero.title}
            <br />
            <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
              {t.hero.accent}
            </em>
          </h1>

          {/* Divider */}
          <div style={{ width: 48, height: 1, background: "var(--accent)", margin: "clamp(1.5rem, 3vw, 2.5rem) auto" }} />

          {/* Subtitle */}
          <p style={{
            maxWidth: 560, margin: "0 auto",
            fontSize: "clamp(0.8rem, 1.6vw, 0.95rem)",
            fontWeight: 300, lineHeight: 1.75,
            letterSpacing: "0.02em", color: "rgba(255,255,255,0.5)",
          }}>
            {t.hero.subtitle}
          </p>

          {/* CTAs */}
          <div style={{
            marginTop: "clamp(2rem, 4vw, 3rem)",
            display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 14,
          }}>
            <Link href="/catalog" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "clamp(0.7rem,1.5vw,0.9rem) clamp(1.5rem,3vw,2.2rem)",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
              background: "var(--accent)", color: "#fff", textDecoration: "none",
            }}>
              {t.hero.cta1} <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
            <Link href="/register" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "clamp(0.7rem,1.5vw,0.9rem) clamp(1.5rem,3vw,2.2rem)",
              fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase",
              background: "transparent", color: "rgba(255,255,255,0.65)",
              border: "1px solid rgba(255,255,255,0.18)", textDecoration: "none",
            }}>
              {t.hero.cta2}
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────── STATS ──────────── */}
      <div style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }} className="sm:grid-cols-4">
          {t.stats.map((s, i) => (
            <div key={s.label} style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "clamp(1.25rem,3vw,2rem) 1rem",
              borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.06)" : undefined,
              borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : undefined,
            }}>
              <span style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                fontWeight: 700, color: "var(--accent)", lineHeight: 1,
              }}>
                {s.value}
              </span>
              <span style={{
                marginTop: 6, fontSize: 10, fontWeight: 600,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)", textAlign: "center",
              }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ──────────── BRANDS MARQUEE ──────────── */}
      <div style={{ background: "#040404", padding: "18px 0", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ display: "flex", gap: "clamp(2rem,5vw,4rem)", animation: "marquee 28s linear infinite", width: "max-content" }}>
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)", whiteSpace: "nowrap" }}>
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* ──────────── PROCESS ──────────── */}
      <section style={{ padding: "clamp(4rem,10vw,8rem) clamp(1.25rem,5vw,3rem)", background: "#000" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Header */}
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between",
            gap: 24, marginBottom: "clamp(2.5rem,6vw,5rem)",
          }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>
                {label("Cómo funciona","How it works","Как это работает","So funktioniert es","Come funziona","Comment ça marche","如何运作")}
              </p>
              <h2 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.8rem,4.5vw,3rem)",
                fontWeight: 700, lineHeight: 1.1, color: "#fff", margin: 0,
              }}>
                {label("Simple. Rápido. Seguro.","Simple. Fast. Secure.","Просто. Быстро. Надёжно.","Einfach. Schnell. Sicher.","Semplice. Veloce. Sicuro.","Simple. Rapide. Sûr.","简单。快速。安全。")}
              </h2>
            </div>
            <Link href="/catalog" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
              color: "var(--accent)", textDecoration: "none",
              paddingBottom: 3, borderBottom: "1px solid var(--accent)", flexShrink: 0,
            }}>
              {t.nav.catalog} <ArrowUpRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>

          {/* Steps */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 1, background: "rgba(255,255,255,0.06)" }}>
            {[
              { n: "01", t: label("Consulta gratuita","Free consultation","Бесплатная консультация","Kostenlose Beratung","Consulenza gratuita","Consultation gratuite","免费咨询") },
              { n: "02", t: label("Selección del vehículo","Vehicle selection","Выбор автомобиля","Fahrzeugauswahl","Selezione del veicolo","Sélection du véhicule","车辆选择") },
              { n: "03", t: label("Importación y entrega","Import & delivery","Импорт и доставка","Import & Lieferung","Importazione e consegna","Importation et livraison","进口与交付") },
            ].map((step) => (
              <div key={step.n} style={{ background: "#000", padding: "clamp(1.5rem,4vw,3rem)" }}>
                <span style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", color: "var(--accent)", marginBottom: 20 }}>
                  {step.n}
                </span>
                <h3 style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1.1rem,2.5vw,1.5rem)",
                  fontWeight: 600, color: "#fff", lineHeight: 1.2, margin: 0,
                }}>
                  {step.t}
                </h3>
                <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.12)", marginTop: 24 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── FEATURES ──────────── */}
      <section style={{ padding: "clamp(4rem,10vw,8rem) clamp(1.25rem,5vw,3rem)", background: "#060606", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 520, marginBottom: "clamp(2.5rem,6vw,5rem)" }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>
              {t.features.sub}
            </p>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.8rem,4.5vw,3rem)",
              fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: 0,
            }}>
              {t.features.title}
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 1, background: "rgba(255,255,255,0.05)" }}>
            {t.features.items.map((f, i) => (
              <FeatureCard key={f.title} number={i + 1} title={f.title} desc={f.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── CTA ──────────── */}
      <section style={{
        padding: "clamp(4rem,10vw,8rem) clamp(1.25rem,5vw,3rem)",
        background: "#000", borderTop: "1px solid rgba(255,255,255,0.05)",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 80% at 50% 110%, rgba(232,97,26,0.1) 0%, transparent 70%)",
        }} />
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 20 }}>
            {label("Empieza ahora","Get started","Начать","Jetzt starten","Inizia ora","Commencer","立即开始")}
          </p>
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem,5.5vw,3.8rem)",
            fontWeight: 700, lineHeight: 1.05, color: "#fff",
            margin: "0 0 clamp(1rem,2vw,1.5rem)",
          }}>
            {t.cta.title}
          </h2>
          <p style={{
            fontSize: "clamp(0.8rem,1.5vw,0.9rem)", fontWeight: 300, lineHeight: 1.7,
            color: "rgba(255,255,255,0.4)", letterSpacing: "0.02em",
            marginBottom: "clamp(1.5rem,3vw,2.5rem)",
          }}>
            {t.cta.sub}
          </p>
          <Link href="/register" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "clamp(0.8rem,1.5vw,1rem) clamp(2rem,3.5vw,2.8rem)",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
            background: "var(--accent)", color: "#fff", textDecoration: "none",
          }}>
            {t.cta.btn} <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </section>

      {/* ──────────── FOOTER ──────────── */}
      <footer style={{
        background: "#000", borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "clamp(1.5rem,3vw,2.5rem) clamp(1.25rem,5vw,3rem)",
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)" }}>
          AutoImport Pro
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(1rem,3vw,2rem)" }}>
          {[{ href: "/catalog", label: t.nav.catalog }, { href: "/login", label: t.nav.login }, { href: "/register", label: t.nav.register }].map((item) => (
            <Link key={item.href} href={item.href} style={{
              fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)", textDecoration: "none",
            }}>
              {item.label}
            </Link>
          ))}
        </div>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", letterSpacing: "0.05em" }}>
          {t.footer.rights}
        </p>
      </footer>

      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @media (min-width: 640px) {
          .sm\\:grid-cols-4 { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (min-width: 768px) {
          .hidden.md\\:flex { display: flex !important; }
        }
        @media (min-width: 640px) {
          .hidden.sm\\:inline-flex { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#0d0d0d" : "#060606",
        padding: "clamp(1.5rem,4vw,3rem)",
        transition: "background 0.25s",
        cursor: "default",
      }}
    >
      <span style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", color: "rgba(255,255,255,0.18)", marginBottom: 20 }}>
        {String(number).padStart(2, "0")}
      </span>
      <h3 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(1rem,2.2vw,1.3rem)",
        fontWeight: 600, color: "#fff", lineHeight: 1.2,
        margin: "0 0 14px",
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: "clamp(0.75rem,1.4vw,0.85rem)", fontWeight: 300, lineHeight: 1.7,
        color: "rgba(255,255,255,0.38)", margin: 0,
      }}>
        {desc}
      </p>
      <div style={{ marginTop: 28, width: hovered ? 48 : 24, height: 1, background: "var(--accent)", transition: "width 0.3s" }} />
    </div>
  );
}
