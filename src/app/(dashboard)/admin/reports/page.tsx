import { requireSession } from "@/lib/server-session";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Car, Users, TrendingUp, ShoppingBag, CheckCircle, Clock, XCircle, Globe } from "lucide-react";

export default async function ReportsPage() {
  const session = await requireSession(["ADMIN"]);

  const [
    totalCars,
    publishedCars,
    pendingCars,
    rejectedCars,
    totalUsers,
    usersByRole,
    carsBySource,
    recentCars,
    topProviders,
  ] = await Promise.all([
    prisma.car.count(),
    prisma.car.count({ where: { status: "PUBLISHED" } }),
    prisma.car.count({ where: { status: "PENDING" } }),
    prisma.car.count({ where: { status: "REJECTED" } }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.groupBy({ by: ["role"], _count: { id: true } }),
    prisma.car.groupBy({ by: ["source"], _count: { id: true } }),
    prisma.car.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        photos: { take: 1 },
        submittedBy: { select: { name: true } },
      },
    }),
    prisma.car.groupBy({
      by: ["submittedById"],
      _count: { id: true },
      _avg: { finalPrice: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
  ]);

  const publishedWithPrices = await prisma.car.findMany({
    where: { status: "PUBLISHED" },
    select: { finalPrice: true, basePrice: true, markup: true },
  });

  const totalRevenuePotential = publishedWithPrices.reduce((s, c) => s + c.finalPrice, 0);
  const totalMarginPotential = publishedWithPrices.reduce((s, c) => s + (c.finalPrice - c.basePrice), 0);
  const avgMarkup = publishedWithPrices.length
    ? publishedWithPrices.reduce((s, c) => s + c.markup, 0) / publishedWithPrices.length
    : 0;

  const providerIds = topProviders.map((p) => p.submittedById);
  const providerUsers = await prisma.user.findMany({
    where: { id: { in: providerIds } },
    select: { id: true, name: true, role: true },
  });
  const providerMap = Object.fromEntries(providerUsers.map((u) => [u.id, u]));

  const ROLE_LABELS: Record<string, string> = {
    ADMIN: "Administrador",
    PROVIDER: "Proveedor",
    COLLABORATOR: "Colaborador",
    CLIENT: "Cliente",
  };

  const SOURCE_LABELS: Record<string, string> = {
    MANUAL: "Manual",
    ADMIN: "Admin",
    API: "API externa",
  };

  return (
    <DashboardLayout role="ADMIN" userName={session.name} userEmail={session.email}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Informes y Estadísticas</h1>
          <p className="text-sm text-gray-500">Resumen general del sistema</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Total coches</p>
                <Car className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{totalCars}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Publicados</p>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{publishedCars}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{pendingCars}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Usuarios activos</p>
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
            </CardContent>
          </Card>
        </div>

        {/* Financial summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">Valor catálogo</p>
                <ShoppingBag className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenuePotential)}</p>
              <p className="text-xs text-gray-400 mt-1">Precio de venta total ({publishedCars} coches)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">Margen potencial</p>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-700">{formatPrice(totalMarginPotential)}</p>
              <p className="text-xs text-gray-400 mt-1">Diferencia precio base → venta</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">Markup medio</p>
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{avgMarkup.toFixed(1)}%</p>
              <p className="text-xs text-gray-400 mt-1">Sobre coches publicados</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Users by role */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Usuarios por rol
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {usersByRole.map((item) => (
                  <div key={item.role} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{ROLE_LABELS[item.role] || item.role}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min(100, (item._count.id / totalUsers) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-6 text-right">{item._count.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cars by source */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Coches por origen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {carsBySource.map((item) => (
                  <div key={item.source} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{SOURCE_LABELS[item.source] || item.source}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${Math.min(100, (item._count.id / totalCars) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-6 text-right">{item._count.id}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-green-700">{publishedCars}</p>
                  <p className="text-xs text-gray-500">Publicados</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-600">{pendingCars}</p>
                  <p className="text-xs text-gray-500">Pendientes</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-600">{rejectedCars}</p>
                  <p className="text-xs text-gray-500">Rechazados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top providers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top proveedores / colaboradores</CardTitle>
            </CardHeader>
            <CardContent>
              {topProviders.length === 0 ? (
                <p className="text-sm text-gray-400">Sin datos</p>
              ) : (
                <div className="space-y-3">
                  {topProviders.map((p, i) => {
                    const u = providerMap[p.submittedById];
                    return (
                      <div key={p.submittedById} className="flex items-center gap-3">
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{u?.name || "Desconocido"}</p>
                          <p className="text-xs text-gray-400">{u?.role ? ROLE_LABELS[u.role] || u.role : ""}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{p._count.id} coches</p>
                          {p._avg.finalPrice && (
                            <p className="text-xs text-gray-400">avg {formatPrice(p._avg.finalPrice)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent cars */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Últimos coches añadidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCars.map((car) => (
                  <div key={car.id} className="flex items-center gap-3">
                    <div className="h-10 w-14 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                      {car.photos[0] ? (
                        <img src={car.photos[0].url} alt={car.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Car className="h-4 w-4 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{car.title}</p>
                      <p className="text-xs text-gray-400">{car.submittedBy.name}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0">{formatPrice(car.finalPrice)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
