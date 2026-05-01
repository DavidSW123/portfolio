"use client";
import Link from "next/link";
import { Car, Search, Filter, Zap, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { formatPrice, CAR_BRANDS, FUEL_TYPES, TRANSMISSIONS } from "@/lib/utils";

type CarWithPhoto = {
  id: string; title: string; brand: string; year: number;
  mileage: number | null; fuelType: string | null; finalPrice: number | null;
  photos: { url: string }[];
};

interface Props {
  cars: CarWithPhoto[];
  total: number;
  page: number;
  totalPages: number;
  params: Record<string, string | undefined>;
}

export function CatalogClient({ cars, total, page, totalPages, params }: Props) {
  const { t } = useLanguage();
  const c = t.catalog;

  function pageUrl(p: number) {
    return `/catalog?${new URLSearchParams({ ...params, page: String(p) } as Record<string, string>)}`;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md"
        style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(8,13,26,0.9)" }}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: "var(--accent)" }}
              >
                <Zap className="h-4 w-4" style={{ color: "var(--accent-fg)" }} />
              </div>
              <span className="text-base font-bold" style={{ color: "var(--text)" }}>
                AutoImport <span style={{ color: "var(--accent)" }}>Pro</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Link href="/login" className="text-sm font-medium px-3 py-1.5 rounded-lg" style={{ color: "var(--text-muted)" }}>
                {c.login}
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold px-4 py-2 rounded-lg"
                style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
              >
                {c.register}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-8">
        <h1 className="text-2xl font-extrabold tracking-tight mb-6" style={{ color: "var(--text)" }}>
          {c.title}
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <form
              className="rounded-2xl p-5 space-y-5"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text)" }}>
                <Filter className="h-4 w-4" style={{ color: "var(--accent)" }} />
                {c.filters}
              </h3>

              {/* Search */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>
                  {c.search}
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--text-subtle)" }} />
                  <input
                    name="search" defaultValue={params.search} placeholder={c.search_ph}
                    className="w-full pl-8 pr-3 h-9 rounded-lg text-sm focus:outline-none focus:ring-1"
                    style={{
                      background: "var(--bg-surface-2)", color: "var(--text)",
                      border: "1px solid var(--border)",
                    }}
                  />
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>{c.brand}</label>
                <select name="brand" defaultValue={params.brand}
                  className="w-full h-9 rounded-lg text-sm px-2 focus:outline-none"
                  style={{ background: "var(--bg-surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}>
                  <option value="">{c.all_brands}</option>
                  {CAR_BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Fuel */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>{c.fuel}</label>
                <select name="fuel" defaultValue={params.fuel}
                  className="w-full h-9 rounded-lg text-sm px-2 focus:outline-none"
                  style={{ background: "var(--bg-surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}>
                  <option value="">{c.all_fuels}</option>
                  {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>{c.trans}</label>
                <select name="transmission" defaultValue={params.transmission}
                  className="w-full h-9 rounded-lg text-sm px-2 focus:outline-none"
                  style={{ background: "var(--bg-surface-2)", color: "var(--text)", border: "1px solid var(--border)" }}>
                  <option value="">{c.all_trans}</option>
                  {TRANSMISSIONS.map((tr) => <option key={tr} value={tr}>{tr}</option>)}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>{c.price}</label>
                <div className="flex gap-2">
                  {["minPrice","maxPrice"].map((name, i) => (
                    <input key={name} name={name}
                      defaultValue={params[name as keyof typeof params]} type="number"
                      placeholder={i === 0 ? c.min : c.max}
                      className="w-full h-9 rounded-lg text-sm px-2 focus:outline-none"
                      style={{ background: "var(--bg-surface-2)", color: "var(--text)", border: "1px solid var(--border)" }} />
                  ))}
                </div>
              </div>

              {/* Year */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--text-muted)" }}>{c.year_label}</label>
                <div className="flex gap-2">
                  {["minYear","maxYear"].map((name, i) => (
                    <input key={name} name={name}
                      defaultValue={params[name as keyof typeof params]} type="number"
                      placeholder={i === 0 ? c.from : c.to}
                      className="w-full h-9 rounded-lg text-sm px-2 focus:outline-none"
                      style={{ background: "var(--bg-surface-2)", color: "var(--text)", border: "1px solid var(--border)" }} />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
              >
                {c.apply}
              </button>
              {Object.values(params).some(Boolean) && (
                <Link href="/catalog" className="block text-center text-xs" style={{ color: "var(--text-muted)" }}>
                  {c.clear}
                </Link>
              )}
            </form>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
              <span className="font-bold" style={{ color: "var(--text)" }}>{total}</span> {c.found}
            </p>

            {cars.length === 0 ? (
              <div
                className="rounded-2xl py-20 text-center"
                style={{ border: "2px dashed var(--border)" }}
              >
                <Car className="mx-auto h-12 w-12 mb-3" style={{ color: "var(--text-subtle)" }} />
                <p className="font-semibold" style={{ color: "var(--text-muted)" }}>{c.no_results}</p>
                <p className="text-sm mt-1" style={{ color: "var(--text-subtle)" }}>{c.no_results_sub}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {cars.map((car) => (
                    <Link key={car.id} href={`/catalog/${car.id}`}>
                      <div
                        className="group rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
                        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
                      >
                        {/* Image */}
                        <div className="aspect-video overflow-hidden relative" style={{ background: "var(--bg-surface-2)" }}>
                          {car.photos[0] ? (
                            <img
                              src={car.photos[0].url} alt={car.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Car className="h-10 w-10" style={{ color: "var(--text-subtle)" }} />
                            </div>
                          )}
                          {/* Brand badge */}
                          <span
                            className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{ background: "var(--accent)", color: "var(--accent-fg)" }}
                          >
                            {car.brand}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          <p className="font-semibold truncate" style={{ color: "var(--text)" }}>{car.title}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                            <span>{car.year}</span>
                            {car.mileage && <span>{car.mileage.toLocaleString()} km</span>}
                            {car.fuelType && <span>{car.fuelType}</span>}
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-lg font-extrabold" style={{ color: "var(--accent)" }}>
                              {formatPrice(car.finalPrice)}
                            </p>
                            <span
                              className="flex items-center gap-1 text-xs font-medium"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Ver más <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-3">
                    {page > 1 && (
                      <Link
                        href={pageUrl(page - 1)}
                        className="rounded-xl px-4 py-2 text-sm font-medium transition-all"
                        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                      >
                        {c.prev}
                      </Link>
                    )}
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {c.page_of.replace("{n}", String(page)).replace("{total}", String(totalPages))}
                    </span>
                    {page < totalPages && (
                      <Link
                        href={pageUrl(page + 1)}
                        className="rounded-xl px-4 py-2 text-sm font-medium transition-all"
                        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" }}
                      >
                        {c.next}
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
