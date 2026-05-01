"use client";
import { useState } from "react";
import { useTheme, type Theme } from "./theme-provider";
import { Palette, Check } from "lucide-react";

const THEMES: { id: Theme; name: string; desc: string; bg: string; accent: string; border: string }[] = [
  {
    id: "theme-noche",
    name: "Noche",
    desc: "Navy oscuro + Naranja",
    bg: "#080d1a",
    accent: "#e8611a",
    border: "#1e2d50",
  },
  {
    id: "theme-plata",
    name: "Plata",
    desc: "Carbono + Plata",
    bg: "#111111",
    accent: "#c0c0c0",
    border: "#333333",
  },
  {
    id: "theme-dia",
    name: "Día",
    desc: "Blanco + Navy + Naranja",
    bg: "#f4f6fb",
    accent: "#e8611a",
    border: "#d0d8ea",
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="rounded-2xl border p-4 shadow-2xl w-72 backdrop-blur-sm"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow), var(--shadow-accent)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
            Seleccionar tema
          </p>
          <div className="space-y-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className="w-full flex items-center gap-3 rounded-xl p-3 transition-all"
                style={{
                  background: theme === t.id ? "var(--accent-subtle)" : "transparent",
                  border: `1px solid ${theme === t.id ? "var(--accent)" : "var(--border)"}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ background: t.bg, border: `2px solid ${t.border}` }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: t.accent, boxShadow: `0 0 8px ${t.accent}80` }}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.desc}</p>
                </div>
                {theme === t.id && (
                  <Check className="h-4 w-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
                )}
              </button>
            ))}
          </div>
          <p className="text-xs mt-3 text-center" style={{ color: "var(--text-subtle)" }}>
            Una vez elegido, eliminamos el selector
          </p>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{
          background: "var(--accent)",
          color: "var(--accent-fg)",
          boxShadow: "var(--shadow-accent)",
        }}
        title="Cambiar tema"
      >
        <Palette className="h-5 w-5" />
      </button>
    </div>
  );
}
