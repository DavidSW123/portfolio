import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Car, ArrowLeft, Fuel, Settings, Calendar, Gauge, Palette, DoorOpen } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { CarGallery } from "./gallery-client";
import { InquiryForm } from "./inquiry-form";

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const car = await prisma.car.findUnique({
    where: { id, isPublished: true, status: "PUBLISHED" },
    include: {
      photos: { orderBy: { order: "asc" } },
      comments: { where: { isInternal: false }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!car) notFound();

  const specs = [
    { label: "Año", value: car.year, icon: Calendar },
    { label: "Combustible", value: car.fuelType, icon: Fuel },
    { label: "Transmisión", value: car.transmission, icon: Settings },
    { label: "Kilometraje", value: car.mileage ? `${car.mileage.toLocaleString()} km` : null, icon: Gauge },
    { label: "Color", value: car.color, icon: Palette },
    { label: "Puertas", value: car.doors, icon: DoorOpen },
    { label: "Motor", value: car.engine, icon: Car },
  ].filter((s) => s.value);

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
        <Link href="/catalog" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Gallery + Info */}
          <div className="lg:col-span-2 space-y-6">
            <CarGallery photos={car.photos} title={car.title} />

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{car.title}</h1>
              <p className="text-gray-500 mt-1">{car.brand} {car.model} · {car.year}</p>
            </div>

            {/* Specs grid */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Especificaciones</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {specs.map((s) => (
                  <div key={s.label} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      <s.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{s.label}</p>
                      <p className="text-sm font-medium text-gray-900">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Descripción</h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{car.description}</p>
              </div>
            )}

            {/* Comments */}
            {car.comments.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Notas del vendedor</h2>
                <div className="space-y-3">
                  {car.comments.map((c) => (
                    <div key={c.id} className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                      {c.content}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Price + Contact */}
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 sticky top-24">
              <div className="mb-5">
                <p className="text-3xl font-bold text-blue-700">{formatPrice(car.finalPrice)}</p>
                <p className="text-xs text-gray-400 mt-1">IVA e impuestos incluidos</p>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { label: "Marca", value: car.brand },
                  { label: "Modelo", value: car.model },
                  { label: "Año", value: car.year },
                  { label: "Origen", value: "Importado" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>

              <InquiryForm carId={car.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
