"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, SlidersHorizontal, ChevronDown, X, Zap } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AuthNavLinks } from "@/components/auth-nav-links";
import { formatPrice, CAR_BRANDS, FUEL_TYPES, TRANSMISSIONS } from "@/lib/utils";

type CarRow = {
  id: string; title: string; brand: string; model: string; year: number;
  mileage: number | null; fuelType: string | null; engine: string | null;
  finalPrice: number | null; createdAt: Date;
  photos: { url: string }[];
};

interface Props {
  cars: CarRow[];
  total: number;
  page: number;
  totalPages: number;
  params: Record<string, string | undefined>;
}

function dateBadge(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${m}/${d.getFullYear()}`;
}

function pageUrl(params: Record<string, string | undefined>, p: number) {
  const q = new URLSearchParams();
  Object.entries({ ...params, page: String(p) }).forEach(([k, v]) => { if (v) q.set(k, v); });
  return `/catalog?${q}`;
}

export function CatalogClient({ cars, total, page, totalPages, params }: Props) {
  const { t, locale } = useLanguage();
  const c = t.catalog;
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const lbl = (map: Partial<Record<string, string>>, def = "") => map[locale] ?? map.es ?? def;

  const sortOptions = [
    { value: "newest",     label: lbl({ es: "Más nuevos primero", en: "Newest first",     ru: "Сначала новые",    de: "Neueste zuerst",    it: "Più recenti",     fr: "Plus récents" }) },
    { value: "oldest",     label: lbl({ es: "Más antiguos",       en: "Oldest first",     ru: "Сначала старые",   de: "Älteste zuerst",    it: "Meno recenti",    fr: "Plus anciens"  }) },
    { value: "price_asc",  label: lbl({ es: "Precio: menor a mayor", en: "Price: low to high", ru: "Цена: по возрастанию", de: "Preis aufsteigend", it: "Prezzo crescente", fr: "Prix croissant" }) },
    { value: "price_desc", label: lbl({ es: "Precio: mayor a menor", en: "Price: high to low", ru: "Цена: по убыванию",   de: "Preis absteigend",  it: "Prezzo decrescente",fr: "Prix décroissant"}) },
  ];
  const currentSort = sortOptions.find(o => o.value === (params.sort ?? "newest"))!;

  function applySort(val: string) {
    setSortOpen(false);
    const q = new URLSearchParams();
    Object.entries({ ...params, sort: val, page: "1" }).forEach(([k, v]) => { if (v) q.set(k, v); });
    router.push(`/catalog?${q}`);
  }

  /* Pagination numbers (like the reference: 1 2 … 20 … 40 … last) */
  function paginationItems(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const items: (number | "…")[] = [1];
    if (page > 3) items.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) items.push(i);
    if (page < totalPages - 2) items.push("…");
    items.push(totalPages);
    return items;
  }

  const heroTitle = lbl({
    es: "Vehículos de Alta Gama, Lujo y Super Lujo Importados",
    en: "High-End, Luxury & Super Luxury Imported Vehicles",
    ru: "Высококлассные, люксовые и суперлюксовые авто",
    de: "High-End-, Luxus- und Super-Luxus-Importfahrzeuge",
    it: "Veicoli di Alta Gamma, Lusso e Super Lusso Importati",
    fr: "Véhicules Haut de Gamme, Luxe et Super Luxe Importés",
    zh: "进口高端、豪华及超豪华车辆",
  });

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>

      {/* ── STICKY HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50, height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(1.25rem,5vw,3rem)",
        background: "rgba(0,0,0,0.92)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(1rem,1.8vw,1.2rem)", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>AutoImport Pro</div>
          <div style={{ fontSize: 8, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginTop: 1 }}>Import &amp; Business Manager</div>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "clamp(1rem,2.5vw,2rem)" }} className="hidden md:flex">
          {[
            { href: "/catalog", label: lbl({ es: "Escaparate Virtual", en: "Virtual Showroom", ru: "Витрина", de: "Vitrine", it: "Vetrina", fr: "Vitrine", zh: "展厅" }), active: true },
            { href: "/#about",  label: lbl({ es: "Cómo trabajamos", en: "How we work", ru: "О нас", de: "So arbeiten wir", it: "Come lavoriamo", fr: "Comment nous travaillons", zh: "关于我们" }), active: false },
          ].map(item => (
            <a key={item.href} href={item.href} style={{
              fontSize: 11, letterSpacing: "0.1em", textDecoration: "none",
              color: item.active ? "var(--accent)" : "rgba(255,255,255,0.55)", transition: "color 0.2s",
            }}
              onMouseEnter={e => { if (!item.active) e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { if (!item.active) e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LanguageSwitcher />
          <div className="hidden sm:flex">
            <AuthNavLinks loginLabel={t.nav.login} registerLabel={t.nav.register} variant="dark" />
          </div>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", padding: 4 }}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <div style={{
        position: "relative", height: "clamp(260px,38vw,480px)",
        background: "linear-gradient(135deg,#050505 0%,#0f0f0f 40%,#1a1a1a 100%)",
        display: "flex", alignItems: "flex-end",
        overflow: "hidden",
      }}>
        {/* Subtle car-like gradient shape */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 120% 100% at 70% 50%, rgba(40,40,40,0.8) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(0deg,#fff 0px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0px,transparent 1px,transparent 40px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, padding: "clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,5vw,3rem)", maxWidth: 1200, width: "100%" }}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "none",
            fontSize: "clamp(1.2rem,3.2vw,2.2rem)", color: "#fff",
            lineHeight: 1.2, margin: 0, maxWidth: 860,
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}>
            {heroTitle}
          </h1>
        </div>
      </div>

      {/* ── CONTROLS BAR ── */}
      <div style={{ background: "#000", padding: "clamp(1rem,2vw,1.5rem) clamp(1.25rem,5vw,3rem)", borderBottom: "1px solid rgba(255,255,255,0.07)", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          {/* Left: count + filters */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Count badge */}
            <span style={{ padding: "6px 16px", borderRadius: 999, background: "rgba(140,110,40,0.7)", fontSize: 13, fontWeight: 600, color: "#fff", letterSpacing: "0.02em" }}>
              {total} {c.found}
            </span>
            {/* Filters toggle */}
            <button onClick={() => setFiltersOpen(!filtersOpen)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 500 }}>
              <SlidersHorizontal className="h-4 w-4" />
              {c.filters}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Right: sort dropdown */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setSortOpen(!sortOpen)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "rgba(255,255,255,0.8)", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
              {currentSort.label}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 20, background: "#111", border: "1px solid rgba(255,255,255,0.12)", minWidth: 200, padding: "4px 0" }}>
                {sortOptions.map(o => (
                  <button key={o.value} onClick={() => applySort(o.value)} style={{ display: "block", width: "100%", padding: "9px 16px", textAlign: "left", background: o.value === (params.sort ?? "newest") ? "rgba(255,255,255,0.06)" : "transparent", border: "none", color: o.value === (params.sort ?? "newest") ? "var(--accent)" : "rgba(255,255,255,0.7)", fontSize: 12, cursor: "pointer" }}>
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── FILTER PANEL ── */}
        {filtersOpen && (
          <form action="/catalog" method="get" style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.07)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
            {params.sort && <input type="hidden" name="sort" value={params.sort} />}

            {/* Search */}
            <div>
              <label style={labelStyle}>{c.search}</label>
              <input name="search" defaultValue={params.search} placeholder={c.search_ph} style={inputStyle} />
            </div>
            {/* Brand */}
            <div>
              <label style={labelStyle}>{c.brand}</label>
              <select name="brand" defaultValue={params.brand} style={inputStyle}>
                <option value="">{c.all_brands}</option>
                {CAR_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            {/* Fuel */}
            <div>
              <label style={labelStyle}>{c.fuel}</label>
              <select name="fuel" defaultValue={params.fuel} style={inputStyle}>
                <option value="">{c.all_fuels}</option>
                {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            {/* Transmission */}
            <div>
              <label style={labelStyle}>{c.trans}</label>
              <select name="transmission" defaultValue={params.transmission} style={inputStyle}>
                <option value="">{c.all_trans}</option>
                {TRANSMISSIONS.map(tr => <option key={tr} value={tr}>{tr}</option>)}
              </select>
            </div>
            {/* Price */}
            <div>
              <label style={labelStyle}>{c.price}</label>
              <div style={{ display: "flex", gap: 6 }}>
                <input name="minPrice" type="number" defaultValue={params.minPrice} placeholder={c.min} style={{ ...inputStyle, flex: 1 }} />
                <input name="maxPrice" type="number" defaultValue={params.maxPrice} placeholder={c.max} style={{ ...inputStyle, flex: 1 }} />
              </div>
            </div>
            {/* Year */}
            <div>
              <label style={labelStyle}>{c.year_label}</label>
              <div style={{ display: "flex", gap: 6 }}>
                <input name="minYear" type="number" defaultValue={params.minYear} placeholder={c.from} style={{ ...inputStyle, flex: 1 }} />
                <input name="maxYear" type="number" defaultValue={params.maxYear} placeholder={c.to} style={{ ...inputStyle, flex: 1 }} />
              </div>
            </div>
            {/* Submit */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 6 }}>
              <button type="submit" style={{ padding: "9px 0", background: "var(--accent)", color: "#fff", border: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}>
                {c.apply}
              </button>
              {Object.values(params).some(Boolean) && (
                <Link href="/catalog" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textAlign: "center", textDecoration: "none" }}>{c.clear}</Link>
              )}
            </div>
          </form>
        )}
      </div>

      {/* ── PAGINATION TOP ── */}
      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} params={params} c={c} />
      )}

      {/* ── CAR GRID ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(1.5rem,3vw,2.5rem) clamp(1.25rem,5vw,3rem)" }}>
        {cars.length === 0 ? (
          <div style={{ padding: "5rem 0", textAlign: "center" }}>
            <Car className="mx-auto h-12 w-12 mb-4" style={{ color: "rgba(255,255,255,0.2)" }} />
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15 }}>{c.no_results}</p>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, marginTop: 6 }}>{c.no_results_sub}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 1, background: "rgba(255,255,255,0.06)" }}>
            {cars.map(car => <CarCard key={car.id} car={car} />)}
          </div>
        )}
      </div>

      {/* ── PAGINATION BOTTOM ── */}
      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} params={params} c={c} />
      )}

      {/* ── SEO TEXT BLOCK ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(2.5rem,5vw,4rem) clamp(1.25rem,5vw,3rem) clamp(1.5rem,3vw,2.5rem)" }}>
        <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "clamp(1.2rem,2.5vw,1.7rem)", color: "#fff", margin: "0 0 clamp(1rem,2vw,1.5rem)", lineHeight: 1.2 }}>
          {lbl({
            es: "Coches de Alta Gama, SuperDeportivos y Vehículos de Lujo en Venta",
            en: "High-End Cars, Super Sports and Luxury Vehicles for Sale",
            ru: "Высококлассные автомобили, суперкары и люксовые машины",
            de: "High-End-Autos, Supersportwagen und Luxusfahrzeuge",
            it: "Auto d'Alta Gamma, Supersportive e Veicoli di Lusso",
            fr: "Voitures Haut de Gamme, Super Sportives et Véhicules de Luxe",
            zh: "高端汽车、超级跑车和豪华车辆",
          })}
        </h2>
        <div style={{ fontSize: "clamp(0.8rem,1.4vw,0.9rem)", lineHeight: 1.85, color: "rgba(255,255,255,0.45)", display: "flex", flexDirection: "column", gap: 16 }}>
          <p>{lbl({
            es: "Los vehículos de lujo e importación siempre han sido un símbolo de estatus, elegancia y rendimiento. En AutoImport Pro seleccionamos personalmente los coches de alta gama y superdeportivos más exclusivos del mercado europeo, procedentes en su mayoría de concesionarios oficiales y representantes autorizados.",
            en: "Luxury and imported vehicles have always been a symbol of status, elegance and performance. At AutoImport Pro we personally select the most exclusive high-end cars and super sports vehicles from the European market, sourced mainly from official dealerships and authorized representatives.",
          })}</p>
          <p>{lbl({
            es: "Nuestro objetivo es ofrecer a cada cliente un vehículo único, con <strong>historial certificado, kilometraje verificado y las máximas garantías de procedencia y calidad</strong>. Entre nuestras marcas más habituales: BMW, Mercedes-AMG, Porsche, Ferrari, Lamborghini, Bentley, Rolls-Royce y Range Rover, entre otras.",
            en: "Our goal is to offer each client a unique vehicle with <strong>certified history, verified mileage and the highest guarantees of origin and quality</strong>. Our most frequent brands include BMW, Mercedes-AMG, Porsche, Ferrari, Lamborghini, Bentley, Rolls-Royce and Range Rover, among others.",
          })} </p>
          <p>{lbl({
            es: "Si buscas un vehículo de lujo, un superdeportivo o una pieza de colección única, aquí encontrarás una <strong>selección curada de automóviles excepcionales</strong>, combinando rendimiento, exclusividad y elegancia. Cada coche que presentamos refleja nuestra pasión por la excelencia y el compromiso con un trato profesional y personalizado.",
            en: "If you are looking for a luxury vehicle, a super sports car or a unique collector's piece, here you will find a <strong>curated selection of exceptional automobiles</strong>, combining performance, exclusivity and elegance.",
          })}</p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "clamp(1.2rem,2.5vw,2rem) clamp(1.25rem,5vw,3rem)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", margin: 0 }}>{t.footer.rights}</p>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            lbl({ es: "Política de privacidad", en: "Privacy Policy", ru: "Конфиденциальность", de: "Datenschutz", it: "Privacy", fr: "Confidentialité", zh: "隐私政策" }),
            "Cookies",
          ].map(label => (
            <span key={label} style={{ fontSize: 11, color: "var(--accent)", cursor: "pointer" }}>{label}</span>
          ))}
        </div>
      </footer>

      <style>{`
        @media (min-width: 768px) { .hidden.md\\:flex { display:flex !important; } }
        @media (min-width: 640px) { .hidden.sm\\:inline-flex { display:inline-flex !important; } }
        strong { color: rgba(255,255,255,0.7); font-weight: 600; }
      `}</style>
    </div>
  );
}

/* ── Shared styles ── */
const labelStyle: React.CSSProperties = { display: "block", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: "100%", height: 36, background: "#111", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 12, padding: "0 10px", outline: "none", boxSizing: "border-box" };

/* ── Pagination ── */
function Pagination({ page, totalPages, params, c }: { page: number; totalPages: number; params: Record<string, string | undefined>; c: { prev: string; next: string } }) {
  function items(): (number | "…")[] {
    if (totalPages <= 8) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const arr: (number | "…")[] = [1];
    if (page > 3) arr.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) arr.push(i);
    if (page < totalPages - 2) arr.push("…");
    arr.push(totalPages);
    return arr;
  }

  return (
    <div style={{ padding: "clamp(0.8rem,1.5vw,1.2rem) clamp(1.25rem,5vw,3rem)", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4, borderBottom: "1px solid rgba(255,255,255,0.06)", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
      {page > 1 && (
        <Link href={pageUrl(params, page - 1)} style={pgLink(false)}>{c.prev}</Link>
      )}
      {items().map((item, i) =>
        item === "…"
          ? <span key={`e${i}`} style={{ padding: "4px 6px", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>…</span>
          : <Link key={item} href={pageUrl(params, item as number)} style={pgLink(item === page)}>{item}</Link>
      )}
      {page < totalPages && (
        <Link href={pageUrl(params, page + 1)} style={pgLink(false)}>{c.next}</Link>
      )}
    </div>
  );
}

function pgLink(active: boolean): React.CSSProperties {
  return { padding: "4px 10px", fontSize: 13, textDecoration: "none", background: active ? "#fff" : "transparent", color: active ? "#000" : "rgba(255,255,255,0.55)", fontWeight: active ? 700 : 400, border: active ? "none" : "1px solid transparent" };
}

/* ── Car Card ── */
function CarCard({ car }: { car: CarRow }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={`/catalog/${car.id}`} style={{ textDecoration: "none", display: "block", background: hovered ? "#0e0e0e" : "#080808", transition: "background 0.2s" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* Photo */}
      <div style={{ width: "100%", aspectRatio: "16/10", overflow: "hidden", background: "#111", position: "relative" }}>
        {car.photos[0] ? (
          <img src={car.photos[0].url} alt={car.title} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform 0.4s ease" }} />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Car style={{ width: 40, height: 40, color: "rgba(255,255,255,0.12)" }} />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 18px" }}>
        {/* Title row */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.35, margin: 0, flex: 1 }}>{car.title}</p>
          {car.mileage && (
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>
              {car.mileage.toLocaleString()} KM
            </span>
          )}
        </div>

        {/* Price + date badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
            {car.finalPrice != null ? formatPrice(car.finalPrice) : "—"}
          </span>
          <span style={{ padding: "3px 10px", borderRadius: 999, background: "rgba(140,110,40,0.65)", fontSize: 11, fontWeight: 600, color: "#fff" }}>
            {dateBadge(new Date(car.createdAt))}
          </span>
        </div>

        {/* CV + fuel */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{car.engine ?? "—"}</span>
          {car.fuelType && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{car.fuelType}</span>}
        </div>
      </div>
    </Link>
  );
}
