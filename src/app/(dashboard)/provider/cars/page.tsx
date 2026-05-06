import { requireSession } from "@/lib/server-session";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, Plus, Pencil } from "lucide-react";
import { formatPrice, formatDate, STATUS_LABELS } from "@/lib/utils";

export default async function ProviderCarsPage() {
  const session = await requireSession(["PROVIDER", "ADMIN", "DEVELOPER"]);

  const cars = await prisma.car.findMany({
    where: { submittedById: session.id },
    orderBy: { createdAt: "desc" },
    include: {
      photos: { take: 1 },
      _count: { select: { photos: true, comments: true } },
    },
  });

  return (
    <DashboardLayout role="PROVIDER" userName={session.name} userEmail={session.email}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Coches</h1>
            <p className="text-sm text-gray-500">{cars.length} coches enviados</p>
          </div>
          <Link href="/provider/add-car">
            <Button>
              <Plus className="h-4 w-4" />
              Añadir Coche
            </Button>
          </Link>
        </div>

        {cars.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
            <Car className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No has añadido ningún coche todavía</p>
            <Link href="/provider/add-car" className="mt-4 inline-block">
              <Button>Añadir mi primer coche</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => {
              const statusInfo = STATUS_LABELS[car.status] || { label: car.status, color: "bg-gray-100 text-gray-700" };
              return (
                <div key={car.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    {car.photos[0] ? (
                      <img src={car.photos[0].url} alt={car.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Car className="h-10 w-10 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900 truncate flex-1">{car.title}</p>
                      <span className={`ml-2 flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      {car.year} · {car._count.photos} fotos · {formatDate(car.createdAt)}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-400">Precio base: {formatPrice(car.basePrice)}</p>
                        <p className="text-sm font-bold text-blue-700">{formatPrice(car.finalPrice)}</p>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">+{car.markup}%</span>
                    </div>
                    <Link href={`/provider/cars/${car.id}/edit`} className="mt-auto">
                      <Button variant="outline" size="sm" className="w-full">
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
