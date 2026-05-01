"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Car, Users, Settings, LogOut, ChevronRight,
  Package, Globe, BarChart3, FileText, Bell, Shield, Zap
} from "lucide-react";
import type { Role } from "@/types";

const navItems: Record<Role, { href: string; label: string; icon: React.ElementType }[]> = {
  ADMIN: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/cars", label: "Gestión de Coches", icon: Car },
    { href: "/admin/users", label: "Usuarios", icon: Users },
    { href: "/admin/apis", label: "APIs Externas", icon: Globe },
    { href: "/admin/inquiries", label: "Consultas", icon: Bell },
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

const roleLabels: Record<Role, { label: string }> = {
  ADMIN: { label: "Administrador" },
  PROVIDER: { label: "Proveedor" },
  COLLABORATOR: { label: "Colaborador" },
  CLIENT: { label: "Cliente" },
};

interface SidebarProps {
  role: Role;
  userName: string;
  userEmail: string;
}

export function Sidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const items = navItems[role] || [];

  return (
    <aside
      className="flex h-screen w-64 flex-col flex-shrink-0"
      style={{
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-6 py-5"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0"
          style={{ background: "var(--accent)", boxShadow: "var(--shadow-accent)" }}
        >
          <Zap className="h-5 w-5" style={{ color: "var(--accent-fg)" }} />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight" style={{ color: "var(--text)" }}>AutoImport</p>
          <p className="text-xs font-medium" style={{ color: "var(--accent)" }}>PRO</p>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div
          className="flex items-center gap-3 rounded-xl p-3"
          style={{ background: "var(--bg-surface-2)" }}
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full flex-shrink-0 text-sm font-bold"
            style={{ background: "var(--accent-subtle)", color: "var(--accent)", border: "1px solid var(--accent)" }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold" style={{ color: "var(--text)" }}>{userName}</p>
            <p
              className="text-xs font-medium px-1.5 py-0.5 rounded-full inline-block mt-0.5"
              style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
            >
              {roleLabels[role].label}
            </p>
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
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all"
                  style={isActive ? {
                    background: "var(--accent-subtle)",
                    color: "var(--accent)",
                    borderLeft: "2px solid var(--accent)",
                    paddingLeft: "calc(0.75rem - 2px)",
                  } : {
                    color: "var(--text-muted)",
                  }}
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

      {/* Footer */}
      <div className="px-3 py-4 space-y-1" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all"
          style={{ color: "var(--text-muted)" }}
        >
          <Settings className="h-4 w-4" />
          Perfil y Ajustes
        </Link>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all"
            style={{ color: "var(--destructive)" }}
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
