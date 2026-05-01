import { requireSession } from "@/lib/server-session";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Car, Users, Clock, CheckCircle, TrendingUp, Globe, AlertCircle } from "lucide-react";
import { formatPrice, formatDate, STATUS_LABELS } from "@/lib/utils";

export default async function AdminDashboard() {
  const session = await requireSession(["ADMIN"]);

  const [
    totalCars,
    pendingCars,
    publishedCars,
    totalUsers,
    recentCars,
    recentUsers,
    totalApis,
  ] = await Promise.all([
    prisma.car.count(),
    prisma.car.count({ where: { status: "PENDING" } }),
    prisma.car.count({ where: { status: "PUBLISHED", isPublished: true } }),
    prisma.user.count(),
    prisma.car.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        photos: { take: 1 },
        submittedBy: { select: { name: true, role: true } },
      },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
    prisma.apiConfig.count({ where: { isActive: true } }),
  ]);

  const stats = [
    { label: "Total Coches", value: totalCars, icon: Car, color: "text-blue-600 bg-blue-50", href: "/admin/cars" },
    { label: "Pendientes Aprobación", value: pendingCars, icon: Clock, color: "text-yellow-600 bg-yellow-50", href: "/admin/cars?status=PENDING" },
    { label: "Publicados", value: publishedCars, icon: CheckCircle, color: "text-green-600 bg-green-50", href: "/admin/cars?status=PUBLISHED" },
    { label: "Usuarios", value: totalUsers, icon: Users, color: "text-purple-600 bg-purple-50", href: "/admin/users" },
    { label: "APIs Activas", value: totalApis, icon: Globe, color: "text-indigo-600 bg-indigo-50", href: "/admin/apis" },
  ];

  return (
    <DashboardLayout role="ADMIN" userName={session.name} userEmail={session.email}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-500 text-sm mt-1">Bienvenido, {session.name}</p>
        </div>

        {/* Alert for pending */}
        {pendingCars > 0 && (
          <div className="flex items-center gap-3 rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800 font-medium">
              Hay <strong>{pendingCars}</strong> coche{pendingCars !== 1 ? "s" : ""} pendiente{pendingCars !== 1 ? "s" : ""} de aprobación.{" "}
              <Link href="/admin/cars?status=PENDING" className="underline">Revisar ahora</Link>
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((s) => (
            <Link key={s.label} href={s.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg mb-3 ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent cars */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Últimos Coches</CardTitle>
                <Link href="/admin/cars" className="text-xs text-blue-600 hover:underline">Ver todos</Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentCars.map((car) => {
                  const statusInfo = STATUS_LABELS[car.status] || STATUS_LABELS.PENDING;
                  return (
                    <Link key={car.id} href={`/admin/cars/${car.id}`} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors">
                      <div className="h-10 w-14 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        {car.photos[0] ? (
                          <img src={car.photos[0].url} alt={car.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Car className="h-4 w-4 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{car.title}</p>
                        <p className="text-xs text-gray-500">{car.submittedBy.name} · {formatDate(car.createdAt)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                        <span className="text-xs font-semibold text-gray-900">{formatPrice(car.finalPrice)}</span>
                      </div>
                    </Link>
                  );
                })}
                {recentCars.length === 0 && (
                  <p className="px-6 py-6 text-sm text-gray-400 text-center">No hay coches todavía</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent users */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Últimos Usuarios</CardTitle>
                <Link href="/admin/users" className="text-xs text-blue-600 hover:underline">Ver todos</Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentUsers.map((user) => {
                  const roleColors: Record<string, string> = {
                    ADMIN: "bg-purple-100 text-purple-700",
                    PROVIDER: "bg-blue-100 text-blue-700",
                    COLLABORATOR: "bg-green-100 text-green-700",
                    CLIENT: "bg-gray-100 text-gray-700",
                  };
                  const roleLabels: Record<string, string> = {
                    ADMIN: "Admin", PROVIDER: "Proveedor", COLLABORATOR: "Colaborador", CLIENT: "Cliente",
                  };
                  return (
                    <Link key={user.id} href={`/admin/users/${user.id}`} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="truncate text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleColors[user.role]}`}>
                          {roleLabels[user.role]}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(user.createdAt)}</span>
                      </div>
                    </Link>
                  );
                })}
                {recentUsers.length === 0 && (
                  <p className="px-6 py-6 text-sm text-gray-400 text-center">No hay usuarios todavía</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
