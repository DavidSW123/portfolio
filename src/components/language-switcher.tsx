"use client";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "./language-provider";
import { LOCALES, type Locale } from "@/lib/i18n";
import { ChevronDown } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((l) => l.code === locale)!;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all"
        style={{ color: "var(--text-muted)", background: open ? "var(--bg-surface-2)" : "transparent" }}
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden shadow-2xl z-50"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
        >
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLocale(l.code as Locale); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-all text-left"
              style={{
                background: l.code === locale ? "var(--accent-subtle)" : "transparent",
                color: l.code === locale ? "var(--accent)" : "var(--text-muted)",
                fontWeight: l.code === locale ? 600 : 400,
              }}
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
