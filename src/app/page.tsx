"use client";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";

const BRANDS = ["BMW", "Mercedes-Benz", "Porsche", "Audi", "Ferrari", "Lamborghini", "Maserati", "Bentley", "Rolls-Royce", "Aston Martin", "McLaren", "Range Rover"];

const STEPS = [
  { n: "01", es: "Consulta gratuita", en: "Free consultation" },
  { n: "02", es: "Selección del vehículo", en: "Vehicle selection" },
  { n: "03", es: "Importación y entrega", en: "Import & delivery" },
];

export default function HomePage() {
  const { t, locale } = useLanguage();

  return (
    <div style={{ background: "#000", color: "#fff", fontFamily: "var(--font-sans)" }}>

      {/* ── NAVBAR ── */}
      <nav
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-8 sm:px-12"
        style={{ height: 72, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span
            className="text-xs font-bold tracking-[0.25em] uppercase"
            style={{ color: "var(--accent)" }}
          >
            AutoImport
          </span>
          <span
            className="hidden sm:block w-px h-4"
            style={{ background: "rgba(255,255,255,0.2)" }}
          />
          <span className="hidden sm:block text-xs font-light tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
            Pro
          </span>
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: "/catalog", label: t.nav.catalog },
            { href: "/login",   label: t.nav.login },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium tracking-[0.15em] uppercase transition-colors"
              style={{ color: "rgba(255,255,255,0.55)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/register"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase px-5 py-2.5 rounded-sm transition-all"
            style={{ background: "var(--accent)", color: "#fff" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
          >
            {t.nav.register}
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
        style={{ paddingTop: 72 }}
      >
        {/* Gradient layers */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(27,43,94,0.15) 0%, transparent 50%, rgba(0,0,0,1) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 100% 70% at 50% 30%, rgba(27,43,94,0.3) 0%, transparent 70%)" }} />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Orange glow bottom */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ width: 700, height: 200, background: "radial-gradient(ellipse, rgba(232,97,26,0.18) 0%, transparent 70%)", filter: "blur(40px)" }}
        />

        {/* Content */}
        <div className="relative text-center px-6 sm:px-12 max-w-5xl mx-auto">
          {/* Overline */}
          <p
            className="mb-8 text-xs font-semibold tracking-[0.4em] uppercase"
            style={{ color: "var(--accent)" }}
          >
            {locale === "es" ? "Importación de lujo desde Europa" :
             locale === "en" ? "Luxury import from Europe" :
             locale === "ru" ? "Люксовый импорт из Европы" :
             locale === "de" ? "Luxusimport aus Europa" :
             locale === "it" ? "Importazione di lusso dall'Europa" :
             locale === "fr" ? "Importation de luxe depuis l'Europe" :
             "欧洲豪华进口"}
          </p>

          {/* Main headline — serif */}
          <h1
            className="leading-none tracking-tight"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(3rem, 9vw, 7.5rem)",
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            {t.hero.title}
            <br />
            <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
              {t.hero.accent}
            </em>
          </h1>

          {/* Divider line */}
          <div className="mx-auto mt-10 mb-8" style={{ width: 60, height: 1, background: "var(--accent)" }} />

          {/* Subtitle */}
          <p
            className="mx-auto max-w-xl text-sm sm:text-base font-light leading-relaxed"
            style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "0.02em" }}
          >
            {t.hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2.5 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all hover:scale-105"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              {t.hero.cta1}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2.5 px-8 py-4 text-xs font-medium tracking-[0.2em] uppercase transition-all hover:scale-105"
              style={{ background: "transparent", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              {t.hero.cta2}
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div
          className="absolute bottom-0 inset-x-0 grid grid-cols-2 sm:grid-cols-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          {t.stats.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center py-6"
              style={{
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : undefined,
                background: "rgba(0,0,0,0.6)",
              }}
            >
              <span
                className="text-2xl sm:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-serif)", color: "var(--accent)" }}
              >
                {s.value}
              </span>
              <span className="mt-1 text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── BRANDS MARQUEE ── */}
      <section style={{ background: "#050505", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", padding: "20px 0" }}>
        <div
          className="flex gap-16 items-center"
          style={{
            animation: "marquee 30s linear infinite",
            width: "max-content",
          }}
        >
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span
              key={i}
              className="text-xs font-semibold tracking-[0.3em] uppercase whitespace-nowrap"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section style={{ background: "#000", padding: "120px 0" }}>
        <div className="mx-auto max-w-6xl px-8 sm:px-12">
          {/* Section header */}
          <div className="mb-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="mb-4 text-xs font-semibold tracking-[0.35em] uppercase" style={{ color: "var(--accent)" }}>
                {locale === "es" ? "Cómo funciona" : locale === "en" ? "How it works" : locale === "ru" ? "Как это работает" : locale === "de" ? "So funktioniert es" : locale === "it" ? "Come funziona" : locale === "fr" ? "Comment ça marche" : "如何运作"}
              </p>
              <h2
                style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 700, lineHeight: 1.1, color: "#fff" }}
              >
                {locale === "es" ? "Simple. Rápido. Seguro." :
                 locale === "en" ? "Simple. Fast. Secure." :
                 locale === "ru" ? "Просто. Быстро. Надёжно." :
                 locale === "de" ? "Einfach. Schnell. Sicher." :
                 locale === "it" ? "Semplice. Veloce. Sicuro." :
                 locale === "fr" ? "Simple. Rapide. Sûr." :
                 "简单。快速。安全。"}
              </h2>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase pb-1 flex-shrink-0"
              style={{ color: "var(--accent)", borderBottom: "1px solid var(--accent)" }}
            >
              {t.nav.catalog} <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.07)" }}>
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className="relative p-10 sm:p-12"
                style={{ background: "#000" }}
              >
                {/* Number */}
                <span
                  className="block text-xs font-bold tracking-[0.3em] mb-6"
                  style={{ color: "var(--accent)" }}
                >
                  {step.n}
                </span>
                {/* Title */}
                <h3
                  style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 600, color: "#fff", lineHeight: 1.2 }}
                >
                  {locale === "en" ? step.en : step.es}
                </h3>
                {/* Divider */}
                <div className="mt-6" style={{ width: 32, height: 1, background: "rgba(255,255,255,0.15)" }} />
                {i < 2 && (
                  <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10">
                    <ArrowRight className="h-4 w-4" style={{ color: "rgba(255,255,255,0.15)" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section style={{ background: "#080808", padding: "120px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="mx-auto max-w-6xl px-8 sm:px-12">
          <div className="mb-16 max-w-xl">
            <p className="mb-4 text-xs font-semibold tracking-[0.35em] uppercase" style={{ color: "var(--accent)" }}>
              {t.features.sub}
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
              {t.features.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
            {t.features.items.map((f, i) => (
              <div
                key={f.title}
                className="group p-10 sm:p-12 transition-colors"
                style={{ background: "#080808" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#0f0f0f")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#080808")}
              >
                <span
                  className="block text-xs font-bold tracking-[0.3em] mb-6"
                  style={{ color: "rgba(255,255,255,0.2)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="mb-4"
                  style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", fontWeight: 600, color: "#fff" }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.01em" }}
                >
                  {f.desc}
                </p>
                <div
                  className="mt-8 transition-all group-hover:w-12"
                  style={{ width: 24, height: 1, background: "var(--accent)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section
        className="relative overflow-hidden"
        style={{ padding: "100px 0", background: "#000", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(232,97,26,0.12) 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-3xl px-8 sm:px-12 text-center">
          <p className="mb-6 text-xs font-semibold tracking-[0.35em] uppercase" style={{ color: "var(--accent)" }}>
            {locale === "es" ? "Empieza ahora" : locale === "en" ? "Get started" : locale === "ru" ? "Начать сейчас" : locale === "de" ? "Jetzt starten" : locale === "it" ? "Inizia ora" : locale === "fr" ? "Commencer" : "立即开始"}
          </p>
          <h2
            className="mb-8"
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem,6vw,4rem)", fontWeight: 700, color: "#fff", lineHeight: 1.05 }}
          >
            {t.cta.title}
          </h2>
          <p className="mb-10 text-sm font-light" style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.02em" }}>
            {t.cta.sub}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-3 px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all hover:scale-105"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {t.cta.btn}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 0" }}
      >
        <div className="mx-auto max-w-6xl px-8 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "var(--accent)" }}>
            AutoImport Pro
          </span>
          <div className="flex items-center gap-8">
            <Link href="/catalog" className="text-xs tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
              {t.nav.catalog}
            </Link>
            <Link href="/login" className="text-xs tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
              {t.nav.login}
            </Link>
            <Link href="/register" className="text-xs tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
              {t.nav.register}
            </Link>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
            {t.footer.rights}
          </p>
        </div>
      </footer>

      {/* Marquee animation */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
