"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "theme-noche" | "theme-plata" | "theme-dia";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "theme-noche",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("theme-noche");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("autoimport-theme") as Theme | null;
    if (saved && ["theme-noche", "theme-plata", "theme-dia"].includes(saved)) {
      setThemeState(saved);
    }
    setMounted(true);
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    localStorage.setItem("autoimport-theme", t);
  }

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("theme-noche", "theme-plata", "theme-dia");
    html.classList.add(theme);
  }, [theme]);

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
