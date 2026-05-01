"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { showToast } from "@/components/ui/toast";
import { formatPrice, formatDate, STATUS_LABELS } from "@/lib/utils";
import { Car, Plus, Search, Check, X, Eye, Trash2, Globe } from "lucide-react";

interface CarItem {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  finalPrice: number;
  status: string;
  source: string;
  isPublished: boolean;
  createdAt: string;
  photos: { url: string }[];
  submittedBy: { name: string; role: string };
  _count: { photos: number };
}

function AdminCarsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cars, setCars] = useState<CarItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [page, setPage] = useState(1);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      params.set("page", page.toString());
      params.set("limit", "20");

      const res = await fetch(`/api/cars?${params}`);
      const data = await res.json();
      setCars(data.cars || []);
      setTotal(data.total || 0);
    } catch {
      showToast("Error al cargar coches", "error");
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  async function updateStatus(id: string, newStatus: string) {
    try {
      const updates: Record<string, unknown> = { status: newStatus };
      if (newStatus === "PUBLISHED") updates.isPublished = true;
      if (newStatus === "REJECTED") updates.isPublished = false;

      const res = await fetch(`/api/cars/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      showToast(`Estado actualizado a ${STATUS_LABELS[newStatus]?.label || newStatus}`, "success");
      fetchCars();
    } catch {
      showToast("Error al actualizar el estado", "error");
    }
  }

  async function deleteCar(id: string) {
    if (!confirm("¿Seguro que quieres eliminar este coche?")) return;
    try {
      const res = await fetch(`/api/cars/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Coche eliminado", "success");
      fetchCars();
    } catch {
      showToast("Error al eliminar", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Coches</h1>
          <p className="text-sm text-gray-500">{total} coches en total</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/apis">
            <Button variant="outline" size="sm">
              <Globe className="h-4 w-4" />
              Importar de API
            </Button>
          </Link>
          <Link href="/admin/cars/new">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Añadir Coche
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Buscar por título, marca, modelo..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 h-10 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Select
          options={[
            { value: "", label: "Todos los estados" },
            { value: "PENDING", label: "Pendiente" },
            { value: "APPROVED", label: "Aprobado" },
            { value: "REJECTED", label: "Rechazado" },
            { value: "PUBLISHED", label: "Publicado" },
          ]}
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="w-full sm:w-48"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : cars.length === 0 ? (
          <div className="py-16 text-center">
            <Car className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500">No se encontraron coches</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Coche</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Proveedor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Precio</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Fecha</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cars.map((car) => {
                  const statusInfo = STATUS_LABELS[car.status] || { label: car.status, color: "bg-gray-100 text-gray-700" };
                  return (
                    <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-14 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                            {car.photos[0] ? (
                              <img src={car.photos[0].url} alt={car.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Car className="h-4 w-4 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{car.title}</p>
                            <p className="text-xs text-gray-500">{car.year} · {car._count.photos} fotos</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="text-sm text-gray-700">{car.submittedBy.name}</p>
                        <p className="text-xs text-gray-400">{car.source}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-gray-900">{formatPrice(car.finalPrice)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-500">
                        {formatDate(car.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/cars/${car.id}`}>
                            <button className="rounded p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                              <Eye className="h-4 w-4" />
                            </button>
                          </Link>
                          {car.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => updateStatus(car.id, "APPROVED")}
                                className="rounded p-1.5 hover:bg-green-50 text-green-600"
                                title="Aprobar"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => updateStatus(car.id, "REJECTED")}
                                className="rounded p-1.5 hover:bg-red-50 text-red-600"
                                title="Rechazar"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {car.status === "APPROVED" && (
                            <button
                              onClick={() => updateStatus(car.id, "PUBLISHED")}
                              className="rounded px-2 py-1 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              Publicar
                            </button>
                          )}
                          <button
                            onClick={() => deleteCar(car.id)}
                            className="rounded p-1.5 hover:bg-red-50 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {Math.ceil(total / 20) > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Página {page} de {Math.ceil(total / 20)}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Anterior</Button>
            <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}>Siguiente</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCarsPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" /></div>}>
      <AdminCarsPage />
    </Suspense>
  );
}
