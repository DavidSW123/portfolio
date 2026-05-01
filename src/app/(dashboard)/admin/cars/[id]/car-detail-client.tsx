"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/toast";
import { formatPrice, formatDate, STATUS_LABELS, calculateFinalPrice } from "@/lib/utils";
import { ChevronLeft, Check, X, Eye, EyeOff, MessageSquare, Car } from "lucide-react";

interface CarData {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  mileage?: number | null;
  color?: string | null;
  fuelType?: string | null;
  transmission?: string | null;
  engine?: string | null;
  doors?: number | null;
  description?: string | null;
  basePrice: number;
  markup: number;
  finalPrice: number;
  status: string;
  source: string;
  isPublished: boolean;
  approvedAt?: Date | null;
  createdAt: Date;
  photos: { id: string; url: string; filename: string; order: number }[];
  comments: { id: string; content: string; authorName?: string | null; isInternal: boolean; createdAt: Date }[];
  submittedBy: { id: string; name: string; email: string; role: string };
  approvedBy?: { id: string; name: string } | null;
}

export function AdminCarDetail({ car: initialCar }: { car: CarData }) {
  const router = useRouter();
  const [car, setCar] = useState(initialCar);
  const [markup, setMarkup] = useState(car.markup.toString());
  const [saving, setSaving] = useState(false);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const statusInfo = STATUS_LABELS[car.status] || { label: car.status, color: "bg-gray-100 text-gray-700" };

  async function updateCar(updates: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/cars/${car.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      const updated = await res.json();
      setCar((prev) => ({ ...prev, ...updated }));
      showToast("Coche actualizado", "success");
    } catch {
      showToast("Error al actualizar", "error");
    } finally {
      setSaving(false);
    }
  }

  async function addComment() {
    if (!comment.trim()) return;
    setAddingComment(true);
    try {
      const res = await fetch(`/api/cars/${car.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment, isInternal: true }),
      });
      if (!res.ok) throw new Error();
      const newComment = await res.json();
      setCar((prev) => ({ ...prev, comments: [...prev.comments, newComment] }));
      setComment("");
      showToast("Comentario añadido", "success");
    } catch {
      showToast("Error al añadir comentario", "error");
    } finally {
      setAddingComment(false);
    }
  }

  const newFinalPrice = calculateFinalPrice(car.basePrice, parseFloat(markup) || car.markup);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/cars" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2">
            <ChevronLeft className="h-4 w-4" />
            Volver
          </Link>
          <h1 className="text-xl font-bold text-gray-900">{car.title}</h1>
          <p className="text-sm text-gray-500">Enviado por {car.submittedBy.name} · {formatDate(car.createdAt)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos */}
          {car.photos.length > 0 ? (
            <div className="space-y-2">
              <div className="aspect-video overflow-hidden rounded-xl bg-gray-100">
                <img src={car.photos[selectedPhoto]?.url} alt={car.title} className="h-full w-full object-cover" />
              </div>
              {car.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {car.photos.map((photo, i) => (
                    <button
                      key={photo.id}
                      onClick={() => setSelectedPhoto(i)}
                      className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${i === selectedPhoto ? "border-blue-500" : "border-transparent"}`}
                    >
                      <img src={photo.url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video rounded-xl bg-gray-100 flex items-center justify-center">
              <Car className="h-16 w-16 text-gray-300" />
            </div>
          )}

          {/* Specs */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Especificaciones</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Marca", value: car.brand },
                { label: "Modelo", value: car.model },
                { label: "Año", value: car.year },
                { label: "Kilometraje", value: car.mileage ? `${car.mileage.toLocaleString()} km` : "—" },
                { label: "Color", value: car.color || "—" },
                { label: "Combustible", value: car.fuelType || "—" },
                { label: "Transmisión", value: car.transmission || "—" },
                { label: "Motor", value: car.engine || "—" },
                { label: "Puertas", value: car.doors || "—" },
              ].map((spec) => (
                <div key={spec.label}>
                  <p className="text-xs text-gray-500">{spec.label}</p>
                  <p className="text-sm font-medium text-gray-900">{spec.value}</p>
                </div>
              ))}
            </div>
            {car.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Descripción</p>
                <p className="text-sm text-gray-700">{car.description}</p>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comentarios internos ({car.comments.length})
            </h3>
            <div className="space-y-3 mb-4">
              {car.comments.map((c) => (
                <div key={c.id} className="rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-gray-700">{c.authorName || "Sistema"}</p>
                    <p className="text-xs text-gray-400">{formatDate(c.createdAt)}</p>
                  </div>
                  <p className="text-sm text-gray-600">{c.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Añadir comentario interno..."
                className="flex-1 h-9 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => { if (e.key === "Enter") addComment(); }}
              />
              <Button size="sm" onClick={addComment} loading={addingComment}>Añadir</Button>
            </div>
          </div>
        </div>

        {/* Right column - Admin panel */}
        <div className="space-y-4">
          {/* Pricing */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Precio y Margen</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Precio base</p>
                <p className="text-lg font-bold text-gray-900">{formatPrice(car.basePrice)}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Margen (%)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={markup}
                    onChange={(e) => setMarkup(e.target.value)}
                    className="flex-1 h-9 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    size="sm"
                    onClick={() => updateCar({ markup: parseFloat(markup) })}
                    loading={saving}
                    disabled={parseFloat(markup) === car.markup}
                  >
                    Guardar
                  </Button>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">Precio final</p>
                <p className="text-xl font-bold text-blue-700">{formatPrice(newFinalPrice)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Acciones</h3>

            {car.status === "PENDING" && (
              <>
                <Button
                  className="w-full"
                  onClick={() => updateCar({ status: "APPROVED" })}
                  loading={saving}
                >
                  <Check className="h-4 w-4" />
                  Aprobar Coche
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => updateCar({ status: "REJECTED" })}
                  loading={saving}
                >
                  <X className="h-4 w-4" />
                  Rechazar
                </Button>
              </>
            )}

            {car.status === "APPROVED" && (
              <Button
                className="w-full"
                onClick={() => updateCar({ status: "PUBLISHED", isPublished: true })}
                loading={saving}
              >
                <Eye className="h-4 w-4" />
                Publicar en Catálogo
              </Button>
            )}

            {car.status === "PUBLISHED" && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => updateCar({ isPublished: !car.isPublished })}
                loading={saving}
              >
                {car.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {car.isPublished ? "Ocultar del catálogo" : "Mostrar en catálogo"}
              </Button>
            )}

            {car.status === "REJECTED" && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => updateCar({ status: "PENDING" })}
                loading={saving}
              >
                Volver a Pendiente
              </Button>
            )}
          </div>

          {/* Submitter info */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Enviado por</h3>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                {car.submittedBy.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{car.submittedBy.name}</p>
                <p className="text-xs text-gray-500">{car.submittedBy.email}</p>
                <p className="text-xs text-gray-400">{car.submittedBy.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
