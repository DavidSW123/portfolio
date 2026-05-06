import { requireSession } from "@/lib/server-session";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, Search, MessageSquare, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function ClientDashboard() {
  const session = await requireSession(["CLIENT", "ADMIN", "DEVELOPER"]);

  const [featuredCars, totalCars] = await Promise.all([
    prisma.car.findMany({
      where: { isPublished: true, status: "PUBLISHED" },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { photos: { take: 1 } },
    }),
    prisma.car.count({ where: { isPublished: true, status: "PUBLISHED" } }),
  ]);

  return (
    <DashboardLayout role="CLIENT" userName={session.name} userEmail={session.email}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido, {session.name.split(" ")[0]}</h1>
          <p className="text-gray-500 text-sm mt-1">Explora nuestro catálogo de coches importados</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalCars}</p>
                  <p className="text-xs text-gray-500">Coches disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Ver catálogo</p>
                <p className="text-xs text-gray-500">Todos los vehículos</p>
              </div>
              <Link href="/catalog">
                <Button size="sm" variant="outline">
                  <Search className="h-4 w-4" />
                  Explorar
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Mis consultas</p>
                <p className="text-xs text-gray-500">Historial de interés</p>
              </div>
              <Link href="/client/inquiries">
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4" />
                  Ver
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Featured cars */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Últimas incorporaciones</h2>
            <Link href="/catalog" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredCars.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
              <Car className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No hay coches disponibles todavía</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCars.map((car) => (
                <Link key={car.id} href={`/catalog/${car.id}`}>
                  <div className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-all cursor-pointer group">
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      {car.photos[0] ? (
                        <img
                          src={car.photos[0].url}
                          alt={car.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Car className="h-10 w-10 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold text-gray-900 truncate">{car.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{car.year} · {car.fuelType || "—"} · {car.transmission || "—"}</p>
                      <p className="text-lg font-bold text-blue-700 mt-2">{formatPrice(car.finalPrice)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
