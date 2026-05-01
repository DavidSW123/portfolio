import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutoImport Pro – Importación y Venta de Coches",
  description: "Plataforma profesional de importación y venta de vehículos importados. Coches premium al mejor precio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full theme-gold">
      <body className={`${inter.className} h-full antialiased`}>
        <ThemeProvider>
          {children}
          <ThemeSwitcher />
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
