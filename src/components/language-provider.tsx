"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { type Locale, type Dict, translations } from "@/lib/i18n";

interface LangContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dict;
}

const LangContext = createContext<LangContextValue>({
  locale: "es",
  setLocale: () => {},
  t: translations.es,
});

export function useLanguage() {
  return useContext(LangContext);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const saved = localStorage.getItem("autoimport-locale") as Locale | null;
    const valid: Locale[] = ["es", "en", "ru", "de", "it", "fr", "zh"];
    if (saved && valid.includes(saved)) setLocaleState(saved);
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem("autoimport-locale", l);
    document.cookie = `locale=${l}; path=/; max-age=31536000`;
  }

  return (
    <LangContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LangContext.Provider>
  );
}
