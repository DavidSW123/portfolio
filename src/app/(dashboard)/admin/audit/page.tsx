import { requireSession } from "@/lib/server-session";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { formatDate } from "@/lib/utils";
import { Shield } from "lucide-react";

const ACTION_LABELS: Record<string, string> = {
  LOGIN: "Inicio de sesión",
  LOGOUT: "Cierre de sesión",
  LOGIN_FAILED: "Intento fallido",
  CREATE_CAR: "Coche creado",
  UPDATE_CAR: "Coche actualizado",
  DELETE_CAR: "Coche eliminado",
  APPROVE_CAR: "Coche aprobado",
  REJECT_CAR: "Coche rechazado",
  PUBLISH_CAR: "Coche publicado",
  CREATE_USER: "Usuario creado",
  UPDATE_USER: "Usuario actualizado",
  DELETE_USER: "Usuario eliminado",
  CHANGE_PASSWORD: "Contraseña cambiada",
};

const ACTION_COLORS: Record<string, string> = {
  LOGIN: "bg-green-100 text-green-700",
  LOGOUT: "bg-gray-100 text-gray-600",
  LOGIN_FAILED: "bg-red-100 text-red-700",
  CREATE_CAR: "bg-blue-100 text-blue-700",
  DELETE_CAR: "bg-red-100 text-red-700",
  DELETE_USER: "bg-red-100 text-red-700",
  APPROVE_CAR: "bg-green-100 text-green-700",
  REJECT_CAR: "bg-orange-100 text-orange-700",
  PUBLISH_CAR: "bg-purple-100 text-purple-700",
};

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; action?: string; userId?: string }>;
}) {
  const session = await requireSession(["ADMIN", "DEVELOPER"]);
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const limit = 50;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (params.action) where.action = params.action;
  if (params.userId) where.userId = params.userId;

  const [logs, total, users] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { user: { select: { name: true, email: true, role: true } } },
    }),
    prisma.auditLog.count({ where }),
    prisma.user.findMany({ select: { id: true, name: true, email: true }, orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout role={session.role} userName={session.name} userEmail={session.email}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registro de Auditoría</h1>
          <p className="text-sm text-gray-500">{total} eventos registrados</p>
        </div>

        {/* Filters */}
        <form className="flex flex-col sm:flex-row gap-3">
          <select
            name="action"
            defaultValue={params.action || ""}
            className="h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las acciones</option>
            {Object.entries(ACTION_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            name="userId"
            defaultValue={params.userId || ""}
            className="h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los usuarios</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
          <button
            type="submit"
            className="h-10 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            Filtrar
          </button>
          <a
            href="/admin/audit"
            className="h-10 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
          >
            Limpiar
          </a>
        </form>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          {logs.length === 0 ? (
            <div className="py-16 text-center">
              <Shield className="mx-auto h-10 w-10 text-gray-300 mb-3" />
              <p className="text-gray-500">No hay registros</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Usuario</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Acción</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Entidad</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">IP</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Detalles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((log) => {
                    const color = ACTION_COLORS[log.action] || "bg-gray-100 text-gray-600";
                    return (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(log.createdAt.toISOString())}
                        </td>
                        <td className="px-4 py-3">
                          {log.user ? (
                            <div>
                              <p className="text-sm font-medium text-gray-900">{log.user.name}</p>
                              <p className="text-xs text-gray-400">{log.user.email}</p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
                            {ACTION_LABELS[log.action] || log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-600">
                          {log.entity && (
                            <span className="text-xs">
                              {log.entity}
                              {log.entityId && <span className="text-gray-400 ml-1">#{log.entityId.slice(0, 8)}</span>}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400 font-mono">
                          {log.ip || "—"}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500 max-w-xs truncate">
                          {log.details || "—"}
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
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Página {page} de {totalPages}</p>
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={`/admin/audit?page=${page - 1}${params.action ? `&action=${params.action}` : ""}${params.userId ? `&userId=${params.userId}` : ""}`}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Anterior
                </a>
              )}
              {page < totalPages && (
                <a
                  href={`/admin/audit?page=${page + 1}${params.action ? `&action=${params.action}` : ""}${params.userId ? `&userId=${params.userId}` : ""}`}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Siguiente
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
