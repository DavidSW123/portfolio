import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageProvider } from "@/components/language-provider";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "AutoImport Pro – Importación y Venta de Coches",
  description: "Plataforma profesional de importación y venta de vehículos importados. Coches premium al mejor precio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full theme-noche">
      <body className={`${inter.className} h-full antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <ThemeSwitcher />
            <ToastContainer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
