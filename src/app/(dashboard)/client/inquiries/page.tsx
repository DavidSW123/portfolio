"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { showToast } from "@/components/ui/toast";
import { formatPrice, formatDate } from "@/lib/utils";
import { MessageSquare, Car, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

interface Inquiry {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  car: {
    id: string;
    title: string;
    finalPrice: number;
    photos: { url: string }[];
  };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: Clock },
  CONTACTED: { label: "Contactado", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  RESOLVED: { label: "Resuelto", color: "bg-green-100 text-green-700", icon: CheckCircle },
  CANCELLED: { label: "Cancelado", color: "bg-gray-100 text-gray-500", icon: XCircle },
};

export default function ClientInquiriesPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState("CLIENT");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) { router.push("/login"); return; }
        setUserRole(data.user.role);
        setUserName(data.user.name);
        setUserEmail(data.user.email);
        fetchInquiries(1);
      });
  }, [router]);

  async function fetchInquiries(p: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/inquiries?page=${p}`);
      const data = await res.json();
      setInquiries(data.inquiries || []);
      setTotal(data.total || 0);
    } catch {
      showToast("Error al cargar consultas", "error");
    } finally {
      setLoading(false);
    }
  }

  function changePage(p: number) {
    setPage(p);
    fetchInquiries(p);
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <DashboardLayout role={userRole as "CLIENT"} userName={userName} userEmail={userEmail}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Consultas</h1>
            <p className="text-sm text-gray-500">{total} consulta{total !== 1 ? "s" : ""} realizadas</p>
          </div>
          <Link href="/catalog">
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Explorar catálogo
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : inquiries.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-200 mb-4" />
              <p className="text-gray-600 font-medium">No tienes consultas todavía</p>
              <p className="text-sm text-gray-400 mt-1 mb-6">
                Cuando te interese un coche, puedes enviar una consulta desde el catálogo.
              </p>
              <Link href="/catalog">
                <button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Ver catálogo
                </button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => {
              const status = STATUS_CONFIG[inquiry.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = status.icon;
              return (
                <Card key={inquiry.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Car thumbnail */}
                      <div className="w-full sm:w-32 h-32 sm:h-auto flex-shrink-0 bg-gray-100 overflow-hidden">
                        {inquiry.car.photos[0] ? (
                          <img
                            src={inquiry.car.photos[0].url}
                            alt={inquiry.car.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Car className="h-8 w-8 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <Link
                              href={`/catalog/${inquiry.car.id}`}
                              className="text-sm font-semibold text-gray-900 hover:text-blue-600"
                            >
                              {inquiry.car.title}
                            </Link>
                            <p className="text-sm font-bold text-blue-700 mt-0.5">{formatPrice(inquiry.car.finalPrice)}</p>
                          </div>
                          <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium flex-shrink-0 ${status.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </span>
                        </div>
                        <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 mb-2">
                          <p className="text-sm text-gray-700 whitespace-pre-line">{inquiry.message}</p>
                        </div>
                        <p className="text-xs text-gray-400">
                          Enviada el {formatDate(inquiry.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                onClick={() => changePage(page - 1)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => changePage(page + 1)}
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
