"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, LayoutDashboard } from "lucide-react";
import type { Role } from "@/types";

interface SessionUser {
  id: string;
  name: string;
  role: Role;
}

const PANEL_BY_ROLE: Record<Role, string> = {
  ADMIN: "/admin",
  DEVELOPER: "/admin",
  PROVIDER: "/provider",
  COLLABORATOR: "/collaborator",
  CLIENT: "/client",
};

const PANEL_LABEL_ES = "Mi panel";
const LOGOUT_LABEL_ES = "Cerrar sesión";
const LOGIN_LABEL_ES = "Iniciar sesión";
const REGISTER_LABEL_ES = "Registro";

interface Props {
  loginLabel?: string;
  registerLabel?: string;
  panelLabel?: string;
  logoutLabel?: string;
  variant?: "light" | "dark";
}

export function AuthNavLinks({
  loginLabel = LOGIN_LABEL_ES,
  registerLabel = REGISTER_LABEL_ES,
  panelLabel = PANEL_LABEL_ES,
  logoutLabel = LOGOUT_LABEL_ES,
  variant = "dark",
}: Props) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.user) setUser(data.user);
        setReady(true);
      })
      .catch(() => setReady(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const linkColor = variant === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.7)";
  const linkHover = variant === "dark" ? "#fff" : "#000";
  const accent = "var(--accent)";

  if (!ready) {
    return <div style={{ width: 100, height: 14 }} aria-hidden />;
  }

  if (user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Link
          href={PANEL_BY_ROLE[user.role] ?? "/"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            letterSpacing: "0.1em",
            color: linkColor,
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
          onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
        >
          <LayoutDashboard size={13} />
          {panelLabel}
        </Link>
        <form action="/api/auth/logout" method="POST" style={{ display: "inline-flex" }}>
          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "9px 14px",
              background: "transparent",
              color: accent,
              border: "1px solid var(--accent)",
              cursor: "pointer",
            }}
          >
            <LogOut size={12} />
            {logoutLabel}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <Link
        href="/login"
        style={{
          fontSize: 11,
          letterSpacing: "0.1em",
          color: linkColor,
          textDecoration: "none",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = linkHover)}
        onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
      >
        {loginLabel}
      </Link>
      <Link
        href="/register"
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          padding: "9px 18px",
          background: accent,
          color: "#fff",
          textDecoration: "none",
        }}
      >
        {registerLabel}
      </Link>
    </div>
  );
}
