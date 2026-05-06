"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Car, Gem, CalendarCheck, ArrowRight, Menu, X, Shield, Globe } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AuthNavLinks } from "@/components/auth-nav-links";

/* ─── Particle canvas ─── */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let raf = 0;
    function resize() { if (!canvas) return; canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    type P = { x: number; y: number; r: number; speed: number; op: number; drift: number };
    const pts: P[] = [];
    function mk(): P { return { x: Math.random() * (canvas?.width ?? 1440), y: Math.random() * (canvas?.height ?? 900) * -1, r: Math.random() * 1.6 + 0.2, speed: Math.random() * 1.3 + 0.4, op: Math.random() * 0.5 + 0.07, drift: (Math.random() - 0.5) * 0.25 }; }
    resize();
    for (let i = 0; i < 160; i++) { const p = mk(); p.y = Math.random() * (canvas.height); pts.push(p); }
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(180,200,230,${p.op})`; ctx.fill(); p.y += p.speed; p.x += p.drift; if (p.y > canvas.height + 4) { Object.assign(p, mk()); p.y = -4; } }
      raf = requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

/* ─── Power SVG ─── */
function PowerIcon({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <circle cx="48" cy="48" r="44" stroke="white" strokeWidth="2.5" strokeOpacity="0.85" />
      <line x1="48" y1="20" x2="48" y2="48" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 28.5A30 30 0 1 0 66 28.5" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ─── Stat card ─── */
function StatCard({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 22px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
      <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon style={{ width: 24, height: 24, color: "#fff" }} />
      </div>
      <div>
        <p style={{ fontSize: "clamp(0.95rem,1.8vw,1.15rem)", fontWeight: 700, color: "#fff", lineHeight: 1.2, margin: 0 }}>{title}</p>
        <p style={{ fontSize: "clamp(0.72rem,1.3vw,0.82rem)", color: "rgba(255,255,255,0.5)", margin: "4px 0 0", lineHeight: 1.4 }}>{sub}</p>
      </div>
    </div>
  );
}

const BRANDS = ["BMW", "Mercedes-Benz", "Porsche", "Audi", "Ferrari", "Lamborghini", "Maserati", "Bentley", "Rolls-Royce", "Range Rover", "McLaren", "Aston Martin"];

export default function HomePage() {
  const { t, locale } = useLanguage();
  const [started, setStarted] = useState(false);
  const [fading, setFading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleStart() { setFading(true); setTimeout(() => setStarted(true), 680); }

  const lbl = (map: Partial<Record<string, string>>, def: string) => map[locale] ?? map.es ?? def;

  /* ══════════════ INTRO SCREEN ══════════════ */
  if (!started) {
    return (
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "linear-gradient(160deg,#0b0f18 0%,#060a10 60%,#020408 100%)", display: "flex", flexDirection: "column", opacity: fading ? 0 : 1, transition: "opacity 0.68s ease" }}>
        <ParticleCanvas />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 30% 40%,rgba(30,50,100,0.22) 0%,transparent 70%)", pointerEvents: "none" }} />

        {/* Navbar */}
        <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(1.5rem,5vw,3.5rem)", height: 72, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(1.2rem,2.2vw,1.65rem)", fontWeight: 700, color: "rgba(255,255,255,0.9)", lineHeight: 1.1 }}>AutoImport Pro</div>
            <div style={{ fontSize: 9, fontWeight: 400, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Import &amp; Business Manager</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(1rem,2.5vw,2rem)", flexWrap: "wrap" }}>
            <Link href="/catalog" style={{ fontSize: 12, letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}>{t.nav.catalog}</Link>
            <AuthNavLinks loginLabel={t.nav.login} registerLabel={t.nav.register} variant="dark" />
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Center */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "clamp(0.8rem,2vw,1.4rem)", position: "relative", zIndex: 10 }}>
          <button onClick={handleStart} aria-label="Start" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, animation: "pulse 2.5s ease-in-out infinite", transition: "transform 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
            <PowerIcon size={typeof window !== "undefined" && window.innerWidth < 480 ? 68 : 96} />
          </button>
          <button onClick={handleStart} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(2.6rem,7.5vw,5.2rem)", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", textShadow: "0 0 60px rgba(255,255,255,0.1)", lineHeight: 1 }}>
            START
          </button>
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
            {lbl({ es: "Haz clic para entrar", en: "Click to enter", ru: "Нажмите для входа", de: "Klicken Sie hier", it: "Clicca per entrare", fr: "Cliquez pour entrer", zh: "点击进入" }, "Haz clic para entrar")}
          </p>
        </div>

        {/* Brands marquee */}
        <div style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(255,255,255,0.05)", padding: "14px 0", overflow: "hidden", background: "rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", gap: "clamp(2rem,4vw,3.5rem)", animation: "marquee 28s linear infinite", width: "max-content" }}>
            {[...BRANDS, ...BRANDS].map((b, i) => <span key={i} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.15)", whiteSpace: "nowrap" }}>{b}</span>)}
          </div>
        </div>
        <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}} @keyframes pulse{0%,100%{opacity:.9}50%{opacity:.55}}`}</style>
      </div>
    );
  }

  /* ══════════════ MAIN (one-page) ══════════════ */
  const aboutTitle = lbl({ es: "ALTA GAMA, LUJO Y SUPER LUJO.", en: "HIGH-END, LUXURY & SUPER LUXURY.", ru: "ВЫСШИЙ КЛАСС, ЛЮКС И СУПЕРЛЮКС.", de: "HIGH-END, LUXUS UND SUPER-LUXUS.", it: "ALTA GAMMA, LUSSO E SUPER LUSSO.", fr: "HAUTE GAMME, LUXE ET SUPER LUXE.", zh: "高端、豪华与超豪华。" }, "ALTA GAMA, LUJO Y SUPER LUJO.");

  const aboutBody = lbl({
    es: "Nos dedicamos exclusivamente a la <strong>Importación de Vehículos de Alta Gama, Lujo y SuperLujo</strong> por encargo para profesionales y particulares. Plazo de entrega 20 días, con entrega matriculado y transferido en cualquier punto de España. Garantía oficial incluida.<br/><br/>Todos nuestros vehículos proceden de servicios oficiales de cada marca y disponen de certificado de conformidad europeo, certificado de kilometraje, certificado de no siniestralidad y libro de mantenimiento en orden.",
    en: "We dedicate ourselves exclusively to the <strong>Import of High-End, Luxury and Super-Luxury Vehicles</strong> on commission for professionals and private clients. 20-day delivery, registered and transferred anywhere in Spain. Official warranty included.<br/><br/>All our vehicles come from official brand services and include European conformity certificate, mileage certificate, no-accident certificate and up-to-date service history.",
  }, "");

  const statCards = [
    { icon: Car,          title: lbl({ es: "Más de 500 vehículos importados", en: "Over 500 vehicles imported",    ru: "Более 500 импортированных авто",    de: "Über 500 importierte Fahrzeuge",    it: "Oltre 500 veicoli importati",   fr: "Plus de 500 véhicules importés",  zh: "已进口500+辆车" }, ""), sub: lbl({ es: "De las marcas más exclusivas del mercado", en: "From the most exclusive brands on the market" }, "") },
    { icon: Gem,          title: lbl({ es: "8 años de experiencia", en: "8 years of experience", ru: "8 лет опыта", de: "8 Jahre Erfahrung", it: "8 anni di esperienza", fr: "8 ans d'expérience", zh: "8年行业经验" }, ""), sub: lbl({ es: "Importación de alta gama, lujo y superlujo", en: "High-end, luxury and super-luxury imports" }, "") },
    { icon: CalendarCheck, title: lbl({ es: "Entrega en 20 días", en: "Delivery in 20 days", ru: "Доставка за 20 дней", de: "Lieferung in 20 Tagen", it: "Consegna in 20 giorni", fr: "Livraison en 20 jours", zh: "20天交付" }, ""), sub: lbl({ es: "Matriculado y transferido con garantía oficial", en: "Registered and transferred with official warranty" }, "") },
    { icon: Shield,       title: lbl({ es: "Garantía oficial incluida", en: "Official warranty included", ru: "Официальная гарантия", de: "Offizielle Garantie inklusive", it: "Garanzia ufficiale inclusa", fr: "Garantie officielle incluse", zh: "含官方质保" }, ""), sub: lbl({ es: "Todos los vehículos con certificados europeos", en: "All vehicles with European certificates" }, "") },
  ];

  return (
    <div style={{ background: "#000", color: "#fff", fontFamily: "var(--font-sans)", overflowX: "hidden", animation: "fadeIn 0.5s ease" }}>

      {/* ── STICKY HEADER ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(1.25rem,5vw,3rem)", background: "rgba(0,0,0,0.9)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={() => setStarted(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(1rem,1.8vw,1.2rem)", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>AutoImport Pro</div>
          <div style={{ fontSize: 8, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: 1 }}>Import &amp; Business Manager</div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex" style={{ display: "flex", alignItems: "center", gap: "clamp(1.2rem,2.5vw,2.2rem)" }}>
          {[
            { href: "/catalog", label: lbl({ es: "Escaparate Virtual", en: "Virtual Showroom", ru: "Витрина", de: "Virtuelle Ausstellung", it: "Vetrina Virtuale", fr: "Vitrine Virtuelle", zh: "虚拟展厅" }, "Catálogo") },
            { href: "#about",   label: lbl({ es: "Cómo trabajamos",   en: "How we work",     ru: "Как мы работаем", de: "So arbeiten wir", it: "Come lavoriamo", fr: "Comment nous travaillons", zh: "我们的服务" }, "Nosotros") },
          ].map(item => (
            <a key={item.href} href={item.href} style={{ fontSize: 11, fontWeight: 400, letterSpacing: "0.1em", color: "rgba(255,255,255,0.58)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.58)")}>{item.label}</a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LanguageSwitcher />
          <div className="hidden sm:flex">
            <AuthNavLinks loginLabel={t.nav.login} registerLabel={t.nav.register} variant="dark" />
          </div>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", padding: 4 }}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: "68px 0 0 0", zIndex: 40, background: "rgba(0,0,0,0.97)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
          {[
            { href: "/catalog",  label: lbl({ es: "Escaparate Virtual", en: "Virtual Showroom" }, "Catálogo") },
            { href: "#about",    label: lbl({ es: "Cómo trabajamos", en: "How we work" }, "Nosotros") },
            { href: "/login",    label: t.nav.login },
            { href: "/register", label: t.nav.register },
          ].map(item => (
            <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: item.href === "/register" ? "var(--accent)" : "rgba(255,255,255,0.8)", textDecoration: "none" }}>{item.label}</a>
          ))}
        </div>
      )}

      {/* ── SECTION 1: ABOUT ── */}
      <section id="about" style={{ background: "#0a0a0a", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(3.5rem,8vw,7rem) clamp(1.25rem,5vw,3rem)", display: "grid", gridTemplateColumns: "1fr", gap: "clamp(2.5rem,5vw,4rem)", alignItems: "start" }} className="about-grid">
          {/* Left: text */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: "clamp(1.5rem,3.5vw,2.4rem)", letterSpacing: "0.04em", color: "#fff", lineHeight: 1.15, margin: "0 0 clamp(1.2rem,2.5vw,2rem)" }}>
              {aboutTitle}
            </h2>
            <div style={{ fontSize: "clamp(0.82rem,1.5vw,0.95rem)", lineHeight: 1.85, color: "rgba(255,255,255,0.62)", fontWeight: 300 }}
              dangerouslySetInnerHTML={{ __html: aboutBody }} />
          </div>

          {/* Right: stat cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {statCards.map((card, i) => <StatCard key={i} {...card} />)}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: MUSTANG BANNER ── */}
      <section style={{
        position: "relative", overflow: "hidden",
        minHeight: "clamp(320px,45vw,520px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "clamp(3rem,6vw,5rem) clamp(1.25rem,5vw,3rem)",
        /* Orange Mustang gradient — replace background-image with actual photo */
        background: "linear-gradient(135deg, #0a0400 0%, #1a0800 30%, #7a2800 60%, #c04810 80%, #e8611a 100%)",
      }}>
        {/* Dark overlay for text readability */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.52)", pointerEvents: "none" }} />
        {/* Silhouette hint */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 120% 80% at 75% 60%, rgba(232,97,26,0.35) 0%, transparent 60%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 14 }}>
            Ford Mustang GT 5.0 · {lbl({ es: "Nuestro Showroom", en: "Our Showroom", ru: "Наш Шоурум", de: "Unser Showroom", it: "Il Nostro Showroom", fr: "Notre Showroom", zh: "我们的展厅" }, "")}
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "uppercase", fontSize: "clamp(1.5rem,4.5vw,3rem)", letterSpacing: "0.08em", color: "#fff", lineHeight: 1.1, margin: "0 0 clamp(1.5rem,3vw,2.5rem)" }}>
            {lbl({ es: "VISITA NUESTRO ESCAPARATE VIRTUAL", en: "VISIT OUR VIRTUAL SHOWROOM", ru: "ПОСЕТИТЕ НАШ ВИРТУАЛЬНЫЙ САЛОН", de: "BESUCHEN SIE UNSEREN VIRTUELLEN SHOWROOM", it: "VISITA IL NOSTRO SHOWROOM VIRTUALE", fr: "VISITEZ NOTRE VITRINE VIRTUELLE", zh: "参观我们的虚拟展厅" }, "")}
          </h2>
          <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "clamp(0.75rem,1.4vw,0.95rem) clamp(2rem,3.5vw,3rem)", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.85)", textDecoration: "none", transition: "all 0.25s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#000"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; }}>
            {lbl({ es: "VER ESCAPARATE", en: "VIEW SHOWROOM", ru: "СМОТРЕТЬ САЛОН", de: "SHOWROOM ANSEHEN", it: "VEDI SHOWROOM", fr: "VOIR LA VITRINE", zh: "查看展厅" }, "VER CATÁLOGO")}
            <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </section>

      {/* ── SECTION 3: CONTACT CTA (navy) ── */}
      <section style={{ background: "#1b2b5e", padding: "clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,3rem)", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(1.6rem,4vw,2.8rem)", fontWeight: 700, color: "#fff", margin: "0 0 clamp(1.5rem,3vw,2.5rem)", lineHeight: 1.15 }}>
          {lbl({ es: "¿No encuentras lo que buscas?", en: "Can't find what you're looking for?", ru: "Не нашли то, что ищете?", de: "Nicht gefunden, was Sie suchen?", it: "Non trovi quello che cerchi?", fr: "Vous ne trouvez pas ce que vous cherchez ?", zh: "找不到您想要的？" }, "")}
        </h2>
        <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "clamp(0.8rem,1.5vw,1rem) clamp(2.2rem,4vw,3.2rem)", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.75)", textDecoration: "none", transition: "all 0.25s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1b2b5e"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff"; }}>
          {lbl({ es: "CONTACTA CON NOSOTROS AHORA", en: "CONTACT US NOW", ru: "СВЯЖИТЕСЬ С НАМИ", de: "JETZT KONTAKTIEREN", it: "CONTATTACI ORA", fr: "CONTACTEZ-NOUS MAINTENANT", zh: "立即联系我们" }, "")}
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(1.2rem,2.5vw,2rem) clamp(1.25rem,5vw,3rem)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: 0 }}>
          {t.footer.rights}
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { href: "/catalog",  label: lbl({ es: "Política de privacidad", en: "Privacy Policy", ru: "Политика конфиденциальности", de: "Datenschutz", it: "Privacy", fr: "Politique de confidentialité", zh: "隐私政策" }, "") },
            { href: "/catalog",  label: "Cookies" },
          ].map(item => (
            <Link key={item.label} href={item.href} style={{ fontSize: 11, color: "var(--accent)", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>{item.label}</Link>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes marquee { from { transform:translateX(0) } to { transform:translateX(-50%) } }
        @media (min-width: 768px) {
          .about-grid { grid-template-columns: 1.1fr 0.9fr !important; }
          .hidden.md\\:flex { display:flex !important; }
        }
        @media (min-width: 640px) {
          .hidden.sm\\:inline-flex { display:inline-flex !important; }
        }
        strong { color: #fff; font-weight: 600; }
      `}</style>
    </div>
  );
}
