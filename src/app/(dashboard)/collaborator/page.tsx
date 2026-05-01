import { requireSession } from "@/lib/server-session";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, Clock, CheckCircle, XCircle, Plus, ArrowRight } from "lucide-react";
import { formatPrice, formatDate, STATUS_LABELS } from "@/lib/utils";

export default async function CollaboratorDashboard() {
  const session = await requireSession(["COLLABORATOR", "ADMIN"]);

  const [myCars, stats] = await Promise.all([
    prisma.car.findMany({
      where: { submittedById: session.id },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { photos: { take: 1 } },
    }),
    prisma.car.groupBy({
      by: ["status"],
      where: { submittedById: session.id },
      _count: true,
    }),
  ]);

  const statMap = Object.fromEntries(stats.map((s) => [s.status, s._count]));

  return (
    <DashboardLayout role="COLLABORATOR" userName={session.name} userEmail={session.email}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Colaborador</h1>
            <p className="text-gray-500 text-sm mt-1">Bienvenido, {session.name}</p>
          </div>
          <Link href="/collaborator/add-car">
            <Button>
              <Plus className="h-4 w-4" />
              Añadir Coche
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Pendientes", value: statMap["PENDING"] || 0, icon: Clock, color: "text-yellow-600 bg-yellow-50" },
            { label: "Aprobados", value: statMap["APPROVED"] || 0, icon: CheckCircle, color: "text-blue-600 bg-blue-50" },
            { label: "Publicados", value: statMap["PUBLISHED"] || 0, icon: Car, color: "text-green-600 bg-green-50" },
            { label: "Rechazados", value: statMap["REJECTED"] || 0, icon: XCircle, color: "text-red-600 bg-red-50" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg mb-3 ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
          <strong>Recuerda:</strong> Los coches que añadas serán revisados por el administrador antes de publicarse. El margen aplicado es del 30% sobre el precio base.
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Mis últimos coches</CardTitle>
              <Link href="/collaborator/cars" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                Ver todos <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {myCars.length === 0 ? (
              <div className="py-10 text-center">
                <Car className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Aún no has añadido ningún coche</p>
                <Link href="/collaborator/add-car" className="mt-3 inline-block">
                  <Button size="sm">Añadir mi primer coche</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {myCars.map((car) => {
                  const statusInfo = STATUS_LABELS[car.status] || { label: car.status, color: "bg-gray-100 text-gray-700" };
                  return (
                    <div key={car.id} className="flex items-center gap-3 px-6 py-3">
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
                        <p className="truncate text-sm font-medium text-gray-900">{car.title}</p>
                        <p className="text-xs text-gray-500">{formatDate(car.createdAt)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                        <span className="text-xs font-semibold text-gray-900">{formatPrice(car.finalPrice)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
