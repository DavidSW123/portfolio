import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Car, Search, Filter } from "lucide-react";
import { formatPrice, CAR_BRANDS, FUEL_TYPES, TRANSMISSIONS } from "@/lib/utils";

interface SearchParams {
  brand?: string;
  fuel?: string;
  transmission?: string;
  minPrice?: string;
  maxPrice?: string;
  minYear?: string;
  maxYear?: string;
  search?: string;
  page?: string;
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {
    isPublished: true,
    status: "PUBLISHED",
  };

  if (params.brand) where.brand = params.brand;
  if (params.fuel) where.fuelType = params.fuel;
  if (params.transmission) where.transmission = params.transmission;
  if (params.search) {
    where.OR = [
      { title: { contains: params.search } },
      { brand: { contains: params.search } },
      { model: { contains: params.search } },
    ];
  }
  if (params.minPrice || params.maxPrice) {
    where.finalPrice = {};
    if (params.minPrice) (where.finalPrice as Record<string, number>).gte = parseFloat(params.minPrice);
    if (params.maxPrice) (where.finalPrice as Record<string, number>).lte = parseFloat(params.maxPrice);
  }
  if (params.minYear || params.maxYear) {
    where.year = {};
    if (params.minYear) (where.year as Record<string, number>).gte = parseInt(params.minYear);
    if (params.maxYear) (where.year as Record<string, number>).lte = parseInt(params.maxYear);
  }

  const [cars, total] = await Promise.all([
    prisma.car.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { photos: { take: 1 } },
    }),
    prisma.car.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Car className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-gray-900">AutoImport <span className="text-blue-600">Pro</span></span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Iniciar sesión</Link>
              <Link href="/register" className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">Registrarse</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <form className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filtros
                </h3>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Búsqueda</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    name="search"
                    defaultValue={params.search}
                    placeholder="Marca, modelo..."
                    className="w-full pl-8 pr-3 h-9 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Marca</label>
                <select name="brand" defaultValue={params.brand}
                  className="w-full h-9 rounded-md border border-gray-300 text-sm px-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Todas</option>
                  {CAR_BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Combustible</label>
                <select name="fuel" defaultValue={params.fuel}
                  className="w-full h-9 rounded-md border border-gray-300 text-sm px-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Todos</option>
                  {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Transmisión</label>
                <select name="transmission" defaultValue={params.transmission}
                  className="w-full h-9 rounded-md border border-gray-300 text-sm px-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Todas</option>
                  {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Precio (€)</label>
                <div className="flex gap-2">
                  <input name="minPrice" type="number" defaultValue={params.minPrice} placeholder="Mín"
                    className="w-full h-9 rounded-md border border-gray-300 text-sm px-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input name="maxPrice" type="number" defaultValue={params.maxPrice} placeholder="Máx"
                    className="w-full h-9 rounded-md border border-gray-300 text-sm px-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Año</label>
                <div className="flex gap-2">
                  <input name="minYear" type="number" defaultValue={params.minYear} placeholder="Desde"
                    className="w-full h-9 rounded-md border border-gray-300 text-sm px-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input name="maxYear" type="number" defaultValue={params.maxYear} placeholder="Hasta"
                    className="w-full h-9 rounded-md border border-gray-300 text-sm px-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <button type="submit"
                className="w-full h-9 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                Aplicar Filtros
              </button>
              {Object.values(params).some(Boolean) && (
                <Link href="/catalog" className="block text-center text-xs text-gray-500 hover:text-gray-700">
                  Limpiar filtros
                </Link>
              )}
            </form>
          </aside>

          {/* Car grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{total}</span> vehículos encontrados
              </p>
            </div>

            {cars.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
                <Car className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No se encontraron vehículos</p>
                <p className="text-sm text-gray-400 mt-1">Prueba con otros filtros</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {cars.map((car) => (
                    <Link key={car.id} href={`/catalog/${car.id}`}>
                      <div className="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                        <div className="aspect-video bg-gray-100 overflow-hidden">
                          {car.photos[0] ? (
                            <img
                              src={car.photos[0].url}
                              alt={car.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Car className="h-12 w-12 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-sm font-semibold text-gray-900 truncate">{car.title}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span>{car.year}</span>
                            {car.mileage && <span>{car.mileage.toLocaleString()} km</span>}
                            {car.fuelType && <span>{car.fuelType}</span>}
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-lg font-bold text-blue-700">{formatPrice(car.finalPrice)}</p>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{car.brand}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    {page > 1 && (
                      <Link href={`/catalog?${new URLSearchParams({ ...params, page: String(page - 1) })}`}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
                        Anterior
                      </Link>
                    )}
                    <span className="text-sm text-gray-600">Página {page} de {totalPages}</span>
                    {page < totalPages && (
                      <Link href={`/catalog?${new URLSearchParams({ ...params, page: String(page + 1) })}`}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
                        Siguiente
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
