"use client";
import Link from "next/link";
import { Car, Shield, Globe, Users, ArrowRight, Zap, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";

const featureIcons = [Shield, Globe, Users, Car];

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* ── Navbar ── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-md"
        style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(8,13,26,0.85)" }}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: "var(--accent)", boxShadow: "var(--shadow-accent)" }}
              >
                <Zap className="h-4 w-4" style={{ color: "var(--accent-fg)" }} />
              </div>
              <span className="text-base font-bold tracking-tight" style={{ color: "var(--text)" }}>
                AutoImport <span style={{ color: "var(--accent)" }}>Pro</span>
              </span>
            </Link>

            {/* Right */}
            <div className="flex items-center gap-2">
              <Link
                href="/catalog"
                className="hidden sm:block text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{ color: "var(--text-muted)" }}
              >
                {t.nav.catalog}
              </Link>
              <LanguageSwitcher />
              <Link
                href="/login"
                className="text-sm font-medium px-3 py-1.5 rounded-lg transition-all"
                style={{ color: "var(--text-muted)" }}
              >
                {t.nav.login}
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
              >
                {t.nav.register}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        {/* Background layers */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(27,43,94,0.6) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, var(--border) 0px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, var(--border) 0px, transparent 1px, transparent 60px)",
          }}
        />
        {/* Accent glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 opacity-20 blur-3xl"
          style={{ background: "var(--accent)" }}
        />

        <div className="relative mx-auto max-w-5xl px-5 sm:px-8 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-8"
            style={{ background: "var(--accent-subtle)", color: "var(--accent)", border: "1px solid var(--accent)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
            {t.hero.badge}
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-4"
            style={{ color: "var(--text)" }}
          >
            {t.hero.title}
            <br />
            <span
              className="mt-2 inline-block"
              style={{
                color: "var(--accent)",
                textShadow: "0 0 60px rgba(232,97,26,0.4)",
              }}
            >
              {t.hero.accent}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {t.hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold transition-all hover:scale-105 active:scale-95"
              style={{
                background: "var(--accent)",
                color: "var(--accent-fg)",
                boxShadow: "var(--shadow-accent)",
              }}
            >
              {t.hero.cta1}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold transition-all hover:scale-105 active:scale-95"
              style={{
                background: "transparent",
                color: "var(--text)",
                border: "1px solid var(--border)",
              }}
            >
              {t.hero.cta2}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Stats */}
          <div
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--border)", background: "var(--border)" }}
          >
            {t.stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center py-6 px-4"
                style={{ background: "var(--bg-surface)" }}
              >
                <span className="text-3xl font-extrabold" style={{ color: "var(--accent)" }}>{s.value}</span>
                <span className="mt-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-28" style={{ background: "var(--bg-surface)" }}>
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "var(--text)" }}>
              {t.features.title}
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--text-muted)" }}>{t.features.sub}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.features.items.map((f, i) => {
              const Icon = featureIcons[i];
              return (
                <div
                  key={f.title}
                  className="group relative rounded-2xl p-6 transition-all hover:-translate-y-1"
                  style={{
                    background: "var(--bg-surface-2)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: "var(--accent-subtle)", border: "1px solid var(--accent)" }}
                  >
                    <Icon className="h-6 w-6" style={{ color: "var(--accent)" }} />
                  </div>
                  <h3 className="mb-2 text-base font-semibold" style={{ color: "var(--text)" }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
                  {/* Corner accent */}
                  <div
                    className="absolute top-0 right-0 h-px w-16 transition-all group-hover:w-full"
                    style={{ background: "var(--accent)" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, var(--accent) 0%, #b84d10 100%)" }}
        />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{t.cta.title}</h2>
          <p className="mt-4 text-lg text-white/80">{t.cta.sub}</p>
          <Link
            href="/register"
            className="mt-10 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold transition-all hover:scale-105 active:scale-95"
            style={{ background: "#fff", color: "var(--accent)" }}
          >
            {t.cta.btn}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-8"
        style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg)" }}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center rounded"
              style={{ background: "var(--accent)" }}
            >
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>AutoImport Pro</span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>{t.footer.rights}</p>
        </div>
      </footer>
    </div>
  );
}
