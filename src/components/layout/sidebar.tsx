"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Car, Users, Settings, LogOut, ChevronRight,
  Package, UserCheck, Globe, BarChart3, FileText, Bell, Shield
} from "lucide-react";
import type { Role } from "@/types";

const navItems: Record<Role, { href: string; label: string; icon: React.ElementType }[]> = {
  ADMIN: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/cars", label: "Gestión de Coches", icon: Car },
    { href: "/admin/users", label: "Usuarios", icon: Users },
    { href: "/admin/apis", label: "APIs Externas", icon: Globe },
    { href: "/admin/reports", label: "Reportes", icon: BarChart3 },
    { href: "/admin/audit", label: "Auditoría", icon: Shield },
  ],
  PROVIDER: [
    { href: "/provider", label: "Dashboard", icon: LayoutDashboard },
    { href: "/provider/cars", label: "Mis Coches", icon: Car },
    { href: "/provider/add-car", label: "Añadir Coche", icon: Package },
  ],
  COLLABORATOR: [
    { href: "/collaborator", label: "Dashboard", icon: LayoutDashboard },
    { href: "/collaborator/cars", label: "Mis Coches", icon: Car },
    { href: "/collaborator/add-car", label: "Añadir Coche", icon: Package },
  ],
  CLIENT: [
    { href: "/client", label: "Dashboard", icon: LayoutDashboard },
    { href: "/catalog", label: "Catálogo", icon: Car },
    { href: "/client/inquiries", label: "Mis Consultas", icon: FileText },
  ],
};

interface SidebarProps {
  role: Role;
  userName: string;
  userEmail: string;
}

export function Sidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const items = navItems[role] || [];

  const roleLabels: Record<Role, { label: string; color: string }> = {
    ADMIN: { label: "Administrador", color: "bg-purple-100 text-purple-700" },
    PROVIDER: { label: "Proveedor", color: "bg-blue-100 text-blue-700" },
    COLLABORATOR: { label: "Colaborador", color: "bg-green-100 text-green-700" },
    CLIENT: { label: "Cliente", color: "bg-gray-100 text-gray-700" },
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
          <Car className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">AutoImport</p>
          <p className="text-xs text-gray-500">Pro</p>
        </div>
      </div>

      {/* User info */}
      <div className="border-b border-gray-100 px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-sm flex-shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">{userName}</p>
            <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-medium mt-0.5", roleLabels[role].color)}>
              {roleLabels[role].label}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="h-3 w-3" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer actions */}
      <div className="border-t border-gray-200 px-3 py-4 space-y-1">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Settings className="h-4 w-4" />
          Perfil y Ajustes
        </Link>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
