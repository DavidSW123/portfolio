"use client";
import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { showToast } from "@/components/ui/toast";
import { formatPrice, formatDate } from "@/lib/utils";
import { MessageSquare, Car, Clock, CheckCircle, XCircle, Phone } from "lucide-react";

interface Inquiry {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  car: { id: string; title: string; finalPrice: number; photos: { url: string }[] };
  client: { id: string; user: { name: string; email: string } };
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pendiente", color: "bg-amber-100 text-amber-700" },
  CONTACTED: { label: "Contactado", color: "bg-blue-100 text-blue-700" },
  RESOLVED: { label: "Resuelto", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelado", color: "bg-gray-100 text-gray-500" },
};

export default function AdminInquiriesPage() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) { setUserName(d.user.name); setUserEmail(d.user.email); }
      });
  }, []);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString() });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/inquiries?${params}`);
      const data = await res.json();
      setInquiries(data.inquiries || []);
      setTotal(data.total || 0);
    } catch {
      showToast("Error al cargar consultas", "error");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      showToast("Estado actualizado", "success");
      fetchInquiries();
    } catch {
      showToast("Error al actualizar", "error");
    } finally {
      setUpdating(null);
    }
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <DashboardLayout role="ADMIN" userName={userName} userEmail={userEmail}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Consultas de Clientes</h1>
            <p className="text-sm text-gray-500">{total} consulta{total !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: "", label: "Todas" },
            { value: "PENDING", label: "Pendientes" },
            { value: "CONTACTED", label: "Contactados" },
            { value: "RESOLVED", label: "Resueltos" },
            { value: "CANCELLED", label: "Cancelados" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setStatusFilter(opt.value); setPage(1); }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === opt.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="py-16 text-center rounded-xl border border-dashed border-gray-200">
            <MessageSquare className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500">No hay consultas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => {
              const status = STATUS_CONFIG[inquiry.status] || STATUS_CONFIG.PENDING;
              return (
                <div key={inquiry.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {/* Car thumbnail */}
                    <div className="w-full sm:w-28 h-24 sm:h-auto flex-shrink-0 bg-gray-100 overflow-hidden">
                      {inquiry.car.photos[0] ? (
                        <img src={inquiry.car.photos[0].url} alt={inquiry.car.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Car className="h-8 w-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{inquiry.car.title}</p>
                          <p className="text-sm font-bold text-blue-700">{formatPrice(inquiry.car.finalPrice)}</p>
                        </div>
                        <span className={`self-start rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      {/* Client info */}
                      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                        <Phone className="h-3 w-3" />
                        <span className="font-medium text-gray-700">{inquiry.client.user.name}</span>
                        <span>·</span>
                        <a href={`mailto:${inquiry.client.user.email}`} className="hover:text-blue-600">
                          {inquiry.client.user.email}
                        </a>
                        <span>·</span>
                        <span>{formatDate(inquiry.createdAt)}</span>
                      </div>

                      <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 mb-3">
                        <p className="text-sm text-gray-700 whitespace-pre-line">{inquiry.message}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        {inquiry.status === "PENDING" && (
                          <button
                            disabled={updating === inquiry.id}
                            onClick={() => updateStatus(inquiry.id, "CONTACTED")}
                            className="flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                          >
                            <Phone className="h-3 w-3" />
                            Marcar contactado
                          </button>
                        )}
                        {(inquiry.status === "PENDING" || inquiry.status === "CONTACTED") && (
                          <button
                            disabled={updating === inquiry.id}
                            onClick={() => updateStatus(inquiry.id, "RESOLVED")}
                            className="flex items-center gap-1 rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Resolver
                          </button>
                        )}
                        {inquiry.status !== "CANCELLED" && inquiry.status !== "RESOLVED" && (
                          <button
                            disabled={updating === inquiry.id}
                            onClick={() => updateStatus(inquiry.id, "CANCELLED")}
                            className="flex items-center gap-1 rounded-md bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <XCircle className="h-3 w-3" />
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Página {page} de {totalPages}</p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
